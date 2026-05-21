# Especificação do projeto de renderização

Referência completa para arquivos render.yaml Blueprint. Os blueprints definem sua infraestrutura como código para implantações reproduzíveis no Render.

## Visão geral

Um Blueprint é um arquivo YAML (normalmente `render.yaml`) colocado na raiz do seu repositório que descreve:

- Serviços (web, trabalhador, cron, estático, privado)
- Bancos de dados (PostgreSQL, Redis)
- Variáveis ​​e segredos de ambiente
- Dimensionamento e configuração de recursos
- Organização do projeto

## Estrutura em nível raiz```yaml

# Top-level fields

services: [] # Array of service definitions
databases: [] # Array of PostgreSQL databases
envVarGroups: [] # Reusable environment variable groups (optional)
projects: [] # Project organization (optional)
ungrouped: [] # Resources outside projects (optional)
previews: # Preview environment configuration (optional)
generation: auto_preview | manual | none

````
## Tipos de serviço

### Serviços Web (`tipo: web`)

Serviços HTTP, APIs e aplicativos da web. Acessível publicamente via HTTPS.

**Campos obrigatórios:**

- `nome`: identificador exclusivo do serviço
- `type`: Deve ser `web`
- `runtime`: Idioma/ambiente (veja a seção Runtimes)
- `buildCommand`: Comando para construir a aplicação
- `startCommand`: Comando para iniciar o servidor

**Campos opcionais comuns:**

- `plan`: tipo de instância (padrão: `free`)
- `region`: região de implantação (padrão: `oregon`)
- `branch`: branch Git a ser implantado (padrão: `main`)
- `autoDeploy`: Implantação automática em push (padrão: `true`)
- `envVars`: array de variáveis de ambiente
- `healthCheckPath`: endpoint de verificação de integridade (padrão: `/`)
- `numInstances`: Número de instâncias (escalonamento manual)
- `scaling`: configuração de escalonamento automático

**Exemplo:**

```yaml
services:
  - type: web
    name: api-server
    runtime: node
    plan: free
    buildCommand: npm ci
    startCommand: npm start
    branch: main
    autoDeploy: true
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 10000
````

### Serviços de trabalho (`type: trabalhador`)

Processadores de trabalhos em segundo plano, consumidores de filas. Não acessível publicamente.

**Campos obrigatórios:**

- `nome`: identificador exclusivo do serviço
- `type`: Deve ser `worker`
- `runtime`: Idioma/ambiente
- `buildCommand`: Comando para construir
- `startCommand`: Comando para iniciar o processo de trabalho

**Principais diferenças em relação aos serviços Web:**

- Sem URL público
- Sem exames de saúde
- Não é necessária ligação de porta

**Exemplo:**

```yaml
services:
  - type: worker
    name: job-processor
    runtime: python
    plan: free
    buildCommand: pip install -r requirements.txt
    startCommand: celery -A tasks worker --loglevel=info
    envVars:
      - key: REDIS_URL
        fromDatabase:
          name: redis
          property: connectionString
```

### Cron Jobs (`tipo: cron`)

Tarefas agendadas que são executadas em um agendamento cron.

**Campos obrigatórios:**

- `nome`: identificador exclusivo do serviço
- `type`: Deve ser `cron`
- `runtime`: Idioma/ambiente
- `schedule`: expressão Cron
- `buildCommand`: Comando para construir
- `startCommand`: Comando para executar dentro do cronograma

**Formato de programação:** Sintaxe cron padrão (minuto hora dia mês dia da semana)

**Exemplos:**

- `0 0 * * *` - Diariamente à meia-noite UTC
- `*/15 * * * *` - A cada 15 minutos
- `0 9 * * 1` - Todas as segundas-feiras às 9h UTC

**Exemplo:**

```yaml
services:
  - type: cron
    name: daily-backup
    runtime: node
    schedule: '0 2 * * *'
    buildCommand: npm ci
    startCommand: node scripts/backup.js
    envVars:
      - key: DATABASE_URL
        fromDatabase:
          name: postgres
          property: connectionString
```

### Sites Estáticos (`type: static` ou `type: web` com `runtime: static`)

Sirva arquivos HTML/CSS/JS estáticos via CDN.

**Campos obrigatórios:**

- `nome`: identificador exclusivo do serviço
- `tipo`: `web`
- `tempo de execução`: `estático`
- `buildCommand`: Comando para construir ativos estáticos
- `staticPublishPath`: Caminho para arquivos compilados (por exemplo, `./build`, `./dist`)

**Configuração opcional:**

- `rotas`: Regras de roteamento para SPAs
- `headers`: cabeçalhos HTTP personalizados
- `buildFilter`: filtros de caminho para gatilhos de construção

**Exemplo:**

```yaml
services:
  - type: web
    name: react-app
    runtime: static
    buildCommand: npm ci && npm run build
    staticPublishPath: ./dist
    routes:
      - type: rewrite
        source: /*
        destination: /index.html
    headers:
      - path: /*
        name: Cache-Control
        value: public, max-age=31536000, immutable
```

### Serviços Privados (`type: pserv`)

Serviços internos acessíveis apenas em sua conta Render.

**Campos obrigatórios:**

- `nome`: identificador exclusivo do serviço
- `type`: Deve ser `pserv`
- `runtime`: Idioma/ambiente
- `buildCommand`: Comando para construir
- `startCommand`: Comando para iniciar

**Casos de uso:**

- APIs internas
- Proxies de banco de dados
- Microsserviços não expostos à internet

**Exemplo:**

```yaml
services:
  - type: pserv
    name: internal-api
    runtime: go
    plan: free
    buildCommand: go build -o bin/app
    startCommand: ./bin/app
```

## Tempos de execução

### Tempos de execução nativos

**Node.js (`tempo de execução: nó`):**

- Versões: 14, 16, 18, 20, 21
- Versão padrão: 20
- Especifique a versão no campo de mecanismos `package.json`

**Python (`tempo de execução: python`):**

- Versões: 3.8, 3.9, 3.10, 3.11, 3.12
- Versão padrão: 3.11
- Especifique a versão em `runtime.txt` ou `Pipfile`

**Vá (`tempo de execução: vá`):**

- Versões: 1.20, 1.21, 1.22, 1.23
- Usa módulos go
- Versão de `go.mod`

**Ruby (`tempo de execução: ruby`):**

- Versões: 3.0, 3.1, 3.2, 3.3
- Usa empacotador
- Versão de `.ruby-version` ou `Gemfile`

**Ferrugem (`tempo de execução: ferrugem`):**

- Última versão estável
- Usa Carga

**Elixir (`tempo de execução: elixir`):**

- Última versão estável
- Usa mistura

### Tempo de execução do Docker

**Docker (`tempo de execução: docker`):**
Crie a partir de um Dockerfile em seu repositório.

**Campos adicionais:**

- `dockerfilePath`: Caminho para Dockerfile (padrão: `./Dockerfile`)
- `dockerContext`: Construa o diretório de contexto (padrão: `.`)

**Exemplo:**

```yaml
services:
  - type: web
    name: docker-app
    runtime: docker
    dockerfilePath: ./docker/Dockerfile
    dockerContext: .
    plan: free
```

**Imagem (`tempo de execução: imagem`):**
Implante imagens Docker pré-construídas de um registro.

**Campos adicionais:**

- `image`: URL da imagem (por exemplo, `registry.com/image:tag`)
- `registryCredential`: Credenciais para registros privados

**Exemplo:**

```yaml
services:
  - type: web
    name: prebuilt-app
    runtime: image
    image: myregistry.com/app:v1.2.3
    plan: free
```

## Planos de serviço

Tipos de instância disponíveis:

| Plano       | memória RAM | CPU | Preço                  |
| ----------- | ----------- | --- | ---------------------- |
| `grátis`    | 512 MB      | 0,5 | Grátis (750 horas/mês) |
| `iniciante` | 512 MB      | 0,5 | US$ 7/mês              |
| `padrão`    | 2 GB        | 1   | US$ 25/mês             |
| `pró`       | 4 GB        | 2   | $ 85/mês               |
| `pro_plus`  | 8 GB        | 4   | $ 175/mês              |

**Sempre o padrão é `plan: free`, a menos que o usuário especifique o contrário.**

## Regiões

Regiões de implantação disponíveis:

- `oregon` (Oeste dos EUA) - Padrão
- `ohio` (Leste dos EUA)
- `virginia` (Leste dos EUA)
- `Frankfurt` (UE)
- `singapura` (Ásia)

**Exemplo:**

```yaml
services:
  - type: web
    name: my-app
    runtime: node
    region: frankfurt
```

## Variáveis de ambiente

Três padrões para definir variáveis de ambiente:

### 1. Valores codificados

Para configuração não sensível:```yaml
envVars:

- key: NODE_ENV
  value: production
- key: API_URL
  value: https://api.example.com
- key: LOG_LEVEL
  value: info

````
### 2. Segredos gerados

Render gera um valor aleatório de 256 bits codificado em base64:```yaml
envVars:
  - key: SESSION_SECRET
    generateValue: true
  - key: ENCRYPTION_KEY
    generateValue: true
````

### 3. Segredos fornecidos pelo usuário

Solicitar valores ao usuário durante a criação do Blueprint:```yaml
envVars:

- key: STRIPE_SECRET_KEY
  sync: false
- key: JWT_SECRET
  sync: false
- key: API_KEY
  sync: false

````

**O sinalizador `sync: false` significa "o usuário preencherá isso no Dashboard".**

### 4. Referências de banco de dados

Link para strings de conexão do banco de dados:```yaml
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

**Imóveis disponíveis:**

- `connectionString`: URL de conexão completa
- `host`: host do banco de dados
- `porta`: porta do banco de dados
- `user`: nome de usuário do banco de dados
- `senha`: senha do banco de dados
- `banco de dados`: nome do banco de dados
- `hostport`: `host:port` combinado

### 5. Referências de serviço

Link para outros serviços:```yaml
envVars:

- key: API_URL
  fromService:
  name: api-server
  type: web
  property: host

````
### 6. Grupos de variáveis de ambiente

Grupos reutilizáveis compartilhados entre serviços:```yaml
envVarGroups:
  - name: shared-config
    envVars:
      - key: LOG_LEVEL
        value: info
      - key: ENVIRONMENT
        value: production

services:
  - type: web
    name: web-app
    runtime: node
    envVars:
      - fromGroup: shared-config
      - key: PORT
        value: 10000
````

## Bancos de dados

###PostgreSQL```yaml
databases:

- name: postgres
  databaseName: myapp_prod
  user: myapp_user
  plan: free
  postgresMajorVersion: '15'
  ipAllowList: []

````

**Planos:**

- `grátis`: 1 GB de armazenamento, 97 MB de RAM, 0,1 CPU
- `básico-256mb`, `básico-512mb`, `básico-1gb`, `básico-4gb`
- `pro-4gb`, `pro-8gb`, `pro-16gb`, etc.
- `accelerated-4gb`, `accelerated-8gb`, etc. (suportado por SSD)

**Campos-chave:**

- `name`: Identificador para referências
- `databaseName`: nome real do banco de dados PostgreSQL
- `user`: nome de usuário do banco de dados
- `postgresMajorVersion`: versão do PostgreSQL (11-16)
- `ipAllowList`: Array de blocos CIDR (vazio = somente interno)
- `diskSizeGB`: Tamanho de armazenamento (somente planos pagos)

**Alta disponibilidade (planos pagos):**

```yaml
databases:
  - name: postgres
    databaseName: myapp_prod
    plan: pro-4gb
    highAvailabilityEnabled: true
````

**Leia réplicas (planos pagos):**

```yaml
databases:
  - name: postgres
    databaseName: myapp_prod
    plan: pro-4gb
    readReplicas:
      - name: read-replica-1
        region: ohio
      - name: read-replica-2
        region: frankfurt
```

### Redis (armazenamento de valor-chave)```yaml

databases:

- name: redis
  plan: free
  maxmemoryPolicy: allkeys-lru
  ipAllowList: []

````

**Planos:** Igual ao PostgreSQL

**opções de maxmemoryPolicy:**

- `allkeys-lru`: Remove as chaves usadas menos recentemente
- `volatile-lru`: Remove chaves LRU com TTL
- `allkeys-random`: Remove chaves aleatórias
- `volatile-random`: Remove chaves aleatórias com TTL
- `volatile-ttl`: Despeja chaves com o TTL mais rápido
- `noeviction`: Retorna erros quando a memória está cheia

## Dimensionamento

### Dimensionamento manual

Número fixo de instâncias:```yaml
services:
  - type: web
    name: my-app
    runtime: node
    plan: standard
    numInstances: 3
````

### Escalonamento automático

Dimensionamento dinâmico baseado em CPU/memória (é necessário espaço de trabalho profissional):```yaml
services:

- type: web
  name: my-app
  runtime: node
  plan: standard
  scaling:
  minInstances: 1
  maxInstances: 5
  targetCPUPercent: 60
  targetMemoryPercent: 70

````

**Notas:**

- Escalonamento automático desativado em ambientes de visualização
- Ambientes de visualização executam a contagem de `minInstances`
- Requer espaço de trabalho profissional ou superior

## Verificações de integridade

Configure pontos de extremidade de verificação de integridade:```yaml
services:
  - type: web
    name: my-app
    runtime: node
    healthCheckPath: /health
````

**Padrão:** `/` (caminho raiz)

**Recomendado:** Adicione um endpoint `/health` dedicado que retorne `200 OK`.

## Construir filtros

Controle quando as compilações são acionadas com base nos arquivos alterados:```yaml
services:

- type: web
  name: frontend
  runtime: static
  buildFilter:
  paths: - frontend/**
  ignoredPaths: - frontend/README.md - frontend/**/\*.test.js

````

**Comportamento:**

- Se `paths` for especificado: Construa somente quando os arquivos nesses caminhos forem alterados
- Se `ignoredPaths` for especificado: não compilar quando apenas arquivos ignorados forem alterados

## Projetos e Ambientes

Organize os serviços em projetos com vários ambientes:```yaml
projects:
  - name: my-application
    environments:
      - name: production
        services:
          - type: web
            name: prod-api
            runtime: node
            plan: pro
            buildCommand: npm ci
            startCommand: npm start
        databases:
          - name: prod-postgres
            plan: pro-4gb
        networking:
          isolation: enabled
        permissions:
          protection: enabled

      - name: staging
        services:
          - type: web
            name: staging-api
            runtime: node
            plan: starter
            buildCommand: npm ci
            startCommand: npm start
        databases:
          - name: staging-postgres
            plan: free
````

**Características do ambiente:**

- `networking.isolation`: Habilita o isolamento de rede entre ambientes
- `permissions.protection`: Requer aprovação para alterações no ambiente

## Visualizar ambientes

Configure ambientes de visualização automática para solicitações pull:```yaml
previews:
generation: auto_preview # auto_preview | manual | none

````

**Opções:**

- `auto_preview`: Crie um ambiente de visualização para cada PR automaticamente
- `manual`: o usuário aciona manualmente a criação da visualização
- `none`: Desativa ambientes de visualização

## Exemplo completo

Blueprint completo com vários serviços e bancos de dados:```yaml
services:
  # Web service
  - type: web
    name: web-app
    runtime: node
    plan: free
    region: oregon
    buildCommand: npm ci && npm run build
    startCommand: npm start
    branch: main
    autoDeploy: true
    healthCheckPath: /health
    envVars:
      - key: NODE_ENV
        value: production
      - key: DATABASE_URL
        fromDatabase:
          name: postgres
          property: connectionString
      - key: REDIS_URL
        fromDatabase:
          name: redis
          property: connectionString
      - key: JWT_SECRET
        sync: false

  # Background worker
  - type: worker
    name: queue-worker
    runtime: node
    plan: free
    buildCommand: npm ci
    startCommand: node worker.js
    envVars:
      - key: REDIS_URL
        fromDatabase:
          name: redis
          property: connectionString

  # Cron job
  - type: cron
    name: daily-cleanup
    runtime: node
    schedule: '0 3 * * *'
    buildCommand: npm ci
    startCommand: node scripts/cleanup.js
    envVars:
      - key: DATABASE_URL
        fromDatabase:
          name: postgres
          property: connectionString

  # Static frontend
  - type: web
    name: frontend
    runtime: static
    buildCommand: npm ci && npm run build
    staticPublishPath: ./dist
    routes:
      - type: rewrite
        source: /*
        destination: /index.html

databases:
  - name: postgres
    databaseName: app_production
    user: app_user
    plan: free
    postgresMajorVersion: '15'
    ipAllowList: []

  - name: redis
    plan: free
    maxmemoryPolicy: allkeys-lru
    ipAllowList: []
````

## Validação

Valide seu Blueprint antes de implantar (quando o comando CLI estiver disponível):```bash
render blueprint validate

```

**Erros comuns de validação:**

- Campos obrigatórios ausentes
- Valores de tempo de execução inválidos
- Referências incorretas de variáveis de ambiente
- Expressões cron inválidas
- Sintaxe YAML inválida

## Melhores práticas

1. **Sempre use `plan: free` por padrão** - Permita que os usuários atualizem se necessário
2. **Marque todos os segredos com `sync: false`** - Nunca codifique valores confidenciais
3. **Use `fromDatabase` para URLs de banco de dados** - Cadeias de conexão internas automáticas
4. **Adicionar endpoints de verificação de integridade** – Detecção de implantação mais rápida
5. **Use comandos de compilação não interativos** - Evita travamentos de compilação
6. **Vincular a `0.0.0.0:$PORT`** - Obrigatório para serviços web
7. **Use variável de ambiente

grupos** - Compartilhe configurações entre serviços
8. **Ativar autoDeploy: true** - Implantar automaticamente no push
9. **Defina as regiões apropriadas** - Escolha as mais próximas dos seus usuários
10. **Use filtros de compilação** - Otimize gatilhos de compilação em monorepos

## Recursos Adicionais

- Especificação oficial do Blueprint: https://render.com/docs/blueprint-spec
- Documentação CLI de renderização: https://render.com/docs/cli
- Guia de variáveis de ambiente: https://render.com/docs/environment-variables
```
