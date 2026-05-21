## Resumo das melhores práticas

**Nota sobre Smart Shield:** Argo Smart Routing evoluindo para Smart Shield. As melhores práticas abaixo permanecem aplicáveis; monitore o changelog da Cloudflare para atualizações do Smart Shield.

1. **Sempre verifique a capacidade de edição** antes de tentar ativar/desativar o Argo
2. **Configure notificações de faturamento** para evitar custos inesperados
3. **Combine com Tiered Cache** para obter o máximo benefício de desempenho
4. **Use apenas em produção** - desative para desenvolvimento/preparação para controlar custos
5. **Monitore análises** – requer mais de 500 solicitações em 48 horas para obter métricas detalhadas
6. **Trate de erros normalmente** - verifique faturamento, permissões e compatibilidade de zona
7. **Testar alterações na configuração** na preparação antes da produção
8. **Use TypeScript SDK** para segurança de tipo e melhor experiência do desenvolvedor
9. **Implementar lógica de repetição** para chamadas de API em sistemas de produção
10. **Configurações específicas da zona de documentos** para visibilidade da equipe

## Erros Comuns

### "Argo indisponível"

**Problema:** API retorna erro "Argo Smart Routing não está disponível para esta zona"

**Causa:** Zona não qualificada ou faturamento não configurado

**Solução:**

1. Verifique se a zona possui plano Enterprise ou superior
2. Verifique se o faturamento está configurado em Conta → Faturamento
3. Certifique-se de que o método de pagamento seja válido e atual
4. Entre em contato com o suporte da Cloudflare se a elegibilidade não estiver clara

### "Não é possível ativar/desativar"

**Problema:** a chamada de API foi bem-sucedida, mas o status permanece inalterado ou `editável: falso` na resposta GET

**Causa:** Permissões ou restrições de zona insuficientes

**Solução:**

1. Verifique se o token da API tem permissão `Zone:Argo Smart Routing:Edit`
2. Verifique `editable: true` na resposta GET antes de tentar PATCH
3. Se `editável: false`, verifique:

- Faturamento configurado para conta
- Plano de zona inclui Argo (Enterprise+)
- Nenhuma zona ativa ou suspensões
- O token da API tem escopos corretos

### `editável: false` Erro

**Problema:** A solicitação GET retorna `"editável": false`, impedindo ativar/desativar

**Causa:** restrições em nível de zona de faturamento, plano ou permissões

**Padrão de solução:**

```typescript
const status = await client.argo.smartRouting.get({ zone_id: zoneId })

if (!status.editable) {
  // Don't attempt to modify - will fail
  console.error('Cannot modify Argo settings:')
  console.error('- Check billing is configured')
  console.error('- Verify zone has Enterprise+ plan')
  console.error('- Confirm API token has Edit permission')
  throw new Error('Argo is not editable for this zone')
}

// Safe to proceed with enable/disable
await client.argo.smartRouting.edit({ zone_id: zoneId, value: 'on' })
```

### Rate Limiting

**Problem:** `429 Too Many Requests` error from API

**Cause:** Exceeded API rate limits (typically 1200 requests per 5 minutes)

**Solution:**

```typescript
import { RateLimitError } from 'cloudflare'

try {
  await client.argo.smartRouting.edit({ zone_id: zoneId, value: 'on' })
} catch (error) {
  if (error instanceof RateLimitError) {
    const retryAfter = error.response?.headers.get('retry-after')
    console.log(`Rate limited. Retry after ${retryAfter} seconds`)

    // Implement exponential backoff
    await new Promise((resolve) => setTimeout(resolve, (retryAfter || 60) * 1000))
    // Retry request
  }
}
```

## Limits

| Resource/Limit             | Value              | Notes                                   |
| -------------------------- | ------------------ | --------------------------------------- |
| Min requests for analytics | 500 in 48h         | For detailed metrics via GraphQL        |
| Zones supported            | Enterprise+        | Check zone plan in dashboard            |
| Billing requirement        | Must be configured | Before enabling; verify payment method  |
| API rate limit             | 1200 req / 5 min   | Per API token across all endpoints      |
| Spectrum apps              | No hard limit      | Each app can enable Argo independently  |
| Traffic counting           | Proxied only       | Only orange-clouded DNS records count   |
| DDoS/WAF exemption         | Yes                | Mitigated traffic excluded from billing |
| Analytics latency          | 1-5 minutes        | Real-time metrics not available         |

## Additional Resources

- [Official Argo Smart Routing Docs](https://developers.cloudflare.com/argo-smart-routing/)
- [Cloudflare Smart Shield](https://developers.cloudflare.com/smart-shield/)
- [API Authentication](https://developers.cloudflare.com/fundamentals/api/get-started/create-token/)
- [Cloudflare TypeScript SDK](https://github.com/cloudflare/cloudflare-typescript)
- [Cloudflare Python SDK](https://github.com/cloudflare/cloudflare-python)
