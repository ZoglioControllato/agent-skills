# Habilidade de identificação de subdomínio

Uma habilidade de agente para identificar subdomínios e sugerir contextos limitados em qualquer base de código seguindo os princípios de design estratégico de design orientado a domínio (DDD).

## O que essa habilidade faz

Esta habilidade analisa bases de código para:

1. **Extraia conceitos de negócios** do código (entidades, serviços, casos de uso, controladores)
2. **Agrupar conceitos por linguagem ubíqua** (vocabulário de negócios)
3. **Identifique os subdomínios** e classifique-os como Principais, de Suporte ou Genéricos
4. **Avalie a coesão** dentro e entre domínios
5. **Detecte problemas de baixa coesão** e problemas de acoplamento
6. **Sugerir contextos delimitados** com limites linguísticos claros
7. **Forneça recomendações práticas** para fazer

separação principal

## Quando o agente usa esta habilidade

O agente aplica essa habilidade automaticamente quando você:

- Peça para analisar os limites do domínio
- Solicitar identificação de subdomínio
- Precisa de ajuda com design estratégico de DDD
- Deseja avaliar a coesão do domínio
- Pergunte sobre contextos limitados
- Discutir a refatoração orientada por domínio
- Informe-se sobre recursos de negócios em código

## Principais recursos

### Genérico e portátil

Esta habilidade foi projetada para funcionar com **qualquer base de código** em qualquer linguagem:

- Sem suposições específicas da estrutura
- Princípios independentes de linguagem
- Concentra-se em conceitos de negócios, não em implementação técnica
- Pode analisar monólitos, microsserviços ou arquiteturas híbridas

### Fundação de Design Estratégico DDD

Baseado em princípios comprovados de Design Orientado a Domínio:

- **Espaço do problema**: identifica subdomínios (principal, de suporte, genérico)
- **Espaço de solução**: sugere contextos limitados com limites claros
- **Linguagem onipresente**: driver principal para detecção de limites
- **Análise de coesão**: métricas objetivas para relacionamentos de domínio

### Resultado acionável

Fornece análises concretas e acionáveis:

- Mapas de domínio com pontuações de coesão
- Matrizes de coesão entre domínios
- Relatórios sobre questões de baixa coesão com prioridades
- Sugestões de contexto limitadas com padrões de integração
- Recomendações claras para melhoria

## Arquivos incluídos

### SKILL.md (habilidade principal)

O arquivo de habilidade principal contendo:

- Processo de análise completo (6 fases)
- Regras de classificação de subdomínios
- Quadro de avaliação da coesão
- Regras de detecção de baixa coesão
- Modelos de formato de saída
- Melhores práticas e antipadrões

### EXAMPLES.md (Exemplos Práticos)

Exemplos do mundo real em diferentes domínios:

- Plataforma de comércio eletrônico
- Sistema de Saúde
- Ferramenta de gerenciamento de projetos SaaS
- Plataforma de streaming de vídeo
- Padrões e soluções comuns
- Modelo de análise rápida

### QUICK-REFERENCE.md (pesquisa rápida)

Referência rápida para cenários comuns:

- Árvores de decisão para classificação
- Atalhos de pontuação de coesão
- Bandeiras vermelhas e sinais
- Guia de padrões de integração
- Erros comuns a evitar
- Perguntas-chave para avaliação

## Exemplos de uso

### Exemplo 1: Analise toda a base de código```

User: "Analyze the domains in this codebase and suggest bounded contexts"

Agent: [Uses skill to:]

1. Extract all business concepts
2. Group by Ubiquitous Language
3. Identify subdomains
4. Calculate cohesion scores
5. Detect issues
6. Suggest bounded contexts

````
### Exemplo 2: Verifique o módulo específico```
User: "Is the billing module properly separated from other domains?"

Agent: [Uses skill to:]
1. Analyze billing module concepts
2. Check cross-domain dependencies
3. Assess linguistic cohesion
4. Flag coupling issues
5. Recommend improvements
````

### Exemplo 3: Classificar subdomínio```

User: "Should our recommendation engine be Core or Supporting?"

Agent: [Uses skill to:]

1. Ask: Is it competitive advantage?
2. Assess business differentiation
3. Check complexity & change frequency
4. Classify using decision tree
5. Explain classification

````
## Conceitos Básicos

### Tipos de subdomínio

**Domínio principal**

- Sua vantagem competitiva
- O que torna seu negócio único
- Requer os melhores desenvolvedores e especialistas em domínio
- Exemplo: algoritmo de recomendação da Netflix

**Subdomínio de suporte**

- Essencial, mas não diferenciador
- Específico do negócio, mas não exclusivo
- Suporta o domínio principal
- Exemplo: regras personalizadas de gerenciamento de inventário

**Subdomínio genérico**

- Funcionalidade comum
- Pode ser terceirizado ou adquirido
- Soluções bem compreendidas
- Exemplo: Autenticação de usuário, envio de e-mail

### Pontuação de Coesão

A habilidade usa uma escala de coesão de 10 pontos:```
Score = Linguistic (0-3) + Usage (0-3) + Data (0-2) + Change (0-2)

8-10: High Cohesion ✅ (Strong subdomain candidate)
5-7:  Medium Cohesion ⚠️ (Review boundaries)
0-4:  Low Cohesion ❌ (Wrong grouping, needs separation)
````

### Contexto limitado

Uma fronteira linguística explícita onde todos os termos do domínio têm significados específicos e inequívocos:

- Driver principal: **linguagem comercial**, não arquitetura técnica
- Objetivo: Alinhar 1 subdomínio a 1 contexto limitado
- Integração: Use interfaces, eventos ou APIs entre contextos
- Tamanho: Tão grande quanto necessário para expressar a linguagem onipresente completa

## Princípios Chave

1. **Linguagem sobre Arquitetura**: Contextos limitados são limites linguísticos, não técnicos
2. **Negócios acima do técnico**: foco nos recursos de negócios, não na estrutura do código
3. **Coesão é Mensurável**: Use métricas objetivas, não intuição
4. **O contexto é rei**: o mesmo termo pode significar coisas diferentes em contextos diferentes
5. **A integração é necessária**: algumas dependências entre domínios são normais e íntegras

## Antipadrões detectados

A habilidade identifica erros comuns:

- **Big Ball of Mud**: Tudo conectado a tudo
- **Modelo Tudo Incluído**: Tentando criar um modelo global único
- **Conceitos linguísticos mistos**: Vocabulários diferentes no mesmo contexto
- **Acoplamento rígido entre domínios**: referências diretas de entidade entre domínios
- **Genérico no núcleo**: preocupações de infraestrutura na lógica de negócios
- **Limites pouco claros**: não é possível determinar qual domínio possui o conceito

## Padrões de Integração

A habilidade sugere padrões de integração apropriados:

- **Eventos de domínio**: para consistência eventual e dissociada
- **API/Interface**: para integração síncrona com contrato claro
- **Camada Anticorrupção**: Para proteção contra sistemas externos
- **Idioma publicado**: para integração estável e documentada
- **Cliente/Fornecedor**: Para relacionamentos upstream/downstream claros

## Instalação

Esta habilidade é instalada no nível do projeto no diretório de habilidades do seu agente:```
.{agent}/skills/subdomain-identification/

````
Onde `{agent}` é o diretório do seu agente (por exemplo, `.cursor/`, `.claude/`, `.agent/`, `.github/`, `.opencode/`).

Isso significa que é:

- **Compartilhado com o repositório**: qualquer pessoa que clonar este repositório obtém a habilidade
- **Controlado por versão**: as alterações são rastreadas no git
- **Específico do projeto**: pode ser personalizado para esta base de código

O agente irá descobri-lo e usá-lo automaticamente quando apropriado, com base na descrição no frontmatter.

## Personalização

### Para domínios específicos do projeto

Se o seu projeto tiver padrões de domínio específicos, crie uma referência no nível do projeto:```
.{agent}/skills/subdomain-identification/
└── project-domains.md  # Document project-specific patterns
````

Link para ele a partir de suas solicitações de análise.

### Para análise específica da estrutura

Adicione padrões específicos da estrutura para ajudar na habilidade:```markdown

## Framework: NestJS

**Entity Pattern**: `@Entity()` decorator
**Service Pattern**: `@Injectable()` classes ending in `Service`
**Controller Pattern**: `@Controller()` decorator
**Use Case Pattern**: Classes ending in `UseCase`

````
## Validação

Para verificar se a habilidade funciona corretamente, tente:```
User: "What subdomains can you identify in this codebase?"
````

O agente deverá:

1. Leia o arquivo SKILL.md
2. Siga o processo de análise de 6 fases
3. Mapas de domínio de saída e matrizes de coesão
4. Forneça recomendações práticas

## Referências

Esta habilidade é baseada em:

- **Design baseado em domínio** por Eric Evans
- **Implementando Design Orientado a Domínio** por Vaughn Vernon
- Princípios de Design Estratégico da comunidade DDD

## Licença

Esta habilidade pode ser usada, modificada e compartilhada livremente. Ele foi projetado para ser portátil em qualquer base de código ou organização.

## Contribuindo

Para melhorar esta habilidade:

1. Adicione mais exemplos a `EXAMPLES.md`
2. Expanda a referência rápida com novos padrões
3. Adicione padrões de detecção específicos de linguagem/estrutura
4. Documente novos antipadrões ou sinais de alerta
5. Compartilhe estudos de caso do mundo real

## Versão

**Versão**: 1.0.0  
**Criado**: 05/02/2026  
**Baseado em**: Teoria do Design Estratégico DDD

---

## Início rápido

Para usar esta habilidade imediatamente:```
User: "Analyze domains in my codebase"
User: "Identify subdomains and suggest bounded contexts"
User: "Check cohesion between [DomainA] and [DomainB]"
User: "Is [concept] Core, Supporting, or Generic?"

```
O agente aplicará automaticamente essa habilidade e fornecerá uma análise abrangente.
```
