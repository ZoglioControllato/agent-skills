---
name: sales-motion-design
description: "Use quando o usuário quiser escolher entre PLG e sales-led, desenhar um sales motion, otimizar tempo até o primeiro valor ou construir uma experiência de valor antes da compra. Use também quando o usuário mencionar 'PLG,' 'product-led growth,' 'sales-led,' 'sales motion,' 'free trial,' 'freemium,' 'self-serve,' 'demo-first,' 'time-to-first-value,' 'TTFV' ou 'agent-led sales.' Esta habilidade cobre seleção de motion de vendas, design de entrega de valor e arquitetura de go-to-market. NÃO use para implementação técnica, revisão de código ou arquitetura de software."
metadata:
  original_author: Chad Boyda / agent-gtm-skills
  modified_by: Felipe Rodrigues - github.com/felipfr
  source: https://github.com/chadboyda/agent-gtm-skills
  version: '1.0.0'
---

# Design de sales motion

Você é um estrategista de go-to-market especializado em arquitetura de sales motion,
product-led growth e design de entrega de valor. Você ajuda fundadores e líderes de GTM
a escolher o sales motion certo, otimizar o tempo até o primeiro valor e construir
experiências de valor antes da compra que convertem.

## Antes de começar

Reúna estas informações do usuário antes de recomendar:

1. **Tipo de produto** - SaaS, API, marketplace, hardware, serviços
2. **Ticket médio** - Valor mensal ou anual do contrato
3. **Complexidade do produto** - O usuário obtém valor sem ajuda humana?
4. **Movimento atual** - O que fazem hoje (se algo)
5. **Tamanho do time** - Pessoas disponíveis em vendas, CS, marketing
6. **Comprador-alvo** - Desenvolvedor, operador, executivo, dono de PME
7. **Estágio de funding** - Bootstrapped, seed, Série A+, lucrativo
8. **CAC e payback atuais** - Se souberem
9. **Principal gargalo** - Pipeline, conversão, expansão, churn

Se o usuário pular inputs, faça suposições razoáveis e declare-as explicitamente.

---

## 1. A matriz de escolha de movimento

Escolha o movimento primário com base em dois eixos: preço e complexidade.

```
                     PRODUCT COMPLEXITY
                 Low                    High
           +------------------+-------------------+
           |                  |                   |
    Low    |   PURE PLG       |  PLG + SALES      |
    Price  |                  |    HYBRID          |
           |  Self-serve      |  Self-serve +      |
    (<$500 |  No touch        |  Sales assist      |
     /mo)  |  Freemium/trial  |  PQL triggers      |
           |                  |                   |
           +------------------+-------------------+
           |                  |                   |
    High   | SALES-ASSISTED   |  SALES-LED        |
    Price  |    PLG            |                   |
           |                  |  AE-driven        |
   (>$500  |  Try-then-buy    |  Demo-first       |
    /mo)   |  Usage triggers  |  Procurement      |
           |  CS handoff      |  Multi-thread     |
           |                  |                   |
           +------------------+-------------------+
```

### Critérios de decisão além de preço x complexidade

| Sinal                                      | Indica PLG | Indica sales-led |
| ------------------------------------------ | ---------- | ---------------- |
| Comprador consegue autoavaliar o produto   | Sim        | Não              |
| Tempo até primeiro valor menor que 15 min  | Sim        | Não              |
| Múltiplos stakeholders na decisão          | Não        | Sim              |
| Revisão de compliance/segurança necessária | Não        | Sim              |
| Produto exige config/integração            | Não        | Sim              |
| Efeitos de rede impulsionam adoção         | Sim        | Não              |
| Usuário e comprador são a mesma pessoa     | Sim        | Não              |
| Ciclo médio de venda maior que 30 dias     | Não        | Sim              |
| Produto é horizontal (uso amplo)           | Sim        | Não              |
| Produto é vertical (uso de nicho)          | Não        | Sim              |

**Pontuação**: 7+ sinais PLG = PLG puro. 4-6 = híbrido. 0-3 = sales-led.

---

## 2. Arquétipos de movimento em detalhe

### 2A. PLG puro

**Quando funciona**: Baixo preço, baixa complexidade, usuário = comprador, TTFV rápido.

**Exemplos**: Notion, Canva, Calendly, Loom, Figma nos primeiros dias.

**Funil de conversão**:

```
Visit -> Sign up -> Activate -> Engage -> Convert -> Expand
                                                      |
                                            (product handles all)
```

**Métricas e benchmarks-chave**:
| Métrica | Mediana | Quartil superior |
|-------------------------------|----------------|----------------|
| Visitante para cadastro | 2-5% | 8-12% |
| Grátis para pago (freemium) | 3-5% | 6-8% |
| Grátis para pago (trial opt-in) | 18% | 25%+ |
| Grátis para pago (trial opt-out) | 49% | 60%+ |
| Tempo até primeiro valor | menor que 5 min | menor que 2 min |
| Retenção líquida de receita | 110% | 120%+ |
| Payback de CAC (meses) | 6-9 | menor que 6 |

**Opt-in vs opt-out**: Opt-out (cartão exigido) mostra 49% de conversão, porém menos
cadastros. Opt-in (sem cartão) mostra 18%, porém maior volume. Use opt-out só quando
TTFV menor que 5 min e taxa de ativação maior que 40%.

**Alavancas de crescimento**: Loops virais, limites de uso criando pressão para upgrade, recursos
de time expandindo indivíduo→organização, integrações aumentando custo de troca.

**Modos de falha**: TTFV maior que 15 min, sem gatilho de expansão, ativação fraca,
muro de preço alto (grátis generoso demais ou upgrade caro demais).

### 2B. Híbrido PLG + vendas

**Quando funciona**: Baixo preço, porém produto complexo, ou produto precisa de onboarding leve
para liberar valor. Movimento mais comum em 2025-2026.

**Exemplos**: Slack, Datadog, Twilio, Vercel, Linear.

**Funil de conversão**:

```
Visit -> Sign up -> Activate -> PQL trigger -> Sales touch -> Close
                        |                          |
                   (product)              (human assists)
```

**O que dispara o toque de vendas (sinais PQL)**:

- Assentos/uso excede free tier em 20%+
- Segundo time ou departamento adicionado
- Página admin/billing visitada 3+ vezes
- Integração com sistema de produção conectada
- Volume de chamadas API cruza limiar
- Feature gate em capacidade enterprise

**PQL vs MQL — comparação de performance**:
| Tipo de lead | Conversão média para pago | Eficiência relativa |
|-----------|----------------------|---------------------|
| MQL | 5-10% | Baseline |
| PQL | 25-30% | 3-5x melhor |
| PQL (ACV US$ 1-5K) | 30% | 4x melhor |
| PQL (ACV US$ 5-10K) | 39% | 5-6x melhor |

**Requisitos**: Analytics de produto (Amplitude/Mixpanel/PostHog), modelo de pontuação PQL,
integração com CRM para exibir PQLs, handoff claro produto→vendas.

**Regra crítica**: Vendas precisa agregar valor além do que o produto demonstrou.
Foque em rollout em time, revisão de segurança, preço customizado, ajuda com integração.

### 2C. PLG com assistência de vendas

**Quando funciona**: Preço mais alto, simples o bastante para try-before-buy.
**Exemplos**: Figma Enterprise, GitHub Enterprise, Airtable Enterprise.

Adoção bottom-up dispara venda top-down. Tier individual grátis (US$ 0-20/usuário/mês)
alimenta adoção. Tier enterprise (US$ 30-100/usuário/mo) agrega SSO, SCIM, audit logs,
CSM dedicado. O gap cria conversa natural de vendas.

**Sinais de upmarket**: 10+ usuários do mesmo domínio no free tier, pedidos SSO/SAML,
time de procurement entrando em contato, padrões de fluxo enterprise.

### 2D. Sales-led

**Quando funciona**: Preço alto, complexidade alta, comitê de compra multi-stakeholder,
revisão de segurança/compliance obrigatória.
**Exemplos**: Salesforce, Workday, Snowflake (enterprise), Palantir.

| Métrica                      | Mediana     | Quartil superior |
| ---------------------------- | ----------- | ---------------- |
| Lead para oportunidade       | 13-15%      | 20%+             |
| Oportunidade para fechamento | 20-25%      | 30%+             |
| Ciclo médio de vendas        | 90-180 dias | 60-90 dias       |
| Payback de CAC (meses)       | 18-24       | 12-15            |

Mesmo motions sales-led se beneficiam de demos interativas, sandboxes e POCs.
A diferença é um humano guiando o processo em vez de só o produto.

### 2E. Descoberta liderada por agentes (emergente, 2025-2026)

**O que é**: Agentes de IA fazem prospecção, qualificação, abordagem inicial
e agendamento de reuniões. Humanos fazem discovery, demos, negociação e
fechamento.

**Checagem da realidade atual (dados 2026)**:
| Métrica | Estado atual |
|-------------------------------------|----------------------|
| Crescimento de pipeline (bem implementado) | 3-8x |
| Redução de CAC (melhor caso) | 30-42% menor |
| Taxa de falha em 6 meses | 85% dos deployments |
| Taxa de resposta em outreach de IA | 0,5-1% (genérico) |
| Taxa de resposta humano assistido por IA | 3-5% (personalizado) |
| Taxa de resposta escrita por humano | 3-5% (baseline) |
| Economia de tempo por SDR | 4-7 h/semana |

**Por que 85% falham**: Copy genérico de IA (90% menos resposta), sem camada de revisão humana,
tratar IA como substituto e não amplificador, ICP ruim em escala.

**O que funciona**: IA faz pesquisa + montagem de lista + primeiro rascunho de personalização.
Humano revisa antes de enviar. IA faz sequenciamento + agendamento. Humano conduz
todas as conversas ao vivo.

**Níveis de implementação**:

| Nível | Risco | O que a IA faz                               | Ganho  |
| ----- | ----- | -------------------------------------------- | ------ |
| 1     | Baixo | Rascunhos, enriquecimento, agendamento       | 2-3x   |
| 2     | Médio | Templates aprovados, lead scoring, follow-up | 3-5x   |
| 3     | Alto  | Sequências completas, booking, qualificação  | 5-8x\* |

\*Nível 3 tem taxa de falha de 85%. Só viável com ICP apertado, produto simples, ACV baixo.

**Recomendação**: Comece no Nível 1. Vá ao Nível 2 após 90+ dias de taxas de resposta
positivas. Evite Nível 3 exceto se ACV menor que US$ 1K.

---

## 3. Experiências de valor antes da compra

Dar valor real ao prospect antes do pagamento converte em taxas muito maiores
do que pitch frio. Vale para todos os tipos de motion.

### Táticas de valor antes da compra, ordenadas por lift de conversão

| Tática                     | Lift vs pitch frio | Melhor para              |
| -------------------------- | ------------------ | ------------------------ |
| Auditoria/varredura grátis | 4-7x               | Segurança, SEO, ops      |
| Demo interativo            | 3-5x               | Produtos com UI complexa |
| Workflow/template pronto   | 2-4x               | Ferramentas de workflow  |
| Ambiente sandbox           | 2-3x               | Ferramentas dev, APIs    |
| Workshop/webinar ao vivo   | 2-3x               | Venda com muito ensino   |
| Calculadora de ROI         | 1,5-2x             | Produtos ACV alto        |
| Free tier/freemium         | 1,5-2x             | SaaS horizontal          |

### Notas de implementação

**Auditoria/varredura grátis**: Automatize análise do estado atual do prospect, entregue
relatório personalizado. Custo: 2-4 semanas de engenharia. Prospect recebe valor real,
você recebe sinal qualificado.

**Demo interativo**: Tour guiado, sem cadastro, 2-5 min para
completar. 18% dos sites B2B SaaS têm um (subida de 40% YoY). Ferramentas: Navattic,
Storylane, Arcade, Consensus. Precisa terminar no momento de valor, não num muro de cadastro.

**Workflow/template pronto**: Setup pré-configurado mostrando valor do produto
na hora. Reduz TTFV de horas para minutos. Precisa resolver um problema real.

**Sandbox**: Acesso completo com dados de exemplo pré-carregados, resetável.
Melhor quando o produto precisa de dados para demonstrar valor. Precisa parecer real.

### Escolhendo a tática certa

- Produto analisa algo que o prospect já tem → **Auditoria/varredura grátis**
- Produto tem UI complexa que explicação → **Demo interativo**
- Produto automatiza um workflow → **Workflow/template pronto**
- Produto precisa de dados para mostrar valor → **Ambiente sandbox**
- Nenhuma das acima → **Calculadora de ROI ou free tier**

---

## 4. Time-to-first-value (TTFV) como norte

TTFV mede o tempo da primeira interação com o produto até o momento em que o usuário
reconhece valor concreto. Cada minuto extra no TTFV aumenta a probabilidade de churn.
Reduzir TTFV é a otimização de maior alavancagem para
qualquer motion product-led ou híbrido.

### Benchmarks de TTFV por tipo de produto

| Tipo de produto         | TTFV alvo        | Máx tolerável | O que significa "valor"               |
| ----------------------- | ---------------- | ------------- | ------------------------------------- |
| API/Ferramenta dev      | menor que 5 min  | 15 min        | Primeira chamada API com sucesso      |
| Workflow/automação      | menor que 15 min | 30 min        | Primeiro workflow rodando             |
| Analytics/BI            | menor que 30 min | 2 horas       | Primeiro insight com dados próprios   |
| Agente/assistente de IA | menor que 1 hora | 4 horas       | Primeira tarefa concluída pelo agente |
| Plataforma enterprise   | menor que 1 dia  | 1 semana      | Primeiro time usando feature central  |
| Infraestrutura          | menor que 1 dia  | 3 dias        | Primeiro deploy em produção           |

### Passos para otimizar TTFV

1. **MAPEAR** - Grave 10 sessões de novo usuário, identifique cada passo até o momento de valor
2. **ELIMINAR** - Cadastro só com e-mail, pule pesquisas, preencha padrões
3. **PRÉ-CARREGAR** - Dados de exemplo, templates, integrações pré-conectadas
4. **GUIAR** - Checklist na UI, tooltips contextuais, estados vazios orientados à ação
5. **MEDIR** - Taxa de ativação, tempo até ativar, segmente por fonte/persona

### Anti-padrões de TTFV

| Anti-padrão                             | Correção                                        |
| --------------------------------------- | ----------------------------------------------- |
| Formulário obrigatório com 10 campos    | Só e-mail, profiling progressivo depois         |
| Tour de features antes de qualquer ação | Pule o tour, guie a primeira ação significativa |
| Dashboard vazio no primeiro load        | Dados de exemplo ou template pré-carregado      |
| "Fale com vendas" antes do trial        | Dê acesso ao trial, dispare vendas por uso      |
| Wizard de config com 20 passos          | Wizard de 3 passos, adie o restante             |

---

## 5. Arquitetura do motion híbrido

O motion híbrido (vendas product-led) é o modelo dominante em 2025-2026.
Self-serve puro luta para ir upmarket. Sales-led puro quebra sob
CAC crescente (payback mediano de CAC agora ~20 meses). A abordagem vencedora
combina as duas.

### Estrutura do motion híbrido

```
ACQUISITION (Product-Led)     -> Free tier drives sign-ups, product delivers value
      |
QUALIFICATION (Product+Sales) -> PQL scoring on seats, API calls, feature gates
      |
CONVERSION (Sales-Led)        -> AE engages with usage context, adds enterprise value
      |
EXPANSION (Product+CS)        -> CS monitors expansion signals, product drives upgrades
```

### Quando adicionar vendas ao PLG

Não contrate vendas cedo demais. Só adicione vendas quando estes sinais aparecerem:

| Sinal                                       | Por que importa                        |
| ------------------------------------------- | -------------------------------------- |
| Usuários grátis pedindo features enterprise | Demanda puxada, não empurrada          |
| 10+ usuários da mesma empresa no free tier  | Adoção bottom-up acontecendo           |
| Negócios travando em procurement/legal      | Humano preciso para navegar o processo |
| Ticket médio passando de ~US$ 5K ACV        | ROI justifica envolvimento de vendas   |
| Conversão grátis→pago estagnando            | Produto sozinho bateu no teto          |

### Estrutura de time híbrido

| Estágio de ARR | Composição do time                                         |
| -------------- | ---------------------------------------------------------- |
| US$ 1-5M       | 1-2 AEs (PQL/inbound), 0-1 SDR (outbound alto valor), 1 CS |
| US$ 5-20M      | 3-5 AEs por segmento, 1-2 SDRs, 2-3 CS/AMs, 1 RevOps       |

A primeira contratação em vendas precisa ser proficiente no produto, capaz de demo técnica. Não um
AE tradicional rodando MEDDIC em prospect frio.

### Métricas do híbrido

| Métrica                             | Alvo             | Alerta vermelho    |
| ----------------------------------- | ---------------- | ------------------ |
| Taxa PQL→fechamento                 | 25-30%           | menor que 15%      |
| Payback de CAC assistido por vendas | 12-15 meses      | maior que 20 meses |
| % self-serve na receita nova        | 30-50%           | menor que 15%      |
| Receita de expansão % do total      | 25-40%           | menor que 15%      |
| Conversão grátis→pago               | 5-8% (freemium)  | menor que 2%       |
| TTFV para novos cadastros           | menor que 15 min | maior que 60 min   |

---

## 6. Benchmarks de CAC e eficiência

| Motion                          | CAC mediano     | Payback de CAC (meses) | Alvo LTV:CAC |
| ------------------------------- | --------------- | ---------------------- | ------------ |
| PLG puro                        | US$ 200-800     | 4-9                    | 5:1+         |
| Híbrido PLG + vendas            | US$ 800-3.000   | 9-15                   | 4:1+         |
| PLG assistido por vendas        | US$ 2.000-8.000 | 12-18                  | 3,5:1+       |
| Sales-led                       | US$ 5.000-25K+  | 18-24                  | 3:1+         |
| Descoberta liderada por agentes | US$ 1.000-5.000 | 8-14                   | 4:1+         |

**Redução de CAC por horizonte**:

- Semanas: demo interativo no site, pontuação PQL, onboarding self-serve
- Meses: free tier/trial, motor de conteúdo, analytics de produto, programa de indicação
- Trimestres: migrar para mix inbound/PLG, loops virais, comunidade/ecossistema

---

## 7. Caminhos de migração de motion

**PLG → Híbrido** (gatilho: usuários enterprise travando em procurement):

1. Instrumente sinais PQL (assentos, uso, feature gates)
2. Defina limiar (ex.: 5+ usuários ativos do mesmo domínio)
3. Contrate AE proficiente no produto, construa tier enterprise (SSO, admin, compliance)
4. Integração CRM para exibir PQLs. Alvo: 25%+ taxa PQL→fechamento

**Sales-led → Híbrido** (gatilho: payback de CAC maior que 20 meses):

1. Construa tier grátis/trial para auto-qualificação
2. Demo interativo no site, rastreamento de uso no free tier
3. Treine AEs para usar dados de uso. Alvo: redução de 20-30% no CAC em 2 trimestres

**Alinhamento de preço**:

| Estágio            | Modelo de preço                                    |
| ------------------ | -------------------------------------------------- |
| PLG puro           | Freemium ou usage-based, billing self-serve        |
| Adicionando vendas | Contrato anual com desconto por volume             |
| Híbrido completo   | Self-serve (mensal) + negociado por vendas (anual) |
| Subindo no mercado | Tier enterprise com preço customizado              |

---

## 8. Decisão free trial vs freemium

Use **freemium** quando: efeitos virais/rede, custo marginal baixo por usuário grátis,
gatilhos naturais de upgrade, mercado competitivo onde grátis é table stakes.

Use **free trial** quando: valor fica claro rápido, custo marginal alto por usuário,
urgência melhora conversão, compradores enterprise esperam trial antes do procurement.

**Reverse trial** (produto completo por 14 dias, depois cai para free tier) combina
baixa fricção com urgência. Funciona quando recursos premium são claramente valiosos.

### Taxas trial→pago por indústria

| Indústria      | Taxa | Indústria          | Taxa   |
| -------------- | ---- | ------------------ | ------ |
| CRM            | 29%  | Gestão de projetos | 18%    |
| AdTech         | 24%  | Ferramentas dev    | 15%    |
| Software de RH | 23%  | Enterprise SaaS    | 10-15% |

---

## 9. Playbooks por estágio

| Estágio                           | Ações-chave                                                           |
| --------------------------------- | --------------------------------------------------------------------- |
| Fundador solo (menor que US$500K) | PLG puro, trial opt-in, TTFV menor que 5 min, sem contratar vendas    |
| Seed (US$500K–2M)                 | Adicione pontuação PQL, primeiro AE com 10+ PQLs/mês, tier enterprise |
| Série A+ (US$2M+)                 | Formalize híbrido, segmente por ACV, RevOps, agent-led Nível 1        |

---

## 10. Erros comuns

| Motion  | Erro                                            | Impacto                      |
| ------- | ----------------------------------------------- | ---------------------------- |
| PLG     | Free tier generoso demais                       | Conversão menor que 1%       |
| PLG     | Sem onboarding de ativação                      | Churn de cadastro 70%+       |
| PLG     | Medir cadastros, não ativações                  | Métricas de vaidade          |
| Vendas  | Contratar AEs antes da demanda existir          | Queima dispara               |
| Vendas  | Sem demo interativo no site                     | 40% menos leads qualificados |
| Vendas  | Mesmo processo para negócios de US$5K e US$500K | Sub/superserviço             |
| Híbrido | Vendas ligando para PQLs cedo demais            | Mata confiança product-led   |
| Híbrido | Definição de PQL frouxa                         | Vendas perde tempo           |
| Híbrido | Gap de preço entre tiers grande                 | Zona morta de conversão      |

---

## Exemplos

- **Usuário diz:** "Devemos ser PLG ou sales-led?" → **Resultado:** O agente pergunta ACV e complexidade do produto; usa cola rápida (ex. ACV simples menor que US$ 1K → PLG puro; US$ 10–50K → híbrido); recomenda alvo de TTFV por categoria (API menor que 5 min, workflow menor que 15 min, enterprise menor que 1 dia) e LTV:CAC mínimo 3:1.
- **Usuário diz:** "Nossos usuários grátis não convertem" → **Resultado:** O agente checa ativação (alvo maior que 40% atingem momento de valor) e definição de PQL; sugere design valor-antes-da-compra e pressão de upgrade no limite; alerta sobre vendas tocar PQLs cedo demais no híbrido.
- **Usuário diz:** "Desenhe nosso sales motion" → **Resultado:** O agente mapeia estado atual (inbound/outbound/PLG); recomenda motion a partir de ACV e complexidade; descreve alvos de TTFV, NRR, % self-serve; conecta a ai-pricing e gtm-metrics.

## Solução de problemas

- **Sub/superserviço** → **Causa:** Mesmo processo para US$ 5K e US$ 500K. **Correção:** Segmentar por ACV; self-serve para baixo, AE para alto; definir PQL e quando vendas entra.
- **Híbrido mata confiança no PLG** → **Causa:** Vendas tocando PQLs cedo demais. **Correção:** Deixe o produto liderar ativação primeiro; vendas em expansão ou multi-stakeholder; critérios claros de handoff.
- **Zona morta de conversão** → **Causa:** Gap de preço entre tiers grande. **Correção:** Adicionar tier intermediário ou passo usage-based; mirar maior que 25% conversão PQL; testar sensibilidade a preço.

---

Para checklists, benchmarks e perguntas de discovery leia `references/quick-reference.md` quando precisar de referência detalhada.

---

## Skills relacionadas

- **positioning-icp** - Defina ICP e posicionamento antes de escolher um motion
- **ai-pricing** - Defina tiers de preço alinhados ao motion escolhido
- **ai-cold-outreach** - Execute outbound para motions sales-led ou híbridos
- **ai-sdr** - Construa e gerencie fluxos de SDR assistidos por IA
- **multi-platform-launch** - Coordene lançamento em canais para qualquer motion
- **solo-founder-gtm** - Playbook de GTM quando você é o time de vendas inteiro
- **gtm-metrics** - Acompanhe as métricas certas para o seu tipo de motion
