# Inventário de preconceito cognitivo

Detecção de polarização estruturada para uso durante cada passagem de desafio. Integra descobertas de Fasolo, Heard & Scopelliti (2025) e da estrutura metacognitiva DeBiasMe.

## Princípio Fundamental

Os preconceitos cognitivos não são acusações – são padrões de raciocínio humano que distorcem sistematicamente o julgamento. O trabalho do Louco é sinalizar quando um preconceito pode estar influenciando uma decisão, e não envergonhar o usuário. Enquadre as descobertas de preconceito como: "Esse padrão é comum nesse tipo de decisão e veja como isso pode estar afetando seu raciocínio."

## Quando usar este arquivo

Leia este arquivo em cada passagem de desafio, independentemente do modo. Depois de gerar os desafios específicos do seu modo, analise o raciocínio do usuário em relação a esse inventário. Integre as descobertas tendenciosas aos seus desafios - não as apresente como um "relatório tendencioso" separado.

## O inventário de polarização primária

### Vieses na tomada de decisões

| Viés                    | Descrição                                            | Sinal de detecção                                                            | Técnica de Debiasing                                      |
| ----------------------- | ---------------------------------------------------- | ---------------------------------------------------------------------------- | --------------------------------------------------------- |
| **Viés de confirmação** | Buscando evidências que confirmem a crença existente | Apenas evidências positivas citadas; nenhuma contra-evidência considerada    | "Que evidências você precisaria ver para mudar de ideia?" |
| **Ancoragem**           | Confiar excessivamente na primeira informação        | Primeira estimativa inalterada apesar dos novos dados; números redondos domi |

Nate | "Gere sua própria estimativa ANTES de olhar para os outros" |
| **Falácia dos custos irrecuperáveis** | Continuando devido a investimentos anteriores | “Já gastamos 6 meses nisso” como justificativa para continuar | “Se você estivesse começando do zero hoje, sem nenhum investimento anterior, você escolheria isso?” |
| **Viés do status quo** | Preferindo o estado atual apesar das evidências de mudança | “Sempre foi assim” ou “mudar é arriscado” sem quantificar | "Qual é o

custo de NÃO mudar? Fazer nada é realmente de graça?" |
| **Excesso de confiança** | Superestimar a precisão das próprias previsões | Estimativas pontuais em vez de intervalos; sem planejamento de contingência | "Dê-me um intervalo de confiança: qual é o resultado dos percentis 10 e 90?" |
| **Falácia do planejamento** | Subestimar o tempo, o custo e o risco de ações futuras | Estimativas do melhor caso apresentadas como prováveis; nenhum buffer para incógnitas | "O que aconteceu nas últimas 3 vezes

você estimou algo semelhante?" |

### Preconceitos sociais e de grupo

| Viés                    | Descrição                                                          | Sinal de detecção                                         | Técnica de Debiasing                                                |
| ----------------------- | ------------------------------------------------------------------ | --------------------------------------------------------- | ------------------------------------------------------------------- |
| **Pensamento de grupo** | Desejo de conformidade suprime dissidência                         | “Toda a equipe concorda” sem dissidência documentada      | "Houve um momento em que alguém quase discordou? O que os impediu?" |
| **Viés de autoridade**  | Submeter-se à autoridade independentemente da qualidade das provas | "O CTO/arquiteto/Google diz isso" como evidência primária |

| “Se esta proposta viesse de um engenheiro júnior, as evidências seriam suficientes?” |
| **Efeito de movimento** | “Todo mundo está fazendo isso” como justificativa | Adoção de tendências sem avaliação de aptidão | "A razão pela qual todos estão fazendo isso é a mesma que você deveria?" |
| **Viés de sobrevivência** | Focando nos sucessos, ignorando os fracassos | “Todas as empresas de sucesso fazem X” | "Quantas empresas tentaram o X e falharam? O que aconteceu com elas?" |

### Vieses no processamento de informações

| Viés                              | Descrição                                       | Sinal de detecção                                        | Técnica de Debiasing                                                                   |
| --------------------------------- | ----------------------------------------------- | -------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| **Heurística de disponibilidade** | Sobreponderação em exemplos recentes ou vívidos | Decisão baseada num incidente memorável                  | “O que dizem os dados da taxa básica? Este incidente é representativo ou excepcional?” |
| **Dunning-Kruger**                | Excesso de confiança em domínio desconhecido    | Afirmações confiantes sobre áreas fora da especialização | "Quanto ex                                                                             |

experiência que a equipe tem com esta tecnologia específica nesta escala?" |
| **Efeito de enquadramento** | A decisão muda com base na forma como a questão é formulada | Enquadramento positivo escondendo negativos (ou vice-versa) | “Reformule: em vez de 'taxa de sucesso de 90%', diga 'taxa de fracasso de 10%.' Isso muda a decisão?" |
| **Viés de atualidade** | Sobreponderação em acontecimentos recentes | Incidente do último trimestre impulsionando decisões de arquitetura | “Isso é uma tendência ou uma exceção? O que

os dados de 12 meses mostram?" |
| **Falácia narrativa** | Criando uma história coerente a partir de eventos aleatórios | Narrativa limpa de causa e efeito sem incerteza | “Que partes desta história estamos conectando retroativamente?” |

## Fluxo de trabalho de detecção de polarização

Para cada passagem do desafio, execute esta verificação rápida:

### Etapa 1: Verifique a cadeia de evidências

- As evidências são apresentadas de forma seletiva? → **Viés de confirmação**
- O primeiro ponto de dados está dominando a análise? → **Ancoragem**
- Um único exemplo vívido está guiando a decisão? → **Heurística de disponibilidade**
- A fonte da evidência está interessada no resultado? → **Viés da autoridade** ou **Viés do fornecedor**

### Etapa 2: Verifique o quadro de decisão

- O investimento passado está sendo usado para justificar a continuidade? → **Falácia dos custos irrecuperáveis**
- O status quo está sendo tratado como gratuito? → **Viés do status quo**
- As estimativas são valores pontuais em vez de intervalos? → **Excesso de confiança**
- O cronograma é baseado no melhor caso? → **Falácia do planejamento**

### Etapa 3: verifique a dinâmica social

- "Todos concordaram" de forma suspeita e rápida? → **Pensamento de grupo**
- A opinião de uma pessoa idosa é tratada como prova? → **Viés de autoridade**
- A “tendência da indústria” é a principal justificativa? → **Efeito de movimento**
- Apenas são referenciadas histórias de sucesso? → **Viés de sobrevivência**

## Resumo das técnicas de mitigação de preconceito

Estas são as técnicas de eliminação de preconceito padrão-ouro (Fasolo et al. 2025, Nature Scientific Reports 2025):

| Técnica                              | O que faz                                                        | Quando aplicar                                               |
| ------------------------------------ | ---------------------------------------------------------------- | ------------------------------------------------------------ |
| **Previsão de classe de referência** | Utilizar taxas de base históricas em vez de estimativas internas | Qualquer reivindicação preditiva ou estimativa de cronograma |
| **Pré-mortem**                       | Imagine o fracasso primeiro                                      | Falácia de planejamento, excesso de confiança                |
| **Time vermelho/advogado do diabo**  | Dissidência estrutural                                           | Pensamento de grupo, viés de confirmação                     |
| **Avaliação cega**                   | Tira nomes, títulos, fornecedores                                |

de propostas | Viés de autoridade, efeito halo |
| **Enquadramento probabilístico** | Forçar intervalos de confiança e faixas de probabilidade | Excesso de confiança, pensamento binário |
| **Enquadramento de novo começo** | “Se começasse hoje sem história, você escolheria isso?” | Custo irrecuperável, preconceito de status quo |
| **Inversão** | "O que garantiria o fracasso?" | Viés de confirmação, falácia de planejamento |
| **Busque evidências contrárias** | Procure ativamente por evidências CONTRA o seu p

osição | Viés de confirmação |
| **A questão mágica** | "O que seria necessário para mudar de ideia?" | Todos os preconceitos — testa o compromisso com as evidências |

## Integração com modos

| Modo                     | Vieses mais comuns a serem verificados                                      |
| ------------------------ | --------------------------------------------------------------------------- |
| Questionamento Socrático | Viés de confirmação, efeito de enquadramento, falácia narrativa             |
| Síntese Dialética        | Viés de status quo, preconceito de autoridade, pensamento de grupo          |
| Análise pré-mortem       | Falácia de planejamento, excesso de confiança, preconceito de sobrevivência |
| Equipe Vermelha          | Heurística de disponibilidade, ancoragem, Dunning-Kruger                    |
| Auditoria de Evidências  | Viés de confirmação, viés de sobrevivência, viés de autoridade              |

## Antipadrões na comunicação tendenciosa

| Antipadrão                          | Problema                                 | Melhor abordagem                                                                        |
| ----------------------------------- | ---------------------------------------- | --------------------------------------------------------------------------------------- |
| “Você tem viés de confirmação”      | Acusativo, desencadeia atitude defensiva | “Percebo que todas as evidências citadas são de apoio – como são as contra-evidências?” |
| Listando 10 preconceitos de uma vez | Sobrecarrega, perde impacto              | Sinalize os 1-2 preconceitos mais relevantes, integrados em desafios específicos        |
| Usando o preconceito como trunfo    | "Você é tendencioso, portanto errado"    | Viés de                                                                                 |

afeta o processo de raciocínio, não necessariamente a conclusão |
| Nomeando o preconceito primeiro | Tom acadêmico aliena | Descreva o padrão e (opcionalmente) nomeie-o |
