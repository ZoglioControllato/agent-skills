## Seção 3: Roteamento de sinal para ação

### Detecção de Sinal e Matriz de Resposta```

+----------------------------+----------------------------------+-------------+----------+
| Signal Detected | Automated Action | Priority | Channel |
+----------------------------+----------------------------------+-------------+----------+
| Funding announced | Personalized congrats + | P1 - 24hr | Email |
| | relevant case study | | |
+----------------------------+----------------------------------+-------------+----------+
| Hiring for your category | "Noticed you're building out | P1 - 24hr | Email + |
| | [team]" email with ROI data | | LinkedIn |
+----------------------------+----------------------------------+-------------+----------+
| Competitor contract | Competitive displacement | P1 - 48hr | Email + |
| renewal approaching | sequence with migration offer | | Phone |
+----------------------------+----------------------------------+-------------+----------+
| Website visit (pricing | Immediate follow-up with | P0 - 5min | Email |
| page or demo page) | calendar link | | |
+----------------------------+----------------------------------+-------------+----------+
| Job posting matches your | "Companies hiring for X | P2 - 72hr | Email |
| solution category | typically need Y" outreach | | |
+----------------------------+----------------------------------+-------------+----------+
| Usage milestone (for | In-product expansion prompt + | P1 - 24hr | In-app + |
| existing customers) | upsell sequence | | Email |
+----------------------------+----------------------------------+-------------+----------+
| Content engagement (liked | "Saw you engaged with [topic]" | P2 - 48hr | LinkedIn |
| post, downloaded asset) | connection request | | |
+----------------------------+----------------------------------+-------------+----------+
| Executive change | New exec welcome + intro to | P1 - 1wk | Email + |
| (new CRO, VP Sales) | your champion at the account | | LinkedIn |
+----------------------------+----------------------------------+-------------+----------+
| Tech stack change | "Noticed you adopted [tool]" | P2 - 72hr | Email |
| detected | integration pitch | | |
+----------------------------+----------------------------------+-------------+----------+
| Earnings call mentions | Relevant case study tied to | P2 - 1wk | Email |
| pain you solve | stated priority | | |
+----------------------------+----------------------------------+-------------+----------+

````
### Pilha de fonte de sinal

Onde detectar esses sinais:```
FIRST-PARTY SIGNALS (highest intent):
  - Website visits (Clearbit Reveal, RB2B, Factors.ai)
  - Product usage data (Segment, Amplitude)
  - Email engagement (opens, clicks, replies)
  - Demo/trial requests

SECOND-PARTY SIGNALS (strong intent):
  - G2/Capterra category research
  - Review site comparisons
  - Partner referral data

THIRD-PARTY SIGNALS (contextual):
  - Clay signals (funding, hiring, tech adoption)
  - LinkedIn activity (job changes, posts, engagement)
  - News and PR monitoring (Google Alerts, Mention)
  - SEC filings and earnings calls (for enterprise)
  - BuiltWith / Wappalyzer (tech stack changes)
````

### Modelo de pontuação de sinal

Nem todos os sinais merecem a mesma resposta:```
SIGNAL SCORE = Intent Weight x Recency Multiplier x ICP Fit Score

Intent weights:

- Pricing page visit: 10
- Demo request: 10
- Competitor evaluation: 9
- Funding round: 7
- Hiring for category: 7
- Content download: 5
- LinkedIn engagement: 3
- Job posting match: 3

Recency multipliers:

- Last 24 hours: 3x
- Last 7 days: 2x
- Last 30 days: 1x
- Older than 30 days: 0.5x

ICP fit scores:

- Tier 1: 3x
- Tier 2: 1.5x
- Tier 3: 0.5x

````
Pontuação acima de 50 = P0 (ação imediata). Pontuação 25-50 = P1 (mesmo dia). Pontuação 10-25 = P2 (dentro de 72 horas). Pontuação abaixo de 10 = sequência de nutrição.

---

## Seção 4: Arquitetura do agente (sobre ferramentas)

### Por que a arquitetura supera a seleção de ferramentas

O erro mais comum: as equipes passam meses avaliando plataformas AI SDR quando a arquitetura em torno do agente é três vezes mais importante do que o agente escolhido.

Três componentes que determinam o sucesso do AI SDR:```
1. INSTRUCTION STACKS
   - Brand voice and tone rules
   - ICP definition and scoring logic
   - Objection handling playbooks
   - Escalation criteria
   - Compliance guardrails

2. PERSISTENT CONTEXT
   - CRM data (deal stage, past interactions, owner)
   - Enrichment data (firmographics, tech stack, signals)
   - Conversation history (prior emails, calls, meetings)
   - Account-level intelligence (org chart, budget cycle)

3. FEEDBACK LOOPS
   - Reply sentiment classified and logged
   - A/B test results fed back into message generation
   - Meeting conversion data informs ICP scoring
   - Lost deal reasons refine objection handling
   - Human rep corrections retrain the agent
````

### Diagrama de Arquitetura de Referência```

+------------------------------------------------------------------+
| ORCHESTRATION LAYER |
| (n8n / Make / Relevance AI / custom code) |
+------------------------------------------------------------------+
| | | |
v v v v
+-------------+ +-------------+ +-------------+ +--------------+
| SIGNAL | | ENRICHMENT | | SEQUENCING | | QUALIFICATION|
| DETECTION | | ENGINE | | ENGINE | | ENGINE |
| | | | | | | |
| - Clay | | - Clay | | - Instantly | | - LLM-based |
| - RB2B | | waterfall | | - Smartlead | | BANT/CHAMP |
| - Factors | | - Clearbit | | - Salesforge| | - ICP scoring|
| - G2 intent | | - ZoomInfo | | - HubSpot | | - Sentiment |
| - LinkedIn | | - Claygent | | sequences | | analysis |
+------+------+ +------+------+ +------+------+ +------+-------+
| | | |
v v v v
+------------------------------------------------------------------+
| CRM / DATA LAYER |
| (HubSpot / Salesforce / Pipedrive) |
| |
| - Contact records - Deal pipeline - Activity logging |
| - Signal history - Lead scoring - Attribution tracking |
+------------------------------------------------------------------+
| | | |
v v v v
+------------------------------------------------------------------+
| HUMAN HANDOFF LAYER |
| |
| Trigger: positive reply, meeting booked, high-value objection |
| Action: Slack notification + CRM task + context brief |
+------------------------------------------------------------------+

````
### Design de pilha de instruções

Seu AI SDR é tão bom quanto suas instruções. Construa pilhas de instruções em camadas:```
LAYER 1: IDENTITY
  "You are an SDR for [Company]. You help [ICP] solve [problem]
   by [mechanism]. Your tone is [professional/casual/consultative]."

LAYER 2: RULES
  "Never mention competitors by name in first touch.
   Never claim capabilities we don't have.
   Always include an unsubscribe option.
   Keep emails under 125 words.
   Never use discount language in first 3 touches."

LAYER 3: CONTEXT (dynamic, per-prospect)
  "This prospect is a [title] at [company] (Series B, 150 employees).
   They recently [signal]. Their tech stack includes [tools].
   Previous interaction: [none / replied on DATE / attended webinar]."

LAYER 4: TASK
  "Write a first-touch email that references their [signal],
   connects it to how [similar company] achieved [outcome],
   and asks if they are open to a 15-minute conversation."

LAYER 5: GUARDRAILS
  "If the prospect replies with 'not interested', mark as closed-lost
   and remove from all sequences. If they ask about pricing, route
   to AE immediately. If they raise a technical question, CC the SE."
````

### Implementação do ciclo de feedback```

DATA IN: DATA OUT:

Reply received Updated message templates
| Updated ICP scoring weights
v Updated sequence timing
Sentiment classified Updated objection playbooks
|
v
Outcome tracked FEEDBACK CYCLE:
(meeting, objection,
unsubscribe, ghost) Weekly: Review reply rates by variant
| Bi-weekly: Adjust ICP scoring
v Monthly: Rebuild underperforming sequences
CRM updated Quarterly: Full playbook review
|
v
Model retrained on
new examples

````
---

## Seção 5: Automação de qualificação

### Quadros de Qualificação Modernos

BANT tradicional adaptado para qualificação AI SDR:```
BANT (AI-Enhanced):
  B - Budget:    Inferred from company size, funding, tech spend signals
  A - Authority: Mapped from org chart enrichment + title analysis
  N - Need:      Detected from hiring signals, tech stack gaps, content consumption
  T - Timeline:  Inferred from contract renewal dates, fiscal year, urgency signals

CHAMP (Challenger-Focused):
  CH - Challenges:  Extracted from job postings, reviews, earnings calls
  A  - Authority:   Same as BANT
  M  - Money:       Same as Budget
  P  - Prioritize:  Signal recency + engagement velocity
````

### Fluxo de qualificação automatizado```

PROSPECT ENTERS SYSTEM
|
v
ICP Score >= 50? ----NO----> Nurture sequence or disqualify
|
YES
|
v
Signal score >= 25? ----NO----> Add to low-priority drip
|
YES
|
v
QUALIFICATION SEQUENCE (3-5 touches)
|
v
Reply received? ----NO----> Archive after sequence completes
|
YES
|
v
AI classifies reply sentiment
|
+----+----+----+
| | | |
POS NEU NEG OBJ
| | | |
v v v v
ROUTE AI REMOVE AI HANDLES
TO FOLLOW- WITH
HUMAN UP PLAYBOOK
| |
v v
Reply? Resolved?
| |
YES YES --> Route to human
| NO --> Escalate or remove
v
Route to human

````
### Coleta de dados de qualificação

O que o AI SDR deve capturar antes de encaminhar para um representante humano:```
REQUIRED BEFORE HANDOFF:
  [ ] Company name and size confirmed
  [ ] Contact title and role verified
  [ ] Primary pain point identified
  [ ] Current solution (if any) noted
  [ ] Timeline indicator captured
  [ ] Budget range estimated (from signals, not asked directly)
  [ ] Next step agreed (meeting, demo, resource)

NICE TO HAVE:
  [ ] Other stakeholders mentioned
  [ ] Evaluation criteria stated
  [ ] Competitor tools in consideration
  [ ] Decision process described
````

---

## Seção 6: Design humano no circuito

### A Regra de Ouro

A IA trata de: pesquisa, enriquecimento, personalização, sequenciamento, agendamento, entrada de dados, qualificação inicial.

Os humanos lidam com: chamadas de descoberta, demonstrações, negociação de objeções, personalização de propostas, fechamento, construção de relacionamento.

O ponto de transferência determina sua taxa de conversão. Mova-se muito cedo e você desperdiçará tempo humano. Se for tarde demais, você perderá negócios devido ao mau julgamento da IA ​​em situações diferenciadas.

### Matriz de gatilho de transferência```

+-------------------------+------------------+-------------------+
| Trigger | Route To | Context Provided |
+-------------------------+------------------+-------------------+
| Positive reply | Assigned SDR/AE | Full conversation |
| (interested) | | + enrichment data |
+-------------------------+------------------+-------------------+
| Meeting booked | Calendar owner | Prospect brief + |
| | | signal summary |
+-------------------------+------------------+-------------------+
| Pricing question | AE | Deal stage + |
| | | company profile |
+-------------------------+------------------+-------------------+
| Technical question | SE or product | Question + tech |
| | | stack context |
+-------------------------+------------------+-------------------+
| High-value objection | Senior AE or | Objection type + |
| | manager | account history |
+-------------------------+------------------+-------------------+
| Enterprise prospect | Enterprise AE | Full account |
| (>1000 employees) | | research brief |
+-------------------------+------------------+-------------------+
| Referred lead | Original | Referral source + |
| | relationship | context |
| | owner | |
+-------------------------+------------------+-------------------+

````
### Design de Notificação

Ao encaminhar para um humano, forneça um resumo estruturado:```
SLACK NOTIFICATION FORMAT:

New qualified lead routed to you

Prospect: Jane Smith, VP Sales at Acme Corp
Signal: Visited pricing page 2x this week + hiring 3 AEs
ICP Score: 87/100 (Tier 1)
Qualification: Budget likely ($12M ARR), Authority confirmed,
               Need (scaling outbound), Timeline (Q2 planning)

Conversation summary:
- Email 1 (Jan 15): Opened, no reply
- Email 2 (Jan 18): Replied "interesting, tell me more"
- AI follow-up (Jan 18): Sent case study, asked for 15min call
- Reply (Jan 19): "Can we do Thursday at 2pm?"

Recommended next step: Confirm meeting, prep demo focused on
outbound automation use case

[Open in CRM] [View full thread] [Claim lead]
````

---

## Seção 7: Análise de custos e estrutura de ROI

### Construir vs. Decisão de compra```

BUILD YOUR OWN STACK:
Clay (enrichment): $149-800/mo
Instantly or Smartlead: $30-97/mo
n8n or Make (orchestration): $20-99/mo
LLM API costs (GPT-4/Claude): $50-200/mo
Domain + mailbox costs: $50-100/mo

---

TOTAL: $300-1,300/mo

BUY AN AI SDR PLATFORM:
AiSDR: $900-2,500/mo
Artisan: $2,400-7,200/mo
11x: $5,000-10,000/mo

---

TOTAL: $900-10,000/mo

HIRE A HUMAN SDR:
Salary: $50K-80K/yr
Benefits + overhead: $15K-25K/yr
Tools + tech stack: $200-500/mo
Ramp time: 3-6 months

---

TOTAL: $6K-9K/mo (fully loaded)

````
### Modelo de cálculo de ROI```
MONTHLY INPUTS:
  Prospects contacted:         ______
  Reply rate:                  ______%
  Meeting conversion rate:     ______%
  Meeting-to-opportunity rate: ______%
  Opportunity-to-close rate:   ______%
  Average deal value:          $______

MONTHLY OUTPUTS:
  Meetings booked:    Prospects x Reply% x Meeting%
  Opportunities:      Meetings x Opp%
  Deals closed:       Opportunities x Close%
  Revenue generated:  Deals x Avg Deal Value

ROI:  (Revenue - AI SDR Cost) / AI SDR Cost x 100

EXAMPLE (mid-market SaaS):
  1,000 prospects x 8% reply x 40% meeting = 32 meetings
  32 meetings x 25% opp = 8 opportunities
  8 opportunities x 20% close = 1.6 deals
  1.6 deals x $25,000 ACV = $40,000 revenue/month
  AI SDR cost: $1,500/month
  ROI: ($40,000 - $1,500) / $1,500 = 2,567%
````

---

## Seção 8: Modos de falha comuns

### Por que as implantações de AI SDR falham```

## FAILURE MODE FIX

Bad data in, bad outreach out Fix enrichment waterfall first.
80%+ match rate before launching.

Generic messaging at scale Invest in signal-based
personalization. "Spray and pray"
with AI is still spray and pray.

No human handoff process Define handoff triggers before
launch. Build Slack/CRM routing
on day 1.

Burning domains Follow warmup protocol. Never
exceed 50 emails/day/mailbox.
Monitor bounce and complaint rates.

Over-automating the close AI generates pipeline. Humans
close deals. Do not let AI handle
pricing negotiations or contracts.

Ignoring reply sentiment Negative replies left in sequence
destroy reputation. Classify
every reply, remove negatives
immediately.

No feedback loop If you are not adjusting ICP
scores and message variants
monthly, your AI SDR decays.

Tool obsession over architecture Switching from 11x to Artisan
will not fix bad instruction
stacks or missing context.

```

```
