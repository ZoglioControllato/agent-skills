# Referência Tática de DDD

## Entidade

**Usar quando**: o objeto precisa de uma identidade individual rastreada ao longo do tempo, mesmo que os atributos mudem.```typescript
class Entity<T> {
constructor(protected readonly id: T) {}
equals(other: Entity<T>): boolean {
if (!other || this.constructor !== other.constructor) return false;
return this.id === other.id; // identity only
}
}

````

**Regras**:
- A identidade é `readonly`, definida uma vez no construtor, nunca alterada
- Os setters são `privados`; API pública usa métodos expressivos
- Publica eventos de domínio sobre mudanças significativas de estado
- Valida invariantes no construtor e em cada método mutante

**Lista de verificação**:
- [] Identidade única e imutável?
- [ ] Igualdade por identidade (não por atributos)?
- [ ] Métodos expressam linguagem onipresente?
- [ ] Setters privados/protegidos?
- [] Eventos de Domínio sobre mudanças significativas?
- [] Invariantes validados em construção e mutação?

---

## Objeto de valor

**Usar quando**: O conceito é descrito por seus atributos, não possui identidade individual.```typescript
class Money {
  constructor(readonly amount: number, readonly currency: string) {
    if (amount < 0) throw new Error('Amount cannot be negative');
  }
  add(other: Money): Money {                     // side-effect-free
    if (this.currency !== other.currency) throw new Error('Currency mismatch');
    return new Money(this.amount + other.amount, this.currency);
  }
  equals(other: Money): boolean {               // value equality
    return this.amount === other.amount && this.currency === other.currency;
  }
}
// Mutation = replacement
let price = new Money(100, 'USD');
price = price.add(new Money(20, 'USD'));  // new object, not mutation
````

**Regras**:

- Todos os campos `readonly` — nunca sofrem mutação após a construção
- Métodos sem efeitos colaterais retornam novas instâncias
- Igualdade compara todos os atributos
- Valida na construção

**VOs comuns**: `UserId`, `OrderId`, `Money`, `Address`, `EmailAddress`, `DateRange`, `FullName`

**Lista de verificação**:

- [] Totalmente imutável (todos os campos `somente leitura`)?
- [ ] Igualdade por valor?
- [] Métodos retornam novas instâncias?
- [ ] Forma um todo conceitual?
- [ ] Validado na construção?

---

## Agregado

**Use quando**: Um grupo de Entidades + VOs deve ser consistente como uma unidade.

**Quatro regras**:

| Regra                               | Descrição                                                                                                          |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------------ | ------------- |
| **Somente invariantes verdadeiros** | Agrupar objetos somente quando houver uma regra de negócio exigindo que eles sejam consistentes na mesma transação |
| **Mantenha-o pequeno**              | Root + VOs por padrão. Adicionar entidades filhas apenas para invariantes verdadeiros                              |
| **Referência por ID**               | `sprintId: SprintId` e não `sprint: Sprint`                                                                        |
| **Um agregado por transação**       | A coordenação cruzada agregada usa eventos de domínio                                                              | ```typescript |

// ✅ Small Aggregate with true invariant
class BacklogItem {
private tasks: Task[] = [];
private status: BacklogItemStatus;
private productId: ProductId; // reference by ID — not Product object
private sprintId: SprintId | null;

estimateTaskHours(taskId: TaskId, hours: number): void {
this.findTask(taskId).estimateHoursRemaining(hours);
if (this.allTasksCompleted()) {
this.status = BacklogItemStatus.DONE;
}
// Invariant: task hours affect item status — true invariant justifying grouping
}

commitTo(sprint: Sprint): void {
if (!this.isScheduledForRelease()) throw new Error('Must be scheduled.');
if (this.isCommittedToSprint() && sprint.sprintId !== this.sprintId) {
this.uncommitFromSprint();
}
this.sprintId = sprint.sprintId;
this.status = BacklogItemStatus.COMMITTED;
DomainEventPublisher.publish(new BacklogItemCommitted(this.backlogItemId, sprint.sprintId));
}
}

````

**Quando quebrar a regra de uma transação** (raro):
- Criação de lote de UI sem invariantes entre itens
- Nenhuma infraestrutura de mensagens disponível
- Política de transação global explícita (documente o motivo no código)

**Lista de verificação**:
- [] Limpar entidade raiz?
- [ ] Verdadeiro invariante justifica o agrupamento?
- [ ] Pequeno o suficiente (sem coleções grandes)?
- [] Outros agregados referenciados apenas por ID?
- [ ] Um agregado por transação?
- [] Consistência eventual via eventos de domínio para regras de agregação cruzada?

---

## Serviço de Domínio

**Usar quando**: uma operação comercial envolve vários agregados ou não pertence naturalmente a nenhum deles.

**Aviso**: O uso excessivo leva de volta ao modelo anêmico. Pergunte primeiro: “Isso pode viver no Agregado?”

| Critério | Pertence à Entidade/Agregado | Pertence ao Serviço de Domínio |
|-----------|------------------|--------------------------|
| Envolve apenas o estado de um agregado | ✅ | — |
| Requer o carregamento de vários agregados | — | ✅ |
| Cálculo precisa de contexto de muitos objetos | — | ✅ |
| Regra de negócios apátridas | ✅ (se agregado único) | ✅ (se multiagregado) |```typescript
// ✅ Domain Service: authentication spans Tenant + User
class AuthenticationService {
  authenticate(tenantId: TenantId, username: string, password: string): UserDescriptor | null {
    const tenant = this.tenantRepo.findById(tenantId);
    if (!tenant?.isActive()) return null;
    const encrypted = this.encryptionService.encrypt(password);
    const user = this.userRepo.findByCredentials(tenantId, username, encrypted);
    return user?.isEnabled() ? user.toDescriptor() : null;
  }
}
````

**Lista de verificação**:

- [ ] A operação não pertence a nenhuma Entidade ou VO?
- [ ] Apátrida?
- [ ] Expressa linguagem onipresente?
- [ ] NÃO está sendo usado para evitar comportamento em Entidades?
- [] Regras de negócios aqui, não no Application Service?

---

## Eventos de Domínio

**Nomeação**: Passado + Linguagem Onipresente. `OrderConfirmed`, `BacklogItemCommitted`, `UserRegistered`.```typescript
interface DomainEvent {
readonly occurredOn: Date;
readonly eventVersion: number;
}

class OrderConfirmed implements DomainEvent {
readonly occurredOn = new Date();
readonly eventVersion = 1;
constructor(
readonly orderId: OrderId,
readonly confirmedBy: UserId,
) {}
}

```

**Padrão de publicação**:
1. Mudança completa de estado
2. Publicar evento (o estado já é consistente)
3. Os assinantes executam transações separadas para consistência entre agregados

**Lista de verificação**:
- [] Nomeado no passado?
- [] Todos os campos `somente leitura`?
- [] Publicado após (não durante) a mudança de estado?
- [ ] Transporta apenas dados que o Aggregate já possui?
- [] Os manipuladores cross-agregados são executados em transações separadas?
```
