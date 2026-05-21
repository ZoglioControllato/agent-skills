# Referência de habilidades do catálogo de dados Cloudflare R2

Orientação especializada para catálogo de dados Cloudflare R2 – catálogo Apache Iceberg integrado em buckets R2.

## Ordem de leitura

**Novo no catálogo de dados R2?** Comece aqui:

1. Leia "O que é o Catálogo de Dados R2?" e "Quando usar" abaixo
2. [configuration.md](configuration.md) - Habilitar catálogo, criar tokens
3. [patterns.md](patterns.md) - Configuração do PyIceberg e padrões comuns
4. [api.md](api.md) - referência da API REST conforme necessário
5. [gotchas.md](gotchas.md) - Solução de problemas quando surgem problemas

**Referência rápida?** Vá para:

- [Ativar catálogo no bucket](configuration.md#enable-catalog-on-bucket)
- [Padrão de conexão PyIceberg](patterns.md#pyiceberg-connection-pattern)
- [Erros de permissão](gotchas.md#permission-errors)

## O que é o Catálogo de Dados R2?

O R2 Data Catalog é um **catálogo REST gerenciado do Apache Iceberg** integrado diretamente em buckets R2. Ele fornece:

- **Tabelas Apache Iceberg** - Transações ACID, evolução de esquema, consultas de viagem no tempo
- **Custos de saída zero** - Consulta de qualquer nuvem/região sem taxas de transferência de dados
- **API REST padrão** - Funciona com Spark, PyIceberg, Snowflake, Trino, DuckDB
- **Sem infraestrutura** - Totalmente gerenciado, sem servidores de catálogo para executar
- **Beta público** - Disponível para todos os assinantes R2, sem custo extra além do armazenamento R2

### O que é Apache Iceberg?

Formato de tabela aberto para conjuntos de dados analíticos no armazenamento de objetos. Recursos:

- **Transações ACID** - Leituras/gravações simultâneas seguras
- **Otimização de metadados** - Consultas rápidas sem verificações completas
- **Evolução do esquema** - Adicionar/renomear/excluir colunas sem reescrever
- **Viagem no tempo** - Consultar instantâneos históricos
- **Particionamento** - Organize dados para consultas eficientes

## Quando usar

**Use o catálogo de dados R2 para:**

- **Análise de log** - Armazene e consulte logs de aplicativos/sistema
- **Lagos/armazéns de dados** - Conjuntos de dados analíticos consultados por vários mecanismos
- **Pipelines de BI** - Agregar dados para painéis e relatórios
- **Análise multinuvem** - Compartilhe dados entre nuvens sem taxas de saída
- **Dados de série temporal** - Fluxos de eventos, métricas, dados de sensores

**Não use para:**

- **Cargas de trabalho transacionais** - Use D1 ou banco de dados externo
- **Latência inferior a um segundo** - Iceberg otimizado para consultas analíticas/em lote
- **Conjuntos de dados pequenos (<1 GB)** - A sobrecarga de configuração não vale a pena
- **Dados não estruturados** - Armazene arquivos diretamente no R2, não como tabelas Iceberg

## Arquitetura```

┌─────────────────────────────────────────────────┐
│ Query Engines │
│ (PyIceberg, Spark, Trino, Snowflake, DuckDB) │
└────────────────┬────────────────────────────────┘
│
│ REST API (OAuth2 token)
▼
┌─────────────────────────────────────────────────┐
│ R2 Data Catalog (Managed Iceberg REST Catalog)│
│ • Namespace/table metadata │
│ • Transaction coordination │
│ • Snapshot management │
└────────────────┬────────────────────────────────┘
│
│ Vended credentials
▼
┌─────────────────────────────────────────────────┐
│ R2 Bucket Storage │
│ • Parquet data files │
│ • Metadata files │
│ • Manifest files │
└─────────────────────────────────────────────────┘

````
**Conceitos principais:**

- **URI de catálogo** – endpoint REST para operações de catálogo (por exemplo, `https://<account-id>.r2.cloudflarestorage.com/iceberg/<bucket>`)
- **Warehouse** – Agrupamento lógico de tabelas (normalmente igual ao nome do bucket)
- **Namespace** - Esquema/banco de dados contendo tabelas (por exemplo, `logs`, `analytics`)
- **Tabela** - Tabela Iceberg com esquema, arquivos de dados, instantâneos
- **Credenciais vendidas** - O catálogo de credenciais temporárias do S3 fornece acesso a dados

## Limites

| Recurso | Limite | Notas |
| ---------------------- | ---------------------- | --------------------------------- |
| Namespaces por catálogo | Sem limite rígido | Organize tabelas logicamente |
| Tabelas por namespace | <10.000 recomendado | O desempenho degrada além disso |
| Arquivos por tabela | <100.000 recomendado | Execute a compactação regularmente |
| Instantâneos por mesa | Retenção configurável | Expira >7 dias |
| Partições por tabela | 100-1.000 ideal | Muitos = operações lentas de metadados |
| Tamanho da mesa | Igual ao balde R2 | 10GB-10TB+ comum |
| Limites de taxa API | Limites da API R2 padrão | Compartilhado com operações de armazenamento R2 |
| Tamanho do arquivo alvo | 128-512MB | Após compactação |

## Status atual

**Beta público** (em janeiro de 2026)

- Disponível para todos os assinantes R2
- Sem custo extra além do armazenamento/operações R2 padrão
- Pronto para produção, mas são possíveis alterações significativas
- Suporta: namespaces, tabelas, instantâneos, compactação, viagem no tempo, manutenção de tabelas

## Árvore de decisão: o catálogo de dados R2 é ideal para você?```
Iniciar → Precisa de análises de dados de armazenamento de objetos?
│
├─ Não → Use R2 diretamente para armazenamento de objetos
│
└─ Sim → Conjunto de dados >1GB com esquema estruturado?
│
├─ Não → Muito pequeno, use consultas R2 + ad-hoc
│
└─ Sim → Precisa de transações ACID ou evolução de esquema?
│
├─ Não → Considere soluções mais simples (Parquet em R2)
│
└─ Sim → Precisa de acesso multinuvem/multiferramentas?
│
├─ Não → D1 ou banco de dados externo pode ser mais simples
│
└─ Sim → ✅ Usar Catálogo de Dados R2
````

**Verificação rápida:** Se você responder "sim" a todos:

- Conjunto de dados> 1 GB e crescendo
- Dados estruturados/tabulares (logs, eventos, métricas)
- Múltiplas ferramentas de consulta ou ambientes em nuvem
- Precisa de controle de versão, alterações de esquema ou acesso simultâneo

→ O R2 Data Catalog é uma boa opção.

## Nesta referência

- **[configuration.md](configuration.md)** - Habilitar catálogo, criar tokens de API, conectar clientes
- **[api.md](api.md)** - Endpoints REST, operações, manutenção
- **[patterns.md](patterns.md)** - Exemplos de PyIceberg, casos de uso comuns
- **[gotchas.md](gotchas.md)** - Solução de problemas, práticas recomendadas, limitações

## Veja também

- [Documentos do catálogo de dados Cloudflare R2](https://developers.cloudflare.com/r2/data-catalog/)
- [Documentos do Apache Iceberg](https://iceberg.apache.org/)
- [Documentos PyIceberg](https://py.iceberg.apache.org/)
