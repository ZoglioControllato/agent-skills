# Dicas e solução de problemas

## Limites de taxa e erros 429

**Limites reais:**

- **1.200 solicitações/5 minutos** por usuário/token (global)
- **200 solicitações/segundo** por endereço IP
- **GraphQL: 320/5 minutos** (com base no custo)

**Comportamento do SDK:**

- Nova tentativa automática com espera exponencial (padrão 2 tentativas, Go: 10)
- Respeita o cabeçalho `Retry-After`
- Lança `RateLimitError` após tentativas exaustivas

**Solução:**

```typescript
// Increase retries for rate-limit-heavy workflows
const client = new Cloudflare({ maxRetries: 5 })

// Add application-level throttling
import pLimit from 'p-limit'
const limit = pLimit(10) // Max 10 concurrent requests
```

## Problemas específicos do SDK

### Ir: Wrapper de campo obrigatório

**Problema:** Go SDK requer wrapper `cloudflare.F()` para campos opcionais.```go
// ❌ WRONG - Won't compile or send field
client.Zones.New(ctx, cloudflare.ZoneNewParams{
Name: "example.com",
})

// ✅ CORRECT
client.Zones.New(ctx, cloudflare.ZoneNewParams{
Name: cloudflare.F("example.com"),
Account: cloudflare.F(cloudflare.ZoneNewParamsAccount{
ID: cloudflare.F("account-id"),
}),
})

````

**Porquê:** Distingue entre campos de valor zero, nulos e omitidos.

### Python: clientes assíncronos vs. sincronizados

**Problema:** Usando o cliente de sincronização em contexto assíncrono ou vice-versa.```python
# ❌ WRONG - Can't await sync client
from cloudflare import Cloudflare
client = Cloudflare()
await client.zones.list()  # TypeError

# ✅ CORRECT - Use AsyncCloudflare
from cloudflare import AsyncCloudflare
client = AsyncCloudflare()
await client.zones.list()
````

## Erros de permissão de token (403)

**Problema:** API retorna 403 Proibido apesar do token válido.

**Causa:** O token não possui as permissões necessárias (escopo).

**Escopos necessários:**

| Operação              | Escopo necessário                               |
| --------------------- | ----------------------------------------------- |
| Listar zonas          | Zona:Leitura (nível de zona ou nível de conta)  |
| Criar zona            | Zona:Editar (nível da conta)                    |
| Editar DNS            | DNS:Editar (nível de zona)                      |
| Implantar Trabalhador | Script de trabalhadores:Editar (nível de conta) |
| Leia KV               | Armazenamento KV de trabalhadores:Leia          |
| Escreva KV            | Armazenamento KV de trabalhadores:Editar        |

**Solução:** Recrie o token com as permissões corretas em Dashboard → Meu perfil → Tokens de API.

## Truncamento de paginação

**Problema:** Obtendo apenas os primeiros 20 resultados (tamanho de página padrão).

**Solução:** Use iteradores de paginação automática.```typescript
// ❌ WRONG - Only first page (20 items)
const page = await client.zones.list()

// ✅ CORRECT - All results
const zones = []
for await (const zone of client.zones.list()) {
zones.push(zone)
}

````
## Subsolicitações de trabalhadores

**Problema:** O limite de taxa atingiu mais rápido do que o esperado em Trabalhadores.

**Causa:** as subsolicitações dos trabalhadores contam como chamadas de API separadas.

**Solução:** Use vinculações em vez da API REST em Workers (consulte ../bindings/).```typescript
// ❌ WRONG - REST API in Workers (counts against rate limit)
const client = new Cloudflare({ apiToken: env.CLOUDFLARE_API_TOKEN })
const zones = await client.zones.list()

// ✅ CORRECT - Use bindings (no rate limit)
// Access via env.MY_BINDING
````

## Erros de autenticação (401)

**Problema:** "Falha na autenticação" ou "Token inválido"

**Causas:**

- Token expirou
- Token excluído/revogado
- Token não definido no ambiente
- Formato de token errado

**Solução:**

```typescript
// Verify token is set
if (!process.env.CLOUDFLARE_API_TOKEN) {
  throw new Error('CLOUDFLARE_API_TOKEN not set')
}

// Test token
const user = await client.user.tokens.verify()
console.log('Token valid:', user.status)
```

## Erros de tempo limite

**Problema:** A solicitação atinge o tempo limite (padrão 60s).

**Causa:** Grandes operações (DNS em massa, transferências de zona).

**Solução:** Aumente o tempo limite ou divida as operações.```typescript
// Increase timeout
const client = new Cloudflare({
timeout: 300000, // 5 minutes
})

// Or split operations
const batchSize = 100
for (let i = 0; i < records.length; i += batchSize) {
const batch = records.slice(i, i + batchSize)
await processBatch(batch)
}

````
## Zona não encontrada (404)

**Problema:** ID de zona válido, mas retorna 404.

**Causas:**

- Zona não incluída na conta associada ao token
- Zona excluída
- Formato de ID de zona incorreto

**Solução:**

```typescript
// List all zones to find correct ID
for await (const zone of client.zones.list()) {
  console.log(zone.id, zone.name)
}
````

## Referência de Limites

| Recurso/Limite                  | Valor     | Notas                    |
| ------------------------------- | --------- | ------------------------ |
| Limite de taxa API              | 1200/5min | Por usuário/token        |
| Limite de taxa IP               | 200/seg   | Por IP                   |
| Limite de taxa GraphQL          | 320/5min  | Baseado em custos        |
| Pedidos paralelos (recomendado) | <10       | Evite API sobrecarregada |
| Tamanho de página padrão        | 20        | Use paginação automática |
| Tamanho máximo da página        | 50        | Alguns terminais         |

## Melhores práticas

**Segurança:**

- Nunca comprometa tokens
- Use permissões mínimas
- Gire os tokens regularmente
- Definir expiração do token

**Desempenho:**

- Operações em lote
- Use a paginação com sabedoria
- Respostas de cache
- Lidar com limites de taxa

**Organização do código:**

```typescript
// Create reusable client instance
export const cfClient = new Cloudflare({
  apiToken: process.env.CLOUDFLARE_API_TOKEN,
  maxRetries: 5,
})

// Wrap common operations
export async function getZoneDetails(zoneId: string) {
  return await cfClient.zones.get({ zone_id: zoneId })
}
```

## Veja também

- [api.md](./api.md) - Tipos de erros, autenticação
- [configuration.md](./configuration.md) - Configuração de tempo limite/nova tentativa
- [patterns.md](./patterns.md) - Padrões de tratamento de erros
