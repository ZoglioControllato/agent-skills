# Referência da API de Queues

## Produtor: enviar mensagens

```typescript
// Basic send
await env.MY_QUEUE.send({ url: request.url, timestamp: Date.now() })

// Options: delay (max 43200s), contentType (json|text|bytes|v8)
await env.MY_QUEUE.send(message, { delaySeconds: 600 })
await env.MY_QUEUE.send(message, { delaySeconds: 0 }) // Override queue default

// Batch (up to 100 msgs or 256 KB)
await env.MY_QUEUE.sendBatch([{ body: 'msg1' }, { body: 'msg2' }, { body: 'msg3', options: { delaySeconds: 300 } }])

// Non-blocking with ctx.waitUntil - send continues after response
ctx.waitUntil(env.MY_QUEUE.send({ data: 'async' }))

// Background tasks in queue consumer
export default {
  async queue(batch: MessageBatch, env: Env, ctx: ExecutionContext): Promise<void> {
    for (const msg of batch.messages) {
      await processMessage(msg.body)

      // Fire-and-forget analytics (doesn't block ack)
      ctx.waitUntil(env.ANALYTICS_QUEUE.send({ messageId: msg.id, processedAt: Date.now() }))

      msg.ack()
    }
  },
}
```

## Consumidor: baseado em push (Worker)

```typescript
// Type-safe handler with ExportedHandler
interface Env {
  MY_QUEUE: Queue
  DB: D1Database
}

export default {
  async queue(batch: MessageBatch<MessageBody>, env: Env, ctx: ExecutionContext): Promise<void> {
    // batch.queue, batch.messages.length
    for (const msg of batch.messages) {
      // msg.id, msg.body, msg.timestamp, msg.attempts
      try {
        await processMessage(msg.body)
        msg.ack()
      } catch (error) {
        msg.retry({ delaySeconds: 600 })
      }
    }
  },
} satisfies ExportedHandler<Env>
```

**AVISOS CRÍTICOS:**

1. **Mensagens sem ack ou retry explícito repetem automaticamente** até atingir `max_retries`. Chame sempre `msg.ack()` ou `msg.retry()` em cada mensagem.

2. **Erros não capturados repetem o LOTE INTEIRO**, não só a mensagem com falha. Envolva o processamento de cada mensagem em try/catch e chame `msg.retry()` explicitamente por mensagem.

```typescript
// ❌ BAD: Uncaught error retries entire batch
async queue(batch: MessageBatch): Promise<void> {
  for (const msg of batch.messages) {
    await riskyOperation(msg.body); // If this throws, entire batch retries
    msg.ack();
  }
}

// ✅ GOOD: Catch per message, handle individually
async queue(batch: MessageBatch): Promise<void> {
  for (const msg of batch.messages) {
    try {
      await riskyOperation(msg.body);
      msg.ack();
    } catch (error) {
      msg.retry({ delaySeconds: 60 });
    }
  }
}
```

## Regras de precedência ack/retry

1. **Chamadas por mensagem têm precedência**: Se chamar `msg.ack()` e `msg.retry()`, vale a última chamada
2. **Chamadas em lote não sobrescrevem**: `batch.ackAll()` só afeta mensagens sem ack/retry explícito
3. **Sem ação = retry automático**: Mensagens sem ação explícita repetem com o atraso configurado

```typescript
async queue(batch: MessageBatch): Promise<void> {
  for (const msg of batch.messages) {
    msg.ack();        // Message marked for ack
    msg.retry();      // Overrides ack - message will retry
  }

  batch.ackAll();     // Only affects messages not explicitly handled above
}
```

## Operações em lote

```typescript
// Acknowledge entire batch
try {
  await bulkProcess(batch.messages)
  batch.ackAll()
} catch (error) {
  batch.retryAll({ delaySeconds: 300 })
}
```

## Backoff exponencial

```typescript
async queue(batch: MessageBatch, env: Env): Promise<void> {
  for (const msg of batch.messages) {
    try {
      await processMessage(msg.body);
      msg.ack();
    } catch (error) {
      // 30s, 60s, 120s, 240s, 480s, ... up to 12h max
      const delay = Math.min(30 * (2 ** msg.attempts), 43200);
      msg.retry({ delaySeconds: delay });
    }
  }
}
```

## Várias filas, um consumidor

```typescript
export default {
  async queue(batch: MessageBatch, env: Env): Promise<void> {
    switch (batch.queue) {
      case 'high-priority':
        await processUrgent(batch.messages)
        break
      case 'low-priority':
        await processDeferred(batch.messages)
        break
      case 'email':
        await sendEmails(batch.messages)
        break
      default:
        batch.retryAll()
    }
  },
}
```

## Consumidor: baseado em pull (HTTP)

```typescript
// Pull messages
const response = await fetch(
  `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/queues/${QUEUE_ID}/messages/pull`,
  {
    method: 'POST',
    headers: { authorization: `Bearer ${API_TOKEN}`, 'content-type': 'application/json' },
    body: JSON.stringify({ visibility_timeout_ms: 6000, batch_size: 50 }),
  },
)

const data = await response.json()

// Acknowledge
await fetch(`https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/queues/${QUEUE_ID}/messages/ack`, {
  method: 'POST',
  headers: { authorization: `Bearer ${API_TOKEN}`, 'content-type': 'application/json' },
  body: JSON.stringify({
    acks: [{ lease_id: msg.lease_id }],
    retries: [{ lease_id: msg2.lease_id, delay_seconds: 600 }],
  }),
})
```

## Interfaces

```typescript
interface MessageBatch<Body = unknown> {
  readonly queue: string
  readonly messages: Message<Body>[]
  ackAll(): void
  retryAll(options?: QueueRetryOptions): void
}

interface Message<Body = unknown> {
  readonly id: string
  readonly timestamp: Date
  readonly body: Body
  readonly attempts: number
  ack(): void
  retry(options?: QueueRetryOptions): void
}

interface QueueSendOptions {
  contentType?: 'text' | 'bytes' | 'json' | 'v8'
  delaySeconds?: number // 0-43200
}
```

Documentação localizada no ecossistema mantido pelo Controllato Club.
