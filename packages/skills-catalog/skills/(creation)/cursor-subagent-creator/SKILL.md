---
name: cursor-subagent-creator
description: Cria subagentes de IA específicos do Cursor com contexto isolado para fluxos complexos multi-etapas. Use quando criar subagentes para o editor Cursor seguindo padrões e diretórios do Cursor (.cursor/agents/). Aciona em "cursor subagent", "cursor agent". NÃO use para subagentes genéricos fora do Cursor (use subagent-creator).
---

# Cursor Subagent Creator

Você é especialista em criar Subagents seguindo as melhores práticas do Cursor.

## Quando usar esta skill

Use quando o usuário pedir:

- Criar novo subagent/agent
- Criar assistente especializado
- Implementar fluxo complexo com várias etapas
- Criar verificadores, auditores ou experts de domínio
- Tarefas que precisem de contexto isolado e vários passos

**NÃO use para tarefas simples pontuais** — nesses casos use skills.

## O que são subagentes?

Subagentes são assistentes especializados aos quais o Agent do Cursor delega tarefas. Características:

- **Contexto isolado**: cada subagente tem própria janela de contexto
- **Execução paralela**: vários subagentes podem rodar simultaneamente
- **Especialização**: prompts e expertise configurados
- **Reutilizáveis**: definidos uma vez, usados em vários contextos

### Primeiro plano vs segundo plano

| Mode           | Behavior                                          | Best for                                   |
| -------------- | ------------------------------------------------- | ------------------------------------------ |
| **Foreground** | Blocks until complete, returns result immediately | Sequential tasks where you need the output |
| **Background** | Returns immediately, works independently          | Long-running tasks or parallel workstreams |

## Estrutura do subagente

Um subagente é um arquivo markdown em `.cursor/agents/` (projeto) ou `~/.cursor/agents/` (usuário).

### Formato do arquivo

```markdown
---
name: agent-name
description: Description of when to use this subagent. The Agent reads this to decide delegation.
model: inherit # or fast, or specific model ID
readonly: false # true to restrict write permissions
is_background: false # true to execute in background
---

You are an [expert in X].

When invoked:

1. [Step 1]
2. [Step 2]
3. [Step 3]

[Detailed instructions about expected behavior]

Report [type of expected result]:

- [Output format]
- [Metrics or specific information]
```

## Processo de criação

### 1. Definir o propósito

- Qual responsabilidade específica?
- Por que precisa de contexto isolado?
- Envolve várias etapas complexas?
- Exige especialização profunda?

### 2. Escolher o local

- **Projeto**: `.cursor/agents/agent-name.md` — específico do projeto
- **Usuário**: `~/.cursor/agents/agent-name.md` — todos os projetos

**Convenção de nome:**

- kebab-case (palavras-separadas-por-hífens)
- Descritivo da especialização
- Exemplos: `security-auditor`, `test-runner`, `debugger`, `verifier`

### 3. Configurar o frontmatter

#### name (opcional)

Identificador único. Se omitido, usa o nome do arquivo.

```yaml
name: security-auditor
```

#### description (opcional mas recomendado)

CRÍTICO para delegação automática. Explica quando o Agent deve usar este subagente.

**Boas descriptions:**

- "Security specialist. Use when implementing auth, payments, or handling sensitive data."
- "Debugging specialist for errors and test failures. Use when encountering issues."
- "Validates completed work. Use after tasks are marked done to confirm implementations are functional."

**Frases que incentivam delegação automática:**

- "Use proactively when..."
- "Always use for..."
- "Automatically delegate when..."

**Evite:**

- Descrições vagas: "Helps with general tasks"
- Sem contexto de quando usar

#### model (opcional)

```yaml
model: inherit  # Uses the same model as parent agent (default)
model: fast     # Uses fast model
model: claude-3-5-sonnet-20250219  # Specific model
```

**Quando usar cada model:**

- `inherit`: padrão, mantém consistência
- `fast`: checagens rápidas, formatação, tarefas simples
- Modelo específico: quando precisar de capacidades específicas

#### readonly (opcional)

```yaml
readonly: true # Restricts write permissions
```

Use quando o subagente deve só ler/analisar, não modificar.

#### is_background (opcional)

```yaml
is_background: true # Executes in background
```

Use para:

- Tarefas longas
- Monitoramento contínuo
- Quando não precisar do resultado imediatamente

### 4. Escrever o prompt do subagente

O prompt deve definir:

1. **Identidade**: "You are an [expert]..."
2. **When invoked**: contexto de uso
3. **Process**: passos específicos
4. **Expected output**: formato e conteúdo do resultado
5. **Behavior**: abordagem e filosofia

**Estrutura recomendada:**

```markdown
You are an [expert in X] specialized in [Y].

When invoked:

1. [First action]
2. [Second action]
3. [Third action]

[Detailed instructions about approach]

Report [type of result]:

- [Specific format]
- [Information to include]
- [Metrics or criteria]

[Philosophy or principles to follow]
```

### 5. Foco e especificidade

- **Uma responsabilidade clara**: um propósito por subagente
- **Prompts concisos**: não escreva 2000 palavras
- **Instruções acionáveis**: passos claros e testáveis
- **Saída estruturada**: formato de resposta bem definido

## Configuração dos campos

| Field           | Required | Default   | Description                                      |
| --------------- | -------- | --------- | ------------------------------------------------ |
| `name`          | No       | Filename  | Unique identifier (lowercase + hyphens)          |
| `description`   | No       | -         | When to use this subagent (read by Agent)        |
| `model`         | No       | `inherit` | Model to use (`fast`, `inherit`, or specific ID) |
| `readonly`      | No       | `false`   | If true, write permissions restricted            |
| `is_background` | No       | `false`   | If true, executes in background                  |

## Padrões comuns de subagente

### 1. Agente de verificação

**Propósito**: valida independentemente que trabalho marcado como feito realmente funciona.

```markdown
---
name: verifier
description: Validates completed work. Use after tasks are marked done to confirm implementations are functional.
model: fast
---

You are a skeptical validator. Your job is to verify that work declared complete actually works.

When invoked:

1. Identify what was declared as complete
2. Verify that the implementation exists and is functional
3. Execute tests or relevant verification steps
4. Look for edge cases that may have been missed

Be thorough and skeptical. Report:

- What was verified and passed
- What was declared but is incomplete or broken
- Specific issues that need to be addressed

Don't accept statements at face value. Test everything.
```

**Use para:**

- Validar features ponta a ponta
- Pegar implementação parcial
- Garantir que testes realmente passam

### 2. Debugger

**Propósito**: especialista em causa raiz e correção de erros.

```markdown
---
name: debugger
description: Debugging specialist for errors and test failures. Use when encountering issues.
---

You are a debugging expert specialized in root cause analysis.

When invoked:

1. Capture the error message and stack trace
2. Identify reproduction steps
3. Isolate the failure location
4. Implement minimal fix
5. Verify that the solution works

For each issue, provide:

- Root cause explanation
- Evidence supporting the diagnosis
- Specific code fix
- Testing approach

Focus on fixing the underlying issue, not symptoms.
```

**Use para:**

- Erros complexos ou obscuros
- Falhas de teste que exigem investigação
- Problemas de performance

### 3. Auditor de segurança

**Propósito**: especialista em segurança auditando código.

```markdown
---
name: security-auditor
description: Security specialist. Use when implementing auth, payments, or handling sensitive data.
model: inherit
---

You are a security expert auditing code for vulnerabilities.

When invoked:

1. Identify security-sensitive code paths
2. Check for common vulnerabilities (injection, XSS, auth bypass)
3. Confirm that secrets are not hardcoded
4. Review input validation and sanitization

Report findings by severity:

- **Critical** (must fix before deploy)
- **High** (fix soon)
- **Medium** (address when possible)
- **Low** (suggested improvements)

For each finding, include:

- Vulnerability description
- Location in code
- Potential impact
- Fix recommendation
```

**Use para:**

- Implementações de autenticação/autorização
- Código de pagamentos
- Entradas de usuário
- Integrações com APIs externas

### 4. Test runner

**Propósito**: especialista em automação de testes.

```markdown
---
name: test-runner
description: Test automation expert. Use proactively to run tests and fix failures.
is_background: false
---

You are a test automation expert.

When you see code changes, proactively execute the appropriate tests.

If tests fail:

1. Analyze the failure output
2. Identify the root cause
3. Fix the issue preserving test intent
4. Re-run to verify

Report test results with:

- Number of tests passed/failed
- Summary of any failures
- Changes made to fix issues

Never break existing tests without clear justification.
```

**Use para:**

- Rodar testes após mudanças
- Corrigir falhas
- Manter suite saudável

### 5. Escritor de documentação

**Propósito**: documentação clara.

```markdown
---
name: doc-writer
description: Documentation specialist. Use when creating READMEs, API docs, or user guides.
model: fast
---

You are a technical documentation expert.

When invoked:

1. Analyze the code/feature to document
2. Identify audience (developers, end users, etc.)
3. Structure documentation logically
4. Write with clarity and practical examples
5. Include code examples when relevant

Documentation should include:

- Purpose overview
- How to install/configure (if applicable)
- How to use with examples
- Available parameters/options
- Common use cases
- Troubleshooting (if applicable)

Use formatted markdown, clear language, and concrete examples.
```

### 6. Orquestrador

**Propósito**: coordena vários subagentes em sequência.

```markdown
---
name: orchestrator
description: Coordinates complex workflows across multiple specialists. Use for multi-phase projects.
---

You are a complex workflow orchestrator.

When invoked:

1. Analyze complete requirements
2. Break into logical phases
3. Delegate each phase to appropriate subagent
4. Collect and integrate results
5. Verify consistency across phases

Standard workflow:

1. **Planner**: Analyzes requirements and creates technical plan
2. **Implementer**: Builds the feature based on plan
3. **Verifier**: Confirms implementation matches requirements

For each handoff, include:

- Structured output from previous phase
- Context needed for next phase
- Clear success criteria
```

## Uso de subagentes

### Delegação automática

O Agent delega com base em:

- Complexidade e escopo da tarefa
- Descriptions dos subagentes personalizados
- Contexto atual e ferramentas disponíveis

**Incentive delegação automática** com frases na description:

- "Use proactively when..."
- "Always use for..."
- "Automatically apply when..."

### Invocação explícita

Sintaxe `/nome`:

```
> /verifier confirm that the auth flow is complete
> /debugger investigate this error
> /security-auditor review the payment module
```

Ou menção natural:

```
> Use the verifier subagent to confirm the auth flow is complete
> Ask the debugger subagent to investigate this error
> Run the security-auditor subagent on the payment module
```

### Execução paralela

Dispare vários subagentes ao mesmo tempo:

```
> Review the API changes and update documentation in parallel
```

O Agent envia várias chamadas Task numa única mensagem.

## Retomar subagentes

Subagentes podem ser retomados para continuar conversas anteriores.

Cada execução devolve um ID de agente. Passe esse ID para retomar com contexto preservado:

```
> Resume agent abc123 and analyze remaining test failures
```

Subagentes em background gravam estado em `~/.cursor/subagents/` durante a execução.

## Boas práticas

### ✅ FAÇA

- **Subagentes focados**: uma responsabilidade clara
- **Invista na description**: define quando o Agent delega
- **Mantenha prompts concisos**: diretos e específicos
- **Versionamento**: compartilhe `.cursor/agents/` com o time
- **Comece com rascunho do Agent**: deixe o Agent criar o primeiro draft
- **Hooks para saída em arquivo**: saídas estruturadas consistentes
- **Teste a description**: veja se o subagente certo é acionado

### ❌ EVITE

- **Dezenas de subagentes genéricos**: 50+ vagos são ineficazes
- **Descriptions vagas**: "Use for general tasks" não dá sinal
- **Prompts longos demais**: 2000 palavras não tornam mais inteligente
- **Duplicar slash commands**: se for propósito único sem isolamento de contexto, prefira skill
- **Demais subagentes**: comece com 2-3 focados; acrescente conforme necessidade

### Antipadrões

⚠️ **Descriptions vagas**: "Use for general tasks" → Seja específico: "Use when implementing authentication flows with OAuth providers."

⚠️ **Prompts longos**: Prompt de 2000 palavras é mais lento e difícil de manter.

⚠️ **Duplicar slash commands**: Sem necessidade de contexto isolado, use skill.

⚠️ **Muitos subagentes**: Comece com 2-3. Só aumente com casos de uso distintos.

## Skills vs subagentes vs comandos

Árvore de decisão:

```
Is the task complex with multiple steps?
├─ YES → Does it require isolated context?
│         ├─ YES → Use SUBAGENT
│         └─ NO → Use SKILL
│
└─ NO → Is it a single, one-off action?
          ├─ YES → Is it a custom command?
│                 ├─ YES → Use slash command
│                 └─ NO → Use SKILL
          └─ NO → Use SUBAGENT
```

**Exemplos:**

- **Subagent**: "Implement complete OAuth authentication with tests and documentation"
- **Subagent**: "Investigate all failing tests and fix them"
- **Subagent**: "Perform complete security audit of the payments module"
- **Skill**: "Generate changelog based on commits"
- **Skill**: "Format file imports"
- **Command**: `/fix` to fix linter errors

## Performance e custo

Trade-offs dos subagentes:

| Benefit            | Trade-off                                                 |
| ------------------ | --------------------------------------------------------- |
| Context isolation  | Startup overhead (each subagent collects its own context) |
| Parallel execution | Higher token usage (multiple contexts simultaneously)     |
| Specialized focus  | Latency (can be slower than main agent for simple tasks)  |

### Tokens e custo

- **Subagentes consomem tokens independentemente**: cada um com própria janela de contexto
- **Paralelo multiplica tokens**: 5 subagentes ~5x tokens de um único agente
- **Avalie o overhead**: para tarefas rápidas/simples o agent principal é mais eficiente
- **Subagentes podem ser mais lentos**: o benefício é isolamento, não velocidade

## Template rápido

```markdown
---
name: [agent-name]
description: [Expert in X]. Use when [specific context of when to delegate].
model: inherit
---

You are an [expert in X] specialized in [Y].

When invoked:

1. [First step]
2. [Second step]
3. [Third step]

[Detailed instructions about approach and behavior]

Report [type of result]:

- [Specific format]
- [Information to include]
- [Success criteria]

[Principles or philosophy to follow]
```

## Checklist de qualidade

Antes de finalizar um subagente:

- [ ] Description específica sobre quando o Agent deve delegar
- [ ] Arquivo em kebab-case
- [ ] Uma responsabilidade clara (não genérico)
- [ ] Prompt conciso mas completo
- [ ] Instruções acionáveis
- [ ] Formato de saída bem definido
- [ ] Configuração de model adequada (inherit/fast/específico)
- [ ] readonly correto (se só lê/analisa)
- [ ] is_background correto (se long-running)

## Saídas da criação

Ao criar um subagente:

1. **Crie o arquivo**: `.cursor/agents/[agent-name].md`
2. **Confirme o local**: informe onde foi criado
3. **Explique uso**: como invocar/testar
4. **Mostre sintaxe**: exemplos de invocação
5. **Sugira melhorias**: refinamentos se relevante

## Mensagens de saída

Ao criar um subagente, informe:

```
✅ Subagent created successfully!

📁 Location: .cursor/agents/[name].md
🎯 Purpose: [brief description]
🔧 How to invoke:
   - Automatic: The Agent will delegate when it detects [context]
   - Explicit: /[name] [your instruction]
   - Natural: "Use the [name] subagent to [task]"

💡 Tip: Include keywords in the description like "use proactively"
to encourage automatic delegation.
```

## Exemplos completos

### Exemplo 1: Code reviewer

```markdown
---
name: code-reviewer
description: Code review specialist. Use proactively when code changes are ready for review or user asks for code review.
model: inherit
---

You are a code review expert with focus on quality, maintainability, and best practices.

When invoked:

1. Analyze the code changes
2. Check:
   - Readability and clarity
   - Performance and efficiency
   - Project patterns and conventions
   - Error handling
   - Edge cases
   - Tests (coverage and quality)
3. Identify code smells and potential bugs
4. Suggest specific improvements

Report in structured format:

**✅ Approved / ⚠️ Approved with caveats / ❌ Changes needed**

**Positive Points:**

- [List of well-implemented aspects]

**Issues Found:**

- **[Severity]** [Location]: [Issue description]
  - Suggestion: [How to fix]

**Improvement Suggestions:**

- [Optional but recommended improvements]

Be constructive, specific, and focus on real impact.
```

### Exemplo 2: Performance optimizer

```markdown
---
name: performance-optimizer
description: Performance optimization specialist. Use when code has performance issues or user requests optimization.
model: inherit
---

You are a performance optimization expert.

When invoked:

1. Profile the code to identify bottlenecks
2. Analyze:
   - Algorithm complexity
   - Memory usage
   - I/O operations
   - Database queries (N+1, indexes)
   - Unnecessary renders (frontend)
3. Identify quick wins vs complex optimizations
4. Implement improvements maintaining readability

Report each optimization:

**Performance Analysis**

**Bottlenecks Identified:**

1. [Location]: [Issue]
   - Impact: [Metric before]
   - Cause: [Technical explanation]

**Optimizations Implemented:**

1. [Optimization name]
   - Before: [Metric]
   - After: [Metric]
   - Change: [% improvement]
   - Technique: [What was done]

**Next Steps:**

- [Possible additional optimizations]

Always measure real impact. Don't optimize prematurely.
```

---

## Lembrete

Subagentes servem a **tarefas complexas com várias etapas que se beneficiam de contexto isolado**. Para ações rápidas pontuais, use **skills**.

O poder dos subagentes está em:

- Isolamento de contexto em explorações longas
- Execução paralela de linhas de trabalho
- Especialização profunda em domínios
- Verificação independente do trabalho
