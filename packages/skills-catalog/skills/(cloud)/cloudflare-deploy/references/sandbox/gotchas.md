# Gotchas & Best Practices

## Common Errors

### "Container running indefinitely"

**Cause:** `keepAlive: true` without calling `destroy()`
**Solution:** Always call `destroy()` when done with keepAlive containers

```typescript
const sandbox = getSandbox(env.Sandbox, 'temp', { keepAlive: true })
try {
  const result = await sandbox.exec('python script.py')
  return result.stdout
} finally {
  await sandbox.destroy() // REQUIRED to free resources
}
```

### "CONTAINER_NOT_READY"

**Cause:** Container still provisioning (first request or after sleep)
**Solution:** Retry after 2-3s

```typescript
async function execWithRetry(sandbox, cmd) {
  for (let i = 0; i < 3; i++) {
    try {
      return await sandbox.exec(cmd)
    } catch (e) {
      if (e.code === 'CONTAINER_NOT_READY') {
        await new Promise((r) => setTimeout(r, 2000))
        continue
      }
      throw e
    }
  }
}
```

### "Conexão recusada: porta do contêiner não encontrada"

**Causa:** Diretiva `EXPOSE` ausente no Dockerfile
**Solução:** Adicione `EXPOSE <port>` ao Dockerfile (necessário apenas para `wrangler dev`, exposições automáticas de produção)

### "URLs de visualização não funcionam"

**Causa:** Domínio personalizado não configurado, DNS curinga ausente, `normalizeId` não definido ou `proxyToSandbox()` não chamado
**Solução:** Verifique:

1. Domínio personalizado configurado? (não `.workers.dev`)
2. DNS curinga configurado? (`*.domínio.com → trabalhador.domínio.com`)
3. `normalizeId: true` no getSandbox?
4. `proxyToSandbox()` chamado primeiro na busca?

### "Primeira solicitação lenta"

**Causa:** inicialização a frio (provisionamento de contêiner)
**Solução:**

- Use `sleepAfter` em vez de criar novos sandboxes
- Pré-aquecimento com gatilhos cron
- Defina `keepAlive: true` para sandboxes críticas

### "Arquivo não persiste"

**Causa:** Arquivos em `/tmp` ou outros caminhos efêmeros
**Solução:** Use `/workspace` para arquivos persistentes

### "A montagem do balde não funciona localmente"

**Causa:** A montagem do balde requer FUSE, não disponível no `wrangler dev`
**Solução:** Teste a montagem da caçamba somente na produção. Use dados simulados localmente.

### "NormalizeId diferente = sandbox diferente"

**Causa:** A alteração da opção `normalizeId` altera o ID do objeto durável
**Solução:** Defina `normalizeId` consistentemente. `normalizeId: true` coloca o ID em letras minúsculas.```typescript
// These create DIFFERENT sandboxes:
getSandbox(env.Sandbox, 'MyApp') // DO ID: hash('MyApp')
getSandbox(env.Sandbox, 'MyApp', { normalizeId: true }) // DO ID: hash('myapp')

````

### "Code context variables disappeared"

**Cause:** Container restart clears code context state
**Solution:** Code contexts are ephemeral. Recreate context after container sleep/wake.

## Performance Optimization

### Sandbox ID Strategy

```typescript
// ❌ BAD: New sandbox every time (slow)
const sandbox = getSandbox(env.Sandbox, `user-${Date.now()}`)

// ✅ GOOD: Reuse per user
const sandbox = getSandbox(env.Sandbox, `user-${userId}`)
````

### Sleep & Traffic Config

```typescript
// Cost-optimized
getSandbox(env.Sandbox, 'id', { sleepAfter: '30m', keepAlive: false })

// Always-on (requires destroy())
getSandbox(env.Sandbox, 'id', { keepAlive: true })
```

```jsonc
// High traffic: increase max_instances
{ "containers": [{ "class_name": "Sandbox", "max_instances": 50 }] }
```

## Security Best Practices

### Sandbox Isolation

- Each sandbox = isolated container (filesystem, network, processes)
- Use unique sandbox IDs per tenant for multi-tenant apps
- Sandboxes cannot communicate directly

### Input Validation

```typescript
// ❌ DANGEROUS: Command injection
const result = await sandbox.exec(`python3 -c "${userCode}"`)

// ✅ SAFE: Write to file, execute file
await sandbox.writeFile('/workspace/user_code.py', userCode)
const result = await sandbox.exec('python3 /workspace/user_code.py')
```

### Resource Limits

```typescript
// Timeout long-running commands
const result = await sandbox.exec('python3 script.py', {
  timeout: 30000, // 30 seconds
})
```

### Secrets Management

```typescript
// ❌ NEVER hardcode secrets
const token = 'ghp_abc123'

// ✅ Use environment secrets
const token = env.GITHUB_TOKEN

// Pass to sandbox via exec env
const result = await sandbox.exec('git clone ...', {
  env: { GIT_TOKEN: token },
})
```

### Preview URL Security

Preview URLs include auto-generated tokens:

```
https://8080-sandbox-abc123def456.yourdomain.com
```

Token changes on each expose operation, preventing unauthorized access.

## Limits

| Resource | Lite  | Standard | Heavy |
| -------- | ----- | -------- | ----- |
| RAM      | 256MB | 512MB    | 1GB   |
| vCPU     | 0.5   | 1        | 2     |

| Operation              | Default Timeout | Override                      |
| ---------------------- | --------------- | ----------------------------- |
| Container provisioning | 30s             | `SANDBOX_INSTANCE_TIMEOUT_MS` |
| Port readiness         | 90s             | `SANDBOX_PORT_TIMEOUT_MS`     |
| exec()                 | 120s            | `timeout` option              |
| sleepAfter             | 10m             | `sleepAfter` option           |

**Performance**:

- **First deploy**: 2-3 min for container build
- **Cold start**: 2-3s when waking from sleep
- **Bucket mounting**: Production only (FUSE not in dev)

## Production Guide

See: https://developers.cloudflare.com/sandbox/guides/production-deployment/

## Resources

- [Official Docs](https://developers.cloudflare.com/sandbox/)
- [API Reference](https://developers.cloudflare.com/sandbox/api/)
- [Examples](https://github.com/cloudflare/sandbox-sdk/tree/main/examples)
- [npm Package](https://www.npmjs.com/package/@cloudflare/sandbox)
- [Discord Support](https://discord.cloudflare.com)
