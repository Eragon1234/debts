import {integer, sqliteTable, text} from "drizzle-orm/sqlite-core";
import {relations} from "drizzle-orm";

export const users = sqliteTable('users', {
    id: integer('id').primaryKey(),
    username: text('username').notNull().unique(),
    name: text('name').notNull(),
})

export const passwordCredentials = sqliteTable('password_credentials', {
    userId: integer('user_id').references(() => users.id, {onDelete: 'cascade'}).notNull(),
    password: text('password').notNull()
})

export const transfers = sqliteTable('transfers', {
    id: integer('id').primaryKey(),
    senderId: integer('sender_id').references(() => users.id, {onDelete: 'cascade'}).notNull(),
    receiverId: integer('receiver_id').references(() => users.id, {onDelete: 'cascade'}).notNull(),
    amount: integer('amount').notNull(),
    description: text('description').notNull(),
    date: text('date').notNull()
})

export const usersRelations = relations(users, ({many}) => ({
    passwordCredentials: many(passwordCredentials),
    sentTransfers: many(transfers, {
        field: 'senderId'
    }),
    receivedTransfers: many(transfers, {
        field: 'receiverId'
    })
}));

export const passwordCredentialsRelations = relations(passwordCredentials, ({one}) => ({
    user: one(users, {
        fields: [passwordCredentials.userId],
        references: [users.id]
    })
}))

export const transfersRelations = relations(transfers, ({one}) => ({
    sender: one(users, {
        fields: [transfers.senderId],
        references: [users.id]
    }),
    receiver: one(users, {
        fields: [transfers.receiverId],
        references: [users.id]
    })
}));
