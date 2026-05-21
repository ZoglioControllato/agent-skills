---
title: Evite-os através de arquivos de barril
impact: CRITICAL
impactDescription: custo de importação 200–800ms, builds lentos
tags: bundle, imports, tree-shaking, barrel-files, performance
---

## Evite visitas via arquivos de barril

Importe diretamente dos arquivos-fonte em vez de barril para evitar o carregamento de milhares de módulos não usados. **Arquivos barril** são pontos de entrada que reexportam vários módulos (por exemplo, `index.js` com `export * from './module'`).

Bibliotecas populares de ícones e componentes podem ter **até 10.000 reexportações** no arquivo de entrada. Em muitos pacotes React, **só importam leva 200–800ms**, afetando a velocidade de desenvolvimento e partidas a frio em produção.

**Por que tree-shaking não ajuda:** quando uma biblioteca é marcada como externa (não embalada), o bundler não consegue melhorar. Se você empacotador para habilitar tree-shaking, os builds ficam bem mais lentos ao analisar o gráfico inteiro de módulos.

**Incorreto (importado para biblioteca inteira):**

```tsx
import { Check, X, Menu } from 'lucide-react'
// Loads 1,583 modules, takes ~2.8s extra in dev
// Runtime cost: 200-800ms on every cold start

import { Button, TextField } from '@mui/material'
// Loads 2,225 modules, takes ~4.2s extra in dev
```

**Correto (importa só o necessário):**

```tsx
import Check from 'lucide-react/dist/esm/icons/check'
import X from 'lucide-react/dist/esm/icons/x'
import Menu from 'lucide-react/dist/esm/icons/menu'
// Loads only 3 modules (~2KB vs ~1MB)

import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
// Loads only what you use
```

**Alternativa (Next.js 13.5+):**

```js
// next.config.js - use optimizePackageImports
module.exports = {
  experimental: {
    optimizePackageImports: ['lucide-react', '@mui/material'],
  },
}

// Then you can keep the ergonomic barrel imports:
import { Check, X, Menu } from 'lucide-react'
// Automatically transformed to direct imports at build time
```

Importações diretas trazem boot de dev 15–70% mais rápido, builds ~28% mais rápidos, coldstarts ~40% mais rápidos e HMR bem mais ágil.

Bibliotecas frequentemente afetadas: `lucide-react`, `@mui/material`, `@mui/icons-material`, `@tabler/icons-react`, `react-icons`, `@headlessui/react`, `@radix-ui/react-*`, `lodash`, `ramda`, `date-fns`, `rxjs`, `react-use`.

Referência: [Como otimizamos importações de pacotes em Next.js](https://vercel.com/blog/how-we-optimized-package-imports-in-next-js)
