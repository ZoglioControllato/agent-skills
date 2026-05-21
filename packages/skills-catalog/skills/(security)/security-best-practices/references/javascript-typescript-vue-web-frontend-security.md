# Especificação de segurança da Web Vue.js (Vue 3.x, TypeScript/JavaScript, ferramentas comuns: Vite)

Este documento foi concebido como uma **especificação de segurança** que oferece suporte a:

1. **Geração de código seguro por padrão** para novo código Vue.
2. **Revisão de segurança/caça de vulnerabilidades** no código Vue existente (passivo “notificar problemas durante o trabalho” e ativo “verificar o repositório e relatar descobertas”).

Ele é intencionalmente escrito como um conjunto de **requisitos normativos** (“DEVE/DEVE/PODE”) mais **regras de auditoria** (como são os padrões ruins, como detectá-los e como corrigi-los/mitigá-los).

---

## 0) Segurança, limites e restrições antiabuso (DEVE SEGUIR)

- NÃO DEVE solicitar, gerar, registrar ou confirmar segredos (chaves de API, senhas, chaves privadas, cookies de sessão, tokens de autenticação).
- NÃO DEVE “consertar” a segurança desabilitando proteções (por exemplo, enfraquecendo o CSP, ativando a compilação insegura de modelos, usando `v-html` como atalho, ignorando a autenticação de backend ou “apenas armazene o token no localStorage”).
- DEVE fornecer **descobertas baseadas em evidências** durante as auditorias: citar caminhos de arquivos, trechos de código e valores de configuração que j

justificar a reivindicação.

- DEVE tratar a incerteza com honestidade: se existir uma proteção na borda (CDN, proxy reverso, WAF, cabeçalhos de servidor), relate-a como “não visível no repositório; verifique a configuração de tempo de execução/infra”.
- DEVE lembrar o modelo de confiança do frontend: **qualquer código enviado aos navegadores é legível e modificável pelo invasor**. Os segredos e a “aplicação da segurança” não podem depender apenas da lógica do frontend.

---

## 1) Modos de operação

### 1.1 Modo de geração (padrão)

Quando solicitado a escrever um novo código Vue ou modificar o código existente:

- DEVE seguir todos os requisitos **DEVE** nesta especificação.
- DEVE seguir todos os requisitos **DEVE**, a menos que o usuário diga explicitamente o contrário.
- DEVE preferir recursos de estrutura seguros por padrão e bibliotecas comprovadas em vez de código de segurança personalizado.
- DEVE evitar a introdução de novos coletores arriscados (compilação de modelos de tempo de execução, `v-html` / `innerHTML`, navegação de URL insegura, injeção dinâmica de script, etc.). ([Vue.js][1])

### 1.2 Modo de revisão passiva (sempre ativado durante a edição)

Ao trabalhar em qualquer lugar de um repositório Vue (mesmo que o usuário não tenha solicitado uma verificação de segurança):

- DEVE “notar” violações desta especificação no código tocado/próximo.
- DEVE mencionar os problemas à medida que surgem, com uma breve explicação + solução segura.

### 1.3 Modo de auditoria ativo (solicitação de verificação explícita)

Quando o usuário pede para “verificar”, “auditar” ou “caçar vulnerabilidades”:

- DEVE pesquisar sistematicamente a base de código em busca de violações desta especificação.
- DEVE apresentar os resultados num formato estruturado (ver §2.3).

Ordem de auditoria recomendada:

1. Construir/implantar pontos de entrada e configuração de hospedagem (Docker, CI, hospedagem estática, servidor SSR).
2. Exposição de segredos (uso de ambiente, `.env*`, chaves codificadas). ([vitejs][2])
3. Superfície XSS: modelos, `v-html` / `innerHTML`, injeção de URL/estilo, APIs DOM. ([Vue.js][1])
4. Tratamento de autenticação/sessão no navegador (armazenamento de tokens, solicitações credenciadas, integração CSRF). ([Vue.js][1])
5. Roteamento/navegação (redirecionamentos abertos, “return_to/next”, navegação externa insegura

íon). ([Vue.js][1]) 6. Scripts e conteúdo de terceiros (ativos CDN, análises, widgets, iframes). ([Vue.js][1]) 7. Cabeçalhos de segurança e expectativas de reforço do navegador (CSP, clickjacking). ([Vue.js][1]) 8. Preocupações específicas de SSR (serialização de estado, limites de modelo), quando aplicável. ([Vue.js][1])

---

## 2) Definições e orientações de revisão

### 2.1 Entrada não confiável (tratada como controlada pelo invasor, salvo prova em contrário)

Em um aplicativo Vue, a entrada não confiável inclui (não exaustiva):

- Qualquer coisa de APIs: `fetch`, `axios`, respostas GraphQL, webhooks, SDKs de terceiros.
- Dados controlados pelo roteador: `route.params`, `route.query`, `route.hash` e qualquer coisa derivada de `window.location`.
- Conteúdo persistente controlado pelo usuário: conteúdo baseado em banco de dados exibido na UI (comentários, perfis, conteúdo CMS).
- Armazenamento controlado pelo navegador: `localStorage`, `sessionStorage`, `IndexedDB`.
- Mensagens entre janelas: entradas `postMessage`.
- Qualquer coisa

at pode ser influenciado por um invasor por meio de destruição de DOM ou HTML injetado (especialmente se o Vue estiver montado em DOM não estéril). ([Vue.js][1])

### 2.2 Ação de mudança de estado (perspectiva frontend)

Uma ação muda de estado se puder:

- Criar/atualizar/excluir dados por meio de chamadas de API.
- Alterar o estado de autenticação/sessão (login, logout, token de atualização).
- Acionar operações privilegiadas (pagamentos, ações administrativas).
- Causar efeitos colaterais (envio de e-mails, acionamento de webhooks, alteração de configurações da conta).

### 2.3 Formato de descoberta de auditoria necessário

Para cada problema encontrado, produza:

- ID da regra:
- Gravidade: Crítica / Alta / Média / Baixa
- Localização: caminho do arquivo + componente/função + linha(s)
- Evidência: o trecho de código/configuração exato
- Impacto: o que pode dar errado, quem pode explorar
- Correção: mudança segura (prefira diferença mínima)
- Mitigação: defesa profunda se a solução imediata for difícil
- Notas falso-positivas: o que verificar em caso de incerteza

---

## 3) Linha de base segura: configuração mínima de produção (DEVE em produção)

Esta é a menor “linha de base de produção” que evita configurações incorretas comuns de Vue/front-end.

- DEVE enviar uma **compilação de produção** (não uma compilação de desenvolvimento ou servidor de desenvolvimento). ([Vue.js][3])
- NÃO DEVE enviar segredos em pacotes frontend; trate todas as variáveis ​​ambientais expostas ao cliente como públicas. ([vitejs][2])
- NÃO DEVE renderizar modelos não confiáveis ou permitir modelos Vue fornecidos pelo usuário (equivalente à execução arbitrária de JS). ([Vue.js][1])
- DEVE evitar injeção de HTML bruto (`v-html`, `innerHTML`), a menos que o conteúdo seja confiável ou fortemente protegido por sandbox. ([Vue.js][1])

- DEVE implantar cabeçalhos de segurança básicos (especialmente defesas CSP e clickjacking) na camada servidor/CDN. ([Série de folhas de dicas OWASP] [4])
- DEVE usar padrões de autenticação seguros (prefira cookies HttpOnly para tokens de sessão; coordene com backend em CSRF). ([Vue.js][1])

---

## 4) Regras (geração + auditoria)

Cada regra contém: práticas necessárias, padrões inseguros, dicas de detecção e correção.

### VUE-DEPLOY-001: Não execute servidores de desenvolvimento/visualização em produção

Gravidade: Alta

Obrigatório:

- NÃO DEVE implantar o servidor de desenvolvimento Vite/Vue (`vite`, `npm run dev`, HMR) como servidor de produção.
- NÃO DEVE usar `vite preview` como servidor de produção. ([vitejs][5])
- DEVE construir (`vite build`) e servir os ativos construídos usando um servidor/CDN estático de nível de produção ou um servidor SSR de produção se você estiver fazendo SSR. ([vitejs][6])

Padrões inseguros:

- Docker/Procfile/systemd executando `vite`, `npm run dev` ou `vite preview` como ponto de entrada de produção.
- Endpoints HMR expostos publicamente.

Dicas de detecção:

- Pesquisa: `vite`, `npm run dev`, `pnpm dev`, `yarn dev`, `vite preview`, `vue-cli-service serve`.
- Verifique Docker `CMD`, `ENTRYPOINT`, scripts de implantação de CI, configuração da plataforma.

Consertar:

- Construa artefatos com `vite build`.
- Sirva `dist/` com hospedagem reforçada (CDN/servidor estático) ou integre ao seu servidor back-end como ativos estáticos.

Notas:

- Usar servidores de desenvolvimento/visualização localmente é bom; sinalizar apenas se for o ponto de entrada da produção.

---

### VUE-DEPLOY-002: Use compilações de produção Vue e mantenha os devtools desligados na produção

Gravidade: Média (Alta se os devtools/ganchos de depuração de produção estiverem habilitados)

Obrigatório:

- Se estiver carregando o Vue do CDN/self-host sem um bundler, DEVE usar as compilações `.prod.js` na produção. ([Vue.js][3])
- DEVE garantir que os pacotes de produção não habilitem devtools Vue em compilações de produção e não DEVE habilitar intencionalmente sinalizadores de devtools de produção. ([Vue.js][7])

Padrões inseguros:

- A produção inclui artefatos de construção de desenvolvimento.
- Habilitar explicitamente ferramentas de desenvolvimento/ganchos de diagnóstico de produção.

Dicas de detecção:

- Pesquise em HTML por variantes `vue.global.js` / non-`.prod.js` ao usar compilações CDN.
- Pesquise a configuração de compilação para sinalizadores de recursos do Vue como `__VUE_PROD_DEVTOOLS__`. ([Vue.js][7])

Correção:

- Mude para artefatos de construção de produção e garanta que os sinalizadores de tempo de compilação estejam configurados para produção.

---

### VUE-SECRETS-001: Nunca envie segredos em código de front-end ou variáveis de ambiente

Gravidade: Alta (Crítica se credenciais reais forem expostas)

Obrigatório:

- DEVE tratar todo o código e configuração do frontend como público.
- NÃO DEVE incorporar segredos em:
  - código fonte
  - Arquivos `.env` comprometidos com o repositório
  - Variáveis `import.meta.env.*` incluídas no pacote

- DEVE assumir que qualquer env var que termina no pacote do cliente é legível pelo invasor. ([vitejs][2])

Padrões inseguros:

- `VITE_API_KEY=...` contendo um segredo verdadeiro (não apenas um identificador público).
- Chaves de API codificadas, tokens privados, credenciais de serviço, chaves de assinatura em JS/TS.

Dicas de detecção:

- Pesquisa: `VITE_`, `import.meta.env`, `.env`, `.env.production`, `.env.*.local`.
- Grep para `API_KEY`, `SECRET`, `TOKEN`, `PRIVATE_KEY`, `BEGIN`, `sk-`, `AKIA`, etc.

Correção:

- Mova segredos para funções de backend/edge.
- Use tokens de curta duração criados no backend para o navegador quando necessário.

Notas:

- Vite avisa especificamente que `.env.*.local` deve ser gitignorado e que os vars `VITE_*` acabam no pacote do cliente, portanto, eles não devem conter informações confidenciais. ([vitejs][2])

---

### VUE-SECRETS-002: Não amplie a exposição do ambiente Vite

Gravidade: Alta

Obrigatório:

- NÃO DEVE configurar o Vite para expor todas as variáveis ​​de ambiente ao cliente.
- DEVE manter `envPrefix` estrito e explícito.

Padrões inseguros:

- Definir `envPrefix` para valores excessivamente amplos (ou `''`) para “fazer env vars funcionar”.
- Scripts personalizados que injetam segredos do servidor em variáveis ​​globais em HTML no momento da construção.

Dicas de detecção:

- Verifique `vite.config.*` para `envPrefix`.
- Procure por `define: { 'process.env': ... }` ou injeção manual em `window.__CONFIG__`.

Correção:

- Mantenha segredos do lado do servidor.
- Expor apenas valores não sensíveis intencionalmente concebidos para serem públicos.

Notas:

- Os documentos de Vite explicam que apenas variáveis prefixadas são expostas e que variáveis expostas chegam ao pacote do cliente. ([vitejs][2])

---

### VUE-XSS-001: Prefere o escape padrão do Vue; evite injeção de HTML bruto

Gravidade: Alta

Obrigatório:

- DEVE contar com o escape automático do Vue para interpolação de texto e vinculação de atributos sempre que possível. ([Vue.js][1])
- NÃO DEVE renderizar HTML fornecido pelo usuário por meio de:
  - `v-html`
  - `innerHTML` em funções de renderização / JSX
  - APIs DOM diretas (`element.innerHTML`, `insertAdjacentHTML`)
    a menos que o HTML seja confiável ou totalmente higienizado e o risco seja explicitamente aceito. ([Vue.js][1])

Padrões inseguros:

- `<div v-html="userProvidedHtml"></div>`
- `h('div', { innerHTML: userProvidedHtml })`
- `<div innerHTML={userProvidedHtml}></div>`
- `el.innerHTML = não confiável`

Dicas de detecção:

- Pesquisa: `v-html`, `innerHTML`, `insertAdjacentHTML`, `DOMParser`, `document.write`.

Consertar:

- Renderizar conteúdo não confiável como texto (interpolação).
- Se a renderização de HTML for necessária (por exemplo, Markdown), limpe com um desinfetante de HTML bem conservado e aplique defesa profunda (CSP, tipos confiáveis). ([Vue.js][1])

Notas:

- Os documentos do Vue alertam explicitamente que o HTML fornecido pelo usuário nunca é “100% seguro”, a menos que seja em sandbox ou exposição estritamente pessoal. ([Vue.js][1])

---

### VUE-XSS-002: Nunca use modelos não confiáveis (modelo do lado do cliente/injeção de código)

Gravidade: Crítica

Obrigatório:

- NÃO DEVE usar conteúdo não confiável como modelo de componente Vue.
- DEVE tratar “o usuário pode escrever um modelo Vue” como “o usuário pode executar JavaScript arbitrário em seu aplicativo” e, potencialmente, também em contextos SSR. ([Vue.js][1])
- DEVE preferir a compilação somente em tempo de execução (modelos compilados em tempo de compilação) e evitar enviar o compilador de tempo de execução, a menos que você tenha uma necessidade comprovada.

Padrões inseguros:

- `createApp({ template: '<div>' + userProvidedString + '</div>' }).mount(...)`
- Armazenar templates no banco de dados e compilá-los/renderizá-los no navegador.
- Recursos Admin/CMS que permitem inserir a sintaxe do modelo Vue.

Dicas de detecção:

- Pesquisa: `template:` onde o valor não é uma string estática.
- Pesquisa: `@vue/compiler-dom`, `compile(`, seleção de compilação “runtime compiler”, compilação SFC dinâmica.
- Pesquise os recursos “editor de modelos”, “modelo personalizado”, “HTML de tema”.

Correção:

- Trate os modelos como código: mantenha-os controlados pelo desenvolvedor.
- Se for necessária a personalização do usuário final, use um formato seguro (subconjunto de Markdown restrito) renderizado por meio de um sanitizador ou isole em um iframe em área restrita.

---

### VUE-XSS-003: Não monte Vue em DOM que possa conter HTML renderizado em servidor fornecido pelo usuário

Gravidade: Média

Obrigatório:

- NÃO DEVE montar o Vue em nós que possam conter conteúdo renderizado pelo servidor e fornecido pelo usuário (porque o HTML controlado pelo invasor que é “seguro como HTML” pode se tornar inseguro como um modelo Vue). ([Vue.js][1])
- DEVE montar o Vue em um elemento raiz “estéril” e renderizar o DOM do aplicativo a partir de modelos/componentes controlados pelo Vue.

Padrões inseguros:

- O servidor renderiza o conteúdo do usuário em `#app`, então o Vue monta em `#app` e compila/interpreta esse DOM como um modelo.
- “Sprinkling Vue” em grandes páginas renderizadas pelo servidor que incluem conteúdo gerado pelo usuário.

Dicas de detecção:

- Verifique os modelos de servidor (por exemplo, modelos Rails/Django/Express) para HTML do usuário inserido dentro da raiz de montagem do Vue.
- Procure por `mount('#app')` onde `#app` inclui UGC renderizado pelo servidor.

Consertar:

- Mova o HTML renderizado pelo usuário para fora da raiz de montagem do Vue ou renderize-o de maneira segura (texto/HTML higienizado) a partir dos componentes do Vue.

---

### VUE-XSS-004: Impedir injeção de URL em ligações e navegações

Gravidade: Alta

Obrigatório:

- DEVE validar/limpar qualquer URL influenciada pelo usuário antes de vincular aos coletores de navegação (`href`, `src`, `action`, `window.location`, `window.open`, navegação do roteador para externo).
- DEVE impedir especificamente a execução de URL `javascript:` em ligações como `<a :href="userProvidedUrl">`. ([Vue.js][1])
- DEVE validar o protocolo e o destino (lista de permissões `https:` e hosts esperados; permitir `mailto:`/`tel:` somente se pretendido).

Padrões inseguros:

- `<iframe :src="userProvidedUrl">`
- `janela.localização = rota.query.next`
- `window.open(userProvidedUrl)`

Dicas de detecção:

- Pesquisa: `:href=`, `:src=`, `window.location`, `location.href`, `window.open`, `router.push(` com entrada não confiável.
- Procure os parâmetros de consulta `next`, `return_to`, `redirect`.

Correção:

- Prefira a navegação interna através de nomes de rotas/caminhos que você controla.
- Para URLs externos: analise com `new URL(...)`, protocolo/host da lista de permissões, rejeite `javascript:` e outros esquemas perigosos.
- Sanitize e valide no back-end antes de armazenar URLs de usuários (os documentos do Vue recomendam explicitamente a higienização de back-end). ([Vue.js][1])

---

### VUE-XSS-005: Impedir injeção de estilo/CSS e correção de UI

Gravidade: Baixa

Obrigatório:

- NÃO DEVE vincular amplamente strings CSS controladas pelo invasor (por exemplo, `:style="userProvidedStyles"`).
- DEVE usar a sintaxe de objeto de estilo do Vue e permitir apenas propriedades específicas e seguras se a personalização do usuário for necessária. ([Vue.js][1])
- DEVE isolar os recursos “o usuário pode controlar o layout/CSS” dentro dos iframes em sandbox.

Padrões inseguros:

- `:style="userProvidedStyles"` onde os estilos são controlados pelo invasor.
- Renderizar conteúdo `<style>` fornecido pelo usuário (mesmo que o Vue bloqueie alguns padrões, não tente contornar isso).

Dicas de detecção:

- Pesquisa: `:style="` vinculado a variáveis não constantes originadas da API/conteúdo do usuário.
- Pesquise “CSS personalizado”, “editor de tema”, “CSS de perfil”.

Correção:

- Propriedades e valores da lista de permissões; evite strings de estilo bruto.
- Use iframes em sandbox para personalização avançada do usuário.

---

### VUE-XSS-006: Nunca vincule JavaScript fornecido pelo usuário a atributos do manipulador de eventos

Gravidade: Crítica

Obrigatório:

- NÃO DEVE vincular strings fornecidas pelo invasor a atributos do manipulador de eventos (por exemplo, `onclick`, `onfocus`, etc.).
- DEVE tratar o “JS fornecido pelo usuário” como inseguro, a menos que a exposição em sandbox e somente para si mesmo seja garantida. ([Vue.js][1])

Padrões inseguros:

- `<div :onclick="userProvidedString">`
- `<a :onmouseenter="userProvidedString">`

Dicas de detecção:

- Pesquisa: `:on` seguido pelos nomes dos atributos do evento (`:onclick`, `:onload`, etc.).
- Procure por padrões `setAttribute('on`.

Correção:

- Use ouvintes de eventos reais com manipuladores controlados pelo desenvolvedor.
- Se você realmente precisa de scripts de usuário, isole-os (iframe em área restrita + limites estritos).

---

### VUE-ROUTER-001: Não trate os protetores de rota do lado do cliente como autorização

Gravidade: Alta

Obrigatório:

- NÃO DEVE confiar nos protetores do Vue Router, na ocultação da interface do usuário ou nas verificações do lado do cliente para impor a autorização.
- DEVE impor autorização no back-end para cada ação privilegiada e resposta de dados confidenciais. ([Série de folhas de dicas OWASP] [8])

Padrões inseguros:

- “A rota Admin está protegida porque `beforeEach` verifica `user.isAdmin`.”
- Endpoints de API sensíveis que assumem que “o frontend não chamará isso a menos que seja permitido”.

Dicas de detecção:

- Pesquise `router.beforeEach` por controle baseado em função e veja se o back-end também está sendo aplicado.
- Procure padrões de “segurança por rota meta” (`meta.requiresAdmin`) sem corroboração do servidor.

Correção:

- Mantenha os protetores de rota apenas como UX (reduza o acesso acidental), mas aplique verificações reais no lado do servidor.

---

### VUE-ROUTER-002: Evita redirecionamentos abertos e manipulação insegura de “return_to/next”

Gravidade: Baixa

Obrigatório:

- DEVE validar destinos de redirecionamento derivados de entradas não confiáveis ​​(`next`, `return_to`, `redirect`).
- DEVE permitir apenas caminhos relativos ao mesmo site ou uma lista de permissões explícita de destinos.
- NÃO DEVE permitir protos que não sejam `http` / `https` (como `javascript:`)

Padrões inseguros:

- `router.push (route.query.next como string)`
- `window.location.href = rota.query.redirect`

Dicas de detecção:

- Procure por `route.query.next`, `route.query.redirect`, `return_to`, `continue`, `callback`.
- Rastreie o valor nos coletores de navegação do roteador/janela.

Correção:

- Permitir apenas caminhos relativos começando com `/` (e rejeitar `//host`, `javascript:`, etc.).
- Prefira redirecionar para rotas nomeadas que você controla.

Notas:

- Até mesmo os documentos do Vue observam que URLs higienizados ainda podem não garantir destinos seguros. ([Vue.js][1])

---

### VUE-AUTH-001: O armazenamento de token deve assumir que o XSS é possível

Gravidade: Baixa

Obrigatório:

- DEVE assumir que qualquer token acessível ao JavaScript pode ser roubado via XSS.
- DEVE preferir cookies HttpOnly (definidos pelo back-end) para tokens de sessão, combinados com proteções CSRF quando relevante. ([Vue.js][1])
- DEVE evitar armazenar tokens de longa duração (especialmente tokens de atualização) em `localStorage`/`sessionStorage`.

Padrões inseguros:

- `localStorage.setItem('token', ...)` para tokens ao portador de longa duração.
- Armazenar tokens de atualização em armazenamento acessível por JS.

Dicas de detecção:

- Pesquisa: `localStorage`, `sessionStorage`, `indexedDB`, `persist`, `pinia-plugin-persistedstate`.
- Identifique se os valores armazenados são material de autenticação/sessão.

Consertar:

- Prefira sessões gerenciadas por backend por meio de cookies HttpOnly.
- Se os tokens ao portador forem inevitáveis, mantenha-os de curta duração, armazenados na memória e gire-os com frequência; combine com fortes mitigações de XSS (CSP, tipos confiáveis, sanitização rigorosa). ([Série de folhas de dicas OWASP] [4])

---

### VUE-CSRF-001: Coordene com o back-end para CSRF ao usar cookies

Gravidade: Alta (para solicitações de alteração de estado autenticadas por cookie)

NOTA: Se o aplicativo não estiver usando autenticação baseada em cookies (por exemplo, se passar um cabeçalho de autorização), o CSRF não será uma preocupação

Obrigatório:

- Se as solicitações de API incluírem cookies (`credenciais: 'include'` / `withCredentials: true`) e os cookies autenticarem o usuário, DEVE incluir proteções CSRF coordenadas com o back-end (padrões de token/cabeçalho, verificações de origem, cookies SameSite como defesa em profundidade). ([Vue.js][1])
- NÃO DEVE “resolver erros de CORS/CSRF” desabilitando proteções no backend ou usando `mode: 'no-cors'` no frontend.

Padrões inseguros:

- `fetch(url, { credenciais: 'include', método: 'POST', corpo: ... })` sem uso de token/cabeçalho CSRF em qualquer lugar.
- Habilitar solicitações credenciadas de origem cruzada sem listas de permissões de origem estritas (backend-side).

Dicas de detecção:

- Pesquisa: `credenciais: 'include'`, `withCredentials`, `xsrf`, `csrf`, `X-CSRF-Token`, `X-XSRF-TOKEN`.
- Veja os módulos wrapper da API para cabeçalhos e configurações de cookies.

Consertar:

- Implementar tokens CSRF emitidos no backend e exigi-los em solicitações de mudança de estado.
- Mantenha os cookies `SameSite=Lax/Strict` onde for compatível e verifique a origem/referente quando apropriado (orientado pelo backend). ([Série de folhas de dicas OWASP] [9])

Notas:

- Os documentos do Vue dizem explicitamente que o CSRF é endereçado principalmente no backend, mas recomenda a coordenação no envio do token CSRF. ([Vue.js][1])

---

### VUE-HTTP-001: Não coloque segredos em URLs; evite o vazamento de dados confidenciais em navegação/logs

Gravidade: Média

Obrigatório:

- NÃO DEVE colocar tokens/segredos em strings de consulta ou fragmentos (eles vazam através de logs, referenciadores, histórico do navegador).
- DEVE evitar registrar valores confidenciais no console em produção.

Padrões inseguros:

- `/?token=...`, `/#access_token=...` usado além da transferência OAuth de curta duração.
- `console.log(userSession)` que inclui tokens/PII.

Dicas de detecção:

- Procure por `token=` na análise do roteador, manipuladores de retorno de chamada de autenticação e logs analíticos.
- Procure por `console.log(` em torno do código de autenticação.

Correção:

- Use cabeçalhos de autorização ou cookies HttpOnly.
- Registros de limpeza; guarde os logs de depuração por trás das verificações somente de desenvolvimento.

---

### VUE-HEADERS-001: Requer cabeçalhos de segurança na camada de implantação

Gravidade: Média

Obrigatório:

- DEVE implantar um CSP (`Content-Security-Policy`) adequado para seu aplicativo Vue.
- DEVE implantar defesas contra clickjacking (CSP `frame-ancestors` e/ou `X-Frame-Options`), a menos que a incorporação intencional seja necessária.
- DEVE implantar `X-Content-Type-Options: nosniff`, além de outros cabeçalhos conforme apropriado (Referrer-Policy, Permissions-Policy). ([Série de folhas de dicas OWASP] [4])

Padrões inseguros:

- Nenhuma evidência de cabeçalhos na configuração do servidor/CDN para um aplicativo com UGC ou renderização HTML avançada.
- CSP inclui `unsafe-inline`/`unsafe-eval` sem forte justificativa.

Dicas de detecção:

- Procure a configuração de hospedagem: nginx, configuração de cabeçalhos Netlify/Vercel, regras CloudFront/Cloudflare.
- Se ausente no repo, sinalizar como “verificar na borda”.

Correção:

- Defina cabeçalhos na borda ou no servidor. Comece com um CSP conservador e aperte.

---

### VUE-CSP-001: Use tipos confiáveis e proteção DOM XSS quando possível

Gravidade: Baixa

Obrigatório:

- Para aplicativos com superfície de injeção de DOM significativa (rich text, plug-ins, `v-html`), DEVE considerar a ativação de tipos confiáveis para reduzir o risco de DOM XSS. ([web.dev][10])
- DEVE tratar os Tipos Confiáveis como uma defesa profunda, e não como um substituto para a higienização.

Padrões inseguros:

- Uso frequente de `innerHTML`/`v-html` sem sanitização ou proteção CSP.

Dicas de detecção:

- Pesquisa: `v-html`, `innerHTML`, `insertAdjacentHTML`.
- Verifique o CSP para uso de `require-trusted-types-for 'script'` (se os cabeçalhos estiverem no repositório).

Correção:

- Reduza/centralize a injeção de HTML, limpe as entradas e adicione políticas de tipos confiáveis quando apropriado.

---

### VUE-THIRDPARTY-001: Evite injeção dinâmica de scripts de terceiros; prefira carregamento estático e controlado

Gravidade: Baixa

Obrigatório:

- NÃO DEVE injetar `<script src="...">` onde a URL é controlada pelo usuário.
- DEVE tratar widgets/análises de terceiros como risco da cadeia de suprimentos; carregue apenas de fontes verificadas e fixadas.

Padrões inseguros:

- `const s=document.createElement('script'); s.src = userProvidedUrl; ...`
- “Mercado de plug-ins” que carrega scripts remotos arbitrários.

Dicas de detecção:

- Pesquisa: `createElement('script')`, `.src =`, `appendChild(script)`.
- Procure por “loadExternalScript”, “injectScript”, “cdnUrl”.

Correção:

- Agrupar dependências ou permitir origens estritas e impor integridade (consulte a regra SRI).
- Considere iframes em sandbox para interfaces de usuário de terceiros não confiáveis.

---

### VUE-SRI-001: Use integridade de sub-recursos para scripts/estilos hospedados em CDN

Gravidade: Baixa

Obrigatório:

- Se carregar scripts/estilos de um CDN, DEVE usar Subresource Integrity (atributo `integrity`) com configuração `crossorigin` apropriada. ([Documentos da Web MDN] [11])
- DEVE preferir auto-hospedagem ou agrupamento em vez de dependências CDN em tempo de execução para código crítico de segurança.

Padrões inseguros:

- `<script src="https://cdn.example/...">` sem `integridade`.
- URLs de script remoto que podem alterar o conteúdo sem fixação de versão.

Dicas de detecção:

- Pesquise `index.html` e modelos de servidor por tags de script/estilo `https://`.
- Verifique se há `integridade=`.

Correção:

- Adicione hashes SRI (e versões pin) ou agrupe ativos com sua construção.

---

### VUE-SUPPLY-001: Dependência e higiene de patches são obrigatórias

Gravidade: Baixa

Obrigatório:

- DEVE manter o Vue e as bibliotecas oficiais atualizadas; Vue recomenda explicitamente o uso das versões mais recentes para permanecer o mais seguro possível. ([Vue.js][1])
- DEVE responder prontamente aos avisos de segurança.
- DEVE fixar dependências e manter os arquivos de bloqueio confirmados (para reduzir desvios nos artefatos de produção).

Padrões inseguros:

- Versões principais desatualizadas com CVEs conhecidos.
- Nenhum arquivo de bloqueio no repositório; amplas faixas de semver para dependências críticas.
- Ignorando avisos para pacotes de modelo/renderização/compilador.

Dicas de detecção:

- Inspecione `package.json`, lockfiles, comandos de instalação de CI.
- Procure por `auditoria npm` desativado, scripts “ignorar vulnerabilidades”.

Correção:

- Atualize dependências e adicione testes de regressão em torno do comportamento impactado.
- Adicionar verificação de dependência no CI.

---

### VUE-SSR-001: SSR adiciona limites de confiança adicionais; tratar a injeção de estado como sensível a XSS

Gravidade: Média

Obrigatório:

- Ao usar SSR, DEVE tratar qualquer coisa injetada no documento HTML (estado inicial, dados serializados, scripts embutidos) como sensível a XSS.
- DEVE manter a regra “apenas modelos confiáveis” ainda mais rígida, porque modelos inseguros podem levar à execução no lado do servidor durante a renderização. ([Vue.js][1])
- DEVE seguir a documentação do Vue SSR e as melhores práticas para segurança SSR. ([Vue.js][1])

Padrões inseguros:

- Concatenando strings não confiáveis ​​em modelos SSR.
- Injetando JSON em blocos `<script>` sem controles robustos de escape/serialização.

Dicas de detecção:

- Pesquise o código do servidor para `__INITIAL_STATE__`, `window.__*STATE__`, concatenação de modelos e pipelines de renderização SSR.
- Rastreie dados não confiáveis ​​nesses coletores.

Correção:

- Use padrões de serialização seguros recomendados pela sua pilha SSR.
- Evite renderizar HTML não confiável; higienizar ou isolar.

---

## 5) Heurísticas práticas de varredura (como “caçar”)

Ao digitalizar ativamente, use estes padrões de sinal alto:

- Servidores de desenvolvimento/visualização em produção:
  - `npm run dev`, `vite`, `vite preview`, `vue-cli-service serve` ([vitejs][5])

- Exposição de segredos:
  - `.env`, `.env.production`, `.env.*.local`, `VITE_`, `import.meta.env`, `API_KEY` / `SECRET` codificado ([vitejs][2])

- Pisos XSS:
  - `v-html`, `innerHTML`, `insertAdjacentHTML`, `DOMParser`, `document.write` ([Vue.js][1])

- Injeção de modelo do lado do cliente:
  - `template:` concatenação, `compile(`, uso do compilador em tempo de execução, montagem em DOM não estéril ([Vue.js][1])

- Injeção de URL/redirecionamentos abertos:
  - `:href="..."` / `:src="..."` dos dados do usuário
  - `javascript:` ocorrências
  - `route.query.next` / `redirect` / `return_to` fluindo para `router.push` ou `window.location` ([Vue.js][1])

- Injeção de estilo:
  - `:style="userProvidedStyles"` ou CSS de tema orientado ao usuário ([Vue.js][1])

- Armazenamento de tokens:
  - `localStorage.setItem('token'...)`, armazenamentos de autenticação persistentes, tokens de atualização em armazenamento acessível por JS

- Sinais de alerta de integração CSRF:
  - `credentials: 'include'` / `withCredentials: true` sem qualquer manipulação de cabeçalho/token CSRF ([Vue.js][1])

- Scripts de terceiros:
  - injeção dinâmica de script (`createElement('script')`), scripts CDN sem SRI ([MDN Web Docs][11])

- Segurança de links externos:
  - `target="_blank"` sem `rel="noopener"`/`noreferrer` (ainda recomendado para legado e explicitação) ([MDN Web Docs][12])

Sempre tente confirmar:

- origem dos dados (não confiável versus confiável)
- tipo de coletor (inserção de HTML/DOM, compilação de modelo, navegação de URL, injeção de estilo, injeção de script)
- controles de proteção presentes (higienização, listas de permissões, CSP/Tipos confiáveis, validação de back-end)

---

## 6) Fontes (acessado em 27/01/2026)

Documentação primária do Vue:

- Documentos Vue: Segurança — `https://vuejs.org/guide/best-practices/security` ([Vue.js][1])
- Vue Docs: Template Syntax (aviso de segurança sobre modelos in-DOM) — `https://vuejs.org/guide/essentials/template-syntax` ([Vue.js][13])
- Documentos Vue: implantação de produção — `https://vuejs.org/guide/best-practices/production-deployment` ([Vue.js][3])
- Documentos Vue: Sinalizadores de recursos - `https://link.vuejs.org/feature-flags` ([Vue.js][7])

Documentação do Vite (ferramentas Vue comuns):

- Documentos Vite: Variáveis e modos de ambiente (exposição VITE\_\* + notas de segurança) — `https://vite.dev/guide/env-and-mode` ([vitejs][2])
- Vite Docs: CLI (`vite preview` não projetado para produção) — `https://vite.dev/guide/cli` ([vitejs][5])
- Vite Docs: Opções de servidor (`server.host` pode escutar em endereços públicos) — `https://vite.dev/config/server-options` ([vitejs][14])

Referências de proteção do OWASP e da plataforma web:

- Série de folhas de dicas OWASP: Prevenção XSS - `https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html` ([Vue.js][1])
- Série de folhas de dicas OWASP: Prevenção de CSRF - `https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html` ([Série de folhas de dicas OWASP] [9])
- Série de folhas de dicas OWASP: Autorização - `https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat

\_Sheet.html` ([Série de folhas de dicas OWASP] [8])

- Série de folhas de dicas OWASP: Cabeçalhos HTTP - `https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Headers_Cheat_Sheet.html` ([Série de folhas de dicas OWASP] [4])
- Folha de dicas de segurança HTML5 (referenciada por Vue) — `https://html5sec.org/` ([Vue.js][1])

Referências de navegador/plataforma:

- MDN: `rel="noopener"` — `https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/rel/noopener` ([MDN Web Docs][12])
- MDN: Integridade de sub-recursos — `https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity` ([MDN Web Docs][11])
- web.dev: Tipos confiáveis — `https://web.dev/trusted-types/` ([web.dev][10])

[1]: https://vuejs.org/guide/best-practices/security 'https://vuejs.org/guide/best-practices/security'
[2]: https://vite.dev/guide/env-and-mode 'https://vite.dev/guide/env-and-mode'
[3]: https://vuejs.org/guide/best-practices/production-deployment 'https://vuejs.org/guide/best-practices/production-deployment'

[4]: https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Headers_Cheat_Sheet.html 'https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Head

ers_Cheat_Sheet.html'
[5]: https://vite.dev/guide/cli 'https://vite.dev/guide/cli'
[6]: https://vite.dev/guide/build 'https://vite.dev/guide/build'
[7]: https://vuejs.org/guide/best-practices/production-deployment 'Implantação de produção'
[8]: https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html 'https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html'
[9]: https://cheatsheetseries.owasp.org/cheatshee

ts/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html 'https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html'
[10]: https://web.dev/articles/trusted-types 'https://web.dev/articles/trusted-types'
[11]: https://developer.mozilla.org/en-US/docs/Web/Security/Defenses/Subresource_Integrity 'Integridade de sub-recursos - Segurança - MDN Web Docs'
[12]: https://developer.mozilla.org/en-US/docs/Web/HTML/Refer

ence/Attributes/rel/noopener 'https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/rel/noopener'
[13]: https://vuejs.org/guide/essentials/template-syntax 'Sintaxe do modelo | Vue.js'
[14]: https://vite.dev/config/server-options 'https://vite.dev/config/server-options'
