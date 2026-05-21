# Referência SFU em tempo real da Cloudflare

Orientação especializada para criar aplicativos de áudio/vídeo/dados em tempo real usando Cloudflare Realtime SFU (Selective Forwarding Unit).

## Ordem de leitura

| Tarefa                            | Arquivos                    | ~Tokens |
| --------------------------------- | --------------------------- | ------- |
| Novo projeto                      | LEIA-ME → configuração      | ~1200   |
| Implementar publicação/assinatura | LEIA-ME → API               | ~1600   |
| Adicionar PartyTracks             | padrões (seção PartyTracks) | ~800    |
| Construir sistema de presença     | padrões (seção DO)          | ~800    |
| Depurar problemas de conexão      | pegadinhas                  | ~700    |
| Escalar para milhões              | padrões (seção em cascata)  | ~600    |
| Adicionar transmissão simultânea  | padrões (seção Avançado)    | ~500    |
| Configurar o TURN                 | configuração (seção TURN)   | ~400    |

## Nesta referência

- **[configuration.md](configuration.md)** - Configuração, implantação, variáveis de ambiente, configuração do Wrangler
- **[api.md](api.md)** - Sessões, trilhas, endpoints, padrões de solicitação/resposta
- **[patterns.md](patterns.md)** - Padrões de arquitetura, casos de uso, exemplos de integração
- **[gotchas.md](gotchas.md)** - Problemas comuns, depuração, desempenho, segurança

## Início rápido

Cloudflare Realtime SFU: infraestrutura WebRTC em rede global (mais de 310 cidades). Roteamento Anycast, sem restrições regionais, modelo pub/sub.

**Conceitos principais:**

- **Sessões:** WebRTC PeerConnection com Cloudflare Edge
- **Faixas:** Canais de áudio/vídeo/dados que você publica ou assina
- **Sem salas:** Crie você mesmo uma camada de presença por meio do compartilhamento de trilhas (consulte padrões.md)

**Modelo mental:** Seu cliente estabelece uma sessão WebRTC, publica faixas (áudio/vídeo), compartilha IDs de faixa por meio de seu back-end, outros assinam suas faixas usando IDs de faixa + seu ID de sessão.

## Escolha sua abordagem

| Abordagem             | Quando usar                                              | Complexidade                                        |
| --------------------- | -------------------------------------------------------- | --------------------------------------------------- |
| **PartyTracks**       | Aplicativos de produção com troca de dispositivos, React | Baixo - Baseado em observáveis, lida com reconexões |
| **API bruta**         | Requisitos personalizados, sem navegador, aprendizagem   | Médio - Controle total, ciclo de vida WebRTC manual |
| **Kit em tempo real** | SDK ponta a ponta com componentes de UI                  | Mais baixo - Estado gerenciado, ganchos React       |

**Recomendação:** Comece com PartyTracks para a maioria das aplicações de produção. Veja padrões.md para exemplos de PartyTracks.

##SFU vs RealtimeKit

- **SFU em tempo real:** Infraestrutura WebRTC (esta referência). Crie sua própria sinalização, presença e UI.
- **RealtimeKit:** Camada SDK sobre SFU. Inclui ganchos React, gerenciamento de estado, componentes de UI. Parte da plataforma Cloudflare AI.

Use SFU diretamente quando precisar de sinalização personalizada ou estrutura não React. Use o RealtimeKit para um desenvolvimento mais rápido com React.

## Configuração

Painel: https://dash.cloudflare.com/?to=/:account/calls

Obtenha `CALLS_APP_ID` e `CALLS_APP_SECRET` do painel e consulte configuration.md para implantação.

## Veja também

- [Orange Meets Demo](https://demo.orange.cloudflare.dev/)
- [Fonte Laranja](https://github.com/cloudflare/orange)
- [Exemplos de chamadas](https://github.com/cloudflare/calls-examples)
- [Referência da API](https://developers.cloudflare.com/api/resources/calls/)
- [Documentos do RealtimeKit](https://developers.cloudflare.com/workers-ai/realtimekit/)
