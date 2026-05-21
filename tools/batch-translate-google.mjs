#!/usr/bin/env node
/**
 * Fast batch translation via @vitalets/google-translate-api (unofficial Google Translate).
 */
import { readFile, writeFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { applyBrandReplacements, normalizeSkillDescriptionMarkers, splitMarkdownFences } from './translate-markdown.mjs'

const require = createRequire(path.join(path.dirname(fileURLToPath(import.meta.url)), 'package.json'))
const { translate } = require('/tmp/node_modules/@vitalets/google-translate-api')

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const MANIFEST_PATH = path.join(__dirname, 'translation-manifest.json')

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

function proseOnly(content) {
  return splitMarkdownFences(content)
    .filter((p) => p.type === 'prose')
    .map((p) => p.text)
    .join('\n')
}

function looksTranslated(relPath, content) {
  if (relPath === 'CONTRIBUTING.md') {
    return /Contribuindo|Use quando|NÃO use para/i.test(content)
  }
  if (relPath.endsWith('SKILL.md')) {
    const fm = content.match(/^---\n([\s\S]*?)\n---/)
    const block = fm?.[1] ?? ''
    return /use quando|não use para|aciona em/i.test(block)
  }
  const prose = proseOnly(content)
  if (prose.includes('Tech Leads Club')) return false
  return /\b(quando|não|para|documentação|configuração|referência|processo)\b/i.test(prose)
}

async function translateText(text) {
  if (!text.trim()) return text
  const max = 4500
  const chunks =
    text.length <= max
      ? [text]
      : Array.from({ length: Math.ceil(text.length / max) }, (_, i) => text.slice(i * max, (i + 1) * max))
  const parts = []
  for (const chunk of chunks) {
    for (let attempt = 0; attempt < 6; attempt++) {
      try {
        const { text: t } = await translate(chunk, { to: 'pt' })
        parts.push(t)
        break
      } catch (err) {
        if (String(err.message).includes('Too Many') || String(err).includes('429')) {
          await sleep(8000 * (attempt + 1))
          continue
        }
        throw err
      }
    }
    await sleep(Number(process.env.TRANSLATE_CHUNK_MS ?? 400))
  }
  return parts.join('')
}

async function translateFile(relPath) {
  const abs = path.join(ROOT, relPath)
  let content = await readFile(abs, 'utf8')
  if (looksTranslated(relPath, content)) {
    const { content: branded } = applyBrandReplacements(
      relPath.endsWith('SKILL.md') ? normalizeSkillDescriptionMarkers(content) : content,
    )
    if (branded !== content) await writeFile(abs, branded, 'utf8')
    return 'skipped'
  }
  if (relPath.endsWith('SKILL.md')) content = normalizeSkillDescriptionMarkers(content)

  const pieces = []
  for (const p of splitMarkdownFences(content)) {
    if (p.type === 'fence') pieces.push(p.text)
    else pieces.push(await translateText(p.text))
  }
  const { content: branded } = applyBrandReplacements(pieces.join(''))
  await writeFile(abs, branded, 'utf8')
}

function parseArgs() {
  const opts = { phase: null, workstream: null, files: [], limit: 0, offset: 0 }
  for (let i = 2; i < process.argv.length; i++) {
    const a = process.argv[i]
    if (a === '--phase') opts.phase = process.argv[++i]
    else if (a === '--workstream') opts.workstream = process.argv[++i]
    else if (a === '--file') opts.files.push(process.argv[++i])
    else if (a === '--limit') opts.limit = Number(process.argv[++i])
    else if (a === '--offset') opts.offset = Number(process.argv[++i])
  }
  return opts
}

async function main() {
  const opts = parseArgs()
  const manifest = JSON.parse(await readFile(MANIFEST_PATH, 'utf8'))
  let paths = opts.files.length ? opts.files : manifest.entries.filter((e) => e.status !== 'done').map((e) => e.path)

  if (opts.phase) paths = paths.filter((p) => manifest.entries.find((e) => e.path === p)?.phase === opts.phase)
  if (opts.workstream) {
    paths = paths.filter((p) => manifest.entries.find((e) => e.path === p)?.workstream === opts.workstream)
  }
  paths = paths.slice(opts.offset, opts.limit ? opts.offset + opts.limit : undefined)

  console.log(`Google-translate ${paths.length} files...`)
  let ok = 0
  let fail = 0
  for (let i = 0; i < paths.length; i++) {
    const rel = paths[i]
    try {
      const result = await translateFile(rel)
      const entry = manifest.entries.find((e) => e.path === rel)
      if (entry) entry.status = 'done'
      if (result === 'skipped') ok++
      else ok++
      if ((i + 1) % 5 === 0) console.log(`  progress ${i + 1}/${paths.length}`)
    } catch (err) {
      fail++
      console.error(`  FAIL ${rel}: ${err.message}`)
      await sleep(2000)
    }
    await sleep(Number(process.env.TRANSLATE_FILE_MS ?? 2500))
  }
  if (process.env.TRANSLATE_SKIP_MANIFEST !== '1') {
    await writeFile(MANIFEST_PATH, `${JSON.stringify(manifest, null, 2)}\n`)
  }
  console.log(`Done: ${ok} ok, ${fail} fail`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
