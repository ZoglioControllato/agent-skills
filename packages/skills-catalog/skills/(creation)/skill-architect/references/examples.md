# Descrição e exemplos de instruções

Referência para escrever descrições e instruções de habilidades eficazes.
Leia isto durante a fase de Arquitetura (para descrições) e fase de Artesanato
(para instruções).

---

## Boas descrições

Cada exemplo segue o padrão: [O que] + [Quando/Triggers] + [Não-quando].

### Criação de documentos e ativos```yaml

description: Analyzes Figma design files and generates developer handoff documentation.
Use when user uploads .fig files, asks for "design specs", "component
documentation", or "design-to-code handoff". Do NOT use for general
design discussions or UI feedback.

````

```yaml
description: Creates distinctive, production-grade frontend interfaces with high design
  quality. Use this skill when the user asks to build web components, pages,
  artifacts, posters, or applications (examples include websites, landing
  pages, dashboards, React components, HTML/CSS layouts, or when
  styling/beautifying any web UI). Generates creative, polished code and UI
  design that avoids generic AI aesthetics.
````

### Automação de fluxo de trabalho```yaml

description: Manages Linear project workflows including sprint planning, task creation,
and status tracking. Use when user mentions "sprint", "Linear tasks",
"project planning", or asks to "create tickets". Do NOT use for general
project management advice without Linear context.

````

```yaml
description: End-to-end customer onboarding workflow for PayFlow. Handles account
  creation, payment setup, and subscription management. Use when user says
  "onboard new customer", "set up subscription", or "create PayFlow account".
````

### Aprimoramento do MCP```yaml

description: Automatically analyzes and fixes detected bugs in GitHub Pull Requests
using Sentry's error monitoring data via their MCP server. Use when user
mentions "Sentry errors", "fix bugs from monitoring", "PR review with
error data", or asks to analyze production errors in code.

````
---

## Descrições ruins (e por quê)```yaml
# ❌ Too vague — no trigger phrases, no specifics
description: Helps with projects.
# Why it fails: the agent can't determine WHEN to load this.
````

```yaml
# ❌ Missing triggers — describes capability but not activation
description: Creates sophisticated multi-page documentation systems.
# Why it fails: What would a user SAY to trigger this? "Create docs"?
# "Write documentation"? Include the actual phrases.
```

```yaml
# ❌ Too technical, no user perspective
description: Implements the Project entity model with hierarchical relationships.
# Why it fails: Users don't think in entity models. They think in tasks.
```

```yaml
# ❌ Too broad — will overtrigger
description: Processes documents.
# Why it fails: Loads for ANY document task. Add file types and specifics.
```

```yaml
# ❌ Overlap without boundaries
description: Analyzes data and creates visualizations.
# Why it fails: Conflicts with built-in capabilities and other skills.
# Add specifics about WHAT data and WHAT kind of visualizations.
```

---

## Corrigindo overtriggering com gatilhos negativos```yaml

# Before: triggers on all data tasks

description: Advanced data analysis for CSV files.

# After: scoped with negative triggers

description: Advanced data analysis for CSV files. Use for statistical modeling,
regression, clustering. Do NOT use for simple data exploration
(use data-viz skill instead) or for reading CSV files without analysis.

````
---

## Boas instruções

### Específico e acionável```markdown
# ✅ Good — tells the agent exactly what to do

Run `python scripts/validate.py --input {filename}` to check data format.
If validation fails, common issues include:

- Missing required fields → add them to the CSV
- Invalid date formats → use YYYY-MM-DD
- Encoding errors → convert to UTF-8 first
````

```markdown
# ❌ Bad — vague and unactionable

Validate the data before proceeding.
```

### Tratamento de erros```markdown

# ✅ Good — specific error, cause, solution

## Common Issues

### MCP Connection Failed

If you see "Connection refused":

1. Verify MCP server is running: Check Settings > Extensions
2. Confirm API key is valid
3. Try reconnecting: Settings > Extensions > [Service] > Reconnect

````

```markdown
# ❌ Bad — no specifics

If something goes wrong, try again.
````

### Referências de recursos```markdown

# ✅ Good — says WHEN and WHY to read the file

Before writing queries, consult `references/api-patterns.md` for:

- Rate limiting guidance (if making >10 calls)
- Pagination patterns (if results may exceed 100 items)
- Error codes and handling (if calls may fail)

````

```markdown
# ❌ Bad — no guidance on when to read

See references/ for more information.
````

### Instruções Críticas```markdown

# ✅ Good — prominent, specific, verifiable

CRITICAL: Before calling create_project, verify:

- Project name is non-empty
- At least one team member assigned
- Start date is not in the past
  If any check fails, tell the user what's missing before proceeding.

````

```markdown
# ❌ Bad — buried, vague, not verifiable

Make sure to validate things properly.
````

### Exemplos em habilidades```markdown

# ✅ Good — realistic user input with concrete output

## Examples

### Example 1: New sprint setup

User says: "Help me plan the Q4 sprint for the mobile team"
Actions:

1. Fetch current backlog from Linear (MCP)
2. Check team capacity (3 engineers, 2-week sprint)
3. Prioritize by impact score
4. Create 12 tasks with estimates
   Result: Sprint board populated with 12 prioritized tasks, each with
   story points and assignees. Summary posted to #mobile-team Slack.

````

```markdown
# ❌ Bad — generic, no concrete details

### Example 1: Setup

User says: "Set up a project"
Result: Project gets created.
````

---

## Lista de verificação antipadrões

Antes de finalizar qualquer habilidade, verifique se NENHUMA destas está presente:

### Antipadrões Estruturais

- [ ] Arquivo chamado SKILL.MD, skill.md ou qualquer variante (deve ser exatamente SKILL.md)
- [] A pasta contém espaços ou letras maiúsculas (deve ser kebab-case)
- [] README.md existe dentro da pasta de habilidades
- [] colchetes angulares XML (< >) no frontmatter YAML
- [ ] "claude" ou "antrópico" no nome da habilidade
- [] Faltando --- delimitadores em torno do frontmatter
- []SKILL.md ultrapassa 500 linhas sem divulgação progressiva

### Descrição Antipadrões

- [] Nenhuma frase de gatilho incluída
- [] Muito vago (pode corresponder a qualquer coisa)
- [] Muito técnico (falta a perspectiva do usuário)
- [] Sem gatilhos negativos quando existe risco de sobreposição
- [] Excede 1.024 caracteres

### Antipadrões de instrução

- [] Direções vagas sem ações específicas
- [] Instruções críticas enterradas no meio do documento
- [] Nenhum exemplo de uso realista
- [] Nenhuma orientação de tratamento de erros
- [] Referências a arquivos externos sem condições de carregamento
- [] Instruções de parede de texto sem estrutura
- [] Assume que a habilidade é a única carregada
- [] Usa prosa onde um script seria determinístico

### Antipadrões de qualidade

- [] Nenhuma etapa de validação no fluxo de trabalho
- [] Sem condições de parada para processos iterativos
- [] Falta de tratamento de reversão/falha
- [] Confiança excessiva em "tenha cuidado" em vez de verificações específicas
