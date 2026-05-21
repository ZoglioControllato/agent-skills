# Detalhes de implantação

Use esta referência para descoberta de serviços, padrões de configuração, comandos rápidos e problemas comuns.

## Descoberta de serviço

**Listar todos os serviços:**

```
list_services()
```

Retorna todos os serviços com IDs, nomes, tipos e status.

**Obtenha detalhes específicos do serviço:**

```
get_service(serviceId: "<id>")
```

Retorna a configuração completa, incluindo variáveis ​​de ambiente e comandos de construção/inicialização.

**Listar bancos de dados PostgreSQL:**

```
list_postgres_instances()
```

**Listar armazenamentos de valores-chave:**

```
list_key_value()
```

## Detalhes de configuração

### Variáveis de ambiente

**Todas as variáveis de ambiente devem ser declaradas em render.yaml.**

**Três padrões para variáveis de ambiente:**

1. **Valores codificados** (configuração não sensível):```yaml
   envVars:

- key: NODE_ENV
  value: production
- key: API_URL
  value: https://api.example.com

````
2. **Conexões de banco de dados** (geradas automaticamente):```yaml
envVars:
  - key: DATABASE_URL
    fromDatabase:
      name: postgres
      property: connectionString
  - key: REDIS_URL
    fromDatabase:
      name: redis
      property: connectionString
````

3. **Segredos** (o usuário preenche o Dashboard):```yaml
   envVars:

- key: JWT_SECRET
  sync: false
- key: API_KEY
  sync: false
- key: STRIPE_SECRET_KEY
  sync: false

````
Guia completo de variáveis de ambiente: [configuration-guide.md](configuration-guide.md)

### Ligação de porta

**CRÍTICO:** Os serviços da Web devem ser vinculados a `0.0.0.0:$PORT` (NÃO a `localhost`). Render define a variável de ambiente `PORT`.

**Exemplo de Node.js:**

```javascript
const PORT = process.env.PORT || 3000
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`)
})
````

**Exemplo de Python:**

```python
import os

port = int(os.environ.get('PORT', 5000))
app.run(host='0.0.0.0', port=port)
```

**Vá Exemplo:**

```go
port := os.Getenv("PORT")
if port == "" {
    port = "3000"
}
http.ListenAndServe(":"+port, handler)
```

### Padrões do plano

**Use `plan: free` a menos que o usuário especifique o contrário.** Consulte Preço de renderização para limites e capacidade atuais.

### Comandos de construção

**Use sinalizadores não interativos para evitar travamentos de compilação:**

- npm: `npm ci`
- fio: `yarn install --frozen-lockfile`
- pnpm: `pnpm install --frozen-lockfile`
- bun: `bun install --frozen-lockfile`
- pip: `pip install -r requisitos.txt`
- uv: `sincronização uv`
- apt: `apt-get install -y <pacote>`
- bundler: `instalação do pacote --jobs=4 --retry=3`

### Conexões de banco de dados

Quando os serviços se conectam a bancos de dados na mesma conta Render, use referências `fromDatabase` para URLs internos.

### Verificações de saúde

Opcional, mas recomendado: adicione um endpoint `/health` para detecção de implantação mais rápida.

## Referência rápida

### Ferramentas MCP (preferencial)```

# Service Discovery

list_services()
get_service(serviceId: "<id>")
list_postgres_instances()
list_key_value()

# Service Creation

create_web_service(name, runtime, buildCommand, startCommand, ...)
create_static_site(name, buildCommand, publishPath, ...)
create_cron_job(name, runtime, schedule, buildCommand, startCommand, ...)
create_postgres(name, plan, region)
create_key_value(name, plan, region)

# Environment Variables

update_environment_variables(serviceId, envVars: [{key, value}, ...])

# Deployment & Monitoring

list_deploys(serviceId, limit)
list_logs(resource: ["<id>"], level: ["error"])
get_metrics(resourceId, metricTypes: [...])

# Workspace

get_selected_workspace()
list_workspaces()

````
### Comandos CLI```bash
# Validate Blueprint
render blueprints validate

# Check workspace
render workspace current -o json
render workspace set

# List services
render services -o json

# View deployment logs
render logs -r <service-id> -o json

# Create deployment
render deploys create <service-id> --wait
````

### Modelos por Framework

- Node.js Express: [../assets/node-express.yaml](../assets/node-express.yaml)
- Next.js + Postgres: [../assets/nextjs-postgres.yaml](../assets/nextjs-postgres.yaml)
- Django + Trabalhador: [../assets/python-django.yaml](../assets/python-django.yaml)
- Site estático: [../assets/static-site.yaml](../assets/static-site.yaml)
- API Go: [../assets/go-api.yaml](../assets/go-api.yaml)
- Docker: [../assets/docker.yaml](../assets/docker.yaml)

### Documentação

- Especificação completa do Blueprint: [blueprint-spec.md](blueprint-spec.md)
- Tipos de serviço explicados: [service-types.md](service-types.md)
- Opções de tempo de execução: [runtimes.md](runtimes.md)
- Guia de configuração: [configuration-guide.md](configuration-guide.md)

## Problemas comuns

**Problema:** A implantação falha com erro de vinculação de porta

**Solução:** Certifique-se de que o aplicativo esteja vinculado a `0.0.0.0:$PORT` (consulte a seção Ligação de porta acima)

---

**Problema:** A compilação trava ou expira

**Solução:** Use comandos de compilação não interativos (consulte a seção Comandos de compilação acima)

---

**Problema:** Variáveis de ambiente ausentes no Dashboard

**Solução:** Todos os env vars devem ser declarados em render.yaml. Adicione vars ausentes com `sync: false` para segredos.

---

**Problema:** Falha na conexão com o banco de dados

**Solução:** Use referências `fromDatabase` para strings de conexão internas.

---

**Problema:** site estático mostra 404 para rotas

**Solução:** adicione regras de reescrita a render.yaml para roteamento SPA:```yaml
routes:

- type: rewrite
  source: /\*
  destination: /index.html

```
Para solução de problemas mais detalhada, consulte a habilidade de depuração ou [configuration-guide.md](configuration-guide.md).
```
