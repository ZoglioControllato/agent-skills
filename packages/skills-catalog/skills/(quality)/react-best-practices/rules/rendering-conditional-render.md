---
title: Renderização condicional explícita
impact: LOW
impactDescription: evita renderizar 0 ou NaN
tags: rendering, conditional, jsx, falsy-values
---

## Renderização condicional explícita

Use operadores ternários explícitos (`? :`) em vez de `&&` quando a condição pode ser `0`, `NaN` ou outros valores falsos que renderizam.

**Incorreto (renderiza "0" quando a contagem é 0):**

```tsx
function Badge({ count }: { count: number }) {
  return <div>{count && <span className="badge">{count}</span>}</div>
}

// When count = 0, renders: <div>0</div>
// When count = 5, renders: <div><span class="badge">5</span></div>
```

**Correto (não renderiza nada quando a contagem é 0):**

```tsx
function Badge({ count }: { count: number }) {
  return <div>{count > 0 ? <span className="badge">{count}</span> : null}</div>
}

// When count = 0, renders: <div></div>
// When count = 5, renders: <div><span class="badge">5</span></div>
```
