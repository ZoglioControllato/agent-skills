# Configuração de Queues

## Criar fila

```bash
wrangler queues create my-queue
wrangler queues create my-queue --retention-period-hours=336  # 14 days
wrangler queues create my-queue --delivery-delay-secs=300
```

## Binding de produtor

**wrangler.jsonc:**

```jsonc
{
  "queues": {
    "producers": [
      {
        "queue": "my-queue-name",
        "binding": "MY_QUEUE",
        "delivery_delay": 60, // Optional: default delay in seconds
      },
    ],
  },
}
```

## Configuração do consumidor (push)

**wrangler.jsonc:**

```jsonc
{
  "queues": {
    "consumers": [
      {
        "queue": "my-queue-name",
        "max_batch_size": 10, // 1-100, default 10
        "max_batch_timeout": 5, // 0-60s, default 5
        "max_retries": 3, // default 3, max 100
        "dead_letter_queue": "my-dlq", // optional
        "retry_delay": 300, // optional: delay retries in seconds
      },
    ],
  },
}
```

## Configuração do consumidor (pull)

**wrangler.jsonc:**

```jsonc
{
  "queues": {
    "consumers": [
      {
        "queue": "my-queue-name",
        "type": "http_pull",
        "visibility_timeout_ms": 5000, // default 30000, max 12h
        "max_retries": 5,
        "dead_letter_queue": "my-dlq",
      },
    ],
  },
}
```

## Tipos TypeScript

```typescript
interface Env {
  MY_QUEUE: Queue<MessageBody>
  ANALYTICS_QUEUE: Queue<AnalyticsEvent>
}

interface MessageBody {
  id: string
  action: 'create' | 'update' | 'delete'
  data: Record<string, any>
}

export default {
  async queue(batch: MessageBatch<MessageBody>, env: Env): Promise<void> {
    for (const msg of batch.messages) {
      console.log(msg.body.action)
      msg.ack()
    }
  },
} satisfies ExportedHandler<Env>
```

## Escolha do tipo de conteúdo

Escolha o tipo conforme o consumidor e os dados:

| Tipo de conteúdo | Use quando                                             | Legível por                 | Suporta                              | Tamanho  |
| ---------------- | ------------------------------------------------------ | --------------------------- | ------------------------------------ | -------- |
| `json`           | Consumidores pull, visão no dashboard, objetos simples | Todos (push/pull/dashboard) | Apenas tipos serializáveis em JSON   | Médio    |
| `v8`             | Somente consumidores push, objetos JS complexos        | Somente consumidores push   | Date, Map, Set, BigInt, typed arrays | Pequeno  |
| `text`           | Apenas strings                                         | Todos                       | Somente strings                      | Menor    |
| `bytes`          | Dados binários (imagens, arquivos)                     | Todos                       | ArrayBuffer, Uint8Array              | Variável |

**Árvore de decisão:**

1. Precisa ver no dashboard ou usar consumidor pull? → Use `json`
2. Precisa de Date, Map, Set ou outros tipos V8? → Use `v8` (somente consumidores push)
3. Só strings? → Use `text`
4. Dados binários? → Use `bytes`

```typescript
// JSON: Good for simple objects, pull consumers, dashboard visibility
await env.QUEUE.send({ id: 123, name: 'test' }, { contentType: 'json' })

// V8: Good for Date, Map, Set (push consumers only)
await env.QUEUE.send(
  {
    created: new Date(),
    tags: new Set(['a', 'b']),
  },
  { contentType: 'v8' },
)

// Text: Simple strings
await env.QUEUE.send('process-user-123', { contentType: 'text' })

// Bytes: Binary data
await env.QUEUE.send(imageBuffer, { contentType: 'bytes' })
```

**Comportamento padrão:** Se não especificado, a Cloudflare escolhe automaticamente `json` para objetos serializáveis em JSON e `v8` para tipos complexos.

**IMPORTANTE:** Mensagens `v8` não podem ser lidas por consumidores pull nem visualizadas no dashboard. Use `json` se precisar de visibilidade ou consumo via pull.

## Comandos da CLI

```bash
# Consumer management
wrangler queues consumer add my-queue my-worker --batch-size=50 --max-retries=5
wrangler queues consumer http add my-queue
wrangler queues consumer worker remove my-queue my-worker
wrangler queues consumer http remove my-queue

# Queue operations
wrangler queues list
wrangler queues pause my-queue
wrangler queues resume my-queue
wrangler queues purge my-queue
wrangler queues delete my-queue
```

Documentação localizada no ecossistema mantido pelo Controllato Club.
