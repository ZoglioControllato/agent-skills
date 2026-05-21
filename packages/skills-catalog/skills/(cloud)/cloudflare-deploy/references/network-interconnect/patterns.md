# Padrões CNI

Consulte [README.md](README.md) para obter uma visão geral.

## Alta disponibilidade

**Crítico:** Projete para resiliência desde o primeiro dia.

**Requisitos:**

- Diversidade em nível de dispositivo (hardware separado)
- Backup de conectividade com a Internet (sem SLA no CNI)
- Locais resilientes à rede preferidos
- Testes regulares de failover

**Arquitetura:**

```
Your Network A ──10G CNI v2──> CF CCR Device 1
                                     │
Your Network B ──10G CNI v2──> CF CCR Device 2
                                     │
                            CF Global Network (AS13335)
```

**Planejamento de Capacidade:**

- Planeje todos os links
- Conta para cenários de failover
- Sua responsabilidade

## Padrão: Magic Transit + CNI v2

**Caso de uso:** Proteção DDoS, conectividade privada, sem sobrecarga de GRE.```typescript
// 1. Create interconnect
const ic = await client.networkInterconnects.interconnects.create({
account_id: id,
type: 'direct',
facility: 'EWR1',
speed: '10G',
name: 'magic-transit-primary',
})

// 2. Poll until active
const status = await pollUntilActive(id, ic.id)

// 3. Configure Magic Transit tunnel via Dashboard/API

````

**Benefits:** 1500 MTU both ways, simplified routing.

## Pattern: Multi-Cloud Hybrid

**Use Case:** AWS/GCP workloads with Cloudflare.

**AWS Direct Connect:**

```typescript
// 1. Order Direct Connect in AWS Console
// 2. Get LOA + VLAN from AWS
// 3. Send to CF account team (no API)
// 4. Configure static routes in Magic WAN

await configureStaticRoutes(id, {
  prefix: '10.0.0.0/8',
  nexthop: 'aws-direct-connect',
})
````

**GCP Cloud Interconnect:**

```
1. Get VLAN attachment pairing key from GCP Console
2. Create via Dashboard: Interconnects → Create → Cloud Interconnect → Google
   - Enter pairing key, name, MTU, speed
3. Configure static routes in Magic WAN (BGP routes from GCP ignored)
4. Configure custom learned routes in GCP Cloud Router
```

**Note:** Dashboard-only. No API/SDK support yet.

## Pattern: Multi-Location HA

**Use Case:** 99.99%+ uptime.

```typescript
// Primary (NY)
const primary = await client.networkInterconnects.interconnects.create({
  account_id: id,
  type: 'direct',
  facility: 'EWR1',
  speed: '10G',
  name: 'primary-ewr1',
})

// Secondary (NY, different hardware)
const secondary = await client.networkInterconnects.interconnects.create({
  account_id: id,
  type: 'direct',
  facility: 'EWR2',
  speed: '10G',
  name: 'secondary-ewr2',
})

// Tertiary (LA, different geography)
const tertiary = await client.networkInterconnects.interconnects.create({
  account_id: id,
  type: 'partner',
  facility: 'LAX1',
  speed: '10G',
  name: 'tertiary-lax1',
})

// BGP local preferences:
// Primary: 200
// Secondary: 150
// Tertiary: 100
// Internet: Last resort
```

## Padrão: Interconexão de parceiros (Equinix)

**Caso de uso:** Implantação rápida, sem colocation.

**Configuração:**

1. Solicite um circuito virtual no Equinix Fabric Portal
2. Selecione Cloudflare como destino
3. Escolha a instalação
4. Envie detalhes para a equipe de conta CF
5. CF aceita no portal
6. Configurar BGP

**Sem automação de API** – portais de parceiros gerenciados separadamente.

## Failover e segurança

**Práticas recomendadas de failover:**

- Use as preferências locais do BGP para prioridade
- Configurar BFD para detecção rápida (v1)
- Teste regularmente com mudança de tráfego
- Cadernos de documentos

**Segurança:**

- Autenticação de senha BGP
- Filtragem de rota BGP
- Monitore rotas inesperadas
- Magic Firewall para DDoS/ameaças
- Permissões mínimas de token de API
- Alternar credenciais periodicamente

## Matriz de decisão

| Requisito                     | Recomendado |
| ----------------------------- | ----------- |
| Colocado com CF               | Direto      |
| Não colocado                  | Parceiro    |
| Cargas de trabalho AWS/GCP    | Nuvem       |
| 1500 MTU em ambos os sentidos | v2          |
| Marcação de VLAN              | v1          |
| Peering público               | v1          |
| Configuração mais simples     | v2          |
| Failover rápido BFD           | v1          |
| Pacote LACP                   | v1          |

## Recursos

- [Documentos do Magic Transit](https://developers.cloudflare.com/magic-transit/)
- [Documentos Magic WAN](https://developers.cloudflare.com/magic-wan/)
- [Roteamento Inteligente Argo](https://developers.cloudflare.com/argo/)
