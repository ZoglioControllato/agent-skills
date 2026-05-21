# Miniflare

Simulador local para desenvolvimento/teste de Cloudflare Workers. Executa Workers na sandbox do Workerd implementando APIs de tempo de execução - sem necessidade de Internet.

## Recursos

- Completo: KV, objetos duráveis, R2, D1, WebSockets, filas
- Totalmente local: teste sem internet, recarga instantânea
- Nativo do TypeScript: registro detalhado, mapas de origem
- Testes avançados: despache eventos sem HTTP, simule conexões de Worker

## Quando usar

**Árvore de decisão para testar trabalhadores:**

```
Precisa testar trabalhadores?
│
├─ Testes unitários apenas para lógica de negócios?
│ └─ getPlatformProxy (Vitest/Jest) → [patterns.md](./patterns.md#getplatformproxy)
│ Rápido, sem HTTP, acesso de ligação direta
│
├─ Testes de integração com tempo de execução completo?
│ ├─ Trabalhador Único?
│ │ └─ API Miniflare → [Início rápido](#quick-start)
│ │ Controle total, acesso programático
│ │
│ ├─ Vários trabalhadores + ligações de serviço?
│ │ └─ Matriz de trabalhadores Miniflare → [configuration.md](./configuration.md#multiple-workers)
│ │ Armazenamento compartilhado, chamadas entre funcionários
│ │
│ └─ Integração do executor de teste Vitest?
│ └─ vitest-pool-workers → [patterns.md](./patterns.md#vitest-pool-workers)
│ Ambiente de trabalho completo em Vitest
│
└─ Servidor de desenvolvimento local?
└─ desenvolvedor wrangler (não Miniflare)
Recarga a quente, configuração automática
```

**Use Miniflare para:**

- Testes de integração com tempo de execução completo do Worker
- Testando ligações/armazenamento localmente
- Vários trabalhadores com ligações de serviço
- Despacho programático de eventos (busca, fila, agendado)

**Use getPlatformProxy para:**

- Testes unitários rápidos de lógica de negócios
- Teste sem sobrecarga HTTP
- Ambientes Vitest/Jest

**Use o Wrangler para:**

- Fluxo de trabalho de desenvolvimento local
- Implantações de produção

## Configuração```bash

npm i -D miniflare

````

Requires ES modules in `package.json`:

```json
{ "type": "module" }
````

## Quick Start

```js
import { Miniflare } from 'miniflare'

const mf = new Miniflare({
  modules: true,
  script: `
    export default {
      async fetch(request, env, ctx) {
        return new Response("Hello Miniflare!");
      }
    }
  `,
})

const res = await mf.dispatchFetch('http://localhost:8787/')
console.log(await res.text()) // Hello Miniflare!
await mf.dispose()
```

## Ordem de leitura

**Novo no Miniflare?** Comece aqui:

1. [Início rápido](#quick-start) - Executando em 2 minutos
2. [Quando usar](#when-to-use) - Escolha sua abordagem de teste
3. [patterns.md](./patterns.md) - Padrões de teste (getPlatformProxy, Vitest, node:test)
4. [configuration.md](./configuration.md) - Configurar ligações, armazenamento, vários trabalhadores

**Solução de problemas:**

- [gotchas.md](./gotchas.md) - Erros comuns e depuração

**Referência da API:**

- [api.md](./api.md) - Referência completa do método

## Veja também

- [wrangler](../wrangler/) - ferramenta CLI que incorpora Miniflare para `wrangler dev`
- [workerd](../workerd/) - Tempo de execução que alimenta o Miniflare
- [workers](../workers/) - Documentação da API de tempo de execução de trabalhadores
