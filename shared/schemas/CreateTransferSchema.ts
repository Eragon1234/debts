import {z} from "zod";

export const createTransferSchema = z.object({
    sender: z.number().int(),
    receivers: z.array(z.object({
        id: z.number(),
        username: z.string()
    })),
    amount: z.number(),
    description: z.string(),
    date: z.iso.date().default(() => new Date().toISOString())
})