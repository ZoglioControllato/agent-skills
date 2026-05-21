---
title: Use loop para min/max em vez de sort
impact: LOW
impactDescription: O(n) em vez de O(n log n)
tags: javascript, arrays, performance, sorting, algorithms
---

## Use loop para min/max em vez de sort

Encontrar o menor ou maior elemento exige apenas uma passagem no array. Ordenar é desperdício e mais lento.

**Incorreto (O(n log n) — ordena para achar o mais recente):**

```typescript
interface Project {
  id: string
  name: string
  updatedAt: number
}

function getLatestProject(projects: Project[]) {
  const sorted = [...projects].sort((a, b) => b.updatedAt - a.updatedAt)
  return sorted[0]
}
```

Ordene o array inteiro só para achar o máximo.

**Incorreto (O(n log n) — ordena para o mais velho e o mais novo):**

```typescript
function getOldestAndNewest(projects: Project[]) {
  const sorted = [...projects].sort((a, b) => a.updatedAt - b.updatedAt)
  return { oldest: sorted[0], newest: sorted[sorted.length - 1] }
}
```

Ainda ordena sem necessidade quando só min/max importam.

**Correto (O(n) — um único loop):**

```typescript
function getLatestProject(projects: Project[]) {
  if (projects.length === 0) return null

  let latest = projects[0]

  for (let i = 1; i < projects.length; i++) {
    if (projects[i].updatedAt > latest.updatedAt) {
      latest = projects[i]
    }
  }

  return latest
}

function getOldestAndNewest(projects: Project[]) {
  if (projects.length === 0) return { oldest: null, newest: null }

  let oldest = projects[0]
  let newest = projects[0]

  for (let i = 1; i < projects.length; i++) {
    if (projects[i].updatedAt < oldest.updatedAt) oldest = projects[i]
    if (projects[i].updatedAt > newest.updatedAt) newest = projects[i]
  }

  return { oldest, newest }
}
```

Uma passagem, sem cópia e sem ordenação.

**Alternativa (Math.min/Math.max para arrays pequenos):**

```typescript
const numbers = [5, 2, 8, 1, 9]
const min = Math.min(...numbers)
const max = Math.max(...numbers)
```

Funciona em arrays pequenos, mas pode ser mais lento ou lançar erros em arrays muito grandes por limitações do spread. O comprimento máximo do array é aproximadamente 124000 no Chrome 143 e 638000 no Safari 18; os valores exatos podem variar — veja [the fiddle](https://jsfiddle.net/qw1jabsx/4/). Para robustez, use o loop.
