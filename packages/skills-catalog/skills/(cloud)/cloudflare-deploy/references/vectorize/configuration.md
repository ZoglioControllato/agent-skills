# Configuração do Vectorize

## Criar índice

```bash
npx wrangler vectorize create my-index --dimensions=768 --metric=cosine
```

**Dimensões e métrica são imutáveis** — não podem ser alteradas após a criação.

## Binding no Worker

```jsonc
// wrangler.jsonc
{
  "vectorize": [{ "binding": "VECTORIZE", "index_name": "my-index" }],
}
```

```typescript
interface Env {
  VECTORIZE: Vectorize
}
```

## Índices de metadados

**Crie ANTES de inserir vetores** — vetores existentes não são reindexados retroativamente.

```bash
wrangler vectorize create-metadata-index my-index --property-name=category --type=string
wrangler vectorize create-metadata-index my-index --property-name=price --type=number
```

| Tipo      | Use para                                        |
| --------- | ----------------------------------------------- |
| `string`  | Categorias, tags (primeiros 64 bytes indexados) |
| `number`  | Preços, timestamps                              |
| `boolean` | Flags                                           |

## Comandos da CLI

```bash
# Index management
wrangler vectorize list
wrangler vectorize info <index-name>
wrangler vectorize delete <index-name>

# Vector operations
wrangler vectorize insert <index-name> --file=embeddings.ndjson
wrangler vectorize get <index-name> --ids=id1,id2
wrangler vectorize delete-by-ids <index-name> --ids=id1,id2

# Metadata indexes
wrangler vectorize list-metadata-index <index-name>
wrangler vectorize delete-metadata-index <index-name> --property-name=field
```

## Upload em massa (NDJSON)

```json
{"id": "1", "values": [0.1, 0.2, ...], "metadata": {"category": "docs"}}
{"id": "2", "values": [0.4, 0.5, ...], "namespace": "tenant-abc"}
```

**Limites:** 5000 vetores por arquivo, máx. 100 MB

## Boa prática de cardinalidade

Agrupe dados de alta cardinalidade:

```typescript
// ❌ Millisecond timestamps
metadata: {
  timestamp: Date.now()
}

// ✅ 5-minute buckets
metadata: {
  timestamp_bucket: Math.floor(Date.now() / 300000) * 300000
}
```

## Checklist de produção

1. Criar índice com dimensões corretas
2. Criar índices de metadados PRIMEIRO
3. Testar upload em massa
4. Configurar bindings
5. Publicar Worker
6. Validar consultas

Documentação localizada no ecossistema mantido pelo Controllato Club.
