# Cloudflare Realtime Kit

Orientação especializada para criar aplicativos de vídeo e áudio em tempo real usando o **Cloudflare RealtimeKit**, um conjunto abrangente de SDK para adicionar vídeo e voz ao vivo personalizáveis a aplicativos da Web ou móveis.

## Visão geral

RealtimeKit é o pacote SDK da Cloudflare baseado em Realtime SFU, abstraindo a complexidade do WebRTC com integração rápida, componentes de UI pré-construídos, desempenho global (mais de 300 cidades) e recursos de produção (gravação, transcrição, bate-papo, enquetes).

**Casos de uso**: reuniões de equipe, webinars, vídeos sociais, chamadas de áudio, plug-ins interativos

## Conceitos Básicos

- **Aplicativo**: Reuniões de agrupamento de espaço de trabalho, participantes, predefinições, gravações. Use aplicativos separados para preparação/produção
- **Reunião**: sala virtual reutilizável. Cada associação cria uma nova **Sessão**
- **Sessão**: instância de reunião ao vivo. Criado na primeira adesão, termina após a última licença
- **Participante**: usuário adicionado via REST API. Retorna `authToken` para o SDK do cliente. **Não reutilize tokens**
- **Predefinição**: Permissão reutilizável/modelo de UI (permissões, tipo de reunião, tema). Aplicado na criação do participante
- **Peer ID** (`id`): Único por sessão, alterações ao reingressar
- **ID do participante** (`userId`): persistente entre sessões

## Início rápido

### 1. Criar aplicativo e reunião (back-end)```bash

# Create app

curl -X POST 'https://api.cloudflare.com/client/v4/accounts/<account_id>/realtime/kit/apps' \
 -H 'Authorization: Bearer <api_token>' \
 -d '{"name": "My RealtimeKit App"}'

# Create meeting

curl -X POST 'https://api.cloudflare.com/client/v4/accounts/<account_id>/realtime/kit/<app_id>/meetings' \
 -H 'Authorization: Bearer <api_token>' \
 -d '{"title": "Team Standup"}'

# Add participant

curl -X POST 'https://api.cloudflare.com/client/v4/accounts/<account_id>/realtime/kit/<app_id>/meetings/<meeting_id>/participants' \
 -H 'Authorization: Bearer <api_token>' \
 -d '{"name": "Alice", "preset_name": "host"}'

# Returns: { authToken }

````

### 2. Client Integration

**React**:

```tsx
import { RtkMeeting } from '@cloudflare/realtimekit-react-ui'

function App() {
  return <RtkMeeting authToken="<participant_auth_token>" onLeave={() => {}} />
}
````

**Core SDK**:

```typescript
import RealtimeKitClient from '@cloudflare/realtimekit'

const meeting = new RealtimeKitClient({ authToken: '<token>', video: true, audio: true })
await meeting.join()
```

## Ordem de leitura

| Tarefa                   | Arquivos               |
| ------------------------ | ---------------------- |
| Integração rápida        | Somente LEIA-ME        |
| IU personalizada         | README → padrões → API |
| Configuração de back-end | LEIA-ME → configuração |
| Problemas de depuração   | pegadinhas             |
| Recursos avançados       | padrões → API          |

## RealtimeKit vs Realtime SFU

| Escolha               | Quando                                                              |
| --------------------- | ------------------------------------------------------------------- |
| **Kit em tempo real** | Precisa de UI pré-construída, integração rápida, React/Angular/HTML |
| **SFU em tempo real** | Construindo do zero, WebRTC personalizado, controle total           |

O RealtimeKit é baseado em Realtime SFU, mas abstrai a complexidade do WebRTC com componentes de UI e SDKs.

## Qual pacote?

Precisa de uma interface de reunião pré-construída?

- Reagir → `@cloudflare/realtimekit-react-ui` (`<RtkMeeting>`)
- Angular → `@cloudflare/realtimekit-angular-ui`
- HTML/Vanilla → `@cloudflare/realtimekit-ui`

Precisa de IU personalizada?

- Core SDK → `@cloudflare/realtimekit` (RealtimeKitClient) - controle total

Precisa de controle WebRTC bruto?

- Veja a referência `realtime-sfu/`

## Nesta referência

- [Configuração](./configuration.md) - Configuração, instalação, configuração do wrangler
- [API](./api.md) - Objeto de reunião, API REST, métodos SDK
- [Padrões](./patterns.md) - Fluxos de trabalho comuns, exemplos de código
- [Gotchas](./gotchas.md) - Problemas comuns, solução de problemas

## Veja também

- [Trabalhadores](../trabalhadores/) - Integração de back-end
- [D1](../d1/) - Armazenamento de metadados de reunião
- [R2](../r2/) - Armazenamento de gravação
- [KV](../kv/) - Gerenciamento de sessão

## Links de referência

- **Documentos oficiais**: https://developers.cloudflare.com/realtime/realtimekit/
- **Referência da API**: https://developers.cloudflare.com/api/resources/realtime_kit/
- **Exemplos**: https://github.com/cloudflare/realtimekit-web-examples
- **Painel**: https://dash.cloudflare.com/?to=/:account/realtime/kit
