# Referência de Desenvolvimento de Tema

Orientação especializada para desenvolvimento de temas do Shopify, incluindo estrutura de arquivos, arquitetura da Loja Online 2.0, seções, snippets e configuração.

## Capacidades principais

### 1. Estrutura do arquivo de tema

Organização de diretório completa para temas do Shopify:```
theme/
├── assets/ {# Static resources #}
│ ├── style.css {# Main stylesheet #}
│ ├── style.css.liquid {# Dynamic CSS with Liquid #}
│ ├── theme.js {# Main JavaScript #}
│ ├── theme.js.liquid {# Dynamic JS with Liquid #}
│ ├── logo.png {# Images #}
│ └── fonts/ {# Custom fonts #}
│
├── config/ {# Configuration #}
│ ├── settings_schema.json {# Theme settings UI #}
│ └── settings_data.json {# Default values #}
│
├── layout/ {# Master templates #}
│ ├── theme.liquid {# Main wrapper #}
│ ├── password.liquid {# Password protection #}
│ └── checkout.liquid {# Checkout (Plus only) (deprecated - use Checkout Extensibility) #}
│
├── locales/ {# Translations #}
│ ├── en.default.json {# English #}
│ └── fr.json {# French #}
│
├── sections/ {# Reusable sections #}
│ ├── header.liquid
│ ├── hero-banner.liquid
│ ├── product-card.liquid
│ └── footer.liquid
│
├── snippets/ {# Reusable partials #}
│ ├── product-price.liquid
│ ├── product-rating.liquid
│ └── icon.liquid
│
└── templates/ {# Page templates #}
├── index.json {# Homepage (JSON) #}
├── product.json {# Product page (JSON) #}
├── collection.json {# Collection page (JSON) #}
├── product.liquid {# Product (Liquid - legacy) #}
├── cart.liquid
├── search.liquid
├── page.liquid
├── 404.liquid
└── customers/
├── account.liquid
├── login.liquid
└── register.liquid

````

**Tema Horizon:** o mais novo tema de referência da Shopify (2025) - usa consultas de contêiner, API View Transitions e propriedades personalizadas CSS. Substitui Dawn como ponto de partida recomendado para novos temas.

### 2. Modelos JSON (Loja Online 2.0)

Formato de modelo moderno usando configuração JSON:

**templates/index.json (página inicial):**

```json
{
  "sections": {
    "hero": {
      "type": "hero-banner",
      "settings": {
        "heading": "Summer Collection",
        "subheading": "New arrivals",
        "button_text": "Shop Now",
        "button_link": "/collections/all"
      }
    },
    "featured": {
      "type": "featured-products",
      "blocks": {
        "block_1": {
          "type": "product",
          "settings": {
            "product": "snowboard"
          }
        },
        "block_2": {
          "type": "product",
          "settings": {
            "product": "skateboard"
          }
        }
      },
      "block_order": ["block_1", "block_2"],
      "settings": {
        "title": "Featured Products",
        "products_to_show": 4
      }
    }
  },
  "order": ["hero", "featured"]
}
````

**modelos/produto.json:**

```json
{
  "sections": {
    "main": {
      "type": "main-product",
      "settings": {
        "show_vendor": true,
        "show_quantity": true,
        "enable_zoom": true
      }
    },
    "recommendations": {
      "type": "product-recommendations",
      "settings": {
        "heading": "You may also like",
        "products_to_show": 4
      }
    }
  },
  "order": ["main", "recommendations"]
}
```

### 3. Arquitetura da Seção

As seções são blocos de conteúdo reutilizáveis com configuração de esquema:

**seções/hero-banner.liquid:**

```liquid
<div class="hero" style="background-color: {{ section.settings.background_color }}">
  {% if section.settings.image %}
    <img
      src="{{ section.settings.image | img_url: '1920x' }}"
      alt="{{ section.settings.heading }}"
      loading="lazy"
    >
  {% endif %}

  <div class="hero__content">
    {% if section.settings.heading != blank %}
      <h1>{{ section.settings.heading }}</h1>
    {% endif %}

    {% if section.settings.subheading != blank %}
      <p>{{ section.settings.subheading }}</p>
    {% endif %}

    {% if section.settings.button_text != blank %}
      <a href="{{ section.settings.button_link }}" class="button">
        {{ section.settings.button_text }}
      </a>
    {% endif %}
  </div>
</div>

{% stylesheet %}
  .hero {
    position: relative;
    min-height: 500px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: var(--spacing, 2rem);
  }

  .hero img {
    position: absolute;
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: -1;
  }

  .hero__content {
    text-align: center;
    max-width: 600px;
  }
{% endstylesheet %}

{% javascript %}
  console.log('Hero banner loaded');
{% endjavascript %}

{% schema %}
{
  "name": "Hero Banner",
  "tag": "section",
  "class": "hero-section",
  "settings": [
    {
      "type": "text",
      "id": "heading",
      "label": "Heading",
      "default": "Welcome"
    },
    {
      "type": "textarea",
      "id": "subheading",
      "label": "Subheading",
      "default": "Discover our collection"
    },
    {
      "type": "image_picker",
      "id": "image",
      "label": "Background Image"
    },
    {
      "type": "color",
      "id": "background_color",
      "label": "Background Colour",
      "default": "#000000"
    },
    {
      "type": "text",
      "id": "button_text",
      "label": "Button Text",
      "default": "Shop Now"
    },
    {
      "type": "url",
      "id": "button_link",
      "label": "Button Link"
    }
  ],
  "presets": [
    {
      "name": "Hero Banner"
    }
  ]
}
{% endschema %}
```

### 4. Seções com Blocos

As seções podem conter blocos dinâmicos para layouts flexíveis:

**seções/produtos em destaque.líquido:**

```liquid
<div class="featured-products" {{ section.shopify_attributes }}>
  <h2>{{ section.settings.title }}</h2>

  <div class="product-grid">
    {% for block in section.blocks %}
      <div class="product-item" {{ block.shopify_attributes }}>
        {% case block.type %}
          {% when 'product' %}
            {% assign product = all_products[block.settings.product] %}
            {% render 'product-card', product: product %}

          {% when 'collection' %}
            {% assign collection = collections[block.settings.collection] %}
            <h3>{{ collection.title }}</h3>
            {% for product in collection.products limit: block.settings.products_to_show %}
              {% render 'product-card', product: product %}
            {% endfor %}

          {% when 'heading' %}
            <h3>{{ block.settings.heading }}</h3>

          {% when 'text' %}
            <div class="text-block">
              {{ block.settings.text }}
            </div>
        {% endcase %}
      </div>
    {% endfor %}
  </div>
</div>

{% schema %}
{
  "name": "Featured Products",
  "tag": "section",
  "settings": [
    {
      "type": "text",
      "id": "title",
      "label": "Section Title",
      "default": "Featured Products"
    },
    {
      "type": "range",
      "id": "products_per_row",
      "label": "Products per Row",
      "min": 2,
      "max": 5,
      "step": 1,
      "default": 4
    }
  ],
  "blocks": [
    {
      "type": "product",
      "name": "Product",
      "settings": [
        {
          "type": "product",
          "id": "product",
          "label": "Product"
        }
      ]
    },
    {
      "type": "collection",
      "name": "Collection",
      "settings": [
        {
          "type": "collection",
          "id": "collection",
          "label": "Collection"
        },
        {
          "type": "range",
          "id": "products_to_show",
          "label": "Products to Show",
          "min": 1,
          "max": 12,
          "step": 1,
          "default": 4
        }
      ]
    },
    {
      "type": "heading",
      "name": "Heading",
      "settings": [
        {
          "type": "text",
          "id": "heading",
          "label": "Heading Text"
        }
      ]
    },
    {
      "type": "text",
      "name": "Text Block",
      "settings": [
        {
          "type": "richtext",
          "id": "text",
          "label": "Text Content"
        }
      ]
    }
  ],
  "presets": [
    {
      "name": "Featured Products",
      "blocks": [
        {
          "type": "product"
        },
        {
          "type": "product"
        },
        {
          "type": "product"
        }
      ]
    }
  ],
  "max_blocks": 12
}
{% endschema %}
```

### 5. Trechos

Parciais de modelo reutilizáveis:

**snippets/product-card.liquid:**

```liquid
{% comment %}
  Usage: {% render 'product-card', product: product, show_vendor: true %}
{% endcomment %}

<div class="product-card">
  <a href="{{ product.url }}">
    {% if product.featured_image %}
      <img
        src="{{ product.featured_image | img_url: '400x400' }}"
        alt="{{ product.featured_image.alt | escape }}"
        loading="lazy"
      >
    {% else %}
      {{ 'product-1' | placeholder_svg_tag: 'placeholder' }}
    {% endif %}
  </a>

  <div class="product-card__info">
    {% if show_vendor and product.vendor != blank %}
      <p class="product-card__vendor">{{ product.vendor }}</p>
    {% endif %}

    <h3 class="product-card__title">
      <a href="{{ product.url }}">{{ product.title }}</a>
    </h3>

    <div class="product-card__price">
      {% render 'product-price', product: product %}
    </div>

    {% unless product.available %}
      <p class="sold-out">Sold Out</p>
    {% endunless %}
  </div>
</div>
```

**snippets/preço do produto.líquido:**

```liquid
{% comment %}
  Usage: {% render 'product-price', product: product %}
{% endcomment %}

{% if product.compare_at_price > product.price %}
  <span class="price price--sale">
    {{ product.price | money }}
  </span>
  <span class="price price--compare">
    {{ product.compare_at_price | money }}
  </span>
  <span class="price__badge">
    Save {{ product.compare_at_price | minus: product.price | money }}
  </span>
{% else %}
  <span class="price">
    {{ product.price | money }}
  </span>
{% endif %}

{% if product.price_varies %}
  <span class="price__from">from</span>
{% endif %}
```

### 6. Esquema de configurações

Interface completa de personalização do tema:

**config/settings_schema.json:**

```json
[
  {
    "name": "theme_info",
    "theme_name": "My Theme",
    "theme_version": "1.0.0",
    "theme_author": "Your Name",
    "theme_documentation_url": "https://...",
    "theme_support_url": "https://..."
  },
  {
    "name": "Colors",
    "settings": [
      {
        "type": "header",
        "content": "Colour Scheme"
      },
      {
        "type": "color",
        "id": "color_primary",
        "label": "Primary Colour",
        "default": "#000000"
      },
      {
        "type": "color",
        "id": "color_secondary",
        "label": "Secondary Colour",
        "default": "#ffffff"
      },
      {
        "type": "color_background",
        "id": "color_body_bg",
        "label": "Body Background"
      }
    ]
  },
  {
    "name": "Typography",
    "settings": [
      {
        "type": "font_picker",
        "id": "type_header_font",
        "label": "Heading Font",
        "default": "helvetica_n7"
      },
      {
        "type": "font_picker",
        "id": "type_body_font",
        "label": "Body Font",
        "default": "helvetica_n4"
      },
      {
        "type": "range",
        "id": "type_base_size",
        "label": "Base Font Size",
        "min": 12,
        "max": 24,
        "step": 1,
        "default": 16,
        "unit": "px"
      }
    ]
  },
  {
    "name": "Layout",
    "settings": [
      {
        "type": "select",
        "id": "layout_style",
        "label": "Layout Style",
        "options": [
          { "value": "boxed", "label": "Boxed" },
          { "value": "full-width", "label": "Full Width" },
          { "value": "wide", "label": "Wide" }
        ],
        "default": "full-width"
      },
      {
        "type": "checkbox",
        "id": "layout_sidebar_enabled",
        "label": "Enable Sidebar",
        "default": true
      }
    ]
  },
  {
    "name": "Header",
    "settings": [
      {
        "type": "image_picker",
        "id": "logo",
        "label": "Logo"
      },
      {
        "type": "range",
        "id": "logo_max_width",
        "label": "Logo Width",
        "min": 50,
        "max": 300,
        "step": 10,
        "default": 150,
        "unit": "px"
      },
      {
        "type": "link_list",
        "id": "main_menu",
        "label": "Main Menu"
      },
      {
        "type": "checkbox",
        "id": "header_sticky",
        "label": "Sticky Header",
        "default": false
      }
    ]
  },
  {
    "name": "Social Media",
    "settings": [
      {
        "type": "header",
        "content": "Social Accounts"
      },
      {
        "type": "url",
        "id": "social_twitter",
        "label": "Twitter URL",
        "info": "https://twitter.com/username"
      },
      {
        "type": "url",
        "id": "social_facebook",
        "label": "Facebook URL"
      },
      {
        "type": "url",
        "id": "social_instagram",
        "label": "Instagram URL"
      }
    ]
  }
]
```

### 7. Arquivos de layout

Wrappers de modelo mestre:

**layout/tema.liquid:**

```liquid
<!doctype html>
<html lang="{{ request.locale.iso_code }}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">

  <title>
    {{ page_title }}
    {%- if current_tags %} &ndash; {{ 'general.meta.tags' | t: tags: current_tags.join(', ') }}{% endif -%}
    {%- if current_page != 1 %} &ndash; {{ 'general.meta.page' | t: page: current_page }}{% endif -%}
    {%- unless page_title contains shop.name %} &ndash; {{ shop.name }}{% endunless -%}
  </title>

  {{ content_for_header }}

  <link rel="stylesheet" href="{{ 'style.css' | asset_url }}">
  <script src="{{ 'theme.js' | asset_url }}" defer></script>
</head>
<body class="template-{{ request.page_type }}">
  {% section 'header' %}

  <main role="main">
    {{ content_for_layout }}
  </main>

  {% section 'footer' %}
</body>
</html>
```

## Tipos de entrada do esquema de configurações

Todos os mais de 28 tipos de entrada para personalização de tema em `settings_schema.json` e esquemas de seção.

### Entradas de texto

#### texto

Entrada de texto de linha única:```json
{
"type": "text",
"id": "store_name",
"label": "Store Name",
"default": "My Store",
"placeholder": "Enter store name",
"info": "This appears in the header"
}

````
#### área de texto

Entrada de texto multilinha:```json
{
  "type": "textarea",
  "id": "footer_text",
  "label": "Footer Text",
  "default": "© 2025 My Store. All rights reserved.",
  "placeholder": "Enter footer text"
}
````

####html

Editor de código HTML:```json
{
"type": "html",
"id": "custom_html",
"label": "Custom HTML",
"default": "<p>Welcome to our store!</p>",
"info": "Add custom HTML code"
}

````
#### richtext

Editor de rich text WYSIWYG:```json
{
  "type": "richtext",
  "id": "announcement_content",
  "label": "Announcement Bar Content",
  "default": "<p>Free shipping on orders over $50!</p>"
}
````

### Entradas Numéricas

#### número

Campo de entrada numérico:```json
{
"type": "number",
"id": "products_per_page",
"label": "Products Per Page",
"default": 12,
"min": 1,
"max": 100,
"step": 1,
"info": "Number of products to show per page"
}

````
#### intervalo

Entrada do controle deslizante:```json
{
  "type": "range",
  "id": "columns",
  "label": "Number of Columns",
  "min": 2,
  "max": 6,
  "step": 1,
  "default": 4,
  "unit": "columns",
  "info": "Adjust the grid layout"
}
````

**Unidades comuns:**

- `px` - Pixels
- `%` - Porcentagem
- `em` - unidades Em
- `rem` - Raiz em unidades
- Texto personalizado (como "colunas", "itens")

### Entradas Booleanas

#### caixa de seleção

Alternar caixa de seleção:```json
{
"type": "checkbox",
"id": "show_search",
"label": "Show Search Bar",
"default": true,
"info": "Display search in header"
}

````
#### booleano

Configuração booleana (igual à caixa de seleção):```json
{
  "type": "boolean",
  "id": "enable_feature",
  "label": "Enable Feature",
  "default": false
}
````

### Entradas de seleção

#### selecione

Menu suspenso:```json
{
"type": "select",
"id": "layout_style",
"label": "Layout Style",
"options": [
{
"value": "boxed",
"label": "Boxed"
},
{
"value": "full-width",
"label": "Full Width"
},
{
"value": "wide",
"label": "Wide"
}
],
"default": "full-width",
"info": "Choose your layout style"
}

````
#### rádio

Seleção do botão de opção:```json
{
  "type": "radio",
  "id": "text_alignment",
  "label": "Text Alignment",
  "options": [
    { "value": "left", "label": "Left" },
    { "value": "center", "label": "Centre" },
    { "value": "right", "label": "Right" }
  ],
  "default": "center"
}
````

### Entradas de cores

#### cor

Seletor de cores:```json
{
"type": "color",
"id": "primary_color",
"label": "Primary Colour",
"default": "#000000",
"info": "Main brand colour"
}

````
#### cor_fundo

Cor com suporte gradiente:```json
{
  "type": "color_background",
  "id": "section_background",
  "label": "Section Background",
  "default": "linear-gradient(#ffffff, #000000)"
}
````

**Suporta:**

- Cores sólidas: `#ffffff`
- Gradientes lineares: `gradiente linear(#fff, #000)`
- Gradientes radiais
- Com opacidade

### Entradas de mídia

#### selecionador de imagem

Upload e seleção de imagens:```json
{
"type": "image_picker",
"id": "logo",
"label": "Logo Image",
"info": "Recommended size: 300x100px"
}

````
Acesso em Líquido:```liquid
{% if settings.logo %}
  <img src="{{ settings.logo | img_url: '300x' }}" alt="{{ shop.name }}">
{% endif %}

{{ settings.logo.width }}
{{ settings.logo.height }}
{{ settings.logo.alt }}
{{ settings.logo.src }}
````

#### mídia

Seletor de imagem ou vídeo:```json
{
"type": "media",
"id": "hero_media",
"label": "Hero Media",
"accept": ["image", "video"],
"info": "Upload image or video"
}

````
#### video_url

Entrada de URL de vídeo (YouTube, Vimeo):```json
{
  "type": "video_url",
  "id": "promo_video",
  "label": "Promo Video",
  "accept": ["youtube", "vimeo"],
  "placeholder": "https://www.youtube.com/watch?v=...",
  "info": "YouTube or Vimeo URL"
}
````

Acesso em Líquido:```liquid
{% if settings.promo_video %}
{{ settings.promo_video.type }} {# youtube or vimeo #}
{{ settings.promo_video.id }} {# Video ID #}
{% endif %}

````
### Entradas de tipografia

#### font_picker

Seletor de fontes do Google:```json
{
  "type": "font_picker",
  "id": "heading_font",
  "label": "Heading Font",
  "default": "helvetica_n7",
  "info": "Font for headings"
}
````

**Formato da fonte:** `family_weight`

- `n4` -Normal 400
- `n7` - Negrito 700
- `i4` - Itálico 400

Acesso em Líquido:```liquid
{{ settings.heading_font.family }}
{{ settings.heading_font.weight }}
{{ settings.heading_font.style }}

{# CSS font face #}

<style>
  {{ settings.heading_font | font_face }}

  h1, h2, h3 {
    font-family: {{ settings.heading_font.family }}, {{ settings.heading_font.fallback_families }};
    font-weight: {{ settings.heading_font.weight }};
    font-style: {{ settings.heading_font.style }};
  }
</style>

````
### Seletores de recursos

#### produto

Seletor de produtos:```json
{
  "type": "product",
  "id": "featured_product",
  "label": "Featured Product",
  "info": "Select a product to feature"
}
````

Acesso em Líquido:```liquid
{% assign product = all_products[settings.featured_product] %}
{{ product.title }}
{{ product.price | money }}

````
#### coleção

Seletor de coleção:```json
{
  "type": "collection",
  "id": "featured_collection",
  "label": "Featured Collection",
  "info": "Select a collection to feature"
}
````

Acesso em Líquido:```liquid
{% assign collection = collections[settings.featured_collection] %}
{{ collection.title }}
{% for product in collection.products limit: 4 %}
{{ product.title }}
{% endfor %}

````
#### página

Seletor de página:```json
{
  "type": "page",
  "id": "about_page",
  "label": "About Page",
  "info": "Link to about page"
}
````

Acesso em Líquido:```liquid
{% assign page = pages[settings.about_page] %}
<a href="{{ page.url }}">{{ page.title }}</a>
{{ page.content }}

````
####blog

Seletor de blogs:```json
{
  "type": "blog",
  "id": "main_blog",
  "label": "Main Blog",
  "info": "Select your primary blog"
}
````

Acesso em Líquido:```liquid
{% assign blog = blogs[settings.main_blog] %}
{{ blog.title }}
{% for article in blog.articles limit: 3 %}
{{ article.title }}
{% endfor %}

````
#### artigo

Seletor de artigo (postagem no blog):```json
{
  "type": "article",
  "id": "featured_article",
  "label": "Featured Article",
  "info": "Select an article to feature"
}
````

#### link_list

Seletor de menu/navegação:```json
{
"type": "link_list",
"id": "main_menu",
"label": "Main Navigation",
"default": "main-menu",
"info": "Select menu for header"
}

````
Acesso em Líquido:```liquid
{% assign menu = linklists[settings.main_menu] %}
{% for link in menu.links %}
  <a href="{{ link.url }}">{{ link.title }}</a>

  {% if link.links.size > 0 %}
    {# Nested links #}
    {% for child_link in link.links %}
      <a href="{{ child_link.url }}">{{ child_link.title }}</a>
    {% endfor %}
  {% endif %}
{% endfor %}
````

### Entradas de URL

####url

Campo de entrada de URL:```json
{
"type": "url",
"id": "twitter_url",
"label": "Twitter URL",
"placeholder": "https://twitter.com/username",
"info": "Your Twitter profile URL"
}

````
### Entradas de data e hora

#### data

Seletor de data:```json
{
  "type": "date",
  "id": "sale_end_date",
  "label": "Sale End Date",
  "info": "When the sale ends"
}
````

Acesso em Líquido:```liquid
{{ settings.sale_end_date | date: '%B %d, %Y' }}

````
### Elementos da organização

#### cabeçalho

Separador visual com título:```json
{
  "type": "header",
  "content": "Colour Scheme Settings",
  "info": "Configure your colour palette"
}
````

Não é uma configuração, apenas uma divisória visual no painel de configurações.

#### parágrafo

Bloco de texto informativo:```json
{
"type": "paragraph",
"content": "These settings control the appearance of your product cards. Make sure to preview changes on different screen sizes."
}

````
### Entradas Avançadas

#### líquido

Editor de código líquido:```json
{
  "type": "liquid",
  "id": "custom_liquid",
  "label": "Custom Liquid Code",
  "info": "Add custom Liquid code"
}
````

#### inline_richtext

Rich text embutido (sem wrapper `<p>`):```json
{
"type": "inline_richtext",
"id": "banner_text",
"label": "Banner Text",
"default": "Welcome to <strong>our store</strong>!",
"info": "Text without paragraph wrapper"
}

```
## Melhores práticas

1. **Use modelos JSON** para compatibilidade com a Loja Online 2.0
2. **Torne as seções dinâmicas** com blocos para flexibilidade do comerciante
3. **Adicione `shopify_attributes`** aos contêineres de seção/bloco para o editor de tema
4. **Forneça padrões sensatos** nas configurações do esquema
5. **Use snippets** para componentes de IU repetidos
6. **Adicione blocos `{% stylesheet %}` e `{% javascript %}`** nas seções para estilos com escopo definido
7. **Incluir atributos de acessibilidade** (rótulos ARIA, alt

texto)
8. **Teste no editor de temas** para garantir que a visualização ao vivo funcione
9. **Parâmetros do snippet do documento** com comentários
10. **Use HTML semântico** para melhorar o SEO
11. **Configurações relacionadas ao grupo** em seções lógicas
12. **Forneça rótulos claros e texto informativo** para orientação
13. **Use tipos de entrada apropriados** para cada configuração
14. **Adicione texto de espaço reservado** para URL e entradas de texto
15. **Use cabeçalhos e parágrafos** para organizar seções complexas
16. **Intervalo limite

valores ** para mín/máx razoável
17. **Teste no personalizador de tema** para garantir uma boa experiência do usuário
18. **Documente dependências** entre configurações
19. **Considere a experiência móvel** ao escolher os tipos de entrada
```
