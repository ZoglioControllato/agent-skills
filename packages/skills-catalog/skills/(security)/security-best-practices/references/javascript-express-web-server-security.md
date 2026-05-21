# Express (Node.js) Especificação de segurança da Web (Express 5.x/4.19.2+, Node.js LTS)

Este documento foi concebido como uma **especificação de segurança** que oferece suporte a:

1. **Geração de código seguro por padrão** para novos aplicativos e rotas Express.
2. **Revisão de segurança/caça de vulnerabilidades** no código Express existente (passivo “notificar problemas durante o trabalho” e ativo “verificar o repositório e relatar descobertas”).

Ele é intencionalmente escrito como um conjunto de **requisitos normativos** (“DEVE/DEVE/PODE”) mais **regras de auditoria** (como são os padrões ruins, como detectá-los e como corrigi-los/mitigá-los).

---

## 0) Segurança, limites e restrições antiabuso (DEVE SEGUIR)

- NÃO DEVE solicitar, gerar, registrar ou confirmar segredos (chaves de API, senhas, chaves privadas, segredos de sessão, cookies, tokens).
- NÃO DEVE “consertar” a segurança desabilitando proteções (por exemplo, enfraquecendo sinalizadores de cookies, desabilitando defesas CSRF para aplicativos autenticados por cookies, habilitando CORS permissivo, confiando em cabeçalhos de proxy da Internet aberta, ativando depuração/rastreamento de pilha na produção, desabilitando TLS sem substituição).
- DEVE fornecer \*\*baseado em evidências

descobertas\*\* durante auditorias: cite caminhos de arquivos, trechos de código, valores de middleware/config e suposições de tempo de execução que justificam a afirmação.

- DEVE tratar a incerteza com honestidade: se existir uma proteção na infraestrutura (proxy reverso, gateway, WAF, CDN), relate-a como “não visível no código do aplicativo; verifique em tempo de execução/configuração”.
- DEVE preferir bibliotecas verificadas e controles de plataforma em vez de criptografia/autenticação/sessão/CSRF “faça você mesmo”. Express espera explicitamente que o aplicativo

aplicação para validar/tratar a entrada do usuário corretamente; isso não acontece automaticamente. ([Expresso][1])

---

## 1) Modos de operação

### 1.1 Modo de geração (padrão)

Quando solicitado a escrever um novo código Express ou modificar o código existente:

- DEVE seguir todos os requisitos **DEVE** nesta especificação.
- DEVE seguir todos os requisitos **DEVE**, a menos que o usuário diga explicitamente o contrário.
- DEVE preferir APIs seguras por padrão e bibliotecas comprovadas em vez de código de segurança personalizado.
- DEVE evitar a introdução de novos coletores arriscados (execução de shell, avaliação dinâmica de código, redirecionamentos inseguros, exibição de arquivos de usuário como HTML, renderização de modelos a partir de strings não confiáveis, caminhos de sistema de arquivos inseguros, pontos de extremidade de busca de URL SSRF,

etc.).

### 1.2 Modo de revisão passiva (sempre ativado durante a edição)

Ao trabalhar em qualquer lugar em um repositório Express (mesmo que o usuário não tenha solicitado uma verificação de segurança):

- DEVE “notar” violações desta especificação no código tocado/próximo.
- DEVE mencionar os problemas à medida que surgem, com uma breve explicação + solução segura.

### 1.3 Modo de auditoria ativo (solicitação de verificação explícita)

Quando o usuário pede para “verificar”, “auditar” ou “caçar vulnerabilidades”:

- DEVE pesquisar sistematicamente a base de código em busca de violações desta especificação.
- DEVE apresentar os resultados num formato estruturado (ver §2.3).

Ordem de auditoria recomendada:

1. Pontos de entrada (bootstrap de servidor/aplicativo), manifestos de implantação, Dockerfiles, configuração do gerenciador de processos, CI/CD.
2. Configurações expressas + ordem da pilha de middleware (capacete, analisadores, autenticação, sessões, CSRF, CORS).
3. Confiança de proxy (`trust proxy`) e manipulação de IP/protocolo/host. ([Expresso][2])
4. Fluxos de autenticação, sessões, cookies, links de redefinição de senha, tratamento de redirecionamento. ([Expresso][1])
5. Rotas de mudança de estado + proteções CSRF (aplicativos autenticados por cookies). ([OWASP Cheat

Série de folhas][3]) 6. Renderização de templates e defesas XSS (geração HTML, CSP, `res.locals`). ([Série de folhas de dicas OWASP] [4]) 7. Manipulação de arquivos (uploads + downloads + arquivos estáticos) e percurso de caminho. ([Expresso][5]) 8. Classes de injeção (SQL, NoSQL, execução de comandos, desserialização insegura). ([Série de folhas de dicas OWASP] [6]) 9. Solicitações de saída (SSRF) e entrega de webhook/retorno de chamada. ([Série de folhas de dicas OWASP] [7]) 10. Limitação de taxa/força bruta

defesas/controles de abuso. ([Expresso][1]) 11. Higiene de dependências/lockfiles/auditoria npm/versões Express vulneráveis. ([Expresso][1])

---

## 2) Definições e orientações de revisão

### 2.1 Entrada não confiável (tratada como controlada pelo invasor, salvo prova em contrário)

No Express, entradas não confiáveis comuns incluem:

- `req.params` (parâmetros de rota)
- `req.query` (parâmetros de string de consulta; podem ser strings/arrays/objetos dependendo da análise) ([OWASP Cheat Sheet Series][8])
- `req.body` de `express.json()`, `express.urlencoded()`, `express.text()`, `express.raw()` ([Express][5])
- `req.headers` / `req.get(...)`
- `req.cookies` / `req.signedCookies` (se o middleware de análise de cookies for usado)
- Carregar metadados e nomes de arquivos (por exemplo, multer `file.originalname`, `file.

tipo MIME`)

- Quaisquer dados de sistemas externos (webhooks, APIs de terceiros, filas de mensagens)
- Qualquer conteúdo de usuário persistente (linhas de banco de dados) originado de usuários

Nota especial de procuração:

- Se `trust proxy` estiver habilitado, valores como `req.ip`, `req.hostname` e `req.protocol` podem ser derivados de cabeçalhos `X-Forwarded-*` que **podem ser controlados pelo invasor** se sua cadeia de proxy não os estiver sobrescrevendo/removendo corretamente. ([Expresso][2])

### 2.2 Solicitação de mudança de estado

Uma solicitação muda de estado se puder criar/atualizar/excluir dados, alterar o estado de autenticação/sessão, acionar efeitos colaterais (compra, envio de e-mail, envio de webhook) ou iniciar ações privilegiadas.

### 2.3 Formato de descoberta de auditoria necessário

Para cada problema encontrado, produza:

- ID da regra:
- Gravidade: Crítica / Alta / Média / Baixa
- Localização: caminho do arquivo + nome da função/rota/middleware + linha(s)
- Evidência: o trecho de código/configuração exato
- Impacto: o que pode dar errado, quem pode explorar
- Correção: mudança segura (prefira diferença mínima)
- Mitigação: defesa profunda se a solução imediata for difícil
- Notas falso-positivas: o que verificar em caso de incerteza

---

## 3) Linha de base segura: configuração mínima de produção (DEVE em produção)

Esta é a menor “linha de base de produção” que evita configurações incorretas comuns do Express.

Metas mínimas de referência:

- `helmet()` é usado e configurado (especialmente CSP quando aplicável), e impressão digital é reduzida (desative `x-powered-by`). ([Expresso][1])
- Existem um manipulador 404 personalizado e um manipulador de erros personalizado, e a produção não vaza rastreamentos de pilha internos. ([Expresso][1])
- O uso de cookies/sessão é deliberado:
  - Não usar nomes de cookies de sessão padrão
  - Os cookies usam atributos seguros (`Secure`, `HttpOnly`, `SameSite`) conforme apropriado
  - S com base em cookies

as sessões nunca armazenam segredos (eles podem ser lidos pelo cliente)

- As sessões do lado do servidor nunca usam o MemoryStore na produção. ([Expresso][1])

- A análise do corpo da solicitação tem limites explícitos (`express.json({ limit })`, `express.urlencoded({ limit, parâmetroLimit, profundidade })`). ([Expresso][5])
- `trust proxy` está configurado explicitamente para corresponder à sua topologia de proxy; não cegamente “verdadeiro”. ([Expresso][2])
- Os endpoints de login/autenticação têm proteção de força bruta e limitação de taxa. ([Expresso][1])
- As dependências são auditadas/atualizadas regularmente (`auditoria npm` + resposta consultiva). ([Expresso][1])

---

## 4) Regras (geração + auditoria)

Cada regra contém: práticas necessárias, padrões inseguros, dicas de detecção e correção.

### EXPRESS-INPUT-001: Trate todas as entradas do usuário como não confiáveis e valide-as

Gravidade: Alta

Obrigatório:

- DEVE validar e normalizar entradas não confiáveis ​​antes de usá-las em lógicas sensíveis à segurança ou em coletores perigosos (consultas de banco de dados, redirecionamentos, sistema de arquivos, saída HTML, comandos shell). Certifique-se de que as entradas não confiáveis ​​sejam verificadas por tipo e estrutura antes de usar ou transmitir.
- DEVE aplicar listas de permissões (em boas condições) em vez de listas de bloqueio, quando viável.
- DEVE rejeitar ou lidar com segurança com tipos/formas inesperados em `req.query`, `req.params` e `req.b

ody`.

Padrões inseguros:

- Passar `req.query`, `req.params`, `req.body` diretamente para construtores de banco de dados/consultas, redirecionamentos, caminhos de sistema de arquivos ou modelos.
- Supondo que `req.query.foo` seja sempre uma string (pode ser um array/objeto dependendo da análise). ([Série de folhas de dicas OWASP] [8])

Dicas de detecção:

- Identificar fluxos “não confiáveis ​​para coletor”: solicitação → coletor (`res.redirect`, execução SQL, `sendFile`, `child_process`, renderização de modelo, busca de saída).
- Pesquise o uso direto de `req.query.*`, `req.body.*`, `req.params.*` em chamadas confidenciais.

Correção:

- Adicionar validação de esquema (por exemplo, zod/joi/express-validator) nos limites da rota.
- Normalizar tipos (por exemplo, forçar IDs para números inteiros; rejeitar matrizes quando for esperado escalar).

Notas:

- A orientação expressa de segurança de produção diz explicitamente que a validação/manuseio de entrada é de responsabilidade do aplicativo. ([Expresso][1])

---

### EXPRESS-REDIRECT-001: Evita redirecionamentos abertos; validar alvos de redirecionamento

Gravidade: Média

Obrigatório:

- DEVE validar destinos de redirecionamento derivados de entradas não confiáveis ​​(`next`, `return_to`, `url`).
- DEVE permitir apenas caminhos relativos do mesmo site (preferencial) ou uma lista de permissões estrita de domínios.
- DEVE voltar a um padrão seguro quando a validação falhar.

Padrões inseguros:

- `res.redirect(req.query.next)` sem validação.
- `res.redirect(req.body.url)` ou `res.location(...)` usando URLs não confiáveis.

Dicas de detecção:

- Procure por `res.redirect(` e `res.location(` e rastreie a origem do alvo.
- Procure parâmetros de consulta chamados `next`, `redirect`, `return`, `url`.

Correção:

- Permitir apenas caminhos relativos (começando com `/`) e proibir `//`, barras invertidas e variantes codificadas.
- Se forem necessários redirecionamentos entre domínios, adicione hosts exatos à lista de permissões e aplique `https`.

Notas:

- A documentação expressa chama redirecionamentos abertos como entrada perigosa do usuário e mostra a validação do host antes do redirecionamento. ([Expresso][1])
- Mantenha o Express atualizado: o Express teve um CVE relacionado ao redirecionamento aberto afetando algumas versões, e as atualizações fazem parte da postura de mitigação. ([NVD][9])

---

### EXPRESS-HEADERS-001: Use capacete (ou equivalente) para definir cabeçalhos de segurança essenciais

Gravidade: Média

Obrigatório:

- DEVE usar `helmet()` para definir cabeçalhos de segurança comuns.
- DEVE configurar o CSP de forma realista (evitar `unsafe-inline` sempre que possível) para páginas que renderizam conteúdo influenciado pelo usuário.
- DEVE definir `X-Content-Type-Options: nosniff`, defesas contra clickjacking (`X-Frame-Options` ou CSP `frame-ancestors`) e política de referência apropriada.

NOTA: É muito importante definir o script-src do CSP. Todas as outras directivas não são tão importantes e geralmente podem ser excluídas para facilitar o desenvolvimento.

Padrões inseguros:

- Nenhum cabeçalho de segurança definido no código do aplicativo e nenhuma evidência de que esteja definido na borda.
- CSP ausente em aplicativos que exibem conteúdo do usuário.
- Cabeçalhos de enquadramento mal configurados que permitem involuntariamente o clickjacking.

Dicas de detecção:

- Procure por `helmet(` uso; verifique se o CSP está configurado ou desabilitado.
- Pesquise `res.setHeader(` / `res.set(` para configuração do cabeçalho de segurança.
- Se não estiver visível no código do aplicativo, verifique a configuração do nginx/CDN; caso contrário, sinalize “verificar na borda”.

Correção:

- Adicione `helmet()` no início da ordem do middleware e configure:
  - CSP (`contentSecurityPolicy`)
  - Proteções de quadros (`frameguard` ou CSP `frame-ancestors`)
  - `X-Content-Type-Options` (`noSniff`)

Notas:

- As práticas recomendadas de segurança de produção expressa recomendam capacete e listar cabeçalhos de conjuntos de capacete por padrão. ([Expresso][1])
- A orientação dos cabeçalhos HTTP OWASP é uma referência útil ao ajustar políticas. ([Série de folhas de dicas OWASP] [10])

---

### EXPRESS-FINGERPRINT-001: Reduza as impressões digitais desativando `x-powered-by` e personalizando respostas de erro/404

Gravidade: Baixa (defesa profunda)

Obrigatório:

- DEVE desabilitar `X-Powered-By` usando `app.disable('x-powered-by')`.
- DEVE fornecer um manipulador 404 personalizado e um manipulador de erros personalizado para evitar respostas padrão distintas e controlar o vazamento de informações.

Padrões inseguros:

- Cabeçalho padrão `X-Powered-By: Express` deixado ativado.
- Respostas de erro Express 404/padrão em produção com formatação identificável e/ou rastreamentos de pilha.

Dicas de detecção:

- Procure por `app.disable('x-powered-by')`.
- Verifique a cauda do middleware para um 404 personalizado (`app.use((req,res)=>...)`) e um manipulador de erros personalizado (`app.use((err,req,res,next)=>...)`).
- Verifique se `NODE_ENV` está configurado corretamente para comportamento de produção (ver EXPRESS-ERROR-001). ([Expresso][11])

Correção:

- Adicionar:
  - `app.disable('x-powered-by')`
  - Um manipulador 404 personalizado
  - Um manipulador de erros personalizado que registra no lado do servidor e retorna mensagens genéricas no lado do cliente

Notas:

- Os documentos expressos recomendam explicitamente desabilitar `x-powered-by` e adicionar seus próprios manipuladores de erros e não encontrados. ([Expresso][1])

---

### EXPRESS-COOKIE-001: Os cookies devem usar atributos seguros e escopo mínimo

Gravidade: Média

Obrigatório:

- DEVE definir sinalizadores de cookie adequadamente para qualquer cookie de autenticação/sessão:
  - `Secure` quando HTTPS (produção) NOTA IMPORTANTE: Defina `Secure` apenas no ambiente de produção se o TLS estiver configurado. Ao executar em um ambiente de desenvolvimento local via HTTP, não defina a propriedade `Secure` nos cookies. Você deve fazer isso condicionalmente com base no fato de o aplicativo estar sendo executado no modo de produção. Você também deve incluir uma propriedade como `SESSION_COOKIE_SECURE` que pode ser você

sed para desabilitar cookies `seguros` ao testar via HTTP.

- `HttpOnly` para cookies de autenticação/sessão
- `SameSite` definido deliberadamente (`Lax` é uma linha de base comum; `Strict` se compatível; `None` apenas com `Secure` e uma necessidade justificada entre sites)

- DEVE evitar definir `domínio` de forma ampla (evite “todos os subdomínios”, a menos que seja necessário).
- DEVE definir uma expiração limitada apropriada ao risco e UX.

Padrões inseguros:

- Cookies de sessão/autenticação sem `HttpOnly`.
- Cookies sem `Secure` em HTTPS de produção.
- `SameSite=None` + endpoints de mudança de estado autenticados por cookie sem proteções CSRF.

Dicas de detecção:

- Procure por `res.cookie(`, `Set-Cookie`, `cookie: { ... }`, `express-session`, `cookie-session`.
- Verifique sinalizadores de cookies na configuração do middleware da sessão.

Correção:

- Defina esses atributos centralmente na configuração do middleware de sessão/cookie.

Notas:

- A orientação de segurança de produção expressa lista opções de segurança de cookies (`secure`, `httpOnly`, etc.). ([Expresso][1])
- `res.cookie()` finalmente define `Set-Cookie` com opções; os padrões seguem o comportamento do RFC 6265 quando as opções são omitidas. ([Expresso][5])
- A orientação de gerenciamento de sessão OWASP é relevante para a escolha de sinalizadores e tempos de vida. ([Série de folhas de dicas OWASP] [12])

---

### EXPRESS-SESS-001: Não use o nome do cookie de sessão padrão; evite impressões digitais de sessão

Gravidade: Baixa (defesa profunda)

Obrigatório:

- DEVE substituir o nome do cookie de sessão padrão (por exemplo, não mantenha `connect.sid` ao usar `express-session`).
- DEVE usar um nome genérico (por exemplo, `sessionId`), a menos que você tenha um motivo de compatibilidade.

Padrões inseguros:

- `express-session` usado sem `name:` ​​configurado (nome padrão do cookie).
- Vários aplicativos no mesmo domínio compartilham acidentalmente um nome de cookie.

Dicas de detecção:

- Procure por blocos de configuração `express-session`; verifique `nome:`.

Correção:

- Defina `name: 'sessionId'` (ou similar) nas opções `express-session`.

Notas:

- Os documentos expressos recomendam explicitamente não usar o nome do cookie de sessão padrão para reduzir impressões digitais. ([Expresso][1])

---

### EXPRESS-SESS-002: O armazenamento e o ciclo de vida da sessão devem ser seguros para produção

Gravidade: Alta

Obrigatório:

- NÃO DEVE usar `MemoryStore` em produção (ele não foi projetado para uso em produção).
- DEVE armazenar segredos de sessão fora do controle de origem e alterná-los com segurança.
- DEVE regenerar sessões em alterações de login/privilégio para reduzir o risco de fixação de sessão.
- NÃO DEVE armazenar segredos confidenciais em sessões de cookies legíveis pelo cliente.

Padrões inseguros:

- `app.use(session({ store: new MemoryStore(), ... }))` ou armazenamento ausente (o padrão é MemoryStore).
- Codificado, por exemplo: `secret: 'keyboard cat'` / `secret: 's3Cur3'` no repo.
- Usando `cookie-session` para armazenar tokens de acesso, tokens de atualização ou PII.

Dicas de detecção:

- Procure por `express-session` e procure por uso de `MemoryStore` ou `store` ausente.
- Procure por `secret:` na configuração da sessão e verifique se está codificado.
- Procure padrões `req.session = ...` e se dados confidenciais estão armazenados.

Correção:

- Use um armazenamento de sessão de produção (Redis, baseado em banco de dados, etc.).
- Carregar segredos do ambiente/gerenciador de segredos.
- No login: `req.session.regenerate(...)` ou fluxo equivalente com religação segura de privilégios.

Notas:

- `express-session` avisa explicitamente que `MemoryStore` não foi projetado para produção. ([Expresso][1])
- Documentos `express-session` girando segredos e regeneração de sessão para proteger contra fixação. ([Expresso][1])
- Express observa que as sessões baseadas em cookies serializam dados no cookie e que os dados do cookie ficam visíveis para o cliente; mantenha-o pequeno e não secreto. ([Expresso][1])

---

### EXPRESS-CSRF-001: Solicitações de alteração de estado autenticadas por cookie DEVEM ser protegidas por CSRF

Gravidade: Alta

- NOTA IMPORTANTE: Se os cookies não estiverem sendo usados para autenticação (ou seja, a autenticação é via cabeçalho de autenticação ou outro token passado), então não há risco de CSRF.

Obrigatório:

- DEVE proteger todos os endpoints que mudam de estado (POST/PUT/PATCH/DELETE) que dependem de cookies para autenticação.
- DEVE usar uma mitigação de CSRF bem compreendida (baseada em token é a linha de base típica).
- PODE adicionar defesa profunda: validação de origem/referenciador, aplicação de metadados de busca, cookies SameSite, requisitos de cabeçalho personalizados para XHR/busca —**mas não os trate como uma substituição completa**, a menos que explicitamente projetado e justificado.
- DEVE usar no mínimo

m requer um cabeçalho HTTP personalizado se os tokens CRSF baseados em formulário não forem práticos, pois este é o segundo método mais forte.

NOTA IMPORTANTE:

- Se a autenticação for feita através de cabeçalhos `Authorization: Bearer ...` (e não cookies), o CSRF clássico do navegador normalmente não é aplicável;

Padrões inseguros:

- Endpoints autenticados por cookie que mudam de estado sem proteção CSRF.
- Usar GET para ações de mudança de estado (amplifica o risco de CSRF).
- “Proteção CSRF” que verifica apenas um campo controlado pelo usuário.

Dicas de detecção:

- Enumerar rotas com métodos diferentes de GET/HEAD e identificar se os cookies permitem autenticação.
- Procure presença/ausência de middleware CSRF e verificações de token.
- Verifique também as APIs JSON, não apenas os formulários HTML.

Correção:

- Implementar tokens CSRF para fluxos autenticados por cookies.
- Adicione verificações de origem/referente sempre que possível e garanta que o SameSite esteja configurado adequadamente.

Notas:

- As orientações OWASP CSRF e OWASP Node.js recomendam tokens anti-CSRF como controle padrão para aplicativos da web. ([Série de folhas de dicas OWASP] [3])

---

### EXPRESS-CORS-001: CORS deve ser explícito e com menos privilégios

Gravidade: Média (alta se as credenciais estiverem configuradas incorretamente)

Obrigatório:

- Se o CORS não for necessário, DEVE mantê-lo desativado.
- Se o CORS for necessário:
  - DEVE incluir origens confiáveis na lista de permissões (não refletir `Origem` arbitrária sem validação).
  - NÃO DEVE combinar origens amplas com cookies credenciados (`Access-Control-Allow-Credentials: true`).
  - DEVE restringir métodos, cabeçalhos e cabeçalhos expostos ao que é necessário.

Padrões inseguros:

- `Access-Control-Allow-Origin: *` com `Access-Control-Allow-Credentials: true`.
- Refletindo `Origem` para todas as solicitações sem validação de lista de permissões.
- Aplicar middleware CORS permissivo globalmente quando apenas um subconjunto precisa de acesso de origem cruzada.

Dicas de detecção:

- Procure por `cors(`, `Access-Control-Allow-Origin`, `Access-Control-Allow-Credentials`.
- Inspecione se os cookies são usados para autenticação em endpoints expostos de origem cruzada.

Correção:

- Implementar uma lista de permissões de origem rigorosa e garantir solicitações credenciadas apenas para as origens pretendidas.
- Considere dividir a configuração do CORS por grupo de rotas em vez de global.

Notas:

- A orientação do cabeçalho HTTP OWASP cobre as implicações de segurança dos cabeçalhos de resposta, incluindo aqueles que afetam o comportamento do navegador; use-o como referência ao revisar a postura do cabeçalho. ([Série de folhas de dicas OWASP] [10])

---

### EXPRESS-PROXY-001: A confiança do proxy reverso (`trust proxy`) deve ser configurada corretamente

Gravidade: Média (Alta se estiver usando autenticação baseada em IP)

Obrigatório:

- Se estiver atrás de um proxy reverso/LB, DEVE configurar `app.set('trust proxy', ...)` para corresponder à cadeia de proxy real.
- NÃO DEVE definir cegamente `trust proxy = true`, a menos que você controle totalmente o comportamento do proxy e a reescrita do cabeçalho.
- DEVE garantir que o último proxy confiável substitua/remova `X-Forwarded-For`, `X-Forwarded-Host` e `X-Forwarded-Proto` para que os clientes não possam falsificá-los.

Padrões inseguros:

- `app.set('trust proxy', true)` em um aplicativo diretamente exposto à Internet ou atrás de proxies desconhecidos.
- Usando `req.ip`, `req.protocol`, `req.hostname` para decisões de segurança sem configuração correta de confiança de proxy.
- Limitação de taxa digitada por `req.ip` com cabeçalhos encaminhados falsificáveis.

Dicas de detecção:

- Procure por `app.set('trust proxy'`.
- Verifique os documentos infra (nginx/LB) para comportamento de reescrita de cabeçalho.
- Identifique qualquer lógica de segurança usando `req.ip`, `req.ips`, `req.protocol`, `req.hostname`.

Correção:

- Defina `trust proxy` para uma contagem de saltos, uma lista explícita de IP/sub-rede ou uma função personalizada que corresponda à sua rede.
- Certifique-se de que os proxies substituam os cabeçalhos encaminhados.

Notas:

- Express avisa explicitamente que quando `trust proxy` é `true`, o IP do cliente é derivado de `X-Forwarded-For`, e se os proxies não sobrescreverem os cabeçalhos encaminhados, o cliente pode fornecer qualquer valor. Ele também descreve que a ativação do proxy confiável afeta `req.hostname` e `req.protocol` derivados de cabeçalhos encaminhados. ([Expresso][2])

---

### EXPRESS-BODY-001: O tamanho do corpo da solicitação e os limites de análise DEVEM ser definidos adequadamente

Gravidade: Baixa

Obrigatório:

- DEVE definir limites explícitos de tamanho corporal para:
  - `express.json({ limite })`
  - `express.urlencoded({limite, parâmetroLimite, profundidade })`

- DEVE habilitar apenas os analisadores necessários; não analisa corpos grandes por padrão para todas as rotas.
- DEVE impor limites adicionais no nível do proxy reverso/gateway.

Padrões inseguros:

- Sem limites de corpo explícitos (aceitando JSON/urlencoded arbitrariamente grande).
- Analisadores globais aplicados a todas as rotas quando apenas algumas precisam de corpos.
- `parameterLimit` muito alto sem justificativa (potencial DoS).

Dicas de detecção:

- Procure por `express.json(` e confirme se `limit` está definido (ou aceito conscientemente).
- Procure por `express.urlencoded(` e inspecione `limit`, `parameterLimit` e `profundidade`.
- Revise os endpoints de upload/webhook para necessidades especiais de análise.

Correção:

- Configure analisadores com padrões conservadores e substitua por grupo de rotas quando necessário.

Notas:

- Documenta expressamente as opções `express.json` (incluindo `limit`, padrão para 100kb) e observa explicitamente que `req.body` não é confiável e deve ser validado. ([Expresso][5])
- Opções `express.urlencoded` de documentos expressos, incluindo `limit`, `parameterLimit` e `profundidade`. ([Expresso][5])
- A orientação do OWASP Node.js também recomenda definir limites de tamanho de solicitação. ([Série de folhas de dicas OWASP] [8])

---

### EXPRESS-INPUT-002: Evita poluição de parâmetros HTTP e confusão de tipo em `req.query`

Gravidade: Média

Obrigatório:

- DEVE tratar os valores `req.query` como potencialmente multivalorados (matriz/objeto), dependendo da análise da consulta.
- DEVE rejeitar parâmetros ambíguos com vários valores para campos sensíveis à segurança (por exemplo, `role`, `isAdmin`, `redirect`, `amount`, `userId`).
- DEVE considerar a análise explícita ou middleware dedicado se a poluição de parâmetros for uma preocupação.

Padrões inseguros:

- `if (req.query.admin) { ... }` sem verificações de tipo (arrays/objetos podem forçar a verdade).
- Passando `req.query` diretamente para objetos de consulta ORM/NoSQL.

Dicas de detecção:

- Pesquise comparações sensíveis à segurança em `req.query.*` sem imposição de tipo.
- Procure o código que assume que os parâmetros de consulta são strings.

Consertar:

- Validar forma: impõe apenas strings para determinados parâmetros e rejeita matrizes/objetos.
- Normalize as configurações de análise de consulta (simples versus estendida) quando aplicável e documentado.

Notas:

- A folha de dicas do OWASP Node.js destaca explicitamente que a análise de consulta expressa pode produzir strings, matrizes ou objetos e recomenda evitar a poluição de parâmetros HTTP. ([Série de folhas de dicas OWASP] [8])

---

### EXPRESS-XSS-001: Impedir XSS refletido/armazenado em respostas e modelos HTML

Gravidade: Alta

Obrigatório:

- DEVE escapar de conteúdo não confiável na saída HTML (os modelos devem escapar automaticamente por padrão; não ignorar).
- NÃO DEVE injetar strings não confiáveis ​​em HTML sem escapar/higienizar.
- DEVE definir CSP (via Helmet) para aplicativos que renderizam conteúdo controlado pelo usuário.
- DEVE manter `res.locals` livre de entradas controladas pelo usuário destinadas a modelos, a menos que seja validado/escapado.

Padrões inseguros:

- `res.send("<div>" + req.query.q + "</div>")`
- Passar HTML não confiável através de sinalizadores/filtros de modelos “seguros”.
- Escrever strings não confiáveis ​​em `res.locals` e depois renderizar sem escapar.

Dicas de detecção:

- Procure por `res.send(` com strings contendo entrada do usuário.
- Pesquise sinalizadores “seguros” de modelo (específicos do mecanismo) e rastreie a origem dos dados.
- Pesquise atribuições para `res.locals` e se elas podem conter dados não confiáveis.

Correção:

- Use um mecanismo de template com autoescaping; passe apenas dados validados.
- Para rich text que deve conter HTML, use um sanitizer confiável e uma política de lista de permissões.
- Adicione CSP com diretivas realistas.

Notas:

- Os documentos da API Express alertam explicitamente que `res.locals` “não deve conter entrada controlada pelo usuário” e é frequentemente usado para expor coisas como tokens CSRF a modelos. ([Expresso][5])
- A orientação de prevenção OWASP XSS fornece codificação de saída padrão e recomendações de políticas. ([Série de folhas de dicas OWASP] [4])
- O capacete pode mitigar algumas classes XSS por meio de cabeçalhos como CSP. ([Expresso][1])

---

### EXPRESS-TEMPLATE-001: Nunca renderize modelos ou caminhos de modelos não confiáveis (risco SSTI/LFI)

Gravidade: Crítica (se você puder provar que as strings/caminhos do modelo são controlados pelo usuário/atacante)

Obrigatório:

- NÃO DEVE renderizar modelos cujo conteúdo ou caminho/nome do modelo seja influenciado por entradas não confiáveis.
- NÃO DEVE carregar modelos de locais de sistemas de arquivos controlados pelo usuário.
- DEVE tratar “editores de modelos de e-mail”, “mecanismos de temas” e “armazenamento de modelos semelhantes a CMS” como designs de alto risco que exigem sandboxing e isolamento.

Padrões inseguros:

- `res.render(req.query.view, data)` onde `view` não está na lista de permissões.
- Renderizar um modelo a partir de uma string que inclui entrada do usuário (específica do mecanismo).
- Carregando modelos de diretórios de uploads.

Dicas de detecção:

- Procure por `res.render(` onde o primeiro argumento é derivado de request/DB sem lista de permissões.
- Pesquisa por APIs de compilação de modelos (específicas do mecanismo) alimentadas pelo conteúdo do usuário.

Correção:

- Use nomes de modelos permitidos e um diretório de modelos fixo.
- Se forem necessários modelos definidos pelo usuário, implemente um sandbox estrito e isole a execução.

Notas:

- O sistema de templates do Express depende do motor escolhido; presuma inseguro se a entrada do usuário influenciar a seleção ou fonte do modelo.

---

### EXPRESS-FILES-001: Impede a passagem de caminho e o fornecimento inseguro de arquivos (sendFile/download)

Gravidade: Alta

Obrigatório:

- NÃO DEVE passar caminhos de sistemas de arquivos controlados pelo usuário diretamente para `res.sendFile()` / `res.download()` / APIs de sistema de arquivos.
- DEVE usar `res.sendFile` com uma `root` fixa e opções estritas (por exemplo, negar dotfiles) ao servir arquivos selecionados pelo usuário de um diretório.
- DEVE impor verificações de autorização antes de servir arquivos específicos do usuário.

Padrões inseguros:

- `res.sendFile(req.query.path)` ou `res.download(req.params.file)` sem restrição de root.
- Rotas de serviço de arquivos que aceitam segmentos `..`, travessia codificada ou caminhos absolutos.

Dicas de detecção:

- Procure por `res.sendFile(` e rastreie a origem do argumento `path`.
- Procure por `res.download(` e rastreie a origem do argumento `path`.
- Procure por `fs.readFile`/`createReadStream` em caminhos derivados de solicitações.

Correção:

- Use um mapeamento de identificador para caminho armazenado no lado do servidor (DB), e não caminhos brutos de clientes.
- Use `root: <trusted_base_dir>` e `dotfiles: 'deny'` quando apropriado; valide estritamente o componente do nome do arquivo.

Notas:

- Os documentos `res.sendFile` do Express mostram o uso de uma opção `root` e `dotfiles: 'deny'` como parte de uma configuração de serviço segura. ([Expresso][5])
- `res.download` transfere o arquivo como um anexo, mas você ainda deve controlar/validar o `caminho` subjacente. ([Expresso][5])

---

### EXPRESS-STATIC-001: Fortaleça `express.static` / serve-static e nunca exiba uploads não confiáveis como conteúdo ativo

Gravidade: Média (se estiver servindo arquivos de usuários não confiáveis, se não houver limites robustos para extensões de arquivo)

Obrigatório:

- NÃO DEVE veicular uploads de usuários de um diretório estático público como conteúdo ativo (especialmente HTML/JS/SVG), a menos que seja explicitamente pretendido e em sandbox. Se tiver certeza de que o conteúdo está inativo (png, jpg, outras imagens, etc.), então pode ser seguro. Pode ser bom validar se as extensões de arquivo de imagem estão na lista de permissões antes de exibi-las.
- DEVE configurar a veiculação estática para:
  - negar/ignorar dotfiles
  - evite índices de diretório não intencionais se não forem necessários
  - aplicar aprox.

controles de cache opriate para ativos imutáveis

Padrões inseguros:

- `app.use(express.static('uploads'))` onde os usuários podem fazer upload de arquivos arbitrários.
- Servir HTML ou SVG carregado inline da mesma origem do aplicativo.

Dicas de detecção:

- Procure por `express.static(` e identifique os diretórios servidos.
- Compare diretórios servidos com locais de armazenamento de upload.
- Verifique as opções `dotfiles` e `index` no middleware estático.

Correção:

- Armazene uploads fora de qualquer raiz estática da web e sirva por meio de rotas controladas que definem `Content-Type` e `Content-Disposition: attachment` seguros quando apropriado.
- Configure `express.static(root, { dotfiles: 'deny'|'ignore', index: false (se desejado) })`.

Notas:

- Opções `express.static` de documentos expressos, incluindo comportamento de `dotfiles` e `index`. ([Expresso][5])

---

### EXPRESS-UPLOAD-001: Os uploads de arquivos devem ser validados, armazenados com segurança e servidos com segurança

Gravidade: Baixa - Média

Obrigatório:

- DEVE impor limites de tamanho de upload (aplicativo + borda).
- DEVE validar o tipo de arquivo usando listas de permissões e verificações de conteúdo (não apenas extensão de nome de arquivo).
- DEVE armazenar uploads fora de raízes executáveis/estáticas quando possível.
- DEVE gerar nomes de arquivos do lado do servidor (IDs aleatórios); não confie em nomes originais.
- DEVE servir formatos potencialmente ativos com segurança (download de anexo), a menos que seja explicitamente pretendido.

Padrões inseguros:

- Aceitar tipos de arquivos arbitrários e servi-los de volta in-line.
- Usando `file.originalname` como caminho de armazenamento.
- Falta de validação de tamanho/tipo.

Dicas de detecção:

- Procure por uso multer/busboy/formidável e verifique os `limites`.
- Verifique onde os arquivos carregados são gravados e como são veiculados.
- Verifique se os uploads terminam em `public/` ou em qualquer raiz `express.static`.

Consertar:

- Implementar validação de lista de permissões + armazenamento seguro + veiculação segura, de acordo com as orientações de upload do OWASP.

Notas:

- As orientações de upload de arquivos OWASP abrangem listas de permissões, validação de conteúdo, armazenamento e padrões de serviço seguro. ([Série de folhas de dicas OWASP] [13])

---

### EXPRESS-INJECT-001: Evita injeção de SQL (use consultas parametrizadas/ORM)

Gravidade: Alta

Obrigatório:

- DEVE usar consultas parametrizadas ou um construtor de consulta/ORM que parametrize nos bastidores.
- NÃO DEVE construir SQL por meio de concatenação de strings/literais de modelo com entrada não confiável.

Padrões inseguros:

- ``db.query(`SELECT * FROM usuários WHERE id = ${req.query.id}`)``
- `"SELECIONE ... WHERE nome = '" + req.body.name + "'"`

Dicas de detecção:

- Grep para strings `SELECT`, `INSERT`, `UPDATE`, `DELETE` em JS/TS.
- Rastreie entradas não confiáveis ​​em `.query(...)`, `.execute(...)` ou APIs SQL brutas.

Correção:

- Substitua por consultas parametrizadas (espaços reservados) ou APIs de consulta ORM.
- Valide os tipos (por exemplo, IDs inteiros) antes de consultar.

Notas:

- A orientação de prevenção de injeção SQL do OWASP favorece fortemente consultas parametrizadas. ([Série de folhas de dicas OWASP] [6])

---

### EXPRESS-INJECT-002: Impedir injeção de NoSQL/injeção de operador (estilo Mongo)

Gravidade: Alta (depende do aplicativo)

Obrigatório:

- DEVE validar tipos e esquemas para qualquer objeto de consulta criado a partir de entradas não confiáveis.
- DEVE evitar a injeção de operador (por exemplo, `$ne`, `$gt`, `$where`) se a entrada do usuário for mesclada em objetos de consulta.
- DEVE considerar bibliotecas/middleware defensivos quando apropriado.

Padrões inseguros:

- `collection.find(req.body)` onde o corpo é controlado pelo atacante.
- Mesclando `req.query`/`req.body` em consultas Mongo sem validação de esquema.

Dicas de detecção:

- Procure por chamadas `find(`, `findOne(`, ` agregate(` onde o argumento é derivado da solicitação.
- Verifique padrões como `{ ...req.query }` ou `Object.assign(query, req.body)`.

Correção:

- Use validação de esquema no limite; construir explicitamente objetos de consulta somente a partir de campos validados.

Notas:

- A folha de dicas do OWASP Node.js discute a validação de entrada e menciona os módulos do ecossistema Node comumente usados para sanitização em contextos NoSQL. ([Série de folhas de dicas OWASP] [8])

---

### EXPRESS-CMD-001: Impedir injeção de comando do SO (child_process)

Gravidade: Crítica a Alta (depende da exposição), prove que é controlada pelo usuário/atacante

Obrigatório:

- DEVE evitar executar comandos shell com entrada não confiável.
- Se o subprocesso for necessário:
  - DEVE evitar `exec()` / `execSync()` com strings influenciadas pelo invasor
  - NÃO DEVE usar `shell: true` com dados influenciados pelo invasor
  - DEVE usar `spawn()` com uma matriz de argumentos e listas de permissões estritas. Certifique-se de que o executável esteja codificado ou listado como permitido, não use um nome de comando fornecido pelo usuário.
  - DEVE colocar valores controlados pelo usuário após `--` quando houver suporte

ed pelo subcomando para evitar injeção de sinalizador

Padrões inseguros:

- `exec(req.query.cmd)`
- `exec(`convert ${userPath} ...`)`
- `spawn('sh', ['-c', userString])`
- `spawn(userString, ['foo'])`

Dicas de detecção:

- Procure por `child_process`, `exec(`, `execSync(`, `spawn(`, `fork(`.
- Rastreie dados de solicitação/banco de dados na construção do comando.

Correção:

- Se possível, escreva a funcionalidade em javascript ou use uma biblioteca em vez de subprocesso.
- Se inevitável, comando de código rígido e parâmetros estritamente permitidos.

Notas:

- As orientações de defesa de injeção de comando do OWASP OS abrangem padrões de evitar shell e lista de permissões. ([Série de folhas de dicas OWASP] [14])

---

### EXPRESS-SSRF-001: Evita falsificação de solicitação do lado do servidor (SSRF) em HTTP de saída

Gravidade: Média (alta em implantações em nuvem/LAN)

NOTA: Isso se aplica principalmente apenas a aplicativos que serão implantados em uma configuração de nuvem/LAN ou que possuem outros serviços http na mesma caixa. Às vezes, o recurso requer essa funcionalidade inevitavelmente (webhooks).

Obrigatório:

- DEVE tratar as solicitações de saída para URLs fornecidas pelo usuário como de alto risco se houver outros pontos de extremidade http privados acessíveis.
- DEVE validar e restringir destinos (hosts/domínios da lista de permissões) para qualquer busca de URL influenciada pelo usuário.
- DEVE bloquear o acesso a:
  - localhost/intervalos de IP privados/link-local
  - endpoints de metadados em nuvem

- DEVE permitir apenas `http`/`https` para recursos de busca de URL (para evitar esquemas como `file:`,`javascript:`)
- DEVE definir tempos limite e restringir redirecionamentos.

Padrões inseguros:

- `buscar(req.query.url)`
- Endpoints de “visualização de URL” / “importação de URL” que aceitam URLs arbitrários.

Dicas de detecção:

- Procure por `fetch(`, `axios(`, `got(`, `request(`, `node-fetch` uso onde o URL se origina de usuários/banco de dados.
- Revise testadores de webhook, visualizadores e buscadores de imagens.

Correção:

- Aplicar lista de permissões de esquema, lista de permissões de host, verificações de resolução de DNS/IP, tempos limite e política de redirecionamento.
- Considerar controlos de saída de rede ao nível da infraestrutura.

Notas:

- As orientações de prevenção SSRF da OWASP fornecem controles padrão e armadilhas comuns. ([Série de folhas de dicas OWASP] [7])

---

### EXPRESS-ERROR-001: O tratamento de erros NÃO DEVE vazar detalhes confidenciais na produção

Gravidade: Baixa

Obrigatório:

- DEVE definir um manipulador de erros centralizado (`app.use((err, req, res, next) => ...)`) no final do middleware.
- DEVE evitar retornar rastreamentos de pilha, mensagens de erro internas ou segredos para clientes em produção.
- DEVE registrar erros no servidor com redação apropriada.
- DEVE garantir que o aplicativo seja executado com configurações de produção para que o comportamento padrão não vaze detalhes.
- DEVE evitar registrar ou retornar informações confidenciais, como segredos, env vars,

sessões, cookies em mensagens de erro em produção.

Padrões inseguros:

- Retornando `err.stack` aos clientes.
- Usando middleware de erro somente dev em produção.
- `NODE_ENV` deixado como desenvolvimento, causando respostas de erro detalhadas.

Dicas de detecção:

- Verifique se existe um middleware final para tratamento de erros.
- Procure por `res.status(500).send(err)` ou similar.
- Verifique variáveis ​​de ambiente de produção e scripts de inicialização.

Consertar:

- Adicione um manipulador de erros seguro para produção que retorne mensagens genéricas e registre detalhes internamente.
- Certifique-se de que o ambiente esteja configurado para comportamento de produção.

Notas:

- A orientação de segurança de produção expressa recomenda tratamento de erros personalizado. ([Expresso][1])
- Os documentos de tratamento de erros expresso descrevem o comportamento padrão do manipulador de erros e como o modo de produção afeta o que é exposto. ([Expresso][11])

---

### EXPRESS-AUTH-001: Prevenir ataques de força bruta contra endpoints de autorização

Gravidade: Média

NOTA: Isso é altamente específico do aplicativo e, embora seja bom chamar a atenção do usuário, é difícil de corrigir sem configurações complexas adicionais. Prefira informar o usuário e caso ele solicite ajuda para implementar uma solução, ajude-o a orientar possíveis soluções.

Obrigatório:

- DEVE proteger os pontos de extremidade de login/autenticação contra força bruta.
- DEVE limitar a taxa por:
  1. Tentativas fracassadas consecutivas por nome de usuário+IP
  2. tentativas fracassadas por IP durante uma janela de tempo

Padrões inseguros:

- Tentativas de login ilimitadas.

Dicas de detecção:

- Identifique todos os pontos de extremidade de autenticação e verifique a limitação/estrangulamento de taxa.
- Pesquise por `rate-limiter-flexible`, `express-rate-limit` ou políticas de gateway.

Consertar:

- Implementar limitação/estrangulamento de taxa (aplicativo ou borda). Os documentos expressos apontam para `rate-limiter-flexible` como uma ferramenta para esta abordagem. ([Expresso][1])

Notas:

- A folha de dicas do OWASP Node.js também recomenda precauções contra força bruta. ([Série de folhas de dicas OWASP] [8])

---

### EXPRESS-DEPS-001: Dependência e higiene de patches (Express + Node + middleware crítico)

Gravidade: Média/Baixa

NOTA: `npm audit` geralmente retorna um grande número de "vulnerabilidades" insignificantes que realmente não importam. Você deve se concentrar apenas no Express ou em outros pacotes extremamente críticos, ignorando aqueles listados em ferramentas de desenvolvimento, empacotadores, etc.

Não atualize pacotes sem o consentimento do usuário. Isto pode quebrar o código existente de maneiras inesperadas. Em vez disso, informe-os sobre os pacotes desatualizados.

Obrigatório:

- DEVE manter o Express em uma linha de versão mantida (evite versões principais EOL).
- PODE usar `auditoria npm` em CI e durante trabalhos de manutenção.
- DEVE fixar dependências por meio de lockfiles e revisar cuidadosamente as principais atualizações.

Padrões inseguros:

- Executando versões EOL Express (por exemplo, linhas principais muito antigas).
- Ignorar as descobertas da `auditoria npm` sem triagem.
- Intervalos de dependência não fixados que são atualizados automaticamente para versões inseguras.

Dicas de detecção:

- Verifique `package.json` e lockfiles para a versão `express` e outras versões críticas de middleware.
- Inspecione pipelines de CI para etapas de `auditoria npm`/SCA.

Correção:

- Atualize para o Express estável mais recente e aplique patches.
- Adicionar verificação automatizada de dependências e processo de atualização.

Notas:

- A orientação expressa de segurança de produção enfatiza que vulnerabilidades de dependência podem comprometer o aplicativo e recomenda a `auditoria npm`. ([Expresso][1])
- Rastrear problemas de segurança que afetam as versões Express (incluindo CVEs conhecidos relacionados ao redirecionamento aberto). ([NVD][9])

---

### EXPRESS-DOS-001: Configurar proteções DoS (timeouts, limites, proxy reverso)

Gravidade: Baixa

NOTA: Pode ser difícil dizer, a partir do contexto do aplicativo fornecido, se o aplicativo é executado atrás de um proxy reverso. Você pode informar o usuário ou recomendar um, mas não tente configurar um sem que ele o inicie. Isso é altamente dependente da implantação.

Obrigatório:

- DEVE usar um proxy reverso para fornecer cache, balanceamento de carga e controles de filtragem quando viável.
- PODE configurar tempos limite de servidor/proxy e limites de conexão para reduzir a exposição ao Slowloris e padrões DoS semelhantes.
- DEVE garantir que erros de servidor/soquete sejam tratados para que conexões malformadas não interrompam o processo. (Express deve lidar com exceções, mas há casos extremos)

Padrões inseguros:

- Nenhum proxy reverso na frente de um servidor Node público, com padrões em todos os lugares.
- Manipuladores de erros ausentes em objetos de servidor/soquete.
- Tempos limite extremamente permissivos e tamanhos de corpo ilimitados.

Dicas de detecção:

- Inspecione a criação do servidor (`http.createServer`, `https.createServer`) e se os tempos limite estão definidos.
- Verifique a configuração do proxy/gateway para tempos limite e tamanho máximo do corpo.

Consertar:

- Explicar como configurar proxy reverso e tempos limite, definir limites de tamanho de solicitação
- adicionar middleware robusto para tratamento de erros

Notas:

- A orientação de segurança do Node para HTTP DoS discute o uso de proxies reversos e a configuração correta dos tempos limite do servidor. ([Node.js][15])

---

### EXPRESS-NODE-INSPECT-001: Não exponha o inspetor Node em produção

Gravidade: Crítica

NOTA: Certifique-se de que esta detecção esteja realmente no caminho de produção e não apenas sendo usada para depuração local.

Obrigatório:

- NÃO DEVE executar o Node com `--inspect` (especialmente vinculado a não-loopback) em produção.
- DEVE garantir que `NODE_OPTIONS` ou scripts de inicialização não habilitem o inspetor no prod.
- DEVE firewall/depurar apenas localmente.

Padrões inseguros:

- `node --inspect=0.0.0.0:9229 app.js` em produção.
- Configurações de contêiner/PM2/systemd habilitando o inspetor.

Dicas de detecção:

- Pesquise `--inspect` em Dockerfiles, Procfiles, unidades systemd, configurações PM2, scripts npm.
- Verifique `NODE_OPTIONS`.

Correção:

- Remover sinalizadores de inspetor dos comandos de início de produção; restringir ao desenvolvedor local.

Notas:

- A orientação de segurança do nó discute os riscos de exposição do inspetor (por exemplo, religação de DNS) e recomenda não executar o inspetor na produção. ([Node.js][15])

---

### EXPRESS-NODE-HTTP-001: Não habilite a análise HTTP insegura na produção

Gravidade: Alta

NOTA: Certifique-se de que esta detecção esteja realmente no caminho de produção e não apenas sendo usada para desenvolvimento local.

Obrigatório:

- NÃO DEVE usar o `insecureHTTPParser` do Node em produção.
- PODE sugerir a configuração de proxies front-end para normalizar solicitações ambíguas e reduzir o risco de contrabando de solicitações.

Padrões inseguros:

- Criando um servidor HTTP com `{ insecureHTTPParser: true }`.

Dicas de detecção:

- Procure por `insecureHTTPParser` no código de criação do servidor.

Correção:

- Remova análise insegura; confie na análise compatível com as especificações e normalize na borda.

Notas:

- A orientação de segurança do nó recomenda explicitamente não usar `insecureHTTPParser`. ([Node.js][15])

---

## 5) Heurísticas práticas de varredura (como “caçar”)

Ao verificar ativamente um repositório Express, estes padrões são de alto sinal:

- TLS/transporte:
  - `app.listen(80` sem menção de proxy reverso; faltando `helmet`; cookies faltando `secure` ([Express][1]) (NOTA: isso se aplica apenas a aplicativos voltados para a web, aplicativos internos provavelmente não terão TLS)

- Confiança do proxy:
  - `app.set('proxy confiável', verdadeiro)`; lógica usando `req.ip`/`req.protocol`/`req.hostname` ([Express][2])

- Cabeçalhos de segurança/impressão digital:
  - falta `helmet(`; falta `app.disable('x-powered-by')` ([Express][1])

- Cookies/sessões:
  - `express-session` com `store` ausente (risco MemoryStore), `secret:` codificado, `cookie: { secure/httpOnly/sameSite }` ([Express][1]) ausente
  - `cookie-session` armazenando objetos grandes ou segredos ([Express][1])

- Limites de análise do corpo:
  - `express.json()` ou `express.urlencoded()` sem `limit`/`parameterLimit`/`profundidade` ([Express][5])

- CSRF:
  - Rotas POST/PUT/PATCH/DELETE usando autenticação de cookie sem tokens CSRF/verificações de origem ([OWASP Cheat Sheet Series][3])

- Redirecionamentos abertos:
  - `res.redirect(req.query.next)` ou similar ([Express][1])

- Saída XSS/HTML:
  - `res.send(` construindo HTML com entrada do usuário; modelo de flags “seguros”; valores não confiáveis em `res.locals` ([Express][5])

- Manipulação de arquivos:
  - `res.sendFile(` / `res.download(` onde o caminho se origina da solicitação; `express.static('uploads')` ([Express][5])

- Injeção:
  - Strings SQL + literais de modelo em chamadas de banco de dados ([OWASP Cheat Sheet Series][6])
  - `child_process.exec` / `execSync` / `shell: true` ([Série de folhas de dicas OWASP] [14])

- SSRF:
  - saída `fetch/axios/got` para URLs fornecidos pelo usuário ([OWASP Cheat Sheet Series][7])

- Força bruta/abuso:
  - endpoints de autenticação sem limitação; sem middleware de limitação de taxa ([Express][1])

- Cadeia de abastecimento:
  - versões Express desatualizadas; sem arquivos de bloqueio; nenhum fluxo de trabalho `npm audit` ([Express][1])

- Riscos de tempo de execução do nó:
  - `--inspect` em scripts de produção; Uso de `insecureHTTPParser` ([Node.js][15])

Sempre tente confirmar:

- origem dos dados (não confiável versus confiável)
- tipo de coletor (HTML/modelo, SQL/NoSQL, subprocesso, sistema de arquivos, redirecionamento, HTTP de saída)
- controles de proteção presentes (validação, listas de permissões, middleware, configuração de proxy, políticas de cabeçalho)
- se as proteções estão na borda ou no código do aplicativo

---

## 6) Fontes (acessado em 27/01/2026)

Documentação Expressa Primária:

- Expresso: Melhores Práticas de Produção — Segurança: `https://expressjs.com/en/advanced/best-practice-security.html` ([Express][1])
- Expresso: Atrás de Proxies (`trust proxy`): `https://expressjs.com/en/guide/behind-proxies.html` ([Express][2])
- Referência da API Express 5.x (analisadores, estáticos, sendFile, redirecionamento, cookies): `https://expressjs.com/en/5x/api.html` ([Express][5])
- Expresso: Tratamento de erros: `https://expressjs.com/en/guide/error-handling.html` (

[Expresso][11])

Documentação do middleware de sessão:

- documentos de sessão expressa (sinalizadores de cookies, rotação secreta, mitigação de fixação, aviso do MemoryStore): `https://expressjs.com/en/resources/middleware/session.html` ([Express][1])

Referências oficiais de Node.js e npm:

- Node.js — Práticas recomendadas de segurança (DoS, orientação de proxy, riscos de inspetores, solicitações de notas de contrabando): `https://nodejs.org/en/learn/getting-started/security-best-practices` ([Node.js][15])
- Documentos npm — `auditoria npm`: `https://docs.npmjs.com/cli/v9/commands/npm-audit/` ([documentos npm][16])

Série de folhas de dicas OWASP:

- Gerenciamento de sessão: `https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html` ([Série de folhas de dicas OWASP] [12])
- Prevenção de CSRF: `https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html` ([Série de folhas de dicas OWASP][3])
- Prevenção XSS: `https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html` ([Série de folhas de dicas OWASP][4])
- Entrada

Validação: `https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html` ([Série de folhas de dicas OWASP][17])

- Prevenção de injeção de SQL: `https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html` ([Série de folhas de dicas OWASP][6])
- Defesa de injeção de comando do sistema operacional: `https://cheatsheetseries.owasp.org/cheatsheets/OS_Command_Injection_Defense_Cheat_Sheet.html` ([Série de folhas de dicas OWASP] [14])
- SSRF Pré

invenção: `https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet.html` ([OWASP Cheat Sheet Series][7])

- Upload de arquivo: `https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html` ([Série de folhas de dicas OWASP] [13])
- Redirecionamentos não validados: `https://cheatsheetseries.owasp.org/cheatsheets/Unvalidated_Redirects_and_Forwards_Cheat_Sheet.html` ([Série de folhas de dicas OWASP][18])
- Cabeçalhos HTTP: `ht

tps://cheatsheetseries.owasp.org/cheatsheets/HTTP_Headers_Cheat_Sheet.html` ([Série de folhas de dicas OWASP] [10])

Versionamento/avisos:

- Versão do pacote expresso (npm): `https://www.npmjs.com/package/express`
- Aviso de redirecionamento aberto expresso (CVE): `https://nvd.nist.gov/vuln/detail/CVE-2024-29041` ([NVD][9])

[1]: https://expressjs.com/en/advanced/best-practice-security.html 'Práticas recomendadas de segurança para Express em produção'
[2]: https://expressjs.com/en/guide/behind-proxies.html 'Express atrás de proxies'
[3]: https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html 'Prevenção de falsificação de solicitação entre sites - Série de folhas de dicas OWASP'
[4]: https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Pre

vention_Cheat_Sheet.html 'Prevenção de scripts entre sites - Série de folhas de dicas OWASP'
[5]: https://expressjs.com/en/5x/api.html 'Express 5.x - Referência da API'
[6]: https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html 'Prevenção de injeção de SQL - série de folhas de dicas OWASP'
[7]: https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet.html 'Prevenir falsificação de solicitação do lado do servidor

ion - Série de folhas de dicas OWASP'
[8]: https://cheatsheetseries.owasp.org/cheatsheets/Nodejs_Security_Cheat_Sheet.html 'Segurança Nodejs - Série de folhas de dicas OWASP'
[9]: https://nvd.nist.gov/vuln/detail/cve-2024-29041 'CVE-2024-29041 Detalhe - NVD'
[10]: https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Headers_Cheat_Sheet.html 'Cabeçalhos HTTP - Série de folhas de dicas OWASP'
[11]: https://expressjs.com/en/guide/error-handling.html 'Tratamento de erros expresso

'
[12]: https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html 'Gerenciamento de sessão - Série de folhas de dicas OWASP'
[13]: https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html 'Upload de arquivo - Série de folhas de dicas OWASP'
[14]: https://cheatsheetseries.owasp.org/cheatsheets/OS_Command_Injection_Defense_Cheat_Sheet.html 'Defesa de injeção de comando do sistema operacional - série de folhas de dicas OWASP'
[15]: https://nodejs.org/en/lea

rn/getting-started/security-best-practices 'Node.js - Melhores Práticas de Segurança'
[16]: https://docs.npmjs.com/cli/v9/commands/npm-audit/ 'npm-audit | Documentos npm'
[17]: https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html 'Validação de entrada - Série de folhas de dicas OWASP'
[18]: https://cheatsheetseries.owasp.org/cheatsheets/Unvalidated_Redirects_and_Forwards_Cheat_Sheet.html 'Redirecionamentos e encaminhamentos não validados - OWASP Cheat Shee

Série t'
