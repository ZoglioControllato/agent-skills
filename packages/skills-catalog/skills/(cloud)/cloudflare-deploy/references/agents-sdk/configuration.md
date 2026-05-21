# Configuração

## Setup do Wrangler

```jsonc
{
  "name": "my-agents-app",
  "durable_objects": {
    "bindings": [{ "name": "MyAgent", "class_name": "MyAgent" }],
  },
  "migrations": [{ "tag": "v1", "new_sqlite_classes": ["MyAgent"] }],
  "ai": {
    "binding": "AI",
  },
}
```

## Bindings de ambiente

**Padrão com tipos:**

```typescript
interface Env {
  AI?: Ai // Workers AI
  MyAgent?: DurableObjectNamespace<MyAgent>
  ChatAgent?: DurableObjectNamespace<ChatAgent>
  DB?: D1Database // Banco D1
  KV?: KVNamespace // Armazenamento KV
  R2?: R2Bucket // Bucket R2
  OPENAI_API_KEY?: string // Secrets
  GITHUB_CLIENT_ID?: string // Credenciais OAuth MCP
  GITHUB_CLIENT_SECRET?: string
  QUEUE?: Queue // Filas
}
```

**Boas práticas:** defina todos os bindings de DO em `Env` para type safety.

## Deploy

```bash
# Dev local
npx wrangler dev

# Produção
npx wrangler deploy

# Definir secrets
npx wrangler secret put OPENAI_API_KEY
```

## Roteamento de agentes

**Recomendado: helpers de rota**

```typescript
import { routeAgent } from 'agents'

export default {
  fetch(request: Request, env: Env) {
    return routeAgent(request, env)
  },
}
```

O helper encaminha pedidos aos agentes automaticamente com base nos padrões de URL.

**Roteamento manual (avançado):**

```typescript
export default {
  async fetch(request: Request, env: Env) {
    const url = new URL(request.url)

    // ID nomeado (determinístico)
    const id = env.MyAgent.idFromName('user-123')

    // ID aleatório (do parâmetro na URL)
    // const id = env.MyAgent.idFromString(url.searchParams.get("id"));

    const stub = env.MyAgent.get(id)
    return stub.fetch(request)
  },
}
```

**Vários agentes:**

```typescript
import { routeAgent } from 'agents'

export default {
  fetch(request: Request, env: Env) {
    const url = new URL(request.url)

    // Rotear por caminho
    if (url.pathname.startsWith('/chat')) {
      return routeAgent(request, env, 'ChatAgent')
    }
    if (url.pathname.startsWith('/task')) {
      return routeAgent(request, env, 'TaskAgent')
    }

    return new Response('Not found', { status: 404 })
  },
}
```

## Roteamento de e-mail

**No código:**

```typescript
import { routeAgentEmail } from 'agents'

export default {
  fetch: (req: Request, env: Env) => routeAgent(req, env),
  email: (message: ForwardableEmailMessage, env: Env) => {
    return routeAgentEmail(message, env)
  },
}
```

**No dashboard:**

Configure o roteamento de e-mail no painel da Cloudflare:

```
Destination: Workers with Durable Objects
Worker: my-agents-app
```

Depois trate no agente:

```typescript
export class EmailAgent extends Agent<Env> {
  async onEmail(email: AgentEmail) {
    const text = await email.text()
    // Processar e-mail
  }
}
```

## AI Gateway (opcional)

```typescript
// Habilitar cache/roteamento via AI Gateway
const response = await this.env.AI.run(
  '@cf/meta/llama-3.1-8b-instruct',
  { prompt },
  {
    gateway: {
      id: 'my-gateway-id',
      skipCache: false,
      cacheTtl: 3600,
    },
  },
)
```

## Configuração MCP (opcional)

Para expor ferramentas via Model Context Protocol:

```typescript
// wrangler.jsonc — adicionar secrets OAuth MCP
{
  "vars": {
    "MCP_SERVER_URL": "https://mcp.example.com"
  }
}

// Definir secrets via CLI
// npx wrangler secret put GITHUB_CLIENT_ID
// npx wrangler secret put GITHUB_CLIENT_SECRET
```

Depois registre no código do agente (veja a seção MCP em api.md).
