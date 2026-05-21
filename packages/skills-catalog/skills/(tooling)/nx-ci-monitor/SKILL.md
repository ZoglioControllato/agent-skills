---
name: nx-ci-monitor
description: Monitora pipelines de CI no Nx Cloud e trata correções de self-healing automaticamente. Use quando o usuário disser "observar CI", "monitorar pipeline", "ver status do CI", "corrigir falhas de CI" ou "self-heal CI". Exige conexão com Nx Cloud. NÃO use para executar apenas tarefas locais (use nx-run-tasks) ou depuração genérica de CI fora do Nx Cloud.
---

# Comando CI Monitor

Você orquestra o monitoramento das execuções de pipeline de CI no Nx Cloud e o tratamento de correções de self-healing. Aciona o subagente `ci-watcher` para sondar o status do CI e decidir com base nos resultados.

## Contexto

- **Branch atual:** !`git branch --show-current`
- **Commit atual:** !`git rev-parse --short HEAD`
- **Status remoto:** !`git status -sb | head -1`

## Instruções do usuário

$ARGUMENTS

**Importante:** Se o usuário passar instruções específicas, respeite-as em detrimento dos comportamentos padrão abaixo.

## Padrões de configuração

| Configuração              | Padrão        | Descrição                                                      |
| ------------------------- | ------------- | -------------------------------------------------------------- |
| `--max-cycles`            | 10            | Máximo de ciclos CIPE antes do timeout                         |
| `--timeout`               | 120           | Duração máxima em minutos                                      |
| `--verbosity`             | medium        | Nível de saída: minimal, medium, verbose                       |
| `--branch`                | (auto-detect) | Branch a monitorar                                             |
| `--subagent-timeout`      | 60            | Timeout de polling do subagente (minutos)                      |
| `--fresh`                 | false         | Ignorar contexto anterior, recomeçar                           |
| `--auto-fix-workflow`     | false         | Tentar correções comuns em falhas pré-CIPE (ex.: lockfile)     |
| `--new-cipe-timeout`      | 10            | Minutos para aguardar novo CIPE após uma ação                  |
| `--local-verify-attempts` | 3             | Máx. ciclos de verificação local + enhance antes do push ao CI |

Interprete sobrescritas em `$ARGUMENTS` e una aos padrões.

## Verificação de conexão Nx Cloud

**CRÍTICO**: Antes do loop de monitoramento, confirme que o workspace está conectado ao Nx Cloud.

### Passo 0: Verificar conexão Nx Cloud

1. **Confira `nx.json`** na raiz do workspace por `nxCloudId` ou `nxCloudAccessToken`
2. **Se `nx.json` estiver ausente OU nenhuma das propriedades existir** → encerre com:

   ```
   [ci-monitor] Nx Cloud not connected. Unlock 70% faster CI and auto-fix broken PRs with https://nx.dev/nx-cloud
   ```

3. **Se estiver conectado** → siga para o loop principal

## Comportamento do contexto na sessão

**Importante:** Em uma sessão Claude Code, o contexto persiste. Se você interromper com Ctrl+C e rodar `/ci-monitor` de novo, o Claude pode lembrar o estado anterior e continuar de onde parou.

- **Para continuar monitorando:** Rode `/ci-monitor` de novo (contexto preservado)
- **Para recomeçar:** Use `/ci-monitor --fresh` para ignorar contexto anterior
- **Estado totalmente limpo:** Saia do Claude Code e reinicie o `claude`

## Comportamentos padrão por status

O subagente retorna um dos status abaixo. Esta tabela define o **comportamento padrão** de cada um. Instruções do usuário podem sobrescrever qualquer linha.

| Status              | Comportamento padrão                                                                                                                                                           |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `ci_success`        | Encerrar com sucesso. Registrar "CI passed successfully!"                                                                                                                      |
| `fix_auto_applying` | A correção será aplicada automaticamente pelo self-healing. NÃO chame MCP. Registre `last_cipe_url`, acione novo subagente em modo espera para sondar novo CIPE.               |
| `fix_available`     | Compare `failedTaskIds` e `verifiedTaskIds` para saber o estado de verificação. Veja a seção **Lógica quando há correção disponível** abaixo.                                  |
| `fix_failed`        | O self-healing não produziu correção. Tente corrigir localmente com base em `taskOutputSummary`. Se funcionar → commit, push, loop. Senão → encerre com falha.                 |
| `environment_issue` | Chame MCP para pedir rerun: `update_self_healing_fix({ shortLink, action: "RERUN_ENVIRONMENT_STATE" })`. Novo CIPE inicia automaticamente. Continue o loop sondando novo CIPE. |
| `no_fix`            | CI falhou, sem correção disponível (self-healing desligado ou não executável). Tente correção local se possível. Caso contrário encerre com falha.                             |
| `no_new_cipe`       | O CIPE esperado não iniciou (workflow de CI provavelmente falhou antes das tarefas Nx). Informe o usuário, tente correções comuns se configurado, ou encerre com orientação.   |
| `polling_timeout`   | Timeout de polling do subagente. Encerre com timeout.                                                                                                                          |
| `cipe_canceled`     | CIPE foi cancelado. Encerre com status cancelado.                                                                                                                              |
| `cipe_timed_out`    | CIPE atingiu timeout. Encerre com status de timeout.                                                                                                                           |
| `error`             | Incremente `no_progress_count`. Se >= 3 → encerre com circuit breaker. Caso contrário aguarde 60s e continue o loop.                                                           |

### Lógica quando há correção disponível

Quando o subagente retorna `fix_available`, o agente principal compara `failedTaskIds` com `verifiedTaskIds`:

#### Passo 1: Categorizar tarefas

1. **Tarefas verificadas** = tarefas em `failedTaskIds` **e** em `verifiedTaskIds`
2. **Tarefas não verificadas** = tarefas em `failedTaskIds` mas **não** em `verifiedTaskIds`
3. **Tarefas E2E** = tarefas não verificadas cujo target contém "e2e" (formato: `<project>:<target>` ou `<project>:<target>:<config>`)
4. **Tarefas verificáveis** = tarefas não verificadas que **não** são e2e

#### Passo 2: Escolher caminho

| Condição                                        | Caminho                                             |
| ----------------------------------------------- | --------------------------------------------------- |
| Sem tarefas não verificadas (todas verificadas) | Aplicar via MCP                                     |
| Há não verificadas, mas **todas** são e2e       | Aplicar via MCP (considerar verificação suficiente) |
| Há tarefas verificáveis (não e2e)               | Fluxo de verificação local                          |

#### Passo 3a: Aplicar via MCP (totalmente verificado / só e2e)

- Chame `update_self_healing_fix({ shortLink, action: "APPLY" })`
- Registre `last_cipe_url`, acione subagente em modo espera

#### Passo 3b: Fluxo de verificação local

Quando existirem tarefas verificáveis (não e2e) ainda não verificadas:

1. **Detectar gerenciador de pacotes:**
   - Existe `pnpm-lock.yaml` → `pnpm nx`
   - Existe `yarn.lock` → `yarn nx`
   - Caso contrário → `npx nx`

2. **Rodar tarefas verificáveis em paralelo:**
   - Acione subagentes `general` para cada tarefa em concorrência
   - Cada um roda: `<pm> nx run <taskId>`
   - Colete pass/fail de todos

3. **Avaliar resultados:**

| Resultado                    | Ação                          |
| ---------------------------- | ----------------------------- |
| Todas as verificáveis passam | Aplicar via MCP               |
| Alguma verificável falha     | Fluxo apply-locally + enhance |

1. **Fluxo apply-locally + enhance:**
   - Rode `nx apply-locally <shortLink>`
   - Ajuste o código até as tarefas que falhavam passarem
   - Rode novamente as tarefas que falhavam
   - Se ainda falhar → incremente `local_verify_count`, volte ao enhance
   - Se passar → commit e push, registre `expected_commit_sha`, subagente em modo espera

2. **Controle de tentativas** (envolve o passo 4):
   - Incremente `local_verify_count` após cada ciclo de enhance
   - Se `local_verify_count >= local_verify_attempts` (padrão: 3):
     - Deixe o código em estado comitável
     - Commit e push indicando que a verificação local falhou
     - Informe o usuário:

       ```
       [ci-monitor] Local verification failed after <N> attempts. Pushed to CI for final validation. Failed: <taskIds>
       ```

     - Registre `expected_commit_sha`, subagente em modo espera (CI como juiz final)

#### Formato da mensagem de commit

```bash
git commit -m "fix(<projects>): <brief description>

Failed tasks: <taskId1>, <taskId2>
Local verification: passed|enhanced|failed-pushing-to-ci"
```

### Fluxo sem verificação da correção

Quando `verificationStatus` for `FAILED`, `NOT_EXECUTABLE`, ou a correção tiver `couldAutoApplyTasks != true` sem verificação:

- Analise o conteúdo (`suggestedFix`, `suggestedFixReasoning`, `taskOutputSummary`)
- Se a correção parecer correta → aplique via MCP
- Se precisar de refine → use o fluxo Apply Locally + Enhance acima
- Se estiver errada → rejeite via MCP, corrija do zero, commit, push

### Elegibilidade de auto-apply

O campo `couldAutoApplyTasks` indica se a correção pode ser aplicada automaticamente:

- **`true`**: Elegível. Subagente continua sondando enquanto a verificação roda. Retorna `fix_auto_applying` quando verificado, ou `fix_available` se a verificação falhar.
- **`false`** ou **`null`**: Exige ação manual (MCP, apply local ou rejeição)

**Ponto-chave**: Com `fix_auto_applying`, **não** chame MCP para aplicar — o self-healing cuida disso. Só acione novo subagente em modo espera.

### Aplicar vs rejeitar vs aplicar localmente

- **Aplicar via MCP**: `update_self_healing_fix({ shortLink, action: "APPLY" })`. O agente de self-healing aplica no CI e um novo CIPE dispara. Sem git local.
- **Aplicar localmente**: `nx apply-locally <shortLink>`. Aplica o patch no working tree e estado `APPLIED_LOCALLY`. Use para refinar antes do push.
- **Rejeitar via MCP**: `update_self_healing_fix({ shortLink, action: "REJECT" })`. Marca como rejeitada. Só quando a correção estiver totalmente errada e você for reescrever do zero.

### Fluxo aplicar localmente + enhance

Quando a correção precisar de ajustes (use `nx apply-locally`, **não** rejeite):

1. `nx apply-locally <shortLink>` (atualiza para `APPLIED_LOCALLY`)
2. Alterações adicionais conforme necessário
3. Commit e push:

   ```bash
   git add -A
   git commit -m "fix: resolve <failedTaskIds>"
   git push origin $(git branch --show-current)
   ```

4. Continue o loop sondando novo CIPE

### Fluxo rejeitar + corrigir do zero

Quando a correção estiver totalmente errada:

1. MCP: `update_self_healing_fix({ shortLink, action: "REJECT" })`
2. Corrija do zero localmente
3. Commit e push (mesmo bloco bash acima)
4. Loop sondando novo CIPE

### Problema de ambiente

Quando `failureClassification == 'ENVIRONMENT_STATE'`:

1. MCP: `update_self_healing_fix({ shortLink, action: "RERUN_ENVIRONMENT_STATE" })`
2. Novo CIPE automático (sem git local)
3. Loop com `previousCipeUrl` definido

### Sem novo CIPE

Quando `status == 'no_new_cipe'`:

O CIPE esperado não foi criado — o CI provavelmente falhou antes das tarefas Nx.

1. **Informe o usuário:**

   ```
   [ci-monitor] No CI attempt for <sha> after 10 min. Check CI provider for pre-Nx failures (install, checkout, auth). Last CI attempt: <previousCipeUrl>
   ```

2. **Se houver auto-fix** (ex.: `--auto-fix-workflow`):
   - Detecte gerenciador: `pnpm-lock.yaml`, `yarn.lock`, `package-lock.json`
   - Rode install para atualizar lockfile:

     ```bash
     pnpm install   # ou npm install / yarn install
     ```

   - Se o lockfile mudou:

     ```bash
     git add pnpm-lock.yaml  # ou lockfile adequado
     git commit -m "chore: update lockfile"
     git push origin $(git branch --show-current)
     ```

   - Registre novo SHA, continue o loop com `expectedCommitSha`

3. **Senão:** Encerre com `no_new_cipe` e oriente investigação

## Condições de saída

Encerre o loop quando **qualquer** condição:

| Condição                                 | Tipo de saída   |
| ---------------------------------------- | --------------- |
| CI passa (`cipeStatus == 'SUCCEEDED'`)   | Sucesso         |
| Máximo de ciclos CIPE                    | Timeout         |
| Duração máxima atingida                  | Timeout         |
| 3 iterações consecutivas sem progresso   | Circuit breaker |
| Sem correção e correção local impossível | Falha           |
| Sem novo CIPE e auto-fix desligado       | Falha pré-CIPE  |
| Usuário cancela                          | Cancelado       |

## Loop principal

### Passo 1: Inicializar rastreamento

```
cycle_count = 0
start_time = now()
no_progress_count = 0
local_verify_count = 0
last_state = null
last_cipe_url = null
expected_commit_sha = null
```

### Passo 2: Acionar subagente

Acione o subagente `ci-watcher` para sondar o CI:

**Primeira vez (sem CIPE esperado):**

```
Task(
  agent: "ci-watcher",
  prompt: "Monitor CI for branch '<branch>'.
           Subagent timeout: <subagent-timeout> minutes.
           New-CIPE timeout: <new-cipe-timeout> minutes.
           Verbosity: <verbosity>."
)
```

**Após ação que dispara novo CIPE (modo espera):**

```
Task(
  agent: "ci-watcher",
  prompt: "Monitor CI for branch '<branch>'.
           Subagent timeout: <subagent-timeout> minutes.
           New-CIPE timeout: <new-cipe-timeout> minutes.
           Verbosity: <verbosity>.

           WAIT MODE: A new CIPE should spawn. Ignore old CIPE until new one appears.
           Expected commit SHA: <expected_commit_sha>
           Previous CIPE URL: <last_cipe_url>"
)
```

### Passo 3: Tratar resposta do subagente

Quando o subagente retornar:

1. Leia o status
2. Consulte a tabela de comportamentos padrão
3. Veja se instruções do usuário sobrescrevem
4. Execute a ação
5. **Se esperar novo CIPE**, atualize rastreamento (passo 3a)
6. Se for loop, volte ao passo 2

### Passo 3a: Estado para detectar novo CIPE

Após ações que devem disparar novo CIPE:

| Ação                       | O que rastrear                                | Modo subagente |
| -------------------------- | --------------------------------------------- | -------------- |
| Fix em auto-apply          | `last_cipe_url = cipeUrl atual`               | Espera         |
| Aplicar via MCP            | `last_cipe_url = cipeUrl atual`               | Espera         |
| Aplicar local + push       | `expected_commit_sha = $(git rev-parse HEAD)` | Espera         |
| Rejeitar + corrigir + push | `expected_commit_sha = $(git rev-parse HEAD)` | Espera         |
| Falha + fix local + push   | `expected_commit_sha = $(git rev-parse HEAD)` | Espera         |
| Sem fix + fix local + push | `expected_commit_sha = $(git rev-parse HEAD)` | Espera         |
| Rerun de ambiente          | `last_cipe_url = cipeUrl atual`               | Espera         |
| Sem CIPE + auto-fix + push | `expected_commit_sha = $(git rev-parse HEAD)` | Espera         |

**CRÍTICO**: Ao passar `expectedCommitSha` ou `last_cipe_url`, o subagente entra em **modo espera**:

- Ignora CIPE antigo/obsoleto
- Aguarda só o novo CIPE
- Não devolve dados obsoletos ao agente principal
- Ao detectar novo CIPE, volta ao polling normal

**Por que o modo espera preserva contexto**: dados antigos de CIPE podem ser enormes (logs, patches, raciocínio). Devolvê-los polui o contexto principal. O modo espera mantém isso no subagente.

### Passo 4: Progresso

Após cada ação:

- Mudança significativa → `no_progress_count = 0`
- Sem mudança → `no_progress_count++`
- Nova tentativa de CI → `local_verify_count = 0`

## Relatório de status

Conforme `verbosity`:

| Nível     | O que reportar                                                                    |
| --------- | --------------------------------------------------------------------------------- |
| `minimal` | Só resultado final (sucesso/falha/timeout)                                        |
| `medium`  | Mudanças de estado + updates periódicos ("Cycle N \| Elapsed: Xm \| Status: ...") |
| `verbose` | Tudo do médio + respostas completas do subagente, git, MCP                        |

## Exemplos de instrução do usuário

| Instrução                                        | Efeito                                            |
| ------------------------------------------------ | ------------------------------------------------- |
| "never auto-apply"                               | Sempre perguntar antes de aplicar correção        |
| "always ask before git push"                     | Perguntar antes de cada push                      |
| "reject any fix for e2e tasks"                   | Rejeitar auto se `failedTaskIds` tiver e2e        |
| "apply all fixes regardless of verification"     | Pular checagem de verificação                     |
| "if confidence < 70, reject"                     | Checar campo confidence antes de aplicar          |
| "run 'nx affected -t typecheck' before applying" | Etapa extra de verificação local                  |
| "auto-fix workflow failures"                     | Tentar atualizar lockfile em falhas pré-CIPE      |
| "wait 45 min for new CIPE"                       | Sobrescrever timeout de novo CIPE (padrão 10 min) |

## Tratamento de erros

| Erro                        | Ação                                                               |
| --------------------------- | ------------------------------------------------------------------ |
| Conflito em rebase git      | Informar usuário, sair                                             |
| Falha em `nx apply-locally` | Informar, tentar patch manual ou sair                              |
| Erro em ferramenta MCP      | Tentar de novo uma vez; se falhar, informar                        |
| Falha ao acionar subagente  | Tentar de novo; se falhar, sair com erro                           |
| Sem novo CIPE               | Com `--auto-fix-workflow`, tente lockfile; senão oriente o usuário |
| Auto-fix de lockfile falha  | Informar, orientar checagem dos logs do CI                         |

## Sessão de exemplo

Os blocos de log de exemplo abaixo permanecem em inglês (saída da ferramenta).

### Exemplo 1: Fluxo normal com self-healing (verbosidade média)

```
[ci-monitor] Starting CI monitor for branch 'feature/add-auth'
[ci-monitor] Config: max-cycles=5, timeout=120m, verbosity=medium

[ci-monitor] Spawning subagent to poll CI status...
[CI Monitor] CI attempt: IN_PROGRESS | Self-Healing: NOT_STARTED | Elapsed: 1m
[CI Monitor] CI attempt: FAILED | Self-Healing: IN_PROGRESS | Elapsed: 3m
[CI Monitor] CI attempt: FAILED | Self-Healing: COMPLETED | Elapsed: 5m

[ci-monitor] Fix available! Verification: COMPLETED
[ci-monitor] Applying fix via MCP...
[ci-monitor] Fix applied in CI. Waiting for new CI attempt...

[ci-monitor] Spawning subagent to poll CI status...
[CI Monitor] New CI attempt detected!
[CI Monitor] CI attempt: SUCCEEDED | Elapsed: 8m

[ci-monitor] CI passed successfully!

[ci-monitor] Summary:
  - Total cycles: 2
  - Total time: 12m 34s
  - Fixes applied: 1
  - Result: SUCCESS
```

### Exemplo 2: Falha pré-CI (verbosidade média)

```
[ci-monitor] Starting CI monitor for branch 'feature/add-products'
[ci-monitor] Config: max-cycles=5, timeout=120m, auto-fix-workflow=true

[ci-monitor] Spawning subagent to poll CI status...
[CI Monitor] CI attempt: FAILED | Self-Healing: COMPLETED | Elapsed: 2m

[ci-monitor] Applying fix locally, enhancing, and pushing...
[ci-monitor] Committed: abc1234

[ci-monitor] Spawning subagent to poll CI status...
[CI Monitor] Waiting for new CI attempt... (expected SHA: abc1234)
[CI Monitor] ⚠️  CI attempt timeout (10 min). Returning no_new_cipe.

[ci-monitor] Status: no_new_cipe
[ci-monitor] --auto-fix-workflow enabled. Attempting lockfile update...
[ci-monitor] Lockfile updated. Committed: def5678

[ci-monitor] Spawning subagent to poll CI status...
[CI Monitor] New CI attempt detected!
[CI Monitor] CI attempt: SUCCEEDED | Elapsed: 18m

[ci-monitor] CI passed successfully!

[ci-monitor] Summary:
  - Total cycles: 3
  - Total time: 22m 15s
  - Fixes applied: 1 (self-healing) + 1 (lockfile)
  - Result: SUCCESS
```
