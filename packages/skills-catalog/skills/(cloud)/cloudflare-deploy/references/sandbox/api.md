# Referência de API

## Execução de Comando

```typescript
// Basic
const result = await sandbox.exec('python3 script.py')
// Returns: { stdout, stderr, exitCode, success, duration }

// With options
await sandbox.exec('python3 test.py', {
  cwd: '/workspace/project',
  env: { API_KEY: 'secret' },
  stream: true,
  onOutput: (stream, data) => console.log(data),
})
```

##Operações de arquivo

```typescript
// Read/Write
const { content } = await sandbox.readFile('/workspace/data.txt')
await sandbox.writeFile('/workspace/file.txt', 'content') // Auto-creates dirs

// List/Delete
const files = await sandbox.listFiles('/workspace')
await sandbox.deleteFile('/workspace/temp.txt')
await sandbox.deleteFile('/workspace/dir', { recursive: true })

// Utils
await sandbox.mkdir('/workspace/dir', { recursive: true })
await sandbox.pathExists('/workspace/file.txt')
```

##Processos em segundo plano

```typescript
// Start
const process = await sandbox.startProcess('python3 -m http.server 8080', {
  processId: 'web-server',
  cwd: '/workspace/public',
  env: { PORT: '8080' },
})
// Returns: { id, pid, command }

// Wait for readiness
await process.waitForPort(8080) // Wait for port to listen
await process.waitForLog(/Server running/) // Wait for log pattern
await process.waitForExit() // Wait for completion

// Management
const processes = await sandbox.listProcesses()
const info = await sandbox.getProcess('web-server')
await sandbox.stopProcess('web-server')
const logs = await sandbox.getProcessLogs('web-server')
```

##Exposição Portuária

```typescript
// Expose port
const { url } = await sandbox.exposePort(8080, {
  name: 'web-app',
  hostname: request.hostname,
})

// Management
await sandbox.isPortExposed(8080)
await sandbox.getExposedPorts(request.hostname)
await sandbox.unexposePort(8080)
```

##Sessões (contextos isolados)

Cada sessão mantém seu próprio estado de shell, env vars, cwd, namespace de processo.

```typescript
// Create with context
const session = await sandbox.createSession({
  id: 'user-123',
  cwd: '/workspace/user123',
  env: { USER_ID: '123' },
})

// Use (full sandbox API)
await session.exec('echo $USER_ID')
await session.writeFile('config.txt', 'data')

// Manage
await sandbox.getSession('user-123')
await sandbox.deleteSession('user-123')
```

##Intérprete de código

```typescript
// Create context with variables
const ctx = await sandbox.createCodeContext({
  language: 'python',
  variables: {
    data: [1, 2, 3, 4, 5],
    config: { verbose: true },
  },
})

// Execute code with rich outputs
const result = await ctx.runCode(`
import matplotlib.pyplot as plt
plt.plot(data, [x**2 for x in data])
plt.savefig('plot.png')
print(f"Processed {len(data)} points")
`)
// Returns: { outputs: [{ type: 'text'|'image'|'html', content }], error }

// Context persists variables across runs
const result2 = await ctx.runCode('print(data[0])') // Still has 'data'
```

##Conexões WebSocket

```typescript
// Proxy WebSocket to sandbox service
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const proxyResponse = await proxyToSandbox(request, env)
    if (proxyResponse) return proxyResponse

    if (request.headers.get('Upgrade')?.toLowerCase() === 'websocket') {
      const sandbox = getSandbox(env.Sandbox, 'realtime')
      return await sandbox.wsConnect(request, 8080)
    }

    return new Response('Not a WebSocket request', { status: 400 })
  },
}
```

##Montagem em balde (armazenamento S3)

```typescript
// Mount R2 bucket (production only, not wrangler dev)
await sandbox.mountBucket(env.DATA_BUCKET, '/data', {
  readOnly: false,
})

// Access files in mounted bucket
await sandbox.exec('ls /data')
await sandbox.writeFile('/data/output.txt', 'result')

// Unmount
await sandbox.unmountBucket('/data')
```

**Observação**: A montagem do balde funciona apenas na produção. Os buckets montados têm escopo de sandbox (visíveis para todas as sessões nesse sandbox).

## Gerenciamento do ciclo de vida

````typescript
// Terminate container immediately
await sandbox.destroy()

// REQUIRED when using keepAlive: true
const sandbox = getSandbox(env.Sandbox, 'temp', { keepAlive: true })
try {
  await sandbox.writeFile('/tmp/code.py', code)
  const result = await sandbox.exec('python /tmp/code.py')
  return result.stdout
} finally {
  await sandbox.destroy() // Free resources
}
```Exclui: arquivos, processos, sessões, conexões de rede, portas expostas.

## Tratamento de erros
```typescript
// Command errors
const result = await sandbox.exec('python3 invalid.py')
if (!result.success) {
  console.error('Exit code:', result.exitCode)
  console.error('Stderr:', result.stderr)
}

// SDK errors
try {
  await sandbox.readFile('/nonexistent')
} catch (error) {
  if (error.code === 'FILE_NOT_FOUND') {
    /* ... */
  } else if (error.code === 'CONTAINER_NOT_READY') {
    /* retry */
  } else if (error.code === 'TIMEOUT') {
    /* ... */
  }
}

// Retry pattern (see gotchas.md for full implementation)
````
