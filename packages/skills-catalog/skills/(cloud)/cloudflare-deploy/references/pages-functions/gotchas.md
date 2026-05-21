# Dicas e depuração

## Diagnóstico de erro

| Sintoma                                     | Causa provável                                                                      | Solução                                                                                                |
| ------------------------------------------- | ----------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| **Função não invocada**                     | Localização `/functions` errada, extensão errada ou `_routes.json` exclui o caminho | Verifique `pages_build_output_dir`, use `.js`/`.ts`, verifique `_routes.json`                          |
| **`ctx.env.BINDING` indefinido**            | Vinculação não configurada ou incompatibilidade de nome                             | Adicione ao `wrangler.jsonc`, verifique o nome exato (diferencia maiúsculas de minúsculas), reimplante |
| **Erros de TypeScript em `ctx.env`**        | Definição de tipo ausente                                                           | Execute `wrangler types` ou defina `interface Env {}`                                                  |
| **Middleware não está em execução**         | Nome/local de arquivo incorreto ou `ctx.next()` ausente                             | Nomeie exatamente `_middleware.js`, exporte `onRequest`, chame `ctx.next()`                            |
| **Segredos faltando na produção**           | `.dev.vars` não implantado                                                          | `.dev.vars` é apenas local - defina segredos de produção via painel ou `wrangler secret put`           |
| **Incompatibilidade de tipo na vinculação** | Tipo de interface errado                                                            | Consulte a tabela de ligações [api.md](./api.md) para obter os tipos corretos                          |
| **"Chave KV não encontrada" mas existe**    | Digite o namespace ou ambiente errado                                               | Verifique a ligação do namespace, verifique o ambiente de visualização versus produção                 |
| **Tempo limite da função**                  | Espera síncrona ou `await` ausente                                                  | Todas as E/S devem ser assíncronas/esperadas, use `ctx.waitUntil()` para tarefas em segundo plano      |

## Erros Comuns

### Erros de tipo TypeScript

**Problema:** `ctx.env.MY_BINDING` mostra erro de tipo
**Causa:** Nenhuma definição de tipo para `Env`
**Solução:** Execute `npx wrangler types` ou defina manualmente:```typescript
interface Env {
MY_BINDING: KVNamespace
}
export const onRequest: PagesFunction<Env> = async (ctx) => {
/_ ... _/
}

````

### Secrets not available in production

**Problem:** `ctx.env.SECRET_KEY` is undefined in production
**Cause:** `.dev.vars` is local-only, not deployed
**Solution:** Set production secrets:

```bash
echo "value" | npx wrangler pages secret put SECRET_KEY --project-name=my-app
````

## Debugging

```typescript
// Console logging
export async function onRequest(ctx) {
  console.log('Request:', ctx.request.method, ctx.request.url)
  const res = await ctx.next()
  console.log('Status:', res.status)
  return res
}
```

```bash
# Stream real-time logs
npx wrangler pages deployment tail
npx wrangler pages deployment tail --status error
```

```jsonc
// Source maps (wrangler.jsonc)
{ "upload_source_maps": true }
```

## Limites

| Recurso                | Grátis                     | Pago                        |
| ---------------------- | -------------------------- | --------------------------- |
| Tempo de CPU           | 10ms                       | 50ms                        |
| Memória                | 128 MB                     | 128 MB                      |
| Tamanho do roteiro     | 10 MB compactados          | 10 MB compactados           |
| Variáveis ​​ambientais | 5 KB por var, 64 no máximo | 5 KB por var, 64 no máximo  |
| Solicitações           | 100k/dia                   | Ilimitado (US$ 0,50/milhão) |

## Melhores práticas

**Desempenho:** Minimize dependências (inicialização a frio), use KV para cache/D1 para relacional/R2 para arquivos grandes, defina cabeçalhos `Cache-Control`, operações de banco de dados em lote, lide com erros normalmente

**Segurança:** Nunca comprometa segredos (use `.dev.vars` + gitignore), valide a entrada, higienize antes do banco de dados, implemente middleware de autenticação, defina cabeçalhos CORS, limite de taxa por IP

## Migração

**Trabalhadores → Funções de páginas:**

- `exportar padrão { fetch(req, env) {} }` → `função de exportação onRequest(ctx) { const { request, env } = ctx; }`
- Use `_worker.js` para roteamento complexo: `env.ASSETS.fetch(request)` para arquivos estáticos

**Outras plataformas → Páginas:**

- Roteamento baseado em arquivo: `/functions/api/users.js` → `/api/users`
- Rotas dinâmicas: `[param]` e não `:param`
- Substitua as dependências do Node.js por APIs de trabalho ou adicione o sinalizador `nodejs_compat`

## Recursos

- [Documentos oficiais](https://developers.cloudflare.com/pages/functions/)
- [APIs de trabalho](https://developers.cloudflare.com/workers/runtime-apis/)
- [Exemplos](https://github.com/cloudflare/pages-example-projects)
- [Discord](https://discord.gg/cloudflaredev)

**Veja também:** [configuration.md](./configuration.md) para configuração do TypeScript | [patterns.md](./patterns.md) para middleware/auth | [api.md](./api.md) para ligações
