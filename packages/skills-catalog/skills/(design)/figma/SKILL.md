---
name: figma
description: Usa o servidor MCP do Figma para obter contexto de design, capturas de tela, variables e assets, e para traduzir nodes do Figma em código de produção. Use quando a tarefa envolver URLs do Figma, IDs de nodes, implementação design-to-code ou configuração e troubleshooting do MCP do Figma. Cobre exploração e obtenção geral de dados do Figma. NÃO use para implementação pixel-perfect exclusivamente a partir do design do Figma (use figma-implement-design).
metadata:
  author: github.com/openai/skills
  version: '1.0.0'
---

# Figma MCP

Use o servidor MCP do Figma para implementação guiada pelo Figma. Para detalhes de setup e debug (variáveis de ambiente, configuração, verificação), veja `references/figma-mcp-config.md`.

## Regras de integração Figma MCP

Estas regras definem como traduzir entradas do Figma em código neste projeto e devem ser seguidas em toda mudança guiada pelo Figma.

### Fluxo obrigatório (não pule)

1. Execute get_design_context primeiro para obter a representação estruturada do(s) node(s) exato(s).
2. Se a resposta for grande ou truncada, execute get_metadata para o mapa de alto nível e busque apenas o(s) node(s) necessário(s) com get_design_context.
3. Execute get_screenshot como referência visual da variante implementada.
4. Só depois de ter get_design_context e get_screenshot, baixe os assets necessários e inicie a implementação.
5. Traduza a saída (geralmente React + Tailwind) para convenções, estilos e framework do projeto. Reutilize tokens de cor, componentes e tipografia do projeto sempre que possível.
6. Valide contra o Figma em aspecto e comportamento 1:1 antes de considerar concluído.

### Regras de implementação

- Trate a saída do MCP do Figma (React + Tailwind) como representação de design e comportamento, não como estilo final de código.
- Substitua classes utilitárias Tailwind pelos utilities/tokens preferidos do projeto quando couber.
- Reutilize componentes existentes (ex.: botões, inputs, tipografia, wrappers de ícone) em vez de duplicar funcionalidade.
- Use de forma consistente o sistema de cores, escala tipográfica e tokens de espaçamento do projeto.
- Respeite roteamento, gerenciamento de estado e padrões de fetch já adotados no repositório.
- Busque paridade visual 1:1 com o design do Figma. Em conflitos, prefira tokens do design-system e ajuste espaçamentos ou tamanhos minimamente para bater com o visual.
- Valide a UI final contra o screenshot do Figma em aspecto e comportamento.

### Tratamento de assets

- O servidor MCP do Figma expõe endpoint que serve assets de imagem e SVG.
- IMPORTANTE: Se o MCP retornar localhost como origem de imagem ou SVG, use essa origem diretamente.
- IMPORTANTE: NÃO importe/adicione novos pacotes de ícones; os assets devem vir do payload do Figma.
- IMPORTANTE: NÃO use nem crie placeholders se uma origem localhost for fornecida.

### Prompt por link

- O servidor é baseado em link: copie o link do frame/camada do Figma e passe essa URL ao cliente MCP ao pedir ajuda na implementação.
- O cliente não navega na URL mas extrai o node ID do link; garanta que o link aponte ao node/variante exato desejado.

## Referências

- `references/figma-mcp-config.md` — setup, verificação, troubleshooting e lembretes de uso por link.
- `references/figma-tools-and-prompts.md` — catálogo de ferramentas e padrões de prompt para escolher frameworks/componentes e buscar metadata.
