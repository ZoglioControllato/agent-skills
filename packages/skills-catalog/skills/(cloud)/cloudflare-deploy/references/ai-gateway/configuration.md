# Configuração e setup

## Criar um gateway

### Dashboard

AI > AI Gateway > Create Gateway > Configure (auth, cache, rate limiting, logging)

### API

```bash
curl -X POST https://api.cloudflare.com/client/v4/accounts/{account_id}/ai-gateway/gateways \
  -H "Authorization: Bearer $CF_API_TOKEN" -H "Content-Type: application/json" \
  -d '{"id":"my-gateway","cache_ttl":3600,"rate_limiting_interval":60,"rate_limiting_limit":100,"collect_logs":true}'
```

**Nomeação:** minúsculas, alfanumérico e hífens (ex.: `prod-api`, `dev-chat`)

## Integração com Wrangler

```toml
[ai]
binding = "AI"

[[ai.gateway]]
id = "my-gateway"
```

```bash
wrangler secret put CF_API_TOKEN
wrangler secret put OPENAI_API_KEY  # Se não usar BYOK
```

## Autenticação

### Auth do gateway (protege o acesso ao gateway)

```typescript
const client = new OpenAI({
  baseURL: `https://gateway.ai.cloudflare.com/v1/${accountId}/${gatewayId}/openai`,
  defaultHeaders: { 'cf-aig-authorization': `Bearer ${cfToken}` },
})
```

### Opções de auth do provedor

**1. Unified billing (sem chave)** — paga via Cloudflare, sem chave do provedor:

```typescript
const client = new OpenAI({
  baseURL: `https://gateway.ai.cloudflare.com/v1/${accountId}/${gatewayId}/openai`,
  defaultHeaders: { 'cf-aig-authorization': `Bearer ${cfToken}` },
})
```

Compatível com: OpenAI, Anthropic, Google AI Studio

**2. BYOK** — chaves no dashboard (Provider Keys > Add), nada de chave no código

**3. Headers da requisição** — chave do provedor em cada pedido:

```typescript
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: `https://gateway.ai.cloudflare.com/v1/${accountId}/${gatewayId}/openai`,
  defaultHeaders: { 'cf-aig-authorization': `Bearer ${cfToken}` },
})
```

## Permissões do token de API

- **Gerenciar gateway:** AI Gateway — Read + Edit
- **Acesso ao gateway:** AI Gateway — Read (mínimo)

## API de gerenciamento de gateways

```bash
# Listar
curl https://api.cloudflare.com/client/v4/accounts/{account_id}/ai-gateway/gateways \
  -H "Authorization: Bearer $CF_API_TOKEN"

# Obter
curl .../gateways/{gateway_id}

# Atualizar
curl -X PUT .../gateways/{gateway_id} \
  -d '{"cache_ttl":7200,"rate_limiting_limit":200}'

# Excluir
curl -X DELETE .../gateways/{gateway_id}
```

## Obtendo IDs

- **Account ID:** Dashboard > Overview > Copy
- **Gateway ID:** AI Gateway > coluna do nome do gateway

## Exemplo em Python

```python
from openai import OpenAI
import os

client = OpenAI(
    api_key=os.environ.get("OPENAI_API_KEY"),
    base_url=f"https://gateway.ai.cloudflare.com/v1/{os.environ['CF_ACCOUNT_ID']}/{os.environ['GATEWAY_ID']}/openai",
    default_headers={"cf-aig-authorization": f"Bearer {os.environ['CF_API_TOKEN']}"}
)
```

## Boas práticas

1. **Sempre autentique gateways em produção**
2. **Use BYOK ou billing unificado** — secrets fora do código
3. **Gateways por ambiente** — dev/staging/prod separados
4. **Defina rate limits** — evite custos descontrolados
5. **Habilite logging** — acompanhe uso e depure problemas
