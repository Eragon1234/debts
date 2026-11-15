import type {User} from "~~/db/db.ts";

export type LoggedInUserSession = {
    loggedIn: true,
    user: User
}

export type LoggedOutUserSession = {
    loggedIn: false,
    user: null
}

export type UserSession = LoggedInUserSession | LoggedOutUserSession