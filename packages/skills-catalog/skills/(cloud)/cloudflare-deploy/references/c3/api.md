# Referência CLI C3

## Invocação

```bash
npm create cloudflare@latest [name] [-- flags]  # NPM requires --
yarn create cloudflare [name] [flags]
pnpm create cloudflare@latest [name] [-- flags]
```

##Sinalizadores principais

| Bandeira           | Valores                                                                                       | Descrição                                  |
| ------------------ | --------------------------------------------------------------------------------------------- | ------------------------------------------ |
| `--tipo`           | `hello-world`, `web-app`, `demo`, `pré-existente`, `modelo remoto`                            | Tipo de aplicação                          |
| `--plataforma`     | `trabalhadores` (padrão), `páginas`                                                           | Plataforma alvo                            |
| `--framework`      | `next`, `remix`, `astro`, `react-router`, `solid`, `svelte`, `qwik`, `vue`, `angular`, `hono` | Estrutura da Web (requer `--type=web-app`) |
| `--lang`           | `ts`, `js`, `python`                                                                          | Idioma (para `--type=hello-world`)         |
| `--ts` / `--no-ts` | -                                                                                             | TypeScript para aplicativos da web         |

## Sinalizadores de implantação

| Bandeira                   | Descrição                                                     |
| -------------------------- | ------------------------------------------------------------- |
| `--deploy` / `--no-deploy` | Implantar imediatamente (solicitações interativas, ignora CI) |
| `--git` / `--no-git`       | Inicialize o git (padrão: sim)                                |
| `--abrir`                  | Abra o navegador após a implantação                           |

## Sinalizadores avançados

| Bandeira                                    | Descrição                                        |
| ------------------------------------------- | ------------------------------------------------ |
| `--template=usuário/repo`                   | Modelo GitHub ou caminho local                   |
| `--existente-script=./src/worker.ts`        | Script existente (requer `--type=pré-existente`) |
| `--category=ai\|banco de dados\|tempo real` | Filtro de demonstração (requer `--type=demo`)    |
| `--experimental`                            | Habilitar recursos experimentais                 |
| `--wrangler-defaults`                       | Ignorar prompts do wrangler                      |

## Variáveis ​​de ambiente

```bash
CLOUDFLARE_API_TOKEN=xxx    # For deployment
CLOUDFLARE_ACCOUNT_ID=xxx   # Account ID
CF_TELEMETRY_DISABLED=1     # Disable telemetry
```

##Códigos de saída

`0` sucesso, `1` aborto do usuário, `2` erro

## Exemplos

```bash
# TypeScript Worker
npm create cloudflare@latest my-api -- --type=hello-world --lang=ts --no-deploy

# Next.js on Pages
npm create cloudflare@latest my-app -- --type=web-app --framework=next --platform=pages --ts

# Astro blog
npm create cloudflare@latest my-blog -- --type=web-app --framework=astro --ts --deploy

# CI: non-interactive
npm create cloudflare@latest my-app -- --type=web-app --framework=next --ts --no-git --no-deploy

# GitHub template
npm create cloudflare@latest -- --template=cloudflare/templates/worker-openapi

# Convert existing project
npm create cloudflare@latest . -- --type=pre-existing --existing-script=./build/worker.js
```
