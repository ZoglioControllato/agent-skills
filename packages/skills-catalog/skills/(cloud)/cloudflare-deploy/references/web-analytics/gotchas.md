# Web Analytics Gotchas

## Critical Issues

### SPA Navigation Not Tracked

**Symptom:** Only initial pageload counted  
**Fix:** Add `spa: true`:

```html
<script data-cf-beacon='{"token": "TOKEN", "spa": true}' ...></script>
```

### CSP Blocking Beacon

**Symptom:** Console error "Refused to load script"  
**Fix:** Allow both domains:

```
script-src 'self' https://static.cloudflareinsights.com https://cloudflareinsights.com;
```

### Roteamento baseado em hash não suportado

**Sintoma:** URLs `#/path` não rastreados
**Correção:** Migrar para a API History (`BrowserRouter`, não `HashRouter`). Nenhuma solução alternativa para roteamento de hash.

### Nenhum dado aparecendo

**Causas e soluções:**

1. **Atraso** - Aguarde de 5 a 15 minutos
2. **Token errado** - Verifique se o painel corresponde exatamente
3. **Script bloqueado** - Verifique a guia Rede do DevTools para beacon.min.js
4. **Incompatibilidade de domínio** – O site do painel deve corresponder ao URL real

### Falha na injeção automática

**Causa:** cabeçalho `Cache-Control: no-transform`
**Correção:** Remova `no-transform` ou instale o beacon manualmente

### Visualizações de página duplicadas

**Causa:** Vários scripts de beacon
**Correção:** Mantenha apenas um beacon por página

## Problemas de configuração

| Edição                      | Correção                                                 |
| --------------------------- | -------------------------------------------------------- |
| Limite de 10 sites atingido | Excluir sites antigos ou proxy através do CF (ilimitado) |
| Token não reconhecido       | Use o token alfanumérico exato do painel                 |

## Específico da estrutura

### Aviso de hidratação Next.js```tsx

<script suppressHydrationWarning ... />
```
### Janela Gatsby indefinida 

Use `gatsby-browser.js` para carregar apenas o lado do cliente. 

## Limites 

| Recurso | Limite | 
| ----------------- | --------------------- | 
| Sites sem proxy | 10 | 
| Sites proxy | Ilimitado | 
| Retenção de dados | 6 meses | 
| Atraso de ingestão | 5-10 minutos | 
| Acesso à API | Nenhum (somente painel) | 

## Quando NÃO usar o Web Analytics 

Use alternativas se precisar: 

- Acompanhamento de eventos personalizado 
- Dados em tempo real 
- Rastreamento em nível de usuário 
- Funis de conversão 
- Exportação de dados/acesso API 

**O Web Analytics é excelente em:** Core Web Vitals, tráfego básico, conformidade com a privacidade, visualizações de página ilimitadas e gratuitas.
