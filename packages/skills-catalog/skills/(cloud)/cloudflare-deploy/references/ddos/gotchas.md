# pegadinhas DDoS

## Erros Comuns

### "Falsos positivos bloqueando tráfego legítimo"

**Causa**: Sensibilidade muito alta, ação errada ou exceções ausentes
**Solução**:

1. Menor sensibilidade para regra/categoria específica
2. Use a ação `log` primeiro para validar (Enterprise Advanced)
3. Adicione exceção com expressão personalizada (por exemplo, IPs da lista de permissões)
4. Consulte solicitações sinalizadas por meio da API GraphQL Analytics para identificar padrões

### "Ataques passando"

**Causa**: Sensibilidade muito baixa ou ação errada
**Solução**: Aumente para a sensibilidade `default` e use a ação `block`:```typescript
const config = {
rules: [
{
expression: 'true',
action: 'execute',
action_parameters: { id: managedRulesetId, overrides: { sensitivity_level: 'default', action: 'block' } },
},
],
}

```
### "Regras adaptativas não funcionam"

**Causa**: histórico de tráfego insuficiente (precisa de 7 dias)
**Solução**: aguarde o estabelecimento da linha de base e verifique o status da regra adaptativa no painel

### "Substituição de zona ignorada"

**Causa**: as substituições de conta entram em conflito com as substituições de zona
**Solução**: configurar no nível da zona OU remover substituições de zona para usar no nível da conta

### "Ação de registro não disponível"

**Causa**: não está no plano Enterprise Advanced DDoS
**Solução**: use `owned_challenge` com baixa sensibilidade para testes

### "Limite de regra excedido"

**Causa**: muitas regras de substituição (Free/Pro/Business: 1, Enterprise Advanced: 10)
**Solução**: Combine condições em uma única expressão usando `and`/`or`

### "Não é possível substituir a regra"

**Causa**: a regra é somente leitura
**Solução**: verifique a resposta da API para indicador somente leitura, use regra diferente

### "Não é possível desativar a proteção DDoS"

**Causa**: os conjuntos de regras gerenciados por DDoS não podem ser totalmente desativados (proteção sempre ativa)
**Solução**: Defina `sensitivity_level: "eoff"` para mitigação mínima

### "Expressão não permitida"

**Causa**: as expressões personalizadas exigem o plano Enterprise Advanced
**Solução**: use `expression: "true"` para todo o tráfego ou plano de atualização

### "Conjunto de regras gerenciado não encontrado"

**Causa**: a zona/conta não tem um conjunto de regras gerenciado por DDoS ou fase incorreta
**Solução**: Verifique se o conjunto de regras existe via `client.rulesets.list()`, verifique o nome da fase (`ddos_l7` ou `ddos_l4`)

## Códigos de erro de API

| Código de erro | Mensagem | Causa | Solução |
| ---------- | ------------------------- | -------------------------------- | --------------------------------------------------- |
| 10.000 | Erro de autenticação | Token de API inválido/ausente | Verifique se o token tem permissões DDoS |
| 81000 | Falha na validação do conjunto de regras | Estrutura de regras inválida | Verifique se `action_parameters.id` é o ID do conjunto de regras gerenciado |
| 81020 | Expressão não permitida | Expressões personalizadas no plano errado | Use `"true"` ou atualize para Enterprise Advanced |
| 81021 | Limite de regras excedido | Muitas regras de substituição | Reduza regras ou atualize (Enterprise Advanced: 10) |
| 81022 | Nível de sensibilidade inválido | Valor de sensibilidade errado | Use: `default`, `medium`, `low`, `eoff` |
| 81023 | Ação inválida | Ação errada para o plano | Somente Enterprise Advanced: ação `log` |

## Limites

| Recurso/Limite | Grátis/Pro/Negócios | Empresa | Empresa Avançada |
| ------------------------ | ----------------- | ---------- | ------------------- |
| Substituir regras por zona | 1 | 1 | 10 |
| Expressões personalizadas | ✗ | ✗ | ✓ |
| Ação de registro | ✗ | ✗ | ✓ |
| DDoS adaptativo | ✗ | ✓ | ✓ |
| Histórico de tráfego necessário | - | 7 dias | 7 dias |

## Estratégia de ajuste

1. Comece com ação `log` + sensibilidade `média`
2. Monitore por 24 a 48 horas
3. Identifique falsos positivos, adicione exceções
4. Aumente gradualmente para a sensibilidade `padrão`
5. Altere a ação de `log` → `driven_challenge` → `block`
6. Documente todos os ajustes

## Melhores práticas

- Teste durante períodos de baixo tráfego
- Use nível de zona para ajuste por site
- Listas de IP de referência para facilitar o gerenciamento
- Definir limites de alerta apropriados (evitar ruído)
- Combine com WAF para defesa em camadas
- Evite ajustes excessivos (mantenha a configuração simples)

Consulte [patterns.md](./patterns.md) para obter exemplos de implementação progressiva.
```
