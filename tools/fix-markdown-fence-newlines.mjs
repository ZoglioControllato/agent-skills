#!/usr/bin/env node
/**
 * Fix merged bold + fence (e.g. **text**```typescript) introduced by some translation flows.
 */
import { readdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')

const roots = [
  'packages/skills-catalog/skills/(cloud)/cloudflare-deploy',
  'packages/skills-catalog/skills/(performance)',
  'packages/skills-catalog/skills/(quality)/react-best-practices',
]

const RE = /(\*\*[^\n]+\*\*)```/g

async function walkMarkdownFiles(dir) {
  const out = []
  for (const ent of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name)
    if (ent.isDirectory()) out.push(...(await walkMarkdownFiles(p)))
    else if (ent.name.endsWith('.md')) out.push(p)
  }
  return out
}

async function main() {
  let fixed = 0
  for (const r of roots) {
    const files = await walkMarkdownFiles(path.join(ROOT, r))
    for (const abs of files) {
      let s = await readFile(abs, 'utf8')
      const next = s.replace(RE, '$1\n\n```')
      if (next !== s) {
        await writeFile(abs, next, 'utf8')
        fixed++
      }
    }
  }
  console.error(`Fixed fence newlines in ${fixed} file(s)`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
