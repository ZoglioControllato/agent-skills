# Padrões e boas práticas KV

## Cache em múltiplas camadas

```typescript
const memoryCache = new Map<string, { data: any; expires: number }>()

async function getCached(env: Env, key: string): Promise<any> {
  const now = Date.now()

  const cached = memoryCache.get(key)
  if (cached && cached.expires > now) {
    return cached.data
  }

  const kvValue = await env.CACHE.get(key, 'json')
  if (kvValue) {
    memoryCache.set(key, { data: kvValue, expires: now + 60000 })
    return kvValue
  }

  const origin = await fetch(`https://api.example.com/${key}`).then((r) => r.json())

  await env.CACHE.put(key, JSON.stringify(origin), { expirationTtl: 300 })
  memoryCache.set(key, { data: origin, expires: now + 60000 })

  return origin
}
```

##Cache de resposta da API

```typescript
async function getCachedData(env: Env, key: string, fetcher: () => Promise<any>): Promise<any> {
  const cached = await env.MY_KV.get(key, 'json')
  if (cached) return cached

  const data = await fetcher()
  await env.MY_KV.put(key, JSON.stringify(data), { expirationTtl: 300 })
  return data
}

const apiData = await getCachedData(env, 'cache:users', () =>
  fetch('https://api.example.com/users').then((r) => r.json()),
)
```

##Gerenciamento de sessão

```typescript
interface Session {
  userId: string
  expiresAt: number
}

async function createSession(env: Env, userId: string): Promise<string> {
  const sessionId = crypto.randomUUID()
  const expiresAt = Date.now() + 24 * 60 * 60 * 1000

  await env.SESSIONS.put(`session:${sessionId}`, JSON.stringify({ userId, expiresAt }), {
    expirationTtl: 86400,
    metadata: { createdAt: Date.now() },
  })

  return sessionId
}

async function getSession(env: Env, sessionId: string): Promise<Session | null> {
  const data = await env.SESSIONS.get<Session>(`session:${sessionId}`, 'json')
  if (!data || data.expiresAt < Date.now()) return null
  return data
}
```

## Coalescer chaves frias

```typescript
await env.USERS.put(
  'user:123:profile',
  JSON.stringify({
    name: 'John',
    email: 'john@example.com',
    role: 'admin',
  }),
)
```

##Namespace por prefixo

```typescript
const PREFIXES = {
  users: 'user:',
  sessions: 'session:',
  cache: 'cache:',
  features: 'feature:',
} as const

async function setUser(env: Env, id: string, data: any) {
  await env.KV.put(`${PREFIXES.users}${id}`, JSON.stringify(data))
}

async function getUser(env: Env, id: string) {
  return await env.KV.get(`${PREFIXES.users}${id}`, 'json')
}

async function listUserIds(env: Env): Promise<string[]> {
  const result = await env.KV.list({ prefix: PREFIXES.users })
  return result.keys.map((k) => k.name.replace(PREFIXES.users, ''))
}
```

##Versionamento com metadados

```typescript
interface VersionedData {
  version: number
  data: any
}

async function migrateIfNeeded(env: Env, key: string) {
  const result = await env.DATA.getWithMetadata(key, 'json')

  if (!result.value) return null

  const currentVersion = result.metadata?.version || 1
  const targetVersion = 2

  if (currentVersion < targetVersion) {
    const migrated = migrate(result.value, currentVersion, targetVersion)

    await env.DATA.put(key, JSON.stringify(migrated), {
      metadata: { version: targetVersion, migratedAt: Date.now() },
    })

    return migrated
  }

  return result.value
}

function migrate(data: any, from: number, to: number): any {
  if (from === 1 && to === 2) {
    return { ...data, userName: data.name }
  }
  return data
}
```

## Padrão resiliente get

```typescript
async function resilientGet<T>(env: Env, key: string, fallback: T): Promise<T> {
  try {
    const value = await env.KV.get<T>(key, 'json')
    return value ?? fallback
  } catch (err) {
    console.error(`KV error for ${key}:`, err)
    return fallback
  }
}

const config = await resilientGet(env, 'config:app', {
  theme: 'light',
  maxItems: 10,
})
```
