# Armadilhas do AI Search

## Type safety

**Precisão de timestamp:** use segundos (10 dígitos), não milissegundos.

```typescript
const nowInSeconds = Math.floor(Date.now() / 1000) // Correto
```

**Prefixo de pasta:** use `gte` para "começa com" em caminhos.

```typescript
filters: { column: "folder", operator: "gte", value: "docs/api/" } // Casa aninhados
```

## Limitações de filtro

| Limite                           | Valor                 |
| -------------------------------- | --------------------- |
| Profundidade máx. de aninhamento | 2 níveis              |
| Filtros por composto             | 10                    |
| Operador `or`                    | Mesma coluna, só `eq` |

**Exemplo da restrição OR:**

```typescript
// ✅ Válido: mesma coluna, só eq
{ operator: "or", filters: [
  { column: "folder", operator: "eq", value: "docs/" },
  { column: "folder", operator: "eq", value: "guides/" }
]}
```

## Problemas de indexação

| Problema             | Causa                          | Solução                                                 |
| -------------------- | ------------------------------ | ------------------------------------------------------- |
| Arquivo não indexado | Formato não suportado ou >4 MB | Verificar formato (.md/.txt/.html/.pdf/.doc/.csv/.json) |
| Índice defasado      | Ciclo de 6 h                   | Aguardar ou usar "Force Sync" (limite 30 s)             |
| Resultados vazios    | Índice incompleto              | Ver status no dashboard                                 |

## Erros de autenticação

| Erro                       | Causa                    | Correção                                         |
| -------------------------- | ------------------------ | ------------------------------------------------ |
| `AutoRAGUnauthorizedError` | Token inválido/ausente   | Criar Service API token com permissões AI Search |
| `AutoRAGNotFoundError`     | Nome de instância errado | Confirmar nome exato no dashboard                |

## Desempenho

**Respostas lentas (>3 s):**

```typescript
// Limiar de score + limitar resultados
ranking_options: { score_threshold: 0.5 },
max_num_results: 10
```

**Depuração de resultados vazios:**

1. Remova filtros, teste consulta básica
2. Reduza `score_threshold` para 0,1
3. Verifique se o índice está populado

## Limites

| Recurso                 | Limite  |
| ----------------------- | ------- |
| Instâncias por conta    | 10      |
| Arquivos por instância  | 100.000 |
| Tamanho máx. do arquivo | 4 MB    |
| Frequência de indexação | 6 horas |

## Anti-padrões

**Use variáveis de ambiente para nomes de instância:**

```typescript
const answer = await env.AI.autorag(env.AI_SEARCH_INSTANCE).aiSearch({...});
```

**Trate tipos de erro específicos:**

```typescript
if (error instanceof AutoRAGNotFoundError) {
  /* 404 */
}
if (error instanceof AutoRAGUnauthorizedError) {
  /* 401 */
}
```
