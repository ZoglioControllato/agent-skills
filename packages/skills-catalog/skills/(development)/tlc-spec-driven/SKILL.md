---
name: tlc-spec-driven
description: Planejamento de projeto e feature com 4 fases — Specify, Design, Tasks, Execute. Profundidade automática por complexidade. Tarefas atômicas com verificação, commits atômicos, rastreio de requisitos e memória entre sessões. Agnóstico de stack. Use quando iniciar projetos, mapear codebase, planejar ou implementar features com verificação, tarefas rápidas, acompanhar decisões entre sessões ou pausar/retomar. Aciona em initialize project, map codebase, specify feature, design, tasks, implement, validate, UAT, quick fix, pause work. NÃO use para decomposição arquitetural profunda nem doc técnico de design formal — use skills especializadas.
license: CC-BY-4.0
metadata:
  author: Felipe Rodrigues - github.com/felipfr
  version: 2.0.0
---

# Controllato Club — desenvolvimento orientado a especificação

Planeje e implemente projetos com precisão. Tarefas granulares. Dependências claras. Ferramentas certas. Zero cerimônia desnecessária.

```
┌──────────┐   ┌──────────┐   ┌─────────┐   ┌─────────┐
│ SPECIFY  │ → │  DESIGN  │ → │  TASKS  │ → │ EXECUTE │
└──────────┘   └──────────┘   └─────────┘   └─────────┘
  obrigatório    opcional*      opcional*     obrigatório

* O agente pula automaticamente quando o escopo não precisa
```

## Dimensionamento automático: princípio central

**A complexidade define a profundidade, não um pipeline fixo.** Antes de qualquer feature, avalie o escopo e aplique só o necessário:

| Escopo       | O quê                              | Specify                                                           | Design                                         | Tasks                          | Execute                                                |
| ------------ | ---------------------------------- | ----------------------------------------------------------------- | ---------------------------------------------- | ------------------------------ | ------------------------------------------------------ |
| **Pequeno**  | ≤3 arquivos, uma frase             | **Modo rápido** — pula o pipeline por completo                    | -                                              | -                              | -                                                      |
| **Médio**    | Feature clara, menos de 10 tarefas | Spec (breve)                                                      | Pula — design inline                           | Pula — tarefas implícitas      | Implementar + verificar                                |
| **Grande**   | Feature multicomponente            | Spec completo + IDs de requisito                                  | Arquitetura + componentes                      | Quebra completa + dependências | Implementar + verificar por tarefa                     |
| **Complexo** | Ambiguidade, domínio novo          | Spec completo + [discutir áreas cinzentas](references/discuss.md) | [Pesquisa](references/design.md) + arquitetura | Plano paralelo + quebra        | Implementar + [UAT interativo](references/validate.md) |

**Regras:**

- **Specify e Execute são sempre obrigatórios** — sempre precisa saber O QUÊ e FAZER
- **Design é pulado** quando a mudança é direta (sem decisões arquiteturais nem padrões novos)
- **Tasks é pulado** quando há ≤3 passos óbvios (ficam implícitos no Execute)
- **Discuss é disparado dentro de Specify** só quando o agente detecta zonas cinzentas ambíguas que precisam do usuário
- **UAT interativo é disparado dentro de Execute** só para features voltadas ao usuário com comportamento complexo
- **Modo rápido** é a via expressa — para correções de bug, mudanças de config e ajustes pequenos

**Válvula de segurança:** Mesmo com Tasks pulado, Execute SEMPRE começa listando passos atômicos inline (veja [implement.md](references/implement.md)). Se essa listagem revelar mais de 5 passos ou dependências complexas, PARE e crie um `tasks.md` formal — a fase Tasks foi pulada indevidamente.

## Estrutura do projeto

```
.specs/
├── project/
│   ├── PROJECT.md      # Visão e metas
│   ├── ROADMAP.md      # Features e marcos
│   └── STATE.md        # Memória: decisões, blockers, lições, todos, ideias adiadas
├── codebase/           # Análise brownfield (projetos existentes)
│   ├── STACK.md
│   ├── ARCHITECTURE.md
│   ├── CONVENTIONS.md
│   ├── STRUCTURE.md
│   ├── TESTING.md
│   ├── INTEGRATIONS.md
│   └── CONCERNS.md
├── features/           # Especificações de feature
│   └── [feature]/
│       ├── spec.md     # Requisitos com IDs rastreáveis
│       ├── context.md  # Decisões do usuário para áreas cinzentas (só quando discuss for acionado)
│       ├── design.md   # Arquitetura e componentes (só Large/Complex)
│       └── tasks.md    # Tarefas atômicas com verificação (só Large/Complex)
└── quick/              # Tarefas ad-hoc (modo rápido)
    └── NNN-slug/
        ├── TASK.md
        └── SUMMARY.md
```

## Fluxo de trabalho

**Projeto novo:**

1. Inicializar projeto → PROJECT.md + ROADMAP.md
2. Para cada feature → Specify → (Design) → (Tasks) → Execute (profundidade automática)

**Codebase existente:**

1. Mapear codebase → 7 docs brownfield
2. Inicializar projeto → PROJECT.md + ROADMAP.md
3. Para cada feature → mesmo fluxo adaptativo

**Modo rápido:** Descrever → Implementar → Verificar → Commit (para escopo ≤3 arquivos, uma frase)

## Estratégia de carregamento de contexto

**Carga base (~15k tokens):**

- PROJECT.md (se existir)
- ROADMAP.md (ao planejar/trabalhar em features)
- STATE.md (memória persistente)

**Carga sob demanda:**

- Docs do codebase (projeto existente)
- CONCERNS.md (ao planejar features que tocam áreas sinalizadas, estimar risco ou alterar componentes frágeis)
- TESTING.md (ao criar tarefas ou executar — define tipo de teste e checks de gate)
- spec.md (feature específica)
- context.md (ao desenhar ou implementar a partir de decisões do usuário)
- design.md (ao implementar a partir do design)
- tasks.md (ao executar tarefas)

**Nunca carregar ao mesmo tempo:**

- Várias specs de feature
- Vários docs de arquitetura
- Documentos arquivados

**Alvo:** menos de 40k tokens de contexto total  
**Reserva:** 160k+ tokens para trabalho, raciocínio e saídas  
**Monitoramento:** Exibir status quando passar de 40k (veja [context-limits.md](references/context-limits.md))

## Delegação a subagentes

Use subagentes (ferramenta Task ou equivalente) para manter a janela principal enxuta e permitir execução paralela. O agente orquestrador planeja e coordena; subagentes fazem o trabalho pesado.

**Quando delegar a um subagente:**

| Atividade                                                 | Delegar?            | Por quê                                                                     |
| --------------------------------------------------------- | ------------------- | --------------------------------------------------------------------------- |
| Pesquisa (fase design, mapeamento brownfield)             | Sim                 | Saída de pesquisa é grande; só o resumo importa no contexto principal       |
| Implementar uma tarefa                                    | Sim                 | Leituras, edições, saída de teste consomem contexto; só o resultado importa |
| Tarefas paralelas `[P]`                                   | Sim (um por tarefa) | Única forma de rodar tarefas de fato em paralelo                            |
| Tarefas sequenciais sem `[P]`                             | Sim                 | Mantém artefatos de implementação fora do contexto principal                |
| Planejamento, criação de tarefas, relatórios de validação | Não                 | Exige contexto acumulado completo para coerência                            |
| Tarefas em modo rápido                                    | Não                 | Pequenas demais para justificar overhead                                    |

**Contexto que cada subagente recebe:**

O orquestrador DEVE fornecer a cada subagente:

- A definição específica da tarefa em tasks.md (O quê, Onde, Depende de, Reutiliza, Pronto quando, Testes, Gate)
- Princípios e convenções de código relevantes (coding-principles.md, CONVENTIONS.md)
- TESTING.md, se existir (para comandos de gate check e padrões de teste)
- Qualquer contexto de spec/design que a tarefa referencie

O subagente NÃO recebe: definições de outras tarefas, histórico acumulado do chat, relatórios de validação de outras tarefas nem STATE.md (a menos que a tarefa cite explicitamente uma decisão/blocker).

**O que os subagentes devolvem:**

Cada subagente reporta:

- Status: Complete | Blocked | Partial
- Arquivos alterados: [lista]
- Resultado do gate check: [pass/fail + contagens de teste]
- Marcadores SPEC_DEVIATION (se houver)
- Problemas encontrados (se houver)

O orquestrador usa isso para atualizar status em tasks.md, rastreio e próximos passos.

## Comandos

**Nível de projeto:**
| Padrão de gatilho | Referência |
|----------------|-----------|
| Inicializar projeto, configurar projeto | [project-init.md](references/project-init.md) |
| Criar roadmap, planejar features | [roadmap.md](references/roadmap.md) |
| Mapear codebase, analisar código existente | [brownfield-mapping.md](references/brownfield-mapping.md) |
| Documentar preocupações, dívida técnica, riscos | [concerns.md](references/concerns.md) |
| Registrar decisão, logar blocker, adicionar todo | [state-management.md](references/state-management.md) |
| Pausar trabalho, encerrar sessão | [session-handoff.md](references/session-handoff.md) |
| Retomar trabalho, continuar | [session-handoff.md](references/session-handoff.md) |

**Nível de feature (dimensionamento automático):**
| Padrão de gatilho | Referência |
|----------------|-----------|
| Especificar feature, definir requisitos | [specify.md](references/specify.md) |
| Discutir feature, capturar contexto, como isso deve funcionar | [discuss.md](references/discuss.md) |
| Desenhar feature, arquitetura | [design.md](references/design.md) |
| Quebrar em tarefas, criar tasks | [tasks.md](references/tasks.md) |
| Implementar tarefa, construir, executar | [implement.md](references/implement.md) |
| Validar, verificar, testar, UAT, me guie | [validate.md](references/validate.md) |
| Correção rápida, tarefa pequena, mudança mínima, bug | [quick-mode.md](references/quick-mode.md) |

## Integrações com outras skills

Esta skill convive com outras. Antes de tarefas específicas, verifique se skills complementares estão instaladas e prefira-as quando disponíveis.

### Diagramas → mermaid-studio

Sempre que o fluxo exigir criar ou atualizar diagrama (visões de arquitetura, fluxos de dados, componentes, sequências etc.), **sempre** verifique se a skill `mermaid-studio` está instalada no ambiente do usuário antes de seguir. Se estiver, delegue criação e renderização a ela. Se não estiver, continue com blocos mermaid inline como de costume e recomende instalar `mermaid-studio` para SVG/PNG, validação, temas etc. Recomende no máximo uma vez por sessão.

### Exploração de código → codenavi

Sempre que o fluxo exigir explorar ou descobrir coisas em um repositório existente (mapeamento brownfield, análise de reutilização, padrões, rastreamento de dependências etc.), **sempre** verifique se `codenavi` está instalada. Se estiver, delegue exploração e navegação a ela. Se não estiver, use as ferramentas de análise embutidas (veja [code-analysis.md](references/code-analysis.md)) e recomende instalar `codenavi`. Recomende no máximo uma vez por sessão.

## Cadeia de verificação de conhecimento

Ao pesquisar, desenhar ou decidir tecnicamente, siga esta cadeia em ordem estrita. Não pule passos.

```
Passo 1: Codebase → código existente, convenções e padrões já em uso
Passo 2: Docs do projeto → README, docs/, comentários inline, .specs/codebase/
Passo 3: Context7 MCP → resolver ID da biblioteca, depois consultar API/padrões atuais
Passo 4: Busca web → docs oficiais, fontes confiáveis, padrões da comunidade
Passo 5: Sinalizar incerteza — "Não tenho certeza sobre X — aqui está meu raciocínio, mas verifique"
```

**Regras:**

- Não pule para o Passo 5 se os Passos 1-4 estão disponíveis
- O Passo 5 é SEMPRE incerto — nunca apresentado como fato
- **NUNCA assuma ou invente.** Se não encontrar resposta, diga "não sei" ou "não encontrei documentação". Inventar APIs, padrões ou comportamentos gera falhas em cascata em design → tarefas → implementação. Incerteza é sempre preferível a invenção.

## Comportamento de saída

**Orientação ao modelo:** Após tarefas leves (validação, atualização de estado, handoff de sessão), mencione naturalmente uma vez que tais tarefas funcionam bem com modelos mais rápidos/baratos. Registre em STATE.md em `Preferences` para não repetir. Para tarefas pesadas (mapeamento brownfield, design complexo), anote brevemente os requisitos de raciocínio antes de começar.

Seja conversacional, não robótico. Não interrompa o fluxo — acrescente como nota de fechamento natural. Pule se o usuário parecer experiente ou já tiver reconhecido a dica.

## Análise de código

Use as ferramentas disponíveis com degradação elegante. Veja [code-analysis.md](references/code-analysis.md).
