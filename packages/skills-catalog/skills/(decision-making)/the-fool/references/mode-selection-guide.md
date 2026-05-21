# Guia de seleção de modo

Como recomendar o modo de raciocínio correto quando o usuário seleciona "Você escolhe" ou ao recomendar automaticamente.

## Mapeamento de sinal para modo

Analise a linguagem e o contexto do usuário para identificar qual modo se adapta melhor.

| Sinal do usuário                       | Modo recomendado         | Justificativa                                                     |
| -------------------------------------- | ------------------------ | ----------------------------------------------------------------- |
| “Esta é a abordagem correta?”          | Questionamento Socrático | Explorando pressupostos, ainda não confirmados                    |
| “Estou prestes a me comprometer com X” | Síntese Dialética        | Precisa de um contra-argumento mais forte antes de se comprometer |
| "O que poderia dar errado?"            | Análise pré-mortem       | Perguntar explicitamente sobre modos de falha                     |
| "Isso é seguro/seguro?"                | Equipe Vermelha          | Segurança e adversário                                            |

enquadramento |
| "Os dados mostram que..." | Auditoria de Evidências | Alegações baseadas em provas necessitam de falsificação |
| "Todos concordam que..." | Questionamento Socrático | Consenso sinaliza suposições não examinadas |
| “Escolhemos X em vez de Y” | Síntese Dialética | A decisão de trade-off beneficia do contra-ataque mais forte |
| "Isso definitivamente vai funcionar" | Análise pré-mortem | Excesso de confiança sinaliza necessidade de imaginação fracassada |
| "Ninguém jamais..." | Equipe Vermelha | Suponha

questões sobre o comportamento do adversário |
| "Estudos mostram..." | Auditoria de Evidências | As evidências citadas precisam de avaliação de qualidade |
| "Tenho um pressentimento..." | Auditoria de Evidências | A intuição precisa de fundamentação em evidências |
| “Sempre fizemos assim” | Questionamento Socrático | Padrão histórico assumido como ótimo |
| "O vendedor diz..." | Auditoria de Evidências | Evidências das partes interessadas precisam de escrutínio |

## Mapeamento de tipo de decisão

| Tipo de decisão                       | Modo Primário           | Modo Secundário          |
| ------------------------------------- | ----------------------- | ------------------------ |
| Escolha de tecnologia                 | Síntese Dialética       | Análise pré-mortem       |
| Decisão de arquitetura                | Análise pré-mortem      | Equipe Vermelha          |
| Estratégia empresarial                | Síntese Dialética       | Auditoria de Evidências  |
| Projeto de segurança                  | Equipe Vermelha         | Análise pré-mortem       |
| Conclusão baseada em dados            | Auditoria de Evidências | Questionamento Socrático |
| Desenho de processo/fluxo de trabalho | Análise pré-mortem      |

é | Questionamento Socrático |
| Decisão de contratação/equipe | Questionamento Socrático | Síntese Dialética |
| Seleção de fornecedor | Auditoria de Evidências | Análise pré-mortem |
| Resolução de trade-off | Síntese Dialética | Questionamento Socrático |
| Avaliação de risco | Equipe Vermelha | Análise pré-mortem |
| Decisão de investimento/orçamento | Auditoria de Evidências | Síntese Dialética |
| Direção do produto | Questionamento Socrático | Síntese Dialética |

## Mapeamento de domínio

| Domínio        | Modo padrão              | Por que                                                |
| -------------- | ------------------------ | ------------------------------------------------------ |
| Segurança      | Equipe Vermelha          | O pensamento adversário é nativo do domínio            |
| Infraestrutura | Análise pré-mortem       | Os modos de falha são a principal preocupação          |
| Dados/Análises | Auditoria de Evidências  | As reivindicações exigem exame minucioso de evidências |
| Produto/UX     | Questionamento Socrático | Suposições sobre os usuários precisam ser reveladas    |
| Negócios       | Síntese Dialética        | A estratégia beneficia do contra-ataque mais forte     |

| Arqui

arquitetura | Análise pré-mortem | Sistemas falham em pontos de integração |
| Jurídico/Conformidade | Auditoria de Evidências | As reivindicações devem resistir ao escrutínio |
| IA/ML | Equipe Vermelha | A robustez adversária é crítica |
| Pessoas/Organização | Questionamento Socrático | Suposições ocultas sobre comportamento |

## Sequenciamento multimodo

Algumas situações se beneficiam da execução de 2 modos em sequência.

### Sequências recomendadas

| Sequência                           | Quando usar                                                                                          |
| ----------------------------------- | ---------------------------------------------------------------------------------------------------- |
| Socrático → Dialética               | O usuário tem uma ideia não testada. Suposições superficiais primeiro, depois argumente o contrário. |
| Pré-mortem → Equipe Vermelha        | Lançamento de sistema de alto risco. Encontre falhas internas e depois ataques externos.             |
| Auditoria de Evidências → Socrática | Proposta baseada em dados. Audite as evidências e questione a interpretação.                         |
| Dialética → Pré-morte               | Decisão estratégica. Discuta o contra-ataque e depois estresse                                       |

t a posição de sobrevivência. |
| Socrático → Auditoria de Evidências | Proposta com muitas afirmações "óbvias". Supere as suposições e, em seguida, classifique as evidências. |

### Quando sugerir multimodo

Recomende uma segunda passagem quando:

- O primeiro modo revela uma categoria de risco que o usuário não considerou
- A tese sobrevive ao primeiro desafio praticamente intacta (pode precisar de testes mais difíceis)
- O domínio abrange duas categorias de mapeamento (por exemplo, uma decisão de arquitetura de segurança)
- A confiança do usuário aumentou após a primeira passagem — um modo diferente pode revelar novos ângulos

### Quando NÃO sugerir multimodo

- A pergunta do usuário é restrita e específica
- O primeiro modo já trouxe mudanças acionáveis
- O usuário sinaliza que deseja seguir em frente
- A síntese já alcançou confiança ALTA com próximos passos claros

## Formato de recomendação automática

Ao apresentar a recomendação, utilize esta estrutura:```
Based on [specific context signal], I recommend **[Mode Name]** because [1-sentence rationale].

[If a secondary mode is relevant:]
After that, a follow-up with **[Secondary Mode]** would [1-sentence benefit].

```
Em seguida, confirme com `AskUserQuestion`:

- Opção 1: modo recomendado (com rótulo "(Recomendado)")
- Opção 2: modo secundário, se aplicável
- Opção 3: "Deixe-me escolher" — retornar à seleção do modo completo

## Casos extremos

| Situação | Modo padrão | Justificativa |
|-----------|-------------|-----------|
| Contexto vago | Questionamento Socrático | Revela o que importa por meio de perguntas |
| Múltiplas preocupações | Análise pré-mortem | Abrange naturalmente a amplitude através de narrativas de fracasso |
| O usuário está emocionado/frustrado | Síntese Dialética | Steel Manning valida sua posição antes de desafiar |
| Divisão técnica versus negócios | Combine o modo de que lado estamos

er enfatiza | Siga a energia, aborde o segundo não dito |
| Usuário quer desafiar código/PR | Questionamento Socrático | Leia o código primeiro e depois investigue as suposições por trás das escolhas de design |
| Usuário apresenta decisão concluída | Auditoria de Evidências | As evidências de auditoria são menos conflituosas para decisões anteriores |
| Decisão multilateral | Síntese Dialética | Diferentes partes interessadas incorporam naturalmente a tese e a antítese |
```
