# Cloudflare Vectorize

Banco de dados vetorial distribuído globalmente para aplicações de IA. Armazene e consulte embeddings para busca semântica, recomendações, RAG e classificação.

**Status:** disponibilidade geral (GA) | **Última atualização:** 2026-01-27

## Início rápido

```typescript
// 1. Create index
// npx wrangler vectorize create my-index --dimensions=768 --metric=cosine

// 2. Configure binding (wrangler.jsonc)
// { "vectorize": [{ "binding": "VECTORIZE", "index_name": "my-index" }] }

// 3. Query vectors
const matches = await env.VECTORIZE.query(queryVector, { topK: 5 })
```

## Recursos principais

- **10M vetores por índice** (V2)
- Dimensões até 1536 (float 32 bits)
- Três métricas de distância: cosine, euclidean, dot-product
- Filtro por metadados (até 10 índices)
- Suporte a namespaces (50K namespaces pagos, 1K grátis)
- Integração direta com Workers AI
- Distribuição global

## Ordem de leitura

| Tarefa                     | Arquivos a ler          |
| -------------------------- | ----------------------- |
| Novo no Vectorize          | Só README               |
| Implementar funcionalidade | README + api + patterns |
| Configurar                 | README + configuration  |
| Depurar                    | gotchas                 |
| Integrar com IA            | README + patterns       |
| Implementar RAG            | README + patterns       |

## Guia dos arquivos

- **README.md** (este arquivo): visão geral e decisões rápidas
- **api.md**: API de runtime, tipos, operações (query/insert/upsert)
- **configuration.md**: setup, CLI, índices de metadados
- **patterns.md**: RAG, Workers AI, OpenAI, LangChain, multi-inquilino
- **gotchas.md**: limites, armadilhas, resolução de problemas

## Escolha da métrica de distância

Escolha conforme o caso de uso:

```
What are you building?
├─ Text/semantic search → cosine (most common)
├─ Image similarity → euclidean
├─ Recommendation system → dot-product
└─ Pre-normalized vectors → dot-product
```

| Métrica       | Melhor para                                 | Interpretação do score                |
| ------------- | ------------------------------------------- | ------------------------------------- |
| `cosine`      | Embeddings de texto, similaridade semântica | Maior = mais próximo (1.0 = idêntico) |
| `euclidean`   | Distância absoluta, dados espaciais         | Menor = mais próximo (0.0 = idêntico) |
| `dot-product` | Recomendações, vetores normalizados         | Maior = mais próximo                  |

**Obs.:** A configuração do índice é imutável. Não é possível alterar dimensões ou métrica após a criação.

## Estratégia de multi-inquilino

```
How many tenants?
├─ < 50K tenants → Use namespaces (recommended)
│   ├─ Fastest (filter before vector search)
│   └─ Strict isolation
├─ > 50K tenants → Use metadata filtering
│   ├─ Slower (post-filter after vector search)
│   └─ Requires metadata index
└─ Per-tenant indexes → Only if compliance mandated
    └─ 50K index limit per account (paid plan)
```

## Fluxos comuns

### Busca semântica

```typescript
// 1. Generate embedding
const result = await env.AI.run('@cf/baai/bge-base-en-v1.5', { text: [query] })

// 2. Query Vectorize
const matches = await env.VECTORIZE.query(result.data[0], {
  topK: 5,
  returnMetadata: 'indexed',
})
```

### Padrão RAG

```typescript
// 1. Generate query embedding
const embedding = await env.AI.run('@cf/baai/bge-base-en-v1.5', { text: [query] })

// 2. Search Vectorize
const matches = await env.VECTORIZE.query(embedding.data[0], { topK: 5 })

// 3. Fetch full documents from R2/D1/KV
const docs = await Promise.all(matches.matches.map((m) => env.R2.get(m.metadata.key).then((obj) => obj?.text())))

// 4. Generate LLM response with context
const answer = await env.AI.run('@cf/meta/llama-3-8b-instruct', {
  prompt: `Context: ${docs.join('\n\n')}\n\nQuestion: ${query}\n\nAnswer:`,
})
```

## Armadilhas críticas

Consulte `gotchas.md` para detalhes. As mais importantes:

1. **Mutações assíncronas:** inserções levam 5–10s para ficarem consultáveis
2. **Limite de 500 por lote:** a API Workers aplica 500 vetores por chamada (não documentado)
3. **Truncagem de metadados:** `"indexed"` devolve apenas os primeiros 64 bytes
4. **topK com metadados:** máximo 20 (não 100) com returnValues ou returnMetadata: "all"
5. **Índices de metadados primeiro:** criar antes de inserir vetores

## Recursos

- [Documentação oficial](https://developers.cloudflare.com/vectorize/)
- [Referência da API cliente](https://developers.cloudflare.com/vectorize/reference/client-api/)
- [Modelos Workers AI](https://developers.cloudflare.com/workers-ai/models/#text-embeddings)
- [Discord: #vectorize](https://discord.cloudflare.com)

Documentação localizada no ecossistema mantido pelo Controllato Club.
