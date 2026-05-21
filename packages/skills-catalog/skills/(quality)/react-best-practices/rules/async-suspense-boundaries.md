---
title: Limites de Suspense Estratégico
impact: HIGH
impactDescription: pintura inicial mais rápida
tags: async, suspense, streaming, layout-shift
---

## Limites de Suspense Estratégico

Ao aguardar dados em componentes assíncronos antes de retornar JSX, use limites de Suspense para exibir o wrapper da interface mais rápido enquanto os dados carregam.

**Incorreto (wrapper bloqueado pela busca de dados):**

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

Todo o layout espera os dados, embora seja apenas uma seção do meio preciso deles.

**Correto (wrapper aparece na hora; dados fluem depois):**

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

Barra lateral, cabeçalho e rodapé são renderizados na hora. Só o DataDisplay espera pelos dados.

**Alternativa (compartilhar promessa entre componentes):**

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

Os dois componentes compartilham a mesma promessa, então só ocorre uma busca. O layout renderiza na hora enquanto ambos aguardam juntos.

**Quando NÃO usar este padrão:**

- Dados críticos para decisões de layout (afetam posicionamento)
- Conteúdo crítico para SEO acima da dobra
- Consultas pequenas e rápidas em que o overhead do Suspense não vale a pena
- Quando você quiser evitar mudança de layout (salto de carregamento → conteúdo)

**Compromisso:** pintura inicial mais rápida versus possível mudança de layout. Escolha conforme as prioridades de UX.
