# Next.js (TypeScript/JavaScript) Especificação de segurança da Web (Next.js 16.1.x, Node.js 20.9+)

Este documento foi concebido como uma **especificação de segurança** que oferece suporte a:

1. **Geração de código seguro por padrão** para novo código de back-end Next.js (Route Handlers, API Routes, Server Actions, Proxy/Middleware).
2. **Revisão de segurança/caça de vulnerabilidades** em repositórios Next.js existentes (passivo “avisar problemas durante o trabalho” e ativo “verificar o repositório e relatar descobertas”).

Ele é intencionalmente escrito como um conjunto de **requisitos normativos** (“DEVE/DEVE/PODE”) mais **regras de auditoria** (como são os padrões ruins, como detectá-los e como corrigi-los/mitigá-los).

Escopo de destino: Next.js **16.1.x** (última linha mostrada nos documentos do App Router) ([Next.js][1]), em execução em Node.js **20.9+** (de acordo com os requisitos do sistema Next.js). ([Próximo.js][2])

---

## 0) Segurança, limites e restrições antiabuso (DEVE SEGUIR)

- NÃO DEVE solicitar, gerar, registrar ou confirmar segredos (chaves de API, senhas, chaves privadas, cookies de sessão, tokens OAuth, dumps `process.env`, URLs de banco de dados com credenciais).
- NÃO DEVE “consertar” a segurança desativando proteções (por exemplo, desativando verificações de origem, relaxando o CORS para `*`, ignorando verificações de autorização, desativando sinalizadores de segurança de cookies, desativando CSP porque é “difícil”).
- DEVE fornecer **descobertas baseadas em evidências** durante as auditorias: citar caminhos de arquivos, co

de snippets e valores de configuração que justificam cada afirmação.

- DEVE tratar a incerteza com honestidade: se existir uma proteção na infraestrutura (proxy reverso, CDN, WAF, cabeçalhos de plataforma), relate-a como “não visível no código do aplicativo; verifique em tempo de execução/configuração”.
- DEVE assumir que todo o código do servidor voltado para a solicitação pode ser acessado pelos invasores, a menos que haja um limite de autenticação claramente aplicado (não apenas “a UI não está vinculada a ele”).
- DEVE tratar os tipos TypeScript como \*\*

limites não relacionados à segurança\*\*: tipos não validam entrada de tempo de execução; verificações de tempo de execução são necessárias. ([Próximo.js][3])

---

## 1) Modos de operação

### 1.1 Modo de geração (padrão)

Quando solicitado a escrever um novo código Next.js ou modificar o código existente:

- DEVE seguir todos os requisitos **DEVE** nesta especificação.
- DEVE seguir todos os requisitos **DEVE**, a menos que o usuário diga explicitamente o contrário.
- DEVE preferir APIs seguras por padrão e bibliotecas comprovadas em vez de código de segurança personalizado.
- DEVE evitar a introdução de novos coletores de risco (execução dinâmica de código, redirecionamentos inseguros, exibição de arquivos de usuário como HTML, buscadores de URL SSRF, construção de strings SQL, etc.).

### 1.2 Modo de revisão passiva (sempre ativado durante a edição)

Ao trabalhar em qualquer lugar em um repositório Next.js (mesmo que o usuário não tenha solicitado uma verificação de segurança):

- DEVE “notar” violações desta especificação no código tocado/próximo.
- DEVE mencionar os problemas à medida que surgem, com uma breve explicação + solução segura.

### 1.3 Modo de auditoria ativo (solicitação de verificação explícita)

Quando o usuário pede para “verificar”, “auditar” ou “caçar vulnerabilidades”:

- DEVE pesquisar sistematicamente a base de código em busca de violações desta especificação.
- DEVE apresentar os resultados num formato estruturado (ver §2.3).

Ordem de auditoria recomendada:

1. Pontos de entrada e ambiente de implantação (Dockerfiles, scripts `package.json`, configuração de hospedagem).
2. Configuração Next.js (`next.config.*`), Proxy/Middleware, padrões de roteamento.
3. Autenticação, sessões, cookies.
4. Proteções CSRF e endpoints de mudança de estado (ações de servidor, manipuladores de rota, rotas de API).
5. XSS (React + CSP) e renderização HTML insegura.
6. Riscos de cache/vazamento de dados (renderização estática + cache + “usar cache”).
7. Manipulação de arquivos (uploads/do

downloads) e passagem de caminho. 8. Classes de injeção (uso indevido de SQL/ORM, execução de comandos, desserialização insegura). 9. Solicitações de saída (SSRF). 10. Tratamento de redirecionamentos (redirecionamentos abertos). 11. CORS e cabeçalhos de segurança.

---

## 2) Definições e orientações de revisão

### 2.1 Entrada não confiável (tratada como controlada pelo invasor, salvo prova em contrário)

Nos back-ends Next.js, a entrada não confiável inclui:

Roteador de aplicativos:

- Parâmetros do manipulador de rota e dados de solicitação:
  - `context.params` (segmentos dinâmicos), parâmetros de pesquisa (`request.url`, `new URL(request.url).searchParams`)
  - `request.headers`, `request.cookies`
  - `aguardar request.json()`, `aguardar request.formData()`, `aguardar request.text()`

- APIs dinâmicas usadas em componentes/funções de servidor:
  - Valores `headers()` e `cookies()` ([Next.js][4])

Pages Router:

- `req.query`, `req.cookies`, `req.body` em manipuladores `pages/api/*` ([Next.js][3])

Mais:

- Qualquer coisa de sistemas externos (webhooks, APIs de terceiros, filas de mensagens)
- Qualquer conteúdo de usuário persistente (linhas de banco de dados) originado de usuários

### 2.2 Solicitação de mudança de estado

Uma solicitação muda de estado se puder criar/atualizar/excluir dados, alterar o estado de autenticação/sessão, acionar efeitos colaterais (compra, envio de e-mail, envio de webhook) ou iniciar ações privilegiadas.

Nota especial para Next.js:

- **Ações do servidor** são invocadas por meio de solicitações de rede e podem alterar o estado; trate-os como pontos finais de mudança de estado. ([Próximo.js][5])

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

Esta é a menor “linha de base de produção” que evita configurações incorretas comuns de back-end do Next.js.

### 3.1 Execute Next.js em modo de produção (OBRIGATÓRIO)

- DEVE executar `next build` + `next start` (ou o equivalente da plataforma gerenciada), não `next dev`. O modo Dev tem comportamento diferente de erros/relatórios e não foi projetado para exposição de produção. ([Próximo.js][6])
- DEVE garantir `NODE_ENV=production` na produção (o padrão do Next.js é `NODE_ENV` com base no comando; verifique o ambiente de tempo de execução). ([Próximo.js][7])

### 3.2 Coloque um proxy reverso/camada de borda na frente durante a auto-hospedagem (OBRIGATÓRIO para Internet pública)

- Se for auto-hospedado, DEVE colocar um proxy reverso (por exemplo, nginx) ou camada de borda equivalente na frente do servidor Next.js para lidar com solicitações malformadas, ataques lentos, limites de tamanho de carga útil, limitação de taxa e preocupações semelhantes. ([Próximo.js][8])

### 3.3 Postura de base do cabeçalho/cookie (DEVE)

- DEVE definir uma linha de base de cabeçalhos de segurança globalmente (CSP, `X-Content-Type-Options`, defesa contra clickjacking via CSP `frame-ancestors` e/ou `X-Frame-Options`, etc.). Next.js fornece orientação para implementação de CSP por meio de proxy/cabeçalhos. ([Próximo.js][7])
- DEVE garantir que os cookies de autenticação/sessão usem atributos seguros (`Secure`, `HttpOnly`, `SameSite`) conforme apropriado. ([Próximo.js][9])
  NOTA IMPORTANTE: Defina `Secure` apenas no ambiente de produção. Ao correr em um

ambiente de desenvolvimento local sobre HTTP, não defina a propriedade `Secure` nos cookies. Você deve fazer isso condicionalmente com base no fato de o aplicativo estar sendo executado no modo de produção. Você também deve incluir uma propriedade como `SESSION_COOKIE_SECURE` que pode ser usada para desabilitar cookies `Secure` ao testar via HTTP.

### 3.4 Separação clara entre código somente servidor e código cliente (MUST)

- DEVE evitar que segredos e lógica privilegiada sejam agrupados no código do cliente.
- DEVE tratar as variáveis ​​de ambiente `NEXT_PUBLIC_*` como públicas (expostas ao navegador e incorporadas no momento da construção). ([Próximo.js][7])

---

## 4) Regras (geração + auditoria)

Cada regra contém: práticas necessárias, padrões inseguros, dicas de detecção e correção.

### NEXT-DEPLOY-001: Não execute `next dev` em produção; garantir o comportamento do modo de produção

Gravidade: Alta (se produção)

NOTA: Se eles estiverem implantando em um provedor de hospedagem Next.js específico, eles não precisam se preocupar com isso.

Obrigatório:

- NÃO DEVE implantar `next dev` ou qualquer modo de servidor de desenvolvimento para produção.
- DEVE garantir que as compilações de produção e o tempo de execução de produção sejam usados ​​para qualquer implantação pública. ([Próximo.js][6])

Padrões inseguros:

- `next dev` no Docker `CMD`, Procfile, comando de inicialização da plataforma.
- `NODE_ENV=development` na configuração do ambiente de produção.
- Endpoints ou sinalizadores somente de depuração/dev expostos publicamente.

Dicas de detecção:

- Pesquise scripts `package.json` e manifestos de implantação para `next dev`.
- Pesquise infra por `NODE_ENV=development` ou `NODE_ENV` ausente.
- Verifique os pontos de entrada do Kubernetes/PM2/systemd para `next dev`.

Consertar:

- Use `next build` durante CI/build e `next start` em tempo de execução (ou build/execução nativa da plataforma).
- Certifique-se de que o ambiente esteja definido como `NODE_ENV=production`.

Nota:

- O modo Dev é adequado para desenvolvimento local. Sinalize apenas se estiver sendo usado como ponto de entrada de produção.

---

### NEXT-SUPPLY-001: Fique por dentro das versões Next.js suportadas; corrigir rapidamente avisos de segurança

Gravidade: Alta (versão crítica se conhecida como vulnerável)

Obrigatório:

- DEVE executar uma linha de versão Next.js compatível e aplicar atualizações de segurança imediatamente. Next.js documenta uma política LTS/suporte. ([Próximo.js][10])
- DEVE tratar os avisos publicados como sinais de atualização urgente (por exemplo, atualização para uma versão corrigida). ([GitHub][11])

Padrões inseguros:

- Executando EOL Next.js maior/secundário sem correções de segurança backportadas.
- Ignorar avisos ou fixar `próximo` a um intervalo vulnerável.

Dicas de detecção:

- Verifique `package.json` e lockfiles para a `próxima versão`.
- Compare com a política de suporte e avisos do Next.js.

IMPORTANTE: Quaisquer versões anteriores a essas versões secundárias são vulneráveis à vulnerabilidade "react2shell" (https://nextjs.org/blog/CVE-2025-66478):
15.0.5
15.1.9
15.2.6
15.3.6
15.4.8
15.5.7
16.0.7

Correção:

- Atualize `next` para uma versão suportada e corrigida.
- Adicione um processo de atualização de dependência + verificações de CI.

---

### NEXT-SECRETS-001: Os segredos NÃO DEVEM ser confirmados ou expostos ao navegador

Gravidade: Alta (Crítica se o segredo for exposto ao cliente)

Obrigatório:

- DEVE armazenar segredos em variáveis ​​de ambiente ou em um gerenciador de segredos; NÃO DEVE submeter arquivos `.env*`.
- DEVE tratar `.env*` como sensível; Next.js avisa que “quase nunca deseja enviar esses arquivos”. ([Próximo.js][7])
- DEVE tratar qualquer variável de ambiente `NEXT_PUBLIC_*` como pública e visível ao navegador (incorporada ao pacote do cliente no momento da construção). ([Próximo.js][7])

Padrões inseguros:

- `.env`, `.env.local`, `.env.production` comprometido com o git.
- `NEXT_PUBLIC_API_KEY`, `NEXT_PUBLIC_SECRET`, `NEXT_PUBLIC_DATABASE_URL`, etc.
- Renderizar valores `process.env` em HTML ou retorná-los de rotas de API.

Dicas de detecção:

- Verifique o histórico do git e os arquivos repo em busca de conteúdo `.env`, `DB_PASS=`, `API_KEY=`, `SECRET=`.
- Grep para `NEXT_PUBLIC_` e revise quaisquer nomes de aparência sensível.
- Pesquise o uso de `process.env` em Componentes Cliente (`"use client"`) e módulos compartilhados.

Correção:

- Mova segredos para env vars somente de servidor (sem prefixo `NEXT_PUBLIC_`).
- Certifique-se de que `.env*` seja ignorado e que os segredos sejam injetados no momento da implantação.
- Gire as chaves vazadas.

---

### NEXT-SECRETS-002: Evite erros de empacotamento somente de servidor → cliente (o limite servidor/cliente é um limite de segurança)

Gravidade: Alta

Obrigatório:

- DEVE garantir que módulos somente de servidor (clientes de banco de dados, código dependente de segredo) não sejam importados para componentes de cliente ou outros caminhos de código agrupados pelo cliente.
- DEVE usar padrões/camadas somente de servidor (por exemplo, um DAL dedicado e módulos somente de servidor) e tratar violações de limites como bugs de segurança. Next.js discute explicitamente o conceito “somente servidor” para módulos confidenciais. ([Próximo.js][6])

Padrões inseguros:

- Importação de clientes de banco de dados, SDKs administrativos ou módulos de leitura secreta para componentes `"use client"`.
- Módulos `lib/` compartilhados importados pelo código do servidor e do cliente que fazem referência a segredos.

Dicas de detecção:

- Procure por `"use client"` e examine suas importações para dependências somente de servidor.
- Procure por pacotes de clientes de banco de dados (`pg`, `mysql2`, `mongoose`, `prisma`, SDKs admin) importados de `components/` ou outros caminhos de cliente.
- Pesquise o acesso `process.env` nos componentes da UI.

Consertar:

- Refatore em `lib/server/*` e importe apenas de contextos de servidor (Route Handlers, Server Components, Server Actions).
- Adicione um padrão de proteção (e/ou testes) explícito “somente servidor” para evitar importações acidentais.

---

### NEXT-AUTH-001: A autenticação/autorização DEVE ser aplicada no lado do servidor para cada ação protegida

Gravidade: Alta

Obrigatório:

- DEVE impor authn/authz no código do lado do servidor para:
  - Manipuladores de rota (`app/**/route.ts`) ([Next.js][1])
  - Rotas de API (`pages/api/**`) ([Next.js][3])
  - Ações do Servidor (funções `"use server"` invocadas pelos clientes) ([Next.js][6])

- NÃO DEVE confiar em verificações do lado do cliente (ocultar UI, protetores de rota no cliente) como a única proteção.

Padrões inseguros:

- Manipuladores de rotas sensíveis sem verificação de sessão.
- Ações do servidor que alteram dados, mas não validam a identidade/permissões do usuário.
- Verificações de “autorização” apenas em componentes React.

Dicas de detecção:

- Enumerar todos os Route Handlers e Rotas API; para cada um, identifique se requer autenticação.
- Grep para `"use server"` e revise todas as ações exportadas para verificações de autenticação.
- Pesquise ações administrativas acionadas por parâmetros de consulta/envios de formulários.

Consertar:

- Centralize os auxiliares de autenticação e chame-os em cada endpoint/ação protegido.
- Implementar verificações de autorização de privilégio mínimo (propriedade de função/recurso) por ação.

---

### NEXT-AUTH-002: Autenticação baseada em proxy/middleware NÃO DEVE criar lacunas de cobertura de rota

Gravidade: Alta

Obrigatório:

- Se estiver usando **Proxy** ou **Middleware** para verificações de autenticação, DEVE garantir que ele cubra todas as rotas que precisam de proteção.
- Notas da documentação do Next.js O proxy pode usar um `matcher` e, para autenticação, é recomendado que o proxy seja executado em todas as rotas. ([Próximo.js][12])
- DEVE tratar os erros do `matcher` como um risco de desvio de autenticação.

Padrões inseguros:

- Proxy/Middleware corresponde apenas a “páginas”, mas não a `/api/*`, ou corresponde apenas a alguns grupos de rotas.
- Correspondentes de estilo “lista de bloqueios” que perdem formulários de solicitação alternativos (variantes internas da estrutura, navegações RSC, etc.).

Dicas de detecção:

- Inspecione `proxy.ts` / `middleware.ts` e seu `matcher`.
- Compare os matchers com o conjunto completo de rotas (incluindo `app/api/**` e `pages/api/**`).
- Certifique-se de que os ativos estáticos e os internos do Next sejam excluídos apenas intencionalmente e que as rotas confidenciais sejam incluídas.

Consertar:

- Prefira incluir prefixos de rotas protegidas na lista de permissões ou executar o Proxy globalmente e fazer lógica interna de permissão/negação.
- Adicionar testes de integração: solicitar rota protegida sem autenticação e afirmar negação.

Notas:

- O proxy é comumente usado para “verificações otimistas”; não é um sistema de autorização completo por si só. ([Próximo.js][12])

---

### NEXT-CSRF-001: Endpoints de mudança de estado autenticados por cookie DEVEM ser protegidos por CSRF

Gravidade: Alta

- NOTA IMPORTANTE: Se os cookies não estiverem sendo usados ​​para autenticação (ou seja, a autenticação é via cabeçalho de autenticação ou outro token passado), então não há risco de CSRF.

Obrigatório:

- DEVE proteger todos os endpoints de mudança de estado que dependem de cookies para autenticação (POST/PUT/PATCH/DELETE).
- Para **Ações do Servidor**, Next.js realiza uma comparação Origem/Host para ajudar a prevenir CSRF; não o desative ou enfraqueça. ([Próximo.js][5])
- Se as ações do servidor precisarem ser chamadas de origens confiáveis adicionais (por exemplo, um domínio proxy confiável), DEVE usar `allowedOrigins` com uma lista de permissões estrita. ([Próximo.js][5])
- Para **Manipuladores de Rotas** e **Rotas de API**, M

UST implementa proteções CSRF explicitamente (tokens e/ou Origin/Referer estrito + SameSite + cabeçalhos personalizados). Os manipuladores de rotas são uma “saída de emergência” e exigem decisões de segurança em nível de aplicativo. ([Próximo.js][6])

Padrões inseguros:

- Endpoints POST (incluindo ações do servidor) que alteram o estado e aceitam solicitações entre sites sem verificações de token/origem.
- `allowedOrigins: ['*']` (ou curingas amplos) ou lógica “refletir Origem”.
- Usando solicitações GET para alterar o estado.

Dicas de detecção:

- Enumere todos os endpoints que mudam de estado e determine o mecanismo de autenticação.
- Pesquise `allowedOrigins` e confirme se a lista é pequena, específica e justificada. ([Próximo.js][5])
- Em Route Handlers/API Routes: procure por falta de validação de token CSRF ou falta de verificações de origem/referente.

Consertar:

- Implementar uma estratégia de token CSRF para endpoints de autenticação de cookie.
- Manter cookies `SameSite=Lax` ou `Strict` quando compatíveis; não trate SameSite sozinho como suficiente.
- Use validação estrita de origem para endpoints de API JSON, especialmente quando não estiver usando tokens CSRF.

Notas:

- XSS pode derrotar proteções CSRF; As defesas CSRF não substituem a prevenção XSS.

---

### NEXT-SESS-001: Os cookies de sessão DEVEM usar atributos seguros na produção

Gravidade: Média

Obrigatório (produção, HTTPS):

- DEVE definir cookies de sessão/autenticação com:
  - `Secure: true` (somente HTTPS) NOTA IMPORTANTE: Defina `Secure` apenas no ambiente de produção. Ao executar em um ambiente de desenvolvimento local via HTTP, não defina a propriedade `Secure` nos cookies. Você deve fazer isso condicionalmente com base no fato de o aplicativo estar sendo executado no modo de produção. Você também deve incluir uma propriedade como `SESSION_COOKIE_SECURE` que pode ser usada para desabilitar cookies `Secure` ao testar via HTTP.
  - `Http

Somente: true` (não legível por JS)

- `SameSite: 'Lax'` (recomendado) ou `'Strict'` se compatível

- Use `SameSite: 'none'` apenas quando você realmente precisar de cookies entre sites e DEVE também definir `Secure`. As opções de cookies são suportadas nas APIs de cookies Next.js. ([Próximo.js][9])

Padrões inseguros:

- `seguro: falso` em produção.
- `httpOnly: false` para cookies de autenticação.
- `sameSite: 'none'` sem uma necessidade clara, especialmente em endpoints de mudança de estado autenticados por cookie.

Dicas de detecção:

- Pesquise sites de configuração de cookies (`cookies().set(...)`, cabeçalhos `Set-Cookie`, configuração de cookie da biblioteca de autenticação).
- Revise as opções de cookies usadas em Route Handlers e Server Actions. ([Próximo.js][9])

Correção:

- Defina atributos de cookies seguros na camada de autenticação/sessão.
- Reduza o escopo dos cookies: evite `domínios` amplos, a menos que você precise explicitamente de cookies para todo o subdomínio.

---

### NEXT-SESS-002: As sessões DEVEM ser limitadas e resistentes à fixação/repetição

Gravidade: Baixa

Obrigatório:

- DEVE definir tempos de vida de sessão limitados apropriados ao aplicativo.
- DEVE alternar os identificadores de sessão nas alterações de login e privilégios.
- NÃO DEVE armazenar segredos confidenciais diretamente em armazenamento legível pelo cliente (incluindo cookies que não são criptografados).

Padrões inseguros:

- Sessões administrativas de longa duração sem rotação.
- “Lembre-se de mim para sempre” para funções privilegiadas sem controles de risco adicionais.
- Armazenar tokens de acesso/tokens de atualização em cookies não HttpOnly ou localStorage.

Dicas de detecção:

- Revise a configuração da biblioteca de autenticação para expiração e rotação.
- Procure por `localStorage.setItem('token'...)` e uso de cookies não HttpOnly.

Consertar:

- Utilize tempos de vida curtos para sessões privilegiadas; atualizar com rotação.
- Armazene apenas IDs de sessão opacos em cookies; mantenha o material confidencial no lado do servidor.

---

### NEXT-INPUT-001: A validação de entrada em tempo de execução é obrigatória (TypeScript não é validação)

Gravidade: Alta

Obrigatório:

- DEVE validar e normalizar todas as entradas controladas pelo invasor em tempo de execução (esquemas, verificações de tipo, limites).
- As rotas da API Next.js observam explicitamente que `req.body` é `any` e devem ser validadas antes do uso. ([Próximo.js][3])
- DEVE validar argumentos de ação do servidor (tratar como hostis). ([Próximo.js][6])

Padrões inseguros:

- Confiar diretamente na forma `req.body`.
- Passando `params.id`/`searchParams` diretamente em consultas de banco de dados ou caminhos de arquivo.
- Analisando JSON e assumindo tipos sem validação.

Dicas de detecção:

- Identifique endpoints que aceitam entrada JSON/formulário e verifique a validação do esquema.
- Grep para uso de `req.body.` e para uso de `await request.json()` em Route Handlers; verificar se a validação existe.

Consertar:

- Adicione validação de esquema (por exemplo, zod/yup/valibot) e rejeite entradas inválidas com 4xx.
- Valide IDs como tipos estritos (UUID/int) e aplique restrições de comprimento/conjunto de caracteres.

---

### NEXT-HEADERS-001: Cabeçalhos de segurança essenciais DEVEM ser definidos (no aplicativo ou na borda)

Gravidade: Baixa

Obrigatório (aplicativo web típico):

- DEVE definir:
  - CSP (`Política de Segurança de Conteúdo`) (consulte NEXT-CSP-001)
  - `X-Content-Type-Options: nosniff`
  - Defesa contra clickjacking (`frame-ancestors` em CSP e/ou `X-Frame-Options`)
  - `Referrer-Policy` e `Permissions-Policy` quando apropriado

- DEVE garantir que os cookies sejam definidos com atributos seguros (consulte NEXT-SESS-001). ([Próximo.js][9])

Padrões inseguros:

- Sem cabeçalhos de segurança em qualquer lugar (aplicativo ou borda).
- Permitir iframe involuntariamente.
- É possível detectar `Content-Type` devido à falta de `nosniff`.

Dicas de detecção:

- Verifique `proxy.ts`/middleware para `response.headers.set(...)`. ([Próximo.js][7])
- Se não estiver visível no código do aplicativo, sinalize como “verificar na borda/CDN”.

Correção:

- Definir cabeçalhos centralmente (Proxy/Middleware ou outro mecanismo centralizado).
- Garanta cabeçalhos consistentes em todas as rotas.

---

### NEXT-CSP-001: Use um CSP para reduzir o impacto do XSS; prefira nonces para scripts

Gravidade: Média

NOTA: É muito importante definir o script-src do CSP. Todas as outras directivas não são tão importantes e geralmente podem ser excluídas para facilitar o desenvolvimento.

Obrigatório:

- DEVE implantar um CSP, de preferência com nonces para scripts.
- DEVE seguir as orientações do Next.js para implementação de CSP (incluindo geração de nonce e aplicação de cabeçalho). ([Próximo.js][7])
- DEVE evitar afrouxar o CSP como uma “correção” (por exemplo, `script-src 'unsafe-inline'`) sem aceitação explícita de riscos.

Padrões inseguros:

- CSP ausente em aplicativos que exibem HTML/markdown gerados pelo usuário.
- CSP que permite amplamente scripts in-line ou avaliação sem justificativa estrita.

Dicas de detecção:

- Pesquise a configuração do cabeçalho `Content-Security-Policy` e examine suas diretivas.
- Verifique o uso de `next/script` e se um nonce é fornecido quando o CSP exige.

Consertar:

- Implementar CSP conforme orientação do Next.js; use um nonce e aplique-o de forma consistente.
- Reduza scripts embutidos; evite `eval`.

Notas:

- CSP é uma defesa profunda; ele não substitui a codificação e higienização de saída adequadas.

---

### NEXT-XSS-001: Impedir XSS refletido/armazenado na renderização React/Next

Gravidade: Alta

Obrigatório:

- DEVE confiar no escape padrão do React; NÃO DEVE inserir HTML não confiável no DOM sem higienização.
- DEVE tratá-los como sumidouros de alto risco:
  - `perigosamenteSetInnerHTML`
  - renderização de strings controladas pelo usuário em tags `<script>` ou atributos do manipulador de eventos

- DEVE evitar servir HTML carregado como HTML ativo (servir como anexo ou higienizar/transformar).

Padrões inseguros:

- `<div perigosamenteSetInnerHTML={{ __html: userContent }} />` sem desinfetante.
- Renderizadores Markdown configurados para permitir HTML bruto sem sanitizador.
- Retornando conteúdo do usuário com `Content-Type: text/html` de um Route Handler.

Dicas de detecção:

- Procure por `dangerouslySetInnerHTML`, `__html:`.
- Pesquise concatenação de strings semelhante a um modelo que cria HTML.
- Revise quaisquer recursos de “renderização de HTML” ou “visualização”.

Consertar:

- Limpe HTML não confiável com um desinfetante bem conservado; prefira listas de permissões estritas.
- Prefira renderizar o conteúdo do usuário como texto, não como HTML.
- Adicione CSP para reduzir o impacto.

---

### NEXT-ACTION-001: As ações do servidor DEVEM ser tratadas como endpoints públicos

Gravidade: Alta (Crítica para ações privilegiadas)

Obrigatório:

- DEVE aplicar os mesmos controles dos Route Handlers:
  - authn/authz
  - validação de entrada
  - Proteções CSRF/origem
  - limitação de taxa para ações sensíveis

- NÃO DEVE presumir que as Ações do Servidor são “inacessíveis” ou “internas”.
- DEVE compreender as proteções de solicitação de ação do servidor:
  - Next.js compara Origin com host para mitigar CSRF; origens extras devem ser explicitamente incluídas na lista de permissões por meio de `allowedOrigins`. ([Próximo.js][5])

Padrões inseguros:

- Funções `"use server"` que atualizam o estado do banco de dados sem verificação de autenticação.
- Adicionando `allowedOrigins` excessivamente amplo para “fazer funcionar”.

Dicas de detecção:

- Grep para `"use server"` e inventariar todas as ações exportadas.
- Identifique qualquer ação realizando gravações privilegiadas; confirme que verifica a identidade e a permissão.

Correção:

- Envolver ações com um auxiliar authz (falha fechada).
- Mantenha `allowedOrigins` mínimo e auditado.

---

### NEXT-ACTION-002: Não vaze acidentalmente segredos por meio de padrões de fechamento/ligação de ação do servidor

Gravidade: Média (Alta se segredos importantes forem expostos)

Obrigatório:

- DEVE tratar os valores fechados da Ação do Servidor como confidenciais e projetá-los intencionalmente.
- Next.js observa que os valores fechados são criptografados/assinados, mas os valores passados ​​​​por `.bind` não são criptografados; não confie em `.bind` para proteger segredos. ([Próximo.js][6])
- Se estiver usando uma chave de criptografia estável para ações do servidor em implantações, DEVE tratá-la como um segredo e armazená-la com segurança (não confirmá-la/registrá-la). ([Próximo.js][6])

Padrões inseguros:

- `myAction.bind(null, process.env.SECRET)` ou vinculação de tokens/IDs sensíveis que não devem ser influenciados pelo cliente.
- Registrar argumentos de ação que incluem segredos.

Dicas de detecção:

- Procure por `.bind(` nas funções de ação do servidor.
- Pesquise o uso de `process.env` perto de Ações do Servidor.

Correção:

- Evite vincular segredos a ações; buscar segredos do lado do servidor dentro da ação.
- Mantenha os argumentos de ação mínimos e validados.

---

### NEXT-CACHE-001: Evite vazamentos de dados por meio de renderização estática e cache compartilhado

Gravidade: Alta (crítica em caso de vazamento de dados entre usuários)

Obrigatório:

- DEVE garantir que as páginas/pontos de extremidade que retornam dados confidenciais ou específicos do usuário não sejam gerados estaticamente ou armazenados em cache de forma compartilhada.
- Os manipuladores de rota não são armazenados em cache por padrão, mas os manipuladores GET podem optar pelo comportamento de cache/estático; não faça isso para dados por usuário. ([Próximo.js][1])
- DEVE tratar o `use cache` e mecanismos de cache semelhantes como potencialmente entre usuários, a menos que seja explicitamente provado que é privado; não armazene em cache os resultados do banco de dados por usuário em caches compartilhados. ([Próximo

t.js][1])

- DEVE definir `Cache-Control: no-store` / `private` explícito para respostas confidenciais (APIs de autenticação/sessão/dados do usuário).

Padrões inseguros:

- `export const dynamic = 'force-static'` em uma rota que retorna dados específicos do usuário. ([Próximo.js][1])
- Usar `use cache` em torno de uma função que consulta dados específicos do usuário sem uma chave de cache por usuário. ([Próximo.js][1])
- Retornando respostas de autenticação/sessão de endpoints GET com cache habilitado.

Dicas de detecção:

- Procure por `dynamic = 'force-static'`, `revalidate`, `use cache`, `cacheLife`, `unstable_cache`.
- Inspecione todos os manipuladores de rota GET armazenados em cache/estáticos e confirme se eles retornam apenas dados públicos.
- Confirme se o uso de `cookies()`/`headers()` (APIs dinâmicas) não é removido acidentalmente de forma que torne uma rota estática. ([Próximo.js][1])

Correção:

- Marque rotas sensíveis como dinâmicas e defina `Cache-Control: no-store`.
- Certifique-se de que as chaves de cache incluam a identidade do usuário se o cache for realmente necessário (e armazene-o em um cache privado do usuário).

---

### NEXT-FILES-001: Os uploads do usuário DEVEM ser validados, armazenados com segurança e servidos com segurança

Gravidade: Média

Obrigatório:

- DEVE impor limites de tamanho de upload na borda e na lógica do aplicativo.
- DEVE validar o tipo de arquivo usando listas de permissões e verificações de conteúdo (não apenas extensão).
- DEVE armazenar uploads fora do diretório `public/` (qualquer coisa em `public/` é servido como conteúdo estático por padrão).
- DEVE servir formatos potencialmente ativos com segurança (`Disposição de conteúdo: anexo`), a menos que seja explicitamente pretendido.

Padrões inseguros:

- Aceitar tipos de arquivos arbitrários e servi-los de volta in-line.
- Usando o nome de arquivo fornecido pelo usuário como caminho de armazenamento.
- Escrever uploads em `public/uploads/` e servi-los diretamente.

Dicas de detecção:

- Pesquise `formData()`/análise multipart, `fs.writeFile`, uso do SDK de armazenamento.
- Procure qualquer caminho de gravação em `public/`.
- Procure endpoints de “download” que definam `Content-Type: text/html` ou forneçam arquivos do usuário inline.

Consertar:

- Use um armazenamento de objetos dedicado (S3/GCS) ou um diretório seguro no lado do servidor fora das raízes estáticas.
- Gere nomes de arquivos aleatórios no servidor; armazenar metadados separadamente.

---

### NEXT-PATH-001: Impedir passagem de caminho e acesso inseguro a arquivos

Gravidade: Alta

Obrigatório:

- NÃO DEVE usar strings controladas pelo usuário como caminhos do sistema de arquivos.
- DEVE validar e normalizar identificadores; use listas de permissões e diretórios base seguros.
- DEVE evitar a leitura de arquivos arbitrários com base nos parâmetros da solicitação.

Padrões inseguros:

- `fs.readFile(request.nextUrl.searchParams.get('caminho'))`
- `path.join(base, userPath)` sem normalização + verificações de limites

Dicas de detecção:

- Pesquise o uso de `fs.` em Route Handlers/API Routes.
- Procure por `path.join`/`path.resolve` alimentado por parâmetros de solicitação.

Correção:

- Use IDs opacos que mapeiam caminhos armazenados no lado do servidor.
- Imponha que os caminhos resolvidos permaneçam dentro de um diretório base pretendido.
- Sanitizar e impedir que `..` seja usado ao criar URLs

---

### NEXT-SSRF-001: Solicitações de saída usando URLs influenciados pelo usuário DEVEM ser restritas

Gravidade: Média (Alta em redes internas)

NOTA: Isso se aplica principalmente apenas a aplicativos que serão implantados em uma configuração de nuvem/LAN ou que possuem outros serviços http na mesma caixa. Às vezes, o recurso requer essa funcionalidade inevitavelmente (webhooks).

Obrigatório:

- DEVE tratar qualquer `fetch()` do lado do servidor para uma URL fornecida pelo usuário como de alto risco.
- DEVE listar destinos (hosts/domínios) para recursos de busca de URL.
- DEVE bloquear:
  - localhost/intervalos de IP privados/link-local
  - endpoints de metadados em nuvem

- DEVE restringir os protocolos a `http:` e `https:`.
- DEVE definir tempos limites estritos e restringir redirecionamentos.

Padrões inseguros:

- `await fetch(req.query.url)` ou `await fetch((await request.json()).url)`
- Endpoints de “visualização de URL” que buscam URLs arbitrários.

Dicas de detecção:

- Procure por `fetch(` no código do servidor e rastreie a origem da URL.
- Procure os recursos “webhook tester”, “preview”, “import from URL”.

Correção:

- Analisar URL, impor `http/https`, listar nomes de host, resolver novamente DNS/IP para bloquear intervalos privados.
- Definir tempos limite (AbortSignal) e limitar redirecionamentos.

---

### NEXT-REDIRECT-001: Impedir redirecionamentos abertos (incluindo fluxos de autenticação)

Gravidade: Baixa

Obrigatório:

- DEVE validar alvos de redirecionamento derivados de entradas não confiáveis (por exemplo, `next`, `redirect`, `returnTo`).
- DEVE preferir redirecionar apenas para caminhos relativos do mesmo site.
- DEVE validar qualquer URL absoluto em relação a uma lista de permissões.
- DEVE garantir que os URLs sejam do esquema `http` ou `https:`, proibindo o esquema `javascript:`

Padrões inseguros:

- `redirect(searchParams.get('próximo')!)`
- `NextResponse.redirect(new URL(req.nextUrl.searchParams.get('to')!, req.url))` sem verificações

Dicas de detecção:

- Procure por `redirect(` (componentes/ações do servidor) e `NextResponse.redirect`.
- Pesquise `res.redirect(` em API Routes. ([Next.js][3])

Correção:

- Permitir apenas caminhos relativos (`/path`) e rejeitar URLs relativos a protocolo (`//evil.com`) ou absolutos.
- Se inválido, volte para um padrão seguro (home/painel).

---

### NEXT-CORS-001: CORS deve ser explícito e com menos privilégios

Gravidade: Média (alta se as credenciais estiverem configuradas incorretamente)

Obrigatório:

- Se o CORS não for necessário, DEVE mantê-lo desativado.
- As rotas da API Next.js não definem cabeçalhos CORS por padrão, o que significa que eles são da mesma origem por padrão; habilite o CORS apenas quando você realmente precisar dele. ([Próximo.js][3])
- Se ativar o CORS:
  - DEVE listar origens confiáveis (sem reflexo de origem arbitrária)
  - DEVE ter cuidado com solicitações credenciadas (cookies); nunca combine origens amplas com credenciais.
  - DEVE restringir métodos e cabeçalhos.

Padrões inseguros:

- `Access-Control-Allow-Origin: *` com `Access-Control-Allow-Credentials: true`
- Refletindo `Origem` sem validação.

Dicas de detecção:

- Procure por `Access-Control-Allow-Origin`, `cors`, middleware/wrappers “CORS”.
- Revise os manipuladores `OPTIONS` de comprovação.

Correção:

- Implementar lista de permissões de origem rigorosa e métodos/cabeçalhos mínimos.
- Certifique-se de que os cookies não sejam expostos de origem cruzada, a menos que seja necessário e revisado.

---

### NEXT-WEBHOOK-001: Os endpoints do webhook DEVEM verificar a autenticidade usando o corpo bruto

Gravidade: Média

Obrigatório:

- DEVE verificar as assinaturas do webhook usando o **corpo da solicitação bruta** (não um objeto analisado re-serializado).
- Next.js observa que um caso de uso para desabilitar a análise do corpo é verificar o corpo bruto de uma solicitação de webhook. ([Próximo.js][3])

Padrões inseguros:

- Verificando assinaturas de webhook em `JSON.stringify(req.body)` (pode alterar a formatação).
- Aceitar webhooks sem verificação de assinatura e sem lista de permissões.

Dicas de detecção:

- Encontre endpoints de webhook (`/api/webhook`, `/app/api/**/webhook`).
- Verifique se eles usam verificação corporal bruta.

Correção:

- Desative a análise automática do corpo do Next.js apenas para essas rotas de webhook, leia os bytes brutos com segurança, verifique a assinatura e, em seguida, analise.

---

### NEXT-INJECT-001: Impedir injeção de SQL (use consultas parametrizadas/ORM)

Gravidade: Alta

Obrigatório:

- DEVE usar consultas parametrizadas ou um ORM que parametrize nos bastidores.
- NÃO DEVE construir SQL por concatenação de strings/strings de modelo com entrada não confiável.

Padrões inseguros:

- ``db.query(`SELECT * FROM usuários WHERE id = ${id}`)``
- `"ONDE nome = '" + usuário + "'"`

Dicas de detecção:

- Grep para strings `SELECT`, `INSERT`, `UPDATE`, `DELETE`.
- Rastreie entradas não confiáveis ​​(`params`, `searchParams`, `req.query`, `req.body`, `request.json()`) em chamadas de banco de dados.

Correção:

- Use instruções preparadas/APIs de consulta ORM.
- Valide e coaja os tipos antes de consultar.

---

### NEXT-INJECT-002: Evita a injeção de comandos do sistema operacional e o uso inseguro de subprocessos

Gravidade: Crítica a Alta

Obrigatório:

- DEVE evitar executar comandos do sistema operacional com entrada controlada pelo invasor.
- Se o subprocesso for necessário:
  - DEVE passar argumentos como um array (não uma única string de shell)
  - NÃO DEVE usar `shell: true` com strings influenciadas pelo invasor
  - DEVE usar listas de permissões estritas para qualquer componente variável

Padrões inseguros:

- `exec("converter " + nome do arquivo)`
- `spawn("bash", ["-c", userInput])`
- `spawn(userInput, ["foo"])`

Dicas de detecção:

- Procure por `child_process`, `exec`, `spawn`, `shell: true`.

Correção:

- Use APIs de biblioteca em vez de comandos shell.
- Comandos de código rígido e parâmetros validados na lista de permissões (e use `--` para separar sinalizadores quando houver suporte).

---

### NEXT-INJECT-003: Evite execução dinâmica de código e desserialização insegura

Gravidade: Alta a Crítica

Obrigatório:

- NÃO DEVE usar `eval`, `new Function`, `vm.runIn*` em strings não confiáveis.
- DEVE tratar a desserialização de formatos complexos (YAML, XML, serialização personalizada) como arriscada; use analisadores seguros e esquemas rígidos.

Padrões inseguros:

- `eval(req.body.code)`
- Análise de YAML da entrada do usuário com um esquema não seguro.

Dicas de detecção:

- Procure por `eval(`, `new Function`, `vm.`, `require(` com não literais.
- Pesquise `js-yaml`, analisadores XML, uso de serializador personalizado em entradas não confiáveis.

Correção:

- Remover execução dinâmica; use intérpretes seguros ou analisadores rigorosos.
- Validar e restringir a entrada.

---

### NEXT-LOG-001: O registro NÃO DEVE vazar segredos ou cabeçalhos confidenciais

Gravidade: Média

Obrigatório:

- NÃO DEVE registrar:
  - Cabeçalhos `Autorização`
  - cookies/tokens de sessão
  - solicitar órgãos contendo credenciais
  - variáveis de ambiente ou dumps de configuração

- DEVE implementar registro estruturado com redação.

Padrões inseguros:

- `console.log(req.headers)` em endpoints de autenticação
- `console.log(process.env)` no código do servidor

Dicas de detecção:

- Procure por `console.log(`, `logger.info(`, `debug(` nas rotas/ações do servidor.
- Verifique se há registros de cabeçalhos/cookies/corpo.

Correção:

- Redigir campos sensíveis; registre apenas o que é necessário para depuração.
- Utilizar mensagens de erro seguras para clientes; mantenha os detalhes apenas do lado do servidor.

---

### NEXT-ERROR-001: O tratamento de erros DEVE evitar o vazamento de detalhes de implementação na produção

Gravidade: Baixa

Obrigatório:

- NÃO DEVE expor rastreamentos de pilha ou detalhes de erros internos aos usuários finais em produção.
- Garanta o comportamento do modo de produção (o tratamento de erros de produção do Next.js difere do dev). ([Próximo.js][6])

Padrões inseguros:

- Retornando `err.stack` em respostas JSON.
- Mostrando dados detalhados de exceção para usuários não autenticados.

Dicas de detecção:

- Procure por `res.status(500).json(err)` ou `return Response.json(err)`.
- Verifique se as respostas de erro foram higienizadas.

Consertar:

- Retornar mensagens de erro genéricas aos clientes; detalhes do log no lado do servidor com redação.

---

### NEXT-PROXY-001: Proxy/Middleware não deve introduzir contrabando de cabeçalho ou encaminhamento inseguro de cabeçalho

Gravidade: Média

Obrigatório:

- DEVE ter cuidado ao copiar/encaminhar cabeçalhos de solicitação upstream:
  - Não encaminhe cabeçalhos `x-forwarded-*` controlados pelo invasor, a menos que você tenha uma cadeia de proxy confiável.
  - Não encaminhe `Autorização`/cookies para serviços de saída não relacionados.

- Os padrões de proxy Next.js geralmente alteram os cabeçalhos; certifique-se de que isso não crie problemas de segurança.

Padrões inseguros:

- Clonar cegamente todos os cabeçalhos de solicitação para uma chamada `fetch()` de saída.
- Confiar em `x-forwarded-host` ou `host` para construir URLs absolutos confidenciais sem lista de permissões.

Dicas de detecção:

- Pesquise o uso de `headers()` e `request.headers` (especialmente para construção de URL). ([Próximo.js][4])
- Pesquise Proxy/Middleware para reescritas de cabeçalho.

Consertar:

- Lista de permissões encaminhadas explicitamente.
- Valide nomes de host antes de usá-los para criar URLs de retorno de chamada ou redirecionamentos.

---

### NEXT-HOST-001: A construção de URL derivada de host/origem DEVE estar na lista de permissões

Gravidade: Média

Obrigatório:

- NÃO DEVE gerar URLs absolutos sensíveis à segurança (links de redefinição de senha, URLs de retorno de chamada OAuth, links de verificação de e-mail) diretamente de cabeçalhos `Host` não validados.
- Para Ações de Servidor, a correspondência Origem/Host faz parte da mitigação de CSRF; não o enfraqueça. ([Próximo.js][5])

Padrões inseguros:

- `const base = "https://" + request.headers.get("host")`
- Usando `x-forwarded-host` não validado para geração de URL absoluta.

Dicas de detecção:

- Grep para `.get('host')`, `.get('x-forwarded-host')` e construção de URL absoluta.
- Revise o código de geração de link de e-mail relacionado à autenticação.

Correção:

- Use uma origem de aplicativo canônico configurado e permitido (por exemplo, `APP_ORIGIN=https://example.com`).
- Lista de permissões de nomes de host; falhar fechado.

---

### NEXT-DOS-001: Limitação de taxa e controles de recursos DEVEM existir para endpoints propensos a abusos

Gravidade: Média

Obrigatório:

- DEVE implementar limitação/estrangulamento de taxa para:
  - login, redefinição de senha, inscrição
  - ações de servidor caras
  - ingestão de webhook

- DEVE implementar limites de tamanho de solicitação (consulte NEXT-LIMITS-001).
- Se for auto-hospedado, DEVE contar com proxy reverso para proteções adicionais. ([Próximo.js][8])

Padrões inseguros:

- Sem limitação nos endpoints de login/redefinição.
- Ações caras que podem ser chamadas sem autorização ou com frequência ilimitada.

Dicas de detecção:

- Identifique pontos de extremidade de autenticação e verifique a limitação de taxa.
- Pesquise os fluxos “enviar e-mail”, “cobrar”, “gerar relatório”.

Correção:

- Adicione limitação de taxa de borda e aceleradores de usuário/IP no nível do aplicativo.
- Adicionar filas de trabalhos para trabalhos pesados; retorne 202 quando apropriado.

---

## 5) Heurísticas práticas de varredura (como “caçar”)

Ao digitalizar ativamente, use estes padrões de sinal alto:

- Production misconfig:
  - `next dev`, `NODE_ENV=development`, comandos de inicialização somente dev ([Next.js][7])

- Secrets exposure:
  - `.env` confirmado, `NEXT_PUBLIC_` em variáveis sensíveis ([Next.js][7])
  - `process.env` usado em módulos `"use client"`

- Cobertura de autenticação:
  - `app/**/route.ts` ou `pages/api/**` sem verificações de autenticação ([Next.js][1])
  - ações `"use server"` com gravações de banco de dados e sem autorização ([Next.js][6])
  - Matchers `proxy.ts` / `middleware.ts` que excluem rotas confidenciais ([Next.js][12])

- CSRF:
  - cookie-auth POST/PUT/PATCH/DELETE sem verificações de token/origem
  - `serverActions.allowedOrigins` muito amplo ([Next.js][5])

- XSS:
  - `dangerouslySetInnerHTML`, renderização de markdown HTML bruto
  - CSP ausente/CSP excessivamente permissivo ([Next.js][7])

- Cache/vazamento de dados:
  - `dynamic = 'force-static'` em manipuladores GET sensíveis ([Next.js][1])
  - `use cache`, `cacheLife`, `unstable_cache` em torno de dados específicos do usuário ([Next.js][1])

- Arquivos:
  - escrever uploads em `público/`
  - `fs.readFile` / `path.join` com entrada de solicitação

- SSRF:
  - `fetch(userProvidedUrl)` de manipuladores de rota/ações do servidor

- Redirecionar:
  - `redirect(searchParams.get('next'))`, `NextResponse.redirect(...)`, `res.redirect(req.query.next)` ([Next.js][3])

- CORS:
  - origens curinga, reflexão de origem, credenciais + origens amplas ([Next.js][3])

- Limites:
  - Rotas de API com `bodyParser: false` e sem verificação de corpo bruto para webhooks ([Next.js][3])
  - `serverActions.bodySizeLimit` gerado sem justificativa ([Next.js][5])

- Higiene de dependência:
  - versões `next` antigas que entram em conflito com políticas/recomendações de suporte ([Next.js][10])

Sempre tente confirmar:

- origem dos dados (não confiável versus confiável)
- tipo de coletor (HTML/DOM, SQL, subprocesso, arquivos, redirecionamento, HTTP de saída)
- controles de proteção presentes (validação de esquema, listas de permissões, verificações de middleware/proxy, auxiliares de autorização, proteções de borda)

---

## 6) Fontes (acessado em 27/01/2026)

Documentação da estrutura primária (Next.js):

- Documentos Next.js: Instalação (requisitos do sistema / versão do Node) - `https://nextjs.org/docs/app/getting-started/installation`
- Documentos Next.js: manipuladores de rota - `https://nextjs.org/docs/app/getting-started/route-handlers`
- Documentos Next.js: Rotas de API (roteador de páginas) - `https://nextjs.org/docs/pages/building-your-application/routing/api-routes`
- Documentos Next.js: Variáveis de ambiente - `https://nextjs.org/docs/pages/guides/environment-variables`
- Próximo.

js Documentos: Segurança de dados — `https://nextjs.org/docs/app/guides/data-security`

- Documentos Next.js: Política de segurança de conteúdo - `https://nextjs.org/docs/app/guides/content-security-policy`
- Documentos Next.js: Proxy - `https://nextjs.org/docs/app/getting-started/proxy`
- Documentos Next.js: `serverActions.allowedOrigins` e `serverActions.bodySizeLimit` - `https://nextjs.org/docs/app/api-reference/config/next-config-js/serverActions`
- Documentos Next.js: `cookies()` — `h

ttps://nextjs.org/docs/app/api-reference/functions/cookies`

- Documentos Next.js: `headers ()` - `https://nextjs.org/docs/app/api-reference/functions/headers`
- Documentos Next.js: auto-hospedagem (orientação sobre proxy reverso) - `https://nextjs.org/docs/pages/guides/self-hosting`
- Documentos Next.js: Política de suporte (versões suportadas/LTS) - `https://nextjs.org/docs/support-policy`

Orientações e avisos de segurança Next.js:

- Blog Next.js: Como pensar sobre segurança em Next.js — `https://nextjs.org/blog/security-nextjs-server-components-actions`
- Aviso de segurança do GitHub: Next.js DoS por meio de componentes de servidor/ações de servidor (CVE-2026-23864) — `https://github.com/advisories/GHSA-fq29-rrrv-cq2m`
- Blog Next.js: Atualização de segurança (exemplo de contexto de aconselhamento de segurança) — `https://nextjs.org/blog/security-update`

Referências gerais de segurança da web (linha de base recomendada):

- Série de folhas de dicas OWASP (CSRF, gerenciamento de sessão, prevenção XSS, prevenção SSRF, upload de arquivos, cabeçalhos HTTP) - `https://cheatsheetseries.owasp.org/`

[1]: https://nextjs.org/docs/app/getting-started/route-handlers 'Primeiros passos: manipuladores de rota | Próximo.js'
[2]: https://nextjs.org/docs/app/getting-started/deploying 'Primeiros passos: implantação'
[3]: https://nextjs.org/docs/pages/building-your-application/routing/api-routes 'Roteamento: Rotas API | Próximo.js'
[4]: https://nextjs.org/docs/app/api-reference/functions/headers 'Funções: cabeçalhos | Próximo.js'
[5]: https://nextjs.org/docs/app/api-reference

/config/next-config-js/serverActions 'next.config.js: serverActions | Próximo.js'
[6]: https://nextjs.org/blog/security-nextjs-server-components-actions 'Como pensar sobre segurança em Next.js | Próximo.js'
[7]: https://nextjs.org/docs/pages/guides/environment-variables 'Guias: Variáveis de ambiente | Próximo.js'
[8]: https://nextjs.org/docs/pages/guides/self-hosting 'Guias: auto-hospedagem'
[9]: https://nextjs.org/docs/app/api-reference/functions/cookies

'Funções: cookies | Próximo.js'
[10]: https://nextjs.org/blog/next-16 'Next.js 16'
[11]: https://github.com/vercel/next.js/security/advisories/GHSA-9g9p-9gw9-jx7f 'Negação de serviço no otimizador de imagem · Consultivo'
[12]: https://nextjs.org/docs/pages/guides/authentication 'Guias: Autenticação | Próximo.js'
