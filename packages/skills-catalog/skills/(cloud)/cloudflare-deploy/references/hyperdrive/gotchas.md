# Armadilhas

Veja [README.md](./README.md), [configuration.md](./configuration.md), [api.md](./api.md) e [patterns.md](./patterns.md).

## Erros comuns

### "Too many open connections" / "Connection limit exceeded"

**Causa:** Workers têm limite rígido de **6 conexões concorrentes por invocação**  
**Solução:** defina `max: 5` na config do driver, reutilize conexões e finalize com `client.end()` ou `ctx.waitUntil(conn.end())`

### "Failed to acquire a connection (Pool exhausted)"

**Causa:** todas as conexões do pool em uso, muitas vezes por transações longas  
**Solução:** reduza a duração da transação, evite consultas acima de 60s, não segure conexão durante chamadas externas ou faça upgrade para plano pago com mais conexões

### "connection_refused"

**Causa:** banco recusando conexões por firewall, limite de conexões ou serviço fora do ar  
**Solução:** confira firewall permitindo IPs da Cloudflare, porta de escuta e credenciais

### "Query timeout (deadline exceeded)"

**Causa:** consulta ultrapassando limite de 60s  
**Solução:** otimize com índices, reduza dados com LIMIT, divida em consultas menores ou use processamento assíncrono

### "password authentication failed"

**Causa:** credenciais inválidas na config do Hyperdrive  
**Solução:** confira usuário e senha na config e no banco

### "SSL/TLS connection error"

**Causa:** incompatibilidade de SSL/TLS entre Hyperdrive e banco  
**Solução:** use `sslmode=require` (Postgres) ou `sslMode=REQUIRED` (MySQL), envie CA se for autoassinado, verifique SSL no DB e validade do certificado

### "Queries not being cached"

**Causa:** consulta mutável (INSERT/UPDATE/DELETE), funções voláteis (NOW(), RANDOM()) ou cache desativado  
**Solução:** confirme SELECT não mutável, evite funções voláteis, cache habilitado, teste com `wrangler dev --remote` e `prepare=true` no postgres.js

### "Slow multi-query Workers despite Hyperdrive"

**Causa:** Worker na edge e cada consulta ida e volta até a região do DB  
**Solução:** habilite Smart Placement (`"placement": {"mode": "smart"}` no wrangler.jsonc). Veja o padrão “várias consultas” em [patterns.md](./patterns.md).

### "Local database connection failed"

**Causa:** `localConnectionString` incorreto ou banco não rodando  
**Solução:** valide a string local, se o DB está no ar, nome da env combina com o binding e teste com cliente psql/mysql

### "Environment variable not working"

**Causa:** formato da variável de ambiente incorreto ou não exportada  
**Solução:** use `CLOUDFLARE_HYPERDRIVE_LOCAL_CONNECTION_STRING_<BINDING>`, binding igual ao wrangler.jsonc, exporte no shell e reinicie o wrangler dev

## Limites

| Limite                 | Free     | Pago     | Notas                                                    |
| ---------------------- | -------- | -------- | -------------------------------------------------------- |
| Configs máx.           | 10       | 25       | Configurações Hyperdrive por conta                       |
| Conexões do Worker     | 6        | 6        | Máx. concorrentes por invocação                          |
| Nome de usuário/DB     | 63 bytes | 63 bytes | Comprimento máximo                                       |
| Timeout de conexão     | 15s      | 15s      | Tempo para estabelecer conexão                           |
| Timeout ocioso         | 10 min   | 10 min   | Conexão ociosa                                           |
| Conexões na origem     | ~20      | ~100     | Conexões com o banco de origem                           |
| Duração máx. da query  | 60s      | 60s      | Consultas acima de 60s são encerradas                    |
| Resposta em cache máx. | 50 MB    | 50 MB    | Respostas acima de 50MB retornam mas não entram em cache |

## Recursos

- [Docs](https://developers.cloudflare.com/hyperdrive/)
- [Getting Started](https://developers.cloudflare.com/hyperdrive/get-started/)
- [Wrangler Reference](https://developers.cloudflare.com/hyperdrive/reference/wrangler-commands/)
- [Supported DBs](https://developers.cloudflare.com/hyperdrive/reference/supported-databases-and-features/)
- [Discord #hyperdrive](https://discord.cloudflare.com)
- [Limit Increase Form](https://forms.gle/ukpeZVLWLnKeixDu7)

Documentação localizada no ecossistema mantido pelo Controllato Club.
