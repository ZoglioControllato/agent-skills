# Dicas e solução de problemas

## Erros Comuns

### "Conexão inicial lenta (~1,8s)"

**Causa:** Primeiro STUN atrasado durante a formação de consenso (comportamento normal)
**Solução:** As conexões subsequentes são mais rápidas. CF detecta DTLS ClientHello antecipadamente para compensar.

### "Sem fluxo de mídia"

**Causa:** Troca SDP incompleta, conexão não estabelecida, faixas não adicionadas antes da oferta, permissões do navegador ausentes
**Solução:**

1. Verifique se a troca SDP foi concluída
2. Verifique `pc.connectionState === 'conectado'`
3. Certifique-se de que as faixas foram adicionadas antes de criar a oferta
4. Confirme as permissões concedidas ao navegador
5. Use `chrome://webrtc-internals` para depuração

### "Rastrear não recebendo"

**Causa:** trilha não publicada, ID da trilha não compartilhada, IDs de sessão incompatíveis, `pc.ontrack` não definido, renegociação necessária
**Solução:**

1. Verifique a faixa publicada com sucesso
2. Confirme o ID da faixa compartilhado entre pares
3. Verifique a correspondência dos IDs de sessão
4. Defina o manipulador `pc.ontrack` antes de responder
5. Acione a renegociação, se necessário

### "Falha na conexão ICE"

**Causa:** Rede alterada, firewall bloqueado UDP, TURN necessário, problema transitório de rede
**Solução:**

```typescript
pc.oniceconnectionstatechange = async () => {
  if (pc.iceConnectionState === 'failed') {
    console.warn('ICE failed, attempting restart')
    await pc.restartIce() // Triggers new ICE gathering

    // Create new offer with ICE restart flag
    const offer = await pc.createOffer({ iceRestart: true })
    await pc.setLocalDescription(offer)

    // Send to backend → Cloudflare API
    await fetch(`/api/sessions/${sessionId}/renegotiate`, {
      method: 'PUT',
      body: JSON.stringify({ sdp: offer.sdp }),
    })
  }
}
```

### "Trilha presa/congelada"

**Causa:** trilha pausada pelo remetente, congestionamento de rede, incompatibilidade de codec, navegador móvel em segundo plano
**Solução:**

1. Verifique `track.enabled` e `track.readyState === 'live'`
2. Verifique o remetente ativo: `pc.getSenders().find(s => s.track === track)`
3. Verifique as estatísticas de perda/jitter de pacotes (consulte padrões.md)
4. No celular: readquira trilhas quando o aplicativo estiver em primeiro plano
5. Teste com codecs diferentes se for persistente

### "Mudança de rede desconecta chamada"

**Causa:** Troca móvel de WiFi↔celular, troca de redes de laptop
**Solução:**

```typescript
// Listen for network changes
if ('connection' in navigator) {
  ;(navigator as any).connection.addEventListener('change', async () => {
    console.log('Network changed')
    await pc.restartIce() // Use ICE restart pattern above
  })
}

// Or use PartyTracks (handles automatically)
```

## Retry with Exponential Backoff

```typescript
async function fetchWithRetry(url: string, options: RequestInit, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const res = await fetch(url, options)
      if (res.ok) return res
      if (res.status >= 500) throw new Error('Server error')
      return res // Client error, don't retry
    } catch (err) {
      if (i === maxRetries - 1) throw err
      const delay = Math.min(1000 * 2 ** i, 10000) // Cap at 10s
      await new Promise((resolve) => setTimeout(resolve, delay))
    }
  }
}
```

## Depuração com chrome://webrtc-internals

1. Abra `chrome://webrtc-internals` no Chrome/Edge
2. Encontre seu PeerConnection na lista
3. Verifique **Gráficos de estatísticas** para perda de pacotes, jitter, largura de banda
4. Verifique **pares de candidatos ICE**: procure por estado `bem-sucedido`, candidatos de retransmissão versus host
5. Verifique **getStats**: Métricas brutas para RTP de entrada/saída
6. Procure erros em **Log de eventos**: alterações em `iceConnectionState`, `connectionState`
7. Exporte dados com o botão "Baixar atualizações e dados estatísticos do PeerConnection"
8. Problemas comuns visíveis aqui: falhas de ICE, alta perda de pacotes, quedas de taxa de bits

## Limites

| Recurso/Limite     | Valor                | Notas                                                                      |
| ------------------ | -------------------- | -------------------------------------------------------------------------- |
| Saída (grátis)     | 1TB/mês              | Por conta                                                                  |
| Saída (paga)       | US$ 0,05/GB          | Após o nível gratuito                                                      |
| Tráfego de entrada | Grátis               | Todos os planos                                                            |
| Serviço TURN       | Grátis               | Incluído com SFU                                                           |
| Participantes      | Sem limite rígido    | Limite de largura de banda/CPU do cliente (normalmente de 10 a 50 trilhas) |
| Faixas por sessão  | Sem limite rígido    | Recursos do cliente limitados                                              |
| Duração da sessão  | Sem limite rígido    | As chamadas de produção duram horas                                        |
| Portas WebRTC      | UDP 1024-65535       | Somente saída, obrigatório para mídia                                      |
| Limite de taxa API | 600 necessidades/min | Por aplicativo, burst permitido                                            |

## Lista de verificação de segurança

- ✅ **Nunca exponha** `CALLS_APP_SECRET` ao cliente
- ✅ **Validar a identidade do usuário** no back-end antes de criar sessões
- ✅ **Implementar tokens de autenticação** para acesso à sessão (JWT no cabeçalho personalizado)
- ✅ **Limite de taxa** endpoints de criação de sessão
- ✅ **Sessões expiradas** no lado do servidor após inatividade
- ✅ **Validar IDs de faixa** antes de assinar (evitar acesso não autorizado)
- ✅ **Use HTTPS** para todas as sinalizações (chamadas de API)
- ✅ **Ativar DTLS-SRTP** (automático com Cloudflare, criptografa mídia)
- ⚠️ **Considere E2EE** para conteúdo confidencial (implemente no lado do cliente com API Insertable Streams)
