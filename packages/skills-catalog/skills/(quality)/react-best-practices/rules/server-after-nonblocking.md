---
title: Usar after() para operações não bloqueantes
impact: MEDIUM
impactDescription: respostas mais rápidas
tags: server, async, logging, analytics, side-effects
---

## Usar after() para operações não bloqueantes

Use `after()` do Next.js para agendar trabalho depois que a resposta for enviada. Assim logging, analytics e outros efeitos colaterais não seguram o fim da resposta.

**Incorreto (garanta a resposta):**

```tsx
import { logUserAction } from '@/app/utils'

export async function POST(request: Request) {
  // Perform mutation
  await updateDatabase(request)

  // Logging blocks the response
  const userAgent = request.headers.get('user-agent') || 'unknown'
  await logUserAction({ userAgent })

  return new Response(JSON.stringify({ status: 'success' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
}
```

**Correto (não bloqueado):**

```tsx
import { after } from 'next/server'
import { headers, cookies } from 'next/headers'
import { logUserAction } from '@/app/utils'

export async function POST(request: Request) {
  // Perform mutation
  await updateDatabase(request)

  // Log after response is sent
  after(async () => {
    const userAgent = (await headers()).get('user-agent') || 'unknown'
    const sessionCookie = (await cookies()).get('session-id')?.value || 'anonymous'

    logUserAction({ sessionCookie, userAgent })
  })

  return new Response(JSON.stringify({ status: 'success' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
}
```

A resposta sai na hora; o registro corre em segundo plano.

**Casos comuns:**

- Acompanhamento analítico

- Registro de auditoria

- Envio de notificações

- Invalidação de cache

- Tarefas de limpeza

**Observações importantes:**

- `after()` roda mesmo quando a resposta falha ou redirecionamento

- Funciona em Server Actions, Route Handlers e Server Components

Referência: [https://nextjs.org/docs/app/api-reference/functions/after](https://nextjs.org/docs/app/api-reference/functions/after)
