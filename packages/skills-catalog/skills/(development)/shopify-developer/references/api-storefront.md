# Referência de API Storefront e Ajax

## API de vitrine

API pública para vitrines headless/personalizadas.

**Ponto final:**

```
POST https://{store}.myshopify.com/api/2026-01/graphql.json
```

### Autenticação

A API Storefront oferece suporte a três tipos de tokens de acesso:

**1. Token de acesso público (lado do cliente)**

- Escopo limitado, seguro para código do navegador
- Criar no Shopify Admin: Aplicativos > Gerenciar aplicativos privados > API Storefront
- Expõe apenas dados públicos da vitrine (produtos, coleções, carrinho)
- Não é possível acessar dados do cliente ou funções administrativas```javascript
  {
  'Content-Type': 'application/json',
  'X-Shopify-Storefront-Access-Token': '{public_token}'
  }

````

**2. Token de acesso privado (lado do servidor)**
- Escopo mais amplo, para implementações no lado do servidor
- Deve ser mantido seguro, nunca exposto ao cliente
- Pode acessar recursos adicionais com base nas permissões do aplicativo

**3. Delegar tokens de acesso**
- Tokens específicos do cliente para operações autenticadas
- Usado para login do cliente, histórico de pedidos, gerenciamento de perfil
- De curta duração, com escopo para sessões individuais de clientes

### Cabeçalhos (acesso público)```javascript
{
  'Content-Type': 'application/json',
  'X-Shopify-Storefront-Access-Token': '{public_token}' // Optional for public stores
}
````

### Consultar produtos```graphql

query GetProducts($first: Int!) {
products(first: $first) {
edges {
node {
id
title
handle
description
priceRange {
minVariantPrice { amount currencyCode }
maxVariantPrice { amount currencyCode }
}
images(first: 3) {
edges {
node {
url
altText
}
}
}
variants(first: 10) {
edges {
node {
id
title
price { amount currencyCode }
availableForSale
sku
}
}
}
}
}
}
}

````
### Operações do carrinho

Criar carrinho:```graphql
mutation CreateCart($input: CartInput!) {
  cartCreate(input: $input) {
    cart {
      id
      checkoutUrl
      lines(first: 10) {
        edges {
          node {
            id
            quantity
            merchandise {
              ... on ProductVariant {
                id
                title
                price { amount }
              }
            }
          }
        }
      }
      cost {
        totalAmount { amount currencyCode }
        subtotalAmount { amount }
        totalTaxAmount { amount }
      }
    }
  }
}
````

Adicionar ao carrinho:```graphql
mutation AddToCart($cartId: ID!, $lines: [CartLineInput!]!) {
cartLinesAdd(cartId: $cartId, lines: $lines) {
cart {
id
lines(first: 10) {
edges {
node {
id
quantity
}
}
}
}
}
}

````
## API Ajax (somente tema)

API JavaScript para operações de carrinho em temas.

**Obter carrinho:**

```javascript
fetch('/cart.js')
  .then(response => response.json())
  .then(cart => {
    console.log('Cart:', cart);
    console.log('Item count:', cart.item_count);
    console.log('Total:', cart.total_price);
    console.log('Items:', cart.items);
  });
````

**Adicionar ao carrinho:**

```javascript
fetch('/cart/add.js', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    id: variantId, // Required: variant ID
    quantity: 1, // Optional: default 1
    properties: {
      // Optional: custom data
      'Gift wrap': 'Yes',
      Note: 'Happy Birthday!',
    },
  }),
})
  .then((response) => response.json())
  .then((item) => {
    console.log('Added to cart:', item)
  })
  .catch((error) => {
    console.error('Error:', error)
  })
```

**Atualizar carrinho:**

```javascript
fetch('/cart/change.js', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    line: 1, // Line item index (1-based)
    quantity: 2, // New quantity (0 = remove)
  }),
})
  .then((response) => response.json())
  .then((cart) => console.log('Updated cart:', cart))
```

**Limpar carrinho:**

```javascript
fetch('/cart/clear.js', { method: 'POST' })
  .then((response) => response.json())
  .then((cart) => console.log('Cart cleared'))
```

**Atualizar atributos do carrinho:**

```javascript
fetch('/cart/update.js', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    attributes: {
      gift_wrap: 'true',
      gift_message: 'Happy Birthday!',
    },
    note: 'Please handle with care',
  }),
})
  .then((response) => response.json())
  .then((cart) => console.log('Cart updated'))
```

## API de conta do cliente

API mais recente da Shopify para operações de conta voltadas ao cliente (substitui endpoints legados do cliente):

**Ponto final:**

```
POST https://{store}.myshopify.com/account/customer/api/2026-01/graphql
```

**Operações principais:**

- Login e registro do cliente
- Histórico de pedidos e rastreamento
- Gerenciamento de endereços
- Atualizações de perfil

**Observação:** Esta API usa um fluxo de autenticação diferente por meio de tokens de acesso do cliente. Consulte [documentos do Shopify](https://shopify.dev/docs/api/customer) para obter detalhes de implementação.
