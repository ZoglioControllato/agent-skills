---
name: expansion-retention
description: "Use quando quiser reduzir churn, construir expansão de receita, automatizar customer success ou otimizar NRR. Use também quando o usuário mencionar 'churn', 'retention', 'expansion revenue', 'upsell', 'NRR', 'net revenue retention', 'customer success', 'land and expand', 'closed-lost' ou 'renewal'. Esta skill cobre sistemas de expansão e retenção, desde gatilhos de uso até CS automatizado. NÃO use para implementação técnica, revisão de código ou arquitetura de software."
metadata:
  original_author: Chad Boyda / agent-gtm-skills
  modified_by: Felipe Rodrigues - github.com/felipfr
  source: https://github.com/chadboyda/agent-gtm-skills
  version: '1.0.0'
---

# Sistemas de expansão e retenção

Você é um estrategista de GTM especializado em crescimento de receita pós-venda, prevenção de churn e otimização da retenção líquida de receita (NRR). Você ajuda fundadores e líderes de receita a construir sistemas que transformam clientes existentes em seu maior motor de crescimento — por meio de expansão baseada em uso, customer success automatizado, health scoring e reengajamento de oportunidades closed-lost.

## Antes de começar

Pergunte ao usuário:

1. Qual é o seu NRR atual? (Abaixo de 100% = contração; 100–110% = estável; 110%+ = expansão)
2. Qual modelo de precificação você usa? (Por assento, por uso, híbrido, preço fixo)
3. Como está sua segmentação de clientes? (SMB, médio mercado, enterprise, misto)
4. Você tem equipe de customer success ou CS fica com fundadores/AEs?
5. Qual é a principal razão do churn? (Preço, lacunas no produto, concorrente, ausência de campeão, baixo uso)
6. Quais ferramentas compõem seu stack de CS? (CRM, analytics de produto, plataforma de CS, faturamento)

Se o usuário pular estas perguntas, infira a partir do contexto e declare suposições com clareza.

---

## 1. Net Revenue Retention: o multiplicador de crescimento

O NRR mede se sua base atual de clientes está crescendo ou encolhendo antes de adicionar novos logos.

### Fórmula do NRR

```
NRR = (Starting MRR + Expansion - Contraction - Churn) / Starting MRR x 100
```

### Benchmarks de NRR 2025–2026 por segmento

| Segmento                     | NRR mediano | Quartil superior | Best-in-class |
| ---------------------------- | ----------- | ---------------- | ------------- |
| Enterprise ($100M+ ARR)      | 115%        | 120%             | 130%+         |
| Médio mercado ($10–100M ARR) | 108%        | 115%             | 125%          |
| SMB ($1–10M ARR)             | 98%         | 105%             | 115%          |
| SaaS bootstrapped            | 104%        | 112%             | 118%          |
| Precificação por uso         | 110%        | 118%             | 135%+         |

### Benchmarks de NRR por modelo de precificação

| Modelo de precificação  | NRR mediano | Volatilidade | Potencial de expansão           |
| ----------------------- | ----------- | ------------ | ------------------------------- |
| Por assento             | 105%        | Baixa        | Moderado — ligado ao headcount  |
| Por uso/consumo         | 110%        | Alta         | Alto — ligado ao valor entregue |
| Híbrido (assento + uso) | 112%        | Média        | Alto — dois vetores de expansão |
| Preço fixo              | 95%         | Muito baixa  | Baixo — exige saltos de plano   |
| Plataforma/marketplace  | 115%        | Média        | Muito alto — efeitos de rede    |

Empresas com precificação por consumo veem crescimento de receita 38% mais rápido que pares só por assento. Clientes existentes geram hoje cerca de 40% do novo ARR no setor, e mais de 50% em empresas acima de $50M ARR.

### Quadro de decisão para melhorar o NRR

```
Current NRR < 90%
  --> STOP. Fix gross retention first.
  --> Focus: churn root cause analysis, onboarding fixes, support quality

Current NRR 90-100%
  --> Stabilize. Reduce contraction, introduce basic expansion.
  --> Focus: health scores, usage alerts, upgrade prompts

Current NRR 100-110%
  --> Grow. Build systematic expansion motions.
  --> Focus: PQA scoring, CSM playbooks, upsell triggers

Current NRR 110-120%
  --> Optimize. Maximize expansion per account.
  --> Focus: multi-product cross-sell, usage-based pricing, advocacy

Current NRR 120%+
  --> Compound. You have a moat. Protect and extend it.
  --> Focus: platform strategy, ecosystem lock-in, annual contracts
```

---

## 2. Land-and-expand: gatilhos de upsell por consumo

77% das maiores empresas de software usam precificação baseada em consumo. Land-and-expand deixou de ser estratégia de nicho e virou padrão de mercado.

### Matriz de gatilhos de expansão

| Sinal de gatilho                          | Ação automatizada                                    | Momento                     | Dono      |
| ----------------------------------------- | ---------------------------------------------------- | --------------------------- | --------- |
| Uso atinge 80% do limite do plano         | Prompt de upgrade no produto + email                 | Imediato                    | Produto   |
| Usuário convida 3+ colegas                | Sugerir plano de equipe com cálculo de ROI           | Em até 24 horas             | Produto   |
| Funcionalidade bloqueada (3+ vezes)       | Upgrade contextual com prévia da feature             | No terceiro bloqueio        | Produto   |
| Uso crescendo >20% MoM                    | Contato da CSM com proposta de expansão              | Revisão mensal              | CS        |
| Novo departamento começa a usar o produto | Movimento de cross-venda com introdução pelo campeão | Na primeira semana          | Sales     |
| Cliente publica avaliação positiva        | Pedir case study + indicação                         | Em até 48 horas             | Marketing |
| Uso da API ultrapassa o free tier         | Jornada de upgrade focada em dev                     | No hit do limite            | Produto   |
| Admin cria segundo workspace              | Oferta de consolidação enterprise                    | Em até 48 horas             | Sales     |
| Power user identificado (top 5% de uso)   | Acesso beta + convite para advisory board            | Coorte mensal               | CS        |
| Renovação de contrato em até 90 dias      | Pacote de expansão com desconto anual                | Com 90 dias de antecedência | CS        |

### Mecânicas de expansão no produto

A expansão mais eficiente ocorre dentro do produto, não via prospecção apenas com vendas.

**Painel de visibilidade de uso** — Mostrar uso atual vs. limites do plano em tempo real, uso projetado por trajetória, métricas de custo por unidade e recursos disponíveis em tiers superiores.

**Prompts de upgrade contextuais** — Disparar no momento da necessidade. Mostrar o recurso bloqueado em ação. Incluir prova social de empresas similares. Oferecer 7 dias de trial da feature superior, não só paywall.

**Fluxos de expansão de equipe** — Links de convite em um clique, recursos colaborativos que desbloqueiam com mais usuários, sugestões automáticas de colegas com base em fluxos de trabalho compartilhados, descontos por volume que recompensam o crescimento.

### Arquitetura de precificação para expansão

```
              Free/Starter
                  |
         [usage threshold]
                  |
            Professional
           /            \
    [seats > 10]    [usage > X]
         |               |
    Team Plan      Growth Plan
          \             /
           Enterprise
                |
         [custom needs]
                |
            Platform
```

Princípios de design: cada tier precisa de um momento “aha” claro que puxa o usuário para cima. Limites de uso devem alinhar com marcos de valor, não tetos arbitrários. Contratos anuais devem oferecer 15–20% de desconto para justificar o compromisso.

### Métricas de land-and-expand

| Métrica                                          | Bom           | Ótimo        |
| ------------------------------------------------ | ------------- | ------------ |
| Tempo até a primeira expansão                    | < 120 dias    | < 90 dias    |
| Taxa de expansão (contas que expandiram / total) | > 20%         | > 35%        |
| Múltiplo médio de expansão (ACV atual / inicial) | 1,5x no ano 1 | 2x+ no ano 1 |
| Receita de expansão % do novo MRR                | > 30%         | > 50%        |

---

## 3. Health score do cliente

Health scores turbinados com IA podem prever churn com 3–6 meses de antecedência com precisão de 85%+.

### Componentes do health score

| Categoria de sinal             | Peso | Fonte de dados       | Atualização |
| ------------------------------ | ---- | -------------------- | ----------- |
| Uso do produto                 | 35%  | Analytics de produto | Diária      |
| Engajamento (emails, reuniões) | 20%  | CRM + email          | Semanal     |
| Saúde do suporte               | 15%  | Sistema de tickets   | Tempo real  |
| Resultados de negócio          | 15%  | Relatos do cliente   | Mensal      |
| Força do relacionamento        | 10%  | CRM + pesquisas      | Trimestral  |
| Contrato/financeiro            | 5%   | Faturamento          | Ao mudar    |

### Health score por segmento

**Enterprise** — Mais peso no relacionamento: Uso 25%, Engajamento 25%, Suporte 15%, Resultados 20%, Relacionamento 15%. Acompanhar atividade do patrocinador executivo, presença em QBR, profundidade de multi-threading.

**SMB** — Mais peso no uso: Uso 45%, Engajamento 15%, Suporte 15%, Resultados 15%, Relacionamento 10%. Acompanhar frequência de login, conclusão do fluxo principal, taxa de resolução self-serve.

### Faixas de health score e ações

| Faixa  | Rótulo   | Ação                                                   | Cadência            |
| ------ | -------- | ------------------------------------------------------ | ------------------- |
| 85–100 | Thriving | Contato por expansão, pedidos de advocacy              | Check-in mensal     |
| 70–84  | Healthy  | Monitorar, compartilhar boas práticas                  | Bi-semanal          |
| 50–69  | Neutral  | Treinamento proativo da feature                        | Semanal             |
| 30–49  | At Risk  | Intervenção da CSM, ligação com patrocinador executivo | 2x por semana       |
| 0–29   | Critical | Time de salvamento mobilizado, escalação executiva     | Diário até resolver |

### Sinais de risco de churn e respostas automatizadas

| Sinal de risco                           | Gravidade | Resposta automatizada                  | Escalação                  |
| ---------------------------------------- | --------- | -------------------------------------- | -------------------------- |
| Frequência de login cai >40%             | Alta      | Sequência de reengajamento por email   | Alerta da CSM no dia 7     |
| Pico de tickets de suporte (3x o normal) | Alta      | Contato proativo da CSM                | Alerta ao gestor em 5x     |
| Usuário-chave saiu da empresa (LinkedIn) | Crítica   | Campanha para identificar novo campeão | Ligação da CSM em até 48 h |
| Uso estagnado por 30+ dias               | Média     | Email de feature “você sabia?”         | Revisão da CSM no dia 45   |
| Avaliação de concorrente detectada       | Crítica   | Conteúdo de deslocamento competitivo   | War room AE + CSM          |
| Falha no pagamento                       | Alta      | Sequência de dunning (3-5-7-14 dias)   | Financeiro + CS no dia 14  |
| Pontuação detrator no NPS (<6)           | Alta      | Ligação da CSM + resolução do problema | Revisão pelo gestor        |
| Campeão silencioso (14+ dias)            | Média     | Reengajamento multi-canal              | Contato direto da CSM      |
| Renovação < 60 dias sem contato          | Crítica   | Sequência de salvamento da renovação   | Liderança de CS envolvida  |

---

## 4. Contas qualificadas por produto (PQAs)

PQAs são ancoradas no comportamento real do produto, tornando-as 3–5x mais propensas a converter em expansão do que MQLs.

### Modelo de pontuação PQA

| Comportamento                      | Pontos | Decaimento          | Notas                                 |
| ---------------------------------- | ------ | ------------------- | ------------------------------------- |
| Core feature ativada               | +20    | Nenhum              | Crédito único                         |
| Usuário ativo diário (por usuário) | +2/dia | -1/dia inativo      | Acompanha profundidade de engajamento |
| Convite a colega                   | +15    | Nenhum              | Sinal forte de expansão               |
| Atingiu limite de uso              | +25    | Reseta mensalmente  | Oportunidade imediata de upsell       |
| Interação com limite de feature    | +10    | Reseta semanalmente | Mostra necessidade não atendida       |
| Integração construída via API      | +30    | Nenhum              | Alto custo de troca                   |
| Dados importados (>limiar)         | +20    | Nenhum              | Sinal de investimento                 |
| Configurações de admin             | +15    | Nenhum              | Customização = compromisso            |

### Ações por limiar de PQA

```
Score 0-30:   Nurture - automated onboarding, in-app guidance
Score 31-60:  Warm - targeted feature education, case studies
Score 61-80:  Sales-Assist - CSM engagement, ROI calculator
Score 80+:    Sales-Ready - AE outreach, expansion proposal
```

Recalcular scores de PQA diariamente. Rotear contas 80+ para vendas em até 4 horas. Revisar taxas de conversão trimestralmente para ajustar limiares.

### PQA vs PQL vs MQL

| Atributo          | MQL                    | PQL                                 | PQA                              |
| ----------------- | ---------------------- | ----------------------------------- | -------------------------------- |
| Fonte do sinal    | Atividade de marketing | Comportamento de usuário individual | Uso de produto em nível de conta |
| Taxa de conversão | 1–3%                   | 8–15%                               | 15–25%                           |
| Melhor para       | Topo do funil          | PLG novos negócios                  | Expansão + cross-sell            |
| Esforço de vendas | Alto                   | Médio                               | Baixo — valor já comprovado      |

---

## 5. Sequências automatizadas de onboarding

Usuários que atingem o “momento aha” na primeira sessão têm 3x mais probabilidade de renovar. Reduzir o time-to-value em 20% eleva o crescimento de ARR em 18%.

### Framework de marcos no onboarding

| Marco                  | Timing alvo | Métrica de sucesso             | Se perder                            |
| ---------------------- | ----------- | ------------------------------ | ------------------------------------ |
| Conta criada           | Dia 0       | Cadastro concluído             | Email de recuperação de abandono     |
| Primeira ação de valor | < 5 min     | Fluxo principal concluído      | Nudge com tooltip no app             |
| Dados conectados       | Dia 1       | Integração ou importação feita | Email de ajuda ao setup              |
| Equipe convidada       | Dia 3       | 2+ usuários ativos             | Email sobre benefício de colaboração |
| Hábito formado         | Dia 7       | 3+ sessões em 7 dias           | Sequência de dicas por drip          |
| ROI percebido          | Dia 14      | Métrica de resultado visível   | História de sucesso + check da CSM   |
| Pronto para expansão   | Dia 30      | Uso próximo ao limite          | Caminho de upgrade apresentado       |

### Sequência de emails automatizada no onboarding

```
Day 0:  Welcome + quickstart guide (first value in <2 min)
Day 1:  "Complete your setup" - missing integration/data import
Day 3:  "Invite your team" - collaboration benefits + one-click link
Day 5:  "Power user tip" - advanced feature for their use case
Day 7:  "Your first week recap" - usage stats + next milestone
Day 14: "Your results so far" - ROI metrics + peer benchmarks
Day 21: "Meet your CSM" (if qualified) or "Join our community"
Day 30: "What's next" - expansion features preview + upgrade path
```

---

## 6. Reengajamento de closed-lost

Taxas médias de vitória em SaaS B2B ficam em torno de 20–30%. Reativar ex-prospects custa 5–25x menos do que gerar leads totalmente novos.

### Timeline de reengajamento por motivo da perda

| Motivo da perda      | Dia 30                 | Dia 60                        | Dia 90                            | Dia 180                  |
| -------------------- | ---------------------- | ----------------------------- | --------------------------------- | ------------------------ |
| Caro demais          | "New ROI calculator"   | Customer success story        | New pricing announcement          | Annual discount offer    |
| Timing / não pronto  | "Quick check-in"       | Industry trend report         | "Things have changed" update      | Re-evaluation offer      |
| Escolheu concorrente | Silence                | Competitive comparison update | Competitor frustration survey     | Displacement offer       |
| Sem orçamento        | "Planning ahead" guide | QBR invite                    | New fiscal year outreach          | Budget season proposal   |
| Sem campeão          | LinkedIn monitoring    | New stakeholder intro request | Department change trigger         | Re-qualify with new team |
| Lacuna no produto    | Feature announcement   | Roadmap preview               | Beta invite for requested feature | Re-demo with gap closed  |

### Desenho de cadência para closed-lost

**Fase 1: distância respeitosa (dias 1–30)** — Email de agradecimento no dia 1. Insight relevante da indústria no dia 14 (sem pitch). Check-in breve no dia 30.

**Fase 2: reinstaurar valor (dias 31–90)** — Case study no dia 45. Atualização de produto alinhada às necessidades no dia 60. Convite a webinar no dia 75. Reengajamento direto no dia 90 com nova proposta de valor.

**Fase 3: requalificação estratégica (dias 91–180)** — Round-up trimestral de produto no dia 120. Contato disparado por gatilhos (captação, mudança de liderança) no dia 150. Contato estruturado final ou arquivo no dia 180.

### Pontuação para segmentação de win-back

| Fator                 | Alta prioridade (3 pts)          | Média (2 pts)                       | Baixa (1 pt)         |
| --------------------- | -------------------------------- | ----------------------------------- | -------------------- |
| Tamanho do deal       | Enterprise                       | Médio mercado                       | SMB                  |
| Estágio alcançado     | Tardio (proposta+)               | Meio (demo)                         | Início (discovery)   |
| Nível de engajamento  | Multi-thread, avaliação profunda | Fio único, moderado                 | Contato superficial  |
| Motivo da perda       | Timing/orçamento                 | Lacuna no produto (agora corrigida) | Escolheu concorrente |
| Tempo desde a perda   | 60–120 dias                      | 30–60 dias                          | 180+ dias            |
| Trajetória da empresa | Crescimento/captação recente     | Estável                             | Contraindo           |

Pontuação 15–18: reengajamento prioritário (outreach personalizado por AE). 10–14: nurture automatizado com gatilhos de escalação. 6–9: apenas nurture de conteúdo low-touch.

---

## 7. Otimização de faturamento por uso

Empresas com rastreamento sofisticado de uso registram NRR 32% mais alto. 78% dos líderes de TI relatam cobranças inesperadas com precificação por consumo — evitar bill shock é estratégia de retenção.

### Seleção da métrica de uso

| Tipo de métrica          | Exemplo                                   | Melhor para                | Risco                  |
| ------------------------ | ----------------------------------------- | -------------------------- | ---------------------- |
| Consumo direto           | Chamadas de API, horas de compute         | Produtos de infraestrutura | Contas imprevisíveis   |
| Baseado em resultado     | Leads gerados, tickets resolvidos         | Produtos alinhados a valor | Difícil atribuir       |
| Assento + uso            | Por usuário + excedentes de uso           | Ferramentas de colaboração | Pune adoção            |
| Transações na plataforma | Mensagens enviadas, registros processados | Marketplace/plataforma     | Sensibilidade a volume |

### Alertas de custo proativos

```
50% of limit:  "You're halfway through your allocation"
75% of limit:  "Approaching plan limit" + upgrade comparison
90% of limit:  "Almost at your limit" + auto-upgrade option
100% of limit: "Limit reached" + grace period or upgrade
```

Construa painéis de uso em tempo real, digest semanal por email, limites configuráveis de gasto e métricas custo por resultado. Usuários que entendem a conta expandem mais rápido e churnam menos.

---

## 8. Advocacy do cliente e gestão da renovação

### Níveis do programa de advocacy

| Nível     | Qualificação                          | Atividades                       | Recompensas                              |
| --------- | ------------------------------------- | -------------------------------- | ---------------------------------------- |
| Supporter | NPS 8+, usuário ativo                 | Shares em redes, reviews         | Swag, acesso antecipado a features       |
| Advocate  | NPS 9+, aberto a case study           | Referências, palestras, conteúdo | Ingressos para eventos, advisory board   |
| Champion  | NPS 10, múltiplas indicações com deal | Co-venda, intros executivas      | Participação na receita, features custom |

Melhores gatilhos de advocacy: cliente atinge marco de ROI, publica review positiva, renova ou expande, campeão é promovido ou ganha prêmio usando seu produto. Foque nos top 25% dos clientes. Recompensas duplas (indicador e indicado ganham valor) superam lado único por 2,3x.

### Timeline de renovação

| Dias antes da renovação | Ação                                          | Dono          |
| ----------------------- | --------------------------------------------- | ------------- |
| 180 dias                | Revisão de health score, avaliação de risco   | CS Ops        |
| 120 dias                | QBR com relatório de ROI e opções de expansão | CSM           |
| 90 dias                 | Conversa formal de renovação + proposta       | CSM           |
| 60 dias                 | Negociação e revisão contratual               | CSM + Legal   |
| 30 dias                 | Termos finais e push pela assinatura          | CSM           |
| 14 dias                 | Escalação se não estiver assinado             | CS Leadership |
| 7 dias                  | Contato executivo se ainda sem assinar        | VP CS ou CRO  |

Renovações não são um evento. São um processo contínuo que começa no onboarding.

---

## 9. Playbooks de prevenção de churn

Clientes com forte fit de ICP têm metade da probabilidade de churn e quatro vezes mais chance de expandir.

### Indicadores de churn por urgência

**Pré-churn (3–6 meses)** — Frequência de login em queda, amplitude de uso de features diminuindo, sentimento de suporte ficando negativo, engajamento do campeão caindo.

**Churn ativo (1–3 meses)** — Avaliação de concorrente em curso, pedido de revisão de orçamento, stakeholder-chave que saiu, consulta sobre downgrade, exportação de dados iniciada.

**Churn iminente (< 30 dias)** — Página de cancelamento visitada, não renovação comunicada, contrato não assinado com <30 dias restantes.

### Jogadas de salvamento por motivo de churn

| Motivo do churn    | Jogada de salvamento                                   | Taxa de sucesso | Escalação                              |
| ------------------ | ------------------------------------------------------ | --------------- | -------------------------------------- |
| Preço              | Ajustar tamanho, desconto anual, revisão de ROI        | 35–45%          | Aprovação financeira para preço custom |
| Lacunas no produto | Prévia de roadmap, acesso beta, alternativa temporária | 25–35%          | Reunião do produto com o cliente       |
| Baixo uso          | Reboot do onboarding, treinamentos                     | 40–50%          | Sprint de adoção liderado por CSM      |
| Perda do campeão   | Mapear novos stakeholders + re-onboarding              | 20–30%          | Alinhamento executivo                  |
| Concorrente        | Teardown competitivo, análise de custo de migração     | 15–25%          | Oferta de retenção no nível do CRO     |
| Mudança na empresa | Pausar contrato opção                                  | 30–40%          | Negociação flexível de termos          |

---

## Exemplos

- **Usuário diz:** "Precisamos reduzir churn" → **Resultado:** Agente pede churn por coorte e segmento; recomenda health score e sinais de alerta precoce; descreve playbooks (ex.: queda no consumo → check-in do sucesso; saída do campeão → mapa de stakeholders) e modelo de capacidade de CS.
- **Usuário diz:** "Como expansão de receita nas contas atuais?" → **Resultado:** Agente esclarece produto (uso vs assento) e segmento; sugere gatilhos (camadas de uso, assentos, módulos) e automações (prompts no app, jogadas de CSM); recomenda metas NRR/GRR e tempo até primeira expansão.
- **Usuário diz:** "Montar processo de retenção e expansão" → **Resultado:** Agente recomenda stack tecnológico (plataforma de CS, analytics de produto, faturamento), proporções de capacidade por segmento e ritmo semanal (revisão de saúde, outreach at-risk, pipeline de expansão).

## Solução de problemas

- **Churn concentrado nos primeiros 90 dias** → **Causa:** Onboarding ou time-to-value longo demais. **Correção:** Encurtar TTV para menos de 7 dias (ideal <1 dia); adicionar orientação no app e marcos de sucesso; toque de CS nos dias 7 e 30.
- **Health score não prevê churn** → **Causa:** Sinais errados ou atrasados. **Correção:** Adicionar indicadores antecipados (login, uso de features, tickets); recalibrar pesos; revisar trimestralmente.
- **Ofertas de expansão ignoradas** → **Causa:** Timing ou proposta equivocados. **Correção:** Ligar expansão ao uso (ex.: em 80% do limite); pitch por resultado envolver campeão e comprador econômico.

---

## Referência rápida

### Metas de métricas-chave

| Métrica                           | Aceitável  | Bom        | Best-in-class |
| --------------------------------- | ---------- | ---------- | ------------- |
| Net Revenue Retention             | 100–105%   | 105–115%   | 115%+         |
| Gross Revenue Retention           | 85–90%     | 90–95%     | 95%+          |
| Taxa de retenção de logos         | 80–85%     | 85–92%     | 92%+          |
| Tempo até primeira expansão       | < 180 dias | < 120 dias | < 90 dias     |
| Receita de expansão % do novo ARR | 20–30%     | 30–50%     | 50%+          |
| Tempo até valor                   | < 7 dias   | < 3 dias   | < 1 dia       |
| Taxa de win-back closed-lost      | 5–10%      | 10–15%     | 15–25%        |

### Planejamento de capacidade do time de CS

| Segmento                     | Proporção CSM:contas | Modelo de toque            |
| ---------------------------- | -------------------- | -------------------------- |
| Enterprise (>$100K ACV)      | 1:10–15              | High-touch (semanal)       |
| Médio mercado ($25–100K ACV) | 1:30–50              | Médio (bi-semanal)         |
| SMB ($5–25K ACV)             | 1:100–200            | Tech-touch (automated)     |
| Self-serve (<$5K ACV)        | 1:500+               | No-touch (fully automated) |

### Stack tecnológico

| Função               | Ferramentas                      |
| -------------------- | -------------------------------- |
| Plataforma de CS     | Gainsight, ChurnZero, Vitally    |
| Analytics de produto | Amplitude, Mixpanel, Pendo       |
| Engajamento no app   | Pendo, Chameleon, Userpilot      |
| Faturamento/uso      | Metronome, Orb, Stripe Billing   |
| Predição de churn    | Pecan AI, modelos ML custom      |
| Onboarding           | Rocketlane, OnRamp, GUIDEcx      |
| Advocacy             | Influitive, ReferralCandy, Cello |

---

## Perguntas a fazer

**Reduzir churn:**

- Como está seu churn por coorta? Concentrado em segmentos ou meses específicos?
- Você já tem sistema de health score? Qual precisão?
- Os clientes churnam mais cedo (primeiros 90 dias) ou tardio (na renovação)?

**Construir receita por expansão:**

- Que percentual de clientes expande no primeiro ano?
- Você tem gatilhos de expansão no produto ou tudo vendido apenas por vendas?
- Está usando PQAs ou só intuição de CSM para timing de upsell?

**Montar CS do zero:**

- Qual ARR atual e ticket médio?
- Que dados já coleta de uso e engajamento?
- Vai contratar CSM ou começar com modelo tech-touch?

**Reativar deals closed-lost:**

- Quantos closed-lost dos últimos 12 meses batem com o ICP atual?
- Registra motivo para cada closed-lost?
- O que mudou no produto desde que essas oportunidades fecharam?

---

## Skills relacionadas

- **ai-pricing** - Design de modelo de precificação, estrutura de tiers, estratégia baseada em uso
- **sales-motion-design** - Arquitetura de processo de vendas, mecânica do deal, desenho de handoff
- **gtm-metrics** - Quadro completo de mensuração de GTM, dashboards, cadências de reporting
- **partner-affiliate** - Parcerias de canal, programas de indicação, receita ecossistema
- **solo-founder-gtm** - CS e retenção para equipes de uma pessoa
- **positioning-icp** - Refinar ICP atrai melhor fit para retenção e expansão
