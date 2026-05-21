---
title: Combine várias iterações em array
impact: LOW-MEDIUM
impactDescription: reduz iterações
tags: javascript, arrays, loops, desempenho
---

## Combine várias iterações em array

Várias chamadas `.filter()` ou `.map()` percorrem o array várias vezes. Um em um único loop.

**Incorreto (3 iterações):**

```typescript
const admins = users.filter((u) => u.isAdmin)
const testers = users.filter((u) => u.isTester)
const inactive = users.filter((u) => !u.isActive)
```

**Correto (1 iteração):**

```typescript
const admins: User[] = []
const testers: User[] = []
const inactive: User[] = []

for (const user of users) {
  if (user.isAdmin) admins.push(user)
  if (user.isTester) testers.push(user)
  if (!user.isActive) inactive.push(user)
}
```
