// lib/db/schema.ts
import { pgTable, text, serial, timestamp, boolean, varchar, integer, primaryKey } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }),
  role: varchar('role', { length: 50 }).default('author'), // 'admin' or 'author'
  isActive: boolean('is_active').default(true),
  bio: text('bio'), // User bio/description
  profileImage: text('profile_image'), // Cloudinary URL for profile picture
  coverImage: text('cover_image'), // Cloudinary URL for cover/header image
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const posts = pgTable('posts', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  content: text('content').notNull(),
  excerpt: text('excerpt'),
  coverImage: text('cover_image'), // New field for Cloudinary image URL
  published: boolean('published').default(false),
  authorId: integer('author_id').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const categories = pgTable('categories', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  slug: varchar('slug', { length: 100 }).notNull().unique(),
  description: text('description'),
});

export const postsToCategories = pgTable(
  'posts_to_categories',
  {
    postId: integer('post_id')
      .references(() => posts.id, { onDelete: 'cascade' })
      .notNull(),
    categoryId: integer('category_id')
      .references(() => categories.id, { onDelete: 'cascade' })
      .notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.postId, table.categoryId] }),
  }),
);

// Relations
export const postsRelations = relations(posts, ({ one, many }) => ({
  author: one(users, {
    fields: [posts.authorId],
    references: [users.id],
  }),
  categories: many(postsToCategories),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  posts: many(postsToCategories),
}));

export const postsToCategoriesRelations = relations(postsToCategories, ({ one }) => ({
  post: one(posts, {
    fields: [postsToCategories.postId],
    references: [posts.id],
  }),
  category: one(categories, {
    fields: [postsToCategories.categoryId],
    references: [categories.id],
  }),
}));