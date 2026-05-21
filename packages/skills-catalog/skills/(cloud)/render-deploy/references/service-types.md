# Renderizar tipos de serviço

Explicação detalhada de cada tipo de serviço disponível no Render. Escolha o tipo de serviço certo com base nas necessidades do seu aplicativo.

## Serviços Web (`tipo: web`)

### Objetivo

Os serviços da Web são servidores HTTP que lidam com solicitações recebidas da Internet. Eles são acessíveis publicamente por meio de URLs HTTPS.

### Casos de uso

- **APIs REST**: APIs JSON para aplicativos móveis ou aplicativos front-end
- **Servidores GraphQL**: endpoints GraphQL para consultas de clientes
- **Aplicativos Web**: sites renderizados em servidor (Django, Rails, Express)
- **Estruturas full-stack**: Next.js, Nuxt.js, Remix, SvelteKit
- **Servidores WebSocket**: servidores de comunicação em tempo real
- **Aplicativos SSR**: aplicativos React, Vue ou Angular renderizados no lado do servidor

### Principais características

- **URL público**: atribuído automaticamente `https://[service-name].onrender.com`
- **Vinculação de porta necessária**: Deve vincular-se a `0.0.0.0:$PORT`
- **Verificações de integridade**: renderize pings em seu serviço para verificar se ele está em execução
- **HTTPS**: certificados SSL/TLS automáticos
- **Balanceamento de carga**: tráfego distribuído entre várias instâncias
- **Domínios personalizados**: suporte para seus próprios nomes de domínio

### Configuração necessária```yaml

type: web
name: my-api
runtime: node
buildCommand: npm ci
startCommand: npm start

````
### Melhores Práticas

1. **Vincular ao ambiente PORT**:```javascript
const PORT = process.env.PORT || 3000
app.listen(PORT, '0.0.0.0')
````

2. **Adicionar endpoint de verificação de integridade**:```javascript
   app.get('/health', (req, res) => {
   res.status(200).json({ status: 'ok' })
   })

````
3. **Use tempos limite apropriados**: as solicitações da Web devem ser concluídas em 30 segundos

4. **Implementar o desligamento normal**: Manuseie os sinais SIGTERM corretamente

---

## Serviços de trabalho (`tipo: trabalhador`)

### Objetivo

Os serviços de trabalho executam tarefas em segundo plano sem lidar com solicitações HTTP. Eles não são acessíveis publicamente.

### Casos de uso

- **Processadores de fila**: fila Redis, BullMQ, Celery, Sidekiq
- **Trabalhos em segundo plano**: envio de e-mail, processamento de imagens, exportação de dados
- **Consumidores de eventos**: Consumidores de fila de mensagens (Kafka, RabbitMQ, etc.)
- **Trabalhadores de pipeline de dados**: processos ETL, transformação de dados
- **Tarefas agendadas em segundo plano**: processos contínuos (não cron)
- **Backend WebSocket**: serviços de manipulador WebSocket dedicados

### Principais características

- **Sem URL público**: Não acessível pela Internet
- **Sem ligação de porta**: Não precisa escutar em uma porta
- **Sem verificações de integridade**: a renderização monitora a integridade do processo de maneira diferente
- **De longa duração**: pode ser executado indefinidamente
- **Comunicação privada**: Acesso via rede interna
- **Reiniciar em caso de falha**: reiniciado automaticamente se o processo morrer

### Configuração necessária```yaml
type: worker
name: queue-processor
runtime: python
buildCommand: pip install -r requirements.txt
startCommand: celery -A tasks worker --loglevel=info
````

### Melhores Práticas

1. **Conecte-se à fila de mensagens**:```python
   import redis
   r = redis.from_url(os.environ['REDIS_URL'])

````
2. **Implementar lógica de novas tentativas**: lidar com falhas normalmente

3. **Monitore a profundidade da fila**: rastreie trabalhos pendentes

4. **Status de processamento de log**: facilita a depuração

5. **Desligamento normal**: Conclua os trabalhos atuais antes de sair

### Padrões Comuns

**Node.js com BullMQ:**

```yaml
type: worker
name: job-processor
runtime: node
buildCommand: npm ci
startCommand: node worker.js
envVars:
  - key: REDIS_URL
    fromDatabase:
      name: redis
      property: connectionString
````

**Python com Aipo:**

```yaml
type: worker
name: celery-worker
runtime: python
buildCommand: pip install -r requirements.txt
startCommand: celery -A app.celery worker
envVars:
  - key: REDIS_URL
    fromDatabase:
      name: redis
      property: connectionString
```

---

## Cron Jobs (`tipo: cron`)

### Objetivo

Os cron jobs executam tarefas agendadas em uma programação repetitiva. Eles executam, completam e desligam.

### Casos de uso

- **Backups de banco de dados**: backups automatizados regulares
- **Geração de relatórios**: relatórios diários/semanais
- **Limpeza de dados**: exclua registros antigos periodicamente
- **Aquecimento de cache**: pré-preencher caches
- **Resumos por e-mail**: envie resumos programados por e-mail
- **Sincronização de dados**: sincronização entre sistemas
- **Processamento em lote**: Processar dados acumulados

### Principais características

- **Execução agendada**: é executado no cronograma cron
- **Desligamento automático**: Desliga após a conclusão
- **Sem porta persistente**: Não mantém porta de escuta
- **Sem verificações de integridade**: a tarefa é concluída ou falha
- **Fuso horário UTC**: todos os horários em UTC
- **Tempo de execução máximo**: tempo limite dos trabalhos após o limite configurado

### Configuração necessária```yaml

type: cron
name: daily-backup
runtime: node
schedule: '0 2 \* \* \*' # Daily at 2 AM UTC
buildCommand: npm ci
startCommand: node scripts/backup.js

````
### Formato de agendamento

Sintaxe padrão do cron: `minuto hora dia mês dia da semana`

**Programações comuns:**

| Cronograma | Descrição |
| ------------- | ------------------------ |
| `*/5 * * * *` | A cada 5 minutos |
| `0 * * * *` | A cada hora |
| `0 0 * * *` | Diariamente à meia-noite UTC |
| `0 9 * * 1-5` | Dias úteis às 9h UTC |
| `0 0 1 * *` | Primeiro dia de cada mês |
| `0 9 * * 1` | Todas as segundas-feiras às 9h UTC |

### Melhores Práticas

1. **Lidar com falhas normalmente**: os trabalhos devem ser idempotentes

2. **Status de conclusão do registro**: Rastreie sucesso/falha

3. **Defina tempos limite apropriados**: corresponda à duração esperada do trabalho

4. **Use horários UTC**: todas as programações são baseadas em UTC

5. **Teste minuciosamente**: teste com diferentes cenários de dados

### Exemplos de casos de uso

**Backup diário do banco de dados:**

```yaml
type: cron
name: db-backup
runtime: python
schedule: '0 1 * * *' # 1 AM UTC daily
buildCommand: pip install -r requirements.txt
startCommand: python scripts/backup.py
envVars:
  - key: DATABASE_URL
    fromDatabase:
      name: postgres
      property: connectionString
  - key: S3_BUCKET
    value: my-backups
````

**Atualização de cache por hora:**

```yaml
type: cron
name: cache-refresh
runtime: node
schedule: '0 * * * *' # Top of every hour
buildCommand: npm ci
startCommand: node scripts/refresh-cache.js
```

---

## Sites estáticos (`type: web` + `runtime: static`)

### Objetivo

Sirva arquivos HTML, CSS e JavaScript estáticos via CDN. Sem tempo de execução de back-end.

### Casos de uso

- **Aplicativos de página única (SPAs)**: aplicativos React, Vue, Angular
- **Geradores de sites estáticos**: Gatsby, Next.js (exportação estática), Hugo
- **Sites de documentação**: MkDocs, Docusaurus, VitePress
- **Páginas de destino**: sites de marketing
- **Sites de portfólio**: sites pessoais
- **Sites JAMstack**: sites estáticos com integração de API

### Principais características

- **Entrega de CDN**: cache de borda global
- **Sem tempo de execução de back-end**: exibe apenas arquivos compilados
- **Somente saída de compilação**: exibe o conteúdo do diretório de compilação
- **Suporte de roteamento**: reescrever regras para roteamento SPA
- **Cabeçalhos personalizados**: controle de cache, cabeçalhos de segurança
- **Implantação rápida**: Rápido para criar e implantar

### Configuração necessária```yaml

type: web
name: frontend
runtime: static
buildCommand: npm ci && npm run build
staticPublishPath: ./dist # or ./build, ./out, ./public

````
### Roteamento para SPAs

Os aplicativos de página única precisam de regras de reescrita para lidar com o roteamento do lado do cliente:```yaml
type: web
name: react-app
runtime: static
buildCommand: npm ci && npm run build
staticPublishPath: ./build
routes:
  - type: rewrite
    source: /*
    destination: /index.html
````

### Cabeçalhos personalizados

Adicione controle de cache e cabeçalhos de segurança:```yaml
type: web
name: static-site
runtime: static
buildCommand: npm ci && npm run build
staticPublishPath: ./dist
headers:

# Cache static assets

- path: /static/\*
  name: Cache-Control
  value: public, max-age=31536000, immutable

# Security headers

- path: /\*
  name: X-Frame-Options
  value: DENY
- path: /\*
  name: X-Content-Type-Options
  value: nosniff

````
### Construir filtros

Para monorepos, construa apenas quando os arquivos de frontend forem alterados:```yaml
type: web
name: frontend
runtime: static
buildCommand: npm ci && npm run build
staticPublishPath: ./dist
buildFilter:
  paths:
    - frontend/**
  ignoredPaths:
    - frontend/**/*.test.js
    - frontend/README.md
````

### Melhores Práticas

1. **Otimizar a saída da compilação**: minificar, compactar, agitar a árvore

2. **Use cabeçalhos de cache adequados**: cache longo para ativos com hash

3. **Adicione cabeçalhos de segurança**: proteja contra ataques comuns

4. **Configurar roteamento SPA**: adicionar regras de reescrita para roteamento de cliente

5. **Tratar 404s**: Crie uma página 404.html personalizada

---

## Serviços Privados (`type: pserv`)

### Objetivo

Serviços internos acessíveis apenas em sua conta Render. Não exposto à internet.

### Casos de uso

- **APIs internas**: serviços acessados apenas por outros serviços
- **Proxies de banco de dados**: pools de conexões, réplicas de leitura
- **Microsserviços**: arquiteturas de malha de serviço
- **Ferramentas administrativas**: painéis internos
- **Camadas de cache**: serviços de cache interno
- **Message Brokers**: filas de mensagens internas

### Principais características

- **Sem URL público**: acessível somente via DNS interno
- **Rede interna**: conexões rápidas e de baixa latência
- **Vinculação de porta necessária**: Deve vincular-se a `0.0.0.0:$PORT`
- **DNS privado**: `[nome-serviço].render-internal.com`
- **Somente na mesma conta**: acessível apenas na mesma conta
- **Sem acesso à Internet**: o tráfego permanece na rede Render

### Configuração necessária```yaml

type: pserv
name: internal-api
runtime: node
buildCommand: npm ci
startCommand: npm start

````
### Acessando Serviços Privados

De outros serviços na mesma conta:```javascript
// Use .render-internal.com domain
const API_URL = 'http://internal-api.render-internal.com:10000'
````

Ou use referências de serviço:```yaml
services:

- type: web
  name: frontend
  runtime: node
  envVars:
  - key: INTERNAL_API_URL
    fromService:
    name: internal-api
    type: pserv
    property: hostport

```
### Melhores Práticas

1. **Use DNS interno**: Sempre use domínios `.render-internal.com`

2. **Não é necessária autenticação**: Já está isolado na conta

3. **Comunicação rápida**: Baixa latência entre serviços

4. **Simplifique a arquitetura**: não há necessidade de balanceadores de carga externos

---

## Tabela de comparação

| Recurso | Rede | Trabalhador | Cron | Estático | Privado |
| ------------- | ------------ | --------------- | --------------- | ------------ | ----------------- |
| URL pública | ✅ Sim | ❌Não | ❌ Não | ✅ Sim | ❌ Não |
| Vinculação de Porto | ✅ Obrigatório | ❌ Não é necessário | ❌ Não é necessário | ❌N/A | ✅ Obrigatório |
| Verificações de saúde | ✅ Sim | ❌ Não

| ❌ Não | ❌N/A | ✅ Sim |
| Tempo de execução | ✅ Sim | ✅ Sim | ✅ Sim | ❌ Não | ✅ Sim |
| Persistente | ✅ Sim | ✅ Sim | ❌ Não | ✅ Sim | ✅ Sim |
| Dimensionamento | ✅ Sim | ✅ Sim | ❌ Não | ✅ Sim | ✅ Sim |
| Caso de uso | Servidores HTTP | Trabalhos em segundo plano | Tarefas agendadas | Arquivos estáticos | Serviço interno

ces |

## Escolhendo o tipo de serviço certo

**Use o serviço Web quando:**

- Seu aplicativo lida com solicitações HTTP
- Os usuários precisam acessá-lo via URL
- Você precisa de balanceamento de carga e escalonamento

**Use o serviço de trabalho quando:**

- Processamento de trabalhos em segundo plano
- Consumindo de filas de mensagens
- Executando processos de longa duração sem HTTP

**Use o Cron Job quando:**

- Executando tarefas agendadas
- O processamento não precisa estar sempre ativo
- As tarefas são executadas periodicamente (de hora em hora, diariamente, semanalmente)

**Use site estático quando:**

- Servindo HTML/CSS/JS pré-construído
- Não é necessário processamento de back-end
- Deseja cache CDN e entrega rápida

**Use o serviço privado quando:**

- Serviço acessado apenas por outros serviços
- Deseja comunicação apenas interna
- Construindo arquiteturas de microsserviços
```
