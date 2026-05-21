# Armadilhas e boas práticas

## Erros comuns

### "setState() não sincroniza"

**Causa:** mutar estado diretamente ou não chamar `setState()` após alterações  
**Solução:** use sempre `setState()` com atualizações imutáveis:

```ts
// ❌ this.state.count++
// ✅ this.setState({...this.state, count: this.state.count + 1})
```

### "Histórico de mensagens cresce sem limite (AIChatAgent)"

**Causa:** `this.messages` no `AIChatAgent` acumula todas as mensagens indefinidamente  
**Solução:** aparar mensagens antigas manualmente com periodicidade:

```ts
export class ChatAgent extends AIChatAgent<Env> {
  async onChatMessage(onFinish) {
    // Manter só as últimas 50 mensagens
    if (this.messages.length > 50) {
      this.messages = this.messages.slice(-50)
    }

    return this.streamText({ model: openai('gpt-4'), messages: this.messages, onFinish })
  }
}
```

### "Vulnerabilidade a SQL injection"

**Causa:** interpolação direta de strings em consultas SQL  
**Solução:** use consultas parametrizadas:

```ts
// ❌ this.sql`...WHERE id = '${userId}'`
// ✅ this.sql`...WHERE id = ${userId}`
```

### "Timeout de conexão WebSocket"

**Causa:** não chamar `conn.accept()` em `onConnect`  
**Solução:** aceite sempre as conexões:

```ts
async onConnect(conn: Connection, ctx: ConnectionContext) { conn.accept(); conn.setState({userId: "123"}); }
```

### "Limite de agendamentos excedido"

**Causa:** mais de 1000 tarefas agendadas por agente  
**Solução:** limpe agendamentos antigos e limite a taxa de criação:

```ts
async checkSchedules() { if ((await this.getSchedules()).length > 800) console.warn("Near limit!"); }
```

### "AI Gateway indisponível"

**Causa:** timeout do serviço de IA ou cota excedida  
**Solução:** trate erros e use fallbacks:

```ts
try {
  return await this.env.AI.run(model, { prompt })
} catch (e) {
  console.error('AI error:', e)
  return { error: 'Unavailable' }
}
```

### "Método @callable retorna undefined"

**Causa:** o método não retorna valor serializável em JSON, ou usa tipos não serializáveis  
**Solução:** garanta retornos como objetos/array/primitivos simples:

```ts
// ❌ Retorna instância de classe
@callable()
async getData() { return new Date(); }

// ✅ Retorna objeto serializável
@callable()
async getData() { return { timestamp: Date.now() }; }
```

### "Stream retomável não retoma"

**Causa:** o ID do stream precisa ser determinístico para a retomada funcionar  
**Solução:** use `AIChatAgent` (automático) ou garanta IDs de stream consistentes:

```ts
// AIChatAgent cuida disso automaticamente
export class ChatAgent extends AIChatAgent<Env> {
  // Retomada funciona out of the box
}
```

### "Perda de conexão MCP na hibernação"

**Causa:** conexões com servidor MCP não sobrevivem à hibernação  
**Solução:** re-registre servidores em `onStart()` ou verifique o status da conexão:

```ts
onStart() {
  // Re-registrar servidores MCP após hibernação
  await this.mcp.registerServer("github", { url: env.MCP_URL, auth: {...} });
}
```

### "Agent not found"

**Causa:** binding de Durable Object ausente ou nome de classe incorreto  
**Solução:** confira o binding no wrangler.jsonc e se o nome da classe bate

## Limites e cotas

| Recurso/limite           | Valor                     | Notas                                              |
| ------------------------ | ------------------------- | -------------------------------------------------- |
| CPU por requisição       | 30s (padrão), 300s (máx.) | Definido em wrangler.jsonc                         |
| Memória por instância    | 128MB                     | Compartilhada com WebSockets                       |
| Armazenamento por agente | 10GB                      | Armazenamento SQLite                               |
| Tarefas agendadas        | 1000 por agente           | Monitore com `getSchedules()`                      |
| Conexões WebSocket       | Ilimitado                 | Dentro dos limites de memória                      |
| Colunas SQL              | 100                       | Por tabela                                         |
| Tamanho de linha SQL     | 2MB                       | Chave + valor                                      |
| Mensagem WebSocket       | 32MiB                     | Tamanho máximo                                     |
| Requisições DO/s         | ~1000                     | Por instância DO única; faça rate limit se preciso |
| AI Gateway (Workers AI)  | Por modelo                | Veja limites no dashboard                          |
| Requisições MCP          | Depende do servidor       | Implemente retry/backoff                           |

## Boas práticas

### Gerenciamento de estado

- Use atualizações imutáveis: `setState({...this.state, key: newValue})`
- Aparar arrays sem limite (mensagens, logs) periodicamente
- Guarde dados grandes em SQL, não no state

### Uso de SQL

- Crie tabelas em `onStart()`, não em `onRequest()`
- Use consultas parametrizadas: `` sql`WHERE id = ${id}` `` (NÃO `` sql`WHERE id = '${id}'` ``)
- Indexe colunas muito consultadas

### Agendamento

- Monitore a contagem: `await this.getSchedules()`
- Cancele tarefas concluídas para ficar abaixo de 1000
- Use strings cron para tarefas recorrentes

### WebSockets

- Sempre chame `conn.accept()` em `onConnect()`
- Trate desconexões do cliente com cuidado
- Faça broadcast para `this.connections` de forma eficiente

### Integração com IA

- Use `AIChatAgent` para interfaces de chat (stream e retomada automáticos)
- Aparar histórico para evitar estourar limites de tokens
- Trate erros de IA com try/catch e fallbacks

### Deploy em produção

- **Rate limiting:** implemente throttling para agentes de alto tráfego (>1000 req/s)
- **Monitoramento:** registre erros críticos, acompanhe contagem de agendamentos e uso de armazenamento
- **Degradação elegante:** trate indisponibilidade do serviço de IA com fallbacks
- **Aparo de mensagens:** imponha tamanho máximo do histórico (ex.: 100 mensagens) no AIChatAgent
- **Confiabilidade MCP:** re-registre servidores após hibernação e implemente retry
