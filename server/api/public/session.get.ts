import type {UserSession} from "#shared/types/UserSession.ts";

export default defineEventHandler(async (event): Promise<UserSession> => {
    return event.context.session;
});