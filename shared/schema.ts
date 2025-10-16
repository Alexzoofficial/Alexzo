import { pgTable, uuid, text, timestamp, boolean, varchar, integer, decimal, date } from 'drizzle-orm/pg-core';

export const profiles = pgTable('profiles', {
  id: uuid('id').primaryKey(),
  email: text('email').notNull().unique(),
  fullName: text('full_name'),
  avatarUrl: text('avatar_url'),
  passwordHash: text('password_hash'),
  provider: text('provider').default('email'),
  providerId: text('provider_id'),
  lastSignIn: timestamp('last_sign_in', { withTimezone: true }).defaultNow(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

export const newsletterSubscriptions = pgTable('newsletter_subscriptions', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  subscribedAt: timestamp('subscribed_at', { withTimezone: true }).defaultNow(),
  source: varchar('source', { length: 50 }).default('website'),
  active: boolean('active').default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const waitlistSubmissions = pgTable('waitlist_submissions', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  product: varchar('product', { length: 100 }).notNull(),
  company: varchar('company', { length: 255 }),
  useCase: text('use_case'),
  submittedAt: timestamp('submitted_at', { withTimezone: true }).defaultNow(),
  source: varchar('source', { length: 50 }).default('website'),
  status: varchar('status', { length: 50 }).default('pending'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const contactSubmissions = pgTable('contact_submissions', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  company: varchar('company', { length: 255 }),
  subject: varchar('subject', { length: 500 }).notNull(),
  category: varchar('category', { length: 100 }).notNull(),
  message: text('message').notNull(),
  submittedAt: timestamp('submitted_at', { withTimezone: true }).defaultNow(),
  source: varchar('source', { length: 50 }).default('website'),
  status: varchar('status', { length: 50 }).default('new'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const apis = pgTable('apis', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id'),
  name: text('name').notNull(),
  description: text('description'),
  endpoint: text('endpoint').notNull(),
  method: text('method').notNull().default('GET'),
  status: text('status').notNull().default('active'),
  apiKey: text('api_key').notNull().unique(),
  requestsCount: integer('requests_count').default(0),
  successRate: decimal('success_rate', { precision: 5, scale: 2 }).default('100.00'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

export const apiAnalytics = pgTable('api_analytics', {
  id: uuid('id').primaryKey().defaultRandom(),
  apiId: uuid('api_id'),
  requestCount: integer('request_count').default(0),
  successCount: integer('success_count').default(0),
  errorCount: integer('error_count').default(0),
  date: date('date').defaultNow(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});
