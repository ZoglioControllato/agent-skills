# Design de interação

## Os Oito Estados Interativos

Cada elemento interativo precisa destes estados projetados:

| Estado            | Quando                     | Tratamento Visual                |
| ----------------- | -------------------------- | -------------------------------- |
| **Padrão**        | Em repouso                 | Estilo básico                    |
| **Passe o mouse** | Ponteiro sobre (não toque) | Elevação sutil, mudança de cor   |
| **Foco**          | Foco teclado/programático  | Anel visível (ver abaixo)        |
| **Ativo**         | Sendo pressionado          | Pressionado, mais escuro         |
| **Desativado**    | Não interativo             | Opacidade reduzida, sem ponteiro |
| **Carregando**    | Processamento              | Spinner, esqueleto               |
| **Erro**          | Estado inválido            | Ré                               |

borda d, ícone, mensagem |
| **Sucesso** | Concluído | Cheque verde, confirmação |

**O erro comum**: projetar o foco sem foco ou vice-versa. Eles são diferentes. Os usuários de teclado nunca veem estados de foco.

## Anéis de foco: faça-os corretamente

**Nunca `outline: none` sem substituição.** É uma violação de acessibilidade. Em vez disso, use `:focus-visible` para mostrar o foco apenas para usuários de teclado:```css
/_ Hide focus ring for mouse/touch _/
button:focus {
outline: none;
}

/_ Show focus ring for keyboard _/
button:focus-visible {
outline: 2px solid var(--color-accent);
outline-offset: 2px;
}

````

**Design do anel de foco**:
- Alto contraste (mínimo 3:1 contra cores adjacentes)
- 2-3px de espessura
- Deslocamento do elemento (não dentro dele)
- Consistente em todos os elementos interativos

## Design de formulário: o não óbvio

**Espaços reservados não são rótulos** — eles desaparecem na entrada. Sempre use elementos `<label>` visíveis. **Validar no desfoque**, não em cada pressionamento de tecla (exceção: força da senha). Coloque os erros **abaixo** dos campos com `aria-describedby` conectando-os.

## Carregando Estados

**Atualizações otimistas**: mostre sucesso imediatamente e reverta em caso de falha. Use para ações de baixo risco (curtir, seguir), não para pagamentos ou ações destrutivas. **Telas esqueleto > spinners**: elas visualizam a forma do conteúdo e parecem mais rápidas do que spinners genéricos.

## Modais: A Abordagem Inerte

Trapping de foco em modais usados para exigir JavaScript complexo. Agora use o atributo `inert`:```html
<!-- When modal is open -->
<main inert>
  <!-- Content behind modal can't be focused or clicked -->
</main>
<dialog open>
  <h2>Modal Title</h2>
  <!-- Focus stays inside modal -->
</dialog>
````

Ou use o elemento nativo `<dialog>`:```javascript
const dialog = document.querySelector('dialog');
dialog.showModal(); // Opens with focus trap, closes on Escape

````
## A API Popover

Para dicas de ferramentas, menus suspensos e sobreposições não modais, use popovers nativos:```html
<button popovertarget="menu">Open menu</button>
<div id="menu" popover>
  <button>Option 1</button>
  <button>Option 2</button>
</div>
````

**Benefícios**: Light-dismiss (clique fora para fechar), empilhamento adequado, sem guerras de índice z, acessível por padrão.

## Ações Destrutivas: Desfazer > Confirmar

**Desfazer é melhor do que caixas de diálogo de confirmação** — os usuários clicam nas confirmações sem pensar. Remova da interface do usuário imediatamente, mostre desfazer o brinde e exclua depois que o brinde expirar. Utilize a confirmação apenas para ações verdadeiramente irreversíveis (exclusão de conta), ações de alto custo ou operações em lote.

## Padrões de navegação do teclado

### Tabindex itinerante

Para grupos de componentes (guias, itens de menu, grupos de rádio), um item pode ser tabulado; as teclas de seta se movem dentro:```html

<div role="tablist">
  <button role="tab" tabindex="0">Tab 1</button>
  <button role="tab" tabindex="-1">Tab 2</button>
  <button role="tab" tabindex="-1">Tab 3</button>
</div>
```
As teclas de seta movem `tabindex="0"` entre os itens. A guia passa inteiramente para o próximo componente.

### Pular links

Forneça links para pular (`<a href="#main-content">Pular para o conteúdo principal</a>`) para que os usuários do teclado possam pular a navegação. Oculte fora da tela, mostre em foco.

## Descoberta de gestos

Deslizar para excluir e gestos semelhantes são invisíveis. Sugestão de sua existência:

- **Revelar parcialmente**: mostra o botão de exclusão aparecendo na borda
- **Onboarding**: notas do treinador no primeiro uso
- **Alternativa**: Sempre forneça um substituto visível (menu com "Excluir")

Não confie em gestos como única forma de realizar ações.

---

**Evitar**: remover indicadores de foco sem alternativas. Usando texto de espaço reservado como rótulos. Alvos de toque <44x44px. Mensagens de erro genéricas. Controles personalizados sem suporte ARIA/teclado.
