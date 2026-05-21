# Cron aciona pegadinhas

## Erros Comuns

### "Problemas de fuso horário"

**Problema:** Cron é executado na hora errada em relação ao fuso horário local
**Causa:** Todos os crons são executados em UTC, sem suporte para fuso horário local
**Solução:** Converta a hora local para UTC manualmente

**Fórmula de conversão:** `utcHour = (localHour - utcOffset + 24) % 24`

**Exemplos:**

- 9h PST (UTC-8) → `(9 - (-8) + 24)% 24 = 17` → `0 17 * * *`
- 2h EST (UTC-5) → `(2 - (-5) + 24)% 24 = 7` → `0 7 * * *`
- 18h JST (UTC + 9) → `(18 - 9 + 24)% 24 = 33% 24 = 9` → `0 9 * * *`

**Horário de verão:** ajuste manualmente quando o horário de verão mudar ou programe em horários não afetados pelo horário de verão (por exemplo, das 2h às 4h, horário local, geralmente seguro)

### "Cron não está em execução"

**Causa:** Exportação `agendada()` ausente, sintaxe inválida, atraso de propagação (<15 minutos) ou limites do plano
**Solução:** Verifique se a exportação existe, valide em crontab.guru, aguarde mais de 15 minutos após a implantação, verifique os limites do plano

### "Execuções Duplicadas"

**Causa:** Entrega pelo menos uma vez
**Solução:** rastreie IDs de execução em KV – veja o padrão de idempotência abaixo

### "Falhas de execução"

**Causa:** CPU excedida, exceções não tratadas, tempos limite de rede, erros de vinculação
**Solução:** Use try-catch, tempos limite de AbortController, `ctx.waitUntil()` para operações longas ou fluxos de trabalho para tarefas pesadas

### "O teste local não funciona"

**Problema:** endpoint `/__scheduled` retorna 404 ou não aciona o manipulador
**Causa:** Exportação `scheduled()` ausente, wrangler não em execução ou formato de endpoint incorreto
**Solução:**

1. Verifique se `scheduled()` foi exportado:```typescript
   export default {
   async scheduled(controller, env, ctx) {
   console.log('Cron triggered')
   },
   }

````

2. Start dev server:

```bash
npx wrangler dev
````

3. Use correct endpoint format (URL-encode spaces as `+`):

```bash
# Correct
curl "http://localhost:8787/__scheduled?cron=*/5+*+*+*+*"

# Wrong (will fail)
curl "http://localhost:8787/__scheduled?cron=*/5 * * * *"
```

4. Update Wrangler if outdated:

```bash
npm install -g wrangler@latest
```

### "waitUntil() Tasks Not Completing"

**Problem:** Background tasks in `ctx.waitUntil()` fail silently or don't execute  
**Cause:** Promises rejected without error handling, or handler returns before promise settles  
**Solution:** Always await or handle errors in waitUntil promises:

```typescript
export default {
  async scheduled(controller, env, ctx) {
    // BAD: Silent failures
    ctx.waitUntil(riskyOperation())

    // GOOD: Explicit error handling
    ctx.waitUntil(
      riskyOperation().catch((err) => {
        console.error('Background task failed:', err)
        return logError(err, env)
      }),
    )
  },
}
```

### "Idempotency Issues"

**Problem:** At-least-once delivery causes duplicate side effects (double charges, duplicate emails)  
**Cause:** No deduplication mechanism  
**Solution:** Use KV to track execution IDs:

```typescript
export default {
  async scheduled(controller, env, ctx) {
    const executionId = `${controller.cron}-${controller.scheduledTime}`
    const existing = await env.EXECUTIONS.get(executionId)

    if (existing) {
      console.log('Already executed, skipping')
      controller.noRetry()
      return
    }

    await env.EXECUTIONS.put(executionId, '1', { expirationTtl: 86400 }) // 24h TTL
    await performIdempotentOperation(env)
  },
}
```

### "Security Concerns"

**Problem:** `__scheduled` endpoint exposed in production allows unauthorized cron triggering  
**Cause:** Testing endpoint available in deployed Workers  
**Solution:** Block `__scheduled` in production:

```typescript
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url)

    // Block __scheduled in production
    if (url.pathname === '/__scheduled' && env.ENVIRONMENT === 'production') {
      return new Response('Not Found', { status: 404 })
    }

    return handleRequest(request, env, ctx)
  },

  async scheduled(controller, env, ctx) {
    // Your cron logic
  },
}
```

**Also:** Use `env.API_KEY` for secrets (never hardcode)

**Alternative:** Add middleware to verify request origin:

```typescript
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url)

    if (url.pathname === '/__scheduled') {
      // Check Cloudflare headers to verify internal request
      const cfRay = request.headers.get('cf-ray')
      if (!cfRay && env.ENVIRONMENT === 'production') {
        return new Response('Not Found', { status: 404 })
      }
    }

    return handleRequest(request, env, ctx)
  },

  async scheduled(controller, env, ctx) {
    // Your cron logic
  },
}
```

## Limites e cotas

| Limite                   | Grátis             | Pago               | Notas                                               |
| ------------------------ | ------------------ | ------------------ | --------------------------------------------------- |
| Gatilhos por trabalhador | 3                  | Ilimitado          | Cronogramas máximos de cron por Worker              |
| Tempo de CPU             | 10ms               | 50ms               | Pode precisar de `ctx.waitUntil()` ou Workflows     |
| Garantia de execução     | Pelo menos uma vez | Pelo menos uma vez | Possíveis duplicatas - use idempotência             |
| Atraso de propagação     | Até 15 minutos     | Até 15 minutos     | É hora de as mudanças entrarem em vigor globalmente |
| Intervalo mínimo         | 1 minuto           | 1 minuto           | Não é possível agendar com mais frequência          |
| Precisão do cron         | ±1 minuto          | ±1 minuto          | A execução pode variar ligeiramente                 |

## Testando melhores práticas

**Testes unitários:**

- Simulação de `ScheduledController`, `ExecutionContext` e ligações
- Teste cada expressão cron separadamente
- Verifique se `noRetry()` é chamado quando esperado
- Use Vitest com `@cloudflare/vitest-pool-workers` para um ambiente realista

**Testes de integração:**

- Teste via endpoint `/__scheduled` no ambiente de desenvolvimento
- Verifique a lógica de idempotência com valores `scheduledTime` duplicados
- Teste o tratamento de erros e o comportamento de nova tentativa

**Produção:** Comece com intervalos longos (`*/30 * * * *`), monitore eventos Cron por 24h, configure alertas antes de reduzir o intervalo

## Recursos

- [Documentos sobre Cron Triggers](https://developers.cloudflare.com/workers/configuration/cron-triggers/)
- [API do manipulador agendado](https://developers.cloudflare.com/workers/runtime-apis/handlers/scheduled/)
- [Fluxos de trabalho Cloudflare](https://developers.cloudflare.com/workflows/)
- [Limites de trabalhadores](https://developers.cloudflare.com/workers/platform/limits/)
- [Crontab Guru](https://crontab.guru/) - Validador
- [Vitest Pool Workers](https://github.com/cloudflare/workers-sdk/tree/main/fixtures/vitest-pool-workers-examples)
