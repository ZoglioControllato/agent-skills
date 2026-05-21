# Referência da skill de implementação Cloudflare Turnstile

Orientação especializada para implementar o Cloudflare Turnstile — alternativa inteligente a CAPTCHA que protege sites de bots sem quebra-cabeças tradicionais.

## Visão geral

O Turnstile é uma alternativa amigável a CAPTCHA: executa desafios em segundo plano sem interação obrigatória. Valida visitantes com sinais de comportamento do navegador, fingerprinting e ML.

## Tipos de widget

| Tipo                 | Interação                         | Caso de uso                                   |
| -------------------- | --------------------------------- | --------------------------------------------- |
| **Managed** (padrão) | Mostra checkbox quando necessário | Formulários, logins — equilíbrio UX/segurança |
| **Non-Interactive**  | Invisível, automático             | UX sem fricção, ações de baixo risco          |
| **Invisible**        | Oculto, acionado por código       | Pré-liberação, APIs, headless                 |

## Início rápido

### Renderização implícita (HTML)

```html
<!-- 1. Add script -->
<script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>

<!-- 2. Add widget to form -->
<form action="/submit" method="POST">
  <div class="cf-turnstile" data-sitekey="YOUR_SITE_KEY"></div>
  <button type="submit">Submit</button>
</form>
```

### Renderização explícita (JavaScript)

```html
<div id="turnstile-container"></div>
<script src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"></script>
<script>
  window.turnstile.render('#turnstile-container', {
    sitekey: 'YOUR_SITE_KEY',
    callback: (token) => console.log('Token:', token),
  })
</script>
```

### Validação no servidor (obrigatória)

```javascript
// Cloudflare Workers
export default {
  async fetch(request) {
    const formData = await request.formData()
    const token = formData.get('cf-turnstile-response')

    const result = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        secret: env.TURNSTILE_SECRET,
        response: token,
        remoteip: request.headers.get('CF-Connecting-IP'),
      }),
    })

    const validation = await result.json()
    if (!validation.success) {
      return new Response('Invalid CAPTCHA', { status: 400 })
    }
    // Process form...
  },
}
```

## Chaves de teste

**Essenciais para desenvolvimento/testes:**

| Tipo                           | Chave                                 | Comportamento                    |
| ------------------------------ | ------------------------------------- | -------------------------------- |
| **Site Key (sempre passa)**    | `1x00000000000000000000AA`            | Widget ok, token valida          |
| **Site Key (sempre bloqueia)** | `2x00000000000000000000AB`            | Falha visível                    |
| **Site Key (força desafio)**   | `3x00000000000000000000FF`            | Sempre mostra desafio interativo |
| **Secret Key (testes)**        | `1x0000000000000000000000000000000AA` | Valida tokens de teste           |

**Nota:** chaves de teste funcionam em `localhost` e qualquer domínio. Não use em produção.

## Restrições das chaves

- **Expiração do token:** 5 minutos após geração
- **Uso único:** cada token só pode ser validado uma vez
- **Validação no servidor obrigatória:** checagem só no cliente é insuficiente

## Ordem de leitura

1. **[configuration.md](configuration.md)** — setup, opções do widget, carregamento do script
2. **[api.md](api.md)** — API JS, siteverify, tipos TypeScript
3. **[patterns.md](patterns.md)** — formulários, frameworks, validação
4. **[gotchas.md](gotchas.md)** — erros comuns, depuração, limites

## Ver também

- [Documentação Turnstile](https://developers.cloudflare.com/turnstile/)
- [Painel](https://dash.cloudflare.com/?to=/:account/turnstile)

Documentação localizada no ecossistema mantido pelo Controllato Club.
