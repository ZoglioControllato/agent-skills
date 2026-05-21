---
name: best-practices
description: Aplica boas práticas modernas de desenvolvimento web em segurança, compatibilidade e qualidade de código. Use quando pedirem "aplique boas práticas", "auditoria de segurança", "modernize o código", "revisão de qualidade" ou "verifique vulnerabilidades". NÃO use para acessibilidade (use web-accessibility), SEO (use seo), performance (use core-web-vitals) ou auditorias multiárea (use web-quality-audit).
license: MIT
metadata:
  author: web-quality-skills
  version: '1.0'
---

# Boas práticas

Padrões modernos de desenvolvimento web alinhados às auditorias de Boas práticas do Lighthouse. Abrange segurança, compatibilidade de navegador e padrões de qualidade de código.

## Segurança

### HTTPS em qualquer lugar

**Aplicar HTTPS:**

```html
<!-- ❌ Mixed content -->
<img src="http://example.com/image.jpg" />
<script src="http://cdn.example.com/script.js"></script>

<!-- ✅ HTTPS only -->
<img src="https://example.com/image.jpg" />
<script src="https://cdn.example.com/script.js"></script>

<!-- ✅ Protocol-relative (will use page's protocol) -->
<img src="//example.com/image.jpg" />
```

**Cabeçalho HSTS:**

```
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
```

### Política de Segurança de Conteúdo (CSP)

```html
<!-- Basic CSP via meta tag -->
<meta
  http-equiv="Content-Security-Policy"
  content="default-src 'self'; 
               script-src 'self' https://trusted-cdn.com; 
               style-src 'self' 'unsafe-inline';
               img-src 'self' data: https:;
               connect-src 'self' https://api.example.com;"
/>

<!-- Better: HTTP header -->
```

**Cabeçalho CSP (recomendado):**

```
Content-Security-Policy:
  default-src 'self';
  script-src 'self' 'nonce-abc123' https://trusted.com;
  style-src 'self' 'nonce-abc123';
  img-src 'self' data: https:;
  connect-src 'self' https://api.example.com;
  frame-ancestors 'self';
  base-uri 'self';
  form-action 'self';
```

**Usando nonces para scripts embutidos:**

```html
<script nonce="abc123">
  // This inline script is allowed
</script>
```

### Cabeçalhos de segurança

```

# Prevent clickjacking
X-Frame-Options: DENY

# Prevent MIME type sniffing
X-Content-Type-Options: nosniff

# Enable XSS filter (legacy browsers)
X-XSS-Protection: 1; mode=block

# Control referrer information
Referrer-Policy: strict-origin-when-cross-origin

# Permissions policy (formerly Feature-Policy)
Permissions-Policy: geolocation=(), microphone=(), camera=()
```

### Nenhuma biblioteca vulnerável

```bash

# Check for vulnerabilities
npm audit
yarn audit

# Auto-fix when possible
npm audit fix

# Check specific package
npm ls lodash
```

**Mantenha as dependências atualizadas:**

```json
// package.json
{
  "scripts": {
    "audit": "npm audit --audit-level=moderate",
    "update": "npm update && npm audit fix"
  }
}
```

**Padrões vulneráveis ​​conhecidos a serem evitados:**

```javascript
// ❌ Prototype pollution vulnerable patterns
Object.assign(target, userInput)
_.merge(target, userInput)

// ✅ Safer alternatives
const safeData = JSON.parse(JSON.stringify(userInput))
```

### Sanitização de entrada

```javascript
// ❌ XSS vulnerable
element.innerHTML = userInput
document.write(userInput)

// ✅ Safe text content
element.textContent = userInput

// ✅ If HTML needed, sanitize
import DOMPurify from 'dompurify'
element.innerHTML = DOMPurify.sanitize(userInput)
```

### Cookies seguros

```javascript

// ❌ Insecure cookie
document.cookie = "session=abc123";

// ✅ Secure cookie (server-side)
Set-Cookie: session=abc123; Secure; HttpOnly; SameSite=Strict; Path=/
```

---

## Compatibilidade do navegador

### Declaração de tipo de documento

```html
<!-- ❌ Missing or invalid doctype -->
<html>
  <!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01//EN">

  <!-- ✅ HTML5 doctype -->
  <!DOCTYPE html>
  <html lang="en"></html>
</html>
```

### Codificação de caracteres

```html
<!-- ❌ Missing or late charset -->
<html>
  <head>
    <title>Page</title>
    <meta charset="UTF-8" />
  </head>

  <!-- ✅ Charset as first element in head -->
  <html>
    <head>
      <meta charset="UTF-8" />
      <title>Page</title>
    </head>
  </html>
</html>
```

### Meta tag da janela de visualização

```html
<!-- ❌ Missing viewport -->
<head>
  <title>Page</title>
</head>

<!-- ✅ Responsive viewport -->
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Page</title>
</head>
```

### Detecção de recursos

```javascript

// ❌ Browser detection (brittle)
if (navigator.userAgent.includes('Chrome')) {
  // Chrome-specific code
}

// ✅ Feature detection
if ('IntersectionObserver' in window) {
  // Use IntersectionObserver
} else {
  // Fallback
}

// ✅ Using @supports in CSS
@supports (display: grid) {
  .container {
    display: grid;
  }
}

@supports not (display: grid) {
  .container {
    display: flex;
  }
}
```

### Polyfills (quando necessário)

```html
<!-- Load polyfills conditionally -->
<script>
  if (!('fetch' in window)) {
    document.write('<script src="/polyfills/fetch.js"><\/script>')
  }
</script>

<!-- Or use polyfill.io -->
<script src="https://polyfill.io/v3/polyfill.min.js?features=fetch,IntersectionObserver"></script>
```

---

## APIs obsoletas

### Evite estes

```javascript

// ❌ document.write (blocks parsing)
document.write('<script src="..."></script>');

// ✅ Dynamic script loading
const script = document.createElement('script');
script.src = '...';
document.head.appendChild(script);

// ❌ Synchronous XHR (blocks main thread)
const xhr = new XMLHttpRequest();
xhr.open('GET', url, false); // false = synchronous

// ✅ Async fetch
const response = await fetch(url);

// ❌ Application Cache (deprecated)
<html manifest="cache.manifest">

// ✅ Service Workers
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js');
}
```

### Ouvinte de evento passivo

```javascript
// ❌ Non-passive touch/wheel (may block scrolling)
element.addEventListener('touchstart', handler)
element.addEventListener('wheel', handler)

// ✅ Passive listeners (allows smooth scrolling)
element.addEventListener('touchstart', handler, { passive: true })
element.addEventListener('wheel', handler, { passive: true })

// ✅ If you need preventDefault, be explicit
element.addEventListener('touchstart', handler, { passive: false })
```

---

## Console e erros

### Sem erros de console

```javascript
// ❌ Errors in production
console.log('Debug info') // Remove in production
throw new Error('Unhandled') // Catch all errors

// ✅ Proper error handling
try {
  riskyOperation()
} catch (error) {
  // Log to error tracking service
  errorTracker.captureException(error)
  // Show user-friendly message
  showErrorMessage('Something went wrong. Please try again.')
}
```

### Limites de erro (React)

```jsx
class ErrorBoundary extends React.Component {
  state = { hasError: false }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    errorTracker.captureException(error, { extra: info })
  }

  render() {
    if (this.state.hasError) {
      return <FallbackUI />
    }
    return this.props.children
  }
}

// Usage
;<ErrorBoundary>
  <App />
</ErrorBoundary>
```

### Manipulador de erros global

```javascript
// Catch unhandled errors
window.addEventListener('error', (event) => {
  errorTracker.captureException(event.error)
})

// Catch unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
  errorTracker.captureException(event.reason)
})
```

---

## Mapas de origem

### Configuração de produção

```javascript
// ❌ Source maps exposed in production
// webpack.config.js
module.exports = {
  devtool: 'source-map', // Exposes source code
}

// ✅ Hidden source maps (uploaded to error tracker)
module.exports = {
  devtool: 'hidden-source-map',
}

// ✅ Or no source maps in production
module.exports = {
  devtool: process.env.NODE_ENV === 'production' ? false : 'source-map',
}
```

---

## Performance Boas práticas

### Evite padrões de bloqueio

```javascript

// ❌ Blocking script
<script src="heavy-library.js"></script>

// ✅ Deferred script
<script defer src="heavy-library.js"></script>

// ❌ Blocking CSS import
@import url('other-styles.css');

// ✅ Link tags (parallel loading)
<link rel="stylesheet" href="styles.css">
<link rel="stylesheet" href="other-styles.css">
```

### Manipuladores de eventos eficientes

```javascript
// ❌ Handler on every element
items.forEach((item) => {
  item.addEventListener('click', handleClick)
})

// ✅ Event delegation
container.addEventListener('click', (e) => {
  if (e.target.matches('.item')) {
    handleClick(e)
  }
})
```

### Gerenciamento de memória

```javascript
// ❌ Memory leak (never removed)
const handler = () => {
  /* ... */
}
window.addEventListener('resize', handler)

// ✅ Cleanup when done
const handler = () => {
  /* ... */
}
window.addEventListener('resize', handler)

// Later, when component unmounts:
window.removeEventListener('resize', handler)

// ✅ Using AbortController
const controller = new AbortController()
window.addEventListener('resize', handler, { signal: controller.signal })

// Cleanup:
controller.abort()
```

---

## Qualidade do código

### HTML válido

```html
<!-- ❌ Invalid HTML -->
<div id="header">
  <div id="header">
    <!-- Duplicate ID -->

    <ul>
      <div>Item</div>
      <!-- Invalid child -->
    </ul>

    <a href="/"><button>Click</button></a>
    <!-- Invalid nesting -->

    <!-- ✅ Valid HTML -->
    <header id="site-header"></header>

    <ul>
      <li>Item</li>
    </ul>

    <a href="/" class="button">Click</a>
  </div>
</div>
```

### HTML semântico

```html
<!-- ❌ Non-semantic -->
<div class="header">
  <div class="nav">
    <div class="nav-item">Home</div>
  </div>
</div>
<div class="main">
  <div class="article">
    <div class="title">Headline</div>
  </div>
</div>

<!-- ✅ Semantic HTML5 -->
<header>
  <nav>
    <a href="/">Home</a>
  </nav>
</header>
<main>
  <article>
    <h1>Headline</h1>
  </article>
</main>
```

### Proporções de imagem

```html
<!-- ❌ Distorted images -->
<img src="photo.jpg" width="300" height="100" />
<!-- If actual ratio is 4:3, this squishes the image -->

<!-- ✅ Preserve aspect ratio -->
<img src="photo.jpg" width="300" height="225" />
<!-- Actual 4:3 dimensions -->

<!-- ✅ CSS object-fit for flexibility -->
<img src="photo.jpg" style="width: 300px; height: 200px; object-fit: cover;" />
```

---

## Permissões e privacidade

### Solicite permissões corretamente

```javascript
// ❌ Request on page load (bad UX, often denied)
navigator.geolocation.getCurrentPosition(success, error)

// ✅ Request in context, after user action
findNearbyButton.addEventListener('click', async () => {
  // Explain why you need it
  if (await showPermissionExplanation()) {
    navigator.geolocation.getCurrentPosition(success, error)
  }
})
```

### Política de permissões

```html
<!-- Restrict powerful features -->
<meta http-equiv="Permissions-Policy" content="geolocation=(), camera=(), microphone=()" />

<!-- Or allow for specific origins -->
<meta http-equiv="Permissions-Policy" content="geolocation=(self 'https://maps.example.com')" />
```

---

## Lista de verificação de auditoria

### Segurança (crítica)

- [] HTTPS ativado, sem conteúdo misto
- [] Sem dependências vulneráveis (`auditoria npm`)
- [] cabeçalhos CSP configurados
- [] Cabeçalhos de segurança presentes
- [] Nenhum mapa de origem exposto

### Compatibilidade

- [] Tipo de documento HTML5 válido
- [] Charset declarado primeiro no head
- [] Meta tag da janela de visualização presente
- [] Nenhuma API obsoleta usada
- [] Ouvintes de eventos passivos para rolagem/toque

### Qualidade do código

- [] Sem erros de console
- [] HTML válido (sem IDs duplicados)
- [] Elementos HTML semânticos usados
- [] Tratamento adequado de erros
- [] Limpeza de memória em componentes

###experiência do usuário

- [] Sem intersticiais intrusivos
- [] Solicitações de permissão no contexto
- [] Limpar mensagens de erro
- [] Proporções de imagem apropriadas

## Ferramentas

| Ferramenta                                         | Finalidade                      |
| -------------------------------------------------- | ------------------------------- |
| `auditoria npm`                                    | Vulnerabilidades de dependência |
| [SecurityHeaders.com](https://securityheaders.com) | Análise de cabeçalho            |
| [Validador W3C](https://validator.w3.org)          | Validação HTML                  |

| Farol

| Boas práticas auditoria |
| [Observatório](https://observatory.mozilla.org) | Verificação de segurança |

## Referências

- [Segurança Web MDN](https://developer.mozilla.org/en-US/docs/Web/Security)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Auditoria de qualidade da Web](../web-quality-audit/SKILL.md)
