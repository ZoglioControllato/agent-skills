---
title: Evitar serialização duplicada em props RSC
impact: LOW
impactDescription: reduz a carga útil da rede para evitar serialização duplicada
tags: server, rsc, serialization, props, client-components
---

## Evitar serialização duplicada em props RSC

**Impacto: BAIXO (reduz payload de rede para evitar serialização duplicada)**

RSC→cliente deduplica por referência de objeto, não por valor igual. Mesma referência serializada uma vez; referência nova serializada outra vez. Faça transformações (`.toSorted()`, `.filter()`, `.map()`) no cliente, não no servidor.

**Incorreto (matriz duplicada):**

```tsx
// RSC: sends 6 strings (2 arrays × 3 items)
<ClientList usernames={usernames} usernamesOrdered={usernames.toSorted()} />
```

**Correto (envia 3 cordas):**

```tsx
// RSC: send once
;<ClientList usernames={usernames} />

// Client: transform there
;('use client')
const sorted = useMemo(() => [...usernames].sort(), [usernames])
```

**Desduplicação aninhada:**

A desduplicação é recursiva. O impacto varia pelo tipo:

- `string[]`, `number[]`, `boolean[]`: **alto impacto** — array e todos os primitivos duplicados

- `object[]`: **baixo impacto** — apenas a estrutura do array é duplicada; objetos aninados deduplicados por referência```tsx
  // string[] - duplicates everything
  usernames={['a','b']} sorted={usernames.toSorted()} // sends 4 strings

// object[] - duplicates array structure only
users={[{id:1},{id:2}]} sorted={users.toSorted()} // sends 2 arrays + 2 unique objects (not 4)

````

**Operações que quebram deduplicação (criam referências novas):**

- Matrizes: `.toSorted()`, `.filter()`, `.map()`, `.slice()`, `[...arr]`

- Objetos: `{...obj}`, `Object.assign()`, `structuredClone()`, `JSON.parse(JSON.stringify())`

**Outros exemplos:**

```tsx
// ❌ Bad
<C users={users} active={users.filter(u => u.active)} />
<C product={product} productName={product.name} />

// ✅ Good
<C users={users} />
<C product={product} />
// Do filtering/destructuring in client
````

**Exceção:** passe dado já derivado quando a transformação para cara ou quando o cliente não precisa do original.
