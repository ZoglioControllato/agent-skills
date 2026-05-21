# Cron Triggers Configuration

## wrangler.jsonc

```jsonc
{
  "$schema": "./node_modules/wrangler/config-schema.json",
  "name": "my-cron-worker",
  "main": "src/index.ts",
  "compatibility_date": "2025-01-01", // Use current date for new projects

  "triggers": {
    "crons": [
      "*/5 * * * *", // Every 5 minutes
      "0 */2 * * *", // Every 2 hours
      "0 9 * * MON-FRI", // Weekdays at 9am UTC
      "0 2 1 * *", // Monthly on 1st at 2am UTC
    ],
  },
}
```

## Green Compute (Beta)

Schedule crons during low-carbon periods for carbon-aware execution:

```jsonc
{
  "name": "eco-cron-worker",
  "triggers": {
    "crons": ["0 2 * * *"],
  },
  "placement": {
    "mode": "smart", // Runs during low-carbon periods
  },
}
```

**Modos:**

- `"inteligente"` - Programação com reconhecimento de carbono (pode atrasar até 24h para uma janela ideal)
- Padrão (sem configuração de posicionamento) - Agendamento padrão (sem atraso)

**Como funciona:**

- Cloudflare atrasa a execução até que a intensidade de carbono da rede seja menor
- Atraso máximo: 24 horas a partir do horário programado
- Ideal para trabalhos em lote com requisitos de tempo flexíveis

**Casos de uso:**

- Processamento noturno de dados e pipelines ETL
- Geração de relatórios semanais/mensais
- Backups e manutenção de banco de dados
- Agregação analítica
- Treinamento de modelo de ML

**Não adequado para:**

- Operações urgentes (requisitos de SLA)
- Recursos voltados para o usuário que exigem execução imediata
- Monitoramento e alertas em tempo real
- Tarefas de conformidade com janelas de tempo rigorosas

## Cronogramas Específicos do Ambiente```jsonc

{
"name": "my-cron-worker",
"triggers": {
"crons": ["0 */6 * * *"], // Prod: every 6 hours
},
"env": {
"staging": {
"triggers": {
"crons": ["*/15 * * * *"], // Staging: every 15min
},
},
"dev": {
"triggers": {
"crons": ["*/5 * * * *"], // Dev: every 5min
},
},
},
}

````

## Schedule Format

**Structure:** `minute hour day-of-month month day-of-week`

**Special chars:** `*` (any), `,` (list), `-` (range), `/` (step), `L` (last), `W` (weekday), `#` (nth)

## Managing Triggers

**Remove all:** `"triggers": { "crons": [] }`
**Preserve existing:** Omit `"triggers"` field entirely

## Deployment

```bash
# Deploy with config crons
npx wrangler deploy

# Deploy specific environment
npx wrangler deploy --env production

# View deployments
npx wrangler deployments list
````

**⚠️ Changes take up to 15 minutes to propagate globally**

## API Management

**Get triggers:**

```bash
curl "https://api.cloudflare.com/client/v4/accounts/{account_id}/workers/scripts/{script_name}/schedules" \
  -H "Authorization: Bearer {api_token}"
```

**Update triggers:**

```bash
curl -X PUT "https://api.cloudflare.com/client/v4/accounts/{account_id}/workers/scripts/{script_name}/schedules" \
  -H "Authorization: Bearer {api_token}" \
  -H "Content-Type: application/json" \
  -d '{"crons": ["*/5 * * * *", "0 2 * * *"]}'
```

**Delete all:**

```bash
curl -X PUT "https://api.cloudflare.com/client/v4/accounts/{account_id}/workers/scripts/{script_name}/schedules" \
  -H "Authorization: Bearer {api_token}" \
  -H "Content-Type: application/json" \
  -d '{"crons": []}'
```

## Combining Multiple Workers

For complex schedules, use multiple workers:

```jsonc
// worker-frequent.jsonc
{
  "name": "data-sync-frequent",
  "triggers": { "crons": ["*/5 * * * *"] }
}

// worker-daily.jsonc
{
  "name": "reports-daily",
  "triggers": { "crons": ["0 2 * * *"] },
  "placement": { "mode": "smart" }
}

// worker-weekly.jsonc
{
  "name": "cleanup-weekly",
  "triggers": { "crons": ["0 3 * * SUN"] }
}
```

**Benefícios:**

- Limites de CPU separados por trabalhador
- Isolamento de erros independente
- Diferentes políticas de computação verde
- Mais fácil de manter e depurar

## Validação

**Teste a sintaxe do cron:**

- [crontab.guru](https://crontab.guru/) - Validador interativo
- O Wrangler valida na implantação, mas não detecta erros lógicos

**Erros comuns:**

- `0 0 * * *` funciona diariamente à meia-noite UTC, não no seu fuso horário local
- `*/60 * * * *` é inválido (use `0 * * * *` para hora)
- `0 2 31 * *` funciona apenas em meses com 31 dias

## Veja também

- [README.md](./README.md) - Visão geral, início rápido
- [api.md](./api.md) - Implementação do manipulador
- [patterns.md](./patterns.md) - Exemplos de roteamento multi-cron
