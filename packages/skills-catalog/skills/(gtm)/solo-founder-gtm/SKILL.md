---
name: solo-founder-gtm
description: "Use quando o usuário for fundador solo construindo seu motion de GTM, quiser escalar sem contratar ou precisar desenhar um time de agentes de IA para go-to-market. Use também quando o usuário mencionar 'solo founder', 'one-person startup', 'solopreneur', 'bootstrapped', 'no team', 'AI agents as team', 'scaling without hiring', 'founder-led sales', 'lean GTM', 'one-person company' ou 'no employees'. Esta skill cobre o playbook completo de GTM para fundador solo, desde escolha de stack até design do time de agentes, transições por estágio de receita, alocação de tempo e quando contratar de fato. NÃO use para implementação técnica, revisão de código ou arquitetura de software."
metadata:
  original_author: Chad Boyda / agent-gtm-skills
  modified_by: Felipe Rodrigues - github.com/felipfr
  source: https://github.com/chadboyda/agent-gtm-skills
  version: '1.0.0'
---

# GTM para fundador solo: playbook completo para escalar sem contratar

Você é especialista em estratégia go-to-market para fundador solo, design de time de agentes de IA, operações enxutas e distribuição liderada pelo fundador. Você entende o cenário 2025-2026 em que mais de um terço das novas startups é fundada por uma pessoa só e uma única pessoa com o stack certo pode chegar a US$ 100K+ MRR mais rápido do que um time de 20 pessoas há cinco anos. Você ajuda fundadores a escolher entre self-serve e sales-led, desenhar fluxos de agentes de IA que substituem contratações tradicionais, alocar o recurso mais escasso (tempo) e saber exatamente quando escalar sem pessoas deixa de funcionar.

## Antes de começar

Reúna este contexto antes de montar qualquer plano de GTM para fundador solo:

- O que o produto faz hoje? Um parágrafo, só features lançadas, sem roadmap.
- Qual a receita atual? MRR, número de clientes pagantes e tendência (crescendo, estável, caindo).
- Como os clientes acham o produto hoje? Orgânico, pago, outbound, indicação, comunidade ou misto.
- Qual o stack tecnológico atual? Liste cada ferramenta paga e cada gratuita em uso ativo.
- Quantas horas por semana o fundador gasta em GTM vs construir? A divisão real, não a aspiracional.
- Qual o ACV (valor anual do contrato) ou receita média por cliente?
- O produto é self-serve hoje ou toda venda exige call?
- O fundador tem audiência? Seguidores no X, conexões no LinkedIn, assinantes de newsletter, membros de comunidade.
- O que o fundador já tentou em GTM que não funcionou? Canais que falham informam tanto quanto os que funcionam.
- Qual a maior restrição do fundador agora? Tempo, dinheiro, habilidade técnica, distribuição ou outra coisa.

---

## 1. Gosto como fosso: por que julgamento vence headcount

A IA executa em escala. Escrever 100 cold emails, pesquisar 500 prospects, gerar 50 variações de anúncio. Tudo isso virou commodity. O fosso do fundador solo é julgamento: saber qual mercado entrar, qual mensagem ressoa, quais clientes priorizar e em quais sinais agir.

```
DELEGATE TO AI AGENTS              OWN PERSONALLY
+----------------------------+     +----------------------------+
| Research and data gathering|     | Strategic decisions         |
| First-draft writing        |     | Customer conversations      |
| Lead scoring and routing   |     | Pricing and packaging       |
| Email personalization      |     | Product direction           |
| Social media scheduling    |     | Partner relationships       |
| Competitive monitoring     |     | Brand voice and values      |
| Analytics and reporting    |     | Which market to enter next  |
| Data enrichment            |     | When to say no              |
| Basic customer support     |     | High-stakes sales calls     |
+----------------------------+     +----------------------------+
```

A regra: se a tarefa exige gosto, contexto de mercado ou capital de relacionamento, você faz. Se exige throughput, reconhecimento de padrão ou execução repetitiva, um agente de IA faz.

---

## 2. O stack da startup de uma pessoa

| Função                | Ferramenta recomendada         | Custo mensal        | Por esta                                          |
| --------------------- | ------------------------------ | ------------------- | ------------------------------------------------- |
| CRM                   | Attio ou Folk                  | US$ 0-30            | Leve, API-friendly, sem inchado enterprise        |
| Email outreach        | Instantly ou Smartlead         | US$ 30-97           | Rotação multi-inbox, warmup incluso               |
| Enriquecimento        | Clay (Starter) ou Apollo Free  | US$ 0-149           | Clay para waterfall, Apollo para lookups básicos  |
| Personalização com IA | Claude API ou GPT API          | US$ 20-50           | Personalização por mensagem em escala             |
| Landing pages         | Framer ou Carrd                | US$ 0-24            | Publicar em horas, não semanas                    |
| Analytics             | PostHog ou Plausible           | US$ 0               | PostHog para produto, Plausible para web          |
| Agendamento           | Cal.com ou Calendly Free       | US$ 0               | Cal.com é open source e self-hostable             |
| Pagamentos            | Stripe                         | 2,9% + US$ 0,30/txn | Padrão, confiável, ótima API                      |
| Suporte               | Crisp Free ou Intercom Starter | US$ 0-39            | Crisp para widget, Intercom se precisar bot de IA |
| Automação             | n8n (self-hosted) ou Make      | US$ 0-30            | n8n para controle total, Make para fluxos visuais |
| Coding com IA         | Cursor ou Claude Code          | US$ 20-40           | Entregar features sem time de dev                 |
| Conteúdo              | Claude ou Notion AI            | US$ 0-20            | Rascunhos longos, reuso, pesquisa                 |
| Social scheduling     | Buffer ou Typefully            | US$ 0-15            | Typefully nativo para X                           |
| Email marketing       | Loops ou Resend                | US$ 0-25            | Transacional + marketing friendly a devs          |
| **Total**             |                                | **US$ 50-450/mês**  |                                                   |

### Escolha de stack por motion de GTM

```
Product-Led (self-serve) --> Analytics (PostHog), Landing page (Framer),
                             Email marketing (Loops), Support (Crisp)

Outbound-Led (sales calls) --> Enrichment (Clay), Outreach (Instantly),
                               CRM (Attio), Scheduling (Cal.com)

Content-Led (audience-first) --> Content AI (Claude), Social (Typefully),
                                 Email marketing (Loops), Analytics (Plausible)

Community-Led --> Community platform (Discord/Circle),
                  Content AI (Claude), Email (Loops), CRM (Folk)
```

### Anti-padrões de stack

| Anti-padrão                      | Por que machuca                                                 | O que fazer                            |
| -------------------------------- | --------------------------------------------------------------- | -------------------------------------- |
| Salesforce ou HubSpot Enterprise | US$ 150+/mês, 80% das features sem uso, semanas para configurar | Attio ou Folk a US$ 0-30/mês           |
| Ferramentas internas pré-PMF     | Tempo de engenharia que deveria ir ao produto                   | Ferramentas prontas até US$ 50K+ MRR   |
| Contrato anual cedo demais       | Trava gasto antes de saber o que funciona                       | Mensal até a ferramenta provar crítica |
| 15+ ferramentas ao mesmo tempo   | Custo de troca de contexto supera o valor                       | Teto de 8-10 ferramentas core          |

---

## 3. Playbook por estágio de receita

A estratégia de GTM muda a cada marco de receita. O que funciona a US$ 0 MRR prejudica ativamente a US$ 50K MRR.

### Estágio 1: US$ 0-1K MRR (validação)

**Objetivo**: Achar 10 pessoas que pagam. Nada mais importa.
**Divisão de tempo**: 40% conversas com clientes, 40% construir, 20% conteúdo.

- 20 DMs por dia no X ou LinkedIn com quem casa com sua hipótese.
- Cobrar desde o dia um. Usuários grátis dão feedback ruim. Mesmo US$ 9/mês filtra necessidade real.
- Construir o mínimo que resolve uma dor real. Uma feature, não uma plataforma.
- Rastrear quem diz "preciso disso" vs "isso é interessante". Só conta "preciso disso".
- Não automatizar nada ainda. Processos manuais revelam o que importa.
- **Pule**: sequências outbound, anúncios pagos, SEO, parcerias, funis complexos.

### Estágio 2: US$ 1K-10K MRR (tração)

**Objetivo**: Achar um canal de aquisição repetível.
**Divisão de tempo**: 50% distribuição, 30% construir, 20% conversas com clientes.

- Teste 2-3 canais ao mesmo tempo. Dê 30 dias e US$ 500 (ou tempo equivalente) a cada um.
- Comece a construir em público. Compartilhe métricas, lições e bastidores.
- Monte outbound básico se o ACV suportar. 50 emails personalizados por semana com Clay + Instantly.
- Documente cada negócio: objeções, gatilhos de compra, menções a concorrentes. Vira playbook de vendas.
- Implante Research Agent e Writing Agent (veja Seção 5).
- **Pule**: contratar, automações complexas, features enterprise, planos anuais.

### Estágio 3: US$ 10K-50K MRR (escalar a máquina)

**Objetivo**: Sistematizar o que funciona e implantar agentes de IA para multiplicar saída.
**Divisão de tempo**: 30% sistemas/automação, 30% distribuição, 25% produto, 15% estratégia.

- Implante o time completo de agentes de IA para canais comprovados.
- Produza conteúdo em lote semanalmente, reuse canais, agende com IA.
- Suba preços. A maioria dos fundadores solo subprecifica 2-3x neste estágio.
- Introduza planos anuais. Ofereça 2 meses grátis no compromisso anual.
- Comece a avaliar primeira contratação (veja Seção 7).
- **Pule**: vendas enterprise, integrações custom, RBAC complexo, tiers de suporte dedicados.

### Estágio 4: US$ 50K-100K+ MRR (alavancagem do fundador)

**Objetivo**: Maximizar receita por hora do fundador. Decidir entre contratar ou permanecer solo.
**Divisão de tempo**: 30% estratégia, 25% distribuição, 25% produto, 20% gestão de time.

- Cada hora deve gerar US$ 200+ em valor. Audite sem piedade.
- Considere fractional ou PJ antes de CLT.
- Marca pessoal vira canal real de distribuição. Invista 5-10 h/semana.
- Construa fossos: integrações, efeitos de rede de dados, comunidade, custo de troca.
- Faça revisões trimestrais de posicionamento. Nesta receita, concorrentes notam você.

---

## 4. Framework self-serve vs calls de vendas

É a decisão de maior alavancagem do fundador solo. O motion errado desperdiça meses.

| Fator                   | Ir self-serve                  | Ir sales-led                           | Híbrido                              |
| ----------------------- | ------------------------------ | -------------------------------------- | ------------------------------------ |
| ACV                     | Abaixo de US$ 1.000/ano        | Acima de US$ 5.000/ano                 | US$ 1.000-5.000/ano                  |
| Complexidade de setup   | Menos de 5 min até valor       | Exige config ou treino                 | 15-30 min de setup                   |
| Tipo de comprador       | IC, desenvolvedor              | VP/Diretor, precisa aprovação          | Gestor, pode colocar na despesa      |
| Complexidade do produto | Caso de uso único, valor óbvio | Fluxos multi-stakeholder               | Valor claro, ganha com orientação    |
| Competição              | Lotado, diferenciar em UX      | Poucos players, diferenciar em outcome | Moderada, diferenciar em velocidade  |
| Seu tempo               | Não pode fazer calls de vendas | 10+ h/semana em calls                  | 5-10 h/semana em calls de alto valor |

### Checklist de prontidão self-serve

- [ ] Um novo usuário obtém valor em menos de 5 minutos sem falar com ninguém?
- [ ] O preço é simples o bastante para não precisar explicação?
- [ ] Dá para mostrar o valor do produto em vídeo de 60 segundos?
- [ ] O comprador está autorizado a gastar esse valor sem aprovação?
- [ ] Dá para escalar suporte com docs + chatbot de IA?

Se alguma resposta for "não", você precisa de pelo menos camada de sales-assist.

### Teto de vendas lideradas pelo fundador

| Métrica                     | Teto fundador solo | Alerta vermelho                            |
| --------------------------- | ------------------ | ------------------------------------------ |
| Discovery calls por semana  | 10-15              | Calendário 60%+ calls                      |
| Negócios ativos no pipeline | 20-30              | Negócios escorregam por falta de follow-up |
| Ciclo de vendas             | 30-45 dias         | Esticando para 60+ dias                    |
| Receita sales-led           | US$ 30-50K MRR     | Crescimento estagna com pipeline cheio     |

Quando bater nesses limites, veja Seção 7: quando fazer a primeira contratação em GTM.

---

## 5. Time de agentes de IA: seu organograma de GTM

```
                    +------------------+
                    |   YOU (Founder)  |
                    |  Strategy, Voice |
                    |  Relationships   |
                    +--------+---------+
                             |
            +----------------+----------------+
            |                |                |
    +-------v------+  +-----v--------+  +----v---------+
    | RESEARCH     |  | WRITING      |  | OUTREACH     |
    | AGENT        |  | AGENT        |  | AGENT        |
    | Clay + Claude|  | Claude API   |  | Instantly    |
    | Apollo       |  | Typefully    |  | + Clay       |
    +-------+------+  +-----+--------+  +----+---------+
            |                |                |
    +-------v------+  +-----v--------+  +----v---------+
    | ANALYTICS    |  | SUPPORT      |  | SCHEDULING   |
    | AGENT        |  | AGENT        |  | AGENT        |
    | PostHog      |  | Crisp AI     |  | Cal.com      |
    | Claude       |  | + Claude     |  | + Zapier     |
    +--------------+  +--------------+  +--------------+
```

### Definições de agentes

| Agente     | Ferramentas                 | Fluxo                                                                                                  | Saída                             | Tempo economizado |
| ---------- | --------------------------- | ------------------------------------------------------------------------------------------------------ | --------------------------------- | ----------------- |
| Research   | Clay, Apollo, Claude API    | Identificar prospect > Enriquecer > Pontuar ICP > Achar decisor > Contexto para personalização         | Prospect enriquecido com brief    | 15-20 h/sem       |
| Writing    | Claude API, Typefully       | Puxar tema > Rascunhar na voz do fundador > Variações > Fila para revisão > Agendar                    | 5-10 posts/sem, 1-2 longos/mês    | 8-12 h/sem        |
| Outreach   | Instantly, Clay, Claude API | Receber brief > Personalizar primeira linha > Escolher template > Enviar sequência > Sugerir respostas | 200-500 emails personalizados/sem | 20+ h/sem         |
| Analytics  | PostHog, Claude API, n8n    | Puxar métricas > Comparar médias > Sinalizar anomalias > Resumo                                        | Brief diário, relatório semanal   | 5-8 h/sem         |
| Support    | Crisp AI, Claude API        | Classificar > Consultar base > Auto-responder ou escalar                                               | 60-80% tickets sem você           | 10-15 h/sem       |
| Scheduling | Cal.com, Zapier, CRM        | Detectar intenção > Enviar link > Confirmar > Doc pré-reunião > Lembrete                               | Zero ida e volta de agenda        | 3-5 h/sem         |

### Prioridade de implantação e custo

| Prioridade        | Agente     | Implantar em | Custo mensal        |
| ----------------- | ---------- | ------------ | ------------------- |
| 1                 | Research   | US$ 1K MRR   | US$ 60-170          |
| 2                 | Writing    | US$ 1K MRR   | US$ 15-45           |
| 3                 | Outreach   | US$ 5K MRR   | US$ 40-117          |
| 4                 | Analytics  | US$ 10K MRR  | US$ 5-10            |
| 5                 | Support    | US$ 10K MRR  | US$ 10-59           |
| 6                 | Scheduling | US$ 15K MRR  | US$ 0-5             |
| **Time completo** |            |              | **US$ 130-406/mês** |

Comparado a contratar: um SDR júnior custa US$ 4.000-6.000/mês carregado. O time de agentes custa menos de US$ 500/mês e trabalha 24/7.

---

## 6. Construir em público e marca pessoal como distribuição

Marca pessoal é o canal de aquisição mais barato e com melhor conversão para fundador solo. Sua audiência confia em você antes do produto. Cada post é distribuição grátis.

### Cadência de conteúdo

| Tipo                              | Frequência | Plataforma        | Tempo     | Objetivo                        |
| --------------------------------- | ---------- | ----------------- | --------- | ------------------------------- |
| Posts curtos (insights, lições)   | Diário     | X, LinkedIn       | 15-20 min | Visibilidade, confiança         |
| Thread ou post longo              | 2x/semana  | X, LinkedIn       | 30-45 min | Demonstrar expertise            |
| Newsletter                        | Semanal    | Email             | 1-2 h     | Audiência própria (não alugada) |
| Update de produto                 | Quinzenal  | X, LinkedIn, blog | 30 min    | Mostrar tração                  |
| Post de transparência de métricas | Mensal     | X, LinkedIn       | 20 min    | Confiança pela honestidade      |

### O que compartilhar vs manter privado

| Compartilhe à vontade                   | Mantenha privado                            |
| --------------------------------------- | ------------------------------------------- |
| Marcos de receita e taxa de crescimento | Nomes de clientes específicos sem permissão |
| Lições de fracassos                     | Vulnerabilidades técnicas                   |
| Decisões de produto e raciocínio        | Mecânica exata de precificação              |
| Stack e fluxos de trabalho              | Vantagens competitivas não lançadas         |
| Temas de feedback de clientes           | Dados individuais de clientes               |

### Comunidade como fosso

| Estágio       | Canal                                    | Por quê                                     |
| ------------- | ---------------------------------------- | ------------------------------------------- |
| US$ 0-5K MRR  | Engajamento X/LinkedIn + DMs             | Baixo overhead, alto sinal                  |
| US$ 5-20K MRR | Grupo Discord ou Slack                   | Acesso direto a power users                 |
| US$ 20K+ MRR  | Plataforma dedicada (Circle, Bettermode) | Comunidade própria com conteúdo estruturado |

Uma comunidade saudável tem 40%+ conversas membro-a-membro (não o fundador respondendo tudo), pedidos de feature acionáveis regulares e indicações orgânicas crescendo. Se a comunidade consome 15+ h/semana, o ROI virou negativo.

---

## 7. Quando fazer a primeira contratação em GTM

Não contrate só por receita. Contrate por restrições e custo de oportunidade.

### Sinais de que precisa contratar

| Sinal                             | Como se parece                              | Urgência |
| --------------------------------- | ------------------------------------------- | -------- |
| Receita deixando na mesa          | Leads qualificados esfriando, sem follow-up | Alta     |
| Gargalo do fundador em vendas     | Pipeline cheio, taxa de fechamento caindo   | Alta     |
| Burnout se aproximando            | 65+ h/semana por 3+ meses                   | Alta     |
| Churn por gaps de suporte         | Clientes saindo citando resposta lenta      | Alta     |
| Suporte consumindo tempo de build | 10+ h/semana em suporte                     | Média    |

### Sinais de que NÃO precisa contratar

| Sinal                               | O que fazer em vez disso                        |
| ----------------------------------- | ----------------------------------------------- |
| "Já era para ter time"              | Ignore. O que importa é receita por pessoa.     |
| Um mês lento                        | Diagnostique causa raiz, não contrate no pânico |
| Pedidos de feature acumulando       | Priorize sem piedade, construa menos            |
| Pressão de investidor por headcount | Levante com métricas, não tamanho de time       |

### Tabela da primeira contratação

| Gargalo                    | Contrate                         | Custo            | Alternativa                                |
| -------------------------- | -------------------------------- | ---------------- | ------------------------------------------ |
| Calls de vendas e pipeline | Fractional AE (part-time closer) | US$ 2-4K/mês     | Agente SDR de IA + seu fechamento          |
| Volume de conteúdo         | Redator freelancer               | US$ 1-3K/mês     | Agente de writing + sua edição             |
| Suporte ao cliente         | Suporte part-time                | US$ 1,5-3K/mês   | Agente de suporte + escalação              |
| Velocidade de engenharia   | Dev contratado                   | US$ 3-8K/mês     | Ferramentas de coding com IA + sua direção |
| Operações e admin          | Assistente virtual               | US$ 500-1,5K/mês | Automação + agentes de IA                  |

### Framework de limiar de receita

| Receita         | Tamanho do time                        | Lógica                                 |
| --------------- | -------------------------------------- | -------------------------------------- |
| US$ 0-10K MRR   | Solo + agentes de IA                   | Cada dólar para produto e distribuição |
| US$ 10-30K MRR  | Solo + 1-2 PJ                          | Ajuda fractional no maior gargalo      |
| US$ 30-50K MRR  | Solo + 1 CLT ou 3-4 PJ                 | Aguenta US$ 4-6K/mês para um papel     |
| US$ 50-100K MRR | 2-3 pessoas no total                   | Fundador + engenheiro + GTM            |
| US$ 100K+ MRR   | Monte o time alinhado ao motion de GTM | Receita sustenta organograma real      |

---

## 8. Features enterprise para pular

Fundadores solo perdem meses construindo features que compradores enterprise exigem mas que geram zero receita antes do PMF.

| Feature             | Pule até                                  | Por quê                                            |
| ------------------- | ----------------------------------------- | -------------------------------------------------- |
| SAML/SSO            | US$ 50K MRR ou primeiro enterprise exigir | Semanas de dev, zero SMB se importa                |
| RBAC complexo       | US$ 30K MRR                               | Admin/membro basta para 95% dos primeiros clientes |
| Compliance SOC 2    | US$ 50K MRR ou pipeline enterprise exigir | US$ 20-50K e 3-6 meses                             |
| SLAs customizados   | US$ 50K MRR                               | Não garanta uptime que não mede                    |
| Integrações custom  | Negócio por ACV maior que US$ 10K         | Integre o padrão primeiro                          |
| Fatura anual com PO | US$ 30K MRR                               | Fatura manual funciona com poucos negócios         |
| Audit logs          | US$ 50K MRR                               | Feature de compliance enterprise                   |
| White-label         | Nunca (a menos que SEJA o produto)        | Complexidade enorme para demanda rara              |

**Construa em vez disso**: Onboarding trivial (menos de 2 min), uma integração matadora com a ferramenta onde seu ICP vive, documentação excelente, webhook/API para power users e billing usage-based via Stripe. Isso entrega em dias e move ativação, retenção e receita.

---

## 9. Processo de vendas liderado pelo fundador

```
QUALIFY (5 min): ICP match? Can afford price? Has the problem?
  --> No: politely decline, refer elsewhere
  --> Yes: proceed

DISCOVER (15-20 min): Current state, cost of status quo,
  desired state, buying committee, timeline

DEMO (15-20 min, same call): Show the specific workflow
  that solves their stated pain. Skip unasked features.
  End with plan and price.

CLOSE (5 min): State price clearly. Offer money-back guarantee.
  If they need time, set follow-up date (never "let me know").

ONBOARD (async, 30 min): Guide within 1 hour. Setup call if
  needed. Check in at day 3 and day 7.
```

### Metas de velocidade de vendas

| Métrica            | Alvo                                 | Alerta vermelho       |
| ------------------ | ------------------------------------ | --------------------- |
| Calls até fechar   | Menos de 3                           | Mais de 5 por negócio |
| Ciclo de vendas    | Menos de 14 dias                     | Mais de 30 dias       |
| Taxa de fechamento | 25-40% de oportunidades qualificadas | Menos de 15%          |
| No-show            | Menos de 15%                         | Mais de 30%           |

Documente cada conversa: log de objeções, frases que ganham, padrões que perdem, reação a preço, menções a concorrentes. Este playbook vira manual de treino da primeira contratação em vendas.

---

## Exemplos

- **Usuário diz:** "Sou fundador solo, como faço GTM?" → **Resultado:** O agente pergunta MRR e ACV, recomenda divisão de tempo (ex. 40% conversas, 40% construir em US$ 0–1K MRR), sugere stack US$ 50–450/mês e ordem de implantação dos agentes (Research → Writing → Outreach → …) e limita calls a 10–15/semana.
- **Usuário diz:** "Quando contrato minha primeira pessoa de vendas?" → **Resultado:** O agente usa limiares do Quick Reference (primeiro PJ US$ 10–30K MRR, primeiro CLT US$ 30–50K MRR), pergunta pipeline e capacidade de negócios e sugere o que sistematizar antes de contratar.
- **Usuário diz:** "Quais ferramentas um fundador solo deve usar?" → **Resultado:** O agente recomenda no máximo 8–10 ferramentas, mapeia por função (CRM, enriquecimento, envio, conteúdo, analytics) e sugere faixa de orçamento e cadência de conteúdo (post curto diário + newsletter semanal).

## Solução de problemas

- **Sem tempo para construir e vender** → **Causa:** Sem guardrails ou canais demais. **Correção:** Bloco manhã 3–4 h de trabalho profundo; limite calls a 10–15/semana; foque um canal de aquisição até converter.
- **Negócios escorregando ou no-shows** → **Causa:** Negócios ativos demais ou qualificação fraca. **Correção:** Limite 20–30 ativos; aperte ICP e qualificação; use log de objeções para melhorar mensagem.
- **Receita por hora do fundador estagnada** → **Causa:** ACV baixo ou alto toque sem alavancagem. **Correção:** Mirar US$ 100+/h; adicione self-serve ou motion product-led se o ACV permitir; automatize outreach e conteúdo com agentes de IA.

---

## Referência rápida

| Conceito                             | Número ou regra-chave                                            |
| ------------------------------------ | ---------------------------------------------------------------- |
| Custo total do stack (fundador solo) | US$ 50-450/mês                                                   |
| Custo do time de agentes de IA       | US$ 130-406/mês para os seis agentes                             |
| Equivalente a um SDR contratado      | US$ 4.000-6.000/mês carregado                                    |
| Divisão de tempo em US$ 0-1K MRR     | 40% conversas, 40% construir, 20% conteúdo                       |
| Divisão em US$ 10-50K MRR            | 30% sistemas, 30% distribuição, 25% produto, 15% estratégia      |
| Teto ACV self-serve                  | Abaixo de US$ 1.000/ano                                          |
| Piso ACV sales-led                   | Acima de US$ 5.000/ano                                           |
| Limiar primeiro PJ                   | US$ 10-30K MRR                                                   |
| Limiar primeiro CLT                  | US$ 30-50K MRR                                                   |
| Limiar para pular SOC 2              | US$ 50K MRR ou enterprise exigir                                 |
| Máximo de ferramentas no stack       | 8-10 antes de retornos decrescentes                              |
| Cadência mínima de conteúdo          | Post curto diário + newsletter semanal                           |
| Teto de calls de vendas (solo)       | 10-15/semana antes da queda de qualidade                         |
| Teto de negócios ativos (solo)       | 20-30 antes de escorregar                                        |
| Meta receita por hora do fundador    | US$ 100+ e crescendo                                             |
| Teto de churn mensal (SMB)           | Menos de 5%                                                      |
| Ordem de implantação de agentes      | Research > Writing > Outreach > Analytics > Support > Scheduling |
| Bloco manhã de trabalho profundo     | 3-4 h, sem reuniões, sem interrupções                            |

---

## Perguntas a fazer

1. Qual seu MRR atual e quantos clientes pagantes você tem?
2. Como os clientes te encontram hoje e qual canal converte melhor?
3. Quantas horas por semana você gasta de fato em GTM vs construir?
4. Qual seu ACV e toda venda exige conversa?
5. Você tem audiência em alguma plataforma? Quão grande e engajada?
6. O que você já tentou em aquisição que não funcionou?
7. Qual seu maior consumidor de tempo por semana que não é construir ou vender diretamente?
8. Você está queimando poupança, gerando receita ou tem funding?
9. Quanto custa seu stack de ferramentas por mês?
10. Quando perde um negócio ou um cliente churna, qual motivo eles dão?
11. Você documentou processo de vendas e respostas a objeções?
12. Você constrói em público? Se sim, que conteúdo performa melhor?
13. Qual processo manual você repete mais de 3 vezes por semana?
14. Em que ponto você consideraria a primeira contratação e para qual papel?
15. Qual a coisa de maior alavancagem que você poderia fazer esta semana e não está fazendo?

---

## Skills relacionadas

| Skill               | Quando cruzar referência                                                           |
| ------------------- | ---------------------------------------------------------------------------------- |
| gtm-engineering     | Ao construir fluxos automatizados, orquestração de agentes e pipelines de dados    |
| ai-cold-outreach    | Ao configurar o agente de outreach com sequências personalizadas                   |
| ai-sdr              | Ao desenhar o fluxo completo de SDR com IA da identificação do lead ao agendamento |
| lead-enrichment     | Ao montar o waterfall de enriquecimento do agente de pesquisa e qualidade de dados |
| content-to-pipeline | Ao converter conteúdo e audiência em pipeline mensurável                           |
| social-selling      | Ao construir estratégia de marca pessoal e fluxos de social selling                |
| gtm-metrics         | Ao escalar além de US$ 50K MRR e precisar de frameworks de métricas                |
| ai-pricing          | Ao definir ou ajustar preços para self-serve vs sales-led                          |
| positioning-icp     | Ao definir ICP e posicionamento com pouca banda de pesquisa                        |
| sales-motion-design | Ao formalizar vendas lideradas pelo fundador em motion repetível                   |
| expansion-retention | Quando NRR vira alavanca de crescimento a US$ 30K+ MRR                             |
| partner-affiliate   | Ao construir canais de parceiros para escalar distribuição sem contratar           |
