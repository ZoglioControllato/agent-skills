---
name: domain-analysis
description: Mapeia domínios de negócio e sugere limites de serviço em qualquer codebase com DDD Strategic Design. Use quando perguntar quais domínios existem no código, onde traçar limites entre serviços, identificar contextos limitados, classificar subdomínios ou analisar coesão de domínio. Aciona em análise DDD estratégica, bounded contexts e vocabulário onipresente. NÃO use para apenas agrupar componentes já existentes em domínios (use domain-identification-grouping) nem foco só em grafo dependências estruturais (use coupling-analysis).
---

# Identificação de Subdomínio e Análise de Bounded Context

Esta skill analisa codebases para identificar subdomínios (Core, Supporting, Generic) e sugerir contextos limitados seguindo princípios de Strategic Design em Domain-Driven Design.

## Quando usar

Aplique esta skill quando:

- Analisar limites de domínio em qualquer codebase
- Identificar subdomínios Core, Supporting e Generic
- Mapear bounded contexts do problem space ao solution space
- Avaliar coesão de domínio e detectar problemas de acoplamento
- Planejar refactoring orientado por domínio
- Entender capacidades de negócio expressas no código

## Princípios centrais

### Classificação de subdomínios

**Core Domain**: Vantagem competitiva, maior valor de negócio, exige os melhores desenvolvedores

- Indicadores: lógica de negócio complexa, mudanças frequentes, especialistas no domínio

**Supporting Subdomain**: Essencial mas não diferencia, específico de negócio

- Indicadores: Suporta Core, complexidade média, regras específicas ao negócio

**Generic Subdomain**: Funcionalidade comum, poderia terceirizar

- Indicadores: problema bem entendido, baixa diferenciação, funcionalidade padrão

### Bounded Context

Fronteira linguística explícita onde termos do domínio têm significado específico e inequívoco.

- Natureza primária: fronteira linguística, não técnica
- Regra: dentro da fronteira, todos os termos da Linguagem Onipresente são inequívocos
- Meta: idealmente 1 subdomain ↔ 1 bounded context

## Processo de análise

### Fase 1: Extrair conceitos

Percorra o codebase em busca de conceitos de negócio (não infra):

1. **Entities** (modelos com identidade)
   - Patterns: `@Entity`, `class`, domain models
   - Foco: conceitos de negócio, não classes técnicas

2. **Services** (operações de negócio)
   - Patterns: `*Service`, `*Manager`, `*Handler`
   - Foco: lógica de negócio, não utilitários

3. **Use Cases** (fluxos de negócio)
   - Patterns: `*UseCase`, `*Command`, `*Handler`
   - Foco: processos, não apenas CRUD

4. **Controllers/Resolvers** (pontos de entrada)
   - Patterns: `*Controller`, `*Resolver`, endpoints
   - Foco: capacidades de negócio, não rotas técnicas

### Fase 2: Agrupar pela Linguagem Onipresente

Para cada conceito determine:

**Contexto linguistico primário**

- A qual vocabulário pertence?
- Exemplos:
  - `Subscription`, `Invoice`, `Payment` → linguagem Billing
  - `Movie`, `Video`, `Episode` → linguagem Content
  - `User`, `Authentication` → linguagem Identity

**Fronteiras linguísticas**

- Onde o significado dos termos muda?
- Mesmo termo, significados diferentes → contextos diferentes
- Ex.: “Customer” em Vendas vs “Customer” em Suporte

**Relações entre conceitos**

- Quais naturalmente ficam juntos?
- Quais compartilham vocabulário?
- Quais se referenciam?

### Fase 3: Identificar subdomínios

Um subdomínio tem:

- Distinta capacidade de negócio
- Valor de negócio independente
- Vocabulário único
- Múltiplas entidades relacionadas cooperando
- Conjunto coeso de operações de negócio

**Patterns de domínio comuns**:

- Billing/Subscription: pagamentos, faturas, planos
- Content/Catalog: mídia, produtos, estoque
- Identity/Access: usuários, autenticação, autorização
- Analytics: métricas, dashboards, insights
- Notifications: mensagens, alertas, comunicações

**Classifique cada subdomínio**

Use esta árvore:

```
Is it a competitive advantage?
  YES → Core Domain
  NO → Does it require business-specific knowledge?
        YES → Supporting Subdomain
        NO → Generic Subdomain
```

### Fase 4: Avaliar coesão

**Indicadores de alta coesão** ✅

- Conceitos compartilham Linguagem Onipresente
- Conceitos são usados frequentemente em conjunto
- Relações de negócio diretas
- Mudança em um afeta outros do grupo
- Resolvem mesmo problema de negócio

**Indicadores de baixa coesão** ❌

- Vocabulários de negócio misturados
- Conceitos pouco usados juntos
- Sem relação de negócio direta
- Mudanças não se propagam
- Problemas de negócio distintos

**Fórmula do Cohesion Score**:

```
Score = (
  Linguistic Cohesion (0-3) +    // Shared vocabulary
  Usage Cohesion (0-3) +         // Used together
  Data Cohesion (0-2) +          // Entity relationships
  Change Cohesion (0-2)          // Change together
) / 10

8-10: High Cohesion ✅
5-7:  Medium Cohesion ⚠️
0-4:  Low Cohesion ❌
```

### Fase 5: Detectar problemas de baixa coesão

**Regra 1: Linguistic Mismatch**

- Problema: vocabulários de negócio misturados
- Exemplo: `User` (identity) + `Subscription` (billing) no mesmo serviço
- Ação: separação em bounded contexts distintos

**Regra 2: Dependências entre domínios**

- Problema: acoplamento forte entre domínios
- Exemplo: Serviço A instancia entidades diretamente de Domínio B
- Ação: integração baseada em interface

**Regra 3: Responsabilidades misturadas**

- Problema: uma classe cobre várias preocupações de negócio
- Exemplo: serviço com billing E content juntos
- Ação: split por subdomínio

**Regra 4: Generic dentro do Core**

- Problema: funcionalidade genérica dentro do núcleo
- Exemplo: enviar e-mail embutido no serviço de billing
- Ação: extrair para Generic Subdomain

**Regra 5: Fronteiras pouco claras**

- Problema: não é possível saber onde o conceito pertence
- Exemplo: entidade com relações a vários domínios
- Ação: clarificar fronteiras, eventualmente partir conceito

### Fase 6: Mapear bounded contexts

Para cada subdomínio identificado, sugira bounded context:

**Características**

- Nome reflete Linguagem Onipresente
- Contém modelo de domínio completo
- Pontos explícitos de integração
- Fronteira linguística clara

**Patterns de integração**:

- Shared Kernel: modelo compartilhado (com parcimônia)
- Customer/Supplier: downstream depende de upstream
- Conformist: downstream conforme upstream
- Anti-corruption Layer: camada de tradução
- Open Host Service: interface publicada
- Published Language: protocolo bem documentado

## Formato de saída

### Mapa de domínio

Por domínio/subdomínio:

```markdown
## Domain: {Name}

**Type**: Core Domain | Supporting Subdomain | Generic Subdomain

**Ubiquitous Language**: {key business terms}

**Business Capability**: {what business problem it solves}

**Key Concepts**:

- {Concept} (Entity|Service|UseCase) - {brief description}

**Subdomains** (if applicable):

1. {Subdomain} (Core|Supporting|Generic)
   - Concepts: {list}
   - Cohesion: {score}/10
   - Dependencies: → {other domains}

**Suggested Bounded Context**: {Name}Context

- Linguistic boundary: {where terms have specific meaning}
- Integration: {how it should integrate with other contexts}

**Dependencies**:

- → {OtherDomain} via {interface/API}
- ← {OtherDomain} via {interface/API}

**Cohesion Score**: {score}/10
```

### Matriz de coesão

```markdown
## Cross-Domain Cohesion

| Domain A | Domain B | Cohesion | Issue              | Recommendation          |
| -------- | -------- | -------- | ------------------ | ----------------------- |
| Billing  | Identity | 2/10     | ❌ Direct coupling | Use interface           |
| Content  | Billing  | 6/10     | ⚠️ Usage tracking  | Event-based integration |
```

### Relatório de baixa coesão

```markdown
## Issues Detected

### Priority: High

**Issue**: {description}

- **Location**: {file/class/method}
- **Problem**: {what's wrong}
- **Concepts**: {involved concepts}
- **Cohesion**: {score}/10
- **Recommendation**: {suggested fix}

### Priority: Medium

{similar format}
```

### Mapa de bounded contexts

```markdown
## Suggested Bounded Contexts

### {ContextName}Context

**Contains Subdomains**:

- {Subdomain1} (Core)
- {Subdomain2} (Supporting)

**Ubiquitous Language**:

- Term: Definition in this context

**Integration Requirements**:

- Consumes from: {OtherContext} via {pattern}
- Publishes to: {OtherContext} via {pattern}

**Implementation Notes**:

- Separate persistence
- Independent deployment
- Explicit API boundaries
```

## Boas práticas

### Fazer ✅

- Foque em linguagem de negócio, não só estrutura de código
- Deixe a Linguagem Onipresente guiar fronteiras
- Meça coesão de forma objetiva
- Identifique pontos claros de integração
- Classifique todo subdomínio (Core/Supporting/Generic)
- Procure fronteiras linguísticas primeiro

### Não fazer ❌

- Não agrupe só por camada técnica
- Não force modelo global único
- Não ignore diferenças linguísticas
- Não acople domínios diretamente
- Não crie contextos só por arquitetura
- Não elimine todas as dependências (algumas são necessárias)

## Checklist de análise

**Por conceito**:

- [ ] A qual idioma de negócio pertence?
- [ ] Qual domínio/subdomínio faz parte?
- [ ] É Core, Supporting ou Generic?
- [ ] Relaciona com quais outros conceitos?
- [ ] Dependências ficam dentro do mesmo domínio?
- [ ] Algum linguistic mismatch?

**Por domínio**:

- [ ] Qual a Linguagem Onipresente?
- [ ] Quais conceitos principais?
- [ ] Quais subdomínios?
- [ ] Qual o Core Domain?
- [ ] Quais dependências cross-domain?
- [ ] Coesão interna é alta?
- [ ] Fronteiras claras?

**Para coesão**:

- [ ] Calcular cohesion scores
- [ ] Áreas de baixa coesão
- [ ] Dependências entre domínios
- [ ] Linguistic mismatches
- [ ] Acoplamento forte
- [ ] Sugerir clarificação de fronteiras

## Referência rápida

### Árvore de decisão de subdomínio

```
Analyze business capability
└─ Is it competitive advantage?
   ├─ YES → Core Domain
   └─ NO → Is it business-specific?
      ├─ YES → Supporting Subdomain
      └─ NO → Generic Subdomain
```

### Quick check de coesão

```
Same vocabulary? → High linguistic cohesion
Used together? → High usage cohesion
Direct relationships? → High data cohesion
Change together? → High change cohesion

All high → Strong subdomain candidate
Mix of high/low → Review boundaries
All low → Likely wrong grouping
```

### Sinais de bounded context

```
Clear boundary signs:
✅ Distinct Ubiquitous Language
✅ Concepts have unambiguous meaning
✅ Different meanings across contexts
✅ Clear integration points

Unclear boundary signs:
❌ Same terms with same meanings everywhere
❌ Concepts used identically across system
❌ No clear linguistic differences
❌ Tight coupling everywhere
```

## Anti-padrões

**Big Ball of Mud**

- Tudo ligado a tudo
- Sem fronteiras claras
- Vocabulários misturados
- Prevenção: bounded contexts explícitos

**All-Inclusive Model**

- Um modelo para todo o negócio
- Definições globais impossíveis
- Conflitos
- Prevenção: aceitar múltiplos contextos

**Mixed Linguistic Concepts**

- Vocabulários distintos no mesmo context
- Ex.: User/Permission com Forum/Post
- Prevenção: manter associações linguísticas

## Notas

- Esta é análise estratégica, não implementação tática
- Foco no QUE existe em domínio, não no COMO implementar
- Dependências entre domínios são normais
- Baixa coesão nem sempre é “ruim”; significa “precisa atenção”
- Generic Subdomains naturalmente podem ter coesão menor
- Sempre valide com especialistas de domínio quando possível

## Critérios de validação

Boa identificação de domínio tem:

- ✅ Fronteiras claras com Linguagem Onipresente distinta
- ✅ Alta coesão interna nos domínios
- ✅ Dependências explícitas entre domínios
- ✅ Alinhamento com capacidades do negócio
- ✅ Recomendações acionáveis para os problemas
