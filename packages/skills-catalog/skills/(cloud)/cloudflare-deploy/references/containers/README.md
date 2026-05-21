# Referência de habilidade de contêineres Cloudflare

**APLICA-SE SOMENTE A: Cloudflare Containers - NÃO a trabalhadores gerais da Cloudflare**

Use ao trabalhar com Cloudflare Containers: implantando aplicativos conteinerizados na plataforma Workers, configurando objetos duráveis habilitados para contêiner, gerenciando o ciclo de vida do contêiner ou implementando padrões de contêiner com/sem estado.

## Status beta

⚠️ Containers está atualmente em **beta**. A API pode mudar sem aviso prévio. Sem garantias de SLA. Tipos de instância personalizados adicionados em janeiro de 2026.

## Conceitos Básicos

**Contêiner como Objeto Durável:** Cada contêiner é um Objeto Durável com identidade persistente. Acessado via `getByName(id)` ou `getRandom()`.

**Implantação de imagens:** imagens pré-buscadas globalmente. As implantações usam estratégia contínua (não instantânea como os Trabalhadores).

**Ciclo de vida:** inicialização a frio (2-3s) → em execução → tempo limite `sleepAfter` → parado. Sem escalonamento automático - balanceamento de carga manual via `getRandom()`.

**Identidade persistente, disco efêmero:** O ID do contêiner persiste, mas o disco é redefinido ao parar. Use armazenamento de objetos duráveis ​​para persistência.

## Início rápido```typescript

import { Container } from '@cloudflare/containers'

export class MyContainer extends Container {
defaultPort = 8080
sleepAfter = '30m'
}

export default {
async fetch(request: Request, env: Env) {
const container = env.MY_CONTAINER.getByName('instance-1')
await container.startAndWaitForPorts()
return container.fetch(request)
},
}

```
## Ordem de leitura

| Tarefa | Arquivos |
| --------------------------- | ------------------------------------ |
| Configurar novo projeto de contêiner | LEIA-ME → configuração.md |
| Implementar lógica de contêiner | LEIA-ME → api.md → padrões.md |
| Escolha o padrão de roteamento | padrões.md (seção de roteamento) |
| Problemas de depuração | pegadinhas.md |
| Endurecimento de produção | gotchas.md → padrões.md (ciclo de vida) |

## Árvore de decisão de roteamento

**Como as solicitações devem chegar aos contêineres?**

- **Mesmo usuário/sessão → mesmo contêiner:** Use `getByName(sessionId)` para afinidade de sessão
- **Carga distribuída sem estado:** Use `getRandom()` para balanceamento de carga
- **Trabalho por contêiner:** Use `getByName(jobId)` + gerenciamento explícito do ciclo de vida
- **Instância global única:** Use `getByName("singleton")`

## Quando usar contêineres versus trabalhadores

**Use contêineres quando:**

- Precisa de processos com estado e de longa duração (sessões, WebSockets, jogos)
- Execução de aplicativos em contêineres existentes (Node.js, Python, binários personalizados)
- Precisa de acesso ao sistema de arquivos ou dependências específicas do sistema
- Isolamento por usuário/sessão com computação dedicada

**Use trabalhadores quando:**

- Manipuladores HTTP sem estado
- É necessário iniciar a frio em menos de milissegundos
- Escalonamento automático para zero crítico
- Padrões simples de solicitação/resposta

## Nesta referência

- **[configuration.md](configuration.md)** - Configuração do Wrangler, tipos de instância, propriedades da classe Container, variáveis de ambiente, limites de conta
- **[api.md](api.md)** - API de classe de contêiner, métodos de inicialização, comunicação (HTTP/TCP/WebSocket), auxiliares de roteamento, ganchos de ciclo de vida, agendamento, inspeção de estado
- **[patterns.md](patterns.md)** - Padrões de roteamento (afinidade de sessão, balanceamento de carga, singleton), encaminhamento de WebSocket, desligamento normal, integração de fluxo de trabalho/fila
- **[gotchas.md](gotchas.md)** - Dicas críticas (WebSocket, métodos de inicialização), erros comuns com soluções, limites específicos, advertências beta

## Veja também

- [Objetos Duráveis](../durable-objects/) - Contêineres estendem Objetos Duráveis
- [Workflows](../workflows/) - Orquestrar operações de contêiner
- [Queues](../queues/) - Aciona contêineres de mensagens de fila
- [Documentos Cloudflare](https://developers.cloudflare.com/containers/)
```
