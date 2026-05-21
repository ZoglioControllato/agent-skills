# Gotchas e troubleshooting de bindings

## Crítico: mutação em escopo global

### Armadilha #1: cachear env em escopo global

```typescript
// ❌ PERIGOSO — env no escopo global
const apiKey = env.API_KEY // ERROR: env not available in global scope

export default {
  async fetch(request: Request, env: Env) {
    // Pode usar valor indefinido ou antigo
  },
}
```

**Por que quebra:**

- `env` não existe em escopo global
- Workarounds podem deixar secrets desatualizados sem redeploy
- Erros do tipo "Cannot read property 'X' of undefined"

**Acesse env por requisição:**

```typescript
export default {
  async fetch(request: Request, env: Env) {
    const apiKey = env.API_KEY
  },
}
```

## Erros comuns

### "env.MY_KV is undefined"

**Causa:** nome errado ou não configurado  
**Solução:** wrangler.jsonc (case-sensitive), `npx wrangler types`, `npx wrangler kv namespace list`

### "Property 'MY_KV' does not exist on type 'Env'"

**Causa:** tipos não gerados  
**Solução:** `npx wrangler types`

### "preview_id is required for --remote"

**Causa:** binding preview ausente  
**Solução:** `"preview_id": "dev-id"` ou `npx wrangler dev` em modo local

### "Secret updated but Worker still uses old value"

**Causa:** cache global ou sem redeploy  
**Solução:** não cacheie `env` globalmente; redeploy após mudar secret

### "KV get() returns null for existing key"

**Causa:** consistência eventual (60s), namespace ou ambiente errado  
**Solução:**

```bash
npx wrangler kv key get --binding=MY_KV "your-key"
npx wrangler kv namespace list
npx wrangler deployments list
```

### "D1 database not found"

**Solução:** `npx wrangler d1 list`, confira ID no wrangler.jsonc

### "Service binding returns 'No such service'"

**Causa:** Worker alvo não deployado, nome ou ambiente divergentes  
**Solução:**

```bash
npx wrangler deployments list --name=target-worker
cat wrangler.jsonc | grep -A2 services
cd ../target-worker && npx wrangler deploy
```

### "Rate limit exceeded" em escritas KV

**Causa:** >1 escrita/s por chave  
**Solução:** chaves diferentes, Durable Objects ou Queues

## Tipagem

### Falta @cloudflare/workers-types

**Erro:** `Cannot find name 'Request'`  
**Solução:** `npm install -D @cloudflare/workers-types` e `"types"` no tsconfig

### Incompatibilidade de tipo de binding

```typescript
const value = await env.MY_KV.get('key')
if (!value) return new Response('Not found', { status: 404 })
```

## Ambiente

### Deploy no ambiente errado

**Solução:** `npx wrangler deployments list`, use `--env`

### Secrets não por ambiente

**Solução:** `npx wrangler secret put API_KEY --env staging`

## Dev

**wrangler dev vs deploy:**

- dev: `preview_id` ou bindings locais; secrets podem faltar
- deploy: `id` de produção; secrets disponíveis

**Secrets no dev:** `npx wrangler dev --remote`  
**Persistência:** `npx wrangler dev --persist`

## Performance

### Chamadas sequenciais

```typescript
const [user, config] = await Promise.all([env.DB.prepare('...').first(), env.MY_KV.get('config')])
```

## Segurança

**Logs com secrets:** evite `console.log(env.API_KEY)`  
**Nunca** retorne o objeto `env` em JSON.

## Referência de limites

| Recurso                   | Limite            | Impacto                 |
| ------------------------- | ----------------- | ----------------------- |
| **Bindings por Worker**   | 64 total          | Todos os tipos          |
| **Variáveis de ambiente** | 64 máx., 5KB cada | Por Worker              |
| **Tamanho do secret**     | 1KB               | Por secret              |
| **Tamanho chave KV**      | 512 bytes         | UTF-8                   |
| **Valor KV**              | 25 MB             | Por valor               |
| **Escritas KV/chave**     | 1/s               | 429 se exceder          |
| **list() KV**             | 1000 keys         | Por chamada; use cursor |
| **Ops KV (free)**         | 1000 reads/dia    | Só free                 |
| **Objeto R2**             | 5 TB              | Por objeto              |
| **Tamanho DB D1**         | 10 GB             | Por banco               |
| **Linhas por query D1**   | 100.000           | Limite do result set    |
| **Batch fila**            | 100 mensagens     | Por batch do consumer   |
| **Tamanho mensagem**      | 128 KB            | Por mensagem            |

## Debug

```bash
npx wrangler deploy --dry-run
npx wrangler kv namespace list
npx wrangler secret list
npx wrangler deployments list
npx wrangler kv key list --binding=MY_KV
npx wrangler kv key get --binding=MY_KV "key-name"
npx wrangler r2 object get my-bucket/file.txt
npx wrangler d1 execute my-db --command="SELECT * FROM sqlite_master"
npx wrangler dev
npx wrangler dev --remote
npx wrangler dev --persist
npx wrangler types
npx wrangler tail
```

## Ver também

- [Workers Limits](https://developers.cloudflare.com/workers/platform/limits/)
- [Wrangler Commands](https://developers.cloudflare.com/workers/wrangler/commands/)
