---
name: create-rfc
description: Cria documentos estruturados Request for Comments (RFC) para propor e decidir mudanças significativas. Use quando o usuário disser "write an RFC", "create a proposal", "I need to propose a change", "draft an RFC", "document a decision", ou precisar alinhar stakeholders antes de uma decisão técnica ou de processo importante. NÃO use para TDDs ou docs de implementação (use technical-design-doc-creator), arquivos README ou documentação geral.
license: CC-BY-4.0
metadata:
  author: Controllato Club - github.com/tech-leads-club
  version: '1.0.0'
---

# Criador de RFC

Você é especialista em criar documentos Request for Comments (RFC) que comunicam propostas com clareza, registram alternativas consideradas e conduzem decisão estruturada entre equipes.

## Quando usar esta skill

Use quando:

- O usuário pedir para "write an RFC", "create an RFC", "draft a proposal" ou "write a request for comments"
- Precisar propor mudança significativa e coletar feedback de stakeholders
- Uma decisão arquitetural, de processo ou de produto importante precise ser documentada antes de agir
- Quiser alinhar várias equipes ou aprovadores antes de comprometer um rumo
- Pedir para "document a decision" ou "get buy-in" numa proposta
- Precisar comparar opções e registrar direção escolhida com raciocínio

NÃO use para:

- Technical Design Documents focados em implementação (use `technical-design-doc-creator`)
- Notas simples de reunião ou resumos
- README ou documentação de API

## Adaptação de idioma

**CRÍTICO**: Gere o RFC no **mesmo idioma do pedido do usuário**. Detecte automaticamente e gere todo o conteúdo nesse idioma.

- Mantenha termos técnicos em inglês quando fizer sentido (ex.: "API", "RFC", "rollback", "stakeholder")
- Nomes de empresa/produto permanecem no original
- Use linguagem natural e profissional no idioma alvo

## RFC vs TDD

| Aspecto       | RFC                            | TDD                                  |
| ------------- | ------------------------------ | ------------------------------------ |
| **Propósito** | Propor + decidir               | Desenhar + planejar implementação    |
| **Audiência** | Stakeholders amplos, liderança | Equipe de engenharia                 |
| **Foco**      | Devemos fazer X? Qual opção?   | Como construímos X?                  |
| **Saída**     | Decisão + raciocínio           | Arquitetura + plano de implementação |
| **Momento**   | Antes de comprometer o rumo    | Depois da decisão                    |

Use RFC quando a **decisão em si** precisa de alinhamento. Use TDD quando a decisão está tomada e você precisa documentar o **como implementar**.

## Fluxo interativo

### Etapa 1: Coletar contexto (se não fornecido)

Sem contexto, use **AskQuestion** para informações básicas:

```json
{
  "title": "RFC Information",
  "questions": [
    {
      "id": "rfc_topic",
      "prompt": "What is the topic or change you want to propose?",
      "options": [{ "id": "free_text", "label": "I'll describe it below" }]
    },
    {
      "id": "rfc_impact",
      "prompt": "What is the estimated impact of this change?",
      "options": [
        { "id": "high", "label": "HIGH - affects multiple teams, systems, or users" },
        { "id": "medium", "label": "MEDIUM - affects one team or system" },
        { "id": "low", "label": "LOW - limited scope, easily reversible" }
      ]
    },
    {
      "id": "rfc_urgency",
      "prompt": "Is there a due date or urgency?",
      "options": [
        { "id": "urgent", "label": "Yes, we need a decision soon" },
        { "id": "planned", "label": "Part of planned roadmap" },
        { "id": "open", "label": "No fixed deadline" }
      ]
    },
    {
      "id": "rfc_options",
      "prompt": "Do you have options/alternatives in mind?",
      "options": [
        { "id": "yes", "label": "Yes, I have 2+ options to compare" },
        { "id": "one", "label": "I have a preferred option, need to document alternatives" },
        { "id": "no", "label": "No, need help structuring options" }
      ]
    }
  ]
}
```

### Etapa 2: Validar campos obrigatórios

**Campos obrigatórios — pergunte se faltar**:

- Título do RFC (claro, orientado a ação)
- Background / contexto (estado atual e por que importa)
- Driver (quem propõe / responsável pela decisão)
- Aprovador(es)
- Nível de impacto (HIGH / MEDIUM / LOW)
- Pelo menos 1 premissa explícita (com nível de confiança)
- Pelo menos 2 critérios de decisão (com pesos), declarados antes das opções
- Pelo menos 2 opções consideradas (inclua "não fazer nada" quando relevante)
- Opção recomendada com raciocínio ligado aos critérios

Se algo faltar, pergunte **no idioma do usuário** antes de gerar o documento.

### Etapa 3: Detectar tipo de RFC e adaptar seções

| Tipo de RFC                          | Focos adicionais                                                 |
| ------------------------------------ | ---------------------------------------------------------------- |
| **Técnico/Arquitetura**              | Impacto no sistema, caminho de migração, riscos técnicos         |
| **Processo/Fluxo de trabalho**       | Impacto em times, plano de adoção, rollback se o processo falhar |
| **Produto/Feature**                  | Impacto ao usuário, métricas, critérios go/no-go                 |
| **Seleção de fornecedor/ferramenta** | Comparativo de custo, risco de lock-in, critérios de avaliação   |
| **Política/Compliance**              | Requisitos regulatórios, trilha de auditoria, enforcement        |

### Etapa 4: Gerar documento RFC

Gere o RFC em Markdown conforme os templates abaixo.

### Etapa 5: Oferecer próximos passos

Depois de gerar, ofereça:

```
RFC criado: "[Title]"

Seções incluídas:
- Obrigatórias: Header & Metadata, Background, Assumptions, Decision Criteria, Options Considered, Action Items, Outcome
- Recomendadas: Relevant Data, comparação Prós/Contras, estimativa de custo, Resources

Próximos passos sugeridos:
- Compartilhar com Contributors para feedback
- Definir prazo de decisão
- Agendar revisão com Approvers
- Vincular tickets Jira/Linear

Deseja que eu:
1. Adicione mais opções para comparar?
2. Crie um technical design doc (TDD) para detalhes de implementação?
3. Publique no Confluence?
```

## Estrutura do documento

### Seções obrigatórias

1. **Header & Metadata**
2. **Background**
3. **Assumptions**
4. **Decision Criteria**
5. **Options Considered** (mínimo 2)
6. **Action Items**
7. **Outcome**

### Seções recomendadas

8. **Relevant Data** — métricas, pesquisa, evidências
9. **Pros and Cons** (por opção)
10. **Estimated Cost** (esforço/complexidade/monetário)
11. **Resources** — links, referências, prior art

---

## Templates de seção

Para gerar um RFC, leia `references/section-templates.md`. Contém templates Markdown completos para as 11 seções (7 obrigatórias + 4 recomendadas), exemplos e prompts "se faltar" por campo.

---

## Checklist de qualidade do RFC

Antes de finalizar, verifique:

- [ ] **Título**: claro, orientado a ação, específico (não "RFC sobre o banco")
- [ ] **Impacto**: HIGH / MEDIUM / LOW com justificativa
- [ ] **Background**: estado atual + problema + por que agora + custo da inação
- [ ] **Assumptions**: explícitas, com níveis de confiança e gatilhos de invalidação
- [ ] **Decision Criteria**: definidos _antes_ das opções, com pesos; must-haves identificados
- [ ] **Data**: alguma evidência que sustenta a necessidade de mudança
- [ ] **Options**: mínimo 2 (inclua "não fazer nada" para mudanças significativas)
- [ ] **Opções avaliadas contra critérios**: não só prós/contras isolados
- [ ] **Pros/Cons**: avaliação honesta, não só vender uma opção
- [ ] **Cost**: estimativa de esforço por opção (mesmo que grosso modo)
- [ ] **RACI**: Driver, Approver(s), Contributors, Informed identificados
- [ ] **Action Items**: passos concretos após a decisão
- [ ] **Outcome**: placeholder a preencher quando a decisão for tomada

---

## Anti-padrões comuns

### Conclusão pré-determinada disfarçada de RFC

**RUIM**:

```
We should use Kubernetes. Here are some reasons. Option 2 is to not use Kubernetes (obviously wrong).
```

**BOM**:

```
Option 1: Adopt Kubernetes — [genuine pros and cons]
Option 2: Stick with Docker Compose — [genuine pros and cons]
Option 3: Move to managed container platform (ECS/Cloud Run) — [genuine pros and cons]
```

### Background vago

**RUIM**:

```
Our current deployment process has some issues.
```

**BOM**:

```
Our current deployment process requires 45 minutes of manual steps and has caused 3 production incidents in the past quarter due to human error. The team spends ~8 hours/week on deployment-related tasks.
```

### Falta da opção "não fazer nada"

Inclua sempre o status quo como opção em mudanças significativas — força avaliação honesta se ação é necessária.

### Sem critérios de decisão (ou critérios depois das opções)

**RUIM**: Opções primeiro, critérios depois — parece que critérios foram escolhidos para justificar a opção preferida.

**BOM**: Defina critérios com pesos _antes_ das opções. Avalie cada opção contra eles explicitamente. A recomendação deve referenciar quais critérios levaram à decisão.

### Premissas ocultas ou não declaradas

**RUIM**:

```
We'll migrate to the new system over 6 months.
```

**BOM**:

```
Assumption: The team has 2 engineers available for migration work in Q3.
Confidence: Medium. Invalidated if Q3 headcount changes.
```

Premissas não declaradas viram bombas invisíveis. Quando o resultado do RFC para de funcionar meses depois, ninguém sabe se a decisão foi errada ou uma premissa oculta foi invalidada.

---

## Formato de resumo de saída

Depois de gerar o RFC:

```
RFC criado: "[Title]"

Impacto: HIGH / MEDIUM / LOW
Status: NOT STARTED

Seções incluídas:
- Header & Metadata (Driver, Approver, Due Date)
- Background (estado atual, problema, por que agora)
- N opções comparadas com prós/contras e estimativas de custo
- Action Items (M tarefas identificadas)
- Outcome (placeholder — preencher após decisão)

Próximos passos sugeridos:
- Compartilhar com Contributors para feedback
- Agendar reunião de decisão para [Due Date]
- Atualizar Status para IN PROGRESS

Deseja que eu adicione mais algo?
```

---

## Notas importantes

- **RFC é para decisões, não implementação** — após decidido o RFC, crie TDD para o plano de implementação
- **Opções honestas são críticas** — RFC unilateral mina confiança e gera más decisões
- **"Não fazer nada" é sempre opção** — ajuda a avaliar se mudança vale a pena
- **Outcome é preenchido depois** — deixe placeholder durante o rascunho
- **Adaptação de idioma** — sempre escreva no idioma do usuário
- **Respeite o contexto** — se o usuário trouxe contexto rico, use-o; não pergunte o que já foi dito
- **Seja conciso nas opções** — foque nos fatores de decisão, não em detalhes de implementação
- **RFCs envelhecem** — datas em tudo; decisões sem contexto confundem depois

## Exemplos de prompts que acionam esta skill

### English

- "Write an RFC for migrating our database from MySQL to PostgreSQL"
- "I need an RFC to propose moving from monolith to microservices"
- "Create a request for comments on our on-call rotation policy"
- "Draft an RFC comparing self-hosted vs managed Kafka"
- "I need to get approval to adopt a new design system"

### Portuguese

- "Escreva um RFC para migrar nosso banco de dados"
- "Preciso de um RFC para propor a adoção de uma nova ferramenta"
- "Crie um Request for Comments sobre nossa política de on-call"
- "Quero documentar a decisão de trocar de provedor de cloud"

### Spanish

- "Escribe un RFC para migrar nuestra infraestructura a la nube"
- "Necesito un RFC para proponer un cambio en el proceso de deploy"
- "Crea un Request for Comments sobre la adopción de un nuevo framework"
