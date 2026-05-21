# Design Responsivo

## Mobile First: escreva certo

Comece com estilos básicos para dispositivos móveis, use consultas de largura mínima para aumentar a complexidade. Desktop-first (`max-width`) significa que o celular carrega estilos desnecessários primeiro.

## Pontos de interrupção: orientados ao conteúdo

Não persiga o tamanho dos dispositivos – deixe que o conteúdo lhe diga onde quebrar. Comece estreito, estique até quebrar o design e adicione um ponto de interrupção ali. Três pontos de interrupção geralmente são suficientes (640, 768, 1024px). Use `clamp()` para valores de fluidos sem pontos de interrupção.

## Detecte o método de entrada, não apenas o tamanho da tela

**O tamanho da tela não informa o método de entrada.** Um laptop com tela sensível ao toque, um tablet com teclado – use o ponteiro e passe o mouse sobre consultas:```css
/_ Fine pointer (mouse, trackpad) _/
@media (pointer: fine) {
.button { padding: 8px 16px; }
}

/_ Coarse pointer (touch, stylus) _/
@media (pointer: coarse) {
.button { padding: 12px 20px; } /_ Larger touch target _/
}

/_ Device supports hover _/
@media (hover: hover) {
.card:hover { transform: translateY(-2px); }
}

/_ Device doesn't support hover (touch) _/
@media (hover: none) {
.card { /_ No hover state - use active instead _/ }
}

````

**Crítico**: não confie na funcionalidade do foco. Os usuários de toque não podem passar o mouse.

## Áreas seguras: manuseie o entalhe

Os telefones modernos possuem entalhes, cantos arredondados e indicadores iniciais. Use `env()`:```css
body {
  padding-top: env(safe-area-inset-top);
  padding-bottom: env(safe-area-inset-bottom);
  padding-left: env(safe-area-inset-left);
  padding-right: env(safe-area-inset-right);
}

/* With fallback */
.footer {
  padding-bottom: max(1rem, env(safe-area-inset-bottom));
}
````

**Ative o viewport-fit** na sua meta tag:```html

<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
```
## Imagens responsivas: faça certo

### srcset com descritores de largura```html

<img
src="hero-800.jpg"
srcset="
hero-400.jpg 400w,
hero-800.jpg 800w,
hero-1200.jpg 1200w
"
sizes="(max-width: 768px) 100vw, 50vw"
alt="Hero image"

>

````

**Como funciona**:
- `srcset` lista as imagens disponíveis com suas larguras reais (descritores `w`)
- `sizes` informa ao navegador qual largura a imagem será exibida
- O navegador escolhe o melhor arquivo com base na largura da janela de visualização E na proporção de pixels do dispositivo

### Elemento de imagem para direção de arte

Quando você precisar de diferentes culturas/composições (não apenas resoluções):```html
<picture>
  <source media="(min-width: 768px)" srcset="wide.jpg">
  <source media="(max-width: 767px)" srcset="tall.jpg">
  <img src="fallback.jpg" alt="...">
</picture>
````

## Padrões de Adaptação de Layout

**Navegação**: Três estágios: hambúrguer + gaveta no celular, compacto horizontal no tablet, completo com etiquetas no desktop. **Tabelas**: Transforme em cartões no celular usando os atributos `display: block` e `data-label`. **Divulgação progressiva**: use `<details>/<summary>` para conteúdo que pode ser recolhido em dispositivos móveis.

## Teste: não confie apenas no DevTools

A emulação de dispositivo DevTools é útil para layout, mas falha:

- Interações de toque reais
- Restrições reais de CPU/memória
- Padrões de latência de rede
- Diferenças de renderização de fontes
- Aparências de cromo/teclado do navegador

**Teste em pelo menos**: Um iPhone real, um Android real, um tablet, se for o caso. Telefones Android baratos revelam problemas de desempenho que você nunca verá em simuladores.

---

**Evitar**: design que prioriza o desktop. Detecção de dispositivos em vez de detecção de recursos. Bases de código separadas para dispositivos móveis/desktop. Ignorando tablet e paisagem. Supondo que todos os dispositivos móveis sejam poderosos.
