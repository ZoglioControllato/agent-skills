# Serviço Cloudflare TURN

Orientação especializada para implementação do Cloudflare TURN Service em aplicações WebRTC.

## Visão geral

O serviço Cloudflare TURN (Traversal Using Relays around NAT) é um serviço de retransmissão gerenciado para aplicativos WebRTC. O TURN atua como um ponto de retransmissão para o tráfego entre clientes WebRTC e SFUs, especialmente quando a comunicação ponto a ponto direta é obstruída por NATs ou firewalls. O serviço é executado na rede global anycast da Cloudflare em mais de 310 cidades.

## Principais características

- **Arquitetura Anycast**: conecta clientes automaticamente ao local mais próximo da Cloudflare
- **Rede Global**: disponível em toda a rede da Cloudflare (excluindo a China Network)
- **Configuração Zero**: Não há necessidade de selecionar manualmente regiões ou servidores
- **Suporte a protocolo**: STUN/TURN sobre UDP, TCP e TLS
- **Nível gratuito**: Gratuito quando usado com Cloudflare Calls SFU, caso contrário, US$ 0,05/GB de saída

## Nesta referência

| Arquivo                               | Finalidade                                                                       |
| ------------------------------------- | -------------------------------------------------------------------------------- |
| [api.md](./api.md)                    | API de credenciais, gerenciamento de chaves TURN, tipos, restrições              |
| [configuração.md](./configuration.md) | Configuração do trabalhador, wrangler.jsonc, env vars, lista de permissões de IP |
| [padrões.md](./padrões.md)            | Padrões de implementação, casos de uso, exemplos de integração                   |
| [gotchas.md](./gotchas.md)            | Solução de problemas, limites, segurança, erros comuns                           |

## Ordem de leitura

| Tarefa                       | Arquivos para ler               | Husa. Fichas |
| ---------------------------- | ------------------------------- | ------------ |
| Início rápido                | Somente LEIA-ME                 | ~500         |
| Gerar credenciais            | LEIA-ME → API                   | ~1300        |
| Integração dos trabalhadores | README → configuração → padrões | ~2000        |
| Conexão de depuração         | pegadinhas                      | ~700         |
| Revisão de segurança         | API → pegadinhas                | ~1500        |
| Firewall corporativo         | configuração                    | ~600         |

## Endereços e portas de serviço

### STUN sobre UDP

- **Primário**: `stun.cloudflare.com:3478/udp`
- **Alternativa**: `stun.cloudflare.com:53/udp` (bloqueado por navegadores, não recomendado)

### VIRAR UDP

- **Primário**: `turn.cloudflare.com:3478/udp`
- **Alternativa**: `turn.cloudflare.com:53/udp` (bloqueado pelos navegadores)

### TURN sobre TCP

- **Primário**: `turn.cloudflare.com:3478/tcp`
- **Alternativa**: `turn.cloudflare.com:80/tcp`

### TRANSFORMAR TLS

- **Primário**: `turn.cloudflare.com:5349/tcp`
- **Alternativa**: `turn.cloudflare.com:443/tcp`

## Início rápido

1. **Criar chave TURN via API**: consulte [api.md#create-turn-key](./api.md#create-turn-key)
2. **Gerar credenciais**: consulte [api.md#generate-temporary-credentials](./api.md#generate-temporary-credentials)
3. **Configurar Worker**: consulte [configuration.md#cloudflare-worker-integration](./configuration.md#cloudflare-worker-integration)
4. **Implementar cliente**: consulte [patterns.md#basic-turn-configuration-browser](./patterns.md#basic-turn-configuration-browser)

## Quando usar TURN

- **NATs restritivos**: NATs simétricos que bloqueiam conexões diretas
- **Firewalls corporativos**: ambientes bloqueando portas WebRTC
- **Redes móveis**: cenários NAT de nível de operadora
- **Conectividade previsível**: quando confiabilidade > eficiência

## Serviços Cloudflare relacionados

- **Cloudflare Calls SFU**: Unidade de encaminhamento seletivo gerenciado (TURN free quando usado com SFU)
- **Cloudflare Stream**: streaming de vídeo com suporte WHIP/WHEP
- **Cloudflare Workers**: back-end para geração de credenciais
- **Cloudflare KV**: cache de credenciais
- **Objetos duráveis da Cloudflare**: gerenciamento do estado da sessão

## Recursos Adicionais

- [Documentação de chamadas da Cloudflare](https://developers.cloudflare.com/calls/)
- [Documentos de serviço Cloudflare TURN](https://developers.cloudflare.com/realtime/turn/)
- [Referência da API Cloudflare](https://developers.cloudflare.com/api/resources/calls/subresources/turn/)
- [Orange Meets (exemplo de código aberto)](https://github.com/cloudflare/orange)
