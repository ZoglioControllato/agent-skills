# Identificação e dimensionamento de componentes

Esta habilidade identifica componentes arquitetônicos (blocos de construção lógicos) em uma base de código e calcula métricas de tamanho para avaliar a viabilidade de decomposição e identificar componentes superdimensionados.

## Como usar

### Início rápido

Solicite análise da sua base de código:

- **"Identificar e dimensionar todos os componentes nesta base de código"**
- **"Encontre componentes superdimensionados que precisam ser divididos"**
- **"Criar um inventário de componentes para planejamento de decomposição"**
- **"Analisar distribuição de tamanho de componente"**

### Exemplos de uso

**Exemplo 1: Análise Completa**

```
User: "Identify and size all components in this codebase"

The skill will:
1. Map directory/namespace structures
2. Identify all components (leaf nodes)
3. Calculate size metrics (statements, files, percentages)
4. Generate component inventory table
5. Flag oversized/undersized components
6. Provide recommendations
```

**Exemplo 2: Encontre componentes superdimensionados**

```
User: "Which components are too large?"

The skill will:
1. Calculate mean and standard deviation
2. Identify components >2 std dev or >10% threshold
3. Analyze functional areas within large components
4. Suggest specific splits with estimated sizes
```

**Exemplo 3: Análise do tamanho do componente**

```
User: "Analyze component sizes and distribution"

The skill will:
1. Calculate all size metrics
2. Generate size distribution summary
3. Identify outliers
4. Provide statistics and recommendations
```

### Processo passo a passo

1. **Análise inicial**: comece com o inventário completo de componentes
2. **Identificar problemas**: Encontre componentes que precisam de atenção
3. **Obter recomendações**: solicite sugestões de divisão/consolidação acionáveis
4. **Monitore o progresso**: acompanhe o crescimento dos componentes ao longo do tempo

## Quando usar

Aplique esta habilidade quando:

- Iniciando um esforço de decomposição monolítica
- Avaliação da estrutura e organização da base de código
- Identificar componentes que são muito grandes ou muito pequenos
- Criação de inventário de componentes para planejamento de migração
- Analisando a distribuição de código entre componentes
- Preparação para padrões de decomposição baseados em componentes

## Conceitos Básicos

### Definição de componente

Um **componente** é um bloco de construção arquitetônico que:

- Tem função e responsabilidade bem definidas
- É identificado por um namespace, estrutura de pacote ou caminho de diretório
- Contém arquivos de código-fonte (classes, funções, módulos) agrupados
- Executa funcionalidades específicas de negócios ou infraestrutura

**Regra principal**: Os componentes são identificados por **nós folha** em estruturas de diretório/namespace. Se um namespace for estendido (por exemplo, `serviços/faturamento` estendido para `serviços/faturamento/pagamento`), o pai se torna um **subdomínio**, não um componente.

### Métricas de tamanho

**Declarações** (não linhas de código):

- Contar instruções executáveis terminadas por ponto e vírgula ou novas linhas
- Mais preciso do que linhas de código para comparação de tamanho
- Considera a complexidade do código, não a formatação

**Indicadores de tamanho de componente**:

- **Porcentagem da base de código**: instruções de componentes/total de instruções
- **Contagem de arquivos**: Número de arquivos de origem no componente
- **Desvio padrão**: Distância do tamanho médio do componente

## Processo de análise

### Fase 1: Identificar Componentes

Verifique a estrutura do diretório da base de código:

1. **Mapear estrutura de diretório/namespace**
   - Para Node.js: `services/`, `routes/`, `models/`, `utils/`
   - Para Java: estrutura do pacote (por exemplo, `com.company.domain.service`)
   - Para Python: caminhos de módulo (por exemplo, `app/billing/payment`)

2. **Identificar nós folha**
   - Componentes são os diretórios mais profundos que contêm arquivos de origem
   - Exemplo: `services/BillingService/` é um componente
   - Exemplo: `services/BillingService/payment/` estende-o, tornando `BillingService` um subdomínio

3. **Criar inventário de componentes**
   - Liste cada componente com seu namespace/caminho
   - Observe quaisquer namespaces pais (subdomínios)

### Fase 2: Calcular métricas de tamanho

Para cada componente:

1. **Declarações de contagem**
   - Analisar arquivos de origem no diretório de componentes
   - Contar instruções executáveis (não apenas comentários, linhas em branco ou declarações)
   - Soma de todos os arquivos no componente

2. **Contar arquivos**
   - Total de arquivos de origem (`.js`, `.ts`, `.java`, `.py`, etc.)
   - Excluir arquivos de teste, arquivos de configuração, documentação

3. **Calcular porcentagem**

   ```
   componente_percent = (component_statements / total_statements) * 100
   ```

4. **Calcular estatísticas**
   - Tamanho médio do componente: `total_statements / number_of_components`
   - Desvio padrão: `sqrt(soma((tamanho - média)^2) / (n - 1))`
   - Desvio do componente: `(component_size - média) / std_dev`

### Fase 3: Identificar problemas de tamanho

**Componentes superdimensionados** (candidatos à divisão):

- Excede 30% da base de código total (para aplicativos pequenos com <10 componentes)
- Excede 10% da base de código total (para aplicativos grandes com >20 componentes)
- Mais de 2 desvios padrão acima da média
- Contém múltiplas áreas funcionais distintas

**Componentes Subdimensionados** (candidatos à consolidação):

- Menos de 1% da base de código (pode ser muito granular)
- Menos de 1 desvio padrão abaixo da média
- Contém apenas alguns arquivos com funcionalidade mínima

**Componentes bem dimensionados**:

- Entre 1-2 desvios padrão da média
- Representa uma área funcional única e coesa
- Porcentagem apropriada para o tamanho do aplicativo

## Formato de saída

### Tabela de inventário de componentes```markdown

## Component Inventory

| Component Name  | Namespace/Path               | Statements | Files | Percent | Status       |
| --------------- | ---------------------------- | ---------- | ----- | ------- | ------------ |
| Billing Payment | services/BillingService      | 4,312      | 23    | 5%      | ✅ OK        |
| Reporting       | services/ReportingService    | 27,765     | 162   | 33%     | ⚠️ Too Large |
| Notification    | services/NotificationService | 1,433      | 7     | 2%      | ✅ OK        |

````

**Legenda de status**:

- ✅ OK: Bom tamanho (dentro de 1-2 std dev da média)
- ⚠️ Muito grande: excede o limite de tamanho ou> 2 std dev acima da média
- 🔍 Muito pequeno: <1% da base de código ou <1 std dev abaixo da média

### Resumo da análise de tamanho```markdown
## Size Analysis Summary

**Total Components**: 18
**Total Statements**: 82,931
**Mean Component Size**: 4,607 statements
**Standard Deviation**: 5,234 statements

**Oversized Components** (>2 std dev or >10%):

- Reporting (33% - 27,765 statements) - Consider splitting into:
  - Ticket Reports
  - Expert Reports
  - Financial Reports

**Well-Sized Components** (within 1-2 std dev):

- Billing Payment (5%)
- Customer Profile (5%)
- Ticket Assignment (9%)

**Undersized Components** (<1 std dev):

- Login (2% - 1,865 statements) - Consider consolidating with Authentication
````

### Distribuição do tamanho dos componentes```markdown

## Component Size Distribution

`````
Distribuição de tamanho de componente (por porcentagem da base de código)

[Representação visual ou histograma, se possível]

Maior: ████████████████████████████████████ 33% (Relatórios)
████████ 9% (atribuição de ingressos)
██████ 8% (ingresso)
██████ 6% (perfil de especialista)
█████ 5% (pagamento de cobrança)
████ 4% (histórico de faturamento)
...````

### Recommendations

```markdown
## Recommendations

### High Priority: Split Large Components

**Reporting Component** (33% of codebase):
- **Current**: Single component with 27,765 statements
- **Issue**: Too large, contains multiple functional areas
- **Recommendation**: Split into:
  1. Reporting Shared (common utilities)
  2. Ticket Reports (ticket-related reports)
  3. Expert Reports (expert-related reports)
  4. Financial Reports (financial reports)
- **Expected Result**: Each component ~7-9% of codebase

### Medium Priority: Review Small Components

**Login Component** (2% of codebase):
- **Current**: 1,865 statements, 3 files
- **Consideration**: May be too granular if related to broader authentication
- **Recommendation**: Evaluate if should be consolidated with Authentication/User components

### Low Priority: Monitor Well-Sized Components

Most components are appropriately sized. Continue monitoring during decomposition.
`````

## Lista de verificação de análise

**Identificação do Componente**:

- [] Mapeou todas as estruturas de diretório/namespace
- [] Nós folha identificados (componentes) versus nós pai (subdomínios)
- [] Criado inventário completo de componentes
- [] Namespace/caminho documentado para cada componente

**Cálculo de tamanho**:

- [] Declarações contadas (não linhas) para cada componente
- [] Arquivos de origem contados (excluindo testes/configurações)
- [] Porcentagem calculada da base de código total
- [] Média calculada e desvio padrão

**Avaliação de tamanho**:

- [] Componentes superdimensionados identificados (> limite ou> 2 std dev)
- [] Componentes subdimensionados identificados (<1% ou <1 std dev)
- [] Componentes sinalizados para divisão ou consolidação
- [] Distribuição de tamanho documentada

**Recomendações**:

- [] Divisões sugeridas para componentes superdimensionados
- [ ] Sugestões de consolidações para componentes subdimensionados
- [] Recomendações priorizadas por impacto
- [] Criou histórias de arquitetura para refatoração

## Notas de implementação

### Para aplicativos Node.js/Express

Componentes normalmente encontrados em:

- `services/` - Componentes da lógica de negócios
- `routes/` - componentes de endpoint da API
- `models/` - Componentes do modelo de dados
- `utils/` - Componentes utilitários
- `middleware/` - Componentes de middleware

**Exemplo de identificação de componente**:```
services/
├── BillingService/ ← Component (leaf node)
│ ├── index.js
│ └── BillingService.js
├── CustomerService/ ← Component (leaf node)
│ └── CustomerService.js
└── NotificationService/ ← Component (leaf node)
└── NotificationService.js

````
### Para aplicativos Java

Componentes identificados pela estrutura do pacote:

- `com.company.domain.service` - Componentes de serviço
- `com.company.domain.model` - Componentes do modelo
- `com.company.domain.repository` - Componentes do repositório

**Exemplo de identificação de componente**:```
com.company.billing.payment   ← Component (leaf package)
com.company.billing.history   ← Component (leaf package)
com.company.billing           ← Subdomain (parent of payment/history)
````

### Contagem de extratos

**JavaScript/TypeScript**:

- Instruções de contagem terminadas por `;` ou nova linha
- Inclui: atribuições, chamadas de função, retornos, condicionais, loops
- Excluir: comentários, linhas em branco, declarações sem atribuição

**Java**:

- Instruções de contagem terminadas por `;`
- Incluir: chamadas de método, atribuições, retornos, condicionais
- Excluir: declarações de classe/interface, comentários, linhas em branco

**Píton**:

- Contar instruções executáveis (não comentários ou linhas em branco)
- Inclui: atribuições, chamadas de função, retornos, condicionais
- Excluir: documentos, comentários, linhas em branco

## Funções de condicionamento físico

Após identificar e dimensionar os componentes, crie verificações automatizadas:

### Limite de tamanho do componente```javascript

// Alert if any component exceeds 10% of codebase
function checkComponentSize(components, threshold = 0.1) {
const totalStatements = components.reduce((sum, c) => sum + c.statements, 0)
return components
.filter((c) => c.statements / totalStatements > threshold)
.map((c) => ({
component: c.name,
percent: ((c.statements / totalStatements) \* 100).toFixed(1),
issue: 'Exceeds size threshold',
}))
}

````
### Verificação do desvio padrão```javascript
// Alert if component is >2 standard deviations from mean
function checkStandardDeviation(components) {
  const sizes = components.map((c) => c.statements)
  const mean = sizes.reduce((a, b) => a + b, 0) / sizes.length
  const stdDev = Math.sqrt(sizes.reduce((sum, size) => sum + Math.pow(size - mean, 2), 0) / (sizes.length - 1))

  return components
    .filter((c) => Math.abs(c.statements - mean) > 2 * stdDev)
    .map((c) => ({
      component: c.name,
      deviation: ((c.statements - mean) / stdDev).toFixed(2),
      issue: 'More than 2 standard deviations from mean',
    }))
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

### O que não fazer ❌

- Não conte arquivos de teste no tamanho do componente
- Não trate os diretórios pais como componentes
- Não use limites fixos sem considerar o tamanho do aplicativo
- Não ignore componentes pequenos (podem precisar de consolidação)
- Não pule o cálculo do desvio padrão
- Não misture componentes de infraestrutura e domínio na mesma análise

## Próximas etapas

Depois de concluir a identificação e dimensionamento dos componentes:

1. **Aplicar padrão de coleta de componentes de domínio comuns** - Identificar funcionalidade duplicada
2. **Aplicar padrão de componentes nivelados** - Remover classes órfãs de namespaces raiz
3. **Aplicar Padrão de Determinação de Dependências de Componentes** - Analisar o acoplamento entre componentes
4. **Criar domínios de componentes** – Agrupar componentes em domínios lógicos

## Notas

- Os limites de tamanho dos componentes variam de acordo com o tamanho do aplicativo
- Aplicativos pequenos (<10 componentes): o limite de 30% pode ser apropriado
- Aplicativos grandes (>20 componentes): o limite de 10% é mais apropriado
- O desvio padrão é mais confiável do que porcentagens fixas
- Componentes bem dimensionados estão a 1-2 desvios padrão da média
- Componentes superdimensionados geralmente contêm múltiplas áreas funcionais que podem ser divididas
