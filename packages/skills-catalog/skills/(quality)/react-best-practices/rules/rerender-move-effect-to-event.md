---
title: Colocar lógica de interação nos manipuladores de eventos
impact: MEDIUM
impactDescription: evita reexecuções de efeitos e efeitos colaterais duplicados
tags: rerender, useEffect, events, side-effects, dependencies
---

## Colocar lógica de interação nos manipuladores de evento

Se um efeito colateral decorre de uma ação específica (enviar, clicar, arrastar), execute-o no próprio manipulador. Não modele só com estado + effect: effect rerodam quando outras deps mudam e a ação pode duplicar.

**Incorreto (ação modelada como estado + efeito):**

```tsx
function Form() {
  const [submitted, setSubmitted] = useState(false)
  const theme = useContext(ThemeContext)

  useEffect(() => {
    if (submitted) {
      post('/api/register')
      showToast('Registered', theme)
    }
  }, [submitted, theme])

  return <button onClick={() => setSubmitted(true)}>Submit</button>
}
```

**Correto (fazer no manipulador):**

```tsx
function Form() {
  const theme = useContext(ThemeContext)

  function handleSubmit() {
    post('/api/register')
    showToast('Registered', theme)
  }

  return <button onClick={handleSubmit}>Submit</button>
}
```

Referência: [Este código deve ser movido para um manipulador de eventos?](https://react.dev/learn/removing-effect-dependencies#should-this-code-move-to-an-event-handler)
