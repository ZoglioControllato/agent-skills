# React (JavaScript/TypeScript) Especificação de segurança da Web (React 19.x, TypeScript 5.x)

Este documento foi concebido como uma **especificação de segurança** que oferece suporte a:

1. **Geração de código seguro por padrão** para novo código React.
2. **Revisão de segurança/caça de vulnerabilidades** no código React existente (passivo “notificar problemas durante o trabalho” e ativo “verificar o repositório e relatar descobertas”).

Ele é intencionalmente escrito como um conjunto de **requisitos normativos** (“DEVE/DEVE/PODE”) mais **regras de auditoria** (como são os padrões ruins, como detectá-los e como corrigi-los/mitigá-los).

---

## 0) Segurança, limites e restrições antiabuso (DEVE SEGUIR)

- NÃO DEVE solicitar, gerar, registrar ou confirmar segredos (chaves de API, segredos do cliente OAuth, chaves privadas, cookies de sessão, JWTs, chaves de assinatura).
  - Nota de frontend: qualquer coisa enviada ao navegador é observável por usuários finais e invasores (view-source, devtools, proxies); nunca trate o código do cliente ou “env vars no pacote” como secreto. ([create-react-app.dev][1])

- NÃO DEVE “consertar” a segurança desabilitando proteções (por exemplo, desligando o CSP para “fazê-lo funcionar”, adicionando `unsafe-inline`/`unsafe-eval` sem um plano documentado e restrito, desabilitando proteções CSRF ao usar cookies, ampliando CORS, ignorando a higienização ou ignorando “temporariamente” esse navio). ([Série de folhas de dicas OWASP] [2])
- DEVE fornecer **descobertas baseadas em evidências** durante as auditorias: citar caminhos de arquivos, trechos de código e valores de configuração que justifiquem

a reivindicação.

- DEVE tratar a incerteza honestamente: se uma proteção puder existir na infra (CDN/WAF/proxy reverso), relate-a como “não visível no código do aplicativo; verifique através de cabeçalhos de tempo de execução/configuração de borda”.
- DEVE assumir que quaisquer dados que cruzem um limite de confiança (URL, armazenamento, rede, postMessage, scripts de terceiros) podem ser influenciados pelo invasor, salvo prova em contrário (ver §2.1).

---

## 1) Modos de operação

### 1.1 Modo de geração (padrão)

Quando solicitado a escrever um novo código React ou modificar o código existente:

- DEVE seguir todos os requisitos **DEVE** nesta especificação.
- DEVE seguir todos os requisitos **DEVE**, a menos que o usuário diga explicitamente o contrário.
- DEVE preferir APIs seguras por padrão e bibliotecas comprovadas em vez de código de segurança personalizado.
- DEVE evitar a introdução de novos coletores arriscados (inserção de HTML bruto, coletores DOM diretos como `innerHTML`, execução dinâmica de código, redirecionamentos/navegação não confiáveis, injeção de script de terceiros, armazenamento de token inseguro, etc.). ([MDN Web Fazer

cs][3])

### 1.2 Modo de revisão passiva (sempre ativado durante a edição)

Ao trabalhar em qualquer lugar em um repositório React (mesmo que o usuário não tenha solicitado uma verificação de segurança):

- DEVE “notar” violações desta especificação no código tocado/próximo.
- DEVE mencionar os problemas à medida que surgem, com uma breve explicação + solução segura.

### 1.3 Modo de auditoria ativo (solicitação de verificação explícita)

Quando o usuário pede para “verificar”, “auditar” ou “caçar vulnerabilidades”:

- DEVE pesquisar sistematicamente a base de código em busca de violações desta especificação.
- DEVE apresentar os resultados num formato estruturado (ver §2.3).

Ordem de auditoria recomendada:

1. Pontos de entrada de aplicativos, ferramentas de construção (Vite/Webpack/CRA/Next), configurações de implantação, configuração de CDN/hospedagem estática.
2. Segredos e exposição de configuração (env vars, injeção de configuração de tempo de execução, mapas de origem).
3. Renderização de dados não confiáveis ​​(XSS/DOM XSS), especialmente `dangerouslySetInnerHTML`, renderizadores markdown/HTML, atributos de URL.
4. Uso direto de DOM e execução perigosa de JS (`innerHTML`, `eval`, `new Function`, `document.write`, etc.).
5. Autenticação e padrão de sessão

erns (armazenamento de tokens, cookies, interações CSRF, fluxos OAuth). 6. Camada de rede (axios/fetch wrappers, URLs de base dinâmica, solicitações credenciadas, riscos de exfilagem de dados). 7. Navegação e tratamento de redirecionamento (redirecionamentos abertos, `window.location`, `target=_blank`, `window.open`). 8. Scripts/tags/análises e controles de integridade de terceiros (CSP, SRI). 9. Comportamento do Service Worker/PWA (HTTPS, regras de cache, estratégia de atualização). 10. Postura dos cabeçalhos de segurança (CSP, cli

ckjacking, nosniff, política de referência) no aplicativo ou na borda. ([Série de folhas de dicas OWASP] [2])

---

## 2) Definições e orientações de revisão

### 2.1 Entrada não confiável (tratada como controlada pelo invasor, salvo prova em contrário)

Os exemplos incluem:

- Dados derivados de URL: `window.location`, parâmetros de consulta, fragmentos de hash, parâmetros de rota.
- Quaisquer dados do armazenamento do navegador: `localStorage`, `sessionStorage`, `IndexedDB` (incluindo dados gravados anteriormente pelo aplicativo – porque XSS ou extensões podem adulterá-los). ([Série de folhas de dicas OWASP] [4])
- Quaisquer dados de mensagens entre janelas: cargas `window.postMessage`. ([Série de folhas de dicas OWASP] [4])
- Quaisquer dados de APIs remotas, webhooks com proxy para o cliente,

Respostas GraphQL, conteúdo CMS, serviços de sinalização de recursos.

- Qualquer conteúdo de usuário persistente (perfis, comentários, rich text, markdown) renderizado na UI.
- Quaisquer dados produzidos por scripts ou gerenciadores de tags de terceiros (tratados como não confiáveis, a menos que sejam fortemente controlados). ([Série de folhas de dicas OWASP] [5])

### 2.2 Solicitação de mudança de estado (perspectiva frontend)

Uma solicitação muda de estado se puder criar/atualizar/excluir dados, alterar o estado de autenticação/sessão, acionar efeitos colaterais (compra, envio de e-mail, webhook) ou iniciar ações privilegiadas.

Nota específica do front-end:

- As mudanças de estado são frequentemente desencadeadas por chamadas `fetch/axios` ou envios de formulários. Se a autenticação for baseada em cookies, essas chamadas podem ser relevantes para CSRF (§4 REACT-CSRF-001). ([Série de folhas de dicas OWASP] [6])

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

Esta é a menor “linha de base de produção” que evita configurações incorretas comuns do front-end do React.

### 3.1 Higiene da construção e configuração da produção (OBRIGATÓRIA)

- DEVE enviar uma compilação de produção (minificada, sem sobreposições/ferramentas somente para desenvolvedores, sinalizadores de modo corretos).
- DEVE garantir que a configuração em tempo de construção não incorpore segredos no JS/HTML/CSS enviado. As “variáveis ​​de ambiente” em tempo de construção não são secretas; tratá-los como públicos. ([create-react-app.dev][1])
- DEVE tratar os mapas de origem como artefatos operacionais sensíveis:
  - Não os publique publicamente ou publique-os apenas onde pretendido (por exemplo, atrás de autorização ou para um

provedor de relatórios de erros), porque podem revelar a estrutura do código e URLs internos.

### 3.2 Proteções impostas pelo navegador (DEVE, mas é uma expectativa básica para aplicativos modernos)

- DEVE implantar um CSP como defesa profunda contra XSS e mantê-lo compatível com sua construção React (evite `unsafe-inline` e `unsafe-eval` a menos que seja estritamente necessário e documentado). ([Série de folhas de dicas OWASP] [2])
- DEVE usar Subresource Integrity (SRI) para qualquer script/estilo de terceiros carregado de um CDN (ou auto-host). ([Documentos da Web MDN] [7])
- DEVE ativar defesas contra clickjacking via `frame-ancestors` (CSP) e/ou `X-Frame-Options`, a menos que

a incorporação é um requisito explícito do produto. ([Documentos da Web MDN] [8])

### 3.3 Linha de base dos recursos de alto risco (OBRIGATÓRIO se usado)

- Se estiver renderizando qualquer HTML/markdown/rich text fornecido pelo usuário:
  - DEVE higienizar antes da inserção e evitar coletores de DOM brutos. ([Série de folhas de dicas OWASP] [9])

- Se estiver usando service workers/PWA:
  - DEVE servir por HTTPS e implementar uma estratégia segura de cache/atualização (service workers são poderosos proxies de solicitação/resposta). ([Documentos da Web MDN] [10])

---

## 4) Regras (geração + auditoria)

Cada regra contém: práticas necessárias, padrões inseguros, dicas de detecção e correção.

### REACT-CONFIG-001: Nunca incorpore segredos no pacote do cliente (env vars são públicos)

Gravidade: Crítica (se segredos forem expostos)

Obrigatório:

- NÃO DEVE colocar segredos no código React, em ativos `públicos/` ou em variáveis ​​de ambiente de tempo de construção destinadas ao consumo do cliente.
- DEVE assumir que qualquer valor disponível para o aplicativo React em tempo de execução pode ser extraído por um invasor.

Padrões inseguros:

- Usando variáveis de ambiente em tempo de construção para segredos:
  - `process.env.REACT_APP_*` contendo chaves privadas ou credenciais.
  - `import.meta.env.VITE_*` contendo segredos.

- Segredos codificados em JS/TS, `.env` confirmados ou segredos em `public/config.json` servidos a todos os usuários.

Dicas de detecção:

- Procure por:
  - `REACT_APP_`, `VITE_`, `NEXT_PUBLIC_`, `process.env.`, `import.meta.env.`
  - `apiKey`, `secreto`, `token`, `privado`, `senha`, `client_secret`

- Inspecione `public/` para JSON de configuração de tempo de execução.

Consertar:

- Mova segredos do lado do servidor (API, BFF, função sem servidor).
- Use um back-end para criar tokens com escopo de curta duração se o navegador precisar chamar APIs de terceiros.

Notas:

- O CRA avisa explicitamente para não armazenar segredos e notas que os env vars estão incorporados na compilação e visíveis para qualquer pessoa que inspecione os arquivos. ([create-react-app.dev][1])
- Vite observa explicitamente que as variáveis expostas ao código do cliente acabam no pacote do cliente e não devem conter informações confidenciais. ([vitejs][11])

---

### REACT-XSS-001: Não use `dangerouslySetInnerHTML` com conteúdo não confiável (higienize ou evite)

Gravidade: Alta (somente se você puder provar que o HTML controlado pelo invasor o alcança)

Obrigatório:

- DEVE evitar `dangerouslySetInnerHTML` a menos que seja absolutamente necessário.
- Se for necessário usar:
  - DEVE higienizar HTML não confiável com um higienizador comprovado (por exemplo, DOMPurify) e uma configuração orientada à lista de permissões.
  - DEVE manter a lógica de higienização centralizada e fortemente revisada.
  - DEVE adicionar um CSP e considerar tipos confiáveis ​​(ver REACT-TT-001).

Padrões inseguros:

- `<div perigosamenteSetInnerHTML={{ __html: userHtml }} />` onde `userHtml` é de API/URL/storage.
- “Sanitização” feita com expressões regulares, remoção ad hoc ou listas de permissões incompletas.

Dicas de detecção:

- Grep: `dangerouslySetInnerHTML`, `__html:`
- Rastrear a origem da string HTML (API/CMS/URL/localStorage).

Consertar:

- Substitua por renderização segura:
  - Renderizar dados estruturados como elementos/componentes React em vez de strings HTML.
  - Se for necessário rich text, higienize com DOMPurify (ou equivalente) e renderize a saída higienizada.

- Adicionar CSP; remova pias perigosas sempre que possível.

Notas:

- React avisa explicitamente que `dangerouslySetInnerHTML` é perigoso e pode introduzir XSS se for mal utilizado. ([Reagir][12])
- OWASP chama explicitamente o `dangerouslySetInnerHTML` do React sem higienização como uma armadilha comum de “escape hatch”. ([Série de folhas de dicas OWASP] [9])
- DOMPurify se descreve como um higienizador XSS para HTML/SVG/MathML. ([GitHub][13])

---

### REACT-XSS-002: Confie no comportamento de escape por padrão do React; não ignore isso

Gravidade: Alta (quando ignorado)

Obrigatório:

- DEVE renderizar strings não confiáveis por meio de interpolação JSX normal (`{value}`) e props React, que são escapados por padrão.
- NÃO DEVE construir strings HTML a partir de dados não confiáveis ​​e depois injetá-los no DOM por qualquer meio.
- DEVE tratar qualquer “saída de emergência” como de alto risco e exigir revisão.

Padrões inseguros:

- Convertendo texto não confiável em HTML e injetando-o:
  - `element.innerHTML = userValue`
  - `document.write(userValue)`
  - `insertAdjacentHTML(..., userValue)`

Dicas de detecção:

- Grep para coletores DOM: `innerHTML`, `outerHTML`, `insertAdjacentHTML`, `document.write`, `DOMParser`, `createContextualFragment`.

Consertar:

- Renderize o conteúdo do texto através do React (JSX) para que ele seja escapado.
- Se você realmente precisa de HTML, higienize e aplique REACT-XSS-001 + REACT-TT-001.

Notas:

- A documentação do React (JSX) afirma que o React DOM escapa dos valores incorporados no JSX antes da renderização para ajudar a prevenir ataques de injeção. ([Reagir][14])

---

### REACT-DOM-001: Evite coletores de injeção DOM XSS no código React (use alternativas seguras)

Gravidade: Alta

Obrigatório:

- DEVE evitar coletores de injeção direta de DOM, mesmo fora da renderização do React, a menos que seja fortemente controlado.
- Se um coletor DOM for necessário:
  - DEVE garantir que as entradas sejam confiáveis/validadas/higienizadas.
  - DEVE impor tipos confiáveis ​​(REACT-TT-001).

Padrões inseguros:

- `someEl.innerHTML = não confiável`
- `document.write(não confiável)`
- `new DOMParser().parseFromString(untrusted, 'text/html')` seguido de inserção

Dicas de detecção:

- Grep para: `innerHTML`, `outerHTML`, `document.write`, `DOMParser`, `Range().createContextualFragment`, `insertAdjacentHTML`

Correção:

- Prefira:
  - `textContent` para inserção de texto.
  - Renderização de reação em vez de manipulação manual de DOM.
  - Um desinfetante testado para qualquer análise de HTML necessária.

Notas:

- A documentação de Trusted Types define coletores HTML como `Element.innerHTML` e `document.write()` como coletores de injeção que podem executar scripts quando recebem entrada controlada pelo invasor. ([Documentos da Web MDN] [3])
- A orientação OWASP HTML5 recomenda usar `textContent` em vez de `innerHTML` para atribuir dados não confiáveis. ([Série de folhas de dicas OWASP] [4])

---

### REACT-URL-001: Valide e restrinja URLs não confiáveis usados em `href`, `src`, navegação e redirecionamentos

Gravidade: Alta Somente quando você puder provar que eles são controlados pelo invasor

Obrigatório:

- DEVE tratar qualquer URL derivado de entrada não confiável como perigoso.
- Esquemas de lista de permissões OBRIGATÓRIOS e (quando aplicável) hosts:
  - Normalmente permite apenas `https:` (e talvez `http:` para localhost/dev) e URLs relativos para navegação no aplicativo.
  - DEVE bloquear explicitamente `javascript:` e usos perigosos de `data:`, a menos que você tenha validação especializada e um caso de uso claro.

- DEVE preferir caminhos relativos do mesmo site (por exemplo, `/settings`) em vez de URLs absolutos.
- DEVE validar os parâmetros “returnTo/next/redirect” (ver REACT-REDIRECT-001).

Padrões inseguros:

- `<img src={userProvidedUrl}>...` (pode ser usado para rastreamento/exfiltração de dados; também é arriscado se usado para scripts/iframes)
- `janela.localização = próximo`
- `navigate(next)` onde `next` vem de parâmetros de consulta sem validação

Dicas de detecção:

- Procure por:
  - `href={`, `src={`, `window.location`, `location.href`, `window.open`, `navigate(`, `redirectTo`, `returnTo`, `next=`

- Acompanhe se o valor é derivado de URL/consulta/armazenamento/API.

Correção:

- Implemente um utilitário `safeUrl()` compartilhado:
  - Analisar com `novo URL(valor, base)`
  - Aplicar lista de permissões de esquema e lista de permissões de host (ou impor a mesma origem)
  - Para redirecionamentos: permita apenas caminhos relativos (começando com `/`) ou uma lista de permissões estrita de origens absolutas.

- Volte para um padrão seguro quando a validação falhar.

Notas:

- OWASP observa explicitamente o risco `dangerouslySetInnerHTML` do React e também afirma que o React não pode lidar com segurança com URLs `javascript:` ou `data:` sem validação especializada. ([Série de folhas de dicas OWASP] [9])

---

### REACT-MARKUP-001: Markdown/renderização de rich text deve ser configurado com segurança

Gravidade: Média

Obrigatório:

- DEVE assumir que markdown/rich text pode ser controlado pelo invasor se vier de usuários ou CMS.
- DEVE garantir que o HTML bruto não seja renderizado, a menos que seja higienizado.
- DEVE preferir renderizadores de markdown que:
  - Não permitir HTML bruto por padrão ou
  - Pode ser configurado para proibir HTML bruto ou
  - Limpe a saída HTML antes da renderização.

Padrões inseguros:

- Renderização de Markdown com “passagem de HTML bruto” habilitada (por exemplo, opções/plugins que permitem HTML).
- Renderização in-line de SVG/MathML/HTML fornecido pelo usuário sem higienização.

Dicas de detecção:

- Procure bibliotecas comuns e opções arriscadas:
  - `marked`, `markdown-it`, `react-markdown`, `rehype-raw`, `sanitize: false`, `allowDangerousHtml`, etc.

- Procure por `dangerouslySetInnerHTML` usado com “saída de remarcação”.

Consertar:

- Desative a passagem de HTML bruto.
- Limpe a saída com um desinfetante comprovado (por exemplo, DOMPurify) antes da renderização.

Notas:

- A orientação XSS da OWASP enfatiza que as saídas de emergência da estrutura exigem codificação de saída e/ou sanitização de HTML. ([Série de folhas de dicas OWASP] [9])

---

### REACT-TT-001: Use tipos confiáveis (com CSP) para proteger os coletores DOM XSS sempre que possível

Gravidade: Baixa

Obrigatório:

- DEVE considerar primeiro a ativação de tipos confiáveis ​​no modo somente relatório e, em seguida, aplicá-los assim que as violações forem resolvidas.
- DEVE centralizar as políticas de tipos confiáveis ​​e tratá-las como códigos de alto risco que exigem revisão.
- NÃO DEVE criar políticas permissivas que simplesmente “passem” por strings não confiáveis.

Padrões inseguros:

- Uma política de tipos confiáveis ​​que retorna a string bruta sem sanitização para coletores HTML.
- Muitas políticas espalhadas pela base de código (difíceis de auditar).

Dicas de detecção:

- Procure por:
  - `trustedTypes.createPolicy`
  - Diretivas CSP: `require-trusted-types-for`, `trusted-types`

- Pesquise os coletores DOM restantes (REACT-DOM-001).

Consertar:

- Implementar um pequeno número de políticas com escopo restrito:
  - A política HTML usa sanitizador (DOMPurify ou equivalente).
  - A política de URL de script usa listas de permissões restritas.

- Execute no modo somente relatório, corrija as violações e, em seguida, aplique.

Notas:

- MDN descreve Trusted Types como uma forma de garantir que a entrada seja transformada (normalmente higienizada) antes de ser passada para coletores de injeção e destaca coletores HTML (`innerHTML`, `document.write`) e coletores de URL JS (`script.src`). ([Documentos da Web MDN] [3])
- A especificação W3C Trusted Types enquadra isso como uma redução do risco de DOM XSS, bloqueando coletores para valores digitados criados por políticas revisadas. ([W3C][15])

---

### REACT-CSP-001: Implante e mantenha um CSP como defesa profunda (especialmente ao renderizar conteúdo não confiável)

Gravidade: Média a Alta

Obrigatório:

- DEVE implantar CSP em produção; DEVE fazer isso para aplicativos que renderizam conteúdo não confiável ou integram scripts de terceiros.
- DEVE evitar `unsafe-inline` e `unsafe-eval` quando possível.
- DEVE usar nonces/hashes CSP para scripts in-line, se necessário, e manter a política realista.
- DEVE usar o CSP para exigir/incentivar o SRI quando apropriado.

Padrões inseguros:

- Nenhum CSP no shell do aplicativo (HTML de entrada SPA).
- CSP que depende amplamente de `unsafe-inline`/`unsafe-eval` sem justificativa.
- `script-src *` ou fontes excessivamente amplas.

Dicas de detecção:

- Procure a configuração do CSP:
  - Configuração do servidor/CDN, cabeçalhos nas respostas `index.html` ou configuração da estrutura.

- Se ausente no repo, marque como “verificar na borda”.

Consertar:

- Adicione CSP por meio de cabeçalhos de resposta HTTP (preferencial).
- Comece apenas com relatórios para reduzir quebras e depois aplique.

Notas:

- OWASP descreve o CSP como uma “defesa profunda” contra o XSS e observa que ele pode ajudar a impor o SRI mesmo em sites estáticos, mas não deve ser a única defesa. ([Série de folhas de dicas OWASP] [2])

---

### REACT-SRI-001: Use Subresource Integrity (SRI) para scripts e estilos de terceiros (ou auto-host)

Gravidade: Baixa

Obrigatório:

- DEVE tratar JS de terceiros como equivalente à execução de código arbitrário em sua origem.
- Se estiver carregando de um CDN ou de terceiros:
  - DEVE usar SRI (`integrity=...`) e `crossorigin` quando aplicável.
  - DEVE fixar versões exatas (evitar URLs “mais recentes”).
  - DEVE preferir auto-hospedagem para código crítico.

Padrões inseguros:

- `<script src="https://cdn.example.com/lib/latest.js"></script>` sem integridade.
- Gerenciadores de tags que carregam scripts arbitrários dinamicamente sem governança.

Dicas de detecção:

- Pesquise em `public/index.html`, modelos ou wrappers SSR por:
  - `<script src=`, `<link rel="stylesheet" href=`
  - Snippets do gerenciador de tags (GTM, Segmento, etc.)

- Identificar scripts carregados dinamicamente em runtime JS.

Consertar:

- Adicione hashes SRI para ativos estáveis ​​de terceiros ou auto-hospedagem.
- Aplicar controles de governança para gerenciadores de tags (ver REACT-3P-001).

Notas:

- MDN descreve o SRI como um recurso de segurança que permite aos navegadores verificar se os recursos obtidos (por exemplo, de um CDN) não foram manipulados, verificando um hash criptográfico. ([Documentos da Web MDN] [7])
- Notas de orientação do OWASP CSP O CSP pode impor SRI e é útil mesmo em sites estáticos. ([Série de folhas de dicas OWASP] [2])

---

### REACT-3P-001: JavaScript de terceiros e gerenciadores de tags devem ser minimizados e controlados

Gravidade: Alta

Obrigatório:

- DEVE minimizar os scripts de terceiros e tratar cada um deles como um risco para a cadeia de fornecimento.
- DEVE saber exatamente o que JS de terceiros executa em sua origem e por quê.
- DEVE implementar governança:
  - Revise e fixe versões (ou espelhe internamente).
  - Restringir o acesso aos dados (abordagem da camada de dados).
  - Utilizar SRI e CSP; considere fazer sandbox de UI não confiável em iframes sempre que possível.

Padrões inseguros:

- Scripts de análise/anúncios não revisados ​​em execução com acesso total a DOM, cookies, armazenamento e dados do usuário.
- Gerenciadores de tags que podem ser alterados por funções que não sejam de engenharia, sem controle de alterações.

Dicas de detecção:

- Pesquise snippets de fornecedores comuns em HTML/JS:
  - GTM, Segmento, Hotjar, FullStory, etc.

- Procure inserção dinâmica de script:
  - `document.createElement('script')`, `.src = ...`, `.appendChild(script)`

Correção:

- Reduzir apenas os fornecedores necessários.
- Sempre que viável:
  - Scripts de auto-host ou espelho.
  - Utilize SRI.
  - Limite a exposição de dados através de uma camada de dados controlada.

Notas:

- OWASP observa que o comprometimento do servidor JS de terceiros pode injetar JS malicioso e destaca riscos como execução arbitrária de código e divulgação de informações confidenciais a terceiros. ([Série de folhas de dicas OWASP] [5])

---

### REACT-AUTH-001: O manuseio de token e sessão deve ser resiliente ao XSS (evite armazenamento confidencial no armazenamento da Web)

Gravidade: Média

Obrigatório:

- DEVE evitar armazenar identificadores de sessão ou tokens de longa duração em `localStorage` (e geralmente em Web Storage) porque o XSS pode exfiltrá-los.
- Se os tokens devem existir no lado do cliente:
  - DEVE preferir armazenamento na memória com vida útil curta e mecanismos de atualização.
  - DEVE definir o escopo e girar os tokens; evite tokens de portador de longa duração em armazenamento persistente.

- DEVE preferir cookies HTTPOnly para tokens de sessão quando possível (requer estratégia CSRF: consulte REACT-CSRF-001).

Padrões inseguros:

- `localStorage.setItem('token', ...)` / `sessionStorage.setItem('token', ...)` para tokens de autenticação.
- Tokens de atualização persistentes em `localStorage`.
- Tratar os dados do Web Storage como confiáveis.

Dicas de detecção:

- Grep para: `localStorage.`, `sessionStorage.`, `setItem(`, `getItem(`, `token`, `jwt`, `refresh`
- Pesquise o código de autenticação para “lembrar de mim” armazenando tokens persistentemente.

Correção:

- Mude para cookies HTTPOnly (mudança de servidor) + proteções CSRF ou use tokens de memória de curta duração.
- Reduza o escopo e a vida útil do token.

Notas:

- A orientação OWASP HTML5 recomenda evitar informações confidenciais e identificadores de sessão no armazenamento local e alerta que um único XSS pode roubar todos os dados no armazenamento Web. ([Série de folhas de dicas OWASP] [4])
- A orientação de aplicativos baseados em navegador OAuth discute que os tokens armazenados no armazenamento persistente do navegador, como localStorage, podem ser acessíveis a JS maliciosos (por exemplo, via XSS). ([Rastreador de dados IETF] [16])

---

### REACT-CSRF-001: Solicitações de alteração de estado autenticadas por cookie DEVEM ser protegidas por CSRF

Gravidade: Alta

NOTA: Se o aplicativo não usar autenticação baseada em cookies (usando o cabeçalho de autenticação, por exemplo), o CSRF não será uma preocupação.

Obrigatório:

- Se o aplicativo depende de cookies para autenticação:
  - DEVE proteger solicitações de mudança de estado (POST/PUT/PATCH/DELETE) contra CSRF.
  - DEVE incluir um mecanismo de token CSRF (token sincronizador ou cookie de envio duplo) ou outro padrão robusto apropriado ao backend.
  - DEVE usar cookies SameSite como defesa profunda, não como única defesa.

Padrões inseguros:

- `fetch('/api/transfer', { método: 'POST', credenciais: 'include' })` sem token/cabeçalho CSRF, contando apenas com cookies.
- Usando GET para operações de mudança de estado.

Dicas de detecção:

- Enumerar chamadas de rede que mudam de estado e verificar:
  - É usado `credentials: 'include'` ou `withCredentials: true`?
  - Um cabeçalho de token CSRF está incluído (por exemplo, `X-CSRF-Token`)?

- Procure por utilitários “csrf”; se ausente, trate como suspeito.

Consertar:

- Adicionar fluxo de token CSRF:
  - Busque o token de um endpoint seguro e anexe-o a solicitações de mudança de estado.
  - Validar o lado do servidor.

- Mantenha os cookies SameSite e a validação de Origem/Referente como defesa profunda.

Notas:

- A orientação CSRF da OWASP explica o comportamento do SameSite (Lax/Strict/None) como uma técnica de defesa profunda e por que Lax costuma ser o equilíbrio entre usabilidade/segurança, mas não é um substituto completo para proteções CSRF. ([Série de folhas de dicas OWASP] [6])

---

### REACT-AUTHZ-001: Não confie apenas na autorização de front-end

Gravidade: Alta (somente se usada como proteção primária)

Obrigatório:

- DEVE tratar todas as verificações de autorização de front-end apenas como UX.
- DEVE impor autorização no servidor para qualquer recurso ou ação protegida.

Padrões inseguros:

- Ações “protegidas” ocultas na UI, mas que podem ser chamadas pela API sem verificações do servidor.
- Verificações do cliente como `if (user.isAdmin) { showAdminPanel(); }` sem aplicação do lado do servidor.

Dicas de detecção:

- Procure a interface da interface do usuário em torno de ações confidenciais e verifique se os endpoints do servidor impõem autorização.
- Em uma auditoria apenas de frontend, relate como “verificações de cliente não são segurança; verifique backend”.

Correção:

- Adicionar/confirmar verificações de autorização do lado do servidor.
- Mantenha o portão de front-end apenas por conveniência.

Notas:

- Esta é uma propriedade geral de segurança de aplicativos da web; O React não pode proteger os recursos do servidor por si só.

---

### REACT-NET-001: Evite a exfiltração de dados e o vazamento de credenciais por meio de solicitações de saída dinâmicas

Gravidade: Média a Alta

Obrigatório:

- DEVE evitar fazer solicitações autenticadas para origens controladas pelo invasor.
- DEVE evitar permitir que a entrada do usuário controle o destino da solicitação (esquema/host/porta).
- DEVE centralizar os clientes da rede (fetch/axios) com:
  - `baseURL` corrigido (ou lista de permissões estrita),
  - tratamento rigoroso de redirecionamentos,
  - uso explícito de `credenciais`.

Padrões inseguros:

- `fetch(userProvidedUrl, {credenciais: 'include' })`
- `axios.create({ baseURL: userProvidedBase })`
- Recursos de “busca/visualização de URL” no cliente que atingem domínios arbitrários com cabeçalhos confidenciais.

Dicas de detecção:

- Procure por `fetch(` / `axios(` de onde o primeiro argumento ou `baseURL` é derivado:
  - parâmetros de consulta, localStorage, respostas de API, postMessage

- Procure por `credenciais: 'include'`, `withCredentials: true`.

Correção:

- Aplicar listas de permissões de destino; proibir solicitações de origem cruzada, a menos que seja explicitamente necessário.
- Remova credenciais/cabeçalhos de autorização para qualquer destino não permitido.

Notas:

- Mesmo que o navegador limite algum comportamento de origem cruzada, o vazamento de tokens/cabeçalhos para endpoints não confiáveis ainda é um modo de falha comum.

---

### REACT-REDIRECT-001: Evite redirecionamentos abertos e navegação não confiável

Gravidade: Média

Obrigatório:

- DEVE validar alvos de redirecionamento/navegação derivados de entradas não confiáveis ​​(`next`, `returnTo`, `redirect`).
- DEVE permitir apenas caminhos relativos do mesmo site ou uma lista de permissões estrita de origens confiáveis ​​para URLs absolutos.

Padrões inseguros:

- `window.location.href = novo URLSearchParams(location.search).get('next')`
- `navigate(next)` onde `next` vem dos parâmetros de consulta.

Dicas de detecção:

- Procure por: `next`, `returnTo`, `redirect`, `window.location`, `navigate(`
- Rastrear origem do alvo de redirecionamento.

Correção:

- Permitir apenas caminhos relativos (`/^\/[^\s]*$/`) ou origens permitidas.
- Volte para um padrão seguro (por exemplo, `/`) quando inválido.

Notas:

- Redirecionamentos abertos são frequentemente usados em phishing e podem prejudicar os fluxos de SSO/OAuth.

---

### REACT-SW-001: Trabalhadores de serviços têm alto privilégio; requer HTTPS e regras seguras de cache/atualização

Gravidade: Média

Obrigatório:

- DEVE servir service workers por HTTPS (exceto `localhost` dev) e implantar apenas em contextos seguros.
- DEVE evitar armazenar em cache respostas de API autenticadas confidenciais, a menos que sejam explicitamente projetadas e modeladas como ameaças.
- DEVE implementar uma estratégia de atualização segura (recarga imediata, caches versionados, remoção de caches antigos na ativação).

Padrões inseguros:

- Registrar um service worker para um aplicativo autenticado e armazenar “tudo” em cache indiscriminadamente.
- Caches de longa duração contendo PII ou conteúdo específico do usuário compartilhado entre contas.

Dicas de detecção:

- Procure por:
  - `navigator.serviceWorker.register`
  - `workbox`, `precacheAndRoute`, manipuladores `fetch` personalizados

- Inspecione os padrões de cache (`caches.open`, `cache.put`, `respondWith`).

Consertar:

- Restrinja o cache apenas a ativos estáticos (JS/CSS/imagens), a menos que você tenha um modelo offline projetado.
- Certifique-se de que as chaves de cache tenham escopo do usuário se dados específicos do usuário precisarem ser armazenados em cache.
- Fornece um mecanismo de atualização claro.

Notas:

- O MDN observa que os service workers exigem HTTPS por motivos de segurança e agem como um proxy para solicitações/respostas. ([Documentos da Web MDN] [10])
- Existem “contextos seguros” para impedir que invasores MITM acessem APIs poderosas; os service workers são um exemplo desse recurso poderoso. ([Documentos da Web MDN] [18])

---

### REACT-HEADERS-001: Certifique-se de que os cabeçalhos de segurança essenciais estejam definidos para o shell do aplicativo React (aplicativo ou borda)

Gravidade: Média

Obrigatório (SPA típico servido de uma origem):

- DEVE definir:
  - CSP (`Política de Segurança de Conteúdo`)
  - `X-Content-Type-Options: nosniff`
  - Proteção contra clickjacking (`frame-ancestors` em CSP e/ou `X-Frame-Options`)
  - `Política de referência`
  - `Política de Permissões` conforme apropriado

- DEVE garantir que eles estejam configurados em algum lugar (CDN/borda/servidor), mesmo que não estejam no repositório.

Padrões inseguros:

- Sem cabeçalhos de segurança em qualquer lugar (aplicativo ou borda).
- CSP ausente em aplicativos que renderizam conteúdo não confiável ou usam scripts de terceiros.

Dicas de detecção:

- Verifique a configuração do servidor/CDN no repositório (nginx, Cloudflare, Vercel config, etc.).
- Se ausente, sinalizar como “verificar em tempo de execução/borda”.

Correção:

- Defina os cabeçalhos centralmente na borda.
- Mantenha o CSP realista e iterativo (somente relatório → aplicar).

Notas:

- A orientação sobre clickjacking do MDN discute defesas, incluindo `X-Frame-Options` e `frame-ancestors` do CSP. ([Documentos da Web MDN] [8])
- A orientação do OWASP CSP explica a entrega por meio de cabeçalhos de resposta e recomenda cabeçalhos como mecanismo preferido. ([Série de folhas de dicas OWASP] [2])

---

### REACT-POSTMSG-001: `postMessage` deve validar a origem e tratar a carga útil como dados não confiáveis

Gravidade: Média a Alta (depende do que as mensagens podem fazer)

Obrigatório:

- DEVE especificar `targetOrigin` exato ao enviar mensagens (não `*`), a menos que haja um motivo estrito.
- DEVE validar `event.origin` no recebimento e validar o formato da mensagem.
- NÃO DEVE avaliar os dados da mensagem como código ou inseri-los no DOM como HTML.

Padrões inseguros:

- `window.postMessage(data, '*')` para alvos desconhecidos.
- Recebendo:
  - `window.addEventListener('message', (e) => { eval(e.data) })`
  - `element.innerHTML = e.data`

Dicas de detecção:

- Pesquisa: `postMessage(`, `addEventListener('message'`
- Verifique se há verificações de origem e manuseio seguro.

Correção:

- Adicione listas de permissões de origem estritas e validação de esquema (por exemplo, zod).
- Tratar a carga útil da mensagem estritamente como dados; renderize com segurança via React.

Notas:

- A orientação OWASP HTML5 recomenda especificar a origem esperada para `postMessage`, verificar a origem do remetente, validar dados e evitar eval/innerHTML com conteúdo da mensagem. ([Série de folhas de dicas OWASP] [4])

---

### REACT-FILE-001: uploads e visualizações de arquivos não devem criar vulnerabilidades de conteúdo ativo no lado do cliente

Gravidade: Média (pode ser Alta se for possível XSS armazenado)

Obrigatório:

- DEVE tratar os arquivos e visualizações enviados pelo usuário como potencialmente maliciosos.
- NÃO DEVE renderizar HTML/SVG/outro conteúdo ativo carregado in-line, a menos que seja higienizado e explicitamente exigido.
- DEVE validar os tipos de arquivo do lado do cliente para UX, mas DEVE confiar na validação do lado do servidor para segurança.

Padrões inseguros:

- Renderização de HTML enviado pelo usuário como conteúdo.
- Renderização inline de SVG/HTML não confiável via `dangerouslySetInnerHTML` ou `<iframe srcdoc=...>` sem higienização.

Dicas de detecção:

- Pesquise componentes de upload e lógica de visualização:
  - `input type="file"`, `FileReader`, `URL.createObjectURL`, `<iframe>`, `<object>`, `<embed>`.

- Rastreie onde o conteúdo carregado é exibido posteriormente.

Consertar:

- Restrinja os tipos aceitos, higienize quando necessário e prefira fluxos de download/anexo para tipos de risco.
- Garantir que o servidor aplique a política real (verificação de tipo, renomeação, digitalização, armazenamento fora do webroot).

Notas:

- A orientação de upload de arquivos OWASP destaca a inclusão de extensões na lista de permissões, a validação do tipo de arquivo, a geração de nomes de arquivos, a limitação de tamanho, o armazenamento fora do webroot e a consideração de “conteúdo ativo do lado do cliente (XSS, CSRF, etc.)” quando os arquivos são recuperáveis ​​publicamente. ([Série de folhas de dicas OWASP] [19])

---

### REACT-SUPPLY-001: Dependência e higiene da cadeia de suprimentos (frontend + ferramentas de construção)

Gravidade: Baixa

Obrigatório:

- DEVE usar um arquivo de bloqueio e impor instalações reproduzíveis no CI.
- DEVE auditar regularmente as dependências e responder rapidamente aos avisos para:
  - React, react-dom, bibliotecas de roteador, ferramentas de construção (Vite/Webpack), sanitizadores, bibliotecas de autenticação, etc.

- DEVE reduzir a exposição a ataques de script no momento da instalação e ao risco de typosquatting.

Foco da auditoria:

- O CI deve usar `npm ci` (ou equivalente ao arquivo de bloqueio congelado do Yarn / pnpm) para evitar desvios.
- Use verificação de vulnerabilidades (`npm audit`, GitHub Dependabot/alerts, etc.).

Padrões inseguros:

- Nenhum arquivo de bloqueio ou arquivo de bloqueio ignorado no CI.
- `npm install` em CI produzindo compilações não reproduzíveis.
- Deps de alto risco não fixados ou não revisados; grandes atualizações repentinas sem revisão.
- Execução cega de scripts de instalação de pacotes de terceiros.

Dicas de detecção:

- Verifique se há arquivos de bloqueio: `package-lock.json`, `yarn.lock`, `pnpm-lock.yaml`.
- Verifique os scripts de CI para `npm install` vs `npm ci`.
- Procure scripts `postinstall` e etapas de construção suspeitas.

Correção:

- Use lockfile e aplique-o no CI (por exemplo, `npm ci`).
- Realizar auditorias regularmente; fixar/atualizar com responsabilidade.
- Considere restringir scripts de instalação sempre que possível.

Notas:

- Os documentos do npm descrevem a `auditoria do npm` como o envio da árvore de dependências do projeto ao registro para receber um relatório de vulnerabilidades conhecidas e (opcionalmente) a aplicação de correções por meio da `correção de auditoria do npm`, enquanto observa que algumas vulnerabilidades exigem revisão manual. ([Documentos npm][20])
- os documentos npm descrevem `npm ci` como destinado a ambientes automatizados/CI, exigindo um arquivo de bloqueio existente e falhando se `package.json` e lockfile não corresponderem. ([Documentos npm][21])
- OWASP NPM se

A orientação de segurança recomenda aplicar o arquivo de bloqueio e chama explicitamente `npm ci` / `yarn install --frozen-lockfile` para abortar inconsistências e destaca o risco de scripts no momento da instalação e a opção de usar `--ignore-scripts` para reduzir a superfície de ataque. ([Série de folhas de dicas OWASP] [22])

---

## 5) Heurísticas práticas de varredura (como “caçar”)

Ao digitalizar ativamente, use estes padrões de sinal alto:

- Escotilhas de escape HTML / XSS brutos:
  - `perigosamenteSetInnerHTML`, `__html:`
  - Sinalizadores de passagem HTML Markdown: `rehype-raw`, `allowDangerousHtml`, `sanitize: false`

- coletores DOM XSS:
  - `innerHTML`, `outerHTML`, `insertAdjacentHTML`, `document.write`, `DOMParser`, `createContextualFragment`

- Execução JS perigosa:
  - `eval(`, `nova Função(`, `setTimeout("`, `setInterval("`

- Injeção/navegação de URL não confiável:
  - `href={` / `src={` com valores não confiáveis
  - `window.location`, `location.href`, `window.open`, `navigate(`
  - Parâmetros de consulta: `next`, `returnTo`, `redirect`

- Risco de token/sessão:
  - `localStorage.setItem`, `sessionStorage.setItem`, `getItem(` com `token`, `jwt`, `refresh`

- Acoplamento cookie/CSRF:
  - `credentials: 'include'`, `withCredentials: true` em solicitações de mudança de estado sem cabeçalhos CSRF

- Scripts de terceiros:
  - `<script src=...>` em `public/index.html`
  - Snippets do gerenciador de tags e inserção dinâmica de scripts

- Trabalhadores de serviços:
  - `navigator.serviceWorker.register`, uso da caixa de trabalho, manipuladores `fetch` personalizados

- pós-mensagem:
  - `postMessage(` com `*`, faltando verificações `event.origin`

- Cadeia de abastecimento:
  - Arquivo de bloqueio ausente, CI usa `npm install`, nenhuma etapa de auditoria, scripts pós-instalação arriscados

Sempre tente confirmar:

- origem dos dados (não confiável versus confiável)
- tipo de coletor (saída de escape React vs coletor DOM vs navegação vs armazenamento)
- controles de proteção presentes (sanitização, listas de permissões, CSP/Tipos confiáveis, tokens CSRF, cabeçalhos, governança)

---

## 6) Fontes (acessado em 26/01/2026)

Documentação primária do React:

- Anúncio estável do React 19 — `https://react.dev/blog/2024/12/05/react-19` ([React][23])
- Documentos React DOM: aviso `dangerouslySetInnerHTML` - `https://react.dev/reference/react-dom/components/common#dangerouslysetting-the-inner-html` ([React][12])
- Declaração de escape JSX React (legado) - `https://legacy.reactjs.org/docs/introduzindo-jsx.html` ([React][14])

Série de folhas de dicas OWASP:

- Prevenção de scripts entre sites (escotilhas de escape da estrutura; React `dangerouslySetInnerHTML`; notas de validação de URL) — `https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html` ([Série de folhas de dicas OWASP][9])
- Política de segurança de conteúdo - `https://cheatsheetseries.owasp.org/cheatsheets/Content_Security_Policy_Cheat_Sheet.html` ([Série de folhas de dicas OWASP] [2])
- Prevenção de falsificação de solicitações entre sites — `https://c

heatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html` ([Série de folhas de dicas OWASP] [6])

- Segurança HTML5 (armazenamento na Web, postMessage, tabnabbing, frames em sandbox) - `https://cheatsheetseries.owasp.org/cheatsheets/HTML5_Security_Cheat_Sheet.html` ([Série de folhas de dicas OWASP] [4])
- Gerenciamento de JavaScript de terceiros — `https://cheatsheetseries.owasp.org/cheatsheets/Third_Party_Javascript_Management_Cheat_Sheet.htm

l` ([Série de folhas de dicas OWASP] [5])

- Upload de arquivo - `https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html` ([Série de folhas de dicas OWASP] [19])
- Melhores práticas de segurança NPM — `https://cheatsheetseries.owasp.org/cheatsheets/NPM_Security_Cheat_Sheet.html` ([Série de folhas de dicas OWASP][22])

Referências de navegador/plataforma (MDN, W3C):

- API de tipos confiáveis — `https://developer.mozilla.org/en-US/docs/Web/API/Trusted_Types_API` ([MDN Web Docs][3])
- Especificação de tipos confiáveis do W3C — `https://www.w3.org/TR/trusted-types/` ([W3C][15])
- Integridade de sub-recursos — `https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity` ([MDN Web Docs][7])
- Visão geral das defesas contra clickjacking — `https://developer.mozilla.org/en-US/docs/Web/Security/Attacks/Clickjacking` ([MDN Web Docs][8])
- Usi

ng Service Workers (requisito HTTPS; comportamento semelhante ao proxy) — `https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers` ([MDN Web Docs][10])

- Contextos seguros (APIs poderosas restritas a HTTPS) — `https://developer.mozilla.org/en-US/docs/Web/Security/Defenses/Secure_Contexts` ([MDN Web Docs][18])
- Vincular valores `rel` (noopener/noreferrer) — `https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/rel` ([MDN

Documentos da Web][17])

Construir referências de ferramentas/exposição ambiental:

- Aviso de criação de variáveis de ambiente do aplicativo React - `https://create-react-app.dev/docs/adding-custom-environment-variables/` ([create-react-app.dev][1])
- Notas de segurança sobre variáveis ambientais do Vite — `https://vite.dev/guide/env-and-mode` ([vitejs][11])

Orientação de armazenamento de autenticação/token:

- OAuth 2.0 para aplicativos baseados em navegador (discussão sobre armazenamento de token) — `https://datatracker.ietf.org/doc/html/draft-ietf-oauth-browser-based-apps` ([IETF Datatracker][16])

Referências de ferramentas de dependência:

- documentos de auditoria npm — `https://docs.npmjs.com/cli/v10/commands/npm-audit/` ([npm Docs][20])
- documentos npm ci - `https://docs.npmjs.com/cli/v10/commands/npm-ci/` ([npm Docs][21])

Referência do desinfetante:

- DOMPurify — `https://github.com/cure53/DOMPurify` ([GitHub][13])

[1]: https://create-react-app.dev/docs/adding-custom-environment-variables/ 'Adicionando variáveis ​​de ambiente personalizadas | Criar aplicativo React'
[2]: https://cheatsheetseries.owasp.org/cheatsheets/Content_Security_Policy_Cheat_Sheet.html 'Política de Segurança de Conteúdo - Série de Folhas de Dicas OWASP'
[3]: https://developer.mozilla.org/en-US/docs/Web/API/Trusted_Types_API 'API de tipos confiáveis - APIs da Web | MDN'
[4]: https://cheatsheetseries.owasp.org/cheatsheets/HTML5_Secu

rity_Cheat_Sheet.html 'Segurança HTML5 - Série de folhas de dicas OWASP'
[5]: https://cheatsheetseries.owasp.org/cheatsheets/Third_Party_Javascript_Management_Cheat_Sheet.html 'Gerenciamento de Javascript de terceiros - Série de folhas de dicas OWASP'
[6]: https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html 'Prevenção de falsificação de solicitação entre sites - Série de folhas de dicas OWASP'
[7]: https://developer.mozilla.org/en-US/doc

s/Web/Security/Defenses/Subresource_Integrity 'Integridade de sub-recursos - Segurança | MDN'
[8]: https://developer.mozilla.org/en-US/docs/Web/Security/Attacks/Clickjacking 'Clickjacking - Segurança | MDN'
[9]: https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html 'Prevenção de scripts entre sites - Série de folhas de dicas OWASP'
[10]: https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_W

funcionários usando Service Workers - APIs da Web | MDN'
[11]: https://vite.dev/guide/env-and-mode 'Variáveis e modos de ambiente | Vite'
[12]: https://react.dev/reference/react-dom/components/common 'Componentes comuns (por exemplo, <div>) – React'
[13]: https://github.com/cure53/DOMPurify 'GitHub - cure53/DOMPurify: DOMPurify - um desinfetante XSS somente DOM, super-rápido e supertolerante para HTML, MathML e SVG. DOMPurify funciona com um padrão seguro, mas oferece muita confiança

gurabilidade e ganchos. Demonstração:'
[14]: https://legacy.reactjs.org/docs/introduzindo-jsx.html 'Apresentando JSX – React'
[15]: https://www.w3.org/TR/trusted-types/ 'Tipos confiáveis'
[16]: https://datatracker.ietf.org/doc/html/draft-ietf-oauth-browser-based-apps '

                rascunho-ietf-oauth-aplicativos baseados em navegador-26

        '

[17]: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/rel 'Atributo HTML: rel -

HTML | MDN'
[18]: https://developer.mozilla.org/en-US/docs/Web/Security/Defenses/Secure_Contexts 'Contextos seguros - Segurança | MDN'
[19]: https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html 'Upload de arquivo - Série de folhas de dicas OWASP'
[20]: https://docs.npmjs.com/cli/v10/commands/npm-audit 'npm-audit | Documentos npm'
[21]: https://docs.npmjs.com/cli/v10/commands/npm-ci 'npm-ci | Documentos npm'
[22]: https://cheatsheetseries.owasp.org/ch

eatsheets/NPM_Security_Cheat_Sheet.html 'Segurança NPM - Série de folhas de dicas OWASP'
[23]: https://react.dev/blog/2024/12/05/react-19 'Reagir v19 - Reagir'
