# D1: gotchas e troubleshooting

## Erros comuns

### "SQL Injection Vulnerability"

**Causa:** interpolação de string em vez de prepared statements com bind()  
**Solução:** SEMPRE use prepared statements: `env.DB.prepare('SELECT * FROM users WHERE id = ?').bind(userId).all()` — nunca interpole strings que permitam SQL malicioso

### "no such table"

**Causa:** tabela não existe (migrations não rodadas) ou binding errado  
**Solução:** `wrangler d1 migrations apply <db-name> --remote` e confira o nome do binding no wrangler.jsonc

### "UNIQUE constraint failed"

**Causa:** insert duplicado em coluna UNIQUE  
**Solução:** capture o erro e retorne HTTP 409 Conflict

### "Query Timeout (30s exceeded)"

**Causa:** query > 30 s  
**Solução:** divida em queries menores, índices, reduza dataset

### "N+1 Query Problem"

**Causa:** várias queries em loop em vez de uma otimizada  
**Solução:** JOIN ou método `batch()`

### "Missing Indexes"

**Causa:** full table scan  
**Solução:** `EXPLAIN QUERY PLAN` e `CREATE INDEX idx_users_email ON users(email)`

### "Boolean Type Issues"

**Causa:** SQLite usa INTEGER (0/1), não boolean nativo  
**Solução:** bind 1 ou 0 em vez de true/false quando necessário

### "Date/Time Type Issues"

**Causa:** SQLite sem tipos DATE/TIME nativos  
**Solução:** TEXT ISO8601 ou INTEGER (unix timestamp)

## Limites por plano

| Limite               | Free       | Pagos                   | Observações                       |
| -------------------- | ---------- | ----------------------- | --------------------------------- |
| Tamanho DB           | 500 MB     | 10 GB                   | Vários DBs por tenant no pago     |
| Tamanho da linha     | 1 MB       | 1 MB                    | Arquivos grandes no R2, não no D1 |
| Timeout de query     | 30s        | 30s (900s com sessions) | Sessions para migrations          |
| Batch                | 1.000      | 10.000                  | Divida batches grandes            |
| Time Travel          | 7 dias     | 30 dias                 | Janela PITR                       |
| Réplicas             | ❌         | ✅                      | Add-on pago                       |
| Sessions API         | ❌         | Até 15 min              | Migrations e ops pesadas          |
| Requisições concorr. | 10.000/min | Maior                   | Limites custom: suporte           |

## Gotchas em produção

### "Batch size exceeded"

**Causa:** >1.000 no free ou >10.000 no pago  
**Solução:** chunk: `for (let i = 0; i < stmts.length; i += MAX_BATCH) await env.DB.batch(stmts.slice(i, i + MAX_BATCH))`

### "Session not closed / resource leak"

**Causa:** não chamou `session.close()`  
**Solução:** try/finally: `try { await session.prepare(...) } finally { session.close() }`

### "Replication lag causing stale reads"

**Causa:** leitura na réplica logo após write (lag 100ms–2s)  
**Solução:** read-after-write no primário: `env.DB`, não `env.DB_REPLICA`

### "Migration applied to local but not remote"

**Causa:** faltou `--remote`  
**Solução:** `wrangler d1 migrations apply <db-name> --remote` em produção

### "Foreign key constraint failed"

**Causa:** FK para pai inexistente ou delete na ordem errada  
**Solução:** `PRAGMA foreign_keys = ON;` e `ON DELETE CASCADE` no schema

### "BLOB data corrupted on export"

**Causa:** export D1 e BLOB  
**Solução:** binários no R1; no D1 só URLs/keys do R2

### "Database size approaching limit"

**Causa:** dados demais num único banco  
**Solução:** scale-out por tenant, arquivo, upgrade de plano

### "Local dev vs production behavior differs"

**Causa:** local = SQLite file; prod = D1 distribuído  
**Solução:** teste migrations com `--remote` antes do rollout
