# Referência da skill Cloudflare Bindings

Orientação especializada sobre Cloudflare Workers Bindings — as APIs de runtime que conectam Workers a recursos da plataforma.

## O que são bindings?

Bindings são como Workers acessam recursos Cloudflare (storage, compute, serviços) via o objeto `env`. Configurados em `wrangler.jsonc`, tipados com TypeScript e sem overhead extra em runtime.

## Ordem de leitura

1. **Este arquivo** — catálogo e guia de escolha
2. **[api.md](api.md)** — tipos TypeScript e padrões de acesso
3. **[configuration.md](configuration.md)** — exemplos completos de wrangler.jsonc
4. **[patterns.md](patterns.md)** — boas práticas e padrões comuns
5. **[gotchas.md](gotchas.md)** — armadilhas e troubleshooting

## Catálogo de bindings

### Storage

| Binding             | Caso de uso                    | Acesso                        |
| ------------------- | ------------------------------ | ----------------------------- |
| **KV**              | Cache KV, leituras CDN         | `env.MY_KV.get(key)`          |
| **R2**              | Objetos (compatível S3)        | `env.MY_BUCKET.get(key)`      |
| **D1**              | SQL (SQLite)                   | `env.DB.prepare(sql).all()`   |
| **Durable Objects** | Coordenação, estado tempo real | `env.MY_DO.get(id)`           |
| **Vectorize**       | Busca em embeddings            | `env.VECTORIZE.query(vector)` |
| **Queues**          | Processamento assíncrono       | `env.MY_QUEUE.send(msg)`      |

### Compute

| Binding               | Caso de uso       | Acesso                      |
| --------------------- | ----------------- | --------------------------- |
| **Service**           | RPC Worker–Worker | `env.MY_SERVICE.fetch(req)` |
| **Workers AI**        | Inferência LLM    | `env.AI.run(model, input)`  |
| **Browser Rendering** | Chrome headless   | `env.BROWSER.fetch(url)`    |

### Plataforma

| Binding              | Caso de uso          | Acesso                               |
| -------------------- | -------------------- | ------------------------------------ |
| **Analytics Engine** | Métricas custom      | `env.ANALYTICS.writeDataPoint(data)` |
| **mTLS**             | Certificados cliente | `env.MY_CERT` (string)               |
| **Hyperdrive**       | Pool de banco        | `env.HYPERDRIVE.connectionString`    |
| **Rate Limiting**    | Throttle             | `env.RATE_LIMITER.limit(id)`         |
| **Workflows**        | Fluxos longos        | `env.MY_WORKFLOW.create()`           |

### Configuração

| Binding                   | Caso de uso         | Acesso                             |
| ------------------------- | ------------------- | ---------------------------------- |
| **Variáveis de ambiente** | Config não sensível | `env.API_URL` (string)             |
| **Secrets**               | Valores sensíveis   | `env.API_KEY` (string)             |
| **Text/Data Blobs**       | Arquivos estáticos  | `env.MY_BLOB` (string)             |
| **WASM**                  | Módulos WebAssembly | `env.MY_WASM` (WebAssembly.Module) |

## Guia rápido de escolha

**Precisa de persistência?**

- Chave-valor < 25MB → **KV**
- Arquivos/objetos → **R2**
- Dados relacionais → **D1**
- Coordenação tempo real → **Durable Objects**

**Precisa de AI/compute?**

- LLM → **Workers AI**
- Scraping/PDF → **Browser Rendering**
- Chamar outro Worker → **Service binding**

**Processamento assíncrono?**

- Jobs em segundo plano → **Queues**

**Config?**

- Valores públicos → **Variáveis de ambiente**
- Segredos → **Secrets** (nunca commit)

## Início rápido

1. **Adicione binding no wrangler.jsonc:**

```jsonc
{
  "kv_namespaces": [{ "binding": "MY_KV", "id": "your-kv-id" }],
}
```

2. **Gere tipos:**

```bash
npx wrangler types
```

3. **Acesse no Worker:**

```typescript
export default {
  async fetch(request, env, ctx) {
    await env.MY_KV.put('key', 'value')
    return new Response('OK')
  },
}
```

## Tipagem

Bindings totalmente tipados com `wrangler types`. Veja [api.md](api.md).

## Limites

- Máximo 64 bindings por Worker (todos os tipos)
- Detalhes em [gotchas.md](gotchas.md)

## Conceitos-chave

**Acesso zero-overhead:** compilado no Worker, sem rede para acessar  
**Tipado:** TypeScript completo via `wrangler types`  
**Por ambiente:** IDs distintos dev/staging/produção  
**Secrets vs vars:** secrets cifrados em repouso, nunca em arquivos de config

## Ver também

- [Cloudflare Docs: Bindings](https://developers.cloudflare.com/workers/runtime-apis/bindings/)
- [Wrangler Configuration](https://developers.cloudflare.com/workers/wrangler/configuration/)
