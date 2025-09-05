import type {User} from "~~/db/db";
import {useState} from "#app";

export type UserSession = {
    loggedIn: false, user: null
} | {
    loggedIn: true, user: User
}

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
