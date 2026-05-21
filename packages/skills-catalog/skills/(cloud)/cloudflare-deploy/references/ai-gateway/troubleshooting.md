# Solução de problemas do AI Gateway

## Erros comuns

| Erro | Causa                                      | Correção                                 |
| ---- | ------------------------------------------ | ---------------------------------------- |
| 401  | Falta o header `cf-aig-authorization`      | Adicione o header com token de API da CF |
| 403  | Chave de provedor inválida / BYOK expirada | Verifique a chave no dashboard           |
| 429  | Rate limit excedido                        | Aumente o limite ou use backoff          |

### Correção de 401

```typescript
const client = new OpenAI({
  baseURL: `https://gateway.ai.cloudflare.com/v1/${accountId}/${gatewayId}/openai`,
  defaultHeaders: { 'cf-aig-authorization': `Bearer ${CF_API_TOKEN}` },
})
```

### Padrão de retry para 429

```typescript
async function requestWithRetry(fn, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn()
    } catch (e) {
      if (e.status === 429 && i < maxRetries - 1) {
        await new Promise((r) => setTimeout(r, Math.pow(2, i) * 1000))
        continue
      }
      throw e
    }
  }
}
```

## Armadilhas

| Problema                       | Realidade                                                          |
| ------------------------------ | ------------------------------------------------------------------ |
| Limites de metadados           | Máx. 5 entradas, só plano (sem aninhamento)                        |
| Colisão de cache key           | Use chaves únicas por resposta esperada                            |
| BYOK + billing unificado       | Mutuamente exclusivos                                              |
| Escopo de rate limit           | Por gateway, não por usuário (use roteamento dinâmico por usuário) |
| Atraso de log                  | 30–60 s é normal                                                   |
| Streaming + cache              | **Incompatíveis**                                                  |
| Nome do modelo (API unificada) | Prefixo obrigatório: `openai/gpt-4o`, não `gpt-4o`                 |

## Cache não funciona

**Causas:**

- Parâmetros diferentes (temperatura etc.)
- Streaming habilitado
- Cache desabilitado nas configurações

**Verifique:** `response.headers.get('cf-aig-cache-status')` → HIT ou MISS

## Logs não aparecem

1. Confirme logging habilitado: Dashboard → Gateway → Settings
2. Remova o header `cf-aig-collect-log: false`
3. Aguarde 30–60 s
4. Verifique limite de logs (10M padrão)

## Debug

```bash
# Testar conectividade
curl -v https://gateway.ai.cloudflare.com/v1/{account}/{gateway}/openai/models \
  -H "Authorization: Bearer $OPENAI_KEY" \
  -H "cf-aig-authorization: Bearer $CF_TOKEN"
```

```typescript
// Cabeçalhos da resposta
console.log('Cache:', response.headers.get('cf-aig-cache-status'))
console.log('Request ID:', response.headers.get('cf-ray'))
```

## Analytics

Dashboard → AI Gateway → Selecione o gateway

**Métricas:** Requests, tokens, latência (p50/p95/p99), taxa de hit de cache, custos

**Filtros de log:** `status: error`, `provider: openai`, `cost > 0.01`, `duration > 1000`

**Exportação:** Logpush para S3/GCS/Datadog/Splunk
