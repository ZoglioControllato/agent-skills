# Fase do Plano — Metodologia Detalhada

Esta referência contém o processo passo a passo para a fase PLAN. A fase PLANEJAR NÃO DEVE começar até que a fase PESQUISA esteja totalmente concluída com todos os quatro arquivos de saída gravados.

Cada decisão nesta fase deve ser baseada nas evidências dos arquivos de resultados da PESQUISA. Se você estiver tomando uma decisão sem evidências, pare e volte para a PESQUISA.

## Etapa 5: Definir a direção da migração

### 5.1 — Avaliação de direção

Com base nos resultados da PESQUISA, determine qual direção de migração se aplica. Esta NÃO é uma escolha que você faz – é determinada por evidências.

| Direção                                        | Evidências que apontam aqui                                                                                                                                                                                            |
| ---------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Decomposição** (monólito → serviços)         | Altas taxas de acoplamento entre domínios, gargalos de implantação citados na configuração de CI/CD, restrições de escala na configuração da infraestrutura, requisitos de autonomia da equipe declarados pelo usuário |
| **Consolidação** (serviços → monólito modular) | Comunicação excessiva entre serviços encontrada no catálogo de integração, sobrecarga operacional em infras                                                                                                            |

configuração da estrutura, problemas de consistência de dados entre serviços, equipe pequena declarada pelo usuário |
| **Pilha cruzada** (alteração de linguagem/estrutura) | EOL/pilha obsoleta no inventário de dependência, pilha de destino especificada pelo usuário, lacunas de desempenho/ecossistema documentadas na pesquisa de pilha |
| **Modernização no local** (mesma pilha, melhor arquitetura) | A pilha é atual, mas a arquitetura apresenta problemas (departamentos circulares, sem limites de domínio, acesso a dados dispersos) |
| \*\*Hyb

livrar\*\* | Combinação dos itens acima — documentar qual direção se aplica a qual domínio |

### 5.2 — Documentação de direção

Em `00-roadmap.md`, documente a direção escolhida com evidências explícitas:```markdown

## Migration Direction: {Direction}

**Rationale**: Based on the following RESEARCH findings:

- {Finding 1 — reference to research/file.md}
- {Finding 2 — reference to research/file.md}
- {Finding 3 — reference to research/file.md}

**User-confirmed constraints**:

- {Any constraints the user provided}

````
Se a direção for ambígua, PERGUNTE AO USUÁRIO. Apresente as evidências para cada opção e deixe-os decidir. Nunca escolha uma direção sem evidências suficientes.

## Etapa 6: Projetar costuras e fachadas

Carregue `references/strangler-fig-patterns.md` para detalhes do padrão.

### 6.1 — Identificação da Costura

Uma costura é um limite onde você pode interceptar e redirecionar o comportamento sem modificar o código legado. Para cada domínio identificado na PESQUISA:

1. **Seams de API** — rotas HTTP, resolvedores GraphQL, definições de serviço gRPC. Faça referência às definições exatas da rota com `file:line`.
2. **Seams de eventos** — Produtores/consumidores de filas de mensagens, emissores de eventos, webhooks. Referência com `file:line`.
3. **Conjuntos de dados** — Pontos de acesso ao banco de dados onde leituras/gravações podem ser interceptadas. Faça referência aos modelos ORM ou locais de consulta com `file:line`.
4. **Conexões da interface do usuário** — Limites de componentes, divisões em nível de rota, microfone

pontos de montagem ro-frontend. Referência com `file:line`.

### 6.2 — Projeto de Camada de Fachada

Para cada emenda, defina a fachada/roteador que permitirá a migração incremental:```markdown
## Seam: {Name}

**Type**: API | Event | Data | UI
**Location**: `file:line`
**Current behavior**: {What it does today — referenced}
**Facade approach**: {How to intercept — pattern from strangler-fig-patterns.md}
**Routing mechanism**: Feature flag | API gateway | Proxy | Event interceptor
**Rollback mechanism**: {How to instantly revert to legacy behavior}
````

### 6.3 — Ordem de Dependência

Determine a ordem de migração com base na análise de dependência do RESEARCH:

1. Domínios com **zero dependências de entrada** de outros domínios podem ser migrados primeiro (nós folha).
2. Domínios dos quais **muitos outros dependem** devem ser migrados por último (principal/compartilhado).
3. Tabelas de banco de dados compartilhadas exigem tratamento especial — documente a estratégia de gravação dupla ou sincronização de dados.

Produza um gráfico de dependência mostrando a ordem de migração.

## Etapa 7: Planos de migração por domínio

Para cada contexto limitado identificado em RESEARCH, crie um arquivo dedicado: `./migration-plan/domains/XX-domain-{name}.md`.

### Modelo de arquivo de domínio

Todo arquivo de domínio deve seguir esta estrutura:```markdown

# Domain: {Name}

## Current State

**Modules**: {List with file:line refs}
**Responsibility**: {One sentence}
**Dependencies**:

- Depends on: {Other domains, with file:line refs to import statements}
- Depended on by: {Other domains that import from this one}
  **Data stores**: {Tables/collections with file:line refs to models}
  **External integrations**: {APIs, queues, etc. with file:line refs}

## Target State

**Architecture**: {Target structure}
**Technology**: {Stack — verified via web search in RESEARCH, cite stack-research.md}
**Key changes**:

- {Change 1 — what moves where}
- {Change 2}

## Migration Steps

### Step 1: {Action}

**Pattern**: {Reference to strangler-fig-patterns.md section}
**Seam**: {Reference to seam identified in Step 6}
**What changes**: {Specific description}
**Files affected**: {file:line list}
**Testing**: {Strategy from testing-safety-nets.md}
**Rollback**: {How to revert this specific step}
**Success criteria**: {Measurable metrics}

### Step 2: {Action}

...

## Risks Specific to This Domain

| Risk   | Impact  | Mitigation | Evidence                    |
| ------ | ------- | ---------- | --------------------------- |
| {Risk} | {Level} | {Strategy} | {file:line or research ref} |

## Dependencies on Other Domains

**Must complete before this domain**:

- {Domain X} — because {reason with evidence}

**Blocks these domains**:

- {Domain Y} — because {reason with evidence}

````
### Diretrizes para redação de arquivos de domínio

- Cada arquivo deve ser independente o suficiente para que outro agente execute a migração para aquele domínio sem precisar ler todos os outros arquivos do domínio.
- Referências cruzadas para outros arquivos de domínio são aceitáveis, mas o contexto principal deve estar no arquivo.
- Mantenha cada arquivo com menos de 300 linhas. Se um domínio for muito complexo, divida-o em subdomínios.
- Toda referência `file:line` deve ter sido realmente lida durante a PESQUISA. Nunca fabrique referências.

## Etapa 8: Roteiro Consolidado

Escreva `./migration-plan/00-roadmap.md` como o documento mestre que une tudo.

### Modelo de roteiro```markdown
# Migration Roadmap

## Executive Summary

**Current state**: {1-2 sentences with evidence refs}
**Target state**: {1-2 sentences}
**Migration direction**: {Direction from Step 5}
**Estimated domains**: {Count}
**Critical risks**: {Top 3 from risk-assessment.md}

## Migration Direction Rationale

{From Step 5.2}

## Phase Sequence

### Phase 0: Safety Net Setup
**Duration estimate**: {Based on codebase size from RESEARCH}
**Goal**: Establish characterization tests and monitoring before any migration begins.
**Details**: See `references/testing-safety-nets.md` for methodology.
**Domains affected**: All
**Success criteria**: {Measurable}

### Phase 1: {First domain(s) to migrate}
**Domains**: {List — leaf nodes from dependency analysis}
**Why first**: {Evidence — lowest coupling, no incoming dependencies}
**Plan files**: `domains/01-domain-{name}.md`
**Dependencies**: Phase 0 complete
**Success criteria**: {Measurable}

### Phase 2: {Next domain(s)}
...

### Phase N: Legacy Decommission
**Goal**: Remove legacy code paths after all domains are migrated and validated.
**Prerequisites**: All domains at 100% traffic on new paths for minimum 30 days.
**Rollback**: Feature flags preserved for 60 days post-decommission.

## Cross-Domain Concerns

### Shared Database Tables
| Table | Accessed By | Strategy | Reference |
|-------|------------|----------|-----------|
| {table} | {domains} | Dual-write / facade | {domain file ref} |

### Shared Authentication / Session
{How auth is handled during migration — cite research}

### Observability
{Monitoring strategy to compare old vs new behavior during migration}

## Risk Summary

{Top risks from risk-assessment.md with cross-references to domain-specific mitigations}

## Open Questions

{Any unresolved items that need user input before execution can begin}
````

## Lista de verificação para conclusão do plano

Antes de declarar o plano concluído, verifique TODOS os seguintes itens:

- [] A direção da migração é documentada com evidências
- [] Cada costura é identificada com refs `file:line`
- [] A camada de fachada/roteador é projetada para cada costura
- [] A ordem de migração do domínio é determinada pela análise de dependência
- [] Cada domínio tem seu próprio arquivo de plano em `./migration-plan/domains/`
- [] Cada arquivo de domínio inclui: estado atual, estado de destino, etapas, testes, reversão, critérios de sucesso
- [] Roteiro consolidado une todos os domínios int

o uma sequência em fases

- [] Preocupações entre domínios (banco de dados compartilhado, autenticação, observabilidade) são abordadas
- [] Não existem declarações não referenciadas em nenhum arquivo de saída
- [] As perguntas abertas são listadas para o usuário
- [] Todas as recomendações de tecnologia foram verificadas por meio de pesquisa na web
