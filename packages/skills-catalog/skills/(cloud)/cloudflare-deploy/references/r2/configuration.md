# Configuração R2

## Binding no Workers

**wrangler.jsonc:**

```jsonc
{
  "r2_buckets": [
    {
      "binding": "MY_BUCKET",
      "bucket_name": "my-bucket-name",
    },
  ],
}
```

## Tipos TypeScript

```typescript
interface Env {
  MY_BUCKET: R2Bucket
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const object = await env.MY_BUCKET.get('file.txt')
    return new Response(object?.body)
  },
}
```

## Setup SDK S3

```typescript
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'

const s3 = new S3Client({
  region: 'auto',
  endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: env.R2_ACCESS_KEY_ID,
    secretAccessKey: env.R2_SECRET_ACCESS_KEY,
  },
})

await s3.send(
  new PutObjectCommand({
    Bucket: 'my-bucket',
    Key: 'file.txt',
    Body: data,
    StorageClass: 'STANDARD', // or 'STANDARD_IA'
  }),
)
```

## Dicas de localização

```bash
wrangler r2 bucket create my-bucket --location=enam

# Hints: wnam, enam, weur, eeur, apac, oc
# Jurisdictions (override hint): --jurisdiction=eu (or fedramp)
```

## Configuração CORS

CORS via SDK S3 ou dashboard (não na API Workers):

```typescript
import { S3Client, PutBucketCorsCommand } from '@aws-sdk/client-s3'

const s3 = new S3Client({
  region: 'auto',
  endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: env.R2_ACCESS_KEY_ID,
    secretAccessKey: env.R2_SECRET_ACCESS_KEY,
  },
})

await s3.send(
  new PutBucketCorsCommand({
    Bucket: 'my-bucket',
    CORSConfiguration: {
      CORSRules: [
        {
          AllowedOrigins: ['https://example.com'],
          AllowedMethods: ['GET', 'PUT', 'HEAD'],
          AllowedHeaders: ['*'],
          ExposeHeaders: ['ETag'],
          MaxAgeSeconds: 3600,
        },
      ],
    },
  }),
)
```

## Lifecycles de objeto

```typescript
import { PutBucketLifecycleConfigurationCommand } from '@aws-sdk/client-s3'

await s3.send(
  new PutBucketLifecycleConfigurationCommand({
    Bucket: 'my-bucket',
    LifecycleConfiguration: {
      Rules: [
        {
          ID: 'expire-old-logs',
          Status: 'Enabled',
          Prefix: 'logs/',
          Expiration: { Days: 90 },
        },
        {
          ID: 'transition-to-ia',
          Status: 'Enabled',
          Prefix: 'archives/',
          Transitions: [{ Days: 30, StorageClass: 'STANDARD_IA' }],
        },
      ],
    },
  }),
)
```

## Escopos de API token

Ao criar tokens R2, permissões mínimas:

| Permissão           | Caso de uso                    |
| ------------------- | ------------------------------ |
| Object Read         | Servir público, downloads      |
| Object Write        | Só uploads                     |
| Object Read & Write | Operações completas em objetos |
| Admin Read & Write  | Bucket, CORS, lifecycles       |

**Boa prática:** tokens separados para Workers (read/write) vs tarefas admin (CORS, lifecycles).

## Notificações de evento

```jsonc
// wrangler.jsonc
{
  "r2_buckets": [
    {
      "binding": "MY_BUCKET",
      "bucket_name": "my-bucket",
      "event_notifications": [
        {
          "queue": "r2-events",
          "actions": ["PutObject", "DeleteObject", "CompleteMultipartUpload"],
        },
      ],
    },
  ],
  "queues": {
    "producers": [{ "binding": "R2_EVENTS", "queue": "r2-events" }],
    "consumers": [{ "queue": "r2-events", "max_batch_size": 10 }],
  },
}
```

## Gerenciamento de bucket

```bash
wrangler r2 bucket create my-bucket --location=enam --storage-class=Standard
wrangler r2 bucket list
wrangler r2 bucket info my-bucket
wrangler r2 bucket delete my-bucket  # Precisa estar vazio
wrangler r2 bucket update-storage-class my-bucket --storage-class=InfrequentAccess

# Bucket público via dashboard
wrangler r2 bucket domain add my-bucket --domain=files.example.com
```
