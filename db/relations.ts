import * as schema from "./schema";
import {defineRelations} from "drizzle-orm";

export const relations = defineRelations(schema, (r) => ({
    users: {
        passwordCredentials: r.many.passwordCredentials(),
        sentTransfers: r.many.transfers({
            from: r.users.id,
            to: r.transfers.senderId
        }),
        receivedTransfers: r.many.transfers({
            from: r.users.id,
            to: r.transfers.receiverId
        })
    },
    passwordCredentials: {
        user: r.one.users({
            from: r.passwordCredentials.userId,
            to: r.users.id
        })
    },
    transfers: {
        sender: r.one.users({
            from: r.transfers.senderId,
            to: r.users.id
        }),
        receiver: r.one.users({
            from: r.transfers.receiverId,
            to: r.users.id
        })
    }
}))