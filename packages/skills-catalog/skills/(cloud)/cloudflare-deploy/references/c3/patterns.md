# Padrões de uso C3

## Fluxos de trabalho rápidos

```bash
# TypeScript API Worker
npm create cloudflare@latest my-api -- --type=hello-world --lang=ts --deploy

# Next.js on Pages
npm create cloudflare@latest my-app -- --type=web-app --framework=next --platform=pages --ts --deploy

# Astro static site
npm create cloudflare@latest my-blog -- --type=web-app --framework=astro --platform=pages --ts
```

##CI/CD (ações do GitHub)

```yaml
- name: Deploy
  run: npm run deploy
  env:
    CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}
    CLOUDFLARE_ACCOUNT_ID: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
```

**Não interativo requer:**

```bash
--type=<value>       # Required
--no-git             # Recommended (CI already in git)
--no-deploy          # Deploy separately with secrets
--framework=<value>  # For web-app
--ts / --no-ts       # Required
```

## Monorepo

C3 detecta a configuração do espaço de trabalho (espaços de trabalho `package.json` ou `pnpm-workspace.yaml`).

```bash
cd packages/
npm create cloudflare@latest my-worker -- --type=hello-world --lang=ts --no-deploy
```

##Modelos personalizados

```bash
# GitHub repo
npm create cloudflare@latest -- --template=username/repo
npm create cloudflare@latest -- --template=cloudflare/templates/worker-openapi

# Local path
npm create cloudflare@latest my-app -- --template=../my-template
```

**O modelo requer `c3.config.json`:**

```json
{
  "name": "my-template",
  "category": "hello-world",
  "copies": [{ "path": "src/" }, { "path": "wrangler.jsonc" }],
  "transforms": [{ "path": "package.json", "jsonc": { "name": "{{projectName}}" } }]
}
```

##Projetos Existentes

```bash
# Add Cloudflare to existing Worker
npm create cloudflare@latest . -- --type=pre-existing --existing-script=./dist/index.js

# Add to existing framework app
npm create cloudflare@latest . -- --type=web-app --framework=next --platform=pages --ts
```

##Lista de verificação pós-criação

1. Revise `wrangler.jsonc` - defina `compatibility_date`, verifique `name`
2. Crie ligações: `wrangler kv namespace create`, `wrangler d1 create`, `wrangler r2 bucket create`
3. Gere tipos: `npm run cf-typegen`
4. Teste: `npm run dev`
5. Implantar: `npm run deploy`
6. Defina segredos: `wrangler secret put SECRET_NAME`
