---
title: Use Set/Map para buscas O(1)
impact: LOW-MEDIUM
impactDescription: de O(n) para O(1)
tags: javascript, set, map, data-structures, performance
---

## Use Set/Map para buscas O(1)

Converta arrays em Set/Map para verificações repetidas de pertença.

**Incorreto (O(n) por verificação):**

```typescript
const allowedIds = ['a', 'b', 'c', ...]
items.filter(item => allowedIds.includes(item.id))
```

**Correto (O(1) por verificação):**

```typescript
const allowedIds = new Set(['a', 'b', 'c', ...])
items.filter(item => allowedIds.has(item.id))
```
