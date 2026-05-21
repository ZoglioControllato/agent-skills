# Opções de tempo de execução de renderização

Guia completo para tempos de execução disponíveis no Render, incluindo versões, configuração e práticas recomendadas para cada linguagem.

## Tempos de execução em idioma nativo

### Node.js (`tempo de execução: nó`)

**Versões suportadas:** 14, 16, 18, 20, 21
**Versão padrão:** 20

**Especificação da versão:**

Especifique a versão do Node em `package.json`:```json
{
"engines": {
"node": "20.x"
}
}

````

**Gerenciadores de pacotes:**

- **npm**: Padrão, usa `package-lock.json`
- **Yarn**: detectado automaticamente se `yarn.lock` existir
- **pnpm**: detectado automaticamente se `pnpm-lock.yaml` existir

**Comandos de compilação comuns:**

```bash
npm ci                          # Recommended (faster, reproducible)
npm ci && npm run build         # Build step included
yarn install --frozen-lockfile  # Yarn equivalent
pnpm install --frozen-lockfile  # pnpm equivalent
````

**Comandos de início comuns:**

```bash
npm start                       # Uses "start" script in package.json
node server.js                  # Direct file execution
node dist/main.js               # Built output
```

**Estruturas populares:**

- Express.js, Fastify, Koa (APIs)
- Next.js (reação de pilha completa)
- Nest.js (TypeScript corporativo)
- Remix (Reação full-stack)
- Nuxt.js (Vue de pilha completa)

**Exemplo de configuração:**

```yaml
type: web
name: node-app
runtime: node
buildCommand: npm ci && npm run build
startCommand: npm start
```

---

### Python (`tempo de execução: python`)

**Versões suportadas:** 3.8, 3.9, 3.10, 3.11, 3.12
**Versão padrão:** 3.11

**Especificação da versão:**

Opção 1 - `runtime.txt`:```
python-3.11.5

````
Opção 2 - `Pipfile`:```toml
[requires]
python_version = "3.11"
````

**Gerenciadores de pacotes:**

- **pip**: Padrão, usa `requirements.txt`
- **Poesia**: detectado automaticamente se `pyproject.toml` existir
- **Pipenv**: detectado automaticamente se `Pipfile` existir

**Comandos de compilação comuns:**

```bash
pip install -r requirements.txt
pip install -r requirements.txt && python manage.py collectstatic --no-input
poetry install --no-dev
pipenv install --deploy
```

**Comandos de início comuns:**

```bash
gunicorn app:app                                    # Flask
gunicorn config.wsgi:application                    # Django
uvicorn main:app --host 0.0.0.0 --port $PORT       # FastAPI
celery -A tasks worker                              # Celery worker
```

**Estruturas populares:**

- Django (framework web full-stack)
- Frasco (microestrutura)
- FastAPI (estrutura moderna de API assíncrona)
- Aipo (fila de tarefas)

**Exemplo de configuração:**

```yaml
type: web
name: python-app
runtime: python
buildCommand: pip install -r requirements.txt
startCommand: gunicorn app:app --bind 0.0.0.0:$PORT
```

---

### Vá (`tempo de execução: vá`)

**Versões suportadas:** 1.20, 1.21, 1.22, 1.23
**Versão padrão:** Última versão estável

**Especificação da versão:**

Especifique em `go.mod`:```go
module myapp

go 1.22

````

**Build System:** usa módulos Go

**Comandos de compilação comuns:**

```bash
go build -o bin/app .
go build -o bin/app cmd/server/main.go
go build -tags netgo -ldflags '-s -w' -o bin/app
````

**Comandos de início comuns:**

```bash
./bin/app
./bin/server
```

**Estruturas populares:**

- net/http (biblioteca padrão)
- Gin (framework web rápido)
- Echo (estrutura de alto desempenho)
- Chi (roteador leve)
- Fibra (estrutura inspirada no Express)
- Gorilla Mux (roteador poderoso)

**Exemplo de configuração:**

```yaml
type: web
name: go-app
runtime: go
buildCommand: go build -o bin/app .
startCommand: ./bin/app
```

---

### Ruby (`tempo de execução: ruby`)

**Versões suportadas:** 3.0, 3.1, 3.2, 3.3
**Versão padrão:** 3.3

**Especificação da versão:**

Opção 1 - `.ruby-version`:```
3.3.0

````
Opção 2 - `Gemfile`:```ruby
ruby '3.3.0'
````

**Gerenciador de Pacotes:** Bundler (usa `Gemfile` e `Gemfile.lock`)

**Comandos de compilação comuns:**

```bash
bundle install --jobs=4 --retry=3
bundle install && bundle exec rails assets:precompile
```

**Comandos de início comuns:**

```bash
bundle exec rails server -b 0.0.0.0 -p $PORT
bundle exec puma -C config/puma.rb
bundle exec rackup -o 0.0.0.0 -p $PORT
bundle exec sidekiq                                  # Worker
```

**Estruturas populares:**

- Ruby on Rails (framework fullstack)
- Sinatra (microestrutura)
- Sidekiq (trabalhos em segundo plano)

**Exemplo de configuração:**

```yaml
type: web
name: rails-app
runtime: ruby
buildCommand: bundle install && bundle exec rails assets:precompile
startCommand: bundle exec puma -C config/puma.rb
```

---

### Ferrugem (`tempo de execução: ferrugem`)

**Versões suportadas:** Última versão estável
**Versão padrão:** Última versão estável

**Sistema de construção:** Carga

**Comandos de compilação comuns:**

```bash
cargo build --release
cargo build --release --locked
```

**Comandos de início comuns:**

```bash
./target/release/myapp
```

**Estruturas populares:**

- Actix Web (poderoso, de alto desempenho)
- Rocket (framework web com foco em usabilidade)
- Axum (estrutura moderna e ergonômica)
- Warp (framework web combinável)

**Exemplo de configuração:**

```yaml
type: web
name: rust-app
runtime: rust
buildCommand: cargo build --release
startCommand: ./target/release/myapp
```

---

### Elixir (`tempo de execução: elixir`)

**Versões suportadas:** Última versão estável
**Versão padrão:** Última versão estável

**Sistema de construção:** Mistura

**Comandos de compilação comuns:**

```bash
mix deps.get --only prod
mix deps.get && mix compile
mix do deps.get, compile, assets.deploy
```

**Comandos de início comuns:**

```bash
mix phx.server
elixir --name myapp -S mix phx.server
```

**Estruturas populares:**

- Phoenix (framework web full-stack)
- Phoenix LiveView (aplicativos em tempo real)

**Exemplo de configuração:**

```yaml
type: web
name: elixir-app
runtime: elixir
buildCommand: mix deps.get --only prod && mix compile
startCommand: mix phx.server
```

---

## Tempos de execução do contêiner

### Docker (`tempo de execução: docker`)

Crie seu aplicativo a partir de um Dockerfile em seu repositório.

**Configuração Adicional:**

- `dockerfilePath`: Caminho para Dockerfile (padrão: `./Dockerfile`)
- `dockerContext`: Construa o diretório de contexto (padrão: `.`)

**Exemplo de configuração:**

```yaml
type: web
name: docker-app
runtime: docker
dockerfilePath: ./Dockerfile
dockerContext: .
```

**Exemplo de Dockerfile de vários estágios:**

```dockerfile
# Build stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY package*.json ./
RUN npm ci --only=production
EXPOSE 10000
CMD ["node", "dist/main.js"]
```

**Práticas recomendadas:**

- Use compilações de vários estágios para reduzir o tamanho da imagem
- Copie `package.json` antes do código-fonte (melhor armazenamento em cache)
- Use `.dockerignore` para excluir arquivos desnecessários
- Expor a porta dinamicamente através da variável de ambiente `$PORT`
- Execute como usuário não root para segurança

---

### Imagem pré-construída (`runtime: image`)

Implante imagens Docker pré-criadas a partir de um registro de contêiner.

**Configuração Adicional:**

- `image`: URL completo da imagem com tag ou resumo
- `registryCredential`: Credenciais para registros privados

**Exemplo com imagem pública:**

```yaml
type: web
name: prebuilt-app
runtime: image
image: ghcr.io/myorg/myapp:v1.2.3
```

**Exemplo com Registro Privado:**

```yaml
type: web
name: private-app
runtime: image
image: myregistry.com/myapp:latest
registryCredential:
  username: my-username
  password:
    sync: false # User provides in Dashboard
```

**Casos de uso:**

- Implantar imagens criadas em pipeline de CI/CD
- Use imagens de registros de contêineres
- Implantar imagens Docker Hub
- Use imagens de registro privado

---

## Tempo de execução estático (`tempo de execução: estático`)

Sirva arquivos estáticos pré-construídos sem tempo de execução de back-end. Os arquivos são servidos via CDN.

**Configuração Adicional:**

- `staticPublishPath`: Diretório contendo arquivos compilados (por exemplo, `./dist`, `./build`)

**Comandos de compilação comuns por Framework:**

**Reagir (criar aplicativo React):**

```bash
npm ci && npm run build
# Outputs to: ./build
```

**Ver:**

```bash
npm ci && npm run build
# Outputs to: ./dist
```

**Next.js (exportação estática):**

```bash
npm ci && npm run build && npm run export
# Outputs to: ./out
```

**Gatsby:**

```bash
npm ci && npm run build
# Outputs to: ./public
```

**Visite:**

```bash
npm ci && npm run build
# Outputs to: ./dist
```

**Exemplo de configuração:**

```yaml
type: web
name: react-app
runtime: static
buildCommand: npm ci && npm run build
staticPublishPath: ./build
```

---

## Comparação de tempo de execução

| Tempo de execução | Velocidade de construção | Início a frio | Melhor para                        |
| ----------------- | ------------------------ | ------------- | ---------------------------------- |
| Node.js           | Rápido                   | Rápido        | APIs, aplicativos full-stack       |
| Pitão             | Médio                    | Médio         | Aplicativos de dados, APIs, web    |
| Vá                | Rápido                   | Muito rápido  | APIs de alto desempenho            |
| Rubi              | Lento                    | Médio         | Aplicativos Rails, web tradicional |
| Ferrugem          | Muito S                  |

baixo | Muito rápido | Serviços de desempenho crítico |
| Elixir | Médio | Rápido | Aplicativos simultâneos em tempo real |
| Docker | Varia | Médio | Qualquer idioma, configuração personalizada |
| Estático | Muito rápido | N/A | SPAs, documentação, marketing |

---

## Escolhendo o tempo de execução correto

**Escolha Node.js quando:**

- Construindo aplicativos baseados em JavaScript
- Precisa de um ecossistema npm rico
- Deseja iteração e implantação rápidas
- Construção de aplicações full-stack (Next.js, Remix)

**Escolha Python quando:**

- Criação de aplicativos com muitos dados
- Precisa de bibliotecas de aprendizado de máquina
- Experiência em Django ou Flask
- Pipelines de processamento de dados

**Escolha Ir quando:**

- Precisa de alto desempenho e baixo uso de recursos
- Construindo microsserviços
- Deseja implantação simples (binário único)
- Lidando com alta simultaneidade

**Escolha Ruby quando:**

- Construindo aplicações web tradicionais
- Experiência em Ruby on Rails
- Prioridade de desenvolvimento rápido

**Escolha Ferrugem quando:**

- Desempenho máximo necessário
- Programação de sistemas
- Ambientes com recursos limitados

**Escolha o Docker quando:**

- Precisa de dependências de sistema personalizadas
- Aplicativo multilíngue
- Dockerfile existente
- Precisa de controle total sobre o ambiente

**Escolha Estático quando:**

- Construção de SPAs ou sites estáticos
- Não é necessário processamento de back-end
- Deseja cache CDN e entrega rápida
- Documentação ou sites de marketing
