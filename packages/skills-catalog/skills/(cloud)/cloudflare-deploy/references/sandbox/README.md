# Cloudflare Sandbox SDK

Execução segura de código isolado em contêineres na borda da Cloudflare. Execute códigos não confiáveis, gerencie arquivos, exponha serviços e integre-se a agentes de IA.

**Casos de uso**: execução de código de IA, ambientes de desenvolvimento interativos, análise de dados, CI/CD, interpretadores de código, execução multilocatário.

## Arquitetura

- Cada sandbox = Objeto Durável + Recipiente
- Persistente entre solicitações (mesmo ID = mesmo sandbox)
- Sistema de arquivos/processos/rede isolados
- Sleep/wake configurável para otimização de custos

## Início rápido```typescript

import { getSandbox, proxyToSandbox, type Sandbox } from '@cloudflare/sandbox'
export { Sandbox } from '@cloudflare/sandbox'

type Env = { Sandbox: DurableObjectNamespace<Sandbox> }

export default {
async fetch(request: Request, env: Env): Promise<Response> {
// CRITICAL: proxyToSandbox MUST be called first for preview URLs
const proxyResponse = await proxyToSandbox(request, env)
if (proxyResponse) return proxyResponse

    const sandbox = getSandbox(env.Sandbox, 'my-sandbox')
    const result = await sandbox.exec('python3 -c "print(2 + 2)"')
    return Response.json({ output: result.stdout })

},
}

````

**wrangler.jsonc**:

```jsonc
{
  "name": "my-sandbox-worker",
  "main": "src/index.ts",
  "compatibility_date": "2025-01-01", // Use current date for new projects

  "containers": [
    {
      "class_name": "Sandbox",
      "image": "./Dockerfile",
      "instance_type": "lite", // lite | standard | heavy
      "max_instances": 5,
    },
  ],

  "durable_objects": {
    "bindings": [{ "class_name": "Sandbox", "name": "Sandbox" }],
  },

  "migrations": [
    {
      "tag": "v1",
      "new_sqlite_classes": ["Sandbox"],
    },
  ],
}
````

**Dockerfile**:

```dockerfile
FROM docker.io/cloudflare/sandbox:latest
RUN pip3 install --no-cache-dir pandas numpy matplotlib
EXPOSE 8080 3000  # Required for wrangler dev
```

## APIs principais

- `getSandbox(namespace, id, opções?)` → Obter/criar sandbox
- `sandbox.exec(comando, opções?)` → Executar comando
- `sandbox.readFile(path)` / `writeFile(path, content)` → Operações de arquivo
- `sandbox.startProcess(comando, opções)` → Processo em segundo plano
- `sandbox.exposePort(port, options)` → Obter URL de visualização
- `sandbox.createSession(options)` → Sessão isolada
- `sandbox.wsConnect(solicitação, porta)` → proxy WebSocket
- `sandbox.destroy()` → Encerrar contêiner
- `sandbox.mountBucket(bucket, path, options)` → Montar armazenamento S3

## Regras Críticas

- SEMPRE chame `proxyToSandbox()` primeiro
- Mesmo ID = reutilizar sandbox
- Use `/workspace` para arquivos persistentes
- `normalizeId: true` para URLs de visualização
- Tente novamente em `CONTAINER_NOT_READY`

## Nesta referência

- [configuration.md](./configuration.md) - Configuração, CLI, configuração do ambiente
- [api.md](./api.md) - API programática, padrões de teste
- [patterns.md](./patterns.md) - Fluxos de trabalho comuns, integração CI/CD
- [gotchas.md](./gotchas.md) - Problemas, limites, práticas recomendadas

## Veja também

- [durable-objects](../durable-objects/) - Sandbox é executado na infraestrutura DO
- [containers](../containers/) - Fundamentos do tempo de execução do contêiner
- [workers](../workers/) – Ponto de entrada para solicitações de sandbox
