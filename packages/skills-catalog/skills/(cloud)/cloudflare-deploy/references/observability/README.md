# Referência de habilidade de observabilidade da Cloudflare

**Objetivo**: Orientação abrangente para implementar a observabilidade no Cloudflare Workers, abrangendo rastreamentos, logs, métricas e análises.

**Escopo**: APENAS recursos de observabilidade da Cloudflare: Workers Logs, Traces, Analytics Engine, Logpush, Metrics & Analytics e exportações OpenTelemetry.

---

## Árvore de decisão: qual arquivo carregar?

Use isto para rotear para o arquivo correto sem carregar todo o conteúdo:```
├─ "Como eu habilito/configuro o X?" → configuração.md
├─ "Qual é a API/método/ligação para X?" → api.md
├─ "Como faço para implementar o padrão X?" → padrões.md
│ ├─ Rastreamento de uso/faturamento → padrões.md
│ ├─ Rastreamento de erros → padrões.md
│ ├─ Monitoramento de desempenho → padrões.md
│ ├─ Rastreamento multilocatário → padrões.md
│ ├─ Filtragem do Tail Worker → padrões.md
│ └─ Exportação OpenTelemetry → padrões.md
└─ "Por que o X não está funcionando?" / "Limites?" → pegadinhas.md

```
## Ordem de leitura

Carregue os arquivos nesta ordem com base na tarefa:

| Tipo de tarefa | Ordem de carregamento | Razão |
| --------------------- | --------------------------------- | ---------------------------------- |
| **Configuração inicial** | configuração.md → gotchas.md | Configure primeiro, evite armadilhas |
| **Implementar recurso** | padrões.md → api.md → gotchas.md | Padrão → detalhes da API → casos extremos |
| **Problema de depuração** | gotchas.md → configuração.md | Problemas comuns primeiro |
| **Consultar dados** | api.md → padrões.md | Sintaxe da API → exemplos de consulta |

## Visão geral do produto

### Registros de trabalhadores

- **O que:** Saída do console de Workers (console.log/warn/error)
- **Acesso:** Painel (registros em tempo real), Logpush, Tail Workers
- **Custo:** Gratuito (incluído em todos os Trabalhadores)
- **Retenção:** Somente em tempo real (sem armazenamento histórico no painel)

### Rastreamentos de trabalhadores

- **O que:** Rastreamentos de execução com tempo, uso de CPU, resultado
- **Acesso:** Painel (Workers Analytics → Traces), Logpush
- **Custo:** US$ 0,10/1 milhão de períodos (o preço do GA começa em 1º de março de 2026), 10 milhões gratuitos/mês
- **Retenção:** 14 dias incluídos

### Mecanismo de análise

- **O quê:** Armazenamento de eventos de alta cardinalidade e consultas SQL
- **Acesso:** API SQL, Dashboard (Analytics → Analytics Engine)
- **Custo:** US$ 0,25/1 milhão de gravações além de 10 milhões gratuitas/mês
- **Retenção:** 90 dias (configurável até 1 ano)

### Trabalhadores de cauda

- **O que:** Trabalhadores que recebem logs/rastreamentos de outros Trabalhadores
- **Casos de uso:** Filtragem de log, transformação, exportação externa
- **Custo:** Preços de trabalhadores padrão

### Logpush

- **O que:** Transmita logs para armazenamento externo (S3, R2, Datadog, etc.)
- **Acesso:** Painel, API
- **Custo:** Requer plano Business/Enterprise

## Resumo de preços (2026)

| Recurso | Nível gratuito | Custo além do nível gratuito | Requisito do plano |
| ---------------- | ---------------- | --------------------- | -------------------------------- |
| Registros de trabalhadores | Ilimitado | Grátis | Qualquer |
| Traços de trabalhadores | 10 milhões de vãos/mês | Períodos de US$ 0,10/1 milhão | Trabalhadores remunerados (GA: 1º de março de 2026) |
| Mecanismo de análise | 10 milhões de gravações/mês | US$ 0,25/1 milhão de gravações | Trabalhadores remunerados |
| Logpush | N/A | Incluído no plano | Negócios/Empresa |

## Nesta referência

- **[configuration.md](configuration.md)** - Instalação, implantação, configuração (Logs, Traces, Analytics Engine, Tail Workers, Logpush)
- **[api.md](api.md)** - endpoints de API, métodos, interfaces (GraphQL, SQL, ligações, tipos)
- **[patterns.md](patterns.md)** - Padrões comuns, casos de uso, exemplos (faturamento, monitoramento, rastreamento de erros, exportações)
- **[gotchas.md](gotchas.md)** - Solução de problemas, práticas recomendadas, limitações (erros comuns, dicas de desempenho, preços)

## Veja também

- [Documentos do Cloudflare Workers](https://developers.cloudflare.com/workers/)
- [Documentos do Analytics Engine](https://developers.cloudflare.com/analytics/analytics-engine/)
- [Documentos sobre rastreamentos de trabalhadores](https://developers.cloudflare.com/workers/observability/traces/)
```
