# Padrões Terraform e casos de uso

Padrões de arquitetura, ambientes múltiplos e casos reais.

## Estrutura de diretórios recomendada

```
terraform/
├── environments/
│   ├── production/
│   │   ├── main.tf
│   │   └── terraform.tfvars
│   └── staging/
│       ├── main.tf
│       └── terraform.tfvars
├── modules/
│   ├── zone/
│   ├── worker/
│   └── dns/
└── shared/          # Shared resources across envs
    └── main.tf
```

**Obs.:** A Cloudflare recomenda evitar módulos para recursos do provider devido à complexidade da geração automática no v5. Prefira diretórios de ambiente + state compartilhado.

## Configuração multiambiente

```hcl
# Directory: environments/{production,staging}/main.tf + modules/{zone,worker,pages}
module "zone" {
  source = "../../modules/zone"; account_id = var.account_id; zone_name = "example.com"; environment = "production"
}
module "api_worker" {
  source = "../../modules/worker"; account_id = var.account_id; zone_id = module.zone.zone_id
  name = "api-worker-prod"; script = file("../../workers/api.js"); environment = "production"
}
```

## Backend de state no R2

```hcl
terraform {
  backend "s3" {
    bucket = "terraform-state"
    key = "cloudflare.tfstate"
    region = "auto"
    endpoints = { s3 = "https://<account_id>.r2.cloudflarestorage.com" }
    skip_credentials_validation = true
    skip_region_validation = true
    skip_requesting_account_id = true
    skip_metadata_api_check = true
    skip_s3_checksum = true
  }
}
```

## Worker com todos os bindings

```hcl
locals { worker_name = "full-stack-worker" }
resource "cloudflare_workers_kv_namespace" "app" { account_id = var.account_id; title = "${local.worker_name}-kv" }
resource "cloudflare_r2_bucket" "app" { account_id = var.account_id; name = "${local.worker_name}-bucket" }
resource "cloudflare_d1_database" "app" { account_id = var.account_id; name = "${local.worker_name}-db" }

resource "cloudflare_worker_script" "app" {
  account_id = var.account_id; name = local.worker_name; content = file("worker.js"); module = true
  compatibility_date = "2025-01-01"
  kv_namespace_binding { name = "KV"; namespace_id = cloudflare_workers_kv_namespace.app.id }
  r2_bucket_binding { name = "BUCKET"; bucket_name = cloudflare_r2_bucket.app.name }
  d1_database_binding { name = "DB"; database_id = cloudflare_d1_database.app.id }
  secret_text_binding { name = "API_KEY"; text = var.api_key }
}
```

## Integração com Wrangler

**CRÍTICO**: Wrangler e Terraform não devem gerenciar os mesmos recursos.

**Terraform**: zonas, DNS, regras de segurança, Access, load balancers, deploys de Worker (CI/CD), criação de KV/R2/D1  
**Wrangler**: dev local (`wrangler dev`), deploys manuais, migrações D1, operações em massa no KV, streaming de logs (`wrangler tail`)

### Padrão CI/CD

```hcl
# Terraform creates infrastructure
resource "cloudflare_workers_kv_namespace" "app" { account_id = var.account_id; title = "app-kv" }
resource "cloudflare_d1_database" "app" { account_id = var.account_id; name = "app-db" }
output "kv_namespace_id" { value = cloudflare_workers_kv_namespace.app.id }
output "d1_database_id" { value = cloudflare_d1_database.app.id }
```

```yaml
# GitHub Actions: terraform apply → envsubst wrangler.jsonc.template → wrangler deploy
- run: terraform apply -auto-approve
- run: |
    export KV_NAMESPACE_ID=$(terraform output -raw kv_namespace_id)
    envsubst < wrangler.jsonc.template > wrangler.jsonc
- run: wrangler deploy
```

## Casos de uso

### Site estático + API Worker

```hcl
resource "cloudflare_pages_project" "frontend" {
  account_id = var.account_id; name = "frontend"; production_branch = "main"
  build_config { build_command = "npm run build"; destination_dir = "dist" }
}
resource "cloudflare_worker_script" "api" {
  account_id = var.account_id; name = "api"; content = file("api-worker.js")
  d1_database_binding { name = "DB"; database_id = cloudflare_d1_database.api_db.id }
}
resource "cloudflare_dns_record" "frontend" {
  zone_id = cloudflare_zone.main.id; name = "app"; content = cloudflare_pages_project.frontend.subdomain; type = "CNAME"; proxied = true
}
resource "cloudflare_worker_route" "api" {
  zone_id = cloudflare_zone.main.id; pattern = "api.example.com/*"; script_name = cloudflare_worker_script.api.name
}
```

### Load balancing multi-região

```hcl
resource "cloudflare_load_balancer_pool" "us" {
  account_id = var.account_id; name = "us-pool"; monitor = cloudflare_load_balancer_monitor.http.id
  origins { name = "us-east"; address = var.us_east_ip }
}
resource "cloudflare_load_balancer_pool" "eu" {
  account_id = var.account_id; name = "eu-pool"; monitor = cloudflare_load_balancer_monitor.http.id
  origins { name = "eu-west"; address = var.eu_west_ip }
}
resource "cloudflare_load_balancer" "global" {
  zone_id = cloudflare_zone.main.id; name = "api.example.com"; steering_policy = "geo"
  default_pool_ids = [cloudflare_load_balancer_pool.us.id]
  region_pools { region = "WNAM"; pool_ids = [cloudflare_load_balancer_pool.us.id] }
  region_pools { region = "WEU"; pool_ids = [cloudflare_load_balancer_pool.eu.id] }
}
```

### Admin seguro com Access

```hcl
resource "cloudflare_pages_project" "admin" { account_id = var.account_id; name = "admin"; production_branch = "main" }
resource "cloudflare_access_application" "admin" {
  account_id = var.account_id; name = "Admin"; domain = "admin.example.com"; type = "self_hosted"; session_duration = "24h"
  allowed_idps = [cloudflare_access_identity_provider.google.id]
}
resource "cloudflare_access_policy" "allow" {
  account_id = var.account_id; application_id = cloudflare_access_application.admin.id
  name = "Allow admins"; decision = "allow"; precedence = 1; include { email = var.admin_emails }
}
```

### Módulo reutilizável

```hcl
# modules/cloudflare-zone/main.tf
variable "account_id" { type = string }; variable "domain" { type = string }; variable "ssl_mode" { default = "strict" }
resource "cloudflare_zone" "main" { account = { id = var.account_id }; name = var.domain }
resource "cloudflare_zone_settings_override" "main" {
  zone_id = cloudflare_zone.main.id; settings { ssl = var.ssl_mode; always_use_https = "on" }
}
output "zone_id" { value = cloudflare_zone.main.id }

# Usage: module "prod" { source = "./modules/cloudflare-zone"; account_id = var.account_id; domain = "example.com" }
```

## Ver também

- [README](./README.md) — Configuração do provider
- [Configuration Reference](./configuration.md) — Tipos de recurso
- [API Reference](./api.md) — Data sources
- [Troubleshooting](./gotchas.md) — Boas práticas e problemas comuns

Documentação localizada no ecossistema mantido pelo Controllato Club.
