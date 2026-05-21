---
title: Visibilidade de conteúdo CSS para listas mais longas
impact: HIGH
impactDescription: renderização inicial mais rápida
tags: rendering, css, content-visibility, long-lists
---

## CSS content-visibility para listas mais longas

Aplique `content-visibility: auto` para adiar renderização fora da tela.

**CSS:**

```css
.message-item {
  content-visibility: auto;
  contain-intrinsic-size: 0 80px;
}
```

**Exemplo:**

```tsx
function MessageList({ messages }: { messages: Message[] }) {
  return (
    <div className="overflow-y-auto h-screen">
      {messages.map((msg) => (
        <div key={msg.id} className="message-item">
          <Avatar user={msg.author} />
          <div>{msg.content}</div>
        </div>
      ))}
    </div>
  )
}
```

Para 1000 mensagens, o navegador pula layout/pintura de ~990 itens fora da tela (renderização inicial ~10× mais rápida).
