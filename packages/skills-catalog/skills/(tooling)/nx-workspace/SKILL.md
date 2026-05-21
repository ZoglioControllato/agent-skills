---
name: nx-workspace
description: 'Configure, explore e otimize workspaces Nx. Use quando configurar Nx, explorar estrutura, limites entre projetos, projetos afetados, cache de build ou CI com affected. Também use quando mencionarem monorepo, nx show projects ou nx affected. Palavras-chave: nx, monorepo, workspace, projetos, targets, affected. NÃO use para executar só tarefas pontuais sem contexto de workspace (use nx-run-tasks). NÃO use para scaffolding com geradores (use nx-generate).'
---

# Gestão de workspace Nx

## Início rápido

**Explorar**: `nx show projects` e `nx show project <nome> --json`  
**Rodar tarefas**: `nx <target> <projeto>`  
**Afetados**: `nx show projects --affected` ou `nx affected -t <target>`

Prefixe com `npx`/`pnpm`/`yarn` se necessário.

## Comandos principais

### Listar e explorar```bash

nx show projects
nx show projects --type app
nx show projects --projects "apps/\*"
nx show projects --withTarget build
nx show projects --affected --base=main

````
### Informação do projeto

**Crítico**: use `nx show project <nome> --json` para config resolvida. Não leia só `project.json`.```bash
nx show project my-app --json
nx show project my-app --json | jq '.targets | keys'
````

Esquemas: `node_modules/nx/schemas/nx-schema.json`, `project-schema.json`.

### Rodar tarefas```bash

nx build web --configuration=production
nx affected -t test --base=main
nx graph

````
## Arquitetura típica```
workspace/
├── apps/
├── libs/
│   ├── shared/
│   └── feature/
├── nx.json
└── tools/
````

### Tipos de biblioteca

| Tipo            | Função                           | Exemplo             |
| --------------- | -------------------------------- | ------------------- |
| **recurso**     | Lógica, componentes inteligentes | `feature-auth`      |
| **ui**          | Apresentação                     | `ui-buttons`        |
| **data-access** | API, estado                      | `data-access-users` |
| **util**        | Funções puras                    | `formatação útil`   |

## Recursos detalhados

- [reference/configuration.md](reference/configuration.md) — nx.json, limites, cache remoto
- [reference/commands.md](reference/commands.md) — referência de comando
- [reference/ci-cd.md](reference/ci-cd.md) — Ações do GitHub, GitLab, etc.
- [reference/best-practices.md](reference/best-practices.md) — solução de problemas, desempenho

## Fluxos comuns

**"O que há neste espaço de trabalho?"** → `nx show projects --type app|lib`  
**"Como eu rodo X?"** → `nx show project X --json | jq '.targets | keys'`  
**"O que mudou?"** → `nx show projects --affected --base=main`

## Solução de problemas rápida

- Alvos faltando → `nx show project <name> --json`
- Afetado falhou → histórico git (`fetch-depth: 0` em CI)
- Cache estranho → `nx reset`

Detalhes: [reference/best-practices.md](reference/best-practices.md).
