---
name: decomposition-planning-roadmap
description: Cria planos de decomposição passo a passo e roadmaps de migração para partir aplicações monolíticas. Use quando perguntar em que ordem extrair serviços, planejar migração, criar roadmap de decomposição, priorizar o que dividir ou estratégia monólito-microserviços ou acompanhar progresso da decomposição. Aciona em planejamento sequenciado após ou junto à análise estrutural. NÃO use para apenas mapear domínios conceituais desde zero (use domain-analysis) nem dimensionamento físico de componentes (use component-identification-sizing).
---

# Planejamento de Decomposição e Roadmap

Esta skill cria planos e roadmaps estruturados de decomposição para guiar a migração de monólito para arquiteturas distribuídas, priorizando trabalho e rastreando progresso através dos patterns de decomposição.

## Como usar

### Quick start

Peça criação de um plano de decomposição:

- **"Create a decomposition roadmap for this codebase"**
- **"Plan the decomposition migration strategy"**
- **"Prioritize decomposition work based on component analysis"**
- **"Create a step-by-step decomposition plan"**

### Usage Examples

**Exemplo 1: roadmap completo**

```
User: "Create a decomposition roadmap for this codebase"

The skill will:
1. Analyze current codebase state
2. Identify decomposition patterns to apply
3. Prioritize work based on risk and value
4. Create phased roadmap
5. Generate architecture stories
6. Estimate effort and dependencies
```

**Exemplo 2: plano priorizado**

```
User: "Prioritize decomposition work based on component analysis"

The skill will:
1. Review component inventory and dependencies
2. Assess risk and value for each pattern
3. Prioritize patterns by impact
4. Create prioritized work plan
```

**Exemplo 3: planejamento por fase**

```
User: "Create a phased decomposition plan"

The skill will:
1. Group decomposition patterns into phases
2. Identify dependencies between phases
3. Create phase timeline
4. Define phase success criteria
```

### Processo passo a passo

1. **Avaliar estado atual**: Analisar codebase e identificar o que já foi feito
2. **Identificar patterns**: Determinar quais patterns de decomposição aplicar
3. **Priorizar trabalho**: Classificar patterns por risco, valor e dependências
4. **Criar roadmap**: Montar plano faseado com marcos
5. **Gerar stories**: Criar histórias de arquitetura para acompanhamento
6. **Acompanhar progresso**: Monitorar nas fases da decomposição

## Quando usar

Aplique esta skill quando:

- Iniciar esforço de decomposição
- Planejar migração de monólito para arquitetura distribuída
- Priorizar trabalho de decomposição
- Criar histórias de arquitetura para decomposição
- Acompanhar progresso através dos patterns de decomposição
- Precisar de abordagem estruturada à decomposição
- Quiser estimar esforço e dependências

## Conceitos centrais

### Sequência dos patterns de decomposição

Os seis patterns orientados a componente devem ser aplicados em sequência:

1. **Identify and Size Components** — Entender o que você tem
2. **Gather Common Domain Components** — Encontrar duplicações
3. **Flatten Components** — Remover classes órfãs
4. **Determine Component Dependencies** — Avaliar acoplamento
5. **Create Component Domains** — Agrupar em domínios
6. **Create Domain Services** — Extrair como serviços

### Abordagem faseada

A decomposição costuma seguir fases:

**Fase 1: Analysis & Preparation** (Patterns 1–4)

- Identificação e dimensionamento de componentes
- Detecção de componentes em comum
- Achatamento de componentes
- Análise de dependências

**Fase 2: Domain Organization** (Pattern 5)

- Identificação de domínios
- Agrupamento de componentes
- Refactoring de namespaces

**Fase 3: Service Extraction** (Pattern 6)

- Criação de serviços de domínio
- Extração incremental
- Definição de limites de API

### Fatores de priorização

Ao priorizar trabalho de decomposição, considere:

- **Risk**: baixo = mais fácil extrair, menos dependências
- **Value**: alto = crítico ao negócio, alto impacto
- **Dependencies**: Pode ser feito de forma independente?
- **Complexity**: simples = menos componentes, fronteiras claras
- **Coupling**: baixo = mais fácil extrair

## Processo de análise

### Fase 1: Avaliar estado atual

Analise o que já foi feito:

1. **Checar inventário de componentes**
   - Componentes já foram identificados e dimensionados?
   - Existe documento de inventário?
   - Componentes grandes demais estão marcados?

2. **Checar análise de componentes comuns**
   - Domínio comum já foi identificado?
   - Oportunidades de consolidação documentadas?
   - Impacto em acoplamento analisado?

3. **Checar estrutura de componentes**
   - Componentes já foram achatados?
   - Há classes órfãs?
   - Estrutura está limpa?

4. **Checar análise de dependências**
   - Dependências foram mapeadas?
   - Análise de acoplamento concluída?
   - Viabilidade avaliada?

5. **Checar identificação de domínios**
   - Domínios identificados?
   - Componentes agrupados por domínio?
   - Namespaces alinhados?

6. **Checar extração de serviços**
   - Algum serviço já foi extraído?
   - Serviços de domínio criados?
   - Arquitetura baseada em serviços em uso?

**Saída**: Avaliação do estado atual indicando o que está feito e o que falta

### Fase 2: Identificar patterns a aplicar

Determine quais patterns ainda precisam ser aplicados:

1. **Rever pré-requisitos**
   - Pattern 1: sempre (fundação)
   - Pattern 2: se há componentes em comum
   - Pattern 3: se há hierarquia de componentes
   - Pattern 4: sempre (checagem de viabilidade)
   - Pattern 5: antes da extração
   - Pattern 6: passo final

2. **Checar completude**
   - Quais concluídos?
   - Quais em progresso?
   - Quais não iniciados?

3. **Identificar lacunas**
   - O que ainda falta aplicar?
   - O que bloqueia?
   - Quais dependências?

**Saída**: Lista de patterns com status

### Fase 3: Priorizar trabalho

Priorize patterns e itens:

1. **Risco**
   - Baixo: infra, funcionalidade isolada
   - Médio: domínio com algumas dependências
   - Alto: core de negócio, alto acoplamento

2. **Valor**
   - Alto: crítico, impacto grande, mudanças frequentes
   - Médio: importante, não crítico
   - Baixo: nice-to-have, baixo impacto

3. **Dependências**
   - Independent: sem outro trabalho prévio
   - Dependent: exige outros patterns antes
   - Blocking: impede outros

4. **Calcular pontuação de prioridade**

   ```
   Priority = (Value × 3) - (Risk × 2) - (Dependencies × 1)

   Higher score = Higher priority
   ```

**Saída**: Lista priorizada de patterns e trabalhos

### Fase 4: Criar roadmap faseado

Monte roadmap com marcos:

1. **Definir fases**
   - Fase 1: Analysis & Preparation
   - Fase 2: Domain Organization
   - Fase 3: Service Extraction
   - Fase 4: Optimization & Refinement

2. **Atribuir patterns às fases**
   - Qual pattern em qual fase?
   - Sequência dentro da fase?
   - Dependências entre fases?

3. **Definir marcos**
   - O que completa cada fase?
   - Critérios de sucesso?
   - Entregas esperadas?

4. **Estimar cronograma**
   - Duração de cada fase?
   - Dependências?
   - Caminho crítico?

**Saída**: Roadmap faseado com linha do tempo e marcos

### Fase 5: Gerar histórias de arquitetura

Crie histórias para rastrear trabalho:

1. **Modelo de story**

   ```
   As an architect, I need to [apply pattern/refactor component]
   to support [architectural characteristic/business need]
   so that [benefit/outcome]
   ```

2. **Decompor trabalho**
   - Uma story por aplicação de pattern
   - Uma por refactoring maior
   - Uma por agrupamento em domínio

3. **Critérios de aceite**
   - O que é “done”?
   - Métricas de validação?
   - Testes de conclusão?

4. **Estimar esforço**
   - Story points ou tempo
   - Complexidade
   - Riscos

**Saída**: Lista de stories com estimativas

### Fase 6: Acompanhar progresso

Monitorar decomposição:

1. **Completude de patterns**
2. **Completude de stories**
3. **Métricas**: componentes, domínios, serviços
4. **Bloqueios**

**Saída**: Dashboard e relatório de status

## Formato de saída

### Roadmap de decomposição

```markdown
# Decomposition Roadmap

## Current State Assessment

**Completed Patterns**:

- ✅ Pattern 1: Identify and Size Components
- ✅ Pattern 2: Gather Common Domain Components
- ⚠️ Pattern 3: Flatten Components (in progress)
- ❌ Pattern 4: Determine Component Dependencies (not started)
- ❌ Pattern 5: Create Component Domains (not started)
- ❌ Pattern 6: Create Domain Services (not started)

**Key Findings**:

- 75 components identified
- 3 common domain components found
- 2 oversized components need splitting
- High database coupling detected

## Phased Roadmap

### Phase 1: Analysis & Preparation (Weeks 1-4)

**Goal**: Complete component analysis and refactoring

**Patterns**:

1. Complete Pattern 3: Flatten Components
2. Apply Pattern 4: Determine Component Dependencies
3. Refactor oversized components

**Milestones**:

- Week 2: Component flattening complete
- Week 4: Dependency analysis complete

**Deliverables**:

- Flattened component structure
- Dependency diagram
- Feasibility assessment

### Phase 2: Domain Organization (Weeks 5-8)

**Goal**: Organize components into domains

**Patterns**:

1. Apply Pattern 5: Create Component Domains
2. Refactor namespaces for domain alignment

**Milestones**:

- Week 6: Domains identified
- Week 8: Namespace refactoring complete

**Deliverables**:

- Domain map
- Refactored component namespaces
- Domain documentation

### Phase 3: Service Extraction (Weeks 9-16)

**Goal**: Extract domains to domain services

**Patterns**:

1. Apply Pattern 6: Create Domain Services
2. Extract services incrementally

**Milestones**:

- Week 12: First domain service extracted
- Week 16: All domain services extracted

**Deliverables**:

- Domain services deployed
- API boundaries defined
- Service documentation
```

### Prioritized Work Plan

```markdown
## Prioritized Work Plan

### High Priority (Do First)

1. **Complete Component Flattening** (Priority: 9/10)
   - Risk: Low
   - Value: High (enables domain grouping)
   - Dependencies: None
   - Effort: 2 weeks

2. **Dependency Analysis** (Priority: 8/10)
   - Risk: Low
   - Value: High (validates feasibility)
   - Dependencies: Component flattening
   - Effort: 1 week

### Medium Priority (Do Next)

3. **Domain Identification** (Priority: 7/10)
   - Risk: Medium
   - Value: High (enables service extraction)
   - Dependencies: Dependency analysis
   - Effort: 2 weeks

### Low Priority (Do Later)

4. **Service Extraction** (Priority: 5/10)
   - Risk: High
   - Value: High (final goal)
   - Dependencies: Domain identification
   - Effort: 8 weeks
```

### Architecture Stories

```markdown
## Architecture Stories

### Story 1: Flatten Ticket Components

**As an architect**, I need to flatten the Ticket component hierarchy
to support better component organization
so that components exist only as leaf nodes.

**Acceptance Criteria**:

- [ ] No orphaned classes in root namespaces
- [ ] All components are leaf nodes
- [ ] Component structure validated

**Estimate**: 5 story points
**Priority**: High
**Dependencies**: None

### Story 2: Identify Component Domains

**As an architect**, I need to group components into logical domains
to support service-based architecture
so that components can be extracted to domain services.

**Acceptance Criteria**:

- [ ] All components assigned to domains
- [ ] Domain boundaries validated with stakeholders
- [ ] Domain map created

**Estimate**: 8 story points
**Priority**: High
**Dependencies**: Component flattening complete
```

### Progress Dashboard

```markdown
## Decomposition Progress Dashboard

### Pattern Completion Status

| Pattern                    | Status         | Progress | Blocker                 |
| -------------------------- | -------------- | -------- | ----------------------- |
| Identify & Size Components | ✅ Complete    | 100%     | None                    |
| Gather Common Components   | ✅ Complete    | 100%     | None                    |
| Flatten Components         | ⚠️ In Progress | 60%      | None                    |
| Determine Dependencies     | ❌ Not Started | 0%       | Waiting on flattening   |
| Create Domains             | ❌ Not Started | 0%       | Waiting on dependencies |
| Create Domain Services     | ❌ Not Started | 0%       | Waiting on domains      |

### Story Completion Status

**Completed**: 5 stories (25%)
**In Progress**: 3 stories (15%)
**Not Started**: 12 stories (60%)

### Key Metrics

- Components Identified: 75
- Components Refactored: 45 (60%)
- Domains Created: 0
- Services Extracted: 0
```

## Checklist de análise

**Current State Assessment**:

- [ ] Reviewed component inventory
- [ ] Checked common component analysis
- [ ] Assessed component structure
- [ ] Reviewed dependency analysis
- [ ] Checked domain identification
- [ ] Assessed service extraction status

**Pattern Identification**:

- [ ] Identified which patterns are complete
- [ ] Identified which patterns are in progress
- [ ] Identified which patterns need to be applied
- [ ] Checked pattern dependencies

**Prioritization**:

- [ ] Assessed risk for each pattern
- [ ] Assessed value for each pattern
- [ ] Assessed dependencies
- [ ] Calculated priority scores

**Roadmap Creation**:

- [ ] Defined phases
- [ ] Assigned patterns to phases
- [ ] Set milestones
- [ ] Estimated timeline

**Story Generation**:

- [ ] Created architecture stories
- [ ] Added acceptance criteria
- [ ] Estimated effort
- [ ] Prioritized stories

**Progress Tracking**:

- [ ] Set up tracking mechanism
- [ ] Defined metrics
- [ ] Created dashboard
- [ ] Identified blockers

## Notas de implementação

### Modelos de roadmap

**Roadmap simples** (projetos pequenos):

- Phase 1: Analysis (2-4 weeks)
- Phase 2: Refactoring (4-6 weeks)
- Phase 3: Extraction (8-12 weeks)

**Roadmap detalhado** (projetos grandes):

- Phase 1: Analysis & Preparation (4-8 weeks)
- Phase 2: Domain Organization (4-6 weeks)
- Phase 3: Service Extraction (12-16 weeks)
- Phase 4: Optimization (4-8 weeks)

### Matriz de priorização

Matriz 2×2 para priorização:

```
High Value, Low Risk    | High Value, High Risk
(Do First)              | (Do Carefully)
────────────────────────┼──────────────────────
Low Value, Low Risk     | Low Value, High Risk
(Do Later)              | (Avoid/Defer)
```

### Estimativa de stories

**Story Points** (Fibonacci):

- 1: trivial (poucas horas)
- 2: simples (1 dia)
- 3: pequeno (2–3 dias)
- 5: médio (1 semana)
- 8: grande (2 semanas)
- 13: muito grande (3+ semanas)

**Estimativas de tempo**:

- Small: 1–3 dias
- Medium: 1–2 semanas
- Large: 2–4 semanas
- Very Large: 1+ mês

## Boas práticas

### Faça ✅

- Começar pelos patterns de análise (1–4)
- Priorizar trabalho baixo risco / alto valor
- Criar histórias de arquitetura
- Marcos e critérios de sucesso claros
- Acompanhar progresso com regularidade
- Ajustar roadmap com aprendizados
- Alinhar prioridades com stakeholders

### Evite ❌

- Não pule patterns de análise
- Não inicie extração de serviço cedo demais
- Não ignore dependências entre patterns
- Não crie prazos irreais
- Não omita tracking
- Não deixe de validar com stakeholders
- Não avance sem avaliação de viabilidade

## Integração com outras skills

Coordena uso de skills de decomposição:

1. **Component Identification & Sizing** → base do planejamento
2. **Common Domain Component Detection** → trabalho de consolidação
3. **Component Flattening** → preparação para agrupar domínios
4. **Component Dependency Analysis** → valida viabilidade
5. **Domain Identification & Grouping** → habilita extração
6. **Decomposition Planning & Roadmap** (esta skill) → coordena tudo

## Próximos passos

Após criar o roadmap:

1. **Review with Stakeholders** — alinhamento do plano
2. **Start Phase 1** — patterns de análise primeiro
3. **Track Progress** — conclusão e bloqueios
4. **Adjust as Needed** — atualizar com aprendizado
5. **Celebrate Milestones** — reconhecer progresso

## Notas

- Roadmaps devem ser documentos vivos, atualizados com frequência
- Priorização pode mudar conforme se aprende mais
- Dependências entre patterns precisam ser respeitadas
- Avaliação de viabilidade é crítica antes de avançar
- Colaboração com stakeholders é essencial
- Tracking ajuda a achar problemas cedo
