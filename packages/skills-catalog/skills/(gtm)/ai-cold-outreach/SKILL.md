---
name: ai-cold-outreach
description: 'Use quando o usuário quiser montar um sistema de outreach com IA, escrever cold emails, melhorar entregabilidade ou escalar outreach personalizado. Também quando mencionar cold email, cold outreach, automação de outreach, Instantly, Smartlead, Clay, sequências de email, entregabilidade, personalização em escala, taxa de resposta ou stack de outreach. Cobre o sistema completo de cold outreach com IA, da detecção de sinal à conversão. NÃO use para implementação técnica, revisão de código ou arquitetura de software.'
metadata:
  original_author: Chad Boyda / agent-gtm-skills
  modified_by: Felipe Rodrigues - github.com/felipfr
  source: https://github.com/chadboyda/agent-gtm-skills
  version: '1.0.0'
---

# Cold outreach com IA

Você é expert em sistemas de cold outreach com IA. Ajuda a construir, otimizar e escalar campanhas de email frio personalizadas que geram pipeline. Domina a stack completa — da detecção de sinal e enriquecimento à personalização, sequenciamento, infra de envio e follow-ups gerados por IA. Prefere orientação específica e acionável com base em dados atuais, não em "boas práticas" genéricas.

## Antes de começar

Antes de construir ou otimizar qualquer sistema de cold outreach, reúna:

1. **Definição de ICP** — Quem é o alvo? (cargo, porte, indústria, stack)
2. **Estado atual** — Começando do zero ou otimizando sistema existente?
3. **Metas de volume** — Quantos emails por dia/semana? Quantas reuniões por mês?
4. **Ferramentas existentes** — CRM, enriquecimento, envio já em uso?
5. **Faixa de orçamento** — Founder sozinho vs. equipe com budget?
6. **Clareza da oferta** — Qual o valor? Já validado ou em teste?
7. **Requisitos de compliance** — Restrições geográficas (GDPR, CAN-SPAM, CASL)?
8. **Prazo** — Quando precisa de pipeline? (Infra leva 3–4 semanas para aquecer)

Se o usuário pular isso, pergunte. Outreach sem clareza de ICP desperdiça capacidade de envio e queima domínios.

---

## A stack de outreach com IA

O sistema moderno de cold outreach é um pipeline de seis estágios. Cada estágio tem ferramentas, métricas e modos de falha específicos.

```
+------------------+     +------------------+     +---------------------+
|  1. SINAL        |---->|  2. ENRIQUEC.    |---->|  3. PERSONALIZAÇÃO  |
|  DETECÇÃO        |     |                  |     |                     |
|                  |     |  Waterfall Clay  |     |  Primeiras linhas IA|
|  Triggers Clay   |     |  Apollo          |     |  Match de dor       |
|  Intent Bombora  |     |  ZoomInfo        |     |  Claude/GPT         |
|  Reviews G2      |     |  Hunter          |     |  Pesquisa de ângulo |
|  LinkedIn Sales  |     |  Clearbit        |     |                     |
|  Navigator       |     |  RocketReach     |     |                     |
+------------------+     +------------------+     +---------------------+
         |                                                   |
         v                                                   v
+------------------+     +------------------+     +---------------------+
|  6. FOLLOW-UP    |<----|  5. ENVIO         |<----|  4. SEQUÊNCIAS      |
|                  |     |                  |     |                     |
|  Respostas IA    |     |  Instantly       |     |  Multi-etapa        |
|  contextuais     |     |  Smartlead       |     |  Lógica condicional |
|  Objeções        |     |  Multi-caixa     |     |  Variantes A/B      |
|  Agendamento     |     |  Rotação IP      |     |  Mix de canais      |
+------------------+     +------------------+     +---------------------+
```

### Estágio 1: Detecção de sinais

Sinais dizem COM quem falar e QUANDO. Cold email sem sinais é spam com passos extras.

**Tipos de sinal por intenção de conversão:**

| Tipo de sinal                   | Fonte               | Nível de intenção | Janela de timing |
| ------------------------------- | ------------------- | ----------------- | ---------------- |
| Visualização de categoria no G2 | G2 Buyer Intent     | Muito alto        | 7–14 dias        |
| Avaliação de concorrente        | Bombora + G2        | Muito alto        | 7–21 dias        |
| Vaga na sua categoria           | LinkedIn, Indeed    | Alto              | 14–30 dias       |
| Anúncio de funding              | Crunchbase, Clay    | Alto              | 30–60 dias       |
| Mudança de stack                | BuiltWith, HG Data  | Médio-alto        | 14–30 dias       |
| Contratação de liderança        | LinkedIn Sales Nav  | Médio             | 30–45 dias       |
| Engajamento com conteúdo        | cooperativa Bombora | Médio             | 7–14 dias        |
| Pico de crescimento             | Clay, LinkedIn      | Médio-baixo       | 30–60 dias       |

**Estratégia de camadas de sinais:**
Um único sinal costuma gerar 3–5% de taxa de resposta. Empilhe dois ou mais e a taxa salta para 8–15%. Ex.: “Contrataram VP de Vendas” + “Avaliando CRM no G2” = prospect de alta intenção com autoridade e necessidade ativa.

**Dados de intent Bombora:**
Bombora opera a maior cooperativa de dados B2B, rastreando consumo de conteúdo em mais de 5.000 sites. Mostra scores de “surge” quando uma empresa pesquisa tópicos acima da linha de base. G2 e Bombora têm integração direta que combina atividade no site de reviews com sinais mais amplos da web.

Boas práticas: use G2 por velocidade (sinais de compradores ativos) e Bombora por estabilidade (dados agregados mais consistentes no tempo). Empilhe os dois para cobertura completa.

**Clay como orquestrador de sinais:**
Clay conecta mais de 150 fontes em um único fluxo. Use tabelas Clay para monitorar eventos-gatilho e rotear sinais qualificados automaticamente para pipelines de enriquecimento e personalização. A ação HTTP do Clay permite usar qualquer API como fonte de sinal.

### Estágio 2: Enriquecimento

Enriquecimento transforma nome de empresa + sinal em contato entregável com contexto.

**Modelo waterfall:**

```
Lead entra na tabela Clay
        |
        v
  [Provedor A: Apollo]
  Achou email? ----SIM----> Verificado? --SIM--> Pronto
        |                       |
       NÃO                     NÃO
        |                       |
        v                       v
  [Provedor B: Hunter]    [Provedor C: ZoomInfo]
  ...
        |
       NÃO
        |
        v
  Pular ou pesquisa manual
```

**Por que waterfall supera um único provedor:**
Nenhum provedor cobre mais de 60–70% dos contatos B2B. Um waterfall com 3–5 provedores frequentemente leva a 80%+ de emails válidos. O Clay automatiza com etapas sequenciais que param ao achar email verificado, economizando créditos.

**Dados a coletar (ordem de prioridade):**

1. **Email corporativo verificado** — Obrigatório. Taxa de bounce deve ficar abaixo de 2%.
2. **Cargo e senioridade** — Roteamento de sequência e personalização.
3. **Porte e receita** — Filtro de ICP.
4. **Notícias recentes** — Funding, lançamentos, expansões. Alimenta primeiras linhas.
5. **Stack tecnológico** — BuiltWith ou HG Data. Crítico para jogos de displacements.
6. **URL do LinkedIn** — Sequências multicanal e pesquisa IA.
7. **Sinais de contratação** — Vagas abertas indicam dor ou crescimento.
8. **Posts ou artigos** — Combustível para primeiras linhas personalizadas por IA.

**Verificação de email é inegociável:**
Todo email deve passar por verificação (ZeroBounce, NeverBounce ou MillionVerifier) antes do envio. Taxa de bounce acima de 2% aciona filtros de spam no Google e Microsoft. Uma lista ruim pode queimar um domínio em um dia.

### Estágio 3: Personalização com IA

Emails genéricos têm 1–2% de resposta. Com personalização por IA chega-se a 8–12%. A diferença está nas duas primeiras linhas.

**Pipeline de personalização:**

```
Dados enriquecidos (notícias, stack, hiring, social)
        |
        v
  [Agente IA: Claude ou GPT]
        |
        +---> Resumo de pesquisa (2–3 achados-chave)
        +---> Ângulo de personalização (por que AGORA, por que ELES)
        +---> Primeira linha custom (observação específica)
        +---> Hipótese de dor (inferida dos sinais)
        |
        v
  Mesclar no template via {{variables}}
```

**Frameworks de primeira linha que funcionam:**

| Framework               | Exemplo                                                                                              | Melhor para                                  |
| ----------------------- | ---------------------------------------------------------------------------------------------------- | -------------------------------------------- |
| Observação + implicação | "Vi que abriram escritório em Londres — escalar suporte entre fusos costuma complicar rápido."       | Sinais de funding/expansão                   |
| Elogio + ponte          | "Seu post sobre métricas PLG foi fino — especialmente a parte de taxa de ativação vs. NPS."          | Prospect ativo em conteúdo                   |
| Gatilho + pergunta      | "Estão contratando 3 AEs neste trimestre — como estão pensando no tempo de ramp?"                    | Sinais de hiring                             |
| Conexão mútua           | "O Alex Chen comentou que estão repensando outbound — ajudamos o time dele na Acme no mesmo padrão." | Indicação / intro morna                      |
| Narrativa de timeline   | "Quando começamos com times do seu porte, a maioria gastava 6 h/semana em enrichment manual."        | Ganchos de timeline (maior taxa de resposta) |

**Ganchos de timeline superam o resto:**
Dados de 2025 mostram ganchos baseados em timeline com ~10% de resposta vs. ~4,4% para ganchos baseados em problema — cerca de 2,3×. Narrativas de timeline geram urgência sem pressão artificial e espelham o processo de decisão do prospect.

**Seleção de modelo para personalização:**

| Modelo        | Força                                 | Melhor uso                            |
| ------------- | ------------------------------------- | ------------------------------------- |
| Claude Sonnet | Tom natural, evita jargão corporativo | Primeiras linhas, rascunhos completos |
| Claude Opus   | Síntese profunda de pesquisa          | Personalização enterprise complexa    |
| GPT-4o        | Velocidade, saída estruturada         | Processamento em lote em escala       |
| Claude Haiku  | Custo baixo                           | Variáveis simples                     |

Modelos Claude costumam soar mais naturais em cold email, evitando buzzwords e tom conversacional. GPTs tendem a cair em gatilhos de spam como "Quick question" e "Hope this finds you well", salvo prompt forte em contrário.

**Escalando personalização com Clay:**

1. Tabela Clay com leads enriquecidos
2. Coluna de enrichment IA com Claude
3. Prompt: "Pesquise esta empresa com os dados fornecidos. Escreva uma observação de 1 frase sobre [contexto específico]. Sem jargão corporativo."
4. Saída vai para Instantly/Smartlead como campo de merge
5. Custo: cerca de US$ 0,01–0,03 por lead em tier Sonnet

### Estágio 4: Sequenciamento

Uma sequência é a estrutura multietapas da campanha: quantos emails, quando enviar e o papel de cada um.

**Anatomia de sequência de alto desempenho:**

```
Dia 0:  Email 1 — Abertura (personalizada, leva o gancho)
         |
Dia 3:  Email 2 — Valor (case, dado ou insight)
         |
Dia 7:  Email 3 — Prova social (resultado para empresa similar)
         |
Dia 12: Email 4 — Novo ângulo / “breakup” (muda a abordagem)
         |
Dia 18: Email 5 — Fechamento por permissão ("Posso encerrar este fio?")
```

**Regras de tamanho e timing:**

| Fator                  | Recomendação               | Por quê                                                                 |
| ---------------------- | -------------------------- | ----------------------------------------------------------------------- |
| Total de emails        | 4–7                        | O primeiro captura ~58% das respostas. Retorno decrescente depois de 7. |
| Intervalo entre emails | 2–4 dias úteis             | 3 dias é o ponto ideal. Menos parece insistente; mais perde ímpeto.     |
| Duração total          | 14–25 dias                 | Além de 25 dias os leads esfriam.                                       |
| Sequências SMB         | 5–8 toques em 30 dias      | Ciclos de decisão mais curtos.                                          |
| Enterprise             | 10–18 toques em 30–60 dias | Vários stakeholders, ciclos longos.                                     |

**Ramo condicional:**
Sequências modernas não são lineares. Ramifique com base em:

- **Aberturas sem resposta** — Follow-up mais curto com outro ângulo
- **Cliques em link** — Acelerar sequência, incluir ligação
- **Sem aberturas** — Testar assunto, mudar horário de envio
- **Resposta positiva** — Rotear para AE ou agendar direto
- **Objeção** — Acionar handler de objeções IA ou revisão manual

**Framework A/B:**
Teste UMA variável por vez, mínimo ~200 envios por variante:

| Prioridade | Variável                | Impacto na taxa de resposta         |
| ---------- | ----------------------- | ----------------------------------- |
| 1          | Linha de assunto        | 20–40% de swing na taxa de abertura |
| 2          | Primeira linha / gancho | Diferença de 2–3× na resposta       |
| 3          | Estilo de CTA           | 1,5–2× na resposta                  |
| 4          | Tamanho do email        | Impacto moderado                    |
| 5          | Horário de envio        | Impacto marginal                    |

### Estágio 5: Infra de envio

É aqui que a maioria dos sistemas quebra. Copy perfeita com entregabilidade ruim cai no spam.

**Arquitetura de domínios e caixas:**

```
Domínio primário: suaempresa.com
  (NUNCA use para cold outreach)

Domínios secundários (só outreach):
  suaempresa-team.com    --> caixa1@, caixa2@
  ...

Fórmula:
  Meta de volume diário / 150 = domínios (arredondar para cima)
  + 30–50% de reserva para rotação

Ex.: 600 emails/dia
  600 / 150 = 4 domínios mínimo
  + 50% reserva = 6 domínios
  x 2 caixas cada = 12 caixas
```

**Guia de dimensionamento:**

| Volume diário | Domínios | Caixas | Custo mensal aprox. (domínios) |
| ------------- | -------- | ------ | ------------------------------ |
| 100–200       | 2–3      | 4–6    | US$ 20–30                      |
| 300–500       | 3–5      | 6–10   | US$ 30–50                      |
| 500–1.000     | 5–8      | 10–16  | US$ 50–80                      |
| 1.000–2.000   | 8–15     | 16–30  | US$ 80–150                     |
| 2.000+        | 15+      | 30+    | US$ 150+                       |

**Limites por caixa:**

| Tipo      | Limite diário | Notas                           |
| --------- | ------------- | ------------------------------- |
| Warmup    | 15–20/dia     | 14–21 dias antes dos cold sends |
| Cold      | 25–30/dia     | Nunca passar de 40              |
| Combinado | 40–50/dia     | Abaixo dos limites do provedor  |

**Protocolo de aquecimento de domínio:**

| Semana | Volume/caixa/dia | Atividade                |
| ------ | ---------------- | ------------------------ |
| 1      | 10–15            | Só warmup, sem cold      |
| 2      | 20–30            | Warmup + 5–10 cold       |
| 3      | 30–40            | Warmup + 15–20 cold      |
| 4      | 40–50            | Capacidade plena de cold |

**Checklist de autenticação (dia 1):**

- [ ] SPF publicado (autoriza servidores de envio)
- [ ] DKIM ativo (assinatura por mensagem)
- [ ] DMARC configurado (começar em p=none, depois quarantine, depois reject)
- [ ] Domínio de tracking próprio (não compartilhado)
- [ ] Cabeçalho List-Unsubscribe (exigido por Google, Yahoo, Microsoft)
- [ ] MX corretos
- [ ] PTR / DNS reverso

Remetentes autenticados chegam à caixa de entrada ~2,7× mais que não autenticados.

**Sequência de rollout DMARC:**

1. Semanas 1–2: `p=none` com relatórios (`rua=mailto:dmarc@seudominio.com`)
2. Semanas 3–4: Revisar relatórios, corrigir alinhamento
3. Semanas 5–6: `p=quarantine`
4. Semana 7+: `p=reject`

Nunca vá direto para `p=reject` sem mapear todos os remetentes legítimos.

**Comparativo Instantly vs. Smartlead**

| Recurso                    | Instantly                        | Smartlead                                      |
| -------------------------- | -------------------------------- | ---------------------------------------------- |
| **Melhor para**            | Founders solo, times pequenos    | Agências, alto volume                          |
| **Preço entrada**          | US$ 37/mês                       | US$ 33/mês                                     |
| **Preço escala**           | US$ 97–358/mês                   | US$ 94–174/mês                                 |
| **Contas de email**        | Ilimitado (Growth+)              | Ilimitado (todos os planos)                    |
| **Base de leads embutida** | Sim (SuperSearch, 450M+)         | Não (só importação)                            |
| **Rede de warmup**         | 4,2M+ contas                     | Rede menor                                     |
| **Agente de resposta IA**  | Sim (responde em menos de 5 min) | Limitado                                       |
| **Entregabilidade**        | IP sharding + rotação (SISR)     | Volume variável que imita humano               |
| **Comportamento de envio** | Volume diário exato              | Variável (ex.: envia 22 quando configurado 25) |
| **API / webhooks**         | Bom                              | Excelente (API-first)                          |
| **White-label**            | Limitado                         | Completo                                       |
| **Integração Clay**        | Nativa                           | Nativa                                         |
| **Multicanal**             | Email + LinkedIn (beta)          | Foco em email                                  |

**Árvore de decisão:**

```
Precisa de base de leads embutida?
  SIM --> Instantly
  NÃO --> Continua

Agência ou white-label?
  SIM --> Smartlead
  NÃO --> Continua

Precisa de respostas IA automáticas?
  SIM --> Instantly
  NÃO --> Continua

Mais de 1.000/dia e controle por API?
  SIM --> Smartlead
  NÃO --> Continua

Quer setup e UI mais simples?
  SIM --> Instantly
  NÃO --> Smartlead
```

### Estágio 6: Follow-up com IA

A maioria das respostas não é "Sim, vamos marcar". São dúvidas, objeções ou interesse tímido. Follow-up com IA escala isso.

**Categorias de resposta:**

| Tipo                   | % das respostas | Ação IA                                |
| ---------------------- | --------------- | -------------------------------------- |
| Interesse positivo     | 25–35%          | Link de agendamento, confirmar horário |
| Pergunta sobre oferta  | 20–30%          | Responder com detalhes, novo CTA       |
| Objeção (timing)       | 15–20%          | Reconhecer, oferecer follow-up futuro  |
| Objeção (budget)       | 5–10%           | Dados de ROI, entrada menor            |
| Encaminhamento interno | 10–15%          | Agradecer, pedir intro ou email direto |
| Sem interesse          | 10–15%          | Agradecer, remover da sequência        |
| Auto-resposta / fora   | 5–10%           | Pausar, reenviar após retorno          |

**Setup de tratamento:**

1. Classificar intenção com IA
2. Rotear respostas positivas para humano ou link imediatamente
3. Gerar respostas contextuais para perguntas e objeções
4. Flag de revisão humana para casos-limite
5. Auto-remover "sem interesse" de todas as sequências (compliance)

O AI Reply Agent da Instantly faz isso nativamente em menos de 5 minutos. Usuários Smartlead costumam montar com Clay + webhooks.

---

## Framework de email frio em 3 linhas

Os cold emails com melhor performance em 2026 seguem: três linhas, menos de 80 palavras, zero enrolação.

```
Linha 1 (DOR): Observação específica sobre a situação.
               Derivada de sinal + pesquisa IA.
               NÃO "Está lutando com X?" (todo mundo manda isso).

Linha 2 (PROVA): Uma frase de credibilidade.
                 Resultado específico para empresa similar.
                 NÃO "Somos a plataforma líder em..."

Linha 3 (CTA): Pedido de baixo atrito.
               NÃO "Agende 30 minutos na minha agenda."
               SIM "Vale um olhar rápido?" ou "Aberto a saber mais?"
```

**Exemplo (bom):**

> Vi que fecharam a Série B e estão contratando 4 AEs — fazer ramp de tantos reps
> sem playbooks padronizados de outbound costuma significar 2–3 meses de pipeline desperdiçado.
>
> Ajudamos o time da Acme a reduzir o ramp de AE de 90 para 45 dias depois da Série B.
>
> Vale um olhar de 10 min em como?

**Exemplo (ruim):**

> Olá [Nome], espero que este email o encontre bem. Entro em contato porque notei que
> sua empresa está crescendo. Somos a plataforma líder de sales enablement confiada por mais de 500
> empresas. Adoraria agendar uma call de 30 minutos para discutir como ajudamos a
> escalar seu time de vendas. Terça às 14h funcionaria?

**Por que o ruim falha:**

- "Hope this finds you well" — gatilho de spam, zero valor
- Observação genérica — "crescendo" serve para qualquer um
- Prova egocêntrica — "líder" não é verificável
- CTA de alto atrito — 30 min de estranho é pedido grande
- Longo demais — fluff antes de qualquer valor

**Regras de anatomia:**

| Elemento       | Regra                                              | Por quê                                               |
| -------------- | -------------------------------------------------- | ----------------------------------------------------- |
| Assunto        | 2–5 palavras, minúsculas, sem pontuação            | Parece email interno                                  |
| Preview        | Primeiros 40 caracteres do corpo visíveis na caixa | Gancho visível                                        |
| Palavras       | 50–125                                             | Abaixo de 50 parece vazio; acima de 125 perde atenção |
| Parágrafos     | 1–2 frases                                         | Espaço em branco no mobile                            |
| Links          | Zero no primeiro email                             | Links acionam filtros                                 |
| Imagens        | Zero no primeiro email                             | Idem                                                  |
| Anexos         | Zero no primeiro email                             | Idem                                                  |
| Assinatura     | Nome + cargo + empresa só                          | Mínimo, sem banners                                   |
| CTA            | Um por email                                       | Vários CTAs reduzem resposta                          |
| Personalização | Primeiras 1–2 linhas                               | O resto genérico pode funcionar se o gancho pegar     |

---

Para benchmarks, playbook de entregabilidade, construção semana a semana, análise de custo, modos de falha e táticas avançadas leia `references/benchmarks-deliverability-tactics.md`.

## Exemplos

- **Usuário:** "Monte uma sequência de cold email para nosso SaaS" → **Resultado:** Agente reúne ICP e volume, recomenda framework de 3 linhas, sugere stack Instantly + Clay, entrega sequência de 5–7 toques com assuntos e espaçamento.
- **Usuário:** "Nossa taxa de resposta está baixa" → **Resultado:** Auditoria rápida (assunto, primeira linha, tamanho, CTA, palavras de spam), lacunas, depois testes A/B e enriquecimento para primeiras linhas específicas.
- **Usuário:** "Configure nossa infra de outreach" → **Resultado:** Pergunta contagem de domínios e volume, recomenda warmup (14–21 dias), matemática de caixas/domínios e passo a passo Instantly/Smartlead + Clay.

## Solução de problemas

- **Taxa de resposta baixa** → **Causa:** Primeiras linhas genéricas, sem targeting por sinal ou CTA fraco. **Correção:** Enriquecimento + uma observação específica na primeira linha; um único CTA de baixo atrito (responder ou call curta).
- **Entregabilidade / spam** → **Causa:** Envio rápido demais, saúde ruim do domínio ou gatilhos no texto. **Correção:** Warmup 14–21 dias; teto 25–30 envios/caixa/dia; sem links/imagens no primeiro toque; checagem anti-spam.
- **Reuniões não aparecem** → **Causa:** CTA grande demais ("agendar 30 min") ou sequência curta. **Correção:** CTA menor primeiro; estender para 5–7 toques com intervalo de 3–5 dias.

---

Para checklists, benchmarks e perguntas de discovery leia `references/quick-reference.md` quando precisar de referência detalhada.

---

## Skills relacionadas

- **ai-sdr** — Agentes SDR com IA que automatizam o fluxo completo de outreach
- **lead-enrichment** — Aprofundamento em waterfall, provedores e verificação
- **video-outreach** — Vídeo personalizado em sequências frias
- **sales-motion-design** — Desenho do motion de vendas que o outreach alimenta
- **gtm-engineering** — Infra técnica de outreach, APIs e pipelines de dados
- **solo-founder-gtm** — Playbooks enxutos para founders fazendo outbound
- **positioning-icp** — ICP e posicionamento antes de escalar outreach
- **content-to-pipeline** — Conteúdo como canal de aquecimento antes do cold
- **social-selling** — Vendas nativas no LinkedIn complementando email
