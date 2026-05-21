#!/usr/bin/env node
/**
 * Post-processes machine-translated markdown: restore newlines after fences,
 * normalize rule frontmatter keys, fix common EN tech mistranslations.
 */
import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')

async function fixFile(absPath) {
  let s = await readFile(absPath, 'utf8')

  // Rule / template frontmatter keys (must stay English for tooling)
  if (s.startsWith('---\n')) {
    const end = s.indexOf('\n---\n', 4)
    if (end !== -1) {
      let fm = s.slice(4, end)
      fm = fm
        .replace(/^título:/gm, 'title:')
        .replace(/^impacto:/gm, 'impact:')
        .replace(/^impactoDescrição:/gm, 'impactDescription:')
        .replace(/^descrição do impacto:/gm, 'impactDescription:')
      s = `---\n${fm}\n---\n${s.slice(end + 5)}`
    }
  }

  // Heading: missing space after ##
  s = s.replace(/^(#{1,6})([^\s#])/gm, '$1 $2')

  // Closing fence glued to heading or heading word (###Python, ##Coalescer...)
  s = s.replace(/```\n*(#{1,6})([^\n`]+)/g, (m, hashes, rest) => {
    const t = rest.trimStart()
    const spacer = /^[A-Za-zÀ-ÿ*]/.test(t) && !rest.startsWith(' ') ? ' ' : ''
    return `\`\`\`\n\n${hashes}${spacer}${rest.replace(/^\s*/, '')}`
  })
  // e.g. ```Referência (prose line after fence)
  s = s.replace(/```(Referência)/g, '```\n\n$1')
  // Heading run into opening fence (e.g. ## TypeScript```ts)
  s = s.replace(/(#{1,6}\s[^\n]+)```/g, '$1\n\n```')
  s = s.replace(/```(\*\*)/g, '```\n\n$1')

  // ###Word -> ### Word
  s = s.replace(/^(#{3,6})([A-Za-zÀ-ÿÁÉÍÓÚÂÊÔÃÕÇ])/gm, '$1 $2')

  // Tech glossary (PT-BR prose; language names stay in English)
  const gloss = [
    [/\bDatilografado\b/g, 'TypeScript'],
    [/\bPíton\b/g, 'Python'],
    [/\bPitão\b/g, 'Python'],
    [/\bDigitado\b/g, 'TypeScript'],
    [/^### Ir\b/gm, '### Go'],
    [/^## Ir\b/gm, '## Go'],
    [/\bVá SDK\b/g, 'Go SDK'],
    [/\|\s*Vá\s*\|/g, '| Go |'],
    [/^##curl\b/gm, '## cURL'],
    [/\bTrabalhadores Cloudflare\b/gi, 'Cloudflare Workers'],
  ]
  for (const [re, rep] of gloss) s = s.replace(re, rep)

  await writeFile(absPath, s, 'utf8')
}

async function main() {
  const listPath = process.argv[2]
  if (!listPath) {
    console.error('Usage: fix-translation-artifacts.mjs <paths-file>')
    process.exit(1)
  }
  const paths = (await readFile(listPath, 'utf8'))
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)

  for (const rel of paths) {
    await fixFile(path.join(ROOT, rel))
    console.error('fixed', rel)
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
