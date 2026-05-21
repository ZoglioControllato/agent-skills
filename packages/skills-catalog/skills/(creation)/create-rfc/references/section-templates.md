# Modelos de seção RFC

Modelos completos de Markdown para cada seção RFC. Leia este arquivo ao gerar um documento RFC.

---

## 1. Cabeçalho e metadados (OBRIGATÓRIO)```markdown

# RFC: [Clear, Action-Oriented Title]

| Field            | Value                                           |
| ---------------- | ----------------------------------------------- |
| **Impact**       | HIGH / MEDIUM / LOW                             |
| **Status**       | NOT STARTED / IN PROGRESS / COMPLETE            |
| **Driver**       | @Name — responsible for the proposal            |
| **Approver**     | @Name1, @Name2 — must approve before action     |
| **Contributors** | @Name3, @Name4 — provide input                  |
| **Informed**     | @Team, @Stakeholder — kept in the loop          |
| **Due Date**     | YYYY-MM-DD (or "TBD")                           |
| **Resources**    | [Link to Jira], [Link to design], [Related RFC] |
| **Created**      | YYYY-MM-DD                                      |
| **Last Updated** | YYYY-MM-DD                                      |

````

**Orientação RACI**:
- **Motorador**: possui a proposta, conduz o processo, implementa o resultado
- **Aprovador**: Tomador(es) de decisão — devem aprovar ou rejeitar explicitamente
- **Contribuidores**: forneça experiência, analise opções, levante preocupações
- **Informado**: Notificado da decisão, mas não precisa agir

**Se estiver faltando**: Pergunte "Quem está conduzindo esta proposta? Quem precisa aprovar a decisão final? Quem deve ser consultado?"

---

## 2. Antecedentes (OBRIGATÓRIO)```markdown
## Background

[2-4 paragraphs describing the current state and why a decision is needed]

**Current State**:
What exists today? What system, process, or situation does this RFC address?

**Problem or Opportunity**:
What is the specific pain point, risk, or opportunity driving this RFC?
Include data or evidence where possible (e.g., "we're spending 10h/week on X" or "incident rate has doubled").

**Why Now**:
What makes this decision urgent or timely?
- Business driver (deadline, market change, regulatory requirement)
- Technical driver (scaling limit, security risk, accumulating debt)
- Team driver (onboarding friction, process inefficiency)

**What Happens If We Don't Decide**:
- [Consequence 1 — e.g., continued cost, growing risk]
- [Consequence 2 — e.g., missed opportunity]
````

**Se não estiver claro**: Pergunte "Qual é a situação atual? Por que esta decisão é necessária agora? O que acontece se não fizermos nada?"

---

## 3. Suposições (OBRIGATÓRIAS)```markdown

## Assumptions

[Explicit statements taken as true for this proposal to hold. If any assumption proves false, this RFC should be revisited.]

| #   | Assumption                                                                | Owner | Confidence | Invalidation Trigger          |
| --- | ------------------------------------------------------------------------- | ----- | ---------- | ----------------------------- |
| 1   | [e.g., "Current traffic will not exceed 10k req/s in the next 12 months"] | @Name | High       | If traffic projections change |
| 2   | [e.g., "The team has capacity to implement this in Q2"]                   | @Name | Medium     | If Q2 roadmap changes         |
| 3   | [e.g., "Vendor X's pricing remains stable"]                               | @Name | Low        | If pricing changes >20%       |

**Confidence levels**:

- **High** — backed by data or contractual guarantees
- **Medium** — reasonable expectation, but not verified
- **Low** — uncertain; decision may need revisiting if this assumption shifts

**If any assumption is invalidated**: The Driver is responsible for reassessing the RFC outcome and communicating changes to Approvers and Informed parties.

````

**Se estiver faltando**: Pergunte "O que você considera garantido para que esta proposta funcione? O que precisaria ser verdade para que a opção recomendada fosse bem-sucedida?"

---

## 4. Critérios de Decisão (OBRIGATÓRIO)```markdown
## Decision Criteria

[State how the decision will be made — before listing options. This prevents criteria from being chosen retroactively to justify a preferred option.]

The option chosen must best satisfy the following criteria, listed in order of priority:

| Priority | Criterion | Description | Weight |
|----------|-----------|-------------|--------|
| 1 | [e.g., Security compliance] | Must meet SOC 2 / GDPR requirements | Must-have |
| 2 | [e.g., Time to production] | Decision should enable delivery within Q2 | High |
| 3 | [e.g., Total cost of ownership] | Prefer lower long-term cost over short-term savings | High |
| 4 | [e.g., Team expertise] | Prefer technologies the team already knows | Medium |
| 5 | [e.g., Reversibility] | Prefer options that are easier to undo if wrong | Medium |
| 6 | [e.g., Vendor lock-in] | Avoid deep dependence on a single vendor | Low |

**Weight guidance**:
- **Must-have**: Non-negotiable. An option that fails this criterion is disqualified.
- **High**: Strong influence on the decision.
- **Medium**: Considered, but can be traded off.
- **Low**: Nice to have; tiebreaker only.

**Decision rule**: The recommended option is the one that satisfies all Must-haves and scores highest across High and Medium criteria. Explicitly call out trade-offs when no option wins on all criteria.
````

**Se estiver faltando**: pergunte "O que é mais importante ao escolher entre as opções? Há algum requisito rígido que desqualificaria uma opção? Como você avaliará velocidade x custo x risco?"

---

## 5. Dados Relevantes (RECOMENDADO)```markdown

## Relevant Data

[Evidence, metrics, or research that informs the decision]

**Quantitative Data**:

- Current cost/time: [e.g., "$X/month", "Y hours/week"]
- Usage/adoption: [e.g., "Z% of users affected"]
- Frequency: [e.g., "N incidents per quarter"]

**Qualitative Data**:

- User/team feedback: [summary of pain points or requests]
- Prior attempts: [what was tried before, why it didn't work]

**External References**:

- Industry benchmarks or standards
- Vendor documentation or case studies
- Research papers or technical articles

````
---

## 6. Opções consideradas (OBRIGATÓRIO — mínimo 2)

Para cada opção, use este modelo. Avalie de acordo com os **Critérios de Decisão** definidos acima.```markdown
## Options Considered

### Option 1: [Option Name] ⭐ (Recommended)

**Description**:
[Clear description of this approach in 1-3 paragraphs]

**How It Works**:
1. Step or component A
2. Step or component B
3. Step or component C

**Pros**:
- [Advantage 1 — be specific]
- [Advantage 2]
- [Advantage 3]

**Cons**:
- [Disadvantage 1 — be honest]
- [Disadvantage 2]

**Estimated Cost**: LARGE / MEDIUM / SMALL
- Effort: [X weeks / person-days]
- Financial: [$X/month] (if applicable)
- Risk: HIGH / MEDIUM / LOW

---

### Option 2: [Option Name]

**Description**:
[Clear description of this approach]

**How It Works**:
1. Step or component A
2. Step or component B

**Pros**:
- [Advantage 1]
- [Advantage 2]

**Cons**:
- [Disadvantage 1]
- [Disadvantage 2]

**Estimated Cost**: LARGE / MEDIUM / SMALL
- Effort: [X weeks / person-days]
- Financial: [$X/month] (if applicable)
- Risk: HIGH / MEDIUM / LOW

---

### Option 3: Do Nothing (always consider)

**Description**:
Maintain the status quo and accept the current situation.

**Pros**:
- No immediate cost or disruption
- No migration risk

**Cons**:
- [Consequence of inaction 1]
- [Consequence of inaction 2]

**Estimated Cost**: SMALL (upfront) / potentially LARGE (long-term)
````

**Matriz de comparação de opções** (para mais de 3 opções):```markdown

## Options Comparison

| Criterion             | Option 1 | Option 2 | Option 3 |
| --------------------- | -------- | -------- | -------- |
| Implementation effort | Medium   | Low      | None     |
| Cost                  | $X/mo    | $Y/mo    | $Z/mo    |
| Time to value         | 4 weeks  | 1 week   | N/A      |
| Risk                  | Low      | Medium   | High     |
| Reversibility         | Easy     | Hard     | N/A      |
| Team impact           | Minimal  | Moderate | None     |

**Recommended**: Option 1 because [brief rationale]

````
---

## 7. Itens de ação (OBRIGATÓRIO)```markdown
## Action Items

[What happens after the decision is made — tasks required to implement the chosen option]

| Action | Owner | Due Date | Status |
|--------|-------|----------|--------|
| [Task 1 — e.g., "Evaluate vendor X with a PoC"] | @Name | YYYY-MM-DD | NOT STARTED |
| [Task 2 — e.g., "Update runbook for new process"] | @Name | YYYY-MM-DD | NOT STARTED |
| [Task 3 — e.g., "Communicate decision to affected teams"] | @Name | YYYY-MM-DD | NOT STARTED |
| [Task 4 — e.g., "Create follow-up TDD for implementation"] | @Name | YYYY-MM-DD | NOT STARTED |

**Note**: If this RFC is approved, a Technical Design Document (TDD) may be needed to plan the implementation in detail.
````

---

## 8. Resultado (OBRIGATÓRIO - preenchido após decisão)```markdown

## Outcome

**Decision**: [Option X was chosen / RFC was rejected / deferred]

**Decision Date**: YYYY-MM-DD

**Decided By**: @Approver1, @Approver2

**Rationale**:
[Why this option was chosen over the alternatives. Be specific — future readers need to understand the reasoning, especially if circumstances change.]

**Key Factors**:

- [Factor 1 that drove the decision]
- [Factor 2]
- [Factor 3]

**Conditions / Caveats** (if any):

- [e.g., "Approved for Q1 only, will be revisited in Q2"]
- [e.g., "Requires security review before implementation"]

**Follow-up**:

- [ ] Create TDD for implementation (if applicable)
- [ ] Update affected documentation
- [ ] Notify informed stakeholders of decision
- [ ] Schedule retrospective in [X months] to evaluate outcome

```

```
