# Análise de nivelamento de componentes - Referência rápida

## Definição de componente

**Component** = Nó folha na estrutura de diretório/namespace contendo arquivos de origem

**Regra principal**: Os componentes existem apenas como nós folha. Se o namespace for estendido, o pai se tornará um subdomínio.

## Namespace raiz vs componente

| Tipo               | Definição                          | Exemplo                           | Tem Código?          |
| ------------------ | ---------------------------------- | --------------------------------- | -------------------- |
| **Componente**     | Nó folha (diretório mais profundo) | `ss.survey.templates`             | ✅ Sim               |
| **Namespace raiz** | Estendido por nós filhos           | `ss.survey` (possui `.templates`) | ❌ Não (órfão se sim |

) |
| **Subdomínio** | Igual ao namespace raiz | `ss.pesquisa` | ❌ Não |

## Classes Órfãs

**Classe órfã** = Arquivo de origem no namespace raiz (nó não folha)

**Problema**: Nenhum componente definível associado a ele

**Solução**: mover para o namespace do nó folha (componente)

### Detecção```

Root namespace extended?
├─ YES → Check for source files
│ ├─ Has files? → Orphaned classes found
│ └─ No files? → ✅ OK
└─ NO → Not a root namespace

````
## Estratégias de nivelamento

### Estratégia 1: Consolidar ✅

**Quando**: os nós folha são pequenos e têm funcionalidade relacionada

**Ação**: mover o código folha para o namespace raiz

**Exemplo**:```
Before: ss.survey/ + ss.survey.templates/
After:  ss.survey/ (single component)
````

### Estratégia 2: Dividir ✅

**Quando**: o namespace raiz tem áreas funcionais distintas

**Ação**: mover o código raiz para novos nós folha

**Exemplo**:```
Before: ss.ticket/ (45 orphaned files)
After: ss.ticket.maintenance/ + ss.ticket.completion/

````
### Estratégia 3: Extrair Compartilhado ✅

**Quando**: o namespace raiz tem utilitários compartilhados

**Ação**: Mover o código compartilhado para o componente `.shared`

**Exemplo**:```
Before: ss.survey/ (domain + shared code)
After:  ss.survey/ + ss.survey.shared/
````

## Árvore de Decisão```

Found orphaned classes?
├─ YES → Analyze functionality
│ ├─ Related to leaf components?
│ │ ├─ YES → Consolidate Down
│ │ └─ NO → Distinct areas?
│ │ ├─ YES → Split Up
│ │ └─ NO → Shared code?
│ │ └─ YES → Extract Shared
│ └─ NO → ✅ No action needed
└─ NO → ✅ Structure is flat

````
## Padrões Comuns

### Padrão 1: Consolidação Simples```
Before:
ss.survey/
├── Survey.js           ← Orphaned
└── templates/         ← Component
    └── Template.js

After:
ss.survey/             ← Component
├── Survey.js
└── Template.js
````

### Padrão 2: Divisão Funcional```

Before:
ss.ticket/ ← Root (45 orphaned files)
├── assign/ ← Component
└── route/ ← Component

After:
ss.ticket/ ← Subdomain
├── maintenance/ ← Component
├── completion/ ← Component
├── assign/ ← Component
└── route/ ← Component

````
### Padrão 3: Extração de código compartilhado```
Before:
ss.survey/             ← Root
├── Survey.js          ← Domain
├── Validator.js       ← Shared
└── templates/         ← Component

After:
ss.survey/             ← Component
├── Survey.js
└── shared/            ← Component
    └── Validator.js
````

## Etapas de análise rápida

1. **Mapa** → Construir árvore de namespace, identificar namespaces raiz
2. **Detectar** → Encontre classes órfãs em namespaces raiz
3. **Analisar** → Determinar a estratégia de nivelamento
4. **Planejar** → Criar etapas de refatoração
5. **Executar** → Mover arquivos, atualizar referências

## Modelo de saída```markdown

## Orphaned Classes Analysis

### Root Namespace: [name]

**Orphaned Files** (X files):

- File1.js (domain/shared code)
- File2.js (domain/shared code)

**Leaf Components**:

- [component.name] (X files)

**Issue**: [description]

**Recommendation**: [strategy]

## Flattening Plan

### Priority: High/Medium/Low

**[Namespace]** → [Strategy]

- [Steps]
- Effort: X days
- Risk: Low/Medium/High

````
## Regras de validação

### Regra 1: Componentes apenas como nós folha```
✅ Valid:
ss.survey.templates/   ← Component (leaf node)

❌ Invalid:
ss.survey/             ← Root namespace with code
├── Survey.js          ← Orphaned class
└── templates/         ← Component
````

### Regra 2: Não há aulas órfãs```

✅ Valid:
ss.survey/ ← Subdomain (no code)
└── templates/ ← Component (has code)
└── Template.js

❌ Invalid:
ss.survey/ ← Root namespace
├── Survey.js ← Orphaned class ❌
└── templates/ ← Component
└── Template.js

```
## Lista de verificação rápida

- [] Hierarquias de namespace mapeadas
- [] Namespaces raiz identificados
- [] Classes órfãs encontradas
- [] Classes órfãs classificadas
- [] Estratégia de nivelamento selecionada
- [] Plano de refatoração criado
- [] Atualizadas todas as referências
- [] Verificado com testes
```
