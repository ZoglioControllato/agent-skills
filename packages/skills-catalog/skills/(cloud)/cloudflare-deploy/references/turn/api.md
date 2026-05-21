# Referência da API TURN

Documentação completa da API para credenciais de serviço Cloudflare TURN e gerenciamento de chaves.

## Autenticação

Todos os endpoints requerem token de API Cloudflare com permissão de "gravação de chamadas".

URL base: `https://api.cloudflare.com/client/v4`

## TURN Gerenciamento de Chaves

### Listar teclas TURN

```
GET /accounts/{account_id}/calls/turn_keys
```

### Obtenha detalhes da chave TURN

```
GET /accounts/{account_id}/calls/turn_keys/{key_id}
```

### Criar chave TURN

```
POST /accounts/{account_id}/calls/turn_keys
Content-Type: application/json

{
  "name": "my-turn-key"
}
```

**A resposta inclui**:

- `uid`: identificador da chave
- `key`: A chave secreta real (retornada apenas na criação - salve imediatamente)
- `nome`: nome legível por humanos
- `criado`: carimbo de data/hora ISO 8601
- `modificado`: carimbo de data/hora ISO 8601

### Atualizar chave TURN

```
PUT /accounts/{account_id}/calls/turn_keys/{key_id}
Content-Type: application/json

{
  "name": "updated-name"
}
```

### Excluir chave TURN

```
DELETE /accounts/{account_id}/calls/turn_keys/{key_id}
```

##Gerar credenciais temporárias

```
POST https://rtc.live.cloudflare.com/v1/turn/keys/{key_id}/credentials/generate
Authorization: Bearer {key_secret}
Content-Type: application/json

{
  "ttl": 86400
}
```

### Restrições de credenciais

| Parâmetro | Mínimo | Máx.              | Padrão | Notas                       |
| --------- | ------ | ----------------- | ------ | --------------------------- |
| ttl       | 1      | 172800 (48 horas) | varia  | API rejeita valores >172800 |

**CRÍTICO**: O TTL máximo é de 48 horas (172.800 segundos). A API rejeitará solicitações que excedam esse limite.

### Esquema de Resposta

```json
{
  "iceServers": {
    "urls": [
      "stun:stun.cloudflare.com:3478",
      "turn:turn.cloudflare.com:3478?transport=udp",
      "turn:turn.cloudflare.com:3478?transport=tcp",
      "turn:turn.cloudflare.com:53?transport=udp",
      "turn:turn.cloudflare.com:80?transport=tcp",
      "turns:turn.cloudflare.com:5349?transport=tcp",
      "turns:turn.cloudflare.com:443?transport=tcp"
    ],
    "username": "1738035200:user123",
    "credential": "base64encodedhmac=="
  }
}
```

**Aviso da porta 53**: filtre URLs da porta 53 para clientes de navegador — bloqueados pelo Chrome/Firefox. Consulte [gotchas.md](./gotchas.md#using-port-53-in-browsers).

## Revogar credenciais

```
POST https://rtc.live.cloudflare.com/v1/turn/keys/{key_id}/credentials/revoke
Authorization: Bearer {key_secret}
Content-Type: application/json

{
  "username": "1738035200:user123"
}
```

**Resposta**: 204 Sem conteúdo

O faturamento é interrompido imediatamente. A conexão ativa cai após um pequeno atraso (~segundos).

## Tipos TypeScript

```typescript
interface CloudflareTURNConfig {
  keyId: string
  keySecret: string
  ttl?: number // Max 172800 (48 hours)
}

interface TURNCredentialsRequest {
  ttl?: number // Max 172800 seconds
}

interface TURNCredentialsResponse {
  iceServers: {
    urls: string[]
    username: string
    credential: string
  }
}

interface RTCIceServer {
  urls: string | string[]
  username?: string
  credential?: string
  credentialType?: 'password'
}

interface TURNKeyResponse {
  uid: string
  key: string // Only present on creation
  name: string
  created: string
  modified: string
}
```

##Função de validação

```typescript
function validateRTCIceServer(obj: unknown): obj is RTCIceServer {
  if (!obj || typeof obj !== 'object') {
    return false
  }

  const server = obj as Record<string, unknown>

  if (typeof server.urls !== 'string' && !Array.isArray(server.urls)) {
    return false
  }

  if (server.username && typeof server.username !== 'string') {
    return false
  }

  if (server.credential && typeof server.credential !== 'string') {
    return false
  }

  return true
}
```

##Geração de credenciais com segurança de tipo

```typescript
async function fetchTURNServers(config: CloudflareTURNConfig): Promise<RTCIceServer[]> {
  // Validate TTL constraint
  const ttl = config.ttl ?? 3600
  if (ttl > 172800) {
    throw new Error('TTL cannot exceed 172800 seconds (48 hours)')
  }

  const response = await fetch(`https://rtc.live.cloudflare.com/v1/turn/keys/${config.keyId}/credentials/generate`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${config.keySecret}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ttl }),
  })

  if (!response.ok) {
    throw new Error(`TURN credential generation failed: ${response.status}`)
  }

  const data = await response.json()

  // Filter port 53 for browser clients
  const filteredUrls = data.iceServers.urls.filter((url: string) => !url.includes(':53'))

  const iceServers = [
    { urls: 'stun:stun.cloudflare.com:3478' },
    {
      urls: filteredUrls,
      username: data.iceServers.username,
      credential: data.iceServers.credential,
      credentialType: 'password' as const,
    },
  ]

  // Validate before returning
  if (!iceServers.every(validateRTCIceServer)) {
    throw new Error('Invalid ICE server configuration received')
  }

  return iceServers
}
```

##Veja também

- [configuration.md](./configuration.md) - Configuração do trabalhador, variáveis de ambiente
- [patterns.md](./patterns.md) – Exemplos de implementação usando essas APIs
- [gotchas.md](./gotchas.md) - Melhores práticas de segurança, erros comuns
