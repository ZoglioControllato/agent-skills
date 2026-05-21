# Adversário da Equipe Vermelha

Pensamento adversário e equipe vermelha para encontrar pontos fracos antes que os adversários o façam. Incorpora o modelo militar RED (reconhecer suposições, avaliar argumentos, tirar conclusões) e metodologias modernas de red teaming.

## Princípio Fundamental

A equipe vermelha pergunta: **"Se alguém quisesse quebrar, explorar ou manipular isso, como faria isso?"** O Louco adota a mentalidade de um adversário - não para causar danos, mas para encontrar vulnerabilidades antes que os adversários reais o façam. Isto aplica-se para além da segurança: concorrentes, utilizadores insatisfeitos, incentivos perversos e desafios regulamentares são todos forças adversárias.

## O modelo VERMELHO

O modelo RED do Manual de Pensamento Crítico Aplicado do Exército dos EUA fornece uma lista de verificação generalizável de três etapas aplicável a qualquer análise adversarial:

| Etapa                         | Ação                               | Perguntas-chave                                                                                      |
| ----------------------------- | ---------------------------------- | ---------------------------------------------------------------------------------------------------- |
| **R — Reconhecer suposições** | O que estamos dando como certo?    | O que teria que ser verdade para que isso fosse seguro? O que estamos presumindo sobre o adversário? |
| **E — Avaliar argumentos**    | Qual é a qualidade da evidência?   | Existem falácias lógicas? Quais caminhos alternativos de ataque existem?                             |
| **D — Tirar conclusões**      | O que os dados realmente suportam? | Que conclusões estamos                                                                               |

NÃO tem direito a desenhar sobre nossa postura de segurança? |

Aplique o RED antes de construir personas adversárias para garantir que a análise seja fundamentada.

## Processo

1. **Aplicar o modelo RED** — Reconhecer suposições sobre segurança/resiliência, avaliar as defesas existentes, tirar conclusões honestas
2. **Identifique o ativo** — O que você está protegendo? (sistema, decisão, estratégia, produto)
3. **Construa personas adversárias** — Quem atacaria isso e por quê?
4. **Mapear vetores de ataque** — Como cada persona exploraria os pontos fracos?
5. **Detectar incentivos perversos** — Como o sistema recompensa o comportamento errado?
6. \*\*Avalie-me

pacto** — Classificação por probabilidade x impacto 7. **Defesas de design\*\* — Contramedidas específicas para os vetores de classificação mais alta

## Construção da Persona Adversária

“Atacantes” genéricos produzem descobertas genéricas. Personas específicas produzem insights acionáveis.

### Modelo de Personagem

| Campo          | Descrição                                |
| -------------- | ---------------------------------------- |
| **Função**     | Quem é esse adversário?                  |
| **Motivação**  | Por que eles atacariam?                  |
| **Capacidade** | Que recursos e habilidades eles possuem? |
| **Acesso**     | A que eles já têm acesso?                |
| **Restrições** | O que os limita?                         |

### Personas Adversárias Comuns

| Pessoa                     | Motivação                        | Vetores típicos                                                     |
| -------------------------- | -------------------------------- | ------------------------------------------------------------------- |
| **Atacante Externo**       | Ganho financeiro, roubo de dados | Exploração de API, preenchimento de credenciais, ataques de injeção |
| **Concorrente**            | Vantagem de mercado              | Cópia de recursos, caça furtiva de talentos, campanhas FUD          |
| **Informante descontente** | Vingança, ganho financeiro       | Escalonamento de privilégios, exfiltração de dados, sabotagem       |
| **Usuário Descuidado**     | Nenhum (acidental)               | Configuração incorreta                                              |

, senhas fracas, compartilhamento de credenciais |
| **Regulador** | Aplicação da conformidade | Resultados de auditoria, violações de tratamento de dados, lacunas de acessibilidade |
| **Jogador Oportunista** | Benefício pessoal | Explorando lacunas na lógica de negócios, fraude de referência |
| **Ativista** | Objetivos ideológicos | Constrangimento público, vazamento de dados, interrupção de serviços |
| **Agente de IA** | Exploração automatizada | Injeção imediata, abuso de API em escala, verificação automatizada de vulnerabilidades

nada |

### Personas Específicas do Domínio

| Domínio             | Adversário Principal       | Foco                                                                  |
| ------------------- | -------------------------- | --------------------------------------------------------------------- |
| Comércio eletrônico | Fraudador                  | Ignorar pagamento, abuso de cupom, devoluções falsas                  |
| SaaS                | Abusador de nível gratuito | Evasão de limite de taxas, multicontabilidade, acumulação de recursos |
| Mercado             | Vendedor de má-fé          | Listagens falsas, manipulação de avaliações, jogos de garantia        |
| Plataforma API      | Raspador                   | Desvio de limite de taxa, coleta de dados, engenharia reversa         |
| Plataforma Social   | Fazenda de trolls/bots     | Spam, manipulação                                                     |

íon, noivado falso |
| Sistema de IA/ML | Atacante adversário | Envenenamento de dados, extração de modelo, injeção imediata |

## Identificação do vetor de ataque

### Por categoria

| Categoria              | Vetores                                                                         | Exemplo                                       |
| ---------------------- | ------------------------------------------------------------------------------- | --------------------------------------------- |
| **Técnico**            | Injeção, desvio de autorização, condições de corrida, SSRF                      | Injeção de SQL no parâmetro de pesquisa       |
| **Lógica de Negócios** | Desvio de fluxo de trabalho, manipulação estatal, adulteração de preços         | Aplicando cupom expirado via repetição de API |
| **Sociais**            | Phishing, pretexto, exploração de autoridade                                    | “Sou o CEO, preciso de acesso agora”          |
| **Operacional**        | Cadeia de suprimentos, envenenamento por dependência, informações privilegiadas |

ótimo | Pacote npm comprometido no pipeline de construção |
| **Informações** | Vazamento de dados, exposição de metadados, ataques de temporização | Enumeração de usuários via mensagens de erro de login |
| **Econômico** | Esgotamento de recursos, negação de carteira, custo assimétrico | Inundação de invocação Lambda causando conta de US$ 50 mil |
| **Específico para IA** | Injeção imediata, extração de dados de treinamento, manipulação de modelo | Injetando instruções por meio de conteúdo controlado pelo usuário |

### Construção de árvore de ataque

Para sistemas complexos, construa árvores de ataque para mapear caminhos até um objetivo.```
Goal: Steal user payment data
├── Path 1: Compromise the database
│ ├── SQL injection in search endpoint
│ ├── Credential theft from env variables in logs
│ └── Exploit unpatched database CVE
├── Path 2: Intercept in transit
│ ├── Downgrade TLS via misconfigured CDN
│ └── Man-in-the-middle on internal service mesh
└── Path 3: Abuse application logic
├── Export feature with insufficient access control
└── Admin panel with default credentials

````
### As 12 regras da mentalidade do time vermelho

Adaptado de ITS Tactical para análise de decisão:

1. Suponha que a resposta óbvia esteja errada
2. Procure ativamente evidências que refutem
3. Nunca aceite a primeira resposta
4. Trate o consenso como um sinal de alerta, não como uma conclusão
5. Distinguir entre o que é conhecido e o que é assumido
6. Identifique o que o defensor NÃO está protegendo
7. Encontre o ponto único de falha
8. Explorar a lacuna entre a política e a prática
9. Pense a tempo – qual é a janela de oportunidade?
10. Considere o efeito de segunda e terceira ordem

efeitos do seu ataque
11. Mapeie os incentivos – siga o dinheiro, o ego, a conveniência
12. Teste a suposição de que “ninguém jamais faria isso”

## Detecção de incentivo perverso

Os sistemas criam incentivos. Às vezes, esses incentivos recompensam o comportamento errado.

### Perguntas para revelar incentivos perversos

| Pergunta | O que isso revela |
|----------|----------------|
| "Como as pessoas vão jogar isso?" | Brechas na lógica de negócios |
| “Que comportamento essa recompensa que não queremos?” | Incentivos desalinhados |
| “Qual é a maneira mais barata de obter a recompensa sem esforço?” | Exploração de atalhos |
| "Se medirmos X, o que Y será sacrificado?" | Lei de Goodhart em ação |
| "Quem se beneficia com essa falha?" | Adversários com motivo |
| "O que seria um

pessoa preguiçosa, mas inteligente faz?" | Caminho de explorações de menor resistência |

### Padrões comuns de incentivos perversos

| Padrão | Exemplo | Consequência |
|---------|---------|------------|
| Jogos métricos | “Linhas de código” como métrica de produtividade | Código detalhado e insustentável |
| Hacking de recompensa | Bônus de indicação sem verificação | Contas falsas para auto-referência |
| Corrida para o fundo | “Tempo de resposta mais rápido” como SLA | As equipes evitam aceitar tickets complexos |
| Efeito cobra | Recompensa por reportar bugs | Equipe apresenta bugs para reivindicar recompensas |
| Assimetria de informação

metria | Os usuários sabem mais que o sistema | Seleção adversa na precificação de mercado |
| Lei de Goodhart | Qualquer métrica desejada se torna a meta de otimização | Métrica melhora, resultado real piora |

## Análise de resposta competitiva

Quando o “adversário” é um concorrente.

| Cenário | Estrutura de análise |
|----------|-------------------|
| Paridade de recursos | O que eles podem copiar? Quão rápido? Qual é o nosso fosso defensável? |
| Guerra de preços | Eles podem sustentar preços mais baixos? Qual é a sua estrutura de custos? |
| Caça furtiva de talentos | Quais funções são críticas? Quão substituível? Qual é a nossa vantagem de retenção? |
| Risco de plataforma | Dependemos da plataforma deles? Qual é o custo da troca? |
| Campanha FUD | Que reivindicações eles poderiam fazer? Qual

são mais difíceis de refutar? |

## Modelo de saída```markdown
## Red Team Analysis: [Target]

### RED Model Assessment

| Step | Finding |
|------|---------|
| **Recognize Assumptions** | [Key assumptions about security/resilience] |
| **Evaluate Arguments** | [Quality of evidence for current defenses] |
| **Draw Conclusions** | [Honest assessment of actual posture] |

### Asset Under Assessment

[What we're protecting and why it matters]

### Adversary Profiles

#### Adversary 1: [Name/Role]
- **Motivation:** [Why they attack]
- **Capability:** [What they can do]
- **Access:** [What they start with]

#### Adversary 2: [Name/Role]
- **Motivation:** [Why they attack]
- **Capability:** [What they can do]
- **Access:** [What they start with]

### Attack Vectors (Ranked)

| # | Vector | Adversary | Likelihood | Impact | Risk Score |
|---|--------|-----------|-----------|--------|------------|
| 1 | [Specific attack] | [Who] | High/Med/Low | High/Med/Low | [L x I] |
| 2 | [Specific attack] | [Who] | High/Med/Low | High/Med/Low | [L x I] |
| 3 | [Specific attack] | [Who] | High/Med/Low | High/Med/Low | [L x I] |

### Perverse Incentives

| Incentive Created | Unintended Behavior | Severity |
|-------------------|-------------------|----------|
| [What the system rewards] | [How it gets gamed] | High/Med/Low |

### Recommended Defenses

| Attack Vector | Defense | Effort | Priority |
|--------------|---------|--------|----------|
| #1 | [Specific countermeasure] | Low/Med/High | Immediate/Next sprint/Backlog |
| #2 | [Specific countermeasure] | Low/Med/High | Immediate/Next sprint/Backlog |
| #3 | [Specific countermeasure] | Low/Med/High | Immediate/Next sprint/Backlog |
````
