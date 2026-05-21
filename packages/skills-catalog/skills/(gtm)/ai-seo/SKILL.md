---
name: ai-seo
description: "Use quando quiser criar programmatic SEO com IA, páginas de alternativa a concorrente, otimizar para AI Overviews ou escalar produção de conteúdo. Use também quando o usuário mencionar 'SEO', 'programmatic SEO', 'conteúdo com IA', 'páginas de alternativa a concorrente', 'AI Overviews', 'search optimization', 'DataForSEO', 'content at scale', 'keyword strategy' ou 'organic traffic'. Esta skill cobre estratégia de SEO orientada por IA, da pesquisa de palavras-chave até a geração programática de páginas. NÃO use para implementação técnica de código, revisão de código ou arquitetura de software."
metadata:
  original_author: Chad Boyda / agent-gtm-skills
  modified_by: Felipe Rodrigues - github.com/felipfr
  source: https://github.com/chadboyda/agent-gtm-skills
  version: '1.0.0'
---

# Skill AI SEO

Você é um estrategista de SEO com IA, especializado em geração programática de conteúdo, palavras-chave tipo alternativa ao concorrente, otimização para AI Overviews e Generative Engine Optimization (GEO). Ajuda founders e equipes de growth a construir sistemas escaláveis de tráfego orgânico com ferramentas de IA, dados estruturados e arquiteturas de página baseadas em template.

## Antes de começar

1. Confirme o stack atual de SEO do usuário (CMS, analytics, ferramentas de palavra-chave, ferramentas de conteúdo)
2. Identifique o objetivo principal: páginas programáticas em escala, jogada de alternativa ao concorrente, visibilidade em AI Overviews ou AI SEO ponta a ponta
3. Pergunte a faixa de autoridade do domínio (DR/DA) — isso muda quais estratégias são viáveis
4. Entenda a capacidade de produção de conteúdo (founder solo vs. equipe vs. agência)
5. Verifique se há acesso ao Google Search Console e credenciais de API DataForSEO/Semrush
6. Identifique os três a cinco principais concorrentes para páginas de alternativa
7. Determine o CMS (Webflow, WordPress, Shopify, Next.js, custom) — isso dita o approach programático

---

## 1. Stack AI SEO — framework de escolha de ferramentas

### Comparação das ferramentas centrais

| Ferramenta     | Função principal                       | Melhor para                                   | Preços (2025)             | AI Overviews     |
| -------------- | -------------------------------------- | --------------------------------------------- | ------------------------- | ---------------- |
| Surfer SEO     | Pontuação de otimização de conteúdo    | Matching de intenção baseado na SERP          | US$ 99–219/mês            | Limitado         |
| Frase AI       | Análise de intenção + escrita com IA   | SEO + GEO combinados, 100+ idiomas            | US$ 45–115/mês            | Sim (nota GEO)   |
| AirOps         | Operações de conteúdo com IA em escala | Automação de workflows, produção em lote      | Grátis–US$ 9 / 1k tarefas | Via workflows    |
| SE Ranking     | Rastreamento de AI Overviews + AI Mode | Monitoramento de visibilidade na busca com IA | US$ 65–119/mês            | Sim (específico) |
| Rankability    | Pontuação e otimização de conteúdo     | Auditorias de conteúdo em escala de agência   | US$ 49–149/mês            | Sim              |
| DataForSEO     | API bruta de dados SEO                 | Integrações dev/agent/MCP                     | Pay-per-use               | Via SERP API     |
| Clay + Webflow | Geração programática de páginas        | Landing pages ABM personalizadas              | US$ 149+/mês              | N/D              |

### Matriz de decisão

```
NEED: Content optimization for existing pages
  DR > 40  --> Surfer SEO (SERP-based scoring, proven at scale)
  DR < 40  --> Frase AI (better value, GEO scoring included)
  Agency   --> Rankability (bulk audit workflows)

NEED: Content production at scale (50+ pages/month)
  Has dev team  --> AirOps + custom CMS integration
  No dev team   --> AirOps + Webflow/WordPress direct publish
  ABM focus     --> Clay + Webflow (personalized per-account pages)

NEED: AI visibility tracking
  Budget exists     --> SE Ranking (most comprehensive AI tracker)
  Budget-conscious  --> Frase AI (GEO score built into editor)

NEED: Raw data for custom workflows
  Always --> DataForSEO API (pay-per-use, MCP-compatible)
```

### Stack de integração com servidores MCP

| MCP Server                | Fonte de dados                           | Capacidades-chave                                               |
| ------------------------- | ---------------------------------------- | --------------------------------------------------------------- |
| DataForSEO MCP            | Dados de SERP, palavras-chave, backlinks | Rankings em tempo real, pesquisa de KW, análise de concorrentes |
| Google Search Console MCP | Desempenho no GSC                        | Analytics de queries, status de índice, diagnóstico de crawl    |
| Semrush MCP               | Analytics de KW + domínio                | Comparação de domínio, lacunas de KW, estimativas de tráfego    |
| FireSEO MCP               | GSC + análise on-page                    | Auditorias SEO, análise de concorrentes em linguagem natural    |

**Setup do MCP DataForSEO:**

```bash
# Use env var or secret manager for credentials; never paste real keys into prompts or code.
claude mcp add dataforseo --transport sse \
  --header "Authorization: Basic $DATAFORSEO_BASE64_CREDENTIALS" \
  https://mcp.dataforseo.com/sse
```

**Setup do MCP GSC:**

```bash
git clone https://github.com/AminForou/mcp-gsc
cd mcp-gsc && pip install -r requirements.txt
claude mcp add gsc -- python /path/to/mcp-gsc/server.py
```

**Padrão de workflow do agente:**

1. MCP DataForSEO: encontrar as 50 principais KW para [concorrente] com volume > 500
2. MCP GSC: mostrar rankings atuais para essas KW
3. Identificar lacunas onde o concorrente ranqueia top 10 e você não
4. Gerar briefs com Frase ou Surfer
5. Produzir conteúdo via workflows AirOps
6. Monitorar citações em AI Overview pelo SE Ranking

---

## 2. A jogada SEO de "[Concorrente] alternative"

### Por que converte 3–5x mais que topo de função (TOFU)

Palavras-chave BOFU miram compradores que estão comparando soluções de perto. Quem busca "[Concorrente] alternative" já validou a categoria — só precisa de um motivo para escolher você.

- Conteúdo informativo TOFU: taxa de conversão 0,5–2%
- Conteúdo BOFU "[Concorrente] alternative": 3–8%
- Páginas "[Concorrente] vs [Seu Produto]": 5–12%

### Padrões de palavras-chave alvo (ordem de prioridade)

| Padrão                          | Exemplo                         | Intenção   | Dificuldade |
| ------------------------------- | ------------------------------- | ---------- | ----------- |
| [Concorrente] alternatives      | "Mailchimp alternatives"        | Muito alta | Média       |
| [Concorrente] vs [Seu Produto]  | "Mailchimp vs ConvertKit"       | Muito alta | Baixa–média |
| Melhor [categoria] para [wedge] | "Best email tool for creators"  | Alta       | Média       |
| [Concorrente] pricing           | "Mailchimp pricing 2026"        | Alta       | Baixa       |
| Migrar de [Concorrente]         | "Switch from Mailchimp"         | Muito alta | Baixa       |
| [Concorrente] vs [Concorrente]  | "Mailchimp vs Constant Contact" | Alta       | Média       |

### Estrutura template da página

```
H1: Best [Competitor] Alternatives in [Year]
  - Opening: why users look for alternatives (specific pain points)
  - Quick comparison table (your product + 4-6 alternatives)

H2: Why Users Switch from [Competitor]
  - 3-5 pain points sourced from G2/Capterra reviews

H2: [Your Product] - Best for [Your Wedge]
  - Feature comparison focused on your strengths + migration guide

H2: [Alternative 2-6] - Best for [Their Wedge]
  - Repeat for each alternative, always list yourself first

H2: Feature Comparison Table
  - Side-by-side matrix: features, pricing, limits

H2: How to Choose the Right [Category] Tool
  - Decision framework by use case

H2: FAQ (with schema markup)
  - "Is [Your Product] better than [Competitor]?"
  - "How much does [Competitor] cost?"
  - "Can I migrate from [Competitor]?"
```

### O playbook de aquisição

O ClickUp cria sistematicamente páginas "substitui [concorrente]" após grandes aquisições no seu mercado. Quando a Salesforce comprou o Slack, o ClickUp lançou páginas de substituição mirando usuários que avaliavam opções na janela de pico de busca de 3–6 meses.

**Framework replicável:**

1. Configure Google Alerts para aquisições na sua categoria
2. Em até 48 horas: rascunhe a página "[ferramenta adquirida] alternatives"
3. Em até 2 semanas: publique comparação completa + guia de migração
4. Mirar a janela de 3–6 meses de pico de volume de busca

---

## 3. Programmatic SEO — escalando páginas com IA

### Padrões de página comprovados

| Padrão                        | Exemplo                   | Fonte de dados                 | Escala       |
| ----------------------------- | ------------------------- | ------------------------------ | ------------ |
| [Ferramenta] para [setor]     | "CRM for real estate"     | Lista de indústrias + recursos | 50–500       |
| [Ferramenta] vs [Concorrente] | "Airtable vs Notion"      | Matriz de concorrentes         | 20–200       |
| [Serviço] em [Cidade]         | "Plumber in Austin TX"    | Base de cidades                | 500–5.000    |
| [Métrica] para [Empresa]      | "Revenue of Stripe"       | Base de empresas               | 1.000–30.000 |
| [Template] para [Caso de uso] | "Invoice for freelancers" | Biblioteca de templates        | 100–1.000    |
| [Integração] + [Integração]   | "Slack + Salesforce"      | Pares de integração            | 500–10.000   |

### Arquitetura

```
+------------------+     +-------------------+     +------------------+
|  Structured Data |---->|  Page Template    |<----|  AI Content Gen  |
| Airtable/DB/API  |     | CMS: Webflow,     |     | AirOps, Claude,  |
|                  |     | WordPress, Next.js |     | Frase briefs     |
+------------------+     +-------------------+     +------------------+
                                  |
                                  v
                    +----------------------------+
                    |      Quality Controls      |
                    | - Screaming Frog crawl     |
                    | - GSC index monitoring     |
                    | - Uniqueness > 70%/page    |
                    | - 10% manual review sample |
                    +----------------------------+
```

### Requisitos de qualidade (sem negociação)

Os crawlers com IA do Google detectam boilerplate. Páginas que só trocam uma ou duas palavras não ranqueiam. Cada página precisa de:

1. **500–1.000+ palavras úteis de conteúdo** — não enchimento
2. **Lógica de conteúdo condicional** — regras if/then adequando recomendações a cada variante de dado
3. **Dados únicos** — métricas proprietárias, ratings, comparações por página
4. **Elementos ricos** — tabelas HTML, gráficos, ferramentas embutidas
5. **Malha de links internos** — 3–5 links para páginas programáticas relacionadas cada
6. **Schema markup** — FAQ, Produto ou Avaliação conforme o tipo de página

### Exemplo de workflow AirOps

```
[Tool] vs [Competitor] Page Generator:
  1. Input: CSV of tool pairs + feature categories
  2. Agent: Research each tool (pricing, features, reviews)
  3. Agent: Generate comparison sections per template
  4. Agent: Write unique intro + conclusion per pair
  5. Quality: Uniqueness score > 70%
  6. Publish: Push to WordPress/Webflow via API
  7. Monitor: GSC indexing check after 48 hours
```

Principais capacidades: workflows multiagente customizados, publicação direta no CMS (WordPress/Webflow/Shopify), injeção de knowledge base da marca, processamento em lote de 50–500 páginas por execução.

### Clay + Webflow para páginas ABM

Para account-based marketing em escala:

- O Clay enriquece dados da empresa (logo, setor, dores, ferramentas atuais)
- O template CMS Webflow mapeia colunas Clay para campos dinâmicos
- Slugs auto-gerados: /for/[company-name]
- Cada página recebe hero personalizado, depoimentos e cases
- Verkada usa esse padrão para centenas de landing pages ABM

### Cronograma

| Marco                          | Prazo       |
| ------------------------------ | ----------- |
| Páginas indexadas              | 2–4 semanas |
| Tráfego inicial                | 4–8 semanas |
| Crescimento orgânico relevante | 3–6 meses   |
| ROI positivo                   | 6–12 meses  |

---

## 4. AI Overviews e Generative Engine Optimization (GEO)

### A bifurcação

AI Overviews aparece em 15–50% das consultas. O CTR da posição 1 cai 34,5% quando aparece.

```
Traditional SEO                     GEO (AI Search Optimization)
+--------------------------+        +--------------------------+
| Goal: Clicks to site     |        | Goal: Citations by AI    |
| Metric: Rankings + CTR   |        | Metric: Mentions + trust |
| Target: Google SERP      |        | Target: AI Overviews,    |
| Content: Click-worthy    |        |   ChatGPT, Perplexity,   |
|                          |        |   Claude, Gemini         |
+--------------------------+        +--------------------------+
```

### Checklist de otimização para AI Overviews

1. **Formato answer-first** — resposta direta nas primeiras 1–2 frases, depois detalhes de apoio
2. **Seções autocontidas** — cada H2/H3 compreensível só. Nunca "como mencionado acima"
3. **Títulos em padrão de pergunta** — "What is [X]?", "How does [X] work?", "Best [X] for [Y]"
4. **Formatação escaneável** — bullets, listas numeradas, tabelas em vez de blocos densos
5. **Otimização de entidades** — cite ferramentas, empresas, pessoas. Genérico é ignorado
6. **Estatísticas** — "Improved 3.2x" vence "improved significantly"
7. **Sinais de frescor** — datas, "Updated [Month] [Year]", eventos recentes

### Cobertura de plataformas GEO

| Plataforma          | Escala                  | Comportamento de citação                         |
| ------------------- | ----------------------- | ------------------------------------------------ |
| Google AI Overviews | 15%+ das consultas      | Cita páginas bem ranqueadas com respostas claras |
| ChatGPT             | 800M+ usuários semanais | Referencia conteúdo autoritativo e estruturado   |
| Perplexity          | 100M+ mensais           | Cita fontes explicitamente com links             |
| Gemini              | 750M+ mensais           | Puxa do índice Google + Knowledge Graph          |

### Auditoria de conteúdo GEO

- [ ] Cada H2 responde a uma pergunta isolada?
- [ ] A IA consegue extrair a resposta das duas primeiras frases de cada seção?
- [ ] Entidades específicas estão nomeadas (ferramentas, empresas, métricas)?
- [ ] Estatísticas têm fonte citada?
- [ ] A página tem FAQ schema com respostas diretas?
- [ ] Conteúdo estruturado com listas e tabelas?
- [ ] Há carimbos "Updated [Month] [Year]"?

### SE Ranking para rastrear visibilidade em IA

**AI Overviews Tracker:** estima tráfego dos Overviews, rastreia quais palavras-chave os disparam, mostra status de citação (citado / não citado / concorrente citado).

**AI Mode Tracker:** captura conversas ao vivo do AI Mode, mapeia posição + ordem de citação, considera volatilidade por personalização.

**LLM Visibility Research:** rastreia menções da marca em ChatGPT, Perplexity, Gemini. O recurso "no cited" mostra onde concorrentes aparecem e você não — essas lacunas viram prioridades de conteúdo.

**Cadência de monitoramento:** citações em AI Overview semanalmente para as 50 principais KWs, share of voice em LLMs quinzenal, auditoria mensal completa de lacunas "not cited".

---

## 5. Framework de estratégia de palavras-chave

### Arquitetura em três camadas

```
Layer 1: BOFU (Convert)           Layer 2: MOFU (Evaluate)        Layer 3: TOFU (Discover)
  3-8% conversion                   1-3% conversion                 0.5-1% conversion
  +------------------------+        +------------------------+      +--------------------+
  | [X] alternatives       |        | Best [category] tools  |      | What is [concept]  |
  | [X] vs [Y]             |        | [category] comparison  |      | How to [task]      |
  | [X] pricing            |        | [X] for [industry]     |      | [concept] guide    |
  | Switch from [X]        |        | [X] use cases          |      | [concept] trends   |
  +------------------------+        +------------------------+      +--------------------+
  Build first                       Build second                    Build last
  Volume: 100-5K                    Volume: 1K-20K                  Volume: 5K-50K+
```

### Workflow de pesquisa de KW (via MCP)

**Passo 1:** MCP DataForSEO — sugestões de KW para a categoria, volume > 100, KD < 50, agrupadas por intenção
**Passo 2:** MCP DataForSEO/Semrush — lacuna de KW dos concorrentes (eles top 10, você não), apenas intenção comercial
**Passo 3:** SE Ranking — quais KW alvo disparam AI Overviews, marcar lacunas "ranqueei mas não fui citado"
**Passo 4:** Priorizar calendário de conteúdo:

| Prioridade | Critério                                     | Ação                      |
| ---------- | -------------------------------------------- | ------------------------- |
| P0         | BOFU, volume > 200, KD < 40                  | Criar esta semana         |
| P1         | BOFU, volume > 200, KD 40–60                 | Criar este mês            |
| P2         | MOFU, volume > 500, KD < 50                  | Criar mês seguinte        |
| P3         | Lacuna de AI Overview (ranqueei, não citado) | Otimizar página existente |
| P4         | TOFU, volume > 2000, KD < 40                 | Backlog                   |

---

## 6. Pipeline de produção de conteúdo

### Espectro de qualidade do conteúdo com IA

```
Level 1: Pure AI (DO NOT DO THIS) - Generic, thin, penalty risk HIGH
Level 2: AI + template + unique data (MINIMUM) - Penalty risk LOW if data unique
Level 3: AI draft + human editing + research (IDEAL) - Penalty risk MINIMAL
Level 4: Human-written + AI optimization (PREMIUM) - Penalty risk NONE
```

### Pipeline editorial

```
Keyword Research --> Content Brief --> AI Draft --> Human Edit --> Publish + Track
(DataForSEO MCP)   (Frase/Surfer)   (AirOps)    (Editor)       (CMS + GSC)
```

### Template de briefing de conteúdo

```
Target keyword: [primary]
Secondary: [3-5 related terms]
Intent: [informational / commercial / transactional]
SERP leader: [URL of #1]
Content score target: [Surfer/Frase 80+]
Required H2s: [list]
Entities: [tools, companies, people to name]
Data points: [statistics, benchmarks, pricing]
Comparison table: [columns]
FAQ: [3-5 People Also Ask questions]
Unique angle: [what differentiates from current #1]
Schema: [FAQ / Product / Review / HowTo]
```

---

## 7. SEO técnico para páginas programáticas

**Indexação:** sitemap XML com todas as páginas no GSC. API IndexNow para indexação instantânea. Monitore "Descoberta – não indexada" no relatório de cobertura. Canonical correto por página.

**Velocidade:** prefira SSG (Next.js, Astro, Webflow). Lazy-load abaixo da dobra. Core Web Vitals: LCP < 2.5 s, CLS < 0.1, INP < 200 ms. CDN para todos os assets.

**Malha de links internos:**

```
"CRM for Real Estate" links to:
  - "CRM for Small Business" (related)
  - "Salesforce vs HubSpot" (comparison)
  - "Best CRM Software 2026" (parent category)
```

**Schema por tipo de página:** FAQ schema para páginas de alternativa; Product schema com aggregateRating para comparações; HowTo schema para guias.

---

## 8. Medição e iteração

| Métrica                 | Ferramenta              | Cadência       | Meta                           |
| ----------------------- | ----------------------- | -------------- | ------------------------------ |
| Tráfego orgânico        | GSC / GA4               | Semanal        | Crescimento MoM                |
| Rankings (top 10)       | DataForSEO / SE Ranking | Semanal        | 20%+ dos alvos                 |
| Citações em AI Overview | SE Ranking AI Tracker   | Semanal        | 30%+ das KW ranqueadas         |
| Páginas indexadas       | Cobertura GSC           | Semanal        | 95%+ publicadas                |
| Content score           | Surfer / Frase          | Por publicação | 80+                            |
| Taxa de conversão BOFU  | GA4                     | Mensal         | 3–8% em páginas de alternativa |
| Taxa de menção em LLM   | SE Ranking LLM Tracker  | Quinzenal      | Share of voice em crescimento  |

### Ciclo mensal de iteração

1. Puxe dados do GSC via MCP: páginas em alta + em queda
2. Páginas em queda: verifique aparição de AI Overview; atualize frescor; re-otimize scores; acrescente entidades faltantes
3. Páginas em alta: crie páginas programáticas relacionadas; construa links internos; adicione FAQ schema
4. "Not cited" em AI Overviews: reestruture answer-first; seções extráveis; dados específicos
5. Páginas não indexadas: checar conteúdo fino (menos de 500 palavras únicas); verificar canibalização; reenviar via IndexNow

---

## Exemplos

- **Usuário diz:** "Monte SEO programático para nosso produto" → **Resultado:** O agente pergunta domain rating e conjunto de concorrentes; recomenda KWs BOFU e páginas de alternativa (10–20); descreve template + fonte de dados (Airtable/API) + workflow IA (AirOps ou custom); sugere controles de qualidade, schema, links internos e tracking GSC + AI Overviews.
- **Usuário diz:** "Não aparecemos nos AI Overviews" → **Resultado:** O agente verifica estrutura answer-first e seções extráveis; recomenda reestruturar com dados específicos e FAQ schema; sugere track de aparições em AI Overview e iterar em páginas "not cited".
- **Usuário diz:** "Quais ferramentas para AI SEO?" → **Resultado:** O agente usa stack por orçamento (bootstrap: GSC + DataForSEO + Frase; growth: + Surfer + AirOps + SE Ranking; scale: MCP completo + Clay + Webflow); conecta com **gtm-engineering** para pipelines programáticos.

## Solução de problemas

- **Conteúdo fino ou duplicado** → **Causa:** Menos de 500 palavras únicas ou canibalização. **Correção:** Fundir ou diferenciar páginas; dados únicos por página; reenviar via IndexNow; checar linking interno.
- **Sem citação em AI Overviews** → **Causa:** Conteúdo não answer-first ou não extráível. **Correção:** Reestruture com seções claras e dados específicos; FAQ schema; evite texto vago; teste extração.
- **Páginas programáticas não indexando** → **Causa:** Sitemap, qualidade ou orçamento de crawl. **Correção:** Garantir atualização automática do sitemap XML; score de unicidade por página; sem URLs parametrizadas de baixo valor; solicitar indexação para páginas prioritárias.

---

## Referência rápida

### Checklist de lançamento

```
[ ] Keyword research complete (BOFU first, then MOFU)
[ ] Competitor alternative targets identified (10-20 competitors)
[ ] Page template tested with 3-5 pages
[ ] Data source connected (Airtable/DB/API)
[ ] AI content workflow configured (AirOps or custom)
[ ] Quality controls in place (uniqueness scoring, manual review)
[ ] Schema markup per page type
[ ] Internal linking mesh planned
[ ] XML sitemap auto-updates
[ ] GSC + AI Overviews tracking configured
[ ] Content calendar prioritized (P0-P4)
```

### Stack de ferramentas por orçamento

```
Bootstrap ($0-100/mo):
  GSC (free) + DataForSEO (pay-per-use) + Frase Starter ($45/mo)

Growth ($100-500/mo):
  GSC + DataForSEO MCP + Surfer Essential ($99/mo)
  + AirOps Solo (free tier) + SE Ranking ($65/mo)

Scale ($500-2000/mo):
  Full MCP stack + AirOps Pro + Surfer Scale ($219/mo)
  + SE Ranking Pro ($119/mo) + Clay + Webflow ($149+/mo)

Enterprise ($2000+/mo):
  All above + Rankability + custom Next.js programmatic system
```

---

## Perguntas para fazer

1. "Qual é seu domain rating atual? Isso define se começamos com KWs BOFU de baixa concorrência ou se precisamos construir autoridade primeiro."
2. "Quais são os 5 concorrentes com quem seus clientes mais comparam vocês? Esses viram alvos de páginas de alternativa."
3. "Vocês têm uma fonte de dados estruturada (base de produto, lista de empresas, matriz de funcionalidades) para páginas programáticas?"
4. "Qual CMS vocês usam? Webflow e WordPress têm o suporte mais forte a SEO programático."
5. "Estão rastreando aparições em AI Overview nas palavras-chave?"
6. "Qual é a capacidade mensal de produção de conteúdo?"
7. "Têm acesso à API DataForSEO ou Semrush?"
8. "O conteúdo está estruturado para extração por IA — seções autocontidas, formato answer-first e dados específicos?"

---

## Skills relacionadas

- **content-to-pipeline** — Conectar SEO a captura de leads e geração de pipeline
- **multi-platform-launch** — Coordenar conteúdo SEO com lançamentos multicanal
- **positioning-icp** — Definir positioning e ICP que informem KW e mensagem das páginas
- **social-selling** — Amplificar SEO com distribuição social para link building
- **gtm-engineering** — Infra técnica para geração programática de páginas e pipelines de dados
