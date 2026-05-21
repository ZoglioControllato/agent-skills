# Otimização do tamanho do pacote

## Índice

- [Ferramentas de análise](#ferramentas-de-análise)
- [Dependências pesadas](#dependências-pesadas)
- [Divisão de código](#divisão-de-código)
- [Tree-shaking](#tree-shaking)

---

## Ferramentas de análise

```bash
# Webpack — gera treemap interativo
npx webpack-bundle-analyzer dist/stats.json

# Gere o stats primeiro
webpack --profile --json > dist/stats.json

# Vite
npx vite-bundle-visualizer

# Source map explorer
npx source-map-explorer dist/**/*.js

# Confira o tamanho do pacote antes de adicionar
npx bundlephobia lodash
```

---

## Dependências pesadas

### moment → date-fns / dayjs

```javascript
// Antes: moment (67 KB)
import moment from 'moment'
moment(date).format('YYYY-MM-DD')

// Depois: date-fns (tree-shakeable, ~2 KB por função)
import { format } from 'date-fns'
format(date, 'yyyy-MM-dd')

// Depois: dayjs (~2 KB total, API parecida com moment)
import dayjs from 'dayjs'
dayjs(date).format('YYYY-MM-DD')
```

### lodash → cherry-pick ou nativo

```javascript
// Antes: lodash inteiro (72 KB)
import _ from 'lodash'
_.uniq(array)
_.debounce(fn, 300)

// Depois: cherry-pick (~2 KB cada)
import uniq from 'lodash/uniq'
import debounce from 'lodash/debounce'

// Depois: nativo
;[...new Set(array)] // único
// debounce: custom ou lodash-es/debounce
```

### Outras trocas comuns

| Pesado              | Alternativa leve                |
| ------------------- | ------------------------------- |
| `axios` (13 KB)     | `fetch` (nativo) ou `ky` (3 KB) |
| `uuid` (4 KB)       | `crypto.randomUUID()` (nativo)  |
| `classnames` (1 KB) | template literals               |

---

## Divisão de código

### React.lazy

```javascript
import { lazy, Suspense } from 'react'

const Chart = lazy(() => import('./Chart'))
const AdminPanel = lazy(() => import('./AdminPanel'))

function App() {
  return (
    <Suspense fallback={<Loading />}>
      {showChart && <Chart />}
      {isAdmin && <AdminPanel />}
    </Suspense>
  )
}
```

### Next.js dynamic

```javascript
import dynamic from 'next/dynamic'

// Componente só no cliente
const Map = dynamic(() => import('./Map'), { ssr: false })

// Com estado de carregamento
const Chart = dynamic(() => import('./Chart'), {
  loading: () => <Skeleton height={300} />,
})
```

### Divisão por rota (automática na maioria dos frameworks)

```javascript
// Next.js — cada página vira um chunk
// pages/dashboard.js → chunks/pages/dashboard.js
// pages/admin.js → chunks/pages/admin.js

// React Router com lazy
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Admin = lazy(() => import('./pages/Admin'))
```

### Chunks manuais (Vite / Rollup)

```javascript
// vite.config.js
export default {
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          charts: ['recharts', 'd3'],
        },
      },
    },
  },
}
```

---

## Tree-shaking

### Habilitar no webpack

```javascript
// webpack.config.js
module.exports = {
  mode: 'production', // habilita tree-shaking
  optimization: {
    usedExports: true,
    sideEffects: true,
  },
}
```

### Marcar pacote como sem efeitos colaterais

```json
// package.json
{
  "sideEffects": false
}
```

Ou liste arquivos com efeitos:

```json
{
  "sideEffects": ["*.css", "*.scss"]
}
```

### Escreva módulos que possam ser “tree-shaken”

```javascript
// Ruim: export default de objeto
export default { foo, bar, baz }

// Bom: named exports
export { foo, bar, baz }
```
