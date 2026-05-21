---
name: nx-generate
description: Gere código com geradores Nx — projetos, bibliotecas, features ou geradores específicos do workspace com descoberta, validação e verificação corretas. Use quando pedirem "criar biblioteca", "gerar componente", "scaffold com Nx", "rodar gerador", "nx generate" ou tarefas de scaffolding em monorepo. Priorize geradores locais do workspace a plugins externos. NÃO use para executar build/test/lint (use nx-run-tasks) ou configuração do workspace (use nx-workspace).
---

# Executar gerador Nx

Geradores Nx scaffoldam projetos, migrações automatizadas ou tarefas repetitivas no monorepo. Garantem consistência e reduzem boilerplate.

Esta skill vale quando o usuário quer:

- Criar novos projetos (libs ou apps)
- Scaffoldar features ou boilerplate
- Rodar geradores do workspace ou customizados
- Qualquer tarefa para a qual exista gerador Nx

## Descoberta de geradores

### Passo 1: Listar geradores disponíveis

```bash
npx nx list @nx/react
npx nx list
```

Inclui geradores de plugins e geradores locais do repositório.

### Passo 2: Casar gerador ao pedido

Considere tipo de artefato, stack e nomes de geradores mencionados.

**IMPORTANTE**: Se um gerador local e um de plugin externo servirem, **prefira sempre o local**.

Se nada servir, ajude de outra forma — mas antes inspecione todos os geradores relacionados.

## Checklist pré-execução

### 1. Schema do gerador

```bash
npx nx g @nx/react:library --help
```

### 2. Código-fonte do gerador

Plugin: `node -e "console.log(require.resolve('@nx/<plugin>/generators.json'));"` ou `node_modules/<plugin>/generators.json`. Locais: `tools/generators/` ou busca pelo nome.

### 2.5 Reavaliar escolha

Confirme se o gerador certo; senão volte à descoberta e refaça o checklist.

### 3. Contexto do repo

Observe artefatos similares: convenções de nome, test runner, linter.

### 4. Opções obrigatórias

Mapeie pedido → opções; peça o que faltar.

## Execução

Prefixe com `npx`/`pnpm`/`yarn` se necessário. O cwd importa para muitos geradores.

Dry-run opcional: `--dry-run` quando complexo. Se falhar, rode sem.

```bash
nx generate <generator-name> <options> --no-interactive
```

**CRÍTICO**: sempre `--no-interactive`.

## Pós-geração

Ajuste código gerado se preciso; `nx format --fix`; rode `nx lint` / `nx test` / `nx build` no projeto criado.

## Princípios

1. Locais primeiro
2. Entenda schema e fonte antes de rodar
3. Sem prompts interativos
4. Gerador é ponto de partida
5. Verifique que compila e testa
6. Corrija proativamente erros obvios
7. Alinhe ao padrão do repo
