---
name: perf-astro
description: 'Otimizações de performance específicas de Astro para scores Lighthouse 95+. Cobre critical CSS inline, compressão, carregamento de fontes e otimização de LCP. Use quando otimizar performance de site Astro, melhorar scores Lighthouse em Astro ou configurar astro-critters. NÃO use para sites que não sejam Astro (use perf-web-optimization ou core-web-vitals) ou para rodar auditorias Lighthouse (use perf-lighthouse).'
---

# Guia de performance Astro

Otimizações específicas de Astro para scores Lighthouse acima de 95.

## Configuração rápida

```bash
npm install astro-critters @playform/compress
```

```js
// astro.config.mjs
import { defineConfig } from 'astro/config'
import critters from 'astro-critters'
import compress from '@playform/compress'

export default defineConfig({
  integrations: [
    critters(),
    compress({
      CSS: true,
      HTML: true,
      JavaScript: true,
      Image: false,
      SVG: false,
    }),
  ],
})
```

## Integrações

### astro-critters

Extrai e inclui automaticamente CSS crítico. Sem configuração obrigatória.

O que faz:

- Varre o HTML renderizado em busca de elementos above-the-fold
- Injeta só o CSS necessário para esses elementos
- Carrega o restante com lazy loading

O build mostra o que foi inlined:

```
Inlined 40.70 kB (80% of original 50.50 kB) of _astro/index.xxx.css.
```

### @playform/compress

Minifica HTML, CSS e JavaScript no build final.

Opções:

```js
compress({
  CSS: true, // Minificar CSS
  HTML: true, // Minificar HTML
  JavaScript: true, // Minificar JS
  Image: false, // Pular se usar otimização externa de imagem
  SVG: false, // Pular se SVGs já estiverem otimizados
})
```

## Padrão de layout

Estruture seu `Layout.astro` pensando em performance:

```astro
---
import '../styles/global.css'
---

<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <!-- Font fallback (prevents FOIT) -->
    <style>
      @font-face {
        font-family: 'Inter';
        font-display: swap;
        src: local('Inter');
      }
    </style>

    <!-- Non-blocking Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link
      rel="stylesheet"
      href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap"
      media="print"
      onload="this.media='all'"
    />
    <noscript>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap">
    </noscript>

    <!-- Preload LCP images -->
    <link rel="preload" as="image" href="/hero.png" fetchpriority="high">

    <title>{title}</title>

    <!-- Defer third-party scripts -->
    <script>
      let loaded = false;
      function loadAnalytics() {
        if (loaded) return;
        loaded = true;
        // Load GTM, analytics, etc.
      }
      ['scroll', 'click', 'touchstart'].forEach(e => {
        document.addEventListener(e, loadAnalytics, { once: true, passive: true });
      });
      setTimeout(loadAnalytics, 5000);
    </script>
  </head>
  <body>
    <slot />
  </body>
</html>
```

## Medição

```bash
npx lighthouse https://your-site.com --preset=perf --form-factor=mobile
```

Veja também:

- **perf-lighthouse** — rodar auditorias, ler relatórios, definir budgets
- **perf-web-optimization** — Core Web Vitals, tamanho de bundle, cache

## Checklist

- [ ] `astro-critters` instalado e configurado
- [ ] `@playform/compress` instalado e configurado
- [ ] Google Fonts com padrão `media="print" onload`
- [ ] Scripts de terceiros adiados até interação do usuário
- [ ] Imagens LCP com preload no `<head>`
