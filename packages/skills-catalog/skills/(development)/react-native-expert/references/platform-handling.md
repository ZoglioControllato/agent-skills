# Manuseio de plataforma

Padrões para escrever código específico da plataforma em iOS e Android.

## Plataforma.select```tsx

import { Platform, StyleSheet } from 'react-native'

const styles = StyleSheet.create({
card: {
padding: 16,
borderRadius: 12,
borderCurve: 'continuous',
backgroundColor: '#fff',
// Modern: use CSS boxShadow (works cross-platform in RN 0.79+)
boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
},
text: {
fontFamily: Platform.select({
ios: 'SF Pro',
android: 'Roboto',
}),
},
})

````

**Observação:** Com RN 0.79+, CSS `boxShadow` funciona em várias plataformas. Use-o em vez dos padrões legados `shadowColor`/`elevation`.

## Plataforma.OS```tsx
import { Platform } from 'react-native'

function MyComponent() {
  const isIOS = Platform.OS === 'ios'

  return (
    <View>
      {isIOS ? <IOSOnlyComponent /> : null}
      <Text>{Platform.OS}</Text>
    </View>
  )
}
````

## Arquivos específicos da plataforma```

components/
├── Button.tsx # Shared logic
├── Button.ios.tsx # iOS-specific
└── Button.android.tsx # Android-specific

````

```tsx
// Import resolves to the correct platform file automatically
import Button from './components/Button'
````

## SafeAreaView```tsx

import { SafeAreaProvider, initialWindowMetrics } from 'react-native-safe-area-context'

// Root: wrap app with provider (use initialWindowMetrics for faster initial render)
function App() {
return (
<SafeAreaProvider initialMetrics={initialWindowMetrics}>
<Navigation />
</SafeAreaProvider>
)
}

````

**Para ScrollViews**, use `contentInsetAdjustmentBehavior` em vez do wrapper SafeAreaView:```tsx
<ScrollView contentInsetAdjustmentBehavior="automatic">{children}</ScrollView>
````

**Para cabeçalhos personalizados ou telas não roláveis**, use o gancho:```tsx
import { useSafeAreaInsets } from 'react-native-safe-area-context'

function CustomHeader() {
const insets = useSafeAreaInsets()

return (
<View style={{ paddingTop: insets.top }}>
<Text>Header</Text>
</View>
)
}

````
## KeyboardAvoidingView```tsx
import { KeyboardAvoidingView, Platform } from 'react-native'

function FormScreen() {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.select({ ios: 88, android: 0 })}
    >
      <ScrollView>
        <TextInput placeholder="Name" />
        <TextInput placeholder="Email" />
      </ScrollView>
    </KeyboardAvoidingView>
  )
}
````

## Barra de status```tsx

import { StatusBar } from 'react-native'

function Screen() {
return (
<>
<StatusBar barStyle="dark-content" />
<Content />
</>
)
}

````
## Botão Voltar do Android```tsx
import { useEffect } from 'react'
import { BackHandler, Platform } from 'react-native'

function useBackHandler(handler: () => boolean) {
  useEffect(() => {
    if (Platform.OS !== 'android') return

    const subscription = BackHandler.addEventListener('hardwareBackPress', handler)

    return () => subscription.remove()
  }, [handler])
}

// Usage
function Screen() {
  useBackHandler(() => {
    if (hasUnsavedChanges) {
      showDiscardAlert()
      return true // Prevent default back
    }
    return false // Allow default back
  })
}
````

## Referência rápida

| API                         | Finalidade                              |
| --------------------------- | --------------------------------------- |
| `Plataforma.OS`             | Obter plataforma ('ios' / 'android')    |
| `Plataforma.select()`       | Valores específicos da plataforma       |
| `Plataforma.Versão`         | Número da versão do sistema operacional |
| `.ios.tsx` / `.android.tsx` | Arquivos específicos da plataforma      |

| Componente                       | Finalidade                          |
| -------------------------------- | ----------------------------------- |
| `SafeAreaProvider`               | Fornece inserções de área segura    |
| `useSafeAreaInsets()`            | Acesse inserções de área segura     |
| `contentInsetAdjustmentBehavior` | Área segura nativa para ScrollViews |
| `KeyboardAvoidingView`           | Manuseio do teclado                 |

| `Barra de Status`

| Estilo da barra de status |
| `BackHandler` | Botão Voltar do Android |
