# API de renderização do navegador

## API REST

**Base:** `https://api.cloudflare.com/client/v4/accounts/{accountId}/browser-rendering`  
**Auth:** `Autorização: Bearer <token>` (Renderização do navegador - permissão de edição)

### Pontos finais

| Ponto final        | Descrição                   | Opções principais                            |
| ------------------ | --------------------------- | -------------------------------------------- |
| `/conteúdo`        | Obtenha HTML renderizado    | `url`, `waitUntil`                           |
| `/captura de tela` | Capturar imagem             | `screenshotOptions: {tipo, fullPage, clip}`  |
| `/pdf`             | Gerar PDF                   | `pdfOptions: {formato, paisagem, margem}`    |
| `/instantâneo`     | Recursos HTML + embutidos   | `url`                                        |
| `/ raspar`         | Extrair por seletores       | `seletores: ["h1", ".price"]`                |
| `/json`            | Extração estruturada por IA | `esquema: {nome: "string", preço: "número"}` |
| `/links`           | Obtenha todos os links      | `url`                                        |
| `/remarcação`      | Converter em redução        | `url`                                        |

```bash
curl -X POST '.../browser-rendering/screenshot' \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"url":"https://example.com","screenshotOptions":{"fullPage":true}}'
```

##Vinculação de trabalhadores

```jsonc
// wrangler.jsonc
{ "browser": { "binding": "MYBROWSER" } }
```

##Marionetista

```typescript
import puppeteer from '@cloudflare/puppeteer'

const browser = await puppeteer.launch(env.MYBROWSER, { keep_alive: 600000 })
const page = await browser.newPage()
await page.goto('https://example.com', { waitUntil: 'networkidle0' })

// Content
const html = await page.content()
const title = await page.title()

// Screenshot/PDF
await page.screenshot({ fullPage: true, type: 'png' })
await page.pdf({ format: 'A4', printBackground: true })

// Interaction
await page.click('#button')
await page.type('#input', 'text')
await page.evaluate(() => document.querySelector('h1')?.textContent)

// Session management
const sessions = await puppeteer.sessions(env.MYBROWSER)
const limits = await puppeteer.limits(env.MYBROWSER)

await browser.close()
```

##Dramaturgo

```typescript
import { launch, connect } from '@cloudflare/playwright'

const browser = await launch(env.MYBROWSER, { keep_alive: 600000 })
const page = await browser.newPage()

await page.goto('https://example.com', { waitUntil: 'networkidle' })

// Modern selectors
await page.locator('.button').click()
await page.getByText('Submit').click()
await page.getByTestId('search').fill('query')

// Context for isolation
const context = await browser.newContext({
  viewport: { width: 1920, height: 1080 },
  userAgent: 'custom',
})

await browser.close()
```

##Gerenciamento de sessão

```typescript
// List sessions
await puppeteer.sessions(env.MYBROWSER)

// Connect to existing
await puppeteer.connect(env.MYBROWSER, sessionId)

// Check limits
await puppeteer.limits(env.MYBROWSER)
// { remaining: ms, total: ms, concurrent: n }
```

##Opções principais

| Opção                  | Valores                                                        |
| ---------------------- | -------------------------------------------------------------- |
| `esperaaté`            | `carregar`, `domcontentloaded`, `networkidle0`, `networkidle2` |
| `keep_alive`           | Máx. 600000 ms (10 min)                                        |
| `captura de tela.type` | `png`, `jpeg`                                                  |
| `pdf.formato`          | `A4`, `Carta`, `Ofício`                                        |
