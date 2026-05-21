# Referência de configuração netlify.toml

Arquivo de configuração para compilações e implantações do Netlify.

## Estrutura Básica```toml

[build]
command = "npm run build"
publish = "dist"

````
## Configurações de compilação

### Configuração Comum```toml
[build]
  # Command to build your site
  command = "npm run build"

  # Directory to publish (relative to repo root)
  publish = "dist"

  # Functions directory
  functions = "netlify/functions"

  # Base directory (if not repo root)
  base = "packages/frontend"

  # Ignore builds for specific conditions
  ignore = "git diff --quiet HEAD^ HEAD package.json"
````

## Variáveis ​​de ambiente```toml

[build.environment]
NODE_VERSION = "18"
NPM_FLAGS = "--prefix=/dev/null"

[context.production.environment]
NODE_ENV = "production"

````
## Detecção de estrutura

O Netlify detecta automaticamente estruturas, mas você pode substituir:

### Próximo.js```toml
[build]
  command = "npm run build"
  publish = ".next"
````

### Reagir (Vite)```toml

[build]
command = "npm run build"
publish = "dist"

````
### Vista```toml
[build]
  command = "npm run build"
  publish = "dist"
````

### Astro```toml

[build]
command = "npm run build"
publish = "dist"

````
### Kit Svelte```toml
[build]
  command = "npm run build"
  publish = "build"
````

## Redirecionamentos e reescritas```toml

[[redirects]]
from = "/old-path"
to = "/new-path"
status = 301

[[redirects]]
from = "/api/\*"
to = "https://api.example.com/:splat"
status = 200

# SPA fallback (for client-side routing)

[[redirects]]
from = "/\*"
to = "/index.html"
status = 200

````
## Cabeçalhos```toml
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    Content-Security-Policy = "default-src 'self'"

[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
````

## Configuração específica do contexto

Implante configurações diferentes por contexto:```toml

# Production

[context.production]
command = "npm run build:prod"
[context.production.environment]
NODE_ENV = "production"

# Deploy previews

[context.deploy-preview]
command = "npm run build:preview"

# Branch deploys

[context.branch-deploy]
command = "npm run build:staging"

# Specific branch

[context.staging]
command = "npm run build:staging"

````
## Configuração de funções```toml
[functions]
  directory = "netlify/functions"
  node_bundler = "esbuild"

[[functions]]
  path = "/api/*"
  function = "api"
````

## Construir plug-ins```toml

[[plugins]]
package = "@netlify/plugin-lighthouse"

[plugins.inputs]
output_path = "reports/lighthouse.html"

[[plugins]]
package = "netlify-plugin-submit-sitemap"

[plugins.inputs]
baseUrl = "https://example.com"
sitemapPath = "/sitemap.xml"

````
## Funções de borda```toml
[[edge_functions]]
  function = "geolocation"
  path = "/api/location"
````

## Processamento```toml

[build.processing]
skip_processing = false

[build.processing.css]
bundle = true
minify = true

[build.processing.js]
bundle = true
minify = true

[build.processing.html]
pretty_urls = true

[build.processing.images]
compress = true

````
## Padrões Comuns

### Aplicativo de página única (SPA)```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
````

### Monorepo com diretório base```toml

[build]
base = "packages/web"
command = "npm run build"
publish = "dist"

````
### Múltiplos Redirecionamentos com Roteamento Baseado no País```toml
[[redirects]]
  from = "/"
  to = "/uk"
  status = 302
  conditions = {Country = ["GB"]}

[[redirects]]
  from = "/"
  to = "/us"
  status = 302
  conditions = {Country = ["US"]}
````

## Validação

Valide seu netlify.toml:```bash
npx netlify build --dry

```
## Recursos

- Referência completa de configuração: https://docs.netlify.com/configure-builds/file-based-configuration/
- Guias específicos da estrutura: https://docs.netlify.com/frameworks/
```
