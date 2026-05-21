# Padrões e boas práticas de bindings

## Service bindings

### RPC via service bindings

```typescript
// auth-worker
export default {
  async fetch(request: Request, env: Env) {
    const token = request.headers.get('Authorization')
    return new Response(JSON.stringify({ valid: await validateToken(token) }))
  },
}

// api-worker
const response = await env.AUTH_SERVICE.fetch(
  new Request('https://fake-host/validate', {
    headers: { Authorization: token },
  }),
)
```

**Por quê RPC?** Latência mínima (mesmo datacenter), sem DNS, sem custo extra de egress entre serviços.

**HTTP vs Service:**

```typescript
// ❌ HTTP (lento, pode ter custo, latência entre regiões)
await fetch('https://auth-worker.example.com/validate')

// ✅ Service binding (rápido, mesmo isolado)
await env.AUTH_SERVICE.fetch(new Request('https://fake-host/validate'))
```

**Host na URL não importa** para service bindings: roteamento pelo nome do binding.

### RPC tipado

```typescript
// shared-types.ts
export interface AuthRequest {
  token: string
}
export interface AuthResponse {
  valid: boolean
  userId?: string
}

// auth-worker
export default {
  async fetch(request: Request): Promise<Response> {
    const body: AuthRequest = await request.json()
    const response: AuthResponse = { valid: true, userId: '123' }
    return Response.json(response)
  },
}

// api-worker
const response = await env.AUTH_SERVICE.fetch(
  new Request('https://fake/validate', {
    method: 'POST',
    body: JSON.stringify({ token } satisfies AuthRequest),
  }),
)
const data: AuthResponse = await response.json()
```

## Gestão de secrets

```bash
npx wrangler secret put API_KEY
cat api-key.txt | npx wrangler secret put API_KEY
npx wrangler secret put API_KEY --env staging
```

```typescript
const response = await fetch('https://api.example.com', {
  headers: { Authorization: `Bearer ${env.API_KEY}` },
})
```

**Nunca commite:**

```jsonc
{ "vars": { "API_KEY": "sk_live_abc123" } }
```

## Testes com mocks

```typescript
import { vi } from 'vitest'

const mockKV: KVNamespace = {
  get: vi.fn(async (key) => (key === 'test' ? 'value' : null)),
  put: vi.fn(async () => {}),
  delete: vi.fn(async () => {}),
  list: vi.fn(async () => ({ keys: [], list_complete: true, cursor: '' })),
  getWithMetadata: vi.fn(),
} as unknown as KVNamespace

const mockEnv: Env = { MY_KV: mockKV }
const mockCtx: ExecutionContext = {
  waitUntil: vi.fn(),
  passThroughOnException: vi.fn(),
}

const response = await worker.fetch(new Request('http://localhost/test'), mockEnv, mockCtx)
```

## Padrões de acesso

### Acesso preguiçoso

```typescript
if (url.pathname === '/cached') {
  const cached = await env.MY_KV.get('data')
  if (cached) return new Response(cached)
}
```

### Acesso paralelo

```typescript
const [user, config, cache] = await Promise.all([
  env.DB.prepare('SELECT * FROM users WHERE id = ?').bind(userId).first(),
  env.MY_KV.get('config'),
  env.CACHE.get('data'),
])
```

## Escolha de storage

### KV

```typescript
const config = await env.MY_KV.get('app-config', { type: 'json' })
```

**Use quando:** leitura alta, <25MB, distribuição global, eventual OK  
**Latência:** leituras <10ms (cache); escritas eventualmente ~60s

### D1

```typescript
const results = await env.DB.prepare(
  `
  SELECT u.name, COUNT(o.id) FROM users u
  LEFT JOIN orders o ON u.id = o.user_id GROUP BY u.id
`,
).all()
```

**Use quando:** dados relacionais, JOINs, transações ACID  
**Limites:** 10GB por DB, 100k linhas por query

### R2

```typescript
const object = await env.MY_BUCKET.get('large-file.zip')
return new Response(object.body)
```

**Use quando:** arquivos >25MB, API estilo S3  
**Limites:** 5TB por objeto

### Durable Objects

```typescript
const id = env.COUNTER.idFromName('global')
const stub = env.COUNTER.get(id)
await stub.fetch(new Request('https://fake/increment'))
```

**Use quando:** consistência forte, coordenação tempo real, estado WebSocket

## Anti-padrões

**Credenciais hardcoded** → `npx wrangler secret put`  
**REST em vez de binding** → `env.MY_KV.get('key')`  
**Polling de storage** → Durable Objects para estado em tempo real  
**Dados grandes em vars** (5KB) → KV  
**Cache global de env** → leia `env` dentro de `fetch()`

## Ver também

- [Service Bindings Docs](https://developers.cloudflare.com/workers/runtime-apis/bindings/service-bindings/)
- [Miniflare Testing](https://miniflare.dev/)
