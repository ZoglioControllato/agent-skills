# Cloudflare Wrangler

CLI oficial do Cloudflare Workers — desenvolva, gerencie e faça deploy de Workers pela linha de comando.

## O que é Wrangler?

Wrangler é a CLI da Cloudflare Developer Platform que permite:

- Criar, desenvolver e publicar Workers
- Gerenciar bindings (KV, D1, R2, Durable Objects, etc.)
- Configurar roteamento e ambientes
- Rodar servidores de desenvolvimento locais
- Executar migrações e gerenciar recursos
- Rodar testes de integração

## Instalação

```bash
npm install wrangler --save-dev
# or globally
npm install -g wrangler
```

Comandos: `npx wrangler <command>` (ou `pnpm`/`yarn wrangler`)

## Ordem de leitura

| Se você quer…                     | Comece aqui                                                           |
| --------------------------------- | --------------------------------------------------------------------- |
| Criar/publicar Worker rapidamente | Comandos essenciais abaixo → [patterns.md](./patterns.md) §New Worker |
| Configurar bindings (KV, D1, R2)  | [configuration.md](./configuration.md) §Bindings                      |
| Escrever testes de integração     | [api.md](./api.md) §startWorker                                       |
| Depurar problemas em produção     | [gotchas.md](./gotchas.md) + Comandos essenciais §Monitoring          |
| Fluxo multiambiente               | [configuration.md](./configuration.md) §Environments                  |

## Comandos essenciais

### Projeto e desenvolvimento

```bash
wrangler init [name]              # Create new project
wrangler dev                      # Local dev server (fast, simulated)
wrangler dev --remote             # Dev with remote resources (production-like)
wrangler deploy                   # Deploy to production
wrangler deploy --env staging     # Deploy to environment
wrangler versions list            # List versions
wrangler rollback [id]            # Rollback deployment
wrangler login                    # OAuth login
wrangler whoami                   # Check auth status
```

## Gerenciamento de recursos

### KV

```bash
wrangler kv namespace create NAME
wrangler kv key put "key" "value" --namespace-id=<id>
wrangler kv key get "key" --namespace-id=<id>
```

### D1

```bash
wrangler d1 create NAME
wrangler d1 execute NAME --command "SQL"
wrangler d1 migrations create NAME "description"
wrangler d1 migrations apply NAME
```

### R2

```bash
wrangler r2 bucket create NAME
wrangler r2 object put BUCKET/key --file path
wrangler r2 object get BUCKET/key
```

### Outros recursos

```bash
wrangler queues create NAME
wrangler vectorize create NAME --dimensions N --metric cosine
wrangler hyperdrive create NAME --connection-string "..."
wrangler workflows create NAME
wrangler constellation create NAME
wrangler pages project create NAME
wrangler pages deployment create --project NAME --branch main
```

### Secrets

```bash
wrangler secret put NAME          # Set Worker secret
wrangler secret list              # List Worker secrets
wrangler secret delete NAME       # Delete Worker secret
wrangler secret bulk FILE.json    # Bulk upload from JSON

# Secrets Store (centralized, reusable across Workers)
wrangler secret-store:secret put STORE_NAME SECRET_NAME
wrangler secret-store:secret list STORE_NAME
```

### Monitoramento

```bash
wrangler tail                     # Real-time logs
wrangler tail --env production    # Tail specific env
wrangler tail --status error      # Filter by status
```

## Nesta referência

- [auth.md](./auth.md) — Configuração de autenticação (`wrangler login`, tokens de API)
- [configuration.md](./configuration.md) — Configuração wrangler.jsonc, ambientes, bindings
- [api.md](./api.md) — API programática (`startWorker`, `getPlatformProxy`, eventos)
- [patterns.md](./patterns.md) — Fluxos comuns e padrões de desenvolvimento
- [gotchas.md](./gotchas.md) — Armadilhas, limites e resolução de problemas

## Árvore de decisão rápida

```
Need to test your Worker?
├─ Testing full Worker with bindings → api.md §startWorker
├─ Testing individual functions → api.md §getPlatformProxy
└─ Testing with Vitest → patterns.md §Testing with Vitest

Need to configure something?
├─ Bindings (KV, D1, R2, etc.) → configuration.md §Bindings
├─ Multiple environments → configuration.md §Environments
├─ Static files → configuration.md §Workers Assets
└─ Routing → configuration.md §Routing

Development not working?
├─ Local differs from production → Use `wrangler dev --remote`
├─ Bindings not available → gotchas.md §Binding Not Available
└─ Auth issues → auth.md

Authentication issues?
├─ "Not logged in" / "Unauthorized" → auth.md
├─ First time deploying → `wrangler login` (one-time OAuth)
└─ CI/CD setup → auth.md §API Token
```

## Ver também

- [workers](../workers/) — Referência da API de runtime dos Workers
- [miniflare](../miniflare/) — Testes locais com Miniflare
- [workerd](../workerd/) — Runtime que sustenta o `wrangler dev`

Documentação localizada no ecossistema mantido pelo Controllato Club.
