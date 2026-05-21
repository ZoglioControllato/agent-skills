# Configuração DDoS

## Configuração do painel

1. Navegue até Segurança > DDoS
2. Selecione HTTP DDoS ou DDoS de camada de rede
3. Configure a sensibilidade e a ação por conjunto de regras/categoria/regra
4. Aplicar substituições com expressões opcionais (Enterprise Advanced)
5. Ative a alternância Adaptive DDoS (Enterprise/Enterprise Advanced, requer histórico de tráfego de 7 dias)

## Estrutura de regras

```typescript
interface DDoSOverride {
  description: string
  rules: Array<{
    action: 'execute'
    expression: string // Custom expression (Enterprise Advanced) or "true" for all
    action_parameters: {
      id: string // Managed ruleset ID (discover via api.md)
      overrides: {
        sensitivity_level?: 'default' | 'medium' | 'low' | 'eoff'
        action?: 'block' | 'managed_challenge' | 'challenge' | 'log' // log = Enterprise Advanced only
        categories?: Array<{
          category: string // e.g., "http-flood", "udp-flood"
          sensitivity_level?: string
        }>
        rules?: Array<{
          id: string
          action?: string
          sensitivity_level?: string
        }>
      }
    }
  }>
}
```

##Disponibilidade de expressão

| Plano               | Expressões personalizadas | Exemplo                                                        |
| ------------------- | ------------------------- | -------------------------------------------------------------- |
| Grátis/Pro/Negócios | ✗                         | Use `"true"` apenas                                            |
| Empresa             | ✗                         | Use `"true"` apenas                                            |
| Empresa Avançada    | ✓                         | `ip.src em {...}`, `http.request.uri.path corresponde a "..."` |

## Mapeamento de Sensibilidade

| UI                       | API      | Limite           |
| ------------------------ | -------- | ---------------- |
| alto                     | `padrão` | Mais agressivo   |
| Médio                    | `médio`  | Equilibrado      |
| Baixa                    | `baixo`  | Menos agressivos |
| Essencialmente desligado | `eoff`   | Mitigação mínima |

## Categorias Comuns

- `http-flood`, `http-anomalia` (L7)
- `udp-flood`, `syn-flood`, `dns-flood` (L3/4)

## Substituir precedência

Múltiplas camadas de substituição se aplicam nesta ordem (ganha precedência mais alta):```
Zone-level > Account-level
Individual Rule > Category > Global sensitivity/action

```
**Exemplo**: a regra de zona para `/api/*` substitui as configurações globais no nível da conta.

## Perfis DDoS adaptáveis

**Disponibilidade**: Empresarial, Empresarial Avançado
**Período de aprendizagem**: são necessários 7 dias de histórico de tráfego

| Tipo de perfil | Descrição | Detecta |
| --------------- | ------------------------------------ | --------------------------------------- |
| **Origens** | Padrões de tráfego por servidor de origem | Pedidos anómalos para origens específicas |
| **Agentes de usuário** | Padrões de tráfego por User-Agent | Sequências de agentes de usuário maliciosos/anômalos |
| **Locais** | Padrões de tráfego por geolocalização | Ataques de países/regiões específicos |
| **Protocolos** | Padrões de tráfego por protocolo (L3/4) | Ataques de inundação específicos do protocolo |

Configure visando IDs de regras adaptativas específicas via API (consulte api.md#typed-override-examples).

## Alerta

Configurar via notificações:

- Tipos de alerta: variantes `http_ddos_attack_alert`, `layer_3_4_ddos_attack_alert`, `advanced_*`
- Filtros: zonas, nomes de host, limites RPS/PPS/Mbps, IPs, protocolos
- Mecanismos: e-mail, webhooks, PagerDuty

Consulte [api.md](./api.md#alert-configuration) para obter exemplos de API.
```
