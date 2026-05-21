# Referência de API

## Inicialização do cliente

### TypeScript

```typescript
import Cloudflare from 'cloudflare'

const client = new Cloudflare({
  apiToken: process.env.CLOUDFLARE_API_TOKEN,
})
```

### Python

```python
from cloudflare import Cloudflare

client = Cloudflare(api_token=os.environ.get("CLOUDFLARE_API_TOKEN"))

# For async:
from cloudflare import AsyncCloudflare
client = AsyncCloudflare(api_token=os.environ["CLOUDFLARE_API_TOKEN"])
```

### Go

```go
import (
    "github.com/cloudflare/cloudflare-go/v4"
    "github.com/cloudflare/cloudflare-go/v4/option"
)

client := cloudflare.NewClient(
    option.WithAPIToken(os.Getenv("CLOUDFLARE_API_TOKEN")),
)
```

##Autenticação

### Token de API (recomendado)

**Criar token**: Painel → Meu perfil → Tokens de API → Criar token

```bash
export CLOUDFLARE_API_TOKEN='your-token-here'

curl "https://api.cloudflare.com/client/v4/zones" \
  --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN"
```

**Escopos de token**: sempre use permissões mínimas (específicas da zona, com limite de tempo).

### Chave de API (legada)

```bash
curl "https://api.cloudflare.com/client/v4/zones" \
  --header "X-Auth-Email: user@example.com" \
  --header "X-Auth-Key: $CLOUDFLARE_API_KEY"
```

**Não recomendado:** acesso total à conta, não é possível definir permissões.

## Paginação automática

Todos os SDKs oferecem suporte à paginação automática para operações de lista.

```typescript
// TypeScript: for await...of
for await (const zone of client.zones.list()) {
  console.log(zone.id)
}
```

```python
# Python: iterator protocol
for zone in client.zones.list():
    print(zone.id)
```

```go
// Go: ListAutoPaging
iter := client.Zones.ListAutoPaging(ctx, cloudflare.ZoneListParams{})
for iter.Next() {
    zone := iter.Current()
    fmt.Println(zone.ID)
}
```

##Tratamento de erros

```typescript
try {
  const zone = await client.zones.get({ zone_id: 'xxx' })
} catch (err) {
  if (err instanceof Cloudflare.NotFoundError) {
    // 404
  } else if (err instanceof Cloudflare.RateLimitError) {
    // 429 - SDK auto-retries with backoff
  } else if (err instanceof Cloudflare.APIError) {
    console.log(err.status, err.message)
  }
}
```

**Tipos de erros comuns:**

- `AuthenticationError` (401) - Token inválido
- `PermissionDeniedError` (403) - Escopo insuficiente
- `NotFoundError` (404) - Recurso não encontrado
- `RateLimitError` (429) - Limite de taxa excedido
- `InternalServerError` (≥500) - Erro Cloudflare

## Gerenciamento de zona

```typescript
// List zones
const zones = await client.zones.list({
  account: { id: 'account-id' },
  status: 'active',
})

// Create zone
const zone = await client.zones.create({
  account: { id: 'account-id' },
  name: 'example.com',
  type: 'full', // or 'partial'
})

// Update zone
await client.zones.edit('zone-id', {
  paused: false,
})

// Delete zone
await client.zones.delete('zone-id')
```

```go
// Go: requires cloudflare.F() wrapper
zone, err := client.Zones.New(ctx, cloudflare.ZoneNewParams{
    Account: cloudflare.F(cloudflare.ZoneNewParamsAccount{
        ID: cloudflare.F("account-id"),
    }),
    Name: cloudflare.F("example.com"),
    Type: cloudflare.F(cloudflare.ZoneNewParamsTypeFull),
})
```

##Gerenciamento de DNS

```typescript
// Create DNS record
await client.dns.records.create({
  zone_id: 'zone-id',
  type: 'A',
  name: 'subdomain.example.com',
  content: '192.0.2.1',
  ttl: 1, // auto
  proxied: true, // Orange cloud
})

// List DNS records (with auto-pagination)
for await (const record of client.dns.records.list({
  zone_id: 'zone-id',
  type: 'A',
})) {
  console.log(record.name, record.content)
}

// Update DNS record
await client.dns.records.update({
  zone_id: 'zone-id',
  dns_record_id: 'record-id',
  type: 'A',
  name: 'subdomain.example.com',
  content: '203.0.113.1',
  proxied: true,
})

// Delete DNS record
await client.dns.records.delete({
  zone_id: 'zone-id',
  dns_record_id: 'record-id',
})
```

```python
# Python example
client.dns.records.create(
    zone_id="zone-id",
    type="A",
    name="subdomain.example.com",
    content="192.0.2.1",
    ttl=1,
    proxied=True,
)
```

##Veja também

- [configuration.md](./configuration.md) - Configuração do SDK, variáveis de ambiente
- [patterns.md](./patterns.md) - Padrões e fluxos de trabalho do mundo real
- [gotchas.md](./gotchas.md) - Limites de taxa, solução de problemas
