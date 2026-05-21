# Identificação de componentes e habilidade de dimensionamento

Uma habilidade para identificar componentes arquitetônicos em bases de código e calcular métricas de tamanho para apoiar o planejamento de decomposição e esforços de migração.

## O que essa habilidade faz

Esta habilidade analisa bases de código para:

1. **Identificar componentes arquitetônicos** (blocos de construção lógicos) de estruturas de diretório/namespace
2. **Calcule métricas de tamanho** usando instruções (não linhas de código) para uma comparação precisa
3. **Detecte componentes superdimensionados** que excedam limites ou desvios padrão
4. **Identifique componentes subdimensionados** que podem precisar de consolidação
5. **Gere tabelas de inventário de componentes** com estatísticas de tamanho
6. **Forneça recomendações** para divisão

grandes componentes ou consolidando pequenos 7. **Avaliar a viabilidade de decomposição** com base na distribuição do tamanho dos componentes

## Quando usar esta habilidade

Esta habilidade é aplicada quando você:

- Peça para analisar a estrutura ou organização da base de código
- Solicitar identificação de componentes ou análise de dimensionamento
- Precisa de ajuda para planejar a decomposição monolítica
- Deseja encontrar componentes superdimensionados que precisam ser divididos
- Pergunte sobre padrões de decomposição arquitetônica
- Solicitar inventário de componentes para planejamento de migração
- Discutir métricas ou estatísticas de base de código

## Principais recursos

### Agnóstico de linguagem e estrutura

Esta habilidade funciona com **qualquer base de código** em qualquer idioma:

- **Node.js/Express**: Analisa diretórios `services/`, `routes/`, `models/`
- **Java**: analisa estruturas de pacotes (por exemplo, `com.company.domain.service`)
- **Python**: analisa caminhos de módulos (por exemplo, `app/billing/payment`)
- **C#/.NET**: analisa estruturas de namespace
- **Qualquer idioma**: Funciona com padrões de diretório/namespace

### Métricas de tamanho precisas

Usa **instruções** (não linhas de código) para comparação precisa de tamanho:

- Considera a complexidade do código, não a formatação
- Mais confiável que a contagem de linhas
- Consistente em diferentes estilos de codificação
- Análise de desvio padrão para detecção de valores discrepantes

### Resultado acionável

Fornece análises concretas e acionáveis:

- Tabelas de inventário de componentes com métricas de tamanho
- Visualizações de distribuição de tamanho
- Identificação de componentes superdimensionados com recomendações de divisão
- Identificação de componentes subdimensionados com sugestões de consolidação
- Código de função de fitness para governança automatizada

## Arquivos incluídos

### SKILL.md (habilidade principal)

O arquivo de habilidade principal contendo:

- Metodologia de identificação de componentes
- Processo de cálculo de tamanho (declarações, arquivos, porcentagens)
- Estrutura de análise de desvio padrão
- Modelos de formato de saída
- Notas de implementação para diferentes idiomas
- Exemplos de funções de fitness
- Lista de verificação de análise completa

### QUICK-REFERENCE.md (pesquisa rápida)

Referência rápida para cenários comuns:

- Regras de definição de componentes
- Diretrizes de limite de tamanho
- Etapas de análise rápida
- Padrões de diretório comuns
- Modelo de saída

### README.md (este arquivo)

Documentação completa incluindo:

- O que a habilidade faz
- Quando usar
- Exemplos de uso
- Conceitos centrais
- Instalação e personalização

## Exemplos de uso

### Exemplo 1: Identificar todos os componentes```

User: "Identify and size all components in this codebase"

The skill will:

1. Map directory/namespace structures
2. Identify leaf nodes (components)
3. Count statements and files per component
4. Calculate percentages and statistics
5. Generate component inventory table
6. Flag oversized/undersized components

````

**Saída**:```markdown
## Component Inventory

| Component Name      | Namespace                    | Statements | Files | Percent | Status       |
| ------------------- | ---------------------------- | ---------- | ----- | ------- | ------------ |
| BillingService      | services/BillingService      | 4,312      | 23    | 5%      | ✅ OK        |
| ReportingService    | services/ReportingService    | 27,765     | 162   | 33%     | ⚠️ Too Large |
| NotificationService | services/NotificationService | 1,433      | 7     | 2%      | ✅ OK        |

## Recommendations

- ReportingService (33%) should be split into smaller components
````

### Exemplo 2: Encontre componentes superdimensionados```

User: "Find components that are too large and need splitting"

The skill will:

1. Calculate mean and standard deviation
2. Identify components >2 std dev or >10% threshold
3. Analyze functional areas within large components
4. Suggest specific splits
5. Estimate resulting component sizes

````

**Saída**:```markdown
## Oversized Components

**ReportingService** (33% - 27,765 statements)

- Exceeds 10% threshold
- Contains multiple functional areas:
  - Ticket Reports (8,000 statements)
  - Expert Reports (9,000 statements)
  - Financial Reports (10,000 statements)
  - Shared utilities (765 statements)

**Recommendation**: Split into:

1. ReportingShared (shared utilities)
2. TicketReportsService
3. ExpertReportsService
4. FinancialReportsService
````

### Exemplo 3: Análise de tamanho de componente```

User: "Analyze component sizes and distribution"

The skill will:

1. Calculate all size metrics
2. Generate size distribution
3. Identify outliers
4. Provide summary statistics
5. Create recommendations

````

**Saída**:```markdown
## Size Analysis Summary

**Total Components**: 18
**Total Statements**: 82,931
**Mean Component Size**: 4,607 statements
**Standard Deviation**: 5,234 statements

**Distribution**:

- Oversized (>2 std dev): 1 component
- Well-sized (within 1-2 std dev): 15 components
- Undersized (<1 std dev): 2 components
````

## Conceitos Básicos

### Definição de componente

Um **componente** é um bloco de construção arquitetônico que:

- Tem função e responsabilidade bem definidas
- É identificado por um **nó folha** na estrutura de diretório/namespace
- Contém arquivos de código-fonte agrupados
- Executa funcionalidades específicas de negócios ou infraestrutura

**Regra principal**: Os componentes são **apenas nós folha**. Se um namespace for estendido (por exemplo, `serviços/faturamento` → `serviços/faturamento/pagamento`), o pai se torna um **subdomínio**, não um componente.

### Métricas de tamanho

| Métrica         | Descrição                                                          | Finalidade                                              |
| --------------- | ------------------------------------------------------------------ | ------------------------------------------------------- |
| **Declarações** | Contar instruções executáveis ​​(terminadas por `;` ou nova linha) | Medida precisa de tamanho, leva em conta a complexidade |
| **Arquivos**    | Contar arquivos de origem no componente                            |

| Indicador de complexidade |
| **Porcentagem** | `(component_statements / total_statements) * 100` | Tamanho relativo na base de código |
| **Desenvolvimento padrão** | Desvio padrão do tamanho médio dos componentes | Detecção de valores discrepantes |

### Limites de tamanho

Os limites variam de acordo com o tamanho do aplicativo:

| Tamanho do aplicativo     | Limite superdimensionado | Notas                                        |
| ------------------------- | ------------------------ | -------------------------------------------- |
| Pequeno (<10 componentes) | >30% da base de código   | Menos componentes, maior variância aceitável |
| Médio (10-20 componentes) | >15% da base de código   | Limiar equilibrado                           |
| Grande (>20 componentes)  | >10% da base de código   | Mo                                           |

re componentes, menor variância esperada |

**Regra de desvio padrão**: Componentes >2 desvios padrão da média são considerados superdimensionados.

### Status do Componente

- ✅ **OK**: Dentro de 1-2 desvio padrão da média, tamanho apropriado
- ⚠️ **Muito grande**: >2 desvio padrão acima da média ou excede o limite percentual
- 🔍 **Muito pequeno**: <1 std dev abaixo da média ou <1% da base de código

## Como usar

### Início rápido

Solicite análise da sua base de código:```
"Identify and size all components in this codebase"
"Find oversized components that need splitting"
"Create a component inventory for decomposition planning"
"Analyze component size distribution"

````
### Uso passo a passo

#### 1. Análise inicial

Comece com um inventário completo de componentes:```
User: "Identify all components and calculate their sizes"
````

Isto irá:

- Mapeie sua estrutura de diretórios
- Identificar todos os componentes (nós folha)
- Calcular métricas de tamanho
- Gerar tabela de inventário

#### 2. Identificar problemas

Encontre componentes que precisam de atenção:```
User: "Which components are too large and need splitting?"

````
Isto irá:

- Calcular estatísticas (média, std dev)
- Sinalizar componentes superdimensionados
- Analisar áreas funcionais
- Sugerir divisões específicas

#### 3. Obtenha recomendações

Solicite recomendações acionáveis:```
User: "What should I do about oversized components?"
````

Isto irá:

- Priorizar recomendações
- Sugerir divisões de componentes
- Estimar tamanhos resultantes
- Crie histórias de arquitetura

#### 4. Monitore o progresso

Acompanhe as mudanças ao longo do tempo:```
User: "Has component X grown too large since last analysis?"

````
Isto irá:

- Compare os tamanhos atuais e anteriores
- Verifique os limites
- Alerta se os limites forem excedidos

### Uso Avançado

#### Limites personalizados

Se você tiver requisitos de tamanho específicos:```
User: "Identify components larger than 15% of the codebase"
````

#### Análise Específica do Idioma

Para análise específica da estrutura:```
User: "Analyze components in the services/ directory"

````
#### Agrupamento de Componentes

Analise domínios específicos:```
User: "Size all components in the billing domain"
````

## Formato de saída

A habilidade gera resultados estruturados:

### Tabela de inventário de componentes```markdown

## Component Inventory

| Component Name   | Namespace/Path            | Statements | Files | Percent | Status       |
| ---------------- | ------------------------- | ---------- | ----- | ------- | ------------ |
| BillingService   | services/BillingService   | 4,312      | 23    | 5%      | ✅ OK        |
| ReportingService | services/ReportingService | 27,765     | 162   | 33%     | ⚠️ Too Large |

````
### Resumo da análise de tamanho```markdown
## Size Analysis Summary

**Total Components**: 18
**Total Statements**: 82,931
**Mean Component Size**: 4,607 statements
**Standard Deviation**: 5,234 statements

**Oversized Components** (>2 std dev or >10%):

- ReportingService (33% - 27,765 statements)
````

### Recomendações```markdown

## Recommendations

### High Priority: Split Large Components

**ReportingService** (33% of codebase):

- **Current**: Single component with 27,765 statements
- **Issue**: Too large, contains multiple functional areas
- **Recommendation**: Split into:
  1. ReportingShared (common utilities)
  2. TicketReportsService
  3. ExpertReportsService
  4. FinancialReportsService
- **Expected Result**: Each component ~7-9% of codebase

````
## Integração com outras habilidades

Esta habilidade faz parte de uma sequência de padrões de decomposição:

1. **Identificação e dimensionamento de componentes** (esta habilidade) → Entenda o que você tem
2. **Análise de Dependência de Componentes** → Avaliar o acoplamento e a viabilidade
3. **Detecção de componente de domínio comum** → Encontre funcionalidade duplicada
4. **Achatamento de componentes** → Remover classes órfãs
5. **Identificação de Domínio** → Agrupar componentes em domínios
6. **Recomendação de limite de serviço** → Planejar a extração de serviço

Use esta habilidade primeiro para estabelecer uma linha de base antes de aplicar outros padrões de decomposição.

## Instalação

Esta habilidade é instalada no nível do projeto:```
skills/component-identification-sizing/
````

Isso significa que é:

- **Compartilhado com o repositório**: qualquer pessoa que clonar este repositório obtém a habilidade
- **Controlado por versão**: as alterações são rastreadas no git
- **Específico do projeto**: pode ser personalizado para esta base de código

A habilidade será automaticamente descoberta e usada quando apropriado com base na descrição no frontmatter.

## Personalização

### Para padrões específicos do projeto

Se o seu projeto tiver padrões de componentes específicos, documente-os:```
skills/component-identification-sizing/
└── project-patterns.md # Document project-specific component patterns

````
### Para análise específica da estrutura

Adicione padrões de detecção específicos da estrutura:```markdown
## Framework: NestJS

**Component Pattern**: `@Injectable()` classes in `services/` directory
**Module Pattern**: `@Module()` decorator groups components
**Controller Pattern**: `@Controller()` in `controllers/` directory
````

### Limites personalizados

Modifique os limites em SKILL.md para o seu projeto:```markdown

## Custom Thresholds

For this project:

- Oversized: >12% of codebase (instead of default 10%)
- Undersized: <0.5% of codebase (instead of default 1%)

````
## Funções de condicionamento físico

Após identificar os componentes, crie verificações automatizadas:

### Verificação do tamanho do componente```javascript
// Alert if component exceeds threshold
function checkComponentSize(component, totalStatements, threshold = 0.1) {
  const percent = component.statements / totalStatements
  if (percent > threshold) {
    return {
      component: component.name,
      percent: (percent * 100).toFixed(1),
      issue: 'Exceeds size threshold',
    }
  }
}
````

### Verificação do desvio padrão```javascript

// Alert if component is >2 std dev from mean
function checkStandardDeviation(component, mean, stdDev) {
const deviation = Math.abs(component.statements - mean) / stdDev
if (deviation > 2) {
return {
component: component.name,
deviation: deviation.toFixed(2),
issue: 'More than 2 standard deviations from mean',
}
}
}

````
## Melhores práticas

### O que fazer ✅

- Use instruções, não linhas de código
- Identificar componentes apenas como nós folha
- Calcular porcentagem e desvio padrão
- Considere o tamanho do aplicativo ao definir limites
- Namespace/caminho do documento para cada componente
- Crie uma distribuição visual de tamanho, se possível
- Monitore o crescimento dos componentes ao longo do tempo

### O que não fazer ❌

- Não conte arquivos de teste no tamanho do componente
- Não trate os diretórios pais como componentes
- Não use limites fixos sem considerar o tamanho do aplicativo
- Não ignore componentes pequenos (podem precisar de consolidação)
- Não pule o cálculo do desvio padrão
- Não misture componentes de infraestrutura e domínio na mesma análise

## Validação

Para verificar se a habilidade funciona corretamente, tente:```
User: "Identify and size all components in this codebase"
````

A habilidade deve:

1. Leia o arquivo SKILL.md
2. Mapear estruturas de diretório/namespace
3. Identifique nós folha (componentes)
4. Calcule métricas de tamanho
5. Gerar tabela de inventário de componentes
6. Sinalizar componentes superdimensionados/subdimensionados
7. Forneça recomendações

## Solução de problemas

### Componentes não identificados

**Problema**: os componentes não foram encontrados na sua estrutura

**Solução**:

- Verifique se os diretórios seguem os padrões esperados
- Verifique se os arquivos de origem existem nos diretórios dos componentes
- Certifique-se de que os nós folha contenham arquivos de código reais

### Cálculos de tamanho incorretos

**Problema**: as métricas de tamanho parecem erradas

**Solução**:

- Verifique se a lógica de contagem de instruções corresponde ao seu idioma
- Verifique se os arquivos de teste estão sendo excluídos
- Certifique-se de que todos os arquivos de origem estejam sendo contados

### Limites muito rígidos/frouxos

**Problema**: muitos/poucos componentes sinalizados

**Solução**:

- Ajuste os limites em SKILL.md para o tamanho do seu aplicativo
- Use desvio padrão em vez de porcentagens fixas
- Considere seus objetivos específicos de decomposição

## Referências

Esta habilidade é baseada em:

- **Arquitetura de software: as partes difíceis** por Neal Ford, Mark Richards, Pramod Sadalage, Zhamak Dehghani
- **Padrões de decomposição baseados em componentes** (Capítulo 5)
- **Fundamentos de Arquitetura de Software** por Mark Richards e Neal Ford

## Contribuindo

Para melhorar esta habilidade:

1. Adicione padrões de contagem de instruções específicos do idioma
2. Expanda a detecção de componentes específicos da estrutura
3. Adicione mais opções de visualização de distribuição de tamanho
4. Documente novos antipadrões ou sinais de alerta
5. Compartilhe estudos de caso do mundo real

## Versão

**Versão**: 1.0.0  
**Criado**: 05/02/2026  
**Baseado em**: Padrões de decomposição baseados em componentes de "Arquitetura de software: as partes difíceis"

---

## Início rápido

Para usar esta habilidade imediatamente:```
User: "Identify and size all components in my codebase"
User: "Find oversized components that need splitting"
User: "Create a component inventory for decomposition planning"
User: "Analyze component size distribution"

```
Essa habilidade será aplicada automaticamente para fornecer análises abrangentes com recomendações práticas.
```
