# Patterns & Use Cases

## Architecture

```
Client (WebRTC) <---> CF Edge <---> Backend (HTTP)
                           |
                    CF Backbone (310+ DCs)
                           |
                    Other Edges <---> Other Clients
```

Anycast: Last-mile <50ms (95%), no region select, NACK shield, distributed consensus

Cascading trees auto-scale to millions:

```
Publisher -> Edge A -> Edge B -> Sub1
                    \-> Edge C -> Sub2,3
```

## Use Cases

**1:1:** A creates session+publishes, B creates+subscribes to A+publishes, A subscribes to B
**N:N:** All create session+publish, backend broadcasts track IDs, all subscribe to others
**1:N:** Publisher creates+publishes, viewers each create+subscribe (no fan-out limit)
**Breakout:** Same PeerConnection! Backend closes/adds tracks, no recreation

## PartyTracks (Recommended)

Observable-based client with automatic device/network handling:

```typescript
import {PartyTracks} from 'partytracks';

// Create client
const pt = new PartyTracks({
  apiUrl: '/api/calls',
  sessionId: 'my-session',
  onTrack: (track, peer) => {
    const video = document.getElementById(`video-${peer.id}`) as HTMLVideoElement;
    video.srcObject = new MediaStream([track]);
  }
});

// Publish camera (push API)
const camera = await pt.getCamera(); // Auto-requests permissions, handles device changes
await pt.publishTrack(camera, {trackName: 'my-camera'});

// Subscribe to remote track (pull API)
await pt.subscribeToTrack({trackName: 'remote-camera', sessionId: 'other-session'});

// React hook example
import {useObservableAsValue} from 'observable-hooks';

function VideoCall() {
  const localTracks = useObservableAsValue(pt.localTracks$);
  const remoteTracks = useObservableAsValue(pt.remoteTracks$);

  return <div>{/* Render tracks */}</div>;
}

// Screenshare
const screen = await pt.getScreenshare();
await pt.publishTrack(screen, {trackName: 'my-screen'});

// Handle device changes (automatic)
// PartyTracks detects device changes (e.g., Bluetooth headset) and renegotiates
```

## Backend

Express:

```js
app.post('/api/new-session', async (req, res) => {
  const r = await fetch(`${CALLS_API}/apps/${process.env.CALLS_APP_ID}/sessions/new`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.CALLS_APP_SECRET}` },
  })
  res.json(await r.json())
})
```

Trabalhadores: mesmo padrão, use `env.CALLS_APP_ID` e `env.CALLS_APP_SECRET`

DO Presença: Consulte configuration.md para padrão

## Detecção de nível de áudio```typescript

// Attach analyzer to audio track
function attachAudioLevelDetector(track: MediaStreamTrack) {
const ctx = new AudioContext()
const analyzer = ctx.createAnalyser()
const src = ctx.createMediaStreamSource(new MediaStream([track]))
src.connect(analyzer)

const data = new Uint8Array(analyzer.frequencyBinCount)
const checkLevel = () => {
analyzer.getByteFrequencyData(data)
const level = data.reduce((a, b) => a + b) / data.length
if (level > 30) console.log('Speaking:', level) // Trigger UI update
requestAnimationFrame(checkLevel)
}
checkLevel()
}

````

## Connection Quality Monitoring

```typescript
pc.getStats().then((stats) => {
  stats.forEach((report) => {
    if (report.type === 'inbound-rtp' && report.kind === 'video') {
      const { packetsLost, packetsReceived, jitter } = report
      const lossRate = packetsLost / (packetsLost + packetsReceived)
      if (lossRate > 0.05) console.warn('High packet loss:', lossRate)
      if (jitter > 100) console.warn('High jitter:', jitter)
    }
  })
})
````

## Stage Management (Limit Visible Participants)

```typescript
// Subscribe to top 6 active speakers only
let activeSubscriptions = new Set<string>()

function updateStage(topSpeakers: string[]) {
  const toAdd = topSpeakers.filter((id) => !activeSubscriptions.has(id)).slice(0, 6)
  const toRemove = [...activeSubscriptions].filter((id) => !topSpeakers.includes(id))

  toRemove.forEach((id) => {
    pc.getSenders()
      .find((s) => s.track?.id === id)
      ?.track?.stop()
    activeSubscriptions.delete(id)
  })

  toAdd.forEach(async (id) => {
    await fetch(`/api/subscribe`, { method: 'POST', body: JSON.stringify({ trackId: id }) })
    activeSubscriptions.add(id)
  })
}
```

## Advanced

Bandwidth mgmt:

```ts
const s = pc.getSenders().find((s) => s.track?.kind === 'video')
const p = s.getParameters()
if (!p.encodings) p.encodings = [{}]
p.encodings[0].maxBitrate = 1200000
p.encodings[0].maxFramerate = 24
await s.setParameters(p)
```

Simulcast (CF auto-forwards best layer):

```ts
pc.addTransceiver('video', {
  direction: 'sendonly',
  sendEncodings: [
    { rid: 'high', maxBitrate: 1200000 },
    { rid: 'med', maxBitrate: 600000, scaleResolutionDownBy: 2 },
    { rid: 'low', maxBitrate: 200000, scaleResolutionDownBy: 4 },
  ],
})
```

DataChannel:

```ts
const dc = pc.createDataChannel('chat', { ordered: true, maxRetransmits: 3 })
dc.onopen = () => dc.send(JSON.stringify({ type: 'chat', text: 'Hi' }))
dc.onmessage = (e) => console.log('RX:', JSON.parse(e.data))
```

**WHIP/WHEP:** Para interoperabilidade de streaming (OBS → SFU, SFU → reprodutores de vídeo), use os protocolos WHIP (ingestão) e WHEP (saída). Consulte a documentação de integração do Cloudflare Stream.

Integrações: R2 para gravação `env.R2_BUCKET.put(...)`, Filas para análise

Desempenho: conexão de 100 a 250 ms, latência de aproximadamente 50 ms (95%), 200 a 400 ms vidro a vidro, sem limite de participantes (cliente: 10 a 50 faixas)
