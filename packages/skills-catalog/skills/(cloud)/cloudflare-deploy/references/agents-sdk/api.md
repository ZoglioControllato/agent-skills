# Referência de API

## Classes Agent

### AIChatAgent

Para chat com IA com stream automático, histórico de mensagens, ferramentas e stream retomável.

```ts
import { AIChatAgent } from 'agents'
import { openai } from '@ai-sdk/openai'

export class ChatAgent extends AIChatAgent<Env> {
  async onChatMessage(onFinish) {
    return this.streamText({
      model: openai('gpt-4'),
      messages: this.messages, // Histórico gerenciado automaticamente
      tools: {
        getWeather: {
          description: 'Get weather',
          parameters: z.object({ city: z.string() }),
          execute: async ({ city }) => `Sunny, 72°F in ${city}`,
        },
      },
      onFinish, // Persiste resposta em this.messages
    })
  }
}
```

### Agent (classe base)

Controle total para lógica customizada, WebSockets, e-mail e SQL.

```ts
import { Agent } from 'agents'

export class MyAgent extends Agent<Env, State> {
  // Métodos de ciclo de vida abaixo
}
```

**Parâmetros de tipo:** `Agent<Env, State, ConnState>` — bindings de ambiente, estado do agente e estado da conexão

## Hooks de ciclo de vida

```ts
onStart() { // Init/restart
  this.sql`CREATE TABLE IF NOT EXISTS users (id TEXT, name TEXT)`;
}

async onRequest(req: Request) { // HTTP
  const {pathname} = new URL(req.url);
  if (pathname === "/users") return Response.json(this.sql<{id,name}>`SELECT * FROM users`);
  return new Response("Not found", {status: 404});
}

async onConnect(conn: Connection<ConnState>, ctx: ConnectionContext) { // WebSocket
  conn.accept();
  conn.setState({userId: ctx.request.headers.get("X-User-ID")});
  conn.send(JSON.stringify({type: "connected", state: this.state}));
}

async onMessage(conn: Connection<ConnState>, msg: WSMessage) { // Mensagens WS
  const m = JSON.parse(msg as string);
  this.setState({messages: [...this.state.messages, m]});
  this.connections.forEach(c => c.send(JSON.stringify(m)));
}

async onEmail(email: AgentEmail) { // Roteamento de e-mail
  this.sql`INSERT INTO emails (from_addr,subject,body) VALUES (${email.from},${email.headers.get("subject")},${await email.text()})`;
}
```

## Estado, SQL e agendamento

```ts
// Estado
this.setState({ count: 42 }) // Sincroniza automaticamente
this.setState({ ...this.state, count: this.state.count + 1 })

// SQL (consultas parametrizadas evitam injection)
this.sql`CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY, name TEXT)`
this.sql`INSERT INTO users (id,name) VALUES (${userId},${name})`
const users = this.sql<{ id; name }>`SELECT * FROM users WHERE id = ${userId}`

// Agendamento
await this.schedule(new Date('2026-12-25'), 'sendGreeting', { msg: 'Hi' }) // Data
await this.schedule(60, 'checkStatus', {}) // Atraso (s)
await this.schedule('0 0 * * *', 'dailyCleanup', {}) // Cron
await this.cancelSchedule(scheduleId)
```

## Métodos RPC (@callable)

```ts
import { Agent, callable } from 'agents'

export class MyAgent extends Agent<Env> {
  @callable()
  async processTask(input: { text: string }): Promise<{ result: string }> {
    return { result: await this.env.AI.run('@cf/meta/llama-3.1-8b-instruct', { prompt: input.text }) }
  }
}
// Cliente: const result = await agent.processTask({ text: "Hello" });
// Retornos precisam ser serializáveis em JSON
```

## Conexões e IA

```ts
// Conexões (tipo: Agent<Env, State, ConnState>)
this.connections.forEach((c) => c.send(JSON.stringify(msg))) // Broadcast
conn.setState({ userId: '123' })
conn.close(1000, 'Goodbye')

// Workers AI
const r = await this.env.AI.run('@cf/meta/llama-3.1-8b-instruct', { prompt })

// Stream manual (prefira AIChatAgent)
const stream = await client.chat.completions.create({ model: 'gpt-4', messages, stream: true })
for await (const chunk of stream) conn.send(JSON.stringify({ chunk: chunk.choices[0].delta.content }))
```

**Estado tipado:** `Agent<Env, State, ConnState>` — o terceiro parâmetro tipa `conn.state`

## Integração MCP

Model Context Protocol para expor ferramentas:

```ts
// Registrar e usar servidor MCP
await this.mcp.registerServer('github', {
  url: env.MCP_SERVER_URL,
  auth: { type: 'oauth', clientId: env.GITHUB_CLIENT_ID, clientSecret: env.GITHUB_CLIENT_SECRET },
})
const tools = await this.mcp.getAITools(['github'])
return this.streamText({ model: openai('gpt-4'), messages: this.messages, tools, onFinish })
```

## Fila de tarefas

```ts
await this.queue('processVideo', { videoId: 'abc123' }) // Adiciona tarefa
const tasks = await this.dequeue(10) // Processa até 10
```

## Contexto e limpeza

```ts
const agent = getCurrentAgent<MyAgent>(); // Instância atual
async destroy() { /* limpeza antes do agente ser destruído */ }
```

## Integração com IA

```ts
// Workers AI
const r = await this.env.AI.run('@cf/meta/llama-3.1-8b-instruct', { prompt })

// Stream manual (prefira AIChatAgent para stream automático)
const stream = await client.chat.completions.create({ model: 'gpt-4', messages, stream: true })
for await (const chunk of stream) {
  if (chunk.choices[0]?.delta?.content) conn.send(JSON.stringify({ chunk: chunk.choices[0].delta.content }))
}
```

## Hooks no cliente (React)

```ts
// useAgent() — conexão WebSocket + RPC
import { useAgent } from 'agents/react'
const agent = useAgent({ agent: 'MyAgent', name: 'user-123' }) // name para idFromName
const result = await agent.processTask({ text: 'Hello' }) // Chama métodos @callable
// agent.readyState: 0=CONNECTING, 1=OPEN, 2=CLOSING, 3=CLOSED

// useAgentChat() — UI de chat com IA
import { useAgentChat } from 'agents/ai-react'
const agent = useAgent({ agent: 'ChatAgent' })
const { messages, input, handleInputChange, handleSubmit, isLoading, stop, clearHistory } = useAgentChat({
  agent,
  maxSteps: 5, // Máx. iterações de ferramentas
  resume: true, // Retoma automaticamente ao desconectar
  onToolCall: async (toolCall) => {
    // Ferramentas no cliente (human-in-the-loop)
    if (toolCall.toolName === 'confirm') return { ok: window.confirm('Proceed?') }
  },
})
// status: "ready" | "submitted" | "streaming" | "error"
```
