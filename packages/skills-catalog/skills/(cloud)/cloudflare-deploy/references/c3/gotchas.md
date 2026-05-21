# Solução de problemas C3

## Problemas de implantação

### IDs de espaço reservado

**Erro:** "ID de namespace inválido"  
**Correção:** Substitua os espaços reservados em wrangler.jsonc por IDs reais:

```bash
npx wrangler kv namespace create MY_KV  # Get real ID
```

### Autenticação

**Erro:** "Não autenticado"  
**Correção:** `npx wrangler login` ou defina `CLOUDFLARE_API_TOKEN`

### Conflito de nomes

**Erro:** "O trabalhador já existe"  
**Correção:** Altere o `nome` em wrangler.jsonc

## Seleção de plataforma

| Necessidade                                   | Plataforma                   |
| --------------------------------------------- | ---------------------------- |
| Integração Git, visualizações de ramificações | `--plataforma=páginas`       |
| Objetos Duráveis, D1, Filas                   | Trabalhadores (predefinição) |

Plataforma errada? Recrie com o sinalizador `--platform` correto.

## Problemas de TypeScript

**"Não foi possível encontrar o nome 'KVNamespace'"**

```bash
npm run cf-typegen  # Regenerate types
# Restart TS server in editor
```

**Tipos ausentes após alteração de configuração:** Execute novamente `npm run cf-typegen`

## Gerenciador de pacotes

**Vários arquivos de bloqueio causando problemas:**

```bash
rm pnpm-lock.yaml  # If using npm
rm package-lock.json  # If using pnpm
```

##CI/CD

**CI trava nos prompts:**

```bash
npm create cloudflare@latest my-app -- \
  --type=hello-world --lang=ts --no-git --no-deploy
```

**Autenticação em CI:**

```yaml
env:
  CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}
  CLOUDFLARE_ACCOUNT_ID: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
```

##Específico da estrutura

| Estrutura  | Edição                                 | Correção                                   |
| ---------- | -------------------------------------- | ------------------------------------------ |
| Próximo.js | falha na criação do próximo aplicativo | `npm cache clean --force`, tente novamente |
| Astro      | Adaptador ausente                      | Instale `@astrojs/cloudflare`              |
| Remixar    | Erros de módulo                        | Atualizar `@remix-run/cloudflare*`         |

## Data de compatibilidade

**"O recurso X requer compatibilidade_data >= ..."**  
**Correção:** Atualize `compatibility_date` em wrangler.jsonc para a data de hoje

## Versão do Node.js.

**"Versão Node.js não suportada"**  
**Correção:** Instale o Node.js 18+ (`nvm install 20`)

## Referência rápida

| Erro                                 | Causa                          | Correção                              |
| ------------------------------------ | ------------------------------ | ------------------------------------- |
| ID de namespace inválido             | Vinculação de espaço reservado | Criar recurso, atualizar configuração |
| Não autenticado                      | Sem login                      | `login do wrangler npx`               |
| Não é possível encontrar KVNamespace | Tipos ausentes                 | `npm execute cf-typegen`              |
| Já existe trabalhador                | Conflito de nomes              | Alterar `nome`                        |
| CI trava                             | Bandeiras ausentes             | Adicione --type, --lang, --no-deploy  |
| Modelo não encontrado                | Mau nome                       | Verifique cloudflare/modelos          |
