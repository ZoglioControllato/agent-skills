---
title: Suprimir desencontros esperados na hidratação
impact: LOW-MEDIUM
impactDescription: evita avisos ruidosos de hidratação quando a diferença é conhecida
tags: rendering, hydration, ssr, nextjs
---

## Suprimir desencontros esperados na hidratação

Em frameworks com SSR (por exemplo Next.js), alguns valores são intencionalmente diferentes no servidor e no cliente (IDs aleatórios, dados, formatação de local/fuso horário). Para esses desencontros _esperados_, envolva o texto sonoro num elemento com `suppressHydrationWarning` para não poluir os avisos. Não use isso para esconder bugs reais nem abuso.

**Incorreto (avisos de desencontro conhecidos):**

```tsx
function Timestamp() {
  return <span>{new Date().toLocaleString()}</span>
}
```

**Correto (suprimir só o esperado):**

```tsx
function Timestamp() {
  return <span suppressHydrationWarning>{new Date().toLocaleString()}</span>
}
```
