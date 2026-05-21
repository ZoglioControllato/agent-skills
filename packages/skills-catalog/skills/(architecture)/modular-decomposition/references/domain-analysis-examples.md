# Exemplos de identificação de subdomínio

Este documento fornece exemplos práticos de aplicação de identificação de subdomínio em diferentes tipos de bases de código.

## Exemplo 1: Plataforma de comércio eletrônico

### Conceitos Descobertos

**Entidades**:

- Produto, categoria, estoque, SKU
- Pedido, OrderItem, Carrinho, CartItem
- Cliente, Endereço, Método de Pagamento
- Remessa, Rastreamento, Armazém

**Serviços**:

- ProductCatalogService, InventoryService
- OrderProcessingService, CartService
- Serviço de pagamento, serviço de envio
- Atendimento ao Cliente

### Grupos de idiomas

**Idioma do catálogo**: produto, categoria, SKU, estoque, estoque
**Idioma do pedido**: pedido, carrinho, finalização da compra, atendimento
**Idioma de pagamento**: pagamento, transação, reembolso, cobrança
**Idioma de envio**: envio, rastreamento, entrega, transportadora
**Idioma do cliente**: cliente, conta, perfil, endereço

### Subdomínios identificados

#### 1. Catálogo de produtos (domínio principal)

- **Tipo**: Principal (se diferenciação for descoberta de produto)
- **Linguagem onipresente**: produto, categoria, catálogo, pesquisa, navegação
- **Conceitos**: Produto, Categoria, ProductCatalogService
- **Coesão**: 9/10
- **Contexto limitado**: CatalogContext

#### 2. Gerenciamento de estoque (suporte)

- **Tipo**: Suporte
- **Linguagem onipresente**: estoque, inventário, SKU, armazém, alocação
- **Conceitos**: Estoque, SKU, InventoryService, Armazém
- **Coesão**: 8/10
- **Contexto limitado**: InventoryContext

#### 3. Processamento de pedidos (domínio principal)

- **Tipo**: Core (se diferenciação for experiência de checkout)
- **Linguagem onipresente**: pedido, carrinho, finalização da compra, atendimento
- **Conceitos**: Pedido, Carrinho, OrderProcessingService
- **Coesão**: 9/10
- **Contexto limitado**: OrderContext

#### 4. Processamento de pagamento (genérico)

- **Tipo**: Genérico (gateway de pagamento padrão)
- **Linguagem onipresente**: pagamento, transação, cobrança, reembolso
- **Conceitos**: Pagamento, PaymentService, PaymentGateway
- **Coesão**: 7/10
- **Contexto limitado**: PaymentContext

#### 5. Envio (Suporte)

- **Tipo**: Suporte
- **Linguagem onipresente**: envio, rastreamento, entrega, transportadora
- **Conceitos**: Remessa, Rastreamento, Serviço de Remessa
- **Coesão**: 8/10
- **Contexto limitado**: ShippingContext

### Análise de Coesão

| Domínio A  | Domínio B  | Coesão | Relacionamento                               |
| ---------- | ---------- | ------ | -------------------------------------------- |
| Catálogo   | Inventário | 6/10   | ⚠️ Verificação de disponibilidade do produto |
| Encomendar | Catálogo   | 5/10   | ⚠️ Referência do produto em ordem            |
| Encomendar | Pagamento  | 7/10   | ✅ Pedido aciona pagamento                   |
| Encomendar | Envio      | 7/10   | ✅ Pedido aciona envio                       |
| Cliente    | Encomendar | 3/10   | ❌ Referência direta da entidade             |

### Problemas de baixa coesão

**Problema 1**: entidade do cliente diretamente referenciada no pedido

- **Problema**: Contextos diferentes (Identidade vs Ordem)
- **Recomendação**: use o objeto de valor CustomerId, não a referência de entidade
- **Padrão**: Idioma publicado

**Problema 2**: o serviço de catálogo verifica o inventário diretamente

- **Problema**: o domínio principal depende do suporte
- **Recomendação**: use atualizações de inventário baseadas em eventos
- **Padrão**: Eventos de Domínio

---

## Exemplo 2: Sistema de Saúde

### Conceitos Descobertos

**Entidades**:

- Paciente, Registro Médico, Diagnóstico
- Compromisso, Horário, Disponibilidade
- Prescrição, Medicação, Dosagem
- Médico, Enfermeira, Funcionários
- Faturamento, reclamação, seguro

### Grupos de idiomas

**Linguagem Clínica**: paciente, diagnóstico, tratamento, prontuário médico
**Idioma de Agendamento**: compromisso, horário, disponibilidade, horário
**Linguagem da Farmácia**: prescrição, medicamento, dosagem, medicamento
**Idioma da equipe**: médico, enfermeiro, profissional, credencial
**Idioma de cobrança**: reclamação, seguro, copagamento, reembolso

### Subdomínios identificados

#### 1. Atendimento ao paciente (domínio principal)

- **Tipo**: Núcleo
- **Linguagem onipresente**: paciente, diagnóstico, tratamento, plano de cuidados
- **Conceitos**: Paciente, Registro Médico, Diagnóstico, CareService
- **Coesão**: 9/10
- **Contexto limitado**: ClinicalContext

#### 2. Gerenciamento de compromissos (suporte)

- **Tipo**: Suporte
- **Linguagem onipresente**: agendamento, horário, disponibilidade, reserva
- **Conceitos**: Consulta, Agendamento, AgendamentoServiço
- **Coesão**: 8/10
- **Contexto limitado**: SchedulingContext

#### 3. Farmácia (Apoio)

- **Tipo**: Apoio (ou Básico se farmácia for diferenciadora)
- **Linguagem onipresente**: prescrição, medicação, dosagem, interação medicamentosa
- **Conceitos**: Prescrição, Medicamentos, FarmáciaServiço
- **Coesão**: 8/10
- **Contexto limitado**: PharmacyContext

#### 4. Faturamento Médico (Suporte)

- **Tipo**: Suporte
- **Linguagem onipresente**: reclamação, seguro, cobrança, reembolso
- **Conceitos**: Sinistro, Seguro, FaturamentoServiço
- **Coesão**: 7/10
- **Contexto limitado**: BillingContext

### Principais insights

**O conceito de "paciente" tem significados diferentes**:

| Contexto    | Paciente Significado   | Propriedades                         |
| ----------- | ---------------------- | ------------------------------------ |
| Clínica     | Disciplina médica      | Diagnóstico, sinais vitais, alergias |
| Agendamento | Titular da nomeação    | Disponibilidade, preferências        |
| Faturamento | Ordenador/beneficiário | Seguros, saldo, sinistros            |

→ Estes são contextos delimitados diferentes, apesar de compartilharem o termo "Paciente"

---

## Exemplo 3: Ferramenta de gerenciamento de projetos SaaS

### Conceitos Descobertos

**Entidades**:

- Projeto, Tarefa, Marco, Sprint
- Usuário, equipe, função, permissão
- Comentário, Anexo, Atividade
- Assinatura, Plano, Fatura
- Notificação, Alerta

### Grupos de idiomas

**Linguagem do projeto**: projeto, tarefa, marco, sprint, backlog
**Linguagem de colaboração**: comentário, discussão, menção, atividade
**Idioma de acesso**: usuário, equipe, função, permissão, acesso
**Idioma de cobrança**: assinatura, plano, fatura, pagamento
**Idioma de notificação**: notificação, alerta, lembrete

### Subdomínios identificados

#### 1. Gerenciamento de Projetos (Domínio Principal)

- **Tipo**: Núcleo
- **Linguagem onipresente**: projeto, tarefa, marco, fluxo de trabalho
- **Conceitos**: Projeto, Tarefa, Marco, ProjectService
- **Coesão**: 9/10
- **Contexto limitado**: ProjectContext

#### 2. Colaboração (principal/suporte)

- **Tipo**: Núcleo se diferenciador, Suporte caso contrário
- **Linguagem onipresente**: comentário, discussão, atividade, colaboração
- **Conceitos**: Comentário, Atividade, Serviço de Colaboração
- **Coesão**: 8/10
- **Contexto limitado**: CollaborationContext

#### 3. Identidade e acesso (genérico)

- **Tipo**: Genérico
- **Linguagem onipresente**: usuário, autenticação, autorização, função
- **Conceitos**: Usuário, Função, Permissão, AuthService
- **Coesão**: 9/10
- **Contexto limitado**: IdentityContext

#### 4. Faturamento (Suporte)

- **Tipo**: Suporte
- **Linguagem onipresente**: assinatura, plano, fatura, cobrança
- **Conceitos**: Assinatura, Fatura, BillingService
- **Coesão**: 8/10
- **Contexto limitado**: BillingContext

#### 5. Notificações (genéricas)

- **Tipo**: Genérico
- **Linguagem onipresente**: notificação, alerta, mensagem, lembrete
- **Conceitos**: Notificação, NotificationService
- **Coesão**: 7/10
- **Contexto limitado**: NotificationContext

### Problema de baixa coesão

**Problema**: entidade de usuário usada em todos os lugares```typescript
// Project domain
class Project {
owner: User; // ❌ Direct reference
members: User[]; // ❌ Direct reference
}

// Collaboration domain
class Comment {
author: User; // ❌ Direct reference
}

// Billing domain
class Subscription {
subscriber: User; // ❌ Direct reference
}

````

**Problema**: o conceito de contexto de identidade vazou em todos os domínios

**Recomendação**: use conceitos específicos do contexto```typescript
// Project domain
class Project {
  ownerId: OwnerId;           // ✅ Value object
  members: MemberId[];        // ✅ Value object
}

// Collaboration domain
class Comment {
  authorId: ParticipantId;    // ✅ Context-specific
}

// Billing domain
class Subscription {
  subscriberId: CustomerId;   // ✅ Context-specific
}
````

---

## Exemplo 4: Plataforma de streaming de vídeo

### Conceitos Descobertos

**Entidades**:

- Filme, programa de TV, episódio, temporada
- Vídeo, Stream, Codificação, Qualidade
- Lista de observação, visualização, progresso
- Recomendação, Preferência
- Assinatura, Plano, Faturamento

### Grupos de idiomas

**Idioma do conteúdo**: filme, programa, episódio, temporada, catálogo
**Idioma de streaming**: vídeo, stream, codificação, taxa de bits, qualidade
**Idioma de engajamento**: lista de observação, visualização, progresso, classificação
**Linguagem de recomendação**: recomendação, preferência, algoritmo
**Idioma de cobrança**: assinatura, plano, cobrança, pagamento

### Subdomínios identificados

#### 1. Catálogo de conteúdo (suporte)

- **Tipo**: Suporte (a menos que conteúdo exclusivo seja um diferencial)
- **Linguagem onipresente**: filme, programa, episódio, catálogo, metadados
- **Conceitos**: Filme, Programa de TV, Episódio, Serviço de Catálogo
- **Coesão**: 9/10
- **Contexto limitado**: CatalogContext

#### 2. Streaming de vídeo (suporte)

- **Tipo**: Suporte
- **Linguagem onipresente**: vídeo, stream, codificação, reprodução, qualidade
- **Conceitos**: Vídeo, Stream, StreamingService
- **Coesão**: 8/10
- **Contexto limitado**: StreamingContext

#### 3. Envolvimento do usuário (suporte)

- **Tipo**: Suporte
- **Linguagem onipresente**: lista de observação, visualização, progresso, classificação
- **Conceitos**: Watchlist, Visualização, EngagementService
- **Coesão**: 8/10
- **Contexto limitado**: EngagementContext

#### 4. Mecanismo de recomendação (domínio principal)

- **Tipo**: Núcleo (se o algoritmo for uma vantagem competitiva)
- **Linguagem onipresente**: recomendação, preferência, algoritmo, personalização
- **Conceitos**: Recomendação, RecommendationEngine
- **Coesão**: 9/10
- **Contexto limitado**: RecommendationContext

#### 5. Processamento de vídeo (genérico)

- **Tipo**: Genérico
- **Linguagem onipresente**: transcodificação, codificação, compactação
- **Conceitos**: VideoProcessor, EncodingService
- **Coesão**: 7/10
- **Contexto limitado**: ProcessingContext

### Padrão de Integração```

Catalog Context → publishes → ContentPublished event
↓
Recommendation Context ← consumes
↓
Engagement Context → publishes → UserWatched event
↓
Recommendation Context ← consumes

````

**Padrão**: Arquitetura Orientada a Eventos com Eventos de Domínio

---

## Padrões comuns entre exemplos

### Padrão 1: Vazamento de Identidade

**Problema**: entidades de usuário/identidade usadas diretamente em todos os lugares

**Solução**: identificadores específicos do contexto
- Contexto do projeto: OwnerId, MemberId
- Contexto de cobrança: CustomerId, SubscriberId
- Contexto do conteúdo: CreatorId, ViewerId

### Padrão 2: uso excessivo do kernel compartilhado

**Problema**: grandes modelos compartilhados usados em todos os lugares

**Solução**: Kernel mínimo compartilhado, principalmente objetos de valor
- Compartilhar: UserId (como string/UUID), Email (como objeto de valor)
- Não compartilhar: entidade usuário, entidade cliente

### Padrão 3: Confusão central vs. suporte

**Pergunta-chave**: "Esta é a nossa vantagem competitiva?"
- Se SIM → Domínio Principal (melhor equipe, mais atenção)
- Se NÃO, mas específico do negócio → Apoio
- Se NÃO e padrão → Genérico

### Padrão 4: Tamanho do contexto limitado

**Muito pequeno**:```
OrderContext
OrderItemContext        ❌ Gaping holes
OrderStatusContext      ❌ Fragmented
````

**Tamanho certo**:```
OrderContext ✅ Complete language
├── Order
├── OrderItem
└── OrderStatus

````

**Muito grande**:```
SalesContext            ❌ Mixed concerns
├── Order
├── Product
├── Customer
└── Invoice
````

### Padrão 5: Tipos de integração

**Síncrono** (use com moderação):

- Quando é necessária consistência imediata
- Exemplo: Pedido → Pagamento (precisa de resposta imediata)

**Assíncrono** (preferir):

- Quando a consistência eventual for aceitável
- Exemplo: Pedido → Envio (pode ser atrasado)

**Orientado por eventos** (melhor para dissociação):

- Quando vários contextos precisam reagir
- Exemplo: OrderPlaced → [Faturamento, Envio, Análise]

---

## Modelo de análise rápida

Use este modelo ao analisar qualquer base de código:```markdown

## Codebase: {Name}

### Step 1: Concepts Extracted

- Entities: [list]
- Services: [list]
- Use Cases: [list]
- Controllers: [list]

### Step 2: Language Groups

- Group 1: {name} - terms: [list]
- Group 2: {name} - terms: [list]

### Step 3: Subdomains Identified

1. {Subdomain} (Core/Supporting/Generic)
   - Language: [terms]
   - Concepts: [list]
   - Cohesion: X/10
   - Bounded Context: {Name}Context

### Step 4: Cohesion Matrix

| Domain A | Domain B | Cohesion | Issue |
| -------- | -------- | -------- | ----- |
| ...      | ...      | X/10     | ...   |

### Step 5: Issues Found

- Priority High: [list]
- Priority Medium: [list]
- Priority Low: [list]

### Step 6: Recommendations

1. [recommendation]
2. [recommendation]

```

```
