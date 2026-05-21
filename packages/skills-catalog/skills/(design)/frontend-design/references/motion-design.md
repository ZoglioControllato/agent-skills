# Design de movimento

## Duração: A regra 100/300/500

O tempo é mais importante do que a facilidade. Essas durações parecem adequadas para a maioria das UI:

| Duração       | Caso de uso          | Exemplos                                         |
| ------------- | -------------------- | ------------------------------------------------ |
| **100-150ms** | Feedback instantâneo | Pressionar botão, alternar, mudar de cor         |
| **200-300ms** | Mudanças de estado   | Menu aberto, dica de ferramenta, estados de foco |
| **300-500ms** | Mudanças de layout   | Acordeão, modal, gaveta                          |
| **500-800ms** | Animações de entrada | Carregamento de página, herói revela             |

**As animações de saída são mais rápidas que as entradas** — use aproximadamente 75% da duração da entrada.

## Flexibilização: escolha a curva certa

**Não use `ease`.** É um compromisso que raramente é ideal. Em vez disso:

| Curva                     | Usar para                           | CSS                                |
| ------------------------- | ----------------------------------- | ---------------------------------- |
| **facilidade**            | Elementos entrando                  | `bézier cúbico (0,16, 1, 0,3, 1)`  |
| **facilidade**            | Elementos saindo                    | `bézier cúbico (0,7, 0, 0,84, 0)`  |
| **facilidade de entrada** | Alternância de estado (lá → voltar) | `bézier cúbico (0,65, 0, 0,35, 1)` |

**Para microinterações, use curvas exponenciais** — elas parecem naturais porque imitam a física real (fricção, desaceleração):```css
/_ Quart out - smooth, refined (recommended default) _/
--ease-out-quart: cubic-bezier(0.25, 1, 0.5, 1);

/_ Quint out - slightly more dramatic _/
--ease-out-quint: cubic-bezier(0.22, 1, 0.36, 1);

/_ Expo out - snappy, confident _/
--ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);

````

**Evite curvas saltitantes e elásticas.** Eles estavam na moda em 2015, mas agora parecem cafonas e amadores. Objetos reais não saltam quando param – eles desaceleram suavemente. Os efeitos de overshoot chamam a atenção para a animação em si e não para o conteúdo.

## As únicas duas propriedades que você deve animar

Somente **transformação** e **opacidade** — todo o resto causa o recálculo do layout. Para animações de altura (acordeões), use `grid-template-rows: 0fr → 1fr` em vez de animar `height` diretamente.

## Animações escalonadas

Use propriedades personalizadas CSS para um escalonamento mais limpo: `animation-delay: calc(var(--i, 0) * 50ms)` com `style="--i: 0"` em cada item. **Limite o tempo total de escalonamento** — 10 itens em 50 ms = 500 ms no total. Para muitos itens, reduza o atraso por item ou limite a contagem escalonada.

## Movimento Reduzido

Isto não é opcional. Os distúrbios vestibulares afetam cerca de 35% dos adultos com mais de 40 anos.```css
/* Define animations normally */
.card {
  animation: slide-up 500ms ease-out;
}

/* Provide alternative for reduced motion */
@media (prefers-reduced-motion: reduce) {
  .card {
    animation: fade-in 200ms ease-out;  /* Crossfade instead of motion */
  }
}

/* Or disable entirely */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
````

**O que preservar**: animações funcionais como barras de progresso, controles giratórios de carregamento (retardados) e indicadores de foco ainda devem funcionar, mas sem movimento espacial.

## Desempenho percebido

**Ninguém se importa com a velocidade do seu site, apenas com o quão rápido ele parece.** A percepção pode ser tão eficaz quanto o desempenho real.

**Limite de 80ms**: Nosso cérebro armazena informações sensoriais por aproximadamente 80ms para sincronizar a percepção. Qualquer coisa abaixo de 80ms parece instantânea e simultânea. Este é o seu alvo para microinterações.

**Tempo ativo versus tempo passivo**: a espera passiva (olhar para um botão giratório) parece mais longa do que o envolvimento ativo. Estratégias para mudar o equilíbrio:

- **Início preventivo**: comece as transições imediatamente durante o carregamento (zoom do aplicativo iOS, UI esqueleto). Os usuários percebem o trabalho acontecendo.
- **Conclusão antecipada**: mostre o conteúdo progressivamente – não espere por tudo. Buffer de vídeo, imagens progressivas, streaming de HTML.
- **IU otimista**: atualize a interface imediatamente, lide com falhas normalmente. O Instagram gosta de trabalhar offline – a IU é atualizada instantaneamente e sincronizada mais tarde. Use para ações de baixo risco; evite para pa

mentos ou operações destrutivas.

**A flexibilização afeta a duração percebida**: a facilitação (aceleração em direção à conclusão) faz com que as tarefas pareçam mais curtas porque o efeito de pico e final pesa muito nos momentos finais. A facilitação parece satisfatória para as entradas, mas a facilitação no final da tarefa comprime o tempo percebido.

**Cuidado**: Respostas muito rápidas podem diminuir o valor percebido. Os usuários podem desconfiar dos resultados instantâneos para operações complexas (pesquisa, análise). Às vezes, um breve atraso indica que “trabalho de verdade” está acontecendo.

## Desempenho

Não use `will-change` preventivamente - apenas quando a animação for iminente (`:hover`, `.animating`). Para animações acionadas por rolagem, use Intersection Observer em vez de eventos de rolagem; desobservar depois de animar uma vez. Crie tokens de movimento para consistência (durações, atenuações, transições comuns).

---

**Evitar**: animar tudo (o cansaço da animação é real). Usando >500 ms para feedback da IU. Ignorando `prefere movimento reduzido`. Usando animação para ocultar o carregamento lento.
