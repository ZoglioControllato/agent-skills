# Referência da skill Cloudflare Images

**Cloudflare Images** é uma solução ponta a ponta de gestão de imagens com armazenamento, transformação, otimização e entrega em escala pela rede global da Cloudflare.

## Árvore de decisão rápida

**Precisa de:**

- **Transformar no Worker?** → [api.md](api.md#workers-binding-api-2026-primary-method) (Workers Binding API)
- **Enviar do Worker?** → [api.md](api.md#upload-from-worker) (REST API)
- **Enviar do cliente?** → [patterns.md](patterns.md#upload-from-client-direct-creator-upload) (Direct Creator Upload)
- **Configurar variantes?** → [configuration.md](configuration.md#variants-configuration)
- **Servir imagens responsivas?** → [patterns.md](patterns.md#responsive-images)
- **Adicionar marcas d’água?** → [patterns.md](patterns.md#watermarking)
- **Corrigir erros?** → [gotchas.md](gotchas.md#common-errors)

## Ordem de leitura

**Para implementar upload/transformação de imagens:**

1. [configuration.md](configuration.md) — configurar binding do Workers
2. [api.md](api.md#workers-binding-api-2026-primary-method) — API de transformação
3. [patterns.md](patterns.md#upload-from-client-direct-creator-upload) — padrão de upload direto
4. [gotchas.md](gotchas.md) — limites e erros

**Para transformações por URL:**

1. [configuration.md](configuration.md#variants-configuration) — criar variantes
2. [api.md](api.md#url-transform-api) — sintaxe de URL
3. [patterns.md](patterns.md#responsive-images) — padrões responsivos

**Para solução de problemas:**

1. [gotchas.md](gotchas.md#common-errors) — mensagens de erro
2. [gotchas.md](gotchas.md#limits) — limites de tamanho/formato

## Métodos principais

| Método                           | Caso de uso               | Localização          |
| -------------------------------- | ------------------------- | -------------------- |
| `env.IMAGES.input().transform()` | Transformar no Worker     | [api.md:11](api.md)  |
| REST API `/images/v1`            | Enviar imagens            | [api.md:57](api.md)  |
| Direct Creator Upload            | Upload do lado do cliente | [api.md:127](api.md) |
| Transformações por URL           | Entrega estática          | [api.md:112](api.md) |

## Nesta referência

- **[api.md](api.md)** — API completa: binding Workers, REST, URLs
- **[configuration.md](configuration.md)** — Setup: wrangler, variantes, auth, URLs assinadas
- **[patterns.md](patterns.md)** — Padrões: responsivo, marcas d’água, negociação de formato, cache
- **[gotchas.md](gotchas.md)** — Solução de problemas: limites, erros, boas práticas

## Recursos principais

- **Otimização automática** — negociação AVIF/WebP
- **Transformações sob demanda** — redimensionar, recortar, desfoque, nitidez via URL ou API
- **Binding no Workers** — transformar imagens no Workers (método principal em 2026)
- **Upload direto** — uploads seguros do cliente sem proxy no backend
- **Entrega global** — cache em mais de 300 data centers Cloudflare
- **Marca d’água** — sobrepor imagens programaticamente

## Ver também

- [Documentação oficial](https://developers.cloudflare.com/images/)
- [Exemplos Workers](https://developers.cloudflare.com/images/tutorials/)

Documentação localizada no ecossistema mantido pelo Controllato Club.
