# Provedor Cloudflare Pulumi

Guia para o Cloudflare Pulumi Provider (@pulumi/cloudflare).

## Visão geral

Gestão programática de recursos Cloudflare: Workers, Pages, D1, KV, R2, DNS, Queues, etc.

**Pacotes:**

- TypeScript/JS: `@pulumi/cloudflare`
- Python: `pulumi-cloudflare`
- Go: `github.com/pulumi/pulumi-cloudflare/sdk/v6/go/cloudflare`
- .NET: `Pulumi.Cloudflare`

**Versão:** v6.x

## Princípios centrais

1. Use tokens de API (não chaves de API legadas)
2. Guarde `accountId` na config do stack
3. Alinhe nomes de binding entre código e config
4. Use `module: true` para ES modules
5. Defina `compatibilityDate` para fixar comportamento

## Autenticação

```typescript
import * as cloudflare from '@pulumi/cloudflare'

// API Token (recommended): CLOUDFLARE_API_TOKEN env
const provider = new cloudflare.Provider('cf', { apiToken: process.env.CLOUDFLARE_API_TOKEN })

// API Key (legacy): CLOUDFLARE_API_KEY + CLOUDFLARE_EMAIL env
const provider = new cloudflare.Provider('cf', {
  apiKey: process.env.CLOUDFLARE_API_KEY,
  email: process.env.CLOUDFLARE_EMAIL,
})

// API User Service Key: CLOUDFLARE_API_USER_SERVICE_KEY env
const provider = new cloudflare.Provider('cf', { apiUserServiceKey: process.env.CLOUDFLARE_API_USER_SERVICE_KEY })
```

## Configuração

**Pulumi.yaml:**

```yaml
name: my-cloudflare-app
runtime: nodejs
config:
  cloudflare:apiToken:
    value: ${CLOUDFLARE_API_TOKEN}
```

**Pulumi.<stack>.yaml:**

```yaml
config:
  cloudflare:accountId: 'abc123...'
```

**index.ts:**

```typescript
import * as pulumi from '@pulumi/pulumi'
import * as cloudflare from '@pulumi/cloudflare'
const accountId = new pulumi.Config('cloudflare').require('accountId')
```

## Tipos de recurso comuns

- `Provider` — configuração do provider
- `WorkerScript` — Worker
- `WorkersKvNamespace` — KV
- `R2Bucket` — R2
- `D1Database` — D1
- `Queue` — fila
- `PagesProject` — Pages
- `DnsRecord` — DNS
- `WorkerRoute` — rota de Worker
- `WorkersDomain` — domínio customizado

## Propriedades importantes

- `accountId` — obrigatório na maioria dos recursos
- `zoneId` — obrigatório para DNS/domínio
- `name`/`title` — identificador do recurso
- `*Bindings` — conecta recursos aos Workers

## Ordem de leitura

| Ordem | Arquivo                                | Conteúdo                                            | Quando ler                            |
| ----- | -------------------------------------- | --------------------------------------------------- | ------------------------------------- |
| 1     | [configuration.md](./configuration.md) | Config de Workers/KV/D1/R2/Queues/Pages             | Primeiro setup, referência de recurso |
| 2     | [patterns.md](./patterns.md)           | Padrões de arquitetura, multiambiente, componentes  | Apps complexos, boas práticas         |
| 3     | [api.md](./api.md)                     | Outputs, dependências, imports, providers dinâmicos | Recursos avançados, integrações       |
| 4     | [gotchas.md](./gotchas.md)             | Erros comuns, limites, resolução                    | Depuração, falhas de deploy           |

## Nesta referência

- [configuration.md](./configuration.md) — Provider, stack, Workers/bindings
- [api.md](./api.md) — Tipos, script, KV/D1/R2/filas/Pages
- [patterns.md](./patterns.md) — Multiambiente, segredos, CI/CD, stacks
- [gotchas.md](./gotchas.md) — State, falhas de deploy, limites

## Ver também

- [terraform](../terraform/) — IaC alternativa para Cloudflare
- [wrangler](../wrangler/) — Deploy via CLI
- [workers](../workers/) — Runtime dos Workers

Documentação localizada no ecossistema mantido pelo Controllato Club.
