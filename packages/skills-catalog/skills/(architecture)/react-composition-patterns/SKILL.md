---
name: react-composition-patterns
description: Padrões de composição React que escalam. Use quando refatorar componentes com proliferação de props booleanas, construir bibliotecas de componentes flexíveis ou projetar APIs reutilizáveis. Aciona em tarefas envolvendo compound components, render props, provedores de contexto ou arquitetura de componentes. Inclui mudanças da API do React 19. NÃO use para otimização de performance React/Next.js (use react-best-practices).
license: MIT
metadata:
  author: vercel
  version: '1.0.0'
---

# Padrões de composição React

Padrões de composição para componentes React flexíveis e sustentáveis. Evite proliferação de props booleanas usando compound components, elevação de estado e composição interna. Esses padrões facilitam bases de código para humanos e agentes de IA conforme crescem.

## Quando aplicar

Consulte estas diretrizes quando:

- Refatorar componentes com muitas props booleanas
- Construir bibliotecas de componentes reutilizáveis
- Projetar APIs de componentes flexíveis
- Revisar arquitetura de componentes
- Trabalhar com compound components ou provedores de contexto

## Categorias de regras por prioridade

| Prioridade | Categoria                  | Impacto | Prefixo         |
| ---------- | -------------------------- | ------- | --------------- |
| 1          | Arquitetura de componentes | ALTO    | `architecture-` |
| 2          | Gerenciamento de estado    | MÉDIO   | `state-`        |
| 3          | Padrões de implementação   | MÉDIO   | `patterns-`     |
| 4          | APIs do React 19           | MÉDIO   | `react19-`      |

## Referência rápida

### 1. Arquitetura de componentes (ALTO)

- `architecture-avoid-boolean-props` — Não adicione props booleanas para customizar comportamento; use composição
- `architecture-compound-components` — Estruture componentes complexos com contexto compartilhado

### 2. Gerenciamento de estado (MÉDIO)

- `state-decouple-implementation` — O Provider é o único lugar que sabe como o estado é gerenciado
- `state-context-interface` — Defina interface genérica com state, actions e meta para injeção de dependência
- `state-lift-state` — Mova estado para componentes Provider para acesso entre irmãos

### 3. Padrões de implementação (MÉDIO)

- `patterns-explicit-variants` — Crie variantes explícitas de componentes em vez de modos booleanos
- `patterns-children-over-render-props` — Use children para composição em vez de props renderX

### 4. APIs do React 19 (MÉDIO)

> **⚠️ Somente React 19+.** Pule esta seção se usar React 18 ou anterior.

- `react19-no-forwardref` — Não use `forwardRef`; use `use()` em vez de `useContext()`

## Como usar

Leia os arquivos de regra individuais para explicações detalhadas e exemplos de código:

```
rules/architecture-avoid-boolean-props.md
rules/state-context-interface.md
```

Cada arquivo de regra contém:

- Breve explicação do porquê importa
- Exemplo incorreto com explicação
- Exemplo correto com explicação
- Contexto adicional e referências

## Documento compilado completo

Para o guia completo com todas as regras expandidas: `AGENTS.md`
