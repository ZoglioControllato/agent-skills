# Habilidade de detecção de componente de domínio comum

Uma habilidade para identificar funcionalidades de domínio duplicadas em componentes e sugerir oportunidades de consolidação para reduzir a duplicação e melhorar a capacidade de manutenção.

## O que essa habilidade faz

Esta habilidade analisa bases de código para:

1. **Identifique padrões de namespace comuns** (por exemplo, `*.notification`, `*.audit`)
2. **Detectar classes compartilhadas** usadas em vários componentes
3. **Analise a similaridade de funcionalidade** entre componentes
4. **Avalie o impacto do acoplamento** antes de recomendar a consolidação
5. **Sugerir abordagens de consolidação** (serviço compartilhado, biblioteca compartilhada ou fusão)
6. **Forneça planos de consolidação** com orientação passo a passo
7. **Calcule métricas de acoplamento** para avaliar a segurança da consolidação

## Quando usar esta habilidade

Esta habilidade é aplicada quando você:

- Peça para encontrar funcionalidades de domínio comuns
- Solicitar identificação de lógica de domínio duplicada
- Precisa de ajuda para detectar classes compartilhadas entre componentes
- Quer analisar oportunidades de consolidação
- Pergunte sobre como reduzir a duplicação de código
- Discutir estratégias de consolidação de componentes
- Planeje mesclar componentes semelhantes

## Principais recursos

### Distinção entre domínio e infraestrutura

Esta habilidade se concentra na **funcionalidade do domínio** (lógica de negócios), não na infraestrutura:

- **Domínio**: Notificação, auditoria, validação, formatação (comum a alguns processos)
- **Infraestrutura**: Logging, métricas, segurança (comum a todos os processos)

### Múltiplas estratégias de detecção

Usa várias abordagens para encontrar funcionalidades comuns:

1. **Detecção de padrão de namespace**: localiza componentes com nomes de nós folha comuns
2. **Detecção de classe compartilhada**: identifica classes usadas em vários componentes
3. **Análise de funcionalidade**: examina o código para verificar a similaridade

### Análise de impacto de acoplamento

Antes de recomendar a consolidação, analisa:

- Níveis atuais de acoplamento (acoplamento aferente - CA)
- Acoplamento estimado após consolidação
- Se a consolidação cria gargalos de acoplamento
- Segurança da consolidação na perspectiva do acoplamento

### Múltiplas Abordagens de Consolidação

Recomenda uma abordagem apropriada com base no contexto:

- **Serviço compartilhado**: para operações complexas e que mudam frequentemente
- **Biblioteca compartilhada**: para utilitários simples e estáveis
- **Mesclagem de componentes**: para funcionalidades altamente relacionadas

## Arquivos incluídos

### SKILL.md (habilidade principal)

O arquivo de habilidade principal contendo:

- Metodologia comum de detecção de padrões de domínio
- Processo de detecção de classe compartilhada
- Análise de similaridade de funcionalidade
- Quadro de avaliação de impacto de acoplamento
- Recomendações de abordagem de consolidação
- Modelos de formato de saída
- Notas de implementação para diferentes idiomas
- Exemplos de funções de fitness

### QUICK-REFERENCE.md (pesquisa rápida)

Referência rápida para cenários comuns:

- Padrões comuns a serem procurados
- Estratégias de detecção
- Verificação rápida da análise de acoplamento
- Árvore de decisão de consolidação
- Modelo de saída

### README.md (este arquivo)

Documentação completa incluindo:

- O que a habilidade faz
- Quando usar
- Exemplos de uso
- Conceitos centrais
- Integração com outras habilidades

## Exemplos de uso

### Exemplo 1: Encontre funcionalidades comuns```

User: "Find common domain functionality across components"

The skill will:

1. Scan component namespaces for common patterns
2. Detect shared classes used across components
3. Analyze functionality similarity
4. Calculate coupling impact
5. Suggest consolidation opportunities

````

**Saída**:```markdown
## Common Domain Components Found

### Notification Functionality

**Components**:

- services/customer/notification
- services/ticket/notification
- services/survey/notification

**Functionality**: All send emails to customers
**Consolidation Feasibility**: ✅ High
**Coupling Impact**: No increase (CA: 5 → 5)

**Recommendation**: Consolidate into `services/notification`
````

### Exemplo 2: Detectar lógica de notificação duplicada```

User: "Are there multiple notification components that should be consolidated?"

The skill will:

1. Find all notification-related components
2. Analyze their functionality and dependencies
3. Calculate coupling impact if consolidated
4. Recommend consolidation approach

````

**Saída**:```markdown
## Notification Components Analysis

**Found 3 notification components**:

- CustomerNotification (used by 2 components)
- TicketNotification (used by 2 components)
- SurveyNotification (used by 1 component)

**Coupling Analysis**:

- Before consolidation: CA = 5 total
- After consolidation: CA = 5 (no increase)
- Verdict: ✅ Safe to consolidate

**Recommendation**: Merge into single NotificationService
````

### Exemplo 3: Analisar Classes Compartilhadas```

User: "Find classes that are shared across multiple components"

The skill will:

1. Scan imports/dependencies in all components
2. Identify classes used by multiple components
3. Classify as domain vs infrastructure
4. Suggest consolidation or shared library approach

````

**Saída**:```markdown
## Shared Classes Found

**Domain Classes** (candidates for consolidation):

- SMTPConnection: Used by 5 components
- AuditLogger: Used by 8 components
- DataFormatter: Used by 3 components

**Recommendation**: Extract to shared service or library
````

## Conceitos Básicos

### Domínio vs Funcionalidade de Infraestrutura

**Funcionalidade de Domínio** (candidatos à consolidação):

- Lógica de processamento de negócios
- Comum a **alguns** processos, não a todos
- Exemplos: notificação do cliente, auditoria de tickets, validação de dados
- Geralmente tem contexto de negócios

**Funcionalidade de Infraestrutura** (não consolidada aqui):

- Preocupações operacionais
- Comum a **todos** processos
- Exemplos: registro em log, autenticação, conexões de banco de dados
- Geralmente técnico, não focado nos negócios

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
- **Usar quando**: lógica que muda frequentemente, operações complexas, precisa de escalonamento independente

**Biblioteca Compartilhada**:

- Código comum empacotado como biblioteca (pacote JAR, DLL, npm)
- Importação de componentes e uso da biblioteca
- **Usar quando**: Funcionalidade estável, utilitários simples, dependência de tempo de compilação aceitável

**Consolidação de Componentes**:

- Mesclar vários componentes em um
- **Usar quando**: Funcionalidade altamente relacionada, baixo impacto de acoplamento

### Análise de acoplamento

**Acoplamento Aferente (CA)**: Número de componentes que dependem deste componente

**Antes da Consolidação**:

- Componente A: CA = 2
- Componente B: CA = 2
- Componente C: CA = 1
- **CA total**: 5

**Após Consolidação**:

- Componente Consolidada: CA = 5
- **CA total**: 5 (igual!)

**Veredicto**: ✅ Seguro para consolidar (sem aumento de acoplamento)

## Como usar

### Início rápido

Solicite análise da sua base de código:```
"Find common domain functionality across components"
"Identify duplicate domain logic that should be consolidated"
"Detect shared classes used across multiple components"
"Analyze consolidation opportunities for common components"

````
### Uso passo a passo

#### 1. Encontre padrões comuns

Comece identificando padrões comuns de namespace:```
User: "Find components with common functionality patterns"
````

Isto irá:

- Digitalize todos os namespaces de componentes
- Identificar nomes comuns de nós folha
- Agrupar componentes semelhantes
- Filtrar padrões de infraestrutura

#### 2. Analise a funcionalidade

Examine se os componentes são realmente semelhantes:```
User: "Are the notification components similar enough to consolidate?"

````
Isto irá:

- Examine o código-fonte de cada componente
- Identificar semelhanças e diferenças
- Avaliar se as diferenças podem ser abstraídas
- Determinar a viabilidade de consolidação

#### 3. Avalie o impacto do acoplamento

Antes de consolidar, verifique o impacto do acoplamento:```
User: "What's the coupling impact of consolidating notification components?"
````

Isto irá:

- Calcular o acoplamento de corrente (CA) para cada componente
- Estimar acoplamento consolidado
- Compare os níveis totais de acoplamento
- Avaliar se a consolidação é segura

#### 4. Obtenha plano de consolidação

Solicite um plano de consolidação acionável:```
User: "Create a plan to consolidate the notification components"

````
Isto irá:

- Recomendar abordagem de consolidação
- Forneça um plano passo a passo
- Estimar os benefícios esperados
- Identificar riscos e mitigação

### Uso Avançado

#### Lista de exclusão personalizada

Exclua certos padrões da análise:```
User: "Find common domain components, but exclude audit components"
````

#### Análise Específica do Idioma

Para análise específica da estrutura:```
User: "Find shared classes in the services/ directory"

````
#### Limite de acoplamento

Defina limites de acoplamento personalizados:```
User: "Only suggest consolidation if coupling increase is less than 3"
````

## Formato de saída

A habilidade gera resultados estruturados:

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

````
### Tabela de oportunidades de consolidação```markdown
## Consolidation Opportunities

| Common Functionality | Components   | Current CA | After CA | Feasibility | Recommendation                |
| -------------------- | ------------ | ---------- | -------- | ----------- | ----------------------------- |
| Notification         | 3 components | 5          | 5        | ✅ High     | Consolidate to shared service |
| Audit                | 3 components | 8          | 12       | ⚠️ Medium   | Consolidate, monitor coupling |
````

### Plano Detalhado de Consolidação```markdown

## Consolidation Plan

### Priority: High

**Notification Components** → `services/notification`

**Steps**:

1. Create new `services/notification` component
2. Move common functionality from 3 components
3. Create abstraction for content/templates
4. Update dependent components
5. Remove old notification components

**Expected Impact**:

- Reduced duplication: 3 components → 1
- Coupling: No increase
- Maintenance: Easier

````
## Integração com outras habilidades

Esta habilidade faz parte de uma sequência de padrões de decomposição:

1. **Identificação e dimensionamento de componentes** → Entenda o que você tem
2. **Análise de dependência de componentes** → Avaliar o acoplamento
3. **Detecção de componente de domínio comum** (esta habilidade) → Encontrar duplicatas
4. **Achatamento de componentes** → Remover classes órfãs
5. **Identificação de Domínio** → Agrupar componentes em domínios
6. **Recomendação de limite de serviço** → Planejar a extração de serviço

Use esta habilidade depois de identificar os componentes e antes de nivelar.

## Instalação

Esta habilidade é instalada no nível do projeto:```
skills/common-domain-component-detection/
````

Isso significa que é:

- **Compartilhado com o repositório**: qualquer pessoa que clonar este repositório obtém a habilidade
- **Controlado por versão**: as alterações são rastreadas no git
- **Específico do projeto**: pode ser personalizado para esta base de código

A habilidade será automaticamente descoberta e usada quando apropriado com base na descrição no frontmatter.

## Personalização

### Para padrões específicos do projeto

Documente os padrões comuns do seu projeto:```
skills/common-domain-component-detection/
└── project-patterns.md # Document project-specific patterns

````
### Para análise específica da estrutura

Adicione padrões de detecção específicos da estrutura:```markdown
## Framework: NestJS

**Common Patterns**:

- `*NotificationService` - Notification components
- `*AuditService` - Audit components
- `*ValidationService` - Validation components
````

### Listas de exclusão personalizadas

Modifique as listas de exclusão em SKILL.md:```markdown

## Custom Exclusions

For this project, exclude:

- `*.util` (infrastructure)
- `*.helper` (infrastructure)
- `*.common` (infrastructure)

````
## Funções de condicionamento físico

Depois de identificar os componentes comuns, crie verificações automatizadas:

### Detecção de padrões comuns```javascript
// Alert if new components with common patterns are created
function checkCommonPatterns(components) {
  const leafNodes = {}
  components.forEach((comp) => {
    const leaf = extractLeafNode(comp.namespace)
    if (!leafNodes[leaf]) leafNodes[leaf] = []
    leafNodes[leaf].push(comp.name)
  })

  return Object.entries(leafNodes)
    .filter(([leaf, comps]) => comps.length > 1)
    .map(([leaf, comps]) => ({
      pattern: leaf,
      components: comps,
      suggestion: 'Consider consolidating',
    }))
}
````

### Alerta de uso de classe compartilhada```javascript

// Alert if class is used by multiple components
function checkSharedClasses(components) {
const classUsage = {}
components.forEach((comp) => {
comp.imports.forEach((imp) => {
if (!classUsage[imp]) classUsage[imp] = []
classUsage[imp].push(comp.name)
})
})

return Object.entries(classUsage)
.filter(([cls, users]) => users.length > 1)
.map(([cls, users]) => ({
class: cls,
usedBy: users,
suggestion: 'Consider extracting to shared component',
}))
}

````
## Melhores práticas

### O que fazer ✅

- Distinguir domínio de funcionalidade de infraestrutura
- Analise o impacto do acoplamento antes de consolidar
- Considere abordagens de serviço compartilhado e biblioteca compartilhada
- Procure padrões de namespace E classes compartilhadas
- Verifique se a funcionalidade é realmente semelhante antes de consolidar
- Calcular métricas de acoplamento (CA) antes e depois
- Monitorar o acoplamento após a consolidação

### O que não fazer ❌

- Não consolide a funcionalidade da infraestrutura (tratada separadamente)
- Não consolide sem analisar o impacto do acoplamento
- Não presuma que todos os padrões comuns devem ser consolidados
- Não ignore as diferenças de funcionalidade
- Não consolidar se o aumento do acoplamento for muito alto
- Não misture domínio e infraestrutura na mesma análise
- Não consolide só porque os nomes são parecidos

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

## Solução de problemas

### Nenhum padrão comum encontrado

**Problema**: a habilidade não encontra padrões comuns

**Solução**:

- Verifique se os componentes seguem os padrões de nomenclatura esperados
- Verifique se os nós folha estão sendo extraídos corretamente
- Considere que sua base de código já pode estar bem consolidada

### Muitas sugestões de consolidação

**Problema**: a habilidade sugere consolidar tudo

**Solução**:

- Revise a análise de impacto do acoplamento
- Verifique se as sugestões levam em conta o aumento do acoplamento
- Verifique a infraestrutura versus a classificação do domínio

### A consolidação aumenta muito o acoplamento

**Problema**: a consolidação cria um gargalo de acoplamento

**Solução**:

- Considere biblioteca compartilhada em vez de serviço compartilhado
- Divida a consolidação em etapas menores
- Mantenha alguma duplicação se isso reduzir o acoplamento

## Referências

Esta habilidade é baseada em:

- **Arquitetura de software: as partes difíceis** por Neal Ford, Mark Richards, Pramod Sadalage, Zhamak Dehghani
- **Padrão de componentes de domínio comuns** (Capítulo 5)
- **Fundamentos de Arquitetura de Software** por Mark Richards e Neal Ford

## Contribuindo

Para melhorar esta habilidade:

1. Adicione padrões de detecção específicos do idioma
2. Expanda a detecção de componentes específicos da estrutura
3. Adicione mais exemplos de abordagem de consolidação
4. Documente novos antipadrões ou sinais de alerta
5. Compartilhe estudos de caso do mundo real

## Versão

**Versão**: 1.0.0
**Criado**: 05/02/2026
**Baseado em**: Padrão de componentes de domínio comuns de "Arquitetura de software: as partes difíceis"

---

## Início rápido

Para usar esta habilidade imediatamente:```
User: "Find common domain functionality across components"
User: "Identify duplicate domain logic that should be consolidated"
User: "Detect shared classes used across multiple components"
User: "Analyze consolidation opportunities for common components"
````

Essa habilidade será aplicada automaticamente para fornecer análises abrangentes com recomendações de consolidação acionáveis.
