# Síntese Dialética

Dialética hegeliana com recursos de aço para construir o contra-argumento mais forte possível e conduzir à síntese.

## Princípio Fundamental

A dialética não é sobre vencer. Trata-se de produzir uma posição mais forte do que apenas tese ou antítese. O trabalho do Louco é argumentar tão bem com o outro lado que o usuário seja forçado a refinar sua posição ou a reconhecer uma compensação genuína.

Distinção principal: a tripulação de aço é epistêmica (genuinamente tenta descobrir se você está errado), a defesa do diabo é baseada em papéis (designada para argumentar contra). Aplique ambos: primeiro o homem de aço e depois construa a antítese.

## Processo

1. **Reafirmar a tese** — Steelman a posição do usuário primeiro
2. **Construa a antítese** — Construa o argumento oposto mais forte
3. **Apresente o conflito** — Mostre onde a tese e a antítese realmente entram em conflito
4. **Dirigir-se à síntese** — Proponha uma posição que incorpore o melhor de ambos
5. **Avaliar a confiança** — Avalie a síntese e identifique os riscos restantes

## Técnica de tripulação de aço

A tripulação de aço é o oposto da tripulação de palha. Reafirme a posição do usuário da forma mais forte possível antes de argumentar contra ela.

### Como fazer Steelman

| Etapa                                 | Ação                            | Exemplo                                                                                                                           |
| ------------------------------------- | ------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| 1. Identifique a afirmação principal  | Eliminar o enquadramento fraco  | “Devemos usar microsserviços” → “A implantação independente e o dimensionamento de componentes acelerarão a velocidade da equipe” |
| 2. Adicione as evidências mais fortes | Forneça o que o usuário sugeriu | "...especialmente considerando 4 equipes trabalhando em diferentes ciclos de lançamento"                                          |
| 3. Reconheça os benefícios reais      | Cite o que é genuinamente bom   | “Isso eliminaria o c                                                                                                              |

gargalo da fila de implantação atual" |
| 4. Confirme com o usuário | "Esta é uma reformulação justa?" | Garante que você está atacando a posição real, não uma invenção |

### Lista de verificação do Steelman

Antes de prosseguir para a antítese, verifique:

- Tornei a posição mais forte, e não mais fraca?
- O usuário reconheceria isso como sua visão (ou melhor)?
- Incluí as evidências mais fortes a favor deles?
- Estou prestes a atacar esta versão, não uma mais fácil?

## Construção de Antítese

### Técnica: Contra-argumento mais forte

Construa a antítese perguntando: “Se uma pessoa inteligente e informada discordasse, qual seria o seu melhor argumento?”

| Fonte de contra-argumentos               | Exemplo                                                         |
| ---------------------------------------- | --------------------------------------------------------------- |
| Oposição ao trade-off                    | "Velocidade agora vs. facilidade de manutenção mais tarde"      |
| Custo oculto                             | “O custo da migração supera a economia projetada para 18 meses” |
| Alternativa que resolve o mesmo problema | “Um monólito modular obtém 80% do benefício por 20% do custo”   |
| Precedentes de situações semelhantes     | “Empresa X tentou isso e reverteu após 2 anos”                  |

| Parte interessada

esis não serve | “Os desenvolvedores juniores terão dificuldades com a complexidade adicional” |
| A hipótese nula | “Não fazer nada e investir o esforço em outro lugar gera maior ROI” |

### Reductio ad Absurdum (Técnica de Apoio)

Leve a tese ao seu extremo lógico para revelar limites ocultos.

| Tese                                              | Redução                                                                    | Revela                                     |
| ------------------------------------------------- | -------------------------------------------------------------------------- | ------------------------------------------ |
| “Devemos otimizar a experiência do desenvolvedor” | “Então nunca deveríamos enviar para produção, já que bugs prejudicam o DX” | DX deve ser balanceado com entrega         |
| “Mais testes são sempre melhores”                 | “Então deveríamos ter 100% de cobertura incluindo getters/setters”         | O valor do teste tem retornos decrescentes |
| “Devemos agir rápido”                             | "Em seguida, pule a revisão e o teste do código"                           | A velocidade tem piso de qualidade         |

Use com moderação. Reductio destaca o limite de um princípio, não a sua invalidade.

### Enquadramento Probabilístico (Annie Duke)

Forçar estimativas de probabilidade para tornar a incerteza explícita:

- "Quão confiante você está nisso? 60%? 90%?"
- "O que mudaria sua confiança de 70% para 90%?"
- "Qual é a probabilidade de a antítese estar certa?"

Isso evita o pensamento binário e permite a calibração.

## Padrões de síntese

Após apresentar tese e antítese, proponha uma síntese utilizando um desses padrões.

### 1. Síntese Condicional

"X é verdadeiro **quando** a condição A é válida; Y é verdadeiro **quando** a condição B é válida."

Exemplo: "Os microsserviços são adequados para o serviço de pagamento (escalonamento independente, limite de conformidade), mas o painel de administração deve permanecer no monólito (baixo tráfego, iteração rápida)."

### 2. Particionamento de escopo

"Aplique X ao domínio A e Y ao domínio B."

Exemplo: "Use a fonte de eventos para a trilha de auditoria (somente acréscimo, histórico consultável), mas CRUD padrão para perfis de usuário (leituras/gravações simples)."

### 3. Síntese Temporal

"Comece com X, migre para Y quando ocorrer o gatilho Z."

Exemplo: "Comece com um monólito, extraia serviços quando o tamanho da equipe exceder 3 esquadrões ou implante a frequência de ataques em conflitos semanais."

### 4. Síntese de Mitigação de Risco

"Prossiga com X, mas adicione salvaguardas de Y."

Exemplo: "Adote a nova estrutura, mas mantenha a camada de abstração para que possamos trocar de volta em 2 sprints."

### 5. Extração Híbrida

"Pegue o elemento mais forte de cada lado."

Exemplo: "Use o modelo de implantação de microsserviços (contêineres independentes), mas mantenha um banco de dados compartilhado com propriedade de esquema (evitando complexidade de dados distribuídos)."

## Avaliação de confiança

Avalie o resultado da síntese honestamente.

| Nível     | Significado                                                        | Ação                                                                         |
| --------- | ------------------------------------------------------------------ | ---------------------------------------------------------------------------- |
| **ALTO**  | Síntese claramente mais forte do que qualquer um dos lados sozinho | Prossiga com a síntese                                                       |
| **MÉDIO** | A síntese é plausível, mas não foi testada                         | Identifique a suposição mais arriscada e sugira uma experiência              |
| **BAIXO** | Ambos os lados têm reivindicações fortes e irreconciliáveis ​​     | Cite a compensação genuína; deixe o usuário decidir com base nas prioridades |
| **PIVOT** | A antítese é mais forte que a tese                                 |

Recomendo ao usuário reconsiderar sua posição original |

## Antipadrões

| Antipadrão              | Problema                                            | Correção                                               |
| ----------------------- | --------------------------------------------------- | ------------------------------------------------------ |
| Falsa síntese           | "Basta fazer as duas coisas!" sem resolver a tensão | Nomeie o trade-off específico que está sendo resolvido |
| Antítese fraca          | O contra-argumento é um espantalho                  | Aplique tripulação de aço no balcão também             |
| Viés de tese            | Síntese suspeitamente próxima da posição original   | Verifique se a antítese foi genuinamente engajada      |
| Aumento da complexidade | A síntese é mais complexa do que qualquer origem    |

eu | Síntese mais simples geralmente é melhor |
| Ficar em cima do muro | “Depende” sem especificar o quê | Nomeie as condições exatas para cada caminho |
| Viés resultante | Julgando a qualidade da decisão pelo resultado | Avalie o processo, não o resultado (Duke) |

## Modelo de saída```markdown

## Thesis (Steelmanned)

[User's position restated in strongest form]

**Strongest evidence for:** [1-2 supporting points]
**User's confidence:** [X%]

## Antithesis

[Strongest counter-argument]

**Strongest evidence for:** [1-2 supporting points]

## Points of Genuine Conflict

| Dimension     | Thesis Says | Antithesis Says    |
| ------------- | ----------- | ------------------ |
| [e.g., Speed] | [Position]  | [Counter-position] |
| [e.g., Cost]  | [Position]  | [Counter-position] |

## Proposed Synthesis

**Pattern:** [Conditional / Scope / Temporal / Risk Mitigation / Hybrid]

[Concrete synthesis proposal]

**What this preserves from the thesis:** [specific elements]
**What this incorporates from the antithesis:** [specific elements]
**What this gives up:** [explicit trade-offs]

**Confidence:** HIGH / MEDIUM / LOW / PIVOT
**If MEDIUM:** Test [riskiest assumption] by [experiment]
**If PIVOT:** [Concrete recommendation to reconsider]

```

```
