# Roteador Expo

Padrões para Expo Router 4+ (SDK 53+) com roteamento baseado em arquivo, navegadores nativos e rotas digitadas.

## Estrutura do Projeto```

app/
├── \_layout.tsx # Root layout (Stack)
├── index.tsx # Home (/)
├── +not-found.tsx # 404 page
├── (tabs)/ # Tab group
│ ├── \_layout.tsx # Tab bar config (NativeTabs)
│ ├── index.tsx # First tab
│ └── profile.tsx # Profile tab
├── (auth)/ # Auth group (no tabs)
│ ├── \_layout.tsx
│ ├── login.tsx
│ └── register.tsx
├── settings/
│ ├── \_layout.tsx # Nested stack
│ ├── index.tsx # Settings main
│ └── notifications.tsx
└── details/[id].tsx # Dynamic route

````
## Layout raiz```tsx
// app/_layout.tsx
import { Stack } from 'expo-router'
import { ThemeProvider, DarkTheme, DefaultTheme } from '@react-navigation/native'
import { useColorScheme } from 'react-native'

export default function RootLayout() {
  const colorScheme = useColorScheme()

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="details/[id]" options={{ presentation: 'modal' }} />
      </Stack>
    </ThemeProvider>
  )
}
````

## Guias nativas (SDK 53+)```tsx

// app/(tabs)/\_layout.tsx
import { NativeTabs, Label } from 'expo-router/unstable-native-tabs'

export default function TabLayout() {
return (
<NativeTabs minimizeBehavior="onScrollDown">
<NativeTabs.Trigger name="index">
<Label>Home</Label>
<NativeTabs.Trigger.Icon sf="house.fill" md="home" />
</NativeTabs.Trigger>
<NativeTabs.Trigger name="profile">
<Label>Profile</Label>
<NativeTabs.Trigger.Icon sf="person.fill" md="person" />
</NativeTabs.Trigger>
</NativeTabs>
)
}

````
No iOS, as guias nativas ativam automaticamente `contentInsetAdjustmentBehavior` no primeiro ScrollView na raiz de cada tela da guia.

## Guias JS (substituto)

Se você precisar de mais personalização do que o NativeTabs oferece:```tsx
// app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: '#007AFF' }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <Ionicons name="home" color={color} size={size} />,
        }}
      />
    </Tabs>
  )
}
````

## Navegação```tsx

import { router, useLocalSearchParams, Link } from 'expo-router'

// Programmatic
router.push('/details/123')
router.replace('/home')
router.back()
router.canGoBack()
router.dismissAll()

// With params
router.push({
pathname: '/details/[id]',
params: { id: '123', title: 'Item' },
})

// Link component (with prefetch for faster navigation)

<Link href="/profile" prefetch asChild>
  <Pressable>
    <Text>Go to Profile</Text>
  </Pressable>
</Link>

// Reading params
function DetailsScreen() {
const { id, title } = useLocalSearchParams<{ id: string; title?: string }>()
return <Text>Details for {id}</Text>
}

````
## Rotas Protegidas```tsx
// app/(auth)/_layout.tsx
import { Redirect, Stack } from 'expo-router'
import { useAuth } from '@/hooks/useAuth'

export default function AuthLayout() {
  const { user, isLoading } = useAuth()

  if (isLoading) return <LoadingScreen />
  if (user) return <Redirect href="/(tabs)" />

  return <Stack screenOptions={{ headerShown: false }} />
}

// app/(tabs)/_layout.tsx
export default function TabLayout() {
  const { user, isLoading } = useAuth()

  if (isLoading) return <LoadingScreen />
  if (!user) return <Redirect href="/(auth)/login" />

  return <NativeTabs>...</NativeTabs>
}
````

## Folhas de formulário nativas```tsx

// app/\_layout.tsx
<Stack.Screen
name="details/[id]"
options={{
    presentation: 'formSheet',
    sheetAllowedDetents: 'fitToContents',
  }}
/>

````
## Links profundos```json
// app.json
{
  "expo": {
    "scheme": "myapp",
    "plugins": [
      [
        "expo-router",
        {
          "origin": "https://acme.com",
          "asyncRoutes": {
            "web": true,
            "default": "development"
          }
        }
      ]
    ]
  }
}
````

Rotas dinâmicas lidam com links diretos automaticamente: `myapp://details/123` → `app/details/[id].tsx`

## Rotas assíncronas (divisão de pacotes)

Habilite rotas assíncronas para divisão de pacotes de produção:```json
// app.json
{
"expo": {
"plugins": [
[
"expo-router",
{
"asyncRoutes": {
"web": true,
"default": "development"
}
}
]
]
}
}

```
## Referência rápida

| Componente | Finalidade |
| -------------- | ------------------------------ |
| `<Pilha>` | Navegador de pilha nativo |
| `<Guias>` | Navegador de guias JS |
| `<NativeTabs>` | Navegador de guias nativo (SDK 53+) |
| `<Gaveta>` | Navegador de gaveta |
| `<Link>` | Navegação declarativa |
| `<Redirecionar>` | Redirecionamento de rota |

| método roteador | Comportamento |
| -------------- | -------------------- |
| `push()` | Adicionar à pilha |
| `substituir()` | Substituir atual |
| `voltar()` | Volte |
| `dismissAll()` | Dispensar todos os modais |
| `canGoBack()` | Verifique se pode voltar |
```
