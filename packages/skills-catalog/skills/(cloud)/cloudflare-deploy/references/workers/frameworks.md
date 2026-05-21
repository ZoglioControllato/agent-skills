# Frameworks para Workers

## Hono (recomendado)

Framework web nativo de Workers com excelente suporte a TypeScript e ecossistema de middleware.

```bash
npm install hono
```

### Configuração básica

```typescript
import { Hono } from 'hono'

const app = new Hono()

app.get('/', (c) => c.text('Hello World!'))
app.post('/api/users', async (c) => {
  const body = await c.req.json()
  return c.json({ id: 1, ...body }, 201)
})

export default app
```

### Ambiente tipado

```typescript
import type { Env } from './.wrangler/types/runtime'

const app = new Hono<{ Bindings: Env }>()

app.get('/data', async (c) => {
  const value = await c.env.MY_KV.get('key') // Totalmente tipado
  return c.text(value || 'Not found')
})
```

### Middleware

```typescript
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'

app.use('*', logger())
app.use('/api/*', cors({ origin: '*' }))

// Middleware customizado
app.use('/protected/*', async (c, next) => {
  const auth = c.req.header('Authorization')
  if (!auth?.startsWith('Bearer ')) return c.text('Unauthorized', 401)
  await next()
})
```

### Validação de requisição (Zod)

```typescript
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'

const schema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
})

app.post('/users', zValidator('json', schema), async (c) => {
  const validated = c.req.valid('json') // Dados tipados e validados
  return c.json({ id: 1, ...validated })
})
```

**Tratamento de erros**: resposta 400 automática com erros de validação

### Grupos de rotas

```typescript
const api = new Hono().basePath('/api')

api.get('/users', (c) => c.json([]))
api.post('/users', (c) => c.json({ id: 1 }))

app.route('/', api) // Monta em /api/*
```

### Tratamento de erros

```typescript
app.onError((err, c) => {
  console.error(err)
  return c.json({ error: err.message }, 500)
})

app.notFound((c) => c.json({ error: 'Not Found' }, 404))
```

### Acessar ExecutionContext

```typescript
export default {
  fetch(request: Request, env: Env, ctx: ExecutionContext) {
    return app.fetch(request, env, ctx)
  },
}

// Em handlers de rota:
app.get('/log', (c) => {
  c.executionCtx.waitUntil(logRequest(c.req))
  return c.text('OK')
})
```

### OpenAPI/Swagger (Hono OpenAPI)

```typescript
import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi'

const app = new OpenAPIHono()

const route = createRoute({
  method: 'get',
  path: '/users/{id}',
  request: { params: z.object({ id: z.string() }) },
  responses: {
    200: { description: 'User found', content: { 'application/json': { schema: z.object({ id: z.string() }) } } },
  },
})

app.openapi(route, (c) => {
  const { id } = c.req.valid('param')
  return c.json({ id })
})

app.doc('/openapi.json', { openapi: '3.0.0', info: { version: '1.0.0', title: 'API' } })
```

### Testes com Hono

```typescript
import { describe, it, expect } from 'vitest'
import app from '../src/index'

describe('API', () => {
  it('GET /', async () => {
    const res = await app.request('/')
    expect(res.status).toBe(200)
    expect(await res.text()).toBe('Hello World!')
  })
})
```

## Outros frameworks

### itty-router (minimalista)

```typescript
import { Router } from 'itty-router'

const router = Router()

router.get('/users/:id', ({ params }) => new Response(params.id))

export default { fetch: router.handle }
```

**Caso de uso**: bundle minúsculo (~500 bytes), roteamento simples

### Worktop (avançado)

```typescript
import { Router } from 'worktop'

const router = new Router()

router.add('GET', '/users/:id', (req, res) => {
  res.send(200, { id: req.params.id })
})

router.listen()
```

**Caso de uso**: roteamento avançado, utilitários CORS/cache embutidos

## Comparação de frameworks

| Framework   | Tamanho do bundle | TypeScript | Middleware | Validação | Melhor para         |
| ----------- | ----------------- | ---------- | ---------- | --------- | ------------------- |
| Hono        | ~12KB             | Excelente  | Rico       | Zod       | Apps em produção    |
| itty-router | ~500B             | Bom        | Básico     | Manual    | APIs mínimas        |
| Worktop     | ~8KB              | Bom        | Avançado   | Manual    | Roteamento complexo |

## Ver também

- [Patterns](./patterns.md) — fluxos comuns
- [API](./api.md) — APIs de runtime
- [Gotchas](./gotchas.md) — problemas específicos de framework
