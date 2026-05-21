# Gotchas do Workers

## Erros comuns

### "Too much CPU time used"

**Causa:** Worker excedeu o limite de tempo de CPU (10 ms padrão, 30 ms unbound)  
**Solução:** use `ctx.waitUntil()` para trabalho em segundo plano, descarregue computação pesada para Durable Objects ou considere Workers AI para cargas de ML

### "Module-Level State Lost"

**Causa:** Workers são stateless entre requisições; variáveis em nível de módulo resetam de forma imprevisível  
**Solução:** use KV, D1 ou Durable Objects para estado persistente; não dependa de variáveis em nível de módulo

### "Body has already been used"

**Causa:** tentativa de ler o corpo da resposta duas vezes (corpos são streams)  
**Solução:** clone a resposta antes de ler: `response.clone()` ou leia uma vez e crie um novo Response com o texto

### "Node.js module not found"

**Causa:** built-ins do Node.js não estão disponíveis por padrão  
**Solução:** use APIs dos Workers (ex.: R2 para arquivos) ou habilite compat Node com `"compatibility_flags": ["nodejs_compat_v2"]`

### "Cannot fetch in global scope"

**Causa:** tentativa de usar fetch durante a inicialização do módulo  
**Solução:** mova chamadas fetch para dentro de funções handler (fetch, scheduled, etc.) onde são permitidas

### "Subrequest depth limit exceeded"

**Causa:** muitas subrequisições aninhadas criando cadeia profunda  
**Solução:** achate a cadeia ou use service bindings para comunicação direta Worker–Worker

### "D1 read-after-write inconsistency"

**Causa:** D1 é eventualmente consistente; leituras podem não refletir escritas recentes  
**Solução:** use D1 Sessions (2024+) para garantir consistência read-after-write na sessão:

```typescript
const session = env.DB.withSession()
await session.prepare('INSERT INTO users (name) VALUES (?)').bind('Alice').run()
const user = await session.prepare('SELECT * FROM users WHERE name = ?').bind('Alice').first() // Garantido ver Alice
```

**Quando usar sessions:** padrões escrita → leitura, transações que exigem consistência

### "wrangler types not generating TypeScript definitions"

**Causa:** geração de tipos não configurada ou desatualizada  
**Solução:** execute `npx wrangler types` após alterar bindings no wrangler.jsonc:

```bash
npx wrangler types  # Gera .wrangler/types/runtime.d.ts
```

Adicione ao `tsconfig.json`: `"include": [".wrangler/types/**/*.ts"]`

Depois importe: `import type { Env } from './.wrangler/types/runtime';`

### "Durable Object RPC errors with deprecated fetch pattern"

**Causa:** uso do padrão antigo `stub.fetch()` em vez de RPC (2024+)  
**Solução:** exporte métodos diretamente, chame via RPC:

```typescript
// ❌ Padrão fetch antigo
export class MyDO {
  async fetch(request: Request) {
    const { method } = await request.json()
    if (method === 'increment') return new Response(String(await this.increment()))
  }
  async increment() {
    return ++this.value
  }
}
const stub = env.DO.get(id)
const res = await stub.fetch('http://x', { method: 'POST', body: JSON.stringify({ method: 'increment' }) })

// ✅ Padrão RPC (tipado, sem overhead de serialização)
export class MyDO {
  async increment() {
    return ++this.value
  }
}
const stub = env.DO.get(id)
const count = await stub.increment() // Chamada de método direta
```

### "WebSocket connection closes unexpectedly"

**Causa:** Worker atinge limite de CPU enquanto mantém conexão WebSocket  
**Solução:** use WebSocket hibernation (2024+) para descarregar conexões ociosas:

```typescript
export class WebSocketDO {
  async webSocketMessage(ws: WebSocket, message: string) {
    // Tratar mensagem
  }
  async webSocketClose(ws: WebSocket, code: number) {
    // Limpeza
  }
}
```

A hibernação suspende automaticamente conexões inativas e acorda em eventos

### "Framework middleware not working with Workers"

**Causa:** framework espera primitivas Node (ex.: Express usa streams Node)  
**Solução:** use frameworks nativos de Workers (Hono, itty-router, Worktop) ou adapte middleware:

```typescript
// ✅ Hono (nativo Workers)
import { Hono } from 'hono'
const app = new Hono()
app.use('*', async (c, next) => {
  /* middleware */ await next()
})
```

Veja [frameworks.md](./frameworks.md) para padrões completos

## Limites

| Limite                | Valor     | Observações                           |
| --------------------- | --------- | ------------------------------------- |
| Tamanho da requisição | 100 MB    | Tamanho máximo da requisição recebida |
| Tamanho da resposta   | Ilimitado | Suporta streaming                     |
| CPU (standard)        | 10 ms     | Workers standard                      |
| CPU (unbound)         | 30 ms     | Workers unbound                       |
| Subrequisições        | 1000      | Por requisição                        |
| Leituras KV           | 1000      | Por requisição                        |
| Tamanho de escrita KV | 25 MB     | Máximo por escrita                    |
| Tamanho do ambiente   | 5 MB      | Tamanho total dos bindings de env     |

## Ver também

- [Patterns](./patterns.md) — boas práticas
- [API](./api.md) — APIs de runtime
- [Configuration](./configuration.md) — configuração
- [Frameworks](./frameworks.md) — Hono, roteamento, validação
