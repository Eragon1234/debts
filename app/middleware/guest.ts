import {useUserSession} from "~/composables/session";

export default defineNuxtRouteMiddleware(() => {
  const {session} = useUserSession()

  if (session.value.loggedIn) {
    return navigateTo('/')
  }
})
