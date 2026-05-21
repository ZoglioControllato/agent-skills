---
name: seo
description: Otimiza visibilidade e ranking em mecanismos de busca. Use quando pedirem "melhore o SEO", "otimize para busca", "corrija meta tags", "dados estruturados", "sitemap" ou "search engine optimization". NÃO use para acessibilidade (use web-accessibility), performance (use core-web-vitals) ou auditorias amplas (use web-quality-audit).
license: MIT
metadata:
  author: web-quality-skills
  version: '1.0'
---

# Otimização SEO

Otimização de mecanismos de pesquisa com base nas auditorias Lighthouse SEO e nas diretrizes da Pesquisa Google. Concentre-se em SEO técnico, otimização on-page e dados estruturados.

## Fundamentos de SEO

Fatores de classificação de pesquisa (influência aproximada):

| Fator                                   | Influência | Esta habilidade                                         |
| --------------------------------------- | ---------- | ------------------------------------------------------- |
| Qualidade e relevância do conteúdo      | ~40%       | Parcial (estrutura)                                     |
| Backlinks e autoridade                  | ~25%       | ✗                                                       |
| SEO técnico                             | ~15%       | ✓                                                       |
| Experiência de página (Core Web Vitals) | ~10%       | Consulte [Core Web Vitals](../core-web-vitals/SKILL.md) |
| SEO na página                           | ~10%       | ✓                                                       |

---

## SEO Técnico

### Rastreabilidade

**robôs.txt:**

```text
# /robots.txt
User-agent: *
Allow: /

# Block admin/private areas
Disallow: /admin/
Disallow: /api/
Disallow: /private/

# Don't block resources needed for rendering
# ❌ Disallow: /static/

Sitemap: https://example.com/sitemap.xml
```

**Meta-robôs:**

```html
<!-- Default: indexable, followable -->
<meta name="robots" content="index, follow" />

<!-- Noindex specific pages -->
<meta name="robots" content="noindex, nofollow" />

<!-- Indexable but don't follow links -->
<meta name="robots" content="index, nofollow" />

<!-- Control snippets -->
<meta name="robots" content="max-snippet:150, max-image-preview:large" />
```

**URLs canônicos:**

```html
<!-- Prevent duplicate content issues -->
<link rel="canonical" href="https://example.com/page" />

<!-- Self-referencing canonical (recommended) -->
<link rel="canonical" href="https://example.com/current-page" />

<!-- For paginated content -->
<link rel="canonical" href="https://example.com/products" />
<!-- Or use rel="prev" / rel="next" for explicit pagination -->
```

### Mapa do site XML

```xml

<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://example.com/</loc>
    <lastmod>2024-01-15</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://example.com/products</loc>
    <lastmod>2024-01-14</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>
```

**Mapa do site Boas práticas:**

- Máximo de 50.000 URLs ou 50 MB por sitemap
- Use o índice do mapa do site para sites maiores
- Incluir apenas URLs canônicos e indexáveis
- Atualize `lastmod` quando o conteúdo mudar
- Enviar para o Google Search Console

### Estrutura de URL

```

✅ Good URLs:
https://example.com/products/blue-widget
https://example.com/blog/how-to-use-widgets

❌ Poor URLs:
https://example.com/p?id=12345
https://example.com/products/item/category/subcategory/blue-widget-2024-sale-discount
```

**Diretrizes de URL:**

- Use hífens, não sublinhados
- Somente letras minúsculas
- Seja breve (<75 caracteres)
- Incluir palavras-chave alvo naturalmente
- Evite parâmetros quando possível
- Use HTTPS sempre

### HTTPS e segurança

```html
<!-- Ensure all resources use HTTPS -->
<img src="https://example.com/image.jpg" />

<!-- Not: -->
<img src="http://example.com/image.jpg" />
```

**Cabeçalhos de segurança para sinais de confiança de SEO:**

```
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
```

---

## SEO na página

### Tags de título

```html
<!-- ❌ Missing or generic -->
<title>Page</title>
<title>Home</title>

<!-- ✅ Descriptive with primary keyword -->
<title>Blue Widgets for Sale | Premium Quality | Example Store</title>
```

**Diretrizes para tags de título:**

- 50-60 caracteres (o Google trunca aproximadamente 60)
- Palavra-chave primária perto do início
- Único para cada página
- Nome da marca no final (exceto na página inicial)
- Orientado para a ação quando apropriado

### Meta descrições

```html
<!-- ❌ Missing or duplicate -->
<meta name="description" content="" />

<!-- ✅ Compelling and unique -->
<meta
  name="description"
  content="Shop premium blue widgets with free shipping. 30-day returns. Rated 4.9/5 by 10,000+ customers. Order today and save 20%."
/>
```

**Diretrizes para meta descrição:**

- 150-160 caracteres
- Incluir palavra-chave primária naturalmente
- Chamada para ação atraente
- Único para cada página
- Corresponde ao conteúdo da página

### Estrutura do título

```html
<!-- ❌ Poor structure -->
<h2>Welcome to Our Store</h2>
<h4>Products</h4>
<h1>Contact Us</h1>

<!-- ✅ Proper hierarchy -->
<h1>Blue Widgets - Premium Quality</h1>
<h2>Product Features</h2>
<h3>Durability</h3>
<h3>Design</h3>
<h2>Customer Reviews</h2>
<h2>Pricing</h2>
```

**Diretrizes de título:**

- Único `<h1>` por página (o tópico principal)
- Hierarquia lógica (não pule níveis)
- Incluir palavras-chave naturalmente
- Descritivo, não genérico

### SEO de imagem

```html
<!-- ❌ Poor image SEO -->
<img src="IMG_12345.jpg" />

<!-- ✅ Optimized image -->
<img
  src="blue-widget-product-photo.webp"
  alt="Blue widget with chrome finish, side view showing control panel"
  width="800"
  height="600"
  loading="lazy"
/>
```

**Diretrizes de imagem:**

- Nomes de arquivos descritivos com palavras-chave
- O texto alternativo descreve o conteúdo da imagem
- Compactado e dimensionado adequadamente
- WebP/AVIF com substitutos
- Carregamento lento de imagens abaixo da dobra

### Link interno

```html
<!-- ❌ Non-descriptive -->
<a href="/products">Click here</a>
<a href="/widgets">Read more</a>

<!-- ✅ Descriptive anchor text -->
<a href="/products/blue-widgets">Browse our blue widget collection</a>
<a href="/guides/widget-maintenance">Learn how to maintain your widgets</a>
```

**Diretrizes de vinculação:**

- Texto âncora descritivo com palavras-chave
- Link para páginas internas relevantes
- Número razoável de links por página
- Corrija links quebrados imediatamente
- Use breadcrumbs para hierarquia

---

## Dados estruturados (JSON-LD)

### Organização

```html
<script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Example Company",
    "url": "https://example.com",
    "logo": "https://example.com/logo.png",
    "sameAs": ["https://twitter.com/example", "https://linkedin.com/company/example"],
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+1-555-123-4567",
      "contactType": "customer service"
    }
  }
</script>
```

### Artigo

```html
<script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "How to Choose the Right Widget",
    "description": "Complete guide to selecting widgets for your needs.",
    "image": "https://example.com/article-image.jpg",
    "author": {
      "@type": "Person",
      "name": "Jane Smith",
      "url": "https://example.com/authors/jane-smith"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Example Blog",
      "logo": {
        "@type": "ImageObject",
        "url": "https://example.com/logo.png"
      }
    },
    "datePublished": "2024-01-15",
    "dateModified": "2024-01-20"
  }
</script>
```

### Produto

```html
<script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "Blue Widget Pro",
    "image": "https://example.com/blue-widget.jpg",
    "description": "Premium blue widget with advanced features.",
    "brand": {
      "@type": "Brand",
      "name": "WidgetCo"
    },
    "offers": {
      "@type": "Offer",
      "price": "49.99",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock",
      "url": "https://example.com/products/blue-widget"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "1250"
    }
  }
</script>
```

### PERGUNTAS FREQUENTES

```html
<script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What colors are available?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Our widgets come in blue, red, and green."
        }
      },
      {
        "@type": "Question",
        "name": "What is the warranty?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "All widgets include a 2-year warranty."
        }
      }
    ]
  }
</script>
```

### Pão ralado

```html
<script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://example.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Products",
        "item": "https://example.com/products"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "Blue Widgets",
        "item": "https://example.com/products/blue-widgets"
      }
    ]
  }
</script>
```

### Validação

Teste dados estruturados em:

- [Teste de pesquisa aprimorada do Google](https://search.google.com/test/rich-results)
- [Validador Schema.org](https://validator.schema.org/)

---

## SEO móvel

### Design responsivo

```html
<!-- ❌ Not mobile-friendly -->
<meta name="viewport" content="width=1024" />

<!-- ✅ Responsive viewport -->
<meta name="viewport" content="width=device-width, initial-scale=1" />
```

### Toque nos alvos

```css
/* ❌ Too small for mobile */
.small-link {
  padding: 4px;
  font-size: 12px;
}

/* ✅ Adequate tap target */
.mobile-friendly-link {
  padding: 12px;
  font-size: 16px;
  min-height: 48px;
  min-width: 48px;
}
```

### Tamanhos de fonte

```css
/* ❌ Too small on mobile */
body {
  font-size: 10px;
}

/* ✅ Readable without zooming */
body {
  font-size: 16px;
  line-height: 1.5;
}
```

---

## SEO internacional

### Tags Hreflang

```html
<!-- For multi-language sites -->
<link rel="alternate" hreflang="en" href="https://example.com/page" />
<link rel="alternate" hreflang="es" href="https://example.com/es/page" />
<link rel="alternate" hreflang="fr" href="https://example.com/fr/page" />
<link rel="alternate" hreflang="x-default" href="https://example.com/page" />
```

### Declaração de idioma

```html
<html lang="en">
  <!-- or -->
  <html lang="es-MX"></html>
</html>
```

---

## Lista de verificação de auditoria de SEO

### Crítico

- [] HTTPS ativado
- [] robots.txt permite rastreamento
- [] Não há `noindex` em páginas importantes
- [] Tags de título presentes e exclusivas
- [] Único `<h1>` por página

### Alta prioridade

- [] Meta descrições presentes
- [] Mapa do site enviado
- [] URLs canônicos definidos
- [] responsivo a dispositivos móveis
- [] aprovação do Core Web Vitals

### Prioridade média

- [] Dados estruturados implementados
- [] Estratégia de vinculação interna
- [] Texto alternativo da imagem
- [] URLs descritivos
- [] Navegação estrutural

### Em andamento

- [] Corrigir erros de rastreamento no Search Console
- [] Atualizar o mapa do site quando o conteúdo for alterado
- [] Monitorar mudanças de classificação
- [] Verifique se há links quebrados
- [] Revise os insights do Search Console

---

## Ferramentas

| Ferramenta                         | Usar                                    |
| ---------------------------------- | --------------------------------------- |
| Console de pesquisa do Google      | Monitore a indexação, corrija problemas |
| Informações do Google PageSpeed ​​ | Desempenho + Core Web Vitals            |
| Teste de pesquisa aprimorada       | Validar dados estruturados              |
| Farol                              | Auditoria completa de SEO               |
| Sapo gritando                      | Análise de rastreamento                 |

## Referências

- [Central de Pesquisa Google](https://developers.google.com/search)
- [Schema.org](https://schema.org/)
- [Core Web Vitals](../core-web-vitals/SKILL.md)
- [Auditoria de qualidade da Web](../web-quality-audit/SKILL.md)
