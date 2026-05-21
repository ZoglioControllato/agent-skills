# Padrões e boas práticas D1

## Paginação

```typescript
async function getUsers({ page, pageSize }: { page: number; pageSize: number }, env: Env) {
  const offset = (page - 1) * pageSize
  const [countResult, dataResult] = await env.DB.batch([
    env.DB.prepare('SELECT COUNT(*) as total FROM users'),
    env.DB.prepare('SELECT * FROM users ORDER BY created_at DESC LIMIT ? OFFSET ?').bind(pageSize, offset),
  ])
  return {
    data: dataResult.results,
    total: countResult.results[0].total,
    page,
    pageSize,
    totalPages: Math.ceil(countResult.results[0].total / pageSize),
  }
}
```

##Consultas condicionais

```typescript
async function searchUsers(filters: { name?: string; email?: string; active?: boolean }, env: Env) {
  const conditions: string[] = [],
    params: (string | number | boolean | null)[] = []
  if (filters.name) {
    conditions.push('name LIKE ?')
    params.push(`%${filters.name}%`)
  }
  if (filters.email) {
    conditions.push('email = ?')
    params.push(filters.email)
  }
  if (filters.active !== undefined) {
    conditions.push('active = ?')
    params.push(filters.active ? 1 : 0)
  }
  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''
  return await env.DB.prepare(`SELECT * FROM users ${whereClause}`)
    .bind(...params)
    .all()
}
```

##Inserção em massa

```typescript
async function bulkInsertUsers(users: Array<{ name: string; email: string }>, env: Env) {
  const stmt = env.DB.prepare('INSERT INTO users (name, email) VALUES (?, ?)')
  const batch = users.map((user) => stmt.bind(user.name, user.email))
  return await env.DB.batch(batch)
}
```

##Cache com KV

```typescript
async function getCachedUser(userId: number, env: { DB: D1Database; CACHE: KVNamespace }) {
  const cacheKey = `user:${userId}`
  const cached = await env.CACHE?.get(cacheKey, 'json')
  if (cached) return cached
  const user = await env.DB.prepare('SELECT * FROM users WHERE id = ?').bind(userId).first()
  if (user) await env.CACHE?.put(cacheKey, JSON.stringify(user), { expirationTtl: 300 })
  return user
}
```

##Otimização de consultas

```typescript
// ✅ Índices no WHERE
const users = await env.DB.prepare('SELECT * FROM users WHERE email = ?').bind(email).all()

// ✅ Limite resultados
const recentPosts = await env.DB.prepare('SELECT * FROM posts ORDER BY created_at DESC LIMIT 100').all()

// ✅ batch() para várias queries independentes
const [user, posts, comments] = await env.DB.batch([
  env.DB.prepare('SELECT * FROM users WHERE id = ?').bind(userId),
  env.DB.prepare('SELECT * FROM posts WHERE user_id = ?').bind(userId),
  env.DB.prepare('SELECT * FROM comments WHERE user_id = ?').bind(userId),
])

// ❌ N+1
for (const post of posts) {
  const author = await env.DB.prepare('SELECT * FROM users WHERE id = ?').bind(post.user_id).first() // Ruim
}

// ✅ JOINs
const postsWithAuthors = await env.DB.prepare(
  `
  SELECT posts.*, users.name as author_name
  FROM posts
  JOIN users ON posts.user_id = users.id
`,
).all()
```

##SaaS multilocatário

```typescript
// Cada tenant com banco próprio
export default {
  async fetch(request: Request, env: { [key: `TENANT_${string}`]: D1Database }) {
    const tenantId = request.headers.get('X-Tenant-ID')
    const data = await env[`TENANT_${tenantId}`].prepare('SELECT * FROM records').all()
    return Response.json(data.results)
  },
}
```

##Armazenamento de sessão

```typescript
async function createSession(userId: number, token: string, env: Env) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
  return await env.DB.prepare('INSERT INTO sessions (user_id, token, expires_at) VALUES (?, ?, ?)')
    .bind(userId, token, expiresAt)
    .run()
}

async function validateSession(token: string, env: Env) {
  return await env.DB.prepare(
    'SELECT s.*, u.email FROM sessions s JOIN users u ON s.user_id = u.id WHERE s.token = ? AND s.expires_at > CURRENT_TIMESTAMP',
  )
    .bind(token)
    .first()
}
```

##Analytics/eventos

```typescript
async function logEvent(event: { type: string; userId?: number; metadata: object }, env: Env) {
  return await env.DB.prepare('INSERT INTO events (type, user_id, metadata) VALUES (?, ?, ?)')
    .bind(event.type, event.userId || null, JSON.stringify(event.metadata))
    .run()
}

async function getEventStats(startDate: string, endDate: string, env: Env) {
  return await env.DB.prepare(
    'SELECT type, COUNT(*) as count FROM events WHERE timestamp BETWEEN ? AND ? GROUP BY type ORDER BY count DESC',
  )
    .bind(startDate, endDate)
    .all()
}
```

## Replica de leitura padrão (pagos)

```typescript
interface Env {
  DB: D1Database
  DB_REPLICA: D1Database
}

export default {
  async fetch(request: Request, env: Env) {
    if (request.method === 'GET') {
      const users = await env.DB_REPLICA.prepare('SELECT * FROM users WHERE active = 1').all()
      return Response.json(users.results)
    }

    if (request.method === 'POST') {
      const { name, email } = await request.json()
      const result = await env.DB.prepare('INSERT INTO users (name, email) VALUES (?, ?)').bind(name, email).run()

      const user = await env.DB.prepare('SELECT * FROM users WHERE id = ?').bind(result.meta.last_row_id).first()
      return Response.json(user, { status: 201 })
    }
  },
}
```

**Réplicas**: dashboards analíticos, busca, consultas públicas (consistência eventual OK)  
**Primário**: leitura após escrita, finanças, autenticação (consistência obrigatória)

## API de Sessões Padrão (pagos)

```typescript
async function runMigration(env: Env) {
  const session = env.DB.withSession({ timeout: 600 })
  try {
    await session.prepare('CREATE INDEX idx_users_email ON users(email)').run()
    await session.prepare('CREATE INDEX idx_posts_user ON posts(user_id)').run()
    await session.prepare('ANALYZE').run()
  } finally {
    session.close()
  }
}

async function transformLargeDataset(env: Env) {
  const session = env.DB.withSession({ timeout: 900 })
  try {
    const BATCH_SIZE = 1000
    let offset = 0
    while (true) {
      const rows = await session.prepare('SELECT id, data FROM legacy LIMIT ? OFFSET ?').bind(BATCH_SIZE, offset).all()
      if (rows.results.length === 0) break
      const updates = rows.results.map((row) =>
        session.prepare('UPDATE legacy SET new_data = ? WHERE id = ?').bind(transform(row.data), row.id),
      )
      await session.batch(updates)
      offset += BATCH_SIZE
    }
  } finally {
    session.close()
  }
}
```

##Viagem no tempo e backups

```bash
wrangler d1 time-travel restore <db-name> --timestamp="2024-01-15T14:30:00Z"
wrangler d1 time-travel info <db-name>
wrangler d1 export <db-name> --remote --output=./backup.sql
wrangler d1 export <db-name> --remote --no-schema --output=./data.sql
wrangler d1 execute <db-name> --remote --file=./backup.sql
```
