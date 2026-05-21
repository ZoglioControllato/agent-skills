---
title: Não envolva expressão simples com tipo primitivo em useMemo
impact: LOW-MEDIUM
impactDescription: desperdicei trabalho em todo render
tags: rerender, useMemo, optimization
---

## Não envolva expressão simples com tipo primitivo em useMemo

Se a expressão é simples (poucos operadores lógicos ou aritméticos) e o resultado é primitivo (booleano, número, string), não envolve em `useMemo`.
Chamar `useMemo` e comparar deps pode custar mais que avaliar a expressão.

**Incorreto:**

```tsx
function Header({ user, notifications }: Props) {
  const isLoading = useMemo(() => {
    return user.isLoading || notifications.isLoading
  }, [user.isLoading, notifications.isLoading])

  if (isLoading) return <Skeleton />
  // return some markup
}
```

**Correto:**

```tsx
function Header({ user, notifications }: Props) {
  const isLoading = user.isLoading || notifications.isLoading

  if (isLoading) return <Skeleton />
  // return some markup
}
```
