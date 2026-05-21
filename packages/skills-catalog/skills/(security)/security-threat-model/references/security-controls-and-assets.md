# Controles de segurança e categorias de ativos

Use isso como uma lista de verificação leve para manter os resultados consistentes entre as equipes. Prefira itens concretos e específicos do sistema a textos genéricos.

## Categorias de ativos (escolha apenas o que se aplica)

- Dados do usuário (PII, conteúdo, uploads)
- Artefatos de autenticação (senhas, tokens, sessões, cookies)
- Estado de autorização (funções, políticas, ACLs)
- Segredos e chaves (chaves de API, chaves de assinatura, chaves de criptografia)
- Configuração e sinalizadores de recursos
- Modelos e pesos (se sistemas ML)
- Código-fonte e artefatos de construção
- Logs de auditoria e telemetria
- Recursos críticos para disponibilidade (filas, caches, limites de taxa, orçamentos de computação)
- Limite de isolamento do inquilino

s e metadados

## Categorias de controle de segurança

- Identidade e acesso: authN, authZ, manipulação de sessões, mTLS, rotação de chaves
- Proteção de entrada: validação de esquema, proteção de análise, verificação de upload, sandbox
- Proteções de rede: TLS, políticas de rede, WAF, limitação de taxa, controles DoS
- Proteção de dados: criptografia em repouso/em trânsito, tokenização, redação
- Isolamento: sandbox de processo, limites de contêiner, isolamento de locatário, seccomp
- Observabilidade: logs de auditoria, alertas, detecção de anomalias,

resistência à violação

- Cadeia de suprimentos: fixação de dependência, SBOMs, proveniência, assinatura
- Controle de alterações: verificações de CI, aprovações de implantação, proteções de configuração

## Padrões de fraseado de mitigação

- "Aplicar esquema em <limite> para <carga útil> antes de <componente>."
- "Exigir verificação authZ para <ação> em <recurso> em <serviço>."
- "Isolar <parser/component> em uma sandbox com <limites de recursos>."
- "Limite de taxa <endpoint> por <key> e aplique limites de intermitência."
- "Criptografar <dados> em repouso usando <gerenciamento de chaves> e girar <chaves>."
