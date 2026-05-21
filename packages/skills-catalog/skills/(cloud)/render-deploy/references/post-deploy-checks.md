# Verificações pós-implantação

Use isto após qualquer implantação ou criação de serviço. Seja breve; pare quando uma verificação falhar.

## 1) Confirme o status de implantação```

list_deploys(serviceId: "<service-id>", limit: 1)

````
- Espere `status: "ao vivo"`.
- Se o status falhar, inspecione os logs de compilação/tempo de execução imediatamente.

## 2) Verifique a integridade do serviço

- Acesse o endpoint de integridade (preferencial) ou `/` e confirme uma resposta 200.
- Se não houver nenhum ponto final de funcionamento, adicione um e reimplante.

## 3) Verifique os registros de erros recentes```
list_logs(resource: ["<service-id>"], level: ["error"], limit: 50)
````

- Se você vir uma assinatura de erro clara, vá para a correção correspondente em
  [troubleshooting-basics.md](troubleshooting-basics.md) ou
  [padrões de erro.md](padrões de erro.md).

## 4) Verifique env vars e ligação de porta

- Confirme se todos os env vars necessários estão definidos (especialmente os segredos marcados como `sync: false`).
- Certifique-se de que o aplicativo esteja vinculado a `0.0.0.0:$PORT` (não localhost).

## 5) Reimplante somente após corrigir a primeira falha

- Evite implantações repetidas sem alterações; corrigir um problema de cada vez.
