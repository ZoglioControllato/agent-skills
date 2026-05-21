---
title: Verifique o comprimento primeiro em comparações de arrays
impact: MEDIUM-HIGH
impactDescription: evita operações caras quando os tamanhos aumentam
tags: javascript, arrays, performance, optimization, comparison
---

## Verifique o comprimento primeiro em comparações de arrays

Ao comparar arrays com operações caras (ordenação, igualdade profunda, serialização), verifique primeiro os comprimentos. Se forem diferentes, os arrays não podem ser iguais.

Em aplicações reais, isso vale especialmente em caminhos quentes (manipuladores de eventos, loops de renderização).

**Incorreto (sempre executado em comparação cara):**

```typescript
function hasChanges(current: string[], original: string[]) {
  // Always sorts and joins, even when lengths differ
  return current.sort().join() !== original.sort().join()
}
```

Duas ordenações O(n log n) rodam mesmo quando `current.length` é 5 e `original.length` é 100. Há também o custo de juntar os arrays e comparar as strings.

**Correto (checagem O(1) de comprimento primeiro):**

```typescript
function hasChanges(current: string[], original: string[]) {
  // Early return if lengths differ
  if (current.length !== original.length) {
    return true
  }
  // Only sort when lengths match
  const currentSorted = current.toSorted()
  const originalSorted = original.toSorted()
  for (let i = 0; i < currentSorted.length; i++) {
    if (currentSorted[i] !== originalSorted[i]) {
      return true
    }
  }
  return false
}
```

Esta abordagem é mais eficiente porque:

- Evite o custo de ordenar e juntar quando os comprimentos próximos
- Evita alocar strings grandes para o join (importante em arrays grandes)
- Evita mudar os arrays originais
- Voltar cedo ao encontrar diferença
