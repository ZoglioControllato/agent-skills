# Padrões de gerenciamento de bots

## Proteção de comércio eletrônico

```txt
# Alta segurança para checkout
(cf.bot_management.score lt 50 e http.request.uri.path em {"/checkout" "/cart/add"} e não cf.bot_management.verified_bot e não cf.bot_management.corporate_proxy)
Ação: Desafio Gerenciado
```

##Proteção de API

```txt
# Proteger API com detecção JS + pontuação
(http.request.uri.path corresponde a "^/api/" e (cf.bot_management.score lt 30 ou não cf.bot_management.js_detection.passed) e não cf.bot_management.verified_bot)
Ação: Bloquear
```

##Manipulação de bot amigável para SEO

```txt
# Allow search engine crawlers
(cf.bot_management.score lt 30 and not cf.verified_bot_category in {"Search Engine Crawler"})
Action: Managed Challenge
```

##Bloquear raspadores de IA

```txt
# Block training crawlers only (allow AI assistants/search)
(cf.verified_bot_category eq "AI Crawler")
Action: Block

# Block all AI-related bots (training + assistants + search)
(cf.verified_bot_category in {"AI Crawler" "AI Assistant" "AI Search"})
Action: Block

# Allow AI Search, block AI Crawler and AI Assistant
(cf.verified_bot_category in {"AI Crawler" "AI Assistant"})
Action: Block

# Or use dashboard: Security > Settings > Bot Management > Block AI Bots
```

##Limitação de taxa por pontuação do bot

```txt
# Stricter limits for suspicious traffic
(cf.bot_management.score lt 50)
Rate: 10 requests per 10 seconds

(cf.bot_management.score ge 50)
Rate: 100 requests per 10 seconds
```

##Lista de permissões de aplicativos móveis

```txt
# Identify mobile app by JA3/JA4
(cf.bot_management.ja4 in {"fingerprint1" "fingerprint2"})
Action: Skip (all remaining rules)
```

##Detecção de datacenter

```typescript
import type { IncomingRequestCfProperties } from '@cloudflare/workers-types'

// Low score + not corporate proxy = likely datacenter bot
export default {
  async fetch(request: Request): Promise<Response> {
    const cf = request.cf as IncomingRequestCfProperties | undefined
    const botMgmt = cf?.botManagement

    if (botMgmt?.score && botMgmt.score < 30 && !botMgmt.corporateProxy && !botMgmt.verifiedBot) {
      return new Response('Datacenter traffic blocked', { status: 403 })
    }

    return fetch(request)
  },
}
```

##Atraso Condicional (Tarpit)

```typescript
import type { IncomingRequestCfProperties } from '@cloudflare/workers-types'

// Add delay proportional to bot suspicion
export default {
  async fetch(request: Request): Promise<Response> {
    const cf = request.cf as IncomingRequestCfProperties | undefined
    const botMgmt = cf?.botManagement

    if (botMgmt?.score && botMgmt.score < 50 && !botMgmt.verifiedBot) {
      // Delay: 0-2 seconds for scores 50-0
      const delayMs = Math.max(0, (50 - botMgmt.score) * 40)
      await new Promise((r) => setTimeout(r, delayMs))
    }

    return fetch(request)
  },
}
```

##Defesa em camadas

```txt
1. Bot Management (score-based)
2. JavaScript Detections (for JS-capable clients)
3. Rate Limiting (fallback protection)
4. WAF Managed Rules (OWASP, etc.)
```

##Aprimoramento Progressivo

```txt
Public content: High threshold (score < 10)
Authenticated: Medium threshold (score < 30)
Sensitive: Low threshold (score < 50) + JSD
```

##Confiança Zero para Bots

```txt
1. Default deny (all scores < 30)
2. Allowlist verified bots
3. Allowlist mobile apps (JA3/JA4)
4. Allowlist corporate proxies
5. Allowlist static resources
```

##Trabalhadores: Pontuação + Detecção JS

```typescript
import type { IncomingRequestCfProperties } from '@cloudflare/workers-types'

export default {
  async fetch(request: Request): Promise<Response> {
    const cf = request.cf as IncomingRequestCfProperties | undefined
    const botMgmt = cf?.botManagement
    const url = new URL(request.url)

    if (botMgmt?.staticResource) return fetch(request) // Skip static

    // API endpoints: require JS detection + good score
    if (url.pathname.startsWith('/api/')) {
      const jsDetectionPassed = botMgmt?.jsDetection?.passed ?? false
      const score = botMgmt?.score ?? 100

      if (!jsDetectionPassed || score < 30) {
        return new Response('Unauthorized', { status: 401 })
      }
    }

    return fetch(request)
  },
}
```

##Limitação de taxa por reivindicação JWT + pontuação do bot

```txt
# Enterprise: Combine bot score with JWT validation
Rate limiting > Custom rules
- Field: lookup_json_string(http.request.jwt.claims["{config_id}"][0], "sub")
- Matches: user ID claim
- Additional condition: cf.bot_management.score lt 50
```

##Pontos de Integração WAF

- **Regras personalizadas do WAF**: mecanismo primário de aplicação
- **Regras de limitação de taxa**: pontuação do bot como dimensão, limites mais rígidos para pontuações baixas
- **Regras de transformação**: passe a pontuação para a origem por meio de cabeçalho personalizado
- **Workers**: lógica de bot programática, algoritmos de pontuação personalizados
- **Regras de página/regras de configuração**: substituições em nível de zona, configurações específicas de caminho

## Veja também

- [gotchas.md](./gotchas.md) - Erros comuns, falsos positivos/negativos, limitações
