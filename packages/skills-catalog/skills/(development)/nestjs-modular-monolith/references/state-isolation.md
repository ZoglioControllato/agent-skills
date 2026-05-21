# Isolamento de estado

## Índice

1. Convenções de nomenclatura de entidades (linha ~10)
2. Isolamento do esquema Prisma (linha ~ 50)
3. Detecção de entidade duplicada (linha ~110)
4. Detecção de antipadrões (linha ~150)
5. Gancho de pré-confirmação (linha ~ 190)

---

## 1. Convenções de nomenclatura de entidades

**Regra crítica:** Cada entidade DEVE ser prefixada com o nome do seu módulo. Nomes genéricos como `User`, `Plan`, `Item` causam colisões entre módulos e tornam impossível saber qual módulo possui os dados.

### Nomenclatura correta da entidade

| Módulo      | Nome da Entidade            | Tabela de banco de dados |
| ----------- | --------------------------- | ------------------------ |
| Identidade  | `IdentidadeUsuário`         | `identidade_usuários`    |
| Identidade  | `Perfil de identidade`      | `identity_profiles`      |
| Faturamento | `Plano de Faturamento`      | `planos_de faturamento`  |
| Faturamento | `Assinatura de faturamento` | `billing_subscriptions`  |
| Encomendas  | `PedidoItem`                | `order_items`            |
| Conteúdo    | `ConteúdoArtigo`            | `content_articles`       |

### Nome de entidade errado

| ❌ Nome   | Problema                                                 |
| --------- | -------------------------------------------------------- |
| `Usuário` | Qual módulo? Identidade? Cobrança?                       |
| `Plano`   | Plano de faturamento? Plano de assinatura?               |
| `Item`    | Encomendar artigo? Item do carrinho? Item de inventário? |
| `Perfil`  | Perfil de usuário? Perfil de companhia?                  |

### Nomenclatura do modelo Prisma```prisma

// ✅ Correct: Module-prefixed with explicit table mapping
model IdentityUser {
id String @id @default(cuid())
email String @unique
name String
// ...
@@map("identity_users")
}

model BillingPlan {
id String @id @default(cuid())
name String
priceInCents Int
// ...
@@map("billing_plans")
}

// ❌ Wrong: Generic names without module prefix
model User {
// ...
@@map("users") // Which module owns this?
}

````
---

## 2. Isolamento do esquema Prisma

### Opção A: esquema único, prefixos de módulo

Todos os modelos vivem em um `schema.prisma`, mas são claramente prefixados e agrupados.```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ═══════════════════════════════════════════
// Identity Module
// ═══════════════════════════════════════════

model IdentityUser {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  @@map("identity_users")
}

// ═══════════════════════════════════════════
// Billing Module
// ═══════════════════════════════════════════

model BillingPlan {
  id            String              @id @default(cuid())
  name          String
  priceInCents  Int
  interval      BillingInterval
  subscriptions BillingSubscription[]
  @@map("billing_plans")
}

model BillingSubscription {
  id        String   @id @default(cuid())
  userId    String   // Reference by ID only, no FK to IdentityUser
  planId    String
  status    BillingSubscriptionStatus
  plan      BillingPlan @relation(fields: [planId], references: [id])
  createdAt DateTime @default(now())
  @@map("billing_subscriptions")
}

enum BillingInterval {
  MONTHLY
  YEARLY
}

enum BillingSubscriptionStatus {
  ACTIVE
  CANCELLED
  PAST_DUE
}

// ═══════════════════════════════════════════
// Orders Module
// ═══════════════════════════════════════════

model OrderRecord {
  id        String      @id @default(cuid())
  userId    String      // Reference by ID only
  status    OrderStatus
  total     Decimal     @db.Decimal(10, 2)
  items     OrderItem[]
  createdAt DateTime    @default(now())
  @@map("order_records")
}

model OrderItem {
  id        String  @id @default(cuid())
  orderId   String
  productId String
  quantity  Int
  price     Decimal @db.Decimal(10, 2)
  order     OrderRecord @relation(fields: [orderId], references: [id])
  @@map("order_items")
}

enum OrderStatus {
  PENDING
  CONFIRMED
  SHIPPED
  DELIVERED
  CANCELLED
}
````

**Regra principal:** Referências entre módulos usam `userId String` (apenas o ID), NÃO `user IdentityUser @relation(...)`. As relações de chave estrangeira só devem existir DENTRO de um módulo.

### Opção B: Multi-esquema (Prisma 5.15+)

Para projetos maiores, use o suporte multiesquema do Prisma:```prisma
datasource db {
provider = "postgresql"
url = env("DATABASE_URL")
schemas = ["identity", "billing", "orders"]
}

model IdentityUser {
id String @id @default(cuid())
email String @unique
@@schema("identity")
@@map("users")
}

model BillingPlan {
id String @id @default(cuid())
name String
@@schema("billing")
@@map("plans")
}

````
---

## 3. Detecção de entidade duplicada

Execute essas verificações antes de cada commit ou mesclagem de PR.

### Encontre nomes de entidades duplicados```bash
# For Prisma schemas — find duplicate model names
grep -r "^model " prisma/ | awk '{print $2}' | sort | uniq -d
````

### Encontre mapeamentos de tabelas duplicados```bash

# Find duplicate @@map values

grep -r '@@map(' prisma/ | grep -o '"[^"]\*"' | sort | uniq -d

````
### Encontre relações de chave estrangeira entre módulos```bash
# These should NOT exist — only within-module relations are allowed
grep -rn '@relation' prisma/schema.prisma | while read line; do
  echo "CHECK: $line"
  echo "  → Verify this relation is WITHIN a single module"
done
````

---

## 4. Detecção de antipadrões

### Detectar estado mutável compartilhado```bash

# Exported mutable singletons — should not exist

grep -r "export.*=.*new" libs/ | grep -v test | grep -v node_modules

````
### Detectar importações diretas entre módulos```bash
# Modules should only import from @project/[module] (index barrel), never from deep paths
grep -rn "from '@project/" libs/ | grep -v "/index" | grep -v "shared" | grep -v node_modules | grep -v ".spec."
````

### Detectar chamadas síncronas entre módulos```bash

# Direct service calls across modules — should use events instead

grep -rn "await.\*Service\." libs/ | grep -v "this\." | grep -v test | grep -v node_modules

````
### Detectar prefixos de módulos ausentes em entidades```bash
# Entities/models with generic single-word names (potential violations)
grep -rn "^export class [A-Z][a-z]*\b " libs/*/domain/ | grep -v "Error\|Exception\|Event\|Command\|Query\|Handler\|Dto\|Module\|Guard\|Filter"
````

---

## 5. Gancho de pré-confirmação

Adicione isto a `.husky/pre-commit` ou equivalente. Para uma versão mais abrangente, use `scripts/validate-isolation.sh` incluído nesta habilidade.```bash
#!/bin/bash
echo "🔍 Running state isolation checks..."

ERRORS=0

# Check 1: Duplicate Prisma model names

DUPES=$(grep -r "^model " prisma/ 2>/dev/null | awk '{print $2}' | sort | uniq -d)
if [ -n "$DUPES" ]; then
echo "❌ Duplicate model names found: $DUPES"
  echo "   Fix: Prefix each model with its module name (e.g., BillingPlan)"
  ERRORS=$((ERRORS + 1))
fi

# Check 2: Duplicate table mappings

MAP_DUPES=$(grep -r '@@map(' prisma/ 2>/dev/null | grep -o '"[^"]*"' | sort | uniq -d)
if [ -n "$MAP_DUPES" ]; then
echo "❌ Duplicate table mappings found: $MAP_DUPES"
  ERRORS=$((ERRORS + 1))
fi

# Check 3: Direct cross-module imports (non-barrel)

CROSS_IMPORTS=$(grep -rn "from '@project/" libs/ 2>/dev/null | grep -v "/index" | grep -v "shared" | grep -v node_modules | grep -v ".spec.")
if [ -n "$CROSS_IMPORTS" ]; then
echo "⚠️ Direct cross-module imports detected:"
echo "$CROSS_IMPORTS"
  echo "   Fix: Import only from module barrel (@project/module-name)"
  ERRORS=$((ERRORS + 1))
fi

if [ $ERRORS -gt 0 ]; then
echo "❌ State isolation check failed with $ERRORS error(s). Fix issues before committing."
exit 1
fi

echo "✅ State isolation checks passed."

```

```
