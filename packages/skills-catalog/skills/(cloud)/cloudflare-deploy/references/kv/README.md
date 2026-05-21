# Cloudflare Workers KV

Armazenamento chave-valor globalmente distribuído, eventualmente consistente, otimizado para alto volume de leituras e baixa latência.

## Visão geral

O KV oferece:

- Consistência eventual (propagação global ~60s)
- Desempenho orientado a leitura
- Limite de 25 MiB por valor
- Replicação automática para a edge Cloudflare
- Metadados (1024 bytes)

**Casos de uso:** configuração, sessões, feature flags, cache, testes A/B

## Quando usar KV

| Necessidade                      | Recomendação                             |
| -------------------------------- | ---------------------------------------- |
| Consistência forte               | → [Durable Objects](../durable-objects/) |
| Consultas SQL                    | → [D1](../d1/)                           |
| Armazenamento de arquivos        | → [R2](../r2/)                           |
| Muitas leituras, poucas escritas | → KV ✅                                  |
| Leituras globais <10ms           | → KV ✅                                  |

**Comparação rápida:**

| Recurso          | KV            | D1                | Durable Objects |
| ---------------- | ------------- | ----------------- | --------------- |
| Consistência     | Eventual      | Forte             | Forte           |
| Latência leitura | <10ms         | ~50ms             | <1ms            |
| Limite escrita   | 1/s por chave | Ilimitado         | Ilimitado       |
| Caso de uso      | Config, cache | Dados relacionais | Coordenação     |

## Início rápido

```bash
wrangler kv namespace create MY_NAMESPACE
# Add binding to wrangler.jsonc
```

```typescript
// Write
await env.MY_KV.put('key', 'value', { expirationTtl: 300 })

// Read
const value = await env.MY_KV.get('key')
const json = await env.MY_KV.get<Config>('config', 'json')
```

## Operações principais

| Método                      | Finalidade             | Retorno                            |
| --------------------------- | ---------------------- | ---------------------------------- |
| `get(key, type?)`           | Leitura única          | `string \| null`                   |
| `get(keys, type?)`          | Leitura em lote (≤100) | `Map<string, T \| null>`           |
| `put(key, value, options?)` | Escrita                | `Promise<void>`                    |
| `delete(key)`               | Excluir                | `Promise<void>`                    |
| `list(options?)`            | Listar chaves          | `{ keys, list_complete, cursor? }` |
| `getWithMetadata(key)`      | Valor + metadata       | `{ value, metadata }`              |

## Modelo de consistência

- **Visibilidade de escrita:** imediata na mesma localidade, ≤60s globalmente
- **Caminho de leitura:** eventualmente consistente
- **Taxa de escrita:** 1 escrita/s por chave (429 se exceder)

## Ordem de leitura

| Tarefa            | Arquivos                                       |
| ----------------- | ---------------------------------------------- |
| Início rápido     | README → configuration.md                      |
| Implementar       | README → api.md → patterns.md                  |
| Depurar           | gotchas.md → api.md                            |
| Operações em lote | api.md (bulk) → patterns.md                    |
| Ajuste fino       | gotchas.md (performance) → patterns.md (cache) |

## Nesta referência

- [configuration.md](./configuration.md) — wrangler.jsonc, namespace, tipos TypeScript
- [api.md](./api.md) — métodos KV, bulk, cacheTtl, tipos de conteúdo
- [patterns.md](./patterns.md) — cache, sessões, rate limit, A/B
- [gotchas.md](./gotchas.md) — consistência, escritas concorrentes, limites de valor

## Ver também

- [workers](../workers/) — runtime para acesso ao KV
- [d1](../d1/) — consistência forte
- [durable-objects](../durable-objects/) — alternativa fortemente consistente
