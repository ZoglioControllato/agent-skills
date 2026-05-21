# API Tunnel

## Acesso à API Cloudflare

**Base URL:** `https://api.cloudflare.com/client/v4`

**Autenticação:**

```bash
Authorization: Bearer ${CF_API_TOKEN}
```

## SDK TypeScript

Instalação: `npm install cloudflare`

```typescript
import Cloudflare from 'cloudflare'

const cf = new Cloudflare({
  apiToken: process.env.CF_API_TOKEN,
})

const accountId = process.env.CF_ACCOUNT_ID
```

## Criar tunnel

### cURL

```bash
curl -X POST "https://api.cloudflare.com/client/v4/accounts/{account_id}/tunnels" \
  -H "Authorization: Bearer ${CF_API_TOKEN}" \
  -H "Content-Type: application/json" \
  --data '{
    "name": "my-tunnel",
    "tunnel_secret": "<base64-secret>"
  }'
```

### TypeScript

```typescript
const tunnel = await cf.zeroTrust.tunnels.create({
  account_id: accountId,
  name: 'my-tunnel',
  tunnel_secret: Buffer.from(crypto.randomBytes(32)).toString('base64'),
})

console.log(`Tunnel ID: ${tunnel.id}`)
```

## Listar tunnels

### cURL

```bash
curl -X GET "https://api.cloudflare.com/client/v4/accounts/{account_id}/tunnels" \
  -H "Authorization: Bearer ${CF_API_TOKEN}"
```

### TypeScript

```typescript
const tunnels = await cf.zeroTrust.tunnels.list({
  account_id: accountId,
})

for (const tunnel of tunnels.result) {
  console.log(`${tunnel.name}: ${tunnel.id}`)
}
```

## Informações do tunnel

### cURL

```bash
curl -X GET "https://api.cloudflare.com/client/v4/accounts/{account_id}/tunnels/{tunnel_id}" \
  -H "Authorization: Bearer ${CF_API_TOKEN}"
```

### TypeScript

```typescript
const tunnel = await cf.zeroTrust.tunnels.get(tunnelId, {
  account_id: accountId,
})

console.log(`Status: ${tunnel.status}`)
console.log(`Connections: ${tunnel.connections?.length || 0}`)
```

## Atualizar config do tunnel

### cURL

```bash
curl -X PUT "https://api.cloudflare.com/client/v4/accounts/{account_id}/tunnels/{tunnel_id}/configurations" \
  -H "Authorization: Bearer ${CF_API_TOKEN}" \
  -H "Content-Type: application/json" \
  --data '{
    "config": {
      "ingress": [
        {"hostname": "app.example.com", "service": "http://localhost:8000"},
        {"service": "http_status:404"}
      ]
    }
  }'
```

### TypeScript

```typescript
const config = await cf.zeroTrust.tunnels.configurations.update(tunnelId, {
  account_id: accountId,
  config: {
    ingress: [{ hostname: 'app.example.com', service: 'http://localhost:8000' }, { service: 'http_status:404' }],
  },
})
```

## Excluir tunnel

### cURL

```bash
curl -X DELETE "https://api.cloudflare.com/client/v4/accounts/{account_id}/tunnels/{tunnel_id}" \
  -H "Authorization: Bearer ${CF_API_TOKEN}"
```

### TypeScript

```typescript
await cf.zeroTrust.tunnels.delete(tunnelId, {
  account_id: accountId,
})
```

## Tunnels baseados em token (fonte: Cloudflare)

Nesse modo a config fica no painel Cloudflare, não em arquivos locais.

### Via painel

1. **Zero Trust** → **Networks** → **Tunnels**
2. **Create a tunnel** → **Cloudflared**
3. Configure rotas no painel
4. Copie o token
5. Na origem:

```bash
cloudflared service install <TOKEN>
```

### Via token

```bash
# Run with token (no config file needed)
cloudflared tunnel --no-autoupdate run --token ${TUNNEL_TOKEN}

# Docker
docker run cloudflare/cloudflared:latest tunnel --no-autoupdate run --token ${TUNNEL_TOKEN}
```

### Obter token do tunnel (TypeScript)

```typescript
// Get tunnel to retrieve token
const tunnel = await cf.zeroTrust.tunnels.get(tunnelId, {
  account_id: accountId,
})

// Token available in tunnel.token (only for config source: cloudflare)
const token = tunnel.token
```

## API de rotas DNS

```bash
# Create DNS route
curl -X POST "https://api.cloudflare.com/client/v4/accounts/{account_id}/tunnels/{tunnel_id}/connections" \
  -H "Authorization: Bearer ${CF_API_TOKEN}" \
  --data '{"hostname": "app.example.com"}'

# Delete route
curl -X DELETE "https://api.cloudflare.com/client/v4/accounts/{account_id}/tunnels/{tunnel_id}/connections/{route_id}" \
  -H "Authorization: Bearer ${CF_API_TOKEN}"
```

## API de rotas de rede privada

```bash
# Add IP route
curl -X POST "https://api.cloudflare.com/client/v4/accounts/{account_id}/tunnels/{tunnel_id}/routes" \
  -H "Authorization: Bearer ${CF_API_TOKEN}" \
  --data '{"ip_network": "10.0.0.0/8"}'

# List IP routes
curl -X GET "https://api.cloudflare.com/client/v4/accounts/{account_id}/tunnels/{tunnel_id}/routes" \
  -H "Authorization: Bearer ${CF_API_TOKEN}"
```

Documentação localizada no ecossistema mantido pelo Controllato Club.
