# Analytics Engine Gotchas

## Critical Issues

### Sampling at High Volumes

**Problem:** Queries return fewer points than written at >1M writes/min.

**Solution:**

```typescript
// Pre-aggregate before writing
let buffer = { count: 0, total: 0 }
buffer.count++
buffer.total += value

// Write once per second instead of per request
if (Date.now() % 1000 === 0) {
  env.ANALYTICS.writeDataPoint({ doubles: [buffer.count, buffer.total] })
}
```

**Detection:** `npx wrangler tail` → look for "sampling enabled"

### writeDataPoint Returns void

```typescript
// ❌ Pointless await
await env.ANALYTICS.writeDataPoint({...});

// ✅ Fire-and-forget
env.ANALYTICS.writeDataPoint({...});
```

Writes can fail silently. Check tail logs.

### Index vs Blob

| Cardinality | Use       | Example                        |
| ----------- | --------- | ------------------------------ |
| Millions    | **Index** | user_id, api_key               |
| Hundreds    | **Blob**  | endpoint, status_code, country |

```typescript
// ✅ Correct
{ blobs: [method, path, status], indexes: [userId] }
```

### Não é possível consultar os trabalhadores

A API de consulta requer autenticação HTTP. Use serviço externo ou cache em KV/D1.

### Sem carimbos de data/hora personalizados

Gerado automaticamente no momento da gravação. Armazene o original no blob, se necessário.

## Erros Comuns

| Erro                      | Correção                                                                        |
| ------------------------- | ------------------------------------------------------------------------------- |
| Vinculação não encontrada | Verifique wrangler.jsonc, reimplante                                            |
| Nenhum dado em consulta   | Espere 30s; verifique o nome do conjunto de dados; verificar intervalo de tempo |
| Tempo limite da consulta  | Adicionar filtro de tempo; usar índice para filtragem                           |

## Limites

| Recurso                           | Limite  |
| --------------------------------- | ------- |
| Blobs por ponto                   | 20      |
| Duplica por ponto                 | 20      |
| Índices por ponto                 | 1       |
| Tamanho do blob/índice            | 16 KB   |
| Taxa de gravação (sem amostragem) | ~1M/min |
| Retenção                          | 90 dias |
| Tempo limite da consulta          | 30 anos |

## Melhores práticas

✅ Pré-agregar em grandes volumes
✅ Use índice para alta cardinalidade (milhões)
✅ Sempre inclua filtro de tempo nas consultas
✅ Projete o esquema antes de codificar

❌ Não espere writeDataPoint
❌ Não use índice para baixa cardinalidade
❌ Não faça consultas sem intervalo de tempo
❌ Não presuma que todas as gravações foram bem-sucedidas
