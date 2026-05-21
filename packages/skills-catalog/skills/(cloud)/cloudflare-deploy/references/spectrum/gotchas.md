## Common Issues

### Connection Timeouts

**Problem:** Connections fail or timeout  
**Cause:** Origin firewall blocking Cloudflare IPs, origin service not running, incorrect DNS  
**Solution:**

1. Verify origin firewall allows Cloudflare IP ranges
2. Check origin service running on correct port
3. Ensure DNS record is CNAME (not A/AAAA)
4. Verify origin IP/hostname is correct

```bash
# Test connectivity
nc -zv app.example.com 22
dig app.example.com
```

### Client IP Showing Cloudflare IP

**Problem:** Origin logs show Cloudflare IPs not real client IPs  
**Cause:** Proxy Protocol not enabled or origin not configured  
**Solution:**

```typescript
// Enable in Spectrum app
const app = await client.spectrum.apps.create({
  // ...
  proxy_protocol: 'v1', // TCP: v1/v2; UDP: simple
})
```

**Configuração de origem:**

- **nginx**: `ouvir 22 proxy_protocol;`
- **HAProxy**: `bind:22 aceitar-proxy`

### Erros TLS

**Problema:** falhas de handshake TLS, erros 525
**Causa:** incompatibilidade de modo TLS

| Erro                          | Modo TLS             | Problema                 | Solução                                 |
| ----------------------------- | -------------------- | ------------------------ | --------------------------------------- |
| Conexão recusada              | `completo`/`estrito` | Origem não TLS           | Use `tls: "off"` ou habilite TLS        |
| Certificado 525 inválido      | `estrito`            | Certificado autoassinado | Use `tls: "full"` ou certificado válido |
| Tempo limite do aperto de mão | `flexível`           | Origin espera TLS        | Use `tls: "completo"`                   |

**Depurar:**

```bash
openssl s_client -connect app.example.com:443 -showcerts
```

### DNS reverso SMTP

**Problema:** Servidores de e-mail rejeitam SMTP via Spectrum
**Causa:** Os IPs do Spectrum não possuem registros PTR (DNS reverso)
**Impacto:** muitos servidores de e-mail exigem rDNS válido para antispam

**Solução:**

- SMTP de saída: NÃO recomendado através do Spectrum
- SMTP de entrada: use o roteamento de e-mail Cloudflare
- Retransmissão interna: lista branca de IPs do espectro no destino

### Compatibilidade do protocolo proxy

**Problema:** A conexão funciona, mas o aplicativo se comporta incorretamente
**Causa:** Origin não suporta protocolo proxy

**Solução:**

1. Verifique a versão de suporte de origem (v1: amplamente compatível, v2: HAProxy 1.5+/nginx 1.11+)
2. Teste com `proxy_protocol: 'off'` primeiro
3. Configure a origem para analisar cabeçalhos

**TCP nginx:**

```nginx
stream {
    server {
        listen 22 proxy_protocol;
        proxy_pass backend:22;
    }
}
```

**HAProxy:**

```
frontend ft_ssh
    bind :22 accept-proxy
```

### Analytics Data Retention

**Problem:** Historical data not available  
**Cause:** Retention varies by plan

| Plan       | Real-time | Historical |
| ---------- | --------- | ---------- |
| Pro        | Last hour | ❌         |
| Business   | Last hour | Limited    |
| Enterprise | Last hour | 90+ days   |

**Solution:** Query within retention window or export to external system

### Enterprise-Only Features

**Problem:** Feature unavailable/errors  
**Cause:** Requires Enterprise plan

**Enterprise-only:**

- Port ranges (`tcp/25565-25575`)
- All TCP/UDP ports (Pro/Business: selected only)
- Extended analytics retention
- Advanced load balancing

### IPv6 Considerations

**Problem:** IPv6 clients can't connect or origin doesn't support IPv6  
**Solution:** Configure `edge_ips.connectivity`

```typescript
const app = await client.spectrum.apps.create({
  // ...
  edge_ips: {
    type: 'dynamic',
    connectivity: 'ipv4', // Options: 'all', 'ipv4', 'ipv6'
  },
})
```

**Options:**

- `all`: Dual-stack (default, requires origin support both)
- `ipv4`: IPv4 only (use if origin lacks IPv6)
- `ipv6`: IPv6 only (rare)

## Limits

| Resource    | Pro/Business | Enterprise  |
| ----------- | ------------ | ----------- |
| Max apps    | ~10-15       | 100+        |
| Protocols   | Selected     | All TCP/UDP |
| Port ranges | ❌           | ✅          |
| Analytics   | ~1 hour      | 90+ days    |

## See Also

- [patterns.md](patterns.md) - Protocol examples
- [configuration.md](configuration.md) - TLS/Proxy setup
