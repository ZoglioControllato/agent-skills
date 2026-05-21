# Posicionamento inteligente de trabalhadores da Cloudflare

Otimização automática do posicionamento da carga de trabalho para minimizar a latência, executando Workers mais próximos da infraestrutura de back-end, e não dos usuários finais.

## Conceito Central

O Smart Placement analisa automaticamente a duração da solicitação do trabalhador em toda a rede global da Cloudflare e encaminha as solicitações de maneira inteligente para locais ideais de data center. Em vez de usar como padrão o local mais próximo do usuário final, o Smart Placement pode encaminhar solicitações para locais mais próximos da infraestrutura de back-end quando isso reduz a duração geral da solicitação.

### Quando usar

**Ative o posicionamento inteligente quando:**

- O trabalhador faz várias viagens de ida e volta para serviços/bancos de dados de back-end
- A infraestrutura de back-end está geograficamente concentrada
- Duração da solicitação dominada pela latência de back-end em vez da latência da rede do usuário
- Execução de lógica backend em Workers (APIs, agregação de dados, SSR com chamadas de banco de dados)
- Worker usa manipulador `fetch` (não métodos RPC)

**NÃO habilite para:**

- Trabalhadores que atendem apenas conteúdo estático ou respostas em cache
- Trabalhadores sem comunicação de back-end significativa
- Lógica de borda pura (verificações de autenticação, redirecionamentos, transformações simples)
- Trabalhadores sem manipuladores de eventos fetch
- Trabalhadores com métodos RPC ou pontos de entrada nomeados (somente manipuladores `fetch` são afetados)
- Trabalhadores de páginas/assets com `run_worker_first = true` (degrada o fornecimento de ativos)

### Árvore de decisão```

O seu Worker tem um manipulador de busca?
├─ Não → O posicionamento inteligente não funciona (pular)
└─ Sim
│
Faz múltiplas chamadas de back-end (DB/API)?
├─ Não → Não ativar (não vai ajudar)
└─ Sim
│
O back-end está concentrado geograficamente?
├─ Não (distribuído globalmente) → Provavelmente não vai ajudar
└─ Sim ou incerto
│
Serve ativos estáticos com run_worker_first=true?
├─ Sim → Não ativar (prejudicará o desempenho)
└─ Não → Ativar posicionamento inteligente
│
Após 15 minutos, verifique o posicionamento_status
├─ SUCESSO → Monitore métricas
├─ INSUFFICIENT_INVOCATIONS → Precisa de mais tráfego
└─ UNSUPPORTED_APPLICATION → Desativar (prejudicando o desempenho)

```

### Key Architecture Pattern

**Recommended:** Split full-stack applications into separate Workers:

```

User → Frontend Worker (at edge, close to user)
↓ Service Binding
Backend Worker (Smart Placement enabled, close to DB/API)
↓
Database/Backend Service

````

This maintains fast, reactive frontends while optimizing backend latency.

## Quick Start

```jsonc
// wrangler.jsonc
{
  "placement": {
    "mode": "smart", // or "off" to explicitly disable
  },
}
````

Implante e aguarde 15 minutos para análise. Verifique o status por meio de API ou métricas do painel.

**Para desabilitar:** Defina `"mode": "off"` ou remova completamente o campo `placement` (ambos equivalentes).

## Requisitos

- Disputador 2.20.0+
- Tempo de análise: Até 15 minutos após a ativação
- Requisitos de tráfego: tráfego consistente de vários locais globais
- Disponível em todos os planos Workers (Gratuito, Pago, Empresarial)

## Valores de status de veiculação```typescript

type PlacementStatus =
| undefined // Not yet analyzed
| 'SUCCESS' // Successfully optimized
| 'INSUFFICIENT_INVOCATIONS' // Not enough traffic
| 'UNSUPPORTED_APPLICATION' // Made Worker slower (reverted)

````

## CLI Commands

```bash
# Deploy with Smart Placement
wrangler deploy

# Check placement status
curl -H "Authorization: Bearer $TOKEN" \
  https://api.cloudflare.com/client/v4/accounts/$ACCOUNT_ID/workers/services/$WORKER_NAME \
  | jq .result.placement_status

# Monitor
wrangler tail your-worker-name --header cf-placement
````

## Ordem de leitura

**Primeira vez?** Comece aqui:

1. Este README – entenda os conceitos básicos e quando usar o Smart Placement
2. [configuration.md](./configuration.md) - configure o wrangler.jsonc e entenda as limitações
3. [patterns.md](./patterns.md) - veja exemplos práticos para seu caso de uso
4. [api.md](./api.md) - monitore e verifique se o posicionamento inteligente está funcionando
5. [gotchas.md](./gotchas.md) - solucionar problemas comuns

**Pesquisa rápida:**

- "Devo ativar o posicionamento inteligente?" → Consulte "Quando usar" acima
- "Como faço para configurar isso?" → [configuration.md](./configuration.md)
- "Como faço para dividir frontend/backend?" → [padrões.md](./padrões.md)
- "Por que não está funcionando?" → [gotchas.md](./gotchas.md)

## Nesta referência

- [configuration.md](./configuration.md) - configuração do wrangler.jsonc, valores de modo, regras de validação
- [api.md](./api.md) - API de status de posicionamento, cabeçalho cf-placement, monitoramento
- [patterns.md](./patterns.md) - Divisão frontend/backend, trabalhadores de banco de dados, padrões SSR
- [gotchas.md](./gotchas.md) - Solução de problemas de INSUFFICIENT_INVOCATIONS, problemas de desempenho

## Veja também

- [workers](../workers/) - Tempo de execução do trabalhador e manipuladores de busca
- [d1](../d1/) - Banco de dados D1 que se beneficia do Smart Placement
- [durable-objects](../durable-objects/) - Objetos duráveis com lógica de back-end
- [bindings](../bindings/) - Vinculações de serviço para divisão frontend/backend
