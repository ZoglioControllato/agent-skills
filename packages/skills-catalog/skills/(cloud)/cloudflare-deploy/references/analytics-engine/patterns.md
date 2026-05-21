# Analytics Engine Patterns

## Use Cases

| Use Case       | Key Metrics                    | Index On    |
| -------------- | ------------------------------ | ----------- |
| API Metering   | requests, bytes, compute_units | api_key     |
| Feature Usage  | feature, action, duration      | user_id     |
| Error Tracking | error_type, endpoint, count    | customer_id |
| Performance    | latency_ms, cache_status       | endpoint    |
| A/B Testing    | variant, conversions           | user_id     |

## API Metering (Billing)

```typescript
env.ANALYTICS.writeDataPoint({
  blobs: [pathname, method, status, tier],
  doubles: [1, computeUnits, bytes, latencyMs],
  indexes: [apiKey],
})

// Query: Monthly usage by customer
// SELECT index1 AS api_key, SUM(double2) AS compute_units
// FROM usage WHERE timestamp >= DATE_TRUNC('month', NOW()) GROUP BY index1
```

## Error Tracking

```typescript
env.ANALYTICS.writeDataPoint({
  blobs: [endpoint, method, errorName, errorMessage.slice(0, 1000)],
  doubles: [1, timeToErrorMs],
  indexes: [customerId],
})
```

## Performance Monitoring

```typescript
env.ANALYTICS.writeDataPoint({
  blobs: [pathname, method, cacheStatus, status],
  doubles: [latencyMs, 1],
  indexes: [userId],
})

// Query: P95 latency by endpoint
// SELECT blob1, quantile(0.95)(double1) AS p95_ms FROM perf GROUP BY blob1
```

## Antipadrões

| ❌ Errado                                 | ✅ Correto                                     |
| ----------------------------------------- | ---------------------------------------------- |
| `aguarde writeDataPoint()`                | `writeDataPoint()` (disparar e esquecer)       |
| `índices: [método]` (baixa cardinalidade) | `blobs: [método]`, `índices: [userId]`         |
| `blobs: [JSON.stringify(obj)]`            | Armazenar ID em blob, objeto completo em D1/KV |
| Escreva todas as solicitações a 10M/min   | Pré-agregado por segundo                       |
| Consulta do Trabalhador                   | Consulta de serviço/API externo                |

## Melhores práticas

1. **Projete o esquema antecipadamente** - Atribuições de blob/duplo/índice de documento
2. **Sempre inclua a métrica de contagem** - `doubles: [latency, 1]` para cálculos do AVG
3. **Use enums para blobs** - Valores consistentes como `Status.SUCCESS`
4. **Tratar amostragem** - Use proporções (avg_latency = SUM(latency)/SUM(count))
5. **Teste consultas antecipadamente** - Valide o esquema antes de gravações pesadas

## Modelo de esquema```typescript

/\*\*

- Dataset: my_metrics
-
- Blobs:
- blob1: endpoint, blob2: method, blob3: status
-
- Doubles:
- double1: latency_ms, double2: count (always 1)
-
- Indexes:
- index1: customer_id (high cardinality)
  \*/

```

```
