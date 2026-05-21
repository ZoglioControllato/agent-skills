# Padrões do AI Search

## search() vs aiSearch()

| Uso                  | Método       | Retorno                                |
| -------------------- | ------------ | -------------------------------------- |
| UI custom, analytics | `search()`   | Só chunks brutos (~100–300 ms)         |
| Chatbots, Q&A        | `aiSearch()` | Resposta da IA + chunks (~500–2000 ms) |

## rewrite_query

| Config  | Use quando                                               |
| ------- | -------------------------------------------------------- |
| `true`  | Entrada do usuário (erros de digitação, consultas vagas) |
| `false` | Consultas geradas por LLM (já otimizadas)                |

## Multitenancy (por pasta)

```typescript
const answer = await env.AI.autorag('saas-docs').aiSearch({
  query: 'refund policy',
  model: '@cf/meta/llama-3.3-70b-instruct-fp8-fast',
  filters: {
    column: 'folder',
    operator: 'gte', // padrão "começa com"
    value: `tenants/${tenantId}/`,
  },
})
```

## Streaming

```typescript
const stream = await env.AI.autorag('docs').aiSearch({
  query,
  model: '@cf/meta/llama-3.3-70b-instruct-fp8-fast',
  stream: true,
})
return new Response(stream, { headers: { 'Content-Type': 'text/event-stream' } })
```

## Limiar de score

| Threshold    | Uso                             |
| ------------ | ------------------------------- |
| 0,3 (padrão) | Recall amplo, exploratório      |
| 0,5          | Equilibrado, padrão em produção |
| 0,7          | Alta precisão, exige acerto     |

## Template de system prompt

```typescript
const systemPrompt = `You are a documentation assistant.
- Answer ONLY based on provided context
- If context doesn't contain answer, say "I don't have information"
- Include code examples from context`
```

## Filtros compostos

```typescript
// OR: várias pastas
filters: {
  operator: "or",
  filters: [
    { column: "folder", operator: "gte", value: "docs/api/" },
    { column: "folder", operator: "gte", value: "docs/auth/" }
  ]
}

// AND: pasta + data
filters: {
  operator: "and",
  filters: [
    { column: "folder", operator: "gte", value: "docs/" },
    { column: "timestamp", operator: "gte", value: oneWeekAgoSeconds }
  ]
}
```

## Reranking

Habilite em casos críticos (adiciona ~300 ms de latência):

```typescript
reranking: { enabled: true, model: "@cf/baai/bge-reranker-base" }
```
