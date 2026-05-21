# Modo Rápido

**Objetivo:** Executar tarefas pequenas e ad hoc com os mesmos princípios de qualidade, mas sem cerimônia completa de pipeline.

**Acionador:** "Correção rápida", "Tarefa rápida", "Pequena alteração", "Correção de bug", "Basta fazer X"

## Quando usar

| Use o modo rápido                        | Usar pipeline completo                 |
| ---------------------------------------- | -------------------------------------- |
| Correções de bugs com causa conhecida    | Novos recursos com múltiplas histórias |
| Mudanças de configuração                 | Mudanças arquitetônicas                |
| Pequenos ajustes na interface do usuário | Recursos que exigem decisões de design |
| Adicionando um campo/coluna              | Recursos multicomponentes              |
| Roteiros únicos                          | Qualquer coisa                         |

com escopo pouco claro |
| Atualizações de dependências | Recursos que exigem histórias de usuários |

**Regra prática:** Se você puder descrevê-lo em uma frase E ele abrange ≤3 arquivos, é uma tarefa rápida.

## Processo

### 1. Descreva a tarefa

O usuário fornece uma descrição clara de uma frase. Se for vago, peça detalhes:

- ❌ "Consertar o login" → Pergunte: "O que está quebrado? O que deveria acontecer em vez disso?"
- ✅ "Correção: o botão de login retorna 401 porque a atualização do token ignora a verificação expirada"

### 2. Verificação pré-implementação

Antes de escrever o código, indique:```
Quick Task: [description]
Files: [list ONLY files to touch]
Approach: [one sentence]
Verify: [how to prove it works]

````
Obtenha a aprovação do usuário antes de continuar. Se a verificação de pré-implementação revelar que a tarefa é maior do que o esperado (>3 arquivos, dependências pouco claras, decisões de design necessárias), recomende o pipeline completo.

### 3. Implementar

Siga [coding-principles.md](coding-principles.md):

- Código mais simples que funciona
- Toque SOMENTE nos arquivos listados
- Sem aumento de escopo - conserte a coisa, nada mais

### 4. Verifique

Execute a verificação a partir da etapa 2. Marque como concluído somente após a verificação ser aprovada.

### 5. Comprometa-se

Confirmação atômica seguindo [Conventional Commits 1.0.0](https://www.conventionalcommits.org/en/v1.0.0/):```
<type>(<scope>): <description>
````

Use modo imperativo, letras minúsculas, sem ponto final. Consulte [implement.md](implement.md) para obter a tabela completa de tipos.

Exemplos:

- `fix(auth): evita 401 na atualização do token`
- `feat (configurações): adicionar alternância do modo escuro`
- `chore (deps): atualize eslint para v9`

### 6. Rastrear

Atualize `.specs/project/STATE.md` com registro de tarefa rápida (consulte a seção Tarefas rápidas de state-management.md).

---

## Estrutura

As tarefas rápidas são separadas dos recursos planejados:```
.specs/
└── quick/
└── NNN-slug/
├── TASK.md # Description + verification
└── SUMMARY.md # What was done + commit

````

**Modelo TAREFA.md:**

```markdown
# Quick Task NNN: [Title]

**Date:** [date]
**Status:** Done | In Progress | Blocked

## Description

[One sentence: what and why]

## Files Changed

- `src/path/to/file.ts` — [what changed]
- `src/path/to/other.ts` — [what changed]

## Verification

- [ ] [How to verify it works]
- [ ] [Expected behavior after fix]

## Commit

`[hash]` — [commit message]
````

---

## Guarda-corpos

- **Máximo de 3 arquivos** — Se mais, use o pipeline completo
- **Máximo de 1 hora** — Se for mais longo, o escopo está errado
- **Sem decisões de design** — Se você estiver escolhendo entre abordagens, use o pipeline completo
- **Sem novas dependências** — A adição de pacotes requer uma revisão completa do pipeline
- **Acompanhe tudo** — Até mesmo tarefas rápidas recebem commits e entradas STATE.md

---

## Dicas

- **Rápido ≠ desleixado** — Os mesmos princípios de codificação se aplicam, apenas com menos cerimônia
- **Em caso de dúvida, vá em frente** — É melhor planejar demais do que enviar código quebrado
- **Composto de tarefas rápidas** — Se você estiver realizando mais de 5 tarefas rápidas para a mesma área, é um recurso que precisa de planejamento
- **Verifique antes de marcar como concluído** — O ponto principal é a qualidade, mesmo para pequenas tarefas
