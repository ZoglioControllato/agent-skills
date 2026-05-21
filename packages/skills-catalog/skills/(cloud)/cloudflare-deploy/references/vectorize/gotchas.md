# Vectorize: armadilhas

## Avisos críticos

### Mutações assíncronas

Insert/upsert/delete retornam na hora, mas os vetores só ficam consultáveis após 5–10 segundos.

### Limite de tamanho de lote

**API Workers: máx. 500 vetores por chamada** (não documentado; trunca silenciosamente)

```typescript
// ✅ Chunk into 500
for (let i = 0; i < vectors.length; i += 500) {
  await env.VECTORIZE.upsert(vectors.slice(i, i + 500))
}
```

### Truncagem de metadados

`returnMetadata: "indexed"` devolve apenas os primeiros 64 bytes de strings. Use `"all"` para metadados completos (mas o topK máximo cai para 20).

### Limites de topK

| returnMetadata         | returnValues | Max topK |
| ---------------------- | ------------ | -------- |
| `"none"` / `"indexed"` | `false`      | 100      |
| `"all"`                | qualquer     | **20**   |
| qualquer               | `true`       | **20**   |

### Índices de metadados primeiro

Crie ANTES de inserir — vetores existentes não são reindexados retroativamente.

```bash
# ✅ Create index FIRST
wrangler vectorize create-metadata-index my-index --property-name=category --type=string
wrangler vectorize insert my-index --file=data.ndjson
```

### Configuração do índice imutável

Não dá para mudar dimensões/métrica após a criação. É preciso criar novo índice e migrar.

## Limites (V2)

| Recurso                    | Limite                         |
| -------------------------- | ------------------------------ |
| Vetores por índice         | 10.000.000                     |
| Dimensões máx.             | 1536                           |
| Upsert em lote (Workers)   | **500**                        |
| Metadados string indexados | **64 bytes**                   |
| Índices de metadados       | 10                             |
| Namespaces                 | 50.000 (pago) / 1.000 (grátis) |

## Erros comuns

1. **Formato de embedding errado:** extraia `result.data[0]` do Workers AI
2. **Índice de metadados depois dos dados:** faça upsert de todos os vetores de novo
3. **Insert vs upsert:** `insert` ignora duplicatas, `upsert` sobrescreve
4. **Sem lotes:** inserts individuais ~1K/min; em lote ~200K+/min

## Resolução de problemas

**Sem resultados?**

- Aguarde 5–10s após o insert
- Confira a grafia do namespace (sensível a maiúsculas)
- Verifique se o índice de metadados existe
- Verifique incompatibilidade de dimensões

**Filtro de metadados não funciona?**

- O índice deve existir antes da inserção dos dados
- Strings >64 bytes são truncadas
- Use notação com ponto para aninhados: `"product.category"`

## Dimensões dos modelos

- `@cf/baai/bge-small-en-v1.5`: 384
- `@cf/baai/bge-base-en-v1.5`: 768
- `@cf/baai/bge-large-en-v1.5`: 1024

Documentação localizada no ecossistema mantido pelo Controllato Club.
