# Referência de filtros líquidos

Os filtros modificam a saída usando a sintaxe de pipe: `{{ valor | filtro: parâmetro }}`

## Filtros de String

### sofisticado

Converter para maiúsculas:```liquid
{{ "hello world" | upcase }}
{# Output: HELLO WORLD #}

````
### caixa baixa

Converter para minúsculas:```liquid
{{ "HELLO WORLD" | downcase }}
{# Output: hello world #}
````

### capitalizar

Capitalizar apenas a primeira letra:```liquid
{{ "hello world" | capitalize }}
{# Output: Hello world #}

````
### reverso

String ou matriz reversa:```liquid
{{ "hello" | reverse }}
{# Output: olleh #}

{{ array | reverse }}
{# Reverses array order #}
````

### tamanho

Obtenha a contagem de caracteres ou o comprimento do array:```liquid
{{ "hello" | size }}
{# Output: 5 #}

{{ collection.products | size }}
{# Output: number of products #}

````
### remover

Remova todas as ocorrências de substring:```liquid
{{ "hello world world" | remove: "world" }}
{# Output: hello   #}
````

### remover_primeiro

Remover apenas a primeira ocorrência:```liquid
{{ "hello world world" | remove_first: "world" }}
{# Output: hello world #}

````
### substituir

Substitua todas as ocorrências:```liquid
{{ "hello" | replace: "l", "L" }}
{# Output: heLLo #}
````

### substituir_primeiro

Substitua apenas a primeira ocorrência:```liquid
{{ "hello" | replace_first: "l", "L" }}
{# Output: heLlo #}

````
### divisão

Divida a string em array:```liquid
{{ "a,b,c,d" | split: "," }}
{# Output: ["a", "b", "c", "d"] #}

{% assign tags = "sale,new,featured" | split: "," %}
{% for tag in tags %}
  {{ tag }}
{% endfor %}
````

### tira

Remova os espaços em branco à esquerda e à direita:```liquid
{{ "  hello  " | strip }}
{# Output: hello #}

````
### tira

Remova apenas os espaços em branco iniciais:```liquid
{{ "  hello  " | lstrip }}
{# Output: hello   #}
````

### rstrip

Remova apenas os espaços em branco à direita:```liquid
{{ "  hello  " | rstrip }}
{# Output: hello #}

````
### truncar

Limite o comprimento da string com reticências:```liquid
{{ "hello world" | truncate: 8 }}
{# Output: hello... #}

{{ "hello world" | truncate: 10, "!" }}
{# Output: hello worl! #}

{{ "hello world" | truncate: 50 }}
{# Output: hello world (no truncation if shorter) #}
````

### palavras truncadas

Limite por contagem de palavras:```liquid
{{ "hello world testing" | truncatewords: 2 }}
{# Output: hello world... #}

{{ "hello world testing" | truncatewords: 2, "--" }}
{# Output: hello world-- #}

````
### anexar

Adicione string ao final:```liquid
{{ "hello" | append: " world" }}
{# Output: hello world #}

{% assign file_name = "image" | append: ".jpg" %}
{# file_name: image.jpg #}
````

### preceder

Adicione string ao início:```liquid
{{ "world" | prepend: "hello " }}
{# Output: hello world #}

````
### newline_to_br

Converta novas linhas em tags `<br>`:```liquid
{{ product.description | newline_to_br }}
{# Converts \n to <br> #}
````

### strip_html

Remova todas as tags HTML:```liquid
{{ "<p>Hello <strong>world</strong></p>" | strip_html }}
{# Output: Hello world #}

````
### escapar

Escape de caracteres especiais HTML:```liquid
{{ "<div>Test</div>" | escape }}
{# Output: &lt;div&gt;Test&lt;/div&gt; #}
````

### escape_once

Escape do HTML, mas não faça escape duplo:```liquid
{{ "&lt;div&gt;" | escape_once }}
{# Output: &lt;div&gt; (not double-escaped) #}

````
### url_encode

String de codificação de URL:```liquid
{{ "hello world" | url_encode }}
{# Output: hello+world #}

{{ "foo@bar.com" | url_encode }}
{# Output: foo%40bar.com #}
````

###url_decode

Decodificar string codificada em URL:```liquid
{{ "hello+world" | url_decode }}
{# Output: hello world #}

````
### base64_encode

Codifique para base64:```liquid
{{ "hello" | base64_encode }}
{# Output: aGVsbG8= #}
````

###base64_decode

Decodificação de base64:```liquid
{{ "aGVsbG8=" | base64_decode }}
{# Output: hello #}

````
### fatia

Extraia substring ou fatia de array:```liquid
{{ "hello" | slice: 0, 3 }}
{# Output: hel #}

{{ "hello" | slice: -3, 3 }}
{# Output: llo #}
````

## Filtros Numéricos

###abdômen

Valor absoluto:```liquid
{{ -5 | abs }}
{# Output: 5 #}

{{ 5 | abs }}
{# Output: 5 #}

````
### teto

Arredonde para o número inteiro mais próximo:```liquid
{{ 1.2 | ceil }}
{# Output: 2 #}

{{ 1.9 | ceil }}
{# Output: 2 #}
````

### andar

Arredonde para o número inteiro mais próximo:```liquid
{{ 1.9 | floor }}
{# Output: 1 #}

{{ 1.1 | floor }}
{# Output: 1 #}

````
### rodada

Arredondar para casas decimais especificadas:```liquid
{{ 1.5 | round }}
{# Output: 2 #}

{{ 1.567 | round: 2 }}
{# Output: 1.57 #}

{{ 1.234 | round: 1 }}
{# Output: 1.2 #}
````

### mais

Adição:```liquid
{{ 5 | plus: 3 }}
{# Output: 8 #}

{{ product.price | plus: 1000 }}
{# Add $10.00 (prices in cents) #}

````
### menos

Subtração:```liquid
{{ 5 | minus: 3 }}
{# Output: 2 #}
````

### vezes

Multiplicação:```liquid
{{ 5 | times: 3 }}
{# Output: 15 #}

{{ product.price | times: 0.8 }}
{# 20% discount #}

````
### dividido_por

Divisão inteira:```liquid
{{ 10 | divided_by: 2 }}
{# Output: 5 #}

{{ 10 | divided_by: 3 }}
{# Output: 3 (integer division) #}

{{ 10.0 | divided_by: 3 }}
{# Output: 3.33... (float division) #}
````

### módulo

Obtenha o restante:```liquid
{{ 10 | modulo: 3 }}
{# Output: 1 #}

{# Check if even #}
{% if forloop.index | modulo: 2 == 0 %}
Even row
{% endif %}

````
### pelo menos

Garanta o valor mínimo:```liquid
{{ 1 | at_least: 5 }}
{# Output: 5 #}

{{ 10 | at_least: 5 }}
{# Output: 10 #}
````

### no máximo

Garanta o valor máximo:```liquid
{{ 100 | at_most: 50 }}
{# Output: 50 #}

{{ 10 | at_most: 50 }}
{# Output: 10 #}

````
## Filtros de matriz/coleção

### primeiro

Obtenha o primeiro elemento:```liquid
{{ collection.products | first }}
{# Returns first product #}

{{ "a,b,c" | split: "," | first }}
{# Output: a #}
````

### último

Obtenha o último elemento:```liquid
{{ collection.products | last }}
{# Returns last product #}

````
### junte-se

Junte-se à matriz com separador:```liquid
{{ product.tags | join: ", " }}
{# Output: sale, new, featured #}
````

### mapa

Extraia a propriedade de cada objeto:```liquid
{{ collection.products | map: "title" }}
{# Returns array of product titles #}

{{ collection.products | map: "title" | join: ", " }}
{# Output: Product 1, Product 2, Product 3 #}

````
### classificar

Classifique a matriz por propriedade:```liquid
{{ collection.products | sort: "price" }}
{# Sort by price ascending #}

{{ collection.products | sort: "title" }}
{# Sort alphabetically #}
````

###sort_natural

Classificação sem distinção entre maiúsculas e minúsculas:```liquid
{{ collection.products | sort_natural: "title" }}
{# Sorts: Apple, banana, Cherry (natural order) #}

````
### onde

Filtre a matriz por valor da propriedade:```liquid
{{ collection.products | where: "vendor", "Nike" }}
{# Only Nike products #}

{{ collection.products | where: "available", true }}
{# Only available products #}

{{ collection.products | where: "type", "shoes" | map: "title" }}
{# Combine with map #}
````

### único

Remover duplicatas:```liquid
{{ collection.all_vendors | uniq }}
{# Unique vendor names #}

````
### limite

Limite a matriz a N itens:```liquid
{{ collection.products | limit: 5 }}
{# First 5 products #}
````

### deslocamento

Pule os primeiros N itens:```liquid
{{ collection.products | offset: 10 }}
{# Products from 11th onward #}

````
### concat

Mesclar duas matrizes:```liquid
{% assign array1 = "a,b,c" | split: "," %}
{% assign array2 = "d,e,f" | split: "," %}
{{ array1 | concat: array2 | join: ", " }}
{# Output: a, b, c, d, e, f #}
````

### compacto

Remova valores nulos da matriz:```liquid
{{ array | compact }}
{# Removes nil/null elements #}

````
## Filtros específicos do Shopify

### dinheiro

Formatar como moeda com símbolo:```liquid
{{ 1000 | money }}
{# Output: $10.00 #}

{{ 1599 | money }}
{# Output: $15.99 #}
````

### dinheiro_sem_moeda

Formato sem símbolo de moeda:```liquid
{{ 1000 | money_without_currency }}
{# Output: 10.00 #}

````
### dinheiro_sem_trailing_zeros

Remova decimais desnecessários:```liquid
{{ 1000 | money_without_trailing_zeros }}
{# Output: $10 #}

{{ 1050 | money_without_trailing_zeros }}
{# Output: $10.50 #}
````

### peso_com_unidade

Adicione unidade de peso:```liquid
{{ 500 | weight_with_unit }}
{# Output: 500 g #}

{{ product.variants.first.weight | weight_with_unit }}

````
###asset_url

Obtenha o URL do CDN do ativo do tema:```liquid
{{ 'logo.png' | asset_url }}
{# Output: //cdn.shopify.com/s/files/1/0000/0000/t/1/assets/logo.png #}
````

###img_url

Gere o URL da imagem com tamanho:```liquid
{{ product.featured_image | img_url: '500x500' }}
{# Resize to 500x500 #}

{{ product.featured_image | img_url: 'large' }}
{# Named size: pico, icon, thumb, small, compact, medium, large, grande, 1024x1024, 2048x2048 #}

{{ product.featured_image | img_url: '500x500', crop: 'center' }}
{# With crop #}

````
### link_to_type

Crie um link para a coleção de tipos de produto:```liquid
{{ product.type | link_to_type }}
{# Output: <a href="/collections/types?q=Shoes">Shoes</a> #}
````

### link_to_vendor

Crie um link para a coleção do fornecedor:```liquid
{{ product.vendor | link_to_vendor }}
{# Output: <a href="/collections/vendors?q=Nike">Nike</a> #}

````
### link_to_tag

Criar link para filtro de tags:```liquid
{{ tag | link_to_tag: tag }}
{# Output: <a href="/collections/all/sale">sale</a> #}
````

### destaque

Destaque os termos de pesquisa:```liquid
{{ product.title | highlight: search.terms }}
{# Wraps search terms in <strong class="highlight"> tags #}

````
### destaque_active_tag

Destaque a tag atual:```liquid
{{ tag | highlight_active_tag: tag }}
{# Wraps current tag in <span class="active"> #}
````

### pagamento_type_img_url

Obtenha o URL do ícone de pagamento:```liquid
{{ 'visa' | payment_type_img_url }}
{# Returns Shopify-hosted Visa icon URL #}

````
### placeholder_svg_tag

Gere o espaço reservado SVG:```liquid
{{ 'product-1' | placeholder_svg_tag }}
{# Generates placeholder product image SVG #}

{{ 'collection-1' | placeholder_svg_tag: 'custom-class' }}
{# With custom CSS class #}
````

### color_to_rgb

Converter hexadecimal em RGB:```liquid
{{ '#ff0000' | color_to_rgb }}
{# Output: rgb(255, 0, 0) #}

````
### color_to_hsl

Converter hexadecimal em HSL:```liquid
{{ '#ff0000' | color_to_hsl }}
{# Output: hsl(0, 100%, 50%) #}
````

### color_extract

Extrair componente de cor:```liquid
{{ '#ff0000' | color_extract: 'red' }}
{# Output: 255 #}

````
### color_brilho

Calcular brilho:```liquid
{{ '#ff0000' | color_brightness }}
{# Output: brightness value 0-255 #}
````

### color_modify

Modifique as propriedades da cor:```liquid
{{ '#ff0000' | color_modify: 'alpha', 0.5 }}
{# Adjust alpha channel #}

````
## Filtros de data

### data

Formatar data usando strftime:```liquid
{{ order.created_at | date: '%B %d, %Y' }}
{# Output: November 10, 2026 #}

{{ order.created_at | date: '%m/%d/%Y' }}
{# Output: 11/10/2026 #}

{{ order.created_at | date: '%Y-%m-%d %H:%M:%S' }}
{# Output: 2026-11-10 14:30:00 #}
````

**Códigos de formato comuns:**

- `%Y` - ano de 4 dígitos (2026)
- `%y` - ano de 2 dígitos (26)
- `%m` - Número do mês (11)
- `%B` - Mês completo (novembro)
- `%b` - Mês curto (novembro)
- `%d` - Dia do mês (10)
- `%e` - Dia sem zero à esquerda (10)
- `%A` - Dia inteiro da semana (segunda-feira)
- `%a` - Dia da semana curto (segunda-feira)
- `%H` - Hora 24 horas (14)
- `%I` - Hora 12 horas (02)
- `%M` - Minutos (30)
- `%S` - Segundos (45)
- `%p` - AM/PM
- `%z` - Deslocamento de fuso horário (+0000)

**Exemplos:**

```liquid
{{ "now" | date: "%Y-%m-%d" }}
{# Current date: 2026-11-10 #}

{{ article.published_at | date: "%B %d, %Y at %I:%M %p" }}
{# November 10, 2026 at 02:30 PM #}
```

## Filtros de URL

### url_for_type

Obtenha o URL da coleção para o tipo de produto:```liquid
{{ product.type | url_for_type }}
{# Output: /collections/types?q=Shoes #}

````
### url_for_vendor

Obtenha o URL de coleta do fornecedor:```liquid
{{ product.vendor | url_for_vendor }}
{# Output: /collections/vendors?q=Nike #}
````

### dentro

URL do escopo na coleção:```liquid
{{ product.url | within: collection }}
{# Output: /collections/sale/products/product-handle #}

````
### default_pagination

Gere HTML de paginação:```liquid
{{ paginate | default_pagination }}
{# Outputs complete pagination HTML #}
````

## Filtros Utilitários

### padrão

Forneça um valor substituto:```liquid
{{ product.metafield | default: "N/A" }}
{# If metafield is nil, outputs "N/A" #}

{{ variant.title | default: "Default" }}

````
###json

Converter para JSON:```liquid
{{ product | json }}
{# Outputs product object as JSON string #}

<script>
var productData = {{ product | json }};
</script>
````

## Encadeamento de filtros

Os filtros são executados da esquerda para a direita e podem ser encadeados:```liquid
{{ "hello world" | upcase | replace: "WORLD", "SHOPIFY" }}
{# Output: HELLO SHOPIFY #}

{{ collection.products | where: "available" | map: "title" | sort | join: ", " }}
{# Filter → extract → sort → join #}

{{ product.price | times: 0.8 | round: 2 | money }}
{# Calculate 20% discount, round, format as money #}

{{ product.description | strip_html | truncatewords: 50 | escape }}
{# Strip HTML → truncate → escape for safety #}

````
## Dicas de desempenho

1. **Resultados filtrados em cache** se usados várias vezes:```liquid
{# ❌ Inefficient: #}
{% for i in (1..10) %}
  {{ collection.products | where: "available" | size }}
{% endfor %}

{# ✅ Efficient: #}
{% assign available_products = collection.products | where: "available" %}
{% for i in (1..10) %}
  {{ available_products.size }}
{% endfor %}
````

2. **Use filtros `limit` e `offset`** em vez de controle de iteração manual

3. **Combine filtros de forma inteligente** para reduzir operações:```liquid
   {# ❌ Less efficient: #}
   {% assign titles = collection.products | map: "title" %}
   {% assign sorted = titles | sort %}
   {% assign limited = sorted | limit: 5 %}

{# ✅ More efficient: #}
{% assign limited_titles = collection.products | map: "title" | sort | limit: 5 %}

```

```
