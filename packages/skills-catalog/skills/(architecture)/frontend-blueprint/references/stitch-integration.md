# Guia de integração de pontos

Leia este arquivo quando o usuário não tiver maquetes existentes no Figma ou ferramentas semelhantes,
não tem certeza sobre o que deseja visualmente ou quando precisa gerar o Stitch
solicita ou interage com o Stitch MCP. Leia também quando o usuário perguntar sobre
Instalação, configuração ou solução de problemas do Stitch.

## Índice

1. O que é ponto
2. Quando sugerir ponto
3. Configuração e autenticação MCP
4. Gerando prompts de pontos eficazes
5. Modos de projeto
6. Tipos de dispositivos
7. Projetar Sistemas via MCP
8. Variantes e gama criativa
9. Referência de ferramentas MCP
10. Fluxo de trabalho de integração total

---

## 1. O que é ponto

Google Stitch (stitch.withgoogle.com) é uma ferramenta de design de IU com tecnologia de IA da
Google Labs que gera designs de interface completos a partir de prompts de texto ou
imagens carregadas. Ele roda em Gemini 3 Pro e Gemini 3 Flash.

Principais recursos para nosso fluxo de trabalho:

- Gera layouts de UI completos a partir de descrições em linguagem natural
- Suporta tipos de dispositivos móveis, desktop, tablets e agnósticos
- Gera múltiplas variantes de design para comparação
- Exporta código HTML/CSS e layouts compatíveis com Figma
- Cria protótipos interativos para testar estados e interações flutuantes
- Possui servidor MCP completo com 14 ferramentas para controle programático
- Suporta Design Systems com tokens (cores, tipografia, formas)

Stitch é GRATUITO (Google Labs) com limites de geração:

- Gemini 3 Flash: geração mais rápida, limites mensais mais elevados
- Gemini 3 Pro: maior fidelidade, raciocínio mais profundo, limites mais baixos

Stitch é uma ferramenta de IDEAÇÃO – gera pontos de partida, não finais
código de produção. Isso o torna perfeito para nosso fluxo de trabalho: visualize primeiro,
código após aprovação.

---

## 2. Quando sugerir ponto

### Sempre sugira quando TUDO isso for verdade

- O usuário NÃO mencionou mockups existentes (Figma, Sketch, Adobe XD, etc.)
- O projeto envolve UI visual (não apenas backend ou lógica)
- O projeto tem mais de uma tela OU o usuário não tem certeza sobre a direção

### Sugira fortemente quando QUALQUER uma dessas situações for verdadeira

- O usuário diz "Não sei o que quero" ou incerteza semelhante
- O usuário não pode fornecer referências visuais
- O usuário deseja comparar várias direções de design rapidamente
- O projeto está em fase inicial de ideação/MVP
- O usuário menciona “protótipo” ou “mockup” sem ferramenta específica

### NÃO sugira quando

- O usuário já possui os arquivos Figma/Sketch prontos
- O usuário diz explicitamente que não deseja usar ferramentas externas
- A tarefa é um único pequeno componente (botão, entrada, cartão)
- O usuário está refatorando apenas o código, sem alterações visuais

### Como sugerir

Enquadre isso como uma economia de tempo, não como um requisito. Exemplo:

"Antes de escrevermos qualquer código, sugiro que façamos um protótipo no Google Stitch
primeiro. Levará 2 minutos para gerar as telas, você pode ver exatamente
como ficará o resultado e evitamos qualquer retrabalho. eu posso gerar
as instruções para você - basta colá-las em stitch.withgoogle.com.

Se você tiver o Stitch MCP conectado, posso até gerar os desenhos
diretamente daqui. Quer que eu ajude você a configurar isso?"

---

## 3. Configuração e autenticação do MCP

Stitch expõe um servidor MCP remoto em um único URL. Qualquer agente de IA ou IDE
que suporta servidores MCP baseados em HTTP podem se conectar a ele.

### Fundamentos de Conexão```

MCP Server URL: https://stitch.googleapis.com/mcp
Auth method: API Key (recommended) or OAuth token

````
### Configuração da chave de API (recomendado)

1. Vá para stitch.withgoogle.com → Configurações → Chaves de API
2. Clique em "Criar chave API"
3. Copie e armazene com segurança (nunca se comprometa com repositórios públicos)

### Padrão genérico de configuração do MCP

Cada cliente MCP usa a mesma estrutura central – apenas o arquivo de configuração
o formato e os nomes dos campos são diferentes. O padrão universal é:```
Server URL:  https://stitch.googleapis.com/mcp
Header:      X-Goog-Api-Key: <YOUR-API-KEY>
````

Ao ajudar o usuário a configurar sua ferramenta específica:

1. Pergunte qual agente/IDE eles usam
2. Localize onde essa ferramenta armazena as configurações do servidor MCP (geralmente um arquivo JSON)
3. Aplique o padrão acima usando o esquema de configuração dessa ferramenta

Para referência, aqui estão exemplos de ferramentas comuns (podem mudar - sempre
consulte a documentação MCP da própria ferramenta se não funcionar):

**Configuração baseada em JSON** (Cursor, VSCode, Windsurf, Antigravity, etc.):```json
{
"url": "https://stitch.googleapis.com/mcp",
"headers": {
"X-Goog-Api-Key": "YOUR-API-KEY"
}
}

````

**Configuração baseada em CLI** (Claude Code, Gemini CLI, etc.):```
<tool> mcp add stitch --transport http https://stitch.googleapis.com/mcp --header "X-Goog-Api-Key: YOUR-API-KEY"
````

O caminho exato do arquivo e a estrutura de encapsulamento variam de acordo com a ferramenta. Se o usuário
não sabe para onde vai sua configuração, sugira verificar a documentação da ferramenta
para "configuração do servidor MCP" ou "configuração remota do MCP".

### OAuth (Avançado – apenas casos extremos)

Alguns ambientes não permitem chaves de API persistentes no disco. Naqueles
casos, Stitch oferece suporte a OAuth por meio do Google Cloud Application Default
Credenciais. Isso requer a CLI gcloud, um projeto do Google Cloud com
a API Stitch está habilitada e gera tokens de curta duração (cerca de 1 hora).

O padrão de cabeçalho de configuração do OAuth é:```
Authorization: Bearer <ACCESS_TOKEN>
X-Goog-User-Project: <PROJECT_ID>

````
Se o usuário precisar do OAuth, consulte a configuração oficial do Stitch MCP
documentação em stitch.withgoogle.com/docs/mcp/setup para obter o máximo
instruções atuais. NÃO tente criar um script para isso - o processo
envolve fluxos de login baseados em navegador que são melhor executados de forma interativa.

### Verificando a conexão

Após a configuração, pergunte ao agente: "Mostre-me meus projetos Stitch" ou
"Listar meus projetos Stitch". Se retornar resultados ou uma lista vazia
(não é um erro), a conexão está funcionando.

### Solução de problemas

| Problema | Solução |
|--------|----------|
| Erro "não autenticado" | Chave de API inválida ou token OAuth expirado — regenerar |
| "Permissão negada" | Para OAuth: certifique-se de que a função `serviceUsageConsumer` seja concedida |
| Tempo limite de conexão | Stitch MCP é remoto – verifique a Internet, tente novamente em 30 segundos |
| Ferramenta não encontrada | Certifique-se de que o URL do MCP seja exatamente `https://stitch.googleapis.com/mcp` |
| Configuração não reconhecida | Verifique os documentos MCP da sua ferramenta para obter a configuração correta para

tapete |

---

## 4. Gerando prompts de pontos eficazes

### A fórmula imediata

Cada prompt do Stitch deve seguir esta estrutura:```
Idea:    What it is (app type, purpose, name if applicable)
Theme:   The core visual direction (adjectives, style keywords, contrast)
Content: The actual content on the screen (sections, components, text)
Image:   Optional reference image for visual direction
````

O primeiro prompt NÃO precisa ser perfeito. Stitch é iterativo -
gerar, revisar, refinar uma coisa de cada vez.

### Regras de qualidade imediata

FAZER:

- Seja específico sobre quais componentes aparecem na tela
- Use palavras-chave UI/UX: "barra de navegação", "layout do cartão", "seção herói",
  "botão de call to action", "sombra projetada", "hierarquia visual"
- Defina a vibração com adjetivos: "minimalista", "vibrante", "alto contraste"
- Referência de telas específicas: "Na tela de login, altere..."
- Uma grande mudança por solicitação de refinamento

NÃO:

- Escreva prompts de mais de 5.000 caracteres (ponto elimina componentes)
- Combine várias alterações estruturais em um prompt de edição
- Diga coisas vagas como "faça com que pareça legal" - use o Style Word Bank
- Esqueci de especificar qual tela ao editar

### Traduzindo a direção do design para instruções de costura

Ao gerar prompts da Direção de Design acordada (Fase 3),
mapeie cada elemento sistematicamente:

| Elemento de direção de design | Mapeamento de prompt de ponto                                       |
| ----------------------------- | ------------------------------------------------------------------- |
| Humor/vibração                | Seção Ideia + Tema com adjetivos                                    |
| Paleta de cores               | Tema: códigos hexadecimais específicos ou descrição do humor        |
| Tipografia                    | Tema: nome da fonte se estiver nas 29 fontes do Stitch ou descrição |
| Abordagem de layout           | Conteúdo: descrever grade, espaçamento, disposição dos componentes  |
| Estilo do ícone               | Conteúdo: descrever o tratamento de ícones em componentes           |

| Referência

é aplicado | Use descritores de chave de referências, não de URLs |

### Fontes suportadas pelo Stitch (29 famílias)

Sem serifa: Inter, Roboto, DM Sans, Geist, Sora, Manrope, Lexend,
Epílogo, Seja Vietnam Pro, Plus Jakarta Sans, Public Sans, Space Grotesk,
Spline Sans, Work Sans, Montserrat, Metropolis, Source Sans Three,
Nunito Sans, Arimo, Hanken Grotesk, Rubik, IBM Plex Sans

Serif: Leitor de notícias, Noto Serif, Domine, Libre Caslon Text, EB Garamond,
Literata, Fonte Serif Quatro

Se a fonte escolhida pelo usuário não estiver nesta lista, escolha a correspondência mais próxima
da lista acima e observe a substituição. O código final usará
a fonte real desejada - Stitch é apenas para prototipagem.

### Modelos de prompt por tipo de projeto

**Página de destino:**

```
Idea: A landing page for [product/service name] — [one-line description].
Theme: [mood adjectives]. [Light/Dark] theme with [color description].
  [Style keyword if applicable: Editorial, Bento Grid, Swiss Style, etc.]
Content: Hero section with headline "[actual headline text]" and
  subheadline "[actual subheadline]". [CTA button text]. Features section
  with [N] cards showing [what each card represents]. [Additional sections:
  testimonials, pricing, FAQ, footer]. Navigation with links to [items].
```

**Painel:**

```
Idea: A [type] dashboard for [purpose/audience].
Theme: [mood]. [Light/Dark] mode with [color] accents. Dense but organized.
Content: Sidebar navigation with [items]. Main area with [widget types:
  charts, KPIs, tables, etc.]. Header with [search/notifications/profile].
  [Specific data to display in each widget].
```

**Tela do aplicativo móvel:**

```
Idea: [Screen name] screen for [app name] — [app description].
Theme: [mood]. [Color scheme]. [Style keyword].
Content: [Top navigation/header]. [Main content area with specific
  components]. [Bottom navigation with tab items]. [Specific text,
  labels, and placeholder data].
```

**Comércio eletrônico:**

```
Idea: [Page type: product listing / product detail / cart / checkout]
  for [store name] selling [product type].
Theme: [mood]. [Colors]. [Style: minimal, luxury, playful, etc.]
Content: [Specific components: product grid with N columns, filters,
  price display, add-to-cart button, image gallery, reviews section].
```

### Padrões de prompt de refinamento

Após a geração inicial, refine com prompts direcionados:

- Layout: "Altere a grade do produto de 2 colunas para uma área de trabalho de 4 colunas
  layout. Mantenha o espaçamento e o estilo dos cartões."
- Tipografia: "Altere os títulos para uma fonte serifada. Aumente o herói
  tamanho do título para criar uma hierarquia visual mais forte."
- Cor: "Atualize a cor de destaque para [hex]. Certifique-se de que todos os recursos interativos
  elementos (botões, links) usam esse novo acento."
- Componente: "Adicionar uma barra de pesquisa ao cabeçalho, posicionada à direita
  do logotipo. Estilize

com uma borda sutil e um ícone de pesquisa."

- Imagens: "Altere o fundo de todas as imagens do produto para cinza claro.
  Certifique-se de que as imagens tenham preenchimento consistente em seus cartões."

---

## 5. Modos de design

### Pensando com 3 Pro

- **Use para:** Lógica complexa, layouts de várias seções, painéis,
  projetos candidatos à produção
- **Comportamento:** Demora mais, "pensa" nas implicações - navegação
  fluxo, hierarquia, interações de cores
- **Melhor quando:** criar painéis complexos, páginas de destino diferenciadas,
  fluxos de várias etapas
- **MCP `modelId`:** `GEMINI_3_PRO` (valor atual — pode mudar como novo
  modelos são lançados)

### Gêmeos 3 Flash

- **Use para:** Ideação rápida, iteração rápida, exploração de vários conceitos
- **Comportamento:** Geração rápida, boa para passar da tela em branco
- **Melhor quando:** Exploração antecipada, gerando muitas opções rapidamente
- **MCP `modelId`:** `GEMINI_3_FLASH` (valor atual — pode mudar)

### Seleção de modelo padrão

Ao gerar via MCP, use `MODEL_ID_UNSPECIFIED` como padrão.
Isso permite que Stitch escolha automaticamente o melhor modelo disponível. Somente
especifique um modelo concreto quando o usuário tiver uma necessidade explícita:

- Prioridade de velocidade → use o modelo Flash-tier
- Prioridade de qualidade → usar o modelo Pro-tier
- Sem preferência → omita `modelId` ou use `MODEL_ID_UNSPECIFIED`

Nota: os valores de enum do modelo são definidos pela API do Stitch e podem ser atualizados
à medida que novos modelos são lançados. Se um valor enum conhecido parar de funcionar,
volte para `MODEL_ID_UNSPECIFIED` e informe o usuário.

### Redesenho (Nano Banana Pro)

- **Use para:** Modernização de UIs existentes, experimentos estilísticos, baseados em vibração
  fluxos de trabalho
- **Comportamento:** é excelente na aplicação de estética de design específica
- **Somente no Stitch UI** (não disponível via MCP)

### The Style Word Bank (para modo Redesign e enriquecimento imediato)

Use estas palavras-chave para fornecer uma direção criativa precisa:

**Layout e Estrutura:**

- Bento Grid — modular, baseado em cartão, compartimentado
- Editorial – estilo de revista, títulos com serifa grande, espaços em branco generosos
- Estilo Suíço - sistemas de grade, sem serifa, alinhado à esquerda, objetivamente claro
- Tela dividida – divisão vertical, bloco de cores emparelhado com imagens

**Textura e Profundidade:**

- Glassmorfismo - vidro fosco, translucidez, desfoque de fundo
- Claymorfismo — formas 3D suaves, sombras internas, amigáveis/táteis
- Skeuomorphic – texturas realistas (couro, papel, metal)
- Granulado/Ruído — sobreposições de grãos de filme em gradientes, calor

**Atmosfera e Era:**

- Brutalista — raw, fontes do sistema, alto contraste, bordas rígidas
- Cyberpunk — modo escuro, detalhes neon (ciano/magenta), efeitos de falha
- Y2K – texturas cromadas, letras em forma de bolha, azuis/rosa brilhantes, botões de comprimidos
- Retro-Futurismo - synthwave dos anos 80, pôr do sol, grades de wireframe, estética VHS

**Cor e contraste:**

- Duotone — UI inteira com duas cores contrastantes
- Monocromático – matiz de base única com variações de tonalidade
- Pastel Goth – pastéis suaves com tipografia totalmente preta
- Modo escuro OLED - preto verdadeiro (#000000), contraste máximo

Essas palavras-chave podem ser combinadas em prompts:
"Redesenhe este painel. Use um layout moderno do Bento Grid. Modo escuro
fundo. Use a fonte Inter para cabeçalhos."

---

## 6. Tipos de dispositivos

### Escolhendo o tipo certo

| Tipo             | Use quando                                                               | Enumeração MCP |
| ---------------- | ------------------------------------------------------------------------ | -------------- |
| Móvel            | Aplicativo móvel principal, interface de usuário voltada para o telefone | `MÓVEL`        |
| Área de Trabalho | Aplicativos Web, painéis, layouts amplos                                 | `DESKTOP`      |
| Tablet           | Aplicativos específicos para tablets, layouts de iPad                    | `TABLET`       |
| Agnóstico        | Não vinculado a um dispositivo específico                                | `AGNOSTIC`     |

### Como o tipo de dispositivo afeta a geração

- **Celular:** Otimiza para rolagem vertical, navegação inferior (polegar
  zonas), conteúdo empilhado
- **Desktop:** Otimiza para layouts horizontais, navegação superior,
  grades de múltiplas colunas
- **Tablet:** Abordagem híbrida

### Tradução entre tipos de dispositivos

Não redimensione – traduza. Ao converter aplicativo para web (ou vice-versa),
solicitar as mudanças estruturais necessárias:```
Navigation: "Consolidate the bottom tab bar into a horizontal
navigation bar at the top with links for [items]."
Hero: "Transform the stacked mobile hero into a split-layout
hero section. Text on left, image covering the right."
Grid: "Update from 2-column mobile layout to 4-column desktop grid.
Maintain the card style and spacing rhythm."

````
Dica profissional: ao mudar o tipo de dispositivo dentro de um projeto, o Stitch pode ocultar
conteúdo abaixo do limite do quadro. Aumente a altura do quadro para revelar
o layout completo gerado.

---

## 7. Sistemas de projeto via MCP

Os sistemas de design no Stitch garantem consistência visual em todas as telas
em um projeto. Eles mapeiam diretamente para nossa Direção de Design (Fase 3).

### Criando um sistema de design a partir da direção do design

Mapeie a direção de design acordada para o DesignTheme do Stitch:```
Design Direction           → DesignTheme field
─────────────────────────────────────────────
Light/dark preference      → colorMode: "LIGHT" or "DARK"
Heading font               → font: closest from 29 supported fonts
Border radius preference   → roundness: ROUND_FOUR/EIGHT/TWELVE/FULL
Primary brand color (hex)  → customColor: "#hexcode"
Color temperature          → preset: closest preset name
Light background (hex)     → backgroundLight: "#hexcode"
Dark background (hex)      → backgroundDark: "#hexcode"
Overall mood description   → description: brief theme text
Additional guidelines      → styleGuidelines: freeform text
````

### Chamada MCP: create_design_system```json

{
"projectId": "PROJECT_ID",
"designSystem": {
"displayName": "Project Brand Identity",
"theme": {
"colorMode": "DARK",
"font": "GEIST",
"roundness": "ROUND_EIGHT",
"preset": "blue",
"customColor": "#1a1a2e",
"backgroundDark": "#0a0a0f",
"description": "Clean, modern dark theme with blue accents"
},
"styleGuidelines": "Spacious layout with card-based components. Strong typographic hierarchy. Subtle hover animations."
}
}

````
### Aplicando em Telas

Após criar o design system, aplique-o a todas as telas:```json
{
  "projectId": "PROJECT_ID",
  "selectedScreenIds": ["screen1", "screen2", "screen3"],
  "assetId": "DESIGN_SYSTEM_ASSET_ID"
}
````

Isso garante que cada tela siga os mesmos tokens visuais.

---

## 8. Variantes e gama criativa

As variantes geram de 1 a 5 versões alternativas de uma tela. Crucial para
a fase de prototipagem quando o usuário precisa comparar opções.

### Quando gerar variantes

- O usuário não tem certeza entre duas direções visuais
- Quer explorar alternativas de layout
- Testando diferentes esquemas de cores
- Desvencilhar-se ("Sei que não está certo, mas não sei por quê")

### Gama Criativa

| Alcance    | Comportamento                                       | Use quando           |
| ---------- | --------------------------------------------------- | -------------------- |
| REFINAR    | Mantém a estrutura, ajusta fontes/espaçamento/cores | Polimento            |
| EXPLORAR   | Exploração equilibrada (padrão)                     | Comparando opções    |
| REIMAGINAR | Reestruturação completa permitida                   | Recomeçar ou pivotar |

### Aspectos Variantes

Geração de foco em dimensões específicas:

| Aspecto      | O que muda                                |
| ------------ | ----------------------------------------- |
| LAYOUT       | Arranjo de elementos e estrutura de grade |
| COLOR_SCHEME | Variações da paleta de cores              |
| IMAGENS      | Uso e tratamento de imagens               |
| TEXT_FONT    | Opções de tipografia                      |
| TEXT_CONTENT | Conteúdo de texto real                    |

### Chamada MCP: generate_variants```json

{
"projectId": "PROJECT_ID",
"selectedScreenIds": ["screen_to_vary"],
"prompt": "Explore different layout approaches for the hero section while maintaining the dark theme",
"variantOptions": {
"variantCount": 3,
"creativeRange": "EXPLORE",
"aspects": ["LAYOUT", "COLOR_SCHEME"]
},
"deviceType": "DESKTOP"
}

````
Omita `modelId` para permitir que Stitch escolha ou especifique um se o usuário
tem preferência por velocidade versus qualidade.

### Iterando em variantes

1. Gere de 3 a 5 variantes com a faixa EXPLORE
2. O usuário escolhe o que mais se aproxima de sua visão
3. Gere mais 2-3 com faixa REFINE no vencedor
4. O usuário aprova → prossiga para o código

---

## 9. Referência de ferramentas MCP

### Gerenciamento de Projetos

| Ferramenta | Finalidade | Parâmetros principais |
|------|---------|-----------|
| `criar_projeto` | Novo projeto de design | `título` (string) |
| `get_projeto` | Obtenha detalhes do projeto | `nome` (formato: `projetos/{id}`) |
| `delete_projeto` | Excluir projeto (irreversível!) | `nome` |
| `lista_projetos` | Listar todos os projetos | `filter`: "proprietário" ou "compartilhado" |

### Gerenciamento de tela

| Ferramenta | Finalidade | Parâmetros principais |
|------|---------|-----------|
| `lista_telas` | Todas as telas do projeto | `projectId` |
| `get_screen` | Detalhes da tela + código + URLs de imagem | `nome`, `projectId`, `screenId` |

A resposta `get_screen` inclui:

- `htmlCode` — Objeto de arquivo com `downloadUrl` para HTML/CSS
- `screenshot` — Objeto de arquivo com `downloadUrl` para a imagem PNG
- `fimaExport` — Objeto de arquivo para exportação compatível com Figma
- `theme` — DesignTheme usado para geração
- `prompt` — Prompt original usado

### Geração de IA

| Ferramenta | Finalidade | Parâmetros principais |
|------|---------|-----------|
| `generate_screen_from_text` | Gerar nova tela | `projectId`, `prompt`, `deviceType`, `modelId` (opcional) |
| `upload_screens_from_images` | Carregar imagens como telas | `projectId`, `imagens[]` (base64 + mimeType) |
| `edit_telas` | Editar telas existentes | `projectId`, `selectedScreenIds[]`, `prompt`, `deviceType`, `modelId` (opcional) |
| `generate_variants` | Gerar projeto v

arianos | `projectId`, `selectedScreenIds[]`, `prompt`, `variantOptions`, `modelId` (opcional) |

IMPORTANTE: `generate_screen_from_text` e `edit_screens` demoram alguns
minutos. Erros de conexão não significam falha — verifique com `get_screen`
depois de alguns minutos. NÃO tente novamente imediatamente ou você criará duplicatas.

Se `output_components` contém entradas de `sugestão`, apresente-as para
o usuário. Se aceito, ligue novamente com a sugestão como novo prompt.

### Sistemas de Projeto

| Ferramenta | Finalidade | Parâmetros principais |
|------|---------|-----------|
| `criar_sistema_de_design` | Criar novo sistema | `designSystem` (objeto DesignSystem), `projectId` |
| `update_design_system` | Atualizar sistema existente | `designSystem` (wrapper de ativos com `nome`) |
| `list_design_systems` | Sistemas de lista | `projectId` (opcional) |
| `apply_design_system` | Aplicar nas telas | `projectId`, `selectedScreenIds[]`, `assetId` |

### Valores de enumeração de tipo de dispositivo

`DEVICE_TYPE_UNSPECIFIED`, `MOBILE`, `DESKTOP`, `TABLET`, `AGNOSTIC`

### Valores de enum de ID do modelo

`MODEL_ID_UNSPECIFIED` (padrão - recomendado), `GEMINI_3_PRO` (maior
qualidade), `GEMINI_3_FLASH` (mais rápido). Esses valores enum podem mudar conforme
Stitch lança novos modelos - sempre prefira `MODEL_ID_UNSPECIFIED`, a menos que
o usuário tem um motivo específico para fixar um modelo.

### Valores de enumeração de arredondamento

`ROUND_FOUR` (4px), `ROUND_EIGHT` (8px), `ROUND_TWELVE` (12px), `ROUND_FULL`

### Valores de enumeração do modo de cor

`LUZ`, `ESCURO`

### Valores de enum de intervalo de criativos

`REFINE` (sutil), `EXPLORE` (equilibrado), `REIMAGINE` (radical)

### Valores de enumeração de aspecto variante

`LAYOUT`, `COLOR_SCHEME`, `IMAGES`, `TEXT_FONT`, `TEXT_CONTENT`

### Valores de enum de fonte (29 suportados)

INTER, ROBOTO, DM_SANS, GEIST, SORA, MANROPE, LEXEND, EPÍLOGO,
BE_VIETNAM_PRO, PLUS_JAKARTA_SANS, PUBLIC_SANS, SPACE_GROTESK,
SPLINE_SANS, WORK_SANS, MONTSERRAT, METRÓPOLIS, SOURCE_SANS_THREE,
NUNITO_SANS, ARIMO, HANKEN_GROTESK, RUBIK, IBM_PLEX_SANS,
LEITOR DE NOTÍCIAS, NOTO_SERIF, DOMINE, LIBRE_CASLON_TEXT, EB_GARAMOND,
LITERATA, FONTE_SERIF_FOUR

---

## 10. Fluxo de trabalho de integração total

### Cenário A: MCP disponível (integração direta)```
1. Create project:
   → create_project(title: "Project Name")
   → Save the returned project ID

2. Create design system from approved Design Direction:
   → create_design_system(projectId, designSystem with theme tokens)
   → Save the returned asset ID

3. Generate first screen:
   → generate_screen_from_text(projectId, prompt, deviceType)
   → Omit modelId to let Stitch choose the best model
   → Wait 1-2 minutes, then get_screen to retrieve result
   → Present screenshot to user for review

4. If user wants alternatives:
   → generate_variants(projectId, screenIds, prompt, variantOptions)
   → Present all variants for comparison

5. If user wants edits:
   → edit_screens(projectId, screenIds, edit prompt)
   → Present updated result

6. Apply design system for consistency:
   → apply_design_system(projectId, allScreenIds, assetId)

7. Once approved, extract code:
   → get_screen for each approved screen
   → Download HTML from htmlCode.downloadUrl
   → Use HTML + screenshot as reference for final code generation

8. Proceed to Execution Plan and Atomic Build phases
   using Stitch outputs as the source of truth.
````

### Cenário B: Sem MCP (uso de costura manual)```

1. Suggest user opens stitch.withgoogle.com

2. Recommend device type based on project:
   - Mobile app → App mode
   - Website/dashboard → Web mode
   - Unsure → Start with primary use case

3. Generate prompts for the user following the formula:
   Idea + Theme + Content (+ optional reference image)

4. User pastes prompt in Stitch, generates design

5. User shares screenshot or describes result

6. Generate refinement prompts one change at a time

7. Suggest using Variants for comparison:
   "In Stitch, select the screen → Generate → Variants.
   Set Creative Range to [Refined/Creative] and generate
   3 options to compare."

8. Suggest using Edit Theme for quick adjustments:
   "Select the screen → Generate → Edit Theme.
   Here you can quickly change light/dark mode, accent
   color, corner radius, and font."

9. Suggest creating a Prototype to test:
   "Select the screen → Generate → Prototype.
   This creates an interactive version — check hover states,
   scroll behavior, and input sizes."

10. Once approved, user exports code (View Code → HTML/CSS)
    or exports to Figma for further refinement.

11. User shares exported code/screenshot for code generation phase.

```
### Convertendo Stitch HTML em Target Framework

Stitch exporta HTML + Tailwind CSS. Ao converter para o usuário
estrutura, use esta abordagem:

1. Baixe o HTML do Stitch (via MCP ou exportação manual)
2. Use o HTML como referência estrutural (não copie e cole)
3. Use a captura de tela como referência visual
4. Reescreva na estrutura de destino (React, Vue, Svelte, etc.)
   seguindo os tokens de direção de design acordados
5. Mantenha HTML semântico, acessibilidade e comportamento responsivo
6. Substitua as classes Tailwind pela abordagem CSS do projeto, se for diferente
```
