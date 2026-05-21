---
title: Prefira compor crianças em vez de acessórios de renderização
impact: MEDIUM
impactDescription: composição mais limpa, melhor legibilidade
tags: composition, children, render-props
---

## Prefira crianças em vez de acessórios de renderização

Use `children` para composição em vez de adereços `renderX`. As crianças são mais
legível, compõe naturalmente e não requer compreensão de retorno de chamada
assinaturas.

**Incorreto (adereços de renderização):**

```tsx
function Composer({
  renderHeader,
  renderFooter,
  renderActions,
}: {
  renderHeader?: () => React.ReactNode
  renderFooter?: () => React.ReactNode
  renderActions?: () => React.ReactNode
}) {
  return (
    <form>
      {renderHeader?.()}
      <Input />
      {renderFooter ? renderFooter() : <DefaultFooter />}
      {renderActions?.()}
    </form>
  )
}

// Usage is awkward and inflexible
return (
  <Composer
    renderHeader={() => <CustomHeader />}
    renderFooter={() => (
      <>
        <Formatting />
        <Emojis />
      </>
    )}
    renderActions={() => <SubmitButton />}
  />
)
```

**Correto (componentes compostos com filhos):**

```tsx
function ComposerFrame({ children }: { children: React.ReactNode }) {
  return <form>{children}</form>
}

function ComposerFooter({ children }: { children: React.ReactNode }) {
  return <footer className="flex">{children}</footer>
}

// Usage is flexible
return (
  <Composer.Frame>
    <CustomHeader />
    <Composer.Input />
    <Composer.Footer>
      <Composer.Formatting />
      <Composer.Emojis />
      <SubmitButton />
    </Composer.Footer>
  </Composer.Frame>
)
```

**Quando os adereços de renderização são apropriados:**

```tsx
// Render props work well when you need to pass data back
<List data={items} renderItem={({ item, index }) => <Item item={item} index={index} />} />
```

Use adereços de renderização quando o pai precisar fornecer dados ou estado ao filho.
Use filhos ao compor uma estrutura estática.
