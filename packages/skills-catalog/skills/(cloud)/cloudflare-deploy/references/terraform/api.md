# Referência de data sources Terraform

Consulte recursos Cloudflare existentes para referenciar nas configurações.

## Nomes de data source no v5

| Nome v4                    | Nome v5                     | Observações         |
| -------------------------- | --------------------------- | ------------------- |
| `cloudflare_record`        | `cloudflare_dns_record`     |                     |
| `cloudflare_worker_script` | `cloudflare_workers_script` | Atenção: plural     |
| `cloudflare_access_*`      | `cloudflare_zero_trust_*`   | Access → Zero Trust |

## Data sources de zona

```hcl
# Get zone by name
data "cloudflare_zone" "example" {
  name = "example.com"
}

# Use in resources
resource "cloudflare_dns_record" "www" {
  zone_id = data.cloudflare_zone.example.id
  name = "www"
  # ...
}
```

## Data sources de conta

```hcl
# List all accounts
data "cloudflare_accounts" "main" {
  name = "My Account"
}

# Use account ID
resource "cloudflare_worker_script" "api" {
  account_id = data.cloudflare_accounts.main.accounts[0].id
  # ...
}
```

## Data sources de Worker

```hcl
# Get existing worker script (v5: cloudflare_workers_script)
data "cloudflare_workers_script" "existing" {
  account_id = var.account_id
  name = "existing-worker"
}

# Reference in service bindings
resource "cloudflare_workers_script" "consumer" {
  service_binding {
    name = "UPSTREAM"
    service = data.cloudflare_workers_script.existing.name
  }
}
```

## Data sources de KV

```hcl
# Get KV namespace
data "cloudflare_workers_kv_namespace" "existing" {
  account_id = var.account_id
  namespace_id = "abc123"
}

# Use in worker binding
resource "cloudflare_workers_script" "api" {
  kv_namespace_binding {
    name = "KV"
    namespace_id = data.cloudflare_workers_kv_namespace.existing.id
  }
}
```

## Data source de listas

```hcl
# Get IP lists for WAF rules
data "cloudflare_list" "blocked_ips" {
  account_id = var.account_id
  name = "blocked_ips"
}
```

## Data source de intervalos IP

```hcl
# Get Cloudflare IP ranges (for firewall rules)
data "cloudflare_ip_ranges" "cloudflare" {}

output "ipv4_cidrs" {
  value = data.cloudflare_ip_ranges.cloudflare.ipv4_cidr_blocks
}

output "ipv6_cidrs" {
  value = data.cloudflare_ip_ranges.cloudflare.ipv6_cidr_blocks
}

# Use in security group rules (AWS example)
resource "aws_security_group_rule" "allow_cloudflare" {
  type = "ingress"
  from_port = 443
  to_port = 443
  protocol = "tcp"
  cidr_blocks = data.cloudflare_ip_ranges.cloudflare.ipv4_cidr_blocks
  security_group_id = aws_security_group.web.id
}
```

## Padrões comuns

### Formatos de ID de import

| Recurso                           | Formato do import ID          |
| --------------------------------- | ----------------------------- |
| `cloudflare_zone`                 | `<zone-id>`                   |
| `cloudflare_dns_record`           | `<zone-id>/<record-id>`       |
| `cloudflare_workers_script`       | `<account-id>/<script-name>`  |
| `cloudflare_workers_kv_namespace` | `<account-id>/<namespace-id>` |
| `cloudflare_r2_bucket`            | `<account-id>/<bucket-name>`  |
| `cloudflare_d1_database`          | `<account-id>/<database-id>`  |
| `cloudflare_pages_project`        | `<account-id>/<project-name>` |

```bash
# Example: Import DNS record
terraform import cloudflare_dns_record.example <zone-id>/<record-id>
```

### Referência entre módulos

```hcl
# modules/worker/main.tf
data "cloudflare_zone" "main" {
  name = var.domain
}

resource "cloudflare_worker_route" "api" {
  zone_id = data.cloudflare_zone.main.id
  pattern = "api.${var.domain}/*"
  script_name = cloudflare_worker_script.api.name
}
```

### Exportar valores importantes

```hcl
output "zone_id" {
  value = cloudflare_zone.main.id
  description = "Zone ID for DNS management"
}

output "worker_url" {
  value = "https://${cloudflare_worker_domain.api.hostname}"
  description = "Worker API endpoint"
}

output "kv_namespace_id" {
  value = cloudflare_workers_kv_namespace.app.id
  sensitive = false
}

output "name_servers" {
  value = cloudflare_zone.main.name_servers
  description = "Name servers for domain registration"
}
```

## Ver também

- [README](./README.md) — Configuração do provider
- [Configuration Reference](./configuration.md) — Tipos de recurso
- [Patterns](./patterns.md) — Padrões de arquitetura
- [Troubleshooting](./gotchas.md) — Problemas comuns

Documentação localizada no ecossistema mantido pelo Controllato Club.
