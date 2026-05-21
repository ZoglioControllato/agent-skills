# Padrões de implantação do Netlify

Cenários de implantação comuns e práticas recomendadas para a habilidade Netlify.

## Árvore de decisão de implantação```

Is user authenticated?
├─ No → Run `netlify login`
└─ Yes → Is site linked?
├─ No → Is it a Git repo?
│ ├─ Yes → Try `netlify link --git-remote-url`
│ │ ├─ Success → Continue to deploy
│ │ └─ Fail → Run `netlify init`
│ └─ No → Run `netlify init`
└─ Yes → Is this first deploy or existing site?
├─ First deploy/new site → `netlify deploy --prod`
└─ Existing site → `netlify deploy` (preview)

````
## Cenário 1: implantação inicial (novo projeto)

**Contexto**: o usuário tem um projeto que nunca foi implantado no Netlify.

**Etapas**:

1. Verifique a autenticação: `npx netlify status`
2. Se não for autenticado: `npx netlify login`
3. Inicialize o novo site: `npx netlify init`
   - Isso orienta o usuário durante a configuração
   - Cria netlify.toml se necessário
4. Instale dependências: `npm install`
5. Implante na produção: `npx netlify deploy --prod`

**Exemplo**:```bash
npx netlify status
# Not linked to a site

npx netlify login
# Opens browser for authentication

npx netlify init
# Walks through site creation

npm install
npx netlify deploy --prod
````

## Cenário 2: vinculando o repositório Git existente ao site existente

**Contexto**: O usuário já possui um site no Netlify e deseja vincular seu repositório local.

**Etapas**:

1. Verifique a autenticação: `npx netlify status`
2. Obtenha o Git remoto: `git remote show origin`
3. Extraia o URL (por exemplo, `https://github.com/user/repo.git`)
4. Link por controle remoto: `npx netlify link --git-remote-url <URL>`
5. Se encontrado, vinculado. Caso contrário, execute `netlify init`

**Exemplo**:```bash
git remote show origin

# \* remote origin

# Fetch URL: https://github.com/user/my-app.git

npx netlify link --git-remote-url https://github.com/user/my-app.git

# Site linked successfully

````
## Cenário 3: Pré-visualização da implantação (teste de alterações)

**Contexto**: o usuário deseja testar as alterações antes de enviar para produção.

**Etapas**:

1. Certifique-se de que o site esteja vinculado: `npx netlify status`
2. Faça alterações no código
3. Visualização da implantação: `npx netlify deploy`
4. Revise o URL de visualização
5. Se aprovado, implante no prod: `npx netlify deploy --prod`

**Exemplo**:```bash
# Make changes to code

npx netlify deploy
# Draft deploy URL: https://507f1f77bcf86cd799439011-my-app.netlify.app

# Test the preview, then:
npx netlify deploy --prod
````

## Cenário 4: implantações específicas da estrutura

### Próximo.js```bash

# Next.js typically uses .next as output

npx netlify deploy --prod

# netlify.toml should have:

# [build]

# command = "npm run build"

# publish = ".next"

````
### Reagir (Vite)```bash
# Vite outputs to dist by default
npm run build
npx netlify deploy --dir=dist --prod

# netlify.toml:
# [build]
#   command = "npm run build"
#   publish = "dist"
````

### HTML estático```bash

# No build step needed

npx netlify deploy --dir=. --prod

````
## Cenário 5: implantação do Monorepo

**Contexto**: o projeto está em um subdiretório de um monorepo.

**Etapas**:

1. Navegue até o subdiretório do projeto: `cd packages/frontend`
2. Ou defina a base em netlify.toml:
   ```toml
   [construir]
     base = "pacotes/frontend"
     comando = "npm executar compilação"
     publicar = "dist"
````

3. Implante normalmente: `npx netlify deploy --prod`

## Cenário 6: Variáveis de Ambiente

**Contexto**: o projeto precisa de segredos ou configuração específica do ambiente.

**Etapas**:

1. Nunca comprometa segredos com o Git
2. Defina no painel Netlify ou CLI:
   ```bash
   npx netlify env:set API_KEY "valor_secreto"
   npx netlify env:set NODE_ENV "produção"
   ```
3. Acesso no código: `process.env.API_KEY`
4. Implantar: `npx netlify implantar --prod`

## Cenário 7: Configuração de domínio personalizado

**Contexto**: o usuário deseja usar um domínio personalizado.

**Passos**:

1. Implante o site primeiro: `npx netlify deploy --prod`
2. Adicione domínio via painel ou CLI:
   ```bash
   npx netlify aberto:admin
   # Navegue até as configurações do domínio
   ```
3. Atualize os registros DNS conforme instruções do Netlify
4. Aguarde a propagação do DNS (pode levar até 48 horas)

## Melhores práticas

### 1. Sempre visualize primeiro```bash

# Deploy preview

npx netlify deploy

# Test thoroughly

# Then deploy to production

npx netlify deploy --prod

````
### 2. Use netlify.toml para consistência

Crie um arquivo `netlify.toml` na raiz do seu repositório:```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
````

Isso garante construções consistentes em todas as implantações.

### 3. Detecção de estrutura

Deixe o Netlify detectar automaticamente quando possível. Especifique as configurações de compilação apenas se:

- Netlify não consegue detectar sua estrutura
- Você precisa de comandos de construção personalizados
- Seu projeto possui uma estrutura fora do padrão

### 4. Instalação de dependência

Certifique-se sempre de que as dependências estejam instaladas antes da implantação:```bash
npm install # or yarn install, pnpm install
npx netlify deploy

````
### 5. Construa primeiro localmente

Teste as compilações localmente antes de implantar:```bash
npm run build
# Check that build output exists

npx netlify deploy --dir=dist
````

### 6. Use mensagens de implantação

Adicione contexto às implantações:```bash
npx netlify deploy --prod --message="Fix login bug"

````
## Padrões de recuperação de erros

### "Diretório de publicação não encontrado"

**Causa**: o comando Build não criou o diretório de saída esperado.

**Corrigir**:

1. Execute build localmente: `npm run build`
2. Verifique o nome do diretório de saída
3. Atualize os prompts netlify.toml ou CLI com o caminho correto

### "Comando falhou com código de saída 1"

**Causa**: Falha no comando de compilação.

**Consertar**:

1. Verifique os logs de construção em busca de erros específicos
2. Execute build localmente para reproduzir: `npm run build`
3. Corrija o erro de construção
4. Implante novamente

### "Não logado"

**Causa**: O token de autenticação expirou ou está ausente.

**Consertar**:```bash
npx netlify logout
npx netlify login
````

### "Nenhum site vinculado"

**Causa**: Projeto não conectado a um site Netlify.

**Consertar**:```bash

# Try linking to existing site

npx netlify link

# Or create new site

npx netlify init

````
## Dicas de desempenho

1. **Ativar processamento** em netlify.toml para otimização automática:

   ```toml
   [build.processing.css]
     pacote = verdadeiro
     minificar = verdadeiro
````

2. **Use cabeçalhos de cache** para ativos estáticos:

   ```toml
   [[cabeçalhos]]
     for = "/ativos/*"
     [cabeçalhos.valores]
       Cache-Control = "público, idade máxima = 31536000, imutável"
   ```

3. **Otimize imagens** antes de implantar ou usar Netlify Image CDN

4. **Use funções Netlify** para back-end sem servidor (evite chamadas de API externas quando possível)

## Recursos

- Documentação CLI do Netlify: https://docs.netlify.com/cli/get-started/
- Guias de integração de estrutura: https://docs.netlify.com/frameworks/
- Configuração de compilação: https://docs.netlify.com/configure-builds/
