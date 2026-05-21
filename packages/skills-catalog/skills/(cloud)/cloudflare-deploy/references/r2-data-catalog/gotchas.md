# Dicas e solução de problemas

Problemas comuns → causas → soluções.

## Erros de permissão

### 401 Não autorizado

**Erro:** `"401 Não Autorizado"`
**Causa:** Token sem permissões do Catálogo de Dados R2.
**Solução:** Use o token "Admin Read & Write" (inclui catálogo + permissões de armazenamento). Teste com `catalog.list_namespaces()`.

### 403 Proibido

**Erro:** `"403 Forbidden"` em arquivos de dados
**Causa:** O token não tem permissões de armazenamento.
**Solução:** O token precisa das permissões R2 Data Catalog + R2 Storage Bucket Item.

### Problemas de rotação de token

**Erro:** O novo token falha após a rotação.
**Solução:** Criar novo token → testar na preparação → atualizar o produto → monitorar 24h → revogar o antigo.

## Problemas de URI de catálogo

### 404 não encontrado

**Erro:** `"Catálogo 404 não encontrado"`
**Causa:** Catálogo não ativado ou URI errado.
**Solução:** Execute `wrangler r2 bucket catalog enable <bucket>`. O URI deve ser HTTPS com `/iceberg/` e nome do bucket com distinção entre maiúsculas e minúsculas.

### Armazém Errado

**Erro:** Não é possível criar/carregar tabelas.
**Causa:** Armazém ≠ nome do bucket.
**Solução:** Defina `warehouse="bucket-name"` para corresponder exatamente ao bucket.

## Problemas de tabela e esquema

### Tabela/Namespace já existe

**Erro:** `"TableAlreadyExistsError"`
**Solução:** Use try/except para carregar o existente ou verifique primeiro.

### Namespace não encontrado

**Erro:** Não é possível criar a tabela.
**Solução:** Crie o namespace primeiro: `catalog.create_namespace("ns")`

### Erros de evolução de esquema

**Erro:** `"422 Validation"` na atualização do esquema.
**Causa:** Alteração incompatível (campo obrigatório, digite encolher).
**Solução:** Adicione apenas colunas anuláveis, ampliação de tipo compatível (int→long, float→double).

## Problemas de dados e consultas

### Resultados de verificação vazios

**Erro:** A verificação não retorna dados.
**Causa:** Filtro ou coluna de partição incorreta.
**Solução:** Teste primeiro sem filtro: `table.scan().to_pandas()`. Verifique os nomes das colunas de partição.

### Consultas lentas

**Erro:** O desempenho diminui com o tempo.
**Causa:** Muitos arquivos pequenos.
**Solução:** Verifique a contagem de arquivos, compacte se >1000 ou média <10MB. Consulte [api.md](api.md#compaction).

### Incompatibilidade de tipo

**Erro:** `"Não é possível transmitir"` no acréscimo.
**Causa:** Os tipos PyArrow não correspondem ao esquema Iceberg.
**Solução:** Converta para int64 (padrão do Iceberg), não para int32. Verifique `table.schema ()`.

## Problemas de compactação

### Problemas de compactação

**Problema:** A contagem de arquivos não foi alterada ou a compactação leva horas.
**Causa:** Tamanho do alvo muito grande ou tabela muito grande para PyIceberg.
**Solução:** Compacte somente se a média for <50 MB. Para tabelas >1 TB, use Spark. Execute durante períodos de baixo tráfego.

## Problemas de manutenção

### Problemas de instantâneo/órfãos

**Problema:** A expiração falha ou a limpeza órfã exclui os dados ativos.
**Causa:** Retenção muito agressiva ou ordem errada.
**Solução:** Sempre expire os snapshots primeiro com `retain_last=10` e, em seguida, limpe os órfãos com limite de mais de 3 dias.

## Problemas de simultaneidade

### Conflitos de gravação simultâneos

**Problema:** `CommitFailedException` com vários gravadores.
**Causa:** Bloqueio otimista – confirmações simultâneas.
**Solução:** Adicione nova tentativa com espera exponencial (consulte [patterns.md](patterns.md#pattern-6-concurrent-writes-with-retry)).

### Metadados obsoletos

**Problema:** Esquema/dados antigos após atualização externa.
**Causa:** Metadados armazenados em cache.
**Solução:** Recarregar tabela: `table = catalog.load_table(("ns", "table"))`

## Otimização de desempenho

### Dicas de desempenho

**Verificações:** Use `row_filter` e `selected_fields` para reduzir os dados verificados.
**Partições:** 100-1000 ideal. Evite cardinalidade alta (milhões) ou baixa (<10).
**Arquivos:** Mantenha uma média de 100-500 MB. Compacte se arquivos <10MB ou >10k.

## Limites

| Recurso             | Recomendado | Impacto se excedido            |
| ------------------- | ----------- | ------------------------------ |
| Tabelas/namespace   | <10 mil     | Operações de lista lenta       |
| Arquivos/tabela     | <100 mil    | Planejamento de consulta lento |
| Partições/mesa      | 100-1k      | Sobrecarga de metadados        |
| Instantâneos/tabela | Expira >7d  | Inchaço de metadados           |

## Referência de mensagens de erro comuns

| Mensagem de erro                       | Causa provável                               | Correção                                                        |
| -------------------------------------- | -------------------------------------------- | --------------------------------------------------------------- |
| `401 Não autorizado`                   | Token ausente/inválido                       | Verifique se o token tem permissões de catálogo + armazenamento |
| `403 Proibido`                         | Token não possui permissões de armazenamento | Adicionar permissão de item de intervalo de armazenamento R2    |
| `404 não encontrado`                   | Catálogo não habilitado ou URI errado        | Execute `habilitar catálogo de bucket do wrangler r2`           |
| `409 Conflito`                         | Tabela/namespace já existe                   | Use try/except ou carregue existente                            |
| `422 Entidade Não Processável`         | Falha na validação do esquema                | Verifique a compatibilidade de tipo, campos obrigatórios        |
| `CommitFailedException`                | Conflito de gravação simultâneo              | Adicionar lógica de nova tentativa com espera                   |
| `NamespaceAlreadyExistsError`          | O espaço para nome existe                    | Use try/except ou carregue existente                            |
| `NoSuchTableError`                     | A tabela não existe                          | Verifique o namespace + nome da tabela, crie primeiro           |
| `TypeError: Não é possível transmitir` | Incompatibilidade de tipo PyArrow            | Transmitir dados para corresponder ao esquema Iceberg           |

## Lista de verificação de depuração

Quando as coisas dão errado, verifique em ordem:

1. ✅ **Catálogo habilitado:** `npx wrangler r2 bucket catalog status <bucket>`
2. ✅ **Permissões de token:** Catálogo de dados R2 + Armazenamento R2 no painel
3. ✅ **Teste de conexão:** `catalog.list_namespaces()` foi bem-sucedido
4. ✅ **Formato URI:** HTTPS, inclui `/iceberg/`, nome correto do bucket
5. ✅ **Nome do armazém:** Corresponde exatamente ao nome do bucket
6. ✅ **Namespace existe:** Crie antes de `create_table()`
7. ✅ **Ativar registro de depuração:** `logging.basicConfig(level=logging.DEBUG)`
8. ✅ **Versão PyIceberg:** `pip install --upgrade pyiceberg` (≥0.5.0)
9. ✅ **Saúde do arquivo:** Compactar se >1.000 arquivos ou média <10MB
10. ✅ **Contagem de instantâneos:** Expira se >100 instantâneos

## Habilitar registro de depuração```python

import logging
logging.basicConfig(level=logging.DEBUG)

# Now operations show HTTP requests/responses

```

## Resources

- [Cloudflare Community](https://community.cloudflare.com/c/developers/workers/40)
- [Cloudflare Discord](https://discord.cloudflare.com) - #r2 channel
- [PyIceberg GitHub](https://github.com/apache/iceberg-python/issues)
- [Apache Iceberg Slack](https://iceberg.apache.org/community/)

## Next Steps

- [patterns.md](patterns.md) - Working examples
- [api.md](api.md) - API reference
```
