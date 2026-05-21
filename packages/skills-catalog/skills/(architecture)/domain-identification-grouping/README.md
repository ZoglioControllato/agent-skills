# Identificação de Domínio e Habilidade de Agrupamento

Uma habilidade para agrupar componentes arquitetônicos em domínios lógicos (áreas de negócios) para preparar a criação de serviços de domínio em uma arquitetura baseada em serviços.

## O que essa habilidade faz

Esta habilidade analisa bases de código para:

1. **Identifique domínios de negócios** com base nas responsabilidades dos componentes e nas capacidades de negócios
2. **Agrupe componentes em domínios** analisando funcionalidades e relacionamentos
3. **Valide agrupamentos de domínios** para garantir que os componentes se encaixem bem
4. **Refatorar namespaces** para alinhar namespaces de componentes com domínios identificados
5. **Crie mapas de domínio** visualizando a estrutura do domínio e agrupamentos de componentes
6. **Limites de domínio do documento** e relacionamento

é 7. **Prepare-se para extração de serviços de domínio** em arquitetura baseada em serviços

## Quando usar esta habilidade

Esta habilidade é aplicada quando você:

- Peça para agrupar componentes em domínios lógicos
- Solicitar identificação de domínio para arquitetura baseada em serviços
- Precisa de ajuda para criar domínios de componentes
- Quer analisar quais componentes pertencem a quais domínios
- Pergunte sobre agrupamento ou organização de domínio
- Planeje criar serviços de domínio
- Discutir o mapeamento de componente para domínio

## Principais recursos

### Identificação de domínio com foco nos negócios

Esta habilidade se concentra em **capacidades de negócios**, não em camadas técnicas:

- Agrupa componentes por vocabulário e capacidades de negócios
- Identifica domínios com base no que a empresa faz
- Garante que os domínios representem áreas de negócios distintas
- Requer colaboração com as partes interessadas do negócio

### Múltiplas estratégias de identificação

Usa várias abordagens para identificar domínios:

1. **Análise de Capacidade de Negócios**: Quais capacidades de negócios o sistema oferece?
2. **Análise de vocabulário**: qual linguagem de negócios os componentes usam?
3. **Análise de Relacionamento**: Quais componentes são frequentemente usados ​​juntos?
4. **Colaboração das partes interessadas**: O que dizem os especialistas em negócios?

### Refatoração de namespace

Alinha namespaces de componentes com domínios identificados:

- Identifica componentes que precisam de alterações no namespace
- Sugere namespaces de destino para alinhamento de domínio
- Cria planos de refatoração com prioridades
- Garante limites de domínio claros na estrutura do código

### Validação de Domínio

Valida agrupamentos de domínio antes de continuar:

- Verifica a coesão dentro dos domínios
- Verifica se os limites do domínio estão claros
- Garante que todos os componentes sejam atribuídos
- Obtém validação das partes interessadas

## Arquivos incluídos

### SKILL.md (habilidade principal)

O arquivo de habilidade principal contendo:

- Metodologia de identificação de domínio
- Processo de agrupamento de componentes
- Estrutura de validação de domínio
- Orientação sobre refatoração de namespace
- Técnicas de mapeamento de domínio
- Modelos de formato de saída
- Notas de implementação para diferentes idiomas
- Exemplos de funções de fitness

### QUICK-REFERENCE.md (pesquisa rápida)

Referência rápida para cenários comuns:

- Estratégias de identificação de domínio
- Diretrizes para agrupamento de componentes
- Padrões de refatoração de namespace
- Lista de verificação de validação de domínio
- Modelo de saída

### README.md (este arquivo)

Documentação completa incluindo:

- O que a habilidade faz
- Quando usar
- Exemplos de uso
- Conceitos centrais
- Integração com outras habilidades

## Exemplos de uso

### Exemplo 1: Identificar domínios```

User: "Group components into logical domains"

The skill will:

1. Analyze component responsibilities
2. Identify business domains
3. Group components into domains
4. Create domain map
5. Suggest namespace refactoring

````

**Saída**:```markdown
## Identified Domains

1. **Customer Domain** (ss.customer)
   - Customer Profile
   - Billing Payment
   - Billing History
   - Support Contract

2. **Ticketing Domain** (ss.ticket)
   - Ticket Maintenance
   - Ticket Assignment
   - Ticket Routing
   - Knowledge Base
   - Survey

3. **Reporting Domain** (ss.reporting)
   - Ticket Reports
   - Expert Reports
   - Financial Reports
````

### Exemplo 2: Atribuição de Domínio```

User: "Which domain should the billing components belong to?"

The skill will:

1. Analyze billing component functionality
2. Check relationships with other components
3. Identify appropriate domain
4. Recommend domain assignment

````

**Saída**:```markdown
## Domain Assignment

**Billing Payment Component**:

- Current: ss.billing.payment
- Functionality: Customer billing and payment processing
- Relationships: Used with Customer Profile, Support Contract
- **Recommendation**: Customer Domain (ss.customer.billing.payment)

**Reasoning**: Billing is customer-related functionality, not a separate domain
````

### Exemplo 3: Refatoração de Namespace```

User: "What namespace refactoring is needed to align components with domains?"

The skill will:

1. Compare current namespaces to identified domains
2. Identify misaligned components
3. Suggest namespace changes
4. Create refactoring plan

````

**Saída**:```markdown
## Namespace Refactoring Plan

### Customer Domain Alignment

| Component        | Current            | Target                      | Action        |
| ---------------- | ------------------ | --------------------------- | ------------- |
| Billing Payment  | ss.billing.payment | ss.customer.billing.payment | Add .customer |
| Billing History  | ss.billing.history | ss.customer.billing.history | Add .customer |
| Support Contract | ss.supportcontract | ss.customer.supportcontract | Add .customer |
````

## Conceitos Básicos

### Definição de Domínio

Um **domínio** é um agrupamento lógico de componentes que:

- Representa uma capacidade ou área de negócios distinta
- Contém componentes relacionados que funcionam juntos
- Tem limites e responsabilidades claros
- Pode se tornar um serviço de domínio em arquitetura baseada em serviços

**Exemplos**:

- **Domínio do cliente**: gerenciamento de clientes, cobrança, suporte
- **Domínio de emissão de ingressos**: processamento de ingressos, base de conhecimento, pesquisas
- **Domínio de relatórios**: relatórios e análises

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
services/customer/profile
````

**Após o alinhamento do domínio**:```
services/customer/billing/payment
services/customer/profile

````
Todas as funcionalidades relacionadas ao cliente agrupadas no domínio `.customer`.

## Como usar

### Início rápido

Solicite análise da sua base de código:```
"Group components into logical domains"
"Identify component domains for service-based architecture"
"Create domain groupings from components"
"Analyze which components belong to which domains"
````

### Uso passo a passo

#### 1. Identificar domínios

Comece identificando domínios de negócios:```
User: "What domains exist in this codebase?"

````
Isto irá:

- Analisar responsabilidades dos componentes
- Identificar capacidades de negócios
- Identificar domínios de negócios distintos
- Validar com relacionamentos de componentes

#### 2. Componentes do grupo

Atribuir componentes aos domínios:```
User: "Group all components into their appropriate domains"
````

Isto irá:

- Analise a funcionalidade de cada componente
- Verifique as relações dos componentes
- Atribuir componentes a domínios
- Lidar com casos extremos

#### 3. Validar agrupamentos

Certifique-se de que os componentes se encaixem bem:```
User: "Do the component domain assignments make sense?"

````
Isto irá:

- Verifique a coesão dentro dos domínios
- Verifique os limites do domínio
- Garantir que todos os componentes atribuídos
- Sinalize quaisquer problemas

#### 4. Refatorar Namespaces

Alinhe namespaces com domínios:```
User: "What namespace refactoring is needed for domain alignment?"
````

Isto irá:

- Compare namespaces atuais e de destino
- Identificar componentes que precisam de refatoração
- Criar plano de refatoração
- Priorize o trabalho

### Uso Avançado

#### Colaboração das partes interessadas

Incluir as partes interessadas do negócio:```
User: "Identify domains and validate with product owner"

````
#### Regras de domínio personalizadas

Especifique regras de domínio:```
User: "Group components into domains, ensuring billing stays in Customer domain"
````

#### Análise de tamanho de domínio

Analise os tamanhos dos domínios:```
User: "Are any domains too large or too small?"

````
## Formato de saída

A habilidade gera resultados estruturados:

### Relatório de identificação de domínio```markdown
## Domain Identification

### Domain: Customer (ss.customer)

**Business Capability**: Manages customer relationships, billing, and support

**Components**:

- Customer Profile
- Billing Payment
- Billing History
- Support Contract

**Component Count**: 4
**Total Size**: ~15,000 statements (18% of codebase)

**Domain Cohesion**: ✅ High

- Components share customer-related vocabulary
- Components frequently used together
- Direct relationships between components
````

### Tabela de Atribuição de Domínio de Componente```markdown

## Component Domain Assignment

| Component          | Current Namespace     | Assigned Domain | Target Namespace            |
| ------------------ | --------------------- | --------------- | --------------------------- |
| Customer Profile   | ss.customer.profile   | Customer        | ss.customer.profile         |
| Billing Payment    | ss.billing.payment    | Customer        | ss.customer.billing.payment |
| Ticket Maintenance | ss.ticket.maintenance | Ticketing       | ss.ticket.maintenance       |

````
### Plano de refatoração de namespace```markdown
## Namespace Refactoring Plan

### Priority: High

**Customer Domain Alignment**

**Components to Refactor**:

1. Billing Payment: `ss.billing.payment` → `ss.customer.billing.payment`
2. Billing History: `ss.billing.history` → `ss.customer.billing.history`

**Steps**:

1. Update namespace declarations
2. Update import statements
3. Update directory structure
4. Run tests
5. Update documentation
````

### Visualização do mapa de domínio```markdown

## Domain Map

Customer Domain (ss.customer)
├── Customer Profile
├── Billing Payment
├── Billing History
└── Support Contract

Ticketing Domain (ss.ticket)
├── Ticket Maintenance
├── Ticket Assignment
└── Ticket Routing

````
## Integração com outras habilidades

Esta habilidade faz parte de uma sequência de padrões de decomposição:

1. **Identificação e dimensionamento de componentes** → Entenda o que você tem
2. **Análise de dependência de componentes** → Avaliar o acoplamento
3. **Detecção de componente de domínio comum** → Encontre duplicatas
4. **Achatamento de componentes** → Remover classes órfãs
5. **Identificação e agrupamento de domínios** (esta habilidade) → Agrupar em domínios
6. **Recomendação de limite de serviço** → Planejar a extração de serviço

Use esta habilidade depois de nivelar componentes e antes de criar serviços de domínio.

## Instalação

Esta habilidade é instalada no nível do projeto:```
skills/domain-identification-grouping/
````

Isso significa que é:

- **Compartilhado com o repositório**: qualquer pessoa que clonar este repositório obtém a habilidade
- **Controlado por versão**: as alterações são rastreadas no git
- **Específico do projeto**: pode ser personalizado para esta base de código

A habilidade será automaticamente descoberta e usada quando apropriado com base na descrição no frontmatter.

## Personalização

### Para domínios específicos do projeto

Documente a estrutura de domínio do seu projeto:```
skills/domain-identification-grouping/
└── project-domains.md # Document project-specific domains

````
### Para análise específica da estrutura

Adicione padrões específicos da estrutura:```markdown
## Framework: NestJS

**Domain Pattern**: `@Module()` decorator groups domain components
**Domain Structure**: `modules/[domain]/[component]/`
**Example**: `modules/customer/billing/`
````

### Regras de domínio personalizadas

Modifique as regras de domínio em SKILL.md:```markdown

## Custom Domain Rules

For this project:

- Billing always belongs to Customer domain
- Reporting is always a separate domain
- Admin functionality grouped under Admin domain

````
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
      })
    }
  })

  return violations
}
````

### Aplicação de limite de domínio```javascript

// Prevent cross-domain direct dependencies
function enforceDomainBoundaries(components) {
const violations = []

components.forEach((comp) => {
comp.imports.forEach((imp) => {
const importedDomain = identifyDomain(imp)
const componentDomain = identifyDomain(comp.namespace)

      if (importedDomain !== componentDomain && importedDomain !== 'shared') {
        violations.push({
          component: comp.name,
          importsFrom: imp,
          issue: 'Cross-domain direct dependency',
        })
      }
    })

})

return violations
}

````
## Melhores práticas

### O que fazer ✅

- Colaborar com as partes interessadas do negócio para identificar domínios
- Agrupar componentes por capacidade de negócios, não por camadas técnicas
- Garantir que os domínios representem áreas de negócios distintas
- Validar limites de domínio com as partes interessadas
- Refatorar namespaces para alinhar com domínios
- Crie documentação de domínio clara
- Use linguagem comercial em nomes de domínio
- Procure de 3 a 7 domínios (nem muitos, nem poucos)

### O que não fazer ❌

- Não crie domínios baseados em camadas técnicas
- Não force componentes em domínios onde eles não cabem
- Não pule a validação das partes interessadas
- Não crie muitos domínios pequenos
- Não crie domínios muito grandes (monolíticos)
- Não ignore componentes que não cabem (analise porquê)
- Não pule a refatoração do namespace

## Padrões de domínio comuns

### Domínios típicos em aplicativos de negócios

- **Domínio do Cliente**: Gestão de clientes, perfis, relacionamentos
- **Domínio do produto**: catálogo de produtos, estoque, preços
- **Domínio do pedido**: processamento e atendimento do pedido
- **Domínio de cobrança**: faturamento, pagamentos, transações
- **Domínio de relatórios**: relatórios, análises, painéis
- **Domínio Admin**: gerenciamento de usuários, configuração
- **Domínio Compartilhado**: Funcionalidade comum (login, notificação)

### Diretrizes de tamanho de domínio

- **Domínio Pequeno**: 2 a 4 componentes
- **Domínio Médio**: 5-8 componentes
- **Domínio Grande**: 9 a 15 componentes
- **Muito grande**: >15 componentes (considere dividir)

## Solução de problemas

### Componentes não cabem em nenhum domínio

**Problema**: alguns componentes não pertencem claramente a nenhum domínio

**Solução**:

- Analise a funcionalidade dos componentes mais profundamente
- Verifique se o componente é realmente específico do domínio
- Considere se o componente pertence ao domínio compartilhado
- Pode ser necessário criar um novo domínio ou dividir componente

### Muitos/poucos domínios

**Problema**: foram identificados muitos ou poucos domínios

**Solução**:

- Procure normalmente de 3 a 7 domínios
- Muitos: considere mesclar domínios relacionados
- Muito poucos: considere dividir domínios grandes
- Validar com as partes interessadas

### Refatoração de namespace muito complexa

**Problema**: refatorar parece muito difícil

**Solução**:

- Divida em etapas menores
- Refatorar um domínio por vez
- Use ferramentas de refatoração automatizadas
- Atualizar testes de forma incremental

## Referências

Esta habilidade é baseada em:

- **Arquitetura de software: as partes difíceis** por Neal Ford, Mark Richards, Pramod Sadalage, Zhamak Dehghani
- **Criar padrão de domínios de componentes** (Capítulo 5)
- **Fundamentos de Arquitetura de Software** por Mark Richards e Neal Ford
- **Design baseado em domínio** por Eric Evans

## Contribuindo

Para melhorar esta habilidade:

1. Adicione padrões de domínio específicos do idioma
2. Expanda a detecção de domínio específico da estrutura
3. Adicione mais estratégias de identificação de domínio
4. Documente novos antipadrões ou sinais de alerta
5. Compartilhe estudos de caso do mundo real

## Versão

**Versão**: 1.0.0
**Criado**: 05/02/2026
**Baseado em**: Criar padrão de domínios de componentes em "Arquitetura de software: as partes difíceis"

---

## Início rápido

Para usar esta habilidade imediatamente:```
User: "Group components into logical domains"
User: "Identify component domains for service-based architecture"
User: "Create domain groupings from components"
User: "Analyze which components belong to which domains"
````

Essa habilidade será aplicada automaticamente para fornecer identificação abrangente de domínio e análise de agrupamento.
