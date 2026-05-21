---
description: Cria Technical Design Documents (TDDs) completos com seções obrigatórias e opcionais por descoberta interativa. Use quando o usuário pedir para "escrever design doc", "criar um TDD", "spec técnica", "documento de arquitetura", "RFC", "proposta de design" ou precisar documentar decisão técnica antes da implementação. NÃO use para READMEs, docs de API ou documentação geral (use docs-writer).
name: technical-design-doc-creator
---

# Technical Design Doc Creator

Você é especialista em criar Technical Design Documents (TDDs) que comunicam com clareza decisões de arquitetura de software, planos de implementação e avaliação de riscos, seguindo boas práticas da indústria.

## Quando usar esta skill

Use esta skill quando:

- O usuário pedir para "criar um TDD", "escrever um design doc" ou "documentar design técnico"
- O usuário pedir para "criar um TDD", "escrever um design doc" ou "documentar design técnico"
- Iniciar feature nova ou projeto de integração
- Desenhar sistema que exige alinhamento de time
- Planejar migração ou substituição de sistemas
- O usuário mencionar documentação para aprovação de stakeholders
- Antes de implementar mudanças técnicas significativas

## Adaptação de idioma

**CRÍTICO**: Gere o TDD sempre no **mesmo idioma do pedido do usuário**. Detecte o idioma automaticamente a partir da entrada e gere todo conteúdo (cabeçalhos, prosa, explicações) nesse idioma.

**Orientações de tradução**:

- Traduza cabeçalhos de seção, prosa e explicações ao idioma do usuário
- Mantenha termos técnicos em inglês quando apropriado (ex.: API, webhook, JSON, rollback, feature flag)
- Mantenha exemplos de código e esquemas agnósticos de linguagem (JSON, diagramas, código)
- Nomes de empresa/produto no idioma original
- Linguagem natural e profissional no idioma alvo
- Consistência terminológica ao longo do documento

**Traduções comuns de cabeçalhos de seção**:

| English                    | Portuguese                      | Spanish                      |
| -------------------------- | ------------------------------- | ---------------------------- |
| Context                    | Contexto                        | Contexto                     |
| Problem Statement          | Definição do Problema           | Definición del Problema      |
| Scope                      | Escopo                          | Alcance                      |
| Technical Solution         | Solução Técnica                 | Solución Técnica             |
| Risks                      | Riscos                          | Riesgos                      |
| Implementation Plan        | Plano de Implementação          | Plan de Implementación       |
| Security Considerations    | Considerações de Segurança      | Consideraciones de Seguridad |
| Testing Strategy           | Estratégia de Testes            | Estrategia de Pruebas        |
| Monitoring & Observability | Monitoramento e Observabilidade | Monitoreo y Observabilidad   |
| Rollback Plan              | Plano de Rollback               | Plan de Reversión            |

## Referência de padrões da indústria

Esta skill segue padrões estabelecidos de:

- **Google Design Docs**: Contexto, objetivos, não-objetivos, design, alternativas, segurança, testes
- **Amazon PR-FAQ**: Working backwards — partir do problema do cliente
- **Padrão RFC**: Resumo, motivação, explicação, alternativas, drawbacks
- **ADR (Architecture Decision Records)**: Contexto, decisão, consequências
- **SRE Book**: Monitoramento, rollback, SLOs, observabilidade
- **PCI DSS**: Requisitos de segurança em sistemas de pagamento
- **OWASP**: Boas práticas de segurança

## Alto nível vs detalhes de implementação

**PRINCÍPIO CRÍTICO**: TDDs documentam **decisões arquiteturais e contratos**, NÃO código de implementação.

### ✅ O que incluir (alto nível)

| Category          | Include                       | Example                                                    |
| ----------------- | ----------------------------- | ---------------------------------------------------------- |
| **API Contracts** | Request/Response schemas      | `POST /subscriptions` com corpo JSON estruturado           |
| **Data Schemas**  | Table structures, field types | Tabela `BillingCustomer` com campos: id, email, stripeId   |
| **Architecture**  | Components, data flow         | "Frontend → API → Service → Stripe → Database"             |
| **Decisions**     | What technology, why chosen   | "Usar Stripe por: alcance global, PCI, documentação forte" |
| **Diagrams**      | Sequence, architecture, flow  | Diagramas Mermaid/PlantUML das interações                  |
| **Structures**    | Log format, event schemas     | Estrutura JSON para logs estruturados                      |
| **Strategies**    | Approach, not commands        | "Rollback via feature flag" (não o comando curl)           |

### ❌ O que evitar (código de implementação)

| Category                 | Avoid                                    | Why                                                |
| ------------------------ | ---------------------------------------- | -------------------------------------------------- |
| **CLI Commands**         | `nx db:generate`, `kubectl rollout undo` | Muito específico, muda com a ferramenta            |
| **Code Snippets**        | TypeScript/JavaScript implementation     | Pertence ao código, não ao doc                     |
| **Framework Specifics**  | `@Injectable()`, `extends Repository`    | Framework pode mudar; importa a decisão            |
| **File Paths**           | `scripts/backfill-feature.ts`            | Detalhe de implementação, não decisão arquitetural |
| **Tool-Specific Syntax** | NestJS decorators, TypeORM entities      | Documente o padrão, não a implementação            |

### Exemplos: alto nível vs implementação

#### ❌ RUIM (excessivamente específico de implementação)

````markdown
**Rollback Steps**:

```bash
curl -X PATCH https://api.launchdarkly.com/flags/FEATURE_X \
  -H "Authorization: Bearer $API_KEY" \
  -d '{"enabled": false}'

nx db:rollback billing
```
````

````

#### ✅ BOM (decisão de alto nível)

```markdown
**Passos de rollback**:
1. Desabilitar feature flag pelo painel do serviço de flags
2. Reverter schema do banco com down migration
3. Verificar retorno ao estado anterior
4. Monitorar taxa de erro para confirmar rollback
````

#### ❌ RUIM (código de implementação)

````markdown
**Implementação do serviço**:

```typescript
@Injectable()
export class CustomerService {
  @Transactional({ connectionName: 'billing' })
  async create(data: CreateCustomerDto) {
    const customer = new Customer()
    customer.email = data.email
    return this.repository.save(customer)
  }
}
```
````

````

#### ✅ BOM (estrutura em alto nível)

```markdown
**Camada de serviços**:
- `CustomerService`: Ciclo de vida do cliente
  - `create()`: Cria cliente, valida unicidade de e-mail
  - `getById()`: Busca cliente por ID
  - `updatePaymentMethod()`: Atualiza método de pagamento padrão
- Escritas com transações para consistência
- Chamadas à API Stripe externa e cache local dos resultados
````

### Diretriz: pergunte “isso vai mudar?”

Antes de detalhar no TDD:

- **“Se mudarmos de framework, esse detalhe ainda faz sentido?”**
  - SIM → Inclua (decisão arquitetural)
  - NÃO → Exclua (detalhe de implementação)

- **“Outra implementação poderia satisfazer o requisito?”**
  - SIM → Foque no requisito, não na implementação
  - NÃO → Você pode estar excessivamente específico

**Meta**: O TDD sobrevive a mudanças de implementação. Se migrar NestJS→Express ou TypeORM→Prisma, o TDD deve continuar válido.

## Estrutura do documento

### Seções obrigatórias

Estas seções são **obrigatórias**. Se o usuário não fornecer informação, **pergunte** com a ferramenta AskQuestion:

1. **Cabeçalho e metadata**
2. **Contexto**
3. **Problema e motivação**
4. **Escopo** (dentro / fora)
5. **Solução técnica**
6. **Riscos**
7. **Plano de implementação**

### Seções críticas (pergunte se faltarem)

**Altamente recomendadas**, em especial para:

- Integrações de pagamento (Segurança **obrigatória**)
- Sistemas em produção (Monitoramento e Rollback **obrigatórios**)
- Integrações externas (Dependências, Segurança)

8. **Considerações de segurança** (obrigatório para pagamento/auth/PII)
9. **Estratégia de testes**
10. **Monitoramento e observabilidade**
11. **Plano de rollback**

### Seções sugeridas (ofereça ao usuário)

Pergunte: "Deseja adicionar estas seções agora ou depois?"

12. **Métricas de sucesso**
13. **Glossário e termos de domínio**
14. **Alternativas consideradas**
15. **Dependências**
16. **Requisitos de performance**
17. **Plano de migração** (se aplicável)
18. **Questões em aberto**
19. **Roadmap / linha do tempo**
20. **Aprovação e sign-off**

## Adaptação ao tamanho do projeto

Heurística para complexidade:

### Projeto pequeno (‹ 1 semana)

**Seções**: 1, 2, 3, 4, 5, 6, 7, 9

**Pule**: Alternativas, plano de migração, aprovação

### Projeto médio (1–4 semanas)

**Seções**: 1–11, 15, 18

**Ofereça**: Métricas de sucesso, glossário, alternativas, performance

### Projeto grande (› 1 mês)

**Todas** (1–20)

**Crítico**: todas as obrigatórias + críticas bem detalhadas

## Fluxo interativo

### Etapa 1: Coleta inicial

Use **AskQuestion** para coletar dados básicos:

```json
{
  "title": "Informações do projeto para o TDD",
  "questions": [
    {
      "id": "project_name",
      "prompt": "Qual é o nome da feature/integração/projeto?",
      "options": []
    },
    {
      "id": "project_size",
      "prompt": "Qual o tamanho esperado do projeto?",
      "options": [
        { "id": "small", "label": "Pequeno (‹ 1 semana)" },
        { "id": "medium", "label": "Médio (1–4 semanas)" },
        { "id": "large", "label": "Grande (› 1 mês)" }
      ]
    },
    {
      "id": "project_type",
      "prompt": "Que tipo de projeto é este?",
      "allow_multiple": true,
      "options": [
        { "id": "integration", "label": "Integração externa (API, serviço)" },
        { "id": "feature", "label": "Nova feature" },
        { "id": "refactor", "label": "Refatoração/migração" },
        { "id": "infrastructure", "label": "Infraestrutura/plataforma" },
        { "id": "payment", "label": "Sistema de pagamento/billing" },
        { "id": "auth", "label": "Autenticação/autorização" },
        { "id": "data", "label": "Migração/processamento de dados" }
      ]
    },
    {
      "id": "has_context",
      "prompt": "Você tem definição clara do problema e contexto?",
      "options": [
        { "id": "yes", "label": "Sim, posso fornecer agora" },
        { "id": "partial", "label": "Parcialmente — preciso de ajuda para clarificar" },
        { "id": "no", "label": "Não — preciso de ajuda para definir" }
      ]
    }
  ]
}
```

### Etapa 2: Validar informações obrigatórias

Com base nas respostas, verifique se o usuário pode fornecer:

**Campos obrigatórios a perguntar se faltarem**:

- Tech lead / responsável
- Membros do time
- Descrição do problema (o quê/por quê/impacto)
- O que está no escopo
- O que está fora do escopo
- Abordagem técnica de alto nível
- Pelo menos 3 riscos
- Decomposição de tarefas de implementação

**Pergunte com AskQuestion ou conversa natural NO IDIOMA DO USUÁRIO**:

**Exemplo em inglês**:

```
I need the following information to create the TDD:

1. **Problem Statement**:
   - What problem are we solving?
   - Why is this important now?
   - What happens if we don't solve it?

2. **Scope**:
   - What WILL be delivered in this project?
   - What will NOT be included (out of scope)?

3. **Technical Approach**:
   - High-level description of the solution
   - Main components involved
   - Integration points

Can you provide this information?
```

**Exemplo em português**:

```
Preciso das seguintes informações para criar o TDD:

1. **Definição do Problema**:
   - Que problema estamos resolvendo?
   - Por que isso é importante agora?
   - O que acontece se não resolvermos?

2. **Escopo**:
   - O que SERÁ entregue neste projeto?
   - O que NÃO será incluído (fora do escopo)?

3. **Abordagem Técnica**:
   - Descrição de alto nível da solução
   - Principais componentes envolvidos
   - Pontos de integração

Você pode fornecer essas informações?
```

### Etapa 3: Verificar seções críticas

Segundo `project_type`, definir se seções críticas são obrigatórias:

| Tipo de projeto   | Seções críticas necessárias                    |
| ----------------- | ---------------------------------------------- |
| `payment`, `auth` | **Considerações de segurança** (obrigatório)   |
| Tudo em produção  | **Monitoramento e observabilidade** (obrig.)   |
| Tudo em produção  | **Plano de rollback** (obrigatório)            |
| `integration`     | **Dependências**, **Segurança**                |
| Todos             | **Estratégia de testes** (altamente recomend.) |

**Se faltarem seções críticas, PERGUNTE NO IDIOMA DO USUÁRIO**:

**English**:

```
This is a [payment/auth/production] system. These sections are CRITICAL:

❗ **Security Considerations** - Required for compliance (PCI DSS, OWASP)
❗ **Monitoring & Observability** - Required to detect issues in production
❗ **Rollback Plan** - Required to revert if something fails

Can you provide:
1. Security requirements (auth, encryption, PII handling)?
2. What metrics will you monitor?
3. How will you rollback if something goes wrong?
```

**Portuguese**:

```
Este é um sistema de [pagamento/autenticação/produção]. Estas seções são CRÍTICAS:

❗ **Considerações de Segurança** - Obrigatório para compliance (PCI DSS, OWASP)
❗ **Monitoramento e Observabilidade** - Obrigatório para detectar problemas em produção
❗ **Plano de Rollback** - Obrigatório para reverter se algo falhar

Você pode fornecer:
1. Requisitos de segurança (autenticação, criptografia, tratamento de PII)?
2. Quais métricas você vai monitorar?
3. Como você fará rollback se algo der errado?
```

### Etapa 4: Oferecer seções sugeridas

Com as obrigatórias cobertas, **ofereça opções NO IDIOMA DO USUÁRIO**:

**English**:

```
I can also add these sections to make the TDD more complete:

📊 **Success Metrics** - How will you measure success?
📚 **Glossary** - Define domain-specific terms
⚖️ **Alternatives Considered** - Why this approach over others?
🔗 **Dependencies** - External services/teams needed
⚡ **Performance Requirements** - Latency, throughput, availability targets
📋 **Open Questions** - Track pending decisions

Would you like me to add any of these now? (You can add them later)
```

**Portuguese**:

```
Também posso adicionar estas seções para tornar o TDD mais completo:

📊 **Métricas de Sucesso** - Como você vai medir o sucesso?
📚 **Glossário** - Definir termos específicos do domínio
⚖️ **Alternativas Consideradas** - Por que esta abordagem em vez de outras?
🔗 **Dependências** - Serviços/times externos necessários
⚡ **Requisitos de Performance** - Latência, throughput, disponibilidade
📋 **Questões em Aberto** - Rastrear decisões pendentes

Gostaria que eu adicionasse alguma dessas agora? (Você pode adicionar depois)
```

### Etapa 5: Gerar o documento

Gere o TDD em Markdown seguindo os templates abaixo.

### Etapa 6: Oferecer integração Confluence

Se a skill Confluence Assistant estiver disponível, **pergunte no idioma do usuário**:

**English**:

```
Would you like me to publish this TDD to Confluence?
- I can create a new page in your space
- Or update an existing page
```

**Portuguese**:

```
Gostaria que eu publicasse este TDD no Confluence?
- Posso criar uma nova página no seu espaço
- Ou atualizar uma página existente
```

## Templates de seção

### 1. Cabeçalho e metadata (obrigatório)

```markdown
# TDD - [Project/Feature Name]

| Field           | Value                        |
| --------------- | ---------------------------- |
| Tech Lead       | @Name                        |
| Product Manager | @Name (if applicable)        |
| Team            | Name1, Name2, Name3          |
| Epic/Ticket     | [Link to Jira/Linear]        |
| Figma/Design    | [Link if applicable]         |
| Status          | Draft / In Review / Approved |
| Created         | YYYY-MM-DD                   |
| Last Updated    | YYYY-MM-DD                   |
```

**Se o usuário não fornecer**: Peça Tech lead, membros do time e link do epic.

---

### 2. Contexto (obrigatório)

```markdown
## Context

[2-4 paragraph description of the project]

**Background**:
What is the current state? What system/feature does this relate to?

**Domain**:
What business domain is this part of? (e.g., billing, authentication, content delivery)

**Stakeholders**:
Who cares about this project? (users, business, compliance, etc.)
```

**Se não estiver claro**: Pergunte se o usuário pode descrever a situação atual e em qual domínio de negócio isso se insere.

---

### 3. Problema e motivação (obrigatório)

```markdown
## Problem Statement & Motivation

### Problems We're Solving

- **Problem 1**: [Specific pain point with impact]
  - Impact: [quantify if possible - time wasted, cost, user friction]
- **Problem 2**: [Another pain point]
  - Impact: [quantify if possible]

### Why Now?

- [Business driver - market expansion, competitor pressure, regulatory requirement]
- [Technical driver - technical debt, scalability limits]
- [User driver - customer feedback, usage patterns]

### Impact of NOT Solving

- **Business**: [revenue loss, competitive disadvantage]
- **Technical**: [technical debt accumulation, system degradation]
- **Users**: [poor experience, churn risk]
```

**Se o usuário disser “integrar com X”**: Pergunte “Que problemas específicos esta integração resolve? Por que é importante agora? O que acontece se não fizermos?”

---

### 4. Escopo (obrigatório)

```markdown
## Scope

### ✅ In Scope (V1 - MVP)

Explicit list of what WILL be delivered:

- Feature/capability 1
- Feature/capability 2
- Feature/capability 3
- Integration point A
- Data migration for X

### ❌ Out of Scope (V1)

Explicit list of what will NOT be included in this phase:

- Feature X (deferred to V2)
- Integration Y (not needed for MVP)
- Advanced analytics (future enhancement)
- Multi-region support (V2)

### 🔮 Future Considerations (V2+)

What might come later:

- Feature A (user demand dependent)
- Feature B (after V1 validation)
```

**Se o usuário não definir**: Pergunte quais são os must-have do V1 e o que pode esperar versões futuras.

---

### 5. Solução técnica (obrigatória)

````markdown
## Technical Solution

### Architecture Overview

[High-level description of the solution]

**Key Components**:

- Component A: [responsibility]
- Component B: [responsibility]
- Component C: [responsibility]

**Architecture Diagram**:

[Include Mermaid diagram, PlantUML, or link to diagram]

```mermaid
graph LR
    A[Frontend] -->|HTTP| B[API Gateway]
    B -->|GraphQL| C[Backend Service]
    C -->|REST| D[External API]
    C -->|Write| E[(Database)]
```
````

### Data Flow

1. **Step 1**: User action → Frontend
2. **Step 2**: Frontend → API Gateway (POST /resource)
3. **Step 3**: API Gateway → Service Layer
4. **Step 4**: Service → External API (if applicable)
5. **Step 5**: Service → Database (persist)
6. **Step 6**: Response → Frontend

### APIs & Endpoints

| Endpoint               | Method | Description      | Request     | Response         |
| ---------------------- | ------ | ---------------- | ----------- | ---------------- |
| `/api/v1/resource`     | POST   | Creates resource | `CreateDto` | `ResourceDto`    |
| `/api/v1/resource/:id` | GET    | Get by ID        | -           | `ResourceDto`    |
| `/api/v1/resource/:id` | DELETE | Delete resource  | -           | `204 No Content` |

**Example Request/Response**:

```json
// POST /api/v1/resource
{
  "name": "Example",
  "type": "standard"
}

// Response 201 Created
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Example",
  "type": "standard",
  "status": "active",
  "createdAt": "2026-02-04T10:00:00Z"
}
```

### Database Changes

**New Tables**:

- `{ModuleName}{EntityName}` - [description]
  - Primary fields: id, userId, name, status
  - Timestamps: createdAt, updatedAt
  - Indexes: userId, status (for query performance)

**Schema Changes** (if modifying existing):

- Add column `newField` to `ExistingTable`
  - Type: [varchar/integer/jsonb/etc.]
  - Constraints: [nullable/unique/foreign key]

**Migration Strategy**:

- Generate migration from schema changes
- Test migration on staging environment first
- Run during low-traffic window
- Have rollback migration ready

**Data Backfill** (if needed):

- Affected records: Estimate quantity
- Processing time: Estimate duration for data migration
- Validation: How to verify data integrity after backfill

````

**Se a descrição for vaga**: Pergunte quais são os componentes principais, como os dados fluem e quais APIs serão criadas ou alteradas.

---

### 6. Riscos (obrigatório)

```markdown
## Risks

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| External API downtime | High | Medium | Implement circuit breaker, cache responses, fallback to degraded mode |
| Data migration failure | High | Low | Test on staging copy, run dry-run first, have rollback script ready |
| Performance degradation | Medium | Medium | Load test before deployment, implement caching, monitor latency |
| Security vulnerability | High | Low | Security review, penetration testing, follow OWASP guidelines |
| Scope creep | Medium | High | Strict scope definition, change request process, regular stakeholder alignment |

**Risk Scoring**:
- **Impact**: High (system down, data loss) / Medium (degraded UX) / Low (minor inconvenience)
- **Probability**: High (>50%) / Medium (20-50%) / Low (<20%)
````

**Se houver menos de 3 riscos**: Pergunte o que pode dar errado; considere dependências externas, integridade de dados, performance, segurança e mudança de escopo.

---

### 7. Plano de implementação (obrigatório)

```markdown
## Implementation Plan

| Phase                 | Task              | Description                            | Owner   | Status | Estimate |
| --------------------- | ----------------- | -------------------------------------- | ------- | ------ | -------- |
| **Phase 1 - Setup**   | Setup credentials | Obtain API keys, configure environment | @Dev1   | TODO   | 1d       |
|                       | Database setup    | Create schema, configure datasource    | @Dev1   | TODO   | 1d       |
| **Phase 2 - Core**    | Entities & repos  | Create TypeORM entities, repositories  | @Dev2   | TODO   | 3d       |
|                       | Services          | Implement business logic services      | @Dev2   | TODO   | 4d       |
| **Phase 3 - APIs**    | REST endpoints    | Create controllers, DTOs               | @Dev3   | TODO   | 3d       |
|                       | Integration       | Integrate with external API            | @Dev1   | TODO   | 3d       |
| **Phase 4 - Testing** | Unit tests        | Test services and repositories         | @Team   | TODO   | 2d       |
|                       | E2E tests         | Test full flow                         | @Team   | TODO   | 3d       |
| **Phase 5 - Deploy**  | Staging deploy    | Deploy to staging, smoke test          | @DevOps | TODO   | 1d       |
|                       | Production deploy | Phased rollout to production           | @DevOps | TODO   | 1d       |

**Total Estimate**: ~20 days (4 weeks)

**Dependencies**:

- Must complete Phase N before Phase N+1
- External API access required before Phase 3
- Security review required before Phase 5
```

**Se o plano for vago**: Pergunte por fases com tarefas específicas, donos por parte e linha do tempo estimada.

---

### 8. Considerações de segurança (crítico para pagamento/auth/PII)

```markdown
## Security Considerations

### Authentication & Authorization

- **Authentication**: How users prove identity
  - Example: JWT tokens, OAuth 2.0, session-based
- **Authorization**: What authenticated users can access
  - Example: Role-based (RBAC), Attribute-based (ABAC)
  - Ensure users can only access their own resources

### Data Protection

**Encryption**:

- **At Rest**: Database encryption enabled (AES-256)
- **In Transit**: TLS 1.3 for all API communication
- **Secrets**: Store API keys in environment variables / secret manager (AWS Secrets Manager, HashiCorp Vault)

**PII Handling**:

- What PII is collected: [email, name, payment info]
- Legal basis: [consent, contract, legitimate interest]
- Retention: [how long data is kept]
- Deletion: [GDPR right to be forgotten implementation]

### Compliance Requirements

| Regulation  | Requirement                        | Implementation                                    |
| ----------- | ---------------------------------- | ------------------------------------------------- |
| **GDPR**    | Data protection, right to deletion | Implement data export/deletion endpoints          |
| **PCI DSS** | No storage of card data            | Use Stripe tokenization, never store CVV/full PAN |
| **LGPD**    | Brazil data protection             | Same as GDPR compliance                           |

### Security Best Practices

- ✅ Input validation on all endpoints
- ✅ SQL injection prevention (parameterized queries)
- ✅ XSS prevention (sanitize user input, CSP headers)
- ✅ CSRF protection (tokens for state-changing operations)
- ✅ Rate limiting (e.g., 10 req/min per user, 100 req/min per IP)
- ✅ Audit logging (log all sensitive operations)

### Secrets Management

**API Keys**:

- Storage: Environment variables or secret management service
- Rotation: Define rotation policy (e.g., every 90 days)
- Access: Backend services only, never exposed to frontend
- Examples: Stripe keys, database credentials, API tokens

**Webhook Signatures**:

- Validate webhook signatures from external services
- Reject requests without valid signature headers
- Log invalid signature attempts for security monitoring
```

**Se faltar e envolver pagamento/auth**: Pergunte "This is a [payment/auth] system. I need security details: How will you handle authentication? What encryption will be used? What PII is collected? Any compliance requirements (GDPR, PCI DSS)?"

---

### 9. Estratégia de testes (crítico)

```markdown
## Testing Strategy

| Test Type             | Scope                    | Coverage Target          | Approach             |
| --------------------- | ------------------------ | ------------------------ | -------------------- |
| **Unit Tests**        | Services, repositories   | > 80%                    | Jest with mocks      |
| **Integration Tests** | API endpoints + database | Critical paths           | Supertest + test DB  |
| **E2E Tests**         | Full user flows          | Happy path + error cases | Playwright           |
| **Contract Tests**    | External API integration | API contract validation  | Pact or manual mocks |
| **Load Tests**        | Performance under load   | Baseline performance     | k6 or Artillery      |

### Test Scenarios

**Unit Tests**:

- ✅ Service business logic (create, update, delete)
- ✅ Repository query methods
- ✅ Error handling (throw correct exceptions)
- ✅ Edge cases (null inputs, invalid data)

**Integration Tests**:

- ✅ POST `/api/v1/resource` → creates in DB
- ✅ GET `/api/v1/resource/:id` → returns correct data
- ✅ DELETE `/api/v1/resource/:id` → removes from DB
- ✅ Invalid input → returns 400 Bad Request
- ✅ Unauthorized access → returns 401/403

**E2E Tests**:

- ✅ User creates resource → success flow
- ✅ User tries to access another user's resource → denied
- ✅ External API fails → graceful degradation
- ✅ Database connection lost → proper error handling

**Load Tests**:

- Target: 100 req/s sustained, 500 req/s peak
- Monitor: Latency (p50, p95, p99), error rate, throughput
- Pass criteria: p95 < 500ms, error rate < 1%

### Test Data Management

- Use factories for test data (e.g., `@faker-js/faker`)
- Seed test database with realistic data
- Clean up test data after each test
- Use separate test database (never use production)
```

**Se faltar**: Pergunte "How will you test this? What test types are needed (unit, integration, e2e)? What are critical test scenarios?"

---

### 10. Monitoramento e observabilidade (crítico em produção)

````markdown
## Monitoring & Observability

### Metrics to Track

| Metric                    | Type       | Alert Threshold   | Dashboard          |
| ------------------------- | ---------- | ----------------- | ------------------ |
| `api.latency`             | Latency    | p95 > 1s for 5min | DataDog / Grafana  |
| `api.error_rate`          | Error rate | > 1% for 5min     | DataDog / Grafana  |
| `external_api.latency`    | Latency    | p95 > 2s for 5min | DataDog            |
| `external_api.errors`     | Counter    | > 5 in 1min       | PagerDuty          |
| `database.query_time`     | Duration   | p95 > 100ms       | DataDog            |
| `webhook.processing_time` | Duration   | > 5s              | Internal Dashboard |

### Structured Logging

**Log Format** (JSON):

```json
{
  "level": "info",
  "timestamp": "2026-02-04T10:00:00Z",
  "message": "Resource created",
  "context": {
    "userId": "user-123",
    "resourceId": "res-456",
    "action": "create",
    "duration_ms": 45
  }
}
```
````

**What to Log**:

- ✅ All API requests (method, path, status, duration)
- ✅ External API calls (endpoint, status, duration)
- ✅ Database queries (slow queries > 100ms)
- ✅ Errors and exceptions (stack trace, context)
- ✅ Business events (resource created, payment processed)

**What NOT to Log**:

- ❌ Passwords, API keys, secrets
- ❌ Full credit card numbers
- ❌ Sensitive PII (redact or hash)

### Alerts

| Alert                              | Severity      | Channel            | On-Call Action                              |
| ---------------------------------- | ------------- | ------------------ | ------------------------------------------- |
| Error rate > 5%                    | P1 (Critical) | PagerDuty          | Immediate investigation, rollback if needed |
| External API down                  | P1 (Critical) | PagerDuty          | Enable fallback mode, notify stakeholders   |
| Latency > 2s (p95)                 | P2 (High)     | Slack #engineering | Investigate performance degradation         |
| Webhook failures > 20              | P2 (High)     | Slack #engineering | Check webhook endpoint, Stripe status       |
| Database connection pool exhausted | P1 (Critical) | PagerDuty          | Scale up connections or investigate leak    |

### Dashboards

**Operational Dashboard**:

- Request rate (per endpoint)
- Error rate (overall and per endpoint)
- Latency (p50, p95, p99)
- External API health
- Database performance

**Business Dashboard**:

- Resources created (count per day)
- Active users
- Conversion metrics (if applicable)

````

**Se faltar em sistema de produção**: Pergunte "How will you monitor this in production? What metrics matter? What alerts do you need?"

---

### 11. Plano de rollback (crítico em produção)

```markdown
## Rollback Plan

### Deployment Strategy

- **Feature Flag**: `FEATURE_X_ENABLED` (LaunchDarkly / custom)
- **Phased Rollout**:
  - Phase 1: 5% of traffic (1 day)
  - Phase 2: 25% of traffic (1 day)
  - Phase 3: 50% of traffic (1 day)
  - Phase 4: 100% of traffic

- **Canary Deployment**: Deploy to 1 instance first, monitor for 1h before full rollout

### Rollback Triggers

| Trigger | Action |
|---------|--------|
| Error rate > 5% for 5 minutes | **Immediate rollback** - disable feature flag |
| Latency > 3s (p95) for 10 minutes | **Investigate** - rollback if no quick fix |
| External API integration failing > 50% | **Rollback** - revert to previous version |
| Database migration fails | **STOP** - do not proceed, investigate |
| Customer reports of data loss | **Immediate rollback** + incident response |

### Rollback Steps

**1. Immediate Rollback (< 5 minutes)**:
- **Feature Flag**: Disable via feature flag dashboard (instant)
- **Deployment**: Revert to previous version via deployment tool (2-3 minutes)

**2. Database Rollback** (if schema changed):
- Run down migration using migration tool
- Verify schema integrity
- Confirm data consistency

**3. Communication**:

- Notify #engineering Slack channel
- Update status page (if customer-facing)
- Create incident ticket
- Schedule post-mortem within 24h

### Post-Rollback

- **Root Cause Analysis**: Within 24 hours
- **Fix**: Implement fix in development environment
- **Re-test**: Full test suite + additional tests for root cause
- **Re-deploy**: Following same phased rollout strategy

### Database Rollback Considerations

- **Migrations**: Always create reversible migrations (down migration)
- **Data Backfill**: If data was modified, have script to restore previous state
- **Backup**: Take database snapshot before running migrations
- **Testing**: Test rollback procedure on staging before production

````

**Se faltar em produção**: Pergunte "What happens if the deploy goes wrong? How will you rollback? What are the triggers for rollback?"

---

### 12. Métricas de sucesso (sugerido)

```markdown
## Success Metrics

| Metric                  | Baseline      | Target  | Measurement        |
| ----------------------- | ------------- | ------- | ------------------ |
| API latency (p95)       | N/A (new API) | < 200ms | DataDog APM        |
| Error rate              | N/A           | < 0.1%  | Sentry / logs      |
| Conversion rate         | N/A           | > 70%   | Analytics          |
| User satisfaction       | N/A           | NPS > 8 | User survey        |
| Time to complete action | N/A           | < 30s   | Frontend analytics |

**Business Metrics**:

- Increase in [metric] by [X%]
- Reduction in [cost/time] by [Y%]
- User adoption: [Z%] of users using new feature within 30 days

**Technical Metrics**:

- Zero production incidents in first 30 days
- Test coverage > 80%
- Documentation completeness: 100% of public APIs documented
```

---

### 13. Glossário e termos de domínio (sugerido)

```markdown
## Glossary

| Term                | Description                                                           |
| ------------------- | --------------------------------------------------------------------- |
| **Customer**        | A user who has an active subscription or has made a purchase          |
| **Subscription**    | Recurring payment arrangement with defined interval (monthly, annual) |
| **Trial**           | Free period for users to test service before payment required         |
| **Webhook**         | HTTP callback from external service to notify of events               |
| **Idempotency**     | Operation can be applied multiple times with same result              |
| **Circuit Breaker** | Pattern to prevent cascading failures when external service is down   |

**Acronyms**:

- **API**: Application Programming Interface
- **SLA**: Service Level Agreement
- **PII**: Personally Identifiable Information
- **GDPR**: General Data Protection Regulation
- **PCI DSS**: Payment Card Industry Data Security Standard
```

---

### 14. Alternativas consideradas (sugerido)

```markdown
## Alternatives Considered

| Option                | Pros                                                     | Cons                                                                        | Why Not Chosen                                    |
| --------------------- | -------------------------------------------------------- | --------------------------------------------------------------------------- | ------------------------------------------------- |
| **Option A** (Chosen) | + Best documentation<br>+ Global support<br>+ Mature SDK | - Cost: 2.9% + $0.30<br>- Vendor lock-in                                    | ✅ **Chosen** - Best balance of features and cost |
| Option B              | + Lower fees (2.5%)<br>+ Brand recognition               | - Poor developer experience<br>- Limited international support              | Developer experience inferior, harder to maintain |
| Option C              | + Full control<br>+ No transaction fees                  | - High maintenance cost<br>- Compliance burden (PCI DSS)<br>- Security risk | Too risky and expensive to maintain in-house      |
| Option D              | + Cheapest option                                        | - No support<br>- Limited features<br>- Unknown reliability                 | Too risky for production payment processing       |

**Decision Criteria**:

1. Developer experience and documentation quality (weight: 40%)
2. Total cost of ownership (weight: 30%)
3. International support and compliance (weight: 20%)
4. Reliability and uptime (weight: 10%)

**Why Option A Won**:

- Scored highest on developer experience (critical for fast iteration)
- Industry-standard for startups (easier to hire developers with experience)
- Built-in compliance (PCI DSS, SCA, 3D Secure) reduces risk
```

---

### 15. Dependências (sugerido)

```markdown
## Dependencies

| Dependency            | Type           | Owner       | Status           | Risk                |
| --------------------- | -------------- | ----------- | ---------------- | ------------------- |
| Stripe API            | External       | Stripe Inc. | Production-ready | Low (99.99% uptime) |
| Identity Module       | Internal       | Team Auth   | Production-ready | Low                 |
| Database (PostgreSQL) | Infrastructure | DevOps      | Ready            | Low                 |
| Redis (caching)       | Infrastructure | DevOps      | Needs setup      | Medium              |
| Feature flag service  | Internal       | Platform    | Ready            | Low                 |

**Approval Requirements**:

- [ ] Security team review (for payment/auth projects)
- [ ] Compliance sign-off (for PII/payment data)
- [ ] Ops team ready for monitoring setup
- [ ] Product sign-off on scope

**Blockers**:

- Waiting for Stripe production keys (ETA: 2026-02-10)
- Need Redis setup in staging (ETA: 2026-02-08)
```

---

### 16. Requisitos de performance (sugerido)

```markdown
## Performance Requirements

| Metric              | Requirement                   | Measurement Method |
| ------------------- | ----------------------------- | ------------------ |
| API Latency (p50)   | < 100ms                       | DataDog APM        |
| API Latency (p95)   | < 500ms                       | DataDog APM        |
| API Latency (p99)   | < 1s                          | DataDog APM        |
| Throughput          | 1000 req/s sustained          | Load testing (k6)  |
| Availability        | 99.9% (< 8.76h downtime/year) | Uptime monitoring  |
| Database query time | < 50ms (p95)                  | Slow query log     |

**Load Testing Plan**:

- Baseline: 100 req/s for 10 minutes
- Peak: 500 req/s for 5 minutes
- Spike: 1000 req/s for 1 minute

**Scalability**:

- Horizontal scaling: Add more instances (Kubernetes autoscaling)
- Database: Read replicas if needed (after 10k req/s)
- Caching: Redis for frequently accessed data (> 100 req/s per resource)
```

---

### 17. Plano de migração (sugerido — se aplicável)

```markdown
## Migration Plan

### Migration Strategy

**Type**: [Blue-Green / Rolling / Big Bang / Phased]

**Phases**:

| Phase             | Description                            | Users Affected | Duration | Rollback            |
| ----------------- | -------------------------------------- | -------------- | -------- | ------------------- |
| 1. Preparation    | Set up new system, run in parallel     | 0%             | 1 week   | N/A                 |
| 2. Shadow Mode    | New system processes but doesn't serve | 0%             | 1 week   | Instant             |
| 3. Pilot          | 5% of users on new system              | 5%             | 1 week   | < 5min              |
| 4. Ramp Up        | 50% of users on new system             | 50%            | 1 week   | < 5min              |
| 5. Full Migration | 100% of users on new system            | 100%           | 1 day    | < 5min              |
| 6. Decommission   | Turn off old system                    | 0%             | 1 week   | Restore from backup |

### Data Migration

**Source**: Old system database
**Destination**: New system database
**Volume**: [X million records]
**Method**: [ETL script / database replication / API sync]

**Steps**:

1. Export data from old system (script: `scripts/export-old-data.ts`)
2. Transform data to new schema (script: `scripts/transform-data.ts`)
3. Validate data integrity (checksums, row counts)
4. Load into new system (script: `scripts/load-new-data.ts`)
5. Verify: Run parallel reads, compare results

**Timeline**:

- Dry run on staging: 2026-02-10
- Production migration window: 2026-02-15 02:00-06:00 UTC (low traffic)

### Backward Compatibility

- Old API endpoints will remain active for 90 days
- Deprecation warnings added to responses
- Client libraries updated with migration guide
```

---

### 18. Questões em aberto (sugerido)

```markdown
## Open Questions

| #   | Question                                               | Context                                        | Owner     | Status           | Decision Date |
| --- | ------------------------------------------------------ | ---------------------------------------------- | --------- | ---------------- | ------------- |
| 1   | How to handle trial expiration without payment method? | User loses access immediately or grace period? | @Product  | 🟡 In Discussion | TBD           |
| 2   | Allow multiple trials for same email?                  | Prevent abuse vs. legitimate use cases         | @TechLead | 🔴 Open          | TBD           |
| 3   | SLA for webhook processing?                            | Stripe retries for 72h, what's our target?     | @Backend  | 🔴 Open          | TBD           |
| 4   | Support for promo codes in V1?                         | Marketing requested, is it in scope?           | @Product  | ✅ Resolved: V2  | 2026-02-01    |
| 5   | Fallback if Identity Module fails?                     | Can we create subscription without user data?  | @TechLead | 🔴 Open          | TBD           |

**Status Legend**:

- 🔴 Open - needs decision
- 🟡 In Discussion - actively being discussed
- ✅ Resolved - decision made
```

---

### 19. Roadmap / linha do tempo (sugerido)

```markdown
## Roadmap / Timeline

| Phase                    | Deliverables                                                                      | Duration | Target Date | Status         |
| ------------------------ | --------------------------------------------------------------------------------- | -------- | ----------- | -------------- |
| **Phase 0: Setup**       | - Stripe credentials<br>- Staging environment<br>- SDK installed                  | 2 days   | 2026-02-05  | ✅ Complete    |
| **Phase 1: Persistence** | - Entities created<br>- Repositories implemented<br>- Migrations generated        | 3 days   | 2026-02-08  | 🟡 In Progress |
| **Phase 2: Services**    | - CustomerService<br>- SubscriptionService<br>- Identity integration              | 5 days   | 2026-02-15  | ⏳ Pending     |
| **Phase 3: APIs**        | - POST /subscriptions<br>- DELETE /subscriptions/:id<br>- GET /subscriptions      | 3 days   | 2026-02-18  | ⏳ Pending     |
| **Phase 4: Webhooks**    | - Webhook endpoint<br>- Signature validation<br>- Event handlers                  | 4 days   | 2026-02-22  | ⏳ Pending     |
| **Phase 5: Testing**     | - Unit tests (80% coverage)<br>- Integration tests<br>- E2E tests                 | 5 days   | 2026-02-27  | ⏳ Pending     |
| **Phase 6: Deploy**      | - Documentation<br>- Monitoring setup<br>- Staging deploy<br>- Production rollout | 3 days   | 2026-03-02  | ⏳ Pending     |

**Total Duration**: ~25 days (5 weeks)

**Milestones**:

- 🎯 M1: MVP ready for staging (2026-02-22)
- 🎯 M2: Production deployment (2026-03-02)
- 🎯 M3: 100% rollout complete (2026-03-09)

**Critical Path**:
Phase 0 → Phase 1 → Phase 2 → Phase 3 → Phase 4 → Phase 5 → Phase 6
```

---

### 20. Aprovação e sign-off (sugerido)

```markdown
## Approval & Sign-off

| Role                     | Name  | Status         | Date       | Comments                          |
| ------------------------ | ----- | -------------- | ---------- | --------------------------------- |
| Tech Lead                | @Name | ✅ Approved    | 2026-02-04 | LGTM, proceed with implementation |
| Staff/Principal Engineer | @Name | ⏳ Pending     | -          | Requested security review first   |
| Product Manager          | @Name | ✅ Approved    | 2026-02-03 | Scope aligned with roadmap        |
| Engineering Manager      | @Name | ⏳ Pending     | -          | -                                 |
| Security Team            | @Name | 🔴 Not Started | -          | Required for payment integration  |
| Compliance/Legal         | @Name | N/A            | -          | Not required for this project     |

**Approval Criteria**:

- ✅ All mandatory sections complete
- ✅ Security review passed (if applicable)
- ✅ Risks identified and mitigated
- ✅ Timeline realistic and agreed upon
- ⏳ Test strategy approved by QA
- ⏳ Monitoring plan reviewed by SRE

**Next Steps After Approval**:

1. Create Epic in Jira (link in metadata)
2. Break down into User Stories
3. Begin Phase 1 implementation
4. Schedule kickoff meeting with team
```

---

## Regras de validação

### Checklist de seções obrigatórias

Antes de finalizar o TDD, garanta:

- [ ] **Cabeçalho**: Tech lead, time e link do epic informados
- [ ] **Contexto**: 2+ parágrafos com fundo e domínio
- [ ] **Problema**: Pelo menos 2 problemas específicos com impacto
- [ ] **Escopo**: Dentro/fora claros (mín. 3 itens cada)
- [ ] **Solução técnica**: Diagrama ou descrição de arquitetura
- [ ] **Solução técnica**: Pelo menos 1 endpoint de API definido
- [ ] **Risks**: At least 3 risks with impact/probability/mitigation
- [ ] **Plano de implementação**: Fases com estimativas

### Checklist de seções críticas (por tipo de projeto)

**Se projeto de pagamento/auth**:

- [ ] **Segurança**: Método de autenticação definido
- [ ] **Segurança**: Criptografia em repouso e em trânsito especificada
- [ ] **Segurança**: Tratamento de PII documentado
- [ ] **Segurança**: Requisitos de compliance identificados

**Se sistema em produção**:

- [ ] **Monitoramento**: Pelo menos 3 métricas com limiares
- [ ] **Monitoramento**: Alertas configurados
- [ ] **Rollback**: Gatilhos de rollback definidos
- [ ] **Rollback**: Passos documentados

**Todos os projetos**:

- [ ] **Testes**: Pelo menos 2 tipos definidos (unit, integração, e2e)
- [ ] **Testes**: Cenários críticos listados

## Formato de saída

### Ao criar o TDD

1. **Gere o documento Markdown**
2. **Valide contra os checklists acima**
3. **Destaque seções críticas faltantes**
4. **Forneça resumo ao usuário**:

```
✅ TDD criado: "[Nome do projeto]"

**Seções incluídas**:
✅ Obrigatórias (7/7): Todas presentes
✅ Críticas (3/4): Segurança, Testes, Monitoramento
⚠️ Faltando: Plano de rollback (recomendado para produção)

**Próximos passos sugeridos**:
- Adicionar seção de rollback (crítica em produção)
- Rever seção de segurança com o time InfoSec
- Criar epic no Jira e link na metadata
- Agendar revisão do TDD com stakeholders

Deseja que eu:
1. Adicione a seção de rollback faltante?
2. Publique este TDD no Confluence?
3. Crie um Epic no Jira para o projeto?
```

### Integração com Confluence

Se o usuário quiser publicar no Confluence:

```
Vou publicar este TDD no Confluence.

Qual espaço usar?
- Espaço pessoal (~557058...)
- Espaço do time (informe o space key)

Devo:
- Criar uma página nova
- Atualizar página existente (ID ou URL)
```

Use então a skill Confluence Assistant para publicar.

## Antipadrões comuns

### ❌ Enunciados de problema vagos

**RUIM**:

```

We need to integrate with Stripe.

```

**BOM**:

```

### Problems We're Solving

- **Manual payment processing takes 2 hours/day**: Currently processing payments manually, costing $500/month in labor
- **Cannot expand internationally**: Current payment processor only supports USD
- **High cart abandonment (45%)**: Poor checkout UX causing revenue loss of $10k/month

```

### ❌ Escopo indefinido

**RUIM**:

```

Build payment integration with all features.

```

**BOM**:

```

### ✅ In Scope (V1)

- Trial subscriptions (14 days)
- Single payment method per user
- USD only
- Cancel subscription

### ❌ Out of Scope (V1)

- Multiple payment methods
- Multi-currency
- Promo codes
- Usage-based billing

```

### ❌ Sem segurança em sistema de pagamento

**RUIM**:

```

No security section for payment integration.

```

**BOM**:

```

### Security Considerations (MANDATORY)

**PCI DSS Compliance**:

- Never store full card numbers (use Stripe tokens)
- Never log CVV or full PAN
- Use Stripe Elements for card input (PCI SAQ A)

**Secrets Management**:

- Store `STRIPE_SECRET_KEY` in environment variables
- Rotate keys every 90 days
- Never commit keys to git

```

### ❌ Sem plano de rollback

**RUIM**:

```

We'll deploy and hope it works.

```

**BOM**:

```

### Rollback Plan

**Triggers**:

- Error rate > 5% → immediate rollback
- Payment processing failures > 10% → immediate rollback

**Steps**:

1. Disable feature flag `STRIPE_INTEGRATION_ENABLED`
2. Verify old payment processor is active
3. Notify #engineering and #product
4. Schedule post-mortem within 24h

```

## Notas importantes

- **Respeite o idioma do usuário** — detecte e gere o TDD no mesmo idioma do pedido
- **Foco em arquitetura, não implementação** — documente decisões e contratos, não código
- **Só exemplos de alto nível** — contratos de API, esquemas, diagramas (não comandos CLI nem código)
- **Sempre valide seções obrigatórias** — não permita pular por completo sem ciência
- **Pagamentos/auth** — seção de segurança obrigatória
- **Produção** — monitoramento e rollback obrigatórios
- **Faça perguntas esclarecedoras** — não invente dados faltantes (no idioma do usuário)
- **Rigor pragmático** — projetos pequenos não precisam das 20 seções
- **Atualize o documento** — TDD evolui com o projeto
- **Use padrões da indústria** — Google, Amazon, RFCs onde couber
- **Pense em compliance** — GDPR, PCI DSS, HIPAA quando aplicável
- **Pense durabilidade** — se mudar framework, o TDD segue válido

## Exemplos de prompts que acionam esta skill

### Inglês

- "Create a TDD for Stripe integration"
- "I need a technical design document for the new auth system"
- "Write a design doc for the API redesign"
- "Help me document the payment integration architecture"
- "Create a tech spec for migrating to microservices"

### Português

- "Crie um TDD para integração com Stripe"
- "Preciso de um documento de design técnico para o novo sistema de autenticação"
- "Escreva um design doc para o redesign da API"
- "Me ajude a documentar a arquitetura de integração de pagamento"
- "Crie uma especificação técnica para migração para microserviços"

### Espanhol

- "Crea un TDD para integración con Stripe"
- "Necesito un documento de diseño técnico para el nuevo sistema de autenticación"
- "Escribe un design doc para el rediseño de la API"
- "Ayúdame a documentar la arquitectura de integración de pagos"
- "Crea una especificación técnica para migración a microservicios"

## Referências

### Padrões da indústria

- [Google Engineering Practices](https://google.github.io/eng-practices/)
- [Google SRE Book](https://sre.google/sre-book/table-of-contents/)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Architecture Decision Records](https://adr.github.io/)
