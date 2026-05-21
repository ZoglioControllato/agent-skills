# Provedor Terraform da Cloudflare

**Guia para o Cloudflare Terraform Provider — infraestrutura como código para recursos Cloudflare.**

## Princípios centrais

- **Provider primeiro**: use o provedor Terraform para TODA a infraestrutura — não misture com wrangler.jsonc para os mesmos recursos
- **Gestão de state**: use sempre state remoto (S3, Terraform Cloud, etc.) em ambientes de equipe
- **Arquitetura modular**: crie módulos reutilizáveis para padrões comuns (zonas, workers, pages)
- **Versão fixa**: fixe a versão do provider com `~>` para upgrades previsíveis
- **Gestão de segredos**: use variáveis + variáveis de ambiente para dados sensíveis — nunca hardcode tokens de API

## Versão do provider

| Versão | Status | Observações                                                   |
| ------ | ------ | ------------------------------------------------------------- |
| 5.x    | Atual  | Gerado a partir de OpenAPI; breaking changes em relação ao v4 |
| 4.x    | Legado | Manutenção manual, em desuso                                  |

**Crítico:** o v5 renomeou muitos recursos (`cloudflare_record` → `cloudflare_dns_record`, `cloudflare_worker_*` → `cloudflare_workers_*`). Veja [gotchas.md](./gotchas.md#v5-breaking-changes) para migrar.

## Configuração do provider

### Configuração básica

```hcl
terraform {
  required_version = ">= 1.0"

  required_providers {
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 5.15.0"
    }
  }
}

provider "cloudflare" {
  api_token = var.cloudflare_api_token  # or CLOUDFLARE_API_TOKEN env var
}
```

### Métodos de autenticação (ordem de prioridade)

1. **Token de API** (RECOMENDADO): `api_token` ou `CLOUDFLARE_API_TOKEN`
   - Criação: Dashboard → My Profile → API Tokens
   - Escopo por contas/zonas específicas
2. **Global API Key** (LEGADO): `api_key` + `api_email` ou `CLOUDFLARE_API_KEY` + `CLOUDFLARE_EMAIL`
   - Menos seguro; prefira tokens
3. **User Service Key**: `user_service_key` para certificados Origin CA

## Referência rápida: comandos comuns

```bash
terraform init          # Initialize provider
terraform plan          # Plan changes
terraform apply         # Apply changes
terraform destroy       # Destroy resources
terraform import cloudflare_zone.example <zone-id>  # Import existing
terraform state list    # List resources in state
terraform output        # Show outputs
terraform fmt -recursive  # Format code
terraform validate      # Validate configuration
```

## Importar recursos existentes

Use cf-terraforming para gerar configs a partir de recursos Cloudflare existentes:

```bash
# Install
brew install cloudflare/cloudflare/cf-terraforming

# Generate HCL from existing resources
cf-terraforming generate --resource-type cloudflare_dns_record --zone <zone-id>

# Import into Terraform state
cf-terraforming import --resource-type cloudflare_dns_record --zone <zone-id>
```

## Ordem de leitura

1. Comece por [README.md](./README.md) para setup e autenticação
2. Revise [configuration.md](./configuration.md) para configurações de recursos
3. Consulte [api.md](./api.md) para data sources e consultas
4. Veja [patterns.md](./patterns.md) para multiambiente e CI/CD
5. Leia [gotchas.md](./gotchas.md) para drift de state, breaking changes v5 e resolução de problemas

## Nesta referência

- [configuration.md](./configuration.md) — Recursos para zonas, DNS, workers, KV, R2, D1, Pages, rulesets
- [api.md](./api.md) — Data sources para recursos existentes
- [patterns.md](./patterns.md) — Padrões de arquitetura, multiambiente, integração CI/CD
- [gotchas.md](./gotchas.md) — Problemas comuns, segurança, boas práticas

## Ver também

- [pulumi](../pulumi/) — Ferramenta IaC alternativa para Cloudflare
- [wrangler](../wrangler/) — Alternativa de deploy via CLI
- [workers](../workers/) — Documentação do runtime dos Workers

Documentação localizada no ecossistema mantido pelo Controllato Club.
