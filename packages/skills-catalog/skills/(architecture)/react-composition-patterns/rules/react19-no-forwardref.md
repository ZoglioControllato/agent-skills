---
title: Reagir 19 alterações de API
impact: MEDIUM
impactDescription: definições de componentes mais limpas e uso de contexto
tags: react19, refs, context, hooks
---

## Reagir 19 alterações de API

> **⚠️ Somente React 19+.** Pule esta opção se você estiver no React 18 ou anterior.

No React 19, `ref` agora é um suporte regular (não é necessário wrapper `forwardRef`) e `use()` substitui `useContext()`.

**Incorreto (forwardRef no React 19):**

```tsx
const ComposerInput = forwardRef<TextInput, Props>((props, ref) => {
  return <TextInput ref={ref} {...props} />
})
```

**Correto (ref. como suporte regular):**

```tsx
function ComposerInput({ ref, ...props }: Props & { ref?: React.Ref<TextInput> }) {
  return <TextInput ref={ref} {...props} />
}
```

**Incorreto (useContext no React 19):**

```tsx
const value = useContext(MyContext)
```

**Correto (use em vez de useContext):**

```tsx
const value = use(MyContext)
```

`use()` também pode ser chamado condicionalmente, ao contrário de `useContext()`.
