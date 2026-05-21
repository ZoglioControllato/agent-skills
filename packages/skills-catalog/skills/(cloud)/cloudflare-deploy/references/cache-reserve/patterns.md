# Cache Reserve Patterns

## Best Practices

### 1. Always Enable Tiered Cache

```typescript
// Cache Reserve is designed for use WITH Tiered Cache
const configuration = {
  tieredCache: 'enabled', // Required for optimal performance
  cacheReserve: 'enabled', // Works best with Tiered Cache

  hierarchy: ['Lower-Tier Cache (visitor)', 'Upper-Tier Cache (origin region)', 'Cache Reserve (persistent)', 'Origin'],
}
```

### 2. Set Appropriate Cache-Control Headers

```typescript
// Origin response headers for Cache Reserve eligibility
const originHeaders = {
  'Cache-Control': 'public, max-age=86400', // 24hr (minimum 10hr)
  'Content-Length': '1024000', // Required
  'Cache-Tag': 'images,product-123', // Optional: purging
  ETag: '"abc123"', // Optional: revalidation
  // Avoid: 'Set-Cookie' and 'Vary: *' prevent caching
}
```

### 3. Use Cache Rules for Fine-Grained Control

```typescript
// Different TTLs for different content types
const cacheRules = [
  {
    description: 'Long-term cache for immutable assets',
    expression: '(http.request.uri.path matches "^/static/.*\\.[a-f0-9]{8}\\.")',
    action_parameters: {
      cache_reserve: { eligible: true },
      edge_ttl: { mode: 'override_origin', default: 2592000 }, // 30 days
      cache: true,
    },
  },
  {
    description: 'Moderate cache for regular images',
    expression: '(http.request.uri.path matches "\\.(jpg|png|webp)$")',
    action_parameters: {
      cache_reserve: { eligible: true },
      edge_ttl: { mode: 'override_origin', default: 86400 }, // 24 hours
      cache: true,
    },
  },
  {
    description: 'Exclude API from Cache Reserve',
    expression: '(http.request.uri.path matches "^/api/")',
    action_parameters: { cache_reserve: { eligible: false }, cache: false },
  },
]
```

### 4. Making Assets Cache Reserve Eligible from Workers

**Note**: This modifies response headers to meet eligibility criteria but does NOT directly control Cache Reserve storage (which is zone-level automatic).

```typescript
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const response = await fetch(request)
    if (!response.ok) return response

    const headers = new Headers(response.headers)
    headers.set('Cache-Control', 'public, max-age=36000') // 10hr minimum
    headers.delete('Set-Cookie') // Blocks caching

    // Ensure Content-Length present
    if (!headers.has('Content-Length')) {
      const blob = await response.blob()
      headers.set('Content-Length', blob.size.toString())
      return new Response(blob, { status: response.status, headers })
    }

    return new Response(response.body, { status: response.status, headers })
  },
}
```

### 5. Hostname Best Practices

Use Worker's hostname for efficient caching - avoid overriding hostname unnecessarily.

## Architecture Patterns

### Multi-Tier Caching + Immutable Assets

```typescript
// Optimal: L1 (visitor) → L2 (region) → L3 (Cache Reserve) → Origin
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url)
    const isImmutable = /\.[a-f0-9]{8,}\.(js|css|jpg|png|woff2)$/.test(url.pathname)
    const response = await fetch(request)

    if (isImmutable) {
      const headers = new Headers(response.headers)
      headers.set('Cache-Control', 'public, max-age=31536000, immutable')
      return new Response(response.body, { status: response.status, headers })
    }
    return response
  },
}
```

## Cost Optimization

### Cost Calculator

```typescript
interface CacheReserveEstimate {
  avgAssetSizeGB: number
  uniqueAssets: number
  monthlyReads: number
  monthlyWrites: number
  originEgressCostPerGB: number // e.g., AWS: $0.09/GB
}

function estimateMonthlyCost(input: CacheReserveEstimate) {
  // Cache Reserve pricing
  const storageCostPerGBMonth = 0.015
  const classAPerMillion = 4.5 // writes
  const classBPerMillion = 0.36 // reads

  // Calculate Cache Reserve costs
  const totalStorageGB = input.avgAssetSizeGB * input.uniqueAssets
  const storageCost = totalStorageGB * storageCostPerGBMonth
  const writeCost = (input.monthlyWrites / 1_000_000) * classAPerMillion
  const readCost = (input.monthlyReads / 1_000_000) * classBPerMillion

  const cacheReserveCost = storageCost + writeCost + readCost

  // Calculate origin egress cost (what you'd pay without Cache Reserve)
  const totalTrafficGB = input.monthlyReads * input.avgAssetSizeGB
  const originEgressCost = totalTrafficGB * input.originEgressCostPerGB

  // Savings calculation
  const savings = originEgressCost - cacheReserveCost
  const savingsPercent = ((savings / originEgressCost) * 100).toFixed(1)

  return {
    cacheReserveCost: `$${cacheReserveCost.toFixed(2)}`,
    originEgressCost: `$${originEgressCost.toFixed(2)}`,
    monthlySavings: `$${savings.toFixed(2)}`,
    savingsPercent: `${savingsPercent}%`,
    breakdown: {
      storage: `$${storageCost.toFixed(2)}`,
      writes: `$${writeCost.toFixed(2)}`,
      reads: `$${readCost.toFixed(2)}`,
    },
  }
}

// Example: Media library
const mediaLibrary = estimateMonthlyCost({
  avgAssetSizeGB: 0.005, // 5MB images
  uniqueAssets: 10_000,
  monthlyReads: 5_000_000,
  monthlyWrites: 50_000,
  originEgressCostPerGB: 0.09, // AWS S3
})

console.log(mediaLibrary)
// {
//   cacheReserveCost: "$9.98",
//   originEgressCost: "$25.00",
//   monthlySavings: "$15.02",
//   savingsPercent: "60.1%",
//   breakdown: { storage: "$0.75", writes: "$0.23", reads: "$9.00" }
// }
```

### Diretrizes de otimização

- **Defina TTLs apropriados**: mínimo de 10 horas, 24 horas ou mais ideal para conteúdo estável, 30 dias no máximo com cautela
- **Ativos estáveis de alto valor em cache**: imagens, mídia, fontes, arquivos, documentação
- **Excluir alterações frequentes**: APIs, conteúdo específico do usuário, dados em tempo real
- **Nota de compactação**: Cache Reserve busca descompactado na origem e serve compactado aos visitantes - leva em consideração os custos de saída da origem

## Veja também

- [README](./README.md) - Visão geral e conceitos básicos
- [Configuração](./configuration.md) - Regras de configuração e cache
- [Referência da API](./api.md) - Limpeza e monitoramento
- [Gotchas](./gotchas.md) - Problemas comuns e solução de problemas
