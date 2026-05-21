## Tipos de origem

### Origem IP Direta

Use quando a origem for um servidor único com IP estático.

**SDK TypeScript:**

```typescript
const app = await client.spectrum.apps.create({
  zone_id: 'your-zone-id',
  protocol: 'tcp/22',
  dns: { type: 'CNAME', name: 'ssh.example.com' },
  origin_direct: ['tcp://192.0.2.1:22'],
  ip_firewall: true,
  tls: 'off',
})
```

**Terraform:**

```hcl
resource "cloudflare_spectrum_application" "ssh" {
  zone_id  = var.zone_id
  protocol = "tcp/22"

  dns {
    type = "CNAME"
    name = "ssh.example.com"
  }

  origin_direct      = ["tcp://192.0.2.1:22"]
  ip_firewall        = true
  tls                = "off"
  argo_smart_routing = true
}
```

### CNAME Origin

Use when origin is a hostname (not static IP). Spectrum resolves DNS dynamically.

**TypeScript SDK:**

```typescript
const app = await client.spectrum.apps.create({
  zone_id: 'your-zone-id',
  protocol: 'tcp/3306',
  dns: { type: 'CNAME', name: 'db.example.com' },
  origin_dns: { name: 'db-primary.internal.example.com' },
  origin_port: 3306,
  tls: 'full',
})
```

**Terraform:**

```hcl
resource "cloudflare_spectrum_application" "database" {
  zone_id  = var.zone_id
  protocol = "tcp/3306"

  dns {
    type = "CNAME"
    name = "db.example.com"
  }

  origin_dns {
    name = "db-primary.internal.example.com"
  }

  origin_port        = 3306
  tls                = "full"
  argo_smart_routing = true
}
```

### Origem do balanceador de carga

Use para alta disponibilidade e failover.

**Terraforma:**

```hcl
resource "cloudflare_load_balancer" "game_lb" {
  zone_id          = var.zone_id
  name             = "game-lb.example.com"
  default_pool_ids = [cloudflare_load_balancer_pool.game_pool.id]
}

resource "cloudflare_load_balancer_pool" "game_pool" {
  name    = "game-primary"
  origins { name = "game-1"; address = "192.0.2.1" }
  monitor = cloudflare_load_balancer_monitor.tcp_monitor.id
}

resource "cloudflare_load_balancer_monitor" "tcp_monitor" {
  type = "tcp"; port = 25565; interval = 60; timeout = 5
}

resource "cloudflare_spectrum_application" "game" {
  zone_id  = var.zone_id
  protocol = "tcp/25565"
  dns { type = "CNAME"; name = "game.example.com" }
  origin_dns { name = cloudflare_load_balancer.game_lb.name }
  origin_port = 25565
}
```

## TLS Configuration

| Mode       | Description                    | Use Case                    | Origin Cert |
| ---------- | ------------------------------ | --------------------------- | ----------- |
| `off`      | No TLS                         | Non-encrypted (SSH, gaming) | No          |
| `flexible` | TLS client→CF, plain CF→origin | Testing                     | No          |
| `full`     | TLS end-to-end, self-signed OK | Production                  | Yes (any)   |
| `strict`   | Full + valid cert verification | Max security                | Yes (CA)    |

**Example:**

```typescript
const app = await client.spectrum.apps.create({
  zone_id: 'your-zone-id',
  protocol: 'tcp/3306',
  dns: { type: 'CNAME', name: 'db.example.com' },
  origin_direct: ['tcp://192.0.2.1:3306'],
  tls: 'strict', // Validates origin certificate
})
```

## Protocolo proxy

Encaminha o IP real do cliente para a origem. A origem deve suportar análise.

| Versão      | Protocolo | Caso de uso                                          |
| ----------- | --------- | ---------------------------------------------------- |
| `desligado` | -         | Origin não precisa de IP do cliente                  |
| `v1`        | TCP       | A maioria dos aplicativos TCP (SSH, bancos de dados) |
| `v2`        | TCP       | TCP de alto desempenho                               |
| `simples`   | UDP       | Aplicações UDP                                       |

**Compatibilidade:**

- **v1**: HAProxy, nginx, SSH, a maioria dos bancos de dados
- **v2**: HAProxy 1.5+, nginx 1.11+
- **simples**: formato UDP específico da Cloudflare

**Ativar:**

```typescript
const app = await client.spectrum.apps.create({
  // ...
  proxy_protocol: 'v1', // Origin must parse PROXY header
})
```

**Origin Config (nginx):**

```nginx
stream {
    server {
        listen 22 proxy_protocol;
        proxy_pass backend:22;
    }
}
```

## IP Access Rules

Enable `ip_firewall: true` then configure zone-level firewall rules.

```typescript
const app = await client.spectrum.apps.create({
  // ...
  ip_firewall: true, // Applies zone firewall rules
})
```

## Port Ranges (Enterprise Only)

```hcl
resource "cloudflare_spectrum_application" "game_cluster" {
  zone_id  = var.zone_id
  protocol = "tcp/25565-25575"

  dns {
    type = "CNAME"
    name = "games.example.com"
  }

  origin_direct = ["tcp://192.0.2.1"]

  origin_port {
    start = 25565
    end   = 25575
  }
}
```

## See Also

- [patterns.md](patterns.md) - Protocol-specific examples
- [api.md](api.md) - REST/SDK reference
