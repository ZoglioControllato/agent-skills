# Workflow Patterns

## Image Processing Pipeline

```typescript
export class ImageProcessingWorkflow extends WorkflowEntrypoint<Env, Params> {
  async run(event, step) {
    const imageData = await step.do('fetch', async () =>
      (await this.env.BUCKET.get(event.params.imageKey)).arrayBuffer(),
    )
    const description = await step.do(
      'generate description',
      async () =>
        await this.env.AI.run('@cf/llava-hf/llava-1.5-7b-hf', {
          image: Array.from(new Uint8Array(imageData)),
          prompt: 'Describe this image',
          max_tokens: 50,
        }),
    )
    await step.waitForEvent('await approval', { event: 'approved', timeout: '24h' })
    await step.do('publish', async () => await this.env.BUCKET.put(`public/${event.params.imageKey}`, imageData))
  }
}
```

## User Lifecycle

```typescript
export class UserLifecycleWorkflow extends WorkflowEntrypoint<Env, Params> {
  async run(event, step) {
    await step.do('welcome email', async () => await sendEmail(event.params.email, 'Welcome!'))
    await step.sleep('trial period', '7 days')
    const hasConverted = await step.do('check conversion', async () => {
      const user = await this.env.DB.prepare('SELECT subscription_status FROM users WHERE id = ?')
        .bind(event.params.userId)
        .first()
      return user.subscription_status === 'active'
    })
    if (!hasConverted)
      await step.do('trial expiration email', async () => await sendEmail(event.params.email, 'Trial ending'))
  }
}
```

## Data Pipeline

```typescript
export class DataPipelineWorkflow extends WorkflowEntrypoint<Env, Params> {
  async run(event, step) {
    const rawData = await step.do(
      'extract',
      { retries: { limit: 10, delay: '30s', backoff: 'exponential' } },
      async () => {
        const res = await fetch(event.params.sourceUrl)
        if (!res.ok) throw new Error('Fetch failed')
        return res.json()
      },
    )
    const transformed = await step.do('transform', async () =>
      rawData.map((item) => ({ id: item.id, normalized: normalizeData(item) })),
    )
    const dataRef = await step.do('store', async () => {
      const key = `processed/${Date.now()}.json`
      await this.env.BUCKET.put(key, JSON.stringify(transformed))
      return { key }
    })
    await step.do('load', async () => {
      const data = await (await this.env.BUCKET.get(dataRef.key)).json()
      for (let i = 0; i < data.length; i += 100) {
        await this.env.DB.batch(
          data
            .slice(i, i + 100)
            .map((item) => this.env.DB.prepare('INSERT INTO records VALUES (?, ?)').bind(item.id, item.normalized)),
        )
      }
    })
  }
}
```

## Human-in-the-Loop Approval

```typescript
export class ApprovalWorkflow extends WorkflowEntrypoint<Env, Params> {
  async run(event, step) {
    await step.do(
      'create approval',
      async () =>
        await this.env.DB.prepare('INSERT INTO approvals (id, user_id, status) VALUES (?, ?, ?)')
          .bind(event.instanceId, event.params.userId, 'pending')
          .run(),
    )
    try {
      const approval = await step.waitForEvent<{ approved: boolean }>('wait for approval', {
        event: 'approval-response',
        timeout: '48h',
      })
      if (approval.approved) {
        await step.do('process approval', async () => {})
      } else {
        await step.do('handle rejection', async () => {})
      }
    } catch (e) {
      await step.do(
        'auto reject',
        async () =>
          await this.env.DB.prepare('UPDATE approvals SET status = ? WHERE id = ?')
            .bind('auto-rejected', event.instanceId)
            .run(),
      )
    }
  }
}
```

## Testing Workflows

### Setup

```typescript
// vitest.config.ts
import { defineWorkersConfig } from '@cloudflare/vitest-pool-workers/config'

export default defineWorkersConfig({
  test: {
    poolOptions: {
      workers: {
        wrangler: { configPath: './wrangler.jsonc' },
      },
    },
  },
})
```

### Introspection API

```typescript
import { introspectWorkflowInstance } from 'cloudflare:test'

const instance = await env.MY_WORKFLOW.create({ params: { userId: '123' } })
const introspector = await introspectWorkflowInstance(env.MY_WORKFLOW, instance.id)

// Wait for step completion
const result = await introspector.waitForStepResult({ name: 'fetch user', index: 0 })

// Mock step behavior
await introspector.modify(async (m) => {
  await m.mockStepResult({ name: 'api call' }, { mocked: true })
})
```

## Melhores práticas

### ✅ FAÇA

1. **Etapas granulares**: uma chamada de API por etapa (a menos que comprove idempotência)
2. **Idempotência**: verificar e executar; usar chaves de idempotência
3. **Nomes determinísticos**: Use nomes estáticos ou baseados em saída passo a passo
4. **Estado de retorno**: persistir por meio de retornos de etapa, não de variáveis
5. **Sempre aguarde**: `await step.do()`, evite promessas pendentes
6. **Condicionais determinísticas**: Baseiam-se em `event.payload` ou saídas de etapa
7. **Armazenar dados grandes externamente**: R2/KV para >1 MiB, retornar referências
8. **Criação em lote**: `createBatch()` para múltiplas instâncias

### ❌NÃO

1. **Um passo gigante**: quebra a durabilidade e o controle de novas tentativas
2. **Estado fora das etapas**: Perdido na hibernação
3. **Eventos modificados**: eventos imutáveis, retornam novo estado
4. **Lógica não determinística fora das etapas**: `Math.random()`, `Date.now()` deve estar nas etapas
5. **Efeitos colaterais fora das etapas**: podem duplicar na reinicialização
6. **Nomes de etapas não determinísticos**: Impede o armazenamento em cache
7. **Ignorar tempos limite**: `waitForEvent` lança, use try-catch
8. **Reutilizar IDs de instância**: devem ser exclusivos na retenção

## Padrões de orquestração

### Fan-Out (processamento paralelo)```typescript

const files = await step.do('list', async () => this.env.BUCKET.list())
await Promise.all(
files.objects.map((file, i) =>
step.do(`process ${i}`, async () => processFile(await (await this.env.BUCKET.get(file.key)).arrayBuffer())),
),
)

````

### Parent-Child Workflows

```typescript
const child = await step.do(
  'start child',
  async () => await this.env.CHILD_WORKFLOW.create({ id: `child-${event.instanceId}`, params: { data: result.data } }),
)
await step.do('other work', async () => console.log(`Child started: ${child.id}`))
````

### Race Pattern

```typescript
const winner = await Promise.race([
  step.do('option A', async () => slowOperation()),
  step.do('option B', async () => fastOperation()),
])
```

### Scheduled Workflow Chain

```typescript
export default {
  async scheduled(event, env) {
    await env.DAILY_WORKFLOW.create({ id: `daily-${event.scheduledTime}`, params: { timestamp: event.scheduledTime } })
  },
}
export class DailyWorkflow extends WorkflowEntrypoint<Env, Params> {
  async run(event, step) {
    await step.do('daily task', async () => {})
    await step.sleep('wait 7 days', '7 days')
    await step.do('weekly followup', async () => {})
  }
}
```

See: [configuration.md](./configuration.md), [api.md](./api.md), [gotchas.md](./gotchas.md)
