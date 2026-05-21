#!/usr/bin/env node
/** Mark manifest entries done when files look translated (PT skill markers or no TLC in prose). */
import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { applyBrandReplacements, splitMarkdownFences } from './translate-markdown.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const MANIFEST = path.join(__dirname, 'translation-manifest.json')

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
  // heuristic: common PT words in technical docs
  return /\b(quando|não|para|documentação|configuração|processo|arquivo)\b/i.test(prose)
}

async function main() {
  const manifest = JSON.parse(await readFile(MANIFEST, 'utf8'))
  let updated = 0
  for (const entry of manifest.entries) {
    if (entry.status === 'done') continue
    const abs = path.join(ROOT, entry.path)
    let content
    try {
      content = await readFile(abs, 'utf8')
    } catch {
      continue
    }
    if (looksTranslated(entry.path, content)) {
      const { content: branded } = applyBrandReplacements(content)
      if (branded !== content) await writeFile(abs, branded, 'utf8')
      entry.status = 'done'
      updated++
    }
  }
  await writeFile(MANIFEST, `${JSON.stringify(manifest, null, 2)}\n`)
  const done = manifest.entries.filter((e) => e.status === 'done').length
  console.log(`Synced ${updated} entries; total done: ${done}/${manifest.entries.length}`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
