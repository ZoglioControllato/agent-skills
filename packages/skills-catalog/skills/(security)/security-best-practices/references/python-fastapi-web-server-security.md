# Especificação de segurança da Web FastAPI (Python) (FastAPI 0.128.x, Python 3.x) ([PyPI][1])

Este documento foi concebido como uma **especificação de segurança** que oferece suporte a:

1. **Geração de código seguro por padrão** para novo código FastAPI.
2. **Revisão de segurança/caça de vulnerabilidades** no código FastAPI existente (passivo “notificar problemas durante o trabalho” e ativo “verificar o repositório e relatar descobertas”).

Ele é intencionalmente escrito como um conjunto de **requisitos normativos** (“DEVE/DEVE/PODE”) mais **regras de auditoria** (como são os padrões ruins, como detectá-los e como corrigi-los/mitigá-los).

FastAPI é comumente implantado com um servidor ASGI (por exemplo, Uvicorn) e é construído em Starlette + Pydantic, portanto, esta especificação cobre as camadas onde elas afetam a segurança. ([PyPI][1])

---

## 0) Segurança, limites e restrições antiabuso (DEVE SEGUIR)

- NÃO DEVE solicitar, gerar, registrar ou confirmar segredos (chaves de API, senhas, chaves privadas, cookies de sessão, chaves de assinatura, URLs de banco de dados com credenciais).
- NÃO DEVE “consertar” a segurança desabilitando proteções (por exemplo, enfraquecendo a autenticação, tornando o CORS permissivo, ignorando verificações de assinatura, desabilitando a validação, desligando a verificação TLS, adicionando `allow_origins=["*"]` com credenciais).
- DEVE fornecer **descobertas baseadas em evidências** durante as auditorias: citar caminhos de arquivos,

trechos de código e valores de configuração que justificam a afirmação.

- DEVE tratar a incerteza com honestidade: se existir uma proteção na infraestrutura (proxy reverso, WAF, CDN, service mesh), relate-a como “não visível no código do aplicativo; verifique em tempo de execução/configuração”.
- DEVE tratar os controles do navegador corretamente:
  - CORS **não** é um mecanismo de autenticação; afeta apenas os navegadores.
  - As defesas CSRF se aplicam quando o navegador anexa automaticamente credenciais (cookies); eles

geralmente não são relevantes para APIs puramente de token de cabeçalho. ([Série de folhas de dicas OWASP] [2])

---

## 1) Modos de operação

### 1.1 Modo de geração (padrão)

Quando solicitado a escrever um novo código FastAPI ou modificar o código existente:

- DEVE seguir todos os requisitos **DEVE** nesta especificação.
- DEVE seguir todos os requisitos **DEVE**, a menos que o usuário diga explicitamente o contrário.
- DEVE preferir APIs seguras por padrão e bibliotecas comprovadas em vez de código de segurança personalizado.
- DEVE evitar a introdução de novos coletores arriscados (execução de shell, desserialização insegura, avaliação dinâmica, renderização de modelo não confiável, serviço de arquivo inseguro, redirecionamentos inseguros, busca de saída arbitrária).

### 1.2 Modo de revisão passiva (sempre ativado durante a edição)

Ao trabalhar em qualquer lugar em um repositório FastAPI (mesmo que o usuário não tenha solicitado uma verificação de segurança):

- DEVE “notar” violações desta especificação no código tocado/próximo.
- DEVE mencionar os problemas à medida que surgem, com uma breve explicação + solução segura.

### 1.3 Modo de auditoria ativo (solicitação de verificação explícita)

Quando o usuário pede para “verificar”, “auditar” ou “caçar vulnerabilidades”:

- DEVE pesquisar sistematicamente a base de código em busca de violações desta especificação.
- DEVE apresentar os resultados num formato estruturado (ver §2.3).

Ordem de auditoria recomendada:

1. Pontos de entrada de aplicativos / scripts de implantação / Dockerfiles / Procfiles / Helm/terraform.
2. Configuração do servidor ASGI (Uvicorn/Gunicorn), configurações de proxy, configurações de depuração/recarregamento.
3. Configuração do aplicativo FastAPI (exposição de documentos, middleware, hosts confiáveis, CORS).
4. Design Authn/Authz (dependências, manipulação de JWT/sessão, armazenamento de senha).
5. Uso de cookies/sessão + CSRF (se cookies forem usados).
6. Validação de entrada e modelagem de saída (modelos Pydantic, atribuição em massa

investimento, exposição excessiva de dados). 7. Renderização de modelo e XSS/SSTI (se HTML for veiculado). 8. Manipulação de arquivos (uploads + downloads), StaticFiles, suporte a intervalos. 9. Classes de injeção (SQL, execução de comandos, desserialização insegura). 10. Solicitações de saída (SSRF), manipulação de redirecionamento, segurança WebSockets.

---

## 2) Definições e orientações de revisão

### 2.1 Entrada não confiável (tratada como controlada pelo invasor, salvo prova em contrário)

Os exemplos incluem:

- Parâmetros de consulta/parâmetros de caminho
- Corpos JSON (incluindo campos aninhados)
- Cabeçalhos (incluindo `Host`, `Origin`, `X-Forwarded-*`)
- Cookies (incluindo cookies de sessão)
- Uploads de arquivos (partes múltiplas)
- Mensagens WebSocket, parâmetros de consulta e cabeçalhos durante o handshake ([Starlette][3])
- Quaisquer dados de sistemas externos (webhooks, APIs de terceiros, filas de mensagens)
- Qualquer conteúdo de usuário persistente (linhas de banco de dados) originado de usuários

### 2.2 Solicitação de mudança de estado

Uma solicitação muda de estado se puder criar/atualizar/excluir dados, alterar o estado de autenticação/sessão, acionar efeitos colaterais (compra, envio de e-mail, envio de webhook) ou iniciar ações privilegiadas.

### 2.3 Formato de descoberta de auditoria necessário

Para cada problema encontrado, produza:

- ID da regra:
- Gravidade: Crítica / Alta / Média / Baixa
- Localização: caminho do arquivo + nome da função/rota + linha(s)
- Evidência: o trecho de código/configuração exato
- Impacto: o que pode dar errado, quem pode explorar
- Correção: mudança segura (prefira diferença mínima)
- Mitigação: defesa profunda se a solução imediata for difícil
- Notas falso-positivas: o que verificar em caso de incerteza

---

## 3) Linha de base segura: configuração mínima de produção (DEVE em produção)

Esta é a menor “linha de base de produção” que evita configurações incorretas comuns de FastAPI/ASGI.

Metas básicas:

- Sem rastreamentos de depuração ou recarga automática na produção. ([PyPI][4])
- Execute sob uma configuração de servidor ASGI de produção (trabalhadores, tempos limite, controles de recursos). ([PyPI][4])
- Validação de cabeçalho de host habilitada (TrustedHostMiddleware ou equivalente). ([PyPI][5])
- CORS desativado, a menos que seja explicitamente necessário; se ativado, é estrito e tem menos privilégios. ([Série de folhas de dicas OWASP] [6])
- A autenticação é aplicada de forma consistente por meio de dependências (não “oops, esqueci a autenticação neste

rota”). ([FastAPI][7])

- Se forem utilizados cookies/sessões, os sinalizadores de cookies são seguros e o CSRF é abordado. ([Série de folhas de dicas OWASP] [8])
- Limites de tamanho de solicitação e limites multipartes existem na borda e são validados no aplicativo conforme necessário (para mitigar DoS de memória/CPU). ([advisories.gitlab.com][9])
- As dependências são corrigidas imediatamente, especialmente Starlette/python-multipart (existem historicamente vários avisos de DoS e de passagem). ([advisories.gitlab.com]

[10])

---

## 4) Regras (geração + auditoria)

Cada regra contém: práticas necessárias, padrões inseguros, dicas de detecção e correção.

### FASTAPI-DEPLOY-001: Não use modos de servidor de recarga automática/somente dev em produção

Gravidade: Alta (se produção)

Obrigatório:

- NÃO DEVE executar a produção usando o modo de recarga automática/observação (por exemplo, recarga do Uvicorn).
- DEVE ser executado com um modelo de processo de produção (por exemplo, vários trabalhadores, quando apropriado) e configurações de servidor estáveis. ([PyPI][4])

Padrões inseguros:

- `uvicorn ... --reload` (ou configurações equivalentes “reload=True”) em pontos de entrada de produção.
- Comandos Docker/Procfile/systemd que são executados com `--reload` em produção.

Dicas de detecção:

- Procure por `--reload`, `reload=True`, `watchfiles`, `fastapi dev`, scripts de execução de “desenvolvimento”.
- Verifique Docker CMD/ENTRYPOINT, Procfile, unidades systemd, scripts de shell.

Correção:

- Remover recarga em produção; execute Uvicorn/Gunicorn com configurações estáveis ​​e configuração de trabalhador explícita. ([PyPI][4])

Nota:

- Recarregar é bom para o desenvolvimento local. Sinalize apenas quando for claramente usado como ponto de entrada de produção.

---

### FASTAPI-DEPLOY-002: O modo de depuração DEVE ser desabilitado na produção

Gravidade: Crítica

Obrigatório:

- NÃO DEVE ativar rastreamentos de depuração na produção (o modo de depuração FastAPI/Starlette pode expor componentes internos confidenciais e facilitar algumas cadeias de exploração). ([PyPI][5])
- DEVE tratar qualquer configuração que retorne rastreamentos de pilha detalhados aos clientes como confidenciais.

Padrões inseguros:

- `app = FastAPI(debug=True)` (ou Starlette `debug=True`), ou alternadores de ambiente equivalentes, permitindo a depuração na produção. ([PyPI][5])
- Configuração de servidor/log que expõe tracebacks aos usuários finais.

Dicas de detecção:

- Procure por `debug=True`, `DEBUG = True`, sinalizadores de ambiente mapeados para depuração.
- Revise a configuração do middleware de exceção e do manipulador de erros.

Consertar:

- Certifique-se de que a depuração esteja habilitada apenas no desenvolvimento/teste local.
- Retornar respostas genéricas de erros aos clientes; registrar detalhes internamente.

---

### FASTAPI-OPENAPI-001: OpenAPI e documentos interativos DEVEM ser desabilitados ou protegidos na produção

Gravidade: Média (pode ser Alta em aplicativos confidenciais/internos)

Obrigatório:

- DEVE desabilitar `/docs`, `/redoc` e `/openapi.json` na produção para serviços voltados ao público, a menos que haja uma necessidade comercial explícita.
- Se ativado, DEVE protegê-los (por exemplo, autenticação, listas de permissões de rede ou roteamento somente interno).
- NÃO DEVE assumir “segurança através da obscuridade”; trate a exposição de documentos como um amplificador de divulgação de informações.

Padrões inseguros:

- `/docs` e `/openapi.json` publicamente acessíveis para APIs internas/administrativas.
- Documentos habilitados no mesmo nome de host da produção sem controle de acesso.

Dicas de detecção:

- Procure por `FastAPI(docs_url=..., redoc_url=..., openapi_url=...)` ou padrões.
- Verifique o roteamento de proxy reverso e as listas de permissões.

Correção:

- Desative endpoints de documentos em prod (`docs_url=None`, `redoc_url=None`, `openapi_url=None`) ou restrinja o acesso na borda.

---

### FASTAPI-AUTH-001: A autenticação DEVE ser explícita e aplicada de forma consistente por meio de dependências

Gravidade: Alta

Obrigatório:

- DEVE implementar a autenticação como uma dependência (ou dependência no nível do roteador) para que os endpoints protegidos não possam “esquecer” a autenticação.
- DEVE ser padronizado como “deny” para roteadores/endpoints privilegiados; marcar explicitamente rotas verdadeiramente públicas.
- DEVE centralizar a aplicação de autenticação nos limites do roteador (por exemplo, `APIRouter` protegido para endpoints autenticados). ([FastAPI][7])

Padrões inseguros:

- Verificações de autenticação ad-hoc por rota espalhadas pelos manipuladores (fáceis de perder).
- Uma mistura de endpoints protegidos/desprotegidos sem uma política clara.

Dicas de detecção:

- Identificar roteadores e endpoints; verifique se os protegidos incluem `Depends(...)`/`Security(...)`.
- Procure padrões como `if user is None: raise ...` dentro de manipuladores (em vez de dependências).

Consertar:

- Mova a autenticação para uma dependência e anexe-a ao roteador/endpoint de forma consistente usando `Depends()`/`Security()`. ([FastAPI][7])

---

### FASTAPI-AUTH-002: Use transportes de autenticação padrão; evite segredos em URLs

Gravidade: Alta

Obrigatório:

- DEVE usar o cabeçalho `Authorization: Bearer <token>` para autenticação de token, não parâmetros de consulta. ([FastAPI][11])
- NÃO DEVE colocar segredos (tokens, links de redefinição contendo segredos de longa duração, chaves de API) em strings de consulta quando evitável.

Padrões inseguros:

- `?token=...`, `?api_key=...`, `?auth=...` usado para autenticação primária.
- Tokens de acesso de longa duração incorporados em URLs (vazamento via logs, referenciadores, caches).

Dicas de detecção:

- Pesquise nomes de parâmetros como `token`, `api_key`, `key`, `secret`, `password`.
- Procure esquemas de segurança que utilizem chaves de API de consulta sem justificativa.

Correção:

- Mover tokens para cabeçalhos de autorização; girar/encurtar a vida útil; use corpos POST para valores confidenciais.

---

### FASTAPI-AUTH-003: O armazenamento de senha DEVE ser fortemente hash; nunca armazene senhas em texto simples

Gravidade: Crítica

Obrigatório:

- DEVE armazenar senhas usando um esquema de hashing de senha forte e lento (por exemplo, Argon2id, bcrypt).
- NÃO DEVE armazenar senhas em texto simples ou criptografia reversível como proteção primária.
- DEVE usar bibliotecas estabelecidas para hashing e verificação (não crie as suas próprias).

Padrões inseguros:

- Armazenamento de senhas em texto simples no banco de dados.
- Usar hashes rápidos (por exemplo, SHA256) sem um hash de senha adequado KDF.
- Retornando hashes de senha nas respostas da API.

Dicas de detecção:

- Pesquise os campos persistentes `password=` e procure o uso de `hashlib.md5/sha1/sha256` nas senhas.
- Inspecione modelos de resposta para campos de senha/hash.

Correção:

- Migrar para uma biblioteca adequada de hashing de senhas; adicione um caminho de atualização de novo hash no login.

---

### FASTAPI-AUTH-004: A validação do JWT DEVE ser rigorosa; JWTs NÃO DEVEM conter segredos

Gravidade: Alta

Obrigatório:

- DEVE validar a assinatura JWT e impor uma lista de permissões de algoritmo.
- DEVE validar declarações padrão apropriadas ao seu sistema (pelo menos `exp`; normalmente também `iss`/`aud` se for multiserviço ou multilocatário).
- DEVE tratar o conteúdo do JWT como legível pelo cliente; não coloque segredos em cargas JWT. ([FastAPI][12])

Padrões inseguros:

- `jwt.decode(..., options={"verify_signature": False})` ou equivalente.
- Aceitando `alg=none`/confusão de algoritmo.
- Usando carga JWT para armazenar segredos confidenciais (chaves de API, senhas).

Dicas de detecção:

- Pesquise `jwt.decode`, `python-jose`, `PyJWT`, `verify_signature`.
- Verifique se há validação de exp ausente ou expirações longas.

Consertar:

- Aplicar validação rigorosa (assinatura, algoritmos permitidos, exp e quaisquer restrições necessárias de emissor/público).
- Armazene apenas identificadores/declarações que você se sinta confortável em expor ao cliente. ([FastAPI][12])

---

### FASTAPI-AUTHZ-001: A autorização DEVE ser aplicada por objeto e por propriedade

Gravidade: Alta

Obrigatório:

- DEVE realizar autorização em nível de objeto sempre que acessar um recurso por identificador controlado pelo usuário (ID no caminho/consulta/corpo).
- DEVE realizar autorização em nível de propriedade e modelagem de resposta para evitar “exposição excessiva de dados” (por exemplo, campos somente de administrador). ([Fundação OWASP][13])

Padrões inseguros:

- `GET /users/{id}` retorna o registro do usuário sem verificar se o chamador pode acessar esse `id`.
- Os modelos de resposta incluem campos internos (funções, permissões, dados de cobrança, hashes de senha).

Dicas de detecção:

- Enumerar endpoints que aceitam IDs; rastreie se uma verificação de autorização é executada.
- Compare modelos de resposta para campos públicos e internos.

Consertar:

- Adicione verificações em nível de objeto (propriedade, ACLs, limites de locatário).
- Use modelos de resposta dedicados que incluam apenas campos permitidos.

---

### FASTAPI-SESS-001: Se estiver usando sessões baseadas em cookies e TLS, os atributos dos cookies DEVEM ser seguros na produção

Gravidade: Alta (somente se o TLS estiver ativado)

Obrigatório (produção, HTTPS):

- DEVE definir cookies de sessão para serem enviados apenas por HTTPS (seguro). NOTA IMPORTANTE: Defina `Secure` apenas no ambiente de produção quando o TLS estiver configurado. Ao executar em um ambiente de desenvolvimento local via HTTP, não defina a propriedade `Secure` nos cookies. Você deve fazer isso condicionalmente com base no fato de o aplicativo estar sendo executado no modo de produção. Você também deve incluir uma propriedade como `SESSION_COOKIE_SECURE` que pode ser usada para desabilitar cookies `Secure` ao testar

rHTTP.

- DEVE definir HttpOnly para cookies de sessão (não acessíveis a JS).
- DEVE usar `SameSite=Lax` (ou `Strict` se o UX permitir); se você precisar de cookies entre sites, documente as implicações do CSRF e adicione controles de compensação. ([Série de folhas de dicas OWASP] [8])
- Se estiver usando Starlette `SessionMiddleware`, DEVE definir `https_only=True` na produção e escolher um `same_site` apropriado. ([PyPI][5])

Padrões inseguros:

- Cookies de sessão sem Secure/HttpOnly.
- Cookies `SameSite=None` usados ​​para endpoints de mudança de estado autenticados sem proteções CSRF.

Dicas de detecção:

- Procure por `SessionMiddleware(` e inspecione parâmetros como `https_only`, `same_site`.
- Procure por `set_cookie(` uso e sinalizadores de cookies.

Correção:

- Definir atributos de cookies seguros; prefira vidas curtas para sessões de alto privilégio. ([Série de folhas de dicas OWASP] [8])

---

### FASTAPI-SESS-002: Não armazene segredos confidenciais em cookies de sessão assinada

Gravidade: Alta

Obrigatório:

- DEVE assumir que os dados da sessão baseados em cookies podem ser lidos pelo cliente (assinados ≠ criptografados); não armazene segredos/PII, a menos que sejam criptografados no lado do servidor.
- Armazenar apenas identificadores opacos (por exemplo, ID de sessão) ou estado não sensível no cookie; armazenar estado de sessão confidencial no lado do servidor. ([Série de folhas de dicas OWASP] [8])

Padrões inseguros:

- Armazenar tokens de acesso, tokens de atualização ou PII diretamente em cargas de sessão de cookies.
- Tratar “cookies assinados” como armazenamento confidencial.

Dicas de detecção:

- Procure por `request.session[...] =` ou `session[...] =`-padrões equivalentes; identificar o que está armazenado.
- Identificar o uso de `SessionMiddleware` ou outros mecanismos de sessão de cookies.

Correção:

- Mover valores confidenciais para armazenamento no servidor; mantenha o cookie mínimo.

---

### FASTAPI-CSRF-001: Solicitações de alteração de estado autenticadas por cookie DEVEM ser protegidas por CSRF

Gravidade: Alta

Nota: Isto só se aplica se estiver usando autenticação baseada em cookies. Se o aplicativo usar autenticação baseada em cabeçalho ou token, como cabeçalho de autorização, o CSRF não será um problema.

Obrigatório:

- DEVE proteger todos os endpoints que mudam de estado (POST/PUT/PATCH/DELETE) que dependem de cookies para autenticação.
- DEVE usar uma abordagem CSRF comprovada (padrão de token sincronizador ou middleware bem revisado) em vez de lançar o seu próprio. ([Série de folhas de dicas OWASP] [2])
- PODE adicionar defesa profunda (verificações de origem/referenciador, cookies SameSite, busca de metadados), mas os tokens são a principal defesa para aplicativos autenticados por cookies. ([Série de folhas de dicas OWASP] [2])
-

NOTA IMPORTANTE: Se os cookies não forem usados ​​para autenticação (a autenticação é feita através do cabeçalho `Authorization`), o CSRF geralmente não é aplicável. ([FastAPI][11])

Padrões inseguros:

- Endpoints autenticados por cookie que mudam de estado sem validação de CSRF.
- Usar GET para ações de mudança de estado (amplifica o risco de CSRF).

Dicas de detecção:

- Enumerar rotas com métodos diferentes de GET; identificar se os cookies são usados ​​para autenticação.
- Procure geração/verificação de token CSRF ou middleware.

Consertar:

- Adicione tokens CSRF (e valide-os) em ações de mudança de estado quando a autenticação de cookie estiver em uso. ([Série de folhas de dicas OWASP] [2])

---

### FASTAPI-VALID-001: A análise e validação de solicitações DEVEM ser orientadas por esquema; evitar atribuição em massa

Gravidade: Média (especialmente para APIs que gravam no banco de dados)

Obrigatório:

- DEVE usar modelos Pydantic para corpos de solicitação em vez de aceitar `dict`/`Any` arbitrários.
- DEVE configurar modelos para rejeitar campos inesperados quando apropriado (evita erros de estilo de “atribuição em massa”).
- DEVE validar e normalizar identificadores (IDs, e-mail, URLs) antes de usá-los para controle de acesso ou efeitos colaterais. ([Série de folhas de dicas OWASP] [14])

Padrões inseguros:

- `payload = await request.json()` seguido por `Model(**payload)` ou gravações diretas no banco de dados com `payload` (sem lista de permissões).
- Modelos que aceitam silenciosamente campos desconhecidos para pontos de extremidade de gravação.

Dicas de detecção:

- Procure por `await request.json()`, `request.body()`, corpos digitados `dict`, corpos digitados `Any`.
- Procure endpoints que fazem `db.update(**payload)` ou `Model(**payload)` com entrada não filtrada.

Consertar:

- Use modelos Pydantic explícitos com campos permitidos; rejeitar extras para pontos de extremidade de gravação. ([Série de folhas de dicas OWASP] [14])

---

### FASTAPI-RESP-001: Evite a exposição excessiva de dados por meio de modelos de resposta e serialização explícita

Gravidade: Média

Obrigatório:

- DEVE definir modelos de resposta que incluam apenas campos pretendidos (especialmente para objetos de usuário, objetos relacionados a autenticação, objetos de cobrança).
- DEVE usar modelos separados para “criar entrada”, “db/internal” e “saída pública” para evitar vazamento de campos sensíveis. ([FastAPI][15])

Padrões inseguros:

- Retornando objetos ORM ou dictos que incluem colunas internas.
- Reutilização do “modelo de banco de dados” como modelo de resposta (inclui `password_hash`, `is_admin`, etc).

Dicas de detecção:

- Procure endpoints que `retornam usuário` onde `usuário` é uma instância ORM.
- Verifique se há omissões de `response_model` em endpoints que retornam recursos confidenciais.

Correção:

- Adicionar modelos de resposta explícitos; crie esquemas “públicos” que excluam campos confidenciais. ([FastAPI][15])

---

### FASTAPI-XSS-001: Impedir XSS refletido/armazenado em respostas e modelos HTML

Gravidade: Alta (se o serviço servir HTML)

Obrigatório:

- DEVE usar modelos com escape automático habilitado para HTML.
- NÃO DEVE marcar conteúdo não confiável como seguro (sem renderização “HTML bruto” insegura de dados controlados pelo usuário).
- DEVE implantar um CSP ao servir HTML que inclua qualquer conteúdo do usuário. ([Série de folhas de dicas OWASP] [16])

Padrões inseguros:

- Renderização do conteúdo do usuário diretamente em HTML sem escape/higienização.
- Desativar o escape automático ou usar recursos de “HTML bruto” sem higienização.

Dicas de detecção:

- Pesquise renderização de modelos e concatenação de strings que criam HTML.
- Revise modelos para filtros/construções “inseguras” e atributos não citados.

Correção:

- Mantenha o escape automático ativado; higienize o HTML do usuário somente se for absolutamente necessário, usando um higienizador confiável; adicione CSP. ([Série de folhas de dicas OWASP] [16])

Nota:

- Se o aplicativo for uma API JSON pura, o XSS geralmente é uma preocupação do cliente/aplicativo, mas páginas de erro/páginas de documentos ainda podem renderizar HTML.

---

### FASTAPI-SSTI-001: Nunca renderize modelos não confiáveis (injeção de modelo no lado do servidor)

Gravidade: Crítica

Obrigatório:

- NÃO DEVE renderizar modelos que contenham sintaxe de modelo controlada pelo usuário.
- DEVE tratar a renderização de “modelo de string” como perigosa se influenciada por entradas não confiáveis.
- Se modelos não confiáveis forem absolutamente necessários (raros, de alto risco):
  - DEVE usar uma abordagem de modelagem em sandbox e restringir recursos.
  - DEVE assumir que escapes de sandbox são possíveis; adicione isolamento e listas de permissões estritas. ([Fundação OWASP][17])

Padrões inseguros:

- Renderização de modelos carregados a partir da entrada do usuário ou banco de dados por meio de um ambiente Jinja normal.
- Construindo modelos dinamicamente usando strings controladas pelo usuário.

Dicas de detecção:

- Grep para Jinja `Environment.from_string`, `Template(...)` ou similar.
- Rastrear origem da string do modelo (solicitação, banco de dados, uploads, painéis de administração).

Consertar:

- Substitua por modelos não executáveis ​​(substituição simples de string).
- Se for realmente necessário, use o ambiente sandbox do Jinja, além de forte isolamento. ([jinja.palletsprojects.com][18])

---

### FASTAPI-HEADERS-001: Defina cabeçalhos de segurança essenciais (no aplicativo ou na borda)

Gravidade: Média

Obrigatório (API/aplicativo web típico):

- DEVE definir:
  - `X-Content-Type-Options: nosniff`
  - Proteção contra clickjacking (`X-Frame-Options` e/ou `frame-ancestors` CSP) se HTML for veiculado
  - `Referrer-Policy` e `Permissions-Policy` conforme apropriado

NOTA:

- Os cabeçalhos podem ser definidos por um proxy/CDN. Se não estiver visível no código do aplicativo, sinalize como “verificar na borda”. ([Série de folhas de dicas OWASP] [6])

Padrões inseguros:

- Não há cabeçalhos de segurança em nenhum lugar (aplicativo ou borda) para aplicativos que atendem HTML ou APIs confidenciais.

Dicas de detecção:

- Procure por middleware que configure cabeçalhos; verifique a configuração do proxy reverso.

Correção:

- Defina cabeçalhos centralmente (middleware) ou via proxy reverso/CDN.

---

### FASTAPI-CORS-001: O CORS DEVE ser explícito e com menos privilégios

Gravidade: Média (alta se as credenciais estiverem configuradas incorretamente)

Obrigatório:

- Se o CORS não for necessário, DEVE mantê-lo desativado.
- Se o CORS for necessário:
  - DEVE incluir na lista de permissões origens confiáveis (não reflita origens arbitrárias).
  - NÃO DEVE combinar solicitações credenciadas com origens curinga (isso não é seguro e é comumente rejeitado por middleware compatível). ([Série de folhas de dicas OWASP] [6])
  - DEVE restringir métodos e cabeçalhos permitidos.

Padrões inseguros:

- `allow_origins=["*"]` junto com `allow_credentials=True`.
- Refletindo `Origem` sem validação.
- `allow_origin_regex=".*"` amplamente utilizado.

Dicas de detecção:

- Pesquise a configuração `CORSMiddleware`.
- Procure por `allow_origins=["*"]`, `allow_credentials=True`, `allow_origin_regex`.

Correção:

- Use uma lista de permissões de origem explícita e métodos/cabeçalhos mínimos; mantenha as credenciais desativadas, a menos que seja necessário. ([Série de folhas de dicas OWASP] [6])

---

### FASTAPI-HOST-001: O cabeçalho do host DEVE ser validado na produção

Gravidade: Baixa

Obrigatório:

- DEVE usar `TrustedHostMiddleware` (ou equivalente na borda) para restringir valores de Host aceitos. ([PyPI][5])
- NÃO DEVE confiar no cabeçalho `Host` para decisões sensíveis à segurança sem validação.

Padrões inseguros:

- Nenhuma validação de host ao gerar URLs externos (links de redefinição de senha, URLs de retorno de chamada) do host de solicitação.
- Permitir cabeçalhos de host arbitrários em aplicativos atrás de proxies permissivos.

Dicas de detecção:

- Pesquise o uso de `TrustedHostMiddleware`.
- Pesquise lógica que use `request.url`, `request.base_url` ou valores derivados de host para criar URLs externos.

Correção:

- Configurar uma lista restrita de hosts permitidos em produção; impor na borda também, se possível.

---

### FASTAPI-PROXY-001: A confiança do proxy reverso DEVE ser configurada corretamente

Gravidade: Alta (quando atrás de um proxy)

Obrigatório:

- Se estiver atrás de um proxy reverso, DEVE configurar corretamente a confiança do cabeçalho encaminhado.
- NÃO DEVE confiar cegamente nos cabeçalhos `X-Forwarded-*` da Internet aberta.
- Se estiver usando suporte a cabeçalho de proxy Uvicorn, DEVE restringir quais IPs têm permissão para fornecer cabeçalhos encaminhados. ([PyPI][4])

Padrões inseguros:

- Habilitar cabeçalhos de proxy amplamente sem restringir IPs de proxy confiáveis.
- Usar cabeçalhos encaminhados para decidir “é seguro”/“é interno”/“IP do cliente” sem limites de confiança adequados.

Dicas de detecção:

- Procure por `--proxy-headers`, `--forwarded-allow-ips` ou configuração equivalente.
- Pesquise o uso sensível à segurança de `request.client.host`, `request.url.scheme`, `request.headers["x-forwarded-for"]`.

Consertar:

- Configure o Uvicorn com cabeçalhos de proxy somente quando estiver atrás de um proxy conhecido e restrinja `forwarded_allow_ips` a esse proxy. ([PyPI][4])
- Mantenha a lista de permissões de hosts em vigor, mesmo atrás de proxies.

---

### FASTAPI-LIMITS-001: Limites de solicitação e multipart DEVEM ser aplicados para evitar DoS

Gravidade: Baixa

Obrigatório:

- DEVE impor limites de tamanho de solicitação na borda (proxy reverso/balanceador de carga) e validar no aplicativo quando necessário.
- DEVE aplicar um exame especial ao tratamento de dados de múltiplas partes/formulários; vulnerabilidades históricas incluem buffer ilimitado e vetores DoS. ([advisories.gitlab.com][9])
- DEVE limitar a taxa e/ou adicionar aceleradores por IP/por usuário para endpoints caros.

Padrões inseguros:

- Aceitar corpos JSON arbitrariamente grandes ou formulários multipartes.
- Análise de formulários multipartes sem controles de tamanho/contagem de campos.

Dicas de detecção:

- Identifique endpoints de upload de arquivos e uso de `multipart/form-data`.
- Procure limites ausentes no nível do proxy (nginx `client_max_body_size`, limites ALB, etc.) e verificações ausentes no nível do aplicativo.

Consertar:

- Aplicar limites rígidos ao corpo e restrições multipartes; mantenha Starlette e python-multipart atualizados para versões corrigidas. ([advisories.gitlab.com][9])

---

### FASTAPI-FILES-001: Evita a passagem de caminho e a exposição insegura de arquivos estáticos

Gravidade: Alta

Obrigatório:

- NÃO DEVE passar caminhos de arquivos controlados pelo usuário para chamadas `FileResponse`/sistema de arquivos sem validação estrita e diretórios base seguros.
- Se estiver usando `StaticFiles`, DEVE manter o Starlette atualizado e entender o histórico de segurança (existe um aviso de passagem de caminho para versões mais antigas). ([advisories.gitlab.com][10])
- NÃO DEVE veicular uploads de usuários como conteúdo executável/ativo (especialmente HTML/JS) de uma raiz estática sem manuseio seguro.

Padrões inseguros:

- `FileResponse(request.query_params["caminho"])`
- Montagem de `StaticFiles(directory="uploads")` onde os uploads incluem HTML/JS/SVG e são veiculados inline.

Dicas de detecção:

- Procure por `FileResponse(`, `StaticFiles(`, `open(` em rotas.
- Rastreie se o caminho se origina de uma entrada não confiável.

Correção:

- Use IDs opacos para arquivos; mapear IDs para caminhos armazenados no lado do servidor.
- Servir conteúdo não confiável como downloads de anexos, quando apropriado.

---

### FASTAPI-FILES-002: Mitigar DoS de cabeçalho de intervalo em endpoints de serviço de arquivos

Gravidade: Baixa (se as versões afetadas e o serviço de arquivos estiverem ativados)

Obrigatório:

- DEVE manter o Starlette corrigido contra problemas conhecidos de DoS de serviço de arquivos se estiver usando `FileResponse`/`StaticFiles`.
- DEVE tratar o manuseio incomum do cabeçalho `Range` e servir como uma superfície DoS. ([advisories.gitlab.com][19])

Padrões inseguros:

- Servindo arquivos grandes com versões vulneráveis ​​do Starlette.
- Sem limitação de taxa/proteção CDN para endpoints de arquivo.

Dicas de detecção:

- Identificar versão Starlette; se estiver na faixa afetada, sinalizar.
- Encontre usos de `FileResponse` e ​​`StaticFiles`.

Correção:

- Atualize o Starlette para uma versão fixa de acordo com orientação consultiva. ([advisories.gitlab.com][19])
- Adicione cache de borda/limitação de taxa para endpoints de arquivo, quando apropriado.

---

### FASTAPI-UPLOAD-001: Os uploads de arquivos DEVEM ser validados, armazenados com segurança e servidos com segurança

Gravidade: Média

Obrigatório:

- DEVE impor limites de tamanho de upload (aplicativo + borda).
- DEVE validar o tipo de arquivo usando listas de permissões e verificações de conteúdo (não apenas extensão). ([Série de folhas de dicas OWASP] [20])
- DEVE gerar nomes de arquivos do lado do servidor (IDs aleatórios) e evitar confiar em nomes originais.
- DEVE servir formatos potencialmente ativos com segurança (download de anexo), a menos que seja explicitamente pretendido.

Padrões inseguros:

- Aceitar tipos de arquivos arbitrários e servi-los de volta in-line.
- Usando o nome de arquivo fornecido pelo usuário como caminho de armazenamento.

Dicas de detecção:

- Procure manipuladores de upload e onde/como os arquivos são gravados.
- Procure exposição direta de diretórios de upload.

Correção:

- Implementar validação de lista de permissões + armazenamento seguro + serviço seguro; adicione verificação/quarentena, se aplicável. ([Série de folhas de dicas OWASP] [20])

---

### FASTAPI-INJECT-001: Evita injeção de SQL (use consultas parametrizadas/ORM)

Gravidade: Alta

Obrigatório:

- DEVE usar consultas parametrizadas ou um ORM que parametrize nos bastidores.
- NÃO DEVE construir SQL por concatenação de strings/f-strings com entrada não confiável. ([Série de folhas de dicas OWASP] [21])

Padrões inseguros:

- `f"SELECIONE ... WHERE id={user_id}"`
- `"... WHERE nome = '%s'" % user_input`

Dicas de detecção:

- Grep para palavras-chave SQL em strings Python próximas a `.execute(...)`.
- Rastreie dados não confiáveis ​​em chamadas de banco de dados.

Correção:

- Substituir por consultas parametrizadas/APIs de consulta ORM; valide os tipos antes de consultar. ([Série de folhas de dicas OWASP] [21])

---

### FASTAPI-INJECT-002: Impedir injeção de comando do SO

Gravidade: Crítica a Alta (depende da exposição)

Obrigatório:

- DEVE evitar executar comandos shell com entrada não confiável.
- Se o subprocesso for necessário:
  - DEVE passar argumentos como uma lista (não uma string)
  - NÃO DEVE usar `shell=True` com strings influenciadas pelo invasor
  - DEVE usar listas de permissões estritas para qualquer componente variável ([OWASP Cheat Sheet Series][22])

Padrões inseguros:

- `os.system(user_input)`
- `subprocess.run(f"cmd {usuário}", shell=True)`
- Passando strings de usuário para `bash -c`, `sh -c`, PowerShell, etc.

Dicas de detecção:

- Procure por `os.system`, `subprocess`, `Popen`, `shell=True`.
- Rastreie dados da solicitação/banco de dados para essas chamadas.

Correção:

- Use APIs de biblioteca em vez de comandos shell.
- Se for inevitável, codifique o comando e coloque na lista de permissões os parâmetros validados; use o separador `--` onde houver suporte. ([Série de folhas de dicas OWASP] [22])

---

### FASTAPI-SSRF-001: Evita falsificação de solicitação do lado do servidor (SSRF) em HTTP de saída

Gravidade: Média (pode ser Alta em ambientes de nuvem/VPC)

- Nota: Para projetos pequenos e independentes, isso é menos importante. É mais importante ao implantar em uma LAN ou com outros serviços escutando no mesmo servidor.

Obrigatório:

- DEVE tratar as solicitações de saída para URLs fornecidos pelo usuário como de alto risco.
- DEVE validar e restringir destinos (hosts/domínios da lista de permissões) para qualquer busca de URL influenciada pelo usuário.
- DEVE bloquear o acesso a locaishost/intervalos de IP privados/link-local e endpoints de metadados em nuvem.
- DEVE restringir os protocolos a http/https.
- DEVE definir tempos limite e controlar cuidadosamente os redirecionamentos. ([Série de folhas de dicas OWASP] [23])

Padrões inseguros:

- `httpx.get(request.query_params["url"])`
- Recursos de “visualização/importação/testador de webhook de URL” que aceitam URLs arbitrários.

Dicas de detecção:

- Pesquise chamadas `requests`, `httpx`, `urllib`, `aiohttp` com URLs derivadas de requests/DB.
- Identifique endpoints chamados `fetch`, `preview`, `proxy`, `webhook`, `import`.

Consertar:

- Implementar análise rigorosa de URL + listas de permissões; adicione controles de saída; definir intervalos curtos; desative os redirecionamentos se não for necessário. ([Série de folhas de dicas OWASP] [23])

---

### FASTAPI-REDIRECT-001: Impedir redirecionamentos abertos

Gravidade: Baixa

Obrigatório:

- DEVE validar alvos de redirecionamento derivados de entradas não confiáveis ​​(`next`, `redirect`, `return_to`).
- DEVE preferir o redirecionamento apenas para caminhos relativos do mesmo site ou uma lista de domínios permitidos. ([Série de folhas de dicas OWASP] [24])

Padrões inseguros:

- Retornando `RedirectResponse(next)` onde `next` é controlado pelo usuário sem validação.

Dicas de detecção:

- Procure por `RedirectResponse(` ou lógica de redirecionamento e examine a origem do alvo.

Correção:

- Permitir apenas caminhos relativos ou domínios permitidos; voltar a um padrão seguro. ([Série de folhas de dicas OWASP] [24])

---

### FASTAPI-WS-001: Endpoints WebSocket DEVEM ser autenticados e protegidos contra abuso entre sites

Gravidade: Média a Alta (depende dos dados/privilégio)

Obrigatório:

- DEVE autenticar conexões WebSocket para qualquer canal não público (WebSockets não fornece autenticação inerentemente). ([Série de folhas de dicas OWASP] [25])
- DEVE impor proteções semelhantes a Origin/CSRF apropriadas para clientes WebSocket baseados em navegador (a validação de Origin é um controle comum).
- DEVE limitar a frequência de mensagens e tentativas de conexão; feche conexões ociosas/abusivas.

Padrões inseguros:

- `@app.websocket(...)` aceita e confia na conexão sem verificação de autenticação.
- Usando tokens de string de consulta para autenticação sem considerar vazamento/rotação.

Dicas de detecção:

- Pesquise `@app.websocket` / `websocket_endpoint` e inspecione se a autenticação é executada antes de aceitar operações confidenciais.
- Revise verificações de origem, análise de token e autorização por conexão.

Consertar:

- Exigir autenticação durante o handshake (por exemplo, um token ou sessão) e impor autorização para ações/mensagens.
- Validar Origin para clientes baseados em navegador, quando apropriado; aplicar limites de taxa e tempos limite. ([Série de folhas de dicas OWASP] [25])

---

### FASTAPI-SUPPLY-001: Dependência e higiene de patches (foco em dependências relevantes para a segurança)

Gravidade: Baixa

Obrigatório:

- DEVE fixar e atualizar regularmente dependências críticas de segurança (FastAPI, Starlette, Uvicorn, Pydantic, python-multipart, auth/JWT libs).
- DEVE responder prontamente aos avisos de segurança conhecidos.
- DEVE tratar as dependências de serviço de arquivo e análise multipartes como sensíveis à segurança devido a CVEs históricos. ([advisories.gitlab.com][10])

Exemplos de foco de auditoria (histórico):

- Travessia do caminho Starlette StaticFiles (corrigido em 0.27.0). ([advisories.gitlab.com][10])
- DoS multipart/form-data Starlette (corrigido em 0.40.0). ([advisories.gitlab.com][9])
- DoS do cabeçalho Starlette FileResponse Range (corrigido em 0.49.1). ([advisories.gitlab.com][19])

Dicas de detecção:

- Verifique `requirements.txt`, lockfiles, imagens de contêiner e ambientes de tempo de execução para versões reais instaladas.
- Mapear recursos de upload/servimento de arquivos para versões de dependência.

Correção:

- Atualização para versões corrigidas por avisos; adicione testes de regressão em torno do comportamento afetado.

---

## 5) Heurísticas práticas de varredura (como “caçar”)

Ao digitalizar ativamente, use estes padrões de sinal alto:

- Servidor de desenvolvimento/depuração:
  - `--reload`, `reload=True`, `debug=True`, `FastAPI(debug=True)` ([PyPI][4])

- Exposição OpenAPI/docs:
  - `/docs`, `/redoc`, `/openapi.json`, `docs_url=`, `openapi_url=`

- Lacunas de aplicação de autenticação:
  - Endpoints faltando `Depends()`/`Security()` onde esperado; roteadores sem um limite de dependência consistente ([FastAPI][7])
  - Tokens em parâmetros de consulta (`token=`, `api_key=`, `key=`) ([FastAPI][11])

- Sessão/cookies + CSRF:
  - `SessionMiddleware(` e sinalizadores de cookies (`https_only`, `same_site`) ([PyPI][5])
  - Manipuladores POST/PUT/PATCH/DELETE usando autenticação de cookie sem verificações CSRF ([OWASP Cheat Sheet Series][2])

- Validação de entrada e atribuição em massa:
  - `await request.json()` e gravações diretas no banco de dados de dictos; modelos que aceitam campos extras ([Série de folhas de dicas OWASP] [14])

- Exposição excessiva de dados:
  - Retornando objetos ORM ou dict sem `response_model`; respostas contendo senha/função/campos internos ([FastAPI][15])

- CORS:
  - `CORSMiddleware` com `allow_origins=["*"]`, `allow_origin_regex=".*"`, `allow_credentials=True` ([Série de folhas de dicas OWASP][6])

- Arquivos:
  - `FileResponse(` com caminhos controlados pelo usuário; `StaticFiles(` expondo uploads ([advisories.gitlab.com][10])

- Uploads/multiparte:
  - endpoints `multipart/form-data` sem restrições de tamanho/campo; Starlette/python-multipart desatualizado ([advisories.gitlab.com][9])

- Injeção:
  - Strings SQL com f-strings/concatenação em `.execute(...)` ([OWASP Cheat Sheet Series][21])
  - `subprocess.*`, `shell=True`, `os.system` ([Série de Folhas de Dicas OWASP][22])

- SSRF:
  - `httpx.get/post` ou `requests.*` com URL de solicitação/banco de dados, sem lista de permissões/tempos limite ([Série de folhas de dicas OWASP][23])

- Redirecionar:
  - `RedirectResponse(next)` sem validação ([OWASP Cheat Sheet Series][24])

- WebSockets:
  - Manipuladores `@app.websocket` sem verificações de autenticação/origem; uso de `ws://` nas configurações do produto ([FastAPI][27])

Sempre tente confirmar:

- origem dos dados (não confiável versus confiável)
- tipo de coletor (SQL/subprocess/files/template/http/redirect/ws)
- controles de proteção presentes (validação, listas de permissões, middleware, controles de borda)
- versões de dependência instaladas versus intervalos vulneráveis ([advisories.gitlab.com][10])

---

## 6) Fontes (acessado em 27/01/2026)

Documentação da estrutura primária:

- FastAPI (metadados PyPI, versionamento) — `https://pypi.org/project/fastapi/` ([PyPI][1])
- Documentos FastAPI: “Primeiros passos” de segurança (convenções de cabeçalho do portador de autorização) — `https://fastapi.tiangolo.com/tutorial/security/first-steps/` ([FastAPI][11])
- Referência FastAPI: Dependências (`Depends`, `Segurança`) — `https://fastapi.tiangolo.com/reference/dependencies/` ([FastAPI][7])
- Referência FastAPI: APIRouter (dependências em nível de roteador) — `https://f

astapi.tiangolo.com/reference/apirouter/` ([FastAPI][28])

- Documentos FastAPI: WebSockets — `https://fastapi.tiangolo.com/advanced/websockets/` ([FastAPI][27])

Documentação da pilha ASGI/servidor:

- Starlette (PyPI, capacidades gerais) — `https://pypi.org/project/starlette/` ([PyPI][5])
- Documentos Starlette: WebSockets - `https://starlette.dev/websockets/` ([Starlette][3])
- Uvicorn (metadados PyPI) — `https://pypi.org/project/uvicorn/` ([PyPI][4])
- Documentos Pydantic (v2.12.x) — `https://docs.pydantic.dev/latest/` ([Pydantic][29])

Padrões de segurança e folhas de dicas:

- Série de folhas de dicas OWASP: gerenciamento de sessão - `https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html` ([Série de folhas de dicas OWASP] [8])
- Série de folhas de dicas OWASP: Prevenção de CSRF - `https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html` ([Série de folhas de dicas OWASP] [2])
- Série de folhas de dicas OWASP: Prevenção XSS - `https://cheatsheetseries.owasp.org/cheatsheets/Cross_Sit

e_Scripting_Prevention_Cheat_Sheet.html` ([Série de folhas de dicas OWASP] [16])

- Série de folhas de dicas OWASP: Atribuição em massa - `https://cheatsheetseries.owasp.org/cheatsheets/Mass_Assignment_Cheat_Sheet.html` ([Série de folhas de dicas OWASP] [14])
- Top 10 de segurança da API OWASP (2023) — `https://owasp.org/API-Security/editions/2023/en/0x11-t10/` ([Fundação OWASP][13])
- Série de folhas de dicas OWASP: Prevenção de injeção de SQL - `https://cheatsheetseries.owasp.org/ch

eatsheets/SQL_Injection_Prevention_Cheat_Sheet.html` ([Série de folhas de dicas OWASP] [21])

- Série de folhas de dicas OWASP: Defesa de injeção de comando do sistema operacional - `https://cheatsheetseries.owasp.org/cheatsheets/OS_Command_Injection_Defense_Cheat_Sheet.html` ([Série de folhas de dicas OWASP] [22])
- Série de folhas de dicas OWASP: Prevenção de SSRF - `https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet.html` ([Série de folhas de dicas OWASP

][23])

- Série de folhas de dicas OWASP: upload de arquivo - `https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html` ([Série de folhas de dicas OWASP] [20])
- Série de folhas de dicas OWASP: Redirecionamentos e encaminhamentos não validados - `https://cheatsheetseries.owasp.org/cheatsheets/Unvalidated_Redirects_and_Forwards_Cheat_Sheet.html` ([Série de folhas de dicas OWASP] [24])
- Série de folhas de dicas OWASP: cabeçalhos de resposta de segurança HTTP - `https://cheatsheetseries.owas

p.org/cheatsheets/HTTP_Headers_Cheat_Sheet.html` ([Série de folhas de dicas OWASP] [6])

- Série de folhas de dicas OWASP: Segurança WebSocket - `https://cheatsheetseries.owasp.org/cheatsheets/WebSocket_Security_Cheat_Sheet.html` ([Série de folhas de dicas OWASP] [25])
- OWASP WSTG: Teste para injeção de modelo no lado do servidor - `https://owasp.org/www-project-web-security-testing-guide/v41/4-Web_Application_Security_Testing/07-Input_Validation_Testing/18-Testing_for_Ser

ver_Side_Template_Injection` ([Fundação OWASP][17])

- OWASP WSTG: Testando WebSockets — `https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/11-Client-side_Testing/10-Testing_WebSockets` ([Fundação OWASP][26])

Referências de segurança do modelo:

- Jinja: Sandbox — `https://jinja.palletsprojects.com/en/stable/sandbox/` ([jinja.palletsprojects.com][18])

Referências selecionadas de cadeia de suprimentos/consultoria (exemplos Starlette):

- CVE-2023-29159 (travessia de caminho StaticFiles; corrigido 0.27.0) — `https://advisories.gitlab.com/pkg/pypi/starlette/CVE-2023-29159/` ([advisories.gitlab.com][10])
- CVE-2024-47874 (DoS multipart/form-data; fixo 0.40.0) — `https://advisories.gitlab.com/pkg/pypi/starlette/CVE-2024-47874/` ([advisories.gitlab.com][9])
- CVE-2025-62727 (DoS do cabeçalho FileResponse Range; corrigido 0.49.1) - `https://advisories.gitlab.com/pkg/pypi/starlette/CVE-2025-62727/` ([anúncio

viseries.gitlab.com][19])

[1]: https://pypi.org/project/fastapi/ 'https://pypi.org/project/fastapi/'
[2]: https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html 'https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html'
[3]: https://starlette.dev/websockets/ 'Websockets'
[4]: https://pypi.org/project/uvicorn/ 'https://pypi.org/project/uvicorn/'
[5]: https://pypi.org/project/starlet

te/ 'https://pypi.org/project/starlette/'
[6]: https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Headers_Cheat_Sheet.html 'Folha de referências dos cabeçalhos de resposta de segurança HTTP'
[7]: https://fastapi.tiangolo.com/reference/dependencies/ 'Dependências - Depends() e Segurança() - FastAPI'
[8]: https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html 'https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html

'
[9]: https://advisories.gitlab.com/pkg/pypi/starlette/CVE-2024-47874/ 'Starlette Negação de serviço (DoS) via multipart/form-data | Banco de dados consultivo GitLab'
[10]: https://advisories.gitlab.com/pkg/pypi/starlette/CVE-2023-29159/ 'Starlette tem vulnerabilidade Path Traversal em StaticFiles | Banco de dados consultivo GitLab'
[11]: https://fastapi.tiangolo.com/tutorial/security/first-steps/ 'Segurança - Primeiros Passos - FastAPI'
[12]: https://fastapi.tiangolo.c

om/tutorial/modelo de resposta/ 'https://fastapi.tiangolo.com/tutorial/modelo de resposta/'
[13]: https://owasp.org/API-Security/editions/2023/en/0x11-t10/ 'https://owasp.org/API-Security/editions/2023/en/0x11-t10/'
[14]: https://cheatsheetseries.owasp.org/cheatsheets/Mass_Assignment_Cheat_Sheet.html 'https://cheatsheetseries.owasp.org/cheatsheets/Mass_Assignment_Cheat_Sheet.html'
[15]: https://fastapi.tiangolo.com/tutorial/extra-models/ 'https://fastapi

.tiangolo.com/tutorial/extra-models/'
[16]: https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html 'https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html'
[17]: https://owasp.org/www-project-web-security-testing-guide/v41/4-Web_Application_Security_Testing/07-Input_Validation_Testing/18-Testing_for_Server_Side_Template_Injection 'Teste para modelo do lado do servidor em

rejeição'
[18]: https://jinja.palletsprojects.com/en/stable/sandbox/ 'Sandbox - Documentação Jinja (3.1.x)'
[19]: https://advisories.gitlab.com/pkg/pypi/starlette/CVE-2025-62727/ 'Starlette vulnerável a O (n ^ 2) DoS por meio da fusão do cabeçalho Range em `starlette.responses.FileResponse` | Banco de dados consultivo GitLab'
[20]: https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html 'https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_

Cheat_Sheet.html'
[21]: https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html 'https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html'
[22]: https://cheatsheetseries.owasp.org/cheatsheets/OS_Command_Injection_Defense_Cheat_Sheet.html 'https://cheatsheetseries.owasp.org/cheatsheets/OS_Command_Injection_Defense_Cheat_Sheet.html'
[23]: https://cheatsheetseries.owasp.org/cheatsheets

/Server_Side_Request_Forgery_Prevention_Cheat_Sheet.html 'https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet.html'
[24]: https://cheatsheetseries.owasp.org/cheatsheets/Unvalidated_Redirects_and_Forwards_Cheat_Sheet.html 'Folha de referências de redirecionamentos e encaminhamentos não validados'
[25]: https://cheatsheetseries.owasp.org/cheatsheets/WebSocket_Security_Cheat_Sheet.html 'Segurança WebSocket - Série de folhas de dicas OWASP

é
[26]: https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/11-Client-side_Testing/10-Testing_WebSockets 'WSTG - Mais recente | Fundação OWASP'
[27]: https://fastapi.tiangolo.com/advanced/websockets/ 'WebSockets - FastAPI'
[28]: https://fastapi.tiangolo.com/reference/apirouter/ 'Classe APIRouter - FastAPI'
[29]: https://docs.pydantic.dev/latest/ 'https://docs.pydantic.dev/latest/'
