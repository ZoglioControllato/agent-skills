# Padrões de teste

## Escolhendo uma abordagem de teste

| Abordagem                     | Caso de uso                          | Velocidade | Configuração | Tempo de execução |
| ----------------------------- | ------------------------------------ | ---------- | ------------ | ----------------- |
| **getPlatformProxy**          | Testes unitários, testes lógicos     | Rápido     | Baixo        | Miniflare         |
| **API Miniflare**             | Testes de integração, controle total | Médio      | Médio        | Miniflare         |
| **vitest-pool-trabalhadores** | Integração do corredor Vitest        | Médio      | Médio        | trabalhador       |

**Guia rápido:**

- Testes unitários → getPlatformProxy
- Testes de integração → API Miniflare
- Fluxos de trabalho Vitest → vitest-pool-workers

## getPlatformProxy

Teste de unidade leve - fornece ligações sem tempo de execução completo do Worker.

```js
// vitest.config.js
export default { test: { environment: 'node' } }
```

```js
import { env } from 'cloudflare:test'
import { describe, it, expect } from 'vitest'

describe('Business logic', () => {
  it('processes data with KV', async () => {
    await env.KV.put('test', 'value')
    expect(await env.KV.get('test')).toBe('value')
  })
})
```

**Prós:** Rápido, simples  
**Contras:** Sem tempo de execução completo, não é possível testar o manipulador de busca

## vitest-pool-trabalhadores

Tempo de execução completo dos trabalhadores no Vitest. Lê `wrangler.toml`.

```bash
npm i -D @cloudflare/vitest-pool-workers
```

```js
// vitest.config.js
import { defineWorkersConfig } from '@cloudflare/vitest-pool-workers/config'

export default defineWorkersConfig({
  test: {
    poolOptions: { workers: { wrangler: { configPath: './wrangler.toml' } } },
  },
})
```

```js
import { env, SELF } from 'cloudflare:test'
import { it, expect } from 'vitest'

it('handles fetch', async () => {
  const res = await SELF.fetch('http://example.com/')
  expect(res.status).toBe(200)
})
```

**Prós:** Tempo de execução completo, usa wrangler.toml  
**Contras:** Requer configuração do Wrangler

## API Miniflare (nó:teste)

```js
import assert from 'node:assert'
import test, { after, before } from 'node:test'
import { Miniflare } from 'miniflare'

let mf
before(() => {
  mf = new Miniflare({ scriptPath: 'src/index.js', kvNamespaces: ['TEST_KV'] })
})

test('fetch', async () => {
  const res = await mf.dispatchFetch('http://localhost/')
  assert.strictEqual(await res.text(), 'Hello')
})

after(() => mf.dispose())
```

##Testando objetos e eventos duráveis

```js
// Durable Objects
const ns = await mf.getDurableObjectNamespace('COUNTER')
const stub = ns.get(ns.idFromName('test-counter'))
await stub.fetch('http://localhost/increment')

// Direct storage
const storage = await mf.getDurableObjectStorage(ns.idFromName('test-counter'))
const count = await storage.get('count')

// Queue
const worker = await mf.getWorker()
await worker.queue('my-queue', [{ id: 'msg1', timestamp: new Date(), body: { userId: 123 }, attempts: 1 }])

// Scheduled
await worker.scheduled({ cron: '0 0 * * *' })
```

##Teste de isolamento e simulação

```js
// Per-test isolation
beforeEach(() => {
  mf = new Miniflare({ kvNamespaces: ['TEST'] })
})
afterEach(() => mf.dispose())

// Mock external APIs
new Miniflare({
  workers: [
    { name: 'main', serviceBindings: { API: 'mock-api' }, script: `...` },
    { name: 'mock-api', script: `export default { async fetch() { return Response.json({mock: true}); } }` },
  ],
})
```

##Digite Segurança

```ts
import type { KVNamespace } from '@cloudflare/workers-types'

interface Env {
  KV: KVNamespace
  API_KEY: string
}

const env = await mf.getBindings<Env>()
await env.KV.put('key', 'value') // Typed!

export default {
  async fetch(req: Request, env: Env) {
    return new Response(await env.KV.get('key'))
  },
} satisfies ExportedHandler<Env>
```

##Teste WebSocket

```js
const res = await mf.dispatchFetch('http://localhost/ws', {
  headers: { Upgrade: 'websocket' },
})
assert.strictEqual(res.status, 101)
```

##Migração de instável_dev

```js
// Old (deprecated)
import { unstable_dev } from 'wrangler'
const worker = await unstable_dev('src/index.ts')

// New
import { Miniflare } from 'miniflare'
const mf = new Miniflare({ scriptPath: 'src/index.ts' })
```

##Dicas de CI/CD

````js
// In-memory storage (faster)
new Miniflare({ kvNamespaces: ['TEST'] }) // No persist = in-memory

// Use dispatchFetch (no port conflicts)
await mf.dispatchFetch('http://localhost/')
```Consulte [gotchas.md](./gotchas.md) para solução de problemas.
````
