# Integração com SDK do AI Gateway

## Vercel AI SDK (recomendado)

```typescript
import { createAiGateway } from 'ai-gateway-provider'
import { createOpenAI } from '@ai-sdk/openai'
import { generateText } from 'ai'

const gateway = createAiGateway({
  accountId: process.env.CF_ACCOUNT_ID,
  gateway: process.env.CF_GATEWAY_ID,
  apiKey: process.env.CF_API_TOKEN, // Opcional para gateways autenticados
})

const openai = createOpenAI({ apiKey: process.env.OPENAI_API_KEY })

// Modelo único
const { text } = await generateText({
  model: gateway(openai('gpt-4o')),
  prompt: 'Hello',
})

// Array de fallback automático
const { text } = await generateText({
  model: gateway([openai('gpt-4o'), anthropic('claude-sonnet-4-5'), openai('gpt-4o-mini')]),
  prompt: 'Complex task',
})
```

### Opções

```typescript
model: gateway(openai('gpt-4o'), {
  cacheKey: 'my-key',
  cacheTtl: 3600,
  metadata: { userId: 'u123', team: 'eng' }, // Máx. 5 entradas
  retries: { maxAttempts: 3, backoff: 'exponential' },
})
```

## OpenAI SDK

```typescript
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: `https://gateway.ai.cloudflare.com/v1/${accountId}/${gatewayId}/openai`,
  defaultHeaders: { 'cf-aig-authorization': `Bearer ${cfToken}` },
})

// API unificada — troque provedor via nome do modelo
model: 'openai/gpt-4o' // ou 'anthropic/claude-sonnet-4-5'
```

## Anthropic SDK

```typescript
const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
  baseURL: `https://gateway.ai.cloudflare.com/v1/${accountId}/${gatewayId}/anthropic`,
  defaultHeaders: { 'cf-aig-authorization': `Bearer ${cfToken}` },
})
```

## Binding Workers AI

```toml
# wrangler.toml
[ai]
binding = "AI"
[[ai.gateway]]
id = "my-gateway"
```

```typescript
await env.AI.run('@cf/meta/llama-3-8b-instruct',
  { messages: [...] },
  { gateway: { id: 'my-gateway', metadata: { userId: '123' } } }
);
```

## LangChain / LlamaIndex

```typescript
// Padrão OpenAI SDK com baseURL custom
new ChatOpenAI({
  configuration: {
    baseURL: `https://gateway.ai.cloudflare.com/v1/${accountId}/${gatewayId}/openai`,
  },
})
```

## HTTP / cURL

```bash
curl https://gateway.ai.cloudflare.com/v1/{account}/{gateway}/openai/chat/completions \
  -H "Authorization: Bearer $OPENAI_KEY" \
  -H "cf-aig-authorization: Bearer $CF_TOKEN" \
  -H "cf-aig-metadata: {\"userId\":\"123\"}" \
  -d '{"model":"gpt-4o","messages":[...]}'
```

## Referência de headers

| Header                 | Finalidade                  |
| ---------------------- | --------------------------- |
| `cf-aig-authorization` | Token de auth do gateway    |
| `cf-aig-metadata`      | Objeto JSON (máx. 5 chaves) |
| `cf-aig-cache-ttl`     | TTL do cache em segundos    |
| `cf-aig-skip-cache`    | `true` para ignorar cache   |
