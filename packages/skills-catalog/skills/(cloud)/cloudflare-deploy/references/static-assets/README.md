# Referência de habilidade de ativos estáticos da Cloudflare

Orientação especializada para implantar e configurar ativos estáticos com Cloudflare Workers. Esta habilidade abrange padrões de configuração, arquiteturas de roteamento, uso de vinculação de ativos e práticas recomendadas para SPAs, sites SSG e aplicativos full-stack.

## Início rápido```jsonc

// wrangler.jsonc
{
"name": "my-app",
"main": "src/index.ts",
"compatibility_date": "2025-01-01",
"assets": {
"directory": "./dist",
},
}

````

```typescript
// src/index.ts
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    return env.ASSETS.fetch(request)
  },
}
````

Implantar: `implantação do wrangler`

## Quando usar ativos estáticos de trabalhadores versus páginas

| Fator                       | Ativos estáticos de trabalhadores              | Páginas Cloudflare             |
| --------------------------- | ---------------------------------------------- | ------------------------------ |
| **Caso de uso**             | Aplicativos híbridos (API estática + dinâmica) | Sites estáticos, SSG           |
| **Controle do trabalhador** | Controle total sobre roteamento                | Limitado (Funções)             |
| **Configuração**            | Código primeiro, flexível                      | Baseado em Git, opinativo      |
| **Roteamento dinâmico**     | Padrões que priorizam o trabalhador            | Funções (\_funções/)           |
| **Melhor para**             | Aplicativos full-stack, SPAs com APIs          | Jamstack, documentos estáticos |

**Árvore de decisão:**

- Precisa de lógica de roteamento personalizada? → Ativos estáticos de trabalhadores
- Site estático puro ou SSG? → Páginas
- Rotas API + SPA? → Ativos estáticos de trabalhadores
- Framework (Next, Nuxt, Remix)? → Páginas

## Ordem de leitura

1. **configuration.md** - Configuração, opções wrangler.jsonc, padrões de roteamento
2. **api.md** - API de vinculação de ASSETS, tratamento de solicitação/resposta
3. **patterns.md** - Padrões comuns (SPA, rotas de API, autenticação, testes A/B)
4. **gotchas.md** - Limites, erros, dicas de desempenho

## Nesta referência

- **[configuration.md](configuration.md)** - Instalação, implantação, configuração
- **[api.md](api.md)** - endpoints de API, métodos, interfaces
- **[patterns.md](patterns.md)** - Padrões comuns, casos de uso, exemplos
- **[gotchas.md](gotchas.md)** - Solução de problemas, práticas recomendadas, limitações

## Veja também

- [Documentos do Cloudflare Workers](https://developers.cloudflare.com/workers/)
- [Documentos sobre ativos estáticos](https://developers.cloudflare.com/workers/static-assets/)
- [Páginas Cloudflare](https://developers.cloudflare.com/pages/)
