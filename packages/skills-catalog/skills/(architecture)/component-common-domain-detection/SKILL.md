---
name: component-common-domain-detection
description: Encontra lógica de negócio duplicada entre componentes e sugere consolidação. Use quando perguntar "onde essa lógica está duplicada?", "código em comum entre serviços", "o que dá para consolidar?" ou ao detectar domínio compartilhado antes de refatorar. Aciona em sobreposição funcional entre componentes e consolidação de domínio. NÃO use para duplicação em nível de código (linters/fmt) nem análise de dependências (use coupling-analysis).
---

# Detecção de componentes em domínio comum

Esta skill identifica funcionalidade de domínio duplicada entre componentes e aponta oportunidades de consolidação para reduzir duplicação e melhorar manutenibilidade.

## Como usar

### Quick start

Peça análise ao codebase:

- **"Find common domain functionality across components"**
- **"Identify duplicate domain logic that should be consolidated"**
- **"Detect shared classes used across multiple components"**
- **"Analyze consolidation opportunities for common components"**

### Exemplos de uso

**Exemplo 1: encontrar funcionalidade comum**

```
User: "Find common domain functionality across components"

The skill will:
1. Scan component namespaces for common patterns
2. Detect shared classes used across components
3. Identify duplicate domain logic
4. Analyze coupling impact of consolidation
5. Suggest consolidation opportunities
```

**Exemplo 2: notificações duplicadas**

```
User: "Are there multiple notification components that should be consolidated?"

The skill will:
1. Find all components with notification-related names
2. Analyze their functionality and dependencies
3. Calculate coupling impact if consolidated
4. Recommend consolidation approach
```

**Exemplo 3: classes compartilhadas**

```
User: "Find classes that are shared across multiple components"

The skill will:
1. Identify classes imported/used by multiple components
2. Classify as domain vs infrastructure functionality
3. Suggest consolidation or shared library approach
4. Assess impact on coupling
```

### Processo passo a passo

1. **Escaneamento**: ache patterns de namespace repetidos entre componentes
2. **Código compartilhado**: arquivos/classes usados por mais de um componente
3. **Funcionalidade**: confirme se é de fato dominante comum
4. **Acoplamento**: impacto antes/depois de consolidar
5. **Recomendações**: serviço compartilhado, biblioteca ou merge

## Quando usar

- Depois de identificar e dimensionar componentes (Pattern 1)
- Antes de achatar hierarquia (Pattern 3)
- Ao reduzir duplicação conscientemente
- Ao mapear lógica compartilhada de domínio
- Preparando consolidação de componentes
- Procurando candidatos a serviços/libs compartilhados

## Conceitos centrais

### Funcionalidade de domínio vs infraestrutura

**Domínio** (candidatos a consolidação):

- Processamento que reflete negócio (notification, validation, auditing, formatting)
- Comum a **alguns** fluxos, não a todos
- Ex.: ticket auditing, dados de cliente

**Infraestrutura** (fora desta skill):

- Aspectos operacionais (logging, métricas, segurança)
- Comuns a **todos** os fluxos
- Ex.: conexões de BD globais quando são cross-cutting técnico

### Patterns típicos

1. **Namespaces**: mesmo leaf (`*.notification`, `*.audit`…)

2. **Classes compartilhadas**: um tipo importado por N componentes

3. **Comportamentos parecidos**: funções paralelas por contexto diferente

### Abordagens

- **Serviço compartilhado**: lógica muda rápido, escala própria ou deploy independente faz sentido
- **Biblioteca**: comportamento relativamente estável; dependência de build aceita
- **Fusão**: funcionalidades muito correlatas e impacto de acoplamento controlado

## Processo de análise

### Fase 1: Patterns por leaf de namespace

1. **Extrair leaves** dos namespaces dos componentes
2. **Agrupar** por mesmo leaf
3. **Filtrar** ruídos de infra (`.util`, `.helper`… onde fizer sentido)

**Exemplo**:

```markdown
## Common Namespace Patterns Found

**Notification Components**:

- services/customer/notification
- services/ticket/notification
- services/survey/notification

**Audit Components**:

- services/billing/audit
- services/ticket/audit
- services/survey/audit
```

### Fase 2: Detectar classes compartilhadas

Classes/arquivos usados por vários componentes:

1. **Imports/dependencies** por componente
   - Para onde cada import aponta
   - Classes usadas por mais de um dono de componente

2. **Quem é shared**
   - Importada por ≥2 componentes
   - Exclua utilitários de infra triviais quando forem apenas cross-cutting global (Logger padronizado etc.)

3. **Classifique domínio vs infraestrutura**
   - Domínio: SMTPConnection, AuditLogger se forem modelo de negócio compartilhado
   - Infraestrutura: utilitários técnicos omnipresentes

**Saída de exemplo**:

```markdown
## Shared Classes Found

**Domain Classes**:

- `SMTPConnection` - Used by 5 components (notification-related)
- `AuditLogger` - Used by 8 components (audit-related)
- `DataFormatter` - Used by 3 components (formatting-related)

**Infrastructure Classes** (exclude from consolidation):

- `Logger` - Used by all components (infrastructure)
- `Config` - Used by all components (infrastructure)
```

### Fase 3: Similaridade de funcionalidade

Para cada grupo de componentes aparentemente iguais:

1. **Examinar o que fazem**
   - Ler código
   - Listar comportamentos efetivos
   - Simetrias vs diferenças

2. **Viabilidade de consolidação**
   - Diferenças são só configuração?
   - Dá para parametrizar/abstractizar?
   - É realmente a mesma regra?

3. **Impacto em acoplamento**
   - Contar deps **entrantes** (CA — afferent coupling) antes
   - Estimar deps depois
   - Comparar totais aceitável ou não

**Exemplo de análise**:

```markdown
## Functionality Analysis

**Notification Components**:

- CustomerNotification: Sends billing notifications
- TicketNotification: Sends ticket assignment notifications
- SurveyNotification: Sends survey emails

**Similarities**: All send emails to customers
**Differences**: Email content/templates, triggers

**Consolidation Feasibility**: ✅ High

- Differences are in content, not mechanism
- Can be abstracted with templates/context
```

### Fase 4: Avaliar impacto de acoplamento

Antes de recomendar fusão/consolidação:

1. **Acoplamento atual**
   - Consumidores diretos/indiretos
   - Soma deps entrantes onde fizer sentido

2. **Acoplamento após consolidação**
   - Consumidores do novo bloco único

3. **Risco centralização**
   - CA salta tanto que vira bottleneck?
   - Trade-off vale a pena?

**Exemplo**:

```markdown
## Coupling Impact Analysis

**Before Consolidation**:

- CustomerNotification: Used by 2 components (CA = 2)
- TicketNotification: Used by 2 components (CA = 2)
- SurveyNotification: Used by 1 component (CA = 1)
- **Total CA**: 5

**After Consolidation**:

- Notification: Used by 5 components (CA = 5)
- **Total CA**: 5 (same!)

**Verdict**: ✅ No coupling increase, safe to consolidate
```

### Fase 5: Recomendar abordagem

Com base na análise:

**Serviço compartilhado**, se lógica muda rápido, é complexo, escala só ou há necessidade forte de ciclo próprio\
**Biblioteca**, se comportamento relativamente estável e dependência offline ok\
**Fusão de componentes**, se forte coesão de negócio e impacto lateral controlado em CA

## Formato da saída

### Relatório de domínios comuns

```markdown
## Common Domain Components Found

### Notification Functionality

**Components**:

- services/customer/notification (2% - 1,433 statements)
- services/ticket/notification (2% - 1,765 statements)
- services/survey/notification (2% - 1,299 statements)

**Shared Classes**: SMTPConnection (used by all 3)

**Functionality Analysis**:

- All send emails to customers
- Differences: Content/templates, triggers
- Consolidation Feasibility: ✅ High

**Coupling Analysis**:

- Before: CA = 2 + 2 + 1 = 5
- After: CA = 5 (no increase)
- Verdict: ✅ Safe to consolidate

**Recommendation**: Consolidate into `services/notification`

- Approach: Shared Service
- Expected Size: ~4,500 statements (5% of codebase)
- Benefits: Reduced duplication, easier maintenance
```

### Tabela de oportunidades

```markdown
## Consolidation Opportunities

| Common Functionality | Components   | Current CA | After CA | Feasibility | Recommendation                |
| -------------------- | ------------ | ---------- | -------- | ----------- | ----------------------------- |
| Notification         | 3 components | 5          | 5        | ✅ High     | Consolidate to shared service |
| Audit                | 3 components | 8          | 12       | ⚠️ Medium   | Consolidate, monitor coupling |
| Validation           | 2 components | 3          | 3        | ✅ High     | Consolidate to shared library |
```

### Plano detalhado de consolidação

```markdown
## Consolidation Plan

### Priority: High

**Notification Components** → `services/notification`

**Steps**:

1. Create new `services/notification` component
2. Move common functionality from 3 components
3. Create abstraction for content/templates
4. Update dependent components to use new service
5. Remove old notification components

**Expected Impact**:

- Reduced code: ~4,500 statements consolidated
- Reduced duplication: 3 components → 1
- Coupling: No increase (CA stays at 5)
- Maintenance: Easier to maintain single component

### Priority: Medium

**Audit Components** → `services/audit`

**Steps**:
[Similar format]

**Expected Impact**:

- Coupling increase: CA 8 → 12 (monitor)
- Benefits: Reduced duplication
```

## Checklist de análise

**Detecção de pattern comum**:

- [ ] Varreu namespaces em busca de leaves comuns
- [ ] Agrupou suffixos/nomes repetidos
- [ ] Removeu ruído de infraestrutura onde aplicável
- [ ] Agrupou componentes similares funcionalmente

**Classes compartilhadas**:

- [ ] Passou imports/deps de cada componente
- [ ] Listou classes multi-uso
- [ ] Classificou domínio vs infra
- [ ] Documentou quem usa cada shared

**Funcionalidade**:

- [ ] Leu código dos agrupamentos
- [ ] Listou similaridades/diferenças
- [ ] Avaliou viabilidade de consolidação
- [ ] Checou se diferenças viram parâmetros/abstração

**Acoplamento**:

- [ ] Calculou CA antes
- [ ] Estimou CA depois
- [ ] Comparou totais
- [ ] Julgou aumento aceitável ou não

**Recomendações**:

- [ ] Propôs serviço/biblioteca/fusão
- [ ] Priorizou por impacto/risco
- [ ] Plano de passos tangível
- [ ] Benefícios e riscos estimados

## Notas de implementação

### Node.js/Express

Patterns comuns a observar:

```
services/
├── CustomerService/
│   └── notification.js      ← Common pattern
├── TicketService/
│   └── notification.js     ← Common pattern
└── SurveyService/
    └── notification.js      ← Common pattern
```

**Shared Classes**:

- Check `require()` statements
- Look for classes imported from other components
- Example: `const SMTPConnection = require('../shared/SMTPConnection')`

### Aplicações Java

Patterns comuns:

```
com.company.billing.audit     ← Common pattern
com.company.ticket.audit      ← Common pattern
com.company.survey.audit      ← Common pattern
```

**Shared Classes**:

- Check `import` statements
- Look for classes in common packages
- Example: `import com.company.shared.AuditLogger`

### Estratégias de detecção

**Namespace Pattern Detection**:

```javascript
// Extract leaf nodes from namespaces
function extractLeafNode(namespace) {
  const parts = namespace.split('/')
  return parts[parts.length - 1]
}

// Group by common leaf nodes
function groupByLeafNode(components) {
  const groups = {}
  components.forEach((comp) => {
    const leaf = extractLeafNode(comp.namespace)
    if (!groups[leaf]) groups[leaf] = []
    groups[leaf].push(comp)
  })
  return groups
}
```

**Shared Class Detection**:

```javascript
// Find classes used by multiple components
function findSharedClasses(components) {
  const classUsage = {}
  components.forEach((comp) => {
    comp.imports.forEach((imp) => {
      if (!classUsage[imp]) classUsage[imp] = []
      classUsage[imp].push(comp.name)
    })
  })

  return Object.entries(classUsage)
    .filter(([cls, users]) => users.length > 1)
    .map(([cls, users]) => ({ class: cls, usedBy: users }))
}
```

## Fitness functions

Depois da consolidação candidata, automatize checagens:

### Detecção por namespace

```javascript
// Alert if new components with common patterns are created
function checkCommonPatterns(components, exclusionList = []) {
  const leafNodes = {}
  components.forEach((comp) => {
    const leaf = extractLeafNode(comp.namespace)
    if (!exclusionList.includes(leaf)) {
      if (!leafNodes[leaf]) leafNodes[leaf] = []
      leafNodes[leaf].push(comp.name)
    }
  })

  return Object.entries(leafNodes)
    .filter(([leaf, comps]) => comps.length > 1)
    .map(([leaf, comps]) => ({
      pattern: leaf,
      components: comps,
      suggestion: 'Consider consolidating these components',
    }))
}
```

### Alerta de uso de classe compartilhada

```javascript
// Alert if class is used by multiple components
function checkSharedClasses(components, exclusionList = []) {
  const classUsage = {}
  components.forEach((comp) => {
    comp.imports.forEach((imp) => {
      if (!exclusionList.includes(imp)) {
        if (!classUsage[imp]) classUsage[imp] = []
        classUsage[imp].push(comp.name)
      }
    })
  })

  return Object.entries(classUsage)
    .filter(([cls, users]) => users.length > 1)
    .map(([cls, users]) => ({
      class: cls,
      usedBy: users,
      suggestion: 'Consider extracting to shared component or library',
    }))
}
```

## Boas práticas

### Faça ✅

- Distinção clara domínio vs infra antes de fundir
- Sempre numere impacto em acoplamento antes
- Compare serviço compartilhado vs pacote
- Olhe namespace **e** classe compartilhada
- Só consolide se o comportamento for realmente relacionado
- CA antes/depois documentado

### Evite ❌

- Não trate toda utilidade global como candidate de domínio aqui
- Não ignore salto de CA pós-fusão
- Não assuma que todo pattern duplicado vale pena
- Não esqueça diferenças semânticas sutis
- Não crie super-módulo só para “DRY cego”
- Não misture análise técnica infra com regra de negócio num mesmo bucket sem critério

## Patterns típicos a buscar

### Forte candidatos a consolidação

- **Notification**: `*.notification`, `*.notify`, `*.email`
- **Audit**: `*.audit`, `*.auditing`, `*.log`
- **Validation**: `*.validation`, `*.validate`, `*.validator`
- **Formatting**: `*.format`, `*.formatter`, `*.formatting`
- **Reporting**: `*.report`, `*.reporting` (if similar functionality)

### Baixa chance / cuidados

- **Infrastructure**: `*.util`, `*.helper`, `*.common` (usually infrastructure)
- **Different contexts**: Same name, different business meaning
- **High coupling risk**: Consolidation would create bottleneck

## Próximos passos

Depois dos achados aqui:

1. **Flatten components** — limpar orphans
2. **Determine deps** — acoplamento detalhado
3. **Domínios** — agrupar componentes logicamente
4. **Planejar fusão/execução** — roadmap operacional na sequência adequada de skills

## Notas finais

- Domínio comum não é igual infraestrutura compartilhada
- Consolidação reduz duplicação mas pode aumentar CA
- Sempre projete coupling antes da mudança
- Serviço vs biblioteca têm custos diferentes de release
- Alguma duplicação consciente reduzindo acoplamento pode ser válida
- Nem todo similarity exige fusão única — contexto decide
