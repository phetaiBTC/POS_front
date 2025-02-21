import { useUserStore } from "~/store/useUserStore"
export default defineNuxtRouteMiddleware(async (to, from) => {
    const { $axios } = useNuxtApp();
    const userStore = useUserStore()
    const token = useCookie('token')
    if (!token.value) {
        return navigateTo('/auth')
    }
    if (!userStore.user) {
        try {
            const data = await $axios.get('/profile', { headers: { Authorization: `Bearer ${token.value}` } })
            // console.log(data.data);
            if (data.data) {
                userStore.setUser(data.data)
            }
        } catch (error) {
            console.error('Failed to fetch user data', error)
        }
    }
})