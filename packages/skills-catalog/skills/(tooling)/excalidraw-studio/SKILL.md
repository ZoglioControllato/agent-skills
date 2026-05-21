---
name: excalidraw-studio
description: Gera diagramas no formato Excalidraw a partir de descrições em linguagem natural. Saída em arquivos JSON .excalidraw abertos no Excalidraw. Use quando pedirem criar diagrama, fluxograma, mapa mental, arquitetura de sistema, diagrama ER, sequência ou classe, ou gerar um .excalidraw. Também use quando mencionarem visualizar processo, desenhar arquitetura ou usar bibliotecas de ícones (AWS, GCP etc.) já configuradas. NÃO use para análise de arquitetura de código (use skills de arquitetura), renderização Mermaid (use mermaid-studio) ou documentação só em texto (use docs-writer).
license: CC-BY-4.0
metadata:
  author: Felipe Rodrigues - github.com/felipfr
  version: 1.0.1
---

# Excalidraw Estúdio

Gere diagramas no formato Excalidraw a partir de descrições em linguagem natural. Produz arquivos JSON `.excalidraw` que podem ser abertos diretamente no Excalidraw (web, extensão VS Code ou plugin Obsidian).

## Fluxo de trabalho

```

ENTENDER → ESCOLHER TIPO → EXTRAIR → GERAR → SALVAR
```

### Etapa 1: Entenda a solicitação

Analise a descrição do usuário para determinar:

1. **Tipo de diagrama** — Use a matriz de decisão abaixo
2. **Elementos-chave** — Entidades, etapas, conceitos, atores
3. **Relacionamentos** — Direção do fluxo, conexões, hierarquia
4. **Complexidade** — Número de elementos (meta: menos de 20 para maior clareza)

### Etapa 2: Escolha o tipo de diagrama e o modo visual

**Tipo de diagrama:**

| Intenção do usuário       | Tipo de diagrama   | Palavras-chave                               |
| ------------------------- | ------------------ | -------------------------------------------- |
| Fluxo do processo, etapas | **Fluxograma**     | “fluxo de trabalho”, “processo”, “etapas”    |
| Conexões, dependências    | **Relacionamento** | “relacionamento”, “conexões”, “dependências” |
| Hierarquia conceitual     | \*\*Mapa Mental    |

** | "mapa mental", "conceitos", "detalhamento" |
| Projeto de sistema | **Arquitetura** | “arquitetura”, “sistema”, “componentes” |
| Movimentação de dados | **Fluxo de dados (DFD)** | "fluxo de dados", "processamento de dados" |
| Processos multifuncionais | **Rana** | "processo de negócios", "raia", "atores" |
| Design orientado a objetos | **Diagrama de Classes\*\* | "classe", "herança", "OOP"

|
| Sequências de interação | **Diagrama de sequência** | “sequência”, “interação”, “mensagens” |
| Projeto de banco de dados | **Diagrama ER** | “banco de dados”, “entidade”, “modelo de dados” |

**Modo visual** — decida antecipadamente e aplique de forma consistente a todos os elementos:

| Modo       | `rugosidade`            | `fonteFamília` | Quando usar                                        |
| ---------- | ----------------------- | -------------- | -------------------------------------------------- |
| **Esboço** | `1`                     | `5`            | Padrão - informal, acessível, nativo do Excalidraw |
| **Limpo**  | `0`                     | `2`            | Apresentações executivas, especificações formais   |
| **Misto**  | zonas: `0`, formas: `1` | `5`            | Arquiteto                                          |

diagramas de estruturas (zonas estruturais + formas esboçadas) |

### Etapa 3: Extrair informações estruturadas

Extraia os principais componentes com base no tipo de diagrama. Para cada tipo, identifique:

- **Nós/entidades** — Quais são as caixas/formas?
- **Conexões** — O que conecta a quê e com qual rótulo?
- **Hierarquia** — O que contém o quê, o que vem antes do quê?
- **Pontos de decisão** — Onde o fluxo se ramifica?

Para diretrizes detalhadas de extração por tipo de diagrama, leia `references/element-types.md`.

### Etapa 4: gerar o JSON do Excalidraw

**CRÍTICO: Leia `references/excalidraw-schema.md` antes de gerar seu primeiro diagrama.** Ele contém o formato de elemento correto, modelo de contêiner de texto e sistema de ligação.

Regras principais para geração:

1. **Texto dentro de formas** — Use `boundElements` na forma e um elemento de texto separado com `containerId`. Nunca use uma abreviação `label`:

```json
   [
     {
       "id": "etapa-1",
       "tipo": "retângulo",
       "x": 100, "y": 100, "largura": 200, "altura": 80,
       "boundElements": [{ "type": "texto", "id": "text-step-1" }]
     },
     {
       "id": "texto-etapa-1",
       "tipo": "texto",
       "x": 130, "y": 128, "largura": 140, "altura": 24,
       "text": "Meu Passo", "originalText": "Meu Passo",
       "fontSize": 20, "fontFamily": 5,
       "textAlign": "centro", "verticalAl

ign": "meio",
       "containerId": "step-1", "lineHeight": 1,25, "redondeza": null
     }
   ]
```

2. **Rótulos de seta** — Use também `boundElements` + elemento de texto separado com `containerId`. Nunca use uma abreviação `label` nas setas:

```json
   [
     {
       "id": "seta-1",
       "tipo": "seta",
       "x": 100, "y": 150,
       "pontos": [[0, 0], [200, 0]],
       "boundElements": [{ "type": "texto", "id": "text-arrow-1" }]
     },
     {
       "id": "texto-seta-1",
       "tipo": "texto",
       "x": 160, "y": 132, "largura": 80, "altura": 18,
       "text": "envia dados", "originalText": "envia dados",
       "fontSize": 14, "fontFamily": 5,
       "textAlign": "centro"

, "verticalAlign": "meio",
       "containerId": "arrow-1", "lineHeight": 1,25, "redondeza": null
     }
   ]
```

3. **Ligações de seta** — Use `startBinding`/`endBinding` (não `start`/`end`). As formas conectadas devem listar a seta em seus `boundElements`:

```json
{
  "id": "forma-1",
  "boundElements": [
    { "tipo": "texto", "id": "formato de texto-1" },
    { "tipo": "seta", "id": "seta-1" }
  ]
}
```

```json
{
  "id": "seta-1",
  "tipo": "seta",
  "startBinding": { "elementId": "shape-1", "foco": 0, "gap": 1 },
  "endBinding": { "elementId": "shape-2", "foco": 0, "gap": 1 }
}
```

4. **Ordem dos elementos para índice z** — Sempre declare as formas primeiro, as setas depois e os elementos de texto por último. Isso garante que o texto seja renderizado na parte superior e nunca seja obscurecido por setas ou outras formas.

5. **Posicionamento** — Use coordenadas alinhadas à grade (múltiplos de 20px quando `gridSize: 20`). Deixe um espaço horizontal de 200-300px e um espaço vertical de 100-150px entre os elementos.

6. **IDs exclusivos** — Cada elemento deve ter um `id` exclusivo. Use IDs descritivos como `"step-1"`, `"decision-valid"`, `"arrow-1-to-2"`, `"text-step-1"`.

7. **Cores** — Use uma paleta consistente:

| Função              | Cor            | Hexágono  |
| ------------------- | -------------- | --------- |
| Entidades primárias | Azul claro     | `#a5d8ff` |
| Etapas do processo  | Verde claro    | `#b2f2bb` |
| Importante/Central  | Amarelo        | `#ffd43b` |
| Avisos/Erros        | Vermelho claro | `#ffc9c9` |
| Secundário          | Ciano          | `#96f2d7` |
| Curso padrão        | Escuro         | `#1e1e1e` |

### Etapa 5: Salvar e apresentar

1. Salve como `<nome descritivo>.excalidraw`
2. Forneça um resumo:

```
   Criado: user-workflow.excalidraw
   Tipo: Fluxograma
   Elementos: 7 formas, 6 setas, 1 título
   Total: 14 elementos

   Para visualizar:
   1. Visite https://excalidraw.com → Abrir → arraste e solte o arquivo
   2. Ou use a extensão Excalidraw VS Code
   3. Ou abra em Obsidian com o plugin Excalidraw
```

## Modelos

Modelos pré-construídos estão disponíveis em `assets/` para pontos de partida rápidos. Use-os quando o tipo de diagrama corresponder — eles fornecem estrutura e estilo corretos:

| Modelo               | Arquivo                                  |
| -------------------- | ---------------------------------------- |
| Fluxograma           | `assets/flowchart-template.json`         |
| Relacionamento       | `assets/relationship-template.json`      |
| Mapa Mental          | `assets/mindmap-template.json`           |
| Fluxo de dados (DFD) | `assets/data-flow-diagram-template.json` |

|
| Raia | `assets/business-flow-swimlane-template.json` |
| Diagrama de classes | `assets/class-diagram-template.json` |
| Diagrama de sequência | `assets/sequence-diagram-template.json` |
| Diagrama ER | `assets/er-diagram-template.json` |

Leia um modelo ao criar esse tipo de diagrama pela primeira vez. Use sua estrutura como base e modifique os elementos para corresponder à solicitação do usuário.

## Bibliotecas de ícones

Para diagramas de arquitetura profissional com ícones de serviço (AWS, GCP, Azure, etc.), bibliotecas de ícones podem ser configuradas. Leia `references/icon-libraries.md` quando:

- O usuário solicita um diagrama de arquitetura AWS/nuvem
- O usuário menciona querer ícones de serviços específicos
- Você precisa verificar se as bibliotecas de ícones estão disponíveis

##Boas práticas

### Contagem de Elementos

| Tipo de diagrama            | Recomendado | Máximo |
| --------------------------- | ----------- | ------ |
| Etapas do fluxograma        | 3-10        | 15     |
| Entidades de relacionamento | 3-8         | 12     |
| Ramos do mapa mental        | 4-6         | 8      |
| Subtópicos por ramo         | 2-4         | 6      |

Se a solicitação do usuário exceder o máximo, sugira dividir em vários diagramas:

> "Sua solicitação inclui 15 componentes. Para maior clareza, recomendo: (1) Diagrama de arquitetura de alto nível com 6 componentes principais, (2) Subdiagramas detalhados para cada subsistema. Quer que eu comece com a visão de alto nível?"

###Layout

- **Direção do fluxo**: da esquerda para a direita para processos, de cima para baixo para hierarquias
- **Espaçamento**: 200-300px horizontal, 100-150px vertical entre elementos
- **Alinhamento da grade**: posicione em múltiplos de 20px para um alinhamento limpo
- **Margens**: mínimo de 50px da borda da tela
- **Dimensionamento do texto**: títulos de 28 a 36 px, rótulos de 18 a 22 px, anotações de 14 a 16 px
- **Font**: Use `fontFamily: 5` (Excalifont) para consistência do desenho à mão. Fallback para `1` (Virgílio) se 5 for não

não suportado.

- **Zonas de fundo**: para diagramas de arquitetura, adicione retângulos de zona tracejada semitransparentes (`opacity: 35`, `strokeStyle: "dashed"`, `rugosidade: 0`) como os primeiros elementos na matriz para criar regiões de agrupamento visual. Consulte `references/excalidraw-schema.md` → Zonas de fundo.
- **Ordem dos elementos**: zonas primeiro → formas → setas → elementos de texto (garante o índice z correto e o texto sempre renderizado na parte superior)

### Erros comuns a evitar

- ❌ Usando `label: { text: "..." }` abreviação de formas ou setas — não suportado pelo analisador Excalidraw
- ❌ Colocar `text` diretamente em elementos de forma sem `containerId`
- ❌ Usando `start`/`end` para vinculações de seta — use `startBinding`/`endBinding` com `elementId`/`focus`/`gap`
- ❌ Esquecer de adicionar setas aos arrays `boundElements` de suas formas conectadas
- ❌ Omitindo `originalText`, `lineHeight`, `autoResize` ou `backgroundColor: "transparen

t"` de elementos de texto dentro de contêineres

- ❌ Omitindo propriedades base obrigatórias (`angle`, `strokeStyle`, `opacity`, `groupIds`, `frameId`, `index`, `isDeleted`, `seed`, `version`, `versionNonce`, `updated`, `link`, `locked`) — os elementos não serão renderizados
- ❌ Faltando `"files": {}` no nível superior do JSON
- ❌ Usando `roundness: { "type": 3 }` em elipses — as elipses devem usar `roundness: null`
- ❌ Faltando `lastCommittedPoint`, `startArrowhead`, `endA

rrowhead` nas setas

- ❌ Declarar elementos de texto antes das setas — o texto é renderizado abaixo e fica obscurecido
- ❌ Setas flutuantes sem amarras (não se movem com formas)
- ❌ Elementos sobrepostos (aumentar espaçamento)
- ❌ Uso inconsistente de cores (defina a paleta antecipadamente)
- ❌ Muitos elementos em um diagrama (dividir em subdiagramas)

## Lista de verificação de validação

Antes de entregar o diagrama, verifique:

- [] Todos os elementos possuem IDs exclusivos
- [] Cada elemento tem TODAS as propriedades básicas necessárias: `angle`, `strokeStyle`, `opacity`, `groupIds`, `frameId`, `index`, `isDeleted`, `link`, `locked`, `seed`, `version`, `versionNonce`, `updated`
- [ ] valores `index` são atribuídos em ordem (`"a0"`, `"a1"`, …) com elementos de texto obtendo valores mais altos do que formas/setas
- [] JSON de nível superior inclui `"arquivos": {}`
- [] Formas com texto usam `boundElements` + separa

o elemento de texto com `containerId`

- [] Elementos de texto dentro de contêineres têm `containerId`, `originalText`, `lineHeight: 1.25`, `autoResize: true`, `roundness: null`, `backgroundColor: "transparent"`
- [ ] As setas usam `startBinding`/`endBinding` (com `elementId`, `focus`, `gap`) ao conectar formas, mais `lastCommittedPoint: null`, `startArrowhead: null`, `endArrowhead: "arrow"`
- [] As formas conectadas listam a seta em seus `boundElements` a

raios

- [] Ordem dos elementos: formas → setas → elementos de texto (texto sempre no topo)
- [] Elipses usam `redondeza: null` (não `{ "type": 3 }`)
- [] Coordenadas evitam sobreposição (verifique o espaçamento)
- [] O texto é legível (tamanho da fonte 16+)
- [] As cores seguem um esquema consistente
- [] O arquivo é JSON válido
- [] A contagem de elementos é razoável (<20 para maior clareza)

## Solução de problemas

| Edição                         | Solução                                                                                          |
| ------------------------------ | ------------------------------------------------------------------------------------------------ |
| O texto não aparece nas formas | Use `boundElements` + elemento de texto separado com `containerId`, `originalText`, `lineHeight` |
| Texto escondido atrás de setas | Mover elementos de texto para o final                                                            |

do array `elements` (depois de todas as setas) |
| As setas não se movem com as formas | Use `startBinding`/`endBinding` com `elementId`, `focus: 0`, `gap: 1` |
| Forma não se move com setas | Adicione a seta ao array `boundElements` da forma |
| Sobreposição de elementos | Aumentar o espaçamento entre as coordenadas

|
| O texto não cabe | Aumentar a largura da forma ou reduzir o tamanho da fonte |
| Muitos elementos | Divida em vários diagramas |
| As cores parecem inconsistentes | Defina a paleta de cores antecipadamente e aplique de forma consistente |

## Limitações

- Curvas complexas são simplificadas para linhas curvas retas/básicas
- A rugosidade desenhada à mão é definida como padrão (1)
- Sem imagens incorporadas na geração automática (use bibliotecas de ícones para ícones de serviço)
- Máximo recomendado: 20 elementos por diagrama para maior clareza
- Sem detecção automática de colisão — use diretrizes de espaçamento
