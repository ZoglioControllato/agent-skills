# Referência da API do Vectorize

## Tipos

```typescript
interface VectorizeVector {
  id: string // Max 64 bytes
  values: number[] // Must match index dimensions
  namespace?: string // Optional partition (max 64 bytes)
  metadata?: Record<string, any> // Max 10 KiB
}
```

## Query

```typescript
const matches = await env.VECTORIZE.query(queryVector, {
  topK: 10, // Max 100 (or 20 with returnValues/returnMetadata:"all")
  returnMetadata: 'indexed', // "none" | "indexed" | "all"
  returnValues: false,
  namespace: 'tenant-123',
  filter: { category: 'docs' },
})
// matches.matches[0] = { id, score, metadata? }
```

**returnMetadata:** `"none"` (mais rápido) → `"indexed"` (recomendado) → `"all"` (topK máx. 20)

**queryById (somente V2):** busca usando um vetor existente como consulta.

```typescript
await env.VECTORIZE.queryById('doc-123', { topK: 5 })
```

## Insert/Upsert

```typescript
// Insert: ignores duplicates (keeps first)
await env.VECTORIZE.insert([{ id, values, metadata }])

// Upsert: overwrites duplicates (keeps last)
await env.VECTORIZE.upsert([{ id, values, metadata }])
```

**Máx. 500 vetores por chamada.** Consultável após 5–10 segundos.

## Outras operações

```typescript
// Get by IDs
const vectors = await env.VECTORIZE.getByIds(['id1', 'id2'])

// Delete (max 1000 IDs per call)
await env.VECTORIZE.deleteByIds(['id1', 'id2'])

// Index info
const info = await env.VECTORIZE.describe()
// { dimensions, metric, vectorCount }
```

## Filtragem

Exige índice de metadados. Operadores de filtro:

| Operador                     | Exemplo                          |
| ---------------------------- | -------------------------------- |
| `$eq` (implícito)            | `{ category: "docs" }`           |
| `$ne`                        | `{ status: { $ne: "deleted" } }` |
| `$in` / `$nin`               | `{ tag: { $in: ["sale"] } }`     |
| `$lt`, `$lte`, `$gt`, `$gte` | `{ price: { $lt: 100 } }`        |

**Restrições:** máx. 2048 bytes, sem pontos/`$` nas chaves, valores: string/número/boolean/null.

## Desempenho

| Configuração                | Limite topK | Velocidade  |
| --------------------------- | ----------- | ----------- |
| Sem metadados               | 100         | Mais rápida |
| `returnMetadata: "indexed"` | 100         | Rápida      |
| `returnMetadata: "all"`     | 20          | Mais lenta  |
| `returnValues: true`        | 20          | Mais lenta  |

**Operações em lote:** sempre em lotes (500/chamada) para melhor vazão.

```typescript
for (let i = 0; i < vectors.length; i += 500) {
  await env.VECTORIZE.upsert(vectors.slice(i, i + 500))
}
```

Documentação localizada no ecossistema mantido pelo Controllato Club.
