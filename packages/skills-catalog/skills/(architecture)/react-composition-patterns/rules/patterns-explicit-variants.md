---
title: Criar variantes de componentes explícitos
impact: MEDIUM
impactDescription: código autodocumentado, sem condicionais ocultas
tags: composition, variants, architecture
---

## Criar variantes de componentes explícitos

Em vez de um componente com muitos adereços booleanos, crie uma variante explícita
componentes. Cada variante compõe as peças que necessita. Os documentos de código
em si.

**Incorreto (um componente, vários modos):**

```tsx
// What does this component actually render?
<Composer isThread isEditing={false} channelId="abc" showAttachments showFormatting={false} />
```

**Correto (variantes explícitas):**

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
