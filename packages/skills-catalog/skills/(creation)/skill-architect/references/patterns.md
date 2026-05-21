# Referência de padrões de habilidades

Este documento detalha os cinco padrões comprovados para arquitetura de habilidades.
Leia isto ao decidir como estruturar o fluxo de trabalho de uma habilidade durante o
Fase de arquitetura.

## Índice

1. Orquestração de fluxo de trabalho sequencial (linha ~20)
2. Coordenação Multi-MCP (linha ~70)
3. Refinamento Iterativo (linha ~120)
4. Seleção de ferramenta baseada no contexto (linha ~170)
5. Inteligência Específica de Domínio (linha ~210)
6. Escolhendo entre padrões (linha ~250)
7. Combinando Padrões (linha ~280)

---

## 1. Orquestração de fluxo de trabalho sequencial

**Use quando:** os usuários precisam de processos de várias etapas executados em uma ordem específica,
onde cada etapa depende da anterior.

**Enquadramento do problema primeiro:** "Preciso integrar um novo cliente" → Habilidade
orquestra as chamadas certas na sequência certa.

**Características principais:**

- Ordenação explícita de etapas com dependências entre etapas
- Portas de validação entre etapas (não prossiga se a etapa N falhar)
- Instruções de reversão para falhas
- Os dados fluem das etapas anteriores para as posteriores

**Modelo de estrutura:**

```markdown
## Workflow: [Name]

### Step 1: [Action]

Call tool: `tool_name`
Parameters: [what's needed]
Validation: [how to know it succeeded]
On failure: [what to do]

### Step 2: [Action]

Depends on: Step 1 (uses [specific output])
Call tool: `tool_name`
Parameters: [include output from Step 1]
Validation: [check]

### Step 3: [Action]

...
```

**Quando escolher este padrão:**

- O fluxo de trabalho tem uma ordem linear natural
- As etapas têm dependências claras
- Pular uma etapa interromperia o fluxo de trabalho
- Atualmente, os usuários realizam essas etapas manualmente em sequência

**Cuidado com:**

- Ordenação rígida quando algumas etapas podem ser paralelas
- Lógica de reversão ausente (e se a etapa 3 falhar após as etapas 1 e 2 terem sido bem-sucedidas?)
- Não validando entre etapas

---

## 2. Coordenação Multi-MCP

**Use quando:** Os fluxos de trabalho abrangem vários serviços externos, cada um conectado
através de seu próprio servidor MCP.

**Características principais:**

- Separação clara de fases por serviço
- Passagem de dados entre servidores MCP
- Validação antes de passar para a próxima fase
- Tratamento centralizado de erros entre serviços

**Modelo de estrutura:**

```markdown
## Workflow: [Name]

### Phase 1: [Service A] ([MCP name])

1. [Action using Service A tools]
2. [Action using Service A tools]
   Output: [data needed by Phase 2]

### Phase 2: [Service B] ([MCP name])

Input: [data from Phase 1]

1. [Action using Service B tools]
2. [Action using Service B tools]
   Output: [data needed by Phase 3]

### Phase 3: [Service C] ([MCP name])

...

## Error Handling

- If Phase 1 fails: [action]
- If Phase 2 fails but Phase 1 succeeded: [action]
```

**Quando escolher este padrão:**

- O fluxo de trabalho ultrapassa os limites do serviço
- Vários servidores MCP estão envolvidos
- Os dados precisam fluir entre os serviços
- Os usuários atualmente alternam entre as ferramentas manualmente

**Cuidado com:**

- Supondo que todos os MCPs estejam conectados (verifique a disponibilidade primeiro)
- Não lidar com falhas parciais (a Fase 2 falha, mas a Fase 1 já foi executada)
- Acoplamento forte entre fases (prefira passar dados explicitamente)

---

## 3. Refinamento Iterativo

**Use quando:** A qualidade da saída melhora através de vários ciclos de revisão e correção.

**Características principais:**

- Geração de rascunho inicial
- Verificação de qualidade em relação a critérios explícitos
- Loop de refinamento com condições de parada claras
- Etapa de finalização

**Modelo de estrutura:**

```markdown
## Workflow: [Name]

### Initial Draft

1. Gather input data
2. Generate first version
3. Save to working file

### Quality Check

Run validation: `scripts/check_quality.py`
Criteria:

- [Criterion 1]: [how to check]
- [Criterion 2]: [how to check]
- [Criterion 3]: [how to check]

### Refinement Loop

For each issue found:

1. Identify the specific problem
2. Fix it
3. Re-validate

STOP when:

- All criteria pass, OR
- 3 iterations completed (diminishing returns), OR
- User signals satisfaction

### Finalization

1. Apply final formatting
2. Generate summary of changes
3. Save final version
```

**Quando escolher este padrão:**

- A qualidade da saída é subjetiva ou multidimensional
- Os primeiros rascunhos são geralmente "próximos, mas não exatamente"
- Os usuários atualmente revisam e solicitam revisões manualmente
- Existem critérios de qualidade explícitos a serem verificados

**Cuidado com:**

- Loops infinitos (sempre defina condições de parada)
- Polimento excessivo (3 iterações geralmente são suficientes)
- Critérios de qualidade vagos (torná-los verificáveis)

---

## 4. Seleção de ferramenta baseada no contexto

**Usar quando:** O mesmo objetivo pode ser alcançado com ferramentas diferentes dependendo
na entrada ou contexto.

**Características principais:**

- Árvore de decisão baseada em propriedades de entrada
- Opções alternativas quando a escolha principal não está disponível
- Transparência sobre por que um determinado caminho foi escolhido

**Modelo de estrutura:**

```markdown
## Workflow: [Name]

### Analyze Input

Check: [what properties to examine]

- Property A: [value range or type]
- Property B: [value range or type]

### Decision Tree

IF [condition 1]:
→ Use [Tool/Approach A]
Rationale: [why this is better for this case]
ELIF [condition 2]:
→ Use [Tool/Approach B]
Rationale: [why]
ELSE:
→ Use [Tool/Approach C] (default)

### Execute

Based on decision, execute using the selected approach.

### Explain Choice

Tell the user which approach was selected and why.
```

**Quando escolher este padrão:**

- Existem múltiplas abordagens válidas para o mesmo objetivo
- A “melhor” abordagem depende das características de entrada
- Os usuários não sabem (ou não deveriam saber) qual ferramenta é ideal

**Cuidado com:**

- Critérios de decisão que se sobrepõem (roteamento ambíguo)
- Falta de fallback para casos extremos
- Não explicar a escolha ao usuário

---

## 5. Inteligência Específica de Domínio

**Use quando:** o valor da habilidade vem do conhecimento especializado, não apenas
orquestração de ferramentas.

**Características principais:**

- Regras e restrições de domínio incorporadas na lógica
- Verificações de conformidade ou validação antes da ação
- Trilhas de auditoria abrangentes
- Tomada de decisão em nível de especialista

**Modelo de estrutura:**

```markdown
## Workflow: [Name]

### Pre-Check ([Domain] Rules)

Before proceeding, verify:

1. [Domain rule 1]: [how to check]
2. [Domain rule 2]: [how to check]
3. [Domain rule 3]: [how to check]

IF any rule fails:
→ [Escalation or alternative path]
→ Document the failure

### Execute

Only if pre-checks pass:

1. [Action with domain context]
2. [Action with domain context]

### Audit Trail

Log:

- All checks performed and results
- Decisions made and rationale
- Actions taken
```

**Quando escolher este padrão:**

- A habilidade precisa de conhecimento especializado para ser executada corretamente
- Existem regras de conformidade, segurança ou qualidade a serem aplicadas
- Errar tem consequências significativas
- Os usuários se beneficiam mais da “expertise” da habilidade do que de sua automação

**Cuidado com:**

- Conhecimento de domínio desatualizado (planejar atualizações)
- Regras de codificação excessiva que mudam com frequência (em vez disso, consulte documentos externos)
- Não documentar o raciocínio das decisões

---

## 6. Escolhendo entre padrões

| Sinal                                             | Padrão sugerido                    |
| ------------------------------------------------- | ---------------------------------- |
| "Faça A, depois B, depois C"                      | Fluxo de trabalho sequencial       |
| “Obter dados de X, enviar para Y, notificar em Z” | Coordenação Multi-MCP              |
| "Faça bom, depois revise e melhore"               | Refinamento Iterativo              |
| "Tratar PDFs de maneira diferente de CSVs"        | Seleção baseada no contexto        |
| “Siga nossas regras de compliance”                | Inteligência Específica de Domínio |
| As etapas não têm dependências                    | Considere a execução paralela      |

| O usuário diz

é "depende" muito | Seleção baseada no contexto |
| A qualidade é subjetiva | Refinamento Iterativo |

---

## 7. Combinando Padrões

A maioria das habilidades reais combina padrões. Combinações comuns:

- **Sequencial + Inteligência de Domínio:** Siga as etapas na ordem, mas incorpore
  verificações especializadas em pontos críticos (por exemplo, verificação de conformidade antes do pagamento)
- **Multi-MCP + Iterativo:** coordene entre serviços e refine o
  saída combinada
- **Context-Aware + Sequencial:** Escolha a ferramenta certa primeiro e depois siga
  um fluxo de trabalho sequencial específico para essa ferramenta
- **Inteligência de Domínio + Iterativo:** Aplicar regras de domínio, gerar saída,
  revise novamente

critérios de domínio st, refinar

Ao combinar, identifique o padrão PRIMÁRIO (aquele que molda o
fluxo geral) e padrões SECUNDÁRIOS (aqueles que se aplicam dentro de
etapas).
