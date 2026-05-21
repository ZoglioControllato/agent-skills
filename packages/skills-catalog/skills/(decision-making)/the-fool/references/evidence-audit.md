# Auditoria de evidências

Falsificacionismo e avaliação da qualidade das evidências para auditar se as alegações são realmente apoiadas por evidências. Adaptado do falseacionismo de Karl Popper, da estrutura GRADE Evidence-to-Decision e do raciocínio probabilístico de Annie Duke.

## Princípio Fundamental

O principal insight de Karl Popper: uma afirmação só tem sentido se você puder especificar o que a refutaria. O modo Auditoria de Evidências extrai afirmações de propostas, projeta critérios de falsificação, avalia a qualidade das evidências, identifica preconceitos cognitivos e apresenta explicações concorrentes. O objetivo não é refutar – é determinar se a evidência realmente apoia a conclusão.

## Processo

1. **Extrair afirmações** — Identifique as afirmações específicas que estão sendo feitas (explícitas e implícitas)
2. **Critérios de falsificação de projeto** — Para cada afirmação, especifique o que a refutaria
3. **Avaliar a qualidade das evidências** — Avalie as evidências usando a estrutura adaptada ao GRADE
4. **Identifique vieses cognitivos** — Verifique se há erros sistemáticos de raciocínio (consulte `cognitive-bias-inventory.md` para obter o inventário completo)
5. **Explicações concorrentes superficiais** - Encontre todas

explicações alternativas para a mesma evidência 6. **Veredicto** — Força geral da evidência com recomendações específicas

## Extração de reivindicação

As propostas contêm reivindicações – muitas vezes implícitas. Extraia-os antes de avaliar.

### Tipos de reivindicações

| Tipo            | Exemplo                 | Escondido em                                           |
| --------------- | ----------------------- | ------------------------------------------------------ |
| **Causal**      | “X causa Y”             | "Nosso refatorador melhorou o desempenho"              |
| **Preditivo**   | "X vai acontecer"       | “Os usuários adotarão esse recurso”                    |
| **Comparativo** | “X é melhor que Y”      | “React é a melhor escolha para nós”                    |
| **Existencial** | "X existe/não existe"   | “Não há alternativa que atenda às nossas necessidades” |
| **Universal**   | "X é sempre verdadeiro" | “Microsserviços sempre melhoram a equipe               |

velocidade" |
| **Quantitativo** | "X é N" | “Isso economizará 200 horas por trimestre” |

### Método de Extração

Para cada afirmação da proposta:

1. Isto é uma afirmação ou uma definição?
2. Se for uma reclamação, de que tipo?
3. Que provas são citadas (ou implícitas)?
4. O que tornaria esta afirmação falsa?

### Extração de exemplo```

Statement: "Based on our pilot, migrating to Kubernetes will reduce deployment time by 60%."

Claims extracted:

1. The pilot results are representative of production (Predictive)
2. Kubernetes is the cause of the deployment time reduction (Causal)
3. The 60% reduction will persist at scale (Quantitative)
4. Deployment time is the right metric to optimize (Implicit — Comparative)

````
## Critérios de falsificação

Para cada afirmação, crie um teste que a refute.

| Reivindicação | Critério de Falsificação | Teste |
|-------|-------------|------|
| “Os usuários querem o recurso X” | Menos de 10% dos usuários interagem com X em 30 dias | Sinalizador de recurso, adoção de medida |
| “Isso será dimensionado para 100 mil usuários” | O tempo de resposta excede 500 ms em 50 mil usuários | Teste de carga na escala alvo |
| “Migração vai demorar 3 meses” | Mais de 2 desconhecidos descobertos no mês 1 | Acompanhe a contagem de surpresas durante a fase inicial |
| "Estrutura

k X é mais rápido" | Benchmark mostra menos de 5% de diferença | Benchmark controlado em carga de trabalho representativa |
| “Isso reduzirá custos” | O custo total de propriedade excede o custo atual em 12 meses | Análise de TCO incluindo migração, treinamento, operações |

### Alegações infalsificáveis (bandeira vermelha)

Algumas afirmações não podem ser falsificadas. Estas são bandeiras vermelhas que requerem atenção imediata.

| Padrão | Exemplo | Problema |
|--------|---------|---------|
| Resultado vago | “Isso vai melhorar as coisas” | Nenhum critério mensurável |
| Movendo postes | "Vai funcionar eventualmente" | Sem limite de tempo |
| Raciocínio circular | “Isso é o melhor porque é o que os especialistas recomendam” | A prova é a afirmação reafirmada |
| Cobertura infalsificável | “Isso pode ajudar em alguns casos” | Verdadeiro por definição |

Ao encontrar afirmações infalsificáveis, pergunte: "Que resultado específico e mensurável nos diria que isso funcionou ou não, e até quando?"

## Avaliação da qualidade das evidências (adaptado para GRADE)

A estrutura GRADE Evidence-to-Decision, adaptada da pesquisa médica para decisões tecnológicas/comerciais, fornece avaliação estruturada de evidências.

### Perguntas de decisão GRADE

Aplique estas 9 perguntas a qualquer proposta:

1. **O problema é uma prioridade?** Vale a pena resolvê-lo?
2. **Quão substanciais são os efeitos esperados desejáveis?** Qual é a vantagem?
3. **Quão substanciais são os efeitos indesejáveis ​​previstos?** Qual é a desvantagem?
4. **Qual é a certeza da evidência?** Quão forte é a nossa base para acreditar nisso?
5. **Existe uma incerteza importante sobre como as partes interessadas valorizam os resultados?** Pessoas diferentes querem coisas diferentes?
6. **Isso

O balanço de efeitos favorece esta opção ou a alternativa?** Líquido positivo ou líquido negativo?
7. **Qual é o tamanho dos requisitos de recursos?** Custo total de propriedade?
8. **A opção é aceitável para as principais partes interessadas?** As pessoas irão realmente apoiar esta opção?
9. **A implementação da opção é viável?** Podemos realmente fazer isso?

### Matriz de Qualidade de Evidências

| Dimensão | Forte | Fraco |
|-----------|--------|------|
| **Tamanho da amostra** | Amostra grande e representativa | Caso único, anedota |
| **Recência** | Dados actuais (dentro de 12 meses) | Desatualizado (2+ anos) |
| **Relevância** | Mesmo domínio, mesma escala | Domínio ou escala diferente |
| **Independência** | Múltiplas fontes independentes | Fonte única ou fornecida pelo fornecedor |
| **Metodologia** | Controlado, reproduzível | Ad hoc, não reproduzível |
| **Específico

cidade** | Métricas e condições precisas | Vago ou qualitativo |

### Escala de classificação de evidências

| Nota | Descrição | Confiabilidade |
|-------|------------|------------|
| **A** | Experimento controlado, amostra grande, reprodutível | Alta confiança — prossiga |
| **B** | Dados observacionais, amostra razoável, consistentes com outras provas | Confiança moderada — prosseguir com a monitorização |
| **C** | Estudo de caso, amostra pequena ou fonte única | Baixa confiança — necessita de corroboração antes de decidir |
| **D** | Anedota, opinião ou mercado de fornecedores

material de construção | Insuficiente — não basear as decisões apenas nisso |
| **Foda-se** | Nenhuma evidência citada | A reivindicação não é suportada – sinalizar imediatamente |

### Padrões Comuns de Evidências Fracas

| Padrão | Exemplo | Por que é fraco |
|--------|---------|---------------|
| Viés de sobrevivência | “Empresas que usam X têm sucesso” | Ignora empresas que usam X que falharam |
| Métricas escolhidas a dedo | “Tempo de resposta melhorou 40%” | Outras métricas (taxa de erro, rendimento) podem ter piorado |
| Referências de fornecedores | “Nossa ferramenta é 3x mais rápida” | Benchmarks otimizados para os pontos fortes do fornecedor |
| Apelo à autoridade | “Google faz assim” | Os contras do Google

traints não são suas restrições |
| Ancoragem | “Média da indústria é X, estamos em Y” | A média pode não ser a referência correta |
| Generalização N=1 | “Funcionou na minha última empresa” | Contexto diferente, equipe, escala, restrições |

## Explicações concorrentes (raciocínio abdutivo)

Para cada conclusão, pergunte: “O que mais poderia explicar esta evidência?”

### Método

1. Apresente as evidências
2. Indique a explicação proposta
3. Gere 2 a 3 explicações alternativas
4. Compare o poder explicativo – qual explicação é responsável por mais evidências com menos suposições?

### Exemplo```
Evidence: "Deployment failures dropped 50% after adopting tool X."

Proposed explanation: Tool X is better than the old tool.

Alternative explanations:
1. The team also started doing more code review in the same period
2. A particularly error-prone service was retired last month
3. The team gained experience that would have improved results with any tool
4. Deployment frequency dropped (fewer deploys = fewer failures, not better deploys)
````

## Modelo de saída```markdown

## Evidence Audit: [Proposal/Decision]

### Claims Extracted

| #   | Claim            | Type                   | Evidence Cited              | Falsifiable? |
| --- | ---------------- | ---------------------- | --------------------------- | ------------ |
| 1   | [Specific claim] | Causal/Predictive/etc. | [What evidence supports it] | Yes/No       |
| 2   | [Specific claim] | Causal/Predictive/etc. | [What evidence supports it] | Yes/No       |

### Falsification Criteria

| Claim | What Would Disprove It | How to Test     | Effort       |
| ----- | ---------------------- | --------------- | ------------ |
| #1    | [Specific criterion]   | [Concrete test] | Low/Med/High |
| #2    | [Specific criterion]   | [Concrete test] | Low/Med/High |

### Evidence Quality

| Claim | Evidence Grade | Key Weakness      | GRADE Assessment                              |
| ----- | -------------- | ----------------- | --------------------------------------------- |
| #1    | A/B/C/D/F      | [Primary concern] | [Which of the 9 questions is most concerning] |
| #2    | A/B/C/D/F      | [Primary concern] | [Which of the 9 questions is most concerning] |

### Bias Check

| Bias Detected | Where    | Impact                          |
| ------------- | -------- | ------------------------------- |
| [Bias name]   | Claim #X | [How it affects the conclusion] |

### Competing Explanations

| Evidence     | Proposed Explanation | Alternative Explanations          |
| ------------ | -------------------- | --------------------------------- |
| [Data point] | [Original claim]     | 1. [Alternative] 2. [Alternative] |

### Verdict

**Overall evidence strength:** Strong / Moderate / Weak / Insufficient

**Confidence level:** [X%] — this forces probabilistic rather than binary thinking

**Recommendations:**

1. [Specific action to strengthen the weakest claim]
2. [Specific action to test the riskiest assumption]
3. [What would change this verdict — the Magic Question]

```

```
