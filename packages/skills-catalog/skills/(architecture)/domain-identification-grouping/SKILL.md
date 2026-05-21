---
name: domain-identification-grouping
description: Agrupa componentes arquiteturais em domínios de negócio lógicos para arquitetura orientada a serviços. Use quando perguntar "quais componentes ficam juntos?", "agrupar em serviços", "organizar por domínio", "mapear componente→domínio" ou planejar extração a partir de codebase existente. Aciona em alinhamento de namespaces com domínio de solução antes de extração de serviços. NÃO use para identificar domínios só do zero sem inventário estrutural (use domain-analysis) nem análise focada só em acoplamento (use coupling-analysis).
---

# Identificação de domínios e agrupamento

Esta skill agrupa componentes arquiteturais em domínios lógicos (áreas de negócio) para preparar serviços de domínio em arquitetura orientada a serviços.

## Como usar

### Quick start

Peça análise do codebase:

- **"Group components into logical domains"**
- **"Identify component domains for service-based architecture"**
- **"Create domain groupings from components"**
- **"Analyze which components belong to which domains"**

### Exemplos de uso

**Exemplo 1: identificação de domínio**

```
User: "Group components into logical domains"

The skill will:
1. Analyze component responsibilities and relationships
2. Identify business domains based on functionality
3. Group components into domains
4. Create domain diagrams
5. Suggest namespace refactoring for domain alignment
```

**Exemplo 2: domínio do billing**

```
User: "Which domain should the billing components belong to?"

The skill will:
1. Analyze billing component functionality
2. Check relationships with other components
3. Identify appropriate domain (e.g., Customer or Financial)
4. Recommend domain assignment
```

**Exemplo 3: refactoring de namespace**

```
User: "What namespace refactoring is needed to align components with domains?"

The skill will:
1. Compare current component namespaces to identified domains
2. Identify misaligned components
3. Suggest namespace changes
4. Create refactoring plan
```

### Processo passo a passo

1. **Identificar domínios**: capacidades de negócio e relações entre componentes
2. **Agrupar componentes**: atribuir cada um ao domínio adequado
3. **Validar agrupamentos**: coesão e fronteiras
4. **Refatorar namespaces**: alinhar paths aos domínios
5. **Mapa de domínio**: visualização e inventário

## Quando usar

- Depois de identificar, dimensionar e analisar dependências de componentes
- Antes de criar serviços de domínio (Pattern 6)
- Migrando para arquitetura orientada a serviços
- Alinhando componentes ao negócio
- Agrupando componentes por organização lógica

## Conceitos centrais

### Definição de domínio

Um **domínio** agrupa componentes que:

- Representam capacidade de negócio distinta
- Trabalham juntos de forma coerente
- Têm fronteiras e responsabilidades claras
- Podem virar serviço de domínio implantável por si

**Exemplos**:

- **Customer Domain**: Customer profile, billing, support contracts
- **Ticketing Domain**: Ticket creation, assignment, routing, completion
- **Reporting Domain**: Ticket reports, expert reports, financial reports

### Relação domínio–componentes

**Um-para-vários**: um domínio contém vários componentes

```
Domain: Customer
├── Component: Customer Profile
├── Component: Billing Payment
├── Component: Billing History
└── Component: Support Contract
```

### Manifestação física do domínio

Domínios aparecem em **estruturas de namespace/pacote**:

**Antes**:

```
services/billing/payment
services/billing/history
services/customer/profile
services/supportcontract
```

**Depois**:

```
services/customer/billing/payment
services/customer/billing/history
services/customer/profile
services/customer/supportcontract
```

Tudo customer-related vive sob o nó `.customer`.

## Processo de análise

### Fase 1: Identificar domínios de negócio

1. **Responsabilidades**
2. **Vocabulário / linguagem de negócio**
3. **Fronteiras de conceito**
4. **Validação com stakeholders/produto**

**Exemplo**:

```markdown
## Identified Domains

1. **Ticketing Domain** (ss.ticket)
   - Ticket creation, assignment, routing, completion
   - Customer surveys
   - Knowledge base

2. **Customer Domain** (ss.customer)
   - Customer profile
   - Billing and payment
   - Support contracts

3. **Reporting Domain** (ss.reporting)
   - Ticket reports
   - Expert reports
   - Financial reports

4. **Admin Domain** (ss.admin)
   - User maintenance
   - Expert profile management

5. **Shared Domain** (ss.shared)
   - Login
   - Notification
```

### Fase 2: Agrupar componentes nos domínios

1. **Funcionalidade de negócio de cada componente**
2. **Relacionamentos e dependências**
3. **Atribuição** (domínio primário vs secundário)
4. **Casos limite** (shared / multi-domínio)

**Exemplo**:

```markdown
## Component Domain Assignment

### Ticketing Domain (ss.ticket)

- Ticket Shared (ss.ticket.shared)
- Ticket Maintenance (ss.ticket.maintenance)
- Ticket Completion (ss.ticket.completion)
- Ticket Assign (ss.ticket.assign)
- Ticket Route (ss.ticket.route)
- KB Maintenance (ss.ticket.kb.maintenance)
- KB Search (ss.ticket.kb.search)
- Survey (ss.ticket.survey)

### Customer Domain (ss.customer)

- Customer Profile (ss.customer.profile)
- Billing Payment (ss.customer.billing.payment)
- Billing History (ss.customer.billing.history)
- Support Contract (ss.customer.supportcontract)

### Reporting Domain (ss.reporting)

- Reporting Shared (ss.reporting.shared)
- Ticket Reports (ss.reporting.tickets)
- Expert Reports (ss.reporting.experts)
- Financial Reports (ss.reporting.financial)
```

### Fase 3: Validar agrupamentos

1. **Coesão** linguística e de uso
2. **Fronteiras** entre domínios
3. **Completude** do inventário
4. **Feedback** de negócio

**Checklist**:

- [ ] All components assigned to a domain
- [ ] Domains have clear boundaries
- [ ] Components fit well in their domains
- [ ] Domains represent distinct business capabilities
- [ ] Stakeholders validate domain groupings

### Fase 4: Refatorar namespaces para alinhar domínios

1. **Comparar path atual vs alvo**
2. **Listar movimentos necessários**
3. **Plano priorizado**
4. **Execução** com imports e testes

**Exemplo**:

```markdown
## Namespace Refactoring Plan

### Customer Domain Alignment

| Component        | Current Namespace   | Target Namespace            | Action        |
| ---------------- | ------------------- | --------------------------- | ------------- |
| Billing Payment  | ss.billing.payment  | ss.customer.billing.payment | Add .customer |
| Billing History  | ss.billing.history  | ss.customer.billing.history | Add .customer |
| Customer Profile | ss.customer.profile | ss.customer.profile         | No change     |
| Support Contract | ss.supportcontract  | ss.customer.supportcontract | Add .customer |

### Ticketing Domain Alignment

| Component      | Current Namespace | Target Namespace         | Action      |
| -------------- | ----------------- | ------------------------ | ----------- |
| KB Maintenance | ss.kb.maintenance | ss.ticket.kb.maintenance | Add .ticket |
| KB Search      | ss.kb.search      | ss.ticket.kb.search      | Add .ticket |
| Survey         | ss.survey         | ss.ticket.survey         | Add .ticket |
```

### Fase 5: Criar mapa de domínio

1. **Diagrama** domínio→componentes
2. **Documentação** textual curta de responsabilidade
3. **Inventário** tabular com contagens/métricas quando útil

**Exemplo**:

```markdown
## Domain Map
```

┌─────────────────────────────────────┐
│ Ticketing Domain (ss.ticket) │
├─────────────────────────────────────┤
│ • Ticket Shared │
│ • Ticket Maintenance │
│ • Ticket Completion │
│ • Ticket Assign │
│ • Ticket Route │
│ • KB Maintenance │
│ • KB Search │
│ • Survey │
└─────────────────────────────────────┘
│
│ uses
▼
┌─────────────────────────────────────┐
│ Customer Domain (ss.customer) │
├─────────────────────────────────────┤
│ • Customer Profile │
│ • Billing Payment │
│ • Billing History │
│ • Support Contract │
└─────────────────────────────────────┘

````

## Formato de saída

### Relatório de identificação

```markdown
## Domain Identification

### Domain: Customer (ss.customer)

**Business Capability**: Manages customer relationships, billing, and support contracts

**Components**:
- Customer Profile (ss.customer.profile)
- Billing Payment (ss.customer.billing.payment)
- Billing History (ss.customer.billing.history)
- Support Contract (ss.customer.supportcontract)

**Component Count**: 4
**Total Size**: ~15,000 statements (18% of codebase)

**Domain Cohesion**: ✅ High
- Components share customer-related vocabulary
- Components frequently used together
- Direct relationships between components

**Boundaries**:
- Clear separation from Ticketing domain
- Clear separation from Reporting domain
- Shared components (Notification) used by all domains
````

### Tabela componente→domínio

```markdown
## Component Domain Assignment

| Component          | Current Namespace     | Assigned Domain | Target Namespace                  |
| ------------------ | --------------------- | --------------- | --------------------------------- |
| Customer Profile   | ss.customer.profile   | Customer        | ss.customer.profile (no change)   |
| Billing Payment    | ss.billing.payment    | Customer        | ss.customer.billing.payment       |
| Ticket Maintenance | ss.ticket.maintenance | Ticketing       | ss.ticket.maintenance (no change) |
| KB Maintenance     | ss.kb.maintenance     | Ticketing       | ss.ticket.kb.maintenance          |
| Reporting Shared   | ss.reporting.shared   | Reporting       | ss.reporting.shared (no change)   |
```

### Plano de refactoring de namespaces

```markdown
## Namespace Refactoring Plan

### Priority: High

**Customer Domain Alignment**

**Components to Refactor**:

1. Billing Payment: `ss.billing.payment` → `ss.customer.billing.payment`
2. Billing History: `ss.billing.history` → `ss.customer.billing.history`
3. Support Contract: `ss.supportcontract` → `ss.customer.supportcontract`

**Steps**:

1. Update namespace declarations in source files
2. Update import statements in dependent components
3. Update directory structure
4. Run tests to verify changes
5. Update documentation

**Expected Impact**:

- All customer-related components aligned under `.customer` domain
- Clearer domain boundaries
- Easier to identify domain components
```

### Visualização do mapa

```markdown
## Domain Map

### Domain Structure
```

Customer Domain (ss.customer)
├── Customer Profile
├── Billing Payment
├── Billing History
└── Support Contract

Ticketing Domain (ss.ticket)
├── Ticket Shared
├── Ticket Maintenance
├── Ticket Completion
├── Ticket Assign
├── Ticket Route
├── KB Maintenance
├── KB Search
└── Survey

Reporting Domain (ss.reporting)
├── Reporting Shared
├── Ticket Reports
├── Expert Reports
└── Financial Reports

Admin Domain (ss.admin)
├── User Maintenance
└── Expert Profile

Shared Domain (ss.shared)
├── Login
└── Notification

```

### Relações entre domínios

```

Ticketing Domain
│ uses
├─→ Shared Domain (Login, Notification)
└─→ Customer Domain (Customer Profile)

Customer Domain
│ uses
└─→ Shared Domain (Login, Notification)

Reporting Domain
│ uses
├─→ Ticketing Domain (Ticket data)
├─→ Customer Domain (Customer data)
└─→ Shared Domain (Login)

```

```

## Checklist de análise

**Identificação de domínio**:

- [ ] Responsabilidades de componentes estudadas
- [ ] Capacidades de negócio mapeadas
- [ ] Domínios distintos nomeados
- [ ] Stakeholders alinhados

**Agrupamento**:

- [ ] Cada componente com domínio primário
- [ ] Relações analisadas
- [ ] Vocabulário coerente no domínio
- [ ] Casos limite (shared) tratados

**Validação**:

- [ ] Coesão interna checada
- [ ] Fronteiras claras
- [ ] Inventário completo
- [ ] Validação externa feita

**Refactor de namespaces**:

- [ ] Atual vs alvo documentado
- [ ] Lista de movimentos + prioridade

**Mapa**:

- [ ] Diagrama ou tabela equivalente
- [ ] Relações cross-domain explícitas

## Notas de implementação

### Node.js/Express

Domains typically organized in `services/` directory:

```
services/
├── customer/              ← Customer Domain
│   ├── profile/
│   ├── billing/
│   │   ├── payment/
│   │   └── history/
│   └── supportcontract/
├── ticket/                ← Ticketing Domain
│   ├── shared/
│   ├── maintenance/
│   ├── assign/
│   └── route/
└── reporting/             ← Reporting Domain
    ├── shared/
    ├── tickets/
    └── experts/
```

### Java

Domains identified by package structure:

```
com.company.customer       ← Customer Domain
├── profile
├── billing
│   ├── payment
│   └── history
└── supportcontract

com.company.ticket         ← Ticketing Domain
├── shared
├── maintenance
├── assign
└── route
```

### Estratégias de identificação

**1. Capacidades de negócio**

**2. Vocabulário**

**3. Forte acoplamento contextual de uso**

**4. Colaboração com negócio**

## Fitness functions

Após domínios criados, automatize governança opcional:

### Validação namespace↔domínio

```javascript
// Ensure components belong to correct domain
function validateDomainNamespaces(components, domainRules) {
  const violations = []

  components.forEach((comp) => {
    const domain = identifyDomain(comp.namespace)
    const expectedDomain = domainRules[comp.name]

    if (domain !== expectedDomain) {
      violations.push({
        component: comp.name,
        currentDomain: domain,
        expectedDomain: expectedDomain,
        namespace: comp.namespace,
      })
    }
  })

  return violations
}
```

### Enforcement de limite (imports cross-domain)

```javascript
// Prevent components from accessing other domains directly
function enforceDomainBoundaries(components) {
  const violations = []

  components.forEach((comp) => {
    comp.imports.forEach((imp) => {
      const importedDomain = identifyDomain(imp)
      const componentDomain = identifyDomain(comp.namespace)

      if (importedDomain !== componentDomain && importedDomain !== 'shared') {
        violations.push({
          component: comp.name,
          domain: componentDomain,
          importsFrom: imp,
          importedDomain: importedDomain,
          issue: 'Cross-domain direct dependency',
        })
      }
    })
  })

  return violations
}
```

## Boas práticas

### Faça ✅

- Envolver negócio na nomenclatura/fronteiras
- Agrupar por capacidade não por camada MVC sozinha
- Refatorar paths para refletir domínios “de verdade”
- Documentar mapa curto e vivo

### Evite ❌

- Domínio = só pasta `controllers/` etc.
- Forçar componente em domínio onde vocabulário discorda
- Dezenas de micro-domínios sem necessidade
- Domínio mega que vira monólito só com outro nome

## Patterns de domínio comuns

### Typical Domains in Business Applications

- **Customer Domain**: Customer management, profiles, relationships
- **Product Domain**: Product catalog, inventory, pricing
- **Order Domain**: Order processing, fulfillment, shipping
- **Billing Domain**: Invoicing, payments, financial transactions
- **Reporting Domain**: Reports, analytics, dashboards
- **Admin Domain**: User management, system configuration
- **Shared Domain**: Common functionality (login, notification, utilities)

### Tamanho médio sugerido por domínio

- **Small Domain**: 2-4 components
- **Medium Domain**: 5-8 components
- **Large Domain**: 9-15 components
- **Too Large**: >15 components (consider splitting)

## Próximos passos

1. **Extrair serviços de domínio** alinhados ao mapa
2. **Planejar extração** incremental
3. **Implantar fronteiras físicas** onde fizer sentido
4. **Monitorar** violations de import / namespace com fitness functions

## Notas finais

- Domínio primeiro é negócio, path depois espelha quando possível
- Refatorar namespace tem custo social — planeje PRs menores
- Bons domínios aceleram migração distribuída gradual
- Documente limites que importam para integração em evento/API
