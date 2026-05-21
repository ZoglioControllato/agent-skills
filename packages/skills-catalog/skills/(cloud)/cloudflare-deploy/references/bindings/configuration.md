# Referência de configuração de bindings

## Bindings de storage

```jsonc
{
  "kv_namespaces": [{ "binding": "MY_KV", "id": "..." }],
  "r2_buckets": [{ "binding": "MY_BUCKET", "bucket_name": "my-bucket" }],
  "d1_databases": [{ "binding": "DB", "database_name": "my-db", "database_id": "..." }],
  "durable_objects": { "bindings": [{ "name": "MY_DO", "class_name": "MyDO" }] },
  "vectorize": [{ "binding": "VECTORIZE", "index_name": "my-index" }],
  "queues": { "producers": [{ "binding": "MY_QUEUE", "queue": "my-queue" }] },
}
```

**Comandos de criação:**

```bash
npx wrangler kv namespace create MY_KV
npx wrangler r2 bucket create my-bucket
npx wrangler d1 create my-db
npx wrangler vectorize create my-index --dimensions=768 --metric=cosine
npx wrangler queues create my-queue

# List existing resources
npx wrangler kv namespace list
npx wrangler r2 bucket list
npx wrangler d1 list
npx wrangler vectorize list
npx wrangler queues list
```

## Bindings de compute

```jsonc
{
  "services": [
    {
      "binding": "MY_SERVICE",
      "service": "other-worker",
      "environment": "production", // Optional: target specific env
    },
  ],
  "ai": { "binding": "AI" },
  "browser": { "binding": "BROWSER" },
  "workflows": [{ "binding": "MY_WORKFLOW", "name": "my-workflow" }],
}
```

**Criar workflows:**

```bash
npx wrangler workflows create my-workflow
```

## Bindings de plataforma

```jsonc
{
  "analytics_engine_datasets": [{ "binding": "ANALYTICS" }],
  "mtls_certificates": [{ "binding": "MY_CERT", "certificate_id": "..." }],
  "hyperdrive": [{ "binding": "HYPERDRIVE", "id": "..." }],
  "unsafe": {
    "bindings": [{ "name": "RATE_LIMITER", "type": "ratelimit", "namespace_id": "..." }],
  },
}
```

## Bindings de configuração

```jsonc
{
  "vars": {
    "API_URL": "https://api.example.com",
    "MAX_RETRIES": "3",
  },
  "text_blobs": { "MY_TEXT": "./data/template.html" },
  "data_blobs": { "MY_DATA": "./data/config.bin" },
  "wasm_modules": { "MY_WASM": "./build/module.wasm" },
}
```

**Secrets (nunca no config):**

```bash
npx wrangler secret put API_KEY
```

## Configuração por ambiente

```jsonc
{
  "name": "my-worker",
  "vars": { "ENV": "production" },
  "kv_namespaces": [{ "binding": "CACHE", "id": "prod-kv-id" }],

  "env": {
    "staging": {
      "vars": { "ENV": "staging" },
      "kv_namespaces": [{ "binding": "CACHE", "id": "staging-kv-id" }],
    },
  },
}
```

**Deploy:**

```bash
npx wrangler deploy              # Production
npx wrangler deploy --env staging
```

## Desenvolvimento local

```jsonc
{
  "kv_namespaces": [
    {
      "binding": "MY_KV",
      "id": "prod-id",
      "preview_id": "dev-id", // Used in wrangler dev
    },
  ],
}
```

**Ou remoto:**

```bash
npx wrangler dev --remote  # Uses production bindings
```

## Exemplo completo

```jsonc
{
  "$schema": "./node_modules/wrangler/config-schema.json",
  "name": "my-app",
  "main": "src/index.ts",
  "compatibility_date": "2025-01-01",

  "vars": { "API_URL": "https://api.example.com" },
  "kv_namespaces": [{ "binding": "CACHE", "id": "abc123" }],
  "r2_buckets": [{ "binding": "ASSETS", "bucket_name": "my-assets" }],
  "d1_databases": [{ "binding": "DB", "database_name": "my-db", "database_id": "xyz789" }],
  "services": [{ "binding": "AUTH", "service": "auth-worker" }],
  "ai": { "binding": "AI" },
}
```

## Config específica

### Durable Objects com export de classe

```jsonc
{
  "durable_objects": {
    "bindings": [{ "name": "COUNTER", "class_name": "Counter", "script_name": "my-worker" }],
  },
}
```

```typescript
export class Counter {
  constructor(
    private state: DurableObjectState,
    private env: Env,
  ) {}
  async fetch(request: Request) {
    /* ... */
  }
}
```

### Consumidores de fila

```jsonc
{
  "queues": {
    "producers": [{ "binding": "MY_QUEUE", "queue": "my-queue" }],
    "consumers": [{ "queue": "my-queue", "max_batch_size": 10 }],
  },
}
```

Handler: `export default { async queue(batch, env) { /* process batch.messages */ } }`

## Pontos-chave

- **Limite de 64 bindings** (todos os tipos)
- **Secrets:** sempre `wrangler secret put`, nunca commit
- **Tipos:** `npx wrangler types` após mudanças
- **Ambientes:** campo `env` para staging/produção
- **Dev:** `preview_id` ou flag `--remote`
- **IDs vs nomes:** alguns bindings usam `id` (KV, D1), outros `name` (R2, Queues)

## Ver também

- [Wrangler Configuration](https://developers.cloudflare.com/workers/wrangler/configuration/)
