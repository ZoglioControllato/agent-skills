# Configuração de trabalhadores de e-mail

## wrangler.jsonc

```jsonc
{
  "name": "email-worker",
  "main": "src/index.ts",
  "compatibility_date": "2025-01-27",
  "send_email": [
    { "name": "EMAIL" }, // Unrestricted
    { "name": "EMAIL_LOGS", "destination_address": "logs@example.com" }, // Single dest
    { "name": "EMAIL_TEAM", "allowed_destination_addresses": ["a@ex.com", "b@ex.com"] },
    { "name": "EMAIL_NOREPLY", "allowed_sender_addresses": ["noreply@ex.com"] },
  ],
  "kv_namespaces": [{ "binding": "ARCHIVE", "id": "xxx" }],
  "r2_buckets": [{ "binding": "ATTACHMENTS", "bucket_name": "email-attachments" }],
  "vars": { "WEBHOOK_URL": "https://hooks.example.com" },
}
```

##Tipos TypeScript

```typescript
interface Env {
  EMAIL: SendEmail
  ARCHIVE: KVNamespace
  ATTACHMENTS: R2Bucket
  WEBHOOK_URL: string
}

export default {
  async email(message: ForwardableEmailMessage, env: Env, ctx: ExecutionContext) {},
}
```

##Dependências

````bash
npm install postal-mime mimetext
npm install -D @cloudflare/workers-types wrangler typescript
```Use postal-mime v2.x, mimetext v3.x.

## tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ES2022",
    "lib": ["ES2022"],
    "types": ["@cloudflare/workers-types"],
    "moduleResolution": "bundler",
    "strict": true
  }
}
````

##Desenvolvimento Local

````bash
npx wrangler dev

# Test receiving
curl --request POST 'http://localhost:8787/cdn-cgi/handler/email' \
  --url-query 'from=sender@example.com' --url-query 'to=recipient@example.com' \
  --header 'Content-Type: text/plain' --data-raw 'Subject: Test\n\nHello'
```Os e-mails enviados são gravados em arquivos `.eml` locais.

## Lista de verificação de implantação

- [] Habilitar roteamento de e-mail no painel
- [] Verifique os endereços de destino
- [] Configurar DMARC/SPF/DKIM para envio
- [] Crie recursos KV/R2 se necessário
- [] Atualizar wrangler.jsonc com IDs de produção
```bash
npx wrangler deploy
npx wrangler deployments list
````

##Configuração do painel

1. **Roteamento de e-mail:** Domínio → E-mail → Ativar roteamento de e-mail
2. **Verificar endereços:** E-mail → Endereços de destino → Adicionar e verificar
3. **Bind Worker:** Email → Email Workers → Criar rota → Selecionar padrão e Worker
4. **DMARC:** Adicione TXT `_dmarc.domain.com`: `v=DMARC1; p=quarentena;`

## Segredos

```bash
npx wrangler secret put API_KEY
# Access: env.API_KEY
```

##Monitoramento

```bash
npx wrangler tail
npx wrangler tail --status error
npx wrangler tail --format json
```

##Solução de problemas

| Erro                        | Correção                                               |
| --------------------------- | ------------------------------------------------------ |
| "Vinculação não encontrada" | Verifique se o nome `send_email` corresponde ao código |
| "Destino inválido"          | Verifique no painel de roteamento de e-mail            |
| Erros de tipo               | Instale `@cloudflare/workers-types`                    |
