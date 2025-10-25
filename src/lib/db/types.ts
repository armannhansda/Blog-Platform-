import { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { users, posts, categories, postsToCategories } from './schema';

// Select types (returned from queries)
export type User = InferSelectModel<typeof users>;
export type Post = InferSelectModel<typeof posts>;
export type Category = InferSelectModel<typeof categories>;
export type PostToCategory = InferSelectModel<typeof postsToCategories>;

// Insert types (used when inserting data)
export type NewUser = InferInsertModel<typeof users>;
export type NewPost = InferInsertModel<typeof posts>;
export type NewCategory = InferInsertModel<typeof categories>;
export type NewPostToCategory = InferInsertModel<typeof postsToCategories>;

// Post with relations
export type PostWithRelations = Post & {
  author: User;
  categories: (PostToCategory & {
    category: Category;
  })[];
};

// Category with posts
export type CategoryWithPosts = Category & {
  posts: (PostToCategory & {
    post: Post & {
      author: User;
    };
  })[];
};