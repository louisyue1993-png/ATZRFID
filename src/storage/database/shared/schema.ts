import { pgTable, serial, timestamp, text, boolean, integer, numeric } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const healthCheck = pgTable("health_check", {
  id: serial().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
});

// Products Table
export const products = pgTable("products", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  shortDescription: text("short_description").notNull(),
  fullDescription: text("full_description").notNull(),
  price: text("price").notNull(),
  priceRange: text("price_range").notNull(),
  frequency: text("frequency").notNull(),
  chip: text("chip").notNull(),
  memory: text("memory").notNull(),
  readRange: text("read_range").notNull(),
  protocol: text("protocol").notNull(),
  category: text("category").notNull(),
  subCategory: text("sub_category").notNull(),
  badge: text("badge"),
  moq: text("moq").notNull(),
  deliveryTime: text("delivery_time").notNull(),
  specifications: text("specifications").notNull(),
  features: text("features").notNull(),
  applications: text("applications").notNull(),
  keywords: text("keywords").notNull(),
  seoKeywords: text("seo_keywords").notNull(),
  stockStatus: text("stock_status").notNull().default("InStock"),
  rating: numeric("rating").notNull().default("4.5"),
  reviewCount: integer("review_count").notNull().default(0),
  image: text("image").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
});

// Blog Posts Table
export const blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  category: text("category").notNull(),
  author: text("author").notNull(),
  readTime: text("read_time").notNull(),
  image: text("image").notNull(),
  published: boolean("published").notNull().default(false),
  tags: text("tags").notNull(),
  seoKeywords: text("seo_keywords").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
});

// Page Content Table
export const pageContents = pgTable("page_contents", {
  id: integer("id").primaryKey(),
  page: text("page").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  content: text("content").notNull(),
  language: text("language").notNull().default("en"),
  meta: text("meta").notNull().default("{}"),
  updatedBy: text("updated_by").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
});

// Image Metadata Table
export const imageMetadata = pgTable("image_metadata", {
  id: serial("id").primaryKey(),
  filename: text("filename").notNull().unique(),
  url: text("url").notNull(),
  originalFilename: text("original_filename").notNull(),
  size: integer("size").notNull(),
  width: integer("width").notNull(),
  height: integer("height").notNull(),
  mimeType: text("mime_type").notNull(),
  category: text("category").notNull().default("general"),
  tags: text("tags").notNull().default("[]"),
  description: text("description"),
  descriptionZh: text("description_zh"),
  uploadedBy: text("uploaded_by").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
});

// System Settings Table
export const systemSettings = pgTable("system_settings", {
  id: serial("id").primaryKey(),
  key: text("key").notNull().unique(),
  value: text("value").notNull(),
  category: text("category").notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
});

// Orders Table
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  orderNumber: text("order_number").notNull().unique(),
  customerId: text("customer_id").notNull(),
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  customerPhone: text("customer_phone").notNull(),
  shippingAddress: text("shipping_address").notNull(),
  billingAddress: text("billing_address").notNull(),
  status: text("status").notNull().default("pending"), // pending, processing, shipped, delivered, cancelled
  subtotal: numeric("subtotal").notNull().default("0"),
  tax: numeric("tax").notNull().default("0"),
  shipping: numeric("shipping").notNull().default("0"),
  total: numeric("total").notNull().default("0"),
  currency: text("currency").notNull().default("USD"),
  notes: text("notes"),
  items: text("items").notNull().default("[]"), // JSON array
  paymentMethod: text("payment_method"),
  paymentStatus: text("payment_status").notNull().default("unpaid"), // unpaid, paid, refunded
  trackingNumber: text("tracking_number"),
  createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
});

// Customers Table
export const customers = pgTable("customers", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone"),
  company: text("company"),
  address: text("address"),
  city: text("city"),
  state: text("state"),
  zipCode: text("zip_code"),
  country: text("country"),
  totalOrders: integer("total_orders").notNull().default(0),
  totalSpent: numeric("total_spent").notNull().default("0"),
  status: text("status").notNull().default("active"), // active, inactive, blocked
  lastOrderDate: timestamp("last_order_date", { withTimezone: true, mode: 'string' }),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
});

// FAQs Table
export const faqs = pgTable("faqs", {
  id: serial("id").primaryKey(),
  question: text("question").notNull(),
  questionZh: text("question_zh").notNull(),
  answer: text("answer").notNull(),
  answerZh: text("answer_zh").notNull(),
  category: text("category").notNull(),
  language: text("language").notNull().default("en"),
  order: integer("order").notNull().default(0),
  published: boolean("published").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
});

// Navigation Menus Table
export const navigationMenus = pgTable("navigation_menus", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  titleZh: text("title_zh").notNull(),
  slug: text("slug").notNull(),
  url: text("url").notNull(),
  parentId: integer("parent_id"),
  order: integer("order").notNull().default(0),
  language: text("language").notNull().default("en"),
  published: boolean("published").notNull().default(true),
  icon: text("icon"),
  openInNewTab: boolean("open_in_new_tab").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
});

// Website Statistics Table
export const websiteStatistics = pgTable("website_statistics", {
  id: serial("id").primaryKey(),
  date: text("date").notNull().unique(),
  pageViews: integer("page_views").notNull().default(0),
  uniqueVisitors: integer("unique_visitors").notNull().default(0),
  sessions: integer("sessions").notNull().default(0),
  bounceRate: numeric("bounce_rate").notNull().default("0"),
  avgSessionDuration: integer("avg_session_duration").notNull().default(0), // in seconds
  productViews: integer("product_views").notNull().default(0),
  ordersCount: integer("orders_count").notNull().default(0),
  revenue: numeric("revenue").notNull().default("0"),
  createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
});
