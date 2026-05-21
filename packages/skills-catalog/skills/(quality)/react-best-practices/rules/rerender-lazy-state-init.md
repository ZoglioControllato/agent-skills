---
title: Usar inicialização preguiçosa de estado
impact: MEDIUM
impactDescription: evita trabalho repetido em todo render
tags: react, hooks, useState, performance, initialization
---

## Usar inicialização preguiçosa de estado

Para valores iniciais caros, passe uma função para `useState`. Sem a forma preguiçosa, o inicializador roda em todo render mesmo quando o resultado só vale na primeira montagem.

**Incorreto (roda em todo render):**

```tsx
function FilteredList({ items }: { items: Item[] }) {
  // buildSearchIndex() runs on EVERY render, even after initialization
  const [searchIndex, setSearchIndex] = useState(buildSearchIndex(items))
  const [query, setQuery] = useState('')

  // When query changes, buildSearchIndex runs again unnecessarily
  return <SearchResults index={searchIndex} query={query} />
}

function UserProfile() {
  // JSON.parse runs on every render
  const [settings, setSettings] = useState(JSON.parse(localStorage.getItem('settings') || '{}'))

  return <SettingsForm settings={settings} onChange={setSettings} />
}
```

**Correto (roda só uma vez):**

```tsx
function FilteredList({ items }: { items: Item[] }) {
  // buildSearchIndex() runs ONLY on initial render
  const [searchIndex, setSearchIndex] = useState(() => buildSearchIndex(items))
  const [query, setQuery] = useState('')

  return <SearchResults index={searchIndex} query={query} />
}

function UserProfile() {
  // JSON.parse runs only on initial render
  const [settings, setSettings] = useState(() => {
    const stored = localStorage.getItem('settings')
    return stored ? JSON.parse(stored) : {}
  })

  return <SettingsForm settings={settings} onChange={setSettings} />
}
```

Use a inicialização lenta ao computar o estado inicial a partir de `localStorage`/`sessionStorage`, montar estruturas (índices, mapas), ler do DOM ou fazer transformações pesadas.

Para primitivos simples (`useState(0)`), referências diretas (`useState(props.value)`) ou literais baratos (`useState({})`), a forma com função não é necessária.
