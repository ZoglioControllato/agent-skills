---
title: Reduza a serialização na fronteira servidor/cliente (RSC)
impact: HIGH
impactDescription: reduz a quantidade de dados transferidos
tags: server, rsc, serialization, props
---

## Reduza a serialização na fronteira servidor/cliente (RSC)

Na fronteira servidor/cliente React, todas as propriedades do objeto passado são serializadas para string e incorporadas ao HTML e aos payloads RSC. Essa carga impacta diretamente o peso da página e o tempo de carregamento; **o volume importa de verdade**. Passe apenas os campos que o cliente usa de fato.

**Incorreto (serializa todos os ~50 campos):**

```tsx
async function Page() {
  const user = await fetchUser() // 50 fields
  return <Profile user={user} />
}

;('use client')
function Profile({ user }: { user: User }) {
  return <div>{user.name}</div> // uses 1 field
}
```

**Correto (serializado apenas 1 campo):**

```tsx
async function Page() {
  const user = await fetchUser()
  return <Profile name={user.name} />
}

;('use client')
function Profile({ name }: { name: string }) {
  return <div>{name}</div>
}
```
