# Padrões de Arquitetura

## Índice

1. Camadas de arquitetura limpa (linha ~15)
2. Blocos de construção DDD (linha ~80)
3. Padrão CQRS — Opcional (linha ~140)
4. Padrão de serviço simples — Padrão (linha ~200)
5. Configuração do NX Workspace (linha ~240)
6. Configuração estrita do TypeScript (linha ~ 310)

---

## 1. Camadas de arquitetura limpa

Cada módulo segue quatro camadas, com dependências apontando para dentro:```
Presentation → Application → Domain ← Infrastructure

````

**Camada de Domínio** (mais interna — sem dependências externas):```typescript
// libs/[module]/domain/entities/billing-plan.entity.ts
export class BillingPlan {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly priceInCents: number,
    public readonly interval: BillingInterval,
    public readonly createdAt: Date,
  ) {}

  isActive(): boolean {
    return this.priceInCents > 0
  }

  canUpgradeTo(target: BillingPlan): boolean {
    return target.priceInCents > this.priceInCents
  }
}

export enum BillingInterval {
  MONTHLY = 'MONTHLY',
  YEARLY = 'YEARLY',
}
````

**Camada de Domínio — Interface de Repositório:**

```typescript
// libs/[module]/domain/repositories/billing-plan.repository.ts
export interface BillingPlanRepository {
  findById(id: string): Promise<BillingPlan | null>
  findAll(): Promise<BillingPlan[]>
  save(plan: BillingPlan): Promise<BillingPlan>
  delete(id: string): Promise<void>
}

export const BILLING_PLAN_REPOSITORY = Symbol('BillingPlanRepository')
```

**Camada de Aplicação** (orquestra domínio, define casos de uso):```typescript
// libs/[module]/application/services/billing-plan.service.ts
@Injectable()
export class BillingPlanService {
constructor(
@Inject(BILLING_PLAN_REPOSITORY)
private readonly repository: BillingPlanRepository,
private readonly eventPublisher: EventPublisher,
) {}

async create(name: string, priceInCents: number, interval: BillingInterval): Promise<BillingPlan> {
const plan = new BillingPlan(generateId(), name, priceInCents, interval, new Date())
const saved = await this.repository.save(plan)
await this.eventPublisher.publish('billing.plan.created', { planId: saved.id, name: saved.name })
return saved
}

async findById(id: string): Promise<BillingPlan> {
const plan = await this.repository.findById(id)
if (!plan) throw new BillingPlanNotFoundError(id)
return plan
}
}

````

**Camada de infraestrutura** (implementa interfaces de domínio):```typescript
// libs/[module]/infrastructure/repositories/prisma-billing-plan.repository.ts
@Injectable()
export class PrismaBillingPlanRepository implements BillingPlanRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<BillingPlan | null> {
    const data = await this.prisma.billingPlan.findUnique({ where: { id } })
    return data ? this.toDomain(data) : null
  }

  async save(plan: BillingPlan): Promise<BillingPlan> {
    const data = await this.prisma.billingPlan.upsert({
      where: { id: plan.id },
      update: { name: plan.name, priceInCents: plan.priceInCents },
      create: { id: plan.id, name: plan.name, priceInCents: plan.priceInCents, interval: plan.interval },
    })
    return this.toDomain(data)
  }

  async delete(id: string): Promise<void> {
    await this.prisma.billingPlan.delete({ where: { id } })
  }

  async findAll(): Promise<BillingPlan[]> {
    const data = await this.prisma.billingPlan.findMany()
    return data.map(this.toDomain)
  }

  private toDomain(data: PrismaBillingPlanRecord): BillingPlan {
    return new BillingPlan(data.id, data.name, data.priceInCents, data.interval as BillingInterval, data.createdAt)
  }
}
````

**Camada de apresentação** (interface HTTP):```typescript
// libs/[module]/presentation/billing-plan.controller.ts
@Controller('billing/plans')
@ApiTags('billing-plans')
export class BillingPlanController {
constructor(private readonly billingPlanService: BillingPlanService) {}

@Post()
@ApiOperation({ summary: 'Create billing plan' })
@ApiResponse({ status: 201, type: BillingPlanResponseDto })
async create(@Body() dto: CreateBillingPlanDto): Promise<BillingPlanResponseDto> {
const plan = await this.billingPlanService.create(dto.name, dto.priceInCents, dto.interval)
return BillingPlanResponseDto.from(plan)
}
}

````
---

## 2. Blocos de construção DDD

### Entidades

Objetos com identidade e ciclo de vida. Use nomes com prefixo de módulo.```typescript
// ✅ Correct: Module-prefixed entity
export class IdentityUser {
  constructor(
    public readonly id: string,
    public email: string,
    public name: string,
    private passwordHash: string,
  ) {}

  updateProfile(name: string): void {
    if (!name?.trim() || name.trim().length < 2) {
      throw new InvalidUserNameError('Name must be at least 2 characters')
    }
    this.name = name.trim()
  }

  verifyPassword(hasher: PasswordHasher, plainPassword: string): boolean {
    return hasher.verify(this.passwordHash, plainPassword)
  }
}

// ❌ Wrong: Generic name without module prefix
export class User {
  /* ... */
}
````

### Objetos de valor

Objetos imutáveis definidos por seus atributos, não por identidade.```typescript
export class Money {
constructor(
public readonly amount: number,
public readonly currency: string,
) {
if (amount < 0) throw new Error('Amount cannot be negative')
if (!currency || currency.length !== 3) throw new Error('Invalid currency code')
}

add(other: Money): Money {
if (this.currency !== other.currency) throw new Error('Currency mismatch')
return new Money(this.amount + other.amount, this.currency)
}

equals(other: Money): boolean {
return this.amount === other.amount && this.currency === other.currency
}
}

````
### Agregados

Cluster de entidades e objetos de valor com uma entidade raiz. Acesso externo somente através do root.```typescript
export class OrderAggregate {
  private items: OrderItem[] = []

  constructor(
    public readonly id: string,
    public readonly customerId: string,
    private status: OrderStatus = OrderStatus.PENDING,
  ) {}

  addItem(productId: string, quantity: number, price: Money): void {
    if (this.status !== OrderStatus.PENDING) {
      throw new OrderNotModifiableError(this.id)
    }
    const existing = this.items.find((i) => i.productId === productId)
    if (existing) {
      existing.updateQuantity(existing.quantity + quantity)
    } else {
      this.items.push(new OrderItem(generateId(), productId, quantity, price))
    }
  }

  confirm(): void {
    if (this.items.length === 0) throw new EmptyOrderError(this.id)
    this.status = OrderStatus.CONFIRMED
  }

  get total(): Money {
    return this.items.reduce((sum, item) => sum.add(item.subtotal), new Money(0, 'USD'))
  }
}
````

### Exceções de domínio

Erros específicos de domínio que são mapeados para códigos de status HTTP por meio de filtros de exceção.```typescript
// libs/[module]/domain/exceptions/
export class DomainException extends Error {
constructor(message: string) {
super(message)
this.name = this.constructor.name
}
}

export class OrderNotFoundError extends DomainException {
constructor(id: string) {
super(`Order ${id} not found`)
}
}

export class OrderNotModifiableError extends DomainException {
constructor(id: string) {
super(`Order ${id} cannot be modified`)
}
}

export class EmptyOrderError extends DomainException {
constructor(id: string) {
super(`Order ${id} has no items`)
}
}

````
---

## 3. Padrão CQRS - Opcional

> ⚠️ **CQRS NÃO é o padrão.** Use-o somente quando o domínio realmente se beneficiar da separação dos modelos de leitura e gravação. Para a maioria dos módulos, o padrão de serviço simples (seção 4) é suficiente.

**Quando usar CQRS:**

- Os padrões de leitura e gravação diferem significativamente
- Cargas de trabalho com muita leitura precisam de consultas otimizadas
- Lógica de domínio complexa em gravações, recuperação simples de dados em leituras
- Diferentes necessidades de escalonamento para leituras e gravações

**Quando NÃO usar CQRS:**

- Operações CRUD simples
- Os modelos de leitura e gravação são idênticos
- Pequeno conjunto de dados com padrões de acesso uniformes
- A equipe não está familiarizada com o padrão

### Lado do comando```typescript
// Command
export class PlaceOrderCommand {
  constructor(
    public readonly customerId: string,
    public readonly items: Array<{ productId: string; quantity: number }>,
  ) {}
}

// Handler
@CommandHandler(PlaceOrderCommand)
export class PlaceOrderHandler implements ICommandHandler<PlaceOrderCommand> {
  constructor(
    @Inject(ORDER_REPOSITORY) private readonly repo: OrderRepository,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: PlaceOrderCommand): Promise<string> {
    const order = new OrderAggregate(generateId(), command.customerId)
    for (const item of command.items) {
      const price = await this.pricingService.getPrice(item.productId)
      order.addItem(item.productId, item.quantity, price)
    }
    order.confirm()
    await this.repo.save(order)
    this.eventBus.publish(new OrderPlacedEvent(order.id, order.total))
    return order.id
  }
}
````

### Lado da consulta```typescript

// Query
export class GetOrderSummaryQuery {
constructor(public readonly orderId: string) {}
}

// Handler — can bypass domain model for read performance
@QueryHandler(GetOrderSummaryQuery)
export class GetOrderSummaryHandler implements IQueryHandler<GetOrderSummaryQuery> {
constructor(private readonly prisma: PrismaService) {}

async execute(query: GetOrderSummaryQuery) {
return this.prisma.order.findUnique({
where: { id: query.orderId },
include: { items: true },
})
}
}

````
---

## 4. Padrão de serviço simples - padrão

Esta é a abordagem padrão recomendada. Use serviços `@Injectable()` que encapsulam a lógica de negócios e interagem com repositórios via DI.```typescript
// libs/orders/application/services/order.service.ts
@Injectable()
export class OrderService {
  constructor(
    @Inject(ORDER_REPOSITORY) private readonly repo: OrderRepository,
    @Inject(EVENT_PUBLISHER) private readonly events: EventPublisher,
  ) {}

  async placeOrder(customerId: string, items: Array<{ productId: string; quantity: number }>): Promise<string> {
    const order = new OrderAggregate(generateId(), customerId)
    for (const item of items) {
      const price = await this.pricingService.getPrice(item.productId)
      order.addItem(item.productId, item.quantity, price)
    }
    order.confirm()
    await this.repo.save(order)
    await this.events.publish('orders.order.placed', { orderId: order.id, total: order.total })
    return order.id
  }

  async getById(id: string): Promise<OrderAggregate> {
    const order = await this.repo.findById(id)
    if (!order) throw new OrderNotFoundError(id)
    return order
  }
}
````

O controlador injeta o serviço diretamente:```typescript
@Controller('orders')
@ApiTags('orders')
export class OrderController {
constructor(private readonly orderService: OrderService) {}

@Post()
async create(@Body() dto: CreateOrderDto) {
const orderId = await this.orderService.placeOrder(dto.customerId, dto.items)
return { id: orderId }
}

@Get(':id')
async findOne(@Param('id', ParseUUIDPipe) id: string) {
return this.orderService.getById(id)
}
}

````

**Quando atualizar para CQRS:** Se você perceber que seu serviço está crescendo com lógica de leitura e gravação muito diferente, ou se precisar otimizar leituras de forma independente (por exemplo, visualizações desnormalizadas, camadas de cache), considere extrair o serviço em manipuladores de comando e manipuladores de consulta separados.

---

## 5. Configuração do espaço de trabalho NX

###nx.json```json
{
  "$schema": "./node_modules/nx/schemas/nx-schema.json",
  "defaultBase": "main",
  "namedInputs": {
    "default": ["{projectRoot}/**/*", "sharedGlobals"],
    "sharedGlobals": ["{workspaceRoot}/tsconfig.base.json"],
    "production": ["default", "!{projectRoot}/**/*.spec.ts", "!{projectRoot}/jest.config.ts"]
  },
  "targetDefaults": {
    "build": { "dependsOn": ["^build"], "inputs": ["production", "^production"] },
    "test": { "inputs": ["default", "^production"] },
    "lint": { "inputs": ["default"] }
  }
}
````

### Limites do módulo (tags eslint ou project.json)

Use tags NX para impor limites de módulo:```json
// project.json for libs/billing
{ "tags": ["scope:billing", "type:domain-lib"] }

// project.json for libs/identity
{ "tags": ["scope:identity", "type:domain-lib"] }

// project.json for libs/shared
{ "tags": ["scope:shared", "type:shared-lib"] }

````
Regras de limite:

- `scope:billing` só pode importar de `scope:shared`
- `scope:identity` só pode importar de `scope:shared`
- Sem importações diretas entre escopos de domínio

---

## 6. Configuração estrita do TypeScript

###tsconfig.base.json```json
{
  "compileOnSave": false,
  "compilerOptions": {
    "rootDir": ".",
    "sourceMap": true,
    "declaration": false,
    "moduleResolution": "node",
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "importHelpers": true,
    "target": "es2022",
    "module": "esnext",
    "lib": ["es2022"],
    "skipLibCheck": true,
    "skipDefaultLibCheck": true,
    "baseUrl": ".",
    "strict": true,
    "noImplicitReturns": true,
    "noImplicitOverride": true,
    "noPropertyAccessFromIndexSignature": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noUncheckedIndexedAccess": true,
    "paths": {
      "@project/shared/domain": ["libs/shared/domain/src/index.ts"],
      "@project/shared/contracts": ["libs/shared/contracts/src/index.ts"],
      "@project/shared/infrastructure": ["libs/shared/infrastructure/src/index.ts"],
      "@project/billing": ["libs/billing/src/index.ts"],
      "@project/identity": ["libs/identity/src/index.ts"],
      "@project/orders": ["libs/orders/src/index.ts"]
    }
  },
  "exclude": ["node_modules", "tmp", "dist"]
}
````

**Sinalizações não negociáveis:** `strict`, `strictNullChecks`, `noImplicitAny`, `noUncheckedIndexedAccess`. Eles detectam bugs reais e impõem a correção do domínio.
