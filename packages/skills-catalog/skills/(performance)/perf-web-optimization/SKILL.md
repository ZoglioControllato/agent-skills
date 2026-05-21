---
name: perf-web-optimization
description: 'Otimize performance web: tamanho de bundle, imagens, cache, lazy loading e velocidade geral da página. Use quando o site estiver lento, para reduzir bundle, corrigir layout shift, melhorar Time to Interactive ou otimizar para scores Lighthouse. Aciona em performance web, tamanho de bundle, velocidade da página, site lento, lazy loading. NÃO use para correções específicas só de Core Web Vitals (use core-web-vitals), rodar auditorias Lighthouse (use perf-lighthouse) ou otimização específica de Astro (use perf-astro).'
---

# Otimização de performance web

Abordagem sistemática: Medir → Identificar → Priorizar → Implementar → Verificar.

## Métricas alvo

| Métrica | Bom     | Precisa melhorar | Ruim    |
| ------- | ------- | ---------------- | ------- |
| LCP     | < 2.5s  | 2.5-4s           | > 4s    |
| INP     | < 200ms | 200-500ms        | > 500ms |
| CLS     | < 0.1   | 0.1-0.25         | > 0.25  |
| TTFB    | < 800ms | 800ms-1.8s       | > 1.8s  |

## Vitórias rápidas

### 1. Imagens (geralmente maior impacto no LCP)

```html
<!-- Hero/LCP: eager + alta prioridade -->
<img src="/hero.webp" alt="Hero" width="1200" height="600" loading="eager" fetchpriority="high" decoding="async" />

<!-- Abaixo da dobra: lazy -->
<img src="/product.webp" alt="Product" width="400" height="300" loading="lazy" decoding="async" />
```

Sempre defina `width` e `height` para evitar CLS.

### 2. Fontes (vilã comum de LCP/CLS)

```html
<!-- Preconnect na origem da fonte -->
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />

<!-- Carregamento não bloqueante -->
<link
  rel="stylesheet"
  href="https://fonts.googleapis.com/css2?family=Inter&display=swap"
  media="print"
  onload="this.media='all'"
/>
```

### 3. Scripts de terceiros (comum no INP)

```html
<!-- Adiar até interação -->
<script>
  function loadThirdParty() {
    // Analytics, widgets de chat, etc.
  }
  ;['scroll', 'click', 'touchstart'].forEach((e) => addEventListener(e, loadThirdParty, { once: true, passive: true }))
  setTimeout(loadThirdParty, 5000)
</script>
```

### 4. CSS crítico

Inline do CSS crítico em `<head>`, adie o restante:

```html
<style>
  /* critical styles */
</style>
<link rel="preload" href="/styles.css" as="style" onload="this.rel='stylesheet'" />
```

## Análise de bundle

```bash
# Webpack
npx webpack-bundle-analyzer dist/stats.json

# Vite
npx vite-bundle-visualizer

# Tamanho do pacote antes de instalar
npx bundlephobia <package-name>
```

Pacotes pesados comuns para substituir:

- `moment` (67KB) → `date-fns` (12KB) ou `dayjs` (2KB)
- `lodash` (72KB) → imports pontuais ou nativo

## Padrões de code splitting

```javascript
// React lazy
const Chart = lazy(() => import('./Chart'))

// Next.js dynamic
const Admin = dynamic(() => import('./Admin'), { ssr: false })

// Vite/Rollup manual chunks
build: {
  rollupOptions: {
    output: {
      manualChunks: {
        vendor: ['react', 'react-dom']
      }
    }
  }
}
```

## Headers de cache

```
# Assets estáticos (hash imutável no nome)
Cache-Control: public, max-age=31536000, immutable

# HTML (revalidar)
Cache-Control: no-cache

# Respostas de API
Cache-Control: private, max-age=0, must-revalidate
```

## Medição

Para rodar auditorias, ler relatórios e definir budgets, use a skill **perf-lighthouse**.

## Checklist

### Imagens

- [ ] Formatos modernos (WebP/AVIF)
- [ ] `srcset` responsivo
- [ ] Atributos `width`/`height`
- [ ] `loading="lazy"` abaixo da dobra
- [ ] `fetchpriority="high"` na imagem LCP

### JavaScript

- [ ] Bundle < 200KB gzipped
- [ ] Code splitting por rota
- [ ] Scripts de terceiros adiados
- [ ] Sem dependências não usadas

### CSS

- [ ] CSS crítico inlined
- [ ] CSS não crítico adiado
- [ ] Sem CSS não usado

### Fontes

- [ ] `font-display: swap`
- [ ] Preconnect na origem
- [ ] Subset quando possível

## Exemplos detalhados

Padrões aprofundados em:

- [references/core-web-vitals.md](references/core-web-vitals.md) — LCP, CLS, INP
- [references/bundle-optimization.md](references/bundle-optimization.md) — reduzir bundle JS
- [references/image-optimization.md](references/image-optimization.md) — formatos, imagens responsivas, scripts sharp
