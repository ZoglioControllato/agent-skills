# Habilidade do assistente Jira

Essa habilidade fornece operações especializadas do Jira usando ferramentas Atlassian MCP. Ele detecta automaticamente a configuração do Jira do espaço de trabalho a partir do contexto ou solicita detalhes do projeto.

## Requisitos de configuração

A habilidade requer que os seguintes valores de configuração estejam disponíveis no contexto do seu espaço de trabalho:

### Valores Obrigatórios

- **Chave do projeto** - A chave do projeto Jira (por exemplo, `KAN`, `PROJ`, `DEV`)
- **Cloud ID** - Seu Atlassian Cloud ID (formato UUID ou URL do site)
- **URL** - URL do seu site Atlassian (por exemplo, `https://example.atlassian.net/`)

### Valores Opcionais

- **Nome do projeto** - Nome do projeto legível por humanos
- **URL do quadro** - Link para seu quadro Jira (opcional, por conveniência)

## Onde configurar

A habilidade detecta configurações de diversas fontes, tornando-a compatível com diferentes IDEs e configurações:

### Opção 1: Regras do Cursor (`.cursor/rules/jira-config.mdc`)

## Se você estiver usando o Cursor, crie um arquivo de regras:```yaml

## alwaysApply: false

# Jira Project Configuration

This workspace uses the following Jira configuration:

- **Project Key:** YOUR_PROJECT_KEY
- **Cloud ID:** your-cloud-id-uuid-or-url
- **URL:** https://your-site.atlassian.net/
- **Project Name:** Your Project Name (optional)
- **Board URL:** https://your-site.atlassian.net/jira/software/projects/YOUR_PROJECT_KEY/boards/1 (optional)

````
### Opção 2: AGENTES.md

Se você estiver usando outro IDE ou preferir AGENTS.md, adicione a configuração lá:```markdown
# Jira Configuration

- **Project Key:** YOUR_PROJECT_KEY
- **Cloud ID:** your-cloud-id-uuid-or-url
- **URL:** https://your-site.atlassian.net/
- **Project Name:** Your Project Name (optional)
- **Board URL:** https://your-site.atlassian.net/jira/software/projects/YOUR_PROJECT_KEY/boards/1 (optional)
````

### Opção 3: outras fontes de contexto

A habilidade também detectará configurações de:

- Arquivos de documentação do espaço de trabalho
- Arquivos README do projeto
- Quaisquer arquivos markdown no seu espaço de trabalho que contenham configuração do Jira

### Opção 4: prompt interativo

Se nenhuma configuração for encontrada, a habilidade irá:

1. Use ferramentas MCP para descobrir projetos Jira disponíveis
2. Solicitar que você selecione seu projeto
3. Armazene a seleção da conversa atual

## Fluxo de detecção de configuração

Quando a habilidade é ativada, ela segue esta ordem de detecção:

1. **Verifique o contexto do espaço de trabalho** – procura a configuração do Jira em:
   - `.cursor/rules/jira-config.mdc` (Cursor)
   - `AGENTS.md` (qualquer IDE)
   - Outros arquivos de documentação do espaço de trabalho

2. **Se não encontrado** - Usa a pesquisa MCP para descobrir projetos disponíveis

3. **Se ainda não estiver claro** - Solicita ao usuário que especifique a chave do projeto

4. **Usa valores detectados** - Aplica configuração para todas as operações

## Exemplo de configuração

Aqui está um exemplo completo de configuração:```markdown

# Jira Project Configuration

- **Project Key:** KAN
- **Cloud ID:** d58e860b-469d-4463-8f46-684934a5a851
- **URL:** https://techleadsclub.atlassian.net/
- **Project Name:** Controllato Club
- **Board URL:** https://techleadsclub.atlassian.net/jira/software/projects/KAN/boards/1

```
## Uso

Depois de configurada, a habilidade usa automaticamente as configurações do seu projeto para:

- Pesquisando problemas
- Criação de tarefas, épicos e subtarefas
- Problemas de atualização
- Status do problema de transição
- Adicionando comentários
- Consultando com JQL

Todas as operações usarão automaticamente a chave do projeto configurada e o ID da nuvem.

## Solução de problemas

**A habilidade não consegue encontrar a configuração:**

- Certifique-se de que seu arquivo de configuração esteja na raiz do espaço de trabalho ou no diretório `.cursor/rules/`
- Verifique se o arquivo contém os valores necessários (chave do projeto, Cloud ID, URL)
- Verifique se o formato corresponde aos exemplos acima

**Projeto errado sendo usado:**

- Verifique seu arquivo de configuração para obter a chave correta do projeto
- A habilidade usa a primeira configuração válida que encontra
- Você pode substituir especificando o projeto em sua solicitação

**Configuração não detectada:**

- A habilidade irá avisá-lo interativamente se nenhuma configuração for encontrada
- Você também pode especificar detalhes do projeto diretamente na sua solicitação: "Criar uma tarefa no projeto PROJECT_KEY"

## Compatibilidade

Esta habilidade funciona com:

- Cursor IDE (via `.cursor/rules/`)
- Qualquer IDE compatível com AGENTS.md
- Qualquer espaço de trabalho com arquivos de configuração acessíveis
- Modo interativo (solicitações de configuração)
```
