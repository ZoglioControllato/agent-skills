# Padrões de composição de reação

**Versão 1.0.0**  
Engenharia  
Janeiro de 2026

> **Nota:**  
> Este documento é principalmente para agentes e LLMs seguirem durante a manutenção,  
> gerar ou refatorar bases de código React usando composição. Humanos  
> também pode ser útil, mas a orientação aqui é otimizada para automação  
> e consistência por fluxos de trabalho assistidos por IA.

---

## Resumo

Padrões de composição para construir componentes React flexíveis e de fácil manutenção. Evite a proliferação de props booleanos usando componentes compostos, levantando estados e compondo componentes internos. Esses padrões tornam as bases de código mais fáceis para humanos e agentes de IA trabalharem à medida que aumentam.

---

## Índice

1. [Arquitetura de componentes](arquitetura de componentes nº 1) — **ALTA**
   - 1.1 [Evitar a proliferação de props booleanos](#11-evitar-proliferação de props booleanos)
   - 1.2 [Usar componentes compostos](#12-use-compound-components)
2. [Gestão Estadual](#2-gestão estadual) — **MÉDIO**
   - 2.1 [Desacoplar gerenciamento de estado da UI](#21-desacoplar gerenciamento de estado da interface do usuário)
   - 2.2 [Definir interfaces de contexto genérico para injeção de dependência](#22-define-generic-context-i

interfaces para injeção de dependência)

- 2.3 [Lift State into Provider Components](#23-lift-state-into-provider-components)

3. [Padrões de implementação](#3-padrões de implementação) — **MÉDIO**
   - 3.1 [Criar variantes de componentes explícitos](#31-create-explicit-component-variants)
   - 3.2 [Prefira compor filhos em vez de adereços de renderização](#32-preferir-compor-filhos-em vez de adereços de renderização)
4. [APIs React 19](#4-react-19-apis) — **MÉDIO**
   - 4.1 [Reagir

19 alterações de API](#41-react-19-api-changes)

---

## 1. Arquitetura de Componentes

**Impacto: ALTO**

Padrões fundamentais para estruturar componentes para evitar prop
proliferação e permitir uma composição flexível.

### 1.1 Evite a proliferação de objetos booleanos

**Impacto: CRÍTICO (evita variantes de componentes que não podem ser mantidas)**

Não adicione adereços booleanos como `isThread`, `isEditing`, `isDMThread` para personalizar

comportamento do componente. Cada booleano duplica estados possíveis e cria

lógica condicional insustentável. Em vez disso, use composição.

**Incorreto: adereços booleanos criam complexidade exponencial**

```tsx
function Composer({ onSubmit, isThread, channelId, isDMThread, dmId, isEditing, isForwarding }: Props) {
  return (
    <form>
      <Header />
      <Input />
      {isDMThread ? <AlsoSendToDMField id={dmId} /> : isThread ? <AlsoSendToChannelField id={channelId} /> : null}
      {isEditing ? <EditActions /> : isForwarding ? <ForwardActions /> : <DefaultActions />}
      <Footer onSubmit={onSubmit} />
    </form>
  )
}
```

**Correto: a composição elimina condicionais**

```tsx
// Channel composer
function ChannelComposer() {
  return (
    <Composer.Frame>
      <Composer.Header />
      <Composer.Input />
      <Composer.Footer>
        <Composer.Attachments />
        <Composer.Formatting />
        <Composer.Emojis />
        <Composer.Submit />
      </Composer.Footer>
    </Composer.Frame>
  )
}

// Thread composer - adds "also send to channel" field
function ThreadComposer({ channelId }: { channelId: string }) {
  return (
    <Composer.Frame>
      <Composer.Header />
      <Composer.Input />
      <AlsoSendToChannelField id={channelId} />
      <Composer.Footer>
        <Composer.Formatting />
        <Composer.Emojis />
        <Composer.Submit />
      </Composer.Footer>
    </Composer.Frame>
  )
}

// Edit composer - different footer actions
function EditComposer() {
  return (
    <Composer.Frame>
      <Composer.Input />
      <Composer.Footer>
        <Composer.Formatting />
        <Composer.Emojis />
        <Composer.CancelEdit />
        <Composer.SaveEdit />
      </Composer.Footer>
    </Composer.Frame>
  )
}
```

Cada variante é explícita sobre o que ela renderiza. Podemos compartilhar internos sem

compartilhando um único pai monolítico.

### 1.2 Use componentes compostos

**Impacto: ALTO (permite composição flexível sem perfuração de hélice)**

Estruture componentes complexos como componentes compostos com um contexto compartilhado. Cada

O subcomponente acessa o estado compartilhado por meio de contexto, não de adereços. Os consumidores compõem o

peças que eles precisam.

**Incorreto: componente monolítico com adereços de renderização**

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

**Correto: componentes compostos com contexto compartilhado**

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

---

## 2. Gestão do Estado

**Impacto: MÉDIO**

Padrões para elevar o estado e gerenciar o contexto compartilhado entre
componentes compostos.

### 2.1 Desacoplar o gerenciamento de estado da UI

**Impacto: MÉDIO (permite a troca de implementações de estado sem alterar a UI)**

O componente provedor deve ser o único local que sabe como o estado é gerenciado.

Os componentes da UI consomem a interface de contexto – eles não sabem se o estado vem

useState, Zustand ou uma sincronização de servidor.

**Incorreto: IU acoplada à implementação de estado**

```tsx
function ChannelComposer({ channelId }: { channelId: string }) {
  // UI component knows about global state implementation
  const state = useGlobalChannelState(channelId)
  const { submit, updateInput } = useChannelSync(channelId)

  return (
    <Composer.Frame>
      <Composer.Input value={state.input} onChange={(text) => sync.updateInput(text)} />
      <Composer.Submit onPress={() => sync.submit()} />
    </Composer.Frame>
  )
}
```

**Correto: gerenciamento de estado isolado no provedor**

```tsx
// Provider handles all state management details
function ChannelProvider({ channelId, children }: { channelId: string; children: React.ReactNode }) {
  const { state, update, submit } = useGlobalChannel(channelId)
  const inputRef = useRef(null)

  return (
    <Composer.Provider state={state} actions={{ update, submit }} meta={{ inputRef }}>
      {children}
    </Composer.Provider>
  )
}

// UI component only knows about the context interface
function ChannelComposer() {
  return (
    <Composer.Frame>
      <Composer.Header />
      <Composer.Input />
      <Composer.Footer>
        <Composer.Submit />
      </Composer.Footer>
    </Composer.Frame>
  )
}

// Usage
function Channel({ channelId }: { channelId: string }) {
  return (
    <ChannelProvider channelId={channelId}>
      <ChannelComposer />
    </ChannelProvider>
  )
}
```

**Provedores diferentes, mesma IU:**

```tsx
// Local state for ephemeral forms
function ForwardMessageProvider({ children }) {
  const [state, setState] = useState(initialState)
  const forwardMessage = useForwardMessage()

  return (
    <Composer.Provider state={state} actions={{ update: setState, submit: forwardMessage }}>
      {children}
    </Composer.Provider>
  )
}

// Global synced state for channels
function ChannelProvider({ channelId, children }) {
  const { state, update, submit } = useGlobalChannel(channelId)

  return (
    <Composer.Provider state={state} actions={{ update, submit }}>
      {children}
    </Composer.Provider>
  )
}
```

O mesmo componente `Composer.Input` funciona com ambos os provedores porque apenas

depende da interface de contexto, não da implementação.

### 2.2 Definir interfaces de contexto genéricas para injeção de dependência

**Impacto: ALTO (permite estado injetável de dependência em casos de uso)**

Defina uma **interface genérica** para o contexto do seu componente com três partes:

`estado`, `ações` e `meta`. Esta interface é um contrato que qualquer provedor

pode implementar - permitindo que os mesmos componentes de UI funcionem com diferentes

implementações estaduais.

**Princípio fundamental:** Elevar o estado, compor os internos, criar o estado

injetável por dependência.

**Incorreto: IU acoplada à implementação de estado específico**

```tsx
function ComposerInput() {
  // Tightly coupled to a specific hook
  const { input, setInput } = useChannelComposerState()
  return <TextInput value={input} onChangeText={setInput} />
}
```

**Correto: interface genérica permite injeção de dependência**

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

```tsx
function ForwardMessageDialog() {
  return (
    <ForwardMessageProvider>
      <Dialog>
        {/* The composer UI */}
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

O que importa é o limite do provedor, não o aninhamento visual. Componentes que

precisa de estado compartilhado não precisa estar dentro do `Composer.Frame`. Eles só precisam

estar dentro do provedor.

O `ForwardButton` e `MessagePreview` não estão visualmente dentro do compositor

caixa, mas eles ainda podem acessar seu estado e ações. Este é o poder de

elevando o estado a provedores.

A IU consiste em bits reutilizáveis ​​que você compõe juntos. O estado é injetado por dependência

pelo provedor. Troque o provedor, mantenha a UI.

### 2.3 Elevar o estado nos componentes do provedor

**Impacto: ALTO (permite o compartilhamento de estado fora dos limites do componente)**

Mova o gerenciamento de estado para componentes de provedor dedicados. Isso permite que o irmão

componentes fora da UI principal para acessar e modificar o estado sem perfuração de suporte

ou árbitros estranhos.

**Incorreto: estado preso dentro do componente**

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

**Incorreto: useEffect para sincronizar o estado**

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

**Incorreto: lendo o estado da referência no envio**

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

**Correto: estado transferido para o provedor**

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

---

## 3. Padrões de implementação

**Impacto: MÉDIO**

Técnicas específicas para implementação de componentes compostos e
provedores de contexto.

### 3.1 Criar variantes de componentes explícitos

**Impacto: MÉDIO (código autodocumentado, sem condicionais ocultas)**

Em vez de um componente com muitos adereços booleanos, crie uma variante explícita

componentes. Cada variante compõe as peças que necessita. Os documentos de código

em si.

**Incorreto: um componente, muitos modos**

```tsx
// What does this component actually render?
<Composer isThread isEditing={false} channelId="abc" showAttachments showFormatting={false} />
```

**Correto: variantes explícitas**

```tsx
// Immediately clear what this renders
<ThreadComposer channelId="abc" />

// Or
<EditMessageComposer messageId="xyz" />

// Or
<ForwardMessageComposer messageId="123" />
```

Cada implementação é única, explícita e independente. No entanto, cada um deles pode

use partes compartilhadas.

**Implementação:**

```tsx
function ThreadComposer({ channelId }: { channelId: string }) {
  return (
    <ThreadProvider channelId={channelId}>
      <Composer.Frame>
        <Composer.Input />
        <AlsoSendToChannelField channelId={channelId} />
        <Composer.Footer>
          <Composer.Formatting />
          <Composer.Emojis />
          <Composer.Submit />
        </Composer.Footer>
      </Composer.Frame>
    </ThreadProvider>
  )
}

function EditMessageComposer({ messageId }: { messageId: string }) {
  return (
    <EditMessageProvider messageId={messageId}>
      <Composer.Frame>
        <Composer.Input />
        <Composer.Footer>
          <Composer.Formatting />
          <Composer.Emojis />
          <Composer.CancelEdit />
          <Composer.SaveEdit />
        </Composer.Footer>
      </Composer.Frame>
    </EditMessageProvider>
  )
}

function ForwardMessageComposer({ messageId }: { messageId: string }) {
  return (
    <ForwardMessageProvider messageId={messageId}>
      <Composer.Frame>
        <Composer.Input placeholder="Add a message, if you'd like." />
        <Composer.Footer>
          <Composer.Formatting />
          <Composer.Emojis />
          <Composer.Mentions />
        </Composer.Footer>
      </Composer.Frame>
    </ForwardMessageProvider>
  )
}
```

Cada variante é explícita sobre:

- Qual provedor/estado ele usa

- Quais elementos da interface do usuário ele inclui

- Quais ações estão disponíveis

Nenhuma combinação de objetos booleanos para raciocinar. Não há estados impossíveis.

### 3.2 Prefira composição infantil em vez de acessórios de renderização

**Impacto: MÉDIO (composição mais limpa, melhor legibilidade)**

Use `children` para composição em vez de adereços `renderX`. As crianças são mais

legível, compõe naturalmente e não requer compreensão de retorno de chamada

assinaturas.

**Incorreto: adereços de renderização**

```tsx
function Composer({
  renderHeader,
  renderFooter,
  renderActions,
}: {
  renderHeader?: () => React.ReactNode
  renderFooter?: () => React.ReactNode
  renderActions?: () => React.ReactNode
}) {
  return (
    <form>
      {renderHeader?.()}
      <Input />
      {renderFooter ? renderFooter() : <DefaultFooter />}
      {renderActions?.()}
    </form>
  )
}

// Usage is awkward and inflexible
return (
  <Composer
    renderHeader={() => <CustomHeader />}
    renderFooter={() => (
      <>
        <Formatting />
        <Emojis />
      </>
    )}
    renderActions={() => <SubmitButton />}
  />
)
```

**Correto: componentes compostos com filhos**

```tsx
function ComposerFrame({ children }: { children: React.ReactNode }) {
  return <form>{children}</form>
}

function ComposerFooter({ children }: { children: React.ReactNode }) {
  return <footer className="flex">{children}</footer>
}

// Usage is flexible
return (
  <Composer.Frame>
    <CustomHeader />
    <Composer.Input />
    <Composer.Footer>
      <Composer.Formatting />
      <Composer.Emojis />
      <SubmitButton />
    </Composer.Footer>
  </Composer.Frame>
)
```

**Quando os adereços de renderização são apropriados:**

```tsx
// Render props work well when you need to pass data back
<List data={items} renderItem={({ item, index }) => <Item item={item} index={index} />} />
```

Use adereços de renderização quando o pai precisar fornecer dados ou estado ao filho.

Use filhos ao compor uma estrutura estática.

---

## 4. Reagir 19 APIs

**Impacto: MÉDIO**

Reaja apenas para maiores de 19 anos. Não use `forwardRef`; use `use()` em vez de `useContext()`.

### 4.1 Alterações na API do React 19

**Impacto: MÉDIO (definições de componentes e uso de contexto mais limpos)**

> **⚠️ Somente React 19+.** Pule esta opção se você estiver no React 18 ou anterior.

No React 19, `ref` agora é um suporte regular (não é necessário wrapper `forwardRef`) e `use()` substitui `useContext()`.

**Incorreto: forwardRef no React 19**

```tsx
const ComposerInput = forwardRef<TextInput, Props>((props, ref) => {
  return <TextInput ref={ref} {...props} />
})
```

**Correto: ref como um adereço regular**

```tsx
function ComposerInput({ ref, ...props }: Props & { ref?: React.Ref<TextInput> }) {
  return <TextInput ref={ref} {...props} />
}
```

**Incorreto: useContext no React 19**

```tsx
const value = useContext(MyContext)
```

**Correto: use em vez de useContext**

```tsx
const value = use(MyContext)
```

`use()` também pode ser chamado condicionalmente, ao contrário de `useContext()`.

---

## Referências

1. [https://react.dev](https://react.dev)
2. [https://react.dev/learn/passing-data-deeply-with-context](https://react.dev/learn/passing-data-deeply-with-context)
3. [https://react.dev/reference/react/use](https://react.dev/reference/react/use)
