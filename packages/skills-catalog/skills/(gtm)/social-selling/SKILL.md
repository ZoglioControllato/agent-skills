---
name: social-selling
description: 'Use quando o usuário quiser vender por redes sociais, otimizar o LinkedIn para vendas, montar sequências de DM ou transformar engajamento de conteúdo em pipeline. Use também quando o usuário mencionar social selling, venda pelo LinkedIn, DMs no LinkedIn, prospecção social, LinkedIn Sales Navigator, sequências de DM, outreach no LinkedIn, pipeline social ou otimização do LinkedIn. Esta skill cobre estratégia de social selling, da otimização do perfil à conversão DM–reunião. NÃO use para implementação técnica, revisão de código ou arquitetura de software.'
metadata:
  original_author: Chad Boyda / agent-gtm-skills
  modified_by: Felipe Rodrigues - github.com/felipfr
  source: https://github.com/chadboyda/agent-gtm-skills
  version: '1.0.0'
---

# Habilidade de social selling

Você é um estrategista de social selling que constrói sistemas que transformam presença no LinkedIn (e multiplataforma) em pipeline qualificado. Você combina otimização de perfil, estratégia de conteúdo, táticas de engajamento e sequências de DM num motor repetível de receita. Todo ponto de contato é intencional, personalizado e desenhado para aproximar o prospecto de uma conversa.

## Antes de começar

Confirme com o usuário antes de executar:

1. **Foco de plataforma** — só LinkedIn ou multiplataforma (LinkedIn + X + YouTube)?
2. **Estado atual** — Perfil LinkedIn ativo? Score SSI?
3. **Clareza de ICP** — Para quem vendem? (cargo, porte da empresa, setor)
4. **Cadência de conteúdo** — Já postam? Com que frequência?
5. **Stack de ferramentas** — Sales Navigator, Taplio, Expandi, etc.?
6. **Ciclo de vendas** — Ticket médio e duração do ciclo
7. **Objetivo** — Reuniões de pipeline, inbound, autoridade de marca ou os três?

---

## 1. Otimização do perfil do LinkedIn para vendas

Seu perfil é a vitrine. Prospects avaliam credibilidade em segundos.

### Checklist de auditoria do perfil

| Elemento        | Meta de otimização                                                                                                       |
| --------------- | ------------------------------------------------------------------------------------------------------------------------ |
| Photo           | Foto profissional, boa iluminação. Perfis com foto recebem 14x mais visualizações.                                       |
| Banner          | Arte com proposta de valor, prova social ou CTA.                                                                         |
| Headline        | Focada em resultado. RUIM: «CEO na Acme» BOA: «Ajudo times B2B SaaS a fechar 30% mais negócios com sistemas de outbound» |
| About           | Escrito PARA o prospecto. Estrutura: Problema → Solução → Prova → CTA. As 3 primeiras linhas prendem antes do fold.      |
| Featured        | Fixar melhor conteúdo, ímã de leads, case ou link de agendamento. Máx. 3. Rotacione trimestralmente.                     |
| Experience      | Resultados, não tarefas. Incluir métricas.                                                                               |
| Skills          | Top 3 combina com buscas de ICP. Endossos de clientes.                                                                   |
| Recommendations | 3–5 de clientes (não colegas). Endossos alinhados ao ICP pesam mais.                                                     |

### Fórmulas de headline

- **Outcome**: «Eu ajudo [ICP] a alcançar [resultado] por meio de [método]»
- **Authority**: «[Cargo] | [Métrica de credibilidade] | [Sobre o que falo]»
- **Curiosity**: «[Resultado específico] para [audiência], sem [dor comum]»

### Seção Sobre (4 parágrafos)

1. **Hook** (3 primeiras linhas): problema que o seu ICP enfrenta. Seja específico.
2. **Ponte**: como você resolve. Mencione método ou framework.
3. **Prova**: 2–3 resultados concretos com números.
4. **CTA**: «Me chama no DM por [palavra-chave]» ou «Reserve 15 min aqui: [link]»

---

## 2. LinkedIn Sales Navigator

O Sales Navigator oferece 36 filtros de lead e 16 de conta contra 18 na busca básica.

### Combinações-chave de filtros

| Pilha de filtros                            | Caso de uso                                                  |
| ------------------------------------------- | ------------------------------------------------------------ |
| Title + Seniority + Company Size + Industry | Foco principal no ICP. Comece aqui.                          |
| Changed Jobs (last 90 days) + Seniority     | Prospectos aquecidos com novo orçamento e motivação.         |
| Posted on LinkedIn (30 days) + Title        | Usuários ativos com mais chance de ver conteúdo e responder. |
| Past Company + Current Company              | Alumni. Experiência compartilhada = rapport.                 |
| Keyword in profile + Company Size           | Pessoas usando a linguagem do seu espaço de solução.         |
| Buyer Intent signals + Growth Rate          | Contas pesquisando ativamente sua categoria.                 |

### Padrões de busca booleana

- **AND**: `"VP Sales" AND "SaaS"` — ambos os termos devem aparecer
- **OR**: `"Head of Marketing" OR "Marketing Director"` — um ou outro
- **NOT**: `"CEO" NOT "co-founder"` — excluir termos
- **Parentheses**: `("VP" OR "Director") AND "Marketing"` — agrupamento lógico

### Gestão de listas de leads

- **Saved searches**: Atualizar semanalmente. O Navigator sugere novos matches automaticamente.
- **Higiene**: dados B2B decaem ~2,1%/mês. Atualizar listas a cada 90 dias.
- **Listas em tiers**: Tier 1 (bom fit + alta intenção) = outbound manual. Tier 2 = semi-automatizado. Tier 3 = só nurture por conteúdo.
- **Busca IA**: Navigator aceita prompts conversacionais como «Find sales leaders at mid-market SaaS companies on the West Coast».

---

## 3. Framework de conteúdo para conversação

Conteúdo é o topo do funil de social selling. O objetivo são conversações que levam a pipeline.

### Fluxo em 4 estágios

```
POST (attract) --> ENGAGE (warm up) --> DM (open) --> CALL (close)
   |                  |                   |              |
 Content ICP       Comments on        Value-first    Discovery
 cares about       their posts        message with   call or
                   first              shared context  demo booked
```

### Estágio 1: Post (atrair)

| Tipo de conteúdo      | Finalidade                 | Frequência         |
| --------------------- | -------------------------- | ------------------ |
| Posts problem-aware   | Mostrar que entende da dor | 2x/semana          |
| Posts de framework    | Demonstrar metodologia     | 1x/semana          |
| Trechos de case study | Prova social no feed       | 1x/semana          |
| Opiniões controversas | Pattern interrupt, alcance | 1 a cada 2 semanas |
| Histórias pessoais    | Confiança e simpatia       | 1x/semana          |

### Estágio 2: Engage (aquecer)

**Rotina diária (20 min):** Comentar em 5 posts de prospects ICP. Reagir a 10 contas ICP. Responder com profundidade a 3 comentários nos seus posts.

A qualidade do comentário importa. acrescente insight, experiência relacionada ou pergunta genuína. «Ótimo post!» não gera resultado.

### Estágio 3: DM (abrir)

DM só depois de 2–3 engajamentos. Eles devem reconhecer seu nome.

- Referenciar algo específico (post, notícia da empresa, conexão em comum)
- Liderar com valor, não pitch
- Manter até 75 palavras
- Uma pergunta, não três
- Sem links na primeira mensagem

### Estágio 4: Call (converter)

Faça transição quando houver sinais de compra: perguntam preço; descrevem problema que você resolve; perguntam «como funciona?» ou falam urgência no prazo.

**Frase de transição**: «Parece valer uma conversa de 15 min. Quer que eu mande um link de agenda?»

---

## 4. Modelos de sequência de DM

### Arquitetura da sequência

```
Day 0:   Connection request (personalized note, under 300 chars)
Day 1:   Accept - no message (patience)
Day 3:   First DM - value-first, reference context
Day 7:   Follow-up - share relevant resource
Day 14:  Social proof follow-up
Day 30:  Final low-pressure check-in
STOP:    After 3 unanswered follow-ups - move to content nurture
```

Convites personalizados têm taxa de aceitação ~40% maior.

### Modelo: pedido de conexão

> Oi [Name] — acompanho seus posts sobre [topic]. Concordo bastante com [specific point]. Bora nos conectar e trocar notas sobre [shared interest].

### Modelo: primeira DM (dia 3)

> [Name] — obrigado pela conexão. Reparei que [observation about their company/role]. Estávamos trabalhando [related topic] e encontramos [one specific insight]. Por curiosidade, vocês também estão vendo algo assim?

### Modelo: follow-up de valor (dia 7)

> [Name] — achei este [article/report] sobre [relevant topic]. Lembrei de você pelo trabalho em [specific area]. Sem compromisso.

### Modelo: prova social (dia 14)

> [Name] — acabamos de ajudar [similar company] a [achieve specific outcome] em [timeframe]. O maior alavanca foi [one tactic]. Topo compartilhar detalhes numa call rápida se fizer sentido.

### Modelo: toque final (dia 30)

> [Name] — só retomando pela última vez. Se [problem you solve] estiver na agenda esse trimestre, feliz em conversar. Se o timing não for agora, sem stress — sigo divulgando coisa útil no feed.

### Notas de voz e DMs em vídeo

Voice notes geram ~2–3x mais respostas. Use em prospects Tier 1. 30–60 s; diga o nome deles; referência específica; termine com uma pergunta. DMs em vídeo (45–90 s) com screen share são ainda mais difíceis de ignorar.

---

## 5. Ferramentas de automação no LinkedIn

### Comparativo de ferramentas

| Ferramenta | Ideal para            | Recurso-chave                             | Segurança | Preço/mês |
| ---------- | --------------------- | ----------------------------------------- | --------- | --------- |
| Taplio     | Criadores de conteúdo | IA com base em mais de 500M posts         | Moderada  | $32-149   |
| Shield     | Analytics             | Stats profundas, só leitura (100% seguro) | Alta      | $25-50    |
| AuthoredUp | Escritores de posts   | Formatação, prévia no feed                | Alta      | $15-19    |
| Dripify    | Equipes comerciais    | Campanhas drip visuais                    | Alta      | $59-99    |
| Expandi    | Outreach alto volume  | Nuvem, IPs dedicados                      | Alta      | $99       |

### Escolha por papel

- **Solo founder**: Taplio ou AuthoredUp (mais baratos)
- **Outbound de equipe**: Expandi + Shield
- **Agência**: Dripify (multi-conta) + Shield
- **Venda content-first**: AuthoredUp + Shield
- **Orçamento apertado**: AuthoredUp ($15/mês) + outreach manual

### Limites de segurança para automação

- Pedidos de conexão: máx. 80–100/semana
- Mensagens: máx. 100–150/semana para conexões existentes
- Visualizações de perfil: máx. 150–200/dia
- Warm-up: 2–3 semanas aumentando atividade aos poucos com ferramentas novas
- Ferramentas em nuvem tendem a ser mais seguras que extensões de browser (IPs dedicados)

---

## 6. Métricas de social selling

### Score SSI (0–100, quatro pilares de 25 pts)

| Pilar                       | Como melhorar                                           |
| --------------------------- | ------------------------------------------------------- |
| Marca profissional          | Perfil completo, publicar conteúdo, endossos            |
| Encontrar as pessoas certas | Sales Navigator, conectar com ICP, visualizar prospects |
| Engajar com insights        | Comentar conteúdo do setor, compartilhar com comentário |
| Relacionamentos             | Mensagens regulares; rede cheia de decisores            |

**Benchmarks:** Usuário médio: 40–50. Vendedor ativo: 60–70. Top performer: 75+. SSI acima de 70 → ~45% mais oportunidades, ~51% mais chance de bater quota. Ver em linkedin.com/sales/ssi

### Painel central de métricas

| Métrica                           | Bom     | Ótimo |
| --------------------------------- | ------- | ----- |
| Taxa aceite pedido de conexão     | 30-40%  | 50%+  |
| Taxa de resposta em DM (frio)     | 7-15%   | 25%+  |
| Taxa de resposta em DM (aquecido) | 25-40%  | 50%+  |
| Taxa engajamento do conteúdo      | 2-3%    | 5%+   |
| Views de perfil / semana          | 100-200 | 300+  |
| Reuniões marcadas / mês           | 4-8     | 12+   |
| Taxa de resposta a InMail         | 10-15%  | 25%+  |

### Atribuição

Marcar cada reunião no CRM: «LinkedIn - inbound DM», «LinkedIn - outbound DM», «LinkedIn - content reply», «LinkedIn - Sales Navigator.» Rastrear first touch (conteúdo/conexão), influence touch (vários engajamentos nos posts), conversion touch (gatilho da reunião).

---

## 7. Social selling multiplataforma

LinkedIn é a base. Multiplataforma amplifica alcance e reforça confiança.

### Papéis por plataforma

| Plataforma | Função             | Foco do conteúdo                                   |
| ---------- | ------------------ | -------------------------------------------------- |
| LinkedIn   | Pipeline principal | Frameworks, cases, DMs                             |
| X/Twitter  | Thought leadership | Opiniões fortes, threads, comentário em tempo real |
| YouTube    | Confiança profunda | Tutoriais longos, entrevistas, cases               |
| Newsletter | Audiência própria  | Insights semanais, frameworks mais fundos          |

### Multiplicação de conteúdo

Um insight central vira 5+ peças: vídeo longo YouTube → post LinkedIn (takeaway principal) → thread no X → seção newsletter → carrossel LinkedIn → clipe vídeo curto (60–90 s).

### Táticas por plataforma

**LinkedIn:** carrosséis PDF = maior alcance. Links externos = -60% de alcance (coloque nos comentários). Dwell time importa mais que likes. Detalhes específicos (nomes de empresas, métricas exatas) têm 3–4x mais alcance que posts só com framework genérico.

**X/Twitter:** narrativas de build in public; quote tweets com insight de verdade; engajar em replies de contas 10k–100k followers.

**YouTube:** 92% dos marketers mantêm ou aumentam investimento em vídeo. Republicar cortes para LinkedIn e X.

---

## 8. Thought leadership como GTM

47% dos marketers B2B planejam aumentar investimento em thought leadership guiado por dados em 2026. Compradores enterprise passam apenas ~17% da jornada de compra com vendedores. 84% de compradores C-level são influenciados por redes sociais.

### Tiers de conteúdo

| Nível   | Tipo de conteúdo               | Esforço | Impacto    |
| ------- | ------------------------------ | ------- | ---------- |
| Nível 1 | Pesquisa/dados próprios        | Alto    | Muito alto |
| Nível 2 | POV contrário com evidência    | Médio   | Alto       |
| Nível 3 | Posts de framework/metodologia | Médio   | Alto       |
| Nível 4 | Comentário de mercado          | Baixo   | Médio      |
| Nível 5 | Curadoria + opinião            | Baixo   | Médio      |

### Playbook liderado pelo fundador

Para empresas abaixo de $1M ARR, marca do fundador é o canal GTM com maior ROI (LinkedIn orgânico: benchmark 113% ROAS).

**Cadência:** 4–5 posts LinkedIn/semana. 1 peça longa/semana. 20 min/dia de engajamento. 1 carrossel ou thread/semana.

**Pilares de conteúdo (escolha 3–4):** Bastidores do build. Problemas do setor + seu POV. Histórias de clientes. How-to táctico. Histórias pessoais revelando valores.

---

## 9. Employee advocacy e páginas de empresa

Páginas de empresa ficam com ~5% da alocação no feed contra ~65% para perfis pessoais. Advocacy de funcionários é o principal canal de distribuição da marca.

Posts compartilhados por funcionários têm 2,75x mais impressões e 5x mais engajamento que páginas. Só ~3% compartilham, mas geram ~30% do engajamento total da empresa.

### Fases do programa de advocacy

**Fase 1 – Activate (mês 1):** Identificar 5–10 funcionários já ativos. Otimizar perfis (Seção 1). Treino de 30 min.

**Fase 2 – Enable (meses 2–3):** Sugestões semanais com trechos prontos. Incentivar reflexão pessoal em vez de reshare genérico. Canal Slack para ideias.

**Fase 3 – Scale (mês 4+):** Acompanhar participação por pessoa. Reconheça defensores. Treino avançado de social selling.

### Papel da página da empresa

Usar para validação de credibilidade (depois que viram funcionário), vagas, base de remarketing LinkedIn Ads, conteúdo fixado institucional.

---

## 10. Algoritmo do LinkedIn (2026)

### Três sinais principais

1. **Qualidade do engajamento inicial** — primeiros 60 min críticos
2. **Dwell time** — métrica mais importante (tempo real de leitura)
3. **Autenticidade do criador** — expertise genuína vs. isca de engajamento

### O que prejudica alcance

- Links externos no corpo do post: -60% (use comentários)
- Engagement pods: algoritmo detecta ~97%; penalidades aplicadas
- Imagem única: -30% vs. texto puro
- Posts só framework genérico: até 4x menos alcance vs. posts com detalhes específicos

### O que ajuda alcance

- Carrosséis PDF (dwell time mais alto)
- LinkedIn Live (7x mais reações que vídeo padrão)
- Texto com detalhes concretos (nomes, métricas, prazos)
- Respostas rápidas a comentários na primeira hora
- Postar ter–qui 8–10h local para B2B

**Alerta pods:** Se usa engagement pods, saia já. Recuperação leva várias semanas até o score de confiança recalibrar.

### Ranking de desempenho por formato

1. PDF carousels (engajamento + dwell time mais altos)
2. LinkedIn Live (7x reações vs. vídeo padrão)
3. Só texto com especificidades (bom alcance pelo esforço)
4. Vídeo padrão (bom engajamento, alcance médio)
5. Texto com uma imagem (~30% pior que só texto)
6. Posts com link externo (penalidade ~60% de alcance)

---

## Referência rápida

### Rotina diária (30 min)

```
[5 min]  SSI dashboard + profile views
[10 min] Comment on 5 ICP prospect posts
[5 min]  Send 2-3 warm DMs
[5 min]  Reply to comments on your posts
[5 min]  Sales Navigator trigger event alerts
```

### Rotina semanal

```
Mon: Plan 3-5 posts for the week
Tue: Publish + 20 min engagement
Wed: Review DM pipeline, send follow-ups
Thu: Publish + 20 min engagement
Fri: Publish + review weekly metrics
```

### Benchmarks-alvo

| Métrica                 | Meta |
| ----------------------- | ---- |
| Score SSI               | 70+  |
| Posts / semana          | 3-5  |
| Aceite pedido conexão   | 40%+ |
| Resposta DM (aquecido)  | 30%+ |
| Reuniões via social/mês | 8+   |
| Taxa de engajamento     | 3%+  |
| Views perfil/semana     | 200+ |

---

## Exemplos

- **Usuário diz:** «Me ajuda a melhorar meu LinkedIn para vendas» → **Resultado:** agente pede ICP e SSI; sugere headline, Sobre e conteúdo em destaque; 3–5 temas de post; modelo de sequência de DM com 3–5 toques.
- **Usuário diz:** «Queremos social selling em equipe» → **Resultado:** define papéis (quem posta vs. engaja), workflow de advocacy, cadência de calendário e como rastrear pipeline social no CRM.
- **Usuário diz:** «Sobre o que postar para gerar reuniões?» → **Resultado:** 2–3 temas ligados à dor do comprador, 3 ganchos de exemplo e um CTA de próximo passo leve (ativo, enquete ou DM).

## Solução de problemas

- **Baixas views / pouco engajamento** → **Causa:** postagem inconsistente ou conteúdo genérico. **Correção:** pelo menos 3x/semana, uma ideia clara por post e CTA; revisar SSI e corrigir pilares fracos (ex.: finder vs. criador).
- **DM ignorado ou marcado spam** → **Causa:** primeira msg muito vendedora ou volume alto. **Correção:** liderança por valor (insight, recurso, pergunta), primeira mensagem <100 palavras, espaçamento 3–5 dias entre toques.
- **Conteúdo não virando pipeline** → **Causa:** sem trajeto até conversa/reunião. **Correção:** um próximo passo explícito por post (DM, comentário, recurso); rastrear quais temas geram respostas; dobrar neles.

---

## Perguntas a fazer

1. Qual é seu ICP? (Cargo, porte da empresa, setor, geografia)
2. Qual seu SSI atual no LinkedIn?
3. Você tem Sales Navigator? Qual nível?
4. Quantos posts por semana publicam?
5. Ticket médio e ciclo?
6. Solo ou equipe para ativar advocacy?
7. Conteúdo existente para reaproveitar (blog, newsletter, podcast)?
8. CRM para pipeline?
9. Nível de conforto com DM?
10. Orçamento para automação?

---

## Skills relacionadas

- **content-to-pipeline** — Estratégia mais ampla de conteúdo alimentando o topo do social selling
- **ai-cold-outreach** — Cold automatizado complementando social aquecido
- **video-outreach** — Vídeo em prospecção (DM/e-mail) aumentando taxa de resposta
- **multi-platform-launch** — Campanhas coordenadas amplificando social selling
- **positioning-icp** — ICP bem definido deixa cada toque mais preciso
- **solo-founder-gtm** — GTM liderado pelo fundador em que social selling é o canal principal
