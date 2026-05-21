# pegadinhas

## Erros Comuns

### ".get() gera erro"

**Causa:** Supondo que `.get()` retorne nulo em caso de falha em vez de lançar  
**Solução:** Sempre envolva chamadas `.get()` em blocos try/catch para lidar com erros normalmente```typescript
try {
const key = await env.API_KEY.get()
} catch (error) {
return new Response('Configuration error', { status: 500 })
}

````
### "Registrando Valores Secretos"

**Causa:** Registro acidental de valores secretos no console ou em mensagens de erro
**Solução:** Registra apenas metadados (por exemplo, "API_KEY recuperada") e nunca o valor secreto real

### "Acesso secreto em nível de módulo"

**Causa:** Tentativa de acessar segredos durante a inicialização do módulo antes que o env esteja disponível
**Solução:** Armazenar segredos em cache somente no escopo da solicitação, não no nível do módulo

### "Segredo não encontrado na loja"

**Causa:** O nome do segredo não existe, incompatibilidade de maiúsculas e minúsculas, escopo de trabalho ausente ou store_id incorreto
**Solução:** Verifique se o segredo existe com `wrangler secrets-store secret list <store-id> --remote`, verifique se o nome corresponde exatamente (diferencia maiúsculas de minúsculas), certifique-se de que o segredo tenha o escopo `workers` e verifique o store_id correto

### "Incompatibilidade de escopo"

**Causa:** O segredo existe, mas falta o escopo `workers` (possui apenas o escopo `ai-gateway`)
**Solução:** Atualizar escopos secretos: `wrangler secrets-store secret update <store-id> --name SECRET --scopes workers --remote` ou adicionar via Dashboard

### "Falha na análise JSON"

**Causa:** Armazenamento de JSON inválido em segredo e falha na análise durante o tempo de execução
**Solução:** Valide o JSON antes de armazenar:```bash
# Validate before storing
echo '{"key":"value"}' | jq . && \
  echo '{"key":"value"}' | wrangler secrets-store secret create <store-id> \
    --name CONFIG --scopes workers --remote
````

Análise de tempo de execução com tratamento de erros:```typescript
try {
const configStr = await env.CONFIG.get()
const config = JSON.parse(configStr)
} catch (error) {
console.error('Invalid config JSON:', error)
return new Response('Invalid configuration', { status: 500 })
}

```
### "Não é possível acessar o segredo no desenvolvedor local"

**Causa:** Tentativa de acessar segredos de produção no ambiente de desenvolvimento local
**Solução:** Crie segredos somente locais (sem sinalizador `--remote`) para desenvolvimento: `wrangler secrets-store secret create <store-id> --name API_KEY --scopes workers`

### "A propriedade 'get' não existe"

**Causa:** Definição de tipo TypeScript ausente para vinculação secreta
**Solução:** Defina a interface com o método get: `interface Env { API_KEY: { get(): Promise<string> }; }`

### "A vinculação já existe"

**Causa:** Vinculação duplicada no painel ou conflito entre wrangler.jsonc e painel
**Solução:** Remova duplicatas das Configurações do painel → Ligações, verifique se há conflitos ou exclua o antigo segredo do Worker com `wrangler secret delete API_KEY`

### "Cota secreta da conta excedida"

**Causa:** A conta atingiu o limite de 100 segredos (beta)
**Solução:** Verifique a cota com `wrangler secrets-store quota --remote`, exclua segredos não utilizados, consolide duplicatas ou entre em contato com a Cloudflare para aumentar

## Limites

| Limite | Valor | Notas |
| ----------------------- | --------------------------- | ------------------------------------- |
| Máximo de segredos por conta | 100 | Limite beta |
| Máximo de lojas por conta | 1 | Limite beta |
| Tamanho máximo do segredo | 1024 bytes | Por segredo |
| Segredos locais | Não conte para o limite | Apenas os segredos de produção contam |
| Escopos disponíveis | `trabalhadores`, `ai-gateway` | Deve ter escopo correto para acesso |
| Escopo | Nível da conta | Pode ser reutilizado em vários Trabalhadores |
| Método de acesso | `aguarde env.BINDING.get()` | Somente assíncrono, gera erro |
| Gestão | Centralizado | Através de comandos de armazenamento de segredos |
| Desenvolvedor local | Segredos locais separados | Use sem sinalizador `--remote` |
| Disponibilidade regional | Rede global exceto China | Indisponível na rede da China |

Consulte: [configuration.md](./configuration.md), [api.md](./api.md), [patterns.md](./patterns.md)
```
