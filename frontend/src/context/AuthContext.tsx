import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { login as apiLogin, register as apiRegister } from '../lib/api/auth'
import { getMe } from '../lib/api/users'
import type { User } from '../lib/api/users'

interface AuthContextValue {
  user: User | null
  token: string | null
  isLoading: boolean
  login: (username: string, password: string) => Promise<void>
  register: (username: string, email: string, password: string) => Promise<void>
  logout: () => void
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'))
  const [isLoading, setIsLoading] = useState(true)

  const refreshUser = useCallback(async () => {
    if (!localStorage.getItem('token')) { setIsLoading(false); return }
    try {
      const u = await getMe()
      setUser(u)
    } catch {
      localStorage.removeItem('token')
      setToken(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => { refreshUser() }, [refreshUser])

  const login = async (username: string, password: string) => {
    const t = await apiLogin({ username, password })
    localStorage.setItem('token', t.access_token)
    setToken(t.access_token)
    await refreshUser()
  }

  const register = async (username: string, email: string, password: string) => {
    await apiRegister({ username, email, password })
    await login(username, password)
  }

  const logout = () => {
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
