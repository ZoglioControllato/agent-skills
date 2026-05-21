---
title: Eleve elementos JSX estáticos
impact: LOW
impactDescription: evita recreação
tags: rendering, jsx, static, optimization
---

## Eleve elementos JSX estáticos

Extraia JSX específico para fora dos componentes para evitar recriação.

**Incorreto (recriar o elemento a cada renderização):**

```tsx
function LoadingSkeleton() {
  return <div className="animate-pulse h-20 bg-gray-200" />
}

function Container() {
  return <div>{loading && <LoadingSkeleton />}</div>
}
```

**Correto (reutiliza o mesmo elemento):**

```tsx
const loadingSkeleton = <div className="animate-pulse h-20 bg-gray-200" />

function Container() {
  return <div>{loading && loadingSkeleton}</div>
}
```

É especialmente útil para nós, SVG grandes e estáticos, caros de recriar cada renderização.

**Observação:** se o projeto tiver [React Compiler](https://react.dev/learn/react-compiler) habilitado, o compilador eleva JSX estático e otimiza re-renderizações automaticamente, tornando a sobrecarga manual desnecessária.
