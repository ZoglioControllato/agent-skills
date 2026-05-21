# Workerd Gotchas

## Common Errors

### "Missing compatibility date"

**Cause:** Compatibility date not set
**Solution:**
❌ Wrong:

```capnp
const worker :Workerd.Worker = (
  serviceWorkerScript = embed "worker.js"
)
```

✅ Correct:

```capnp
const worker :Workerd.Worker = (
  serviceWorkerScript = embed "worker.js",
  compatibilityDate = "2024-01-15"  # Always set!
)
```

### Tipo de ligação errado

**Problema:** JSON não analisado
**Causa:** Usando `text = '{"key":"value"}'` em vez de `json`
**Solução:** Use `json = '{"key":"value"}'` para objetos analisados

### Serviço vs Namespace

**Problema:** Não é possível criar instância DO
**Causa:** Uso de `service = "room-service"` para Objeto Durável
**Solução:** Use `durableObjectNamespace = "Room"` para ligações DO

### Incompatibilidade de nome do módulo

**Problema:** Falha na importação
**Causa:** O nome do módulo inclui o caminho: `name = "src/index.js"`
**Solução:** Use nomes simples: `name = "index.js"`, incorpore com caminho

## Acesso à rede

**Problema:** A busca falha com erro de rede
**Causa:** Nenhum serviço de rede configurado (workerd não tem busca global)
**Solução:** adicione vinculação de serviço de rede:```capnp
services = [(name = "internet", network = (allow = ["public"]))]
bindings = [(name = "NET", service = "internet")]

````

Or external service:

```capnp
bindings = [(name = "API", service = (external = (address = "api.com:443", http = (style = tls))))]
````

### "Trabalhador não responde"

**Causa:** Soquete configurado incorretamente, nenhum manipulador de busca ou porta indisponível
**Solução:** Verifique se o `address` do soquete corresponde, o trabalhador exporta `fetch()`, porta disponível

### "Vinculação não encontrada"

**Causa:** Nome incompatível ou serviço não existe
**Solução:** Verifique o nome da ligação na configuração que corresponde ao código (`env.BINDING` para módulos ES)

### "Módulo não encontrado"

**Causa:** O nome do módulo não corresponde à importação ou ao caminho de incorporação incorreto
**Solução:** O módulo `name` deve corresponder exatamente ao caminho de importação, verifique o caminho `embed`

### "Erro de compatibilidade"

**Causa:** Data não definida ou API indisponível nessa data
**Solução:** Defina `compatibilityDate`, verifique a API disponível nessa data

## Problemas de desempenho

**Problema:** Alto uso de memória
**Causa:** Caches grandes ou muitos isolados
**Solução:** defina limites de cache, reduza a contagem de isolados ou use sinalizadores V8 (cuidado)

**Problema:** Inicialização lenta
**Causa:** Muitos módulos ou configurações complexas
**Solução:** Compilar para binário (`workerd compile`), reduzir importações

**Problema:** Tempo limite de solicitação
**Causa:** problemas de serviço externo ou problemas de DNS
**Solução:** verifique a conectividade, resolução de DNS, handshake TLS

## Problemas de compilação

**Problema:** Erros de sintaxe do Cap'n Proto
**Causa:** Configuração inválida ou esquema ausente
**Solução:** Instale ferramentas capnproto, valide: `capnp compile -I. config.capnp`

**Problema:** Caminho de incorporação não encontrado
**Causa:** Caminho relativo ao arquivo de configuração
**Solução:** Use o caminho relativo correto ou o caminho absoluto

**Problema:** Flags V8 causam travamentos
**Causa:** Sinalizadores V8 inseguros
**Solução:** ⚠️ Sinalizadores V8 sem suporte na produção. Teste completamente antes de usar.

## Problemas de segurança

**Problema:** Segredos codificados na configuração
**Causa:** ligação `text` com valor secreto
**Solução:** Use `fromEnvironment` para carregar de env vars

**Problema:** Acesso à rede excessivamente amplo
**Causa:** `rede = (permitir = ["*"])`
**Solução:** Restrinja a `allow = ["public"]` ou hosts específicos

**Problema:** Chaves criptográficas extraíveis
**Causa:** `cryptoKey = (extraível = verdadeiro, ...)`
**Solução:** Defina `extractable = false` a menos que a exportação seja necessária

## Mudanças de compatibilidade

**Problema:** Alterações importantes após a atualização da data de compatibilidade
**Causa:** Novos sinalizadores ativados entre datas
**Solução:** revise [documentos de datas de compatibilidade](https://developers.cloudflare.com/workers/configuration/compatibility-dates/), teste localmente primeiro

**Problema:** "Data de compatibilidade não suportada"
**Causa:** Versão do Workerd anterior à data de compatibilidade
**Solução:** Atualizar o binário do trabalhador (versão = data máxima de compatibilidade suportada)

## Limites

| Recurso/Limite          | Valor                                     | Notas                         |
| ----------------------- | ----------------------------------------- | ----------------------------- |
| Bandeiras V8            | Sem suporte na produção                   | Use com cuidado               |
| Data de compatibilidade | Deve corresponder à versão do trabalhador | Atualizar se não corresponder |
| Contagem de módulos     | Afeta o tempo de inicialização            | Muitas importações diminuem   |

## Etapas de solução de problemas

1. **Ativar registro detalhado**: `workerd serve config.capnp --verbose`
2. **Verificar logs**: procure mensagens de erro e rastreamentos de pilha
3. **Validar configuração**: `capnp compile -I. config.capnp`
4. **Ligações de teste**: Registre `Object.keys(env)` para verificar
5. **Verificar versões**: versão do Workerd vs data de compatibilidade
6. **Problema isolado**: configuração de reprodução mínima
7. **Revisar esquema**: [workerd.capnp](https://github.com/cloudflare/workerd/blob/main/src/workerd/server/workerd.capnp)

Consulte [configuration.md](./configuration.md) para detalhes de configuração, [patterns.md](./patterns.md) para exemplos de trabalho, [api.md](./api.md) para APIs de tempo de execução.
