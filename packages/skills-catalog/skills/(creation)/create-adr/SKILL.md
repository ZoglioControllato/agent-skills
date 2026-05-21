---
name: create-adr
description: Cria Architecture Decision Records (ADRs) para documentar escolhas arquiteturais significativas e seu raciocínio para quem entrar depois na equipe. Use quando o usuário disser "write an ADR", "document this decision", "record why we chose X", "add an architecture decision record", "create an ADR for", ou quiser registrar o porquê de uma decisão técnica para o time entender mais tarde. NÃO use para decisões ainda não tomadas (use create-rfc), planejamento de implementação após a decisão (use technical-design-doc-creator) ou documentação geral.
license: CC-BY-4.0
metadata:
  author: Controllato Club - github.com/tech-leads-club
  version: '1.0.0'
---

# Criador de ADR

Você é especialista em criar Architecture Decision Records (ADRs) — documentos concisos e duráveis que capturam contexto, decisão e consequências de escolhas arquiteturais importantes, para que futuros membros da equipe entendam _por que_ as coisas são como são.

## Quando usar esta skill

Use quando:

- Pedidos como "write an ADR", "create an ADR", "add an architecture decision record"
- Quiser "document why we chose X", "record this decision", "capture this architectural choice"
- Uma decisão técnica significativa foi tomada (ou está sendo finalizada) e precisa ser registrada
- O time quer preservar o raciocínio para futuros engenheiros
- Perguntas como "why did we choose X" e a resposta deve ficar registrada permanentemente

NÃO use para:

- Decisões ainda não tomadas — use `create-rfc` para conduzir o processo primeiro
- Planejamento de implementação após a decisão — use `technical-design-doc-creator`
- Escolhas triviais de configuração ou código
- Notas de reunião ou documentação genérica

## ADR vs RFC — distinção crítica

| Aspecto          | ADR                                                | RFC                               |
| ---------------- | -------------------------------------------------- | --------------------------------- |
| **Momento**      | Decisão já tomada (ou sendo finalizada)            | Antes da decisão (buscando input) |
| **Propósito**    | Registrar para o futuro                            | Proposta buscando aprovação       |
| **Audiência**    | Engenheiros que entram meses ou anos depois        | Stakeholders atuais               |
| **Tamanho**      | Curto — cerca de 200–500 palavras                  | Longo — comparativo completo      |
| **Mutabilidade** | Imutável — substituído, nunca editado em histórico | Iterativo — evolui na revisão     |
| **Tom**          | Registro histórico                                 | Proposta deliberativa             |

Se o usuário diz "I need to decide whether to do X" → use `create-rfc`.
Se diz "We decided to do X, let me document it" → use esta skill.

## Adaptação de idioma

**CRÍTICO**: Gere o ADR no **mesmo idioma do pedido do usuário**. Detecte automaticamente.

- Mantenha termos técnicos em inglês quando adequado (ex.: "ADR", "API", "microservices")
- Cabeçalhos de seção e conteúdo no idioma do usuário
- Nomes de empresa/produto no original

## Escolha do formato ADR

Três formatos comuns. Detecte pelo contexto ou pergunte:

| Formato                 | Melhor para                                       | Tamanho      |
| ----------------------- | ------------------------------------------------- | ------------ |
| **MADR** (Markdown ADR) | Times que querem comparação estruturada de opções | Médio        |
| **Nygard** (original)   | Registro mínimo e rápido; decisões óbvias         | Curto        |
| **Y-Statement**         | Documentação inline, contextos muito compactos    | Um parágrafo |

Padrão **MADR** salvo especificação diferente ou decisão muito simples.

---

## Fluxo interativo

### Etapa 1: Coletar contexto (se não fornecido)

Contexto mínimo: use **AskQuestion** para informações essenciais:

```json
{
  "title": "ADR Information",
  "questions": [
    {
      "id": "adr_decision",
      "prompt": "What was the decision made? (e.g., 'Use PostgreSQL for primary storage')",
      "options": [{ "id": "free_text", "label": "I'll describe it in my next message" }]
    },
    {
      "id": "adr_format",
      "prompt": "Which ADR format would you like to use?",
      "options": [
        { "id": "madr", "label": "MADR — structured, with options comparison (recommended)" },
        { "id": "nygard", "label": "Nygard — minimal: Context / Decision / Consequences" },
        { "id": "y_statement", "label": "Y-Statement — single paragraph, very compact" }
      ]
    },
    {
      "id": "adr_status",
      "prompt": "What is the current status of this decision?",
      "options": [
        { "id": "accepted", "label": "Accepted — decision is final" },
        { "id": "proposed", "label": "Proposed — decision is being finalized" },
        { "id": "deprecated", "label": "Deprecated — this approach is no longer recommended" },
        { "id": "superseded", "label": "Superseded — replaced by a newer decision" }
      ]
    },
    {
      "id": "adr_supersedes",
      "prompt": "Does this ADR supersede a previous decision?",
      "options": [
        { "id": "yes", "label": "Yes — I'll provide the ADR number/title" },
        { "id": "no", "label": "No — this is a new decision" }
      ]
    }
  ]
}
```

### Etapa 2: Validar campos obrigatórios

**Campos obrigatórios — pergunte se faltar**:

- **Título da decisão** (frase nominal, não pergunta — ex.: "Use Redis for session storage")
- **Data** da decisão (ou data de hoje)
- **Status** (Accepted / Proposed / Deprecated / Superseded)
- **Context** — forças, restrições e situação que tornaram a decisão necessária
- **A decisão em si** — o que foi escolhido e por quê
- **Consequences** — o que fica mais fácil, mais difícil ou diferente

**Campos recomendados**:

- **Decision drivers** — critérios ou restrições principais
- **Options considered** — alternativas avaliadas
- **Pros/cons por opção** — trade-offs honestos
- **Decision outcome rationale** — por que esta opção em vez das outras
- **Links** — ADRs, RFCs, tickets ou docs relacionados

Se faltar campo obrigatório, pergunte **no idioma do usuário** antes de gerar.

### Etapa 3: Atribuir número do ADR

Varra o diretório de ADRs existente para o próximo número sequencial:

1. Verifique se existe diretório (`docs/adr/`, `docs/decisions/`, `.adr/` ou `adr/`)
2. Encontre o maior número existente
3. Atribua o seguinte (ex.: existe ADR-007 → este vira ADR-008)
4. Sem diretório: comece em ADR-001 e sugira criar o diretório

### Etapa 4: Gerar o ADR

Gere o ADR no formato escolhido na etapa 1.

### Etapa 5: Oferecer onde salvar

Depois de gerar, pergunte onde salvar:

```
ADR criado: "ADR-{NNN}: {Title}"

Caminho sugerido: docs/adr/{NNN}-{kebab-case-title}.md

Prefere que eu:
1. Salve em docs/adr/ (convenção recomendada)
2. Salve em outro local
3. Apenas mostre o conteúdo (você coloca manualmente)
```

---

## Templates de documento

### Formato MADR (padrão)

```markdown
# ADR-{NNN}: {Title}

- **Date**: YYYY-MM-DD
- **Status**: Accepted | Proposed | Deprecated | Superseded by [ADR-NNN]({link})
- **Deciders**: {who was involved in the decision}
- **Tags**: {optional: architecture, security, performance, database, etc.}

## Context and Problem Statement

{Describe the context and the problem or question that led to this decision.
2–4 sentences. What situation forced this choice?}

## Decision Drivers

- {Driver 1 — e.g., "Must support 10k concurrent users"}
- {Driver 2 — e.g., "Team has no Go experience"}
- {Driver 3 — e.g., "Must be deployable on-premise"}

## Considered Options

- {Option A}
- {Option B}
- {Option C — "Do nothing / status quo" when relevant}

## Decision Outcome

Chosen option: **"{Option A}"**, because {concise rationale tied to decision drivers}.

### Positive Consequences

- {Benefit 1}
- {Benefit 2}

### Negative Consequences

- {Trade-off 1 — be honest}
- {Trade-off 2}

## Pros and Cons of the Options

### {Option A} ✅ Chosen

- ✅ {Pro 1}
- ✅ {Pro 2}
- ❌ {Con 1}

### {Option B}

- ✅ {Pro 1}
- ❌ {Con 1}
- ❌ {Con 2}

### {Option C}

- ✅ {Pro 1}
- ❌ {Con 1}

## Links

- {Related ADR, RFC, ticket, or documentation}
- Supersedes: [ADR-{NNN}: {Title}]({link}) (if applicable)
- Superseded by: [ADR-{NNN}: {Title}]({link}) (if applicable)
```

---

### Formato Nygard (mínimo)

```markdown
# ADR-{NNN}: {Title}

## Status

Accepted | Proposed | Deprecated | Superseded by ADR-{NNN}

## Context

{What is the situation that led to this decision?
What forces are at play — technical, business, organizational?
What constraints exist? 2–5 sentences.}

## Decision

{What did we decide to do?
State it directly, in active voice: "We will use X" or "We decided to adopt Y."
Include a brief rationale — why this option over the alternatives.}

## Consequences

{What becomes easier or better as a result?}
{What becomes harder or worse? Be honest about trade-offs.}
{What new concerns or constraints does this introduce?}
```

---

### Formato Y-Statement (compacto)

```markdown
# ADR-{NNN}: {Title}

**Date**: YYYY-MM-DD | **Status**: Accepted

In the context of **{situation/use case}**,
facing **{concern or constraint}**,
we decided **{the option chosen}**,
to achieve **{quality attribute or goal}**,
accepting **{the downside or trade-off}**.

**Deciders**: {names or roles}
**Links**: {related ADRs, tickets}
```

---

## Checklist de qualidade do ADR

Antes de finalizar:

- [ ] **Título** é frase nominal descrevendo a decisão (não pergunta, não rótulo vago)
- [ ] **Data** incluída (decisões sem data perdem contexto rápido)
- [ ] **Status** correto — Accepted, Proposed, Deprecated ou Superseded
- [ ] **Context** explica as _forças_ que tornaram a decisão necessária, não só o que foi feito
- [ ] **Decision** declarada diretamente e ligada ao contexto
- [ ] **Consequences** incluem trade-offs honestos — não só pontos positivos
- [ ] **Options** (formato MADR) incluem pelo menos 2 alternativas realmente consideradas
- [ ] Links **Supersedes / superseded by** quando aplicável
- [ ] **Arquivo** segue convenção: `NNN-kebab-case-title.md`
- [ ] **Número** sequencial no diretório de ADRs

---

## Convenção de nomeação de arquivos ADR

```
docs/adr/
├── 001-use-postgresql-for-primary-storage.md
├── 002-adopt-event-driven-architecture.md
├── 003-replace-jenkins-with-github-actions.md   ← substitui ADR-001 se relevante
└── README.md                                     ← índice opcional
```

- Números com zeros à esquerda: `001`, `002`, ... `099`, `100`
- Título em kebab-case
- Extensão `.md`
- Diretórios comuns: `docs/adr/`, `docs/decisions/`, `adr/`, `.adr/`

---

## Anti-padrões comuns

### Título como pergunta

**RUIM**: `# ADR-001: Should we use PostgreSQL?`

**BOM**: `# ADR-001: Use PostgreSQL for Primary Storage`

Títulos devem registrar a decisão, não a pergunta. Leitores futuros precisam saber _o que foi decidido_, não só o que foi considerado.

---

### Contexto vago

**RUIM**:

```
We needed a database and chose PostgreSQL.
```

**BOM**:

```
Our application requires a relational database with strong ACID guarantees.
The team has deep PostgreSQL experience. MySQL was evaluated but lacks
native support for JSONB columns, which our schema design requires.
Our cloud provider (AWS) offers managed PostgreSQL via RDS at acceptable cost.
```

Contexto deve explicar as _forças_ — por que a alternativa não era óbvia?

---

### Consequências sem trade-offs

**RUIM**:

```
## Consequences
PostgreSQL is fast and reliable.
```

**BOM**:

```
## Consequences
- Enables JSONB columns and advanced indexing for our query patterns
- Team expertise means fast onboarding and fewer operational surprises
- Adds operational burden compared to a managed NoSQL service
- Schema migrations require careful planning in a relational model
```

Trade-offs honestos são o que tornam ADRs valiosos anos depois.

---

### Editar em vez de substituir

**RUIM**: Editar um ADR antigo para mudar a decisão depois do fato.

**BOM**: Criar novo ADR com `Status: Superseded by ADR-{NNN}` no antigo e link de volta.

ADRs são registros históricos. A decisão antiga estava certa _dado o que se sabia na época_. Substituir preserva esse contexto.

---

### Falta do raciocínio "por que não"

**RUIM**:

```
## Decision
We will use Redis for session storage.
```

**BOM**:

```
## Decision
We will use Redis for session storage. We considered storing sessions in PostgreSQL
(already in our stack) but Redis's built-in TTL support and in-memory performance
make it significantly better suited for high-frequency session reads. The operational
cost of an additional service is justified by the simplified session expiry logic.
```

O raciocínio é _por que esta opção e não as outras_ — não só o que foi escolhido.

---

## Notas importantes

- **ADRs são imutáveis** — nunca edite a decisão. Substitua com novo ADR.
- **Curto é melhor** — cerca de 200–500 palavras é ideal. Se precisar mais, mova detalhes para TDD ou RFC ligado.
- **Contexto envelhece** — sempre data no ADR; o óbvio hoje não será em 3 anos.
- **Consequências honestas** — ADR unilateral perde credibilidade. Engenheiros futuros encontrarão os lados negativos de qualquer forma.
- **Linke tudo** — ADRs relacionados, RFC que levou à decisão, tickets, refs de PR.
- **Adaptação de idioma** — sempre escreva no idioma do usuário.
- **Numere em sequência** — verifique o diretório antes de atribuir número.

## Exemplos de prompts que acionam esta skill

### Inglês

- "Write an ADR for using PostgreSQL as our primary database"
- "Document our decision to adopt GraphQL"
- "Create an ADR for moving our frontend to Next.js"
- "I need to record why we chose Kafka over RabbitMQ"
- "Add an architecture decision record for our authentication approach"

### Português

- "Escreva um ADR sobre a decisão de usar PostgreSQL"
- "Documente a decisão de adotar GraphQL no projeto"
- "Crie um ADR explicando por que escolhemos Kafka"

### Espanhol

- "Escribe un ADR sobre la decisión de usar PostgreSQL"
- "Documenta la decisión de adoptar microservicios"
- "Crea un ADR explicando por qué elegimos Next.js"
