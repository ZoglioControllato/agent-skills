---
title: Promise.all() para operações independentes
impact: CRITICAL
impactDescription: melhoria de 2-10×
tags: assíncrono, paralelização, promessas, cascatas
---

## Promise.all() para operações independentes

Quando as operações assíncronas não têm interdependências, execute-as simultaneamente usando `Promise.all()`.

**Incorreto (execução sequencial, 3 viagens de ida e volta):**

```typescript
const user = await fetchUser()
const posts = await fetchPosts()
const comments = await fetchComments()
```

**Correto (execução paralela, 1 viagem de ida e volta):**

```typescript
const [user, posts, comments] = await Promise.all([fetchUser(), fetchPosts(), fetchComments()])
```
