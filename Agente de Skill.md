# PRD — Agente de Skill (Plataforma Corporativa de Skills para IA)

| Campo | Valor |
|-------|--------|
| **Documento** | Product Requirements Document (PRD) |
| **Produto** | Agente de Skill — Plataforma corporativa + Gestor desktop + MCP |
| **Versão do PRD** | 2.0.0 |
| **Status** | Rascunho para implementação |
| **Repositório de authoring** | `agent-skills` |
| **Repositórios planejados** | `agent-platform`, `agent-manager` |
| **Última atualização** | 2026-05-21 |

---

## Proposta de Valor

> **Uma tela. Nenhum terminal. Skills sempre atualizadas.**

Equipes que usam agentes de IA (Cursor, Claude Code, Copilot, Windsurf e outros) dependem de **skills** — instruções empacotadas que moldam como o agente se comporta. Hoje, instalar, atualizar ou remover uma skill exige que o colaborador saiba executar comandos no terminal, conheça flags específicas e lembre-se de fazer isso periodicamente. Isso cria uma barreira de adoção enorme para qualquer pessoa sem perfil técnico.

**O Agente de Skill resolve isso com dois componentes:**

### 1. Gestor de Agentes (app desktop em Go)
O colaborador abre um aplicativo visual — como qualquer outro app do seu computador — e pronto. Não existe nenhuma linha de comando envolvida.

| O que o usuário faz | O que acontece por baixo |
|---------------------|--------------------------|
| Abre o app | Agente local Go faz login, busca catálogo da empresa e sincroniza tudo automaticamente |
| Vê badge "2 skills desatualizadas" | Agente identificou versões mais novas aprovadas pela equipe |
| Clica "Atualizar para v1.3.0" | Agente baixa os arquivos, instala nos agentes detectados, atualiza o lockfile |
| Fecha o laptop e vai embora | App funcionou em modo offline — skills já instaladas continuam ativas |

O agente local em Go é o **coração da solução**: ele roda em background, mantém o catálogo em cache, detecta automaticamente quais agentes de IA estão instalados na máquina (Cursor, Claude Code, Windsurf…) e garante que cada um tenha as skills corretas sem que o usuário precise fazer nada além de abrir o app.

### 2. Plataforma corporativa self-hosted (`agent-platform`)
A empresa mantém controle total: um servidor Go + PostgreSQL rodando na própria infraestrutura define quais skills cada área recebe, quem aprovou cada versão e quem está usando o quê. Nenhum dado sai para servidores externos.

**Por que isso importa:**
- **Usuário não-técnico** instala e atualiza skills sem nunca abrir um terminal
- **Sincronização automática** ao abrir o app garante que o time sempre use a versão correta
- **Governança** com aprovação por pares antes de uma skill chegar a produção
- **Visibilidade** para gestores: quem instalou o quê, qual versão, em qual área
- **Self-hosted**: dados da empresa ficam na infraestrutura da empresa

---

## Sumário

1. [Resumo executivo](#1-resumo-executivo)
2. [Contexto e problema](#2-contexto-e-problema)
3. [Objetivos e não-objetivos](#3-objetivos-e-não-objetivos)
4. [Personas e stakeholders](#4-personas-e-stakeholders)
5. [Estado atual (AS-IS)](#5-estado-atual-as-is)
6. [Visão da solução (TO-BE)](#6-visão-da-solução-to-be)
7. [Conceitos do domínio](#7-conceitos-do-domínio)
8. [Requisitos funcionais](#8-requisitos-funcionais)
9. [Requisitos não funcionais](#9-requisitos-não-funcionais)
10. [Arquitetura do sistema](#10-arquitetura-do-sistema)
11. [Modelo de dados (PostgreSQL)](#11-modelo-de-dados-postgresql)
12. [API REST (`agent-platform`)](#12-api-rest-agent-platform)
13. [Servidor MCP corporativo](#13-servidor-mcp-corporativo)
14. [Gestor desktop (`agent-manager`)](#14-gestor-desktop-agent-manager)
15. [Catálogo, versionamento e CI](#15-catálogo-versionamento-e-ci)
16. [Privacidade, segurança e LGPD](#16-privacidade-segurança-e-lgpd)
17. [Telemetria e visibilidade administrativa](#17-telemetria-e-visibilidade-administrativa)
18. [Migração e descomissionamento da CLI](#18-migração-e-descomissionamento-da-cli)
19. [Roadmap e fases de entrega](#19-roadmap-e-fases-de-entrega)
20. [Critérios de sucesso e métricas](#20-critérios-de-sucesso-e-métricas)
21. [Riscos e mitigações](#21-riscos-e-mitigações)
22. [Decisões em aberto](#22-decisões-em-aberto)
23. [Apêndices](#23-apêndices)

---

## 1. Resumo executivo

O **Agente de Skill** é uma plataforma corporativa **self-hosted** para distribuir, versionar, instalar e auditar **skills** (instruções empacotadas para agentes de codificação com IA — Cursor, Claude Code, Copilot, Windsurf, Cline e mais 14) em ambientes empresariais.

O modelo atual de distribuição exige que o colaborador execute comandos no terminal para instalar, atualizar ou remover skills. Isso cria uma barreira para usuários não-técnicos, não oferece organização por **área** (Comercial, Suporte, Engenharia, RH) e não provê **controle centralizado de versões** nem **visibilidade** de quem instalou o quê.

A solução proposta introduz:

1. **`agent-platform`** — API Go + PostgreSQL + MCP corporativo (fonte de verdade do catálogo versionado, direitos por área, telemetria). **Distribuída como imagem Docker / Helm chart; cada empresa opera sua própria instância.**
2. **`agent-manager`** — aplicativo **desktop com GUI** (Wails) que identifica o usuário (nome + e-mail corporativo), sincroniza automaticamente um **bundle local completo** (multi-área) e instala skills nos agentes locais **sem comandos de terminal**. Funciona em **modo offline** com catálogo em cache quando a API estiver indisponível.
3. **`agent-skills`** — repositório de authoring e pipeline de publicação; no dia zero, **todas as skills existentes no catálogo** entram no banco como versões em **produção**.

Cada versão de skill possui status **`draft`**, **`beta`**, **`production`** ou **`expired`**, com **governança por aprovações entre pares**:

- **`draft`** — qualquer usuário autenticado pode criar/submeter. Expira após `N` dias configuráveis sem aprovação (padrão 30 dias).
- **`beta`** — exige **pelo menos 1 aprovação** de **outro** usuário (distinto do autor da versão).
- **`production`** — exige **pelo menos 2 aprovações** de usuários distintos (além do Snyk scan obrigatório).
- **`expired`** — draft que atingiu `draft_expires_at` sem receber quorum para beta. Imutável; autor cria novo draft.

A notificação de revisão é **out-of-band**: o autor compartilha o identificador da versão (nome + semver) via Slack ou outro canal externo; o revisor abre o gestor e verifica a fila "Aguardando minha aprovação".

O colaborador **escolhe** qual versão instalar (beta/production conforme permissão); o sistema **avisa** quando há versão mais nova elegível, **sem upgrade automático**.

---

## 2. Contexto e problema

### 2.1 Contexto de negócio

Empresas possuem áreas distintas com necessidades diferentes de skills de IA:

| Área | Exemplos de casos de uso | Relação com o catálogo atual |
|------|--------------------------|------------------------------|
| **Engenharia** | APIs, testes, segurança, Nx, AWS | Skills em `development`, `quality`, `cloud`, `security`, `tooling` |
| **Comercial** | GTM, outbound, pricing, retenção | Skills em `gtm` |
| **Suporte** | Documentação, triagem, comunicação | Mix de skills transversais (a curar) |
| **RH** | Políticas, onboarding (a curar) | Bundles específicos futuros |
| **Design** | Figma, acessibilidade | Skills em `design`, `quality` |

O repositório `agent-skills` concentra hoje skills sobretudo de **engenharia e GTM**, mas o modelo deve suportar **qualquer área** via bundles configuráveis por organização.

### 2.2 Problemas do modelo atual

| Problema | Impacto |
|----------|---------|
| Instalação via CLI/`npx` | Fricção de onboarding; colaboradores não memorizam comandos |
| Sem banco central | Sem visão de quem usa qual skill/versão |
| Categorias técnicas apenas | Não reflete estrutura Comercial / RH / Engenharia |
| Registry só em CDN | Versionamento e status (draft/beta) não são first-class |
| MCP público sem identidade | Uso anônimo; sem correlação com e-mail corporativo |
| Um usuário, uma área implícita | Na prática, pessoas acumulam skills de várias áreas |
| Atualização manual | Usuário não é avisado de forma consistente; não escolhe versão com governança |
| Sem aprovação por pares | Qualquer arquivo pode ir para produção sem revisão humana |

### 2.3 Oportunidade

Unificar **authoring** (catálogo de skills), **distribuição corporativa** (Postgres + API self-hosted), **experiência zero-comando** (gestor desktop com suporte offline) e **consulta em sessão** (MCP corporativo), com rastreabilidade por **nome e e-mail corporativo**.

---

## 3. Objetivos e não-objetivos

### 3.1 Objetivos (Goals)

| ID | Objetivo |
|----|----------|
| G1 | Colaborador instala e mantém skills **sem executar comandos** no terminal |
| G2 | Organização define skills por **área** e **caso de uso** (bundles) |
| G3 | Catálogo corporativo em **PostgreSQL** com **versionamento**, status draft/beta/production/expired e **aprovação por pares** (1→beta, 2→production) |
| G4 | **100% das skills existentes no catálogo** disponíveis no banco no go-live do seed |
| G5 | Usuário com skills de **múltiplas áreas** — sync do **bundle local completo** |
| G6 | **Aviso** de nova versão; usuário **escolhe** versão; sem auto-upgrade silencioso |
| G7 | **Visibilidade** para gestores: instalações, versões, áreas, usuários ativos |
| G8 | Identificação por **nome + e-mail corporativo** em cada sessão do gestor/MCP |
| G9 | **Descomissionar** a CLI Node como interface principal (mantendo paridade funcional antes) |
| G10 | Compatibilidade com **19 agentes** e lockfile local v2 (`.agents/.skill-lock.json`) |
| G11 | Gestor funciona em **modo offline** com catálogo em cache quando API indisponível |
| G12 | Plataforma **self-hosted** — empresa opera sua própria instância; zero dependência de infraestrutura externa |

### 3.2 Não-objetivos (Non-Goals) — v1

| ID | Fora de escopo v1 |
|----|-------------------|
| NG1 | Hospedagem gerenciada por terceiros (pode ser fase posterior) |
| NG2 | SSO/SAML completo (e-mail + domínio na v1; SSO fase 2) |
| NG3 | Object storage como origem primária de artefatos (v1 usa CDN jsDelivr + metadados no PG) |
| NG4 | Painel admin web rico (v1: API admin + Metabase/SQL aceitável) |
| NG5 | Substituir o MCP **público** existente (permanece disponível para uso sem autenticação) |
| NG6 | Instalação remota em "nuvem do agente" via API do Cursor (v1 = filesystem local como hoje) |
| NG7 | Skills `required` com bloqueio forçado de trabalho (política admin — fase 2) |
| NG8 | Notificação push ou e-mail para aprovações pendentes (v1 = out-of-band via Slack/etc.) |
| NG9 | Rejeição explícita de draft por revisor (v1 = expiração por prazo) |

---

## 4. Personas e stakeholders

| Persona | Necessidade | Produto |
|---------|-------------|---------|
| **Colaborador** | Abrir app → skills prontas no Cursor/Claude; avisos de update; escolher versão beta se permitido | Gestor desktop |
| **Líder de área** | Definir bundle Engenharia vs Comercial | Admin / API (fase 1 mínima) |
| **Admin corporativo** | Provisionar org, definir domínios, ver adoção, versões pinadas, scans | Admin + Postgres |
| **Colaborador (autor)** | Submeter versão em draft; compartilhar ID para revisão; solicitar promoção a beta/production | Gestor + API |
| **Revisor / par** | Abrir gestor → ver fila "Aguardando minha aprovação" → aprovar versões de outros | Gestor + API |
| **Curador de catálogo** | Visão global de fila de aprovações; override admin (fase 2) | Admin + API |
| **Agente de IA (Cursor, etc.)** | Buscar skill correta; saber se há versão desatualizada | MCP corporativo |
| **DevOps / infra** | Provisionar e operar agent-platform (Docker, Postgres, TLS) | `agent-platform` |
| **Desenvolvedor do catálogo** | Continuar authoring em `packages/skills-catalog` | `agent-skills` |

---

## 5. Estado atual (AS-IS)

### 5.1 Componentes existentes

| Componente | Pacote / caminho | Função |
|------------|------------------|--------|
| Catálogo | `packages/skills-catalog/skills/` | `SKILL.md` + references; categorias `(development)`, `(gtm)`, etc. |
| Registry | `packages/skills-catalog/skills-registry.json` | Metadados, `contentHash`, lista de `files` |
| Geração | `packages/skills-catalog/src/generate-registry.ts` | Scan + hash SHA-256 |
| Core | `libs/core` | Registry CDN, installer, lockfile, 19 agentes |
| CLI | `packages/cli` | Commander + TUI Ink; `install`, `update`, `remove`, `cache`, `audit` |
| MCP público | `packages/mcp` | `search_skills`, `read_skill`, `fetch_skill_files`, `list_skills`; CDN |
| Marketplace | `packages/marketplace` | Site estático de descoberta |

### 5.2 Fluxo de instalação atual (CLI)

```text
skills-registry.json (CDN jsDelivr)
  → download para ~/.cache/agent-skills/skills/{name}/
  → copy ou symlink para {project}/.cursor/skills/{name} (etc.)
  → registro em .agents/.skill-lock.json (v2)
```

Comandos típicos (o que queremos eliminar para o usuário final):

```bash
npx @controllato/agent-skills install -s tlc-spec-driven -a cursor
npx @controllato/agent-skills   # TUI interativa
```

### 5.3 MCP público vs instalação local

| Canal | Persistência | Uso |
|-------|--------------|-----|
| **CLI** | Skills em disco (projeto ou global) | Conjunto fixo, lockfile |
| **MCP público** | Sem instalação; consulta CDN na sessão | Exploração / uso pontual |

O PRD **unifica governança** no Postgres e **instalação** no gestor; o MCP corporativo **consulta** o mesmo catálogo e **reporta uso**.

### 5.4 Agentes suportados (Tier 1–3)

Config canônica em `libs/core/src/lib/services/agents.service.ts`. Exemplos:

| Agente | `skillsDir` (projeto) | `globalSkillsDir` |
|--------|----------------------|-------------------|
| Cursor | `.cursor/skills` | `~/.cursor/skills` |
| Claude Code | `.claude/skills` | `~/.claude/skills` |
| Windsurf | `.windsurf/skills` | `~/.codeium/windsurf/skills` |
| GitHub Copilot | `.github/skills` | `~/.copilot/skills` |

Lista completa: 19 agentes (ver Apêndice A).

---

## 6. Visão da solução (TO-BE)

### 6.1 Diagrama de alto nível

```mermaid
flowchart TB
  subgraph monorepo [agent-skills - Authoring e publicação]
    Catalog["packages/skills-catalog"]
    Gen["generate-registry.ts"]
    CI["CI publish com status"]
  end
  subgraph infra_cliente [Infraestrutura do Cliente - Self-hosted]
    subgraph platform [agent-platform]
      PG[(PostgreSQL)]
      API[API Go REST]
      MCP[MCP Server corporativo]
    end
  end
  subgraph client [Posto de trabalho]
    Gestor["Gestor Desktop Wails"]
    LocalBundle["Bundle local completo"]
    LocalCache["~/.cache/agent-skills/local-catalog.json"]
    Lock[".agents/.skill-lock.json"]
    Agents["Cursor / Claude / etc."]
  end
  Catalog --> Gen
  Gen --> CI
  CI -->|"INSERT skill_versions (draft)"| PG
  Gestor -->|"HTTPS identify + catalog"| API
  API --> PG
  MCP --> API
  Gestor -->|"fallback offline"| LocalCache
  Gestor --> LocalBundle
  Gestor --> Lock
  LocalBundle --> Agents
  MCP --> Agents
```

### 6.2 Princípios de produto

1. **Zero comando** — o colaborador só executa o Gestor de Agentes.
2. **Bundle local completo** — união de todas as skills elegíveis (multi-área), não só uma área "principal".
3. **Versão explícita** — status draft/beta/production com **aprovação por pares** (1 para beta, 2 para production); pin escolhido pelo usuário.
4. **Avisar, não forçar** — `update_available` sem auto-bump.
5. **Fonte de verdade corporativa** — Postgres; CDN como mirror de bytes por versão imutável.
6. **Compatibilidade** — lockfile v2 e paths de agentes idênticos à CLI atual durante migração.
7. **Offline primeiro** — gestor funciona sem API usando catálogo em cache; sync quando reconectado.
8. **Self-hosted** — zero dependência de infraestrutura externa em produção; empresa controla seus dados.
9. **Aprovação social** — notificação de revisão é responsabilidade do autor (Slack, etc.); gestor exibe fila para quem consulta.
10. **Governança por expiração** — drafts sem quorum expiram automaticamente; sem `rejected` em v1.

### 6.3 Repositórios

| Repositório | Responsabilidade |
|-------------|------------------|
| **`agent-skills`** (atual) | Authoring, Snyk scan, `generate-registry`, CI → Postgres + CDN |
| **`agent-platform`** (novo) | Postgres, migrations, API Go, MCP corporativo, seed, endpoints admin; distribuído via Docker + Helm |
| **`agent-manager`** (novo) | Desktop Wails, installer local (paridade `libs/core`), UX identify/sync/updates/offline |

---

## 7. Conceitos do domínio

| Conceito | Definição | Persistência |
|----------|-----------|--------------|
| **Categoria técnica** | Taxonomia do catálogo de skills (`development`, `gtm`, `security`, …) | `skill_categories` |
| **Skill** | Entidade lógica (`tlc-spec-driven`, `aws-advisor`, …) | `skills` |
| **Versão da skill** | Semver + `content_hash` + artefatos + **status** (`draft` / `beta` / `production` / `expired`) | `skill_versions` |
| **Autor da versão** | Usuário que submeteu o `draft` (qualquer usuário autenticado, inclusive via CI service account) | `skill_versions.created_by_user_id` |
| **Service account** | Usuário não-humano (CI bot); pode criar drafts, **nunca** pode aprovar versões | `users.is_service_account = true` |
| **Expiração de draft** | Draft sem quorum após `organizations.settings.draft_expiry_days` → status `expired` | `skill_versions.draft_expires_at` |
| **Aprovação de par** | Revisor ≠ autor, não service account; beta exige 1; production exige 2 distintos | `skill_version_approvals` |
| **Área (departamento)** | Comercial, Engenharia, RH, Suporte, … | `departments` |
| **Bundle** | Lista curada de skills para um caso de uso numa área | `skill_bundles`, `bundle_skills` |
| **Bundle local do usuário** | União de skills que o usuário deve manter instaladas | Calculado (`local-catalog`) + cache gestor |
| **Pin de versão** | Versão escolhida pelo usuário para uma skill | `user_skill_pins` + lockfile |
| **Instalação** | Evento: usuário X, dispositivo Y, versão Z, agente W | `installations` |
| **Organização** | Empresa tenant; cada org tem sua própria instância da plataforma | `organizations` |
| **Dispositivo** | Máquina estável (`machine_id`) | `devices` |
| **Catálogo local em cache** | Snapshot do `local-catalog` persistido em disco após sync bem-sucedido | `~/.cache/agent-skills/local-catalog.json` |
| **Modo offline** | Gestor operando sem API; usa catálogo em cache; sem instalações novas | Estado do gestor |
| **Compartilhar para revisão** | Ação que gera texto copiável (nome da skill + semver + URL) para envio out-of-band | Funcionalidade do gestor |

**Área ≠ categoria:** bundle Comercial pode referenciar skills `gtm`; bundle Engenharia referencia `development`, `cloud`, `quality`, etc.

**Aprovação out-of-band:** não há sistema de notificação push v1. O autor copia o identificador da versão e envia ao revisor por Slack/e-mail/etc. O revisor abre o gestor e encontra a versão na fila "Aguardando minha aprovação".

---

## 8. Requisitos funcionais

### 8.1 Identificação e sessão (Gestor + MCP)

| ID | Requisito | Prioridade |
|----|-----------|------------|
| RF-001 | Na primeira abertura do gestor, usuário informa **nome completo** e **e-mail corporativo** e a **URL da API** da organização | P0 |
| RF-002 | API valida e-mail (formato + domínio em `organizations.allowed_email_domains`) | P0 |
| RF-003 | `POST /v1/auth/identify` faz upsert de `users` e retorna `session_token` (JWT, expiração ≤ 24h) | P0 |
| RF-004 | Token armazenado no keyring do SO (Keychain / Secret Service / DPAPI) | P0 |
| RF-005 | MCP corporativo exige token ou env vinculado à sessão do gestor | P0 |
| RF-006 | Atualizar `users.last_seen_at` a cada identify/sync | P1 |
| RF-007 | API URL + e-mail editáveis em Configurações do gestor (re-identify sem reinstalar app) | P1 |
| RF-008 | Se token expirado durante sync, gestor re-autentica silenciosamente via `POST /auth/identify` com credenciais salvas | P0 |

### 8.2 Provisionamento de organização

| ID | Requisito | Prioridade |
|----|-----------|------------|
| RF-009 | `agent-platform` inclui CLI de bootstrap (`agent-platform init`) para criar primeira org, admin e service account | P0 |
| RF-009A | `POST /v1/admin/bootstrap` (protegido por `BOOTSTRAP_TOKEN` env) cria `organizations`, admin user, e service account CI | P0 |
| RF-009B | `POST /v1/admin/organizations` (admin autenticado) cria orgs adicionais | P1 |
| RF-009C | Bootstrap gera e exibe `SERVICE_ACCOUNT_TOKEN` para uso no CI do monorepo | P0 |
| RF-009D | Admin configura `allowed_email_domains`, `draft_expiry_days` (default 30) e `allow_beta_org` via `PATCH /v1/admin/organizations/settings` | P0 |
| RF-009E | `GET /v1/admin/users` + `POST /v1/admin/users/{id}/departments` — admin gerencia membros e áreas | P1 |

### 8.3 Multi-área e bundle local completo

| ID | Requisito | Prioridade |
|----|-----------|------------|
| RF-010 | Usuário pode ter acesso a **N áreas** via `user_department_access` | P0 |
| RF-011 | `GET /v1/me/local-catalog` retorna união de skills de todos os bundles das áreas + grants + pins + instalações prévias + adições manuais | P0 |
| RF-012 | Ao **abrir o app**, gestor executa **sync automático** de **todo** o catálogo local (não só uma área) | P0 |
| RF-013 | Sync é **idempotente**: só baixa/reinstala se `content_hash` local ≠ versão resolvida | P0 |
| RF-014 | Gestor detecta agentes instalados na máquina (paridade `detectInstalledAgents`) e instala em todos os detectados (configurável futuramente) | P0 |
| RF-015 | UI "Minhas skills" agrupa por tag de área; filtro "com atualização disponível" | P1 |
| RF-016 | Usuário pode adicionar skill do catálogo global além dos bundles ("Adicionar do catálogo") | P1 |

### 8.4 Versionamento draft / beta / production (com aprovação por pares)

#### 8.4.1 Estados e quem pode criar

| Status | Quem cria / submete | Visibilidade típica | Instalável no gestor? |
|--------|---------------------|---------------------|------------------------|
| **`draft`** | **Qualquer** usuário autenticado (humano ou service account CI) | Autor + revisores + admins; **não** no bundle público geral | Não (exceto autor em modo "testar draft" — P2) |
| **`beta`** | Promoção a partir de `draft` **após** aprovações | Usuários com `can_install_beta` ou política da área | Sim (se permitido) |
| **`production`** | Promoção a partir de `beta` (ou `draft` com 2 aprovações production) | Quem tem entitlement à skill | Sim (padrão para novas skills no bundle) |
| **`expired`** | Transição automática quando `draft_expires_at` é atingido sem quorum para beta | Autor + admins | Não |

`draft` e `expired` **nunca** disparam `update_available` para usuários finais.

#### 8.4.2 Regras de aprovação (obrigatórias)

| Transição | Requisito | Regra de integridade |
|-----------|-----------|----------------------|
| **Criar `draft`** | Nenhuma aprovação prévia | `created_by_user_id` = usuário autenticado; qualquer role `user` ou superior, incluindo service account |
| **`draft` → `beta`** | **≥ 1 aprovação** | Cada aprovação em `skill_version_approvals` com `target_status = beta`; `approver_user_id ≠ created_by_user_id`; aprovadores distintos; `approver.is_service_account = false` |
| **`beta` → `production`** (ou `draft` → `production`) | **≥ 2 aprovações para production** | Aprovações com `target_status = production`; ≥ 2 usuários distintos; nenhum é service account; nenhum é o autor |
| **`draft` → `expired`** | `NOW() >= draft_expires_at` | Job periódico (cron ou trigger) atualiza status |
| **Scan Snyk** | Gate antes de `production` | `scan_status = passed` (herança monorepo) |

**Nota — aprovação para `production`:** conta-se o total de registros distintos em `skill_version_approvals` com `target_status = 'production'`. A aprovação dada para beta (com `target_status='beta'`) **não conta** para o quorum de production — são aprovações de natureza distinta. Para `draft → production` direto, precisam-se 2 aprovações com `target_status='production'` sem passar por beta.

**Nota — service accounts:** registros com `users.is_service_account = true` não podem ser `approver_user_id` em `skill_version_approvals`. Constraint enforced na API antes do INSERT.

#### 8.4.3 Expiração de draft

| ID | Requisito | Prioridade |
|----|-----------|------------|
| RF-020X | `skill_versions.draft_expires_at = created_at + organizations.settings.draft_expiry_days * INTERVAL '1 day'` no momento do INSERT | P0 |
| RF-020Y | Job periódico (`check_draft_expiry`) executa a cada hora: `UPDATE skill_versions SET status='expired' WHERE status='draft' AND draft_expires_at < NOW()` | P0 |
| RF-020Z | `expired` é terminal — nenhuma transição a partir dele. Autor deve criar novo draft | P0 |
| RF-020W | `draft_expires_at` não se aplica a `beta` ou `production` | P0 |

```mermaid
stateDiagram-v2
  [*] --> draft: Qualquer usuario cria (humano ou CI bot)
  draft --> beta: 1 aprovacao de outro usuario humano
  draft --> production: 2 aprovacoes production de usuarios humanos distintos + Snyk OK
  beta --> production: Total 2 aprovadores distintos (target_status=production) + Snyk OK
  draft --> expired: draft_expires_at atingido sem aprovacao
  expired --> [*]
  production --> [*]
```

#### 8.4.4 Requisitos funcionais de governança

| ID | Requisito | Prioridade |
|----|-----------|------------|
| RF-020 | Cada `skill_versions` tem `status` ∈ `draft`, `beta`, `production`, `expired` e `created_by_user_id` | P0 |
| RF-021 | Qualquer usuário autenticado (humano ou service account) pode criar versão em **`draft`** (via gestor ou API) | P0 |
| RF-022 | `draft` visível ao autor, aprovadores e admins; **não** dispara `update_available` para demais usuários | P0 |
| RF-023 | Promoção para **`beta`** bloqueada até **≥ 1** aprovação humana de usuário **≠** autor | P0 |
| RF-024 | Promoção para **`production`** bloqueada até **≥ 2** aprovações de produção por usuários humanos distintos (autor excluído) | P0 |
| RF-025 | Usuário **não** pode aprovar versão da qual é `created_by_user_id` | P0 |
| RF-025A | Service account **não** pode aprovar nenhuma versão | P0 |
| RF-026 | `beta`: instalável por usuários com `can_install_beta` ou política da área | P0 |
| RF-027 | `production`: entitlement à skill; padrão para novas skills no bundle local | P0 |
| RF-028 | Apenas uma versão `is_latest_production = true` por skill | P0 |
| RF-029 | Versões antigas em production permanecem instaláveis (pin) | P0 |
| RF-02A | `POST .../approve` registra aprovação; `POST .../promote` valida quorum antes de mudar status; ambos em transação | P0 |
| RF-02B | UI gestor: fila "Pendentes de minha aprovação" (versões de outros autores) com estado de aprovações e contador `1/1` ou `2/2` | P1 |
| RF-02C | CI monorepo: merge cria/atualiza versão **`draft`** via service account; beta/production só via API após aprovações humanas | P1 |
| RF-02D | Versão imutável: alteração de conteúdo exige nova linha (novo hash / semver) | P0 |
| RF-02E | Gestor exibe botão **"Compartilhar para revisão"** na tela de detalhe da versão draft; gera texto copiável: `"Skill: {name} v{semver} — aguarda revisão em {api_url}"` | P1 |
| RF-02F | `GET /v1/me/approvals/pending` retorna versões de **outros** autores com `status = draft` ou `status = beta` aguardando quorum; exclui service account como filtro de autor | P1 |

### 8.5 Escolha de versão e pins

| ID | Requisito | Prioridade |
|----|-----------|------------|
| RF-030 | Novas skills no bundle local: default = última **production** elegível | P0 |
| RF-031 | UI "Instalar versão…" lista versões permitidas (beta/production); `draft` e `expired` não listados salvo modo autor (P2) | P0 |
| RF-032 | `PUT /v1/me/skills/:name/pin` persiste `user_skill_pins` | P0 |
| RF-032A | `DELETE /v1/me/skills/:name/pin` remove pin; skill volta a seguir `production_latest` | P0 |
| RF-033 | Sync respeita pin até usuário alterar | P0 |
| RF-034 | API pin é fonte de verdade; gestor reconcilia com lockfile local | P0 |
| RF-035 | Se versão pinada for `expired` ou removida, gestor avisa e sugere upgrade para `production_latest` | P1 |

### 8.6 Avisos de atualização

| ID | Requisito | Prioridade |
|----|-----------|------------|
| RF-040 | Calcular `update_available` quando existe versão elegível (beta/production visível) com semver maior e hash diferente do local; `draft` e `expired` excluídos | P0 |
| RF-041 | Aviso na abertura do gestor e após sync manual | P0 |
| RF-042 | Banner / centro de notificações: contagem de skills desatualizadas | P0 |
| RF-043 | Ações: "Atualizar para X.Y.Z", "Manter versão atual", "Ignorar até próxima versão da skill" | P0 |
| RF-043A | "Ignorar até próxima versão": `version_check_events` registra `dismissed_until_next`; gestor não exibe aviso até que nova versão elegível apareça | P0 |
| RF-044 | **Sem** auto-upgrade de pin | P0 |
| RF-045 | MCP `read_skill` inclui `update_available` no payload | P0 |
| RF-046 | MCP `check_skill_updates` lista skills desatualizadas | P1 |
| RF-047 | Agente instruído a informar usuário quando `update_available: true` (não assumir conteúdo desatualizado) | P1 |
| RF-048 | Registrar `version_check_events` (alert_shown / dismissed_until_next / upgraded / kept) | P1 |
| RF-049 | Polling em background a cada 30 min quando gestor aberto (opcional v1.1) | P2 |

### 8.7 Instalação local (paridade CLI)

| ID | Requisito | Prioridade |
|----|-----------|------------|
| RF-050 | Download de artefatos para `~/.cache/agent-skills/` (mesma estrutura da CLI) | P0 |
| RF-051 | Métodos `copy` e `symlink` (local e global); canonical `.agents/skills/` para symlink local | P0 |
| RF-052 | Escrita atômica em `.agents/.skill-lock.json` v2 | P0 |
| RF-053 | `POST /v1/installations` (batch) após cada sync bem-sucedido (telemetria) | P0 |
| RF-054 | Suporte Windows junction quando symlink falhar | P1 |
| RF-055 | `POST /v1/usage-events` (batch) para eventos MCP e gestor | P1 |
| RF-056 | Falha parcial de sync: registrar erro por skill em `sync_sessions.errors`; não abortar sync inteiro; exibir lista de falhas ao final | P0 |

### 8.8 Modo offline (fail-open com cache)

| ID | Requisito | Prioridade |
|----|-----------|------------|
| RF-057 | Após cada sync bem-sucedido, gestor persiste `local-catalog` completo em `~/.cache/agent-skills/local-catalog.json` (JSON assinado com HMAC usando `session_token`) | P0 |
| RF-058 | Se `POST /auth/identify` ou `GET /me/local-catalog` falhar por timeout/rede, gestor carrega `local-catalog.json` do cache | P0 |
| RF-059 | Em modo offline: banner visual "Modo offline — catálogo de {data_hora_ultimo_sync}". Sync e novas instalações desabilitados; skills já instaladas funcionam normalmente | P0 |
| RF-060X | Gestor tenta re-sync em background a cada 5 min enquanto offline; remove banner ao reconectar | P0 |
| RF-061X | `local-catalog.json` com mais de `organizations.settings.cache_max_age_days` dias (default 7) exibe aviso adicional "catálogo pode estar desatualizado" | P1 |

### 8.9 Catálogo e seed

| ID | Requisito | Prioridade |
|----|-----------|------------|
| RF-060 | Job seed importa **100%** de `packages/skills-catalog/skills-registry.json` | P0 |
| RF-061 | Seed define `status = production`, `is_latest_production = true`, `scan_status = passed` para versão inicial | P0 |
| RF-062 | Seed cria categorias a partir de `registry.categories` | P0 |
| RF-063 | Seed cria org template + bundles exemplo Engenharia e Comercial | P1 |
| RF-064 | Hash alinhado com `generate-registry.ts` | P0 |
| RF-065 | Seed é idempotente: reexecutar não duplica registros (upsert por `skills.name` e `skill_versions.semver + skill_id`) | P0 |

### 8.10 Admin e visibilidade

| ID | Requisito | Prioridade |
|----|-----------|------------|
| RF-070 | `GET /v1/admin/installations` — filtros por área, usuário, skill, versão; paginação cursor | P1 |
| RF-071 | Métricas: adoção beta/draft, pins fora de production latest, updates ignorados, tempo médio em fila de aprovação | P1 |
| RF-073 | `GET /v1/admin/approvals` — versões aguardando quorum beta/production com contagem atual; paginação cursor | P1 |
| RF-072 | Export CSV ou queries documentadas para Metabase | P2 |
| RF-074 | `GET /v1/admin/draft-expiry` — drafts prestes a expirar (≤ 7 dias) para intervenção admin se necessário | P2 |

### 8.11 MCP corporativo (ferramentas)

| ID | Ferramenta | Comportamento | Prioridade |
|----|------------|---------------|------------|
| RF-080 | `search_skills` | Busca Postgres (`tsvector` PT-BR); filtra por entitlement e status | P0 |
| RF-081 | `read_skill` | Versão pinada ou production default; campo `update_available` | P0 |
| RF-082 | `fetch_skill_files` | Valida paths contra `files[]` da versão | P0 |
| RF-083 | `list_skill_versions` | Versões instaláveis (beta/production); não lista draft nem expired | P1 |
| RF-084 | `check_skill_updates` | Lista desatualizadas | P1 |
| RF-085 | `list_bundles` | Bundles das áreas do usuário | P1 |
| RF-086 | `report_usage` | `usage_events` | P1 |

### 8.12 Auto-atualização do gestor desktop

| ID | Requisito | Prioridade |
|----|-----------|------------|
| RF-090 | Gestor verifica `GET /v1/releases/latest` (ou GitHub Releases) ao abrir e exibe banner "Nova versão do Gestor disponível: vX.Y.Z" | P1 |
| RF-091 | Banner inclui link para download do instalador; não força atualização automática em v1 | P1 |
| RF-092 | GoReleaser assina binários (GPG / Notarize macOS / Authenticode Windows) | P1 |

---

## 9. Requisitos não funcionais

| ID | Categoria | Requisito |
|----|-----------|-----------|
| RNF-001 | Performance | Sync de 50 skills em < 5 min em link corporativo típico (**baseline: 10 Mbps simétrico**, download paralelo, limite 10 concurrent) |
| RNF-002 | Performance | API `local-catalog` < 500 ms p95 (com cache Redis ou Postgres connection pool pgx) |
| RNF-003 | Disponibilidade | API 99.5% mensal (v1, single-node; HA via Docker restart policy ou k8s replica) |
| RNF-004 | Segurança | TLS 1.2+ em todas as chamadas gestor/API; certificado gerenciado pelo cliente |
| RNF-005 | Segurança | Tokens JWT expiração ≤ 24h; re-identify silencioso via credenciais salvas |
| RNF-006 | Segurança | Sanitização de paths (`isPathSafe`, `sanitizeName`) — paridade SECURITY.md |
| RNF-007 | Privacidade | Não enviar caminho absoluto de projeto — usar `project_path_hash` (SHA-256 do path absoluto normalizado, sem salt, irreversível) |
| RNF-008 | Compatibilidade | Gestor: Linux (x86_64, arm64), macOS (x86_64, arm64), Windows (x86_64) via Wails + GoReleaser |
| RNF-009 | Compatibilidade | Node do monorepo ≥ 24; gestor Go ≥ 1.22 |
| RNF-010 | Manutenibilidade | OpenAPI 3.1 spec compartilhada entre API, gestor e MCP; geração de clientes via `oapi-codegen` |
| RNF-011 | Observabilidade | Logs estruturados JSON em API (nível `info`/`warn`/`error`); `sync_sessions` com duração e erros |
| RNF-012 | Escalabilidade | Postgres com índices documentados (ver seção 11); lazy download no gestor |
| RNF-013 | Segurança | Rate limit em `POST /auth/identify`: 10 req/min por IP; retorno 429 com `Retry-After` |
| RNF-014 | Segurança | Rate limit em endpoints de aprovação: 60 req/min por usuário |
| RNF-015 | Resiliência | Modo offline: gestor funcional por até `cache_max_age_days` dias sem API |
| RNF-016 | Deploy | `agent-platform` distribuído como imagem Docker (`ghcr.io/controllato/agent-platform`) e Helm chart; migrations via `golang-migrate` on startup |
| RNF-017 | Backup | Postgres: backup diário por `pg_dump` ou snapshot de volume; RTO ≤ 4h, RPO ≤ 24h (configurado pelo cliente) |
| RNF-018 | machine_id | Gerado no primeiro uso do gestor: `SHA-256(hostname + primary_mac_address + os_username)`, persistido em `~/.cache/agent-skills/machine_id` |
| RNF-019 | Respostas de erro | Formato RFC 7807 Problem Details (`application/problem+json`): `{ "type", "title", "status", "detail", "instance" }` |
| RNF-020 | Telemetria | `usage_events.metadata` JSONB restrito ao schema: `{ "source": "mcp"|"gestor", "action": string, "duration_ms": int? }`; sem PII |

---

## 10. Arquitetura do sistema

### 10.1 Stack tecnológica

| Camada | Tecnologia |
|--------|------------|
| Authoring | TypeScript, Nx, `packages/skills-catalog` |
| API | Go 1.22+, `pgx/v5`, `golang-migrate`, OpenAPI 3.1; framework HTTP: decisão aberta (D8) |
| Banco | PostgreSQL 15+ |
| MCP corporativo | Go (binário único com flag `DATA_SOURCE=api`; decisão D5 resolvida — ver seção 22) |
| Gestor | Go + Wails v2 (frontend React; decisão D9); versão Wails definida em D10 |
| Artefatos v1 | CDN jsDelivr (URLs em `skill_versions.cdn_path`) |
| Distribuição gestor | GoReleaser + assinatura de código |
| Distribuição plataforma | Docker + Helm chart; postgres via volume persistente |
| Busca | Postgres `tsvector` com dicionário `portuguese`; pgvector fase 2 (D11) |

### 10.2 Fluxo: abertura do gestor

```mermaid
sequenceDiagram
  participant U as Usuario
  participant G as GestorDesktop
  participant Cache as CacheLocal
  participant API as AgentPlatformAPI
  participant PG as PostgreSQL
  participant CDN as CDN
  participant FS as AgentDirs

  U->>G: Abre aplicativo
  G->>API: POST /v1/auth/identify
  alt API disponivel
    API->>PG: upsert users + devices
    API-->>G: session_token
    G->>API: GET /v1/me/local-catalog
    API->>PG: uniao multi-area + pins + update flags
    API-->>G: local-catalog
    G->>Cache: Persiste local-catalog.json (HMAC)
  else API indisponivel (timeout/rede)
    G->>Cache: Carrega local-catalog.json
    G->>U: Banner "Modo offline — sync de {timestamp}"
  end
  loop Cada skill no catalogo local (apenas se online ou forcado)
    G->>G: Resolve versao pin ou production default
    alt Hash diferente ou ausente
      G->>CDN: Download arquivos da versao
    end
    G->>FS: copy ou symlink para agentes detectados
  end
  G->>FS: Atualiza .agents/.skill-lock.json
  alt Online
    G->>API: POST /v1/installations (batch) + version_check_events
  end
  G->>U: Exibe avisos update_available
```

### 10.3 Fluxo: publicação de conteúdo

```text
SKILL.md alterado no monorepo
  → npm run generate:data / generate-registry
  → skills-registry.json
  → CI publish-platform (usa SERVICE_ACCOUNT_TOKEN)
      → POST /v1/skill-versions (status=draft, created_by=service_account)
      → Snyk scan (obrigatório antes de production)
  → Autor humano compartilha ID via Slack
  → Revisor 1 abre gestor → Aprovar para beta (target_status=beta)
  → promote para beta (se quorum beta OK)
  → Revisor 1 ou 2 → Aprovar para production (target_status=production)
  → Revisor 3 (ou revisor 2 diferente) → segunda aprovacao production
  → promote para production → is_latest_production atualizado
```

### 10.4 Fluxo: expiração de draft

```text
Job periódico (cron a cada 1h):
  SELECT id FROM skill_versions WHERE status='draft' AND draft_expires_at < NOW()
  UPDATE skill_versions SET status='expired', updated_at=NOW() WHERE id IN (...)
  Opcional: registrar em audit_log
```

### 10.5 Contratos compartilhados

| Artefato | Gerado em | Consumido por |
|----------|-----------|---------------|
| `agents-registry.json` | CI `agent-skills` a partir de `agents.service.ts` | Gestor (detect paths) |
| JSON Schema lockfile v2 | `libs/core` / `tools/schemas` | Gestor |
| OpenAPI 3.1 `agent-platform` | Repo `agent-platform` | Gestor (oapi-codegen), MCP, admin |

---

## 11. Modelo de dados (PostgreSQL)

### 11.1 Diagrama entidade-relacionamento (simplificado)

```mermaid
erDiagram
  organizations ||--o{ users : has
  organizations ||--o{ departments : has
  organizations ||--o{ skill_bundles : has
  users ||--o{ user_department_access : has
  departments ||--o{ user_department_access : has
  users ||--o{ user_skill_pins : has
  users ||--o{ installations : has
  users ||--o{ devices : has
  users ||--o{ sync_sessions : has
  skills ||--o{ skill_versions : has
  skill_categories ||--o{ skills : categorizes
  skill_bundles ||--o{ bundle_skills : contains
  skills ||--o{ bundle_skills : referenced
  skill_versions ||--o{ bundle_skills : optional_pin
  skill_versions ||--o{ user_skill_pins : pinned
  skill_versions ||--o{ installations : installed
  users ||--o{ skill_versions : creates
  skill_versions ||--o{ skill_version_approvals : receives
  users ||--o{ skill_version_approvals : approves
  users ||--o{ user_bundle_grants : has
  skill_bundles ||--o{ user_bundle_grants : granted
```

### 11.2 Tabelas — núcleo organizacional

#### `organizations`

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `id` | UUID PK | |
| `slug` | TEXT UNIQUE | Identificador URL |
| `name` | TEXT | Nome exibido |
| `allowed_email_domains` | TEXT[] | Ex.: `{empresa.com.br}` |
| `settings` | JSONB | `{ "draft_expiry_days": 30, "allow_beta_org": false, "cache_max_age_days": 7, "retention_days": 365 }` |
| `created_at` | TIMESTAMPTZ | |
| `updated_at` | TIMESTAMPTZ | |

#### `users`

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `id` | UUID PK | |
| `organization_id` | UUID FK | |
| `email` | TEXT | Unique por org; `UNIQUE(organization_id, email)` |
| `display_name` | TEXT | Nome informado no gestor |
| `can_install_beta` | BOOLEAN | Default false |
| `role` | ENUM | `user`, `curator`, `admin` |
| `is_service_account` | BOOLEAN | Default false; CI bots |
| `last_seen_at` | TIMESTAMPTZ | |
| `created_at` | TIMESTAMPTZ | |
| `deleted_at` | TIMESTAMPTZ | Soft-delete (LGPD anonimização) |

#### `departments`

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `id` | UUID PK | |
| `organization_id` | UUID FK | |
| `slug` | TEXT | `engineering`, `commercial`, `support`, `hr` |
| `display_name` | TEXT | Ex.: Engenharia |
| `allow_beta` | BOOLEAN | Política área |
| `created_at` | TIMESTAMPTZ | |
| `updated_at` | TIMESTAMPTZ | |

#### `user_department_access`

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `user_id` | UUID FK | |
| `department_id` | UUID FK | |
| `granted_at` | TIMESTAMPTZ | |
| `granted_by` | UUID FK users | Admin que concedeu acesso |
| PRIMARY KEY | (user_id, department_id) | N:N multi-área |

#### `devices`

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `id` | UUID PK | |
| `user_id` | UUID FK | |
| `machine_id` | TEXT | `SHA-256(hostname + primary_mac + os_username)` gerado no gestor |
| `os` | TEXT | `linux` / `darwin` / `windows` |
| `gestor_version` | TEXT | Semver do app |
| `last_sync_at` | TIMESTAMPTZ | |
| `created_at` | TIMESTAMPTZ | |
| UNIQUE | `(user_id, machine_id)` | |

### 11.3 Tabelas — catálogo

#### `skill_categories`

Espelho de `skills-registry.json` → `categories`. Colunas: `id UUID PK`, `slug TEXT UNIQUE`, `display_name TEXT`, `created_at TIMESTAMPTZ`.

#### `skills`

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `id` | UUID PK | |
| `name` | TEXT UNIQUE | Slug global (`tlc-spec-driven`) |
| `category_id` | UUID FK | |
| `author` | TEXT | |
| `deprecated` | BOOLEAN | Default false |
| `alternatives` | TEXT[] | |
| `created_at` | TIMESTAMPTZ | |
| `updated_at` | TIMESTAMPTZ | |
| `deleted_at` | TIMESTAMPTZ | Soft-delete |

#### `skill_versions`

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `id` | UUID PK | |
| `skill_id` | UUID FK | |
| `semver` | TEXT | Ex.: `1.2.0` |
| `status` | ENUM | `draft`, `beta`, `production`, `expired` |
| `description` | TEXT | Frontmatter |
| `content_hash` | TEXT | SHA-256 paridade registry |
| `cdn_path` | TEXT | Ex.: `skills/{name}/{semver}/` |
| `files` | JSONB | Lista de arquivos: `[{ "path": "SKILL.md", "hash": "..." }]` |
| `scan_status` | ENUM | `pending`, `passed`, `failed` |
| `published_at` | TIMESTAMPTZ | Quando status virou production |
| `created_by_user_id` | UUID FK users | Autor da versão |
| `draft_expires_at` | TIMESTAMPTZ | `created_at + org.settings.draft_expiry_days`; NULL para beta/production/expired |
| `promoted_at` | TIMESTAMPTZ | Quando executou promote |
| `promoted_by` | UUID FK users | Usuário que executou promote |
| `is_latest_production` | BOOLEAN | Partial unique por skill |
| `created_at` | TIMESTAMPTZ | |
| `updated_at` | TIMESTAMPTZ | |

**Índices:** `(skill_id, status, semver DESC)`, `UNIQUE (skill_id) WHERE is_latest_production = true`, `(created_by_user_id)`, `(draft_expires_at) WHERE status = 'draft'`.

**Constraint:** `UNIQUE(skill_id, semver)` — mesma skill não pode ter duas versões com mesmo semver.

#### `skill_version_approvals`

Registro imutável de cada aprovação de par (auditoria e quorum).

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `id` | UUID PK | |
| `skill_version_id` | UUID FK | |
| `approver_user_id` | UUID FK users | **Deve ser ≠** `skill_versions.created_by_user_id`; `users.is_service_account = false` |
| `target_status` | ENUM | `beta` ou `production` — tipo de aprovação concedida |
| `comment` | TEXT | Opcional |
| `created_at` | TIMESTAMPTZ | |

**Constraints:**
- `UNIQUE (skill_version_id, approver_user_id, target_status)` — um usuário não aprova duas vezes o mesmo alvo.
- Validação na API antes de INSERT: `approver_user_id ≠ created_by_user_id`; `approver.is_service_account = false`.
- Validação antes de `promote`: contagem distinta de `approver_user_id` para o `target_status` requerido.

**Visão auxiliar:** `skill_version_approval_counts` (VIEW ou MATERIALIZED VIEW) para cache de contagens de quorum.

### 11.4 Tabelas — bundles e direitos

#### `skill_bundles`

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `id` | UUID PK | |
| `organization_id` | UUID FK | |
| `department_id` | UUID FK nullable | NULL = bundle transversal |
| `name` | TEXT | Ex.: Engenharia — APIs backend |
| `description` | TEXT | Caso de uso |
| `use_case` | TEXT | Texto livre |
| `created_at` | TIMESTAMPTZ | |
| `updated_at` | TIMESTAMPTZ | |

#### `bundle_skills`

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `bundle_id` | UUID FK | |
| `skill_id` | UUID FK | |
| `required` | BOOLEAN | Default false |
| `default_version_policy` | TEXT | `production_latest` (default) |
| PRIMARY KEY | `(bundle_id, skill_id)` | |

#### `user_bundle_grants`

Bundle atribuído diretamente ao usuário fora da área.

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `id` | UUID PK | |
| `user_id` | UUID FK | |
| `bundle_id` | UUID FK | |
| `granted_at` | TIMESTAMPTZ | |
| `granted_by` | UUID FK users | Admin que concedeu |
| PRIMARY KEY via UNIQUE | `(user_id, bundle_id)` | |

### 11.5 Tabelas — preferências, instalação, eventos

#### `user_skill_pins`

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `user_id` | UUID FK | |
| `skill_id` | UUID FK | |
| `skill_version_id` | UUID FK | |
| `pinned_at` | TIMESTAMPTZ | |
| `source` | ENUM | `user`, `admin`, `bundle_default` |
| UNIQUE | `(user_id, skill_id)` | |

#### `installations`

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `id` | UUID PK | |
| `user_id` | UUID FK | |
| `device_id` | UUID FK | |
| `skill_version_id` | UUID FK | |
| `agent_type` | TEXT | Ex.: `cursor` |
| `scope` | ENUM | `project`, `global` |
| `project_path_hash` | TEXT | `SHA-256(normalize(abs_path))` — irreversível |
| `method` | ENUM | `copy`, `symlink`, `junction` |
| `content_hash_installed` | TEXT | Hash real instalado |
| `status` | ENUM | `success`, `failed` |
| `error_message` | TEXT | Nullable; detalhes em caso de falha |
| `installed_at` | TIMESTAMPTZ | |

**Índices:** `(user_id, installed_at DESC)`, `(skill_version_id)`, `(device_id)`.

#### `version_check_events`

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `id` | UUID PK | |
| `user_id` | UUID FK | |
| `skill_id` | UUID FK | |
| `event_type` | ENUM | `alert_shown`, `dismissed_until_next`, `upgraded`, `kept` |
| `from_version_id` | UUID FK | |
| `to_version_id` | UUID FK nullable | |
| `occurred_at` | TIMESTAMPTZ | |

#### `usage_events`

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `id` | UUID PK | |
| `user_id` | UUID FK | |
| `skill_id` | UUID FK | |
| `event_type` | TEXT | `mcp_search`, `mcp_read`, `mcp_fetch`, `gestor_sync`, … |
| `metadata` | JSONB | Schema fixo: `{ "source": "mcp"\|"gestor", "action": string, "duration_ms": int? }` — sem PII |
| `occurred_at` | TIMESTAMPTZ | |

**Retenção:** `usage_events` e `installations` purgados após `organizations.settings.retention_days`.

#### `sync_sessions`

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `id` | UUID PK | |
| `user_id` | UUID FK | |
| `device_id` | UUID FK | |
| `started_at` | TIMESTAMPTZ | |
| `finished_at` | TIMESTAMPTZ | |
| `skills_synced` | INT | |
| `skills_failed` | INT | |
| `was_offline` | BOOLEAN | True se usou cache |
| `errors` | JSONB | Array de `{ "skill_name", "error" }` |

### 11.6 Regra `update_available` (lógica de negócio)

```sql
-- update_available(skill_id, user_id) = true quando:
EXISTS (
  SELECT 1 FROM skill_versions v
  WHERE v.skill_id = :skill_id
    AND v.status IN (
      'production',
      CASE WHEN user_can_install_beta(:user_id, :skill_id) THEN 'beta' END
    )
    AND semver_gt(v.semver, :installed_semver)
    AND v.content_hash <> :local_hash
)
-- draft e expired nunca contribuem para update_available
```

---

## 12. API REST (`agent-platform`)

Base URL: `https://{AGENT_PLATFORM_HOST}/v1` (configurada pelo cliente na instância self-hosted).

### 12.1 Convenções gerais

**Paginação (cursor-based):**
```json
{
  "data": [...],
  "pagination": {
    "next_cursor": "base64token|null",
    "has_more": true,
    "limit": 50
  }
}
```
Query params: `?limit=50&cursor=base64token`

**Erros (RFC 7807 Problem Details):**
```json
{
  "type": "https://api.example.com/errors/quorum-not-met",
  "title": "Quorum não atingido",
  "status": 409,
  "detail": "Promoção para production requer 2 aprovações; encontradas: 1",
  "instance": "/v1/skill-versions/uuid/promote"
}
```
Content-Type: `application/problem+json`

**Rate limiting:** Headers `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`; 429 com `Retry-After`.

### 12.2 Autenticação

| Método | Rota | Request | Response |
|--------|------|---------|----------|
| `POST` | `/auth/identify` | `{ "display_name", "email", "machine_id", "gestor_version", "os" }` | `{ "session_token", "expires_at", "user", "organization" }` |

Rate limit: 10 req/min por IP.

### 12.3 Catálogo do usuário

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/me/local-catalog` | Bundle local completo; ver payload abaixo |
| `GET` | `/me/bundles` | Bundles por área (metadados) |
| `GET` | `/skills` | Catálogo completo; `?q=texto&status=production&category=slug`; paginado |
| `GET` | `/skills/{name}/versions` | `?status=beta,production`; paginado |
| `PUT` | `/me/skills/{name}/pin` | `{ "skill_version_id" }` → 200 |
| `DELETE` | `/me/skills/{name}/pin` | Remove pin; skill volta a `production_latest` |
| `POST` | `/me/skills/{name}/install` | Registra intenção (gestor executa FS) |
| `POST` | `/skill-versions/{id}/approve` | `{ "target_status": "beta"\|"production", "comment"? }` — registra aprovação; rate limit 60/min/user |
| `POST` | `/skill-versions/{id}/promote` | `{ "to_status": "beta"\|"production" }` — falha 409 com detalhe se quorum insuficiente |
| `GET` | `/skill-versions/{id}/approvals` | Lista aprovações, contagem e status de quorum |
| `GET` | `/me/approvals/pending` | Versões de **outros** autores humanos aguardando aprovação |

**Payload de item em `local-catalog`:**

```json
{
  "skill_name": "tlc-spec-driven",
  "department_tags": ["engineering"],
  "pinned_version_id": "uuid-or-null",
  "installed_content_hash": "abc...",
  "latest_production": { "id": "uuid", "semver": "1.2.0", "cdn_path": "skills/tlc-spec-driven/1.2.0/" },
  "latest_beta": { "id": "uuid", "semver": "1.3.0-beta.1", "cdn_path": "..." },
  "update_available": true,
  "dismissed_until_next": false
}
```

### 12.4 Telemetria

| Método | Rota | Descrição |
|--------|------|-----------|
| `POST` | `/installations` | Batch pós-sync; array de instalações |
| `POST` | `/usage-events` | Batch MCP/gestor; array de eventos |
| `POST` | `/version-check-events` | Alertas e ações do usuário |
| `POST` | `/sync-sessions` | Início e fim de sync (dois POSTs ou PUT com `finished_at`) |

### 12.5 Admin

| Método | Rota | Descrição |
|--------|------|-----------|
| `POST` | `/admin/bootstrap` | Provisiona primeira org; protegido por `BOOTSTRAP_TOKEN` env |
| `GET` | `/admin/installations` | Filtros + paginação cursor |
| `GET` | `/admin/users/active` | `last_seen_at` recente |
| `GET` | `/admin/approvals` | Fila global com contagens |
| `GET` | `/admin/draft-expiry` | Drafts expirando em ≤ 7 dias |
| `PATCH` | `/admin/organizations/settings` | `draft_expiry_days`, `allow_beta_org`, `cache_max_age_days`, `retention_days` |
| `POST` | `/admin/users/{id}/departments` | Adiciona área a usuário |
| `DELETE` | `/admin/users/{id}/departments/{dept_id}` | Remove área de usuário |
| `GET` | `/health` | 200 OK se API up (sem auth) |
| `GET` | `/ready` | 200 se banco conectado (sem auth) |

---

## 13. Servidor MCP corporativo

### 13.1 Posicionamento

| Aspecto | MCP público (atual) | MCP corporativo (novo) |
|---------|---------------------|-------------------------|
| Dados | CDN `skills-registry.json` | API + Postgres |
| Auth | Nenhuma | JWT / sessão gestor |
| Filtro | Catálogo inteiro | Entitlements + status (sem draft/expired) |
| Telemetria | Não | `report_usage`, version checks |
| Instalação | Não | Indireta via gestor |
| Binário | MCP público sem autenticação | `agent-platform` com flag `--mcp` ou `DATA_SOURCE=api` |

### 13.2 Ferramentas

| Ferramenta | Descrição | Prioridade |
|------------|-----------|------------|
| `search_skills` | Busca por intenção (`tsvector` PT-BR, dicionário `portuguese`); respeita área e status | P0 |
| `read_skill` | Conteúdo `SKILL.md` da versão pinada/production; campo `update_available` e texto de aviso | P0 |
| `fetch_skill_files` | Arquivos em `scripts/`, `references/`, `assets/` validados contra `files[]` da versão | P0 |
| `list_skill_versions` | Versões elegíveis (beta/production); exclui draft e expired | P1 |
| `check_skill_updates` | Lista skills com `update_available = true` para o usuário | P1 |
| `list_bundles` | Bundles das áreas do usuário | P1 |
| `report_usage` | Envia `usage_events` em batch | P1 |

### 13.3 Configuração no Cursor (exemplo)

```json
{
  "mcpServers": {
    "agent-skills-corporate": {
      "command": "agent-skills-mcp-corporate",
      "env": {
        "AGENT_SKILLS_API_URL": "https://api.suaempresa.com",
        "AGENT_SKILLS_SESSION_TOKEN": "<from-gestor-keyring>"
      }
    }
  }
}
```

O gestor pode **escrever** ou atualizar `mcp.json` do projeto (fase 1.1 — decisão D6).

### 13.4 Comportamento do agente quando `update_available: true`

Texto recomendado nas instruções do MCP (campo `description` da tool `read_skill`):

> Existe uma versão mais recente desta skill disponível no Gestor de Agentes. Informe o usuário e não trate o conteúdo local como definitivo até que ele confirme a atualização.

### 13.5 Aprovações e notificação

O MCP **não** tem ferramentas para aprovação ou notificação. Aprovação é feita no gestor. O MCP é read-only para governança. Revisores recebem o identificador de versão via canal out-of-band (Slack, etc.) e abrem o gestor para aprovar.

---

## 14. Gestor desktop (`agent-manager`)

### 14.1 Requisitos de UX

| Tela / fluxo | Comportamento |
|--------------|---------------|
| **Setup inicial** | URL da API + nome + e-mail + consentimento LGPD; seleção de área se múltiplas disponíveis |
| **Home** | Projeto detectado; agentes detectados com ícones; status último sync; badge offline se aplicável |
| **Banner offline** | "Modo offline — último sync: {data/hora}" com botão "Tentar reconectar" |
| **Sync automático** | Ao abrir (se online); barra de progresso não-bloqueante; lista de erros ao final |
| **Notificações** | Badge com contagem `update_available` |
| **Detalhe da skill** | Versão instalada; picker beta/production; botões "Atualizar para X.Y.Z" / "Manter" / "Ignorar até próxima versão"; em draft: "Compartilhar para revisão" |
| **Minhas skills** | Lista completa; filtro por área; filtro "desatualizadas" |
| **Submeter versão** | Qualquer usuário cria `draft` (upload ZIP ou sync de alteração local autorizada); campo semver obrigatório |
| **Compartilhar para revisão** | Gera texto copiável: `"Skill: {name} v{semver} — aguarda revisão em {api_url}"` |
| **Aprovações** | Fila "Aguardando minha aprovação" (versões de outros autores); botões "Aprovar para beta" / "Aprovar para production"; progresso `1/2 aprovações` |
| **Promover** | Habilitado só quando quorum atendido; exibe lista de aprovadores; botão "Promover para {status}" |
| **Configurações** | API URL; escopo global vs projeto; copy vs symlink; agentes alvo; renovar sessão |
| **Atualização do gestor** | Banner "Nova versão vX.Y.Z disponível" com link de download |
| **Erros** | Mensagens acionáveis (rede, domínio e-mail inválido, scan falhou, JWT expirado) |

### 14.2 Comportamentos técnicos

- **Paridade installer** com `libs/core/src/lib/services/installer.service.ts`
- Cache catálogo: `~/.cache/agent-skills/local-catalog.json` (HMAC-SHA256 com `session_token`)
- Cache artefatos: `~/.cache/agent-skills/skills/{name}/{semver}/`
- Lockfile: `.agents/.skill-lock.json` v2
- **19 agentes** — tabela de `agents-registry.json`
- **Sem** invocar `npx @controllato/agent-skills` em nenhum fluxo do usuário
- **machine_id**: `SHA-256(hostname + primary_mac + os_username)`, persistido em `~/.cache/agent-skills/machine_id`
- **Re-auth**: se JWT expira durante uso, gestor chama `POST /auth/identify` silenciosamente com credenciais salvas no keyring
- **Auto-update**: verifica releases na abertura; exibe banner; não força update

### 14.3 Manifesto local opcional

`.agents/skills.manifest.yaml` permanece como **override** para projetos que precisem fixar lista local; padrão corporativo é `local-catalog` da API.

```yaml
version: 1
# Opcional — override local; senão usa API
skills: []
agents: auto
scope: project
method: copy
```

---

## 15. Catálogo, versionamento e CI

### 15.1 Seed inicial (go-live)

1. Executar `agent-platform seed` após migrations (idempotente: upsert por `skills.name` + `semver`).
2. Ler `packages/skills-catalog/skills-registry.json`.
3. Inserir `skill_categories`, `skills`, `skill_versions` (`production`, `is_latest_production`, `scan_status=passed`).
4. Criar `organizations` com dados da empresa que está fazendo o deploy.
5. Criar service account CI: `{ email: "ci-bot@org.com", is_service_account: true }`.
6. Criar bundles exemplo:
   - **Engenharia — padrão:** categorias `development`, `quality`, `security`, `tooling`, `cloud`, `architecture`, `performance`, `web-automation`, `monitoring`
   - **Comercial — GTM:** categoria `gtm`, `decision-making`
   - **Suporte / RH:** estrutura vazia até curadoria

### 15.2 Service account (CI bot)

- Usuário `users.is_service_account = true` criado durante bootstrap.
- `SERVICE_ACCOUNT_TOKEN` (JWT sem expiração ou longa duração) gerado no bootstrap; armazenado como secret CI.
- Service account pode: `POST /v1/skill-versions` (criar draft), `GET /v1/skills`.
- Service account **não pode**: `POST /v1/skill-versions/{id}/approve`, `POST /v1/skill-versions/{id}/promote`.
- Constraint enforced na API: se `approver_user_id` tem `is_service_account = true`, retorna 403.

### 15.3 Pipeline contínuo (monorepo)

```text
PR merge → generate-registry
  → content_hash mudou?
      → publish-platform (usa SERVICE_ACCOUNT_TOKEN):
          POST /v1/skill-versions { semver, content_hash, status=draft, files, cdn_path }
          draft_expires_at = now + org.settings.draft_expiry_days
      → Snyk scan (obrigatório antes de production)
  → Autor humano envia ID da versão via Slack
  → Revisor 1 abre gestor → POST /approve (target_status=beta) → promote para beta
  → Revisor 1 ou 2 → POST /approve (target_status=production)
  → Revisor 3 (distinto) → segunda aprovação production
  → POST /promote {to_status: production} → is_latest_production atualizado
```

### 15.4 Job de expiração de draft

```text
Cron: a cada 1 hora
  UPDATE skill_versions
  SET status = 'expired', updated_at = NOW()
  WHERE status = 'draft'
    AND draft_expires_at < NOW()
  RETURNING id, skill_id, semver
```

Resultado logado em logs estruturados. Admin pode consultar via `GET /admin/draft-expiry` (antes da expiração) ou SQL direto.

### 15.5 Relação CDN ↔ banco

- Postgres = metadados, direitos, versões, telemetria.
- CDN = bytes imutáveis por `(skill, semver, content_hash)`; estrutura: `https://cdn.jsdelivr.net/gh/controllato/agent-skills@{semver}/packages/skills-catalog/skills/({cat})/{name}/`.
- Gestor baixa do CDN usando `cdn_path` da versão resolvida na API.

---

## 16. Privacidade, segurança e LGPD

| Tema | Implementação |
|------|---------------|
| Dados pessoais | Nome + e-mail corporativo; base legal: legítimo interesse / contrato com empresa |
| Minimização | `project_path_hash` = `SHA-256(normalize(abs_path))`; sem salt; irreversível; nunca enviamos path absoluto |
| machine_id | `SHA-256(hostname + primary_mac + os_username)`; gerado no cliente; não recuperável pela API |
| Consentimento | Checkbox na primeira abertura; link para política da empresa |
| Retenção | `organizations.settings.retention_days`; job de purga em `usage_events` e `installations` |
| Exclusão | Endpoint admin: `DELETE /admin/users/{id}` anonimiza `users.email` e `users.display_name`; mantém agregados |
| Segurança skills | Snyk Agent Scan antes de `production` (herança monorepo) |
| Integridade aprovações | Autor não aprova própria versão; service account não aprova; quorum verificado em transação no `promote` |
| Path traversal | `sanitizeName`, `isPathSafe` no gestor (paridade CLI) |
| Tokens | JWT curta duração; keyring OS; `SERVICE_ACCOUNT_TOKEN` em secret CI |
| TLS | TLS 1.2+ obrigatório; certificado gerenciado pelo cliente (Let's Encrypt, empresa PKI) |
| Dados em repouso | Postgres volume criptografado recomendado (responsabilidade do cliente na infra self-hosted) |
| Cache offline | `local-catalog.json` assinado com HMAC-SHA256; gestor valida na leitura |

Referência: [SECURITY.md](SECURITY.md) do monorepo.

---

## 17. Telemetria e visibilidade administrativa

### 17.1 Eventos coletados

| Evento | Origem | Uso |
|--------|--------|-----|
| `identify` | Gestor | Usuário ativo |
| `sync_sessions` | Gestor | Saúde do sync; inclui `was_offline` |
| `installations` | Gestor | O que está instalado, em qual versão |
| `version_check_events` | Gestor | Adoção de updates; dismissed_until_next vs upgrade |
| `usage_events` | MCP / Gestor | Skills mais usadas |
| `mcp_read` com `update_available` | MCP | Oportunidades de upgrade |

`metadata` em `usage_events` é restrito ao schema fixo — nenhum campo adicional aceito pela API (400 se campo não reconhecido).

### 17.2 Dashboards v1 (mínimo via Metabase ou SQL)

- Instalações por área / skill / versão / status
- Usuários com pin em beta vs production latest
- Taxa de `dismissed_until_next` vs `upgraded` após aviso de update
- Skills nunca sincronizadas após grant
- Tempo médio de draft na fila (criação → beta, beta → production)
- Drafts prestes a expirar ou já expirados

---

## 18. Migração e descomissionamento da CLI

### 18.1 Estratégia

| Fase | CLI `@controllato/agent-skills` | Gestor |
|------|--------------------------------|--------|
| 0 | Mantida | — |
| 1 | Mantida | MVP sync + identify |
| 2 | Aviso deprecation no `npm` | Paridade remove/update |
| 3 | Somente bugfix crítico | Feature principal |
| 4 | Pacote arquivado / removido do catálogo | Único instalador UX |

### 18.2 Compatibilidade durante migração

- Lockfile v2 idêntico (gestor lê e escreve `.agents/.skill-lock.json` no mesmo formato).
- Mesmos paths de agentes.
- Usuários podem rodar CLI uma última vez; gestor reconcilia pins via API no próximo sync.
- CLI nunca chama a API corporativa; continua usando CDN público.

### 18.3 MCP público

Permanece disponível para uso sem autenticação. Empresas usam MCP corporativo + gestor.

---

## 19. Roadmap e fases de entrega

| Fase | Nome | Entregáveis | Critério de saída |
|------|------|-------------|-------------------|
| **0** | Fundação | Postgres schema + migrations; seed 100% skills; API identify + local-catalog + bootstrap; Docker + Helm | Dados no banco = registry; health/ready OK |
| **1** | Gestor MVP | Wails app; setup inicial (API URL + e-mail); sync bundle completo; pins; avisos update; modo offline com cache | Colaborador sem terminal instala skills em 10 min |
| **2** | MCP corporativo | Ferramentas P0/P1; report_usage; update_available | Cursor usa MCP corporativo autenticado |
| **3** | Governança | CI cria draft via service account; API approve/promote + expiração; fila admin; "Compartilhar para revisão" | Beta com 1 par; production com 2 pares; draft expira após N dias |
| **4** | Deprecar CLI | npm warning; docs de migração; remover `packages/cli` | Paridade completa install/remove/update; zero comandos necessários |

### 19.1 Definition of Done (v1)

- [ ] `skill_versions.status` ∈ {draft, beta, production, expired}; draft por qualquer usuário; beta com ≥1 aprovação humana de outro; production com ≥2 aprovadores humanos distintos; expired automático por job
- [ ] `skill_version_approvals` + endpoints `/approve` e `/promote` com validação de quorum em transação
- [ ] Service account: cria drafts, não aprova; enforced na API
- [ ] `GET /v1/me/local-catalog` — união multi-área + `update_available` + `dismissed_until_next`
- [ ] Gestor: abrir app → identify → sync automático do bundle local completo (ou offline com cache)
- [ ] Gestor: banner offline + reconexão automática
- [ ] Gestor: notificações + escolha de versão (sem auto-upgrade)
- [ ] Gestor: "Compartilhar para revisão" gera texto copiável
- [ ] `user_skill_pins` na API + reconciliação com lockfile; `DELETE /pin` funcional
- [ ] MCP: `update_available` em `read_skill`; `list_skill_versions` sem draft/expired; `check_skill_updates`
- [ ] Seed 100% skills atuais como production (idempotente)
- [ ] Admin: visibilidade instalações / pins / versões / fila aprovações
- [ ] Paginação cursor em todos os endpoints de lista
- [ ] Erros RFC 7807 em todos os endpoints
- [ ] Rate limiting em `/auth/identify` e `/approve`
- [ ] `GET /health` e `GET /ready` sem auth
- [ ] Documentação de onboarding corporativo (deploy Docker + bootstrap + instalar gestor + identify)

---

## 20. Critérios de sucesso e métricas

| Métrica | Meta v1 (90 dias pós launch piloto) | Como medir |
|---------|--------------------------------------|------------|
| Tempo de onboarding | < 10 min do download do gestor até primeira skill no Cursor | `sync_sessions.started_at` - timestamp primeiro download gestor |
| % colaboradores sem uso de CLI | > 90% | Download npm `@controllato/agent-skills` vs instalações via gestor |
| Taxa de sync bem-sucedido | > 95% | `sync_sessions` com `skills_failed = 0` / total |
| Tempo médio de sync (50 skills) | < 5 min | `sync_sessions.finished_at - started_at` |
| % usuários que atualizam em 30 dias após aviso | Baseline + tracking | `version_check_events` upgraded / (upgraded + dismissed_until_next) |
| Tempo médio draft → production | < 5 dias úteis | `promoted_at - created_at` em `skill_versions` |
| Incidentes de path/security | 0 críticos | Relatórios de segurança |
| Cobertura catálogo no PG | 100% skills do registry | `COUNT(skill_versions WHERE status='production')` vs registry |
| Taxa de drafts expirados | < 20% dos drafts criados | `COUNT(status='expired') / COUNT(created)` por janela de 30 dias |

---

## 21. Riscos e mitigações

| Risco | Probabilidade | Impacto | Mitigação |
|-------|---------------|---------|-----------|
| Bundle local muito grande (muitas áreas) | Média | Médio | Lazy download; sync paralelo limitado; UI por área |
| Drift banco vs CDN | Baixa | Alto | `content_hash` obrigatório; job reconciliação periódico |
| Drift lockfile vs API pin | Média | Médio | API fonte de verdade no sync; reconciliação no identify |
| Usuário ignora updates críticos | Média | Médio | Policy `required` fase 2 |
| Confusão draft/beta/production/expired | Média | Baixo | Badges consistentes na UI + MCP |
| Quorum de aprovação insuficiente em org pequena | Média | Médio | Mínimo 2 usuários humanos ativos na org; admin break-glass fase 2 |
| Auto-aprovação ou conluio de service account | Baixa | Alto | Bloqueio service account na API; log imutável em `skill_version_approvals` |
| Complexidade 3 repositórios | Alta | Médio | OpenAPI + schemas compartilhados; `oapi-codegen` |
| LGPD / e-mail corporativo | Baixa | Alto | Consentimento + retenção + hash de path |
| Windows symlink | Média | Médio | Junction fallback (paridade CLI) |
| Wails v2 sem suporte futuro | Média | Alto | Monitorar roadmap; plano de migração para v3 ou Tauri (ver D10) |
| CDN jsDelivr fora do ar | Baixa | Médio | Cache local de artefatos em `~/.cache`; retry com backoff |
| Cache offline com catálogo expirado | Média | Baixo | Aviso visual `cache_max_age_days`; usuário ciente |
| Aprovações out-of-band lentas (Slack) | Média | Médio | Dashboard de tempo médio na fila; escalação admin manual |
| Postgres único ponto de falha (self-hosted) | Média | Alto | Documentar configuração de réplica + backup diário para clientes |

---

## 22. Decisões em aberto

| # | Decisão | Opções | Impacto |
|---|---------|--------|---------|
| ~~D7~~ | ~~Hospedagem Postgres~~ | **Resolvido: self-hosted por cliente.** Cada empresa opera sua instância `agent-platform`. | — |
| ~~D5~~ | ~~MCP: binário único com flag~~ | **Resolvido: binário único `agent-platform --mcp` ou `DATA_SOURCE=api`.** Evita duplicação de código. | — |
| D1 | Go HTTP framework | `net/http` puro vs `chi` vs `echo` vs `gin` | Manutenibilidade API |
| D2 | SSO | Fase 2 OAuth/SAML vs e-mail+domínio v1 | Onboarding enterprise |
| D3 | Admin UI | Metabase v1 vs portal web | Custo v1 |
| D4 | Nome do binário gestor | `agent-manager`, `gestor-agentes`, `controllato-gestor` | Marca |
| D6 | Gestor escreve `mcp.json` automaticamente | Sim v1.1 / não v1 | UX Cursor |
| D8 | Wails v2 vs v3 | v2 estável mas sem suporte futuro garantido; v3 em alpha | Maturidade framework |
| D9 | Frontend do gestor | React vs Svelte | Bundle size, curva de aprendizado |
| D10 | Busca full-text | `tsvector postgresql portuguese` (v1) vs `pgvector` semântico (v2) | Relevância MCP |
| D11 | Release do gestor: auto-update | Sparkle (macOS) / WinSparkle (Windows) / AppImageUpdate (Linux) vs link manual | UX manutenção |

---

## 23. Apêndices

### Apêndice A — Agentes suportados (19)

Tier 1: `cursor`, `claude-code`, `github-copilot`, `windsurf`, `cline`  
Tier 2: `aider`, `codex`, `gemini`, `antigravity`, `roo`, `kilocode`, `trae`, `kiro`  
Tier 3: `amazonq`, `augment`, `factory`, `opencode`, `cody`, `tabnine`

Fonte canônica: `libs/core/src/lib/services/agents.service.ts` → exportar `agents-registry.json` no CI.

### Apêndice B — Categorias técnicas atuais do registry

`architecture`, `cloud`, `creation`, `decision-making`, `design`, `gtm`, `development`, `learning`, `monitoring`, `performance`, `quality`, `security`, `tooling`, `web-automation`, `uncategorized`

### Apêndice C — Mapeamento área → categorias (bundles exemplo)

| Área organizacional | Categorias técnicas incluídas no bundle exemplo |
|--------------------|--------------------------------------------------|
| Engenharia | development, quality, security, tooling, cloud, architecture, performance, web-automation, monitoring |
| Comercial | gtm, decision-making (parcial) |
| Suporte | (a definir pela org) |
| RH | (a definir pela org) |

### Apêndice D — Comparação CLI × Gestor × MCP

| Capacidade | CLI Node | Gestor Go | MCP corporativo |
|------------|----------|-----------|-----------------|
| Instalar local | Sim | Sim | Não (indireto) |
| Identificar usuário | Não | Sim | Sim (token) |
| Multi-área | Manual | Automático | Via entitlements |
| Versão draft/beta/prod | Não | Sim (criar draft + aprovar) | Sim (leitura; sem draft/expired) |
| Aprovação por pares | Não | Sim (via API) | Não (só leitura) |
| Aviso de update | Parcial | Sim | Sim |
| Telemetria central | Audit log local | API | API |
| Comandos terminal | Sim | **Não** | N/A |
| Modo offline | Não | Sim (cache) | Não |
| Compartilhar para revisão | Não | Sim (texto copiável) | Não |

### Apêndice E — Referências no monorepo

| Recurso | Caminho |
|---------|---------|
| Registry | `packages/skills-catalog/skills-registry.json` |
| Gerador | `packages/skills-catalog/src/generate-registry.ts` |
| Installer | `libs/core/src/lib/services/installer.service.ts` |
| Lockfile | `libs/core/src/lib/services/lockfile.service.ts` |
| Agentes | `libs/core/src/lib/services/agents.service.ts` |
| Registry CDN | `libs/core/src/lib/services/registry.service.ts` |
| CLI entrada | `packages/cli/src/index.ts` |
| MCP atual | `packages/mcp/src/main.ts` |
| Segurança | `SECURITY.md` |
| Contribuição | `CONTRIBUTING.md`, `AGENTS.md` |

### Apêndice F — Provisionamento self-hosted (passo a passo)

**Pré-requisitos:** Docker + Postgres 15+ + domínio com TLS configurado.

```bash
# 1. Subir agent-platform
docker run -d \
  -e DATABASE_URL=postgres://user:pass@host:5432/agent_platform \
  -e BOOTSTRAP_TOKEN=secret_bootstrap_token \
  -e JWT_SECRET=secret_jwt \
  -p 8080:8080 \
  ghcr.io/controllato/agent-platform:latest

# 2. Executar migrations + seed
docker exec agent-platform agent-platform migrate
docker exec agent-platform agent-platform seed

# 3. Bootstrap da organização
curl -X POST https://api.suaempresa.com/v1/admin/bootstrap \
  -H "X-Bootstrap-Token: secret_bootstrap_token" \
  -d '{
    "org_name": "Minha Empresa",
    "org_slug": "minha-empresa",
    "allowed_email_domains": ["minha-empresa.com.br"],
    "admin_email": "admin@minha-empresa.com.br",
    "admin_name": "Admin"
  }'
# Resposta inclui SERVICE_ACCOUNT_TOKEN para uso no CI

# 4. Distribuir gestor
# Download de ghcr.io/controllato/agent-manager via GoReleaser
# Colaborador configura API URL na primeira abertura
```

### Apêndice G — Schema `organizations.settings` (JSONB)

```json
{
  "draft_expiry_days": 30,
  "allow_beta_org": false,
  "cache_max_age_days": 7,
  "retention_days": 365
}
```

Todos os campos têm defaults aplicados na API se ausentes. `PATCH /admin/organizations/settings` faz merge parcial.

### Apêndice H — Histórico do documento

| Versão | Data | Alteração |
|--------|------|-----------|
| 1.0.0 | 2026-05-21 | PRD inicial consolidando plano Gestor Go + Plataforma corporativa + Postgres + MCP + multi-área + versões draft/beta/produção |
| 1.1.0 | 2026-05-21 | Governança de versões: draft por qualquer usuário; beta com ≥1 aprovação de outro usuário; produção com ≥2 aprovadores distintos; tabela `skill_version_approvals` |
| 2.0.0 | 2026-05-21 | Análise completa de melhores práticas: modelo self-hosted (D7 resolvido); status `expired` + `draft_expires_at` (substituindo rejected); modo offline fail-open com cache; aprovação out-of-band (Slack); service accounts para CI; provisionamento de org documentado; paginação cursor + RFC 7807; `DELETE /pin`; `machine_id` e `project_path_hash` especificados; `updated_at`/`deleted_at` nas tabelas; `user_bundle_grants` definida; `sync_sessions.user_id` adicionado; RNF de rate limiting, backup/DR, bandwidth; 8 novas decisões abertas |

---

*Documento vivo. Alterações de escopo devem atualizar versão do PRD e checklist da seção 19.1.*
