#!/usr/bin/env node
/**
 * Batch-translate markdown files listed in a paths file (PT-BR via google-translate-api-x).
 * - Preserves technical fenced blocks (ts, sql, bash, json, …).
 * - Translates prose and plain/text fences.
 * - SKILL.md: preserves frontmatter `name:` line exactly.
 * - Applies normalizeSkillDescriptionMarkers + applyBrandReplacements from translate-markdown.mjs.
 * - Updates translation-manifest.json entries to done.
 *
 * Requires a one-off install:
 *   mkdir -p /tmp/gtxtest && cd /tmp/gtxtest && npm init -y && npm install google-translate-api-x@10.7.2
 * Env:
 *   TRANSLATE_DELAY_MS (default 120) — pause between API chunks
 *   FORCE_TRANSLATE_PROSE=1 — translate every prose segment (second pass; use sparingly)
 * Usage: node tools/batch-translate-remaining.mjs [/tmp/remaining-translate.txt]
 */
import { readFile, writeFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { applyBrandReplacements, normalizeSkillDescriptionMarkers, splitMarkdownFences } from './translate-markdown.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const MANIFEST_PATH = path.join(__dirname, 'translation-manifest.json')
const GTX_MODULE = '/tmp/gtxtest/node_modules/google-translate-api-x/index.cjs'

const require = createRequire(import.meta.url)
const translate = require(GTX_MODULE)

const SKIP_FENCE_LANG = new Set([
  'ts',
  'tsx',
  'typescript',
  'javascript',
  'js',
  'jsx',
  'json',
  'jsonc',
  'yaml',
  'yml',
  'bash',
  'sh',
  'shell',
  'zsh',
  'sql',
  'curl',
  'html',
  'xml',
  'css',
  'scss',
  'less',
  'dockerfile',
  'nginx',
  'toml',
  'ini',
  'graphql',
  'protobuf',
  'proto',
  'java',
  'kotlin',
  'swift',
  'go',
  'rust',
  'ruby',
  'python',
  'py',
  'php',
  'cpp',
  'c',
  'csharp',
  'cs',
  'mermaid',
  'plantuml',
  'vue',
  'svelte',
  'md',
  'markdown',
  'diff',
])

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms))
}

function openingFenceInfo(fenceText) {
  const m = fenceText.match(/^(`{3,}|~{3,})([^\n]*)\n/)
  if (!m) return { opener: '`', lang: '', rawFirst: '' }
  const tag = m[2].trim().split(/\s+/)[0] || ''
  const lang = tag.toLowerCase().replace(/^\.?/, '')
  return { opener: m[1][0], lang, rawFirst: m[2] }
}

function shouldTranslateFence(fenceText) {
  const { lang } = openingFenceInfo(fenceText)
  if (SKIP_FENCE_LANG.has(lang)) return false
  // ```text, diagram, ascii, plain — translate
  return true
}

function stripFenceWrapper(fenceText) {
  const lines = fenceText.split('\n')
  if (lines.length < 2) return fenceText
  const close = lines[lines.length - 1].trim()
  const inner = lines.slice(1, -1).join('\n')
  return inner
}

function wrapFence(originalFence, innerTranslated) {
  const lines = originalFence.split('\n')
  const first = lines[0]
  const last = lines[lines.length - 1]
  return `${first}\n${innerTranslated}\n${last}`
}

function proseLooksEnglish(text) {
  const s = text.slice(0, 3500).toLowerCase()
  const en = (
    s.match(
      /\b(the|and|for|with|when|this|that|from|you|are|need|use|will|can|should|must|into|your|how|what|why)\b/g,
    ) || []
  ).length
  const pt = (s.match(/\b(quando|não|para|com|você|sobre|este|esta|isso|como|qual|também|apenas)\b/g) || []).length
  return en > pt + 2
}

async function translatePlain(text, delayMs) {
  const chunkSize = 4200
  const parts = []
  let rest = text
  while (rest.length > chunkSize) {
    let cut = rest.lastIndexOf('\n\n', chunkSize)
    if (cut < 800) cut = chunkSize
    parts.push(rest.slice(0, cut))
    rest = rest.slice(cut).trimStart()
  }
  if (rest) parts.push(rest)
  const out = []
  for (const p of parts) {
    if (!p.trim()) {
      out.push(p)
      continue
    }
    const r = await translate(p, { from: 'en', to: 'pt', forceTo: true })
    out.push(r.text)
    await sleep(delayMs)
  }
  return out.join('\n\n')
}

async function translateMarkdownBody(body, { delayMs, forceProse }) {
  const parts = splitMarkdownFences(body)
  const chunks = []
  for (const p of parts) {
    if (p.type === 'fence' && !shouldTranslateFence(p.text)) {
      chunks.push(p.text)
      continue
    }
    if (p.type === 'fence') {
      const inner = stripFenceWrapper(p.text)
      if (!inner.trim() || (!forceProse && !proseLooksEnglish(inner))) {
        chunks.push(p.text)
        continue
      }
      const t = await translatePlain(inner, delayMs)
      chunks.push(wrapFence(p.text, t))
      continue
    }
    // prose
    if (!p.text.trim()) {
      chunks.push(p.text)
      continue
    }
    if (!forceProse && !proseLooksEnglish(p.text)) {
      chunks.push(p.text)
      continue
    }
    chunks.push(await translatePlain(p.text, delayMs))
  }
  return chunks.join('')
}

async function translateSkillMd(content, opts) {
  if (!content.startsWith('---\n')) return translateMarkdownBody(content, opts)
  const end = content.indexOf('\n---\n', 4)
  if (end === -1) return translateMarkdownBody(content, opts)
  let fm = content.slice(4, end)
  const body = content.slice(end + 5)
  const nameMatch = fm.match(/^name:\s*.+$/m)
  let nameLine = null
  if (nameMatch) {
    nameLine = nameMatch[0]
    fm = fm.replace(/^name:\s*.+$/m, 'name: __SKILL_NAME_PLACEHOLDER__')
  }
  let fmOut = fm
  if (fm.trim() && proseLooksEnglish(fm)) {
    fmOut = await translatePlain(fm, opts.delayMs)
  }
  if (nameLine) fmOut = fmOut.replace(/^name:\s*__SKILL_NAME_PLACEHOLDER__$/m, nameLine)
  const bodyOut = await translateMarkdownBody(body, opts)
  return `---\n${fmOut}\n---\n${bodyOut}`
}

async function loadManifest() {
  const raw = await readFile(MANIFEST_PATH, 'utf8')
  return JSON.parse(raw)
}

async function saveManifest(manifest) {
  await writeFile(MANIFEST_PATH, `${JSON.stringify(manifest, null, 2)}\n`)
}

async function main() {
  const listPath = process.argv[2] || '/tmp/remaining-translate.txt'
  const delayMs = Number(process.env.TRANSLATE_DELAY_MS || '120')
  const forceProse = process.env.FORCE_TRANSLATE_PROSE === '1'
  const pathsRaw = await readFile(listPath, 'utf8')
  const relPaths = pathsRaw
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)

  const manifest = await loadManifest()
  const failed = []
  let completed = 0

  for (const rel of relPaths) {
    const abs = path.join(ROOT, rel)
    try {
      let content = await readFile(abs, 'utf8')
      let out
      if (rel.endsWith('SKILL.md')) {
        out = await translateSkillMd(content, { delayMs, forceProse })
        out = normalizeSkillDescriptionMarkers(out)
      } else {
        out = await translateMarkdownBody(content, { delayMs, forceProse })
      }
      out = out.replace(/(\*\*[^\n]+\*\*)```/g, '$1\n\n```')
      const { content: branded } = applyBrandReplacements(out)
      await writeFile(abs, branded, 'utf8')
      const entry = manifest.entries.find((e) => e.path === rel)
      if (entry) entry.status = 'done'
      completed++
      console.error(`OK ${rel}`)
    } catch (e) {
      console.error(`FAIL ${rel}`, e.message || e)
      failed.push(rel)
    }
  }

  await saveManifest(manifest)
  console.log(JSON.stringify({ completed, failed, total: relPaths.length }))
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
