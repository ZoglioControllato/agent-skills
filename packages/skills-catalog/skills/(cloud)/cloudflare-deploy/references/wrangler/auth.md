# Autenticação

Autentique-se na Cloudflare antes de publicar Workers ou Pages.

## Árvore de decisão rápida

```
Need to authenticate?
├─ Interactive/local dev → wrangler login (recommended)
├─ CI/CD or headless → CLOUDFLARE_API_TOKEN env var
└─ Terraform/Pulumi → See respective references
```

## wrangler login (recomendado)

Fluxo OAuth único para desenvolvimento local:

```bash
npx wrangler login     # Opens browser, completes OAuth
npx wrangler whoami    # Verify: shows email + account ID
```

Credenciais armazenadas localmente. Vale para todos os comandos seguintes.

## Token de API (CI/CD)

Para pipelines automatizados ou ambientes sem acesso a navegador:

1. Acesse: **https://dash.cloudflare.com/profile/api-tokens**
2. Clique em **Create Token**
3. Use o modelo: **"Edit Cloudflare Workers"** (cobre Workers, Pages, KV, D1, R2)
4. Copie o token (mostrado apenas uma vez)
5. Defina a variável de ambiente:

```bash
export CLOUDFLARE_API_TOKEN="your-token-here"
```

### Permissões mínimas por tarefa

| Tarefa                 | Modelo / permissões                                        |
| ---------------------- | ---------------------------------------------------------- |
| Publicar Workers/Pages | Modelo "Edit Cloudflare Workers"                           |
| Somente leitura        | Modelo "Read All Resources"                                |
| Escopo customizado     | Account:Read + Workers Scripts:Edit + recursos específicos |

## Resolução de problemas

| Erro                           | Causa                            | Correção                                                                 |
| ------------------------------ | -------------------------------- | ------------------------------------------------------------------------ |
| "Not logged in"                | Sem credenciais                  | `wrangler login` ou defina `CLOUDFLARE_API_TOKEN`                        |
| "Authentication error"         | Token inválido/expirado          | Gere novo token no dashboard                                             |
| "Missing account"              | Conta errada selecionada         | `wrangler whoami` para conferir; adicione `account_id` ao wrangler.jsonc |
| Token funciona local, falha CI | Token com escopo de conta errado | Verifique se o ID da conta coincide nos dois lugares                     |
| "Insufficient permissions"     | Token sem escopo necessário      | Crie token novo com permissões corretas                                  |

## Verificar autenticação

```bash
npx wrangler whoami
```

A saída mostra:

- E-mail (se login OAuth)
- ID e nome da conta
- Escopos do token (se token de API)

Código de saída diferente de zero significa não autenticado.

## Ver também

- [terraform/README.md](../terraform/README.md) — Autenticação do provider Terraform
- [pulumi/README.md](../pulumi/README.md) — Autenticação do provider Pulumi

Documentação localizada no ecossistema mantido pelo Controllato Club.
