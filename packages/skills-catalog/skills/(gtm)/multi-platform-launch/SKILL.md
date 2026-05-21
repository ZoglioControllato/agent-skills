---
name: multi-platform-launch
description: 'Use quando o usuário quiser lançar um produto em várias plataformas, planejar um lançamento no Product Hunt, construir uma lista de espera ou executar uma estratégia de lançamento multicanal. Use também quando o usuário mencionar lançamento de produto, Product Hunt, estratégia de lançamento, lista de espera, lançamento beta, BetaList, Hacker News, dia do lançamento, AppSumo ou lançamento multicanal. Esta skill abrange a execução de lançamento multiplataforma do pré-lançamento à otimização pós-lançamento. NÃO use para implementação técnica, revisão de código ou arquitetura de software.'
metadata:
  original_author: Chad Boyda / agent-gtm-skills
  modified_by: Felipe Rodrigues - github.com/felipfr
  source: https://github.com/chadboyda/agent-gtm-skills
  version: '1.0.0'
---

# Skill Multi-Platform Launch

Você é um estrategista de lançamento de produto que estudou centenas de lançamentos bem-sucedidos no
Product Hunt, Hacker News, BetaList, AppSumo e em mais de 20 plataformas de diretório/comunidade. Você ajuda
fundadores a planejar, ordenar e executar lançamentos multicanal que maximizam o ímpeto na primeira semana
e a descoberta de longo prazo.

## Antes de começar

Reúna estes insumos antes de produzir um plano de lançamento:

1. **Tipo de produto** — SaaS, ferramenta para devs, ferramenta de IA, marketplace, app mobile, produto físico
2. **Comprador-alvo** — desenvolvedores, donos de PME, enterprise, creators, consumidores
3. **Ativos atuais** — tamanho da audiência, lista de e-mail, seguidores, comunidade
4. **Objetivo do lançamento** — cadastros, receita, imprensa, backlinks, construção de comunidade, sinal para investidores
5. **Linha do tempo** — quantas semanas até a data desejada de lançamento
6. **Orçamento** — $0 bootstrap, <$500 indie, <$5K startup, $5K+ com funding
7. **Tamanho do time** — fundador solo, time de 2–3 pessoas, time completo com marketing

Se o usuário não tiver fornecido isso, pergunte antes de montar o plano. Um plano de lançamento sem
contexto de audiência produz conselhos genéricos.

---

## Panorama de plataformas (2025–2026)

### Plataformas de descoberta

| Plataforma          | Audiência                                      | Melhor para                                                   | Esforço | Impacto na linha do tempo |
| ------------------- | ---------------------------------------------- | ------------------------------------------------------------- | ------- | ------------------------- |
| Product Hunt        | Early adopters com apego a tech, 5M+ mensais   | Pico no dia do lançamento, sinal para imprensa e investidores | Alto    | Dia 0                     |
| BetaList            | Testadores beta pré-lançamento, early adopters | Construção de lista de espera, validação pré-lançamento       | Baixo   | Semana -2 a -1            |
| What Launched Today | Navegadores tech casuais                       | Tráfego secundário no dia do lançamento                       | Baixo   | Dia 0                     |
| Launching.io        | Observadores de startups                       | Visibilidade suplementar                                      | Baixo   | Dia 0–1                   |

### Plataformas para desenvolvedores

| Plataforma            | Audiência                                 | Melhor para                                 | Esforço | Impacto na linha do tempo |
| --------------------- | ----------------------------------------- | ------------------------------------------- | ------- | ------------------------- |
| Hacker News (Show HN) | Engenheiros, fundadores técnicos          | Credibilidade técnica, estrelas no GitHub   | Alto    | Dia 0–1                   |
| Dev Hunt              | Usuários de ferramentas para devs         | Descoberta focada em devs                   | Baixo   | Semana -1 a 0             |
| GitHub Trending       | Desenvolvedores open source               | Estrelas, contribuidores, credibilidade     | Médio   | Contínuo                  |
| StackShare            | Times de engenharia avaliando ferramentas | Descoberta de ferramentas dev no enterprise | Baixo   | Semana +1                 |

### Plataformas indie/fundador

| Plataforma     | Audiência                            | Melhor para                             | Esforço | Impacto na linha do tempo |
| -------------- | ------------------------------------ | --------------------------------------- | ------- | ------------------------- |
| Indie Hackers  | Fundadores solo, makers indie        | Feedback da comunidade, receita inicial | Médio   | Semana -1 a +1            |
| Microlaunch    | Construtores de micro-SaaS           | Lançamento silencioso pré/pós-PH        | Baixo   | Semana -1 ou +1           |
| NextBigProduct | Observadores de startups             | Visibilidade suplementar                | Baixo   | Semana 0–1                |
| Foundout.io    | Descoberta de produto de cauda longa | Visibilidade persistente pós-lançamento | Baixo   | Semana +1                 |

### Diretórios de IA/tech

| Plataforma                        | Usuários mensais | Autoridade de domínio | Melhor para                          |
| --------------------------------- | ---------------- | --------------------- | ------------------------------------ |
| There's An AI For That (TAAFT)    | 2M+              | Alta                  | Descoberta de ferramentas de IA, SEO |
| Futurepedia                       | 1M+              | Alta                  | Agregação de ferramentas de IA       |
| Toolify                           | 500K+            | Média                 | Comparação de ferramentas de IA      |
| Uneed                             | Em crescimento   | Média                 | Ferramentas indie curadas            |
| AI Tool Directory (aitoolfor.org) | Em crescimento   | Média                 | Listagem ampla de ferramentas de IA  |

### Canais sociais

| Plataforma                | Estratégia                                                     | Linha do tempo  |
| ------------------------- | -------------------------------------------------------------- | --------------- |
| X (Twitter)               | Building in public, threads de lançamento, pods de engajamento | Semanas -4 a +4 |
| LinkedIn                  | Posts profissionais de lançamento, história do fundador        | Semana -1 a +2  |
| Reddit                    | Posts em subreddits relevantes (r/SaaS, r/startups, nichos)    | Dia 0 a +7      |
| Comunidades Discord/Slack | Semeadura direcionada em comunidades                           | Contínuo        |

### Canais de conteúdo

| Plataforma        | Tipo de conteúdo                                 | Valor de SEO | Linha do tempo |
| ----------------- | ------------------------------------------------ | ------------ | -------------- |
| YouTube           | Demo do produto, vídeo da história de lançamento | Médio        | Semana -1 a +1 |
| Blog/site pessoal | Post de lançamento, deep-dive técnico            | Alto         | Semana 0–1     |
| Podcasts          | Rodada de entrevistas com fundadores             | Médio        | Semana +1 a +4 |
| Newsletter        | Cross-promoções com newsletters alinhadas        | Médio        | Semana -1 a +1 |

### Plataformas pagas/review

| Plataforma | Modelo                                | Melhor para                                         | Linha do tempo |
| ---------- | ------------------------------------- | --------------------------------------------------- | -------------- |
| AppSumo    | Divisão de receita de lifetime deal   | Impulso de receita, aquisição de usuários em escala | Semana +2 a +4 |
| G2         | Listagem grátis + promoção paga       | Prova social enterprise, SEO                        | Semana +2 a +8 |
| Capterra   | Listagem grátis + posicionamento pago | Descoberta em PME, comparação                       | Semana +2 a +8 |

Nota: a G2 está adquirindo Capterra/GetApp/Software Advice da Gartner (fechamento Q1 2026).

---

## Framework de sequência de lançamento

```
Week -4 to -3: FOUNDATION
  |
  |-- Define positioning (use positioning-icp skill)
  |-- Build landing page with waitlist capture
  |-- Set up analytics and attribution tracking
  |-- Create asset library (screenshots, demo video, logo pack)
  |-- Draft Product Hunt page (do not publish)
  |-- Begin building in public content on X/LinkedIn
  |
Week -2: WAITLIST SEEDING
  |
  |-- Submit to BetaList
  |-- Submit to 10-15 free directories (batch submission day)
  |-- Start sharing waitlist link in relevant communities
  |-- Begin warm outreach to 20-50 people for launch day support
  |-- Post "building in public" updates daily on X
  |-- Cross-promote with aligned newsletter creators
  |
Week -1: LAUNCH PREP
  |
  |-- Finalize Product Hunt page (gallery, tagline, maker comment)
  |-- Prepare Hacker News Show HN post (if technical product)
  |-- Brief your launch day support crew with specific instructions
  |-- Schedule social media posts for launch day
  |-- Submit to Microlaunch, Dev Hunt, Indie Hackers
  |-- Pre-write launch thread for X (7-10 posts)
  |-- Record and edit YouTube demo video
  |
Day 0: LAUNCH DAY
  |
  |-- 12:01 AM PT: Product Hunt goes live
  |-- 8:00-10:00 AM PT: Post Show HN on Hacker News
  |-- Morning: Publish X launch thread
  |-- Morning: Post on LinkedIn
  |-- Morning: Share in Discord/Slack communities
  |-- All day: Respond to every PH comment within 30 minutes
  |-- All day: Engage with every HN comment authentically
  |-- Evening: Share progress update on X
  |
Week +1: AMPLIFICATION
  |
  |-- Publish YouTube deep-dive demo
  |-- Write launch retrospective blog post
  |-- Start podcast outreach circuit
  |-- Post on relevant Reddit communities
  |-- Submit to remaining directories
  |-- Collect and share launch metrics publicly
  |
Week +2 to +4: MONETIZATION & PROOF
  |
  |-- Launch AppSumo deal (if applicable)
  |-- Request G2/Capterra reviews from early users
  |-- Repurpose UGC from launch into social content
  |-- Begin SEO content strategy (use ai-seo skill)
  |-- Start building case studies from early adopters
```

---

## Aprofundamento: Product Hunt

### Como funciona o algoritmo em 2025–2026

A equipe do Product Hunt cura manualmente quais produtos aparecem na página inicial. Eles avaliam
produtos em quatro fatores:

1. **Útil** — resolve um problema real
2. **Distinto** — claramente diferente das soluções existentes
3. **Fácil de usar** — polido, fácil de experimentar
4. **Completo** — parece produto acabado, não landing page

O algoritmo oculta contagens de upvote nas primeiras 4 horas para distribuir exposição com mais justiça.
A velocidade inicial ainda importa, mas manipular ficou mais difícil que antes.

### Anatomia da página de lançamento no Product Hunt

| Elemento            | Requisitos                                                                    |
| ------------------- | ----------------------------------------------------------------------------- |
| Título              | 60–70 caracteres, focado no cliente, comunica valor sem contexto              |
| Tagline             | Uma frase reforçando a proposta de valor do título                            |
| Galeria             | 4–6 imagens ou GIF/vídeo; primeira imagem é o hero; mostrar produto em uso    |
| Descrição           | O que faz (1 frase), para quem (1 frase), diferencial (1 frase)               |
| Comentário do maker | História por trás do build, por que este momento importa, convite ao feedback |

### Estratégia de título: três variantes

Prepare três opções de título com ângulos distintos:

| Ângulo         | Exemplo                                                      |
| -------------- | ------------------------------------------------------------ |
| Valor primeiro | "Ship blog posts 10x faster with AI that matches your voice" |
| Prova social   | "The writing tool 500 founders use to publish daily"         |
| Curiosidade    | "What happens when you give your blog an AI co-writer"       |

Teste com 5–10 pessoas antes do lançamento. Escolha a que gerar a reação imediata mais forte.

### Papéis na execução do dia do lançamento

Para times de 2+, atribua estes papéis explicitamente:

| Papel                  | Responsabilidade                                 |
| ---------------------- | ------------------------------------------------ |
| Dono do thread         | Responde a todo comentário no PH em até 30 min   |
| Motor social           | Publica atualizações no X, LinkedIn, comunidades |
| Líder de suporte       | Cuida de cadastros, onboarding, bugs             |
| Rastreador de métricas | Monitora upvotes, posição no ranking, tráfego    |

Fundadores solo: priorize Dono do thread e Motor social. Deixe a fila de suporte para o fim do dia.

### Benchmarks de desempenho (2025)

| Métrica                        | Bom           | Ótimo    | Top 5    |
| ------------------------------ | ------------- | -------- | -------- |
| Upvotes                        | 150–300       | 300–600  | 600–900+ |
| Comentários                    | 30–60         | 60–120   | 120+     |
| Cadastros no dia do lançamento | 200–500       | 500–1500 | 1500+    |
| Pico de tráfego                | 2K–5K visitas | 5K–15K   | 15K+     |

Produtos no top 6 aparecem na primeira página sem rolar. Esse é o alvo.

### O que evitar no Product Hunt

Nunca peça upvotes publicamente (X, LinkedIn, e-mail em massa) nem use grupos de troca (IPs são
sinalizados). Evite lançamentos segunda/sexta (baixo engajamento). Não lance uma landing page sem
produto funcional. Sempre responda comentários (a responsividade afeta o ranking).

---

## Aprofundamento: Hacker News (Show HN)

### O que funciona no HN

Show HN é para coisas que as pessoas podem rodar, usar ou com as quais podem interagir. Posts de blog, páginas de cadastro
e newsletters são explicitamente fora do tópico para Show HN.

**Tipos ideais de post:**

- Demo ao vivo sem cadastro
- Ferramenta open source com repositório no GitHub
- Deep-dive técnico com benchmarks
- Abordagem nova para um problema conhecido

**Fórmula de título:**
Antecipe um benefício concreto ou intriga. Use dígitos, números de versão ou resultados específicos.
Evite superlativos, formato lista e clickbait.

Bom: "Show HN: Open-source tool that converts Figma designs to React in 30 seconds"
Ruim: "Show HN: The Best Design-to-Code Tool Ever Made"

### Momento

| Janela                  | Por quê                                      |
| ----------------------- | -------------------------------------------- |
| Ter–qui, 8:00–10:00 PT  | Engenheiros checam notícias antes do standup |
| Domingo, 18:00–21:00 PT | Baixa competição, navegação relaxada         |

Confira hn.algolia.com antes de postar para verificar se o slot não está lotado por histórias grandes.

### Mecânica do algoritmo

O HN usa pontuação com decaimento temporal. O multiplicador de gravidade aumenta a cada ~45 minutos. Um post
com 10 upvotes em 15 minutos supera um com 50 upvotes em 6 horas. Velocidade inicial
é tudo.

### Fontes iniciais de upvote (legítimas)

Use: lista de e-mail de assinantes técnicos ativos no HN, Slack/Discord privado com membros
com contas HN de 1+ ano, DM direto a fundadores amigos no HN.

Nunca use: pedidos públicos de upvote no X/LinkedIn, grupos de "upvote party", anéis de contas novas.
Shadow-ban é agressivo e permanente.

### Benchmarks de desempenho no HN

| Resultado               | Pontos | O que você ganha                             |
| ----------------------- | ------ | -------------------------------------------- |
| Primeira página (1 h)   | 10–20  | ~500 visitas, 20–50 estrelas no GitHub       |
| Primeira página (4 h)   | 30–80  | ~2K–5K visitas, 50–121 estrelas no GitHub    |
| Primeira página (12 h+) | 100+   | 5K–20K visitas, sinal forte de credibilidade |

Espere feedback brutalmente honesto. Responda à crítica com cuidado e você ganha respeito.

---

## Playbook de construção de lista de espera

Lançamentos guiados por lista de espera convertem a 25–85% vs. 2–4% em lançamentos frios, com custo de aquisição
quase zero. Otimização de lista de espera com IA soma ~30% às taxas de conversão.

### Arquitetura da lista de espera

Landing page (proposta de valor + prova social) → Captura de e-mail (nome, e-mail, tag de caso de uso) →
Obrigado + loop de indicação (compartilhar para subir na fila). Cada estágio alimenta um motor diferente:
tráfego SEO/social, segmentação para personalização no dia do lançamento e crescimento viral.

### Crescimento de lista de espera baseado em indicações

As listas de maior desempenho usam recompensas por indicação em níveis:

| Indicações | Recompensa                                      |
| ---------- | ----------------------------------------------- |
| 1          | Acesso antecipado (subir na fila)               |
| 3          | Trial grátis estendido ou feature bônus         |
| 5          | Desconto vitalício ou status de membro fundador |
| 10         | Call direto com o fundador, input no roadmap    |

Ferramentas: LaunchList (getlaunchlist.com), Waitlister, Viral Loops, ReferralHero

### Táticas de conversão da lista de espera

Use enquadramento de escassez ("Onboarding 50 users per week"), mostre posição na fila, marque usuários
por papel/caso de uso no cadastro para e-mails personalizados no lançamento, envie atualizações semanais de build para
manter a lista aquecida e deixe os maiores indicadores entrarem cedo para depoimentos pré-lançamento.

### Benchmarks de tamanho da lista de espera

| Estágio do produto   | Meta de lista de espera | Expectativa de conversão  |
| -------------------- | ----------------------- | ------------------------- |
| Validação pré-MVP    | 100–500                 | 40–60% para cadastro beta |
| MVP pronto           | 500–2000                | 30–50% para usuário ativo |
| Product-market fit   | 2000–10000              | 25–40% para pago/ativo    |
| Lançamento em escala | 10000+                  | 15–30% para pago          |

---

Para envio a diretórios, AppSumo, G2/Capterra, escala de UGC, framework de orçamento, timing, métricas de sucesso e erros comuns, leia `references/directories-timing-mistakes.md`.

## Exemplos

- **Usuário diz:** "Planeje nosso lançamento no Product Hunt" → **Resultado:** O agente pergunta linha do tempo, tamanho da audiência e estado do produto; recomenda 2 semanas antes (landing, lista de espera, rascunho do PH, 20–50 apoiadores, ativos, UTM); dia do lançamento (PH 12:01 PT, Show HN 8–10, thread no X, e-mail da lista de espera); Semana +1 (vídeo demo, post retrospectiva, diretórios, reviews).
- **Usuário diz:** "Vamos lançar em vários canais" → **Resultado:** O agente mapeia 16+ canais (PH, HN, X, LinkedIn, BetaList, diretórios, comunidade); prioriza por audiência; define ordem no dia do lançamento e cadência pós-lançamento; alerta erros comuns (sexta, sem demo, sumir depois do Dia 0).
- **Usuário diz:** "Não temos audiência para o lançamento" → **Resultado:** O agente sugere construir lista de espera primeiro, 20+ apoiadores no Dia 0 e comunidade/outreach; recomenda building in public e conteúdo pré-lançamento; conecta a content-to-pipeline e solo-founder-gtm se fizer sentido.

## Solução de problemas

- **Baixa tração no PH/HN** → **Causa:** Dia errado, tagline fraca ou sem apoiadores. **Correção:** Lançar ter–qui; afiar tagline e primeiro comentário; alinhar 20+ upvotes/comentários na primeira hora; responder a todo comentário em 30 min.
- **Pico de tráfego sem cadastros** → **Causa:** Sem CTA claro ou “experimente agora”. **Correção:** Oferecer demo instantânea ou lista de espera; um CTA principal acima da dobra; UTM em todos os links para atribuir.
- **Dia do lançamento e depois silêncio** → **Causa:** Sem plano na Semana +1. **Correção:** Postar atualizações diárias na Semana +1; demo no YouTube, post retrospectiva, lote de diretórios, reviews G2/Capterra; compilar métricas e plano de 30 dias.

---

Para checklists, benchmarks e perguntas de descoberta leia `references/quick-reference.md` quando precisar de referência detalhada.

---

## Skills relacionadas

- **positioning-icp** — Defina posicionamento e ICP antes de criar a mensagem de lançamento
- **ai-seo** — Construa estratégia SEO de cauda longa pós-lançamento usando backlinks de diretórios
- **social-selling** — Converta buzz de lançamento em pipeline e conversas de venda
- **content-to-pipeline** — Transforme conteúdo de lançamento em geração contínua de leads
- **ai-ugc-ads** — Escale conteúdo gerado por usuários do lançamento em campanhas pagas
- **solo-founder-gtm** — Playbook de lançamento adaptado para times de uma pessoa
