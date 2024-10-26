import {drizzle} from "drizzle-orm/d1";
import type {D1Database} from "@cloudflare/workers-types";

import * as schema from "./schema";

export const tables = schema;

export function useDrizzle(database: D1Database) {
    return drizzle(database, {schema})
}

export type User = typeof schema.users.$inferSelect;
