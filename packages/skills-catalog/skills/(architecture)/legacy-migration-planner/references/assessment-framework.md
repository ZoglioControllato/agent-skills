# Estrutura de Avaliação

Métodos para mapear dependências, pontuar riscos, identificar domínios e avaliar dívida técnica. Cada saída desta estrutura deve citar `file:line` da base de código real ou de uma fonte externa verificada.

## Método de identificação de domínio

### Etapa 1: Inventário de módulos

Antes de identificar domínios, você precisa de um inventário completo de módulos. Para cada módulo:```markdown
| Module Path | Responsibility | Internal Imports | External Imports | Data Stores | Lines of Code |
|-------------|---------------|-----------------|-----------------|-------------|--------------|
| `src/orders/` | Order lifecycle | payments, inventory | Stripe API | orders, order_items | 1,200 |

````
Cada célula deve fazer referência a evidências `file:line` específicas.

### Etapa 2: agrupamento por afinidade

Agrupe módulos que possuem alta comunicação interna e compartilham vocabulário empresarial:

1. **Análise de importação** — Módulos que importam uns aos outros frequentemente pertencem um ao outro.
2. **Afinidade de dados** — Módulos que leem/gravam as mesmas tabelas de banco de dados pertencem um ao outro.
3. **Vocabulário comercial** — Módulos que usam os mesmos termos de domínio (pedido, pagamento, fatura) provavelmente pertencem ao mesmo domínio ou a um domínio relacionado.
4. **Frequência de mudança** — Módulos que mudam juntos no histórico do git (análise de co-mudança) provavelmente pertencem um ao outro.

Para análise de co-mudança, verifique no git log os arquivos que são frequentemente confirmados juntos. Isto é uma forte evidência de acoplamento lógico, mesmo quando a análise de importação não o demonstra.

### Etapa 3: métricas de acoplamento

Para cada domínio candidato, calcule:

**Pontuação de coesão** (acoplamento interno — quanto maior, melhor):```
cohesion = internal_imports / total_module_count_in_domain
````

**Pontuação de acoplamento** (acoplamento externo — quanto menor, melhor):```
coupling = external_imports / (internal_imports + external_imports)

````

**Acoplamento de banco de dados** (tabelas compartilhadas — quanto menor, melhor):```
db_coupling = shared_tables / total_tables_accessed
````

**Interpretação:**

- Acoplamento <0,3 → Bom limite de domínio
- Acoplamento 0,3-0,5 → Aceitável, pode necessitar de fachada
- Acoplamento > 0,5 → Limite incorreto, considere mesclar com o domínio ao qual ele se acopla

### Etapa 4: Scorecard do domínio

Para cada domínio candidato, produza um scorecard:```markdown

## Domain Scorecard: {Name}

| Metric           | Value            | Rating                             |
| ---------------- | ---------------- | ---------------------------------- |
| Cohesion         | 0.85             | Good                               |
| Coupling         | 0.22             | Good                               |
| DB Coupling      | 0.10             | Good                               |
| Lines of Code    | 3,200            | Medium complexity                  |
| Test Coverage    | 45%              | Needs improvement before migration |
| Change Frequency | 12 commits/month | Active — high business value       |

**Verdict**: Ready for migration / Needs boundary adjustment / Too coupled to migrate independently

````
## Matriz de Avaliação de Risco

### Categorias de risco

Avalie cada domínio de migração em relação a estas categorias de risco:

**Riscos técnicos:**

- Dependências circulares bloqueando a extração
- Estado mutável compartilhado entre domínios
- Acoplamento implícito através de variáveis globais ou singletons
- Falta cobertura de teste para caminhos críticos
- Migrações de banco de dados que afetam a integridade dos dados

**Riscos operacionais:**

- Tempo de inatividade durante a transição
- Degradação de desempenho durante execução dupla
- Monitoramento de lacunas durante a transição
- Cenários de falha de reversão

**Riscos comerciais:**

- Recursos com impacto na receita durante a migração
- Requisitos regulatórios/de conformidade
- SLAs voltados para o cliente que restringem as janelas de migração
- Lacunas de habilidades da equipe para a tecnologia alvo

### Pontuação de risco

Para cada risco:

| Campo | Valores |
|-------|--------|
| **Impacto** | Crítico (sistema inoperante) / Alto (degradado) / Médio (existe solução alternativa) / Baixo (cosméticos) |
| **Probabilidade** | Alto (> 50%) / Médio (20-50%) / Baixo (< 20%) |
| **Pontuação de risco** | Impacto x Probabilidade: Crítico=4, Alto=3, Médio=2, Baixo=1. Pontuação = valor_impacto x valor_probabilidade |
| **Gravidade** | Pontuação >= 12: CRÍTICO / >= 8: ALTA / >= 4: MÉDIA / < 4: BAIXA |

### Formato de documentação de risco```markdown
## Risk: {Short description}

**Category**: Technical | Operational | Business
**Impact**: {Level} — {Why, with evidence from codebase: file:line}
**Probability**: {Level} — {Why, with evidence}
**Score**: {Number} → **{Severity}**
**Mitigation**: {Specific strategy — reference pattern from strangler-fig-patterns.md if applicable}
**Residual risk**: {Risk level after mitigation is applied}
**Owner**: {Who should monitor this — ask user if unclear}
````

### Priorização de riscos

Classifique todos os riscos por pontuação (decrescente). Os 3 a 5 principais riscos devem ser abordados na Fase 0 do roteiro de migração (Configuração da Rede de Segurança). Qualquer risco CRÍTICO que não possa ser mitigado deverá ser encaminhado ao usuário antes de prosseguir com o plano.

## Avaliação Técnica da Dívida

### Categorias de dívida

| Categoria                 | Indicadores                                                | Como detectar                                                                                                  |
| ------------------------- | ---------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| **Dívida de dependência** | Pacotes desatualizados/obsoletos                           | Compare versões em arquivos de dependência com as mais recentes por meio de pesquisa na web                    |
| **Dívida de arquitetura** | Deps circulares, classes divinas, acesso a dados dispersos | Análise de importação, tamanho do módulo, controladores SQL                                                    |
| **Dívida de teste**       | Baixa cobertura, sem testes de integração                  | Contagem de arquivos de teste versus contagem de arquivos de origem, predefinição de configuração de cobertura |

nce |
| **Dívida de infraestrutura** | Implantações manuais, sem CI/CD, sem conteinerização | Verifique Dockerfile, configuração de CI, scripts de implantação |
| **Dívida de documentação** | Sem documentos de API, sem diagramas de arquitetura | Verifique documentos/, conteúdo README, especificações OpenAPI |

### Avaliação do Impacto da Dívida

Para cada item da dívida, avalie:

1. **Bloqueador de migração?** — Esta dívida IMPEDE a migração? (por exemplo, dependências circulares bloqueiam a extração de serviço)
2. **Amplificador de migração?** — Esta dívida torna a migração MAIS DIFÍCIL? (por exemplo, nenhum teste significa nenhuma rede de segurança)
3. **Pode ser resolvido durante a migração?** — A migração resolverá isso naturalmente? (por exemplo, mudar para uma nova estrutura elimina a dependência obsoleta)
4. **Deve ser resolvido antes da migração?** — Este é um pré-requisito? (por exemplo, precisa de cobertura de teste

idade antes da refatoração segura)

Classificação:

- **Bloqueador** → Deve ser resolvido na Fase 0 antes do início de qualquer migração
- **Amplificador** → Deve resolver na Fase 0 ou aceitar risco aumentado
- **Resolvido pela migração** → Documente, mas não priorize separadamente
- **Pré-requisito** → Agendamento na Fase 0

## Pontuação de complexidade de componentes

Avalie cada domínio/módulo em uma escala de 1 a 10 nestas dimensões:

| Dimensão                 | 1-3 (Baixo)           | 4-6 (Médio)              | 7-10 (Alto)                    |
| ------------------------ | --------------------- | ------------------------ | ------------------------------ |
| **Tamanho**              | < 500 LOC             | 500-2000 LOC             | > 2000 LOC                     |
| **Dependências**         | 0-2 externo           | 3-5 externo              | > 5 externos                   |
| **Acoplamento de dados** | Apenas mesas próprias | 1-2 mesas compartilhadas | Mais de 3 mesas compartilhadas |
| **Cobertura de teste**   | > 70%                 | 40-70%                   | <40%                           |
| **Alterar frequência**   | <2 commits/mês        | 2 a 10 commits/mês       | > 10 commits/mês               |

| \*\* Ônibus

criticidade\*\* | Ferramentas internas | Voltado para o cliente não crítico | Receita/autenticação/pagamento |

**Pontuação composta** = média de todas as dimensões.

**Recomendação de ordem de migração:**

- Pontuação 1-3: Migre primeiro (ganhos rápidos, baixo risco)
- Pontuação 4-6: Migração em fases intermediárias (complexidade moderada)
- Pontuação 7-10: Migrar por último (maior risco, precisa de mais preparação)

## Formato de catálogo de pontos de integração

Para cada integração externa descoberta durante a PESQUISA:```markdown

## Integration: {Name}

**Type**: REST API | GraphQL | gRPC | Message Queue | Database | File System | Third-party SDK
**Location**: `file:line` (where the call/connection is made)
**Direction**: Outbound (we call them) | Inbound (they call us) | Bidirectional
**Protocol**: HTTP/HTTPS | AMQP | WebSocket | TCP | etc.
**Authentication**: API key | OAuth | mTLS | None | Unknown (ASK USER)
**Data format**: JSON | XML | Protobuf | CSV | Binary | Unknown (ASK USER)
**Error handling**: `file:line` (how errors are currently handled)
**Contract**: OpenAPI spec at {path} | Proto file at {path} | None documented
**SLA**: {If known — ASK USER if critical integration}
**Migration impact**: Can wrap in facade | Needs contract renegotiation | Must maintain as-is

```

```
