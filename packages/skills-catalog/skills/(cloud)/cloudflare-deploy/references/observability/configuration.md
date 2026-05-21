## Padrões de configuração

### Habilitar registros de trabalho

```jsonc
{
  "observability": {
    "enabled": true,
    "head_sampling_rate": 1, // 100% sampling (default)
  },
}
```

**Prática recomendada**: use registros JSON estruturados para melhor indexação

```typescript
// Good - structured logging
console.log({
  user_id: 123,
  action: 'login',
  status: 'success',
  duration_ms: 45,
})

// Avoid - unstructured string
console.log('user_id: 123 logged in successfully in 45ms')
```

### Habilitar rastreamentos de trabalhadores

```jsonc
{
  "observability": {
    "traces": {
      "enabled": true,
      "head_sampling_rate": 0.05, // 5% sampling
    },
  },
}
```

**Observação**: A amostragem padrão é 100%. Para trabalhadores de alto tráfego, use amostragem mais baixa (0,01-0,1).

### Configurar mecanismo de análise

**Vincular ao trabalhador**:

```toml
# wrangler.toml
analytics_engine_datasets = [
  { binding = "ANALYTICS", dataset = "api_metrics" }
]
```

**Escrever pontos de dados**:

```typescript
export interface Env {
  ANALYTICS: AnalyticsEngineDataset
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    // Track metrics
    env.ANALYTICS.writeDataPoint({
      blobs: ['customer_123', 'POST', '/api/v1/users'],
      doubles: [1, 245.5], // request_count, response_time_ms
      indexes: ['customer_123'], // for efficient filtering
    })

    return new Response('OK')
  },
}
```

### Configurar trabalhadores finais

Tail Workers recebem logs/rastreamentos de outros Workers para filtragem, transformação ou exportação.

**Configurar**:

```toml
# wrangler.toml
name = "log-processor"
main = "src/tail.ts"

[[tail_consumers]]
service = "my-worker" # Worker to tail
```

**Exemplo de trabalhador de cauda**:

```typescript
export default {
  async tail(events: TraceItem[], env: Env, ctx: ExecutionContext) {
    // Filter errors only
    const errors = events.filter((event) => event.outcome === 'exception' || event.outcome === 'exceededCpu')

    if (errors.length > 0) {
      // Send to external monitoring
      ctx.waitUntil(
        fetch('https://monitoring.example.com/errors', {
          method: 'POST',
          body: JSON.stringify(errors),
        }),
      )
    }
  },
}
```

### Configurar Logpush

Envie logs para armazenamento externo (S3, R2, GCS, Azure, Datadog, etc.). Requer plano Business/Enterprise.

**Através do Painel**:

1. Navegue até Analytics → Logs → Logpush
2. Selecione o tipo de destino
3. Forneça credenciais e bucket/endpoint
4. Escolha o conjunto de dados (por exemplo, eventos de rastreamento de trabalhadores)
5. Configure filtros e campos

**Via API**:

```bash
curl -X POST "https://api.cloudflare.com/client/v4/accounts/{account_id}/logpush/jobs" \
  -H "Authorization: Bearer <API_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "workers-logs-to-s3",
    "destination_conf": "s3://my-bucket/logs?region=us-east-1",
    "dataset": "workers_trace_events",
    "enabled": true,
    "frequency": "high",
    "filter": "{\"where\":{\"and\":[{\"key\":\"ScriptName\",\"operator\":\"eq\",\"value\":\"my-worker\"}]}}"
  }'
```

### Configuração específica do ambiente

**Desenvolvimento** (registros detalhados, amostragem completa):

```jsonc
// wrangler.dev.jsonc
{
  "observability": {
    "enabled": true,
    "head_sampling_rate": 1.0,
    "traces": {
      "enabled": true,
    },
  },
}
```

**Produção** (amostragem reduzida, registros estruturados):

````jsonc
// wrangler.prod.jsonc
{
  "observability": {
    "enabled": true,
    "head_sampling_rate": 0.1, // 10% sampling
    "traces": {
      "enabled": true,
    },
  },
}
```Implante com configuração específica do ambiente:
```bash
wrangler deploy --config wrangler.prod.jsonc --env production
````
