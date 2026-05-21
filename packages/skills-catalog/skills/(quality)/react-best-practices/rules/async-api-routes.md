---
title: Evitar cadeias em cascata em rotas de API
impact: CRITICAL
impactDescription: melhoria de 2-10×
tags: rotas api, ações do servidor, cascatas, paralelização
---

## Impedir cadeias em cascata em rotas de API

Nas rotas API e Ações do Servidor, inicie operações independentes imediatamente, mesmo que ainda não as espere.

**Incorreto (a configuração aguarda autenticação, os dados aguardam ambos):**

```typescript
export async function GET(request: Request) {
  const session = await auth()
  const config = await fetchConfig()
  const data = await fetchData(session.user.id)
  return Response.json({ data, config })
}
```

**Correto (autenticação e configuração iniciam imediatamente):**

```typescript
export async function GET(request: Request) {
  const sessionPromise = auth()
  const configPromise = fetchConfig()
  const session = await sessionPromise
  const [config, data] = await Promise.all([configPromise, fetchData(session.user.id)])
  return Response.json({ data, config })
}
```

Para operações com cadeias de dependências mais complexas, use `better-all` para maximizar automaticamente o paralelismo (consulte Paralelização Baseada em Dependência).
