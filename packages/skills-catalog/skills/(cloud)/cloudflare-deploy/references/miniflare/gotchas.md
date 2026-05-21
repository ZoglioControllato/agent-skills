# Dicas e solução de problemas

## Limitações do Miniflare

**Não suportado:**

- Analytics Engine (use simulações)
- Imagens/stream da Cloudflare
- API de renderização do navegador
- Trabalhadores de cauda
- Trabalhadores para Plataformas (apoio parcial)

**Diferenças de comportamento em relação à produção:**

- Executa o trabalho localmente, não na borda do Cloudflare
- O armazenamento é local (sistema de arquivos/memória), não distribuído
- `Request.cf` é armazenado em cache/simulado, e não dados de borda reais
- O desempenho difere da borda
- A implementação do cache pode variar um pouco

## Erros Comuns

### "Não foi possível encontrar o módulo"

**Causa:** Caminho do módulo errado ou `modulesRules` não configurado
**Solução:**

```js
new Miniflare({
  modules: true,
  modulesRules: [{ type: 'ESModule', include: ['**/*.js'] }],
})
```

### "Data not persisting"

**Cause:** Persist paths are files, not directories  
**Solution:**

```js
kvPersist: "./data/kv",  // Directory, not file
```

### "Cannot run TypeScript"

**Cause:** Miniflare doesn't transpile TypeScript  
**Solution:** Build first with esbuild/tsc, then run compiled JS

### "`request.cf` is undefined"

**Cause:** CF data not configured  
**Solution:**

```js
new Miniflare({ cf: true }) // Or cf: "./cf.json"
```

### "EADDRINUSE" port conflict

**Cause:** Multiple instances using same port  
**Solution:** Use `dispatchFetch()` (no HTTP server) or `port: 0` for auto-assign

### "Durable Object not found"

**Cause:** Class export doesn't match config name  
**Solution:**

```js
export class Counter {} // Must match
new Miniflare({ durableObjects: { COUNTER: 'Counter' } })
```

## Debugging

**Enable verbose logging:**

```js
import { Log, LogLevel } from 'miniflare'
new Miniflare({ log: new Log(LogLevel.DEBUG) })
```

**Chrome DevTools:**

```js
const url = await mf.getInspectorURL()
console.log(`DevTools: ${url}`) // Open in Chrome
```

**Inspect bindings:**

```js
const env = await mf.getBindings()
console.log(Object.keys(env))
```

**Verify storage:**

```js
const ns = await mf.getKVNamespace('TEST')
const { keys } = await ns.list()
```

## Melhores práticas

**✓ Faça:**

- Use `dispatchFetch()` para testes (sem servidor HTTP)
- Armazenamento na memória para CI (omitir opções de persistência)
- Novas instâncias por teste para isolamento
- Ligações de tipo seguro com interfaces
- `await mf.dispose()` na limpeza

**✗ Evite:**

- Servidor HTTP em testes
- Instâncias compartilhadas sem limpeza
- Datas de compatibilidade antigas (use 2026+)

## Guias de migração

### Do Miniflare 2.x ao 3+

Mudanças importantes na v3+:

| v2                                  | v3+                              |
| ----------------------------------- | -------------------------------- |
| `getBindings()` sincronização       | `getBindings()` retorna Promessa |
| `ready` é nulo                      | `ready` retorna `Promessa<URL>`  |
| simulação de trabalhador de serviço | Construído em trabalhador        |
| Diferentes opções                   | Construtor reestruturado         |

**Exemplo de migração:**

```js
// v2
const bindings = mf.getBindings()
mf.ready // void

// v3+
const bindings = await mf.getBindings()
const url = await mf.ready // Promise<URL>
```

### From unstable_dev to Miniflare

```js
// Old (deprecated)
import { unstable_dev } from 'wrangler'
const worker = await unstable_dev('src/index.ts')

// New
import { Miniflare } from 'miniflare'
const mf = new Miniflare({ scriptPath: 'src/index.ts' })
```

### From Wrangler Dev

Miniflare doesn't auto-read `wrangler.toml`:

```js
// Translate manually:
new Miniflare({
  scriptPath: 'dist/worker.js',
  compatibilityDate: '2026-01-01',
  kvNamespaces: ['KV'],
  bindings: { API_KEY: process.env.API_KEY },
})
```

## Resource Limits

| Limit      | Value            | Notes                            |
| ---------- | ---------------- | -------------------------------- |
| CPU time   | 30s default      | Configurable via `scriptTimeout` |
| Storage    | Filesystem       | Performance varies by disk       |
| Memory     | System dependent | No artificial limits             |
| Request.cf | Cached/mocked    | Not live edge data               |

See [patterns.md](./patterns.md) for testing examples.
