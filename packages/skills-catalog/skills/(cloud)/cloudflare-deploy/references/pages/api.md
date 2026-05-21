# API das Functions

## Roteamento baseado em arquivo

```
/functions/index.ts              → example.com/
/functions/api/users.ts          → example.com/api/users
/functions/api/users/[id].ts     → example.com/api/users/:id
/functions/api/users/[[path]].ts → example.com/api/users/* (catchall)
/functions/_middleware.ts        → Runs before all routes
```

**Regras**: `[param]` = um segmento, `[[param]]` = catchall multi-segmento, o mais específico vence.

## Handlers de requisição

```typescript
import type { PagesFunction } from '@cloudflare/workers-types'

interface Env {
  DB: D1Database
  KV: KVNamespace
}

// All methods
export const onRequest: PagesFunction<Env> = async (context) => {
  return new Response('All methods')
}

// Method-specific
export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { request, env, params, data } = context

  const user = await env.DB.prepare('SELECT * FROM users WHERE id = ?').bind(params.id).first()

  return Response.json(user)
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const body = await context.request.json()
  return Response.json({ success: true })
}

// Also: onRequestPut, onRequestPatch, onRequestDelete, onRequestHead, onRequestOptions
```

## Objeto de contexto

```typescript
interface EventContext<Env, Params, Data> {
  request: Request // HTTP request
  env: Env // Bindings (KV, D1, R2, etc.)
  params: Params // Route parameters
  data: Data // Middleware-shared data
  waitUntil: (promise: Promise<any>) => void // Background tasks
  next: () => Promise<Response> // Next handler
  passThroughOnException: () => void // Error fallback (not in advanced mode)
}
```

## Rotas dinâmicas

```typescript
// Single segment: functions/users/[id].ts
export const onRequestGet: PagesFunction = async ({ params }) => {
  // /users/123 → params.id = "123"
  return Response.json({ userId: params.id })
}

// Multi-segment: functions/files/[[path]].ts
export const onRequestGet: PagesFunction = async ({ params }) => {
  // /files/docs/api/v1.md → params.path = ["docs", "api", "v1.md"]
  const filePath = (params.path as string[]).join('/')
  return new Response(filePath)
}
```

## Middleware

```typescript
// functions/_middleware.ts
// Single
export const onRequest: PagesFunction = async (context) => {
  const response = await context.next()
  response.headers.set('X-Custom-Header', 'value')
  return response
}

// Chained (runs in order)
const errorHandler: PagesFunction = async (context) => {
  try {
    return await context.next()
  } catch (err) {
    return new Response(err.message, { status: 500 })
  }
}

const auth: PagesFunction = async (context) => {
  const token = context.request.headers.get('Authorization')
  if (!token) return new Response('Unauthorized', { status: 401 })
  context.data.userId = await verifyToken(token)
  return context.next()
}

export const onRequest = [errorHandler, auth]
```

**Escopo**: `functions/_middleware.ts` → todas; `functions/api/_middleware.ts` → só `/api/*`

## Uso de bindings

```typescript
export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
  // KV
  const cached = await env.KV.get('key', 'json')
  await env.KV.put('key', JSON.stringify({ data: 'value' }), { expirationTtl: 3600 })

  // D1
  const result = await env.DB.prepare('SELECT * FROM users WHERE id = ?').bind(userId).first()

  // R2, Queue, AI - see respective reference docs

  return Response.json({ success: true })
}
```

## Modo avançado

API completa do Workers; ignora roteamento por arquivo:

```javascript
// functions/_worker.js
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url)

    // Custom routing
    if (url.pathname.startsWith('/api/')) {
      return new Response('API response')
    }

    // REQUIRED: Serve static assets
    return env.ASSETS.fetch(request)
  },
}
```

**Quando usar**: WebSockets, roteamento complexo, handlers agendados, email.

## Smart Placement

Otimiza automaticamente onde a função executa com base no padrão de tráfego.

**Configuração** (em wrangler.jsonc):

```jsonc
{
  "placement": {
    "mode": "smart", // Enables optimization (default: off)
  },
}
```

**Como funciona**: analisa tráfego ao longo do tempo e posiciona funções mais perto de usuários ou dados (ex.: D1). Sem mudanças de código.

**Trade-offs**: requisições iniciais podem ter latência um pouco maior na fase de aprendizado (horas–dias). O desempenho melhora conforme o sistema otimiza.

**Quando usar**: apps globais com banco centralizado ou fontes de tráfego geograficamente concentradas.

## getRequestContext (SSR de framework)

Acesse bindings no código do framework:

```typescript
// SvelteKit
import type { RequestEvent } from '@sveltejs/kit'
export async function load({ platform }: RequestEvent) {
  const data = await platform.env.DB.prepare('SELECT * FROM users').all()
  return { users: data.results }
}

// Astro
const { DB } = Astro.locals.runtime.env
const data = await DB.prepare('SELECT * FROM users').all()

// Solid Start (server function)
import { getRequestEvent } from 'solid-js/web'
const event = getRequestEvent()
const data = await event.locals.runtime.env.DB.prepare('SELECT * FROM users').all()
```

**Adaptadores suportados** (2026):

- **SvelteKit**: `@sveltejs/adapter-cloudflare`
- **Astro**: adapter Cloudflare embutido
- **Nuxt**: `nitro.preset: 'cloudflare-pages'` em `nuxt.config.ts`
- **Qwik**: adapter Cloudflare embutido
- **Solid Start**: `@solidjs/start-cloudflare-pages`

**Depreciado/não suportado**:

- **Next.js**: adapter oficial (`@cloudflare/next-on-pages`) depreciado. Use Vercel ou self-host em Workers.
- **Remix**: adapter oficial (`@remix-run/cloudflare-pages`) depreciado. Migre para frameworks suportados.

Veja [gotchas.md](./gotchas.md#framework-specific) para orientação de migração.
