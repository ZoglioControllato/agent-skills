---
name: shopify-developer
description: Referência completa de desenvolvimento Shopify — Liquid, temas OS 2.0, APIs GraphQL, Hydrogen, Functions e performance (API v2026-01). Use ao trabalhar com arquivos .liquid, construir temas ou apps Shopify, escrever consultas GraphQL, depurar erros Liquid, criar extensões de app, migrar de Scripts para Functions ou montar vitrines headless. Aciona em "Shopify", "template Liquid", "Hydrogen", "Storefront API", "desenvolvimento de tema", "Shopify Functions", "Polaris". NÃO use para plataformas de e-commerce que não sejam Shopify.
---

# Referência para desenvolvedores Shopify

Referência abrangente para desenvolvimento Shopify profissional — versão da API **2026-01**.

## Referência rápida

| Item            | Valor                                                               |
| --------------- | ------------------------------------------------------------------- |
| Versão da API   | `2026-01` (estável)                                                 |
| GraphQL Admin   | `POST https://{store}.myshopify.com/admin/api/2026-01/graphql.json` |
| Storefront API  | `POST https://{store}.myshopify.com/api/2026-01/graphql.json`       |
| Ajax API (tema) | `/cart.js`, `/cart/add.js`, `/cart/change.js`                       |
| Instalação CLI  | `npm install -g @shopify/cli`                                       |
| Dev de tema     | `shopify theme dev --store {store}.myshopify.com`                   |
| Dev de app      | `shopify app dev`                                                   |
| Deploy          | `shopify app deploy`                                                |
| Documentação    | [shopify.dev](https://shopify.dev)                                  |

## Escolha o caminho

Leia o(s) arquivo(s) de referência que combinam com a tarefa:

**Liquid** — escrever ou depurar arquivos `.liquid`:

- [references/liquid-syntax.md](references/liquid-syntax.md) — Tags, fluxo de controle, iteração, whitespace, LiquidDoc
- [references/liquid-filters.md](references/liquid-filters.md) — Categorias de filtros com exemplos
- [references/liquid-objects.md](references/liquid-objects.md) — Objetos produto, coleção, carrinho, cliente e globais

**Desenvolvimento de tema** — construir ou customizar temas:

- [references/theme-development.md](references/theme-development.md) — Arquitetura OS 2.0, seções, blocos, templates JSON, schema de settings

**Integração com API** — buscar ou alterar dados programaticamente:

- [references/api-admin.md](references/api-admin.md) — GraphQL Admin API (principal), REST (legado), OAuth, webhooks, rate limiting
- [references/api-storefront.md](references/api-storefront.md) — Storefront API, Ajax API, operações de carrinho

**Desenvolvimento de app** — construir apps Shopify:

- [references/app-development.md](references/app-development.md) — Shopify CLI, extensões, Polaris Web Components, App Bridge

**Lógica serverless** — regras de negócio customizadas:

- [references/functions.md](references/functions.md) — Shopify Functions (substituem Scripts), alvos Rust/JS, deploy

**Comércio headless** — vitrines customizadas:

- [references/hydrogen.md](references/hydrogen.md) — Hydrogen, React Router 7, integração Storefront API

**Otimização e solução de problemas**:

- [references/performance.md](references/performance.md) — Imagens, JS, CSS, fontes, Liquid, Core Web Vitals
- [references/debugging.md](references/debugging.md) — Erros Liquid/API, carrinho, webhooks

## Avisos de descontinuação

| Descontinuado         | Substituição           | Prazo                                   |
| --------------------- | ---------------------- | --------------------------------------- |
| Shopify Scripts       | Shopify Functions      | Agosto 2025 (migração), sundown TBD     |
| checkout.liquid       | Checkout Extensibility | Agosto 2024 (Plus), concluído           |
| REST Admin API        | GraphQL Admin API      | Depreciação ativa (sem data de remoção) |
| Apps custom legados   | Novo modelo de auth    | Janeiro 2025 (concluído)                |
| Polaris React         | Polaris Web Components | Migração ativa                          |
| Remix (framework app) | React Router 7         | Hydrogen 2025.5.0+                      |

## Essenciais de Liquid

Três tipos de sintaxe:

```liquid
{{ product.title | upcase }}                    {# Saída com filtro #}
{% if product.available %}Em estoque{% endif %}   {# Tag lógica #}
{% assign sale = product.price | times: 0.8 %}  {# Atribuição #}
{%- if condition -%}Whitespace removido{%- endif -%}
```

Padrões comuns:

```liquid
{% for product in collection.products limit: 5 %}
  {% render 'product-card', product: product %}
{% endfor %}

{% paginate collection.products by 12 %}
  {% for product in paginate.collection.products %}...{% endfor %}
  {{ paginate | default_pagination }}
{% endpaginate %}
```

## Essenciais de API

```javascript
// GraphQL Admin — prefira sempre GraphQL a REST
const response = await fetch(`https://${store}.myshopify.com/admin/api/2026-01/graphql.json`, {
  method: 'POST',
  headers: {
    'X-Shopify-Access-Token': accessToken,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ query, variables }),
})
const { data, errors } = await response.json()
if (errors) throw new Error(errors[0].message)

// Ajax API (carrinho só no tema)
fetch('/cart/add.js', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ id: variantId, quantity: 1 }),
})
```

## Arquivos de referência

| Arquivo                                                 | Linhas | Cobertura                                                                    |
| ------------------------------------------------------- | ------ | ---------------------------------------------------------------------------- |
| [liquid-syntax.md](references/liquid-syntax.md)         | ~600   | Tags, fluxo de controle, iteração, variáveis, whitespace, LiquidDoc          |
| [liquid-filters.md](references/liquid-filters.md)       | ~870   | Filtros string, numéricos, array, específicos Shopify, data, URL, cor        |
| [liquid-objects.md](references/liquid-objects.md)       | ~695   | Objetos Shopify: produto, variante, coleção, carrinho, cliente, pedido, etc. |
| [theme-development.md](references/theme-development.md) | ~1200  | Estrutura de arquivos, templates JSON, seções, blocos, schema, layout        |
| [api-admin.md](references/api-admin.md)                 | ~595   | Queries/mutations GraphQL, REST (legado), OAuth, webhooks, rate limiting     |
| [api-storefront.md](references/api-storefront.md)       | ~235   | Storefront API, Ajax API, carrinho, Customer Account API                     |
| [app-development.md](references/app-development.md)     | ~760   | CLI, arquitetura de app, extensões, Polaris Web Components, deploy           |
| [functions.md](references/functions.md)                 | ~300   | Tipos de function, alvos Rust/JS, fluxo CLI, migração Scripts                |
| [hydrogen.md](references/hydrogen.md)                   | ~375   | Setup, roteamento, carregamento de dados, Storefront API, deploy             |
| [performance.md](references/performance.md)             | ~605   | Imagens, JS, CSS, fontes, Liquid, scripts de terceiros, Core Web Vitals      |
| [debugging.md](references/debugging.md)                 | ~650   | Liquid, JavaScript, API, carrinho, webhooks, editor de tema                  |
