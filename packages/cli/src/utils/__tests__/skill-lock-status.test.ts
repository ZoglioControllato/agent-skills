import { describe, expect, it } from '@jest/globals'

import type { SkillLockFile } from '@controllato/core'

import { getSkillLockfileStatus } from '../skill-lock-status'

const empty = (): SkillLockFile => ({ version: 2, skills: {} })

describe('getSkillLockfileStatus', () => {
  it('returns orphan when skill is missing from both lockfiles', () => {
    expect(getSkillLockfileStatus('caveman', ['claude-code'], empty(), empty())).toBe('orphan')
  })

  it('returns tracked when all target agents are registered', () => {
    const projectLock: SkillLockFile = {
      version: 2,
      skills: {
        'docs-writer': {
          name: 'docs-writer',
          source: 'local',
          installedAt: '2026-01-01T00:00:00.000Z',
          updatedAt: '2026-01-01T00:00:00.000Z',
          agents: ['cursor', 'claude-code'],
          method: 'copy',
          global: false,
        },
      },
    }

    expect(getSkillLockfileStatus('docs-writer', ['cursor', 'claude-code'], empty(), projectLock)).toBe('tracked')
  })

  it('returns partial when skill is in lockfile but not for every target agent', () => {
    const projectLock: SkillLockFile = {
      version: 2,
      skills: {
        'coding-guidelines': {
          name: 'coding-guidelines',
          source: 'local',
          installedAt: '2026-01-01T00:00:00.000Z',
          updatedAt: '2026-01-01T00:00:00.000Z',
          agents: ['windsurf'],
          method: 'copy',
          global: false,
        },
      },
    }

    expect(getSkillLockfileStatus('coding-guidelines', ['cursor', 'claude-code'], empty(), projectLock)).toBe(
      'partial',
    )
  })
})
