#Configuração

## Configuração do Wrangler

### Encadernação Básica

**wrangler.jsonc**:```jsonc
{
"secrets_store_secrets": [
{
"binding": "API_KEY",
"store_id": "abc123",
"secret_name": "stripe_api_key",
},
],
}

````

**wrangler.toml** (alternativa):```toml
[[secrets_store_secrets]]
binding = "API_KEY"
store_id = "abc123"
secret_name = "stripe_api_key"
````

Campos:

- `binding`: Nome da variável para acesso `env`
- `store_id`: Da `lista de lojas da loja de segredos do wrangler`
- `secret_name`: Identificador (sem espaços)

### Específico do ambiente

**wrangler.jsonc**:```jsonc
{
"env": {
"production": {
"secrets_store_secrets": [
{
"binding": "API_KEY",
"store_id": "prod-store",
"secret_name": "prod_api_key",
},
],
},
"staging": {
"secrets_store_secrets": [
{
"binding": "API_KEY",
"store_id": "staging-store",
"secret_name": "staging_api_key",
},
],
},
},
}

````

**wrangler.toml** (alternativa):```toml
[env.production]
[[env.production.secrets_store_secrets]]
binding = "API_KEY"
store_id = "prod-store"
secret_name = "prod_api_key"

[env.staging]
[[env.staging.secrets_store_secrets]]
binding = "API_KEY"
store_id = "staging-store"
secret_name = "staging_api_key"
````

## Comandos do Wrangler

### Gerenciamento de loja```bash

wrangler secrets-store store list
wrangler secrets-store store create my-store --remote
wrangler secrets-store store delete <store-id> --remote

````
### Gerenciamento Secreto (Produção)```bash
# Create (interactive)
wrangler secrets-store secret create <store-id> \
  --name MY_SECRET --scopes workers --remote

# Create (piped)
cat secret.txt | wrangler secrets-store secret create <store-id> \
  --name MY_SECRET --scopes workers --remote

# List/get/update/delete
wrangler secrets-store secret list <store-id> --remote
wrangler secrets-store secret get <store-id> --name MY_SECRET --remote
wrangler secrets-store secret update <store-id> --name MY_SECRET --new-value "val" --remote
wrangler secrets-store secret delete <store-id> --name MY_SECRET --remote

# Duplicate
wrangler secrets-store secret duplicate <store-id> \
  --name ORIG --new-name COPY --remote
````

### Desenvolvimento Local

**CRÍTICO**: Segredos de produção (`--remote`) NÃO acessíveis no desenvolvedor local.```bash

# Create local-only (no --remote)

wrangler secrets-store secret create <store-id> --name DEV_KEY --scopes workers

wrangler dev # Uses local secrets
wrangler deploy # Uses production secrets

````
Prática recomendada: nomes separados para local/prod:```jsonc
{
  "env": {
    "development": {
      "secrets_store_secrets": [{ "binding": "API_KEY", "store_id": "store", "secret_name": "dev_api_key" }],
    },
    "production": {
      "secrets_store_secrets": [{ "binding": "API_KEY", "store_id": "store", "secret_name": "prod_api_key" }],
    },
  },
}
````

## Painel

### Criando segredos

1. **Loja de segredos** → **Criar segredo**
2. Preencha: Nome (sem espaços), Valor, Escopo (`Workers`), Comentário
3. **Salvar** (valor oculto depois)

### Adicionando ligações

**Método 1**: Trabalhador → Configurações → Vinculações → Adicionar → Armazenamento de segredos
**Método 2**: crie um segredo diretamente no menu suspenso Configurações do trabalhador

Opções de implantação:

- **Implantação**: 100% imediato
- **Salvar versão**: lançamento gradual

## CI/CD

### Ações do GitHub```yaml

- name: Create secret
  env:
  CLOUDFLARE_API_TOKEN: ${{ secrets.CF_TOKEN }}
  run: |
    echo "${{ secrets.API_KEY }}" | \
   npx wrangler secrets-store secret create $STORE_ID \
   --name API_KEY --scopes workers --remote

- name: Deploy
  run: npx wrangler deploy

````
### NO GitLab```yaml
script:
  - echo "$API_KEY_VALUE" | npx wrangler secrets-store secret create $STORE_ID --name API_KEY --scopes workers --remote
  - npx wrangler deploy
````

Consulte: [api.md](./api.md), [patterns.md](./patterns.md)
