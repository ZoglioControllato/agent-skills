# Dicas de objetos duráveis

## Erros Comuns

### "A hibernação limpou meu estado na memória"

**Problema:** Variáveis perdidas após a hibernação
**Causa:** DO hiberna automaticamente quando ocioso; estado na memória não persistiu
**Solução:** Use `ctx.storage` para dados críticos, `ws.serializeAttachment()` para metadados por conexão```typescript
// ❌ Wrong - lost on hibernation
private userCount = 0;
async webSocketMessage(ws: WebSocket, msg: string) {
this.userCount++; // Lost!
}

// ✅ Right - persisted
async webSocketMessage(ws: WebSocket, msg: string) {
const count = this.ctx.storage.kv.get("userCount") || 0;
this.ctx.storage.kv.put("userCount", count + 1);
}

````

### "setTimeout Didn't Fire After Restart"

**Problem:** Scheduled work lost on eviction
**Cause:** `setTimeout` in-memory only; eviction clears timers
**Solution:** Use `ctx.storage.setAlarm()` for reliable scheduling

```typescript
// ❌ Wrong - lost on eviction
setTimeout(() => this.cleanup(), 3600000);

// ✅ Right - survives eviction
await this.ctx.storage.setAlarm(Date.now() + 3600000);
async alarm() { await this.cleanup(); }
````

### "Construtor é executado a cada vigília"

**Problema:** Lógica de inicialização cara retarda todas as solicitações
**Causa:** O construtor é executado a cada ativação (primeira solicitação após a remoção OU após a hibernação)
**Solução:** inicialização lenta ou cache no armazenamento

**Compreensão crítica:** O construtor é executado em dois cenários:

1. **Início a frio** - DO removido da memória, a primeira solicitação cria uma nova instância
2. **Despertar da hibernação** - FAÇA com WebSockets hibernados, mensagem/alarme o desperta```typescript
   // ❌ Wrong - expensive on every wake
   constructor(ctx: DurableObjectState, env: Env) {
   super(ctx, env);
   this.heavyData = this.loadExpensiveData(); // Slow!
   }

// ✅ Right - lazy load
private heavyData?: HeavyData;
private getHeavyData() {
if (!this.heavyData) this.heavyData = this.loadExpensiveData();
return this.heavyData;
}

````
### "Objeto durável sobrecarregado (erros 503)"

**Problema:** erros 503 sob carga
**Causa:** DO único excedendo o limite de taxa de transferência de aproximadamente 1K req/s
**Solução:** Fragmentação em vários DOs (consulte [Padrões: Fragmentação](./patterns.md))

### "Cota de armazenamento excedida (falhas de gravação)"

**Problema:** Falha nas operações de gravação
**Causa:** O armazenamento excede o limite de 10 GB ou a cota da conta
**Solução:** Limpeza com alarmes, use `deleteAll()` para dados antigos, atualize o plano

### "Tempo de CPU excedido (encerrado)"

**Problema:** Solicitação encerrada no meio da execução
**Causa:** Processamento excedendo o limite padrão de tempo de CPU de 30 segundos
**Solução:** Aumente `limits.cpu_ms` em wrangler.jsonc (máximo de 300s) ou trabalho em pedaços

### "WebSockets desconectados no despejo"

**Problema:** As conexões caem inesperadamente
**Causa:** DO removido da memória sem API de hibernação
**Solução:** use manipuladores de hibernação WebSocket + lógica de reconexão do cliente

### "Falha na migração (erro de implantação)"

**Causa:** Tags não exclusivas, tags não sequenciais ou nomes de classes inválidos na migração
**Solução:** verifique a exclusividade/ordenação sequencial da tag e verifique se os nomes das classes estão corretos

### "Método RPC não encontrado"

**Causa:** compatibilidade_data < 2024-04-03 impedindo o uso de RPC
**Solução:** Atualize a compatibilidade_date para >= 2024-04-03 ou use fetch() em vez de RPC

### "Apenas um alarme permitido"

**Causa:** São necessárias várias tarefas agendadas, mas apenas um alarme é suportado por DO
**Solução:** use o padrão de fila de eventos para agendar diversas tarefas com um único alarme

### "Condição de corrida apesar de thread único"

**Problema:** Solicitações simultâneas apresentam estado inconsistente
**Causa:** operações assíncronas permitem intercalação de solicitações (aguardar = ponto de rendimento)
**Solução:** Use `blockConcurrencyWhile()` para seções críticas ou operações de armazenamento atômico```typescript
// ❌ Wrong - race condition
async incrementCounter() {
  const count = await this.ctx.storage.get("count") || 0;
  // ⚠️ Another request could execute here during await
  await this.ctx.storage.put("count", count + 1);
}

// ✅ Right - atomic operation
async incrementCounter() {
  return this.ctx.storage.sql.exec(
    "INSERT INTO counters (id, value) VALUES (1, 1) ON CONFLICT(id) DO UPDATE SET value = value + 1 RETURNING value"
  ).one().value;
}

// ✅ Right - explicit locking
async criticalOperation() {
  await this.ctx.blockConcurrencyWhile(async () => {
    const count = await this.ctx.storage.get("count") || 0;
    await this.ctx.storage.put("count", count + 1);
  });
}
````

### "Reversão de migração não suportada"

**Causa:** Tentativa de reverter uma migração após a implantação
**Solução:** Teste com `--dry-run` antes de implantar; as migrações não podem ser revertidas

### "deleted_classes destrói dados"

**Problema:** a migração excluiu todos os dados
**Causa:** a migração `deleted_classes` destrói imediatamente todas as instâncias e dados DO
**Solução:** Teste com `--dry-run`; use `transferred_classes` para preservar os dados durante as movimentações

### "As partidas a frio são lentas"

**Problema:** A primeira solicitação após o despejo demora mais
**Causa:** Construtor DO + acesso inicial ao armazenamento na inicialização a frio
**Solução:** Comportamento esperado; otimizar construtor, usar pool de conexões em clientes, considerar estratégia de aquecimento para DOs críticos```typescript
// Warming strategy (periodically ping critical DOs)
export default {
async scheduled(event: ScheduledEvent, env: Env) {
const criticalIds = ['auth', 'sessions', 'locks']
await Promise.all(
criticalIds.map((name) => {
const id = env.MY_DO.idFromName(name)
const stub = env.MY_DO.get(id)
return stub.ping() // Keep warm
}),
)
},
}

```
## Limites

| Limite | Grátis | Pago | Notas |
| ---------------------- | --------- | --------- | ------------------------------------- |
| Armazenamento SQLite por DO | 10 GB | 10 GB | Por instância de objeto durável |
| Armazenamento total SQLite | 5 GB | Ilimitado | Cota para toda a conta |
| Tamanho chave+valor | 2 MB | 2 MB | Par KV único (SQLite/assíncrono) |
| Padrão de tempo de CPU | 30 anos | 30 anos | Por solicitação; configurável |
| Tempo máximo de CPU | 300 | 300 | Definido via `limits.cpu_ms` |
| Aulas DO | 100 | 500 | Definições distintas da classe DO |
| Colunas SQL | 100 | 100 | Por mesa |
| Tamanho da instrução SQL | 100 KB | 100 KB | Tamanho máximo da consulta SQL |
| Tamanho da mensagem WebSocket | 32 MiB | 32 MiB | Por mensagem |
| Taxa de transferência de solicitações | ~1 mil necessidades/s | ~1 mil necessidades/s | Por DO (limite flexível - fragmento para mais) |
| Alarmes por DO | 1 | 1 | Use padrão de fila para vários eventos |
| Total de DO | Ilimitado | Ilimitado | Crie quantas instâncias forem necessárias |
| WebSockets | Ilimitado | Ilimitado | Dentro do limite de memória de 128 MB por DO |
| Memória por DO | 128 MB | 128 MB | Estado na memória + buffers WebSocket |

## Advertências sobre hibernação

1. **Memória limpa** - Todas as variáveis na memória foram perdidas; reconstruir do armazenamento ou `deserializeAttachment()`
2. **Reexecuções do construtor** - Executa na esteira; evite operações caras, use inicialização lenta
3. **Sem garantias** - DO pode despejar em vez de hibernar; projeto para ambos
4. **Limite de anexos** - os dados `serializeAttachment()` devem ser serializáveis em JSON, mantenha-os pequenos
5. **Alarme desperta DO** - O alarme evita a hibernação até que o manipulador seja concluído
6. **Estado WebSocket não automático** - Deve persistir explicitamente com `serializeAttachment()` ou armazenamento

## Veja também

- **[Padrões](./patterns.md)** - Soluções alternativas para limitações comuns
- **[API](./api.md)** - Limites e cotas de armazenamento
- **[Configuração](./configuration.md)** - Configurando limites de CPU
```
