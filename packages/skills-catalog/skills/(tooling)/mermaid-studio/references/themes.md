# Temas e Estilo – Referência Completa

Carregue este arquivo quando o usuário solicitar temas personalizados, cores específicas ou diagramas estilizados.

## Fontes temáticas

Dois mecanismos de renderização fornecem conjuntos de temas diferentes:

### Mecanismo 1: @mermaid-js/mermaid-cli (mmdc)

5 temas integrados controlados pelo sinalizador `--theme` ou frontmatter:

| Tema       | Melhor para                                          |
| ---------- | ---------------------------------------------------- |
| `padrão`   | Uso geral, fundos claros                             |
| `floresta` | Tons verdes inspirados na natureza, apresentações    |
| `escuro`   | Fundos escuros, documentos em modo escuro            |
| `neutro`   | Documentos profissionais mínimos, em escala de cinza |
| `base`     | Ponto de partida para temas personalizados           |

### Motor 2: linda sereia

15 temas selecionados com design consistente:

**Temas leves:**
| Tema | Estilo | Melhor para |
|-------|-------|----------|
| `zinco-light` | Tons de cinza limpos | Documentos profissionais |
| `tóquio-luz noturna` | Luz quente | Uso geral |
| `catppuccin-latte` | Pastéis suaves | Documentos amigáveis ​​|
| `nord-light` | Tons frios do Ártico | Documentos técnicos |
| `github-light` | Estilo GitHub | READMEs, páginas do GitHub |
| `luz solarizada` | Amarelos quentes | Leitura longa |

**Temas escuros:**
| Tema | Estilo | Melhor para |
|-------|-------|----------|
| `zinco-escuro` | Cinza escuro | Documentos do modo escuro |
| `tóquio-noite` | Escuro vibrante | Ferramentas para desenvolvedores |
| `tóquio-noite-tempestade` | Profundo azul-escuro | Apresentações |
| `catppuccin-mocha` | Escuro rico | Modo escuro, sensação aconchegante |
| `norte` | Ártico escuro | Técnico, mínimo |
| `drácula` | Escuro roxo | Favorito do desenvolvedor |
| `github-escuro` | Modo escuro do GitHub | READMEs escuros |
| `solariz

ed-escuro`| Escuro quente | Leitura estendida |
|`one-escuro` | Inspirado no átomo | Documentos adjacentes ao código |

### Guia de seleção de tema

| Contexto                       | Recomendado                              |
| ------------------------------ | ---------------------------------------- |
| LEIA-ME do GitHub/GitLab       | `github-light` ou `github-dark`          |
| Documentação técnica           | `nord-light` ou `neutro`                 |
| Apresentações (sala iluminada) | `zinc-light` ou `default`                |
| Apresentações (sala escura)    | `tóquio-tempestade noturna` ou `drácula` |

|
| Ferramentas / terminal de desenvolvedor | `tóquio-noite` ou `one-dark` |
| Voltado ao cliente / profissional | `zinco-light` ou `neutro` |
| Blog pessoal/casual | `catppuccin-latte` ou `catppuccin-mocha` |

## Tema personalizado (sereia-cli)

Ao usar o tema `base`, você pode substituir qualquer variável:

### Via FrontMatter```mermaid

---

config:
theme: base
themeVariables:
primaryColor: "#4f46e5"
primaryTextColor: "#ffffff"
primaryBorderColor: "#3730a3"
lineColor: "#6b7280"
secondaryColor: "#10b981"
tertiaryColor: "#f59e0b"
background: "#ffffff"
mainBkg: "#f8fafc"
nodeBorder: "#e2e8f0"
clusterBkg: "#f1f5f9"
clusterBorder: "#cbd5e1"
titleColor: "#1e293b"
edgeLabelBackground: "#ffffff"

---

flowchart LR
A --> B

````
### Via Diretiva Init```
%%{init: {'theme': 'base', 'themeVariables': {
  'primaryColor': '#4f46e5',
  'primaryTextColor': '#fff',
  'primaryBorderColor': '#3730a3',
  'lineColor': '#6b7280',
  'secondaryColor': '#10b981',
  'tertiaryColor': '#f59e0b'
}}}%%
````

### Através da configuração do script de renderização```bash

node $SKILL_DIR/scripts/render.mjs \
 --input diagram.mmd \
 --output diagram.svg \
 --format svg \
 --theme base \
 --config '{"theme":"base","themeVariables":{"primaryColor":"#4f46e5"}}'

````
## Variáveis de tema disponíveis

### Cores principais

| Variável | Controles |
| -------------------- | -------------------------------- |
| `primaryColor` | Cor de preenchimento do nó principal |
| `primaryTextColor` | Texto em elementos de cores primárias |
| `primaryBorderColor` | Fronteira dos elementos primários |
| `secondaryColor` | Elementos secundários, suplentes |
| `tertiaryColor` | Elementos terciários, destaques |
| `linhaCor` | Borda/

linhas de ligação |
| `fundo` | Fundo do diagrama |
| `mainBkg` | Plano de fundo do nó padrão |
| `nodeBorder` | Borda do nó padrão |

### Texto

| Variável | Controles |
| --------------------- | ----------------------------- |
| `titleColor` | Texto do título do diagrama |
| `textColor` | Texto geral |
| `edgeLabelBackground` | Fundo por trás dos rótulos de borda |

### Clusters/Subgrafos

| Variável | Controles |
| --------------- | ------------------------- |
| `clusterBkg` | Fundo do subgrafo/grupo |
| `clusterBorder` | Fronteira de subgrafo/grupo |

### Específico do diagrama de sequência

| Variável | Controles |
| ----------------------- | ----------------------------- |
| `atorBkg` | Preenchimento da caixa do participante |
| `atorBorder` | Borda da caixa do participante |
| `actorTextColor` | Texto do participante |
| `ativaçãoBkgColor` | Preenchimento da caixa de ativação |
| `ativaçãoBorderColor` | Borda da caixa de ativação |
| `signalColor` | Meu

cor da seta ssage |
| `signalTextColor` | Cor do texto da mensagem |
| `noteBkgColor` | Nota de fundo |
| `noteBorderColor` | Borda de nota |
| `noteTextColor` | Texto da nota |
| `labelBoxBkgColor` | Fundo do rótulo Alt/loop/opt |
| `labelBoxBorderColor` | Borda do rótulo Alt/loop/opt |
| `loopTextColor` | Texto do rótulo de loop |

### Específico do fluxograma

| Variável | Controles |
| --------------- | --------- |
| `nodeTextColor` | Texto do nó |

## Estilo em nível de elemento

### Classes CSS (Fluxograma)```mermaid
flowchart LR
    A[Success]:::success
    B[Warning]:::warning
    C[Error]:::error
    D[Info]:::info

    A --> B --> C --> D

    classDef success fill:#10b981,stroke:#059669,color:#fff
    classDef warning fill:#f59e0b,stroke:#d97706,color:#000
    classDef error fill:#ef4444,stroke:#dc2626,color:#fff
    classDef info fill:#3b82f6,stroke:#2563eb,color:#fff
    classDef default fill:#f8fafc,stroke:#e2e8f0,color:#1e293b
````

### Estilos embutidos (fluxograma)```mermaid

flowchart LR
A --> B --> C
style A fill:#f97316,stroke:#ea580c,color:#fff
style B fill:#8b5cf6,stroke:#7c3aed,color:#fff
style C fill:#06b6d4,stroke:#0891b2,color:#fff

````
### Estilos de link (fluxograma)```mermaid
flowchart LR
    A --> B --> C

    linkStyle 0 stroke:#ef4444,stroke-width:3px
    linkStyle 1 stroke:#10b981,stroke-width:2px,stroke-dasharray:5
````

## Predefinições de cores da marca

### Paleta inspirada no Tailwind```

%%{init: {'theme': 'base', 'themeVariables': {
'primaryColor': '#3b82f6',
'primaryTextColor': '#ffffff',
'primaryBorderColor': '#2563eb',
'secondaryColor': '#10b981',
'tertiaryColor': '#f59e0b',
'lineColor': '#6b7280',
'background': '#ffffff',
'mainBkg': '#f8fafc',
'nodeBorder': '#e2e8f0',
'clusterBkg': '#f1f5f9',
'clusterBorder': '#cbd5e1'
}}}%%

````
### Tema AWS (elegante)

Usa laranja AWS para primário com **linhas suaves** em vez do preto padrão severo:```
%%{init: {'theme': 'base', 'themeVariables': {
  'primaryColor': '#FF9900',
  'primaryTextColor': '#232F3E',
  'primaryBorderColor': '#c47600',
  'secondaryColor': '#527FFF',
  'tertiaryColor': '#DD344C',
  'lineColor': '#94a3b8',
  'background': '#ffffff',
  'mainBkg': '#FFF8F0',
  'nodeBorder': '#c47600',
  'clusterBkg': '#FFF8F0',
  'clusterBorder': '#d4a574',
  'edgeLabelBackground': '#ffffff'
}}}%%
````

### Profissional Monocromático```

%%{init: {'theme': 'base', 'themeVariables': {
'primaryColor': '#374151',
'primaryTextColor': '#ffffff',
'primaryBorderColor': '#1f2937',
'secondaryColor': '#6b7280',
'tertiaryColor': '#9ca3af',
'lineColor': '#94a3b8',
'background': '#ffffff',
'mainBkg': '#f9fafb',
'nodeBorder': '#d1d5db',
'clusterBkg': '#f3f4f6',
'clusterBorder': '#9ca3af',
'edgeLabelBackground': '#ffffff'
}}}%%

````
### Índigo-Esmeralda (SaaS moderno)

Uma paleta nova e moderna para diagramas de arquitetura SaaS:```
%%{init: {'theme': 'base', 'themeVariables': {
  'primaryColor': '#4f46e5',
  'primaryTextColor': '#ffffff',
  'primaryBorderColor': '#3730a3',
  'secondaryColor': '#10b981',
  'tertiaryColor': '#f59e0b',
  'lineColor': '#94a3b8',
  'background': '#ffffff',
  'mainBkg': '#f8fafc',
  'nodeBorder': '#cbd5e1',
  'clusterBkg': '#f1f5f9',
  'clusterBorder': '#e2e8f0',
  'titleColor': '#1e293b',
  'edgeLabelBackground': '#ffffff',
  'textColor': '#334155'
}}}%%
````

## Estilo do Diagrama C4

Os diagramas C4 têm cores de elementos fixas (azul para sistemas, cinza para pessoas, etc.), mas as **linhas de relacionamento são pretas por padrão**. Sempre os substitua.

**CRÍTICO - Prevenção de espaguete com flechas:**

A causa número 1 de diagramas C4 confusos são muitos relacionamentos `Rel()`. O mecanismo de layout Dagre da Mermaid roteia TODAS as setas e, com mais de aproximadamente 6 relacionamentos, elas inevitavelmente se cruzam e se sobrepõem. Siga estas regras:

- **Máximo de 6 Rel() por diagrama** — se precisar de mais, divida em vários diagramas
- **Topologia em forma de árvore** — idealmente, cada nó deve ter 1 borda de entrada e 1-2 bordas de saída
- **Evite conexões mesh** — não conecte tudo a tudo
- **Declarar elementos em ordem de fluxo** — de cima para baixo ou da esquerda para a direita; a ordem da declaração afeta o layout

### Linhas suaves (obrigatórias para todos os C4)```

    %% Apply to EVERY Rel() in the diagram
    UpdateRelStyle(from, to, $textColor="#475569", $lineColor="#94a3b8")
    UpdateLayoutConfig($c4ShapeInRow="3", $c4BoundaryInRow="1")

````
### Caminhos destacados em C4

Use cores de destaque para fluxos primários, mantendo as linhas secundárias suaves:```
    %% Primary/user-facing relationship
    UpdateRelStyle(user, api, $textColor="#1e40af", $lineColor="#3b82f6")

    %% Internal relationship
    UpdateRelStyle(api, db, $textColor="#475569", $lineColor="#94a3b8")

    %% External/risky connection
    UpdateRelStyle(api, external, $textColor="#92400e", $lineColor="#f59e0b")
````

### Cores de elementos personalizados em C4```

    UpdateElementStyle(elementAlias, $bgColor="#4f46e5", $fontColor="#ffffff", $borderColor="#3730a3")

````
| Finalidade | bgCor | fonteCor | bordaCor |
| -------------------- | --------- | --------- | ----------- |
| Ênfase primária | `#4f46e5` | `#ffffff` | `#3730a3` |
| Sucesso / Armazenamento de dados | `#059669` | `#ffffff` | `#047857` |
| Aviso / Externo | `#d97706` | `#ffffff` | `#b45309` |
| Neutro / Apoio | `#64748b` | `#ffffff` | `#475569` |

## Opções de aparência```mermaid
---
config:
  look: handDrawn
---
flowchart LR
    A[Sketch Style] --> B[Looks Hand-drawn]
````

| Veja        | Efeito                             |
| ----------- | ---------------------------------- |
| `clássico`  | Renderização limpa padrão (padrão) |
| `handDrawn` | Aparência informal e tipo esboço   |

## Configuração via Frontmatter

## Exemplo completo combinando tema, aparência e layout:```mermaid

config:
theme: base
look: classic
layout: dagre
themeVariables:
primaryColor: "#4f46e5"
lineColor: "#94a3b8"

---

flowchart TD
A --> B --> C

```

**Mecanismos de layout:**
| Motor | Quando usar |
|--------|------------|
| `dagre` | Padrão — bom para a maioria dos diagramas |
| `alce` | Diagramas complexos com muitos cruzamentos (requer plugin) |

## Princípios de Design Moderno

### A regra de ouro: linhas suaves

A maior melhoria em qualquer diagrama Mermaid é substituir as linhas pretas padrão por uma cor mais suave. **Sempre use `lineColor: '#94a3b8'`** (Slate-400) para fundos claros ou `lineColor: '#64748b'` (Slate-500) para temas escuros.

### Harmonia de cores

Use no máximo 3-4 cores por diagrama e mapeie-as de acordo com o significado:

- **Tons azuis** → sistemas internos, serviços primários
- **Tons verdes** → armazenamentos de dados, estados de sucesso
- **Tons âmbar** → sistemas externos, avisos
- **Tons de ardósia** → linhas, bordas, elementos secundários
- **Tons vermelhos** → SOMENTE estados de erro (nunca decoração)

### Tipografia e rótulos

- Mantenha os rótulos curtos (máximo de 3-4 palavras)
- Use `<br/>` para rótulos multilinhas quando necessário
- Use linguagem natural, não abreviações
- Incluir protocolo/tecnologia nos rótulos de relacionamento

**CRÍTICO — Compatibilidade de fontes:**

NÃO use `system-ui`, `-apple-system` ou `Segoe UI` nas variáveis ​​do tema `fontFamily`. Essas fontes não estão disponíveis no Chromium headless (usado por `mmdc` para renderização) e retornarão silenciosamente para uma fonte serifada como Times New Roman, fazendo com que o diagrama pareça pouco profissional.

** Pilhas de fontes seguras para `fontFamily`:**
- Padrão (melhor): `'trebuchet ms', 'verdana', 'arial', sans-serif` — este é o padrão integrado do Mermaid e funciona em qualquer lugar
- Se você precisar personalizar: `'verdana', 'arial', 'helvetica', sans-serif`

Na prática, NÃO defina `fontFamily` a menos que você tenha um motivo específico. A fonte padrão Mermaid já é profissional e universalmente compatível.

### Densidade e espaço em branco

- Máximo de 15 nós por diagrama
- Use subgráficos para criar agrupamento visual e espaços em branco
- Use links invisíveis (`A ~~~ B`) para adicionar espaçamento quando necessário
- Prefira LR a TD para a maioria dos diagramas (lê mais naturalmente)

### Comportamento de substituição da diretiva de inicialização

Ao usar o script de renderização, o sinalizador `--theme` grava um arquivo de configuração passado para `mmdc -c`. Se o seu arquivo `.mmd` contém uma diretiva `%%{init}%%`, o script de renderização o detecta automaticamente e NÃO passa um tema na configuração, então sua diretiva init tem precedência total. Isso significa:

- Se o seu `.mmd` tiver `%%{init: {'theme': 'dark', ...}}%%`, ele será renderizado com o tema escuro corretamente
- Se o seu `.mmd` NÃO tiver diretiva init, o sinalizador `--theme` do script de renderização (padrão: `default`) será aplicado
- Você NÃO precisa passar `--theme` ao usar diretivas init
```
