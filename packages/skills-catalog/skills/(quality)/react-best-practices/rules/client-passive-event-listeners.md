---
title: Use listeners passivos para desempenho de rolagem
impact: MEDIUM
impactDescription: eliminar atraso de rolagem causado por ouvintes
tags: client, event-listeners, scrolling, performance, touch, wheel
---

## Use listeners passivos para desempenho de rolagem

Adicione `{ passiva: true }` aos ouvintes de toque e roda para permitir a rolagem imediata. O navegador normalmente espera que os ouvintes terminem para saber se `preventDefault()` foi chamado, ou que atrasa o scroll.

**Incorreto:**

```typescript
useEffect(() => {
  const handleTouch = (e: TouchEvent) => console.log(e.touches[0].clientX)
  const handleWheel = (e: WheelEvent) => console.log(e.deltaY)

  document.addEventListener('touchstart', handleTouch)
  document.addEventListener('wheel', handleWheel)

  return () => {
    document.removeEventListener('touchstart', handleTouch)
    document.removeEventListener('wheel', handleWheel)
  }
}, [])
```

**Correto:**

```typescript
useEffect(() => {
  const handleTouch = (e: TouchEvent) => console.log(e.touches[0].clientX)
  const handleWheel = (e: WheelEvent) => console.log(e.deltaY)

  document.addEventListener('touchstart', handleTouch, { passive: true })
  document.addEventListener('wheel', handleWheel, { passive: true })

  return () => {
    document.removeEventListener('touchstart', handleTouch)
    document.removeEventListener('wheel', handleWheel)
  }
}, [])
```

**Use passivo quando:** rastreamento/análise, registro ou qualquer ouvinte que não chame `preventDefault()`.

**Não use passivo quando:** gestos de swipe personalizados, zoom personalizados ou qualquer ouvinte que precise de `preventDefault()`.
