# Dicas e solução de problemas

Armadilhas, limitações e soluções comuns para soquetes TCP em Cloudflare Workers.

## Limites da plataforma

### Limites de conexão

| Limite                                         | Valor                                      |
| ---------------------------------------------- | ------------------------------------------ |
| Máximo de soquetes simultâneos por solicitação | 6 (limite rígido)                          |
| Vida útil do soquete                           | Duração do pedido                          |
| Tempo limite de conexão                        | Dependente da plataforma, sem configuração |

**Problema:** Exceder 6 conexões gera erro

**Solução:** Processar em lotes de 6```typescript
for (let i = 0; i < hosts.length; i += 6) {
const batch = hosts.slice(i, i + 6).map((h) => connect({ hostname: h, port: 443 }))
await Promise.all(
batch.map(async (s) => {
/_ use _/ await s.close()
}),
)
}

````
### Destinos bloqueados

IPs Cloudflare (1.1.1.1), localhost (127.0.0.1), porta 25 (SMTP), URL do próprio trabalhador bloqueado por segurança.

**Solução:** Use IPs públicos ou nomes de host de túnel: `connect({ hostname: "db.internal.company.net", port: 5432 })`

### Requisitos de escopo

**Problema:** Sockets criados no escopo global falham

**Causa:** Sockets vinculados ao ciclo de vida da solicitação

**Solução:** Crie um manipulador interno: `export default { async fetch() { const socket = connect(...); } }`

## Erros Comuns

### Erro: "falha na solicitação de proxy"

**Causas:** Destino bloqueado (IP da Cloudflare, localhost, porta 25), falha de DNS, rede inacessível

**Solução:** validar destinos, usar nomes de host do Tunnel, detectar erros com try/catch

### Erro: "Loop TCP detectado"

**Causa:** Worker se conectando a si mesmo

**Solução:** Conecte-se ao serviço externo, não ao nome de host do próprio Worker

### Erro: "Porta 25 proibida"

**Causa:** Porta SMTP bloqueada

**Solução:** use a API Email Workers para email

### Erro: "soquete não está aberto"

**Causa:** Leitura/gravação após fechamento

**Solução:** Sempre use try/finally para garantir a ordem de fechamento adequada

### Erro: tempo limite de conexão

**Causa:** Sem tempo limite integrado

**Solução:** Use `Promise.race()`:```typescript
const socket = connect(addr, opts)
const timeout = new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 5000))
await Promise.race([socket.opened, timeout])
````

## Problemas de TLS/SSL

### Tempo de início do TLS

**Problema:** Chamar `startTls()` muito cedo

**Solução:** Envie o comando STARTTLS específico do protocolo, aguarde o servidor OK e chame `socket.startTls()`

### Validação de certificado

**Problema:** certificados autoassinados falham

**Solução:** Use certificados ou túnel adequados (lida com a terminação TLS)

## Problemas de desempenho

### Não usando pool de conexões

**Problema:** Nova sobrecarga de conexão por solicitação

**Solução:** Use [Hyperdrive](../hyperdrive/) para bancos de dados (pooling integrado)

### Não usando posicionamento inteligente

**Problema:** Alta latência para back-end

**Solução:** Habilite: `{ "placement": { "mode": "smart" } }` em wrangler.jsonc

### Esquecendo de fechar os soquetes

**Problema:** Vazamentos de recursos

**Solução:** Sempre use try/finalmente:```typescript
const socket = connect({ hostname: 'api.internal', port: 443 })
try {
// Use socket
} finally {
await socket.close()
}

````

## Data Handling Issues

### Assuming Single Read Gets All Data

**Problem:** Only reading once may miss chunked data

**Solution:** Loop `reader.read()` until `done === true` (see patterns.md)

### Text Encoding Issues

**Problem:** Using wrong encoding

**Solution:** Specify encoding: `new TextDecoder('iso-8859-1').decode(data)`

## Security Issues

### SSRF Vulnerability

**Problem:** User-controlled destinations allow access to internal services

**Solution:** Validate against strict allowlist:

```typescript
const ALLOWED = ['api1.internal.net', 'api2.internal.net']
const host = new URL(req.url).searchParams.get('host')
if (!host || !ALLOWED.includes(host)) return new Response('Forbidden', { status: 403 })
````

## Quando usar alternativas

| Caso de uso            | Alternativa                  | Razão                    |
| ---------------------- | ---------------------------- | ------------------------ |
| PostgreSQL/MySQL       | [Hiperdrive](../hiperdrive/) | Pool de conexões, cache  |
| HTTP/HTTPS             | `buscar()`                   | Mais simples, integrado  |
| HTTP com proteção SSRF | Serviços VPC (beta 2025+)    | Vinculações declarativas |

## Dicas de depuração

1. **Registre detalhes da conexão:** `const info = await socket.opened; console.log(info.remoteAddress);`
2. **Teste primeiro com serviços públicos:** Use tcpbin.com:4242 echo server
3. **Verificar túnel:** `informações do túnel cloudflared <nome>` e `lista de IP da rota do túnel cloudflared`

## Relacionado

- [Hyperdrive](../hyperdrive/) - Conexões de banco de dados
- [Smart Placement](../smart-placement/) - Otimização de latência
- [Solução de problemas de túnel](../tunnel/gotchas.md)
