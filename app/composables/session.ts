import {useState} from "#app";
import type {UserSession} from "#shared/types/UserSession.ts";

export function useUserSession() {
    const session = useState<UserSession>('userSession', () => ({
        loggedIn: false,
        user: null
    }));
    const requestFetch = useRequestFetch();

    async function refresh() {
        session.value = await requestFetch<UserSession>("/api/public/session");
    }

    return {
        session,
        refresh
    }
}
