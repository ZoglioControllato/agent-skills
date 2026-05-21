# Diretrizes para interface da Web

Revise estes arquivos para conformidade: $ARGUMENTS

Leia os arquivos e verifique as regras abaixo. Resultado conciso, mas abrangente – sacrifique a gramática pela brevidade. Alto sinal-ruído.

## Regras

### Acessibilidade

- Botões somente de ícone precisam de `aria-label`
- Os controles do formulário precisam de `<label>` ou `aria-label`
- Elementos interativos precisam de manipuladores de teclado (`onKeyDown`/`onKeyUp`)
- `<button>` para ações, `<a>`/`<Link>` para navegação (não `<div onClick>`)
- As imagens precisam de `alt` (ou `alt=""` se forem decorativas)
- Ícones decorativos precisam de `aria-hidden="true"`
- Atualizações assíncronas (brindes, validação) precisam de `aria-live="polite"`
- Use HTML semântico (`<button>`, `<a>`, `<label>`, `<table>`)

antes de ARIA

- Cabeçalhos hierárquicos `<h1>`–`<h6>`; incluir link para pular para o conteúdo principal
- `scroll-margin-top` nas âncoras de rumo

### Estados de foco

- Elementos interativos precisam de foco visível: `focus-visible:ring-*` ou equivalente
- Nunca `outline-none` / `outline: none` sem substituição de foco
- Use `:focus-visible` em vez de `:focus` (evite o anel de foco ao clicar)
- Foco de grupo com `:focus-within` para controles compostos

### Formulários

- As entradas precisam de `preenchimento automático` e um `nome` significativo
- Use `type` (`email`, `tel`, `url`, `number`) e `inputmode` corretos
- Nunca bloqueie a colagem (`onPaste` + `preventDefault`)
- Etiquetas clicáveis (`htmlFor` ou controle de quebra automática)
- Desative a verificação ortográfica em e-mails, códigos, nomes de usuário (`spellCheck={false}`)
- Caixas de seleção/rádios: rótulo + controle compartilha alvo de acerto único (sem zonas mortas)
- O botão enviar permanece habilitado até o início da solicitação; spinner durante a solicitação
-

Erros embutidos ao lado dos campos; concentre o primeiro erro no envio

- Os espaços reservados terminam com `…` e mostram um padrão de exemplo
- `autocomplete="off"` em campos não-auth para evitar gatilhos do gerenciador de senhas
- Avisar antes da navegação com alterações não salvas (`beforeunload` ou proteção do roteador)

### Animação

- Honre `prefers-reduced-motion` (forneça variante reduzida ou desative)
- Animar apenas `transform`/`opacity` (amigável ao compositor)
- Nunca `transition: all`—lista propriedades explicitamente
- Definir `transform-origin` correto
- SVG: transforma no wrapper `<g>` com `transform-box: fill-box; origem da transformação: centro`
- Animações interrompíveis – responda à entrada do usuário no meio da animação

### Tipografia

- `…` não `...`
- Aspas curvas `"` `"` não retas `"`
- Espaços inseparáveis: `10 MB`, `⌘ K`, nomes de marcas
- Os estados de carregamento terminam com `…`: `"Carregando…"`, `"Salvando…"`
- `font-variant-numeric: tabular-nums` para colunas/comparações numéricas
- Use `text-wrap: balance` ou `text-pretty` nos títulos (evita viúvas)

### Manipulação de conteúdo

- Contêineres de texto lidam com conteúdo longo: `truncate`, `line-clamp-*` ou `break-words`
- Os filhos flexíveis precisam de `min-w-0` para permitir o truncamento de texto
- Lidar com estados vazios – não renderize UI quebrada para strings/matrizes vazias
- Conteúdo gerado pelo usuário: antecipe entradas curtas, médias e muito longas

### Imagens

- `<img>` precisa de `width` e `height` explícitos (evita CLS)
- Imagens abaixo da dobra: `loading="lazy"`
- Imagens críticas acima da dobra: `priority` ou `fetchpriority="high"`

### Desempenho

- Listas grandes (>50 itens): virtualize (`virtua`, `content-visibility: auto`)
- Nenhuma leitura de layout na renderização (`getBoundingClientRect`, `offsetHeight`, `offsetWidth`, `scrollTop`)
- Leituras/gravações em lote DOM; evite intercalar
- Prefira entradas não controladas; entradas controladas devem ser baratas por pressionamento de tecla
- Adicionar `<link rel="preconnect">` para domínios CDN/ativos
- Fontes críticas: `<link rel="preload" as="font">` com `font-display: swap`

### Navegação e Estado

- O URL reflete o estado: filtros, guias, paginação, painéis expandidos em parâmetros de consulta
- Links usam `<a>`/`<Link>` (Cmd/Ctrl+clique, suporte para clique do meio)
- Link direto para todas as interfaces de usuário com estado (se usar `useState`, considere a sincronização de URL via nuqs ou similar)
- Ações destrutivas precisam de confirmação modal ou janela de desfazer – nunca imediata

### Toque e interação

- `touch-action: manipulação` (evita atraso de zoom com toque duplo)
- `-webkit-tap-highlight-color` definido intencionalmente
- `comportamento de rolagem: contém` em modais/gavetas/folhas
- Durante arrastar: desative a seleção de texto, `inerte` nos elementos arrastados
- `autoFocus` com moderação - somente desktop, entrada primária única; evite no celular

### Áreas Seguras e Layout

- Layouts sem margens precisam de `env(safe-area-inset-*)` para entalhes
- Evite barras de rolagem indesejadas: `overflow-x-hidden` em contêineres, corrija o estouro de conteúdo
- Medição Flex/grid sobre JS para layout

### Modo escuro e temas

- `color-scheme: dark` em `<html>` para temas escuros (corrige barra de rolagem, entradas)
- `<meta name="theme-color">` corresponde ao plano de fundo da página
- Nativo `<select>`: `background-color` e `color` explícitos (modo escuro do Windows)

### Local e i18n

- Datas/horas: use `Intl.DateTimeFormat` e não formatos codificados
- Números/moeda: use `Intl.NumberFormat` e não formatos codificados
- Detectar idioma via `Accept-Language` / `navigator.languages`, não IP

### Hidratação Segurança

- Entradas com `value` precisam de `onChange` (ou use `defaultValue` para não controladas)
- Renderização de data/hora: proteção contra incompatibilidade de hidratação (servidor x cliente)
- `suppressHydrationWarning` somente onde for realmente necessário

### Hover e estados interativos

- Botões/links precisam do estado `hover:` (feedback visual)
- Estados interativos aumentam o contraste: pairar/ativo/foco mais proeminente que o repouso

### Conteúdo e cópia

- Voz ativa: "Instalar a CLI" e não "A CLI será instalada"
- Caixa de título para títulos/botões (estilo Chicago)
- Números para contagens: "8 implantações" e não "oito"
- Rótulos de botão específicos: "Salvar chave de API" e não "Continuar"
- As mensagens de erro incluem correção/próxima etapa, não apenas problema
- Segunda pessoa; evite a primeira pessoa
- `&` sobre "e" onde há espaço limitado

### Antipadrões (sinalize-os)

- `user-scalable=no` ou `maximum-scale=1` desativando o zoom
- `onPaste` com `preventDefault`
- `transição: todos`
- `outline-none` sem substituição visível de foco
- Navegação `onClick` inline sem `<a>`
- `<div>` ou `<span>` com manipuladores de clique (deve ser `<button>`)
- Imagens sem dimensões
- Grandes arrays `.map()` sem virtualização
- Entradas de formulário sem rótulos
- Botões de ícone sem `aria-label`
- Formatos de data/número codificados (use `I

ntl.\*`)

- `autoFocus` sem justificativa clara

## Formato de saída

Agrupar por arquivo. Use o formato `file:line` (Código VS clicável). Descobertas concisas.```text

## src/Button.tsx

src/Button.tsx:42 - icon button missing aria-label
src/Button.tsx:18 - input lacks label
src/Button.tsx:55 - animation missing prefers-reduced-motion
src/Button.tsx:67 - transition: all → list properties

## src/Modal.tsx

src/Modal.tsx:12 - missing overscroll-behavior: contain
src/Modal.tsx:34 - "..." → "…"

## src/Card.tsx

✓ pass

```
Questão de estado + localização. Ignore a explicação, a menos que corrija o que não é óbvio. Sem preâmbulo.
```
