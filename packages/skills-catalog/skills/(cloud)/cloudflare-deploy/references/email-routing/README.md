# Referência de habilidade de roteamento de e-mail da Cloudflare

## Visão geral

O Cloudflare Email Routing permite endereços de e-mail personalizados para o seu domínio que roteiam para endereços de destino verificados. É gratuito, focado na privacidade (sem armazenamento/acesso) e inclui Email Workers para processamento programático de e-mail.

**Disponível para todos os clientes da Cloudflare que usam a Cloudflare como servidor de nomes oficial.**

## Início rápido```typescript

// Basic email handler
export default {
async email(message, env, ctx) {
// CRITICAL: Must consume stream before response
const parser = new PostalMime.default()
const email = await parser.parse(await message.raw.arrayBuffer())

    // Process email
    console.log(`From: ${message.from}, Subject: ${email.subject}`)

    // Forward or reject
    await message.forward('verified@destination.com')

},
} satisfies ExportedHandler<Env>

```

## Reading Order

**Start here based on your goal:**

1. **New to Email Routing?** → [configuration.md](configuration.md) → [patterns.md](patterns.md)
2. **Adding Workers?** → [api.md](api.md) § Worker Runtime API → [patterns.md](patterns.md)
3. **Sending emails?** → [api.md](api.md) § SendEmail Binding
4. **Managing via API?** → [api.md](api.md) § REST API Operations
5. **Debugging issues?** → [gotchas.md](gotchas.md)

## Decision Tree

```

Precisa receber e-mails?
├─ Apenas encaminhamento simples? → Regras do painel (configuration.md)
├─ Lógica/filtragem complexa? → Trabalhadores de e-mail (api.md + padrões.md)
└─ Analisar anexos/corpo? → biblioteca postal-mime (patterns.md § Analisar Email)

Precisa enviar e-mails?
├─ Do Trabalhador? → Vinculação SendEmail (api.md § SendEmail)
└─ De aplicativo externo? → Usar serviço SMTP/API externo

Está tendo problemas?
├─ O e-mail não chega? → gotchas.md § Autenticação de correio
├─ Trabalhador batendo? → gotchas.md § Consumo de fluxo
└─ Falha no avanço? → gotchas.md § Verificação de destino

````
## Conceitos-chave

**Regras de roteamento**: encaminhamento baseado em padrão configurado via Dashboard/API. Simples, mas limitado.

**E-mail Workers**: manipuladores TypeScript personalizados com acesso total a e-mail. Lida com lógica complexa, análise, armazenamento e rejeição.

**SendEmail Binding**: API de e-mail de saída para trabalhadores. Apenas e-mail transacional (sem marketing/em massa).

**ForwardableEmailMessage**: Interface de tempo de execução para e-mails recebidos. Fornece cabeçalhos, fluxo bruto, métodos de encaminhamento/rejeição.

## Nesta referência

- **[configuration.md](configuration.md)** - Configuração, implantação, configuração do wrangler
- **[api.md](api.md)** - API REST + API de tempo de execução do trabalhador + tipos
- **[patterns.md](patterns.md)** - Padrões comuns com exemplos de trabalho
- **[gotchas.md](gotchas.md)** - Armadilhas críticas, solução de problemas, limites

## Arquitetura```
Internet → MX Records → Cloudflare Email Routing
                            ├─ Routing Rules (dashboard)
                            └─ Email Worker (your code)
                                ├─ Forward to destination
                                ├─ Reject with reason
                                ├─ Store in R2/KV/D1
                                └─ Send outbound (SendEmail)
````

## See Also

- [Cloudflare Docs: Email Routing](https://developers.cloudflare.com/email-routing/)
- [Cloudflare Docs: Email Workers](https://developers.cloudflare.com/email-routing/email-workers/)
- [postal-mime npm package](https://www.npmjs.com/package/postal-mime)
