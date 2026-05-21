---
title: Use SWR para desduplicação automática
impact: MEDIUM-HIGH
impactDescription: desduplicação automática
tags: client, swr, deduplication, data-fetching
---

## Use SWR para desduplicação automática

O SWR habilita desduplicação de requisições, cache e revalidação entre instâncias de componentes.

**Incorreto (sem desduplicação; cada instância busca):**

```tsx
function UserList() {
  const [users, setUsers] = useState([])
  useEffect(() => {
    fetch('/api/users')
      .then((r) => r.json())
      .then(setUsers)
  }, [])
}
```

**Correto (várias instâncias comuns a uma requisição):**

```tsx
import useSWR from 'swr'

function UserList() {
  const { data: users } = useSWR('/api/users', fetcher)
}
```

**Para dados imutáveis:**

```tsx
import { useImmutableSWR } from '@/lib/swr'

function StaticContent() {
  const { data } = useImmutableSWR('/api/config', fetcher)
}
```

**Para mutações:**

```tsx
import { useSWRMutation } from 'swr/mutation'

function UpdateButton() {
  const { trigger } = useSWRMutation('/api/user', updateUser)
  return <button onClick={() => trigger()}>Update</button>
}
```

Referência: [https://swr.vercel.app](https://swr.vercel.app)
