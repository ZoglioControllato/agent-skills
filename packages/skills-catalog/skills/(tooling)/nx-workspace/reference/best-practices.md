# Melhores práticas Nx

## O que fazer ✅

### Use tags de forma consistente

Aplique tags significativas para impor os limites do módulo:```json
{
"tags": ["type:feature", "scope:web"]
}

````
Benefícios:

- Evita dependências circulares
- Aplica padrões arquitetônicos
- Torna o gráfico de dependência mais claro

### Habilite o cache antecipadamente

Configure o cache desde o início:```json
{
  "targetDefaults": {
    "build": {
      "cache": true,
      "inputs": ["production", "^production"]
    }
  }
}
````

Benefícios:

- Redução de 50-80% do tempo de CI
- Desenvolvimento local mais rápido
- Melhor utilização de recursos

### Mantenha as bibliotecas focadas

Cada biblioteca deve ter responsabilidade única:```bash

# Good - Focused libraries

libs/
ui/
buttons/
forms/
data-access/
users/
products/

# Avoid - Mixed concerns

libs/
shared/ # Too broad
everything.ts

````
### Usar comandos afetados

Sempre teste apenas o que mudou:```bash
# In CI
nx affected -t test --base=main

# Not
nx run-many -t test --all
````

### Limites do Documento

Adicione README para explicar a estrutura do módulo:```markdown

# Library Architecture

## Type Tags

- `type:feature` - Business logic
- `type:ui` - Components
- `type:data-access` - API calls

## Scope Tags

- `scope:web` - Web app specific
- `scope:mobile` - Mobile app specific
- `scope:shared` - Shared across apps

````
### Sempre use `nx show project`

Obtenha a configuração completa resolvida:```bash
# Correct
nx show project my-app --json

# Wrong - incomplete config
cat apps/my-app/project.json
````

## O que não fazer ❌

### Não crie dependências circulares

Deps circulares quebram a ordem de construção:```bash

# Bad

lib-a → lib-b → lib-a # Circular!

# Good

lib-a → lib-b → lib-c # Acyclic

````
Verifique com:```bash
nx graph
````

### Não ignore os afetados no CI

Executar todos os testes desperdiça recursos:```bash

# Wasteful in CI

nx run-many -t test --all # ❌

# Efficient

nx affected -t test # ✅

````
### Não ignore as regras de limite

As violações de limites acumulam dívida técnica:```bash
# Fix violations immediately
nx lint --fix

# Don't disable rules
"@nx/enforce-module-boundaries": "off"  # ❌
````

### Não granular demais

Muitas bibliotecas pequenas criam sobrecarga:```bash

# Too granular

libs/
utils/
add/ # Just one function
subtract/ # Just one function

# Better

libs/
utils/
math/ # Related functions together

````
### Não leia project.json diretamente

Ele contém apenas configuração parcial:```bash
# Wrong
cat project.json  # ❌

# Correct
nx show project my-app --json  # ✅
````

## Solução de problemas

### Gerenciador de pacotes não detectado

**Problema**: Nx não detecta gerenciador de pacotes

**Solução**: verifique se o arquivo de bloqueio existe

- npm: `package-lock.json`
- fio: `yarn.lock`
- pnpm: `pnpm-lock.yaml`

### Alvos não exibidos

**Problema**: Alvos ausentes em `nx show projects`

**Causa**: Lendo project.json em vez da configuração resolvida

**Solução**:```bash
nx show project <name> --json | jq '.targets'

````
### Comandos afetados não funcionam

**Problema**: Todos os projetos mostrados como afetados

**Causas**:

1. Faltando histórico do git
2. Ramificação base errada

**Soluções**:```bash
# In CI: fetch full history
- uses: actions/checkout@v4
  with:
    fetch-depth: 0

# Specify correct base
nx affected -t test --base=origin/main
````

### Cache não funciona

**Problema**: as tarefas sempre são executadas novamente

**Causas**:

1. Cache desativado
2. Entradas não configuradas
3. Cache corrompido

**Soluções**:```bash

# Check if cache enabled

cat nx.json | jq '.targetDefaults.build.cache'

# Clear cache

nx reset

# Configure inputs

{
"targetDefaults": {
"build": {
"cache": true,
"inputs": ["production", "^production"]
}
}
}

````
### Erros de dependência circular

**Problema**: a compilação falha com dependência circular

**Detecção**:```bash
nx graph
````

**Solução**:

1. Encontre o ciclo no gráfico de dependência
2. Extraia o código compartilhado para uma nova biblioteca
3. Atualize as importações para interromper o ciclo

### Violações de limite do módulo

**Problema**: a importação viola as regras de limite

**Erro**:```
A project tagged with "scope:web" can only depend on libs tagged with "scope:web", "scope:shared"

````

**Soluções**:```bash
# Check current tags
nx show project my-lib --json | jq '.tags'

# Update tags in project.json
{
  "tags": ["scope:shared"]  # Allow cross-scope import
}

# Or move code to allowed scope
````

### Problemas de desempenho de compilação

**Problema**: as compilações são lentas

**Soluções**:

1. Habilite o cache:```json
   {
   "targetDefaults": {
   "build": {
   "cache": true
   }
   }
   }

````
1. Uso afetado:```bash
nx affected -t build --base=main
````

1. Aumente a paralelização:```bash
   nx affected -t build --parallel=5

````
1. Habilite Nx Cloud:```json
{
  "tasksRunnerOptions": {
    "default": {
      "runner": "nx-cloud"
    }
  }
}
````

### Problemas do submódulo Git

**Problema**: detecção afetada incorretamente com submódulos

**Solução**: Configuração afetada em nx.json:```json
{
"affected": {
"defaultBase": "main"
}
}

````
## Otimização de desempenho

### Habilitar cache remoto

Use Nx Cloud ou cache auto-hospedado:```json
{
  "tasksRunnerOptions": {
    "default": {
      "runner": "nx-cloud",
      "options": {
        "cacheableOperations": ["build", "lint", "test"],
        "accessToken": "your-token"
      }
    }
  }
}
````

### Configure as entradas corretamente

Defina o que afeta o cache:```json
{
"namedInputs": {
"default": ["{projectRoot}/**/*"],
"production": [
"default",
"!{projectRoot}/\*_/?(_.)+(spec|test).[jt]s?(x)?"
]
}
}

````
### Usar execução paralela

Aproveite CPUs multi-core:```bash
# Local development
nx affected -t test --parallel=3

# CI with more resources
nx affected -t test --parallel=5
````

### Otimize o tamanho do pacote

Configure compilações de produção:```json
{
"configurations": {
"production": {
"optimization": true,
"sourceMap": false,
"extractLicenses": true,
"namedChunks": false
}
}
}

````
## Guia de migração

### De Lerna a Nx```bash
# Add Nx to existing Lerna monorepo
npx nx@latest init

# Migrate Lerna commands
lerna run test → nx run-many -t test --all
lerna run test --since → nx affected -t test
````

### Da CLI Angular para Nx```bash

# Add Nx to Angular workspace

npx nx@latest init

# Continue using Angular CLI commands

ng build → nx build
ng serve → nx serve

````
### Atualizando Nx```bash
# Check for updates
nx migrate latest

# Review migrations
cat migrations.json

# Run migrations
nx migrate --run-migrations

# Clean up
rm migrations.json
````
