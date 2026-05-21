# React Best Practices

**Versão 1.0.0**  
Engenharia Vercel  
Janeiro de 2026  

Curadoria e harmonização desta versão em português brasileiro pela comunidade **Controllato Club**, no ecossistema agent-skills.

> **Nota:**  
> Este documento é voltado sobretudo a agentes e LLMs que mantêm, geram ou
> refatoram bases de código em React e Next.js. Humanos também podem achá‑lo útil,
> mas a orientação foi pensada para automação e consistência em fluxos assistidos por IA.

---

## Resumo

Guia abrangente de otimização de desempenho para aplicativos React e Next.js, projetado para agentes de IA e LLMs. Contém mais de 40 regras em 8 categorias, priorizadas por impacto, desde críticas (eliminando cascatas, reduzindo o tamanho do pacote) até incrementais (padrões avançados). Cada regra inclui explicações detalhadas, exemplos reais comparando implementações incorretas e corretas e métricas de impacto específicas para orientar a refatoração automatizada e a geração de código.

---

## Índice

1. [Eliminando waterfalls (efeito cascata em rede)](#1-eliminating-waterfalls) — **CRÍTICO**
   - 1.1 [Adiar `await` até ser necessário](#11-defer-await-until-needed)
   - 1.2 [Paralelização guiada por dependências](#12-dependency-based-parallelization)
   - 1.3 [Evitar cadeias de waterfall em rotas de API](#13-prevent-waterfall-chains-in-api-routes)
   - 1.4 [`Promise.all()` para operações independentes](#14-promiseall-for-independent-operations)
   - 1.5 [Limites de Suspense bem posicionados](#15-strategic-suspense-boundaries)
2. [Otimização do tamanho do bundle](#2-bundle-size-optimization) — **CRÍTICO**
   - 2.1 [Evitar imports de arquivo barril (`barrel`)](#21-avoid-barrel-file-imports)
   - 2.2 [Carregar módulos sob condição](#22-conditional-module-loading)
   - 2.3 [Adiar bibliotecas de terceiros não essenciais](#23-defer-non-critical-third-party-libraries)
   - 2.4 [Imports dinâmicos para componentes pesados](#24-dynamic-imports-for-heavy-components)
   - 2.5 [Pré-carregar conforme intenção do usuário](#25-preload-based-on-user-intent)
3. [Desempenho no servidor](#3-server-side-performance) — **ALTO**
   - 3.1 [Autenticar Server Actions como rotas de API](#31-authenticate-server-actions-like-api-routes)
   - 3.2 [Evitar serialização duplicada em props de RSC](#32-avoid-duplicate-serialization-in-rsc-props)
   - 3.3 [Cache LRU entre requisições](#33-cross-request-lru-caching)
   - 3.4 [Minimizar serialização nos limites de RSC](#34-minimize-serialization-at-rsc-boundaries)
   - 3.5 [Fetch paralelo com composição de componentes](#35-parallel-data-fetching-with-component-composition)
   - 3.6 [Deduplicação por requisição com `React.cache()`](#36-per-request-deduplication-with-reactcache)
   - 3.7 [Usar `after()` para operações não bloqueantes](#37-use-after-for-non-blocking-operations)
4. [Busca de dados no cliente](#4-client-side-data-fetching) — **MÉDIO-ALTO**
   - 4.1 [Deduplicar listeners globais](#41-deduplicate-global-event-listeners)
   - 4.2 [Listeners passivos para desempenho de rolagem](#42-use-passive-event-listeners-for-scrolling-performance)
   - 4.3 [SWR para deduplicação automática](#43-use-swr-for-automatic-deduplication)
   - 4.4 [Versionar e minimizar dados no `localStorage`](#44-version-and-minimize-localstorage-data)
5. [Otimização de re-renderização](#5-re-render-optimization) — **MÉDIO**
   - 5.1 [Calcular estado derivado durante o render](#51-calculate-derived-state-during-rendering)
   - 5.2 [Adiar leituras de estado ao ponto de uso](#52-defer-state-reads-to-usage-point)
   - 5.3 [Não embrulhar expressão primitiva simples em `useMemo`](#53-do-not-wrap-a-simple-expression-with-a-primitive-result-type-in-usememo)
   - 5.4 [Extrair valor não primitivo padrão do componente memoizado para constante](#54-extract-default-non-primitive-parameter-value-from-memoized-component-to-constant)
   - 5.5 [Extrair para componentes memoizados](#55-extract-to-memoized-components)
   - 5.6 [Restringir dependências de effects](#56-narrow-effect-dependencies)
   - 5.7 [Colocar lógica de interação em handlers de evento](#57-put-interaction-logic-in-event-handlers)
   - 5.8 [Observar estado derivado](#58-subscribe-to-derived-state)
   - 5.9 [Atualizações funcionais de `setState`](#59-use-functional-setstate-updates)
   - 5.10 [Inicialização preguiçosa de estado (`lazy`)](#510-use-lazy-state-initialization)
   - 5.11 [Transitions para atualizações não urgentes](#511-use-transitions-for-non-urgent-updates)
   - 5.12 [`useRef` para valores transientes](#512-use-useref-for-transient-values)
6. [Desempenho de renderização](#6-rendering-performance) — **MÉDIO**
   - 6.1 [Animar o wrapper do SVG, não o SVG](#61-animate-svg-wrapper-instead-of-svg-element)
   - 6.2 [`content-visibility` em listas longas](#62-css-content-visibility-for-long-lists)
   - 6.3 [Elevar JSX estático (hoist)](#63-hoist-static-jsx-elements)
   - 6.4 [Precisão de paths em SVG](#64-optimize-svg-precision)
   - 6.5 [Evitar inconsistência de hidratação sem flicker](#65-prevent-hydration-mismatch-without-flickering)
   - 6.6 [Suprimir divergências de hidratação esperadas](#66-suppress-expected-hydration-mismatches)
   - 6.7 [`Activity` para alternar visibilidade](#67-use-activity-component-for-showhide)
   - 6.8 [Condicionais explícitas no JSX](#68-use-explicit-conditional-rendering)
   - 6.9 [`useTransition` em vez de loading manual](#69-use-usetransition-over-manual-loading-states)
7. [Desempenho em JavaScript](#7-javascript-performance) — **BAIXO-MÉDIO**
   - 7.1 [Evitar layout thrashing](#71-avoid-layout-thrashing)
   - 7.2 [Mapas índice para buscas repetidas](#72-build-index-maps-for-repeated-lookups)
   - 7.3 [Cache de acesso a propriedades em loops](#73-cache-property-access-in-loops)
   - 7.4 [Cache de chamadas de função repetidas](#74-cache-repeated-function-calls)
   - 7.5 [Cache de chamadas à API de armazenamento](#75-cache-storage-api-calls)
   - 7.6 [Unificar múltiplas passagens sobre arrays](#76-combine-multiple-array-iterations)
   - 7.7 [Checar tamanho antes de comparar arrays caros](#77-early-length-check-for-array-comparisons)
   - 7.8 [Retorno antecipado em funções](#78-early-return-from-functions)
   - 7.9 [Extrair criação de `RegExp` (hoist)](#79-hoist-regexp-creation)
   - 7.10 [Loop para min/max em vez de ordenar](#710-use-loop-for-minmax-instead-of-sort)
   - 7.11 [`Set`/`Map` para buscas em O(1)](#711-use-setmap-for-o1-lookups)
   - 7.12 [`toSorted()` para imutabilidade (em vez de `sort()`)](#712-use-tosorted-instead-of-sort-for-immutability)
8. [Padrões avançados](#8-advanced-patterns) — **BAIXO**
   - 8.1 [Inicializar o app uma vez, não por `mount`](#81-initialize-app-once-not-per-mount)
   - 8.2 [Manter callbacks de evento em `ref`](#82-store-event-handlers-in-refs)
   - 8.3 [`useEffectEvent` para referências estáveis de callback](#83-useeffectevent-for-stable-callback-refs)

---

## 1. Eliminating Waterfalls

**Impacto: CRÍTICO**

Efeitos cascata (waterfalls) são o assassino número 1 do desempenho. Cada espera sequencial adiciona latência total da rede. Eliminá-los produz os maiores ganhos.

### 1.1 Defer Await Until Needed

**Impacto: ALTO (evita bloquear caminhos de código não utilizados)**

Mova as operações `await` para as ramificações onde elas são realmente usadas para evitar o bloqueio de caminhos de código que não precisam delas.

**Incorreto: bloqueia ambas as ramificações**

```typescript
async function handleRequest(userId: string, skipProcessing: boolean) {
  const userData = await fetchUserData(userId)

  if (skipProcessing) {
    // Returns immediately but still waited for userData
    return { skipped: true }
  }

  // Only this branch uses userData
  return processUserData(userData)
}
```

**Correto: bloqueia apenas quando necessário**

```typescript
async function handleRequest(userId: string, skipProcessing: boolean) {
  if (skipProcessing) {
    // Returns immediately without waiting
    return { skipped: true }
  }

  // Fetch only when needed
  const userData = await fetchUserData(userId)
  return processUserData(userData)
}
```

**Outro exemplo: otimização de retorno antecipado**

```typescript
// Incorrect: always fetches permissions
async function updateResource(resourceId: string, userId: string) {
  const permissions = await fetchPermissions(userId)
  const resource = await getResource(resourceId)

  if (!resource) {
    return { error: 'Not found' }
  }

  if (!permissions.canEdit) {
    return { error: 'Forbidden' }
  }

  return await updateResourceData(resource, permissions)
}

// Correct: fetches only when needed
async function updateResource(resourceId: string, userId: string) {
  const resource = await getResource(resourceId)

  if (!resource) {
    return { error: 'Not found' }
  }

  const permissions = await fetchPermissions(userId)

  if (!permissions.canEdit) {
    return { error: 'Forbidden' }
  }

  return await updateResourceData(resource, permissions)
}
```

Essa otimização é especialmente valiosa quando a ramificação ignorada é usada com frequência ou quando a operação adiada é cara.

### 1.2 Dependency-Based Parallelization

**Impacto: CRÍTICO (melhoria de 2 a 10×)**

Para operações com dependências parciais, use `better-all` para maximizar o paralelismo. Ele inicia automaticamente cada tarefa o mais cedo possível.

**Incorreto: perfil aguarda configuração desnecessariamente**

```typescript
const [user, config] = await Promise.all([fetchUser(), fetchConfig()])
const profile = await fetchProfile(user.id)
```

**Correto: configuração e perfil são executados em paralelo**

```typescript
import { all } from 'better-all'

const { user, config, profile } = await all({
  async user() {
    return fetchUser()
  },
  async config() {
    return fetchConfig()
  },
  async profile() {
    return fetchProfile((await this.$.user).id)
  },
})
```

**Alternativa sem dependências extras:**

```typescript
const userPromise = fetchUser()
const profilePromise = userPromise.then((user) => fetchProfile(user.id))

const [user, config, profile] = await Promise.all([userPromise, fetchConfig(), profilePromise])
```

Também podemos criar todas as promessas primeiro e fazer `Promise.all()` no final.

Referência: [https://github.com/shuding/better-all](https://github.com/shuding/better-all)

### 1.3 Prevent Waterfall Chains in API Routes

**Impacto: CRÍTICO (melhoria de 2 a 10×)**

Nas rotas API e Ações do Servidor, inicie operações independentes imediatamente, mesmo que ainda não as espere.

**Incorreto: a configuração aguarda autenticação, os dados aguardam ambos**

```typescript
export async function GET(request: Request) {
  const session = await auth()
  const config = await fetchConfig()
  const data = await fetchData(session.user.id)
  return Response.json({ data, config })
}
```

**Correto: autenticação e configuração iniciam imediatamente**

```typescript
export async function GET(request: Request) {
  const sessionPromise = auth()
  const configPromise = fetchConfig()
  const session = await sessionPromise
  const [config, data] = await Promise.all([configPromise, fetchData(session.user.id)])
  return Response.json({ data, config })
}
```

Para operações com cadeias de dependências mais complexas, use `better-all` para maximizar automaticamente o paralelismo (consulte Paralelização Baseada em Dependência).

### 1.4 Promise.all() for Independent Operations

**Impacto: CRÍTICO (melhoria de 2 a 10×)**

Quando as operações assíncronas não têm interdependências, execute-as simultaneamente usando `Promise.all()`.

**Incorreto: execução sequencial, 3 viagens de ida e volta**

```typescript
const user = await fetchUser()
const posts = await fetchPosts()
const comments = await fetchComments()
```

**Correto: execução paralela, 1 ida e volta**

```typescript
const [user, posts, comments] = await Promise.all([fetchUser(), fetchPosts(), fetchComments()])
```

### 1.5 Strategic Suspense Boundaries

**Impacto: ALTO (pintura inicial mais rápida)**

Em vez de aguardar dados em componentes assíncronos antes de retornar JSX, use limites Suspense para mostrar a UI do wrapper mais rapidamente enquanto os dados são carregados.

**Incorreto: wrapper bloqueado pela busca de dados**

```tsx
async function Page() {
  const data = await fetchData() // Blocks entire page

  return (
    <div>
      <div>Sidebar</div>
      <div>Header</div>
      <div>
        <DataDisplay data={data} />
      </div>
      <div>Footer</div>
    </div>
  )
}
```

Todo o layout aguarda dados, mesmo que apenas a seção intermediária precise deles.

**Correto: o wrapper é exibido imediatamente, os fluxos de dados entram**

```tsx
function Page() {
  return (
    <div>
      <div>Sidebar</div>
      <div>Header</div>
      <div>
        <Suspense fallback={<Skeleton />}>
          <DataDisplay />
        </Suspense>
      </div>
      <div>Footer</div>
    </div>
  )
}

async function DataDisplay() {
  const data = await fetchData() // Only blocks this component
  return <div>{data.content}</div>
}
```

Barra lateral, cabeçalho e rodapé são renderizados imediatamente. Apenas DataDisplay aguarda dados.

**Alternativa: compartilhar promessas entre componentes**

```tsx
function Page() {
  // Start fetch immediately, but don't await
  const dataPromise = fetchData()

  return (
    <div>
      <div>Sidebar</div>
      <div>Header</div>
      <Suspense fallback={<Skeleton />}>
        <DataDisplay dataPromise={dataPromise} />
        <DataSummary dataPromise={dataPromise} />
      </Suspense>
      <div>Footer</div>
    </div>
  )
}

function DataDisplay({ dataPromise }: { dataPromise: Promise<Data> }) {
  const data = use(dataPromise) // Unwraps the promise
  return <div>{data.content}</div>
}

function DataSummary({ dataPromise }: { dataPromise: Promise<Data> }) {
  const data = use(dataPromise) // Reuses the same promise
  return <div>{data.summary}</div>
}
```

Ambos os componentes compartilham a mesma promessa, portanto ocorre apenas uma busca. O layout é renderizado imediatamente enquanto ambos os componentes aguardam juntos.

**Quando NÃO usar este padrão:**

- Dados críticos necessários para decisões de layout (afeta o posicionamento)

- Conteúdo crítico de SEO acima da dobra

- Consultas pequenas e rápidas onde a sobrecarga de suspense não vale a pena

- Quando você deseja evitar mudanças de layout (carregamento → salto de conteúdo)

**Compensação:** Pintura inicial mais rápida versus possível mudança de layout. Escolha com base em suas prioridades de UX.

---

## 2. Bundle Size Optimization

**Impacto: CRÍTICO**

A redução do tamanho inicial do pacote melhora o tempo para pintura interativa e com maior conteúdo.

### 2.1 Avoid Barrel File Imports

**Impacto: CRÍTICO (custo de importação de 200 a 800 ms, construções lentas)**

Importe diretamente de arquivos de origem em vez de arquivos barril para evitar o carregamento de milhares de módulos não utilizados. **Arquivos barril** são pontos de entrada que reexportam vários módulos (por exemplo, `index.js` que faz `export * from './module'`).

Bibliotecas populares de ícones e componentes podem ter **até 10.000 reexportações** em seu arquivo de entrada. Para muitos pacotes React, **leva de 200 a 800ms apenas para importá-los**, afetando tanto a velocidade de desenvolvimento quanto a inicialização a frio da produção.

**Por que a agitação da árvore não ajuda:** Quando uma biblioteca é marcada como externa (não empacotada), o empacotador não pode otimizá-la. Se você agrupá-lo para permitir a agitação da árvore, as compilações se tornarão substancialmente mais lentas na análise de todo o gráfico do módulo.

**Incorreto: importa a biblioteca inteira**

```tsx
import { Check, X, Menu } from 'lucide-react'
// Loads 1,583 modules, takes ~2.8s extra in dev
// Runtime cost: 200-800ms on every cold start

import { Button, TextField } from '@mui/material'
// Loads 2,225 modules, takes ~4.2s extra in dev
```

**Correto: importa apenas o que você precisa**

```tsx
import Check from 'lucide-react/dist/esm/icons/check'
import X from 'lucide-react/dist/esm/icons/x'
import Menu from 'lucide-react/dist/esm/icons/menu'
// Loads only 3 modules (~2KB vs ~1MB)

import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
// Loads only what you use
```

**Alternativa: Next.js 13.5+**

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

As importações diretas fornecem inicialização de desenvolvimento 15-70% mais rápida, compilações 28% mais rápidas, inicializações a frio 40% mais rápidas e HMR significativamente mais rápido.

Bibliotecas comumente afetadas: `lucide-react`, `@mui/material`, `@mui/icons-material`, `@tabler/icons-react`, `react-icons`, `@headlessui/react`, `@radix-ui/react-*`, `lodash`, `ramda`, `date-fns`, `rxjs`, `react-use`.

Referência: [https://vercel.com/blog/how-we-optimized-package-imports-in-next-js](https://vercel.com/blog/how-we-optimized-package-imports-in-next-js)

### 2.2 Conditional Module Loading

**Impacto: ALTO (carrega dados grandes somente quando necessário)**

Carregue grandes dados ou módulos somente quando um recurso estiver ativado.

**Exemplo: quadros de animação de carregamento lento**

```tsx
function AnimationPlayer({
  enabled,
  setEnabled,
}: {
  enabled: boolean
  setEnabled: React.Dispatch<React.SetStateAction<boolean>>
}) {
  const [frames, setFrames] = useState<Frame[] | null>(null)

  useEffect(() => {
    if (enabled && !frames && typeof window !== 'undefined') {
      import('./animation-frames.js').then((mod) => setFrames(mod.frames)).catch(() => setEnabled(false))
    }
  }, [enabled, frames, setEnabled])

  if (!frames) return <Skeleton />
  return <Canvas frames={frames} />
}
```

A verificação `typeof window !== 'undefined'` impede o empacotamento deste módulo para SSR, otimizando o tamanho do pacote do servidor e a velocidade de construção.

### 2.3 Defer Non-Critical Third-Party Libraries

**Impacto: MÉDIO (cargas após hidratação)**

Análise, registro e rastreamento de erros não bloqueiam a interação do usuário. Carregue-os após a hidratação.

**Incorreto: bloqueia o pacote inicial**

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

**Correto: cargas após hidratação**

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

### 2.4 Dynamic Imports for Heavy Components

**Impacto: CRÍTICO (afeta diretamente TTI e LCP)**

Com `next/dynamic`, carregue lentamente componentes grandes dispensáveis na renderização inicial.

**Incorreto: pacotes Monaco com bloco principal de aproximadamente 300 KB**

```tsx
import { MonacoEditor } from './monaco-editor'

function CodePanel({ code }: { code: string }) {
  return <MonacoEditor value={code} />
}
```

**Correto: Mônaco carrega sob demanda**

```tsx
import dynamic from 'next/dynamic'

const MonacoEditor = dynamic(() => import('./monaco-editor').then((m) => m.MonacoEditor), { ssr: false })

function CodePanel({ code }: { code: string }) {
  return <MonacoEditor value={code} />
}
```

### 2.5 Preload Based on User Intent

**Impacto: MÉDIO (reduz a latência percebida)**

Pré-carregue pacotes pesados ​​antes que eles sejam necessários para reduzir a latência percebida.

**Exemplo: pré-carregamento em hover/focus**

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

**Exemplo: pré-carregamento quando o sinalizador de recurso está ativado**

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

A verificação `typeof window !== 'undefined'` impede o agrupamento de módulos pré-carregados para SSR, otimizando o tamanho do pacote do servidor e a velocidade de construção.

---

## 3. Server-Side Performance

**Impacto: ALTO**

A otimização da renderização e da busca de dados no lado do servidor elimina cascatas no lado do servidor e reduz os tempos de resposta.

### 3.1 Authenticate Server Actions Like API Routes

**Impacto: CRÍTICO (evita acesso não autorizado a mutações do servidor)**

As ações do servidor (funções com `"use server"`) são expostas como endpoints públicos, assim como as rotas da API. Sempre verifique a autenticação e a autorização **dentro** de cada Ação do Servidor — não confie apenas em middleware, proteções de layout ou verificações no nível da página, pois as Ações do Servidor podem ser invocadas diretamente.

A documentação do Next.js afirma explicitamente: "Trate as ações do servidor com as mesmas considerações de segurança que os endpoints da API voltados para o público e verifique se o usuário tem permissão para realizar uma mutação."

**Incorreto: sem verificação de autenticação**

```typescript
'use server'

export async function deleteUser(userId: string) {
  // Anyone can call this! No auth check
  await db.user.delete({ where: { id: userId } })
  return { success: true }
}
```

**Correto: autenticação dentro da ação**

```typescript
'use server'

import { verifySession } from '@/lib/auth'
import { unauthorized } from '@/lib/errors'

export async function deleteUser(userId: string) {
  // Always check auth inside the action
  const session = await verifySession()

  if (!session) {
    throw unauthorized('Must be logged in')
  }

  // Check authorization too
  if (session.user.role !== 'admin' && session.user.id !== userId) {
    throw unauthorized('Cannot delete other users')
  }

  await db.user.delete({ where: { id: userId } })
  return { success: true }
}
```

**Com validação de entrada:**

```typescript
'use server'

import { verifySession } from '@/lib/auth'
import { z } from 'zod'

const updateProfileSchema = z.object({
  userId: z.string().uuid(),
  name: z.string().min(1).max(100),
  email: z.string().email(),
})

export async function updateProfile(data: unknown) {
  // Validate input first
  const validated = updateProfileSchema.parse(data)

  // Then authenticate
  const session = await verifySession()
  if (!session) {
    throw new Error('Unauthorized')
  }

  // Then authorize
  if (session.user.id !== validated.userId) {
    throw new Error('Can only update own profile')
  }

  // Finally perform the mutation
  await db.user.update({
    where: { id: validated.userId },
    data: {
      name: validated.name,
      email: validated.email,
    },
  })

  return { success: true }
}
```

Referência: [https://nextjs.org/docs/app/guides/authentication](https://nextjs.org/docs/app/guides/authentication)

### 3.2 Avoid Duplicate Serialization in RSC Props

**Impacto: BAIXO (reduz a carga útil da rede evitando serialização duplicada)**

A serialização RSC→cliente desduplica por referência de objeto, não por valor. Mesma referência = serializada uma vez; nova referência = serializada novamente. Faça transformações (`.toSorted()`, `.filter()`, `.map()`) no cliente, não no servidor.

**Incorreto: array duplicado**

```tsx
// RSC: sends 6 strings (2 arrays × 3 items)
<ClientList usernames={usernames} usernamesOrdered={usernames.toSorted()} />
```

**Correto: envia 3 strings**

```tsx
// RSC: send once
;<ClientList usernames={usernames} />

// Client: transform there
;('use client')
const sorted = useMemo(() => [...usernames].sort(), [usernames])
```

**Comportamento de desduplicação aninhada:**

```tsx
// string[] - duplicates everything
usernames={['a','b']} sorted={usernames.toSorted()} // sends 4 strings

// object[] - duplicates array structure only
users={[{id:1},{id:2}]} sorted={users.toSorted()} // sends 2 arrays + 2 unique objects (not 4)
```

A desduplicação funciona recursivamente. O impacto varia de acordo com o tipo de dados:

- `string[]`, `number[]`, `boolean[]`: **ALTO impacto** - array + todas as primitivas totalmente duplicadas

- `object[]`: **BAIXO impacto** - matriz duplicada, mas objetos aninhados desduplicados por referência

**Operações que interrompem a desduplicação: crie novas referências**

- Matrizes: `.toSorted()`, `.filter()`, `.map()`, `.slice()`, `[...arr]`

- Objetos: `{...obj}`, `Object.assign()`, `structuredClone()`, `JSON.parse(JSON.stringify())`

**Mais exemplos:**

```tsx
// ❌ Bad
<C users={users} active={users.filter(u => u.active)} />
<C product={product} productName={product.name} />

// ✅ Good
<C users={users} />
<C product={product} />
// Do filtering/destructuring in client
```

**Exceção:** Passe dados derivados quando a transformação for cara ou o cliente não precisar do original.

### 3.3 Cross-Request LRU Caching

**Impacto: ALTO (armazenamento em cache entre solicitações)**

`React.cache()` só funciona dentro de uma solicitação. Para dados compartilhados em solicitações sequenciais (o usuário clica no botão A e depois no botão B), use um cache LRU.

**Implementação:**

```typescript
import { LRUCache } from 'lru-cache'

const cache = new LRUCache<string, any>({
  max: 1000,
  ttl: 5 * 60 * 1000, // 5 minutes
})

export async function getUser(id: string) {
  const cached = cache.get(id)
  if (cached) return cached

  const user = await db.user.findUnique({ where: { id } })
  cache.set(id, user)
  return user
}

// Request 1: DB query, result cached
// Request 2: cache hit, no DB query
```

Aplique quando ações sequenciais do usuário atingirem vários endpoints que precisam dos mesmos dados em poucos segundos.

**Com [Fluid Compute](https://vercel.com/docs/fluid-compute) da Vercel:** O cache LRU é especialmente eficaz porque várias solicitações simultâneas podem compartilhar a mesma instância de função e cache. Isso significa que o cache persiste nas solicitações sem a necessidade de armazenamento externo como o Redis.

**No serverless tradicional:** Cada invocação é executada isoladamente, portanto, considere o Redis para armazenamento em cache entre processos.

Referência: [https://github.com/isaacs/node-lru-cache](https://github.com/isaacs/node-lru-cache)

### 3.4 Minimize Serialization at RSC Boundaries

**Impacto: ALTO (reduz o tamanho da transferência de dados)**

O limite React Server/Client serializa todas as propriedades do objeto em strings e as incorpora na resposta HTML e nas solicitações RSC subsequentes. Esses dados serializados impactam diretamente o peso da página e o tempo de carregamento, portanto **o tamanho é muito importante**. Passe apenas os campos que o cliente realmente usa.

**Incorreto: serializa todos os 50 campos**

```tsx
async function Page() {
  const user = await fetchUser() // 50 fields
  return <Profile user={user} />
}

;('use client')
function Profile({ user }: { user: User }) {
  return <div>{user.name}</div> // uses 1 field
}
```

**Correto: serializa apenas 1 campo**

```tsx
async function Page() {
  const user = await fetchUser()
  return <Profile name={user.name} />
}

;('use client')
function Profile({ name }: { name: string }) {
  return <div>{name}</div>
}
```

### 3.5 Parallel Data Fetching with Component Composition

**Impacto: CRÍTICO (elimina cascatas do lado do servidor)**

Os componentes do React Server são executados sequencialmente em uma árvore. Reestruture com composição para paralelizar a busca de dados.

**Incorreto: a barra lateral aguarda a conclusão da busca da página**

```tsx
export default async function Page() {
  const header = await fetchHeader()
  return (
    <div>
      <div>{header}</div>
      <Sidebar />
    </div>
  )
}

async function Sidebar() {
  const items = await fetchSidebarItems()
  return <nav>{items.map(renderItem)}</nav>
}
```

**Correto: ambos buscam simultaneamente**

```tsx
async function Header() {
  const data = await fetchHeader()
  return <div>{data}</div>
}

async function Sidebar() {
  const items = await fetchSidebarItems()
  return <nav>{items.map(renderItem)}</nav>
}

export default function Page() {
  return (
    <div>
      <Header />
      <Sidebar />
    </div>
  )
}
```

**Alternativa com suporte infantil:**

```tsx
async function Header() {
  const data = await fetchHeader()
  return <div>{data}</div>
}

async function Sidebar() {
  const items = await fetchSidebarItems()
  return <nav>{items.map(renderItem)}</nav>
}

function Layout({ children }: { children: ReactNode }) {
  return (
    <div>
      <Header />
      {children}
    </div>
  )
}

export default function Page() {
  return (
    <Layout>
      <Sidebar />
    </Layout>
  )
}
```

### 3.6 Per-Request Deduplication with React.cache()

**Impacto: MÉDIO (desduplicação mediante solicitação)**

Para desduplicar solicitações no servidor, empregue `React.cache()`: autenticação e consultas ao banco são os casos que mais ganham.

**Uso:**

```typescript
import { cache } from 'react'

export const getCurrentUser = cache(async () => {
  const session = await auth()
  if (!session?.user?.id) return null
  return await db.user.findUnique({
    where: { id: session.user.id },
  })
})
```

Dentro de uma única solicitação, múltiplas chamadas para `getCurrentUser()` executam a consulta apenas uma vez.

**Evite objetos embutidos como argumentos:**

`React.cache()` usa igualdade superficial (`Object.is`) para determinar ocorrências de cache. Objetos embutidos criam novas referências a cada chamada, evitando ocorrências no cache.

**Incorreto: sempre falha no cache**

```typescript
const getUser = cache(async (params: { uid: number }) => {
  return await db.user.findUnique({ where: { id: params.uid } })
})

// Each call creates new object, never hits cache
getUser({ uid: 1 })
getUser({ uid: 1 }) // Cache miss, runs query again
```

**Correto: ocorrência no cache**

```typescript
const params = { uid: 1 }
getUser(params) // Query runs
getUser(params) // Cache hit (same reference)
```

Se você deve passar objetos, passe a mesma referência:

**Nota específica do Next.js:**

No Next.js, a API `fetch` é estendida automaticamente com memoização de solicitação. Solicitações com a mesma URL e opções são automaticamente desduplicadas em uma única solicitação, então você não precisa de `React.cache()` para chamadas `fetch`. No entanto, `React.cache()` ainda é essencial para outras tarefas assíncronas:

- Consultas de banco de dados (Prisma, Drizzle, etc.)

- Cálculos pesados

- Verificações de autenticação

- Operações do sistema de arquivos

- Qualquer trabalho assíncrono sem busca

Para desduplicar essas operações na árvore de componentes, empregue `React.cache()`.

Referência: [https://react.dev/reference/react/cache](https://react.dev/reference/react/cache)

### 3.7 Use after() for Non-Blocking Operations

**Impacto: MÉDIO (tempos de resposta mais rápidos)**

Com `after()` do Next.js, agende trabalho a executar depois do envio da resposta; assim logging, métricas e outros efeitos colaterais não bloqueiam a resposta.

**Incorreto: bloqueia a resposta**

```tsx
import { logUserAction } from '@/app/utils'

export async function POST(request: Request) {
  // Perform mutation
  await updateDatabase(request)

  // Logging blocks the response
  const userAgent = request.headers.get('user-agent') || 'unknown'
  await logUserAction({ userAgent })

  return new Response(JSON.stringify({ status: 'success' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
}
```

**Correto: sem bloqueio**

```tsx
import { after } from 'next/server'
import { headers, cookies } from 'next/headers'
import { logUserAction } from '@/app/utils'

export async function POST(request: Request) {
  // Perform mutation
  await updateDatabase(request)

  // Log after response is sent
  after(async () => {
    const userAgent = (await headers()).get('user-agent') || 'unknown'
    const sessionCookie = (await cookies()).get('session-id')?.value || 'anonymous'

    logUserAction({ sessionCookie, userAgent })
  })

  return new Response(JSON.stringify({ status: 'success' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
}
```

A resposta é enviada imediatamente enquanto o registro ocorre em segundo plano.

**Casos de uso comuns:**

- Acompanhamento analítico

- Registro de auditoria

- Envio de notificações

- Invalidação de cache

- Tarefas de limpeza

**Notas importantes:**

- `after()` é executado mesmo se a resposta falhar ou redirecionar

- Funciona em ações de servidor, manipuladores de rota e componentes de servidor

Referência: [https://nextjs.org/docs/app/api-reference/functions/after](https://nextjs.org/docs/app/api-reference/functions/after)

---

## 4. Client-Side Data Fetching

**Impacto: MÉDIO-ALTO**

A desduplicação automática e padrões eficientes de busca de dados reduzem solicitações de rede redundantes.

### 4.1 Deduplicate Global Event Listeners

**Impacto: BAIXO (ouvinte único para N componentes)**

Com `useSWRSubscription()`, compartilhe ouvintes de eventos globais entre instâncias de componentes.

**Incorreto: N instâncias = N ouvintes**

```tsx
function useKeyboardShortcut(key: string, callback: () => void) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.metaKey && e.key === key) {
        callback()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [key, callback])
}
```

Ao usar o gancho `useKeyboardShortcut` várias vezes, cada instância registrará um novo ouvinte.

**Correto: N instâncias = 1 ouvinte**

```tsx
import useSWRSubscription from 'swr/subscription'

// Module-level Map to track callbacks per key
const keyCallbacks = new Map<string, Set<() => void>>()

function useKeyboardShortcut(key: string, callback: () => void) {
  // Register this callback in the Map
  useEffect(() => {
    if (!keyCallbacks.has(key)) {
      keyCallbacks.set(key, new Set())
    }
    keyCallbacks.get(key)!.add(callback)

    return () => {
      const set = keyCallbacks.get(key)
      if (set) {
        set.delete(callback)
        if (set.size === 0) {
          keyCallbacks.delete(key)
        }
      }
    }
  }, [key, callback])

  useSWRSubscription('global-keydown', () => {
    const handler = (e: KeyboardEvent) => {
      if (e.metaKey && keyCallbacks.has(e.key)) {
        keyCallbacks.get(e.key)!.forEach((cb) => cb())
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  })
}

function Profile() {
  // Multiple shortcuts will share the same listener
  useKeyboardShortcut('p', () => {
    /* ... */
  })
  useKeyboardShortcut('k', () => {
    /* ... */
  })
  // ...
}
```

### 4.2 Use Passive Event Listeners for Scrolling Performance

**Impacto: MÉDIO (elimina o atraso de rolagem causado por ouvintes de eventos)**

Adicione `{passive: true}` aos ouvintes de eventos touch e wheel para permitir a rolagem imediata. Os navegadores normalmente esperam que os ouvintes terminem para verificar se `preventDefault()` foi chamado, causando atraso na rolagem.

**Incorreto:**

```typescript
useEffect(() => {
  const handleTouch = (e: TouchEvent) => console.log(e.touches[0].clientX)
  const handleWheel = (e: WheelEvent) => console.log(e.deltaY)

  document.addEventListener('touchstart', handleTouch)
  document.addEventListener('wheel', handleWheel)

  return () => {
    document.removeEventListener('touchstart', handleTouch)
    document.removeEventListener('wheel', handleWheel)
  }
}, [])
```

**Correto:**

```typescript
useEffect(() => {
  const handleTouch = (e: TouchEvent) => console.log(e.touches[0].clientX)
  const handleWheel = (e: WheelEvent) => console.log(e.deltaY)

  document.addEventListener('touchstart', handleTouch, { passive: true })
  document.addEventListener('wheel', handleWheel, { passive: true })

  return () => {
    document.removeEventListener('touchstart', handleTouch)
    document.removeEventListener('wheel', handleWheel)
  }
}, [])
```

**Use passivo quando:** rastreamento/analítica, registro, qualquer ouvinte que não chame `preventDefault()`.

**Não use passivo ao:** implementar gestos de deslizar personalizados, controles de zoom personalizados ou qualquer ouvinte que precise de `preventDefault()`.

### 4.3 Use SWR for Automatic Deduplication

**Impacto: MÉDIO-ALTO (desduplicação automática)**

O SWR permite desduplicação de solicitações, armazenamento em cache e revalidação em instâncias de componentes.

**Incorreto: sem desduplicação, cada instância busca**

```tsx
function UserList() {
  const [users, setUsers] = useState([])
  useEffect(() => {
    fetch('/api/users')
      .then((r) => r.json())
      .then(setUsers)
  }, [])
}
```

**Correto: várias instâncias compartilham uma solicitação**

```tsx
import useSWR from 'swr'

function UserList() {
  const { data: users } = useSWR('/api/users', fetcher)
}
```

**Para dados imutáveis:**

```tsx
import { useImmutableSWR } from '@/lib/swr'

function StaticContent() {
  const { data } = useImmutableSWR('/api/config', fetcher)
}
```

**Para mutações:**

```tsx
import { useSWRMutation } from 'swr/mutation'

function UpdateButton() {
  const { trigger } = useSWRMutation('/api/user', updateUser)
  return <button onClick={() => trigger()}>Update</button>
}
```

Referência: [https://swr.vercel.app](https://swr.vercel.app)

### 4.4 Version and Minimize localStorage Data

**Impacto: MÉDIO (evita conflitos de esquema, reduz o tamanho do armazenamento)**

Adicione o prefixo de versão às chaves e armazene apenas os campos necessários. Evita conflitos de esquema e armazenamento acidental de dados confidenciais.

**Incorreto:**

```typescript
// No version, stores everything, no error handling
localStorage.setItem('userConfig', JSON.stringify(fullUserObject))
const data = localStorage.getItem('userConfig')
```

**Correto:**

```typescript
const VERSION = 'v2'

function saveConfig(config: { theme: string; language: string }) {
  try {
    localStorage.setItem(`userConfig:${VERSION}`, JSON.stringify(config))
  } catch {
    // Throws in incognito/private browsing, quota exceeded, or disabled
  }
}

function loadConfig() {
  try {
    const data = localStorage.getItem(`userConfig:${VERSION}`)
    return data ? JSON.parse(data) : null
  } catch {
    return null
  }
}

// Migration from v1 to v2
function migrate() {
  try {
    const v1 = localStorage.getItem('userConfig:v1')
    if (v1) {
      const old = JSON.parse(v1)
      saveConfig({ theme: old.darkMode ? 'dark' : 'light', language: old.lang })
      localStorage.removeItem('userConfig:v1')
    }
  } catch {}
}
```

**Armazene campos mínimos das respostas do servidor:**

```typescript
// User object has 20+ fields, only store what UI needs
function cachePrefs(user: FullUser) {
  try {
    localStorage.setItem(
      'prefs:v1',
      JSON.stringify({
        theme: user.preferences.theme,
        notifications: user.preferences.notifications,
      }),
    )
  } catch {}
}
```

**Sempre envolva try-catch:** `getItem()` e `setItem()` lançam navegação anônima/privada (Safari, Firefox), quando a cota é excedida ou quando desabilitada.

**Benefícios:** Evolução do esquema via versionamento, tamanho de armazenamento reduzido, evita o armazenamento de tokens/PII/sinalizações internas.

---

## 5. Re-render Optimization

**Impacto: MÉDIO**

A redução de novas renderizações desnecessárias minimiza o desperdício de computação e melhora a capacidade de resposta da IU.

### 5.1 Calculate Derived State During Rendering

**Impacto: MÉDIO (evita renderizações redundantes e desvio de estado)**

Se um valor puder ser calculado a partir do props/state atual, não o armazene no estado nem o atualize em um efeito. Derive-o durante a renderização para evitar renderizações extras e desvios de estado. Não defina efeitos de estado apenas em resposta a mudanças de prop; prefira valores derivados ou redefinições digitadas.

**Incorreto: estado e efeito redundantes**

```tsx
function Form() {
  const [firstName, setFirstName] = useState('First')
  const [lastName, setLastName] = useState('Last')
  const [fullName, setFullName] = useState('')

  useEffect(() => {
    setFullName(firstName + ' ' + lastName)
  }, [firstName, lastName])

  return <p>{fullName}</p>
}
```

**Correto: deriva durante a renderização**

```tsx
function Form() {
  const [firstName, setFirstName] = useState('First')
  const [lastName, setLastName] = useState('Last')
  const fullName = firstName + ' ' + lastName

  return <p>{fullName}</p>
}
```

Referência: [https://react.dev/learn/you-might-not-need-an-effect](https://react.dev/learn/you-might-not-need-an-effect)

### 5.2 Defer State Reads to Usage Point

**Impacto: MÉDIO (evita assinaturas desnecessárias)**

Não assine o estado dinâmico (searchParams, localStorage) se você apenas lê-lo dentro de retornos de chamada.

**Incorreto: assina todas as alterações de searchParams**

```tsx
function ShareButton({ chatId }: { chatId: string }) {
  const searchParams = useSearchParams()

  const handleShare = () => {
    const ref = searchParams.get('ref')
    shareChat(chatId, { ref })
  }

  return <button onClick={handleShare}>Share</button>
}
```

**Correto: leitura sob demanda, sem assinatura**

```tsx
function ShareButton({ chatId }: { chatId: string }) {
  const handleShare = () => {
    const params = new URLSearchParams(window.location.search)
    const ref = params.get('ref')
    shareChat(chatId, { ref })
  }

  return <button onClick={handleShare}>Share</button>
}
```

### 5.3 Do not wrap a simple expression with a primitive result type in useMemo

**Impacto: BAIXO-MÉDIO (desperdício de computação em cada renderização)**

Quando uma expressão é simples (poucos operadores lógicos ou aritméticos) e tem um tipo de resultado primitivo (booleano, número, string), não a envolva em `useMemo`.

Chamar `useMemo` e comparar dependências de gancho pode consumir mais recursos do que a própria expressão.

**Incorreto:**

```tsx
function Header({ user, notifications }: Props) {
  const isLoading = useMemo(() => {
    return user.isLoading || notifications.isLoading
  }, [user.isLoading, notifications.isLoading])

  if (isLoading) return <Skeleton />
  // return some markup
}
```

**Correto:**

```tsx
function Header({ user, notifications }: Props) {
  const isLoading = user.isLoading || notifications.isLoading

  if (isLoading) return <Skeleton />
  // return some markup
}
```

### 5.4 Extract Default Non-primitive Parameter Value from Memoized Component to Constant

**Impacto: MÉDIO (restaura a memorização usando uma constante como valor padrão)**

Quando o componente memoizado tem um valor padrão para algum parâmetro opcional não primitivo, como uma matriz, função ou objeto, chamar o componente sem esse parâmetro resulta em memoização quebrada. Isso ocorre porque novas instâncias de valor são criadas em cada nova renderização e não passam na comparação estrita de igualdade em `memo()`.

Para resolver esse problema, extraia o valor padrão em uma constante.

**Incorreto: `onClick` tem valores diferentes em cada nova renderização**

```tsx
const UserAvatar = memo(function UserAvatar({ onClick = () => {} }: { onClick?: () => void }) {
  // ...
})

// Used without optional onClick
<UserAvatar />
```

**Correto: valor padrão estável**

```tsx
const NOOP = () => {};

const UserAvatar = memo(function UserAvatar({ onClick = NOOP }: { onClick?: () => void }) {
  // ...
})

// Used without optional onClick
<UserAvatar />
```

### 5.5 Extract to Memoized Components

**Impacto: MÉDIO (permite retornos antecipados)**

Extraia trabalhos caros em componentes memorizados para permitir retornos antecipados antes da computação.

**Incorreto: calcula o avatar mesmo durante o carregamento**

```tsx
function Profile({ user, loading }: Props) {
  const avatar = useMemo(() => {
    const id = computeAvatarId(user)
    return <Avatar id={id} />
  }, [user])

  if (loading) return <Skeleton />
  return <div>{avatar}</div>
}
```

**Correto: pula o cálculo ao carregar**

```tsx
const UserAvatar = memo(function UserAvatar({ user }: { user: User }) {
  const id = useMemo(() => computeAvatarId(user), [user])
  return <Avatar id={id} />
})

function Profile({ user, loading }: Props) {
  if (loading) return <Skeleton />
  return (
    <div>
      <UserAvatar user={user} />
    </div>
  )
}
```

**Nota:** Se o seu projeto tiver o [React Compiler](https://react.dev/learn/react-compiler) habilitado, a memorização manual com `memo()` e `useMemo()` não é necessária. O compilador otimiza automaticamente as re-renderizações.

### 5.6 Narrow Effect Dependencies

**Impacto: BAIXO (minimiza repetições de efeitos)**

Especifique dependências primitivas em vez de objetos para minimizar novas execuções de efeitos.

**Incorreto: é executado novamente em qualquer alteração de campo do usuário**

```tsx
useEffect(() => {
  console.log(user.id)
}, [user])
```

**Correto: é executado novamente somente quando o ID muda**

```tsx
useEffect(() => {
  console.log(user.id)
}, [user.id])
```

**Para estado derivado, calcule o efeito externo:**

```tsx
// Incorrect: runs on width=767, 766, 765...
useEffect(() => {
  if (width < 768) {
    enableMobileMode()
  }
}, [width])

// Correct: runs only on boolean transition
const isMobile = width < 768
useEffect(() => {
  if (isMobile) {
    enableMobileMode()
  }
}, [isMobile])
```

### 5.7 Put Interaction Logic in Event Handlers

**Impacto: MÉDIO (evita repetições de efeitos e efeitos colaterais duplicados)**

Se um efeito colateral for acionado por uma ação específica do usuário (enviar, clicar, arrastar), execute-o nesse manipulador de eventos. Não modele a ação como estado + efeito; faz com que os efeitos sejam executados novamente em alterações não relacionadas e pode duplicar a ação.

**Incorreto: evento modelado como estado + efeito**

```tsx
function Form() {
  const [submitted, setSubmitted] = useState(false)
  const theme = useContext(ThemeContext)

  useEffect(() => {
    if (submitted) {
      post('/api/register')
      showToast('Registered', theme)
    }
  }, [submitted, theme])

  return <button onClick={() => setSubmitted(true)}>Submit</button>
}
```

**Correto: faça isso no manipulador**

```tsx
function Form() {
  const theme = useContext(ThemeContext)

  function handleSubmit() {
    post('/api/register')
    showToast('Registered', theme)
  }

  return <button onClick={handleSubmit}>Submit</button>
}
```

Referência: [https://react.dev/learn/removing-effect-dependencies#should-this-code-move-to-an-event-handler](https://react.dev/learn/removing-effect-dependencies#should-this-code-move-to-an-event-handler)

### 5.8 Subscribe to Derived State

**Impacto: MÉDIO (reduz a frequência de nova renderização)**

Assine o estado booleano derivado em vez de valores contínuos para reduzir a frequência de nova renderização.

**Incorreto: renderiza novamente a cada mudança de pixel**

```tsx
function Sidebar() {
  const width = useWindowWidth() // updates continuously
  const isMobile = width < 768
  return <nav className={isMobile ? 'mobile' : 'desktop'} />
}
```

**Correto: renderiza novamente somente quando o booleano muda**

```tsx
function Sidebar() {
  const isMobile = useMediaQuery('(max-width: 767px)')
  return <nav className={isMobile ? 'mobile' : 'desktop'} />
}
```

### 5.9 Use Functional setState Updates

**Impacto: MÉDIO (evita fechamentos obsoletos e recriações desnecessárias de retorno de chamada)**

Ao atualizar o estado com base no valor do estado atual, use o formulário de atualização funcional de setState em vez de fazer referência direta à variável de estado. Isso evita encerramentos obsoletos, elimina dependências desnecessárias e cria referências de retorno de chamada estáveis.

**Incorreto: requer estado como dependência**

```tsx
function TodoList() {
  const [items, setItems] = useState(initialItems)

  // Callback must depend on items, recreated on every items change
  const addItems = useCallback(
    (newItems: Item[]) => {
      setItems([...items, ...newItems])
    },
    [items],
  ) // ❌ items dependency causes recreations

  // Risk of stale closure if dependency is forgotten
  const removeItem = useCallback((id: string) => {
    setItems(items.filter((item) => item.id !== id))
  }, []) // ❌ Missing items dependency - will use stale items!

  return <ItemsEditor items={items} onAdd={addItems} onRemove={removeItem} />
}
```

O primeiro retorno de chamada é recriado sempre que os `items` são alterados, o que pode fazer com que os componentes filhos sejam renderizados novamente desnecessariamente. O segundo retorno de chamada tem um bug de fechamento obsoleto – ele sempre fará referência ao valor inicial de `items`.

**Correto: retornos de chamada estáveis, sem encerramentos obsoletos**

```tsx
function TodoList() {
  const [items, setItems] = useState(initialItems)

  // Stable callback, never recreated
  const addItems = useCallback((newItems: Item[]) => {
    setItems((curr) => [...curr, ...newItems])
  }, []) // ✅ No dependencies needed

  // Always uses latest state, no stale closure risk
  const removeItem = useCallback((id: string) => {
    setItems((curr) => curr.filter((item) => item.id !== id))
  }, []) // ✅ Safe and stable

  return <ItemsEditor items={items} onAdd={addItems} onRemove={removeItem} />
}
```

**Benefícios:**

1. **Referências de retorno de chamada estáveis** – Os retornos de chamada não precisam ser recriados quando o estado muda

2. **Sem fechamentos obsoletos** - Sempre opera com o valor de estado mais recente

3. **Menos dependências** – Simplifica matrizes de dependências e reduz vazamentos de memória

4. **Evita bugs** - Elimina a fonte mais comum de bugs de fechamento do React

**Quando usar atualizações funcionais:**

- Qualquer setState que dependa do valor do estado atual

- Dentro de useCallback/useMemo quando o estado é necessário

- Manipuladores de eventos que fazem referência ao estado

- Operações assíncronas que atualizam o estado

**Quando atualizações diretas estão corretas:**

- Configurando o estado para um valor estático: `setCount(0)`

- Configurando o estado apenas de props/arguments: `setName(newName)`

- O estado não depende do valor anterior

**Nota:** Se o seu projeto tiver [React Compiler](https://react.dev/learn/react-compiler) habilitado, o compilador pode otimizar automaticamente alguns casos, mas atualizações funcionais ainda são recomendadas para correção e para evitar bugs de fechamento obsoletos.

### 5.10 Use Lazy State Initialization

**Impacto: MÉDIO (desperdício de computação em cada renderização)**

Passe uma função para `useState` para valores iniciais caros. Sem a forma de função, o inicializador é executado em cada renderização, mesmo que o valor seja usado apenas uma vez.

**Incorreto: é executado em todas as renderizações**

```tsx
function FilteredList({ items }: { items: Item[] }) {
  // buildSearchIndex() runs on EVERY render, even after initialization
  const [searchIndex, setSearchIndex] = useState(buildSearchIndex(items))
  const [query, setQuery] = useState('')

  // When query changes, buildSearchIndex runs again unnecessarily
  return <SearchResults index={searchIndex} query={query} />
}

function UserProfile() {
  // JSON.parse runs on every render
  const [settings, setSettings] = useState(JSON.parse(localStorage.getItem('settings') || '{}'))

  return <SettingsForm settings={settings} onChange={setSettings} />
}
```

**Correto: é executado apenas uma vez**

```tsx
function FilteredList({ items }: { items: Item[] }) {
  // buildSearchIndex() runs ONLY on initial render
  const [searchIndex, setSearchIndex] = useState(() => buildSearchIndex(items))
  const [query, setQuery] = useState('')

  return <SearchResults index={searchIndex} query={query} />
}

function UserProfile() {
  // JSON.parse runs only on initial render
  const [settings, setSettings] = useState(() => {
    const stored = localStorage.getItem('settings')
    return stored ? JSON.parse(stored) : {}
  })

  return <SettingsForm settings={settings} onChange={setSettings} />
}
```

Recorra à inicialização preguiçosa ao calcular valores iniciais de localStorage/sessionStorage, construir estruturas de dados (índices, mapas), ler do DOM ou realizar transformações pesadas.

Para primitivas simples (`useState(0)`), referências diretas (`useState(props.value)`) ou literais baratos (`useState({})`), a forma da função é desnecessária.

### 5.11 Use Transitions for Non-Urgent Updates

**Impacto: MÉDIO (mantém a capacidade de resposta da IU)**

Marque atualizações de estado frequentes e não urgentes como transições para manter a capacidade de resposta da UI.

**Incorreto: bloqueia a IU em cada rolagem**

```tsx
function ScrollTracker() {
  const [scrollY, setScrollY] = useState(0)
  useEffect(() => {
    const handler = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])
}
```

**Correto: atualizações sem bloqueio**

```tsx
import { startTransition } from 'react'

function ScrollTracker() {
  const [scrollY, setScrollY] = useState(0)
  useEffect(() => {
    const handler = () => {
      startTransition(() => setScrollY(window.scrollY))
    }
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])
}
```

### 5.12 Use useRef for Transient Values

**Impacto: MÉDIO (evita novas renderizações desnecessárias em atualizações frequentes)**

Quando um valor muda com frequência e você não deseja uma nova renderização a cada atualização (por exemplo, rastreadores de mouse, intervalos, sinalizadores transitórios), armazene-o em `useRef` em vez de `useState`. Mantenha o estado do componente para UI; use refs para valores temporários adjacentes ao DOM. Atualizar uma referência não aciona uma nova renderização.

**Incorreto: renderiza todas as atualizações**

```tsx
function Tracker() {
  const [lastX, setLastX] = useState(0)

  useEffect(() => {
    const onMove = (e: MouseEvent) => setLastX(e.clientX)
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: lastX,
        width: 8,
        height: 8,
        background: 'black',
      }}
    />
  )
}
```

**Correto: sem nova renderização para rastreamento**

```tsx
function Tracker() {
  const lastXRef = useRef(0)
  const dotRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      lastXRef.current = e.clientX
      const node = dotRef.current
      if (node) {
        node.style.transform = `translateX(${e.clientX}px)`
      }
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  return (
    <div
      ref={dotRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: 8,
        height: 8,
        background: 'black',
        transform: 'translateX(0px)',
      }}
    />
  )
}
```

---

## 6. Rendering Performance

**Impacto: MÉDIO**

Otimizar o processo de renderização reduz o trabalho que o navegador precisa realizar.

### 6.1 Animate SVG Wrapper Instead of SVG Element

**Impacto: BAIXO (permite aceleração de hardware)**

Muitos navegadores não possuem aceleração de hardware para animações CSS3 em elementos SVG. Envolva o SVG em um `<div>` e anime o wrapper.

**Incorreto: animando SVG diretamente – sem aceleração de hardware**

```tsx
function LoadingSpinner() {
  return (
    <svg className="animate-spin" width="24" height="24" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" stroke="currentColor" />
    </svg>
  )
}
```

**Correto: animando div do wrapper - acelerado por hardware**

```tsx
function LoadingSpinner() {
  return (
    <div className="animate-spin">
      <svg width="24" height="24" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" stroke="currentColor" />
      </svg>
    </div>
  )
}
```

Isso se aplica a todas as transformações e transições CSS (`transform`, `opacity`, `translate`, `scale`, `rotate`). O wrapper div permite que os navegadores usem a aceleração da GPU para animações mais suaves.

### 6.2 CSS content-visibility for Long Lists

**Impacto: ALTO (renderização inicial mais rápida)**

Aplique `content-visibility: auto` para adiar a renderização fora da tela.

**CSS:**

```css
.message-item {
  content-visibility: auto;
  contain-intrinsic-size: 0 80px;
}
```

**Exemplo:**

```tsx
function MessageList({ messages }: { messages: Message[] }) {
  return (
    <div className="overflow-y-auto h-screen">
      {messages.map((msg) => (
        <div key={msg.id} className="message-item">
          <Avatar user={msg.author} />
          <div>{msg.content}</div>
        </div>
      ))}
    </div>
  )
}
```

Para 1.000 mensagens, o navegador pula o layout/paint para ~990 itens fora da tela (renderização inicial 10× mais rápida).

### 6.3 Hoist Static JSX Elements

**Impacto: BAIXO (evita recriação)**

Extraia componentes externos JSX estáticos para evitar a recriação.

**Incorreto: recria o elemento a cada renderização**

```tsx
function LoadingSkeleton() {
  return <div className="animate-pulse h-20 bg-gray-200" />
}

function Container() {
  return <div>{loading && <LoadingSkeleton />}</div>
}
```

**Correto: reutiliza o mesmo elemento**

```tsx
const loadingSkeleton = <div className="animate-pulse h-20 bg-gray-200" />

function Container() {
  return <div>{loading && loadingSkeleton}</div>
}
```

Isso é especialmente útil para nós SVG grandes e estáticos, cuja recriação pode ser cara em cada renderização.

**Observação:** Se o seu projeto tiver o [React Compiler](https://react.dev/learn/react-compiler) habilitado, o compilador eleva automaticamente os elementos JSX estáticos e otimiza as novas renderizações dos componentes, tornando desnecessário o içamento manual.

### 6.4 Optimize SVG Precision

**Impacto: BAIXO (reduz o tamanho do arquivo)**

Reduza a precisão das coordenadas SVG para diminuir o tamanho do arquivo. A precisão ideal depende do tamanho do viewBox, mas em geral a redução da precisão deve ser considerada.

**Incorreto: precisão excessiva**

```svg
<path d="M 10.293847 20.847362 L 30.938472 40.192837" />
```

**Correto: 1 casa decimal**

```svg
<path d="M 10.3 20.8 L 30.9 40.2" />
```

**Automatize com SVGO:**

```bash
npx svgo --precision=1 --multipass icon.svg
```

### 6.5 Prevent Hydration Mismatch Without Flickering

**Impacto: MÉDIO (evita oscilações visuais e erros de hidratação)**

Ao renderizar conteúdo que depende do armazenamento do lado do cliente (localStorage, cookies), evite quebras de SSR e oscilações pós-hidratação injetando um script síncrono que atualiza o DOM antes da hidratação do React.

**Incorreto: quebra SSR**

```tsx
function ThemeWrapper({ children }: { children: ReactNode }) {
  // localStorage is not available on server - throws error
  const theme = localStorage.getItem('theme') || 'light'

  return <div className={theme}>{children}</div>
}
```

A renderização do lado do servidor falhará porque `localStorage` é indefinido.

**Incorreto: oscilação visual**

```tsx
function ThemeWrapper({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState('light')

  useEffect(() => {
    // Runs after hydration - causes visible flash
    const stored = localStorage.getItem('theme')
    if (stored) {
      setTheme(stored)
    }
  }, [])

  return <div className={theme}>{children}</div>
}
```

O componente primeiro é renderizado com o valor padrão (`light`) e depois é atualizado após a hidratação, causando um flash visível de conteúdo incorreto.

**Correto: sem cintilação, sem incompatibilidade de hidratação**

```tsx
function ThemeWrapper({ children }: { children: ReactNode }) {
  return (
    <>
      <div id="theme-wrapper">{children}</div>
      <script
        dangerouslySetInnerHTML={{
          __html: `
            (function() {
              try {
                var theme = localStorage.getItem('theme') || 'light';
                var el = document.getElementById('theme-wrapper');
                if (el) el.className = theme;
              } catch (e) {}
            })();
          `,
        }}
      />
    </>
  )
}
```

O script embutido é executado de forma síncrona antes de mostrar o elemento, garantindo que o DOM já tenha o valor correto. Sem cintilação, sem incompatibilidade de hidratação.

Esse padrão é especialmente útil para alternância de temas, preferências do usuário, estados de autenticação e quaisquer dados somente do cliente que devem ser renderizados imediatamente sem piscar os valores padrão.

### 6.6 Suppress Expected Hydration Mismatches

**Impacto: BAIXO-MÉDIO (evita avisos barulhentos de hidratação devido a diferenças conhecidas)**

Em estruturas SSR (por exemplo, Next.js), alguns valores são intencionalmente diferentes no servidor e no cliente (IDs aleatórios, datas, formatação locale/timezone). Para essas incompatibilidades _esperadas_, envolva o texto dinâmico em um elemento com `suppressHydrationWarning` para evitar avisos barulhentos. Não use isso para esconder bugs reais. Não abuse.

**Incorreto: avisos de incompatibilidade conhecidos**

```tsx
function Timestamp() {
  return <span>{new Date().toLocaleString()}</span>
}
```

**Correto: suprimir apenas a incompatibilidade esperada**

```tsx
function Timestamp() {
  return <span suppressHydrationWarning>{new Date().toLocaleString()}</span>
}
```

### 6.7 Use Activity Component for Show/Hide

**Impacto: MÉDIO (preserva estado/DOM)**

Com `<Activity>` do React, preserve state/DOM em componentes caros que alternam a visibilidade com frequência.

**Uso:**

```tsx
import { Activity } from 'react'

function Dropdown({ isOpen }: Props) {
  return (
    <Activity mode={isOpen ? 'visible' : 'hidden'}>
      <ExpensiveMenu />
    </Activity>
  )
}
```

Evita re-renderizações caras e perda de estado.

### 6.8 Use Explicit Conditional Rendering

**Impacto: BAIXO (evita renderização 0 ou NaN)**

Prefira operadores ternários explícitos (`? :`) em vez de `&&` na renderização condicional quando a condição puder ser `0`, `NaN` ou outros valores falsos que acabem renderizados.

**Incorreto: renderiza "0" quando a contagem é 0**

```tsx
function Badge({ count }: { count: number }) {
  return <div>{count && <span className="badge">{count}</span>}</div>
}

// When count = 0, renders: <div>0</div>
// When count = 5, renders: <div><span class="badge">5</span></div>
```

**Correto: não renderiza nada quando a contagem é 0**

```tsx
function Badge({ count }: { count: number }) {
  return <div>{count > 0 ? <span className="badge">{count}</span> : null}</div>
}

// When count = 0, renders: <div></div>
// When count = 5, renders: <div><span class="badge">5</span></div>
```

### 6.9 Use useTransition Over Manual Loading States

**Impacto: BAIXO (reduz novas renderizações e melhora a clareza do código)**

Prefira `useTransition` a `useState` manual para estados de carregamento: há `isPending` nativo e as transições são gerenciadas automaticamente.

**Incorreto: estado de carregamento manual**

```tsx
function SearchResults() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const handleSearch = async (value: string) => {
    setIsLoading(true)
    setQuery(value)
    const data = await fetchResults(value)
    setResults(data)
    setIsLoading(false)
  }

  return (
    <>
      <input onChange={(e) => handleSearch(e.target.value)} />
      {isLoading && <Spinner />}
      <ResultsList results={results} />
    </>
  )
}
```

**Correto: useTransition com estado pendente integrado**

```tsx
import { useTransition, useState } from 'react'

function SearchResults() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [isPending, startTransition] = useTransition()

  const handleSearch = (value: string) => {
    setQuery(value) // Update input immediately

    startTransition(async () => {
      // Fetch and update results
      const data = await fetchResults(value)
      setResults(data)
    })
  }

  return (
    <>
      <input onChange={(e) => handleSearch(e.target.value)} />
      {isPending && <Spinner />}
      <ResultsList results={results} />
    </>
  )
}
```

**Benefícios:**

- **Estado pendente automático**: Não há necessidade de gerenciar manualmente `setIsLoading(true/false)`

- **Resiliência a erros**: o estado pendente é redefinido corretamente mesmo se a transição for lançada

- **Melhor capacidade de resposta**: mantém a UI responsiva durante atualizações

- **Tratamento de interrupções**: novas transições cancelam automaticamente as pendentes

Referência: [https://react.dev/reference/react/useTransition](https://react.dev/reference/react/useTransition)

---

## 7. JavaScript Performance

**Impacto: BAIXO-MÉDIO**

Micro-otimizações para caminhos quentes podem resultar em melhorias significativas.

### 7.1 Avoid Layout Thrashing

**Impacto: MÉDIO (evita layouts síncronos forçados e reduz gargalos de desempenho)**

Evite intercalar gravações de estilo com leituras de layout. Quando você lê uma propriedade de layout (como `offsetWidth`, `getBoundingClientRect()` ou `getComputedStyle()`) entre alterações de estilo, o navegador é forçado a acionar um refluxo síncrono.

**Tudo bem: alterações no estilo dos lotes do navegador**

```typescript
function updateElementStyles(element: HTMLElement) {
  // Each line invalidates style, but browser batches the recalculation
  element.style.width = '100px'
  element.style.height = '200px'
  element.style.backgroundColor = 'blue'
  element.style.border = '1px solid black'
}
```

**Incorreto: leituras e gravações intercaladas forçam refluxos**

```typescript
function layoutThrashing(element: HTMLElement) {
  element.style.width = '100px'
  const width = element.offsetWidth // Forces reflow
  element.style.height = '200px'
  const height = element.offsetHeight // Forces another reflow
}
```

**Correto: gravações em lote e depois lidas uma vez**

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

**Correto: leitura em lote e depois gravação**

```typescript
function updateElementStyles(element: HTMLElement) {
  element.classList.add('highlighted-box')

  const { width, height } = element.getBoundingClientRect()
}
```

**Melhor: use classes CSS**

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

Prefira classes CSS em vez de estilos embutidos, quando possível. Os arquivos CSS são armazenados em cache pelo navegador e as classes fornecem melhor separação de interesses e são mais fáceis de manter.

Consulte [esta essência](https://gist.github.com/paulirish/5d52fb081b3570c81e3a) e [gatilhos CSS](https://csstriggers.com/) para obter mais informações sobre operações de forçamento de layout.

### 7.2 Build Index Maps for Repeated Lookups

**Impacto: BAIXO-MÉDIO (1 milhão de operações a 2 mil operações)**

Múltiplas chamadas `.find()` pela mesma chave devem usar um Mapa.

**Incorreto (O(n) por pesquisa):**

```typescript
function processOrders(orders: Order[], users: User[]) {
  return orders.map((order) => ({
    ...order,
    user: users.find((u) => u.id === order.userId),
  }))
}
```

**Correto (O(1) por pesquisa):**

```typescript
function processOrders(orders: Order[], users: User[]) {
  const userById = new Map(users.map((u) => [u.id, u]))

  return orders.map((order) => ({
    ...order,
    user: userById.get(order.userId),
  }))
}
```

Construa o mapa uma vez (O(n)), então todas as pesquisas serão O(1).

Para 1.000 pedidos × 1.000 usuários: 1 milhão de operações → 2 mil operações.

### 7.3 Cache Property Access in Loops

**Impacto: BAIXO-MÉDIO (reduz pesquisas)**

Armazene pesquisas de propriedades de objetos em cache em caminhos ativos.

**Incorreto: 3 pesquisas × N iterações**

```typescript
for (let i = 0; i < arr.length; i++) {
  process(obj.config.settings.value)
}
```

**Correto: 1 pesquisa no total**

```typescript
const value = obj.config.settings.value
const len = arr.length
for (let i = 0; i < len; i++) {
  process(value)
}
```

### 7.4 Cache Repeated Function Calls

**Impacto: MÉDIO (evite computação redundante)**

Mantenha um mapa em nível de módulo para guardar em cache os resultados da função quando ela for chamada repetidamente com as mesmas entradas durante a renderização.

**Incorreto: cálculo redundante**

```typescript
function ProjectList({ projects }: { projects: Project[] }) {
  return (
    <div>
      {projects.map(project => {
        // slugify() called 100+ times for same project names
        const slug = slugify(project.name)

        return <ProjectCard key={project.id} slug={slug} />
      })}
    </div>
  )
}
```

**Correto: resultados armazenados em cache**

```typescript
// Module-level cache
const slugifyCache = new Map<string, string>()

function cachedSlugify(text: string): string {
  if (slugifyCache.has(text)) {
    return slugifyCache.get(text)!
  }
  const result = slugify(text)
  slugifyCache.set(text, result)
  return result
}

function ProjectList({ projects }: { projects: Project[] }) {
  return (
    <div>
      {projects.map(project => {
        // Computed only once per unique project name
        const slug = cachedSlugify(project.name)

        return <ProjectCard key={project.id} slug={slug} />
      })}
    </div>
  )
}
```

**Padrão mais simples para funções de valor único:**

```typescript
let isLoggedInCache: boolean | null = null

function isLoggedIn(): boolean {
  if (isLoggedInCache !== null) {
    return isLoggedInCache
  }

  isLoggedInCache = document.cookie.includes('auth=')
  return isLoggedInCache
}

// Clear cache when auth changes
function onAuthChange() {
  isLoggedInCache = null
}
```

Prefira um Map (não um gancho) para que funcione em qualquer lugar: utilitários, manipuladores de eventos, não só em componentes React.

Referência: [https://vercel.com/blog/how-we-made-the-vercel-dashboard-twice-as-fast](https://vercel.com/blog/how-we-made-the-vercel-dashboard-twice-as-fast)

### 7.5 Cache Storage API Calls

**Impacto: BAIXO-MÉDIO (reduz I/O caro)**

`localStorage`, `sessionStorage` e `document.cookie` são síncronos e caros. O cache lê na memória.

**Incorreto: lê o armazenamento em todas as chamadas**

```typescript
function getTheme() {
  return localStorage.getItem('theme') ?? 'light'
}
// Called 10 times = 10 storage reads
```

**Correto: cache do mapa**

```typescript
const storageCache = new Map<string, string | null>()

function getLocalStorage(key: string) {
  if (!storageCache.has(key)) {
    storageCache.set(key, localStorage.getItem(key))
  }
  return storageCache.get(key)
}

function setLocalStorage(key: string, value: string) {
  localStorage.setItem(key, value)
  storageCache.set(key, value) // keep cache in sync
}
```

Prefira um Map (não um gancho) para que funcione em qualquer lugar: utilitários, manipuladores de eventos, não só em componentes React.

**Cache de cookies:**

```typescript
let cookieCache: Record<string, string> | null = null

function getCookie(name: string) {
  if (!cookieCache) {
    cookieCache = Object.fromEntries(document.cookie.split('; ').map((c) => c.split('=')))
  }
  return cookieCache[name]
}
```

**Importante: invalidar em alterações externas**

```typescript
window.addEventListener('storage', (e) => {
  if (e.key) storageCache.delete(e.key)
})

document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') {
    storageCache.clear()
  }
})
```

Se o armazenamento puder ser alterado externamente (outra guia, cookies definidos pelo servidor), invalide o cache:

### 7.6 Combine Multiple Array Iterations

**Impacto: BAIXO-MÉDIO (reduz iterações)**

Múltiplas chamadas `.filter()` ou `.map()` iteram o array várias vezes. Combine em um loop.

**Incorreto: 3 iterações**

```typescript
const admins = users.filter((u) => u.isAdmin)
const testers = users.filter((u) => u.isTester)
const inactive = users.filter((u) => !u.isActive)
```

**Correto: 1 iteração**

```typescript
const admins: User[] = []
const testers: User[] = []
const inactive: User[] = []

for (const user of users) {
  if (user.isAdmin) admins.push(user)
  if (user.isTester) testers.push(user)
  if (!user.isActive) inactive.push(user)
}
```

### 7.7 Early Length Check for Array Comparisons

**Impacto: MÉDIO-ALTO (evita operações caras quando os comprimentos diferem)**

Ao comparar matrizes com operações caras (classificação, igualdade profunda, serialização), verifique primeiro os comprimentos. Se os comprimentos forem diferentes, as matrizes não poderão ser iguais.

Em aplicações do mundo real, essa otimização é especialmente valiosa quando a comparação é executada em caminhos ativos (manipuladores de eventos, loops de renderização).

**Incorreto: sempre faz comparações caras**

```typescript
function hasChanges(current: string[], original: string[]) {
  // Always sorts and joins, even when lengths differ
  return current.sort().join() !== original.sort().join()
}
```

Duas classificações O (n log n) são executadas mesmo quando `current.length` é 5 e `original.length` é 100. Também há sobrecarga na junção dos arrays e na comparação das strings.

**Corrija (verificação do comprimento O(1) primeiro):**

```typescript
function hasChanges(current: string[], original: string[]) {
  // Early return if lengths differ
  if (current.length !== original.length) {
    return true
  }
  // Only sort when lengths match
  const currentSorted = current.toSorted()
  const originalSorted = original.toSorted()
  for (let i = 0; i < currentSorted.length; i++) {
    if (currentSorted[i] !== originalSorted[i]) {
      return true
    }
  }
  return false
}
```

Esta nova abordagem é mais eficiente porque:

- Evita a sobrecarga de classificação e união dos arrays quando os comprimentos diferem

- Evita consumir memória para as strings unidas (especialmente importante para arrays grandes)

- Evita a mutação dos arrays originais

- Retorna mais cedo quando uma diferença é encontrada

### 7.8 Early Return from Functions

**Impacto: BAIXO-MÉDIO (evita cálculos desnecessários)**

Retorne mais cedo quando o resultado for determinado para ignorar o processamento desnecessário.

**Incorreto: processa todos os itens mesmo depois de encontrar a resposta**

```typescript
function validateUsers(users: User[]) {
  let hasError = false
  let errorMessage = ''

  for (const user of users) {
    if (!user.email) {
      hasError = true
      errorMessage = 'Email required'
    }
    if (!user.name) {
      hasError = true
      errorMessage = 'Name required'
    }
    // Continues checking all users even after error found
  }

  return hasError ? { valid: false, error: errorMessage } : { valid: true }
}
```

**Correto: retorna imediatamente no primeiro erro**

```typescript
function validateUsers(users: User[]) {
  for (const user of users) {
    if (!user.email) {
      return { valid: false, error: 'Email required' }
    }
    if (!user.name) {
      return { valid: false, error: 'Name required' }
    }
  }

  return { valid: true }
}
```

### 7.9 Hoist RegExp Creation

**Impacto: BAIXO-MÉDIO (evita recreação)**

Não crie RegExp dentro da renderização. Eleve para o escopo do módulo ou memorize com `useMemo()`.

**Incorreto: novo RegExp a cada renderização**

```tsx
function Highlighter({ text, query }: Props) {
  const regex = new RegExp(`(${query})`, 'gi')
  const parts = text.split(regex)
  return <>{parts.map((part, i) => ...)}</>
}
```

**Correto: memorizar ou içar**

```tsx
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function Highlighter({ text, query }: Props) {
  const regex = useMemo(
    () => new RegExp(`(${escapeRegex(query)})`, 'gi'),
    [query]
  )
  const parts = text.split(regex)
  return <>{parts.map((part, i) => ...)}</>
}
```

**Aviso: regex global tem estado mutável**

```typescript
const regex = /foo/g
regex.test('foo') // true, lastIndex = 3
regex.test('foo') // false, lastIndex = 0
```

Regex global (`/g`) tem estado mutável `lastIndex`:

### 7.10 Use Loop for Min/Max Instead of Sort

**Impacto: BAIXO (O(n) em vez de O(n log n))**

Encontrar o menor ou maior elemento requer apenas uma única passagem pelo array. A classificação é um desperdício e mais lenta.

**Incorreto (O(n log n) - classifique para encontrar o mais recente):**

```typescript
interface Project {
  id: string
  name: string
  updatedAt: number
}

function getLatestProject(projects: Project[]) {
  const sorted = [...projects].sort((a, b) => b.updatedAt - a.updatedAt)
  return sorted[0]
}
```

Classifica todo o array apenas para encontrar o valor máximo.

**Incorreto (O(n log n) - classificar pelo mais antigo e pelo mais recente):**

```typescript
function getOldestAndNewest(projects: Project[]) {
  const sorted = [...projects].sort((a, b) => a.updatedAt - b.updatedAt)
  return { oldest: sorted[0], newest: sorted[sorted.length - 1] }
}
```

Ainda classifica desnecessariamente quando apenas min/max são necessários.

**Correto (O(n) - loop único):**

```typescript
function getLatestProject(projects: Project[]) {
  if (projects.length === 0) return null

  let latest = projects[0]

  for (let i = 1; i < projects.length; i++) {
    if (projects[i].updatedAt > latest.updatedAt) {
      latest = projects[i]
    }
  }

  return latest
}

function getOldestAndNewest(projects: Project[]) {
  if (projects.length === 0) return { oldest: null, newest: null }

  let oldest = projects[0]
  let newest = projects[0]

  for (let i = 1; i < projects.length; i++) {
    if (projects[i].updatedAt < oldest.updatedAt) oldest = projects[i]
    if (projects[i].updatedAt > newest.updatedAt) newest = projects[i]
  }

  return { oldest, newest }
}
```

Passagem única pela matriz, sem cópia, sem classificação.

**Alternativa: Math.min/Math.max para matrizes pequenas**

```typescript
const numbers = [5, 2, 8, 1, 9]
const min = Math.min(...numbers)
const max = Math.max(...numbers)
```

Isso funciona para matrizes pequenas, mas pode ser mais lento ou apenas gerar um erro para matrizes muito grandes devido às limitações do operador de dispersão. O comprimento máximo da matriz é de aproximadamente 124.000 no Chrome 143 e 638.000 no Safari 18; os números exatos podem variar - veja [o violino](https://jsfiddle.net/qw1jabsx/4/). Use a abordagem de loop para confiabilidade.

### 7.11 Use Set/Map for O(1) Lookups

**Impacto: BAIXO-MÉDIO (O(n) a O(1))**

Converta arrays em Set/Map para verificações repetidas de associação.

**Incorreto (O(n) por verificação):**

```typescript
const allowedIds = ['a', 'b', 'c', ...]
items.filter(item => allowedIds.includes(item.id))
```

**Correto (O(1) por verificação):**

```typescript
const allowedIds = new Set(['a', 'b', 'c', ...])
items.filter(item => allowedIds.has(item.id))
```

### 7.12 Use toSorted() Instead of sort() for Immutability

**Impacto: MÉDIO-ALTO (evita bugs de mutação no estado React)**

`.sort()` altera o array no local, o que pode causar bugs no estado e nos adereços do React. Use `.toSorted()` para criar um novo array classificado sem mutação.

**Incorreto: altera o array original**

```typescript
function UserList({ users }: { users: User[] }) {
  // Mutates the users prop array!
  const sorted = useMemo(
    () => users.sort((a, b) => a.name.localeCompare(b.name)),
    [users]
  )
  return <div>{sorted.map(renderUser)}</div>
}
```

**Correto: cria novo array**

```typescript
function UserList({ users }: { users: User[] }) {
  // Creates new sorted array, original unchanged
  const sorted = useMemo(
    () => users.toSorted((a, b) => a.name.localeCompare(b.name)),
    [users]
  )
  return <div>{sorted.map(renderUser)}</div>
}
```

**Por que isso é importante no React:**

1. Mutações Props/state quebram o modelo de imutabilidade do React - o React espera que props e state sejam tratados como somente leitura

2. Causa bugs de fechamento obsoletos - A mutação de arrays dentro de fechamentos (retornos de chamada, efeitos) pode levar a um comportamento inesperado

**Suporte a navegadores: substituto para navegadores mais antigos**

```typescript
// Fallback for older browsers
const sorted = [...items].sort((a, b) => a.value - b.value)
```

`.toSorted()` está disponível em todos os navegadores modernos (Chrome 110+, Safari 16+, Firefox 115+, Node.js 20+). Para ambientes mais antigos, use o operador spread:

**Outros métodos de array imutáveis:**

- `.toSorted()` - classificação imutável

- `.toReversed()` - reverso imutável

- `.toSpliced()` - emenda imutável

- `.with()` - substituição de elemento imutável

---

## 8. Advanced Patterns

**Impacto: BAIXO**

Padrões avançados para casos específicos que requerem implementação cuidadosa.

### 8.1 Initialize App Once, Not Per Mount

**Impacto: BAIXO-MÉDIO (evita inicialização duplicada no desenvolvimento)**

Não coloque a inicialização de todo o aplicativo que deve ser executada uma vez por carregamento do aplicativo dentro de `useEffect([])` de um componente. Os componentes podem ser remontados e os efeitos serão executados novamente. Em vez disso, use um protetor de nível de módulo ou um init de nível superior no módulo de entrada.

**Incorreto: é executado duas vezes no desenvolvimento, executado novamente na remontagem**

```tsx
function Comp() {
  useEffect(() => {
    loadFromStorage()
    checkAuthToken()
  }, [])

  // ...
}
```

**Correto: uma vez por carregamento do aplicativo**

```tsx
let didInit = false

function Comp() {
  useEffect(() => {
    if (didInit) return
    didInit = true
    loadFromStorage()
    checkAuthToken()
  }, [])

  // ...
}
```

Referência: [https://react.dev/learn/you-might-not-need-an-effect#initializing-the-application](https://react.dev/learn/you-might-not-need-an-effect#initializing-the-application)

### 8.2 Store Event Handlers in Refs

**Impacto: BAIXO (assinaturas estáveis)**

Armazene retornos de chamada em refs quando usados ​​em efeitos que não devem ser assinados novamente em alterações de retorno de chamada.

**Incorreto: assina novamente em cada renderização**

```tsx
function useWindowEvent(event: string, handler: (e) => void) {
  useEffect(() => {
    window.addEventListener(event, handler)
    return () => window.removeEventListener(event, handler)
  }, [event, handler])
}
```

**Correto: assinatura estável**

```tsx
import { useEffectEvent } from 'react'

function useWindowEvent(event: string, handler: (e) => void) {
  const onEvent = useEffectEvent(handler)

  useEffect(() => {
    window.addEventListener(event, onEvent)
    return () => window.removeEventListener(event, onEvent)
  }, [event])
}
```

**Alternativa: use `useEffectEvent` se você estiver no React mais recente:**

`useEffectEvent` fornece uma API mais limpa para o mesmo padrão: ele cria uma referência de função estável que sempre chama a versão mais recente do manipulador.

### 8.3 useEffectEvent for Stable Callback Refs

**Impacto: BAIXO (evita repetições do efeito)**

Acesse os valores mais recentes em retornos de chamada sem adicioná-los a matrizes de dependência. Impede repetições de efeitos, evitando fechamentos obsoletos.

**Incorreto: o efeito é executado novamente a cada alteração de retorno de chamada**

```tsx
function SearchInput({ onSearch }: { onSearch: (q: string) => void }) {
  const [query, setQuery] = useState('')

  useEffect(() => {
    const timeout = setTimeout(() => onSearch(query), 300)
    return () => clearTimeout(timeout)
  }, [query, onSearch])
}
```

**Correto: usando useEffectEvent do React**

```tsx
import { useEffectEvent } from 'react'

function SearchInput({ onSearch }: { onSearch: (q: string) => void }) {
  const [query, setQuery] = useState('')
  const onSearchEvent = useEffectEvent(onSearch)

  useEffect(() => {
    const timeout = setTimeout(() => onSearchEvent(query), 300)
    return () => clearTimeout(timeout)
  }, [query])
}
```

---

## Referências

1. [https://react.dev](https://react.dev)
2. [https://nextjs.org](https://nextjs.org)
3. [https://swr.vercel.app](https://swr.vercel.app)
4. [https://github.com/shuding/better-all](https://github.com/shuding/better-all)
5. [https://github.com/isaacs/node-lru-cache](https://github.com/isaacs/node-lru-cache)
6. [https://vercel.com/blog/how-we-optimized-package-imports-in-next-js](https://vercel.com/blog/how-we-optimized-package-imports-in-next-js)
7. [https://vercel.com/blog/how-we-made-the-vercel-dashboard-twice-as-fast](https://vercel.com/blog/how-we-made-the-vercel-dashboard-twice-as-fast)
