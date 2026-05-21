# Configuração

## Configuração do TypeScript

**Gere tipos de wrangler.jsonc** (substitui o obsoleto `@cloudflare/workers-types`):

````bash
npx wrangler types
```Cria `worker-configuration.d.ts` com interface `Env` digitada com base em suas ligações.
```typescript
// functions/api.ts
export const onRequest: PagesFunction<Env> = async (ctx) => {
  // ctx.env.KV, ctx.env.DB, etc. are fully typed
  return Response.json({ ok: true })
}
````

**Tipos manuais** (se não estiver usando tipos de wrangler):

```typescript
interface Env {
  KV: KVNamespace
  DB: D1Database
  API_KEY: string
}
export const onRequest: PagesFunction<Env> = async (ctx) => {
  /* ... */
}
```

##wrangler.jsonc

```jsonc
{
  "$schema": "./node_modules/wrangler/config-schema.json",
  "name": "my-pages-app",
  "pages_build_output_dir": "./dist",
  "compatibility_date": "2025-01-01",
  "compatibility_flags": ["nodejs_compat"],

  "vars": { "API_URL": "https://api.example.com" },
  "kv_namespaces": [{ "binding": "KV", "id": "abc123" }],
  "d1_databases": [{ "binding": "DB", "database_name": "prod-db", "database_id": "xyz789" }],
  "r2_buckets": [{ "binding": "BUCKET", "bucket_name": "my-bucket" }],
  "durable_objects": { "bindings": [{ "name": "COUNTER", "class_name": "Counter", "script_name": "counter-worker" }] },
  "services": [{ "binding": "AUTH", "service": "auth-worker" }],
  "ai": { "binding": "AI" },
  "vectorize": [{ "binding": "VECTORIZE", "index_name": "my-index" }],
  "analytics_engine_datasets": [{ "binding": "ANALYTICS" }],
}
```

##Substituições de ambiente

Nível superior → desenvolvedor local, `env.preview` → visualização, `env.production` → produção

```jsonc
{
  "vars": { "API_URL": "http://localhost:8787" },
  "env": {
    "production": { "vars": { "API_URL": "https://api.example.com" } },
  },
}
```

**Nota:** Se substituir `vars`, `kv_namespaces`, `d1_databases`, etc., ALL deve ser redefinido (não herdável)

## Segredos locais (.dev.vars)

**Somente desenvolvedor local** - NÃO implantado:

````bash
# .dev.vars (add to .gitignore)
SECRET_KEY="my-secret-value"
```Acessado via `ctx.env.SECRET_KEY`. Defina segredos de produção:
```bash
echo "value" | npx wrangler pages secret put SECRET_KEY --project-name=my-app
````

##Arquivos de configuração estática

**\_routes.json** - Roteamento personalizado:

```json
{ "version": 1, "include": ["/api/*"], "exclude": ["/static/*"] }
```

**\_headers** - Cabeçalhos estáticos:

```
/static/*
  Cache-Control: public, max-age=31536000
```

**\_redirects** - Redirecionamentos:

```
/old  /new  301
```

##Desenvolvimento e implantação local

```bash
# Dev server
npx wrangler pages dev ./dist

# With bindings
npx wrangler pages dev ./dist --kv=KV --d1=DB=db-id --r2=BUCKET

# Durable Objects (2 terminals)
cd do-worker && npx wrangler dev
cd pages-project && npx wrangler pages dev ./dist --do COUNTER=Counter@do-worker

# Deploy
npx wrangler pages deploy ./dist
npx wrangler pages deploy ./dist --branch preview

# Download config
npx wrangler pages download config my-project
```

**Veja também:** [api.md](./api.md) para exemplos de uso de vinculação
