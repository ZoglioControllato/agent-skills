# TURN Gotchas & Troubleshooting

Common mistakes, security best practices, and troubleshooting for Cloudflare TURN.

## Quick Reference

| Issue                              | Solution                     | Details                                                        |
| ---------------------------------- | ---------------------------- | -------------------------------------------------------------- |
| Credentials not working            | Check TTL ≤ 48hrs            | [See Troubleshooting](#issue-turn-credentials-not-working)     |
| Connection drops after ~48hrs      | Implement credential refresh | [See Connection Drops](#issue-connection-drops-after-48-hours) |
| Port 53 fails in browser           | Filter server-side           | [See Port 53](#using-port-53-in-browsers)                      |
| High packet loss                   | Check rate limits            | [See Rate Limits](#limits-per-turn-allocation)                 |
| Connection fails after maintenance | Implement ICE restart        | [See ICE Restart](#ice-restart-required-scenarios)             |

## Critical Constraints

| Constraint                  | Value                      | Consequence if Violated                             |
| --------------------------- | -------------------------- | --------------------------------------------------- |
| Max credential TTL          | 48 hours (172800s)         | API rejects request                                 |
| Credential revocation delay | ~seconds                   | Billing stops immediately, connection drops shortly |
| IP allowlist update window  | 14 days (if IPs change)    | Connection fails if IPs change                      |
| Packet rate                 | 5-10k pps per allocation   | Packet drops                                        |
| Data rate                   | 50-100 Mbps per allocation | Packet drops                                        |
| Unique IP rate              | >5 new IPs/sec             | Packet drops                                        |

## Limits Per TURN Allocation

**Per user** (not account-wide):

- **IP addresses**: >5 new unique IPs per second
- **Packet rate**: 5-10k packets per second (inbound/outbound)
- **Data rate**: 50-100 Mbps (inbound/outbound)
- **MTU**: No specific limit
- **Burst rates**: Higher than documented

Exceeding limits results in **packet drops**.

## Common Mistakes

### Setting TTL > 48 hours

```typescript
// ❌ BAD: API will reject
const creds = await generate({ ttl: 604800 }) // 7 days

// ✅ GOOD:
const creds = await generate({ ttl: 86400 }) // 24 hours
```

### Hardcoding IPs without monitoring

```typescript
// ❌ BAD: IPs can change with 14-day notice
const iceServers = [{ urls: 'turn:141.101.90.1:3478' }]

// ✅ GOOD: Use DNS
const iceServers = [{ urls: 'turn:turn.cloudflare.com:3478' }]
```

### Using port 53 in browsers

```typescript
// ❌ BAD: Blocked by Chrome/Firefox
urls: ['turn:turn.cloudflare.com:53']

// ✅ GOOD: Filter port 53
urls: urls.filter((url) => !url.includes(':53'))
```

### Not handling credential expiry

```typescript
// ❌ BAD: Credentials expire but call continues → connection drops
const creds = await fetchCreds()
const pc = new RTCPeerConnection({ iceServers: creds })

// ✅ GOOD: Refresh before expiry
setInterval(() => refreshCredentials(pc), 3000000) // 50 min
```

### Missing ICE restart support

```typescript
// ❌ BAD: No recovery from TURN maintenance
pc.addEventListener('iceconnectionstatechange', () => {
  console.log('State changed:', pc.iceConnectionState)
})

// ✅ GOOD: Implement ICE restart
pc.addEventListener('iceconnectionstatechange', async () => {
  if (pc.iceConnectionState === 'failed') {
    await refreshCredentials(pc)
    pc.restartIce()
  }
})
```

### Exposing TURN key secret client-side

```typescript
// ❌ BAD: Secret exposed to client
const secret = 'your-turn-key-secret'
const response = await fetch(`https://rtc.live.cloudflare.com/v1/turn/...`, {
  headers: { Authorization: `Bearer ${secret}` },
})

// ✅ GOOD: Generate credentials server-side
const response = await fetch('/api/turn-credentials')
```

## ICE Restart Required Scenarios

These events require ICE restart (see [patterns.md](./patterns.md#ice-restart-pattern)):

1. **TURN server maintenance** (occasional on Cloudflare's network)
2. **Network topology changes** (anycast routing changes)
3. **Credential refresh** during long sessions (>1 hour)
4. **Connection failure** (iceConnectionState === 'failed')

Implement in all production apps:

```typescript
pc.addEventListener('iceconnectionstatechange', async () => {
  if (pc.iceConnectionState === 'failed' || pc.iceConnectionState === 'disconnected') {
    await refreshTURNCredentials(pc)
    pc.restartIce()
    const offer = await pc.createOffer({ iceRestart: true })
    await pc.setLocalDescription(offer)
    // Send offer to peer via signaling...
  }
})
```

Referência: [RFC 8445 Seção 2.4](https://datatracker.ietf.org/doc/html/rfc8445#section-2.4)

## Lista de verificação de segurança

- [] Credenciais geradas apenas no lado do servidor (nunca no lado do cliente)
- [] TURN_KEY_SECRET em segredos do wrangler, não em vars
- [ ] TTL ≤ duração esperada da sessão (e ≤ 48 horas)
- [] Limitação de taxa no endpoint de geração de credenciais
- [] Autenticação do cliente antes de emitir credenciais
- [] API de revogação de credenciais para sessões comprometidas
- [] Nenhum IP codificado (ou monitoramento de DNS em vigor)
- [] Porta 53 filtrada para clientes de navegador

## Solução de problemas

### Problema: as credenciais do TURN não funcionam

**Verificar:**

- ID da chave e segredo estão corretos
- As credenciais não expiraram (verifique o TTL)
- TTL não excede 172.800 segundos (48 horas)
- O servidor pode acessar rtc.live.cloudflare.com
- Rede permite HTTPS de saída

**Solução:**

```typescript
// Validate before using
if (ttl > 172800) {
  throw new Error('TTL cannot exceed 48 hours')
}
```

### Problema: estabelecimento lento de conexão

**Soluções:**

- Garantir a reunião adequada de candidatos do ICE
- Verifique a latência da rede até a borda do Cloudflare
- Verifique se o firewall permite portas WebRTC (3478, 5349, 443)
- Considere usar TURN over TLS (porta 443) para redes corporativas

### Problema: Alta perda de pacotes

**Verificar:**

- Não excedendo os limites de taxa (5-10k pps)
- Não excedendo os limites de largura de banda (50-100 Mbps)
- Não conectar a muitos IPs exclusivos (>5/seg)
- Qualidade da rede do cliente

### Problema: a conexão cai após aproximadamente 48 horas

**Causa**: as credenciais expiraram (48 horas no máximo)

**Solução**:

- Defina o TTL para a duração esperada da sessão
- Implementar atualização de credenciais com setConfiguration()
- Use a reinicialização do ICE se a conexão falhar```typescript
  // Refresh credentials before expiry
  const refreshInterval = ttl \* 1000 - 60000 // 1 min early
  setInterval(async () => {
  await refreshTURNCredentials(pc)
  }, refreshInterval)

````

### Issue: Port 53 URLs in browser fail silently

**Cause**: Chrome/Firefox block port 53

**Solution**: Filter port 53 URLs server-side:

```typescript
const filtered = urls.filter((url) => !url.includes(':53'))
````

### Problema: IPs codificados param de funcionar

**Causa**: a Cloudflare alterou os endereços IP (aviso com 14 dias de antecedência)

**Solução**:

- Use nomes de host DNS (`turn.cloudflare.com`)
- Monitore alterações de DNS com alertas automatizados
- Atualize as listas de permissões dentro de 14 dias se estiver usando a lista de permissões de IP

## Otimização de custos

1. Use TTLs apropriados (não provisione demais)
2. Implementar cache de credenciais
3. Defina `'iceTransportPolicy: 'all'` para tentar direto primeiro (use `'relay'` somente quando necessário)
4. Monitore o uso da largura de banda
5. Gratuito quando usado com Cloudflare Calls SFU

## Veja também

- [api.md](./api.md) - API de geração de credenciais, revogação
- [configuration.md](./configuration.md) - Lista de permissões de IP, monitoramento
- [patterns.md](./patterns.md) - reinicialização do ICE, padrões de atualização de credenciais
