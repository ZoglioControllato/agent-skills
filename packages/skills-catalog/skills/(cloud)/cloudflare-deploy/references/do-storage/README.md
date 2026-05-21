# Armazenamento de objetos duráveis Cloudflare

API de armazenamento persistente para objetos duráveis com backends SQLite e KV, PITR e controle automático de simultaneidade.

## Visão geral

O armazenamento DO fornece:

- apoiado por SQLite (recomendado) ou apoiado por KV
- API SQL + APIs KV síncronas/assíncronas
- Portões automáticos de entrada/saída (sem corrida)
- Recuperação pontual de 30 dias (PITR)
- Transações e alarmes

**Casos de uso:** Coordenação com estado, colaboração em tempo real, contadores, sessões, limitadores de taxa

**Faturamento:** Cobrado por solicitação, armazenamento em GB por mês e rowsRead/rowsWritten para operações SQL

## Início rápido```typescript

export class Counter extends DurableObject {
sql: SqlStorage

constructor(ctx: DurableObjectState, env: Env) {
super(ctx, env)
this.sql = ctx.storage.sql
this.sql.exec('CREATE TABLE IF NOT EXISTS data(key TEXT PRIMARY KEY, value INTEGER)')
}

async increment(): Promise<number> {
const result = this.sql
.exec(
'INSERT INTO data VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = value + 1 RETURNING value',
'counter',
1,
)
.one()
return result?.value || 1
}
}

```
## Back-ends de armazenamento

| Back-end | Criar método | APIs | PITR |
| -------------------- | -------------------- | ------------------------ | ---- |
| SQLite (recomendado) | `new_sqlite_classes` | SQL + sincronização KV + assíncrona KV | ✅ |
| KV (legado) | `novas_classes` | apenas KV assíncrono | ❌ |

## APIs principais

- **API SQL** (`ctx.storage.sql`): SQLite completo com extensões (FTS5, JSON, matemática)
- **Sync KV** (`ctx.storage.kv`): valor-chave síncrono (somente SQLite)
- **Async KV** (`ctx.storage`): valor-chave assíncrono (ambos os backends)
- **Transações** (`transactionSync()`, `transaction()`)
- **PITR** (`getBookmarkForTime()`, `onNextSessionRestoreBookmark()`)
- **Alarmes** (`setAlarm()`, manipulador `alarm()`)

## Ordem de leitura

**Novo no armazenamento DO:** configuração.md → api.md → padrões.md → gotchas.md
**Recursos de construção:** padrões.md → api.md → gotchas.md
**Problemas de depuração:** gotchas.md → api.md
**Escrita de testes:**testing.md

## Nesta referência

- [configuration.md](./configuration.md) - migrações wrangler.jsonc, configuração SQLite vs KV, ligação RPC
- [api.md](./api.md) - SQL exec/cursores, métodos KV, opções de armazenamento, transações, alarmes, PITR
- [patterns.md](./patterns.md) - Migrações de esquema, cache, limitação de taxa, processamento em lote, coordenação pai-filho
- [gotchas.md](./gotchas.md) - Portas de simultaneidade, precisão INTEGER, regras de transação, limites SQL
- [testing.md](./testing.md) - configuração do vitest-pool-workers, testando DOs com SQL/alarms/PITR

## Veja também

- [objetos duráveis](../objetos duráveis/) - Fundamentos de DO e padrões de coordenação
- [workers](../workers/) - Tempo de execução do trabalhador para stubs DO
- [d1](../d1/) - Alternativa de banco de dados compartilhado para armazenamento por DO
```
