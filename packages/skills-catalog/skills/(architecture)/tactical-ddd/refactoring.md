# Movimentos de refatoração

Aplique movimentos em ordem. Pare quando a classe passar em todas as verificações de detecção.

---

## Movimento 1 — Substitua a cadeia setter pelo método de intenção

**Quando**: Vários setters são chamados juntos para realizar uma operação.```typescript
// Before ❌
order.setStatus('CONFIRMED');
order.setConfirmedAt(new Date());
order.setConfirmedBy(userId);

// After ✅
class Order {
confirm(confirmedBy: UserId): void {
if (this.status !== OrderStatus.PENDING) {
throw new Error('Only pending orders can be confirmed.');
}
this.status = OrderStatus.CONFIRMED;
this.confirmedAt = new Date();
this.confirmedBy = confirmedBy;
DomainEventPublisher.publish(new OrderConfirmed(this.orderId, confirmedBy));
}
}
order.confirm(userId);

````

**Regras**:
- O nome do método deve vir da Linguagem Ubíqua
- Todos os guardas de negócios chegam ao topo (falha rápido)
- Publicar um evento de domínio após a mudança de estado ser bem-sucedida

---

## Movimento 2 – Puxe a lógica do serviço para o agregado

**Quando**: um método de serviço busca um agregado e então faz lógica de negócios nele.```typescript
// Before ❌ — logic lives in service
class DiscountService {
  apply(orderId: string, pct: number): void {
    const order = this.repo.find(orderId);
    if (pct < 0 || pct > 100) throw new Error('Invalid discount');
    const discounted = order.getTotal() * (1 - pct / 100);
    order.setTotal(discounted);
    order.setDiscountApplied(true);
  }
}

// After ✅ — logic inside Aggregate
class Order {
  applyDiscount(discount: Discount): void {
    if (this.discountApplied) throw new Error('Discount already applied.');
    this.total = this.total.applyDiscount(discount);
    this.discountApplied = true;
    DomainEventPublisher.publish(new OrderDiscountApplied(this.orderId, discount));
  }
}
// Service becomes a thin coordinator
class DiscountService {
  apply(orderId: string, pct: number): void {
    const order = this.repo.find(orderId);
    order.applyDiscount(new Discount(pct));  // VO validates range
    this.repo.save(order);
  }
}
````

---

## Movimento 3 — Extrair primitivo para objeto de valor

**Quando**: Primitivos carregam significado de domínio ou regras de validação.```typescript
// Before ❌
class Order {
customerId: string;
totalAmount: number;
currency: string;
}

// After ✅
class CustomerId {
constructor(private readonly value: string) {
if (!value) throw new Error('CustomerId cannot be empty');
}
equals(other: CustomerId): boolean { return this.value === other.value; }
toString(): string { return this.value; }
}

class Money {
constructor(readonly amount: number, readonly currency: string) {
if (amount < 0) throw new Error('Amount cannot be negative');
if (!currency) throw new Error('Currency required');
}
add(other: Money): Money {
if (this.currency !== other.currency) throw new Error('Currency mismatch');
return new Money(this.amount + other.amount, this.currency);
}
applyDiscount(discount: Discount): Money {
return new Money(this.amount \* (1 - discount.rate), this.currency);
}
equals(other: Money): boolean {
return this.amount === other.amount && this.currency === other.currency;
}
}

class Order {
constructor(readonly customerId: CustomerId, private total: Money) {}
}

````
---

## Movimento 4 – Adicionar guardas de negócios

**Quando**: Os métodos mudam de estado sem pré-condições.

Todo método de intenção deve começar com:
1. Validação de pré-estado (`if (this.status! == X) throw`)
2. Verificações de consistência entre campos
3. Em seguida, indique a mutação
4. Em seguida, publicação do evento de domínio```typescript
cancel(reason: string): void {
  // Guard 1: correct state
  if (this.status === OrderStatus.DELIVERED) {
    throw new Error('Cannot cancel a delivered order.');
  }
  // Guard 2: required data
  if (!reason || reason.trim().length === 0) {
    throw new Error('Cancellation reason is required.');
  }
  this.status = OrderStatus.CANCELLED;
  this.cancellationReason = reason;
  DomainEventPublisher.publish(new OrderCancelled(this.orderId, reason));
}
````

---

## Mover 5 – Separar o serviço de domínio do serviço de aplicativo

**Quando**: um serviço de aplicativo contém regras de negócios, não apenas coordenação.

| Pertence ao Serviço de Domínio                    | Pertence ao Serviço de Aplicativo    |
| ------------------------------------------------- | ------------------------------------ | ------------- |
| Regras de negócios envolvendo múltiplos agregados | Carregando agregados de repositórios |
| Cálculos de domínio                               | Gestão de transações                 |
| Validação abrangendo agregados                    | Chamando serviços de domínio         |
| Operações comerciais apátridas                    | Mapeamento de/para DTOs              | ```typescript |

// Domain Service — business logic
class AuthenticationService {
authenticate(tenantId: TenantId, username: string, password: string): UserDescriptor | null {
const tenant = this.tenantRepo.findById(tenantId);
if (!tenant?.isActive()) return null;
const user = this.userRepo.findByCredentials(tenantId, username, this.encrypt(password));
return user?.isEnabled() ? user.toDescriptor() : null;
}
}

// Application Service — coordinates
class UserAppService {
login(tenantId: string, username: string, password: string): UserDescriptorDto {
const descriptor = this.authService.authenticate(
new TenantId(tenantId), username, password
);
if (!descriptor) throw new UnauthorizedError();
return UserDescriptorMapper.toDto(descriptor);
}
}

```
---

## Lista de verificação de eventos de domínio (após cada mudança)

- [] Nomeado no passado usando linguagem ubíqua (`OrderConfirmed`, não `StatusChanged`)
- [ ] Publicado após mudança de estado bem-sucedida, não antes
- [] Contém apenas dados que o agregado já possui (sem chamadas extras de repositório)
- [] Imutável (todos os campos `somente leitura`)
- [] Carrega `occurredOn: Date` e opcionalmente `eventVersion`
```
