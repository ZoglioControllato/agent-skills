# Dicas de SQL R2

Limitações, solução de problemas e armadilhas comuns para SQL R2.

## Limitações Críticas

### Sem vinculação de trabalhadores

**Não é possível chamar R2 SQL do código de Trabalhadores/Páginas** - não existe ligação.```typescript
// ❌ This doesn't exist
export default {
async fetch(request, env) {
const result = await env.R2_SQL.query('SELECT \* FROM table') // Not possible
return Response.json(result)
},
}

````
**Soluções:**

- API HTTP de sistemas externos (não Workers)
- PyIceberg/Spark via API REST do catálogo de dados r2
- Para Trabalhadores, use D1 ou bancos de dados externos

### ORDER BY Limitações

Só pode encomendar por:

1. **Colunas de chave de partição** – Sempre compatível
2. **Funções de agregação** - Suportadas por meio de estratégia aleatória

**Não é possível ordenar por** colunas regulares sem partição.```sql
-- ✅ Valid: ORDER BY partition key
SELECT * FROM logs.requests ORDER BY timestamp DESC LIMIT 100;

-- ✅ Valid: ORDER BY aggregation
SELECT region, SUM(amount) FROM sales.transactions
GROUP BY region ORDER BY SUM(amount) DESC;

-- ❌ Invalid: ORDER BY non-partition column
SELECT * FROM logs.requests ORDER BY user_id;

-- ❌ Invalid: ORDER BY alias (must repeat function)
SELECT region, SUM(amount) as total FROM sales.transactions
GROUP BY region ORDER BY total;  -- Use ORDER BY SUM(amount)
````

Verifique as especificações da partição: `DESCRIBE namespace.table_name`

## Limitações de recursos SQL

| Recurso                               | Suportado | Notas                                |
| ------------------------------------- | --------- | ------------------------------------ |
| SELECIONE, ONDE, AGRUPANDO POR, TENDO | ✅        | Suporte padrão                       |
| CONTAGEM, SOMA, AVG, MIN, MAX         | ✅        | Agregações padrão                    |
| ORDER BY partição/agregação           | ✅        | Veja acima                           |
| LIMITE                                | ✅        | Máximo de 10.000                     |
| Aliases de coluna                     | ❌        | Nenhum alias de AS                   |
| Expressões em SELECT                  | ❌        | Não col1 + col2                      |
| ORDER BY sem partição                 | ❌        | Falha em tempo de execução           |
| JOINs, subconsultas, CTEs             | ❌        | Desnormalizar no momento da gravação |
| Funções de janela, UNION              | ❌        | Use motores externos                 |
| INSERIR/ATUALIZAR/EXCLUIR             | ❌        | Use PyIceberg/Pipelines              |
| Colunas aninhadas, matrizes, JSON     | ❌        | Achatar na hora da gravação          |

**Soluções alternativas:**

- Sem JOINs: desnormalize os dados ou use Spark/PyIceberg
- Sem subconsultas: dividido em várias consultas
- Sem aliases: aceite nomes gerados, transforme no aplicativo

## Erros Comuns

### "Coluna não encontrada"

**Causa:** Erro de digitação, coluna não existe ou incompatibilidade de maiúsculas e minúsculas
**Solução:** `DESCRIBE namespace.table_name` para verificar o esquema

### "Tipo incompatível"```sql

-- ❌ Wrong types
WHERE status = '200' -- string instead of integer
WHERE timestamp > '2025-01-01' -- missing time/timezone

-- ✅ Correct types
WHERE status = 200
WHERE timestamp > '2025-01-01T00:00:00Z'

````

### "ORDER BY column not in partition key"

**Cause:** Ordering by non-partition column
**Solution:** Use partition key, aggregation, or remove ORDER BY. Check: `DESCRIBE table`

### "Token authentication failed"

```bash
# Check/set token
echo $WRANGLER_R2_SQL_AUTH_TOKEN
export WRANGLER_R2_SQL_AUTH_TOKEN=<your-token>

# Or .env file
echo "WRANGLER_R2_SQL_AUTH_TOKEN=<your-token>" > .env
````

### "Table not found"

```sql
-- Verify catalog and tables
SHOW DATABASES;
SHOW TABLES IN namespace_name;
```

Habilitar catálogo: `npx wrangler r2 bucket catalog enable <bucket>`

### "LIMIT excede o máximo"

O LIMITE máximo é 10.000. Para paginação, use filtros WHERE com chaves de partição.

### "Nenhum dado retornado" (inesperado)

**Etapas de depuração:**

1. `SELECT COUNT(*) FROM table` - verifica se os dados existem
2. Remova os filtros WHERE gradativamente
3. `SELECT * FROM table LIMIT 10` - inspeciona dados/tipos reais

## Problemas de desempenho

### Consultas lentas

**Causas:** Muitas partições, LIMIT grande, sem filtros, arquivos pequenos```sql
-- ❌ Slow: No filters
SELECT \* FROM logs.requests LIMIT 10000;

-- ✅ Fast: Filter on partition key
SELECT \* FROM logs.requests
WHERE timestamp >= '2025-01-15T00:00:00Z' AND timestamp < '2025-01-16T00:00:00Z'
LIMIT 1000;

-- ✅ Faster: Multiple filters
SELECT \* FROM logs.requests
WHERE timestamp >= '2025-01-15T00:00:00Z' AND status = 404 AND method = 'GET'
LIMIT 1000;

````

**File optimization:**

- Target Parquet size: 100-500MB compressed
- Pipelines roll interval: 300+ sec (prod), 10 sec (dev)
- Run compaction to merge small files

### Query Timeout

**Solution:** Add restrictive WHERE filters, reduce time range, query smaller intervals

```sql
-- ❌ Times out: Year-long aggregation
SELECT status, COUNT(*) FROM logs.requests
WHERE timestamp >= '2024-01-01T00:00:00Z' GROUP BY status;

-- ✅ Faster: Month-long aggregation
SELECT status, COUNT(*) FROM logs.requests
WHERE timestamp >= '2025-01-01T00:00:00Z' AND timestamp < '2025-02-01T00:00:00Z'
GROUP BY status;
````

## Best Practices

### Partitioning

- **Time-series:** Partition by day/hour on timestamp
- **Avoid:** High-cardinality keys (user_id), >10,000 partitions

```python
from pyiceberg.partitioning import PartitionSpec, PartitionField
from pyiceberg.transforms import DayTransform

PartitionSpec(PartitionField(source_id=1, field_id=1000, transform=DayTransform(), name="day"))
```

### Escrita de consulta

- **Sempre use LIMIT** para rescisão antecipada
- **Filtre primeiro as chaves de partição** para remoção
- **Combine filtros com AND** para mais poda```sql
  -- Good
  WHERE timestamp >= '2025-01-15T00:00:00Z' AND status = 404 AND method = 'GET' LIMIT 100

```
### Digite Segurança

- Strings de citação: `'GET'` e não `GET`
- Carimbos de data e hora RFC3339: `'2025-01-01T00:00:00Z'` e não `'2025-01-01'`
- Datas ISO: `'2025-01-15'` e não `'01/15/2025'`

### Organização de dados

- **Pipelines:** Dev `roll_file_time: 10`, Prod `roll_file_time: 300+`
- **Compressão:** Use `zstd`
- **Manutenção:** Compactação para arquivos pequenos, expiração de snapshots antigos

## Lista de verificação de depuração

1. `npx wrangler r2 bucket catalog enable <bucket>` - Verificar catálogo
2. `echo $WRANGLER_R2_SQL_AUTH_TOKEN` - Verifique o token
3. `SHOW DATABASES` - Lista namespaces
4. `SHOW TABLES IN namespace` - Listar tabelas
5. `DESCRIBE namespace.table` - Verifique o esquema
6. `SELECT COUNT(*) FROM namespace.table` - Verifique os dados
7. `SELECT * FROM namespace.table LIMIT 10` - Teste de consulta simples
8. Adicione filtros de forma incremental

## Veja também

- [api.md](api.md) - Sintaxe SQL
- [patterns.md](patterns.md) - Otimização de consulta
- [configuration.md](configuration.md) - Configuração
- [Documentos SQL do Cloudflare R2](https://developers.cloudflare.com/r2-sql/)
```
