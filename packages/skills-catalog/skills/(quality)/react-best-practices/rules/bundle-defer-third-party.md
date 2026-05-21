---
title: Adie bibliotecas de terceiros não críticas
impact: MEDIUM
impactDescription: carrega após a hidratação
tags: bundle, third-party, analytics, defer
---

## Adie bibliotecas de terceiros não críticas

Analytics, registro e rastreamento de erros não precisam bloquear a interação. Carregue-as após a hidratação.

**Incorreto (bloqueia o pacote inicial):**

```tsx
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```

**Correto (carregamento após a hidratação):**

```tsx
import dynamic from 'next/dynamic'

const Analytics = dynamic(() => import('@vercel/analytics/react').then((m) => m.Analytics), { ssr: false })

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```
