<p alinhar="centro">
  <img src="https://img.shields.io/badge/Skill-TLC%20Spec--Driven-blue?style=for-the-badge" alt="crachá de habilidade" />
  <img src="https://img.shields.io/badge/Stack-Agnostic-green?style=for-the-badge" alt="stack agnostic" />
  <img src="https://img.shields.io/badge/Version-2.0.0-purple?style=for-the-badge" alt="versão" />
</p>

<h1 align="center">🎯 Orientado por especificações TLC</h1>

<p alinhar="centro">
  <strong>Planejar e implementar projetos com precisão. Tarefas granulares. Dependências claras. Ferramentas certas. Cerimônia zero.</strong>
</p>

<p alinhar="centro">
  <em>Da comunidade do <a href="https://github.com/tech-leads-club">Tech Lead's Club</a></em>
</p>

<p alinhar="centro">
  <strong>Autor:</strong> <a href="https://github.com/felipfr">Felipe Rodrigues</a> · 
  <a href="https://linkedin.com/in/felipfr">LinkedIn</a>
</p>

## ✨ O que é essa habilidade?

**TLC Spec-Driven** transforma a forma como os agentes de IA abordam projetos de software. Em vez de um pipeline rígido e burocrático, ele usa **4 fases adaptativas** que são dimensionadas automaticamente com base na complexidade — aplicando rigor total para recursos complexos e ignorando cerimônias para recursos simples:```
┌──────────┐ ┌──────────┐ ┌─────────┐ ┌─────────┐
│ SPECIFY │ → │ DESIGN │ → │ TASKS │ → │ EXECUTE │
└──────────┘ └──────────┘ └─────────┘ └─────────┘
required optional* optional* required

- Agent auto-skips when scope doesn't need it

````

**A complexidade está no sistema, não no seu fluxo de trabalho.** Você fala naturalmente — a habilidade decide até que ponto ir:

| Escopo | O que acontece |
| ----------------------------------- | ----------------------------------------------------------------- |
| **Pequeno** (≤3 arquivos) | Modo rápido — descrever → implementar → verificar → confirmar |
| **Médio** (recurso claro) | Especifique → Executar (design e tarefas em linha) |
| **Grande** (vários

-componente) | Pipeline completo com design formal e divisão de tarefas |
| **Complexo** (ambiguidade, novo domínio) | Pipeline completo + discussão na área cinzenta + pesquisa + UAT interativo |

## 🚀 Início rápido

### Instalação```bash
npx @tech-leads-club/agent-skills install -s tlc-spec-driven
````

### Primeiros Comandos

| O que você quer               | Diga isto                                                  |
| ----------------------------- | ---------------------------------------------------------- |
| Iniciar um novo projeto       | `"Inicializar projeto"` ou `"Configurar projeto"`          |
| Trabalhe com código existente | `"Mapear base de código"` ou `"Analisar código existente"` |
| Planeje um recurso            | `"Especificar recurso [nome]"`                             |
| Correção rápida de bug        | `"Correção rápida: [descrição]"`                           |

|
| Retomar trabalho anterior | `"Retomar trabalho"` ou `"Continuar"` |

> 💬 **Conversa natural, não comandos**
>
> Estas são frases de gatilho, não comandos estritos. A habilidade funciona por meio de uma **conversa natural** – fale com seu agente como faria com um colega. Diga coisas como _"Quero construir um sistema de autenticação"_ ou _"Conserte o botão de login, ele retorna 401"_. O agente entende o contexto e a intenção, não apenas as palavras-chave.

## 📁 Estrutura do Projeto

A habilidade cria um diretório `.specs/` para organizar toda a documentação do projeto:```
.specs/
├── project/
│ ├── PROJECT.md # Vision, goals, tech stack, constraints
│ ├── ROADMAP.md # Milestones, features, status tracking
│ └── STATE.md # Persistent memory: decisions, blockers, learnings, todos, deferred ideas
│
├── codebase/ # Brownfield analysis (existing projects only)
│ ├── STACK.md # Technology stack and dependencies
│ ├── ARCHITECTURE.md # Patterns, data flow, code organization
│ ├── CONVENTIONS.md # Naming, style, coding patterns
│ ├── STRUCTURE.md # Directory layout and modules
│ ├── TESTING.md # Test frameworks and patterns
│ ├── INTEGRATIONS.md # External services and APIs
│ └── CONCERNS.md # Tech debt, risks, fragile areas
│
├── features/ # Feature specifications
│ └── [feature-name]/
│ ├── spec.md # Requirements with traceable IDs (FEAT-01, AUTH-02...)
│ ├── context.md # User decisions for gray areas (only when needed)
│ ├── design.md # Architecture and components (only for large/complex)
│ └── tasks.md # Atomic tasks with dependencies (only for large/complex)
│
└── quick/ # Ad-hoc tasks (quick mode)
└── NNN-slug/
├── TASK.md # Description + verification
└── SUMMARY.md # What was done + commit

````
## 🔄 As quatro fases adaptativas

### Especifique (sempre)

**Objetivo:** Capturar O QUE construir com requisitos testáveis e rastreáveis.

O agente atua como um parceiro pensante – não como um entrevistador. Ele faz perguntas esclarecedoras, desafia a imprecisão e captura requisitos com IDs rastreáveis:```markdown
### P1: User Login ⭐ MVP

**User Story:** As a user, I want to log in so that I can access my account.

| Requirement ID | Acceptance Criteria                                                            |
| -------------- | ------------------------------------------------------------------------------ |
| AUTH-01        | WHEN user enters valid credentials THEN system SHALL authenticate and redirect |
| AUTH-02        | WHEN user enters invalid credentials THEN system SHALL display error message   |
| AUTH-03        | WHEN user is already logged in THEN system SHALL redirect to dashboard         |
````

**Discutir áreas cinzentas (acionadas automaticamente):** Quando a especificação tem decisões ambíguas voltadas para o usuário (preferências de layout, padrões de interação, estilo de tratamento de erros), o agente pergunta automaticamente ao usuário sobre elas — criando um `context.md` que bloqueia essas decisões antes do design. Esta NÃO é uma fase separada — só acontece em Especificar quando a ambiguidade é detectada.

### Design (quando necessário)

**Objetivo:** Definir COMO construí-lo. Arquitetura, componentes, o que reutilizar.

**Ignorado quando:** A mudança é direta — sem decisões arquitetônicas, sem novos padrões. Para recursos simples, o design acontece em linha durante a execução.

**Inclui pesquisa:** Antes de projetar com tecnologia desconhecida, o agente segue a **Cadeia de verificação de conhecimento** (base de código → documentos do projeto → Context7 MCP → pesquisa na web → sinalizador incerto). Ela **nunca assume ou fabrica** — se não conseguir encontrar documentação, é o que diz.

**Saída:** `design.md` com diagramas de arquitetura, definições de componentes e pontos de integração.

### Tarefas (quando necessário)

**Objetivo:** Divida em tarefas GRANULARES e ATÔMICAS com dependências claras.

**Ignorado quando:** Existem ≤3 etapas óbvias. Nesse caso, as tarefas são listadas em linha no início de Executar.

**Válvula de segurança:** Se a listagem de etapas in-line revelar >5 etapas ou dependências complexas, o agente PÁRA e cria um `tasks.md` formal — reconhecendo que a fase de Tarefas foi ignorada indevidamente.

| ❌ Tarefa Vaga     | ✅ Tarefas Atômicas                                 |
| ------------------ | --------------------------------------------------- |
| "Criar formulário" | T1: Criar componente de entrada de e-mail           |
|                    | T2: Adicionar função de validação de e-mail         |
|                    | T3: Criar botão de envio                            |
|                    | T4: Adicionar gerenciamento de estado de formulário |

Cada tarefa inclui: O quê (entrega), Onde (caminho do arquivo), Depende de (pré-requisitos), Reutilizações (código existente), Requisito (ID rastreável), Feito quando (critérios verificáveis), Confirmação (formato da mensagem).

### Executar (sempre)

**Objetivo:** implementar uma tarefa por vez. Verificar. Comprometer-se. Repita.

Cada tarefa segue o mesmo ciclo:```
Plan → Implement → Verify → Commit → Next

````

**Princípios-chave:**

- **Alterações cirúrgicas** — Toque apenas nos arquivos necessários
- **Sem aumento de escopo** — Se não estiver na tarefa, não toque nele. Capture ideias em STATE.md como ideias adiadas
- **Verificar antes de confirmar** — Verifique todos os critérios "Concluído quando"
- **Atomic git commits** — Uma tarefa = um commit, seguindo [Conventional Commits 1.0.0](https://www.conventionalcommits.org/en/v1.0.0/)```
feat(auth): add email validation to login form

refactor(api): extract token refresh logic into service

fix(cart): prevent negative quantity on item decrement
````

A **validação em nível de recurso** acontece após a conclusão de todas as tarefas, incluindo verificações de critérios de aceitação, revisão de qualidade de código e UAT opcionalmente interativo para recursos complexos voltados para o usuário.

## ⚡ Modo Rápido

Para pequenas tarefas (correções de bugs, alterações de configuração, ajustes ≤3 arquivos) que não precisam do pipeline completo:```
You: Quick fix: login button returns 401 because token refresh skips expired check

Agent: Quick Task: Fix token refresh expired check
Files: src/services/auth.ts
Approach: Add expiry validation before refresh attempt
Verify: Login with expired token returns new session, not 401

       [Implements...]

       ✅ Done. Committed: fix(auth): add expiry check to token refresh

````

**Guarda-corpos:** Máximo de 3 arquivos, máximo de 1 hora, sem decisões de design, sem novas dependências. Se algum deles for excedido, o agente recomenda o pipeline completo.

## 📋 Referência completa de comandos

Esses padrões de gatilho ajudam o agente a reconhecer sua intenção, mas você não precisa usá-los literalmente. Fale naturalmente – o agente entende as variações e o contexto.

### Nível do projeto

| Padrão de gatilho | Descrição |
| -------------------------------------------- | ----------------------------------------------------- |
| `Inicializar projeto`, `Configurar projeto` | Crie PROJECT.md com visão, objetivos e restrições |
| `Criar roteiro`, `Planejar recursos` | Crie ROADMAP.md com marcos e recursos |
| `Mapear base de código`, `Analisar exi

código de picada` | Crie 7 documentos brownfield para projetos existentes |
| `Documente preocupações`, `Encontre dívidas tecnológicas` | Identificar e documentar riscos de base de código |
| `Registrar decisão`, `Bloqueador de log`, `Adicionar tarefas` | Adicionar entradas ao STATE.md |
| `Pausar trabalho`, `Terminar sessão` | Criar transferência para continuidade da sessão |
| `Retomar trabalho`, `Continuar` | Carregar anterior

nós declaramos e continuamos |

### Nível de recurso (dimensionamento automático)

| Padrão de gatilho | Descrição |
| ----------------------------------------- | --------------------------------------- |
| `Especificar recurso`, `Definir requisitos` | Crie spec.md com IDs de requisitos |
| `Discutir recurso`, `Como isso deve funcionar` | Capture decisões do usuário para áreas cinzentas |
| `Recurso de design`, `Arquitetura` | Crie design.md com arquitetura |
| `Quebre eu

nto tarefas`, `Criar tarefas` | Crie tarefas.md com divisão atômica |
| `Implementar tarefa`, `Construir`, `Executar` | Execute tarefa específica com verificação |
| `Validar`, `Verificar trabalho`, `UAT` | Validação e teste em nível de recurso |
| `Correção rápida`, `Tarefa rápida`, `Correção de bug` | Via expressa para pequenas mudanças |

## 🔁 Exemplos de fluxo de trabalho

### Iniciando um novo projeto```
You: Initialize project

Agent: I'll help you set up your project. Let me ask a few questions:
       1. What are you building?
       2. Who is it for and what problem does it solve?
       ...

You: [Answer questions]

Agent: ✅ Created .specs/project/PROJECT.md
       Next: Would you like to create a roadmap? Say "Create roadmap"
````

### Trabalhando com uma base de código existente```

You: Map codebase

Agent: I'll analyze your existing codebase and document: - Technology stack, Architecture patterns, Coding conventions - Project structure, Testing infrastructure, External integrations - Concerns (tech debt, risks, fragile areas)

       [Analyzes codebase...]

       ✅ Created 7 brownfield docs in .specs/codebase/
       Next: Initialize project to define goals and roadmap

````
### Implementando um recurso (dimensionamento automático)```
You: Specify feature user-authentication

Agent: [Asks clarifying questions, creates spec.md with requirement IDs]
       I notice some gray areas in the UX — how should failed login attempts behave?
       [Discusses gray areas, creates context.md]

You: Design the feature

Agent: [Researches JWT best practices via Context7, creates design.md]

You: Break into tasks

Agent: [Creates tasks.md with 8 atomic tasks + parallel execution plan]

You: Implement T1

Agent: Implementing T1: Create auth service interface
       Files: src/services/auth.interface.ts
       Approach: Define interface based on design
       Verify: Interface compiles, exports correctly

       [Implements...]

       ✅ Committed: feat(auth): create auth service interface
       Next available: T2, T3 [P] (parallel)
````

### Correção rápida de bug```

You: Quick fix: dark mode toggle doesn't persist after page refresh

Agent: Quick Task: Persist dark mode preference
Files: src/hooks/useTheme.ts, src/utils/storage.ts
Approach: Save preference to localStorage on toggle
Verify: Toggle dark mode, refresh page, preference persists

       [Implements...]

       ✅ Committed: fix(theme): persist dark mode preference to localStorage

````
### Continuidade da Sessão```
You: Pause work

Agent: ✅ Created .specs/HANDOFF.md
       - Feature: user-authentication
       - Completed: T1, T2 (committed)
       - In progress: T3 (70%)
       - Next session: Continue T3, then T4

--- Later, new session ---

You: Resume work

Agent: Resuming user-authentication at T3
       - Completed: T1 (auth interface), T2 (token storage)
       - In progress: T3 - auth service at src/services/auth.service.ts:45
       - Next: Complete T3, then T4 (parallel with T5)

       Continue with T3?
````

## 🧠 Gerenciamento de Contexto

A habilidade foi projetada para funcionar dentro dos limites do contexto:

| Estratégia de Carga     | Documentos                                                     | Fichas |
| ----------------------- | -------------------------------------------------------------- | ------ |
| **Carga base** (sempre) | PROJETO.md, ROADMAP.md, ESTADO.md                              | ~15k   |
| **Sob demanda**         | Especificações, contexto, design ou tarefas atuais             | +5-10k |
| **Nunca simultâneo**    | Várias especificações de recursos ou documentos de arquitetura | —      |

**Meta:** <40 mil tokens carregados (20% do contexto)
**Reserva:** mais de 160 mil tokens para trabalho, raciocínio e resultados

Quando o contexto excede 40 mil tokens, a habilidade exibe um indicador de status e sugere otimizações.

## 🔗 Integrações de habilidades

TLC Spec-Driven funciona ainda melhor quando combinado com habilidades complementares:

| Habilidade         | Integração                                                                                          |
| ------------------ | --------------------------------------------------------------------------------------------------- |
| **estúdio sereia** | Diagramas — visões gerais da arquitetura, fluxos de dados, diagramas de sequência                   |
| **codenavi**       | Exploração de código — mapeamento brownfield, identificação de padrões, rastreamento de dependência |

A habilidade detecta automaticamente se eles estão instalados e delega tarefas especializadas a eles. Se não for instalado, ele volta normalmente e os recomenda uma vez por sessão.

## 📚 Arquivos de referência

A habilidade inclui documentação de referência detalhada carregada sob demanda:

| Arquivo                 | Finalidade                                    |
| ----------------------- | --------------------------------------------- |
| `projeto-init.md`       | Processo e modelo de inicialização do projeto |
| `roadmap.md`            | Criação de roadmap e acompanhamento de marcos |
| `brownfield-mapping.md` | Código abrangente                             |

análise básica (7 documentos) |
| `preocupações.md` | Dívida tecnológica, riscos e documentação de áreas frágeis |
| `especificar.md` | Levantamento de requisitos com IDs rastreáveis ​​|
| `discutir.md` | Discussão sobre áreas cinzentas e captura de contexto |
| `design.md` | Arquitetura, pesquisa e design de componentes

|
| `tarefas.md` | Metodologia granular de divisão de tarefas |
| `implementar.md` | Executar: implementação + verificação + commits atômicos |
| `validar.md` | Validação de recursos e UAT interativo |
| `modo rápido.md` | Via expressa para tarefas ad hoc |
| `session-handoff.md` | Pausa/resolução

ume processo de trabalho |
| `gestão de estado.md` | Memória persistente: decisões, bloqueadores, lições, todos, ideias adiadas |
| `coding-principles.md` | Diretrizes comportamentais para implementação |
| `context-limits.md` | Orçamento e monitoramento de tokens |
| `análise de código.md` | Ferramentas disponíveis e substitutos

|

## ⚡ Dicas para melhores resultados

### O que fazer ✅

- **Comece com a inicialização do projeto** — Mesmo para bases de código existentes
- **Seja específico sobre o escopo** — Limites claros evitam fluência
- **Confie no dimensionamento automático** — O agente aplica a profundidade certa
- **Use linguagem natural** — Não há necessidade de memorizar comandos
- **Diga "pausar trabalho" antes de terminar** — Permite uma retomada contínua
- **Desafie o agente** — Se algo parecer errado, diga

### O que não fazer ❌

- **Não force todas as fases** — Deixe o agente pular o que é desnecessário
- **Não trabalhe em vários recursos ao mesmo tempo** — Um recurso por ciclo
- **Não ignore a verificação** — Mesmo tarefas rápidas precisam de uma etapa de verificação
- **Não aceite respostas vagas** — Se o agente disser algo confuso, peça detalhes

## 💡 Recomendação de modelo

> **Melhores resultados com modelos modernos e com capacidade de raciocínio:**
>
> - **Claude Opus 4.6 / Sonnet 4.5** — Excelente para todas as fases
> - **Gemini 3 Pro / GPT 5.2** — Raciocínio forte e grande janela de contexto
> - **Gemini 3 Flash / Claude Haiku 4.5** — Excelente desempenho para uso geral
>
> Para otimização de custos, a habilidade irá sugerir quando modelos mais leves são suficientes para tarefas simples como validação ou transferência de sessão.

## 🤖 Compatibilidade

Esta habilidade funciona com **qualquer agente de codificação de IA** que ofereça suporte a habilidades ou instruções personalizadas.

**Testado e verificado em:**

| Agente                 | Estado     |
| ---------------------- | ---------- |
| Antigravidade (Gêmeos) | ✅ Testado |
| Código Cláudio         | ✅ Testado |
| Copiloto GitHub        | ✅ Testado |
| Cursor                 | ✅ Testado |
| Código aberto          | ✅ Testado |

> **Observação:** se o seu agente oferece suporte ao carregamento de instruções ou habilidades personalizadas, essa habilidade deverá funcionar. Os agentes acima estão simplesmente onde foram testados ativamente.

## ❓ Perguntas frequentes

**P: Posso pular fases?**
R: Sim! A habilidade é dimensionada automaticamente. Design e Tarefas são ignorados para recursos simples. O modo rápido ignora todo o pipeline para pequenas alterações. Você só consegue cerimônia quando o escopo exige.

**P: E se meu projeto já tiver código?**
R: Use `"Map codebase"` primeiro. Isso cria 7 documentos analisando sua arquitetura, convenções, pilha e preocupações existentes antes de você começar a adicionar recursos.

**P: Como funciona a rastreabilidade de requisitos?**
R: Cada requisito recebe um ID exclusivo (por exemplo, `AUTH-01`) em spec.md. As tarefas fazem referência a esses IDs e a validação verifica quais requisitos são verificados. Você obtém uma trilha clara de especificação → design → tarefa → confirmação.

**P: O que são commits atômicos do git?**
R: Cada tarefa produz exatamente um commit seguindo [Conventional Commits 1.0.0](https://www.conventionalcommits.org/en/v1.0.0/). Isso significa histórico limpo do git, divisão fácil para depuração e reversões simples quando necessário.

**P: Posso usar isso para pequenas tarefas ou soluções rápidas?**
R: Sim! Diga `"Correção rápida: [descrição]"` para correções de bugs, alterações de configuração ou pequenos ajustes. Você obtém proteções de qualidade (verificar + confirmar) sem sobrecarga de planejamento.

**P: O que acontece se eu fechar minha sessão no meio de uma tarefa?**
R: Diga `"Pausar trabalho"` antes de encerrar sua sessão. Isso cria um documento de transferência. Na próxima sessão, diga `"Retomar trabalho"` para continuar exatamente de onde parou.

**P: Isso funciona com qualquer pilha de tecnologia?**
R: Sim! A habilidade é completamente independente de pilha. Funciona com qualquer linguagem, estrutura ou arquitetura.

**P: E se o agente inventar uma API ou um padrão que não existe?**
R: A habilidade impõe uma **Cadeia de verificação de conhecimento** rigorosa: base de código → documentos do projeto → Context7 MCP → pesquisa na web → sinalizar como incerto. NUNCA fabrica informações. Se o agente não conseguir encontrar a documentação, dirá “Não sei” em vez de adivinhar.

## 📄 Licença

CC-BY-4.0 © [Clube de líderes técnicos](https://github.com/tech-leads-club)

<p alinhar="centro">
  <sub>Construído com ❤️ pela comunidade do Tech Lead's Club</sub>
</p>
