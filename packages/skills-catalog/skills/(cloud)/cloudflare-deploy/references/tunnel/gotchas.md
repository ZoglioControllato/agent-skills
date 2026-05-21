# Armadilhas Tunnel

## Erros comuns

### "Error 1016 (Origin DNS Error)"

**Causa:** tunnel parado ou desconectado  
**Solução:**

```bash
cloudflared tunnel info my-tunnel     # Check status
ps aux | grep cloudflared             # Verify running
journalctl -u cloudflared -n 100      # Check logs
```

### "Self-signed certificate rejected"

**Causa:** origem com certificado autoassinado  
**Solução:**

```yaml
originRequest:
  noTLSVerify: true # Dev only
  caPool: /path/to/ca.pem # Custom CA
```

### "Connection timeout"

**Causa:** origem lenta ou timeouts baixos  
**Solução:**

```yaml
originRequest:
  connectTimeout: 60s
  tlsTimeout: 20s
  keepAliveTimeout: 120s
```

### "Tunnel not starting"

**Causa:** config inválida, credenciais ausentes ou tunnel inexistente  
**Solução:**

```bash
cloudflared tunnel ingress validate  # Validate config
ls -la ~/.cloudflared/*.json         # Verify credentials
cloudflared tunnel list              # Verify tunnel exists
```

### "Connection already registered"

**Causa:** várias réplicas com mesmo connector ID ou conexão obsoleta  
**Solução:**

```bash
# Check active connections
cloudflared tunnel info my-tunnel

# Wait 60s for stale connection cleanup, or restart with new connector ID
cloudflared tunnel run my-tunnel
```

### "Tunnel credentials rotated but connections fail"

**Causa:** processos antigos com credenciais expiradas  
**Solução:**

```bash
# Stop all cloudflared processes
pkill cloudflared

# Verify stopped
ps aux | grep cloudflared

# Restart with new credentials
cloudflared tunnel run my-tunnel
```

## Limites

| Recurso / limite        | Valor                 | Notas                                        |
| ----------------------- | --------------------- | -------------------------------------------- |
| Plano free              | Tunnels ilimitados    | Tráfego ilimitado                            |
| Réplicas do tunnel      | 1000 por tunnel       | Máx. concorrentes                            |
| Duração da conexão      | Sem limite rígido     | Horas a dias                                 |
| Conexões longevas       | Podem cair em updates | WebSocket, SSH, UDP                          |
| Registro de réplica     | ~5s TTL               | Réplica antiga removida sem heartbeat        |
| Janela de rotação token | 24 horas              | Tokens antigos funcionam no período de graça |

## Boas práticas

### Segurança

1. Prefira tunnels com token (fonte Cloudflare) para controle centralizado
2. Habilite políticas Access para serviços sensíveis
3. Rode credenciais do tunnel periodicamente
4. Após rotação: pare processos antigos dentro de ~24h de graça
5. Valide certificados TLS (`noTLSVerify: false` em produção quando possível)
6. Restrinja tipo de serviço `bastion` quando aplicável

### Desempenho

1. Várias réplicas para HA (2–4 típico), balanceadas automaticamente
2. Réplicas compartilham o mesmo UUID do tunnel, IDs de connector distintos
3. Coloque `cloudflared` perto da origem (mesma rede)
4. Use HTTP/2 para gRPC (`http2Origin: true`)
5. Ajuste keepalive para conexões longas
6. Monitore contagem de conexões

### Configuração

1. Use variáveis de ambiente para secrets
2. Versionamento de arquivos de config
3. Valide antes do deploy (`cloudflared tunnel ingress validate`)
4. Teste regras (`cloudflared tunnel ingress rule <URL>`)
5. Documente ordem das regras (primeira vitória)

### Operações

1. Monitore saúde no painel (réplicas ativas)
2. Alertas de desconexão quando réplicas → 0
3. Encerramento gracioso para mudanças de config
4. Atualize réplicas de forma rolante
5. Mantenha `cloudflared` atual (janela de suporte ~1 ano)
6. Em produção use `--no-autoupdate` e controle updates manualmente

## Modo debug

```bash
cloudflared tunnel --loglevel debug run my-tunnel
cloudflared tunnel ingress rule https://app.example.com
```

## Estratégias de migração

### De Ngrok

```yaml
# Ngrok: ngrok http 8000
# Cloudflare Tunnel:
ingress:
  - hostname: app.example.com
    service: http://localhost:8000
  - service: http_status:404
```

### De VPN

```yaml
# Replace VPN with private network routing
warp-routing:
  enabled: true
```

```bash
cloudflared tunnel route ip add 10.0.0.0/8 my-tunnel
```

Usuários instalam o cliente WARP em vez de VPN tradicional.

Documentação localizada no ecossistema mantido pelo Controllato Club.
