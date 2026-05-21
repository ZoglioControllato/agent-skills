# API programática do Wrangler

APIs Node.js para testes e desenvolvimento.

## startWorker (Testes)

Inicia o Worker com bindings locais reais para testes de integração. API estável (substitui `unstable_startWorker`).

```typescript
import { startWorker } from 'wrangler'
import { describe, it, before, after } from 'node:test'
import assert from 'node:assert'

describe('worker', () => {
  let worker

  before(async () => {
    worker = await startWorker({
      config: 'wrangler.jsonc',
      environment: 'development',
    })
  })

  after(async () => {
    await worker.dispose()
  })

  it('responds with 200', async () => {
    const response = await worker.fetch('http://example.com')
    assert.strictEqual(response.status, 200)
  })
})
```

### Opções

| Opção         | Tipo                          | Descrição                                                                                 |
| ------------- | ----------------------------- | ----------------------------------------------------------------------------------------- |
| `config`      | `string`                      | Caminho para wrangler.jsonc                                                               |
| `environment` | `string`                      | Nome do ambiente no config                                                                |
| `persist`     | `boolean \| { path: string }` | Ativa estado persistente                                                                  |
| `bundle`      | `boolean`                     | Ativa bundling (padrão: true)                                                             |
| `remote`      | `false \| true \| "minimal"`  | Modo remoto: `false` (local), `true` (remoto completo), `"minimal"` (só bindings remotos) |

### Modo remoto

```typescript
// Local mode (default) - fast, simulated
const worker = await startWorker({ config: 'wrangler.jsonc' })

// Full remote mode - production-like, slower
const worker = await startWorker({
  config: 'wrangler.jsonc',
  remote: true,
})

// Minimal remote mode - remote bindings, local Worker
const worker = await startWorker({
  config: 'wrangler.jsonc',
  remote: 'minimal',
})
```

## getPlatformProxy

Emula bindings em Node.js sem iniciar o Worker.

```typescript
import { getPlatformProxy } from 'wrangler'

const { env, dispose, caches } = await getPlatformProxy<Env>({
  configPath: 'wrangler.jsonc',
  environment: 'production',
  persist: { path: '.wrangler/state' },
})

// Use bindings
const value = await env.MY_KV.get('key')
await env.DB.prepare('SELECT * FROM users').all()
await env.ASSETS.put('file.txt', 'content')

// Platform APIs
await caches.default.put('https://example.com', new Response('cached'))

await dispose()
```

Use em testes unitários (funções, não o Worker inteiro) ou em scripts que precisam de bindings.

## Geração de tipos

Gere tipos a partir do config: `wrangler types` → cria `worker-configuration.d.ts`

## Sistema de eventos

Escute eventos do ciclo de vida do Worker em fluxos avançados.

```typescript
import { startWorker } from 'wrangler'

const worker = await startWorker({
  config: 'wrangler.jsonc',
  bundle: true,
})

// Bundle events
worker.on('bundleStart', (details) => {
  console.log('Bundling started:', details.config)
})

worker.on('bundleComplete', (details) => {
  console.log('Bundle ready:', details.duration)
})

// Reconfiguration events
worker.on('reloadStart', () => {
  console.log('Worker reloading...')
})

worker.on('reloadComplete', () => {
  console.log('Worker reloaded')
})

await worker.dispose()
```

### Reconfiguração dinâmica

```typescript
import { startWorker } from 'wrangler'

const worker = await startWorker({ config: 'wrangler.jsonc' })

// Replace entire config
await worker.setConfig({
  config: 'wrangler.staging.jsonc',
  environment: 'staging',
})

// Patch specific fields
await worker.patchConfig({
  vars: { DEBUG: 'true' },
})

await worker.dispose()
```

## unstable_dev (Obsoleto)

Use `startWorker` no lugar.

## Registro multi-Worker

Teste vários Workers com service bindings.

```typescript
import { startWorker } from 'wrangler'

const auth = await startWorker({ config: './auth/wrangler.jsonc' })
const api = await startWorker({
  config: './api/wrangler.jsonc',
  bindings: { AUTH: auth }, // Service binding
})

const response = await api.fetch('http://example.com/api/login')
// API Worker calls AUTH Worker via env.AUTH.fetch()

await api.dispose()
await auth.dispose()
```

## Boas práticas

- Use `startWorker` em testes de integração (testa o Worker completo)
- Use `getPlatformProxy` em testes unitários (testa funções isoladas)
- Use `remote: true` ao depurar problemas específicos de produção
- Use `remote: "minimal"` para testes mais rápidos com bindings reais
- Ative `persist: true` para depuração (o estado persiste entre execuções)
- Rode `wrangler types` após mudanças no config
- Sempre chame `dispose()` para evitar vazamento de recursos
- Escute eventos de bundle para monitorar builds
- Use o registro multi-Worker para testar service bindings

## Ver também

- [README.md](./README.md) — Comandos da CLI
- [configuration.md](./configuration.md) — Configuração
- [patterns.md](./patterns.md) — Padrões de teste

Documentação localizada no ecossistema mantido pelo Controllato Club.
