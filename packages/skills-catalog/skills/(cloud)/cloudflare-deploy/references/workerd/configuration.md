# Configuração do trabalhador

## Estrutura Básica

```capnp
using Workerd = import "/workerd/workerd.capnp";

const config :Workerd.Config = (
  services = [(name = "main", worker = .mainWorker)],
  sockets = [(name = "http", address = "*:8080", http = (), service = "main")]
);

const mainWorker :Workerd.Worker = (
  modules = [(name = "index.js", esModule = embed "src/index.js")],
  compatibilityDate = "2024-01-15",
  bindings = [...]
);
```

##Serviços

**Trabalhador**: Executar código JS/Wasm

```capnp
(name = "api", worker = (
  modules = [(name = "index.js", esModule = embed "index.js")],
  compatibilityDate = "2024-01-15",
  bindings = [...]
))
```

**Rede**: acesso à Internet

```capnp
(name = "internet", network = (allow = ["public"], tlsOptions = (trustBrowserCas = true)))
```

**Externo**: proxy reverso

```capnp
(name = "backend", external = (address = "api.com:443", http = (style = tls)))
```

**Disco**: arquivos estáticos

```capnp
(name = "assets", disk = (path = "/var/www", writable = false))
```

##Soquetes

```capnp
(name = "http", address = "*:8080", http = (), service = "main")
(name = "https", address = "*:443", https = (options = (), tlsOptions = (keypair = (...))), service = "main")
(name = "app", address = "unix:/tmp/app.sock", http = (), service = "main")
```

##Formatos de trabalho

```capnp
# ES Modules (recommended)
modules = [(name = "index.js", esModule = embed "src/index.js"), (name = "wasm.wasm", wasm = embed "build/module.wasm")]

# Service Worker (legacy)
serviceWorkerScript = embed "worker.js"

# CommonJS
(name = "legacy.js", commonJsModule = embed "legacy.js", namedExports = ["foo"])
```

##Ligações

As vinculações expõem recursos aos trabalhadores. Módulos ES: `env.BINDING`, Service Workers: globais.

### Tipos Primitivos

```capnp
(name = "API_KEY", text = "secret")                    # String
(name = "CONFIG", json = '{"key":"val"}')              # Parsed JSON
(name = "DATA", data = embed "data.bin")               # ArrayBuffer
(name = "DATABASE_URL", fromEnvironment = "DB_URL")    # System env var
```

### Vinculação de serviço

```capnp
(name = "AUTH", service = "auth-worker")               # Basic
(name = "API", service = (
  name = "backend",
  entrypoint = "adminApi",                             # Named export
  props = (json = '{"role":"admin"}')                  # ctx.props
))
```

### Armazenar

```capnp
(name = "CACHE", kvNamespace = "kv-service")           # KV
(name = "STORAGE", r2Bucket = "r2-service")            # R2
(name = "ROOMS", durableObjectNamespace = (
  serviceName = "room-service",
  className = "Room"
))
(name = "FAST", memoryCache = (
  id = "cache-id",
  limits = (maxKeys = 1000, maxValueSize = 1048576)
))
```

### Outro

```capnp
(name = "TASKS", queue = "queue-service")
(name = "ANALYTICS", analyticsEngine = "analytics")
(name = "LOADER", workerLoader = (id = "dynamic"))
(name = "KEY", cryptoKey = (format = raw, algorithm = (name = "HMAC", hash = "SHA-256"), keyData = embed "key.bin", usages = [sign, verify], extractable = false))
(name = "TRACED", wrapped = (moduleName = "tracing", entrypoint = "makeTracer", innerBindings = [(name = "backend", service = "backend")]))
```

##Compatibilidade

````capnp
compatibilityDate = "2024-01-15"                       # Always set!
compatibilityFlags = ["nodejs_compat", "streams_enable_constructors"]
```Versão = data máxima de compatibilidade. Atualize cuidadosamente após o teste.

## Ligações de parâmetros (herança)
```capnp
const base :Workerd.Worker = (
  modules = [...], compatibilityDate = "2024-01-15",
  bindings = [(name = "API_URL", parameter = (type = text)), (name = "DB", parameter = (type = service))]
);

const derived :Workerd.Worker = (
  inherit = "base-service",
  bindings = [(name = "API_URL", text = "https://api.com"), (name = "DB", service = "postgres")]
);
````

##Configuração de objetos duráveis

```capnp
const worker :Workerd.Worker = (
  modules = [...],
  compatibilityDate = "2024-01-15",
  bindings = [(name = "ROOMS", durableObjectNamespace = "Room")],
  durableObjectNamespaces = [(className = "Room", uniqueKey = "v1")],
  durableObjectStorage = (localDisk = "/var/do")
);
```

##Ligações Remotas (Desenvolvimento)

Conecte o trabalhador local aos recursos de produção da Cloudflare:

```capnp
ligações = [
# KV remoto (requer token de API)
(nome = "PROD_KV", kvNamespace = (
remoto = (
accountId = "id da sua conta",
namespaceId = "seu-namespace-id",
apiToken = .envVar("CF_API_TOKEN")
)
)),

# R2 remoto
(nome = "PROD_R2", r2Bucket = (
remoto = (
accountId = "id da sua conta",
bucketName = "meu-balde",
apiToken = .envVar("CF_API_TOKEN")
)
)),

# Objeto Durável Remoto
(nome = "PROD_DO", durávelObjectNamespace = (
remoto = (
accountId = "id da sua conta",
scriptName = "meu-trabalhador",
className = "MeuDO",
apiToken = .envVar("CF_API_TOKEN")
)
))
]
```

**Observação:** As vinculações remotas exigem acesso à rede e credenciais válidas da API Cloudflare.

## Registro e depuração

````capnp
logging = (structuredLogging = true, stdoutPrefix = "OUT: ", stderrPrefix = "ERR: ")
v8Flags = ["--expose-gc", "--max-old-space-size=2048"]  # ⚠️ Unsupported in production
```Consulte [patterns.md](./patterns.md) para exemplos de vários serviços, [gotchas.md](./gotchas.md) para erros de configuração.
````
