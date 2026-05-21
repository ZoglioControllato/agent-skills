## Common Errors

### "Logs not appearing"

**Cause:** Observability disabled, Worker not redeployed, no traffic, low sampling rate, or log size exceeds 256 KB
**Solution:**

```bash
# Verify config
cat wrangler.jsonc | jq '.observability'

# Check deployment
wrangler deployments list <WORKER_NAME>

# Test with curl
curl https://your-worker.workers.dev
```

Ensure `observability.enabled = true`, redeploy Worker, check `head_sampling_rate`, verify traffic

### "Traces not being captured"

**Cause:** Traces not enabled, incorrect sampling rate, Worker not redeployed, or destination unavailable
**Solution:**

```jsonc
// Temporarily set to 100% sampling for debugging
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

Certifique-se de `observability.traces.enabled = true`, defina `head_sampling_rate` como 1.0 para teste, reimplante, verifique o status do destino

## Limites

| Recurso/Limite                       | Valor                       | Notas                                                |
| ------------------------------------ | --------------------------- | ---------------------------------------------------- |
| Tamanho máximo do registro           | 256 KB                      | Os logs que excedem isso são truncados               |
| Taxa de amostragem padrão            | 1,0 (100%)                  | Reduzir para trabalhadores de alto tráfego           |
| Destinos máximos                     | Varia de acordo com o plano | Verifique o painel                                   |
| Rastrear propagação de contexto      | 100 vãos no máximo          | Cadeias de chamadas profundas podem perder extensões |
| Taxa de gravação do Analytics Engine | 25 escritas/solicitação     | O excesso de gravações caiu silenciosamente          |

## Dicas de desempenho

### Tempo de mitigação de espectro

**Problema:** `Date.now()` e `performance.now()` reduziram a precisão (reduzida para 100μs)
**Causa:** Mitigação da vulnerabilidade Spectre na V8
**Solução:** Aceite a precisão reduzida ou use Workers Traces para obter um tempo preciso```typescript
// Date.now() is coarsened - trace spans are accurate
export default {
async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
// For user-facing timing, Date.now() is fine
const start = Date.now()
const response = await processRequest(request)
const duration = Date.now() - start

    // For detailed performance analysis, use Workers Traces instead
    return response

},
}

````

### Analytics Engine \_sample_interval Aggregation

**Problem:** Queries return incorrect totals when not multiplying by `_sample_interval`
**Cause:** Analytics Engine stores sampled data points, each representing multiple events
**Solution:** Always multiply counts/sums by `_sample_interval` in aggregations

```sql
-- WRONG: Undercounts actual events
SELECT blob1 AS customer_id, COUNT(*) AS total_calls
FROM api_usage GROUP BY customer_id;

-- CORRECT: Accounts for sampling
SELECT blob1 AS customer_id, SUM(_sample_interval) AS total_calls
FROM api_usage GROUP BY customer_id;
````

### Limites de propagação de contexto de rastreamento

**Problema:** Cadeias de chamadas profundas perdem contexto de rastreamento após 100 intervalos
**Causa:** a Cloudflare limita a profundidade do rastreamento para evitar impacto no desempenho
**Solução:** Projete arquiteturas mais planas ou use IDs de correlação personalizados para cadeias profundas```typescript
// For deep call chains, add custom correlation ID
const correlationId = crypto.randomUUID()
console.log({ correlationId, event: 'request_start' })

// Pass correlationId through headers to downstream services
await fetch('https://api.example.com', {
headers: { 'X-Correlation-ID': correlationId },
})

```

## Pricing (2026)

### Workers Traces

- **GA Pricing (starts March 1, 2026):**
  - $0.10 per 1M trace spans captured
  - Retention: 14 days included
- **Free tier:** 10M trace spans/month
- **Note:** Beta usage (before March 1, 2026) is free

### Workers Logs

- **Included:** Free for all Workers
- **Logpush:** Requires Business/Enterprise plan

### Analytics Engine

- **Included:** 10M writes/month on Paid Workers plan
- **Additional:** $0.25 per 1M writes beyond included quota
```
