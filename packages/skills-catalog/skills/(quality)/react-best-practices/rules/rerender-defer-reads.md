---
title: Adiar leituras de estado até o ponto de uso
impact: MEDIUM
impactDescription: evita assinaturas solicitadas
tags: rerender, searchParams, localStorage, optimization
---

## Adiar leituras de estado até o ponto de uso

Não há estado sonoro dinâmico (`searchParams`, `localStorage`, etc.) se você só ler esses valores dentro dos retornos de chamada.

**Incorreto (assina qualquer alteração de searchParams):**

```tsx
function ShareButton({ chatId }: { chatId: string }) {
  const searchParams = useSearchParams()

  const handleShare = () => {
    const ref = searchParams.get('ref')
    shareChat(chatId, { ref })
  }

  return <button onClick={handleShare}>Share</button>
}
```

**Correto (lê sob demanda, sem assinatura):**

```tsx
function ShareButton({ chatId }: { chatId: string }) {
  const handleShare = () => {
    const params = new URLSearchParams(window.location.search)
    const ref = params.get('ref')
    shareChat(chatId, { ref })
  }

  return <button onClick={handleShare}>Share</button>
}
```
