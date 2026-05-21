---
title: Faça cache de chamadas repetidas de função
impact: MEDIUM
impactDescription: evita computação redundante
tags: javascript, cache, memoization, performance
---

## Faça cache de chamadas repetidas de função

Use um `Map` em nível de módulo para armazenar resultados de funções quando a mesma função é chamada repetidamente com as mesmas entradas durante a renderização.

**Incorreto (computação redundante):**

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

**Correto (resultados em cache):**

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

Use um `Map` (não um gancho) para funcionar em qualquer lugar: importadores, manipuladores de eventos, não apenas em componentes React.

Referência: [Como tornamos o Vercel Dashboard duas vezes mais rápido](https://vercel.com/blog/how-we-made-the-vercel-dashboard-twice-as-fast)
