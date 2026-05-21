# Detalhes de criação direta (MCP)

Use esta referência para exemplos de criação direta de MCP e configuração subsequente.

## Fluxo de trabalho de criação direta

### Etapa 1: Analisar a base de código

Use [codebase-análise.md](codebase-análise.md) para determinar o tempo de execução, comandos de construção/inicialização, env vars e armazenamentos de dados.

### Etapa 2: Criar recursos via MCP

**Crie um serviço web:**

```
create_web_service(
  name: "my-api",
  runtime: "node",  # or python, go, rust, ruby, elixir, docker
  repo: "https://github.com/username/repo",
  branch: "main",  # optional, defaults to repo default branch
  buildCommand: "npm ci",
  startCommand: "npm start",
  plan: "free",  # free, starter, standard, pro, pro_max, pro_plus, pro_ultra
  region: "oregon",  # oregon, frankfurt, singapore, ohio, virginia
  envVars: [
    {"key": "NODE_ENV", "value": "production"}
  ]
)
```

**Crie um site estático:**

```
create_static_site(
  name: "my-frontend",
  repo: "https://github.com/username/repo",
  branch: "main",
  buildCommand: "npm run build",
  publishPath: "dist",  # or build, public, out
  envVars: [
    {"key": "VITE_API_URL", "value": "https://api.example.com"}
  ]
)
```

**Crie um Cron Job:**

```
create_cron_job(
  name: "daily-cleanup",
  runtime: "node",
  repo: "https://github.com/username/repo",
  schedule: "0 0 * * *",  # Daily at midnight (cron syntax)
  buildCommand: "npm ci",
  startCommand: "node scripts/cleanup.js",
  plan: "free"
)
```

**Crie um banco de dados PostgreSQL:**

```
create_postgres(
  name: "myapp-db",
  plan: "free",  # free, basic_256mb, basic_1gb, basic_4gb, pro_4gb, etc.
  region: "oregon"
)
```

**Crie um armazenamento de valor-chave (Redis):**

```
create_key_value(
  name: "myapp-cache",
  plan: "free",  # free, starter, standard, pro, pro_plus
  region: "oregon",
  maxmemoryPolicy: "allkeys_lru"  # eviction policy
)
```

### Etapa 3: Configurar variáveis de ambiente

Após criar os serviços, adicione variáveis de ambiente:```
update_environment_variables(
serviceId: "<service-id-from-creation>",
envVars: [
{"key": "DATABASE_URL", "value": "<connection-string>"},
{"key": "JWT_SECRET", "value": "<secret-value>"},
{"key": "API_KEY", "value": "<api-key>"}
]
)

```

**Observação:** Para strings de conexão de banco de dados, obtenha a URL interna dos detalhes do banco de dados no Dashboard ou via `get_postgres(postgresId: "<id>")`.

### Etapa 4: verificar a implantação

Serviços com `autoDeploy: "yes"` (padrão) serão implantados automaticamente quando criados.

**Verifique o status da implantação:**

```

list_deploys(serviceId: "<service-id>", limit: 1)

```

**Monitore registros em busca de erros:**

```

list_logs(resource: ["<service-id>"], level: ["error"], limit: 50)

```

**Verifique as métricas de saúde:**

```

get_metrics(
resourceId: "<service-id>",
metricTypes: ["http_request_count", "cpu_usage", "memory_usage"]
)

```

```
