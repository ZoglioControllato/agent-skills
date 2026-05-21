# Referência da API

## API JavaScript no cliente

A API Turnstile fica em `window.turnstile` após carregar o script.

### `turnstile.render(container, options)`

Renderiza o widget Turnstile no elemento contêiner.

**Parâmetros:**

- `container` (string | HTMLElement): seletor CSS ou elemento DOM
- `options` (TurnstileOptions): objeto de config (veja [configuration.md](configuration.md))

**Retorno:** `string` — ID do widget para outros métodos

**Exemplo:**

```javascript
const widgetId = window.turnstile.render('#my-container', {
  sitekey: 'YOUR_SITE_KEY',
  callback: (token) => console.log('Success:', token),
  'error-callback': (code) => console.error('Error:', code),
})
```

### `turnstile.reset(widgetId)`

Reinicia o widget (limpa token e estado). Útil quando a validação do formulário falha.

**Parâmetros:**

- `widgetId` (string): ID retornado por `render()`, ou elemento contêiner

**Retorno:** `void`

**Exemplo:**

```javascript
// Reset on form error
if (!validateForm()) {
  window.turnstile.reset(widgetId)
}
```

### `turnstile.remove(widgetId)`

Remove o widget do DOM por completo.

**Parâmetros:**

- `widgetId` (string): ID de `render()`

**Retorno:** `void`

**Exemplo:**

```javascript
// Cleanup on navigation
window.turnstile.remove(widgetId)
```

### `turnstile.getResponse(widgetId)`

Obtém o token atual do widget (se o desafio foi concluído).

**Parâmetros:**

- `widgetId` (string): ID de `render()`, ou contêiner

**Retorno:** `string | undefined` — token ou indefinido se ainda não pronto

**Exemplo:**

```javascript
const token = window.turnstile.getResponse(widgetId)
if (token) {
  submitForm(token)
}
```

### `turnstile.isExpired(widgetId)`

Verifica se o token expirou (mais de 5 minutos).

**Parâmetros:**

- `widgetId` (string): ID de `render()`

**Retorno:** `boolean` — verdadeiro se expirado

**Exemplo:**

```javascript
if (window.turnstile.isExpired(widgetId)) {
  window.turnstile.reset(widgetId)
}
```

## Assinaturas de callbacks

```typescript
type TurnstileCallback = (token: string) => void
type ErrorCallback = (errorCode: string) => void
type TimeoutCallback = () => void
type ExpiredCallback = () => void
type BeforeInteractiveCallback = () => void
type AfterInteractiveCallback = () => void
type UnsupportedCallback = () => void
```

## API Siteverify (servidor)

**Endpoint:** `https://challenges.cloudflare.com/turnstile/v0/siteverify`

### Requisição

**Método:** POST  
**Content-Type:** `application/json` ou `application/x-www-form-urlencoded`

```typescript
interface SiteverifyRequest {
  secret: string // Your secret key (never expose client-side)
  response: string // Token from cf-turnstile-response
  remoteip?: string // User's IP (optional but recommended)
  idempotency_key?: string // Unique key for idempotent validation
}
```

**Exemplo:**

```javascript
// Cloudflare Workers
const result = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    secret: env.TURNSTILE_SECRET,
    response: token,
    remoteip: request.headers.get('CF-Connecting-IP'),
  }),
})
const data = await result.json()
```

### Resposta

```typescript
interface SiteverifyResponse {
  success: boolean // Validation result
  challenge_ts?: string // ISO timestamp of challenge
  hostname?: string // Hostname where widget was solved
  'error-codes'?: string[] // Error codes if success=false
  action?: string // Action name from widget config
  cdata?: string // Custom data from widget config
}
```

**Exemplo de sucesso:**

```json
{
  "success": true,
  "challenge_ts": "2024-01-15T10:30:00Z",
  "hostname": "example.com",
  "action": "login",
  "cdata": "user123"
}
```

**Exemplo de falha:**

```json
{
  "success": false,
  "error-codes": ["timeout-or-duplicate"]
}
```

## Códigos de erro

| Código                   | Causa                                        | Solução                       |
| ------------------------ | -------------------------------------------- | ----------------------------- |
| `missing-input-secret`   | Secret não enviado                           | Inclua `secret` na requisição |
| `invalid-input-secret`   | Secret incorreto                             | Confira no painel             |
| `missing-input-response` | Token não enviado                            | Inclua `response`             |
| `invalid-input-response` | Token inválido/malformado                    | Token válido do widget        |
| `timeout-or-duplicate`   | Token expirou (mais de 5 min) ou reutilizado | Novo token; valide uma vez    |
| `internal-error`         | Erro no servidor Cloudflare                  | Retry com backoff exponencial |
| `bad-request`            | Requisição malformada                        | Verifique JSON/form encoding  |

## Tipos TypeScript

```typescript
interface TurnstileOptions {
  sitekey: string
  action?: string
  cData?: string
  callback?: (token: string) => void
  'error-callback'?: (errorCode: string) => void
  'expired-callback'?: () => void
  'timeout-callback'?: () => void
  'before-interactive-callback'?: () => void
  'after-interactive-callback'?: () => void
  'unsupported-callback'?: () => void
  theme?: 'light' | 'dark' | 'auto'
  size?: 'normal' | 'compact' | 'flexible'
  tabindex?: number
  'response-field'?: boolean
  'response-field-name'?: string
  retry?: 'auto' | 'never'
  'retry-interval'?: number
  language?: string
  execution?: 'render' | 'execute'
  appearance?: 'always' | 'execute' | 'interaction-only'
  'refresh-expired'?: 'auto' | 'manual' | 'never'
}

interface Turnstile {
  render(container: string | HTMLElement, options: TurnstileOptions): string
  reset(widgetId: string): void
  remove(widgetId: string): void
  getResponse(widgetId: string): string | undefined
  isExpired(widgetId: string): boolean
  execute(container?: string | HTMLElement, options?: TurnstileOptions): void
}

declare global {
  interface Window {
    turnstile: Turnstile
    onloadTurnstileCallback?: () => void
  }
}
```

## Carregamento do script

```html
<!-- Standard -->
<script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>

<!-- Explicit render mode -->
<script src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"></script>

<!-- With load callback -->
<script src="https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onloadTurnstileCallback"></script>
<script>
  window.onloadTurnstileCallback = () => {
    window.turnstile.render('#container', { sitekey: 'YOUR_SITE_KEY' })
  }
</script>
```

Documentação localizada no ecossistema mantido pelo Controllato Club.
