# Referência da API de IA de trabalhadores

## Método principal

```typescript
const response = await env.AI.run(model, input)
```

##Geração de Texto

```typescript
const result = await env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
  messages: [
    { role: 'system', content: 'You are helpful' },
    { role: 'user', content: 'Hello' },
  ],
  temperature: 0.7, // 0-1
  max_tokens: 100,
})
console.log(result.response)
```

**Transmissão:**

```typescript
const stream = await env.AI.run(model, { messages, stream: true })
return new Response(stream, { headers: { 'Content-Type': 'text/event-stream' } })
```

##Incorporações

```typescript
const result = await env.AI.run('@cf/baai/bge-base-en-v1.5', {
  text: ['Query', 'Doc 1', 'Doc 2'], // Batch for efficiency
})
const [queryEmbed, doc1Embed, doc2Embed] = result.data // 768-dim vectors
```

##Chamada de função

```typescript
const tools = [
  {
    type: 'function',
    function: {
      name: 'getWeather',
      description: 'Get weather for location',
      parameters: {
        type: 'object',
        properties: { location: { type: 'string' } },
        required: ['location'],
      },
    },
  },
]

const response = await env.AI.run(model, { messages, tools })
if (response.tool_calls) {
  const args = JSON.parse(response.tool_calls[0].function.arguments)
  // Execute function, send result back
}
```

##Geração de imagem

```typescript
const image = await env.AI.run('@cf/stabilityai/stable-diffusion-xl-base-1.0', {
  prompt: 'Mountain sunset',
  num_steps: 20, // 1-20
  guidance: 7.5, // 1-20
})
return new Response(image, { headers: { 'Content-Type': 'image/png' } })
```

##Reconhecimento de fala

```typescript
const audioArray = Array.from(new Uint8Array(await request.arrayBuffer()))
const result = await env.AI.run('@cf/openai/whisper', { audio: audioArray })
console.log(result.text)
```

##Tradução

```typescript
const result = await env.AI.run('@cf/meta/m2m100-1.2b', {
  text: 'Hello',
  source_lang: 'en',
  target_lang: 'es',
})
console.log(result.translated_text)
```

##API REST

```bash
curl https://api.cloudflare.com/client/v4/accounts/{account_id}/ai/run/@cf/meta/llama-3.1-8b-instruct \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"messages":[{"role":"user","content":"Hello"}]}'
```

##Códigos de erro

| Código | Significado           | Correção                       |
| ------ | --------------------- | ------------------------------ |
| 7502   | Modelo não encontrado | Verifique a ortografia         |
| 7504   | Falha na validação    | Verifique o esquema de entrada |
| 7505   | Taxa limitada         | Reduzir taxa ou atualizar      |
| 7506   | Contexto excedido     | Reduza o tamanho da entrada    |

## Dicas de desempenho

1. **Incorporações em lote** - solicitação única para vários textos
2. **Transmita respostas longas** - reduza a latência percebida
3. **Aceitar partidas a frio** - primeira solicitação ~1-3s, subsequentes ~100-500ms
