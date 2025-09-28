import {z} from "zod";
import {createInsertSchema} from "drizzle-zod";
import {tables} from "~~/db/db";

export const createUserSchema = createInsertSchema(tables.users).extend({
    password: z.string().min(1).trim()
});
