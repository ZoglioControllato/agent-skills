# Referência de desenvolvimento de aplicativos

Orientação especializada para criar aplicativos personalizados da Shopify usando a CLI da Shopify, estruturas modernas e práticas recomendadas.

## Capacidades principais

### 1. Configuração CLI do Shopify

Instale e configure Shopify CLI para desenvolvimento de aplicativos.

**Instale a CLI do Shopify:**

```bash
# Using npm
npm install -g @shopify/cli @shopify/app

# Using Homebrew (macOS)
brew tap shopify/shopify
brew install shopify-cli

# Verify installation
shopify version
```

**Criar novo aplicativo:**

```bash
# Create app with Node.js/React
shopify app init

# Choose template:
# - React Router 7 (recommended)
# - Node.js + React
# - PHP
# - Ruby

# App structure created:
my-app/
├── app/                    # React Router app routes
├── extensions/             # App extensions
├── shopify.app.toml       # App configuration
├── package.json
└── README.md
```

**Observação:** A partir do Hydrogen 2025.5.0+, os modelos do Shopify são padronizados para React Router 7 em vez de Remix.

**Configuração do aplicativo (shopify.app.toml):**

```toml
# This file stores app configuration

name = "my-app"
client_id = "your-client-id"
application_url = "https://your-app.com"
embedded = true

[access_scopes]
# API access scopes
scopes = "write_products,read_orders,read_customers"

[auth]
redirect_urls = [
  "https://your-app.com/auth/callback",
  "https://your-app.com/auth/shopify/callback"
]

[webhooks]
api_version = "2026-01"

[[webhooks.subscriptions]]
topics = ["products/create", "products/update"]
uri = "/webhooks"
```

### 2. Fluxo de trabalho de desenvolvimento

**Iniciar servidor de desenvolvimento:**

```bash
# Start dev server with tunnelling
shopify app dev

# Server starts with:
# - Local development URL: http://localhost:3000
# - Public tunnel URL: https://random-subdomain.ngrok.io
# - App installed in development store
```

**Implantar aplicativo:**

```bash
# Deploy to production
shopify app deploy

# Generate app version and deploy extensions
```

**Variáveis ​​de ambiente (.env):**

```bash
SHOPIFY_API_KEY=your_api_key
SHOPIFY_API_SECRET=your_api_secret
SCOPES=write_products,read_orders
HOST=your-app-domain.com
SHOPIFY_APP_URL=https://your-app.com
DATABASE_URL=postgresql://...
```

### 3. Arquitetura do aplicativo (React Router 7)

Aplicativo Shopify moderno usando a estrutura React Router 7.

**app/routes/app.\_index.jsx (página inicial):**

```javascript
import { useLoaderData } from 'react-router'
import { authenticate } from '../shopify.server'
import { Page, Layout, Card, DataTable, Button } from '@shopify/polaris'

export async function loader({ request }) {
  const { admin, session } = await authenticate.admin(request)

  // Fetch products using GraphQL
  const response = await admin.graphql(`
    query {
      products(first: 10) {
        edges {
          node {
            id
            title
            handle
            status
          }
        }
      }
    }
  `)

  const { data } = await response.json()

  return {
    products: data.products.edges.map((e) => e.node),
    shop: session.shop,
  }
}

export default function Index() {
  const { products, shop } = useLoaderData()

  const rows = products.map((product) => [product.title, product.handle, product.status])

  return (
    <Page title="Products">
      <Layout>
        <Layout.Section>
          <Card>
            <DataTable
              columnContentTypes={['text', 'text', 'text']}
              headings={['Title', 'Handle', 'Status']}
              rows={rows}
            />
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  )
}
```

**app/routes/app.product.$id.jsx (Detalhes do produto):**

```javascript
import { data } from 'react-router'
import { useLoaderData, useSubmit } from 'react-router'
import { authenticate } from '../shopify.server'
import { Page, Layout, Card, Form, FormLayout, TextField, Button } from '@shopify/polaris'
import { useState } from 'react'

export async function loader({ request, params }) {
  const { admin } = await authenticate.admin(request)

  const response = await admin.graphql(
    `
    query GetProduct($id: ID!) {
      product(id: $id) {
        id
        title
        description
        status
        vendor
      }
    }
  `,
    {
      variables: { id: `gid://shopify/Product/${params.id}` },
    },
  )

  const { data: responseData } = await response.json()

  return data({ product: responseData.product })
}

export async function action({ request, params }) {
  const { admin } = await authenticate.admin(request)

  const formData = await request.formData()
  const title = formData.get('title')
  const description = formData.get('description')

  const response = await admin.graphql(
    `
    mutation UpdateProduct($input: ProductInput!) {
      productUpdate(input: $input) {
        product {
          id
          title
        }
        userErrors {
          field
          message
        }
      }
    }
  `,
    {
      variables: {
        input: {
          id: `gid://shopify/Product/${params.id}`,
          title,
          description,
        },
      },
    },
  )

  const { data: responseData } = await response.json()

  if (responseData.productUpdate.userErrors.length > 0) {
    return data({ errors: responseData.productUpdate.userErrors }, { status: 400 })
  }

  return data({ success: true })
}

export default function ProductDetail() {
  const { product } = useLoaderData()
  const submit = useSubmit()

  const [title, setTitle] = useState(product.title)
  const [description, setDescription] = useState(product.description)

  const handleSubmit = () => {
    const formData = new FormData()
    formData.append('title', title)
    formData.append('description', description)

    submit(formData, { method: 'post' })
  }

  return (
    <Page title="Edit Product" backAction={{ url: '/app' }}>
      <Layout>
        <Layout.Section>
          <Card>
            <FormLayout>
              <TextField label="Title" value={title} onChange={setTitle} autoComplete="off" />
              <TextField
                label="Description"
                value={description}
                onChange={setDescription}
                multiline={4}
                autoComplete="off"
              />
              <Button primary onClick={handleSubmit}>
                Save
              </Button>
            </FormLayout>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  )
}
```

### 4. Extensões de aplicativos

Amplie a funcionalidade do Shopify com vários tipos de extensão.

**Extensão de ação administrativa:**

Botão Criar na página administrativa do produto:```bash
shopify app generate extension

# Choose: Admin action

# Name: Export Product

````

**extensões/produto de exportação/src/index.jsx:**

```javascript
import { extend, AdminAction } from "@shopify/admin-ui-extensions";

extend("Admin::Product::SubscriptionAction", (root, { data }) => {
  const { id, title } = data.selected[0];

  const button = root.createComponent(AdminAction, {
    title: "Export Product",
    onPress: async () => {
      // Call your app API
      const response = await fetch("/api/export", {
        method: "POST",
        body: JSON.stringify({ productId: id }),
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        root.toast.show("Product exported successfully!");
      } else {
        root.toast.show("Export failed", { isError: true });
      }
    },
  });

  root.append(button);
});
````

**Extensão de aplicativo de tema:**

Adicione bloco de aplicativos aos temas:```bash
shopify app generate extension

# Choose: Theme app extension

# Name: Product Reviews

````

**extensões/revisões de produtos/blocos/revisões.liquid:**

```liquid
{% schema %}
{
  "name": "Product Reviews",
  "target": "section",
  "settings": [
    {
      "type": "text",
      "id": "heading",
      "label": "Heading",
      "default": "Customer Reviews"
    },
    {
      "type": "range",
      "id": "reviews_to_show",
      "label": "Reviews to Show",
      "min": 1,
      "max": 10,
      "default": 5
    }
  ]
}
{% endschema %}

<div class="product-reviews">
  <h2>{{ block.settings.heading }}</h2>

  {% comment %}
    Fetch reviews from your app API
  {% endcomment %}

  <div id="reviews-container" data-product-id="{{ product.id }}"></div>
</div>

<script>
  // Fetch and render reviews
  // Note: In production, sanitise HTML to prevent XSS vulnerabilities
  fetch(`/apps/reviews/api/reviews?product_id={{ product.id }}&limit={{ block.settings.reviews_to_show }}`)
    .then(r => r.json())
    .then(reviews => {
      const container = document.getElementById('reviews-container');
      container.innerHTML = reviews.map(review => `
        <div class="review">
          <div class="rating">${'⭐'.repeat(review.rating)}</div>
          <h3>${review.title}</h3>
          <p>${review.content}</p>
          <p class="author">- ${review.author}</p>
        </div>
      `).join('');
    });
</script>

{% stylesheet %}
  .product-reviews {
    padding: 2rem;
  }

  .review {
    margin-bottom: 1.5rem;
    padding-bottom: 1.5rem;
    border-bottom: 1px solid #eee;
  }

  .rating {
    color: #ffa500;
    margin-bottom: 0.5rem;
  }
{% endstylesheet %}
````

### 5. Webhooks em aplicativos

Gerencie eventos do Shopify em seu aplicativo.

**app/routes/webhooks.jsx:**

```javascript
import { authenticate } from '../shopify.server'
import db from '../db.server'

export async function action({ request }) {
  const { topic, shop, session, admin, payload } = await authenticate.webhook(request)

  console.log(`Webhook received: ${topic} from ${shop}`)

  switch (topic) {
    case 'APP_UNINSTALLED':
      // Clean up app data
      await db.session.deleteMany({ where: { shop } })
      break

    case 'PRODUCTS_CREATE':
      // Handle new product
      console.log('New product created:', payload.id, payload.title)
      await handleProductCreated(payload)
      break

    case 'PRODUCTS_UPDATE':
      // Handle product update
      console.log('Product updated:', payload.id)
      await handleProductUpdated(payload)
      break

    case 'ORDERS_CREATE':
      // Handle new order
      console.log('New order:', payload.id, payload.email)
      await handleOrderCreated(payload)
      break

    case 'CUSTOMERS_CREATE':
      // Handle new customer
      await handleCustomerCreated(payload)
      break

    default:
      console.log('Unhandled webhook topic:', topic)
  }

  return new Response('OK', { status: 200 })
}

async function handleProductCreated(product) {
  // Process new product
  await db.product.create({
    data: {
      shopifyId: product.id,
      title: product.title,
      handle: product.handle,
    },
  })
}

async function handleOrderCreated(order) {
  // Send email notification, update inventory, etc.
  console.log(`Order ${order.id} received for ${order.email}`)
}
```

**Registre Webhooks (app/shopify.server.js):**

```javascript
import '@shopify/shopify-app-remix/adapters/node'
import { ApiVersion, AppDistribution, shopifyApp, DeliveryMethod } from '@shopify/shopify-app-remix/server'

const shopify = shopifyApp({
  apiKey: process.env.SHOPIFY_API_KEY,
  apiSecretKey: process.env.SHOPIFY_API_SECRET,
  scopes: process.env.SCOPES?.split(','),
  appUrl: process.env.SHOPIFY_APP_URL,
  authPathPrefix: '/auth',
  sessionStorage: new SQLiteSessionStorage(),
  distribution: AppDistribution.AppStore,
  apiVersion: ApiVersion.January26,

  webhooks: {
    APP_UNINSTALLED: {
      deliveryMethod: DeliveryMethod.Http,
      callbackUrl: '/webhooks',
    },
    PRODUCTS_CREATE: {
      deliveryMethod: DeliveryMethod.Http,
      callbackUrl: '/webhooks',
    },
    PRODUCTS_UPDATE: {
      deliveryMethod: DeliveryMethod.Http,
      callbackUrl: '/webhooks',
    },
    ORDERS_CREATE: {
      deliveryMethod: DeliveryMethod.Http,
      callbackUrl: '/webhooks',
    },
  },
})

export default shopify
export const authenticate = shopify.authenticate
```

### 6. Proxy de aplicativo

Crie rotas personalizadas de vitrine que acessam seu aplicativo.

**Configuração no Painel do Parceiro:**

```
Subpath prefix: apps
Subpath: reviews
Proxy URL: https://your-app.com/api/proxy
```

**Resultado:**

```
https://store.com/apps/reviews → proxies to → https://your-app.com/api/proxy
```

**Tratar de solicitações de proxy (app/routes/api.proxy.jsx):**

```javascript
import { data } from 'react-router'

export async function loader({ request }) {
  const url = new URL(request.url)

  // Verify proxy request
  const signature = url.searchParams.get('signature')
  const shop = url.searchParams.get('shop')

  if (!verifyProxySignature(signature, request)) {
    return data({ error: 'Invalid signature' }, { status: 401 })
  }

  // Handle different paths
  const path = url.searchParams.get('path_prefix')

  if (path === '/apps/reviews/product') {
    const productId = url.searchParams.get('product_id')
    const reviews = await getProductReviews(productId)

    return data({ reviews })
  }

  return data({ message: 'App Proxy' })
}

function verifyProxySignature(signature, request) {
  // Verify HMAC signature
  // Implementation depends on your setup
  return true
}
```

### 7. Componentes da interface do usuário Polaris

Use o sistema de design da Shopify para uma interface de administração consistente.

**Componentes comuns:**

```javascript
import {
  Page,
  Layout,
  Card,
  Button,
  TextField,
  Select,
  Checkbox,
  Badge,
  Banner,
  DataTable,
  Modal,
  Toast,
  Frame,
} from '@shopify/polaris'

export default function MyPage() {
  return (
    <Page
      title="Settings"
      primaryAction={{ content: 'Save', onAction: handleSave }}
      secondaryActions={[{ content: 'Cancel', onAction: handleCancel }]}
    >
      <Layout>
        <Layout.Section>
          <Card title="General Settings" sectioned>
            <TextField label="App Name" value={name} onChange={setName} />

            <Select
              label="Status"
              options={[
                { label: 'Active', value: 'active' },
                { label: 'Draft', value: 'draft' },
              ]}
              value={status}
              onChange={setStatus}
            />

            <Checkbox label="Enable notifications" checked={notifications} onChange={setNotifications} />
          </Card>
        </Layout.Section>

        <Layout.Section secondary>
          <Card title="Status" sectioned>
            <Badge status="success">Active</Badge>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  )
}
```

### Componentes Web Polaris (visualização)

Shopify está migrando do Polaris React para componentes da Web independentes de estrutura:```html

<!-- Web Component syntax (replacing React components) -->
<ui-page title="Settings">
  <ui-layout>
    <ui-layout-section>
      <ui-card>
        <ui-text-field label="App Name" value="My App"></ui-text-field>
        <ui-select label="Status">
          <option value="active">Active</option>
          <option value="draft">Draft</option>
        </ui-select>
        <ui-checkbox label="Enable notifications"></ui-checkbox>
      </ui-card>
    </ui-layout-section>
  </ui-layout>
</ui-page>
```

**Status da migração:** Polaris React permanece totalmente compatível. Os componentes da Web estão em versão prévia para novos projetos. Os aplicativos existentes não precisam ser migrados imediatamente.

### 8. Servidor Shopify Dev MCP

O servidor `@anthropic/shopify-dev-mcp` fornece desenvolvimento Shopify assistido por IA:```json
{
"mcpServers": {
"shopify-dev": {
"command": "npx",
"args": ["@anthropic/shopify-dev-mcp"]
}
}
}

````
Fornece ferramentas para consultar a documentação do Shopify, gerar consultas GraphQL e estruturar componentes de aplicativos.

### 9. Implantação

Implante aplicativos do Shopify em produção.

**Implantar em trabalhadores da Cloudflare:**

**wrangler.toml:**

```toml
name = "shopify-app"
compatibility_date = "2026-01-10"
main = "build/index.js"

[vars]
SHOPIFY_API_KEY = "your_api_key"

[[kv_namespaces]]
binding = "SESSIONS"
id = "your_kv_namespace_id"
````

**Implantar:**

```bash
# Build app
npm run build

# Deploy to Cloudflare
wrangler deploy
```

**Segredos do Meio Ambiente:**

```bash
# Add secrets
wrangler secret put SHOPIFY_API_SECRET
wrangler secret put DATABASE_URL
```

## Melhores práticas

1. **Use Shopify CLI** para estrutura e desenvolvimento de aplicativos
2. **Implemente OAuth adequado** com verificação HMAC
3. **Trate de eventos de webhook** para atualizações em tempo real
4. **Use Polaris** para uma interface de administração consistente
5. **Teste na loja de desenvolvimento** antes da produção
6. **Implementar tratamento de erros** para todas as chamadas de API
7. **Armazene dados da sessão com segurança** (banco de dados criptografado)
8. **Siga os requisitos do aplicativo Shopify** para listagem
9. **Implementar faturamento de aplicativos** para segunda-feira

etização 10. **Use extensões de aplicativo** para aprimorar a experiência do comerciante
