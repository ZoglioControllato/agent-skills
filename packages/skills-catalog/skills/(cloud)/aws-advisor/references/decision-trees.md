# Árvores de decisão de serviço

Fluxos de decisão rápidos para seleção de serviços AWS. Use-os para orientar conversas e, em seguida, pesquise detalhes nos documentos.

## Seleção de ferramenta IaC```

What's the priority?
├── Speed / Rapid prototyping →
│ ├── Serverless-focused → Serverless Framework or SST
│ ├── Full-stack with frontend → SST or Amplify
│ └── Quick Lambda + API → SAM
├── Team already uses Terraform → Terraform (consistency wins)
├── Multi-cloud requirement → Terraform or Pulumi
├── Complex AWS infrastructure →
│ ├── Team knows TypeScript/Python/Java → CDK
│ ├── Want programming constructs → CDK or Pulumi
│ └── Prefer declarative → Terraform or CloudFormation
├── Enterprise / Compliance-heavy →
│ ├── Need AWS support → CloudFormation or CDK
│ └── Existing Terraform governance → Terraform
└── Learning AWS → Start with SAM or CloudFormation (foundational)

````
### Matriz de comparação IaC

| Ferramenta | Melhor para | Compensações |
| ------------------------ | --------------------------------------- | -------------------------------- |
| **Estrutura sem servidor** | Aplicativos rápidos sem servidor, ecossistema de plug-ins | Menos controle sobre não-serverless |
| **SST** | Desenvolvimento local full-stack sem servidor | Comunidade mais nova e menor |
| **SAM**

| Lambda + API Gateway, nativo da AWS | Limitado a recursos sem servidor |
| **CDK** | Infraestrutura complexa, tipo segurança, construções | Curva de aprendizado, somente AWS |
| **Terraforma** | Ecossistema maduro e multinuvem, estado | Sintaxe HCL, gerenciamento de estado |
| **Pulumi** | Multinuvem com linguagens reais | Comunidade menor que o Terraform |
| **CloudFormation** | Nativo da AWS, sem dependência

cidades | Ciclo de feedback detalhado e lento |

### Quando trocar de ferramenta

- **SAM → CDK**: quando você precisa de recursos não sem servidor
- **Sem servidor → Terraform**: ao usar várias nuvens
- **CloudFormation → CDK**: quando os modelos ficam muito complexos
- **Qualquer → Terraform**: Quando a equipe padroniza isso

## Seleção de cálculo```
What's the workload?
├── Event-driven, <15min execution → Lambda
├── Containers →
│   ├── Need Kubernetes? → EKS
│   ├── Need GPU or specific instances? → ECS on EC2
│   ├── Want simplicity? → Fargate
│   └── Simple web app? → App Runner
├── Batch processing → AWS Batch
├── Full VM control needed → EC2
└── Long-running background jobs → ECS/EKS or EC2
````

## Seleção de banco de dados```

Data model?
├── Relational (SQL) →
│ ├── Need serverless auto-scale? → Aurora Serverless v2
│ ├── Need global distribution? → Aurora Global
│ ├── PostgreSQL/MySQL standard → RDS
│ └── Legacy Oracle/SQL Server → RDS
├── Key-Value / Document →
│ ├── Need massive scale + single-digit ms? → DynamoDB
│ ├── MongoDB compatibility required? → DocumentDB
│ └── Simple key-value cache → ElastiCache
├── Graph relationships → Neptune
├── Time-series data → Timestream
├── Full-text search → OpenSearch
└── In-memory caching → ElastiCache (Redis/Memcached)

````
## Seleção de armazenamento```
What are you storing?
├── Objects (files, images, backups) →
│   ├── Frequent access → S3 Standard
│   ├── Infrequent access → S3 IA
│   ├── Unknown pattern → S3 Intelligent-Tiering
│   └── Archive → Glacier (Instant/Flexible/Deep)
├── Block storage (databases, OS) →
│   ├── General purpose → gp3
│   ├── High IOPS → io2
│   └── Throughput (big data) → st1
├── Shared file system →
│   ├── Linux workloads → EFS
│   ├── Windows workloads → FSx Windows
│   └── HPC / ML training → FSx Lustre
└── Hybrid (on-prem + cloud) → Storage Gateway
````

## Seleção de API/Integração```

What type of API?
├── REST API →
│ ├── Need full features (WAF, caching, transforms)? → API Gateway REST
│ ├── Need low latency + cost? → API Gateway HTTP
│ └── Internal only? → ALB + Lambda
├── GraphQL → AppSync
├── WebSocket → API Gateway WebSocket
├── gRPC → ALB or NLB
└── Event-driven async →
├── AWS-to-AWS events → EventBridge
├── Queue processing → SQS
├── Pub/Sub fanout → SNS
└── Streaming → Kinesis

````
## Seleção de mensagens```
Communication pattern?
├── One-to-one queue → SQS
├── One-to-many (fanout) → SNS
├── Event routing with rules → EventBridge
├── Streaming (ordered, replay) → Kinesis Data Streams
├── Need Kafka → MSK
└── Need RabbitMQ/ActiveMQ → Amazon MQ
````

## Orquestração de contêineres```

Kubernetes requirement?
├── Yes, need K8s →
│ ├── Managed control plane → EKS
│ ├── Serverless pods → EKS + Fargate
│ └── On-premises → EKS Anywhere
└── No K8s needed →
├── Just run containers → ECS
├── Don't manage instances → Fargate
└── Simple single container → App Runner

````
## Sem servidor versus contêineres```
Considerations:
├── Execution time >15min? → Containers
├── Need persistent connections? → Containers
├── Unpredictable traffic, scale to zero? → Lambda
├── Cost optimization at steady load? → Containers
├── Cold start sensitive? → Containers (or provisioned Lambda)
├── GPU required? → Containers
└── Simplest deployment? → Lambda
````

## Estratégia Multirregional```

Requirement?
├── Active-Active (both serve traffic) →
│ ├── Database: DynamoDB Global Tables or Aurora Global
│ ├── Routing: Route 53 latency-based
│ └── Compute: Deploy to both regions
├── Active-Passive (DR) →
│ ├── Database: Cross-region replicas
│ ├── Routing: Route 53 failover
│ └── Compute: Standby or pilot light
├── Read replicas only →
│ └── Aurora read replicas in other regions
└── Static content only →
└── CloudFront with S3 origin

````
## Seleção de autenticação```
Who's authenticating?
├── End users (mobile/web app) →
│   ├── Social login + custom → Cognito User Pools
│   ├── Existing IdP (Okta, AD) → Cognito + Federation
│   └── B2C at scale → Cognito
├── Internal users (employees) →
│   ├── AWS Console/CLI → IAM Identity Center
│   ├── Corporate SSO → IAM Identity Center + SAML
│   └── Programmatic access → IAM roles
├── Machine-to-machine →
│   ├── Within AWS → IAM roles
│   ├── External services → Secrets Manager + IAM
│   └── API clients → API Gateway + API keys or Cognito
└── Cross-account → IAM roles with trust policies
````

## Perguntas a serem feitas ao usuário

### Para decisões de arquitetura

1. Qual é o padrão de tráfego esperado? (estável vs pontiagudo)
2. Qual é a latência aceitável? (alvo p99)
3. Qual é a restrição orçamentária?
4. Algum requisito de conformidade? (HIPAA, PCI, SOC2)
5. Que regiões precisam de ser apoiadas?
6. Qual é a expertise da equipe? (K8s? Sem servidor?)

### Para decisões de banco de dados

1. Qual é o modelo de dados? (relacional, documento, gráfico)
2. Proporção de leitura/gravação?
3. Tamanho e crescimento esperado dos dados?
4. Requisitos de consistência? (forte vs eventual)
5. Necessidade de transações?

### Para decisões de computação

1. A carga de trabalho é orientada por eventos ou de longa duração?
2. Algum requisito específico de tempo de execução?
3. Precisa de GPU ou hardware especializado?
4. Tolerância à partida a frio?
5. Requisitos de dimensionamento? (escala para zero?)
