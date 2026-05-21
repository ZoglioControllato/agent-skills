#!/usr/bin/env node
/**
 * Batch-translate markdown to pt-BR via MyMemory API (free, rate-limited).
 * Preserves code fences; updates translation-manifest.json.
 */
import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { applyBrandReplacements, normalizeSkillDescriptionMarkers, splitMarkdownFences } from './translate-markdown.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const MANIFEST_PATH = path.join(__dirname, 'translation-manifest.json')

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function translateChunk(text) {
  if (!text.trim()) return text
  const max = 450
  if (text.length <= max) {
    const t = await translateOnce(text)
    await sleep(200)
    return t
  }

  const segments = []
  const paras = text.split(/\n\n/)
  let buf = ''
  for (const p of paras) {
    if (p.length > max) {
      if (buf.trim()) segments.push(buf)
      buf = ''
      for (let i = 0; i < p.length; i += max) segments.push(p.slice(i, i + max))
      continue
    }
    if (buf.length + p.length + 2 > max && buf.trim()) {
      segments.push(buf)
      buf = ''
    }
    buf += (buf ? '\n\n' : '') + p
  }
  if (buf.trim()) segments.push(buf)

  const out = []
  for (const seg of segments) {
    if (seg.length <= max) {
      out.push(await translateOnce(seg))
    } else {
      for (let i = 0; i < seg.length; i += max) {
        out.push(await translateOnce(seg.slice(i, i + max)))
        await sleep(200)
      }
    }
    await sleep(200)
  }
  return out.join('\n\n')
}

/** YAML frontmatter (inner, without delimiters) + markdown body */
function splitSkillMdFrontmatter(content) {
  if (!content.startsWith('---\n')) return null
  const mid = content.indexOf('\n---\n', 4)
  if (mid === -1) return null
  return { fmInner: content.slice(4, mid), body: content.slice(mid + 5) }
}

/** Translate display fields in rule/reference YAML; never touch `name:`, `impact:`, `tags:`. */
async function translateRuleFrontmatter(fmInner) {
  const lines = fmInner.split('\n')
  const out = []
  for (const line of lines) {
    const m = line.match(/^(\s*)([a-zA-Z0-9_-]+):\s*(.*)$/)
    if (!m) {
      out.push(line)
      continue
    }
    const [, indent, key, val] = m
    if (key === 'name' || key === 'impact' || key === 'tags') {
      out.push(line)
      continue
    }
    if (key === 'title' || key === 'impactDescription') {
      const trimmed = val.trim()
      if (!trimmed) {
        out.push(line)
        continue
      }
      const t = await translateChunk(trimmed)
      out.push(`${indent}${key}: ${t}`)
      continue
    }
    out.push(line)
  }
  return out.join('\n')
}

async function translateYamlDescriptionLine(fmInner) {
  const lines = fmInner.split('\n')
  const idx = lines.findIndex((l) => l.trimStart().startsWith('description:'))
  if (idx === -1) return fmInner

  const raw = lines[idx]
  const m = raw.match(/^(description:\s*)"(.+)"\s*$/)
  if (!m) return fmInner

  let inner = await translateChunk(m[2])
  inner = polishGtmSkillDescription(inner)
  const escaped = inner.replace(/\\/g, '\\\\').replace(/"/g, '\\"')
  lines[idx] = `${m[1]}"${escaped}"`
  return lines.join('\n')
}

/**
 * Normalize common EN→PT remnants in skill descriptions toward repo convention
 * ("Use quando" / "Também use quando..." / "NÃO use para").
 */
function polishGtmSkillDescription(s) {
  return s
    .replace(/\s+/g, ' ')
    .replace(/\bAlso use when the user\b/gi, 'Também use quando o usuário')
    .replace(/\bAlso use when\b/gi, 'Também use quando')
    .replace(/\bWhen the user wants\b/gi, 'Use quando o usuário quiser')
    .replace(/\bWhen the user asks\b/gi, 'Use quando o usuário pedir')
    .replace(/\bWhen the user mentions\b/gi, 'Use quando mencionar')
    .replace(/\bWhen the user\b/gi, 'Use quando o usuário')
    .replace(/\bDo NOT use for\b/gi, 'NÃO use para')
    .replace(/\bDo not use for\b/gi, 'NÃO use para')
    .trim()
}

/** Machine translation sometimes drops the newline before a fence after bold labels. */
function fixMarkdownBoldFenceSpacing(s) {
  let out = s.replace(/:\*\*(\s*)(```)/g, ':**\n\n$2')
  out = out.replace(/\*\*(\s*)(```)/g, '**\n\n$2')
  out = out.replace(/```\n(\*\*)/g, '```\n\n$1')
  return out
}

/** Unofficial Google endpoint; reliable when MyMemory quota / Lingva are unavailable. */
async function translateOnceGtx(text) {
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=pt&dt=t&q=${encodeURIComponent(text)}`
  const res = await fetch(url, { signal: AbortSignal.timeout(45000) })
  if (!res.ok) throw new Error(`gtx http ${res.status}`)
  const data = await res.json()
  let out = ''
  for (const part of data[0] ?? []) {
    if (part?.[0]) out += part[0]
  }
  const t = out.trim()
  if (!t) throw new Error('gtx empty')
  return t
}

async function translateOnce(text) {
  for (let attempt = 0; attempt < 4; attempt++) {
    try {
      return await translateOnceGtx(text)
    } catch {
      /* fall through */
    }

    try {
      const lingva = `https://lingva.ml/api/v1/en/pt/${encodeURIComponent(text)}`
      const res = await fetch(lingva, { signal: AbortSignal.timeout(20000) })
      if (res.ok) {
        const data = await res.json()
        if (data.translation) return data.translation
      }
    } catch {
      /* try mymemory */
    }

    try {
      const mm = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|pt`
      const res = await fetch(mm)
      const data = await res.json()
      const tr = data.responseData?.translatedText
      if (data.responseStatus === 200 && tr && !String(tr).includes('MYMEMORY WARNING')) {
        return tr
      }
    } catch {
      /* retry */
    }

    await sleep(2000 * (attempt + 1))
  }
  throw new Error('translate failed after retries')
}

async function translateFile(relPath) {
  const abs = path.join(ROOT, relPath)
  const original = await readFile(abs, 'utf8')
  let prefix = ''
  let body = original

  if (relPath.endsWith('SKILL.md')) {
    const spl = splitSkillMdFrontmatter(original)
    if (spl) {
      const translatedFmInnerRaw = await translateYamlDescriptionLine(spl.fmInner)
      const fmFinalBlock = normalizeSkillDescriptionMarkers(`---\n${translatedFmInnerRaw}\n---\nm`)
      const fmFinal = fmFinalBlock.slice(4, fmFinalBlock.indexOf('\n---\n', 4))
      prefix = `---\n${fmFinal}\n---\n`
      body = spl.body
    } else {
      body = normalizeSkillDescriptionMarkers(original)
    }
  } else {
    const spl = splitSkillMdFrontmatter(original)
    if (spl) {
      const newFm = await translateRuleFrontmatter(spl.fmInner)
      prefix = `---\n${newFm}\n---\n`
      body = spl.body
    }
  }

  const parts = splitMarkdownFences(body)
  const translated = []
  for (const p of parts) {
    if (p.type === 'fence') translated.push(p.text)
    else {
      translated.push(await translateChunk(p.text))
      await sleep(300)
    }
  }
  let merged = prefix + translated.join('')
  merged = fixMarkdownBoldFenceSpacing(merged)
  const { content: branded } = applyBrandReplacements(merged)
  await writeFile(abs, branded, 'utf8')
}

function parseArgs() {
  const opts = { phase: null, workstream: null, files: [], limit: 0, dryRun: false, excludeSkills: [] }
  for (let i = 2; i < process.argv.length; i++) {
    const a = process.argv[i]
    if (a === '--phase') opts.phase = process.argv[++i]
    else if (a === '--workstream') opts.workstream = process.argv[++i]
    else if (a === '--file') opts.files.push(process.argv[++i])
    else if (a === '--limit') opts.limit = Number(process.argv[++i])
    else if (a === '--dry-run') opts.dryRun = true
    else if (a === '--exclude-skill') opts.excludeSkills.push(process.argv[++i])
  }
  return opts
}

async function main() {
  const opts = parseArgs()
  const manifest = JSON.parse(await readFile(MANIFEST_PATH, 'utf8'))
  let paths = opts.files.length
    ? opts.files
    : manifest.entries
        .filter(
          (e) =>
            e.status !== 'done' &&
            (!opts.phase || e.phase === opts.phase) &&
            (!opts.workstream || e.workstream === opts.workstream) &&
            (!opts.excludeSkills.length || !opts.excludeSkills.includes(e.skill)),
        )
        .map((e) => e.path)

  if (opts.limit) paths = paths.slice(0, opts.limit)

  console.log(`Translating ${paths.length} file(s)...`)
  let ok = 0
  let fail = 0
  for (let i = 0; i < paths.length; i++) {
    const rel = paths[i]
    if (opts.dryRun) {
      console.log(`  [${i + 1}/${paths.length}] ${rel}`)
      continue
    }
    try {
      await translateFile(rel)
      const entry = manifest.entries.find((e) => e.path === rel)
      if (entry) entry.status = 'done'
      ok++
      console.log(`  [${i + 1}/${paths.length}] OK ${rel}`)
    } catch (err) {
      fail++
      console.error(`  [${i + 1}/${paths.length}] FAIL ${rel}: ${err.message}`)
    }
  }

  if (!opts.dryRun) await writeFile(MANIFEST_PATH, `${JSON.stringify(manifest, null, 2)}\n`)
  console.log(`Finished: ${ok} ok, ${fail} failed`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
