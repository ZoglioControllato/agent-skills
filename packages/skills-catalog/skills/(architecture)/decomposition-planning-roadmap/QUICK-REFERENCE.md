# Planejamento e roteiro de decomposição - referência rápida

## Sequência de padrões```

1. Identify & Size Components → Foundation
2. Gather Common Components → Find duplicates
3. Flatten Components → Clean structure
4. Determine Dependencies → Assess feasibility
5. Create Component Domains → Group components
6. Create Domain Services → Extract services

````
## Abordagem em fases

### Fase 1: Análise e Preparação

- Padrão 1: Identificar e dimensionar componentes
- Padrão 2: Reunir Componentes Comuns
- Padrão 3: Achatar componentes
- Padrão 4: Determinar Dependências

### Fase 2: Organização do Domínio

- Padrão 5: Criar Domínios de Componentes

### Fase 3: Extração de serviço

- Padrão 6: Criar serviços de domínio

## Fórmula de Priorização```
Priority = (Value × 3) - (Risk × 2) - (Dependencies × 1)

Higher score = Higher priority
````

### Níveis de risco

- **Baixo**: Infraestrutura, independente
- **Médio**: componentes do domínio, algumas dependências
- **Alto**: lógica de negócios central, alto acoplamento

### Níveis de valor

- **Alto**: crítico para os negócios, alto impacto
- **Médio**: importante, mas não crítico
- **Baixo**: bom ter, baixo impacto

## Matriz de Priorização```

High Value, Low Risk | High Value, High Risk
(Do First) | (Do Carefully)
────────────────────────┼──────────────────────
Low Value, Low Risk | Low Value, High Risk
(Do Later) | (Avoid/Defer)

````
## Modelos de roteiro

### Pequeno Projeto (3-6 meses)

- Fase 1: Análise (1 mês)
- Fase 2: Refatoração (2 meses)
- Fase 3: Extração (2-3 meses)

### Projeto Médio (6-12 meses)

- Fase 1: Análise e Preparação (2 meses)
- Fase 2: Organização do Domínio (2 meses)
- Fase 3: Extração de Serviço (4-6 meses)
- Fase 4: Otimização (2 meses)

### Grande Projeto (mais de 12 meses)

- Fase 1: Análise e Preparação (3-4 meses)
- Fase 2: Organização do Domínio (3-4 meses)
- Fase 3: Extração de Serviço (6-8 meses)
- Fase 4: Otimização (2-3 meses)

## Modelo de história de arquitetura```
As an architect, I need to [apply pattern/refactor component]
to support [architectural characteristic/business need]
so that [benefit/outcome]

Acceptance Criteria:
- [ ] Criterion 1
- [ ] Criterion 2

Estimate: X story points
Priority: High/Medium/Low
Dependencies: [List]
````

## Estimativa de pontos da história

| Pontos | Esforço      | Descrição    |
| ------ | ------------ | ------------ |
| 1      | Poucas horas | Trivial      |
| 2      | 1 dia        | Simples      |
| 3      | 2-3 dias     | Pequeno      |
| 5      | 1 semana     | Médio        |
| 8      | 2 semanas    | Grande       |
| 13     | 3+ semanas   | Muito Grande |

## Lista de verificação de acompanhamento de progresso

### Status do padrão

- [] Padrão 1: Concluído/Em andamento/Não iniciado
- [] Padrão 2: Concluído/Em andamento/Não iniciado
- [] Padrão 3: Concluído/Em andamento/Não iniciado
- [] Padrão 4: Concluído/Em andamento/Não iniciado
- [] Padrão 5: Concluído/Em andamento/Não iniciado
- [] Padrão 6: Concluído/Em andamento/Não iniciado

### Principais métricas

- Componentes identificados: X
- Componentes refatorados: X (Y%)
- Domínios criados: X
- Serviços Extraídos: X

### Bloqueadores

- [] Listar bloqueadores
- [] Identificar dependências
- [] Planejar mitigação

## Etapas de análise rápida

1. **Avaliar** → Verifique o estado atual
2. **Identificar** → Encontre padrões para aplicar
3. **Priorizar** → Classificar por risco/valor
4. **Plano** → Crie um roteiro em fases
5. **Acompanhar** → Monitorar o progresso

## Modelo de saída```markdown

# Decomposition Roadmap

## Current State Assessment

- ✅ [Completed patterns]
- ⚠️ [In progress patterns]
- ❌ [Not started patterns]

## Phased Roadmap

### Phase 1: [Name] (Timeline)

- [Patterns/work items]
- Milestones: [List]
- Deliverables: [List]

### Phase 2: [Name] (Timeline)

[Similar format]

## Prioritized Work Plan

### High Priority

1. [Work item] (Priority: X/10)
   - Risk: Low/Medium/High
   - Value: High/Medium/Low
   - Effort: X weeks

## Architecture Stories

[Story list]

## Progress Dashboard

[Status tables and metrics]

```

```
