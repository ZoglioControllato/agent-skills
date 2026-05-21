---
title: Armazene manipuladores de evento em refs
impact: LOW
impactDescription: assinaturas originadas
tags: advanced, hooks, refs, event-handlers, optimization
---

## Armazene manipuladores de evento em refs

Armazene callbacks em refs quando são usados em efeitos que não devem ser reinscritos a cada mudança do callback.

**Incorreto (reinscrever cada renderização):**

```tsx
function useWindowEvent(event: string, handler: (e) => void) {
  useEffect(() => {
    window.addEventListener(event, handler)
    return () => window.removeEventListener(event, handler)
  }, [event, handler])
}
```

**Correto (assinatura estável):**

```tsx
function useWindowEvent(event: string, handler: (e) => void) {
  const handlerRef = useRef(handler)
  useEffect(() => {
    handlerRef.current = handler
  }, [handler])

  useEffect(() => {
    const listener = (e) => handlerRef.current(e)
    window.addEventListener(event, listener)
    return () => window.removeEventListener(event, listener)
  }, [event])
}
```

**Alternativa: use `useEffectEvent` se estiver no React mais recente:**

```tsx
import { useEffectEvent } from 'react'

function useWindowEvent(event: string, handler: (e) => void) {
  const onEvent = useEffectEvent(handler)

  useEffect(() => {
    window.addEventListener(event, onEvent)
    return () => window.removeEventListener(event, onEvent)
  }, [event])
}
```

`useEffectEvent` oferece uma API mais limpa para o mesmo padrão: cria uma referência de função estável que sempre chama a versão mais recente do manipulador.
