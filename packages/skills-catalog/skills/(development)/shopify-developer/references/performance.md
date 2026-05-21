# Referência de otimização de desempenho

Orientação especializada para otimizar o desempenho da loja Shopify, incluindo velocidade do tema, otimização de ativos e Core Web Vitals.

## Capacidades principais

### 1. Otimização de imagem

As imagens são normalmente os maiores ativos – otimize agressivamente.

**Use o dimensionamento de imagem CDN do Shopify:**

```liquid
{# ❌ Don't load full-size images #}
<img src="{{ product.featured_image.src }}" alt="{{ product.title }}">

{# ✅ Use img_url filter with appropriate size #}
<img
  src="{{ product.featured_image | img_url: '800x800' }}"
  alt="{{ product.featured_image.alt | escape }}"
  loading="lazy"
  width="800"
  height="800"
>
```

**Imagens responsivas:**

```liquid
<img
  src="{{ image | img_url: '800x' }}"
  srcset="
    {{ image | img_url: '400x' }} 400w,
    {{ image | img_url: '800x' }} 800w,
    {{ image | img_url: '1200x' }} 1200w,
    {{ image | img_url: '1600x' }} 1600w
  "
  sizes="(max-width: 600px) 400px, (max-width: 1200px) 800px, 1200px"
  alt="{{ image.alt | escape }}"
  loading="lazy"
  width="800"
  height="800"
>
```

**Formatos de imagem modernos:**

```liquid
<picture>
  {# WebP for modern browsers #}
  <source
    type="image/webp"
    srcset="
      {{ image | img_url: '400x', format: 'pjpg' }} 400w,
      {{ image | img_url: '800x', format: 'pjpg' }} 800w
    "
  >

  {# Fallback to JPEG #}
  <img
    src="{{ image | img_url: '800x' }}"
    srcset="
      {{ image | img_url: '400x' }} 400w,
      {{ image | img_url: '800x' }} 800w
    "
    alt="{{ image.alt | escape }}"
    loading="lazy"
  >
</picture>
```

**Carregamento lento:**

```liquid
{# Native lazy loading #}
<img
  src="{{ image | img_url: '800x' }}"
  alt="{{ image.alt | escape }}"
  loading="lazy"
  decoding="async"
>

{# Eager load above-the-fold images #}
{% if forloop.index <= 3 %}
  <img src="{{ image | img_url: '800x' }}" loading="eager">
{% else %}
  <img src="{{ image | img_url: '800x' }}" loading="lazy">
{% endif %}
```

**Pré-carregar imagens críticas:**

```liquid
{# In <head> for hero images #}
<link
  rel="preload"
  as="image"
  href="{{ section.settings.hero_image | img_url: '1920x' }}"
  imagesrcset="
    {{ section.settings.hero_image | img_url: '800x' }} 800w,
    {{ section.settings.hero_image | img_url: '1920x' }} 1920w
  "
  imagesizes="100vw"
>
```

### 2. Otimização de JavaScript

Reduza a carga útil e o tempo de execução do JS.

**Adiar JavaScript não crítico:**

```html
{# ❌ Blocking JavaScript #}
<script src="{{ 'theme.js' | asset_url }}"></script>

{# ✅ Deferred JavaScript #}
<script src="{{ 'theme.js' | asset_url }}" defer></script>

{# ✅ Async for independent scripts #}
<script src="{{ 'analytics.js' | asset_url }}" async></script>
```

**JavaScript crítico embutido:**

```liquid
{# Inline small, critical scripts #}
<script>
  // Critical initialisation code
  document.documentElement.classList.remove('no-js');
  document.documentElement.classList.add('js');
</script>
```

**Divisão de código:**

```javascript
// Load features only when needed
async function loadCart() {
  const { Cart } = await import('./cart.js')
  return new Cart()
}

// Load on interaction
document.querySelector('.cart-icon').addEventListener(
  'click',
  async () => {
    const cart = await loadCart()
    cart.open()
  },
  { once: true },
)
```

**Remover JavaScript não utilizado:**

```javascript
// ❌ Don't load libraries you don't use
// Example: Don't include entire jQuery if you only need a few functions

// ✅ Use native alternatives
// Instead of: $('.selector').hide()
// Use: document.querySelector('.selector').style.display = 'none';

// Instead of: $.ajax()
// Use: fetch()
```

**Minimizar JavaScript:**

```bash
# Use build tools to minify
npm install terser --save-dev

# Minify
terser theme.js -o theme.min.js -c -m
```

### 3. Otimização CSS

Otimize folhas de estilo para renderização mais rápida.

**CSS crítico:**

```liquid
{# Inline critical above-the-fold CSS in <head> #}
<style>
  /* Critical CSS only (header, hero) */
  .header { /* ... */ }
  .hero { /* ... */ }
  .button { /* ... */ }
</style>

{# Load full CSS deferred #}
<link
  rel="preload"
  href="{{ 'theme.css' | asset_url }}"
  as="style"
  onload="this.onload=null;this.rel='stylesheet'"
>
<noscript>
  <link rel="stylesheet" href="{{ 'theme.css' | asset_url }}">
</noscript>
```

**Remover CSS não utilizado:**

```bash
# Use PurgeCSS to remove unused styles
npm install @fullhuman/postcss-purgecss --save-dev

# Configure in postcss.config.js
module.exports = {
  plugins: [
    require('@fullhuman/postcss-purgecss')({
      content: ['./**/*.liquid'],
      defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || [],
    }),
  ],
};
```

**Minimizar CSS:**

```bash
# Use cssnano
npm install cssnano --save-dev

# Minify
npx cssnano style.css style.min.css
```

**Evite @importar:**

```css
/* ❌ Don't use @import (blocks rendering) */
@import url('fonts.css');

/* ✅ Use multiple <link> tags instead */
```

```liquid
<link rel="stylesheet" href="{{ 'main.css' | asset_url }}">
<link rel="stylesheet" href="{{ 'fonts.css' | asset_url }}">
```

### 4. Otimização de fontes

Otimize fontes da web para renderização de texto mais rápida.

**Carregamento de fonte:**

```liquid
{# Preload fonts #}
<link
  rel="preload"
  href="{{ 'font.woff2' | asset_url }}"
  as="font"
  type="font/woff2"
  crossorigin
>

{# Font face with font-display #}
<style>
  @font-face {
    font-family: 'CustomFont';
    src: url('{{ 'font.woff2' | asset_url }}') format('woff2');
    font-weight: 400;
    font-style: normal;
    font-display: swap; /* Show fallback font immediately */
  }
</style>
```

**Pilha de fontes do sistema:**

```css
/* Use system fonts for instant rendering */
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}
```

**Fontes de subconjunto:**

```css
/* Load only required characters */
@font-face {
  font-family: 'CustomFont';
  src: url('font-latin.woff2') format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153;
}
```

### 5. Otimização de modelo líquido

Otimize a renderização líquida para uma resposta mais rápida do servidor.

**Operações caras em cache:**

```liquid
{# ❌ Repeated calculations #}
{% for i in (1..10) %}
  {{ collection.products.size }}  {# Calculated 10 times #}
{% endfor %}

{# ✅ Cache result #}
{% assign product_count = collection.products.size %}
{% for i in (1..10) %}
  {{ product_count }}
{% endfor %}
```

**Limite de uso e compensação:**

```liquid
{# ❌ Iterate full array and break #}
{% for product in collection.products %}
  {% if forloop.index > 5 %}{% break %}{% endif %}
  {{ product.title }}
{% endfor %}

{# ✅ Use limit #}
{% for product in collection.products limit: 5 %}
  {{ product.title }}
{% endfor %}
```

**Evite loops aninhados:**

```liquid
{# ❌ O(n²) complexity #}
{% for product in collection.products %}
  {% for variant in product.variants %}
    {# Expensive nested loop #}
  {% endfor %}
{% endfor %}

{# ✅ Flatten or preprocess #}
{% assign all_variants = collection.products | map: 'variants' | flatten %}
{% for variant in all_variants limit: 50 %}
  {{ variant.title }}
{% endfor %}
```

**Prefira renderização em vez de incluir:**

```liquid
{# ❌ include (slower, shared scope) #}
{% include 'product-card' %}

{# ✅ render (faster, isolated scope) #}
{% render 'product-card', product: product %}
```

**Use folhas de estilo específicas da seção:**

```liquid
{# Scope CSS to section for better caching #}
{% stylesheet %}
  .my-section { /* ... */ }
{% endstylesheet %}

{# Scope JavaScript to section #}
{% javascript %}
  class MySection { /* ... */ }
{% endjavascript %}
```

### 6. Otimização de scripts de terceiros

Minimize o impacto de scripts externos.

**Adiar scripts de terceiros:**

```liquid
{# ❌ Blocking third-party script #}
<script src="https://external.com/script.js"></script>

{# ✅ Async or defer #}
<script src="https://external.com/script.js" async></script>

{# ✅ Load on user interaction #}
<script>
  let gaLoaded = false;
  function loadGA() {
    if (gaLoaded) return;
    const script = document.createElement('script');
    script.src = 'https://www.googletagmanager.com/gtag/js?id=GA_ID';
    script.async = true;
    document.head.appendChild(script);
    gaLoaded = true;
  }

  // Load on scroll or after delay
  window.addEventListener('scroll', loadGA, { once: true });
  setTimeout(loadGA, 3000);
</script>
```

**Usar padrão de fachada:**

```html
{# Show placeholder instead of embedding heavy iframe #}
<div class="video-facade" data-video-id="abc123">
  <img src="thumbnail.jpg" alt="Video" />
  <button onclick="loadVideo(this)">Play Video</button>
</div>

<script>
  function loadVideo(btn) {
    const facade = btn.parentElement
    const videoId = facade.dataset.videoId
    const iframe = document.createElement('iframe')
    iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`
    facade.replaceWith(iframe)
  }
</script>
```

### 7. Estratégias de cache

Aproveite o cache do navegador e do CDN.

**Versão de ativos:**

```liquid
{# Shopify auto-versions assets #}
<link rel="stylesheet" href="{{ 'theme.css' | asset_url }}">
{# Outputs: /cdn/.../theme.css?v=12345678 #}
```

**Cabeçalhos de cache longos:**

```liquid
{# Shopify CDN sets appropriate cache headers #}
{# CSS/JS: 1 year #}
{# Images: 1 year #}
```

**Trabalhador de serviço (avançado):**

```javascript
// sw.js - Cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('v1').then((cache) => {
      return cache.addAll(['/cdn/.../theme.css', '/cdn/.../theme.js', '/cdn/.../logo.png'])
    }),
  )
})

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request)
    }),
  )
})
```

### 8. Otimização dos principais sinais vitais da Web

Melhore as métricas Core Web Vitals do Google.

**Maior pintura com conteúdo (LCP):**

```liquid
{# Optimise largest element load time #}

{# 1. Preload hero image #}
<link rel="preload" as="image" href="{{ hero_image | img_url: '1920x' }}">

{# 2. Use priority hint #}
<img src="{{ hero_image | img_url: '1920x' }}" fetchpriority="high">

{# 3. Optimise server response time (use Shopify CDN) #}

{# 4. Remove render-blocking resources #}
<script src="theme.js" defer></script>
```

**Interação com a próxima pintura (INP):**

```javascript
// 1. Reduce JavaScript execution time
// 2. Break up long tasks
function processItems(items) {
  // ❌ Long task
  items.forEach((item) => processItem(item))

  // ✅ Break into smaller chunks
  async function processInChunks() {
    for (let i = 0; i < items.length; i++) {
      processItem(items[i])

      // Yield to main thread every 50 items
      if (i % 50 === 0) {
        await new Promise((resolve) => setTimeout(resolve, 0))
      }
    }
  }
  processInChunks()
}

// 3. Use requestIdleCallback
requestIdleCallback(() => {
  // Non-critical work
})
```

**Mudança cumulativa de layout (CLS):**

```liquid
{# 1. Always set width and height on images #}
<img
  src="{{ image | img_url: '800x' }}"
  width="800"
  height="600"
  alt="Product"
>

{# 2. Reserve space for dynamic content #}
<div style="min-height: 400px;">
  {# Content loads here #}
</div>

{# 3. Use aspect-ratio for responsive images #}
<style>
  .image-container {
    aspect-ratio: 16 / 9;
  }
</style>
```

### 9. Monitoramento de desempenho

Acompanhe as métricas de desempenho.

**Avalie os principais sinais vitais da Web:**

```javascript
// Load web-vitals library
import { getCLS, getINP, getLCP } from 'web-vitals'

function sendToAnalytics({ name, value, id }) {
  // Send to analytics
  gtag('event', name, {
    event_category: 'Web Vitals',
    event_label: id,
    value: Math.round(name === 'CLS' ? value * 1000 : value),
  })
}

getCLS(sendToAnalytics)
getINP(sendToAnalytics)
getLCP(sendToAnalytics)
```

**Observador de desempenho:**

```javascript
// Monitor long tasks
const observer = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    console.warn('Long task detected:', entry.duration, 'ms')
  }
})

observer.observe({ entryTypes: ['longtask'] })
```

## Lista de verificação de desempenho

**Imagens:**

- [] Use o filtro `img_url` com tamanhos apropriados
- [] Implementar imagens responsivas com `srcset`
- [] Adicione `loading="lazy"` às imagens abaixo da dobra
- [] Definir atributos explícitos de `largura` e `altura`
- [] Pré-carregar imagens críticas de heróis
- [ ] Use formatos modernos (WebP)

**JavaScript:**

- [] Adiar ou assincronizar todos os scripts não críticos
- [] Minificar e agrupar JavaScript
- [] Pacotes grandes divididos em código
- [] Remover código não utilizado
- [] Recursos de carregamento lento na interação

**CSS:**

- [] CSS crítico embutido
- [] Adiar CSS não crítico
- [] Remover estilos não utilizados
- [] Minimizar folhas de estilo
- [] Evite `@import`

**Fontes:**

- [] Pré-carregar fontes críticas
- [] Use `font-display: swap`
- [] Considere a pilha de fontes do sistema
- [] Subconjunto de fontes quando possível

**Terceiros:**

- [] Auditar todos os scripts de terceiros
- [] Carregar scripts assíncronos ou em interação
- [] Use padrão de fachada para incorporações pesadas
- [] Monitorar o impacto de terceiros

**Líquido:**

- [] Cálculos caros em cache
- [] Use `limit` em vez de quebras manuais
- [] Prefira `render` em vez de `include`
- [] Evite loops aninhados

**Principais sinais vitais da Web:**

- [ ] LCP < 2,5s
- [ ] INP <200ms
- [ ] CLS < 0,1

## Melhores práticas

1. **Teste em dispositivos reais** – O desempenho do 3G móvel é importante
2. **Use o Lighthouse** para auditorias de desempenho
3. **Monitore os principais sinais vitais da Web** em produção
4. **Otimize primeiro o conteúdo acima da dobra**
5. **Carregar lentamente todo o resto** abaixo da dobra
6. **Minimize o trabalho do thread principal** para melhor interatividade
7. **Use Shopify CDN** para todos os ativos
8. **Ativos de versão** para armazenamento em cache eficaz
9. **Compactar imagens** antes de enviar
10. \*\*Desempenho regular a

auditorias \*\* para capturar regressões
