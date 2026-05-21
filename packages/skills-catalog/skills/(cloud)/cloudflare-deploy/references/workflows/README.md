# Fluxos de trabalho Cloudflare

Aplicativos duráveis de várias etapas com novas tentativas automáticas, persistência de estado e execução de longa duração.

## O que faz

- Etapas em cadeia com lógica de repetição automática
- Persistir estado entre as etapas (minutos → semanas)
- Lidar com falhas sem perder progresso
- Aguarde eventos/aprovações externas
- Durma sem consumir recursos

**Disponível:** Planos para trabalhadores gratuitos e pagos

## Conceitos Básicos

**Workflow**: Classe estendendo `WorkflowEntrypoint` com método `run`
**Instância**: execução única com ID exclusivo e estado independente
**Etapas**: Unidades recuperáveis de forma independente via `step.do()` - chamadas de API, consultas de banco de dados, invocações de IA
**Estado**: persistido nos retornos da etapa; nome da etapa = chave de cache

## Início rápido```typescript

import { WorkflowEntrypoint, WorkflowStep, WorkflowEvent } from 'cloudflare:workers'

type Env = { MY_WORKFLOW: Workflow; DB: D1Database }
type Params = { userId: string }

export class MyWorkflow extends WorkflowEntrypoint<Env, Params> {
async run(event: WorkflowEvent<Params>, step: WorkflowStep) {
const user = await step.do('fetch user', async () => {
return await this.env.DB.prepare('SELECT \* FROM users WHERE id = ?').bind(event.params.userId).first()
})

    await step.sleep('wait 7 days', '7 days')

    await step.do('send reminder', async () => {
      await sendEmail(user.email, 'Reminder!')
    })

}
}

```
## Principais recursos

- **Durabilidade**: etapas com falha não executam novamente as etapas bem-sucedidas
- **Tentativas**: espera configurável (constante/linear/exponencial)
- **Eventos**: `waitForEvent()` para webhooks/aprovações (tempo limite: 1h → 365d)
- **Sleep**: `sleep()` / `sleepUntil()` para agendamento (máx. 365d)
- **Parallel**: `Promise.all()` para etapas simultâneas
- **Idempotência**: padrões de verificação e execução

## Ordem de leitura

**Primeiros passos:** configuração.md → api.md → padrões.md
**Solução de problemas:** gotchas.md

## Nesta referência

- [configuration.md](./configuration.md) - configuração do wrangler.jsonc, configuração da etapa, ligações
- [api.md](./api.md) - APIs de etapas, gerenciamento de instâncias, suspensão/parâmetros
- [patterns.md](./patterns.md) - Fluxos de trabalho comuns, testes, orquestração
- [gotchas.md](./gotchas.md) - Tempos limite, limites, estratégias de depuração

## Veja também

- [durable-objects](../durable-objects/) - Abordagem alternativa com estado
- [queues](../queues/) - Fluxos de trabalho orientados por mensagens
- [workers](../workers/) – Ponto de entrada para instâncias de fluxo de trabalho
```
