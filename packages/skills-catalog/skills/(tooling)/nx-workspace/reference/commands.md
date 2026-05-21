# Referência de comandos Nx

Referência completa de comandos com opções e padrões avançados.

## Listagem de Projetos

### Listagem Básica```bash

# List all projects

nx show projects

# Output as JSON

nx show projects --json

````
### Filtrando por tipo```bash
# List applications
nx show projects --type app

# List libraries
nx show projects --type lib

# List e2e projects
nx show projects --type e2e
````

### Filtrando por padrão```bash

# Glob pattern matching

nx show projects --projects "apps/_"
nx show projects --projects "shared-_"

# Multiple patterns (comma-separated)

nx show projects --projects "apps/_,libs/shared/_"

````
### Filtrando por alvo```bash
# Projects with build target
nx show projects --withTarget build

# Projects with e2e target
nx show projects --withTarget e2e

# Projects with test target
nx show projects --withTarget test
````

### Filtrando por Afetados```bash

# Affected since default base

nx show projects --affected

# Affected with explicit base

nx show projects --affected --base=main
nx show projects --affected --base=origin/main

# Affected between two commits

nx show projects --affected --base=abc123 --head=def456

# Affected by uncommitted changes

nx show projects --affected --uncommitted

# Affected by untracked files

nx show projects --affected --untracked

````
### Combinando filtros```bash
# Affected libraries with test target
nx show projects --affected --type lib --withTarget test

# Affected apps, excluding e2e
nx show projects --affected --type app --exclude="*-e2e"

# Libraries in specific scope
nx show projects --type lib --projects "libs/web/*"
````

## Configuração do Projeto

### Obtenha informações do projeto```bash

# Full resolved configuration

nx show project my-app --json

# Pretty print with jq

nx show project my-app --json | jq '.'

# Extract specific sections

nx show project my-app --json | jq '.targets'
nx show project my-app --json | jq '.targets | keys'
nx show project my-app --json | jq '.targets.build'
nx show project my-app --json | jq '.sourceRoot'
nx show project my-app --json | jq '.tags'

````
### Referências de esquema```bash
# Read workspace schema
cat node_modules/nx/schemas/nx-schema.json | jq '.properties | keys'

# Read project schema
cat node_modules/nx/schemas/project-schema.json | jq '.properties | keys'
````

## Executando Tarefas

### Execução Básica```bash

# Run target on specific project

nx <target> <project>
nx build my-app
nx test my-lib
nx lint my-app

````
### Com configuração```bash
# Run with specific configuration
nx build my-app --configuration=production
nx build my-app --configuration=development

# Short form
nx build my-app --prod
````

### Com opções```bash

# Pass options to executor

nx test my-lib --watch
nx test my-lib --coverage
nx build my-app --optimization=false

````
## Comandos afetados

### Executar tarefas afetadas```bash
# Test affected projects
nx affected -t test

# Test with explicit base
nx affected -t test --base=main

# Multiple targets
nx affected -t lint,test,build

# With parallel execution
nx affected -t test --parallel=3
nx affected -t build --parallel=5 --max-parallel=5
````

### Opções afetadas```bash

# Skip cache

nx affected -t build --skip-nx-cache

# With configuration

nx affected -t build --configuration=production

# Exclude specific projects

nx affected -t test --exclude="\*-e2e"

# Verbose output

nx affected -t build --verbose

````
## Gráfico de Dependência

### Ver gráfico```bash
# Open interactive graph
nx graph

# Affected graph only
nx affected:graph

# Focus on specific project
nx graph --focus=my-app

# Show only affected
nx graph --affected
````

### Exportar gráfico```bash

# Export as JSON

nx graph --file=graph.json

# Export as HTML

nx graph --file=graph.html

````
## Gerenciamento de cache

### Comandos de cache```bash
# Reset cache
nx reset

# Clear specific cache
rm -rf .nx/cache

# View cache statistics
nx show projects --json | jq '[.[] | {name, targets: .targets | keys}]'
````

## Comandos do Gerador

### Gerar Biblioteca```bash

# React library

nx g @nx/react:lib my-lib

# With directory

nx g @nx/react:lib my-lib --directory=libs/shared

# With tags

nx g @nx/react:lib feature-auth \
 --directory=libs/web \
 --tags=type:feature,scope:web

# Dry run

nx g @nx/react:lib my-lib --dry-run

````
### Gerar aplicativo```bash
# React app
nx g @nx/react:app my-app

# Next.js app
nx g @nx/next:app my-app

# With tags and routing
nx g @nx/react:app my-app \
  --tags=type:app,scope:web \
  --routing
````

### Gerar componente```bash

# React component

nx g @nx/react:component my-component --project=my-lib

# With directory

nx g @nx/react:component button \
 --project=ui-components \
 --directory=src/lib/buttons

````
## Análise do espaço de trabalho

### Encontre Dependências```bash
# Find what depends on a library
grep -r "from '@myorg/my-lib'" --include="*.ts" --include="*.tsx" apps/ libs/

# Find imports in specific project
grep -r "from '@myorg/" apps/my-app/src --include="*.ts"
````

### Analisar raiz do projeto```bash

# Find project root

nx show project my-app --json | jq '.root'

# List all project roots

nx show projects --json | jq '.[] | {name, root}'

````
### Verifique o motivo afetado```bash
# See what changed
git diff --name-only main

# See which files belong to project
nx show project my-app --json | jq '.sourceRoot'
````

## Migrações

### Atualizar Nx```bash

# Migrate to latest

nx migrate latest

# Migrate to specific version

nx migrate 18.0.0

# Run migrations

nx migrate --run-migrations

````
## Atalhos do espaço de trabalho```bash
# Run all tests
nx run-many -t test --all

# Run multiple targets on all projects
nx run-many -t lint,test --all

# Run on specific projects
nx run-many -t build --projects=app1,app2,lib1

# With parallel execution
nx run-many -t build --all --parallel=3
````

## Fluxos de trabalho comuns

### Desenvolvimento```bash

# Start dev server

nx serve my-app

# With specific port

nx serve my-app --port=4300

# With proxy configuration

nx serve my-app --proxy-config=proxy.conf.json

````
### Teste```bash
# Run tests
nx test my-lib

# With watch mode
nx test my-lib --watch

# With coverage
nx test my-lib --coverage

# Run all tests
nx run-many -t test --all
````

### Prédio```bash

# Build for production

nx build my-app --configuration=production

# Build all apps

nx run-many -t build --projects=tag:type:app

# Build affected

nx affected -t build --base=main

```

```
