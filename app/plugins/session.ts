export default defineNuxtPlugin(async (nuxtApp) => {
    if (import.meta.server || !nuxtApp.payload.serverRendered) {
        await useUserSession().refresh();
    }
})