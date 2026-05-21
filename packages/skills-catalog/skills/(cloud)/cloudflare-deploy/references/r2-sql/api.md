# R2 SQL API Reference

SQL syntax, functions, operators, and data types for R2 SQL queries.

## SQL Syntax

```sql
SELECT column_list | aggregation_function
FROM [namespace.]table_name
WHERE conditions
[GROUP BY column_list]
[HAVING conditions]
[ORDER BY column | aggregation_function [DESC | ASC]]
[LIMIT number]
```

## Schema Discovery

```sql
SHOW DATABASES;           -- List namespaces
SHOW NAMESPACES;          -- Alias for SHOW DATABASES
SHOW SCHEMAS;             -- Alias for SHOW DATABASES
SHOW TABLES IN namespace; -- List tables in namespace
DESCRIBE namespace.table; -- Show table schema, partition keys
```

## SELECT Clause

```sql
-- All columns
SELECT * FROM logs.http_requests;

-- Specific columns
SELECT user_id, timestamp, status FROM logs.http_requests;
```

**Limitações:** Sem aliases de coluna, expressões ou acesso a colunas aninhadas

## Cláusula WHERE

### Operadores

| Operador                        | Exemplo                                                                        |
| ------------------------------- | ------------------------------------------------------------------------------ |
| `=`, `!=`, `<`, `<=`, `>`, `>=` | `status = 200`                                                                 |
| `CURTO`                         | `user_agent LIKE '%Chrome%'`                                                   |
| `ENTRE`                         | `carimbo de data e hora ENTRE '2025-01-01T00:00:00Z' E '2025-01-31T23:59:59Z'` |
| `É NULO`, `NÃO É NULO`          | `e-mail NÃO É NULO`                                                            |
| `E`, `OU`                       | `status = 200 AND método = 'GET'`                                              |

Use parênteses para precedência: `(status = 404 OR status = 500) AND method = 'POST'`

## Funções de agregação

| Função                        | Descrição                |
| ----------------------------- | ------------------------ | ------ |
| `CONTAR(*)`                   | Contar todas as linhas   |
| `CONTAR(coluna)`              | Contar valores não nulos |
| `COUNT(coluna DISTINCT)`      | Contar valores únicos    |
| `SOMA(coluna)`, `AVG(coluna)` | Agregações numéricas     |
| `MIN(coluna)`, `MAX(coluna)`  | Valores mínimo/máximo    | ```sql |

-- Multiple aggregations with GROUP BY
SELECT region, COUNT(\*), SUM(amount), AVG(amount)
FROM sales.transactions
WHERE sale_date >= '2024-01-01'
GROUP BY region;

````

## HAVING Clause

Filter aggregated results (after GROUP BY):

```sql
SELECT category, SUM(amount)
FROM sales.transactions
GROUP BY category
HAVING SUM(amount) > 10000;
````

## ORDER BY Clause

Sort results by:

- **Partition key columns** - Always supported
- **Aggregation functions** - Supported via shuffle strategy

```sql
-- Order by partition key
SELECT * FROM logs.requests ORDER BY timestamp DESC LIMIT 100;

-- Order by aggregation (repeat function, aliases not supported)
SELECT region, SUM(amount)
FROM sales.transactions
GROUP BY region
ORDER BY SUM(amount) DESC;
```

**Limitations:** Cannot order by non-partition columns. See [gotchas.md](gotchas.md#order-by-limitations)

## LIMIT Clause

```sql
SELECT * FROM logs.requests LIMIT 100;
```

| Configuração | Valor  |
| ------------ | ------ |
| Mínimo       | 1      |
| Máx.         | 10.000 |
| Padrão       | 500    |

**Sempre use LIMIT** para permitir a otimização de rescisão antecipada.

## Tipos de dados

| Tipo                     | Literais SQL      | Exemplo                  |
| ------------------------ | ----------------- | ------------------------ |
| `inteiro`                | Número não citado | `42`, `-10`              |
| `flutuar`                | Número decimal    | `3,14`, `-0,5`           |
| `string`                 | Aspas simples     | `'olá'`, `'GET'`         |
| `booleano`               | Palavra-chave     | `verdadeiro`, `falso`    |
| `carimbo de data e hora` | Sequência RFC3339 | `'2025-01-01T00:00:00Z'` |
| `data`                   | Data ISO 8601     | `'2025-01-01'`           |

### Digite Segurança

- Citar strings com aspas simples: `'value'`
- Os carimbos de data e hora devem ser RFC3339: `'2025-01-01T00:00:00Z'` (incluir fuso horário)
- As datas devem ser ISO 8601: `'2025-01-01'` (AAAA-MM-DD)
- Sem conversões implícitas```sql
  -- ✅ Correct
  WHERE status = 200 AND method = 'GET' AND timestamp > '2025-01-01T00:00:00Z'

-- ❌ Wrong
WHERE status = '200' -- string instead of integer
WHERE timestamp > '2025-01-01' -- missing time/timezone
WHERE method = GET -- unquoted string

````

## Query Result Format

JSON array of objects:

```json
[
  { "user_id": "user_123", "timestamp": "2025-01-15T10:30:00Z", "status": 200 },
  { "user_id": "user_456", "timestamp": "2025-01-15T10:31:00Z", "status": 404 }
]
````

## Veja também

- [patterns.md](patterns.md) - Exemplos de consulta e casos de uso
- [gotchas.md](gotchas.md) - Limitações SQL e tratamento de erros
- [configuration.md](configuration.md) - Configuração e autenticação
