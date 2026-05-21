# Terraform: resolução de problemas e boas práticas

Problemas comuns, segurança e boas práticas.

## Problemas de drift de state

Alguns recursos têm drift de state conhecido. Adicione blocos `lifecycle` para evitar diffs perpétuos:

| Recurso                     | Atributos com drift                        | Contorno                                               |
| --------------------------- | ------------------------------------------ | ------------------------------------------------------ |
| `cloudflare_pages_project`  | `deployment_configs.*`                     | `ignore_changes = [deployment_configs]`                |
| `cloudflare_workers_script` | secrets retornam como REDACTED             | `ignore_changes = [secret_text_binding]`               |
| `cloudflare_load_balancer`  | `adaptive_routing`, `random_steering`      | `ignore_changes = [adaptive_routing, random_steering]` |
| `cloudflare_workers_kv`     | caracteres especiais nas chaves (< 5.16.0) | Atualize para 5.16.0+                                  |

```hcl
# Example: Ignore secret drift
resource "cloudflare_workers_script" "api" {
  account_id = var.account_id
  name = "api-worker"
  content = file("worker.js")
  secret_text_binding { name = "API_KEY"; text = var.api_key }

  lifecycle {
    ignore_changes = [secret_text_binding]
  }
}
```

## Breaking changes do v5

O provider v5 é o atual (gerado a partir de OpenAPI). De v4 para v5 há breaking changes:

**Renomeação de recursos:**

| Recurso v4                 | Recurso v5                  | Observações         |
| -------------------------- | --------------------------- | ------------------- |
| `cloudflare_record`        | `cloudflare_dns_record`     |                     |
| `cloudflare_worker_script` | `cloudflare_workers_script` | Atenção: plural     |
| `cloudflare_worker_*`      | `cloudflare_workers_*`      | Todos os workers    |
| `cloudflare_access_*`      | `cloudflare_zero_trust_*`   | Access → Zero Trust |

**Mudanças de atributo:**

| Atributo v4     | Atributo v5  | Recursos              |
| --------------- | ------------ | --------------------- |
| `zone`          | `name`       | zone                  |
| `account_id`    | `account.id` | zone (sintaxe objeto) |
| `key`           | `key_name`   | KV                    |
| `location_hint` | `location`   | R2                    |

**Migração de state:**

```bash
# Rename resources in state after v5 upgrade
terraform state mv cloudflare_record.example cloudflare_dns_record.example
terraform state mv cloudflare_worker_script.api cloudflare_workers_script.api
```

## Armadilhas por recurso

### Localização R2 e maiúsculas

**Problema:** Terraform cria o bucket R2 mas falha em applies seguintes  
**Causa:** a localização deve estar em MAIÚSCULAS  
**Solução:** use `WNAM`, `ENAM`, `WEUR`, `EEUR`, `APAC` (não `wnam`, `enam`, etc.)

```hcl
resource "cloudflare_r2_bucket" "assets" {
  account_id = var.account_id
  name = "assets"
  location = "WNAM"  # UPPERCASE required
}
```

### Caracteres especiais no KV (< 5.16.0)

**Problema:** chaves com `+`, `#`, `%` causam problemas de encoding  
**Causa:** bug de URL encoding no provider < 5.16.0  
**Solução:** atualize para 5.16.0+ ou evite caracteres especiais nas chaves

### Migrações D1

**Problema:** Terraform cria o banco mas o schema está vazio  
**Causa:** Terraform só cria o recurso D1, não o schema  
**Solução:** rode migrações via wrangler após o apply do Terraform

```bash
# After terraform apply
wrangler d1 migrations apply <db-name>
```

### Limite de tamanho do Worker

**Problema:** deploy do Worker falha com "script too large"  
**Causa:** script + dependências excedem o limite de 10 MB  
**Solução:** code splitting, dependências externas ou minificação

### Drift em Pages

**Problema:** projeto Pages mostra diff perpétuo em `deployment_configs`  
**Causa:** a API adiciona valores padrão que não estão no state  
**Solução:** adicione `lifecycle` ignore (veja tabela de drift acima)

## Erros comuns

### "Error: couldn't find resource"

**Causa:** recurso removido fora do Terraform  
**Solução:** importe de volta com `terraform import cloudflare_zone.example <zone-id>` ou remova do state com `terraform state rm cloudflare_zone.example`

### "409 Conflict on worker deployment"

**Causa:** Worker implantado ao mesmo tempo pelo Terraform e pelo wrangler  
**Solução:** escolha um método; com Terraform, remova deploys do wrangler

### "DNS record already exists"

**Causa:** registro DNS existente não importado no state  
**Solução:** obtenha o ID no dashboard e importe com `terraform import cloudflare_dns_record.example <zone-id>/<record-id>`

### "Invalid provider configuration"

**Causa:** token de API ausente, inválido ou sem permissões  
**Solução:** defina `CLOUDFLARE_API_TOKEN` ou verifique permissões no dashboard

### "State locking errors"

**Causa:** vários `terraform` simultâneos ou lock antigo de processo encerrado  
**Solução:** remova lock com `terraform force-unlock <lock-id>` (use com cuidado)

## Limites

| Recurso                 | Limite           | Observações                                  |
| ----------------------- | ---------------- | -------------------------------------------- |
| Rate limit token API    | Varia por plano  | Use `api_client_logging = true` para depurar |
| Tamanho do script       | 10 MB            | Inclui dependências                          |
| Chaves KV por namespace | Ilimitado        | Paga por operação                            |
| Armazenamento R2        | Ilimitado        | Paga por GB                                  |
| Bancos D1               | 50.000 por conta | Grátis: 10                                   |
| Projetos Pages          | 500 por conta    | Grátis: 100                                  |
| Registros DNS           | 3.500 por zona   | Plano gratuito                               |

## Ver também

- [README](./README.md) — Configuração do provider
- [Configuration](./configuration.md) — Recursos
- [API](./api.md) — Data sources
- [Patterns](./patterns.md) — Casos de uso
- Documentação do provider: https://registry.terraform.io/providers/cloudflare/cloudflare/latest/docs

Documentação localizada no ecossistema mantido pelo Controllato Club.
