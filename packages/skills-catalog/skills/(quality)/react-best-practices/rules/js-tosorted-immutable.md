---
title: Use toSorted() em vez de sort() para imutabilidade
impact: MEDIUM-HIGH
impactDescription: evita bugs de mutação no estado React
tags: javascript, arrays, immutability, react, state, mutation
---

## Use toSorted() em vez de sort() para imutabilidade

`.sort()` muda ou array não existe, o que pode causar bugs de estado e props no React. Use `.toSorted()` para criar um novo array ordenado sem mutação.

**Incorreto (muta o array original):**

```typescript
function UserList({ users }: { users: User[] }) {
  // Mutates the users prop array!
  const sorted = useMemo(
    () => users.sort((a, b) => a.name.localeCompare(b.name)),
    [users]
  )
  return <div>{sorted.map(renderUser)}</div>
}
```

**Correto (criou um array novo):**

```typescript
function UserList({ users }: { users: User[] }) {
  // Creates new sorted array, original unchanged
  const sorted = useMemo(
    () => users.toSorted((a, b) => a.name.localeCompare(b.name)),
    [users]
  )
  return <div>{sorted.map(renderUser)}</div>
}
```

**Por que isso é importante no React:**

1. Mutação de props/estado quebra o modelo de imutabilidade — o React espera que props e estado sejam tratados como somente leitura
2. Causa bugs de encerramento obsoleto — alterar arrays dentro de encerramentos (callbacks, efeitos) pode gerar comportamento inesperado

**Suporte em navegadores (fallback para ambientes antigos):**

`.toSorted()` está disponível em navegadores modernos (Chrome 110+, Safari 16+, Firefox 115+, Node.js 20+). Em ambientes mais antigos, use spread:```typescript
// Fallback for older browsers
const sorted = [...items].sort((a, b) => a.value - b.value)

```

**Outros métodos imutáveis de array:**

- `.toSorted()` — ordenação imutável
- `.toReversed()` — versão imutável
- `.toSpliced()` — emenda imutável
- `.with()` — substituição imutável de elemento
```
