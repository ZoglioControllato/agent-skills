---
name: sentry
description: Inspeciona issues no Sentry, resume erros de produção e obtém dados de saúde via API do Sentry (somente leitura). Use quando o usuário disser "ver Sentry", "quais erros em produção", "resume issues do Sentry", "crashes recentes" ou "relatório de erro em produção". Exige SENTRY_AUTH_TOKEN. NÃO use para configurar SDK do Sentry, alertas ou monitoramento de erros fora do Sentry.
metadata:
  author: github.com/openai/skills
  version: '1.0.0'
---

# Sentry (observabilidade somente leitura)

## Início rápido

- Se ainda não estiver autenticado, peça ao usuário um `SENTRY_AUTH_TOKEN` válido (escopos somente leitura como `project:read`, `event:read`) ou que faça login e crie um antes de rodar comandos.
- Defina `SENTRY_AUTH_TOKEN` como variável de ambiente.
- Padrões opcionais: `SENTRY_ORG`, `SENTRY_PROJECT`, `SENTRY_BASE_URL`.
- Padrões: org/projeto `{your-org}`/`{your-project}`, intervalo `24h`, ambiente `prod`, limite 20 (máx. 50).
- Sempre chame a API do Sentry (sem heurísticas, sem cache).

Se o token estiver ausente, oriente o usuário:

1. Criar token em <https://sentry.io/settings/account/api/auth-tokens/>
2. Criar token com escopos somente leitura como `project:read`, `event:read`, `org:read`.
3. Definir `SENTRY_AUTH_TOKEN` no ambiente.
4. Oferecer ajuda para configurar a variável no SO/shell se precisar.

- Nunca peça para colar o token completo no chat. Peça para definir localmente e confirmar quando pronto.

## Tarefas principais (use o script incluído)

Use `scripts/sentry_api.py` para chamadas determinísticas à API. Ele trata paginação e repete uma vez em erros transitórios.

## Caminho da skill (defina uma vez)

```bash
export AGENT_SKILLS_HOME="${AGENT_SKILLS_HOME:-$HOME/.agent-skills}"
export SENTRY_API="$AGENT_SKILLS_HOME/skills/sentry/scripts/sentry_api.py"
```

Skills instaladas no escopo do usuário ficam em `$AGENT_SKILLS_HOME/skills` (padrão: `~/.agent-skills/skills`).

### 1) Listar issues (mais recentes primeiro)

```bash
python3 "$SENTRY_API" \
  list-issues \
  --org {your-org} \
  --project {your-project} \
  --environment prod \
  --time-range 24h \
  --limit 20 \
  --query "is:unresolved"
```

### 2) Resolver short ID de issue para issue ID

```bash
python3 "$SENTRY_API" \
  list-issues \
  --org {your-org} \
  --project {your-project} \
  --query "ABC-123" \
  --limit 1
```

Use o `id` retornado para detalhe da issue ou eventos.

### 3) Detalhe da issue

```bash
python3 "$SENTRY_API" \
  issue-detail \
  1234567890
```

### 4) Eventos da issue

```bash
python3 "$SENTRY_API" \
  issue-events \
  1234567890 \
  --limit 20
```

### 5) Detalhe do evento (sem stack traces por padrão)

```bash
python3 "$SENTRY_API" \
  event-detail \
  --org {your-org} \
  --project {your-project} \
  abcdef1234567890
```

## Requisitos da API

Sempre estes endpoints (apenas GET):

- Listar issues: `/api/0/projects/{org_slug}/{project_slug}/issues/`
- Detalhe da issue: `/api/0/issues/{issue_id}/`
- Eventos da issue: `/api/0/issues/{issue_id}/events/`
- Detalhe do evento: `/api/0/projects/{org_slug}/{project_slug}/events/{event_id}/`

## Entradas e padrões

- `org_slug`, `project_slug`: padrão `{your-org}`/`{your-project}` (evite orgs que não sejam produção).
- `time_range`: padrão `24h` (envie como `statsPeriod`).
- `environment`: padrão `prod`.
- `limit`: padrão 20, máx. 50 (paginar até o limite).
- `search_query`: parâmetro `query` opcional.
- `issue_short_id`: resolva primeiro com list-issues e query.

## Regras de formatação da saída

- Lista de issues: mostrar title, short_id, status, first_seen, last_seen, count, environments, top_tags; ordenar por mais recente.
- Detalhe do evento: incluir culprit, timestamp, environment, release, url.
- Se não houver resultados, declare explicitamente.
- Ofusque ou omita PII na saída (e-mails, IPs). Não imprima stack traces brutos.
- Nunca ecoar tokens de autenticação.

## Entradas de teste golden

- Org: `{your-org}`
- Projeto: `{your-project}`
- Short ID da issue: `{ABC-123}`

Exemplo de prompt: “Liste as 10 principais issues abertas de prod nas últimas 24h.”
Esperado: lista ordenada com títulos, short IDs, contagens, last seen.
