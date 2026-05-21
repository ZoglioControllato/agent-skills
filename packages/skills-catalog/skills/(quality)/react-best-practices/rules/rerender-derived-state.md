---
title: Inscrever-se em estado derivado
impact: MEDIUM
impactDescription: reduz frequência de re-renderização
tags: rerender, derived-state, media-query, optimization
---

## Inscreva-se em estado derivado

Assine estado booleano derivado em vez de valores que mudam de forma contínua, assim você reduz a frequência de re-renderização.

**Incorreto (re-renderizar cada mudança de pixel):**

```tsx
function Sidebar() {
  const width = useWindowWidth() // updates continuously
  const isMobile = width < 768
  return <nav className={isMobile ? 'mobile' : 'desktop'} />
}
```

**Correto (re-renderizar só quando o booleano muda):**

```tsx
function Sidebar() {
  const isMobile = useMediaQuery('(max-width: 767px)')
  return <nav className={isMobile ? 'mobile' : 'desktop'} />
}
```
