#Configuração

## Primeiros passos

Navegue até [workers.cloudflare.com/playground](https://workers.cloudflare.com/playground)

- **Não é necessária conta** para teste
- **Não é necessária CLI ou configuração local**
- O código é executado em tempo de execução real do Cloudflare Workers
- Compartilhe código via URL (nunca expira)

## Restrições do playground

⚠️ **Limitações importantes**

| Restrição                   | Parque infantil            | Trabalhadores de produção          |
| --------------------------- | -------------------------- | ---------------------------------- |
| **Formato do módulo**       | Apenas módulos ES          | Módulos ES ou Service Worker       |
| **TypeScript**              | Não suportado (somente JS) | Suportado pela etapa de construção |
| **Encadernações**           | Não disponível             | KV, D1, R2, objetos duráveis, etc. |
| **wrangler.toml**           | Não utilizado              | Necessário para configuração       |
| **Variáveis ​​ambientais**  | Não disponível             | Suporte total                      |
| **Segredos**                | Não disponível             | Suporte total                      |
| **Domínios personalizados** | Não disponível             | Suporte total                      |

**O Playground é apenas para prototipagem rápida.** Para aplicativos de produção, use a CLI `wrangler`.

##Editor de código

### Requisitos de sintaxe

Deve exportar o objeto padrão com o manipulador `fetch`:```javascript
export default {
async fetch(request, env, ctx) {
return new Response('Hello World')
},
}

````
**Pontos-chave:**

- Deve usar módulos ES (`export default`)
- O método `fetch` recebe `(request, env, ctx)`
- Deve retornar o objeto `Response`
- TypeScript não suportado (use JavaScript simples)

### Código Multimódulo

Importe de URLs externos ou módulos embutidos:```javascript
// Import from CDN
import { Hono } from 'https://esm.sh/hono@3'

// Or paste library code and import relatively
// (See patterns.md for multi-module examples)

export default {
  async fetch(request) {
    const app = new Hono()
    app.get('/', (c) => c.text('Hello'))
    return app.fetch(request)
  },
}
````

## Painel de visualização

### Guia do navegador

Visualização interativa padrão com barra de endereço:

- Insira caminhos de URL personalizados
- Recarga automática em alterações de código
- DevTools disponíveis (clique com o botão direito → Inspecionar)

### Painel de teste HTTP

Mude para a guia **HTTP** para testes HTTP brutos:

- Alterar método HTTP (GET, POST, PUT, DELETE, PATCH, etc.)
- Adicionar/editar cabeçalhos de solicitação
- Modificar corpo da solicitação (JSON, dados do formulário, texto)
- Ver cabeçalhos e corpo de resposta
- Teste diferentes tipos de conteúdo

Exemplo de teste HTTP:```
Method: POST
URL: /api/users
Headers:
Content-Type: application/json
Authorization: Bearer token123
Body:
{
"name": "Alice",
"email": "alice@example.com"
}

```
## Código de compartilhamento

O botão **Copiar link** gera URL compartilhável:

- Código incorporado no fragmento de URL
- Links nunca expiram
- Nenhuma conta necessária
- Pode ser marcado para mais tarde

Exemplo: `https://workers.cloudflare.com/playground#abc123...`

## Implantando do Playground

Clique no botão **Implantar** para mover o código para produção:

1. **Faça login** na conta Cloudflare (crie uma conta gratuita, se necessário)
2. **Revisar** Nome e código do trabalhador
3. **Implantar** na rede global (leva cerca de 30 segundos)
4. **Obter URL**: implantado no subdomínio `<nome>.workers.dev`
5. **Gerenciar** no painel: adicionar vinculações, domínios personalizados, análises

**Após a implantação:**

- O código é executado na rede global da Cloudflare (mais de 300 cidades)
- Pode adicionar ligações KV, D1, R2, objetos duráveis
- Configurar domínios e rotas personalizadas
- Ver análises e registros
- Definir variáveis e segredos de ambiente

**Observação:** Os Deployed Workers estão prontos para produção, mas começam no plano Gratuito (100 mil solicitações/dia).

## Compatibilidade do navegador

| Navegador | Estado | Notas |
| ----------- | --------------- | ----------------------------------------- |
| Cromo/Borda | ✅ Suporte total | Recomendado |
| Raposa de fogo | ✅ Suporte total | Funciona bem |
| Safári | ⚠️ Quebrado | A visualização falha com "PreviewRequestFailed" |

**Usuários do Safari:** Use o Chrome, Firefox ou Edge for Workers Playground.

## Integração com DevTools

1. **Abrir visualização** na guia do navegador
2. **Clique com o botão direito** → Inspecionar elemento
3. **A guia Console** mostra os registros do Worker:
- saída `console.log()`
- Erros não detectados
- Solicitações de rede (subsolicitações)

**Observação:** DevTools mostram o console do lado do cliente, não os logs de execução do Worker. Para registro de produção, use Logpush ou Tail Workers.

## Limites no Playground

Igual ao plano gratuito de produção:

| Recurso | Limite | Notas |
| ------------- | --------- | -------------------- |
| Tempo de CPU | 10ms | Por solicitação |
| Memória | 128 MB | Por solicitação |
| Tamanho do roteiro | 1 MB | Após compressão |
| Subsolicitações | 50 | Chamadas de busca de saída |
| Tamanho da solicitação | 100 MB | Entrada |
| Tamanho da resposta | Ilimitado | Saída (transmitida) |

**Exceder o tempo de CPU** gera um erro imediatamente. Otimize hot paths ou atualize para plano pago (CPU de 50 ms).
```
