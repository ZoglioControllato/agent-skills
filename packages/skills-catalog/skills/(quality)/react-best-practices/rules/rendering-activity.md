---
title: Use o componente Activity para mostrar/ocultar
impact: MEDIUM
impactDescription: preservar estado/DOM
tags: rendering, activity, visibility, state-preservation
---

## Use o componente Activity para mostrar/ocultar

Use `<Activity>` do React para preservar estado/DOM em componentes caros que alternam visibilidade com frequência.

**Uso:**

```tsx
import { Activity } from 'react'

function Dropdown({ isOpen }: Props) {
  return (
    <Activity mode={isOpen ? 'visible' : 'hidden'}>
      <ExpensiveMenu />
    </Activity>
  )
}
```

Evita re-renderizações caras e perda de estado.
