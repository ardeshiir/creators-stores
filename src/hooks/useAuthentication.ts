import { useEffect, useState } from 'react'

import { parseCookies } from 'nookies'

const useAuthentication = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isGettingAuthState, setIsGettingAuthState] = useState<boolean>(true)
  const getLoginState = () => {
    setIsGettingAuthState(true)

    const cookies = parseCookies()
    const accessToken = cookies?.accessToken

    if (accessToken) {
      setIsAuthenticated(true)
    }

    setIsGettingAuthState(false)
  }

  useEffect(() => {
    getLoginState()
  }, [])

  return { isAuthenticated, isGettingAuthState, revalidate: getLoginState }
}

export default useAuthentication
