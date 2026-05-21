---
title: Anime o wrapper do SVG em vez do elemento SVG
impact: LOW
impactDescription: habilitação de aceleração por hardware
tags: rendering, svg, css, animation, performance
---

## Anime o wrapper do SVG em vez do elemento SVG

Muitos navegadores não aceleram por animações de hardware CSS3 em elementos SVG. Envolva o SVG em um `<div>` e anime o wrapper.

**Incorreto (anima o SVG diretamente — sem atualização por hardware):**

```tsx
function LoadingSpinner() {
  return (
    <svg className="animate-spin" width="24" height="24" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" stroke="currentColor" />
    </svg>
  )
}
```

**Correto (animação ou div wrapper — acelerado por hardware):**

```tsx
function LoadingSpinner() {
  return (
    <div className="animate-spin">
      <svg width="24" height="24" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" stroke="currentColor" />
      </svg>
    </div>
  )
}
```

Vale para todas as transformações e transições CSS (`transform`, `opacity`, `translate`, `scale`, `rotate`). O div wrapper permite ao navegador usar GPU para animações mais suaves.
