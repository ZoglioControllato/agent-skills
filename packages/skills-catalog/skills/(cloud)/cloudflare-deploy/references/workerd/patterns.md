# Workerd Patterns

## Multi-Service Architecture

```capnp
const config :Workerd.Config = (
  services = [
    (name = "frontend", worker = (
      modules = [(name = "index.js", esModule = embed "frontend/index.js")],
      compatibilityDate = "2024-01-15",
      bindings = [(name = "API", service = "api")]
    )),
    (name = "api", worker = (
      modules = [(name = "index.js", esModule = embed "api/index.js")],
      compatibilityDate = "2024-01-15",
      bindings = [(name = "DB", service = "postgres"), (name = "CACHE", kvNamespace = "kv")]
    )),
    (name = "postgres", external = (address = "db.internal:5432", http = ())),
    (name = "kv", disk = (path = "/var/kv", writable = true))
  ],
  sockets = [(name = "http", address = "*:8080", http = (), service = "frontend")]
);
```

## Durable Objects

```capnp
const worker :Workerd.Worker = (
  modules = [(name = "index.js", esModule = embed "index.js"), (name = "room.js", esModule = embed "room.js")],
  compatibilityDate = "2024-01-15",
  bindings = [(name = "ROOMS", durableObjectNamespace = "Room")],
  durableObjectNamespaces = [(className = "Room", uniqueKey = "v1")],
  durableObjectStorage = (localDisk = "/var/do")
);
```

## Dev vs Prod Configs

```capnp
# Use parameter bindings for env-specific config
const baseWorker :Workerd.Worker = (
  modules = [(name = "index.js", esModule = embed "src/index.js")],
  compatibilityDate = "2024-01-15",
  bindings = [(name = "API_URL", parameter = (type = text))]
);

const prodWorker :Workerd.Worker = (
  inherit = "base-service",
  bindings = [(name = "API_URL", text = "https://api.prod.com")]
);
```

## HTTP Reverse Proxy

```capnp
services = [
  (name = "proxy", worker = (serviceWorkerScript = embed "proxy.js", compatibilityDate = "2024-01-15", bindings = [(name = "BACKEND", service = "backend")])),
  (name = "backend", external = (address = "internal:8080", http = ()))
]
```

## Local Development

**Recommended:** Use Wrangler

```bash
wrangler dev  # Uses workerd internally
```

**Direct workerd:**

```bash
workerd serve config.capnp --socket-addr http=*:3000 --verbose
```

**Environment variables:**

```capnp
bindings = [(name = "DATABASE_URL", fromEnvironment = "DATABASE_URL")]
```

## Testing

```bash
workerd test config.capnp
workerd test config.capnp --test-only=test.js
```

Test files must be included in `modules = [...]` config.

## Production Deployment

### Compiled Binary (Recommended)

```bash
workerd compile config.capnp myConfig -o production-server
./production-server
```

### Docker

```dockerfile
FROM debian:bookworm-slim
RUN apt-get update && apt-get install -y ca-certificates
COPY workerd /usr/local/bin/
COPY config.capnp /etc/workerd/
COPY src/ /etc/workerd/src/
EXPOSE 8080
CMD ["workerd", "serve", "/etc/workerd/config.capnp"]
```

### Systemd

```ini
# /etc/systemd/system/workerd.service
[Service]
ExecStart=/usr/bin/workerd serve /etc/workerd/config.capnp --socket-fd http=3
Restart=always
User=nobody
```

See systemd socket activation docs for complete setup.

## Framework Integration

### Hono

```javascript
import { Hono } from 'hono'

const app = new Hono()

app.get('/', (c) => c.text('Hello Hono!'))
app.get('/api/:id', async (c) => {
  const id = c.req.param('id')
  const data = await c.env.KV.get(id)
  return c.json({ id, data })
})

export default app
```

### itty-router

```javascript
import { Router } from 'itty-router'

const router = Router()

router.get('/', () => new Response('Hello itty!'))
router.get('/api/:id', async (request, env) => {
  const { id } = request.params
  const data = await env.KV.get(id)
  return Response.json({ id, data })
})

export default {
  fetch: (request, env, ctx) => router.handle(request, env, ctx),
}
```

## Melhores práticas

1. **Use módulos ES** em vez da sintaxe do service worker
2. **Vinculações explícitas** - sem suposições de namespace global
3. **Tipo de segurança** - defina interfaces `Env` (use `wrangler types`)
4. **Isolamento de serviço** – divida as preocupações em vários serviços
5. **Pin data de compatibilidade** em produção após teste
6. **Use ctx.waitUntil()** para tarefas em segundo plano
7. **Trate de erros normalmente** com try/catch
8. **Configurar limites de recursos** em caches/armazenamento

## Padrões Comuns

### Tratamento de erros```javascript

export default {
async fetch(request, env, ctx) {
try {
return await handleRequest(request, env)
} catch (error) {
console.error('Request failed', error)
return new Response('Internal Error', { status: 500 })
}
},
}

````

### Background Tasks

```javascript
export default {
  async fetch(request, env, ctx) {
    const response = new Response('OK')

    // Fire-and-forget background work
    ctx.waitUntil(env.ANALYTICS.put(request.url, Date.now()))

    return response
  },
}
````

Consulte [configuration.md](./configuration.md) para sintaxe de configuração, [api.md](./api.md) para APIs de tempo de execução, [gotchas.md](./gotchas.md) para erros comuns.
