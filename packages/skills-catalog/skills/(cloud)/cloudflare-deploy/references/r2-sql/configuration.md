#Configuração SQL R2

Instalação e configuração para consultas SQL R2.

## Pré-requisitos

- Bucket R2 com Catálogo de Dados ativado
- Token API com permissões R2
- Wrangler CLI instalado (para consultas CLI)

## Habilitar catálogo de dados R2

R2 SQL consulta tabelas Apache Iceberg no Catálogo de Dados R2. É necessário ativar o catálogo no bucket primeiro.

### Através da CLI do Wrangler```bash

npx wrangler r2 bucket catalog enable <bucket-name>

```

Output includes:

- **Warehouse name** - Typically same as bucket name
- **Catalog URI** - REST endpoint for catalog operations

Example output:

```

Catalog enabled successfully
Warehouse: my-bucket
Catalog URI: https://abc123.r2.cloudflarestorage.com/iceberg/my-bucket

````
### Através do painel

1. Navegue até **R2 Object Storage** → Selecione seu bucket
2. Clique na guia **Configurações**
3. Role até a seção **Catálogo de dados R2**
4. Clique em **Ativar**
5. Observe o **URI do catálogo** e o nome do **Armazém**

**Importante:** ativar o catálogo cria diretórios de metadados no bucket, mas não modifica os objetos existentes.

## Criar token de API

R2 SQL requer token de API com permissões R2.

### Permissão necessária

**Leitura e gravação de administrador R2** (inclui permissão de leitura SQL R2)

### Através do painel

1. Navegue até **Armazenamento de objetos R2**
2. Clique em **Gerenciar tokens de API** (canto superior direito)
3. Clique em **Criar token de API**
4. Selecione a permissão **Administrador de leitura e gravação**
5. Clique em **Criar token de API**
6. **Copiar valor do token** - mostrado apenas uma vez

### Escopo de permissão

| Permissão | Concede acesso a |
| --------------------- | ---------------------------------------------------------------- |
| Leitura e gravação do administrador R2 | Operações de armazenamento R2 + consultas SQL R2 + operações do Data Catalog |
| Leitura SQL R2 | Somente consultas SQL (sem gravações de armazenamento) |

**Observação:** A permissão de leitura SQL R2 ainda não está disponível via Dashboard - use Admin Read & Write.

## Configurar ambiente

### CLI do Wrangler

Defina a variável de ambiente para o Wrangler usar:```bash
export WRANGLER_R2_SQL_AUTH_TOKEN=<your-token>
````

Or create `.env` file in project directory:

```
WRANGLER_R2_SQL_AUTH_TOKEN=<your-token>
```

Wrangler automatically loads `.env` file when running commands.

### HTTP API

For programmatic access (non-Wrangler), pass token in Authorization header:

```bash
curl -X POST https://api.cloudflare.com/client/v4/accounts/{account_id}/r2/sql/query \
  -H "Authorization: Bearer <your-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "warehouse": "my-bucket",
    "query": "SELECT * FROM default.my_table LIMIT 10"
  }'
```

**Note:** HTTP API endpoint URL may vary - see [patterns.md](patterns.md#http-api-query) for current endpoint.

## Verify Setup

Test configuration by querying system tables:

```bash
# List namespaces
npx wrangler r2 sql query "my-bucket" "SHOW DATABASES"

# List tables in namespace
npx wrangler r2 sql query "my-bucket" "SHOW TABLES IN default"
```

If successful, returns JSON array of results.

## Troubleshooting

### "Token authentication failed"

**Cause:** Invalid or missing token

**Solution:**

- Verify `WRANGLER_R2_SQL_AUTH_TOKEN` environment variable set
- Check token has Admin Read & Write permission
- Create new token if expired

### "Catalog not enabled on bucket"

**Cause:** Data Catalog not enabled

**Solution:**

- Run `npx wrangler r2 bucket catalog enable <bucket-name>`
- Or enable via Dashboard (R2 → bucket → Settings → R2 Data Catalog)

### "Permission denied"

**Cause:** Token lacks required permissions

**Solution:**

- Verify token has **Admin Read & Write** permission
- Create new token with correct permissions

## See Also

- [r2-data-catalog/configuration.md](../r2-data-catalog/configuration.md) - Detailed token setup and PyIceberg connection
- [patterns.md](patterns.md) - Query examples using configuration
- [gotchas.md](gotchas.md) - Common configuration errors
