---
title: Eleve a criação de RegExp
impact: LOW-MEDIUM
impactDescription: evita recreação
tags: javascript, regexp, optimization, memoization
---

## Eleve a criação de RegExp

Não grite `RegExp` dentro da renderização. Eleve para o escopo do módulo ou use `useMemo()`.

**Incorreto (novo RegExp para cada renderização):**

```tsx
function Highlighter({ text, query }: Props) {
  const regex = new RegExp(`(${query})`, 'gi')
  const parts = text.split(regex)
  return <>{parts.map((part, i) => ...)}</>
}
```

**Correto (memoize ou onze):**

```tsx
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function Highlighter({ text, query }: Props) {
  const regex = useMemo(
    () => new RegExp(`(${escapeRegex(query)})`, 'gi'),
    [query]
  )
  const parts = text.split(regex)
  return <>{parts.map((part, i) => ...)}</>
}
```

**Aviso (regex global tem estado mutável):**

Regex global (`/g`) tem estado mutável `lastIndex`:```typescript
const regex = /foo/g
regex.test('foo') // true, lastIndex = 3
regex.test('foo') // false, lastIndex = 0

```

```
