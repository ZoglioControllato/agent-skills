---
title: Evite destruição de layout
impact: MEDIUM
impactDescription: evita layouts síncronos forçados e reduz gargalos
tags: javascript, dom, css, performance, reflow, layout-thrashing
---

## Evite destruição de layout

Evite intercalar escrita de estilos com leitura de layout. Ao ler uma propriedade de layout (como `offsetWidth`, `getBoundingClientRect()` ou `getComputedStyle()`) entre mudanças de estilo, o navegador é obrigado a disparar um refluxo síncrono.

**Isto é aceitável (o navegador agrupa mudanças de estilo):**

```typescript
function updateElementStyles(element: HTMLElement) {
  // Each line invalidates style, but browser batches the recalculation
  element.style.width = '100px'
  element.style.height = '200px'
  element.style.backgroundColor = 'blue'
  element.style.border = '1px solid black'
}
```

**Incorreto (leituras e escritas intercaladas forçam refluxos):**

```typescript
function layoutThrashing(element: HTMLElement) {
  element.style.width = '100px'
  const width = element.offsetWidth // Forces reflow
  element.style.height = '200px'
  const height = element.offsetHeight // Forces another reflow
}
```

**Correto (agrupa escritas e lê uma vez):**

```typescript
function updateElementStyles(element: HTMLElement) {
  // Batch all writes together
  element.style.width = '100px'
  element.style.height = '200px'
  element.style.backgroundColor = 'blue'
  element.style.border = '1px solid black'

  // Read after all writes are done (single reflow)
  const { width, height } = element.getBoundingClientRect()
}
```

**Correto (agrupa leituras e depois escritas):**

```typescript
function avoidThrashing(element: HTMLElement) {
  // Read phase - all layout queries first
  const rect1 = element.getBoundingClientRect()
  const offsetWidth = element.offsetWidth
  const offsetHeight = element.offsetHeight

  // Write phase - all style changes after
  element.style.width = '100px'
  element.style.height = '200px'
}
```

**Melhor: use classes CSS**

```css
.highlighted-box {
  width: 100px;
  height: 200px;
  background-color: blue;
  border: 1px solid black;
}
```

```typescript
function updateElementStyles(element: HTMLElement) {
  element.classList.add('highlighted-box')

  const { width, height } = element.getBoundingClientRect()
}
```

**Exemplo de reação:**

```tsx
// Incorrect: interleaving style changes with layout queries
function Box({ isHighlighted }: { isHighlighted: boolean }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (ref.current && isHighlighted) {
      ref.current.style.width = '100px'
      const width = ref.current.offsetWidth // Forces layout
      ref.current.style.height = '200px'
    }
  }, [isHighlighted])

  return <div ref={ref}>Content</div>
}

// Correct: toggle class
function Box({ isHighlighted }: { isHighlighted: boolean }) {
  return <div className={isHighlighted ? 'highlighted-box' : ''}>Content</div>
}
```

Prefira classes CSS a estilos inline quando possível. Os arquivos CSS ficam em cache no navegador e as classes melhoram separação de responsabilidades e manutenção.

Veja [this gist](https://gist.github.com/paulirish/5d52fb081b3570c81e3a) e [CSS Triggers](https://csstriggers.com/) para mais detalhes sobre operações que forçam layout.
