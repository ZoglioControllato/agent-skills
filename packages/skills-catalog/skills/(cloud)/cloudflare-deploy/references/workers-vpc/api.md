# TCP Sockets API Reference

Complete API reference for the Cloudflare Workers TCP Sockets API (`cloudflare:sockets`).

## Core Function: `connect()`

```typescript
function connect(address: SocketAddress, options?: SocketOptions): Socket
```

Creates an outbound TCP connection to the specified address.

### Parameters

#### `SocketAddress`

```typescript
interface SocketAddress {
  hostname: string // DNS hostname or IP address
  port: number // TCP port (1-65535, excluding blocked ports)
}
```

| Field      | Type     | Description           | Example                            |
| ---------- | -------- | --------------------- | ---------------------------------- |
| `hostname` | `string` | Target hostname or IP | `"db.internal.net"`, `"10.0.1.50"` |
| `port`     | `number` | TCP port number       | `5432`, `443`, `22`                |

DNS names are resolved at connection time. IPv4, IPv6, and private IPs (10.x, 172.16.x, 192.168.x) supported.

#### `SocketOptions`

```typescript
interface SocketOptions {
  secureTransport?: 'off' | 'on' | 'starttls'
  allowHalfOpen?: boolean
}
```

| Campo               | Tipo                                    | Padrão        | Descrição                      |
| ------------------- | --------------------------------------- | ------------- | ------------------------------ |
| `transporte seguro` | `"desligado" \| "ligado" \| "starttls"` | `"desligado"` | Modo TLS                       |
| `allowHalfOpen`     | `booleano`                              | `falso`       | Permitir conexões semifechadas |

**Modos `secureTransport`:**

| Modo          | Comportamento                                        | Caso de uso                          |
| ------------- | ---------------------------------------------------- | ------------------------------------ |
| `"desligado"` | TCP simples, sem criptografia                        | Testes, redes internas confiáveis ​​ |
| `"ligado"`    | Aperto de mão TLS imediato                           | HTTPS, bancos de dados seguros, SSH  |
| `"starttls"`  | Comece simples, atualize mais tarde com `startTls()` | Postgres, SMTP, IMAP                 |

**`allowHalfOpen`:** Quando `false` (padrão), fechar o fluxo de leitura fecha automaticamente o fluxo de gravação. Quando `true`, os fluxos são independentes.

### Devoluções

Um objeto `Socket` com fluxos legíveis/graváveis.

##Interface de soquete```typescript
interface Socket {
// Streams
readable: ReadableStream<Uint8Array>
writable: WritableStream<Uint8Array>

// Connection state
opened: Promise<SocketInfo>
closed: Promise<void>

// Methods
close(): Promise<void>
startTls(): Socket
}

````
### Propriedades

#### `legível: ReadableStream<Uint8Array>`

Stream para leitura de dados do soquete. Use `getReader()` para consumir dados.```typescript
const reader = socket.readable.getReader()
const { done, value } = await reader.read() // Read one chunk
````

#### `gravável: WritableStream<Uint8Array>`

Stream para gravar dados no soquete. Use `getWriter()` para enviar dados.```typescript
const writer = socket.writable.getWriter()
await writer.write(new TextEncoder().encode('HELLO\r\n'))
await writer.close()

````

#### `opened: Promise<SocketInfo>`

Promise that resolves when connection succeeds, rejects on failure.

```typescript
interface SocketInfo {
  remoteAddress?: string // May be undefined
  localAddress?: string // May be undefined
}

try {
  const info = await socket.opened
} catch (error) {
  // Connection failed
}
````

#### `fechado: Promessa<void>`

Promessa que resolve quando o soquete está totalmente fechado (ambas as direções).

### Métodos

#### `close(): Promessa<void>`

Fecha o soquete normalmente, aguardando a conclusão das gravações pendentes.```typescript
const socket = connect({ hostname: 'api.internal', port: 443 })
try {
// Use socket
} finally {
await socket.close() // Always call in finally block
}

````

#### `startTls(): Socket`

Upgrades connection to TLS. Only available when `secureTransport: "starttls"` was specified.

```typescript
const socket = connect({ hostname: 'db.internal', port: 5432 }, { secureTransport: 'starttls' })

// Send protocol-specific StartTLS command
const writer = socket.writable.getWriter()
await writer.write(new TextEncoder().encode('STARTTLS\r\n'))

// Upgrade to TLS - use returned socket, not original
const secureSocket = socket.startTls()
const secureWriter = secureSocket.writable.getWriter()
````

## Complete Example

```typescript
import { connect } from 'cloudflare:sockets'

export default {
  async fetch(req: Request): Promise<Response> {
    const socket = connect({ hostname: 'echo.example.com', port: 7 }, { secureTransport: 'on' })

    try {
      await socket.opened

      const writer = socket.writable.getWriter()
      await writer.write(new TextEncoder().encode('Hello, TCP!\n'))
      await writer.close()

      const reader = socket.readable.getReader()
      const { value } = await reader.read()

      return new Response(value)
    } finally {
      await socket.close()
    }
  },
}
```

Consulte [patterns.md](./patterns.md) para leitura de vários blocos, tratamento de erros e implementações de protocolo.

## Referência rápida

| Tarefa              | Código                                                       |
| ------------------- | ------------------------------------------------------------ |
| Importar            | `importar {conectar} de 'cloudflare:sockets';`               |
| Conectar            | `connect({ nome do host: "host", porta: 443 })`              |
| Com TLS             | `connect(addr, { secureTransport: "on" })`                   |
| IniciarTLS          | `socket.startTls()` após handshake                           |
| Escreva             | `aguardar escritor.write (dados); aguarde escritor.close();` |
| Leia                | `const { valor } = aguarda leitor.read();`                   |
| Tratamento de erros | `tente {aguarde socket.opened; } capturar { }`               |
| Sempre perto        | `tente { } finalmente {aguarde socket.close(); }`            |

## Veja também

- [patterns.md](./patterns.md) - Implementações de protocolo do mundo real
- [configuration.md](./configuration.md) - Configuração do Wrangler e variáveis de ambiente
- [gotchas.md](./gotchas.md) - Limites e tratamento de erros
