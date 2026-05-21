---
name: netlify-deploy
description: Implanta projetos web na Netlify usando a Netlify CLI (`npx netlify`). Use quando o usuário pedir para implantar, hospedar, publicar ou vincular um site/repositório na Netlify, inclusive deploys de preview e produção. NÃO use para implantar na Vercel, Cloudflare ou Render (use as skills respectivas).
metadata:
  author: github.com/openai/skills
  version: '1.0.0'
---

# Skill de deploy na Netlify

Implante projetos web na Netlify com a CLI, detectando configuração do projeto e contexto de deploy.

## Visão geral

Esta skill automatiza deploys na Netlify ao:

- Verificar autenticação da Netlify CLI
- Detectar configuração e framework do projeto
- Vincular a sites existentes ou criar novos
- Implantar em produção ou ambientes de preview

## Pré-requisitos

- **Netlify CLI**: via npx (sem instalação global)
- **Autenticação**: conta Netlify com sessão ativa
- **Projeto**: projeto web válido no diretório atual
- Se o sandbox bloquear rede do deploy, rode novamente com `sandbox_permissions=require_escalated`.
- O deploy pode levar alguns minutos. Use timeouts adequados.

## Padrão de autenticação

A skill usa **CLI Netlify pré-autenticada**:

1. Verifique o status com `npx netlify status`
2. Se não estiver autenticado, oriente `npx netlify login`
3. Falhe com mensagem clara se não for possível autenticar

A autenticação pode ser:

- **OAuth no navegador** (principal): `netlify login` abre o navegador
- **API Key** (alternativa): variável de ambiente `NETLIFY_AUTH_TOKEN`

## Fluxo de trabalho

### 1. Verificar autenticação da Netlify CLI

Confira se o usuário está logado:

```bash
npx netlify status
```

**Padrões esperados de saída**:

- Autenticado: mostra e-mail e status de vínculo do site
- Não autenticado: "Not logged into any site" ou erro de autenticação

**Se não autenticado**, oriente:

```bash
npx netlify login
```

Isso abre o navegador para OAuth. Após login, verifique com `netlify status`.

**Alternativa: autenticação por API Key**

```bash
export NETLIFY_AUTH_TOKEN=your_token_here
```

Tokens: https://app.netlify.com/user/applications#personal-access-tokens

### 2. Detectar vínculo do site

A partir da saída de `netlify status`:

- **Vinculado**: site já conectado (mostra nome/URL)
- **Não vinculado**: é preciso vincular ou criar site

### 3. Vincular a site existente ou criar novo

**Se já vinculado** → vá ao passo 4

**Se não**, tente vincular pelo remote Git:

```bash
# Verifique se o projeto usa Git
git remote show origin

# Se usar Git, extraia a URL do remote
# Formato: https://github.com/username/repo ou git@github.com:username/repo.git

# Tente vincular pela URL Git
npx netlify link --git-remote-url <REMOTE_URL>
```

**Se o link falhar** (site não existe na Netlify):

```bash
npx netlify init
```

Isso guia:

1. Escolha de equipe/conta
2. Nome do site
3. Configurações de build
4. Criação de netlify.toml se necessário

### 4. Verificar dependências

Antes do deploy, certifique-se de que dependências estão instaladas:

```bash
npm install

# Para outros gerenciadores, detecte e use o comando adequado
# yarn install, pnpm install, etc.
```

### 5. Deploy na Netlify

Escolha o tipo pelo contexto:

**Deploy preview/rascunho** (padrão para sites existentes):

```bash
npx netlify deploy
```

Cria preview com URL única para testes.

**Deploy produção** (sites novos ou pedido explícito):

```bash
npx netlify deploy --prod
```

Publica na URL de produção.

**Processo**:

1. CLI detecta configurações de build (netlify.toml ou prompts)
2. Faz build local
3. Envia artefatos para a Netlify
4. Devolve URL do deployment

### 6. Reportar resultados

Após o deploy:

- **URL do deploy**: URL única deste deployment
- **URL do site**: URL de produção (se `--prod`)
- **Logs**: link ao dashboard para logs
- **Próximos passos**: `netlify open`, etc.

## Tratamento de netlify.toml

Se existir `netlify.toml`, a CLI usa automaticamente. Caso contrário, pode pedir:

- **Build command**: ex. `npm run build`, `next build`
- **Publish directory**: ex. `dist`, `build`, `.next`

Defaults comuns:

- **Next.js**: build `npm run build`, publish `.next`
- **React (Vite)**: build `npm run build`, publish `dist`
- **HTML estático**: sem build, publish diretório atual

Detecte framework pelo `package.json` quando possível.

## Exemplo de fluxo completo

```bash
# 1. Autenticação
npx netlify status

npx netlify login

# 2. Vincular (se preciso)
git remote show origin
npx netlify link --git-remote-url https://github.com/user/repo

npx netlify init

# 3. Dependências
npm install

# 4. Deploy preview
npx netlify deploy

# 5. Produção
npx netlify deploy --prod
```

## Tratamento de erros

**"Not logged in"**
→ `npx netlify login`

**"No site linked"**
→ `npx netlify link` ou `npx netlify init`

**"Build failed"**
→ comando de build e diretório publish em netlify.toml ou prompts
→ dependências instaladas
→ logs de build

**"Publish directory not found"**
→ build concluiu?
→ caminho do publish correto?

## Solução de problemas

### Rede com permissões elevadas

Se falhar por rede (timeouts, DNS, resets), rode com permissões elevadas (`sandbox_permissions=require_escalated`).

```
The deploy needs escalated network access to deploy to Netlify. I can rerun the command with escalated permissions—want me to proceed?
```

## Variáveis de ambiente

Para secrets e configuração:

1. Nunca commite secrets no Git
2. Configure no dashboard: Site Settings → Environment Variables
3. Nos builds: `process.env.VARIABLE_NAME`

## Dicas

- Use `netlify deploy` (sem `--prod`) primeiro para testar
- `netlify open` para abrir no dashboard
- `netlify logs` para logs de Functions
- `netlify dev` para dev local com Functions

## Referência

- Netlify CLI Docs: https://docs.netlify.com/cli/get-started/
- netlify.toml Reference: https://docs.netlify.com/configure-builds/file-based-configuration/

## Referências incluídas (carregar sob demanda)

- [CLI commands](references/cli-commands.md)
- [Deployment patterns](references/deployment-patterns.md)
- [netlify.toml guide](references/netlify-toml.md)
