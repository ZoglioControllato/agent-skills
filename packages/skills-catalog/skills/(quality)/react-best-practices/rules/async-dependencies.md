---
title: Paralelização Baseada em Dependência
impact: CRITICAL
impactDescription: melhoria de 2-10×
tags: assíncrono, paralelização, dependências, melhor-tudo
---

## Paralelização Baseada em Dependência

Para operações com dependências parciais, use `better-all` para maximizar o paralelismo. Ele inicia automaticamente cada tarefa o mais cedo possível.

**Incorreto (perfil aguarda configuração desnecessariamente):**

```typescript
const [user, config] = await Promise.all([fetchUser(), fetchConfig()])
const profile = await fetchProfile(user.id)
```

**Correto (configuração e perfil executados em paralelo):**

```typescript
import { all } from 'better-all'

const { user, config, profile } = await all({
  async user() {
    return fetchUser()
  },
  async config() {
    return fetchConfig()
  },
  async profile() {
    return fetchProfile((await this.$.user).id)
  },
})
```

**Alternativa sem dependências extras:**

Também podemos criar todas as promises primeiro e fazer `Promise.all()` só no final.

```typescript
const userPromise = fetchUser()
const profilePromise = userPromise.then((user) => fetchProfile(user.id))

const [user, config, profile] = await Promise.all([userPromise, fetchConfig(), profilePromise])
```

Referência: [https://github.com/shuding/better-all](https://github.com/shuding/better-all)
