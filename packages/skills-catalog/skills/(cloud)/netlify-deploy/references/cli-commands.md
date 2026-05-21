# Referência de comandos CLI do Netlify

Referência rápida para comandos CLI Netlify comuns usados em implantações.

## Autenticação```bash

# Login via browser OAuth

npx netlify login

# Check authentication status and site link

npx netlify status

# Logout

npx netlify logout

````
## Gerenciamento de sites```bash
# Link current directory to existing site
npx netlify link

# Link by Git remote URL
npx netlify link --git-remote-url <url>

# Create and link new site
npx netlify init

# Unlink from current site
npx netlify unlink

# Open site in Netlify dashboard
npx netlify open

# Open site admin panel
npx netlify open:admin

# Open site in browser
npx netlify open:site
````

## Implantação```bash

# Deploy preview/draft (safe for testing)

npx netlify deploy

# Deploy to production

npx netlify deploy --prod

# Deploy with specific directory

npx netlify deploy --dir=dist

# Deploy with message

npx netlify deploy --message="Deploy message"

# List all deploys

npx netlify deploy:list

````
## Desenvolvimento```bash
# Run local dev server with Netlify features
npx netlify dev

# Run local dev server on specific port
npx netlify dev --port 3000
````

## Informações do site```bash

# Get site info

npx netlify sites:list

# Get current site info

npx netlify api getSite --data '{"site_id": "YOUR_SITE_ID"}'

````
## Variáveis ​​de ambiente```bash
# List environment variables
npx netlify env:list

# Set environment variable
npx netlify env:set KEY value

# Get environment variable value
npx netlify env:get KEY

# Import env vars from file
npx netlify env:import .env
````

## Construir```bash

# Show build settings

npx netlify build --dry

# Run build locally

npx netlify build

````
## Funções (sem servidor)```bash
# List functions
npx netlify functions:list

# Invoke function locally
npx netlify functions:invoke FUNCTION_NAME

# Create new function
npx netlify functions:create FUNCTION_NAME
````

## Registros```bash

# Stream function logs

npx netlify logs

# View logs for specific function

npx netlify logs:function FUNCTION_NAME

````
## Comandos de solução de problemas```bash
# Check CLI version
npx netlify --version

# Get help for any command
npx netlify help [command]

# Check status with verbose output
npx netlify status --verbose
````

## Códigos de saída

- `0` - Sucesso
- `1` - Erro geral
- `2` - Erro de autenticação
- `3` - Site não encontrado
- `4` - Falha na compilação

## Sinalizadores Comuns

- `--json` - Saída como JSON
- `--silent` - Suprime a saída
- `--debug` - Mostra informações de depuração
- `--force` - Ignora os prompts de confirmação

## Recursos

- Documentação CLI completa: https://docs.netlify.com/cli/get-started/
- Repositório CLI GitHub: https://github.com/netlify/cli
