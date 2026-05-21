# Referência da API CNI

Consulte [README.md](README.md) para obter uma visão geral.

## Base

```
https://api.cloudflare.com/client/v4
Auth: Authorization: Bearer <token>
```

##Namespaces do SDK

**Primário (recomendado):**

```typescript
client.networkInterconnects.interconnects.*
client.networkInterconnects.cnis.*
client.networkInterconnects.slots.*
```

**Alternativo (obsoleto):**

````typescript
client.magicTransit.cfInterconnects.*
```Use o namespace `networkInterconnects` para todos os novos códigos.

## Interconexões
```http
GET    /accounts/{account_id}/cni/interconnects              # Query: page, per_page
POST   /accounts/{account_id}/cni/interconnects              # Query: validate_only=true (optional)
GET    /accounts/{account_id}/cni/interconnects/{icon}
GET    /accounts/{account_id}/cni/interconnects/{icon}/status
GET    /accounts/{account_id}/cni/interconnects/{icon}/loa   # Returns PDF
DELETE /accounts/{account_id}/cni/interconnects/{icon}
````

**Criar corpo:** `account`, `slot_id`, `type`, `facility`, `speed`, `name`, `description`  
**Valores de status:** `ativo` | `saudável` | `insalubre` | `pendente` | `para baixo`

**Exemplo de resposta:**

```json
{
  "result": [
    { "id": "icon_abc", "name": "prod", "type": "direct", "facility": "EWR1", "speed": "10G", "status": "active" }
  ]
}
```

##Objetos CNI (configuração BGP)

````http
GET    /accounts/{account_id}/cni/cnis
POST   /accounts/{account_id}/cni/cnis
GET    /accounts/{account_id}/cni/cnis/{cni}
PUT    /accounts/{account_id}/cni/cnis/{cni}
DELETE /accounts/{account_id}/cni/cnis/{cni}
```Corpo: `account`, `cust_ip`, `cf_ip`, `bgp_asn`, `bgp_password`, `vlan`

## caça-níqueis
```http
GET /accounts/{account_id}/cni/slots
GET /accounts/{account_id}/cni/slots/{slot}
```Consulta: `instalação`, `ocupado`, `velocidade`

## Verificações de integridade

Configure por meio de endpoints de túnel Magic Transit/WAN (CNI v2).
```typescript
await client.magicTransit.tunnels.update(accountId, tunnelId, {
  health_check: { enabled: true, target: '192.0.2.1', rate: 'high', type: 'request' },
})
```Taxas: `altas` | `médio` | `baixo`. Tipos: `solicitação` | `responder`. Consulte [documentos do Magic Transit](https://developers.cloudflare.com/magic-transit/how-to/configure-tunnel-endpoints/#add-tunnels).

## Configurações
```http
GET /accounts/{account_id}/cni/settings
PUT /accounts/{account_id}/cni/settings
```Corpo: `default_asn`

## SDK TypeScript
```typescript
import Cloudflare from 'cloudflare'

const client = new Cloudflare({ apiToken: process.env.CF_TOKEN })

// List
await client.networkInterconnects.interconnects.list({ account_id: id })

// Create with validation
await client.networkInterconnects.interconnects.create(
  {
    account_id: id,
    account: id,
    slot_id: 'slot_abc',
    type: 'direct',
    facility: 'EWR1',
    speed: '10G',
    name: 'prod-interconnect',
  },
  {
    query: { validate_only: true }, // Dry-run validation
  },
)

// Create without validation
await client.networkInterconnects.interconnects.create({
  account_id: id,
  account: id,
  slot_id: 'slot_abc',
  type: 'direct',
  facility: 'EWR1',
  speed: '10G',
  name: 'prod-interconnect',
})

// Status
await client.networkInterconnects.interconnects.get(accountId, iconId)

// LOA (use fetch)
const res = await fetch(`https://api.cloudflare.com/client/v4/accounts/${id}/cni/interconnects/${iconId}/loa`, {
  headers: { Authorization: `Bearer ${token}` },
})
await fs.writeFile('loa.pdf', Buffer.from(await res.arrayBuffer()))

// CNI object
await client.networkInterconnects.cnis.create({
  account_id: id,
  account: id,
  cust_ip: '192.0.2.1/31',
  cf_ip: '192.0.2.0/31',
  bgp_asn: 65000,
  vlan: 100,
})

// Slots (filter by facility and speed)
await client.networkInterconnects.slots.list({
  account_id: id,
  occupied: false,
  facility: 'EWR1',
  speed: '10G',
})
````

##Python SDK

```python
from cloudflare import Cloudflare

client = Cloudflare(api_token=os.environ["CF_TOKEN"])

# List, create, status (same pattern as TypeScript)
client.network_interconnects.interconnects.list(account_id=id)
client.network_interconnects.interconnects.create(account_id=id, account=id, slot_id="slot_abc", type="direct", facility="EWR1", speed="10G")
client.network_interconnects.interconnects.get(account_id=id, icon=icon_id)

# CNI objects and slots
client.network_interconnects.cnis.create(account_id=id, cust_ip="192.0.2.1/31", cf_ip="192.0.2.0/31", bgp_asn=65000)
client.network_interconnects.slots.list(account_id=id, occupied=False)
```

## curl

```bash
# List interconnects
curl "https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/cni/interconnects" \
  -H "Authorization: Bearer ${CF_TOKEN}"

# Create interconnect
curl -X POST "https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/cni/interconnects?validate_only=true" \
  -H "Authorization: Bearer ${CF_TOKEN}" -H "Content-Type: application/json" \
  -d '{"account": "id", "slot_id": "slot_abc", "type": "direct", "facility": "EWR1", "speed": "10G"}'

# LOA PDF
curl "https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/cni/interconnects/${ICON_ID}/loa" \
  -H "Authorization: Bearer ${CF_TOKEN}" --output loa.pdf
```

##Não disponível via API

**Capacidades ausentes:**

- Consulta de estado da sessão BGP (use logs do Dashboard ou BGP)
- Métricas de utilização de largura de banda (use monitoramento externo)
- Estatísticas de tráfego por interconexão
- Dados históricos de tempo de atividade/inatividade
- Leituras de nível leve (entre em contato com a equipe de conta)
- Agendamento da janela de manutenção (apenas notificações)

## Recursos

- [Documentos da API](https://developers.cloudflare.com/api/resources/network_interconnects/)
- [SDK TypeScript](https://github.com/cloudflare/cloudflare-typescript)
- [SDK Python](https://github.com/cloudflare/cloudflare-python)
