---
title: Extrair para componentes memoizados
impact: MEDIUM
impactDescription: permite retornos antecipados
tags: rerender, memo, useMemo, optimization
---

## Extrair para componentes memoizados

Extraia trabalho caro para componentes memoizados para poder dar `return` cedo antes de computar.

**Incorreto (calcula avatar mesmo no carregamento):**

```tsx
function Profile({ user, loading }: Props) {
  const avatar = useMemo(() => {
    const id = computeAvatarId(user)
    return <Avatar id={id} />
  }, [user])

  if (loading) return <Skeleton />
  return <div>{avatar}</div>
}
```

**Correto (evita trabalho ao carregar):**

```tsx
const UserAvatar = memo(function UserAvatar({ user }: { user: User }) {
  const id = useMemo(() => computeAvatarId(user), [user])
  return <Avatar id={id} />
})

function Profile({ user, loading }: Props) {
  if (loading) return <Skeleton />
  return (
    <div>
      <UserAvatar user={user} />
    </div>
  )
}
```

**Nota:** Com [React Compiler](https://react.dev/learn/react-compiler), não é necessário memorizar manualmente com `memo()` e `useMemo()`; o compilador otimiza as re-renderizações.
