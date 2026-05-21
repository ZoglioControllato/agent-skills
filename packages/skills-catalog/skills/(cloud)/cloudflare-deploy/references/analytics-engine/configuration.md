# Configuração do mecanismo analítico

## Configuração

1. Adicione ligação a `wrangler.jsonc`
2. Implantar trabalhador
3. Conjunto de dados criado automaticamente na primeira gravação
4. Consulta via API SQL

## wrangler.jsonc

````jsonc
{
  "name": "my-worker",
  "analytics_engine_datasets": [{ "binding": "ANALYTICS", "dataset": "my_events" }],
}
```Vários conjuntos de dados para questões separadas:
```jsonc
{
  "analytics_engine_datasets": [
    { "binding": "API_ANALYTICS", "dataset": "api_requests" },
    { "binding": "USER_EVENTS", "dataset": "user_activity" },
  ],
}
````

##TypeScript

```typescript
interface Env {
  ANALYTICS: AnalyticsEngineDataset
}

export default {
  async fetch(request: Request, env: Env) {
    // No await - returns void, fire-and-forget
    env.ANALYTICS.writeDataPoint({
      blobs: [pathname, method, status], // String dimensions (max 20)
      doubles: [latency, 1], // Numeric metrics (max 20)
      indexes: [apiKey], // High-cardinality filter (max 1)
    })
    return response
  },
}
```

##Limites de pontos de dados

| Campo   | Limite                 | Acesso SQL           |
| ------- | ---------------------- | -------------------- |
| bolhas  | 20 strings, 16 KB cada | `blob1`...`blob20`   |
| duplas  | 20 números             | `duplo1`...`duplo20` |
| índices | 1 string, 16 KB        | `índice1`            |

## Comportamento de gravação

| Cenário                    | Comportamento                               |
| -------------------------- | ------------------------------------------- |
| <1 milhão de gravações/min | Todos aceitos                               |
| >1 milhão de gravações/min | Amostragem automática                       |
| Dados inválidos            | Falha silenciosa (verifique os logs finais) |

**Mitigue a amostragem:** pré-agregue, use vários conjuntos de dados e grave apenas métricas críticas.

## Limites de consulta

| Recurso                  | Limite           |
| ------------------------ | ---------------- |
| Tempo limite da consulta | 30 segundos      |
| Retenção de dados        | 90 dias (padrão) |
| Tamanho do resultado     | ~10 MB           |

## Custo

**Nível gratuito:** 10 milhões de gravações/mês, 1 milhão de leituras/mês

**Pago:** US$ 0,05 por 1 milhão de gravações, US$ 1,00 por 1 milhão de leituras

## Específico do ambiente

```jsonc
{
  "analytics_engine_datasets": [{ "binding": "ANALYTICS", "dataset": "prod_events" }],
  "env": {
    "staging": {
      "analytics_engine_datasets": [{ "binding": "ANALYTICS", "dataset": "staging_events" }],
    },
  },
}
```

##Monitoramento

```bash
npx wrangler tail  # Check for sampling/write errors
```

```sql
-- Check write activity
SELECT DATE_TRUNC('hour', timestamp) AS hour, COUNT(*) AS writes
FROM my_dataset
WHERE timestamp >= NOW() - INTERVAL '24' HOUR
GROUP BY hour
```
