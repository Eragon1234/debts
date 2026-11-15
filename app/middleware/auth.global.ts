import {useUserSession} from "~/composables/session.ts";

export default defineNuxtRouteMiddleware(to => {
    const {session} = useUserSession();

    if (to.meta.groups?.includes("guest") && session.value.loggedIn) {
        return navigateTo("/");
    }

    if (to.meta.groups?.includes("protected") && !session.value.loggedIn) {
        return navigateTo("/signin");
    }
})
