# Framework Integration

**Web Analytics is dashboard-only** - no programmatic API. This covers beacon integration.

## Basic HTML

```html
<script
  defer
  src="https://static.cloudflareinsights.com/beacon.min.js"
  data-cf-beacon='{"token": "YOUR_TOKEN", "spa": true}'
></script>
```

Coloque antes de fechar a tag `</body>`.

## Exemplos de estrutura

| Estrutura                      | Localização               | Notas                                           |
| ------------------------------ | ------------------------- | ----------------------------------------------- |
| Reagir/Vite                    | `público/index.html`      | Adicione `spa: verdadeiro`                      |
| Roteador de aplicativo Next.js | `app/layout.tsx`          | Use `<estratégia de script="afterInteractive">` |
| Páginas Next.js                | `páginas/_document.tsx`   | Use `<Script>`                                  |
| Próximo 3                      | `app.vue` com `useHead()` | Ou use o plugin                                 |
| Vista 3/Vite                   | `index.html`              | Adicione `spa: verdadeiro`                      |
| Gatsby                         | `gatsby-browser.js`       | Gancho `onClientEntry`                          |
| SvelteKit                      | `src/app.html`            | Antes de `</body>`                              |
| Astro                          | Componente de layout      | Antes de `</body>`                              |
| Angular                        | `src/index.html`          | Adicione `spa: verdadeiro`                      |
| Docussauro                     | `docusaurus.config.js`    | Na matriz `scripts`                             |

## Configuração```json

{
"token": "YOUR_TOKEN",
"spa": true
}

````
**Use `spa: true` para:** React Router, Vue Router, Next.js, Nuxt, Gatsby, SvelteKit, Angular

**Use `spa: false` para:** Servidor tradicional renderizado (PHP, Django, Rails, WordPress)

## Cabeçalhos CSP```
script-src 'self' https://static.cloudflareinsights.com;
connect-src 'self' https://cloudflareinsights.com;
````

## GDPR Consent

```typescript
// Load conditionally based on consent
if (localStorage.getItem('analytics-consent') === 'true') {
  const script = document.createElement('script')
  script.src = 'https://static.cloudflareinsights.com/beacon.min.js'
  script.defer = true
  script.setAttribute('data-cf-beacon', '{"token": "YOUR_TOKEN", "spa": true}')
  document.body.appendChild(script)
}
```
