---
name: gtm-metrics
description: "Use quando o usuário quiser definir métricas de GTM, montar dashboards, medir eficiência de pipeline ou acompanhar desempenho de produtos de IA. Use também quando o usuário mencionar 'GTM metrics,' 'métricas GTM,' 'latência de receita,' 'pipeline metrics,' 'TTFV,' 'time-to-first-value,' 'data health,' 'atribuição,' 'conversion rate,' 'CAC,' 'LTV,' 'NRR,' 'GTM dashboard,' 'magic number,' 'pipeline velocity' ou 'funnel metrics.' Esta habilidade cobre medição em GTM desde a escolha de métricas até o design de dashboards, incluindo custos de IA, modelos de atribuição e cadências semanais de revisão. NÃO use para implementação técnica, revisão de código ou arquitetura de software."
metadata:
  original_author: Chad Boyda / agent-gtm-skills
  modified_by: Felipe Rodrigues - github.com/felipfr
  source: https://github.com/chadboyda/agent-gtm-skills
  version: '1.0.0'
---

# Métricas de GTM, dashboards e medição para produtos de IA

Você é especialista em medição em GTM, arquitetura de dashboards e analytics de desempenho para produtos nativos em IA. Conhece as diferenças entre métricas clássicas de SaaS e métricas de produto de IA, incluindo rastreamento de consumo por uso, custo da IA dentro da margem/contábil, e quando a cobrança é por resultado (outcome-based). Ajuda fundadores e líderes de receita a escolher métricas certas, construir dashboards úteis, desenhar atribuição e rodar cadências semanais que orientem decisões. Em 2025–2026, a mediana de crescimento B2B SaaS estabiliza em ~26%; o CAC sobe ~14%, chegando a ~$2,00 por dólar de novo ARR — por isso disciplina de medição separa crescimento eficiente de queima de caixa.

## Antes de começar

Reúna antes de propor framework, dashboard ou plano:

- Motion de vendas atual? PLG, sales-led, agent-led ou híbrido.
- Precificação? Por assento, uso, resultado ou híbrido.
- ARR ou MRR atual? Define benchmarks.
- CRM e ferramentas de dados? HubSpot, Salesforce, Attio, planilhas.
- BI/analytics disponível? Metabase, Looker, Mode, Sheets.
- Quantos reps/time GTM? Fundador solo vs ~50 mudam granularidade da métrica.
- Jornada de comprador hoje: toques, ciclo médio, canais.
- Cadência semanal já existe? O que revisão e por quem.

---

## 1. Dashboard central de métricas GTM

### Métricas de receita

| Métrica             | Definição                         | Como calcular                      | Meta                                        |
| ------------------- | --------------------------------- | ---------------------------------- | ------------------------------------------- |
| ARR / MRR           | Receita recorrente                | Soma de assinatura ativa           | Benchmarks abaixo                           |
| Net New ARR         | Novo menos churn                  | Novo ARR + Expansão − ARR churnado | Positivo todo trimestre                     |
| Revenue Latency     | Dias do primeiro sinal ao fechado | Mediana first-touch até closed-won | <30d SMB, <90d mid-market, <180d enterprise |
| Expansion Revenue % | Novo ARR de clientes atuais       | Expansão / Novo ARR total          | >40% em escala (~60% típico $50M+ ARR)      |

### Métricas de eficiência

| Métrica       | Como calcular                                      | Meta                                         |
| ------------- | -------------------------------------------------- | -------------------------------------------- |
| CAC           | Gasto S&M total / novos clientes                   | Varia por segmento                           |
| CAC Payback   | CAC / (ARR por cliente × margem bruta)             | <8 meses (mediana ~8,6; top ~5–7)            |
| Magic Number  | Novo ARR líquido (trim) / Gasto S&M (trim anteior) | >0,75 eficiente; >1,0 excelente; <0,5 alerta |
| Razão LTV:CAC | (ARPA × margem × lifetime) / CAC                   | >3:1 saudável; >5:1 pode subinvestir         |
| Burn Multiple | Net burn / net new ARR                             | <2x bom; <1x excelente; >3x preocupante      |

### Métricas de pipeline

| Métrica           | Como calcular                                            | Meta                     |
| ----------------- | -------------------------------------------------------- | ------------------------ |
| Pipeline Coverage | Valor pipeline / cota período                            | 3–4x sales-led; 2–3x PLG |
| Pipeline Velocity | (Opps qualificadas × valor × taxa ganho) / duração ciclo | Sobe QoQ                 |
| Pipeline por Rep  | Pipeline total / reps com quota                          | Trend, não só absoluto   |
| Slippage Rate     | Deals saindo do período / em forecast                    | <15% semanal             |

### Métricas de retenção

| Métrica    | Como calcular                                            | Meta                                 |
| ---------- | -------------------------------------------------------- | ------------------------------------ |
| NRR        | (MRR início + Expansão − Contração − Churn) / MRR início | ~>106% mediana; >120% topo           |
| GRR        | (MRR início − Contração − Churn) / MRR início            | >90%; >94% em escala                 |
| Logo churn | Clientes perdidos / clientes início                      | ~<2%/mês SMB; ~<1% médio mercado     |
| TTFV       | Mediana signup → primeiro evento de valor                | <15 min self-serve; <1 dia sales-led |

### Benchmarks de NRR por estágio ARR

| Faixa ARR | NRR mediano | Quartil alto | Observações                              |
| --------- | ----------- | ------------ | ---------------------------------------- |
| $1–3M     | ~90%        | ~94%         | Focar em segmentos de alta retenção      |
| $3–15M    | ~95%        | ~99%         | Expansão começa a aparecer               |
| $15–30M   | ~100%       | 105%+        | Expansão deve compensar churn            |
| $50–100M  | ~110%       | 120%+        | Expansão costuma ultrapassar novos logos |
| $100M+    | ~115%       | 130%+        | Alta expectativa de expansão             |

### Benchmarks de taxa de crescimento

| Faixa ARR | Crescimento mediano | Quartil alto |
| --------- | ------------------- | ------------ |
| <$1M      | 100%+               | 200%+        |
| $1–5M     | 80–100%             | 150%+        |
| $5–20M    | 50–80%              | 100%+        |
| $20–50M   | 30–50%              | 70%+         |
| $100M+    | 20–30%              | 40%+         |

---

## 2. Métricas de funil por motion GTM

### Funil PLG

```
Visitor --> Signup (3-5%) --> Activation (30-40%) --> Conversion (5-8%) --> Expansion (NRR 110-120%)
```

PLG específico: conversão de PQL, tempo até ativação (meta ~<15 min), amplitude de adoção das features núcleo (uso nos primeiros 14 dias), coeficiente viral (meta ~>0,3).

### Funil Sales-led

```
Signal --> Outreach (3-5% reply) --> Meeting (50%) --> Demo (60%) --> Pilot (40%) --> Close (30%)
```

Sales-led específico: tendência ACV, duração do ciclo (dias medianos), win rate por segmento, pipeline gerado por rep/mês, distribuição de quota attainment.

### Funil Agent-led (AI SDR)

```
Signal --> AI Qualification (10-15%) --> Human Meeting (50%) --> Close (35%)
```

Agent-led específico: custo por reunião marcada, custo por lead qualificado, ROI de outreach IA (receita do pipeline IA / custo IA), taxa envio-resposta e alavancagem humano-IA.

---

## 3. Métricas específicas para produtos de IA

Produtos IA têm custos que SaaS tradicional mascara. São complementares essenciais.

### Custos IA

| Métrica               | Como calcular                                           | Meta                         |
| --------------------- | ------------------------------------------------------- | ---------------------------- |
| AI Cost of Revenue    | Custo inference + compute / receita                     | <20% da receita              |
| Cost per AI Action    | Compute IA total / ações geradas                        | Queda ao longo do tempo      |
| ROAI                  | Receita atribuída à IA / (inference + overhead compute) | >10x alto desempenho         |
| Gross Margin after AI | (Receita − COGS − compute IA) / receita                 | >70% (~80% SaaS puro típico) |

### Pricing por uso

42% das empresas SaaS usam modelo por consumo em 2025 (vs 29% em 2023). Com pricing por uso, complemente métricas de ARR com:

| Métrica                            | Por que importa                           |
| ---------------------------------- | ----------------------------------------- |
| Committed vs. Consumed ARR         | Lacuna sinaliza preço torto ou subadoção  |
| Usage Growth Rate                  | Indicador antecessor de expansão          |
| Overage Frequency                  | Qualidade dos tiers                       |
| Unit Economics por unidade consumo | Receita − custo/unit; deve subir positivo |
| NRR por coorte só uso              | Separa expansão por uso vs assento        |

### SaaS clássico vs IA

| Métrica SaaS        | Diferença IA                     | Métrica extra IA                     |
| ------------------- | -------------------------------- | ------------------------------------ |
| Margem (~80%)       | Inference puxa p/ ~60–75%        | Custear IA como linha própria        |
| DAU/MAU             | Uso centrado na tarefa           | Conclusões de task, ações por sessão |
| Adoção de feature   | Poucas superfícies, profundidade | Sucesso por ação IA                  |
| Tempo no produto    | Menos pode ser mais valor        | Tempo por tarefa poupado             |
| Receita por assento | Uso dilui média usuário          | Receita/unidade consumo              |

---

## 4. Pontuação de saúde dos dados

CRM ruim desmente qualquer relatório de pipeline — quantifique antes de tomar decisão.

### Pontuação de saúde dos dados (data health score)

```
Data Health Score = (Completeness * 0.35) + (Accuracy * 0.30) + (Recency * 0.20) + (Consistency * 0.15)
```

| Componente                 | Peso | O que mede                                |
| -------------------------- | ---- | ----------------------------------------- |
| Completude (completeness)  | 35%  | % campos obrigatórios preenchidos         |
| Precisão (accuracy)        | 30%  | % pontos conferidos contra enriquecedores |
| Atualidade (recency)       | 20%  | % registros atualizados em até 90 dias    |
| Consistência (consistency) | 15%  | % com formato padronizado                 |

### Metas

| Pontuação  | Conceito | Ação                                               |
| ---------- | -------- | -------------------------------------------------- |
| 90–100%    | A        | Manter cadência de enriquecimento                  |
| 80–89%     | B        | Atualização para segmentos com pior score          |
| 70–79%     | C        | Métricas podem estar imprecisas; sprint enrichment |
| Abaixo 70% | F        | Suspender fé no pipeline até limpeza completa      |

Dados B2B decaem ~2,1%/mês. Sugestões: refresh de telefone/email cada 90 dias; firmográficos 90 dias; intent semanal tempo real; ICP sempre que dados base mudarem.

---

## 5. Modelos de atribuição

Atribuir responde ao “por que esse deal apareceu?”. Correto aponta orçamento.

### Comparativo

| Modelo      | Funciona como                      | Bom para                            | Limite                  |
| ----------- | ---------------------------------- | ----------------------------------- | ----------------------- |
| First-touch | 100% p/ primeiro touch             | Canais topo do funil                | Ignora nurturing        |
| Last-touch  | 100% último touch                  | Conversão funnel baixo              | Ignora awareness        |
| Linear      | Credito igual a todos touches      | Fairness simples                    | Blog = demo igual       |
| U-shaped    | 40/40/20 (início/meio/fim)         | Awareness→conversão clara           | Desvaloriza meio funnel |
| W-shaped    | 30/30/30/10 primeiro/lead/opp/rest | Handoff martech-vendas bem definido | Exige estágios CRM      |
| Time-decay  | Mais peso perto conversão          | Ciclos longos                       | Poupa brand top         |
| AI-driven   | ML distribui peso dinamicamente    | 500+ conversões                     | Caixa-preta, maturação  |

### Por estágio

| Estágio      | Modelo                 | Motivo                                    |
| ------------ | ---------------------- | ----------------------------------------- |
| Pré ARR <$1M | First-touch            | Aprender quais canais geram qualquer pipe |
| $1–5M        | U-shaped               | Balanceia conscientização × conversão     |
| $5–20M       | W-shaped               | Mede intermediários antes do AE           |
| $20M+        | Time-decay / IA-driven | Ciclo ≥ dados para peso temporal          |
| PLG sempre   | Product-touch          | Atributa comportamento dentro do produto  |

### Lookback

Alinhar lookback ao ciclo médio (~90 dias SMB / 180 mid / 365 enterprise). Rode first-touch × multi paralelo dois trimestres e calibre. Audite quarterly.

### Atribuir GTM quando há IA

| Desafio                | Mitigação                                            |
| ---------------------- | ---------------------------------------------------- |
| Toques IA invisíveis   | Marcar CRM com source=AI-SDR                         |
| Sequências multicanal  | Salvar canal + membership da cadência                |
| Influência × criação   | Separar atribuição de origem × influência            |
| Dark social (Slack/DM) | Campo obrigatório «como nos conheceu?» em forms demo |

---

## 6. Arquitetura de dashboards

### Três tiers

**Tier 1 — Board (~5–7 métricas, mensal)** ARR waterfall + novo ARR líquido, NRR, CAC payback, Burn multiple, Cobertura de pipeline, Magic Number, runway de caixa.

**Tier 2 — Executivo (10–12, semanal)** Pipe criado, pipe por estágio, win por segmento, tendência tam deal, ciclo médio, quota attainment por rep, NRR por coorte, CAC canal, TTFV, data health score, slippage.

**Tier 3 — Operacional (15–25 métricas, diário)** — Atividade (e-mails, ligações, reuniões agendadas), pipeline (novas oportunidades e movimento de estágio), resposta (speed-to-lead e taxa de follow-up), conversão (taxas por estágio), qualidade (fit ICP), operações IA (mensagens IA, reply rate de IA, custo por reunião).

### Escolha de ferramentas

| Ferramenta         | Melhor cenário         | Custo   |
| ------------------ | ---------------------- | ------- |
| HubSpot dashboards | Teams no HubSpot       | Incluso |
| Metabase           | SQL + self-hosted      | Free    |
| Looker             | Governança corporativa | $$$     |
| Mode               | SQL + Python + viz     | $$      |
| Google Sheets      | Fundador pré-ARR       | Free    |

### Antipadrões de dashboard

| Problema                       | Correção                             |
| ------------------------------ | ------------------------------------ |
| 50 métricas numa página        | Voltar ao count do tier certo        |
| Métricas vaidade zero contexto | Todo número com benchmark/trend/meta |
| Dados digitados manualmente    | Só dados fonte oficial via API       |
| Dono indefinido                | Owner + revisão marcada semanalmente |
| Só foto estática sem tendência | Sempre janelas 4 ou 13 semanas       |

---

## 7. Indicadores antecipatórios × defasados

Mix alvo ~60/40: 60% antecipatórios (o que vai acontecer) e 40% defasados (o que já aconteceu).

### Leading (antecipatórios)

| Indicador                 | Antecede                        | Se cai                     |
| ------------------------- | ------------------------------- | -------------------------- |
| Pipeline criado na semana | Receita 1–2 trimestres à frente | Investir topo do funil     |
| Conversão demo/reunião    | Win rate seguinte               | Revisar qualificação/demo  |
| Speed-to-lead             | Conversões inbound              | Roteamento <5 min          |
| Taxa ativação produto     | Free→pago                       | Revisão onboarding         |
| Reply rate cadência       | Reuniões mês seguinte           | Refresh mensagens          |
| Profundidade uso feature  | NRR próximo trimestre           | Customer success pró-ativo |
| Engajamento do campeão    | Probabilidade do deal           | Risco alto se sumiu        |

### Lagging / defasados

Receita, taxa de vitória (win rate), CAC/payback, NRR e GRR, LTV:CAC, burn multiple, distribuições de attainment de quota — revisar mensal ou trimestralmente.

### Cadeia

```
Revenue (lagging)
  <-- Win Rate
    <-- Demo Quality Score (leading)
    <-- ICP Fit Score of Pipeline (leading)
  <-- Pipeline Volume
    <-- Meetings Booked (leading)
      <-- Outreach Volume + Reply Rate (leading)
  <-- Deal Size
    <-- Multi-threading Depth (leading)
```

---

## 8. Cadência semanal de revisão GTM

### Reunião (30–45 min)

Rito operacional número um: todos os números saem direto das fontes, sem slides manicurados manualmente.

| Tempo     | Seção                            | Conteúdo                                                          |
| --------- | -------------------------------- | ----------------------------------------------------------------- |
| 0–5 min   | Scorecard                        | 5–7 métricas verde/amarelo/vermelho                               |
| 5–15 min  | Pipeline                         | Novo pipe, mudanças de estágio, slippage e alterações de forecast |
| 15–20 min | Indicadores na frente da receita | Volume inbound, outbound, conversões de reuniões                  |
| 20–25 min | Deals em risco                   | Negócios travados, bloqueios e pedidos de ajuda                   |
| 25–35 min | Ações                            | 2–3 ações específicas com dono/prazo                              |
| 35–45 min | Deep-dive                        | Tema estratégico semanal rodízio                                  |

### Scorecard semanal exemplo

| Métrica              | Esta semana | Semana ant. | Média 4 sem | Meta | Estado | Dono(a) |
| -------------------- | ----------- | ----------- | ----------- | ---- | ------ | ------- |
| Pipeline criado      | $X          | …           | …           | …    | V/A/V  | nome    |
| Reuniões agendadas   | X           | …           | …           | …    |        |         |
| Win rate rolante 30d | X%          | …           | …           | …    |        |         |
| Duração do ciclo     | Xd          | …           | …           | …    |        |         |
| Taxa de slip         | X%          | …           | …           | <15% |        |         |
| Speed-to-lead        | Xm          | …           | …           | <5m  |        |         |

### Deep-dives mensais

Analisar NRR e retenção (curvas de coorte, motivos de churn, pipeline de expansão); eficiência e CAC (por canal, payback trend, Magic Number); auditoria de saúde de dados CRM e lacunas do enriquecimento; concorrentes em preço, posicionamento e features.

### Revisões trimestrais

Renovar ICP (win/loss, drift scoring), benchmark das conversões por estágio do funil, revisar modelo de atribuição e ROI dos canais, avaliar motions sales-led versus PLG versus agent-led.

---

## 9. Scoring de PQL

PQL substitui MQL onde há PLG híbrido — pontuar uso real do produto.

### Equação mantida

```
PQL Score = (Usage Signals * 0.50) + (Fit Signals * 0.30) + (Intent Signals * 0.20)
```

| Pontuação    | Tier       | Próximo passo                          |
| ------------ | ---------- | -------------------------------------- |
| 80–100       | Hot        | Rotear AE <4 horas                     |
| 60–79        | Warm       | Sequência sales-assist email SDR       |
| 40–59        | Nurture    | In-app drip                            |
| Abaixo de 40 | Self-serve | Sem contato comercial focar no produto |

Típicos converts PQL cliente 5–15% contra 1–3% MQL.

---

## Exemplos

- **Usuário diz:** «Quais métricas de GTM devemos seguir?» → **Resultado:** Pergunta o motion de vendas (PLG vs sales-led), o estágio da empresa e recomenda dashboard com ~5–7 métricas centrais (ex.: CAC payback, Magic Number, cobertura de pipeline, NRR), mais TTFV e data health, e sugere cadência semanal fixa de revisão.
- **Usuário diz:** «Nossos dados de pipeline são bagunça» → **Resultado:** Avalia CRM, sistema de registros e modelo de atribuição; propõe meta de data health (>85%); identifica lacunas típicas (lead source, datas de estágio) e roadmap de saneamento para ~90 dias com equilíbrio de indicadores antecipatórios/defasados.
- **Usuário diz:** «Estamos bem vs benchmarks?» → **Resultado:** Usa a referência rápida (CAC payback, NRR, crescimento), compara aos números do usuário, aponta vermelhos e prioriza até duas iniciativas.

## Solução de problemas

- **Os números não batem entre ferramentas** → **Causa:** Definições distintas ou janelas de atribuição diferentes. **Correção:** Definir fonte oficial (ex.: CRM para pipeline faturamento para receita); alinhar lookback (SMB ~90d, médio ~180d enterprise ~365d); registrar definições num único lugar.
- **CAC payback piorando** → **Causa:** CAC subindo ou velocidade caindo. **Correção:** Cortar canal/segmentos perdedores; comparar ao Magic Number; melhorar conversão/velocity antes de subir despesa marketing/vendas ativamente.
- **NRR acima não passa dos 100%** → **Causa:** Churn ou contrações maior que expansão. **Correção:** Segmentar por coorte/segmentos; trabalhar triggers de uso/consumo; ver playbook **expansion-retention**.

---

## Referência rápida

| Conceito                                          | Referência rápida                                    |
| ------------------------------------------------- | ---------------------------------------------------- |
| Benchmark CAC payback                             | Mediana ~8,6 meses; topo ~5–7                        |
| Limiar Magic Number                               | >0,75 eficiente; >1 excelente; <0,5 alerta           |
| Cobertura de pipeline                             | ~3–4× sales-led; ~2–3× PLG                           |
| Mediana NRR (2025)                                | ~106% no B2B SaaS                                    |
| NRR best-in-class                                 | >120% (130%+ quando ARR grande)                      |
| Crescimento mediano SaaS                          | ~26% (2025)                                          |
| Trajetória típica CAC                             | Alta ~14% até ~ US$ 2 novo ARR gerado                |
| Meta TTFV                                         | <15 min self-serve; <1 dia com assistência comercial |
| Latência típica de receita                        | ~<30d SMB; mid ~<90d; enterprise ~<180d              |
| Meta data health fiável                           | >85%; embaixo ~70% vira duvidoso                     |
| Decaimento de dados B2B                           | ~2,1% ao mês em média                                |
| Mix indicadores leading/lagging                   | ~60% / ~40%                                          |
| Reunião semanal típica                            | 30–45 min, todas as semanas                          |
| Lookbacks de atribuição típicos                   | SMB 90d · mid-market 180d · enterprise 365d          |
| Conversão PQL                                     | ~5–15% (versus ~1–3% para MQL)                       |
| adoção de pricing por consumo                     | 42% (~2025) típico                                   |
| Margem bruta típica com IA                        | meta > ~70 % (pure SaaS clássico ~80 %)              |
| Parte novo ARR vindo expansão já clientes grandes | típico >40%                                          |
| Slippage semanal aceitável                        | menor que ~15                                        |
| Speed-to-lead aceitável                           | objetivo menor que ~5 min                            |

---

## Perguntas a fazer

1. Quais métricas o time revisa toda semana hoje e quem é responsável por cada uma?
2. Qual a razão atual de cobertura de pipeline e você confia nos dados que a sustentam?
3. Como vocês medem o tempo até o primeiro valor para novos clientes?
4. Qual o payback atual do CAC e ele está melhor ou pior?
5. Que percentual do novo ARR vem de expansão em relação a novos logos?
6. O quão completo está o CRM? Dá para fazer esta semana uma auditoria de qualidade dos dados?
7. Que modelo de atribuição estão usando e quando foi revisto pela última vez?
8. Há métricas distintas de funil para cada tipo de motion GTM?
9. Qual o NRR atual e como ele varia entre segmentos?
10. Como priorizam PQLs em relação aos MQLs?
11. Qual o peso atual do custo de inferência de IA na receita?
12. Acompanham indicadores antecipatórios de forma separada dos defasados?
13. Qual o speed-to-lead médio atual para demos inbound?
14. Quando foi a última vez que benchmarkaram as conversões por estágio com o mercado?
15. Existe uma cadência definida — com scorecard fixo — para a reunião semanal de GTM?

---

## Skills relacionadas

| Skill               | Quando cruzar com esta habilidade                                              |
| ------------------- | ------------------------------------------------------------------------------ |
| ai-pricing          | Medir impacto do modelo/preço sobre métricas de receita; instrumentação de uso |
| expansion-retention | Planos para NRR, análises de churn, playbooks de expansão                      |
| sales-motion-design | Redesenhar estágios, qualificação e handoffs a partir dos dados do funil       |
| ai-cold-outreach    | Desempenho de outbound: reply rate, custo por reunião, ROI de SDR com IA       |
| solo-founder-gtm    | Priorizar 3–5 métricas antes de montar dashboards completos                    |
| gtm-engineering     | Infra de coleta, automações no CRM, pipelines de dados                         |
| ai-sdr              | Medição de agentes IA e métricas de funil agent-led                            |
| lead-enrichment     | Remediação da qualidade dos dados e fluxos de enriquecimento                   |
| positioning-icp     | Quando a atribuição indica drift de mensagem ou ICP                            |
| content-to-pipeline | Atribuição de conteúdo e ligação do topo do funil ao pipeline                  |
