# Referência de habilidade SQL Cloudflare R2

Orientação especializada para Cloudflare R2 SQL – mecanismo de consulta distribuída sem servidor para tabelas Apache Iceberg.

## Ordem de leitura

**Novo no R2 SQL?** Comece aqui:

1. Leia "O que é R2 SQL?" e "Quando usar" abaixo
2. [configuration.md](configuration.md) - Habilitar catálogo, criar tokens
3. [patterns.md](patterns.md) - Wrangler CLI e exemplos de integração
4. [api.md](api.md) - Sintaxe SQL e referência de consulta
5. [gotchas.md](gotchas.md) - Limitações e solução de problemas

**Referência rápida?** Vá para:

- [Execute uma consulta via Wrangler](patterns.md#wrangler-cli-query)
- [referência de sintaxe SQL](api.md#sql-syntax)
- [limitações ORDER BY](gotchas.md#order-by-limitations)

## O que é SQL R2?

R2 SQL é o **mecanismo de consulta analítica distribuída sem servidor** da Cloudflare para consultar tabelas do Apache Iceberg no R2 Data Catalog. Recursos:

- **Sem servidor** - Sem clusters para gerenciar, sem infraestrutura
- **Distribuído** - Aproveita a rede global da Cloudflare para execução paralela
- **Interface SQL** - Sintaxe SQL familiar para consultas analíticas
- **Zero taxas de saída** - Consulta de qualquer nuvem/região sem custos de transferência de dados
- **Beta aberto** - Gratuito durante a versão beta (aplicam-se custos de armazenamento padrão R2)

### O que é Apache Iceberg?

Formato de tabela aberta para conjuntos de dados analíticos em grande escala no armazenamento de objetos:

- **Transações ACID** - Leituras/gravações simultâneas seguras
- **Otimização de metadados** - Consultas rápidas sem verificações completas da tabela
- **Evolução do esquema** - Adicionar/renomear/eliminar colunas sem reescrever
- **Particionamento** - Organize os dados para uma remoção eficiente

## Quando usar

**Use SQL R2 para:**

- **Análise de log** - Consulta logs de aplicativos/sistema com filtros e agregações WHERE
- **Painéis de BI** - Gere relatórios a partir de grandes conjuntos de dados analíticos
- **Detecção de fraude** - Analise padrões de transação com GROUP BY/HAVING
- **Análise multinuvem** - Consulte dados de qualquer nuvem sem taxas de saída
- **Exploração ad-hoc** - Execute consultas SQL em tabelas Iceberg via Wrangler CLI

**Não use R2 SQL para:**

- **Tempo de execução de Workers/Páginas** - R2 SQL não tem vinculação de Workers, use API HTTP de sistemas externos
- **Consultas em tempo real (<100ms)** - Otimizado para consultas analíticas em lote, não OLTP
- **Junções complexas/CTEs** - Conjunto de recursos SQL limitado (sem JOINs, subconsultas, CTEs atualmente)
- **Conjuntos de dados pequenos (<1 GB)** - Sobrecarga de configuração não justificada

## Árvore de decisão: precisa consultar dados R2?```

Você precisa consultar dados estruturados em R2?
├─ SIM, os dados estão em tabelas Iceberg
│ ├─ Precisa de interface SQL? → Use R2 SQL (esta referência)
│ ├─ Precisa da API Python? → Consulte a referência do catálogo de dados r2 (PyIceberg)
│ └─ Precisa de outro motor? → Consulte a referência do catálogo de dados r2 (Spark, Trino, etc.)
│
├─ SIM, mas não no formato Iceberg
│ ├─ Transmitindo dados? → Use Pipelines para gravar no Data Catalog e depois no R2 SQL
│ └─ Arquivos estáticos? → Use PyIceberg para criar tabelas Iceberg e, em seguida, R2 SQL
│
└─ NÃO, só precisa de armazenamento de objetos → Use referência R2 (não R2 SQL)

````
## Visão geral da arquitetura

**Planejador de consultas:**

- Investigação de metadados de cima para baixo com remoção multicamadas
- Poda em nível de partição, nível de coluna e grupo de linhas
- Pipeline de streaming - a execução começa antes da conclusão do planejamento
- Rescisão antecipada com LIMIT - para quando o resultado é concluído

**Execução de consulta:**

- O coordenador distribui o trabalho aos trabalhadores em toda a rede Cloudflare
- Os trabalhadores executam o Apache DataFusion para execução paralela de consultas
- Poda de coluna Parquet - lê apenas colunas obrigatórias
- Leituras à distância de R2 para eficiência

**Estratégias de agregação:**

- Scatter-gather - agregações simples (SUM, COUNT, AVG)
- Embaralhamento - ORDER BY/HAVING em agregados via particionamento de hash

## Início rápido```bash
# 1. Enable R2 Data Catalog on bucket
npx wrangler r2 bucket catalog enable my-bucket

# 2. Create API token (Admin Read & Write)
# Dashboard: R2 → Manage API tokens → Create API token

# 3. Set environment variable
export WRANGLER_R2_SQL_AUTH_TOKEN=<your-token>

# 4. Run query
npx wrangler r2 sql query "my-bucket" "SELECT * FROM default.my_table LIMIT 10"
````

## Limitações importantes

**CRÍTICO: Nenhuma vinculação de trabalhadores**

- R2 SQL não pode ser chamado diretamente do código Workers/Pages
- Para acesso programático, use API HTTP de sistemas externos
- Ou consulte via PyIceberg, Spark, etc. (consulte a referência do catálogo de dados r2)

**Conjunto de recursos SQL:**

- Sem JOINs, CTEs, subconsultas, funções de janela
- ORDER BY suporta colunas de agregação (não apenas chaves de partição)
- LIMITE máximo de 10.000 (padrão 500)
- Consulte [gotchas.md](gotchas.md) para limitações completas

## Nesta referência

- **[configuration.md](configuration.md)** - Habilitar catálogo, criar tokens de API
- **[api.md](api.md)** - Sintaxe SQL, funções, operadores, tipos de dados
- **[patterns.md](patterns.md)** - Wrangler CLI, API HTTP, Pipelines, PyIceberg
- **[gotchas.md](gotchas.md)** - Limitações, solução de problemas, dicas de desempenho

## Veja também

- [r2-data-catalog](../r2-data-catalog/) - PyIceberg, API REST, mecanismos externos
- [pipelines](../pipelines/) - Ingestão de streaming para tabelas Iceberg
- [r2](../r2/) - Fundamentos do armazenamento de objetos R2
- [Documentos SQL do Cloudflare R2](https://developers.cloudflare.com/r2-sql/)
- [Blog de aprofundamento do R2 SQL](https://blog.cloudflare.com/r2-sql-deep-dive/)
