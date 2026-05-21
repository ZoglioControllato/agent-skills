# Referência de sintaxe líquida

## Categorias de tags

### Tags de fluxo de controle

#### if/elsif/else/endif```liquid

{% if product.available %}
<button>Add to Cart</button>
{% elsif product.coming_soon %}

  <p>Coming Soon</p>
{% else %}
  <p>Sold Out</p>
{% endif %}
```

**Operadores:**

- `==` - igual
- `!=` - não é igual
- `>` - maior que
- `<` - menos que
- `>=` - maior ou igual
- `<=` - menor ou igual
- `contém` - substring ou array contém
- `e` - E lógico
- `ou` - OU lógico

**Exemplos:**

```liquid
{% if product.price > 100 and product.available %}
  Premium item in stock
{% endif %}

{% if product.tags contains 'sale' or product.type == 'clearance' %}
  On sale!
{% endif %}
```

#### a menos que

Declaração if negada:```liquid
{% unless customer.name == blank %}
Hello, {{ customer.name }}
{% endunless %}

{# Equivalent to: #}
{% if customer.name != blank %}
Hello, {{ customer.name }}
{% endif %}

````
#### caso/quando

Instrução switch-case:```liquid
{% case product.type %}
  {% when 'shoes' %}
    <icon>👟</icon>
  {% when 'boots' %}
    <icon>👢</icon>
  {% when 'sneakers' %}
    <icon>👟</icon>
  {% else %}
    <icon>📦</icon>
{% endcase %}
````

### Tags de iteração

#### para loop```liquid

{% for product in collection.products %}
{{ product.title }}
{% endfor %}

````

**Modificadores:**

```liquid
{# Limit to first 5 #}
{% for product in collection.products limit: 5 %}
  {{ product.title }}
{% endfor %}

{# Skip first 10 #}
{% for product in collection.products offset: 10 %}
  {{ product.title }}
{% endfor %}

{# Reverse order #}
{% for product in collection.products reversed %}
  {{ product.title }}
{% endfor %}

{# Combine modifiers #}
{% for product in collection.products limit: 5 offset: 10 %}
  {# Items 11-15 #}
{% endfor %}
````

**objeto forloop (disponível dentro de loops):**

```liquid
{% for item in array %}
  {{ forloop.index }}        {# 1-based: 1, 2, 3, ... #}
  {{ forloop.index0 }}       {# 0-based: 0, 1, 2, ... #}
  {{ forloop.rindex }}       {# Reverse 1-based: 3, 2, 1 #}
  {{ forloop.rindex0 }}      {# Reverse 0-based: 2, 1, 0 #}
  {{ forloop.first }}        {# true on first iteration #}
  {{ forloop.last }}         {# true on last iteration #}
  {{ forloop.length }}       {# Total number of items #}
{% endfor %}
```

**Exemplo de uso:**

```liquid
{% for product in collection.products %}
  {% if forloop.first %}
    <h2>Featured Product</h2>
  {% endif %}

  <div class="product-{{ forloop.index }}">
    {{ product.title }}
  </div>

  {% if forloop.index == 3 %}
    <hr> {# Divider after 3rd item #}
  {% endif %}

  {% if forloop.last %}
    <p>Showing {{ forloop.length }} products</p>
  {% endif %}
{% endfor %}
```

#### interromper e continuar```liquid

{% for product in collection.products %}
{% if product.handle == 'target' %}
{% break %} {# Exit loop entirely #}
{% endif %}

{% if product.available == false %}
{% continue %} {# Skip to next iteration #}
{% endif %}

{{ product.title }}
{% endfor %}

````
#### tabela

Cria linhas da tabela HTML:```liquid
{% tablerow product in collection.products cols: 3 %}
  {{ product.title }}
{% endtablerow %}

{# Output: #}
<table>
  <tr class="row1">
    <td class="col1">Product 1</td>
    <td class="col2">Product 2</td>
    <td class="col3">Product 3</td>
  </tr>
  <tr class="row2">
    <td class="col1">Product 4</td>
    ...
  </tr>
</table>
````

**objeto tablerow:**

```liquid
{% tablerow product in products cols: 3 limit: 12 %}
  {{ tablerow.col }}         {# Current column (1-based) #}
  {{ tablerow.col0 }}        {# Current column (0-based) #}
  {{ tablerow.row }}         {# Current row (1-based) #}
  {{ tablerow.index }}       {# Item index (1-based) #}
  {{ tablerow.first }}       {# true on first item #}
  {{ tablerow.last }}        {# true on last item #}
  {{ tablerow.col_first }}   {# true on first column #}
  {{ tablerow.col_last }}    {# true on last column #}
{% endtablerow %}
```

#### paginar

Para paginar coleções grandes:```liquid
{% paginate collection.products by 12 %}

{% for product in paginate.collection.products %}
{% render 'product-card', product: product %}
{% endfor %}

{# Pagination controls #}
{% if paginate.pages > 1 %}
{{ paginate | default_pagination }}
{% endif %}

{% endpaginate %}

````

**objeto paginar:**

```liquid
{{ paginate.current_page }}      {# Current page number #}
{{ paginate.pages }}              {# Total pages #}
{{ paginate.items }}              {# Total items #}
{{ paginate.page_size }}          {# Items per page #}

{{ paginate.previous.url }}       {# Previous page URL (if exists) #}
{{ paginate.previous.title }}     {# Previous page title #}
{{ paginate.previous.is_link }}   {# Boolean #}

{{ paginate.next.url }}           {# Next page URL (if exists) #}
{{ paginate.next.title }}         {# Next page title #}
{{ paginate.next.is_link }}       {# Boolean #}

{{ paginate.parts }}              {# Array of page links #}
````

**Paginação personalizada:**

```liquid
{% paginate collection.products by 20 %}

  <div class="pagination">
    {% if paginate.previous %}
      <a href="{{ paginate.previous.url }}">← Previous</a>
    {% endif %}

    {% for part in paginate.parts %}
      {% if part.is_link %}
        <a href="{{ part.url }}">{{ part.title }}</a>
      {% else %}
        <span class="current">{{ part.title }}</span>
      {% endif %}
    {% endfor %}

    {% if paginate.next %}
      <a href="{{ paginate.next.url }}">Next →</a>
    {% endif %}
  </div>

{% endpaginate %}
```

### Atribuição de Variável

#### atribuir

Atribuição de variável de linha única:```liquid
{% assign sale_price = product.price | times: 0.8 %}
{% assign is_available = product.available %}
{% assign product_count = collection.products.size %}
{% assign full_name = customer.first_name | append: ' ' | append: customer.last_name %}

````
#### captura

Captura de conteúdo multilinha:```liquid
{% capture product_title %}
  {{ collection.title }} - {{ product.title }}
{% endcapture %}

{{ product_title }}  {# "Summer Sale - Blue T-Shirt" #}

{% capture greeting %}
  <h1>Welcome, {{ customer.name }}!</h1>
  <p>You have {{ customer.orders_count }} orders.</p>
{% endcapture %}

{{ greeting }}
````

#### líquido (multi-declarações)

Sintaxe mais limpa para múltiplas instruções:```liquid
{% liquid
assign product_type = product.type
assign is_on_sale = product.on_sale
assign sale_percentage = product.discount_percent

if is_on_sale
assign status = 'SALE'
else
assign status = 'REGULAR'
endif

echo status
%}

````
### Inclusão de modelo

#### renderizar

Escopo isolado (método preferido):```liquid
{# Basic usage #}
{% render 'product-card', product: product %}

{# Multiple parameters #}
{% render 'product-card',
  product: product,
  show_price: true,
  show_vendor: false,
  css_class: 'featured'
%}

{# Render for each item #}
{% render 'product-card' for collection.products as item %}

{# Pass arrays #}
{% render 'gallery', images: product.images %}
````

**Dentro do product-card.liquid:**

```liquid
{# Only has access to passed parameters #}
<div class="product {% if css_class %}{{ css_class }}{% endif %}">
  <h3>{{ product.title }}</h3>

  {% if show_price %}
    <p>{{ product.price | money }}</p>
  {% endif %}

  {% if show_vendor %}
    <p>{{ product.vendor }}</p>
  {% endif %}
</div>
```

#### incluir

Escopo compartilhado (legado, evitado no novo código):```liquid
{% include 'product-details' %}

{# Can access all parent template variables #}
{# Harder to debug and reason about #}

````
#### seção

Carregar seções dinâmicas:```liquid
{% section 'featured-product' %}
{% section 'newsletter-signup' %}
````

### Etiquetas utilitárias

#### comentário

Comentários de várias linhas:```liquid
{% comment %}
This entire block is ignored
by the Liquid renderer.
Use for documentation.
{% endcomment %}

{# Single-line comment #}

````
#### eco

Abreviação de saída (alternativa para `{{ }}`):```liquid
{% echo product.title %}
{# Equivalent to: {{ product.title }} #}
````

#### cru

Código líquido de saída sem processamento:```liquid
{% raw %}
{{ This will be output as-is }}
{% Liquid tags won't be processed %}
{% endraw %}

````
Útil para documentação ou exemplos de código.

## Controle de espaço em branco

Remova os espaços em branco usando hífens:```liquid
{%- if condition -%}
  Content (whitespace stripped on both sides)
{%- endif -%}

{{ "hello" -}}world
{# Output: helloworld (no space) #}

{{- product.title }}
{# Strips whitespace before output #}

{{ product.title -}}
{# Strips whitespace after output #}
````

**Exemplo:**

```liquid
{# Without whitespace control: #}
{% for item in array %}
  {{ item }}
{% endfor %}

{# Output has newlines and indentation #}

{# With whitespace control: #}
{%- for item in array -%}
  {{ item }}
{%- endfor -%}

{# Output is compact #}
```

## Precedência do Operador

**Ordem de avaliação (da direita para a esquerda):**

```liquid
{% if true or false and false %}
  {# Evaluates as: true or (false and false) = true #}
{% endif %}
```

**IMPORTANTE:** Não há suporte para parênteses no Liquid. Divida as condições complexas em variáveis:```liquid
{# ❌ DOESN'T WORK: #}
{% if (x > 5 and y < 10) or z == 0 %}

{# ✅ WORKS: #}
{% assign condition1 = false %}
{% if x > 5 and y < 10 %}
{% assign condition1 = true %}
{% endif %}

{% if condition1 or z == 0 %}
{# Logic here #}
{% endif %}

````
## Dicas de desempenho

1. **Cache de cálculos repetidos:**

```liquid
{# ❌ Inefficient: #}
{% for i in (1..10) %}
  {{ collection.products.size }}  {# Calculated 10 times #}
{% endfor %}

{# ✅ Efficient: #}
{% assign product_count = collection.products.size %}
{% for i in (1..10) %}
  {{ product_count }}
{% endfor %}
````

2. **Use `limit` e `offset` em vez de iterar arrays completos:**

```liquid
{# ❌ Inefficient: #}
{% for product in collection.products %}
  {% if forloop.index <= 5 %}
    {{ product.title }}
  {% endif %}
{% endfor %}

{# ✅ Efficient: #}
{% for product in collection.products limit: 5 %}
  {{ product.title }}
{% endfor %}
```

3. **Prefira `render` em vez de `include`** para melhor desempenho e escopo de variáveis

4. **Use a tag `liquid`** para blocos de múltiplas instruções mais limpos

## Dicas comuns

1. **Sem parênteses nas condições** - Use variáveis
2. **Avaliação da direita para a esquerda** – Tenha cuidado com a precedência do operador
3. **Concatenação de strings** - Use o filtro `append` ou a tag `capture`
4. **Mutação de array/objeto** - Não é possível; criar novas variáveis
5. **Divisão inteira** - `{{ 5 | dividido_por: 2 }}` retorna `2`, não `2,5`
6. **Valores verdadeiros/falsos:**
   - `false` e `nil` são falsos
   - Todo o resto (incluindo `0`, `""`, `[]`) é

verdade

## LiquidDoc

Parâmetros de snippet de documento com comentários estruturados (disponíveis desde 2024):

### Uso básico```liquid

{% doc %}
@param {String} title - The product title to display
@param {Number} price - Price in cents
@param {Boolean} [show_vendor] - Whether to show vendor (optional)
@example
{% render 'product-card', title: product.title, price: product.price %}
{% enddoc %}

<div class="product-card">
  <h3>{{ title }}</h3>
  <p>{{ price | money }}</p>
  {% if show_vendor %}
    <span>{{ vendor }}</span>
  {% endif %}
</div>
```
### Tipos suportados

- `{String}` - valores de texto
- `{Número}` - valores numéricos
- `{Boolean}` - verdadeiro/falso
- `{Object}` - Objetos do Shopify (produto, coleção, etc.)
- `{Array}` - matrizes de valores
- `{Image}` - objetos de imagem

### Parâmetros opcionais

Coloque o nome do parâmetro entre colchetes:```liquid
{% doc %}
@param {String} heading - Section heading
@param {String} [subheading] - Optional subheading
@param {Number} [limit=5] - Items to show (default: 5)
{% enddoc %}

````
### Benefícios

- Editor de tema mostra dicas de parâmetros ao editar tags `render`
- Extensões IDE podem fornecer preenchimento automático
- Código autodocumentado para colaboração em equipe
- Theme Check valida o uso de parâmetros

## Dicas de depuração

1. **Tipos de variáveis de saída:**

```liquid
{{ product | json }}  {# Output entire object as JSON #}
{{ product.class }}   {# Output object type #}
{{ variable.size }}   {# Check array/string length #}
````

2. **Verifique se há zero/existência:**

```liquid
{% if product.metafield %}
  Metafield exists
{% else %}
  Metafield is nil
{% endif %}
```

3. **Use filtro padrão por segurança:**

```liquid
{{ product.metafield.value | default: "Not set" }}
```

4. **Ative o console de visualização do tema** para ver erros do Liquid em tempo real
