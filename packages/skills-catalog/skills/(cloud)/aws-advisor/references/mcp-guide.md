# Guia de uso do MCP

Padrões eficientes para ferramentas AWS MCP para minimizar tokens e maximizar a precisão.

## aws\_\_\_search_documentation

### Otimização de consulta

**Boas consultas** (específicas, 2 a 5 palavras):```
"Lambda cold start optimization"
"S3 bucket policy examples"
"DynamoDB single table design"
"ECS Fargate networking"

````

**Consultas incorretas** (muito vagas ou detalhadas):```
"How do I make my Lambda faster" → Too conversational
"AWS" → Too broad
"I need to understand how to configure..." → Too verbose
````

### Matriz de seleção de tópicos

| O usuário diz                  | Tópico                    | Exemplo de consulta             |
| ------------------------------ | ------------------------- | ------------------------------- |
| "Como faço para usar o SDK..." | `referência_documentação` | "S3 PutObject SDK v3"           |
| "Novidades em..."              | `consciência_atual`       | "Recursos do Lambda 2024"       |
| "Obtendo erro..."              | `solução de problemas`    | "GetObject S3 de acesso negado" |

| "CDK como fazer..

." | `cdk_docs` | "CDK Lambda Python" |
| "Exemplo de CDK..." | `cdk_constructs` | "API Gateway Lambda CDK" |
| "CloudFormação..." | `formação de nuvem` | "Modelo de tabela do DynamoDB" |
| "Melhores práticas..." | `geral` | "padrões de segurança sem servidor" |

### Pesquisas multitópicos

Use vários tópicos (máximo de 3) quando a consulta abrange áreas:```python

# User: "How do I fix this Lambda timeout and what's the best practice?"

topics=["troubleshooting", "general"]
query="Lambda timeout"

# User: "Show me CDK examples and explain the concepts"

topics=["cdk_constructs", "cdk_docs"]
query="Lambda function CDK"

````
## aws\_\_\_read_documentation

### Quando usar

- O snippet retornado pela pesquisa não é suficiente
- Precisa de exemplos de código completos
- Necessidade de entender o contexto completo

### Paginação para documentos longos```python
# First call
aws___read_documentation(url="...", max_length=5000)

# If truncated, continue
aws___read_documentation(url="...", start_index=5000, max_length=5000)
````

**Pare cedo** se você encontrou a resposta - não leia o documento inteiro.

## aws\_\_\_get_regional_availability

### Padrões de consulta

**Consulte disponibilidade do serviço**:```python
resource_type="product"
filters=["Amazon Aurora Serverless v2", "AWS AppSync"]
region="sa-east-1"

````

**Verifique a disponibilidade da API**:```python
resource_type="api"
filters=["Lambda+CreateFunction", "S3+PutObject"]
region="eu-west-1"
````

**Verifique o suporte do CloudFormation**:```python
resource_type="cfn"
filters=["AWS::Lambda::Function", "AWS::DynamoDB::GlobalTable"]
region="ap-southeast-1"

````
### Casos de uso comuns

1. **Antes de recomendar um serviço**: verifique se ele está disponível na região do usuário
2. **Arquiteturas multirregionais**: verifique a consistência entre regiões
3. **Novos recursos**: verifique o status de implementação regional

## aws\_\_\_recomendar

### Quando usar

- Depois de ler um documento, encontre conteúdo relacionado
- Descubra "Novos" recursos para um serviço
- Encontre as próximas páginas comumente visualizadas```python
# Find new Lambda features
aws___recommend(url="https://docs.aws.amazon.com/lambda/latest/dg/welcome.html")
# Check "New" category in results
````

## MCPs do AWS Marketplace

###ask_aws_marketplace

Use para descoberta de soluções de terceiros:```python

# Good queries

"monitoring tools for Kubernetes"
"log management SOC2 compliant"
"compare Datadog vs New Relic"

# Bad queries

"AWS Lambda" → Use Knowledge MCP instead
"How do I..." → Not for how-to questions

````
### Padrão de pesquisa```python
# Initial call
response = ask_aws_marketplace(query="...")

# Poll until complete
while response.next_cursor:
    response = ask_aws_marketplace(
        last_request_id=response.request_id,
        cursor=response.next_cursor
    )
    # Display each message immediately to user!

# Then get structured report
report = get_aws_marketplace_recommendations_report(last_request_id=response.request_id)
````

## Dicas de otimização de token

1. **Pesquise antes de ler**: os resultados da pesquisa geralmente têm contexto suficiente
2. **Consultas específicas**: menos resultados = menos para processar
3. **Tópico certo**: Evite o geral quando existir um tópico específico
4. **Pare mais cedo**: não pagina se a resposta for encontrada
5. **Armazenar em cache mentalmente**: não pesquise a mesma coisa na conversa
