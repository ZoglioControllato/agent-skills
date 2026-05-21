---
title: Importação dinâmica para componentes pesados
impact: CRITICAL
impactDescription: afeta diretamente TTI e LCP
tags: bundle, dynamic-import, code-splitting, next-dynamic
---

## Importação dinâmica para componentes pesados

Use `next/dynamic` para fazer carregamento lento de componentes grandes que não são necessários na renderização inicial.

**Incorreto (Mônaco não vai no chunk principal ~300KB):**

```tsx
import { MonacoEditor } from './monaco-editor'

function CodePanel({ code }: { code: string }) {
  return <MonacoEditor value={code} />
}
```

**Correto (Mônaco carrega sob demanda):**

```tsx
import dynamic from 'next/dynamic'

const MonacoEditor = dynamic(() => import('./monaco-editor').then((m) => m.MonacoEditor), { ssr: false })

function CodePanel({ code }: { code: string }) {
  return <MonacoEditor value={code} />
}
```
