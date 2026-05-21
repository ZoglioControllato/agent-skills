---
name: react-best-practices
description: Diretrizes de otimização de performance para React e Next.js da engenharia Vercel. Use ao escrever, revisar ou refatorar código React/Next.js para garantir padrões de performance. Aciona em componentes React, páginas Next.js, data fetching, bundle ou melhorias de performance. NÃO use para arquitetura de API de componentes ou padrões de composição (use react-composition-patterns).
license: MIT
metadata:
  author: vercel
  version: '1.0.0'
---

# Boas práticas React (Vercel)

Guia abrangente de otimização de performance para aplicações React e Next.js, mantido pela Vercel. Contém 57 regras em 8 categorias, priorizadas por impacto, para orientar refatoração automatizada e geração de código.

## Quando aplicar

Consulte estas diretrizes quando:

- Escrever novos componentes React ou páginas Next.js
- Implementar data fetching (cliente ou servidor)
- Revisar código em busca de problemas de performance
- Refatorar código React/Next.js existente
- Otimizar tamanho de bundle ou tempos de carregamento

## Categorias de regras por prioridade

| Prioridade | Categoria                      | Impacto     | Prefixo      |
| ---------- | ------------------------------ | ----------- | ------------ |
| 1          | Eliminar cascatas (waterfalls) | CRÍTICO     | `async-`     |
| 2          | Otimização de bundle           | CRÍTICO     | `bundle-`    |
| 3          | Performance no servidor        | ALTO        | `server-`    |
| 4          | Data fetching no cliente       | MÉDIO-ALTO  | `client-`    |
| 5          | Otimização de re-render        | MÉDIO       | `rerender-`  |
| 6          | Performance de renderização    | MÉDIO       | `rendering-` |
| 7          | Performance JavaScript         | BAIXO-MÉDIO | `js-`        |
| 8          | Padrões avançados              | BAIXO       | `advanced-`  |

## Referência rápida

### 1. Eliminar waterfalls (CRÍTICO)

- `async-defer-await` - Mova await para ramos onde é realmente usado
- `async-parallel` - Use Promise.all() para operações independentes
- `async-dependencies` - Use better-all para dependências parciais
- `async-api-routes` - Inicie promises cedo, await tarde em rotas de API
- `async-suspense-boundaries` - Use Suspense para streaming de conteúdo

### 2. Otimização de bundle (CRÍTICO)

- `bundle-barrel-imports` - Importe direto, evite barrel files
- `bundle-dynamic-imports` - Use next/dynamic para componentes pesados
- `bundle-defer-third-party` - Carregue analytics/logs após hidratação
- `bundle-conditional` - Carregue módulos só quando a feature estiver ativa
- `bundle-preload` - Preload em hover/focus para sensação de rapidez

### 3. Performance no servidor (ALTO)

- `server-auth-actions` - Autentique server actions como rotas de API
- `server-cache-react` - Use React.cache() para deduplicação por requisição
- `server-cache-lru` - Use cache LRU entre requisições
- `server-dedup-props` - Evite serialização duplicada em props RSC
- `server-serialization` - Minimize dados enviados a client components
- `server-parallel-fetching` - Reestruture componentes para paralelizar fetches
- `server-after-nonblocking` - Use after() para operações não bloqueantes

### 4. Data fetching no cliente (MÉDIO-ALTO)

- `client-swr-dedup` - Use SWR para deduplicação automática
- `client-event-listeners` - Deduplique listeners globais
- `client-passive-event-listeners` - Use listeners passivos no scroll
- `client-localstorage-schema` - Versione e minimize dados em localStorage

### 5. Otimização de re-render (MÉDIO)

- `rerender-defer-reads` - Não inscreva em estado só usado em callbacks
- `rerender-memo` - Extraia trabalho caro para componentes memoizados
- `rerender-memo-with-default-value` - Eleve props padrão não primitivas
- `rerender-dependencies` - Use dependências primitivas em effects
- `rerender-derived-state` - Inscreva-se em booleanos derivados, não valores crus
- `rerender-derived-state-no-effect` - Derive estado durante render, não em effects
- `rerender-functional-setstate` - Use forma funcional de setState para callbacks estáveis
- `rerender-lazy-state-init` - Passe função ao useState para valores caros
- `rerender-simple-expression-in-memo` - Evite memo para primitivos simples
- `rerender-move-effect-to-event` - Coloque lógica de interação em handlers
- `rerender-transitions` - Use startTransition para updates não urgentes
- `rerender-use-ref-transient-values` - Use refs para valores transientes frequentes

### 6. Performance de renderização (MÉDIO)

- `rendering-animate-svg-wrapper` - Anime wrapper div, não o SVG
- `rendering-content-visibility` - Use content-visibility em listas longas
- `rendering-hoist-jsx` - Extraia JSX estático para fora dos componentes
- `rendering-svg-precision` - Reduza precisão de coordenadas SVG
- `rendering-hydration-no-flicker` - Script inline para dados só cliente
- `rendering-hydration-suppress-warning` - Suprima mismatches esperados
- `rendering-activity` - Use componente Activity para mostrar/ocultar
- `rendering-conditional-render` - Use ternário, não &&, em condicionais
- `rendering-usetransition-loading` - Prefira useTransition para loading

### 7. Performance JavaScript (BAIXO-MÉDIO)

- `js-batch-dom-css` - Agrupe mudanças CSS via classes ou cssText
- `js-index-maps` - Construa Map para buscas repetidas
- `js-cache-property-access` - Cacheie acessos a propriedades em loops
- `js-cache-function-results` - Cacheie resultados em Map no módulo
- `js-cache-storage` - Cacheie leituras de localStorage/sessionStorage
- `js-combine-iterations` - Una filter/map em um loop
- `js-length-check-first` - Verifique length antes de comparação cara
- `js-early-exit` - Retorne cedo das funções
- `js-hoist-regexp` - Extraia RegExp para fora dos loops
- `js-min-max-loop` - Use loop para min/max em vez de sort
- `js-set-map-lookups` - Use Set/Map para lookup O(1)
- `js-tosorted-immutable` - Use toSorted() para imutabilidade

### 8. Padrões avançados (BAIXO)

- `advanced-event-handler-refs` - Guarde handlers em refs
- `advanced-init-once` - Inicialize app uma vez por load
- `advanced-use-latest` - useLatest para refs de callback estáveis

## Como usar

Leia os arquivos de regra individuais para explicações e exemplos:

```
rules/async-parallel.md
rules/bundle-barrel-imports.md
```

Cada arquivo de regra contém:

- Breve explicação do porquê importa
- Exemplo incorreto com explicação
- Exemplo correto com explicação
- Contexto extra e referências

## Documento compilado completo

Para o guia completo com todas as regras expandidas: `AGENTS.md`
