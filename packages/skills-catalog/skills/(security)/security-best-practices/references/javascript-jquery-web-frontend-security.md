# jQuery Frontend Security Spec (jQuery 4.0.x, navegadores modernos)

Este documento foi concebido como uma **especificação de segurança** que oferece suporte a:

1. **Geração de código seguro por padrão** para novo código de front-end baseado em jQuery.
2. **Revisão de segurança/caça de vulnerabilidades** no código existente baseado em jQuery (passivo “notificar problemas durante o trabalho” e ativo “verificar o repositório e relatar descobertas”).

Ele é intencionalmente escrito como um conjunto de **requisitos normativos** (“DEVE/DEVE/PODE”) mais **regras de auditoria** (como são os padrões ruins, como detectá-los e como corrigi-los/mitigá-los).

---

## 0) Segurança, limites e restrições antiabuso (DEVE SEGUIR)

- NÃO DEVE solicitar, gerar, registrar ou confirmar segredos (chaves de API, senhas, chaves privadas, tokens de sessão, tokens de atualização, tokens CSRF, cookies de sessão).
- DEVE tratar o navegador como um ambiente controlado pelo invasor:
  - As verificações de front-end (interface de interface do usuário, “botão desativar”, campos ocultos, validação do lado do cliente) NÃO DEVEM ser tratadas como autorização ou limite de segurança.
  - A autorização e validação do lado do servidor DEVEM existir mesmo se o frontend estiver “correto”.

- NÃO DEVE “consertar” a segurança desabilitando proteções (por exemplo, relaxando o CSP para permitir `unsafe-inline`, habilitando JSONP “porque funciona”, adicionando CORS amplo, desabilitando a higienização, suprimindo verificações de segurança).
- DEVE fornecer descobertas baseadas em evidências durante as auditorias: citar caminhos de arquivos, trechos de código e valores de configuração relevantes.
- DEVE tratar a incerteza honestamente: se uma proteção puder existir na borda (CDN/WAF/cabeçalhos de proxy reverso como CSP), reporte

é como “não visível no repositório; verifique em tempo de execução/config”.

---

## 1) Modos de operação

### 1.1 Modo de geração (padrão)

Quando solicitado a escrever um novo código jQuery ou modificar o código jQuery existente:

- DEVE seguir todos os requisitos **DEVE** nesta especificação.
- DEVE seguir todos os requisitos **DEVE**, a menos que o usuário diga explicitamente o contrário.
- DEVE preferir padrões seguros por padrão: inserção de texto, construção de nós DOM, listas de permissões e bibliotecas de sanitização comprovadas em vez de escape personalizado.
- DEVE evitar a introdução de novos coletores de risco (construção de string HTML, carregamento dinâmico de script, JSONP, atributos de script/manipulador de eventos in-line, atribuição de URL insegura, un

fusão segura de objetos).

### 1.2 Modo de revisão passiva (sempre ativado durante a edição)

Ao trabalhar em qualquer lugar em um repositório que usa jQuery (mesmo que o usuário não tenha solicitado uma verificação de segurança):

- DEVE “notar” violações desta especificação no código tocado/próximo.
- DEVE mencionar os problemas à medida que surgem, com uma breve explicação + solução segura.

### 1.3 Modo de auditoria ativo (solicitação de verificação explícita)

Quando o usuário pede para “verificar”, “auditar” ou “caçar vulnerabilidades”:

- DEVE pesquisar sistematicamente a base de código em busca de violações desta especificação.
- DEVE apresentar resultados no formato estruturado (ver §2.3).

Ordem de auditoria recomendada:

1. Fonte de jQuery, versões e higiene de dependências (tags de script, lockfiles, uso de CDN, SRI).
2. Postura de CSP/Tipos confiáveis/cabeçalhos de segurança (no repositório e em tempo de execução, se observável).
3. DOM XSS: fontes não confiáveis ​​→ coletores jQuery (`.html`, `.append`, `$("<…>")`, `.load`, etc.).
4. Pias de execução de script: JSONP, `dataType:"script"`, `$.getScript`, inserção dinâmica `<script>`.
5. Atribuição de URL/atributo (atributos `href`, `src`, `style`, `on*`).

6. Protótipo de poluição / fusão de objetos inseguros (padrões `$.extend`).
7. Padrões de autenticação AJAX + CSRF para sessões baseadas em cookies.
8. Plugins de terceiros e caminhos de renderização de conteúdo não confiáveis ​​(comentários, WYSIWYG, markdown-to-HTML).

---

## 2) Definições e orientações de revisão

### 2.1 Entrada não confiável (tratada como controlada pelo invasor, salvo prova em contrário)

Os exemplos incluem:

- Quaisquer dados do servidor provenientes de usuários (perfis de usuário, comentários, “nome de exibição”, rich text, nomes de arquivos).
- Dados de APIs ou serviços de terceiros.
- Fontes controladas pelo navegador:
  - `location.href`, `location.search`, `location.hash`
  - `document.URL`, `document.baseURI`, `document.referrer`
  - `janela.nome`
  - `localStorage` / `sessionStorage`
  - dados de evento `postMessage` (a menos que exista origem estrita e validação de esquema)
  - Um

y Conteúdo DOM que poderia ter sido injetado anteriormente (XSS armazenado)

### 2.2 “sumidouros” de alto risco em contextos jQuery

Um coletor é um caminho de código onde entradas não confiáveis podem ser interpretadas como código executável ou HTML.

Principais categorias de coletor jQuery:

- Inserção/análise de HTML:
  - Métodos de manipulação de DOM que aceitam strings HTML como `.html()`, `.append()` e métodos relacionados (veja notas CVE abaixo). ([NVD][1])
  - `$(htmlString)` (quando o argumento pode ser interpretado como marcação HTML).
  - `jQuery.parseHTML(html,…, keepScripts)` especialmente com `keepScripts=true`. ([API jQuery][2])
  - `.load(url)` (carrega HTML no DOM; possui comportamento especial de execução de script). ([API jQuery][3])

- Execução de script/carregamento dinâmico de código:
  - `$.getScript()` / `$.ajax({ dataType: "script" })` (executa JavaScript buscado). ([API jQuery][4])
  - JSONP (`dataType: "jsonp"` ou comportamento JSONP implícito) (executa JavaScript remoto como resposta). ([API jQuery][5])
  - `eval`, `nova Função`, `setTimeout("…")`, `setInterval("…")`, `$.globalEval` (se presente)

- Atribuição de atributos perigosos:
  - Atribuir strings não confiáveis a atributos `href`, `src`, `srcdoc`, `style` ou manipulador de eventos (`onload`, `onclick`, etc.)
  - `javascript:` URLs são particularmente perigosos e desencorajados. ([Documentos da Web MDN] [6])

### 2.3 Formato de descoberta de auditoria necessário

Para cada problema encontrado, produza:

- ID da regra:
- Gravidade: Crítica / Alta / Média / Baixa
- Localização: caminho do arquivo + função/componente + linha(s)
- Evidência: o trecho de código/configuração exato
- Impacto: o que pode dar errado, quem pode explorar
- Correção: mudança segura (prefira diferença mínima)
- Mitigação: defesa profunda se a solução imediata for difícil
- Notas falso-positivas: o que verificar em caso de incerteza

---

## 3) Linha de base segura: configuração mínima de produção (DEVE em produção)

Esta é a menor “linha de base de produção” que evita falhas comuns de segurança relacionadas ao jQuery.

### 3.1 Use uma versão jQuery com patch e suportada (OBRIGATÓRIA)

- DEVE usar uma versão principal do jQuery suportada e mantê-la atualizada.
- A partir de 27/01/2026, o projeto jQuery envia o jQuery 4.0.0 como a versão principal mais recente. ([blog.jquery.com][7])
- Se você precisar oferecer suporte a navegadores muito antigos (principalmente IE < 11), o jQuery 4 não os suporta e talvez seja necessário permanecer no jQuery 3.x; trate isso como uma postura de maior risco e aplique patches agressivamente. ([blog.jquery.com][7])

### 3.2 Carregar jQuery com segurança (OBRIGATÓRIO)

- DEVE carregar o jQuery apenas de:
  - Seu próprio pipeline de construção (empacotado via npm/yarn + lockfile) ou
  - O jQuery CDN oficial/um CDN confiável com Subresource Integrity (SRI) habilitado.

- Se estiver carregando de uma CDN, DEVE usar SRI (`integrity`) e corrigir as configurações de `crossorigin`; o projeto jQuery apoia e recomenda explicitamente o SRI em seu CDN. (Obtido em [jquery.com][8])

### 3.3 CSP + tipos confiáveis ​​(DEVE e DEVE quando disponível/exigido pela política)

- DEVE implantar uma Política de Segurança de Conteúdo (CSP) que reduza o impacto do XSS (especialmente restrições `script-src` e evite `inseguro-inline`). Se não for feito através do servidor HTTP, isso pode ser feito através da tag `<meta http-equiv="Content-Security-Policy" content="...">`. ([OWASP Cheat Sheet Series][9]) NOTA: É muito importante definir o script-src do CSP. Todas as outras directivas não são tão importantes e geralmente podem ser excluídas para facilitar o desenvolvimento.

pagamento.

- DEVE considerar os tipos confiáveis ​​como uma forte defesa profunda contra DOM XSS. ([W3C][10])
- Se você implantar a diretiva CSP `require-trusted-types-for`, o código DEVE rotear a injeção de DOM por meio de políticas de tipos confiáveis. ([Documentos da Web MDN] [11])
- Nota: o jQuery 4.0 adicionou explicitamente suporte a tipos confiáveis para que TrustedHTML possa ser usado com métodos de manipulação do jQuery sem violar `require-trusted-types-for`. ([blog.jquery.com][7])

### 3.4 Cabeçalhos de segurança e postura de cookies (defesa em profundidade; DEVE)

Embora normalmente sejam definidos no lado do servidor, eles reduzem materialmente o raio de explosão de erros relacionados ao jQuery. No entanto, se o contexto for apenas o aplicativo da web front-end, não será possível agir sobre ele.

- DEVE definir cabeçalhos de segurança comuns (CSP, `X-Content-Type-Options: nosniff`, proteção contra clickjacking via `frame-ancestors` / `X-Frame-Options`, `Referrer-Policy`). ([Série de folhas de dicas OWASP] [12])
- DEVE evitar armazenar segredos/tokens de longa duração em locais acessíveis ao JavaScript (como `localStorage`), a menos que o modelo de ameaça aceite explicitamente “XSS == controle de conta”. Isso não é específico do jQuery, mas a manipulação DOM pesada do jQuery aumenta o

chance de regressões DOM XSS; reduzir o retorno.

---

## 4) Regras (geração + auditoria)

Cada regra contém: práticas necessárias, padrões inseguros, dicas de detecção e correção.

### JQ-SUPPLY-001: jQuery DEVE ser corrigido; não execute versões vulneráveis conhecidas

Gravidade: Média (alta se o aplicativo voltado para a Internet E a versão for reconhecidamente vulnerável)

NOTA: Antes de realizar uma atualização, peça a opinião do usuário e tente entender se ele tem motivos para mantê-la. A atualização pode interromper os aplicativos de maneiras inesperadas. Relate e recomende atualizações em vez de apenas executá-las.

Obrigatório:

- NÃO DEVE usar versões do jQuery com vulnerabilidades conhecidas de alto impacto quando existir uma versão corrigida.
- DEVE atualizar após:
  - CVE-2019-11358 (protótipo de poluição em jQuery antes de 3.4.0). ([NVD][13])
  - CVE-2020-11022/CVE-2020-11023 (Riscos XSS em métodos de manipulação de DOM ao lidar com HTML não confiável; corrigido em 3.5.0). ([NVD][1])

Padrões inseguros:

- Tags de script ou manifestos de pacote que fazem referência ao jQuery antigo (por exemplo, `jquery-1.*`, `jquery-2.*`, `jquery-3.3.*`, `jquery-3.4.*`, `jquery-3.4.1`, etc.).
- Diretórios de fornecedores agrupados contendo jQuery antigo minificado sem um caminho de atualização.

Dicas de detecção:

- Pesquise HTML/modelos por `jquery-` e analise strings de versão.
- Verifique `package.json`, `package-lock.json`, `yarn.lock`, `pnpm-lock.yaml`.
- Verifique `vendor/`, `public/`, `static/`, `assets/`, `wwwroot/` para `jquery*.js`.

Consertar:

- Atualize para o jQuery atual (prefira o principal estável mais recente; em 27/01/2026, 4.0.0 é o atual). ([blog.jquery.com][7])
- Se a atualização for restrita, faça uma atualização mínima além dos limites de CVE e adicione controles de compensação (CSP forte, sanitização rigorosa, remoção de APIs arriscadas como JSONP, remoção de extensão profunda de objetos não confiáveis).

Notas:

- Se um requisito do produto forçar versões antigas, reporte como “risco aceito que requer controles de compensação”.

---

### JQ-SUPPLY-002: O carregamento de scripts de terceiros DEVE usar integridade e origens confiáveis

Gravidade: Alta

Obrigatório:

- DEVE carregar jQuery e plugins apenas de origens confiáveis.
- Se carregado do CDN, DEVE usar SRI (`integrity`) e corrigir o tratamento de `crossorigin`. ([jquery.com][8])

Padrões inseguros:

- `<script src="https://…/jquery.min.js"></script>` sem `integridade`.
- Carregar jQuery de CDNs aleatórios de terceiros sem uma decisão de confiança explícita.

Dicas de detecção:

- Procure no HTML `<script src=` e verifique `integrity=` + `crossorigin=`.
- Identifique a inserção dinâmica de scripts com URLs não confiáveis ​​(consulte JQ-EXEC-001).

Consertar:

- Prefira empacotamento via npm + lockfile.
- Se estiver usando CDN, copie a tag de script oficial (jQuery CDN suporta SRI). ([jquery.com][8])

Observação: se não for possível obter a tag SRI correta, pule esta etapa, mas informe ao usuário. Se você usar o errado, o aplicativo não funcionará. Nesse caso remova-o e informe o usuário.

---

### JQ-XSS-001: Dados não confiáveis NÃO DEVEM ser inseridos como HTML por meio de métodos de manipulação de DOM do jQuery

Gravidade: Alta (se o conteúdo controlado pelo invasor atingir esses coletores)

Obrigatório:

- DEVE tratar qualquer inserção de string HTML como um limite de execução de código.
- DEVE usar alternativas seguras para texto não confiável:
  - `.text(untrusted)` (texto, não HTML). ([API jQuery][14])
  - `.val(untrusted)` para campos de formulário. ([API jQuery][15])
  - Crie elementos e defina textos/atributos com segurança em vez de concatenar strings HTML.

Padrões inseguros (exemplos):

- `$(seletor).html(não confiável)`
- `$(seletor).append(não confiável)`
- `$(selector).before(untrusted)` / `.after(untrusted)` / `.replaceWith(untrusted)` / `.wrap(untrusted)` (e similares)
- Construindo marcação: `"<div>" + untrusted + "</div>"` e depois passando para jQuery

Dicas de detecção:

- Grep para: `.html(`, `.append(`, `.prepend(`, `.before(`, `.after(`, `.replaceWith(`, `.wrap(`, `.wrapAll(`, `.wrapInner(`
- Rastreie o fluxo de dados para essas chamadas a partir de fontes em §2.1.

Correção:

- Substitua por `.text()` / `.val()` ou construção de nó:
  - `const $el = $("<span>").text(não confiável); container.append($el);`

- Se a saída deve conter marcação limitada, consulte JQ-XSS-002 (sanitização).

Notas:

- Versões mais antigas do jQuery tinham casos extremos adicionais, mesmo durante a tentativa de higienização; corrigido em 3.5.0+. Ainda assim: nunca confie apenas na “higienização de fios” – prefira a criação estruturada ou desinfetantes comprovados. ([GitHub][16])

---

### JQ-XSS-002: Se a renderização de HTML controlado pelo usuário for necessária, ela DEVE ser higienizada com um higienizador de HTML comprovado

Gravidade: Média (alta se o HTML rico for controlado pelo invasor e o sanitizador for fraco/mal configurado)

Obrigatório:

- NÃO DEVE “rolar seu próprio” sanitizador de HTML com expressões regulares.
- Se o HTML controlado pelo usuário precisar ser exibido (por exemplo, comentários em rich text), DEVE higienizar usando um desinfetante de HTML bem mantido e uma lista de permissões restritiva.
  - DOMPurify é uma escolha comum; use configuração conservadora e mantenha-a atualizada. ([GitHub][17])
  - Quando disponível, PODE considerar a API HTML Sanitizer do navegador (nota: disponibilidade limitada do navegador). ([Documentos da Web MDN] [18])

- DEVE emparelhar a sanitização com CSP e, sempre que possível, tipos confiáveis ​​para defesa em profundidade. ([Série de folhas de dicas OWASP] [9])

Padrões inseguros:

- Tentativas de “strip `<script>`” ou “escape `<`” baseadas em Regex seguidas de inserção de `.html()`.
- DOMPurify (ou similar) configurado para permitir tags/atributos excessivamente amplos ou configurações que não são revisadas.

Dicas de detecção:

- Pesquise funções auxiliares de “sanitização”, regex substituindo padrões `<`/`>` ou configurações de “permitir todas as tags”.
- Identificar recursos que renderizam “rich text” ou “HTML personalizado” gerado pelo usuário.
- Verifique se os resultados do desinfetante foram inseridos com `.html()` ou coletores equivalentes.

Consertar:

- Introduzir um desinfetante com lista de permissões rigorosa.
- Centralize o padrão “higienizar e depois injetar” em um único módulo revisado.
- Adicione testes de regressão cobrindo entradas maliciosas representativas (não armazene cargas em logs ou telemetria).

Notas falsas positivas:

- Se o conteúdo for confiável (por exemplo, modelos compilados enviados por você), documente o limite de confiança e por que ele não é controlado pelo invasor.

---

### JQ-XSS-003: `$(untrustedString)` e `jQuery.parseHTML` NÃO DEVEM processar marcação controlada pelo invasor

Gravidade: Alta (se controlada pelo invasor)

Obrigatório:

- NÃO DEVE passar strings controladas pelo invasor para `$()` quando elas puderem ser interpretadas como HTML.
- DEVE tratar `jQuery.parseHTML(html, …, keepScripts)` como uma primitiva de alto risco; keepScripts DEVEM ser `false` para qualquer entrada não confiável. ([API jQuery][2])

Padrões inseguros:

- `const $node = $(não confiável);`
- `$.parseHTML(untrusted, /* context */, true)` (scripts preservados)

Dicas de detecção:

- Pesquise chamadas `$(` onde o argumento não é um seletor estático ou marcação estática.
- Procure por `$.parseHTML(` e inspecione o argumento `keepScripts`.

Correção:

- Use a criação de DOM com nomes de tags constantes e `.text()` para valores não confiáveis.
- Se a análise de HTML for necessária, limpe primeiro (JQ-XSS-002) e mantenha os scripts desabilitados.

---

### JQ-XSS-004: `.load()` DEVE ser tratado como uma superfície de injeção de script HTML+

Gravidade: Média (alta se o URL/conteúdo for controlado pelo invasor)

Obrigatório:

- NÃO DEVE usar `.load()` com URLs controladas por invasores ou fragmentos HTML controlados por invasores.
- DEVE entender o comportamento do script jQuery `.load()`:
  - Sem um seletor na URL, o conteúdo é passado para `.html()` antes que os scripts sejam removidos, que podem executar scripts. ([API jQuery][3])

- DEVE preferir `fetch()`/XHR para recuperar dados e, em seguida, renderizar com criação segura de DOM ou higienizar explicitamente.

Padrões inseguros:

- `$("#target").load(untrustedUrl)`
- `$("#target").load("/path?param=" + não confiável)`

Dicas de detecção:

- Pesquise `.load(` em arquivos JS/TS.
- Identifique se um seletor está anexado ao URL (o comportamento é diferente). ([API jQuery][3])
- Rastreie se o URL pode ser influenciado pela entrada do usuário.

Correção:

- Substitua `.load()` por:
  - `fetch()` para recuperar JSON e, em seguida, renderizar via `.text()` / construção de nó, ou
  - `fetch()` para recuperar HTML, higienizá-lo e depois injetar.

- Se `.load()` precisar permanecer, certifique-se de que o URL seja constante ou estritamente permitido e que o conteúdo retornado seja confiável.

---

### JQ-EXEC-001: A execução dinâmica de script e a busca de script NÃO DEVEM ser acessíveis a partir de entradas não confiáveis

Gravidade: Alta

Obrigatório:

- NÃO DEVE buscar e executar scripts de URLs não confiáveis ​​ou influenciados pelo usuário.
- DEVE tratá-los como primitivos de execução de código:
  - `$.getScript(url)` executa o script obtido no contexto global. ([API jQuery][4])
  - `$.ajax({ dataType: "script" })` e outras solicitações digitadas em script que executam respostas.

- DEVE remover esses padrões, a menos que haja uma justificativa forte e revisada.

Padrões inseguros:

- `$.getScript(untrustedUrl)`
- `$.ajax({ url: untrustedUrl, dataType: "script" })`
- Injeção dinâmica `<script src=...>` onde `src` é derivado de entrada não confiável.

Dicas de detecção:

- Procure por `getScript(`, `dataType: "script"`, `globalEval`, `eval`, `nova função`.
- Procure recursos de “carregador de plugins” ou “carregador de temas” que aceitam URLs.

Correção:

- Agrupar scripts em tempo de construção.
- Se o carregamento em tempo de execução for necessário, restrinja-o a ativos listados na lista de permissões, com controle de versão e com integridade verificada (e, idealmente, ainda evite o carregamento de código em tempo de execução).

---

### JQ-AJAX-001: JSONP DEVE ser desativado, a menos que o endpoint seja totalmente confiável (e mesmo assim, evite)

Gravidade: Média (alta se o invasor puder influenciar o URL/endpoint)

Obrigatório:

- NÃO DEVE usar JSONP para endpoints não confiáveis ​​porque ele executa respostas JavaScript.
- Ao usar `$.ajax`, DEVE desabilitar explicitamente o JSONP para alvos não totalmente confiáveis; Os próprios documentos do jQuery recomendam definir `jsonp: false` “por razões de segurança” se você não confia no alvo. ([API jQuery][5])
- DEVE preferir CORS com JSON (`dataType: "json"`) e listas de permissões de origem explícitas no lado do servidor.

Padrões inseguros:

- `dataType: "jsonp"`
- URLs contendo `callback=?` ou padrões que acionam o comportamento JSONP. argumentos de retorno de chamada são historicamente vetores XSS.
- `$.get(untrustedUrl)` sem fixar `dataType` e desabilitar JSONP (o risco depende das opções e do comportamento do jQuery)

Dicas de detecção:

- Procure por `jsonp`, `dataType: "jsonp"`, `callback=?`.
- Pesquise AJAX entre domínios em que o URL não esteja codificado nem na lista de permissões.

Consertar:

- Use JSON sobre HTTPS com CORS configurado no lado do servidor.
- Conjunto:
  - `dataType: "json"`
  - `jsonp: false` (defesa detalhada quando o URL pode ser ambíguo) ([jQuery API][5])

---

### JQ-AJAX-002: Solicitações AJAX de mudança de estado usando autenticação de cookie DEVEM ser protegidas por CSRF

Gravidade: Alta

NOTA: Isso só importa ao usar autenticação baseada em cookies. Se a solicitação usar o cabeçalho Authorization, não haverá potencial de CSRF.

Obrigatório:

- Se a autenticação usar cookies, DEVE proteger as solicitações de alteração de estado (POST/PUT/PATCH/DELETE) contra CSRF.
- DEVE usar tokens CSRF verificados pelo servidor; para chamadas AJAX, os tokens geralmente são enviados em um cabeçalho personalizado. ([Série de folhas de dicas OWASP] [19])
- NÃO DEVE tratar “é uma solicitação AJAX” como proteção CSRF por si só.

Padrões inseguros:

- `$.post("/transfer", {...})` ou `$.ajax({ método: "POST", ... })` com autenticação de cookie e sem token/cabeçalho CSRF.
- “Proteção CSRF” que verifica apenas `X-Requested-With` (apenas defesa profunda, não primária).

Dicas de detecção:

- Enumerar chamadas AJAX que alteram o estado e localizar se elas incluem tokens CSRF.
- Identifique como o servidor espera a validação CSRF (meta tag, envio duplo de cookie para cabeçalho, token sincronizador, etc.).

Consertar:

- Adicione a inclusão de token CSRF em um local centralizado, por exemplo, `$.ajaxSetup({ headers: { "X-CSRF-Token": token } })`, e garanta a verificação do servidor.
- Siga as orientações do OWASP CSRF para propriedades e validação do token. ([Série de folhas de dicas OWASP] [19])

Notas falsas positivas:

- Se a autenticação não for baseada em cookies (por exemplo, token portador do cabeçalho de autorização), o risco de CSRF é diferente; verifique o mecanismo de autenticação real.

---

### JQ-ATTR-001: Valores não confiáveis NÃO DEVEM ser gravados em atributos perigosos sem validação/lista de permissões

Gravidade: Baixa (Alta para eventos como onclick)

Obrigatório:

- DEVE validar/listar URLs escritos em `href`, `src`, `action`, etc.
- DEVE bloquear esquemas perigosos; URLs `javascript:` não são recomendados porque podem executar código. ([Documentos da Web MDN] [6])
- NÃO DEVE definir atributos do manipulador de eventos (`onclick`, `onerror`, etc.) a partir de strings.
- DEVE evitar escrever strings não confiáveis ​​em atributos `style`; prefira alternar classes CSS predefinidas.

Padrões inseguros:

- `$("a").attr("href", untrustedUrl)`
- `$("img").attr("src", untrustedUrl)`
- `$(el).attr("estilo", untrustedCss)`
- `$(el).attr("onclick", untrustedJs)`

Dicas de detecção:

- Procure por `.attr("href"`, `.attr("src"`, `.attr("style"`, `.prop("href"`, `.prop("src"`.
- Rastreie se as entradas vêm de parâmetros de URL, JSON do servidor, DOM ou armazenamento.

Correção:

- Analise e valide URLs com `new URL(value, location.origin)` e protocolos de lista de permissões (`https:` etc.) e nomes de host quando necessário.
- Para destinos de navegação, prefira caminhos relativos construídos em vez de URLs completos.
- Substitua as strings `style` por `addClass/removeClass` usando nomes de classes predefinidos.

---

### JQ-SELECTOR-001: Fragmentos do seletor controlados pelo usuário DEVEM ser escapados com `jQuery.escapeSelector`

Gravidade: Média (pode se tornar Alta se permitir a seleção de elementos errados na UI relevante para a segurança)

Obrigatório:

- Se você deve selecionar por um ID/classe que pode conter caracteres CSS especiais, DEVE usar `jQuery.escapeSelector()` (disponível em jQuery 3.0+). ([API jQuery][20])
- NÃO DEVE concatenar strings brutas controladas pelo invasor em expressões seletoras.

Padrões inseguros:

- `$("#" + id não confiável)`
- `$("[data-id='" + untrusted + "']")` (especialmente sem citação/escape estrito)

Dicas de detecção:

- Procure por `"#" +`, `". " +` ou strings de modelo usadas dentro dos seletores `$(`.
- Procure por “selecionar por id fornecido pelo usuário”.

Correção:

- `$("#" + $.escapeSelector(untrustedId))` ([API jQuery][20])
- Prefira IDs internos estáveis em vez de seletores derivados do usuário.

Notas:

- Isso geralmente é “robustez”, mas pode se tornar relevante para a segurança se a seleção incorreta fizer com que a UI revele/modifique os dados errados ou ignore os prompts relacionados à segurança.

---

### JQ-PROTOTYPE-001: Não faça mesclagem profunda de objetos não confiáveis; prevenir a poluição do protótipo

Gravidade: Média

Obrigatório:

- NÃO DEVE mesclar profundamente (`$.extend(true, …)`) objetos controlados pelo invasor em objetos do aplicativo sem filtrar chaves perigosas.
- DEVE garantir que o jQuery seja >= 3.4.0 para evitar o comportamento de poluição do protótipo CVE-2019-11358. ([NVD][13])

Padrões inseguros:

- `$.extend(true, alvo, não confiávelObj)`
- `$.extend(true, {}, defaults, untrustedObj)` onde untrustedObj vem de URL/JSON/storage

Dicas de detecção:

- Pesquise `$.extend(true` e inspecione as fontes dos objetos mesclados.
- Pesquise padrões de “opções de mesclagem” / “aplicar configuração” usando JSON não confiável.

Correção:

- Prefira:
  - Mesclagem superficial com um conjunto de chaves permitido ou
  - Um auxiliar de mesclagem seguro que rejeita explicitamente `__proto__`, `prototype`, `construtor` e ocorrências aninhadas.

- Mantenha o jQuery corrigido.

---

### JQ-CSP-001: CSP e tipos confiáveis DEVEM ser usados para tornar o DOM XSS mais difícil de introduzir e explorar

Gravidade: Média

Obrigatório:

- DEVE implantar o CSP como defesa profunda contra o XSS. ([Série de folhas de dicas OWASP] [9])
- Se ativar tipos confiáveis (`require-trusted-types-for`), DEVE garantir que a injeção de DOM passe pelas políticas de tipos confiáveis. ([Documentos da Web MDN] [11])
- Ao usar o jQuery 4, DEVE aproveitar as vantagens de seu suporte a Trusted Types (entradas TrustedHTML). ([blog.jquery.com][7])

Padrões inseguros:

- “Consertar” um recurso jQuery enfraquecendo o CSP (`script-src 'unsafe-inline'` / `'unsafe-eval'`) sem um plano de compensação.
- Nenhum CSP em aplicativos que renderizam conteúdo do usuário ou manipulam fortemente o DOM.

Dicas de detecção:

- Procure cabeçalhos CSP (configurações do servidor, middleware da estrutura, meta tags).
- Se não estiver visível no repositório, sinalize como “verificar na borda/tempo de execução”.

Consertar:

- Adicionar CSP de forma incremental; comece eliminando scripts embutidos e manipuladores de eventos embutidos e, em seguida, aperte `script-src`.
- Adicione tipos confiáveis ​​onde houver suporte e for viável.

---

## 5) Heurísticas práticas de varredura (como “caçar”)

Ao digitalizar ativamente, use estes padrões de sinal alto:

- versão/fonte do jQuery:
  - `jquery-*.js` em `vendor/` ou `static/`
  - Dependência `package.json` `jquery` fixada em versões antigas
  - Tags de script CDN sem `integridade`/`crossorigin` ([jquery.com][8])

- Coletores de injeção de HTML (DOM XSS):
  - `.html(`, `.append(`, `.prepend(`, `.before(`, `.after(`, `.replaceWith(`, `.wrap(`
  - `$(` onde o argumento pode ser strings HTML/modelo
  - `$.parseHTML(` especialmente com `keepScripts=true` ([jQuery API][2])
  - `.load(` (e se o seletor está anexado; o comportamento do script é diferente) ([jQuery API][3])

- Execução de script/código dinâmico:
  - `$.getScript(`, `dataType: "script"` ([API jQuery][4])
  - `dataType: "jsonp"` ou `jsonp:` uso; Padrões `callback=?` ([API jQuery][5])
  - `eval`, `nova função`, `setTimeout("…")`, `$.globalEval`

- Gravações de atributos perigosos:
  - `.attr("href", …)`, `.attr("src", …)`, `.attr("estilo", …)`
  - Qualquer atribuição de esquemas do tipo `javascript:` ou construção de URL suspeita ([MDN Web Docs][6])

- Construção do seletor:
  - `$("#" + usuário)` e similares; correção via `$.escapeSelector` ([API jQuery][20])

- Protótipo de poluição:
  - `$.extend(true,…, userObj)`; garanta jQuery >= 3.4.0 e filtre chaves perigosas ([NVD][13])

- Postura CSRF para AJAX:
  - `$.post(` / `$.ajax({ método: ... })` com cookies e sem token/cabeçalho CSRF ([OWASP Cheat Sheet Series][19])

- Defesa em profundidade:
  - Ausência de cabeçalhos CSP/segurança nas configurações (ou não visíveis; requer verificação de tempo de execução) ([OWASP Cheat Sheet Series][12])

Sempre tente confirmar:

- origem dos dados (não confiável versus confiável)
- tipo de coletor (inserção de HTML/execução de script/atributo/seletor/mesclagem de objetos)
- controles de proteção presentes (desinfetante, listas de permissões, CSP, tipos confiáveis, validação CSRF)

---

## 6) Fontes (acessado em 27/01/2026)

Documentação primária do projeto jQuery e notas de lançamento:

- notas de lançamento do jQuery 4.0.0 (Tipos confiáveis/mudanças de CSP; informações de versão): `https://blog.jquery.com/2026/01/17/jquery-4-0-0/`. ([blog.jquery.com][7])
- Baixe o jQuery (informações da versão mais recente; orientação CDN + SRI): `https://jquery.com/download/`. ([jquery.com][8])
- API jQuery: `.html()`: `https://api.jquery.com/html/`. ([API jQuery][21])
- API jQuery: `.text()`: `https://api.jquery.com/text/`. ([API jQuery][14])
- API jQuery: `.append()`: `https://api.

jquery.com/append/`. ([API jQuery][22])

- API jQuery: `.load()` (comportamento de execução do script): `https://api.jquery.com/load/`. ([API jQuery][3])
- API jQuery: `jQuery.parseHTML(…, keepScripts)`: `https://api.jquery.com/jQuery.parseHTML/`. ([API jQuery][2])
- API jQuery: `$.ajax()` (`jsonp: false` nota de segurança): `https://api.jquery.com/jQuery.ajax/`. ([API jQuery][5])
- API jQuery: `$.getScript()` (executa script): `https://api.jquery.com/jQuery.g

etScript/`. ([API jQuery][4])

- API jQuery: `jQuery.escapeSelector()`: `https://api.jquery.com/jQuery.escapeSelector/`. ([API jQuery][20])

Vulnerabilidades/avisos do jQuery:

- NVD CVE-2019-11358 (protótipo de poluição; jQuery <3.4.0): `https://nvd.nist.gov/vuln/detail/CVE-2019-11358`. ([NVD][13])
- NVD CVE-2020-11022 (risco XSS em métodos de manipulação de DOM; corrigido em 3.5.0): `https://nvd.nist.gov/vuln/detail/CVE-2020-11022`. ([NVD][1])
- NVD CVE-2020-11023 (risco XSS envolvendo `<opção>`; corrigido em 3.5.0): `https://nvd.nist.gov/vuln/detail/CVE-2020-11023`. ([NVD][23])
- Aviso de segurança do GitHub GHSA-gxr4-xjj5-5px2 (jQu

ery htmlPré-filtro XSS; corrigido em 3.5.0): `https://github.com/jquery/jquery/security/advisories/GHSA-gxr4-xjj5-5px2`. ([GitHub][16])

Série de folhas de dicas OWASP (fundamentos de segurança de aplicativos da web relevantes para o uso de jQuery):

- Prevenção XSS: `https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html`. ([Série de folhas de dicas OWASP] [24])
- Prevenção XSS baseada em DOM: `https://cheatsheetseries.owasp.org/cheatsheets/DOM_based_XSS_Prevention_Cheat_Sheet.html`. ([Série de folhas de dicas OWASP] [25])
- Prevenção de CSRF: `https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html`. ([OWASP Cheat Sheet Ser

sim][19])

- Cabeçalhos de segurança HTTP: `https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Headers_Cheat_Sheet.html`. ([Série de folhas de dicas OWASP] [12])
- Folha de referências da política de segurança de conteúdo: `https://cheatsheetseries.owasp.org/cheatsheets/Content_Security_Policy_Cheat_Sheet.html`. ([Série de folhas de dicas OWASP] [9])

Referências de navegador/plataforma (SRI, CSP, tipos confiáveis ​​e esquemas de URL perigosos):

- MDN: Integridade de Sub-recursos (SRI): `https://developer.mozilla.org/en-US/docs/Web/Security/Defenses/Subresource_Integrity`. ([Documentos da Web MDN] [26])
- W3C: especificação SRI: `https://www.w3.org/TR/sri-2/`. ([W3C][27])
- MDN: guia CSP: `https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CSP`. ([Documentos da Web MDN] [28])
- MDN: diretiva `require-trusted-types-for`: `https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-

Política/requer tipos confiáveis ​​para`. ([Documentos da Web MDN] [11])

- MDN: API de tipos confiáveis: `https://developer.mozilla.org/en-US/docs/Web/API/Trusted_Types_API`. ([Documentos da Web MDN] [29])
- W3C: especificação de tipos confiáveis: `https://www.w3.org/TR/trusted-types/`. ([W3C][10])
- MDN: `javascript:` aviso de esquema de URL: `https://developer.mozilla.org/en-US/docs/Web/URI/Reference/Schemes/javascript`. ([Documentos da Web MDN] [6])
- Documentação do projeto DOMPurify: `https://git

hub.com/cure53/DOMPurify`. ([GitHub][17])

[1]: https://nvd.nist.gov/vuln/detail/cve-2020-11022 'CVE-2020-11022 Detalhe - NVD'
[2]: https://api.jquery.com/jQuery.parseHTML/ 'jQuery.parseHTML()'
[3]: https://api.jquery.com/load/ '.load() | Documentação da API jQuery'
[4]: https://api.jquery.com/jQuery.getScript/ 'jQuery.getScript()'
[5]: https://api.jquery.com/jQuery.ajax/ 'jQuery.ajax()'

[6]: https://developer.mozilla.org/en-US/docs/Web/URI/Reference/Schemes/javascript 'javascript: URLs - UR

É - MDN Web Docs'
[7]: https://blog.jquery.com/2026/01/17/jquery-4-0-0/ 'jQuery 4.0.0 | Blog oficial do jQuery'
[8]: https://jquery.com/download/ 'Baixar jQuery | jQuery'
[9]: https://cheatsheetseries.owasp.org/cheatsheets/Content_Security_Policy_Cheat_Sheet.html 'Política de Segurança de Conteúdo - Série de Folhas de Dicas OWASP'
[10]: https://www.w3.org/TR/trusted-types/ 'Tipos confiáveis'
[11]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers

/Content-Security-Policy/require-trusted-types-for 'Content-Security-Policy: diretiva require-trusted-types-for'
[12]: https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Headers_Cheat_Sheet.html 'Folha de referências dos cabeçalhos de resposta de segurança HTTP'
[13]: https://nvd.nist.gov/vuln/detail/cve-2019-11358 'CVE-2019-11358 Detalhe - NVD'
[14]: https://api.jquery.com/text/ '.text() | Documentação da API jQuery'
[15]: https://api.jquery.com/val/ '.val() | jQuery A

Documentação PI'
[16]: https://github.com/jquery/jquery/security/advisories/GHSA-gxr4-xjj5-5px2 'Potencial vulnerabilidade XSS em jQuery.htmlPrefilter e métodos relacionados · Consultivo · jquery/jquery · GitHub'
[17]: https://github.com/cure53/DOMPurify 'DOMPurify - um XSS somente DOM, super rápido e supertolerante ...'
[18]: https://developer.mozilla.org/en-US/docs/Web/API/HTML_Sanitizer_API 'API HTML Sanitizer - MDN Web Docs'
[19]: https://cheatsheetseries.

owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html 'Folha de referências para prevenção de falsificação de solicitação entre sites'
[20]: https://api.jquery.com/jQuery.escapeSelector/ 'jQuery.escapeSelector()'
[21]: https://api.jquery.com/html/ '.html() | Documentação da API jQuery'
[22]: https://api.jquery.com/append/ '.append() | Documentação da API jQuery'
[23]: https://nvd.nist.gov/vuln/detail/cve-2020-11023 'CVE-2020-11023 Detalhe - NVD'
[24]: https

://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html 'Prevenção de scripts entre sites - Série de folhas de dicas OWASP'
[25]: https://cheatsheetseries.owasp.org/cheatsheets/DOM_based_XSS_Prevention_Cheat_Sheet.html 'Folha de referências de prevenção XSS baseada em DOM'
[26]: https://developer.mozilla.org/en-US/docs/Web/Security/Defenses/Subresource_Integrity 'Integridade de sub-recursos - Segurança - MDN Web Docs'
[27]: https://www.w3.or

g/TR/sri-2/ 'Integridade de sub-recursos'
[28]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CSP 'Política de segurança de conteúdo (CSP) - HTTP - MDN Web Docs'
[29]: https://developer.mozilla.org/en-US/docs/Web/API/Trusted_Types_API 'API de tipos confiáveis - MDN Web Docs'
