import { pgTable, serial, text, timestamp, boolean, integer, decimal, jsonb } from 'drizzle-orm/pg-core';

// Admin users table
export const adminUsers = pgTable('admin_users', {
  id: serial('id').primaryKey(),
  username: text('username').notNull().unique(),
  password: text('password').notNull(),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  role: text('role').notNull().default('admin'), // admin, editor
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Products table
export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  shortDescription: text('short_description').notNull(),
  fullDescription: text('full_description').notNull(),
  price: text('price').notNull(),
  priceRange: text('price_range').notNull(),
  frequency: text('frequency').notNull(),
  chip: text('chip').notNull(),
  memory: text('memory').notNull(),
  readRange: text('read_range').notNull(),
  protocol: text('protocol').notNull(),
  category: text('category').notNull(),
  subCategory: text('sub_category').notNull(),
  badge: text('badge'),
  moq: text('moq').notNull(),
  deliveryTime: text('delivery_time').notNull(),
  specifications: jsonb('specifications').$type<Record<string, string>>().notNull().default({}),
  features: jsonb('features').$type<string[]>().notNull().default([]),
  applications: jsonb('applications').$type<string[]>().notNull().default([]),
  keywords: jsonb('keywords').$type<string[]>().notNull().default([]),
  seoKeywords: jsonb('seo_keywords').$type<string[]>().notNull().default([]),
  stockStatus: text('stock_status').notNull().default('InStock'), // InStock, OutOfStock, PreOrder
  rating: decimal('rating', { precision: 2, scale: 1 }).notNull().default('0'),
  reviewCount: integer('review_count').notNull().default(0),
  image: text('image').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Blog posts table
export const blogPosts = pgTable('blog_posts', {
  id: serial('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  title: text('title').notNull(),
  excerpt: text('excerpt').notNull(),
  content: text('content').notNull(),
  category: text('category').notNull(),
  author: text('author').notNull(),
  authorBio: text('author_bio'),
  authorAvatar: text('author_avatar'),
  date: text('date').notNull(),
  readTime: text('read_time').notNull(),
  image: text('image').notNull(),
  tags: jsonb('tags').$type<string[]>().notNull().default([]),
  seoTitle: text('seo_title'),
  seoDescription: text('seo_description'),
  seoKeywords: jsonb('seo_keywords').$type<string[]>().notNull().default([]),
  published: boolean('published').notNull().default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});
