# Rede Tunnel

## Requisitos de conectividade

### Portas de saída

O `cloudflared` precisa de saída para:

| Porta | Protocolo | Finalidade                 | Obrigatório |
| ----- | --------- | -------------------------- | ----------- |
| 7844  | TCP/UDP   | Protocolo principal (QUIC) | Sim         |
| 443   | TCP       | Fallback (HTTP/2)          | Sim         |

**Caminho de rede:**

```
cloudflared → edge.argotunnel.com:7844 (preferred)
cloudflared → region.argotunnel.com:443 (fallback)
```

### Regras de firewall

#### Mínimo (produção)

```bash
# Outbound only
ALLOW tcp/udp 7844 to *.argotunnel.com
ALLOW tcp 443 to *.argotunnel.com
```

#### Completo (recomendado)

```bash
# Tunnel connectivity
ALLOW tcp/udp 7844 to *.argotunnel.com
ALLOW tcp 443 to *.argotunnel.com

# API access (for token-based tunnels)
ALLOW tcp 443 to api.cloudflare.com

# Updates (optional)
ALLOW tcp 443 to github.com
ALLOW tcp 443 to objects.githubusercontent.com
```

### Faixas de IP

IPs anycast Cloudflare (endpoints do tunnel):

```
# IPv4
198.41.192.0/24
198.41.200.0/24

# IPv6
2606:4700::/32
```

**Nota:** prefira resolver DNS para `*.argotunnel.com` em vez de fixar IPs. A Cloudflare pode adicionar edges.

## Pré-voo

Teste conectividade antes do deploy:

```bash
# Test DNS resolution
dig edge.argotunnel.com +short

# Test port 7844 (QUIC/UDP)
nc -zvu edge.argotunnel.com 7844

# Test port 443 (HTTP/2 fallback)
nc -zv edge.argotunnel.com 443

# Test with cloudflared
cloudflared tunnel --loglevel debug run my-tunnel
# Look for "Registered tunnel connection"
```

### Erros comuns de conectividade

| Erro                        | Causa                | Solução                                      |
| --------------------------- | -------------------- | -------------------------------------------- |
| "no such host"              | DNS bloqueado        | Permita porta 53 UDP/TCP                     |
| "context deadline exceeded" | Porta 7844 bloqueada | UDP/TCP 7844                                 |
| "TLS handshake timeout"     | Porta 443 bloqueada  | TCP 443; desative inspeção SSL se necessário |

## Escolha de protocolo

O `cloudflared` escolhe automaticamente:

| Protocolo | Porta    | Prioridade     | Uso                               |
| --------- | -------- | -------------- | --------------------------------- |
| QUIC      | 7844 UDP | 1ª (preferido) | Baixa latência, melhor desempenho |
| HTTP/2    | 443 TCP  | 2ª (fallback)  | QUIC bloqueado pelo firewall      |

**Forçar fallback HTTP/2:**

```bash
cloudflared tunnel --protocol http2 run my-tunnel
```

**Verificar protocolo ativo:**

```bash
cloudflared tunnel info my-tunnel
# Shows "connections" with protocol type
```

## Roteamento de rede privada

### Requisitos do cliente WARP

Usuários acessando IPs privados via WARP precisam:

```bash
# Outbound (WARP client)
ALLOW udp 500,4500 to 162.159.*.* (IPsec)
ALLOW udp 2408 to 162.159.*.* (WireGuard)
ALLOW tcp 443 to *.cloudflareclient.com
```

### Split tunnel

Encaminhe só redes privadas pelo tunnel:

```yaml
# warp-routing config
warp-routing:
  enabled: true
```

```bash
# Add specific routes
cloudflared tunnel route ip add 10.0.0.0/8 my-tunnel
cloudflared tunnel route ip add 172.16.0.0/12 my-tunnel
cloudflared tunnel route ip add 192.168.0.0/16 my-tunnel
```

Usuários WARP acessam esses IPs sem VPN clássica.

## Diagnóstico de rede

### Diagnóstico de conexão

```bash
# Check edge selection and connection health
cloudflared tunnel info my-tunnel --output json | jq '.connections[]'

# Enable metrics endpoint
cloudflared tunnel --metrics localhost:9090 run my-tunnel
curl localhost:9090/metrics | grep cloudflared_tunnel

# Test latency
curl -w "time_total: %{time_total}\n" -o /dev/null https://myapp.example.com
```

## Rede corporativa

O `cloudflared` respeita `HTTP_PROXY`, `HTTPS_PROXY`, `NO_PROXY`.

Se o proxy corporativo intercepta TLS, adicione a CA raiz da empresa ao trust store do sistema.

## Banda e limites

| Limite                  | Valor             | Notas                      |
| ----------------------- | ----------------- | -------------------------- |
| Tamanho da requisição   | 100 MB            | Uma requisição HTTP        |
| Velocidade de upload    | Sem limite rígido | Depende de rede/plano      |
| Conexões concorrentes   | 1000 por tunnel   | Entre todas as réplicas    |
| Requisições por segundo | Sem limite fixo   | Sujeito a detecção de DDoS |

**Arquivos grandes:** prefira R2 ou Workers com upload em chunks em vez de streaming pesado pelo tunnel.

Documentação localizada no ecossistema mantido pelo Controllato Club.
