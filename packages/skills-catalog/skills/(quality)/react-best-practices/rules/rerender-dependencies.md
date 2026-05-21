---
title: Estreitar dependências de Effect
impact: LOW
impactDescription: minimizar reexecuções do efeito
tags: rerender, useEffect, dependencies, optimization
---

## Estreitar dependências de Effect

Prefira dependências primitivas em vez de objetos inteiros para reduzir reexecuções de efeito.

**Incorreto (retroduzido em qualquer campo de usuário):**

```tsx
useEffect(() => {
  console.log(user.id)
}, [user])
```

**Correto (reroda só quando id muda):**

```tsx
useEffect(() => {
  console.log(user.id)
}, [user.id])
```

**Para estado derivado, calcule fora do efeito:**

```tsx
// Incorrect: runs on width=767, 766, 765...
useEffect(() => {
  if (width < 768) {
    enableMobileMode()
  }
}, [width])

// Correct: runs only on boolean transition
const isMobile = width < 768
useEffect(() => {
  if (isMobile) {
    enableMobileMode()
  }
}, [isMobile])
```
