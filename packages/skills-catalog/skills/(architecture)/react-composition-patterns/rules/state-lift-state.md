---
title: Transforme o estado em componentes do provedor
impact: HIGH
impactDescription: permite o compartilhamento de estado fora dos limites dos componentes
tags: composition, state, context, providers
---

## Transforme o estado em componentes do provedor

Mova o gerenciamento de estado para componentes de provedor dedicados. Isso permite que o irmão
componentes fora da UI principal para acessar e modificar o estado sem perfuração de suporte
ou árbitros estranhos.

**Incorreto (estado preso dentro do componente):**

```tsx
function ForwardMessageComposer() {
  const [state, setState] = useState(initialState)
  const forwardMessage = useForwardMessage()

  return (
    <Composer.Frame>
      <Composer.Input />
      <Composer.Footer />
    </Composer.Frame>
  )
}

// Problem: How does this button access composer state?
function ForwardMessageDialog() {
  return (
    <Dialog>
      <ForwardMessageComposer />
      <MessagePreview /> {/* Needs composer state */}
      <DialogActions>
        <CancelButton />
        <ForwardButton /> {/* Needs to call submit */}
      </DialogActions>
    </Dialog>
  )
}
```

**Incorreto (useEffect para sincronizar o estado):**

```tsx
function ForwardMessageDialog() {
  const [input, setInput] = useState('')
  return (
    <Dialog>
      <ForwardMessageComposer onInputChange={setInput} />
      <MessagePreview input={input} />
    </Dialog>
  )
}

function ForwardMessageComposer({ onInputChange }) {
  const [state, setState] = useState(initialState)
  useEffect(() => {
    onInputChange(state.input) // Sync on every change 😬
  }, [state.input])
}
```

**Incorreto (leitura do estado da referência no envio):**

```tsx
function ForwardMessageDialog() {
  const stateRef = useRef(null)
  return (
    <Dialog>
      <ForwardMessageComposer stateRef={stateRef} />
      <ForwardButton onPress={() => submit(stateRef.current)} />
    </Dialog>
  )
}
```

**Correto (estado transferido para o provedor):**

```tsx
function ForwardMessageProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState(initialState)
  const forwardMessage = useForwardMessage()
  const inputRef = useRef(null)

  return (
    <Composer.Provider state={state} actions={{ update: setState, submit: forwardMessage }} meta={{ inputRef }}>
      {children}
    </Composer.Provider>
  )
}

function ForwardMessageDialog() {
  return (
    <ForwardMessageProvider>
      <Dialog>
        <ForwardMessageComposer />
        <MessagePreview /> {/* Custom components can access state and actions */}
        <DialogActions>
          <CancelButton />
          <ForwardButton /> {/* Custom components can access state and actions */}
        </DialogActions>
      </Dialog>
    </ForwardMessageProvider>
  )
}

function ForwardButton() {
  const { actions } = use(Composer.Context)
  return <Button onPress={actions.submit}>Forward</Button>
}
```

O ForwardButton reside fora do Composer.Frame, mas ainda tem acesso ao
enviar ação porque está dentro do provedor. Mesmo que seja único
componente, ele ainda pode acessar o estado e as ações do compositor de fora do
A própria interface do usuário.

**Princípio principal:** Componentes que precisam de estado compartilhado não precisam ser visualmente
aninhados um dentro do outro – eles só precisam estar dentro do mesmo provedor.
