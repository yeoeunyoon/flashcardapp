import { sql } from "drizzle-orm";
import {sqliteTable, text, integer, } from "drizzle-orm/sqlite-core";
import { useSyncExternalStore } from "hono/jsx";

export const decks = sqliteTable("decks", {
  id: integer("id").primaryKey({autoIncrement: true}),
  title: text("title").notNull(),
  date: text("date")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, {onDelete: "cascade"}),
});

export const cards = sqliteTable('cards', {
  id: integer("id").primaryKey({autoIncrement: true}),
  deckId: integer("deck_id")
  .notNull()
  .references(() => decks.id),
  front: text("front").notNull(),
  back: text("back").notNull(),
  date: text("date")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, {onDelete: "cascade"}),
});

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  username: text("username").notNull().unique(),
  password_hash: text("password").notNull(),
});

export const sessions = sqliteTable("sessions", {
  id: text("id").notNull().primaryKey(), // must be a string for Lucia Auth
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
  expiresAt: integer("expires_at").notNull(),
});