# Multi-Tenant Patterns

## Billing by Plan

```typescript
interface Env {
  DISPATCHER: DispatchNamespace
  CUSTOMERS_KV: KVNamespace
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const userWorkerName = new URL(request.url).hostname.split('.')[0]
    const customerPlan = await env.CUSTOMERS_KV.get(userWorkerName)

    const plans = {
      enterprise: { cpuMs: 50, subRequests: 50 },
      pro: { cpuMs: 20, subRequests: 20 },
      free: { cpuMs: 10, subRequests: 5 },
    }
    const limits = plans[customerPlan as keyof typeof plans] || plans.free

    const userWorker = env.DISPATCHER.get(userWorkerName, {}, { limits })
    return await userWorker.fetch(request)
  },
}
```

## Resource Isolation

**Complete isolation:** Create unique resources per customer

- KV namespace per customer
- D1 database per customer
- R2 bucket per customer

```typescript
const bindings = [
  {
    type: 'kv_namespace',
    name: 'USER_KV',
    namespace_id: `customer-${customerId}-kv`,
  },
]
```

## Hostname Routing

### Wildcard Route (Recommended)

Configure `*/*` route on SaaS domain → dispatch Worker

**Benefits:**

- Supports subdomains + custom vanity domains
- No per-route limits (regular Workers limited to 100 routes)
- Programmatic control
- Works with any DNS proxy settings

**Setup:**

1. Cloudflare for SaaS custom hostnames
2. Fallback origin (dummy `A 192.0.2.0` if Worker is origin)
3. DNS CNAME to SaaS domain
4. `*/*` route → dispatch Worker
5. Routing logic in dispatch Worker

```typescript
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const hostname = new URL(request.url).hostname
    const hostnameData = await env.ROUTING_KV.get(`hostname:${hostname}`, { type: 'json' })

    if (!hostnameData?.workerName) {
      return new Response('Hostname not configured', { status: 404 })
    }

    const userWorker = env.DISPATCHER.get(hostnameData.workerName)
    return await userWorker.fetch(request)
  },
}
```

### Somente subdomínio

1. DNS curinga: `*.saas.com` → origem
2. Rota: `*.saas.com/*` → despachar Trabalhador
3. Extraia o subdomínio para roteamento

### Comportamento laranja para laranja (O2O)

Quando os clientes usam Cloudflare e CNAME em seu domínio Workers:

| Cenário                                   | Comportamento                | Padrão de rota            |
| ----------------------------------------- | ---------------------------- | ------------------------- |
| Cliente que não usa Cloudflare            | Roteamento padrão            | `*/*` ou `*.domain.com/*` |
| Cliente na Cloudflare (CNAME com proxy)   | Invoca Trabalhador no limite | `*/*` obrigatório         |
| Cliente na Cloudflare (CNAME somente DNS) | Roteamento padrão            | Qualquer rota funciona    |

**Recomendação:** Sempre use o curinga `*/*` para um comportamento O2O consistente.

### Roteamento de metadados personalizado

Para Cloudflare for SaaS: armazene o nome do trabalhador no nome de host personalizado `custom_metadata` e recupere no trabalhador de despacho para rotear solicitações. Requer nomes de host personalizados como subdomínios do seu domínio.

## Observabilidade

### Logpush

- Habilitar no despacho Worker → captura todos os logs do Worker do usuário
- Filtrar por `Resultado` ou `Nome do Script`

### Trabalhadores de cauda

- Logs em tempo real com formatação personalizada
- Recebe status HTTP, `console.log()`, exceções, diagnósticos

### Mecanismo de análise```typescript

// Track violations
env.ANALYTICS.writeDataPoint({
indexes: [customerName],
blobs: ['cpu_limit_exceeded'],
})

````

### GraphQL

```graphql
query {
  viewer {
    accounts(filter: { accountTag: $accountId }) {
      workersInvocationsAdaptive(filter: { dispatchNamespaceName: "production" }) {
        sum {
          requests
          errors
          cpuTime
        }
      }
    }
  }
}
````

## Use Case Implementations

### AI Code Execution

```typescript
async function deployGeneratedCode(name: string, code: string) {
  const file = new File([code], `${name}.mjs`, { type: 'application/javascript+module' })
  await client.workersForPlatforms.dispatch.namespaces.scripts.update('production', name, {
    account_id: accountId,
    metadata: { main_module: `${name}.mjs`, tags: [name, 'ai-generated'] },
    files: [file],
  })
}

// Short limits for untrusted code
const userWorker = env.DISPATCHER.get(sessionId, {}, { limits: { cpuMs: 5, subRequests: 3 } })
```

**VibeSDK:** For AI-powered code generation + deployment platforms, see [VibeSDK](https://github.com/cloudflare/vibesdk) - handles AI generation, sandbox execution, live preview, and deployment.

Reference: [AI Vibe Coding Platform Architecture](https://developers.cloudflare.com/reference-architecture/diagrams/ai/ai-vibe-coding-platform/)

### Edge Functions Platform

```typescript
// Route: /customer-id/function-name
const [customerId, functionName] = new URL(request.url).pathname.split('/').filter(Boolean)
const workerName = `${customerId}-${functionName}`
const userWorker = env.DISPATCHER.get(workerName)
```

### Construtor de sites

- Implantar ativos estáticos + código de trabalho
- Consulte [api.md](./api.md#static-assets) para implementação completa
- Hashes de sal para isolamento de ativos

## Melhores práticas

### Arquitetura

- Um namespace por ambiente (produção, teste)
- Lógica da plataforma no despacho Worker (autenticação, limitação de taxa, validação)
- Isolamento automático (sem cache compartilhado, modo não confiável)

### Roteamento

- Use rotas curinga `*/*`
- Armazenar mapeamentos em KV
- Lide com trabalhadores ausentes com elegância

### Limites e Segurança

- Defina limites personalizados por plano
- Rastreie violações com Analytics Engine
- Use trabalhadores de saída para controle de saída
- Sanitizar respostas

### Etiquetas

- Identifique todos os trabalhadores: ID do cliente, plano, ambiente
- Habilitar operações em massa
- Filtre com eficiência

Consulte [README.md](./README.md), [configuration.md](./configuration.md), [api.md](./api.md), [gotchas.md](./gotchas.md)
