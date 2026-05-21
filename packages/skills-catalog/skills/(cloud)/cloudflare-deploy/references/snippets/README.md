# Referência de habilidades de snippets da Cloudflare

## Descrição

Orientação especializada para **SOMENTE Snippets da Cloudflare**: uma plataforma lógica de borda leve baseada em JavaScript para modificar solicitações e respostas HTTP. Os snippets são executados como parte do mecanismo de conjunto de regras e são incluídos sem custo adicional em planos pagos (Pro, Business, Enterprise).

## O que são trechos?

Snippets são funções JavaScript executadas na borda como parte do Ruleset Engine da Cloudflare. Características principais:

- **Tempo de execução**: limite de CPU de 5 ms por solicitação
- **Limite de tamanho**: 32 KB por snippet
- **Tempo de execução**: isolamento V8 (subconjunto de APIs de trabalhadores)
- **Subsolicitações**: 2 a 5 chamadas de busca, dependendo do plano
- **Custo**: Incluído nos planos Pro/Business/Enterprise

## Snippets vs Matriz de Decisão de Trabalhadores

| Fator                 | Escolha trechos se...                        | Escolha trabalhadores se...                            |
| --------------------- | -------------------------------------------- | ------------------------------------------------------ |
| **Complexidade**      | Modificações simples de solicitação/resposta | Lógica de negócios complexa, roteamento, middleware    |
| **Tempo de execução** | <5ms suficientes                             | Precisa de >5ms ou tempo variável                      |
| **Subsolicitações**   | 2-5 chamadas de busca são suficientes        | Precisa de >5 subsolicitações ou orquestração complexa |
| **Tamanho do código** | <32 KB suficientes                           | Precisa de dependências> 32 KB ou npm                  |
| **Custo**             | Quer custo adicional zero                    | Pode pagar US$ 5/mês + uso                             |
| **APIs**              | Precisa de busca básica, cabeçalhos, URL     | Precisa de KV, D1, R2, objetos duráveis, gatilhos cron |
| **Implantação**       | Precisa de gatilhos baseados em regras       | Quer lógica de roteamento personalizada                |

**Regra geral**: Use Snippets para modificações, Workers para aplicativos.

## Modelo de Execução

1. A solicitação chega na borda da Cloudflare
2. O mecanismo de conjunto de regras avalia regras de snippet (expressões de filtro)
3. Se a regra corresponder, o snippet será executado dentro do limite de 5 ms
4. A solicitação/resposta modificada continua através do pipeline
5. Resposta devolvida ao cliente

Os snippets são executados de forma síncrona no caminho da solicitação – o desempenho é crítico.

## Ordem de leitura

1. **[configuration.md](configuration.md)** - Comece aqui: configuração, métodos de implantação (Dashboard/API/Terraform)
2. **[api.md](api.md)** - APIs principais: solicitação, resposta, cabeçalhos, propriedades `request.cf`
3. **[patterns.md](patterns.md)** - Exemplos do mundo real: roteamento geográfico, testes A/B, cabeçalhos de segurança
4. **[gotchas.md](gotchas.md)** - Solução de problemas: erros comuns, dicas de desempenho, limitações de API

## Nesta referência

- **[configuration.md](configuration.md)** - Instalação, implantação, configuração
- **[api.md](api.md)** - endpoints de API, métodos, interfaces
- **[patterns.md](patterns.md)** - Padrões comuns, casos de uso, exemplos
- **[gotchas.md](gotchas.md)** - Solução de problemas, práticas recomendadas, limitações

## Início rápido```javascript

// Snippet: Add security headers
export default {
async fetch(request) {
const response = await fetch(request)
const newResponse = new Response(response.body, response)
newResponse.headers.set('X-Frame-Options', 'DENY')
newResponse.headers.set('X-Content-Type-Options', 'nosniff')
return newResponse
},
}

```

Deploy via Dashboard (Rules → Snippets) or API/Terraform. See configuration.md for details.

## See Also

- [Cloudflare Docs](https://developers.cloudflare.com/rules/snippets/)
```
