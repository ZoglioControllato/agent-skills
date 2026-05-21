import type { DeprecatedEntry } from '@controllato/core'
import { getDeprecatedMap } from '@controllato/core'
import { atom } from 'jotai'
import { unwrap } from 'jotai/utils'

import { ports } from '../ports'

const deprecatedSkillsAsyncAtom = atom(async (): Promise<Map<string, DeprecatedEntry>> => {
  return getDeprecatedMap(ports)
})

export const deprecatedSkillsAtom = unwrap(deprecatedSkillsAsyncAtom, (prev) => prev ?? new Map())
