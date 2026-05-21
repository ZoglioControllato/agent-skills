# Referência do esquema JSON do Excalidraw

Leia este arquivo antes de gerar seu primeiro diagrama. Ele contém o formato de elemento correto, modelo de contêiner de texto e sistema de ligação.

## Estrutura de nível superior```json

{
"type": "excalidraw",
"version": 2,
"source": "https://excalidraw.com",
"elements": [],
"appState": {
"viewBackgroundColor": "#ffffff",
"gridSize": 20
},
"files": {}
}

````
## Propriedades do Elemento

Todos os elementos compartilham estas propriedades básicas:

| Propriedade | Tipo | Padrão | Descrição |
| ----------------- | ----------- | --------------- | -------------------------------------------------------------------------------------------------- |
| `id` | corda | obrigatório | Identificador único (por exemplo, `"step-1"`, `"arrow-a-b"`) |
| `tipo`

| corda | obrigatório | `"retângulo"`, `"elipse"`, `"diamante"`, `"seta"`, `"linha"`, `"texto"` |
| `x`, `y` | número | obrigatório | Posicione em pixels no canto superior esquerdo. Use múltiplos de 20 para alinhamento da grade.               |
| `largura`, `altura` | número | obrigatório | Dimensões em pixels |
| `strokeColor` | corda |

`"#1e1e1e"` | Cor hexadecimal para contorno |
| `cor de fundo` | corda | `"transparente"` | Cor hexadecimal para preenchimento |
| `fillStyle` | corda | `"sólido"` | `"sólido"`, `"hachure"`, `"hachurado"` |
| `strokeWidth` | número | `2` |

Espessura do contorno (1-4) |
| `strokeStyle` | corda | `"sólido"` | `"sólido"`, `"tracejado"`, `"pontilhado"` |
| `rugosidade` | número | `1` | Efeito desenhado à mão (0 = limpo, 1 = esboço, 2 = áspero) |
| `opacidade` | número | `100` | Transparência (0-10

0) |
| `redondeza` | objeto/nulo | varia | `{ "type": 3 }` para cantos arredondados, `{ "type": 2 }` para setas curvas, `null` para texto |
| `IDs de grupo` | string[] | `[]` | Associação a grupos para elementos compostos |
| `bloqueado` | booleano | `falso` | Bloquear elemento da edição

|

**Propriedades obrigatórias em TODOS os elementos (o Excalidraw irá rejeitar ou renderizar incorretamente os elementos que faltam):**

```json
{
  "angle": 0,
  "strokeStyle": "solid",
  "opacity": 100,
  "groupIds": [],
  "frameId": null,
  "index": "a0",
  "isDeleted": false,
  "link": null,
  "locked": false,
  "seed": 1234567890,
  "version": 1,
  "versionNonce": 987654321,
  "updated": 1706659200000
}
````

- `index` é uma string de índice z fracionária. Use `"a0"`, `"a1"`, `"a2"`, etc. na ordem dos elementos. Os elementos de texto devem ter valores de índice mais altos do que formas e setas para que sejam renderizados na parte superior.
- Gere `seed` e `versionNonce` exclusivos por elemento (qualquer número inteiro distinto funciona).
- A omissão de qualquer uma dessas propriedades fará com que os elementos não sejam renderizados corretamente.

**Propriedades adicionais necessárias para setas:**

```json
{
  "lastCommittedPoint": null,
  "startArrowhead": null,
  "endArrowhead": "arrow",
  "backgroundColor": "transparent",
  "fillStyle": "solid"
}
```

**Propriedades adicionais obrigatórias para elementos de texto dentro de contêineres:**

```json
{
  "backgroundColor": "transparent",
  "fillStyle": "solid",
  "strokeWidth": 1,
  "autoResize": true
}
```

## Texto dentro de formas (CRÍTICO)

**NÃO use uma abreviação `label` ou coloque `texto` diretamente nos elementos da forma.** A abreviação `label` não é analisada pelo formato de arquivo do Excalidraw.

**Abordagem correta:** adicione `boundElements` à forma e, em seguida, crie um **elemento de texto separado** que faça referência à forma por meio de `containerId`. Sempre declare as formas primeiro, as setas depois e os elementos de texto por último — isso garante que o texto seja renderizado na parte superior e nunca seja obscurecido pelas setas.```json
[
{
"id": "step-1",
"type": "rectangle",
"x": 100,
"y": 100,
"width": 200,
"height": 80,
"backgroundColor": "#a5d8ff",
"fillStyle": "solid",
"strokeColor": "#1971c2",
"strokeWidth": 2,
"roundness": { "type": 3 },
"boundElements": [
{ "type": "text", "id": "text-step-1" }
]
},
{
"id": "text-step-1",
"type": "text",
"x": 130,
"y": 128,
"width": 140,
"height": 24,
"text": "Process Input",
"originalText": "Process Input",
"fontSize": 20,
"fontFamily": 5,
"textAlign": "center",
"verticalAlign": "middle",
"containerId": "step-1",
"lineHeight": 1.25,
"strokeColor": "#1e1e1e",
"roundness": null
}
]

````
Isso funciona para elementos `retângulo`, `elipse` e ​​`diamante`.

**Propriedades obrigatórias para elementos de texto dentro de contêineres:**

| Propriedade | Valor | Descrição |
| --------------- | ---------- | -------------------------------------------------------------------- |
| `containerId` | obrigatório | ID da forma pai |
| `textooriginal` | obrigatório | Cópia exata do `texto` — usado pelo editor Excalidraw |
| `linhaAltura` | `1,25` | UM

sempre defina isso para texto contido |
| `texto` | obrigatório | O conteúdo do texto. Use `\n` para quebras de linha.                          |
| `tamanhodafonte` | `20` | 14-36 dependendo da finalidade |
| `fonteFamília` | `5` | 5 = Excalifont (desenhado à mão), 1 = Virgílio, 2 = Helvética, 3 = Cascadia |
| `textAlign` | `"centro"` | `"esquerda"`, `"centro"`, `"direita"`

|
| `verticalAlign` | `"meio"` | `"superior"`, `"meio"`, `"inferior"` |
| `strokeColor` | `"#1e1e1e"` | Cor do texto |
| `redondeza` | `nulo` | Sempre nulo para elementos de texto |

**Elemento de texto posicionado dentro de um contêiner em (x, y, w, h):**

- `texto.x = contêiner.x + 20`
- `text.y = container.y + (container.height / 2) - (fontSize / 2)`
- `texto.largura = contêiner.largura - 40`
- `text.height = fontSize * lineHeight`

## Setas e ligações (CRÍTICO)

### Seta Básica```json
{
  "id": "arrow-1",
  "type": "arrow",
  "x": 300,
  "y": 140,
  "width": 100,
  "height": 0,
  "points": [
    [0, 0],
    [100, 0]
  ],
  "roundness": { "type": 2 },
  "strokeWidth": 2
}
````

### Seta com etiqueta

Os rótulos de seta também exigem `boundElements` na seta e um elemento de texto separado com `containerId`. **NÃO use uma abreviatura `label`** — ela não é suportada.```json
[
{
"id": "arrow-1",
"type": "arrow",
"x": 300,
"y": 140,
"width": 200,
"height": 0,
"points": [
[0, 0],
[200, 0]
],
"roundness": { "type": 2 },
"strokeWidth": 2,
"boundElements": [
{ "type": "text", "id": "text-arrow-1" }
]
},
{
"id": "text-arrow-1",
"type": "text",
"x": 360,
"y": 122,
"width": 80,
"height": 18,
"text": "sends data",
"originalText": "sends data",
"fontSize": 14,
"fontFamily": 5,
"textAlign": "center",
"verticalAlign": "middle",
"containerId": "arrow-1",
"lineHeight": 1.25,
"strokeColor": "#1e1e1e",
"roundness": null
}
]

````
### Setas vinculadas (conectam-se às formas)

Para setas que se movem quando as formas são reposicionadas, use `startBinding` e `endBinding`. **NÃO use `start`/`end`** — elas não são propriedades válidas do Excalidraw.

Cada forma conectada também deve listar a seta em seu array `boundElements`.

**A ordem dos elementos é importante para o índice z:** declare as formas primeiro, as setas depois e os elementos de texto por último - para que o texto sempre seja renderizado na parte superior.```json
[
  {
    "id": "box-a",
    "type": "rectangle",
    "x": 100,
    "y": 100,
    "width": 160,
    "height": 80,
    "boundElements": [
      { "type": "text", "id": "text-box-a" },
      { "type": "arrow", "id": "arrow-a-b" }
    ]
  },
  {
    "id": "box-b",
    "type": "rectangle",
    "x": 460,
    "y": 100,
    "width": 160,
    "height": 80,
    "boundElements": [
      { "type": "text", "id": "text-box-b" },
      { "type": "arrow", "id": "arrow-a-b" }
    ]
  },
  {
    "id": "arrow-a-b",
    "type": "arrow",
    "x": 260,
    "y": 140,
    "width": 200,
    "height": 0,
    "points": [
      [0, 0],
      [200, 0]
    ],
    "startBinding": { "elementId": "box-a", "focus": 0, "gap": 1 },
    "endBinding": { "elementId": "box-b", "focus": 0, "gap": 1 },
    "boundElements": [
      { "type": "text", "id": "text-arrow-a-b" }
    ]
  },
  {
    "id": "text-box-a",
    "type": "text",
    "x": 120,
    "y": 128,
    "width": 120,
    "height": 24,
    "text": "Service A",
    "originalText": "Service A",
    "fontSize": 20,
    "fontFamily": 5,
    "textAlign": "center",
    "verticalAlign": "middle",
    "containerId": "box-a",
    "lineHeight": 1.25,
    "strokeColor": "#1e1e1e",
    "roundness": null
  },
  {
    "id": "text-box-b",
    "type": "text",
    "x": 480,
    "y": 128,
    "width": 120,
    "height": 24,
    "text": "Service B",
    "originalText": "Service B",
    "fontSize": 20,
    "fontFamily": 5,
    "textAlign": "center",
    "verticalAlign": "middle",
    "containerId": "box-b",
    "lineHeight": 1.25,
    "strokeColor": "#1e1e1e",
    "roundness": null
  },
  {
    "id": "text-arrow-a-b",
    "type": "text",
    "x": 320,
    "y": 122,
    "width": 80,
    "height": 18,
    "text": "REST API",
    "originalText": "REST API",
    "fontSize": 14,
    "fontFamily": 5,
    "textAlign": "center",
    "verticalAlign": "middle",
    "containerId": "arrow-a-b",
    "lineHeight": 1.25,
    "strokeColor": "#1e1e1e",
    "roundness": null
  }
]
````

**Propriedades de ligação:**

| Propriedade  | Valor | Descrição                                                      |
| ------------ | ----- | -------------------------------------------------------------- |
| `elementoId` | corda | ID da forma conectada                                          |
| `foco`       | `0`   | Ponto de conexão: 0 = centro, -1/+1 = bordas superior-inferior |
| `lacuna`     | `1`   | Espaço em pixels entre a ponta da seta e o limite da forma     |

### Direções das setas

| Direção            | Pontos                           |
| ------------------ | -------------------------------- |
| Horizontais (→)    | `[[0, 0], [200, 0]]`             |
| Verticais (↓)      | `[[0, 0], [0, 150]]`             |
| Diagonal (↘)       | `[[0, 0], [200, 150]]`           |
| Em forma de L (→↓) | `[[0, 0], [200, 0], [200, 150]]` |

## Design Tokens — Paleta Elegante

Use essas cores selecionadas para diagramas profissionais e modernos. Evite cores primárias cruas.

### Tema claro (padrão)

| Função               | Preencher    | Acidente vascular cerebral | Preenchimento hexadecimal | Curso hexadecimal |
| -------------------- | ------------ | -------------------------- | ------------------------- | ----------------- |
| **Primário**         | Azul suave   | Azul mais profundo         | `#a5d8ff`                 | `#1971c2`         |
| **Sucesso/Processo** | Verde menta  | Floresta verde             | `#b2f2bb`                 | `#2f9e44`         |
| **Aviso/Decisão**    | Âmbar quente | Âmbar profundo             | `#ffec99`                 | `#e67700`         |
| **Perigo/Erro**      | Rosa suave   | Rosa profundo              |

| `#ffc9c9` | `#e03131` |
| **Neutro/Secundário** | Cinza claro | Cinza médio | `#e9ecef` | `#868e96` |
| **Acento** | Violeta suave | Violeta profundo | `#d0bfff` | `#7048e8` |
| **Informações/Destaque** | Ciano suave | Azul-petróleo | `#96f2d7` | `#0c8599` |
| **Tela** | Branco | — | `#ffffff` | — |
| **Traço padrão** | — | Quase preto | — | `#1e1e1e` |

### Cores Abertas — Paleta Completa

O seletor de cores nativo do Excalidraw é baseado em [Open Colors](https://yeun.github.io/open-colors/). Use sombra 2 para preenchimentos e sombra 8 para traços correspondentes para criar profundidade.

| Família  | Preencher (sombra-2) | Curso (sombra-8) | Preencher hexadecimal | Curso hexadecimal |
| -------- | -------------------- | ---------------- | --------------------- | ----------------- |
| Cinza    | `cinza-2`            | `cinza-8`        | `#e9ecef`             | `#343a40`         |
| Vermelho | `vermelho-2`         | `vermelho-8`     | `#ffc9c9`             | `#c92a2a`         |
| Rosa     | `rosa-2`             | `rosa-8`         | `#fcc2d7`             | `#a61e4d`         |
| Uva      | `uva-2`              | `uva-8`          | `#e5dbff`             | `#6741d9`         |
| Violeta  |

`violeta-2` | `violeta-8` | `#d0bfff` | `#5f3dc4` |
| Índigo | `índigo-2` | `índigo-8` | `#bac8ff` | `#3b5bdb` |
| Azul | `azul-2` | `azul-8` | `#a5d8ff` | `#1864ab` |
| Ciano | `ciano-2` | `ciano-8` | `#99e9f2` | `#0b7285` |
| Azul-petróleo | `azul-petróleo-2` | `azul-petróleo-8` | `#96f2d7` | `#087f5b` |
| Verde | `verde-2` | `verde-8` | `#b2f2bb` | `#2b8a3e` |
| Lima | `cal-2`

| `cal-8` | `#d8f5a2` | `#5c940d` |
| Amarelo | `amarelo-2` | `amarelo-8` | `#ffec99` | `#e67700` |
| Laranja | `laranja-2` | `laranja-8` | `#ffd8a8` | `#d9480f` |

### Paletas profissionais selecionadas

Use uma paleta por diagrama para coerência visual:

**Blue-Tech** (APIs, microsserviços, nuvem):

- API/Gateway: preencha `#a5d8ff`, traço `#1971c2`
- Serviços: preencha `#b2f2bb`, traço `#2f9e44`
- Dados: preencha `#96f2d7`, traço `#0c8599`
- Eventos: preencha `#d0bfff`, traço `#7048e8`

**Quente-Neutro** (processos de negócios, fluxos de trabalho):

- Primário: preencha `#ffd8a8`, traço `#d9480f`
- Secundário: preencha `#ffec99`, traço `#e67700`
- Suporte: preencha `#e9ecef`, traço `#868e96`
- Ação: preencha `#b2f2bb`, traço `#2f9e44`

**Monocromático** (limpo/mínimo):

- Principal: preencha `#e9ecef`, traço `#343a40`
- Ênfase: preencha `#ced4da`, traço `#212529`
- Acento: preencha `#a5d8ff`, traço `#1971c2` (acento de cor única)

### Tema escuro

Quando o usuário solicitar o modo escuro, defina `"viewBackgroundColor": "#1e1e1e"` e use estes:

| Função       | Preencher       | Acidente vascular cerebral | Preenchimento hexadecimal | Curso hexadecimal |
| ------------ | --------------- | -------------------------- | ------------------------- | ----------------- |
| **Primário** | Azul profundo   | Azul claro                 | `#1864ab`                 | `#74c0fc`         |
| **Sucesso**  | Verde profundo  | Verde claro                | `#2b8a3e`                 | `#8ce99a`         |
| **Aviso**    | Âmbar profundo  | Âmbar claro                | `#e67700`                 | `#ffd43b`         |
| **Perigo**   | Vermelho escuro | Vermelho claro             | `#c92a2a`                 | `#ff8787`         |

| **Neutro** | Cinza escuro | Cinza claro | `#343a40` | `#adb5bd` |
| **Traço padrão** | — | Branco | — | `#ffffff` |

### Escala de tipografia

| Finalidade           | Tamanho da fonte | Família de fontes     |
| -------------------- | ---------------- | --------------------- |
| Título do diagrama   | 28-32            | `família da fonte: 5` |
| Cabeçalho da seção   | 22-24            | `família da fonte: 5` |
| Etiqueta do elemento | 18-20            | `família da fonte: 5` |
| Etiqueta de seta     | 14-16            | `família da fonte: 5` |
| Anotação/nota        | 12-14            | `família da fonte: 5` |

### Sistema de espaçamento

Todo o espaçamento baseado em `gridSize: 20`:

| Contexto                                    | Valor     | Múltiplos de grade |
| ------------------------------------------- | --------- | ------------------ |
| Entre elementos (horizontal)                | 200-300px | 10-15 unidades     |
| Entre elementos (vertical)                  | 100-150px | 5-7,5 unidades     |
| Preenchimento de elemento (formas internas) | 20-40px   | 1-2 unidades       |
| Folga em formato de seta                    | 20px      | 1 unidade          |
| Margem da tela                              | 60px      | 3 unidades         |

|
| Entre grupos de elementos | 400px | 20 unidades |

## Famílias de fontes

| ID  | Nome        | Estilo                         | Quando usar                                             |
| --- | ----------- | ------------------------------ | ------------------------------------------------------- |
| 5   | Excalifonte | Desenhado à mão (mais recente) | Padrão — corresponde à estética exclusiva do Excalidraw |
| 1   | Virgílio    | Desenhado à mão (clássico)     | Fallback se fontFamily 5 não for compatível             |
| 2   | Helvética   | Limpar sem serifa              | Técnico/formal d                                        |

diagramas quando solicitado |
| 3 | Cascadia | Monoespaçado | Etiquetas de código, identificadores técnicos |

**O padrão é fontFamily 5 para todo o texto**, a menos que o usuário solicite explicitamente um estilo formal/limpo.

## Modos Visuais

Escolha um modo visual antecipadamente e aplique-o de forma consistente. Nunca misture modos em elementos do mesmo nível.

### Modo Esboço (padrão)

Estética desenhada à mão exclusiva do Excalidraw:```json
{
"roughness": 1,
"fontFamily": 5
}

````
Aplique `rugosidade: 1` a todas as formas e setas. Use `fontFamily: 5` (Excalifont) para todo o texto.

### Modo Limpo

Preciso, polido, pronto para apresentação:```json
{
  "roughness": 0,
  "fontFamily": 2
}
````

Aplique `rugosidade: 0` a todas as formas e setas. Use `fontFamily: 2` (Helvetica) para o corpo, `fontFamily: 5` para títulos.

### Modo Misto (recomendado para arquitetura)

Zonas de fundo limpas (`rugosidade: 0`) + formas de primeiro plano esboçadas (`rugosidade: 1`):

- Zonas: `rugosidade: 0` — estrutural, preciso
- Formas: `rugosidade: 1` — conteúdo, acessível

## Zonas de fundo

As zonas de fundo são retângulos tracejados semitransparentes colocados **antes de todos os outros elementos** (valores de `índice` mais baixos) para criar regiões de agrupamento visual.

**Propriedades de zona obrigatórias:**

```json
{
  "id": "zone-backend",
  "type": "rectangle",
  "x": 300,
  "y": 140,
  "width": 480,
  "height": 320,
  "angle": 0,
  "strokeColor": "#4c6ef5",
  "backgroundColor": "#dbe4ff",
  "fillStyle": "solid",
  "strokeWidth": 1,
  "strokeStyle": "dashed",
  "roughness": 0,
  "opacity": 35,
  "roundness": { "type": 3 },
  "groupIds": [],
  "frameId": null,
  "index": "a0",
  "isDeleted": false,
  "link": null,
  "locked": false,
  "seed": 111111111,
  "version": 1,
  "versionNonce": 222222222,
  "updated": 1706659200000,
  "boundElements": []
}
```

**Propriedades da zona crítica:**

- `opacidade: 35` — semitransparente (faixa 20-40 funciona; 35 é o ponto ideal)
- `strokeStyle: "dashed"` — marca a zona como limite, não como uma forma regular
- `rugosidade: 0` — limpa arestas de zona mesmo em diagramas de modo de esboço
- `fillStyle: "solid"` — necessário para que a coloração de opacidade funcione

**Rótulo da zona** — adicione um texto independente próximo ao canto superior esquerdo da zona, após outro texto na matriz:```json
{
"id": "label-zone-backend",
"type": "text",
"x": 320,
"y": 148,
"width": 140,
"height": 18,
"text": "Backend Services",
"originalText": "Backend Services",
"fontSize": 14,
"fontFamily": 5,
"strokeColor": "#4c6ef5",
"textAlign": "left",
"containerId": null,
"lineHeight": 1.25,
"roundness": null
}

````

**Ordenação de elementos quando zonas estão presentes:**

1. Zonas de fundo (índices `a0`, `a1`, ...)
2. Formas de conteúdo (os índices continuam após as zonas)
3. Setas
4. Elementos de texto (índices mais altos)

## Quadros

Os quadros são contêineres nomeados que agrupam elementos visualmente com uma barra de título. Eles aparecem no painel esquerdo do Excalidraw para navegação.```json
{
  "id": "frame-1",
  "type": "frame",
  "x": 80,
  "y": 80,
  "width": 680,
  "height": 480,
  "angle": 0,
  "strokeColor": "#bbb",
  "backgroundColor": "transparent",
  "fillStyle": "solid",
  "strokeWidth": 2,
  "strokeStyle": "solid",
  "roughness": 0,
  "opacity": 100,
  "groupIds": [],
  "frameId": null,
  "index": "a0",
  "isDeleted": false,
  "link": null,
  "locked": false,
  "seed": 100000001,
  "version": 1,
  "versionNonce": 100000002,
  "updated": 1706659200000,
  "name": "Order Processing Flow",
  "boundElements": []
}
````

Os elementos dentro de um quadro fazem referência a ele via `"frameId": "frame-1"`. O quadro `nome` aparece como o título do quadro.

Use quadros para: diagramas de várias páginas, seções distintas de diagramas, limites de exportação.

## Sistema de Coordenadas

- A origem `(0, 0)` está no canto superior esquerdo
- X aumenta para a direita
- Y aumenta para baixo
- Todas as unidades estão em pixels
- Alinhar à grade: posicionar em múltiplos de 20 (quando `gridSize: 20`)

## Guia de dimensionamento de elementos

| Forma     | Conteúdo                   | Largura   | Altura    |
| --------- | -------------------------- | --------- | --------- |
| Retângulo | Palavra única              | 140-160px | 60-80px   |
| Retângulo | Frase curta (2-4 palavras) | 180-220px | 80-100px  |
| Retângulo | Frase                      | 250-320px | 100-120px |
| Elipse    | Texto curto (círculo)      | 120×120px | —         |
| Elipse    | Texto mais longo           | 160×120px | -         |

|
| Diamante | Pergunta curta | 140×140px | — |
| Diamante | Pergunta mais longa | 180×180px | — |

**Fórmula de largura para texto:** `text.length × fontSize × 0.6`
**Fórmula de altura:** `fontSize × 1,2 × numberOfLines`

## Agrupando Elementos

Use `groupIds` para criar elementos compostos que se movem juntos:```json
[
{
"id": "server-box",
"type": "rectangle",
"x": 100,
"y": 100,
"width": 180,
"height": 80,
"groupIds": ["server-group"],
"boundElements": [
{ "type": "text", "id": "text-server-box" }
]
},
{
"id": "server-icon",
"type": "text",
"x": 105,
"y": 185,
"width": 30,
"height": 30,
"text": "🖥️",
"fontSize": 20,
"fontFamily": 5,
"groupIds": ["server-group"],
"containerId": null,
"roundness": null
},
{
"id": "text-server-box",
"type": "text",
"x": 120,
"y": 128,
"width": 140,
"height": 24,
"text": "Web Server",
"originalText": "Web Server",
"fontSize": 20,
"fontFamily": 5,
"textAlign": "center",
"verticalAlign": "middle",
"containerId": "server-box",
"lineHeight": 1.25,
"strokeColor": "#1e1e1e",
"groupIds": ["server-group"],
"roundness": null
}
]

````
## `customData` para metadados

Armazene informações extras sobre elementos que persistem no arquivo, mas não são renderizados:```json
{
  "id": "step-1",
  "type": "rectangle",
  "customData": {
    "diagramType": "flowchart",
    "stepNumber": 1,
    "generatedBy": "excalidraw-studio"
  }
}
````

## Exemplo Mínimo Completo

Um fluxograma com duas formas conectadas. Observe a ordem dos elementos: formas → setas → elementos de texto (garante que o texto seja sempre renderizado na parte superior, nunca obscurecido por setas).```json
{
"type": "excalidraw",
"version": 2,
"source": "https://excalidraw.com",
"elements": [
{
"id": "title",
"type": "text",
"x": 100,
"y": 40,
"width": 300,
"height": 35,
"text": "User Registration Flow",
"originalText": "User Registration Flow",
"fontSize": 28,
"fontFamily": 5,
"textAlign": "center",
"strokeColor": "#1e1e1e",
"opacity": 100,
"roundness": null,
"containerId": null,
"lineHeight": 1.25
},
{
"id": "step-1",
"type": "rectangle",
"x": 100,
"y": 120,
"width": 200,
"height": 80,
"strokeColor": "#1971c2",
"backgroundColor": "#a5d8ff",
"fillStyle": "solid",
"strokeWidth": 2,
"roughness": 1,
"roundness": { "type": 3 },
"boundElements": [
{ "type": "text", "id": "text-step-1" },
{ "type": "arrow", "id": "arrow-1-2" }
]
},
{
"id": "step-2",
"type": "rectangle",
"x": 400,
"y": 120,
"width": 200,
"height": 80,
"strokeColor": "#2f9e44",
"backgroundColor": "#b2f2bb",
"fillStyle": "solid",
"strokeWidth": 2,
"roughness": 1,
"roundness": { "type": 3 },
"boundElements": [
{ "type": "text", "id": "text-step-2" },
{ "type": "arrow", "id": "arrow-1-2" }
]
},
{
"id": "arrow-1-2",
"type": "arrow",
"x": 300,
"y": 160,
"width": 100,
"height": 0,
"points": [
[0, 0],
[100, 0]
],
"strokeColor": "#1e1e1e",
"strokeWidth": 2,
"roundness": { "type": 2 },
"startBinding": { "elementId": "step-1", "focus": 0, "gap": 1 },
"endBinding": { "elementId": "step-2", "focus": 0, "gap": 1 }
},
{
"id": "text-step-1",
"type": "text",
"x": 130,
"y": 148,
"width": 140,
"height": 24,
"text": "Enter Email",
"originalText": "Enter Email",
"fontSize": 20,
"fontFamily": 5,
"textAlign": "center",
"verticalAlign": "middle",
"containerId": "step-1",
"lineHeight": 1.25,
"strokeColor": "#1e1e1e",
"roundness": null
},
{
"id": "text-step-2",
"type": "text",
"x": 430,
"y": 148,
"width": 140,
"height": 24,
"text": "Verify Email",
"originalText": "Verify Email",
"fontSize": 20,
"fontFamily": 5,
"textAlign": "center",
"verticalAlign": "middle",
"containerId": "step-2",
"lineHeight": 1.25,
"strokeColor": "#1e1e1e",
"roundness": null
}
],
"appState": {
"viewBackgroundColor": "#ffffff",
"gridSize": 20
},
"files": {}
}

```

```
