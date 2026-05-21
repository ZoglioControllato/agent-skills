# Referência de Princípios de Design

Leia este arquivo quando precisar de orientação mais profunda sobre decisões específicas de design
durante a Fase 3 (Direção do Projeto) ou Fase 5 (Construção Atômica). NÃO leia
isso antecipadamente - somente quando uma seção específica for relevante para a tarefa atual.

## Índice

1. Regras de emparelhamento de tipografia (linha ~15)
2. Arquitetura do sistema de cores (linha ~70)
3. Sistemas de espaçamento e ritmo (linha ~130)
4. Padrões de layout por tipo de projeto (linha ~175)
5. Antipadrões comuns a serem capturados (linha ~230)
6. Mínimos de acessibilidade (linha ~275)
7. Diretrizes de animação e movimento (linha ~310)
8. Sistemas de ícones (linha ~350)

---

## 1. Regras de emparelhamento de tipografia

### Os Fundamentos

Um bom emparelhamento tipográfico cria hierarquia visual e personalidade. Emparelhamento ruim
cria ruído e distração.

**Estratégias de emparelhamento seguras:**

- Contraste na estrutura: combine uma sans geométrica com uma serifa humanista
  (por exemplo, DM Sans + Lora)
- Mesma família, pesos diferentes: uma fonte com ampla faixa de peso pode
  lidar com títulos e corpo (por exemplo, Inter 800 para títulos, 400 para corpo)
- Contraste em largura: combine uma fonte de exibição condensada com uma fonte de largura regular
  fonte do corpo (por exemplo, Bebas Neue + Source Sans Pro)

**Emparelhamento de bandeiras vermelhas:**

- Duas fontes decorativas competindo por atenção
- Fontes da mesma classificação com diferenças sutis (parece
  um erro, não uma escolha)
- Mais de 2 famílias de fontes em um único projeto (3 no máximo para aplicativos complexos)
- Usando uma fonte de exibição para o corpo do texto ou vice-versa

### Seleção de fonte por Project Mood

| Humor                   | Direção do rumo            | Direção do corpo             | Par de exemplo                 |
| ----------------------- | -------------------------- | ---------------------------- | ------------------------------ |
| Corporativo / Confiável | Sans geométrico limpo      | Humanista legível sem        | Roupa + Nunito                 |
| Editorial / Sofisticado | Serifa de alto contraste   | Serif elegante ou sans limpo | Display Playfair + Fonte Serif |
| Técnico / Desenvolvedor | Monoespaçado ou geométrico | Limpar sem                   | JetBrains Mono + Inter         |
| Lúdico / Criativo       | Arredondado                |

exibição | Amigável sem | Fredoka + Areia Movediça |
| Luxo / Premium | Serifa fina ou sans elegante | Legível leve | Cormorão Garamond + Montserrat |
| Brutalista / Ousado | Grotesco pesado | Neutro sem | Anton + Work Sans |
| Inicialização / Moderno | Sans geométricos | Mesma família ou neutra | General Sans + Gabinete Grotesk |

### Escala de tipografia

Use uma proporção de escala consistente. Comuns:

- 1.200 (Terceiro Menor): hierarquia sutil, boa para UIs densas
- 1.250 (Terceiro Maior): equilibrado, funciona para a maioria dos projetos
- 1.333 (Quarto Perfeito): hierarquia forte, bom para editorial
- 1.500 (Quinto Perfeito): dramático, bom para páginas de marketing

Aplique a escala: base (1rem) → h6 → h5 → h4 → h3 → h2 → h1, cada
multiplicado pela proporção. Isso cria harmonia matemática.

---

## 2. Arquitetura do sistema de cores

### Construindo uma paleta

Todo sistema de cores precisa de:

- **Primário:** A cor da marca. Usado para CTAs, links, principais elementos interativos
- **Secundário:** Cor de suporte. Usado para ações secundárias, acentos
- **Escala neutra:** 9 a 11 tons de quase branco a quase preto para texto,
  fundos, bordas, divisórias
- **Cores semânticas:** Sucesso (família verde), Aviso (família âmbar),
  Erro (família vermelha), Informações (família azul)
- **Cores de superfície:** Camadas de fundo (pelo menos 3 níveis de profundidade)

### Regra de proporção de cores

Siga a regra 60-30-10:

- 60% dominante (neutros, fundos)
- 30% secundário (cartões, seções, elementos de suporte)
- 10% de destaque (CTAs, destaques, principais elementos interativos)

Projetos que parecem "desligados" geralmente violam essa proporção - muita ênfase
cor ou sem dominante claro.

### Considerações sobre o modo escuro

O modo escuro NÃO é "inverter todas as cores". Principais diferenças:

- Cores de superfície: use pretos quase dessaturados (#0a0a0a a #1a1a2e), NÃO #000000 puro
- Reduza ligeiramente o contraste: o branco puro (#fff) no escuro é áspero. Use #e0e0e0 para #f0f0f0
- As cores de destaque podem precisar de iluminação para manter as taxas de contraste
- As sombras ficam menos visíveis – use bordas mais claras ou brilhos sutis
- A elevação é mostrada por superfícies mais claras, não por sombras mais escuras

### Gerando paleta a partir de uma única cor

Se o usuário fornecer apenas uma cor de marca:

1. Use-o como principal
2. Gere um secundário complementar ou análogo
3. Construa uma escala neutra dessaturando o primário e ajustando a luminosidade
4. Certifique-se de que todas as cores semânticas tenham contraste suficiente em relação às cores primárias
5. Teste: o primário se destaca quando cercado por neutros? Se não, ajuste.

---

## 3. Sistemas de espaçamento e ritmo

### Sistema de Unidade Básica

Escolha uma unidade base (4px ou 8px) e derive TODOS os espaçamentos dela:

**Base de 4px (mais compacta, boa para UIs densas):**
4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, 128

**Base de 8px (espaçosa, boa para marketing/editorial):**
8, 16, 24, 32, 48, 64, 80, 96, 128, 160, 192

### Onde o espaçamento é mais importante

Estas são as decisões de espaçamento que determinam ou quebram um projeto:

- **Preenchimento interno do componente:** Botões, cartões, entradas, modais
- **Entre elementos relacionados:** Etiqueta para entrada, ícone para texto, itens de cartão
- **Entre seções:** Seções de página, blocos de conteúdo
- **Margens da página:** Preenchimento geral do contêiner de conteúdo

### Erros comuns de espaçamento

- Preenchimento inconsistente dentro de componentes semelhantes
- Mesmo espaçamento entre todos os elementos (sem ritmo)
- Muito pouco espaçamento entre as seções (o conteúdo parece apertado)
- Não aumentar o espaçamento proporcionalmente em pontos de interrupção maiores
- Ignorando o alinhamento óptico (centro matemático ≠ centro visual)

---

## 4. Padrões de layout por tipo de projeto

### Páginas de destino/marketing

- Herói de largura total com forte ponto focal visual
- Fluxo vertical baseado em seções com layouts alternados
- Espaço em branco generoso entre as seções (80px-160px)
- Largura máxima do conteúdo: 1200px-1440px
- Móvel: coluna única, empilhe tudo

### Painéis/Painéis de administração

- Navegação na barra lateral (recolhível) + área de conteúdo principal
- Widgets baseados em cartão ou painéis de dados
- Denso, mas organizado — grupos visuais claros
- Largura máxima do conteúdo: fluida (100%) ou 1600px+
- Considere: cabeçalho fixo, área de conteúdo rolável

### E-commerce/Páginas de produtos

- Listagem de produtos baseada em grade (responsiva de 2 a 4 colunas)
- Detalhe do produto: galeria de imagens à esquerda, informações à direita (ou celular empilhado)
- Hierarquia clara de preços e CTA
- Sinais de confiança visíveis (avaliações, crachás de segurança)

### Documentação/Sites de Conteúdo

- Duas colunas: barra lateral TOC + área de conteúdo
- Largura máxima do conteúdo para legibilidade: 700px-800px para prosa
- Blocos de código com formatação adequada
- Elementos de navegação fixos

### Formulários/Fluxos de trabalho

- Coluna única para formulários (reduz a carga cognitiva)
- Indicação clara de etapas para fluxos de várias etapas
- Validação inline, não apenas no envio
- Agrupe campos relacionados com separação visual sutil

### Bibliotecas de componentes/sistemas de design

- Documentação de prop consistente
- Visualização ao vivo + código lado a lado
- Demonstrações de variantes claras
- Documentação de comportamento responsivo

---

## 5. Antipadrões comuns para capturar

Ao revisar as solicitações do usuário ou durante a construção, observe:

**Tipografia:**

- Todas as letras maiúsculas dos parágrafos (difíceis de ler)
- Texto justificado na web (causa espaçamento irregular entre palavras)
- Comprimento da linha acima de 75 caracteres (linhas difíceis de rastrear)
- Corpo do texto menor que 16px em dispositivos móveis
- Nenhuma hierarquia de títulos clara (h1-h6 é semelhante)

**Cor:**

- Vermelho/verde apenas para status (daltônico hostil)
- Cor de destaque usada em mais de 30% da interface
- Texto de baixo contraste em fundos padronizados
- Cores diferentes para elementos com a mesma finalidade
- Cores neon ou de alta saturação para grandes áreas

**Layout:**

- Rolagem horizontal para conteúdo (exceto carrosséis intencionais)
- Layouts de largura fixa que quebram em telas diferentes
- Conteúdo tocando nas bordas da janela de visualização (sem preenchimento de contêiner)
- Alinhamento inconsistente entre seções
- Guerras de índice Z (elementos sobrepostos inesperadamente)

**Interação:**

- Destinos de clique menores que 44 x 44 px em dispositivos móveis
- Nenhum estado de foco visível para navegação pelo teclado
- Interações apenas com foco, sem alternativa móvel
- Reprodução automática de áudio ou vídeo
- Desativando o zoom do navegador

**Nível do componente:**

- Carrosséis para menos de 4 itens
- Modal dentro de um modal
- Rolagem infinita sem "voltar ao topo" ou opção de paginação
- Notificações do Toast que desaparecem muito rapidamente
- Menus suspensos com mais de 10 a 15 itens (use pesquisa/filtro)

---

## 6. Mínimos de acessibilidade

Estes são NÃO NEGOCIÁVEIS no código gerado:

**Contraste:**

- Texto normal: proporção mínima de 4,5:1 em relação ao fundo
- Texto grande (18px+ ou 14px+ negrito): proporção mínima de 3:1
- Elementos interativos: proporção mínima de 3:1 em relação às cores adjacentes

**Teclado:**

- Todos os elementos interativos acessíveis via Tab
- Indicadores de foco visíveis (não apenas o padrão do navegador - estilize-os)
- Escape fecha modais/sobreposições
- Enter/Space ativa botões e links

**HTML semântico:**

- Use hierarquia de títulos (h1 > h2 > h3, sem pular)
- Use o botão para ações, um para navegação
- Use nav, principal, aparte, rodapé, seção, artigo
- As entradas do formulário devem ter rótulos associados (não apenas espaço reservado)

**Leitores de tela:**

- As imagens precisam de texto alternativo (imagens decorativas: alt="")
- Botões somente de ícone precisam de rótulo aria
- Mudanças dinâmicas de conteúdo: use regiões aria-live
- Ocultar elementos decorativos dos leitores de tela (aria-hidden="true")

---

## 7. Diretrizes de animação e movimento

### Quando animar

- **Transições de estado:** passar o mouse, focar, ativo, selecionado/desmarcado
- **Entrada/saída:** elementos aparecendo ou desaparecendo
- **Feedback:** sucesso, erro, carregamento, progresso
- **Atenção:** direcionando o foco para mudanças importantes
- **Continuidade:** conectando estados de IU relacionados

### Quando NÃO animar

- Movimento que atrasa a tarefa principal do usuário
- Animação para decoração sem finalidade funcional (em UIs com muitos dados)
- Animações repetidas/em loop que distraem
- Animação que é acionada em cada evento de rolagem sem limitação

### Diretrizes de Duração

- Microinterações (passar, alternar): 100-200ms
- Transições de componentes (expandir, deslizar): 200-300ms
- Transições de página/visualização: 300-500ms
- Sequências orquestradas complexas: 500-800ms
- Qualquer coisa acima de 1s deve ser interrompível ou ignorável

### Facilitando

- **facilidade** para entradas (início rápido, parada suave – parece responsivo)
- **facilidade** para saídas (início suave, final rápido - parece natural)
- **facilidade de entrada** para mudanças de estado (suavização em ambos os sentidos)
- **linear** apenas para animações contínuas (carregando spinners, progresso)
- **cúbico-bezier** curvas personalizadas para personalidade e polimento

### Movimento Reduzido

SEMPRE inclua uma consulta de mídia `prefere movimento reduzido`:```css
@media (prefers-reduced-motion: reduce) {
_, _::before, \*::after {
animation-duration: 0.01ms !important;
transition-duration: 0.01ms !important;
}
}

```
---

## 8. Sistemas de ícones

### Bibliotecas populares e suas personalidades

| Biblioteca | Estilo | Melhor para |
|--------|-------|----------|
| Lúcida | Contornos limpos e geométricos | Aplicativos modernos, painéis |
| Fósforo | Versátil, 6 pesos | Sistemas de design, flexibilidade necessária |
| Heroícones | Dois estilos (contorno/sólido) | Projetos Tailwind, UI limpa |
| Ícones de mesa | Largura de traço consistente | Ferramentas para desenvolvedores, painéis de administração |
| Ícones de raiz | Mínimo, grade 15x15 | UIs compactas, barras de ferramentas |
| Fonte incrível | Abrangente, variado |

Projetos legados, variedade de ícones |
| Símbolos Materiais | Linguagem de design do Google | Projetos de Design de Materiais |

### Regras de uso de ícones

- Mantenha um tamanho consistente dentro do mesmo contexto (não misture 20px e 24px
  ícones na mesma barra de ferramentas)
- Mantenha uma espessura de traço consistente (não misture contorno e preenchimento no
  mesma seção, a menos que seja intencional para indicação de estado)
- Os ícones devem apoiar o significado, não substituir o texto (exceto universalmente
  compreendido: pesquisar, fechar, menu, reproduzir/pausar)
- Alvos de toque: mesmo que o ícone tenha 20px, a área clicável deve ser
  pelo menos 44x44px
- Use um

biblioteca de ícones únicos por projeto para consistência visual
```
