---
title: Usar atualizações funcionais de setState
impact: MEDIUM
impactDescription: evita fechamentos obsoletos e recriação desnecessária de retornos de chamada
tags: react, hooks, useState, useCallback, callbacks, closures
---

## Usar atualizações funcionais de setState

Ao atualizar o estado com base no valor atual, use a forma funcional do `setState` em vez de referenciar a variável de estado diretamente. Isso evita fechamentos obsoletos, dispensa dependências desnecessárias e estabiliza referências de retornos de chamada.

**Incorreto (exige estado nas dependências):**

```tsx
function TodoList() {
  const [items, setItems] = useState(initialItems)

  // Callback must depend on items, recreated on every items change
  const addItems = useCallback(
    (newItems: Item[]) => {
      setItems([...items, ...newItems])
    },
    [items],
  ) // ❌ items dependency causes recreations

  // Risk of stale closure if dependency is forgotten
  const removeItem = useCallback((id: string) => {
    setItems(items.filter((item) => item.id !== id))
  }, []) // ❌ Missing items dependency - will use stale items!

  return <ItemsEditor items={items} onAdd={addItems} onRemove={removeItem} />
}
```

O primeiro callback é recriado sempre que `items` muda, o que pode forçar a re-renderização em filhos. O segundo tem bug de encerramento obsoleta — referência sempre o `items` inicial.

**Correto (callbacks resultantes, sem fechamento obsoleto):**

```tsx
function TodoList() {
  const [items, setItems] = useState(initialItems)

  // Stable callback, never recreated
  const addItems = useCallback((newItems: Item[]) => {
    setItems((curr) => [...curr, ...newItems])
  }, []) // ✅ No dependencies needed

  // Always uses latest state, no stale closure risk
  const removeItem = useCallback((id: string) => {
    setItems((curr) => curr.filter((item) => item.id !== id))
  }, []) // ✅ Safe and stable

  return <ItemsEditor items={items} onAdd={addItems} onRemove={removeItem} />
}
```

**Benefícios:**

1. **Referências de retorno de chamada resultam** — não é preciso recriar sempre que o estado muda
2. **Sem fechamentos obsoletos** — trabalha sempre com o estado mais recente
3. **Menos dependências** — matrizes de dependência mais simples e menor risco de vazamentos
4. **Menos bugs** — elimine a fonte mais comum de bugs de encerramento no React

**Quando usar atualização funcional:**

- Qualquer `setState` que dependa do estado atual
- Dentro de `useCallback`/`useMemo` quando precisar do estado
- Manipuladores de eventos que consultam estado
- Operações assíncronas que atualizam estado

**Quando atualização direta é aceitável:**

- Definir um valor fixo: `setCount(0)`
- Defina apenas a partir de props/argumentos: `setName(newName)`
- O novo valor não depende do anterior

**Nota:** Com [React Compiler](https://react.dev/learn/react-compiler), o compilador pode gerenciar vários casos, mas atualizações funcionais são recomendadas para correção e para evitar fechamentos obsoletos.
