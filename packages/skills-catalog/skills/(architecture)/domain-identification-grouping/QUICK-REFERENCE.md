# Identificação e agrupamento de domínios - Referência rápida

## Definição de Domínio

**Domínio** = Agrupamento lógico de componentes que representam uma capacidade de negócios distinta

**Características principais**:

- Representa a área de negócios, não a camada técnica
- Contém componentes relacionados
- Tem limites claros
- Pode se tornar serviço de domínio

## Estratégias de identificação de domínio

### 1. Análise de capacidade de negócios```

What business capabilities does the system provide?
→ Each capability = Potential domain

````
### 2. Análise de vocabulário```
What business language do components use?
→ Components sharing vocabulary = Same domain
````

### 3. Análise de Relacionamento```

Which components are frequently used together?
→ Related components = Same domain

````
### 4. Colaboração das partes interessadas```
What do business experts say?
→ Their understanding = Domain boundaries
````

## Atribuição de componente a domínio

### Processo de decisão```

Analyze component:
├─ What business capability does it support?
├─ What domain vocabulary does it use?
├─ What other components does it relate to?
└─ Assign to domain that best fits

````
### Casos extremos

- **Tarefa pouco clara**: Analise mais profundamente, verifique as relações
- **Múltiplos domínios**: escolha o domínio principal, documente o secundário
- **Funcionalidade compartilhada**: pode pertencer ao domínio compartilhado

## Refatoração de namespace

### Padrão

**Antes**: `serviços/faturamento/pagamento`
**Depois**: `serviços/cliente/faturamento/pagamento`

**Regra**: adicionar nó de domínio ao namespace

### Etapas de refatoração

1. Atualizar declarações de namespace
2. Atualizar instruções de importação
3. Atualizar estrutura de diretórios
4. Execute testes
5. Atualizar documentação

## Validação de Domínio

### Lista de verificação

- [] Todos os componentes atribuídos a um domínio
- [] Os domínios têm limites claros
- [] Componentes se ajustam ao vocabulário do domínio
- [] Domínios representam capacidades distintas
- [ ] Stakeholders validam agrupamentos

### Verificação de coesão```
High Cohesion ✅:
- Components share business language
- Components used together
- Direct relationships

Low Cohesion ❌:
- Different vocabularies
- Rarely used together
- No relationships
````

## Diretrizes de tamanho de domínio

| Tamanho      | Contagem de componentes | Notas                           |
| ------------ | ----------------------- | ------------------------------- |
| Pequeno      | 2-4                     | Pode necessitar de consolidação |
| Médio        | 5-8                     | Tamanho ideal                   |
| Grande       | 9-15                    | Monitore para divisão           |
| Muito grande | >15                     | Considere dividir               |

## Padrões de domínio comuns

### Domínios Típicos

- **Cliente**: gerenciamento de clientes, perfis, faturamento
- **Produto**: Catálogo, estoque, preços
- **Pedido**: Processamento, atendimento
- **Faturamento**: Faturamento, pagamentos
- **Relatórios**: relatórios, análises
- **Admin**: gerenciamento de usuários, configuração
- **Compartilhado**: funcionalidade comum

### Contagem de domínios

**Ideal**: 3 a 7 domínios  
**Muitos**: >10 domínios (considere mesclar)  
**Poucos**: <3 domínios (considere dividir)

## Modelo de saída```markdown

## Domain: [Name] ([namespace])

**Business Capability**: [what it does]

**Components**:

- Component 1
- Component 2

**Component Count**: X
**Total Size**: Y statements (Z% of codebase)

**Domain Cohesion**: ✅ High / ⚠️ Medium / ❌ Low

**Boundaries**:

- Clear separation from [Domain A]
- Clear separation from [Domain B]

````
## Etapas de análise rápida

1. **Identificar** → Analisar componentes, encontrar capacidades de negócios
2. **Grupo** → Atribuir componentes aos domínios
3. **Validar** → Verifique coesão, limites, integridade
4. **Refatorar** → Alinhar namespaces com domínios
5. **Mapa** → Criar visualização de domínio

## Árvore de Decisão```
Identify domains
├─ Analyze component responsibilities
├─ Identify business capabilities
├─ Group by vocabulary/relationships
└─ Validate with stakeholders

Assign components
├─ Analyze functionality
├─ Check relationships
├─ Assign to domain
└─ Handle edge cases

Refactor namespaces
├─ Compare current vs target
├─ Identify changes needed
├─ Create refactoring plan
└─ Execute refactoring
````
