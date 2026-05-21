# Regras de desempenho

Regras de desempenho abrangentes para aplicativos React Native, priorizadas por impacto. Cada regra inclui exemplos de código incorretos e corretos.

**Nota do React Compiler:** Ao usar o React Compiler (React 19+), manuais `memo()`, `useCallback()` e `useMemo()` são tratados automaticamente. No entanto, a estabilidade de referência de objetos ainda é importante para listas virtualizadas.

---

## Índice

1. [Renderização de núcleo (CRÍTICO)](Renderização de núcleo nº 1)
2. [Desempenho da lista (ALTO)](#2-desempenho da lista)
3. [Animação (ALTA)](#3-animação)
4. [Desempenho de rolagem (ALTO)](#4-desempenho de rolagem)
5. [Navegação (ALTA)](#5-navegação)
6. [Estado de reação (MÉDIO)](#6-estado de reação)
7. [Arquitetura de Estado (MÉDIO)](#7-arquitetura de estado)
8. [Compilador React (MÉDIO)](#8-compilador react)
9. [Interface do usuário (MÉDIO)](#9-interface do usuário)
10. [Sistema de Design (MÉDIO)]

(#10-sistema de design) 11. [Monorepo (BAIXO)](#11-monorepo) 12. [Configuração (BAIXA)](#12-configuração)

---

## 1. Renderização principal

**Impacto: CRÍTICO — violações causam falhas no tempo de execução.**

### 1.1 Nunca use && com valores potencialmente falsos

O React Native trava se `0` ou `""` for renderizado fora de `<Text>`.```tsx
// CRASH: if count is 0
{
count && <Text>{count} items</Text>
}

// SAFE: ternary
{
count ? <Text>{count} items</Text> : null
}

// SAFE: boolean coercion
{
!!count && <Text>{count} items</Text>
}

// BEST: early return
if (!name) return null

````

**Lint:** Habilite `react/jsx-no-leaked-render` em eslint-plugin-react.

### 1.2 Quebrar strings em componentes de texto

As strings devem estar dentro de `<Text>`. Filhos diretos da falha `<View>`.```tsx
// CRASH
<View>Hello, {name}!</View>

// CORRECT
<View><Text>Hello, {name}!</Text></View>
````

---

## 2. Desempenho da lista

**Impacto: ALTO — afeta a suavidade da rolagem e a memória.**

### 2.1 Sempre use um virtualizador

Use LegendList (preferencial) ou FlashList. Nunca use ScrollView com `.map()`.```tsx
// WRONG: renders all items upfront
;<ScrollView>
{items.map((item) => (
<ItemCard key={item.id} item={item} />
))}
</ScrollView>

// CORRECT: only renders visible items
import { LegendList } from '@legendapp/list'

;<LegendList
data={items}
renderItem={({ item }) => <ItemCard item={item} />}
keyExtractor={(item) => item.id}
estimatedItemSize={80}
/>

````
### 2.2 Mantenha os itens da lista leves

Sem consultas, sem cálculos caros, sem acesso ao contexto dentro dos itens da lista. Passe primitivas pré-computadas.```tsx
// WRONG: heavy list item
function ProductRow({ id }: { id: string }) {
  const { data } = useQuery(['product', id], () => fetchProduct(id))
  const theme = useContext(ThemeContext)
  return <View>{/* ... */}</View>
}

// CORRECT: lightweight, receives primitives
function ProductRow({ name, price, imageUrl }: Props) {
  return (
    <View>
      <Image source={{ uri: imageUrl }} />
      <Text>{name}</Text>
      <Text>{price}</Text>
    </View>
  )
}
````

Use seletores Zustand em vez de Contexto quando precisar de estado compartilhado em itens de lista:```tsx
// Zustand selector: only re-renders when this specific value changes
const inCart = useCartStore((s) => s.items.has(id))

````
### 2.3 Evite objetos embutidos em renderItem

Objetos embutidos criam novas referências em cada renderização, quebrando a memorização. Passe o item diretamente ou passe primitivos.```tsx
// WRONG: new object every render
<UserRow user={{ id: item.id, name: item.name }} />
<UserRow style={{ backgroundColor: item.isActive ? 'green' : 'gray' }} />

// CORRECT: pass item directly or primitives
<UserRow user={item} />
<UserRow id={item.id} name={item.name} isActive={item.isActive} />
````

### 2.4 Manter referências de objetos estáveis

Não faça `.map()` ou `.filter()` dados antes de passar para listas virtualizadas. Transforme itens internos usando seletores Zustand.```tsx
// WRONG: creates new references on every keystroke
const domains = tlds.map(tld => ({
  domain: `${keyword}.${tld.name}`,
tld: tld.name,
}))
<LegendList data={domains} ... />

// CORRECT: pass stable data, transform inside item
<LegendList data={tlds} renderItem={({ item }) => <DomainItem tld={item} />} />

function DomainItem({ tld }: { tld: Tld }) {
const domain = useKeywordStore(s => s.keyword + '.' + tld.name)
return <Text>{domain}</Text>
}

````
### 2.5 Pass Primitivos para Memoização

Adereços primitivos (strings, números, booleanos) permitem comparações superficiais em `memo()`.```tsx
// LESS OPTIMAL: object prop requires reference comparison
<UserRow user={item} />

// OPTIMAL: primitive props enable shallow comparison
<UserRow id={item.id} name={item.name} email={item.email} />
````

### 2.6 Elevar retornos de chamada para a raiz da lista

Crie uma única instância de retorno de chamada na raiz da lista. Os itens o chamam com um identificador.```tsx
// WRONG: new callback per render
renderItem={({ item }) => {
const onPress = () => handlePress(item.id)
return <Item item={item} onPress={onPress} />
}}

// CORRECT: pass ID, handle in child
<Item id={item.id} name={item.name} />

const Item = memo(function Item({ id, name }: Props) {
const handlePress = useCallback(() => { /_ use id _/ }, [id])
return <Pressable onPress={handlePress}><Text>{name}</Text></Pressable>
})

````
### 2.7 Use tipos de itens para listas heterogêneas

Use `getItemType` para listas com diferentes layouts de itens para permitir uma reciclagem eficiente.```tsx
type FeedItem =
  | { id: string; type: 'header'; title: string }
  | { id: string; type: 'message'; text: string }
  | { id: string; type: 'image'; url: string }

;<LegendList
  data={items}
  getItemType={(item) => item.type}
  getEstimatedItemSize={(_, __, itemType) => {
    switch (itemType) {
      case 'header':
        return 48
      case 'message':
        return 72
      case 'image':
        return 300
      default:
        return 72
    }
  }}
  renderItem={({ item }) => {
    switch (item.type) {
      case 'header':
        return <SectionHeader title={item.title} />
      case 'message':
        return <MessageRow text={item.text} />
      case 'image':
        return <ImageRow url={item.url} />
    }
  }}
  recycleItems
/>
````

### 2.8 Use imagens compactadas em listas

Solicite imagens de tamanho adequado. Use tamanho de exibição 2x para retina.```tsx
// WRONG: 4000x3000 image for a 100x100 thumbnail
<Image source={{ uri: product.imageUrl }} style={{ width: 100, height: 100 }} />

// CORRECT: request 200x200 (2x retina)
const thumbnailUrl = `${product.imageUrl}?w=200&h=200&fit=cover`
<Image source={{ uri: thumbnailUrl }} contentFit="cover" style={{ width: 100, height: 100 }} />

````
---

## 3. Animação

**Impacto: ALTO — afeta a taxa de quadros e a suavidade.**

### 3.1 Animar apenas transformação e opacidade

Nunca anime propriedades de layout (`width`, `height`, `top`, `left`, `margin`, `padding`). Eles acionam o recálculo do layout em cada quadro.```tsx
// WRONG: animates height
useAnimatedStyle(() => ({
  height: withTiming(expanded ? 200 : 0),
}))

// CORRECT: animates transform (GPU-accelerated)
useAnimatedStyle(() => ({
  transform: [{ scaleY: withTiming(expanded ? 1 : 0) }],
  opacity: withTiming(expanded ? 1 : 0),
}))
````

### 3.2 Use useDerivedValue para animações computadas

Use `useDerivedValue` para derivar um valor compartilhado de outro. Reserve `useAnimatedReaction` apenas para efeitos colaterais.```tsx
// WRONG: useAnimatedReaction for derivation
useAnimatedReaction(
() => progress.get(),
(current) => {
opacity.set(1 - current)
},
)

// CORRECT: useDerivedValue
const opacity = useDerivedValue(() => 1 - progress.get())

````
### 3.3 Use GestureDetector para estados de imprensa animados

Os retornos de chamada do GestureDetector são executados no thread da UI. Retornos de chamada pressionáveis ​​são executados no thread JS.```tsx
// CORRECT: UI thread press animation
const pressed = useSharedValue(0)

const tap = Gesture.Tap()
  .onBegin(() => pressed.set(withTiming(1)))
  .onFinalize(() => pressed.set(withTiming(0)))
  .onEnd(() => runOnJS(onPress)())

const animatedStyle = useAnimatedStyle(() => ({
  transform: [{ scale: interpolate(pressed.get(), [0, 1], [1, 0.95]) }],
}))

<GestureDetector gesture={tap}>
  <Animated.View style={animatedStyle}>{children}</Animated.View>
</GestureDetector>
````

---

## 4. Desempenho de rolagem

**Impacto: ALTO — evita desgaste na renderização.**

### 4.1 Nunca rastreie a posição de rolagem em useState

Use o valor compartilhado reanimado ou uma referência.```tsx
// WRONG: re-renders on every frame
const [scrollY, setScrollY] = useState(0)
const onScroll = e => setScrollY(e.nativeEvent.contentOffset.y)

// CORRECT: Reanimated (for animations)
const scrollY = useSharedValue(0)
const onScroll = useAnimatedScrollHandler({
onScroll: e => { scrollY.value = e.contentOffset.y },
})
<Animated.ScrollView onScroll={onScroll} scrollEventThrottle={16} />

// CORRECT: ref (for non-reactive tracking)
const scrollY = useRef(0)
const onScroll = e => { scrollY.current = e.nativeEvent.contentOffset.y }

````
---

## 5. Navegação

**Impacto: ALTO — afeta transições, gestos e sensação de plataforma.**

### 5.1 Use navegadores nativos

- **Pilhas:** `@react-navigation/native-stack` ou Expo Router `<Stack>` (nativo por padrão)
- **Guias:** `react-native-bottom-tabs` ou Expo Router `<NativeTabs>`
- **Nunca:** `@react-navigation/stack` (baseado em JS) ou `@react-navigation/bottom-tabs`

### 5.2 Use cabeçalhos nativos

Prefira opções de cabeçalho nativo em vez de componentes de cabeçalho personalizados - eles suportam títulos grandes do iOS, barras de pesquisa, efeitos de desfoque e manuseio adequado de áreas seguras.```tsx
// WRONG: custom header
options={{ header: () => <CustomHeader title="Profile" /> }}

// CORRECT: native header
options={{
  title: 'Profile',
  headerLargeTitleEnabled: true,
  headerSearchBarOptions: { placeholder: 'Search' },
}}
````

---

## 6. Estado de reação

**Impacto: MÉDIO — evita fechamentos obsoletos e novas renderizações desnecessárias.**

### 6.1 Minimizar estado, derivar valores```tsx

// WRONG: redundant state
const [total, setTotal] = useState(0)
useEffect(() => setTotal(items.reduce((s, i) => s + i.price, 0)), [items])

// CORRECT: derived during render
const total = items.reduce((s, i) => s + i.price, 0)

````
### 6.2 Usar padrão substituto para padrões reativos```tsx
// WRONG: loses reactivity when defaultEnabled changes
const [enabled, setEnabled] = useState(defaultEnabled)

// CORRECT: undefined = user hasn't chosen yet
const [_enabled, setEnabled] = useState<boolean | undefined>(undefined)
const enabled = _enabled ?? defaultEnabled
````

### 6.3 Usar atualizadores de despacho

Quando o próximo estado depende do estado atual:```tsx
// WRONG: may be stale
setCount(count + 1)

// CORRECT: always latest value
setCount((prev) => prev + 1)

````
---

## 7. Arquitetura do Estado

**Impacto: MÉDIO — fonte única de verdade.**

### 7.1 O estado deve representar a verdade fundamental

Armazene o estado (`pressionado`, `isOpen`), derive o visual (`escala`, `opacidade`):```tsx
// WRONG: storing visual output
const scale = useSharedValue(1)
tap.onBegin(() => scale.set(withTiming(0.95)))

// CORRECT: storing state, deriving visual
const pressed = useSharedValue(0)
tap.onBegin(() => pressed.set(withTiming(1)))

const animatedStyle = useAnimatedStyle(() => ({
  transform: [{ scale: interpolate(pressed.get(), [0, 1], [1, 0.95]) }],
}))
````

---

## 8. Compilador React

**Impacto: MÉDIO — padrões de compatibilidade.**

### 8.1 Desestruturar funções antecipadamente

Funções desestruturadas são referências estáveis. Pontilhar objetos cria novas referências.```tsx
// WRONG: unstable references
const router = useRouter()
const handlePress = () => {
props.onSave()
router.push('/success')
}

// CORRECT: stable references
const { push } = useRouter()
const { onSave } = props
const handlePress = () => {
onSave()
push('/success')
}

````
### 8.2 Use .get() e .set() para valores compartilhados

Necessário para compatibilidade do React Compiler:```tsx
// WRONG: opts out of compiler
count.value = count.value + 1

// CORRECT: compiler compatible
count.set(count.get() + 1)
````

---

## 9. Interface do usuário

**Impacto: MÉDIO — aparência nativa.**

### 9.1 Padrões de estilo moderno```tsx

// Use gap for spacing between children (not margin)
<View style={{ gap: 8 }}><Text>A</Text><Text>B</Text></View>

// Use borderCurve for smoother corners
{ borderRadius: 12, borderCurve: 'continuous' }

// Use CSS boxShadow (not legacy shadow objects or elevation)
{ boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }

// Use native gradients (not third-party libraries)
{ experimental_backgroundImage: 'linear-gradient(to bottom, #000, #fff)' }

````
### 9.2 Use imagem expo

Sempre use `expo-image` em vez de `Image` do React Native:```tsx
import { Image } from 'expo-image'

;<Image
  source={{ uri: url }}
  placeholder={{ blurhash: 'LGF5]+Yk^6#M@-5c,1J5@[or[Q6.' }}
  contentFit="cover"
  transition={200}
  cachePolicy="memory-disk"
/>
````

### 9.3 Use pressionável (nunca tocável)```tsx

// WRONG
import { TouchableOpacity } from 'react-native'

// CORRECT
import { Pressable } from 'react-native'
// or for lists:
import { Pressable } from 'react-native-gesture-handler'

````
### 9.4 Use modais nativos```tsx
// WRONG: JS bottom sheet library
<BottomSheet ref={sheetRef} snapPoints={['50%', '90%']}>

// CORRECT: native Modal
<Modal presentationStyle="formSheet" animationType="slide"
  onRequestClose={() => setVisible(false)}>

// CORRECT: React Navigation v7 form sheet
<Stack.Screen name="Details" options={{
  presentation: 'formSheet',
  sheetAllowedDetents: 'fitToContents',
}} />
````

### 9.5 Use menus nativos (zeego)```tsx

import \* as DropdownMenu from 'zeego/dropdown-menu'

;<DropdownMenu.Root>
<DropdownMenu.Trigger>
<Pressable>
<Text>Options</Text>
</Pressable>
</DropdownMenu.Trigger>
<DropdownMenu.Content>
<DropdownMenu.Item key="edit" onSelect={() => console.log('edit')}>
<DropdownMenu.ItemTitle>Edit</DropdownMenu.ItemTitle>
</DropdownMenu.Item>
</DropdownMenu.Content>
</DropdownMenu.Root>

````
### 9.6 Áreas Seguras

Use `contentInsetAdjustmentBehavior="automatic"` em ScrollViews em vez de agrupar em SafeAreaView:```tsx
// CORRECT
<ScrollView contentInsetAdjustmentBehavior="automatic">{children}</ScrollView>
````

### 9.7 Medindo Visualizações

Use `useLayoutEffect` com `getBoundingClientRect()` para medição síncrona, mais `onLayout` para atualizações:```tsx
const ref = useRef<View>(null)
const [size, setSize] = useState<Size | undefined>(undefined)

useLayoutEffect(() => {
const rect = ref.current?.getBoundingClientRect()
if (rect) setSize({ width: rect.width, height: rect.height })
}, [])

const onLayout = (e: LayoutChangeEvent) => {
const { width, height } = e.nativeEvent.layout
setSize((prev) => {
if (prev?.width === width && prev?.height === height) return prev
return { width, height }
})
}

````
### 9.8 Use Galeria para galerias de imagens```tsx
import { Galeria } from '@nandorojo/galeria'
import { Image } from 'expo-image'

;<Galeria urls={urls}>
  {urls.map((url, index) => (
    <Galeria.Image index={index} key={url}>
      <Image source={{ uri: url }} style={styles.thumbnail} />
    </Galeria.Image>
  ))}
</Galeria>
````

### 9.9 Use contentInset para espaçamento dinâmico```tsx

// WRONG: padding triggers layout recalculation
<ScrollView contentContainerStyle={{ paddingBottom: offset }}>

// CORRECT: contentInset adjusts scroll bounds only
<ScrollView
contentInset={{ bottom: offset }}
scrollIndicatorInsets={{ bottom: offset }}

>

````
---

## 10. Sistema de Design

**Impacto: MÉDIO — arquitetura de componentes de fácil manutenção.**

### 10.1 Usar componentes compostos```tsx
// WRONG: polymorphic children
<Button icon={<Icon />}>Save</Button>

// CORRECT: compound components
<Button>
  <ButtonIcon><SaveIcon /></ButtonIcon>
  <ButtonText>Save</ButtonText>
</Button>
````

### 10.2 Importar da pasta Design System

Exporte novamente as dependências de uma pasta do sistema de design para facilitar a refatoração:```tsx
// WRONG: direct import
import { View, Text } from 'react-native'

// CORRECT: design system wrapper
import { View } from '@/components/view'
import { Text } from '@/components/text'

````
---

## 11. Monorepo

**Impacto: BAIXO — mas crítico quando aplicável.**

### 11.1 Dependências nativas no App Directory

A vinculação automática verifica apenas os `node_modules` do aplicativo. As dependências nativas devem ser listadas no `package.json` do aplicativo, mesmo que um pacote compartilhado também as utilize.

### 11.2 Versões de dependência única

Use versões exatas (`3.16.1` e não `^3.0.0`) em todos os pacotes. Use substituições de syncpack ou pnpm para aplicar.

---

## 12. Configuração

**Impacto: BAIXO — melhorias incrementais.**

### 12.1 Carregar fontes em tempo de construção

Use o plugin de configuração `expo-font` em vez de `useFonts`/`Font.loadAsync`. As fontes estão disponíveis imediatamente no lançamento.

### 12.2 Formatadores Hoist Intl```tsx
// WRONG: new formatter every render
function Price({ amount }: { amount: number }) {
  const fmt = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })
  return <Text>{fmt.format(amount)}</Text>
}

// CORRECT: module-level
const currencyFmt = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })
function Price({ amount }: { amount: number }) {
  return <Text>{currencyFmt.format(amount)}</Text>
}
````

---

## Referências

1. [Reagir Nativo](https://reactnative.dev)
2. [Expo](https://docs.expo.dev)
3. [Reanimado](https://docs.swmansion.com/react-native-reanimated)
4. [Manipulador de gestos](https://docs.swmansion.com/react-native-gesture-handler)
5. [LegendList](https://legendapp.com/open-source/legend-list)
6. [Galeria](https://github.com/nandorojo/galeria)
7. [Zeego](https://zeego.dev)
8. [Compilador React](https://react.dev/learn/react-compiler)
