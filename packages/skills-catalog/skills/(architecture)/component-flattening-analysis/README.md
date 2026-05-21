# Habilidade de análise de nivelamento de componentes

Uma habilidade para identificar e corrigir problemas de hierarquia de componentes, detectando classes órfãs em namespaces raiz e garantindo que os componentes existam apenas como nós folha.

## O que essa habilidade faz

Esta habilidade analisa bases de código para:

1. **Mapear estrutura de componentes** para identificar hierarquias de namespace
2. **Detectar classes órfãs** em namespaces raiz
3. **Identificar aninhamento de componentes** (componentes construídos em componentes)
4. **Analisar opções de nivelamento** (consolidar vs dividir vs extrair compartilhada)
5. **Crie planos de nivelamento** com etapas de refatoração
6. **Certifique-se de que os componentes sejam apenas nós folha**
7. **Remover violações de hierarquia** da estrutura do componente

## Quando usar esta habilidade

Esta habilidade é aplicada quando você:

- Peça para encontrar classes órfãs em namespaces raiz
- Solicitar análise de nivelamento de componentes
- Necessidade de identificar problemas de hierarquia de componentes
- Quer limpar a estrutura do componente
- Pergunte sobre aninhamento ou hierarquia de componentes
- Planeje preparar componentes para agrupamento de domínios
- Discutir a limpeza da estrutura do componente

## Principais recursos

### Detecção de classe órfã

Identifica arquivos de origem em namespaces raiz:

- Verifica namespaces raiz em busca de arquivos de origem
- Classifica classes órfãs (compartilhadas/domínio/misto)
- Avalia impacto e dependências
- Sinaliza violações de hierarquia

### Análise de Estratégia de Achatamento

Analisa várias opções de nivelamento:

1. **Consolidar para baixo**: mover o código folha para o namespace raiz
2. **Dividir**: Mova o código raiz para novos nós folha
3. **Extrair Compartilhado**: Mova o código compartilhado para o componente `.shared`

### Validação da estrutura do componente

Garante que os componentes sigam as regras:

- Os componentes existem apenas como nós folha
- Nenhuma classe órfã em namespaces raiz
- Limites claros dos componentes
- Hierarquia de namespace adequada

## Arquivos incluídos

### SKILL.md (habilidade principal)

O arquivo de habilidade principal contendo:

- Metodologia de detecção de hierarquia de componentes
- Processo de identificação de classe órfã
- Análise de estratégia de nivelamento
- Criação do plano de refatoração
- Modelos de formato de saída
- Notas de implementação para diferentes idiomas
- Exemplos de funções de fitness

### QUICK-REFERENCE.md (pesquisa rápida)

Referência rápida para cenários comuns:

- Regras de definição de componentes
- Detecção de classe órfã
- Estratégias de achatamento
- Padrões comuns
- Modelo de saída

### README.md (este arquivo)

Documentação completa incluindo:

- O que a habilidade faz
- Quando usar
- Exemplos de uso
- Conceitos centrais
- Integração com outras habilidades

## Exemplos de uso

### Exemplo 1: Encontre classes órfãs```

User: "Find orphaned classes in root namespaces"

The skill will:

1. Map component namespace structure
2. Identify root namespaces
3. Find source files in root namespaces
4. Classify orphaned classes
5. Create report with recommendations

````

**Saída**:```markdown
## Orphaned Classes Analysis

### Root Namespace: ss.survey

**Orphaned Files** (5 files):

- Survey.js (domain code)
- SurveyProcessor.js (domain code)
- SurveyValidator.js (shared code)

**Issue**: Root namespace contains code but is extended by leaf component

**Recommendation**: Consolidate templates into root namespace
````

### Exemplo 2: Achatar componentes```

User: "Flatten component hierarchies"

The skill will:

1. Identify all hierarchy issues
2. Analyze flattening options
3. Select best strategy for each
4. Create refactoring plan
5. Estimate effort

````

**Saída**:```markdown
## Flattening Plan

### Priority: High

**ss.survey** → Consolidate Down

- Move 7 files from templates to root
- Effort: 2-3 days
- Risk: Low

**ss.ticket** → Split Up

- Create maintenance, completion, shared components
- Effort: 1 week
- Risk: Medium
````

### Exemplo 3: Análise da Estrutura de Componentes```

User: "Analyze component structure for hierarchy issues"

The skill will:

1. Map namespace hierarchies
2. Identify root namespaces with code
3. Find components built on components
4. Flag violations
5. Provide recommendations

````

**Saída**:```markdown
## Component Hierarchy Issues

| Root Namespace | Orphaned Files | Leaf Components   | Issue                | Recommendation   |
| -------------- | -------------- | ----------------- | -------------------- | ---------------- |
| ss.survey      | 5              | 1 (templates)     | Has orphaned classes | Consolidate down |
| ss.ticket      | 45             | 2 (assign, route) | Large orphaned code  | Split up         |
````

## Conceitos Básicos

### Definição de componente

Um **componente** é identificado por um **nó folha** na estrutura de diretório/namespace:

- **Leaf Node**: diretório mais profundo contendo arquivos de origem
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

### Estratégias de achatamento

**Consolidar **:

- Mova o código dos nós folha para o namespace raiz
- Torna o namespace raiz o componente
- **Usar quando**: os nós folha são pequenos e têm funcionalidade relacionada

**Dividir**:

- Mova o código do namespace raiz para novos nós folha
- Cria vários componentes a partir do root
- **Usar quando**: o namespace raiz tem áreas funcionais distintas

**Extrato Compartilhado**:

- Mover o código compartilhado para o componente `.shared`
- Mantenha o código de domínio na raiz ou dividido
- **Usar quando**: o namespace raiz possui utilitários compartilhados

## Como usar

### Início rápido

Solicite análise da sua base de código:```
"Find orphaned classes in root namespaces"
"Flatten component hierarchies"
"Identify components that need flattening"
"Analyze component structure for hierarchy issues"

````
### Uso passo a passo

#### 1. Encontre classes órfãs

Comece identificando problemas de hierarquia:```
User: "Find orphaned classes in root namespaces"
````

Isto irá:

- Estrutura do componente do mapa
- Identificar namespaces raiz
- Encontre aulas órfãs
- Classificar e avaliar o impacto

#### 2. Analise as opções de nivelamento

Determine a melhor estratégia:```
User: "What flattening strategy should I use for ss.survey?"

````
Isto irá:

- Analisar opção de consolidação
- Analisar opção de divisão
- Analisar extração de código compartilhado
- Recomendar a melhor abordagem

#### 3. Crie um plano de nivelamento

Obtenha um plano de refatoração acionável:```
User: "Create a plan to flatten component hierarchies"
````

Isto irá:

- Selecione estratégias de nivelamento
- Criar etapas de refatoração
- Estimar esforço e risco
- Priorize o trabalho

#### 4. Execute o nivelamento

Execute a refatoração:```
User: "Flatten the survey component hierarchy"

````
Isto irá:

- Mova arquivos para namespaces de destino
- Atualizar importações e referências
- Atualizar declarações de namespace
- Verifique as alterações

### Uso Avançado

#### Regras de nivelamento personalizadas

Especifique preferências de nivelamento:```
User: "Flatten components, preferring consolidation over splitting"
````

#### Análise Específica de Namespace

Concentre-se no namespace específico:```
User: "Analyze ss.ticket namespace for flattening"

````
#### Detecção de código compartilhado

Identifique padrões de código compartilhado:```
User: "Find shared code that should be extracted to .shared components"
````

## Formato de saída

A habilidade gera resultados estruturados:

### Relatório de turmas órfãs```markdown

## Orphaned Classes Analysis

### Root Namespace: ss.survey

**Status**: ⚠️ Has Orphaned Classes

**Orphaned Files** (5 files):

- Survey.js (domain code)
- SurveyProcessor.js (domain code)
- SurveyValidator.js (shared code)

**Leaf Components**:

- ss.survey.templates (7 files)

**Recommendation**: Consolidate templates into root namespace

````
### Problemas de hierarquia de componentes```markdown
## Component Hierarchy Issues

| Root Namespace | Orphaned Files | Leaf Components   | Issue                | Recommendation   |
| -------------- | -------------- | ----------------- | -------------------- | ---------------- |
| ss.survey      | 5              | 1 (templates)     | Has orphaned classes | Consolidate down |
| ss.ticket      | 45             | 2 (assign, route) | Large orphaned code  | Split up         |
````

### Plano de nivelamento```markdown

## Flattening Plan

### Priority: High

**ss.survey** → Consolidate Down

- Move 7 files from templates to root
- Update imports
- Remove templates directory
- Effort: 2-3 days
- Risk: Low

````
## Integração com outras habilidades

Esta habilidade faz parte de uma sequência de padrões de decomposição:

1. **Identificação e dimensionamento de componentes** → Entenda o que você tem
2. **Detecção de componente de domínio comum** → Encontrar duplicatas
3. **Achatamento de componentes** (esta habilidade) → Estrutura limpa
4. **Análise de Dependência de Componentes** → Avaliar o acoplamento
5. **Identificação e agrupamento de domínios** → Agrupar em domínios
6. **Planejamento de decomposição** → Coordene tudo

Use esta habilidade depois de reunir componentes comuns e antes da análise de dependência.

## Instalação

Esta habilidade é instalada no nível do projeto:```
skills/component-flattening-analysis/
````

Isso significa que é:

- **Compartilhado com o repositório**: qualquer pessoa que clonar este repositório obtém a habilidade
- **Controlado por versão**: as alterações são rastreadas no git
- **Específico do projeto**: pode ser personalizado para esta base de código

A habilidade será automaticamente descoberta e usada quando apropriado com base na descrição no frontmatter.

## Personalização

### Para padrões específicos do projeto

Documente os padrões de componentes do seu projeto:```
skills/component-flattening-analysis/
└── project-patterns.md # Document project-specific patterns

````
### Para análise específica da estrutura

Adicione padrões específicos da estrutura:```markdown
## Framework: NestJS

**Component Pattern**: `@Injectable()` classes in modules
**Flattening**: Move nested module classes to parent module
**Shared Code**: Extract to `shared/` directory
````

### Regras de nivelamento personalizadas

Modifique as preferências de nivelamento em SKILL.md:```markdown

## Custom Flattening Rules

For this project:

- Always prefer consolidation over splitting
- Extract shared code to `.shared` components
- Maximum 10 files per component before splitting

````
## Funções de condicionamento físico

Após nivelar os componentes, crie verificações automatizadas:

### Nenhum código-fonte em namespaces raiz```javascript
// Alert if source code exists in root namespace
function checkRootNamespaceCode(namespaces, sourceFiles) {
  const violations = []

  namespaces.forEach((ns) => {
    const hasChildren = namespaces.some((n) => n.startsWith(ns + '.') || n.startsWith(ns + '/'))

    if (hasChildren) {
      const files = sourceFiles.filter((f) => f.namespace === ns)
      if (files.length > 0) {
        violations.push({
          namespace: ns,
          files: files.map((f) => f.name),
          issue: 'Root namespace contains source files',
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

const leafNodes = namespaces.filter((ns) => {
return !namespaces.some((n) => n.startsWith(ns + '.') || n.startsWith(ns + '/'))
})

sourceFiles.forEach((file) => {
if (!leafNodes.includes(file.namespace)) {
violations.push({
file: file.name,
namespace: file.namespace,
issue: 'Source file not in leaf node',
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
├── completion/ ← Component
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

````
## Solução de problemas

### Muitas classes órfãs

**Problema**: muitas classes órfãs foram encontradas

**Solução**:

- Priorizar por impacto
- Comece com namespaces de alta prioridade
- Achatar incrementalmente
- Considere dividir grandes namespaces raiz

### Estratégia de achatamento pouco clara

**Problema**: não tenho certeza de qual estratégia usar

**Solução**:

- Analisar similaridade de funcionalidade
- Considere o tamanho do componente
- Avaliar o impacto do acoplamento
- Escolha a abordagem mais simples que funcione

### Quebrando referências

**Problema**: mover arquivos interrompe as importações

**Solução**:

- Atualize todas as importações antes de mover
- Use ferramentas de refatoração IDE
- Execute testes após cada movimento
- Atualizar declarações de namespace

## Referências

Esta habilidade é baseada em:

- **Arquitetura de software: as partes difíceis** por Neal Ford, Mark Richards, Pramod Sadalage, Zhamak Dehghani
- **Padrão de componentes nivelados** (Capítulo 5)
- **Fundamentos de Arquitetura de Software** por Mark Richards e Neal Ford

## Contribuindo

Para melhorar esta habilidade:

1. Adicione padrões de nivelamento específicos do idioma
2. Expanda a detecção de componentes específicos da estrutura
3. Adicione mais exemplos de estratégias de nivelamento
4. Documente novos antipadrões ou sinais de alerta
5. Compartilhe estudos de caso do mundo real

## Versão

**Versão**: 1.0.0
**Criado**: 05/02/2026
**Baseado em**: Padrão de componentes achatados de "Arquitetura de software: as partes difíceis"

---

## Início rápido

Para usar esta habilidade imediatamente:```
User: "Find orphaned classes in root namespaces"
User: "Flatten component hierarchies"
User: "Identify components that need flattening"
User: "Analyze component structure for hierarchy issues"
````

Essa habilidade será aplicada automaticamente para fornecer análises e recomendações abrangentes de nivelamento de componentes.
