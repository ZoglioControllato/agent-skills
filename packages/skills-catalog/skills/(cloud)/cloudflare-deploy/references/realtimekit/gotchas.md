# Dicas e solução de problemas do RealtimeKit

## Erros Comuns

### "Não é possível conectar-se à reunião"

**Causa:** Token de autenticação inválido/expirado, credenciais de API sem permissões ou rede bloqueando WebRTC
**Solução:**
Verifique a validade do token, verifique se o token da API tem permissões **Realtime/Realtime Admin**, ative o serviço TURN para redes restritivas

### "Sem faixas de vídeo/áudio"

**Causa:** Permissões do navegador não concedidas, vídeo/áudio não ativados, dispositivo em uso ou dispositivo indisponível
**Solução:**
Solicite permissões do navegador explicitamente, verifique a configuração de inicialização, use `meeting.self.getAllDevices()` para depurar, feche outros aplicativos usando o dispositivo

### "Contagem de participantes incompatível"

**Causa:** `meeting.participants` não inclui `meeting.self`
**Solução:** Contagem total = `meeting.participants.joined.size() + 1`

### "Eventos não disparados"

**Causa:** Listeners registrados após ações, nome de evento incorreto ou namespace errado
**Solução:**
Registre ouvintes antes de chamar `meeting.join()`, verifique os nomes dos eventos em relação aos documentos, verifique o namespace correto

### "Erros de CORS em chamadas de API"

**Causa:** Fazendo chamadas de API REST do lado do cliente
**Solução:** Todas as chamadas da API REST **devem** ser do lado do servidor (Workers, back-end). Nunca exponha tokens de API aos clientes.

### "Predefinição não aplicada"

**Causa:** A predefinição não existe, o nome não corresponde (diferencia maiúsculas de minúsculas) ou o participante foi criado antes da predefinição
**Solução:**
Verifique se a predefinição existe por meio do Dashboard ou API, verifique a ortografia exata e as maiúsculas e minúsculas, crie uma predefinição antes de adicionar participantes

### "Erro de reutilização de token"

**Causa:** Reutilização de tokens de participantes em sessões
**Solução:** Gere um novo token por sessão. Use o endpoint de atualização se o token expirar durante a sessão.

### "Qualidade de vídeo ruim"

**Causa:** Largura de banda insuficiente, resolução/taxa de bits muito alta ou sobrecarga da CPU
**Solução:**
Reduza a resolução/frameRate de `mediaConfiguration.video`, monitore as condições da rede, reduza a contagem de participantes ou o tamanho da grade

### "Eco ou feedback de áudio"

**Causa:** vários dispositivos captando a mesma fonte de áudio
**Solução:**

- Diminuir resolução/frameRate de `mediaConfiguration.video`
- Monitorar as condições da rede
- Reduza a contagem de participantes ou o tamanho da grade

### Problema: eco ou feedback de áudio

**Causa**: vários dispositivos captando a mesma fonte de áudio

**Soluções**:
Habilite `echoCancellation: true` em `mediaConfiguration.audio`, use fones de ouvido, silencie quando não estiver falando

### "Compartilhamento de tela não funciona"

**Causa:** o navegador não suporta API de compartilhamento de tela, permissão negada ou configuração `displaySurface` incorreta
**Solução:**
Use Chrome/Edge/Firefox (suporte limitado ao Safari), verifique as permissões do navegador, tente diferentes valores `displaySurface` ('janela', 'monitor', 'navegador')

### "Como faço para agendar reuniões?"

**Causa:** O RealtimeKit não possui sistema de agendamento integrado
**Solução:**
Armazene IDs de reuniões em seu banco de dados com carimbos de data/hora. Gere tokens de participante somente quando o usuário precisar ingressar. Exemplo:```typescript
// Store in DB
{ meetingId: 'abc123', scheduledFor: '2026-02-15T10:00:00Z', userId: 'user456' }

// Generate token when user clicks "Join" near scheduled time
const response = await fetch('/api/join-meeting', {
method: 'POST',
body: JSON.stringify({ meetingId: 'abc123' })
});
const { authToken } = await response.json();

````

### "Recording not starting"

**Cause:** Preset lacks recording permissions, no active session, or API call from client
**Solution:**
Verify preset has `canRecord: true` and `canStartStopRecording: true`, ensure session is active (at least one participant), make recording API calls server-side only

## Limits

| Resource                        | Limit              |
| ------------------------------- | ------------------ |
| Max participants per session    | 100                |
| Max concurrent sessions per App | 1000               |
| Max recording duration          | 6 hours            |
| Max meeting duration            | 24 hours           |
| Max chat message length         | 4000 characters    |
| Max preset name length          | 64 characters      |
| Max meeting title length        | 256 characters     |
| Max participant name length     | 256 characters     |
| Token expiration                | 24 hours (default) |
| WebRTC ports required           | UDP 1024-65535     |

## Network Requirements

### Firewall Rules

Allow outbound UDP/TCP to:

- `*.cloudflare.com` ports 443, 80
- UDP ports 1024-65535 (WebRTC media)

### TURN Service

Enable for users behind restrictive firewalls/proxies:

```jsonc
// wrangler.jsonc
{
  "vars": {
    "TURN_SERVICE_ID": "your_turn_service_id",
  },
  // Set secret: wrangler secret put TURN_SERVICE_TOKEN
}
````

TURN automatically configured in SDK when enabled in account.

## Debugging Tips

```typescript
// Check devices
const devices = await meeting.self.getAllDevices()
meeting.self.on('deviceListUpdate', ({ added, removed, devices }) =>
  console.log('Devices:', { added, removed, devices }),
)

// Monitor participants
meeting.participants.joined.on('participantJoined', (p) =>
  console.log(`${p.name} joined:`, {
    id: p.id,
    userId: p.userId,
    audioEnabled: p.audioEnabled,
    videoEnabled: p.videoEnabled,
  }),
)

// Check room state
meeting.self.on('roomJoined', () =>
  console.log('Room:', {
    meetingId: meeting.meta.meetingId,
    meetingTitle: meeting.meta.meetingTitle,
    participantCount: meeting.participants.joined.size() + 1,
    audioEnabled: meeting.self.audioEnabled,
    videoEnabled: meeting.self.videoEnabled,
  }),
)

// Log all events
;['roomJoined', 'audioUpdate', 'videoUpdate', 'screenShareUpdate', 'deviceUpdate', 'deviceListUpdate'].forEach(
  (event) => meeting.self.on(event, (data) => console.log(`[self] ${event}:`, data)),
)
;['participantJoined', 'participantLeft'].forEach((event) =>
  meeting.participants.joined.on(event, (data) => console.log(`[participants] ${event}:`, data)),
)
meeting.chat.on('chatUpdate', (data) => console.log('[chat] chatUpdate:', data))
```

## Segurança e desempenho

### Segurança: NÃO

- Expor `CLOUDFLARE_API_TOKEN` no código do cliente, credenciais de código fixo no frontend
- Reutilize tokens de participantes, armazene tokens em localStorage sem criptografia
- Permitir a criação de reuniões do lado do cliente

### Segurança: FAÇA

- Gere tokens apenas no lado do servidor, use HTTPS, implemente limitação de taxa
- Valide a autenticação do usuário antes de gerar tokens, use `custom_participant_id` para mapear para o seu sistema de usuário
- Defina permissões predefinidas apropriadas por função de usuário, alterne os tokens de API regularmente

### Desempenho

- **CPU**: reduza a resolução/taxa de quadros de vídeo, desative o vídeo somente para áudio, use `meeting.participants.active` para reuniões grandes, implemente rolagem virtual
- **Largura de banda**: Defina a resolução máxima em `mediaConfiguration`, desative o áudio do compartilhamento de tela se desnecessário, use o modo somente áudio, implemente taxa de bits adaptável
- **Memória**: Limpe os ouvintes de eventos ao desmontar, chame `meeting.leave()` quando terminar, não armazene grandes matrizes de participantes

## Nesta referência

- [README.md](README.md) - Visão geral, conceitos básicos, início rápido
- [configuration.md](configuration.md) - Configuração do SDK, predefinições, configuração do wrangler
- [api.md](api.md) - APIs do SDK do cliente, endpoints REST
- [patterns.md](patterns.md) - Padrões comuns, ganchos React, integração de back-end
