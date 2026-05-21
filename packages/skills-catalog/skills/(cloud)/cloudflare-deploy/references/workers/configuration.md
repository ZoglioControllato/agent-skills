# Configuração do Workers

## wrangler.jsonc (recomendado)

```jsonc
{
  "$schema": "./node_modules/wrangler/config-schema.json",
  "name": "my-worker",
  "main": "src/index.ts",
  "compatibility_date": "2025-01-01", // Use a data atual em projetos novos

  // Bindings (não herdáveis)
  "vars": { "ENVIRONMENT": "production" },
  "kv_namespaces": [{ "binding": "MY_KV", "id": "abc123" }],
  "r2_buckets": [{ "binding": "MY_BUCKET", "bucket_name": "my-bucket" }],
  "d1_databases": [{ "binding": "DB", "database_name": "my-db", "database_id": "xyz789" }],

  // Ambientes
  "env": {
    "staging": {
      "vars": { "ENVIRONMENT": "staging" },
      "kv_namespaces": [{ "binding": "MY_KV", "id": "staging-id" }],
    },
  },
}
```

## Regras de configuração

**Herdáveis**: `name`, `main`, `compatibility_date`, `routes`, `workers_dev`  
**Não herdáveis**: todos os bindings (`vars`, `kv_namespaces`, `r2_buckets`, etc.)  
**Somente top-level**: `migrations`, `keep_vars`, `send_metrics`

**SEMPRE** defina `compatibility_date` com a data atual em projetos novos

## Bindings

```jsonc
{
  // Variáveis de ambiente — acesse via env.VAR_NAME
  "vars": { "ENVIRONMENT": "production" },

  // KV (armazenamento chave-valor)
  "kv_namespaces": [{ "binding": "MY_KV", "id": "abc123" }],

  // R2 (armazenamento de objetos)
  "r2_buckets": [{ "binding": "MY_BUCKET", "bucket_name": "my-bucket" }],

  // D1 (banco SQL)
  "d1_databases": [{ "binding": "DB", "database_name": "my-db", "database_id": "xyz789" }],

  // Durable Objects (coordenação com estado)
  "durable_objects": {
    "bindings": [{ "name": "COUNTER", "class_name": "Counter" }],
  },

  // Queues (filas de mensagens)
  "queues": {
    "producers": [{ "binding": "MY_QUEUE", "queue": "my-queue" }],
    "consumers": [{ "queue": "my-queue", "max_batch_size": 10 }],
  },

  // Service bindings (RPC entre workers)
  "services": [{ "binding": "SERVICE_B", "service": "service-b" }],

  // Analytics Engine
  "analytics_engine_datasets": [{ "binding": "ANALYTICS" }],
}
```

### Secrets

Defina via CLI (nunca no config):

```bash
npx wrangler secret put API_KEY
```

Acesso: `env.API_KEY`

### Provisionamento automático (beta)

Bindings sem IDs são criados automaticamente:

```jsonc
{ "kv_namespaces": [{ "binding": "MY_KV" }] } // ID adicionado no deploy
```

## Rotas e triggers

```jsonc
{
  "routes": [{ "pattern": "example.com/*", "zone_name": "example.com" }],
  "triggers": {
    "crons": ["0 */6 * * *"], // A cada 6 horas
  },
}
```

## Configuração TypeScript

### Geração automática de tipos (recomendado)

```bash
npm install -D @cloudflare/workers-types
npx wrangler types  # Gera .wrangler/types/runtime.d.ts a partir do wrangler.jsonc
```

`tsconfig.json`:

```jsonc
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022"],
    "types": ["@cloudflare/workers-types"],
  },
  "include": [".wrangler/types/**/*.ts", "src/**/*"],
}
```

Importe os tipos gerados:

```typescript
import type { Env } from './.wrangler/types/runtime'

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    await env.MY_KV.get('key') // Totalmente tipado, autocomplete funciona
    return new Response('OK')
  },
}
```

Execute de novo `npx wrangler types` após alterar bindings no wrangler.jsonc

### Definição manual de tipos (legado)

```typescript
interface Env {
  MY_KV: KVNamespace
  DB: D1Database
  API_KEY: string
}
```

## Opções avançadas

```jsonc
{
  // Localizar compute perto das fontes de dados
  "placement": { "mode": "smart" },

  // Habilitar built-ins do Node.js (Buffer, process, path, etc.)
  "compatibility_flags": ["nodejs_compat_v2"],

  // Observabilidade (amostragem 10%)
  "observability": { "enabled": true, "head_sampling_rate": 0.1 },
}
```

### Compatibilidade com Node.js

`nodejs_compat_v2` habilita:

- `Buffer`, `process.env`, `path`, `stream`
- `require()` CommonJS para módulos Node
- imports `node:` (ex.: `import { Buffer } from 'node:buffer'`)

**Nota:** adiciona ~1–2 ms de overhead no cold start. Use APIs dos Workers (R2, KV) quando possível

## Comandos de deploy

```bash
npx wrangler deploy              # Produção
npx wrangler deploy --env staging
npx wrangler deploy --dry-run    # Só validar
```

## Ver também

- [API](./api.md) — APIs de runtime e uso de bindings
- [Patterns](./patterns.md) — estratégias de deploy
- [Wrangler](../wrangler/README.md) — referência da CLI
