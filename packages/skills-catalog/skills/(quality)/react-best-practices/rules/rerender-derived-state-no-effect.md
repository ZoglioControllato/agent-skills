---
title: Calcular estado derivado durante a renderização
impact: MEDIUM
impactDescription: evita renderizações redundantes e desvios de estado
tags: rerender, derived-state, useEffect, state
---

## Calcula o estado derivado durante a renderização

Se um valor pode ser derivado das props ou do estado atual, não guarde em estado nem atualize com efeito. Calcule durante o render para evitar renderizações extras e inconsistência entre estado derivado e fonte da verdade. Não atualize estado em efeitos apenas porque os props mudaram; prefira valores calculados ou redefinidos por `key`.

**Incorreto (estado e efeito redundantes):**

```tsx
function Form() {
  const [firstName, setFirstName] = useState('First')
  const [lastName, setLastName] = useState('Last')
  const [fullName, setFullName] = useState('')

  useEffect(() => {
    setFullName(firstName + ' ' + lastName)
  }, [firstName, lastName])

  return <p>{fullName}</p>
}
```

**Correto (derivado sem renderização):**

```tsx
function Form() {
  const [firstName, setFirstName] = useState('First')
  const [lastName, setLastName] = useState('Last')
  const fullName = firstName + ' ' + lastName

  return <p>{fullName}</p>
}
```

Referências: [Você pode não precisar de um efeito](https://react.dev/learn/you-might-not-need-an-effect)
