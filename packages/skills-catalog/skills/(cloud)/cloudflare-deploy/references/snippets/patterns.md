# Padrões de trechos

## Cabeçalhos de segurança

```javascript
export default {
  async fetch(request) {
    const response = await fetch(request)
    const newResponse = new Response(response.body, response)
    newResponse.headers.set('X-Frame-Options', 'DENY')
    newResponse.headers.set('X-Content-Type-Options', 'nosniff')
    newResponse.headers.delete('X-Powered-By')
    return newResponse
  },
}
```

**Regra:** `true` (todas as solicitações)

## Roteamento baseado em localização geográfica

```javascript
export default {
  async fetch(request) {
    const country = request.cf.country
    if (['GB', 'DE', 'FR'].includes(country)) {
      const url = new URL(request.url)
      url.hostname = url.hostname.replace('.com', '.eu')
      return Response.redirect(url.toString(), 302)
    }
    return fetch(request)
  },
}
```

##Teste A/B

```javascript
export default {
  async fetch(request) {
    const cookies = request.headers.get('Cookie') || ''
    let variant = cookies.match(/ab_test=([AB])/)?.[1] || (Math.random() < 0.5 ? 'A' : 'B')

    const req = new Request(request)
    req.headers.set('X-Variant', variant)
    const response = await fetch(req)

    if (!cookies.includes('ab_test=')) {
      const newResponse = new Response(response.body, response)
      newResponse.headers.append('Set-Cookie', `ab_test=${variant}; Path=/; Secure`)
      return newResponse
    }
    return response
  },
}
```

##Detecção de bots

```javascript
export default {
  async fetch(request) {
    const botScore = request.cf.botManagement?.score
    if (botScore && botScore < 30) return new Response('Denied', { status: 403 })
    return fetch(request)
  },
}
```

**Requer:** Plano de gerenciamento de bots

## Injeção de cabeçalho de autenticação de API

```javascript
export default {
  async fetch(request) {
    if (new URL(request.url).pathname.startsWith('/api/')) {
      const req = new Request(request)
      req.headers.set('X-Internal-Auth', 'secret_token')
      req.headers.delete('Authorization')
      return fetch(req)
    }
    return fetch(request)
  },
}
```

##Cabeçalhos CORS

```javascript
export default {
  async fetch(request) {
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      })
    }
    const response = await fetch(request)
    const newResponse = new Response(response.body, response)
    newResponse.headers.set('Access-Control-Allow-Origin', '*')
    return newResponse
  },
}
```

##Modo de manutenção

```javascript
export default {
  async fetch(request) {
    if (request.headers.get('X-Bypass-Token') === 'admin') return fetch(request)
    return new Response('<h1>Maintenance</h1>', {
      status: 503,
      headers: { 'Content-Type': 'text/html', 'Retry-After': '3600' },
    })
  },
}
```

##Seleção de padrão

| Padrão                  | Complexidade | Caso de uso                 |
| ----------------------- | ------------ | --------------------------- |
| Cabeçalhos de segurança | Baixo        | Todos os sites              |
| Geo-Roteamento          | Baixo        | Conteúdo regional           |
| Teste A/B               | Médio        | Experimentos                |
| Detecção de bots        | Médio        | Requer gerenciamento de bot |
| Autenticação de API     | Baixo        | Proteção de back-end        |
| CORS                    | Baixo        | Terminais de API            |
| Manutenção              | Baixo        | Implantações                |
