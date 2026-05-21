# Padrões comuns dos trabalhadores de cauda

## Bibliotecas Comunitárias

Embora a maioria das implementações do tail Worker sejam personalizadas, estas bibliotecas podem ajudar:

**Registro/Observabilidade:**

- **Axiom** - `axiom-cloudflare-workers` (npm) - Integração direta do Axiom
- **Baselime** - SDK para plataforma de observabilidade Baselime
- **LogFlare** - Agregação de log estruturado

**Definições de tipo:**

- **@cloudflare/workers-types** - Tipos oficiais de TypeScript (use `TraceItem`)

**Observação:** A maioria das integrações exige implementação de manipulador de cauda personalizado. Veja exemplos de integração abaixo.

## Padrões Básicos

### Registro de endpoint HTTP```typescript

export default {
async tail(events, env, ctx) {
const payload = events.map((event) => ({
script: event.scriptName,
timestamp: event.eventTimestamp,
outcome: event.outcome,
url: event.event?.request?.url,
status: event.event?.response?.status,
logs: event.logs,
exceptions: event.exceptions,
}))

    ctx.waitUntil(
      fetch(env.LOG_ENDPOINT, {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
    )

},
}

````

### Error Tracking Only

```typescript
export default {
  async tail(events, env, ctx) {
    const errors = events.filter((e) => e.outcome === 'exception' || e.exceptions.length > 0)

    if (errors.length === 0) return

    ctx.waitUntil(
      fetch(env.ERROR_ENDPOINT, {
        method: 'POST',
        body: JSON.stringify(errors),
      }),
    )
  },
}
````

## Storage Integration

### KV Storage with TTL

```typescript
export default {
  async tail(events, env, ctx) {
    ctx.waitUntil(
      Promise.all(
        events.map((event) =>
          env.LOGS_KV.put(
            `log:${event.scriptName}:${event.eventTimestamp}`,
            JSON.stringify(event),
            { expirationTtl: 86400 }, // 24 hours
          ),
        ),
      ),
    )
  },
}
```

### Analytics Engine Metrics

```typescript
export default {
  async tail(events, env, ctx) {
    ctx.waitUntil(
      Promise.all(
        events.map((event) =>
          env.ANALYTICS.writeDataPoint({
            blobs: [event.scriptName, event.outcome],
            doubles: [1, event.event?.response?.status ?? 0],
            indexes: [event.event?.request?.cf?.colo ?? 'unknown'],
          }),
        ),
      ),
    )
  },
}
```

## Filtering & Routing

Filter by route, outcome, or other criteria:

```typescript
export default {
  async tail(events, env, ctx) {
    // Route filtering
    const apiEvents = events.filter((e) => e.event?.request?.url?.includes('/api/'))

    // Multi-destination routing
    const errors = events.filter((e) => e.outcome === 'exception')
    const success = events.filter((e) => e.outcome === 'ok')

    const tasks = []
    if (errors.length > 0) {
      tasks.push(
        fetch(env.ERROR_ENDPOINT, {
          method: 'POST',
          body: JSON.stringify(errors),
        }),
      )
    }
    if (success.length > 0) {
      tasks.push(
        fetch(env.SUCCESS_ENDPOINT, {
          method: 'POST',
          body: JSON.stringify(success),
        }),
      )
    }

    ctx.waitUntil(Promise.all(tasks))
  },
}
```

## Sampling

Reduce costs by processing only a percentage of events:

```typescript
export default {
  async tail(events, env, ctx) {
    if (Math.random() > 0.1) return // 10% sample rate
    ctx.waitUntil(
      fetch(env.LOG_ENDPOINT, {
        method: 'POST',
        body: JSON.stringify(events),
      }),
    )
  },
}
```

## Advanced Patterns

### Batching with Durable Objects

Accumulate events before sending:

```typescript
export default {
  async tail(events, env, ctx) {
    const batch = env.BATCH_DO.get(env.BATCH_DO.idFromName('batch'))
    ctx.waitUntil(
      batch.fetch('https://batch/add', {
        method: 'POST',
        body: JSON.stringify(events),
      }),
    )
  },
}
```

Consulte a habilidade de objetos duráveis ​​para implementação completa.

### Trabalhadores para plataformas

O despacho dinâmico envia DOIS eventos por solicitação. Filtre por `scriptName` para distinguir eventos de envio e de trabalho do usuário.

### Tratamento de erros

Sempre finalize chamadas externas. Consulte gotchas.md para padrão de armazenamento substituto.
