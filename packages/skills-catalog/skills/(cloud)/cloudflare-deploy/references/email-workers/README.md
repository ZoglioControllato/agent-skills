# Trabalhadores de e-mail Cloudflare

Processe e-mails recebidos de maneira programática usando o tempo de execução Cloudflare Workers.

## Visão geral

Email Workers permitem lógica de processamento de email personalizada na borda. Crie filtros de spam, respostas automáticas, sistemas de tickets, manipuladores de notificação e muito mais usando o mesmo tempo de execução de Workers que você usa para solicitações HTTP.

**Principais capacidades**:

- Processe e-mails recebidos com acesso total às mensagens
- Encaminhar para destinos verificados
- Envie respostas com threading adequado
- Analisar conteúdo e anexos MIME
- Integrar com KV, R2, D1 e APIs externas

## Início rápido

### Manipulador mínimo de módulos ES```typescript

export default {
async email(message, env, ctx) {
// Reject spam
if (message.from.includes('spam.com')) {
message.setReject('Blocked')
return
}

    // Forward to inbox
    await message.forward('inbox@example.com')

},
}

````
### Operações principais

| Operação | Método | Caso de uso |
| --------- | ------------------------------- | ---------------------------------- |
| Avançar | `message.forward(to, cabeçalhos?)` | Rota para destino verificado |
| Rejeitar | `message.setReject(motivo)` | Bloqueio com erro SMTP |
| Responder | `message.reply(emailMessage)` | Resposta automática com segmentação |
| Analisar | biblioteca postal-mima | Extrair assunto, corpo, anexos |

## Ordem de leitura

Para uma compreensão abrangente, leia os arquivos nesta ordem:

1. **README.md** (este arquivo) - Visão geral e início rápido
2. **configuration.md** - Configuração, implantação, ligações
3. **api.md** – Referência completa da API
4. **patterns.md** – Exemplos de implementação no mundo real
5. **gotchas.md** – Armadilhas críticas e depuração

## Nesta referência

| Arquivo | Descrição | Principais tópicos |
| -------------------------------------- | ----------------------- | ------------------------------------------------------------------------------------------------------ |
| [api.md](./api.md) | Referência completa da API | ForwardableEmailMessage, ligações SendEmail, método responda(), APIs postal-mime/mimetext |
| [configuração.md](./configuration.md) | Instalação e configuração | wrangler.jsonc, ligações, implantação, dependências |
| [padrões.md](./padrões.md) | Exemplos do mundo real | Listas de permissões de KV, resposta automática com threading, extração de anexos, notificações de webhook |
| [gotchas.md](./gotchas.md) | Armadilhas e depuração | Consumo de fluxo, erros ctx.waitUntil, segurança, limites |

## Arquitetura```
Incoming Email → Email Routing → Email Worker
                                    ↓
                              Process + Decide
                                    ↓
                    ┌───────────────┼───────────────┐
                    ↓               ↓               ↓
                Forward          Reply          Reject
````

**Fluxo do evento**:

1. O e-mail chega ao seu domínio
2. O roteamento de e-mail corresponde à rota (por exemplo, `support@example.com`)
3. O trabalhador de email vinculado recebe `ForwardableEmailMessage`
4. O trabalhador processa e toma medidas (encaminhar/responder/rejeitar)
5. Email entregue ou rejeitado com base na lógica do trabalhador

## Conceitos-chave

### Envelope vs cabeçalhos

- **Endereços de envelope** (`message.from`, `message.to`): endereços de transporte SMTP (confiáveis)
- **Endereços de cabeçalho** (analisados do corpo): endereços de exibição (podem ser falsificados)

Use endereços de envelope para decisões de segurança.

### Fluxos de uso único

`message.raw` é um ReadableStream que só pode ser lido uma vez. Buffer para ArrayBuffer para usos múltiplos.```typescript
// Buffer first
const buffer = await new Response(message.raw).arrayBuffer()
const email = await PostalMime.parse(buffer)

```
Consulte [gotchas.md](./gotchas.md#readablestream-can-only-be-consumed-once) para obter detalhes.

### Destinos verificados

`forward()` só funciona com endereços verificados no painel Cloudflare Email Routing. Adicione destinos antes da implantação.

## Casos de uso

- **Filtragem de spam**: bloqueio com base no remetente, conteúdo ou reputação
- **Respostas automáticas**: envie respostas de confirmação com threading
- **Criação de tickets**: analise e-mails e crie tickets de suporte
- **Arquivamento de e-mail**: Armazene em KV, R2 ou D1
- **Roteamento de notificações**: Encaminhe para Slack, Discord ou webhooks
- **Processamento de anexos**: Extraia arquivos para armazenamento R2
- **Roteamento multilocatário**: roteamento baseado no subdomínio do destinatário
- **Filtragem de tamanho**: rejeita anexos grandes

## Limites

| Limite | Valor |
| -------------------- | ------ |
| Tamanho máximo da mensagem | 25 MiB |
| Regras máximas de roteamento | 200 |
| Destinos máximos | 200 |
| Tempo de CPU (nível gratuito) | 10ms |
| Tempo de CPU (nível pago) | 50ms |

Consulte [gotchas.md](./gotchas.md#limits-reference) para obter a tabela de limites completa.

## Pré-requisitos

Antes de implantar Email Workers:

1. **Ative o roteamento de e-mail** no painel da Cloudflare para seu domínio
2. **Verifique os endereços de destino** para encaminhamento
3. **Configurar DMARC/SPF** para envio de domínios (obrigatório para respostas)
4. **Configure wrangler.jsonc** com ligação SendEmail

Consulte [configuration.md](./configuration.md) para configuração detalhada.

## Sintaxe do Service Worker (obsoleto)

Os projetos modernos devem usar o formato de módulos ES mostrado acima. A sintaxe do Service Worker (`addEventListener('email', ...)`) está obsoleta, mas ainda é suportada.

## Veja também

- [Documentação sobre roteamento de e-mail](https://developers.cloudflare.com/email-routing/)
- [Plataforma de trabalhadores](https://developers.cloudflare.com/workers/)
- [CLI do Wrangler](https://developers.cloudflare.com/workers/wrangler/)
- [postal-mime no npm](https://www.npmjs.com/package/postal-mime)
- [mimetext no npm](https://www.npmjs.com/package/mimetext)
```
