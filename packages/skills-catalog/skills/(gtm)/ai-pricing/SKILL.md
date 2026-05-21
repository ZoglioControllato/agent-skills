---
name: ai-pricing
description: 'Use quando o usuário quiser precificar um produto com IA, escolher a métrica de cobrança, desenhar faixas de preço ou otimizar margens. Também use quando mencionar AI pricing, cobrança por uso, consumo, precificação por resultado, BYOK, trazer a própria chave, por assento, tiers de preço, margens de IA, custo por token ou modelo de pricing. Cobre estratégia de preço, empacotamento e gestão de margem para produtos nativos de IA. NÃO use para implementação técnica, revisão de código ou arquitetura de software.'
metadata:
  original_author: Chad Boyda / agent-gtm-skills
  modified_by: Felipe Rodrigues - github.com/felipfr
  source: https://github.com/chadboyda/agent-gtm-skills
  version: '1.0.0'
---

# Skill de precificação para IA

Você é estrategista de precificação para produtos com IA. Ajuda fundadores, líderes de produto e times de GTM a escolher a métrica de cobrança certa, desenhar tiers, definir metas de margem e montar pacotes que escalam com o valor para o cliente — com exemplos adaptáveis ao contexto brasileiro quando fizer sentido; conteúdo de referência no ecossistema Controllato Club (PT-BR do agent-skills). Ancora cada recomendação nas economias específicas de produtos com IA — custo de compute variável, margens inicialmente menores que em SaaS tradicional e o fato de o modelo de preço redesenhar todo o motion de GTM.

## Antes de começar

- Pergunte que tipo de produto com IA está sendo precificado (copiloto, agente, serviço habilitado por IA, API/plataforma)
- Esclareça o comprador-alvo (dev, usuário business, procure enterprise, founder SMB)
- Entenda o pricing atual se houver migração (por assento, valor fixo, gratuito)
- Pergunte a estrutura de custo de IA subjacente (modelos, tokens médios por tarefa, hosting)
- Determine a métrica de valor principal para o cliente (tempo economizado, tarefas concluídas, receita gerada)
- Pergunte o cenário competitivo e quanto custam hoje os substitutos para o comprador
- Entenda o motion de vendas (self-serve, com assistência de vendas, enterprise): isso limita o desenho de preço
- Verifique contratos ou compromissos que limitem mudanças de preço

## As três métricas de cobrança

Toda decisão de precificação de IA começa pela métrica de cobrança: a unidade de valor pela qual você fatura. Se errar aqui, tudo downstream quebra.

| Métrica de cobrança | O que você cobra                                                  | Exemplos reais                                                                              | Melhor quando                                                    | Cuidado com                                                                 |
| ------------------- | ----------------------------------------------------------------- | ------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- | --------------------------------------------------------------------------- |
| Consumo             | Por token, chamada de API, minuto de compute, crédito             | OpenAI API ($0.01/1K tokens), AWS Bedrock (por token), Anthropic API                        | Comprador técnico quer controle granular; jogo de plataforma/API | Cliente com medo de usar o produto; fatura imprevisível mata adoção         |
| Fluxo de trabalho   | Por execução de automação, tarefa de agente, documento processado | n8n (por run), Jasper (por peça), DocuSign (por envelope)                                   | Valor claro de tempo por tarefa; fronteiras fáceis de definir    | É preciso definir limites da tarefa com precisão; scope creep corrói margem |
| Resultado           | Por ticket resolvido, lead qualificado, match bem-sucedido        | Intercom Fin ($0.99/resolução), Sierra (por resultado), Salesforce Agentforce ($2/conversa) | Máximo alinhamento de valor; resultado mensurável e atribuível   | Você absorve variabilidade de custo; precisa definir “sucesso” com precisão |

### Quadro de decisão: escolhendo a métrica de cobrança

```
START HERE
    |
    v
Can the customer measure a specific business outcome
from your product? (resolved ticket, qualified lead, closed deal)
    |
   YES --> Is the outcome clearly attributable to YOUR product
    |      (not shared with other tools)?
    |          |
    |         YES --> OUTCOME-BASED pricing
    |          |      Charge per resolved ticket, per qualified lead
    |         NO  --> WORKFLOW pricing
    |                 Charge per task/run (shared attribution = charge for the work)
    |
   NO --> Does the customer perform discrete, countable tasks?
    |      (document processed, image generated, report created)
    |          |
    |         YES --> WORKFLOW pricing
    |          |      Charge per task, per run, per document
    |         NO  --> CONSUMPTION pricing
                      Charge per token, per API call, per credit
```

### Créditos: a camada de abstração

Créditos ficam entre consumo bruto e o cliente. Permitem mudar custo subjacente sem repricingar. Houve ~126% de crescimento na adoção de modelo de créditos entre SaaS do fim de 2024 ao fim de 2025.

**Como os créditos funcionam na prática:**

| Componente         | Exemplo                                                     |
| ------------------ | ----------------------------------------------------------- |
| Unidade de crédito | 1 crédito = 1 tarefa padrão                                 |
| Tarefa simples     | 1 crédito (ex.: resumir email)                              |
| Tarefa média       | 3 créditos (ex.: rascunho de resposta)                      |
| Tarefa complexa    | 10 créditos (ex.: relatório completo de research)           |
| Pacote mensal      | Starter: 500 créditos, Pro: 2.000, Enterprise: sob consulta |

**Quando usar créditos vs. medição direta:**

| Use créditos quando                                     | Use medição direta quando                             |
| ------------------------------------------------------- | ----------------------------------------------------- |
| Vários tipos de tarefa com custos diferentes            | Um único tipo de tarefa (chamadas de API, resoluções) |
| Precisa flexibilidade de pricing enquanto modelos mudam | Comprador espera custo transparente por unidade       |
| Agrega features entre linhas de produto                 | Público dev quer métricas cruas                       |
| Quer não expor economia em tokens                       | Posicionamento open-source ou API-first               |

**Exemplo de créditos Salesforce Agentforce:**

- 20 Flex Credits = 1 ação
- $500 compra 100.000 créditos
- Case Management: 3 ações = 60 créditos = $0,30 por caso
- Field Service Scheduling: 6 ações = 120 créditos = $0,60 por appointment
- Créditos mascaram custos de modelo e permitem à Salesforce alocar compute sem repricing.

## Três arquétipos de produto e seus preços

O arquétipo determina modelo de cobrança, margem-alvo e motion de GTM. A maioria dos produtos de IA encaixa em um de três.

### Comparativo dos arquétipos

| Dimensão             | Copiloto (aumentar humano)                                                | Agente (substituir tarefa humana)                      | Serviço habilitado por IA                      |
| -------------------- | ------------------------------------------------------------------------- | ------------------------------------------------------ | ---------------------------------------------- |
| O que faz            | Ajuda um humano a fazer o trabalho                                        | Conclui de forma autônoma uma tarefa definida          | Entrega um serviço com IA no centro            |
| Modelo de preço      | Por assento ou assento + créditos                                         | Por resultado ou por fluxo                             | Projeto, retainer ou por entregável            |
| Margem bruta-alvo    | 70–80%                                                                    | 50–65%                                                 | 60–75%                                         |
| Exemplo              | GitHub Copilot ($19/assento/mês), Copilot Microsoft 365 ($30/assento/mês) | Intercom Fin ($0.99/resolução), Sierra (por resultado) | Jasper (planos de conteúdo), Harvey (legal IA) |
| Narrativa de valor   | "Seu time faz mais com menos esforço"                                     | "O trabalho sai sem um humano"                         | "Saída nível expert por fração do custo"       |
| Comprador            | Chefe de área, procurement de TI                                          | Líder de operações, CFO                                | Founder, dono de agência, diretor              |
| Motion de vendas     | Self-serve a assistido                                                    | Assistido a enterprise                                 | Assistido a high-touch                         |
| Alavanca de expansão | Mais assentos, mais uso por assento                                       | Mais tipos de tarefa, mais volume                      | Mais entregáveis, mais fluxos                  |

### Aprofundamento: pricing de copiloto

Por-assento faz sentido para copilotos porque a unidade de valor é o humano capacitado. O humano continua no circuito — você cobra pela capacidade ampliada.

**Tiers por assunto (molde para copiloto):**

| Tier       | Preço                        | Inclui                                       | Alvo                               |
| ---------- | ---------------------------- | -------------------------------------------- | ---------------------------------- |
| Individual | $15–25/assento/mês           | Recursos IA core, teto de uso                | Contributor individual, freelancer |
| Equipe     | $25–50/assento/mês           | Colaboração, tetos maiores, integrações      | Times de 5–50                      |
| Enterprise | Custom ($40–100/assento/mês) | SSO, logs de auditoria, uso “ilimitado”, SLA | 50+ assentos, procurement          |

**GitHub Copilot — evolução (exemplo real):**

- Tier free: 2.000 completions + 50 msgs chat/mês
- Pro: $10/mês (completions ilimitadas, 300 premium requests)
- Pro+: $39/mês (1.500 premium, modo agent)
- Business: $19/assento/mês (gestão org, políticas)
- Enterprise: $39/assento/mês (knowledge bases, fine-tuning)

### Aprofundamento: pricing de agente

Agentes substituem tarefas humanas. O preço deve refletir o valor do trabalho concluído, não quantidade de humanos usando a ferramenta. Por-assento costuma falhar aqui.

**Desenhar pricing por resultado (molde agente):**

| Passo                  | Ação                             | Exemplo                                              |
| ---------------------- | -------------------------------- | ---------------------------------------------------- |
| 1. Definir resultado   | O que conta como “feito”?        | Ticket totalmente resolvido sem escalonamento humano |
| 2. Preço por resultado | Ancorar no custo humano / 3–10×  | Humano custa ~$15/ticket — cobrar $0,99–2,00         |
| 3. Mínimo contratado   | Piso mensal para previsibilidade | Mínimo 50 resoluções/mês                             |
| 4. Tiers por volume    | Desconto em escala               | 1–500: $0,99; 501–2000: $0,79; 2000+: $0,59          |
| 5. Não-resultado       | E se falhar?                     | Escalonar humano = sem cobrança                      |

**Exemplos reais:**

| Empresa               | Resultado                  | Preço                | Equivalente humano |
| --------------------- | -------------------------- | -------------------- | ------------------ |
| Intercom Fin          | Conversa suporte resolvida | $0.99/resolução      | $5–15/ticket       |
| Sierra                | Interação concluída        | Custom por resultado | $8–25/interação    |
| Salesforce Agentforce | Conversa tratada           | $2/conversa          | $5–15/conversa     |

### Aprofundamento: serviços habilitados por IA

Parecem agências/consultoria, rodando infra de IA no fundo. O comprador quer qualidade e velocidade da entrega, não tecnologia específica.

**Molde de precificação de serviço:**

| Modelo               | Estrutura                      | Ideal para                                  |
| -------------------- | ------------------------------ | ------------------------------------------- |
| Retainer mensal      | $2K–25K/mês escopo definido    | Conteúdo contínuo, análises, support        |
| Por projeto          | $5K–50K por projeto            | Entrega única (auditoria, migração)         |
| Por entregável       | $50–500 por unidade            | Saídas escaláveis (relatos, designs, texto) |
| Retainer + excedente | Base + pagamento acima do teto | Base previsível com upside                  |

## Pricing híbrido

Modelos puros tem fraquezas: consumo assusta comprador; assento prejudica expansão; resultado transfere todo risco pra você. Híbridos equilibram previsibilidade, expansão e proteção de margem.

**A fórmula híbrida:**

```
Platform Fee (predictable base) + Usage/Outcome Component (grows with value)
= Revenue that scales with customer success
```

**Adoção no mercado:** preço híbrido saltou de 27% para 41% das empresas B2B em 12 meses (Growth Unhinged 2025). Puro por-assento caiu de 21% para 15% no mesmo período.

### Padrões de modelo híbrido

| Padrão              | Estrutura                                  | Exemplo                                          | Quando usar                                  |
| ------------------- | ------------------------------------------ | ------------------------------------------------ | -------------------------------------------- |
| Base + consumo      | Taxa de plataforma + excedente por unidade | $99/mês + $0,05/API acima de 10K                 | API/plataforma com uso variável              |
| Base + créditos     | Taxa + alocação de créditos                | $199 inclui 1.000 créditos; depois $0,15/crédito | Produto multifuncional custos assimétricos   |
| Base + resultado    | Taxa + por resultado                       | $499/mês + $0,99/ticket resolvido                | Produto tipo agente com resultado mensurável |
| Assento + consumo   | Assento + cap/overage em créditos          | $30/assento + créditos para ações IA             | Copiloto com alto uso de modelo              |
| Compromisso + burst | Anual sob demanda acima                    | $50K ano + uso além PAYG                         | Enterprise com orçamento previsível          |

### Desenhando seu híbrido

```
STEP 1: Set the platform fee
  - Covers your fixed costs (infra, support, maintenance)
  - Creates revenue predictability
  - Typically 30-50% of expected total revenue per customer

STEP 2: Choose the variable component
  - Match to your charge metric (consumption, workflow, outcome)
  - Set included usage in the base (the "free" allocation)
  - Price overage at 1.2-2x your unit cost

STEP 3: Design tier breaks
  - 3 tiers is the standard (Starter, Pro, Enterprise)
  - Each tier increases the included allocation 3-5x
  - Enterprise gets custom pricing and volume discounts

STEP 4: Add commitment incentives
  - Annual commit = 15-25% discount over monthly
  - Multi-year commit = additional 5-10% discount
  - Prepaid credits = 10-20% bonus credits
```

### Exemplo híbrido (agente de suporte IA)

| Componente            | Starter     | Pro          | Enterprise           |
| --------------------- | ----------- | ------------ | -------------------- |
| Taxa mensal           | $199        | $599         | Custom               |
| Resoluções incluídas  | 200/mês     | 1.000/mês    | Custom               |
| Excesso por resolução | $1,29       | $0,89        | $0,49–0,69           |
| Canais                | Só chat     | Chat + email | Todos                |
| SLA                   | Best effort | 99,5% uptime | 99,9% + CSM dedicado |
| Desconto anual        | 15%         | 20%          | Negociado            |

Pricing híbrido, BYOK, gestão de margem, tiers, impacto em GTM, migração, análise competitiva, anti-padrões e experimentação → `references/implementation-guide.md`.

## Exemplos

- **Usuário diz:** "Como precificamos nosso produto de IA?" → **Resultado:** Pergunta tipo de produto (copiloto/agente/serviço), buyer e métrica de valor; roda árvore consumo/workflow/outcome; recomenda fração entre 1/3 e 1/10 do custo humano equivalente; sugere três tiers e BYOK se enterprise exigir.
- **Usuário diz:** "Margem está baixa" → **Resultado:** Pergunta CPT e mix por tier; usa alavancas (modelo, cache, tiers, tetos); recomenda métricas de unit economics mensais e revisão trimestral.
- **Usuário diz:** "Devíamos ter BYOK?" → **Resultado:** Roda framework BYOK (demanda enterprise, margem, suporte); sugere gerenciado primeiro e tier BYOK se necessário; amarra ao gtm-engineering para cobrança.

## Solução de problemas

- **Clientes com medo de usar (usage-based)** → **Causa:** fatura imprevisível ou sem teto. **Fix:** caps, alertas ou híbrido (base + uso); comparar economia ao humano; prepay anual.
- **Métrica de cobrança errada** → **Causa:** valor difuso ou não mensurável. **Fix:** migrar fluxo/outcome quando der; ou simplificar assento/capacidade; revalidar win/loss e WTP.
- **Migração de modelo antigo** → **Causa:** contrato ou medo de mudança. **Fix:** playbook de migração em fases (6); grandfather; comunicar ≥90 dias; cohort de retenção.

---

Checklists, benchmarks e perguntas de discovery → `references/quick-reference.md` quando precisar de referência detalhada.

---

## Skills relacionadas

| Skill               | Relação                                                                 |
| ------------------- | ----------------------------------------------------------------------- |
| positioning-icp     | ICP molda WTP e qual métrica de cobrança ressoa                         |
| sales-motion-design | Modelo de preço ditam motion, compensação e desenho do time             |
| solo-founder-gtm    | Founders solo precisam do pricing mínimo viável; um tier e iterar       |
| gtm-metrics         | Unit economics (CPT, CPR, CPAM) alimentam decisões de preço             |
| expansion-retention | Estrutura de preços define expansão (uso, upgrade, novo produto)        |
| gtm-engineering     | Infra de billing precisa bater com o modelo (medição, créditos, fatura) |
