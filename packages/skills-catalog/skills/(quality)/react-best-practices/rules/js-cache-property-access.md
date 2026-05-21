---
title: Faça cache de acesso às propriedades em loops
impact: LOW-MEDIUM
impactDescription: reduz buscas
tags: javascript, loops, otimização, cache
---

## Faça cache de acesso a propriedades em loops

Armazene em variável o resultado de cadeias de propriedades em caminhos quentes.

**Incorreto (3 buscas × N iterações):**

```typescript
for (let i = 0; i < arr.length; i++) {
  process(obj.config.settings.value)
}
```

**Correto (1 busca no total):**

```typescript
const value = obj.config.settings.value
const len = arr.length
for (let i = 0; i < len; i++) {
  process(value)
}
```
