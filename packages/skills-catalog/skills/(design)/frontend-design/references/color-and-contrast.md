# Cor e contraste

## Espaços de cores: use OKLCH

**Pare de usar HSL.** Use OKLCH (ou LCH). É perceptualmente uniforme, o que significa que etapas iguais de luminosidade _parecem_ iguais - ao contrário do HSL, onde 50% de luminosidade em amarelo parece brilhante, enquanto 50% em azul parece escuro.```css
/_ OKLCH: lightness (0-100%), chroma (0-0.4+), hue (0-360) _/
--color-primary: oklch(60% 0.15 250); /_ Blue _/
--color-primary-light: oklch(85% 0.08 250); /_ Same hue, lighter _/
--color-primary-dark: oklch(35% 0.12 250); /_ Same hue, darker _/

````

**Informação importante**: À medida que avança em direção ao branco ou preto, reduza o croma (saturação). O alto croma com extrema luminosidade parece extravagante. Um azul claro com 85% de luminosidade precisa de aproximadamente 0,08 croma, não 0,15 da sua cor base.

## Construindo paletas funcionais

### A armadilha neutra colorida

**O cinza puro está morto.** Adicione um toque sutil do matiz da sua marca a todos os tons neutros:```css
/* Dead grays */
--gray-100: oklch(95% 0 0);     /* No personality */
--gray-900: oklch(15% 0 0);

/* Warm-tinted grays (add brand warmth) */
--gray-100: oklch(95% 0.01 60);  /* Hint of warmth */
--gray-900: oklch(15% 0.01 60);

/* Cool-tinted grays (tech, professional) */
--gray-100: oklch(95% 0.01 250); /* Hint of blue */
--gray-900: oklch(15% 0.01 250);
````

O croma é minúsculo (0,01), mas perceptível. Ele cria coesão subconsciente entre a cor da sua marca e a interface do usuário.

### Estrutura da paleta

Um sistema completo precisa de:

| Função         | Finalidade                       | Exemplo                       |
| -------------- | -------------------------------- | ----------------------------- |
| **Primário**   | Marca, CTAs, ações-chave         | 1 cor, 3-5 tonalidades        |
| **Neutro**     | Texto, planos de fundo, bordas   | Escala de tonalidade 9-11     |
| **Semântico**  | Sucesso, erro, aviso, informação | 4 cores, 2-3 tonalidades cada |
| **Superfície** | Cartões, modais, sobreposições   | 2-3 níveis de elevação        |

**Ignore o secundário/terciário, a menos que você precise deles.** A maioria dos aplicativos funciona bem com uma cor de destaque. Adicionar mais cria fadiga de decisão e ruído visual.

### A regra 60-30-10 (aplicada corretamente)

Esta regra é sobre **peso visual**, não sobre contagem de pixels:

- **60%**: fundos neutros, espaços em branco, superfícies de base
- **30%**: Cores secundárias — texto, bordas, estados inativos
- **10%**: Destaque: CTAs, destaques, estados de foco

O erro comum: usar a cor de destaque em todos os lugares porque é “a cor da marca”. As cores de destaque funcionam _porque_ são raras. O uso excessivo mata seu poder.

## Contraste e acessibilidade

### Requisitos WCAG

| Tipo de conteúdo                        | Mínimo AA | Alvo AAA |
| --------------------------------------- | --------- | -------- |
| Corpo do texto                          | 4,5:1     | 7:1      |
| Texto grande (18px+ ou 14px em negrito) | 3:1       | 4,5:1    |
| Componentes de UI, ícones               | 3:1       | 4,5:1    |
| Decorações não essenciais               | Nenhum    | Nenhum   |

**A pegadinha**: o texto do espaço reservado ainda precisa de 4,5:1. Aquele espaço reservado cinza claro que você vê em todos os lugares? Geralmente falha nas WCAG.

### Combinações de cores perigosas

Eles geralmente falham no contraste ou causam problemas de legibilidade:

- Texto cinza claro em branco (a falha de acessibilidade nº 1)
- **Texto cinza em qualquer fundo colorido** — o cinza parece desbotado e sem cor. Use um tom mais escuro da cor de fundo ou transparência
- Texto vermelho sobre fundo verde (ou vice-versa) – 8% dos homens não conseguem distingui-los
- Texto azul sobre fundo vermelho (vibra visualmente)
- Texto amarelo em branco (quase sempre falha)
- Texto fino e claro nas imagens (contraste imprevisível)

### Nunca use cinza puro ou preto puro

Cinza puro (`oklch(50% 0 0)`) e preto puro (`#000`) não existem na natureza – sombras e superfícies reais sempre têm uma tonalidade de cor. Mesmo um croma de 0,005-0,01 é suficiente para parecer natural sem ser obviamente colorido. (Veja o exemplo de tons neutros acima.)

### Teste

Não confie em seus olhos. Use ferramentas:

- [Verificador de contraste WebAIM](https://webaim.org/resources/contrastchecker/)
- DevTools do navegador → Renderização → Emular deficiências de visão
- [Polypane](https://polypane.app/) para testes em tempo real

## Tema: Modo Claro e Escuro

### O modo escuro não é o modo de luz invertida

Você não pode simplesmente trocar cores. O modo escuro requer diferentes decisões de design:

| Modo Luz                  | Modo escuro                                             |
| ------------------------- | ------------------------------------------------------- | ------ |
| Sombras para profundidade | Superfícies mais claras para profundidade (sem sombras) |
| Texto escuro sobre luz    | Texto claro em escuro (reduza o peso da fonte)          |
| Acentos vibrantes         | Desaturar ligeiramente os acentos                       |
| Fundos brancos            | Nunca preto puro – use cinza escuro (oklch 12-18%)      | ```css |

/_ Dark mode depth via surface color, not shadow _/
:root[data-theme="dark"] {
--surface-1: oklch(15% 0.01 250);
--surface-2: oklch(20% 0.01 250); /_ "Higher" = lighter _/
--surface-3: oklch(25% 0.01 250);

/_ Reduce text weight slightly _/
--body-weight: 350; /_ Instead of 400 _/
}

```
### Hierarquia de tokens

Use duas camadas: tokens primitivos (`--blue-500`) e tokens semânticos (`--color-primary: var(--blue-500)`). Para o modo escuro, redefina apenas a camada semântica – os primitivos permanecem os mesmos.

## Alpha é um cheiro de design

O uso intenso de transparência (rgba, hsla) geralmente significa uma paleta incompleta. Alpha cria contraste imprevisível, sobrecarga de desempenho e inconsistência. Em vez disso, defina cores de sobreposição explícitas para cada contexto. Exceção: anéis de foco e estados interativos onde a transparência é necessária.

---

**Evitar**: confiar apenas na cor para transmitir informações. Criação de paletas sem funções claras para cada cor. Usando preto puro (#000) para áreas grandes. Ignorando o teste de daltonismo (8% dos homens afetados).
```
