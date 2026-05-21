# Problemas comuns do Wrangler

## Erros comuns

### "Binding ID vs name mismatch"

**Causa:** Confusão entre nome do binding (código) e ID do recurso
**Solução:** Bindings usam `binding` (nome no código) e `id`/`database_id`/`bucket_name` (ID do recurso). Bindings de preview precisam de IDs separados: `preview_id`, `preview_database_id`

### "Environment not inheriting config"

**Causa:** Chaves não herdáveis não redefinidas por ambiente
**Solução:** Chaves não herdáveis (bindings, vars) devem ser redefinidas por ambiente. Chaves herdáveis (routes, compatibility_date) podem ser sobrescritas

### "Local dev behavior differs from production"

**Causa:** Uso de simulação local em vez de execução remota
**Solução:** Escolha o modo remoto adequado:

- `wrangler dev` (padrão): simulação local, rápida, precisão limitada
- `wrangler dev --remote`: execução remota completa, próxima da produção, mais lenta
- Use `remote: "minimal"` em testes para testes rápidos com bindings remotos reais

### "startWorker doesn't match production"

**Causa:** Modo local quando recursos remotos são necessários
**Solução:** Use a opção `remote`:

```typescript
const worker = await startWorker({
  config: 'wrangler.jsonc',
  remote: true, // or "minimal" for faster tests
})
```

### "Unexpected runtime changes"

**Causa:** `compatibility_date` ausente
**Solução:** Defina sempre `compatibility_date`:

```jsonc
{ "compatibility_date": "2025-01-01" }
```

### "Durable Object binding not working"

**Causa:** `script_name` ausente para DOs externos
**Solução:** Especifique sempre `script_name` para Durable Objects externos:

```jsonc
{
  "durable_objects": {
    "bindings": [{ "name": "MY_DO", "class_name": "MyDO", "script_name": "my-worker" }],
  },
}
```

Para DOs locais no mesmo Worker, `script_name` é opcional.

### "Auto-provisioned resources not appearing"

**Causa:** IDs gravados de volta no config no primeiro deploy, mas config não recarregado
**Solução:** Após o primeiro deploy com provisionamento automático, o arquivo de config é atualizado com os IDs. Faça commit do config atualizado. Em deploys seguintes, recursos existentes são reutilizados.

### "Secrets not available in local dev"

**Causa:** Secrets definidos com `wrangler secret put` só funcionam em Workers implantados
**Solução:** Em dev local, use `.dev.vars`

### "Node.js compatibility error"

**Causa:** Flag de compatibilidade Node.js ausente
**Solução:** Alguns bindings (Hyperdrive com `pg`) exigem:

```jsonc
{ "compatibility_flags": ["nodejs_compat_v2"] }
```

### "Workers Assets 404 errors"

**Causa:** Caminho do asset incorreto ou `html_handling` errado
**Solução:**

- Confira se `assets.directory` aponta para o build correto
- Defina `html_handling: "auto-trailing-slash"` para SPAs
- Use `not_found_handling: "single-page-application"` para servir index.html em 404s

```jsonc
{
  "assets": {
    "directory": "./dist",
    "html_handling": "auto-trailing-slash",
    "not_found_handling": "single-page-application",
  },
}
```

### "Placement not reducing latency"

**Causa:** Mal-entendido sobre Smart Placement
**Solução:** Smart Placement só ajuda quando o Worker acessa D1 ou Durable Objects. Não afeta latência de KV, R2 ou APIs externas.

```jsonc
{ "placement": { "mode": "smart" } } // Only beneficial with D1/DOs
```

### "unstable_startWorker not found"

**Causa:** API desatualizada
**Solução:** Use a API estável `startWorker`:

```typescript
import { startWorker } from 'wrangler' // Not unstable_startWorker
```

### "outboundService not mocking fetch"

**Causa:** Função mock não retorna Response
**Solução:** Sempre retorne Response; use `fetch(req)` para repasse:

```typescript
const worker = await startWorker({
  outboundService: (req) => {
    if (shouldMock(req)) {
      return new Response('mocked')
    }
    return fetch(req) // Required for non-mocked requests
  },
})
```

## Limites

| Recurso/limite                 | Valor     | Observação                   |
| ------------------------------ | --------- | ---------------------------- |
| Bindings por Worker            | 64        | Total entre todos os tipos   |
| Ambientes                      | Ilimitado | Ambientes nomeados no config |
| Tamanho do arquivo config      | ~1MB      | Mantenha razoável            |
| Tamanho Workers Assets         | 25 MB     | Por deploy                   |
| Arquivos Workers Assets        | 20.000    | Número máximo de arquivos    |
| Tamanho do script (compactado) | 1 MB      | Grátis, 10 MB pago           |
| Tempo de CPU                   | 10–50ms   | Grátis, 50–500ms pago        |
| Limite de subrequests          | 50        | Grátis, 1000 pago            |

## Resolução de problemas

### Autenticação

```bash
wrangler logout
wrangler login
wrangler whoami
```

### Erros de configuração

```bash
wrangler check  # Validate config
```

Use wrangler.jsonc com `$schema` para validação.

### Binding indisponível

- Verifique se o binding existe no config
- Para ambientes, garanta o binding naquele ambiente
- Dev local: alguns bindings precisam de `--remote`

### Falhas de deploy

```bash
wrangler tail              # Check logs
wrangler deploy --dry-run  # Validate
wrangler whoami            # Check account limits
```

### Problemas em desenvolvimento local

```bash
rm -rf .wrangler/state     # Clear local state
wrangler dev --remote      # Use remote bindings
wrangler dev --persist-to ./local-state  # Custom persist location
wrangler dev --inspector-port 9229  # Enable debugging
```

### Problemas em testes

```bash
# If tests hang, ensure dispose() is called
worker.dispose()  // Always cleanup

# If bindings don't work in tests
const worker = await startWorker({
  config: "wrangler.jsonc",
  remote: "minimal"  // Use remote bindings
});
```

## Recursos

- Docs: https://developers.cloudflare.com/workers/wrangler/
- Config: https://developers.cloudflare.com/workers/wrangler/configuration/
- Commands: https://developers.cloudflare.com/workers/wrangler/commands/
- Examples: https://github.com/cloudflare/workers-sdk/tree/main/templates
- Discord: https://discord.gg/cloudflaredev

## Ver também

- [README.md](./README.md) — Comandos
- [configuration.md](./configuration.md) — Configuração
- [api.md](./api.md) — API programática
- [patterns.md](./patterns.md) — Fluxos de trabalho

Documentação localizada no ecossistema mantido pelo Controllato Club.
