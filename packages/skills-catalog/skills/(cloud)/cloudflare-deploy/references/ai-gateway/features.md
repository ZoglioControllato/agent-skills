# Recursos e capacidades

## Cache

Dashboard: Settings → Cache Responses → Enable

```typescript
// TTL customizado (1 hora)
headers: { 'cf-aig-cache-ttl': '3600' }

// Pular cache
headers: { 'cf-aig-skip-cache': 'true' }

// Chave de cache customizada
headers: { 'cf-aig-cache-key': 'greeting-en' }
```

**Limites:** TTL de 60 s a 30 dias. **Não funciona com streaming.**

## Rate limiting

Dashboard: Settings → Rate-limiting → Enable

- **Fixed window:** reinicia em intervalos fixos
- **Sliding window:** janela móvel (mais precisa)
- Retorna `429` quando excedido

## Guardrails

Dashboard: Settings → Guardrails → Enable

Filtra prompts/respostas com conteúdo inadequado. Ações: Flag (log) ou Block (rejeitar).

## Data Loss Prevention (DLP)

Dashboard: Settings → DLP → Enable

Detecta PII (e-mail, SSN, cartões). Ações: Flag, Block ou Redact.

## Modos de cobrança

| Modo                | Descrição                                   | Setup                              |
| ------------------- | ------------------------------------------- | ---------------------------------- |
| **Unified billing** | Paga via Cloudflare, sem chaves do provedor | Só o header `cf-aig-authorization` |
| **BYOK**            | Chaves armazenadas no dashboard             | Seção Provider Keys                |
| **Pass-through**    | Envia a chave do provedor a cada request    | Incluir header de auth do provedor |

## Zero data retention

Dashboard: Settings → Privacy → Zero Data Retention

Não armazena prompts/respostas. Contagens e custos de request continuam sendo rastreados.

## Logging

Dashboard: Settings → Logs → Enable (até 10M logs)

Cada entrada: prompt, resposta, provedor, modelo, tokens, custo, duração, status de cache, metadados.

```typescript
// Não registrar este request
headers: { 'cf-aig-collect-log': 'false' }
```

**Exportar:** Logpush para S3, GCS, Datadog, Splunk etc.

## Rastreamento de custo customizado

Para modelos fora da base de preços da Cloudflare:

Dashboard: Gateway → Settings → Custom Costs

Ou via API: defina `model`, `input_cost`, `output_cost`.

## Provedores suportados (22+)

| Provedor                                             | API unificada                       | Notas               |
| ---------------------------------------------------- | ----------------------------------- | ------------------- |
| OpenAI                                               | `openai/gpt-4o`                     | Suporte completo    |
| Anthropic                                            | `anthropic/claude-sonnet-4-5`       | Suporte completo    |
| Google AI                                            | `google-ai-studio/gemini-2.0-flash` | Suporte completo    |
| Workers AI                                           | `workersai/@cf/meta/llama-3`        | Nativo              |
| Azure OpenAI                                         | `azure-openai/*`                    | Nomes de deployment |
| AWS Bedrock                                          | Só endpoint do provedor             | `/bedrock/*`        |
| Groq                                                 | `groq/*`                            | Inferência rápida   |
| Mistral, Cohere, Perplexity, xAI, DeepSeek, Cerebras | Suporte completo                    | -                   |

## Boas práticas

1. Habilite cache para prompts determinísticos
2. Configure rate limits contra abuso
3. Use guardrails em IA voltada ao usuário
4. Habilite DLP para dados sensíveis
5. Use billing unificado ou BYOK para gestão de chaves mais simples
6. Habilite logging para debug
7. Use zero data retention quando a privacidade exigir
