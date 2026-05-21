---
title: Inicialize o aplicativo uma vez, não por montagem
impact: LOW-MEDIUM
impactDescription: evita inicialização duplicada no desenvolvimento
tags: inicialização, useEffect, inicialização do aplicativo, efeitos colaterais
---

## Inicialize o aplicativo uma vez, não por montagem

Não coloque a inicialização de todo o aplicativo que deve ser executada uma vez por carregamento do aplicativo dentro de `useEffect([])` de um componente. Os componentes podem ser remontados e os efeitos serão executados novamente. Em vez disso, use um protetor de nível de módulo ou um init de nível superior no módulo de entrada.

**Incorreto (executado duas vezes no desenvolvimento, executado novamente na remontagem):**

```tsx
function Comp() {
  useEffect(() => {
    loadFromStorage()
    checkAuthToken()
  }, [])

  // ...
}
```

**Correto (uma vez por carregamento do aplicativo):**

```tsx
let didInit = false

function Comp() {
  useEffect(() => {
    if (didInit) return
    didInit = true
    loadFromStorage()
    checkAuthToken()
  }, [])

  // ...
}
```

Referência: [Inicializando o aplicativo](https://react.dev/learn/you-might-not-need-an-effect#initializing-the-application)
