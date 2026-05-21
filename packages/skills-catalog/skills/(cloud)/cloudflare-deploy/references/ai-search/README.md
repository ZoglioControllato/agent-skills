# Referência Cloudflare AI Search

Orientação para implementar o Cloudflare AI Search (anteriormente AutoRAG), o serviço gerenciado de busca semântica e RAG da Cloudflare.

## Visão geral

**AI Search** é um pipeline RAG (Geração Aumentada por Recuperação) gerenciado que combina:

- Indexação semântica automática do conteúdo
- Busca por similaridade vetorial
- Geração com LLM integrada

**Principais propostas de valor:**

- **Gestão zero de vetores** — sem embedding, indexação ou armazenamento manual
- **Auto-indexação** — conteúdo reindexado automaticamente a cada 6 horas
- **Geração integrada** — resposta opcional com IA a partir do contexto recuperado
- **Múltiplas fontes** — indexe buckets R2 ou crawls de site

**Opções de fonte de dados:**

- **Bucket R2** — indexe arquivos no Cloudflare R2 (MD, TXT, HTML, PDF, DOC, CSV, JSON)
- **Site** — rastreie e indexe conteúdo (exige domínio hospedado na Cloudflare)

**Ciclo de indexação:**

- Atualização automática a cada 6 horas
- "Force Sync" manual (limite de taxa de 30 s)
- Não foi desenhado para atualizações em tempo real

## Início rápido

**1. Crie a instância de AI Search no dashboard:**

- Cloudflare Dashboard → AI Search → Create
- Escolha a fonte (R2 ou site)
- Configure nome e opções

**2. Configure o Worker:**

```jsonc
// wrangler.jsonc
{
  "ai": {
    "binding": "AI",
  },
}
```

**3. Use no Worker:**

```typescript
export default {
  async fetch(request, env) {
    const answer = await env.AI.autorag('my-search-instance').aiSearch({
      query: 'How do I configure caching?',
      model: '@cf/meta/llama-3.3-70b-instruct-fp8-fast',
    })

    return Response.json({ answer: answer.response })
  },
}
```

## Quando usar AI Search

### AI Search vs Vectorize

| Fator          | AI Search                       | Vectorize                           |
| -------------- | ------------------------------- | ----------------------------------- |
| **Gestão**     | Totalmente gerenciada           | Embedding e indexação manuais       |
| **Use quando** | Pipeline RAG sem operações      | Embeddings ou controle customizados |
| **Indexação**  | Automática (ciclo de 6 h)       | Manual via API                      |
| **Geração**    | Opcional integrada              | Traga seu próprio LLM               |
| **Fontes**     | R2 ou site                      | Inserção manual                     |
| **Ideal para** | Docs, suporte, busca enterprise | Pipelines de ML custom, tempo real  |

### AI Search vs Workers AI direto

| Fator          | AI Search                        | Workers AI (direto)          |
| -------------- | -------------------------------- | ---------------------------- |
| **Contexto**   | Recuperação automática           | Montagem manual de contexto  |
| **Use quando** | Precisa de RAG (busca + geração) | Tarefas simples de geração   |
| **Indexação**  | Integrada                        | Não se aplica                |
| **Ideal para** | Bases de conhecimento, docs      | Chat simples, transformações |

### search() vs aiSearch()

| Método       | Retorna                     | Use quando                              |
| ------------ | --------------------------- | --------------------------------------- |
| `search()`   | Só resultados de busca      | UI customizada, precisa dos chunks crus |
| `aiSearch()` | Resposta da IA + resultados | Resposta pronta (chatbot, Q&A)          |

### Consideração sobre atualização em tempo real

**AI Search não é ideal se:**

- Precisa de atualização em tempo real (< 6 horas)
- O conteúdo muda várias vezes por hora
- Exige frescor estrito

**AI Search é ideal se:**

- Conteúdo relativamente estável (docs, políticas, bases de conhecimento)
- Atualização a cada 6 horas é aceitável
- Prefere zero operações a tempo real

## Limites da plataforma

| Limite                                | Valor               |
| ------------------------------------- | ------------------- |
| Máx. instâncias por conta             | 10                  |
| Máx. arquivos por instância           | 100.000             |
| Tamanho máx. do arquivo               | 4 MB                |
| Frequência de indexação               | A cada 6 horas      |
| Limite do Force Sync                  | Uma vez a cada 30 s |
| Profundidade de aninhamento de filtro | 2 níveis            |
| Filtros por composto                  | 10                  |
| Faixa do score threshold              | 0,0 - 1,0           |

## Ordem de leitura

| Tarefa                       | Ler                           | Tempo est. |
| ---------------------------- | ----------------------------- | ---------- |
| **Entender AI Search**       | Só README                     | 5 min      |
| **Implementar busca básica** | README → api.md               | 10 min     |
| **Configurar fonte**         | README → configuration.md     | 10 min     |
| **Padrões de produção**      | patterns.md                   | 15 min     |
| **Depurar problemas**        | gotchas.md                    | 10 min     |
| **Implementação completa**   | README → api.md → patterns.md | 30 min     |

## Nesta referência

- **[api.md](api.md)** — Endpoints, métodos, interfaces TypeScript
- **[configuration.md](configuration.md)** — Setup, fontes, wrangler
- **[patterns.md](patterns.md)** — Padrões comuns, decisões, exemplos
- **[gotchas.md](gotchas.md)** — Solução de problemas, armadilhas, limites

## Ver também

- [Documentação AI Search](https://developers.cloudflare.com/ai-search/)
- [Workers AI](https://developers.cloudflare.com/workers-ai/)
- [Vectorize](https://developers.cloudflare.com/vectorize/)
