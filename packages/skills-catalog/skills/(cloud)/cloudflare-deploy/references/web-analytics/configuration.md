#Configuração

## Métodos de configuração

### Sites com proxy (automático)

Painel → Web Analytics → Adicionar site → Selecione o nome do host → Concluído

| Opção de injeção             | Descrição                                            |
| ---------------------------- | ---------------------------------------------------- |
| Habilitar                    | Injeção automática para todos os visitantes (padrão) |
| Ativar, excluindo UE         | Nenhuma injeção para a UE (GDPR)                     |
| Habilitar com snippet manual | Você adiciona o beacon manualmente                   |
| Desativar                    | Pausar rastreamento                                  |

**Falha se a resposta tiver:** `Cache-Control: public, no-transform`

**CSP necessário:**

```
script-src https://static.cloudflareinsights.com https://cloudflareinsights.com;
```

### Non-Proxied Sites (Manual)

Dashboard → Web Analytics → Add site → Enter hostname → Copy snippet

```html
<script
  defer
  src="https://static.cloudflareinsights.com/beacon.min.js"
  data-cf-beacon='{"token": "YOUR_TOKEN", "spa": true}'
></script>
```

**Limites:** 10 sites sem proxy por conta

## Modo SPA

**Ative `spa: true` para:** React Router, Next.js, Vue Router, Nuxt, SvelteKit, Angular

**Mantenha `spa: false` para:** Aplicativos tradicionais de várias páginas, sites estáticos, WordPress

**Roteamento de hash (`#/path`) NÃO suportado** - use roteamento da API de histórico.

## Gerenciamento de tokens

- Encontrado em: Dashboard → Web Analytics → Gerenciar site
- **Não é segredo** - domínio bloqueado, seguro para exposição em HTML
- Cada site recebe um token exclusivo

## Configuração do ambiente```typescript

// Only load in production
if (process.env.NODE_ENV === 'production') {
// Load beacon
}

```
Ou use tokens específicos do ambiente por meio de env vars.

## Verifique a instalação

1. Rede DevTools → filtrar `cloudflareinsights` → consulte `beacon.min.js` + solicitação de dados
2. Nenhum erro CSP/CORS no console
3. O painel mostra visualizações de página após um atraso de 5 a 10 minutos

## Regras (dependente do plano)

Configurar no painel para:

- **Taxa de amostragem** - reduz a% de coleta para tráfego intenso
- **Baseado em caminho** - comportamento diferente por rota
- **Baseado em host** - rastreamento separado por domínio

## Retenção de dados

- Janela rolante de 6 meses
- Granularidade de balde de 1 hora
- Sem exportação bruta, apenas painel
```
