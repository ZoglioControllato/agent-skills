# Padrões de análise da web

## Depuração do Core Web Vitals

Painel → Core Web Vitals → Métrica de clique → Visualização de depuração mostra os 5 principais elementos problemáticos.

### Correções de LCP

```html
<!-- Priority hints -->
<img src="hero.jpg" loading="eager" fetchpriority="high" />
<link rel="preload" as="image" href="/hero.jpg" fetchpriority="high" />
```

### Correções CLS

```css
/* Reserve space */
.ad-container {
  min-height: 250px;
}
img {
  width: 400px;
  height: 300px;
} /* Explicit dimensions */
```

### Correções INP

````typescript
// Debounce expensive operations
const handleInput = debounce(search, 300)

// Yield to main thread
await task()
await new Promise((r) => setTimeout(r, 0))
await task2()

// Move to Web Worker for heavy computation
```| Métrica | Bom | Pobre |
| ------ | ------ | ------ |
| PCL | ≤2,5s | >4s |
| INP | ≤200ms | >500ms |
| CLS | ≤0,1 | >0,25 |

## Consentimento do GDPR
```typescript
// Load beacon only after consent
const consent = localStorage.getItem('analytics-consent')
if (consent === 'accepted') {
  const script = document.createElement('script')
  script.src = 'https://static.cloudflareinsights.com/beacon.min.js'
  script.setAttribute('data-cf-beacon', '{"token": "TOKEN", "spa": true}')
  document.body.appendChild(script)
}
```Alternativa: Dashboard → "Ativar, excluindo dados de visitantes na UE"

## Navegação SPA
```html
<!-- REQUIRED for React/Vue/etc routing -->
<script data-cf-beacon='{"token": "TOKEN", "spa": true}' ...></script>
```Sem `spa: true`: apenas o carregamento de página inicial rastreado.

## Separação de preparação/produção
```typescript
// Use env-specific tokens
const token = process.env.NEXT_PUBLIC_CF_ANALYTICS_TOKEN
// .env.production: production token
// .env.staging: staging token (or empty to disable)
````

##Filtragem de bots

Painel → Filtros → “Excluir tráfego de bot”

Filtros: rastreadores de pesquisa, serviços de monitoramento, bots conhecidos.  
Não filtrado: Navegadores sem cabeça (Dramaturgo/Puppeteer).

## Impacto do bloqueador de anúncios

Cerca de 25-40% dos usuários podem bloquear `cloudflareinsights.com`. Nenhuma solução alternativa oficial.
O painel mostra a linha de base mínima; use os logs do servidor para obter uma imagem completa.

## Limitações

- Sem rastreamento de parâmetros UTM
- Sem webhooks/alertas/API
- Nenhum domínio de beacon personalizado
- Máximo de 10 sites sem proxy
