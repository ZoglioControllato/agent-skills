---
title: Extrair valores padrão não primitivos de componentes memoizados para uma constante
impact: MEDIUM
impactDescription: restaura a memoização com valor padrão estável
tags: rerender, memo, optimization
---

## Extrair valores padrão não primitivos de componentes memoizados para uma constante

Quando um componente memoizado tem valor padrão para um parâmetro opcional não primitivo (array, função, objeto), chame-o sem esse argumento quebra `memo()`, porque cada renderização gera nova instância e a igualdade estrita falha.

Extraia o padrão para uma constante reutilizada.

**Incorreto (`onClick` muda para cada renderização):**

```tsx
const UserAvatar = memo(function UserAvatar({ onClick = () => {} }: { onClick?: () => void }) {
  // ...
})

// Used without optional onClick
<UserAvatar />
```

**Correto (valor padrão estável):**

```tsx
const NOOP = () => {};

const UserAvatar = memo(function UserAvatar({ onClick = NOOP }: { onClick?: () => void }) {
  // ...
})

// Used without optional onClick
<UserAvatar />
```
