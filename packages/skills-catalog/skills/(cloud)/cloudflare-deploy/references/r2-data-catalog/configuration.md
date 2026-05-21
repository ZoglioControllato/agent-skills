# Configuration

How to enable R2 Data Catalog and configure authentication.

## Prerequisites

- Cloudflare account with [R2 subscription](https://developers.cloudflare.com/r2/pricing/)
- R2 bucket created
- Access to Cloudflare dashboard or Wrangler CLI

## Enable Catalog on Bucket

Choose one method:

### Via Wrangler (Recommended)

```bash
npx wrangler r2 bucket catalog enable <BUCKET_NAME>
```

**Output:**

```
✅ Data Catalog enabled for bucket 'my-bucket'
   Catalog URI: https://<account-id>.r2.cloudflarestorage.com/iceberg/my-bucket
   Warehouse: my-bucket
```

### Via Dashboard

1. Navigate to **R2** → Select your bucket → **Settings** tab
2. Scroll to "R2 Data Catalog" section → Click **Enable**
3. Note the **Catalog URI** and **Warehouse name** shown

**Result:**

- Catalog URI: `https://<account-id>.r2.cloudflarestorage.com/iceberg/<bucket-name>`
- Warehouse: `<bucket-name>` (same as bucket name)

### Via API (Programmatic)

```bash
curl -X POST \
  "https://api.cloudflare.com/client/v4/accounts/<account-id>/r2/buckets/<bucket>/catalog" \
  -H "Authorization: Bearer <api-token>" \
  -H "Content-Type: application/json"
```

**Response:**

```json
{
  "result": {
    "catalog_uri": "https://<account-id>.r2.cloudflarestorage.com/iceberg/<bucket>",
    "warehouse": "<bucket>"
  },
  "success": true
}
```

## Check Catalog Status

```bash
npx wrangler r2 bucket catalog status <BUCKET_NAME>
```

**Output:**

```
Catalog Status: enabled
Catalog URI: https://<account-id>.r2.cloudflarestorage.com/iceberg/my-bucket
Warehouse: my-bucket
```

## Disable Catalog (If Needed)

```bash
npx wrangler r2 bucket catalog disable <BUCKET_NAME>
```

⚠️ **Aviso:** Desativar NÃO exclui tabelas/dados. Os arquivos permanecem no bucket. Os metadados ficam inacessíveis até serem reativados.

## Criação de token de API

O R2 Data Catalog requer token de API com **ambas** permissões R2 Storage + R2 Data Catalog.

### Método de painel (recomendado)

1. Vá para **R2** → **Gerenciar tokens de API R2** → **Criar token de API**
2. Selecione o nível de permissão:

- **Admin Read & Write** - Catálogo completo + acesso ao armazenamento (leitura/gravação)
- **Admin Somente leitura** - Acesso somente leitura (para mecanismos de consulta)

3. Copie o valor do token imediatamente (mostrado apenas uma vez)

**Grupos de permissão incluídos:**

- `Escrita do catálogo de dados Workers R2` (ou leitura)
- `Escrita de item do bucket de armazenamento Workers R2` (ou leitura)

### Método API (Programático)

Use a API Cloudflare para criar tokens programaticamente. Permissões necessárias:

- `Escrita do catálogo de dados Workers R2` (ou leitura)
- `Escrita de item do bucket de armazenamento Workers R2` (ou leitura)

## Configuração do cliente

###PyIceberg```python
from pyiceberg.catalog.rest import RestCatalog

catalog = RestCatalog(
name="my_catalog",
warehouse="<bucket-name>", # Same as bucket name
uri="<catalog-uri>", # From enable command
token="<api-token>", # From token creation
)

````

**Full example with credentials:**

```python
import os
from pyiceberg.catalog.rest import RestCatalog

# Store credentials in environment variables
WAREHOUSE = os.getenv("R2_WAREHOUSE")      # e.g., "my-bucket"
CATALOG_URI = os.getenv("R2_CATALOG_URI")  # e.g., "https://abc123.r2.cloudflarestorage.com/iceberg/my-bucket"
TOKEN = os.getenv("R2_TOKEN")              # API token

catalog = RestCatalog(
    name="r2_catalog",
    warehouse=WAREHOUSE,
    uri=CATALOG_URI,
    token=TOKEN,
)

# Test connection
print(catalog.list_namespaces())
````

### Spark/Trino/DuckDB

Consulte [patterns.md](patterns.md) para exemplos de integração com outros mecanismos de consulta.

## Formato da string de conexão

Para referência rápida:```
Catalog URI: https://<account-id>.r2.cloudflarestorage.com/iceberg/<bucket>
Warehouse: <bucket-name>
Token: <r2-api-token>

````
**Onde encontrar valores:**

| Valor | Fonte |
| -------------- | ---------------------------------------------------------- |
| `<ID da conta>` | URL do painel ou `wrangler whoami` |
| `<balde>` | Nome do intervalo R2 |
| URI do catálogo | Saída de `catálogo de balde wrangler r2 habilitado` |
| Ficha | Página de criação de token API R2 |

## Melhores práticas de segurança

1. **Armazene tokens com segurança** - Use variáveis de ambiente ou gerenciadores de segredos, nunca codifique
2. **Use privilégios mínimos** - Tokens somente leitura para mecanismos de consulta, grave tokens apenas quando necessário
3. **Alterne tokens regularmente** - Crie novos tokens, teste e revogue os antigos
4. **Um token por aplicativo** – Mais fácil de rastrear e revogar se comprometido
5. **Monitore o uso de tokens** - Verifique a análise R2 em busca de padrões inesperados
6. **Tokens com escopo de bucket** - Crie tokens por bucket, não para toda a conta

## Padrão de variáveis de ambiente```bash
# .env (never commit)
R2_CATALOG_URI=https://<account-id>.r2.cloudflarestorage.com/iceberg/<bucket>
R2_WAREHOUSE=<bucket-name>
R2_TOKEN=<api-token>
````

```python
import os
from pyiceberg.catalog.rest import RestCatalog

catalog = RestCatalog(
    name="r2",
    uri=os.getenv("R2_CATALOG_URI"),
    warehouse=os.getenv("R2_WAREHOUSE"),
    token=os.getenv("R2_TOKEN"),
)
```

## Troubleshooting

| Problem                 | Solution                                           |
| ----------------------- | -------------------------------------------------- |
| 404 "catalog not found" | Run `wrangler r2 bucket catalog enable <bucket>`   |
| 401 "unauthorized"      | Check token has both Catalog + Storage permissions |
| 403 on data files       | Token needs both permission groups                 |

See [gotchas.md](gotchas.md) for detailed troubleshooting.
