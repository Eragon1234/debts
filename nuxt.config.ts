// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2026-10-01',
    devtools: {enabled: true},
    modules: ['@nuxt/ui', 'nitro-cloudflare-dev'],
    runtimeConfig: {
        jwtPrivateKey: "",
        oidcClientSecret: "",
        public: {
            oidcName: "",
            oidcDiscoveryURL: "",
            oidcClientID: "",
            oidcAutomatchUsername: false,
            jwtPublicKey: "",
            baseURL: ""
        }
    },
    routeRules: {},
    css: ['~/assets/css/main.css']
})