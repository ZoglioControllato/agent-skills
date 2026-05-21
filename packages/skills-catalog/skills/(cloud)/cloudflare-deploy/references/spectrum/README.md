# Referência de habilidade do Cloudflare Spectrum

## Visão geral

O Cloudflare Spectrum oferece segurança e aceleração para QUALQUER aplicativo baseado em TCP ou UDP. É um proxy reverso global de camada 4 (L4) executado nos nós de borda da Cloudflare que roteia MQTT, e-mail, transferência de arquivos, controle de versão, jogos e muito mais por meio da Cloudflare para mascarar origens e proteger contra ataques DDoS.

**Quando usar o Spectrum**: quando seu protocolo não for HTTP/HTTPS (use o proxy Cloudflare para HTTP). O Spectrum cuida de todo o resto: SSH, jogos, bancos de dados, MQTT, SMTP, RDP, protocolos personalizados.

## Planejar capacidades

| Capacidade                      | Pró/Negócios                | Empresa                   |
| ------------------------------- | --------------------------- | ------------------------- |
| Protocolos TCP                  | Somente portas selecionadas | Todas as portas (1-65535) |
| Protocolos UDP                  | Somente portas selecionadas | Todas as portas (1-65535) |
| Faixas portuárias               | ❌                          | ✅                        |
| Roteamento inteligente Argo     | ✅                          | ✅                        |
| Firewall IP                     | ✅                          | ✅                        |
| Origens do balanceador de carga | ✅                          | ✅                        |

## Árvore de decisão

**O que você está tentando fazer?**

1. **Criar/gerenciar aplicativo Spectrum**

- Via Painel → Consulte [Painel Cloudflare](https://dash.cloudflare.com)
- Via API → Consulte [api.md](api.md) - endpoints REST
- Via SDK → Veja [api.md](api.md) - Exemplos TypeScript/Python/Go
- Via IaC → Veja [configuration.md](configuration.md) - Terraform/Pulumi

2. **Proteja protocolo específico**

- SSH → Consulte [patterns.md](patterns.md#1-ssh-server-protection)
- Jogos (Minecraft, etc) → Consulte [patterns.md](patterns.md#2-game-server)
- MQTT/IoT → Consulte [patterns.md](patterns.md#3-mqtt-broker)
- SMTP/E-mail → Consulte [patterns.md](patterns.md#4-smtp-relay)
- Banco de dados → Consulte [patterns.md](patterns.md#5-database-proxy)
- RDP → Consulte [patterns.md](patterns.md#6-rdp-remote-desktop)

3. **Escolha o tipo de origem**

- IP direto (servidor único) → Consulte [configuration.md](configuration.md#direct-ip-origin)
- CNAME (nome do host) → Consulte [configuration.md](configuration.md#cname-origin)
- Balanceador de carga (HA/failover) → Consulte [configuration.md](configuration.md#load-balancer-origin)

## Ordem de leitura

1. Comece com [patterns.md](patterns.md) para seu protocolo específico
2. Então [configuration.md](configuration.md) para o seu tipo de origem
3. Verifique [gotchas.md](gotchas.md) antes de ir para a produção
4. Use [api.md](api.md) para acesso programático

## Veja também

- [Documentos Cloudflare](https://developers.cloudflare.com/spectrum/)
