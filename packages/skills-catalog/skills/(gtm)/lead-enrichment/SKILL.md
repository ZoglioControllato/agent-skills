---
name: lead-enrichment
description: "Use quando o usuário quiser construir fluxos de enriquecimento de dados, pontuar leads em relação à ICP, configurar cascatas no Clay ou melhorar a qualidade de dados de contato. Use também quando o usuário mencionar 'enrichment,' 'data enrichment,' 'Clay,' 'waterfall enrichment,' 'ICP scoring,' 'lead scoring,' 'intent data,' 'contact verification,' 'Apollo,' 'ZoomInfo' ou 'data quality.' Esta habilidade cobre cascatas de enriquecimento de leads, frameworks de pontuação ICP e sistemas de verificação de contatos. NÃO use para implementação técnica, revisão de código ou arquitetura de software."
metadata:
  original_author: Chad Boyda / agent-gtm-skills
  modified_by: Felipe Rodrigues - github.com/felipfr
  source: https://github.com/chadboyda/agent-gtm-skills
  version: '1.0.0'
---

# Skill de enriquecimento de leads

Você é um arquiteto de enriquecimento de dados B2B. Você constrói sistemas de enriquecimento em waterfall, frameworks de pontuação de ICP e pipelines de verificação de contatos que maximizam a cobertura e minimizam o custo por lead verificado. Você domina o cenário de provedores e desenha fluxos que sequenciam fornecedores para maior ganho incremental.

## Antes de começar

Confirme com o usuário: (1) ICP alvo — setor, porte da empresa, geografia, persona; (2) stack atual — CRM, ferramentas de enriquecimento, plataformas de outreach; (3) lacunas de dados — quais campos faltam ou são pouco confiáveis; (4) volume — leads por mês; (5) orçamento — priorizar cobertura ou custo.

Se o usuário enviar um rascunho de fluxo ou uma tabela Clay existente, analise antes de sugerir mudanças.

---

## Seção 1: Framework de pontuação de ICP

### As três camadas de sinal

Toda pontuação de ICP combina três categorias distintas de sinais. Cada camada responde a uma pergunta diferente sobre se vale a pena perseguir uma conta.

| Camada de sinal | O que ela revela                          | Principais pontos de dados                                       | Ferramentas principais                   |
| --------------- | ----------------------------------------- | ---------------------------------------------------------------- | ---------------------------------------- |
| Firmográfica    | “Esta empresa está no nosso ponto ideal?” | Número de funcionários, ARR, setor, sede, estágio de funding     | Clay, Apollo, ZoomInfo, Clearbit         |
| Tecnográfica    | “Eles usam ferramentas que indicam fit?”  | Stack de tecnologia, CRM, automação de marketing, infra na nuvem | BuiltWith, Wappalyzer, HG Insights       |
| Intenção        | “Eles estão buscando ativamente agora?”   | Consumo de conteúdo, visitas ao G2, vagas, eventos de funding    | Bombora, G2 Buyer Intent, sinais do Clay |

### Fórmula de pontuação de ICP

```
ICP Score = (Firmographic Fit x 0.30) + (Technographic Fit x 0.30) + (Intent Score x 0.40)
```

Dê maior peso à intenção porque timing supera targeting puro. Uma empresa perfeitamente alinhada, mas sem intenção de compra, tende a converter pior do que uma empresa razoavelmente alinhada que está pesquisando soluções ativamente.

### Pontuação de fit firmográfico (0–100)

Pontue cada dimensão firmográfica e depois faça a média:

| Dimensão               | 100 (ideal)              | 75 (forte)            | 50 (aceitável)         | 25 (stretch)                     | 0 (descartar)                       |
| ---------------------- | ------------------------ | --------------------- | ---------------------- | -------------------------------- | ----------------------------------- |
| Número de funcionários | 50–200                   | 200–500               | 20–50 ou 500–1000      | 10–20 ou 1000–2000               | Menos de 10 ou mais de 2000         |
| Receita anual          | US$ 5M–50M               | US$ 50M–100M          | US$ 1M–5M              | US$ 100M–500M                    | Menos de US$ 1M ou mais de US$ 500M |
| Setor                  | SaaS B2B                 | Fintech, Healthtech   | Serviços profissionais | Varejo, mídia                    | Governo, educação                   |
| Geografia              | EUA, Reino Unido, Canadá | DACH, países nórdicos | ANZ, Benelux           | América Latina, Sudeste Asiático | Regiões sancionadas                 |
| Estágio de funding     | Série A–B                | Série C               | Seed, Série D+         | Pré-seed                         | Sem dados                           |

Ajuste as faixas ao perfil real de clientes com contrato fechado. Extraia faixas dos dados do CRM, não de suposições.

### Pontuação de fit tecnográfico (0–100)

Pontue com base em sinais de stack que indiquem prontidão para o seu produto:

```
Tech_Score = (Stack_Match x 0.50) + (Complexity_Signal x 0.30) + (Migration_Signal x 0.20)
```

**Correspondência de stack (0–100):** O ferramental atual deles cria oportunidade natural de integração ou substituição?

| Sinal                                       | Pontuação |
| ------------------------------------------- | --------- |
| Usa parceiro de integração direto seu       | 100       |
| Usa concorrente que vocês costumam deslocar | 85        |
| Usa ferramentas adjacentes na sua categoria | 60        |
| Stack genérico/desconhecido                 | 30        |
| Usa ferramenta que bloqueia adoção          | 0         |

**Sinal de complexidade (0–100):** A pegada tecnológica deles sugere que conseguem absorver seu produto?

| Sinal                                                        | Pontuação |
| ------------------------------------------------------------ | --------- |
| 3–5 ferramentas na sua categoria (prontos para consolidação) | 100       |
| Infra moderna na nuvem + APIs                                | 80        |
| 1–2 ferramentas, lacuna clara                                | 60        |
| Legado on-prem pesado                                        | 30        |
| Presença tecnológica indetectável                            | 10        |

**Sinal de migração (0–100):** Há sinais de troca?

| Sinal                                            | Pontuação |
| ------------------------------------------------ | --------- |
| Vaga para papel que “dona” da sua categoria      | 100       |
| Adoção recente de ferramenta adjacente           | 75        |
| Removeram concorrente do stack (delta BuiltWith) | 90        |
| Stack estável, sem mudanças em 12 meses          | 20        |

### Cálculo de score de intenção (0–100)

A pontuação de intenção exige combinar várias fontes. Nenhum provedor isolado cobre o quadro completo.

```
Intent_Score = max(Bombora_Surge, G2_Intent, First_Party) x 0.60
             + Hiring_Signal x 0.20
             + Funding_Signal x 0.20
```

**Pontuação Bombora Company Surge:**

| Surge Score  | Interpretação                              | Prioridade do lead                      |
| ------------ | ------------------------------------------ | --------------------------------------- |
| 80–100       | Pesquisa ativa intensa em vários tópicos   | Encaminhar ao SDR em até 24 horas       |
| 60–79        | Pesquisa moderada, ciclo de compra inicial | Entrar em nutrição + monitorar          |
| 40–59        | Pesquisa leve, pode ser ruído              | Pontuar com outros sinais antes de agir |
| Abaixo de 40 | Sem surge relevante detectado              | Não priorizar                           |

**Sinais G2 Buyer Intent:**

| Tipo de sinal                | Peso       | Por que importa               |
| ---------------------------- | ---------- | ----------------------------- |
| Visitou seu perfil no G2     | Alto       | Consideração de compra direta |
| Comparou você x concorrente  | Muito alto | Etapa de avaliação ativa      |
| Visitou página da categoria  | Médio      | Fase inicial de pesquisa      |
| Leu reviews na sua categoria | Médio–alto | Etapa de validação            |

**Sinais de intenção de primeira parte (seus próprios dados):**

| Sinal                                | Aumento na pontuação |
| ------------------------------------ | -------------------- |
| Visita à página de preços (2+ vezes) | +30                  |
| Visita à página de demo sem agendar  | +25                  |
| Baixou conteúdo com formulário       | +15                  |
| Blog (3+ páginas na mesma sessão)    | +10                  |
| E-mail aberto sem clique             | +5                   |

### Interpretação da pontuação composta

| Faixa de ICP Score | Ação                                   | SLA                            |
| ------------------ | -------------------------------------- | ------------------------------ |
| 85–100             | Lead quente — outreach imediato do SDR | Contato em até 4 horas         |
| 70–84              | Lead morno — sequência priorizada      | Entrar na fila em até 24 horas |
| 50–69              | Nutrição — drip automatizado           | Toques semanais de conteúdo    |
| 30–49              | Monitorar — checagem trimestral        | Re-pontuar mensalmente         |
| Abaixo de 30       | Descartar — não perseguir              | Arquivar, reavaliar em 6 meses |

---

## Seção 2: Arquitetura de waterfall de enriquecimento

### O que um waterfall faz

Um sistema de enriquecimento em waterfall consulta vários provedores de dados em sequência. Cada provedor tem chance de preencher campos faltantes. O sistema para de consultar um campo assim que um provedor devolve um resultado verificado.

Enriquecimento com um único provedor costuma entregar 55–65% de cobertura. Um waterfall bem montado leva a cobertura a 85–95% ao empilhar provedores complementares.

### Fluxo do waterfall

```
Input Lead
  |
  v
[Pre-qualification]  Filter before enriching (saves credits)
  |                   Reject: disposable emails, parked domains, wrong ICP
  v
[Step 1: Primary]    Apollo or ZoomInfo
  |                   Fields: name, title, email, company, phone
  v (missing fields?)
[Step 2: Secondary]  Hunter, Dropcontact (email specialists)
  |                   Fields: verified email, confidence score
  v (still missing?)
[Step 3: Tertiary]   FindyMail, Snov.io (deep search + verify)
  |                   Fields: email, phone, LinkedIn URL
  v (still missing?)
[Step 4: LinkedIn]   Clay AI enrichment
  |                   Fields: current title, company, location
  v
[Verification]       Bounce check, catch-all flag, dedup
  |                   Threshold: >85% confidence = deliverable
  v
[Score + Route]      Apply ICP score, push to sequence or nurture
```

### Escolha de provedores por caso de uso

Nem todo waterfall precisa dos mesmos provedores. Alinhe o stack ao seu mercado e orçamento.

**Outbound em alto volume (1000+ leads/mês):**

| Etapa     | Provedor                      | Motivo                                                          | Nível de custo |
| --------- | ----------------------------- | --------------------------------------------------------------- | -------------- |
| 1         | Apollo                        | Base grande, boa cobertura mid-market                           | $$             |
| 2         | Hunter                        | Padrões de e-mail em escala                                     | $              |
| 3         | FindyMail                     | Pega e-mails que Apollo e Hunter perdem (menos de 2% de bounce) | $$             |
| 4         | Clay AI                       | Enriquecimento LinkedIn, campos customizados                    | $$$            |
| Verificar | MillionVerifier ou ZeroBounce | Verificação em massa, baixo custo unitário                      | $              |

**Foco enterprise (menos de 500 leads/mês):**

| Etapa     | Provedor                | Motivo                                                          | Nível de custo |
| --------- | ----------------------- | --------------------------------------------------------------- | -------------- |
| 1         | ZoomInfo                | Melhor cobertura Fortune 1000 (23% contatos únicos)             | $$$$           |
| 2         | Clearbit (agora Breeze) | Enriquecimento HubSpot em tempo real, profundidade firmográfica | $$$            |
| 3         | Dropcontact             | Conformidade GDPR, gerado por algoritmo (sem base própria)      | $$             |
| 4         | Clay AI                 | Enriquecimento flexível + agente de IA para campos customizados | $$$            |
| Verificar | NeverBounce ou DeBounce | Verificação de alta precisão                                    | $              |

**Startup / orçamento enxuto (menos de 200 leads/mês):**

| Etapa     | Provedor           | Motivo                                       | Nível de custo |
| --------- | ------------------ | -------------------------------------------- | -------------- |
| 1         | Apollo (free tier) | 10 mil créditos/mês no plano gratuito        | Grátis         |
| 2         | Hunter (free tier) | 25 buscas/mês grátis                         | Grátis         |
| 3         | Snov.io            | Acessível por US$ 39/mês para 1.000 créditos | $              |
| Verificar | MillionVerifier    | US$ 0,0005/e-mail por volume                 | $              |

### Matriz comparativa de provedores

| Provedor          | Tamanho da base    | Precisão de e-mail            | Melhor para                            | Preço (anual) | Conformidade GDPR |
| ----------------- | ------------------ | ----------------------------- | -------------------------------------- | ------------- | ----------------- |
| ZoomInfo          | 220M+ contatos     | 95% (tripla verificação)      | Enterprise, Fortune 1000               | US$ 10K–50K   | Sim               |
| Apollo            | 275M+ contatos     | 65–80% (varia por região)     | Mid-market, alto volume                | US$ 1,2K–6K   | Sim               |
| Clearbit (Breeze) | 50M+ contatos      | 95% (tempo real)              | Usuários HubSpot, firmografia          | US$ 12K–36K   | Sim               |
| Hunter            | 100M+ e-mails      | Baseado em padrões (varia)    | Descoberta de e-mail em escala         | US$ 408–4.188 | Sim               |
| Dropcontact       | Gerado sob demanda | 72% taxa de achado            | Mercado UE, privacy-first              | US$ 960–4.800 | Sim (sem base)    |
| FindyMail         | Gerado sob demanda | >95% (verificado), <2% bounce | Recuperar e-mails perdidos             | US$ 588–2.388 | Sim               |
| Snov.io           | 60M+ contatos      | Verificação em 7 camadas      | Outbound econômico                     | US$ 468–2.988 | Sim               |
| Bombora           | N/A (só intenção)  | N/A                           | Dados de intenção, targeting por conta | US$ 25K–100K+ | Sim               |

### Cobertura incremental por etapa do waterfall

Ganhos típicos de cobertura ao adicionar cada provedor em sequência:

```
Step 1 (Apollo):      |========================          |  ~60% coverage
Step 2 (+Hunter):     |============================     |  ~75% coverage
Step 3 (+FindyMail):  |===============================  |  ~87% coverage
Step 4 (+Clay AI):    |=================================|  ~92% coverage
After verification:   |==============================   |  ~85% verified
```

A queda após verificação é esperada. Cerca de 5–8% dos e-mails encontrados falham em checagens de bounce ou caem em domínios catch-all que devem ser segmentados à parte.

---

## Seção 3: Desenho de fluxo no Clay

### Conceitos básicos da arquitetura Clay

O Clay opera em modelo de tabela. Cada linha é um lead. Cada coluna é um campo de dado. Etapas de enriquecimento rodam da esquerda para a direita, com waterfalls configurados por campo.

**Conceitos centrais do Clay:**

| Conceito                 | O que faz                                                   |
| ------------------------ | ----------------------------------------------------------- |
| Tabela                   | Sua lista de leads — importada via CSV, sync de CRM ou API  |
| Coluna de enriquecimento | Chama um provedor para preencher um campo específico        |
| Coluna waterfall         | Tenta vários provedores em sequência para um campo          |
| Coluna de IA             | Usa GPT/Claude para derivar insights de outras colunas      |
| Coluna fórmula           | Calcula valores a partir de outras colunas (como ICP score) |
| Push de integração       | Envia dados enriquecidos ao CRM, sequenciador ou webhook    |

### Guia de consumo de créditos

O Clay cobra créditos por ação de enriquecimento. Planeje o orçamento com cuidado.

| Tipo de ação                            | Créditos por linha | Exemplo                                          |
| --------------------------------------- | ------------------ | ------------------------------------------------ |
| Enriquecimento básico (1 provedor)      | 4–10               | Lookup de e-mail, cargo                          |
| Enriquecimento waterfall (3 provedores) | 12–30              | Waterfall de e-mail com fallbacks                |
| Coluna IA/GPT                           | 10–25              | Resumo de persona, extração de dor               |
| Automação multi-etapa                   | 30+                | Enriquecimento completo + pontuação + roteamento |

**Matemática de crédito:** 1.000 leads a 25 créditos/lead = 25.000 créditos. O plano Starter cobre isso em 12,5 meses, Explorer em 2,5 meses, Pro em 0,5 mês. Pré-filtre com agressividade para não queimar crédito em leads desqualificados.

### Preços Clay (2026)

| Plano      | Preço/mês    | Créditos/mês | Por crédito  |
| ---------- | ------------ | ------------ | ------------ |
| Free       | US$ 0        | 100          | N/A          |
| Starter    | US$ 149      | 2.000        | US$ 0,075    |
| Explorer   | US$ 349      | 10.000       | US$ 0,035    |
| Pro        | US$ 800      | 50.000       | US$ 0,016    |
| Enterprise | Sob consulta | Sob consulta | Sob consulta |

### Estrutura de exemplo de tabela Clay

Monte o fluxo de enriquecimento nesta ordem de colunas:

```
Col A: Company Domain        (input)
Col B: Contact Name          (input or enrichment)
Col C: LinkedIn URL          (Apollo waterfall)
Col D: Verified Email        (email waterfall: Apollo > Hunter > FindyMail)
Col E: Job Title             (Apollo or ZoomInfo)
Col F: Employee Count        (Clearbit or Clay built-in)
Col G: Industry              (Clearbit or Clay built-in)
Col H: Tech Stack            (BuiltWith via Clay)
Col I: Bombora Surge Score   (Bombora integration or manual import)
Col J: Firmographic Score    (Formula: weighted average of F, G, geography)
Col K: Technographic Score   (Formula: based on H match rules)
Col L: Intent Score          (Formula: based on I + hiring + funding signals)
Col M: ICP Score             (Formula: J*0.30 + K*0.30 + L*0.40)
Col N: AI Personalization    (AI column: generate first-line based on B, E, H)
Col O: Routing               (Formula: if M > 85 then "hot" elif M > 70 then "warm")
```

### Regras de governança de crédito

1. **Pré-qualificar antes de enriquecer** — checagem de domínio + filtro firmográfico antes de gastar no waterfall de e-mail
2. **Teto por campanha** — nenhuma campanha consome mais de 40% dos créditos mensais
3. **Alerta aos 75%** — alerta Slack/e-mail quando o uso passar de 75% da franquia mensal
4. **Auditoria semanal** — créditos gastos x leads enriquecidos x leads qualificados (meta: mais de 60% de qualificação)
5. **Re-enriquecimento a 90 dias** — re-enriquecer contatos parados antes de incluir em novas campanhas

---

## Seção 4: Pipeline de verificação de contatos

Listas frias sem verificação carregam 10–30% de endereços inválidos. Enviar para endereços ruins destrói reputação de envio em poucas campanhas. Google, Yahoo e Microsoft passaram a exigir taxas de bounce abaixo de 2% e reclamações de spam abaixo de 0,3%.

### Etapas do pipeline de verificação

| Etapa | Verificação                | Ação                                                       | Custo             |
| ----- | -------------------------- | ---------------------------------------------------------- | ----------------- |
| 1     | Validação de sintaxe       | Remover endereços malformados (falta @, pontos duplicados) | Grátis            |
| 2     | Consulta DNS/MX            | Confirmar domínio com servidor de e-mail válido            | Grátis            |
| 3     | Verificação SMTP           | Confirmar que a caixa existe no provedor                   | Conforme provedor |
| 4     | Detecção de catch-all      | Marcar domínios que aceitam qualquer endereço              | Conforme provedor |
| 5     | Checagem de conta genérica | Marcar info@, support@, admin@, sales@                     | Conforme provedor |
| 6     | Pontuação de confiança     | Atribuir score final de entregabilidade                    | Calculado         |

### Limiares de score de confiança

| Confiança      | Classificação           | Ação                                                       |
| -------------- | ----------------------- | ---------------------------------------------------------- |
| Acima de 0,85  | Entregável              | Seguro enviar. Incluir nas sequências.                     |
| 0,70–0,85      | Arriscado               | Enviar em lotes pequenos. Monitorar bounce por lote.       |
| 0,50–0,69      | Catch-all/Inverificável | Segmentar à parte. Máximo 50 por dia. Acompanhar de perto. |
| Abaixo de 0,50 | Inválido/Alto risco     | Rejeitar. Não enviar. Re-enriquecer com outro provedor.    |

### Tratamento de domínio catch-all

Domínios catch-all aceitam todo e-mail enviado, inclusive para endereços inexistentes. Isso gera deterioração silenciosa da entregabilidade: as campanhas parecem enviadas, mas não chegam a decisores.

**Regras para endereços catch-all:**

- Nunca misture endereços catch-all no pool principal de envio
- Envie segmentos catch-all a partir de um domínio de envio separado
- Limite a 20–50 envios catch-all por domínio de envio por dia
- Acompanhe taxa de resposta à parte; se cair abaixo de 1%, pare de enviar para aquele domínio
- Re-verifique endereços catch-all a cada 30 dias

### Comparação de ferramentas de verificação

| Ferramenta      | Método de verificação         | Detecção catch-all | Velocidade em massa | Preço             |
| --------------- | ----------------------------- | ------------------ | ------------------- | ----------------- |
| MillionVerifier | SMTP + proprietário           | Sim                | 1M/hora             | US$ 0,0005/e-mail |
| ZeroBounce      | SMTP + pontuação com IA       | Sim                | 100K/hora           | US$ 0,008/e-mail  |
| NeverBounce     | SMTP + API tempo real         | Sim                | 50K/hora            | US$ 0,008/e-mail  |
| DeBounce        | SMTP + detecção descartável   | Sim                | 500K/hora           | US$ 0,001/e-mail  |
| Bouncer         | SMTP + checagem de toxicidade | Sim                | 200K/hora           | US$ 0,005/e-mail  |

### Checklist de proteção à entregabilidade

Antes de enviar qualquer lista enriquecida para outreach:

- [ ] Todos os e-mails verificados nos últimos 7 dias
- [ ] Taxa de bounce na verificação abaixo de 2%
- [ ] Endereços catch-all segmentados em pool separado
- [ ] Contas genéricas (info@, support@) removidas ou despriorizadas
- [ ] Domínio de envio com SPF, DKIM e DMARC configurados
- [ ] Domínio de envio aquecido por pelo menos 14 dias
- [ ] Volume diário não ultrapassa 50 por caixa por dia (frio)
- [ ] Taxa de reclamação de spam em campanhas anteriores abaixo de 0,3%

---

## Seção 5: Benchmarks de performance

### Ganho de conversão esperado com enriquecimento

| Métrica                     | Antes do waterfall | Depois do waterfall        | Melhoria      |
| --------------------------- | ------------------ | -------------------------- | ------------- |
| Taxa de cobertura de e-mail | 55–65%             | 85–95%                     | +30–40%       |
| Taxa de bounce de e-mail    | 7–15%              | Inferior a 2% (verificado) | -70–85%       |
| Taxa de conexão (cold call) | 4–6%               | 8–12%                      | +80–100%      |
| Pipeline gerado             | Linha de base      | +37%                       | Significativa |
| Conversão reunião → cliente | Linha de base      | +27%                       | Significativa |
| Taxa MQL→SQL (com intenção) | 8–12%              | 15–25%                     | +80–100%      |

### Benchmarks de custo por lead verificado

| Abordagem                                  | Custo por lead | Cobertura       | Qualidade  |
| ------------------------------------------ | -------------- | --------------- | ---------- |
| Provedor único (Apollo)                    | US$ 0,05–0,15  | 60%             | Média      |
| Waterfall em duas etapas                   | US$ 0,15–0,35  | 78%             | Média–alta |
| Waterfall em três etapas                   | US$ 0,30–0,60  | 88%             | Alta       |
| Waterfall completo + verificação           | US$ 0,50–1,00  | 92% verificado  | Muito alta |
| Waterfall completo + pontuação de intenção | US$ 1,50–3,00  | 92% + pontuados | Premium    |

### Framework de cálculo de ROI

```
Cost:  Clay Pro ($800) + Apollo ($99) + FindyMail ($49) + MillionVerifier ($25) = $973/mo
Yield: 2,000 enriched > 1,840 verified (92%) > 1,012 ICP-qualified (55%)
       > 30 meetings (3%) > 12 opps (40%) > 3 closed-won (25%) at $15K ACV = $45K/mo
ROI:   $45,000 / $973 = 46x
```

Ajuste as taxas de conversão ao pipeline real. O framework importa mais que os números de exemplo.

---

## Seção 6: Conformidade

### Conformidade por região

| Requisito                      | EUA (CAN-SPAM/CCPA)    | UE (GDPR)          | Reino Unido (UK GDPR) |
| ------------------------------ | ---------------------- | ------------------ | --------------------- |
| Consentimento para e-mail B2B  | Modelo opt-out         | Interesse legítimo | Interesse legítimo    |
| Documentação de fonte de dados | Recomendado            | Obrigatório        | Obrigatório           |
| Direito ao apagamento          | CCPA: sim              | Obrigatório        | Obrigatório           |
| Retenção de dados              | Divulgação obrigatória | Definir e aplicar  | Definir e aplicar     |

### Notas sobre provedores

- **Dropcontact** gera contatos algoritmicamente sem base de dados (nativo em GDPR)
- **Apollo, ZoomInfo, Clearbit** são plataformas conformes; você mantém a base legal de uso
- **Clay** é conforme, mas provedores terceiros acessados via Clay podem não ser. Verifique cada um.
- **Dados cooperativos Bombora** são conformes; o outreach downstream deve seguir a regulamentação local

### Práticas seguras de enriquecimento

1. Documente sua base legal (interesse legítimo em contexto B2B é comum)
2. Rastreie qual provedor originou cada contato
3. Atenda opt-out e pedidos de apagamento em até 30 dias
4. Não enriqueça nem contate pessoas que já deram opt-out
5. Revise DPAs dos provedores anualmente

---

## Exemplos

- **Usuário diz:** "Quero montar enriquecimento de leads no outbound" → **Resultado:** O agente pergunta orçamento e volume; recomenda um pacote de waterfall (ex.: Clay + Apollo entre US$ 200–1K/mês); descreve etapas: importar → pré-filtrar → waterfall → verificar (confiança &gt;0,85) → pontuar → rotear para SDR/sequência; sugere push ao CRM e re-enriquecimento a 90 dias.
- **Usuário diz:** "Nossa taxa de bounce está alta" → **Resultado:** O agente revisa verificação (MillionVerifier, NeverBounce) e limiar de confiança; recomenda segmento catch-all e higiene de lista; sugere meta de &lt;2% de bounce e re-verificação antes de cada campanha.
- **Usuário diz:** "Quais ferramentas de enriquecimento usar?" → **Resultado:** O agente usa níveis de orçamento do guia rápido; mapeia provedores (Apollo, Clay, ZoomInfo, Clearbit, etc.); recomenda ordem primário/secundário/terciário e quando adicionar intenção (Bombora, G2).

## Solução de problemas

- **Baixa cobertura de e-mail após waterfall** → **Causa:** Provedores fracos ou ordem errada. **Correção:** Coloque o melhor provedor primeiro; adicione LinkedIn/FindyMail como fallback; meta &gt;85% de cobertura; rastreie taxa de preenchimento por provedor.
- **ICP score não prevê reuniões** → **Causa:** Pesos errados ou dados velhos. **Correção:** Recalibre pesos firmográficos/tecnográficos/comportamentais; garanta sinais de intenção atualizados; teste A/B nas faixas (ex.: &gt;85 quente, 70–84 morno).
- **Créditos queimando rápido** → **Causa:** Enriquecer todo mundo ou filtros ruins. **Correção:** Pré-filtre por domínio, setor, geo; defina limiar de confiança (ex.: 0,85 outreach, 0,50 nutrição); limite créditos por lead qualificado (&lt;50).

---

Para checklists, benchmarks e perguntas de descoberta, leia `references/quick-reference.md` quando precisar de referência detalhada.

---

## Skills relacionadas

- **positioning-icp** - Defina o ICP contra o qual o enriquecimento pontua. Comece aqui se o ICP estiver indefinido.
- **ai-cold-outreach** - Use dados enriquecidos em sequências frias personalizadas. O enriquecimento alimenta o outreach.
- **ai-sdr** - Automatize fluxos de SDR que consomem leads enriquecidos e pontuados.
- **gtm-engineering** - Construa a infraestrutura técnica (APIs, webhooks, integrações CRM) que liga o enriquecimento ao restante do stack.
- **solo-founder-gtm** - Enriquecimento otimizado para orçamento de fundadores que fazem outbound sozinhos.
