# Diagramas de Arquitetura C4 – Referência Completa

Carregue este arquivo quando o usuário solicitar diagramas C4 ou documentação de arquitetura do sistema. O modelo C4 fornece quatro níveis de abstração.

## CRÍTICO: Regras obrigatórias

**Cada diagrama C4 DEVE seguir estas regras.** Sem elas, o Mermaid renderiza linhas pretas nítidas que se sobrepõem a elementos e tornam o diagrama ilegível.

1. **Máximo de 6 `Rel()` por diagrama.** Mais relacionamentos fazem com que Dagre direcione setas através dos nós, criando espaguete ilegível. Divida sistemas complexos em vários diagramas focados.
2. **Sempre estilize todos os relacionamentos.** Aplique `UpdateRelStyle` a cada `Rel()` com cores de linha suaves (veja o modelo abaixo).
3. **Máximo de 6 a 8 elementos por diagrama.** A topologia em forma de árvore (1 entrada, 1 a 2 saídas por nó) apresenta melhor renderização. Evite conexões de malha.
4. \*\* NÃO defina `fontFami

ly`.** A fonte padrão do Mermaid funciona em qualquer lugar. Definir `system-ui`ou`Segoe UI` será renderizado como Times New Roman no Chromium sem cabeça.

### Modelo: adicione isto a cada diagrama C4```

    %% === MANDATORY: Apply to ALL Rel() references ===
    UpdateRelStyle(fromAlias, toAlias, $textColor="#475569", $lineColor="#94a3b8")
    %% Repeat for each relationship in the diagram

    %% === MANDATORY: Layout optimization ===
    UpdateLayoutConfig($c4ShapeInRow="3", $c4BoundaryInRow="1")

````
### Quando os rótulos se sobrepõem aos elementos

Adicione `$offsetX` e `$offsetY` para afastar os rótulos dos elementos:```
    UpdateRelStyle(from, to, $textColor="#475569", $lineColor="#94a3b8", $offsetY="-10")
    UpdateRelStyle(from, to, $textColor="#475569", $lineColor="#94a3b8", $offsetX="-40", $offsetY="20")
````

### Destacando relacionamentos importantes

Use cores de destaque para caminhos críticos enquanto mantém outras linhas suaves:```
%% Primary relationship — emphasized
UpdateRelStyle(client, api, $textColor="#1e40af", $lineColor="#3b82f6")

    %% Secondary relationships — soft
    UpdateRelStyle(api, db, $textColor="#475569", $lineColor="#94a3b8")

    %% External/risky connection — warning
    UpdateRelStyle(api, extPayment, $textColor="#92400e", $lineColor="#f59e0b")

````
## Níveis C4 – Quando usar cada um

| Nível | Diagrama | Público | Finalidade |
| ----- | ------------ | -------------- | ------------------------------------- |
| 1 | C4Contexto | Todos | Limites do sistema e atores externos |
| 2 | C4Contêiner | Equipe técnica | Aplicativos, bancos de dados, serviços |
| 3 | Componente C4 | Desenvolvedores | Estrutura do módulo interno |
| 4 | Implantação C4 | DevOps/SRE

| Nós de infraestrutura e implantação |
| — | C4Dinâmico | Equipe técnica | Fluxos de pedidos numerados |

**Regra prática:** Diagramas de contexto + contêiner são suficientes para a maioria das equipes. Crie diagramas de componentes/código apenas quando eles realmente adicionarem clareza.

### Recomendações apropriadas ao público

- **Executivos/PMs:** Somente contexto
- **Arquitetos:** Contexto + Container
- **Desenvolvedores:** Contexto + Container + Componentes para sua área
- **DevOps/SRE:** Contêiner + Implantação

## Sintaxe do Elemento

### Pessoas e Sistemas```
Person(alias, "Label", "Description")
Person_Ext(alias, "Label", "Description")
System(alias, "Label", "Description")
System_Ext(alias, "Label", "Description")
SystemDb(alias, "Label", "Description")
SystemDb_Ext(alias, "Label", "Description")
SystemQueue(alias, "Label", "Description")
SystemQueue_Ext(alias, "Label", "Description")
````

### Contêineres```

Container(alias, "Label", "Technology", "Description")
Container_Ext(alias, "Label", "Technology", "Description")
ContainerDb(alias, "Label", "Technology", "Description")
ContainerDb_Ext(alias, "Label", "Technology", "Description")
ContainerQueue(alias, "Label", "Technology", "Description")
ContainerQueue_Ext(alias, "Label", "Technology", "Description")

````
### Componentes```
Component(alias, "Label", "Technology", "Description")
Component_Ext(alias, "Label", "Technology", "Description")
ComponentDb(alias, "Label", "Technology", "Description")
ComponentQueue(alias, "Label", "Technology", "Description")
````

### Limites```

Enterprise_Boundary(alias, "Label") { ... }
System_Boundary(alias, "Label") { ... }
Container_Boundary(alias, "Label") { ... }
Boundary(alias, "Label", "type") { ... }

````
### Relacionamentos```
Rel(from, to, "Label")
Rel(from, to, "Label", "Technology")
BiRel(from, to, "Label")
Rel_U(from, to, "Label")       %% Upward
Rel_D(from, to, "Label")       %% Downward
Rel_L(from, to, "Label")       %% Leftward
Rel_R(from, to, "Label")       %% Rightward
Rel_Back(from, to, "Label")    %% Back relationship
````

**Dica de controle de layout:** Quando o layout automático faz com que as linhas se sobreponham, use variantes direcionais (`Rel_D`, `Rel_R`, etc.) para forçar as setas em uma direção específica. Esta é a maneira mais eficaz de evitar linhas sobrepostas.

### Nós de implantação```

Deployment_Node(alias, "Label", "Type") { ... }
Deployment_Node(alias, "Label", "Type", "Description") { ... }
Node(alias, "Label") { ... }
Node_L(alias, "Label") { ... }
Node_R(alias, "Label") { ... }

````
## Exemplos completos (todos com estilo obrigatório)

### Nível 1 — Contexto do Sistema```mermaid
C4Context
    title System Context — Order Management Platform

    Person(customer, "Customer", "Places and tracks orders")
    Person(admin, "Admin", "Manages products and fulfillment")

    Enterprise_Boundary(company, "Company") {
        System(orderPlatform, "Order Platform", "Manages the full order lifecycle")
    }

    System_Ext(paymentGW, "Payment Gateway", "Stripe — processes payments")
    System_Ext(shipping, "Shipping Provider", "Handles delivery logistics")
    System_Ext(emailSvc, "Email Service", "SendGrid — transactional emails")
    System_Ext(analytics, "Analytics", "Mixpanel — usage tracking")

    Rel(customer, orderPlatform, "Places orders, tracks status", "HTTPS")
    Rel(admin, orderPlatform, "Manages catalog, fulfills orders", "HTTPS")
    Rel(orderPlatform, paymentGW, "Processes payments", "REST API")
    Rel(orderPlatform, shipping, "Creates shipments", "REST API")
    Rel(orderPlatform, emailSvc, "Sends notifications", "SMTP/API")
    Rel(orderPlatform, analytics, "Sends events", "HTTPS")

    UpdateRelStyle(customer, orderPlatform, $textColor="#1e40af", $lineColor="#3b82f6")
    UpdateRelStyle(admin, orderPlatform, $textColor="#1e40af", $lineColor="#3b82f6")
    UpdateRelStyle(orderPlatform, paymentGW, $textColor="#475569", $lineColor="#94a3b8")
    UpdateRelStyle(orderPlatform, shipping, $textColor="#475569", $lineColor="#94a3b8")
    UpdateRelStyle(orderPlatform, emailSvc, $textColor="#475569", $lineColor="#94a3b8")
    UpdateRelStyle(orderPlatform, analytics, $textColor="#475569", $lineColor="#94a3b8", $offsetY="-10")

    UpdateLayoutConfig($c4ShapeInRow="3", $c4BoundaryInRow="1")
````

### Nível 2 - Contêiner

**Mantenha os diagramas de contêiner em foco: máximo de 6 a 8 elementos e 6 Rel().** Para sistemas complexos, divida em vários diagramas (um por contexto limitado ou área de serviço).```mermaid
C4Container
title Container Diagram — Order Platform

    Person(customer, "Customer", "Places orders online")

    System_Boundary(platform, "Order Platform") {
        Container(spa, "Web App", "React", "Customer-facing storefront")
        Container(api, "API Gateway", "NestJS", "Routes requests")
        Container(orderSvc, "Order Service", "NestJS", "Order lifecycle")
        ContainerDb(db, "Database", "PostgreSQL", "Orders and products")
    }

    System_Ext(paymentGW, "Stripe", "Payment processing")

    Rel(customer, spa, "Uses", "HTTPS")
    Rel(spa, api, "Calls", "JSON/HTTPS")
    Rel(api, orderSvc, "Routes to", "gRPC")
    Rel(orderSvc, db, "Reads/writes", "SQL")
    Rel(orderSvc, paymentGW, "Processes payment", "REST API")

    UpdateRelStyle(customer, spa, $textColor="#1e40af", $lineColor="#3b82f6")
    UpdateRelStyle(spa, api, $textColor="#475569", $lineColor="#94a3b8")
    UpdateRelStyle(api, orderSvc, $textColor="#475569", $lineColor="#94a3b8")
    UpdateRelStyle(orderSvc, db, $textColor="#475569", $lineColor="#94a3b8")
    UpdateRelStyle(orderSvc, paymentGW, $textColor="#92400e", $lineColor="#f59e0b")

    UpdateLayoutConfig($c4ShapeInRow="3", $c4BoundaryInRow="1")

````
### Nível 3 — Componente (Serviço de Pedido)```mermaid
C4Component
    title Component Diagram — Order Service

    Container_Boundary(orderSvc, "Order Service") {
        Component(orderCtrl, "Order Controller", "NestJS Controller", "HTTP/gRPC endpoints")
        Component(orderUseCase, "Order Use Cases", "Application Layer", "Create, cancel, fulfill orders")
        Component(paymentPort, "Payment Port", "Interface", "Payment processing abstraction")
        Component(orderRepo, "Order Repository", "TypeORM", "Order persistence")
        Component(eventPub, "Event Publisher", "AMQP Client", "Publishes domain events")
        Component(orderModel, "Order Aggregate", "Domain Model", "Business rules and invariants")
    }

    ContainerDb(orderDb, "Order DB", "PostgreSQL")
    ContainerQueue(eventBus, "Event Bus", "RabbitMQ")
    Container_Ext(paymentGW, "Stripe", "Payment API")

    Rel(orderCtrl, orderUseCase, "Invokes")
    Rel(orderUseCase, orderModel, "Operates on")
    Rel(orderUseCase, paymentPort, "Uses")
    Rel(orderUseCase, orderRepo, "Persists via")
    Rel(orderUseCase, eventPub, "Publishes events")
    Rel(orderRepo, orderDb, "SQL queries")
    Rel(eventPub, eventBus, "AMQP")
    Rel(paymentPort, paymentGW, "REST API")

    UpdateRelStyle(orderCtrl, orderUseCase, $textColor="#475569", $lineColor="#94a3b8")
    UpdateRelStyle(orderUseCase, orderModel, $textColor="#475569", $lineColor="#94a3b8")
    UpdateRelStyle(orderUseCase, paymentPort, $textColor="#475569", $lineColor="#94a3b8")
    UpdateRelStyle(orderUseCase, orderRepo, $textColor="#475569", $lineColor="#94a3b8")
    UpdateRelStyle(orderUseCase, eventPub, $textColor="#475569", $lineColor="#94a3b8")
    UpdateRelStyle(orderRepo, orderDb, $textColor="#475569", $lineColor="#94a3b8")
    UpdateRelStyle(eventPub, eventBus, $textColor="#475569", $lineColor="#94a3b8")
    UpdateRelStyle(paymentPort, paymentGW, $textColor="#92400e", $lineColor="#f59e0b")

    UpdateLayoutConfig($c4ShapeInRow="3", $c4BoundaryInRow="1")
````

### C4 Dinâmico — Fluxo de Solicitação```mermaid

C4Dynamic
title Dynamic Diagram — Place Order Flow

    Container(spa, "Web App", "React")
    Container(api, "API Gateway", "NestJS")
    Container(orderSvc, "Order Service", "NestJS")
    Container(paymentGW, "Stripe", "Payment API")
    ContainerDb(db, "Order DB", "PostgreSQL")
    ContainerQueue(bus, "Event Bus", "RabbitMQ")

    Rel(spa, api, "1. POST /orders", "JSON/HTTPS")
    Rel(api, orderSvc, "2. CreateOrder()", "gRPC")
    Rel(orderSvc, db, "3. INSERT order (pending)", "SQL")
    Rel(orderSvc, paymentGW, "4. Process payment", "REST")
    Rel(orderSvc, db, "5. UPDATE order (confirmed)", "SQL")
    Rel(orderSvc, bus, "6. Publish OrderConfirmed", "AMQP")
    Rel(orderSvc, api, "7. Return order", "gRPC")
    Rel(api, spa, "8. 201 Created", "JSON/HTTPS")

    UpdateRelStyle(spa, api, $textColor="#1e40af", $lineColor="#3b82f6")
    UpdateRelStyle(api, orderSvc, $textColor="#475569", $lineColor="#94a3b8")
    UpdateRelStyle(orderSvc, db, $textColor="#475569", $lineColor="#94a3b8", $offsetX="-30")
    UpdateRelStyle(orderSvc, paymentGW, $textColor="#92400e", $lineColor="#f59e0b")
    UpdateRelStyle(orderSvc, bus, $textColor="#475569", $lineColor="#94a3b8")
    UpdateRelStyle(orderSvc, api, $textColor="#475569", $lineColor="#94a3b8", $offsetY="-10")
    UpdateRelStyle(api, spa, $textColor="#475569", $lineColor="#94a3b8", $offsetY="-10")

    UpdateLayoutConfig($c4ShapeInRow="3", $c4BoundaryInRow="1")

````
### Implantação C4```mermaid
C4Deployment
    title Deployment — Production Environment

    Deployment_Node(cdn, "CloudFront", "CDN") {
        Container(static, "Static Assets", "React Build", "JS/CSS/HTML")
    }

    Deployment_Node(aws, "AWS", "us-east-1") {
        Deployment_Node(ecs, "ECS Cluster", "Fargate") {
            Deployment_Node(apiTask, "API Task", "2 vCPU, 4GB") {
                Container(api, "API Gateway", "NestJS")
            }
            Deployment_Node(orderTask, "Order Task", "2 vCPU, 4GB") {
                Container(orderSvc, "Order Service", "NestJS")
            }
        }

        Deployment_Node(rds, "RDS", "db.r6g.xlarge") {
            ContainerDb(db, "Order DB", "PostgreSQL 16")
        }

        Deployment_Node(elasticache, "ElastiCache", "r6g.large") {
            ContainerDb(cache, "Cache", "Redis 7")
        }

        Deployment_Node(mq, "Amazon MQ", "mq.m5.large") {
            ContainerQueue(bus, "Event Bus", "RabbitMQ")
        }
    }

    Rel(cdn, api, "Routes API calls", "HTTPS")
    Rel(api, orderSvc, "Internal", "gRPC")
    Rel(orderSvc, db, "Reads/writes", "SQL/TLS")
    Rel(api, cache, "Caches", "Redis/TLS")
    Rel(orderSvc, bus, "Publishes", "AMQP/TLS")

    UpdateRelStyle(cdn, api, $textColor="#1e40af", $lineColor="#3b82f6")
    UpdateRelStyle(api, orderSvc, $textColor="#475569", $lineColor="#94a3b8")
    UpdateRelStyle(orderSvc, db, $textColor="#475569", $lineColor="#94a3b8")
    UpdateRelStyle(api, cache, $textColor="#475569", $lineColor="#94a3b8")
    UpdateRelStyle(orderSvc, bus, $textColor="#475569", $lineColor="#94a3b8")

    UpdateLayoutConfig($c4ShapeInRow="3", $c4BoundaryInRow="1")
````

## Estilo e layout

### Configuração de Layout```

UpdateLayoutConfig($c4ShapeInRow="3", $c4BoundaryInRow="1")

````
### Estilo de Elemento```
UpdateElementStyle(alias, $fontColor="red", $bgColor="grey", $borderColor="red")
````

### Estilo de relacionamento

Use `$offsetX` e `$offsetY` para corrigir rótulos sobrepostos:```
UpdateRelStyle(from, to, $textColor="#475569", $lineColor="#94a3b8", $offsetY="-10")

````
### Paleta de cores profissional para estilos de elementos personalizados

| Finalidade | bgCor | fonteCor | bordaCor | Quando usar |
| -------------------- | --------- | --------- | ----------- | ------------------------------- |
| Ênfase primária | `#4f46e5` | `#ffffff` | `#3730a3` | Sistemas centrais, serviço principal |
| Sucesso / Armazenamento de dados | `#059669` | `#ffffff` | `#047857` | Bancos de dados, estados concluídos |
| Aviso / Externo | `#d97706` | `#ffffff` | `#b45309` |

Sistemas externos, caminhos arriscados |
| Erro / Crítico | `#dc2626` | `#ffffff` | `#b91c1c` | Estados de erro SOMENTE |
| Neutro/Secundário | `#64748b` | `#ffffff` | `#475569` | Serviços de apoio, antecedentes |
| Informações / Destaque | `#0284c7` | `#ffffff` | `#0369a1` | Anotações informativas |

## Padrões de microsserviços

### Propriedade de equipe única

Quando uma equipe possui todos os serviços, modele cada um como um **contêiner**:```mermaid
C4Container
    title Microservices — Single Team

    System_Boundary(platform, "E-commerce Platform") {
        Container(orderSvc, "Order Service", "NestJS", "Order processing")
        ContainerDb(orderDb, "Order DB", "PostgreSQL")
        Container(inventorySvc, "Inventory Service", "NestJS", "Stock management")
        ContainerDb(inventoryDb, "Inventory DB", "MongoDB")
    }

    Rel(orderSvc, orderDb, "Reads/writes", "SQL")
    Rel(inventorySvc, inventoryDb, "Reads/writes", "MongoDB Wire")

    UpdateRelStyle(orderSvc, orderDb, $textColor="#475569", $lineColor="#94a3b8")
    UpdateRelStyle(inventorySvc, inventoryDb, $textColor="#475569", $lineColor="#94a3b8")

    UpdateLayoutConfig($c4ShapeInRow="2", $c4BoundaryInRow="1")
````

### Propriedade de várias equipes

Quando equipes separadas possuem serviços, promova-os para **sistemas**:```mermaid
C4Context
title Microservices — Multi-Team

    Person(customer, "Customer")
    System(orderSys, "Order System", "Team Alpha")
    System(inventorySys, "Inventory System", "Team Beta")
    System(paymentSys, "Payment System", "Team Gamma")

    Rel(customer, orderSys, "Places orders")
    Rel(orderSys, inventorySys, "Checks stock")
    Rel(orderSys, paymentSys, "Processes payment")

    UpdateRelStyle(customer, orderSys, $textColor="#1e40af", $lineColor="#3b82f6")
    UpdateRelStyle(orderSys, inventorySys, $textColor="#475569", $lineColor="#94a3b8")
    UpdateRelStyle(orderSys, paymentSys, $textColor="#92400e", $lineColor="#f59e0b")

    UpdateLayoutConfig($c4ShapeInRow="3", $c4BoundaryInRow="1")

````
### Arquitetura Orientada a Eventos

Mostre tópicos/filas individuais como contêineres - NÃO uma única caixa "Kafka":```mermaid
C4Container
    title Event-Driven Architecture

    Container(orderSvc, "Order Service", "Java", "Creates orders")
    Container(stockSvc, "Stock Service", "Java", "Manages inventory")
    ContainerQueue(orderTopic, "order.created", "Kafka", "Order events")
    ContainerQueue(stockTopic, "stock.reserved", "Kafka", "Stock events")

    Rel(orderSvc, orderTopic, "Publishes to")
    Rel(stockSvc, orderTopic, "Subscribes to")
    Rel(stockSvc, stockTopic, "Publishes to")
    Rel(orderSvc, stockTopic, "Subscribes to")

    UpdateRelStyle(orderSvc, orderTopic, $textColor="#475569", $lineColor="#94a3b8")
    UpdateRelStyle(stockSvc, orderTopic, $textColor="#475569", $lineColor="#94a3b8")
    UpdateRelStyle(stockSvc, stockTopic, $textColor="#475569", $lineColor="#94a3b8")
    UpdateRelStyle(orderSvc, stockTopic, $textColor="#475569", $lineColor="#94a3b8")

    UpdateLayoutConfig($c4ShapeInRow="2", $c4BoundaryInRow="1")
````

## Regras Essenciais

1. **Todo elemento deve ter:** Nome, Tipo, Tecnologia (quando aplicável), Descrição
2. **Use setas unidirecionais** — bidirecional cria ambiguidade
3. **Rotule as setas com verbos de ação** — "Envia e-mail usando", não apenas "usa"
4. **Incluir rótulos de tecnologia** — "JSON/HTTPS", "SQL", "gRPC"
5. **Menos de 15 elementos por diagrama** — dividido se houver mais (elegância > completude)
6. **Sempre inclua um título**
7. **Apelidos significativos** — `orderService` não

`s1` 8. **SEMPRE adicione UpdateRelStyle** — as cores das linhas suaves são obrigatórias 9. **SEMPRE adicione UpdateLayoutConfig** — evita aglomeração de elementos

## Erros Comuns

| Erro                                    | Por que está errado                         | Correção                    |
| --------------------------------------- | ------------------------------------------- | --------------------------- |
| Biblioteca compartilhada como contêiner | Os contêineres são unidades implantáveis ​​ | Modelo como Componente      |
| Recipiente único "Kafka"                | Oculta a estrutura do tópico                | Mostrar tópicos individuais |
| Nível "Subcomponentes"                  | Não é uma concentração C4                   |

epto | Use Componente ou Classe |
| Removendo etiquetas de tipo | Perde informações | Sempre mostrar tipo/tecnologia |
| Setas bidirecionais | Direção de fluxo ambígua | Use unidirecional |
| Sem rótulos de tecnologia | Não é possível avaliar a arquitetura | Adicionar protocolo/tecnologia |
| Sem atualizaçãoRelStyle | Linhas pretas duras | Adicione cores suaves ao AL

relacionamentos L |
| Sem atualizaçãoLayoutConfig | Elementos se aglomeram | Adicionar configuração de layout no final |
| Sem compensação na sobreposição | Etiquetas escondidas atrás de elementos | Adicione $offsetX/$offsetY para corrigir |

## Convenção de nomenclatura de arquivos```

docs/architecture/
├── c4-context.md
├── c4-containers.md
├── c4-components-{feature}.md
├── c4-deployment.md
└── c4-dynamic-{flow}.md

```

```
