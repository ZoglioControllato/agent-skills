# DO Storage Gotchas & Troubleshooting

## Concurrency Model (CRITICAL)

Durable Objects use **input/output gates** to prevent race conditions:

### Input Gates

Block new requests during storage reads from CURRENT request:

```typescript
// SAFE: Input gate active during await
async increment() {
  const val = await this.ctx.storage.get("counter"); // Input gate blocks other requests
  await this.ctx.storage.put("counter", val + 1);
  return val;
}
```

### Output Gates

Hold response until ALL writes from current request confirm:

```typescript
// SAFE: Output gate waits for put() to confirm before returning response
async increment() {
  const val = await this.ctx.storage.get("counter");
  this.ctx.storage.put("counter", val + 1); // No await
  return new Response(String(val)); // Response delayed until write confirms
}
```

### Write Coalescing

Multiple writes to same key = atomic (last write wins):

```typescript
// SAFE: All three writes coalesce atomically
this.ctx.storage.put('key', 1)
this.ctx.storage.put('key', 2)
this.ctx.storage.put('key', 3) // Final value: 3
```

### Breaking Gates (DANGER)

**fetch() breaks input/output gates** → allows request interleaving:

```typescript
// UNSAFE: fetch() allows another request to interleave
async unsafe() {
  const val = await this.ctx.storage.get("counter");
  await fetch("https://api.example.com"); // Gate broken!
  await this.ctx.storage.put("counter", val + 1); // Race condition possible
}
```

**Solution:** Use `blockConcurrencyWhile()` or `transaction()`:

```typescript
// SAFE: Block concurrent requests explicitly
async safe() {
  return await this.ctx.blockConcurrencyWhile(async () => {
    const val = await this.ctx.storage.get("counter");
    await fetch("https://api.example.com");
    await this.ctx.storage.put("counter", val + 1);
    return val;
  });
}
```

### opção permitirConcurrency

Desative o portão de entrada para leituras que não precisam de proteção:```typescript
// Allow concurrent reads (no consistency guarantee)
const val = await this.ctx.storage.get('metrics', { allowConcurrency: true })

````
## Erros Comuns

### "Condição de corrida em chamadas simultâneas"

**Causa:** Várias operações de armazenamento simultâneas iniciadas a partir do mesmo evento (por exemplo, `Promise.all()`) não são protegidas pela porta de entrada
**Solução:** evite operações de armazenamento simultâneas em um único evento; O portão de entrada serializa apenas solicitações de eventos diferentes, não operações dentro do mesmo evento

### "Instruções de transação SQL direta"

**Causa:** Usando `BEGIN TRANSACTION` diretamente em vez de métodos de transação
**Solução:** Use `this.ctx.storage.transactionSync()` para operações de sincronização ou `this.ctx.storage.transaction()` para operações assíncronas

### "Assíncrono em transactionSync"

**Causa:** Usando operações assíncronas dentro do retorno de chamada `transactionSync()`
**Solução:** Use o método assíncrono `transaction()` em vez de `transactionSync()` quando operações assíncronas forem necessárias

### "Incompatibilidade de tipo TypeScript em tempo de execução"

**Causa:** A consulta não retorna todos os campos especificados no tipo TypeScript
**Solução:** certifique-se de que a consulta SQL selecione todas as colunas que correspondem à definição de tipo TypeScript

### "Corrupção silenciosa de dados com IDs grandes"

**Causa:** os números JavaScript têm precisão de 53 bits; SQLite INTEGER é de 64 bits
**Sintoma:** IDs > 9007199254740991 (Number.MAX_SAFE_INTEGER) truncados/corrompidos silenciosamente
**Solução:** Armazene IDs grandes como TEXTO:```typescript
// BAD: Snowflake/Twitter IDs will corrupt
this.sql.exec('CREATE TABLE events(id INTEGER PRIMARY KEY)')
this.sql.exec('INSERT INTO events VALUES (?)', 1234567890123456789n) // Corrupts!

// GOOD: Store as TEXT
this.sql.exec('CREATE TABLE events(id TEXT PRIMARY KEY)')
this.sql.exec('INSERT INTO events VALUES (?)', '1234567890123456789')
````

### "Alarme não excluído com deleteAll()"

**Causa:** `deleteAll()` não exclui alarmes automaticamente
**Solução:** Chame `deleteAlarm()` explicitamente antes de `deleteAll()` para remover o alarme

### "Desempenho Lento"

**Causa:** Uso da API KV assíncrona em vez da API de sincronização
**Solução:** use a API KV de sincronização (`ctx.storage.kv`) para obter melhor desempenho com operações simples de valor-chave

### "Alto faturamento das operações de armazenamento"

**Causa:** `rowsRead`/`rowsWritten` excessivos ou objetos não utilizados não limpos
**Solução:** Monitore as métricas `rowsRead`/`rowsWritten` e garanta que objetos não utilizados chamem `deleteAll()`

### "Objeto durável sobrecarregado"

**Causa:** DO único excedendo o limite flexível de aproximadamente 1K req/s
**Solução:** Fragmentação em vários DOs com IDs aleatórios ou outra estratégia de distribuição

## Limites

| Limite                                | Valor               | Notas                            |
| ------------------------------------- | ------------------- | -------------------------------- |
| Máximo de colunas por tabela          | 100                 | Limitação SQL                    |
| Máximo de string/BLOB por linha       | 2 MB                | Limitação SQL                    |
| Tamanho máximo da linha               | 2 MB                | Limitação SQL                    |
| Tamanho máximo da instrução SQL       | 100 KB              | Limitação SQL                    |
| Parâmetros SQL máximos                | 100                 | Limitação SQL                    |
| Padrão máximo LIKE/GLOB               | 50 B                | Limitação SQL                    |
| Armazenamento SQLite por objeto       | 10 GB               | Armazenamento apoiado por SQLite |
| Tamanho da chave + valor do SQLite    | 2 MB                | Armazenamento apoiado por SQLite |
| Armazenamento de KV por objeto        | Ilimitado           | Armazenamento estilo KV          |
| Tamanho da chave KV                   | 2 KiB               | Armazenamento estilo KV          |
| Tamanho do valor KV                   | 128 KiB             | Armazenamento estilo KV          |
| Taxa de transferência de solicitações | ~1K necessidade/seg | Limite flexível por DO           |
