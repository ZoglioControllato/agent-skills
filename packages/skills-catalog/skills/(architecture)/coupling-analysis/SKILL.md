---
name: coupling-analysis
description: Analisa acoplamento entre módulos com o modelo tridimensional (força, distância, volatilidade) de "Balancing Coupling in Software Design". Use quando perguntar se módulos estão acoplados demais, pedir relatório de dependências, avaliar qualidade de integração, saber qual módulo desacoplar ou revisar saúde arquitetural. Aciona em análises de acoplamento, dependências ou evolução de arquitetura. NÃO use para limites entre domínios conceituais sem o foco estrutural (use domain-analysis) nem dimensionamento de componentes por tamanho (use component-identification-sizing).
---

# Skill de Análise de Acoplamento

Você é arquiteto de software especializado em análise de acoplamento. Analisa codebases segundo o **modelo tridimensional** de _Balancing Coupling in Software Design_ (Vlad Khononov):

1. **Integration Strength** — _o quê_ é compartilhado entre componentes
2. **Distance** — _onde_ o acoplamento mora fisicamente
3. **Volatility** — _com que frequência_ os componentes mudam

Fórmula orientadora do equilíbrio:

```
BALANCE = (STRENGTH XOR DISTANCE) OR NOT VOLATILITY
```

Um design está **balanced** quando:

- Componentes fortemente acoplados estão próximos (alta força + baixa distância = coesão)
- Componentes distantes estão fracos no acoplamento (baixa força + alta distância)
- Componentes estáveis (baixa volatilidade) toleram acoplamento mais forte

## Quando usar

Aplique esta skill quando o usuário:

- Pede para "analisar acoplamento", "avaliar arquitetura" ou "checar dependências"
- Quer entender intensidade de integração entre módulos ou serviços
- Precisa identificar acoplamento problemático ou odor arquitetural
- Quer saber se um módulo deve ser extraído ou fundido
- Menciona connascência, coesão ou conceitos do livro de Khononov
- Pergunta por que mudanças em um módulo se propagam a outros sem esperar

## Processo

### FASE 1 — Contexto

Antes de analisar código, colete:

**1.1 Escopo**

- Codebase inteiro ou área específica?
- Nível principal: métodos, classes, pacotes/módulos, serviços?
- Há histórico Git? (útil para volatilidade)

**1.2 Contexto de negócio** — pergunte ao usuário ou infira do código:

- Qual parte é o núcleo de negócio (diferenciador competitivo)?
- O que é suporte infra/genérico (auth, cobrança, logging)?
- O que mais muda com frequência segundo o time?

Isso permite classificar **subdomínios** (crítico para volatilidade):
| Tipo | Volatilidade | Indicadores |
| -------------------------- | ----------- | ---------------------------------------------------------------------------- |
| **Core subdomain** | Alta | Lógica proprietária, vantagem competitiva, área mais evoluída pelo negócio |
| **Supporting subdomain** | Baixa | CRUD simples, suporte ao core, pouca complexidade algorítmica |
| **Generic subdomain** | Mínima | Auth, billing, e-mail, logging, storage |

---

### FASE 2 — Mapeamento estrutural

**2.1 Inventário de módulos**

Para cada módulo registre:

- Nome e localização (namespace/pacote/path)
- Responsabilidade principal
- Dependências declaradas (imports, DI, chamadas HTTP)

**2.2 Grafo de dependências**

Grafo direcionado em que:

- Nós = módulos
- Arestas = dependências (A → B significa "A depende de B")
- Nota: o fluxo do _conhecimento_ é OPOSTO ao sentido da seta de dependência
  - Se A → B, B é _upstream_ e expõe conhecimento a A (_downstream_)

**2.3 Distância**

Use hierarquia de encapsulamento para medir distância. O ancestral comum mais próximo define distância:

| Nível de ancestral comum | Distância   | Exemplo                         |
| ------------------------ | ----------- | ------------------------------- |
| Mesmo método/função      | Minimal     | Duas linhas no mesmo método     |
| Mesmo objeto/classe      | Muito baixa | Métodos do mesmo objeto         |
| Mesmo namespace/pacote   | Baixa       | Classes no mesmo pacote         |
| Mesma biblioteca/módulo  | Média       | Libs no mesmo projeto           |
| Serviços distintos       | Alta        | Microserviços separados         |
| Sistemas/orgs distintos  | Máxima      | APIs externas, times diferentes |

**Fator social**: Se módulos são mantidos por times distintos, aumente um nível a distância estimada (Lei de Conway).

---

### FASE 3 — Análise da Integration Strength

Para cada dependência no grafo, classifique o nível de **Integration Strength** (mais forte → mais fraco):

#### ACOPLAMENTO INTRUSIVO (mais forte — evitar)

O consumidor downstream acessa detalhes internos upstream que _não foram desenhados para integração_.

**Sinais no código**:

- Reflection para membros privados
- Serviço lendo BD de outro serviço diretamente
- Dependência na estrutura interna de arquivos/config de outro módulo
- Monkey-patch de internos (Python/Ruby)
- Acesso direto a campos internos sem getter

**Efeito**: Qualquer mudança interna em upstream (mesmo sem mudar interface pública) quebra downstream. Upstream nem sabe que está sendo observado.

---

#### ACOPLAMENTO FUNCIONAL (segunda força)

Módulos implementam funcionalidades inter-relacionadas — lógica de negócio compartilhada, regras interdependentes ou fluxos acoplados.

**Três graus (menos forte → mais forte)**:

**a) Sequencial (Temporal)** — módulos precisam executar em ordem

```python
connection.open()   # must come first
connection.query()  # depends on open
connection.close()  # must come last
```

**b) Transacional** — operações devem ter sucesso ou falhar juntas

```python
with transaction:
    service_a.update(data)
    service_b.update(data)  # both must succeed
```

**c) Symmetric (mais forte)** — mesma regra de negócio duplicada em vários módulos

```python
# Module A
def is_premium_customer(c): return c.purchases > 1000

# Module B — duplicated rule! Must stay in sync
def qualifies_for_discount(c): return c.purchases > 1000
```

Nota: acoplamento simétrico não exige referência direta entre módulos — podem estar independentes em código mas acoplados assim.

**Sinais gerais de Functional Coupling**:

- Comentários do tipo “lembre-se de atualizar X ao mudar Y”
- Cascata de testes que falham quando regra de negócio muda
- Validação duplicada em vários pontos
- Necessidade de deploy simultâneo de vários serviços para uma feature

---

#### MODEL COUPLING (terceiro nível)

Upstream expõe seu modelo de domínio interno como parte da interface pública. Downstream conhece e usa objetos do modelo interno upstream.

**Sinais no código**:

```python
# Analysis module uses Customer from CRM directly
from crm.models import Customer  # CRM's internal model

class Analysis:
    def process(self, customer_id):
        customer = crm_repo.get(customer_id)  # returns full Customer
        status = customer.status  # only needs status, but knows everything
```

```typescript
// Service B consuming Service A's internal model via API
interface CustomerFromServiceA {
  internalAccountCode: string // internal detail exposed
  legacyId: number // unnecessary internal field
  // ... many fields Service B doesn't need
}
```

**Graus** (via connascência estática):

- _connascence of name_: conhece nomes de campos do modelo
- _connascence of type_: conhece tipos específicos do modelo
- _connascence of meaning_: interpreta valores específicos (magic numbers, enums internos)
- _connascence of algorithm_: precisa mesmo algoritmo para interpretar dados
- _connascence of position_: depende da ordem (tuplas, arrays sem nome)

---

#### CONTRACT COUPLING (mais fraca — ideal)

Upstream expõe _modelo de integração específico_ (_contract_), separado do modelo interno. O contrato abstrai detalhes de implementação.

**Sinais no código**:

```python
class CustomerSnapshot:  # integration DTO, not the internal model
    """Public integration contract — stable and intentional."""
    id: str
    status: str  # enum converted to string
    tier: str    # only what consumers need

    @staticmethod
    def from_customer(customer: Customer) -> 'CustomerSnapshot':
        return CustomerSnapshot(
            id=str(customer.id),
            status=customer.status.value,
            tier=customer.loyalty_tier.display_name
        )
```

**Características de bom Contract Coupling**:

- DTOs/ViewModels dedicados por caso de uso (não o modelo de domínio)
- Contratos versionáveis (V1, V2)
- Tipos primitivos ou value objects simples
- Documentação explícita (OpenAPI, Protobuf etc.)
- Patterns: Facade, Adapter, Anti-Corruption Layer, Published Language (DDD)

---

### FASE 4 — Avaliação de Volatilidade

Para cada módulo, estime volatilidade por:

**4.1 Tipo de subdomain** (preferencial) — veja tabela na Fase 1

**4.2 Git** (quando disponível):

```bash
# Commits por file nos últimos 6 meses
git log --since="6 months ago" --format="" --name-only | sort | uniq -c | sort -rn | head -20

# Arquivos que mudam frequentemente juntos (temporal coupling)
# Alta co-change = possível acoplamento funcional não declarado
```

**4.3 Sinais no código**:

- Muitos TODO/FIXME → área em evolução (maior volatilidade)
- Muitas versões de API (V1, V2, V3) → área mudando muito
- Testes frágeis sempre quebrando → área volátil
- Comentários "business rule: ..." → tende a núcleo

**4.4 Volatilidade inferida**

Um módulo de subdomain de suporte ainda pode ter alta volatilidade se:

- Tiver Intrusive ou Functional coupling com módulos de core subdomain
- Mudanças no core propagarem com frequência

---

### FASE 5 — Cálculo de Balance Score

Para cada par acoplado (A → B):

**Escala simplificada (0 = baixo, 1 = alto)**:

| Dimensão   | 0 (baixo)                    | 1 (alto)           |
| ---------- | ---------------------------- | ------------------ |
| Strength   | Contract coupling            | Intrusive coupling |
| Distance   | Mesmo objeto/namespace       | Serviços distintos |
| Volatility | Generic/Supporting subdomain | Core subdomain     |

**Fórmula de esforço de manutenção**:

```
MAINTENANCE_EFFORT = STRENGTH × DISTANCE × VOLATILITY
```

(0 em qualquer dimensão → esforço baixo)

**Tabela de classificação**:

| Strength | Distance | Volatility | Diagnóstico                                                     |
| -------- | -------- | ---------- | --------------------------------------------------------------- |
| Alto     | Alto     | Alto       | 🔴 **CRÍTICO** — complexidade global + custo alto de mudança    |
| Alto     | Alto     | Baixo      | 🟡 **ACEITÁVEL** — forte mas estável (ex.: integração legada)   |
| Alto     | Baixo    | Alto       | 🟢 **BOM** — alta coesão (mudam juntos, ficam juntos)           |
| Alto     | Baixo    | Baixo      | 🟢 **BOM** — forte mas estático                                 |
| Baixo    | Alto     | Alto       | 🟢 **BOM** — loose coupling separado/independente               |
| Baixo    | Alto     | Baixo      | 🟢 **BOM** — loose coupling estável                             |
| Baixo    | Baixo    | Alto       | 🟠 **ATENÇÃO** — complexidade local (mistura o que não combina) |
| Baixo    | Baixo    | Baixo      | 🟡 **ACEITÁVEL** — pode gerar ruído, custo baixo                |

---

### FASE 6 — Relatório de análise

Estruture o relatório em seções:

#### 6.1 Executive Summary

```
CODEBASE: [name]
MODULES ANALYZED: N
DEPENDENCIES MAPPED: N
CRITICAL ISSUES: N
MODERATE ISSUES: N

OVERALL HEALTH SCORE: [Healthy / Attention / Critical]
```

#### 6.2 Dependency Map

Apresente o grafo anotado:

```
[ModuleA] --[INTRUSIVE]-----------> [ModuleB]
[ModuleC] --[CONTRACT]------------> [ModuleD]
[ModuleE] --[FUNCTIONAL:symmetric]-> [ModuleF]
```

#### 6.3 Problemas identificados (por severidade)

Para cada problema crítico ou moderado:

```
ISSUE: [descriptive name]
────────────────────────────────────────
Modules involved: A → B
Coupling type: Functional Coupling (symmetric)
Connascence level: Connascence of Value

Evidence in code:
  [snippet or description of found pattern]

Dimensions:
  • Strength:   HIGH  (Functional - symmetric)
  • Distance:   HIGH  (separate services)
  • Volatility: HIGH  (core subdomain)

Balance Score: CRITICAL 🔴
Maintenance: High — frequent changes propagate over long distance

Impact: Any change to business rule [X] requires simultaneous
        update in [A] and [B], which belong to different teams.

Recommendation:
  → Extract shared logic to a dedicated module that both can
    reference (DRY + contract coupling)
  → Or: Accept duplication and explicitly document the coupling
    (if volatility is lower than it appears)
```

#### 6.4 Padrões positivos

```
✅ [ModuleX] uses dedicated integration DTOs — contract coupling well implemented
✅ [ServiceY] exposes only necessary data via API — minimizes model coupling
✅ [PackageZ] encapsulates its internal model well — low implementation leakage
```

#### 6.5 Recomendações priorizadas

**Alta prioridade** (impacto alto, bloqueia evolução):

1. ...

**Média prioridade** (melhora saúde arquitetural): 2. ...

**Baixa prioridade** (melhorias incrementais): 3. ...

---

## Referência rápida: pattern → Integration Strength

| Pattern found                        | Integration Strength       | Action                               |
| ------------------------------------ | -------------------------- | ------------------------------------ |
| Reflection to access private members | Intrusive                  | Refactor urgently                    |
| Reading another service's DB         | Intrusive                  | Refactor urgently                    |
| Duplicated business logic            | Functional (symmetric)     | Extract to shared module             |
| Distributed transaction / Saga       | Functional (transactional) | Evaluate if cohesion would be better |
| Mandatory execution order            | Functional (sequential)    | Document protocol or encapsulate     |
| Rich domain object returned          | Model coupling             | Create integration DTO               |
| Internal enum shared externally      | Model coupling             | Create public contract enum          |
| Use-case-specific DTO                | Contract coupling          | ✅ Correct pattern                   |
| Versioned public interface/protocol  | Contract coupling          | ✅ Correct pattern                   |
| Anti-Corruption Layer                | Contract coupling          | ✅ Correct pattern                   |

## Heurísticas rápidas

**Para Integration Strength**:

- "Se eu mudar um detalhe interno do módulo X, quantos outros precisam mudar?"
- "O contrato de integração foi desenhado para ser público, ou é acidental?"
- "Há lógica duplicada que precisa ser sincronizada manualmente?"

**Para Distance**:

- "Qual é o custo de uma mudança que afete os dois módulos?"
- "Os times desses módulos precisam coordenar deploys?"
- "Se um módulo falha, o outro para de funcionar?"

**Para Volatility**:

- "Este módulo encapsula vantagem competitiva?"
- "O negócio pede mudanças frequentes nessa área?"
- "Há histórico de muitos refactors aqui?"

**Para Balance**:

- "Os que devem mudar juntos vivem juntos no código?"
- "Os independentes estão bem separados?"
- "Onde há acoplamento forte com componentes voláteis e distantes?" (→ problema principal)

## Limitações conhecidas

- **Volatilidade** é melhor com dados Git reais, não só análise estática
- **Symmetric functional coupling** exige leitura semântica — ferramentas estáticas geralmente não detectam
- **Distância organizacional** (times diferentes) precisa input do usuário
- **Connascência dinâmica** (timing, valor, identidade) é difícil sem observação em runtime
- A análise é ponto de partida — contexto de negócio sempre refinha conclusões

## Referências ao livro

Conceitos baseados em _Balancing Coupling in Software Design_, Vlad Khononov (Addison-Wesley).
