# Planejamento de decomposição e habilidade de roteiro

Habilidade para criar planos de decomposição estruturados e roteiros para orientar a migração de arquiteturas monolíticas para arquiteturas distribuídas.

## O que essa habilidade faz

Esta habilidade analisa bases de código e o progresso da decomposição para:

1. **Avaliar o estado atual** dos esforços de decomposição
2. **Identifique padrões a serem aplicados** com base no que foi feito
3. **Priorize o trabalho** por risco, valor e dependências
4. **Crie roteiros em fases** com marcos e cronogramas
5. **Gere histórias de arquitetura** para monitorar o trabalho
6. **Acompanhe o progresso** através das fases de decomposição
7. **Identifique bloqueadores** e dependências

## Quando usar esta habilidade

Esta habilidade é aplicada quando você:

- Peça para criar um roteiro de decomposição
- Solicitar planejamento ou estratégia de migração
- Precisa de ajuda para priorizar o trabalho de decomposição
- Deseja acompanhar o progresso da decomposição
- Pergunte sobre o planejamento de decomposição
- Discutir roteiros arquitetônicos
- Precisa de abordagem estruturada para decomposição

## Principais recursos

### Avaliação do estado atual

Avalia o que já foi feito:

- Verifica a conclusão do inventário de componentes
- Revisa a análise de componentes comuns
- Avalia a estrutura dos componentes
- Revisa a análise de dependência
- Verifica o status de identificação do domínio
- Avalia o progresso da extração de serviço

### Planejamento Baseado em Padrões

Planos baseados nos seis padrões de decomposição:

1. Identificar e dimensionar componentes
2. Reúna componentes de domínio comuns
3. Achatar componentes
4. Determine as dependências dos componentes
5. Crie domínios de componentes
6. Crie serviços de domínio

### Estrutura de Priorização

Prioriza o trabalho usando:

- **Avaliação de Risco**: Risco Baixo/Médio/Alto
- **Avaliação de Valor**: Valor Alto/Médio/Baixo
- **Análise de Dependência**: Independente/Dependente/Bloqueio
- **Pontuação de prioridade**: pontuações de prioridade calculadas

### Criação de roteiro em fases

Cria roteiros estruturados com:

- **Definição de Fase**: Análise, Organização, Extração
- **Configuração de marco**: Limpar marcadores de conclusão
- **Estimativa de cronograma**: prazos realistas
- **Definição de entrega**: resultados esperados

## Arquivos incluídos

### SKILL.md (habilidade principal)

O arquivo de habilidade principal contendo:

- Metodologia de avaliação do estado atual
- Processo de identificação de padrões
- Estrutura de priorização
- Técnicas de criação de roadmap
- Geração de histórias de arquitetura
- Abordagem de acompanhamento do progresso
- Modelos de formato de saída

### QUICK-REFERENCE.md (pesquisa rápida)

Referência rápida para cenários comuns:

- Sequência de padrões
- Matriz de priorização
- Modelos de roteiro
- Modelos de histórias
- Lista de verificação de acompanhamento de progresso

### README.md (este arquivo)

Documentação completa incluindo:

- O que a habilidade faz
- Quando usar
- Exemplos de uso
- Conceitos centrais
- Integração com outras habilidades

## Exemplos de uso

### Exemplo 1: Crie um roteiro completo```

User: "Create a decomposition roadmap for this codebase"

The skill will:

1. Assess current state
2. Identify patterns to apply
3. Prioritize work
4. Create phased roadmap
5. Generate architecture stories
6. Estimate timeline

````

**Saída**:```markdown
# Decomposition Roadmap

## Current State Assessment

- ✅ Components identified and sized
- ⚠️ Common components detected (in progress)
- ❌ Component flattening (not started)
- ❌ Dependency analysis (not started)

## Phased Roadmap

### Phase 1: Analysis & Preparation (Weeks 1-4)

- Complete component flattening
- Perform dependency analysis
- Refactor oversized components

### Phase 2: Domain Organization (Weeks 5-8)

- Identify domains
- Group components
- Refactor namespaces

### Phase 3: Service Extraction (Weeks 9-16)

- Extract domain services
- Define API boundaries
- Deploy services
````

### Exemplo 2: Priorizar o trabalho```

User: "Prioritize decomposition work based on component analysis"

The skill will:

1. Review component inventory
2. Assess risk and value
3. Calculate priority scores
4. Create prioritized plan

````

**Saída**:```markdown
## Prioritized Work Plan

### High Priority

1. Complete Component Flattening (Priority: 9/10)
   - Risk: Low, Value: High
   - Effort: 2 weeks

2. Dependency Analysis (Priority: 8/10)
   - Risk: Low, Value: High
   - Effort: 1 week
````

### Exemplo 3: Acompanhar o progresso```

User: "Show decomposition progress"

The skill will:

1. Check pattern completion
2. Review story status
3. Calculate metrics
4. Identify blockers

````

**Saída**:```markdown
## Progress Dashboard

### Pattern Completion

- ✅ Pattern 1: Complete (100%)
- ✅ Pattern 2: Complete (100%)
- ⚠️ Pattern 3: In Progress (60%)
- ❌ Pattern 4: Not Started (0%)

### Key Metrics

- Components Identified: 75
- Components Refactored: 45 (60%)
- Domains Created: 0
- Services Extracted: 0
````

## Conceitos Básicos

### Sequência de padrões de decomposição

Os seis padrões devem ser aplicados em sequência:

1. **Identificar e dimensionar componentes** → Fundação
2. **Reúna componentes de domínio comuns** → Encontre duplicatas
3. **Achatar componentes** → Estrutura limpa
4. **Determinar dependências de componentes** → Avaliar a viabilidade
5. **Criar domínios de componentes** → Agrupar componentes
6. **Criar serviços de domínio** → Extrair serviços

### Abordagem em fases

A decomposição segue três fases principais:

**Fase 1: Análise e Preparação**

- Identificação e dimensionamento de componentes
- Detecção de componentes comuns
- Achatamento de componentes
- Análise de dependência

**Fase 2: Organização do Domínio**

- Identificação de domínio
- Agrupamento de componentes
- Refatoração de namespace

**Fase 3: Extração de Serviço**

- Criação de serviço de domínio
- Extração de serviço
- Definição de limite de API

### Fatores de Priorização

Ao priorizar o trabalho, considere:

- **Risco**: Quão arriscado é esse trabalho?
- **Valor**: Qual é o valor deste trabalho?
- **Dependências**: O que deve ser feito primeiro?
- **Complexidade**: Quão complexo é esse trabalho?

## Como usar

### Início rápido

Solicite a criação de um plano:```
"Create a decomposition roadmap for this codebase"
"Prioritize decomposition work based on component analysis"
"Create a phased decomposition plan"
"Show decomposition progress"

````
### Uso passo a passo

#### 1. Avalie o estado atual

Comece entendendo o que foi feito:```
User: "What's the current state of decomposition?"
````

Isto irá:

- Verifique quais padrões estão completos
- Identifique o que está em andamento
- Encontre o que ainda não começou

#### 2. Criar roteiro

Construa um plano estruturado:```
User: "Create a decomposition roadmap"

````
Isto irá:

- Identificar padrões a serem aplicados
- Priorize o trabalho
- Criar roteiro faseado
- Gerar histórias de arquitetura

#### 3. Priorize o trabalho

Concentre-se em itens de alta prioridade:```
User: "Prioritize decomposition work"
````

Isto irá:

- Avaliar risco e valor
- Calcular pontuações de prioridade
- Criar plano priorizado

#### 4. Acompanhe o progresso

Monitore o progresso ao longo do tempo:```
User: "Show decomposition progress"

````
Isto irá:

- Verifique a conclusão do padrão
- Revise o status da história
- Calcular métricas
- Identificar bloqueadores

### Uso Avançado

#### Fases personalizadas

Defina fases personalizadas:```
User: "Create roadmap with custom phases: Analysis, Refactoring, Extraction, Optimization"
````

#### Priorização baseada em risco

Concentre-se no risco:```
User: "Prioritize work by risk, starting with lowest risk"

````
#### Estimativa de cronograma

Obtenha estimativas de tempo:```
User: "Estimate timeline for complete decomposition"
````

## Formato de saída

A habilidade gera resultados estruturados:

### Roteiro de decomposição```markdown

# Decomposition Roadmap

## Current State Assessment

[What's been done, what's remaining]

## Phased Roadmap

### Phase 1: Analysis & Preparation

[Patterns, milestones, timeline]

### Phase 2: Domain Organization

[Patterns, milestones, timeline]

### Phase 3: Service Extraction

[Patterns, milestones, timeline]

````
### Plano de Trabalho Priorizado```markdown
## Prioritized Work Plan

### High Priority

1. [Work item] (Priority: X/10)
   - Risk: Low/Medium/High
   - Value: High/Medium/Low
   - Effort: X weeks

### Medium Priority

[Similar format]
````

### Histórias de Arquitetura```markdown

## Architecture Stories

### Story 1: [Title]

**As an architect**, I need to [action]
to support [architectural characteristic]
so that [benefit].

**Acceptance Criteria**:

- [ ] Criterion 1
- [ ] Criterion 2

**Estimate**: X story points
**Priority**: High/Medium/Low
**Dependencies**: [List]

````
### Painel de progresso```markdown
## Progress Dashboard

### Pattern Completion Status

[Table showing pattern status and progress]

### Story Completion Status

[Completed/In Progress/Not Started counts]

### Key Metrics

[Components, domains, services metrics]
````

## Integração com outras habilidades

Esta habilidade coordena o uso de outras habilidades de decomposição:

1. **Identificação e dimensionamento de componentes** → Fornece dados básicos
2. **Detecção de componente de domínio comum** → Identifica o trabalho de consolidação
3. **Achatamento de componentes** → Prepara para agrupamento de domínio
4. **Análise de dependência de componentes** → Valida a viabilidade
5. **Identificação e agrupamento de domínio** → Permite extração de serviço
6. **Planejamento e roteiro de decomposição** (esta habilidade) → Coordena tudo

Use esta habilidade para orquestrar todo o esforço de decomposição.

## Instalação

Esta habilidade é instalada no nível do projeto:```
skills/decomposition-planning-roadmap/

````
Isso significa que é:

- **Compartilhado com o repositório**: qualquer pessoa que clonar este repositório obtém a habilidade
- **Controlado por versão**: as alterações são rastreadas no git
- **Específico do projeto**: pode ser personalizado para esta base de código

A habilidade será automaticamente descoberta e usada quando apropriado com base na descrição no frontmatter.

## Personalização

### Para padrões específicos do projeto

Documente a abordagem de decomposição do seu projeto:```
skills/decomposition-planning-roadmap/
└── project-approach.md  # Document project-specific patterns
````

### Fases personalizadas

Modifique as definições de fase em SKILL.md:```markdown

## Custom Phases

For this project:

- Phase 1: Analysis (2 weeks)
- Phase 2: Refactoring (4 weeks)
- Phase 3: Extraction (8 weeks)
- Phase 4: Optimization (2 weeks)

````
### Priorização personalizada

Modifique a fórmula de priorização:```markdown
## Custom Prioritization

For this project:
Priority = (Value × 4) - (Risk × 2) - (Dependencies × 1)
````

## Melhores práticas

### O que fazer ✅

- Comece com padrões de análise (Padrões 1-4)
- Priorize trabalhos de baixo risco e alto valor
- Crie histórias de arquitetura para rastreamento
- Defina marcos claros e critérios de sucesso
- Acompanhe o progresso regularmente
- Ajustar o roteiro com base nos aprendizados
- Colaborar com as partes interessadas nas prioridades
- Respeite as dependências dos padrões

### O que não fazer ❌

- Não pule os padrões de análise
- Não inicie a extração de serviço muito cedo
- Não ignore dependências entre padrões
- Não crie cronogramas irrealistas
- Não pule o acompanhamento do progresso
- Não se esqueça de validar com as partes interessadas
- Não prossiga sem avaliação de viabilidade
- Não crie um roteiro sem uma avaliação do estado atual

## Padrões Comuns

### Estrutura típica de roteiro

**Pequeno Projeto** (3-6 meses):

- Fase 1: Análise (1 mês)
- Fase 2: Refatoração (2 meses)
- Fase 3: Extração (2-3 meses)

**Projeto Médio** (6 a 12 meses):

- Fase 1: Análise e Preparação (2 meses)
- Fase 2: Organização do Domínio (2 meses)
- Fase 3: Extração de Serviço (4-6 meses)
- Fase 4: Otimização (2 meses)

**Grande Projeto** (mais de 12 meses):

- Fase 1: Análise e Preparação (3-4 meses)
- Fase 2: Organização do Domínio (3-4 meses)
- Fase 3: Extração de Serviço (6-8 meses)
- Fase 4: Otimização (2-3 meses)

### Matriz de Priorização```

High Value, Low Risk | High Value, High Risk
(Do First) | (Do Carefully)
────────────────────────┼──────────────────────
Low Value, Low Risk | Low Value, High Risk
(Do Later) | (Avoid/Defer)

````
## Solução de problemas

### Roteiro muito agressivo

**Problema**: o cronograma parece irreal

**Solução**:

- Adicionar tempo de buffer às estimativas
- Divida o trabalho em partes menores
- Reavaliar a complexidade
- Considere as dependências com mais cuidado

### Prioridades pouco claras

**Problema**: é difícil priorizar o trabalho

**Solução**:

- Use matriz de priorização
- Avaliar risco e valor objetivamente
- Obtenha a opinião das partes interessadas
- Considere dependências

### Progresso paralisado

**Problema**: não há progresso

**Solução**:

- Identificar bloqueadores
- Reavaliar prioridades
- Divida o trabalho em pedaços menores
- Obtenha ajuda com bloqueadores

## Referências

Esta habilidade é baseada em:

- **Arquitetura de software: as partes difíceis** por Neal Ford, Mark Richards, Pramod Sadalage, Zhamak Dehghani
- **Padrões de decomposição baseados em componentes** (Capítulo 5)
- **Fundamentos de Arquitetura de Software** por Mark Richards e Neal Ford
- **Princípios de gerenciamento ágil de projetos**

## Contribuindo

Para melhorar esta habilidade:

1. Adicione mais modelos de roteiro
2. Expanda as estruturas de priorização
3. Adicione exemplos de acompanhamento de progresso
4. Documente novos padrões ou abordagens
5. Compartilhe estudos de caso do mundo real

## Versão

**Versão**: 1.0.0
**Criado**: 05/02/2026
**Baseado em**: Padrões de decomposição baseados em componentes de "Arquitetura de software: as partes difíceis"

---

## Início rápido

Para usar esta habilidade imediatamente:```
User: "Create a decomposition roadmap for this codebase"
User: "Prioritize decomposition work based on component analysis"
User: "Create a phased decomposition plan"
User: "Show decomposition progress"
````

Essa habilidade será aplicada automaticamente para fornecer planejamento de decomposição abrangente e criação de roteiros.
