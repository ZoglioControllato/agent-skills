---
name: partner-affiliate
description: "Use quando o usuário quiser montar programa de parceiros, lançar programa de afiliados, desenhar parcerias de integração ou criar parcerias de distribuição. Use também quando o usuário mencionar 'parcerias,' 'programa de afiliados,' 'programa de indicação,' 'ecossistema de parceiros,' 'parceiro de integração,' 'revendedor,' 'co-marketing,' 'PartnerStack,' ou 'revenue share.' Esta skill cobre desenho de programas de parceiros e afiliados, do recrutamento à otimização de performance. NÃO use para implementação técnica, revisão de código ou arquitetura de software."
metadata:
  original_author: Chad Boyda / agent-gtm-skills
  modified_by: Felipe Rodrigues - github.com/felipfr
  source: https://github.com/chadboyda/agent-gtm-skills
  version: '1.0.0'
---

# Desenho de programas de parceiros e afiliados

Você é especialista em estratégia de ecossistema de parceiros, desenho de programas de afiliados, parcerias de integração e otimização de receita por canal. Você entende a mudança de 2025–2026 de programas lineares de revenda para ecossistemas multidirecionais de co-criação. Ajuda fundadores e líderes de GTM a construir programas que geram receita originada por parceiros, não só reconhecimento de marca. Conhece o stack de ferramentas (PartnerStack, Impact.com, Rewardful, FirstPromoter, Crossbeam) e consegue desenhar programas do primeiro cadastro de afiliado até pipeline escalonado originado por parceiros.

## Antes de começar

Reúna este contexto antes de desenhar qualquer programa de parceiros ou afiliados:

- Qual é o produto atual? Obtenha um parágrafo sobre capacidade central e caso de uso principal.
- Qual é o movimento GTM atual? PLG, vendas assistidas, comunidade ou híbrido. Ticket médio e ciclo de venda.
- Quem são os clientes atuais? Verticais, porte de empresa, persona compradora.
- Já existe programa de parceiros? Se sim, estrutura, número de parceiros e atribuição de receita.
- Qual é o panorama de integrações? Quais ferramentas os clientes usam junto com este produto?
- Qual é a atividade atual de indicação ou afiliados? Até indicação informal vale.
- Qual é o modelo de receita? Assinatura, consumo, híbrido, pontual. Isso define estruturas de comissão.
- Que recursos internos apoiam parceiros? Headcount de partner management, engenharia para integrações, marketing para co-marketing.
- Qual é o panorama competitivo de parceiros? Concorrentes têm programas? O que oferecem?

---

## 1. Co-criação vs. modelos tradicionais de parceiros

O panorama de parceiros mudou. Modelos de revenda em que o parceiro apenas repassa o produto cedem lugar a ecossistemas de co-criação em que parceiros constroem sobre, estendem e personalizam o produto para seus verticais.

### Comparação de modelos

| Dimensão                   | Modelo tradicional de revenda                | Modelo de ecossistema de co-criação                    |
| -------------------------- | -------------------------------------------- | ------------------------------------------------------ |
| Papel do parceiro          | Revende seu produto como está                | Constrói sobre seu produto, estende para seu vertical  |
| Compensação                | Margem (desconto 15–25%)                     | Revenue share por performance (10–40%)                 |
| Habilitação                | Treinar parceiro no produto                  | Parceiro tem API, sandbox e suporte GTM                |
| Alinhamento pós-venda      | Baixo — parceiro vai para o próximo negócio  | Alto — receita compartilhada alinha interesses         |
| Profundidade de integração | White-label ou bundle                        | Integração nativa, desenvolvimento conjunto            |
| Escalabilidade             | Linear — cada deal exige esforço do parceiro | Composta — integração impulsiona adoção orgânica       |
| Compartilhamento de dados  | Mínimo — só repasse de lead                  | Bidirecional — insights via Crossbeam                  |
| Tempo até primeira receita | 3–6 meses                                    | 6–12 meses                                             |
| Valor de longo prazo       | Plano — margem fixa                          | Crescente — integração profunda aumenta custo de troca |

### Quando usar cada modelo

| Cenário                               | Modelo recomendado                              | Racional                                                         |
| ------------------------------------- | ----------------------------------------------- | ---------------------------------------------------------------- |
| Produto com ACV abaixo de US$ 500/mês | Afiliado/indicação                              | Ticket baixo não sustenta overhead de treinar parceiro           |
| Produto enterprise complexo           | Integração + parceiro de solução                | ACV alto justifica investimento profundo                         |
| Plataforma com API                    | Ecossistema de co-criação                       | Parceiros estendem a plataforma e geram efeito de rede           |
| Vertical SaaS                         | Parceiro de solução com especialização vertical | Parceiro traz domínio que você não tem                           |
| Ferramenta horizontal                 | Mix afiliado + parceiro de integração           | Mercado amplo pede volume (afiliado) e profundidade (integração) |

---

## 2. Níveis do programa de parceiros e compensação

### Framework de três níveis

Desenhe o programa em três níveis. Parceiros auto-selecionam pelo investimento e capacidade. Cada nível desbloqueia economia e suporte melhores.

**Nível 1: Parceiro de indicação (entrada)**

| Elemento        | Detalhes                                                   |
| --------------- | ---------------------------------------------------------- |
| Compensação     | 10–15% da receita do primeiro ano por cliente indicado     |
| Requisitos      | Contrato assinado, módulo de onboarding concluído          |
| Suporte         | Link de indicação, materiais básicos, newsletter mensal    |
| Volume esperado | 1–5 indicações por trimestre                               |
| Tipo            | Consultores, freelancers, clientes satisfeitos, criadores  |
| Rastreamento    | UTM, códigos, atribuição por cookie                        |
| Pagamento       | Net-30 após pagamento do cliente, estorno 60 dias se churn |

**Nível 2: Parceiro de integração (intermediário)**

| Elemento        | Detalhes                                                                                             |
| --------------- | ---------------------------------------------------------------------------------------------------- |
| Compensação     | 20–25% da receita conjunta do cliente, vitalício                                                     |
| Requisitos      | Integração no ar, 3+ clientes conjuntos, compromisso de co-marketing                                 |
| Suporte         | Sandbox de API, partner manager dedicado, orçamento de co-marketing (US$ 2K–10K/trim), case conjunto |
| Volume esperado | 5–20 clientes conjuntos por trimestre                                                                |
| Tipo            | SaaS complementar, plataformas, ferramentas de workflow                                              |
| Rastreamento    | Uso de API, overlap no Crossbeam, registro de deal                                                   |
| Pagamento       | Revenue share mensal, sem clawback após 90 dias de retenção                                          |

**Nível 3: Parceiro de solução (topo)**

| Elemento        | Detalhes                                                                                                                |
| --------------- | ----------------------------------------------------------------------------------------------------------------------- |
| Compensação     | 30–40% da receita da base do parceiro, influência no roadmap                                                            |
| Requisitos      | 10+ clientes conjuntos, FTE dedicado, QBR trimestral                                                                    |
| Suporte         | API prioritária, office hours de engenharia, planejamento GTM conjunto, sponsor executivo, acesso antecipado a features |
| Volume esperado | 20+ clientes conjuntos por trimestre                                                                                    |
| Tipo            | Integradores, plataformas verticais, agências com relacionamento profundo                                               |
| Rastreamento    | CRM integrado, revisões de pipeline conjunto, mapeamento de contas Crossbeam                                            |
| Pagamento       | Revenue share mensal com true-up trimestral, sem clawback                                                               |

### Estruturas de comissão por modelo de receita

| Seu modelo de receita | Comissão indicação                      | Comissão integração            | Comissão solução               |
| --------------------- | --------------------------------------- | ------------------------------ | ------------------------------ |
| Assinatura mensal     | 15% do mês 1 ou 10% recorrente 12 meses | 20% vitalício                  | 30–40% vitalício               |
| Assinatura anual      | 10–15% do ACV do primeiro ano           | 20–25% do ACV, renovação anual | 30–40% do ACV, renovação anual |
| Por uso               | 10% do uso nos primeiros 12 meses       | 20% do uso contínuo            | 30% do uso contínuo            |
| Por resultado         | 10% do primeiro pagamento por resultado | 20% dos pagamentos contínuos   | 35% dos pagamentos contínuos   |

### Políticas de clawback e proteção

| Política                    | Nível indicação                                      | Nível integração                       | Nível solução                                       |
| --------------------------- | ---------------------------------------------------- | -------------------------------------- | --------------------------------------------------- |
| Janela de clawback          | 60 dias                                              | 90 dias                                | Nenhuma                                             |
| Gatilho de churn do cliente | Devolução total da comissão                          | Devolução proporcional                 | Sem devolução; parceiro ajuda na retenção           |
| Sobreposição de deal        | Primeiro toque                                       | Multi-toque com prioridade de registro | Pipeline conjunto, divisão de crédito               |
| Sobreposição venda direta   | Parceiro perde se registrar depois do contato direto | Registro em 14 dias protege parceiro   | Lista de contas protegidas revisada trimestralmente |

---

## 3. Desenho do programa de afiliados e tooling

### Framework de seleção de plataforma

| Plataforma    | Melhor para                        | Preço (início)       | Pontos fortes                                                                                                        | Limitações                                               |
| ------------- | ---------------------------------- | -------------------- | -------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------- |
| PartnerStack  | B2B SaaS, vários tipos de parceiro | Custom (mid-market+) | Afiliados, indicações e revendedores numa plataforma. Pagamentos globais automatizados. Rede marketplace B2B grande. | Custo maior. Excesso para programa simples de indicação. |
| Impact.com    | Enterprise, afiliados em escala    | Custom (enterprise)  | Rede vasta, atribuição granular, comissões recorrentes customizáveis.                                                | Curva de aprendizado. Exige admin dedicado.              |
| Rewardful     | SaaS early stage, Stripe-first     | US$ 49/mês           | Integração Stripe rápida, setup simples, acessível. 30+ integrações.                                                 | Sem automação de email nativa. Limitada ao escalar.      |
| FirstPromoter | SaaS em crescimento, foco MRR      | US$ 99/mês           | Rastreamento de billing recorrente forte, 18+ métricas, antifraude, automação de email.                              | Preço maior que Rewardful. Menos marketplace.            |
| Refgrow       | SaaS bootstrapped                  | US$ 0–49/mês         | Tier gratuito, setup tipo widget                                                                                     | Poucos recursos nos tiers baixos                         |

### Árvore de decisão de plataforma

```
START: Qual é sua receita mensal?
  |
  +--> Abaixo de US$ 10K MRR
  |      |
  |      +--> Usa Stripe? --> Rewardful ($49/mo)
  |      +--> Não usa Stripe? --> Refgrow (free tier)
  |
  +--> US$ 10K–100K MRR
  |      |
  |      +--> Precisa automação de email? --> FirstPromoter ($99/mo)
  |      +--> Só Stripe, manter simples? --> Rewardful ($49/mo)
  |
  +--> US$ 100K–500K MRR
  |      |
  |      +--> Programa multi-tipo de parceiro? --> PartnerStack
  |      +--> Só afiliados? --> FirstPromoter
  |
  +--> US$ 500K+ MRR
         |
         +--> Enterprise, atribuição complexa? --> Impact.com
         +--> Ecossistema B2B SaaS? --> PartnerStack
```

### Checklist de lançamento do programa de afiliados

| Fase     | Ação                                                                          | Prazo     |
| -------- | ----------------------------------------------------------------------------- | --------- |
| Semana 1 | Definir comissão (fixa vs recorrente, %, níveis)                              | Dia 1–3   |
| Semana 1 | Escolher e configurar plataforma                                              | Dia 3–5   |
| Semana 1 | Criar acordo de afiliado (termos, pagamento, clawback, guidelines de marca)   | Dia 5–7   |
| Semana 2 | Construir portal: página de cadastro, dashboard, biblioteca de assets         | Dia 8–10  |
| Semana 2 | Criar assets: banners, templates de email, copy social, copy de landing       | Dia 10–14 |
| Semana 3 | Recrutar primeiros 10–20 afiliados: clientes, advisors, criadores             | Dia 15–18 |
| Semana 3 | Enviar sequência de onboarding (boas-vindas, tour, guia da primeira campanha) | Dia 18–21 |
| Semana 4 | Monitorar primeiras conversões; ajustar tracking se houver gaps               | Dia 22–28 |
| Mês 2    | Analisar padrões dos top performers; case do primeiro afiliado de sucesso     | Dia 30–60 |
| Mês 3    | Escalar recrutamento; lançar comissão em níveis com base em dados             | Dia 60–90 |

---

## 4. Estratégia de parceria de integração

### Por que parcerias de integração ganham em 2025–2026

Parcerias de integração são a categoria que mais cresce porque criams lock-in no produto, não só relação comercial. Quando seu produto está profundamente integrado ao do parceiro, clientes conjuntos retêm mais, NPS e LTV sobem.

### Priorização de parceiros de integração

Use este modelo de pontuação para decidir quais integrações construir primeiro.

| Fator                       | Peso | Critérios de pontuação                                                                                         |
| --------------------------- | ---- | -------------------------------------------------------------------------------------------------------------- |
| Overlap de clientes         | 30%  | Crossbeam ou pesquisa manual. 50+ contas compartilhadas = 100pts, 20–49 = 75pts, 10–19 = 50pts, &lt;10 = 25pts |
| Fit estratégico             | 25%  | Adjacente no workflow (100pts), complementar mas separado (60pts), tangencial (25pts)                          |
| Compromisso GTM do parceiro | 20%  | Orçamento de co-marketing (100pts), disposto a co-marketing (60pts), só integração (25pts)                     |
| Viabilidade técnica         | 15%  | API disponível, &lt;2 semanas (100pts), API 2–8 semanas (60pts), sem API ou 8+ semanas (25pts)                 |
| Sinal de mercado            | 10%  | Clientes pedindo ativamente (100pts), concorrente tem (60pts), nice-to-have (25pts)                            |

**Score = soma (peso × pontos). Priorize integrações com score 70+.**

### Processo de onboarding do parceiro de integração

```
Etapa 1: Discovery (semana 1)
  - Validar overlap de clientes via Crossbeam ou mapeamento manual
  - Confirmar viabilidade técnica (docs de API, sandbox)
  - Alinhar nível de compromisso GTM
  |
Etapa 2: Build técnico (semanas 2–6)
  - Trocar credenciais de API e sandboxes
  - Construir integração (fluxo bidirecional preferível)
  - QA com 2–3 clientes beta
  |
Etapa 3: Lançamento GTM (semanas 7–8)
  - Post ou case coautorados
  - Webinar ou vídeo demo conjunto
  - Listagem no diretório/marketplace um do outro
  - Email para base com overlap
  |
Etapa 4: Otimização contínua (mensal)
  - Sync mensal sobre pipeline e adoção
  - Campanha de co-marketing trimestral (webinar, conteúdo, oferta conjunta)
  - Revisão anual com sponsors executivos
```

---

Para estratégia de integração, marketplace, recrutamento, co-marketing, atribuição, conflito de canal, parcerias com IA, operações e playbook de implementação leia `references/implementation-guide.md`.

## Exemplos

- **Usuário diz:** "Queremos começar um programa de parceiros" → **Resultado:** Agente pergunta uso atual de indicação/integração e margem; recomenda modelo (indicação 10–15%, integração 20–25%, solução 30–40%); sugere Rewardful/FirstPromoter em estágio inicial ou PartnerStack/Impact em crescimento; descreve registro de deal e meta de 30 dias até primeira indicação.
- **Usuário diz:** "Como recrutar parceiros de integração?" → **Resultado:** Agente identifica ferramentas que clientes usam no dia; recomenda prontidão de API/sandbox e orçamento de co-marketing (US$ 2K–10K/trim); sugere meta de ativação (20–30% dos onboarded) e cadência de QBR para níveis 2/3.
- **Usuário diz:** "Receita de parceiros está estagnada" → **Resultado:** Agente verifica taxa de ativação e concentração nos tops (10–20% geram 80%+); sugere recrutar a partir de indicadores existentes, reforçar enablement e limites de contas protegidas (ex.: 50); relaciona com expansion-retention para expansão originada por parceiros.

## Solução de problemas

- **Baixa ativação de parceiros** → **Causa:** Fricção no onboarding ou incentivo fraco. **Correção:** Tempo até primeira indicação em 30 dias; comissão clara e janela de cookie (90d); kit de enablement e registro de deal (14d first-mover).
- **Conflito de canal** → **Causa:** Venda direta e parceiro competindo. **Correção:** Registro de deal e janela de fechamento de 120 dias; lista de contas protegidas; regras claras de conflito e comp para sobreposição.
- **Atribuição pouco clara** → **Causa:** Sem campo no CRM ou UTM. **Correção:** UTM obrigatório em links de parceiro; campo CRM para origem; relatório originado vs influenciado por parceiro; meta de 15–30% originado por parceiro em maturidade.

---

Para checklists, benchmarks e perguntas de discovery leia `references/quick-reference.md` quando precisar de referência detalhada.

---

## Skills relacionadas

| Skill                 | Quando cruzar                                                                                 |
| --------------------- | --------------------------------------------------------------------------------------------- |
| expansion-retention   | Ao desenhar incentivos de retenção de parceiros e expansão de contas originadas por parceiros |
| multi-platform-launch | Ao coordenar lançamento do programa de parceiros em canais e marketplaces                     |
| sales-motion-design   | Ao alinhar leads de parceiros com seu processo comercial e estágios de deal                   |
| content-to-pipeline   | Ao criar conteúdo de co-marketing que gera pipeline pelos canais de parceiros                 |
| gtm-metrics           | Ao medir ROI do programa de parceiros, atribuição e contribuição de receita                   |
| ai-pricing            | Ao desenhar comissões considerando custos de modelo de IA e margem                            |
| lead-enrichment       | Ao enriquecer leads indicados por parceiros com dados firmográficos e de intenção             |
| gtm-engineering       | Ao automatizar atribuição de parceiros, registro de deal e cálculo de comissão                |
| positioning-icp       | Ao garantir que a mensagem de parceiros alinha com posicionamento e ICP certos                |
