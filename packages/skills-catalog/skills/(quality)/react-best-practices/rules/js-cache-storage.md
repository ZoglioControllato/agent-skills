---
title: Faça cache de chamadas na API de armazenamento
impact: LOW-MEDIUM
impactDescription: reduz custos de E/S
tags: javascript, localStorage, storage, caching, performance
---

## Faça cache de chamadas na API de armazenamento

`localStorage`, `sessionStorage` e `document.cookie` são síncronos e custosos. Armazene leituras em memória.

**Incorreto (levar o armazenamento a cada chamada):**

```typescript
function getTheme() {
  return localStorage.getItem('theme') ?? 'light'
}
// Called 10 times = 10 storage reads
```

**Correto (cache com Mapa):**

```typescript
const storageCache = new Map<string, string | null>()

function getLocalStorage(key: string) {
  if (!storageCache.has(key)) {
    storageCache.set(key, localStorage.getItem(key))
  }
  return storageCache.get(key)
}

function setLocalStorage(key: string, value: string) {
  localStorage.setItem(key, value)
  storageCache.set(key, value) // keep cache in sync
}
```

Use um `Map` (não um gancho) para funcionar em qualquer lugar: importadores, manipuladores de eventos, não apenas em componentes React.

**Cache de cookies:**

```typescript
let cookieCache: Record<string, string> | null = null

function getCookie(name: string) {
  if (!cookieCache) {
    cookieCache = Object.fromEntries(document.cookie.split('; ').map((c) => c.split('=')))
  }
  return cookieCache[name]
}
```

**Importante (invalidar quando houver mudança externa):**

Se o armazenamento puder ser alterado por fora (outra aba, cookies definidos no servidor), invalide o cache:```typescript
window.addEventListener('storage', (e) => {
if (e.key) storageCache.delete(e.key)
})

document.addEventListener('visibilitychange', () => {
if (document.visibilityState === 'visible') {
storageCache.clear()
}
})

```

```
