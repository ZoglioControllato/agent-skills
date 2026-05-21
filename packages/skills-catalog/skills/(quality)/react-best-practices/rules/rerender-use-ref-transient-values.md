---
title: Usar useRef para valores transitórios
impact: MEDIUM
impactDescription: evita re-renderizar cada atualização frequente
tags: rerender, useref, state, performance
---

## Usar useRef para valores transitórios

Quando algo muda muito e você não quer renderizar novamente cada atualização (rastreamento do mouse, intervalos, sinalizadores transitórios), use `useRef` em vez de `useState`. Estado do componente fica para a UI; refs para valores voláteis perto do DOM. Atualizar ref não dispara render.

**Incorreto (renderiza cada atualização):**

```tsx
function Tracker() {
  const [lastX, setLastX] = useState(0)

  useEffect(() => {
    const onMove = (e: MouseEvent) => setLastX(e.clientX)
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: lastX,
        width: 8,
        height: 8,
        background: 'black',
      }}
    />
  )
}
```

**Correto (sem re-render só para rastrear):**

```tsx
function Tracker() {
  const lastXRef = useRef(0)
  const dotRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      lastXRef.current = e.clientX
      const node = dotRef.current
      if (node) {
        node.style.transform = `translateX(${e.clientX}px)`
      }
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  return (
    <div
      ref={dotRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: 8,
        height: 8,
        background: 'black',
        transform: 'translateX(0px)',
      }}
    />
  )
}
```
