# Tipos de Diagrama — Referência Completa de Sintaxe

Carregue este arquivo quando precisar de sintaxe detalhada para um tipo de diagrama específico além do que os exemplos rápidos em SKILL.md fornecem.

## Índice

1. Fluxograma (linha ~20)
2. Diagrama de Sequência (linha ~120)
3. Diagrama de Classes (linha ~220)
4. Diagrama de Estado (linha ~310)
5. ERD (linha ~380)
6. Gráfico de Gantt (linha ~ 440)
7. Gráfico de pizza (linha ~ 490)
8. Mapa mental (linha ~520)
9. Linha do tempo (linha ~560)
10. Gráfico Git (linha ~ 600)
11. Sankey (linha ~650)
12. Gráfico XY (linha ~690)
13. Gráfico de quadrante (linha ~ 730)
14. Diagrama de Blocos (linha ~770)
15. Jornada do usuário (linha ~820)
16. Diagrama de Requisitos (linha ~860)
17. Diagrama de Pacotes

(linha ~900) 18. Kanban (linha ~930)

---

## 1. Fluxograma

**Palavra-chave:** `fluxograma` ou `gráfico`
**Instruções:** `TD` (de cima para baixo), `LR` (esquerda-direita), `BT`, `RL`

### Formas de nós```

A[Rectangle] %% Standard process
B(Rounded) %% Alternate process
C([Stadium]) %% Terminal/start-end
D{Diamond} %% Decision
E{{Hexagon}} %% Preparation
F[/Parallelogram/] %% Input/Output
G[\Reverse parallel\] %% Manual operation
H[(Database)] %% Data store
I((Circle)) %% Connector
J>Asymmetric] %% Flag/signal
K[[Subroutine]] %% Predefined process
L(((Double Circle))) %% Multiple documents
M[/Trapezoid\] %% Manual input
N[\Inverse trapezoid/] %% Display

````
### Tipos de borda```
A --> B                %% Arrow
A --- B                %% Line (no arrow)
A -.- B                %% Dotted line
A -.-> B               %% Dotted arrow
A ==> B                %% Thick arrow
A ~~~ B                %% Invisible link (spacing)
A --text--> B          %% Arrow with text
A -->|text| B          %% Arrow with text (alternate)
A <--> B               %% Bidirectional
A o--o B               %% Circle endpoints
A x--x B               %% Cross endpoints
````

### Subgrafos```mermaid

flowchart TD
subgraph Backend["Backend Services"]
direction LR
API[API Server]
Worker[Background Worker]
end

    subgraph Storage["Data Layer"]
        DB[(PostgreSQL)]
        Cache[(Redis)]
    end

    API --> DB
    API --> Cache
    Worker --> DB

````
### Estilo```mermaid
flowchart LR
    A[Success]:::success --> B[Warning]:::warning --> C[Error]:::error

    classDef success fill:#10b981,stroke:#059669,color:#fff
    classDef warning fill:#f59e0b,stroke:#d97706,color:#000
    classDef error fill:#ef4444,stroke:#dc2626,color:#fff
````

### Clique em Eventos```

click A "https://example.com" "Tooltip text" \_blank
click B callback "Tooltip"

````
---

## 2. Diagrama de sequência

**Palavra-chave:** `sequenceDiagram`

### Tipos de participantes```mermaid
sequenceDiagram
    actor User
    participant Frontend as Frontend App
    participant API as REST API
    participant DB as Database
````

### Tipos de mensagens```

A->>B: Solid arrow (synchronous request)
A-->>B: Dotted arrow (asynchronous response)
A-)B: Open arrow (async message, fire-and-forget)
A--)B: Dotted open arrow (async response)
A-xB: Cross arrow (lost message)
A--xB: Dotted cross arrow

````
### Caixas de ativação```
A->>+B: Request    %% Activate B
B-->>-A: Response  %% Deactivate B
````

### Fluxo de controle```mermaid

sequenceDiagram
participant A
participant B
participant C

    alt Condition is true
        A->>B: Path 1
    else Condition is false
        A->>C: Path 2
    end

    opt Optional step
        B->>C: Optional call
    end

    loop Every 5 seconds
        A->>B: Health check
    end

    par Parallel execution
        A->>B: Task 1
    and
        A->>C: Task 2
    end

    critical Critical section
        A->>B: Important operation
    option Failure case
        A->>C: Fallback
    end

    break When error occurs
        A->>B: Error notification
    end

````
### Notas```
Note right of A: Single participant note
Note over A,B: Note spanning participants
Note left of B: Left-side note
````

### Numeração```

autonumber %% Add at the top to auto-number messages

````
### Caixas (Agrupamento)```mermaid
sequenceDiagram
    box Purple Internal Services
        participant API
        participant Worker
    end
    box Grey External
        participant Payment
    end

    API->>Worker: Process
    Worker->>Payment: Charge
````

---

## 3. Diagrama de classes

**Palavra-chave:** `classDiagram`

### Definição de Classe```mermaid

classDiagram
class Animal {
+String name
+int age
#String species
-String dna
+makeSound()\* void
+move(distance int) void
#reproduce() Animal
-mutate() void
}

````

**Modificadores de visibilidade:** `+` público, `-` privado, `#` protegido, pacote `~`

### Relacionamentos```
A <|-- B       %% Inheritance (B extends A)
A *-- B        %% Composition (A owns B, lifecycle bound)
A o-- B        %% Aggregation (A has B, independent lifecycle)
A --> B        %% Association (A uses B)
A ..> B        %% Dependency (A depends on B)
A ..|> B       %% Realization (B implements A)
A -- B         %% Link (solid)
A .. B         %% Link (dashed)
````

### Multiplicidade```

A "1" --> "_" B : has
A "1" --> "0..1" B : may have
A "0.._" --> "1..\*" B : relates

````
### Anotações```mermaid
classDiagram
    class Shape {
        <<interface>>
        +area() double
        +perimeter() double
    }

    class Color {
        <<enumeration>>
        RED
        GREEN
        BLUE
    }

    class Singleton {
        <<abstract>>
    }

    class UserService {
        <<service>>
    }
````

### Namespace```mermaid

classDiagram
namespace Domain {
class User
class Order
}
namespace Infrastructure {
class UserRepository
class OrderRepository
}

````
---

## 4. Diagrama de estado

**Palavra-chave:** `stateDiagram-v2`

### Sintaxe Básica```mermaid
stateDiagram-v2
    [*] --> Idle
    Idle --> Processing : Start
    Processing --> Done : Complete
    Processing --> Error : Failure
    Error --> Idle : Reset
    Done --> [*]
````

### Estados compostos```mermaid

stateDiagram-v2
[*] --> Active

    state Active {
        [*] --> Running
        Running --> Paused : Pause
        Paused --> Running : Resume
    }

    Active --> Terminated : Kill
    Terminated --> [*]

````
### Bifurcações e junções```mermaid
stateDiagram-v2
    state fork_state <<fork>>
    state join_state <<join>>

    [*] --> fork_state
    fork_state --> TaskA
    fork_state --> TaskB
    TaskA --> join_state
    TaskB --> join_state
    join_state --> Done
    Done --> [*]
````

### Escolha```mermaid

stateDiagram-v2
state check <<choice>>

    [*] --> check
    check --> Approved : if valid
    check --> Rejected : if invalid

````
### Notas```
note right of StateName
    Multi-line note
    explaining the state
end note
````

---

## 5. Diagrama de Relacionamento entre Entidades

**Palavra-chave:** `erDiagram`

### Tipos de relacionamento```

A ||--|| B : "exactly one to exactly one"
A ||--o{ B : "one to zero or more"
A ||--|{ B : "one to one or more"
A }o--o{ B : "zero or more to zero or more"
A |o--o| B : "zero or one to zero or one"

````
### Símbolos de Cardinalidade

| Símbolo | Significado |
| ------ | ------------ |
| `\|\|` | Exatamente um |
| `o\|` | Zero ou um |
| `}o` | Zero ou mais |
| `}\|` | Um ou mais |

### Tipos de atributos```mermaid
erDiagram
    PRODUCT {
        uuid id PK "Unique identifier"
        string name "Product display name"
        decimal price "Price in cents"
        text description
        datetime created_at
        int stock_count
        boolean active
        string sku UK "Stock keeping unit"
        uuid category_id FK "Reference to category"
    }
````

**Marcadores de chave:** `PK` (chave primária), `FK` (chave estrangeira), `UK` (chave exclusiva)

---

## 6. Gráfico de Gantt

**Palavra-chave:** `gantt````mermaid
gantt
title Project Timeline
dateFormat YYYY-MM-DD
axisFormat %b %d

    section Planning
        Requirements    :done, req, 2025-01-01, 14d
        Design          :active, des, after req, 10d

    section Development
        Backend         :dev1, after des, 21d
        Frontend        :dev2, after des, 18d

    section Testing
        Integration     :test, after dev1, 7d
        UAT             :uat, after test, 5d

    section Release
        Deployment      :milestone, deploy, after uat, 0d

`````

**Estados da tarefa:** `done`, `active`, `crit` (caminho crítico)
**Duração:** `7d` (dias), `5h` (horas) ou data de término específica
**Dependências:** `após taskId` ou `após tarefa1 tarefa2` separados por vírgula

---

## 7. Gráfico de pizza

**Palavra-chave:** `torta````mermaid
pie showData
    title Technology Stack
    "TypeScript" : 45
    "Python" : 25
    "Go" : 15
    "Rust" : 10
    "Other" : 5
`````

`showData` é opcional — adiciona porcentagens aos rótulos.

---

## 8. Mapa mental

**Palavra-chave:** `mapa mental````mermaid
mindmap
root((System Design))
Scalability
Horizontal
Load Balancers
Sharding
Vertical
More CPU
More RAM
Reliability
Redundancy
Failover
Backups
Performance
Caching
CDN
Redis
Optimization
Indexing
Query tuning

`````

**Formas de nós:**

- `((Círculo))` — raiz/ênfase
- `(Arredondado)` — padrão
- `[Quadrado]` — estruturado
- `)Cloud(` — formato de nuvem
- `))Bang((` — explosão/ênfase

---

## 9. Linha do tempo

**Palavra-chave:** `linha do tempo````mermaid
timeline
    title Product Roadmap 2025
    section Q1
        January : MVP Launch
                : Core API complete
        February : Beta program
        March : Public launch
    section Q2
        April : Mobile app
        May : International expansion
        June : Enterprise features
`````

---

## 10. Gráfico Git

**Palavra-chave:** `gitGraph````mermaid
gitGraph
commit id: "Initial"
branch develop
checkout develop
commit id: "Feature A"
commit id: "Feature B"
branch feature/auth
checkout feature/auth
commit id: "Add login"
commit id: "Add OAuth"
checkout develop
merge feature/auth id: "Merge auth"
checkout main
merge develop id: "Release v1.0" tag: "v1.0"
commit id: "Hotfix" type: HIGHLIGHT

`````

**Tipos de commit:** `NORMAL`, `REVERSE`, `HIGHLIGHT`
**Opções:** `branch order: 0` para controlar a posição da filial

---

## 11. Diagrama de Sankey

**Palavra-chave:** `sankey-beta````mermaid
sankey-beta

Traffic,Homepage,5000
Traffic,API,3000
Homepage,Signup,1500
Homepage,Browse,3500
API,Mobile,2000
API,Partners,1000
Signup,Active Users,1200
Signup,Churned,300
`````

Formato: `fonte, destino, valor` — um por linha, separado por vírgula.

---

## 12. Gráfico XY

**Palavra-chave:** `xychart-beta````mermaid
xychart-beta
title "Monthly Revenue"
x-axis [Jan, Feb, Mar, Apr, May, Jun]
y-axis "Revenue ($K)" 0 --> 100
bar [30, 45, 60, 55, 70, 85]
line [25, 40, 55, 50, 65, 80]

`````
Suporta as séries `bar` e `line`. Várias séries podem ser combinadas.

---

## 13. Gráfico de quadrante

**Palavra-chave:** `quadrantChart````mermaid
quadrantChart
    title Feature Prioritization
    x-axis "Low Effort" --> "High Effort"
    y-axis "Low Impact" --> "High Impact"
    quadrant-1 "Quick Wins"
    quadrant-2 "Major Projects"
    quadrant-3 "Fill-ins"
    quadrant-4 "Thankless Tasks"
    Feature A: [0.8, 0.9]
    Feature B: [0.2, 0.7]
    Feature C: [0.6, 0.3]
    Feature D: [0.3, 0.2]
`````

As coordenadas são `[x, y]` com valores entre 0 e 1.

---

## 14. Diagrama de blocos

**Palavra-chave:** `block-beta````mermaid
block-beta
columns 3

    space:1 Header["System Overview"]:1 space:1

    Frontend["React App"]:1 API["NestJS API"]:1 DB[("PostgreSQL")]:1

    Frontend --> API
    API --> DB

`````
Use `colunas N` para definir a grade. `espaço:N` para células vazias.
Bloqueia células com sufixo `:N`.

---

## 15. Jornada do usuário

**Palavra-chave:** `jornada````mermaid
journey
    title User Checkout Experience
    section Browse
        Visit homepage: 5: Customer
        Search product: 4: Customer
        View details: 4: Customer
    section Purchase
        Add to cart: 5: Customer
        Enter payment: 2: Customer, Payment System
        Confirm order: 4: Customer, Order Service
    section Post-Purchase
        Receive confirmation: 5: Customer, Email Service
        Track delivery: 3: Customer
`````

Formato: `Nome da tarefa: satisfação(1-5): ator1, ator2`

---

## 16. Diagrama de requisitos

**Palavra-chave:** `requirementDiagram````mermaid
requirementDiagram
requirement high_availability {
id: REQ-001
text: System must achieve 99.9% uptime
risk: high
verifymethod: test
}

    functionalRequirement auto_failover {
        id: REQ-002
        text: Automatic failover within 30 seconds
        risk: medium
        verifymethod: demonstration
    }

    element load_balancer {
        type: service
        docRef: arch-doc-001
    }

    high_availability - traces -> auto_failover
    auto_failover - satisfies -> load_balancer

`````

**Tipos de relacionamento:** `contém`, `copia`, `deriva`, `satisfaz`, `verifica`,
`refina`, `traços`

---

## 17. Diagrama de pacotes

**Palavra-chave:** `packet-beta````mermaid
packet-beta
    0-15: "Source Port"
    16-31: "Destination Port"
    32-63: "Sequence Number"
    64-95: "Acknowledgment Number"
    96-99: "Data Offset"
    100-105: "Reserved"
    106-111: "Flags"
    112-127: "Window Size"
    128-143: "Checksum"
    144-159: "Urgent Pointer"
`````

Formato: `start-end: "Label"` — intervalos de bits para cabeçalhos de protocolo.

---

## 18. Kanban

**Palavra-chave:** `kanban````mermaid
kanban
column1["To Do"]
task1["Design database schema"]
task2["Write API specs"]
column2["In Progress"]
task3["Implement auth"]
column3["Review"]
task4["Code review: payments"]
column4["Done"]
task5["Setup CI/CD"]

````
---

## Configuração Global

Qualquer diagrama pode ser configurado com frontmatter:```mermaid
---
config:
  theme: base
  look: classic
  layout: dagre
  themeVariables:
    primaryColor: "#4f46e5"
    lineColor: "#94a3b8"
---
flowchart LR
    A --> B --> C
````

**Temas:** `default`, `forest`, `dark`, `neutral`, `base`
**Aparência:** `clássico`, `handDrawn`
**Layouts:** `dagre` (padrão), `elk` (avançado, precisa de integração)

## Diretivas (Configuração Inline)

**IMPORTANTE:** A diretiva init DEVE estar na primeira linha, antes de qualquer declaração de tipo de diagrama.```
%%{init: {'theme': 'base', 'themeVariables': {
'primaryColor': '#4f46e5', 'lineColor': '#94a3b8',
'primaryTextColor': '#fff', 'primaryBorderColor': '#3730a3'
}}}%%

```

**Regra de ouro:** Sempre inclua `'lineColor': '#94a3b8'` para substituir as linhas pretas duras padrão por linhas de cor ardósia mais suaves. Essa única alteração melhora drasticamente a estética do diagrama.
```
