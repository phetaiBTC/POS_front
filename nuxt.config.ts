// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite"
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  components: true,
  devtools: { enabled: true },
  css: [
    '~/assets/css/main.css',
    'ant-design-vue/dist/reset.css',
    '@fortawesome/fontawesome-free/css/all.css'
  ],
  modules: [
    '@pinia/nuxt'
  ],
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
  plugins: [
    '~/plugins/i18n.ts',
  ]
  //#D4DBE3
  //#065AD7
})
