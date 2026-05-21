# Cloudflare Cron Triggers

Schedule Workers execution using cron expressions. Runs on Cloudflare's global network during underutilized periods.

## Key Features

- **UTC-only execution** - All schedules run on UTC time
- **5-field cron syntax** - Quartz scheduler extensions (L, W, #)
- **Global propagation** - 15min deployment delay
- **At-least-once delivery** - Rare duplicate executions possible
- **Workflow integration** - Trigger long-running multi-step tasks
- **Green Compute** - Optional carbon-aware scheduling during low-carbon periods

## Cron Syntax

```
 ┌─────────── minute (0-59)
 │ ┌───────── hour (0-23)
 │ │ ┌─────── day of month (1-31)
 │ │ │ ┌───── month (1-12, JAN-DEC)
 │ │ │ │ ┌─── day of week (1-7, SUN-SAT, 1=Sunday)
 * * * * *
```

**Special chars:** `*` (any), `,` (list), `-` (range), `/` (step), `L` (last), `W` (weekday), `#` (nth)

## Common Schedules

```bash
*/5 * * * *        # Every 5 minutes
0 * * * *          # Hourly
0 2 * * *          # Daily 2am UTC (off-peak)
0 9 * * MON-FRI    # Weekdays 9am UTC
0 0 1 * *          # Monthly 1st midnight UTC
0 9 L * *          # Last day of month 9am UTC
0 10 * * MON#2     # 2nd Monday 10am UTC
*/10 9-17 * * MON-FRI  # Every 10min, 9am-5pm weekdays
```

## Quick Start

**wrangler.jsonc:**

```jsonc
{
  "name": "my-cron-worker",
  "triggers": {
    "crons": ["*/5 * * * *", "0 2 * * *"],
  },
}
```

**Handler:**

```typescript
export default {
  async scheduled(controller: ScheduledController, env: Env, ctx: ExecutionContext): Promise<void> {
    console.log('Cron:', controller.cron)
    console.log('Time:', new Date(controller.scheduledTime))

    ctx.waitUntil(asyncTask(env)) // Non-blocking
  },
}
```

**Test locally:**

```bash
npx wrangler dev
curl "http://localhost:8787/__scheduled?cron=*/5+*+*+*+*"
```

## Limites

- **Grátis:** 3 gatilhos/trabalhador, CPU de 10ms
- **Pago:** Gatilhos ilimitados, CPU de 50ms
- **Propagação:** implantação global de 15 minutos
- **Fuso horário:** somente UTC

## Ordem de leitura

**Novo em gatilhos cron?** Comece aqui:

1. Este README – Visão geral e início rápido
2. [configuration.md](./configuration.md) - Configure seu primeiro cron trigger
3. [api.md](./api.md) – Entenda a API do manipulador
4. [patterns.md](./patterns.md) - Casos de uso e exemplos comuns

**Solução de problemas?** Vá para [gotchas.md](./gotchas.md)

## Nesta referência

- [configuration.md](./configuration.md) - configuração do wrangler, programações específicas do ambiente, Green Compute
- [api.md](./api.md) - ScheduledController, noRetry(), waitUntil, padrões de teste
- [patterns.md](./patterns.md) - Casos de uso, monitoramento, integração de filas, objetos duráveis
- [gotchas.md](./gotchas.md) - Problemas de fuso horário, idempotência, segurança, testes

## Veja também

- [workflows](../workflows/) - Alternativa para tarefas agendadas de longa duração
- [workers](../workers/) - Documentação de tempo de execução do trabalhador
