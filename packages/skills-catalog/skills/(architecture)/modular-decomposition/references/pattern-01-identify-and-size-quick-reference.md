# Identificação e dimensionamento de componentes - Referência rápida

## Definição de componente

**Component** = Nó folha na estrutura de diretório/namespace contendo arquivos de origem

**Subdomínio** = Namespace pai que foi estendido (não um componente)

## Métricas de tamanho

| Métrica         | Como calcular                                     | Finalidade                |
| --------------- | ------------------------------------------------- | ------------------------- |
| **Declarações** | Contar instruções executáveis ​​(não linhas)      | Medida de tamanho precisa |
| **Arquivos**    | Contar arquivos de origem no componente           | Indicador de complexidade |
| **Porcentagem** | `(component_statements / total_statements) * 100` |

Tamanho relativo |
| **Desenvolvimento padrão** | `sqrt(soma((tamanho - média)^2) / (n-1))` | Detecção de valores discrepantes |

## Limites de tamanho

| Tamanho do aplicativo     | Limite superdimensionado | Notas                              |
| ------------------------- | ------------------------ | ---------------------------------- |
| Pequeno (<10 componentes) | >30% da base de código   | Menos componentes, maior variância |
| Médio (10-20 componentes) | >15% da base de código   | Limiar equilibrado                 |
| Grande (>20 componentes)  | >10% da base de código   | Mais componentes, menor variância  |

**Regra de desvio padrão**: Componentes >2 std dev da média são superdimensionados

## Status do Componente

- ✅ **OK**: Dentro de 1-2 desvio padrão da média, tamanho apropriado
- ⚠️ **Muito grande**: >2 desvio padrão acima da média ou excede o limite
- 🔍 **Muito pequeno**: <1 std dev abaixo da média ou <1% da base de código

## Etapas de análise rápida

1. **Mapear diretórios** → Identificar nós folha (componentes)
2. **Declarações de contagem** → Por componente, soma entre arquivos
3. **Calcular estatísticas** → Média, desenvolvimento padrão, porcentagens
4. **Sinalizar valores discrepantes** → >2 desenvolvimento padrão ou violações de limite
5. **Recomendar ações** → Dividir grande, consolidar pequeno

## Padrões Comuns

### Node.js/Express```

services/ComponentName/ ← Component
routes/v1/endpoint/ ← Component
models/ModelName/ ← Component

````
###Java```
com.company.domain.service ← Component (leaf package)
com.company.domain         ← Subdomain (parent)
````

###Píton```
app/domain/service/ ← Component (leaf module)
app/domain/ ← Subdomain (parent)

````
## Modelo de saída```markdown
## Component Inventory

| Component | Namespace | Statements | Files | %   | Status |
| --------- | --------- | ---------- | ----- | --- | ------ |
| Name      | path      | 4,312      | 23    | 5%  | ✅ OK  |

## Summary

- Total: X components
- Mean: Y statements
- Std Dev: Z statements
- Oversized: [list]
- Recommendations: [actions]
````
