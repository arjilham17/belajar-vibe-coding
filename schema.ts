import { mysqlTable, serial, text, varchar, timestamp, int } from "drizzle-orm/mysql-core";
import { sql, relations } from "drizzle-orm";

export const users = mysqlTable("users", {
	id: serial("id").primaryKey(),
	name: varchar("name", { length: 255 }).notNull(),
	email: varchar("email", { length: 255 }).notNull().unique(),
	password: varchar("password", { length: 255 }).notNull(),
	createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const usersRelations = relations(users, ({ many }) => ({
	sessions: many(sessions),
}));

export const sessions = mysqlTable("sessions", {
	id: serial("id").primaryKey(),
	token: varchar("token", { length: 255 }).notNull(),
	userId: int("user_id").notNull().references(() => users.id),
	createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const sessionsRelations = relations(sessions, ({ one }) => ({
	user: one(users, {
		fields: [sessions.userId],
		references: [users.id],
	}),
}));
