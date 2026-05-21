# Email Routing API Reference

## Worker Runtime API

### Email Handler Interface

```typescript
interface ExportedHandler<Env = unknown> {
  email?(message: ForwardableEmailMessage, env: Env, ctx: ExecutionContext): void | Promise<void>
}
```

### ForwardableEmailMessage

Main interface for incoming emails:

```typescript
interface ForwardableEmailMessage {
  readonly from: string // Envelope sender (e.g., "sender@example.com")
  readonly to: string // Envelope recipient (e.g., "you@yourdomain.com")
  readonly headers: Headers // Web API Headers object
  readonly raw: ReadableStream // Raw MIME message stream

  setReject(reason: string): void
  forward(rcptTo: string, headers?: Headers): Promise<void>
}
```

**Principais Propriedades:**

| Propriedade  | Tipo             | Descrição                                             |
| ------------ | ---------------- | ----------------------------------------------------- |
| `de`         | `string`         | Remetente do envelope (MAIL FROM), não cabeçalho From |
| `para`       | `string`         | Destinatário do envelope (RCPT TO), não cabeçalho To  |
| `cabeçalhos` | `Cabeçalhos`     | Cabeçalhos de e-mail (Assunto, De, Para, etc.)        |
| `cru`        | `ReadableStream` | Mensagem MIME bruta (consumir apenas uma vez)         |

**Métodos:**

- `setReject(reason)`: rejeita e-mail com mensagem devolvida
- `forward(rcptTo, headers?)`: Encaminha para destino verificado, opcionalmente adicione cabeçalhos

### Objeto de cabeçalhos

Interface padrão de cabeçalhos da API da Web:```typescript
// Access headers
const subject = message.headers.get('subject')
const from = message.headers.get('from')
const messageId = message.headers.get('message-id')

// Check spam score
const spamScore = parseFloat(message.headers.get('x-cf-spamh-score') || '0')
if (spamScore > 5) {
message.setReject('Spam detected')
}

````

### Common Headers

`subject`, `from`, `to`, `x-cf-spamh-score` (spam score), `message-id` (deduplication), `dkim-signature` (auth)

### Envelope vs Header Addresses

**Critical distinction:**

```typescript
// Envelope addresses (routing, auth checks)
message.from // "bounce@sender.com" (actual sender)
message.to // "you@yourdomain.com" (your address)

// Header addresses (display, user-facing)
message.headers.get('from') // "Alice <alice@sender.com>"
message.headers.get('to') // "Bob <you@yourdomain.com>"
````

**Use endereços de envelope para:**

- Verificações de autenticação/SPF
- Decisões de roteamento
- Tratamento de salto

**Use endereços de cabeçalho para:**

- Exibir aos usuários
- Lógica de resposta
- Filtragem voltada para o usuário

## Vinculação SendEmail

API de e-mail de saída para mensagens transacionais.

### Configuração```jsonc

// wrangler.jsonc
{
"send_email": [{ "name": "EMAIL" }],
}

````

### TypeScript Types

```typescript
interface Env {
  EMAIL: SendEmail
}

interface SendEmail {
  send(message: EmailMessage): Promise<void>
}

interface EmailMessage {
  from: string | { name?: string; email: string }
  to: string | { name?: string; email: string } | Array<string | { name?: string; email: string }>
  subject: string
  text?: string
  html?: string
  headers?: Headers
  reply_to?: string | { name?: string; email: string }
}
````

### Send Email Example

```typescript
interface Env {
  EMAIL: SendEmail
}

export default {
  async fetch(request, env, ctx): Promise<Response> {
    await env.EMAIL.send({
      from: { name: 'Acme Corp', email: 'noreply@yourdomain.com' },
      to: [{ name: 'Alice', email: 'alice@example.com' }, 'bob@example.com'],
      subject: 'Your order #12345 has shipped',
      text: 'Track your package at: https://track.example.com/12345',
      html: "<p>Track your package at: <a href='https://track.example.com/12345'>View tracking</a></p>",
      reply_to: { name: 'Support', email: 'support@yourdomain.com' },
    })

    return new Response('Email sent')
  },
} satisfies ExportedHandler<Env>
```

### Restrições de SendEmail

- **Endereço do remetente**: deve estar em um domínio verificado (seu domínio com roteamento de e-mail ativado)
- **Limites de volume**: somente transacional, sem e-mail em massa/marketing
- **Limites de taxa**: 100 e-mails/minuto no plano Gratuito, maior no Pago
- **Sem anexos**: use links para arquivos hospedados
- **Sem controle DKIM**: Cloudflare assina automaticamente

## Operações da API REST

URL base: `https://api.cloudflare.com/client/v4`

### Autenticação```bash

curl -H "Authorization: Bearer $API_TOKEN" https://api.cloudflare.com/client/v4/...

````

### Key Endpoints

| Operation          | Method | Endpoint                                   |
| ------------------ | ------ | ------------------------------------------ |
| Enable routing     | POST   | `/zones/{zone_id}/email/routing/enable`    |
| Disable routing    | POST   | `/zones/{zone_id}/email/routing/disable`   |
| List rules         | GET    | `/zones/{zone_id}/email/routing/rules`     |
| Create rule        | POST   | `/zones/{zone_id}/email/routing/rules`     |
| Verify destination | POST   | `/zones/{zone_id}/email/routing/addresses` |
| List destinations  | GET    | `/zones/{zone_id}/email/routing/addresses` |

### Create Routing Rule Example

```bash
curl -X POST "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/email/routing/rules" \
  -H "Authorization: Bearer $API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "enabled": true,
    "name": "Forward sales",
    "matchers": [{"type": "literal", "field": "to", "value": "sales@yourdomain.com"}],
    "actions": [{"type": "forward", "value": ["alice@company.com"]}],
    "priority": 0
  }'
````

Matcher types: `literal` (exact match), `all` (catch-all).
