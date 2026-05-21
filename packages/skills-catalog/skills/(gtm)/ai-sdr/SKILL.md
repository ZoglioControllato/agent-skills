---
name: ai-sdr
description: "Use quando quiser implantar SDR com IA (prospecção automatizada), automatizar qualificação comercial, construir roteamento de sinais até ações ou desenhar a arquitetura de agentes de IA para vendas. Use também quando o usuário mencionar 'AI SDR', 'agente de vendas IA', 'qualificação automatizada', 'roteamento por sinais', 'automação de vendas', '11x', 'Artisan', 'AiSDR', 'AI BDR' ou 'vendas autônomas'. Esta skill cobre implantação de AI SDR, automação da qualificação e arquitetura de agentes para desenvolvimento de vendas. NÃO use para implementação técnica de ferramentas, revisão de código ou arquitetura de software de produto."
metadata:
  original_author: Chad Boyda / agent-gtm-skills
  modified_by: Felipe Rodrigues - github.com/felipfr
  source: https://github.com/chadboyda/agent-gtm-skills
  version: '1.0.0'
---

# Skill AI SDR

Você é um estrategista de implantação de AI SDR. Ajuda founders e equipes GTM a desenhar, implantar e otimizar sistemas de desenvolvimento de vendas com IA. Combina targeting baseado em sinais, qualificação automatizada, sequências multicanal e passagem com humanos no circuito para construir pipeline que converte.

## Antes de começar

Antes de orientar sobre AI SDR, esclareça:

1. **Movimento comercial atual** — Inbound, outbound, product-led ou híbrido?
2. **Tamanho do time** — Founder solo, equipe pequena (2–5) ou organização escalada (10+)?
3. **Clareza da ICP** — Há uma ICP definida com critérios firmográficos + comportamentais?
4. **Stack tecnológico** — CRM (HubSpot, Salesforce, Pipedrive), ferramentas de enriquecimento, infraestrutura de envio?
5. **Faixa de orçamento** — Bootstrap (US$ 500–1K/mês), crescimento (US$ 1K–5K/mês) ou escala (US$ 5K+/mês)?
6. **Metas de volume** — Quantas reuniões qualificadas por mês precisam?
7. **Qualidade dos dados** — CRM limpo vs. partir do zero?

Se algo disso não estiver claro, pergunte antes de prosseguir. Entradas ruins geram resultados ruins de AI SDR.

---

## Seção 1: Panorama de AI SDR (2025–2026)

### O que AI SDRs fazem na prática

AI SDRs automatizam o trabalho repetitivo de desenvolvimento de vendas:

- Montagem de listas e enriquecimento de leads
- Pontuação e qualificação de ICP
- Geração personalizada de e-mail/LinkedIn/SMS
- Execução de sequências em vários passos
- Agendamento de reuniões e coordenação de calendário
- Classificação e roteamento de respostas
- Registro no CRM e higiene de dados

Eles não substituem humanos nos pontos de conversão. O modelo de handoff importa mais que o modelo de automação.

### Tabela comparativa de plataformas

```
+---------------+------------+-----------------+---------------------------+------------------+
| Platform      | Price/mo   | Best For        | Key Differentiator        | Channels         |
+---------------+------------+-----------------+---------------------------+------------------+
| 11x (Alice)   | $5K-10K    | Enterprise      | Full autonomous agent     | Email, LinkedIn  |
|               |            | outbound        | with brand voice learning | Phone             |
+---------------+------------+-----------------+---------------------------+------------------+
| Artisan (Ava) | $2.4K-7.2K | Mid-market      | Built-in enrichment +     | Email, LinkedIn  |
|               |            | teams           | brand-safe personalization|                  |
+---------------+------------+-----------------+---------------------------+------------------+
| AiSDR         | $900-2.5K  | HubSpot-native  | Managed service, GTM      | Email, LinkedIn, |
|               |            | teams           | support included          | SMS              |
+---------------+------------+-----------------+---------------------------+------------------+
| Relevance AI  | Custom     | Custom agent    | Drag-and-drop agent       | Any (API-based)  |
|               |            | builders        | builder with full API     |                  |
+---------------+------------+-----------------+---------------------------+------------------+
| Clay          | $149-800   | Data + enrich   | 75+ provider waterfall,   | Feeds into any   |
|               |            | workflows       | Claygent AI research      | sending tool     |
+---------------+------------+-----------------+---------------------------+------------------+
| Instantly     | $30-97     | Cold email      | 450M+ lead database,      | Email            |
|               |            | at scale        | built-in warmup network   |                  |
+---------------+------------+-----------------+---------------------------+------------------+
| Smartlead     | $39-94     | Deliverability- | Unlimited mailboxes,      | Email            |
|               |            | focused sending | AI warmup engine          |                  |
+---------------+------------+-----------------+---------------------------+------------------+
| Salesforge    | $48-96     | Multi-channel   | Agent Frank for LinkedIn  | Email, LinkedIn  |
|               |            | sequences       | + email combined          |                  |
+---------------+------------+-----------------+---------------------------+------------------+
```

### Quadro de decisão para seleção de plataforma

```
START
  |
  v
Do you need a full autonomous agent (minimal human involvement)?
  |
  YES --> Budget > $5K/mo?
  |         |
  |         YES --> 11x (Alice/Julian)
  |         NO  --> Artisan (Ava)
  |
  NO --> Do you want to build custom agent workflows?
          |
          YES --> Relevance AI (or n8n + LLM)
          NO  --> Do you need enrichment + list building?
                    |
                    YES --> Clay (feed into any sender)
                    NO  --> Do you need a managed AI SDR service?
                              |
                              YES --> AiSDR (especially if HubSpot)
                              NO  --> Instantly or Smartlead (sending layer only)
```

### Referências-chave de métricas

```
+-------------------------------+-------------+-------------+
| Metric                        | Human SDR   | AI SDR      |
+-------------------------------+-------------+-------------+
| Prospects contacted/day       | 50-80       | 1,000+      |
| Cold email reply rate         | 5-8%        | 8-12%       |
| Cost per meeting booked       | $800-1,500  | $150-400    |
| Meetings booked/month         | 12-20       | 30-60       |
| Meeting show rate             | 75-85%      | 65-75%      |
| Lead-to-opportunity rate      | 20-25%      | 15-20%      |
| Ramp time                     | 3-6 months  | 2-4 weeks   |
| Annual cost (fully loaded)    | $75K-120K   | $12K-36K    |
+-------------------------------+-------------+-------------+
```

Importante: AI SDR vence em volume e custo. SDR humano vence em qualidade de conversão e navegação de deals complexos. Os melhores times combinam os dois.

---

## Seção 2: programa de implantação de AI SDR em 4 semanas

### Semana 1: fundação (configuração de sinais + montagem da lista)

**Dias 1–2: Definição de ICP e configuração de sinais**

Defina sua ICP com critérios de pontuação:

```
TIER 1 (Score 80-100) - Auto-enroll in sequence
  - Company size: 50-500 employees
  - Revenue: $5M-50M ARR
  - Industry: SaaS, fintech, e-commerce
  - Tech stack: Uses Salesforce/HubSpot + Slack
  - Hiring signal: Posted SDR/AE roles in last 90 days
  - Funding signal: Raised Series A-C in last 12 months

TIER 2 (Score 50-79) - Review before enrolling
  - Meets 3 of 5 firmographic criteria
  - Has at least 1 intent signal
  - No disqualifying factors

TIER 3 (Score 0-49) - Nurture or disqualify
  - Meets fewer than 3 criteria
  - No intent signals detected
```

**Dias 3–4: Configuração do waterfall de enriquecimento**

Monte uma tabela Clay (ou equivalente) com provedores em cascata:

```
Step 1: Apollo         --> Email + phone + title
Step 2: Clearbit       --> Firmographics + tech stack
Step 3: ZoomInfo       --> Direct dials + org chart
Step 4: Hunter.io      --> Email verification
Step 5: Claygent       --> Custom web scraping for last-mile data
Step 6: BuiltWith      --> Technology signals
Step 7: LinkedIn Sales  --> Social proximity + mutual connections
        Navigator
```

Meta: mais de 80% de correspondência de e-mail na lista ICP. Se estiver abaixo de 60% após o waterfall, o problema é a qualidade da lista-fonte.

**Dia 5: Monte a lista inicial de prospects**

- Puxe 500 prospects pontuados na ICP para o fluxo de enriquecimento
- Pontue cada prospect em relação aos critérios de tier
- Marque com os sinais relevantes (funding, hiring, adoção tech, engajamento com conteúdo)
- Exporte prospects Tier 1 (meta: 150–200) para a sequência da Semana 2

### Semana 2: conteúdo (criação de sequências + personalização)

**Dias 6–7: Variantes de e-mail por persona**

Crie 3 variantes de e-mail por persona de compra. Cada variante precisa de:

```
VARIANT STRUCTURE:
  Subject line    --> Pain-point or signal-based (no clickbait)
  Opening line    --> Personalized to signal or recent event
  Value prop      --> One specific outcome, with number if possible
  Social proof    --> Name-drop a similar company or metric
  CTA             --> Low-friction ask (reply, 15-min call, resource)
  Length           --> 50-125 words (5-10 lines max)
```

Exemplo de matriz de personas:

```
+------------------+--------------------+---------------------+--------------------+
| Persona          | Variant A          | Variant B           | Variant C          |
+------------------+--------------------+---------------------+--------------------+
| VP Sales         | Pipeline velocity  | Rep productivity    | Competitive intel  |
|                  | angle              | angle               | angle              |
+------------------+--------------------+---------------------+--------------------+
| Head of RevOps   | Data accuracy      | Process automation  | Reporting/         |
|                  | angle              | angle               | attribution angle  |
+------------------+--------------------+---------------------+--------------------+
| Founder/CEO      | Revenue growth     | Cost reduction      | Market timing      |
|                  | angle              | angle               | angle              |
+------------------+--------------------+---------------------+--------------------+
```

**Dias 8–9: Camada de personalização com IA**

Para cada prospect, gere uma linha de abertura personalizada usando:

- Post ou artigo recente no LinkedIn que a pessoa publicou
- Novidades da empresa (funding, lançamento, expansão)
- Padrões de contratação que indiquem dores
- Conexões mútuas ou comunidades compartilhadas
- Sinais de tech stack que indiquem fit

Fórmula de personalização: [Observação do sinal] + [Relevância para o cargo] + [Ponte ao seu valor]

**Dia 10: Lógica de ramificação condicional**

Construa sequências com caminhos condicionais:

```
                    Email 1 (Day 0)
                         |
              +----------+----------+
              |                     |
         Opens (no reply)      No open
              |                     |
         Email 2 (Day 3)      Email 2b (Day 4)
         [deeper value]       [new subject line]
              |                     |
         +----+----+          +-----+-----+
         |         |          |           |
      Reply    No reply    Opens      No open
         |         |          |           |
      Route to  LinkedIn    Email 3    Sequence
      human     touch       (Day 7)    ends
                (Day 5)       |
                   |       Reply?
                   |          |
                   |     +----+----+
              +----+     |         |
              |    |   Route    Final
           Route  Email 4  to     email
           to   (Day 10) human   (Day 14)
           human  break-up         |
                   email        Archive
```

### Semana 3: lançamento (infraestrutura de envio + go-live)

**Dias 11–12: Domínios e mailboxes**

Requisitos de infraestrutura:

```
DOMAIN SETUP:
  - Purchase 5-10 secondary domains (variations of primary)
  - Example: getacme.com, acmehq.io, tryacme.com, useacme.co
  - Set up SPF, DKIM, and DMARC records for each
  - Create 2-3 mailboxes per domain
  - Total: 10-30 sending mailboxes

WARMUP PROTOCOL:
  - Day 1-7:   5 emails/day per mailbox (warmup only)
  - Day 8-14:  10 emails/day (mix of warmup + real)
  - Day 15-21: 20 emails/day (mostly real sends)
  - Day 22-28: 30-40 emails/day (full volume)
  - NEVER exceed 50 emails/day per mailbox
```

Requisitos de compliance (enforcement em 2025+):

- SPF, DKIM e DMARC configurados corretamente
- Cabeçalho de descadastro em um clique
- Taxa de reclamações de spam abaixo de 0,3%
- Taxa de bounce abaixo de 2%
- Google, Yahoo e Microsoft passaram a aplicar essas regras

**Dia 13: Configuração da plataforma de envio**

Escolha sua camada de envio:

```
+-------------------+-------------------+-------------------+
| Feature           | Instantly         | Smartlead         |
+-------------------+-------------------+-------------------+
| Warmup network    | 4.2M+ accounts    | AI-adaptive       |
| Mailbox limit     | Unlimited         | Unlimited         |
| Lead database     | 450M+ contacts    | No built-in DB    |
| Reply handling    | AI Reply Agent    | Unibox            |
| IP rotation       | Automatic (SISR)  | Manual config     |
| Starting price    | $30/mo            | $39/mo            |
| Best for          | All-in-one        | Deliverability    |
|                   | outbound          | optimization      |
+-------------------+-------------------+-------------------+
```

**Dias 14–15: Lançamento suave**

- Lance só para prospects Tier 1 (100–150 contatos)
- Monitore métricas de entrega de hora em hora nas primeiras 24 horas
- Verifique placement na caixa de entrada (GlockApps ou mail-tester.com)
- Fique de olho em taxas de bounce acima de 2% e pause se disparar
- Meta: mais de 95% de delivery antes de expandir volume

### Semana 4: otimizar (medir + iterar)

**Dias 16–18: Framework de testes A/B**

Teste uma variável por vez:

```
PRIORITY TEST ORDER:
  1. Subject lines     --> Impact on open rate
  2. Opening lines     --> Impact on reply rate
  3. CTA type          --> Impact on positive reply rate
  4. Send timing       --> Impact on open + reply
  5. Sequence length   --> Impact on total conversion
  6. Personalization   --> Impact on reply sentiment
     depth
```

Tamanho mínimo de amostra: 100 envios por variante antes de tirar conclusões.

**Dias 19–20: Análise de sentimento das respostas**

Classifique todas as respostas:

```
POSITIVE (route to human immediately):
  - "Tell me more"
  - "Can you send details?"
  - "Let's set up a call"
  - Meeting booked via CTA

NEUTRAL (AI follow-up, then route):
  - "Not now, maybe later"
  - "Send me more info"
  - "Who else do you work with?"

NEGATIVE (remove from sequence):
  - "Not interested"
  - "Remove me"
  - "Wrong person"

OBJECTION (AI handles with playbook):
  - "We already have a solution"
  - "No budget right now"
  - "Need to talk to my team"
```

**Dia 21: Ajuste da pontuação da ICP**

Revise os primeiros 3 semanas de dados e ajuste:

- Quais traços firmográficos correlacionam com respostas positivas?
- Quais sinais previram reuniões agendadas?
- Quais personas converteram mais?
- Quais prospects Tier 2 devem ser promovidos ou rebaixados?

Recalibere os pesos da pontuação com base em dados de conversão reais, não em achismos.

---

Para roteamento sinal→ação, arquitetura de agentes, qualificação, handoff humano, custo/ROI e modos de falha, leia `references/implementation-guide.md` ao desenhar ou depurar uma implantação de AI SDR.

---

## Exemplos

- **Usuário diz:** "Montar um AI SDR" → **Resultado:** O agente pergunta necessidade de pipeline, CRM e orçamento; recomenda plataforma (11x, Artisan, AiSDR) e o programa em 4 semanas; descreve checklist de 30 segundos (ICP, enriquecimento 80%+, 3 variantes de e-mail, sinal→ação, envio, handoff, CRM, classificação de respostas); define speed-to-lead (P0 <5 min, handoff na resposta <5 min).
- **Usuário diz:** "A taxa de resposta do nosso AI SDR está baixa" → **Resultado:** O agente verifica a pilha de instruções (mensagem, personalização, sequência); sugere A/B na primeira linha e no CTA; confere enriquecimento e qualidade de sinais; conecta a **ai-cold-outreach** e **lead-enrichment**.
- **Usuário diz:** "Quando usar AI SDR vs SDR humano?" → **Resultado:** O agente mapeia casos (volume, qualificação, handoff); recomenda IA para montagem de lista, sequências e classificação de resposta; humano para primeiro fechamento, deals complexos e gatilhos de handoff; sugere ramp de 4 semanas e otimização semanal.

## Solução de problemas

- **Baixa conversão para reunião** → **Causa:** Qualificação fraca ou handoff errado. **Correção:** Defina critérios de qualificação e gatilhos de handoff; garanta resposta positiva→handoff em menos de 5 min; treine tratamento de objeções; revise a precisão do sentimento nas respostas.
- **Problemas de entregabilidade** → **Causa:** Warmup, volume ou autenticação. **Correção:** Rode checklist de entregabilidade (SPF, DKIM, DMARC, unsubscribe, bounce <2%, warmup 14–28 dias, <50/caixa); teste placement (GlockApps, mail-tester).
- **Trocar ferramenta não ajudou** → **Causa:** Pilha de instruções ou contexto faltando. **Correção:** Documente pontuação da ICP, framework de mensagem, regras de personalização, lógica de sequências; garanta contexto persistente e loop de feedback; corrija a arquitetura antes de trocar ferramentas.

---

Para checklists, metas de speed-to-lead, checklist de entregabilidade e perguntas de descoberta, leia `references/quick-reference.md`.

---

## Skills relacionadas

- **ai-cold-outreach** — Aprofundamento em copy de cold email, entregabilidade e sequências multicanal
- **lead-enrichment** — Waterfall de enriquecimento, escolha de provedores de dados e fluxos Clay
- **sales-motion-design** — Arquitetura ponta a ponta do motion comercial desde o primeiro touch até o fechamento
- **gtm-engineering** — Infra GTM técnica, integrações via API e automação de workflow
- **solo-founder-gtm** — Implantação enxuta de AI SDR para founders que fazem tudo sozinhos
- **gtm-metrics** — Métricas de pipeline, modelagem de atribuição e frameworks de ROI
