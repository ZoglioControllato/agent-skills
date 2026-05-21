# Pipelines API Reference

## Pipeline Binding Interface

```typescript
// From @cloudflare/workers-types
interface Pipeline {
  send(data: object | object[]): Promise<void>
}

interface Env {
  STREAM: Pipeline
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    // send() returns Promise<void> - no result data
    await env.STREAM.send([event])
    return new Response('OK')
  },
} satisfies ExportedHandler<Env>
```

**Pontos principais:**

- `send()` aceita um único objeto ou array
- Sempre retorna `Promise<void>` (sem dados de confirmação)
- Lança erros de rede/validação (envolver em try/catch)
- Use `ctx.waitUntil()` para o padrão disparar e esquecer

## Escrevendo eventos

### Evento único```typescript

await env.STREAM.send([
{
user_id: '12345',
event_type: 'purchase',
product_id: 'widget-001',
amount: 29.99,
},
])

````

### Batch Events

```typescript
const events = [
  { user_id: 'user1', event_type: 'view' },
  { user_id: 'user2', event_type: 'purchase', amount: 50 },
]
await env.STREAM.send(events)
````

**Limits:**

- Max 1 MB per request
- 5 MB/s per stream

### Fire-and-Forget Pattern

```typescript
export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const event = {
      /* ... */
    }

    // Don't block response on send
    ctx.waitUntil(env.STREAM.send([event]))

    return new Response('OK')
  },
}
```

### Error Handling

```typescript
try {
  await env.STREAM.send([event])
} catch (error) {
  console.error('Pipeline send failed:', error)
  // Log to another system, retry, or return error response
  return new Response('Failed to track event', { status: 500 })
}
```

## HTTP Ingest API

### Endpoint Format

```
https://{stream-id}.ingest.cloudflare.com
```

Get `{stream-id}` from: `npx wrangler pipelines streams list`

### Request Format

**CRITICAL:** Must send array, not single object

```bash
# ✅ Correct
curl -X POST https://{stream-id}.ingest.cloudflare.com \
  -H "Content-Type: application/json" \
  -d '[{"user_id": "123", "event_type": "purchase"}]'

# ❌ Wrong - will fail
curl -X POST https://{stream-id}.ingest.cloudflare.com \
  -H "Content-Type: application/json" \
  -d '{"user_id": "123", "event_type": "purchase"}'
```

### Authentication

```bash
curl -X POST https://{stream-id}.ingest.cloudflare.com \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -d '[{"event": "data"}]'
```

**Permissão necessária:** Envio de pipeline de trabalhadores

Criar token: Painel → Trabalhadores → Tokens de API → Criar com permissão de envio de pipeline

### Códigos de Resposta

| Código | Significado             | Ação                                                |
| ------ | ----------------------- | --------------------------------------------------- |
| 200    | Aceito                  | Sucesso                                             |
| 400    | Formato inválido        | Verifique a matriz JSON, correspondência de esquema |
| 401    | Falha na autenticação   | Verifique se o token é válido                       |
| 413    | Carga útil muito grande | Dividido em lotes menores (<1 MB)                   |
| 429    | Taxa limitada           | Recue, tente novamente com atraso                   |
| 5xx    | Erro no servidor        | Tentar novamente com espera exponencial             |

## Referência rápida de funções SQL

Disponível nas transformações `INSERT INTO sink SELECT ... FROM stream`:

| Função                          | Exemplo                                                 | Caso de uso                                                 |
| ------------------------------- | ------------------------------------------------------- | ----------------------------------------------------------- |
| `SUPERIOR(es)`                  | `UPPER(tipo_evento)`                                    | Normalizar strings                                          |
| `INFERIOR(es)`                  | `INFERIOR(e-mail)`                                      | Correspondência sem distinção entre maiúsculas e minúsculas |
| `CONCAT(...)`                   | `CONCAT(id_usuário, '_', id_produto)`                   | Gerar chaves compostas                                      |
| `CASO QUANDO ... ENTÃO ... FIM` | `CASE WHEN montante > 100 THEN 'alto' ELSE 'baixo' END` | Enriquecimento condicional                                  |
| `CAST(x tipo AS)`               | `CAST(timestamp AS string)`                             | Conversão de tipo                                           |
| `COALESCE(x, y)`                | `COALESCE(quantidade, 0,0)`                             | Valores padrão                                              |
| Operadores matemáticos          | `quantidade * 1,1`, `preço/quantidade`                  | Cálculos                                                    |
| Comparação                      | `valor > 100`, `status IN ('ativo', 'pendente')`        | Filtragem                                                   |

**Tipos de string para CAST:** `string`, `int32`, `int64`, `float32`, `float64`, `bool`, `timestamp`

Referência completa: [Referência SQL de Pipelines](https://developers.cloudflare.com/pipelines/sql-reference/)

## Exemplos de transformação SQL

### Filtrar eventos```sql

INSERT INTO my_sink
SELECT \* FROM my_stream
WHERE event_type = 'purchase' AND amount > 100

````

### Select Specific Fields

```sql
INSERT INTO my_sink
SELECT user_id, event_type, timestamp, amount
FROM my_stream
````

### Transform and Enrich

```sql
INSERT INTO my_sink
SELECT
  user_id,
  UPPER(event_type) as event_type,
  timestamp,
  amount * 1.1 as amount_with_tax,
  CONCAT(user_id, '_', product_id) as unique_key,
  CASE
    WHEN amount > 1000 THEN 'high_value'
    WHEN amount > 100 THEN 'medium_value'
    ELSE 'low_value'
  END as customer_tier
FROM my_stream
WHERE event_type IN ('purchase', 'refund')
```

## Querying Results (R2 Data Catalog)

```bash
export WRANGLER_R2_SQL_AUTH_TOKEN=YOUR_CATALOG_TOKEN

npx wrangler r2 sql query "warehouse_name" "
SELECT
  event_type,
  COUNT(*) as event_count,
  SUM(amount) as total_revenue
FROM default.my_table
WHERE event_type = 'purchase'
  AND timestamp >= '2025-01-01'
GROUP BY event_type
ORDER BY total_revenue DESC
LIMIT 100"
```

**Note:** Iceberg tables support standard SQL queries with GROUP BY, JOINs, WHERE, ORDER BY, etc.
