## Wrangler Configuration

### Basic Container Config

```jsonc
{
  "name": "my-worker",
  "main": "src/index.ts",
  "compatibility_date": "2026-01-10",
  "containers": [
    {
      "class_name": "MyContainer",
      "image": "./Dockerfile", // Path to Dockerfile or directory with Dockerfile
      "instance_type": "standard-1", // Predefined or custom (see below)
      "max_instances": 10,
    },
  ],
  "durable_objects": {
    "bindings": [
      {
        "name": "MY_CONTAINER",
        "class_name": "MyContainer",
      },
    ],
  },
  "migrations": [
    {
      "tag": "v1",
      "new_sqlite_classes": ["MyContainer"], // Must use new_sqlite_classes
    },
  ],
}
```

Principais requisitos de configuração:

- `image` - Caminho para Dockerfile ou diretório contendo Dockerfile
- `class_name` - Deve corresponder ao nome de exportação da classe Container
- `max_instances` - Máximo de instâncias de contêiner simultâneas
- Deve configurar vinculações e migrações de objetos duráveis

### Tipos de instância

#### Tipos predefinidos

| Tipo     | vCPU  | Memória | Disco |
| -------- | ----- | ------- | ----- | -------- |
| leve     | 16/01 | 256 MiB | 2 GB  |
| básico   | 1/4   | 1 GiB   | 4 GB  |
| padrão-1 | 1/2   | 4GB     | 8 GB  |
| padrão-2 | 1     | 6GB     | 12 GB |
| padrão-3 | 2     | 8GB     | 16 GB |
| padrão-4 | 4     | 12 GB   | 20 GB | ```jsonc |

{
"containers": [
{
"class_name": "MyContainer",
"image": "./Dockerfile",
"instance_type": "standard-2", // Use predefined type
},
],
}

````

#### Custom Types (Jan 2026 Feature)

```jsonc
{
  "containers": [
    {
      "class_name": "MyContainer",
      "image": "./Dockerfile",
      "instance_type_custom": {
        "vcpu": 2, // 1-4 vCPU
        "memory_mib": 8192, // 512-12288 MiB (up to 12 GiB)
        "disk_mib": 16384, // 2048-20480 MiB (up to 20 GB)
      },
    },
  ],
}
````

**Custom type constraints:**

- Minimum 3 GiB memory per vCPU
- Maximum 2 GB disk per 1 GiB memory
- Max 4 vCPU, 12 GiB memory, 20 GB disk per container

### Account Limits

| Resource                      | Limit   | Notes                         |
| ----------------------------- | ------- | ----------------------------- |
| Total memory (all containers) | 400 GiB | Across all running containers |
| Total vCPU (all containers)   | 100     | Across all running containers |
| Total disk (all containers)   | 2 TB    | Across all running containers |
| Image storage per account     | 50 GB   | Stored container images       |

### Container Class Properties

```typescript
import { Container } from '@cloudflare/containers'

export class MyContainer extends Container {
  // Port Configuration
  defaultPort = 8080 // Default port for fetch() calls
  requiredPorts = [8080, 9090] // Ports to wait for in startAndWaitForPorts()

  // Lifecycle
  sleepAfter = '30m' // Inactivity timeout (5m, 30m, 2h, etc.)

  // Network
  enableInternet = true // Allow outbound internet access

  // Health Check
  pingEndpoint = '/health' // Health check endpoint path

  // Environment
  envVars = {
    // Environment variables passed to container
    NODE_ENV: 'production',
    LOG_LEVEL: 'info',
  }

  // Startup
  entrypoint = ['/bin/start.sh'] // Override image entrypoint (optional)
}
```

**Detalhes do imóvel:**

- **`defaultPort`**: Porta usada ao chamar `container.fetch()` sem porta explícita. Volta para a porta 33 se não estiver definida.

- **`requiredPorts`**: Array de portas que devem estar escutando antes do retorno de `startAndWaitForPorts()`. A primeira porta se torna padrão se `defaultPort` não estiver definida.

- **`sleepAfter`**: String de duração (por exemplo, "5m", "30m", "2h"). O contêiner para após esse período de inatividade. O temporizador é redefinido em cada solicitação.

- **`enableInternet`**: Booleano. Se for `true`, o contêiner pode fazer solicitações HTTP/TCP de saída.

- **`pingEndpoint`**: Caminho usado para verificações de integridade. Deve responder com status 2xx.

- **`envVars`**: Objeto de variáveis ​​de ambiente. Mesclado com vars fornecidos pelo tempo de execução (veja abaixo).

- **`ponto de entrada`**: Matriz de strings. Substitui o CMD/ENTRYPOINT da imagem do contêiner.

### Variáveis de ambiente de tempo de execução

A Cloudflare fornece automaticamente estas variáveis de ambiente aos contêineres:

| Variável                       | Descrição                                         |
| ------------------------------ | ------------------------------------------------- |
| `CLOUDFLARE_APPLICATION_ID`    | ID do aplicativo de trabalho                      |
| `CLOUDFLARE_COUNTRY_A2`        | Código de duas letras do país de origem do pedido |
| `CLOUDFLARE_LOCATION`          | Localização do data center Cloudflare             |
| `CLOUDFLARE_REGION`            | Identificador de região                           |
| `CLOUDFLARE_DURABLE_OBJECT_ID` | ID do objeto durável do contêiner                 |

`envVars` personalizados da classe Container são mesclados com estes. Vars personalizados substituem vars de tempo de execução se os nomes entrarem em conflito.

### Gerenciamento de imagens

**Modelo de distribuição:** imagens pré-buscadas em todos os locais globais antes da implantação. Garante partidas a frio rápidas (2-3s normalmente).

**Implantações contínuas:** ao contrário dos Workers (instantâneos), as implantações de contêiner são implementadas gradualmente. Versões antigas continuam em execução durante a implementação.

**Disco efêmero:** O disco do contêiner é efêmero e é redefinido a cada parada. Use armazenamento de objetos duráveis ​​(`this.ctx.storage`) para persistência.

## formato wrangler.toml```toml

name = "my-worker"
main = "src/index.ts"
compatibility_date = "2026-01-10"

[[containers]]
class_name = "MyContainer"
image = "./Dockerfile"
instance_type = "standard-2"
max_instances = 10

[[durable_objects.bindings]]
name = "MY_CONTAINER"
class_name = "MyContainer"

[[migrations]]
tag = "v1"
new_sqlite_classes = ["MyContainer"]

```
Tanto `wrangler.jsonc` quanto `wrangler.toml` são suportados. Use `wrangler.jsonc` para comentários e melhor suporte IDE.
```
