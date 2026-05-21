# Cloudflare AI Gateway

Orientação para implementar o Cloudflare AI Gateway — um gateway universal para provedores de modelos de IA, com análise, cache, limitação de taxa e roteamento.

## Quando usar esta referência

- Configurar o AI Gateway para qualquer provedor (OpenAI, Anthropic, Workers AI etc.)
- Implementar cache, rate limiting ou retry/fallback de requisição
- Configurar roteamento dinâmico com A/B ou fallbacks de modelo
- Gerenciar chaves de API com segurança (BYOK)
- Adicionar recursos de segurança (guardrails, DLP)
- Configurar observabilidade com logs e metadados customizados
- Depurar requisições do AI Gateway ou otimizar configurações

## Início rápido

**Qual é o seu setup?**

- **Vercel AI SDK** → Padrão 1 (recomendado) — veja [sdk-integration.md](./sdk-integration.md)
- **OpenAI SDK** → Padrão 2 — veja [sdk-integration.md](./sdk-integration.md)
- **Cloudflare Worker + Workers AI** → Padrão 3 — veja [sdk-integration.md](./sdk-integration.md)
- **HTTP direto (qualquer linguagem)** → Padrão 4 — veja [configuration.md](./configuration.md)
- **Framework (LangChain etc.)** → Veja [sdk-integration.md](./sdk-integration.md)

## Padrão 1: Vercel AI SDK (recomendado)

Padrão atual usando o pacote oficial `ai-gateway-provider` com fallbacks automáticos.

```typescript
import { createAiGateway } from 'ai-gateway-provider'
import { createOpenAI } from '@ai-sdk/openai'
import { generateText } from 'ai'

const gateway = createAiGateway({
  accountId: process.env.CF_ACCOUNT_ID,
  gateway: process.env.CF_GATEWAY_ID,
})

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Modelo único
const { text } = await generateText({
  model: gateway(openai('gpt-4o')),
  prompt: 'Hello',
})

// Array de fallback automático
const { text } = await generateText({
  model: gateway([
    openai('gpt-4o'), // Tenta primeiro
    anthropic('claude-sonnet-4-5'), // Fallback
  ]),
  prompt: 'Hello',
})
```

**Instalar:** `npm install ai-gateway-provider ai @ai-sdk/openai @ai-sdk/anthropic`

## Padrão 2: OpenAI SDK

Substituto direto da API OpenAI com suporte multi-provedor.

```typescript
import OpenAI from 'openai'

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: `https://gateway.ai.cloudflare.com/v1/${accountId}/${gatewayId}/compat`,
  defaultHeaders: {
    'cf-aig-authorization': `Bearer ${cfToken}`, // Gateways autenticados
  },
})

// Troque o provedor mudando o formato do modelo: {provider}/{model}
const response = await client.chat.completions.create({
  model: 'openai/gpt-4o', // ou 'anthropic/claude-sonnet-4-5'
  messages: [{ role: 'user', content: 'Hello!' }],
})
```

## Padrão 3: Binding Workers AI

Para Cloudflare Workers com Workers AI.

```typescript
export default {
  async fetch(request, env, ctx) {
    const response = await env.AI.run(
      '@cf/meta/llama-3-8b-instruct',
      { messages: [{ role: 'user', content: 'Hello!' }] },
      {
        gateway: {
          id: 'my-gateway',
          metadata: { userId: '123', team: 'engineering' },
        },
      },
    )

    return Response.json(response)
  },
}
```

## Referência rápida de headers

| Header                 | Finalidade       | Exemplo          | Notas                                   |
| ---------------------- | ---------------- | ---------------- | --------------------------------------- |
| `cf-aig-authorization` | Auth do gateway  | `Bearer {token}` | Obrigatório em gateways autenticados    |
| `cf-aig-metadata`      | Rastreamento     | `{"userId":"x"}` | Máx. 5 entradas, estrutura plana        |
| `cf-aig-cache-ttl`     | Duração do cache | `3600`           | Segundos, mín 60, máx 2592000 (30 dias) |
| `cf-aig-skip-cache`    | Ignorar cache    | `true`           | -                                       |
| `cf-aig-cache-key`     | Chave de cache   | `my-key`         | Única por resposta esperada             |
| `cf-aig-collect-log`   | Pular log        | `false`          | Padrão: true                            |
| `cf-aig-cache-status`  | Hit/miss         | Só na resposta   | `HIT` ou `MISS`                         |

## Nesta referência

| Arquivo                                    | Finalidade                                                   |
| ------------------------------------------ | ------------------------------------------------------------ |
| [sdk-integration.md](./sdk-integration.md) | Vercel AI SDK, OpenAI SDK, padrões com binding Workers       |
| [configuration.md](./configuration.md)     | Dashboard, wrangler, tokens de API                           |
| [features.md](./features.md)               | Cache, rate limits, guardrails, DLP, BYOK, billing unificado |
| [dynamic-routing.md](./dynamic-routing.md) | Fallbacks, A/B, roteamento condicional                       |
| [troubleshooting.md](./troubleshooting.md) | Debug, erros, observabilidade, armadilhas                    |

## Ordem de leitura

| Tarefa               | Arquivos                                            |
| -------------------- | --------------------------------------------------- |
| Primeira config      | README + [configuration.md](./configuration.md)     |
| Integração SDK       | README + [sdk-integration.md](./sdk-integration.md) |
| Habilitar cache      | README + [features.md](./features.md)               |
| Configurar fallbacks | README + [dynamic-routing.md](./dynamic-routing.md) |
| Depurar erros        | README + [troubleshooting.md](./troubleshooting.md) |

## Arquitetura

O AI Gateway atua como proxy entre seu app e os provedores de IA:

```
Seu app → AI Gateway → Provedor de IA (OpenAI, Anthropic etc.)
         ↓
    Analytics, cache, rate limiting, logging
```

**Padrões de URL principais:**

- API unificada (compatível com OpenAI): `https://gateway.ai.cloudflare.com/v1/{account_id}/{gateway_id}/compat/chat/completions`
- Por provedor: `https://gateway.ai.cloudflare.com/v1/{account_id}/{gateway_id}/{provider}/{endpoint}`
- Rotas dinâmicas: use o nome da rota em vez do modelo: `dynamic/{nome-da-rota}`

## Tipos de gateway

1. **Não autenticado:** acesso aberto (não recomendado em produção)
2. **Autenticado:** exige o header `cf-aig-authorization` com token de API da Cloudflare (recomendado)

## Opções de autenticação do provedor

1. **Unified billing:** usar a cobrança do AI Gateway (modo sem chave do provedor)
2. **BYOK (armazenar chaves):** guardar chaves no dashboard da Cloudflare
3. **Headers da requisição:** incluir chave do provedor em cada pedido

## Skills relacionadas

- [Workers AI](../workers-ai/README.md) — detalhes de `env.AI.run()`
- [Agents SDK](../agents-sdk/README.md) — padrões com estado
- [Vectorize](../vectorize/README.md) — RAG com embeddings

## Recursos

- [Documentação oficial](https://developers.cloudflare.com/ai-gateway/)
- [Referência de API](https://developers.cloudflare.com/api/resources/ai_gateway/)
- [Guias de provedores](https://developers.cloudflare.com/ai-gateway/usage/providers/)
- [Comunidade no Discord](https://discord.cloudflare.com)
