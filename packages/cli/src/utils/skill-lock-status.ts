import type { AgentType, SkillLockFile } from '@controllato/core'

export type SkillLockfileStatus = 'tracked' | 'partial' | 'orphan'

export function getSkillLockfileStatus(
  skillName: string,
  targetAgents: AgentType[],
  globalLock: SkillLockFile,
  projectLock: SkillLockFile,
): SkillLockfileStatus {
  const entries = [globalLock.skills[skillName], projectLock.skills[skillName]].filter(Boolean)
  if (entries.length === 0) return 'orphan'

  const trackedAgents = new Set<AgentType>()
  for (const entry of entries) {
    for (const agent of entry.agents ?? []) {
      trackedAgents.add(agent)
    }
  }

  const untracked = targetAgents.filter((agent) => !trackedAgents.has(agent))
  if (untracked.length === 0) return 'tracked'
  return 'partial'
}
