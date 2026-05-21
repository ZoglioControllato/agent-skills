# Referência de API

## Vinculação de ATIVOS

A ligação `ASSETS` fornece acesso a ativos estáticos através da interface `Fetcher`.

### Definição de tipo

```typescript
interface Env {
  ASSETS: Fetcher
}

interface Fetcher {
  fetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response>
}
```

### Assinaturas de Método

```typescript
// 1. Forward entire request
await env.ASSETS.fetch(request)

// 2. String path (hostname ignored, only path matters)
await env.ASSETS.fetch('https://any-host/path/to/asset.png')

// 3. URL object
await env.ASSETS.fetch(new URL('/index.html', request.url))

// 4. Constructed Request object
await env.ASSETS.fetch(
  new Request(new URL('/logo.png', request.url), {
    method: 'GET',
    headers: request.headers,
  }),
)
```

**Comportamentos principais:**

- Host/origem é ignorado para entradas de string/URL (somente o caminho é usado)
- O método deve ser GET (outros retornam 405)
- Passagem de cabeçalhos de solicitação (afeta a resposta)
- Retorna o objeto `Response` padrão

## Tratamento de solicitações

### Resolução de caminho

````typescript
// All resolve to same asset:
env.ASSETS.fetch('https://example.com/logo.png')
env.ASSETS.fetch('https://ignored.host/logo.png')
env.ASSETS.fetch('/logo.png')
```Os ativos são resolvidos em relação ao `assets.directory` configurado.

### Cabeçalhos

Cabeçalhos de solicitação que afetam a resposta:

| Cabeçalho | Efeito |
| ------------------- | ----------------------------------------- |
| `Aceitar codificação` | Controla a compactação (gzip, brotli) |
| `Alcance` | Permite conteúdo parcial (206 respostas) |
| `If-None-Match` | Solicitação condicional via ETag |
| `Se-Modificado-Desde` | Pedido condicional através da data de modificação |

Os cabeçalhos personalizados passam, mas não afetam a veiculação de recursos.

### Suporte ao Método

| Método | Suportado | Resposta |
| ------------------- | --------- | ---------------------- |
| `OBTER` | ✅ Sim | Conteúdo de ativos |
| `CABEÇA` | ✅ Sim | Somente cabeçalhos, sem corpo |
| `POST`, `PUT`, etc. | ❌Não | Método 405 não permitido |

## Comportamento de resposta

### Inferência de tipo de conteúdo

Definido automaticamente com base na extensão do arquivo:

| Extensão | Tipo de conteúdo |
| --------------- | -------------------------- |
| `.html` | `texto/html; conjunto de caracteres=utf-8` |
| `.css` | `texto/css` |
| `.js` | `aplicativo/javascript` |
| `.json` | `aplicativo/json` |
| `.png` | `imagem/png` |
| `.jpg`, `.jpeg` | `imagem/jpeg` |
| `.svg` | `imagem/svg+xml` |
| `.woff2` | `fonte/woff2` |

### Cabeçalhos padrão

As respostas incluem:
````

Content-Type: <inferred>
ETag: "<hash>"
Cache-Control: public, max-age=3600
Content-Encoding: br (if supported and beneficial)

```

**Padrões de controle de cache:**

- 1 hora (`max-age=3600`) para a maioria dos ativos
- Substituição por meio da transformação de resposta do trabalhador (consulte padrões.md:27-35)

### Compressão

Compressão automática baseada em `Accept-Encoding`:

- **Brotli** (`br`): Melhor compactação preferida
- **Gzip** (`gzip`): substituto
- **Nenhum**: se o cliente não oferece suporte ou o ativo é muito pequeno

### Geração de ETag

ETags são hashes baseados em conteúdo:
```

ETag: "a3b2c1d4e5f6..."
```Usado para solicitações condicionais (`If-None-Match`). Retorna `304 Not Modified` se corresponder.

## Respostas de erro

| Estado | Condição                        | Comportamento                                        |
| ------ | ------------------------------- | ---------------------------------------------------- |
| `404`  | Ativo não encontrado            | O corpo depende da configuração `not_found_handling` |
| `405`  | Método não GET/HEAD             | `{ "error": "Método não permitido" }`                |
| `416`  | Cabeçalho de intervalo inválido | Intervalo não satisfatório                           |

### 404 Manuseio

Depende da configuração (consulte configuration.md:45-52):

```typescript
// not_found_handling: "single-page-application"
// Returns /index.html with 200 status

// not_found_handling: "404-page"
// Returns /404.html if exists, else 404 response

// not_found_handling: "none"
// Returns 404 response
```

##Uso Avançado

### Modificando respostas

````typescript
const response = await env.ASSETS.fetch(request)

// Clone and modify
return new Response(response.body, {
  status: response.status,
  headers: {
    ...Object.fromEntries(response.headers),
    'Cache-Control': 'public, max-age=31536000',
    'X-Custom': 'value',
  },
})
```Consulte padrões.md:27-35 para obter um exemplo completo.

### Tratamento de erros
```typescript
const response = await env.ASSETS.fetch(request)

if (!response.ok) {
  // Asset not found or error
  return new Response('Custom error page', { status: 404 })
}

return response
````

### Veiculação Condicional

````typescript
const url = new URL(request.url)

// Serve different assets based on conditions
if (url.pathname === '/') {
  return env.ASSETS.fetch('/index.html')
}

return env.ASSETS.fetch(request)
```Consulte padrões.md para padrões completos.
````
