# Pipelines Cloudflare

Plataforma de streaming ETL para ingestão, transformação e carregamento de dados em R2 com transformações SQL.

## Visão geral

Pipelines fornece:

- **Streams**: buffers de eventos duráveis (ingestão de HTTP/Workers)
- **Pipelines**: transformações baseadas em SQL
- **Sinks**: destinos R2 (tabelas Iceberg ou arquivos Parquet/JSON)

**Status**: Beta aberto (plano Workers Paid)
**Preço**: sem cobrança além do armazenamento/operações R2 padrão

## Arquitetura```

Data Sources → Streams → Pipelines (SQL) → Sinks → R2
↑ ↓ ↓
HTTP/Workers Transform Iceberg/Parquet

````

| Component | Purpose            | Key Feature                            |
| --------- | ------------------ | -------------------------------------- |
| Streams   | Event ingestion    | Structured (validated) or unstructured |
| Pipelines | Transform with SQL | Immutable after creation               |
| Sinks     | Write to R2        | Exactly-once delivery                  |

## Quick Start

```bash
# Interactive setup (recommended)
npx wrangler pipelines setup
````

**Minimal Worker example:**

```typescript
interface Env {
  STREAM: Pipeline
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const event = { user_id: '123', event_type: 'purchase', amount: 29.99 }

    // Fire-and-forget pattern
    ctx.waitUntil(env.STREAM.send([event]))

    return new Response('OK')
  },
} satisfies ExportedHandler<Env>
```

## Which Sink Type?

```
Precisa de consultas SQL em dados?
→ Catálogo de dados R2 (Iceberg)
✅ Transações ACID, viagem no tempo, evolução de esquema
❌ Mais complexidade de configuração (namespace, tabela, token de catálogo)

Apenas armazenamento/arquivamento de arquivos?
→ Armazenamento R2 (Parquet)
✅ Acesso simples e direto aos arquivos
❌ Sem consultas SQL integradas

Usando ferramentas externas (Spark/Athena)?
→ Armazenamento R2 (Parquet com particionamento)
✅ Formato padrão, remoção de partição para desempenho
❌ Você mesmo deve gerenciar a compatibilidade do esquema
```

## Casos de uso comuns

- **Pipelines de análise**: fluxo de cliques, telemetria, registros do servidor
- **Armazenamento de dados**: ETL em tabelas Iceberg consultáveis
- **Processamento de eventos**: Mobile/IoT com enriquecimento
- **Análise de comércio eletrônico**: eventos de usuários, compras, visualizações

## Ordem de leitura

**Novo no Pipelines?** Comece aqui:

1. [configuration.md](./configuration.md) - Configurar streams, coletores, pipelines
2. [api.md](./api.md) - Enviar eventos, tipos TypeScript, funções SQL
3. [patterns.md](./patterns.md) - Melhores práticas, integrações, exemplo completo
4. [gotchas.md](./gotchas.md) - Avisos críticos, solução de problemas

**Roteamento baseado em tarefas:**

- Pipeline de configuração → [configuration.md](./configuration.md)
- Enviar/consultar dados → [api.md](./api.md)
- Implementar padrão → [patterns.md](./patterns.md)
- Problema de depuração → [gotchas.md](./gotchas.md)

## Nesta referência

- [configuration.md](./configuration.md) - ligações wrangler.jsonc, definição de esquema, opções de coletor, comandos CLI
- [api.md](./api.md) - Interface de vinculação de pipeline, método send(), ingestão HTTP, referência de função SQL
- [patterns.md](./patterns.md) - Disparar e esquecer, validação de esquema com Zod, integrações, ajuste de desempenho
- [gotchas.md](./gotchas.md) - Falhas de validação silenciosas, pipelines imutáveis, expectativas de latência, limites

## Veja também

- [r2](../r2/) - back-end de armazenamento R2 para coletores
- [queues](../queues/) - Compare com Filas para processamento assíncrono
- [workers](../workers/) - Tempo de execução do trabalhador para ingestão de eventos
