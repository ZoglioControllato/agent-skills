---
name: render-deploy
description: Implanta aplicações na Render analisando bases de código, gerando Blueprints render.yaml e fornecendo deeplinks do Dashboard. Use quando o usuário quiser implantar, hospedar, publicar ou configurar a aplicação na plataforma em nuvem Render. NÃO use para implantar na Vercel, Netlify ou Cloudflare (use as skills respectivas).
metadata:
  author: github.com/openai/skills
  version: '1.0.0'
---

# Deploy na Render

A Render oferece serviços **com Git** e serviços com **imagem Docker pré-construída**.

Esta skill cobre fluxos **com Git**:

1. **Método Blueprint** — Gerar render.yaml para deploys Infrastructure-as-Code
2. **Criação direta** — Criar serviços instantaneamente via ferramentas MCP

Blueprints também podem rodar uma **imagem Docker pré-construída** com `runtime: image`, mas o `render.yaml` ainda precisa estar num repositório Git.

Se não houver remote Git, pare e pergunte ao usuário para:

- Criar/enviar um remote Git (pode ser mínimo se só o Blueprint for necessário), ou
- Usar o Dashboard/API Render para implantar imagem Docker pré-construída (MCP não cria serviços baseados em imagem).

## Pré-requisitos

- Se o sandbox bloquear chamadas de rede do deploy, rode novamente com `sandbox_permissions=require_escalated`.
- O deploy pode levar alguns minutos. Use timeouts adequados.

## Requisitos de segurança para chaves API e secrets

**CRÍTICO — proteja credenciais do usuário:**

Ao lidar com chaves API Render ou qualquer secret:

1. **NUNCA peça para colar chaves API direto no chat** — Em vez disso, oriente a definir variáveis de ambiente:

   ```bash
   export RENDER_API_KEY="rnd_xxxxx"
   ```

2. **NUNCA inclua chaves API reais em exemplos** — Use sempre placeholders como `<YOUR_API_KEY>` ou `rnd_xxxxx`

3. **Oriente armazenamento seguro** — Indique:
   - Variáveis de ambiente para autenticação na CLI
   - Dashboard Render para secrets de serviço (env vars marcadas `sync: false`)
   - Nunca commitar secrets no Git

4. **Quando precisarem de chave API**, forneça:
   - "Get your API key from: https://dashboard.render.com/u/*/settings#api-keys"
   - "Set it as an environment variable: `export RENDER_API_KEY='your-key-here'`"
   - "Never share or commit this key"

5. **Para configuração MCP**, mostre a estrutura mas enfatize:
   - Substituir `<YOUR_API_KEY>` pela chave real
   - Este arquivo não deve ir para controle de versão
   - A chave deve permanecer privada

6. **Se o usuário compartilhar um secret no chat por engano**, imediatamente:
   - Avise que a chave pode estar comprometida
   - Oriente revogar no Dashboard Render
   - Oriente criar nova chave

## Quando usar esta skill

Ative quando o usuário quiser:

- Implantar uma aplicação na Render
- Criar arquivo Blueprint render.yaml
- Configurar deploy Render para o projeto
- Hospedar ou publicar na plataforma em nuvem Render
- Criar bancos de dados, cron jobs ou outros recursos Render

## Caminho feliz (usuários novos)

Antes da análise profunda, use esta sequência curta para reduzir atrito:

1. Pergunte se quer deploy a partir de repo Git ou imagem Docker pré-construída.
2. Pergunte se a Render deve provisionar tudo que o app precisa (pelo que parece na descrição) ou só o app enquanto eles trazem infra própria. Se dependências não estiverem claras, confirme em poucas palavras se precisam de database, workers, cron ou outros serviços.

Depois siga o método adequado abaixo.

## Escolha da origem

**Caminho repo Git:** Obrigatório para Blueprint e Criação direta. O repo deve estar no GitHub, GitLab ou Bitbucket.

**Caminho imagem Docker pré-construída:** Suportado pela Render via serviços baseados em imagem. **Não** é suportado pelo MCP; use Dashboard/API. Peça:

- URL da imagem (registry + tag)
- Auth do registry (se privado)
- Tipo de serviço (web/worker) e porta

Se escolher imagem Docker, oriente o fluxo de deploy por imagem no Dashboard Render ou peça um remote Git (para usar Blueprint com `runtime: image`).

## Escolha do método de deploy (repo Git)

Ambos exigem repositório Git no GitHub, GitLab ou Bitbucket. (Com `runtime: image`, o repo pode ser mínimo e só ter `render.yaml`.)

| Método             | Melhor para                      | Vantagens                                  |
| ------------------ | -------------------------------- | ------------------------------------------ |
| **Blueprint**      | Apps multi-serviço, fluxos IaC   | Versionado, reproduzível, setups complexos |
| **Criação direta** | Serviços únicos, deploys rápidos | Criação instantânea, sem render.yaml       |

### Heurística de escolha do método

Use esta regra por padrão salvo pedido explícito de método. Analise a base primeiro; só pergunte se a intenção de deploy não estiver clara (ex.: DB, workers, cron).

**Use Criação direta (MCP) quando TODOS forem verdadeiros:**

- Serviço único (um web app ou um site estático)
- Sem workers/cron separados
- Sem databases ou Key Value anexados
- Apenas env vars simples (sem grupos compartilhados)
  Se couber e MCP não estiver configurado, pare e oriente setup do MCP antes de seguir.

**Use Blueprint quando QUALQUER for verdadeiro:**

- Vários serviços (web + worker, API + frontend, etc.)
- Databases, Redis/Key Value ou outros datastores
- Cron jobs, workers em background ou serviços privados
- IaC reproduzível ou render.yaml commitado no repo
- Monorepo ou multi-env que precise config consistente

Na dúvida, pergunte rápido, mas padronize Blueprint por segurança. Para serviço único, prefira fortemente Criação direta via MCP e oriente setup se preciso.

## Checagem de pré-requisitos

Ao iniciar deploy, verifique nesta ordem:

**1. Confirmar origem (Git vs Docker)**

Com métodos baseados em Git (Blueprint ou Criação direta), o repo deve estar no GitHub/GitLab/Bitbucket. Blueprints com imagem pré-construída ainda precisam de repo Git com `render.yaml`.

```bash
git remote -v
```

- Sem remote: pare e peça criar/enviar remote **ou** mudar para deploy por imagem Docker.

**2. Verificar disponibilidade das ferramentas MCP (preferido para serviço único)**

MCP oferece melhor experiência. Verifique tentando:

```
list_services()
```

Com MCP disponível, pode pular instalação da CLI na maioria das operações.

**3. Verificar instalação da Render CLI (validação Blueprint)**

```bash
render --version
```

Se não instalada, ofereça instalar:

- macOS: `brew install render`
- Linux/macOS: `curl -fsSL https://raw.githubusercontent.com/render-oss/cli/main/bin/install.sh | sh`

**4. Setup MCP (se MCP não estiver configurado)**

Se `list_services()` falhar por MCP não configurado, pergunte se quer configurar MCP (preferido) ou seguir com fallback CLI. Se escolher MCP, pergunte qual ferramenta de IA usam e siga as instruções abaixo. Use sempre a chave API deles.

### Cursor

Oriente o usuário nestes passos:

1. Obtenha uma Render API key:

```
https://dashboard.render.com/u/*/settings#api-keys
```

2. Adicione isto em `~/.cursor/mcp.json` (substitua `<YOUR_API_KEY>`):

```json
{
  "mcpServers": {
    "render": {
      "url": "https://mcp.render.com/mcp",
      "headers": {
        "Authorization": "Bearer <YOUR_API_KEY>"
      }
    }
  }
}
```

3. Reinicie o Cursor e tente `list_services()` novamente.

### Claude Code

Oriente o usuário nestes passos:

1. Obtenha uma Render API key:

```
https://dashboard.render.com/u/*/settings#api-keys
```

2. Adicione o servidor MCP no Claude Code (substitua `<YOUR_API_KEY>`):

```bash
claude mcp add --transport http render https://mcp.render.com/mcp --header "Authorization: Bearer <YOUR_API_KEY>"
```

3. Reinicie o Claude Code e tente `list_services()` novamente.

### Outras ferramentas

Se outro app de IA, encaminhe para a documentação MCP Render da ferramenta para passos de setup.

### Seleção de workspace

Depois do MCP configurado, peça ao usuário definir o workspace Render ativo com um prompt como:

```
Set my Render workspace to [WORKSPACE_NAME]
```

**5. Verificar autenticação (somente fallback CLI)**

Sem MCP, use a CLI e verifique acesso à conta:

```bash
# Check if user is logged in (use -o json for non-interactive mode)
render whoami -o json
```

Se `render whoami` falhar ou vier vazio, a CLI não está autenticada. Nem sempre há prompt automático — oriente login explicitamente:

Se nada estiver configurado, pergunte qual método prefere:

- **API Key (CLI)**: `export RENDER_API_KEY="rnd_xxxxx"` (obtenha em https://dashboard.render.com/u/*/settings#api-keys)
- **Login**: `render login` (abre navegador para OAuth)

**6. Verificar contexto de workspace**

Confira o workspace ativo:

```
get_selected_workspace()
```

Ou pela CLI:

```bash
render workspace current -o json
```

Para listar workspaces disponíveis:

```
list_workspaces()
```

Para trocar workspace, use Dashboard ou CLI (`render workspace set`).

Com pré-requisitos ok, siga o fluxo de deploy.

---

# Método 1: Deploy Blueprint (recomendado para apps complexos)

## Fluxo Blueprint

### Etapa 1: Analisar base de código

Analise para determinar framework/runtime, comandos de build e start, env vars, datastores e binding de porta. Use os checklists em [references/codebase-analysis.md](references/codebase-analysis.md).

### Etapa 2: Gerar render.yaml

Crie `render.yaml` conforme a especificação Blueprint.

Especificação completa: [references/blueprint-spec.md](references/blueprint-spec.md)

**Pontos-chave:**

- Use `plan: free` salvo outro pedido do usuário
- Inclua TODAS as variáveis de ambiente necessárias
- Marque secrets com `sync: false` (usuário preenche no Dashboard)
- Tipo de serviço adequado: `web`, `worker`, `cron`, `static` ou `pserv`
- Runtime adequado: [references/runtimes.md](references/runtimes.md)

**Estrutura básica:**

```yaml
services:
  - type: web
    name: my-app
    runtime: node
    plan: free
    buildCommand: npm ci
    startCommand: npm start
    envVars:
      - key: DATABASE_URL
        fromDatabase:
          name: postgres
          property: connectionString
      - key: JWT_SECRET
        sync: false # User fills in Dashboard

databases:
  - name: postgres
    databaseName: myapp_db
    plan: free
```

**Tipos de serviço:**

- `web`: HTTP, APIs, apps web (acesso público)
- `worker`: processadores de jobs em background (sem acesso público)
- `cron`: tarefas agendadas em cron
- `static`: sites estáticos (HTML/CSS/JS via CDN)
- `pserv`: serviços privados (somente internos, mesma conta)

Detalhes: [references/service-types.md](references/service-types.md)
Runtimes: [references/runtimes.md](references/runtimes.md)
Templates: [assets/](assets/)

### Etapa 2.5: Próximos passos imediatos (sempre forneça)

Depois de criar `render.yaml`, sempre dê um checklist curto e rode validação assim que a CLI estiver disponível:

1. **Autenticar (CLI)**: `render whoami -o json` (se não logado, `render login` ou `RENDER_API_KEY`)
2. **Validar (recomendado)**: `render blueprints validate`
   - Sem CLI, ofereça instalar e informe o comando.
3. **Commit + push**: `git add render.yaml && git commit -m "Add Render deployment configuration" && git push origin main`
4. **Abrir Dashboard**: deeplink Blueprint e complete OAuth Git se pedido
5. **Preencher secrets**: env vars com `sync: false`
6. **Deploy**: clique em "Apply" e monitore

### Etapa 3: Validar configuração

Valide `render.yaml` antes do deploy. Com CLI instalada, rode direto; só peça ao usuário se faltar CLI:

```bash
render whoami -o json  # Garanta CLI autenticada (nem sempre há prompt)
render blueprints validate
```

Corrija erros antes de seguir. Problemas comuns:

- Campos obrigatórios ausentes (`name`, `type`, `runtime`)
- Valores de runtime inválidos
- Sintaxe YAML incorreta
- Referências de env var inválidas

Guia: [references/configuration-guide.md](references/configuration-guide.md)

### Etapa 4: Commit e push

**IMPORTANTE:** faça merge de `render.yaml` no repositório antes do deploy.

Confirme commit e push para o remote Git:

```bash
git add render.yaml
git commit -m "Add Render deployment configuration"
git push origin main
```

Sem remote Git ainda: pare e oriente criar repo GitHub/GitLab/Bitbucket, adicionar `origin` e push antes de continuar.

**Por que importa:** O deeplink do Dashboard lê `render.yaml` do repositório. Sem merge/push, a Render não acha a config e o deploy falha.

Confirme que o arquivo está no remote antes da próxima etapa.

### Etapa 5: Gerar deeplink

Obtenha a URL do repositório Git:

```bash
git remote get-url origin
```

Retorna URL do provedor Git. **Se for SSH, converta para HTTPS:**

| SSH Format                        | HTTPS Format                      |
| --------------------------------- | --------------------------------- |
| `git@github.com:user/repo.git`    | `https://github.com/user/repo`    |
| `git@gitlab.com:user/repo.git`    | `https://gitlab.com/user/repo`    |
| `git@bitbucket.org:user/repo.git` | `https://bitbucket.org/user/repo` |

**Padrão de conversão:** troque `git@<host>:` por `https://<host>/` e remova o sufixo `.git`.

Formate o deeplink do Dashboard com a URL HTTPS:

```
https://dashboard.render.com/blueprint/new?repo=<REPOSITORY_URL>
```

Exemplo:

```
https://dashboard.render.com/blueprint/new?repo=https://github.com/username/repo-name
```

### Etapa 6: Orientar o usuário

**CRÍTICO:** Confirme merge e push de `render.yaml` antes de clicar no deeplink. Sem o arquivo no repo, a Render não lê o Blueprint e o deploy falha.

Forneça o deeplink com estas instruções:

1. **Verifique merge do render.yaml** — arquivo existe no GitHub/GitLab/Bitbucket
2. Clique no deeplink para abrir o Dashboard
3. Complete OAuth do provedor Git se solicitado
4. Nomeie o Blueprint (ou use default do render.yaml)
5. Preencha env vars secretas (`sync: false`)
6. Revise serviços e databases
7. Clique em "Apply" para implantar

O deploy inicia automaticamente; progresso no Dashboard Render.

### Etapa 7: Verificar deployment

Depois do deploy via Dashboard, verifique se está ok.

**Status via MCP:**

```
list_deploys(serviceId: "<service-id>", limit: 1)
```

Procure `status: "live"` para confirmar sucesso.

**Erros de runtime (aguarde 2–3 min após deploy):**

```
list_logs(resource: ["<service-id>"], level: ["error"], limit: 20)
```

**Métricas de saúde:**

```
get_metrics(
  resourceId: "<service-id>",
  metricTypes: ["http_request_count", "cpu_usage", "memory_usage"]
)
```

Se houver erros, vá para **Verificação pós-deploy e triagem básica** abaixo.

---

# Método 2: Criação direta de serviço (deploys rápidos de serviço único)

Para deploys simples sem IaC, crie serviços diretamente via MCP.

## Quando usar criação direta

- Um web service ou site estático
- Protótipos ou demos rápidos
- Sem precisar de render.yaml no repo
- Adicionar databases ou cron a projetos existentes

## Pré-requisitos da criação direta

**O repositório deve estar no provedor Git.** A Render clona para build e deploy.

```bash
git remote -v  # Verifique se o remote existe
git push origin main  # Garanta que o código foi enviado
```

Provedores: GitHub, GitLab, Bitbucket

Sem remote: pare e peça criar/enviar ou usar deploy por imagem Docker.

**Nota:** MCP não cria serviços baseados em imagem. Use Dashboard/API para imagens pré-construídas.

## Fluxo de criação direta

Siga os passos abaixo; detalhes MCP em [references/direct-creation.md](references/direct-creation.md).

### Etapa 1: Analisar base

Use [references/codebase-analysis.md](references/codebase-analysis.md) para runtime, build/start, env vars e datastores.

### Etapa 2: Criar recursos via MCP

Crie serviço (web ou estático) e databases ou key-value necessários. Veja [references/direct-creation.md](references/direct-creation.md).

Erro de credenciais Git ou acesso ao repo: pare, oriente conectar provedor Git no Dashboard Render e tente de novo.

### Etapa 3: Configurar variáveis de ambiente

Adicione env vars via MCP após criação. Veja [references/direct-creation.md](references/direct-creation.md).

Lembre que secrets podem ser definidos no Dashboard.

### Etapa 4: Verificar deployment

Status, logs e métricas: [references/direct-creation.md](references/direct-creation.md).

---

Descoberta de serviços, detalhes de configuração, comandos rápidos e problemas comuns: [references/deployment-details.md](references/deployment-details.md).

---

# Verificação pós-deploy e triagem básica (todos os métodos)

Curto e repetível. Se algo falhar, corrija antes de redeploy.

1. Confirme que o último deploy está `live` servindo tráfego
2. Acesse health (ou raiz) e verifique resposta 200
3. Varra logs de erro recentes por assinatura clara de falha
4. Confira env vars obrigatórias e binding de porta (`0.0.0.0:$PORT`)

Checklist detalhado: [references/post-deploy-checks.md](references/post-deploy-checks.md)

Falha ao iniciar ou health checks em timeout: [references/troubleshooting-basics.md](references/troubleshooting-basics.md)

## Solução de problemas

### Rede com permissões elevadas

Falhas de rede (timeouts, DNS, resets): rode com permissões elevadas (`sandbox_permissions=require_escalated`).

```
The deploy needs escalated network access to deploy to Render. I can rerun the command with escalated permissions—want me to proceed?
```

Opcional: para diagnósticos mais profundos (métricas/DB/catálogo de erros), sugira instalar a skill `render-debug`. Não é obrigatória para o fluxo principal.
