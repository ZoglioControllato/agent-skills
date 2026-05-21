# Referência de API

O Catálogo de Dados R2 expõe o padrão [API do Catálogo REST do Apache Iceberg](https://github.com/apache/iceberg/blob/main/open-api/rest-catalog-open-api.yaml).

## Referência rápida

**Operações mais comuns:**

| Tarefa                 | Código PyIceberg                                                  |
| ---------------------- | ----------------------------------------------------------------- |
| Conectar               | `RestCatalog(name="r2", warehouse=bucket, uri=uri, token=token)`  |
| Listar namespaces      | `catalog.list_namespaces()`                                       |
| Criar espaço para nome | `catalog.create_namespace("logs")`                                |
| Criar tabela           | `catalog.create_table(("ns", "tabela"), esquema=esquema)`         |
| Tabela de carga        | `catalog.load_table(("ns", "tabela"))`                            |
| Anexar dados           | `tabela.append(pyarrow_table)`                                    |
| Consultar dados        | `table.scan().to_pandas()`                                        |
| Arquivos compactos     | `tabela.rewrite_data_files(target_file_size_bytes=128*1024*1024)` |
| Expirar instantâneos   | `table.expire_snapshots(older_than=timestamp_ms, reter_last=10)`  |

## Terminais REST

Base: `https://<account-id>.r2.cloudflarestorage.com/iceberg/<bucket-name>`

| Operação                 | Método  | Caminho                                |
| ------------------------ | ------- | -------------------------------------- |
| Configuração do catálogo | OBTER   | `/v1/config`                           |
| Listar namespaces        | OBTER   | `/v1/namespaces`                       |
| Criar espaço para nome   | POSTAR  | `/v1/namespaces`                       |
| Excluir espaço para nome | EXCLUIR | `/v1/namespaces/{ns}`                  |
| Listar tabelas           | OBTER   | `/v1/namespaces/{ns}/tabelas`          |
| Criar tabela             | POSTAR  | `/v1/namespaces/{ns}/tabelas`          |
| Tabela de carga          | OBTER   | `/v1/namespaces/{ns}/tabelas/{tabela}` |
| Atualizar tabela         | POSTAR  | `/v1/namespaces/{ns}/tabelas/{tabela}` |
| Excluir tabela           | EXCLUIR | `/v1/namespaces/{ns}/tabelas/{tabela}` |
| Renomear tabela          | POSTAR  | `/v1/tabelas/renomear`                 |

**Autenticação:** Token do portador no cabeçalho: `Autorização: Portador <token>`

## API do cliente PyIceberg

A maioria dos usuários usa PyIceberg, não REST bruto.

### Conexão

```python
from pyiceberg.catalog.rest import RestCatalog

catalog = RestCatalog(
    name="my_catalog",
    warehouse="<bucket-name>",
    uri="<catalog-uri>",
    token="<api-token>",
)
```

### Operações de namespace

```python
from pyiceberg.exceptions import NamespaceAlreadyExistsError

namespaces = catalog.list_namespaces()  # [('default',), ('logs',)]
catalog.create_namespace("logs", properties={"owner": "team"})
catalog.drop_namespace("logs")  # Must be empty
```

### Operações de Tabela

```python
from pyiceberg.schema import Schema
from pyiceberg.types import NestedField, StringType, IntegerType

schema = Schema(
    NestedField(1, "id", IntegerType(), required=True),
    NestedField(2, "name", StringType(), required=False),
)
table = catalog.create_table(("logs", "app_logs"), schema=schema)
tables = catalog.list_tables("logs")
table = catalog.load_table(("logs", "app_logs"))
catalog.rename_table(("logs", "old"), ("logs", "new"))
```

### Operações de dados

```python
import pyarrow as pa

data = pa.table({"id": [1, 2], "name": ["Alice", "Bob"]})
table.append(data)
table.overwrite(data)

# Read with filters
scan = table.scan(row_filter="id > 100", selected_fields=["id", "name"])
df = scan.to_pandas()
```

### Evolução do esquema

```python
from pyiceberg.types import IntegerType, LongType

with table.update_schema() as update:
    update.add_column("user_id", IntegerType(), doc="User ID")
    update.rename_column("msg", "message")
    update.delete_column("old_field")
    update.update_column("id", field_type=LongType())  # int→long only
```

### Viagem no tempo

```python
from datetime import datetime, timedelta

# Query specific snapshot or timestamp
scan = table.scan(snapshot_id=table.snapshots()[-2].snapshot_id)
yesterday_ms = int((datetime.now() - timedelta(days=1)).timestamp() * 1000)
scan = table.scan(as_of_timestamp=yesterday_ms)
```

### Particionamento

```python
from pyiceberg.partitioning import PartitionSpec, PartitionField
from pyiceberg.transforms import DayTransform
from pyiceberg.types import TimestampType

partition_spec = PartitionSpec(
    PartitionField(source_id=1, field_id=1000, transform=DayTransform(), name="day")
)
table = catalog.create_table(("events", "actions"), schema=schema, partition_spec=partition_spec)
scan = table.scan(row_filter="day = '2026-01-27'")  # Prunes partitions
```

##Manutenção de Tabela

### Compactação

```python
files = table.scan().plan_files()
avg_mb = sum(f.file_size_in_bytes for f in files) / len(files) / (1024**2)
print(f"Files: {len(files)}, Avg: {avg_mb:.1f} MB")

table.rewrite_data_files(target_file_size_bytes=128 * 1024 * 1024)
```

**Quando:** Média <10 MB ou >1.000 arquivos. **Frequência:** Gravações diárias altas, semanais médias.

### Expiração do instantâneo

```python
from datetime import datetime, timedelta

seven_days_ms = int((datetime.now() - timedelta(days=7)).timestamp() * 1000)
table.expire_snapshots(older_than=seven_days_ms, retain_last=10)
```

**Retenção:** Produção 7-30d, desenvolvimento 1-7d, auditoria 90+d.

### Limpeza Órfã

````python
three_days_ms = int((datetime.now() - timedelta(days=3)).timestamp() * 1000)
table.delete_orphan_files(older_than=three_days_ms)
```⚠️ Sempre expire os snapshots primeiro, use o limite de mais de 3 dias, execute durante tráfego baixo.

### Manutenção Completa
```python
# Compact → Expire → Cleanup (in order)
if len(table.scan().plan_files()) > 1000:
    table.rewrite_data_files(target_file_size_bytes=128 * 1024 * 1024)
seven_days_ms = int((datetime.now() - timedelta(days=7)).timestamp() * 1000)
table.expire_snapshots(older_than=seven_days_ms, retain_last=10)
three_days_ms = int((datetime.now() - timedelta(days=3)).timestamp() * 1000)
table.delete_orphan_files(older_than=three_days_ms)
````

##Inspeção de metadados

```python
table = catalog.load_table(("logs", "app_logs"))
print(table.schema())
print(table.current_snapshot())
print(table.properties)
print(f"Files: {len(table.scan().plan_files())}")
```

##Códigos de erro

| Código | Significado    | Causas Comuns                                  |
| ------ | -------------- | ---------------------------------------------- |
| 401    | Não autorizado | Token inválido/ausente                         |
| 404    | Não encontrado | Catálogo não ativado, namespace/tabela ausente |
| 409    | Conflito       | Já existe, atualização simultânea              |
| 422    | Validação      | Esquema inválido, tipo incompatível            |

Consulte [gotchas.md](gotchas.md) para solução de problemas detalhada.
