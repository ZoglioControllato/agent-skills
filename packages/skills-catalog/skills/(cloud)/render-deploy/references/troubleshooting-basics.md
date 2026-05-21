# Solução de problemas básicos (tempo de implantação e inicialização)

Use-o quando uma implantação falhar, o serviço falhar na inicialização ou o tempo limite das verificações de integridade expirar.
Mantenha as correções mínimas e reimplante após cada alteração.

## 1) Classifique a falha

- **Falha na compilação**: erros nos logs de compilação, dependências ausentes, problemas de comando de compilação.
- **Falha na inicialização**: o aplicativo fecha rapidamente, trava ou não pode ser vinculado a `$PORT`.
- **Falha no tempo de execução/integridade**: o serviço está ativo, mas as verificações de integridade falham ou ocorrem erros 5xx.

## 2) Verificações rápidas por turma

**Falha na compilação**

- Confirme se o comando de construção está correto para o tempo de execução.
- Certifique-se de que as dependências necessárias estejam presentes em `package.json`, `requirements.txt`, etc.
- Verifique se há variáveis de ambiente de tempo de construção ausentes.

**Falha na inicialização**

- Confirme o comando de início e o diretório de trabalho.
- Certifique-se de que a ligação da porta seja `0.0.0.0:$PORT`.
- Verifique se há variáveis ​​de ambiente de tempo de execução ausentes (segredos, URLs de banco de dados).

**Falha no tempo de execução/integridade**

- Verifique o caminho e a resposta do endpoint de integridade.
- Confirme se o aplicativo está realmente escutando em `$PORT`.
- Verifique a conectividade e migrações do banco de dados.

## 3) Mapeie assinaturas de erros para correções

Use [error-patterns.md](error-patterns.md) para um catálogo compacto de mensagens de log comuns.

## 4) Se ainda estiver bloqueado

Reúna os logs de compilação e de erros de tempo de execução mais recentes e considere o opcional
Habilidade `render-debug` para diagnósticos mais profundos (métricas, verificações de banco de dados, padrões expandidos).
