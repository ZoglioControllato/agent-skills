# Tipografia

## Princípios de Tipografia Clássica

### Ritmo vertical

A altura da linha deve ser a unidade base para TODOS os espaçamentos verticais. Se o corpo do texto tiver `line-height: 1.5` no tipo `16px` (= 24px), os valores de espaçamento deverão ser múltiplos de 24px. Isso cria harmonia subconsciente – texto e espaço compartilham uma base matemática.

### Escala Modular e Hierarquia

O erro comum: muitos tamanhos de fonte muito próximos (14px, 15px, 16px, 18px...). Isso cria uma hierarquia turva.

**Use menos tamanhos com mais contraste.** Um sistema de 5 tamanhos atende à maioria das necessidades:

| Função | Razão típica | Caso de uso                 |
| ------ | ------------ | --------------------------- |
| xs     | 0,75rem      | Legendas legais             |
| sm     | 0,875rem     | UI secundária, metadados    |
| base   | 1rem         | Corpo do texto              |
| lg     | 1,25-1,5rem  | Subtítulos, texto principal |
| xl+    | 2-4rem       | Manchetes, texto heróico    |

Razões populares: 1,25 (terço maior), 1,333 (quarto perfeito), 1,5 (quinto perfeito). Escolha um e comprometa-se.

### Legibilidade e medida

Use unidades `ch` para medida baseada em caracteres (`max-width: 65ch`). A altura da linha é dimensionada inversamente ao comprimento da linha – colunas estreitas precisam de entrelinhamento mais estreito, colunas largas precisam de mais.

**Não óbvio**: Aumente a altura da linha para texto claro em fundos escuros. O peso percebido é mais leve, então o texto precisa de mais espaço para respirar. Adicione 0,05-0,1 à altura normal da linha.

## Seleção e emparelhamento de fontes

### Escolhendo fontes distintas

**Evite os padrões invisíveis**: Inter, Roboto, Open Sans, Lato, Montserrat. Eles estão por toda parte, fazendo com que seu design pareça genérico. Eles são ótimos para documentação ou ferramentas onde a personalidade não é o objetivo – mas se você quiser um design diferenciado, procure outro lugar.

**Melhores alternativas de fontes do Google**:

- Em vez de Inter → **Instrument Sans**, **Plus Jakarta Sans**, **Outfit**
- Em vez de Roboto → **Onest**, **Figtree**, **Urbanista**
- Em vez de Open Sans → **Source Sans 3**, **Nunito Sans**, **DM Sans**
- Para sensação editorial/premium → **Fraunces**, **Newsreader**, **Lora**

**As fontes do sistema são subestimadas**: `-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui` parece nativa, carrega instantaneamente e é altamente legível. Considere isso para aplicativos onde desempenho > personalidade.

### Princípios de emparelhamento

**A verdade não óbvia**: muitas vezes você não precisa de uma segunda fonte. Uma família de fontes bem escolhida com pesos múltiplos cria uma hierarquia mais limpa do que duas fontes concorrentes. Adicione apenas uma segunda fonte quando precisar de contraste genuíno (por exemplo, exibir títulos + corpo serifado).

Ao emparelhar, contraste em vários eixos:

- Serif + Sans (contraste da estrutura)
- Geométrico + Humanista (contraste de personalidade)
- Tela condensada + Corpo amplo (contraste proporcional)

**Nunca combine fontes semelhantes, mas não idênticas** (por exemplo, duas sans-serifs geométricas). Eles criam tensão visual sem hierarquia clara.

### Carregamento de fontes da Web

O problema da mudança de layout: as fontes carregam tarde, o texto reflui e os usuários veem o conteúdo saltar. Aqui está a solução:```css
/_ 1. Use font-display: swap for visibility _/
@font-face {
font-family: 'CustomFont';
src: url('font.woff2') format('woff2');
font-display: swap;
}

/_ 2. Match fallback metrics to minimize shift _/
@font-face {
font-family: 'CustomFont-Fallback';
src: local('Arial');
size-adjust: 105%; /_ Scale to match x-height _/
ascent-override: 90%; /_ Match ascender height _/
descent-override: 20%; /_ Match descender depth _/
line-gap-override: 10%; /_ Match line spacing _/
}

body {
font-family: 'CustomFont', 'CustomFont-Fallback', sans-serif;
}

````
Ferramentas como [Fontaine](https://github.com/unjs/fontaine) calculam essas substituições automaticamente.

## Tipografia da Web Moderna

### Tipo de fluido

Use `clamp(min, preferencial, max)` para tipografia fluida. O valor médio (por exemplo, `5vw + 1rem`) controla a taxa de escalonamento – vw mais alto = escalonamento mais rápido. Adicione um deslocamento rem para que não caia para 0 em telas pequenas.

**Quando NÃO usar tipo fluido**: texto de botão, rótulos, elementos de interface do usuário (devem ser consistentes), texto muito curto ou quando você precisar de controle preciso de pontos de interrupção.

### Recursos OpenType

A maioria dos desenvolvedores não sabe que eles existem. Use-os para polir:```css
/* Tabular numbers for data alignment */
.data-table { font-variant-numeric: tabular-nums; }

/* Proper fractions */
.recipe-amount { font-variant-numeric: diagonal-fractions; }

/* Small caps for abbreviations */
abbr { font-variant-caps: all-small-caps; }

/* Disable ligatures in code */
code { font-variant-ligatures: none; }

/* Enable kerning (usually on by default, but be explicit) */
body { font-kerning: normal; }
````

Verifique quais recursos sua fonte suporta em [Wakamai Fondue](https://wakamaifondue.com/).

## Arquitetura do sistema de tipografia

Nomeie os tokens semanticamente (`--text-body`, `--text-heading`), não por valor (`--font-size-16`). Inclua pilhas de fontes, escala de tamanho, pesos, alturas de linha e espaçamento entre letras em seu sistema de token.

## Considerações sobre acessibilidade

Além das taxas de contraste (que estão bem documentadas), considere:

- **Nunca desative o zoom**: `user-scalable=no` quebra a acessibilidade. Se o seu layout quebrar com zoom de 200%, corrija o layout.
- **Use rem/em para tamanhos de fonte**: Isso respeita as configurações do navegador do usuário. Nunca `px` para o corpo do texto.
- **Corpo de texto mínimo de 16px**: Menor que isso cansa os olhos e falha nas WCAG em dispositivos móveis.
- **Alvos de toque adequados**: os links de texto precisam de preenchimento ou altura de linha que crie alvos de toque de mais de 44 pixels.

---

**Evitar**: Mais de 2 a 3 famílias de fontes por projeto. Ignorando definições de fontes substitutas. Ignorando o desempenho de carregamento de fontes (FOUT/FOIT). Usando fontes decorativas para o corpo do texto.
