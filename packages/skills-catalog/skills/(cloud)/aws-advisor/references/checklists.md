# Listas de verificação e perguntas de descoberta

Coisas que a documentação do MCP não diz: questões dependentes do contexto, compensações e pontos de validação.

## Perguntas sobre descoberta de arquitetura

Pergunte isto antes de projetar:

### Contexto da pilha de tecnologia

- [] Qual idioma/tempo de execução a equipe prefere? (Nó, Python, Go, Java, etc.)
- [ ] Qual ferramenta IaC a equipe está usando? (Terraform, CDK, sem servidor, SAM, etc.)
- [ ] Existe algum projeto existente para integração?
- [] Qual é o pipeline de implantação? (Ações do GitHub, GitLab CI, CodePipeline, etc.)
- [] Alguma preferência de estrutura? (Expresso, FastAPI, NestJS, etc.)

### Contexto de negócios

- [ ] Que problema estamos resolvendo?
- [ ] Quem são os usuários? (interno, externo, B2B, B2C)
- [ ] Qual é o cronograma esperado?
- [ ] Qual é a faixa de orçamento?
- [ ] Existem sistemas existentes para integração?

### Requisitos Não Funcionais

- [] Meta de disponibilidade? (99,9%? 99,99%?)
- [] Requisitos de latência? (pág. 50, pág. 99)
- [] Expectativas de rendimento? (RPS, usuários simultâneos)
- [ ] Requisitos de retenção de dados?
- [] Requisitos de recuperação de desastres? (RTO, RPO)

### Restrições

- [ ] Conformidade regulatória? (HIPAA, PCI-DSS, GDPR, LGPD)
- [] Requisitos de residência de dados? (regiões específicas)
- [] Mandatos de tecnologia existentes?
- [ ] Habilidades e experiência da equipe?
- [ ] Preocupações com o aprisionamento do fornecedor?

### Crescimento e escala

- [ ] Taxa de crescimento esperada?
- [] Relação de pico vs carga média?
- [] Padrões sazonais?
- [ ] Necessidades multirregionais agora ou futuras?

## Lista de verificação de pré-produção

Antes de ir ao vivo:

### Segurança

- [] Todos os segredos no Secrets Manager ou Parameter Store
- [] As funções do IAM seguem o menor privilégio
- [] Nenhuma credencial codificada em qualquer lugar
- [] Criptografia em repouso habilitada (S3, RDS, EBS, DynamoDB)
- [] Criptografia em trânsito (TLS 1.2+)
- [] endpoints VPC para serviços AWS (se privados)
- [] Grupos de segurança revisados (sem 0.0.0.0/0 em portas sensíveis)
- [] WAF configurado (se voltado ao público)
- [] CloudTrail ativado
- [] GuardDuty ativado

### Observabilidade

- [] Alarmes do CloudWatch nas principais métricas
- [] Painéis para equipe de operações
- [] Agregação de log configurada
- [] Rastreamento de raio X ativado (se aplicável)
- [] Erro ao alertar para plantão

### Confiabilidade

- [] Implantação Multi-AZ
- [] Escalonamento automático configurado
- [] Verificações de integridade definidas
- [] Backups automatizados e testados
- [] Runbooks documentados
- [] Existe plano de resposta a incidentes

### Custo

- [] Alertas de orçamento configurados
- [] Tags de alocação de custos aplicadas
- [] Dimensionamento correto revisado
- [ ] Capacidade reservada avaliada (se em estado estacionário)
- [] Recursos não utilizados limpos

### Operações

- [] pipeline de CI/CD testado
- [] Procedimento de reversão documentado
- [] Estratégia de migração de banco de dados definida
- [] Sinalizadores de recursos para alterações arriscadas
- [] Teste de carga concluído

## Lista de verificação de revisão de segurança

###EU SOU

- [ ] Não há `*` em ARNs de recursos (seja específico)
- [] Não `*` em ações (use ações específicas)
- [] Condições usadas sempre que possível (IP, MFA, tags)
- [] Funções de serviço com escopo para recursos específicos
- [] O acesso entre contas usa ID externo
- [] Limites de permissão para administradores delegados

### Rede

- [] Sub-redes privadas para bancos de dados e servidores de aplicativos
- [] Gateway NAT para saída de sub-redes privadas
- [] registros de fluxo de VPC ativados
- [] Grupos de segurança: entrada apenas de fontes específicas
- [] NACLs como camada de backup (se necessário)
- [] Nenhum IP público, a menos que seja necessário

### Dados

- [ ] PII identificadas e protegidas
- [] Chaves de criptografia gerenciadas pelo cliente (se necessário)
- [] Criptografia de backup habilitada
- [] Replicação entre regiões criptografada
- [] Bloqueio S3 de acesso público ativado
- [] Políticas de bucket S3 revisadas

### Aplicação

- [] Validação de entrada em todas as entradas do usuário
- [] Codificação de saída para prevenção de XSS
- [] CORS configurado corretamente
- [] Limitação de taxa implementada
- [] Tokens de autenticação validados corretamente
- [] Gerenciamento de sessão seguro

### Registro e monitoramento

- [] Nenhum dado confidencial nos logs
- [] Retenção de log configurada
- [] Eventos de segurança acionam alertas
- [] Tentativas de login malsucedidas monitoradas
- [] Limitação de API monitorada

## Revisão de otimização de custos

### Computação

- [] Instâncias do tamanho certo (CPU, utilização de memória <70%?)
- [] Instâncias spot para cargas de trabalho tolerantes a falhas
- [] Planos Poupança ou Instâncias Reservadas para estado estacionário
- [] Memória Lambda otimizada (ajuste de energia)
- [] Graviton (ARM) considerado para cargas de trabalho compatíveis

### Armazenamento

- [] Políticas de ciclo de vida S3 (transição para IA, Glacier)
- [] volumes EBS dimensionados corretamente
- [] Instantâneos EBS não utilizados limpos
- [] S3 Intelligent-Tiering para padrões de acesso desconhecidos

### Banco de dados

- [] Classe de instância do tamanho certo
- [ ] Capacidade reservada para produção
- [] Aurora Serverless v2 para cargas de trabalho variáveis
- [] DynamoDB sob demanda versus provisionado avaliado
- [] Leia réplicas somente se necessário

### Rede

- [] Uso do gateway NAT minimizado (caro!)
- [] VPC endpoints para chamadas de API da AWS de alto volume
- [] CloudFront para conteúdo estático (reduz a carga de origem)
- [] Transferência de dados entre regiões minimizada

### Geral

- [] Recursos não utilizados identificados e removidos
- [] Detecção de anomalia de custo habilitada
- [] Estratégia de etiquetagem para alocação de custos
- [] Revisões regulares de custos agendadas

## Compensações a serem discutidas

### Seleção de ferramenta IaC

| Fator                      | Sem servidor/SST | SAM       | CDK   | Terraforma |
| -------------------------- | ---------------- | --------- | ----- | ---------- |
| Velocidade de configuração | Rápido           | Rápido    | Médio | Médio      |
| Curva de aprendizagem      | Baixo            | Baixo     | Médio | Médio      |
| Foco sem servidor          | Excelente        | Excelente | Bom   | Bom        |
| Não sem servidor           | Limitado         |

| Limitado | Excelente | Excelente |
| Desenvolvedor local | Bom (SST) | Bom | Limitado | N/A |
| Multinuvem | Não | Não | Não | Sim |
| Adoção em equipe | Fácil | Fácil | Precisa de treinamento | Precisa de treinamento |
| Suporte AWS | Comunidade | AWS | AWS | Comunidade |

### Sem servidor versus contêineres

| Fator                   | Sem servidor       | Recipientes                  |
| ----------------------- | ------------------ | ---------------------------- |
| Arranque a frio         | Sim (pode mitigar) | Não                          |
| Execução máxima         | 15 minutos         | Ilimitado                    |
| Custo com baixo tráfego | Inferior           | Superior (capacidade mínima) |
| Custo com alto tráfego  | Pode ser maior     | Frequentemente inferior      |
| Despesas operacionais   | Mais baixo         |

| Superior |
| Personalização | Limitado | Controle total |

###SQL x NoSQL

| Fator           | SQL                              | NoSQL (DynamoDB)        |
| --------------- | -------------------------------- | ----------------------- |
| Esquema         | Corrigido, migrações necessárias | Flexível                |
| Consultas       | Junções complexas, ad hoc        | Padrão de acesso focado |
| Transações      | ÁCIDO completo                   | Limitado (mesa única)   |
| Dimensionamento | Vertical (limitado)              | Horizontal (ilimitado)  |
| Modelo de custo | Por hora                         |

| Por pedido/capacidade |

### Região única versus multirregião

| Fator                  | Único         | Multi                  |
| ---------------------- | ------------- | ---------------------- |
| Complexidade           | Baixo         | Alto                   |
| Custo                  | Inferior      | Superior (2x+ infra)   |
| Disponibilidade        | 99,99% máximo | 99,999%+ possível      |
| Latência               | Uma região    | Baixa latência global  |
| Consistência dos dados | Simples       | Complexo (teorema CAP) |

### Gerenciado vs Autogerenciado

| Fator                 | Serviço Gerenciado  | Autogerenciado                    |
| --------------------- | ------------------- | --------------------------------- |
| Despesas operacionais | Baixo               | Alto                              |
| Personalização        | Limitado            | Completo                          |
| Custo                 | Previsível, premium | Variável, potencialmente inferior |
| Dimensionamento       | Automático          | Manual ou cu                      |

estômago |
| Atualizações/Patchs | Automático | Sua responsabilidade |

## Armadilhas Comuns

### Arquitetura

- Projetar para uma escala que você ainda não possui (excesso de engenharia)
- Não projetar para a escala que você terá (subengenharia)
- Ignorando a complexidade operacional
- Escolher tecnologia com base no hype, não no ajuste

### Segurança

- Políticas de IAM excessivamente permissivas "para fazer funcionar"
- Esquecer de alternar credenciais
- Não habilitar a criptografia “porque é interna”
- Grupos de segurança com 0.0.0.0/0 "temporariamente"

### Custo

- Deixar recursos de desenvolvimento/teste em execução
- Não utilizar Planos de Poupança para produção
- Gateway NAT para tudo (caro!)
- Instâncias superdimensionadas "por precaução"

### Operações

- Sem runbooks antes da produção
- Sem alerta até que algo quebre
- Nenhum teste de carga até o lançamento
- Sem plano de reversão
