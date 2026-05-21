# Padrões e casos de uso

## Chat com IA e ferramentas

**Servidor (AIChatAgent):**

```ts
import { AIChatAgent } from 'agents'
import { openai } from '@ai-sdk/openai'
import { tool } from 'ai'
import { z } from 'zod'

export class ChatAgent extends AIChatAgent<Env> {
  async onChatMessage(onFinish) {
    return this.streamText({
      model: openai('gpt-4'),
      messages: this.messages, // Auto-managed
      tools: {
        getWeather: tool({
          description: 'Get current weather',
          parameters: z.object({ city: z.string() }),
          execute: async ({ city }) => `Weather in ${city}: Sunny, 72°F`,
        }),
        searchDocs: tool({
          description: 'Search documentation',
          parameters: z.object({ query: z.string() }),
          execute: async ({ query }) =>
            JSON.stringify(
              this.sql<{ title; content }>`SELECT title, content FROM docs WHERE content LIKE ${'%' + query + '%'}`,
            ),
        }),
      },
      onFinish,
    })
  }
}
```

**Cliente (React):**

```tsx
import { useAgent } from 'agents/react'
import { useAgentChat } from 'agents/ai-react'

function ChatUI() {
  const agent = useAgent({ agent: 'ChatAgent' })
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useAgentChat({ agent })

  return (
    <div>
      {messages.map((m) => (
        <div key={m.id}>
          {m.role}: {m.content}
        </div>
      ))}
      <form onSubmit={handleSubmit}>
        <input value={input} onChange={handleInputChange} disabled={isLoading} />
        <button disabled={isLoading}>Send</button>
      </form>
    </div>
  )
}
```

## Human-in-the-loop (ferramentas no cliente)

O servidor define a ferramenta, o cliente executa:

```ts
// Servidor
export class ChatAgent extends AIChatAgent<Env> {
  async onChatMessage(onFinish) {
    return this.streamText({
      model: openai('gpt-4'),
      messages: this.messages,
      tools: {
        confirmAction: tool({
          description: 'Ask user to confirm',
          parameters: z.object({ action: z.string() }),
          execute: 'client', // Execução no cliente
        }),
      },
      onFinish,
    })
  }
}

// Cliente
const { messages } = useAgentChat({
  agent,
  onToolCall: async (toolCall) => {
    if (toolCall.toolName === 'confirmAction') {
      return { confirmed: window.confirm(`Confirm: ${toolCall.args.action}?`) }
    }
  },
})
```

## Fila de tarefas e processamento agendado

```ts
export class TaskAgent extends Agent<Env> {
  onStart() {
    this.schedule('*/5 * * * *', 'processQueue', {}) // A cada 5 min
    this.schedule('0 0 * * *', 'dailyCleanup', {}) // Diário
  }

  async onRequest(req: Request) {
    await this.queue('processVideo', { videoId: (await req.json()).videoId })
    return Response.json({ queued: true })
  }

  async processQueue() {
    const tasks = await this.dequeue(10)
    for (const task of tasks) {
      if (task.name === 'processVideo') await this.processVideo(task.data.videoId)
    }
  }

  async dailyCleanup() {
    this.sql`DELETE FROM logs WHERE created_at < ${Date.now() - 86400000}`
  }
}
```

## Chat WebSocket manual

Protocolos customizados (não IA):

```ts
export class ChatAgent extends Agent<Env> {
  async onConnect(conn: Connection, ctx: ConnectionContext) {
    conn.accept()
    conn.setState({ userId: ctx.request.headers.get('X-User-ID') || 'anon' })
    conn.send(JSON.stringify({ type: 'history', messages: this.state.messages }))
  }

  async onMessage(conn: Connection, msg: WSMessage) {
    const newMsg = { userId: conn.state.userId, text: JSON.parse(msg as string).text, timestamp: Date.now() }
    this.setState({ messages: [...this.state.messages, newMsg] })
    this.connections.forEach((c) => c.send(JSON.stringify(newMsg)))
  }
}
```

## Processamento de e-mail com IA

```ts
export class EmailAgent extends Agent<Env> {
  async onEmail(email: AgentEmail) {
    const [text, from, subject] = [await email.text(), email.from, email.headers.get('subject') || '']
    this.sql`INSERT INTO emails (from_addr, subject, body) VALUES (${from}, ${subject}, ${text})`

    const { text: summary } = await generateText({
      model: openai('gpt-4o-mini'),
      prompt: `Summarize: ${subject}\n\n${text}`,
    })

    this.connections.forEach((c) => c.send(JSON.stringify({ type: 'new_email', from, summary })))
    if (summary.includes('urgent')) await this.schedule(0, 'sendAutoReply', { to: from })
  }
}
```

## Colaboração em tempo real

```ts
export class GameAgent extends Agent<Env> {
  initialState = { players: [], gameStarted: false }

  async onConnect(conn: Connection, ctx: ConnectionContext) {
    conn.accept()
    const playerId = ctx.request.headers.get('X-Player-ID') || crypto.randomUUID()
    conn.setState({ playerId })

    const newPlayer = { id: playerId, score: 0 }
    this.setState({ ...this.state, players: [...this.state.players, newPlayer] })
    this.connections.forEach((c) => c.send(JSON.stringify({ type: 'player_joined', player: newPlayer })))
  }

  async onMessage(conn: Connection, msg: WSMessage) {
    const m = JSON.parse(msg as string)

    if (m.type === 'move') {
      this.setState({
        ...this.state,
        players: this.state.players.map((p) =>
          p.id === conn.state.playerId ? { ...p, score: p.score + m.points } : p,
        ),
      })
      this.connections.forEach((c) => c.send(JSON.stringify({ type: 'player_moved', playerId: conn.state.playerId })))
    }

    if (m.type === 'start' && this.state.players.length >= 2) {
      this.setState({ ...this.state, gameStarted: true })
      this.connections.forEach((c) => c.send(JSON.stringify({ type: 'game_started' })))
    }
  }
}
```
