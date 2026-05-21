---
title: Cache LRU entre requisições
impact: HIGH
impactDescription: compartilha cache entre várias solicitações
tags: server, cache, lru, cross-request
---

## Cache LRU entre requisições

`React.cache()` só funciona dentro de uma única requisição. Para dados repetidos ao longo de requisições sequenciais (usuário clica no botão A e depois no B), use um cache LRU.

**Implementação:**

```typescript
import { LRUCache } from 'lru-cache'

const cache = new LRUCache<string, any>({
  max: 1000,
  ttl: 5 * 60 * 1000, // 5 minutes
})

export async function getUser(id: string) {
  const cached = cache.get(id)
  if (cached) return cached

  const user = await db.user.findUnique({ where: { id } })
  cache.set(id, user)
  return user
}

// Request 1: DB query, result cached
// Request 2: cache hit, no DB query
```

Use quando fluxos rápidos batem vários endpoints que precisam dos mesmos dados em poucos segundos.

**Com [Fluid Compute](https://vercel.com/docs/fluid-compute) na Vercel:** o LRU costuma funcionar bem porque várias solicitações concorrentes podem compartilhar a mesma instância da função e o cache—às vezes dispensa Redis.

**Serverless tradicional:** cada chamada de roda isolada; aproveite Redis para cache entre processos.

Referência: [https://github.com/isaacs/node-lru-cache](https://github.com/isaacs/node-lru-cache)
