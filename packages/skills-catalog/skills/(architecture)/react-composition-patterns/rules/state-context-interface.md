---
title: Definir interfaces de contexto genéricas para injeção de dependência
impact: HIGH
impactDescription: permite estado injetável de dependência em casos de uso
tags: composition, context, state, typescript, dependency-injection
---

## Definir interfaces de contexto genéricas para injeção de dependência

Defina uma **interface genérica** para o contexto do seu componente com três partes:
`estado`, `ações` e `meta`. Esta interface é um contrato que qualquer provedor
pode implementar - permitindo que os mesmos componentes de UI funcionem com diferentes
implementações estaduais.

**Princípio fundamental:** Elevar o estado, compor os internos, criar o estado
injetável por dependência.

**Incorreto (IU acoplada à implementação de estado específico):**

```tsx
function ComposerInput() {
  // Tightly coupled to a specific hook
  const { input, setInput } = useChannelComposerState()
  return <TextInput value={input} onChangeText={setInput} />
}
```

**Correto (interface genérica permite injeção de dependência):**

```tsx
// Define a GENERIC interface that any provider can implement
interface ComposerState {
  input: string
  attachments: Attachment[]
  isSubmitting: boolean
}

interface ComposerActions {
  update: (updater: (state: ComposerState) => ComposerState) => void
  submit: () => void
}

interface ComposerMeta {
  inputRef: React.RefObject<TextInput>
}

interface ComposerContextValue {
  state: ComposerState
  actions: ComposerActions
  meta: ComposerMeta
}

const ComposerContext = createContext<ComposerContextValue | null>(null)
```

**Os componentes da UI consomem a interface, não a implementação:**

```tsx
function ComposerInput() {
  const {
    state,
    actions: { update },
    meta,
  } = use(ComposerContext)

  // This component works with ANY provider that implements the interface
  return (
    <TextInput
      ref={meta.inputRef}
      value={state.input}
      onChangeText={(text) => update((s) => ({ ...s, input: text }))}
    />
  )
}
```

**Provedores diferentes implementam a mesma interface:**

```tsx
// Provider A: Local state for ephemeral forms
function ForwardMessageProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState(initialState)
  const inputRef = useRef(null)
  const submit = useForwardMessage()

  return (
    <ComposerContext
      value={{
        state,
        actions: { update: setState, submit },
        meta: { inputRef },
      }}
    >
      {children}
    </ComposerContext>
  )
}

// Provider B: Global synced state for channels
function ChannelProvider({ channelId, children }: Props) {
  const { state, update, submit } = useGlobalChannel(channelId)
  const inputRef = useRef(null)

  return (
    <ComposerContext
      value={{
        state,
        actions: { update, submit },
        meta: { inputRef },
      }}
    >
      {children}
    </ComposerContext>
  )
}
```

**A mesma IU composta funciona com ambos:**

```tsx
// Works with ForwardMessageProvider (local state)
<ForwardMessageProvider>
  <Composer.Frame>
    <Composer.Input />
    <Composer.Submit />
  </Composer.Frame>
</ForwardMessageProvider>

// Works with ChannelProvider (global synced state)
<ChannelProvider channelId="abc">
  <Composer.Frame>
    <Composer.Input />
    <Composer.Submit />
  </Composer.Frame>
</ChannelProvider>
```

**A UI personalizada fora do componente pode acessar estados e ações:**

O que importa é o limite do provedor, não o aninhamento visual. Componentes que
precisa de estado compartilhado não precisa estar dentro do `Composer.Frame`. Eles só precisam
estar dentro do provedor.```tsx
function ForwardMessageDialog() {
return (
<ForwardMessageProvider>
<Dialog>
{/_ The composer UI _/}
<Composer.Frame>
<Composer.Input placeholder="Add a message, if you'd like." />
<Composer.Footer>
<Composer.Formatting />
<Composer.Emojis />
</Composer.Footer>
</Composer.Frame>

        {/* Custom UI OUTSIDE the composer, but INSIDE the provider */}
        <MessagePreview />

        {/* Actions at the bottom of the dialog */}
        <DialogActions>
          <CancelButton />
          <ForwardButton />
        </DialogActions>
      </Dialog>
    </ForwardMessageProvider>

)
}

// This button lives OUTSIDE Composer.Frame but can still submit based on its context!
function ForwardButton() {
const {
actions: { submit },
} = use(ComposerContext)
return <Button onPress={submit}>Forward</Button>
}

// This preview lives OUTSIDE Composer.Frame but can read composer's state!
function MessagePreview() {
const { state } = use(ComposerContext)
return <Preview message={state.input} attachments={state.attachments} />
}

```
O `ForwardButton` e `MessagePreview` não estão visualmente dentro do compositor
caixa, mas eles ainda podem acessar seu estado e ações. Este é o poder de
elevando o estado a provedores.

A IU consiste em bits reutilizáveis ​​que você compõe juntos. O estado é injetado por dependência
pelo provedor. Troque o provedor, mantenha a UI.
```
