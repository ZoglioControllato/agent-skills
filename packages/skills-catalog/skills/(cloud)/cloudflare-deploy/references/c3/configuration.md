# Configuração gerada C3

## Estrutura de saída

```
my-app/
├── src/index.ts          # Worker entry point
├── wrangler.jsonc        # Cloudflare config
├── package.json          # Scripts
├── tsconfig.json
└── .gitignore
```

##wrangler.jsonc

```jsonc
{
  "$schema": "https://raw.githubusercontent.com/cloudflare/workers-sdk/main/packages/wrangler/config-schema.json",
  "name": "my-app",
  "main": "src/index.ts",
  "compatibility_date": "2026-01-27",
}
```

##Espaços reservados para vinculação

C3 gera **IDs de espaço reservado** que devem ser substituídos antes da implantação:

```jsonc
{
  "kv_namespaces": [{ "binding": "MY_KV", "id": "placeholder_kv_id" }],
  "d1_databases": [{ "binding": "DB", "database_id": "00000000-..." }],
}
```

**Substitua por IDs reais:**

```bash
npx wrangler kv namespace create MY_KV   # Returns real ID
npx wrangler d1 create my-database       # Returns real database_id
```

**Erro de implantação se não for substituído:**

```
Error: Invalid KV namespace ID "placeholder_kv_id"
```

##Roteiros

```json
{
  "scripts": {
    "dev": "wrangler dev",
    "deploy": "wrangler deploy",
    "cf-typegen": "wrangler types"
  }
}
```

##Geração de tipo

Execute depois de adicionar ligações:

````bash
npm run cf-typegen
```Gera `.wrangler/types/runtime.d.ts`:
```typescript
interface Env {
  MY_KV: KVNamespace
  DB: D1Database
}
````

##Lista de verificação pós-criação

1. Revise `wrangler.jsonc` - verifique o nome, compatibilidade_data
2. Substitua IDs de ligação de espaço reservado por IDs de recursos reais
3. Execute `npm run cf-typegen`
4. Teste: `npm run dev`
5. Implantar: `npm run deploy`
6. Adicione segredos: `npx wrangler secret put SECRET_NAME`
