# Padrões do Workers

## Tratamento de erros

```typescript
class HTTPError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message)
  }
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    try {
      return await handleRequest(request, env)
    } catch (error) {
      if (error instanceof HTTPError) {
        return new Response(JSON.stringify({ error: error.message }), {
          status: error.status,
          headers: { 'Content-Type': 'application/json' },
        })
      }
      return new Response('Internal Server Error', { status: 500 })
    }
  },
}
```

## CORS

```typescript
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
}
if (request.method === 'OPTIONS') return new Response(null, { headers: corsHeaders })
```

## Roteamento

```typescript
const router = { 'GET /api/users': handleGetUsers, 'POST /api/users': handleCreateUser }

const handler = router[`${request.method} ${url.pathname}`]
return handler ? handler(request, env) : new Response('Not Found', { status: 404 })
```

**Produção**: use Hono, itty-router ou Worktop (veja [frameworks.md](./frameworks.md))

## Validação de requisição (Zod)

```typescript
import { z } from 'zod'

const userSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  age: z.number().int().positive().optional(),
})

async function handleCreateUser(request: Request) {
  try {
    const body = await request.json()
    const validated = userSchema.parse(body) // Lança se inválido
    return new Response(JSON.stringify({ id: 1, ...validated }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return new Response(JSON.stringify({ errors: err.errors }), { status: 400 })
    }
    throw err
  }
}
```

**Com Hono**: use `@hono/zod-validator` para validação automática (veja [frameworks.md](./frameworks.md))

## Desempenho

```typescript
// ❌ Sequencial
const user = await fetch('/api/user/1')
const posts = await fetch('/api/posts?user=1')

// ✅ Paralelo
const [user, posts] = await Promise.all([fetch('/api/user/1'), fetch('/api/posts?user=1')])
```

## Streaming

```typescript
const stream = new ReadableStream({
  async start(controller) {
    for (let i = 0; i < 1000; i++) {
      controller.enqueue(new TextEncoder().encode(`Item ${i}\n`))
      if (i % 100 === 0) await new Promise((r) => setTimeout(r, 0))
    }
    controller.close()
  },
})
```

## Transform Streams

```typescript
response.body
  .pipeThrough(new TextDecoderStream())
  .pipeThrough(
    new TransformStream({
      transform(chunk, c) {
        c.enqueue(chunk.toUpperCase())
      },
    }),
  )
  .pipeThrough(new TextEncoderStream())
```

## Testes

```typescript
import { describe, it, expect } from 'vitest'
import worker from '../src/index'

describe('Worker', () => {
  it('returns 200', async () => {
    const req = new Request('http://localhost/')
    const env = { MY_VAR: 'test' }
    const ctx = { waitUntil: () => {}, passThroughOnException: () => {} }
    expect((await worker.fetch(req, env, ctx)).status).toBe(200)
  })
})
```

## Deploy

```bash
npx wrangler deploy              # produção
npx wrangler deploy --env staging
npx wrangler versions upload --message "Add feature"
npx wrangler rollback
```

## Monitoramento

```typescript
const start = Date.now()
const response = await handleRequest(request, env)
ctx.waitUntil(
  env.ANALYTICS.writeDataPoint({
    doubles: [Date.now() - start],
    blobs: [request.url, String(response.status)],
  }),
)
```

## Segurança e rate limiting

```typescript
// Cabeçalhos de segurança
const security = { 'X-Content-Type-Options': 'nosniff', 'X-Frame-Options': 'DENY' }

// Auth
const auth = request.headers.get('Authorization')
if (!auth?.startsWith('Bearer ')) return new Response('Unauthorized', { status: 401 })

// Rollouts graduais (bucketização determinística por usuário)
const hash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(userId))
if (new Uint8Array(hash)[0] % 100 < rolloutPercent) return newFeature(request)
```

Rate limiting: veja [Durable Objects](../durable-objects/README.md)

## Upload multipart no R2

```typescript
// Para arquivos > 100MB
const upload = await env.MY_BUCKET.createMultipartUpload('large-file.bin')
try {
  const parts = []
  for (let i = 0; i < chunks.length; i++) {
    parts.push(await upload.uploadPart(i + 1, chunks[i]))
  }
  await upload.complete(parts)
} catch (err) {
  await upload.abort()
  throw err
}
```

Uploads paralelos, retomada em falha, arquivos > 5 GB

## Workflows (orquestração de passos)

```typescript
import { WorkflowEntrypoint, WorkflowStep, WorkflowEvent } from 'cloudflare:workers'

export class MyWorkflow extends WorkflowEntrypoint {
  async run(event: WorkflowEvent<{ userId: string }>, step: WorkflowStep) {
    const user = await step.do('fetch-user', async () =>
      fetch(`/api/users/${event.payload.userId}`).then((r) => r.json()),
    )
    await step.sleep('wait', '1 hour')
    await step.do('notify', async () => sendEmail(user.email))
  }
}
```

Jobs multi-etapas com retries automáticos, persistência de estado, retomada após falha

## Ver também

- [API](./api.md) — APIs de runtime
- [Gotchas](./gotchas.md) — problemas comuns
- [Configuration](./configuration.md) — configuração
- [Frameworks](./frameworks.md) — Hono, roteamento, validação
