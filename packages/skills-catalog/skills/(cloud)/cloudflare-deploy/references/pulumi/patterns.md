# Padrões de arquitetura

## Component resources

```typescript
class WorkerApp extends pulumi.ComponentResource {
  constructor(name: string, args: WorkerAppArgs, opts?) {
    super('custom:cloudflare:WorkerApp', name, {}, opts)
    const defaultOpts = { parent: this }

    this.kv = new cloudflare.WorkersKvNamespace(
      `${name}-kv`,
      { accountId: args.accountId, title: `${name}-kv` },
      defaultOpts,
    )
    this.worker = new cloudflare.WorkerScript(
      `${name}-worker`,
      {
        accountId: args.accountId,
        name: `${name}-worker`,
        content: args.workerCode,
        module: true,
        kvNamespaceBindings: [{ name: 'KV', namespaceId: this.kv.id }],
      },
      defaultOpts,
    )
    this.domain = new cloudflare.WorkersDomain(
      `${name}-domain`,
      {
        accountId: args.accountId,
        hostname: args.domain,
        service: this.worker.name,
      },
      defaultOpts,
    )
  }
}
```

## App Worker full-stack

```typescript
const kv = new cloudflare.WorkersKvNamespace('cache', { accountId, title: 'api-cache' })
const db = new cloudflare.D1Database('db', { accountId, name: 'app-database' })
const bucket = new cloudflare.R2Bucket('assets', { accountId, name: 'app-assets' })

const apiWorker = new cloudflare.WorkerScript('api', {
  accountId,
  name: 'api-worker',
  content: fs.readFileSync('./dist/api.js', 'utf8'),
  module: true,
  kvNamespaceBindings: [{ name: 'CACHE', namespaceId: kv.id }],
  d1DatabaseBindings: [{ name: 'DB', databaseId: db.id }],
  r2BucketBindings: [{ name: 'ASSETS', bucketName: bucket.name }],
})
```

## Configuração multiambiente

```typescript
const stack = pulumi.getStack()
const worker = new cloudflare.WorkerScript(`worker-${stack}`, {
  accountId,
  name: `my-worker-${stack}`,
  content: code,
  plainTextBindings: [{ name: 'ENVIRONMENT', text: stack }],
})
```

## Processamento baseado em filas

```typescript
const queue = new cloudflare.Queue('processing-queue', { accountId, name: 'image-processing' })

// Produtor: API recebe requisições
const apiWorker = new cloudflare.WorkerScript('api', {
  accountId,
  name: 'api-worker',
  content: apiCode,
  queueBindings: [{ name: 'PROCESSING_QUEUE', queue: queue.id }],
})

// Consumidor: processamento assíncrono
const processorWorker = new cloudflare.WorkerScript('processor', {
  accountId,
  name: 'processor-worker',
  content: processorCode,
  queueConsumers: [{ queue: queue.name, maxBatchSize: 10, maxRetries: 3, maxWaitTimeMs: 5000 }],
  r2BucketBindings: [{ name: 'OUTPUT_BUCKET', bucketName: outputBucket.name }],
})
```

## Microsserviços com service bindings

```typescript
const authWorker = new cloudflare.WorkerScript('auth', { accountId, name: 'auth-service', content: authCode })
const apiWorker = new cloudflare.WorkerScript('api', {
  accountId,
  name: 'api-service',
  content: apiCode,
  serviceBindings: [{ name: 'AUTH', service: authWorker.name }],
})
```

## Arquitetura orientada a eventos

```typescript
const eventQueue = new cloudflare.Queue('events', { accountId, name: 'event-bus' })
const producer = new cloudflare.WorkerScript('producer', {
  accountId,
  name: 'api-producer',
  content: producerCode,
  queueBindings: [{ name: 'EVENTS', queue: eventQueue.id }],
})
const consumer = new cloudflare.WorkerScript('consumer', {
  accountId,
  name: 'email-consumer',
  content: consumerCode,
  queueConsumers: [{ queue: eventQueue.name, maxBatchSize: 10 }],
})
```

## Deploys versionados v6.x (blue-green/canary)

```typescript
const worker = new cloudflare.Worker('api', { accountId, name: 'api-worker' })
const v1 = new cloudflare.WorkerVersion('v1', {
  accountId,
  workerId: worker.id,
  content: fs.readFileSync('./dist/v1.js', 'utf8'),
  compatibilityDate: '2025-01-01',
})
const v2 = new cloudflare.WorkerVersion('v2', {
  accountId,
  workerId: worker.id,
  content: fs.readFileSync('./dist/v2.js', 'utf8'),
  compatibilityDate: '2025-01-01',
})

// Lançamento gradual: 10% v2, 90% v1
const deployment = new cloudflare.WorkersDeployment('canary', {
  accountId,
  workerId: worker.id,
  versions: [
    { versionId: v2.id, percentage: 10 },
    { versionId: v1.id, percentage: 90 },
  ],
  kvNamespaceBindings: [{ name: 'MY_KV', namespaceId: kv.id }],
})
```

**Uso:** releases canary, A/B, blue-green. A maioria dos apps usa `WorkerScript` (versionamento automático).

## Geração de wrangler.toml (ponte IaC com dev local)

Gere wrangler.toml a partir da config Pulumi para manter o dev local alinhado:

```typescript
import * as command from '@pulumi/command'

const workerConfig = {
  name: 'my-worker',
  compatibilityDate: '2025-01-01',
  compatibilityFlags: ['nodejs_compat'],
}

// Create resources
const kv = new cloudflare.WorkersKvNamespace('kv', { accountId, title: 'my-kv' })
const db = new cloudflare.D1Database('db', { accountId, name: 'my-db' })
const bucket = new cloudflare.R2Bucket('bucket', { accountId, name: 'my-bucket' })

// Gera wrangler.toml após criar recursos
const wranglerGen = new command.local.Command(
  'gen-wrangler',
  {
    create: pulumi.interpolate`cat > wrangler.toml <<EOF
name = "${workerConfig.name}"
main = "src/index.ts"
compatibility_date = "${workerConfig.compatibilityDate}"
compatibility_flags = ${JSON.stringify(workerConfig.compatibilityFlags)}

[[kv_namespaces]]
binding = "MY_KV"
id = "${kv.id}"

[[d1_databases]]
binding = "DB"
database_id = "${db.id}"
database_name = "${db.name}"

[[r2_buckets]]
binding = "MY_BUCKET"
bucket_name = "${bucket.name}"
EOF`,
  },
  { dependsOn: [kv, db, bucket] },
)

// Publica Worker após gerar wrangler.toml
const worker = new cloudflare.WorkerScript(
  'worker',
  {
    accountId,
    name: workerConfig.name,
    content: code,
    compatibilityDate: workerConfig.compatibilityDate,
    compatibilityFlags: workerConfig.compatibilityFlags,
    kvNamespaceBindings: [{ name: 'MY_KV', namespaceId: kv.id }],
    d1DatabaseBindings: [{ name: 'DB', databaseId: db.id }],
    r2BucketBindings: [{ name: 'MY_BUCKET', bucketName: bucket.name }],
  },
  { dependsOn: [wranglerGen] },
)
```

**Benefícios:**

- `wrangler dev` usa os mesmos bindings que produção
- Sem drift de config entre Pulumi e dev local
- Fonte única de verdade (config Pulumi)

**Alternativa:** leia wrangler.toml no Pulumi (direção inversa) se o wrangler for a fonte da verdade

## Padrão build + deploy

```typescript
import * as command from '@pulumi/command'
const build = new command.local.Command('build', { create: 'npm run build', dir: './worker' })
const worker = new cloudflare.WorkerScript(
  'worker',
  {
    accountId,
    name: 'my-worker',
    content: build.stdout.apply(() => fs.readFileSync('./worker/dist/index.js', 'utf8')),
  },
  { dependsOn: [build] },
)
```

## Padrão content SHA (forçar updates)

Evite detecções falsas de "sem mudanças":

```typescript
const version = Date.now().toString()
const worker = new cloudflare.WorkerScript('worker', {
  accountId,
  name: 'my-worker',
  content: code,
  plainTextBindings: [{ name: 'VERSION', text: version }], // força novo deploy
})
```

---

Ver: [README.md](./README.md), [configuration.md](./configuration.md), [api.md](./api.md), [gotchas.md](./gotchas.md)

Documentação localizada no ecossistema mantido pelo Controllato Club.
