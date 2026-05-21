---
name: modular-decomposition
description: Executa pipeline sequenciado monólito→modular que dimensiona e inventaria componentes, encontra duplicação compartilhada de domínio, trata achatamento e hierarquia, analisa acoplamento e agrupa componentes em unidades-alinhadas ao domínio, com DDD estratégico embutido opcional para contextos limitados. Use quando perguntar como dividir um monólito, dimensionar componentes antes de extrair, achar lógica de domínio duplicada, limpar hierarquia de módulos, medir acoplamento entre módulos ou agrupar componentes em serviços. Aciona em análise estrutural completa (Patterns 1–5) antes de extração de serviços. NÃO use para roadmaps faseados de extração ou priorização sem os passos de análise anteriores (use decomposition-planning-roadmap depois deste pipeline), documentos ponta-a-ponta de migração legada (use legacy-migration-planner), dimensionamento de capacidade de infraestrutura nem quando só precisa de DDD sem o pipeline estrutural (instale domain-analysis isoladamente).
---

# Modular Decomposition

Esta skill executa o **pipeline Patterns 1–5** antes da extração de serviços. Cada pattern é markdown simples sob `references/`; carregue o arquivo da etapa e execute-o contra o codebase do usuário.

## Como usar

### Quick start (o que usuários podem dizer)

- **Pipeline completo:** “Rodar Patterns 1 a 5 de modular decomposition neste repo”, “Analise este monólito para split — inventário, acoplamento e agrupamento de domínio.”
- **Etapa inicial isolada:** “Identifique e dimensione componentes aqui”, “Ache lógica de domínio duplicada entre módulos”, “Analise acoplamento entre nossos pacotes.”
- **Com lente DDD:** “Agrupe componentes em domínios e revise contextos limitados”, “Use design estratégico DDD neste codebase antes de agrupar serviços.”

Se o usuário só quiser **ordem de extração, fases ou roadmap de migração** depois da análise, use **decomposition-planning-roadmap**. Se precisar de um **plano completo de migração legada** (strangler fig, pesquisa, multi-stack), use **legacy-migration-planner** também ou no lugar desta skill quando esse for o foco principal.

### Como o agente deve rodar

1. **Escopo:** Confirme que a tarefa é análise estrutural (inventário → acoplamento → agrupamento), não redação de roadmap. Se estiver pouco claro, pergunte uma vez se quer o pipeline ordenado completo ou um subconjunto.
2. **Ordem:** Execute os patterns **1 → 2 → 3 → 4 → 5** nessa ordem. Não pule uma etapa salvo pedido explícito do usuário; se pularem, indique quais patterns foram omitidos e como isso limita conclusões posteriores.
3. **Referencias:** Para cada pattern, abra o `references/pattern-NN-*.md` correspondente e siga as instruções. Use o opcional `*-quick-reference.md` do mesmo número quando um checklist curto bastar.
4. **Continue contexto:** Reuse resultados dos patterns anteriores nos seguintes (ex.: inventário do Pattern 1 informa acoplamento no 4 e agrupamento no 5). Cite paths, módulos ou tabelas concretos dos passos anteriores.
5. **Linguagem de domínio (Pattern 5):** Se subdomínios ou contextos limitados precisarem de fundamentação além da estrutura, leia `references/domain-analysis.md` **antes ou junto** com o Pattern 5. Opcionalmente abra `references/domain-analysis-quick-reference.md` ou `references/domain-analysis-examples.md` para regras compactas ou ilustrações.
6. **Entrega:** Produza achados claros e acionáveis por pattern ou um relatório consolidado — sempre ligado a evidências do repositório (arquivos, dependências, métricas), não conselhos genéricos.

### Exemplos de uso

**Exemplo 1 — Pipeline completo**

```
Usuário: "Vamos dividir este monólito — rode a análise completa de decomposição (Patterns 1–5)."

Agente: Executa patterns 1→5 em ordem, carregando cada references/pattern-NN-*.md, preservando saídas entre etapas, depois resume recomendações transversais.
```

**Exemplo 2 — Acoplamento depois do inventário**

```
Usuário: "Já temos lista grosseira de módulos — foque em acoplamento (Pattern 4) e depois agrupamento de domínio (Pattern 5)."

Agente: Se não houver inventário anterior no thread, rode o Pattern 1 brevemente ou derive lista explícita de módulos do repo antes de 4 e 5. Declare suposições.
```

**Exemplo 3 — DDD antes do agrupamento**

```
Usuário: "Mapeie contextos limitados e linguagem; depois agrupe componentes em domínios."

Agente: Leia references/domain-analysis.md (e opcionalmente quick reference/exemplos) em paralelo ou imediatamente antes do Pattern 5; alinhe agrupamentos do Pattern 5 a limites linguísticos onde a evidência apoia.
```

## Pré-requisitos

- Complete **Pattern N** antes de iniciar Pattern N+1 salvo quando o usuário restringir o escopo. Patterns posteriores dependem dos resultados dos anteriores (por exemplo, inventário e estrutura informam acoplamento e agrupamento).
- Se vocabulário de negócio, subdomínios ou contextos limitados estiverem incertos, use `references/domain-analysis.md` **antes ou junto com o Pattern 5** (ver Contextos limitados abaixo).

## Workflow ordenado (Patterns 1–5)

| Etapa | Pattern                                | Referência principal                                                                                       |
| ----- | -------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| 1     | Identificar e dimensionar componentes  | `references/pattern-01-identify-and-size.md` (opcional: `pattern-01-identify-and-size-quick-reference.md`) |
| 2     | Detecção de domínio comum              | `references/pattern-02-common-domain.md` (opcional: `pattern-02-common-domain-quick-reference.md`)         |
| 3     | Achatamento / hierarquia               | `references/pattern-03-flattening.md` (opcional: `pattern-03-flattening-quick-reference.md`)               |
| 4     | Análise de acoplamento                 | `references/pattern-04-coupling.md`                                                                        |
| 5     | Identificação de domínio e agrupamento | `references/pattern-05-domain-grouping.md` (opcional: `pattern-05-domain-grouping-quick-reference.md`)     |

## Pattern 6 — planejamento e extração

**Pattern 6** (_criar serviços de domínio / extração_) não está duplicado aqui. Após o Pattern 5, mude para **decomposition-planning-roadmap** para ordem de extração faseada, marcos e planejamento no estilo migração. Para estratégia completa de migração legada (strangler fig, reescritas cross-stack, planos pesados em pesquisa), opcionalmente use **legacy-migration-planner** além disto.

## Contextos limitados e DDD estratégico

- **Patterns 1–4** focam inventário estrutural, duplicação, hierarquia e **acoplamento** entre partes do codebase.
- **Pattern 5** produz agrupamentos **candidatos** alinhados a limites em **solution space** (quais componentes formam um serviço).
- **DDD estratégico** (subdomínios, contextos limitados, linguagem onipresente) está em `references/domain-analysis.md`, com opcional `domain-analysis-quick-reference.md` e `domain-analysis-examples.md`. Use quando precisar validar ou refinar limites com linguagem de negócio, não só estrutura de pastas.
