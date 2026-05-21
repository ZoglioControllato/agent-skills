# Smart Placement API

## Placement Status API

Query Worker placement status via Cloudflare API:

```bash
curl -X GET "https://api.cloudflare.com/client/v4/accounts/{ACCOUNT_ID}/workers/services/{WORKER_NAME}" \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json"
```

Response includes `placement_status` field:

```typescript
type PlacementStatus =
  | undefined // Not yet analyzed
  | 'SUCCESS' // Successfully optimized
  | 'INSUFFICIENT_INVOCATIONS' // Not enough traffic
  | 'UNSUPPORTED_APPLICATION' // Made Worker slower (reverted)
```

## Status Meanings

**`undefined` (not present)**

- Worker not yet analyzed
- Always runs at default edge location closest to user

**`SUCCESS`**

- Analysis complete, Smart Placement active
- Worker runs in optimal location (may be edge or remote)

**`INSUFFICIENT_INVOCATIONS`**

- Not enough requests to make placement decision
- Requires consistent multi-region traffic
- Always runs at default edge location

**`UNSUPPORTED_APPLICATION`** (rare, <1% of Workers)

- Smart Placement made Worker slower
- Placement decision reverted
- Always runs at edge location
- Won't be re-analyzed until redeployed

## cf-placement Header (Beta)

Smart Placement adds response header indicating routing decision:

```typescript
// Remote placement (Smart Placement routed request)
'cf-placement: remote-LHR' // Routed to London

// Local placement (default edge routing)
'cf-placement: local-EWR' // Stayed at Newark edge
```

Format: `{placement-type}-{IATA-code}`

- `remote-*` = Smart Placement routed to remote location
- `local-*` = Stayed at default edge location
- IATA code = nearest airport to data center

**Warning:** Beta feature, may be removed before GA.

## Detecting Smart Placement in Code

**Note:** `cf-placement` header is a beta feature and may change or be removed.

```typescript
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const placementHeader = request.headers.get('cf-placement')

    if (placementHeader?.startsWith('remote-')) {
      const location = placementHeader.split('-')[1]
      console.log(`Smart Placement routed to ${location}`)
    } else if (placementHeader?.startsWith('local-')) {
      const location = placementHeader.split('-')[1]
      console.log(`Running at edge location ${location}`)
    }

    return new Response('OK')
  },
} satisfies ExportedHandler<Env>
```

## Métricas de duração da solicitação

Disponível no painel da Cloudflare quando o Smart Placement está ativado:

**Trabalhadores e páginas → [Seu trabalhador] → Métricas → Duração da solicitação**

Mostra o histograma comparando:

- Duração da solicitação COM posicionamento inteligente (99% do tráfego)
- Duração da solicitação SEM posicionamento inteligente (linha de base de 1%)

**Duração da solicitação versus duração da execução:**

- **Duração da solicitação:** Tempo total desde a chegada da solicitação até a entrega da resposta (inclui latência da rede)
- **Duração da execução:** Tempo de execução ativa do código do Worker (exclui esperas de rede)

Use a duração da solicitação para medir o impacto do posicionamento inteligente.

### Interpretando Métricas

| Comparação de métricas | Interpretação                       | Ação                                        |
| ---------------------- | ----------------------------------- | ------------------------------------------- |
| COM < SEM              | Ajuda no posicionamento inteligente | Manter ativado                              |
| COM ≈ SEM              | Impacto neutro                      | Considere desabilitar para liberar recursos |
| COM > SEM              | Colocação inteligente prejudicando  | Desative com `mode: "off"`                  |

**Por que o posicionamento inteligente pode prejudicar o desempenho:**

- O Worker atende principalmente ativos estáticos ou conteúdo em cache
- Os serviços de back-end são distribuídos globalmente (sem um único local ideal)
- O trabalhador tem comunicação de back-end mínima
- Usando páginas com `assets.run_worker_first = true`

**Melhorias típicas quando o posicionamento inteligente ajuda:**

- Redução de 20 a 50% na duração da solicitação para trabalhadores com uso intenso de banco de dados
- Redução de 30 a 60% para trabalhadores que fazem múltiplas chamadas de API de back-end
- Melhorias maiores quando o back-end está concentrado geograficamente

## Comandos de monitoramento```bash

# Tail Worker logs

wrangler tail your-worker-name

# Tail with filters

wrangler tail your-worker-name --status error
wrangler tail your-worker-name --header cf-placement

# Check placement status via API

curl -H "Authorization: Bearer $TOKEN" \
  https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/workers/services/$WORKER_NAME \
 | jq .result.placement_status

````

## TypeScript Types

```typescript
// Placement status returned by API (field may be absent)
type PlacementStatus = 'SUCCESS' | 'INSUFFICIENT_INVOCATIONS' | 'UNSUPPORTED_APPLICATION' | undefined

// Placement configuration in wrangler.jsonc
type PlacementMode = 'smart' | 'off'

interface PlacementConfig {
  mode: PlacementMode
  // Legacy fields (deprecated/removed):
  // hint?: string;  // REMOVED - no longer supported
}

// Explicit placement (separate feature from Smart Placement)
interface ExplicitPlacementConfig {
  region?: string
  host?: string
  hostname?: string
  // Cannot combine with mode field
}

// Worker metadata from API response
interface WorkerMetadata {
  placement?: PlacementConfig | ExplicitPlacementConfig
  placement_status?: PlacementStatus
}

// Service Binding for backend Worker
interface Env {
  BACKEND_SERVICE: Fetcher // Service Binding to backend Worker
  DATABASE: D1Database
}

// Example Worker with Service Binding
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    // Forward to backend Worker with Smart Placement enabled
    const response = await env.BACKEND_SERVICE.fetch(request)
    return response
  },
} satisfies ExportedHandler<Env>
````
