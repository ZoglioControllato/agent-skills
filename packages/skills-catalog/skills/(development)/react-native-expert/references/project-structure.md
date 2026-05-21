# Estrutura do Projeto

## Layout do projeto do roteador Expo```

my-app/
├── app/ # File-based routing (Expo Router)
│ ├── \_layout.tsx # Root layout
│ ├── index.tsx # Home screen
│ ├── +not-found.tsx # 404 screen
│ ├── (tabs)/ # Tab navigator group
│ │ ├── \_layout.tsx
│ │ ├── index.tsx
│ │ ├── search.tsx
│ │ └── profile.tsx
│ ├── (auth)/ # Auth screens (no tabs)
│ │ ├── \_layout.tsx
│ │ ├── login.tsx
│ │ └── register.tsx
│ └── [id].tsx # Dynamic route
├── components/
│ ├── ui/ # Reusable UI components
│ │ ├── Button.tsx
│ │ ├── Card.tsx
│ │ └── Input.tsx
│ └── features/ # Feature-specific components
│ ├── ProductCard.tsx
│ └── UserAvatar.tsx
├── hooks/
│ ├── useAuth.ts
│ ├── useStorage.ts
│ └── useApi.ts
├── services/
│ ├── api.ts # API client (axios/ky)
│ └── auth.ts # Auth service
├── stores/
│ ├── useUserStore.ts # Zustand stores
│ └── atoms/ # Jotai atoms (if using Jotai)
│ └── userAtoms.ts
├── constants/
│ ├── colors.ts
│ └── layout.ts
├── types/
│ └── index.ts
├── utils/
│ └── helpers.ts
├── assets/
│ ├── images/
│ └── fonts/
├── app.json
└── tsconfig.json

````
## configuração do app.json```json
{
  "expo": {
    "name": "My App",
    "slug": "my-app",
    "version": "1.0.0",
    "scheme": "myapp",
    "orientation": "portrait",
    "newArchEnabled": true,
    "icon": "./assets/images/icon.png",
    "splash": {
      "image": "./assets/images/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.company.myapp"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/images/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      },
      "package": "com.company.myapp"
    },
    "plugins": [
      [
        "expo-router",
        {
          "origin": "https://myapp.com",
          "asyncRoutes": {
            "web": true,
            "default": "development"
          }
        }
      ],
      [
        "expo-font",
        {
          "fonts": ["./assets/fonts/Inter-Regular.otf", "./assets/fonts/Inter-Bold.otf"]
        }
      ]
    ],
    "experiments": {
      "typedRoutes": true,
      "reactCompiler": true
    }
  }
}
````

##tsconfig.json```json
{
"extends": "expo/tsconfig.base",
"compilerOptions": {
"strict": true,
"baseUrl": ".",
"paths": {
"@/_": ["./_"]
}
},
"include": ["**/*.ts", "**/*.tsx", ".expo/types/**/*.ts", "expo-env.d.ts"]
}

````

**Observação:** Com Expo SDK 53+, `babel.config.js` não é mais necessário para a maioria das configurações. Metro cuida da resolução do módulo e o plugin Reanimated é configurado via `app.json`.

## Dependências essenciais```json
{
  "dependencies": {
    "expo": "~53.0.0",
    "expo-router": "~4.0.0",
    "expo-image": "~2.0.0",
    "expo-font": "~13.0.0",
    "react": "19.0.0",
    "react-native": "0.79.0",
    "react-native-safe-area-context": "~5.0.0",
    "react-native-screens": "~4.5.0",
    "@react-navigation/native": "^7.0.0",
    "react-native-reanimated": "~4.0.0",
    "react-native-gesture-handler": "~2.20.0",
    "@legendapp/list": "~2.0.0",
    "zustand": "^5.0.0",
    "jotai": "^2.10.0",
    "@tanstack/react-query": "^5.60.0",
    "react-native-mmkv": "^3.0.0",
    "zeego": "^2.0.0",
    "react-native-bottom-tabs": "~0.5.0"
  },
  "devDependencies": {
    "@types/react": "~19.0.0",
    "typescript": "^5.5.0"
  }
}
````

**Nota da administração do estado:** Zustand e Jotai são excelentes escolhas. Zustand é melhor quando você precisa de um único armazenamento com persistência (Zustand persist + MMKV). Jotai brilha quando você precisa de um estado atômico refinado com átomos derivados - seu modelo atômico evita naturalmente re-renderizações desnecessárias em itens de lista.

## Referência rápida

| Diretório               | Finalidade                                     |
| ----------------------- | ---------------------------------------------- |
| `aplicativo/`           | Rotas baseadas em arquivo (Expo Router)        |
| `componentes/ui/`       | Componentes de UI genéricos e reutilizáveis ​​ |
| `componentes/recursos/` | Componentes específicos de recursos            |
| `ganchos/`              | Ganchos React personalizados                   |
| `serviços/`             | Clientes API, autenticação, externos           |

serviços |
| `lojas/` | Lojas Zustand ou átomos Jotai |
| `constantes/` | Constantes em todo o aplicativo (cores, layout) |
| `tipos/` | Definições de tipo TypeScript |
| `utils/` | Funções de utilidade pura |
| `ativos/` | Imagens, fontes, arquivos estáticos |
