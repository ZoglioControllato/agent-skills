```
Precisa monitorar métricas? → Sim
↓
Milhões de valores de dimensão exclusivos? → Sim
↓
Precisa de consultas em tempo real? → Sim
↓
Use o mecanismo de análise ✓

Cenários alternativos:
- Baixa cardinalidade (<10k valores únicos) → Workers Analytics (nível gratuito)
- Junções/relações complexas → Banco de dados D1
- Logs/depuração → Tail Workers (logpush)
- Ferramentas externas → Enviar para análises externas (Datadog, etc.)
```

```jsonc
{
  "analytics_engine_datasets": [{ "binding": "ANALYTICS", "dataset": "my_events" }],
}
```

```typescript
env.ANALYTICS.writeDataPoint({
  blobs: ['/api/users', 'GET', '200'],
  doubles: [145.2, 1], // latency_ms, count
  indexes: [customerId],
})
```

```sql
SELECT blob1, SUM(double2) AS total_requests
FROM my_events
WHERE index1 = 'customer_123'
  AND timestamp >= NOW() - INTERVAL '7' DAY
GROUP BY blob1
ORDER BY total_requests DESC
```
