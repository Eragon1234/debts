// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2025-09-05',
    devtools: {enabled: true},
    modules: ['@nuxt/ui', 'nitro-cloudflare-dev'],
    runtimeConfig: {
        jwtPrivateKey: "",
        public: {
            jwtPublicKey: "",
        }
    },
    routeRules: {
        '/debts/*': {ssr: false}
    }
})