# Zaraz Gotchas

## Events Not Firing

**Check:**

1. Tool enabled in dashboard (green dot)
2. Trigger conditions met
3. Consent granted for tool's purpose
4. Tool credentials correct (GA4: `G-XXXXXXXXXX`, FB: numeric only)

**Debug:**

```javascript
zaraz.debug = true
console.log('Tools:', zaraz.tools)
console.log('Consent:', zaraz.consent.getAll())
```

## Consent Issues

**Modal not showing:**

```javascript
// Clear consent cookie
document.cookie = 'zaraz-consent=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
location.reload()
```

**Tools firing before consent:** Map tool to consent purpose with "Do not load until consent granted".

## SPA Tracking

**Route changes not tracked:**

1. Configure History Change trigger in dashboard
2. Hash routing (`#/path`) requires manual tracking:

```javascript
window.addEventListener('hashchange', () => {
  zaraz.track('pageview', { page_path: location.pathname + location.hash })
})
```

**React fix:**

```javascript
const location = useLocation()
useEffect(() => {
  zaraz.track('pageview', { page_path: location.pathname })
}, [location]) // Include dependency
```

## Desempenho

**Carregamento lento da página:**

- Contagem de ferramentas de auditoria (mais de 50 prejudica o desempenho)
- Desative os gatilhos de bloqueio, a menos que seja necessário
- Reduza o tamanho da carga útil do evento (<100 KB)

## Problemas específicos da ferramenta

| Ferramenta         | Edição                    | Correção                                  |
| ------------------ | ------------------------- | ----------------------------------------- |
| GA4                | Eventos não em tempo real | Aguarde 5 a 10 minutos, use DebugView     |
| Facebook           | ID de pixel inválido      | Use apenas numérico (sem prefixo `fbpx_`) |
| Anúncios do Google | Conversões não atribuídas | Inclui `send_to: 'AW-XXX/LABEL'`          |

## Camada de dados

- As propriedades persistem apenas por página - definidas em cada carregamento de página
- Acesso aninhado: `{{client.__zarazTrack.user.plan}}`

## Limites

| Recurso                      | Limite                |
| ---------------------------- | --------------------- |
| Tamanho da solicitação       | 100 KB                |
| Finalidades do consentimento | 20                    |
| Taxa API                     | 1000 necessidades/seg |

## Quando NÃO usar Zaraz

- Rastreamento servidor a servidor (use Workers)
- Comunicação bidirecional em tempo real
- Transmissão de dados binários
- Fluxos de autenticação
