---
title: Usar transições para atualizações não urgentes
impact: MEDIUM
impactDescription: preservar a fluidez da UI
tags: rerender, transitions, startTransition, performance
---

## Usar transições para atualizações não urgentes

Marque atualizações de estados frequentes e não urgentes como transições para manter uma interface responsiva.

**Incorreto (trava a UI em cada rolagem):**

```tsx
function ScrollTracker() {
  const [scrollY, setScrollY] = useState(0)
  useEffect(() => {
    const handler = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])
}
```

**Correto (atualizações sem bloqueio):**

```tsx
import { startTransition } from 'react'

function ScrollTracker() {
  const [scrollY, setScrollY] = useState(0)
  useEffect(() => {
    const handler = () => {
      startTransition(() => setScrollY(window.scrollY))
    }
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])
}
```
