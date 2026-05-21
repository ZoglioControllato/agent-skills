---
title: Use componentes compostos
impact: HIGH
impactDescription: permite composição flexível sem perfuração de hélice
tags: composition, compound-components, architecture
---

## Use componentes compostos

Estruture componentes complexos como componentes compostos com um contexto compartilhado. Cada
O subcomponente acessa o estado compartilhado por meio de contexto, não de adereços. Os consumidores compõem o
peças que eles precisam.

**Incorreto (componente monolítico com suportes de renderização):**

```tsx
function Composer({ renderHeader, renderFooter, renderActions, showAttachments, showFormatting, showEmojis }: Props) {
  return (
    <form>
      {renderHeader?.()}
      <Input />
      {showAttachments && <Attachments />}
      {renderFooter ? (
        renderFooter()
      ) : (
        <Footer>
          {showFormatting && <Formatting />}
          {showEmojis && <Emojis />}
          {renderActions?.()}
        </Footer>
      )}
    </form>
  )
}
```

**Correto (componentes compostos com contexto compartilhado):**

```tsx
const ComposerContext = createContext<ComposerContextValue | null>(null)

function ComposerProvider({ children, state, actions, meta }: ProviderProps) {
  return <ComposerContext value={{ state, actions, meta }}>{children}</ComposerContext>
}

function ComposerFrame({ children }: { children: React.ReactNode }) {
  return <form>{children}</form>
}

function ComposerInput() {
  const {
    state,
    actions: { update },
    meta: { inputRef },
  } = use(ComposerContext)
  return (
    <TextInput ref={inputRef} value={state.input} onChangeText={(text) => update((s) => ({ ...s, input: text }))} />
  )
}

function ComposerSubmit() {
  const {
    actions: { submit },
  } = use(ComposerContext)
  return <Button onPress={submit}>Send</Button>
}

// Export as compound component
const Composer = {
  Provider: ComposerProvider,
  Frame: ComposerFrame,
  Input: ComposerInput,
  Submit: ComposerSubmit,
  Header: ComposerHeader,
  Footer: ComposerFooter,
  Attachments: ComposerAttachments,
  Formatting: ComposerFormatting,
  Emojis: ComposerEmojis,
}
```

**Uso:**

```tsx
<Composer.Provider state={state} actions={actions} meta={meta}>
  <Composer.Frame>
    <Composer.Header />
    <Composer.Input />
    <Composer.Footer>
      <Composer.Formatting />
      <Composer.Submit />
    </Composer.Footer>
  </Composer.Frame>
</Composer.Provider>
```

Os consumidores compõem explicitamente exatamente o que precisam. Sem condicionais ocultas. E o estado, as ações e o meta são injetados com dependência por um provedor pai, permitindo vários usos da mesma estrutura de componentes.
