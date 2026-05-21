#Configuração CNI

Consulte [README.md](README.md) para obter uma visão geral.

## Fluxo de trabalho (2 a 4 semanas)

1. **Enviar solicitação** (Semana 1): entre em contato com a equipe da conta e forneça o tipo/local/caso de uso
2. **Revisar configuração** (somente semana 1-2, v1): Aprovar documento IP/VLAN/especificação
3. **Conexão do pedido** (Semana 2-3):

- **Direto**: Obtenha LOA, solicite conexão cruzada da instalação
- **Parceiro**: Solicite circuito virtual no portal do parceiro
- **Nuvem**: Solicite Direct Connect/Cloud Interconnect, envie LOA+VLAN para CF

4. **Configurar** (Semana 3): configuração de ambos os lados por documento
5. **Teste** (Semanas 3 a 4): Ping, verificação de BGP, verificação de rotas
6. **Verificações de integridade** (Semana 4): Configure [Magic Transit](https://developers.cloudflare.com/magic-transit/how-to/configure-tunnel-endpoints/#add-tunnels) ou [Magic WAN](https://developers.cloudflare.com/magic-wan/configuration/manually/how-to/configure-tunnel-endpoints/#add-tunnels) verificações de integridade
7. **Ativar** (Semana 4): rotear o tráfego, verificar o fluxo
8. **Monitor**: ative [notificações de manutenção](https://developers.cloudflare.com/network-interconnect/monitoring-and-alerts/#enable-cloudflare-status-maintenance-notification)

##Configuração BGP

**Requisitos v1:**

- BGP ASN (fornecido durante a configuração)
- /31 sub-rede para peering
- Opcional: senha BGP

**v2:** Simplificado, menos configuração de BGP necessária.

**BGP sobre CNI (dezembro de 2024):** Magic WAN/Transit agora pode peering BGP diretamente sobre CNI v2 (não é necessário túnel GRE).

**Exemplo de BGP v1:**

```
Router ID: 192.0.2.1
Peer IP: 192.0.2.0
Remote ASN: 13335
Local ASN: 65000
Password: [optional]
VLAN: 100
```

## Configuração do Cloud Interconnect

### AWS Direct Connect (beta)

**Requisitos:** Magic WAN, AWS Dedicated Direct Connect 1/10 Gbps.

**Processo:**

1. Entre em contato com a equipe de conta CF
2. Escolha o local
3. Faça o pedido no portal AWS
4. AWS fornece LOA + VLAN ID
5. Envie para a equipe de conta CF
6. Espere cerca de 4 semanas

**Pós-configuração:** Adicione [rotas estáticas](https://developers.cloudflare.com/magic-wan/configuration/manually/how-to/configure-routes/#configure-static-routes) ao Magic WAN. Ative [verificações de integridade bidirecionais](https://developers.cloudflare.com/magic-wan/configuration/manually/how-to/configure-tunnel-endpoints/#legacy-bidirecional-health-checks).

### Interconexão em nuvem do GCP (Beta)

**Configuração via Painel:**

1. Interconexões → Criar → Cloud Interconnect → Google
2. Forneça nome, MTU (corresponde ao anexo VLAN do GCP), velocidade (opções granulares de 50M-50G disponíveis para interconexões de parceiros)
3. Insira a chave de emparelhamento do anexo VLAN
4. Confirme o pedido

**Roteamento para o GCP:** adicione [rotas estáticas](https://developers.cloudflare.com/magic-wan/configuration/manually/how-to/configure-routes/#configure-static-routes). Rotas BGP do GCP Cloud Router **ignoradas**.

**Roteamento para CF:** configure [rotas aprendidas personalizadas](https://cloud.google.com/network-connectivity/docs/router/how-to/configure-custom-learned-routes) no Cloud Router. Solicite prefixos à equipe de conta CF.

## Monitoramento

**Status do painel:**

| Estado         | Significado                                                          |
| -------------- | -------------------------------------------------------------------- |
| **Saudável**   | Link operacional, tráfego fluindo, exames de saúde aprovados         |
| **Ativo**      | Link up, luz suficiente, Ethernet negociada                          |
| **Insalubre**  | Link desativado, sem/pouca luz (<-20 dBm), não é possível negociar   |
| **Pendente**   | Conexão cruzada incompleta, dispositivo sem resposta, troca de RX/TX |
| **Para baixo** | Link físico desativado, sem conectividade                            |

**Alertas:**

**Manutenção de conexão CNI** (somente Magic Networking):```
Dashboard → Notifications → Add
Product: Cloudflare Network Interconnect
Type: Connection Maintenance Alert

```

Warnings up to 2 weeks advance. 6hr delay for new additions.

**Cloudflare Status Maintenance** (entire PoP):

```

Dashboard → Notifications → Add
Product: Cloudflare Status
Filter PoPs: gru,fra,lhr

```

**Find PoP code:**

```

Dashboard → Magic Transit/WAN → Configuration → Interconnects
Select CNI → Note Data Center (e.g., "gru-b")
Use first 3 letters: "gru"

```
## Melhores práticas

**Práticas críticas específicas de configuração:**

- /31 sub-redes necessárias para BGP
- Senhas BGP recomendadas
- BFD para failover rápido (somente v1)
- Teste a conectividade do ping antes do BGP
- Habilite notificações de manutenção imediatamente após a ativação
- Monitore o status programaticamente via API

Para padrões de design, arquitetura de alta disponibilidade e práticas recomendadas de segurança, consulte [patterns.md](./patterns.md).
```
