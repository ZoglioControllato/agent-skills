# Configuração e implantação

## Configuração do painel

1. Navegue para https://dash.cloudflare.com/?to=/:account/calls
2. Clique em "Criar aplicativo" (ou use o aplicativo existente)
3. Copie `CALLS_APP_ID` do painel
4. Gere e copie `CALLS_APP_SECRET` (trate como credencial confidencial)
5. Use credenciais na configuração do Wrangler ou nas variáveis de ambiente abaixo

## Dependências

**Back-end (Workers):** API de busca integrada, sem necessidade de pacotes adicionais

**Cliente (PartyTracks):**

```bash
npm install partytracks @cloudflare/calls
```

**Client (React + PartyTracks):**

```bash
npm install partytracks @cloudflare/calls observable-hooks
# Observable hooks: useObservableAsValue, useValueAsObservable
```

**Client (Raw API):** Native browser WebRTC API only

## Wrangler Setup

```jsonc
{
  "name": "my-calls-app",
  "main": "src/index.ts",
  "compatibility_date": "2025-01-01", // Use current date for new projects
  "vars": {
    "CALLS_APP_ID": "your-app-id",
    "MAX_WEBCAM_BITRATE": "1200000",
    "MAX_WEBCAM_FRAMERATE": "24",
    "MAX_WEBCAM_QUALITY_LEVEL": "1080",
  },
  // Set secret: wrangler secret put CALLS_APP_SECRET
  "durable_objects": {
    "bindings": [
      {
        "name": "ROOM",
        "class_name": "Room",
      },
    ],
  },
}
```

## Deploy

```bash
wrangler login
wrangler secret put CALLS_APP_SECRET
wrangler deploy
```

## Environment Variables

**Required:**

- `CALLS_APP_ID`: From dashboard
- `CALLS_APP_SECRET`: From dashboard (secret)

**Optional:**

- `MAX_WEBCAM_BITRATE` (default: 1200000)
- `MAX_WEBCAM_FRAMERATE` (default: 24)
- `MAX_WEBCAM_QUALITY_LEVEL` (default: 1080)
- `TURN_SERVICE_ID`: TURN service
- `TURN_SERVICE_TOKEN`: TURN auth (secret)

## TURN Configuration

```javascript
const pc = new RTCPeerConnection({
  iceServers: [
    { urls: 'stun:stun.cloudflare.com:3478' },
    {
      urls: [
        'turn:turn.cloudflare.com:3478?transport=udp',
        'turn:turn.cloudflare.com:3478?transport=tcp',
        'turns:turn.cloudflare.com:5349?transport=tcp',
      ],
      username: turnUsername,
      credential: turnCredential,
    },
  ],
  bundlePolicy: 'max-bundle', // Recommended: reduces overhead
  iceTransportPolicy: 'all', // Use 'relay' to force TURN (testing only)
})
```

**Portas:** 3478 (UDP/TCP), 53 (UDP), 80 (TCP), 443 (TLS), 5349 (TLS)

**Quando usar TURN:** Obrigatório para firewalls/redes corporativas restritivas que bloqueiam UDP. Cerca de 5 a 10% das conexões retornam para TURN. STUN funciona para a maioria dos usuários.

**Filtragem de candidatos ICE:** a Cloudflare lida com a filtragem de candidatos automaticamente. Não há necessidade de filtrar manualmente os candidatos.

## Padrão de objeto durável

Sistema de presença mínima:```typescript
export class Room {
private sessions = new Map<string, { userId: string; tracks: string[] }>()

async fetch(req: Request) {
const { pathname } = new URL(req.url)
const body = await req.json()

    if (pathname === '/join') {
      this.sessions.set(body.sessionId, { userId: body.userId, tracks: [] })
      return Response.json({ participants: this.sessions.size })
    }

    if (pathname === '/publish') {
      this.sessions.get(body.sessionId)?.tracks.push(...body.tracks)
      // Broadcast to others via WebSocket (not shown)
      return new Response('OK')
    }

    return new Response('Not found', { status: 404 })

}
}

````

## Environment Validation

Check credentials before first API call:

```typescript
if (!env.CALLS_APP_ID || !env.CALLS_APP_SECRET) {
  throw new Error('CALLS_APP_ID and CALLS_APP_SECRET required')
}
````
