# API Stream — streaming ao vivo

Criação de entradas ao vivo, status, simulcast e streaming WebRTC.

## Criar entrada ao vivo

### Com o SDK Cloudflare

```typescript
import Cloudflare from 'cloudflare'

const client = new Cloudflare({ apiToken: env.CF_API_TOKEN })

const liveInput = await client.stream.liveInputs.create({
  account_id: env.CF_ACCOUNT_ID,
  recording: { mode: 'automatic', timeoutSeconds: 30 },
  deleteRecordingAfterDays: 30,
})

// Returns: { uid, rtmps, srt, webRTC }
```

### API fetch direta

```typescript
async function createLiveInput(accountId: string, apiToken: string) {
  const response = await fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}/stream/live_inputs`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      recording: { mode: 'automatic', timeoutSeconds: 30 },
      deleteRecordingAfterDays: 30,
    }),
  })
  const { result } = await response.json()
  return {
    uid: result.uid,
    rtmps: { url: result.rtmps.url, streamKey: result.rtmps.streamKey },
    srt: { url: result.srt.url, streamId: result.srt.streamId, passphrase: result.srt.passphrase },
    webRTC: result.webRTC,
  }
}
```

## Consultar status ao vivo

```typescript
async function getLiveStatus(accountId: string, liveInputId: string, apiToken: string) {
  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${accountId}/stream/live_inputs/${liveInputId}`,
    { headers: { Authorization: `Bearer ${apiToken}` } },
  )
  const { result } = await response.json()
  return {
    isLive: result.status?.current?.state === 'connected',
    recording: result.recording,
    status: result.status,
  }
}
```

## Simulcast (saídas ao vivo)

### Criar saída

```typescript
async function createLiveOutput(
  accountId: string,
  liveInputId: string,
  apiToken: string,
  outputUrl: string,
  streamKey: string,
) {
  return fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}/stream/live_inputs/${liveInputId}/outputs`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      url: `${outputUrl}/${streamKey}`,
      enabled: true,
      streamKey, // For platforms like YouTube, Twitch
    }),
  }).then((r) => r.json())
}
```

### Exemplo: simulcast YouTube + Twitch

```typescript
const liveInput = await createLiveInput(accountId, apiToken)

// Add YouTube output
await createLiveOutput(accountId, liveInput.uid, apiToken, 'rtmp://a.rtmp.youtube.com/live2', 'your-youtube-stream-key')

// Add Twitch output
await createLiveOutput(accountId, liveInput.uid, apiToken, 'rtmp://live.twitch.tv/app', 'your-twitch-stream-key')
```

## Streaming WebRTC (WHIP/WHEP)

### Navegador → Stream (WHIP)

```typescript
async function startWebRTCBroadcast(liveInputId: string) {
  const pc = new RTCPeerConnection()

  // Add local media tracks
  const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
  stream.getTracks().forEach((track) => pc.addTrack(track, stream))

  // Create offer
  const offer = await pc.createOffer()
  await pc.setLocalDescription(offer)

  // Send to Stream via WHIP
  const response = await fetch(`https://customer-<CODE>.cloudflarestream.com/${liveInputId}/webRTC/publish`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/sdp' },
    body: offer.sdp,
  })

  const answer = await response.text()
  await pc.setRemoteDescription({ type: 'answer', sdp: answer })
}
```

### Stream → navegador (WHEP)

```typescript
async function playWebRTCStream(videoId: string) {
  const pc = new RTCPeerConnection()

  pc.addTransceiver('video', { direction: 'recvonly' })
  pc.addTransceiver('audio', { direction: 'recvonly' })

  const offer = await pc.createOffer()
  await pc.setLocalDescription(offer)

  const response = await fetch(`https://customer-<CODE>.cloudflarestream.com/${videoId}/webRTC/play`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/sdp' },
    body: offer.sdp,
  })

  const answer = await response.text()
  await pc.setRemoteDescription({ type: 'answer', sdp: answer })

  return pc
}
```

## Configuração de gravação

| Modo             | Comportamento                               |
| ---------------- | ------------------------------------------- |
| `automatic`      | Grava todos os streams ao vivo              |
| `off`            | Sem gravação                                |
| `timeoutSeconds` | Para gravação após N segundos sem atividade |

```typescript
const recordingConfig = {
  mode: 'automatic',
  timeoutSeconds: 30, // Auto-stop 30s after stream ends
  requireSignedURLs: true, // Require token for VOD playback
  allowedOrigins: ['https://yourdomain.com'],
}
```

## Nesta referência

- [README.md](./README.md) — visão geral e início rápido
- [api.md](./api.md) — vídeo sob demanda
- [configuration.md](./configuration.md) — setup
- [patterns.md](./patterns.md) — fluxos e boas práticas
- [gotchas.md](./gotchas.md) — erros e limites

## Ver também

- [workers](../workers/) — expor APIs ao vivo em Workers

Documentação localizada no ecossistema mantido pelo Controllato Club.
