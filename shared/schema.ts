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

export const customApis = pgTable("custom_apis", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  userName: text("user_name"),
  userEmail: text("user_email").notNull(),
  name: text("name").notNull(),
  url: text("url"),
  link: text("link"),
  status: text("status").default("active").notNull(),
  apiKey: text("api_key").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type ApiKey = typeof apiKeys.$inferSelect;
export type InsertApiKey = typeof apiKeys.$inferInsert;
export type CustomApi = typeof customApis.$inferSelect;
export type InsertCustomApi = typeof customApis.$inferInsert;
