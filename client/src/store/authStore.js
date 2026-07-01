import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: (token, user) => {
        set({ token, user, isAuthenticated: true })
        localStorage.setItem('token', token)
      },
      logout: () => {
        set({ user: null, token: null, isAuthenticated: false })
        localStorage.removeItem('token')
      },
      setUser: (user) => set({ user }),
    }),
    { name: 'auth-storage' }
  )
)