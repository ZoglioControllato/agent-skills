# Configuração

Veja [README.md](./README.md) para visão geral.

## Criar config

**PostgreSQL:**

```bash
# Basic
npx wrangler hyperdrive create my-db \
  --connection-string="postgres://user:pass@host:5432/db"

# Custom cache
npx wrangler hyperdrive create my-db \
  --connection-string="postgres://..." \
  --max-age=120 --swr=30

# No cache
npx wrangler hyperdrive create my-db \
  --connection-string="postgres://..." \
  --caching-disabled=true
```

**MySQL:**

```bash
npx wrangler hyperdrive create my-db \
  --connection-string="mysql://user:pass@host:3306/db"
```

## wrangler.jsonc

```jsonc
{
  "compatibility_date": "2025-01-01", // Use latest for new projects
  "compatibility_flags": ["nodejs_compat"],
  "hyperdrive": [
    {
      "binding": "HYPERDRIVE",
      "id": "<HYPERDRIVE_ID>",
      "localConnectionString": "postgres://user:pass@localhost:5432/dev",
    },
  ],
}
```

**Gerar tipos TypeScript:** execute `npx wrangler types` para gerar automaticamente `worker-configuration.d.ts` a partir do `wrangler.jsonc`.

**Várias configs:**

```jsonc
{
  "hyperdrive": [
    { "binding": "HYPERDRIVE_CACHED", "id": "<ID1>" },
    { "binding": "HYPERDRIVE_NO_CACHE", "id": "<ID2>" },
  ],
}
```

## Gerenciamento

```bash
npx wrangler hyperdrive list
npx wrangler hyperdrive get <ID>
npx wrangler hyperdrive update <ID> --max-age=180
npx wrangler hyperdrive delete <ID>
```

## Opções de config

Flags da CLI ao criar/atualizar Hyperdrive:

| Opção                       | Padrão    | Notas                     |
| --------------------------- | --------- | ------------------------- |
| `--caching-disabled`        | `false`   | Desativa cache            |
| `--max-age`                 | `60`      | TTL do cache (máx. 3600s) |
| `--swr`                     | `15`      | Stale-while-revalidate    |
| `--origin-connection-limit` | 20/100    | Free/pago                 |
| `--access-client-id`        | -         | Autenticação do Tunnel    |
| `--access-client-secret`    | -         | Autenticação do Tunnel    |
| `--sslmode`                 | `require` | Só PostgreSQL             |

## Integração com Smart Placement

Para Workers que fazem **várias consultas** por requisição, habilite Smart Placement para executar perto do banco:

```jsonc
{
  "compatibility_date": "2025-01-01",
  "compatibility_flags": ["nodejs_compat"],
  "placement": {
    "mode": "smart",
  },
  "hyperdrive": [
    {
      "binding": "HYPERDRIVE",
      "id": "<HYPERDRIVE_ID>",
    },
  ],
}
```

**Benefícios:** Workers com várias consultas rodam mais perto do DB, reduzindo latência de ida e volta. Veja exemplos em [patterns.md](./patterns.md).

## Banco privado via Tunnel

```
Worker → Hyperdrive → Access → Tunnel → Private Network → DB
```

**Configuração:**

```bash
# 1. Create tunnel
cloudflared tunnel create my-db-tunnel

# 2. Configure hostname in Zero Trust dashboard
#    Domain: db-tunnel.example.com
#    Service: TCP -> localhost:5432

# 3. Create service token (Zero Trust > Service Auth)
#    Save Client ID/Secret

# 4. Create Access app (db-tunnel.example.com)
#    Policy: Service Auth token from step 3

# 5. Create Hyperdrive
npx wrangler hyperdrive create my-private-db \
  --host=db-tunnel.example.com \
  --user=dbuser --password=dbpass --database=prod \
  --access-client-id=<ID> --access-client-secret=<SECRET>
```

**⚠️ Não use `--port` com Tunnel** — a porta fica nas configurações do serviço do tunnel.

## Desenvolvimento local

**Opção 1: Local (RECOMENDADO):**

```bash
# Env var (takes precedence)
export CLOUDFLARE_HYPERDRIVE_LOCAL_CONNECTION_STRING_HYPERDRIVE="postgres://user:pass@localhost:5432/dev"
npx wrangler dev

# wrangler.jsonc
{"hyperdrive": [{"binding": "HYPERDRIVE", "localConnectionString": "postgres://..."}]}
```

**Banco remoto localmente:**

```bash
# PostgreSQL
export CLOUDFLARE_HYPERDRIVE_LOCAL_CONNECTION_STRING_HYPERDRIVE="postgres://user:pass@remote:5432/db?sslmode=require"

# MySQL
export CLOUDFLARE_HYPERDRIVE_LOCAL_CONNECTION_STRING_HYPERDRIVE="mysql://user:pass@remote:3306/db?sslMode=REQUIRED"
```

**Opção 2: Execução remota:**

```bash
npx wrangler dev --remote  # Uses deployed config, affects production
```

Veja [api.md](./api.md), [patterns.md](./patterns.md) e [gotchas.md](./gotchas.md).

Documentação localizada no ecossistema mantido pelo Controllato Club.
