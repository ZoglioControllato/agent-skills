# Configuração Tunnel

## Fonte de config

Tunnels usam uma de duas fontes:

| Fonte      | Armazenamento        | Atualizações              | Caso de uso                          |
| ---------- | -------------------- | ------------------------- | ------------------------------------ |
| Local      | arquivo `config.yml` | edita arquivo, reinicia   | Dev, vários ambientes, versionamento |
| Cloudflare | Painel/API           | instantâneo, sem reinício | Produção, gestão centralizada        |

**Tunnels com token** = fonte: Cloudflare  
**Tunnels gerenciados localmente** = fonte: local

## Localização do arquivo

```
~/.cloudflared/config.yml          # User config
/etc/cloudflared/config.yml        # System-wide (Linux)
```

## Estrutura básica

```yaml
tunnel: <UUID>
credentials-file: /path/to/<UUID>.json

ingress:
  - hostname: app.example.com
    service: http://localhost:8000
  - service: http_status:404 # Required catch-all
```

## Regras de ingress

Avaliadas **de cima para baixo**; a primeira correspondência vence.

```yaml
ingress:
  # Exact hostname + path regex
  - hostname: static.example.com
    path: \.(jpg|png|css|js)$
    service: https://localhost:8001

  # Wildcard hostname
  - hostname: '*.example.com'
    service: https://localhost:8002

  # Path only (all hostnames)
  - path: /api/.*
    service: http://localhost:9000

  # Catch-all (required)
  - service: http_status:404
```

**Validação:**

```bash
cloudflared tunnel ingress validate
cloudflared tunnel ingress rule https://foo.example.com
```

## Tipos de serviço

| Protocolo | Formato                  | Requisito do cliente     |
| --------- | ------------------------ | ------------------------ |
| HTTP      | `http://localhost:8000`  | Navegador                |
| HTTPS     | `https://localhost:8443` | Navegador                |
| TCP       | `tcp://localhost:2222`   | `cloudflared access tcp` |
| SSH       | `ssh://localhost:22`     | `cloudflared access ssh` |
| RDP       | `rdp://localhost:3389`   | `cloudflared access rdp` |
| Unix      | `unix:/path/to/socket`   | Navegador                |
| Test      | `hello_world`            | Navegador                |

## Config da origem

### Parâmetros de conexão

```yaml
originRequest:
  connectTimeout: 30s
  tlsTimeout: 10s
  tcpKeepAlive: 30s
  keepAliveTimeout: 90s
  keepAliveConnections: 100
```

### TLS

```yaml
originRequest:
  noTLSVerify: true # Disable cert verification
  originServerName: 'app.internal' # Override SNI
  caPool: /path/to/ca.pem # Custom CA
```

### HTTP

```yaml
originRequest:
  disableChunkedEncoding: true
  httpHostHeader: 'app.internal'
  http2Origin: true
```

## Modo rede privada

```yaml
tunnel: <UUID>
credentials-file: /path/to/creds.json

warp-routing:
  enabled: true
```

```bash
cloudflared tunnel route ip add 10.0.0.0/8 my-tunnel
cloudflared tunnel route ip add 192.168.1.100/32 my-tunnel
```

## Comparativo de fontes

### Config local

```yaml
# config.yml
tunnel: <UUID>
credentials-file: /path/to/<UUID>.json

ingress:
  - hostname: app.example.com
    service: http://localhost:8000
  - service: http_status:404
```

```bash
cloudflared tunnel run my-tunnel
```

**Prós:** versionamento, vários ambientes, edições offline  
**Contras:** distribuição de arquivo, reinícios manuais

### Config Cloudflare (token)

```bash
# No config file needed
cloudflared tunnel --no-autoupdate run --token <TOKEN>
```

Configure rotas em **Zero Trust** → **Networks** → **Tunnels** → [Tunnel] → **Public Hostname**

**Prós:** atualizações centralizadas, sem arquivo, mudança de rota imediata  
**Contras:** depende de painel/API, menos portável

## Variáveis de ambiente

```bash
TUNNEL_TOKEN=<token>                    # Token for config source: cloudflare
TUNNEL_ORIGIN_CERT=/path/to/cert.pem   # Override cert path (local config)
NO_AUTOUPDATE=true                      # Disable auto-updates
TUNNEL_LOGLEVEL=debug                   # Log level
```

Documentação localizada no ecossistema mantido pelo Controllato Club.
