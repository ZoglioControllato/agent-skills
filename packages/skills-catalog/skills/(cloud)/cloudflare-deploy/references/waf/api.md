# Referência da API

## Configuração do SDK

```typescript
import Cloudflare from 'cloudflare'

const client = new Cloudflare({
  apiToken: process.env.CF_API_TOKEN,
})
```

## Métodos principais

```typescript
// List rulesets
await client.rulesets.list({ zone_id: 'zone_id', phase: 'http_request_firewall_managed' })

// Get ruleset
await client.rulesets.get({ zone_id: 'zone_id', ruleset_id: 'ruleset_id' })

// Create ruleset
await client.rulesets.create({
  zone_id: 'zone_id',
  kind: 'zone',
  phase: 'http_request_firewall_custom',
  name: 'Custom WAF Rules',
  rules: [{ action: 'block', expression: 'cf.waf.score gt 40', enabled: true }],
})

// Update ruleset (include rule id to keep existing, omit id for new rules)
await client.rulesets.update({
  zone_id: 'zone_id',
  ruleset_id: 'ruleset_id',
  rules: [
    { id: 'rule_id', action: 'block', expression: 'cf.waf.score gt 40', enabled: true },
    { action: 'challenge', expression: 'http.request.uri.path contains "/admin"', enabled: true },
  ],
})

// Delete ruleset
await client.rulesets.delete({ zone_id: 'zone_id', ruleset_id: 'ruleset_id' })
```

## Ações e fases

### Ações por fase

| Ação                | Custom | Managed | Rate Limit | Descrição                         |
| ------------------- | ------ | ------- | ---------- | --------------------------------- |
| `block`             | ✅     | ❌      | ✅         | Bloqueia com 403                  |
| `challenge`         | ✅     | ❌      | ✅         | Desafio CAPTCHA                   |
| `js_challenge`      | ✅     | ❌      | ✅         | Desafio em JavaScript             |
| `managed_challenge` | ✅     | ❌      | ✅         | Desafio inteligente (recomendado) |
| `log`               | ✅     | ❌      | ✅         | Só registra                       |
| `skip`              | ✅     | ❌      | ❌         | Pula avaliação da regra           |
| `execute`           | ❌     | ✅      | ❌         | Implanta ruleset gerenciado       |

### Fases (ordem de execução)

1. `http_request_firewall_custom` — regras customizadas (primeira linha)
2. `http_request_firewall_managed` — rulesets gerenciados
3. `http_ratelimit` — rate limiting
4. `http_request_sbfm` — Super Bot Fight Mode (somente Pro+)

## Sintaxe de expressão

### Campos

```typescript
// Request properties
http.request.method // GET, POST, etc.
http.request.uri.path // /api/users
http.host // example.com

// IP and Geolocation
ip.src // 192.0.2.1
ip.geoip.country // US, GB, etc.
ip.geoip.continent // NA, EU, etc.

// Attack detection
cf.waf.score // 0-100 attack score
cf.waf.score.sqli // SQL injection score
cf.waf.score.xss // XSS score

// Headers & Cookies
http.request.headers['authorization'][0]
http.request.cookies['session'][0]
lower(http.user_agent) // Lowercase user agent
```

### Operadores

```typescript
// Comparison
eq // Equal
ne // Not equal
lt // Less than
le // Less than or equal
gt // Greater than
ge // Greater than or equal

// String matching
contains // Substring match
matches // Regex match (use carefully)
starts_with // Prefix match
ends_with in // Suffix match
  // Value in list
  // List operations
  not // Logical NOT
and // Logical AND
or // Logical OR
```

### Exemplos de expressão

```typescript
'cf.waf.score gt 40' // Attack score
'http.request.uri.path eq "/api/login" and http.request.method eq "POST"' // Path + method
'ip.src in {192.0.2.0/24 203.0.113.0/24}' // IP blocking
'ip.geoip.country in {"CN" "RU" "KP"}' // Country blocking
'http.user_agent contains "bot"' // User agent
'not http.request.headers["authorization"][0]' // Header check
'(cf.waf.score.sqli gt 20 or cf.waf.score.xss gt 20) and http.request.uri.path starts_with "/api"' // Complex
```

## Configuração de rate limiting

```typescript
{
  action: 'block',
  expression: 'http.request.uri.path starts_with "/api"',
  action_parameters: {
    ratelimit: {
      // Characteristics define uniqueness: 'ip.src', 'cf.colo.id',
      // 'http.request.headers["key"][0]', 'http.request.cookies["session"][0]'
      characteristics: ['cf.colo.id', 'ip.src'], // Recommended: per-IP per-datacenter
      period: 60,                      // Time window in seconds
      requests_per_period: 100,        // Max requests in period
      mitigation_timeout: 600,         // Block duration in seconds
      counting_expression: 'http.request.method ne "GET"', // Optional: filter counted requests
      requests_to_origin: false,       // Count all requests (not just origin hits)
    },
  },
  enabled: true,
}
```

## Implantação de ruleset gerenciado

```typescript
{
  action: 'execute',
  action_parameters: {
    id: 'efb7b8c949ac4650a09736fc376e9aee', // Cloudflare Managed
    overrides: {
      // Override specific rules
      rules: [
        { id: '5de7edfa648c4d6891dc3e7f84534ffa', action: 'log', enabled: true },
      ],
      // Override categories: 'wordpress', 'sqli', 'xss', 'rce', etc.
      categories: [
        { category: 'wordpress', enabled: false },
        { category: 'sqli', action: 'log' },
      ],
    },
  },
  expression: 'true',
  enabled: true,
}
```

## Regras skip

As regras skip ignoram avaliações subsequentes. Dois tipos:

**Skip do ruleset atual:** pula apenas o restante da fase atual

```typescript
{
  action: 'skip',
  action_parameters: {
    ruleset: 'current', // Skip rest of current ruleset
  },
  expression: 'http.request.uri.path ends_with ".jpg" or http.request.uri.path ends_with ".css"',
  enabled: true,
}
```

**Skip de fases inteiras:**

```typescript
{
  action: 'skip',
  action_parameters: {
    phases: ['http_request_firewall_managed', 'http_ratelimit'], // Skip multiple phases
  },
  expression: 'ip.src in {192.0.2.0/24 203.0.113.0/24}',
  enabled: true,
}
```

**Nota:** regras skip na fase custom podem pular managed/ratelimit; o inverso não vale (ordem de execução).

Documentação localizada no ecossistema mantido pelo Controllato Club.
