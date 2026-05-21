# Configuração

## Integração com Wrangler

### Binding do Workers

Adicione ao `wrangler.toml`:

```toml
name = "my-image-worker"
main = "src/index.ts"
compatibility_date = "2024-01-01"

[images]
binding = "IMAGES"
```

Uso no Worker:

```typescript
interface Env {
  IMAGES: ImageBinding
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    return await env.IMAGES.input(imageBuffer).transform({ width: 800 }).output().response()
  },
}
```

### Envio via script

O Wrangler não tem comandos de imagens integrados; use a API REST:

```typescript
// scripts/upload-image.ts
import fs from 'fs'
import FormData from 'form-data'

async function uploadImage(filePath: string) {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID!
  const apiToken = process.env.CLOUDFLARE_API_TOKEN!

  const formData = new FormData()
  formData.append('file', fs.createReadStream(filePath))

  const response = await fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}/images/v1`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiToken}`,
    },
    body: formData,
  })

  const result = await response.json()
  console.log('Uploaded:', result)
}

uploadImage('./photo.jpg')
```

### Variáveis de ambiente

Armazene o hash da conta para montar URLs:

```toml
[vars]
IMAGES_ACCOUNT_HASH = "your-account-hash"
ACCOUNT_ID = "your-account-id"
```

No Worker:

```typescript
const imageUrl = `https://imagedelivery.net/${env.IMAGES_ACCOUNT_HASH}/${imageId}/public`
```

## Configuração de variantes

Variantes são predefinições nomeadas de transformações.

### Criar variante (painel)

1. Acesse Images → Variants
2. Clique em “Create variant”
3. Defina o nome (ex.: `thumbnail`)
4. Configure: `width=200,height=200,fit=cover`

### Criar variante (API)

```bash
curl -X POST \
  https://api.cloudflare.com/client/v4/accounts/{account_id}/images/v1/variants \
  -H "Authorization: Bearer {api_token}" \
  -H "Content-Type: application/json" \
  -d '{
    "id": "thumbnail",
    "options": {
      "width": 200,
      "height": 200,
      "fit": "cover"
    },
    "neverRequireSignedURLs": true
  }'
```

### Usar variante

```
https://imagedelivery.net/{account_hash}/{image_id}/thumbnail
```

### Predefinições comuns de variantes

```json
{
  "thumbnail": {
    "width": 200,
    "height": 200,
    "fit": "cover"
  },
  "avatar": {
    "width": 128,
    "height": 128,
    "fit": "cover",
    "gravity": "face"
  },
  "hero": {
    "width": 1920,
    "height": 1080,
    "fit": "cover",
    "quality": 90
  },
  "mobile": {
    "width": 640,
    "fit": "scale-down",
    "quality": 80,
    "format": "avif"
  }
}
```

## Autenticação

### Token de API (recomendado)

Crie em: Painel → My Profile → API Tokens

Permissões necessárias:

- Account → Cloudflare Images → Edit

```bash
curl -H "Authorization: Bearer {api_token}" \
  https://api.cloudflare.com/client/v4/accounts/{account_id}/images/v1
```

### Chave de API (legado)

```bash
curl -H "X-Auth-Email: {email}" \
     -H "X-Auth-Key: {api_key}" \
  https://api.cloudflare.com/client/v4/accounts/{account_id}/images/v1
```

## URLs assinados

Para imagens privadas, habilite URLs assinados:

```bash
# Upload with signed URLs required
curl -X POST \
  https://api.cloudflare.com/client/v4/accounts/{account_id}/images/v1 \
  -H "Authorization: Bearer {api_token}" \
  -F file=@private.jpg \
  -F requireSignedURLs=true
```

Gere URL assinada:

```typescript
import { createHmac } from 'crypto'

function signUrl(imageId: string, variant: string, expiry: number, key: string): string {
  const path = `/${imageId}/${variant}`
  const toSign = `${path}${expiry}`
  const signature = createHmac('sha256', key).update(toSign).digest('hex')

  return `https://imagedelivery.net/{hash}${path}?exp=${expiry}&sig=${signature}`
}

// Sign URL valid for 1 hour
const signedUrl = signUrl('image-id', 'public', Date.now() + 3600, env.SIGNING_KEY)
```

## Desenvolvimento local

```bash
npx wrangler dev --remote
```

É necessário `--remote` para o binding de imagens.

Documentação localizada no ecossistema mantido pelo Controllato Club.
