# Referência de API do AI Search

## Binding no Workers

```typescript
const answer = await env.AI.autorag('instance-name').aiSearch(options)
const results = await env.AI.autorag('instance-name').search(options)
const instances = await env.AI.autorag('_').listInstances()
```

## Opções de aiSearch()

```typescript
interface AiSearchOptions {
  query: string // Consulta do usuário
  model: string // ID do modelo Workers AI
  system_prompt?: string // Instruções ao LLM
  rewrite_query?: boolean // Corrigir erros de digitação (padrão: false)
  max_num_results?: number // Máx. de chunks (padrão: 10)
  ranking_options?: { score_threshold?: number } // 0,0-1,0 (padrão: 0,3)
  reranking?: { enabled: boolean; model: string }
  stream?: boolean // Stream da resposta (padrão: false)
  filters?: Filter // Filtros de metadados
  page?: string // Token de paginação
}
```

## Resposta

```typescript
interface AiSearchResponse {
  search_query: string // Consulta usada (reescrita se habilitado)
  response: string // Resposta gerada pela IA
  data: SearchResult[] // Chunks recuperados
  has_more: boolean
  next_page?: string
}

interface SearchResult {
  id: string
  score: number
  content: string
  metadata: { filename: string; folder: string; timestamp: number }
}
```

## Filtros

```typescript
// Comparação
{ column: "folder", operator: "gte", value: "docs/" }

// Composto
{ operator: "and", filters: [
  { column: "folder", operator: "gte", value: "docs/" },
  { column: "timestamp", operator: "gte", value: 1704067200 }
]}
```

**Operadores:** `eq`, `ne`, `gt`, `gte`, `lt`, `lte`

**Metadados nativos:** `filename`, `folder`, `timestamp` (segundos Unix)

## Streaming

```typescript
const stream = await env.AI.autorag('docs').aiSearch({ query, model, stream: true })
return new Response(stream, { headers: { 'Content-Type': 'text/event-stream' } })
```

## Tipos de erro

| Erro                       | Causa                     |
| -------------------------- | ------------------------- |
| `AutoRAGNotFoundError`     | Instância não existe      |
| `AutoRAGUnauthorizedError` | Token inválido ou ausente |
| `AutoRAGValidationError`   | Parâmetros inválidos      |

## REST API

```bash
curl https://api.cloudflare.com/client/v4/accounts/{ACCOUNT_ID}/autorag/rags/{NAME}/ai-search \
  -H "Authorization: Bearer {TOKEN}" \
  -d '{"query": "...", "model": "@cf/meta/llama-3.3-70b-instruct-fp8-fast"}'
```

Exige token de API de serviço com permissão "AI Search - Read".
