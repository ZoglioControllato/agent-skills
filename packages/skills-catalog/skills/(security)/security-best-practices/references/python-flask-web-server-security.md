# Flask (Python) Especificação de segurança da Web (Flask 3.1.x, Python 3.x)

Este documento foi concebido como uma **especificação de segurança** que oferece suporte a:

1. **Geração de código seguro por padrão** para novo código Flask.
2. **Revisão de segurança/caça de vulnerabilidades** no código Flask existente (passivo “notificar problemas durante o trabalho” e ativo “verificar o repositório e relatar descobertas”).

Ele é intencionalmente escrito como um conjunto de **requisitos normativos** (“DEVE/DEVE/PODE”) mais **regras de auditoria** (como são os padrões ruins, como detectá-los e como corrigi-los/mitigá-los).

---

## 0) Segurança, limites e restrições antiabuso (DEVE SEGUIR)

- NÃO DEVE solicitar, gerar, registrar ou confirmar segredos (chaves de API, senhas, chaves privadas, cookies de sessão, SECRET_KEY).
- NÃO DEVE “consertar” a segurança desabilitando proteções (por exemplo, desligando CSRF, relaxando CORS, desabilitando escape, desabilitando verificações de autenticação).
- DEVE fornecer **descobertas baseadas em evidências** durante as auditorias: citar caminhos de arquivos, trechos de código e valores de configuração que justifiquem a reivindicação.
- DEVE tratar a incerteza com honestidade: se uma proteção puder extinguir

ist na infraestrutura (proxy reverso, WAF, CDN), relate-o como “não visível no código do aplicativo; verifique em tempo de execução/configuração”.

---

## 1) Modos de operação

### 1.1 Modo de geração (padrão)

Quando solicitado a escrever um novo código Flask ou modificar o código existente:

- DEVE seguir todos os requisitos **DEVE** nesta especificação.
- DEVE seguir todos os requisitos **DEVE**, a menos que o usuário diga explicitamente o contrário.
- DEVE preferir APIs seguras por padrão e bibliotecas comprovadas em vez de código de segurança personalizado.
- DEVE evitar a introdução de novos coletores arriscados (renderização de modelos a partir de strings, execução de shell, importações dinâmicas, redirecionamentos inseguros, exibição de arquivos de usuário como HTML, etc.).

### 1.2 Modo de revisão passiva (sempre ativado durante a edição)

Ao trabalhar em qualquer lugar em um repositório Flask (mesmo que o usuário não tenha solicitado uma verificação de segurança):

- DEVE “notar” violações desta especificação no código tocado/próximo.
- DEVE mencionar os problemas à medida que surgem, com uma breve explicação + solução segura.

### 1.3 Modo de auditoria ativo (solicitação de verificação explícita)

Quando o usuário pede para “verificar”, “auditar” ou “caçar vulnerabilidades”:

- DEVE pesquisar sistematicamente a base de código em busca de violações desta especificação.
- DEVE apresentar os resultados num formato estruturado (ver §2.3).

Ordem de auditoria recomendada:

1. Pontos de entrada de aplicativos/scripts de implantação/Dockerfiles/Procfiles.
2. Configuração do flask e manipulação do ambiente.
3. Autenticação + sessões + cookies.
4. Proteções CSRF e rotas de mudança de estado.
5. Renderização de modelo e XSS/SSTI.
6. Manipulação de arquivos (uploads + downloads) e passagem de caminho.
7. Classes de injeção (SQL, execução de comandos, desserialização insegura).
8. Solicitações de saída (SSRF).
9. Tratamento de redirecionamentos (redirecionamentos abertos).
10. CORS e segurança h

líderes.

---

## 2) Definições e orientações de revisão

### 2.1 Entrada não confiável (tratada como controlada pelo invasor, salvo prova em contrário)

Os exemplos incluem:

- `request.args`, `request.form`, `request.values`
- `request.get_json()`, `request.json`, `request.data`
- `request.headers`, `request.cookies`
- Parâmetros de caminho de URL (por exemplo, `/user/<id>`)
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

Esta é a menor “linha de base de produção” que evita configurações incorretas comuns do Flask.

### 3.1 Padrão de inicialização do aplicativo (DEVE)

DEVE usar uma fábrica de aplicativos e uma configuração baseada no ambiente para que a configuração de produção não seja codificada.

Exemplo de esqueleto (ilustrativo; ajuste ao seu projeto):

- Carregar configuração do ambiente/armazenamento secreto.
- Falha fechada se faltarem configurações críticas na produção.

Principais alvos de configuração de linha de base:

- `SECRET_KEY` definido e não confirmado
- `SESSION_COOKIE_SECURE=True` (quando HTTPS) NOTA IMPORTANTE: Defina `Secure` apenas no ambiente de produção quando o TLS estiver configurado. Ao executar em um ambiente de desenvolvimento local via HTTP, não defina a propriedade `Secure` nos cookies. Você deve fazer isso condicionalmente com base no fato de o aplicativo estar sendo executado no modo de produção. Você também deve incluir uma propriedade como `SESSION_COOKIE_SECURE` que pode ser usada para desabilitar cookies `Secure`

ao testar por HTTP.

- `SESSION_COOKIE_HTTPONLY = Verdadeiro`
- `SESSION_COOKIE_SAMESITE='Lax'` (ou `'Strict'` se compatível)
- `TRUSTED_HOSTS` definido em produção
- Conjunto de cabeçalhos de segurança (CSP, etc.) no aplicativo ou na borda

---

## 4) Regras (geração + auditoria)

Cada regra contém: práticas necessárias, padrões inseguros, dicas de detecção e correção.

### FLASK-DEPLOY-001: Não use o servidor de desenvolvimento do Flask em produção

Gravidade: Alta (se produção)

Obrigatório:

- NÃO DEVE implantar o servidor de desenvolvimento integrado como servidor de produção.
- DEVE ser executado atrás de um servidor WSGI de nível de produção ou plataforma gerenciada (como gunicorn)

Padrões inseguros:

- `app.run(...)` em um ponto de entrada de produção.
- Documentos/scripts de implantação que usam `flask run` na produção.

Dicas de detecção:

- Procure por `app.run(`, `flask run`, `--debug`, `FLASK_DEBUG`, `FLASK_ENV=development`.
- Verifique Docker CMD/ENTRYPOINT, Procfile, unidades systemd, scripts de shell.

Correção:

- Use um servidor WSGI de produção (e mantenha o Flask como objeto do aplicativo).
- Certifique-se de que o servidor de desenvolvimento seja usado apenas para desenvolvimento local.

Nota:

- Geralmente são usados ​​​​no modo de desenvolvimento ou em testes locais. Isso é permitido. Somente sinalizar se estiver claro que ele está sendo usado como ponto de entrada de produção

---

### FLASK-DEPLOY-002: O modo de depuração DEVE ser desabilitado na produção

Gravidade: Crítica

Obrigatório:

- NÃO DEVE ativar o modo de depuração na produção.
- DEVE tratar o depurador interativo como equivalente à execução remota de código, se exposto.

Padrões inseguros:

- `app.run(debug=True)`
- `flask run --debug` em produção.
- `DEBUG=True` via env/config em produção.

Dicas de detecção:

- Procure por `debug=True`, `FLASK_DEBUG=1`, `DEBUG = True`, `app.debug = True`.
- Procure as configurações `TRAP_HTTP_EXCEPTIONS`/debugger habilitadas em contextos que não sejam de teste.

Correção:

- Certifique-se de que a depuração esteja habilitada apenas no desenvolvimento/teste local.
- Prefira alternâncias baseadas no ambiente e padrões seguros.

Observação:

- Geralmente são usados ​​​​no modo de desenvolvimento ou em testes locais. Isso é permitido. Somente sinalizar se estiver claro que ele está sendo usado como ponto de entrada de produção

---

### FLASK-CONFIG-001: SECRET_KEY deve ser forte, secreto e girado com segurança

Gravidade: Alta (Crítica se estiver ausente na produção com sessões ou assinatura)

Obrigatório:

- DEVE definir um `SECRET_KEY` aleatório forte na produção.
- DEVE manter `SECRET_KEY` fora do controle de origem e fora dos logs.
- PODE rodar as chaves periodicamente; PODE usar `SECRET_KEY_FALLBACKS` para suportar a rotação sem invalidar instantaneamente as sessões existentes e, em seguida, remover as chaves antigas após a janela de rotação. Provavelmente isso não é necessário para aplicações menores, mas é uma boa prática para aplicações maiores. Como isso pode complicar a implantação, sugira que seja

implementado em vez de implementá-lo por padrão.

Padrões inseguros:

- Falta `SECRET_KEY` na produção.
- `SECRET_KEY` codificado no repositório (incluindo chaves de teste usadas acidentalmente no produto).
- Registrando ou imprimindo `SECRET_KEY`.

Dicas de detecção:

- Procure por `SECRET_KEY =`, `app.secret_key =`, `SECRET_KEY_FALLBACKS =`.
- Verifique os arquivos `.env` comprometidos com o repositório.
- Verifique os módulos de configuração para constantes.

Consertar:

- Carregar do gerenciador secreto ou variável de ambiente.
- Adicione um processo de rotação:
  - Definir novo `SECRET_KEY`
  - Mantenha as chaves antigas temporariamente em `SECRET_KEY_FALLBACKS`
  - Remova a(s) chave(s) antiga(s) após a janela segura.

Notas:

- Se o aplicativo usa sessões Flask (baseadas em cookies por padrão), `SECRET_KEY` é diretamente crítico para a segurança.

---

### FLASK-SESS-001: Cookies de sessão devem usar atributos seguros na produção

Gravidade: Média

Obrigatório (produção, HTTPS):

- DEVE definir `SESSION_COOKIE_SECURE=True` (cookies apenas em HTTPS). NOTA: Defina `Secure` apenas no ambiente de produção quando o TLS estiver configurado. Ao executar em um ambiente de desenvolvimento local via HTTP, não defina a propriedade `Secure` nos cookies. Você deve fazer isso condicionalmente com base no fato de o aplicativo estar sendo executado no modo de produção. Você também deve incluir uma propriedade como `SESSION_COOKIE_SECURE` que pode ser usada para desabilitar cookies `Secure` ao testar via HTTP.

- DEVE garantir `SESSION_COOKIE_HTTPONLY=True` (proteger do acesso JS).
- DEVE definir `SESSION_COOKIE_SAMESITE='Lax'` (recomendado) ou `'Strict'` se for compatível com UX.
- DEVE manter `SESSION_COOKIE_DOMAIN=None`, a menos que você precise explicitamente de cookies para todo o subdomínio.
- Se você precisar de uso incorporado/iframe de terceiros, PODE considerar `SESSION_COOKIE_PARTITIONED=True` (requer HTTPS).

Padrões inseguros:

- `SESSION_COOKIE_SECURE=False` em produção.
- `SESSION_COOKIE_HTTPONLY=Falso`.
- `SESSION_COOKIE_SAMESITE=None` com endpoints de mudança de estado autenticados por cookie (maior risco de CSRF).

Dicas de detecção:

- Inspecione blocos `app.config.update(...)` e classes de configuração.
- Procure o uso de `set_cookie(..., secure=..., httponly=..., samesite=...)` também em cookies fora da sessão.

Consertar:

- Defina esses valores de configuração explicitamente na configuração de produção.

Notas:

- SameSite é uma defesa profunda; não o trate como um substituto completo para tokens CSRF.

---

### FLASK-SESS-002: As sessões devem ser limitadas e resistentes à fixação/repetição

Gravidade: Média

Obrigatório:

- DEVE definir um tempo de vida de sessão limitado apropriado para o aplicativo.
- DEVE definir `session.permanent = True` somente quando você pretende sessões persistentes e definir `PERMANENT_SESSION_LIFETIME` para um valor justificado.
- DEVE limpar a sessão nas alterações de login e privilégios para reduzir o risco de fixação de sessão.
- NÃO DEVE armazenar segredos confidenciais no cookie de sessão padrão do Flask. A sessão padrão é assinada, não criptografada.

Padrões inseguros:

- Vidas extremamente longas ou ilimitadas para sessões privilegiadas.
- Nenhuma compensação de sessão no login.
- Armazenar segredos (senhas, tokens de acesso, PII) diretamente na `sessão[...]` ao usar sessões de cookies padrão.

Dicas de detecção:

- Procure por `PERMANENT_SESSION_LIFETIME`, `session.permanent`, `session[...] =`.
- Identificar se o armazenamento de sessão do lado do servidor é utilizado; caso contrário, assuma sessões de cookies padrão.

Consertar:

- Defina tempos de vida apropriados.
- Limpar/girar sessão no login.
- Armazene dados confidenciais no servidor; armazenar apenas identificadores no cookie de sessão.

---

### FLASK-CSRF-001: Solicitações de alteração de estado usando autenticação de cookie DEVEM ser protegidas por CSRF

Gravidade: Alta

- NOTA IMPORTANTE: Se os cookies não estiverem sendo usados para autenticação (ou seja, a autenticação é via cabeçalho de autenticação ou outro token passado), então não há risco de CSRF.

Obrigatório:

- DEVE proteger todos os endpoints que mudam de estado (POST/PUT/PATCH/DELETE) que dependem de cookies para autenticação.
- PODE usar uma biblioteca/integração CSRF bem testada (estrutura de formulário ou middleware) em vez de criar a sua própria.
- PODE usar defesas adicionais (verificação de origem/referente, cookies SameSite, cabeçalhos de busca de metadados, cabeçalhos personalizados para AJAX/API), mas os tokens continuam sendo a principal defesa para aplicativos autenticados por cookies.
  Se os tokens forem impraticáveis, ou

r pequenas aplicações:

- DEVE, no mínimo, exigir que um cabeçalho personalizado seja definido e definir o cookie de sessão SESSION_COOKIE_SAMESITE=lax, pois este é o método mais forte, além de exigir um token de formulário, e pode ser muito mais fácil de implementar.

Padrões inseguros:

- Endpoints autenticados por cookie que mudam de estado sem proteção CSRF.
- Usar GET para ações de mudança de estado (amplifica o risco de CSRF).

Dicas de detecção:

- Enumerar rotas com métodos diferentes de GET e identificar mecanismo de autenticação.
- Procure integrações CSRF (por exemplo, Flask-WTF, middleware CSRF global). Se ausente, trate como suspeito.
- Verifique também os endpoints da API JSON, não apenas os formulários HTML.

Consertar:

- Adicione proteção CSRF a todas as solicitações de alteração de estado.
- Se o aplicativo for uma API pura e usar cabeçalhos de autorização (tokens de suporte) em vez de cookies, documente essa escolha e garanta que os cookies não sejam usados ​​para autenticação. Se os cookies não forem usados ​​para autenticação, não haverá risco de CSRF.

Notas:

- XSS pode derrotar proteções CSRF; As defesas CSRF não substituem a prevenção XSS.

---

### FLASK-XSS-001: Impedir XSS refletido/armazenado em modelos e geração de HTML

Gravidade: Alta

Obrigatório:

- DEVE contar com o escape automático do Jinja para modelos HTML.
- NÃO DEVE marcar conteúdo não confiável como seguro:
  - Evite `Markup(...)` nos dados do usuário.
  - Evite Jinja `|safe` em conteúdo controlado pelo usuário.
- DEVE citar atributos HTML contendo expressões Jinja (`value="{{ x }}"` e não `value={{ x }}`).
- NÃO DEVE servir HTML carregado como HTML ativo; servir como download (`Content-Disposition: attachment`) ou transformar para um formato seguro. Nota: Isto só é relevante se

é possível fazer upload de conteúdo de documento como html, js, css, etc. Se forem apenas arquivos de imagem, não há preocupação.

- DEVE implantar uma Política de Segurança de Conteúdo (CSP) para mitigar classes XSS (incluindo `javascript:` em `href`).

Padrões inseguros:

- `Marcação(request.args.get(...))`
- Filtros de modelo: `{{ user_html|safe }}`
- Atributos não citados em modelos
- Servir conteúdo enviado pelo usuário diretamente com `text/html` ou renderização inline

Dicas de detecção:

- Pesquise `Markup(` e investigue a origem dos dados.
- Pesquise arquivos de modelo por uso indevido de `|safe`, `|tojson` e atributos sem aspas.
- Revise as rotas de entrega de arquivos que podem retornar uploads de usuários sem `as_attachment=True`. Nota: Isso só é relevante se for possível fazer upload de conteúdo de documento como html, js, css, etc. Se forem apenas arquivos de imagem, não há preocupação.

Correção:

- Remover marcação insegura; higienize apenas quando estritamente necessário usando um sanitizador de HTML confiável.
- Sempre cite atributos.
- Adicione CSP e reduza scripts embutidos.

---

### FLASK-SSTI-001: Nunca renderize modelos não confiáveis (injeção de modelo no lado do servidor)

Gravidade: Crítica

Obrigatório:

- NÃO DEVE renderizar modelos que contenham sintaxe de modelo controlada pelo usuário.
- DEVE tratar `render_template_string` e `Environment.from_string(...).render(...)` como perigosos se a string do modelo for influenciada por entradas não confiáveis.
- NÃO DEVE usar `.format()` em strings controladas pelo usuário
- Se forem absolutamente necessários modelos não confiáveis, trate-os como um design especial de alto risco:
  - DEVE usar uma abordagem de modelagem em sandbox e restringir recursos.

- DEVE manter o Jinja atualizado e assumir que fugas de sandbox são possíveis; isolar ainda mais.

Padrões inseguros:

- `render_template_string(request.args["tmpl"], ...)`
- Armazenar templates de usuário no banco de dados e renderizá-los com o ambiente normal do Jinja.
- `request.args["tmpl"].formato(...)`

Dicas de detecção:

- Grep para `render_template_string`, `from_string`, `.render(` com strings dinâmicas.
- Rastreie a origem da string do modelo (banco de dados, solicitação, uploads, painéis de administração).

Correção:

- Substitua por alternativas de modelos seguras que não avaliam o código (por exemplo, string.Template, str.replace).
- Se os modelos precisarem ser definidos pelo usuário, use um sandbox, além de listas de permissões rigorosas e isolamento pesado.

---

### FLASK-HEADERS-001: Defina cabeçalhos de segurança essenciais (no aplicativo ou na borda)

Gravidade: Média

Obrigatório (aplicativo web típico):

- DEVE definir:
  - CSP (`Política de Segurança de Conteúdo`)
  - `X-Content-Type-Options: nosniff`
  - Proteção contra clickjacking (`X-Frame-Options: SAMEORIGIN` e/ou CSP `frame-ancestors`) (pode haver casos em que o usuário queira iframe seu site em outro lugar. Se for esse o caso, trabalhe com eles para permitir isso com segurança)
- DEVE considerar cabeçalhos de proteção adicionais dependendo do aplicativo (Referrer-Policy, Permissions-Policy).
- DEVE garantir que os cookies sejam definidos com segurança

atributos (ver FLASK-SESS-001).

NOTA: Os cabeçalhos de segurança podem ser definidos através de um proxy ou outro provedor de nuvem. Verifique se há evidências disso.

Padrões inseguros:

- Sem cabeçalhos de segurança em qualquer lugar (aplicativo ou borda).
- CSP ausente em aplicativos que exibem conteúdo não confiável.

Dicas de detecção:

- Procure por ganchos `after_request`, uso do Flask-Talisman, configuração de proxy reverso.
- Se não estiver visível no código do aplicativo, sinalize como “verificar na borda”.

Consertar:

- Definir cabeçalhos centralmente (middleware/after_request) ou via proxy reverso/CDN.
- Manter o CSP realista e compatível; evite `unsafe-inline` sempre que possível.

---

### FLASK-LIMITS-001: O tamanho da solicitação e os limites de análise de formulário DEVEM ser definidos adequadamente

Gravidade: Baixa (Média se uploads de arquivos/corpos grandes forem possíveis)

Obrigatório:

- DEVE definir e justificar:
  - `MAX_CONTENT_LENGTH` (máximo global de bytes de solicitação)
  - `MAX_FORM_MEMORY_SIZE` (máximo por campo de formulário que não seja de arquivo em multipart)
  - `MAX_FORM_PARTS` (número máximo de campos multipartes)
- DEVE impor limites adicionais no nível de proxy reverso/WSGI/plataforma sempre que possível.

Padrões inseguros:

- Tamanhos de corpo de solicitação ilimitados ao lidar com uploads ou conteúdo do usuário.
- Aceitar formulários multipartes arbitrariamente grandes ou muitos campos.

Dicas de detecção:

- Inspecione a configuração do Flask para essas chaves.
- Inspecione rotas de upload e APIs que aceitam JSON grande.

Correção:

- Defina padrões conservadores, substitua por rota somente quando necessário.
- Garanta que uploads grandes usem mecanismos de upload dedicados.

---

### FLASK-HOST-001: O cabeçalho do host deve ser validado na produção

Gravidade: Baixa (depende do uso de URLs externos pelo aplicativo)

Obrigatório:

- DEVE definir `TRUSTED_HOSTS` na produção para restringir os valores aceitos do Host.
- NÃO DEVE confiar em `SERVER_NAME` como mecanismo de restrição de host.

Padrões inseguros:

- `TRUSTED_HOSTS` não definido em produção.
- Código que gera URLs externos para e-mails/redefinições de senha sem validação do host.

Dicas de detecção:

- Encontre o uso de configuração `TRUSTED_HOSTS`.
- Encontre `url_for(..., _external=True)` e verifique como o host é determinado.

Correção:

- Defina `TRUSTED_HOSTS` para seus domínios esperados (e subdomínios necessários).
- Certifique-se de que a geração de URL externa use host/esquema confiável.

---

### FLASK-PROXY-001: A confiança do proxy reverso deve ser configurada corretamente

Gravidade: Média (alta se depender de IPs para autenticação)

Obrigatório:

- Se estiver atrás de um proxy reverso, DEVE configurar o Flask/Werkzeug para confiar nos cabeçalhos encaminhados apenas do proxy pretendido.
- NÃO DEVE confiar cegamente nos cabeçalhos `X-Forwarded-*` da Internet aberta.

Padrões inseguros:

- `ProxyFix` aplicado com configurações de confiança excessivamente amplas ou aplicado sem entender quantos proxies estão na frente.
- Depender de cabeçalhos encaminhados para esquema/host sem validação.

Dicas de detecção:

- Procure por `ProxyFix`.
- Pesquise o uso de `request.remote_addr`, `request.scheme`, `request.host` em lógica sensível à segurança.

Correção:

- Configure o `ProxyFix` (ou configurações específicas da plataforma) com contagens de saltos corretas.
- Mantenha `TRUSTED_HOSTS` mesmo atrás de proxies.

---

### FLASK-PATH-001: Evita a passagem de caminho e o fornecimento inseguro de arquivos

Gravidade: Alta

Obrigatório:

- NÃO DEVE passar caminhos de arquivos controlados pelo usuário para `send_file` ou para direcionar E/S de arquivo.
- DEVE usar padrões seguros de serviço de arquivos:
  - `send_from_directory` para caminhos especificados pelo usuário em um diretório base confiável
  - `safe_join` para ingressar em um diretório base confiável com componentes de caminho não confiáveis
  - `secure_filename` para nomes de arquivos enviados (e ainda gerar seu próprio nome de armazenamento exclusivo)
- DEVE garantir que os uploads dos usuários não sejam veiculados como conteúdo executável/ativo

t (especialmente HTML).

- DEVE, em geral, usar `safe_join` em vez de `os.path.join` para quase todos os cálculos de caminho do sistema de arquivos.

Padrões inseguros:

- `send_file(request.args["caminho"])`
- `open(os.path.join(base_dir, user_path))` onde `user_path` não é confiável
- Servindo uploads de uma raiz estática da web sem restrições

Dicas de detecção:

- Procure por `send_file(`, `open(`, `os.path.join(`, `pathlib.Path(...)/...` nas rotas de arquivo.
- Identifique de onde vêm os nomes dos arquivos (args de solicitação, banco de dados, cabeçalhos).

Correção:

- Servir apenas a partir de uma base de diretório não controlada pelo usuário.
- Armazene uploads fora de raízes estáticas; servir através de rotas controladas.
- Sempre valide e normalize os identificadores de arquivos.

Nota: `safe_join` é importado de `werkzeug.security`

---

### FLASK-UPLOAD-001: Os uploads de arquivos devem ser validados, armazenados com segurança e servidos com segurança

Gravidade: Alta

Obrigatório:

- DEVE impor limites de tamanho de upload (aplicativo + borda).
- DEVE validar o tipo de arquivo usando listas de permissões e verificações de conteúdo (não apenas extensão).
- DEVE armazenar uploads fora de raízes executáveis/estáticas quando possível.
- DEVE gerar nomes de arquivos do lado do servidor (IDs aleatórios) e evitar confiar em nomes originais.
- DEVE servir formatos potencialmente ativos com segurança (download de anexo), a menos que seja explicitamente pretendido.

Padrões inseguros:

- Aceitar tipos de arquivos arbitrários e servi-los de volta in-line.
- Usando o nome de arquivo fornecido pelo usuário como caminho de armazenamento.
- Falta de validação de tamanho/tipo.

Dicas de detecção:

- Procure por manipuladores `request.files[...]`.
- Verifique o uso de `secure_filename` (e se ele está combinado com exclusividade).
- Verifique onde os arquivos estão armazenados e como são servidos.

Consertar:

- Implementar validação de lista de permissões + armazenamento seguro + veiculação segura.
- Adicione verificação/quarentena, se aplicável.

---

### FLASK-INJECT-001: Evita injeção de SQL (use consultas parametrizadas/ORM)

Gravidade: Alta

Obrigatório:

- DEVE usar consultas parametrizadas ou um ORM que parametrize nos bastidores.
- NÃO DEVE construir SQL por concatenação de strings/f-strings com entrada não confiável.

Padrões inseguros:

- `f"SELECIONE ... WHERE id={request.args['id']}"`
- `"... WHERE nome = '%s'" % user_input`

Dicas de detecção:

- Grep para strings `SELECT`, `INSERT`, `UPDATE`, `DELETE` em código Python.
- Rastreie dados não confiáveis ​​em chamadas de execução do banco de dados.

Correção:

- Substitua por consultas parametrizadas ou APIs de consulta ORM.
- Valide os tipos (por exemplo, IDs internos) antes de consultar.

---

### FLASK-INJECT-002: Impedir injeção de comando do SO

Gravidade: Crítica a Alta (depende da exposição)

Obrigatório:

- DEVE evitar executar comandos shell com entrada não confiável.
- Se o subprocesso for necessário:
  - DEVE passar argumentos como uma lista (não uma string)
  - NÃO DEVE usar `shell=True` com strings influenciadas pelo invasor
  - DEVE usar listas de permissões estritas para qualquer componente variável
- Se possível, use python puro ou uma biblioteca python em vez de usar um subprocesso ou comando do sistema
- Não assuma que os argumentos dos comandos serão inerentemente seguros mesmo em `shell=False`. Com

mandos podem processar incorretamente esses argumentos como sinalizadores de linha de comando ou outros valores confiáveis.

Padrões inseguros:

- `os.system(user_input)`
- `subprocess.run(f"cmd {usuário}", shell=True)`
- Passando strings de usuário para `bash -c`, `sh -c`, PowerShell, etc.

Dicas de detecção:

- Procure por `os.system`, `subprocess`, `Popen`, `shell=True`.
- Rastreie dados da solicitação/banco de dados para essas chamadas.

Consertar:

- Use APIs de biblioteca em vez de comandos shell.
- Se for inevitável, codifique o comando e coloque os parâmetros validados na lista de permissões. Se suportado pelo subcomando, tente manter os valores do usuário após `--` para evitar que sejam processados ​​como sinalizadores de linha de comando.

---

### FLASK-SSRF-001: Evita falsificação de solicitação do lado do servidor (SSRF) em HTTP de saída

Gravidade: Média

- Nota: Para projetos pequenos e independentes, isso é menos importante. É mais importante ao implantar em uma LAN ou com outros serviços escutando no mesmo servidor.

Obrigatório:

- DEVE tratar as solicitações de saída para URLs fornecidos pelo usuário como de alto risco.
- DEVE validar e restringir destinos (hosts/domínios da lista de permissões) para qualquer busca de URL influenciada pelo usuário.
- DEVE bloquear o acesso a:
  - localhost/intervalos de IP privados/endereços locais de link
  - endpoints de metadados em nuvem
- NÃO DEVE permitir protocolos não http/https (ou seja, arquivo: etc)
- DEVE definir tempos limite e restringir redirecionamentos.

Padrões inseguros:

- `requests.get(request.args["url"])`
- Webhooks/visualização/busca de endpoints que aceitam URLs arbitrários.

Dicas de detecção:

- Pesquise o uso de `requests.get/post`, `httpx`, `urllib`, `aiohttp` com fontes de URL não confiáveis.
- Identificar recursos de busca de URL (visualização, importação, testador de webhook).

Consertar:

- Certifique-se de que os URLs sejam http ou https (proibir arquivo: ou outros protocolos)
- Aplicar listas de permissões e controles de saída de rede.
- Adicionar análise rigorosa e verificações de resolução de IP; definir tempos limite; desative os redirecionamentos se não for necessário.

---

### FLASK-REDIRECT-001: Impedir redirecionamentos abertos

Gravidade: Baixa

Obrigatório:

- DEVE validar alvos de redirecionamento derivados de entradas não confiáveis ​​(por exemplo, `next`, `redirect`, `return_to`).
- DEVE usar listas de permissões de caminhos internos ou domínios conhecidos.
- DEVE preferir redirecionar apenas para caminhos relativos do mesmo site.

Padrões inseguros:

- `redirect(request.args.get("next"))` sem validação.

Dicas de detecção:

- Procure por `redirect(` e examine de onde vem `location`.

Correção:

- Permitir apenas caminhos relativos ou domínios permitidos.
- Volte para um padrão seguro se a validação falhar.

---

### FLASK-HTTP-001: Use métodos HTTP com segurança; não mude de estado via GET; evite segredos em URLs

Gravidade: Média

Obrigatório:

- NÃO DEVE realizar ações de mudança de estado em GET.
- NÃO DEVE colocar segredos em URLs (strings de consulta são comumente registradas e vazadas por meio de referenciadores).
- DEVE exigir POST/PUT/PATCH/DELETE para mudança de estado e aplicar proteções CSRF quando autenticado por cookie.

Padrões inseguros:

- `/delete?id=...` implementado como GET
- Tokens de redefinição de senha ou chaves de API em parâmetros de consulta

Dicas de detecção:

- Enumerar rotas GET e inspecionar se elas mudam de estado.
- Procure por parâmetros de URL chamados `token`, `key`, `secret`, `password`, etc.

Correção:

- Mover alterações de estado para métodos não GET.
- Mova valores confidenciais para canais seguros (corpos POST, cabeçalhos) e proteja-os.

---

### FLASK-CORS-001: CORS deve ser explícito e com menos privilégios

Gravidade: Média (alta se as credenciais estiverem configuradas incorretamente)

Obrigatório:

- Se o CORS não for necessário, DEVE mantê-lo desativado.
- Se o CORS for necessário:
  - DEVE incluir na lista de permissões origens confiáveis (não reflita origens arbitrárias).
  - DEVE ter cuidado com solicitações credenciadas; não combine origens amplas com cookies.
  - DEVE restringir métodos e cabeçalhos permitidos.

Padrões inseguros:

- `Access-Control-Allow-Origin: *` emparelhado com cookies credenciados ou acesso excessivamente amplo.
- Refletindo `Origem` sem validação.
- `flask_cors.CORS(app)` com padrões permissivos.

Dicas de detecção:

- Procure por `flask_cors`, `CORS(`, `Access-Control-Allow-Origin`.
- Verifique se há `supports_credentials=True` e origens curinga.

Correção:

- Use uma lista de permissões de origem rigorosa e métodos/cabeçalhos mínimos.
- Certifique-se de que os pontos de extremidade autenticados por cookie não sejam expostos de origem cruzada, a menos que seja necessário.

---

### FLASK-SUPPLY-001: Dependência e higiene de patches (foco em dependências relevantes para a segurança)

Gravidade: Baixa

Obrigatório:

- DEVE fixar e atualizar regularmente dependências críticas de segurança (Flask, Werkzeug, Jinja2, itsdangerous).
- DEVE responder prontamente aos avisos de segurança conhecidos.

Exemplo de foco de auditoria:

- Se estiver executando no Windows e usando arquivos servindo com caminhos não confiáveis, certifique-se de que o comportamento `safe_join` do Werkzeug não seja vulnerável a casos extremos de nomes de dispositivos Windows.

Dicas de detecção:

- Verifique `requirements.txt`, lockfiles e ambientes de tempo de execução.
- Identifique onde os auxiliares de segurança são usados ​​(safe_join, send_from_directory).

Correção:

- Atualize para versões corrigidas e adicione testes de regressão para o comportamento afetado.

---

## 5) Heurísticas práticas de varredura (como “caçar”)

Ao digitalizar ativamente, use estes padrões de sinal alto:

- Servidor de desenvolvimento/depuração:
  - `app.run(`, `flask run`, `--debug`, `DEBUG=True`, `FLASK_DEBUG`
- Segredos:
  - `SECRET_KEY`, `secret_key`, `.env` confirmado, `print(config)`
- Cookies/sessões:
  - `SESSION_COOKIE_SECURE`, `SESSION_COOKIE_HTTPONLY`, `SESSION_COOKIE_SAMESITE`
  - `session[...] =` com valores sensíveis
- CSRF:
  - Manipuladores POST/PUT/PATCH/DELETE sem verificações de CSRF em aplicativos autenticados por cookies
    -XSS/SSTI:
  - `Markup(`, `|safe`, sem aspas

atributos, `render_template_string`

- Arquivos:
  - `send_file(` com caminho controlado pelo usuário; `open(` no caminho do usuário; `os.path.join` com não confiável
  - fazer upload de manipuladores usando o nome de arquivo do usuário como caminho
- Injeção:
  - Strings SQL + formatação de strings em `.execute(...)`
  - `subprocess.*`, `shell=True`, `os.system`
- SSRF:
  - `requests.get/post` ou `httpx` com URL de request/DB
- Redirecionar:
  - `redirect(request.args.get("próximo"))`
- CORS:
  - `frasco_co

configurações permissivas do rs.CORS; origens curinga com credenciais

Sempre tente confirmar:

- origem dos dados (não confiável versus confiável)
- tipo de coletor (template/SQL/subprocess/files/redirect/http)
- controles de proteção presentes (validação, listas de permissões, middleware)

---

## 6) Fontes (acessado em 26/01/2026)

Documentação da estrutura primária:

- Flask Docs: Implantando na produção - https://flask.palletsprojects.com/en/stable/deploying/
- Flask Docs: Depurando erros de aplicativos - https://flask.palletsprojects.com/en/stable/debugging/
- Flask Docs: Tratamento de configuração - https://flask.palletsprojects.com/en/stable/config/
- Flask Docs: Considerações de segurança - https://flask.palletsprojects.com/en/stable/web-security/
- Flask Docs: Diga ao Flask que ele está atrás de um proxy - https://flask.pall

etsprojects.com/en/stable/deploying/proxy_fix/

- Documentos da API Flask: Sessões - https://flask.palletsprojects.com/en/stable/api/#sessions

Documentação e avisos da Werkzeug:

- Werkzeug Docs: Utilitários (send_file / send_from_directory / safe_join / secure_filename / hashing de senha) - https://werkzeug.palletsprojects.com/en/stable/utils/
- Comunicado GitHub: CVE-2025-66221 (nomes de dispositivos Werkzeug safe_join Windows) - https://github.com/advisories/GHSA-hgf8-39gv-g3f2

Série de folhas de dicas OWASP:

- Gerenciamento de sessão — https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html
- Prevenção de CSRF — https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html
- Prevenção XSS — https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html
- Validação de entrada — https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html
  -SQL

Prevenção de injeção - https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html

- Prevenção de injeção - https://cheatsheetseries.owasp.org/cheatsheets/Injection_Prevention_Cheat_Sheet.html
- Defesa de injeção de comando do sistema operacional - https://cheatsheetseries.owasp.org/cheatsheets/OS_Command_Injection_Defense_Cheat_Sheet.html
- Prevenção SSRF - https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Request_Forgery_Preven

ção_Cheat_Sheet.html

- Upload de arquivo - https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html
- Redirecionamentos não validados — https://cheatsheetseries.owasp.org/cheatsheets/Unvalidated_Redirects_and_Forwards_Cheat_Sheet.html
- Cabeçalhos HTTP — https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Headers_Cheat_Sheet.html

Referências de segurança do modelo:

- Jinja: Sandbox (renderizando modelos não confiáveis) — https://jinja.palletsprojects.com/en/stable/sandbox/
- OWASP WSTG: Teste para injeção de modelo no lado do servidor - https://owasp.org/www-project-web-security-testing-guide/v41/4-Web_Application_Security_Testing/07-Input_Validation_Testing/18-Testing_for_Server_Side_Template_Injection
- PortSwigger Web Security Academy: injeção de modelo no lado do servidor - https://portswigger.net/web-security/server-side

-injeção de modelo

Semântica HTTP:

- RFC 9110: Semântica HTTP (métodos seguros) — https://www.rfc-editor.org/rfc/rfc9110
