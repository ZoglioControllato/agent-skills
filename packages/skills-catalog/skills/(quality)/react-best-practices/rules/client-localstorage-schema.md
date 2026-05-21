---
title: Versão e minimização de dados no localStorage
impact: MEDIUM
impactDescription: evita conflitos de esquema e redução de tamanho
tags: client, localStorage, storage, versioning, data-minimization
---

## Versão e minimização de dados no localStorage

Adicione prefixo de versão às chaves e armazene apenas os campos necessários. Isso evita conflitos de esquema e armazenamento acidental de dados sensíveis.

**Incorreto:**

```typescript
// No version, stores everything, no error handling
localStorage.setItem('userConfig', JSON.stringify(fullUserObject))
const data = localStorage.getItem('userConfig')
```

**Correto:**

```typescript
const VERSION = 'v2'

function saveConfig(config: { theme: string; language: string }) {
  try {
    localStorage.setItem(`userConfig:${VERSION}`, JSON.stringify(config))
  } catch {
    // Throws in incognito/private browsing, quota exceeded, or disabled
  }
}

function loadConfig() {
  try {
    const data = localStorage.getItem(`userConfig:${VERSION}`)
    return data ? JSON.parse(data) : null
  } catch {
    return null
  }
}

// Migration from v1 to v2
function migrate() {
  try {
    const v1 = localStorage.getItem('userConfig:v1')
    if (v1) {
      const old = JSON.parse(v1)
      saveConfig({ theme: old.darkMode ? 'dark' : 'light', language: old.lang })
      localStorage.removeItem('userConfig:v1')
    }
  } catch {}
}
```

**Armazene o mínimo de campos das respostas do servidor:**

```typescript
// User object has 20+ fields, only store what UI needs
function cachePrefs(user: FullUser) {
  try {
    localStorage.setItem(
      'prefs:v1',
      JSON.stringify({
        theme: user.preferences.theme,
        notifications: user.preferences.notifications,
      }),
    )
  } catch {}
}
```

**Sempre use try/catch:** `getItem()` e `setItem()` podem lançar em janela anônima/privada (Safari, Firefox), quando a cota é excedida ou quando o armazenamento está desativado.

**Benefícios:** evolução de esquema via versionamento, menor uso de armazenamento e menos risco de guardar tokens/PII/flags internacionais.
