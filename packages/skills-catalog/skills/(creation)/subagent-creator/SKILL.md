---
name: subagent-creator
description: Guia para criar subagentes de IA com contexto isolado em fluxos complexos multi-etapas. Use quando usuários quiserem criar subagente, agente especializado, verificador, debugger ou orquestrador que exija contexto isolado e especialização profunda. Funciona em qualquer agente com delegação a subagentes. Aciona em "criar subagente", "novo agente", "assistente especializado", "criar verificador". NÃO use para subagentes específicos do Cursor (use cursor-subagent-creator).
---

# Subagent Creator

Esta skill orienta criação de subagentes eficazes e agnósticos de plataforma.

## O que são subagentes?

Subagentes são assistentes especializados aos quais um agente de IA delega tarefas. Características:

- **Contexto isolado**: cada subagente tem sua própria janela de contexto
- **Execução paralela**: vários subagentes podem rodar ao mesmo tempo
- **Especialização**: configurados com prompts e expertise específicos
- **Reutilizáveis**: definidos uma vez, usados em vários contextos

### Quando usar subagentes vs skills

```
A tarefa é complexa com várias etapas?
├─ SIM → Exige contexto isolado?
│         ├─ SIM → Use SUBAGENTE
│         └─ NÃO → Use SKILL
│
└─ NÃO → Use SKILL
```

**Use subagentes para:**

- Fluxos complexos que precisam de contexto isolado
- Tarefas longas que beneficiam especialização
- Verificação e auditoria (perspectiva independente)
- Linhas de trabalho paralelas

**Use skills para:**

- Ações rápidas e pontuais
- Conhecimento de domínio sem isolamento de contexto
- Procedimentos reutilizáveis que não precisam de isolamento

## Estrutura do subagente

Tipicamente um arquivo markdown com frontmatter:

```markdown
---
name: agent-name
description: Descrição de quando usar este subagente.
model: inherit # ou fast, ou ID de modelo específico
readonly: false # true para restringir escrita
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

### 2. Configurar metadata

#### name (obrigatório)

Identificador único. Use kebab-case.

```yaml
name: security-auditor
```

#### description (crítico)

CRÍTICO para delegação automática. Explica quando usar o subagente.

**Boas descrições:**

- "Security specialist. Use when implementing auth, payments, or handling sensitive data."
- "Debugging specialist for errors and test failures. Use when encountering issues."
- "Validates completed work. Use after tasks are marked done."

**Frases que incentivam delegação automática:**

- "Use proactively when..."
- "Always use for..."
- "Automatically delegate when..."

#### model (opcional)

```yaml
model: inherit  # mesmo modelo do pai (padrão)
model: fast     # modelo rápido para tarefas leves
```

#### readonly (opcional)

```yaml
readonly: true # restringe permissões de escrita
```

### 3. Escrever o prompt do subagente

Defina:

1. **Identidade**: "You are an [expert]..."
2. **When invoked**: contexto de uso
3. **Process**: passos específicos
4. **Expected output**: formato e conteúdo

**Template:**

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

## Padrões comuns

### 1. Agente de verificação

**Propósito**: valida independentemente que o trabalho concluído funciona.

```markdown
---
name: verifier
description: Validates completed work. Use after tasks are marked done.
model: fast
---

You are a skeptical validator.

When invoked:

1. Identify what was declared as complete
2. Verify that the implementation exists and is functional
3. Execute tests or relevant verification steps
4. Look for edge cases that may have been missed

Be thorough. Report:

- What was verified and passed
- What is incomplete or broken
- Specific issues to address
```

### 2. Debugger

**Propósito**: especialista em causa raiz.

```markdown
---
name: debugger
description: Debugging specialist. Use when encountering errors or test failures.
---

You are a debugging expert.

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
```

### 3. Auditor de segurança

**Propósito**: segurança no código.

```markdown
---
name: security-auditor
description: Security specialist. Use for auth, payments, or sensitive data.
---

You are a security expert.

When invoked:

1. Identify security-sensitive code paths
2. Check for common vulnerabilities
3. Confirm secrets are not hardcoded
4. Review input validation

Report findings by severity:

- **Critical** (must fix before deploy)
- **High** (fix soon)
- **Medium** (address when possible)
- **Low** (suggestions)
```

### 4. Code reviewer

**Propósito**: revisão focada em qualidade.

```markdown
---
name: code-reviewer
description: Code review specialist. Use when changes are ready for review.
---

You are a code review expert.

When invoked:

1. Analyze the code changes
2. Check readability, performance, patterns, error handling
3. Identify code smells and potential bugs
4. Suggest specific improvements

Report:
**✅ Approved / ⚠️ Approved with caveats / ❌ Changes needed**

**Issues Found:**

- **[Severity]** [Location]: [Issue]
  - Suggestion: [How to fix]
```

## Boas práticas

### ✅ FAÇA

- **Subagentes focados**: uma responsabilidade clara
- **Invista na description**: define quando delegar
- **Prompts concisos**: diretos e específicos
- **Compartilhe com o time**: versione definições
- **Teste a description**: confira se aciona o subagente correto

### ❌ EVITE

- **Descriptions vagas**: "Use for general tasks" não sinaliza nada
- **Prompts longos**: 2000 linhas não tornam mais inteligente
- **Muitos subagentes**: comece com 2-3 focados

## Checklist de qualidade

Antes de finalizar:

- [ ] Description diz claramente quando delegar
- [ ] Name em kebab-case
- [ ] Uma responsabilidade clara (não genérico)
- [ ] Prompt conciso mas completo
- [ ] Instruções acionáveis
- [ ] Formato de saída bem definido
- [ ] Model adequado

## Mensagens de saída

Ao criar um subagente:

```
✅ Subagent created successfully!

📁 Location: .agent/subagents/[name].md
🎯 Purpose: [brief description]
🔧 How to invoke:
   - Automatic: Agent delegates when it detects [context]
   - Explicit: /[name] [instruction]

💡 Tip: Include keywords like "use proactively" to encourage delegation.
```
