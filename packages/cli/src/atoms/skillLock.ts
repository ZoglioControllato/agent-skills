import { readSkillLock, type SkillLockFile } from '@controllato/core'
import { atom } from 'jotai'
import { unwrap } from 'jotai/utils'

import { ports } from '../ports'

export type SkillLockState = {
  globalLock: SkillLockFile
  projectLock: SkillLockFile
}

const emptyLock = (): SkillLockFile => ({ version: 2, skills: {} })

const skillLockAsyncAtom = atom(async (): Promise<SkillLockState> => {
  const [globalLock, projectLock] = await Promise.all([readSkillLock(ports, true), readSkillLock(ports, false)])
  return { globalLock, projectLock }
})

export const skillLockAtom = unwrap(skillLockAsyncAtom, (prev) => prev ?? { globalLock: emptyLock(), projectLock: emptyLock() })
