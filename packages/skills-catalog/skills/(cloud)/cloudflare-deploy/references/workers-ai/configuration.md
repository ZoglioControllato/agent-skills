# Configuração de IA de trabalhadores

## wrangler.jsonc

```jsonc
{
  "name": "my-ai-worker",
  "main": "src/index.ts",
  "compatibility_date": "2024-01-01",
  "ai": {
    "binding": "AI",
  },
}
```

##TypeScript

```bash
npm install --save-dev @cloudflare/workers-types
```

```typescript
interface Env {
  AI: Ai
}

export default {
  async fetch(request: Request, env: Env) {
    const response = await env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
      messages: [{ role: 'user', content: 'Hello' }],
    })
    return Response.json(response)
  },
}
```

##Desenvolvimento Local

```bash
wrangler dev --remote  # Required for AI - no local inference
```

##API REST

````typescript
const response = await fetch(
  `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/ai/run/@cf/meta/llama-3.1-8b-instruct`,
  {
    method: 'POST',
    headers: { Authorization: `Bearer ${API_TOKEN}` },
    body: JSON.stringify({ messages: [{ role: 'user', content: 'Hello' }] }),
  },
)
```Crie um token de API em: dash.cloudflare.com/profile/api-tokens (Workers AI – permissão de leitura)

## Compatibilidade com SDK

**SDK OpenAI:**
```typescript
import OpenAI from 'openai'
const client = new OpenAI({
  apiKey: env.CLOUDFLARE_API_TOKEN,
  baseURL: `https://api.cloudflare.com/client/v4/accounts/${env.ACCOUNT_ID}/ai/v1`,
})
````

##Configuração de vários modelos

```typescript
const MODELS = {
  chat: '@cf/meta/llama-3.1-8b-instruct',
  embed: '@cf/baai/bge-base-en-v1.5',
  image: '@cf/stabilityai/stable-diffusion-xl-base-1.0',
}
```

##Configuração RAG (com vetorização)

```jsonc
{
  "ai": { "binding": "AI" },
  "vectorize": {
    "bindings": [{ "binding": "VECTORIZE", "index_name": "embeddings-index" }],
  },
}
```

##Solução de problemas

| Erro                          | Correção                                   |
| ----------------------------- | ------------------------------------------ |
| `env.AI é indefinido`         | Verifique a ligação `ai` em wrangler.jsonc |
| IA local não funciona         | Use `wrangler dev --remote`                |
| Tipo 'Ai' não encontrado      | Instale `@cloudflare/workers-types`        |
| Erro de pacote @cloudflare/ai | Não instale - use ligação nativa           |
