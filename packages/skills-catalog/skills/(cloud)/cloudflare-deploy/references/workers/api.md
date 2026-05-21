# APIs de runtime do Workers

## Fetch handler

```typescript
export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url)
    if (request.method === 'POST' && url.pathname === '/api') {
      const body = await request.json()
      return new Response(JSON.stringify({ id: 1 }), {
        headers: { 'Content-Type': 'application/json' },
      })
    }
    return fetch(request) // Subrequest para origem
  },
}
```

## Execution Context

```typescript
ctx.waitUntil(logAnalytics(request)) // Trabalho em segundo plano, não bloqueia a resposta
ctx.passThroughOnException() // Failover para origem em caso de erro
```

**Nunca** use `await` em operações de segundo plano — use `ctx.waitUntil()`.

## Bindings

```typescript
// KV
await env.MY_KV.get('key')
await env.MY_KV.put('key', 'value', { expirationTtl: 3600 })

// R2
const obj = await env.MY_BUCKET.get('file.txt')
await env.MY_BUCKET.put('file.txt', 'content')

// D1
const result = await env.DB.prepare('SELECT * FROM users WHERE id = ?').bind(1).first()

// D1 Sessions (2024+) — consistência read-after-write
const session = env.DB.withSession()
await session.prepare('INSERT INTO users (name) VALUES (?)').bind('Alice').run()
const user = await session.prepare('SELECT * FROM users WHERE name = ?').bind('Alice').first() // Garantido fresco

// Queues
await env.MY_QUEUE.send({ timestamp: Date.now() })

// Secrets/vars
const key = env.API_KEY
```

## Cache API

```typescript
const cache = caches.default
let response = await cache.match(request)

if (!response) {
  response = await fetch(request)
  response = new Response(response.body, response)
  response.headers.set('Cache-Control', 'max-age=3600')
  ctx.waitUntil(cache.put(request, response.clone())) // Clone antes de cachear
}
```

## HTMLRewriter

```typescript
return new HTMLRewriter()
  .on('a[href]', {
    element(el) {
      const href = el.getAttribute('href')
      if (href?.startsWith('http://')) {
        el.setAttribute('href', href.replace('http://', 'https://'))
      }
    },
  })
  .transform(response)
```

**Casos de uso**: testes A/B, injeção de analytics, reescrita de links

## WebSockets

### WebSocket padrão

```typescript
const [client, server] = Object.values(new WebSocketPair())

server.accept()
server.addEventListener('message', (event) => {
  server.send(`Echo: ${event.data}`)
})

return new Response(null, { status: 101, webSocket: client })
```

### WebSocket Hibernation (recomendado para conexões ociosas)

```typescript
// Em Durable Object
export class WebSocketDO {
  async webSocketMessage(ws: WebSocket, message: string) {
    ws.send(`Echo: ${message}`)
  }

  async webSocketClose(ws: WebSocket, code: number, reason: string) {
    // Limpeza ao fechar
  }

  async webSocketError(ws: WebSocket, error: Error) {
    console.error('WebSocket error:', error)
  }
}
```

A hibernação suspende automaticamente conexões inativas (sem custo de CPU) e acorda em eventos

## Durable Objects

### Padrão RPC (recomendado 2024+)

```typescript
export class Counter {
  private value = 0

  constructor(private state: DurableObjectState) {
    state.blockConcurrencyWhile(async () => {
      this.value = (await state.storage.get('value')) || 0
    })
  }

  // Exporte métodos diretamente — chamados via RPC (tipado, zero serialização)
  async increment(): Promise<number> {
    this.value++
    await this.state.storage.put('value', this.value)
    return this.value
  }

  async getValue(): Promise<number> {
    return this.value
  }
}

// Uso no Worker:
const stub = env.COUNTER.get(env.COUNTER.idFromName('global'))
const count = await stub.increment() // Chamada de método direta, tipagem completa
```

### Padrão fetch legado (pré-2024)

```typescript
async fetch(request: Request): Promise<Response> {
  const url = new URL(request.url);
  if (url.pathname === '/increment') {
    await this.state.storage.put('value', ++this.value);
  }
  return new Response(String(this.value));
}
// Uso: await stub.fetch('http://x/increment')
```

**Quando usar DOs**: colaboração em tempo real, rate limiting, estado fortemente consistente

## Outros handlers

```typescript
// Cron: async scheduled(event, env, ctx) { ctx.waitUntil(doCleanup(env)); }
// Queue: async queue(batch) { for (const msg of batch.messages) { await process(msg.body); msg.ack(); } }
// Tail: async tail(events, env) { for (const e of events) if (e.outcome === 'exception') await log(e); }
```

## Service Bindings

```typescript
// RPC Worker-to-worker (latência zero, sem round-trip na internet)
return env.SERVICE_B.fetch(request)

// Com RPC (2024+) — igual ao RPC de Durable Objects
export class ServiceWorker {
  async getData() {
    return { data: 'value' }
  }
}
// Uso: const data = await env.SERVICE_B.getData();
```

**Benefícios**: chamadas de método tipadas, sem overhead HTTP, compartilhamento de código entre Workers

## Ver também

- [Configuration](./configuration.md) — configuração de bindings
- [Patterns](./patterns.md) — fluxos comuns
- [KV](../kv/README.md), [D1](../d1/README.md), [R2](../r2/README.md), [Durable Objects](../durable-objects/README.md), [Queues](../queues/README.md)
