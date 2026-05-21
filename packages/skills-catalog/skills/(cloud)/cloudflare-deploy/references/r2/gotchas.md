# R2: gotchas e troubleshooting

## Truncamento de list

```typescript
// ❌ ERRADO: não compare contagem de objetos com include
while (listed.objects.length < options.limit) { ... }

// ✅ CERTO: sempre use truncated
while (listed.truncated) {
  const next = await env.MY_BUCKET.list({ cursor: listed.cursor });
  // ...
}
```

**Motivo:** com `include` e metadados, a página pode ter menos objetos.

## Formato ETag

```typescript
// ❌ ERRADO: etag sem aspas nos headers
headers.set('etag', object.etag) // Missing quotes

// ✅ CERTO: use httpEtag (com aspas)
headers.set('etag', object.httpEtag)
```

## Limites de checksum

Só UM algoritmo de checksum por PUT:

```typescript
// ❌ ERRADO: vários checksums
await env.MY_BUCKET.put(key, data, { md5: hash1, sha256: hash2 }) // Error

// ✅ CERTO: escolha um
await env.MY_BUCKET.put(key, data, { sha256: hash })
```

## Requisitos multipart

- Partes com tamanho uniforme (exceto a última)
- Números de parte começam em 1 (não 0)
- Uploads incompletos abortam após 7 dias
- `resumeMultipartUpload` não valida existência do uploadId

## Operações condicionais

```typescript
// Falha de pré-condição retorna objeto SEM body
const object = await env.MY_BUCKET.get(key, {
  onlyIf: { etagMatches: '"wrong"' },
})

// Verifique body, não só null
if (!object) return new Response('Not found', { status: 404 })
if (!object.body) return new Response(null, { status: 304 }) // Precondition failed
```

## Validação de key

```typescript
// ❌ PERIGOSO: path traversal
const key = url.pathname.slice(1) // Could be ../../../etc/passwd
await env.MY_BUCKET.get(key)

// ✅ SEGURO: valide keys
if (!key || key.includes('..') || key.startsWith('/')) {
  return new Response('Invalid key', { status: 400 })
}
```

## Armadilhas de storage class

- InfrequentAccess: cobrança mínima 30 dias (mesmo apagando antes)
- Não dá para transicionar IA → Standard só com lifecycle (use S3 CopyObject)
- IA tem taxas de leitura

## Stream sem tamanho conhecido

```typescript
// ❌ ERRADO: stream de tamanho desconhecido pode falhar silenciosamente
const response = await fetch(url)
await env.MY_BUCKET.put(key, response.body) // May fail without error

// ✅ CERTO: buffer ou Content-Length
const data = await response.arrayBuffer()
await env.MY_BUCKET.put(key, data)

// OU: passe Content-Length se souber
const object = await env.MY_BUCKET.put(key, request.body, {
  httpMetadata: {
    contentLength: parseInt(request.headers.get('content-length') || '0'),
  },
})
```

**Motivo:** R2 precisa de comprimento conhecido; tamanho desconhecido pode truncar sem erro claro.

## Região do SDK S3

```typescript
// ❌ ERRADO: sem region quebra chamadas S3
const s3 = new S3Client({
  endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
  credentials: { ... }
});

// ✅ CERTO: region='auto' obrigatório
const s3 = new S3Client({
  region: 'auto', // REQUIRED
  endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
  credentials: { ... }
});
```

**Motivo:** SDK exige região; no R2 use `auto`.

## Limites do dev local

```typescript
// ❌ Miniflare/wrangler dev: suporte R2 limitado
// - No multipart uploads
// - No presigned URLs (requires S3 SDK + network)
// - Memory-backed storage (lost on restart)

// ✅ Bindings remotos para recursos completos
wrangler dev --remote

// OU: lógica condicional
if (env.ENVIRONMENT === 'development') {
  // Fallback for local dev
} else {
  // Full R2 features
}
```

## Expiração de URL pré-assinada

```typescript
// ❌ ERRADO: URL expira sem aviso ao cliente
const url = await getSignedUrl(s3, command, { expiresIn: 60 })
// 61 seconds later: 403 Forbidden

// ✅ CERTO: devolva expiração
return Response.json({
  uploadUrl: url,
  expiresAt: new Date(Date.now() + 60000).toISOString(),
})
```

## Limites

| Limite                      | Valor                |
| --------------------------- | -------------------- |
| Tamanho do objeto           | 5 TB                 |
| Partes multipart            | 10.000               |
| Tamanho mínimo da parte     | 5 MB (exceto última) |
| Delete em lote              | 1.000 keys           |
| Limite de list              | 1.000 por request    |
| Tamanho da key              | 1024 bytes           |
| Metadata custom             | 2 KB por objeto      |
| Expiração máx. URL assinada | 7 dias               |

## Erros comuns

### "Stream upload failed" / truncamento silencioso

**Causa:** comprimento do stream desconhecido ou Content-Length ausente  
**Solução:** bufferize ou passe Content-Length explícito

### "Invalid credentials" / SDK S3

**Causa:** falta `region: 'auto'`  
**Solução:** sempre `region: 'auto'` no R2

### "Object not found"

**Causa:** key inexistente ou apagada  
**Solução:** confira key, bucket e lifecycle

### "List compatibility error"

**Causa:** compatibility_date antiga ou flag não habilitada  
**Solução:** `compatibility_date >= 2022-08-04` ou flag `r2_list_honor_include`

### "Multipart upload failed"

**Causa:** partes com tamanhos irregulares ou número de parte errado  
**Solução:** tamanho uniforme exceto última; partes começam em 1
