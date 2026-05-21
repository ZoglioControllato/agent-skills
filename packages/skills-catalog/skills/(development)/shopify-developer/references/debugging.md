# Referência de depuração e solução de problemas

Orientação especializada para depuração de temas, aplicativos e integrações de API do Shopify com soluções práticas para problemas comuns.

## Capacidades principais

### 1. Depuração líquida

Depure erros de modelo Liquid e problemas de renderização.

**Ativar visualização do tema:**

```
1. Go to Online Store > Themes
2. Click "Customise" on your theme
3. Open browser DevTools (F12)
4. Check Console for Liquid errors
```

**Erros comuns de líquidos:**

**Erro de sintaxe:**

```liquid
{# ❌ Error: Missing endif #}
{% if product.available %}
  <button>Add to Cart</button>
{# Missing {% endif %} #}

{# ✅ Fixed #}
{% if product.available %}
  <button>Add to Cart</button>
{% endif %}
```

**Variável indefinida:**

```liquid
{# ❌ Error: product undefined on collection page #}
{{ product.title }}

{# ✅ Fixed: Check context #}
{% if product %}
  {{ product.title }}
{% else %}
  {# Not on product page #}
{% endif %}
```

**Filtro inválido:**

```liquid
{# ❌ Error: Unknown filter #}
{{ product.price | format_money }}

{# ✅ Fixed: Correct filter name #}
{{ product.price | money }}
```

**Saída de depuração:**

```liquid
{# Output variable as JSON #}
{{ product | json }}

{# Check variable type #}
{{ product.class }}

{# Check if variable exists #}
{% if product %}
  Product exists
{% else %}
  Product is nil
{% endif %}

{# Output all properties #}
<pre>{{ product | json }}</pre>
```

**Registro de console do Liquid:**

```liquid
<script>
  console.log('Product ID:', {{ product.id }});
  console.log('Product data:', {{ product | json }});
  console.log('Cart:', {{ cart | json }});
</script>
```

### 2. Depuração de JavaScript

Depure erros de JavaScript em temas e aplicativos.

**Console do navegador:**

```javascript
// Log to console
console.log('Debug:', variable)
console.error('Error:', error)
console.warn('Warning:', warning)

// Log object properties
console.table(data)

// Group related logs
console.group('Cart Operations')
console.log('Cart ID:', cartId)
console.log('Items:', items)
console.groupEnd()

// Time operations
console.time('API Call')
await fetch('/api/data')
console.timeEnd('API Call')

// Stack trace
console.trace('Execution path')
```

**Pontos de interrupção:**

```javascript
// Programmatic breakpoint
debugger

// Set in browser DevTools:
// Sources tab > Click line number
```

**Tratamento de erros:**

```javascript
// ❌ Unhandled error
const data = await fetch('/api/data').then((r) => r.json())

// ✅ Proper error handling
try {
  const response = await fetch('/api/data')

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`)
  }

  const data = await response.json()
  console.log('Data:', data)
} catch (error) {
  console.error('Failed to fetch data:', error)
  // Show user-friendly error message
  alert('Failed to load data. Please try again.')
}
```

**Depuração de rede:**

```
1. Open DevTools > Network tab
2. Filter by XHR or Fetch
3. Click request to see:
   - Request headers
   - Request payload
   - Response headers
   - Response body
   - Timing information
```

### 3. Depuração de erros de API

Depure erros do GraphQL e da API REST.

**Erros do GraphQL:**

Formato de resposta de erro:```json
{
"errors": [
{
"message": "Field 'invalidField' doesn't exist on type 'Product'",
"locations": [{ "line": 3, "column": 5 }],
"path": ["product", "invalidField"],
"extensions": {
"code": "FIELD_NOT_FOUND",
"typeName": "Product"
}
}
],
"data": null
}

````

**Verifique se há erros ANTES de acessar os dados:**

```javascript
const response = await fetch(graphqlEndpoint, {
  method: 'POST',
  headers: {
    'X-Shopify-Access-Token': accessToken,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ query, variables }),
});

const { data, errors } = await response.json();

// ✅ Always check errors first
if (errors) {
  console.error('GraphQL Errors:');
  errors.forEach(error => {
    console.error('Message:', error.message);
    console.error('Location:', error.locations);
    console.error('Path:', error.path);
    console.error('Code:', error.extensions?.code);
  });
  throw new Error(errors[0].message);
}

// Now safe to use data
console.log('Products:', data.products);
````

**Erros comuns do GraphQL:**

**Erro de autenticação:**

```json
{
  "errors": [
    {
      "message": "Access denied",
      "extensions": { "code": "UNAUTHENTICATED" }
    }
  ]
}
```

**Correção:** Verifique o token de acesso:```javascript
// Verify token is valid
const token = 'shpat\_...';

// Check token format (should start with shpat*)
if (!token.startsWith('shpat*')) {
console.error('Invalid token format');
}

// Verify in headers
headers: {
'X-Shopify-Access-Token': token, // ✅ Correct header
'Authorization': `Bearer ${token}`, // ❌ Wrong for Admin API
}

````

**Campo não encontrado:**

```json
{
  "errors": [{
    "message": "Field 'invalidField' doesn't exist on type 'Product'"
  }]
}
````

**Correção:** Verifique o nome do campo nos documentos da API:```graphql

# ❌ Wrong field name

query {
product(id: "gid://shopify/Product/123") {
invalidField
}
}

# ✅ Correct field name

query {
product(id: "gid://shopify/Product/123") {
title
handle
status
}
}

````

**Erro de limite de taxa:**

```javascript
// Check rate limit header
const response = await fetch(graphqlEndpoint, options);

const rateLimit = response.headers.get('X-Shopify-GraphQL-Admin-Api-Call-Limit');
console.log('Rate limit:', rateLimit); // "42/50"

if (response.status === 429) {
  const retryAfter = response.headers.get('Retry-After');
  console.log(`Rate limited. Retry after ${retryAfter} seconds`);
}
````

**Erros da API REST:**

**404 não encontrado:**

```javascript
const response = await fetch(`https://${shop}/admin/api/2026-01/products/999999.json`, {
  headers: { 'X-Shopify-Access-Token': token },
})

if (response.status === 404) {
  console.error('Product not found')
  // Check:
  // 1. Product ID is correct
  // 2. Product exists in store
  // 3. Using correct endpoint
}
```

**422 Entidade Não Processável:**

```json
{
  "errors": {
    "title": ["can't be blank"],
    "price": ["must be greater than 0"]
  }
}
```

**Correção:** Validar entrada:```javascript
const response = await fetch(endpoint, {
method: 'POST',
headers: {
'X-Shopify-Access-Token': token,
'Content-Type': 'application/json',
},
body: JSON.stringify({
product: {
title: '', // ❌ Empty title
price: -10, // ❌ Negative price
},
}),
});

if (response.status === 422) {
const { errors } = await response.json();
console.error('Validation errors:', errors);

// Fix data
const validProduct = {
title: 'Product Name', // ✅ Valid title
price: 19.99, // ✅ Valid price
};
}

````
### 4. Depuração do carrinho

Problemas de carrinho de depuração e API Ajax.

**Carrinho não atualizando:**

```javascript
// ❌ Common mistake: Wrong variant ID
fetch('/cart/add.js', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    id: '123',  // ❌ Wrong: using product ID instead of variant ID
    quantity: 1,
  }),
});

// ✅ Fixed: Use variant ID
fetch('/cart/add.js', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    id: 123456789,  // ✅ Variant ID (numeric)
    quantity: 1,
  }),
})
  .then(response => {
    if (!response.ok) {
      return response.json().then(err => {
        console.error('Cart error:', err);
        throw err;
      });
    }
    return response.json();
  })
  .then(item => {
    console.log('Added to cart:', item);
    // Update cart UI
  })
  .catch(error => {
    console.error('Failed to add to cart:', error);
  });
````

**Obter carrinho atual:**

```javascript
// Debug current cart state
fetch('/cart.js')
  .then((r) => r.json())
  .then((cart) => {
    console.log('Cart:', cart)
    console.log('Item count:', cart.item_count)
    console.log('Total:', cart.total_price)
    console.log('Items:', cart.items)

    cart.items.forEach((item) => {
      console.log('Item:', item.product_id, item.variant_id, item.quantity)
    })
  })
```

**Erros AJAX do carrinho:**

```javascript
// Common error: Insufficient inventory
{
  "status": 422,
  "message": "You can only add 5 of this item to your cart",
  "description": "Cannot add more than 5 to cart"
}

// Fix: Check inventory before adding
const variant = product.variants.find(v => v.id === variantId);

if (variant.inventory_quantity < quantity) {
  alert(`Only ${variant.inventory_quantity} available`);
} else {
  // Add to cart
}
```

### 5. Depuração de visualização do tema

Depure problemas no personalizador de temas.

**Console do Editor de Tema:**

```
1. Open theme customiser
2. Open DevTools (F12)
3. Check Console for errors
4. Look for:
   - Liquid errors (red text)
   - JavaScript errors
   - Network failures
```

**Seção não renderizada:**

```liquid
{# Check section schema #}
{% schema %}
{
  "name": "My Section",
  "settings": [...]  {# ✅ Must have settings #}
}
{% endschema %}

{# ❌ Missing schema = won't show in customiser #}
```

**Configurações sem atualização:**

```liquid
{# ❌ Wrong: Using hardcoded value #}
<h1>Hardcoded Title</h1>

{# ✅ Fixed: Use setting #}
<h1>{{ section.settings.title }}</h1>

{% schema %}
{
  "name": "Hero",
  "settings": [
    {
      "type": "text",
      "id": "title",
      "label": "Title",
      "default": "Welcome"
    }
  ]
}
{% endschema %}
```

**Atributos do bloco ausentes:**

```liquid
{# ❌ Missing shopify_attributes #}
<div class="block">
  {{ block.settings.text }}
</div>

{# ✅ Fixed: Add shopify_attributes for theme editor #}
<div class="block" {{ block.shopify_attributes }}>
  {{ block.settings.text }}
</div>
```

### 6. Depuração de webhook

Depure a entrega e o processamento do webhook.

**Webhook não recebido:**

Verifique no administrador do Shopify:```

1. Settings > Notifications > Webhooks
2. Click webhook
3. Check "Recent deliveries"
4. Look for delivery status:
   - ✅ Success (200 OK)
   - ❌ Failed (4xx/5xx errors)

````

**Verifique o Webhook HMAC:**

```javascript
import crypto from 'crypto';

function verifyWebhook(body, hmac, secret) {
  const hash = crypto
    .createHmac('sha256', secret)
    .update(body, 'utf8')
    .digest('base64');

  return hash === hmac;
}

// Express example
app.post('/webhooks/orders', (req, res) => {
  const hmac = req.headers['x-shopify-hmac-sha256'];
  const body = JSON.stringify(req.body);

  if (!verifyWebhook(body, hmac, process.env.SHOPIFY_WEBHOOK_SECRET)) {
    console.error('Invalid webhook HMAC');
    return res.status(401).send('Unauthorised');
  }

  console.log('Webhook verified');

  // Process webhook
  const order = req.body;
  console.log('Order:', order.id, order.email);

  // Respond quickly (< 5 seconds)
  res.status(200).send('OK');
});
````

**Tempo limite do webhook:**

```javascript
// ❌ Processing takes too long (> 5 seconds)
app.post('/webhooks/orders', async (req, res) => {
  await processOrder(req.body) // Slow operation
  res.send('OK') // Response delayed
})

// ✅ Respond immediately, process async
app.post('/webhooks/orders', async (req, res) => {
  const order = req.body

  // Respond quickly
  res.status(200).send('OK')

  // Process in background
  processOrder(order).catch(console.error)
})
```

### 7. Mensagens de erro comuns

**Erros líquidos:**

```
Error: Liquid syntax error: Unknown tag 'section'
Fix: Use {% section %} only in JSON templates, not .liquid files
```

```
Error: undefined method 'title' for nil:NilClass
Fix: Variable is nil. Add {% if %} check or provide default:
{{ product.title | default: "No title" }}
```

```
Error: Exceeded maximum number of allowed iterations
Fix: Infinite loop detected. Check loop conditions.
```

**Erros de JavaScript:**

```
TypeError: Cannot read property 'forEach' of undefined
Fix: Array is undefined. Check:
if (items && Array.isArray(items)) {
  items.forEach(item => { ... });
}
```

```
ReferenceError: $ is not defined
Fix: jQuery not loaded or script runs before jQuery loads
```

```
SyntaxError: Unexpected token <
Fix: API returned HTML error page instead of JSON. Check API endpoint.
```

**Erros de API:**

```
Access denied - check your access scopes
Fix: App needs additional permissions. Update scopes in Partner Dashboard.
```

```
Throttled: Exceeded API rate limit
Fix: Implement rate limit handling with exponential backoff.
```

```
Field doesn't exist on type
Fix: Check API version and field availability in docs.
```

## Kit de ferramentas de depuração

**Ferramentas de desenvolvimento do navegador:**

```
- Console: View errors and logs
- Network: Inspect API requests
- Sources: Set breakpoints
- Application: View cookies, localStorage
- Performance: Profile page load
```

**Ferramentas do Shopify:**

```
- Theme Preview: Test changes before publishing
- Theme Inspector: View section data
- API Explorer: Test GraphQL queries
- Webhook Logs: Check delivery status
```

**Comandos úteis do console:**

```javascript
// Get all form data
new FormData(document.querySelector('form'))

// View all cookies
document.cookie

// Check localStorage
localStorage

// View all global variables
console.log(window)

// Get computed styles
getComputedStyle(element)
```

## Melhores práticas

1. **Sempre verifique se há erros** antes de acessar os dados (respostas da API)
2. **Use blocos try-catch** para todas as operações assíncronas
3. **Registre mensagens significativas** com contexto
4. **Verifique o HMAC** para todos os webhooks
5. **Teste a visualização do tema** antes de publicar
6. **Monitore os limites de taxa da API** e implemente a espera
7. **Tratar casos extremos** (valores nulos, matrizes vazias)
8. **Use DevTools do navegador** para depuração de rede
9. **Verifique a versão da API** compatibilidade
10. \*\*V

alidar entrada\*\* antes de chamadas de API
