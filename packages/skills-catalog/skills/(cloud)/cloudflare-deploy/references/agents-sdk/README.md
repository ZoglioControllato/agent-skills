# Cloudflare Agents SDK

O Cloudflare Agents SDK permite criar agentes com IA sobre Durable Objects, com estado, WebSockets, SQL, agendamento e integração com IA.

## Valor principal

Crie agentes de IA com estado, distribuídos globalmente, com memória persistente, conexões em tempo real, tarefas agendadas e fluxos assíncronos.

## Quando usar

- Estado persistente + memória necessários
- Conexões WebSocket em tempo real
- Fluxos de longa duração (minutos/horas)
- Interfaces de chat com modelos de IA
- Tarefas agendadas/recorrentes com estado
- Consultas ao banco com estado do agente

## Que tipo de agente?

| Caso de uso                   | Classe        | Principais recursos                                  |
| ----------------------------- | ------------- | ---------------------------------------------------- |
| Interface de chat com IA      | `AIChatAgent` | Stream automático, ferramentas, histórico, retomável |
| Provedor de ferramentas MCP   | `Agent` + MCP | Expõe ferramentas para sistemas de IA                |
| Lógica/roteamento customizado | `Agent`       | Controle total, WebSockets, e-mail, SQL              |
| Colaboração em tempo real     | `Agent`       | Estado WebSocket, broadcasts                         |
| Processamento de e-mail       | `Agent`       | Handler `onEmail()`                                  |

## Início rápido

**Agente de chat com IA:**

```typescript
import { AIChatAgent } from 'agents'
import { openai } from '@ai-sdk/openai'

export class ChatAgent extends AIChatAgent<Env> {
  async onChatMessage(onFinish) {
    return this.streamText({
      model: openai('gpt-4'),
      messages: this.messages,
      onFinish,
    })
  }
}
```

**Agente base:**

```typescript
import { Agent } from 'agents'

export class MyAgent extends Agent<Env> {
  onStart() {
    this.sql`CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY)`
  }

  async onRequest(request: Request) {
    return Response.json({ state: this.state })
  }
}
```

## Ordem de leitura

| Tarefa                   | Arquivos para ler                             |
| ------------------------ | --------------------------------------------- |
| Início rápido            | Só o README                                   |
| Construir chat           | README → api.md (AIChatAgent) → patterns.md   |
| Configurar projeto       | README → configuration.md                     |
| Frontend React           | README → api.md (Client Hooks) → patterns.md  |
| Servidor MCP             | api.md (MCP) → patterns.md                    |
| Tarefas em segundo plano | api.md (Scheduling, Task Queue) → patterns.md |
| Depurar problemas        | gotchas.md                                    |

## Pontos de entrada do pacote

| Import            | Finalidade                                    |
| ----------------- | --------------------------------------------- |
| `agents`          | Classes Agent no servidor, ciclo de vida      |
| `agents/react`    | Hook `useAgent()` para conexões WebSocket     |
| `agents/ai-react` | Hook `useAgentChat()` para UIs de chat com IA |

## Nesta referência

- [configuration.md](./configuration.md) — setup do SDK, configuração do Wrangler, roteamento
- [api.md](./api.md) — classes Agent, ciclo de vida, hooks no cliente
- [patterns.md](./patterns.md) — fluxos comuns, boas práticas
- [gotchas.md](./gotchas.md) — problemas frequentes, limites

## Ver também

- durable-objects — infraestrutura do agente
- d1 — integração com banco externo
- workers-ai — integração com modelos de IA
- vectorize — busca vetorial para padrões RAG
