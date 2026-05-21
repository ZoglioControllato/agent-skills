# KV: gotchas e troubleshooting

## Erros comuns

### "Stale Read After Write"

**Causa:** consistência eventual — escritas podem não aparecer imediatamente em outras regiões  
**Solução:** não leia logo após escrever; confirme sem reler ou use o valor que acabou de escrever. Escrita visível na mesma localidade; ≤60s globalmente

```typescript
// ❌ BAD: Read immediately after write
await env.KV.put('key', 'value')
const value = await env.KV.get('key') // May be null in other regions!

// ✅ GOOD: Use the value you just wrote
const newValue = 'value'
await env.KV.put('key', newValue)
return new Response(newValue) // Don't re-read
```

### "429 Rate Limit on Concurrent Writes"

**Causa:** várias escritas concorrentes na mesma chave além de 1/s  
**Solução:** escritas sequenciais, chaves distintas ou retry com backoff exponencial

```typescript
async function putWithRetry(kv: KVNamespace, key: string, value: string, maxAttempts = 5): Promise<void> {
  let delay = 1000
  for (let i = 0; i < maxAttempts; i++) {
    try {
      await kv.put(key, value)
      return
    } catch (err) {
      if (err instanceof Error && err.message.includes('429')) {
        if (i === maxAttempts - 1) throw err
        await new Promise((r) => setTimeout(r, delay))
        delay *= 2 // Exponential backoff
      } else {
        throw err
      }
    }
  }
}
```

### "Inefficient Multiple Gets"

**Causa:** vários `get()` em vez de bulk  
**Solução:** `env.USERS.get(["user:1", "user:2", "user:3"])` — uma operação

### "Null Reference Error"

**Causa:** uso sem checar null quando a chave não existe  
**Solução:** KV retorna `null` para chave ausente

```typescript
// ❌ BAD: Assumes value exists
const config = await env.KV.get('config', 'json')
return config.theme // TypeError if null!

// ✅ GOOD: Null checks
const config = await env.KV.get('config', 'json')
return config?.theme ?? 'default'

// ✅ GOOD: Early return
const config = await env.KV.get('config', 'json')
if (!config) return new Response('Not found', { status: 404 })
return new Response(config.theme)
```

### "Negative Lookup Caching"

**Causa:** chaves inexistentes ficam em cache como "não encontrado" até ~60s  
**Solução:** criar após checar pode não ser visível até expirar o cache negativo

```typescript
const exists = await env.KV.get('key') // null, cached as "not found"
if (!exists) {
  await env.KV.put('key', 'value')
}

const value = (await env.KV.get('key')) ?? 'default-value'
```

## Dicas de performance

| Cenário                | Recomendação           | Por quê                                      |
| ---------------------- | ---------------------- | -------------------------------------------- |
| Valores grandes        | Tipo `stream`          | Evita buffer completo na memória             |
| Muitas chaves pequenas | Um objeto JSON         | Menos operações, melhor cache                |
| Alto volume de escrita | Espalhe por chaves     | Evita limite 1 escrita/s por chave           |
| Cold reads             | Aumente `cacheTtl`     | Menos latência em dados lidos com frequência |
| Bulk                   | Forma array de `get()` | Uma operação, melhor performance             |

## Exemplos de custo

**Free tier:**

- 100K reads/dia = 3M/mês ✓
- 1K writes/dia = 30K/mês ✓
- 1GB storage ✓

**Carga paga exemplo:**

- 10M reads/mês ≈ US$ 5,00
- 100K writes/mês ≈ US$ 0,50
- 1GB storage ≈ US$ 0,50
- **Total ~US$ 6/mês**

## Limites

| Limite            | Valor             | Observações                        |
| ----------------- | ----------------- | ---------------------------------- |
| Tamanho da chave  | 512 bytes         | Comprimento máximo                 |
| Tamanho do valor  | 25 MiB            | 413 se exceder                     |
| Metadados         | 1024 bytes        | Por chave                          |
| cacheTtl mínimo   | 60s               | TTL mínimo de cache                |
| Escrita por chave | 1/s               | 429 se exceder                     |
| Propagação        | ≤60s              | Tempo global                       |
| Bulk get máx.     | 100 chaves        | Por operação bulk                  |
| Ops por Worker    | 1.000             | Por requisição (bulk conta como 1) |
| Preço reads       | US$ 0,50 / 10M    | Por milhão                         |
| Preço writes      | US$ 5 / 1M        | Por milhão                         |
| Preço deletes     | US$ 5 / 1M        | Por milhão                         |
| Preço storage     | US$ 0,50 / GB-mês | Por GB                             |
