# IA de trabalhadores da Cloudflare

Orientação especializada para Cloudflare Workers AI: inferência de IA baseada em GPU sem servidor na borda.

## Visão geral

A IA dos trabalhadores fornece:

- Mais de 50 modelos pré-treinados (LLMs, embeddings, geração de imagens, conversão de fala em texto, tradução)
- Vinculação de trabalhadores nativos (sem chamadas de API externas)
- Preços pagos por uso (neurônios consumidos por inferência)
- API REST compatível com OpenAI
- Suporte de streaming para geração de texto
- Chamada de função com modelos compatíveis

**Arquitetura**: a inferência é executada na rede GPU da Cloudflare. Os modelos são carregados na primeira solicitação (inicialização a frio de 1 a 3 segundos), as solicitações subsequentes são mais rápidas.

## Início rápido```typescript

interface Env {
AI: Ai
}

export default {
async fetch(request: Request, env: Env) {
const response = await env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
messages: [{ role: 'user', content: 'What is Cloudflare?' }],
})
return Response.json(response)
},
}

````

```bash
# Setup - add binding to wrangler.jsonc
wrangler dev --remote  # Must use --remote for AI
wrangler deploy
````

## Árvore de decisão de seleção de modelo

### Geração de Texto (Chat/Conclusão)

**Prioridade de qualidade**:

- **Melhor qualidade**: `@cf/meta/llama-3.1-70b-instruct` (caro, ~2.000 neurônios)
- **Balanceado**: `@cf/meta/llama-3.1-8b-instruct` (boa qualidade, ~200 neurônios)
- **Mais rápido/mais barato**: `@cf/mistral/mistral-7b-instruct-v0.1` (~50 neurônios)

**Chamada de função**:

- Use `@cf/meta/llama-3.1-8b-instruct` ou `@cf/meta/llama-3.1-70b-instruct` (suporte de ferramenta nativa)

**Geração de código**:

- Use `@cf/deepseek-ai/deepseek-coder-6.7b-instruct` (especializado em código)

### Incorporações (pesquisa semântica/RAG)

**Texto em inglês**:

- **Melhor**: `@cf/baai/bge-large-en-v1.5` (1024 dims, mais alta qualidade)
- **Balanceado**: `@cf/baai/bge-base-en-v1.5` (768 dims, boa qualidade)
- **Rápido**: `@cf/baai/bge-small-en-v1.5` (384 escurece, qualidade inferior, mas rápido)

**Multilíngue**:

- Use `@hf/sentence-transformers/paraphrase-multilingual-minilm-l12-v2`

### Geração de imagem

- **Difusão Estável**: `@cf/stabilityai/stable-diffusion-xl-base-1.0` (~10.000 neurônios)
- **Retratos**: `@cf/lykon/dreamshaper-8-lcm` (otimizado para rostos)

### Outras tarefas

- **Fala para texto**: `@cf/openai/whisper`
- **Tradução**: `@cf/meta/m2m100-1.2b` (100 idiomas)
- **Classificação de imagem**: `@cf/microsoft/resnet-50`

## Árvore de decisão de abordagem do SDK

### Vinculação nativa (recomendado)

**Quando**: Construindo Workers/Páginas com TypeScript
**Por quê**: zero dependências externas, melhor desempenho, tipos nativos```typescript
await env.AI.run(model, input)

````

### REST API

**When**: External services, non-Workers environments, testing
**Why**: Standard HTTP, works anywhere

```bash
curl https://api.cloudflare.com/client/v4/accounts/<ACCOUNT_ID>/ai/run/@cf/meta/llama-3.1-8b-instruct \
  -H "Authorization: Bearer <API_TOKEN>" \
  -d '{"messages":[{"role":"user","content":"Hello"}]}'
````

### Vercel AI SDK Integration

**When**: Using Vercel AI SDK features (streaming UI, tool calling abstractions)  
**Why**: Unified interface across providers

```typescript
import { openai } from '@ai-sdk/openai'

const model = openai('model-name', {
  baseURL: 'https://api.cloudflare.com/client/v4/accounts/<ACCOUNT_ID>/ai/v1',
  headers: { Authorization: 'Bearer <API_TOKEN>' },
})
```

## RAG vs Geração Direta

### Use RAG (Vectorize + Workers AI) quando:

- Responder perguntas sobre documentos/dados específicos
- Precisa de precisão factual de corpus conhecido
- O contexto excede a janela do modelo (> tokens de 4K)
- Construindo bate-papo da base de conhecimento

### Use geração direta quando:

- Escrita criativa, brainstorming
- Perguntas de conhecimentos gerais
- Contexto pequeno cabe no prompt (<tokens 4K)
- Otimização de custos (RAG adiciona custos de incorporação + pesquisa vetorial)

## Limites da plataforma

| Limite             | Nível gratuito                      | Planos Pagos                              |
| ------------------ | ----------------------------------- | ----------------------------------------- |
| Neurônios/dia      | 10.000                              | Pague por uso                             |
| Limite de taxa     | Varia de acordo com o modelo        | Superior (entre em contato com o suporte) |
| Janela de contexto | Dependente do modelo (2K-8K)        | Mesmo                                     |
| Transmissão        | ✅ Suportado                        | ✅ Suportado                              |
| Chamada de função  | ✅ Suportado (modelos selecionados) | ✅ Suportado                              |

**Preço**: 10 mil neurônios gratuitos/dia e depois pague por neurônio consumido (varia de acordo com o modelo)

## Tarefas Comuns```typescript

// Streaming text generation
const stream = await env.AI.run(model, { messages, stream: true });
for await (const chunk of stream) {
console.log(chunk.response);
}

// Embeddings for RAG
const { data } = await env.AI.run('@cf/baai/bge-base-en-v1.5', {
text: ['Query text', 'Document 1', 'Document 2']
});

// Function calling
const response = await env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
messages: [{ role: 'user', content: 'What is the weather?' }],
tools: [{
type: 'function',
function: { name: 'getWeather', parameters: { ... } }
}]
});

````

## Development Workflow

```bash
# Always use --remote for AI (local doesn't have models)
wrangler dev --remote

# Deploy to production
wrangler deploy

# View model catalog
# https://developers.cloudflare.com/workers-ai/models/
````

## Ordem de leitura

**Comece aqui**: Início rápido acima → configuration.md (setup)

**Tarefas comuns**:

- Configuração inicial: configuration.md → Adicionar ligação + implantação
- Escolha o modelo: Árvore de decisão de seleção de modelo (acima) → api.md
- Construir RAG: padrões.md → Integração de vetorização
- Otimizar custos: Seleção de modelo + gotchas.md (limites de taxa)
- Depuração: gotchas.md → Erros comuns

## Nesta referência

- [configuration.md](./configuration.md) - configuração do wrangler.jsonc, tipos TypeScript, ligações, variáveis de ambiente
- [api.md](./api.md) - env.AI.run(), streaming, chamada de função, API REST, tipos de resposta
- [patterns.md](./patterns.md) - RAG com Vectorize, engenharia imediata, lote, tratamento de erros, cache
- [gotchas.md](./gotchas.md) - Pacote @cloudflare/ai obsoleto, limites de taxas, preços, erros comuns

## Veja também

- [vectorize](../vectorize/) - Banco de dados de vetores para padrões RAG
- [ai-gateway](../ai-gateway/) - Cache, limitação de taxa, análise para solicitações de IA
- [workers](../workers/) - Tempo de execução do trabalhador e padrões de manipulador de busca
