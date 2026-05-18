import {useUserSession} from "~/utils/parseUserSession";
import {transfers, users} from "~~/db/schema";
import {eq, sum} from "drizzle-orm";

const unauthorized = createError({statusCode: 401, message: "Unauthorized"})

export default defineEventHandler(async (event) => {
    const userSession = await useUserSession(event);

    if (!userSession.loggedIn) {
        throw unauthorized
    }

    const db = useDatabase(event);

    const debits = await db.select({
        amount: sum(transfers.amount).mapWith(parseFloat),
        user: users,
    })
        .from(transfers) .where(eq(transfers.senderId, userSession.user.id))
        .groupBy(transfers.receiverId)
        .innerJoin(users, eq(users.id, transfers.receiverId))

    let credits = await db.select({
        amount: sum(transfers.amount).mapWith(parseFloat),
        user: users,
    })
        .from(transfers)
        .where(eq(transfers.receiverId, userSession.user.id))
        .groupBy(transfers.senderId)
        .innerJoin(users, eq(users.id, transfers.senderId))
    credits = credits.map(credit => ({amount: -credit.amount, user: credit.user}))

    const debts: {[key: number]: typeof debits[0]} = {}

    for (const debt of [...debits, ...credits]) {
        if (debt.user.id in debts) {
            debts[debt.user.id].amount += debt.amount
        } else {
            debts[debt.user.id] = debt
        }
    }

    return debts;
})
