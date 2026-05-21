# Interconexão de rede Cloudflare (CNI)

Conectividade privada e de alto desempenho com a rede da Cloudflare. **Somente para empresas**.

## Tipos de conexão

**Direto**: Fibra física em datacenter compartilhado. 10/100Gbps. Você solicita conexão cruzada.

**Parceiro**: Virtual via Console Connect, Equinix, Megaport, etc. Gerenciado via parceiro SDN.

**Nuvem**: AWS Direct Connect ou GCP Cloud Interconnect. Somente WAN mágico.

## Versões do plano de dados

**v1 (Clássico)**: suporte a túnel GRE, VLAN/BFD/LACP, MTU assimétrico (1500↓/1476↑), suporte a peering.

**v2 (Beta)**: Sem GRE, 1.500 MTU em ambos os sentidos, ainda sem VLAN/BFD/LACP, em vez disso, ECMP.

## Casos de uso

- **Magic Transit DSR**: proteção DDoS, saída via ISP (v1/v2)
- **Trânsito Mágico + Saída**: DDoS + saída via CF (v1/v2)
- **Magic WAN + Zero Trust**: backbone privado (v1 precisa de GRE, v2 nativo)
- **Peering**: rotas públicas no PoP (somente v1)
- **Segurança de aplicativos**: WAF/Cache/LB (v1/v2 sobre Magic Transit)

## Pré-requisitos

- Plano empresarial
- Prefixos IPv4 /24+ ou IPv6 /48+
- BGP ASN para v1
- Consulte [PDF de locais](https://developers.cloudflare.com/network-interconnect/static/cni-locations-2026-01.pdf)

## Especificações

- /31 sub-redes ponto a ponto
- Distância óptica máxima de 10 km
  10G: modo único 10GBASE LR
  100G: modo único 100GBASE LR4
- **Sem SLA** (serviço gratuito)
- É necessário fazer backup da Internet

## Taxa de transferência

| Direção                | 10G                 | 100G                |
| ---------------------- | ------------------- | ------------------- |
| CF → Cliente           | 10 Gbps             | 100Gbps             |
| Cliente → CF (peering) | 10 Gbps             | 100Gbps             |
| Cliente → CF (Magia)   | 1 Gbps/túnel ou CNI | 1 Gbps/túnel ou CNI |

## Linha do tempo

2-4 semanas típicas. Etapas: solicitar → revisão de configuração → solicitar conexão → configurar → testar → habilitar verificações de integridade → ativar → monitorar.

## Nesta referência

- [configuration.md](./configuration.md) - BGP, roteamento, configuração
- [api.md](./api.md) - endpoints de API, SDKs
- [patterns.md](./patterns.md) - HA, nuvem híbrida, failover
- [gotchas.md](./gotchas.md) - Solução de problemas, limites

## Ordem de leitura por tarefa

| Tarefa                          | Arquivos para carregar            |
| ------------------------------- | --------------------------------- |
| Configuração inicial            | README → configuração.md → api.md |
| Criar interconexão via API      | api.md → pegadinhas.md            |
| Projetar arquitetura HA         | padrões.md → LEIA-ME              |
| Solucionar problemas de conexão | gotchas.md → configuração.md      |
| Integração na nuvem (AWS/GCP)   | configuração.md → padrões.md      |
| Monitorar + alertas             | configuração.md                   |

## Limite de automação

**API-automatizável:**

- Listar/criar/excluir interconexões (Direto, Parceiro)
- Listar slots disponíveis
- Obtenha status de interconexão
- Baixe o PDF da LOA
- Criar/atualizar objetos CNI (configuração BGP)
- Configurações de consulta

**Requer equipe de conta:**

- Aprovação inicial da solicitação
- Configuração do AWS Direct Connect (enviar LOA+VLAN para CF)
- Ativação final do GCP Cloud Interconnect
- Aceitação de interconexão de parceiros (Equinix, Megaport)
- Atribuição de VLAN (v1)
- Geração de documento de configuração (v1)
- Escalações + suporte para solução de problemas

**Não pode ser automatizado:**

- Instalação física de conexão cruzada (direta)
- Operações do portal de parceiros (pedido de circuito virtual)
- Operações do portal AWS/GCP
- Coordenação da janela de manutenção

## Veja também

- [tunnel](../tunnel/) - Alternativa para conectividade de rede privada
- [spectrum](../spectrum/) - Proxy da camada 4 para tráfego TCP/UDP
