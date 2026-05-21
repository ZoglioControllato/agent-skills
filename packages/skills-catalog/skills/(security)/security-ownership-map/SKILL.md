---
name: security-ownership-map
description: 'Analisa repositórios git para construir topologia de ownership orientada a segurança (pessoas↔arquivos), calcular bus factor e ownership de código sensível, e exportar CSV/JSON para grafos e visualização. Use quando o usuário quiser análise explícita de ownership ou bus factor ancorada em histórico git com viés de segurança (código sensível órfão, mantenedores de segurança, confronto CODEOWNERS↔risco, hotspots sensíveis ou clusters de ownership). NÃO use para listas gerais de mantenedores, ownership sem foco em segurança ou modelagem de ameaças (use security-threat-model).'
metadata:
  author: github.com/openai/skills
  version: '1.0.0'
---

# Mapa de ownership de segurança

## Visão geral

Monte um grafo bipartido de pessoas e arquivos a partir do histórico git, calcule risco de ownership e exporte artefatos para Neo4j/Gephi. Também há grafo de co-mudança de arquivos (similaridade de Jaccard em commits compartilhados) para agrupar arquivos que “andam juntos”, ignorando commits grandes e ruidosos.

## Requisitos

- Python 3
- `networkx` (obrigatório; detecção de comunidades ativada por padrão)

Instalação:

```bash
pip install networkx
```

## Fluxo de trabalho

1. Defina escopo do repo e janela temporal (opcional `--since/--until`).
2. Escolha regras de sensibilidade (padrões ou CSV de config).
3. Gere o mapa com `scripts/run_ownership_map.py` (co-change ligado por padrão; `--cochange-max-files` ignora commits “supernó”).
4. Comunidades calculadas por padrão; saída graphml opcional (`--graphml`).
5. Consulte saídas com `scripts/query_ownership.py` para fatias JSON limitadas.
6. Persistência e visualização: veja `references/neo4j-import.md`.

Por padrão o grafo de co-change ignora arquivos “cola” comuns (lockfiles, `.github/*`, config de editor) para clusters refletirem movimento de código, não só infra. Sobrescreva com `--cochange-exclude` ou `--no-default-cochange-excludes`. Commits Dependabot excluídos por padrão; use `--no-default-author-excludes` ou `--author-exclude-regex`.

Para excluir cola de build Linux como `Kbuild` do clustering:

```bash
python skills/skills/security-ownership-map/scripts/run_ownership_map.py \
  --repo /path/to/linux \
  --out ownership-map-out \
  --cochange-exclude "**/Kbuild"
```

## Início rápido

Na raiz do repositório:

```bash
python skills/skills/security-ownership-map/scripts/run_ownership_map.py \
  --repo . \
  --out ownership-map-out \
  --since "12 months ago" \
  --emit-commits
```

Padrões: identidade de autor, data de autor e merges excluídos. Use `--identity committer`, `--date-field committer` ou `--include-merges` se precisar.

Exemplo (sobrescrever excludes de co-change):

```bash
python skills/skills/security-ownership-map/scripts/run_ownership_map.py \
  --repo . \
  --out ownership-map-out \
  --cochange-exclude "**/Cargo.lock" \
  --cochange-exclude "**/.github/**" \
  --no-default-cochange-excludes
```

Comunidades por padrão. Para desligar:

```bash
python skills/skills/security-ownership-map/scripts/run_ownership_map.py \
  --repo . \
  --out ownership-map-out \
  --no-communities
```

## Regras de sensibilidade

Por padrão o script marca caminhos comuns de auth/crypto/segredos. Substitua com CSV:

```
# pattern,tag,weight
**/auth/**,auth,1.0
**/crypto/**,crypto,1.0
**/*.pem,secrets,1.0
```

Use com `--sensitive-config path/to/sensitive.csv`.

## Artefatos de saída

`ownership-map-out/` contém:

- `people.csv` (nós: pessoas)
- `files.csv` (nós: arquivos)
- `edges.csv` (arestas: toques)
- `cochange_edges.csv` (co-mudança arquivo↔arquivo com peso Jaccard; omitido com `--no-cochange`)
- `summary.json` (achados de ownership de segurança)
- `commits.jsonl` (opcional, com `--emit-commits`)
- `communities.json` (por padrão a partir de arestas de co-change; inclui `maintainers` por comunidade; desligue com `--no-communities`)
- `cochange.graph.json` (JSON node-link NetworkX com `community_id` + `community_maintainers`; cai para `ownership.graph.json` sem arestas de co-change)
- `ownership.graphml` / `cochange.graphml` (opcional, com `--graphml`)

`people.csv` inclui detecção de timezone por offsets de commit: `primary_tz_offset`, `primary_tz_minutes`, `timezone_offsets`.

## Helper de consulta (LLM)

Use `scripts/query_ownership.py` para fatias JSON pequenas sem carregar o grafo inteiro no contexto.

Exemplos:

```bash
python skills/skills/security-ownership-map/scripts/query_ownership.py --data-dir ownership-map-out people --limit 10
python skills/skills/security-ownership-map/scripts/query_ownership.py --data-dir ownership-map-out files --tag auth --bus-factor-max 1
python skills/skills/security-ownership-map/scripts/query_ownership.py --data-dir ownership-map-out person --person alice@corp --limit 10
python skills/skills/security-ownership-map/scripts/query_ownership.py --data-dir ownership-map-out file --file crypto/tls
python skills/skills/security-ownership-map/scripts/query_ownership.py --data-dir ownership-map-out cochange --file crypto/tls --limit 10
python skills/skills/security-ownership-map/scripts/query_ownership.py --data-dir ownership-map-out summary --section orphaned_sensitive_code
python skills/skills/security-ownership-map/scripts/query_ownership.py --data-dir ownership-map-out community --id 3
```

`--community-top-owners 5` (padrão) controla quantos mantenedores guardar por comunidade.

## Consultas básicas de segurança

Respostas comuns com saída limitada:

```bash
# Código sensível órfão (stale + bus factor baixo)
python skills/skills/security-ownership-map/scripts/query_ownership.py --data-dir ownership-map-out summary --section orphaned_sensitive_code

# Donos “escondidos” para tags sensíveis
python skills/skills/security-ownership-map/scripts/query_ownership.py --data-dir ownership-map-out summary --section hidden_owners

# Hotspots sensíveis com bus factor baixo
python skills/skills/security-ownership-map/scripts/query_ownership.py --data-dir ownership-map-out summary --section bus_factor_hotspots

# Arquivos auth/crypto com bus factor <= 1
python skills/skills/security-ownership-map/scripts/query_ownership.py --data-dir ownership-map-out files --tag auth --bus-factor-max 1
python skills/skills/security-ownership-map/scripts/query_ownership.py --data-dir ownership-map-out files --tag crypto --bus-factor-max 1

# Quem mais toca código sensível
python skills/skills/security-ownership-map/scripts/query_ownership.py --data-dir ownership-map-out people --sort sensitive_touches --limit 10

# Vizinhos de co-change (dica de cluster para drift de ownership)
python skills/skills/security-ownership-map/scripts/query_ownership.py --data-dir ownership-map-out cochange --file path/to/file --min-jaccard 0.05 --limit 20

# Mantenedores da comunidade (cluster)
python skills/skills/security-ownership-map/scripts/query_ownership.py --data-dir ownership-map-out community --id 3

# Mantenedores mensais da comunidade que contém um arquivo
python skills/skills/security-ownership-map/scripts/community_maintainers.py \
  --data-dir ownership-map-out \
  --file network/card.c \
  --since 2025-01-01 \
  --top 5

# Buckets trimestrais em vez de mensais
python skills/skills/security-ownership-map/scripts/community_maintainers.py \
  --data-dir ownership-map-out \
  --file network/card.c \
  --since 2025-01-01 \
  --bucket quarter \
  --top 5
```

Notas:

- Toques padrão: um commit autoral (não por arquivo). `--touch-mode file` para contar por arquivo.
- `--window-days 90` ou `--weight recency --half-life-days 180` suavizam churn.
- Filtre bots: `--ignore-author-regex '(bot|dependabot)'`.
- `--min-share 0.1` só mantenedores estáveis.
- `--bucket quarter` agrupa por trimestre civil.
- `--identity committer` ou `--date-field committer` mudam atribuição.
- `--include-merges` inclui merges (excluídos por padrão).

### Formato do summary (padrão)

Estrutura base; acrescente campos se precisar:

```json
{
  "orphaned_sensitive_code": [
    {
      "path": "crypto/tls/handshake.rs",
      "last_security_touch": "2023-03-12T18:10:04+00:00",
      "bus_factor": 1
    }
  ],
  "hidden_owners": [
    {
      "person": "alice@corp",
      "controls": "63% of auth code"
    }
  ]
}
```

## Persistência do grafo

Use `references/neo4j-import.md` para carregar CSVs no Neo4j (constraints, Cypher de importação, dicas de visualização).

## Notas

- `bus_factor_hotspots` em `summary.json` lista arquivos sensíveis com bus factor baixo; `orphaned_sensitive_code` é o subconjunto stale.
- Se `git log` for grande, restrinja com `--since` ou `--until`.
- Compare `summary.json` ao CODEOWNERS para destacar drift de ownership.
