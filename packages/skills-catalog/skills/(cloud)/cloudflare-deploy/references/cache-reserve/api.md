# Cache Reserve API

## Workers Integration

```
┌──────────────────────────────── ────────────────────────────────┐
│ CRÍTICO: API de cache de trabalho ≠ Reserva de cache │
│ │
│ • Trabalhadores caches.default / cache.put() → SOMENTE cache de borda │
│ • Reserva de cache → configuração em nível de zona, automática, sem necessidade │
│ • Você NÃO PODE gravar seletivamente na Reserva de Cache a partir de Trabalhadores │
│ • Cache Reserve funciona com fetch() padrão, não com cache.put() │
└──────────────────────────────── ────────────────────────────────┘
```

A Reserva de Cache é uma **configuração em nível de zona**, não uma API por solicitação. Funciona automaticamente quando habilitado para a zona:

### Busca padrão (recomendado)```typescript

// Cache Reserve works automatically via standard fetch
export default {
async fetch(request: Request, env: Env): Promise<Response> {
// Standard fetch uses Cache Reserve automatically
return await fetch(request)
},
}

````

### Cache API Limitations

**IMPORTANT**: `cache.put()` is **NOT compatible** with Cache Reserve or Tiered Cache.

```typescript
// ❌ WRONG: cache.put() bypasses Cache Reserve
const cache = caches.default
let response = await cache.match(request)
if (!response) {
  response = await fetch(request)
  await cache.put(request, response.clone()) // Bypasses Cache Reserve!
}

// ✅ CORRECT: Use standard fetch for Cache Reserve compatibility
return await fetch(request)

// ✅ CORRECT: Use Cache API only for custom cache namespaces
const customCache = await caches.open('my-custom-cache')
let response = await customCache.match(request)
if (!response) {
  response = await fetch(request)
  await customCache.put(request, response.clone()) // Custom cache OK
}
````

## Purging and Cache Management

### Purge by URL (Instant)

```typescript
// Purge specific URL from Cache Reserve immediately
const purgeCacheReserveByURL = async (zoneId: string, apiToken: string, urls: string[]) => {
  const response = await fetch(`https://api.cloudflare.com/client/v4/zones/${zoneId}/purge_cache`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ files: urls }),
  })
  return await response.json()
}

// Example usage
await purgeCacheReserveByURL('zone123', 'token456', ['https://example.com/image.jpg', 'https://example.com/video.mp4'])
```

### Purge by Tag/Host/Prefix (Revalidation)

```typescript
// Purge by cache tag - forces revalidation, not immediate removal
await fetch(`https://api.cloudflare.com/client/v4/zones/${zoneId}/purge_cache`, {
  method: 'POST',
  headers: { Authorization: `Bearer ${apiToken}`, 'Content-Type': 'application/json' },
  body: JSON.stringify({ tags: ['tag1', 'tag2'] }),
})
```

**Purge behavior:**

- **By URL**: Immediate removal from Cache Reserve + edge cache
- **By tag/host/prefix**: Revalidation only, assets remain in storage (costs continue)

### Clear All Cache Reserve Data

```typescript
// Requires Cache Reserve OFF first
await fetch(`https://api.cloudflare.com/client/v4/zones/${zoneId}/cache/cache_reserve_clear`, {
  method: 'POST',
  headers: { Authorization: `Bearer ${apiToken}` },
})

// Check status: GET same endpoint returns { state: "In-progress" | "Completed" }
```

**Processo**: Desativar reserva de cache → Limpar endpoint de chamada → Aguardar até 24 horas → Reativar

## Monitoramento e Análise

### Análise do painel

Navegue até **Caching > Cache Reserve** para visualizar:

- **Economia de saída**: total de bytes servidos da reserva de cache versus custo de saída de origem economizado
- **Solicitações atendidas**: detalhamento de acertos versus erros da reserva de cache
- **Armazenamento usado**: GB atual armazenado na reserva de cache (cobrado mensalmente)
- **Operações**: contagens de operações Classe A (gravações) e Classe B (leituras)
- **Acompanhamento de custos**: custos mensais estimados com base no uso atual

### Integração Logpush```typescript

// Logpush field: CacheReserveUsed (boolean) - filter for Cache Reserve hits
// Query Cache Reserve hits in analytics
const logpushQuery = `  SELECT 
    ClientRequestHost, 
    COUNT(*) as requests, 
    SUM(EdgeResponseBytes) as bytes_served,
    COUNT(CASE WHEN CacheReserveUsed = true THEN 1 END) as cache_reserve_hits,
    COUNT(CASE WHEN CacheReserveUsed = false THEN 1 END) as cache_reserve_misses
  FROM http_requests 
  WHERE Timestamp >= NOW() - INTERVAL '24 hours'
  GROUP BY ClientRequestHost 
  ORDER BY requests DESC`

// Filter only Cache Reserve hits
const crHitsQuery = `  SELECT ClientRequestHost, COUNT(*) as requests, SUM(EdgeResponseBytes) as bytes
  FROM http_requests 
  WHERE CacheReserveUsed = true AND Timestamp >= NOW() - INTERVAL '7 days'
  GROUP BY ClientRequestHost 
  ORDER BY bytes DESC`

````

### GraphQL Analytics

```graphql
query CacheReserveAnalytics($zoneTag: string, $since: string, $until: string) {
  viewer {
    zones(filter: { zoneTag: $zoneTag }) {
      httpRequests1dGroups(filter: { datetime_geq: $since, datetime_leq: $until }, limit: 1000) {
        dimensions {
          date
        }
        sum {
          cachedBytes
          cachedRequests
          bytes
          requests
        }
      }
    }
  }
}
````

## Pricing

```typescript
// Storage: $0.015/GB-month | Class A (writes): $4.50/M | Class B (reads): $0.36/M
// Cache miss: 1A + 1B | Cache hit: 1B | Assets >1GB: proportionally more ops
```

## Veja também

- [README](./README.md) - Visão geral e conceitos básicos
- [Configuração](./configuration.md) - Regras de configuração e cache
- [Padrões](./patterns.md) - Melhores práticas e otimização
- [Gotchas](./gotchas.md) - Problemas comuns e solução de problemas
