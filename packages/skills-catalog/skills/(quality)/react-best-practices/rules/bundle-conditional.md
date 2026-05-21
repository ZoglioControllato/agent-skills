---
title: Carregamento condicional de módulos
impact: HIGH
impactDescription: carrega dados grandes só quando necessário
tags: bundle, conditional-loading, lazy-loading
---

## Carregamento condicional de módulos

Carregue dados ou módulos grandes apenas quando um recurso for ativado.

**Exemplo (lazy load de quadros de animação):**

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

A seleção `typeof window !== 'undefined'` evita empacotar este módulo para SSR, otimizando o pacote do servidor e a velocidade de construção.
