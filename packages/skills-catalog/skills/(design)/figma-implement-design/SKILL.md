---
name: figma-implement-design
description: Traduz nodes do Figma em código pronto para produção com fidelidade visual 1:1 usando fluxo MCP do Figma (contexto de design, screenshots, assets e adaptação às convenções do projeto). Use quando o usuário fornecer URLs do Figma ou node IDs e pedir implementação de designs ou componentes conforme specs do Figma. Exige MCP do Figma conectado e funcional. NÃO use para fetching geral no Figma, exploração de variables ou troubleshooting de MCP (use figma).
metadata:
  author: github.com/openai/skills
  version: '1.0.0'
---

# Implement Design

## Visão geral

Esta skill oferece fluxo estruturado para traduzir designs do Figma em código production-ready com paridade pixel-level. Garante integração consistente com o servidor MCP do Figma, uso correto de design tokens e paridade visual 1:1 com os designs.

## Pré-requisitos

- Servidor MCP do Figma deve estar conectado e acessível
- O usuário fornece URL no formato: `https://figma.com/design/:fileKey/:fileName?node-id=1-2`
  - `:fileKey` é a chave do arquivo
  - `1-2` é o node ID (componente ou frame a implementar)
- **OU** com MCP `figma-desktop`: usuário pode selecionar um node direto no app desktop (sem URL obrigatória)
- Projeto deve ter design system ou biblioteca de componentes (preferido)

## Fluxo obrigatório

**Siga estas etapas em ordem. Não pule.**

### Etapa 0: Configurar Figma MCP (se ainda não estiver)

Se alguma chamada MCP falhar por falta de conexão, pause e configure:

1. Adicione o servidor MCP do Figma na config MCP do seu agent:
   - URL: `https://mcp.figma.com/mcp`
2. Habilite cliente MCP remoto se o agent exigir.
3. Faça login com OAuth pelo fluxo de autenticação do seu agent.

Após login bem-sucedido o usuário normalmente precisa reiniciar o agent. Finalize sua resposta informando isso para que na próxima tentativa possam continuar na Etapa 1.

### Etapa 1: Obter Node ID

#### Opção A: Extrair da URL do Figma

Com URL fornecida, extraia file key e node ID para passar aos tools MCP.

**Formato de URL:** `https://figma.com/design/:fileKey/:fileName?node-id=1-2`

**Extrair:**

- **File key:** `:fileKey` (segmento após `/design/`)
- **Node ID:** `1-2` (valor do query param `node-id`)

**Nota:** Com MCP local desktop (`figma-desktop`), `fileKey` pode não ir como parâmetro — o servidor usa o arquivo aberto; só `nodeId` quando aplicável.

**Exemplo:**

- URL: `https://figma.com/design/kL9xQn2VwM8pYrTb4ZcHjF/DesignSystem?node-id=42-15`
- File key: `kL9xQn2VwM8pYrTb4ZcHjF`
- Node ID: `42-15`

#### Opção B: Seleção atual no Figma Desktop (somente MCP figma-desktop)

Com MCP `figma-desktop` sem URL dos usuários, os tools usam automaticamente o node selecionado no arquivo aberto no desktop.

**Nota:** Prompt por seleção só funciona com servidor `figma-desktop`. Servidor remoto exige link de frame ou layer para extrair contexto. O app desktop precisa estar aberto com um node selecionado.

### Etapa 2: Buscar contexto de design

Execute `get_design_context` com file key e node ID extraídos.

```
get_design_context(fileKey=":fileKey", nodeId="1-2")
```

Isso retorna dados estruturados incluindo:

- Propriedades de layout (Auto Layout, constraints, sizing)
- Especificações de tipografia
- Valores de cor e design tokens
- Estrutura de componentes e variantes
- Espaçamento e padding

**Se a resposta for grande ou truncada:**

1. Execute `get_metadata(fileKey=":fileKey", nodeId="1-2")` para mapa de alto nível
2. Identifique child nodes necessários na metadata
3. Busque cada child com `get_design_context(fileKey=":fileKey", nodeId=":childNodeId")`

### Etapa 3: Captura de referência visual

Execute `get_screenshot` com os mesmos file key e node ID.

```
get_screenshot(fileKey=":fileKey", nodeId="1-2")
```

O screenshot é fonte da verdade para validação visual. Mantenha-o acessível durante a implementação.

### Etapa 4: Baixar assets necessários

Baixe imagens, ícones, SVG retornados pelo MCP.

**IMPORTANTE:**

- Se o MCP retornar origem `localhost` para imagem ou SVG, use diretamente
- NÃO importe novos pacotes de ícones — assets vêm do payload do Figma
- NÃO use placeholders se origem localhost fornecida
- Assets são servidos pelo endpoint embutido do MCP

### Etapa 5: Traduzir para convenções do projeto

Traduza a saída do Figma para framework, estilos e convenções deste projeto.

**Princípios:**

- Trate saída típica React + Tailwind como representação de design/comportamento, não estilo final
- Troque utilities Tailwind pelos utilities ou tokens do design system do projeto
- Reutilize botões, inputs, tipografia, wrappers de ícones
- Use sistema de cores, escala tipográfica e espaçamentos de forma consistente
- Respeite roteamento, estado e padrões de fetch existentes

### Etapa 6: Paridade visual 1:1

Busque equivalência pixel-level com o Figma.

**Diretrizes:**

- Priorize fidelidade ao Figma para bater exatamente
- Evite valores hardcoded — use tokens do Figma onde houver
- Em conflito entre tokens do design system e Figma, prefira tokens do DS mas ajuste espaçamento/tamanhos minimamente para o visual
- Siga WCAG para acessibilidade
- Adicione documentação de componente quando útil

### Etapa 7: Validar contra o Figma

Antes de concluir, valide a UI final contra o screenshot.

**Checklist:**

- [ ] Layout bate (espaço, alinhamento, tamanhos)
- [ ] Tipografia bate (fonte, tamanho, peso, line-height)
- [ ] Cores batem exatamente
- [ ] Estados interativos funcionam (hover, active, disabled)
- [ ] Comportamento responsivo segue constraints do Figma
- [ ] Assets renderizam corretamente
- [ ] Critérios de acessibilidade atendidos

## Regras de implementação

### Organização de componentes

- Coloque UI no diretório de design system do projeto
- Siga convenções de nomenclatura
- Evite estilos inline salvo valores dinâmicos de fato necessários

### Integração ao design system

- SEMPRE use componentes do DS quando possível
- Mapeie tokens do Figma para tokens do projeto
- Se já existir componente correspondente, estenda em vez de criar novo
- Documente novos componentes acrescentados ao DS

### Qualidade de código

- Extraia constantes/tokens em vez de hardcode
- Componentes compostos e reutilizáveis
- Tipos TypeScript para props
- JSDoc em componentes exportados

## Exemplos

### Exemplo 1: Botão

Usuário: "Implement this Figma button component: https://figma.com/design/kL9xQn2VwM8pYrTb4ZcHjF/DesignSystem?node-id=42-15"

**Ações:**

1. Extrair fileKey=`kL9xQn2VwM8pYrTb4ZcHjF` e nodeId=`42-15`
2. `get_design_context(fileKey="kL9xQn2VwM8pYrTb4ZcHjF", nodeId="42-15")`
3. `get_screenshot(...)` como referência
4. Baixar ícones do botão no endpoint de assets
5. Verificar se já existe componente de botão
6. Se sim estender variante; se não criar com convenções do projeto
7. Mapear cores para tokens (`primary-500`, `primary-hover` etc.)
8. Validar com screenshot padding, radius, tipografia

**Resultado:** Botão conforme Figma integrado ao DS.

### Exemplo 2: Layout de dashboard

Usuário: "Build this dashboard: https://figma.com/design/pR8mNv5KqXzGwY2JtCfL4D/Dashboard?node-id=10-5"

**Ações:**

1. Extrair fileKey e nodeId
2. `get_metadata(...)` para estrutura
3. Identificar header, sidebar, conteúdo, cards e child node IDs
4. `get_design_context` para cada seção principal
5. `get_screenshot` da página inteira
6. Baixar logos, ícones, charts
7. Montar layout com primitivas do projeto
8. Implementar cada seção reaproveitando componentes
9. Validar responsividade com constraints do Figma

**Resultado:** Dashboard completo conforme Figma com layout responsivo.

## Boas práticas

### Comece sempre com contexto

Nunca implemente só por suposição. Busque sempre `get_design_context` e `get_screenshot` primeiro.

### Validação incremental

Valide durante a implementação, não só ao final — antecipa problemas.

### Documente desvios

Se precisar desviar do Figma (acessibilidade, restrição técnica), documente no código.

### Reutilize antes de recriar

Sempre procure componentes existentes. Consistência no codebase > cópia literal cega.

### Design system primeiro

Na dúvida, prefira padrões do projeto a tradução literal do Figma.

## Problemas comuns

### Saída do Figma truncada

**Causa:** Design muito complexo ou muitas camadas.

**Solução:** Use `get_metadata` e depois `get_design_context` por node.

### Implementação não bate visualmente

**Causa:** Diferenças entre código e design original.

**Solução:** Compare lado a lado com screenshot. Confira valores no design context.

### Assets não carregam

**Causa:** Endpoint inacessível ou URLs modificadas.

**Solução:** Confirme acessibilidade do endpoint. URLs localhost devem usar-se sem alteração.

### Tokens do projeto diferentes do Figma

**Causa:** Valores do DS diferem das specs do arquivo.

**Solução:** Prefira tokens do projeto para consistência; ajuste espaçamento/tamanho para preservar visual.

## Compreender a implementação a partir do design

Este fluxo cria processo confiável de designs para código:

**Designers:** confiança de que implementações batem em fidelidade visual.

**Devs:** abordagem estruturada que reduz achismo e idas-e-voltas.

**Times:** consistência sem sacrificar integridade do design system.

## Recursos adicionais

- [Documentação do Figma MCP Server](https://developers.figma.com/docs/figma-mcp-server/)
- [Figma MCP Tools and Prompts](https://developers.figma.com/docs/figma-mcp-server/tools-and-prompts/)
- [Variáveis e design tokens no Figma](https://help.figma.com/hc/en-us/articles/15339657135383-Guide-to-variables-in-Figma)
