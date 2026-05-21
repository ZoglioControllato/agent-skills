# Smart Placement Patterns

## Backend Worker with Database Access

```typescript
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const user = await env.DATABASE.prepare('SELECT * FROM users WHERE id = ?').bind(userId).first()
    const orders = await env.DATABASE.prepare('SELECT * FROM orders WHERE user_id = ?').bind(userId).all()
    return Response.json({ user, orders })
  },
}
```

```jsonc
{ "placement": { "mode": "smart" }, "d1_databases": [{ "binding": "DATABASE", "database_id": "xxx" }] }
```

## Frontend + Backend Split (Service Bindings)

**Frontend:** Runs at edge for fast user response
**Backend:** Smart Placement runs close to database

```typescript
// Frontend Worker - routes requests to backend
interface Env {
  BACKEND: Fetcher // Service Binding to backend Worker
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (new URL(request.url).pathname.startsWith('/api/')) {
      return env.BACKEND.fetch(request) // Forward to backend
    }
    return new Response('Frontend content')
  },
}

// Backend Worker - database operations
interface BackendEnv {
  DATABASE: D1Database
}

export default {
  async fetch(request: Request, env: BackendEnv): Promise<Response> {
    const data = await env.DATABASE.prepare('SELECT * FROM table').all()
    return Response.json(data)
  },
}
```

**CRÍTICO:** Use vinculações de serviço baseadas em busca (mostradas acima). Se estiver usando RPC com `WorkerEntrypoint`, o Smart Placement NÃO otimizará essas chamadas de método - apenas os manipuladores `fetch` serão afetados.

**RPC vs Fetch - CRÍTICO:** O Smart Placement funciona SOMENTE com vinculações baseadas em busca, NÃO RPC.```typescript
// ❌ RPC - Smart Placement has NO EFFECT on backend RPC methods
export class BackendRPC extends WorkerEntrypoint {
async getData() {
// ALWAYS runs at edge, Smart Placement ignored
return await this.env.DATABASE.prepare('SELECT \* FROM table').all()
}
}

// ✅ Fetch - Smart Placement WORKS
export default {
async fetch(request: Request, env: Env): Promise<Response> {
// Runs close to DATABASE when Smart Placement enabled
const data = await env.DATABASE.prepare('SELECT \* FROM table').all()
return Response.json(data)
},
}

````

## External API Integration

```typescript
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const apiUrl = 'https://api.partner.com'
    const headers = { Authorization: `Bearer ${env.API_KEY}` }

    const [profile, transactions] = await Promise.all([
      fetch(`${apiUrl}/profile`, { headers }),
      fetch(`${apiUrl}/transactions`, { headers }),
    ])

    return Response.json({
      profile: await profile.json(),
      transactions: await transactions.json(),
    })
  },
}
````

## SSR / API Gateway Pattern

```typescript
// Frontend (edge) - auth/routing close to user
export default {
  async fetch(request: Request, env: Env) {
    if (!request.headers.get('Authorization')) {
      return new Response('Unauthorized', { status: 401 })
    }
    const data = await env.BACKEND.fetch(request)
    return new Response(renderPage(await data.json()), {
      headers: { 'Content-Type': 'text/html' },
    })
  },
}

// Backend (Smart Placement) - DB operations close to data
export default {
  async fetch(request: Request, env: Env) {
    const data = await env.DATABASE.prepare('SELECT * FROM pages WHERE id = ?').bind(pageId).first()
    return Response.json(data)
  },
}
```

## Objetos duráveis com posicionamento inteligente

**Princípio fundamental:** O posicionamento inteligente NÃO controla ONDE os objetos duráveis são executados. Os DOs sempre funcionam em sua região designada (com base na jurisdição ou em dicas de localização inteligente).

**O que o Smart Placement afeta:** A localização do manipulador `fetch` do Worker coordenador que faz chamadas para vários DOs.

**Padrão:** Habilite o posicionamento inteligente no trabalhador coordenador que agrega dados de vários DOs:```typescript
// Worker with Smart Placement - aggregates data from multiple DOs
export default {
async fetch(request: Request, env: Env): Promise<Response> {
const userId = new URL(request.url).searchParams.get('user')

    // Get DO stubs
    const userDO = env.USER_DO.get(env.USER_DO.idFromName(userId))
    const analyticsID = env.ANALYTICS_DO.idFromName(`analytics-${userId}`)
    const analyticsDO = env.ANALYTICS_DO.get(analyticsID)

    // Fetch from multiple DOs
    const [userData, analyticsData] = await Promise.all([
      userDO.fetch(new Request('https://do/profile')),
      analyticsDO.fetch(new Request('https://do/stats')),
    ])

    return Response.json({
      user: await userData.json(),
      analytics: await analyticsData.json(),
    })

},
}

````

```jsonc
// wrangler.jsonc
{
  "placement": { "mode": "smart" },
  "durable_objects": {
    "bindings": [
      { "name": "USER_DO", "class_name": "UserDO" },
      { "name": "ANALYTICS_DO", "class_name": "AnalyticsDO" },
    ],
  },
}
````

**Quando isso ajuda:**

- O manipulador `fetch` do trabalhador é executado mais próximo das regiões DO, reduzindo a latência da rede para múltiplas chamadas DO
- Mais benéfico quando as DO estão geograficamente concentradas ou em jurisdições específicas
- Ajuda quando o coordenador faz muitas chamadas DO sequenciais ou paralelas

**Quando isso NÃO ajuda:**

- Os DOs são distribuídos globalmente (nenhuma localização ideal do trabalhador)
- O trabalhador chama apenas um único DO
- As chamadas DO são pouco frequentes ou armazenadas em cache

## Melhores práticas

- Divida aplicativos full-stack: frontend na borda, backend com Smart Placement
- Use ligações de serviço baseadas em busca (não RPC)
- Habilitar lógica de back-end: APIs, agregação de dados, operações de banco de dados
- Não habilitar para: conteúdo estático, lógica de borda, métodos RPC, páginas com `run_worker_first`
- Aguarde mais de 15 minutos para análise, verifique `placement_status = SUCCESS`
