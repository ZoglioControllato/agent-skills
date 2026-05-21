# Trabalhadores Cloudflare para plataformas

Plataforma multilocatário com execução isolada de código do cliente em escala.

## Casos de uso

- SaaS multilocatário executando código do cliente
- Execução de código gerado por IA em sandboxes seguras
- Plataformas programáveis com computação isolada
- Funções de borda/plataformas sem servidor
- Construtores de sites com conteúdo estático + dinâmico
- Implantação ilimitada de aplicativos em escala

**NÃO para Workers em geral** - apenas para arquitetura Workers for Platforms.

## Início rápido

**Implantação com um clique:** [Platform Starter Kit](https://github.com/cloudflare/workers-for-platforms-example) implanta a configuração completa do WfP com namespace de despacho, trabalhador de despacho e exemplo de trabalhador de usuário.

[![Implantar no Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/cloudflare/workers-for-platforms-example)

**Configuração manual:** Consulte [configuration.md](./configuration.md) para criação de namespace e configuração do trabalhador de despacho.

## Principais recursos

- Trabalhadores ilimitados por namespace (sem limites de script)
- Isolamento automático de inquilinos
- Limites personalizados de CPU/subsolicitação por cliente
- Roteamento de nome de host (subdomínios/domínios personalizados)
- Controle de saída/entrada
- Suporte a ativos estáticos
- Tags para operações em massa

## Arquitetura

**4 componentes:**

1. **Dispatch Namespace** - Contêiner para Workers de clientes ilimitados, isolamento automático (modo não confiável por padrão - sem acesso request.cf, sem cache compartilhado)
2. **Dynamic Dispatch Worker** – Ponto de entrada, roteia solicitações, impõe a lógica da plataforma (autenticação, limites, validação)
3. **User Workers** – Código do cliente em sandboxes isolados, implantados por API, ligações opcionais (KV/D1/R2/DO)
4. **Outbound Worker** (opcional) - Intercepta busca externa, controla a saída, registra subsolicitações (bloqueia a API connect() do soquete TCP)

**Fluxo de solicitação:**

```
Request → Dispatch Worker → Determines user Worker → env.DISPATCHER.get("customer")
→ User Worker executes (Outbound Worker for external fetch) → Response → Dispatch Worker → Client
```

## Árvores de Decisão

### Quando usar trabalhadores para plataformas```

Need to run code?
├─ Your code only → Regular Workers
├─ Customer/AI code → Workers for Platforms
└─ Untrusted code in sandbox → Workers for Platforms OR Sandbox API

````
### Seleção de estratégia de roteamento```
Hostname routing needed?
├─ Subdomains only (*.saas.com) → `*.saas.com/*` route + subdomain extraction
├─ Custom domains → `*/*` wildcard + Cloudflare for SaaS + KV/metadata routing
└─ Path-based (/customer/app) → Any route + path parsing
````

### Seleção do modo de isolamento```

Worker mode?
├─ Running customer code → Untrusted (default)
├─ Need request.cf geolocation → Trusted mode
├─ Internal platform, controlled code → Trusted mode with cache key prefixes
└─ Maximum isolation → Untrusted + unique resources per customer

```
## Nesta referência

| Arquivo | Finalidade | Quando ler |
| -------------------------------------- | -------------------------------------------------------- | ---------------------------------- |
| [configuração.md](./configuration.md) | Configuração do namespace, configuração do trabalhador de despacho | Configuração inicial, alteração de limites |
| [api.md](./api.md) | API de trabalhador de usuário, API de despacho, trabalhador de saída | Implantando trabalhadores, integração SDK |
| [padrões.md](./padrões.md) | Multilocação, roteamento e controle de saída | Arquitetura de planejamento, dimensionamento |
| [gotchas.md](./gotchas.md) | Limites, questões de isolamento, melhores práticas | Depuração, preparação de produção |

## Veja também

- [workers](../workers/) - Documentação de tempo de execução do Core Workers
- [durable-objects](../durable-objects/) - Padrões multilocatários com estado
- [sandbox](../sandbox/) - Alternativa para execução de código não confiável
- [Arquitetura de referência: plataformas programáveis](https://developers.cloudflare.com/reference-architecture/diagrams/serverless/programmable-platforms/)
- [Arquitetura de referência: plataforma de codificação AI Vibe](https://developers.cloudflare.com/reference-architecture/diagrams/ai/ai-vibe-coding-platform/)
```
