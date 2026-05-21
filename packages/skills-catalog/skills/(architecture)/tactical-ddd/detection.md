# Detecção de anemia

## Etapa 1 — Sinais de código a serem verificados

Procure esses padrões. Cada correspondência é um indicador potencial de anemia:

| Sinal                                                     | Padrão                                                      | Peso |
| --------------------------------------------------------- | ----------------------------------------------------------- | ---- |
| Setter público                                            | `conjunto público[AZ]`                                      | +2   |
| Cadeia setter no chamador                                 | `entidade.setA(); entidade.setB()`                          | +3   |
| Lógica na camada Aplicação/Serviço que altera entidade    | `entity.setX(computedValue)` dentro do método de serviço    | +3   |
| Classe com apenas getters/setters, sem métodos de domínio | Todos os métodos correspondem a `get.*\|set.*\|is.*\|has.*` | +4   |
| Obsessão primitiva em vez de objetos de valor             | `string                                                     |

customerId`, `número valor`na Entidade | +1 |
| Padrão de coordenador: buscas de serviço + alterações |`repo.find()`então vários`entity.setX()` | +2 |
| Guardas desaparecidos | Métodos sem verificação de pré-condições | +1 |

## Etapa 2 — Pontuação de gravidade

Some os pesos de todos os sinais da classe:

| Pontuação | Gravidade | Significado                                       |
| --------- | --------- | ------------------------------------------------- |
| 0         | Nenhum    | Bem modelado                                      |
| 1–3       | Suave     | Pequenas melhorias; prioridades em outros lugares |
| 4–6       | Moderado  | Refatorar; lógica de negócios está vazando        |
| 7+        | Grave     | Redesenho completo; domínio é apenas um DTO       |

## Etapa 3 — Lista de verificação em nível de turma

Para cada classe em análise:

- [ ] Possui setters públicos para campos significativos para os negócios?
- [ ] Os chamadores definem vários campos para realizar uma única operação?
- [ ] A classe é usada como saco de parâmetros por serviços que contêm a lógica real?
- [] Não existem métodos que expressem a intenção do domínio?
- [ ] Os IDs e medidas são armazenados como primitivos em vez de objetos de valor?
- [ ] Não há Eventos de Domínio publicados após mudanças de estado?

## Padrões comuns de anemia

### O Serviço do Coordenador```typescript

// ❌ Logic lives outside the entity
class OrderService {
confirm(orderId: string): void {
const order = this.repo.find(orderId);
order.setStatus('CONFIRMED'); // setter
order.setConfirmedAt(new Date()); // setter
order.setConfirmedBy(this.userId); // setter
this.repo.save(order);
}
}

````**Sinal**: Três setters para expressar uma operação comercial.

### O objeto de transferência de dados disfarçado de entidade```typescript
// ❌ Pure data bag
class Product {
  getName(): string { return this.name; }
  setName(v: string) { this.name = v; }
  getPrice(): number { return this.price; }
  setPrice(v: number) { this.price = v; }
  getStock(): number { return this.stock; }
  setStock(v: number) { this.stock = v; }
}
```**Sinal**: comportamento de domínio zero, todos os métodos são acessadores.

### Obsessão Primitiva```typescript
// ❌ Primitives lose domain meaning and validation
class Order {
  customerId: string;   // Should be CustomerId VO
  totalAmount: number;  // Should be Money VO
  currency: string;     // Part of Money VO
}
````
