# Configuração D1

## Setup wrangler.jsonc

```jsonc
{
  "name": "your-worker-name",
  "main": "src/index.ts",
  "compatibility_date": "2025-01-01", // Data atual em projetos novos
  "d1_databases": [
    {
      "binding": "DB", // Nome da variável de ambiente
      "database_name": "your-db-name", // Nome legível
      "database_id": "your-database-id", // UUID do dashboard/CLI
      "migrations_dir": "migrations", // Opcional: padrão "migrations"
    },
    // Réplica de leitura (só planos pagos)
    {
      "binding": "DB_REPLICA",
      "database_name": "your-db-name",
      "database_id": "your-database-id", // Mesmo ID, binding diferente
    },
    // Múltiplos bancos
    {
      "binding": "ANALYTICS_DB",
      "database_name": "analytics-db",
      "database_id": "yyy-yyy-yyy",
    },
  ],
}
```

## Tipos TypeScript

```typescript
interface Env {
  DB: D1Database
  ANALYTICS_DB?: D1Database
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const result = await env.DB.prepare('SELECT * FROM users').all()
    return Response.json(result.results)
  },
}
```

## Migrations

Estrutura: `migrations/0001_initial_schema.sql`, `0002_add_posts.sql`, etc.

### Exemplo de migration

```sql
-- migrations/0001_initial_schema.sql
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);

CREATE TABLE IF NOT EXISTS posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  content TEXT,
  published BOOLEAN DEFAULT 0,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_posts_user_id ON posts(user_id);
CREATE INDEX idx_posts_published ON posts(published);
```

### Executar migrations

```bash
# Criar novo arquivo de migration
wrangler d1 migrations create <db-name> add_users_table
# Cria: migrations/0001_add_users_table.sql

# Aplicar migrations
wrangler d1 migrations apply <db-name> --local     # Banco local
wrangler d1 migrations apply <db-name> --remote    # Produção

# Listar aplicadas
wrangler d1 migrations list <db-name> --remote

# SQL direto (sem rastreamento de migration)
wrangler d1 execute <db-name> --remote --command="SELECT * FROM users"
wrangler d1 execute <db-name> --local --file=./schema.sql
```

**Rastreamento**: o Wrangler cria a tabela `d1_migrations` automaticamente

## Estratégia de índices

```sql
-- Colunas frequentemente consultadas
CREATE INDEX idx_users_email ON users(email);

-- Índices compostos
CREATE INDEX idx_posts_user_published ON posts(user_id, published);

-- Covering indexes
CREATE INDEX idx_users_email_name ON users(email, name);

-- Índices parciais
CREATE INDEX idx_active_users ON users(email) WHERE active = 1;

-- Ver se a query usa índice
EXPLAIN QUERY PLAN SELECT * FROM users WHERE email = ?;
```

## Drizzle ORM

```typescript
// drizzle.config.ts
export default {
  schema: './src/schema.ts',
  out: './migrations',
  dialect: 'sqlite',
  driver: 'd1-http',
  dbCredentials: {
    accountId: process.env.CLOUDFLARE_ACCOUNT_ID!,
    databaseId: process.env.D1_DATABASE_ID!,
    token: process.env.CLOUDFLARE_API_TOKEN!,
  },
} satisfies Config

// schema.ts
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'
export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
})

// worker.ts
import { drizzle } from 'drizzle-orm/d1'
import { users } from './schema'
export default {
  async fetch(request: Request, env: Env) {
    const db = drizzle(env.DB)
    return Response.json(await db.select().from(users))
  },
}
```

## Import e export

```bash
# Export completo (schema + dados)
wrangler d1 export <db-name> --remote --output=./backup.sql

# Só dados (sem schema)
wrangler d1 export <db-name> --remote --no-schema --output=./data-only.sql

# Export com FK preservadas
# (Padrão: FK desabilitadas no export para compatibilidade de import)

# Importar SQL
wrangler d1 execute <db-name> --remote --file=./backup.sql

# Limitações
# - BLOB pode não exportar bem (use R2 para binários)
# - Exports muito grandes (>1GB) podem dar timeout (divida em partes)
# - Import NÃO é atômico (use batch() no Worker para imports transacionais)
```

## Níveis de plano

| Recurso      | Free             | Pago              |
| ------------ | ---------------- | ----------------- |
| Tamanho DB   | 500 MB           | 10 GB             |
| Batch        | 1.000 statements | 10.000 statements |
| Time Travel  | 7 dias           | 30 dias           |
| Réplicas     | ❌               | ✅                |
| Sessions API | ❌               | ✅ (até 15 min)   |
| Precificação | Grátis           | US$ 5/mês + uso   |

**Uso** (pagos): US$ 0,001 por 1K reads + US$ 1 por 1M writes + US$ 0,75/GB/mês

## Desenvolvimento local

```bash
wrangler dev --persist-to=./.wrangler/state  # Persiste entre reinícios
# DB local: .wrangler/state/v3/d1/<database-id>.sqlite
sqlite3 .wrangler/state/v3/d1/<database-id>.sqlite  # Inspecionar

# Dev local usa limites do free por padrão
```
