# Gotchas

## Functions não executam

**Problema**: endpoints de function retornam 404 ou não rodam  
**Causas**: `_routes.json` exclui o caminho; extensão errada (`.jsx`/`.tsx`); pasta Functions fora da raiz de saída  
**Solução**: confira `_routes.json`, renomeie para `.ts`/`.js`, valide estrutura do build

## 404 em assets estáticos

**Problema**: arquivos estáticos não servem  
**Causas**: diretório de saída errado; Functions interceptando; modo avançado sem `env.ASSETS.fetch()`  
**Solução**: valide output, exclusões em `_routes.json`, chame `env.ASSETS.fetch()` em `_worker.js`

## Bindings não funcionam

**Problema**: `env.BINDING` indefinido ou erro  
**Causas**: erro de sintaxe no wrangler.jsonc; IDs errados; falta `.dev.vars`; tipos desatualizados  
**Solução**: valide config, IDs; crie `.dev.vars`; `npx wrangler types`

## Falhas de build

**Problema**: deploy falha no build  
**Causas**: comando/saída errados; versão Node; env faltando; timeout 20 min; OOM  
**Solução**: Dashboard → Deployments → Build log; settings; `.nvmrc`; otimize build

## Middleware não roda

**Problema**: middleware não executa  
**Causas**: nome errado (não `_middleware.ts`); sem export `onRequest`; não chamou `next()`  
**Solução**: prefixo underscore no arquivo; exporte handler; chame `next()` ou retorne Response

## Headers/redirects não aplicam

**Problema**: `_headers` ou `_redirects` sem efeito  
**Causas**: só para estáticos; Functions sobrescrevem; sintaxe; limites  
**Solução**: headers no objeto Response para Functions; sintaxe; limites (100 headers, 2.100 redirects)

## Erros TypeScript

**Problema**: erros de tipo no código Functions  
**Causas**: tipos não gerados; `Env` não bate com wrangler.jsonc  
**Solução**: `npx wrangler types --path='./functions/types.d.ts'`; atualize `Env`

## Problemas no dev local

**Problema**: servidor de dev ou bindings  
**Causas**: porta em uso; bindings não passados; HTTP vs HTTPS  
**Solução**: `--port=3000`; bindings via CLI ou wrangler.jsonc; diferenças HTTP/HTTPS

## Desempenho

**Problema**: respostas lentas ou limite de CPU  
**Causas**: Functions invocadas para estáticos; cold starts; 10ms CPU; bundle grande  
**Solução**: exclua estáticos em `_routes.json`; otimize caminhos quentes; bundle < 1MB

## Específico de framework

### Frameworks depreciados

**Next.js**: adapter oficial (`@cloudflare/next-on-pages`) **depreciado** e sem manutenção.

- **Problema**: sem updates desde 2024; incompatível com Next.js 15+; faltam recursos do App Router
- **Causa**: Cloudflare descontinuou suporte oficial; fork da comunidade com alcance limitado
- **Soluções**:
  1. **Recomendado**: Vercel (host oficial Next.js)
  2. **Avançado**: self-host em Workers com adapter custom (complexo, sem suporte)
  3. **Migração**: SvelteKit/Nuxt (DX similar, suporte Pages completo)

**Remix**: adapter oficial (`@remix-run/cloudflare-pages`) **depreciado**.

- **Problema**: equipe Remix sem manutenção dos adapters; issues com Remix v2+
- **Causa**: adapters de framework depreciados pelo time Remix
- **Soluções**:
  1. **Recomendado**: SvelteKit (roteamento por arquivo similar, melhor DX)
  2. **Alternativa**: Astro (estático primeiro com SSR opcional)
  3. **Contorno**: adapter depreciado (sem suporte futuro)

### Frameworks suportados

**SvelteKit**:

- `@sveltejs/adapter-cloudflare`
- Bindings via `platform.env` em load server
- `platform: 'cloudflare'` em `svelte.config.js`

**Astro**:

- Adapter Cloudflare embutido
- Bindings via `Astro.locals.runtime.env`

**Nuxt**:

- `nitro.preset: 'cloudflare-pages'` em `nuxt.config.ts`
- Bindings via `event.context.cloudflare.env`

**Qwik, Solid Start**:

- Adapters Cloudflare oficiais/embutidos
- Veja docs do framework para acesso a bindings

## Debug

```typescript
// Log request details
console.log('Request:', { method: request.method, url: request.url })
console.log('Env:', Object.keys(env))
console.log('Params:', params)
```

**Logs**: `npx wrangler pages deployment tail --project-name=my-project`

## Smart Placement

### Cold start maior

**Problema**: primeiras requisições mais lentas após habilitar Smart Placement  
**Causa**: fase inicial de otimização  
**Solução**: esperado nas primeiras 24–48 h; monitore tendência de latência

### Tempos de resposta inconsistentes

**Problema**: latência varia após deploy inicial  
**Causa**: sistema testa locais de execução  
**Solução**: normal na fase de aprendizado; estabiliza em 1–2 dias

### Sem ganho de performance

**Problema**: Smart Placement sem redução de latência  
**Causa**: tráfego global uniforme ou sem localidade de dados  
**Solução**: mais útil com D1/DO centralizado ou tráfego regional; desligue se não ajuda

## Bindings remotos

### Dados de produção alterados por engano

**Problema**: `dev --remote` mudou KV/DB de produção  
**Causa**: bindings remotos são produção real  
**Solução**: `--remote` só para leitura; ambientes preview; nunca writes perigosos em dev

### Erro de auth no binding remoto

**Problema**: `pages dev --remote` com Unauthorized  
**Causa**: não logado, sessão expirada ou permissões  
**Solução**: `npx wrangler login`; confira acesso ao projeto e IDs

### Dev lento com remoto

**Problema**: dev lento com `--remote`  
**Causa**: cada requisição vai à rede até produção  
**Solução**: bindings locais no dia a dia; `--remote` só para validação final

## Erros comuns

### "Module not found"

**Causa**: dependências não bundled ou saída de build errada  
**Solução**: diretório de saída; dependências no bundle

### "Binding not found"

**Causa**: binding não configurado ou tipos desatualizados  
**Solução**: wrangler.jsonc; `npx wrangler types`

### "Request exceeded CPU limit"

**Causa**: código lento ou compute pesado  
**Solução**: otimize caminhos quentes; Workers Paid

### "Script too large"

**Causa**: bundle acima do limite  
**Solução**: tree-shake; imports dinâmicos; code-split

### "Too many subrequests"

**Causa**: > 50 subrequisições  
**Solução**: em lote ou reduza fetches

### "KV key not found"

**Causa**: key inexistente ou namespace errado  
**Solução**: namespace por ambiente

### "D1 error"

**Causa**: `database_id` errado ou migrations faltando  
**Solução**: config; `wrangler d1 migrations list`

## Referência de limites (jan. 2026)

| Recurso               | Grátis   | Pago      |
| --------------------- | -------- | --------- |
| Requisições Functions | 100k/dia | Ilimitado |
| CPU                   | 10ms/req | 30ms/req  |
| Memória               | 128MB    | 128MB     |
| Tamanho script        | 1MB      | 10MB      |
| Subrequisições        | 50/req   | 1.000/req |
| Deployments           | 500/mês  | 5.000/mês |

**Dica**: limite de CPU? Otimize ou Workers Paid.

[Limites completos](https://developers.cloudflare.com/pages/platform/limits/)

## Ajuda

1. [Pages Docs](https://developers.cloudflare.com/pages/)
2. [Discord #functions](https://discord.com/channels/595317990191398933/910978223968518144)
3. [Workers Examples](https://developers.cloudflare.com/workers/examples/)
4. Docs/adapters por framework
