---
title: Autenticar ações do servidor como rotas de API
impact: CRITICAL
impactDescription: impedir acesso não autorizado a mutações no servidor
tags: server, server-actions, authentication, security, authorization
---

## Autenticar Server Actions como rotas de API

**Impacto: CRÍTICO (impedir acesso não autorizado a mutações no servidor)**

Server Actions (funções com `"use server"`) são endpoints públicos, assim como rotas de API. Sempre verifique autenticação e autorização **dentro** de cada Ação do Servidor; Não depende apenas de middleware, guardas de layout nem verificações só na página, pois Actions podem ser chamadas diretamente.

A documentação do Next.js deixa explícito: “Trate Server Actions com as mesmas considerações de segurança de endpoints de API pública e verifique se o usuário pode executar aquela mutação.”

**Incorreto (sem verificação de autenticação):**

```typescript
'use server'

export async function deleteUser(userId: string) {
  // Anyone can call this! No auth check
  await db.user.delete({ where: { id: userId } })
  return { success: true }
}
```

**Correto (autenticação dentro da ação):**

```typescript
'use server'

import { verifySession } from '@/lib/auth'
import { unauthorized } from '@/lib/errors'

export async function deleteUser(userId: string) {
  // Always check auth inside the action
  const session = await verifySession()

  if (!session) {
    throw unauthorized('Must be logged in')
  }

  // Check authorization too
  if (session.user.role !== 'admin' && session.user.id !== userId) {
    throw unauthorized('Cannot delete other users')
  }

  await db.user.delete({ where: { id: userId } })
  return { success: true }
}
```

**Com validação de entrada:**

```typescript
'use server'

import { verifySession } from '@/lib/auth'
import { z } from 'zod'

const updateProfileSchema = z.object({
  userId: z.string().uuid(),
  name: z.string().min(1).max(100),
  email: z.string().email(),
})

export async function updateProfile(data: unknown) {
  // Validate input first
  const validated = updateProfileSchema.parse(data)

  // Then authenticate
  const session = await verifySession()
  if (!session) {
    throw new Error('Unauthorized')
  }

  // Then authorize
  if (session.user.id !== validated.userId) {
    throw new Error('Can only update own profile')
  }

  // Finally perform the mutation
  await db.user.update({
    where: { id: validated.userId },
    data: {
      name: validated.name,
      email: validated.email,
    },
  })

  return { success: true }
}
```

Referência: [https://nextjs.org/docs/app/guides/authentication](https://nextjs.org/docs/app/guides/authentication)
