---
name: confluence-assistant
description: Expert em operações Confluence com MCP Atlassian. Use quando o usuário disser "buscar no Confluence", "criar página no Confluence", "atualizar página", "achar documentação no Confluence", "listar spaces" ou "comentar em página". NÃO use para issues Jira, busca web genérica ou criação de arquivos locais.
license: CC-BY-4.0
metadata:
  author: Waldemar Neto - github.com/waldemarnt
  version: '1.0.0'
---

# Confluence Assistant

Você é expert em usar as ferramentas MCP da Atlassian para interagir com o Confluence.

## Quando usar

Use esta skill quando o usuário pedir para:

- Buscar páginas ou documentação no Confluence
- Criar novas páginas
- Atualizar páginas existentes
- Navegar ou listar spaces do Confluence
- Adicionar comentários em páginas
- Obter detalhes de páginas específicas

## Configuração

**Estratégia de detecção de projeto (automática):**

1. **Verifique o contexto da conversa primeiro:** Procure Cloud ID ou URL do Confluence já mencionados
2. **Se não encontrar:** Peça ao usuário o Cloud ID ou URL do site Confluence
3. **Use os valores detectados** em todas as operações Confluence nesta conversa

### Fluxo de detecção de configuração

Ao ativar esta skill:

1. Verifique se Cloud ID ou URL do Confluence já estão no contexto da conversa
2. Se não encontrar, pergunte: "Qual site Confluence devo usar? Informe um Cloud ID (UUID) ou URL do site (ex.: `https://example.atlassian.net/`)"
3. Use o valor fornecido em todas as operações desta conversa

**Formato do Cloud ID:**

- Pode ser URL do site (ex.: `https://example.atlassian.net/`)
- Pode ser UUID de `getAccessibleAtlassianResources`

## Fluxo de trabalho

### 1. Encontrar conteúdo (sempre comece aqui)

**Use `search` (Rovo Search) primeiro** — é o caminho mais eficiente:

```
search("consulta em linguagem natural sobre o conteúdo")
```

- Funciona com linguagem natural
- Retorna páginas relevantes rapidamente
- Melhor primeiro passo

### 2. Obter detalhes da página

Dependendo do que você tem:

- **Se tiver ARI** (Atlassian Resource Identifier): `fetch(ari)`
- **Se tiver page ID**: `getConfluencePage(cloudId, pageId)`
- **Para listar spaces**: `getConfluenceSpaces(cloudId, keys=["SPACE_KEY"])`
- **Para páginas em um space**: `getPagesInConfluenceSpace(cloudId, spaceId)`

### 3. Criar páginas

```
createConfluencePage(
  cloudId,
  spaceId="123456",
  title="Título da página",
  body="# Conteúdo Markdown\n\n## Seção\nConteúdo aqui..."
)
```

Sempre use **Markdown** no campo `body` — nunca HTML.

### 4. Atualizar páginas

```
updateConfluencePage(
  cloudId,
  pageId="123456",
  title="Título atualizado",
  body="# Markdown atualizado\n\n..."
)
```

Sempre use **Markdown** no campo `body` — nunca HTML.

## Boas práticas

### ✅ FAZER

- **Sempre Markdown** no campo `body` da página
- **Usar `search` primeiro** antes de outros métodos de busca
- **Linguagem natural** nas consultas de busca
- **Validar que o space existe** antes de criar páginas
- **Incluir estrutura clara** no conteúdo (títulos, listas, etc.)

### ⚠️ IMPORTANTE

- **Não confunda:**
  - Page ID (numérico) vs Space Key (string)
  - Space ID (numérico) vs Space Key (STRING_MAIÚSCULA)
- **CloudId** pode ser URL ou UUID — ambos funcionam
- **Use a configuração detectada** — contexto da conversa ou pergunte Cloud ID / URL ao usuário
- **Formato ARI**: `ari:cloud:confluence:site-id:page/page-id`

## Exemplos

### Exemplo 1: Buscar e atualizar uma página

```
Usuário: "Ache a página de documentação da API e adicione uma nova seção"

1. search("documentação API")
2. getConfluencePage(cloudId, pageId="id-encontrado")
3. updateConfluencePage(
     cloudId,
     pageId="id-encontrado",
     title="Documentação da API",
     body="# Documentação da API\n\n## Conteúdo existente\n...\n\n## Nova seção\nNovo conteúdo..."
   )
```

### Exemplo 2: Criar nova página em um space

```
Usuário: "Crie um novo registro de decisão de arquitetura"

1. getConfluenceSpaces(cloudId, keys=["TECH"])
2. createConfluencePage(
     cloudId,
     spaceId="space-id-do-passo-1",
     title="ADR-001: Usar arquitetura de microsserviços",
     body="# ADR-001: Usar arquitetura de microsserviços\n\n## Status\nAceito\n\n## Contexto\n...\n\n## Decisão\n...\n\n## Consequências\n..."
   )
```

### Exemplo 3: Encontrar e ler conteúdo da página

```
Usuário: "O que tem na nossa documentação de onboarding?"

1. search("documentação onboarding")
2. getConfluencePage(cloudId, pageId="id-dos-resultados")
3. Resumir o conteúdo para o usuário
```

## Formato de saída

Ao criar ou atualizar páginas, use Markdown bem estruturado:

```markdown
# Título principal

## Introdução

Visão geral breve do tópico.

## Seções

Organize o conteúdo com:

- Títulos claros (##, ###)
- Marcadores para listas
- Blocos de código para exemplos
- Tabelas quando fizer sentido

## Pontos-chave

- Ponto 1
- Ponto 2
- Ponto 3

## Próximos passos

1. Passo 1
2. Passo 2
3. Passo 3
```

## Observações importantes

- **Markdown é obrigatório** — nunca use HTML ou outros formatos no `body`
- **Busque primeiro** — forma mais eficiente de achar conteúdo
- **Valide IDs** — confirme que space/page existem antes das operações
- **Linguagem natural** — o Rovo Search entende intenção, não só palavras-chave
- **Tipos de ID** — não confunda page ID (numérico), space key (string) e space ID (numérico)
