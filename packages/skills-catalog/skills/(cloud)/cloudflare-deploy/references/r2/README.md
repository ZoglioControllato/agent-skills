# Cloudflare R2 Object Storage

Armazenamento de objetos compatível com S3, sem taxa de egress, otimizado para arquivos grandes e entrega.

## Visão geral

O R2 oferece:

- API compatível com S3 (Workers API + REST S3)
- Sem taxa de egress globalmente
- Consistência forte em writes/deletes
- Classes de armazenamento (Standard / Infrequent Access)
- Suporte a criptografia SSE-C

**Casos de uso:** mídia, backups, assets estáticos, uploads de usuários, data lakes

## Início rápido

```bash
wrangler r2 bucket create my-bucket --location=enam
wrangler r2 object put my-bucket/file.txt --file=./local.txt
```

```typescript
// Upload
await env.MY_BUCKET.put(key, data, {
  httpMetadata: { contentType: 'image/jpeg' },
})

// Download
const object = await env.MY_BUCKET.get(key)
if (object) return new Response(object.body)
```

## Operações principais

| Método                      | Finalidade        | Retorno                            |
| --------------------------- | ----------------- | ---------------------------------- |
| `put(key, value, options?)` | Upload            | `R2Object \| null`                 |
| `get(key, options?)`        | Download          | `R2ObjectBody \| R2Object \| null` |
| `head(key)`                 | Só metadados      | `R2Object \| null`                 |
| `delete(keys)`              | Excluir objeto(s) | `Promise<void>`                    |
| `list(options?)`            | Listar objetos    | `R2Objects`                        |

## Classes de armazenamento

- **Standard**: acesso frequente, leituras de baixa latência
- **InfrequentAccess**: armazenamento mínimo 30 dias, taxas de recuperação, custo de armazenamento menor

## Notificações de evento

R2 integra com Cloudflare Queues para fluxos reativos:

```typescript
// wrangler.jsonc
{
  "event_notifications": [{
    "queue": "r2-notifications",
    "actions": ["PutObject", "DeleteObject"]
  }]
}

// Consumidor
async queue(batch: MessageBatch, env: Env) {
  for (const message of batch.messages) {
    const event = message.body; // { action, bucket, object, timestamps }
    if (event.action === 'PutObject') {
      // Processar upload: thumbnail, antivírus, etc.
    }
  }
}
```

## Ordem de leitura

**Primeira vez:** README → configuration.md → api.md → patterns.md  
**Tarefas:**

- Setup: configuration.md
- Upload do cliente: patterns.md (URLs pré-assinadas)
- Site estático público: patterns.md (acesso público + domínio custom)
- Pós-processamento: README (notificações) + referência queues
- Debug: gotchas.md

## Nesta referência

- [configuration.md](./configuration.md) — bindings, SDK S3, CORS, lifecycles, escopos de token
- [api.md](./api.md) — API Workers, multipart, condicionais, URLs pré-assinadas
- [patterns.md](./patterns.md) — streaming, cache, uploads do cliente, buckets públicos
- [gotchas.md](./gotchas.md) — truncamento de list, formato etag, tamanho de stream, região do SDK S3

## Ver também

- [workers](../workers/) — runtime e fetch handlers
- [kv](../kv/) — metadados para objetos R2
- [d1](../d1/) — URLs R2 em banco relacional
- [queues](../queues/) — processar uploads R2 de forma assíncrona
