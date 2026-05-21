## Critical Gotchas

### ⚠️ WebSocket: fetch() vs containerFetch()

**Problem:** WebSocket connections fail silently

**Cause:** `containerFetch()` doesn't support WebSocket upgrades

**Fix:** Always use `fetch()` for WebSocket

```typescript
// ❌ WRONG
return container.containerFetch(request)

// ✅ CORRECT
return container.fetch(request)
```

### ⚠️ startAndWaitForPorts() vs start()

**Problema:** "conexão recusada" após `start()`

**Causa:** `start()` retorna quando o processo é iniciado, NÃO quando as portas estão prontas

**Correção:** Use `startAndWaitForPorts()` antes das solicitações```typescript
// ❌ WRONG
await container.start()
return container.fetch(request)

// ✅ CORRECT
await container.startAndWaitForPorts()
return container.fetch(request)

````

### ⚠️ Activity Timeout on Long Operations

**Problem:** Container stops during long work

**Cause:** `sleepAfter` based on request activity, not internal work

**Fix:** Renew timeout by touching storage

```typescript
const interval = setInterval(() => {
  this.ctx.storage.put('keepalive', Date.now())
}, 60000)

try {
  await this.doLongWork(data)
} finally {
  clearInterval(interval)
}
````

### ⚠️ blockConcurrencyWhile para inicialização

**Problema:** Condições de corrida durante a inicialização

**Correção:** Use `blockConcurrencyWhile` para inicialização atômica```typescript
await this.ctx.blockConcurrencyWhile(async () => {
if (!this.initialized) {
await this.startAndWaitForPorts()
this.initialized = true
}
})

````
### ⚠️ Solicitações de bloqueio de ganchos de ciclo de vida

**Problema:** Container não responde durante `onStart()`

**Causa:** Hooks são executados em `blockConcurrencyWhile` - sem solicitações simultâneas

**Correção:** Mantenha os ganchos rápidos, evite operações longas

### ⚠️ Não substitua o alarme() ao usar agendamento()

**Problema:** tarefas agendadas não são executadas

**Causa:** `schedule()` usa `alarm()` internamente

**Correção:** Implemente `alarm()` para lidar com tarefas agendadas

## Erros Comuns

### "Tempo limite de início do contêiner"

**Causa:** O contêiner demorou >8s (`start()`) ou >20s (`startAndWaitForPorts()`)

**Soluções:**

- Otimizar imagem (base menor, menos camadas)
- Verifique o `ponto de entrada` correto
- Verifique se o aplicativo escuta nas portas corretas
- Aumente o tempo limite, se necessário

### "Porta não disponível"

**Causa:** Chamando `fetch()` antes da porta estar pronta

**Solução:** Use `startAndWaitForPorts()`

### "Memória do contêiner excedida"

**Causa:** uso de mais memória do que o tipo de instância permite

**Soluções:**

- Use um tipo de instância maior (padrão 2, padrão 3, padrão 4)
- Otimize o uso de memória do aplicativo
- Use tipo de instância personalizado```jsonc
"instance_type_custom": {
  "vcpu": 2,
  "memory_mib": 8192
}
````

### "Máximo de instâncias alcançado"

**Causa:** Todos os slots `max_instances` em uso

**Soluções:**

- Aumentar `max_instances`
- Implementar `sleepAfter` adequado
- Use `getRandom()` para distribuição
- Verifique se há vazamentos de instância

### "Nenhuma instância de contêiner disponível"

**Causa:** Limites de capacidade da conta atingidos

**Soluções:**

- Verifique os limites da conta
- Revise os tipos de instância em contêineres
- Entre em contato com o suporte da Cloudflare

## Limites

| Recurso                               | Limite     | Notas                          |
| ------------------------------------- | ---------- | ------------------------------ |
| Arranque a frio                       | 2-3s       | Imagem pré-buscada globalmente |
| Desligamento elegante                 | 15 minutos | SIGTERM → SIGKILL              |
| Tempo limite `start()`                | 8s         | Início do processo             |
| Tempo limite `startAndWaitForPorts()` | 20 anos    | Porto pronto                   |
| Máximo de vCPU por contêiner          | 4          | padrão-4 ou personalizado      |
| Memória máxima por contêiner          | 12 GB      | padrão-4 ou personalizado      |
| Máximo de disco por contêiner         | 20 GB      | Efêmero, reinicia              |
| Memória total da conta                | 400 GB     | Todos os contêineres           |
| Total de vCPU da conta                | 100        | Todos os contêineres           |
| Disco total da conta                  | 2 TB       | Todos os contêineres           |
| Armazenamento de imagens              | 50 GB      | Por conta                      |
| Persistência de disco                 | Nenhum     | Use armazenamento DO           |

## Melhores práticas

1. **Use `startAndWaitForPorts()` por padrão** - Evita erros de porta
2. **Defina `sleepAfter`** apropriado - Equilibre recursos versus partidas a frio
3. **Use `fetch()` para WebSocket** - Não `containerFetch()`
4. **Projeto para reinicializações** - Disco efêmero, implementar desligamento normal
5. **Monitore recursos** - Fique dentro dos limites da conta
6. **Mantenha os ganchos rápidos** - Execute em `blockConcurrencyWhile`
7. **Renovar atividades para operações longas** - Toque no armazenamento para evitar o tempo limite

## Advertências beta

⚠️ Contêineres em **beta**:

- **API pode mudar** sem aviso prévio
- **Sem garantias de SLA**
- **Regiões limitadas** inicialmente
- **Sem escalonamento automático** - manual via `getRandom()`
- **Implantações contínuas** apenas (não instantâneas como Workers)

Planeje mudanças na API e teste minuciosamente antes da produção.
