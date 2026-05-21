---
title: Retorno antecipado em funções
impact: LOW-MEDIUM
impactDescription: evita despesas desnecessárias
tags: javascript, functions, optimization, early-return
---

## Retorno antecipado em funções

Retorne cedo quando o resultado já estiver definido para reduzir o processamento necessário.

**Incorreto (processa todos os itens mesmo após uma resposta):**

```typescript
function validateUsers(users: User[]) {
  let hasError = false
  let errorMessage = ''

  for (const user of users) {
    if (!user.email) {
      hasError = true
      errorMessage = 'Email required'
    }
    if (!user.name) {
      hasError = true
      errorMessage = 'Name required'
    }
    // Continues checking all users even after error found
  }

  return hasError ? { valid: false, error: errorMessage } : { valid: true }
}
```

**Correto (retorna imediatamente no primeiro erro):**

```typescript
function validateUsers(users: User[]) {
  for (const user of users) {
    if (!user.email) {
      return { valid: false, error: 'Email required' }
    }
    if (!user.name) {
      return { valid: false, error: 'Name required' }
    }
  }

  return { valid: true }
}
```
