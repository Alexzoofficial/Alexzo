import { pgTable, text, serial, timestamp, integer } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const apiKeys = pgTable("api_keys", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  userName: text("user_name"),
  name: text("name").notNull(),
  key: text("key").notNull().unique(),
  created: timestamp("created").defaultNow().notNull(),
  lastUsed: timestamp("last_used"),
  requestCount: integer("request_count").default(0),
});

export type ApiKey = typeof apiKeys.$inferSelect;
export type InsertApiKey = typeof apiKeys.$inferInsert;
