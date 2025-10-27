import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { User } from '../types'

export const useAuthStore = defineStore('auth', () => {
    const user = ref<User | null>(null)
    const token = ref<string | null>(null)

    function setUser(u: User, t: string) {
        user.value = u
        token.value = t
        localStorage.setItem('token', t)
    }

    function logout() {
        user.value = null
        token.value = null
        localStorage.removeItem('token')
    }

    return { user, token, setUser, logout }
})
