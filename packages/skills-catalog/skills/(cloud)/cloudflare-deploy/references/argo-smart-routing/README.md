# Referência de habilidade de roteamento inteligente Cloudflare Argo

## Visão geral

Cloudflare Argo Smart Routing é um serviço de otimização de desempenho que detecta problemas de rede em tempo real e roteia o tráfego da web pelo caminho de rede mais eficiente. Ele monitora continuamente as condições da rede e roteia o tráfego de maneira inteligente pelas rotas mais rápidas e confiáveis ​​da rede da Cloudflare.

**Observação sobre o Smart Shield:** O Argo Smart Routing está sendo integrado ao produto Smart Shield da Cloudflare para melhorar a proteção e o desempenho contra DDoS. Os clientes existentes da Argo mantêm todas as funcionalidades com a migração gradual para os recursos do Smart Shield.

## Início rápido

### Habilitar via cURL```bash

curl -X PATCH "https://api.cloudflare.com/client/v4/zones/{zone_id}/argo/smart_routing" \
 -H "Authorization: Bearer YOUR_API_TOKEN" \
 -H "Content-Type: application/json" \
 -d '{"value": "on"}'

````

### Enable via TypeScript SDK

```typescript
import Cloudflare from 'cloudflare'

const client = new Cloudflare({ apiToken: process.env.CLOUDFLARE_API_TOKEN })

const result = await client.argo.smartRouting.edit({
  zone_id: 'your-zone-id',
  value: 'on',
})

console.log(`Argo enabled: ${result.value}`)
````

## Conceitos Básicos

### O que faz

- **Roteamento inteligente**: detecta congestionamentos, interrupções e perda de pacotes em tempo real
- **Otimização global**: rotas em mais de 300 data centers da Cloudflare
- **Failover automático**: alterna caminhos quando problemas são detectados (normalmente <1s)
- **Funciona com configuração existente**: não são necessárias alterações de origem

### Modelo de cobrança

- Com base no uso: cobrado por GB de tráfego (excluindo tráfego mitigado de DDoS/WAF)
- Requer configuração de faturamento antes de ativar
- Disponível nos planos Enterprise+ (verifique a elegibilidade da zona)

### Quando usar

- **Sites de produção de alto tráfego** com base de usuários global
- **Aplicativos sensíveis à latência** (APIs, serviços em tempo real)
- **Sites por trás do proxy Cloudflare** (registros DNS em nuvem laranja)
- **Combinado com Tiered Cache** para ganhos máximos de desempenho

### Quando NÃO usar

- Ambientes de desenvolvimento/staging (controle de custos)
- Sites de baixo tráfego (<1 TB/mês) onde o custo pode exceder o benefício
- Sites com tráfego principalmente de uma única região

## Devo ativar o Argo?

| Sua situação                                     | Recomendação                             |
| ------------------------------------------------ | ---------------------------------------- |
| Aplicativo de produção global, tráfego >1 TB/mês | ✅ Habilitar - provável ROI positivo     |
| Plano empresarial, APIs críticas para latência   | ✅ Habilitar - o desempenho é importante |
| Site regional, tráfego <100 GB/mês               | ⚠️ Avalie – o custo pode não justificar  |
| Ambiente de desenvolvimento/preparação           | ❌ Desativar - uso somente em produção   |
| Faturamento ainda não configurado                | ❌ Configure o faturamento primeiro      |

## Ordem de leitura por tarefa

| Seu objetivo                           | Comece com                                                 | Então leia               |
| -------------------------------------- | ---------------------------------------------------------- | ------------------------ |
| Habilite o Argo pela primeira vez      | Início rápido acima → [configuration.md](configuration.md) | [gotchas.md](gotchas.md) |
| Use o SDK TypeScript/Python            | [api.md](api.md)                                           | [padrões.md](padrões.md) |
| Configuração do Terraform/IaC          | [configuração.md](configuração.md)                         | -                        |
| Habilitar para aplicativo Spectrum TCP | [patterns.md](patterns.md) → seção Espectro                | [api.md](api.md)         |
| Solucionar problema de ativação        | [gotchas.md](gotchas.md)                                   | [api.md](api.md)         |
| Gerenciar faturamento/uso              | [patterns.md](patterns.md) → Seção de cobrança             | [gotchas.md](gotchas.md) |

## Nesta referência

- **[api.md](api.md)** - endpoints de API, métodos SDK, tratamento de erros, exemplos de Python/TypeScript
- **[configuration.md](configuration.md)** - Configuração do Terraform, configuração do ambiente, configuração de faturamento
- **[patterns.md](patterns.md)** - Integração de cache em camadas, aplicativos Spectrum TCP, gerenciamento de faturamento, padrões de validação
- **[gotchas.md](gotchas.md)** - Erros comuns, problemas de permissão, limites, práticas recomendadas

## Veja também

- [Documentos de roteamento inteligente Cloudflare Argo](https://developers.cloudflare.com/argo-smart-routing/)
- [Escudo Inteligente Cloudflare](https://developers.cloudflare.com/smart-shield/)
- [Documentação do Spectrum](https://developers.cloudflare.com/spectrum/)
- [Cache em camadas](https://developers.cloudflare.com/cache/how-to/tiered-cache/)
