# Gotchas & Limits

## Common Errors

### "Worker not found"

**Cause:** Attempting to get Worker that doesn't exist in namespace  
**Solution:** Catch error and return 404:

```typescript
try {
  const userWorker = env.DISPATCHER.get(workerName)
  return userWorker.fetch(request)
} catch (e) {
  if (e.message.startsWith('Worker not found')) {
    return new Response('Worker not found', { status: 404 })
  }
  throw e // Re-throw unexpected errors
}
```

### "Limite de tempo da CPU excedido"

**Causa:** O usuário Worker excedeu o limite de tempo de CPU configurado
**Solução:** rastreie violações no Analytics Engine e retorne a resposta 429; considere ajustar os limites por nível de cliente

### "Problemas de roteamento de nome de host"

**Causa:** configurações de proxy DNS causando problemas de roteamento
**Solução:** Use a rota curinga `*/*` que funciona independentemente das configurações de proxy para roteamento laranja para laranja

### "Ligações perdidas na atualização"

**Causa:** Não uso do sinalizador `keep_bindings` ao atualizar o Worker
**Solução:** use `keep_bindings: true` em solicitações de API para preservar as vinculações existentes durante as atualizações

### "A filtragem de tags não funciona"

**Causa:** Caracteres especiais não codificados em URL em filtros de tags
**Solução:** URL codifique tags (por exemplo, `tags=produção%3Ayes`) e evite caracteres especiais como `,` e `&`

### "Implantar falhas com módulos ES"

**Causa:** Formato de upload incorreto para módulos ES
**Solução:** use upload de formulário multiparte, especifique `main_module` nos metadados e defina o tipo de arquivo como `application/javascript+module`

### "Falha no upload de ativo estático"

**Causa:** Formato hash inválido, token expirado ou codificação incorreta
**Solução:** O hash deve ter os primeiros 16 bytes (32 caracteres hexadecimais) de SHA-256, fazer upload dentro de 1 hora após a criação da sessão, implantar dentro de 1 hora após a conclusão do upload e codificar o conteúdo do arquivo em Base64

### "Trabalhador de saída não intercepta chamadas"

**Causa:** Workers de saída não interceptam objetos duráveis ou busca de vinculação mTLS
**Solução:** Planeje o controle de saída adequadamente; nem todas as chamadas de busca são interceptadas

### "Falha na conexão do soquete TCP"

**Causa:** O Outbound Worker ativado bloqueia a API `connect()` para soquetes TCP
**Solução:** Outbound Workers interceptam apenas chamadas `fetch()`; Conexões de soquete TCP indisponíveis quando a saída é configurada. Remova a saída se o TCP for necessário ou use o padrão de proxy.

### "Limite de taxa de API excedido"

**Causa:** limites de taxa da API Cloudflare excedidos (1.200 solicitações a cada 5 minutos por conta, 200 solicitações por segundo por IP)
**Solução:** Implemente a espera exponencial:```typescript
async function deployWithBackoff(deploy: () => Promise<void>, maxRetries = 3) {
for (let i = 0; i < maxRetries; i++) {
try {
return await deploy()
} catch (e) {
if (e.status === 429 && i < maxRetries - 1) {
await new Promise((r) => setTimeout(r, Math.pow(2, i) \* 1000))
continue
}
throw e
}
}
}

```
### "Implantação gradual não suportada"

**Causa:** Tentativa de usar implantações graduais com usuários Workers
**Solução:** implantações graduais não suportadas para Workers em namespaces de despacho. Use a implantação completa com implementação gradual por meio da lógica do operador de despacho (sinalizadores de recursos, roteamento baseado em porcentagem).

### "Sessão de ativos expirada"

**Causa:** O upload do JWT expirou (validade de 1 hora) ou o token de conclusão expirou (1 hora após o upload)
**Solução:** Conclua o upload de ativos em até 1 hora após a criação da sessão e implante o Worker em até 1 hora após a conclusão do upload. Para uploads grandes, arquivos em lote ou aumentar o paralelismo de upload.

## Limites da plataforma

| Limite | Valor | Notas |
| ------------------------- | ---------------------- | ------------------------------------------ |
| Trabalhadores por namespace | Ilimitado | Ao contrário dos trabalhadores regulares (500 por conta) |
| Namespaces por conta | Ilimitado | Boa prática: 1 produção + 1 encenação |
| Máximo de tags por trabalhador | 8 | Para filtragem e organização |
| Modo de trabalho | Não confiável (padrão) | Nenhum acesso `request.cf` a menos que modo confiável |
| Isolamento de cache | Por trabalhador (não confiável) | Compartilhado em modo confiável com prefixos de chave |
| Namespaces de objetos duráveis ​​| Ilimitado | Sem limite por conta para WfP |
| Implantações graduais | Não suportado | Somente de uma vez |
| `caches.default` | Desativado (não confiável) | Use API Cache com chaves personalizadas |

## Limites de upload de ativos

| Limite | Valor | Notas |
| --------------------------- | ---------------------- | ----------------------------------------- |
| Validade do JWT da sessão de upload | 1 hora | Deve concluir o upload dentro deste prazo |
| Validade do token de conclusão | 1 hora | Deve ser implantado dentro deste período após o upload |
| Formato hash de ativos | Primeiros 16 bytes SHA-256 | 32 caracteres hexadecimais |
| Codificação Base64 | Obrigatório | Para arquivos binários |

## Limites de taxa de API

| Tipo de limite | Valor | Escopo |
| ---------- | --------------------- | ---------------- |
| API do cliente | 1200 solicitações/5 min | Por conta |
| API do cliente | 200 solicitações/seg | Por endereço IP |
| GráficoQL | Varia de acordo com o custo da consulta | Complexidade da consulta |

Consulte [Limites de taxa da API Cloudflare](https://developers.cloudflare.com/fundamentals/api/reference/limits/) para obter detalhes.

## Limites Operacionais

| Operação | Limite | Notas |
| --------------------------- | --------------------------- | ------------------------------------- |
| Tempo de CPU (limites personalizados) | Até o limite do plano Trabalhadores | Definir por invocação no trabalhador de expedição |
| Subsolicitações (limites personalizados) | Até o limite do plano Trabalhadores | Definir por invocação no trabalhador de expedição |
| Subsolicitações de trabalhadores de saída | Não interceptado para DO/mTLS | Apenas chamadas fetch() regulares |
| Soquetes TCP com saída | Desativado | API `connect()` indisponível |

Consulte [README.md](./README.md), [configuration.md](./configuration.md), [api.md](./api.md), [patterns.md](./patterns.md)
```
