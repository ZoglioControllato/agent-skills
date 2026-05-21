# API e data sources

## Outputs e exports

Exporte identificadores de recurso:

```typescript
export const kvId = kv.id
export const bucketName = bucket.name
export const workerUrl = worker.subdomain
export const dbId = db.id
```

## Dependências entre recursos

Dependências implícitas via outputs:

```typescript
const kv = new cloudflare.WorkersKvNamespace('kv', {
  accountId: accountId,
  title: 'my-kv',
})

// Worker depende do KV (implícito via kv.id)
const worker = new cloudflare.WorkerScript('worker', {
  accountId: accountId,
  name: 'my-worker',
  content: code,
  kvNamespaceBindings: [{ name: 'MY_KV', namespaceId: kv.id }], // Creates dependency
})
```

Dependências explícitas:

```typescript
const migration = new command.local.Command(
  'migration',
  {
    create: pulumi.interpolate`wrangler d1 execute ${db.name} --file ./schema.sql`,
  },
  { dependsOn: [db] },
)

const worker = new cloudflare.WorkerScript(
  'worker',
  {
    accountId: accountId,
    name: 'worker',
    content: code,
    d1DatabaseBindings: [{ name: 'DB', databaseId: db.id }],
  },
  { dependsOn: [migration] },
) // Garante migrações antes do Worker
```

## Usando outputs com chamadas de API

```typescript
const db = new cloudflare.D1Database('db', { accountId, name: 'my-db' })

db.id.apply(async (dbId) => {
  const response = await fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}/d1/database/${dbId}/query`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ sql: 'CREATE TABLE users (id INT)' }),
  })
  return response.json()
})
```

## Providers dinâmicos customizados

Para recursos fora do provider:

```typescript
import * as pulumi from '@pulumi/pulumi'

class D1MigrationProvider implements pulumi.dynamic.ResourceProvider {
  async create(inputs: any): Promise<pulumi.dynamic.CreateResult> {
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${inputs.accountId}/d1/database/${inputs.databaseId}/query`,
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${inputs.apiToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ sql: inputs.sql }),
      },
    )
    return { id: `${inputs.databaseId}-${Date.now()}`, outs: await response.json() }
  }
  async update(id: string, olds: any, news: any): Promise<pulumi.dynamic.UpdateResult> {
    if (olds.sql !== news.sql) await this.create(news)
    return {}
  }
  async delete(id: string, props: any): Promise<void> {}
}

class D1Migration extends pulumi.dynamic.Resource {
  constructor(name: string, args: any, opts?: pulumi.CustomResourceOptions) {
    super(new D1MigrationProvider(), name, args, opts)
  }
}

const migration = new D1Migration(
  'migration',
  {
    accountId,
    databaseId: db.id,
    apiToken,
    sql: 'CREATE TABLE users (id INT)',
  },
  { dependsOn: [db] },
)
```

## Data sources

**Obter zona:**

```typescript
const zone = cloudflare.getZone({ name: 'example.com' })
const zoneId = zone.then((z) => z.id)
```

**Obter contas (via API):**
Use a API da Cloudflare diretamente ou resources dinâmicos customizados.

## Importar recursos existentes

```bash
# Import worker
pulumi import cloudflare:index/workerScript:WorkerScript my-worker <account_id>/<worker_name>

# Import KV namespace
pulumi import cloudflare:index/workersKvNamespace:WorkersKvNamespace my-kv <namespace_id>

# Import R2 bucket
pulumi import cloudflare:index/r2Bucket:R2Bucket my-bucket <account_id>/<bucket_name>

# Import D1 database
pulumi import cloudflare:index/d1Database:D1Database my-db <account_id>/<database_id>

# Import DNS record
pulumi import cloudflare:index/dnsRecord:DnsRecord my-record <zone_id>/<record_id>
```

## Gestão de segredos

```typescript
import * as pulumi from '@pulumi/pulumi'

const config = new pulumi.Config()
const apiKey = config.requireSecret('apiKey') // criptografado no state

const worker = new cloudflare.WorkerScript('worker', {
  accountId: accountId,
  name: 'my-worker',
  content: code,
  secretTextBindings: [{ name: 'API_KEY', text: apiKey }],
})
```

Armazene segredos:

```bash
pulumi config set --secret apiKey "secret-value"
```

## Padrão Transform

Altere argumentos do resource antes da criação:

```typescript
import { Transform } from '@pulumi/pulumi'

interface BucketArgs {
  accountId: pulumi.Input<string>
  transform?: { bucket?: Transform<cloudflare.R2BucketArgs> }
}

function createBucket(name: string, args: BucketArgs) {
  const bucketArgs: cloudflare.R2BucketArgs = {
    accountId: args.accountId,
    name: name,
    location: 'auto',
  }
  const finalArgs = args.transform?.bucket?.(bucketArgs) ?? bucketArgs
  return new cloudflare.R2Bucket(name, finalArgs)
}
```

## Recursos de versionamento de Worker (v6.x)

**Worker** — contêiner de versões:

```typescript
const worker = new cloudflare.Worker('api', { accountId, name: 'api-worker' })
export const workerId = worker.id
```

**WorkerVersion** — código + config imutáveis:

```typescript
const version = new cloudflare.WorkerVersion('v1', {
  accountId,
  workerId: worker.id,
  content: fs.readFileSync('./dist/worker.js', 'utf8'),
  compatibilityDate: '2025-01-01',
})
export const versionId = version.id
```

**WorkersDeployment** — deployment ativo com bindings:

```typescript
const deployment = new cloudflare.WorkersDeployment('prod', {
  accountId,
  workerId: worker.id,
  versionId: version.id,
  kvNamespaceBindings: [{ name: 'MY_KV', namespaceId: kv.id }],
})
```

**Uso:** deploys avançados (canary, blue-green). A maioria dos apps deve usar `WorkerScript` (versionamento automático).

---

Ver: [README.md](./README.md), [configuration.md](./configuration.md), [patterns.md](./patterns.md), [gotchas.md](./gotchas.md)

Documentação localizada no ecossistema mantido pelo Controllato Club.
