#Cloudflare Zaraz

Orientação especializada para Cloudflare Zaraz – gerenciador de tags do lado do servidor para carregar ferramentas de terceiros na borda.

## O que é Zaraz?

Zaraz transfere scripts de terceiros (análises, anúncios, chat, marketing) para a borda da Cloudflare, melhorando a velocidade, a privacidade e a segurança do site. Impacto zero no desempenho do lado do cliente.

**Conceitos Básicos:**

- **Execução no lado do servidor** - Os scripts são executados no Cloudflare, não no navegador do usuário
- **Solicitação HTTP única** - Todas as ferramentas carregadas por meio de um endpoint
- **Privacidade em primeiro lugar** - Controle os dados enviados a terceiros
- **Sem sobrecarga de JS do lado do cliente** - Impacto mínimo no navegador

## Início rápido

1. Navegue até domínio > Zaraz no painel Cloudflare
2. Clique em "Iniciar configuração"
3. Adicione ferramentas (Google Analytics, Facebook Pixel, etc.)
4. Configure gatilhos (quando as ferramentas disparam)
5. Adicione o código de rastreamento ao seu site:```javascript
   // Track page view
   zaraz.track('page_view')

// Track custom event
zaraz.track('button_click', { button_id: 'cta' })

// Set user properties
zaraz.set('userId', 'user_123')

````
## Quando usar Zaraz

**Use Zaraz quando:**

- Adicionar várias ferramentas de terceiros (análises, anúncios, marketing)
- O desempenho do site é crítico (sem sobrecarga de JS do lado do cliente)
- Conformidade com a privacidade necessária (GDPR, CCPA)
- Equipes não técnicas precisam gerenciar ferramentas

**Use Workers diretamente quando:**

- Criação de lógica de rastreamento personalizada no lado do servidor
- Precisa de controle total sobre o processamento de dados
- Integração com sistemas backend complexos
- A biblioteca de ferramentas do Zaraz não atende às necessidades

## Nesta referência

| Arquivo | Finalidade | Quando ler |
| -------------------------------------- | -------------------------------------- | -------------------------------- |
| [api.md](./api.md) | API Web, objeto zaraz, métodos de consentimento | Implementando chamadas de rastreamento |
| [configuração.md](./configuration.md) | Configuração do painel, gatilhos, ferramentas | Configuração inicial, adição de ferramentas |
| [padrões.md](./padrões.md) | SPA, e-commerce, Integração de trabalhadores | Melhores práticas, cenários comuns |
| [gotchas.md](./gotchas.md) | Solução de problemas, limites, armadilhas | Problemas de depuração |

## Ordem de leitura por tarefa

| Tarefa | Arquivos para ler |
| --------------------- | ----------------------------------------- |
| Adicionar análises ao site | LEIA-ME → configuração.md |
| Acompanhe eventos personalizados | LEIA-ME → api.md |
| Problemas de rastreamento de depuração | pegadinhas.md |
| Rastreamento de SPA | api.md → padrões.md (seção SPA) |
| Acompanhamento de comércio eletrônico | api.md#ecommerce → padrões.md#ecommerce |
| Integração dos trabalhadores | padrões.md#worker-integração |
| Conformidade com o GDPR | api.md#consent → configuração.md#consent |

## Árvore de decisão```
O que você precisa?

├─ Rastreie eventos no navegador → api.md
│ ├─ Visualizações de página, cliques → zaraz.track()
│ ├─ Propriedades do usuário → zaraz.set()
│ └─ Comércio eletrônico → zaraz.ecommerce()
│
├─ Configurar Zaraz → configuração.md
│ ├─ Adicionar GA4/Facebook → configuração de ferramentas
│ ├─ Quando as ferramentas disparam → aciona
│ └─ Consentimento do GDPR → finalidades de consentimento
│
├─ Integrar com trabalhadores → padrões.md#worker-integration
│ ├─ Enriquecer contexto → Enriquecedores de contexto
│ └─ Rastreamento de injeção → Reescrita de HTML
│
└─ Problemas de depuração → gotchas.md
├─ Eventos não disparados → solução de problemas
├─ Problemas de consentimento → depuração de consentimento
└─ Desempenho → ferramentas de depuração
````

## Key Features

- **100+ Pre-built Tools** - GA4, Facebook, Google Ads, TikTok, etc.
- **Zero Client Impact** - Runs at Cloudflare's edge, not browser
- **Privacy Controls** - Consent management, data filtering
- **Custom Tools** - Build Managed Components for proprietary systems
- **Worker Integration** - Enrich context, compute dynamic values
- **Debug Mode** - Real-time event inspection

## Reference

- [Zaraz Docs](https://developers.cloudflare.com/zaraz/)
- [Web API](https://developers.cloudflare.com/zaraz/web-api/)
- [Managed Components](https://developers.cloudflare.com/zaraz/advanced/load-custom-managed-component/)

---

This skill focuses exclusively on Zaraz. For Workers development, see `cloudflare-workers` skill.
