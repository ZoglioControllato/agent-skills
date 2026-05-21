# Dicas para funcionários de e-mail

## Questões Críticas

### ReadableStream de uso único

```typescript
// ❌ WRONG: Stream consumed twice
const email = await PostalMime.parse(await new Response(message.raw).arrayBuffer())
const rawText = await new Response(message.raw).text() // EMPTY!

// ✅ CORRECT: Buffer first
const buffer = await new Response(message.raw).arrayBuffer()
const email = await PostalMime.parse(buffer)
const rawText = new TextDecoder().decode(buffer)
```

### ctx.waitUntil() Erros silenciosos

```typescript
// ❌ Errors dropped silently
ctx.waitUntil(fetch(webhookUrl, { method: 'POST', body: data }))

// ✅ Catch and log
ctx.waitUntil(
  fetch(webhookUrl, { method: 'POST', body: data }).catch((err) =>
    env.ERROR_LOG.put(`error:${Date.now()}`, err.message),
  ),
)
```

##Segurança

### Envelope vs cabeçalho de (falsificação)

```typescript
const envelopeFrom = message.from // SMTP MAIL FROM (trusted)
const headerFrom = (await PostalMime.parse(buffer)).from?.address // (untrusted)
// Use envelope for security decisions
```

### Validação de entrada

```typescript
if (message.rawSize > 5_000_000) {
  message.setReject('Too large')
  return
}
if ((message.headers.get('Subject') || '').length > 1000) {
  message.setReject('Invalid subject')
  return
}
```

### DMARC para respostas

As respostas falham silenciosamente sem DMARC. Verifique: `dig TXT _dmarc.example.com`

## Análise

### Análise de endereço

```typescript
const email = await PostalMime.parse(buffer)
const fromAddress = email.from?.address || 'unknown'
const toAddresses = Array.isArray(email.to) ? email.to.map((t) => t.address) : [email.to?.address]
```

### Codificação de caracteres

Deixe o postal-mime lidar com a decodificação - `email.subject`, `email.text`, `email.html` são UTF-8.

## Comportamento da API

### setReject() vs lançar

```typescript
// setReject() for SMTP rejection
if (blockList.includes(message.from)) {
  message.setReject('Blocked')
  return
}

// throw for worker errors
if (!env.KV) throw new Error('KV not configured')
```

### forward() Apenas X-\* Cabeçalhos

```typescript
headers.set('X-Processed-By', 'worker') // ✅ Works
headers.set('Subject', 'Modified') // ❌ Dropped
```

### A resposta requer domínio verificado

```typescript
// Use same domain as receiving address
const receivingDomain = message.to.split('@')[1]
await message.reply(new EmailMessage(`noreply@${receivingDomain}`, message.from, rawMime))
```

##Desempenho

### Limite de CPU

````typescript
// Skip parsing large emails
if (message.rawSize > 5_000_000) {
  await message.forward('inbox@example.com')
  return
}
```Monitor: `npx wrangler tail`

## Limites

| Limite | Valor |
| -------------------- | ----------- |
| Tamanho máximo da mensagem | 25 MiB |
| Máximo de regras/zona | 200 |
| Tempo de CPU (gratuito/pago) | 10ms / 50ms |
| Referências de resposta | 100 |

## Erros Comuns

| Erro | Correção |
| ---------------------- | -------------------------------- |
| “Endereço não verificado” | Adicionar painel de roteamento de e-mail |
| "Tempo de CPU excedido" | Use `ctx.waitUntil()` ou atualize |
| "A transmissão está bloqueada" | Buffer `message.raw` primeiro |
| Falha na resposta silenciosa | Verifique os registros DMARC |
````
