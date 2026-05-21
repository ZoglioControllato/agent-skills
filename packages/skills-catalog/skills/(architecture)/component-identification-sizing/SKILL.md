---
name: component-identification-sizing
description: Mapeia componentes arquiteturais no codebase e mede tamanho para priorizar extração. Use quando perguntar "quão grande é cada módulo?", "quais componentes tenho?", "qual serviço está grande demais?", "analise estrutura do codebase" ou "dimensione meu monólito" ou ao planejar por onde começar a decompor. Aciona em inventário estrutural e métricas de tamanho de módulos. NÃO use para dimensionamento de performance em runtime nem planejamento de capacidade de infraestrutura.
---

# Identificação e dimensionamento de componentes

Esta skill identifica componentes arquiteturais (blocos lógicos) em um codebase e calcula métricas de tamanho para avaliar viabilidade de decomposição e sinalizar componentes grandes demais.

## Como usar

### Quick start

Peça análise do codebase:

- **"Identify and size all components in this codebase"**
- **"Find oversized components that need splitting"**
- **"Create a component inventory for decomposition planning"**
- **"Analyze component size distribution"**

### Exemplos de uso

**Exemplo 1: análise completa**

```
User: "Identify and size all components in this codebase"

The skill will:
1. Map directory/namespace structures
2. Identify all components (leaf nodes)
3. Calculate size metrics (statements, files, percentages)
4. Generate component inventory table
5. Flag oversized/undersized components
6. Provide recommendations
```

**Exemplo 2: componentes grandes**

```
User: "Which components are too large?"

The skill will:
1. Calculate mean and standard deviation
2. Identify components >2 std dev or >10% threshold
3. Analyze functional areas within large components
4. Suggest specific splits with estimated sizes
```

**Exemplo 3: distribuição de tamanho**

```
User: "Analyze component sizes and distribution"

The skill will:
1. Calculate all size metrics
2. Generate size distribution summary
3. Identify outliers
4. Provide statistics and recommendations
```

### Processo passo a passo

1. **Análise inicial**: Comece com inventário completo de componentes
2. **Identifique problemas**: Achados que precisam atenção
3. **Recomendações**: Peça sugestões concretas de split/consolidação
4. **Monitore**: Acompanhe crescimento dos componentes ao longo do tempo

## Quando usar

Use quando:

- Iniciando decomposição de monólito
- Avaliando organização e estrutura do codebase
- Identificando componentes grandes ou pequenos demais
- Criando inventário para planejamento de migração
- Analisando distribuição de código entre componentes
- Preparando patterns de decomposição orientados a componentes

## Conceitos centrais

### Definição de componente

Um **componente** é bloco arquitetural que:

- Tem papel e responsabilidade bem definidos
- É identificado por namespace, estrutura de pacote ou diretório
- Contém arquivos de código (classes, funções, módulos) agrupados
- Implementa capacidade de negócio ou de infraestrutura

**Regra**: Componentes são **leaf nodes** em diretório/namespace. Se um namespace se estende (ex.: `services/billing` → `services/billing/payment`), o pai vira **subdomínio**, não componente.

### Métricas de tamanho

**Statements** (não linhas de código):

- Contagem de statements executáveis terminados por `;` ou newline
- Mais justo que LOC para comparar tamanhos
- Reflete complexidade, não formatação

**Indicadores**:

- **Percentual do codebase**: statements do componente / total
- **Contagem de arquivos**: arquivos fonte no componente
- **Desvio padrão**: distância da média de tamanho

## Processo de análise

### Fase 1: Identificar componentes

Percorra estrutura de diretório:

1. **Mapear diretório/namespace**
   - Node.js: `services/`, `routes/`, `models/`, `utils/`
   - Java: pacotes (`com.company.domain.service`)
   - Python: paths (`app/billing/payment`)

2. **Leaf nodes**
   - Componentes são os diretórios mais profundos com arquivos fonte
   - Ex.: `services/BillingService/` é componente
   - Ex.: `services/BillingService/payment/` estende BillingService ⇒ BillingService é subdomínio

3. **Inventário**
   - Liste namespace/path por componente
   - Note namespaces pai (subdomínios)

### Fase 2: Calcular métricas

Para cada componente:

1. Contar statements (parse dos arquivos; excluir comentários/brancos/decl sem corpo onde aplicável)
2. Contar arquivos (`.js`, `.ts`, `.java`, `.py`… sem test/config/doc)
3. Percentual:

   ```
   component_percent = (component_statements / total_statements) * 100
   ```

4. Estatísticas: média, desvio padrão, offset do componente `(size - mean) / std_dev`

### Fase 3: Avaliar problemas de tamanho

**Grandes demais** (candidatos a split):

- \>30% do codebase em apps pequenos (\<10 componentes)
- \>10% em apps grandes (\>20 componentes)
- \>2 desvios padrão acima da média
- Várias áreas funcionais distintas no mesmo lugar

**Pequenos demais** (consolidação):

- \<1% do codebase
- \<1 dp abaixo da média
- Poucos arquivos / funcionalidade mínima

**Bem proporcionados**:

- Entre 1–2 dp da média
- Área funcional única coesa
- Percentual adequado ao tamanho do app

## Formato de saída

### Tabela de inventário

```markdown
## Component Inventory

| Component Name  | Namespace/Path               | Statements | Files | Percent | Status       |
| --------------- | ---------------------------- | ---------- | ----- | ------- | ------------ |
| Billing Payment | services/BillingService      | 4,312      | 23    | 5%      | ✅ OK        |
| Reporting       | services/ReportingService    | 27,765     | 162   | 33%     | ⚠️ Too Large |
| Notification    | services/NotificationService | 1,433      | 7     | 2%      | ✅ OK        |
```

**Legendas**:

- ✅ OK: Well-sized (within 1-2 std dev from mean)
- ⚠️ Too Large: Exceeds size threshold or >2 std dev above mean
- 🔍 Too Small: <1% of codebase or <1 std dev below mean

### Resumo de tamanho

```markdown
## Size Analysis Summary

**Total Components**: 18
**Total Statements**: 82,931
**Mean Component Size**: 4,607 statements
**Standard Deviation**: 5,234 statements

**Oversized Components** (>2 std dev or >10%):

- Reporting (33% - 27,765 statements) - Consider splitting into:
  - Ticket Reports
  - Expert Reports
  - Financial Reports

**Well-Sized Components** (within 1-2 std dev):

- Billing Payment (5%)
- Customer Profile (5%)
- Ticket Assignment (9%)

**Undersized Components** (<1 std dev):

- Login (2% - 1,865 statements) - Consider consolidating with Authentication
```

### Distribuição de tamanho

```markdown
## Component Size Distribution
```

Component Size Distribution (by percent of codebase)

[Visual representation or histogram if possible]

Largest: ████████████████████████████████████ 33% (Reporting)
████████ 9% (Ticket Assign)
██████ 8% (Ticket)
██████ 6% (Expert Profile)
█████ 5% (Billing Payment)
████ 4% (Billing History)
...

````

### Recomendações

```markdown
## Recommendations

### High Priority: Split Large Components

**Reporting Component** (33% of codebase):
- **Current**: Single component with 27,765 statements
- **Issue**: Too large, contains multiple functional areas
- **Recommendation**: Split into:
  1. Reporting Shared (common utilities)
  2. Ticket Reports (ticket-related reports)
  3. Expert Reports (expert-related reports)
  4. Financial Reports (financial reports)
- **Expected Result**: Each component ~7-9% of codebase

### Medium Priority: Review Small Components

**Login Component** (2% of codebase):
- **Current**: 1,865 statements, 3 files
- **Consideration**: May be too granular if related to broader authentication
- **Recommendation**: Evaluate if should be consolidated with Authentication/User components

### Low Priority: Monitor Well-Sized Components

Most components are appropriately sized. Continue monitoring during decomposition.
````

## Checklist de análise

**Identificação**:

- [ ] Mapeadas estruturas de diretório/namespace
- [ ] Leaf vs nós pai (subdomínios)
- [ ] Inventário completo
- [ ] Paths documentados por componente

**Cálculo**:

- [ ] Statements (não linhas) por componente
- [ ] Arquivos fonte sem test/config
- [ ] Percentual do total
- [ ] Média e desvio padrão

**Avaliação**:

- [ ] Oversized marcados (>limite ou >2 dp)
- [ ] Undersized (\<1% ou \<1 dp)
- [ ] Flags de split/consolidação
- [ ] Distribuição documentada

**Recomendações**:

- [ ] Splits para oversized
- [ ] Consolidações para undersized
- [ ] Priorização por impacto
- [ ] Histórias de arquitetura para refactor

## Notas de implementação

### Apps Node.js/Express

Onde componentes aparecem com frequência:

- `services/` — lógica
- `routes/` — superfície API
- `models/` — modelos
- `utils/` — utilitários
- `middleware/`

**Exemplo:**

```
services/
├── BillingService/          ← Component (leaf node)
│   ├── index.js
│   └── BillingService.js
├── CustomerService/          ← Component (leaf node)
│   └── CustomerService.js
└── NotificationService/      ← Component (leaf node)
    └── NotificationService.js
```

### Apps Java

- `com.company.domain.service`
- `com.company.domain.model`
- `com.company.domain.repository`

**Exemplo:**

```
com.company.billing.payment   ← Component (leaf package)
com.company.billing.history   ← Component (leaf package)
com.company.billing           ← Subdomain (parent of payment/history)
```

### Contagem de statements

**JavaScript/TypeScript**: terminados por `;` ou newline… (como na original)

**Java**: terminados por `;` …

**Python**: statements executáveis…

## Fitness functions

Depois de dimensionar, automatize checks:

### Limiar de tamanho

```javascript
// Alert if any component exceeds 10% of codebase
function checkComponentSize(components, threshold = 0.1) {
  const totalStatements = components.reduce((sum, c) => sum + c.statements, 0)
  return components
    .filter((c) => c.statements / totalStatements > threshold)
    .map((c) => ({
      component: c.name,
      percent: ((c.statements / totalStatements) * 100).toFixed(1),
      issue: 'Exceeds size threshold',
    }))
}
```

### Desvio padrão

```javascript
// Alert if component is >2 standard deviations from mean
function checkStandardDeviation(components) {
  const sizes = components.map((c) => c.statements)
  const mean = sizes.reduce((a, b) => a + b, 0) / sizes.length
  const stdDev = Math.sqrt(sizes.reduce((sum, size) => sum + Math.pow(size - mean, 2), 0) / (sizes.length - 1))

  return components
    .filter((c) => Math.abs(c.statements - mean) > 2 * stdDev)
    .map((c) => ({
      component: c.name,
      deviation: ((c.statements - mean) / stdDev).toFixed(2),
      issue: 'More than 2 standard deviations from mean',
    }))
}
```

## Boas práticas

### Faça ✅

- Use statements, não LOC
- Só leaf nodes como componentes
- Percentual **e** desvio padrão
- Thresholds proporcionais ao tamanho do app
- Documente path de cada componente
- Histograma/visual quando possível

### Evite ❌

- Não incluir testes no tamanho
- Não tratar pai de diretório como componente só por existir pasta
- Não usar limiar fixo cego ao tamanho do app
- Não ignorar componentes miúdos
- Não pular dp
- Não misturar análises puramente de domínio e infraestrutura no mesmo relatório sem necessidade

## Próximos passos

Após esta skill:

1. **Gather Common Domain Components** — duplicação funcional
2. **Flatten Components** — classes órfãs
3. **Determine Component Dependencies** — acoplamento
4. **Create Component Domains** — agrupar em domínios

## Notas

- Thresholds mudam conforme número de componentes
- Apps pequenos (\<10 componentes): até ~30% pode aceitar maior componente único em alguns cenários
- Apps grandes (\>20): ~10% costuma ser mais razoável
- Desvio padrão costuma superar só percentuais fixos
- Bem proporcionados: ~1–2 dp da média
- Oversized frequentemente comporta splits por áreas funcionais
