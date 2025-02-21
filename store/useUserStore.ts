import { defineStore } from 'pinia'

interface User {
  id: number
  name: string
  email: string
  email_verified_at: string
  created_at: string
  updated_at: string
  vendor_id: number
  roles: string[]
  permissions: string[]
}

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null as User | null
  }),
  actions: {
    setUser(userData: User) {
      this.user = userData
    },
    clearUser() {
      this.user = null
    }
  },
  getters: {
    isAuthenticated: (state) => !!state.user,
    hasPermission: (state) => (permission: string) => state.user?.permissions.includes(permission) ?? false
  }
})
