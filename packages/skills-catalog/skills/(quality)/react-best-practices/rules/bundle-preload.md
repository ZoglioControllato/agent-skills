---
title: Pré-carregamento baseado na intenção do usuário
impact: MEDIUM
impactDescription: reduz latência percebida
tags: bundle, preload, user-intent, hover
---

## Pré-carregamento baseado na intenção do usuário

Pré-carregue pacotes pesados antes de serem necessários para reduzir a latência percebida.

**Exemplo (pré-carregar em hover/focus):**

```tsx
function EditorButton({ onClick }: { onClick: () => void }) {
  const preload = () => {
    if (typeof window !== 'undefined') {
      void import('./monaco-editor')
    }
  }

  return (
    <button onMouseEnter={preload} onFocus={preload} onClick={onClick}>
      Open Editor
    </button>
  )
}
```

**Exemplo (pré-carregar quando o sinalizador de recurso está ativado):**

```tsx
function FlagsProvider({ children, flags }: Props) {
  useEffect(() => {
    if (flags.editorEnabled && typeof window !== 'undefined') {
      void import('./monaco-editor').then((mod) => mod.init())
    }
  }, [flags.editorEnabled])

  return <FlagsContext.Provider value={flags}>{children}</FlagsContext.Provider>
}
```

A seleção `typeof window !== 'undefined'` evita empacotador de módulos pré-carregados para SSR, otimizando o pacote do servidor e a velocidade de construção.
