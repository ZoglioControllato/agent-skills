# Padrões com Vectorize

## Integração com Workers AI

```typescript
// Generate embedding + query
const result = await env.AI.run('@cf/baai/bge-base-en-v1.5', { text: [query] })
const matches = await env.VECTORIZE.query(result.data[0], { topK: 5 }) // Pass data[0]!
```

| Modelo                       | Dimensões         |
| ---------------------------- | ----------------- |
| `@cf/baai/bge-small-en-v1.5` | 384               |
| `@cf/baai/bge-base-en-v1.5`  | 768 (recomendado) |
| `@cf/baai/bge-large-en-v1.5` | 1024              |

## Integração com OpenAI

```typescript
const response = await openai.embeddings.create({ model: 'text-embedding-ada-002', input: query })
const matches = await env.VECTORIZE.query(response.data[0].embedding, { topK: 5 })
```

## Padrão RAG

```typescript
// 1. Embed query
const emb = await env.AI.run('@cf/baai/bge-base-en-v1.5', { text: [query] })

// 2. Search vectors
const matches = await env.VECTORIZE.query(emb.data[0], { topK: 5, returnMetadata: 'indexed' })

// 3. Fetch full docs from R2/D1/KV
const docs = await Promise.all(matches.matches.map((m) => env.R2.get(m.metadata.key).then((o) => o?.text())))

// 4. Generate with context
const answer = await env.AI.run('@cf/meta/llama-3-8b-instruct', {
  prompt: `Context:\n${docs.filter(Boolean).join('\n\n')}\n\nQuestion: ${query}\n\nAnswer:`,
})
```

## Multi-inquilino

### Namespaces (< 50K inquilinos, mais rápido)

```typescript
await env.VECTORIZE.upsert([{ id: '1', values: emb, namespace: `tenant-${id}` }])
await env.VECTORIZE.query(vec, { namespace: `tenant-${id}`, topK: 10 })
```

### Filtro por metadados (> 50K inquilinos)

```bash
wrangler vectorize create-metadata-index my-index --property-name=tenantId --type=string
```

```typescript
await env.VECTORIZE.upsert([{ id: '1', values: emb, metadata: { tenantId: id } }])
await env.VECTORIZE.query(vec, { filter: { tenantId: id }, topK: 10 })
```

## Busca híbrida

```typescript
const matches = await env.VECTORIZE.query(vec, {
  topK: 20,
  filter: {
    category: { $in: ['tech', 'science'] },
    published: { $gte: lastMonthTimestamp },
  },
})
```

## Ingestão em lote

```typescript
const BATCH = 500
for (let i = 0; i < vectors.length; i += BATCH) {
  await env.VECTORIZE.upsert(vectors.slice(i, i + BATCH))
}
```

## Boas práticas

1. Passe **`data[0]`**, não `data` nem a resposta completa
2. **Lotes de 500** vetores por upsert
3. **Crie índices de metadados** antes de inserir
4. **Use namespaces** para isolamento por inquilino (mais rápido que filtros)
5. **`returnMetadata: "indexed"`** para melhor equilíbrio velocidade/dados
6. **Considere atraso de 5–10s** em mutações assíncronas

Documentação localizada no ecossistema mantido pelo Controllato Club.
