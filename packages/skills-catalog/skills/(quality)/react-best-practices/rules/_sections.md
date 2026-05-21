# Seções

Define todas as seções, ordenação e descrições. O prefixo do nome dos arquivos de regra (entre parênteses) deve coincidir com o prefixo de cada grupo.

---

## 1. Eliminar cascatas (async)

**Impact:** CRITICAL  
**Descrição:** Cascatas são o maior vilão da performance: cada `await` sequencial acumula toda a latência de rede. Eliminar isso traz os maiores ganhos.

## 2. Otimização de bundle (bundle)

**Impact:** CRITICAL  
**Descrição:** Reduzir o bundle inicial melhora o Time to Interactive e o Largest Contentful Paint.

## 3. Performance no servidor (server)

**Impact:** HIGH  
**Descrição:** Otimizar SSR e busca no servidor elimina cascatas server-side e encurta o tempo de resposta.

## 4. Busca de dados no cliente (client)

**Impact:** MEDIUM-HIGH  
**Descrição:** Deduplicação e padrões de fetch bem escolhidos reduzem chamadas repetidas à rede.

## 5. Otimização de re-render (rerender)

**Impact:** MEDIUM  
**Descrição:** Menos re-renders desnecessários reduzem CPU gasto à toa e deixam a UI mais fluida.

## 6. Performance de renderização (rendering)

**Impact:** MEDIUM  
**Descrição:** Melhorias na renderização reduzem o trabalho do navegador para pintar e atualizar.

## 7. Performance em JavaScript (js)

**Impact:** LOW-MEDIUM  
**Descrição:** Microssugestões em código quente somam efeitos relevantes quando medidos.

## 8. Padrões avançados (advanced)

**Impact:** LOW  
**Descrição:** Padrões pontuais que exigem atenção extra na migração e na manutenção.
