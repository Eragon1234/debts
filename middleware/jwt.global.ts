import {setUserSession} from "~/composables/session";
import {parseUserSession} from "~/utils/parseUserSession";

export default defineNuxtRouteMiddleware(async () => {
    const token = useCookie("jwt");

    if (token && token.value) {
        setUserSession(await parseUserSession(token.value, useRuntimeConfig()))
    }
})