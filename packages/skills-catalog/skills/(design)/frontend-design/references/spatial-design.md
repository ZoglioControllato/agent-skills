# Projeto Espacial

## Sistemas de espaçamento

### Use base de 4 pontos, não 8 pontos

Os sistemas de 8pt são muito grosseiros – você frequentemente precisará de 12px (entre 8 e 16). Use 4pt para granularidade: 4, 8, 12, 16, 24, 32, 48, 64, 96px.

### Nomear tokens semanticamente

Nome por relacionamento (`--space-sm`, `--space-lg`), não por valor (`--spacing-8`). Use `gap` em vez de margens para espaçamento entre irmãos – isso elimina o colapso das margens e hacks de limpeza.

## Sistemas de Rede

### A grade autoajustável

Use `repeat(auto-fit, minmax(280px, 1fr))` para grades responsivas sem pontos de interrupção. As colunas têm pelo menos 280px, quantas couberem por linha, as sobras se estendem. Para layouts complexos, use áreas de grade nomeadas (`grid-template-areas`) e redefina-as em pontos de interrupção.

## Hierarquia Visual

### O teste de estrabismo

Desfoque os olhos (ou faça uma captura de tela e desfoque). Você ainda consegue identificar:

- O elemento mais importante?
- O segundo mais importante?
- Limpar agrupamentos?

Se tudo parecer com o mesmo peso desfocado, você tem um problema de hierarquia.

### Hierarquia por meio de múltiplas dimensões

Não confie apenas no tamanho. Combinar:

| Ferramenta  | Hierarquia Forte             | Hierarquia Fraca |
| ----------- | ---------------------------- | ---------------- |
| **Tamanho** | Proporção de 3:1 ou superior | Proporção <2:1   |
| **Peso**    | Negrito x Regular            | Médio vs Regular |
| **Cor**     | Alto contraste               | Tons semelhantes |
| **Posição** | Superior/esquerda (primário) | Inferior/direita |
| **Espaço**  | Rodeado por espaço em branco | Lotado           |

**A melhor hierarquia usa 2 a 3 dimensões ao mesmo tempo**: um título maior, mais ousado E com mais espaço acima dele.

### Cartões não são necessários

Os cartões são usados ​​em demasia. O espaçamento e o alinhamento criam agrupamento visual naturalmente. Use cartões somente quando o conteúdo for realmente distinto e acionável, os itens precisarem de comparação visual em uma grade ou o conteúdo precisar de limites de interação claros. **Nunca aninhe cartões dentro de cartões** — use espaçamento, tipografia e divisórias sutis para hierarquia dentro de um cartão.

## Consultas de contêiner

As consultas da viewport são para layouts de página. **As consultas de contêiner são para componentes**:```css
.card-container {
container-type: inline-size;
}

.card {
display: grid;
gap: var(--space-md);
}

/_ Card layout changes based on its container, not viewport _/
@container (min-width: 400px) {
.card {
grid-template-columns: 120px 1fr;
}
}

````

**Por que isso é importante**: um cartão em uma barra lateral estreita permanece compacto, enquanto o mesmo cartão em uma área de conteúdo principal se expande — automaticamente, sem hacks na janela de visualização.

## Ajustes ópticos

O texto em `margin-left: 0` parece recuado devido ao espaço em branco do formato da letra - use margem negativa (`-0,05em`) para alinhar opticamente. Os ícones geometricamente centralizados geralmente parecem descentralizados; os ícones de jogo precisam mudar para a direita, as setas mudam em sua direção.

### Alvos de toque versus tamanho visual

Os botões podem parecer pequenos, mas precisam de alvos de toque grandes (mínimo de 44 pixels). Use preenchimento ou pseudoelementos:```css
.icon-button {
  width: 24px;  /* Visual size */
  height: 24px;
  position: relative;
}

.icon-button::before {
  content: '';
  position: absolute;
  inset: -10px;  /* Expand tap target to 44px */
}
````

## Profundidade e elevação

Crie escalas semânticas de índice z (menu suspenso → fixo → cenário modal → modal → brinde → dica de ferramenta) em vez de números arbitrários. Para sombras, crie uma escala de elevação consistente (sm → md → lg → xl). **Princípio principal**: As sombras devem ser sutis. Se você puder vê-las claramente, provavelmente são muito fortes.

---

**Evitar**: valores de espaçamento arbitrários fora da sua escala. Tornar todos os espaçamentos iguais (a variedade cria hierarquia). Criando hierarquia apenas através do tamanho - combine tamanho, peso, cor e espaço.
