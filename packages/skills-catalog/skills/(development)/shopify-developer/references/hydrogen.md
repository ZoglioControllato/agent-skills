# Referência de Hidrogênio

Hydrogen é a estrutura do Shopify para a construção de vitrines personalizadas sem cabeça, com tecnologia React Router 7 (desde Hydrogen 2025.5.0, substituindo Remix).

## Visão geral

| Artigo        | Valor                                                |
| ------------- | ---------------------------------------------------- |
| Estrutura     | React Router 7 (anteriormente Remix)                 |
| Versão reagir | Reagir 19                                            |
| API           | API Storefront (GraphQL)                             |
| Hospedagem    | Shopify Oxygen (padrão) ou qualquer host Node.js     |
| CLI           | `npx shopify hidrogênio`                             |
| Documentos    | [hidrogen.shopify.dev](https://hydrogen.shopify.dev) |

## Primeiros passos

### Crie um projeto de Hidrogênio```bash

# Create new project

npx shopify hydrogen init

# Options:

# - Template: skeleton, demo-store

# - Language: TypeScript (recommended), JavaScript

# - Styling: Tailwind CSS, vanilla CSS

# Project structure:

my-store/
├── app/
│ ├── components/ # Shared components
│ ├── lib/ # Utilities and helpers
│ ├── routes/ # File-based routing
│ │ ├── \_index.tsx # Homepage
│ │ ├── products.$handle.tsx  # Product page
│   │   ├── collections.$handle.tsx
│ │ └── cart.tsx
│ ├── entry.client.tsx # Client entry
│ ├── entry.server.tsx # Server entry
│ └── root.tsx # Root layout
├── public/ # Static assets
├── .env # Environment variables
├── hydrogen.config.ts # Hydrogen config
├── react-router.config.ts # Route config
├── package.json
└── vite.config.ts

````
### Variáveis ​​de ambiente```bash
# .env
SESSION_SECRET=your-secret
PUBLIC_STOREFRONT_API_TOKEN=your-public-token
PUBLIC_STORE_DOMAIN=your-store.myshopify.com

# Optional: for authenticated Storefront API
PRIVATE_STOREFRONT_API_TOKEN=your-private-token
````

## Roteamento

Hydrogen usa roteamento baseado em arquivo React Router 7:

| Arquivo                      | URL                   | Descrição              |
| ---------------------------- | --------------------- | ---------------------- |
| `rotas/_index.tsx`           | `/`                   | Página inicial         |
| `rotas/produtos.$handle.tsx` | `/produtos/snowboard` | Página do produto      |
| `rotas/coleções.$handle.tsx` | `/coleções/inverno`   | Página da coleção      |
| `rotas/coleções._index.tsx`  | `/coleções`           | Lista de coleções      |
| `rotas/cart.tsx`             | `/carrinho`           | Página do carrinho     |
| `rotas/search.tsx`           | `/pesquisar`          | Resultados da pesquisa |
| `rotas/páginas.$handle.tsx`  |

`/páginas/sobre` | Páginas CMS |
| `rotas/conta.tsx` | `/conta` | Conta de cliente (layout) |
| `rotas/account.orders.$id.tsx` | `/conta/pedidos/123` | Detalhe do pedido |

## Carregamento de dados

### Padrão do carregador (busca de dados do lado do servidor)```tsx

import { useLoaderData, type LoaderFunctionArgs } from 'react-router';

export async function loader({ params, context }: LoaderFunctionArgs) {
const { storefront } = context;

const { product } = await storefront.query(PRODUCT_QUERY, {
variables: { handle: params.handle },
});

if (!product) {
throw new Response('Product not found', { status: 404 });
}

return { product };
}

export default function ProductPage() {
const { product } = useLoaderData<typeof loader>();

return (
<div>
<h1>{product.title}</h1>
<p>{product.description}</p>
<ProductPrice price={product.priceRange.minVariantPrice} />
</div>
);
}

const PRODUCT_QUERY = `#graphql
  query Product($handle: String!) {
    product(handle: $handle) {
      id
      title
      handle
      description
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
      }
      images(first: 10) {
        nodes {
          url
          altText
          width
          height
        }
      }
      variants(first: 100) {
        nodes {
          id
          title
          availableForSale
          price {
            amount
            currencyCode
          }
          selectedOptions {
            name
            value
          }
        }
      }
    }
  }
`;

````
### Padrão de ação (envios de formulários)```tsx
import { type ActionFunctionArgs } from 'react-router';

export async function action({ request, context }: ActionFunctionArgs) {
  const formData = await request.formData();
  const variantId = formData.get('variantId') as string;
  const quantity = parseInt(formData.get('quantity') as string) || 1;

  const { cart } = context;

  const result = await cart.addLines([
    { merchandiseId: variantId, quantity },
  ]);

  return { cart: result.cart };
}
````

## Cliente API Storefront

Hydrogen fornece um cliente API Storefront digitado:```tsx
// app/lib/storefront.ts - automatically configured

// Usage in loaders:
export async function loader({ context }: LoaderFunctionArgs) {
const { storefront } = context;

// Simple query
const { products } = await storefront.query(PRODUCTS_QUERY, {
variables: { first: 10 },
});

// With cache control
const { collection } = await storefront.query(COLLECTION_QUERY, {
variables: { handle: 'winter' },
cache: storefront.CacheLong(), // Cache for 1 hour
});

return { products, collection };
}

````
### Estratégias de cache```tsx
// Built-in cache strategies
storefront.CacheNone()     // No caching (default for mutations)
storefront.CacheShort()    // 1 second stale, 60 seconds max
storefront.CacheLong()     // 1 hour stale, 1 day max
storefront.CacheCustom({
  mode: 'public',
  maxAge: 60,              // seconds
  staleWhileRevalidate: 300,
})
````

## Operações do carrinho

Hydrogen fornece uma abstração de API de carrinho:```tsx
// In loaders/actions, use context.cart
export async function action({ request, context }: ActionFunctionArgs) {
const { cart } = context;
const formData = await request.formData();

switch (formData.get('action')) {
case 'add':
return cart.addLines([{
merchandiseId: formData.get('variantId') as string,
quantity: 1,
}]);

    case 'update':
      return cart.updateLines([{
        id: formData.get('lineId') as string,
        quantity: parseInt(formData.get('quantity') as string),
      }]);

    case 'remove':
      return cart.removeLines([
        formData.get('lineId') as string,
      ]);

    case 'updateNote':
      return cart.updateNote(
        formData.get('note') as string,
      );

    default:
      throw new Error('Unknown cart action');

}
}

````
### Componente do carrinho```tsx
import { useFetcher } from 'react-router';
import { CartLineQuantity, CartLinePrice, Money } from '@shopify/hydrogen';

function AddToCartButton({ variantId }: { variantId: string }) {
  const fetcher = useFetcher();
  const isAdding = fetcher.state !== 'idle';

  return (
    <fetcher.Form method="post" action="/cart">
      <input type="hidden" name="action" value="add" />
      <input type="hidden" name="variantId" value={variantId} />
      <button type="submit" disabled={isAdding}>
        {isAdding ? 'Adding...' : 'Add to Cart'}
      </button>
    </fetcher.Form>
  );
}
````

## Componentes de Hidrogênio

Componentes integrados para padrões comuns de comércio eletrônico:```tsx
import {
Image,
Money,
ShopPayButton,
Video,
ExternalVideo,
ModelViewer,
MediaFile,
CartLineQuantity,
CartLinePrice,
} from '@shopify/hydrogen';

// Optimised image with CDN sizing
<Image
  data={product.images.nodes[0]}
  sizes="(min-width: 768px) 50vw, 100vw"
  aspectRatio="1/1"
/>

// Formatted price
<Money data={product.priceRange.minVariantPrice} />

// Shop Pay button
<ShopPayButton
  variantIds={[selectedVariant.id]}
  storeDomain={shop.primaryDomain.url}
/>

````
##SEO```tsx
// In root.tsx or individual routes
import { getSeoMeta } from '@shopify/hydrogen';

export const meta = ({ data }) => {
  return getSeoMeta({
    title: data.product.title,
    description: data.product.description,
    url: `https://store.com/products/${data.product.handle}`,
    image: data.product.images.nodes[0]?.url,
  });
};
````

## Implantação

### Shopify Oxigênio (recomendado)```bash

# Deploy to Oxygen

npx shopify hydrogen deploy

# Environment variables managed in Shopify admin:

# Settings > Hydrogen > Environment variables

````
### Auto-hospedado (Cloudflare Workers, Vercel, etc.)```bash
# Build for production
npm run build

# Cloudflare Workers
npx wrangler deploy

# Node.js server
npm start
````

### Configuração do Vite```typescript

// vite.config.ts
import { defineConfig } from 'vite';
import { hydrogen } from '@shopify/hydrogen/vite';
import { reactRouter } from '@react-router/dev/vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
plugins: [
tailwindcss(),
hydrogen(),
reactRouter(),
],
});

```
## Melhores práticas

1. **Use estratégias de cache** - `CacheLong()` para coleções, `CacheShort()` para carrinho
2. **Minimize as consultas da API Storefront** - solicite apenas os campos necessários
3. **Use `defer`** para dados não críticos para melhorar o tempo até o primeiro byte
4. **Implemente SEO** com `getSeoMeta` em todas as rotas públicas
5. **Use componentes de hidrogênio** (imagem, dinheiro) para otimizações integradas
6. **Trate dos estados de carregamento** com `useFetcher` para operações de carrinho
7. **Configurar análises** wi

os utilitários analíticos integrados do Hydrogen
8. **Teste com oxigênio** antes de implantar em produção
9. **Use TypeScript** para segurança de tipo com respostas da API Storefront
10. **Mantenha as consultas colocadas** com arquivos de rota para manutenção
```
