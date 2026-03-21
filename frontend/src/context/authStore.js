import { create } from 'zustand'
import api from '../utils/api'

const useAuthStore = create((set, get) => ({
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  token: localStorage.getItem('token') || null,
  loading: false,
  error: null,

  login: async (email, password) => {
    set({ loading: true, error: null })
    try {
      const { data } = await api.post('/auth/login', { email, password })
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      set({ user: data.user, token: data.token, loading: false })
      return data
    } catch (err) {
      set({ error: err.response?.data?.message || 'Login failed', loading: false })
      throw err
    }
  },

  register: async (name, email, password, role) => {
    set({ loading: true, error: null })
    try {
      const { data } = await api.post('/auth/register', { name, email, password, role })
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      set({ user: data.user, token: data.token, loading: false })
      return data
    } catch (err) {
      set({ error: err.response?.data?.message || 'Registration failed', loading: false })
      throw err
    }
  },

  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    set({ user: null, token: null })
  },

  updateUser: (userData) => {
    const updated = { ...get().user, ...userData }
    localStorage.setItem('user', JSON.stringify(updated))
    set({ user: updated })
  },

  fetchMe: async () => {
    try {
      const { data } = await api.get('/auth/me')
      localStorage.setItem('user', JSON.stringify(data))
      set({ user: data })
    } catch {}
  },

  clearError: () => set({ error: null }),
}))

export default useAuthStore
