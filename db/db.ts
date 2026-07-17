import {drizzle} from "drizzle-orm/d1";
import type {D1Database} from "@cloudflare/workers-types";
import {relations} from "~~/db/relations";
import * as schema from "~~/db/schema";
import {users} from "~~/db/schema";

export const tables = schema;

export function useDrizzle(database: D1Database) {
    return drizzle(database, {relations})
}

export type User = typeof users.$inferSelect;
