# Otimização do Core Web Vitals

## Índice

- [LCP (maior pintura com conteúdo)](#lcp-maior-contentful-paint)
- [CLS (mudança cumulativa de layout)](#cls-cumulative-layout-shift)
- [INP (Interação com a próxima pintura)](#inp-interaction-to-next-paint)

---

## LCP (Maior pintura com conteúdo)

Meta: <2,5s

### Causas Comuns

- Grandes imagens não otimizadas
- Resposta lenta do servidor (TTFB)
- Recursos de bloqueio de renderização
- Atrasos na renderização do lado do cliente

### Correção: otimizar imagem LCP```html

<!-- Preload in <head> -->
<link rel="preload" as="image" href="/hero.webp" fetchpriority="high">

<!-- Image tag -->
<picture>
  <source srcset="/hero.avif" type="image/avif">
  <source srcset="/hero.webp" type="image/webp">
  <img src="/hero.jpg" alt="Hero" width="1200" height="600"
       loading="eager" fetchpriority="high" decoding="async">
</picture>
```
### Correção: Reduzir TTFB```javascript
// Next.js: Use static generation when possible
export async function getStaticProps() {
  const data = await fetchData();
  return { props: { data }, revalidate: 60 };
}

// Add stale-while-revalidate for dynamic content
// Cache-Control: public, s-maxage=60, stale-while-revalidate=300

````
---

## CLS (mudança cumulativa de layout)

Meta: <0,1

### Causas Comuns
- Imagens sem dimensões
- Anúncios/incorporações sem espaço reservado
- Fontes da Web causando FOIT/FOUT
- Injeção de conteúdo dinâmico

### Correção: reservar espaço para imagens```html
<!-- Always specify dimensions -->
<img src="/photo.jpg" alt="Photo" width="800" height="600">

<!-- Or use aspect-ratio -->
<img src="/photo.jpg" alt="Photo" style="aspect-ratio: 4/3; width: 100%;">
````

### Correção: reserve espaço para conteúdo dinâmico```css

/_ Skeleton loader with fixed height _/
.ad-slot {
min-height: 250px;
background: #f0f0f0;
}

/_ Aspect ratio container for embeds _/
.video-container {
aspect-ratio: 16/9;
width: 100%;
}

````
### Correção: evitar flash de fonte```css
@font-face {
  font-family: 'CustomFont';
  src: url('/font.woff2') format('woff2');
  font-display: swap; /* or optional for less shift */
}
````

---

## INP (Interação com a próxima pintura)

Alvo: <200ms

### Causas Comuns

- Tarefas JavaScript longas (>50ms)
- Manipuladores de eventos pesados
- Debulha de layout
- Muito trabalho no thread principal

### Correção: divida tarefas longas```javascript

// Before: blocks main thread
items.forEach(item => processItem(item));

// After: yield to main thread
async function processWithYield(items) {
for (const item of items) {
processItem(item);
// Yield every 5ms
if (performance.now() - start > 5) {
await new Promise(r => setTimeout(r, 0));
start = performance.now();
}
}
}

````
### Correção: manipuladores de eventos Debounce/Throttle```javascript
// Debounce search input
const search = debounce((query) => {
  fetchResults(query);
}, 300);

input.addEventListener('input', (e) => search(e.target.value));
````

### Correção: use CSS em vez de JS```css

/_ Prefer CSS for animations _/
.animate {
transition: transform 0.3s ease;
}
.animate:hover {
transform: scale(1.05);
}

/_ Use content-visibility for off-screen content _/
.lazy-section {
content-visibility: auto;
contain-intrinsic-size: 0 500px;
}

```

```
