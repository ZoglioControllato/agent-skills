# Especificação de segurança da Web Django (Python) (Django 6.0.x, Python 3.x)

Este documento foi concebido como uma **especificação de segurança** que oferece suporte a:

1. **Geração de código seguro por padrão** para novo código Django.
2. **Revisão de segurança/caça de vulnerabilidades** no código Django existente (passivo “notificar problemas durante o trabalho” e ativo “verificar o repositório e relatar descobertas”).

Ele é intencionalmente escrito como um conjunto de **requisitos normativos** (“DEVE/DEVE/PODE”) mais **regras de auditoria** (como são os padrões ruins, como detectá-los e como corrigi-los/mitigá-los).

---

## 0) Segurança, limites e restrições antiabuso (DEVE SEGUIR)

- NÃO DEVE solicitar, gerar, registrar ou confirmar segredos (chaves de API, senhas, chaves privadas, cookies de sessão, `SECRET_KEY`, `SECRET_KEY_FALLBACKS`, senhas de banco de dados).
- NÃO DEVE “consertar” a segurança desativando proteções (por exemplo, removendo `CsrfViewMiddleware`, espalhando `@csrf_exempt`, afrouxando `ALLOWED_HOSTS` para `['*']`, desativando `SecurityMiddleware`, desativando o escape automático de modelo, desativando verificações de permissão).
- DEVE fornecer \*\* descobertas baseadas em evidências

ngs\*\* durante auditorias: cite caminhos de arquivo, trechos de código e valores de configuração concretos que justifiquem a afirmação.

- DEVE tratar a incerteza com honestidade: se existir uma proteção na infraestrutura (proxy reverso, WAF, CDN, controlador de entrada), relate-a como “não visível no código do aplicativo; verifique em tempo de execução/configuração de borda”.
- DEVE manter as correções compatíveis com o modelo de segurança pretendido do Django: prefira os integrados do Django (middleware, auth, formulários, ORM) em vez de programas personalizados

lógica de segurança sempre que possível. A lista de verificação de implantação e as verificações do sistema do Django fazem parte do modelo pretendido. ([Projeto Django][1])

---

## 1) Modos de operação

### 1.1 Modo de geração (padrão)

Quando solicitado a escrever um novo código Django ou modificar o código existente:

- DEVE seguir todos os requisitos **DEVE** nesta especificação.
- DEVE seguir todos os requisitos **DEVE**, a menos que o usuário diga explicitamente o contrário.
- DEVE preferir APIs Django seguras por padrão e bibliotecas comprovadas em vez de código de segurança personalizado.
- DEVE evitar a introdução de novos coletores arriscados (renderização dinâmica de modelos de strings não confiáveis, redirecionamentos inseguros, serviço de arquivos inseguros, execução de shell, formatação de strings SQL brutas, buscadores de URL compatíveis com SSRF de não confiáveis

entrada).

### 1.2 Modo de revisão passiva (sempre ativado durante a edição)

Ao trabalhar em qualquer lugar em um repositório Django (mesmo que o usuário não tenha solicitado uma verificação de segurança):

- DEVE “notar” violações desta especificação no código tocado/próximo.
- DEVE mencionar os problemas à medida que surgem, com uma breve explicação + solução segura.

### 1.3 Modo de auditoria ativo (solicitação de verificação explícita)

Quando o usuário pede para “verificar”, “auditar” ou “caçar vulnerabilidades”:

- DEVE pesquisar sistematicamente a base de código em busca de violações desta especificação.
- DEVE apresentar os resultados num formato estruturado (ver §2.3).

Ordem de auditoria recomendada:

1. Pontos de entrada de implantação (ASGI/WSGI), Dockerfiles, Procfiles, unidades systemd, manifestos de plataforma.
2. `settings.py` e módulos de configurações específicas do ambiente.
3. Ordenação de middleware e proteções habilitadas.
4. Authn/authz (login, gerenciamento de sessão, permissões, admin).
5. Proteções CSRF e endpoints de mudança de estado.
6. Modelos e XSS.
7. Manipulação de arquivos (uploads/downloads/estático/mídia) e passagem de caminho.
8. Classes de injeção (SQL, comando exe

corte, desserialização insegura). 9. Solicitações de saída (SSRF). 10. Tratamento de redirecionamentos (redirecionamentos abertos) + CORS + cabeçalhos de segurança (CSP, HSTS, etc.). 11. Dependência/fixação e postura de patch.

---

## 2) Definições e orientações de revisão

### 2.1 Entrada não confiável (tratada como controlada pelo invasor, salvo prova em contrário)

Os exemplos incluem:

- `request.GET`, `request.POST`, `request.FILES`
- `request.body`, corpos JSON (por exemplo, `json.loads(request.body)`), DRF `request.data`
- Parâmetros de caminho de URL (por exemplo, `<int:id>`, `<slug:...>`)
- `request.headers` / `request.META` (incluindo `HTTP_HOST`, `HTTP_ORIGIN`, `HTTP_REFERER`, `HTTP_X_FORWARDED_*`)
- `solicitação.COOKIES`
- Quaisquer dados de sistemas externos (webhooks, APIs de terceiros, filas de mensagens)
- Qualquer conteúdo persistente originado do usuário

s (linhas do banco de dados, conteúdo em cache, uploads de arquivos)

Django enfatiza explicitamente “nunca confie em dados controlados pelo usuário” e recomenda o uso de formulários/validação. ([Projeto Django][2])

### 2.2 Solicitação de mudança de estado

Uma solicitação muda de estado se puder criar/atualizar/excluir dados, alterar o estado de autenticação/sessão, acionar efeitos colaterais (compra, envio de e-mail, envio de webhook) ou iniciar ações privilegiadas.

### 2.3 Formato de descoberta de auditoria necessário

Para cada problema encontrado, produza:

- ID da regra:
- Gravidade: Crítica / Alta / Média / Baixa
- Localização: caminho do arquivo + nome da função/classe/visualização + linha(s)
- Evidência: o trecho de código/configuração exato
- Impacto: o que pode dar errado, quem pode explorar
- Correção: mudança segura (prefira diferença mínima)
- Mitigação: defesa profunda se a solução imediata for difícil
- Notas falso-positivas: o que verificar em caso de incerteza

---

## 3) Linha de base segura: configuração mínima de produção (DEVE em produção)

Esta é a menor “linha de base de produção” que evita configurações incorretas comuns do Django. Django fornece uma “lista de verificação de implantação” e recomenda executar `manage.py check --deploy` nas configurações de produção. ([Projeto Django][1])

### 3.1 Padrão de gerenciamento de configurações (DEVE)

- DEVE usar configuração baseada em ambiente (ou um gerenciador de segredos) para que as configurações de produção não sejam codificadas.
- DEVE tratar configurações confidenciais como confidenciais (por exemplo, `SECRET_KEY`, senhas de banco de dados) e mantê-las fora do controle de origem. A lista de verificação do Django recomenda explicitamente carregar `SECRET_KEY` do env ou de um arquivo em vez de codificar. ([Projeto Django][1])
- DEVE separar os módulos de configurações dev vs prod, com padrões seguros para produção (falha no fechamento

d se faltarem configurações críticas). ([Projeto Django][1])

### 3.2 Metas mínimas de linha de base (produção)

- NÃO DEVE usar `manage.py runserver` como ponto de entrada de produção; use um servidor WSGI ou ASGI pronto para produção. ([Projeto Django][1])
- DEVE definir `DEBUG = False` na produção. ([Projeto Django][1])
- DEVE definir um `SECRET_KEY` forte e secreto e mantê-lo em segredo; PODE usar `SECRET_KEY_FALLBACKS` para rotação segura. ([Projeto Django][1])
- DEVE definir `ALLOWED_HOSTS` para hosts esperados (sem curinga, a menos que você faça sua própria validação de host). ([Projeto Django][1])

- DEVE impor HTTPS para áreas autenticadas (de preferência em todo o site para qualquer aplicativo com capacidade de login) e definir `CSRF_COOKIE_SECURE=True` e `SESSION_COOKIE_SECURE=True` quando HTTPS for usado. ([Projeto Django][1])
- DEVE ativar os principais cabeçalhos/configurações `SecurityMiddleware`: HSTS, Referrer-Policy, COOP, nosniff, redirecionamento SSL (com configuração de proxy correta). ([Projeto Django][3])
- DEVE tratar os uploads dos usuários como não confiáveis; garanta que seu servidor web nunca interprete

hem como conteúdo executável; mantenha `MEDIA_ROOT` separado de `STATIC_ROOT`. ([Projeto Django][1])

---

## 4) Regras (geração + auditoria)

Cada regra contém: práticas necessárias, padrões inseguros, dicas de detecção e correção.

### DJANGO-DEPLOY-001: Não use o servidor de desenvolvimento do Django em produção

Gravidade: Alta (se produção)

Obrigatório:

- NÃO DEVE implantar `manage.py runserver` como servidor de produção.
- DEVE ser executado atrás de um servidor WSGI ou ASGI de nível de produção. ([Projeto Django][1])

Padrões inseguros:

- Documentos/scripts de produção usando `python manage.py runserver 0.0.0.0:8000`.
- Docker `CMD`/entrypoint usa `runserver`.
- Unidades Kubernetes/Procfile/systemd invocando `runserver`.

Dicas de detecção:

- Procure por `manage.py runserver`, `runserver 0.0.0.0`, `--insecure`.
- Verifique Docker `CMD/ENTRYPOINT`, Procfile, arquivos de unidade systemd, gráficos Helm.

Consertar:

- Use um servidor de produção (WSGI/ASGI) conforme recomendado na lista de verificação de implantação do Django. ([Projeto Django][1])

Nota:

- `runserver` é adequado para desenvolvimento local. Sinalize apenas se for usado como ponto de entrada de produção.

---

### DJANGO-DEPLOY-002: `DEBUG` DEVE ser desabilitado na produção

Gravidade: Alta

Obrigatório:

- DEVE definir `DEBUG = False` na produção.
- DEVE tratar qualquer mecanismo que exponha páginas de depuração/tracebacks a usuários não confiáveis ​​como um risco crítico de divulgação de informações. A lista de verificação do Django avisa explicitamente que `DEBUG=True` vaza trechos de fontes, variáveis ​​locais, configurações e muito mais. ([Projeto Django][1])

Padrões inseguros:

- `DEBUG = True` nas configurações de produção.
- O ambiente é padronizado como `DEBUG=True`, a menos que seja explicitamente substituído.

Dicas de detecção:

- Pesquise arquivos `DEBUG = True`, `DEBUG=os.environ.get(..., True)`, `DJANGO_DEBUG`, `.env`.
- Procure módulos de configurações de “produção” que importam dos padrões de desenvolvimento.

Correção:

- Defina `DEBUG=False` nas configurações do produto; use configuração de ambiente explícita.
- Certifique-se de que o relatório de erros seja feito por meio de registro/monitoramento seguro, e não de páginas de depuração. ([Projeto Django][1])

---

### DJANGO-CONFIG-001: `SECRET_KEY` deve ser forte, secreto e girado com segurança

Gravidade: Alta (Crítica se estiver ausente na produção com assinatura/sessões)

Obrigatório:

- DEVE definir um grande `SECRET_KEY` aleatório na produção e mantê-lo em segredo. ([Projeto Django][1])
- NÃO DEVE enviá-lo ao controle de origem ou imprimi-lo/registrá-lo. ([Projeto Django][1])
- DEVE carregá-lo do env ou de um arquivo/armazenamento secreto (não codificado). ([Projeto Django][1])
- PODE girar chaves usando `SECRET_KEY_FALLBACKS` para evitar invalidar instantaneamente todos os dados assinados; DEVE remover chaves antigas de substitutos em tempo hábil. ([Projeto Django][1])

Padrões inseguros:

- `SECRET_KEY = "..."` codificado no repositório para produção.
- `SECRET_KEY` reutilizado em ambientes.
- `SECRET_KEY_FALLBACKS` contém chaves expiradas indefinidamente.

Dicas de detecção:

- Procure por `SECRET_KEY =`, `SECRET_KEY_FALLBACKS`, `.env` arquivos confirmados, `print(settings.SECRET_KEY)`.

Consertar:

- Carregar do gerenciador secreto/variável de ambiente.
- Se estiver girando:
  - Definir novo `SECRET_KEY`
  - Mantenha as chaves antigas temporariamente em `SECRET_KEY_FALLBACKS`
  - Remova a(s) chave(s) antiga(s) após a janela de rotação. ([Projeto Django][1])

---

### DJANGO-HOST-001: O cabeçalho do host deve ser validado (`ALLOWED_HOSTS` deve ser estrito)

Gravidade: Média

Obrigatório:

- DEVE definir `ALLOWED_HOSTS` em produção para seus domínios/hosts esperados. ([Projeto Django][1])
- NÃO DEVE definir `ALLOWED_HOSTS = ['*']` em produção, a menos que você também implemente sua própria validação `Host` robusta (Django avisa que curingas requerem sua própria validação para evitar ataques de classe CSRF). ([Projeto Django][1])
- DEVE configurar o servidor web frontal para rejeitar hosts desconhecidos antecipadamente (defesa profunda). ([Projeto Django][1])

Padrões inseguros:

- `ALLOWED_HOSTS = ['*']` (ou env se expande para `*`) em produção.
- `ALLOWED_HOSTS = []` com `DEBUG=False` (o site não funciona ou implantações mal configuradas tentam soluções alternativas).

Dicas de detecção:

- Pesquise `ALLOWED_HOSTS`.
- Verifique as configurações do ambiente da plataforma que substituem `ALLOWED_HOSTS`.

Correção:

- Defina `ALLOWED_HOSTS = ['example.com', 'www.example.com', ...]` para prod.
- Mantenha os hosts de desenvolvimento separados.

Notas:

- Django usa o cabeçalho Host para construção de URL; Valores falsos de Host podem levar a CSRF, envenenamento de cache e links de e-mail envenenados (os documentos de segurança do Django alertam sobre isso). ([Projeto Django][2])

---

### DJANGO-HTTPS-001: Se for usado TLS, o transporte de cookies deve ser protegido

Gravidade: alta (crítica para aplicativos habilitados para autenticação)

NOTA: Aplique isso apenas se o TLS estiver ativado, pois isso interromperá aplicativos não-TLS

Se estiver usando TLS:

- DEVE definir:
  - `CSRF_COOKIE_SECURE = True` ([Projeto Django][1])
  - `SESSION_COOKIE_SECURE = True` ([Projeto Django][1])

- DEVE considerar habilitar:
  - `SECURE_SSL_REDIRECT = True` (com configuração de proxy correta) ([Projeto Django][3])
  - HSTS via `SECURE_HSTS_SECONDS` (+ includeSubDomains/preload conforme apropriado). ([Projeto Django][3])

Padrões inseguros:

- Páginas de login por HTTP ou HTTP/HTTPS misto com o mesmo cookie de sessão.
- `CSRF_COOKIE_SECURE=False` ou `SESSION_COOKIE_SECURE=False` em HTTPS de produção.
- HSTS ativado incorretamente (pode interromper o site durante esse período).

Dicas de detecção:

- Inspecione `settings.py` para `CSRF_COOKIE_SECURE`, `SESSION_COOKIE_SECURE`, `SECURE_SSL_REDIRECT`, `SECURE_HSTS_SECONDS`.
- Inspecione a configuração de proxy/entrada para comportamento de redirecionamento HTTP->HTTPS.

Consertar:

- Habilite o redirecionamento HTTPS e proteja os cookies.
- Adicione HSTS com cuidado (comece com valor baixo, valide e depois aumente). Django avisa que configuração incorreta pode danificar seu site durante o HSTS. ([Projeto Django][3])

---

### DJANGO-PROXY-001: A confiança do proxy reverso deve ser configurada corretamente (`SECURE_PROXY_SSL_HEADER`)

Gravidade: Média (quando atrás de um proxy TLS)

Obrigatório:

- Se estiver atrás de um proxy reverso que finalize o TLS, DEVE configurar o Django para que `request.is_secure()` reflita o esquema _externo_, caso contrário o CSRF e outras lógicas podem quebrar. Documentos Django usando `SECURE_PROXY_SSL_HEADER` para isso. ([Projeto Django][3])
- DEVE definir `SECURE_PROXY_SSL_HEADER` apenas se você controlar o proxy (ou tiver garantias) e ele remover cabeçalhos falsificados de entrada. Django avisa explicitamente que configurações incorretas podem comprometer a segurança e listar requisitos

condições iradas. ([Projeto Django][3])

Padrões inseguros:

- `SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")` em um ambiente onde o proxy não remove o `X-Forwarded-Proto` fornecido pelo usuário.
- Loops de redirecionamento infinitos após definir `SECURE_SSL_REDIRECT=True` (geralmente indica que a detecção de HTTPS do proxy está errada). ([Projeto Django][3])

Dicas de detecção:

- Pesquise `SECURE_PROXY_SSL_HEADER`, `SECURE_SSL_REDIRECT`.
- Inspecione o comportamento de entrada/proxy para remover cabeçalhos encaminhados.

Correção:

- Defina `SECURE_PROXY_SSL_HEADER` somente se o proxy remover e definir o cabeçalho corretamente (de acordo com os pré-requisitos documentados do Django). ([Projeto Django][3])

---

### DJANGO-SESS-001: Cookies de sessão devem usar atributos seguros na produção

Gravidade: Média (somente se TLS estiver ativado)

Obrigatório (produção, HTTPS):

- DEVE definir `SESSION_COOKIE_SECURE=True` (transmitir apenas por HTTPS). ([Projeto Django][3])
- DEVE manter `SESSION_COOKIE_HTTPONLY=True` (o padrão do Django é `True`). ([Projeto Django][3])
- DEVE manter `SESSION_COOKIE_SAMESITE='Lax'` (o padrão do Django é `Lax`) a menos que um fluxo entre sites justificado exija `None`. ([Projeto Django][3])
- DEVE evitar definir `SESSION_COOKIE_DOMAIN`, a menos que você realmente precise de cookies entre subdomínios (cookies para todo o subdomínio expa

segunda superfície de ataque).

Padrões inseguros:

- `SESSION_COOKIE_SECURE=False` em HTTPS de produção.

NOTA IMPORTANTE: Defina `Secure` apenas no ambiente de produção quando o TLS estiver configurado. Ao executar em um ambiente de desenvolvimento local via HTTP, não defina a propriedade `Secure` nos cookies. Você deve fazer isso condicionalmente com base no fato de o aplicativo estar sendo executado no modo de produção. Você também deve incluir uma propriedade como `SESSION_COOKIE_SECURE` que pode ser usada para desabilitar cookies `Secure` ao testar via HTTP.

- `SESSION_COOKIE_HTTPONLY=Falso`.
- `SESSION_COOKIE_SAMESITE=None` combinado com endpoints de mudança de estado autenticados por cookie (maior risco de CSRF).

Dicas de detecção:

- Pesquise as configurações de `SESSION_COOKIE_`, `response.set_cookie(..., httponly=..., secure=..., samesite=...)`.

Correção:

- Defina o acima explicitamente nas configurações de produção.
- Valide a compatibilidade com seus fluxos de autenticação. ([Projeto Django][3])

---

### DJANGO-SESS-002: As configurações de cookies CSRF devem ser deliberadas (HttpOnly tem vantagens e desvantagens)

Gravidade: Média

Obrigatório:

- DEVE definir `CSRF_COOKIE_SECURE=True` ao usar HTTPS/TLS. ([Projeto Django][3])
- DEVE manter `CSRF_COOKIE_SAMESITE='Lax'` a menos que você tenha um requisito entre sites. O padrão do Django é `Lax`. ([Projeto Django][3])
- PODE definir `CSRF_COOKIE_HTTPONLY=True` (o padrão é `False`) se seu frontend não precisar ler o cookie CSRF. Se você habilitá-lo, seu JS deverá ler o token CSRF do DOM (o Django documenta isso). ([Projeto Django][3])

Padrões inseguros:

- `CSRF_COOKIE_SECURE=False` em HTTPS/TLS de produção.
- Definir `CSRF_COOKIE_HTTPONLY=True` mas ainda contar com padrões “ler csrftoken cookie em JS” (quebra CSRF para AJAX).
- `CSRF_COOKIE_SAMESITE=None` sem um motivo claro.

Dicas de detecção:

- Pesquise as configurações `CSRF_COOKIE_`.
- Pesquise JS pelo uso de `document.cookie` para buscar `csrftoken`.

Consertar:

- Alinhe as configurações de cookies com seu método de aquisição de token CSRF (cookie vs DOM) conforme descrito pelo Django. ([Projeto Django][4])

---

### DJANGO-CSRF-001: Solicitações de alteração de estado autenticadas por cookie DEVEM ser protegidas por CSRF

Gravidade: Alta

Obrigatório:

- DEVE manter `django.middleware.csrf.CsrfViewMiddleware` habilitado (está ativado por padrão). ([Projeto Django][4])
- DEVE incluir `{% csrf_token %}` em formulários POST internos; NÃO DEVE incluí-lo em formulários que POST para URLs externos (Django avisa que isso vaza o token). ([Projeto Django][4])
- DEVE proteger todos os endpoints que mudam de estado (POST/PUT/PATCH/DELETE) que dependem de cookies para autenticação.
- Para chamadas AJAX/SPA, DEVE enviar o token CSRF via t

o cabeçalho `X-CSRFToken` (ou nome do cabeçalho configurado) conforme documentado. ([Projeto Django][4])

- DEVE ter muito cuidado com `@csrf_exempt` e usá-lo somente quando for absolutamente necessário; se usado, DEVE substituir o CSRF por um controle alternativo apropriado (por exemplo, solicitação de assinatura para webhooks). Django avisa explicitamente sobre `csrf_exempt`. ([Projeto Django][2])

Padrões inseguros:

- Falta `CsrfViewMiddleware` em `MIDDLEWARE`.
- `@csrf_exempt` em visualizações autenticadas de uso geral.
- Endpoints POST/PUT/PATCH/DELETE com autenticação de sessão e sem tokens CSRF.
- Usar GET para ações de mudança de estado (amplifica o risco de CSRF).

Dicas de detecção:

- Inspecione `settings.py` `MIDDLEWARE` para `CsrfViewMiddleware` e sua ordem (Django observa que ele deve vir antes do middleware que assume que o CSRF é tratado). ([Projeto Django][4])
- Procure por `csrf_exempt`, `csrf_protect`, `ensure_csrf_cookie`.
- Enumerar padrões de URL para métodos não-GET; confirmar a cobertura CSRF.

Consertar:

- Reative o `CsrfViewMiddleware`, adicione tokens CSRF aos formulários e adicione manipulação de cabeçalho AJAX.
- Para decoradores de cache: se você armazenar em cache uma visualização que precisa de tokens CSRF, aplique `@csrf_protect` como documentos Django para evitar armazenar em cache uma resposta sem cookies CSRF/cabeçalhos Vary. ([Projeto Django][4])

Notas:

- Quando implantado com HTTPS, o middleware CSRF do Django também verifica o cabeçalho Referer para a mesma origem (os documentos de segurança do Django mencionam isso). ([Projeto Django][2])

---

### DJANGO-XSS-001: Impedir XSS refletido/armazenado em modelos e geração de HTML

Gravidade: Alta

Obrigatório:

- DEVE contar com o escape automático do modelo Django (seguro por padrão) para modelos HTML. Os documentos de segurança do Django destacam que os modelos do Django escapam de caracteres perigosos, mas têm limitações. ([Projeto Django][2])
- NÃO DEVE desativar amplamente o escape automático (`{% autoescape off %}`), a menos que o conteúdo seja confiável ou higienizado com segurança. ([Projeto Django][5])
- NÃO DEVE marcar conteúdo não confiável como seguro:
  - Evite `mark_safe(...)` nos dados do usuário.
  - Evite `|seguro` o

n conteúdo controlado pelo usuário.

- DEVE ter cuidado com as armadilhas do contexto HTML (por exemplo, atributos sem aspas); Django mostra explicitamente um exemplo onde o escape não protege um contexto de atributo sem aspas. ([Projeto Django][2])
- DEVE preferir ajudantes de construção HTML seguros (por exemplo, `format_html`) em vez de concatenação manual que corre o risco de perder escapes. ([Projeto Django][6])

Padrões inseguros:

- `{% autoescape off %}{{ user_input }}{% endautoescape %}`
- `{{ user_input|seguro }}`
- `mark_safe(request.GET["q"])`
- Injeções de atributos sem aspas: `<style class={{ var }}>...` (exemplo do próprio Django). ([Projeto Django][2])

Dicas de detecção:

- Pesquise modelos para `|safe`, `autoescape off`, `safeseq`.
- Pesquise em Python por `mark_safe`, `SafeString` ou concatenação HTML direta com valores de solicitação/banco de dados.
- Revise qualquer código que retorne `HttpResponse(user_value)` onde `user_value` contém HTML.

Consertar:

- Remover marcação insegura; higienize apenas quando estritamente necessário (use um sanitizador HTML baseado em lista de permissões).
- Cite atributos e evite colocar valores não confiáveis ​​em contextos perigosos.
- Adicionar CSP como defesa profunda (ver DJANGO-CSP-001). ([Projeto Django][2])

---

### DJANGO-TEMPLATE-001: Nunca renderize strings de origem de modelos não confiáveis

Gravidade: Alta a Crítica (depende do contexto e da exposição)

Obrigatório:

- NÃO DEVE renderizar modelos onde a string de origem do modelo seja influenciada por entradas não confiáveis ​​(solicitação, conteúdo do usuário, linhas do banco de dados editáveis ​​por usuários não confiáveis).
- DEVE tratar os padrões “template from string” como perigosos, mesmo que os templates do Django sejam mais restritos do que alguns outros mecanismos: eles ainda podem vazar dados do contexto, ignorar o escape e criar XSS ou injeção de conteúdo.

Padrões inseguros:

- `Template(request.GET["tmpl"]).render(Context(...))`
- Salvar modelos de usuário no banco de dados e renderizá-los com privilégios/contexto normais.

Dicas de detecção:

- Procure por `django.template.Template(`, `Engine.from_string`, `.render(Context(` com strings não constantes.
- Rastreie de onde vem a string do modelo (painéis de administração, banco de dados, uploads, solicitações).

Correção:

- Substitua por formatação não executável (por exemplo, `string.Template`, espaços reservados explícitos) ou um modelo de renderização estritamente permitido.
- Se você _deve_ oferecer suporte a modelos definidos pelo usuário, isole-o fortemente (contexto de serviço/locatário separado, listas de permissões estritas e presuma que desvios são possíveis).

---

### DJANGO-SQL-001: Impedir injeção de SQL (use ORM ou SQL bruto parametrizado)

Gravidade: Alta

Obrigatório:

- DEVE usar Django ORM/querysets para acesso normal ao banco de dados; Os conjuntos de consultas de notas do Django são parametrizados e protegidos contra injeção de SQL sob uso típico. ([Projeto Django][2])
- DEVE ter muito cuidado com SQL bruto; se estiver usando `raw()`, `cursor.execute()`, `extra()` ou `RawSQL`, DEVE passar parâmetros separadamente (por exemplo, `params=`) e NÃO DEVE interpolar strings de entrada não confiável no SQL. Os documentos SQL brutos do Django alertam para escapar de parâmetros controlados pelo usuário usando `par

sou`. ([Projeto Django][7])

- NÃO DEVE citar espaços reservados em modelos SQL (os documentos do Django alertam explicitamente que citar espaços reservados `%s` o torna inseguro). ([Projeto Django][8])
- DEVE evitar `extra()` e `RawSQL` a menos que seja necessário; Os documentos de segurança do Django pedem cautela. ([Projeto Django][2])

Padrões inseguros:

- `cursor.execute(f"SELECT ... WHERE id={request.GET['id']}")`
- `Model.objects.raw("... %s" % user_input)` (formatação de string)
- `extra(onde=[f"headline='{q}'"])`
- Espaços reservados entre aspas: `WHERE othercol = '%s'` (explicitamente documentado como inseguro). ([Projeto Django][8])

Dicas de detecção:

- Grep para `.raw(`, `.extra(`, `RawSQL(`, `connection.cursor()`, `.execute(`.
- Grep para palavras-chave SQL (`SELECT`, `UPDATE`, `DELETE`, `INSERT`) em strings Python.
- Rastreie entradas não confiáveis nesses sites de chamadas.

Correção:

- Prefira consultas ORM.
- Se o SQL bruto for inevitável, use parâmetros (`params`, ligação de parâmetros DB-API) e não coloque espaços reservados entre aspas. ([Projeto Django][7])

---

### DJANGO-CMD-001: Impedir injeção de comando do sistema operacional

Gravidade: Crítica a Alta (depende da exposição)

Obrigatório:

- DEVE evitar executar comandos do sistema com informações influenciadas pelo invasor.
- Se o subprocesso for necessário:
  - DEVE passar argumentos como uma lista (não uma string de shell).
  - NÃO DEVE usar `shell=True` com conteúdo influenciado por invasores.
  - DEVE usar listas de permissões estritas para componentes variáveis.

- DEVE preferir bibliotecas Python puras em vez de gastar muito.

Padrões inseguros:

- `os.system(request.GET["cmd"])`
- `subprocess.run(f"convert {path}", shell=True)` onde `path` é controlado pelo usuário.

Dicas de detecção:

- Pesquise `os.system`, `subprocess`, `Popen`, `shell=True`.
- Rastreie entradas de solicitação/banco de dados nessas chamadas.

Correção:

- Substituir por APIs de biblioteca; se inevitável, parâmetros executáveis ​​em código e validados na lista de permissões.

---

### DJANGO-UPLOAD-001: Os uploads de arquivos devem ser validados, armazenados com segurança e servidos com segurança

Gravidade: Alta

Obrigatório:

- DEVE tratar todos os uploads de usuários como não confiáveis. Django avisa explicitamente "Arquivos de mídia são enviados por seus usuários. Eles não são confiáveis!" ([Projeto Django][1])
- DEVE garantir que o servidor web nunca interprete os uploads do usuário como código executável (por exemplo, não permitir que `.php` ou HTML carregados sejam executados/inline como conteúdo ativo). ([Projeto Django][1])
- DEVE impor limites de tamanho (pelo menos no servidor web; os documentos de segurança do Django recomendam limitar o tamanho do upload no servidor

ver para evitar DoS). ([Projeto Django][2])

- DEVE validar os tipos de arquivo usando listas de permissões e verificações de conteúdo (não apenas extensões).
- DEVE armazenar uploads fora do diretório de código do aplicativo e fora de qualquer raiz estática.
- DEVE considerar veicular uploads de um domínio separado de nível superior/segundo nível para reduzir o impacto da mesma origem; Os documentos de segurança do Django recomendam um domínio distinto e observam que um subdomínio pode ser insuficiente para algumas proteções. (

[Projeto Django][2])

- DEVE estar ciente dos riscos de upload poliglota: Django documenta um caso onde o HTML pode ser carregado “como uma imagem” usando um cabeçalho PNG válido (e pode ser servido como HTML dependendo do servidor web). ([Projeto Django][2])

Padrões inseguros:

- Servir uploads inline com `text/html` ou sem forçar o download para formatos potencialmente ativos.
- Carregar lista de permissões com base apenas na extensão.
- Carregue o armazenamento dentro de raízes estáticas ou raízes de código.

Dicas de detecção:

- Pesquise `request.FILES`, `FileField`, `ImageField`, carregue formulários/visualizações.
- Inspecione os caminhos de serviço de upload e a configuração do Nginx/Apache (manipuladores de mídia).
- Verifique `MEDIA_URL`, `MEDIA_ROOT` e configuração estática.

Consertar:

- Configure o servidor web para servir uploads como bytes inertes (sem execução) e considere forçar `Content-Disposition: attachment` para tipos de risco.
- Use um domínio separado para conteúdo do usuário quando necessário. ([Projeto Django][2])

---

### DJANGO-PATH-001: Evita a passagem de caminho e o fornecimento inseguro de arquivos (separação estática/de mídia)

Gravidade: Alta

Obrigatório:

- NÃO DEVE tratar a entrada do usuário como um caminho do sistema de arquivos para leitura/gravação/servimento.
- DEVE manter `MEDIA_ROOT` e `STATIC_ROOT` distintos; Os documentos de configurações do Django avisam explicitamente que eles devem ter valores diferentes para evitar implicações de segurança. ([Projeto Django][3])
- DEVE preferir usar APIs de armazenamento Django codificadas por identificadores do lado do servidor em vez de aceitar caminhos relativos arbitrários dos usuários.

Padrões inseguros:

- `open(os.path.join(MEDIA_ROOT, request.GET["caminho"]))`
- Baixe endpoints que usam parâmetros de estilo `?file=../../...`.
- `MEDIA_ROOT == STATIC_ROOT` configurado incorretamente.

Dicas de detecção:

- Grep para `open(`, `Path(`, `os.path.join(` usado com valores de solicitação.
- Verifique `MEDIA_ROOT`, `STATIC_ROOT` nas configurações. ([Projeto Django][3])

Correção:

- Use IDs do lado do servidor mapeados para arquivos conhecidos.
- Mantenha a estática e a mídia separadas e garanta que o servidor web trate a mídia como não confiável. ([Projeto Django][3])

---

### DJANGO-REDIRECT-001: Impedir redirecionamentos abertos (`next`, `return_to`, `redirect`)

Gravidade: Média (alta quando combinada com fluxos de autenticação)

Obrigatório:

- DEVE validar alvos de redirecionamento derivados de entradas não confiáveis ​​(por exemplo, `next`, `return_to`).
- DEVE restringir-se a caminhos relativos do mesmo site ou hosts/esquemas permitidos.
- DEVE usar os auxiliares de URL seguros do Django (por exemplo, `django.utils.http.url_has_allowed_host_and_scheme`) em vez da análise personalizada.

Padrões inseguros:

- `return redirect(request.GET.get("next"))` sem validação.
- Lista de permissões de redirecionamento implementada com verificações de strings ingênuas.

Dicas de detecção:

- Procure por `redirect(` e rastreie a origem do alvo.
- Procure por parâmetros chamados `next`, `return_to`, `redirect`, `url`.

Correção:

- Valide com listas de permissões e use como padrão um caminho interno seguro se a validação falhar.
- Certifique-se de que a validação do host via `ALLOWED_HOSTS` permaneça rigorosa (consulte DJANGO-HOST-001). ([Projeto Django][3])

---

### DJANGO-HEADERS-001: Habilite cabeçalhos de segurança essenciais (SecurityMiddleware + proteção contra clickjacking)

Gravidade: Média a Alta

Obrigatório:

- DEVE usar `django.middleware.security.SecurityMiddleware` e configurá-lo adequadamente (produção) para:
  - `X-Content-Type-Options: nosniff` (configuração do Django `SECURE_CONTENT_TYPE_NOSNIFF`, padrão `True`). ([Projeto Django][3])
  - `Referrer-Policy` (configuração do Django `SECURE_REFERRER_POLICY`, padrão `'same-origin'`). ([Projeto Django][3])
  - COOP (configuração Django `SECURE_CROSS_ORIGIN_OPENER_POLICY`, padrão `'same-origin'`). ([Projeto Django

][3])

- Redirecionamentos HTTPS e HSTS conforme apropriado (ver DJANGO-HTTPS-001). ([Projeto Django][3])

- DEVE ativar a proteção contra clickjacking por meio do middleware X-Frame-Options; Os documentos de segurança do Django o recomendam fortemente para sites que não precisam de enquadramentos de terceiros. ([Projeto Django][2])

Padrões inseguros:

- Faltando SecurityMiddleware.
- Ausência de proteção contra clickjacking (ou desativação global) sem um requisito de enquadramento claro.
- Permissões de enquadramento excessivamente amplas para terminais sensíveis.

Dicas de detecção:

- Inspecione `MIDDLEWARE` para SecurityMiddleware e XFrameOptionsMiddleware.
- Pesquisa por desativação por visualização de proteções de enquadramento/CSRF.

Correção:

- Adicione/habilite middleware e defina as configurações intencionalmente. ([Projeto Django][3])

NOTA:

- Alguns cabeçalhos podem ser definidos na borda (CDN/proxy reverso). Se não estiver visível no código do aplicativo, sinalize como “verificar na borda”.

---

### DJANGO-CSP-001: Implante uma Política de Segurança de Conteúdo (CSP) como defesa profunda

Gravidade: Média (alta para aplicativos que renderizam conteúdo não confiável)

NOTA: É muito importante definir o script-src do CSP. Todas as outras directivas não são tão importantes e geralmente podem ser excluídas para facilitar o desenvolvimento.

Obrigatório:

- DEVE implantar um CSP para mitigar XSS e classes de injeção de conteúdo; Os documentos de segurança do Django recomendam o CSP e observam que ele é novo no Django 6.0. ([Projeto Django][2])
- DEVE compreender as limitações do CSP:
  - Evitar excluir rotas da cobertura do CSP; Django avisa que uma página desprotegida pode prejudicar páginas protegidas devido à política de mesma origem. ([Projeto Django][2])

- PODE começar com `SECURE_CSP_REPORT_ONLY` para iterar com segurança (Django fornece suporte apenas para relatórios). ([Projeto Django][3])

Padrões inseguros:

- Nenhum CSP em aplicativos que renderizam conteúdo controlado pelo usuário.
- CSP exclui “apenas algumas páginas” (enfraquece a proteção geral), especialmente páginas com qualquer superfície de injeção. ([Projeto Django][2])
- O CSP utiliza diretivas excessivamente permissivas (por exemplo, o generalizado `unsafe-inline`) sem justificativa.

Dicas de detecção:

- Pesquise `SECURE_CSP`, `SECURE_CSP_REPORT_ONLY` e configuração de middleware CSP.
- Inspecione a configuração do proxy reverso/CDN para cabeçalhos CSP.

Correção:

- Implementar um CSP realista, idealmente apenas reportar primeiro e depois aplicar. ([Projeto Django][3])

---

### DJANGO-AUTH-001: O armazenamento de senhas deve usar hashers seguros do Django; a política de senha deve ser configurada

Gravidade: Alta

Obrigatório:

- DEVE usar o hashing de senha integrado do Django (nunca armazene texto simples ou senhas criptografadas reversíveis).
- DEVE preferir hashers modernos e manter os padrões atualizados; Django documenta `PASSWORD_HASHERS` e inclui opções modernas (variantes Argon2, bcrypt, scrypt, PBKDF2). ([Projeto Django][3])
- DEVE configurar `AUTH_PASSWORD_VALIDATORS` (o padrão é vazio) para a política de senha de produção. ([Projeto Django][3])

Padrões inseguros:

- Armazenamento de senha personalizado ou hash.
- Senhas em texto simples armazenadas em campos do banco de dados.
- Sem validação de senha em aplicativos voltados para o consumidor.

Dicas de detecção:

- Procure por `.set_password(` uso vs hashing manual.
- Inspecione as configurações de `PASSWORD_HASHERS` e `AUTH_PASSWORD_VALIDATORS`. ([Projeto Django][3])

Correção:

- Use APIs de modelo de usuário de autenticação do Django.
- Habilite validadores de senha adequados ao perfil de risco do produto. ([Projeto Django][3])

---

### DJANGO-AUTHZ-001: A autorização deve ser explícita e consistente

Gravidade: Alta

Obrigatório:

- DEVE impor verificações de autorização em todas as ações privilegiadas (visualizar, modificar, operações semelhantes às de administrador).
- NÃO DEVE confiar apenas em restrições da UI (por exemplo, ocultar botões) sem verificações de permissão do lado do servidor.
- DEVE usar as permissões/grupos do Django e os padrões de autorização por objeto quando aplicável.

Padrões inseguros:

- Visualizações que assumem que “o usuário está logado” implicam que “o usuário pode realizar uma ação”.
- Faltam verificações de autorização em endpoints de atualização/exclusão.

Dicas de detecção:

- Enumerar visualizações que modificam estado; garantir que eles validem a propriedade/permissão.
- Procure usar apenas `is_authenticated` ou apenas `is_staff` sem verificar o acesso em nível de objeto.

Correção:

- Adicione verificações de permissão explícitas e testes para acesso não autorizado.

---

### DJANGO-ADMIN-001: Django admin deve ser tratado como um alvo de alto valor

Gravidade: Alta

Obrigatório:

- DEVE garantir que o administrador esteja protegido por autenticação forte e transporte somente HTTPS (consulte DJANGO-HTTPS-001). ([Projeto Django][1])
- DEVE restringir a exposição do administrador (listas de permissões de rede, VPN, SSO ou controles de autenticação adicionais) quando possível.
- DEVE auditar extensões de administrador instaladas e aplicativos de terceiros para exposição a XSS/CSRF.

Padrões inseguros:

- Administrador exposto à Internet com autenticação fraca.
- Admin servido por HTTP.

Dicas de detecção:

- Pesquise `urlpatterns` por `admin.site.urls`.
- Verifique a configuração de implantação para lista de permissões de IP ou gateways de autenticação.

Correção:

- Adicione controles de rede e aplique HTTPS.

---

### DJANGO-LOG-001: O registro e o relatório de erros não devem vazar segredos

Gravidade: Média a Alta

Obrigatório:

- NÃO DEVE registrar segredos (incluindo `SECRET_KEY`, cookies de sessão, cabeçalhos de autenticação, tokens de redefinição de senha).
- DEVE configurar o registro de produção deliberadamente; A lista de verificação de implantação do Django exige explicitamente a revisão do log antes da produção. ([Projeto Django][1])
- DEVE garantir `DEBUG=False` na produção para que as exceções não sejam renderizadas com contexto sensível. ([Projeto Django][1])

Padrões inseguros:

- Registrar cabeçalhos de solicitação completos ou cookies em produção.
- Impressão de dicionários de configurações.
- Depurar páginas de erro.

Dicas de detecção:

- Inspecione a configuração `LOGGING`; procure por middleware que registre cabeçalhos/cookies de solicitação.
- Grep para padrões `print(settings` / `logging.info(request.META)`.

Correção:

- Redigir valores sensíveis; IDs de log, não segredos.
- Use registro estruturado e uma ferramenta segura de monitoramento de erros. ([Projeto Django][1])

---

### DJANGO-SUPPLY-001: Dependência e higiene de patches (Django + dependências críticas de segurança)

Gravidade: Média (alta se versões vulneráveis forem conhecidas)

Obrigatório:

- DEVE fixar e atualizar regularmente o Django e dependências críticas de segurança.
- DEVE responder prontamente aos lançamentos de segurança do Django.

Dicas de detecção:

- Verifique `requirements.txt`, lockfiles, construa imagens.
- Identificar a versão do Django; compare com a versão mais recente suportada (a página de download do Django publica as ramificações atuais estáveis ​​e suportadas). ([Projeto Django][9])

Correção:

- Atualização para versões corrigidas; adicione testes de regressão para classes anteriormente vulneráveis.

---

## 5) Heurísticas práticas de varredura (como “caçar”)

Ao digitalizar ativamente, use estes padrões de sinal alto:

- Servidor de implantação/desenvolvimento:
  - `manage.py runserver`, `runserver 0.0.0.0`, `--insecure` ([Projeto Django][1])

- Depuração/configurações:
  - `DEBUG = True` ([Projeto Django][1])
  - `SECRET_KEY =`, `SECRET_KEY_FALLBACKS` ([Projeto Django][1])

- Validação de host:
  - `ALLOWED_HOSTS = ['*']` ([Projeto Django][3])

- HTTPS e proxy:
  - `SECURE_SSL_REDIRECT`, `SECURE_HSTS_SECONDS`, `SECURE_PROXY_SSL_HEADER` ([Projeto Django][3])

- Cookies/sessões:
  - `SESSION_COOKIE_SECURE`, `SESSION_COOKIE_HTTPONLY`, `SESSION_COOKIE_SAMESITE` ([Projeto Django][3])
  - `CSRF_COOKIE_SECURE`, `CSRF_COOKIE_HTTPONLY`, `CSRF_COOKIE_SAMESITE` ([Projeto Django][3])

- Desvios de CSRF:
  - `csrf_exempt`, falta `CsrfViewMiddleware`, formulários POST sem `{% csrf_token %}` ([Projeto Django][4])

- XSS:
  - `|safe`, `autoescape off`, `mark_safe(`, concatenação de strings HTML ([Projeto Django][5])

- Injeção SQL:
  - `.raw(`, `.extra(`, `RawSQL(`, `cursor.execute(` com strings SQL formatadas ([Projeto Django][7])

- Uploads/mídia do usuário:
  - `request.FILES`, `MEDIA_ROOT`, `MEDIA_URL`, servindo mídia inline; `MEDIA_ROOT == STATIC_ROOT` ([Projeto Django][1])

- Redirecionamentos:
  - padrões `redirect(request.GET.get("next"))`; falta de validação da lista de permissões

- Cabeçalhos de segurança e CSP:
  - Falta `SecurityMiddleware`, falta de proteção X-Frame-Options, falta de adoção de `SECURE_CSP` (quando apropriado) ([Projeto Django][2])

Sempre tente confirmar:

- origem dos dados (não confiável versus confiável)
- tipo de coletor (template/SQL/subprocess/files/redirect/http)
- controles de proteção presentes (middleware, validação, listas de permissões, verificações de autorização)
- se os cabeçalhos/controles de segurança são definidos no aplicativo ou na borda

---

## 6) Fontes (acessado em 27/01/2026)

Documentação primária do Django:```text

- Django Downloads (current stable & supported branches): https://www.djangoproject.com/download/
- Django 6.0 Release Notes: https://docs.djangoproject.com/en/6.0/releases/6.0/
- Django: Deployment checklist (incl. check --deploy, runserver warning, HTTPS/cookies guidance): https://docs.djangoproject.com/en/6.0/howto/deployment/checklist/
- Django: Settings reference (SecurityMiddleware settings, cookies, SECRET_KEY_FALLBACKS, CSP settings): https://docs.djangoproject.com/en/6.0/ref/settings/
- Django: Security in Django (XSS/CSRF/SQLi/clickjacking/HTTPS/host header validation/uploads/CSP): https://docs.djangoproject.com/en/6.0/topics/security/
- Django: CSRF how-to (middleware, csrf_token usage, AJAX header patterns, csrf_exempt cautions): https://docs.djangoproject.com/en/6.0/howto/csrf/
- Django: Performing raw SQL queries (parameterization guidance): https://docs.djangoproject.com/en/6.0/topics/db/sql/
- Django: QuerySet API reference (extra() cautions; “do not quote placeholders” guidance): https://docs.djangoproject.com/en/6.0/ref/models/querysets/
- Django: Template built-ins (autoescape tag): https://docs.djangoproject.com/en/6.0/ref/templates/builtins/
- Django: Template language reference (turning off autoescape & risks): https://docs.djangoproject.com/en/6.0/ref/templates/language/
- Django: Utilities reference (e.g., format_html): https://docs.djangoproject.com/en/6.0/ref/utils/

````
OWASP:```text
- OWASP Cheat Sheet Series: Django Security Cheat Sheet: https://cheatsheetseries.owasp.org/cheatsheets/Django_Security_Cheat_Sheet.html
````

[1]: https://docs.djangoproject.com/en/6.0/howto/deployment/checklist/ 'https://docs.djangoproject.com/en/6.0/howto/deployment/checklist/'
[2]: https://docs.djangoproject.com/en/6.0/topics/security/ 'Segurança no Django | Documentação do Django | Django'
[3]: https://docs.djangoproject.com/en/6.0/ref/settings/ 'Configurações | Documentação do Django | Django'

[4]: https://docs.djangoproject.com/en/6.0/howto/csrf/ 'Como usar a proteção CSRF do Django | Dja

documentação de ONG | Django'
[5]: https://docs.djangoproject.com/en/6.0/ref/templates/builtins/ 'https://docs.djangoproject.com/en/6.0/ref/templates/builtins/'
[6]: https://docs.djangoproject.com/en/6.0/ref/utils/ 'https://docs.djangoproject.com/en/6.0/ref/utils/'
[7]: https://docs.djangoproject.com/en/6.0/topics/db/sql/ 'https://docs.djangoproject.com/en/6.0/topics/db/sql/'
[8]: https://docs.djangoproject.com/en/6.0/ref/models/querysets/ 'https:/

/docs.djangoproject.com/en/6.0/ref/models/querysets/'
[9]: https://www.djangoproject.com/download/ 'Baixar Django | Django'
