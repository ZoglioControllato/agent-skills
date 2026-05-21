# Referência de otimização LCP

## O que é LCP?

Largest Contentful Paint (LCP) mede quando o maior elemento de conteúdo na janela de visualização se torna visível. Isso normalmente é:

- Um elemento `<img>`
- Um elemento `<image>` dentro de `<svg>`
- Um elemento `<video>` com imagem de pôster
- Um elemento com imagem de fundo via `url()`
- Um elemento de nível de bloco contendo nós de texto

## Cronograma do LCP```

[ Server Response ][ Resource Load ][ Render ]
TTFB Download Paint
└─────────────────────────────────────┘
LCP Time

````
## Otimizações detalhadas

### 1. Tempo de resposta do servidor (TTFB)

Alvo: <800ms

**Causas:**

- Consultas lentas de servidor/banco de dados
- Sem cache CDN/edge
- Código de back-end ineficiente
- Inicializações a frio (sem servidor)

**Soluções:**

```javascript
// Use edge functions for dynamic content
// Vercel example
export const config = { runtime: 'edge' }

// Use stale-while-revalidate caching
// Cache-Control header
res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300')
````

### 2. Tempo de carregamento de recursos

**Para imagens:**

```html
<!-- Preload LCP image -->
<link
  rel="preload"
  as="image"
  href="/hero.webp"
  imagesrcset="/hero-400.webp 400w, /hero-800.webp 800w"
  imagesizes="100vw"
  fetchpriority="high"
/>

<!-- Modern format with fallback -->
<picture>
  <source srcset="/hero.avif" type="image/avif" />
  <source srcset="/hero.webp" type="image/webp" />
  <img src="/hero.jpg" width="1200" height="600" fetchpriority="high" alt="Hero" />
</picture>
```

**Para texto (fontes da web):**

```css
@font-face {
  font-family: 'Heading';
  src: url('/fonts/heading.woff2') format('woff2');
  font-display: swap; /* Show fallback immediately */
}
```

### 3. Recursos de bloqueio de renderização

**Padrão CSS crítico:**

```html
<head>
  <!-- Inline critical CSS -->
  <style>
    /* Only above-fold styles, < 14KB */
    .hero {
      /* ... */
    }
    .nav {
      /* ... */
    }
  </style>

  <!-- Defer non-critical CSS -->
  <link rel="preload" href="/styles.css" as="style" onload="this.onload=null;this.rel='stylesheet'" />
</head>
```

**Adiar JavaScript:**

```html
<!-- ❌ Blocks parsing -->
<script src="/app.js"></script>

<!-- ✅ Deferred (runs after HTML parsed) -->
<script defer src="/app.js"></script>

<!-- ✅ Module (deferred by default) -->
<script type="module" src="/app.mjs"></script>
```

### 4. Renderização do lado do cliente

**Problema:** Conteúdo não está no HTML inicial.

**Soluções:**

**Renderização do lado do servidor (SSR):**

```javascript
// Next.js
export async function getServerSideProps() {
  const data = await fetchHeroContent()
  return { props: { hero: data } }
}
```

**Geração de site estático (SSG):**

```javascript
// Next.js
export async function getStaticProps() {
  const data = await fetchHeroContent()
  return { props: { hero: data }, revalidate: 3600 }
}
```

**SSR de transmissão:**

```jsx
// React 18+
import { Suspense } from 'react'

function Page() {
  return (
    <Suspense fallback={<HeroSkeleton />}>
      <Hero />
    </Suspense>
  )
}
```

## Dicas específicas do framework

### Próximo.js```jsx

import Image from 'next/image'

// LCP image with priority
;<Image src="/hero.jpg" priority fill sizes="100vw" alt="Hero" />

````
### Nuxt```vue
<NuxtImg src="/hero.jpg" preload loading="eager" sizes="100vw" />
````

### Astro```astro

---

import { Image } from 'astro:assets';
import hero from '../assets/hero.jpg';

---

<Image
  src={hero}
  loading="eager"
  decoding="sync"
  alt="Hero"
/>

````
## Depurando LCP```javascript
// Identify LCP element
new PerformanceObserver((entryList) => {
  const entries = entryList.getEntries()
  const lastEntry = entries[entries.length - 1]

  console.log('LCP:', {
    element: lastEntry.element,
    time: lastEntry.startTime,
    size: lastEntry.size,
    url: lastEntry.url,
    renderTime: lastEntry.renderTime,
    loadTime: lastEntry.loadTime,
  })
}).observe({ type: 'largest-contentful-paint', buffered: true })
````

## Problemas comuns

| Edição                               | Impacto     | Correção                        |
| ------------------------------------ | ----------- | ------------------------------- |
| Sem pré-carregamento para imagem LCP | +500-1000ms | Adicione `<link rel="preload">` |
| Imagem grande não otimizada          | +300-800ms  | Compactar, usar WebP/AVIF       |
| CSS de bloqueio de renderização      | +200-500ms  | CSS crítico embutido            |
| TTFB lento                           | +300-2000ms | CDN, cache de borda             |

| Renderizado pelo cliente

conteúdo | +500-2000ms | RSS/SSG |
