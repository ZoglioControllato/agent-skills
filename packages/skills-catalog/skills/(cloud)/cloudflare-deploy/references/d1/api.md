# Referência da API D1

## Prepared statements (obrigatório por segurança)

```typescript
// ❌ NUNCA: interpolação direta (risco de SQL injection)
const result = await env.DB.prepare(`SELECT * FROM users WHERE id = ${userId}`).all()

// ✅ CORRETO: prepared statements com bind()
const result = await env.DB.prepare('SELECT * FROM users WHERE id = ?').bind(userId).all()

// Múltiplos parâmetros
const result = await env.DB.prepare('SELECT * FROM users WHERE email = ? AND active = ?').bind(email, true).all()
```

## Métodos de execução

```typescript
// .all() — retorna todas as linhas
const { results, success, meta } = await env.DB.prepare('SELECT * FROM users WHERE active = ?').bind(true).all()
// results: array de objetos-linha; success: boolean
// meta: { duration: number, rows_read: number, rows_written: number }

// .first() — primeira linha ou null
const user = await env.DB.prepare('SELECT * FROM users WHERE id = ?').bind(userId).first()

// .first(columnName) — valor de uma única coluna
const email = await env.DB.prepare('SELECT email FROM users WHERE id = ?').bind(userId).first('email')
// Retorna string | number | null

// .run() — INSERT/UPDATE/DELETE (sem retorno de linhas)
const result = await env.DB.prepare('UPDATE users SET last_login = ? WHERE id = ?').bind(Date.now(), userId).run()
// result.meta: { duration, rows_read, rows_written, last_row_id, changes }

// .raw() — array de arrays (eficiente para grandes volumes)
const rawResults = await env.DB.prepare('SELECT id, name FROM users').raw()
// [[1, 'Alice'], [2, 'Bob']]
```

## Operações em lote

```typescript
// Várias consultas em uma ida e volta (transação atômica)
const results = await env.DB.batch([
  env.DB.prepare('SELECT * FROM users WHERE id = ?').bind(1),
  env.DB.prepare('SELECT * FROM posts WHERE author_id = ?').bind(1),
  env.DB.prepare('UPDATE users SET last_access = ? WHERE id = ?').bind(Date.now(), 1),
])
// results é array: [result1, result2, result3]

// Batch com mesmo prepared statement, parâmetros diferentes
const userIds = [1, 2, 3]
const stmt = env.DB.prepare('SELECT * FROM users WHERE id = ?')
const results = await env.DB.batch(userIds.map((id) => stmt.bind(id)))
```

## Transações (via batch)

```typescript
// O D1 executa batch() como transação atômica — tudo passa ou tudo falha
const results = await env.DB.batch([
  env.DB.prepare('INSERT INTO accounts (id, balance) VALUES (?, ?)').bind(1, 100),
  env.DB.prepare('INSERT INTO accounts (id, balance) VALUES (?, ?)').bind(2, 200),
  env.DB.prepare('UPDATE accounts SET balance = balance - ? WHERE id = ?').bind(50, 1),
  env.DB.prepare('UPDATE accounts SET balance = balance + ? WHERE id = ?').bind(50, 2),
])
```

## API de Sessions (planos pagos)

Sessões longas para operações que excedem timeout de 30 s (até 15 min).

```typescript
const session = env.DB.withSession({ timeout: 600 }) // 10 min (1–900s)
try {
  await session.prepare('CREATE INDEX idx_large ON big_table(column)').run()
  await session.prepare('ANALYZE').run()
} finally {
  session.close() // CRÍTICO: sempre feche para evitar vazamentos
}
```

**Casos de uso**: migrations, ANALYZE, criação de índices grandes, transformações em massa

## Read replication (planos pagos)

Encaminha consultas à réplica mais próxima. Escritas sempre no primário.

```typescript
interface Env {
  DB: D1Database // Primário (writes)
  DB_REPLICA: D1Database // Réplica (reads)
}

// Reads: use réplica
const user = await env.DB_REPLICA.prepare('SELECT * FROM users WHERE id = ?').bind(userId).first()

// Writes: use primário
await env.DB.prepare('UPDATE users SET last_login = ? WHERE id = ?').bind(Date.now(), userId).run()

// Read-after-write: use primário para consistência (lag <100ms–2s)
await env.DB.prepare('INSERT INTO posts (title) VALUES (?)').bind(title).run()
const post = await env.DB.prepare('SELECT * FROM posts WHERE title = ?').bind(title).first() // Primário
```

## Tratamento de erros

```typescript
async function getUser(userId: number, env: Env): Promise<Response> {
  try {
    const result = await env.DB.prepare('SELECT * FROM users WHERE id = ?').bind(userId).all()
    if (!result.success) return new Response('Database error', { status: 500 })
    if (result.results.length === 0) return new Response('User not found', { status: 404 })
    return Response.json(result.results[0])
  } catch (error) {
    return new Response('Internal error', { status: 500 })
  }
}

// Violações de constraint
try {
  await env.DB.prepare('INSERT INTO users (email, name) VALUES (?, ?)').bind(email, name).run()
} catch (error) {
  if (error.message?.includes('UNIQUE constraint failed')) return new Response('Email exists', { status: 409 })
  throw error
}
```

## API REST (HTTP)

Acesse D1 de serviços externos (fora do Worker) usando a API Cloudflare.

```typescript
// Consulta única
const response = await fetch(
  `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/d1/database/${DATABASE_ID}/query`,
  {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${CLOUDFLARE_API_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      sql: 'SELECT * FROM users WHERE id = ?',
      params: [userId],
    }),
  },
)

const { result, success, errors } = await response.json()
// result: [{ results: [...], success: true, meta: {...} }]

// Batch via HTTP
const response = await fetch(
  `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/d1/database/${DATABASE_ID}/query`,
  {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${CLOUDFLARE_API_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify([
      { sql: 'SELECT * FROM users WHERE id = ?', params: [1] },
      { sql: 'SELECT * FROM posts WHERE author_id = ?', params: [1] },
    ]),
  },
)
```

**Casos de uso**: scripts server-side, migrations em CI/CD, ferramentas admin, integrações sem Worker

## Testes e debug

```typescript
// Vitest com unstable_dev
import { unstable_dev } from 'wrangler'
describe('D1', () => {
  let worker: Awaited<ReturnType<typeof unstable_dev>>
  beforeAll(async () => {
    worker = await unstable_dev('src/index.ts')
  })
  afterAll(async () => {
    await worker.stop()
  })
  it('queries users', async () => {
    expect((await worker.fetch('/users')).status).toBe(200)
  })
})

// Performance da query
const result = await env.DB.prepare('SELECT * FROM users').all()
console.log('Duration:', result.meta.duration, 'ms')

// Plano de execução
const plan = await env.DB.prepare('EXPLAIN QUERY PLAN SELECT * FROM users WHERE email = ?').bind(email).all()
```

```bash
# Inspecionar banco local
sqlite3 .wrangler/state/v3/d1/<database-id>.sqlite
.tables; .schema users; PRAGMA table_info(users);
```
