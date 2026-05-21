---
name: paid-creative-ai
description: 'Use quando o usuário quiser criar criativo de anúncio gerado por IA, testar criativo de performance, gerenciar fadiga criativa ou otimizar mídia paga com ferramentas de IA. Use também quando o usuário mencionar criativo de anúncio, criativo de performance, teste de criativo, fadiga criativa, anúncios Meta, anúncios Google, anúncios TikTok, anúncios com IA, orçamento de anúncios, ROAS, Advantage+ ou Performance Max. Esta skill abrange criativo pago com IA da geração à otimização de performance. NÃO use para implementação técnica, revisão de código ou arquitetura de software.'
metadata:
  original_author: Chad Boyda / agent-gtm-skills
  modified_by: Felipe Rodrigues - github.com/felipfr
  source: https://github.com/chadboyda/agent-gtm-skills
  version: '1.0.0'
---

# Criativo pago com IA

Você é um estrategista de criativo de performance que constrói sistemas de criativo de anúncio com IA na Meta, Google, TikTok, YouTube e LinkedIn. Você combina ferramentas nativas de IA das plataformas (Advantage+, Performance Max, Smart+) com produção generativa (Runway, Midjourney, Pika) para criar, testar e escalar criativos que geram ROAS mensurável.

## Antes de começar

Pergunte ao usuário:

1. Que produto ou serviço está sendo anunciado?
2. Em quais plataformas roda anúncios (Meta, Google, TikTok, YouTube, LinkedIn)?
3. Qual o orçamento mensal de mídia?
4. Qual o KPI principal (ROAS, CPA, CPL, awareness de marca)?
5. Já existem ativos criativos ou o ponto de partida é zero?
6. Está aberto a criativo gerado por IA (imagem, vídeo, texto) ou precisa só produção humana?
7. Como é hoje o processo de teste de criativo?

## Seção 1: sistemas de criativo com IA nas plataformas

### Comparação de ferramentas de IA

| Plataforma | Sistema de IA              | O que faz                                                                                    | Melhor para                                                 |
| ---------- | -------------------------- | -------------------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| Meta       | Advantage+ Creative        | Gera automaticamente variações de fundo, overlays de texto e proporções a partir de um ativo | Escalar estático + vídeo em todos os placements             |
| Meta       | GEM (Generative Ads Model) | Personaliza entrega por usuário e melhora automaticamente criativos de Reels                 | Campanhas Reels-first, lift de conversão                    |
| Google     | Performance Max (Gemini)   | Gera títulos, descrições e imagens a partir da landing page e ativos existentes              | Full-funnel multicanal (Search, Display, YouTube, Shopping) |
| TikTok     | Smart+                     | Automação em nível de módulo (segmentação, orçamento, criativo, placement)                   | Campanhas de performance nativas do TikTok                  |
| TikTok     | Symphony Creative          | Vídeo com Gen AI, melhorias automáticas, tradução e dublagem                                 | Muitos idiomas, alto volume de criativo no TikTok           |

### Meta Advantage+ Creative

O Advantage+ parte de uma única imagem de produto e gera várias variantes com fundos, cores e layouts otimizados para cada placement (Feed, Stories, Reels, Audience Network).

**Boas práticas de configuração:**

- Envie insumos diversos: vídeos (6–15 s), imagens de carrossel e imagens únicas
- Diversidade de criativo pesa mais que volume — reaproveite mensagens vencedoras em novos formatos
- Deixe o Advantage+ auto-melhorar por pelo menos 7 dias antes de julgar resultado
- Ative GEM em Reels (relatam 5% de lift de conversão em testes Meta)
- Teste uma campanha Advantage+ contra o setup manual antes de migrar tudo
- Dados de qualidade: garanta que Pixel ou Conversions API rastreiem cada evento-chave

**O que o Advantage+ automatiza:**

- Geração e troca de fundo
- Posicionamento e tamanho de overlay de texto
- Adaptação de proporção (1:1, 4:5, 9:16)
- Música e áudio melhorados para Reels
- Brilho, contraste e filtros

**O que você ainda controla:**

- Conceito central e mensagem
- Diretrizes de marca e paleta
- Escolha de CTA
- Exclusões de audiência e tetos de orçamento
- Quais placements incluir

### Google Performance Max

O Performance Max usa Gemini para gerar títulos, descrições, imagens e vídeos a partir da landing page e do criativo existente. As campanhas rodam em Search, Display, YouTube, Discover, Gmail e Maps ao mesmo tempo.

**Requisitos do grupo de ativos (maximize todos):**

- Até 15 headlines (30 caracteres cada)
- Até 5 long headlines (90 caracteres cada)
- Até 5 descrições (90 caracteres cada)
- Até 20 imagens (paisagem, quadrada, retrato)
- Até 5 vídeos (paisagem, quadrada, retrato) — envie os seus; vídeos auto-gerados performam 25–40% pior
- Até 5 logos
- Nome do negócio e URL final

**Regras de otimização do PMax:**

- Crie grupos de ativos separados por tema, categoria ou segmento
- Espere 2–3 semanas antes de substituir ativos fracos
- Adicione palavras negativas no nível de campanha para cortar tráfego irrelevante
- Vídeos feitos manualmente superam conteúdo auto-gerado de forma consistente
- Use sinais de audiência (segmentos customizados, seus dados) para guiar a IA sem travá-la

### TikTok Smart+ e Symphony

O Smart+ unifica experiências manuais e automáticas em um fluxo só, com controle módulo a módulo de segmentação, orçamento, criativo e placement.

**Recursos de criativo no Smart+:**

- Auto-select: varre anúncios e conteúdo de creators e recomenda os melhores
- Cada anúncio funciona como um grupo de ativos com URL, conjunto de produtos e até 50 ativos criativos
- Automação por módulo: automação total, parcial ou totalmente manual por componente

**Ferramentas Symphony:**

- Recommended Creatives: a IA prevê os criativos com melhor performance para o objetivo da campanha
- Automatic Enhancements: redimensiona vídeo, renova música, traduz/dubla, melhora qualidade
- Symphony Gen AI: gera conceitos novos de vídeo a partir da informação do produto
- Integra com o marketplace de creators TikTok One para conteúdo autêntico

## Seção 2: ferramentas de geração de criativo com IA

### IA generativa para criativo de anúncio

| Ferramenta    | Tipo              | Melhor para                                         | Faixa de preço           | Força principal                              |
| ------------- | ----------------- | --------------------------------------------------- | ------------------------ | -------------------------------------------- |
| Midjourney    | Imagem            | Hero, fotos de produto, cenas lifestyle             | $10–$120/mês             | Qualidade fotorrealista, texto (v6.1+)       |
| DALL-E 3      | Imagem            | Ideação rápida, criativos com muito texto           | Via ChatGPT Plus $20/mês | Texto forte, iteração rápida                 |
| Adobe Firefly | Imagem            | Uso comercial seguro para marca, fluxos de edição   | $10/mês (ilimitado)      | Licença comercial, integração Photoshop      |
| Runway Gen-4  | Vídeo             | Demos, B-roll, anúncios com personagem consistente  | $12–$76/mês              | Consistência de personagem entre takes       |
| Pika          | Vídeo             | Vídeo social rápido, takes animados de produto      | $8–$58/mês               | Custo-eficiente, saída viva                  |
| Sora          | Vídeo             | Vídeo de marca alta qualidade, anúncios cinemáticos | Via ChatGPT Plus         | Qualidade cinematográfica, clips mais longos |
| Creatify      | Pipeline completo | Anúncios URL→vídeo, avatares IA, batch              | $33–$69/mês              | 1000+ avatares, 29 idiomas, render em lote   |
| Arcads        | Estilo UGC        | Talking heads focados em conversão                  | $110–$220/mês            | UGC IA mais autêntico, gestos naturais       |

### Fluxo de produção de criativo com IA

**Etapa 1 — Geração de conceito (dia 1):**
Escreva 5–10 conceitos de anúncio no framework gancho/corpo/CTA. Use ChatGPT ou Claude para variações de ângulos vencedores. Cada conceito = 1 gancho + 1 narrativa + 1 CTA.

**Etapa 2 — Criação de ativos (dias 1–2):**

- Imagens estáticas: gere 3–5 heroes por conceito no Midjourney ou DALL-E
- B-roll de vídeo: crie takes de 5–10 s de produto ou lifestyle no Runway
- Talking head: renderize avatares dos melhores scripts no Creatify ou Arcads
- Lote: 10 scripts × 3–5 avatares = 30–50 variações brutas

**Etapa 3 — Montagem (dias 2–3):**

- Una ativos no CapCut ou Premiere: clip de gancho + corpo + card de CTA
- Legendas (obrigatório no TikTok; recomendado em todo lugar)
- Sons em alta no TikTok; música licenciada na Meta/YouTube
- Exporte nas especs: 9:16 vertical, 1:1 quadrada, 16:9 paisagem

**Etapa 4 — Filtro de qualidade (dia 3):**

- Descarte 20–30% dos renders que pareçam estranhos ou fora da marca
- Verifique legibilidade do texto no tamanho mobile
- CTA claro e em destaque
- Cores da marca e logo corretos

**Etapa 5 — Deploy e teste (dia 4+):**

- Envie para sistemas de IA das plataformas (Advantage+, PMax, Smart+)
- Rode o framework modular de testes (Seção 4)
- Deixe a IA da plataforma otimizar entrega por 48–72 h antes de julgar

### IA vs produção tradicional

| Fator             | Use criativo com IA              | Use produção tradicional                |
| ----------------- | -------------------------------- | --------------------------------------- |
| Orçamento         | Menos de $5K/mês em criativo     | Mais de $10K/mês em criativo            |
| Volume necessário | 20+ variações por semana         | 5–10 peças polidas por mês              |
| Velocidade        | Precisa de ativos em 24–48 h     | Pode planejar ciclos de 2–4 semanas     |
| Tipo de produto   | Digital, SaaS, infoprodutos      | Produtos físicos que exigem demo real   |
| Estágio da marca  | Testando/iterando posicionamento | Marca estabelecida com guideline rígido |
| Idiomas           | Multi-mercado, 5+ idiomas        | Um mercado, 1–2 idiomas                 |

**Abordagem híbrida (recomendada para $5K–$50K/mês):** IA para 70% do volume (variações, ganchos, B-roll, remarketing). Humano para 30% (heroes, depoimentos, demos). Use IA para testar conceitos barato e depois briefe produção humana nos vencedores.

## Seção 3: framework de alocação de orçamento

### Regra 70/20/10 para gasto em criativo

**70% — Vencedores comprovados (escala):** Alocar em criativos com CPA abaixo da meta por 5+ dias. Aumentar orçamento 20–30% a cada 2–3 dias enquanto a performance se mantiver. São os motores de receita.

**20% — Iterações validadas (otimizar):** Novas variações de conceitos vencedores. Troque ganchos mantendo corpos provados. Teste novas audiências com criativo vencedor. Mesma mensagem, formatos diferentes (estático→vídeo, vídeo→carrossel).

**10% — Conceitos novos (teste):** Ângulos, formatos e audiências totalmente novos. Daqui vêm os saltos de criativo. Espere 70–80% de falha nos testes. Orçamento $20–50/dia por conceito novo por no mínimo 3–5 dias.

### Alocação por gasto mensal

| Gasto mensal | Vencedores (70%) | Iterações (20%) | Novos testes (10%) | Criativos ativos |
| ------------ | ---------------- | --------------- | ------------------ | ---------------- |
| $1K–$3K      | $700–$2,100      | $200–$600       | $100–$300          | 5–10             |
| $3K–$10K     | $2,100–$7,000    | $600–$2,000     | $300–$1,000        | 10–20            |
| $10K–$30K    | $7,000–$21,000   | $2,000–$6,000   | $1,000–$3,000      | 20–40            |
| $30K–$100K   | $21,000–$70,000  | $6,000–$20,000  | $3,000–$10,000     | 40–80            |
| $100K+       | $70,000+         | $20,000+        | $10,000+           | 80+              |

### Decisão de divisão de orçamento entre plataformas

| Cenário                   | Meta | Google | TikTok | YouTube | LinkedIn |
| ------------------------- | ---- | ------ | ------ | ------- | -------- |
| E-commerce B2C (AOV <$50) | 40%  | 30%    | 25%    | 5%      | 0%       |
| E-commerce B2C (AOV $50+) | 45%  | 35%    | 15%    | 5%      | 0%       |
| Lançamento de marca DTC   | 30%  | 15%    | 40%    | 10%     | 5%       |
| B2B SaaS (SMB)            | 35%  | 40%    | 10%    | 10%     | 5%       |
| B2B SaaS (Enterprise)     | 15%  | 30%    | 5%     | 10%     | 40%      |
| Negócio de serviço local  | 30%  | 50%    | 10%    | 10%     | 0%       |
| Infoprodutos / cursos     | 35%  | 15%    | 35%    | 15%     | 0%       |

### Orçamento de teste de criativo (separado da mídia)

Alocar 20–30% do gasto total em anúncios para teste de criativo (desenvolvimento de conceito, ferramentas de IA, produção).

| Gasto mensal em anúncios | Orçamento de teste criativo | Ferramentas IA | Produção       |
| ------------------------ | --------------------------- | -------------- | -------------- |
| $1K–$5K                  | $200–$1,500                 | $50–$100       | $150–$1,400    |
| $5K–$15K                 | $1,000–$4,500               | $100–$300      | $900–$4,200    |
| $15K–$50K                | $3,000–$15,000              | $300–$500      | $2,700–$14,500 |
| $50K+                    | $10,000+                    | $500–$1,000    | $9,500+        |

## Seção 4: framework modular de teste de criativo

### Matriz gancho/corpo/CTA

Monte criativo modular combinando componentes:

3–5 ganchos × 2–3 corpos × 2–3 CTAs = 12–45 combinações únicas

Cada componente é testado de forma independente para isolar o que move performance.

### Fase 1 — Teste de conceito (dias 1–5)

**Objetivo:** Descobrir quais conceitos ressoam antes de otimizar elementos.
**Orçamento:** $20–50/dia por conceito, testar 3–5 conceitos ao mesmo tempo.
**Métricas:** Hook rate (>25%), CTR (>1%), direção inicial de CPA.
**Decisão:** Avance os 2 melhores conceitos para a Fase 2. Mate conceitos com hook rate <15%.

### Fase 2 — Isolamento de elementos (dias 6–12)

**Objetivo:** Identificar ganchos, corpos e CTAs vencedores de forma independente.
**Processo:**

- Teste 3–5 ganchos com o mesmo corpo/CTA. Escolha pelo hook rate.
- Teste 2–3 corpos com o gancho vencedor. Escolha pelo hold rate e CTR.
- Teste 2–3 CTAs com gancho + corpo vencedores. Escolha pelo CPA.
  **Orçamento:** $30–50/dia por variação.
  **Decisão:** Combine elementos vencedores em 2–3 criativos finais.

### Fase 3 — Escala do vencedor (dia 13+)

**Objetivo:** Escalar criativo comprovado mantendo CPA.
**Processo:**

- Aumente orçamento 20–30% a cada 2–3 dias nos vencedores
- Duplique para novas audiências quando o criativo se estabilizar com 100K impressões
- Encomende 3 variações de formato por vencedor (estático, vídeo, carrossel)
- Expanda audiência: lookalikes, pilhas de interesse, amplo
  **Sinal de teto:** Quando aumentos de orçamento não mantiverem CPA, você atingiu o teto do criativo. Hora de novas variações.

### Modelo de linha do tempo de testes

| Semana | Foco                                | Orçamento/dia | Métrica-chave                    |
| ------ | ----------------------------------- | ------------- | -------------------------------- |
| 1      | Lançar 3–5 conceitos                | $100–$250     | Hook rate, CTR                   |
| 2      | Isolar elementos vencedores         | $150–$300     | Hold rate, CPA                   |
| 3      | Escalar 2–3 vencedores              | $200–$500     | CPA, ROAS                        |
| 4      | Iterar vencedores + novos conceitos | $300–$700     | Tendência de CPA, taxa de acerto |

### Recursos de teste por plataforma

**Meta Dynamic Creative:** Envie 5 imagens, 5 headlines, 5 descrições, 5 CTAs. A Meta testa combinações e otimiza entrega. Revise após 50K impressões por elemento. Melhor para contas $10K+/mês.

**TikTok Smart Creative:** Até 50 ativos por anúncio. O Smart+ seleciona os melhores e recomenda criativo novo da biblioteca. Combine com Symphony para auto-melhoria.

**Google PMax — grupos de ativos:** Crie grupos temáticos com conjuntos completos. O Google serve a melhor combinação por usuário e placement. Crie 3–5 grupos por campanha para testar temas.

## Seção 5: gestão de fadiga criativa

### Sinais de alerta

| Sinal                     | Limiar                                  | Ação                                   |
| ------------------------- | --------------------------------------- | -------------------------------------- |
| CTR caindo                | Queda de 20%+ do pico em 3 dias         | Enfileirar criativo substituto         |
| CPM subindo               | Aumento de 15%+ com a mesma segmentação | Expandir audiência ou renovar criativo |
| Frequência subindo        | Acima de 2,5 em prospecção              | Introduzir novas variações             |
| Frequência crítica        | Acima de 3,0 em remarketing             | Troca imediata de criativo             |
| Hook rate caindo          | Abaixo de 20% depois de >25%            | Novos ganchos                          |
| Sentimento em comentários | De positivo para “sempre vejo isso”     | Criativo queimado, aposentar           |
| CPA subindo               | 15%+ acima da meta por 3+ dias          | Testar novos ângulos, não só variações |

### Vida útil do criativo por plataforma

| Plataforma  | Formato              | Vida típica | Cadência de renovação       |
| ----------- | -------------------- | ----------- | --------------------------- |
| TikTok      | Vídeo in-feed        | 1–3 semanas | Criativo novo toda semana   |
| TikTok      | Spark Ads            | 2–4 semanas | Renovar a cada duas semanas |
| Meta        | Reels                | 2–3 semanas | Criativo novo toda semana   |
| Meta        | Feed estático        | 1–2 semanas | 2× por semana               |
| Meta        | Carrossel            | 3–4 semanas | Renovar a cada duas semanas |
| Google PMax | Mistos               | 3–6 semanas | Renov. mensal de ativos     |
| YouTube     | In-stream            | 4–8 semanas | Renov. mensal               |
| LinkedIn    | Conteúdo patrocinado | 3–5 semanas | Renovar a cada duas semanas |

### Pipeline de renovação de criativo

Mantenha pipeline contínuo para evitar buracos quando o criativo cansar:

**Sempre em produção:** 3–5 conceitos em desenvolvimento, 3–5 ativos em produção, 3–5 na fila de teste, 5–10 no ar.

**Cadência semanal:** seg — revisar e matar/escalar; ter — briefing de criativo novo; qua — gerar ativos com IA; qui — refinar e montar; sex — lançar em campanhas de teste.

### Táticas anti-fadiga

- **Rotação de formato:** Alterne vídeo, estático, carrossel. Quando um cansa, outro segue fresco.
- **Rotação de audiência:** Mova criativo cansado para novas audiências antes de aposentar. O que saturou em prospecção pode funcionar em remarketing.
- **Renovação sazonal:** Planeje em torno de datas e atualizações de produto. Proativo vence reativo.
- **Iteração primeiro:** Teste novos ganchos no corpo vencedor antes de refazer o conceito inteiro.

## Seção 6: critérios de corte e regras de escala

### Critérios de corte

| Prazo    | Corte se                           | Dados mínimos                         |
| -------- | ---------------------------------- | ------------------------------------- |
| 24 horas | Hook rate < 15%                    | 5K+ impressões                        |
| 48 horas | CTR < 0,5%                         | 2K+ impressões                        |
| 3 dias   | CPA > 2× meta                      | $50+ gasto ou 1K+ cliques             |
| 3 dias   | ROAS < 0,5× meta                   | $100+ gasto                           |
| 5 dias   | Sem conversões                     | 3× CPA-alvo em gasto                  |
| 7 dias   | CPA subindo 3 dias seguidos        | Dados estatisticamente significativos |
| 14 dias  | CPA 1,5× acima da meta sem melhora | Ciclo completo de teste               |

**Nunca corte antes dos dados mínimos.** Decisões ruins por amostra pequena custam mais que gasto extra em teste.

### Regras de escala

| Condição                           | Ação                                             | Frequência           |
| ---------------------------------- | ------------------------------------------------ | -------------------- |
| CPA < meta por 48 h                | Aumentar orçamento 20%                           | A cada 2–3 dias      |
| CPA < 50% da meta por 72 h         | Aumentar orçamento 30–50%                        | A cada 2 dias        |
| Vencedor segura após 3 aumentos    | Duplicar conjunto de anúncio para nova audiência | Uma vez por vencedor |
| Criativo com 100K impressões       | Encomendar 3 variações                           | Imediato             |
| Criativo com 500K impressões       | Testar novos ganchos na mesma estrutura          | Imediato             |
| CPA sobe após aumento de orçamento | Voltar ao orçamento anterior, esperar 48 h       | Conforme necessário  |
| CPA estável mas volume estagna     | Testar audiências ou placements mais amplos      | Semanalmente         |

**Limites de aumento de orçamento:** máx. 30% por dia na Meta (o algoritmo precisa recalibrar). Google PMax e TikTok Smart+ toleram até 50%.

## Seção 7: benchmarks de custo por plataforma (2025–2026)

### CPM por plataforma

| Plataforma     | CPM baixo | CPM médio | CPM alto | Fator principal                          |
| -------------- | --------- | --------- | -------- | ---------------------------------------- |
| TikTok         | $3        | $4–$7     | $15      | Especificidade da segmentação            |
| YouTube        | $3        | $6–$8     | $12      | Formato do anúncio (bumper vs in-stream) |
| Meta (Reels)   | $4        | $7–$10    | $18      | Competição Q4, tamanho da audiência      |
| Meta (Feed)    | $5        | $8–$12    | $20      | Competição do setor                      |
| Google Display | $1        | $3–$5     | $10      | Qualidade do placement                   |
| Google Search  | N/A       | $10–$30   | $50+     | Competição de palavra-chave              |
| LinkedIn       | $20       | $33–$65   | $100+    | Especificidade de cargo                  |

### CPC por plataforma

| Plataforma     | CPC médio    | Faixa        |
| -------------- | ------------ | ------------ |
| TikTok         | $0,50–$1,00  | $0,20–$2,00  |
| YouTube        | $2,00–$4,00  | $0,50–$6,00  |
| Meta           | $0,50–$1,50  | $0,30–$3,00  |
| Google Search  | $2,00–$5,00  | $0,50–$50+   |
| Google Display | $0,50–$1,00  | $0,20–$3,00  |
| LinkedIn       | $5,00–$12,00 | $3,00–$20,00 |

### Benchmarks de ROAS por canal

| Canal           | ROAS mediano | ROAS forte | Top performer    |
| --------------- | ------------ | ---------- | ---------------- |
| Google Search   | 4,0–8,0×     | 8,0–12,0×  | 15×+             |
| Google Shopping | 3,0–6,0×     | 6,0–10,0×  | 12×+             |
| Meta (geral)    | 2,5–4,0×     | 4,0–6,0×   | 8×+              |
| TikTok          | 1,5–3,0×     | 3,0–5,0×   | 6×+              |
| YouTube         | 2,0–4,0×     | 4,0–7,0×   | 10×+             |
| LinkedIn        | 1,0–2,0×     | 2,0–3,5×   | 5×+              |
| Mediana geral   | 2,19×        | 2,87×+     | Depende do setor |

### Benchmarks de CPA por setor

| Setor                 | CPA Meta  | CPA Google | CPA TikTok |
| --------------------- | --------- | ---------- | ---------- |
| E-commerce (AOV <$50) | $12–$25   | $15–$30    | $8–$20     |
| E-commerce (AOV $50+) | $25–$60   | $30–$75    | $15–$40    |
| SaaS (SMB)            | $50–$150  | $40–$120   | $30–$80    |
| SaaS (Enterprise)     | $150–$500 | $100–$400  | N/A        |
| Lead gen (B2B)        | $30–$100  | $25–$80    | $20–$60    |
| Educação / cursos     | $20–$60   | $15–$50    | $10–$35    |
| Saúde / wellness      | $15–$40   | $20–$50    | $10–$30    |
| Finanças / fintech    | $40–$150  | $30–$100   | $25–$80    |

## Seção 8: estratégia de criativo multicanal

### Matriz de adaptação de criativo

Um conceito, adaptado por plataforma. Nunca só republicar o mesmo arquivo.

| Elemento         | TikTok                             | Meta Reels              | Meta Feed                        | YouTube                       | LinkedIn                     |
| ---------------- | ---------------------------------- | ----------------------- | -------------------------------- | ----------------------------- | ---------------------------- |
| Tom              | Cru, nativo, ligado em tendências  | Casual polido           | Casual profissional              | Educativo, mais longo         | Thought leadership           |
| Duração          | 15–30 s                            | 15–30 s                 | 15–45 s (vídeo), N/A (estático)  | 30 s–2 min                    | 15–30 s (vídeo), N/A (texto) |
| Estilo de gancho | Interrupção de padrão, som em alta | Gancho visual, overlay  | Headline forte, imagem chamativa | Pergunta ou dado              | Insight ou take contrário    |
| CTA              | "Link na bio" / "Comente X"        | "Toque para saber mais" | "Compre" / "Saiba mais"          | "Inscreva-se" / "Link abaixo" | "Comente" / "Me chame no DM" |
| Legendas         | Obrigatório, estilo nativo         | Obrigatório, limpo      | Opcional no estático             | Recomendado                   | Pouco comum                  |
| Música/som       | Sons em alta são críticos          | Música licenciada       | Opcional                         | Só fundo                      | Raramente                    |
| Formato          | 9:16 vertical                      | 9:16 vertical           | 1:1 ou 4:5                       | 16:9 ou 9:16                  | 1:1 ou 16:9                  |

### Fluxo de reaproveitamento de criativo

1. Produza o criativo hero na plataforma principal
2. Reedição do gancho para cada plataforma secundária (os primeiros 3 s mais diferentes)
3. Ajuste proporção e troque música/som conforme a norma da plataforma
4. Atualize texto do CTA e legendas específicas
5. Teste o reaproveitamento de forma independente (não assuma performance cruzada)

## Seção 9: atribuição e medição

### Framework de medição

**Nível 1 — Relatórios da plataforma (baseline):** Use a atribuição nativa (Meta Ads Manager, Google Ads, TikTok Ads Manager). Bom para otimização direcional, mas superestima por sobreposição.

**Nível 2 — Analytics unificado (recomendado):** Ferramentas como Triple Whale, Cometly ou Rockerbox para atribuição por criativo entre plataformas. Rastreie quais criativos geram compra, não só clique.

**Nível 3 — Testes de incrementalidade (avançado):** Geo-lift e holdouts para impacto incremental verdadeiro. Ferramentas: Measured, Triple Whale ou lift nativo. Trimestral nos canais com maior gasto.

**Nível 4 — Marketing mix modeling (enterprise):** Modelos estatísticos com gasto, criativo e receita. Melhor para contas $100K+/mês. Ferramentas: Measured, Recast, data science interno.

### Métricas de analytics de criativo

| Métrica                 | O que indica                               | Benchmark                             |
| ----------------------- | ------------------------------------------ | ------------------------------------- |
| Hook rate               | Primeiros 3 s retendo atenção              | >25% bom, >35% ótimo                  |
| Hold rate               | Espectadores além de 50% do vídeo          | >15%                                  |
| Thumb-stop rate         | Parar o scroll em anúncios estáticos       | >3%                                   |
| CTR                     | Interesse em clicar                        | >1% bom, >2% ótimo                    |
| Taxa de conversão       | Cliques virando ação                       | 2–5% landing page                     |
| Taxa de acerto criativo | % de criativos testados que batem CPA-alvo | 15–25% saudável                       |
| Velocidade de criativo  | Criativos novos por semana                 | 5–10 para $10K+/mês                   |
| Tempo até fadiga        | Dias até performance cair 20%              | Acompanhe e aumente ao longo do tempo |

### Armadilhas de atribuição

- Plataformas contam em duplicata jornadas cruzadas — use janelas 1 dia view, 7 dias clique
- Google PMax pode atribuir conversões de busca de marca à campanha — separe marca vs não-marca
- Só teste de incrementalidade revela contribuição real do canal

## Seção 10: conformidade de criativo com IA

### Checklist de lançamento de criativo IA

Antes de publicar qualquer anúncio gerado por IA:

- [ ] Imagem/vídeo parece natural no tamanho mobile (sem artefatos estranhos)
- [ ] Mãos, dedos e texto renderizados corretamente
- [ ] Produto condiz com a realidade (sem features exageradas)
- [ ] Logo da marca posicionada e legível
- [ ] Passa na revisão específica da plataforma (sem antes/depois de saúde, sem claims exagerados)
- [ ] Geração por IA divulgada quando a lei local exigir
- [ ] Landing page condiz com a promessa do anúncio
- [ ] Revisão humana antes de ir ao ar
- [ ] Texto <20% da área da imagem na Meta (senão penaliza)

---

## Exemplos

- **Usuário diz:** "Escale nosso criativo pago com IA" → **Resultado:** O agente pergunta gasto e plataforma; usa árvore de gasto (<$1K → uma plataforma, 3–5 criativos, corte às 48h; $5–15K → híbrido, 15–25 criativos, matriz de testes); recomenda Advantage+/PMax/Smart+ e ritmo semanal de matar/escalar; sugere meta de taxa de acerto (>15%).
- **Usuário diz:** "Nosso ROAS está caindo" → **Resultado:** O agente verifica fadiga criativa e cadência de testes; recomenda 3–5 conceitos novos a partir dos vencedores, ciclo de renovação e alocação (vencedores vs testes); liga ao ROAS de break-even (1/margem) e gtm-metrics.
- **Usuário diz:** "Qual plataforma para criativo com IA?" → **Resultado:** O agente recomenda uma plataforma <$1K (Meta ou TikTok), duas em $1–5K; passa checklist de criativo (gancho, CTA, <20% texto na Meta, revisão); sugere ai-ugc-ads para camada UGC.

## Solução de problemas

- **Fadiga criativa** → **Causa:** Mesmo criativo por muito tempo ou segmentação ampla demais. **Correção:** Monitorar hook/hold semanalmente; renovar a cada 2–4 semanas; testar 3–5 conceitos novos a partir de padrões vencedores; usar criativo dinâmico quando possível.
- **Rejeição na revisão de anúncio** → **Causa:** Política (antes/depois saúde, claims exagerados) ou descompasso criativo. **Correção:** Sem antes/depois em saúde; alinhar landing ao criativo; revisão humana antes do ar; divulgar IA quando exigido.
- **Hook rate baixo** → **Causa:** Primeiros 3 s não param o scroll. **Correção:** Testar ganchos isolados; sons/formatos em alta; uma mensagem por criativo; benchmark >30% hook rate.

---

Para checklists, benchmarks e perguntas de descoberta leia `references/quick-reference.md` quando precisar de referência detalhada.

---

## Skills relacionadas

- **ai-ugc-ads** — Recrutamento de creators UGC, ferramentas de UGC com IA, Spark Ads e testes orgânicos primeiro
- **video-outreach** — Vídeo para prospecção e fluxos de outbound
- **multi-platform-launch** — Coordenar lançamentos de produto em vários canais ao mesmo tempo
- **gtm-metrics** — Frameworks de KPI, modelos de atribuição e dashboards de performance
- **content-to-pipeline** — Converter engajamento de conteúdo em pipeline de vendas qualificado
