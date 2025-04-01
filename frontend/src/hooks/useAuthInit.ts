import { useEffect, useState } from 'react'
import { useSetAtom } from 'jotai'
import { authAtom } from '../store/authAtom'
import { fetchMe } from '../services/authService'

export function useAuthInit() {
  const setAuth = useSetAtom(authAtom)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMe()
      .then((user) => {
        setAuth(user)
      })
      .catch(() => {
        setAuth(null)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [setAuth])

  return loading
}
