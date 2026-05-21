# Configuração

## Opções getSandbox

```typescript
const sandbox = getSandbox(env.Sandbox, 'sandbox-id', {
  normalizeId: true, // lowercase ID (required for preview URLs)
  sleepAfter: '10m', // sleep after inactivity: '5m', '1h', '2d' (default: '10m')
  keepAlive: false, // false = auto-timeout, true = never sleep

  containerTimeouts: {
    instanceGetTimeoutMS: 30000, // 30s for provisioning (default: 30000)
    portReadyTimeoutMS: 90000, // 90s for container startup (default: 90000)
  },
})
```

**Configuração de suspensão**:

- `sleepAfter`: String de duração (por exemplo, '5m', '10m', '1h') - padrão: '10m'
- `keepAlive: false`: suspensão automática (padrão, com custo otimizado)
- `keepAlive: true`: Nunca durma (custo mais alto, requer `destroy()` explícito)
- Sandboxes adormecidas despertam automaticamente (inicialização a frio)

## Tipos de instância

wrangler.jsonc `instance_type`:

- `lite`: 256 MB de RAM, 0,5 vCPU (padrão)
- `padrão`: 512 MB de RAM, 1 vCPU
- `pesado`: 1 GB de RAM, 2 vCPU

## Padrões Dockerfile

**Básico**:

```dockerfile
FROM docker.io/cloudflare/sandbox:latest
RUN pip3 install --no-cache-dir pandas numpy
EXPOSE 8080  # Required for wrangler dev
```

**Científico**:

```dockerfile
FROM docker.io/cloudflare/sandbox:latest
RUN pip3 install --no-cache-dir \
    jupyter-server ipykernel matplotlib \
    pandas seaborn plotly scipy scikit-learn
```

**Node.js**:

```dockerfile
FROM docker.io/cloudflare/sandbox:latest
RUN npm install -g typescript ts-node
```

**CRÍTICO**: `EXPOSE` necessário para acesso à porta `wrangler dev`. A produção expõe automaticamente todas as portas.

## Comandos CLI

```bash
# Dev
wrangler dev                    # Start local dev server
wrangler deploy                 # Deploy to production
wrangler tail                   # Monitor logs
wrangler containers list        # Check container status
wrangler secret put KEY         # Set secret
```

##Meio Ambiente e Segredos

**wrangler.jsonc**:

```jsonc
{
  "vars": {
    "ENVIRONMENT": "production",
    "API_URL": "https://api.example.com",
  },
  "r2_buckets": [
    {
      "binding": "DATA_BUCKET",
      "bucket_name": "my-data-bucket",
    },
  ],
}
```

**Uso**:

```typescript
const token = env.GITHUB_TOKEN // From wrangler secret
await sandbox.exec('git clone ...', {
  env: { GIT_TOKEN: token },
})
```

##Visualizar configuração do URL

**Pré-requisitos**:

- Domínio personalizado com DNS curinga: `*.seudominio.com → trabalhador.seudominio.com`
- Domínios `.workers.dev` NÃO suportados
- `normalizeId: true` em getSandbox
- `proxyToSandbox()` chamado primeiro no manipulador de busca

## Cron Triggers (Pré-aquecimento)

```jsonc
{
  "triggers": {
    "crons": ["*/5 * * * *"], // Every 5 minutes
  },
}
```

```typescript
export default {
  async scheduled(event: ScheduledEvent, env: Env) {
    const sandbox = getSandbox(env.Sandbox, 'main')
    await sandbox.exec('echo "keepalive"') // Wake sandbox
  },
}
```

##Configuração de registro

**wrangler.jsonc**:

```jsonc
{
  "vars": {
    "SANDBOX_LOG_LEVEL": "debug", // debug | info | warn | error (default: info)
    "SANDBOX_LOG_FORMAT": "pretty", // json | pretty (default: json)
  },
}
```

**Dev**: `debug` + `pretty`. **Produção**: `info`/`warn` + `json`.

## Substituições de ambiente de tempo limite

Substitua os tempos limite padrão por meio de variáveis de ambiente:

```jsonc
{
  "vars": {
    "SANDBOX_INSTANCE_TIMEOUT_MS": "60000", // Override instanceGetTimeoutMS
    "SANDBOX_PORT_TIMEOUT_MS": "120000", // Override portReadyTimeoutMS
  },
}
```
