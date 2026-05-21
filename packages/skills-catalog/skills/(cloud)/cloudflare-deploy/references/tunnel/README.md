# Cloudflare Tunnel

Conexões seguras somente de saída entre sua infraestrutura e a rede global da Cloudflare.

## Visão geral

O Cloudflare Tunnel (antes Argo Tunnel) permite:

- **Conexões só de saída** — sem portas de entrada ou mudanças grandes de firewall
- **Roteamento por hostname público** — expor serviços locais à internet
- **Acesso a rede privada** — redes internas via WARP
- **Integração Zero Trust** — políticas de acesso embutidas

**Arquitetura:** Tunnel (objeto persistente) → Réplica (processo `cloudflared`) → Serviços de origem

**Terminologia:**

- **Tunnel:** objeto nomeado persistente com UUID
- **Réplica:** processo individual `cloudflared` conectado ao tunnel
- **Config Source:** onde ficam as regras de ingresso (arquivo local vs painel Cloudflare)
- **Connector:** termo legado para réplica

## Início rápido

### Config local

```bash
# Install cloudflared
brew install cloudflared  # macOS

# Authenticate
cloudflared tunnel login

# Create tunnel
cloudflared tunnel create my-tunnel

# Route DNS
cloudflared tunnel route dns my-tunnel app.example.com

# Run tunnel
cloudflared tunnel run my-tunnel
```

### Config no painel (recomendado)

1. **Zero Trust** → **Networks** → **Tunnels** → **Create**
2. Nomeie o tunnel, copie o token
3. Configure rotas no painel
4. Execute: `cloudflared tunnel --no-autoupdate run --token <TOKEN>`

## Árvore de decisão

**Escolha da fonte de config:**

```
Need centralized config updates?
├─ Yes → Token-based (dashboard config)
└─ No → Local config file

Multiple environments (dev/staging/prod)?
├─ Yes → Local config (version controlled)
└─ No → Either works

Need firewall approval?
└─ See networking.md first
```

## Comandos principais

```bash
# Tunnel lifecycle
cloudflared tunnel create <name>
cloudflared tunnel list
cloudflared tunnel info <name>
cloudflared tunnel delete <name>

# DNS routing
cloudflared tunnel route dns <tunnel> <hostname>
cloudflared tunnel route list

# Private network
cloudflared tunnel route ip add 10.0.0.0/8 <tunnel>

# Run tunnel
cloudflared tunnel run <name>
```

## Exemplo de configuração

```yaml
# ~/.cloudflared/config.yml
tunnel: 6ff42ae2-765d-4adf-8112-31c55c1551ef
credentials-file: /root/.cloudflared/6ff42ae2-765d-4adf-8112-31c55c1551ef.json

ingress:
  - hostname: app.example.com
    service: http://localhost:8000
  - hostname: api.example.com
    service: https://localhost:8443
    originRequest:
      noTLSVerify: true
  - service: http_status:404
```

## Ordem de leitura

**Novo no Cloudflare Tunnel:**

1. Este README (visão geral, início rápido)
2. [networking.md](./networking.md) — firewall, checagens de conectividade
3. [configuration.md](./configuration.md) — opções de arquivo, ingress
4. [patterns.md](./patterns.md) — Docker, Kubernetes, produção
5. [gotchas.md](./gotchas.md) — solução de problemas, boas práticas

**Implantação enterprise:**

1. [networking.md](./networking.md) — requisitos de firewall corporativo
2. [gotchas.md](./gotchas.md) — HA, segurança
3. [patterns.md](./patterns.md) — Kubernetes, updates graduais

**Controle programático:**

1. [api.md](./api.md) — REST API, SDK TypeScript

## Nesta referência

- [networking.md](./networking.md) — firewall, portas, pré-checagens
- [configuration.md](./configuration.md) — arquivo de config, ingress, TLS
- [api.md](./api.md) — REST, SDK, tunnels com token
- [patterns.md](./patterns.md) — Docker, Kubernetes, Terraform, HA
- [gotchas.md](./gotchas.md) — limitações, boas práticas

## Ver também

- [workers](../workers/) — Workers com Tunnel
- [access](../access/) — políticas Zero Trust Access
- [warp](../warp/) — cliente WARP para redes privadas

Documentação localizada no ecossistema mantido pelo Controllato Club.
