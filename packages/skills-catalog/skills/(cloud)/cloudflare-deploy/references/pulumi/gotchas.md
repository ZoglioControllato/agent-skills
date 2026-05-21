# Resolução de problemas e boas práticas

## Erros comuns

### "No bundler/build step" — Pulumi envia código cru

**Problema:** Worker falha com "Cannot use import statement outside a module"  
**Causa:** Pulumi não faz bundle do código do Worker — envia exatamente o que você passa  
**Solução:** Faça o build do Worker ANTES do deploy Pulumi

```typescript
// WRONG: Pulumi won't bundle this
const worker = new cloudflare.WorkerScript('worker', {
  content: fs.readFileSync('./src/index.ts', 'utf8'), // Raw TS file
})

// RIGHT: Build first, then deploy
import * as command from '@pulumi/command'
const build = new command.local.Command('build', {
  create: 'npm run build',
  dir: './worker',
})
const worker = new cloudflare.WorkerScript(
  'worker',
  {
    content: build.stdout.apply(() => fs.readFileSync('./worker/dist/index.js', 'utf8')),
  },
  { dependsOn: [build] },
)
```

### "wrangler.toml not consumed" — drift de config

**Problema:** `wrangler dev` local funciona, deploy Pulumi falha  
**Causa:** Pulumi ignora wrangler.toml — é preciso duplicar config  
**Solução:** Gere wrangler.toml a partir do Pulumi ou mantenha sincronizado manualmente

```typescript
// Pattern: Export Pulumi config to wrangler.toml
const workerConfig = {
  name: 'my-worker',
  compatibilityDate: '2025-01-01',
  compatibilityFlags: ['nodejs_compat'],
}

new command.local.Command('generate-wrangler', {
  create: pulumi.interpolate`cat > wrangler.toml <<EOF
name = "${workerConfig.name}"
compatibility_date = "${workerConfig.compatibilityDate}"
compatibility_flags = ${JSON.stringify(workerConfig.compatibilityFlags)}
EOF`,
})
```

### "False no-changes detection" — SHA de conteúdo inalterado

**Problema:** Código do Worker atualizado, Pulumi diz "no changes"  
**Causa:** Hash de conteúdo idêntico (mudança só em espaço/comentário)  
**Solução:** Adicione timestamp de build ou versão para forçar update

```typescript
const version = Date.now().toString()
const worker = new cloudflare.WorkerScript('worker', {
  content: code,
  plainTextBindings: [{ name: 'VERSION', text: version }], // força novo deploy
})
```

### "D1 migrations don't run on pulumi up"

**Problema:** Schema do banco não aplicado após criar D1  
**Causa:** Pulumi cria o banco mas não roda migrações  
**Solução:** Use recurso Command com dependsOn

```typescript
const db = new cloudflare.D1Database('db', { accountId, name: 'mydb' })

// Run migrations after DB created
const migration = new command.local.Command(
  'migrate',
  {
    create: pulumi.interpolate`wrangler d1 execute ${db.name} --file ./schema.sql`,
  },
  { dependsOn: [db] },
)

// Worker depende das migrações
const worker = new cloudflare.WorkerScript(
  'worker',
  {
    d1DatabaseBindings: [{ name: 'DB', databaseId: db.id }],
  },
  { dependsOn: [migration] },
)
```

### "Missing required property 'accountId'"

**Problema:** `Error: Missing required property 'accountId'`  
**Causa:** Account ID não fornecido na configuração do recurso  
**Solução:** Adicione na config do stack

```yaml
# Pulumi.<stack>.yaml
config:
  cloudflare:accountId: 'abc123...'
```

### "Binding name mismatch"

**Problema:** Worker falha com "env.MY_KV is undefined"  
**Causa:** Nome do binding no Pulumi ≠ nome no código do Worker  
**Solução:** Deve coincidir exatamente (sensível a maiúsculas)

```typescript
// Pulumi
kvNamespaceBindings: [{ name: 'MY_KV', namespaceId: kv.id }]

// Worker code
export default {
  async fetch(request, env) {
    await env.MY_KV.get('key')
  },
}
```

### "API token permissions insufficient"

**Problema:** `Error: authentication error (10000)`  
**Causa:** Token sem permissões necessárias  
**Solução:** Conceda permissões: Account.Workers Scripts:Edit, Account.Account Settings:Read

### "Resource not found after import"

**Problema:** Recurso importado aparece como alterado no próximo `pulumi up`  
**Causa:** State não bate com o recurso real e o código Pulumi  
**Solução:** Verifique nomes/tipos de propriedades exatamente

```bash
pulumi import cloudflare:index/workerScript:WorkerScript my-worker <account_id>/<worker_name>
pulumi preview # If shows changes, adjust Pulumi code to match actual resource
```

### "v6.x Worker versioning confusion"

**Problema:** Worker implantado mas não recebe tráfego  
**Causa:** v6.x exige Worker + WorkerVersion + WorkersDeployment (3 recursos)  
**Solução:** Use WorkerScript (versionamento automático) OU o padrão completo de versionamento

```typescript
// SIMPLES: WorkerScript versiona automaticamente (comportamento padrão)
const worker = new cloudflare.WorkerScript('worker', {
  accountId,
  name: 'my-worker',
  content: code,
})

// AVANÇADO: versionamento manual para lançamentos graduais (v6.x)
const worker = new cloudflare.Worker('worker', { accountId, name: 'my-worker' })
const version = new cloudflare.WorkerVersion('v1', {
  accountId,
  workerId: worker.id,
  content: code,
  compatibilityDate: '2025-01-01',
})
const deployment = new cloudflare.WorkersDeployment('prod', {
  accountId,
  workerId: worker.id,
  versionId: version.id,
})
```

## Boas práticas

1. **Defina sempre compatibilityDate** — fixa o comportamento do Worker e evita breaking changes
2. **Build antes do deploy** — Pulumi não faz bundle; use Command ou etapa de build no CI
3. **Nomes de binding alinhados** — sensíveis a maiúsculas; devem bater entre Pulumi e código
4. **dependsOn para migrações** — garanta migrações D1 antes do deploy do Worker
5. **Versione o conteúdo do Worker** — binding VERSION para forçar redeploy quando o conteúdo muda
6. **Segredos na config do stack** — use `pulumi config set --secret` para chaves de API

## Limites

| Recurso                 | Limite                    | Observações                                           |
| ----------------------- | ------------------------- | ----------------------------------------------------- |
| Tamanho do script       | 10 MB                     | Inclui dependências, após compressão                  |
| Tempo de CPU do Worker  | 50ms (grátis), 30s (pago) | Por requisição                                        |
| Chaves KV por namespace | Ilimitado                 | 1000 esc/s escrita, 100k esc/s leitura                |
| Armazenamento R2        | Ilimitado                 | Ops classe A: 1M/mês grátis, classe B: 10M/mês grátis |
| Bancos D1               | 50.000 por conta          | Grátis: 10 por conta, 5 GB cada                       |
| Filas                   | 10.000 por conta          | Grátis: 1M ops/dia                                    |
| Projetos Pages          | 500 por conta             | Grátis: 100 projetos                                  |
| Requisições API         | Varia por plano           | ~1200 req/5min no grátis                              |

## Recursos

- **Pulumi Registry:** https://www.pulumi.com/registry/packages/cloudflare/
- **API Docs:** https://www.pulumi.com/registry/packages/cloudflare/api-docs/
- **GitHub:** https://github.com/pulumi/pulumi-cloudflare
- **Cloudflare Docs:** https://developers.cloudflare.com/
- **Workers Docs:** https://developers.cloudflare.com/workers/

---

Ver: [README.md](./README.md), [configuration.md](./configuration.md), [api.md](./api.md), [patterns.md](./patterns.md)

Documentação localizada no ecossistema mantido pelo Controllato Club.
