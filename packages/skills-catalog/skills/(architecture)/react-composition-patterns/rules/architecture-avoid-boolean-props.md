---
title: Evite a proliferação de objetos booleanos
impact: CRITICAL
impactDescription: evita variantes de componentes insustentáveis
tags: composition, props, architecture
---

## Evite a proliferação de objetos booleanos

Não adicione adereços booleanos como `isThread`, `isEditing`, `isDMThread` para personalizar
comportamento do componente. Cada booleano duplica estados possíveis e cria
lógica condicional insustentável. Em vez disso, use composição.

**Incorreto (adereços booleanos criam complexidade exponencial):**

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

**Correto (a composição elimina condicionais):**

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
