---
title: Usar useTransition em vez de estados de carregamento manuais
impact: LOW
impactDescription: reduz re-renderizações e esclarece o código
tags: rendering, transitions, useTransition, loading, state
---

## Usar useTransition em vez de estados de carregamento manuais

Use `useTransition` em vez do manual `useState` para estado de carregamento. Você ganha `isPending` integrado e o gerenciamento automático das transições.

**Incorreto (estado de carregamento manual):**

```tsx
function SearchResults() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const handleSearch = async (value: string) => {
    setIsLoading(true)
    setQuery(value)
    const data = await fetchResults(value)
    setResults(data)
    setIsLoading(false)
  }

  return (
    <>
      <input onChange={(e) => handleSearch(e.target.value)} />
      {isLoading && <Spinner />}
      <ResultsList results={results} />
    </>
  )
}
```

**Correto (useTransition com estado de pendência integrada):**

```tsx
import { useTransition, useState } from 'react'

function SearchResults() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [isPending, startTransition] = useTransition()

  const handleSearch = (value: string) => {
    setQuery(value) // Update input immediately

    startTransition(async () => {
      // Fetch and update results
      const data = await fetchResults(value)
      setResults(data)
    })
  }

  return (
    <>
      <input onChange={(e) => handleSearch(e.target.value)} />
      {isPending && <Spinner />}
      <ResultsList results={results} />
    </>
  )
}
```

**Benefícios:**

- **Pendente automático**: não precisa ficar fazendo `setIsLoading(true/false)` manualmente
- **Resiliência a erros**: o pendente volta ao normal mesmo quando a transição lança erro
- **Interface mais fluida**: mantém a UI responsiva durante as atualizações
- **Interrupções**: novas transições cancelam as anteriores pendentes automaticamente

Referência: [useTransition](https://react.dev/reference/react/useTransition)
