#Configuração do Zaraz

## Configuração do painel

1. Domínio → Zaraz → Iniciar configuração
2. Adicionar ferramenta (por exemplo, Google Analytics 4)
3. Insira as credenciais (GA4: `G-XXXXXXXXXX`)
4. Configure gatilhos
5. Salve e publique

## Gatilhos

| Tipo                     | Quando                  | Caso de uso                       |
| ------------------------ | ----------------------- | --------------------------------- |
| Visualização de página   | Carregamento de página  | Rastrear visualizações de páginas |
| Clique                   | Elemento clicado        | Rastreamento de botão             |
| Envio de formulário      | Formulário enviado      | Captura de leads                  |
| Mudança de história      | Alterações de URL (SPA) | Roteamento React/Vue              |
| Correspondência variável | Condição personalizada  | Disparo condicional               |

### Mudança de histórico (SPA)```

Type: History Change
Event: pageview

```

Fires on `pushState`, `replaceState`, hash changes. **No manual tracking needed.**

### Click Trigger

```

Type: Click
CSS Selector: .buy-button
Event: purchase_intent
Properties:
button_text: {{system.clickElement.text}}

```

## Tool Configuration

**GA4:**

```

Measurement ID: G-XXXXXXXXXX
Events: page_view, purchase, user_engagement

```

**Facebook Pixel:**

```

Pixel ID: 1234567890123456
Events: PageView, Purchase, AddToCart

```

**Google Ads:**

```

Conversion ID: AW-XXXXXXXXX
Conversion Label: YYYYYYYYYY

````

## Consent Management

1. Settings → Consent → Create purposes (analytics, marketing)
2. Map tools to purposes
3. Set behavior: "Do not load until consent granted"

**Programmatic consent:**

```javascript
zaraz.consent.setAll({ analytics: true, marketing: true })
````

## Privacy Features

| Feature          | Default              |
| ---------------- | -------------------- |
| IP Anonymization | Enabled              |
| Cookie Control   | Via consent purposes |
| GDPR/CCPA        | Consent modal        |

## Testing

1. **Preview Mode** - test without publishing
2. **Debug Mode** - `zaraz.debug = true`
3. **Network tab** - filter "zaraz"

## Limits

| Resource         | Limit |
| ---------------- | ----- |
| Event properties | 100KB |
| Consent purposes | 20    |
