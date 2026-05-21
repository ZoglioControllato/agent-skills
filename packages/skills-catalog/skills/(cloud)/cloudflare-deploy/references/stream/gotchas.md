# Armadilhas Stream

## Erros comuns

### "ERR_NON_VIDEO"

**Causa:** arquivo enviado não é um formato de vídeo válido  
**Solução:** use formatos suportados (MP4, MKV, MOV, AVI, FLV, MPEG-2 TS/PS, MXF, LXF, GXF, 3GP, WebM, MPG, QuickTime)

### "ERR_DURATION_EXCEED_CONSTRAINT"

**Causa:** duração excede `maxDurationSeconds`  
**Solução:** aumente o limite na config de upload direto ou corte o vídeo antes

### "ERR_FETCH_ORIGIN_ERROR"

**Causa:** falha ao baixar vídeo da URL (upload por URL)  
**Solução:** URL pública, HTTPS e arquivo disponível

### "ERR_MALFORMED_VIDEO"

**Causa:** arquivo corrompido ou encoding inadequado  
**Solução:** reencode com FFmpeg ou valide a fonte

### "ERR_DURATION_TOO_SHORT"

**Causa:** vídeo precisa ter pelo menos ~0,1 s  
**Solução:** garanta duração válida (não um único frame)

## Solução de problemas

### Vídeo preso em "inprogress"

- **Causa:** processamento grande/complexo
- **Solução:** aguarde até ~5 min; use webhooks em vez de polling

### URL assinada retorna 403

- **Causa:** token expirado ou assinatura inválida
- **Solução:** confira `exp`, JWK e sincronismo de relógio

### Live não conecta

- **Causa:** URL RTMPS ou stream key inválidos
- **Solução:** use exatamente URL/chave da API; firewall permitindo saída 443

### Falha na verificação de assinatura do webhook

- **Causa:** secret errado ou janela de tempo
- **Solução:** use o secret exato do setup; aceite deriva de até ~5 min no timestamp

### Upload ok mas vídeo não aparece

- **Causa:** `requireSignedURLs` sem token
- **Solução:** gere token ou `requireSignedURLs: false` para público

### Player carrega indefinidamente

- **Causa:** CORS / allowedOrigins
- **Solução:** inclua seu domínio em `allowedOrigins`

## Limites

| Recurso                           | Limite                                        |
| --------------------------------- | --------------------------------------------- |
| Tamanho máx. arquivo              | 30 GB                                         |
| Taxa de quadros máx.              | 60 fps (recomendado)                          |
| Duração máx. por upload direto    | configurável via `maxDurationSeconds`         |
| Geração de token (endpoint API)   | ~1.000/dia recomendado (use chaves para mais) |
| Saídas ao vivo (simulcast)        | 5 por entrada ao vivo                         |
| Tentativas de retry do webhook    | 5 (backoff exponencial)                       |
| Timeout do webhook                | 30 segundos                                   |
| Tamanho do arquivo de legenda     | 5 MB                                          |
| Tamanho da imagem de marca d’água | 2 MB                                          |
| Chaves de metadados por vídeo     | ilimitado                                     |
| Resultados de busca por página    | máx. 1.000                                    |

## Desempenho

### Upload lento

- **Causa:** arquivo grande ou rede
- **Solução:** TUS, comprimir antes, checar largura de banda

### Buffer na reprodução

- **Causa:** congestionamento ou pouca banda
- **Solução:** ABR com HLS/DASH; reduzir bitrate máx.

### Processamento longo

- **Causa:** codec complexo ou alta resolução
- **Solução:** pré-codificar H.264; reduzir resolução

## Tipagem

```typescript
// Error response type
interface StreamError {
  success: false
  errors: Array<{
    code: number
    message: string
  }>
}

// Handle errors
async function uploadWithErrorHandling(url: string, file: File) {
  const formData = new FormData()
  formData.append('file', file)
  const response = await fetch(url, { method: 'POST', body: formData })
  const result = await response.json()

  if (!result.success) {
    throw new Error(result.errors[0]?.message || 'Upload failed')
  }
  return result
}
```

## Segurança

1. **Nunca exponha token de API no frontend** — use upload direto do criador
2. **Sempre verifique assinaturas de webhook**
3. **Expiração curta de tokens** quando fizer sentido
4. **requireSignedURLs para conteúdo privado**
5. **Lista allow de allowedOrigins** — evite embed não autorizado

## Nesta referência

- [README.md](./README.md)
- [configuration.md](./configuration.md)
- [api.md](./api.md)
- [api-live.md](./api-live.md)
- [patterns.md](./patterns.md)

## Ver também

- [workers](../workers/) — Stream com segurança em Workers

Documentação localizada no ecossistema mantido pelo Controllato Club.
