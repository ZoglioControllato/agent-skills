# APIs de trabalho

## Código do Trabalhador (JS/TS)

### Módulos ES (recomendado)

```javascript
export default {
  async fetch(request, env, ctx) {
    const value = await env.KV.get('key') // Bindings in env
    const response = await env.API.fetch(request) // Service binding
    ctx.waitUntil(logRequest(request)) // Background task
    return new Response('OK')
  },
  async adminApi(request, env, ctx) {
    /* Named entrypoint */
  },
  async queue(batch, env, ctx) {
    /* Queue consumer */
  },
  async scheduled(event, env, ctx) {
    /* Cron handler */
  },
}
```

### Tipos TypeScript

**Gerar a partir de wrangler.toml (recomendado):**

```bash
wrangler types  # Output: worker-configuration.d.ts
```

**Tipos manuais:**

```typescript
interface Env {
  API: Fetcher
  CACHE: KVNamespace
  STORAGE: R2Bucket
  ROOMS: DurableObjectNamespace
  API_KEY: string
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    return new Response(await env.CACHE.get('key'))
  },
}
```

**Configurar:**

```bash
npm install -D @cloudflare/workers-types
```

```json
// tsconfig.json
{ "compilerOptions": { "types": ["@cloudflare/workers-types"] } }
```

### Sintaxe do Service Worker (Legado)

```javascript
addEventListener('fetch', (event) => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const value = await KV.get('key') // Bindings as globals
  return new Response('OK')
}
```

### Objetos Duráveis

```javascript
export class Room {
  constructor(state, env) {
    this.state = state
    this.env = env
  }

  async fetch(request) {
    const url = new URL(request.url)
    if (url.pathname === '/increment') {
      const value = (await this.state.storage.get('counter')) || 0
      await this.state.storage.put('counter', value + 1)
      return new Response(String(value + 1))
    }
    return new Response('Not found', { status: 404 })
  }
}
```

### RPC entre serviços

```javascript
// Caller: env.AUTH.validateToken(token) returns structured data
const user = await env.AUTH.validateToken(request.headers.get('Authorization'))

// Callee: export methods that return data
export default {
  async validateToken(token) {
    return { id: 123, name: 'Alice' }
  },
}
```

##APIs da plataforma web

### Buscar

- `fetch()`, `Solicitação`, `Resposta`, `Cabeçalhos`
- `AbortController`, `AbortSignal`

### Transmissões

- `ReadableStream`, `WritableStream`, `TransformStream`
- Fluxos de bytes, leitores Traga sua própria bebida

### Criptografia da Web

- `crypto.subtle` (criptografar/descriptografar/assinar/verificar)
- `crypto.randomUUID()`, `crypto.getRandomValues()`

### Codificação

- `TextEncoder`, `TextDecoder`
- `atob()`, `btoa()`

### Padrões da Web

- `URL`, `URLSearchParams`
- `Blob`, `Arquivo`, `FormData`
- `WebSocket`

### Eventos enviados pelo servidor (EventSource)

```javascript
// Server-side SSE
const { readable, writable } = new TransformStream()
const writer = writable.getWriter()
writer.write(new TextEncoder().encode('data: Hello\n\n'))
return new Response(readable, { headers: { 'Content-Type': 'text/event-stream' } })
```

### HTMLRewriter (análise/transformação de HTML)

```javascript
const response = await fetch('https://example.com')
return new HTMLRewriter()
  .on('a[href]', {
    element(el) {
      el.setAttribute('href', `/proxy?url=${encodeURIComponent(el.getAttribute('href'))}`)
    },
  })
  .on('script', {
    element(el) {
      el.remove()
    },
  })
  .transform(response)
```

### Soquetes TCP (Experimental)

```javascript
const socket = await connect({ hostname: 'example.com', port: 80 })
const writer = socket.writable.getWriter()
await writer.write(new TextEncoder().encode('GET / HTTP/1.1\r\n\r\n'))
const reader = socket.readable.getReader()
const { value } = await reader.read()
return new Response(value)
```

### Desempenho

- `desempenho.now()`, `desempenho.timeOrigin`
- `setTimeout()`, `setInterval()`, `queueMicrotask()`

### Console

- `console.log()`, `console.error()`, `console.warn()`

### Compatibilidade com Node.js (sinalizador `nodejs_compat`)

```javascript
import { Buffer } from 'node:buffer'
import { randomBytes } from 'node:crypto'

const buf = Buffer.from('Hello')
const random = randomBytes(16)
```

**Disponível:** `node:buffer`, `node:crypto`, `node:stream`, `node:util`, `node:events`, `node:assert`, `node:path`, `node:querystring`, `node:url`
**NÃO disponível:** `node:fs`, `node:http`, `node:net`, `node:child_process`

## Comandos CLI

```bash
workerd serve config.capnp [constantName]          # Start server
workerd serve config.capnp --socket-addr http=*:3000 --verbose
workerd compile config.capnp constantName -o binary  # Compile to binary
workerd test config.capnp [--test-only=test.js]    # Run tests
```

##Integração com Wrangler

Use o Wrangler para desenvolvimento:

````bash
wrangler dev     # Uses workerd internally
wrangler types   # Generate TypeScript types from wrangler.toml
```Consulte [patterns.md](./patterns.md) para exemplos de uso, [configuration.md](./configuration.md) para detalhes de configuração.
````
