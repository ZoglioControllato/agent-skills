---
name: gh-address-comments
description: Atende comentários de review e de issues no PR aberto do GitHub da branch atual usando a CLI gh. Use quando o usuário disser "resolver comentários do PR", "corrigir feedback de review", "responder à review do PR" ou "lidar com comentários do PR". Verifica autenticação gh primeiro e orienta a autenticar se não estiver logado. NÃO use para criar PRs, depurar CI (use gh-fix-ci) ou operações Git gerais.
metadata:
  author: github.com/openai/skills
  version: '1.0.0'
  short-description: Atender comentários em review de PR no GitHub
---

# Manipulador de comentários de PR

Guia para encontrar o PR aberto da branch atual e atender aos comentários com a CLI gh.

**Pré-requisitos:** Garanta que `gh` esteja autenticado antes de rodar comandos. Verifique com `gh auth status`. Se não estiver autenticado, oriente o usuário a rodar `gh auth login`.

## 1) Inspecionar comentários que precisam de atenção

- Execute `scripts/fetch_comments.py`, que imprime todos os comentários e threads de review do PR

## 2) Pedir esclarecimento ao usuário

- Numere todos os threads de review e comentários e resuma o que seria preciso para aplicar a correção
- Pergunte quais comentários numerados devem ser atendidos

## 3) Se o usuário escolher comentários

- Aplique correções para os comentários selecionados

Notas:

- Se o gh falhar por autenticação ou rate limit no meio da execução, peça para reautenticar com `gh auth login` e tente de novo.
