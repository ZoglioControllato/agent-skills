# Trabalhadores de cauda da Cloudflare

Workers especializados que consomem eventos de execução de Workers produtores para registro, depuração, análise e observabilidade.

## Quando usar esta referência

- Implementação de observabilidade/registro para Cloudflare Workers
- Processamento de eventos de execução de Worker, logs, exceções
- Criação de análises personalizadas ou rastreamento de erros
- Configurar streaming de eventos em tempo real
- Trabalhar com manipuladores de cauda ou consumidores de cauda

## Conceitos Básicos

### O que são trabalhadores de cauda?

Os Tail Workers processam automaticamente eventos dos Workers produtores (os Workers sendo monitorados). Eles recebem:

- Informações de solicitação/resposta HTTP
- Logs do console (`console.log/error/warn/debug`)
- Exceções não detectadas
- Resultados de execução (`ok`, `exception`, `exceededCpu`, etc.)
- Eventos de canal de diagnóstico

**Características principais:**

- Invocado APÓS o produtor terminar a execução
- Capture todo o ciclo de vida da solicitação, incluindo vinculações de serviço e subsolicitações de envio dinâmico
- Faturado por tempo de CPU, não por contagem de solicitações
- Disponível nos níveis Workers Paid e Enterprise

### Alternativa: Exportação OpenTelemetry

**Antes de usar Tail Workers, considere OpenTelemetry:**

Para exportações em lote para ferramentas de observabilidade (Sentry, Grafana, Honeycomb):

- A exportação OTEL envia logs/rastreamentos em lotes (mais eficiente)
- Integrações integradas com plataformas populares
- Menor sobrecarga do que os trabalhadores de cauda
- **Use Tail Workers apenas para processamento personalizado em tempo real**

## Árvore de decisão```

Precisa de observabilidade para trabalhadores?
├─ Exportação em lote para ferramentas conhecidas (Sentry/Grafana/Honeycomb)?
│ └─ Use exportação OpenTelemetry (não Tail Workers)
├─ É necessário processamento personalizado em tempo real?
│ ├─ Métricas agregadas?
│ │ └─ Usar Tail Worker + Mecanismo de análise
│ ├─ Rastreamento de erros?
│ │ └─ Usar Tail Worker + serviço externo
│ ├─ Registro/depuração personalizada?
│ │ └─ Usar Tail Worker + endpoint KV/HTTP
│ └─ Processamento de eventos complexos?
│ └─ Use Tail Worker + Objetos Duráveis
└─ Depuração rápida?
└─ Use `wrangler tail` (diferente de Tail Workers)

````
## Ordem de leitura

1. **[configuration.md](configuration.md)** - Configurar trabalhadores finais
2. **[api.md](api.md)** - Assinatura do manipulador, tipos, redação
3. **[patterns.md](patterns.md)** - Casos de uso e integrações comuns
4. **[gotchas.md](gotchas.md)** - Armadilhas e dicas de depuração

## Exemplo rápido```typescript
export default {
  async tail(events, env, ctx) {
    // Process events from producer Worker
    ctx.waitUntil(
      fetch(env.LOG_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(events),
      }),
    )
  },
}
````

## Habilidades Relacionadas

- **observabilidade** - Padrões de observabilidade dos Trabalhadores Gerais, exportação OTEL
- **analytics-engine** - Armazenamento de métricas agregadas para dados de eventos finais
- **durable-objects** - Processamento de eventos com estado, agrupamento de eventos finais
- **logpush** - Alternativa para exportação de log em lote (não em tempo real)
- **trabalhadores para plataformas** - Despacho dinâmico com consumidores finais
