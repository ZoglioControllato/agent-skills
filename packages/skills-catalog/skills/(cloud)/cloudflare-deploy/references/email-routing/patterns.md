# Padrões Comuns

## 1. Lista de permissões/lista de bloqueios

```typescript
// Allowlist
const allowed = ['user@example.com', 'trusted@corp.com']
if (!allowed.includes(message.from)) {
  message.setReject('Not allowed')
  return
}
await message.forward('inbox@corp.com')
```

##2. Analisar corpo do e-mail

```typescript
import PostalMime from 'postal-mime'

export default {
  async email(message, env, ctx) {
    // CRITICAL: Consume stream immediately
    const raw = await message.raw.arrayBuffer()

    const parser = new PostalMime()
    const email = await parser.parse(raw)

    console.log({
      subject: email.subject,
      text: email.text,
      html: email.html,
      from: email.from.address,
      attachments: email.attachments.length,
    })

    await message.forward('inbox@corp.com')
  },
} satisfies ExportedHandler
```

##3. Filtro de Spam

```typescript
const score = parseFloat(message.headers.get('x-cf-spamh-score') || '0')
if (score > 5) {
  message.setReject('Spam detected')
  return
}
await message.forward('inbox@corp.com')
```

##4. Arquivar em R2

```typescript
interface Env {
  R2: R2Bucket
}

export default {
  async email(message, env, ctx) {
    const raw = await message.raw.arrayBuffer()

    const key = `${new Date().toISOString()}-${message.from}.eml`
    await env.R2.put(key, raw, {
      httpMetadata: { contentType: 'message/rfc822' },
    })

    await message.forward('inbox@corp.com')
  },
} satisfies ExportedHandler<Env>
```

##5. Armazene metadados em KV

```typescript
import PostalMime from 'postal-mime'

interface Env {
  KV: KVNamespace
}

export default {
  async email(message, env, ctx) {
    const raw = await message.raw.arrayBuffer()
    const parser = new PostalMime()
    const email = await parser.parse(raw)

    const metadata = {
      from: email.from.address,
      subject: email.subject,
      timestamp: new Date().toISOString(),
      size: raw.byteLength,
    }

    await env.KV.put(`email:${Date.now()}`, JSON.stringify(metadata))
    await message.forward('inbox@corp.com')
  },
} satisfies ExportedHandler<Env>
```

##6. Roteamento baseado em assunto

```typescript
export default {
  async email(message, env, ctx) {
    const subject = message.headers.get('subject')?.toLowerCase() || ''

    if (subject.includes('[urgent]')) {
      await message.forward('oncall@corp.com')
    } else if (subject.includes('[billing]')) {
      await message.forward('billing@corp.com')
    } else if (subject.includes('[support]')) {
      await message.forward('support@corp.com')
    } else {
      await message.forward('general@corp.com')
    }
  },
} satisfies ExportedHandler
```

##7. Resposta automática

```typescript
interface Env {
  EMAIL: SendEmail
  REPLIED: KVNamespace
}

export default {
  async email(message, env, ctx) {
    const msgId = message.headers.get('message-id')

    if (msgId && (await env.REPLIED.get(msgId))) {
      await message.forward('archive@corp.com')
      return
    }

    ctx.waitUntil(
      (async () => {
        await env.EMAIL.send({
          from: 'noreply@yourdomain.com',
          to: message.from,
          subject: 'Re: ' + (message.headers.get('subject') || ''),
          text: "Thank you. We'll respond within 24h.",
        })
        if (msgId) await env.REPLIED.put(msgId, '1', { expirationTtl: 604800 })
      })(),
    )

    await message.forward('support@corp.com')
  },
} satisfies ExportedHandler<Env>
```

##8. Extrair anexos

```typescript
import PostalMime from 'postal-mime'

interface Env {
  ATTACHMENTS: R2Bucket
}

export default {
  async email(message, env, ctx) {
    const parser = new PostalMime()
    const email = await parser.parse(await message.raw.arrayBuffer())

    for (const att of email.attachments) {
      const key = `${Date.now()}-${att.filename}`
      await env.ATTACHMENTS.put(key, att.content, {
        httpMetadata: { contentType: att.mimeType },
      })
    }

    await message.forward('inbox@corp.com')
  },
} satisfies ExportedHandler<Env>
```

##9. Faça logon em D1

```typescript
import PostalMime from 'postal-mime'

interface Env {
  DB: D1Database
}

export default {
  async email(message, env, ctx) {
    const parser = new PostalMime()
    const email = await parser.parse(await message.raw.arrayBuffer())

    ctx.waitUntil(
      env.DB.prepare('INSERT INTO log (ts, from_addr, subj) VALUES (?, ?, ?)')
        .bind(new Date().toISOString(), email.from.address, email.subject || '')
        .run(),
    )

    await message.forward('inbox@corp.com')
  },
} satisfies ExportedHandler<Env>
```

##10. Multi-inquilino

```typescript
interface Env {
  TENANTS: KVNamespace
}

export default {
  async email(message, env, ctx) {
    const subdomain = message.to.split('@')[1].split('.')[0]
    const config = (await env.TENANTS.get(subdomain, 'json')) as { forward: string } | null

    if (!config) {
      message.setReject('Unknown tenant')
      return
    }

    await message.forward(config.forward)
  },
} satisfies ExportedHandler<Env>
```

##Resumo

| Padrão              | Caso de uso                 | Armazenamento |
| ------------------- | --------------------------- | ------------- |
| Lista de permissões | Segurança                   | Nenhum        |
| Analisar            | Corpo/anexos                | Nenhum        |
| Filtro de Spam      | Reduzir spam                | Nenhum        |
| Arquivo R2          | Armazenamento de e-mail     | R2            |
| KVMeta              | Análise                     | KV            |
| Rota do Assunto     | Roteamento de departamento  | Nenhum        |
| Resposta automática | Suporte                     | KV            |
| Anexos              | Gerenciamento de documentos | R2            |
| Registro D1         | Trilha de auditoria         | D1            |
| Multilocatário      | SaaS                        | KV            |
