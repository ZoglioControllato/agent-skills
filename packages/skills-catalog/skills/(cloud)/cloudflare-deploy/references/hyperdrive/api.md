# Referência da API

Veja [README.md](./README.md) para visão geral e [configuration.md](./configuration.md) para configuração.

## Interface do binding

```typescript
interface Hyperdrive {
  connectionString: string // PostgreSQL
  // MySQL properties:
  host: string
  port: number
  user: string
  password: string
  database: string
}

interface Env {
  HYPERDRIVE: Hyperdrive
}
```

**Gerar tipos:** `npx wrangler types` (cria automaticamente `worker-configuration.d.ts` a partir do `wrangler.jsonc`)

## PostgreSQL (node-postgres) — RECOMENDADO

```typescript
import { Client } from 'pg' // pg@^8.17.2

export default {
  async fetch(req: Request, env: Env): Promise<Response> {
    const client = new Client({ connectionString: env.HYPERDRIVE.connectionString })
    try {
      await client.connect()
      const result = await client.query('SELECT * FROM users WHERE id = $1', [123])
      return Response.json(result.rows)
    } finally {
      await client.end()
    }
  },
}
```

**⚠️ Limite de conexões do Workers: 6 por invocação** — use pooling com critério.

## PostgreSQL (postgres.js)

```typescript
import postgres from 'postgres' // postgres@^3.4.8

const sql = postgres(env.HYPERDRIVE.connectionString, {
  max: 5, // Limit per Worker (Workers max: 6)
  prepare: true, // Enabled by default, required for caching
  fetch_types: false, // Reduce latency if not using arrays
})

const users = await sql`SELECT * FROM users WHERE active = ${true} LIMIT 10`
```

**⚠️ `prepare: true` vem habilitado por padrão e é necessário para o cache do Hyperdrive.** Definir como `false` desativa prepared statements e o cache.

## MySQL (mysql2)

```typescript
import { createConnection } from 'mysql2/promise' // mysql2@^3.16.2

const conn = await createConnection({
  host: env.HYPERDRIVE.host,
  user: env.HYPERDRIVE.user,
  password: env.HYPERDRIVE.password,
  database: env.HYPERDRIVE.database,
  port: env.HYPERDRIVE.port,
  disableEval: true, // ⚠️ REQUIRED for Workers
})

const [results] = await conn.query('SELECT * FROM users WHERE active = ? LIMIT ?', [true, 10])
ctx.waitUntil(conn.end())
```

**⚠️ Suporte a MySQL é menos maduro que PostgreSQL** — espere menos otimizações e possíveis casos extremos.

## Cache de consultas

**Cacheável:**

```sql
SELECT * FROM posts WHERE published = true;
SELECT COUNT(*) FROM users;
```

**NÃO cacheável:**

```sql
-- Writes
INSERT/UPDATE/DELETE

-- Volatile functions
SELECT NOW();
SELECT random();
SELECT LASTVAL();  -- PostgreSQL
SELECT UUID();     -- MySQL
```

**Configuração de cache:**

- Padrão: `max_age=60s`, `swr=15s`
- `max_age` máximo: 3600s
- Desativar: `--caching-disabled=true`

**Padrão com várias configs:**

```typescript
// Reads: cached
const sqlCached = postgres(env.HYPERDRIVE_CACHED.connectionString)
const posts = await sqlCached`SELECT * FROM posts ORDER BY views DESC LIMIT 10`

// Writes/time-sensitive: no cache
const sqlNoCache = postgres(env.HYPERDRIVE_NO_CACHE.connectionString)
const orders = await sqlNoCache`SELECT * FROM orders WHERE created_at > NOW() - INTERVAL 5 MINUTE`
```

## ORMs

**Drizzle:**

```typescript
import { drizzle } from 'drizzle-orm/postgres-js' // drizzle-orm@^0.45.1
import postgres from 'postgres'

const client = postgres(env.HYPERDRIVE.connectionString, { max: 5, prepare: true })
const db = drizzle(client)
const users = await db.select().from(users).where(eq(users.active, true)).limit(10)
```

**Kysely:**

```typescript
import { Kysely, PostgresDialect } from 'kysely' // kysely@^0.27+
import postgres from 'postgres'

const db = new Kysely({
  dialect: new PostgresDialect({
    postgres: postgres(env.HYPERDRIVE.connectionString, { max: 5, prepare: true }),
  }),
})
const users = await db.selectFrom('users').selectAll().where('active', '=', true).execute()
```

Veja [patterns.md](./patterns.md) para casos de uso e [gotchas.md](./gotchas.md) para limites.

Documentação localizada no ecossistema mantido pelo Controllato Club.
