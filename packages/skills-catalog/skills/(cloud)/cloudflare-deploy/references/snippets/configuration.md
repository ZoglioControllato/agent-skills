# Snippets Configuration Guide

## Configuration Methods

### 1. Dashboard (GUI)

**Best for**: Quick tests, single snippets, visual rule building

```
1. Go to zone → Rules → Snippets
2. Click "Create Snippet" or select template
3. Enter snippet name (a-z, 0-9, _ only, cannot change later)
4. Write JavaScript code (32KB max)
5. Configure snippet rule:
   - Expression Builder (visual) or Expression Editor (text)
   - Use Ruleset Engine filter expressions
6. Test with Preview/HTTP tabs
7. Deploy or Save as Draft
```

### 2. REST API

**Best for**: CI/CD, automation, programmatic management

```bash
# Create/update snippet
curl "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/snippets/$SNIPPET_NAME" \
  --request PUT \
  --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
  --form "files=@example.js" \
  --form "metadata={\"main_module\": \"example.js\"}"

# Create snippet rule
curl "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/snippets/snippet_rules" \
  --request PUT \
  --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
  --header "Content-Type: application/json" \
  --data '{
    "rules": [
      {
        "description": "Trigger snippet on /api paths",
        "enabled": true,
        "expression": "starts_with(http.request.uri.path, \"/api/\")",
        "snippet_name": "api_snippet"
      }
    ]
  }'

# List snippets
curl "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/snippets" \
  --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN"

# Delete snippet
curl "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/snippets/$SNIPPET_NAME" \
  --request DELETE \
  --header "Authorization: Bearer $CLOUDFLARE_API_TOKEN"
```

### 3. Terraform

**Best for**: Infrastructure-as-code, multi-zone deployments

```hcl
# Configure Terraform provider
terraform {
  required_providers {
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 4.0"
    }
  }
}

provider "cloudflare" {
  api_token = var.cloudflare_api_token
}

# Create snippet
resource "cloudflare_snippet" "security_headers" {
  zone_id = var.zone_id
  name    = "security_headers"

  main_module = "security_headers.js"
  files {
    name    = "security_headers.js"
    content = file("${path.module}/snippets/security_headers.js")
  }
}

# Create snippet rule
resource "cloudflare_snippet_rules" "security_rules" {
  zone_id = var.zone_id

  rules {
    description  = "Apply security headers to all requests"
    enabled      = true
    expression   = "true"
    snippet_name = cloudflare_snippet.security_headers.name
  }
}
```

### 4. Pulumi

**Best for**: Multi-cloud IaC, TypeScript/Python/Go workflows

```typescript
import * as cloudflare from '@pulumi/cloudflare'
import * as fs from 'fs'

// Create snippet
const securitySnippet = new cloudflare.Snippet('security-headers', {
  zoneId: zoneId,
  name: 'security_headers',
  mainModule: 'security_headers.js',
  files: [
    {
      name: 'security_headers.js',
      content: fs.readFileSync('./snippets/security_headers.js', 'utf8'),
    },
  ],
})

// Create snippet rule
const snippetRule = new cloudflare.SnippetRules('security-rules', {
  zoneId: zoneId,
  rules: [
    {
      description: 'Apply security headers',
      enabled: true,
      expression: 'true',
      snippetName: securitySnippet.name,
    },
  ],
})
```

## Filter Expressions

Snippets use Cloudflare's Ruleset Engine expression language to determine when to execute.

### Common Expression Patterns

```javascript
// Host matching
http.host eq "example.com"
http.host in {"example.com" "www.example.com"}
http.host contains "example"

// Path matching
http.request.uri.path eq "/api/users"
starts_with(http.request.uri.path, "/api/")
ends_with(http.request.uri.path, ".json")
matches(http.request.uri.path, "^/api/v[0-9]+/")

// Query parameters
http.request.uri.query contains "debug=true"

// Headers
http.headers["user-agent"] contains "Mobile"
http.headers["accept-language"] eq "en-US"

// Cookies
http.cookie contains "session="

// Geolocation
ip.geoip.country eq "US"
ip.geoip.continent eq "EU"

// Bot detection (requires Bot Management)
cf.bot_management.score lt 30

// Method
http.request.method eq "POST"
http.request.method in {"POST" "PUT" "PATCH"}

// Combine with logical operators
http.host eq "example.com" and starts_with(http.request.uri.path, "/api/")
ip.geoip.country eq "US" or ip.geoip.country eq "CA"
not http.headers["user-agent"] contains "bot"
```

### Funções de expressão

| Função               | Exemplo                                             | Descrição                 |
| -------------------- | --------------------------------------------------- | ------------------------- |
| `inicia_com()`       | `inicia_com(http.request.uri.path, "/api/")`        | Verifique o prefixo       |
| `termina_com()`      | `ends_with(http.request.uri.path, ".json")`         | Verifique o sufixo        |
| `contém()`           | `contém(http.headers["user-agent"], "Mobile")`      | Verifique a substring     |
| `correspondências()` | `correspondências(http.request.uri.path, "^/api/")` | Correspondência Regex     |
| `inferior()`         | `inferior(http.host) eq "example.com"`              | Converter para minúsculas |
| `superior()`         | `superior(http.headers["x-api-key"])`               | Converter para maiúsculas |
| `len()`              | `len(http.request.uri.path) gt 100`                 | Comprimento da corda      |

## Fluxo de trabalho de implantação

### Desenvolvimento

1. Escreva o código do snippet localmente
2. Teste a sintaxe com `node snippet.js` ou compilador TypeScript
3. Implante no Dashboard ou use API com `Salvar como rascunho`
4. Teste com guias Preview/HTTP no Dashboard
5. Habilite a regra quando estiver pronto

### Produção

1. Armazene o código do snippet no controle de versão
2. Use Terraform/Pulumi para implantações reproduzíveis
3. Implante primeiro na zona de teste
4. Teste com tráfego real (use subdomínio de baixo tráfego)
5. Inscreva-se na zona de produção
6. Monitore com Analytics/Logpush

## Limites e Requisitos

| Recurso                  | Limite          | Notas                                                  |
| ------------------------ | --------------- | ------------------------------------------------------ |
| Tamanho do trecho        | 32 KB           | Por trecho, compactado                                 |
| Nome do trecho           | 64 caracteres   | `a-z`, `0-9`, `_` somente, imutável                    |
| Trechos por zona         | 20              | Limite suave, entre em contato com o suporte para mais |
| Regras por zona          | 20              | Uma regra por snippet típica                           |
| Comprimento da expressão | 4096 caracteres | Expressão por regra                                    |

## Autenticação

### Token de API (recomendado)```bash

# Create token at: https://dash.cloudflare.com/profile/api-tokens

# Required permissions: Zone.Snippets:Edit, Zone.Rules:Edit

export CLOUDFLARE_API_TOKEN="your_token_here"

````

### API Key (Legacy)

```bash
export CLOUDFLARE_EMAIL="your@email.com"
export CLOUDFLARE_API_KEY="your_global_api_key"
````
