---
description: Gerencia issues Jira via MCP Atlassian — buscar, criar, atualizar, transicionar status e tarefas de sprint. Detecta a configuração do workspace automaticamente. Use quando o usuário disser "criar um ticket Jira", "atualizar minha sprint", "ver status no Jira", "transicionar esta issue", "buscar no Jira" ou "mover ticket para done". NÃO use para páginas Confluence (use confluence-assistant).
name: jira-assistant
---

# Jira Assistant

Você é expert em usar as ferramentas MCP da Atlassian para interagir com o Jira.

## Quando usar

Use esta skill quando o usuário pedir para:

- Buscar issues ou tarefas no Jira
- Criar novas issues (Task, Epic, Subtask)
- Atualizar issues existentes
- Transicionar status da issue (A fazer → Em progresso → Concluído, etc.)
- Adicionar comentários em issues
- Gerenciar responsáveis
- Consultar issues com critérios específicos

## Configuração

**Estratégia de detecção de projeto (automática):**

1. **Regras do workspace primeiro:** Procure configuração Jira em `.cursor/rules/jira-config.mdc`
2. **Se não encontrar:** Use ferramentas de busca MCP para descobrir projetos disponíveis
3. **Se ainda não estiver claro:** Peça ao usuário a chave do projeto
4. **Use os valores detectados** em todas as operações Jira nesta conversa

### Fluxo de detecção de configuração

Ao ativar esta skill:

1. Verifique se o workspace tem `.cursor/rules/jira-config.mdc` com configuração Jira
2. Se encontrar, extraia e use: Project Key, Cloud ID, URL, Board URL
3. Se não encontrar:
   - Use `search("jira projects I have access to")` via MCP
   - Apresente os projetos descobertos ao usuário
   - Pergunte: "Qual projeto Jira devo usar? (ex.: KAN, PROJ, DEV)"
4. Armazene a configuração para esta conversa e prossiga com as operações

**Nota para quem usa a skill:** Para configurar no seu workspace, crie `.cursor/rules/jira-config.mdc` com os detalhes do projeto.

## Fluxo de trabalho

### 1. Encontrar issues (sempre comece aqui)

**Use `search` (Rovo Search) primeiro** para consultas gerais:

```
search("issues in {PROJECT_KEY} project")
search("tasks assigned to me")
search("bugs in progress")
```

- Linguagem natural funciona melhor que JQL para buscas gerais
- Mais rápido e intuitivo
- Retorna resultados relevantes rapidamente
- Substitua `{PROJECT_KEY}` pela chave detectada na configuração

### 2. Buscar com critérios específicos

**Use `searchJiraIssuesUsingJql`** quando precisar de filtros precisos:

**⚠️ SEMPRE inclua `project = {PROJECT_KEY}` nas consultas JQL**

Exemplos (substitua `{PROJECT_KEY}` pela chave detectada):

```
project = {PROJECT_KEY} AND status = "In Progress"
project = {PROJECT_KEY} AND assignee = currentUser() AND created >= -7d
project = {PROJECT_KEY} AND type = "Epic" AND status != "Done"
project = {PROJECT_KEY} AND priority = "High"
```

### 3. Obter detalhes da issue

Dependendo do que você tem:

- **Se tiver ARI**: `fetch(ari)`
- **Se tiver chave ou id da issue**: `getJiraIssue(cloudId, issueKey)`

### 4. Criar issues

**SEMPRE use o `projectKey` e `cloudId` detectados na configuração**

#### Passo a passo:

```
a. Ver tipos de issue:
   getJiraProjectIssueTypesMetadata(
     cloudId="{CLOUD_ID}",
     projectKey="{PROJECT_KEY}"
   )

b. Ver campos obrigatórios:
   getJiraIssueTypeMetaWithFields(
     cloudId="{CLOUD_ID}",
     projectKey="{PROJECT_KEY}",
     issueTypeId="from-step-a"
   )

c. Criar a issue:
   createJiraIssue(
     cloudId="{CLOUD_ID}",
     projectKey="{PROJECT_KEY}",
     issueTypeName="Task",
     summary="Breve descrição da tarefa",
     description="## Contexto\n..."
   )
```

**Nota:** Substitua `{PROJECT_KEY}` e `{CLOUD_ID}` pelos valores da configuração detectada.

**Tipos de issue disponíveis:**

- Task (padrão)
- Epic
- Subtask (exige campo `parent` com a chave da issue pai)

### 5. Atualizar e transicionar issues

#### Editar campos:

```
editJiraIssue(cloudId, issueKey, fields)
```

#### Mudar status:

```
1. Obter transições disponíveis:
   getTransitionsForJiraIssue(cloudId, issueKey)

2. Aplicar transição:
   transitionJiraIssue(cloudId, issueKey, transitionId)
```

#### Adicionar comentário:

```
addCommentToJiraIssue(cloudId, issueKey, comment)
```

## Modelo padrão de tarefa

**SEMPRE use este modelo** no campo `description` ao criar issues:

```markdown
## Contexto

[Explicação breve do problema ou necessidade]

## Objetivo

[O que precisa ser entregue]

## Requisitos técnicos

[Nível alto; não cite classe ou arquivo, mas o objetivo técnico de alto nível]

- [ ] Requisito 1
- [ ] Requisito 2
- [ ] Requisito 3

## Critérios de aceite

- [ ] Critério 1
- [ ] Critério 2
- [ ] Critério 3

## Notas técnicas

[Não inclua caminhos de arquivo — podem mudar com o tempo]
[Considerações técnicas, dependências, links relevantes]

## Estimativa

[Estimativa de tempo ou story points, se aplicável]
```

## Boas práticas

### ✅ FAZER

- **Sempre usar a chave de projeto detectada** em todas as operações
- **Sempre Markdown** no campo `description`
- **Usar `search` primeiro** para consultas em linguagem natural
- **Usar JQL** para filtros precisos (mas sempre com `project = {PROJECT_KEY}`)
- **Seguir o modelo de tarefa** para consistência
- **Evitar caminhos de arquivo** nas descrições (mudam com o tempo)
- **Summaries breves** e descrições detalhadas

### ⚠️ IMPORTANTE

- **Issue ID** é numérico (interno)
- **Issue Key** tem formato "{PROJECT_KEY}-123" (voltado ao usuário)
- **Para subtasks:** use o campo `parent` com a chave da issue pai
- **CloudId** pode ser URL ou UUID — ambos funcionam
- **Use valores da configuração detectada** das regras do workspace ou entrada do usuário

## Exemplos

### Exemplo 1: Criar uma Task

```
Usuário: "Crie uma tarefa para implementar autenticação de usuário"

createJiraIssue(
  cloudId="{CLOUD_ID}",
  projectKey="{PROJECT_KEY}",
  issueTypeName="Task",
  summary="Implementar endpoint de autenticação de usuário",
  description="## Contexto
Precisamos proteger os endpoints da API com autenticação de usuário.

## Objetivo
Implementar autenticação JWT para acesso à API.

## Requisitos técnicos
- [ ] Criar middleware de autenticação
- [ ] Implementar geração de token JWT
- [ ] Adicionar validação de token
- [ ] Proteger endpoints existentes

## Critérios de aceite
- [ ] Usuários conseguem login com credenciais
- [ ] Tokens JWT são gerados no login bem-sucedido
- [ ] Endpoints protegidos validam tokens
- [ ] Tokens inválidos retornam 401

## Notas técnicas
Use bcrypt para hash de senha, JWT para tokens e implemente lógica de refresh token.

## Estimativa
5 story points"
)
```

**Nota:** Use valores reais da configuração detectada no lugar dos placeholders.

### Exemplo 2: Buscar e atualizar issue

```
Usuário: "Ache minhas tarefas em progresso e atualize a primeira"

1. searchJiraIssuesUsingJql(
     cloudId="{CLOUD_ID}",
     jql="project = {PROJECT_KEY} AND assignee = currentUser() AND status = 'In Progress'"
   )

2. editJiraIssue(
     cloudId="{CLOUD_ID}",
     issueKey="{PROJECT_KEY}-123",
     fields={ "description": "## Contexto\nContexto atualizado..." }
   )
```

**Nota:** Substitua os placeholders pelos valores da configuração detectada.

### Exemplo 3: Transicionar status da issue

```
Usuário: "Mova a tarefa {PROJECT_KEY}-456 para Done"

1. getTransitionsForJiraIssue(cloudId="{CLOUD_ID}", issueKey="{PROJECT_KEY}-456")

2. transitionJiraIssue(
     cloudId="{CLOUD_ID}",
     issueKey="{PROJECT_KEY}-456",
     transitionId="transition-id-for-done"
   )
```

**Nota:** Substitua os placeholders pelos valores da configuração detectada.

### Exemplo 4: Criar subtask

```
Usuário: "Crie uma subtask para {PROJECT_KEY}-789"

createJiraIssue(
  cloudId="{CLOUD_ID}",
  projectKey="{PROJECT_KEY}",
  issueTypeName="Subtask",
  parent="{PROJECT_KEY}-789",
  summary="Implementar lógica de validação",
  description="## Contexto\nSubtask para implementar validação de entrada..."
)
```

**Nota:** Substitua os placeholders pelos valores da configuração detectada.

## Padrões JQL comuns

Todas as consultas **DEVEM** incluir `project = {PROJECT_KEY}` (use a chave detectada):

```jql
# Meu trabalho atual
project = {PROJECT_KEY} AND assignee = currentUser() AND status = "In Progress"

# Issues recentes
project = {PROJECT_KEY} AND created >= -7d

# Bugs de alta prioridade
project = {PROJECT_KEY} AND type = Bug AND priority = High

# Épicos não concluídos
project = {PROJECT_KEY} AND type = Epic AND status != Done

# Tarefas não atribuídas
project = {PROJECT_KEY} AND assignee is EMPTY AND status = "To Do"

# Issues atualizadas nesta semana
project = {PROJECT_KEY} AND updated >= startOfWeek()
```

**Nota:** Substitua `{PROJECT_KEY}` pela chave real da configuração detectada.

## Observações importantes

- **Chave de projeto é obrigatória** — sempre inclua `project = {PROJECT_KEY}` nas consultas JQL
- **Use configuração detectada** — leia `.cursor/rules/jira-config.mdc` ou pergunte ao usuário
- **Use Markdown** nas descrições — não HTML nem texto puro
- **Siga o modelo** — mantém consistência entre issues
- **Busca em linguagem natural primeiro** — JQL só quando necessário
- **Evite caminhos de arquivo** — mudam e ficam desatualizados
- **Mantenha notas técnicas em alto nível** — foco na abordagem, não em detalhes de implementação
- **Story points são opcionais** — inclua estimativas quando relevante
