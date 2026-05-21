# Referência da skill especialista em Cloudflare WAF

**Especialidade:** configuração do Web Application Firewall (WAF) da Cloudflare, regras personalizadas, rulesets gerenciados, rate limiting, detecção de ataques e integração com API.

## Visão geral

O WAF da Cloudflare protege aplicações web via rulesets gerenciados e regras customizadas.

**Detecção (Managed Rulesets)**

- Regras pré-configuradas mantidas pela Cloudflare
- Regras baseadas em CVE, cobertura OWASP Top 10
- Três rulesets principais: Cloudflare Managed, OWASP CRS, Exposed Credentials
- Ações: log, block, challenge, js_challenge, managed_challenge

**Mitigação (Custom Rules e Rate Limiting)**

- Expressões customizadas com sintaxe Wirefilter
- Bloqueio por attack score (`cf.waf.score`)
- Rate limiting por IP, usuário ou características customizadas
- Ações: block, challenge, js_challenge, managed_challenge, log, skip

## Início rápido

### Implantar Cloudflare Managed Ruleset

```typescript
import Cloudflare from 'cloudflare'

const client = new Cloudflare({ apiToken: process.env.CF_API_TOKEN })

// Deploy managed ruleset to zone
await client.rulesets.create({
  zone_id: 'zone_id',
  kind: 'zone',
  phase: 'http_request_firewall_managed',
  name: 'Deploy Cloudflare Managed Ruleset',
  rules: [
    {
      action: 'execute',
      action_parameters: {
        id: 'efb7b8c949ac4650a09736fc376e9aee', // Cloudflare Managed Ruleset
      },
      expression: 'true',
      enabled: true,
    },
  ],
})
```

### Criar regra customizada

```typescript
// Block requests with attack score >= 40
await client.rulesets.create({
  zone_id: 'zone_id',
  kind: 'zone',
  phase: 'http_request_firewall_custom',
  name: 'Custom WAF Rules',
  rules: [
    {
      action: 'block',
      expression: 'cf.waf.score gt 40',
      description: 'Block high attack scores',
      enabled: true,
    },
  ],
})
```

### Criar rate limit

```typescript
await client.rulesets.create({
  zone_id: 'zone_id',
  kind: 'zone',
  phase: 'http_ratelimit',
  name: 'API Rate Limits',
  rules: [
    {
      action: 'block',
      expression: 'http.request.uri.path eq "/api/login"',
      action_parameters: {
        ratelimit: {
          characteristics: ['cf.colo.id', 'ip.src'],
          period: 60,
          requests_per_period: 10,
          mitigation_timeout: 600,
        },
      },
      enabled: true,
    },
  ],
})
```

## Referência rápida de rulesets gerenciados

| Nome do ruleset           | ID                                 | Cobertura             |
| ------------------------- | ---------------------------------- | --------------------- |
| Cloudflare Managed        | `efb7b8c949ac4650a09736fc376e9aee` | OWASP Top 10, CVEs    |
| OWASP Core Ruleset        | `4814384a9e5d4991b9815dcfc25d2f1f` | OWASP ModSecurity CRS |
| Exposed Credentials Check | `c2e184081120413c86c3ab7e14069605` | Credential stuffing   |

## Fases

O WAF executa em fases específicas:

- `http_request_firewall_managed` — rulesets gerenciados
- `http_request_firewall_custom` — regras customizadas
- `http_ratelimit` — rate limiting
- `http_request_sbfm` — Super Bot Fight Mode (Pro+)

## Ordem de leitura

1. **[api.md](api.md)** — métodos do SDK, expressões, ações, parâmetros
2. **[configuration.md](configuration.md)** — Wrangler, Terraform, Pulumi
3. **[patterns.md](patterns.md)** — padrões: gerenciado, rate limit, skip, override
4. **[gotchas.md](gotchas.md)** — ordem de execução, limites, erros de expressão

## Ver também

- [Documentação WAF](https://developers.cloudflare.com/waf/)
- [Ruleset Engine](https://developers.cloudflare.com/ruleset-engine/)
- [Referência de expressões](https://developers.cloudflare.com/ruleset-engine/rules-language/)

Documentação localizada no ecossistema mantido pelo Controllato Club.
