---
name: positioning-icp
description: 'Use quando o usuário quiser definir perfil de cliente ideal (ICP), posicionar um produto de IA, construir arquitetura de mensagens ou validar aderência produto-mercado. Use também quando o usuário mencionar ICP, ideal customer profile, posicionamento, PMF, product-market fit, mensagens, buyer persona, sinais de enriquecimento, posicionamento de mercado ou posicionamento competitivo. Esta skill abrange posicionamento de mercado, definição de ICP, arquitetura de mensagens e validação de PMF para produtos nativos de IA. NÃO use para implementação técnica, revisão de código ou arquitetura de software.'
metadata:
  original_author: Chad Boyda / agent-gtm-skills
  modified_by: Felipe Rodrigues - github.com/felipfr
  source: https://github.com/chadboyda/agent-gtm-skills
  version: '1.0.0'
---

# Posicionamento, ICP e arquitetura de mensagens para produtos de IA

Você é especialista em posicionamento de produtos de IA, definição de ICP, arquitetura de mensagens e validação de product-market fit. Você combina a metodologia de posicionamento de April Dunford com construção moderna de ICP orientada por sinais de enriquecimento, frameworks de mensagem focados em resultado e o fato de que PMF em mercados de IA é perecível e precisa ser revalidado trimestralmente. Você entende a mudança de compradores em 2025–2026 em que líderes de área de negócio (não TI) puxam decisões de compra de IA, e ajuda fundadores a traduzir capacidades técnicas em resultados de negócio que fecham negócio.

## Antes de começar

Reúna este contexto antes de gerar qualquer entregável de posicionamento, ICP ou mensagem:

- O que o produto faz de fato hoje? Um parágrafo sobre a capacidade core, não a visão.
- Quem são os melhores clientes atuais? Peça 3–5 contas que renovaram, expandiram ou tiveram os ciclos de venda mais curtos.
- Que alternativas os prospects usam antes de achar este produto? Processos manuais, planilhas, concorrentes e ferramentas internas.
- Qual o modelo de pricing atual? Por assento, uso, resultado ou híbrido.
- Qual o motion de vendas principal? PLG, sales-led, community-led ou híbrido. Ticket médio e duração do ciclo.
- Quem assina o contrato hoje? Cargo e departamento do comprador econômico real.
- Quando o ICP ou posicionamento foi atualizado pela última vez? Se há mais de 90 dias em produto de IA, sinalize atraso.
- Qual o Sean Ellis score atual? Se desconhecido, sinalize validação de PMF como pré-requisito.

---

## 1. Pilha de posicionamento para produtos de IA

Produtos de IA enfrentam um desafio único de posicionamento: a camada de tecnologia move mais rápido que a camada de mercado. Uma declaração de posicionamento que funcionou há 90 dias pode já estar velha porque capacidades do modelo mudaram, um concorrente lançou feature parecida ou expectativas do comprador evoluíram.

### A pilha de posicionamento em quatro camadas

Construa posicionamento de baixo para cima. Cada camada precisa segurar antes da próxima funcionar.

```
+--------------------------------------------------+
|  ALTERNATIVE FRAMING                              |
|  "The [Competitor] alternative that [key diff]"   |
+--------------------------------------------------+
|  PROOF VECTOR                                     |
|  Quantified evidence the wedge delivers results   |
+--------------------------------------------------+
|  WEDGE                                            |
|  The specific capability gap you exploit           |
+--------------------------------------------------+
|  CATEGORY                                         |
|  The market context buyers already understand      |
+--------------------------------------------------+
```

### Definições das camadas

| Camada              | Função                                               | Exemplo (produto de IA)                                      |
| ------------------- | ---------------------------------------------------- | ------------------------------------------------------------ |
| Category            | Ancora o comprador em um mercado conhecido           | "AI-powered customer support automation"                     |
| Wedge               | O gap específico entre o que existe e o que você faz | "Resolves billing disputes end-to-end without human handoff" |
| Proof Vector        | Evidência de que o wedge funciona                    | "47% reduction in support escalations at Series B+ fintechs" |
| Alternative Framing | Capta tráfego de busca de alta intenção              | "The Intercom alternative for AI-first support teams"        |

### Modelo de declaração de posicionamento

Para [segmento ICP-alvo] que [situação ou gatilho], [nome do produto] é a [categoria] que [wedge/diferencial], ao contrário de [alternativa principal], que [limitação da alternativa]. Provamos com [proof vector].

### Erros comuns de posicionamento em IA

| Erro                                             | Por que falha                                    | Correção                                                              |
| ------------------------------------------------ | ------------------------------------------------ | --------------------------------------------------------------------- |
| Começar pelo modelo                              | "Powered by GPT-4o" não diz nada sobre resultado | Lidere com o resultado de negócio que o modelo habilita               |
| Criar categoria cedo demais                      | Pré-revenue gastando para educar mercado         | Ancore em categoria existente, depois diferencie                      |
| Claims de paridade de feature                    | "Também temos IA" não é posição                  | Ache o wedge onde você é 10× melhor num eixo                          |
| Posicionar para engenheiro vendendo para negócio | Jargão técnico para VP                           | Se o pitch inclui nome de modelo, está vendendo para o público errado |
| Posicionamento estático em mercado dinâmico      | Posicionamento “fire and forget” de 6+ meses     | Revalide no mínimo a cada 90 dias                                     |

---

## 2. Definir ICP com sinais de enriquecimento

Construa o ICP a partir de três camadas de sinais, não feeling. A definição moderna combina histórico de vitórias com sinais de enriquecimento em tempo real para um perfil vivo que se adapta à mudança do mercado.

### As três camadas de sinais

| Camada de sinal | O que revela                     | Exemplos de sinais                                                            | Ferramentas                                                     |
| --------------- | -------------------------------- | ----------------------------------------------------------------------------- | --------------------------------------------------------------- |
| Firmographic    | Forma e contexto da empresa      | Nº de funcionários, faixa de receita, vertical, geografia, estágio de funding | Clay, Apollo, ZoomInfo, Clearbit                                |
| Technographic   | Prontidão técnica e fit de stack | Ferramentas atuais, uso de API, cloud, maturidade de dados                    | BuiltWith, Wappalyzer, HG Insights, Slintel                     |
| Intent          | Comportamento de compra ativo    | Consumo de conteúdo, vagas, rodadas, pesquisa de concorrente, visitas G2      | Bombora, G2 Buyer Intent, sinais Clay, LinkedIn Sales Navigator |

### Modelo de score de ICP

Mantenha fit firmográfico/tecnográfico e intent como dimensões separadas. Colapsar em um score só esconde conta com bom fit mas sem prontidão, ou mau fit mas buscando ativamente.

**Fit Score (0–100)**

```
Fit Score = (Firmographic Match * 0.4) + (Technographic Match * 0.35) + (Behavioral Fit * 0.25)
```

| Componente          | Peso | Critérios de pontuação                                                                                                           |
| ------------------- | ---- | -------------------------------------------------------------------------------------------------------------------------------- |
| Firmographic Match  | 40%  | Vertical (25 pts), faixa de funcionários (25 pts), faixa de receita (25 pts), geografia (15 pts), estágio de funding (10 pts)    |
| Technographic Match | 35%  | Ferramentas complementares (30 pts), infra de API/integração (25 pts), stack cloud-native (25 pts), maturidade de dados (20 pts) |
| Behavioral Fit      | 25%  | Velocidade histórica de deal (30 pts), taxa de expansão (30 pts), retenção (25 pts), NPS/satisfação (15 pts)                     |

**Intent Score (0–100)**

```
Intent Score = (Third-Party Intent * 0.35) + (First-Party Signals * 0.40) + (Trigger Events * 0.25)
```

| Componente          | Peso | Critérios de pontuação                                                                                                                            |
| ------------------- | ---- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| Third-Party Intent  | 35%  | Picos de tópico Bombora (30 pts), pesquisa categoria G2 (30 pts), visitas a página do concorrente (20 pts), atividade em sites de review (20 pts) |
| First-Party Signals | 40%  | Visitas a pricing/demo (30 pts), downloads (20 pts), engajamento e-mail (25 pts), signup/trial (25 pts)                                           |
| Trigger Events      | 25%  | Nova rodada (30 pts), contratação-chave no dept alvo (25 pts), mudança de stack (25 pts), sinal de churn do concorrente (20 pts)                  |

### Matriz de priorização de ICP

```
                    High Intent
                        |
         NURTURE        |        ACTIVATE
     (Good fit,         |     (Good fit,
      not ready yet)    |      ready now)
                        |
  ----------------------+----------------------
                        |
         DISQUALIFY     |        MONITOR
     (Poor fit,         |     (Poor fit but
      not ready)        |      showing intent)
                        |
                    Low Intent

         Low Fit                    High Fit
```

- **ACTIVATE (High Fit + High Intent)**: Encaminhar para vendas na hora. Contas batem com o ICP e estão buscando ativamente. Meta de resposta: menos de 4 horas.
- **NURTURE (High Fit + Low Intent)**: Matricular em sequências de conteúdo direcionado. Convertem quando um gatilho ocorrer.
- **MONITOR (Low Fit + High Intent)**: Observar drift de ICP. Se várias contas “low fit” convertem, o ICP precisa atualizar.
- **DISQUALIFY (Low Fit + Low Intent)**: Não gastar recurso. Revisitar só na renovação trimestral do ICP.

### Arquitetura de waterfall de enriquecimento

Enriquecimento sequencial consulta vários provedores até achar dado de contato verificado. Pare no primeiro com resultado de alta confiança para minimizar custo.

```
Step 1: Clay (primary enrichment)
  |
  +--> Confidence >= 0.85? --> ACCEPT, stop
  |
  +--> Confidence < 0.85? --> Continue
  |
Step 2: Apollo (secondary)
  |
  +--> Confidence >= 0.85? --> ACCEPT, stop
  |
  +--> Confidence < 0.85? --> Continue
  |
Step 3: ZoomInfo (tertiary)
  |
  +--> Confidence >= 0.85? --> ACCEPT, stop
  |
  +--> Confidence < 0.85? --> Continue
  |
Step 4: BetterContact (verification layer)
  |
  +--> SMTP + catch-all validation
  +--> Final confidence score assigned
  +--> Confidence >= 0.50? --> ACCEPT with flag
  +--> Confidence < 0.50? --> REJECT
```

**Limiares de confiança**

| Faixa de score | Ação                                    | Entregabilidade esperada            |
| -------------- | --------------------------------------- | ----------------------------------- |
| 0,85 – 1,00    | Aceitar, rotear para outreach           | 95%+ entregável                     |
| 0,70 – 0,84    | Aceitar com flag de verificação         | 85–94% entregável                   |
| 0,50 – 0,69    | Aceitar só para nurture, sem cold email | 70–84% entregável                   |
| Abaixo de 0,50 | Rejeitar, não usar                      | Abaixo de 70%, alto risco de bounce |

### Fluxo de definição de ICP

1. **Exporte seus 20–50 melhores clientes** por NRR, velocidade de deal ou LTV
2. **Enriquecimento firmográfico** para padrões (indústria, tamanho, estágio)
3. **Enriquecimento tecnográfico** para stack em comum
4. **Analise sinais de intent** que precederam closed-won
5. **Monte o modelo de score** com pesos vindos dos seus dados, não de suposição
6. **Teste contra o pipeline** se o modelo teria previsto suas últimas 10 vitórias
7. **Cadência de revisão a cada 90 dias** — em mercados de IA o ICP deriva trimestralmente

---

## 3. Posicionamento competitivo em mercados de IA em rápida mudança

### Jogada SEO “alternativa ao concorrente”

Palavras-chave “[Competitor] alternative” têm intenção de compra altíssima. Quem busca já identificou o problema e avalia soluções. Essas palavras costumam rankear mais rápido que keywords de categoria por menor concorrência.

**Checklist de execução**

| Etapa | Ação                                                                                                                       | Ferramenta                       |
| ----- | -------------------------------------------------------------------------------------------------------------------------- | -------------------------------- |
| 1     | Liste os 10 principais concorrentes diretos e adjacentes                                                                   | Manual + páginas de categoria G2 |
| 2     | Monte o conjunto: "[competitor] alternative", "[competitor] vs [você]", "[competitor] pricing", "switch from [competitor]" | Ahrefs, Semrush ou agente SEO    |
| 3     | Crie landings dedicadas para os top 5 concorrentes                                                                         | CMS ou site estático             |
| 4     | Estruture cada página: dor, tabela comparativa, proof vector, CTA                                                          | Modelo abaixo                    |
| 5     | Conteúdo de apoio: guias de migração, posts comparativos                                                                   | Time de conteúdo ou IA assistida |
| 6     | Acompanhe rankings semanalmente e itere cópia pela conversão                                                               | Search Console + analytics       |

**Estrutura de landing “alternativa ao concorrente”**

```
1. Headline: "Looking for a [Competitor] alternative?"
2. Pain acknowledgment: Why buyers leave [Competitor]
3. Comparison table: Feature-by-feature with honest gaps noted
4. Proof vector: Case study or metric from a switcher
5. Migration section: "Switch in under 30 minutes"
6. CTA: Free trial or demo, low commitment
```

### Cadência de inteligência competitiva

| Frequência  | Ação                                                                        | Responsável                            |
| ----------- | --------------------------------------------------------------------------- | -------------------------------------- |
| Semanal     | Monitorar pricing, changelog e vagas dos concorrentes                       | GTM Ops ou agente de IA                |
| Mensal      | Revisar reviews novas G2/Capterra para mudança de sentimento                | Product Marketing                      |
| Trimestral  | Auditoria competitiva completa: posicionamento, mensagem, features, pricing | PM + Vendas                            |
| Por gatilho | Rodada, feature grande ou mudança de preço                                  | Resposta imediata orientada por alerta |

### Posicionamento contra tipos de concorrente

| Tipo                       | Estratégia                          | Mensagem-chave                                                      |
| -------------------------- | ----------------------------------- | ------------------------------------------------------------------- |
| Incumbent (enterprise)     | Velocidade e simplicidade           | "Get results in days, not months of implementation"                 |
| Concorrente de IA direto   | Profundidade no seu wedge           | "We do [specific thing] 10x better because [proof]"                 |
| DIY / interno              | Custo total de posse                | "Your team spends 40hrs/month maintaining what we do automatically" |
| Open source                | Suporte, confiabilidade, compliance | "Production-ready with SOC2, SLA, and dedicated support"            |
| Plataforma que empacota IA | Especialização                      | "We are purpose-built for [use case], not a checkbox feature"       |

---

## 4. Arquitetura de mensagens

### Framework capacidade → resultado

Produtos de IA superestimam capacidade técnica na mensagem. O ajuste é traduzir sistematicamente o que o produto faz no que o comprador ganha.

**Teste de tradução**

Se a mensagem inclui nome de modelo, você vende para engenheiros.
Se inclui resultado de negócio, você vende para compradores.

| Capacidade técnica                    | Resultado de negócio                                                       | O que importa ao comprador               |
| ------------------------------------- | -------------------------------------------------------------------------- | ---------------------------------------- |
| "Uses RAG with vector embeddings"     | "Answers customer questions with 94% accuracy using your own docs"         | Precisão, deflexão self-service          |
| "Fine-tuned LLM on your data"         | "New reps ramp 40% faster with AI coaching trained on your top performers" | Tempo até produtividade, receita por rep |
| "Real-time inference at 50ms latency" | "Fraud blocked before the transaction completes"                           | Prevenção de perda, confiança            |
| "Multi-modal AI pipeline"             | "Process invoices, receipts, and contracts without manual data entry"      | Tempo economizado, menos erro            |

### Arquitetura de mensagem em três níveis

Construa mensagem em três altitudes. Cada nível serve a um público e contexto.

```
+----------------------------------------------------------+
|  TIER 1: Strategic Narrative (CEO, Board, Press)          |
|  "Why this category matters now"                          |
|  One paragraph. No product features.                      |
+----------------------------------------------------------+
|  TIER 2: Value Proposition (VP/Director Buyer)            |
|  "What changes for your team when you adopt this"         |
|  3-5 bullet points. Business outcomes with proof.         |
+----------------------------------------------------------+
|  TIER 3: Feature Messaging (Evaluator/Champion)           |
|  "How it works and why the approach is better"            |
|  Detailed. Technical where appropriate. Comparison-ready. |
+----------------------------------------------------------+
```

| Tier   | Público                         | Extensão    | Conteúdo                            | Onde usar                                 |
| ------ | ------------------------------- | ----------- | ----------------------------------- | ----------------------------------------- |
| Tier 1 | C-suite, imprensa, investidores | 1 parágrafo | Mudança de mercado + seu papel nela | Hero do site, slide 1 do deck, PR         |
| Tier 2 | Compradores VP/Diretor          | 3–5 bullets | Resultados de negócio + provas      | Deck de vendas, páginas de produto, cases |
| Tier 3 | Avaliadores, champions          | Detalhado   | Features, arquitetura, integrações  | Docs, comparações, blog técnico           |

### Checklist de validação de mensagem

Passe cada mensagem por estes cinco testes:

| Teste                  | Pergunta                                         | Critério de aprovação                                                 |
| ---------------------- | ------------------------------------------------ | --------------------------------------------------------------------- |
| Especificidade         | Tem número ou resultado nomeado?                 | "Reduz tickets em 40%" passa. "Melhora eficiência" não passa.         |
| Diferenciação          | Concorrente poderia dizer o mesmo?               | Se sim, reescreva até só você poder afirmar.                          |
| Linguagem do comprador | Usa palavras que o comprador realmente diz?      | Tire de calls de vendas e reviews G2, não de brainstorm de marketing. |
| Prova                  | Há evidência para a alegação?                    | Citação, métrica de case ou validação terceira.                       |
| Altitude               | A mensagem está no nível certo para a audiência? | Tier 1 em doc técnico falha. Tier 3 em board falha.                   |

---

## 5. Mudança do comprador: líderes de negócio comprando IA

### Quem compra IA em 2025–2026

A compra de IA migrou de TI para líderes de função de negócio. Organizações alinhadas em prioridades de IA têm quase o dobro da chance de crescimento acima da média. ICP, mensagem e motion de vendas precisam mirar o comprador de negócio, não o CTO.

| Sinal                  | 2022–2023                                 | 2025–2026                                    |
| ---------------------- | ----------------------------------------- | -------------------------------------------- |
| Comprador principal    | CTO / VP Engineering                      | VP Ops, VP Sales, VP CX, CFO                 |
| Critérios de avaliação | Arquitetura técnica, benchmarks de modelo | Time-to-value, ROI, fit de workflow          |
| Justificativa          | "Orçamento de inovação"                   | "Economia de headcount" ou "lift de receita" |
| Linha do tempo         | 6–12 meses de avaliação                   | Piloto a compra em 30–90 dias                |
| Métrica de sucesso     | Acurácia do modelo, uptime                | Pipeline, tickets defletidos, horas salvas   |
| Procurement            | Mínimo                                    | Forte, focado em ROI mensurável              |

### Implicações para GTM

| Elemento GTM      | Abordagem antiga (vender para TI)     | Nova (vender para negócio)            |
| ----------------- | ------------------------------------- | ------------------------------------- |
| Demo              | Diagrama de arquitetura               | Workflow antes/depois                 |
| Case              | "Reduzimos latência de inferência 3×" | "Time de vendas fecha 28% mais deals" |
| Página de pricing | Preço por chamada de API              | Por resultado ou por workflow         |
| Deck de vendas    | Deep-dive técnico                     | Business case com calculadora de ROI  |
| Champion          | Engenheiro sênior                     | Diretor/VP no dept comprador          |
| Conteúdo          | Posts técnicos, docs                  | Guias de ROI, benchmarks, playbooks   |
| Trial             | Sandbox de API                        | Template de workflow pré-configurado  |

### Mapeando mensagem ao novo comprador

Para cada mensagem, pergunte: "Um VP de [área] encaminharia isso ao CFO para justificar a compra?" Se não, a altitude está errada.

---

## 6. PMF perecível: revalidação trimestral

### Por que o PMF em IA expira

Em mercados de IA, PMF não é marco que se conquista para sempre. Capacidades de modelo evoluem mensalmente, expectativas mudam com exposição a sistemas melhores e novos concorrentes surgem toda semana. Quem validou PMF há seis meses pode já estar perdendo.

Os dados batem: só 5% dos projetos de IA generativa entregam valor real de negócio — muitas vezes porque validam uma vez e assumem que o sinal permanece. Revalidação contínua é o remédio.

### Cadência de revalidação de PMF a cada 90 dias

Rode este ciclo a cada trimestre. Cada parte leva 1–2 semanas. Ciclo total 4–6 semanas, com folga antes do próximo.

| Semana | Ação                           | Método                                                              | Saída                                              |
| ------ | ------------------------------ | ------------------------------------------------------------------- | -------------------------------------------------- |
| 1      | Pesquisa Sean Ellis            | Usuários ativos: "Quão decepcionado você ficaria sem este produto?" | Score PMF (meta: 40%+ "muito decepcionado")        |
| 2      | Análise de retenção por coorte | Comparar D7/D30/D90 entre coortes mensais                           | Tendência (melhora, flat, queda)                   |
| 3      | Auditoria competitiva          | Top 5 concorrentes: posicionamento, pricing, features               | Relatório delta                                    |
| 4      | Refresh de ICP                 | Vitórias/derrotas do trimestre para drift de ICP                    | Pesos de score atualizados                         |
| 5–6    | Síntese + ação                 | Unir sinais em updates de posicionamento/mensagem/ICP               | Doc de posicionamento, ICP revisado, mensagem nova |

### Benchmarks Sean Ellis para produtos de IA

| Score         | Interpretação                                           | Ação                                         |
| ------------- | ------------------------------------------------------- | -------------------------------------------- |
| Abaixo de 20% | Sem PMF. O produto ainda não resolve problema real.     | Pivotar ou estreitar ICP drasticamente.      |
| 20–30%        | Sinal fraco. Alguns veem valor, a maioria não.          | Achar o segmento com maior score e focar.    |
| 30–40%        | Aproximando PMF. Falta afiar o wedge.                   | Dobrar no caso de uso com maior score.       |
| 40–50%        | PMF alcançado. Investimento em crescimento faz sentido. | Escalar motion de vendas, expandir time.     |
| 50–60%        | PMF forte. Entre os melhores em estágio inicial.        | Otimizar unit economics, expansão adjacente. |
| 60%+          | Excepcional. Raro mesmo entre empresas de sucesso.      | Defender posição, expandir categoria.        |

### Sinais de alerta de decaimento de PMF

| Sinal                                         | Significado                                 | Resposta                                                  |
| --------------------------------------------- | ------------------------------------------- | --------------------------------------------------------- |
| Sean Ellis cai 5+ pontos quarter-over-quarter | Percepção de valor enfraquecendo            | Reentrevistar churned, checar lançamentos de concorrentes |
| Retenção D30 abaixo da coorte anterior        | Novos usuários recebem menos valor          | Auditar onboarding, checar drift de ICP                   |
| Win rate cai com pipeline crescendo           | Posicionamento atrai público errado         | Apertar ICP e critérios de qualificação                   |
| Ciclo de vendas alongando                     | Confiança menor ou concorrência maior       | Atualizar proof vectors, novos cases                      |
| NPS cai com uso estável                       | Retenção por custo de troca, não satisfação | Urgente: entrevistar detratores, corrigir                 |

### Panorama de modelos de pricing de IA (contexto para PMF)

O modelo de pricing afeta sinais de PMF. O errado gera churn mesmo com produto valioso.

| Modelo               | Quando usar                          | Risco                                                | Tendência 2025–2026                                             |
| -------------------- | ------------------------------------ | ---------------------------------------------------- | --------------------------------------------------------------- |
| Por assento          | Produto simples, uso previsível      | Margem 40% menor, churn 2,3× maior vs uso            | Em queda (21% → 15% em 12 meses)                                |
| Por uso              | APIs, carga variável                 | Imprevisibilidade de receita, ansiedade de orçamento | Crescendo (59% das empresas de software aumentando peso do uso) |
| Por resultado        | ROI alto e mensurável                | Difícil medir, precisa atribuição                    | Emergindo (30%+ enterprise SaaS com componente de resultado)    |
| Híbrido (base + uso) | Maioria dos produtos de IA 2025–2026 | Complexidade em pricing e conversas                  | Dominante (27% → 41%)                                           |

> Referência cruzada: veja a skill **ai-pricing** para frameworks de pricing, pesquisa de disposição a pagar e otimização de página de preços.

---

## 7. Framework de posicionamento de April Dunford aplicado a IA

A metodologia "Obviously Awesome" é um dos processos mais testados em combate. Aqui adaptada à realidade de produtos de IA.

### Processo em 10 passos (adaptado a IA)

| Passo | Ação                                        | Consideração específica de IA                                       |
| ----- | ------------------------------------------- | ------------------------------------------------------------------- |
| 1     | Liste alternativas competitivas             | Inclua "não fazer nada" e "construir com modelos open source"       |
| 2     | Liste features únicas                       | Foque diferenças de workflow, não só de modelo                      |
| 3     | Mapeie features para temas de valor         | Traduza cada feature técnica em resultado de negócio                |
| 4     | Quem mais se importa com esse valor         | Na maioria dos casos, líderes de área, não TI                       |
| 5     | Contexto de mercado que torna o valor óbvio | Categoria para a qual o comprador já tem budget                     |
| 6     | Camadas de tendências                       | Adoção de IA na função, movimentos de concorrentes, regulação       |
| 7     | Documente posicionamento                    | Use a pilha de quatro camadas (Category, Wedge, Proof, Alternative) |
| 8     | Teste com vendas                            | Se vendas não repete naturalmente, simplifique                      |
| 9     | Teste com 5 prospects                       | Observe confusão, erro de atribuição ou "e daí?"                    |
| 10    | Data de revisão a 90 dias                   | Mercados de IA mudam rápido para ciclo anual                        |

---

## 8. Playbook de implementação

### Semanas 1–2: descoberta e extração de dados

- [ ] Exportar top 20–50 clientes por NRR, velocidade de deal ou LTV
- [ ] Enriquecimento firmográfico + tecnográfico via Clay ou Apollo
- [ ] Analisar sinais de intent que precederam os últimos 10 closed-won
- [ ] Entrevistar 5 melhores clientes: "Por que comprou? Que alternativas considerou?"
- [ ] Puxar posicionamento do concorrente no site, G2 e anúncios de funding recentes

### Semana 3: construir ICP e modelo de score

- [ ] Definir critérios firmográficos, tecnográficos e comportamentais com pesos
- [ ] Montar score de intent com terceiros, first-party e gatilhos
- [ ] Back-test com vitórias/derrotas do último trimestre
- [ ] Configurar waterfall de enriquecimento no Clay com limiares
- [ ] Documentar ICP em uma página útil para vendas

### Semana 4: posicionamento e mensagem

- [ ] Completar pilha de quatro camadas
- [ ] Escrever narrativa Tier 1 (um parágrafo, sem features)
- [ ] Escrever propostas de valor Tier 2 (3–5 bullets com prova)
- [ ] Escrever mensagem Tier 3 (detalhada, pronta para comparação)
- [ ] Rodar os cinco testes em cada mensagem
- [ ] Criar páginas de comparação para top 3 alternativas

### Semanas 5–6: validar e publicar

- [ ] Testar mensagem com 5 prospects em calls de descoberta
- [ ] Rodar Sean Ellis se PMF for desconhecido
- [ ] Atualizar site, deck e sequências de outreach
- [ ] Briefar vendas em novo posicionamento e critérios de ICP
- [ ] Lembrete no calendário para ciclo de revalidação a 90 dias

---

## Exemplos

- **Usuário diz:** "Defina nosso ICP e posicionamento" → **Resultado:** O agente reúne melhores clientes, alternativas, pricing e motion; monta pilha de quatro camadas (Category, Wedge, Proof Vector, Alternative Framing); entrega ICP com critérios firmográficos e comportamentais e sugere revalidação a 90 dias.
- **Usuário diz:** "Nossa mensagem não converte" → **Resultado:** O agente pergunta quem assina e o que trava deals; aplica teste "VP encaminharia ao CFO?"; sugere níveis de mensagem (narrativa, valor, features) e proof vectors; recomenda testes A/B.
- **Usuário diz:** "Como pontuar e priorizar leads?" → **Resultado:** O agente recomenda pesos Fit + Intent (ex.: firmográfico 35%, tecnográfico 35%, comportamental 25%); define limiar ACTIVATE (alto fit + alto intent, responder em <4 h); liga a lead-enrichment.

## Solução de problemas

- **Posicionamento parece velho** → **Causa:** Mercado de IA muda rápido; cadência de 90 dias não seguida. **Correção:** Revalidar a cada 90 dias; atualizar categoria/wedge se concorrentes ou modelos mudaram; renovar proof vectors.
- **ICP amplo demais** → **Causa:** "Todo mundo" ou muitos segmentos. **Correção:** Escolher 1–2 segmentos onde você ganha; usar sinais de enriquecimento para estreitar; documentar quem NÃO é fit.
- **Sean Ellis desconhecido** → **Causa:** PMF não medido. **Correção:** Rodar survey 40% "muito decepcionado"; se abaixo do limiar, sinalizar PMF como pré-requisito antes de escalar GTM.

---

Para checklists, benchmarks e perguntas de descoberta leia `references/quick-reference.md` quando precisar de referência detalhada.

---

## Skills relacionadas

| Skill                 | Quando cruzar referência                                                    |
| --------------------- | --------------------------------------------------------------------------- |
| ai-pricing            | Ao construir modelos de pricing, WTP ou tiers de pacote                     |
| sales-motion-design   | Ao desenhar o processo de vendas que operacionaliza o posicionamento        |
| ai-cold-outreach      | Ao traduzir posicionamento em e-mail frio/sequências LinkedIn               |
| ai-sdr                | Ao montar fluxos de SDR com IA usando score de ICP                          |
| lead-enrichment       | Ao implementar waterfalls de enriquecimento e qualidade de dados            |
| multi-platform-launch | Ao lançar em vários canais com posicionamento consistente                   |
| ai-seo                | Ao construir páginas “alternativa ao X” e conteúdo de fundo de funil        |
| gtm-engineering       | Ao automatizar score de ICP, enriquecimento e roteamento na stack           |
| solo-founder-gtm      | Quando fundador solo precisa priorizar posicionamento com pouco tempo       |
| gtm-metrics           | Ao medir impacto downstream de mudanças de posicionamento e ICP no pipeline |
