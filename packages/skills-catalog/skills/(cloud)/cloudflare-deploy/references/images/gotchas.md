# Dicas e boas práticas

## Modos de ajuste (fit)

| Modo         | Melhor para         | Comportamento                        |
| ------------ | ------------------- | ------------------------------------ |
| `cover`      | Hero, miniaturas    | Preenche o espaço, corta o excesso   |
| `contain`    | Produtos, arte      | Mantém a imagem inteira, pode padear |
| `scale-down` | Uploads de usuários | Nunca aumenta                        |
| `crop`       | Cortes precisos     | Usa gravidade                        |
| `pad`        | Proporção fixa      | Adiciona fundo                       |

## Escolha de formato

```typescript
format: 'auto' // Recommended - negotiates best format
```

**Suporte:** AVIF (Chrome 85+, Firefox 93+, Safari 16.4+), WebP (Chrome 23+, Firefox 65+, Safari 14+)

## Configurações de qualidade

| Caso de uso    | Qualidade   |
| -------------- | ----------- |
| Miniaturas     | 75-80       |
| Padrão         | 85 (padrão) |
| Alta qualidade | 90-95       |

## Erros comuns

### 5403: “Falha na transformação da imagem”

- Verifique `width`/`height` ≤ 12000
- Verifique `quality` 1-100, `dpr` 1-3
- Não combine opções incompatíveis

### 9413: “Limite de taxa excedido”

Implemente cache e espera exponencial:

```typescript
for (let i = 0; i < 3; i++) {
  try { return await env.IMAGES.input(buffer).transform({...}).output(); }
  catch { await new Promise(r => setTimeout(r, 2 ** i * 1000)); }
}
```

### 5401: “Imagem muito grande”

Pré-processe antes do envio (máx. 100 MB, 12.000 × 12.000 px)

### 5400: “Formato de imagem inválido”

Suportados: JPEG, PNG, GIF, WebP, AVIF, SVG

### 401/403: “Não autorizado”

Verifique se o token da API tem permissão `Cloudflare Images → Edit`

## Limites

| Recurso                 | Limite             |
| ----------------------- | ------------------ |
| Tamanho máx. de entrada | 100 MB             |
| Largura/altura máx.     | 12.000 × 12.000 px |
| Faixa de qualidade      | 1-100              |
| Faixa DPR               | 1-3                |
| Limite de taxa da API   | ~1200 req/min      |

## Armadilhas do AVIF

- **Codificação mais lenta:** a primeira requisição pode ter maior latência
- **Detecção de navegador:**

```typescript
const format = /image\/avif/.test(request.headers.get('Accept') || '') ? 'avif' : 'webp'
```

## Antipadrões

```typescript
// ❌ No caching - transforms every request
return env.IMAGES.input(buffer).transform({...}).output().response();

// ❌ cover without both dimensions
transform({ width: 800, fit: 'cover' })

// ✅ Always set both for cover
transform({ width: 800, height: 600, fit: 'cover' })

// ❌ Exposes API token to client
// ✅ Use Direct Creator Upload (patterns.md)
```

## Depuração

```typescript
// Check response headers
console.log('Content-Type:', response.headers.get('Content-Type'))

// Test with curl
// curl -I "https://imagedelivery.net/{hash}/{id}/width=800,format=avif"

// Monitor logs
// npx wrangler tail
```

Documentação localizada no ecossistema mantido pelo Controllato Club.
