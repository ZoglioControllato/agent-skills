# Análise da Web Cloudflare

Análise da web com foco na privacidade, fornecendo Core Web Vitals, métricas de tráfego e insights do usuário sem comprometer a privacidade do visitante.

## Visão geral

O Cloudflare Web Analytics oferece:

- **Core Web Vitals** - Monitoramento LCP, FID, CLS, INP, TTFB
- **Visualizações e visitas de página** - Padrões de tráfego sem cookies
- **Referenciadores e caminhos** - Origens de tráfego e páginas populares
- **Dados do dispositivo e do navegador** - Detalhamento do agente do usuário
- **Dados geográficos** - Distribuição de visitantes em nível de país
- **Privacidade em primeiro lugar** - Sem cookies, impressões digitais ou coleta de PII
- **Grátis** - Sem custo, visualizações de página ilimitadas

**Importante:** Web Analytics é **somente painel**. Não existe API para acesso programático a dados.

## Árvore de decisão de início rápido```

O proxy do seu site é feito pela Cloudflare?
├─ SIM → Usar injeção automática (configuration.md)
│ ├─ Habilitar injeção automática no painel
│ └─ Nenhuma alteração de código necessária (a menos que Cache-Control: no-transform)
│
└─ NÃO → Use integração manual de beacon (integration.md)
├─ Adicionar trecho JS ao HTML
├─ Use spa: true para React/Vue/Next.js
└─ Configure o CSP se necessário

````
## Ordem de leitura

1. **[configuration.md](configuration.md)** - Configuração para sites com proxy e sem proxy
2. **[integration.md](integration.md)** - Integração de beacon específica da estrutura (React, Next.js, Vue, Nuxt, etc.)
3. **[patterns.md](patterns.md)** - Casos de uso comuns (monitoramento de desempenho, consentimento do GDPR, rastreamento de vários sites)
4. **[gotchas.md](gotchas.md)** - Solução de problemas (rastreamento de SPA, problemas de CSP, limitações de roteamento de hash)

## Quando usar cada arquivo

- **Configurando pela primeira vez?** → Comece com configuration.md
- **Usando React/Next.js/Vue/Nuxt?** → Vá para integração.md para obter o código da estrutura
- **Precisa de carregamento de consentimento do GDPR?** → Veja padrões.md
- **Beacon não carrega ou não há dados?** → Verifique gotchas.md
- **SPA não rastreia a navegação?** → Veja integração.md para configuração `spa: true`

## Conceitos-chave

### Sites com proxy e sem proxy

| Tipo | Descrição | Injeção de farol | Limite |
| --------------- | ------------------------------------- | ------------------- | ------------ |
| **Procurado** | DNS através do Cloudflare (nuvem laranja) | Automático ou manual | Ilimitado |
| **Sem proxy** | Hospedagem externa, beacon manual | Somente manual | Máximo de 10 sites |

### Modo SPA

**Crítico para estruturas modernas:**

```json
{ "token": "YOUR_TOKEN", "spa": true }
````

Without `spa: true`, client-side navigation (React Router, Vue Router, Next.js routing) will NOT be tracked. Only initial page loads will register.

### CSP Requirements

If using Content Security Policy, allow both domains:

```
script-src https://static.cloudflareinsights.com https://cloudflareinsights.com;
```

## Recursos

### Depuração do Core Web Vitals

- **LCP (Largest Contentful Paint)** - Identifica imagens/elementos de herói de carregamento lento
- **FID (atraso na primeira entrada)** - Capacidade de resposta da interação (métrica herdada)
- **INP (Interaction to Next Paint)** - Métrica moderna de capacidade de resposta de interação
- **CLS (mudança cumulativa de layout)** - Problemas de estabilidade visual
- **TTFB (tempo até o primeiro byte)** - Desempenho de resposta do servidor

O painel mostra os 5 principais elementos problemáticos com seletores CSS para depuração.

### Filtros de tráfego

- **Filtragem de bots** - Excluir tráfego automatizado das métricas
- **Intervalos de datas** - Análise de período de tempo personalizado
- **Geográfico** - Filtragem em nível de país
- **Tipo de dispositivo** - Detalhamento de computadores, celulares e tablets
- **Navegador/SO** - Filtragem de agente de usuário

### Regras (Avançado - Dependente do plano)

Crie regras de rastreamento personalizadas para configurações avançadas:

**Regras de taxa de amostra:**

- Reduza a porcentagem de coleta de dados para sites de alto tráfego
- Exemplo: Rastreie apenas 50% dos visitantes para reduzir o volume

**Regras baseadas em caminho:**

- Comportamento diferente por rota
- Exemplo: excluir `/admin/*` ou `/internal/*` do rastreamento

**Regras baseadas em host:**

- Configurações de vários domínios
- Exemplo: rastreamento separado para subdomínios de teste versus subdomínios de produção

**Disponibilidade:** O recurso de regras depende do seu plano Cloudflare. Verifique o painel em Web Analytics → Regras para ver se está disponível. Os planos gratuitos podem ter acesso limitado ou nenhum acesso.

## Limites do plano

| Recurso                 | Grátis              | Notas                     |
| ----------------------- | ------------------- | ------------------------- |
| Sites proxy             | Ilimitado           | DNS através do Cloudflare |
| Sites sem proxy         | 10                  | Hospedagem externa        |
| Visualizações de página | Ilimitado           | Sem limites de volume     |
| Retenção de dados       | 6 meses             | Janela rolante            |
| Regras                  | Dependente do plano | Verifique o painel        |

## Privacidade e conformidade

- **Sem cookies** - Zero armazenamento do lado do cliente
- **Sem impressão digital** - Sem rastreamento entre sites
- **Sem PII** - Endereços IP não armazenados
- **Compatível com GDPR** - Coleta mínima de dados
- **Compatível com CCPA** - Sem venda de dados pessoais

**Desativação da UE:** Opção de painel para excluir totalmente os dados de visitantes da UE.

## Limitações

- **Somente painel** - Sem API para acesso programático
- **Sem tempo real** - Atraso de dados de 5 a 10 minutos
- **Sem eventos personalizados** - Apenas visualização automática de página/rastreamento de navegação
- **Somente API de histórico** - Roteamento baseado em hash (`#/path`) não suportado
- **Sem repetição da sessão** - Somente métricas, sem gravações do usuário
- **Sem rastreamento de formulário** - Somente rastreamento de navegação de página

## Veja também

- [Documentos do Cloudflare Web Analytics](https://developers.cloudflare.com/analytics/web-analytics/)
- [Guia Core Web Vitals](https://web.dev/vitals/)
