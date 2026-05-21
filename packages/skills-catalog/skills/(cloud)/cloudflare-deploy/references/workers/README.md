# Cloudflare Workers

Orientação especializada para criar, implantar e otimizar aplicações Cloudflare Workers.

## Visão geral

Cloudflare Workers rodam em isolates V8 (não em contêineres/VMs):

- Cold starts extremamente rápidos (< 1 ms)
- Implantação global em mais de 300 localidades
- Conformidade com padrões web (fetch, URL, Headers, Request, Response)
- Suporte a JS/TS, Python, Rust e WebAssembly

**Princípio-chave**: Workers usam APIs da plataforma web sempre que possível, para portabilidade.

## Padrão Module Worker (recomendado)

```typescript
export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    return new Response('Hello World!')
  },
}
```

**Parâmetros do handler**:

- `request`: requisição HTTP recebida (objeto Request padrão)
- `env`: bindings de ambiente (KV, D1, R2, secrets, vars)
- `ctx`: contexto de execução (`waitUntil`, `passThroughOnException`)

## Comandos essenciais

```bash
npx wrangler dev                    # Desenvolvimento local
npx wrangler dev --remote           # Dev remoto (recursos reais)
npx wrangler deploy                 # Produção
npx wrangler deploy --env staging   # Ambiente específico
npx wrangler tail                   # Stream de logs
npx wrangler secret put API_KEY     # Definir secret
```

## Quando usar Workers

- Endpoints de API na edge
- Transformação de requisição/resposta
- Camadas de autenticação/autorização
- Otimização de ativos estáticos
- Testes A/B e feature flags
- Rate limiting e segurança
- Lógica de proxy/roteamento
- Aplicações WebSocket

## Início rápido

```bash
npm create cloudflare@latest my-worker -- --type hello-world
cd my-worker
npx wrangler dev
```

## Assinaturas de handler

```typescript
// Requisições HTTP
async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response>

// Cron triggers
async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext): Promise<void>

// Consumidor de fila
async queue(batch: MessageBatch, env: Env, ctx: ExecutionContext): Promise<void>

// Consumidor tail
async tail(events: TraceItem[], env: Env, ctx: ExecutionContext): Promise<void>
```

## Recursos

**Docs**: https://developers.cloudflare.com/workers/  
**Exemplos**: https://developers.cloudflare.com/workers/examples/  
**Runtime APIs**: https://developers.cloudflare.com/workers/runtime-apis/

## Nesta referência

- [Configuration](./configuration.md) — configuração wrangler.jsonc, bindings, ambientes
- [API](./api.md) — APIs de runtime, bindings, contexto de execução
- [Patterns](./patterns.md) — fluxos comuns, testes, otimização
- [Frameworks](./frameworks.md) — Hono, roteamento, validação
- [Gotchas](./gotchas.md) — problemas comuns, limites, troubleshooting

## Ordem de leitura

| Tarefa                     | Comece por                           | Depois leia               |
| -------------------------- | ------------------------------------ | ------------------------- |
| Primeiro Worker            | README → Configuration → API         | Patterns                  |
| Adicionar framework        | Frameworks                           | Configuration (bindings)  |
| Adicionar storage/bindings | Configuration → API (uso de binding) | Links Ver também          |
| Depurar problemas          | Gotchas                              | API (docs do binding)     |
| Otimização em produção     | Patterns                             | API (cache, streaming)    |
| Tipagem forte              | Configuration (TypeScript)           | Frameworks (tipagem Hono) |

## Ver também

- [KV](../kv/README.md) — armazenamento chave-valor
- [D1](../d1/README.md) — banco SQL
- [R2](../r2/README.md) — armazenamento de objetos
- [Durable Objects](../durable-objects/README.md) — coordenação com estado
- [Queues](../queues/README.md) — filas de mensagens
- [Wrangler](../wrangler/README.md) — referência da CLI
