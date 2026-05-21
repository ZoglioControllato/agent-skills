# Padrões de armazenamento

Padrões para persistência de dados em aplicativos React Native.

## Guia de decisão de armazenamento

| Armazenamento            | Velocidade   | Assíncrono          | Quando usar                                                          |
| ------------------------ | ------------ | ------------------- | -------------------------------------------------------------------- |
| MMKV                     | Muito rápido | Não (sincronização) | Escolha padrão. Dados de valor-chave, configurações, estado em cache |
| Loja Segura              | Médio        | Sim                 | Dados confidenciais: tokens, senhas, credenciais                     |
| Armazenamento assíncrono | Lento        | Sim                 | Aplicativos legados. Migrar                                          |

comi para MMKV quando possível |

## MMKV (armazenamento primário)

MMKV é síncrono e significativamente mais rápido que AsyncStorage.```tsx
import { MMKV } from 'react-native-mmkv'

const storage = new MMKV()

// Type-safe operations (synchronous)
storage.set('user.name', 'John')
const name = storage.getString('user.name')

storage.set('user.age', 25)
const age = storage.getNumber('user.age')

storage.set('user.premium', true)
const isPremium = storage.getBoolean('user.premium')

// JSON data
storage.set('user', JSON.stringify(user))
const user = JSON.parse(storage.getString('user') || '{}')

// Cleanup
storage.delete('user.name')
storage.clearAll()

````
### Ganchos de reação MMKV```tsx
import { useMMKVString, useMMKVNumber, useMMKVBoolean } from 'react-native-mmkv'

function Settings() {
  const [theme, setTheme] = useMMKVString('theme')
  const [fontSize, setFontSize] = useMMKVNumber('fontSize')
  const [notifications, setNotifications] = useMMKVBoolean('notifications')

  return (
    <>
      <Switch value={theme === 'dark'} onValueChange={(dark) => setTheme(dark ? 'dark' : 'light')} />
      <Slider value={fontSize} onValueChange={setFontSize} />
      <Switch value={notifications} onValueChange={setNotifications} />
    </>
  )
}
````

## Zustand com persistência MMKV```tsx

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { MMKV } from 'react-native-mmkv'

const storage = new MMKV()

const mmkvStorage = {
getItem: (name: string) => storage.getString(name) ?? null,
setItem: (name: string, value: string) => storage.set(name, value),
removeItem: (name: string) => storage.delete(name),
}

interface SettingsStore {
theme: 'light' | 'dark'
setTheme: (theme: 'light' | 'dark') => void
}

const useSettingsStore = create<SettingsStore>()(
persist(
(set) => ({
theme: 'light',
setTheme: (theme) => set({ theme }),
}),
{
name: 'settings-storage',
storage: createJSONStorage(() => mmkvStorage),
},
),
)

````
## Jotai com Persistência MMKV

O modelo atômico de Jotai funciona naturalmente com MMKV para persistência:```tsx
import { atom } from 'jotai'
import { atomWithStorage, createJSONStorage } from 'jotai/utils'
import { MMKV } from 'react-native-mmkv'

const storage = new MMKV()

const mmkvStorage = createJSONStorage<any>(() => ({
  getItem: (key: string) => storage.getString(key) ?? null,
  setItem: (key: string, value: string) => storage.set(key, value),
  removeItem: (key: string) => storage.delete(key),
}))

// Persisted atoms
const themeAtom = atomWithStorage('theme', 'light', mmkvStorage)
const fontSizeAtom = atomWithStorage('fontSize', 16, mmkvStorage)

// Derived atom (recomputes automatically)
const isDarkModeAtom = atom((get) => get(themeAtom) === 'dark')
````

```tsx
import { useAtom, useAtomValue } from 'jotai'

function Settings() {
  const [theme, setTheme] = useAtom(themeAtom)
  const isDark = useAtomValue(isDarkModeAtom)

  return <Switch value={isDark} onValueChange={(dark) => setTheme(dark ? 'dark' : 'light')} />
}
```

## SecureStore (dados confidenciais)

Use `expo-secure-store` para tokens, senhas e credenciais. Os dados são criptografados usando o keychain/keystore do dispositivo.```tsx
import \* as SecureStore from 'expo-secure-store'

// Store sensitive data
await SecureStore.setItemAsync('auth_token', token)

// Retrieve
const token = await SecureStore.getItemAsync('auth_token')

// Delete
await SecureStore.deleteItemAsync('auth_token')

````
### Gancho de token de autenticação```tsx
import { useState, useEffect, useCallback } from 'react'
import * as SecureStore from 'expo-secure-store'

function useAuthToken() {
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    SecureStore.getItemAsync('auth_token')
      .then(setToken)
      .finally(() => setLoading(false))
  }, [])

  const saveToken = useCallback(async (newToken: string) => {
    await SecureStore.setItemAsync('auth_token', newToken)
    setToken(newToken)
  }, [])

  const clearToken = useCallback(async () => {
    await SecureStore.deleteItemAsync('auth_token')
    setToken(null)
  }, [])

  return { token, loading, saveToken, clearToken }
}
````

## Consulta TanStack com Persistência```tsx

import { QueryClient } from '@tanstack/react-query'
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister'
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import { MMKV } from 'react-native-mmkv'

const storage = new MMKV({ id: 'query-cache' })

const queryClient = new QueryClient({
defaultOptions: {
queries: {
gcTime: 1000 _ 60 _ 60 \* 24, // 24 hours
},
},
})

const persister = createSyncStoragePersister({
storage: {
getItem: (key: string) => storage.getString(key) ?? null,
setItem: (key: string, value: string) => storage.set(key, value),
removeItem: (key: string) => storage.delete(key),
},
})

function App() {
return (
<PersistQueryClientProvider client={queryClient} persistOptions={{ persister }}>
<Navigation />
</PersistQueryClientProvider>
)
}

```
## Referência rápida

| Gancho/API | Devoluções | Armazenamento |
| ---------------------------- | ------------------------- | ----------------- |
| `useMMKVString()` | `[valor, setValue]` | MMKV |
| `useMMKVNumber()` | `[valor, setValue]` | MMKV |
| `useMMKVBoolean()` | `[valor, setValue]` | MMKV |
| `SecureStore.getItemAsync()` | `Promessa<str

sendo \| nulo>` | Chaveiro/Keystore |
| `atomWithStorage()` | Átomo Jotai | Configurável |
| `zustand/persistir` | Middleware Zustand | Configurável |
```
