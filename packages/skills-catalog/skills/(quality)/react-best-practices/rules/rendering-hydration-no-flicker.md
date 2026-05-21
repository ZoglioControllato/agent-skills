---
title: Evite incompatibilidade de hidratação sem cintilação
impact: MEDIUM
impactDescription: evita cintilação visual e erros de hidratação
tags: rendering, ssr, hydration, localStorage, flicker
---

## Evite incompatibilidade de hidratação sem cintilação

Ao renderizar conteúdo que depende de armazenamento no cliente (localStorage, cookies), evite tanto quebras o SSR quanto flicker após a hidratação injetando um script síncrono que atualiza o DOM antes do React hidratar.

**Incorreto (quebra SSR):**

```tsx
function ThemeWrapper({ children }: { children: ReactNode }) {
  // localStorage is not available on server - throws error
  const theme = localStorage.getItem('theme') || 'light'

  return <div className={theme}>{children}</div>
}
```

O SSR falha porque `localStorage` é indefinido.

**Incorreto (cintilação visual):**

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

O componente renderiza primeiro com o valor padrão (`light`) e atualiza após a hidratação, causando flash visível de conteúdo incorreto.

**Correto (sem flicker, sem incompatibilidade de hidratação):**

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

O script inline executa de forma síncrona antes de exibir o elemento, garantindo que o DOM já tenha o valor certo. Sem cintilação e sem incompatibilidade de hidratação.

O padrão é útil para temas, preferências, estado de autenticação e qualquer dado só do cliente que deva aparecer na hora sem flash do valor padrão.
