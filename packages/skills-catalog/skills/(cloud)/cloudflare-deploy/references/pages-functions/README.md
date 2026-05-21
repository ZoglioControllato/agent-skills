# Funções de páginas Cloudflare

Funções sem servidor em Cloudflare Pages usando Workers runtime. Desenvolvimento full-stack com roteamento baseado em arquivo.

## Navegação Rápida

**Preciso...**
| Tarefa | Vá para |
|------|-------|
| Configurar tipos TypeScript | [configuration.md](./configuration.md) - Configuração TypeScript |
| Configurar ligações (KV, D1, R2) | [configuration.md](./configuration.md) - wrangler.jsonc |
| Solicitação de acesso/env/params | [api.md](./api.md) - EventContext |
| Adicionar middleware ou autenticação | [patterns.md](./patterns.md) - Middleware, autenticação |
| Tarefas em segundo plano (waitUntil) | [patterns.md](./patterns.md) - Tarefas em segundo plano |
| Depurar erros ou verificar limites | [gotchas.md](./gotchas.md) - Erros comuns, limites |

## Árvore de decisão: esta página é função?```

Precisa de back-end sem servidor?
├─ Sim, para um site estático → Funções de páginas
├─ Sim, API independente → Trabalhadores
└─ Apenas hospedagem estática → Páginas (sem funções)

Tem trabalhador existente?
├─ Lógica de roteamento complexa → Use \_worker.js (modo avançado)
└─ Rotas simples → Migrar para /functions (baseado em arquivo)

Baseado em estrutura?
├─ Next.js/SvelteKit/Remix → Usa \_worker.js automaticamente
└─ Vanilla/HTML/React SPA → Usar /funções

```

## File-Based Routing

```

/functions
├── index.js → /
├── api.js → /api
├── users/
│ ├── index.js → /users/
│ ├── [user].js → /users/:user
│ └── [[catchall]].js → /users/\*
└── \_middleware.js → runs on all routes

````

**Rules:**

- `index.js` → directory root
- Trailing slash optional
- Specific routes precede catch-alls
- Falls back to static if no match

## Dynamic Routes

**Single segment** `[param]` → string:

```js
// /functions/users/[user].js
export function onRequest(context) {
  return new Response(`Hello ${context.params.user}`)
}
// Matches: /users/nevi
````

**Multi-segment** `[[param]]` → array:

```js
// /functions/users/[[catchall]].js
export function onRequest(context) {
  return new Response(JSON.stringify(context.params.catchall))
}
// Matches: /users/nevi/foobar → ["nevi", "foobar"]
```

## Principais recursos

- **Manipuladores de métodos:** `onRequestGet`, `onRequestPost`, etc.
- **Middleware:** `_middleware.js` para questões transversais
- **Ligações:** KV, D1, R2, Objetos Duráveis, IA de Trabalhadores, Ligações de Serviço
- **TypeScript:** Suporte completo a tipos por meio do comando `wrangler types`
- **Modo avançado:** Use `_worker.js` para lógica de roteamento personalizada

## Ordem de leitura

**Novo nas funções do Pages?** Comece aqui:

1. [README.md](./README.md) - Visão geral, roteamento, árvore de decisão (você está aqui)
2. [configuration.md](./configuration.md) - Configuração TypeScript, wrangler.jsonc, ligações
3. [api.md](./api.md) - EventContext, manipuladores, referência de ligações
4. [patterns.md](./patterns.md) - Middleware, autenticação, CORS, limitação de taxa, cache
5. [gotchas.md](./gotchas.md) - Erros comuns, depuração, limites

**Pesquisa rápida de referência:**

- Tabela de ligações → [api.md](./api.md)
- Diagnóstico de erros → [gotchas.md](./gotchas.md)
- Configuração do TypeScript → [configuration.md](./configuration.md)

## Veja também

- [páginas](../pages/) - Visão geral da plataforma de páginas e implantação de site estático
- [workers](../workers/) - Referência da API de tempo de execução de trabalhadores
- [d1](../d1/) - Integração de banco de dados D1 com Pages Functions
