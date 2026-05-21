---
name: cloudflare-deploy
description: Implanta aplicações e infraestrutura na Cloudflare usando Workers, Pages e serviços relacionados da plataforma. Use quando o usuário pedir para implantar, hospedar, publicar ou configurar um projeto na Cloudflare. NÃO use para implantar na Vercel, Netlify ou Render (use as skills respectivas).
metadata:
  author: github.com/openai/skills
  version: '1.0.0'
---

# Deploy na Cloudflare

Skill consolidada para construir na plataforma Cloudflare. Use as árvores de decisão abaixo para achar o produto certo e carregue referências detalhadas.

## Pré-requisitos

- Se o sandbox bloquear chamadas de rede do deploy, rode novamente com `sandbox_permissions=require_escalated`.
- O deploy pode levar alguns minutos. Use timeouts adequados.

## Autenticação (obrigatória antes do deploy)

Confirme autenticação antes de `wrangler deploy`, `wrangler pages deploy` ou `npm run deploy`:

```bash
npx wrangler whoami    # Shows account if authenticated
```

Sem autenticação? → `references/wrangler/auth.md`

- Interativo/local: `wrangler login` (OAuth único)
- CI/CD: defina a variável de ambiente `CLOUDFLARE_API_TOKEN`

## Árvores de decisão rápidas

### "Preciso executar código"

```
Precisa executar código?
├─ Funções serverless na edge → workers/
├─ App web full-stack com deploy Git → pages/
├─ Coordenação com estado / tempo real → durable-objects/
├─ Jobs longos multi-etapa → workflows/
├─ Executar containers → containers/
├─ Multi-tenant (clientes implantam código) → workers-for-platforms/
├─ Tarefas agendadas (cron) → cron-triggers/
├─ Lógica leve na edge (modificar HTTP) → snippets/
├─ Processar eventos de execução do Worker (logs/observabilidade) → tail-workers/
└─ Otimizar latência para infra backend → smart-placement/
```

### "Preciso armazenar dados"

```
Precisa armazenamento?
├─ Chave-valor (config, sessões, cache) → kv/
├─ SQL relacional → d1/ (SQLite) ou hyperdrive/ (Postgres/MySQL existente)
├─ Armazenamento de objetos/arquivos (compatível S3) → r2/
├─ Fila de mensagens (processamento assíncrono) → queues/
├─ Embeddings vetoriais (IA/busca semântica) → vectorize/
├─ Estado forte por entidade → durable-objects/ (armazenamento DO)
├─ Gestão de secrets → secrets-store/
├─ ETL streaming para R2 → pipelines/
└─ Cache persistente (retenção longa) → cache-reserve/
```

### "Preciso de IA/ML"

```
Precisa de IA?
├─ Inferência (LLMs, embeddings, imagens) → workers-ai/
├─ Banco vetorial para RAG/busca → vectorize/
├─ Agentes de IA com estado → agents-sdk/
├─ Gateway para qualquer provedor de IA (cache, roteamento) → ai-gateway/
└─ Widget de busca com IA → ai-search/
```

### "Preciso de rede/conectividade"

```
Precisa de rede?
├─ Expor serviço local à internet → tunnel/
├─ Proxy TCP/UDP (não HTTP) → spectrum/
├─ Servidor WebRTC TURN → turn/
├─ Conectividade de rede privada → network-interconnect/
├─ Otimizar roteamento → argo-smart-routing/
├─ Otimizar latência para backend (não usuário) → smart-placement/
└─ Vídeo/áudio em tempo real → realtimekit/ ou realtime-sfu/
```

### "Preciso de segurança"

```
Precisa de segurança?
├─ Web Application Firewall → waf/
├─ Proteção DDoS → ddos/
├─ Detecção/gestão de bots → bot-management/
├─ Proteção de API → api-shield/
├─ Alternativa a CAPTCHA → turnstile/
└─ Detecção de vazamento de credenciais → waf/ (managed ruleset)
```

### "Preciso de mídia/conteúdo"

```
Precisa de mídia?
├─ Otimização/transformação de imagens → images/
├─ Streaming/encoding de vídeo → stream/
├─ Automação de browser/screenshots → browser-rendering/
└─ Gestão de scripts de terceiros → zaraz/
```

### "Preciso de infrastructure-as-code"

```
Precisa IaC? → pulumi/ (Pulumi), terraform/ (Terraform) ou api/ (REST API)
```

## Índice de produtos

### Compute e runtime

| Produto               | Referência                          |
| --------------------- | ----------------------------------- |
| Workers               | `references/workers/`               |
| Pages                 | `references/pages/`                 |
| Pages Functions       | `references/pages-functions/`       |
| Durable Objects       | `references/durable-objects/`       |
| Workflows             | `references/workflows/`             |
| Containers            | `references/containers/`            |
| Workers for Platforms | `references/workers-for-platforms/` |
| Cron Triggers         | `references/cron-triggers/`         |
| Tail Workers          | `references/tail-workers/`          |
| Snippets              | `references/snippets/`              |
| Smart Placement       | `references/smart-placement/`       |

### Armazenamento e dados

| Produto         | Referência                    |
| --------------- | ----------------------------- |
| KV              | `references/kv/`              |
| D1              | `references/d1/`              |
| R2              | `references/r2/`              |
| Queues          | `references/queues/`          |
| Hyperdrive      | `references/hyperdrive/`      |
| DO Storage      | `references/do-storage/`      |
| Secrets Store   | `references/secrets-store/`   |
| Pipelines       | `references/pipelines/`       |
| R2 Data Catalog | `references/r2-data-catalog/` |
| R2 SQL          | `references/r2-sql/`          |

### IA e machine learning

| Produto    | Referência               |
| ---------- | ------------------------ |
| Workers AI | `references/workers-ai/` |
| Vectorize  | `references/vectorize/`  |
| Agents SDK | `references/agents-sdk/` |
| AI Gateway | `references/ai-gateway/` |
| AI Search  | `references/ai-search/`  |

### Rede e conectividade

| Produto              | Referência                         |
| -------------------- | ---------------------------------- |
| Tunnel               | `references/tunnel/`               |
| Spectrum             | `references/spectrum/`             |
| TURN                 | `references/turn/`                 |
| Network Interconnect | `references/network-interconnect/` |
| Argo Smart Routing   | `references/argo-smart-routing/`   |
| Workers VPC          | `references/workers-vpc/`          |

### Segurança

| Produto         | Referência                   |
| --------------- | ---------------------------- |
| WAF             | `references/waf/`            |
| DDoS Protection | `references/ddos/`           |
| Bot Management  | `references/bot-management/` |
| API Shield      | `references/api-shield/`     |
| Turnstile       | `references/turnstile/`      |

### Mídia e conteúdo

| Produto           | Referência                      |
| ----------------- | ------------------------------- |
| Images            | `references/images/`            |
| Stream            | `references/stream/`            |
| Browser Rendering | `references/browser-rendering/` |
| Zaraz             | `references/zaraz/`             |

### Comunicação em tempo real

| Produto      | Referência                 |
| ------------ | -------------------------- |
| RealtimeKit  | `references/realtimekit/`  |
| Realtime SFU | `references/realtime-sfu/` |

### Ferramentas de desenvolvedor

| Produto            | Referência                       |
| ------------------ | -------------------------------- |
| Wrangler           | `references/wrangler/`           |
| Miniflare          | `references/miniflare/`          |
| C3                 | `references/c3/`                 |
| Observability      | `references/observability/`      |
| Analytics Engine   | `references/analytics-engine/`   |
| Web Analytics      | `references/web-analytics/`      |
| Sandbox            | `references/sandbox/`            |
| Workerd            | `references/workerd/`            |
| Workers Playground | `references/workers-playground/` |

### Infrastructure as Code

| Produto   | Referência              |
| --------- | ----------------------- |
| Pulumi    | `references/pulumi/`    |
| Terraform | `references/terraform/` |
| API       | `references/api/`       |

### Outros serviços

| Produto       | Referência                  |
| ------------- | --------------------------- |
| Email Routing | `references/email-routing/` |
| Email Workers | `references/email-workers/` |
| Static Assets | `references/static-assets/` |
| Bindings      | `references/bindings/`      |
| Cache Reserve | `references/cache-reserve/` |

## Solução de problemas

### Rede com permissões elevadas

Se o deploy falhar por problemas de rede (timeouts, DNS, resets), rode novamente com permissões elevadas (`sandbox_permissions=require_escalated`). O deploy precisa de rede elevada quando o sandbox bloqueia saída.

Orientação de exemplo ao usuário:

```
The deploy needs escalated network access to deploy to Cloudflare. I can rerun the command with escalated permissions—want me to proceed?
```
