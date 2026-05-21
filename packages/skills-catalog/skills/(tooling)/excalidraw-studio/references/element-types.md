# Guia de tipos de elementos Excalidraw

Leia este arquivo quando precisar de orientação detalhada sobre quais elementos usar para tipos de diagramas específicos e como construí-los corretamente.

Para as propriedades e formato JSON, consulte `excalidraw-schema.md`.

## Visão geral do tipo de elemento

| Tipo        | Forma | Uso primário                            | Encadernação de texto      | Encadernação de seta    |
| ----------- | ----- | --------------------------------------- | -------------------------- | ----------------------- |
| `retângulo` | □     | Caixas, recipientes, etapas de processo | através de `boundElements` | As setas podem vincular |
| `elipse`    | ○     | Início/fim, estados, ênfase             | através de `boundElements` | As setas podem vincular |
| `diamante`  | ◇     | Decisão                                 |

em pontos, condições | através de `boundElements` | As setas podem vincular |
| `seta` | → | Fluxo direcional, relacionamentos | através de `boundElements` | Vincula-se a formas |
| `linha` | — | Conexões não direcionais, divisórias | ❌ | Vincula-se a formas |
| `texto` | Um | Etiquetas, títulos e anotações independentes | — | Não vinculável |

## Formas — Retângulo, Elipse, Diamante

### Quando usar cada

| Forma         | Melhor para                                                         | Significado visual                       |
| ------------- | ------------------------------------------------------------------- | ---------------------------------------- |
| **Retângulo** | Etapas do processo, entidades, componentes, armazenamentos de dados | “Isto é uma coisa” ou “Isto é uma ação”  |
| **Elipse**    | Terminais de início/fim, estados, ênfase                            | “Isto é um limite” ou “Isto é um estado” |

|
| **Diamante** | Pontos de decisão, ramificações condicionais | "Isso é uma pergunta" |

### Texto em formas

**NUNCA use `label: { text: "..." }` abreviação** — não é suportado no formato de arquivo `.excalidraw`. Sempre crie um elemento `text` separado e vincule-o via `containerId` e `boundElements`.```json
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
"backgroundColor": "transparent",
"autoResize": true,
"roundness": null
}
]

````

**Texto multilinha:** Use `\n` nos campos `text` e `originalText`:```json
{
  "text": "User\nAuthentication\nService",
  "originalText": "User\nAuthentication\nService"
}
````

**Elemento de texto posicionado dentro de um contêiner em (x, y, w, h):**

- `texto.x = contêiner.x + 20`
- `text.y = container.y + (container.height / 2) - (fontSize / 2)`
- `texto.largura = contêiner.largura - 40`
- `text.height = fontSize * 1,25`

### Diretrizes de tamanho

| Comprimento do conteúdo | Retângulo | Elipse  | Diamante |
| ----------------------- | --------- | ------- | -------- |
| 1 palavra               | 140×70    | 120×120 | 140×140  |
| 2-4 palavras            | 200×80    | 160×120 | 180×180  |
| Frase curta             | 280×100   | 200×140 | 220×220  |

### Estilo para elegância

**Use combinações de traço + preenchimento** — combinando o traço com a tonalidade mais profunda do preenchimento:

| Função   | Preencher | Acidente vascular cerebral | Efeito                         |
| -------- | --------- | -------------------------- | ------------------------------ |
| Primário | `#a5d8ff` | `#1971c2`                  | Cartão azul com borda definida |
| Sucesso  | `#b2f2bb` | `#2f9e44`                  | Passo verde com ênfase         |
| Aviso    | `#ffec99` | `#e67700`                  | Decisão âmbar com calor        |
| Perigo   | `#ffc9c9` | `#e03131`                  | Erro vermelho com urgência     |
| Neutro   | `#e9ecef` | `#868e96`                  | Sutil                          |

, sem ênfase |
| Sotaque | `#d0bfff` | `#7048e8` | Destaque roxo |

**variações de fillStyle** para variedade visual dentro do mesmo diagrama:

- `"solid"` — Aparência limpa e moderna (padrão para a maioria das formas)
- `"hachure"` — Preenchimento esboçado, bom para elementos secundários/de fundo
- `"hachurado"` — Preenchimento denso, bom para ênfase ou estados "concluídos"

## Setas

### Seta direcional básica```json

{
"id": "flow-1",
"type": "arrow",
"x": 300,
"y": 140,
"width": 200,
"height": 0,
"points": [
[0, 0],
[200, 0]
],
"strokeWidth": 2,
"roundness": { "type": 2 },
"lastCommittedPoint": null,
"startArrowhead": null,
"endArrowhead": "arrow"
}

````
### Seta com etiqueta

Os rótulos de seta também requerem `boundElements` na seta + um elemento de texto separado com `containerId`. **Nunca use `label: { text: "..." }` nas setas.**

```json
[
  {
    "id": "flow-1",
    "type": "arrow",
    "x": 300,
    "y": 140,
    "width": 200,
    "height": 0,
    "points": [[0, 0], [200, 0]],
    "strokeWidth": 2,
    "roundness": { "type": 2 },
    "lastCommittedPoint": null,
    "startArrowhead": null,
    "endArrowhead": "arrow",
    "boundElements": [
      { "type": "text", "id": "text-flow-1" }
    ]
  },
  {
    "id": "text-flow-1",
    "type": "text",
    "x": 360,
    "y": 122,
    "width": 80,
    "height": 18,
    "text": "HTTP/JSON",
    "originalText": "HTTP/JSON",
    "fontSize": 14,
    "fontFamily": 5,
    "textAlign": "center",
    "verticalAlign": "middle",
    "containerId": "flow-1",
    "lineHeight": 1.25,
    "strokeColor": "#1e1e1e",
    "backgroundColor": "transparent",
    "autoResize": true,
    "roundness": null
  }
]
````

### Seta vinculada (conecta-se a formas)

Use `startBinding`/`endBinding` — **nunca `start`/`end`**. As formas conectadas devem listar a seta em seus `boundElements`.```json
[
{
"id": "source-box",
"type": "rectangle",
"boundElements": [
{ "type": "text", "id": "text-source" },
{ "type": "arrow", "id": "flow-1" }
]
},
{
"id": "target-box",
"type": "rectangle",
"boundElements": [
{ "type": "text", "id": "text-target" },
{ "type": "arrow", "id": "flow-1" }
]
},
{
"id": "flow-1",
"type": "arrow",
"points": [[0, 0], [200, 0]],
"startBinding": { "elementId": "source-box", "focus": 0, "gap": 1 },
"endBinding": { "elementId": "target-box", "focus": 0, "gap": 1 },
"lastCommittedPoint": null,
"startArrowhead": null,
"endArrowhead": "arrow"
}
]

````
### Estilos de seta para significado semântico

| Estilo | estiloAVC | largura do curso | Significado |
| ---------------------- | ----------- | ----------- | ------------------------------------ |
| **Fluxo primário** | `"sólido"` | 2 | Caminho principal, fluxo normal |
| **Fluxo importante** | `"sólido"` | 3 | Caminho crítico, ênfase |
| **Opcional/alternativo** | `"tracejado"` | 2 | Caminho opcional, queda

voltar |
| **Indireto/assíncrono** | `"pontilhado"` | 2 | Dependência fraca, assíncrona e orientada a eventos |

### Direções das setas

| Direção | Pontos | Caso de uso |
| ------------------ | -------------------------------- | ----------------------- |
| → Direita | `[[0, 0], [200, 0]]` | Fluxo do processo |
| ↓ Baixo | `[[0, 0], [0, 150]]` | Hierarquia, sequência |
| ↘ Diagonal | `[[0, 0], [200, 150]]` | Conexões cruzadas |
| → então ↓ (formato L) | `[[0, 0

], [200, 0], [200, 150]]` | Roteamento em torno de elementos |

## Linhas

Conexões não direcionais sem ponta de seta:```json
{
  "type": "line",
  "x": 100,
  "y": 300,
  "points": [
    [0, 0],
    [400, 0]
  ],
  "strokeStyle": "dashed",
  "strokeWidth": 1,
  "strokeColor": "#868e96"
}
````

**Casos de uso:** Divisores de seção, limites, relacionamentos não direcionais (associação UML).

## Texto independente

Para títulos, cabeçalhos e anotações que não estão dentro de uma forma. Defina `containerId: null`:```json
{
"id": "title-1",
"type": "text",
"x": 100,
"y": 40,
"width": 300,
"height": 35,
"text": "System Architecture Overview",
"originalText": "System Architecture Overview",
"fontSize": 28,
"fontFamily": 5,
"textAlign": "center",
"strokeColor": "#1e1e1e",
"containerId": null,
"lineHeight": 1.25,
"roundness": null
}

````

**Cálculo de largura/altura:**

- Largura ≈ `text.length × fontSize × 0,6`
- Altura ≈ `fontSize × 1,2 × numberOfLines`

## Zonas de fundo (agrupamento visual)

As zonas de fundo são grandes retângulos semitransparentes colocados **atrás** de outros elementos para agrupá-los visualmente em regiões. Eles são uma técnica fundamental para diagramas de arquitetura profissional.

**Principais propriedades de uma zona:**

- `opacity: 35` — semitransparente para que os elementos atrás/na frente permaneçam visíveis
- `strokeStyle: "dashed"` — marca claramente como um limite, não uma forma
- `rugosidade: 0` — bordas limpas para zonas de fundo
- `fillStyle: "solid"` — necessário para que a opacidade mostre a cor

As zonas devem ser declaradas **primeiro** no array `elements` para que sejam renderizadas atrás de todo o resto.```json
[
  {
    "id": "zone-backend",
    "type": "rectangle",
    "x": 300,
    "y": 140,
    "width": 480,
    "height": 320,
    "strokeColor": "#1971c2",
    "backgroundColor": "#dbe4ff",
    "fillStyle": "solid",
    "strokeWidth": 1,
    "strokeStyle": "dashed",
    "roughness": 0,
    "opacity": 35,
    "roundness": { "type": 3 },
    "boundElements": []
  }
]
````

Adicione um rótulo de texto independente próximo ao canto superior esquerdo da zona:```json
{
"id": "label-zone-backend",
"type": "text",
"x": 320,
"y": 148,
"width": 120,
"height": 20,
"text": "Backend Services",
"originalText": "Backend Services",
"fontSize": 14,
"fontFamily": 5,
"strokeColor": "#1971c2",
"containerId": null,
"lineHeight": 1.25,
"roundness": null
}

````

**Ordem dos elementos com zonas:** zonas → formas → setas → elementos de texto

**Recomendações de cores de zona:**

| Finalidade da zona | fundoCor | traçoCor |
| --------------- | --------------- | ----------- |
| Serviços/Lógica | `#dbe4ff` | `#4c6ef5` |
| Camada de dados | `#d3f9d8` | `#2f9e44` |
| Externos/Usuários | `#fff9db` | `#f08c00` |
| Mensagens/Eventos | `#f3d9fa` | `#ae3ec9` |
| Infraestrutura | `#e3fafc` | `#0c8599` |

## Modos Visuais

Escolha antecipadamente o modo visual do diagrama e aplique-o de forma consistente a todos os elementos.

### Modo Sketch (padrão — recomendado para a maioria dos diagramas)

Estética desenhada à mão, combina com o visual exclusivo do Excalidraw:

- `rugosidade: 1` em todas as formas e setas
- `fontFamily: 5` (Excalifont) para todo o texto
- `strokeWidth: 2` para formas, `strokeWidth: 2` para setas

Ideal para: diagramas informais, brainstorming, documentos de processos e a maioria dos casos de uso.

### Modo Limpo (para diagramas formais/técnicos)

Preciso, polido, pronto para apresentação:

- `rugosidade: 0` em todas as formas e setas
- `fontFamily: 2` (Helvetica) para corpo de texto, `fontFamily: 5` para títulos
- `strokeWidth: 1,5-2` para formas

Melhor para: apresentações executivas, documentos voltados para o cliente, especificações técnicas.

**Modo misto:** Use `rugosidade: 0` para zonas de fundo e `rugosidade: 1` para formas — as zonas parecem estrutura, as formas parecem conteúdo.

## Receitas do tipo diagrama

### Fluxograma```
[Start ellipse] → [Step rect] → [Decision diamond] → Yes → [Step rect] → [End ellipse]
                                                     ↓ No
                                                [Step rect]
````

- Início/Fim: `elipse` com verde claro/vermelho (`#b2f2bb`/`#ffc9c9`), `redondeza: null`
- Passos: `retângulo` com azul claro (`#a5d8ff`)
- Decisões: `diamante` com âmbar (`#ffec99`)
- Fluxo: setas sólidas, rotuladas nos ramos de decisão ("Sim"/"Não")

### Diagrama de Arquitetura

Use **zonas de fundo** para mostrar camadas (consulte a seção Zonas de fundo):```
[zone: Infrastructure]
[zone: Backend Services]
[API Gateway rect] → [Order Service rect] → [Orders DB ellipse]
↓
[Event Bus rect] → [Worker rect]
[zone: Data/Consumers]

```
- Componentes: `retângulo` com cores variadas por camada
- Conexões: setas sólidas com rótulos de protocolo ("REST", "gRPC", "SQL")
- Limites de zona: retângulos tracejados semitransparentes com `opacidade: 35`

### Diagrama ER

- Entidades: `retângulo` com nome da entidade (negrito, fonte maior)
- Atributos: listados em texto multilinha dentro da caixa da entidade
- Relacionamentos: `diamante` com nome de relacionamento
- Cardinalidade: rótulos de texto independentes próximos às setas ("1", "N", "0..1")

### Diagrama de Sequência

- Atores: `retângulo` no topo com o nome do ator
- Linhas de vida: `line` (vertical, tracejada, `strokeStyle: "tracejada"`)
- Mensagens: `seta` (horizontal, sólido = sincronizado, tracejado = assíncrono)
- Retorno: `seta` (tracejado, direção reversa)
- Ativação: `retângulo` fino na linha de vida, sem preenchimento

### Mapa Mental

- Centro: grande `elipse` com tema principal (cor brilhante, `rugosidade: 1`)
- Ramos: `retângulo` conectados através de setas diagonais do centro
- Subtópicos: `retângulo` menor conectado a partir de galhos
- Use cores diferentes por ramo para agrupamento visual (uma família de cores por ramo)

### Diagrama de Classes

- Classes: `retângulo` com texto multilinha:

```

Nome da Classe
─────────
-campo: Tipo
+campo: Tipo
─────────
+método(): Retorno
-método (arg): Retorno

```

- Herança: seta sólida com rótulo "estende"
- Implementação: seta tracejada com rótulo "implementos"
- Associação: linha sólida (sem ponta de seta)

### Raia

- Pistas: `retângulo` alto com `fillStyle: "hachure"`, `opacidade: 40`, `rugosidade: 0`
- Cabeçalhos de pista: `texto` independente no topo de cada pista
- Atividades: `retângulo` dentro das pistas
- Handoffs: setas cruzando os limites da pista

### Diagrama de Fluxo de Dados (DFD)

- Entidades externas: `retângulo` (traço em negrito `strokeWidth: 3`)
- Processos: `elipse` com número e nome do processo
- Armazenamento de dados: `retângulo` com lado aberto (use duas linhas horizontais através de elementos `line`)
- Fluxos de dados: setas rotuladas (sempre mostram o nome dos dados na seta)
- Direção: da esquerda para a direita ou do canto superior esquerdo para o canto inferior direito

## Princípios de design para diagramas elegantes

1. **Hierarquia visual** — Use tamanho e intensidade de cor para sinalizar importância. Os elementos primários obtêm preenchimentos saturados; os elementos secundários usam preenchimentos neutros ou hachurados.

2. **Espessura do traço consistente** — Use `strokeWidth: 2` para todas as formas e setas. Aumente para 3-4 apenas para enfatizar os caminhos críticos.

3. **Harmonia de cores** — Use no máximo 3-4 cores de preenchimento por diagrama. Escolha na mesma linha da paleta (consulte excalidraw-schema.md Design Tokens). Evite misturar quente e frio ao acaso.

4. **Espaço em branco é estrutura** — Mais espaçamento entre grupos não relacionados, menos entre elementos relacionados. Isso cria agrupamento visual sem bordas.

5. **Alinhado, não disperso** — Alinhe elementos em uma grade. Os centros devem ser alinhados verticalmente ou horizontalmente sempre que possível.

6. **Rotule tudo o que não é óbvio** — Cada seta deve ter um rótulo ou seu significado deve ficar claro no contexto. Cada forma precisa de texto.

7. **Convenção de direção de fluxo** — Da esquerda para a direita para fluxos de processo. De cima para baixo para hierarquias e sequências. Escolha um e seja consistente.

8. **Correspondência do traço ao preenchimento** — Use o tom mais profundo da paleta como cor do traço para o preenchimento correspondente. Isso cria profundidade e definição.

9. **Zonas de fundo sobre bordas** — Para agrupar elementos relacionados, prefira zonas de fundo semitransparentes em vez de retângulos de borda explícitos. As zonas parecem espaciais; as fronteiras parecem contêineres.

10. **Escolha o modo visual antecipadamente** — Decida o modo Esboço ou Limpeza antes de gerar os elementos. Nunca misture `rugosidade: 0` e `rugosidade: 1` em formas do mesmo nível (zonas e formas podem diferir intencionalmente).

## Resumo

| Quando você precisar... | Use este elemento |
| ------------------------------ | ----------------------------------------------------------------------------- |
| Caixa de processo, entidade, componente | `retângulo` com `boundElements` + elemento de texto separado |
| Ponto de decisão | `diamond` com `boundElements` + elemento de texto separado

|
| Terminal inicial/final | `ellipse` com `boundElements` + elemento de texto separado (`redondeza: null`) |
| Direção do fluxo | `arrow` com `startBinding`/`endBinding`, rótulo via `boundElements` se necessário |
| Título/cabeçalho | `text` (fonte grande, `containerId: null`) |
| Anotação | `text` (fonte pequena, `containerId: null`, posicionado próximo ao tar

obter) |
| Conexão não direcional | `linha` |
| Divisor de seção | `linha` (horizontal, tracejada) |
| Região de agrupamento visual | `retângulo` (grande, `opacidade: 35`, `strokeStyle: "tracejado"`, `rugosidade: 0`) |
```
