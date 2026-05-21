# Configuração do Wrangler

Referência de configuração para wrangler.jsonc (recomendado).

## Formato do config

**wrangler.jsonc recomendado** (v3.91.0+) — oferece validação por schema.

```jsonc
{
  "$schema": "./node_modules/wrangler/config-schema.json",
  "name": "my-worker",
  "main": "src/index.ts",
  "compatibility_date": "2025-01-01", // Use current date
  "vars": { "API_KEY": "dev-key" },
  "kv_namespaces": [{ "binding": "MY_KV", "id": "abc123" }],
}
```

## Herança de campos

Hereditários: `name`, `main`, `compatibility_date`, `routes`, `triggers`
Não hereditários (definir por ambiente): `vars`, bindings (KV, D1, R2, etc.)

## Ambientes

```jsonc
{
  "name": "my-worker",
  "vars": { "ENV": "dev" },
  "env": {
    "production": {
      "name": "my-worker-prod",
      "vars": { "ENV": "prod" },
      "route": { "pattern": "example.com/*", "zone_name": "example.com" },
    },
  },
}
```

Deploy: `wrangler deploy --env production`

## Roteamento

```jsonc
// Custom domain (recommended)
{ "routes": [{ "pattern": "api.example.com", "custom_domain": true }] }

// Zone-based
{ "routes": [{ "pattern": "api.example.com/*", "zone_name": "example.com" }] }

// workers.dev
{ "workers_dev": true }
```

## Bindings

```jsonc
// Variables
{ "vars": { "API_URL": "https://api.example.com" } }

// KV
{ "kv_namespaces": [{ "binding": "CACHE", "id": "abc123" }] }

// D1
{ "d1_databases": [{ "binding": "DB", "database_id": "abc-123" }] }

// R2
{ "r2_buckets": [{ "binding": "ASSETS", "bucket_name": "my-assets" }] }

// Durable Objects
{ "durable_objects": {
  "bindings": [{
    "name": "COUNTER",
    "class_name": "Counter",
    "script_name": "my-worker"  // Required for external DOs
  }]
} }
{ "migrations": [{ "tag": "v1", "new_sqlite_classes": ["Counter"] }] }

// Service Bindings
{ "services": [{ "binding": "AUTH", "service": "auth-worker" }] }

// Queues
{ "queues": {
  "producers": [{ "binding": "TASKS", "queue": "task-queue" }],
  "consumers": [{ "queue": "task-queue", "max_batch_size": 10 }]
} }

// Vectorize
{ "vectorize": [{ "binding": "VECTORS", "index_name": "embeddings" }] }

// Hyperdrive (requires nodejs_compat_v2 for pg/postgres)
{ "hyperdrive": [{ "binding": "HYPERDRIVE", "id": "hyper-id" }] }
{ "compatibility_flags": ["nodejs_compat_v2"] }  // For pg/postgres

// Workers AI
{ "ai": { "binding": "AI" } }

// Workflows
{ "workflows": [{ "binding": "WORKFLOW", "name": "my-workflow", "class_name": "MyWorkflow" }] }

// Secrets Store (centralized secrets)
{ "secrets_store": [{ "binding": "SECRETS", "id": "store-id" }] }

// Constellation (AI inference)
{ "constellation": [{ "binding": "MODEL", "project_id": "proj-id" }] }
```

## Workers Assets (arquivos estáticos)

Recomendado para servir arquivos estáticos (substitui o antigo config `site`).

```jsonc
{
  "assets": {
    "directory": "./public",
    "binding": "ASSETS",
    "html_handling": "auto-trailing-slash", // or "none", "force-trailing-slash"
    "not_found_handling": "single-page-application", // or "404-page", "none"
  },
}
```

Acesso no Worker:

```typescript
export default {
  async fetch(request, env) {
    // Try serving static asset first
    const asset = await env.ASSETS.fetch(request)
    if (asset.status !== 404) return asset

    // Custom logic for non-assets
    return new Response('API response')
  },
}
```

## Placement

Controle onde os Workers rodam geograficamente.

```jsonc
{
  "placement": {
    "mode": "smart", // or "off"
  },
}
```

- `"smart"`: executa o Worker perto das fontes de dados (D1, Durable Objects) para reduzir latência
- `"off"`: distribuição padrão (execução em todo lugar)

## Provisionamento automático (beta)

Omita IDs de recurso — o Wrangler cria e grava de volta no config no deploy.

```jsonc
{ "kv_namespaces": [{ "binding": "MY_KV" }] } // No id - auto-provisioned
```

Após o deploy, o ID é adicionado ao config automaticamente.

## Avançado

```jsonc
// Cron Triggers
{ "triggers": { "crons": ["0 0 * * *"] } }

// Observability (tracing)
{ "observability": { "enabled": true, "head_sampling_rate": 0.1 } }

// Runtime Limits
{ "limits": { "cpu_ms": 100 } }

// Browser Rendering
{ "browser": { "binding": "BROWSER" } }

// mTLS Certificates
{ "mtls_certificates": [{ "binding": "CERT", "certificate_id": "cert-uuid" }] }

// Logpush (stream logs to R2/S3)
{ "logpush": true }

// Tail Consumers (process logs with another Worker)
{ "tail_consumers": [{ "service": "log-worker" }] }

// Unsafe bindings (access to arbitrary bindings)
{ "unsafe": { "bindings": [{ "name": "MY_BINDING", "type": "plain_text", "text": "value" }] } }
```

## Ver também

- [README.md](./README.md) — Visão geral e comandos
- [api.md](./api.md) — API programática
- [patterns.md](./patterns.md) — Fluxos de trabalho
- [gotchas.md](./gotchas.md) — Problemas comuns

Documentação localizada no ecossistema mantido pelo Controllato Club.
