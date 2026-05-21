# Configuração do AI Search

## Setup do Worker

```jsonc
// wrangler.jsonc
{
  "ai": { "binding": "AI" },
}
```

```typescript
interface Env {
  AI: Ai
}

const answer = await env.AI.autorag('my-instance').aiSearch({
  query: 'How do I configure caching?',
  model: '@cf/meta/llama-3.3-70b-instruct-fp8-fast',
})
```

## Fontes de dados

### Bucket R2

Dashboard: AI Search → Create Instance → Selecionar bucket R2

**Formatos suportados:** `.md`, `.txt`, `.html`, `.pdf`, `.doc`, `.docx`, `.csv`, `.json`

**Metadados indexados automaticamente:** `filename`, `folder`, `timestamp`

### Rastreador de site

Requisitos:

- Domínio na Cloudflare
- `sitemap.xml` na raiz
- Proteção contra bots deve permitir o user agent `CloudflareAISearch`

## Filtro de caminho (R2)

```
docs/**/*.md          # Todos .md em docs/ recursivo
**/*.draft.md         # Excluir (em padrões de exclusão)
```

## Indexação

- **Automática:** a cada 6 horas
- **Force Sync:** botão no dashboard (limite de 30 s entre syncs)
- **Pausar:** Settings → Pause Indexing (o índice existente continua pesquisável)

## Token de API de serviço

Dashboard: AI Search → Instance → Use AI Search → API → Create Token

Permissões:

- **Read** — operações de busca
- **Edit** — gerenciamento da instância

Armazene com segurança:

```bash
wrangler secret put AI_SEARCH_TOKEN
```

## Multi-ambiente

```toml
# wrangler.toml
[env.production.vars]
AI_SEARCH_INSTANCE = "prod-docs"

[env.staging.vars]
AI_SEARCH_INSTANCE = "staging-docs"
```

```typescript
const answer = await env.AI.autorag(env.AI_SEARCH_INSTANCE).aiSearch({ query })
```

## Monitoramento

```typescript
const instances = await env.AI.autorag('_').listInstances()
console.log(instances.find((i) => i.name === 'docs'))
```

O dashboard mostra: arquivos indexados, status, horário da última indexação, uso de armazenamento.
