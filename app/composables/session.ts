import type {User} from "~~/db/db";
import {useState} from "#app";

export type LoggedInUserSession = {
    loggedIn: true,
    user: User
}

export type LoggedOutUserSession = {
    loggedIn: false,
    user: null
}

export type UserSession = LoggedInUserSession | LoggedOutUserSession

const useUserSession = () => useState<UserSession>('userSession', () => ({
    loggedIn: false,
    user: null
}));

export function getUserSession() {
    return useUserSession().value
}

export function setUserSession(userSession: UserSession) {
    useUserSession().value = userSession
}
