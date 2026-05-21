# Identificação e agrupamento de domínio

Esta habilidade agrupa componentes arquitetônicos em domínios lógicos (áreas de negócios) para preparar a criação de serviços de domínio em uma arquitetura baseada em serviços.

## Como usar

### Início rápido

Solicite análise da sua base de código:

- **"Agrupar componentes em domínios lógicos"**
- **"Identificar domínios de componentes para arquitetura baseada em serviços"**
- **"Criar agrupamentos de domínio a partir de componentes"**
- **"Analise quais componentes pertencem a quais domínios"**

### Exemplos de uso

**Exemplo 1: Identificação de Domínio**

```
User: "Group components into logical domains"

The skill will:
1. Analyze component responsibilities and relationships
2. Identify business domains based on functionality
3. Group components into domains
4. Create domain diagrams
5. Suggest namespace refactoring for domain alignment
```

**Exemplo 2: Análise de Domínio**

```
User: "Which domain should the billing components belong to?"

The skill will:
1. Analyze billing component functionality
2. Check relationships with other components
3. Identify appropriate domain (e.g., Customer or Financial)
4. Recommend domain assignment
```

**Exemplo 3: Refatoração de Domínio**

```
User: "What namespace refactoring is needed to align components with domains?"

The skill will:
1. Compare current component namespaces to identified domains
2. Identify misaligned components
3. Suggest namespace changes
4. Create refactoring plan
```

### Processo passo a passo

1. **Identificar domínios**: analisar recursos de negócios e relacionamentos de componentes
2. **Componentes do grupo**: atribua componentes aos domínios apropriados
3. **Validar agrupamentos**: garantir que os componentes se encaixem bem em seus domínios
4. **Refatorar Namespaces**: Alinhe namespaces de componentes com domínios
5. **Criar mapa de domínio**: visualizar estrutura de domínio e agrupamentos de componentes

## Quando usar

Aplique esta habilidade quando:

- Depois de identificar, dimensionar e analisar dependências de componentes
- Antes de criar serviços de domínio (Padrão 6)
- Ao planejar a migração da arquitetura baseada em serviços
- Analisar relacionamentos de componentes e alinhamento de negócios
- Preparação para implementação de design orientado a domínio
- Agrupamento de componentes para melhor organização

## Conceitos Básicos

### Definição de Domínio

Um **domínio** é um agrupamento lógico de componentes que:

- Representa uma capacidade ou área de negócios distinta
- Contém componentes relacionados que funcionam juntos
- Tem limites e responsabilidades claros
- Pode se tornar um serviço de domínio em arquitetura baseada em serviços

**Exemplos**:

- **Domínio do cliente**: perfil do cliente, faturamento, contratos de suporte
- **Domínio de emissão de tickets**: criação, atribuição, roteamento, conclusão de tickets
- **Domínio de relatórios**: relatórios de tickets, relatórios de especialistas, relatórios financeiros

### Relacionamento de domínio de componente

**Um para muitos**: um único domínio contém vários componentes```
Domain: Customer
├── Component: Customer Profile
├── Component: Billing Payment
├── Component: Billing History
└── Component: Support Contract

````
### Manifestação de Domínio

Os domínios são manifestados fisicamente por meio de **estrutura de namespace**:

**Antes do alinhamento do domínio**:```
services/billing/payment
services/billing/history
services/customer/profile
services/supportcontract
````

**Após o alinhamento do domínio**:```
services/customer/billing/payment
services/customer/billing/history
services/customer/profile
services/customer/supportcontract

````
Observe como todas as funcionalidades relacionadas ao cliente estão agrupadas no domínio `.customer`.

## Processo de análise

### Fase 1: Identificar domínios de negócios

Analise a base de código para identificar domínios de negócios distintos:

1. **Examine as responsabilidades dos componentes**
   - Leia nomes e descrições de componentes
   - Entenda o que cada componente faz
   - Identificar capacidades de negócios

2. **Procure por idioma comercial**
   - Agrupar componentes por vocabulário de negócios
   - Exemplo: “faturamento”, “pagamento”, “fatura” → Domínio financeiro
   - Exemplo: “cliente”, “perfil”, “contrato” → Domínio do cliente

3. **Identificar limites de domínio**
   - Onde mudam os conceitos de negócios?
   - Quais são as áreas de negócio distintas?
   - Como os componentes se relacionam com as capacidades de negócios?

4. **Colabore com as partes interessadas do negócio**
   - Validar a identificação do domínio com os proprietários do produto
   - Garantir que os domínios estejam alinhados com o entendimento do negócio
   - Obtenha feedback sobre os limites do domínio

**Exemplo de identificação de domínio**:```markdown
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
````

### Fase 2: Agrupar componentes em domínios

Atribua cada componente a um domínio apropriado:

1. **Analisar a funcionalidade do componente**
   - Que capacidade de negócios ele suporta?
   - Que vocabulário de domínio ele usa?
   - A que outros componentes se refere?

2. **Verifique as relações dos componentes**
   - Quais componentes são frequentemente usados juntos?
   - Quais são as dependências entre os componentes?
   - Os componentes compartilham dados ou fluxos de trabalho?

3. **Atribuir ao domínio**
   - Coloque o componente no domínio que melhor se adapta à sua funcionalidade
   - Garantir que o componente esteja alinhado com a linguagem comercial do domínio
   - Verifique se os relacionamentos dos componentes suportam o agrupamento de domínios

4. **Lidar com casos extremos**
   - Componentes que não se ajustam claramente: Analise mais profundamente
   - Componentes que cabem em vários domínios: escolha o domínio principal
   - Componentes compartilhados: podem pertencer ao domínio compartilhado

**Exemplo de agrupamento de componentes**:```markdown

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

````
### Fase 3: Validar agrupamentos de domínios

Certifique-se de que os componentes se ajustem bem aos domínios atribuídos:

1. **Verifique a coesão**
   - Os componentes do domínio compartilham a linguagem comercial?
   - Os componentes são frequentemente usados ​​juntos?
   - Os componentes têm relações diretas?

2. **Verifique os limites**
   - Os limites do domínio estão claros?
   - Os componentes pertencem a apenas um domínio?
   - Existem componentes que não cabem em lugar nenhum?

3. **Avaliar a integridade**
   - Todos os componentes estão atribuídos a um domínio?
   - Os domínios são coesos e bem formados?
   - Os domínios representam capacidades empresariais distintas?

4. **Obter validação das partes interessadas**
   - Revise agrupamentos de domínio com proprietários de produtos
   - Garantir que os domínios estejam alinhados com o entendimento do negócio
   - Obtenha feedback sobre os limites do domínio

**Lista de verificação de validação**:

- [] Todos os componentes atribuídos a um domínio
- [] Os domínios têm limites claros
- [] Componentes se ajustam bem em seus domínios
- [] Domínios representam capacidades de negócios distintas
- [] As partes interessadas validam agrupamentos de domínios

### Fase 4: Refatorar Namespaces para Alinhamento de Domínio

Alinhe os namespaces dos componentes com os domínios identificados:

1. **Compare namespaces atuais e de destino**
   - Atual: `serviços/faturamento/pagamento`
   - Alvo: `serviços/cliente/faturamento/pagamento`
   - Alteração: Adicionar nó de domínio `.customer`

2. **Identificar a refatoração necessária**
   - Quais componentes precisam de alterações no namespace?
   - Quais nós de domínio precisam ser adicionados?
   - Existem componentes já alinhados?

3. **Criar plano de refatoração**
   - Listar componentes que precisam de alterações no namespace
   - Especifique o namespace de destino para cada
   - Priorizar o trabalho de refatoração

4. **Executar refatoração**
   - Atualizar namespaces de componentes
   - Atualizar importações/referências
   - Verifique todas as referências atualizadas

**Exemplo de refatoração de namespace**:```markdown
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
````

### Fase 5: Criar Mapa de Domínio

Visualize a estrutura do domínio e os agrupamentos de componentes:

1. **Criar Diagrama de Domínio**
   - Mostrar domínios como caixas
   - Mostrar componentes dentro de cada domínio
   - Mostrar relacionamentos entre domínios

2. **Estrutura do Domínio do Documento**
   - Listar domínios e seus componentes
   - Descrever as responsabilidades do domínio
   - Observe os limites do domínio

3. **Criar inventário de domínio**
   - Tabela de domínios e componentes
   - Contagens de componentes por domínio
   - Métricas de tamanho por domínio

**Exemplo de mapa de domínio**:```markdown

## Domain Map

`````
┌─────────────────────────────────────┐
│ Domínio de emissão de ingressos (ss.ticket) │
├─────────────────────────────────────┤
│ • Bilhete Compartilhado │
│ • Manutenção de tickets │
│ • Conclusão do ticket │
│ • Atribuição de ingressos │
│ • Rota do ingresso │
│ • Manutenção da KB │
│ • Pesquisa de KB │
│ • Pesquisa │
└─────────────────────────────────────┘
│
│ usos
▼
┌─────────────────────────────────────┐
│ Domínio do cliente (ss.customer) │
├─────────────────────────────────────┤
│ • Cliente

Perfil │
│ • Pagamento de cobrança │
│ • Histórico de cobrança │
│ • Contrato de Suporte │
└─────────────────────────────────────┘````

## Output Format

### Domain Identification Report

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
`````

### Tabela de Atribuição de Domínio de Componente```markdown

## Component Domain Assignment

| Component          | Current Namespace     | Assigned Domain | Target Namespace                  |
| ------------------ | --------------------- | --------------- | --------------------------------- |
| Customer Profile   | ss.customer.profile   | Customer        | ss.customer.profile (no change)   |
| Billing Payment    | ss.billing.payment    | Customer        | ss.customer.billing.payment       |
| Ticket Maintenance | ss.ticket.maintenance | Ticketing       | ss.ticket.maintenance (no change) |
| KB Maintenance     | ss.kb.maintenance     | Ticketing       | ss.ticket.kb.maintenance          |
| Reporting Shared   | ss.reporting.shared   | Reporting       | ss.reporting.shared (no change)   |

````
### Plano de refatoração de namespace```markdown
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
````

### Visualização do mapa de domínio```markdown

## Domain Map

### Domain Structure

````
Domínio do cliente (ss.customer)
├── Perfil do Cliente
├── Pagamento de cobrança
├── Histórico de cobrança
└── Contrato de Suporte

Domínio de emissão de ingressos (ss.ticket)
├── Bilhete Compartilhado
├── Manutenção de tíquetes
├── Conclusão do tíquete
├── Atribuição de ingresso
├── Rota de ingressos
├── Manutenção da KB
├── Pesquisa de KB
└── Pesquisa

Domínio de relatório (ss.reporting)
├── Relatório Compartilhado
├── Relatórios de ingressos
├── Relatórios de especialistas
└── Relatórios Financeiros

Domínio administrativo (ss.admin)
├── Manutenção do usuário
└── Perfil de Especialista

Domínio Compartilhado (ss.shared)
├── Entrar
└── Notificação```

### Domain Relationships

````

Domínio de emissão de ingressos
│ usos
├─→ Domínio Compartilhado (Login, Notificação)
└─→ Domínio do Cliente (Perfil do Cliente)

Domínio do cliente
│ usos
└─→ Domínio Compartilhado (Login, Notificação)

Domínio de relatório
│ usos
├─→ Domínio de ticket (dados do ticket)
├─→ Domínio do Cliente (dados do cliente)
└─→ Domínio Compartilhado (Login)```

````
## Lista de verificação de análise

**Identificação do domínio**:

- [] Responsabilidades dos componentes analisados
- [] Capacidades de negócios identificadas
- [] Domínios de negócios distintos identificados
- [ ] Domínios validados com stakeholders

**Agrupamento de Componentes**:

- [] Atribuiu cada componente a um domínio
- [] Relacionamentos de componentes analisados
- [] Componentes garantidos se ajustam ao vocabulário do domínio
- [] Casos extremos tratados (componentes compartilhados, atribuições pouco claras)

**Validação de domínio**:

- [] Coesão verificada dentro dos domínios
- [] Os limites do domínio verificado são claros
- [] Garantiu todos os componentes atribuídos
- [ ] Validado com as partes interessadas

**Refatoração de namespace**:

- [] Comparação de namespaces atuais e de destino
- [] Componentes identificados que precisam de refatoração
- [] Plano de refatoração criado
- [] Trabalho de refatoração priorizado

**Mapeamento de Domínio**:

- [] Diagrama de domínio criado
- [] Estrutura de domínio documentada
- [] Tabela de inventário de domínio criada
- [] Relacionamentos de domínio documentados

## Notas de implementação

### Para aplicativos Node.js/Express

Domínios normalmente organizados no diretório `services/`:```
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
````

### Para aplicativos Java

Domínios identificados pela estrutura do pacote:```
com.company.customer ← Customer Domain
├── profile
├── billing
│ ├── payment
│ └── history
└── supportcontract

com.company.ticket ← Ticketing Domain
├── shared
├── maintenance
├── assign
└── route

````
### Estratégias de identificação de domínio

**Estratégia 1: Análise de capacidade de negócios**

- Identificar quais recursos de negócios o sistema oferece
- Agrupar componentes por capacidade
- Exemplo: capacidade "Gestão de Clientes" → Domínio do Cliente

**Estratégia 2: Análise de Vocabulário**

- Identificar o vocabulário de negócios usado pelos componentes
- Componentes do grupo compartilhando o mesmo vocabulário
- Exemplo: Componentes utilizando “faturamento”, “pagamento”, “fatura” → Domínio Financeiro

**Estratégia 3: Análise de Relacionamento**

- Identificar componentes frequentemente usados juntos
- Componentes do grupo com relacionamentos fortes
- Exemplo: Componentes que compartilham dados/fluxos de trabalho → Mesmo Domínio

**Estratégia 4: Colaboração das partes interessadas**

- Trabalhar com proprietários de produtos/analistas de negócios
- Use sua compreensão das áreas de negócios
- Valide os limites do domínio com eles

## Funções de condicionamento físico

Depois de criar domínios, crie verificações automatizadas:

### Governança de Namespace de Domínio```javascript
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
````

### Aplicação de limite de domínio```javascript

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
## Melhores práticas

### O que fazer ✅

- Colaborar com as partes interessadas do negócio para identificar domínios
- Agrupar componentes por capacidade de negócios, não por camadas técnicas
- Garantir que os domínios representem áreas de negócios distintas
- Validar limites de domínio com as partes interessadas
- Refatorar namespaces para alinhar com domínios
- Crie documentação de domínio clara
- Use linguagem comercial em nomes de domínio

### O que não fazer ❌

- Don't create domains based on technical layers (services, controllers, models)
- Não force componentes em domínios onde eles não cabem
- Não pule a validação das partes interessadas
- Não crie muitos domínios pequenos (tente de 3 a 7 domínios)
- Não crie domínios muito grandes (domínios monolíticos)
- Não ignore componentes que não cabem (analise porquê)
- Não pule a refatoração do namespace (crítico para maior clareza)

## Padrões de domínio comuns

### Domínios típicos em aplicativos de negócios

- **Domínio do Cliente**: Gestão de clientes, perfis, relacionamentos
- **Domínio do produto**: catálogo de produtos, estoque, preços
- **Domínio do pedido**: processamento do pedido, atendimento, envio
- **Domínio de cobrança**: faturamento, pagamentos, transações financeiras
- **Domínio de relatórios**: relatórios, análises, painéis
- **Domínio Admin**: gerenciamento de usuários, configuração do sistema
- **Domínio Compartilhado**: Funcionalidades comuns (login, notificação, utilitários)

### Diretrizes de tamanho de domínio

- **Domínio Pequeno**: 2 a 4 componentes
- **Domínio Médio**: 5-8 componentes
- **Domínio Grande**: 9 a 15 componentes
- **Muito grande**: >15 componentes (considere dividir)

## Próximas etapas

Depois de criar domínios de componentes:

1. **Aplicar Criar Padrão de Serviços de Domínio** – Extrair domínios para serviços separados
2. **Plano de extração de serviço** – Crie um plano de migração para serviços de domínio
3. **Implementar serviços de domínio** – Mova domínios para serviços implantados separadamente
4. **Monitore limites de domínio** - Use funções de aptidão para impor limites

## Notas

- Os domínios devem representar capacidades de negócios, não camadas técnicas
- A identificação do domínio requer colaboração com as partes interessadas do negócio
- A refatoração do namespace é crítica para a clareza do domínio
- Os domínios preparam a base de código para a arquitetura baseada em serviços
- Domínios bem formados facilitam a extração de serviços
- Os limites do domínio devem ser claros e bem documentados
```
