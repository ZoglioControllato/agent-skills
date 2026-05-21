---
name: vercel-deploy
description: Implanta aplicações e sites na Vercel. Use quando o usuário pedir ações de deploy como "deploy my app", "deploy and give me the link", "push this live" ou "create a preview deployment". NÃO use para implantar na Netlify, Cloudflare ou Render (use as skills respectivas).
metadata:
  author: github.com/openai/skills
  version: '1.0.0'
---

# Deploy na Vercel

Implante qualquer projeto na Vercel rapidamente. **Sempre faça deploy como preview** (não produção), salvo se o usuário pedir explicitamente produção.

## Pré-requisitos

- Se o sandbox bloquear chamadas de rede do deploy, rode novamente com `sandbox_permissions=require_escalated`.
- O deploy pode levar alguns minutos. Use timeouts adequados.

## Início rápido

**Execute isto (com timeout de 10 minutos):**

```bash
vercel deploy [path] -y
```

**Importante:** Use timeout de 10 minutos (600000 ms) no comando de deploy, pois builds podem demorar.

Se falhar com "No existing credentials found", use o método alternativo abaixo.

## Fallback (sem autenticação)

Se a CLI falhar por erro de auth, use o script de deploy:

```bash
# Deploy do diretório atual
bash scripts/deploy.sh

# Deploy de projeto específico
bash scripts/deploy.sh /path/to/project

# Deploy de tarball existente
bash scripts/deploy.sh /path/to/project.tgz
```

O script faz detecção de framework, empacotamento e deploy. Aguarda o fim do build e devolve JSON com `previewUrl` e `claimUrl`.

**Diga ao usuário:** "Seu deploy está em [previewUrl]. Reivindique em [claimUrl] para gerenciar o deployment."

## Deploys em produção

Somente se o usuário pedir explicitamente:

```bash
vercel deploy [path] --prod -y
```

## Saída

Mostre ao usuário a URL do deployment. Para deploy pelo fallback, mostre também a claim URL.

**Não** use curl nem fetch na URL implantada para verificar se funciona. Apenas devolva o link.

## Solução de problemas

### Rede com permissões elevadas

Se o deploy falhar por rede (timeouts, DNS, resets), rode novamente com permissões elevadas (`sandbox_permissions=require_escalated`). O deploy precisa de rede elevada quando o sandbox bloqueia saída.

Orientação de exemplo ao usuário:

```
The deploy needs escalated network access to deploy to Vercel. I can rerun the command with escalated permissions—want me to proceed?
```
