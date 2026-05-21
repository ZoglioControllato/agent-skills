# Objetos duráveis Cloudflare

Orientação especializada para criar aplicações com estado com objetos duráveis da Cloudflare.

## Ordem de leitura

1. **Primeira vez?** Leia esta visão geral + Início rápido
2. **Configurando?** Consulte [Configuração](./configuration.md)
3. **Criando recursos?** Use as árvores de decisão abaixo → [Padrões](./patterns.md)
4. **Problemas de depuração?** Verifique [Pegadas](./gotchas.md)
5. **Aprofundamento?** [API](./api.md) e [DO Storage](../do-storage/README.md)

## Visão geral

Objetos Duráveis combinam computação com armazenamento em pacotes globalmente exclusivos e fortemente consistentes:

- **Instâncias globalmente exclusivas**: cada DO possui um ID exclusivo para coordenação multicliente
- **Armazenamento colocalizado**: armazenamento rápido e altamente consistente com computação
- **Colocação automática**: Objetos aparecem perto do local da primeira solicitação
- **Sem servidor com estado**: estado na memória + armazenamento persistente
- **Single-threaded**: processamento de solicitação serial (sem condições de corrida)

## Regras de objetos duráveis

Regras críticas que evitam a maioria dos problemas de produção:

1. **Um alarme por DO** - Programe vários eventos via padrão de fila
2. **~1K req/s por DO max** - Fragmento para maior rendimento
3. **O construtor é executado a cada wake** - Mantenha a inicialização leve; usar carregamento lento
4. **A hibernação limpa a memória** - Estado da memória perdido; persistir dados críticos
5. **Use `ctx.waitUntil()` para limpeza** - Garante a conclusão após o envio da resposta
6. **Sem setTimeout para persistência** - Use `setAlarm()` para agendamento confiável

## Conceitos Básicos

### Estrutura de Classe

Todos os DOs estendem a classe base `DurableObject` com o construtor recebendo `DurableObjectState` (armazenamento, WebSockets, alarmes) e `Env` (ligações).

### Estados do ciclo de vida```

[Not Created] → [Active] ⇄ [Hibernated] → [Evicted]
↓
[Destroyed]

```
- **Não criado**: DO ID existe, mas a instância nunca foi gerada
- **Ativo**: Processamento de solicitações, estado válido na memória, faturado por GB-hora
- **Hibernado**: conexões WebSocket abertas, mas zero computação, custo zero
- **Despejado**: Removido da memória; próxima solicitação aciona inicialização a frio
- **Destruído**: dados excluídos por migração ou exclusão manual

### Acessando de Trabalhadores

Os trabalhadores usam ligações para obter stubs e, em seguida, chamam métodos RPC diretamente (recomendado) ou usam o manipulador de busca (legado).

**Decisão RPC vs fetch():**

```

├─ New project + compat ≥2024-04-03 → RPC (type-safe, simpler)
├─ Need HTTP semantics (headers, status) → fetch()
├─ Proxying requests to DO → fetch()
└─ Legacy compatibility → fetch()

```
Consulte [Padrões: RPC vs fetch()](./patterns.md) para obter exemplos.

### Geração de ID

- `idFromName()`: Coordenação determinística nomeada (limitação de taxa, bloqueios)
- `newUniqueId()`: IDs aleatórios para fragmentação de cargas de trabalho de alto rendimento
- `idFromString()`: deriva de IDs existentes
- Opção de jurisdição: conformidade com a localidade dos dados

### Opções de armazenamento

**Qual API de armazenamento?**

```

├─ Structured data, relations, transactions → SQLite (recommended)
├─ Simple KV on SQLite DO → ctx.storage.kv (sync KV)
└─ Legacy KV-only DO → ctx.storage (async KV)

````
- **SQLite** (recomendado): dados estruturados, transações, 10 GB/DO
- **API KV síncrona**: valor-chave simples em objetos SQLite
- **API KV assíncrona**: casos de uso legado/avançado

Consulte [DO Storage](../do-storage/README.md) para se aprofundar.

### Recursos especiais

- **Alarmes**: Agende execução futura por DO (1 por DO - use padrão de fila para vários)
- **Hibernação WebSocket**: conexões ociosas com custo zero (memória limpa na hibernação)
- **Recuperação pontual**: Restaure para qualquer ponto em 30 dias (somente SQLite)

## Início rápido```typescript
import { DurableObject } from 'cloudflare:workers'

export class Counter extends DurableObject<Env> {
  async increment(): Promise<number> {
    const result = this.ctx.storage.sql
      .exec(
        `INSERT INTO counters (id, value) VALUES (1, 1)
       ON CONFLICT(id) DO UPDATE SET value = value + 1
       RETURNING value`,
      )
      .one()
    return result.value
  }
}

// Worker access
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const id = env.COUNTER.idFromName('global')
    const stub = env.COUNTER.get(id)
    const count = await stub.increment()
    return new Response(`Count: ${count}`)
  },
}
````

## Árvores de decisão

### O que você precisa?```

├─ Coordinate requests (rate limit, lock, session)
│ → idFromName(identifier) → [Patterns: Rate Limiting/Locks](./patterns.md)
│
├─ High throughput (>1K req/s)
│ → Sharding with newUniqueId() or hash → [Patterns: Sharding](./patterns.md)
│
├─ Real-time updates (WebSocket, chat, collab)
│ → WebSocket hibernation + room pattern → [Patterns: Real-time](./patterns.md)
│
├─ Background work (cleanup, notifications, scheduled tasks)
│ → Alarms + queue pattern (1 alarm/DO) → [Patterns: Multiple Events](./patterns.md)
│
└─ User sessions with expiration
→ Session pattern + alarm cleanup → [Patterns: Session Management](./patterns.md)

```

### Which access pattern?

```

├─ New project + typed methods → RPC (compat ≥2024-04-03)
├─ Need HTTP semantics → fetch()
├─ Proxying to DO → fetch()
└─ Legacy compat → fetch()

```

See [Patterns: RPC vs fetch()](./patterns.md) for examples.

### Which storage?

```

├─ Structured data, SQL queries, transactions → SQLite (recommended)
├─ Simple KV on SQLite DO → ctx.storage.kv (sync API)
└─ Legacy KV-only DO → ctx.storage (async API)

````

See [DO Storage](../do-storage/README.md) for complete guide.

## Essential Commands

```bash
npx wrangler dev              # Local dev with DOs
npx wrangler dev --remote     # Test against prod DOs
npx wrangler deploy           # Deploy + auto-apply migrations
````

## Resources

**Docs**: https://developers.cloudflare.com/durable-objects/  
**API Reference**: https://developers.cloudflare.com/durable-objects/api/  
**Examples**: https://developers.cloudflare.com/durable-objects/examples/

## In This Reference

- **[Configuration](./configuration.md)** - wrangler.jsonc setup, migrations, bindings, environments
- **[API](./api.md)** - Class structure, ctx methods, alarms, WebSocket hibernation
- **[Patterns](./patterns.md)** - Sharding, rate limiting, locks, real-time, sessions
- **[Gotchas](./gotchas.md)** - Limits, hibernation caveats, common errors

## See Also

- **[DO Storage](../do-storage/README.md)** - SQLite, KV, transactions (detailed storage guide)
- **[Workers](../workers/README.md)** - Core Workers runtime features
- **[WebSockets](../websockets/README.md)** - WebSocket APIs and patterns
