---
title: Desduplicação por requisição com React.cache()
impact: MEDIUM
impactDescription: deduplicar dentro da mesma requisição
tags: server, cache, react-cache, deduplication
---

## Deduplicação por requisição com React.cache()

Use `React.cache()` para desduplicar nenhum servidor trabalhando dentro de uma única requisição. Autenticação e consultas ao banco costumam se beneficiar muito.

**Uso típico:**

```typescript
import { cache } from 'react'

export const getCurrentUser = cache(async () => {
  const session = await auth()
  if (!session?.user?.id) return null
  return await db.user.findUnique({
    where: { id: session.user.id },
  })
})
```

Numa única requisição, várias chamadas para `getCurrentUser()` disparam uma consulta apenas uma vez.

**Evite objetos inline nos argumentos:**

`React.cache()` usa igualdade rasa (`Object.is`) para certos no cache. Objetos literários criam novas referências a cada chamada e impedem o acerto no cache.

**Incorreto (sempre falta de cache):**

```typescript
const getUser = cache(async (params: { uid: number }) => {
  return await db.user.findUnique({ where: { id: params.uid } })
})

// Each call creates new object, never hits cache
getUser({ uid: 1 })
getUser({ uid: 1 }) // Cache miss, runs query again
```

**Correto (cache hit possível):**

```typescript
const getUser = cache(async (uid: number) => {
  return await db.user.findUnique({ where: { id: uid } })
})

// Primitive args use value equality
getUser(1)
getUser(1) // Cache hit, returns cached result
```

Se você precisar passar objetos, reutilize **a mesma referência**:```typescript
const params = { uid: 1 }
getUser(params) // Query runs
getUser(params) // Cache hit (same reference)

```

**Nota específica do Next.js:**

No Next.js a API `fetch` é automaticamente repetida com a memoização por requisição chamadas iguais (URL + opções) são deduplicadas na mesma requisição, então você não precisa de `React.cache()` para `fetch`. Ainda assim, `React.cache()` continua essencial para outro trabalho assíncrono:

- Consultas a banco (Prisma, Garoa, etc.)
- Cómputos pesados
- Checagens de autenticação
- Operações de sistema de arquivos
- Qualquer trabalho assíncrono que não seja `fetch`

Use `React.cache()` para desduplicar esse tipo de trabalho na árvore de componentes.

Referência: [documentação React.cache](https://react.dev/reference/react/cache)
```
