# Padrões de objetos duráveis

## Quando usar qual padrão

| Necessidade                   | Padrão                   | Estratégia de identificação |
| ----------------------------- | ------------------------ | --------------------------- |
| Limite de taxa por usuário/IP | Limitação de taxa        | `idFromName(identificador)` |
| Exclusão mútua                | Bloqueio Distribuído     | `idFromName(recurso)`       |
| >1K req/s de rendimento       | Fragmentação             | `newUniqueId()` ou hash     |
| Atualizações em tempo real    | Colaboração WebSocket    | `idFromName(sala)`          |
| Sessões de usuário            | Gerenciamento de sessões | `idFromName(sessionId)`     |
| Limpeza de fundo              | Baseado em alarme        | Qualquer                    |

## RPC vs busca()

**RPC** (compatibilidade ≥2024-04-03): Tipo seguro, mais simples, padrão para novos projetos
**fetch()**: compatibilidade legada, semântica HTTP, proxy```typescript
const count = await stub.increment() // RPC
const count = await (await stub.fetch(req)).json() // fetch()

````

## Sharding (High Throughput)

Single DO ~1K req/s max. Shard for higher throughput:

```typescript
export default {
  async fetch(req: Request, env: Env): Promise<Response> {
    const userId = new URL(req.url).searchParams.get('user')
    const hash = hashCode(userId) % 100 // 100 shards
    const id = env.COUNTER.idFromName(`shard:${hash}`)
    return env.COUNTER.get(id).fetch(req)
  },
}

function hashCode(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) hash = (hash << 5) - hash + str.charCodeAt(i)
  return Math.abs(hash)
}
````

**Decisões:**

- **Contagem de fragmentos**: 10-1000 típico (comece com 100, meça, ajuste)
- **Chave de fragmento**: ID do usuário, IP, sessão - deve ser distribuído uniformemente (usar hash)
- **Agregação**: Coordenador DO ou sistema externo (D1, R2)

## Limitação de taxa```typescript

async checkLimit(key: string, limit: number, windowMs: number): Promise<boolean> {
const req = this.ctx.storage.sql.exec("SELECT COUNT(\*) as count FROM requests WHERE key = ? AND timestamp > ?", key, Date.now() - windowMs).one();
if (req.count >= limit) return false;
this.ctx.storage.sql.exec("INSERT INTO requests (key, timestamp) VALUES (?, ?)", key, Date.now());
return true;
}

````

## Distributed Lock

```typescript
private held = false;
async acquire(timeoutMs = 5000): Promise<boolean> {
  if (this.held) return false;
  this.held = true;
  await this.ctx.storage.setAlarm(Date.now() + timeoutMs);
  return true;
}
async release() { this.held = false; await this.ctx.storage.deleteAlarm(); }
async alarm() { this.held = false; }  // Auto-release on timeout
````

## Hibernation-Aware Pattern

Preserve state across hibernation:

```typescript
async fetch(req: Request): Promise<Response> {
  const [client, server] = Object.values(new WebSocketPair());
  const userId = new URL(req.url).searchParams.get("user");
  server.serializeAttachment({ userId });  // Survives hibernation
  this.ctx.acceptWebSocket(server, ["room:lobby"]);
  server.send(JSON.stringify({ type: "init", state: this.ctx.storage.kv.get("state") }));
  return new Response(null, { status: 101, webSocket: client });
}

async webSocketMessage(ws: WebSocket, msg: string) {
  const { userId } = ws.deserializeAttachment();  // Retrieve after wake
  const state = this.ctx.storage.kv.get("state") || {};
  state[userId] = JSON.parse(msg);
  this.ctx.storage.kv.put("state", state);
  for (const c of this.ctx.getWebSockets("room:lobby")) c.send(msg);
}
```

## Real-time Collaboration

Broadcast updates to all connected clients:

```typescript
async webSocketMessage(ws: WebSocket, msg: string) {
  const data = JSON.parse(msg);
  this.ctx.storage.kv.put("doc", data.content);  // Persist
  for (const c of this.ctx.getWebSockets()) if (c !== ws) c.send(msg);  // Broadcast
}
```

### WebSocket Reconnection

**Client-side** (exponential backoff):

```typescript
class ResilientWS {
  private delay = 1000
  connect(url: string) {
    const ws = new WebSocket(url)
    ws.onclose = () =>
      setTimeout(() => {
        this.connect(url)
        this.delay = Math.min(this.delay * 2, 30000)
      }, this.delay)
  }
}
```

**Server-side** (cleanup on close):

```typescript
async webSocketClose(ws: WebSocket, code: number, reason: string, wasClean: boolean) {
  const { userId } = ws.deserializeAttachment();
  this.ctx.storage.sql.exec("UPDATE users SET online = false WHERE id = ?", userId);
  for (const c of this.ctx.getWebSockets()) c.send(JSON.stringify({ type: "user_left", userId }));
}
```

## Session Management

```typescript
async createSession(userId: string, data: object): Promise<string> {
  const id = crypto.randomUUID(), exp = Date.now() + 86400000;
  this.ctx.storage.sql.exec("INSERT INTO sessions VALUES (?, ?, ?, ?)", id, userId, JSON.stringify(data), exp);
  await this.ctx.storage.setAlarm(exp);
  return id;
}

async getSession(id: string): Promise<object | null> {
  const row = this.ctx.storage.sql.exec("SELECT data FROM sessions WHERE id = ? AND expires_at > ?", id, Date.now()).one();
  return row ? JSON.parse(row.data) : null;
}

async alarm() { this.ctx.storage.sql.exec("DELETE FROM sessions WHERE expires_at <= ?", Date.now()); }
```

## Multiple Events (Single Alarm)

Queue pattern to schedule multiple events:

```typescript
async scheduleEvent(id: string, runAt: number) {
  await this.ctx.storage.put(`event:${id}`, { id, runAt });
  const curr = await this.ctx.storage.getAlarm();
  if (!curr || runAt < curr) await this.ctx.storage.setAlarm(runAt);
}

async alarm() {
  const events = await this.ctx.storage.list({ prefix: "event:" }), now = Date.now();
  let next = null;
  for (const [key, ev] of events) {
    if (ev.runAt <= now) {
      await this.processEvent(ev);
      await this.ctx.storage.delete(key);
    } else if (!next || ev.runAt < next) next = ev.runAt;
  }
  if (next) await this.ctx.storage.setAlarm(next);
}
```

## Graceful Cleanup

Use `ctx.waitUntil()` to complete work after response:

```typescript
async myMethod() {
  const response = { success: true };
  this.ctx.waitUntil(this.ctx.storage.sql.exec("DELETE FROM old_data WHERE timestamp < ?", cutoff));
  return response;
}
```

## Melhores práticas

- **Design**: Use `idFromName()` para coordenação, `newUniqueId()` para fragmentação, minimizando o trabalho do construtor
- **Armazenamento**: Prefira SQLite, lote com transações, defina alarmes para limpeza, use PITR antes de operações arriscadas
- **Desempenho**: ~1K req/s por DO máx. - fragmento para mais, cache na memória, use alarmes para trabalho adiado
- **Confiabilidade**: Lidar com 503 com nova tentativa+backoff, design para partidas a frio, testar migrações com `--dry-run`
- **Segurança**: Validar entradas em Trabalhadores, limite de taxa de criação de DO, usar jurisdição para conformidade

## Veja também

- **[API](./api.md)** - métodos ctx, manipuladores WebSocket
- **[Gotchas](./gotchas.md)** - Advertências sobre hibernação, erros comuns
- **[DO Storage](../do-storage/README.md)** - Padrões de armazenamento e transações
