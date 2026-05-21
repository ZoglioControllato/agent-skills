# Cloudflare Stream

Plataforma serverless de vídeo ao vivo e sob demanda com uma única API.

## Visão geral

O Cloudflare Stream oferece envio, armazenamento, codificação e entrega de vídeo sem gerenciar infraestrutura. Roda na rede global da Cloudflare.

### Recursos principais

- **Vídeo sob demanda:** enviar, codificar, armazenar, entregar
- **Streaming ao vivo:** ingestão RTMPS/SRT com ABR
- **Uploads diretos do criador:** usuários finais enviam sem chaves de API
- **URLs assinadas:** controle de acesso baseado em token
- **Analytics:** métricas no servidor via GraphQL
- **Webhooks:** notificações de processamento
- **Legendas:** envio ou geração com IA
- **Marcas d’água:** aplicar marca na mídia
- **Downloads:** habilitar MP4 para visualização offline

## Conceitos centrais

### Formas de envio de vídeo

1. **Upload via API (protocolo TUS):** envio direto do servidor
2. **Upload a partir de URL:** importar de fonte externa
3. **Direct Creator Uploads:** conteúdo gerado pelo usuário (recomendado)

### Opções de reprodução

1. **Stream Player (iframe):** player integrado e otimizado
2. **Player customizado (HLS/DASH):** integração com Video.js, HLS.js
3. **Thumbnails:** prévias estáticas ou animadas

### Controle de acesso

- **Público:** sem restrições
- **requireSignedURLs:** acesso por token
- **allowedOrigins:** restrição por domínio
- **Access Rules:** restrições Geo/IP nos tokens

### Streaming ao vivo

- Ingestão RTMPS/SRT a partir do OBS, FFmpeg
- Gravação automática para sob demanda
- Simulcast para YouTube, Twitch etc.
- Suporte WebRTC para streaming pelo navegador

## Início rápido

**Enviar vídeo via API**

```bash
curl -X POST \
  "https://api.cloudflare.com/client/v4/accounts/{account_id}/stream/copy" \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com/video.mp4"}'
```

**Incorporar player**

```html
<iframe
  src="https://customer-<CODE>.cloudflarestream.com/<VIDEO_ID>/iframe"
  style="border: none;"
  height="720"
  width="1280"
  allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
  allowfullscreen="true"
></iframe>
```

**Criar entrada ao vivo**

```bash
curl -X POST \
  "https://api.cloudflare.com/client/v4/accounts/{account_id}/stream/live_inputs" \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"recording": {"mode": "automatic"}}'
```

## Limites

- Tamanho máx. do arquivo: 30 GB
- Taxa de quadros máx.: 60 fps (recomendado)
- Formatos: MP4, MKV, MOV, AVI, FLV, MPEG-2 TS/PS, MXF, LXF, GXF, 3GP, WebM, MPG, QuickTime

## Preços

- US$ 5 / 1000 min armazenados
- US$ 1 / 1000 min entregues

## Recursos

- Painel: https://dash.cloudflare.com/?to=/:account/stream
- API: https://developers.cloudflare.com/api/resources/stream/
- Stream: https://developers.cloudflare.com/stream/

## Ordem de leitura

| Ordem | Arquivo                                | Objetivo                            | Quando usar        |
| ----- | -------------------------------------- | ----------------------------------- | ------------------ |
| 1     | [configuration.md](./configuration.md) | SDKs, variáveis de ambiente, chaves | Início de projeto  |
| 2     | [api.md](./api.md)                     | APIs de vídeo sob demanda           | Uploads/reprodução |
| 3     | [api-live.md](./api-live.md)           | APIs de ao vivo                     | Streaming ao vivo  |
| 4     | [patterns.md](./patterns.md)           | Fluxos full-stack, TUS, JWT         | Workflows          |
| 5     | [gotchas.md](./gotchas.md)             | Erros, limites                      | Depuração          |

## Nesta referência

- [configuration.md](./configuration.md) — setup, variáveis, wrangler
- [api.md](./api.md) — envio, reprodução e gestão sob demanda
- [api-live.md](./api-live.md) — ao vivo (RTMPS/SRT/WebRTC), simulcast
- [patterns.md](./patterns.md) — fluxos, estado, boas práticas
- [gotchas.md](./gotchas.md) — códigos de erro, limites

## Ver também

- [workers](../workers/) — expor APIs Stream em Workers
- [pages](../pages/) — integrar Stream com Pages
- [workers-ai](../workers-ai/) — legendas com IA

Documentação localizada no ecossistema mantido pelo Controllato Club.
