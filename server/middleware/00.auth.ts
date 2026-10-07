import {useUserSession} from "~/utils/parseUserSession.ts";
import {isPathUnderPrefix, isSafeRequestPath} from "#server/utils/path.ts";

const API_PATH_PREFIX = "/api";
const PUBLIC_API_PATH_PREFIX = `${API_PATH_PREFIX}/public`;

export default defineEventHandler(async (event) => {
    const pathname = event.path.split("?", 1)[0]?.toLowerCase();

    if (!pathname || !isSafeRequestPath(pathname)) {
        throw createError({statusCode: 400, statusMessage: "Malformed request"});
    }

    event.context.session = await useUserSession(event);

    const isAPIPath = isPathUnderPrefix(pathname, API_PATH_PREFIX);
    if (!isAPIPath) {
        return;
    }

    if (isPathUnderPrefix(pathname, PUBLIC_API_PATH_PREFIX)) {
        return;
    }

    if (!event.context.session.loggedIn) {
        throw createError({statusCode: 401, statusMessage: 'Unauthorized'});
    }
})

