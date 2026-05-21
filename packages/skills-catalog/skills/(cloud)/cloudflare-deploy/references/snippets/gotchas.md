# Gotchas & Best Practices

## Common Errors

### 1000: "Snippet execution failed"

Runtime error or syntax error. Wrap code in try/catch:

```javascript
try {
  return await fetch(request)
} catch (error) {
  return new Response(`Error: ${error.message}`, { status: 500 })
}
```

### 1100: "Exceeded execution limit"

Code takes >5ms CPU. Simplify logic or move to Workers.

### 1201: "Multiple origin fetches"

Call `fetch(request)` exactly once:

```javascript
// ❌ Multiple origin fetches
const r1 = await fetch(request)
const r2 = await fetch(request)
// ✅ Single fetch, reuse response
const response = await fetch(request)
```

### 1202: "Subrequest limit exceeded"

Pro: 2 subrequests, Business/Enterprise: 5. Reduce fetch calls.

### "Cannot set property on immutable object"

Clone before modifying:

```javascript
const modifiedRequest = new Request(request)
modifiedRequest.headers.set('X-Custom', 'value')
```

### "caches não estão definidos"

API de cache NÃO disponível em snippets. Use trabalhadores.

### "Módulo não encontrado"

Os snippets não suportam `importação`. Use código embutido ou Workers.

## Melhores práticas

### Desempenho

- Mantenha o código <10 KB (limite de 32 KB)
- Otimize para CPU de 5ms
- Clonar apenas ao modificar
- Minimizar subsolicitações

### Segurança

- Validar todas as entradas
- Use Web Crypto API para hash
- Sanitizar cabeçalhos antes da origem
- Não registre segredos

### Depuração```javascript

newResponse.headers.set('X-Debug-Country', request.cf.country)

````

```bash
curl -H "X-Test: true" https://example.com -v
````

## APIs disponíveis

**✅ Disponível:** `fetch()`, `Request`, `Response`, `Headers`, `URL`, `crypto.subtle`, `crypto.randomUUID()`, `atob()`/`btoa()`, `JSON`

**❌ NÃO Disponível:** `caches`, `KV`, `D1`, `R2`, `Durable Objects`, `WebSocket`, `HTMLRewriter`, `import`, APIs Node.js

## Limites

| Recurso                   | Limite     |
| ------------------------- | ---------- |
| Tamanho do trecho         | 32 KB      |
| Prazo de execução         | CPU de 5ms |
| Subsolicitações (Pro/Biz) | 2/5        |
| Trechos/zona              | 20         |

## Benchmarks de desempenho

| Operação              | Tempo   |
| --------------------- | ------- |
| Conjunto de cabeçalho | <0,1ms  |
| Análise de URL        | <0,2ms  |
| buscar()              | 1-3ms   |
| SHA-256               | 0,5-1ms |

**Migrar para Workers quando:** >5 ms necessários, >5 subsolicitações, precisar de armazenamento (KV/D1/R2), precisar de pacotes npm, >32 KB de código
