# Pipelines Gotchas

## Critical Issues

### Events Silently Dropped

**Most common issue.** Events accepted (HTTP 200) but never appear in sink.

**Causes:**

1. Schema validation fails - structured streams drop invalid events silently
2. Waiting for roll interval (10-300s) - expected behavior

**Solution:** Validate client-side with Zod:

```typescript
const EventSchema = z.object({ user_id: z.string(), amount: z.number() })
try {
  const validated = EventSchema.parse(rawEvent)
  await env.STREAM.send([validated])
} catch (e) {
  /* get immediate feedback */
}
```

### Pipelines são imutáveis

Não é possível modificar o SQL após a criação. Deve excluir e recriar.```bash
npx wrangler pipelines delete old-pipeline
npx wrangler pipelines create new-pipeline --sql "..."

````
**Dica:** Use nomenclatura de versão (`events-pipeline-v1`) e mantenha o SQL no controle de versão.

### Vinculação de trabalhador não encontrada

**`env.STREAM é indefinido`**

1. Use **stream ID** (não ID do pipeline) em `wrangler.jsonc`
2. Reimplante após adicionar vinculação```bash
npx wrangler pipelines streams list  # Get stream ID
npx wrangler deploy
````

## Erros Comuns

| Erro                           | Causa                                      | Correção                                  |
| ------------------------------ | ------------------------------------------ | ----------------------------------------- |
| Eventos que não estão em R2    | Intervalo de rolagem não decorrido         | Espere 10-300s, verifique `roll_interval` |
| Falhas na validação do esquema | Incompatibilidade de tipo, campos ausentes | Validar do lado do cliente                |
| Limite de taxa (429)           | >5 MB/s por fluxo                          | Eventos em lote, solicitação de aumento   |
| Carga útil muito grande (413)  | > Solicitação de 1 MB                      | Dividir em lotes menores                  |
| Não é possível excluir o fluxo | Pipeline faz referência a ele              | Exclua pipelines primeiro                 |
| Erros de credencial de coletor | Token expirou                              | Recrie o coletor com novas credenciais    |

## Limites (Beta Aberto)

| Recurso                           | Limite      |
| --------------------------------- | ----------- |
| Streams/Sinks/Pipelines por conta | 20 cada     |
| Tamanho da carga útil             | 1 MB        |
| Taxa de ingestão por stream       | 5MB/s       |
| Retenção de eventos               | 24 horas    |
| Tamanho de lote recomendado       | 100 eventos |

## Limitações SQL

- **Sem JOINs** - fluxo único por pipeline
- **Sem funções de janela** - somente SQL básico
- **Sem subconsultas** - deve usar `INSERT INTO ... SELECT ... FROM`
- **Sem evolução de esquema** - não é possível modificar após a criação

## Lista de verificação de depuração

- [] O fluxo existe: `lista de fluxos de pipelines do npx wrangler`
- [] Pipeline íntegro: `pipelines npx wrangler obtêm <ID>`
- [] A sintaxe SQL corresponde ao esquema
- [] Trabalhador redistribuído após vinculação adicionada
- [] Aguardou intervalo de rolagem
- [] Correspondências de contagem aceitas versus processadas (sem quedas de validação)
