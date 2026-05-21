---
name: gh-fix-ci
description: Use quando pedirem depurar ou corrigir checks falhando de PR no GitHub Actions. Usa `gh` para inspecionar checks e logs, resumir contexto da falha, planejar correção e implementar só após aprovação explícita. Provedores externos (ex. Buildkite) ficam fora de escopo — reporte apenas a URL. NÃO use para comentários de review de PR (use gh-address-comments) ou CI fora de GitHub Actions.
metadata:
  author: github.com/openai/skills
  version: '1.0.0'
---

# Plano e correção de checks de PR (gh)

## Visão geral

Use o gh para achar checks falhando, obter logs do GitHub Actions, resumir o trecho da falha, propor plano de correção e implementar após aprovação explícita.

Se existir skill de planejamento (ex.: `create-plan`), use-a; senão planeje de forma concisa e peça aprovação antes de implementar.

Pré-requisito: `gh auth login`; confirme com `gh auth status` (escopos repo + workflow em geral).

## Entradas

- `repo`: caminho no disco (padrão `.`)
- `pr`: número ou URL (opcional; padrão PR da branch atual)
- autenticação `gh` no host

## Início rápido

- `python "<caminho-da-skill>/scripts/inspect_pr_checks.py" --repo "." --pr "<número-ou-url>"`
- Adicione `--json` para saída máquina.

## Fluxo

1. Verifique auth: `gh auth status`; se não autenticado, peça `gh auth login`.
2. Resolva o PR: `gh pr view --json number,url` ou PR informado pelo usuário.
3. Checks falhando (só GitHub Actions): script preferido `inspect_pr_checks.py` com `--json` se útil. Fallback manual com `gh pr checks`, `gh run view`, `gh run view --log`.
4. Checks não-Actions: marque como externos; só repasse URL.
5. Resumo: nome do check, URL da run, trecho de log; diga se log faltou.
6. Plano: skill de plano ou texto curto + aprovação.
7. Implementação após OK do usuário.
8. Sugira rerodar testes e `gh pr checks`.

## Script embutido

`scripts/inspect_pr_checks.py` — checks falhando, logs e snippet. Exit ≠ 0 quando ainda houver falhas.
