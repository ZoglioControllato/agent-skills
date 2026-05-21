#!/usr/bin/env node
/**
 * Generates tools/translation-manifest.json with one entry per .md file (646).
 */
import { readdir, stat, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const MANIFEST_PATH = path.join(__dirname, 'translation-manifest.json')

const P1_PATHS = new Set([
  'README.md',
  'CONTRIBUTING.md',
  'AGENTS.md',
  'CLAUDE.md',
  'SECURITY.md',
  'CHANGELOG.md',
  'packages/cli/CHANGELOG.md',
  'packages/mcp/CHANGELOG.md',
  'packages/skills-catalog/CHANGELOG.md',
  'packages/mcp/README.md',
  'packages/marketplace/README.md',
  'libs/core/README.md',
  '.nx/SELF_HEALING.md',
])

const SKILLS_ROOT = 'packages/skills-catalog/skills'

function slugifyPath(relPath) {
  return relPath.replace(/[()]/g, '').replace(/[/\\]/g, '-').replace(/\.md$/i, '')
}

function skillFromPath(relPath) {
  const m = relPath.match(/^packages\/skills-catalog\/skills\/\([^)]+\)\/([^/]+)\//)
  return m ? m[1] : null
}

function categoryFromPath(relPath) {
  const m = relPath.match(/^packages\/skills-catalog\/skills\/\(([^)]+)\)\//)
  return m ? m[1] : null
}

function workstreamFor(relPath, skill) {
  const cfMatch = relPath.match(/packages\/skills-catalog\/skills\/\(cloud\)\/cloudflare-deploy\/references\/([^/]+)\//)
  if (cfMatch) return `cf-${cfMatch[1]}`

  if (skill === 'react-best-practices') {
    if (relPath.endsWith('/AGENTS.md') || relPath.endsWith('/README.md')) return 'rbp-meta'
    const rulesMatch = relPath.match(/\/rules\/(.+)\.md$/)
    if (rulesMatch) {
      const batch = Math.floor(rulesMatch[1].split('').reduce((a, c) => a + c.charCodeAt(0), 0) % 7)
      return `rbp-rules-0${batch + 1}`
    }
  }

  return skill ?? 'repo-root'
}

function idFor(phase, relPath, skill, category) {
  if (phase === 'P1') return `T-P1-${slugifyPath(relPath)}`
  if (phase === 'P2') return `T-P2-${category ?? 'root'}-${skill}-SKILL`
  if (phase === 'P3') {
    const cf = relPath.match(/cloudflare-deploy\/references\/([^/]+)\/([^/]+)\.md$/)
    if (cf) return `T-P3-cf-${cf[1]}-${cf[2].replace(/\.md$/, '')}`
    if (skill) return `T-P3-${category}-${skill}-${slugifyPath(path.basename(relPath))}`
    return `T-P3-${slugifyPath(relPath)}`
  }
  return `T-${phase}-${slugifyPath(relPath)}`
}

async function walkMd(dir, base = '') {
  const entries = []
  for (const name of await readdir(dir)) {
    if (name === 'node_modules' || name === '.git' || name === 'dist') continue
    const full = path.join(dir, name)
    const rel = base ? `${base}/${name}` : name
    const st = await stat(full)
    if (st.isDirectory()) {
      entries.push(...(await walkMd(full, rel)))
    } else if (name.endsWith('.md')) {
      entries.push(rel)
    }
  }
  return entries
}

function phaseFor(relPath) {
  if (P1_PATHS.has(relPath)) return 'P1'
  if (relPath.endsWith('/SKILL.md') && relPath.startsWith(SKILLS_ROOT)) return 'P2'
  if (relPath.startsWith(SKILLS_ROOT)) return 'P3'
  return 'P1'
}

async function main() {
  const allMd = (await walkMd(ROOT)).sort()
  const manifest = []

  for (const relPath of allMd) {
    const phase = phaseFor(relPath)
    const skill = skillFromPath(relPath)
    const category = categoryFromPath(relPath)
    const id = idFor(phase, relPath, skill, category)
    const dependsOn = phase === 'P3' && skill ? [`T-P2-${category}-${skill}-SKILL`] : phase === 'P1' ? ['T-P0-08'] : []

    manifest.push({
      id,
      phase,
      path: relPath,
      skill: skill ?? (phase === 'P1' ? null : undefined),
      dependsOn,
      workstream: workstreamFor(relPath, skill),
      status: 'pending',
    })
  }

  const counts = { P1: 0, P2: 0, P3: 0 }
  for (const e of manifest) counts[e.phase]++

  const payload = {
    version: 1,
    generatedAt: new Date().toISOString(),
    total: manifest.length,
    counts,
    entries: manifest,
  }

  await writeFile(MANIFEST_PATH, `${JSON.stringify(payload, null, 2)}\n`)
  console.log(`Wrote ${manifest.length} entries to ${MANIFEST_PATH}`)
  console.log(`P1=${counts.P1} P2=${counts.P2} P3=${counts.P3}`)

  if (manifest.length !== 646) {
    console.error(`Expected 646 entries, got ${manifest.length}`)
    process.exit(1)
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
