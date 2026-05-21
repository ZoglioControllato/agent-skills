# Especificações de segurança Go (Golang) (Go 1.25.x, Biblioteca Padrão, net/http)

Este documento foi concebido como uma **especificação de segurança** que oferece suporte a:

1. **Geração de código seguro por padrão** para novo código Go.
2. **Revisão de segurança/caça de vulnerabilidades** no código Go existente (passivo “notificar problemas durante o trabalho” e ativo “verificar o repositório e relatar descobertas”).

Ele é intencionalmente escrito como um conjunto de **requisitos normativos** (“DEVE/DEVE/PODE”) mais **regras de auditoria** (como são os padrões ruins, como detectá-los e como corrigi-los/mitigá-los).

---

## 0) Segurança, limites e restrições antiabuso (DEVE SEGUIR)

- NÃO DEVE solicitar, gerar, registrar ou confirmar segredos (chaves de API, senhas, chaves privadas, cookies de sessão, JWTs, URLs de banco de dados com credenciais, chaves de assinatura, segredos do cliente).
- NÃO DEVE “consertar” a segurança desabilitando proteções (por exemplo, `InsecureSkipVerify`, `GOSUMDB=off` para módulos públicos, curinga CORS + credenciais, removendo verificações de autenticação, desabilitando defesas CSRF em aplicativos de autenticação de cookie).
- DEVE fornecer **descobertas baseadas em evidências** durante as auditorias: citar arquivo

e caminhos, trechos de código, configurações de construção/implantação e valores concretos que justificam a afirmação.

- DEVE tratar a incerteza com honestidade: se um controle existir na infraestrutura (proxy reverso, WAF, malha de serviço, configuração da plataforma), relate-o como “não visível no código do aplicativo; verifique em tempo de execução/configuração”.
- DEVE manter as correções mínimas, corretas e seguras para produção; evite introduzir alterações significativas sem aviso (especialmente em torno de fluxos de autenticação/sessão e proxies).

---

## 1) Modos de operação

### 1.1 Modo de geração (padrão)

Quando solicitado a escrever um novo código Go ou modificar o código existente:

- DEVE seguir todos os requisitos **DEVE** nesta especificação.
- DEVE seguir todos os requisitos **DEVE**, a menos que o usuário diga explicitamente o contrário.
- DEVE preferir APIs seguras por padrão e bibliotecas comprovadas em vez de código de segurança personalizado.
- DEVE evitar a introdução de novos coletores de risco (execução de shell, execução de modelo dinâmico, exibição de arquivos de usuário como HTML, redirecionamentos inseguros, criptografia fraca, análise ilimitada, etc.).

### 1.2 Modo de revisão passiva (sempre ativado durante a edição)

Ao trabalhar em qualquer lugar de um repositório Go (mesmo que o usuário não tenha solicitado uma verificação de segurança):

- DEVE “notar” violações desta especificação no código tocado/próximo.
- DEVE mencionar os problemas à medida que surgem, com uma breve explicação + solução segura.

### 1.3 Modo de auditoria ativo (solicitação de verificação explícita)

Quando o usuário pede para “verificar”, “auditar” ou “caçar vulnerabilidades”:

- DEVE pesquisar sistematicamente a base de código em busca de violações desta especificação.
- DEVE apresentar os resultados num formato estruturado (ver §2.3).

Ordem de auditoria recomendada:

1. Construir/implantar pontos de entrada: `main.go`, `cmd/*`, Dockerfiles, manifestos Kubernetes, unidades systemd, fluxos de trabalho CI.
2. Conjunto de ferramentas Go e política de dependência: versão Go, módulos, `go.mod/go.sum`, configurações de proxy/sumdb, uso de govulncheck.
3. Gerenciamento de segredos e carregamento de configuração (env, arquivos, armazenamentos secretos) + padrões de registro.
4. Configuração do servidor HTTP (tempo limite, limites de corpo, confiança de proxy, cabeçalhos de segurança).
5. Limites AuthN/AuthZ, configuração de sessão/cookie

gs, validação de token. 6. Proteções CSRF para endpoints de mudança de estado autenticados por cookie. 7. Uso de modelo e codificação de saída (XSS) e qualquer comportamento de “renderização de modelo a partir de string” (SSTI). 8. Manipulação de arquivos (uploads/downloads/travessia de caminho/arquivos temporários), serviço de arquivos estáticos. 9. Coletores de injeção: SQL, execução de comandos do sistema operacional, SSRF/busca de saída, redirecionamentos abertos. 10. Simultaneidade/esgotamento de recursos (goroutines/filas ilimitadas, tempos limite/conte ausentes

xts). 11. Uso de `unsafe` / `cgo` / `reflect` em caminhos sensíveis à segurança. 12. Exposição de endpoints de depuração/diagnóstico (pprof/expvar/metrics). 13. Uso de criptografia (aleatoriedade, hash de senha).

---

## 2) Definições e orientações de revisão

### 2.1 Entrada não confiável (tratada como controlada pelo invasor, salvo prova em contrário)

Os exemplos incluem:

- Campos `*http.Request`: `r.URL.Path`, `r.URL.RawQuery`, `r.Form`, `r.PostForm`, cabeçalhos, cookies, `r.Body`
- Parâmetros de caminho de roteadores (incluindo valores extraídos de caminhos de URL)
- Corpos JSON/XML/YAML, partes de formulário multipartes, arquivos carregados
- Quaisquer dados de sistemas externos (webhooks, APIs de terceiros, filas de mensagens)
- Qualquer conteúdo de usuário persistente (linhas de banco de dados) originado de usuários
- Valores de configuração que podem ser influenciados pelo invasor em s

Algumas implantações (cabeçalhos definidos por proxies upstream, variáveis ​​de ambiente em sistemas multilocatários)

### 2.2 Solicitação de mudança de estado

Uma solicitação muda de estado se puder criar/atualizar/excluir dados, alterar o estado de autenticação/sessão, acionar efeitos colaterais (compra, envio de e-mail, envio de webhook) ou iniciar ações privilegiadas.

### 2.3 Formato de descoberta de auditoria necessário

Para cada problema encontrado, produza:

- ID da regra:
- Gravidade: Crítica / Alta / Média / Baixa
- Localização: caminho do arquivo + nome da função/manipulador + linha(s)
- Evidência: o trecho de código/configuração exato
- Impacto: o que pode dar errado, quem pode explorar
- Correção: mudança segura (prefira diferença mínima)
- Mitigação: defesa profunda se a solução imediata for difícil
- Notas de falsos positivos: o que verificar em caso de incerteza (configurações de borda, comportamento de proxy, suposições de autenticação)

---

## 3) Linha de base segura: configuração mínima de produção (DEVE em produção)

Esta é a menor “linha de base de produção” que evita configurações incorretas comuns do Go.

### 3.1 Conjunto de ferramentas, patches e higiene de dependências (OBRIGATÓRIO)

- DEVE executar uma versão principal do Go suportada e manter os lançamentos de patch mais recentes.
- DEVE tratar os lançamentos de patches da biblioteca padrão Go como relevantes para a segurança (muitas correções de segurança chegam a componentes stdlib como `net/http`, `crypto/*`, pacotes de análise).
- DEVE usar módulos Go com `go.mod` e `go.sum` comprometidos.
- NÃO DEVE desabilitar mecanismos de autenticidade de módulos para módulos públicos (BD de soma de verificação), a menos que você tenha uma substituição controlada e documentada.
- DEVE correr

`govulncheck` (varredura de origem e/ou varredura binária) em CI e descobertas de endereço.

### 3.2 Linha de base do servidor HTTP (OBRIGATÓRIA para serviços voltados à rede)

Se o programa servir HTTP (diretamente ou através de um framework construído em `net/http`):

- DEVE configurar um `http.Server` com tempos limite e limites de cabeçalho explícitos.
- DEVE definir limites de tamanho do corpo da solicitação (global e por rota, conforme necessário).
- DEVE evitar expor publicamente os endpoints de diagnóstico (pprof/expvar).
- DEVE definir um conjunto consistente de cabeçalhos de segurança (ou verificar se eles estão definidos na borda).
- DEVE definir atributos de segurança de cookies para quaisquer cookies que você emitir.
- DEVE implementar limites de taxa e controles de abuso para autenticação e endpoints caros

S.

Esqueleto de linha de base ilustrativo (ajuste ao seu projeto):

- Crie um mux dedicado (evite padrões globais implícitos, a menos que sejam gerenciados intencionalmente).
- Envolva manipuladores com: tratamento de erros seguro contra pânico, ID de solicitação, registro, autenticação e limites.

---

## 4) Regras (geração + auditoria)

Cada regra contém: práticas necessárias, padrões inseguros, dicas de detecção e correção.

### GO-DEPLOY-001: Mantenha o conjunto de ferramentas Go e a biblioteca padrão atualizados (lançamentos de segurança)

Gravidade: Média

NOTA: A atualização das dependências e da versão principal do Go pode interromper os projetos de maneiras inesperadas. Concentre-se apenas nas dependências críticas de segurança e, se for notado, informe o usuário em vez de atualizar automaticamente.

Obrigatório:

- DEVE executar uma versão principal Go suportada e aplicar versões de patch imediatamente.
- DEVE tratar os lançamentos de patches como relevantes para a segurança, mesmo que o código do seu aplicativo não tenha mudado.

Padrões inseguros:

- Compilações de produção fixadas em versões antigas do Go sem um processo de patch.
- Imagens Docker como `golang:1.xx` ou imagens base personalizadas que não são atualizadas regularmente.
- Pipelines de CI que suprimem intencionalmente as atualizações do Go.

Dicas de detecção:

- Inspecione CI (`.github/workflows`, `gitlab-ci.yml`, etc.) para `go-version:` ou configuração do conjunto de ferramentas.
- Inspecione os Dockerfiles em busca de tags `FROM golang:`.
- Inspecione a diretiva `go.mod` `go` e qualquer fixação do conjunto de ferramentas.

Correção:

- Atualize para o patch mais recente de uma versão Go compatível.
- Adicione uma verificação automática (CI) que falha quando Go está abaixo do mínimo aprovado.

Notas:

- Go publica versões secundárias regulares que frequentemente incluem correções de segurança em pacotes de bibliotecas padrão.

---

### GO-SUPPLY-001: A autenticidade do módulo Go NÃO DEVE ser desativada para dependências públicas

Gravidade: Alta

Obrigatório:

- DEVE manter a verificação da soma de verificação do módulo habilitada para módulos públicos.
- DEVE confirmar `go.sum` e tratar as alterações como sensíveis à segurança.
- NÃO DEVE usar configurações de busca de módulos inseguros para módulos públicos.
- PODE configurar o comportamento do módulo privado usando `GOPRIVATE`/`GONOSUMDB` para repositórios privados, mas deve fazê-lo de forma restrita e intencional.

Padrões inseguros:

- `GOSUMDB=off` em ambientes de construção de CI ou produção para módulos públicos.
- `GONOSUMDB=*` ou padrões excessivamente amplos que desabilitam efetivamente a verificação.
- `GOINSECURE=*` ou padrões amplos `GOINSECURE` para módulos públicos.
- `GOPROXY=direct` em todos os lugares sem uma política clara.

Dicas de detecção:

- Pesquise configurações de compilação para `GOSUMDB`, `GONOSUMDB`, `GOINSECURE`, `GOPROXY`, `GOPRIVATE`.
- Procure documentação/scripts que recomendem desabilitar o checksum DB “para fazer as compilações funcionarem”.

Correção:

- Restaurar padrões para verificação de módulo público.
- Para módulos privados:
  - Defina `GOPRIVATE=seu.domínio.privado/*`
  - Configure um proxy interno ou busca direta e restrinja `GONOSUMDB` apenas a padrões privados.

Notas:

- Desativar a verificação da soma de verificação remove uma importante camada de integridade contra a entrega upstream direcionada ou comprometida.

---

### GO-CONFIG-001: Os segredos devem ser externalizados e nunca registrados ou confirmados

Gravidade: Alta (Crítica se as credenciais forem confirmadas)

Obrigatório:

- DEVE carregar segredos de variáveis ​​de ambiente, gerenciadores de segredos ou arquivos de configuração seguros com permissões restritas.
- NÃO DEVE codificar segredos no código-fonte Go, testar acessórios que podem atingir a produção ou construir argumentos.
- NÃO DEVE registrar segredos ou cadeias de conexão completas com credenciais.
- DEVE falhar no fechamento da produção se os segredos necessários estiverem faltando.

Padrões inseguros:

- Constantes de string contendo tokens/chaves/senhas.
- Arquivos `.env` ou arquivos de configuração com segredos comprometidos com o repo.
- Registrar `os.Environ()`, despejar configurações completas ou imprimir DSNs.

Dicas de detecção:

- Procure por literais suspeitos (`API_KEY`, `SECRET`, `PASSWORD`, `Autorização:`).
- Inspecione os carregadores de configuração e as instruções de registro.
- Inspecione logs de CI ou depure caminhos de impressão.

Consertar:

- Mova segredos para um armazenamento secreto/variáveis ​​de ambiente.
- Edite campos confidenciais em logs.
- Adicione verificação secreta ao CI e pré-confirme.

---

### GO-HTTP-001: Servidores HTTP DEVEM definir tempos limites e MaxHeaderBytes

Gravidade: Alta (risco de DoS)

Obrigatório:

- DEVE definir: `ReadHeaderTimeout` e DEVE definir `ReadTimeout`, `WriteTimeout`, `IdleTimeout` conforme apropriado para o serviço.
- DEVE definir `MaxHeaderBytes` para um limite justificado para sua aplicação.
- NÃO DEVE confiar em valores zero padrão para tempos limite na produção de servidores voltados para a Internet.

Padrões inseguros:

- `http.ListenAndServe(":8080", handler)` com um `http.Server` padrão (sem tempos limites explícitos).
- `&http.Server{}` com tempos limite deixados em zero.
- Falta `MaxHeaderBytes`.

Dicas de detecção:

- Procure por `http.ListenAndServe(`, `ListenAndServeTLS(`, `Server{` e inspecione os campos configurados.
- Verifique se há proxies reversos; mesmo com um proxy, os tempos limite no nível do aplicativo ainda são importantes.

Correção:

- Use `http.Server{ReadHeaderTimeout: ..., ReadTimeout: ..., WriteTimeout: ..., IdleTimeout: ..., MaxHeaderBytes: ...}`.
- Calibrar tempos limite por tipo de endpoint (streaming vs APIs JSON).

Notas:

- Net/http documenta que esses timeouts existem e que valores zero/negativos significam “sem timeout”; os serviços de produção devem escolher valores explícitos.

---

### GO-HTTP-002: O corpo da solicitação e a análise multipart DEVEM ser limitados por tamanho

Gravidade: Média (risco de DoS; pode ser alta para aplicativos com upload intenso)

Obrigatório:

- DEVE impor um tamanho máximo global do corpo da solicitação para endpoints que aceitam corpos.
- DEVE impor limites estritos de multipart upload e evitar a análise ilimitada de formulários.
- DEVE impor limites por rota quando alguns terminais precisam legitimamente de corpos maiores.
- DEVE definir limites upstream (proxy) como defesa profunda.

Padrões inseguros:

- Lendo `r.Body` com `io.ReadAll(r.Body)` sem limite de tamanho.
- Chamar `r.ParseMultipartForm(...)` com limites excessivamente grandes (ou esquecer os controles de tamanho).
- Aceitar uploads de arquivos sem limites de tamanho do arquivo, número de partes ou tamanho total do corpo.

Dicas de detecção:

- Procure por `io.ReadAll(r.Body)`, `json.NewDecoder(r.Body)`, `ParseMultipartForm`, `FormFile`, `multipart`.
- Procure por `http.MaxBytesReader` ausente ou limitação equivalente por manipulador.
- Procure endpoints de “upload” e verifique os limites.

Consertar:

- Envolva os corpos da solicitação com `http.MaxBytesReader(w, r.Body, maxBytes)` antes de analisar.
- Para multipartes, defina limites conservadores e valide explicitamente os tamanhos dos arquivos/contagens de peças.
- Defina limites de proxy (por exemplo, no ingresso), além dos limites do aplicativo.

Notas:

- Existem classes de vulnerabilidade conhecidas e avisos relacionados ao consumo excessivo de recursos na análise multipart/formulário; trate a análise ilimitada como um problema de segurança.

---

### GO-DEPLOY-002: Endpoints de diagnóstico (pprof/expvar/metrics) NÃO DEVEM ser expostos publicamente

Gravidade: Alta

NOTA: Isso se aplica apenas a configurações de produção. Esses endpoints são frequentemente usados ​​para endpoints de depuração ou desenvolvimento. Se encontrado, confirme se ele seria acessível a partir da implantação de produção real.

Obrigatório:

- NÃO DEVE expor manipuladores `net/http/pprof` em um ouvinte público voltado para a Internet sem fortes controles de acesso.
- DEVE executar diagnósticos em um ouvinte separado somente interno (loopback/somente VPC) e exigir autenticação.
- DEVE revisar o que os endpoints de diagnóstico revelam (rastreamentos de pilha, memória, linhas de comando, ambiente, URLs internos).

Padrões inseguros:

- Importação de efeito colateral `import _ "net/http/pprof"` em um binário de servidor com um mux público.
- `/debug/pprof/*` acessível sem autenticação.
- `/debug/vars` (expvar) acessível sem autenticação.

Dicas de detecção:

- Pesquise importações `net/http/pprof` (incluindo importações em branco).
- Procure por prefixos de rota `/debug/pprof`, `/debug/vars`.
- Verifique se `http.DefaultServeMux` é usado e se algum manipulador de depuração é registrado globalmente.

Consertar:

- Remova diagnósticos de compilações de produção ou vincule-os a um ouvinte somente interno.
- Adicione autenticação/autorização forte (e, de preferência, restrições no nível da rede).

Notas:

- pprof normalmente é importado por seu efeito colateral de registrar manipuladores HTTP em `/debug/pprof/`.

---

### GO-HTTP-003: O proxy reverso e a confiança do cabeçalho encaminhado DEVEM ser explícitos

Gravidade: alta (autenticação, geração de URL, correção de registro/auditoria)

Obrigatório:

- Se estiver atrás de um proxy reverso, DEVE definir qual proxy é confiável e como o IP/esquema/host do cliente é derivado.
- NÃO DEVE confiar em `X-Forwarded-For`, `X-Forwarded-Proto`, `Forwarded` ou cabeçalhos semelhantes da Internet aberta.
- DEVE garantir que a lógica de “cookies seguros”, os redirecionamentos e a geração absoluta de URL não dependam de cabeçalhos falsificáveis.

Padrões inseguros:

- Usando `r.Header.Get("X-Forwarded-For")` como IP do cliente sem validar o limite do proxy.
- Derivando “is HTTPS” de `X-Forwarded-Proto` sem confirmar que veio de um proxy confiável.
- Uso de valores `Host` encaminhados para links de redefinição de senha sem lista de permissões.

Dicas de detecção:

- Procure por `X-Forwarded-For`, `X-Forwarded-Proto`, `Forwarded`, `Real-IP` e quaisquer auxiliares personalizados de “IP do cliente”.
- Inspecione configurações de entrada/proxy; se não estiver visível, marque como “verificar na borda”.

Consertar:

- Imponha a confiança do proxy na borda e no aplicativo:
  - Aceite cabeçalhos encaminhados apenas de intervalos de IP de proxy conhecidos.
  - Prefira mecanismos fornecidos pela plataforma, quando disponíveis.
- Se estiver gerando links externos, use uma origem canônica configurada na lista de permissões (não o cabeçalho Host da solicitação).

---

### GO-HTTP-004: Os cabeçalhos de segurança DEVEM ser definidos (no aplicativo ou na borda)

Gravidade: Média

Obrigatório (navegadores típicos de exibição de aplicativos da web):

- DEVE definir:
  - `Content-Security-Policy` (CSP) apropriada ao aplicativo. NOTA: É muito importante definir o script-src do CSP. Todas as outras directivas não são tão importantes e geralmente podem ser excluídas para facilitar o desenvolvimento.
  - `X-Content-Type-Options: nosniff`
  - Proteção contra clickjacking (`X-Frame-Options` e/ou CSP `frame-ancestors`)
  - `Referrer-Policy` e `Permissions-Policy` quando apropriado
- DEVE garantir que os cookies tenham atributos seguros

butes (ver GO-HTTP-005).

NOTA:

- Esses cabeçalhos podem ser configurados via proxy reverso/CDN; se não estiver visível no código do aplicativo, relate como “verificar na borda”.

Padrões inseguros:

- Nenhum cabeçalho de segurança em qualquer lugar (aplicativo ou borda) para um aplicativo voltado para o navegador.
- CSP ausente para aplicativos que renderizam conteúdo não confiável.

Dicas de detecção:

- Procure por cabeçalhos de configuração de middleware: `w.Header().Set("Content-Security-Policy", ...)`, etc.
- Pesquise a configuração do proxy reverso que define os cabeçalhos.

Consertar:

- Adicione middleware de cabeçalho centralizado em Go ou configure na borda.
- Mantenha o CSP realista; evite `unsafe-inline` sempre que possível.

---

### GO-HTTP-005: Os cookies DEVEM usar atributos seguros na produção

Gravidade: Média

Obrigatório (produção, HTTPS):

- DEVE definir `Secure` em cookies que carregam estado de autenticação/sessão. NOTA IMPORTANTE: Defina `Secure` apenas no ambiente de produção quando o TLS estiver configurado. Ao executar em um ambiente de desenvolvimento local via HTTP, não defina a propriedade `Secure` nos cookies. Você deve fazer isso condicionalmente com base no fato de o aplicativo estar sendo executado no modo de produção. Você também deve incluir uma propriedade como `SESSION_COOKIE_SECURE` que pode ser usada para desabilitar cookies `Secure` ao testar

HTTP.

- DEVE definir `HttpOnly` em cookies de autenticação/sessão.
- DEVE definir `SameSite=Lax` por padrão (ou `Strict` se compatível), e usar `None` apenas quando necessário (e somente com `Secure`).
- DEVE definir tempos de vida limitados (`Max-Age`/`Expires`) apropriados para o aplicativo.

Padrões inseguros:

- Configuração de cookies de autenticação/sessão sem `Secure` em implantações HTTPS.
- Cookies sem `HttpOnly` para identificadores de sessão.
- `SameSite=None` para aplicativos autenticados por cookies sem uma forte estratégia de CSRF.

Dicas de detecção:

- Procure por `http.SetCookie`, `&http.Cookie{`, `Set-Cookie`.
- Inspecione sinalizadores de cookies no código de autenticação/sessão.

Correção:

- Defina os campos corretos em `http.Cookie` e centralize a criação de cookies.

Notas:

- SameSite é uma defesa profunda e não substitui as proteções CSRF para aplicativos de autenticação de cookies.

---

### GO-HTTP-006: Endpoints de mudança de estado autenticados por cookie DEVEM ser protegidos por CSRF

Gravidade: Alta

- NOTA IMPORTANTE: Se os cookies não forem usados para autenticação (por exemplo, token de portador puro no cabeçalho de autorização sem cookies de ambiente), o CSRF não será um risco para esses terminais.

Obrigatório:

- DEVE proteger todos os endpoints que mudam de estado (POST/PUT/PATCH/DELETE) que dependem de cookies para autenticação.
- DEVE usar uma biblioteca/middleware CSRF bem testado em vez de criar o seu próprio.
- PODE usar defesas adicionais (verificações de origem/referenciador, busca de metadados, cookies SameSite), mas os tokens continuam sendo a principal defesa para aplicativos autenticados por cookies.
  Se os tokens forem impraticáveis ​​ou para aplicações pequenas:

* DEVE, no mínimo, exigir que um cabeçalho personalizado seja definido e definir o cookie de sessão SESSION_COOKIE_SAMESITE=lax, pois este é o método mais forte, além de exigir um token de formulário, e pode ser muito mais fácil de implementar.

Padrões inseguros:

- Endpoints JSON autenticados por cookie que mudam de estado sem verificações de CSRF.
- Usando GET para ações de mudança de estado.

Dicas de detecção:

- Enumere todas as rotas não GET e identifique o mecanismo de autenticação.
- Procure uso de middleware CSRF; se ausente, trate como suspeito em aplicativos voltados para navegador.

Correção:

- Adicione middleware CSRF e garanta que ele cubra todas as rotas de mudança de estado.
- Se o serviço for uma API destinada a clientes não navegadores, evite autenticação por cookie; use cabeçalhos de autorização.

---

### GO-HTTP-007: CORS deve ser explícito e com menos privilégios

Gravidade: Média (alta se as credenciais estiverem configuradas incorretamente)

Obrigatório:

- Se o CORS não for necessário, DEVE mantê-lo desativado.
- Se o CORS for necessário:
  - DEVE incluir origens confiáveis na lista de permissões (não refletir origens arbitrárias)
  - DEVE ter cuidado com solicitações credenciadas; não combine origens amplas com cookies
  - DEVE restringir métodos/cabeçalhos permitidos

Padrões inseguros:

- `Access-Control-Allow-Origin: *` emparelhado com cookies (`Access-Control-Allow-Credentials: true`).
- Refletindo `Origem` sem validação.

Dicas de detecção:

- Pesquise a configuração do cabeçalho `Access-Control-Allow-`.
- Procure a configuração do middleware CORS.

Correção:

- Implementar listas de permissões de origem rigorosas e métodos/cabeçalhos mínimos.
- Certifique-se de que os pontos de extremidade de autenticação de cookie não sejam expostos de origem cruzada, a menos que seja necessário.

---

### GO-XSS-001: Use html/template e evite ignorar o escape automático com dados não confiáveis

Gravidade: Alta

Obrigatório:

- DEVE usar `html/template` para renderização HTML (não `text/template`).
- NÃO DEVE converter dados não confiáveis ​​em tipos de modelos “confiáveis” (`template.HTML`, `template.JS`, `template.URL`, etc.).
- DEVE manter os templates estáticos e controlados pelos desenvolvedores; trate modelos dinâmicos como de alto risco.
- NÃO DEVE veicular HTML/JS carregado pelo usuário como conteúdo ativo, a menos que seja explicitamente pretendido e colocado em sandbox com segurança.

Padrões inseguros:

- `text/template` usado para gerar HTML.
- Usando `template.HTML(userInput)` ou wrappers de tipo semelhante.
- Escrever diretamente conteúdo de usuário sem escape em respostas HTML.

Dicas de detecção:

- Procure por `text/template`, `template.New(...).Parse(...)` e wrappers digitados como `template.HTML(`.
- Inspecione manipuladores que retornam HTML com concatenação de strings.

Correção:

- Use `html/template` e passe dados não confiáveis ​​como dados, não como marcação.
- Se você precisar permitir HTML limitado, use um desinfetante de HTML aprovado e ainda tenha cuidado com atributos/URLs.

---

### GO-SSTI-001: Nunca analise/execute modelos de entrada não confiável (SSTI)

Gravidade: Crítica

Obrigatório:

- NÃO DEVE chamar `template.Parse` / `template.ParseFiles` / `template.New(...).Parse(...)` no texto do modelo influenciado por entrada não confiável.
- DEVE tratar “modelos definidos pelo usuário” como um design especial de alto risco:
  - DEVE usar sandbox pesado e listas de permissões rigorosas
  - DEVE isolar a execução (limite do processo/contêiner) se for realmente necessário

Padrões inseguros:

- `tmpl := template.Must(template.New("x").Parse(r.FormValue("tmpl")))`
- Ler modelos de uploads/entradas de banco de dados e executá-los no mesmo domínio confiável do código do servidor.

Dicas de detecção:

- Pesquise `.Parse(` e rastreie a origem da string do modelo.
- Procure por “modelos de e-mail personalizados”, “modelos de temas de usuário”, etc.

Correção:

- Substitua por mecanismos de substituição seguros (sem execução de código).
- Se os modelos precisarem ser controlados pelo usuário, isole e coloque em sandbox agressivamente.

---

### GO-PATH-001: Impede a passagem de caminho e o fornecimento inseguro de arquivos

Gravidade: Alta

Obrigatório:

- NÃO DEVE passar caminhos controlados pelo usuário para `os.Open`, `os.ReadFile`, `http.ServeFile` ou `http.FileServer` sem validação estrita e aplicação de diretório base.
- DEVE tratar `..`, caminhos absolutos e truques de caminho específicos do sistema operacional como entrada hostil.
- DEVE armazenar uploads de usuários fora de qualquer raiz estática da web; servir através de manipuladores controlados.
- DEVE evitar a listagem de diretórios para árvores de arquivos confidenciais.

Padrões inseguros:

- `http.ServeFile(w, r, r.URL.Query().Get("caminho"))`
- `os.Open(filepath.Join(baseDir, userPath))` sem verificar se o resultado permanece em `baseDir`
- `http.FileServer(http.Dir("."))` servindo a raiz do projeto ou diretórios graváveis pelo usuário

Dicas de detecção:

- Procure por `ServeFile(`, `FileServer(`, `http.Dir(`, `os.Open(`, `ReadFile(`, `filepath.Join(`.
- Rastreie se os componentes do caminho vêm da solicitação/banco de dados.

Correção:

- Use uma lista de identificadores de arquivos (por exemplo, IDs de banco de dados) mapeados para caminhos do lado do servidor.
- Aplicar a contenção do diretório base após a limpeza e adesão.
- Servir formatos ativos como downloads (`Disposição de conteúdo: anexo`), a menos que seja explicitamente pretendido.

---

### GO-UPLOAD-001: Os uploads de arquivos devem ser validados, armazenados com segurança e servidos com segurança

Gravidade: Alta

Obrigatório:

- DEVE impor limites de tamanho de upload (aplicativo + borda).
- DEVE validar o tipo de arquivo usando listas de permissões e verificações de conteúdo (não apenas extensões).
- DEVE armazenar uploads fora de raízes executáveis/estáticas quando possível.
- DEVE gerar nomes de arquivos do lado do servidor (IDs aleatórios) e evitar confiar em nomes originais.
- DEVE servir formatos potencialmente ativos com segurança (download de anexo), a menos que seja explicitamente pretendido.

Padrões inseguros:

- Aceitar tipos de arquivos arbitrários e servi-los de volta in-line.
- Usando o nome de arquivo fornecido pelo usuário como caminho de armazenamento.
- Falta de validação de tamanho/tipo.

Dicas de detecção:

- Procure por `multipart`, `FormFile`, `ParseMultipartForm`, `io.Copy` no disco.
- Verifique onde os arquivos estão armazenados e como são servidos.

Correção:

- Implementar validação de lista de permissões + armazenamento seguro + veiculação segura.
- Adicione fluxos de trabalho de digitalização/quarentena quando aplicável.

---

### GO-INJECT-001: Impedir injeção de SQL (consultas parametrizadas/ORM)

Gravidade: Alta

Obrigatório:

- DEVE usar consultas parametrizadas ou um ORM que parametrize nos bastidores.
- NÃO DEVE construir SQL por concatenação de strings / `fmt.Sprintf` / interpolação de strings com entrada não confiável.

Padrões inseguros:

- `fmt.Sprintf("SELECIONE ... WHERE id=%s", r.URL.Query().Get("id"))`
- `query := "ATUALIZAR usuários SET role='" + role + "' WHERE id=" + id`

Dicas de detecção:

- Grep para `SELECT`, `INSERT`, `UPDATE`, `DELETE` e verifique como as strings de consulta são construídas.
- Rastreie dados não confiáveis em `db.Query`, `db.Exec`, `QueryRow`, etc.

Correção:

- Substitua por espaços reservados (`?`, `$1`, etc.) e passe os parâmetros separadamente.
- Valide e verifique os IDs antes de usar.

---

### GO-INJECT-002: Evita injeção de comandos do SO; evite gastar com informações não confiáveis

Gravidade: Crítica a Alta (depende da exposição)

Obrigatório:

- DEVE evitar executar comandos externos com strings controladas pelo invasor.
- Se o subprocesso for necessário:
  - DEVE usar `exec.CommandContext` com uma lista de argumentos (não `sh -c`).
  - NÃO DEVE passar entradas não confiáveis ​​para um shell (`bash -c`, `sh -c`, PowerShell).
  - DEVE usar listas de permissões estritas para qualquer componente variável (subcomando, sinalizadores, nomes de arquivos).
- DEVE assumir que as ferramentas CLI podem interpretar argumentos controlados pelo invasor como sinalizadores ou valores especiais.

Padrões inseguros:

- `exec.Command("sh", "-c", userString)`
- `exec.Command("bash", "-c", fmt.Sprintf("ferramenta %s", usuário))`
- Chamar o shell para obter expansão glob para globs fornecidos pelo usuário.

Dicas de detecção:

- Procure por `os/exec`, `exec.Command(`, `CommandContext(`, `"sh"`, `"bash"`, `"-c"`.
- Rastreie entradas não confiáveis no nome/args do comando.

Correção:

- Use APIs de biblioteca em vez de subprocessos.
- Comando hardcode e lista de permissões/validação de argumentos.
- Se uma concha for inevitável, escape com robustez e trate como de alto risco (prefira evitar).

Notas:

- O pacote Go `os/exec` invoca intencionalmente um shell; a introdução de `sh -c` reintroduz os riscos de injeção de shell.

---

### GO-SSRF-001: Impedir SSRF em solicitações HTTP de saída

Gravidade: Média (alta em ambientes de nuvem/LAN)

- Nota: Para projetos pequenos e independentes, isso é menos importante. É mais importante ao implantar em uma LAN ou com outros serviços escutando no mesmo servidor.

Obrigatório:

- DEVE tratar as solicitações de saída para URLs fornecidos pelo usuário como de alto risco.
- DEVE listar hosts/domínios para qualquer busca de URL influenciada pelo usuário.
- DEVE bloquear o acesso a locaishost/intervalos de IP privados/endereços locais de link e endpoints de metadados em nuvem.
- DEVE restringir esquemas a `http`/`https` (sem `file:`, `gopher:`, etc.).
- DEVE definir tempos limite do cliente e restringir redirecionamentos.

Padrões inseguros:

- `http.Get(r.URL.Query().Get("url"))`
- Endpoints de “visualização de URL” / “teste de webhook” que buscam URLs arbitrários.

Dicas de detecção:

- Procure por valores `http.Get`, `client.Do` e URL derivados de solicitações/banco de dados.
- Identifique recursos que buscam recursos remotos.

Consertar:

- Analise URLs estritamente; impor esquema e nomes de host na lista de permissões.
- Resolva o DNS e aplique restrições de intervalo de IP (com cuidado com a religação do DNS).
- Defina tempos limite, desative redirecionamentos, a menos que seja necessário, e limite os tamanhos de resposta.

---

### GO-HTTPCLIENT-001: Os clientes HTTP de saída DEVEM definir tempos limite e fechar corpos

Gravidade: Alta (DoS e esgotamento de recursos)

Obrigatório:

- DEVE definir um tempo limite geral para o uso de `http.Client` (ou prazos equivalentes por solicitação via contexto + tempos limite de transporte).
- DEVE garantir que `resp.Body.Close()` seja chamado para todas as solicitações bem-sucedidas (normalmente `defer resp.Body.Close()` imediatamente após a verificação de erro).
- DEVE limitar as leituras do corpo da resposta (não faça respostas ilimitadas `io.ReadAll`).
- DEVE restringir redirecionamentos para buscas sensíveis à segurança (SSRF, fluxos de autenticação).

Padrões inseguros:

- Usando `http.DefaultClient` / `http.Get` para destinos influenciados pelo usuário sem política de tempo limite.
- Falta `defer resp.Body.Close()` levando a vazamentos de recursos.
- `io.ReadAll(resp.Body)` sem limite.

Dicas de detecção:

- Procure por `http.Get(`, `http.Post(`, `client := &http.Client{}` sem `Timeout`, `client.Do(` e fechamentos ausentes.
- Procure por `io.ReadAll(resp.Body)`.

Correção:

- Utilize um cliente configurado com timeouts.
- Sempre feche os órgãos de resposta.
- Use leitores limitados (`io.LimitReader`) para respostas grandes/não confiáveis.

Notas:

- O pacote net/http expõe `DefaultClient` como um `http.Client` de valor zero, o que pode facilmente levar a um comportamento “sem tempo limite”, a menos que seja configurado.

---

### GO-REDIRECT-001: Impedir redirecionamentos abertos

Gravidade: Média (pode ser Alta com fluxos de autenticação)

Obrigatório:

- DEVE validar alvos de redirecionamento derivados de entradas não confiáveis ​​(`next`, `redirect`, `return_to`).
- DEVE preferir apenas caminhos relativos do mesmo site.
- DEVE voltar a um padrão seguro em caso de falha na validação.

Padrões inseguros:

- `http.Redirect(w, r, r.URL.Query().Get("next"), http.StatusFound)` sem validação.

Dicas de detecção:

- Procure por `http.Redirect(` e verifique a origem do local.

Correção:

- Permitir caminhos internos ou domínios conhecidos.
- Rejeite URLs absolutos, a menos que sejam explicitamente necessários e permitidos.

---

### GO-CRYPTO-001: A aleatoriedade criptográfica DEVE vir de criptografia/rand

Gravidade: alta (crítica se usada para tokens ou chaves de autenticação/sessão)

Obrigatório:

- DEVE usar `crypto/rand` para:
  - IDs de sessão, tokens de redefinição de senha, chaves de API, tokens CSRF, nonces
  - chaves de criptografia, chaves de assinatura, sais quando necessário
- NÃO DEVE usar `math/rand` para qualquer valor sensível à segurança.
- DEVE usar ajudantes integrados que produzam tokens adequadamente fortes, quando disponíveis.

Padrões inseguros:

- `math/rand.Seed(time.Now().UnixNano())` seguido de geração de token para autenticação ou sessões.
- Usando construções do tipo UUIDv4 construídas a partir de `math/rand`.

Dicas de detecção:

- Pesquise `math/rand`, `rand.Seed`, `rand.Intn` no código que aborda fluxos de autenticação/sessão/token.
- Procure geradores de tokens personalizados.

Correção:

- Mude para `crypto/rand` (`rand.Reader`, `rand.Read` ou auxiliares de token seguro).
- Garanta entropia suficiente e use codificação segura para URL.

Notas:

- O pacote crypto/rand fornece APIs de aleatoriedade seguras e auxiliares de geração de tokens.

---

### GO-AUTH-001: O armazenamento de senha DEVE usar hashing adaptativo (bcrypt/argon2id) e comparações seguras

Gravidade: Alta

Obrigatório:

- DEVE fazer hash de senhas usando uma função de hashing de senha adaptável (bcrypt ou argon2id).
- NÃO DEVE armazenar senhas em texto simples ou criptografia reversível de senhas.
- DEVE comparar segredos em tempo constante quando relevante (tokens, MACs, chaves de API) para reduzir vazamentos de tempo.
- DEVE garantir que as políticas de senha não excedam as restrições do algoritmo (por exemplo, o bcrypt tem limites de comprimento de entrada; lide com senhas longas de forma adequada).

Padrões inseguros:

- `sha256(password)` armazenado como hash de senha.
- Armazenamento de senha em texto simples.
- Comparando segredos com `==` em contextos sensíveis ao tempo.

Dicas de detecção:

- Procure por `sha1`, `sha256`, `md5` usados em senhas.
- Procure por uso de `bcrypt`/`argon2`; se ausente, suspeito.
- Pesquise comparações `==` em tokens/chaves de API.

Consertar:

- Use `bcrypt.GenerateFromPassword` / `CompareHashAndPassword` ou argon2id com parâmetros recomendados.
- Use auxiliares de comparação em tempo constante ao comparar MACs/tokens.

Notas:

- Go fornece bcrypt em `golang.org/x/crypto/bcrypt` e comparações de tempo constante em `crypto/subtle`.

---

### GO-CONC-001: Corridas de dados e riscos de simultaneidade DEVEM ser tratados como relevantes para a segurança

Gravidade: Média a Alta (depende do que as raças afetam)

Obrigatório:

- DEVE executar testes com o detector de corrida (`go test -race`) no CI para serviços sensíveis à segurança.
- DEVE corrigir corridas detectadas; não suprima sem profunda justificativa.
- DEVE tratar o estado mutável compartilhado nos manipuladores como de alto risco; impor a sincronização ou evitar a mutabilidade compartilhada.

Padrões inseguros:

- Mapas/fatias globais mutados de vários goroutines sem mutex.
- Caches ou estado de autenticação/sessão armazenados em globais sem proteção de simultaneidade.
- Acesso fraudulento ao estado de autorização (pode levar a desvios ou aplicação inconsistente).

Dicas de detecção:

- Procure por `var someMap = map[...]...` usado em manipuladores.
- Procure por `sync.Mutex`, `sync.Map`, canais ou outra sincronização ausentes.
- Certifique-se de que o CI inclua `-race` e que execute testes relevantes.

Correção:

- Adicione sincronização ou redesenho adequado para evitar estado mutável compartilhado.
- Adicione testes de corrida e execute-os continuamente.

Notas:

- O detector de corridas Go encontra apenas corridas que ocorrem em caminhos de código executados; melhore a cobertura dos testes e execute cargas de trabalho realistas com `-race` sempre que possível.

---

### GO-UNSAFE-001: O uso de unsafe/cgo DEVE ser minimizado e auditado como código inseguro para memória

Gravidade: Alta (Crítica em caminhos de código de alto risco)

Obrigatório:

- DEVE evitar importar `inseguro` no código do aplicativo, a menos que seja absolutamente necessário.
- Se `inseguro` for usado, DEVE tratá-lo como “segurança de memória manual”, exigindo revisão cuidadosa e cobertura de teste.
- Se `cgo` for usado, DEVE tratar o limite C/C++ como inseguro para memória; aplique práticas de codificação seguras no lado C e isole sempre que possível.

Padrões inseguros:

- Lançamentos generalizados de `unsafe.Pointer` em análise, serialização, autenticação ou código de rede.
- `cgo` usado para análise ou limites de segurança sem sandbox.

Dicas de detecção:

- Procure por `import "inseguro"`, `unsafe.Pointer`, `// #cgo`, `import "C"`.
- Priorize a revisão onde o inseguro toca em informações não confiáveis.

Consertar:

- Substitua o uso inseguro/cgo por alternativas seguras de biblioteca padrão sempre que possível.
- Isole código inseguro em módulos pequenos e bem testados com testes fuzz/race.

Notas:

- O pacote inseguro fornece explicitamente operações que contornam as garantias de segurança do tipo Go.

---

## 5) Heurísticas práticas de varredura (como “caçar”)

Ao digitalizar ativamente, use estes padrões de sinal alto:

Conjunto de ferramentas e dependências:

- `FROM golang:` (Dockerfiles), `go-version:` (CI), `toolchain go` (go.mod), versões antigas fixadas
- `GOSUMDB=off`, `GOINSECURE`, `GONOSUMDB`, `GOPROXY=direct`
- diretivas `replace` em `go.mod` para bifurcações/caminhos
- `govulncheck` ausente no CI

Proteção do servidor HTTP:

- `http.ListenAndServe(`, `ListenAndServeTLS(`, `&http.Server{` com tempos limite ausentes
- `ReadHeaderTimeout: 0`, `ReadTimeout: 0`, `WriteTimeout: 0`, `IdleTimeout: 0`, faltando `MaxHeaderBytes`

Análise de corpo/DoS:

- `io.ReadAll(r.Body)`, `json.NewDecoder(r.Body)` sem limite de tamanho
- `ParseMultipartForm`, `FormFile`, `multipart.NewReader` sem limites explícitos
- Falta `http.MaxBytesReader`

Exposição de depuração:

- `importar _ "net/http/pprof"`
- `/debug/pprof`, `/debug/vars`

Modelos/XSS/SSTI:

- `text/template` usado para saída HTML
- `template.HTML(`, `template.JS(`, `template.URL(` com dados controlados pelo usuário
- `.Parse(` em strings controladas pelo usuário

Arquivos:

- `http.ServeFile(` com caminho do usuário
- `http.FileServer(http.Dir(` apontando para a raiz do repositório ou uploads
- `os.Open(filepath.Join(base, user))` sem verificações de contenção

Injeção:

- Construção SQL com `fmt.Sprintf`, concatenação de strings perto de `db.Query/Exec`
- `exec.Command("sh","-c", ...)`, `exec.Command("bash","-c", ...)`

SSRF/HTTP de saída:

- `http.Get(userURL)`, `client.Do(req)` onde o URL vem da solicitação/DB
- Tempo limite do cliente ausente, `resp.Body.Close()` ausente, `io.ReadAll(resp.Body)` ilimitado

Criptografia:

- `math/rand` na geração de token/sessão
- `InsecureSkipVerify: verdadeiro`
- Hash de senha com `sha256`/`md5` em vez de bcrypt/argon2

Simultaneidade:

- Mapas/fatias compartilhados modificados por manipuladores sem bloqueios
- CI sem `go test -race`

Sempre tente confirmar:

- origem dos dados (não confiável versus confiável)
- tipo de coletor (modelo/SQL/subprocesso/arquivos/http)
- controles de proteção presentes (limites, validação, listas de permissões, middleware, controles de rede)

---

## 6) Fontes (acessado em 28/01/2026)

Documentação primária do Go:

- Política de segurança Go - https://go.dev/doc/security/policy
- Histórico de lançamentos Go (correções de segurança em versões de patch) — https://go.dev/doc/devel/release
- Notas de versão do Go 1.25 — https://go.dev/doc/go1.25
- net/http (tempo limite do servidor, MaxHeaderBytes, DefaultClient) — https://pkg.go.dev/net/http
- html/template (suposições de escape automático e modelo confiável) — https://pkg.go.dev/html/template
- crypto/tls (padrões MinVersion, aviso InsecureSkipVerify

ngs) — https://pkg.go.dev/crypto/tls

- crypto/rand (aleatoriedade segura, token helpers) — https://pkg.go.dev/crypto/rand
- crypto/subtle (comparações em tempo constante) — https://pkg.go.dev/crypto/subtle
- os/exec (sem shell por padrão; orientação de execução de comando) — https://pkg.go.dev/os/exec
- inseguro (ignora a segurança do tipo) — https://go.dev/src/unsafe/unsafe.go
- net/http/pprof (pontos de extremidade de depuração) — https://pkg.go.dev/net/http/pprof
- cmd/go (módulo de autenticação

nticação via banco de dados go.sum/checksum; env vars como GOINSECURE) - https://pkg.go.dev/cmd/go

- Módulo Mirror e Checksum Database lançados (Go blog) - https://go.dev/blog/module-mirror-launch
- documentação do govulncheck — https://pkg.go.dev/golang.org/x/vuln/cmd/govulncheck
- Documentação do Go Race Detector — https://go.dev/doc/articles/race_detector
- bcrypt (hashing de senha) — https://pkg.go.dev/golang.org/x/crypto/bcrypt
- Vá para entrada de vulnerabilidade e

xample (consumo de recursos multiparte) — https://pkg.go.dev/vuln/GO-2023-1569

Série de folhas de dicas OWASP (segurança geral da web):

- Gerenciamento de sessão — https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html
- Prevenção de CSRF — https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html
- Prevenção SSRF — https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet.html
- Prevenção XSS — https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_C

heat_Sheet.html

- Cabeçalhos de resposta de segurança HTTP — https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Headers_Cheat_Sheet.html
