# Configuração

## Pré-requisitos

**API Token:** crie em https://dash.cloudflare.com/profile/api-tokens

- Permissão: `Zone.WAF Edit` ou `Zone.Firewall Services Edit`
- Recursos da zona: zonas específicas ou todas

**Zone ID:** no painel, Overview → seção API (barra lateral)

```bash
# Set environment variables
export CF_API_TOKEN="your_api_token_here"
export ZONE_ID="your_zone_id_here"
```

## Uso do SDK TypeScript

```bash
npm install cloudflare
```

```typescript
import Cloudflare from 'cloudflare'

const client = new Cloudflare({ apiToken: process.env.CF_API_TOKEN })

// Custom rules
await client.rulesets.create({
  zone_id: process.env.ZONE_ID,
  kind: 'zone',
  phase: 'http_request_firewall_custom',
  name: 'Custom WAF',
  rules: [
    { action: 'block', expression: 'cf.waf.score gt 50', enabled: true },
    { action: 'challenge', expression: 'http.request.uri.path eq "/admin"', enabled: true },
  ],
})

// Managed ruleset
await client.rulesets.create({
  zone_id: process.env.ZONE_ID,
  phase: 'http_request_firewall_managed',
  rules: [
    {
      action: 'execute',
      action_parameters: { id: 'efb7b8c949ac4650a09736fc376e9aee' },
      expression: 'true',
    },
  ],
})

// Rate limiting
await client.rulesets.create({
  zone_id: process.env.ZONE_ID,
  phase: 'http_ratelimit',
  rules: [
    {
      action: 'block',
      expression: 'http.request.uri.path starts_with "/api"',
      action_parameters: {
        ratelimit: {
          characteristics: ['cf.colo.id', 'ip.src'],
          period: 60,
          requests_per_period: 100,
          mitigation_timeout: 600,
        },
      },
    },
  ],
})
```

## Configuração Terraform

```hcl
provider "cloudflare" {
  api_token = var.cloudflare_api_token
}

resource "cloudflare_ruleset" "waf_custom" {
  zone_id = var.zone_id
  kind    = "zone"
  phase   = "http_request_firewall_custom"

  rules {
    action     = "block"
    expression = "cf.waf.score gt 50"
  }
}
```

**Ruleset gerenciado e rate limiting:**

```hcl
resource "cloudflare_ruleset" "waf_managed" {
  zone_id = var.zone_id
  name    = "Managed Ruleset"
  kind    = "zone"
  phase   = "http_request_firewall_managed"

  rules {
    action = "execute"
    action_parameters {
      id = "efb7b8c949ac4650a09736fc376e9aee"
      overrides {
        rules {
          id = "5de7edfa648c4d6891dc3e7f84534ffa"
          action = "log"
        }
      }
    }
    expression = "true"
  }
}

resource "cloudflare_ruleset" "rate_limiting" {
  zone_id = var.zone_id
  phase   = "http_ratelimit"

  rules {
    action = "block"
    expression = "http.request.uri.path starts_with \"/api\""
    ratelimit {
      characteristics     = ["cf.colo.id", "ip.src"]
      period              = 60
      requests_per_period = 100
      mitigation_timeout  = 600
    }
  }
}
```

## Configuração Pulumi

```typescript
import * as cloudflare from '@pulumi/cloudflare'

const zoneId = 'zone_id'

// Custom rules
const wafCustom = new cloudflare.Ruleset('waf-custom', {
  zoneId,
  phase: 'http_request_firewall_custom',
  rules: [
    { action: 'block', expression: 'cf.waf.score gt 50', enabled: true },
    { action: 'challenge', expression: 'http.request.uri.path eq "/admin"', enabled: true },
  ],
})

// Managed ruleset
const wafManaged = new cloudflare.Ruleset('waf-managed', {
  zoneId,
  phase: 'http_request_firewall_managed',
  rules: [
    {
      action: 'execute',
      actionParameters: { id: 'efb7b8c949ac4650a09736fc376e9aee' },
      expression: 'true',
    },
  ],
})

// Rate limiting
const rateLimiting = new cloudflare.Ruleset('rate-limiting', {
  zoneId,
  phase: 'http_ratelimit',
  rules: [
    {
      action: 'block',
      expression: 'http.request.uri.path starts_with "/api"',
      ratelimit: {
        characteristics: ['cf.colo.id', 'ip.src'],
        period: 60,
        requestsPerPeriod: 100,
        mitigationTimeout: 600,
      },
    },
  ],
})
```

## Configuração no painel

1. Acesse **Security** → **WAF**
2. Aba:
   - **Managed rules** — implantar/configurar rulesets
   - **Custom rules** — criar regras
   - **Rate limiting rules** — limites de taxa
3. Clique em **Deploy** ou **Create rule**

**Testes:** use Security Events para validar expressões antes de publicar.

## Integração Wrangler

O WAF é ao nível de zona (não específico do Worker). Formas de configurar:

- UI do painel
- API Cloudflare via SDK
- Terraform/Pulumi (IaC)

**Workers se beneficiam do WAF automaticamente** — sem mudança de código.

**Exemplo: consultar API do WAF a partir de um Worker:**

```typescript
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    return fetch(`https://api.cloudflare.com/client/v4/zones/${env.ZONE_ID}/rulesets`, {
      headers: { Authorization: `Bearer ${env.CF_API_TOKEN}` },
    })
  },
}
```

Documentação localizada no ecossistema mantido pelo Controllato Club.
