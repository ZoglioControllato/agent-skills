# Referência de habilidades do Cloudflare Workers Playground

## Visão geral

O Cloudflare Workers Playground é um sandbox baseado em navegador para experimentar, testar e implantar instantaneamente o Cloudflare Workers sem autenticação ou configuração. Esta habilidade fornece padrões, APIs e práticas recomendadas especificamente para o desenvolvimento do Workers Playground.

**URL:** [workers.cloudflare.com/playground](https://workers.cloudflare.com/playground)

## ⚠️ Restrições do playground

**Playground NÃO é equivalente à produção:**

- ✅ Tempo de execução Real Workers, testes instantâneos, URLs compartilháveis
- ❌ Sem TypeScript (somente JavaScript)
- ❌ Sem ligações (KV, D1, R2, Objetos Duráveis)
- ❌ Sem variáveis de ambiente ou segredos
- ❌ Apenas módulos ES (sem formato Service Worker)
- ⚠️ Safari quebrado (use Chrome/Firefox)

**Para produção:** Use a CLI `wrangler`. Playground é para prototipagem rápida.

## Início rápido

Trabalhador Mínimo:```javascript
export default {
async fetch(request, env, ctx) {
return new Response('Hello World')
},
}

````

JSON API:

```javascript
export default {
  async fetch(request, env, ctx) {
    const data = { message: 'Hello', timestamp: Date.now() }
    return Response.json(data)
  },
}
````

Proxy with modification:

```javascript
export default {
  async fetch(request, env, ctx) {
    const response = await fetch('https://example.com')
    const modified = new Response(response.body, response)
    modified.headers.set('X-Custom-Header', 'added-by-worker')
    return modified
  },
}
```

Import from CDN:

```javascript
import { Hono } from 'https://esm.sh/hono@3'

export default {
  async fetch(request) {
    const app = new Hono()
    app.get('/', (c) => c.text('Hello Hono!'))
    return app.fetch(request)
  },
}
```

## Ordem de leitura

1. **[configuration.md](configuration.md)** - Comece aqui: configuração do playground, restrições, implantação
2. **[api.md](api.md)** - APIs principais: solicitação, resposta, ExecutionContext, busca, cache
3. **[patterns.md](patterns.md)** - Casos de uso comuns: roteamento, proxy, testes A/B, código de vários módulos
4. **[gotchas.md](gotchas.md)** - Solução de problemas: erros, problemas de navegador, limites, práticas recomendadas

## Nesta referência

- **[configuration.md](configuration.md)** - Instalação, implantação, configuração
- **[api.md](api.md)** - endpoints de API, métodos, interfaces
- **[patterns.md](patterns.md)** - Padrões comuns, casos de uso, exemplos
- **[gotchas.md](gotchas.md)** - Solução de problemas, práticas recomendadas, limitações

## Principais recursos

**Não é necessária nenhuma configuração:**

- Abra o URL e comece a codificar
- Sem CLI, sem conta, sem arquivos de configuração
- O código é executado em tempo de execução real do Cloudflare Workers

**Visualização instantânea:**

- Painel de visualização ao vivo com guia do navegador ou testador HTTP
- Recarga automática em alterações de código
- Integração DevTools (clique com o botão direito → Inspecionar)

**Compartilhar e implantar:**

- Copiar Link gera URL compartilhável permanente
- O botão Implantar é publicado na produção em aproximadamente 30 segundos
- Obtenha o subdomínio `*.workers.dev` imediatamente

## Casos de uso comuns

- **Desenvolvimento de API:** Teste endpoints antes da configuração do wrangler
- **Trabalhadores de aprendizagem:** Experimente APIs sem ambiente local
- **Prototipagem:** POCs rápidos para lógica de borda
- **Exemplos de compartilhamento:** Gere links compartilháveis para relatórios de bugs ou demonstrações
- **Testes de estrutura:** Importação de CDN (Hono, itty-router, etc.)

## Limitações vs Produção

| Recurso                 | Parque infantil       | Produção (wrangler)          |
| ----------------------- | --------------------- | ---------------------------- |
| Idioma                  | Somente JavaScript    | JS + TypeScript              |
| Encadernações           | Nenhum                | KV, D1, R2, DO, AI, etc.     |
| Variações ambientais    | Nenhum                | Suporte total                |
| Formato do módulo       | Somente ES            | ES + Trabalhador de Serviços |
| Tempo de CPU            | 10ms (plano gratuito) | 10ms grátis / 50ms pagos     |
| Domínios personalizados | Não                   | Sim                          |
| Análise                 | Não                   | Sim                          |

## Veja também

- [Documentos do Cloudflare Workers](https://developers.cloudflare.com/workers/)
- [Exemplos de trabalhadores](https://developers.cloudflare.com/workers/examples/)
- [CLI do Wrangler](https://developers.cloudflare.com/workers/wrangler/)
- [Referência da API Workers](https://developers.cloudflare.com/workers/runtime-apis/)
