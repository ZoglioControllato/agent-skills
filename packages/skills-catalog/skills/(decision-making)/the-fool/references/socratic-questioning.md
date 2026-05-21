# Questionamento Socrático

Estruturas de perguntas estruturadas para expor suposições e aprofundar a compreensão.

## Princípio Fundamental

O questionamento socrático não discute. Ele pergunta. O objetivo é ajudar o usuário a descobrir lacunas em seu próprio raciocínio, trazendo à tona o que não examinou. Cada pergunta deve criar um momento de “eu não tinha pensado nisso”.

O agente nunca deve responder ele mesmo às perguntas. Apresente-os, deixe o usuário sentar-se com eles.

## Os 6 tipos de perguntas

A pesquisa (NAACL 2024, ChemRxiv 2025) confirma esses 6 tipos como os mais eficazes para análises críticas em fluxos de trabalho assistidos por IA.

### 1. Esclarecimento de dúvidas

Forçar precisão em termos vagos ou sobrecarregados.

| Padrão                                                      | Exemplo                                                                     |
| ----------------------------------------------------------- | --------------------------------------------------------------------------- |
| "Quando você diz X, o que especificamente você quer dizer?" | "Quando você diz 'escalável', você quer dizer 10x usuários ou 1000x?"       |
| "Como você definiria X para alguém desconhecido?"           | "Como você explicaria 'tempo real' para alguém que não é engenheiro?"       |
| “Existem casos em que X significa algo diferente?”          | "'Rápido' significa a mesma coisa para resposta de API e trabalho em lote?" |

### 2. Perguntas de investigação de suposições

Revele premissas ocultas das quais o raciocínio depende.

| Padrão                                                      | Exemplo                                                                                       |
| ----------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| "O que você está assumindo aqui?"                           | "O que deve ser verdade para que os microsserviços melhorem a velocidade?"                    |
| “Isso é baseado em dados ou intuição?”                      | "A afirmação de que 'os usuários odeiam o fluxo atual' é resultado de pesquisa ou suposição?" |
| "O que mudaria sua mente?"                                  | “Que métrica o convenceria de que essa abordagem está errada?”                                |
| "O que você está tratando como fixo que pode ser flexível?" | "O prazo tem que ser o segundo trimestre, ou                                                  |

isso é uma suposição?" |

### 3. Perguntas de investigação de evidências

Teste a base evidencial das crenças.

| Padrão                                      | Exemplo                                                                        |
| ------------------------------------------- | ------------------------------------------------------------------------------ |
| "Que evidências apoiam isso?"               | “Quais dados mostram que os usuários realmente desejam esse recurso?”          |
| "Como você sabe que X é verdade?"           | “Como você sabe que o sistema atual não consegue lidar com a carga?”           |
| “Quão grande e representativa é a amostra?” | “O piloto foi testado em dados de produção ou em dados de teste higienizados?” |
| “A fonte é independente ou interessada?”    | "Essa referência é de um fornecedor ou de uma empresa independente             |

não testar?" |

### 4. Perguntas de implicação

Siga as consequências lógicas da posição.

| Padrão                                 | Exemplo                                                                                     |
| -------------------------------------- | ------------------------------------------------------------------------------------------- |
| "Se isso for verdade, o que se segue?" | “Se aceitarmos esse orçamento de latência, o que isso forçará na camada de banco de dados?” |
| "X necessariamente leva a Y?"          | "Adicionar cache necessariamente melhora a experiência do usuário?"                         |
| “Qual é o efeito de segunda ordem?”    | “Se contratarmos empreiteiros para acelerar, o que acontece com o conhecimento da equipe?”  |
| "O que fica mais difícil depois?"      | "Qual recurso futuro se tornará mais difícil se escolhermos                                 |

esse esquema?" |

### 5. Perguntas de mudança de perspectiva

Forçar a consideração de outros pontos de vista.

| Padrão                                       | Exemplo                                                                   |
| -------------------------------------------- | ------------------------------------------------------------------------- |
| "Como [as partes interessadas] veriam isso?" | "Como o engenheiro de plantão se sentiria em relação a essa arquitetura?" |
| "O que um cético diria?"                     | "O que diria um engenheiro sênior que prefere a simplicidade?"            |
| "Como será isso daqui a 2 anos?"             | “Essa abstração ainda fará sentido quando a equipe dobrar?”               |
| "Quem perde se isso der certo?"              | “Se adotarmos esse fornecedor, de que capacidade abriremos mão?”          |

### 6. Meta-perguntas

Examine o próprio processo de raciocínio.

| Padrão                                                                      | Exemplo                                                                                |
| --------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| "Por que estamos enquadrando desta forma?"                                  | “Por que estamos tratando isso como uma decisão tecnológica em vez de organizacional?” |
| "Que pergunta NÃO estamos fazendo?"                                         | "Discutimos o desempenho - e a operabilidade?"                                         |
| "Estamos resolvendo o problema certo?"                                      | "O verdadeiro problema é o pipeline de implantação ou o acoplamento?"                  |
| "O que seria necessário para mudar de ideia?" (Pergunta Mágica de Kozyrkov) | "Se eu co                                                                              |

Se você pudesse provar X, você reconsideraria?" |

## Sinais de detecção de suposição

Fique atento à linguagem que esconde suposições. Ao ouvir isso, investigue imediatamente.

| Frase de Sinal       | Suposição Oculta                          | Sondar com                                |
| -------------------- | ----------------------------------------- | ----------------------------------------- |
| "Obviamente..."      | O palestrante não questionou isso         | "O que torna isso óbvio? Foi testado?"    |
| "Todo mundo sabe..." | O consenso não foi verificado             | "Quem especificamente? Alguém discordou?" |
| "Faz sentido..."     | A cadeia de raciocínio não foi articulada | "Mostre-me a lógica passo a passo."       |
| "Nós sempre..."      | História                                  |

padrão histórico considerado ótimo | "Por quê? O que aconteceria se você não o fizesse?" |
| "Não tem outro jeito..." | Alternativas não foram exploradas | "E se houvesse? Como seria?" |
| "É simples..." | A complexidade foi subestimada | "Qual é a coisa mais simples que pode dar errado?" |
| "Os usuários querem..." | A pesquisa do usuário pode estar ausente ou desatualizada | "Como você sabe? Quando isso foi validado pela última vez?" |
| "A abordagem padrão é..." |

Convenção não foi validada para o contexto | "Padrão para quem? O contexto deles corresponde ao seu?" |
| "Precisamos ter cuidado..." | Aversão ao risco sem risco quantificado | "Qual é especificamente o risco? Qual a probabilidade?" |

## Bancos de perguntas adaptadas ao domínio

### Decisões Técnicas

- Para que você está otimizando? Tem certeza de que essa é a dimensão certa?
- Qual é a versão mais simples que testa a suposição central?
- Que restrição você está tratando como fixa e que na verdade pode ser flexível?
- Como você construiria isso se tivesse que enviar em uma semana?
- Qual é a coisa mais cara para mudar depois?
- Se você tivesse que explicar o modo de falha para um executivo não técnico, o que você diria?

### Decisões de Negócios

- Quem é o cliente para esta decisão? Tem certeza?
- O que tornaria este um mau investimento em retrospectiva?
- Como isso se compara a não fazer nada?
- Qual é o custo de oportunidade desta escolha?
- Se um concorrente fizesse a escolha oposta, você ficaria preocupado?
- Qual o máximo que você pagaria a um clarividente por uma informação perfeita sobre isso? (Teste de Valor de Clarividência de Kozyrkov - se baixo, a decisão não precisa de mais análise)

### Decisões Estratégicas

- O que tem de ser verdade para que esta estratégia funcione?
- Em quais dessas suposições você está menos confiante?
- Qual é a maneira mais rápida de testar a suposição mais arriscada?
- Como você saberá se isso está falhando antes que seja tarde demais?
- Qual é a estratégia de saída se isso não funcionar?
- Enquadre isto como uma aposta: o que você está apostando, com que probabilidades, com que recompensa?

## Modelo de saída```markdown

## Assumption Inventory

| #   | Assumption                    | Type              | Confidence          | Source                              |
| --- | ----------------------------- | ----------------- | ------------------- | ----------------------------------- |
| 1   | [Stated or hidden assumption] | Stated / Unstated | High / Medium / Low | [Where it appears in the reasoning] |

## Probing Questions

### [Theme 1: e.g., "User Behavior"]

1. [Question targeting assumption #X] _(Type: Assumption-probing)_
2. [Follow-up question deepening the probe] _(Type: Implication)_

### [Theme 2: e.g., "Technical Feasibility"]

1. [Question targeting assumption #Y] _(Type: Evidence-probing)_
2. [Follow-up question] _(Type: Perspective-shifting)_

### [Theme 3: e.g., "Business Viability"]

1. [Question targeting assumption #Z] _(Type: Meta-question)_
2. [Follow-up question] _(Type: Clarifying)_

## Suggested Experiments

| Assumption            | Experiment       | Effort       | Signal              |
| --------------------- | ---------------- | ------------ | ------------------- |
| [Riskiest assumption] | [How to test it] | Low/Med/High | [What result means] |

```

```
