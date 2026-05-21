## Padrões de roteamento

### Afinidade de sessão (com estado)

```typescript
export class SessionBackend extends Container {
  defaultPort = 3000
  sleepAfter = '30m'
}

export default {
  async fetch(request: Request, env: Env) {
    const sessionId = request.headers.get('X-Session-ID') || crypto.randomUUID()
    const container = env.SESSION_BACKEND.getByName(sessionId)
    await container.startAndWaitForPorts()
    return container.fetch(request)
  },
}
```

**Uso:** sessões de usuário, WebSocket, jogos com estado, cache por usuário.

### Balanceamento de carga (sem estado)

```typescript
export default {
  async fetch(request: Request, env: Env) {
    const container = env.STATELESS_API.getRandom()
    await container.startAndWaitForPorts()
    return container.fetch(request)
  },
}
```

**Uso:** APIs HTTP sem estado, trabalho com uso intensivo de CPU, consultas somente leitura.

### Padrão Singleton

```typescript
export default {
  async fetch(request: Request, env: Env) {
    const container = env.GLOBAL_SERVICE.getByName('singleton')
    await container.startAndWaitForPorts()
    return container.fetch(request)
  },
}
```

**Uso:** Cache global, coordenador centralizado, fonte única de verdade.

## Encaminhamento WebSocket

```typescript
export default {
  async fetch(request: Request, env: Env) {
    if (request.headers.get('Upgrade') === 'websocket') {
      const sessionId = request.headers.get('X-Session-ID') || crypto.randomUUID()
      const container = env.WS_BACKEND.getByName(sessionId)
      await container.startAndWaitForPorts()

      // ⚠️ MUST use fetch(), not containerFetch()
      return container.fetch(request)
    }
    return new Response('Not a WebSocket request', { status: 400 })
  },
}
```

**⚠️ Crítico:** Sempre use `fetch()` para WebSocket.

## Desligamento Gracioso

```typescript
export class GracefulContainer extends Container {
  private connections = new Set<WebSocket>()

  onStop() {
    // SIGTERM received, 15 minutes until SIGKILL
    for (const ws of this.connections) {
      ws.close(1001, 'Server shutting down')
    }
    this.ctx.storage.put('shutdown-time', Date.now())
  }

  onActivityExpired(): boolean {
    return this.connections.size > 0 // Keep alive if connections
  }
}
```

##Tratamento de solicitações simultâneas

```typescript
export class SafeContainer extends Container {
  private initialized = false

  async fetch(request: Request) {
    await this.ctx.blockConcurrencyWhile(async () => {
      if (!this.initialized) {
        await this.startAndWaitForPorts()
        this.initialized = true
      }
    })
    return super.fetch(request)
  }
}
```

**Uso:** Inicialização única, evitando inicialização simultânea.

## Renovação do tempo limite da atividade

```typescript
export class LongRunningContainer extends Container {
  sleepAfter = '5m'

  async processLongJob(data: unknown) {
    const interval = setInterval(() => {
      this.ctx.storage.put('keepalive', Date.now())
    }, 60000)

    try {
      await this.doLongWork(data)
    } finally {
      clearInterval(interval)
    }
  }
}
```

**Uso:** Operações longas que excedem `sleepAfter`.

## Roteamento de múltiplas portas

```typescript
export class MultiPortContainer extends Container {
  requiredPorts = [8080, 8081, 9090]

  async fetch(request: Request) {
    const path = new URL(request.url).pathname
    if (path.startsWith('/grpc')) this.switchPort(8081)
    else if (path.startsWith('/metrics')) this.switchPort(9090)
    return super.fetch(request)
  }
}
```

**Uso:** serviços multiprotocolo (HTTP + gRPC), endpoints de métricas separados.

## Integração de fluxo de trabalho

```typescript
import { WorkflowEntrypoint } from 'cloudflare:workers'

export class ProcessingWorkflow extends WorkflowEntrypoint {
  async run(event, step) {
    const container = this.env.PROCESSOR.getByName(event.payload.jobId)

    await step.do('start', async () => {
      await container.startAndWaitForPorts()
    })

    const result = await step.do('process', async () => {
      return container
        .fetch('/process', {
          method: 'POST',
          body: JSON.stringify(event.payload.data),
        })
        .then((r) => r.json())
    })

    return result
  }
}
```

**Uso:** orquestração de operações de contêiner em várias etapas, execução durável.

## Integração do Consumidor de Fila

```typescript
export default {
  async queue(batch, env) {
    for (const msg of batch.messages) {
      try {
        const container = env.PROCESSOR.getByName(msg.body.jobId)
        await container.startAndWaitForPorts()

        const response = await container.fetch('/process', {
          method: 'POST',
          body: JSON.stringify(msg.body),
        })

        response.ok ? msg.ack() : msg.retry()
      } catch (err) {
        console.error('Queue processing error:', err)
        msg.retry()
      }
    }
  },
}
```

**Uso:** Processamento de trabalho assíncrono, operações em lote, execução orientada a eventos.
