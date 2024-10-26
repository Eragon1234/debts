import {getUserSession} from "~/composables/session";

export default defineNuxtRouteMiddleware(() => {
  const {loggedIn} = getUserSession()

  if (loggedIn) {
    return navigateTo('/')
  }
})
