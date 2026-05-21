---
name: video-outreach
description: "Use quando o usuário quiser construir outbound frio com vídeo em primeiro lugar, criar vídeo personalizado em escala, implementar vendas assíncronas ou usar geração de demo com IA para prospecção. Use também quando o usuário mencionar 'video outreach,' 'personalized video,' 'video prospecting,' 'Tavus,' 'Sendspark,' 'HeyGen,' 'video email,' 'async selling,' 'video demo' ou 'made this for you.' Esta habilidade cobre sistemas de outreach com vídeo em primeiro lugar, da personalização à otimização de conversão. NÃO use para implementação técnica, revisão de código ou arquitetura de software."
metadata:
  original_author: Chad Boyda / agent-gtm-skills
  modified_by: Felipe Rodrigues - github.com/felipfr
  source: https://github.com/chadboyda/agent-gtm-skills
  version: '1.0.0'
---

# Outbound frio com vídeo em primeiro lugar

Você é especialista em prospecção comercial com vídeo em primeiro lugar, personalização de vídeo com IA em escala, vendas assíncronas e prospecção guiada por demo interativo. Você ajuda fundadores, times de vendas e operadores de GTM a montar sistemas que usam vídeo personalizado para furar o ruído da caixa de entrada e gerar pipeline.

## Antes de começar

Pergunte:

1. Volume atual de outreach (vídeos por semana/mês)
2. Persona-alvo e tamanho do deal (SMB vs mid-market vs enterprise)
3. Stack atual (CRM, sequenciador de e-mail, ferramentas de vídeo)
4. Se o time já grava vídeo ou está começando do zero
5. Objetivo principal: marcar reuniões, acelerar deals ou substituir demos ao vivo
6. Faixa de orçamento para tooling de vídeo (US$0–50/mês, US$50–200/mês, US$200–500/mês, US$500+/mês)

## O framework "fiz isso para você"

O padrão de outbound frio que mais converte em 2025–2026 não é pitch em vídeo. É uma entrega de amostra gravada em vídeo. Você pesquisa o prospect, cria algo útil com IA e percorre isso na câmera.

### Os quatro passos

**Passo 1: Pesquisar o prospect (5–10 minutos)**

- Puxe site, perfil no LinkedIn, página de produto e posts recentes
- Identifique um problema visível e específico que você resolve
- Anote stack, tamanho do time, contratações recentes, rodadas
- Capture print do material que vai mostrar na tela

**Passo 2: Criar uma entrega de amostra com IA (10–15 minutos)**

- Monte mockup, auditoria, teardown ou mini-demo relevante ao negócio deles
- Exemplos por papel:
  - Líder de marketing: Auditoria da landing com anotações
  - Líder de vendas: Sequência de cold e-mail refeita com base na mensagem atual
  - Líder de engenharia: Diagrama de arquitetura com integração ao stack deles
  - CEO/fundador: Mapa de posicionamento competitivo com a empresa posicionada
- Use ferramentas de IA (Claude, ChatGPT, Midjourney, Figma AI) para gerar o artefato rápido
- A entrega deve ser útil de verdade mesmo se não responderem

**Passo 3: Gravar walkthrough de 60–90 segundos**

- Primeiros 5 s: nome, empresa e uma referência específica
- Próximos 15 s: mostrar a entrega na tela e explicar o que construiu
- Próximos 30–40 s: 2–3 achados ou recomendações-chave
- Últimos 10 s: CTA suave — "Feliz em mostrar o resto ao vivo se fizer sentido"
- Energia conversacional, não teatral
- NÃO abrir com "Oi, tudo bem?" ou preenchimento genérico

**Passo 4: Entregar por e-mail + LinkedIn**

- E-mail com thumbnail/GIF do vídeo (não player embutido)
- Linha de assunto referenciando a entrega: "[Nome], montei um [entregável] para [Empresa]"
- Mensagem no LinkedIn como segundo toque 24 h depois
- Rastrear aberturas, cliques e tempo de exibição para disparar follow-up

### Escala por tamanho do deal

```
+------------------+-------------------+---------------------+-------------------+
| Deal Size        | Research Depth    | Deliverable Type    | Video Length       |
+------------------+-------------------+---------------------+-------------------+
| SMB (<$10K ACV)  | 5 min             | Template/checklist  | 45-60 sec          |
| Mid-market       | 10-15 min         | Audit/teardown      | 60-90 sec          |
| ($10K-50K ACV)   |                   |                     |                    |
| Enterprise       | 20-30 min         | Custom analysis/    | 90-120 sec         |
| ($50K+ ACV)      |                   | POC mockup          |                    |
+------------------+-------------------+---------------------+-------------------+
```

Em volume baixo (abaixo de 20/semana), grave cada vídeo individualmente. Em volume maior:

1. Grave em lote o "miolo" de vídeos parecidos para um segmento de persona
2. Use ferramentas de IA (Tavus, Sendspark) para personalizar os primeiros 5 s por prospect
3. Crie templates de entrega reutilizáveis com só 2–3 campos trocando por prospect
4. Monte biblioteca de frameworks de auditoria comuns aplicáveis a qualquer empresa

## Vídeo personalizado em escala: panorama de ferramentas

### Comparação de plataformas

```
+-------------+------------------+------------------+------------------+-----------+
| Platform    | Personalization  | Best For         | Starting Price   | Volume    |
+-------------+------------------+------------------+------------------+-----------+
| Tavus       | AI digital twin  | Mass outreach,   | $39/mo starter   | 1000s/mo  |
|             | from 2-min       | API-driven        | $375/mo growth   |           |
|             | recording        | workflows         |                  |           |
+-------------+------------------+------------------+------------------+-----------+
| Sendspark   | Real human +     | High-value B2B,  | $39-49/user/mo   | 100s/mo   |
|             | AI voice clone,  | relationship-     |                  |           |
|             | dynamic BGs      | driven sales      |                  |           |
+-------------+------------------+------------------+------------------+-----------+
| HeyGen      | AI avatar,       | Volume outreach,  | Free tier,       | 1000s/mo  |
|             | 175+ languages,  | multilingual      | paid plans       |           |
|             | CRM sync         | campaigns         | scale up         |           |
+-------------+------------------+------------------+------------------+-----------+
| Potion      | AI face/voice    | Cold outreach     | AppSumo deals    | 1000s/mo  |
|             | clone, dynamic   | at scale, multi-  | available,       |           |
|             | backgrounds      | client agencies   | paid plans       |           |
+-------------+------------------+------------------+------------------+-----------+
| Loom        | Variables for    | Internal comms,   | $12.50/user/mo   | 10s-100s  |
|             | name/company,    | 1:1 prospecting,  | (Business)       | /mo       |
|             | screen + webcam  | post-demo recap   |                  |           |
+-------------+------------------+------------------+------------------+-----------+
```

### Framework de decisão

```
                         Need 500+ personalized videos/month?
                                    |
                          Yes ------+------ No
                          |                  |
                  Need real human            |
                  on camera?            Need real human
                  |          |          on camera?
                Yes         No          |          |
                |            |         Yes         No
            Tavus or     HeyGen       Sendspark    Loom
            Potion    (AI avatar)    (human +     (screen +
          (AI clone)               AI voice)      webcam)
```

### Tavus

Grave um vídeo base de 2 minutos para criar seu "digital twin." API ou painel gera variantes personalizadas por prospect com lip-sync de IA para pronúncia de nome, referências à empresa e dores. Cada vídeo parece e soa como gravado individualmente. Suporta 30+ idiomas e arquitetura API-first para integração CRM/sequenciador. Plano grátis inclui 5 réplicas stock para testes.

Escolha Tavus quando: o volume justifica automação (500+/mês), você quer SEU rosto na câmera e precisa de integração por API.

### Sendspark

Grave uma vez com template roteirizado. Clonagem de voz por IA personaliza a primeira linha por prospect. Fundos dinâmicos mostram o site ou o perfil LinkedIn do prospect. Integra com 50+ ferramentas incluindo Salesforce e HubSpot. Relatórios de até 12% taxa de resposta, 7× CTR vs texto, 2–3× engajamento e 3× conversões por e-mail.

Escolha Sendspark quando: deal $10K+ ACV, vídeo humano real com assistência de IA e volume moderado (50–500/mês).

### HeyGen

Avatares stock ou custom a partir de filmagem. Escreva roteiro, HeyGen gera vídeo completo. Video Agent (2025) cria vídeos completos a partir de prompt de texto (roteiro, avatar, voz, edição). 175+ idiomas com lip-sync natural. Sync com CRM para geração em massa. #1 Fastest Growing Product of 2025 no G2, usado por 100.000+ empresas.

Escolha HeyGen quando: vende internacionalmente, volume alto, não precisa do rosto real e velocidade importa mais que autenticidade percebida.

### Potion (SendPotion)

Grave um vídeo base. A IA aprende rosto, voz e gestos e gera centenas de variantes. Fundos dinâmicos mostram LinkedIn, site ou marca do prospect. Saudações em IA falam o nome naturalmente. Extensão Chrome para gravação rápida. 50+ integrações CRM. Relatórios de até 500% mais respostas e 4× engajamento.

Escolha Potion quando: outbound frio em alto volume (500+/semana), vários clientes (modelo agência) ou clone de IA com preço menor.

### Loom

Gravação tela + webcam com compartilhamento instantâneo. Variáveis trocam nome/empresa sem regravar. Edição por IA remove vícios de linguagem e silêncios. Analytics de vídeo sincroniza com CRM. CTA automático para agendar. Time de vendas Intercom relatou 19% taxa de resposta. Até 300% de aumento no CTR de e-mail.

Escolha Loom quando: volume abaixo de 50/mês, precisa de tela para walkthrough de produto ou orçamento apertado ($12,50/usuário/mês).

## Ferramentas de demo interativo para vendas assíncronas

Demos interativos deixam o prospect sentir o produto sem call ao vivo. Com narração em vídeo, substituem a reunião de introdução tradicional.

### Navattic vs Supademo

```
+------------------+----------------------------+----------------------------+
| Factor           | Navattic                   | Supademo                   |
+------------------+----------------------------+----------------------------+
| Primary use      | Sales pipeline generation  | Sales enablement +         |
|                  |                            | onboarding                 |
+------------------+----------------------------+----------------------------+
| Scale            | 40,000+ demos built in     | 100,000+ professionals     |
|                  | 2025 (35% YoY growth)      | (Turo, Beehiiv, Jotform)  |
+------------------+----------------------------+----------------------------+
| Top performance  | Top 1% demos: 71% CTR      | 50% faster content         |
|                  | Viewers 6x more likely     | creation, 20% engagement   |
|                  | to convert                 | lift                       |
+------------------+----------------------------+----------------------------+
| AI features      | Intent signals, prospect   | AI voiceover (ElevenLabs   |
|                  | scoring via Pocus/Madkudu  | + OpenAI), auto            |
|                  |                            | annotations, 15+ languages |
+------------------+----------------------------+----------------------------+
| Best audience    | Mid-market to enterprise   | SMB to mid-market          |
+------------------+----------------------------+----------------------------+
| Key insight      | Win rates up 20-30% when   | AI narration means no      |
|                  | demos in sales cycle.      | recording needed.          |
|                  | 65% ungated = 6% more      | Chrome extension capture   |
|                  | engagement                 | for fast demo creation     |
+------------------+----------------------------+----------------------------+
```

## Vídeo na sequência de vendas

Tipos diferentes de vídeo servem a propósitos diferentes em cada estágio. Não use o mesmo formato em todo lugar.

### Arquitetura da sequência

```
Day 1:  Cold outreach video (personalized 60-90 sec)
        + Email with GIF thumbnail + LinkedIn connection request (no pitch)

Day 3:  Follow-up email (text only, reference the video)
        "Did you get a chance to watch the [deliverable] I built?"

Day 5:  LinkedIn voice note or short video reply
        Reference a specific post or content they shared

Day 8:  Interactive demo link
        "Recorded a 3-min walkthrough of how [Product] works for [their use case]"

Day 12: Value-add email (case study, data point, or insight) - no video, mix format

Day 15: Breakup video (30 sec)
        "Wanted to close the loop - if timing isn't right, no worries"
```

### Tipos de vídeo por estágio

**Outbound frio (Dia 1)** — Webcam + tela mostrando site/perfil deles. 60–90 s. Nome, empresa, referência específica nos primeiros 5 s. CTA suave. Ferramentas: Tavus/Sendspark/Potion em escala, Loom 1:1.

**Pós-conexão (Dia 5)** — Só webcam, casual. 30–45 s. Referenciar conteúdo recente deles. Pergunta, não pitch. Ferramentas: Loom ou vídeo nativo LinkedIn.

**Substituto assíncrono de pré-demo (Dia 8)** — Demo interativo com narração IA ou gravação de tela. 2–4 min. Caso de uso para indústria/cargo. Ferramentas: Navattic/Supademo ou Loom.

**Recap pós-demo** — Tela com slides/features discutidos. 3–5 min. Referir perguntas específicas da call. Ferramenta: Loom.

**Walkthrough de proposta** — Tela com documento de proposta. 3–5 min. ROI específico ao negócio deles. CTA direto. Ferramenta: Loom com botão de CTA.

**Breakup (Dia 15)** — Só webcam. 20–30 s. Pouca personalização. Baixo esforço de propósito.

## Vendas assíncronas: substituindo reuniões por vídeo

Vendas híbrida é padrão em 2026. Compradores escolhem como interagem. Substitua reuniões síncronas de baixo valor por vídeo assíncrono; mantenha calls ao vivo para conversa em tempo real.

**Substituir por vídeo assíncrono:** qualificação, overview de produto, walkthrough de features, recap pós-demo, apresentação de proposta, enablement de champion interno.

**Manter ao vivo:** discovery com perguntas profundas, negociação, construção de relação executiva, deep-dive técnico complexo, revisão contratual/jurídica.

### Estrutura de demo assíncrono (3 minutos)

```
[0:00 - 0:15]  Personal greeting + why you are recording this for them
[0:15 - 0:45]  Problem statement framed around their specific situation
[0:45 - 2:00]  Product walkthrough: 2-3 features that solve their problem
[2:00 - 2:30]  Quick ROI proof point or customer reference
[2:30 - 2:45]  CTA: Calendar link to go deeper on the parts that matter
[2:45 - 3:00]  Sign-off
```

### Tempo de exibição como sinal de qualificação

```
+-------------------+--------------------+-----------------------------+
| Watch %           | Signal             | Follow-up Action            |
+-------------------+--------------------+-----------------------------+
| 0% (no open)      | Missed it or not   | Try different channel       |
|                   | interested         | (LinkedIn, phone)           |
+-------------------+--------------------+-----------------------------+
| 1-25%             | Mild curiosity     | Text follow-up with key     |
|                   |                    | takeaway from the video     |
+-------------------+--------------------+-----------------------------+
| 25-75%            | Engaged, did not   | Shorter follow-up video     |
|                   | finish             | covering what they missed   |
+-------------------+--------------------+-----------------------------+
| 75-100%           | High interest      | Call within 5 minutes if    |
|                   |                    | live; same-day email if not |
+-------------------+--------------------+-----------------------------+
| Re-watched or     | Very high intent   | Priority follow-up - they   |
| shared internally |                    | are building a case         |
+-------------------+--------------------+-----------------------------+
```

**Regra de timing crítico:** Se o prospect assiste 75%+ do vídeo, ligue em até 5 minutos. Taxas de resposta caem muito após a primeira hora.

### Habilitar champions internos

Quando o contato precisa vender por dentro:

1. Grave resumo executivo de 2 minutos que ele possa encaminhar ao líder
2. Crie demo interativo (Navattic/Supademo) para o time explorar sozinho
3. Monte documento de ROI de uma página para anexar em pedido de budget
4. Enquadre tudo nos objetivos DELES, não nas features do seu produto

## Benchmarks de conversão

### Vídeo vs texto no outreach

```
+-------------------------------+-------------------+-------------------+
| Metric                        | Text Email        | Video Email       |
+-------------------------------+-------------------+-------------------+
| Average open rate             | 25-30%            | 34.2% (+24-37%)   |
+-------------------------------+-------------------+-------------------+
| Click-through rate            | 2-3%              | Up to 300% higher |
+-------------------------------+-------------------+-------------------+
| Reply rate (cold)             | 1-5%              | 3-5x higher       |
+-------------------------------+-------------------+-------------------+
| Click-to-open (personalized)  | Baseline          | 16x higher        |
+-------------------------------+-------------------+-------------------+
| Time spent reading            | Baseline          | 2.1x longer       |
+-------------------------------+-------------------+-------------------+
| Proposal close rate           | Baseline          | 41% more closes   |
+-------------------------------+-------------------+-------------------+
| Sales cycle length            | Baseline          | 26% faster        |
+-------------------------------+-------------------+-------------------+
```

### Boas práticas de thumbnail em e-mail

Thumbnails e GIFs de vídeo no e-mail elevam taxas de abertura em 6–8%:

- GIF animado com os primeiros 3 s (seu rosto + nome deles)
- Overlay de play no thumbnail
- Link para landing page, não arquivo de vídeo direto
- Fallback em texto: "Não vê o vídeo? Clique aqui para assistir"
- Largura 600px, proporção 16:9

Times que usam vídeo semanalmente relatam 11,2% CTR vs 6,4% com uso mensal. Consistência compõe.

## Stack tecnológico de prospecção em vídeo

### Stack mínimo viável (abaixo de US$100/mês)

```
Recording:        Loom ($12.50/user/mo) or free screen recorder
Personalization:  Manual (record each video individually)
Delivery:         Email client + LinkedIn
Analytics:        Loom built-in analytics
CRM:              HubSpot free or Pipedrive starter
```

### Stack de crescimento (US$200–500/mês)

```
Recording:        Sendspark ($39-49/user/mo) for AI-assisted personalization
Personalization:  AI voice cloning + dynamic backgrounds
Delivery:         Sales sequencer (Outreach, Apollo, Instantly)
Demos:            Supademo for interactive product demos
CRM:              HubSpot or Salesforce
```

### Stack de escala (US$500+/mês)

```
Recording:        Tavus ($375/mo growth) for AI digital twin at volume
Personalization:  Full AI clone - face, voice, lip-sync per prospect
Delivery:         Outreach or Salesloft with API integration
Demos:            Navattic for enterprise-grade interactive demos
CRM:              Salesforce with lead scoring
Enrichment:       Clay or Apollo for prospect research automation
```

## Boas práticas de gravação

### Fórmula de vídeo frio de 60 segundos

```
[0:00 - 0:05]  Hook: Their name + specific reference
               "Hey [Name], saw [Company] just [trigger event]"

[0:05 - 0:15]  Context: Why you are reaching out
               "We help [similar companies] solve [specific problem]"

[0:15 - 0:45]  Value: Show, do not tell
               Share your screen - show the deliverable, audit, or demo

[0:45 - 0:55]  Social proof: One sentence
               "[Similar company] saw [specific result] in [timeframe]"

[0:55 - 1:00]  CTA: Soft close
               "Worth a 15-minute chat? Link below"
```

### Erros comuns

1. **Abrir com filler** — "Espero que esteja bem" desperdiça seus melhores segundos. Comece com nome e gatilho.
2. **Centrar em você** — Comece pelo problema deles, não pela história da empresa.
3. **Ir longe demais** — Vídeos frios acima de 90 s têm queda forte de audiência.
4. **Áudio ruim** — Áudio ruim mata engajamento mais rápido que imagem ruim. Use microfone decente.
5. **Sem CTA claro** — Cada vídeo precisa de exatamente um próximo passo.
6. **Thumbnail genérica** — Mostre nome deles ou logo da empresa, não frame estático só com você.
7. **Embutir vídeo no e-mail** — Clientes de e-mail bloqueiam embeds. Use GIF com link para landing.
8. **Pular follow-up** — 48% dos reps nunca mandam segunda mensagem. Construa follow-up na sequência.

### Luz e enquadramento

- Olhe para a fonte de luz (janela ou ring light à frente, não atrás)
- Câmera na altura dos olhos ou levemente acima
- Cabeça e ombros visíveis
- Fundo limpo ou blur sutil
- Olhar para a lente nos momentos-chave, não só para a tela
- Teste níveis de áudio antes da gravação final

## Medição de desempenho

### Métricas centrais

```
+---------------------------+------------------+----------------------------+
| Metric                    | Good Benchmark   | How to Improve             |
+---------------------------+------------------+----------------------------+
| Video play rate           | 30-40%           | Better thumbnails, subject |
|                           |                  | lines, send timing         |
+---------------------------+------------------+----------------------------+
| Average watch %           | 50-60%           | Shorter videos, stronger   |
|                           |                  | hooks, better pacing       |
+---------------------------+------------------+----------------------------+
| Reply rate (cold)         | 8-15%            | More personalization,      |
|                           |                  | better targeting           |
+---------------------------+------------------+----------------------------+
| Meeting book rate         | 3-8%             | Clearer CTAs, faster       |
|                           |                  | follow-up on watch events  |
+---------------------------+------------------+----------------------------+
| Videos to meeting ratio   | 15-25:1          | Focus on ICP fit, better   |
|                           |                  | deliverables               |
+---------------------------+------------------+----------------------------+
```

### Funil de atribuição

Rastreie o caminho completo no CRM: vídeos enviados > abertos (play rate) > assistiram além de 50% > respostas > reuniões marcadas > oportunidades > receita fechada. A razão vídeos enviados / reuniões marcadas é sua métrica central de eficiência.

## Exemplos

- **Usuário diz:** "Adicionar vídeo ao nosso outbound frio" → **Resultado:** O agente pergunta volume e tamanho do deal; recomenda tier de ferramenta (ex. Sendspark ou Tavus); descreve o fluxo "fiz isso para você" (pesquisa → vídeo 30–60 s → CTA); sugere posição na sequência (ex. toque 2).
- **Usuário diz:** "Precisamos de vídeo personalizado em escala" → **Resultado:** O agente esclarece volume e idiomas; sugere clone IA (Tavus/Potion) vs humano (Sendspark); checklist de roteiro, thumbnail e tracking.
- **Usuário diz:** "Qual a melhor ferramenta de vídeo para o time?" → **Resultado:** O agente usa matriz do Guia rápido (volume, caso de uso, orçamento) para recomendar uma opção principal e um plano B, com notas de integração (sequenciador, CRM).

## Solução de problemas

- **Baixa abertura/exibição do vídeo** → **Causa:** Assunto ou thumbnail genérico. **Correção:** Assunto referencia prospect (nome, empresa ou personalização clara); thumbnail mostra rosto ou valor claro.
- **Vídeos soam impessoais** → **Causa:** Roteiro muito template ou longo. **Correção:** Primeiros 5 s devem citar prospect ou empresa e um motivo específico; manter vídeo abaixo de 60 s.
- **Ferramenta não integra com nossa stack** → **Causa:** Sequenciador ou CRM sem suporte a embed/link. **Correção:** Link de compartilhamento da ferramenta + cliques rastreados; ou Loom/upload manual e colar link no e-mail/DM.

---

## Guia rápido

| Situação                                     | Recomendação                            |
| -------------------------------------------- | --------------------------------------- |
| Começando do zero, menos de 50 prospects/mês | Loom + gravação manual                  |
| Volume médio, contas de alto valor           | Sendspark para vídeo humano com IA      |
| Outbound frio alto volume, 500+/mês          | Tavus ou Potion para clone IA em escala |
| Campanhas multilíngues                       | HeyGen com suporte a 175+ idiomas       |
| Substituir reuniões de intro                 | Demos interativos Navattic ou Supademo  |
| Follow-up pós-demo                           | Loom com recap em tela                  |
| Agência com vários clientes                  | Potion para clone multi-marca           |
| Enterprise com necessidade de API            | Plano Tavus Growth/Enterprise           |

## Perguntas para fazer

1. Qual sua taxa de resposta atual no outbound frio? (baseline para superar)
2. Quantos prospects você contata por semana? (define tier de ferramenta)
3. O que o prospect vê nos primeiros 5 segundos? (testa qualidade da personalização)
4. Você aceita vídeo gerado por IA com seu rosto? (sintético vs humano)
5. Você tem uma entrega que pode criar para prospects? (prontidão "fiz isso para você")
6. Como faz follow-up de sinais de engajamento hoje? (fluxo de analytics)
7. Qual o ticket médio? (limiar de ROI para investir em vídeo)
8. Vende internacionalmente ou só em inglês? (requisitos de idioma)
9. Seu sequenciador de vendas permite thumbnail de vídeo? (integração técnica)
10. Quem assiste os vídeos internamente na empresa do prospect? (prontidão multi-thread)

## Skills relacionadas

- **ai-cold-outreach** — Cold por e-mail multicanal; vídeo se soma a esses fundamentos.
- **ai-sdr** — Agentes SDR com IA podem disparar vídeo com base em sinais de intent e automatizar follow-up.
- **paid-creative-ai** — Criativo de anúncio com IA compartilha ferramentas e técnicas com personalização em vídeo (HeyGen, avatares).
- **ai-ugc-ads** — UGC e porta-voz com IA para anúncios usam a mesma tecnologia de avatar e clone que vídeo de prospecção.
- **sales-motion-design** — Prospecção em vídeo encaixa na arquitetura de motion como estratégia de canal.
- **social-selling** — Prospecção em vídeo no LinkedIn combina com táticas de social selling.
