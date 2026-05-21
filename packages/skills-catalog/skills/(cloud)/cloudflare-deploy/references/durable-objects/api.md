# Durable Objects API

## Class Structure

```typescript
import { DurableObject } from 'cloudflare:workers'

export class MyDO extends DurableObject<Env> {
  constructor(ctx: DurableObjectState, env: Env) {
    super(ctx, env)
    // Runs on EVERY wake - keep light!
  }

  // RPC methods (called directly from worker)
  async myMethod(arg: string): Promise<string> {
    return arg
  }

  // fetch handler (legacy/HTTP semantics)
  async fetch(req: Request): Promise<Response> {
    /* ... */
  }

  // Lifecycle handlers
  async alarm() {
    /* alarm fired */
  }
  async webSocketMessage(ws: WebSocket, msg: string | ArrayBuffer) {
    /* ... */
  }
  async webSocketClose(ws: WebSocket, code: number, reason: string, wasClean: boolean) {
    /* ... */
  }
  async webSocketError(ws: WebSocket, error: unknown) {
    /* ... */
  }
}
```

## DurableObjectState Context Methods

### Concurrency Control

```typescript
// Complete work after response sent (e.g., cleanup, logging)
this.ctx.waitUntil(promise: Promise<any>): void

// Critical section - blocks all other requests until complete
await this.ctx.blockConcurrencyWhile(async () => {
  // No other requests processed during this block
  // Use for initialization or critical operations
})
```

**When to use:**

- `waitUntil()`: Background cleanup, logging, non-critical work after response
- `blockConcurrencyWhile()`: First-time init, schema migration, critical state setup

### Lifecycle

```typescript
this.ctx.id // DurableObjectId of this instance
this.ctx.abort() // Force eviction (use after PITR restore to reload state)
```

### Storage Access

```typescript
this.ctx.storage.sql // SQLite API (recommended)
this.ctx.storage.kv // Sync KV API (SQLite DOs only)
this.ctx.storage // Async KV API (legacy/KV-only DOs)
```

See **[DO Storage](../do-storage/README.md)** for complete storage API reference.

### WebSocket Management

```typescript
this.ctx.acceptWebSocket(ws: WebSocket, tags?: string[])  // Enable hibernation
this.ctx.getWebSockets(tag?: string): WebSocket[]         // Get by tag or all
this.ctx.getTags(ws: WebSocket): string[]                 // Get tags for connection
```

### Alarms

```typescript
await this.ctx.storage.setAlarm(timestamp: number | Date)  // Schedule (overwrites existing)
await this.ctx.storage.getAlarm(): number | null           // Get next alarm time
await this.ctx.storage.deleteAlarm(): void                 // Cancel alarm
```

**Limite:** 1 alarme por DO. Use o padrão de fila para vários eventos (consulte [Padrões](./patterns.md)).

##APIs de armazenamento

Para documentação detalhada de armazenamento, incluindo consultas SQLite, operações KV, transações e recuperação pontual, consulte **[DO Storage](../do-storage/README.md)**.

Referência rápida:```typescript
// SQLite (recommended)
this.ctx.storage.sql.exec('SELECT \* FROM users WHERE id = ?', userId).one()

// Sync KV (SQLite DOs only)
this.ctx.storage.kv.get('key')

// Async KV (legacy)
await this.ctx.storage.get('key')

````

## Alarms

Schedule future work that survives eviction:

```typescript
// Set alarm (overwrites any existing alarm)
await this.ctx.storage.setAlarm(Date.now() + 3600000)  // 1 hour from now
await this.ctx.storage.setAlarm(new Date("2026-02-01"))  // Absolute time

// Check next alarm
const nextRun = await this.ctx.storage.getAlarm()  // null if none

// Cancel alarm
await this.ctx.storage.deleteAlarm()

// Handler called when alarm fires
async alarm() {
  // Runs once alarm triggers
  // DO wakes from hibernation if needed
  // Use for cleanup, notifications, scheduled tasks
}
````

**Limitações:**

- 1 alarme por DO no máximo
- Substitui o alarme anterior quando definido
- Use o padrão de fila para vários eventos agendados (consulte [Padrões](./patterns.md))

**Confiabilidade:**

- Os alarmes sobrevivem ao despejo/reinicialização
- Cloudflare tenta novamente alarmes com falha automaticamente
- Não garantido exatamente uma vez (tratamento idempotente)

## Hibernação WebSocket

A hibernação permite que DOs com conexões WebSocket abertas consumam zero computação/memória até que a mensagem chegue.```typescript
async fetch(req: Request): Promise<Response> {
const [client, server] = Object.values(new WebSocketPair());
this.ctx.acceptWebSocket(server, ["room:123"]); // Tags for filtering
server.serializeAttachment({ userId: "abc" }); // Persisted metadata
return new Response(null, { status: 101, webSocket: client });
}

// Called when message arrives (DO wakes from hibernation)
async webSocketMessage(ws: WebSocket, msg: string | ArrayBuffer) {
const data = ws.deserializeAttachment(); // Retrieve metadata
for (const c of this.ctx.getWebSockets("room:123")) c.send(msg);
}

// Called on close (optional handler)
async webSocketClose(ws: WebSocket, code: number, reason: string, wasClean: boolean) {
// Cleanup logic, remove from lists, etc.
}

// Called on error (optional handler)
async webSocketError(ws: WebSocket, error: unknown) {
console.error("WebSocket error:", error);
// Handle error, close connection, etc.
}

````
**Conceitos principais:**

- **Auto-hibernação:** Hiberna quando não há solicitações/alarmes ativos
- **Custo zero:** DOs hibernados não geram cobranças enquanto preservam as conexões
- **Memória limpa:** Todo o estado da memória perdido na hibernação
- **Persistência de anexo:** Use `serializeAttachment()` para metadados por conexão que sobrevivem à hibernação
- **Tags para filtragem:** Agrupe conexões por sala/canal/usuário para transmissões direcionadas

**Ciclo de vida do manipulador:**

- `webSocketMessage`: DO acorda, processa a mensagem, pode hibernar após
- `webSocketClose`: Chamado quando o cliente fecha (opcional - implemente para limpeza)
- `webSocketError`: Chamado em caso de erro de conexão (opcional - implemente para tratamento de erros)

**Persistência de metadados:**

```typescript
// Store connection metadata (survives hibernation)
ws.serializeAttachment({ userId: 'abc', room: 'lobby' })

// Retrieve after hibernation
const { userId, room } = ws.deserializeAttachment()
````

## See Also

- **[DO Storage](../do-storage/README.md)** - Complete storage API reference
- **[Patterns](./patterns.md)** - Real-world usage patterns
- **[Gotchas](./gotchas.md)** - Hibernation caveats and limits
