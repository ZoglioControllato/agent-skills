# Banco Cloudflare D1

Orientação especializada para o Cloudflare D1, banco SQLite serverless pensado para escala horizontal com vários bancos.

## Visão geral

O D1 é o banco gerenciado e serverless da Cloudflare com:

- Semântica e compatibilidade SQL SQLite
- Recuperação de desastres via Time Travel (PITR de 30 dias)
- Arquitetura de scale-out horizontal (10 GB por banco)
- Acesso via Worker e API HTTP
- Precificação só por consultas e armazenamento

**Filosofia de arquitetura**: D1 é otimizado para padrões por usuário, por tenant ou por entidade — não para um único banco gigante.

## Início rápido

```bash
# Criar banco
wrangler d1 create <database-name>

# Executar migration
wrangler d1 migrations apply <db-name> --remote

# Desenvolvimento local
wrangler dev
```

## Métodos principais de consulta

```typescript
// .all() — todas as linhas; .first() — primeira linha ou null; .first(col) — valor de uma coluna
// .run() — INSERT/UPDATE/DELETE; .raw() — array de arrays (eficiente)
const { results, success, meta } = await env.DB.prepare('SELECT * FROM users WHERE active = ?').bind(true).all()
const user = await env.DB.prepare('SELECT * FROM users WHERE id = ?').bind(userId).first()
```

## Operações em lote

```typescript
// Várias consultas em uma ida e volta (transação atômica)
const results = await env.DB.batch([
  env.DB.prepare('SELECT * FROM users WHERE id = ?').bind(1),
  env.DB.prepare('SELECT * FROM posts WHERE author_id = ?').bind(1),
  env.DB.prepare('UPDATE users SET last_access = ? WHERE id = ?').bind(Date.now(), 1),
])
```

## API de Sessions (planos pagos)

```typescript
// Sessão longa para analytics/migrations (até 15 minutos)
const session = env.DB.withSession()
try {
  await session.prepare('CREATE INDEX idx_heavy ON large_table(column)').run()
  await session.prepare('ANALYZE').run()
} finally {
  session.close() // Sempre feche para liberar recursos
}
```

## Read replication (planos pagos)

```typescript
// Leitura da réplica mais próxima para menor latência (failover automático)
const user = await env.DB_REPLICA.prepare('SELECT * FROM users WHERE id = ?').bind(userId).first()

// Escritas sempre vão para o primário
await env.DB.prepare('UPDATE users SET last_login = ? WHERE id = ?').bind(Date.now(), userId).run()
```

## Limites da plataforma

| Limite               | Free             | Pagos             |
| -------------------- | ---------------- | ----------------- |
| Tamanho do banco     | 500 MB           | 10 GB por banco   |
| Tamanho da linha     | 1 MB máx.        | 1 MB máx.         |
| Timeout de query     | 30 segundos      | 30 segundos       |
| Tamanho de batch     | 1.000 statements | 10.000 statements |
| Retenção Time Travel | 7 dias           | 30 dias           |
| Réplicas de leitura  | Indisponível     | Sim (add-on pago) |

**Preços**: US$ 5/mês por banco além do free tier + US$ 0,001 por 1K reads + US$ 1 por 1M writes + US$ 0,75/GB/mês de armazenamento

## Comandos CLI

```bash
# Gerenciamento de banco
wrangler d1 create <db-name>
wrangler d1 list
wrangler d1 delete <db-name>

# Migrations
wrangler d1 migrations create <db-name> <migration-name>    # Novo arquivo de migration
wrangler d1 migrations apply <db-name> --remote             # Aplicar migrations pendentes
wrangler d1 migrations apply <db-name> --local              # Aplicar localmente
wrangler d1 migrations list <db-name> --remote              # Migrations aplicadas

# Execução SQL direta
wrangler d1 execute <db-name> --remote --command="SELECT * FROM users"
wrangler d1 execute <db-name> --local --file=./schema.sql

# Backups e import/export
wrangler d1 export <db-name> --remote --output=./backup.sql  # Export completo com schema
wrangler d1 export <db-name> --remote --no-schema --output=./data.sql  # Só dados
wrangler d1 time-travel restore <db-name> --timestamp="2024-01-15T14:30:00Z"  # PITR

# Desenvolvimento
wrangler dev --persist-to=./.wrangler/state
```

## Ordem de leitura

**Comece aqui**: Início rápido acima → configuration.md (setup) → api.md (consultas)

**Tarefas comuns**:

- Primeiro setup: configuration.md → rode migrations
- Adicionar queries: api.md → prepared statements
- Paginação/cache: patterns.md
- Produção: read replication + Sessions API (este arquivo)
- Debug: gotchas.md

## Nesta referência

- [configuration.md](./configuration.md) — wrangler.jsonc, migrations, tipos TypeScript, ORMs, dev local
- [api.md](./api.md) — métodos (.all/.first/.run/.raw), batch, sessions, réplicas, erros
- [patterns.md](./patterns.md) — paginação, bulk, cache, multi-tenant, sessions, analytics
- [gotchas.md](./gotchas.md) — SQL injection, limites por plano, performance, erros comuns

## Ver também

- [workers](../workers/) — runtime do Worker e padrões de fetch
- [hyperdrive](../hyperdrive/) — pool de conexões para bancos externos
