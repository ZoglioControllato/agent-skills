# Solução de problemas e armadilhas

## Regras críticas

### ❌ Pular validação no servidor

**Problema:** validação só no cliente é facilmente burlada.  
**Solução:** sempre valide no servidor.

```javascript
// CORRECT - Server validates token
app.post('/submit', async (req, res) => {
  const token = req.body['cf-turnstile-response']
  const validation = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    body: JSON.stringify({ secret: SECRET, response: token }),
  }).then((r) => r.json())

  if (!validation.success) return res.status(403).json({ error: 'CAPTCHA failed' })
})
```

### ❌ Expor a chave secreta

**Problema:** secret vazou no código do cliente.  
**Solução:** validação só no servidor. Nunca envie o secret ao cliente.

### ❌ Reutilizar tokens (regra de uso único)

**Problema:** tokens são de uso único; revalidar falha com `timeout-or-duplicate`.  
**Solução:** gere novo token por envio; reinicie o widget em erro.

```javascript
if (!response.ok) window.turnstile.reset(widgetId)
```

### ❌ Ignorar expiração do token

**Problema:** tokens expiram após 5 minutos.  
**Solução:** trate `expired-callback` ou use auto-refresh.

```javascript
window.turnstile.render('#container', {
  sitekey: 'YOUR_SITE_KEY',
  'refresh-expired': 'auto', // or 'manual' with expired-callback
  'expired-callback': () => window.turnstile.reset(widgetId),
})
```

## Erros comuns

| Erro                       | Causa                                             | Solução                                                          |
| -------------------------- | ------------------------------------------------- | ---------------------------------------------------------------- |
| **Widget not rendering**   | sitekey errado, CSP bloqueando, protocolo file:// | Confira sitekey, CSP para challenges.cloudflare.com, use http(s) |
| **timeout-or-duplicate**   | Token expirou ou foi reutilizado                  | Token novo; não guarde cache além de ~5 min                      |
| **invalid-input-secret**   | Secret incorreto                                  | Painel e variáveis de ambiente                                   |
| **missing-input-response** | Token não enviado                                 | Nome do campo `cf-turnstile-response`                            |

## Armadilhas em frameworks

### React: remontagem do widget

**Problema:** re-render perde token.  
**Solução:** controle o ciclo de vida com `useRef`.

```tsx
function TurnstileWidget({ onToken }) {
  const containerRef = useRef(null)
  const widgetIdRef = useRef(null)

  useEffect(() => {
    if (containerRef.current && !widgetIdRef.current) {
      widgetIdRef.current = window.turnstile.render(containerRef.current, {
        sitekey: 'YOUR_SITE_KEY',
        callback: onToken,
      })
    }
    return () => {
      if (widgetIdRef.current) {
        window.turnstile.remove(widgetIdRef.current)
        widgetIdRef.current = null
      }
    }
  }, [])

  return <div ref={containerRef} />
}
```

### React StrictMode: duplo render

**Problema:** widget renderiza duas vezes em dev.  
**Solução:** use cleanup.

```tsx
useEffect(() => {
  const widgetId = window.turnstile.render('#container', { sitekey })
  return () => window.turnstile.remove(widgetId)
}, [])
```

### Next.js: hidratação SSR

**Problema:** `window.turnstile` indefinido no SSR.  
**Solução:** `'use client'` ou import dinâmico com `ssr: false`.

```tsx
'use client'
export default function Turnstile() {
  /* component */
}
```

### SPA: navegação sem cleanup

**Problema:** widgets órfãos após navegação.  
**Solução:** remova no cleanup.

```javascript
// Vue
onBeforeUnmount(() => window.turnstile.remove(widgetId))

// React
useEffect(() => () => window.turnstile.remove(widgetId), [])
```

## Rede e segurança

### CSP bloqueando

**Problema:** CSP bloqueia script/iframe.  
**Solução:** diretivas CSP.

```html
<meta
  http-equiv="Content-Security-Policy"
  content="script-src 'self' https://challenges.cloudflare.com; 
               frame-src https://challenges.cloudflare.com;"
/>
```

### Encaminhamento de IP

**Problema:** servidor vê IP do proxy, não do cliente.  
**Solução:** header correto.

```javascript
// Cloudflare Workers
const ip = request.headers.get('CF-Connecting-IP')

// Behind proxy
const ip = request.headers.get('X-Forwarded-For')?.split(',')[0]
```

### CORS (Siteverify)

**Problema:** CORS ao chamar siteverify do navegador.  
**Solução:** nunca chame siteverify no cliente; backend chama siteverify.

## Limites

| Limite         | Valor                                  | Impacto                |
| -------------- | -------------------------------------- | ---------------------- |
| Validade token | 5 minutos                              | Regenerar após expirar |
| Uso do token   | Uso único                              | Não revalidar o mesmo  |
| Tamanho widget | 300×65px (normal), 130×120px (compact) | Planejar layout        |

## Depuração

### Log no console

```javascript
window.turnstile.render('#container', {
  sitekey: 'YOUR_SITE_KEY',
  callback: (token) => console.log('✓ Token:', token),
  'error-callback': (code) => console.error('✗ Error:', code),
  'expired-callback': () => console.warn('⏱ Expired'),
  'timeout-callback': () => console.warn('⏱ Timeout'),
})
```

### Estado do token

```javascript
const token = window.turnstile.getResponse(widgetId)
console.log('Token:', token || 'NOT READY')
console.log('Expired:', window.turnstile.isExpired(widgetId))
```

### Chaves de teste

Desenvolva primeiro com chaves de teste:

- Site: `1x00000000000000000000AA`
- Secret: `1x0000000000000000000000000000000AA`

### Aba Network

- `api.js` carrega (200)
- Requisição/resposta siteverify
- Erros 4xx/5xx

## Erros de configuração

### Par site/secret errado

**Problema:** site key de um widget, secret de outro.  
**Solução:** mesmo par no painel.

### Chaves de teste em produção

**Problema:** test keys no ar.  
**Solução:** chaves por ambiente.

```javascript
const SITE_KEY = process.env.NODE_ENV === 'production' ? process.env.TURNSTILE_SITE_KEY : '1x00000000000000000000AA'
```

### Variáveis de ambiente ausentes

**Problema:** secret indefinido no servidor.  
**Solução:** `.env` e carregamento.

```bash
# .env
TURNSTILE_SECRET=your_secret_here

# Verify
console.log('Secret loaded:', !!process.env.TURNSTILE_SECRET);
```

## Referência

- [Turnstile Docs](https://developers.cloudflare.com/turnstile/)
- [Dashboard](https://dash.cloudflare.com/?to=/:account/turnstile)
- [Error Codes](https://developers.cloudflare.com/turnstile/troubleshooting/)

Documentação localizada no ecossistema mantido pelo Controllato Club.
