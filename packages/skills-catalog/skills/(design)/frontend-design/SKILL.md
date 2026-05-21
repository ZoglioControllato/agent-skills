---
name: frontend-design
description: Cria interfaces frontend distintas e prontas para produção com alto nível visual. Use quando o usuário pedir componentes web, páginas, artefatos, posters ou aplicações. Gera código criativo e acabado que evita estética genérica de IA. NÃO use para revisão ou auditoria de design (use web-design-guidelines ou web-quality-audit).
metadata:
  author: Impeccable (Paul Bakaus), based on Anthropic frontend-design
  version: '1.0.0'
source: https://github.com/pbakaus/impeccable
---

Esta skill orienta criação de interfaces frontend distintas e prontas para produção que evitem a estética genérica (“AI slop”). Implemente código funcional real com atenção excepcional a detalhes estéticos e escolhas criativas.

## Direção de design

Comprometa-se com uma direção estética OUSADA:

- **Propósito**: Qual problema esta interface resolve? Quem usa?
- **Tom**: Escolha um extremo: minimalismo brutal, caos maximalista, retrofuturista, orgânico/natural, luxo/refinado, lúdico/brinquedo, editorial/revista, brutalista/cruo, art déco/geométrico, suave/pastel, industrial/utilitário etc. Há muitos sabores — use como inspiração mas desenhe um fiel à direção escolhida.
- **Restrições**: Requisitos técnicos (framework, performance, acessibilidade).
- **Diferenciação**: O que torna isto INESQUECÍVEL? Qual a única coisa que alguém vai lembrar?

**CRÍTICO**: Escolha direção conceitual clara e execute com precisão. Maximalismo ousado e minimalismo refinado funcionam — a chave é intencionalidade, não intensidade.

Depois implemente código funcional que seja:

- Pronto para produção e funcional
- Visualmente marcante e memorável
- Coeso com ponto de vista estético claro
- Meticulosamente refinado em cada detalhe

## Diretrizes de estética frontend

### Tipografia

→ _Consulte [referência de tipografia](references/typography.md) para escalas, pares e carregamento de fontes._

Escolha fontes bonitas, únicas e interessantes. Una uma display marcante com um corpo refinado.

**FAÇA**: Escala modular com tamanhos fluidos (clamp)
**FAÇA**: Varie pesos e tamanhos para hierarquia clara
**NÃO FAÇA**: Fontes gastas — Inter, Roboto, Arial, Open Sans, padrão do sistema
**NÃO FAÇA**: Monoespaçada como atalho preguiçoso para “vibe técnico/dev”
**NÃO FAÇA**: Ícones grandes com cantos arredondados acima de todo título — raramente agregam e deixam sites com cara de template

### Cor e tema

→ _Consulte [referência de cor](references/color-and-contrast.md) para OKLCH, paletas e modo escuro._

Comprometa-se com paleta coesa. Dominantes com acentos fortes ganham de paletas tímidas e uniformemente distribuídas.

**FAÇA**: Funções de cor CSS modernas (oklch, color-mix, light-dark) para paletas perceptualmente uniformes e sustentáveis
**FAÇA**: Tingir neutros na direção do matiz da marca — até um leve hint cria coesão inconsciente
**NÃO FAÇA**: Cinza sobre fundo colorido — fica lavado; use um tom derivado do fundo
**NÃO FAÇA**: Preto puro (#000) ou branco puro (#fff) — sempre tinge; puro não existe na natureza
**NÃO FAÇA**: Paleta clichê de IA: ciano sobre escuro, gradiente roxo-azul, neon em fundo escuro
**NÃO FAÇA**: Texto em gradiente para “impacto” — em métricas ou títulos é decorativo, não substantivo
**NÃO FAÇA**: Cair no modo escuro padrão com brilhos — parece “legal” sem decisões de design reais

### Layout e espaço

→ _Consulte [referência espacial](references/spatial-design.md) para grades, ritmo e container queries._

Crie ritmo visual com espaçamento variado — não o mesmo padding em tudo. Abra espaço para assimetria e composições surpreendentes. Quebre a grade de propósito para ênfase.

**FAÇA**: Ritmo com espaçamentos variados — agrupamentos apertados, separações generosas
**FAÇA**: Espaçamento fluido com clamp() que “respira” em telas maiores
**FAÇA**: Assimetria e composições inesperadas; quebras de grade intencionais
**NÃO FAÇA**: Envolver tudo em cards — nem tudo precisa de container
**NÃO FAÇA**: Cards dentro de cards — ruído visual, achate a hierarquia
**NÃO FAÇA**: Grades idênticas de cards — mesmo tamanho, ícone + título + texto repetidos
**NÃO FAÇA**: Template de hero com métrica grande — número enorme, label pequena, stats de apoio, acento em gradiente
**NÃO FAÇA**: Centralizar tudo — texto alinhado à esquerda com layout assimétrico parece mais desenhado
**NÃO FAÇA**: Mesmo espaçamento em todo lugar — sem ritmo, layout monótono

### Detalhes visuais

**FAÇA**: Elementos decorativos intencionais que reforcem marca
**NÃO FAÇA**: Glassmorphism em toda parte — blur, cards de vidro, bordas brilho como enfeite vazio
**NÃO FAÇA**: Retângulos arredondados com borda grossa colorida só de um lado — acento preguiçoso e raramente intencional
**NÃO FAÇA**: Sparklines como decoração — gráficos minúsculos que parecem sofisticados e não dizem nada
**NÃO FAÇA**: Retângulos arredondados com sombra genérica — seguro, esquecível, qualquer saída de IA
**NÃO FAÇA**: Modais sem necessidade real — modais são atalho preguiçoso

### Movimento

→ _Consulte [referência de motion](references/motion-design.md) para timing, easing e reduced motion._

Foque picos de impacto: uma entrada de página bem orquestrada com reveals escalonados gera mais prazer que microinterações espalhadas.

**FAÇA**: Movimento para mudanças de estado — entradas, saídas, feedback
**FAÇA**: Easing exponencial (ease-out quart/quint/expo) para desaceleração natural
**FAÇA**: Para altura animada, prefira grid-template-rows a animar height direto
**NÃO FAÇA**: Animar propriedades de layout (width, height, padding, margin) — use transform e opacity
**NÃO FAÇA**: Bounce ou elastic — datados e chamativos; objetos reais desaceleram suave

### Interação

→ _Consulte [referência de interação](references/interaction-design.md) para formulários, foco e loading._

Interações rápidas. UI otimista — atualiza na hora, sincroniza depois.

**FAÇA**: Divulgação progressiva — comece simples, revela sofisticação na interação (opções básicas primeiro; avançado em expansíveis; hover revela secundárias)
**FAÇA**: Estados vazios que ensinam a interface, não só “nada aqui”
**FAÇA**: Toda superfície interativa intencional e responsiva
**NÃO FAÇA**: Repetir a mesma informação — intros redundantes que repetem o título
**NÃO FAÇA**: Todo botão primário — ghost, texto, secundário; hierarquia importa

### Responsivo

→ _Consulte [referência responsiva](references/responsive-design.md) para mobile-first, design fluido e container queries._

**FAÇA**: Container queries (@container) para responsividade ao nível de componente
**FAÇA**: Adaptar para contextos diferentes — não só encolher
**NÃO FAÇA**: Esconder função crítica no mobile — adapte, não ampute

### UX writing

→ _Consulte [referência de UX writing](references/ux-writing.md) para labels, erros e vazios._

**FAÇA**: Cada palavra deve merecer estar ali
**NÃO FAÇA**: Repetir o que o usuário já enxerga

---

## O teste “AI slop”

**Checagem crítica**: Se você mostrasse esta interface e dissesse “a IA fez”, acreditariam na hora? Se sim, é o problema.

Uma interface distinta faz perguntarem “como foi feito?” não “qual IA fez?”

Revise os NÃO FAÇA acima — são marcas digitais de trabalho gerado por IA em 2024-2025.

---

## Exemplos

### Exemplo 1: Landing com estética forte

Usuário: “Monte landing para produto dev tools, algo que não pareça todo SaaS igual.”
Ações: Escolha direção ousada (ex.: brutalista ou editorial); par tipográfico distinto e paleta coesa; espaçamento fluido e um foco claro; evite cards dentro de cards e clichês de hero com métrica.
Resultado: Página única com hierarquia clara, tipografia memorável e sem marcações óbvias de IA (sem gradiente roxo, sem cards com borda de acento grossa).

### Exemplo 2: Dashboard ou app

Usuário: “Dashboard de analytics com tema escuro.”
Ações: Comprometa um escuro específico (ex.: neutros tingidos refinados, não brilho ciano/roxo padrão); container queries nos painéis; um momento de motion considerado (ex.: lista com stagger); estados vazios úteis.
Resultado: Dashboard funcional e intencional — paleta distinta, hierarquia de dados clara, sem glow clichê.

### Exemplo 3: Poster ou artefato marketing

Usuário: “Poster para palestra sobre performance frontend.”
Ações: Conceito forte tipográfico ou visual; escala modular e paleta limitada; evitar stock genérico + headline.
Resultado: Artefato que sustenta sozinho — tipo e composição memoráveis, não preenchimento de template.

---

## Princípios de implementação

Alinhe complexidade de implementação à visão estética. Designs maximalistas precisam de código elaborado com animações e efeitos. Minimalistas ou refinados precisam de contenção, precisão e cuidado com espaço, tipografia e detalhes sutis.

Interprete com criatividade e faça escolhas inesperadas genuínas ao contexto. Nenhum design deve ser igual ao outro. Varie temas claro/escuro, fontes e estéticas. NUNCA convirja para as mesmas escolhas comuns entre gerações.

Lembre: a IA é capaz de trabalho criativo extraordinário. Não se contenha — mostre o que dá para criar pensando fora da caixa e comprometendo-se com uma visão distinta.
