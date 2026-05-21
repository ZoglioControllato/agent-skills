---
title: Construa mapas de índice para buscas repetidas
impact: LOW-MEDIUM
impactDescription: de 1 milhão de operações para 2 mil operações
tags: javascript, map, indexing, optimization, performance
---

## Construa mapas de índice para buscas repetidas

Várias chamadas `.find()` pela mesma chave devem ser usadas em `Map`.

**Incorreto (O(n) por busca):**

```typescript
function processOrders(orders: Order[], users: User[]) {
  return orders.map((order) => ({
    ...order,
    user: users.find((u) => u.id === order.userId),
  }))
}
```

**Correto (O(1) por busca):**

```typescript
function processOrders(orders: Order[], users: User[]) {
  const userById = new Map(users.map((u) => [u.id, u]))

  return orders.map((order) => ({
    ...order,
    user: userById.get(order.userId),
  }))
}
```

Construa o mapa uma vez (O(n)); depois todas as buscas são O(1).
Para 1000 pedidos × 1000 usuários: 1 milhão de operações → 2 mil operações.
