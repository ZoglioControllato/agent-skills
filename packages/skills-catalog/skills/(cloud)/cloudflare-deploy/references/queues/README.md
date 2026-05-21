# Cloudflare Queues

Filas de mensagens flexíveis para processamento assíncrono com entrega at-least-once garantida e lotes configuráveis.

## Visão geral

As Queues oferecem:

- Garantia de entrega at-least-once
- Consumidores push (Worker) e pull (HTTP)
- Lotes, retentativas e configuração flexíveis
- Dead Letter Queues (DLQ)
- Atrasos de até 12 horas

**Casos de uso:** processamento assíncrono, buffer de API, rate limiting, fluxos por eventos, jobs adiados

## Início rápido

```bash
wrangler queues create my-queue
wrangler queues consumer add my-queue my-worker
```

```typescript
// Producer
await env.MY_QUEUE.send({ userId: 123, action: 'notify' })

// Consumer (with proper error handling)
export default {
  async queue(batch: MessageBatch, env: Env): Promise<void> {
    for (const msg of batch.messages) {
      try {
        await process(msg.body)
        msg.ack()
      } catch (error) {
        msg.retry({ delaySeconds: 60 })
      }
    }
  },
}
```

## Avisos críticos

**Antes de usar Queues, entenda estes erros comuns em produção:**

1. **Erros não tratados repetem o LOTE INTEIRO** (não só a mensagem com falha). Use sempre try/catch por mensagem.
2. **Mensagens sem ack/retry explícito repetem automaticamente** até `max_retries`. Trate cada mensagem explicitamente.

Consulte [gotchas.md](./gotchas.md) para soluções detalhadas.

## Operações principais

| Operação                  | Finalidade          | Limite          |
| ------------------------- | ------------------- | --------------- |
| `send(body, options?)`    | Publicar mensagem   | 128 KB          |
| `sendBatch(messages)`     | Publicação em lote  | 100 msgs/256 KB |
| `message.ack()`           | Confirmar sucesso   | -               |
| `message.retry(options?)` | Repetir com atraso  | -               |
| `batch.ackAll()`          | Ack do lote inteiro | -               |

## Arquitetura

```
[Producer Worker] → [Queue] → [Consumer Worker/HTTP] → [Processing]
```

- Até 10.000 filas por conta
- 5.000 msgs/segundo por fila
- Retenção de 4 a 14 dias (configurável)

## Ordem de leitura

**Novo em Queues?** Comece aqui:

1. [configuration.md](./configuration.md) — Configurar filas, bindings e consumidores
2. [api.md](./api.md) — Enviar mensagens, tratar lotes, padrões ack/retry
3. [patterns.md](./patterns.md) — Exemplos reais e integrações
4. [gotchas.md](./gotchas.md) — Avisos críticos e resolução de problemas

**Roteamento por tarefa:**

- Configurar fila → [configuration.md](./configuration.md)
- Enviar/receber mensagens → [api.md](./api.md)
- Implementar padrão específico → [patterns.md](./patterns.md)
- Depurar → [gotchas.md](./gotchas.md)

## Nesta referência

- [configuration.md](./configuration.md) — wrangler.jsonc, config de produtor/consumidor, DLQ, tipos de conteúdo
- [api.md](./api.md) — Envio/lote, handler de fila, regras ack/retry, padrões type-safe
- [patterns.md](./patterns.md) — Tarefas assíncronas, buffer, rate limiting, integrações D1/Workflows/DO
- [gotchas.md](./gotchas.md) — Erros em lote, idempotência, classificação de erros

## Ver também

- [workers](../workers/) — Runtime dos Workers para produtores/consumidores
- [r2](../r2/) — Processar notificações de eventos R2 via filas
- [d1](../d1/) — Escrita em lote no D1 a partir de consumidores de fila

Documentação localizada no ecossistema mantido pelo Controllato Club.
