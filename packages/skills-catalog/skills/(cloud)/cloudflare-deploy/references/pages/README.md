# Cloudflare Pages

Plataforma JAMstack para apps full-stack na rede global da Cloudflare.

## Recursos principais

- **Deploys via Git**: deploy automático a partir de GitHub/GitLab
- **Preview deployments**: URL única por branch/PR
- **Pages Functions**: roteamento serverless por arquivos (runtime Workers)
- **Estático + dinâmico**: cache inteligente de assets + compute na edge
- **Smart Placement**: otimização automática de funções conforme tráfego
- **Frameworks**: SvelteKit, Astro, Nuxt, Qwik, Solid Start

## Métodos de deploy

### 1. Integração Git (produção)

Dashboard → Workers & Pages → Create → Connect to Git → Configure build

### 2. Upload direto

```bash
npx wrangler pages deploy ./dist --project-name=my-project
npx wrangler pages deploy ./dist --project-name=my-project --branch=staging
```

### 3. CLI C3

```bash
npm create cloudflare@latest my-app
# Escolha framework → setup + deploy automáticos
```

## Workers vs Pages

- **Pages**: sites estáticos, JAMstack, frameworks, fluxo git, roteamento por arquivo
- **Workers**: APIs puras, roteamento complexo, WebSockets, agendados, email handlers
- **Combinar**: Pages Functions usam runtime Workers; podem fazer bind com Workers

## Início rápido

```bash
# Criar
npm create cloudflare@latest

# Dev local
npx wrangler pages dev ./dist

# Deploy
npx wrangler pages deploy ./dist --project-name=my-project

# Tipos
npx wrangler types --path='./functions/types.d.ts'

# Secrets
echo "value" | npx wrangler pages secret put KEY --project-name=my-project

# Logs
npx wrangler pages deployment tail --project-name=my-project
```

## Recursos

- [Pages Docs](https://developers.cloudflare.com/pages/)
- [Functions API](https://developers.cloudflare.com/pages/functions/api-reference/)
- [Framework Guides](https://developers.cloudflare.com/pages/framework-guides/)
- [Discord #functions](https://discord.com/channels/595317990191398933/910978223968518144)

## Ordem de leitura

**Novo no Pages?**

1. README.md (você está aqui) — visão geral e início rápido
2. [configuration.md](./configuration.md) — projeto, wrangler.jsonc, bindings
3. [api.md](./api.md) — API Functions, roteamento, contexto
4. [patterns.md](./patterns.md) — implementações comuns
5. [gotchas.md](./gotchas.md) — troubleshooting

**Referência rápida?** Abra o arquivo relevante acima.

## Nesta referência

- [configuration.md](./configuration.md) — wrangler.jsonc, build, env, Smart Placement
- [api.md](./api.md) — API Functions, bindings, contexto, modo avançado
- [patterns.md](./patterns.md) — padrões full-stack, integração com frameworks
- [gotchas.md](./gotchas.md) — build, limites, debug, avisos de frameworks

## Ver também

- [pages-functions](../pages-functions/) — roteamento por arquivo, middleware
- [d1](../d1/) — SQL para Pages Functions
- [kv](../kv/) — KV para cache/estado
