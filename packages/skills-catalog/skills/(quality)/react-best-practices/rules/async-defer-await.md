---
title: Adiar await até onde for realmente necessário
impact: HIGH
impactDescription: evita bloquear caminhos de código não usados
tags: async, await, conditional, optimization
---

## Adiar await até onde for realmente necessário

Coloque operações `await` só nos ramos em que são de fato usadas, para não bloquear caminhos que não precisam do resultado.

**Incorreto (bloqueia os dois ramos):**

```typescript
async function handleRequest(userId: string, skipProcessing: boolean) {
  const userData = await fetchUserData(userId)

  if (skipProcessing) {
    // Retorna na hora, mas ainda esperou userData
    return { skipped: true }
  }

  // Só este ramo usa userData
  return processUserData(userData)
}
```

**Correto (bloqueia só quando necessário):**

```typescript
async function handleRequest(userId: string, skipProcessing: boolean) {
  if (skipProcessing) {
    // Retorna imediatamente sem esperar
    return { skipped: true }
  }

  // Fetch só quando necessário
  const userData = await fetchUserData(userId)
  return processUserData(userData)
}
```

**Outro exemplo (otimização com retorno antecipado):**

```typescript
// Incorreto: sempre busca permissões primeiro
async function updateResource(resourceId: string, userId: string) {
  const permissions = await fetchPermissions(userId)
  const resource = await getResource(resourceId)

  if (!resource) {
    return { error: 'Not found' }
  }

  if (!permissions.canEdit) {
    return { error: 'Forbidden' }
  }

  return await updateResourceData(resource, permissions)
}

// Correto: busca só quando faz sentido
async function updateResource(resourceId: string, userId: string) {
  const resource = await getResource(resourceId)

  if (!resource) {
    return { error: 'Not found' }
  }

  const permissions = await fetchPermissions(userId)

  if (!permissions.canEdit) {
    return { error: 'Forbidden' }
  }

  return await updateResourceData(resource, permissions)
}
```

Essa otimização vale especialmente quando o ramo ignorado é comum ou quando o trabalho adiado é custoso.
