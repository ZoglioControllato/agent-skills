# Comunicação do Módulo

## Índice

1. Interface de eventos de domínio (linha ~10)
2. Editor In-Memory (Desenvolvimento) (linha ~40)
3. Editores de produção (linha ~70)
4. Contratos entre módulos (linha ~160)
5. Padrão de manipulador de eventos (linha ~200)
6. Escolhendo um sistema de eventos (linha ~240)

---

## 1. Interface de eventos de domínio

Todos os eventos implementam uma interface compartilhada. Este é o contrato entre módulos.```typescript
// libs/shared/contracts/src/events/domain-event.interface.ts
export interface DomainEvent {
readonly aggregateId: string
readonly eventType: string
readonly occurredAt: Date
readonly version: number
readonly payload: Record<string, unknown>
}

// libs/shared/contracts/src/events/event-publisher.interface.ts
export interface EventPublisher {
publish<T extends Record<string, unknown>>(eventName: string, payload: T): Promise<void>
}

export const EVENT_PUBLISHER = Symbol('EventPublisher')

````
## 2. Editor In-Memory (Desenvolvimento)

Para desenvolvimento e testes locais. Mude para editores de produção via DI.```typescript
// libs/shared/infrastructure/src/events/in-memory-event-publisher.ts
import { Injectable, Logger } from '@nestjs/common'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { EventPublisher } from '@project/shared/contracts'

@Injectable()
export class InMemoryEventPublisher implements EventPublisher {
  private readonly logger = new Logger(InMemoryEventPublisher.name)

  constructor(private readonly eventEmitter: EventEmitter2) {}

  async publish<T extends Record<string, unknown>>(eventName: string, payload: T): Promise<void> {
    this.logger.debug(`Publishing event: ${eventName}`, payload)
    this.eventEmitter.emit(eventName, payload)
  }
}
````

> ⚠️ **Nunca use eventos na memória para comunicação entre módulos de produção.** Os eventos na memória não sobrevivem a reinicializações de processos, não são escalonáveis ​​entre instâncias e não têm garantias de entrega.

---

## 3. Editores de produção

### Kafka — Para alto rendimento e fornecimento de eventos```typescript

// libs/shared/infrastructure/src/events/kafka-event-publisher.ts
import { Injectable, Logger } from '@nestjs/common'
import { Producer } from 'kafkajs'
import { EventPublisher } from '@project/shared/contracts'

@Injectable()
export class KafkaEventPublisher implements EventPublisher {
private readonly logger = new Logger(KafkaEventPublisher.name)

constructor(private readonly producer: Producer) {}

async publish<T extends Record<string, unknown>>(eventName: string, payload: T): Promise<void> {
const topic = `events.${eventName.replace(/\./g, '-')}`
await this.producer.send({
topic,
messages: [
{
key: eventName,
value: JSON.stringify(payload),
headers: { eventType: eventName, timestamp: new Date().toISOString() },
},
],
})
this.logger.log(`Event published to ${topic}: ${eventName}`)
}
}

````
### SQS — Para enfileiramento simples e nativo da AWS```typescript
// libs/shared/infrastructure/src/events/sqs-event-publisher.ts
import { Injectable } from '@nestjs/common'
import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs'
import { EventPublisher } from '@project/shared/contracts'

@Injectable()
export class SQSEventPublisher implements EventPublisher {
  constructor(
    private readonly sqsClient: SQSClient,
    private readonly queueUrlResolver: QueueUrlResolver,
  ) {}

  async publish<T extends Record<string, unknown>>(eventName: string, payload: T): Promise<void> {
    const queueUrl = this.queueUrlResolver.resolve(eventName)
    await this.sqsClient.send(
      new SendMessageCommand({
        QueueUrl: queueUrl,
        MessageBody: JSON.stringify(payload),
        MessageAttributes: {
          eventType: { StringValue: eventName, DataType: 'String' },
        },
      }),
    )
  }
}
````

### Redis — Para cenários pub/sub em tempo real```typescript

// libs/shared/infrastructure/src/events/redis-event-publisher.ts
import { Injectable } from '@nestjs/common'
import { Redis } from 'ioredis'
import { EventPublisher } from '@project/shared/contracts'

@Injectable()
export class RedisEventPublisher implements EventPublisher {
constructor(private readonly redis: Redis) {}

async publish<T extends Record<string, unknown>>(eventName: string, payload: T): Promise<void> {
await this.redis.publish(eventName, JSON.stringify(payload))
}
}

````
### Cadastrando Editores via DI```typescript
// libs/shared/infrastructure/src/events/event-publisher.module.ts
@Module({
  providers: [
    {
      provide: EVENT_PUBLISHER,
      useFactory: (config: ConfigService) => {
        const driver = config.get('EVENT_DRIVER', 'in-memory')
        switch (driver) {
          case 'kafka':
            return new KafkaEventPublisher(/* ... */)
          case 'sqs':
            return new SQSEventPublisher(/* ... */)
          case 'redis':
            return new RedisEventPublisher(/* ... */)
          default:
            return new InMemoryEventPublisher(/* ... */)
        }
      },
      inject: [ConfigService],
    },
  ],
  exports: [EVENT_PUBLISHER],
})
export class EventPublisherModule {}
````

---

## 4. Contratos entre módulos

Os eventos são a ÚNICA forma pela qual os módulos devem se comunicar. Defina contratos de eventos na biblioteca de contratos compartilhados.```typescript
// libs/shared/contracts/src/events/identity.events.ts
export class IdentityUserCreatedEvent implements DomainEvent {
readonly eventType = 'identity.user.created'
readonly version = 1
readonly occurredAt = new Date()

constructor(
public readonly aggregateId: string,
public readonly payload: { userId: string; email: string; name: string },
) {}
}

// libs/shared/contracts/src/events/billing.events.ts
export class BillingSubscriptionActivatedEvent implements DomainEvent {
readonly eventType = 'billing.subscription.activated'
readonly version = 1
readonly occurredAt = new Date()

constructor(
public readonly aggregateId: string,
public readonly payload: { subscriptionId: string; planId: string; userId: string },
) {}
}

````

**Regras para contratos de eventos:**

- Os tipos de eventos usam notação de ponto: `module.gregate.action`
- As cargas contêm apenas dados primitivos e serializáveis
- Nunca inclua referências de entidades de domínio em eventos (use IDs)
- Eventos de versão quando seu esquema muda
- Os eventos são imutáveis após a criação

---

## 5. Padrão de manipulador de eventos

Os manipuladores em outros módulos reagem aos eventos. Sempre idempotente.```typescript
// libs/billing/application/handlers/on-user-created.handler.ts
import { OnEvent } from '@nestjs/event-emitter'
import { Injectable, Logger } from '@nestjs/common'

@Injectable()
export class OnUserCreatedHandler {
  private readonly logger = new Logger(OnUserCreatedHandler.name)

  @OnEvent('identity.user.created')
  async handle(event: IdentityUserCreatedEvent): Promise<void> {
    this.logger.log(`Setting up billing for user: ${event.payload.userId}`)
    await this.billingService.createDefaultProfile(event.payload.userId)
  }
}
````

**Regras de idempotência:**

- Verifique se a ação já foi executada antes de executar
- Use `agregateId` + `eventType` como chave de desduplicação
- Registrar todo o processamento de eventos para observabilidade

---

## 6. Escolhendo um sistema de eventos

| Critérios   | Kafka              | SQS                | Redis             | Na memória     |
| ----------- | ------------------ | ------------------ | ----------------- | -------------- |
| **Entrega** | Pelo menos uma vez | Pelo menos uma vez | No máximo uma vez | Melhor esforço |
| **Pedidos** | Por partição       | Filas FIFO         | Sem garantia      | Síncrono       |

|
| **Persistência** | Sim (configurável) | Sim (14 dias) | Não | Não |
| **Rendimento** | Muito alto | Alto | Muito alto | N/A |
| **Complexidade** | Alto | Baixo | Baixo | Mínimo |
| **Caso de uso** | Fornecimento de eventos em grande escala | Fluxos simples e nativos da AWS | Em tempo real, pub/sub | Somente desenvolvimento/teste

você |

**Recomendação:** comece com In-Memory para desenvolvimento, SQS ou Redis para produção (dependendo do provedor de nuvem). Kafka somente quando você tiver superado soluções mais simples.
