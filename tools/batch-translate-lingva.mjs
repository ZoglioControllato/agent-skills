#!/usr/bin/env node
/**
 * Translates EN prose to pt-BR (Google `gtx` endpoint), preserving code fences.
 * Placeholders protect URLs and package scopes during translation.
 */
import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
/** @see public gtx client used by many OSS tools; chunk to avoid URL limits */
const GTX = 'https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=pt&dt=t'
const CHUNK = 1800
const DELAY_MS = 150

async function gtxTranslate(q) {
  const params = new URLSearchParams({ q })
  const url = `${GTX}&${params.toString()}`
  if (url.length > 12000) return null
  const res = await fetch(url, { headers: { Accept: 'application/json' } })
  if (!res.ok) throw new Error(`GTX HTTP ${res.status}`)
  const data = await res.json()
  if (!Array.isArray(data?.[0])) throw new Error('Bad GTX response')
  return data[0].map((row) => row[0]).join('')
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

function splitByFences(content) {
  const re = /(```[\s\S]*?```|~~~[\s\S]*?~~~)/g
  return content.split(re).map((text, i) => ({
    fence: i % 2 === 1,
    text,
  }))
}

function protectTechnical(s) {
  const urls = []
  let out = s.replace(/https?:\/\/[^\s\])>'"`]+/gi, (m) => {
    urls.push(m)
    return `⟦URL${urls.length - 1}⟧`
  })
  const pkgs = []
  out = out.replace(/\b@[a-z0-9-]+\/[a-z0-9-._]+\b/gi, (m) => {
    pkgs.push(m)
    return `⟦PKG${pkgs.length - 1}⟧`
  })
  return { text: out, urls, pkgs }
}

function unprotect(s, urls, pkgs) {
  let out = s
  pkgs.forEach((p, i) => {
    out = out.split(`⟦PKG${i}⟧`).join(p)
  })
  urls.forEach((u, i) => {
    out = out.split(`⟦URL${i}⟧`).join(u)
  })
  return out
}

function looksPortuguese(text) {
  if (text.length < 40) return false
  const lower = text.toLowerCase()
  const ptHits = (lower.match(/\b(não|você|para|como|também|já|mais|isso|ações|guia|referência|configuração)\b/g) || [])
    .length
  const enHits = (lower.match(/\b(the|and|for|with|this|that|should|will|when|allows|example)\b/g) || []).length
  return ptHits >= 3 && ptHits >= enHits
}

function applyBrandProse(s) {
  return s
    .replace(/\bTech Leads Club\b/g, 'Controllato Club')
    .replace(/\bTECH LEADS CLUB\b/g, 'CONTROLLATO CLUB')
    .replace(/\btech leads club\b/gi, 'controllato club')
}

async function translatePlain(trimmed) {
  async function inner(t) {
    const { text, urls, pkgs } = protectTechnical(t)
    let tr = await gtxTranslate(text)
    if (tr === null) {
      const mid = Math.floor(t.length / 2)
      let cut = t.lastIndexOf('\n\n', mid + 400)
      if (cut < mid * 0.4) cut = t.indexOf('\n\n', mid)
      if (cut < 0) cut = mid
      const a = await inner(t.slice(0, cut))
      await sleep(DELAY_MS)
      const b = await inner(t.slice(cut))
      return a + b
    }
    return unprotect(tr.trimEnd(), urls, pkgs)
  }
  return inner(trimmed)
}

async function translateChunk(raw) {
  const trimmed = raw.trim()
  if (!trimmed) return raw
  const tr = await translatePlain(trimmed)
  const pad = raw.startsWith(' ') ? ' ' : ''
  return pad + tr + (raw.endsWith('\n') && !tr.endsWith('\n') ? '\n' : '')
}

async function translateProseSegment(segment) {
  if (!segment.trim()) return segment

  const nameLines = []
  let work = segment.replace(/^name:\s*.+$/gm, (line) => {
    nameLines.push(line)
    return `<<<NAME${nameLines.length - 1}>>>`
  })

  if (looksPortuguese(work)) {
    let s = applyBrandProse(work)
    nameLines.forEach((line, i) => {
      s = s.split(`<<<NAME${i}>>>`).join(line)
    })
    return s
  }

  let out = ''
  let rest = work
  while (rest.length > 0) {
    let take = rest.slice(0, CHUNK)
    if (rest.length > CHUNK) {
      const lastNl = take.lastIndexOf('\n')
      const lastSp = take.lastIndexOf('. ')
      const cut = Math.max(lastNl, lastSp)
      if (cut > CHUNK * 0.5) take = rest.slice(0, cut + 1)
    }
    const piece = take
    rest = rest.slice(piece.length)
    out += await translateChunk(piece)
    if (rest.length) await sleep(DELAY_MS)
  }

  let branded = applyBrandProse(out)
  nameLines.forEach((line, i) => {
    branded = branded.split(`<<<NAME${i}>>>`).join(line)
  })
  return branded
}

function normalizeSkillDescriptionMarkers(content) {
  if (!content.startsWith('---\n')) return content
  const end = content.indexOf('\n---\n', 4)
  if (end === -1) return content
  const fm = content.slice(4, end)
  const body = content.slice(end + 5)
  let newFm = fm
    .replace(/\bUse when\b/gi, 'Use quando')
    .replace(/\bDo NOT use for\b/gi, 'NÃO use para')
    .replace(/\bDo not use for\b/gi, 'NÃO use para')
    .replace(/\bTriggers on\b/gi, 'Aciona em')
  return `---\n${newFm}\n---\n${body}`
}

async function processFile(absPath, relPath) {
  let content = await readFile(absPath, 'utf8')
  if (relPath.endsWith('SKILL.md')) content = normalizeSkillDescriptionMarkers(content)

  const parts = splitByFences(content)
  const out = []
  for (const { fence, text } of parts) {
    if (fence) out.push(text)
    else out.push(await translateProseSegment(text))
  }
  return out.join('')
}

async function main() {
  const listPath = process.argv[2]
  const manifestPath = path.join(__dirname, 'translation-manifest.json')
  if (!listPath) {
    console.error('Usage: batch-translate-lingva.mjs <paths-file>')
    process.exit(1)
  }
  const listRaw = await readFile(listPath, 'utf8')
  const paths = listRaw
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)

  let manifest = JSON.parse(await readFile(manifestPath, 'utf8'))
  const failures = []
  let completed = 0

  for (const rel of paths) {
    const abs = path.join(ROOT, rel)
    try {
      const translated = await processFile(abs, rel)
      await writeFile(abs, translated, 'utf8')
      const entry = manifest.entries.find((e) => e.path === rel)
      if (entry) entry.status = 'done'
      completed++
      console.error(`OK ${rel}`)
    } catch (e) {
      console.error(`FAIL ${rel}: ${e.message}`)
      failures.push({ path: rel, error: e.message })
    }
    await sleep(DELAY_MS)
  }

  await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`)
  console.log(JSON.stringify({ completed, failures, total: paths.length }, null, 2))
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
