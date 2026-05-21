# Padrões de composição de reação

Um repositório estruturado para padrões de composição React escaláveis. Estes
padrões ajudam a evitar a proliferação de props booleanos usando componentes compostos,
levantando o estado e compondo os internos.

## Estrutura

- `rules/` - Arquivos de regras individuais (um por regra)
  - `_sections.md` - Metadados da seção (títulos, impactos, descrições)
  - `_template.md` - Modelo para criação de novas regras
  - `area-description.md` - Arquivos de regras individuais
- `metadata.json` - Metadados do documento (versão, organização, resumo)
- **`AGENTS.md`** - Saída compilada (gerada)

## Regras

### Arquitetura de Componentes (CRÍTICO)

- `architecture-avoid-boolean-props.md` - Não adicione adereços booleanos para personalizar
  comportamento
- `architecture-compound-components.md` - Estrutura como componentes compostos com
  contexto compartilhado

### Gestão de Estado (ALTA)

- `state-lift-state.md` - Eleva o estado para os componentes do provedor
- `state-context-interface.md` - Defina interfaces de contexto claras
  (estado/ações/meta)
- `state-decouple-implementation.md` - Desacopla o gerenciamento de estado da UI

### Padrões de implementação (MÉDIO)

- `patterns-children-over-render-props.md` - Prefira filhos em vez de adereços renderX
- `patterns-explicit-variants.md` - Crie variantes de componentes explícitas

## Princípios Fundamentais

1. **Composição sobre configuração** — Em vez de adicionar acessórios, deixe os consumidores
   compor
2. **Eleve seu estado** — Estado em provedores, não preso em componentes
3. **Componha seus componentes internos** — Os subcomponentes acessam o contexto, não os adereços
4. **Variantes explícitas** — Crie ThreadComposer, EditComposer, não Composer
   com isThread

## Criando uma nova regra

1. Copie `rules/_template.md` para `rules/area-description.md`
2. Escolha o prefixo de área apropriado:
   - `architecture-` para arquitetura de componentes
   - `state-` para gerenciamento de estado
   - `patterns-` para padrões de implementação
3. Preencha o frontmatter e o conteúdo
4. Certifique-se de ter exemplos claros com explicações

## Níveis de impacto

- `CRITICAL` - Padrões fundamentais, evita código insustentável
- `HIGH` - Melhorias significativas de manutenção
- `MEDIUM` - Boas práticas para código mais limpo
