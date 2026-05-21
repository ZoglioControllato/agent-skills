# Referência da API Admin

## API de administração GraphQL

API moderna para operações administrativas do Shopify com busca de dados eficiente.

**Ponto final:**

```
POST https://{store}.myshopify.com/admin/api/2026-01/graphql.json
```

**Cabeçalhos:**

```javascript
{
  'X-Shopify-Access-Token': 'shpat_...',
  'Content-Type': 'application/json'
}
```

**Consulta Básica:**

```graphql
query GetProducts($first: Int!) {
  products(first: $first) {
    edges {
      node {
        id
        title
        handle
        status
        vendor
        productType

        # Pricing
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
          maxVariantPrice {
            amount
            currencyCode
          }
        }

        # Images
        images(first: 5) {
          edges {
            node {
              id
              url
              altText
            }
          }
        }

        # Variants
        variants(first: 10) {
          edges {
            node {
              id
              title
              sku
              price
              inventoryQuantity
              available: availableForSale
            }
          }
        }
      }
    }

    pageInfo {
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
  }
}
```

**Variáveis:**

```json
{
  "first": 10
}
```

**Exemplo JavaScript:**

```javascript
async function getProducts(accessToken, store, limit = 10) {
  const query = `
    query GetProducts($first: Int!) {
      products(first: $first) {
        edges {
          node {
            id
            title
            handle
            priceRange {
              minVariantPrice { amount currencyCode }
            }
          }
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  `

  const response = await fetch(`https://${store}.myshopify.com/admin/api/2026-01/graphql.json`, {
    method: 'POST',
    headers: {
      'X-Shopify-Access-Token': accessToken,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query,
      variables: { first: limit },
    }),
  })

  const { data, errors } = await response.json()

  if (errors) {
    console.error('GraphQL Errors:', errors)
    throw new Error(errors[0].message)
  }

  return data.products
}
```

**Mutações Comuns:**

Criar produto:```graphql
mutation CreateProduct($input: ProductInput!) {
productCreate(input: $input) {
product {
id
title
handle
}
userErrors {
field
message
}
}
}

````
Atualizar produto:```graphql
mutation UpdateProduct($input: ProductInput!) {
  productUpdate(input: $input) {
    product {
      id
      title
      status
    }
    userErrors {
      field
      message
    }
  }
}
````

Definir metacampo:```graphql
mutation SetMetafield($input: MetafieldInput!) {
metafieldSet(input: $input) {
metafield {
id
namespace
key
value
type
}
userErrors {
field
message
}
}
}

```
## REST Admin API (legado)

> **Observação:** GraphQL é a API principal do Shopify. Use GraphQL para todos os novos desenvolvimentos. Os endpoints REST permanecem disponíveis, mas recebem menos atualizações e podem ser descontinuados em versões futuras da API.

API REST tradicional para operações de administração do Shopify.

**URL base:**

```

https://{store}.myshopify.com/admin/api/2026-01/

````

**Autenticação:**

```javascript
headers: {
  'X-Shopify-Access-Token': 'shpat_...'
}
````

**Endpoints comuns:**

Obtenha produtos:```javascript
GET /admin/api/2026-01/products.json?limit=50&status=active

// JavaScript
const response = await fetch(
`https://${store}.myshopify.com/admin/api/2026-01/products.json?limit=50`,
{
headers: {
'X-Shopify-Access-Token': accessToken,
},
}
);

const { products } = await response.json();

````
Obtenha um único produto:```javascript
GET /admin/api/2026-01/products/{product_id}.json
````

Criar produto:```javascript
POST /admin/api/2026-01/products.json

// Body
{
"product": {
"title": "New Product",
"body_html": "<p>Description</p>",
"vendor": "My Vendor",
"product_type": "Shoes",
"status": "draft"
}
}

````
Atualizar produto:```javascript
PUT /admin/api/2026-01/products/{product_id}.json

// Body
{
  "product": {
    "id": 123456789,
    "title": "Updated Title"
  }
}
````

Receba pedidos:```javascript
GET /admin/api/2026-01/orders.json?status=any&limit=50

````
Obtenha clientes:```javascript
GET /admin/api/2026-01/customers.json?limit=50
````

## Autenticação OAuth 2.0

Fluxo OAuth completo para aplicativos personalizados.

**Etapa 1: Solicitação de autorização**

```
GET https://{shop}.myshopify.com/admin/oauth/authorize?
  client_id={api_key}&
  redirect_uri={redirect_uri}&
  scope={scopes}&
  state={random_state}
```

**Escopos:**

```javascript
const scopes = [
  'read_products',
  'write_products',
  'read_orders',
  'write_orders',
  'read_customers',
  'write_customers',
  'read_inventory',
  'write_inventory',
  'read_metafields',
  'write_metafields',
].join(',')
```

**Etapa 2: lidar com o retorno de chamada**

```javascript
// User approves, Shopify redirects to:
GET {redirect_uri}?code={auth_code}&state={state}&hmac={hmac}&shop={shop}

// Verify HMAC for security
function verifyHmac(query, secret) {
  const { hmac, ...params } = query;

  const message = Object.keys(params)
    .sort()
    .map(key => `${key}=${params[key]}`)
    .join('&');

  const hash = crypto
    .createHmac('sha256', secret)
    .update(message)
    .digest('hex');

  return hash === hmac;
}
```

**Etapa 3: Trocar código por token**

```javascript
POST https://{shop}.myshopify.com/admin/oauth/access_token

// Body
{
  "client_id": "{api_key}",
  "client_secret": "{api_secret}",
  "code": "{auth_code}"
}

// Response
{
  "access_token": "shpat_...",
  "scope": "write_products,read_orders"
}

// Node.js example
async function getAccessToken(shop, code, apiKey, apiSecret) {
  const response = await fetch(
    `https://${shop}/admin/oauth/access_token`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: apiKey,
        client_secret: apiSecret,
        code,
      }),
    }
  );

  const { access_token, scope } = await response.json();
  return { access_token, scope };
}
```

## Limitação de taxa

GraphQL usa limitação de taxa baseada em pontos.

**Limites de Tarifas:**

- 50 pontos de custo por segundo no máximo
- O balde é reabastecido a 50 pontos/segundo
- Cada consulta tem um custo calculado

**Verifique o limite de taxa:**

```javascript
const response = await fetch(graphqlEndpoint, options)

const rateLimitHeader = response.headers.get('X-Shopify-GraphQL-Admin-Api-Call-Limit')
// Example: "42/50" (42 points used, 50 max)

const [used, limit] = rateLimitHeader.split('/').map(Number)

if (used > 40) {
  // Approaching limit, slow down
  await delay(1000)
}
```

**Implementar lógica de nova tentativa:**

```javascript
async function fetchWithRetry(url, options, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    const response = await fetch(url, options)

    if (response.status === 429) {
      // Rate limited
      const retryAfter = response.headers.get('Retry-After') || 2
      await delay(retryAfter * 1000 * Math.pow(2, i)) // Exponential backoff
      continue
    }

    return response
  }

  throw new Error('Max retries exceeded')
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
```

## Webhooks

Notificações orientadas por eventos para integrações de aplicativos.

**Webhooks comuns:**

```javascript
// Product events
'products/create'
'products/update'
'products/delete'

// Order events
'orders/create'
'orders/updated'
'orders/paid'
'orders/fulfilled'
'orders/cancelled'

// Customer events
'customers/create'
'customers/update'
'customers/delete'

// Cart events
'carts/create'
'carts/update'

// Inventory events
'inventory_levels/update'

// App events
'app/uninstalled'
```

**Registrar Webhook (GraphQL):**

```graphql
mutation CreateWebhook($input: WebhookSubscriptionInput!) {
  webhookSubscriptionCreate(input: $input) {
    webhookSubscription {
      id
      topic
      endpoint {
        __typename
        ... on WebhookHttpEndpoint {
          callbackUrl
        }
      }
    }
    userErrors {
      field
      message
    }
  }
}
```

**Variáveis:**

```json
{
  "input": {
    "topic": "ORDERS_CREATE",
    "webhookSubscription": {
      "callbackUrl": "https://your-app.com/webhooks/orders",
      "format": "JSON"
    }
  }
}
```

**Lidar com Webhook (Node.js/Express):**

```javascript
app.post('/webhooks/orders', async (req, res) => {
  // Verify webhook HMAC
  const hmac = req.headers['x-shopify-hmac-sha256']
  const body = JSON.stringify(req.body)

  const hash = crypto.createHmac('sha256', SHOPIFY_WEBHOOK_SECRET).update(body).digest('base64')

  if (hash !== hmac) {
    return res.status(401).send('Invalid HMAC')
  }

  // Process order
  const order = req.body
  console.log('New order:', order.id, order.email)

  // Respond quickly (within 5 seconds)
  res.status(200).send('OK')

  // Process in background
  await processOrder(order)
})
```

## Padrões Comuns

### Paginação (GraphQL)```javascript

async function getAllProducts(accessToken, store) {
let allProducts = [];
let hasNextPage = true;
let cursor = null;

while (hasNextPage) {
const query = `       query GetProducts($first: Int!, $after: String) {
        products(first: $first, after: $after) {
          edges {
            node { id title }
          }
          pageInfo {
            hasNextPage
            endCursor
          }
        }
      }
    `;

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'X-Shopify-Access-Token': accessToken,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables: { first: 50, after: cursor },
      }),
    });

    const { data } = await response.json();
    allProducts.push(...data.products.edges.map(e => e.node));

    hasNextPage = data.products.pageInfo.hasNextPage;
    cursor = data.products.pageInfo.endCursor;

}

return allProducts;
}

````
### Tratamento de erros```javascript
async function safeApiCall(query, variables) {
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'X-Shopify-Access-Token': accessToken,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query, variables }),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const { data, errors } = await response.json();

    if (errors) {
      console.error('GraphQL Errors:', errors);
      throw new Error(errors[0].message);
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}
````

## Melhores práticas

1. **Sempre verifique a versão da API** - Use a versão estável mais recente (2026-01)
2. **Implementar tratamento de limite de taxa** - Use backoff exponencial
3. **Verifique o webhook HMAC** – Segurança crítica
4. **Use GraphQL sobre REST** quando possível - Mais eficiente
5. **Solicite apenas os campos necessários** - Reduza o tamanho da resposta
6. **Trate de erros normalmente** - Verifique `errors` e `userErrors`
7. **Armazene tokens de acesso com segurança** - Nunca exponha no código do cliente
8. \*\*Use sc mínimo necessário

opes** - Melhores práticas de segurança 9. **Implementar lógica de repetição** - Lidar com falhas transitórias 10. **Responda aos webhooks rapidamente\*\* - Em 5 segundos
