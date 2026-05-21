# Smart Placement Configuration

## wrangler.jsonc Setup

```jsonc
{
  "$schema": "./node_modules/wrangler/config-schema.json",
  "placement": {
    "mode": "smart",
  },
}
```

## Valores do modo de posicionamento

| Modo             | Comportamento                                                                                |
| ---------------- | -------------------------------------------------------------------------------------------- |
| `"inteligente"`  | Habilite o posicionamento inteligente - otimização automática com base na análise de tráfego |
| `"desligado"`    | Desative explicitamente o Smart Placement - sempre execute na borda mais próxima do usuário  |
| Não especificado | Comportamento padrão - executado na borda mais próxima do usuário (o mesmo que `"off"`)      |

**Observação:** Posicionamento inteligente versus posicionamento explícito são recursos separados. O posicionamento inteligente (`mode: "smart"`) usa análise automática. Para controle de posicionamento manual, consulte opções de posicionamento explícitas (campos `region`, `host`, `hostname` - não abordados nesta referência).

## Configuração de divisão de front-end + back-end

### Frontend Worker (sem posicionamento inteligente)```jsonc

// frontend-worker/wrangler.jsonc
{
"name": "frontend",
"main": "frontend-worker.ts",
// No "placement" - runs at edge
"services": [
{
"binding": "BACKEND",
"service": "backend-api",
},
],
}

````

### Backend Worker (Smart Placement Enabled)

```jsonc
// backend-api/wrangler.jsonc
{
  "name": "backend-api",
  "main": "backend-worker.ts",
  "placement": {
    "mode": "smart",
  },
  "d1_databases": [
    {
      "binding": "DATABASE",
      "database_id": "xxx",
    },
  ],
}
````

## Requisitos e Limitações

### Requisitos

- **Versão do Wrangler:** 2.20.0+
- **Tempo de análise:** Até 15 minutos
- **Requisitos de tráfego:** Tráfego consistente em vários locais
- **Plano para trabalhadores:** Todos os planos (gratuito, pago, empresarial)

### O que o posicionamento inteligente afeta

**LIMITAÇÃO CRÍTICA - O posicionamento inteligente APENAS afeta os manipuladores `fetch`:**

O posicionamento inteligente é fundamentalmente limitado a trabalhadores com manipuladores `fetch` padrão. Esta é uma restrição arquitetônica chave.

- ✅ **Afeta:** SOMENTE manipuladores de eventos `fetch` (o método de busca da exportação padrão)
- ❌ **NÃO afeta:**
- Métodos RPC (Service Bindings com `WorkerEntrypoint` - veja exemplo abaixo)
- Pontos de entrada nomeados (exportações diferentes de `default`)
- Trabalhadores sem manipuladores `fetch`
- Consumidores de filas, manipuladores programados ou outros tipos de eventos

**Exemplo - O posicionamento inteligente APENAS afeta `fetch`:**

```typescript
// ✅ Smart Placement affects this:
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    // This runs close to backend when Smart Placement enabled
    const data = await env.DATABASE.prepare('SELECT * FROM users').all()
    return Response.json(data)
  },
}

// ❌ Smart Placement DOES NOT affect these:
export class MyRPC extends WorkerEntrypoint {
  async myMethod() {
    // This ALWAYS runs at edge, Smart Placement has NO EFFECT
    const data = await this.env.DATABASE.prepare('SELECT * FROM users').all()
    return data
  }
}

export async function scheduled(event: ScheduledEvent, env: Env) {
  // NOT affected by Smart Placement
}
```

**Consequência:** Se sua lógica de back-end usar métodos RPC (`WorkerEntrypoint`), o Smart Placement não poderá otimizar essas chamadas. Você deve usar padrões baseados em busca para que o posicionamento inteligente funcione.

**Solução:** converta métodos RPC para buscar endpoints ou use um wrapper Worker com manipulador `fetch` que chama seu RPC de back-end (embora isso adicione latência).

### Tráfego de linha de base

O Smart Placement roteia automaticamente 1% das solicitações SEM otimização como linha de base para comparação de desempenho.

### Regras de validação

**Campos mutuamente exclusivos:**

- `mode` não pode ser usado com campos de posicionamento explícitos (`region`, `host`, `hostname`)
- Escolha posicionamento inteligente OU posicionamento explícito, não ambos```jsonc
  // ✅ Valid - Smart Placement
  { "placement": { "mode": "smart" } }

// ✅ Valid - Explicit Placement (different feature)
{ "placement": { "region": "us-east1" } }

// ❌ Invalid - Cannot combine
{ "placement": { "mode": "smart", "region": "us-east1" } }

````

## Dashboard Configuration

**Workers & Pages** → Select Worker → **Settings** → **General** → **Placement: Smart** → Wait 15min → Check **Metrics**

## TypeScript Types

```typescript
interface Env {
  BACKEND: Fetcher
  DATABASE: D1Database
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const data = await env.DATABASE.prepare('SELECT * FROM table').all()
    return Response.json(data)
  },
} satisfies ExportedHandler<Env>
````

## Aviso de páginas/ativos da Cloudflare

**PROBLEMA CRÍTICO DE DESEMPENHO:** Ativar o posicionamento inteligente com `assets.run_worker_first = true` em projetos do Pages **degrada gravemente o desempenho do fornecimento de ativos**. Esta é uma das configurações incorretas mais comuns.

**Por que isso é ruim:**

- O Smart Placement direciona TODAS as solicitações (incluindo ativos estáticos) da borda para locais remotos
- Ativos estáticos (HTML, CSS, JS, imagens) SEMPRE devem ser veiculados na borda mais próxima do usuário
- Resultado: tempos de carregamento de ativos 2 a 5 vezes mais lentos, experiência do usuário ruim

**Problema:** o Smart Placement direciona as solicitações de ativos para fora da borda, mas os ativos estáticos sempre devem ser veiculados na borda mais próxima do usuário.

**Soluções (em ordem de preferência):**

1. **Recomendado:** Dividir em Workers separados (frontend na borda + backend com Smart Placement)
2. Defina `"mode": "off"` para desabilitar explicitamente o Smart Placement para Pages/Assets Workers
3. Use `assets.run_worker_first = false` (serve os ativos primeiro, ignora o Worker para conteúdo estático)```jsonc
   // ❌ BAD - Degrades asset performance by 2-5x
   {
   "name": "pages-app",
   "placement": { "mode": "smart" },
   "assets": { "run_worker_first": true }
   }

// ✅ GOOD - Frontend at edge, backend optimized
// frontend-worker/wrangler.jsonc
{
"name": "frontend",
"assets": { "run_worker_first": true }
// No placement - runs at edge
}

// backend-worker/wrangler.jsonc
{
"name": "backend-api",
"placement": { "mode": "smart" },
"d1_databases": [{ "binding": "DB", "database_id": "xxx" }]
}

```

**Key takeaway:** Never enable Smart Placement on Workers that serve static assets with `run_worker_first = true`.

## Local Development

Smart Placement does NOT work in `wrangler dev` (local only). Test by deploying: `wrangler deploy --env staging`
```
