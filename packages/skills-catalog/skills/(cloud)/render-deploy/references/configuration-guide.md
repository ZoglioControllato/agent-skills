# Guia de configuração de renderização

Padrões de configuração comuns, práticas recomendadas e solução de problemas para implantações de Render.

## Variáveis de ambiente

### Variáveis obrigatórias versus variáveis opcionais

**Sempre declare TODAS as variáveis de ambiente em render.yaml**, mesmo que os valores sejam fornecidos pelo usuário posteriormente.

**Três categorias:**

1. **Valores de configuração** (codificados):```yaml
   envVars:

- key: NODE_ENV
  value: production
- key: LOG_LEVEL
  value: info
- key: API_URL
  value: https://api.example.com

````
2. **Segredos** (o usuário fornece):```yaml
envVars:
  - key: JWT_SECRET
    sync: false
  - key: STRIPE_SECRET_KEY
    sync: false
  - key: API_KEY
    sync: false
````

3. **Gerado automaticamente** (a renderização fornece):```yaml
   envVars:

- key: SESSION_SECRET
  generateValue: true
- key: ENCRYPTION_KEY
  generateValue: true

````
### Padrões de conexão de banco de dados

**PostgreSQL:**

```yaml
envVars:
  - key: DATABASE_URL
    fromDatabase:
      name: postgres
      property: connectionString
````

**Redes:**

```yaml
envVars:
  - key: REDIS_URL
    fromDatabase:
      name: redis
      property: connectionString
```

**Vários bancos de dados:**

```yaml
envVars:
  - key: PRIMARY_DB_URL
    fromDatabase:
      name: postgres-primary
      property: connectionString
  - key: ANALYTICS_DB_URL
    fromDatabase:
      name: postgres-analytics
      property: connectionString
  - key: CACHE_URL
    fromDatabase:
      name: redis
      property: connectionString
```

### Referências entre serviços

Consulte outros serviços em sua conta:```yaml
services:

- type: web
  name: frontend
  runtime: node
  envVars:
  - key: API_URL
    fromService:
    name: backend-api
    type: web
    property: host # or hostport, port

- type: web
  name: backend-api
  runtime: node

````

**Imóveis disponíveis:**

- `host`: nome do host do serviço
- `porta`: Porta de serviço
- `hostport`: `host:port` combinado

### Grupos de variáveis de ambiente

Compartilhe configurações comuns entre serviços:```yaml
envVarGroups:
  - name: common-config
    envVars:
      - key: NODE_ENV
        value: production
      - key: LOG_LEVEL
        value: info
      - key: TZ
        value: UTC

services:
  - type: web
    name: web-app
    runtime: node
    envVars:
      - fromGroup: common-config
      - key: PORT
        value: 10000

  - type: worker
    name: worker
    runtime: node
    envVars:
      - fromGroup: common-config
````

---

## Ligação de porta

### O requisito de vinculação de porta

**CRÍTICO:** Os serviços da Web devem ser vinculados a `0.0.0.0:$PORT`

**Por que isso é importante:**

- Renderização define a variável de ambiente `PORT` (padrão: 10000)
- Os serviços devem ser vinculados a `0.0.0.0` (não a `localhost` ou `127.0.0.1`)
- As verificações de integridade falham se a ligação da porta estiver incorreta
- A implantação falhará ou o serviço não receberá tráfego

### Exemplos de código por idioma

**Node.js/Expresso:**

```javascript
const express = require('express')
const app = express()

const PORT = process.env.PORT || 3000

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`)
})
```

**Python/Frasco:**

```python
import os
from flask import Flask

app = Flask(__name__)

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
```

**Python/Django:**

Em `settings.py`:```python

# Django runs on port specified by environment

ALLOWED_HOSTS = ['*']

````
Comando inicial em render.yaml:```yaml
startCommand: gunicorn config.wsgi:application --bind 0.0.0.0:$PORT
````

**Python/FastAPI:**

```python
import os
import uvicorn
from fastapi import FastAPI

app = FastAPI()

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
```

Comando de início:```yaml
startCommand: uvicorn main:app --host 0.0.0.0 --port $PORT

````

**Ir:**

```go
package main

import (
    "fmt"
    "net/http"
    "os"
)

func main() {
    port := os.Getenv("PORT")
    if port == "" {
        port = "3000"
    }

    http.HandleFunc("/", handler)
    fmt.Printf("Server starting on port %s\n", port)
    http.ListenAndServe(":"+port, nil)
}
````

**Rubi/Rails:**

Em `config/puma.rb`:```ruby
port ENV.fetch("PORT") { 3000 }
bind "tcp://0.0.0.0:#{ENV.fetch('PORT', 3000)}"

````

**Ferrugem / Actix:**

```rust
use actix_web::{App, HttpServer};
use std::env;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let port = env::var("PORT").unwrap_or_else(|_| "8080".to_string());
    let addr = format!("0.0.0.0:{}", port);

    HttpServer::new(|| App::new())
        .bind(&addr)?
        .run()
        .await
}
````

---

## Comandos de construção

### Sinalizadores não interativos

**Sempre use sinalizadores não interativos** para evitar que compilações sejam interrompidas aguardando entrada.

**npm (Node.js):**

```yaml
buildCommand: npm ci
# NOT: npm install
```

**pip (Python):**

```yaml
buildCommand: pip install -r requirements.txt
# Already non-interactive
```

**apt (pacotes do sistema):**

```yaml
buildCommand: apt-get update && apt-get install -y libpq-dev
# Use -y flag to auto-confirm
```

**empacotador (Ruby):**

```yaml
buildCommand: bundle install --jobs=4 --retry=3
```

### Construa com etapas adicionais

**Node.js com etapa de construção:**

```yaml
buildCommand: npm ci && npm run build
```

**Python Django com arquivos estáticos:**

```yaml
buildCommand: pip install -r requirements.txt && python manage.py collectstatic --no-input
```

**Ruby Rails com ativos:**

```yaml
buildCommand: bundle install && bundle exec rails assets:precompile
```

### Tempo limite de construção

**Nível gratuito:** 15 minutos
**Níveis pagos:** Configurável

**Se o tempo limite da compilação:**

1. Otimize dependências (remova pacotes não utilizados)
2. Use cache de compilação
3. Considere a pré-construção em CI/CD
4. Atualize para o nível pago para tempos limite mais longos

---

## Conexões de banco de dados

### URLs internos x externos

**Use URLs internos para melhorar o desempenho:**

Ao usar `fromDatabase`, o Render fornece automaticamente URLs internos `.render-internal.com`:```yaml
envVars:

- key: DATABASE_URL
  fromDatabase:
  name: postgres
  property: connectionString

````
Isso fornece: `postgresql://user:pass@postgres.render-internal.com:5432/db`

**Benefícios:**

- Menor latência (mesmo data center)
- Sem cobranças de largura de banda externa
- DNS interno automático

### Pool de conexões

**Node.js/PostgreSQL:**

```javascript
const { Pool } = require('pg')

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: 20, // Maximum pool size
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
})
````

**Python/PostgreSQL:**

```python
import psycopg2.pool

pool = psycopg2.pool.SimpleConnectionPool(
    minconn=1,
    maxconn=20,
    dsn=os.environ['DATABASE_URL']
)
```

**Configurações do Django:**

```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'URL': os.environ['DATABASE_URL'],
        'CONN_MAX_AGE': 600,  # Connection pooling
    }
}
```

### Migrações de banco de dados

**Execute migrações durante a compilação:**

**Django:**

```yaml
buildCommand: pip install -r requirements.txt && python manage.py migrate
```

**Trilhos:**

```yaml
buildCommand: bundle install && bundle exec rails db:migrate
```

**Node.js/Prisma:**

```yaml
buildCommand: npm ci && npx prisma migrate deploy
```

---

## Limitações do nível gratuito

### O que está incluído

**O nível gratuito oferece:**

- 1 serviço web
- 1 banco de dados PostgreSQL (1 GB de armazenamento, 97 MB de RAM)
- 750 horas/mês de computação
- 512 MB de RAM por serviço
- 0,5 CPU por serviço
- 100 GB de largura de banda/mês

### Limites de recursos

**Memória (512 MB):**

- Monitore o uso de memória em logs
- Otimize para ambientes com restrição de memória
- Use dependências leves

**CPU (0,5 núcleos):**

- Adequado para aplicações de baixo tráfego
- Considere atualizar para maior tráfego

**Spin Down (serviços gratuitos):**

- Os serviços diminuem após 15 minutos de inatividade
- A primeira solicitação após a desaceleração leva cerca de 30 segundos (inicialização a frio)
- Atualize para o nível pago para serviços sempre ativos

### Quando atualizar

**Faça upgrade para o plano pago quando:**

- Precisa de mais de 1 serviço web
- Precisa de serviços sempre ativos (sem redução de velocidade)
- O tráfego excede os limites do nível gratuito
- Precisa de mais memória/CPU
- Precisa de tempos de construção mais rápidos
- Precisa de ambientes de visualização

---

## Verificações de integridade

### Adicionando endpoints de verificação de integridade

**Node.js/Expresso:**

```javascript
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  })
})
```

**Python/Frasco:**

```python
@app.route('/health')
def health():
    return {'status': 'ok'}, 200
```

**Python/FastAPI:**

```python
@app.get("/health")
async def health():
    return {"status": "ok"}
```

**Ir:**

```go
http.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
    w.WriteHeader(http.StatusOK)
    w.Write([]byte(`{"status":"ok"}`))
})
```

### Configurar em render.yaml```yaml

services:

- type: web
  name: my-app
  runtime: node
  healthCheckPath: /health

````

**Benefícios:**

- Detecção de implantação mais rápida
- Melhor monitoramento
- Reinicialização automática em caso de falhas na verificação de integridade

---

## Problemas comuns de implantação

### Problema 1: Variáveis de ambiente ausentes

**Sintoma:** O serviço falha com erros de "variável indefinida"

**Solução:** Adicione todos os env vars necessários ao render.yaml:```yaml
envVars:
  - key: DATABASE_URL
    fromDatabase:
      name: postgres
      property: connectionString
  - key: JWT_SECRET
    sync: false # User fills in Dashboard
````

### Problema 2: Erros de vinculação de porta

**Sintoma:** `EADDRINUSE` ou erros de tempo limite de verificação de integridade

**Solução:** Garanta que o aplicativo esteja vinculado a `0.0.0.0:$PORT`:```javascript
const PORT = process.env.PORT || 3000
app.listen(PORT, '0.0.0.0')

````
### Edição 3: travamentos de compilação

**Sintoma:** A compilação expira após 15 minutos

**Solução:** use comandos de compilação não interativos:```yaml
buildCommand: npm ci # NOT npm install
````

### Problema 4: falha na conexão com o banco de dados

**Sintoma:** `ECONNREFUSED` na porta 5432

**Soluções:**

1. Use `fromDatabase` para URLs internos automáticos
2. Habilite SSL para conexões externas
3. Verifique as configurações de `ipAllowList`

### Edição 5: Site Estático 404s

**Sintoma:** Rotas do lado do cliente retornam 404

**Solução:** Adicione regras de reescrita de SPA:```yaml
routes:

- type: rewrite
  source: /\*
  destination: /index.html

```
### Edição 6: Falta de memória (OOM)

**Sintoma:** O serviço falha com `pilha JavaScript sem memória`

**Soluções:**

1. Otimize o uso de memória do aplicativo
2. Reduza o tamanho da dependência
3. Atualize para um plano superior com mais RAM

---

## Lista de verificação de melhores práticas

**Variáveis de Ambiente:**

- [] Todos os env vars declarados em render.yaml
- [] Segredos marcados com `sync: false`
- [] URLs de banco de dados usam referências `fromDatabase`

**Vinculação de porta:**

- [] O aplicativo se liga a `process.env.PORT`
- [] Vincular a `0.0.0.0` (não `localhost`)

**Comandos de compilação:**

- [] Use sinalizadores não interativos (`npm ci`, `-y`, etc.)
- [] A compilação é concluída em menos de 15 minutos (nível gratuito)

**Comandos de início:**

- [] O comando inicia o servidor HTTP corretamente
- [] Servidor se liga à porta correta

**Verificações de saúde:**

- [ ] endpoint `/health` implementado
- [] Retorna o código de status 200

**Banco de dados:**

- [] Pool de conexões configurado
- [] Usando URLs internos (`.render-internal.com`)
- [] SSL ativado, se necessário

**Planos:**

- [] Usando `plan: free` por padrão
- [] Caminho de atualização documentado para usuários

**Repositório Git:**

- [] render.yaml confirmado no repositório
- [] Enviado para git remoto (GitHub/GitLab/Bitbucket)
- [] Ramificação especificada em render.yaml (se não for principal)

---

## Recursos Adicionais

- Especificação do projeto: [blueprint-spec.md](blueprint-spec.md)
- Tipos de serviço: [service-types.md](service-types.md)
- Tempos de execução: [runtimes.md](runtimes.md)
- Documentos oficiais de renderização: https://render.com/docs
```
