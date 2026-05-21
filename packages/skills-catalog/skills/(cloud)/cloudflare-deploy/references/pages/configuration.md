# Configuração

## wrangler.jsonc

```jsonc
{
  "name": "my-pages-project",
  "pages_build_output_dir": "./dist",
  "compatibility_date": "2026-01-01", // Use current date for new projects
  "compatibility_flags": ["nodejs_compat"],
  "placement": {
    "mode": "smart", // Optional: Enable Smart Placement
  },
  "kv_namespaces": [{ "binding": "KV", "id": "abcd1234..." }],
  "d1_databases": [{ "binding": "DB", "database_id": "xxxx-xxxx", "database_name": "production-db" }],
  "r2_buckets": [{ "binding": "BUCKET", "bucket_name": "my-bucket" }],
  "durable_objects": { "bindings": [{ "name": "COUNTER", "class_name": "Counter", "script_name": "counter-worker" }] },
  "services": [{ "binding": "API", "service": "api-worker" }],
  "queues": { "producers": [{ "binding": "QUEUE", "queue": "my-queue" }] },
  "vectorize": [{ "binding": "VECTORIZE", "index_name": "my-index" }],
  "ai": { "binding": "AI" },
  "analytics_engine_datasets": [{ "binding": "ANALYTICS" }],
  "vars": { "API_URL": "https://api.example.com", "ENVIRONMENT": "production" },
  "env": {
    "preview": {
      "vars": { "API_URL": "https://staging-api.example.com" },
      "kv_namespaces": [{ "binding": "KV", "id": "preview-namespace-id" }],
    },
  },
}
```

## Configuração de build

**Deploy Git**: Dashboard → Project → Settings → Build settings  
Defina comando de build, diretório de saída, variáveis de ambiente. Auto-detecção de framework configura o restante.

## Variáveis de ambiente

### Local (.dev.vars)

```bash
# .dev.vars (never commit)
SECRET_KEY="local-secret-key"
API_TOKEN="dev-token-123"
```

### Produção

```bash
echo "secret-value" | npx wrangler pages secret put SECRET_KEY --project-name=my-project
npx wrangler pages secret list --project-name=my-project
npx wrangler pages secret delete SECRET_KEY --project-name=my-project
```

Acesso: `env.SECRET_KEY`

## Arquivos estáticos de configuração

### \_redirects

Coloque na saída do build (ex.: `dist/_redirects`):

```txt
/old-page /new-page 301          # 301 redirect
/blog/* /news/:splat 301         # Splat wildcard
/users/:id /members/:id 301      # Placeholders
/api/* /api-v2/:splat 200        # Proxy (no redirect)
```

**Limites**: 2.100 total (2.000 estáticos + 100 dinâmicos), 1.000 caracteres/linha  
**Nota**: Functions têm precedência

### \_headers

```txt
/secure/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff

/api/*
  Access-Control-Allow-Origin: *

/static/*
  Cache-Control: public, max-age=31536000, immutable
```

**Limites**: 100 regras, 2.000 caracteres/linha  
**Nota**: só assets estáticos; Functions definem headers no Response

### \_routes.json

Controla quais requisições invocam Functions (gerado automaticamente na maioria dos frameworks):

```json
{
  "version": 1,
  "include": ["/*"],
  "exclude": ["/build/*", "/static/*", "/assets/*", "/*.{ico,png,jpg,css,js}"]
}
```

**Finalidade**: Functions são medidas; requisições estáticas são gratuitas. `exclude` tem precedência. Máx. 100 regras, 100 caracteres/regra.

## TypeScript

```bash
npx wrangler types --path='./functions/types.d.ts'
```

Aponte `types` em `functions/tsconfig.json` para o arquivo gerado.

## Smart Placement

Otimiza automaticamente onde a função executa com base nos padrões de requisição.

```jsonc
{
  "placement": {
    "mode": "smart", // Enable optimization (default: off)
  },
}
```

**Como funciona**: o sistema analisa tráfego por horas/dias e posiciona execução mais perto de:

- Agrupamentos de usuários (ex.: tráfego regional)
- Fontes de dados (ex.: local do primário D1)

**Benefícios**:

- Menor latência para apps leitura-intensiva com banco centralizado
- Melhor desempenho com tráfego regional

**Trade-offs**:

- Período inicial de aprendizado: primeiras requisições podem ser mais lentas
- Tempo de otimização: desempenho melhora em 24–48 horas

**Quando habilitar**: apps globais com D1/Durable Objects em regiões específicas, ou tráfego geograficamente concentrado.

**Quando pular**: tráfego global uniforme sem localidade de dados.

## Bindings remotos (dev local)

Conecte o dev server local aos bindings de produção em vez de mocks:

```bash
# All bindings remote
npx wrangler pages dev ./dist --remote

# Specific bindings remote (others local)
npx wrangler pages dev ./dist --remote --kv=KV --d1=DB
```

**Casos de uso**:

- Testar contra dados de produção (operações somente leitura)
- Depurar comportamento específico de bindings
- Validar mudanças antes do deploy

**Aviso**:

- **Writes afetam dados reais de produção**
- Use só para debug leitura-intensiva ou contas não produtivas
- Prefira ambientes preview separados

**Requisitos**: login (`npx wrangler login`) com acesso aos bindings.

## Dev local

```bash
# Basic
npx wrangler pages dev ./dist

# With bindings
npx wrangler pages dev ./dist --kv KV --d1 DB=local-db-id

# Remote bindings (production data)
npx wrangler pages dev ./dist --remote

# Persistence
npx wrangler pages dev ./dist --persist-to=./.wrangler/state/v3

# Proxy mode (SSR frameworks)
npx wrangler pages dev -- npm run dev
```

## Limites (jan. 2026)

| Recurso                   | Grátis                               | Pago                            |
| ------------------------- | ------------------------------------ | ------------------------------- |
| **Requisições Functions** | 100k/dia                             | Ilimitado (medido)              |
| **CPU da Function**       | 10ms/req                             | 30ms/req (Workers Paid)         |
| **Memória da Function**   | 128MB                                | 128MB                           |
| **Tamanho do script**     | 1MB comprimido                       | 10MB comprimido                 |
| **Deployments**           | 500/mês                              | 5.000/mês                       |
| **Arquivos por deploy**   | 20.000                               | 20.000                          |
| **Tamanho do arquivo**    | 25MB                                 | 25MB                            |
| **Tempo de build**        | 20min                                | 20min                           |
| **Redirects**             | 2.100 (2k estáticos + 100 dinâmicos) | Igual                           |
| **Regras de header**      | 100                                  | 100                             |
| **Regras de rota**        | 100                                  | 100                             |
| **Subrequisições**        | 50/requisição                        | 1.000/requisição (Workers Paid) |

**Notas**:

- Functions usam runtime Workers; Workers Paid aumenta limites
- Plano grátis costuma bastar
- Requisições estáticas são sempre gratuitas

[Limites completos](https://developers.cloudflare.com/pages/platform/limits/)
