# Análise de nivelamento de componentes

Esta habilidade identifica problemas de hierarquia de componentes e garante que os componentes existam apenas como nós folha em estruturas de diretório/namespace, removendo classes órfãs de namespaces raiz.

## Como usar

### Início rápido

Solicite análise da sua base de código:

- **"Encontrar classes órfãs em namespaces raiz"**
- **"Achatar hierarquias de componentes"**
- **"Identificar componentes que precisam de nivelamento"**
- **"Analisar a estrutura do componente para problemas de hierarquia"**

### Exemplos de uso

**Exemplo 1: Encontre turmas órfãs**

```
User: "Find orphaned classes in root namespaces"

The skill will:
1. Scan component namespaces for hierarchy issues
2. Identify orphaned classes in root namespaces
3. Detect components built on top of other components
4. Suggest flattening strategies
5. Create refactoring plan
```

**Exemplo 2: Achatar componentes**

```
User: "Flatten component hierarchies in this codebase"

The skill will:
1. Identify components with hierarchy issues
2. Analyze orphaned classes
3. Suggest consolidation or splitting strategies
4. Create refactoring plan
5. Estimate effort
```

**Exemplo 3: Análise da Estrutura de Componentes**

```
User: "Analyze component structure for hierarchy issues"

The skill will:
1. Map component namespace structure
2. Identify root namespaces with code
3. Find components built on components
4. Flag hierarchy violations
5. Provide recommendations
```

### Processo passo a passo

1. **Estrutura de verificação**: Mapear hierarquias de namespace de componentes
2. **Identificar problemas**: encontrar classes órfãs e aninhamento de componentes
3. **Opções de análise**: Determine a estratégia de nivelamento (consolidar vs dividir)
4. **Criar Plano**: Gere um plano de refatoração com etapas
5. **Executar**: refatore componentes para remover hierarquia

## Quando usar

Aplique esta habilidade quando:

- Depois de reunir componentes de domínio comuns (Padrão 2)
- Antes de determinar as dependências dos componentes (Padrão 4)
- Quando os componentes possuem estruturas aninhadas
- Encontrar classes órfãs em namespaces raiz
- Preparação para agrupamento de domínio
- Limpando a estrutura dos componentes
- Garantir que os componentes sejam apenas nós folha

## Conceitos Básicos

### Definição de componente

Um **componente** é identificado por um **nó folha** na estrutura de diretório/namespace:

- **Leaf Node**: o diretório mais profundo contendo arquivos de origem
- **Componente**: arquivos de código-fonte no namespace do nó folha
- **Subdomínio**: namespace pai que foi estendido

**Regra principal**: Os componentes existem apenas como nós folha. Se um namespace for estendido, o pai se tornará um subdomínio, não um componente.

### Namespace raiz

Um **namespace raiz** é um nó de namespace que foi estendido:

- **Estendido**: outro nó de namespace adicionado abaixo dele
- **Exemplo**: `ss.survey` estendido para `ss.survey.templates`
- **Resultado**: `ss.survey` se torna um namespace raiz (subdomínio)

### Classes Órfãs

**Classes órfãs** são arquivos de origem em namespaces raiz:

- **Localização**: namespace raiz (nó não folha)
- **Problema**: Nenhum componente definível associado a eles
- **Solução**: Mover para o namespace do nó folha (componente)

**Exemplo**:```
ss.survey/ ← Root namespace (extended by .templates)
├── Survey.js ← Orphaned class (in root namespace)
└── templates/ ← Component (leaf node)
└── Template.js

````
### Estratégias de achatamento

**Estratégia 1: Consolidar **

- Mova o código dos nós folha para o namespace raiz
- Torna o namespace raiz o componente
- Exemplo: Mover `ss.survey.templates` → `ss.survey`

**Estratégia 2: Divisão**

- Mova o código do namespace raiz para novos nós folha
- Cria novos componentes a partir do namespace raiz
- Exemplo: Dividir `ss.survey` → `ss.survey.create` + `ss.survey.process`

**Estratégia 3: Mover código compartilhado**

- Mova o código compartilhado para um componente dedicado
- Cria o componente `.shared`
- Exemplo: código compartilhado `ss.survey` → `ss.survey.shared`

## Processo de análise

### Fase 1: Estrutura do Componente do Mapa

Verifique a estrutura de diretório/namespace para identificar a hierarquia:

1. **Árvore de Namespace do Mapa**
   - Construir árvore de todos os namespaces
   - Identificar relacionamentos entre pais e filhos
   - Marcar nós folha (componentes)

2. **Identificar namespaces raiz**
   - Encontre namespaces que foram estendidos
   - Marcar como namespaces raiz (subdomínios)
   - Observe quais namespaces os estendem

3. **Localize os arquivos de origem**
   - Encontre todos os arquivos de origem em cada namespace
   - Mapeie os arquivos para a localização do namespace
   - Identificar arquivos em namespaces raiz

**Exemplo de mapeamento de estrutura**:```markdown
## Component Structure Map
````

ss.survey/ ← Namespace raiz (estendido)
├── Survey.js ← Classe órfã
├── SurveyProcessor.js ← Classe órfã
└── modelos/ ← Componente (nó folha)
├── EmailTemplate.js
└── SMSTemplate.js

ss.ticket/ ← Namespace raiz (estendido)
├── Ticket.js ← Classe órfã
├── atribuir/ ← Componente (nó folha)
│ └── TicketAssign.js
└── rota/ ← Componente (nó folha)
└── TicketRoute.js```

````
### Fase 2: Identificar classes órfãs

Encontre arquivos de origem em namespaces raiz:

1. **Verificar namespaces raiz**
   - Verifique cada namespace raiz em busca de arquivos de origem
   - Identifique arquivos órfãos
   - Contar arquivos órfãos por namespace raiz

2. **Classificar turmas órfãs**
   - **Código Compartilhado**: Utilitários comuns, interfaces, classes abstratas
   - **Código de Domínio**: Lógica de negócio que deve estar no componente
   - **Misto**: combinação de código compartilhado e de domínio

3. **Avaliar o impacto**
   - Quantos arquivos estão órfãos?
   - Que funcionalidades eles contêm?
   - Quais componentes dependem deles?

**Exemplo de detecção de classe órfã**:```markdown
## Orphaned Classes Found

### Root Namespace: ss.survey

**Orphaned Files** (5 files):

- Survey.js (domain code - survey creation)
- SurveyProcessor.js (domain code - survey processing)
- SurveyValidator.js (shared code - validation)
- SurveyFormatter.js (shared code - formatting)
- SurveyConstants.js (shared code - constants)

**Classification**:

- Domain Code: 2 files (should be in components)
- Shared Code: 3 files (should be in .shared component)

**Dependencies**: Used by ss.survey.templates component
````

### Fase 3: Analisar opções de nivelamento

Determine a melhor estratégia de nivelamento para cada namespace raiz:

1. **Opção 1: Consolidar**
   - Mover o código do nó folha para o namespace raiz
   - Torna o namespace raiz o componente
   - **Usar quando**: os nós folha são pequenos e têm funcionalidade relacionada

2. **Opção 2: Divisão**
   - Mover o código do namespace raiz para novos nós folha
   - Cria vários componentes a partir do root
   - **Usar quando**: o namespace raiz tem áreas funcionais distintas

3. **Opção 3: Mover código compartilhado**
   - Extraia o código compartilhado para o componente `.shared`
   - Mantenha o código de domínio na raiz ou dividido
   - **Usar quando**: o namespace raiz possui utilitários compartilhados

**Exemplo de análise de nivelamento**:```markdown

## Flattening Options Analysis

### Root Namespace: ss.survey

**Current State**:

- Root namespace: 5 orphaned files
- Leaf component: ss.survey.templates (7 files)

**Option 1: Consolidate Down** ✅ Recommended

- Move templates code into ss.survey
- Result: Single component ss.survey
- Effort: Low (7 files to move)
- Rationale: Templates are small, related to survey functionality

**Option 2: Split Up**

- Create ss.survey.create (2 files)
- Create ss.survey.process (1 file)
- Create ss.survey.shared (3 files)
- Keep ss.survey.templates (7 files)
- Effort: High (multiple components to create)
- Rationale: More granular, but may be over-engineering

**Option 3: Move Shared Code**

- Create ss.survey.shared (3 shared files)
- Keep domain code in root (2 files)
- Keep ss.survey.templates (7 files)
- Effort: Medium
- Rationale: Separates shared from domain, but still has hierarchy

````
### Fase 4: Criar plano de nivelamento

Gere um plano de refatoração para cada namespace raiz:

1. **Selecione Estratégia**
   - Escolha a melhor opção de nivelamento
   - Considere esforço, complexidade, capacidade de manutenção

2. **Planejar etapas de refatoração**
   - Listar arquivos para mover
   - Identificar namespaces de destino
   - Observe as dependências para atualizar

3. **Estimativa de Esforço**
   - Hora de refatorar
   - Avaliação de risco
   - Requisitos de teste

**Exemplo de plano de nivelamento**:```markdown
## Flattening Plan

### Priority: High

**Root Namespace: ss.survey**

**Strategy**: Consolidate Down

**Steps**:

1. Move files from ss.survey.templates/ to ss.survey/
   - EmailTemplate.js
   - SMSTemplate.js
   - [5 more files]

2. Update imports in dependent components
   - Update references from ss.survey.templates._ to ss.survey._

3. Remove ss.survey.templates/ directory

4. Update namespace declarations
   - Change namespace from ss.survey.templates to ss.survey

5. Run tests to verify changes

**Effort**: 2-3 days
**Risk**: Low (templates are self-contained)
**Dependencies**: None
````

### Fase 5: Executar nivelamento

Execute a refatoração:

1. **Mover arquivos**
   - Mover arquivos de origem para o namespace de destino
   - Atualizar caminhos de arquivos e importações

2. **Atualizar referências**
   - Atualizar importações em componentes dependentes
   - Atualizar declarações de namespace
   - Atualizar estrutura de diretórios

3. **Verificar alterações**
   - Executar testes
   - Verifique se há referências quebradas
   - Validar estrutura de componentes

## Formato de saída

### Relatório de turmas órfãs```markdown

## Orphaned Classes Analysis

### Root Namespace: ss.survey

**Status**: ⚠️ Has Orphaned Classes

**Orphaned Files** (5 files):

- Survey.js (domain code)
- SurveyProcessor.js (domain code)
- SurveyValidator.js (shared code)
- SurveyFormatter.js (shared code)
- SurveyConstants.js (shared code)

**Leaf Components**:

- ss.survey.templates (7 files)

**Issue**: Root namespace contains code but is extended by leaf component

**Recommendation**: Consolidate templates into root namespace

````
### Problemas de hierarquia de componentes```markdown
## Component Hierarchy Issues

| Root Namespace | Orphaned Files | Leaf Components                 | Issue                | Recommendation   |
| -------------- | -------------- | ------------------------------- | -------------------- | ---------------- |
| ss.survey      | 5              | 1 (templates)                   | Has orphaned classes | Consolidate down |
| ss.ticket      | 45             | 2 (assign, route)               | Large orphaned code  | Split up         |
| ss.reporting   | 0              | 3 (tickets, experts, financial) | No issue             | ✅ OK            |
````

### Plano de nivelamento```markdown

## Flattening Plan

### Priority: High

**ss.survey** → Consolidate Down

- Move 7 files from templates to root
- Effort: 2-3 days
- Risk: Low

### Priority: Medium

**ss.ticket** → Split Up

- Create ss.ticket.maintenance (30 files)
- Create ss.ticket.completion (10 files)
- Create ss.ticket.shared (5 files)
- Effort: 1 week
- Risk: Medium

````
## Lista de verificação de análise

**Mapeamento de Estrutura**:

- [] Mapeou todas as hierarquias de namespace
- [] Namespaces raiz identificados
- [] Localizados todos os arquivos de origem
- [] Nós folha marcados (componentes)

**Detecção de classe órfã**:

- [] Namespaces raiz verificados para arquivos de origem
- [] Classes órfãs identificadas
- [] Classes órfãs classificadas (compartilhadas/domínio/mistas)
- [ ] Impacto e dependências avaliados

**Análise de nivelamento**:

- [ ] Opção de consolidação analisada
- [] Opção de divisão analisada
- [] Opção de extração de código compartilhado analisada
- [] Melhor estratégia selecionada para cada namespace raiz

**Criação do Plano**:

- [] Estratégia de nivelamento selecionada
- [] Etapas de refatoração criadas
- [ ] Esforço e risco estimados
- [] Trabalho priorizado

**Execução**:

- [] Arquivos movidos para namespaces de destino
- [] Importações e referências atualizadas
- [] Declarações de namespace atualizadas
- [] Alterações verificadas com testes

## Notas de implementação

### Para aplicativos Node.js/Express

Componentes normalmente no diretório `services/`:```
services/
├── survey/              ← Root namespace (extended)
│   ├── Survey.js       ← Orphaned class
│   └── templates/      ← Component (leaf node)
│       └── Template.js
````

**Achatamento**:

- Consolidar: Mova os arquivos `templates/` para `survey/`
- Divisão: Criar `pesquisa/criar/` e `pesquisa/processo/`
- Compartilhado: Crie `pesquisa/compartilhada/` para utilitários

### Para aplicativos Java

Componentes identificados pela estrutura do pacote:```
com.company.survey ← Root package (extended)
├── Survey.java ← Orphaned class
└── templates/ ← Component (leaf package)
└── Template.java

````

**Achatamento**:

- Consolidar: Mova as classes `templates` para o pacote `survey`
- Divisão: Crie pacotes `survey.create` e `survey.process`
- Compartilhado: Crie o pacote `survey.shared`

### Estratégias de detecção

**Encontre namespaces raiz com código**:```javascript
// Find root namespaces containing source files
function findRootNamespacesWithCode(namespaces, sourceFiles) {
  const rootNamespaces = namespaces.filter((ns) => {
    // Check if namespace has been extended
    const hasChildren = namespaces.some((n) => n.startsWith(ns + '.') || n.startsWith(ns + '/'))

    // Check if namespace contains source files
    const hasFiles = sourceFiles.some((f) => f.namespace === ns)

    return hasChildren && hasFiles
  })

  return rootNamespaces
}
````

**Encontre turmas órfãs**:```javascript
// Find orphaned classes in root namespaces
function findOrphanedClasses(rootNamespaces, sourceFiles) {
const orphaned = []

rootNamespaces.forEach((rootNs) => {
const files = sourceFiles.filter((f) => f.namespace === rootNs)
orphaned.push({
rootNamespace: rootNs,
files: files,
count: files.length,
})
})

return orphaned
}

````
## Funções de condicionamento físico

Após nivelar os componentes, crie verificações automatizadas:

### Nenhum código-fonte em namespaces raiz```javascript
// Alert if source code exists in root namespace
function checkRootNamespaceCode(namespaces, sourceFiles) {
  const violations = []

  namespaces.forEach((ns) => {
    // Check if namespace has been extended
    const hasChildren = namespaces.some((n) => n.startsWith(ns + '.') || n.startsWith(ns + '/'))

    if (hasChildren) {
      // Check if namespace contains source files
      const files = sourceFiles.filter((f) => f.namespace === ns)

      if (files.length > 0) {
        violations.push({
          namespace: ns,
          files: files.map((f) => f.name),
          issue: 'Root namespace contains source files (orphaned classes)',
        })
      }
    }
  })

  return violations
}
````

### Componentes apenas como nós folha```javascript

// Ensure components exist only as leaf nodes
function validateComponentStructure(namespaces, sourceFiles) {
const violations = []

// Find all leaf nodes (components)
const leafNodes = namespaces.filter((ns) => {
return !namespaces.some((n) => n.startsWith(ns + '.') || n.startsWith(ns + '/'))
})

// Check that all source files are in leaf nodes
sourceFiles.forEach((file) => {
if (!leafNodes.includes(file.namespace)) {
violations.push({
file: file.name,
namespace: file.namespace,
issue: 'Source file not in leaf node (component)',
})
}
})

return violations
}

````
## Melhores práticas

### O que fazer ✅

- Garantir que os componentes existam apenas como nós folha
- Remover classes órfãs de namespaces raiz
- Escolha a estratégia de nivelamento com base na funcionalidade
- Consolidar quando a funcionalidade está relacionada
- Dividir quando a funcionalidade for distinta
- Extraia o código compartilhado para componentes `.shared`
- Atualize todas as referências após o nivelamento
- Verifique as alterações com testes

### O que não fazer ❌

- Não deixe classes órfãs em namespaces raiz
- Não crie componentes sobre outros componentes
- Não pule a atualização das importações após mover os arquivos
- Não achate sem analisar o impacto
- Não misture estratégias de nivelamento de forma inconsistente
- Não ignore o código compartilhado ao nivelar
- Não pule os testes após a refatoração

## Padrões Comuns

### Padrão 1: Consolidação Simples

**Antes**:```
ss.survey/
├── Survey.js           ← Orphaned
└── templates/          ← Component
    └── Template.js
````

**Depois**:```
ss.survey/ ← Component (leaf node)
├── Survey.js
└── Template.js

````
### Padrão 2: Divisão Funcional

**Antes**:```
ss.ticket/              ← Root namespace
├── Ticket.js           ← Orphaned (45 files)
├── assign/             ← Component
└── route/              ← Component
````

**Depois**:```
ss.ticket/ ← Subdomain
├── maintenance/ ← Component
│ └── Ticket.js
├── completion/ ← Component
│ └── TicketCompletion.js
├── assign/ ← Component
└── route/ ← Component

````
### Padrão 3: Extração de código compartilhado

**Antes**:```
ss.survey/              ← Root namespace
├── Survey.js           ← Domain code
├── SurveyValidator.js  ← Shared code
└── templates/          ← Component
````

**Depois**:```
ss.survey/ ← Component
├── Survey.js
└── shared/ ← Component
└── SurveyValidator.js

```
## Próximas etapas

Depois de nivelar os componentes:

1. **Aplicar Padrão de Determinação de Dependências de Componentes** - Analisar acoplamento
2. **Criar domínios de componentes** – Agrupar componentes em domínios
3. **Criar serviços de domínio** – Extrair domínios para serviços

## Notas

- Os componentes devem existir apenas como nós folha
- Namespaces raiz com código são problemáticos
- O achatamento melhora a clareza dos componentes
- Escolha a estratégia de nivelamento com base na funcionalidade
- O código compartilhado deve estar em componentes dedicados
- Sempre atualize as referências após mover arquivos
- Teste cuidadosamente após o achatamento
```
