# Zaraz Patterns

## SPA Tracking

**History Change Trigger (Recommended):** Configure in dashboard - no code needed, Zaraz auto-detects route changes.

**Manual tracking (React/Vue/Next.js):**

```javascript
// On route change
zaraz.track('pageview', { page_path: pathname, page_title: document.title })
```

## User Identification

```javascript
// Login
zaraz.set({ userId: user.id, email: user.email, plan: user.plan })
zaraz.track('login', { method: 'oauth' })

// Logout - set to null (cannot clear)
zaraz.set('userId', null)
```

## E-commerce Funnel

| Event       | Method                                                              |
| ----------- | ------------------------------------------------------------------- |
| View        | `zaraz.ecommerce('Product Viewed', { product_id, name, price })`    |
| Add to cart | `zaraz.ecommerce('Product Added', { product_id, quantity })`        |
| Checkout    | `zaraz.ecommerce('Checkout Started', { cart_id, products: [...] })` |
| Purchase    | `zaraz.ecommerce('Order Completed', { order_id, total, products })` |

## A/B Testing

```javascript
zaraz.set('experiment_checkout', variant)
zaraz.track('experiment_viewed', { experiment_id: 'checkout', variant })
// On conversion
zaraz.track('experiment_conversion', { experiment_id, variant, value })
```

## Worker Integration

**Context Enricher** - Modify context before tools execute:

```typescript
export default {
  async fetch(request, env) {
    const body = await request.json()
    body.system.userRegion = request.cf?.region
    return Response.json(body)
  },
}
```

Configurar: Zaraz > Configurações > Enriquecedores de Contexto

**Variáveis de trabalho** - Calcula valores dinâmicos no lado do servidor, use como `{{worker.variable_name}}`.

## Migração GTM

| GTM                                  | Zaraz                                        |
| ------------------------------------ | -------------------------------------------- |
| `dataLayer.push({evento: 'compra'})` | `zaraz.ecommerce('Pedido Concluído', {...})` |
| `{{URL da página}}`                  | `{{system.page.url}}`                        |
| `{{Título da página}}`               | `{{system.page.title}}`                      |
| Gatilho de visualização de página    | Gatilho de visualização de página            |
| Clique no gatilho                    | Clique em (seletor: `*`)                     |

## Melhores práticas

1. Use gatilhos de painel em vez de código embutido
2. Habilite alteração de histórico para SPAs (sem código manual)
3. Depure com `zaraz.debug = true`
4. Implementar o consentimento antecipadamente (GDPR/CCPA)
5. Use enriquecedores de contexto para dados confidenciais/de servidor
