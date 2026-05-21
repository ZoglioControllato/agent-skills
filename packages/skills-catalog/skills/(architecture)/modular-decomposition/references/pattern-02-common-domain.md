# Detecção de componente de domínio comum

Esta habilidade identifica funcionalidades de domínio comuns que são duplicadas em vários componentes e sugere oportunidades de consolidação para reduzir a duplicação e melhorar a capacidade de manutenção.

## Como usar

### Início rápido

Solicite análise da sua base de código:

- **"Encontrar funcionalidade de domínio comum entre componentes"**
- **"Identificar lógica de domínio duplicada que deve ser consolidada"**
- **"Detectar classes compartilhadas usadas em vários componentes"**
- **"Analisar oportunidades de consolidação para componentes comuns"**

### Exemplos de uso

**Exemplo 1: Encontre funcionalidades comuns**

```
User: "Find common domain functionality across components"

The skill will:
1. Scan component namespaces for common patterns
2. Detect shared classes used across components
3. Identify duplicate domain logic
4. Analyze coupling impact of consolidation
5. Suggest consolidation opportunities
```

**Exemplo 2: Detectar lógica de notificação duplicada**

```
User: "Are there multiple notification components that should be consolidated?"

The skill will:
1. Find all components with notification-related names
2. Analyze their functionality and dependencies
3. Calculate coupling impact if consolidated
4. Recommend consolidation approach
```

**Exemplo 3: Analisar aulas compartilhadas**

```
User: "Find classes that are shared across multiple components"

The skill will:
1. Identify classes imported/used by multiple components
2. Classify as domain vs infrastructure functionality
3. Suggest consolidation or shared library approach
4. Assess impact on coupling
```

### Processo passo a passo

1. **Verificar componentes**: identificar componentes com padrões de namespace comuns
2. **Detectar código compartilhado**: Encontre classes/arquivos usados em componentes
3. **Analisar a funcionalidade**: determine se a funcionalidade é realmente comum
4. **Avaliar o acoplamento**: Calcule o impacto do acoplamento antes da consolidação
5. **Recomendar ações**: sugerir consolidação ou abordagem de biblioteca compartilhada

## Quando usar

Aplique esta habilidade quando:

- Após identificar e dimensionar os componentes (Padrão 1)
- Antes de nivelar componentes (Padrão 3)
- Ao planejar reduzir a duplicação de código
- Analisando a lógica de domínio compartilhado em toda a base de código
- Preparação para consolidação de componentes
- Identificação de candidatos para serviços compartilhados ou bibliotecas

## Conceitos Básicos

### Domínio vs Funcionalidade de Infraestrutura

**Funcionalidade de Domínio** (candidatos à consolidação):

- Lógica de processamento de negócios (notificação, validação, auditoria, formatação)
- Comum a **alguns** processos, não a todos
- Exemplos: notificação do cliente, auditoria de tickets, validação de dados

**Funcionalidade de infraestrutura** (geralmente não consolidada aqui):

- Preocupações operacionais (registro, métricas, segurança)
- Comum a **todos** processos
- Exemplos: registro em log, autenticação, conexões de banco de dados

### Padrões de domínio comuns

A funcionalidade comum do domínio geralmente aparece como:

1. **Padrões de Namespace**: Componentes que terminam no mesmo nó folha
   - `*.notificação`, `*.audit`, `*.validation`, `*.formatting`
   - Exemplo: `TicketNotification`, `BillingNotification`, `SurveyNotification`

2. **Classes compartilhadas**: a mesma classe usada em vários componentes
   - Exemplo: `SMTPConnection` usado por 5 componentes diferentes
   - Exemplo: `AuditLogger` usado por vários componentes de domínio

3. **Funcionalidade semelhante**: componentes diferentes fazendo coisas semelhantes
   - Exemplo: Vários componentes enviando e-mails com pequenas variações
   - Exemplo: vários componentes gravando logs de auditoria

### Abordagens de consolidação

**Serviço Compartilhado**:

- A funcionalidade comum torna-se um serviço separado
- Outros componentes chamam este serviço
- Bom para: Lógica em mudança frequente, operações complexas

**Biblioteca Compartilhada**:

- Código comum empacotado como biblioteca (pacote JAR, DLL, npm)
- Importação de componentes e uso da biblioteca
- Bom para: Funcionalidade estável, utilitários simples

**Consolidação de Componentes**:

- Mesclar vários componentes em um
  Bom para: Funcionalidade altamente relacionada, baixo impacto de acoplamento

## Processo de análise

### Fase 1: Identificar padrões comuns de namespace

Verifique os namespaces dos componentes em busca de nomes de nós folha comuns:

1. **Extraia nós folha** de todos os namespaces de componentes
   - Exemplo: `serviços/faturamento/notificação` → `notificação`
   - Exemplo: `serviços/ticket/notificação` → `notificação`

2. **Agrupar por nós folha comuns**
   - Encontre componentes com o mesmo nome de nó folha
   - Exemplo: todos os componentes que terminam em `.notification`

3. **Filtrar padrões de infraestrutura**
   - Excluir: `.util`, `.helper`, `.common` (geralmente infra-estrutura)
   - Foco em: `.notification`, `.audit`, `.validation`, `.formatting`

**Exemplo de saída**:```markdown

## Common Namespace Patterns Found

**Notification Components**:

- services/customer/notification
- services/ticket/notification
- services/survey/notification

**Audit Components**:

- services/billing/audit
- services/ticket/audit
- services/survey/audit

````
### Fase 2: Detectar classes compartilhadas

Encontre classes/arquivos usados em vários componentes:

1. **Verifique importações/dependências** em cada componente
   - Acompanhe quais classes são importadas de onde
   - Observe as classes usadas por vários componentes

2. **Identificar classes compartilhadas**
   - Classes importadas por mais de 2 componentes
   - Excluir classes de infraestrutura (Logger, Config, etc.)

3. **Classificar como domínio versus infraestrutura**
   - Domínio: Classes de lógica de negócios (SMTPConnection, AuditLogger)
   - Infraestrutura: Utilitários técnicos (Logger, DatabaseConnection)

**Exemplo de saída**:```markdown
## Shared Classes Found

**Domain Classes**:

- `SMTPConnection` - Used by 5 components (notification-related)
- `AuditLogger` - Used by 8 components (audit-related)
- `DataFormatter` - Used by 3 components (formatting-related)

**Infrastructure Classes** (exclude from consolidation):

- `Logger` - Used by all components (infrastructure)
- `Config` - Used by all components (infrastructure)
````

### Fase 3: Analisar similaridade de funcionalidade

Para cada grupo de componentes comuns:

1. **Examinar a funcionalidade**
   - Leia o código fonte de cada componente
   - Identifique o que cada componente faz
   - Observe semelhanças e diferenças

2. **Avaliar a viabilidade de consolidação**
   - As diferenças são pequenas (configuráveis)?
   - As diferenças podem ser abstraídas?
   - A funcionalidade é realmente a mesma?

3. **Calcular o impacto do acoplamento**
   - Contar dependências de entrada (acoplamento aferente) antes da consolidação
   - Estimar dependências de entrada após consolidação
   - Compare os níveis totais de acoplamento

**Exemplo de análise**:```markdown

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

````
### Fase 4: Avaliar o impacto do acoplamento

Antes de recomendar a consolidação, analise o acoplamento:

1. **Calcular o acoplamento atual**
   - Contar componentes usando cada componente de notificação
   - Soma o total de dependências de entrada

2. **Estimativa de acoplamento consolidado**
   - Contar componentes que usariam componente consolidado
   - Compare com o total atual

3. **Avaliar aumento de acoplamento**
   - O componente consolidado está muito acoplado?
   - Isso cria um gargalo?
   - O aumento do acoplamento é aceitável?

**Exemplo de análise de acoplamento**:```markdown
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
````

### Fase 5: Recomendar abordagem de consolidação

Com base na análise, recomende a abordagem:

**Serviço Compartilhado** (se):

- A funcionalidade muda frequentemente
- Operações complexas
- Precisa de escalonamento independente
- Várias unidades de implantação irão usá-lo

**Biblioteca Compartilhada** (se):

- Funcionalidade estável
- Utilitários simples
- Dependência em tempo de compilação aceitável
- Não há necessidade de implantação independente

**Consolidação de Componentes** (se):

- Funcionalidade altamente relacionada
- Baixo impacto de acoplamento
- Mesma unidade de implantação aceitável

## Formato de saída

### Relatório de componentes de domínio comuns```markdown

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

````
### Tabela de oportunidades de consolidação```markdown
## Consolidation Opportunities

| Common Functionality | Components   | Current CA | After CA | Feasibility | Recommendation                |
| -------------------- | ------------ | ---------- | -------- | ----------- | ----------------------------- |
| Notification         | 3 components | 5          | 5        | ✅ High     | Consolidate to shared service |
| Audit                | 3 components | 8          | 12       | ⚠️ Medium   | Consolidate, monitor coupling |
| Validation           | 2 components | 3          | 3        | ✅ High     | Consolidate to shared library |
````

### Plano Detalhado de Consolidação```markdown

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

````
## Lista de verificação de análise

**Detecção de padrões comuns**:

- [] Verificou todos os namespaces de componentes em busca de nós folha comuns
- [] Componentes identificados com nomes finais iguais
- [] Padrões de infraestrutura filtrados
- [] Componentes semelhantes agrupados

**Detecção de classe compartilhada**:

- [] Importações/dependências verificadas em cada componente
- [] Classes identificadas usadas por vários componentes
- [] Classificado como domínio vs infraestrutura
- [] Uso de classe compartilhada documentada

**Análise de funcionalidade**:

- [] Código-fonte examinado de componentes comuns
- [ ] Semelhanças e diferenças identificadas
- [ ] Viabilidade de consolidação avaliada
- [] Determinado se as diferenças podem ser abstraídas

**Avaliação de acoplamento**:

- [] Acoplamento de corrente calculado (CA) para cada componente
- [ ] Acoplamento consolidado estimado
- [] Níveis totais de acoplamento comparados
- [ ] Avaliado se o aumento do acoplamento é aceitável

**Recomendações**:

- [] Abordagem de consolidação sugerida (serviço/biblioteca/mesclagem)
- [] Recomendações priorizadas por impacto
- [] Plano de consolidação criado com etapas
- [ ] Benefícios e riscos esperados estimados

## Notas de implementação

### Para aplicativos Node.js/Express

Padrões comuns a serem procurados:```
services/
├── CustomerService/
│   └── notification.js      ← Common pattern
├── TicketService/
│   └── notification.js     ← Common pattern
└── SurveyService/
    └── notification.js      ← Common pattern
````

**Aulas Compartilhadas**:

- Verifique as instruções `require()`
- Procure classes importadas de outros componentes
- Exemplo: `const SMTPConnection = require('../shared/SMTPConnection')`

### Para aplicativos Java

Padrões comuns:```
com.company.billing.audit ← Common pattern
com.company.ticket.audit ← Common pattern
com.company.survey.audit ← Common pattern

````

**Aulas Compartilhadas**:

- Verifique as declarações `import`
- Procure aulas em pacotes comuns
- Exemplo: `importar com.company.shared.AuditLogger`

### Estratégias de detecção

**Detecção de padrão de namespace**:```javascript
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
````

**Detecção de classe compartilhada**:```javascript
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

````
## Funções de condicionamento físico

Depois de identificar os componentes comuns, crie verificações automatizadas:

### Detecção de padrão de namespace comum```javascript
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
````

### Alerta de uso de classe compartilhada```javascript

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
## Melhores práticas

### O que fazer ✅

- Distinguir domínio de funcionalidade de infraestrutura
- Analise o impacto do acoplamento antes de consolidar
- Considere abordagens de serviço compartilhado e biblioteca compartilhada
- Procure padrões de namespace E classes compartilhadas
- Verifique se a funcionalidade é realmente semelhante antes de consolidar
- Calcular métricas de acoplamento (CA) antes e depois

### O que não fazer ❌

- Não consolide a funcionalidade da infraestrutura (tratada separadamente)
- Não consolide sem analisar o impacto do acoplamento
- Não presuma que todos os padrões comuns devem ser consolidados
- Não ignore as diferenças de funcionalidade
- Não consolidar se o aumento do acoplamento for muito alto
- Não misture domínio e infraestrutura na mesma análise

## Padrões comuns a serem procurados

### Candidatos de alta consolidação

- **Notificação**: `*.notification`, `*.notify`, `*.email`
- **Auditoria**: `*.audit`, `*.auditing`, `*.log`
- **Validação**: `*.validation`, `*.validate`, `*.validator`
- **Formatação**: `*.format`, `*.formatter`, `*.formatting`
- **Relatórios**: `*.report`, `*.reporting` (se funcionalidade semelhante)

### Candidatos com baixa consolidação

- **Infraestrutura**: `*.util`, `*.helper`, `*.common` (geralmente infraestrutura)
- **Contextos diferentes**: mesmo nome, significado comercial diferente
- **Alto risco de acoplamento**: a consolidação criaria gargalos

## Próximas etapas

Depois de identificar componentes de domínio comuns:

1. **Aplicar padrão de componentes nivelados** - Remover classes órfãs
2. **Aplicar Determinar Padrão de Dependências de Componentes** - Analisar acoplamento
3. **Criar domínios de componentes** – Agrupar componentes em domínios
4. **Consolidação do Plano** – Execute recomendações de consolidação

## Notas

- A funcionalidade de domínio comum é diferente da funcionalidade de infraestrutura
- A consolidação reduz a duplicação, mas pode aumentar o acoplamento
- Sempre analise o impacto do acoplamento antes de consolidar
- Serviços compartilhados versus bibliotecas compartilhadas têm diferentes compensações
- Alguma duplicação é aceitável se reduzir o acoplamento
- Nem todos os padrões comuns devem ser consolidados
```
