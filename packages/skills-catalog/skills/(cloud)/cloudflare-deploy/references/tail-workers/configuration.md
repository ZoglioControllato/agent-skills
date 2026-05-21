# Tail Workers Configuration

## Setup Steps

### 1. Create Tail Worker

Create a Worker with a `tail()` handler:

```typescript
export default {
  async tail(events, env, ctx) {
    // Process events from producer Worker
    ctx.waitUntil(
      fetch(env.LOG_ENDPOINT, {
        method: 'POST',
        body: JSON.stringify(events),
      }),
    )
  },
}
```

### 2. Configure Producer Worker

In producer's `wrangler.jsonc`:

```jsonc
{
  "name": "my-producer-worker",
  "tail_consumers": [
    {
      "service": "my-tail-worker",
    },
  ],
}
```

### 3. Deploy Both Workers

```bash
# Deploy Tail Worker first
cd tail-worker
wrangler deploy

# Then deploy producer Worker
cd ../producer-worker
wrangler deploy
```

## Wrangler Configuration

### Single Tail Consumer

```jsonc
{
  "name": "producer-worker",
  "tail_consumers": [
    {
      "service": "logging-tail-worker",
    },
  ],
}
```

### Multiple Tail Consumers

```jsonc
{
  "name": "producer-worker",
  "tail_consumers": [
    {
      "service": "logging-tail-worker",
    },
    {
      "service": "metrics-tail-worker",
    },
  ],
}
```

**Note:** Each consumer receives ALL events independently.

### Remove Tail Consumer

```jsonc
{
  "tail_consumers": [],
}
```

Then redeploy producer Worker.

## Environment Variables

Tail Workers use same binding syntax as regular Workers:

```jsonc
{
  "name": "my-tail-worker",
  "vars": {
    "LOG_ENDPOINT": "https://logs.example.com/ingest",
  },
  "kv_namespaces": [
    {
      "binding": "LOGS_KV",
      "id": "abc123...",
    },
  ],
}
```

## Testing & Development

### Local Testing

**Tail Workers cannot be fully tested with `wrangler dev`.** Deploy to staging environment for testing.

### Testing Strategy

1. Deploy producer Worker to staging
2. Deploy Tail Worker to staging
3. Configure `tail_consumers` in producer
4. Trigger producer Worker requests
5. Verify Tail Worker receives events (check destination logs/storage)

### Wrangler Tail Command

```bash
# Stream logs to terminal (NOT Tail Workers)
wrangler tail my-producer-worker
```

**Isso é diferente dos Trabalhadores de Cauda:**

- `wrangler tail` transmite logs para o seu terminal
- Tail Workers são Workers que processam eventos programaticamente

## Lista de verificação de implantação

- [] Tail Worker tem manipulador `tail ()`
- [] Tail Worker implantado antes do produtor
- [] `wrangler.jsonc` do produtor tem `tail_consumers` correto
- [] Variáveis de ambiente configuradas
- [] Testado com ambiente de teste
- [ ] Monitoramento configurado para o próprio Tail Worker

## Limites

| Limite                                     | Valor                               | Notas                                                 |
| ------------------------------------------ | ----------------------------------- | ----------------------------------------------------- |
| Máximo de consumidores finais por produtor | 10                                  | Cada um recebe todos os eventos de forma independente |
| Tamanho do lote de eventos                 | Até 100 eventos por invocação       | Lotes maiores divididos entre invocações              |
| Tempo de CPU do Tail Worker                | Igual aos trabalhadores regulares   | 10ms (grátis), 30ms (pago), 50ms (pacote pago)        |
| Nível de preços                            | Trabalhadores Pagos ou Empresariais | Não disponível no plano gratuito                      |
| Solicitar tamanho do corpo                 | 100 MB no máximo                    | Ao enviar para endpoints externos                     |
| Retenção de eventos                        | Nenhum                              | Eventos não repetidos se o manipulador final falhar   |

## Trabalhadores para plataformas

Para Workers de despacho dinâmico, os eventos de Worker de despacho e de usuário são enviados ao consumidor final:```jsonc
{
"name": "dispatch-worker",
"tail_consumers": [
{
"service": "platform-tail-worker",
},
],
}

```

Tail Worker receives TWO `TraceItem` elements per request:

1. Dynamic dispatch Worker event
2. User Worker event

See [patterns.md](patterns.md) for handling.
```
