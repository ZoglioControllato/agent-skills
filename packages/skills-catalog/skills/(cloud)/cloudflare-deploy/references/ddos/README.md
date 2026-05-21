# Proteção DDoS da Cloudflare

Proteção autônoma e sempre ativa contra ataques DDoS em L3/4 e L7.

## Tipos de proteção

- **HTTP DDoS (L7)**: protege o tráfego HTTP/HTTPS, fase `ddos_l7`, nível de zona/conta
- **DDoS de rede (L3/4)**: inundações UDP/SYN/DNS, fase `ddos_l4`, apenas no nível da conta
- **DDoS adaptativo**: aprende a linha de base de 7 dias, detecta desvios, 4 tipos de perfil (origens, agentes de usuários, locais, protocolos)

## Disponibilidade do plano

| Recurso                   | Grátis | Pró    | Negócios | Empresa  | Empresa Avançada |
| ------------------------- | ------ | ------ | -------- | -------- | ---------------- |
| DDoS HTTP (L7)            | ✓      | ✓      | ✓        | ✓        | ✓                |
| Rede DDoS (L3/4)          | ✓      | ✓      | ✓        | ✓        | ✓                |
| Substituir regras         | 1      | 1      | 1        | 1        | 10               |
| Expressões personalizadas | ✗      | ✗      | ✗        | ✗        | ✓                |
| Ação de registro          | ✗      | ✗      | ✗        | ✗        | ✓                |
| DDoS adaptativo           | ✗      | ✗      | ✗        | ✓        | ✓                |
| Filtros de alerta         | Básico | Básico | Básico   | Avançado | Avançado         |

## Ações e Sensibilidade

- **Ações**: `block`, `owned_challenge`, `challenge`, `log` (somente Enterprise Advanced)
- **Sensibilidade**: `default` (alta), `medium`, `low`, `eoff` (essencialmente desligado)
- **Substituir**: por categoria/tag ou ID de regra individual
- **Escopo**: as substituições no nível da zona têm precedência sobre o nível da conta

## Ordem de leitura

| Arquivo                               | Finalidade                                                           | Comece aqui se...                                                        |
| ------------------------------------- | -------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| [configuração.md](./configuration.md) | Configuração do painel, estrutura de regras, perfis adaptáveis ​​    | Você está configurando a proteção DDoS pela primeira vez                 |
| [api.md](./api.md)                    | Endpoints de API, uso de SDK, descoberta de ID de conjunto de regras | Você está automatizando a configuração ou precisa de acesso programático |
| [padrões.md](./padrões.md)            | Estratégias de proteção, defesa em profundidade, resposta dinâmica   | Você precisa de padrões de implementação ou segurança em camadas         |
| [gotchas.md](./gotchas.md)            | Falsos positivos, ajuste, tratamento de erros                        | Você está solucionando problemas ou otimizando a proteção existente      |

## Veja também

- [waf](../waf/) - Regras de segurança da camada de aplicação
- [bot-management](../bot-management/) - Detecção e mitigação de bots
