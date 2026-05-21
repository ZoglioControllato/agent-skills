#!/usr/bin/env node
/**
 * Markdown translation helper: preserves code fences & frontmatter `name:`,
 * applies Controllato Club brand replacements, updates translation-manifest.json.
 *
 * Usage:
 *   node tools/translate-markdown.mjs --file README.md
 *   node tools/translate-markdown.mjs --phase P2 --workstream docs-writer
 *   node tools/translate-markdown.mjs --phase P3 --workstream cf-workers
 *   node tools/translate-markdown.mjs --dry-run --file README.md
 *   node tools/translate-markdown.mjs --stdin   # read PT content from stdin, apply brand + write --file
 */
import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const MANIFEST_PATH = path.join(__dirname, 'translation-manifest.json')

const BRAND_REPLACEMENTS = [
  ['Tech Leads Club', 'Controllato Club'],
  ['TECH LEADS CLUB', 'CONTROLLATO CLUB'],
  ['tech leads club', 'controllato club'],
]

const DESCRIPTION_MARKER_REPLACEMENTS = [
  [/Use when/gi, 'Use quando'],
  [/Do NOT use for/gi, 'NÃO use para'],
  [/Do not use for/gi, 'NÃO use para'],
  [/Triggers on/gi, 'Aciona em'],
  [/Keywords\s*[-–:]/gi, 'Palavras-chave -'],
]

const PROTECTED_SUBSTRINGS = ['@controllato/', 'github.com/agent-skills/', 'agent-skills.github.io']

const PHRASE_MAP = [
  [/\bProcess\b/g, 'Processo'],
  [/\bOverview\b/g, 'Visão geral'],
  [/\bIntroduction\b/g, 'Introdução'],
  [/\bGetting started\b/gi, 'Primeiros passos'],
  [/\bBest practices\b/gi, 'Boas práticas'],
  [/\bTroubleshooting\b/g, 'Solução de problemas'],
  [/\bExamples\b/g, 'Exemplos'],
  [/\bExample\b/g, 'Exemplo'],
]

/** Split markdown into [{type:'fence'|'prose', text}] preserving fenced code blocks. */
export function splitMarkdownFences(content) {
  const parts = []
  const fenceRe = /^(```+|~~~+).*\n[\s\S]*?\n\1\s*$/gm
  let last = 0
  let m
  while ((m = fenceRe.exec(content)) !== null) {
    if (m.index > last) parts.push({ type: 'prose', text: content.slice(last, m.index) })
    parts.push({ type: 'fence', text: m[0] })
    last = m.index + m[0].length
  }
  if (last < content.length) parts.push({ type: 'prose', text: content.slice(last) })
  return parts
}

function isProtectedBrandMatch(text, index, length) {
  for (const sub of PROTECTED_SUBSTRINGS) {
    const start = text.indexOf(sub, Math.max(0, index - sub.length))
    if (start >= 0 && index >= start && index < start + sub.length) return true
  }
  return false
}

/** Apply brand replacements only in prose segments (not inside code fences). */
export function applyBrandReplacements(content) {
  const parts = splitMarkdownFences(content)
  let brandCount = 0
  const out = parts
    .map((p) => {
      if (p.type === 'fence') return p.text
      let text = p.text
      for (const [from, to] of BRAND_REPLACEMENTS) {
        const re = new RegExp(from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')
        text = text.replace(re, (match, offset) => {
          if (isProtectedBrandMatch(text, offset, match.length)) return match
          brandCount++
          return to
        })
      }
      return text
    })
    .join('')
  return { content: out, brandCount }
}

/** Best-effort rule-based prose translation (no external API). */
export function translateProse(content) {
  let text = content
  for (const [re, repl] of PHRASE_MAP) {
    text = text.replace(re, repl)
  }
  return text
}

/** Preserve YAML `name:` field in frontmatter while translating description markers. */
export function normalizeSkillDescriptionMarkers(content) {
  if (!content.startsWith('---\n')) return content
  const end = content.indexOf('\n---\n', 4)
  if (end === -1) return content
  const fm = content.slice(4, end)
  const body = content.slice(end + 5)
  let newFm = fm
  for (const [re, repl] of DESCRIPTION_MARKER_REPLACEMENTS) {
    newFm = newFm.replace(re, repl)
  }
  return `---\n${newFm}\n---\n${body}`
}

export function countBrandInProse(content) {
  return applyBrandReplacements(content).brandCount
}

async function loadManifest() {
  const raw = await readFile(MANIFEST_PATH, 'utf8')
  return JSON.parse(raw)
}

async function saveManifest(manifest) {
  await writeFile(MANIFEST_PATH, `${JSON.stringify(manifest, null, 2)}\n`)
}

function parseArgs(argv) {
  const opts = {
    files: [],
    phase: null,
    workstream: null,
    dryRun: false,
    stdin: false,
    translate: false,
    markDone: true,
  }
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i]
    if (a === '--file') opts.files.push(argv[++i])
    else if (a === '--phase') opts.phase = argv[++i]
    else if (a === '--workstream') opts.workstream = argv[++i]
    else if (a === '--dry-run') opts.dryRun = true
    else if (a === '--stdin') opts.stdin = true
    else if (a === '--translate') opts.translate = true
    else if (a === '--no-mark-done') opts.markDone = false
    else if (a === '--help') opts.help = true
  }
  return opts
}

async function resolveFiles(opts, manifest) {
  if (opts.files.length) return opts.files
  return manifest.entries
    .filter((e) => {
      if (opts.phase && e.phase !== opts.phase) return false
      if (opts.workstream && e.workstream !== opts.workstream) return false
      return e.status !== 'done'
    })
    .map((e) => e.path)
}

async function processFile(relPath, { dryRun, stdin, markDone, translate }, manifest) {
  const abs = path.join(ROOT, relPath)
  let content = stdin ? await readStdin() : await readFile(abs, 'utf8')
  if (relPath.endsWith('SKILL.md')) content = normalizeSkillDescriptionMarkers(content)
  if (translate) {
    const parts = splitMarkdownFences(content).map((p) => (p.type === 'fence' ? p.text : translateProse(p.text)))
    content = parts.join('')
  }
  const { content: branded, brandCount } = applyBrandReplacements(content)

  if (dryRun) {
    console.log(`${relPath}: would replace ${brandCount} brand occurrence(s)`)
    return { relPath, brandCount, written: false }
  }

  await writeFile(abs, branded, 'utf8')
  if (markDone && manifest) {
    const entry = manifest.entries.find((e) => e.path === relPath)
    if (entry) entry.status = 'done'
  }
  console.log(`${relPath}: wrote (${brandCount} brand replacements)`)
  return { relPath, brandCount, written: true }
}

function readStdin() {
  return new Promise((resolve, reject) => {
    let data = ''
    process.stdin.setEncoding('utf8')
    process.stdin.on('data', (c) => (data += c))
    process.stdin.on('end', () => resolve(data))
    process.stdin.on('error', reject)
  })
}

async function main() {
  const opts = parseArgs(process.argv)
  if (opts.help) {
    console.log(
      `Usage: node tools/translate-markdown.mjs [--file PATH] [--phase P1|P2|P3] [--workstream WS] [--dry-run] [--translate] [--stdin]`,
    )
    process.exit(0)
  }

  let manifest = null
  try {
    manifest = await loadManifest()
  } catch {
    /* manifest optional for single --file without status */
  }

  const files = manifest ? await resolveFiles(opts, manifest) : opts.files
  if (!files.length) {
    console.error('No files matched.')
    process.exit(1)
  }

  let totalBrand = 0
  for (const rel of files) {
    const r = await processFile(rel, opts, manifest)
    totalBrand += r.brandCount
  }

  if (manifest && opts.markDone && !opts.dryRun) await saveManifest(manifest)
  console.log(`Processed ${files.length} file(s), ${totalBrand} brand replacement(s).`)
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
if (isMain)
  main().catch((e) => {
    console.error(e)
    process.exit(1)
  })
