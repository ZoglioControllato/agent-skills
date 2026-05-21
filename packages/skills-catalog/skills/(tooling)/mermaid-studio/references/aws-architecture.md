# Diagramas de arquitetura AWS – referência completa

Carregue este arquivo quando o usuário solicitar diagramas de arquitetura de nuvem, visualização de infraestrutura AWS ou diagramas `arquitetura-beta`.

## Visão geral

O tipo de diagrama `arquitetura-beta` do Mermaid permite a visualização da arquitetura em nuvem com ícones que representam serviços. Combinado com pacotes de ícones Iconify, produz diagramas de infraestrutura profissionais com ícones reais de serviços AWS.

**LIMITAÇÃO CRÍTICA — O bug da "distância da seta":**
Como a `arquitetura-beta` é construída em um sistema de grade rígido sem algoritmos de roteamento de borda, diagramas com mais de 6 a 8 nós ou relacionamentos de cruzamento complexos sofrerão com **distâncias enormes e ilegíveis** entre nós e setas cruzando caixas.

**A regra de ouro para diagramas AWS:**

- **Simples (< 8 nós, fluxo linear):** Use `architecture-beta` com `--icons logos`.
- **Complexo (> 8 nós, microsserviços, múltiplas camadas):** Você DEVE usar **Opção A: Diagrama de Contêiner C4**. C4 usa o mecanismo de layout `dagre` que espaça perfeitamente os nós e roteia as setas lindamente.

**Importante — Renderização de ícones:**

- `architecture-beta` requer Mermaid v11+
- Ícones de pacotes Iconify (`logos:aws-*`) requerem registro de pacote de ícones no momento da renderização - eles NÃO funcionam em renderizadores de markdown estáticos (GitHub, GitLab)
- Ao renderizar com o script de renderização, use `--icons logos` para registrar automaticamente os pacotes de ícones
- Para ambientes sem suporte a pacotes de ícones, os ícones integrados (`nuvem`, `banco de dados`, `disco`, `servidor`, `internet`) funcionam em qualquer lugar como um substituto
- Para universais

compatibilidade, considere usar diagramas C4 com rótulos descritivos como alternativa

## Sintaxe Básica```mermaid

architecture-beta

    group groupId(icon)[Label]

    service serviceId(icon)[Label] in groupId

    serviceA:R --> L:serviceB

````
### Blocos de Construção

| Elemento | Sintaxe | Finalidade |
| ---------------- | ------------------------------------ | -------------------------------------- |
| Grupo | `id do grupo(ícone)[Rótulo]` | Limite visual (VPC, região, conta) |
| Serviço | `ID do serviço(ícone)[Rótulo]` | Nó de serviço individual |
| Atendimento em grupo | `ID do serviço (ícone)[Rótulo]

no grupoId` | Serviço dentro de um grupo |
| Borda | `serviçoA:Lado --> Lado:serviçoB` | Conexão com direção |

### Lados da borda

As bordas conectam-se de/para lados específicos dos serviços:

- `L` - Esquerda
- `R` - Certo
- `T` - Superior
- `B` - Inferior```
api:R --> L:lambda        %% api's right connects to lambda's left
lambda:B --> T:db          %% lambda's bottom connects to db's top
````

### Tipos de borda```

serviceA:R --> L:serviceB %% Solid arrow (default)
serviceA:R -- L:serviceB %% Solid line (no arrow)

````
## Opções de ícones

### Opção 1: Ícones Iconify (melhor qualidade visual)

Mermaid suporta mais de 200.000 ícones de iconify.design via `registerIconPacks()`. O pacote `logos` fornece os melhores ícones da AWS. Para renderizar com esses ícones, use `--icons logos` com o script de renderização.

**Formato:** `logos:aws-{nome do serviço}`

### Opção 2: Ícones integrados (compatibilidade universal)

Disponível em qualquer lugar sem qualquer registro. Use-os ao direcionar renderizadores de markdown ou quando os pacotes de ícones não estiverem disponíveis:
`nuvem`, `banco de dados`, `disco`, `internet`, `servidor`

## Catálogo de ícones de serviços da AWS (pacote `logos` Iconify)

### Computação

| Serviço | Nome do ícone (logotipos) | Reserva integrada |
| ---------- | ----------------------------- | ----------------- |
| Lambda | `logos:aws-lambda` | `servidor` |
| EC2 | `logotipos:aws-ec2` | `servidor` |
| ECS | `logos:aws-ecs` | `servidor` |
| Fargate | `logos:aws-fargate` | `servidor` |
| Elástico BK | `logos:aws-elastic-beanstalk` | `

servidor` |

### Armazenamento

| Serviço | Nome do ícone (logotipos) | Reserva integrada |
| ------- | ------------------- | ----------------- |
| S3 | `logotipos:aws-s3` | `disco` |
| EBS | `logos:aws-ebs` | `disco` |
| EFS | `logos:aws-efs` | `disco` |
| Geleira | `logos:aws-glaciar` | `disco` |

### Banco de dados

| Serviço | Nome do ícone (logotipos) | Reserva integrada |
| ----------- | ----------------------- | ----------------- |
| RDS | `logotipos:aws-rds` | `banco de dados` |
| DynamoDB | `logos:aws-dynamodb` | `banco de dados` |
| ElastiCache | `logos:aws-elasticache` | `banco de dados` |
| Aurora | `logos:aws-aurora` | `banco de dados` |
| Desvio para o vermelho | `logos:aws-redshift` | `banco de dados` |
| DocumentDB |

`logos:aws-documentdb` | `banco de dados` |

### Rede

| Serviço | Nome do ícone (logotipos) | Reserva integrada |
| ----------- | ---------------------------------- | ----------------- |
| Gateway de API | `logos:aws-api-gateway` | `servidor` |
| CloudFront | `logos:aws-cloudfront` | `internet` |
| Rota 53 | `logos:aws-route53` | `internet` |
| ELB/ALB | `logos:aws-elastic-load-balancing` | `servidor` |
| VPC

| `logos:aws-vpc` | `nuvem` |

### Mensagens

| Serviço | Nome do ícone (logotipos) | Reserva integrada |
| ----------- | ----------------------- | ----------------- |
| SQS | `logos:aws-sqs` | `servidor` |
| SNS | `logos:aws-sns` | `servidor` |
| EventBridge | `logos:aws-eventbridge` | `servidor` |
| Kinesis | `logos:aws-kinesis` | `servidor` |

### Integração e Orquestração

| Serviço | Nome do ícone (logotipos) | Reserva integrada |
| -------------- | -------------------------- | ----------------- |
| Funções de etapas | `logos:aws-step-functions` | `servidor` |
| AppSync | `logos:aws-app-sync` | `servidor` |

### Monitoramento e Segurança

| Serviço | Nome do ícone (logotipos) | Reserva integrada |
| ---------- | ---------------------- | ----------------- |
| CloudWatch | `logos:aws-cloudwatch` | `servidor` |
| EU SOU | `logos:aws-iam` | `servidor` |
| Cognito | `logos:aws-cognito` | `servidor` |
| WAF | `logos:aws-waf` | `servidor` |

### DevOps e CI/CD

| Serviço | Nome do ícone (logotipos) | Reserva integrada |
| ------------ | ------------------------ | ----------------- |
| CodePipeline | `logos:aws-codepipeline` | `servidor` |
| CódigoBuild | `logos:aws-codebuild` | `servidor` |
| Implementação de código | `logos:aws-codedeploy` | `servidor` |
| ECR | `logos:aws-ecr` | `servidor` |

### ML/IA

| Serviço | Nome do ícone (logotipos) | Reserva integrada |
| --------- | --------------------- | ----------------- |
| SageMaker | `logos:aws-sagemaker` | `servidor` |

**Observação:** Nem todos os serviços da AWS possuem ícones no pacote `logos`. Se um ícone específico não estiver disponível, use o ícone integrado apropriado à categoria mais próximo como substituto. Você pode verificar a disponibilidade dos ícones em https://icon-sets.iconify.design/?q=aws.

## Padrões de Arquitetura

### Padrão 1: aplicativo da Web de três camadas

**Com ícones Iconify (melhor qualidade — requer `--icons logos`):**

```mermaid
architecture-beta
    group vpc(logos:aws-vpc)[VPC]
    group publicSubnet(cloud)[Public Subnet] in vpc
    group privateSubnet(cloud)[Private Subnet] in vpc
    group dataSubnet(database)[Data Subnet] in vpc

    service cdn(logos:aws-cloudfront)[CloudFront]
    service alb(logos:aws-elastic-load-balancing)[ALB] in publicSubnet
    service ecs(logos:aws-ecs)[ECS Fargate] in privateSubnet
    service rds(logos:aws-aurora)[Aurora PostgreSQL] in dataSubnet
    service cache(logos:aws-elasticache)[ElastiCache Redis] in dataSubnet

    cdn:R --> L:alb
    alb:R --> L:ecs
    ecs:R --> L:rds
    ecs:B --> T:cache
````

**Com ícones integrados (compatibilidade universal):**

```mermaid
architecture-beta
    group vpc(cloud)[VPC]
    group publicSubnet(cloud)[Public Subnet] in vpc
    group privateSubnet(cloud)[Private Subnet] in vpc
    group dataSubnet(database)[Data Subnet] in vpc

    service cdn(internet)[CloudFront]
    service alb(server)[ALB] in publicSubnet
    service ecs(server)[ECS Fargate] in privateSubnet
    service rds(database)[Aurora PostgreSQL] in dataSubnet
    service cache(database)[ElastiCache Redis] in dataSubnet

    cdn:R --> L:alb
    alb:R --> L:ecs
    ecs:R --> L:rds
    ecs:B --> T:cache
```

### Padrão 2: API sem servidor```mermaid

architecture-beta
group api(cloud)[API Layer]
group storage(cloud)[Storage]

    service gw(logos:aws-api-gateway)[API Gateway] in api
    service auth(logos:aws-cognito)[Cognito] in api
    service fn(logos:aws-lambda)[Lambda] in api
    service dynamo(logos:aws-dynamodb)[DynamoDB] in storage
    service s3(logos:aws-s3)[S3] in storage

    gw:R --> L:fn
    gw:B --> T:auth
    fn:R --> L:dynamo
    fn:B --> T:s3

````
### Padrão 3: pipeline de dados```mermaid
architecture-beta
    group sources(cloud)[Data Sources]
    group pipeline(cloud)[Pipeline]
    group analytics(cloud)[Analytics]

    service s3raw(logos:aws-s3)[S3 Raw Data] in sources
    service kinesis(logos:aws-kinesis)[Kinesis Stream] in sources
    service glue(logos:aws-glue)[Glue ETL] in pipeline
    service stepFn(logos:aws-step-functions)[Step Functions] in pipeline
    service s3processed(logos:aws-s3)[S3 Processed] in pipeline
    service athena(logos:aws-athena)[Athena] in analytics
    service quicksight(logos:aws-quicksight)[QuickSight] in analytics

    s3raw:R --> L:glue
    kinesis:R --> L:glue
    glue:R --> L:stepFn
    stepFn:R --> L:s3processed
    s3processed:R --> L:athena
    athena:R --> L:quicksight
````

### Padrão 4: Pipeline CI/CD```mermaid

architecture-beta
group source(cloud)[Source]
group build(cloud)[Build & Test]
group deploy(cloud)[Deploy]
group runtime(cloud)[Runtime]

    service repo(logos:aws-codecommit)[CodeCommit] in source
    service pipeline(logos:aws-codepipeline)[CodePipeline] in build
    service codebuild(logos:aws-codebuild)[CodeBuild] in build
    service ecr(logos:aws-ecr)[ECR] in build
    service codedeploy(logos:aws-codedeploy)[CodeDeploy] in deploy
    service ecs(logos:aws-ecs)[ECS Fargate] in runtime
    service cw(logos:aws-cloudwatch)[CloudWatch] in runtime

    repo:R --> L:pipeline
    pipeline:R --> L:codebuild
    codebuild:R --> L:ecr
    ecr:R --> L:codedeploy
    codedeploy:R --> L:ecs
    ecs:B --> T:cw

````
## Renderização com pacotes de ícones

### Usando o script de renderização

Para renderizar diagramas de arquitetura beta com ícones AWS adequados:```bash
node $SKILL_DIR/scripts/render.mjs \
  --input diagram.mmd \
  --output diagram.svg \
  --format svg \
  --icons logos
````

O sinalizador `--icons logos` diz ao script de renderização para registrar o pacote `logos` do Iconify que inclui todos os ícones `logos:aws-*`. O script de renderização usa um pipeline baseado em Puppeteer para renderização habilitada para ícones.

### Vários pacotes de ícones

Você pode registrar vários pacotes:```bash
node $SKILL_DIR/scripts/render.mjs \
 --input diagram.mmd \
 --output diagram.svg \
 --icons logos,fa

````
Pacotes disponíveis: `logos` (logotipos AWS + tecnologia), `fa` (ícones Font Awesome).

### Como funciona o registro de ícones

O script de renderização gera uma página HTML com o Mermaid carregado, registra pacotes de ícones via `mermaid.registerIconPacks()`, renderiza o diagrama e captura a saída SVG. Isso é equivalente a:```javascript
import mermaid from 'mermaid'

mermaid.registerIconPacks([
  {
    name: 'logos',
    loader: () => fetch('https://unpkg.com/@iconify-json/logos/icons.json').then((res) => res.json()),
  },
])
````

## Estratégia de reserva

Quando `architecture-beta` não é compatível com o ambiente de renderização OU os ícones não são renderizados, use estas alternativas:

### Opção A: Diagrama de Contêiner C4 (Melhor Alternativa)

Os diagramas C4 funcionam em qualquer lugar e transmitem as mesmas informações:```mermaid
C4Container
title AWS Architecture — Serverless API

    Container(gw, "API Gateway", "AWS", "REST API endpoint")
    Container(auth, "Cognito", "AWS", "Authentication")
    Container(fn, "Lambda", "Node.js", "Business logic")
    ContainerDb(db, "DynamoDB", "AWS", "NoSQL storage")
    ContainerDb(s3, "S3", "AWS", "Object storage")

    Rel(gw, auth, "Authenticates", "JWT")
    Rel(gw, fn, "Invokes", "Event")
    Rel(fn, db, "Reads/writes", "SDK")
    Rel(fn, s3, "Stores files", "SDK")

    UpdateRelStyle(gw, auth, $textColor="#475569", $lineColor="#94a3b8")
    UpdateRelStyle(gw, fn, $textColor="#475569", $lineColor="#94a3b8")
    UpdateRelStyle(fn, db, $textColor="#475569", $lineColor="#94a3b8")
    UpdateRelStyle(fn, s3, $textColor="#475569", $lineColor="#94a3b8")

    UpdateLayoutConfig($c4ShapeInRow="3", $c4BoundaryInRow="1")

````
### Opção B: Fluxograma com rótulos AWS e estilo profissional```mermaid
%%{init: {'theme': 'base', 'themeVariables': {
  'primaryColor': '#FF9900', 'primaryTextColor': '#232F3E',
  'primaryBorderColor': '#c47600', 'lineColor': '#94a3b8',
  'secondaryColor': '#527FFF', 'tertiaryColor': '#DD344C',
  'background': '#ffffff', 'mainBkg': '#FFF8F0',
  'nodeBorder': '#c47600', 'clusterBkg': '#FFF8F0',
  'clusterBorder': '#d4a574', 'edgeLabelBackground': '#ffffff'
}}}%%
flowchart LR
    subgraph AWS["AWS Cloud"]
        subgraph VPC
            ALB[ALB<br/>Load Balancer]
            subgraph ECS["ECS Cluster"]
                Svc1[Service A]
                Svc2[Service B]
            end
            RDS[(Aurora<br/>PostgreSQL)]
        end
        S3[(S3 Bucket)]
        CF[CloudFront]
    end

    Users([Users]) --> CF
    CF --> ALB
    ALB --> Svc1 & Svc2
    Svc1 & Svc2 --> RDS
    Svc1 --> S3
````

## Melhores práticas

1. **Agrupar por limite** — VPC, sub-rede, região, conta
2. **Fluxo da esquerda para a direita** — o caminho da solicitação deve ser lido naturalmente
3. **Limite a 12 serviços no máximo** — divida arquiteturas complexas em vários diagramas focados
4. **Mostre apenas uma preocupação por diagrama** — rede, computação, dados, separadamente
5. **Inclua sistemas externos** — mostre o que se conecta de fora
6. **Limites de segurança** — mostre sub-redes públicas versus privadas
7. \*\* Use ícones Iconify quando ren

dering** — `logos:aws-*` para melhor qualidade visual 8. **Use ícones integrados para documentos** — `cloud`, `database`, `disk`, `server`, `internet` para compatibilidade de markdown 9. **Sempre forneça ambas as versões\*\* - uma com ícones Iconify para saída renderizada, outra com integração para redução in-line
