# Referência da API Stream

APIs de envio, reprodução, streaming ao vivo e gestão.

## APIs de upload

### Direct Creator Upload (recomendado)

**Backend: criar URL de upload (SDK)**

```typescript
import Cloudflare from 'cloudflare'

const client = new Cloudflare({ apiToken: env.CF_API_TOKEN })

const uploadData = await client.stream.directUpload.create({
  account_id: env.CF_ACCOUNT_ID,
  maxDurationSeconds: 3600,
  requireSignedURLs: true,
  meta: { creator: 'user-123' },
})
// Returns: { uploadURL: string, uid: string }
```

**Frontend: enviar arquivo**

```typescript
async function uploadVideo(file: File, uploadURL: string) {
  const formData = new FormData()
  formData.append('file', file)
  return fetch(uploadURL, { method: 'POST', body: formData }).then((r) => r.json())
}
```

### Upload a partir de URL

```typescript
const video = await client.stream.copy.create({
  account_id: env.CF_ACCOUNT_ID,
  url: 'https://example.com/video.mp4',
  meta: { name: 'My Video' },
  requireSignedURLs: false,
})
```

## APIs de reprodução

### Player incorporado (iframe)

```html
<iframe
  src="https://customer-<CODE>.cloudflarestream.com/<VIDEO_ID>/iframe?autoplay=true&muted=true"
  style="border: none;"
  height="720"
  width="1280"
  allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
  allowfullscreen="true"
></iframe>
```

### URLs de manifest HLS/DASH

```typescript
// HLS
const hlsUrl = `https://customer-<CODE>.cloudflarestream.com/${videoId}/manifest/video.m3u8`

// DASH
const dashUrl = `https://customer-<CODE>.cloudflarestream.com/${videoId}/manifest/video.mpd`
```

### Thumbnails

```typescript
// At specific time (seconds)
const thumb = `https://customer-<CODE>.cloudflarestream.com/${videoId}/thumbnails/thumbnail.jpg?time=10s`

// By percentage
const thumbPct = `https://customer-<CODE>.cloudflarestream.com/${videoId}/thumbnails/thumbnail.jpg?time=50%`

// Animated GIF
const gif = `https://customer-<CODE>.cloudflarestream.com/${videoId}/thumbnails/thumbnail.gif`
```

## URLs assinadas

```typescript
// Low volume (<1k/day): Use API
async function getSignedToken(accountId: string, videoId: string, apiToken: string) {
  const response = await fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}/stream/${videoId}/token`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      exp: Math.floor(Date.now() / 1000) + 3600,
      accessRules: [{ type: 'ip.geoip.country', action: 'allow', country: ['US'] }],
    }),
  })
  return (await response.json()).result.token
}

// High volume: Self-sign with RS256 JWT (see "Self-Sign JWT" in patterns.md)
```

## Legendas e clips

### Enviar legendas

```typescript
async function uploadCaption(
  accountId: string,
  videoId: string,
  apiToken: string,
  language: string,
  captionFile: File,
) {
  const formData = new FormData()
  formData.append('file', captionFile)
  return fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}/stream/${videoId}/captions/${language}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${apiToken}` },
    body: formData,
  }).then((r) => r.json())
}
```

### Gerar legendas com IA

```typescript
// TODO: Requires Workers AI integration - see workers-ai reference
async function generateAICaptions(accountId: string, videoId: string, apiToken: string) {
  return fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}/stream/${videoId}/captions/generate`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ language: 'en' }),
  }).then((r) => r.json())
}
```

### Recortar vídeo

```typescript
async function clipVideo(accountId: string, videoId: string, apiToken: string, startTime: number, endTime: number) {
  return fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}/stream/clip`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      clippedFromVideoUID: videoId,
      startTimeSeconds: startTime,
      endTimeSeconds: endTime,
    }),
  }).then((r) => r.json())
}
```

## Gestão de vídeos

```typescript
// List videos
const videos = await client.stream.videos.list({
  account_id: env.CF_ACCOUNT_ID,
  search: 'keyword', // optional
})

// Get video details
const video = await client.stream.videos.get(videoId, {
  account_id: env.CF_ACCOUNT_ID,
})

// Update video
await client.stream.videos.update(videoId, {
  account_id: env.CF_ACCOUNT_ID,
  meta: { title: 'New Title' },
  requireSignedURLs: true,
})

// Delete video
await client.stream.videos.delete(videoId, {
  account_id: env.CF_ACCOUNT_ID,
})
```

## Nesta referência

- [README.md](./README.md) — visão geral e início rápido
- [configuration.md](./configuration.md) — setup
- [api-live.md](./api-live.md) — APIs de streaming ao vivo (RTMPS/SRT/WebRTC)
- [patterns.md](./patterns.md) — fluxos e boas práticas
- [gotchas.md](./gotchas.md) — erros e limites

## Ver também

- [workers](../workers/) — expor APIs Stream em Workers

Documentação localizada no ecossistema mantido pelo Controllato Club.
