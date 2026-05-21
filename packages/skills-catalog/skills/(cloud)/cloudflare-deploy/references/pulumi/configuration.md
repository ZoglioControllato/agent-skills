# Configuração de recursos

## Workers (cloudflare.WorkerScript)

```typescript
import * as cloudflare from '@pulumi/cloudflare'
import * as fs from 'fs'

const worker = new cloudflare.WorkerScript('my-worker', {
  accountId: accountId,
  name: 'my-worker',
  content: fs.readFileSync('./dist/worker.js', 'utf8'),
  module: true, // ES modules
  compatibilityDate: '2025-01-01',
  compatibilityFlags: ['nodejs_compat'],

  // v6.x: Observability
  logpush: true, // Enable Workers Logpush
  tailConsumers: [{ service: 'log-consumer' }], // Stream logs to Worker

  // v6.x: Placement
  placement: { mode: 'smart' }, // Smart placement for latency optimization

  // Bindings
  kvNamespaceBindings: [{ name: 'MY_KV', namespaceId: kv.id }],
  r2BucketBindings: [{ name: 'MY_BUCKET', bucketName: bucket.name }],
  d1DatabaseBindings: [{ name: 'DB', databaseId: db.id }],
  queueBindings: [{ name: 'MY_QUEUE', queue: queue.id }],
  serviceBindings: [{ name: 'OTHER_SERVICE', service: other.name }],
  plainTextBindings: [{ name: 'ENV_VAR', text: 'value' }],
  secretTextBindings: [{ name: 'API_KEY', text: secret }],

  // v6.x: Advanced bindings
  analyticsEngineBindings: [{ name: 'ANALYTICS', dataset: 'my-dataset' }],
  browserBinding: { name: 'BROWSER' }, // Browser Rendering
  aiBinding: { name: 'AI' }, // Workers AI
  hyperdriveBindings: [{ name: 'HYPERDRIVE', id: hyperdriveConfig.id }],
})
```

## Workers KV (cloudflare.WorkersKvNamespace)

```typescript
const kv = new cloudflare.WorkersKvNamespace('my-kv', {
  accountId: accountId,
  title: 'my-kv-namespace',
})

// Escrever valores
const kvValue = new cloudflare.WorkersKvValue('config', {
  accountId: accountId,
  namespaceId: kv.id,
  key: 'config',
  value: JSON.stringify({ foo: 'bar' }),
})
```

## Buckets R2 (cloudflare.R2Bucket)

```typescript
const bucket = new cloudflare.R2Bucket('my-bucket', {
  accountId: accountId,
  name: 'my-bucket',
  location: 'auto', // or "wnam", etc.
})
```

## Bancos D1 (cloudflare.D1Database)

```typescript
const db = new cloudflare.D1Database('my-db', { accountId, name: 'my-database' })

// Migrações via wrangler
import * as command from '@pulumi/command'
const migration = new command.local.Command(
  'd1-migration',
  {
    create: pulumi.interpolate`wrangler d1 execute ${db.name} --file ./schema.sql`,
  },
  { dependsOn: [db] },
)
```

## Filas (cloudflare.Queue)

```typescript
const queue = new cloudflare.Queue('my-queue', { accountId, name: 'my-queue' })

// Produtor
const producer = new cloudflare.WorkerScript('producer', {
  accountId,
  name: 'producer',
  content: code,
  queueBindings: [{ name: 'MY_QUEUE', queue: queue.id }],
})

// Consumidor
const consumer = new cloudflare.WorkerScript('consumer', {
  accountId,
  name: 'consumer',
  content: code,
  queueConsumers: [{ queue: queue.name, maxBatchSize: 10, maxRetries: 3 }],
})
```

## Projetos Pages (cloudflare.PagesProject)

```typescript
const pages = new cloudflare.PagesProject('my-site', {
  accountId,
  name: 'my-site',
  productionBranch: 'main',
  buildConfig: { buildCommand: 'npm run build', destinationDir: 'dist' },
  source: {
    type: 'github',
    config: { owner: 'my-org', repoName: 'my-repo', productionBranch: 'main' },
  },
  deploymentConfigs: {
    production: {
      environmentVariables: { NODE_VERSION: '18' },
      kvNamespaces: { MY_KV: kv.id },
      d1Databases: { DB: db.id },
    },
  },
})
```

## Registros DNS (cloudflare.DnsRecord)

```typescript
const zone = cloudflare.getZone({ name: 'example.com' })
const record = new cloudflare.DnsRecord('www', {
  zoneId: zone.then((z) => z.id),
  name: 'www',
  type: 'A',
  content: '192.0.2.1',
  ttl: 3600,
  proxied: true,
})
```

## Domínios e rotas de Workers

```typescript
// Rota (baseada em padrão)
const route = new cloudflare.WorkerRoute('my-route', {
  zoneId: zoneId,
  pattern: 'example.com/api/*',
  scriptName: worker.name,
})

// Domínio (subdomínio dedicado)
const domain = new cloudflare.WorkersDomain('my-domain', {
  accountId: accountId,
  hostname: 'api.example.com',
  service: worker.name,
  zoneId: zoneId,
})
```

## Configuração de assets (v6.x)

Servir arquivos estáticos a partir de Workers:

```typescript
const worker = new cloudflare.WorkerScript('app', {
  accountId: accountId,
  name: 'my-app',
  content: code,
  assets: {
    path: './public', // diretório local
    // assets enviados e servidos pelos Workers
  },
})
```

## Deploys versionados v6.x (avançado)

Para lançamentos graduais, use o padrão de 3 recursos:

```typescript
// 1. Worker (contêiner de versões)
const worker = new cloudflare.Worker('api', {
  accountId: accountId,
  name: 'api-worker',
})

// 2. Version (código + config imutáveis)
const version = new cloudflare.WorkerVersion('v1', {
  accountId: accountId,
  workerId: worker.id,
  content: fs.readFileSync('./dist/worker.js', 'utf8'),
  compatibilityDate: '2025-01-01',
  compatibilityFlags: ['nodejs_compat'],
  // Obs.: bindings no nível do deployment
})

// 3. Deployment (versão + bindings + divisão de tráfego)
const deployment = new cloudflare.WorkersDeployment('prod', {
  accountId: accountId,
  workerId: worker.id,
  versionId: version.id,
  // bindings aplicados ao deployment
  kvNamespaceBindings: [{ name: 'MY_KV', namespaceId: kv.id }],
})
```

**Quando usar:** deploys blue-green, canary, lançamentos graduais  
**Quando não usar:** deploy simples com uma versão (use WorkerScript)

---

Ver: [README.md](./README.md), [api.md](./api.md), [patterns.md](./patterns.md), [gotchas.md](./gotchas.md)

Documentação localizada no ecossistema mantido pelo Controllato Club.
