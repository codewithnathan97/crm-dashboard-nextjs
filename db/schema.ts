import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

// Customers table
export const customers = sqliteTable('customers', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  phone: text('phone'),
  company: text('company'),
  position: text('position'),
  status: text('status').notNull().default('active'), // active, prospect, inactive
  value: real('value').default(0), // Total customer value
  source: text('source'), // website, referral, cold-call, email, social-media
  avatar: text('avatar'), // Avatar URL
  lastContact: text('last_contact'), // ISO date string
  assignedTo: text('assigned_to'),
  createdAt: text('created_at').notNull().default(sql`(datetime('now'))`),
  updatedAt: text('updated_at').notNull().default(sql`(datetime('now'))`),
});

// Deals table
export const deals = sqliteTable('deals', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  customerId: integer('customer_id').notNull().references(() => customers.id, { onDelete: 'cascade' }),
  customerName: text('customer_name'), // Denormalized for easier queries
  value: real('value').notNull(),
  stage: text('stage').notNull().default('prospecting'), // prospecting, qualification, proposal, negotiation, closed-won, closed-lost
  probability: integer('probability').notNull().default(0), // 0-100
  expectedCloseDate: text('expected_close_date'), // ISO date string
  actualCloseDate: text('actual_close_date'), // ISO date string
  description: text('description'),
  assignedTo: text('assigned_to'),
  createdAt: text('created_at').notNull().default(sql`(datetime('now'))`),
  updatedAt: text('updated_at').notNull().default(sql`(datetime('now'))`),
});

// Activities table
export const activities = sqliteTable('activities', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  type: text('type').notNull(), // call, email, meeting, note, task, deal-won, deal-created
  title: text('title').notNull(),
  description: text('description'),
  customerId: integer('customer_id').references(() => customers.id, { onDelete: 'cascade' }),
  customerName: text('customer_name'), // Denormalized
  dealId: integer('deal_id').references(() => deals.id, { onDelete: 'cascade' }),
  dealTitle: text('deal_title'), // Denormalized
  dueDate: text('due_date'), // ISO date string
  completedAt: text('completed_at'), // ISO date string
  status: text('status').notNull().default('pending'), // pending, completed, cancelled
  assignedTo: text('assigned_to'),
  createdAt: text('created_at').notNull().default(sql`(datetime('now'))`),
  updatedAt: text('updated_at').notNull().default(sql`(datetime('now'))`),
});

// Notes table
export const notes = sqliteTable('notes', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  content: text('content').notNull(),
  customerId: integer('customer_id').references(() => customers.id, { onDelete: 'cascade' }),
  dealId: integer('deal_id').references(() => deals.id, { onDelete: 'cascade' }),
  createdBy: text('created_by'),
  createdAt: text('created_at').notNull().default(sql`(datetime('now'))`),
  updatedAt: text('updated_at').notNull().default(sql`(datetime('now'))`),
});

// Types for TypeScript
export type Customer = typeof customers.$inferSelect;
export type NewCustomer = typeof customers.$inferInsert;

export type Deal = typeof deals.$inferSelect;
export type NewDeal = typeof deals.$inferInsert;

export type Activity = typeof activities.$inferSelect;
export type NewActivity = typeof activities.$inferInsert;

export type Note = typeof notes.$inferSelect;
export type NewNote = typeof notes.$inferInsert;

