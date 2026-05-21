# Padrões Comuns

## Listar tudo com paginação automática

**Problema:** API retorna resultados paginados. O tamanho de página padrão é 20.

**Solução:** use a paginação automática do SDK para iterar todos os resultados.```typescript
// TypeScript
for await (const zone of client.zones.list()) {
console.log(zone.name)
}

````

```python
# Python
for zone in client.zones.list():
    print(zone.name)
````

```go
// Go
iter := client.Zones.ListAutoPaging(ctx, cloudflare.ZoneListParams{})
for iter.Next() {
    fmt.Println(iter.Current().Name)
}
```

## Tratamento de erros com nova tentativa

**Problema:** Limites de taxa (429) e erros transitórios precisam de nova tentativa.

**Solução:** tentativas automáticas de SDKs com espera exponencial. Personalize conforme necessário.```typescript
// Increase retries for rate-limit-heavy operations
const client = new Cloudflare({ maxRetries: 5 })

try {
const zone = await client.zones.create({
/_ ... _/
})
} catch (err) {
if (err instanceof Cloudflare.RateLimitError) {
// Already retried 5 times with backoff
const retryAfter = err.headers['retry-after']
console.log(`Rate limited. Retry after ${retryAfter}s`)
}
}

````
## Operações paralelas em lote

**Problema:** É necessário criar vários recursos rapidamente.

**Solução:** Use `Promise.all()` para solicitações paralelas (respeite os limites de taxa).```typescript
// Create multiple DNS records in parallel
const records = ['www', 'api', 'cdn'].map((subdomain) =>
  client.dns.records.create({
    zone_id: 'zone-id',
    type: 'A',
    name: `${subdomain}.example.com`,
    content: '192.0.2.1',
  }),
)
await Promise.all(records)
````

**Simultaneidade controlada** (evite limites de taxa):```typescript
import pLimit from 'p-limit'
const limit = pLimit(10) // Max 10 concurrent

const subdomains = ['www', 'api', 'cdn' /* many more */]
const records = subdomains.map((subdomain) =>
limit(() =>
client.dns.records.create({
zone_id: 'zone-id',
type: 'A',
name: `${subdomain}.example.com`,
content: '192.0.2.1',
}),
),
)
await Promise.all(records)

````
## Fluxo de trabalho CRUD da zona```typescript
// Create
const zone = await client.zones.create({
  account: { id: 'account-id' },
  name: 'example.com',
  type: 'full',
})

// Read
const fetched = await client.zones.get({ zone_id: zone.id })

// Update
await client.zones.edit(zone.id, { paused: false })

// Delete
await client.zones.delete(zone.id)
````

## Atualização em massa de DNS```typescript

// Fetch all A records
const records = []
for await (const record of client.dns.records.list({
zone_id: 'zone-id',
type: 'A',
})) {
records.push(record)
}

// Update all to new IP
await Promise.all(
records.map((record) =>
client.dns.records.update({
zone_id: 'zone-id',
dns_record_id: record.id,
type: 'A',
name: record.name,
content: '203.0.113.1', // New IP
proxied: record.proxied,
ttl: record.ttl,
}),
),
)

````
## Filtrar e coletar resultados```typescript
// Find all proxied A records
const proxiedRecords = []
for await (const record of client.dns.records.list({
  zone_id: 'zone-id',
  type: 'A',
})) {
  if (record.proxied) {
    proxiedRecords.push(record)
  }
}
````

## Padrão de recuperação de erros```typescript

async function createZoneWithRetry(name: string, maxAttempts = 3) {
for (let attempt = 1; attempt <= maxAttempts; attempt++) {
try {
return await client.zones.create({
account: { id: 'account-id' },
name,
type: 'full',
})
} catch (err) {
if (err instanceof Cloudflare.RateLimitError && attempt < maxAttempts) {
const retryAfter = parseInt(err.headers['retry-after'] || '5')
console.log(`Rate limited, waiting ${retryAfter}s (retry ${attempt}/${maxAttempts})`)
await new Promise((resolve) => setTimeout(resolve, retryAfter \* 1000))
} else {
throw err
}
}
}
}

````
## Padrão de atualização condicional```typescript
// Only update if zone is active
const zone = await client.zones.get({ zone_id: 'zone-id' })
if (zone.status === 'active') {
  await client.zones.edit(zone.id, { paused: false })
}
````

## Lote com tratamento de erros```typescript

// Process multiple zones, continue on errors
const results = await Promise.allSettled(zoneIds.map((id) => client.zones.get({ zone_id: id })))

results.forEach((result, i) => {
if (result.status === 'fulfilled') {
console.log(`Zone ${i}: ${result.value.name}`)
} else {
console.error(`Zone ${i} failed:`, result.reason.message)
}
})

```
## Veja também

- [api.md](./api.md) - inicialização do cliente SDK, operações básicas
- [gotchas.md](./gotchas.md) - Limites de taxa, erros comuns
- [configuration.md](./configuration.md) - Opções de configuração do SDK
```
