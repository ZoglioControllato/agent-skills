---
name: component-flattening-analysis
description: Detecta classes fora do lugar e corrige hierarquia de componentes — encontra código que deveria estar dentro do componente mas fica na raiz do namespace. Use quando pedir para "organizar estrutura de componentes", "achar classes órfãs", "consertar hierarquia", "achatar componentes aninhados" ou entender código mal posicionado em namespaces. Aciona em problemas de hierarquia e código em nós intermediários. NÃO use para análise de dependências (use coupling-analysis) nem agrupamento em domínios (use domain-identification-grouping).
---

# Análise de achatamento (flattening) de componentes

Esta skill identifica problemas de hierarquia de componentes e garante que componentes existam **apenas** como leaf nodes em diretório/namespace, removendo classes órfãs de namespaces raiz estendidos.

## Como usar

### Quick start

Peça:

- **"Find orphaned classes in root namespaces"**
- **"Flatten component hierarchies"**
- **"Identify components that need flattening"**
- **"Analyze component structure for hierarchy issues"**

### Exemplos

**Ex. 1: classes órfãs**

```
User: "Find orphaned classes in root namespaces"

The skill will:
1. Scan component namespaces for hierarchy issues
2. Identify orphaned classes in root namespaces
3. Detect components built on top of other components
4. Suggest flattening strategies
5. Create refactoring plan
```

**Ex. 2: flatten**

```
User: "Flatten component hierarchies in this codebase"

The skill will:
1. Identify components with hierarchy issues
2. Analyze orphaned classes
3. Suggest consolidation or splitting strategies
4. Create refactoring plan
5. Estimate effort
```

**Ex. 3: análise de estrutura**

```
User: "Analyze component structure for hierarchy issues"

The skill will:
1. Map component namespace structure
2. Identify root namespaces with code
3. Find components built on components
4. Flag hierarchy violations
5. Provide recommendations
```

### Passos

1. **Mapear estrutura**
2. **Achar orphans e nesting ilegítimos**
3. **Escolher estratégia** (fundir/subir código vs partir em novos leafs)
4. **Plano**
5. **Executar refactoring**

## Quando usar

- Após Pattern 2 (domínios comuns) quando reorganizar pastas faz sentido
- Antes de Pattern 4 (deps/acoplamento) com namespaces limpos
- Há nesting confuso/arquivos no meio da árvore
- Você encontrou orphans em namespaces estendidos
- Prepara domínios com paths coerentes
- Quer apenas leaf como “component”

## Conceitos

### Componente

Identificado pelo **leaf** que contém código:

- Leaf = diretório mais profundo com fontes efetivamente “do componente”
- Raiz entre leafs só serve como **subdomain** organizacional quando tem filhos também com código próprio estruturalmente falando conforme suas regras de modelagem aqui definidas — documente assim que for o caso do projeto

**Regra**: componente válido ⇒ leaf com fontes principais isoladas semanticamente segundo regra do projeto; se namespace intermediário também tem arquivo solto ⇒ orphan problem.

### Root namespace estendido

Namespace que **tem sub-namespace** sob ele carregando mais código:

### Classes órfãs

Fonte em nível intermediário (não-final) onde a convenção espera apenas pastas/componentes folha.

### Estratégias

**Consolidar para cima**: trazer leaves para o pai ⇒ pai vira único leaf conceitual

**Partir para baixo**: mover fontes intermediárias para novos subtrees dedicados ⇒ novos leafs claros

**Shared dedicado**: trecho realmente multi-uso ⇒ `.shared`/pacote próprio conforme modelo de domínio

## Processo de análise

### Fase 1: Mapa da estrutura

Varredura típica:

1. Árvore de namespaces
2. Nós marcados como “raiz extendida”
3. Onde ficam `.js`/`.java`… fora das folhas esperadas

**Exemplo**:

ss.survey/ ← Root namespace (extended)
├── Survey.js ← Orphaned class
├── SurveyProcessor.js ← Orphaned class
└── templates/ ← Component (leaf node)
├── EmailTemplate.js
└── SMSTemplate.js

ss.ticket/ ← Root namespace (extended)
├── Ticket.js ← Orphaned class
├── assign/ ← Component (leaf node)
│ └── TicketAssign.js
└── route/ ← Component (leaf node)
└── TicketRoute.js

```

```

### Fase 2: Identificar classes órfãs

Arquivos-fonte em namespaces “raiz” estendidos (não-folha com ambos: arquivos próprios **e** filhos com código):

1. **Varredura** conta arquivos órfãos
2. **Classificação** Shared / Domain / Mixed
3. **Impacto**: volume, responsabilidade, quem importa

**Exemplo de relatório**:

```markdown
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
```

### Fase 3: Avaliar opções de flattening

Por namespace raiz:

1. **Consolidar para baixo** quando children pequenos/coerentes com o pai
2. **Partir para cima** quando o raiz mistura responsabilidades grandes e distintas
3. **Shared** quando quase tudo é cross-cutting local daquele subtree

**Análise exemplo**:

```markdown
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
```

### Fase 4: Plano de flattening

1. **Escolha** da opção vencedora por namespace
2. **Passos** arquivo a arquivo + atualização de imports
3. **Esforço/risco/testes**

**Exemplo**:

```markdown
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
```

### Fase 5: Execução

Mover/atualizar referências declarar novo layout executar suites de teste regressivo.

## Formato de saída

### Relatório de órfãos

```markdown
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
```

### Problemas de hierarquia

```markdown
## Component Hierarchy Issues

| Root Namespace | Orphaned Files | Leaf Components                 | Issue                | Recommendation   |
| -------------- | -------------- | ------------------------------- | -------------------- | ---------------- |
| ss.survey      | 5              | 1 (templates)                   | Has orphaned classes | Consolidate down |
| ss.ticket      | 45             | 2 (assign, route)               | Large orphaned code  | Split up         |
| ss.reporting   | 0              | 3 (tickets, experts, financial) | No issue             | ✅ OK            |
```

### Plano de flattening (template)

```markdown
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
```

## Checklist de análise

**Mapeamento estrutural**:

- [ ] Mapeadas hierarquias de namespace/path
- [ ] Identificados namespaces raiz estendidos
- [ ] Localizados todos arquivos fonte
- [ ] Folhas marcadas como componentes

**Detecção de órfãos**:

- [ ] Varredura de raizes com arquivo solto no meio
- [ ] Órfãos listados/classificados
- [ ] Dependências avaliadas

**Análise de flatten**:

- [ ] Opção consolidate considerada
- [ ] Split considerado
- [ ] Extração `.shared`/equivalente considerada
- [ ] Escolha final por subtree

**Plano**:

- [ ] Passos arquivo a arquivo quando possível
- [ ] Esforço/risco
- [ ] Prioridade

**Execução**:

- [ ] Movimentação feita atomizadamente
- [ ] Imports/refs atualizados
- [ ] Testes regressivos rodados

## Notas de implementação

### Node.js/Express

Components typically in `services/` directory:

```
services/
├── survey/              ← Root namespace (extended)
│   ├── Survey.js       ← Orphaned class
│   └── templates/      ← Component (leaf node)
│       └── Template.js
```

**Flattening**:

- Consolidate: Move `templates/` files to `survey/`
- Split: Create `survey/create/` and `survey/process/`
- Shared: Create `survey/shared/` for utilities

### Java

Components identified by package structure:

```
com.company.survey       ← Root package (extended)
├── Survey.java         ← Orphaned class
└── templates/          ← Component (leaf package)
    └── Template.java
```

**Flattening**:

- Consolidate: Move `templates` classes to `survey` package
- Split: Create `survey.create` and `survey.process` packages
- Shared: Create `survey.shared` package

### Detecção algorítmica (pseudo)

**Find Root Namespaces with Code**:

```javascript
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
```

**Find Orphaned Classes**:

```javascript
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
```

## Fitness functions

Após saneamento, automatize invariantes tipo:

### Sem arquivo solto entre raiz extendida esperada apenas como pacote grupo

```javascript
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
```

### Todo fonte apenas em leafs aceitos

```javascript
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
```

## Boas práticas

### Faça ✅

- Preserve leaf-only como invariante onde adotarem este modelo mental
- Remova orphans dos intermediários sempre que possível
- Escolha estratégia por coesão funcional real
- Atualize CI/linter path rules se aplicável ao repo

### Evite ❌

- Pastas “meio-componente” vagas indefinidamente
- Imports quebrados pós-move
- Mix incoerente consolidate vs split no mesmo subtree sem rationale

## Patterns frequentes catalogados pela skill

### Pattern 1: Consolidação simples

**Antes**:

```
ss.survey/
├── Survey.js           ← Orphaned
└── templates/          ← Component
    └── Template.js
```

**Depois**:

```
ss.survey/              ← Component (leaf node)
├── Survey.js
└── Template.js
```

### Pattern 2: Split funcional

**Antes**:

```
ss.ticket/              ← Root namespace
├── Ticket.js           ← Orphaned (45 files)
├── assign/             ← Component
└── route/              ← Component
```

**Depois**:

```
ss.ticket/              ← Subdomain
├── maintenance/        ← Component
│   └── Ticket.js
├── completion/        ← Component
│   └── TicketCompletion.js
├── assign/             ← Component
└── route/              ← Component
```

### Pattern 3: Extração de código compartilhado

**Antes**:

```
ss.survey/              ← Root namespace
├── Survey.js           ← Domain code
├── SurveyValidator.js  ← Shared code
└── templates/          ← Component
```

**Depois**:

```
ss.survey/              ← Component
├── Survey.js
└── shared/             ← Component
    └── SurveyValidator.js
```

## Próximos passos

Pós-estrutura limpa aplicar coupling-analysis e domínios/serviços conforme Patterns seguintes neste playbook do monorepo.

## Notas

- Leaf-only melhora navegabilidade mental do repo
- Reorganizar paths tem custo político/org — comunicar stakeholder técnico
- Compartilhados precisam de boundary claro mesmo após mover
