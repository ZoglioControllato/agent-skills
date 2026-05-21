# Configuração

## Variáveis de ambiente

### Definir variáveis

| Plataforma     | Comando                                 |
| -------------- | --------------------------------------- |
| Linux/macOS    | `exportar CLOUDFLARE_API_TOKEN='token'` |
| PowerShell     | `$env:CLOUDFLARE_API_TOKEN = 'token'`   |
| CMD do Windows | `definir CLOUDFLARE_API_TOKEN=token`    |

**Segurança:** Nunca confirme tokens. Use arquivos `.env` (gitignored) ou gerenciadores secretos.

### Padrão de arquivo .env

```bash
# .env (add to .gitignore)
CLOUDFLARE_API_TOKEN=your-token-here
CLOUDFLARE_ACCOUNT_ID=your-account-id
```

```typescript
// TypeScript
import 'dotenv/config'

const client = new Cloudflare({
  apiToken: process.env.CLOUDFLARE_API_TOKEN,
})
```

```python
# Python
from dotenv import load_dotenv
load_dotenv()

client = Cloudflare(api_token=os.environ["CLOUDFLARE_API_TOKEN"])
```

##Configuração do SDK

### TypeScript

```typescript
const client = new Cloudflare({
  apiToken: process.env.CLOUDFLARE_API_TOKEN,
  timeout: 120000, // 2 min (default 60s), in milliseconds
  maxRetries: 5, // default 2
  baseURL: 'https://...', // proxy (rare)
})

// Per-request overrides
await client.zones.get({ zone_id: 'zone-id' }, { timeout: 5000, maxRetries: 0 })
```

### Python

```python
client = Cloudflare(
    api_token=os.environ["CLOUDFLARE_API_TOKEN"],
    timeout=120,         # seconds (default 60)
    max_retries=5,       # default 2
    base_url="https://...",  # proxy (rare)
)

# Per-request overrides
client.with_options(timeout=5, max_retries=0).zones.get(zone_id="zone-id")
```

### Go

```go
client := cloudflare.NewClient(
    option.WithAPIToken(os.Getenv("CLOUDFLARE_API_TOKEN")),
    option.WithMaxRetries(5),  // default 10 (higher than TS/Python)
    option.WithRequestTimeout(2 * time.Minute),  // default 60s
    option.WithBaseURL("https://..."),  // proxy (rare)
)

// Per-request overrides
client.Zones.Get(ctx, "zone-id", option.WithMaxRetries(0))
```

##Opções de configuração

| Opção            | TypeScript          | Python            | Go                   | Padrão             |
| ---------------- | ------------------- | ----------------- | -------------------- | ------------------ |
| Tempo limite     | `tempo limite` (ms) | `tempo limite`(s) | `WithRequestTimeout` | anos 60            |
| Novas tentativas | `maxRetries`        | `max_retries`     | `WithMaxRetries`     | 2 (Ir: 10)         |
| URL base         | `baseURL`           | `url_base`        | `ComBaseURL`         | api.cloudflare.com |

**Observação:** Go SDK tem tentativas padrão mais altas (10) do que TypeScript/Python (2).

## Configuração de tempo limite

**Quando aumentar:**

- Grandes transferências de zona
- Operações DNS em massa
- Uploads de script de trabalho

```typescript
const client = new Cloudflare({
  timeout: 300000, // 5 minutes
})
```

##Tentar novamente a configuração

**Quando aumentar:** Fluxos de trabalho com limites de taxa pesados, rede instável

**Quando diminuir:** Requisitos de falha rápida, solicitações voltadas para o usuário

```typescript
// Increase retries for batch operations
const client = new Cloudflare({ maxRetries: 10 })

// Disable retries for fast-fail
const fastClient = new Cloudflare({ maxRetries: 0 })
```

##Integração CLI do Wrangler

```bash
# Configure authentication
wrangler login
# Or
export CLOUDFLARE_API_TOKEN='token'

# Common commands that use API
wrangler deploy              # Uploads worker via API
wrangler kv:key put          # KV operations
wrangler r2 bucket create    # R2 operations
wrangler d1 execute          # D1 operations
wrangler pages deploy        # Pages operations

# Get API configuration
wrangler whoami              # Shows authenticated user
```

### wrangler.toml

```toml
name = "my-worker"
main = "src/index.ts"
compatibility_date = "2024-01-01"
account_id = "your-account-id"

# Can also use env vars:
# CLOUDFLARE_ACCOUNT_ID
# CLOUDFLARE_API_TOKEN
```

##Veja também

- [api.md](./api.md) - Inicialização do cliente, autenticação
- [gotchas.md](./gotchas.md) - Limites de taxa, erros de tempo limite
- [Referência do Wrangler](../wrangler/) - Detalhes da ferramenta CLI
