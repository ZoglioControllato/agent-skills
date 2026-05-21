# Identificação de subdomínio e análise de contexto limitado

Esta habilidade analisa bases de código para identificar subdomínios (principal, de suporte, genérico) e sugerir contextos limitados seguindo os princípios de design estratégico de design orientado a domínio.

A habilidade **decomposição modular** incorpora uma cópia literal deste pacote em `referências/análise de domínio/` para usuários que desejam uma instalação para o pipeline de decomposição completo. Essa habilidade autônoma de **análise de domínio** continua sendo o alvo de instalação do catálogo quando você só precisa de análise estratégica DDD.

## Quando usar

Aplique esta habilidade quando:

- Analisando limites de domínio em qualquer base de código
- Identificação de subdomínios principais, de suporte e genéricos
- Mapeamento de contextos limitados do espaço do problema para o espaço da solução
- Avaliar a coesão do domínio e detectar problemas de acoplamento
- Planejando refatoração orientada a domínio
- Compreender as capacidades de negócios no código

## Princípios Fundamentais

### Classificação de subdomínio

**Domínio principal**: vantagem competitiva, maior valor comercial, requer os melhores desenvolvedores

- Indicadores: Lógica de negócios complexa, mudanças frequentes, especialistas no domínio necessários

**Subdomínio de suporte**: essencial, mas não diferenciador, específico do negócio

- Indicadores: Suporta Domínio Principal, complexidade moderada, regras específicas de negócios

**Subdomínio genérico**: funcionalidade comum, pode ser terceirizada

- Indicadores: Problema bem compreendido, baixa diferenciação, funcionalidade padrão

### Contexto limitado

Uma fronteira linguística explícita onde os termos do domínio têm significados específicos e inequívocos.

- Natureza primária: Limite linguístico, não técnico
- Regra principal: Dentro dos limites, todos os termos da Linguagem Ubíqua são inequívocos
- Objetivo: Alinhar 1 subdomínio a 1 contexto limitado (ideal)

## Processo de análise

### Fase 1: Extrair conceitos

Digitalize a base de código em busca de conceitos de negócios (não de infraestrutura):

1. **Entidades** (modelos de domínio com identidade)
   - Padrões: `@Entity`, `class`, modelos de domínio
   - Foco: Conceitos de negócios, não aulas técnicas

2. **Serviços** (operações comerciais)
   - Padrões: `*Service`, `*Manager`, `*Handler`
   - Foco: Lógica de negócios, não utilidades técnicas

3. **Casos de uso** (fluxos de trabalho de negócios)
   - Padrões: `*UseCase`, `*Command`, `*Handler`
   - Foco: Processos de negócios, não CRUD

4. **Controladores/Resolvedores** (pontos de entrada)
   - Padrões: `*Controller`, `*Resolver`, endpoints de API
   - Foco: capacidades de negócios, não rotas técnicas

### Fase 2: Agrupar por linguagem onipresente

Para cada conceito, determine:

**Contexto do idioma principal**

- A que vocabulário empresarial pertence isso?
- Exemplos:
  - `Assinatura`, `Fatura`, `Pagamento` → Idioma de cobrança
  - `Filme`, `Vídeo`, `Episódio` → Idioma do conteúdo
  - `Usuário`, `Autenticação` → Idioma de identidade

**Limites Linguísticos**

- Onde os significados dos termos mudam?
- Mesmo termo, significado diferente = contexto delimitado diferente
- Exemplo: “Cliente” em Vendas vs “Cliente” em Suporte

**Relacionamentos conceituais**

- Que conceitos pertencem naturalmente um ao outro?
- Quais compartilham vocabulário de negócios?
- Quais se referenciam?

### Fase 3: Identificar subdomínios

Um subdomínio tem:

- Capacidade de negócios distinta
- Valor comercial independente
- Vocabulário único
- Múltiplas entidades relacionadas trabalhando juntas
- Conjunto coeso de operações de negócios

**Padrões de domínio comuns**:

- Faturamento/Assinatura: Pagamentos, faturas, planos
- Conteúdo/Catálogo: Mídia, produtos, inventário
- Identidade/Acesso: Usuários, autenticação, autorização
- Analytics: métricas, painéis, insights
- Notificações: mensagens, alertas, comunicações

**Classifique cada subdomínio**:

Use esta árvore de decisão:```
Is it a competitive advantage?
YES → Core Domain
NO → Does it require business-specific knowledge?
YES → Supporting Subdomain
NO → Generic Subdomain

````
### Fase 4: Avaliar a coesão

**Indicadores de alta coesão** ✅

- Conceitos compartilham linguagem onipresente
- Conceitos frequentemente usados em conjunto
- Relações comerciais diretas
- Mudanças em um afetam outros no grupo
- Resolver o mesmo problema de negócios

**Indicadores de baixa coesão** ❌

- Diferentes vocabulários de negócios misturados
- Conceitos raramente usados juntos
- Sem relacionamento comercial direto
- As mudanças não afetam os outros
- Resolver diferentes problemas de negócios

**Fórmula de pontuação de coesão**:```
Score = (
  Linguistic Cohesion (0-3) +    // Shared vocabulary
  Usage Cohesion (0-3) +         // Used together
  Data Cohesion (0-2) +          // Entity relationships
  Change Cohesion (0-2)          // Change together
) / 10

8-10: High Cohesion ✅
5-7:  Medium Cohesion ⚠️
0-4:  Low Cohesion ❌
````

### Fase 5: Detectar problemas de baixa coesão

**Regra 1: Incompatibilidade linguística**

- Problema: Diferentes vocabulários de negócios misturados
- Exemplo: `Usuário` (identidade) + `Assinatura` (faturamento) no mesmo serviço
- Ação: Sugira a separação em diferentes contextos limitados

**Regra 2: Dependências entre domínios**

- Problema: acoplamento forte entre domínios
- Exemplo: o Serviço A instancia diretamente entidades do Domínio B
- Ação: sugerir integração baseada em interface

**Regra 3: Responsabilidades Mistas**

- Problema: uma única classe lida com vários problemas de negócios
- Exemplo: serviço que trata de faturamento e conteúdo
- Ação: Sugerir divisão por subdomínio

**Regra 4: Genérico no Core**

- Problema: Funcionalidade genérica na lógica de negócios principal
- Exemplo: Envio de e-mail no serviço de cobrança
- Ação: Extrair para subdomínio genérico

**Regra 5: Limites pouco claros**

- Problema: não é possível determinar a qual conceito de domínio pertence
- Exemplo: Entidade com relacionamentos com vários domínios
- Ação: Esclarecer limites, possivelmente dividir conceito

### Fase 6: Mapear contextos limitados

Para cada subdomínio identificado, sugira contexto limitado:

**Características do contexto limitado**:

- O nome reflete a linguagem onipresente
- Contém modelo de domínio completo
- Possui pontos de integração explícitos
- Limite linguístico claro

**Padrões de integração**:

- Kernel Compartilhado: Modelo compartilhado entre contextos (use com moderação)
- Cliente/Fornecedor: Downstream depende de upstream
- Conformista: Downstream está em conformidade com upstream
- Camada Anticorrupção: Camada de tradução entre contextos
- Open Host Service: interface publicada para integração
- Idioma publicado: protocolo de integração bem documentado

## Formato de saída

### Mapa de Domínio

Para cada domínio/subdomínio:```markdown

## Domain: {Name}

**Type**: Core Domain | Supporting Subdomain | Generic Subdomain

**Ubiquitous Language**: {key business terms}

**Business Capability**: {what business problem it solves}

**Key Concepts**:

- {Concept} (Entity|Service|UseCase) - {brief description}

**Subdomains** (if applicable):

1. {Subdomain} (Core|Supporting|Generic)
   - Concepts: {list}
   - Cohesion: {score}/10
   - Dependencies: → {other domains}

**Suggested Bounded Context**: {Name}Context

- Linguistic boundary: {where terms have specific meaning}
- Integration: {how it should integrate with other contexts}

**Dependencies**:

- → {OtherDomain} via {interface/API}
- ← {OtherDomain} via {interface/API}

**Cohesion Score**: {score}/10

````
### Matriz de Coesão```markdown
## Cross-Domain Cohesion

| Domain A | Domain B | Cohesion | Issue              | Recommendation          |
| -------- | -------- | -------- | ------------------ | ----------------------- |
| Billing  | Identity | 2/10     | ❌ Direct coupling | Use interface           |
| Content  | Billing  | 6/10     | ⚠️ Usage tracking  | Event-based integration |
````

### Relatório de Baixa Coesão```markdown

## Issues Detected

### Priority: High

**Issue**: {description}

- **Location**: {file/class/method}
- **Problem**: {what's wrong}
- **Concepts**: {involved concepts}
- **Cohesion**: {score}/10
- **Recommendation**: {suggested fix}

### Priority: Medium

{similar format}

````
### Mapa de contexto limitado```markdown
## Suggested Bounded Contexts

### {ContextName}Context

**Contains Subdomains**:

- {Subdomain1} (Core)
- {Subdomain2} (Supporting)

**Ubiquitous Language**:

- Term: Definition in this context

**Integration Requirements**:

- Consumes from: {OtherContext} via {pattern}
- Publishes to: {OtherContext} via {pattern}

**Implementation Notes**:

- Separate persistence
- Independent deployment
- Explicit API boundaries
````

## Melhores práticas

### O que fazer ✅

- Concentre-se na linguagem de negócios, não na estrutura do código
- Deixe a linguagem onipresente guiar os limites
- Medir a coesão objetivamente
- Identifique pontos de integração claros
- Classifique cada subdomínio (Principal/Suporte/Genérico)
- Procure primeiro os limites linguísticos

### O que não fazer ❌

- Não agrupe por camadas técnicas
- Não force um modelo global único
- Não ignore as diferenças linguísticas
- Não associe domínios diretamente
- Não crie contextos por arquitetura
- Não elimine todas as dependências (algumas são necessárias)

## Lista de verificação de análise

**Para cada conceito**:

- [ ] A que linguagem empresarial pertence?
- [ ] De que domínio/subdomínio faz parte?
- [] É essencial, de suporte ou genérico?
- [ ] Com que outros conceitos se relaciona?
- [] As dependências estão no mesmo domínio?
- [ ] Alguma incompatibilidade linguística?

**Para cada domínio**:

- [ ] O que é a linguagem onipresente?
- [ ] Quais são os conceitos-chave?
- [ ] Quais são os subdomínios?
- [ ] Qual é o Domínio Principal?
- [] O que são dependências entre domínios?
- [ ] A coesão interna é alta?
- [ ] Os limites estão claros?

**Para Análise de Coesão**:

- [] Calcular pontuações de coesão
- [ ] Identificar áreas de baixa coesão
- [] Mapear dependências entre domínios
- [] Sinalizar incompatibilidades linguísticas
- [] Observe o acoplamento apertado
- [] Sugerir esclarecimentos sobre limites

## Referência rápida

### Árvore de decisão de subdomínio```

Analyze business capability
└─ Is it competitive advantage?
├─ YES → Core Domain
└─ NO → Is it business-specific?
├─ YES → Supporting Subdomain
└─ NO → Generic Subdomain

````
### Verificação rápida de coesão```
Same vocabulary? → High linguistic cohesion
Used together? → High usage cohesion
Direct relationships? → High data cohesion
Change together? → High change cohesion

All high → Strong subdomain candidate
Mix of high/low → Review boundaries
All low → Likely wrong grouping
````

### Sinais de contexto limitado```

Clear boundary signs:
✅ Distinct Ubiquitous Language
✅ Concepts have unambiguous meaning
✅ Different meanings across contexts
✅ Clear integration points

Unclear boundary signs:
❌ Same terms with same meanings everywhere
❌ Concepts used identically across system
❌ No clear linguistic differences
❌ Tight coupling everywhere

```
## Antipadrões a serem evitados

**Grande bola de lama**

- Tudo conectado a tudo
- Sem limites claros
- Vocabulários mistos
- Prevenção: contextos limitados explícitos

**Modelo Tudo Incluído**

- Modelo único para todo o negócio
- Definições globais impossíveis
- Cria conflitos
- Prevenção: abrace múltiplos contextos

**Conceitos linguísticos mistos**

- Vocabulários diferentes no mesmo contexto
- Exemplo: Usuário/Permissão com Fórum/Postagem
- Prevenção: Mantenha associações linguísticas

## Notas

- Esta é uma análise estratégica, não uma implementação tática
- Concentre-se em QUE domínios existem, não em COMO implementar
- Algumas dependências entre domínios são normais
- Baixa coesão nem sempre significa “ruim”, significa “precisa de atenção”
- Subdomínios genéricos naturalmente têm menor coesão
- Sempre valide com especialistas do domínio quando possível

## Critérios de validação

Uma boa identificação de domínio tem:

- ✅ Limites claros com linguagem onipresente distinta
- ✅ Alta coesão interna dentro dos domínios
- ✅ Dependências explícitas entre domínios
- ✅ Alinhamento de negócios com capacidades
- ✅ Recomendações práticas para problemas
```
