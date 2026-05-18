import {H3Event} from "h3";
import {useDrizzle} from "~~/db/db";

export function useDatabase(event: H3Event) {
    return useDrizzle(event.context.cloudflare.env.DB);
}