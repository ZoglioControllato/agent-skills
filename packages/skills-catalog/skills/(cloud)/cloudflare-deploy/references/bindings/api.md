# Referência da API Bindings

## Tipos TypeScript

A Cloudflare gera tipos via `npx wrangler types`, criando `.wrangler/types/runtime.d.ts` com sua interface `Env`.

### Interface Env gerada

```typescript
interface Env {
  // From wrangler.jsonc bindings
  MY_KV: KVNamespace
  MY_BUCKET: R2Bucket
  DB: D1Database
  MY_SERVICE: Fetcher
  AI: Ai

  // From vars
  API_URL: string

  // From secrets (set via wrangler secret put)
  API_KEY: string
}
```

### Tipos por config

| Config                                                     | Tipo TypeScript          | Pacote                      |
| ---------------------------------------------------------- | ------------------------ | --------------------------- |
| `kv_namespaces`                                            | `KVNamespace`            | `@cloudflare/workers-types` |
| `r2_buckets`                                               | `R2Bucket`               | `@cloudflare/workers-types` |
| `d1_databases`                                             | `D1Database`             | `@cloudflare/workers-types` |
| `durable_objects.bindings`                                 | `DurableObjectNamespace` | `@cloudflare/workers-types` |
| `vectorize`                                                | `VectorizeIndex`         | `@cloudflare/workers-types` |
| `queues.producers`                                         | `Queue`                  | `@cloudflare/workers-types` |
| `services`                                                 | `Fetcher`                | `@cloudflare/workers-types` |
| `ai`                                                       | `Ai`                     | `@cloudflare/workers-types` |
| `browser`                                                  | `Fetcher`                | `@cloudflare/workers-types` |
| `analytics_engine_datasets`                                | `AnalyticsEngineDataset` | `@cloudflare/workers-types` |
| `hyperdrive`                                               | `Hyperdrive`             | `@cloudflare/workers-types` |
| `rate_limiting`                                            | `RateLimit`              | `@cloudflare/workers-types` |
| `workflows`                                                | `Workflow`               | `@cloudflare/workers-types` |
| `mtls_certificates` / `vars` / `text_blobs` / `data_blobs` | `string`                 | Built-in                    |
| `wasm_modules`                                             | `WebAssembly.Module`     | Built-in                    |

## Acessar bindings

### Método 1: handler fetch() (recomendado)

```typescript
export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const value = await env.MY_KV.get('key')
    return new Response(value)
  },
}
```

**Por quê:** tipado, alinhado à API Workers, suporta `ctx` para waitUntil/passThroughOnException.

### Método 2: framework Hono

```typescript
import { Hono } from 'hono'

const app = new Hono<{ Bindings: Env }>()

app.get('/', async (c) => {
  const value = await c.env.MY_KV.get('key')
  return c.json({ value })
})

export default app
```

**Por quê:** `c.env` tipado, ergonômico para apps com muito roteamento.

### Método 3: Module Workers (legado)

```typescript
export async function handleRequest(request: Request, env: Env): Promise<Response> {
  const value = await env.MY_KV.get('key')
  return new Response(value)
}

addEventListener('fetch', (event) => {
  // env not directly available - requires workarounds
})
```

**Evite:** prefira handler `fetch()` (método 1).

## Fluxo de geração de tipos

### Setup inicial

```bash
npm install -D wrangler
npx wrangler types
```

### Após alterar bindings

```bash
npx wrangler types
```

**Nota:** saída em `.wrangler/types/runtime.d.ts`. O TypeScript encontra se `@cloudflare/workers-types` estiver em `tsconfig.json` `"types"`.

## Métodos principais por binding

**KV:**

```typescript
await env.MY_KV.get(key, { type: 'json' }) // text|json|arrayBuffer|stream
await env.MY_KV.put(key, value, { expirationTtl: 3600 })
await env.MY_KV.delete(key)
await env.MY_KV.list({ prefix: 'user:' })
```

**R2:**

```typescript
await env.BUCKET.get(key)
await env.BUCKET.put(key, value)
await env.BUCKET.delete(key)
await env.BUCKET.list({ prefix: 'images/' })
```

**D1:**

```typescript
await env.DB.prepare('SELECT * FROM users WHERE id = ?').bind(userId).first()
await env.DB.batch([stmt1, stmt2])
```

**Service:**

```typescript
await env.MY_SERVICE.fetch(new Request('https://fake/path'))
```

**Workers AI:**

```typescript
await env.AI.run('@cf/meta/llama-3.1-8b-instruct', { prompt: 'Hello' })
```

**Queues:**

```typescript
await env.MY_QUEUE.send({ userId: 123, action: 'process' })
```

**Durable Objects:**

```typescript
const id = env.MY_DO.idFromName('user-123')
const stub = env.MY_DO.get(id)
await stub.fetch(new Request('https://fake/increment'))
```

## Tipos em runtime vs build

| Origem                      | Quando            | Uso                              |
| --------------------------- | ----------------- | -------------------------------- |
| `@cloudflare/workers-types` | npm install       | APIs base (Request, Response, …) |
| `wrangler types`            | Após mudar config | Seus bindings (interface `Env`)  |

**Instale os dois abaixo:**

```bash
npm install -D @cloudflare/workers-types
npx wrangler types
```

## Boas práticas de tipagem

1. **Nunca use `any` em env:**

```typescript
// ❌ BAD
async fetch(request: Request, env: any) { }

// ✅ GOOD
async fetch(request: Request, env: Env) { }
```

2. **Rode `wrangler types` após mudar config.**

3. **Confira tipos gerados:**

```bash
cat .wrangler/types/runtime.d.ts
```

## Ver também

- [Workers Types Package](https://www.npmjs.com/package/@cloudflare/workers-types)
- [Wrangler Types Command](https://developers.cloudflare.com/workers/wrangler/commands/#types)
