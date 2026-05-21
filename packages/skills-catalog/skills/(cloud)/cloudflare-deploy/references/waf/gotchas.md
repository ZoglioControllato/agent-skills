# Armadilhas e solução de problemas

## Ordem de execução

**Problema:** regras executam em ordem inesperada  
**Causa:** interpretação errada das fases  
**Solução:**

As fases executam em sequência (não alterável):

1. `http_request_firewall_custom` — regras customizadas
2. `http_request_firewall_managed` — rulesets gerenciados
3. `http_ratelimit` — rate limiting

Dentro da fase: de cima para baixo; primeira correspondência vence (exceto `skip`)

```typescript
// WRONG: Can't mix phase-specific actions
await client.rulesets.create({
  phase: 'http_request_firewall_custom',
  rules: [
    { action: 'block', expression: 'cf.waf.score gt 50' },
    { action: 'execute', action_parameters: { id: 'managed_id' } }, // WRONG
  ],
});

// CORRECT: Separate rulesets per phase
await client.rulesets.create({ phase: 'http_request_firewall_custom', rules: [...] });
await client.rulesets.create({ phase: 'http_request_firewall_managed', rules: [...] });
```

## Erros de expressão

**Problema:** erros de sintaxe impedem deploy  
**Causa:** campo/operador/sintaxe inválidos  
**Solução:**

```typescript
// Common mistakes
'http.request.path' → 'http.request.uri.path' // Correct field
'ip.geoip.country eq US' → 'ip.geoip.country eq "US"' // Quote strings
'http.user_agent eq "Mozilla"' → 'lower(http.user_agent) contains "mozilla"' // Case sensitivity
'matches ".*[.jpg"' → 'matches ".*\\.jpg$"' // Valid regex
```

Teste expressões em Security Events antes de publicar.

## Armadilhas de regras skip

**Problema:** skip não funciona como esperado  
**Causa:** escopo do skip mal entendido  
**Solução:**

Tipos de skip:

- `ruleset: 'current'` — pula o restante só no ruleset atual
- `phases: ['phase_name']` — pula fases inteiras

```typescript
// WRONG: Trying to skip managed rules from custom phase
// In http_request_firewall_custom:
{
  action: 'skip',
  action_parameters: { ruleset: 'current' },
  expression: 'ip.src in {192.0.2.0/24}',
}
// This only skips remaining custom rules, not managed rules

// CORRECT: Skip specific phases
{
  action: 'skip',
  action_parameters: {
    phases: ['http_request_firewall_managed', 'http_ratelimit'],
  },
  expression: 'ip.src in {192.0.2.0/24}',
}
```

## Update substitui todas as regras

**Problema:** atualizar ruleset apaga outras regras  
**Causa:** `update()` substitui a lista inteira  
**Solução:**

```typescript
// WRONG: This deletes all existing rules!
await client.rulesets.update({
  zone_id: 'zone_id',
  ruleset_id: 'ruleset_id',
  rules: [{ action: 'block', expression: 'cf.waf.score gt 50' }],
})

// CORRECT: Get existing rules first
const ruleset = await client.rulesets.get({ zone_id: 'zone_id', ruleset_id: 'ruleset_id' })
await client.rulesets.update({
  zone_id: 'zone_id',
  ruleset_id: 'ruleset_id',
  rules: [...ruleset.rules, { action: 'block', expression: 'cf.waf.score gt 50' }],
})
```

## Conflitos de override

**Problema:** overrides do ruleset gerenciado não aplicam  
**Causa:** ID de regra inexistente ou categoria errada  
**Solução:**

```typescript
// List managed ruleset rules to find IDs
const ruleset = await client.rulesets.get({
  zone_id: 'zone_id',
  ruleset_id: 'efb7b8c949ac4650a09736fc376e9aee',
});
console.log(ruleset.rules.map(r => ({ id: r.id, description: r.description })));

// Use correct IDs in overrides
{ action: 'execute', action_parameters: { id: 'efb7b8c949ac4650a09736fc376e9aee',
  overrides: { rules: [{ id: '5de7edfa648c4d6891dc3e7f84534ffa', action: 'log' }] } } }
```

## Falsos positivos

**Problema:** tráfego legítimo bloqueado  
**Causa:** regras/limiares agressivos  
**Solução:**

1. Comece em modo log: `overrides: { action: 'log' }`
2. Revise Security Events
3. Faça override de regras específicas: `overrides: { rules: [{ id: 'rule_id', action: 'log' }] }`

## Rate limiting e NAT

**Problema:** usuários atrás de NAT atingem limite rápido  
**Causa:** vários usuários no mesmo IP  
**Solução:**

Adicione características: User-Agent, cookie de sessão ou header Authorization

```typescript
{
  action: 'block',
  expression: 'http.request.uri.path starts_with "/api"',
  action_parameters: {
    ratelimit: {
      characteristics: ['cf.colo.id', 'ip.src', 'http.request.cookies["session"][0]'],
      period: 60,
      requests_per_period: 100,
    },
  },
}
```

## Desempenho

**Problema:** latência aumentada  
**Causa:** expressões complexas, muitas regras  
**Solução:**

1. Faça skip de estáticos cedo: `action: 'skip'` para `\\.(jpg|css|js)$`
2. Deploy por caminho: managed só em `/api` ou `/admin`
3. Desative categorias não usadas: `{ category: 'wordpress', enabled: false }`
4. Prefira operadores de string a regex: `starts_with` vs `matches`

## Limites e cotas

| Recurso              | Free       | Pro        | Business   | Enterprise |
| -------------------- | ---------- | ---------- | ---------- | ---------- |
| Regras customizadas  | 5          | 20         | 100        | 1000       |
| Regras de rate limit | 1          | 10         | 25         | 100        |
| Tamanho da expressão | 4096 chars | 4096 chars | 4096 chars | 4096 chars |
| Regras por ruleset   | 75         | 75         | 400        | 1000       |
| Rulesets gerenciados | Sim        | Sim        | Sim        | Sim        |
| Características RL   | 2          | 3          | 5          | 5          |

**Notas:**

- Regras executam em ordem; primeira correspondência vence (exceto skip)
- Avaliação de expressão para no primeiro `false` em cadeias AND
- Operador `matches` (regex) é mais lento que operadores de string
- Contagem de rate limit ocorre antes da mitigação

## Erros de API

**Problema:** chamadas falham com erros obscuros  
**Causa:** parâmetros ou permissões inválidos  
**Solução:**

```typescript
// Error: "Invalid phase" → Use exact phase name
phase: 'http_request_firewall_custom'

// Error: "Ruleset already exists" → Use update() or list first
const rulesets = await client.rulesets.list({ zone_id, phase: 'http_request_firewall_custom' });
if (rulesets.result.length > 0) {
  await client.rulesets.update({ zone_id, ruleset_id: rulesets.result[0].id, rules: [...] });
}

// Error: "Action not supported" → Check phase/action compatibility
// 'execute' only in http_request_firewall_managed
// Rate limit config only in http_ratelimit phase

// Error: "Expression parse error" → Common fixes:
'ip.geoip.country eq "US"'   // Quote strings
'cf.waf.score gt 40'         // Use 'gt' not '>'
'http.request.uri.path'      // Not 'http.request.path'
```

**Dica:** teste expressões no painel (Security Events) antes do deploy.

Documentação localizada no ecossistema mantido pelo Controllato Club.
