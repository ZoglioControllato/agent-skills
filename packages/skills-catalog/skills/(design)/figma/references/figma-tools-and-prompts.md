# Ferramentas Figma MCP e padrões de prompt

Referência rápida para o conjunto de ferramentas Figma MCP, quando usar cada ferramenta e exemplos rápidos para direcionar a produção para sua pilha.

## Ferramentas principais

- `get_design_context` (Figma Design, Figma Make): Ferramenta primária. Retorna dados de design estruturados e código React + Tailwind padrão. A solicitação baseada em seleção funciona no desktop; o servidor remoto usa um link de quadro/camada para extrair o ID do nó.
- `get_variable_defs` (Figma Design): Lista variáveis/estilos (cores, espaçamento, tipografia) usados ​​na seleção. Útil para alinhar com tokens.
- `get_metadata` (Figma Design): esboço XML esparso de IDs de camada/n

nomes/tipos/posições/tamanhos. Use antes de chamar novamente `get_design_context` em nós grandes para evitar truncamento.

- `get_screenshot` (Figma Design, FigJam): Captura de tela da seleção para verificações de fidelidade visual.
- `get_figjam` (FigJam): XML + capturas de tela para diagramas FigJam (arquitetura, fluxos).
- `create_design_system_rules` (sem contexto de arquivo): Gera um arquivo de regras com orientação de design para código para sua pilha. Salve-o onde o agente possa lê-lo.
- `g

et_code_connect_map` (Figma Design): Retorna o mapeamento de IDs de nós Figma para componentes de código (`codeConnectSrc`, `codeConnectName`). Use para reutilizar componentes existentes.

- `add_code_connect_map` (Figma Design): Adiciona/atualiza um mapeamento entre um nó Figma e um componente de código para melhorar a reutilização.
- `get_strategy_for_mapping` (alfa, apenas local): ferramenta solicitada pelo Figma para decidir a estratégia de mapeamento para conectar um nó a um componente de código.
- `send_get_strategy_re

sponse`(alfa, apenas local): Envia a resposta após`get_strategy_for_mapping`.

- `whoami` (somente remoto): Retorna a identidade do usuário autenticado do Figma (e-mail, planos, tipos de assento).

## Padrões de prompt (contexto de design)

- Alterar framework: “gerar minha seleção Figma em Vue” ou “em HTML + CSS simples” ou “para iOS”.
- Use meus componentes: “gerar minha seleção Figma usando componentes de `src/components/ui`”.
- Combine: “gerar minha seleção Figma usando componentes de `src/ui` e estilo com Tailwind”.
- Observação: no servidor remoto, a solicitação baseada em seleção requer um link de quadro/camada; o servidor extrai o ID do nó da URL.

## Padrões de prompt (variáveis/estilos)

- “obter as variáveis usadas na minha seleção Figma”
- “quais variáveis de cor e espaçamento são usadas na minha seleção Figma?”
- “liste os nomes das variáveis ​​e seus valores usados ​​na minha seleção Figma”

## Padrões de prompt (conexão de código)

- “mostrar o mapa de conexão de código para esta seleção”
- “mapear este nó para `src/components/ui/Button.tsx` com o nome `Button`”

## Lembrete de fluxo de práticas recomendadas

Use `get_design_context` → (opcionalmente `get_metadata` para nós grandes) → `get_screenshot` e mantenha as regras do projeto de `SKILL.md` em mente ao aplicar a saída gerada.
