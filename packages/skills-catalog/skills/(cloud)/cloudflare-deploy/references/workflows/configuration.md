# Configuração do fluxo de trabalho

## Configuração do wrangler.jsonc

```jsonc
{
  "name": "my-worker",
  "main": "src/index.ts",
  "compatibility_date": "2025-01-01", // Use current date for new projects
  "observability": {
    "enabled": true, // Enables Workflows dashboard + structured logs
  },
  "workflows": [
    {
      "name": "my-workflow", // Workflow name
      "binding": "MY_WORKFLOW", // Env binding
      "class_name": "MyWorkflow", // TS class name
      // "script_name": "other-worker" // For cross-script calls
    },
  ],
  "limits": {
    "cpu_ms": 300000, // 5 min max (default 30s)
  },
}
```

##Etapa Configuração

```typescript
// Basic step
const data = await step.do('step name', async () => ({ result: 'value' }))

// With retry config
await step.do(
  'api call',
  {
    retries: {
      limit: 10, // Default: 5, or Infinity
      delay: '10 seconds', // Default: 10000ms
      backoff: 'exponential', // constant | linear | exponential
    },
    timeout: '30 minutes', // Per-attempt timeout (default: 10min)
  },
  async () => {
    const res = await fetch('https://api.example.com/data')
    if (!res.ok) throw new Error('Failed')
    return res.json()
  },
)
```

### Etapas Paralelas

```typescript
const [user, settings] = await Promise.all([
  step.do('fetch user', async () => this.env.KV.get(`user:${id}`)),
  step.do('fetch settings', async () => this.env.KV.get(`settings:${id}`)),
])
```

### Etapas condicionais

```typescript
const config = await step.do('fetch config', async () => this.env.KV.get('flags', { type: 'json' }))

// ✅ Deterministic (based on step output)
if (config.enableEmail) {
  await step.do('send email', async () => sendEmail())
}

// ❌ Non-deterministic (Date.now outside step)
if (Date.now() > deadline) {
  /* BAD */
}
```

### Etapas Dinâmicas (Loops)

```typescript
const files = await step.do('list files', async () => this.env.BUCKET.list())

for (const file of files.objects) {
  await step.do(`process ${file.key}`, async () => {
    const obj = await this.env.BUCKET.get(file.key)
    return processData(await obj.arrayBuffer())
  })
}
```

##Vários fluxos de trabalho

````jsonc
{
  "workflows": [
    { "name": "user-onboarding", "binding": "USER_ONBOARDING", "class_name": "UserOnboarding" },
    { "name": "data-processing", "binding": "DATA_PROCESSING", "class_name": "DataProcessing" },
  ],
}
```Cada classe estende `WorkflowEntrypoint` com seu próprio tipo `Params`.

## Ligações entre scripts

O trabalhador A define o fluxo de trabalho. O trabalhador B chama isso adicionando `script_name`:
```jsonc
// Worker B (caller)
{
  "workflows": [
    {
      "name": "billing-workflow",
      "binding": "BILLING",
      "script_name": "billing-worker", // Points to Worker A
    },
  ],
}
````

##Ligações

Os fluxos de trabalho acessam as vinculações do Cloudflare por meio de `this.env`:

```typescript
type Env = {
  MY_WORKFLOW: Workflow
  KV: KVNamespace
  DB: D1Database
  BUCKET: R2Bucket
  AI: Ai
  VECTORIZE: VectorizeIndex
}

await step.do('use bindings', async () => {
  const kv = await this.env.KV.get('key')
  const db = await this.env.DB.prepare('SELECT * FROM users').first()
  const file = await this.env.BUCKET.get('file.txt')
  const ai = await this.env.AI.run('@cf/meta/llama-2-7b-chat-int8', { prompt: 'Hi' })
})
```

##Vinculação de funções de páginas

As funções de páginas podem acionar fluxos de trabalho por meio de ligações de serviço:

````typescript
// functions/_middleware.ts
export const onRequest: PagesFunction<Env> = async ({ env, request }) => {
  const instance = await env.MY_WORKFLOW.create({
    params: { url: request.url },
  })
  return new Response(`Started ${instance.id}`)
}
```Configure em wrangler.jsonc em `service_bindings`.

Consulte: [api.md](./api.md), [patterns.md](./patterns.md)
````
