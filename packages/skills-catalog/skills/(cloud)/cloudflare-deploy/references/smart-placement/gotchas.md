# Dicas de posicionamento inteligente

## Erros Comuns

### "INSUFICIENT_INVOCATIONS"

**Causa:** tráfego insuficiente para análise do Posicionamento inteligente
**Solução:**

- Garantir que o Worker receba tráfego global consistente
- Espere mais (a análise leva até 15 minutos)
- Envie tráfego de teste de vários locais globais
- Verifique se o Worker possui um manipulador de eventos de busca

### "APLICATIVO_INSUPPORTADO"

**Causa:** o posicionamento inteligente tornou o Worker mais lento em vez de mais rápido
**Motivos:**

- O trabalhador não faz chamadas de back-end (executa mais rápido na borda)
- As chamadas de back-end são armazenadas em cache (a latência da rede para o usuário é mais importante)
- O serviço backend tem boa distribuição global
- Worker veicula ativos estáticos ou conteúdo de páginas

**Soluções:**

- Desative o posicionamento inteligente: `{ "placement": { "mode": "off" } }`
- Analise se o Worker realmente se beneficia do Smart Placement
- Considere uma estratégia de cache para reduzir chamadas de back-end
- Para trabalhadores de páginas/assets, use um trabalhador de back-end separado com posicionamento inteligente

### "Nenhuma métrica de duração da solicitação"

**Causa:** Posicionamento inteligente não ativado, tempo decorrido insuficiente, tráfego insuficiente ou análise incompleta
**Solução:**

- Certifique-se de que o posicionamento inteligente esteja ativado na configuração
- Aguarde mais de 15 minutos após a implantação
- Verifique se o Worker tem tráfego suficiente
- Verifique se `placement_status` é `SUCCESS`

### "cabeçalho de posicionamento cf ausente"

**Causa:** Posicionamento inteligente não ativado, recurso beta removido ou Worker ainda não analisado
**Solução:** verifique se o posicionamento inteligente está ativado, aguarde a análise (15 minutos), verifique se o recurso beta ainda está disponível

## Páginas/recursos + degradação do desempenho do posicionamento inteligente

**Problema:** Ativos estáticos carregam de 2 a 5 vezes mais devagar quando o Smart Placement é ativado com `run_worker_first = true`.

**Causa:** o Smart Placement encaminha TODAS as solicitações (incluindo ativos estáticos como HTML, CSS, JS, imagens) para locais remotos. O conteúdo estático SEMPRE deve ser veiculado na borda mais próxima do usuário.

**Solução:** divida em trabalhadores separados OU desative o Smart Placement:```jsonc
// ❌ BAD - Assets routed away from user
{
"name": "pages-app",
"placement": { "mode": "smart" },
"assets": { "run_worker_first": true }
}

// ✅ GOOD - Assets at edge, API optimized
// frontend/wrangler.jsonc
{
"name": "frontend",
"assets": { "run_worker_first": true }
// No placement field - stays at edge
}

// backend/wrangler.jsonc
{
"name": "backend-api",
"placement": { "mode": "smart" }
}

````
Esta é uma das configurações incorretas mais comuns e impactantes do Smart Placement.

## Trabalhador Monolítico Full Stack

**Problema:** Lógica de front-end e back-end em um único Worker com Smart Placement habilitado.

**Causa:** o posicionamento inteligente otimiza a latência de back-end, mas aumenta o tempo de resposta do usuário.

**Solução:** Dividir em dois Trabalhadores:```jsonc
// frontend/wrangler.jsonc
{
  "name": "frontend",
  "placement": { "mode": "off" },  // Explicit: stay at edge
  "services": [{ "binding": "BACKEND", "service": "backend-api" }]
}

// backend/wrangler.jsonc
{
  "name": "backend-api",
  "placement": { "mode": "smart" },
  "d1_databases": [{ "binding": "DB", "database_id": "xxx" }]
}
````

## Confusão de Desenvolvimento Local

**Problema:** O posicionamento inteligente não funciona no `wrangler dev`.

**Explicação:** O Smart Placement é ativado apenas em implantações de produção, não em desenvolvimento local.

**Solução:** Teste o posicionamento inteligente no ambiente de teste: `wrangler deploy --env staging`

## Tráfego de base e tempo de análise

**Observação:** O Smart Placement roteia 1% das solicitações SEM otimização para comparação (esperado).

**Tempo de análise:** Até 15 minutos. Durante a análise, o Worker é executado no limite. Monitore `placement_status`.

## Métodos RPC não afetados (limitação crítica)

**Problema:** O posicionamento inteligente foi ativado no back-end, mas as chamadas RPC ainda estão lentas.

**Causa:** O posicionamento inteligente APENAS afeta os manipuladores `fetch`. Os métodos RPC (Service Bindings com `WorkerEntrypoint`) NUNCA são afetados.

**Por que:** RPC ignora o manipulador `fetch` - o Smart Placement só pode rotear solicitações `fetch`.

**Solução:** converter para vinculações de serviço baseadas em busca:```typescript
// ❌ RPC - Smart Placement has NO EFFECT
export class BackendRPC extends WorkerEntrypoint {
async getData() {
// ALWAYS runs at edge
return await this.env.DATABASE.prepare('SELECT \* FROM table').all()
}
}

// ✅ Fetch - Smart Placement WORKS
export default {
async fetch(request: Request, env: Env): Promise<Response> {
// Runs close to DATABASE when Smart Placement enabled
const data = await env.DATABASE.prepare('SELECT \* FROM table').all()
return Response.json(data)
},
}

````

## Requirements

- **Wrangler 2.20.0+** required
- **Consistent multi-region traffic** needed for analysis
- **Only affects fetch handlers** - RPC methods and named entrypoints not affected

## Limits

| Resource/Limit       | Value            | Notes                       |
| -------------------- | ---------------- | --------------------------- |
| Analysis time        | Up to 15 minutes | After enabling              |
| Baseline traffic     | 1%               | Routed without optimization |
| Min Wrangler version | 2.20.0+          | Required                    |
| Traffic requirement  | Multi-region     | Consistent needed           |

## Disabling Smart Placement

```jsonc
{ "placement": { "mode": "off" } } // Explicit disable
// OR remove "placement" field entirely (same effect)
````

Ambos os comportamentos são idênticos - o trabalhador é executado na borda mais próxima do usuário.

## Quando NÃO usar o posicionamento inteligente

- Trabalhadores que atendem apenas conteúdo estático ou respostas em cache
- Trabalhadores sem comunicação de back-end significativa
- Lógica de borda pura (verificações de autenticação, redirecionamentos, transformações simples)
- Trabalhadores sem manipuladores de eventos fetch
- Trabalhadores de páginas/assets com `run_worker_first = true`
- Trabalhadores que usam métodos RPC em vez de manipuladores de busca

Esses cenários não serão beneficiados e poderão ter pior desempenho com o posicionamento inteligente.
