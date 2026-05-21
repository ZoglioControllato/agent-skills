# Detecção de componente de domínio comum - referência rápida

## Domínio vs Infraestrutura

| Tipo               | Descrição                                  | Exemplos                          | Consolidar?                    |
| ------------------ | ------------------------------------------ | --------------------------------- | ------------------------------ |
| **Domínio**        | Lógica de negócio comum a alguns processos | Notificação, auditoria, validação | ✅ Sim                         |
| **Infraestrutura** | Preocupações técnicas, comuns a todos      | Registro, métricas, segurança     | ❌ Não (tratado separadamente) |

## Estratégias de detecção

### 1. Detecção de padrão de namespace

Encontre componentes com nomes de nós folha comuns:```
services/customer/notification ← Common pattern
services/ticket/notification ← Common pattern
services/survey/notification ← Common pattern

````

**Padrões Comuns**:

- `*.notificação`, `*.notify`, `*.email`
- `*.audit`, `*.auditing`, `*.log`
- `*.validação`, `*.validate`, `*.validator`
- `*.format`, `*.formatter`, `*.formatting`

### 2. Detecção de classe compartilhada

Encontre classes usadas em vários componentes:```
SMTPConnection → Used by 5 components
AuditLogger → Used by 8 components
DataFormatter → Used by 3 components
````

### 3. Análise de Funcionalidade

Examine o código para verificar a similaridade:

- Leia o código fonte de cada componente
- Identificar semelhanças e diferenças
- Avaliar se as diferenças podem ser abstraídas

## Análise de acoplamento

### Antes da Consolidação```

Component A: CA = 2 (used by 2 components)
Component B: CA = 2 (used by 2 components)
Component C: CA = 1 (used by 1 component)
Total CA: 5

````
### Após a consolidação```
Consolidated Component: CA = 5 (used by 5 components)
Total CA: 5 (same!)
````

**Veredicto**: ✅ Seguro para consolidar (sem aumento de acoplamento)

### Sinais de alerta```

After Consolidation: CA = 15 (was 5)
Verdict: ⚠️ High coupling increase - reconsider

````
## Abordagens de consolidação

### Serviço Compartilhado

**Usar quando**:

- A funcionalidade muda frequentemente
- Operações complexas
- Precisa de escalonamento independente

**Exemplo**: serviço de notificação chamado por vários componentes

### Biblioteca Compartilhada

**Usar quando**:

- Funcionalidade estável
- Utilitários simples
- Dependência em tempo de compilação aceitável

**Exemplo**: Utilitários de validação empacotados como pacote npm

### Mesclagem de Componentes

**Usar quando**:

- Funcionalidade altamente relacionada
- Baixo impacto de acoplamento
- Mesma unidade de implantação aceitável

**Exemplo**: mesclar três componentes de notificação em um

## Etapas de análise rápida

1. **Verificar** → Encontre padrões de namespace comuns
2. **Detectar** → Identificar classes compartilhadas
3. **Analisar** → Verifique a similaridade de funcionalidade
4. **Avaliar** → Calcular o impacto do acoplamento
5. **Recomendar** → Sugerir abordagem de consolidação

## Modelo de saída```markdown
## Common Domain Components Found

### [Functionality Name]

**Components**:

- component1 (X% - Y statements)
- component2 (X% - Y statements)

**Functionality Analysis**:

- Similarities: [what's the same]
- Differences: [what's different]
- Consolidation Feasibility: ✅ High / ⚠️ Medium / ❌ Low

**Coupling Analysis**:

- Before: CA = X
- After: CA = Y
- Verdict: ✅ Safe / ⚠️ Monitor / ❌ Too risky

**Recommendation**: [consolidation approach]
````

## Árvore de Decisão```

Found common pattern?
├─ YES → Analyze functionality
│ ├─ Similar enough?
│ │ ├─ YES → Assess coupling
│ │ │ ├─ CA increase acceptable?
│ │ │ │ ├─ YES → ✅ Consolidate
│ │ │ │ └─ NO → ⚠️ Reconsider or use shared library
│ │ └─ NO → ❌ Don't consolidate
│ └─ NO → ❌ Don't consolidate
└─ NO → No consolidation needed

```
## Padrões Comuns

### Candidatos de alta consolidação ✅

- Componentes de notificação
- Componentes de auditoria
- Componentes de validação
- Componentes de formatação

### Candidatos com baixa consolidação ❌

- Utilidades de infraestrutura
- Diferentes contextos de negócios
- Cenários de alto risco de acoplamento
```
