---
title: useEffectEvent para referências de retorno de chamada estáveis
impact: LOW
impactDescription: evita repetições de efeitos
tags: avançado, ganchos, useEffectEvent, refs, otimização
---

## useEffectEvent para referências de retorno de chamada estáveis

Acesse os valores mais recentes em retornos de chamada sem adicioná-los a matrizes de dependência. Impede repetições de efeitos, evitando fechamentos obsoletos.

**Incorreto (o efeito é executado novamente a cada alteração de retorno de chamada):**

```tsx
function SearchInput({ onSearch }: { onSearch: (q: string) => void }) {
  const [query, setQuery] = useState('')

  useEffect(() => {
    const timeout = setTimeout(() => onSearch(query), 300)
    return () => clearTimeout(timeout)
  }, [query, onSearch])
}
```

**Correto (usando useEffectEvent do React):**

```tsx
import { useEffectEvent } from 'react'

function SearchInput({ onSearch }: { onSearch: (q: string) => void }) {
  const [query, setQuery] = useState('')
  const onSearchEvent = useEffectEvent(onSearch)

  useEffect(() => {
    const timeout = setTimeout(() => onSearchEvent(query), 300)
    return () => clearTimeout(timeout)
  }, [query])
}
```
