```typescript
const response = await client.chat.completions.create({
  model: 'dynamic/smart-chat', // Nome da rota no dashboard
  messages: [{ role: 'user', content: 'Hello!' }],
})
```

```typescript
headers: {
  'cf-aig-metadata': JSON.stringify({
    userId: 'user-123',
    tier: 'pro',
    region: 'us-east'
  })
}
```

```
Start → GPT-4 → Em erro: Claude → Em erro: Llama
```

```
Conditional: tier == 'enterprise' → GPT-4 (sem limite)
Conditional: tier == 'pro' → Rate Limit 1000/h → GPT-4o
Conditional: tier == 'free' → Rate Limit 10/h → GPT-4o-mini
```

```
Percentage: 10% → modelo novo, 90% → modelo antigo
```

```
Budget Limit: US$ 100/dia por teamId
  < 80%: GPT-4
  >= 80%: GPT-4o-mini
  >= 100%: Erro
```
