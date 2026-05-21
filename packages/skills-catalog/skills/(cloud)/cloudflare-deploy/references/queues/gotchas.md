# Queues: armadilhas e resolução de problemas

## CRÍTICO: principais erros em produção

### 1. “Lote inteiro repetido após um único erro”

**Problema:** Lançar erro não tratado no handler da fila repete o lote inteiro, não só a mensagem com falha  
**Causa:** Exceções não capturadas propagam ao runtime e disparam retry em nível de lote  
**Solução:** Envolva sempre o processamento de cada mensagem em try/catch e chame `msg.retry()` explicitamente

```typescript
// ❌ BAD: Throws error, retries entire batch
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

### 2. “Mensagens repetem para sempre”

**Problema:** Mensagens sem ack ou retry explícito repetem automaticamente  
**Causa:** O padrão do runtime é repetir mensagens não tratadas até `max_retries`  
**Solução:** Chame sempre `msg.ack()` ou `msg.retry()` por mensagem. Nunca deixe mensagens sem tratamento explícito.

```typescript
// ❌ BAD: Skipped messages auto-retry forever
async queue(batch: MessageBatch): Promise<void> {
  for (const msg of batch.messages) {
    if (shouldProcess(msg.body)) {
      await process(msg.body);
      msg.ack();
    }
    // Missing: msg.ack() for skipped messages - they will retry!
  }
}

// ✅ GOOD: Explicitly handle all messages
async queue(batch: MessageBatch): Promise<void> {
  for (const msg of batch.messages) {
    if (shouldProcess(msg.body)) {
      await process(msg.body);
      msg.ack();
    } else {
      msg.ack(); // Explicitly ack even if not processing
    }
  }
}
```

## Erros comuns

### “Processamento duplicado de mensagens”

**Problema:** A mesma mensagem é processada várias vezes  
**Causa:** A garantia at-least-once permite duplicatas durante retentativas  
**Solução:** Torne os consumidores idempotentes rastreando IDs processados no KV com TTL de expiração

```typescript
async queue(batch: MessageBatch, env: Env): Promise<void> {
  for (const msg of batch.messages) {
    const processed = await env.PROCESSED_KV.get(msg.id);
    if (processed) {
      msg.ack();
      continue;
    }

    await processMessage(msg.body);
    await env.PROCESSED_KV.put(msg.id, '1', { expirationTtl: 86400 });
    msg.ack();
  }
}
```

### “Consumidor pull não decodifica mensagens”

**Problema:** Consumidor pull ou dashboard mostra corpos ilegíveis  
**Causa:** Mensagens com tipo `v8` só são decodificáveis por consumidores push Workers  
**Solução:** Use tipo `json` para consumidores pull ou visibilidade no dashboard

```typescript
// Use json for pull consumers
await env.MY_QUEUE.send(data, { contentType: 'json' })

// Use v8 only for push consumers with complex JS types
await env.MY_QUEUE.send({ date: new Date(), tags: new Set() }, { contentType: 'v8' })
```

### “Mensagens não são entregues”

**Problema:** Mensagens enviadas mas consumidor não processa  
**Causa:** Fila pausada, consumidor não configurado ou erros no consumidor  
**Solução:** Verifique o status com `wrangler queues list`, confira consumidor com `wrangler queues consumer add` e logs com `wrangler tail`

### “Taxa alta na Dead Letter Queue”

**Problema:** Muitas mensagens vão para a DLQ  
**Causa:** Consumidor falha repetidamente após máximo de retentativas  
**Solução:** Revise logs de erro do consumidor, disponibilidade de dependências externas, formato das mensagens ou aumente o atraso entre retentativas

## Padrões de classificação de erro

Classifique erros para decidir entre retry ou DLQ:

```typescript
async queue(batch: MessageBatch, env: Env): Promise<void> {
  for (const msg of batch.messages) {
    try {
      await processMessage(msg.body);
      msg.ack();
    } catch (error) {
      // Transient errors: retry with backoff
      if (isRetryable(error)) {
        const delay = Math.min(30 * (2 ** msg.attempts), 43200);
        msg.retry({ delaySeconds: delay });
      }
      // Permanent errors: ack to avoid infinite retries
      else {
        console.error('Permanent error, sending to DLQ:', error);
        await env.ERROR_LOG.put(msg.id, JSON.stringify({ msg: msg.body, error: String(error) }));
        msg.ack(); // Prevent further retries
      }
    }
  }
}

function isRetryable(error: unknown): boolean {
  if (error instanceof Response) {
    // Retry: rate limits, timeouts, server errors
    return error.status === 429 || error.status >= 500;
  }
  if (error instanceof Error) {
    // Don't retry: validation, auth, not found
    return !error.message.includes('validation') &&
           !error.message.includes('unauthorized') &&
           !error.message.includes('not found');
  }
  return false; // Unknown errors don't retry
}
```

### “Tempo de CPU excedido no consumidor”

**Problema:** Consumidor falha por limite de tempo de CPU  
**Causa:** Processamento ultrapassa o limite padrão de 30s  
**Solução:** Aumente o limite no wrangler.jsonc: `{ "limits": { "cpu_ms": 300000 } }` (máx. 5 minutos)

## Guia de decisão de tipo de conteúdo

**Quando usar cada tipo:**

| Tipo de conteúdo | Use quando                                    | Legível por                 | Suporta                              |
| ---------------- | --------------------------------------------- | --------------------------- | ------------------------------------ |
| `json` (padrão)  | Consumidores pull, dashboard, objetos simples | Todos (push/pull/dashboard) | Apenas tipos serializáveis em JSON   |
| `v8`             | Somente push, objetos JS complexos            | Somente push                | Date, Map, Set, BigInt, typed arrays |
| `text`           | Apenas strings                                | Todos                       | Somente strings                      |
| `bytes`          | Dados binários (imagens, arquivos)            | Todos                       | ArrayBuffer, Uint8Array              |

**Árvore de decisão:**

1. Precisa ver no dashboard ou usar consumidor pull? → Use `json`
2. Precisa de Date, Map, Set ou outros tipos V8? → Use `v8` (somente push)
3. Só strings? → Use `text`
4. Dados binários? → Use `bytes`

```typescript
// Dashboard/pull: use json
await env.QUEUE.send({ id: 123, name: 'test' }, { contentType: 'json' })

// Complex JS types (push only): use v8
await env.QUEUE.send(
  {
    created: new Date(),
    tags: new Set(['a', 'b']),
  },
  { contentType: 'v8' },
)
```

## Limites

| Limite                       | Valor                     | Observação                                 |
| ---------------------------- | ------------------------- | ------------------------------------------ |
| Máx. filas                   | 10.000                    | Por conta                                  |
| Tamanho da mensagem          | 128 KB                    | Máximo por mensagem                        |
| Tamanho do lote (consumidor) | 100 mensagens             | Máximo por lote                            |
| Tamanho do lote (sendBatch)  | 100 msgs ou 256 KB        | O que atingir o limite primeiro            |
| Vazão                        | 5.000 msgs/s              | Por fila                                   |
| Retenção                     | 4–14 dias                 | Período configurável                       |
| Backlog máximo               | 25 GB                     | Tamanho máximo do backlog                  |
| Atraso máximo                | 12 horas (43.200s)        | Atraso máximo da mensagem                  |
| Retentativas máx.            | 100                       | Tentativas máximas                         |
| CPU padrão                   | 30s                       | Por invocação do consumidor                |
| CPU máx.                     | 300s (5 min)              | Configurável via `limits.cpu_ms`           |
| Operações por mensagem       | 3 (write + read + delete) | Custo base por mensagem                    |
| Preço                        | US$ 0,40 por 1M ops       | Após 1M operações gratuitas                |
| Cobrança por mensagem        | Por bloco de 64 KB        | Mensagens cobradas em incrementos de 64 KB |

Documentação localizada no ecossistema mantido pelo Controllato Club.
