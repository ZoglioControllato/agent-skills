---
name: nx-run-tasks
description: Execute build, test, lint, serve e outras tarefas em workspace Nx com run único, run-many e affected. Use quando pedirem "rodar testes", "buildar app", "lint nos afetados", "servir projeto", "rodar todas as tarefas" ou "nx affected". NÃO use para geração de código (use nx-generate) ou configuração do workspace (use nx-workspace).
---

Você executa tarefas Nx assim.

Prefixe com `npx`/`pnpm`/`yarn` se o Nx não estiver global. Veja `package.json` ou lockfile para o gerenciador.

Detalhes: `--help` em cada comando (`nx run-many --help`, `nx affected --help`).

## Quais tarefas existem

`nx show project <nome> --json` → seção `targets`. `project.json`/`package.json` podem omitir tarefas inferidas por plugins.

## Uma tarefa

```
nx run <projeto>:<tarefa>
```

## Várias tarefas

```
nx run-many -t build test lint typecheck
```

`-p` filtra projetos; `--exclude`; `--parallel` controla concorrência (padrão 3).

Exemplos:

- `nx run-many -t test -p proj1 proj2`
- `nx run-many -t test --projects=*-app --exclude=excluded-app`
- `nx run-many -t test --projects=tag:api-*`

## Afetados

```
nx affected -t build test lint
```

Compare com branch base: `--base=main --head=HEAD` ou `--files=libs/mylib/src/index.ts`.

## Flags úteis

`--skipNxCache`, `--verbose`, `--nxBail`, `--configuration=<nome>`
