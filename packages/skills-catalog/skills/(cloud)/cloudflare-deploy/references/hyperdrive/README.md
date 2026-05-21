# Hyperdrive

Acelera consultas ao banco a partir de Workers com pool de conexões, negociação na borda e cache de consultas.

## Recursos principais

- **Pool de conexões**: conexões persistentes eliminam handshakes TCP/TLS/autenticação (~7 idas e voltas)
- **Negociação na borda**: conexão negociada na edge, pooling perto da origem
- **Cache de consultas**: cache automático de consultas não mutáveis (TTL padrão 60s)
- **Suporte**: PostgreSQL, MySQL e compatíveis (CockroachDB, Timescale, PlanetScale, Neon, Supabase)

## Arquitetura

```
Worker → Edge (setup) → Pool (near DB) → Origin
         ↓ cached reads
         Cache
```

## Início rápido

```bash
# Create config
npx wrangler hyperdrive create my-db \
  --connection-string="postgres://user:pass@host:5432/db"

# wrangler.jsonc
{
  "compatibility_flags": ["nodejs_compat"],
  "hyperdrive": [{"binding": "HYPERDRIVE", "id": "<ID>"}]
}
```

```typescript
import { Client } from 'pg'

export default {
  async fetch(req: Request, env: Env): Promise<Response> {
    const client = new Client({
      connectionString: env.HYPERDRIVE.connectionString,
    })
    await client.connect()
    const result = await client.query('SELECT * FROM users WHERE id = $1', [123])
    await client.end()
    return Response.json(result.rows)
  },
}
```

## Quando usar

✅ Acesso global a bancos de região única, alta proporção de leituras, consultas populares, carga com muitas conexões  
❌ Muito escrita, dados em tempo real (menos de 1 s), apps de região única perto do banco

**💡 Combine com Smart Placement** para Workers que fazem várias consultas — executa perto do banco para reduzir latência.

## Escolha de driver

| Driver               | Use quando                                            | Notas                                                 |
| -------------------- | ----------------------------------------------------- | ----------------------------------------------------- |
| **pg** (recomendado) | Uso geral, TypeScript, compatibilidade do ecossistema | Estável, muito usado, funciona com a maioria dos ORMs |
| **postgres.js**      | Recursos avançados, template literals, streaming      | Mais leve que pg, `prepare: true` é o padrão          |
| **mysql2**           | MySQL/MariaDB/PlanetScale                             | Só MySQL, suporte menos maduro                        |

## Ordem de leitura

| Novo no Hyperdrive                        | Implementando                             | Solução de problemas            |
| ----------------------------------------- | ----------------------------------------- | ------------------------------- |
| 1. README (este)                          | 1. [configuration.md](./configuration.md) | 1. [gotchas.md](./gotchas.md)   |
| 2. [configuration.md](./configuration.md) | 2. [api.md](./api.md)                     | 2. [patterns.md](./patterns.md) |
| 3. [api.md](./api.md)                     | 3. [patterns.md](./patterns.md)           | 3. [api.md](./api.md)           |

## Nesta referência

- [configuration.md](./configuration.md) — Configuração, wrangler, Smart Placement
- [api.md](./api.md) — APIs do binding, padrões de consulta, uso de drivers
- [patterns.md](./patterns.md) — Casos de uso, ORMs, otimização com várias consultas
- [gotchas.md](./gotchas.md) — Limites, solução de problemas, gestão de conexões

## Ver também

- [smart-placement](../smart-placement/) — Otimizar Workers com várias consultas perto dos bancos
- [d1](../d1/) — Alternativa SQLite serverless para apps nativas da edge
- [workers](../workers/) — Runtime Worker com bindings de banco

Documentação localizada no ecossistema mantido pelo Controllato Club.
