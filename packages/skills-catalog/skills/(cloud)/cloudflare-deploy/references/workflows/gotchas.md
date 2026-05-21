# Dicas e depuração

## Erros Comuns

### "Tempo limite da etapa"

**Causa:** A execução da etapa excede o tempo limite padrão de 10 minutos ou o tempo limite configurado
**Solução:** Defina o tempo limite personalizado com `step.do('long operação', {timeout: '30 minutos'}, async () => {...})` ou aumente o limite de CPU em wrangler.jsonc (máximo de 5 minutos de tempo de CPU)

### "Tempo limite de waitForEvent"

**Causa:** Evento não recebido dentro do período de tempo limite (padrão 24h, máximo 365d)
**Solução:** Envolva try-catch para lidar com o tempo limite normalmente e prosseguir com o comportamento padrão

### "Nomes de etapas não determinísticos"

**Causa:** Usar valores dinâmicos como `Date.now()` em nomes de etapas causa problemas de reprodução
**Solução:** use valores determinísticos como `event.instanceId` para nomes de etapas

### "Estado perdido em variáveis"

**Causa:** Uso de variáveis locais ou de nível de módulo para armazenar o estado que é perdido na hibernação
**Solução:** Retorna valores de `step.do()` que são persistidos automaticamente: `const total = await step.do('step 1', async () => 10)`

### "Condicionais Não Determinísticas"

**Causa:** Uso de lógica não determinística (como `Date.now()`) fora das etapas em condicionais
**Solução:** Mova operações não determinísticas dentro das etapas: `const isLate = await step.do('check', async () => Date.now() > expired)`

### "Retornos de grandes etapas excedendo o limite"

**Causa:** Retornando dados >1 MiB da etapa
**Solução:** Armazene dados grandes em R2 e retorne apenas referência: `{ key: 'r2-object-key' }`

### "A etapa excedeu o limite da CPU, mas foi executada por <30s"

**Causa:** Confusão entre o tempo de CPU (computação ativa) e o tempo do relógio (inclui esperas de E/S)
**Solução:** Solicitações de rede, consultas de banco de dados e suspensões não contam para a CPU. Limite de 30s = 30s de processamento ativo

### "Violação de idempotência"

**Causa:** operações Step não são idempotentes, causando cobranças ou ações duplicadas na nova tentativa
**Solução:** Verifique se a operação já foi concluída antes de executar (por exemplo, verifique se o cliente já foi cobrado)

### "Colisão de ID da instância"

**Causa:** Reutilização de IDs de instância causando conflitos
**Solução:** Use IDs exclusivos com carimbo de data e hora: `await env.MY_WORKFLOW.create({ id: \`${userId}-${Date.now()}\`, params: {} })`

### "Os dados da instância desapareceram após a conclusão"

**Causa:** Instâncias concluídas/com erros são excluídas automaticamente após o período de retenção (3 dias grátis/30 dias pagos)
**Solução:** exporte dados críticos para KV/R2/D1 antes da conclusão do fluxo de trabalho

### "Falta aguardar em step.do"

**Causa:** Esquecer de aguardar step.do() causando comportamento de disparar e esquecer
**Solução:** Sempre aguarde operações de etapa: `await step.do('task', ...)`

## Limites

| Limite                              | Grátis     | Pago                      | Notas                                                             |
| ----------------------------------- | ---------- | ------------------------- | ----------------------------------------------------------------- |
| CPU por etapa                       | 10ms       | 30s (padrão), 5min (máx.) | Definido via `limits.cpu_ms` em wrangler.jsonc                    |
| Estado da etapa                     | 1 MiB      | 1 MiB                     | Valor de retorno por etapa                                        |
| Estado da instância                 | 100 MB     | 1 GB                      | Estado total por instância de fluxo de trabalho                   |
| Etapas por fluxo de trabalho        | 1.024      | 1.024                     | `step.sleep()` não conta                                          |
| Execuções por dia                   | 100 mil    | Ilimitado                 | Limite diário de execução                                         |
| Instâncias simultâneas              | 25         | 10k                       | Fluxos de trabalho simultâneos máximos; estado de espera excluído |
| Instâncias em fila                  | 100 mil    | 1 milhão                  | Máximo de instâncias de fluxo de trabalho em fila                 |
| Subsolicitações por etapa           | 50         | 1.000                     | Máximo de pedidos de saída por etapa                              |
| Retenção estatal                    | 3 dias     | 30 dias                   | Quanto tempo as instâncias concluídas são mantidas                |
| Padrão de tempo limite da etapa     | 10 minutos | 10 minutos                | Por tentativa                                                     |
| padrão de tempo limite waitForEvent | 24h        | 24h                       | Máximo 365 dias                                                   |
| tempo limite máximo de waitForEvent | 365 dias   | 365 dias                  | Tempo máximo de espera                                            |

**Observação:** Instâncias no estado `waiting` (de `step.sleep` ou `step.waitForEvent`) não contam para o limite de instâncias simultâneas, permitindo milhões de fluxos de trabalho inativos.

## Preços

| Métrica       | Grátis         | Pago                                         | Notas                                                            |
| ------------- | -------------- | -------------------------------------------- | ---------------------------------------------------------------- |
| Solicitações  | 100k/dia       | 10 milhões/mês + $ 0,30/m                    | Invocações de fluxo de trabalho                                  |
| Tempo de CPU  | 10ms/invocação | 30 milhões de CPU-ms/mês + US$ 0,02/M CPU-ms | Uso real da CPU                                                  |
| Armazenamento | 1 GB           | 1 GB/mês + US$ 0,20/GB-mês                   | Todas as instâncias (em execução/com erros/suspensas/concluídas) |

## Referências

- [Documentos oficiais](https://developers.cloudflare.com/workflows/)
- [Guia de primeiros passos](https://developers.cloudflare.com/workflows/get-started/guide/)
- [API Workers](https://developers.cloudflare.com/workflows/build/workers-api/)
- [API REST](https://developers.cloudflare.com/api/resources/workflows/)
- [Exemplos](https://developers.cloudflare.com/workflows/examples/)
- [Limites](https://developers.cloudflare.com/workflows/reference/limits/)
- [Preços](https://developers.cloudflare.com/workflows/reference/pricing/)

Consulte: [README.md](./README.md), [configuration.md](./configuration.md), [api.md](./api.md), [patterns.md](./patterns.md)
