import { TRPCError } from "@trpc/server";
import { desc, eq, inArray, type SQL } from "drizzle-orm";
import { z } from "zod";

import { generateSlug, generateFallbackSlug } from "@/lib/utils/slug";
import { categories, posts, postsToCategories, users } from "@/lib/db/schema";
import {
  assignCategoriesSchema,
  createPostSchema,
  filterPostsByCategorySchema,
  postIdSchema,
  updatePostSchema,
} from "@/lib/validation/posts";

import type { Context } from "../context";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { 
  validatedProcedure,
  authMiddleware,
  loggerMiddleware,
  permissionMiddleware
} from "../middlewares";

const slugInputSchema = z.object({ slug: z.string().min(1) });

type PostRecord = typeof posts.$inferSelect;
type CategoryRecord = typeof categories.$inferSelect;
type UserRecord = typeof users.$inferSelect;
type PostWithCategoryLinks = PostRecord & {
  categories: {
    category: CategoryRecord;
  }[];
  author?: UserRecord | null;
};

type PostResponse = PostRecord & {
  categories: CategoryRecord[];
  author?: UserRecord | null;
};

const mapPost = (post: PostWithCategoryLinks): PostResponse => ({
  ...post,
  categories: post.categories.map((link) => link.category),
});

/**
 * Generates and ensures a unique slug for a post
 * 
 * @param ctx - Database context for querying
 * @param source - Source text for slug generation (title or custom slug)
 * @param excludeId - Optional ID to exclude from uniqueness check (for updates)
 * @returns A unique slug for the post
 */
async function ensureUniquePostSlug(ctx: Context, source: string, excludeId?: string | number) {
  // Generate base slug or use fallback
  const base = generateSlug(source) || generateFallbackSlug("post");
  
  // Return immediately if below certain length (likely already a custom slug)
  if (base.length <= 5 && source === base) {
    const timestamp = Date.now().toString().slice(-6);
    return `${base}-${timestamp}`;
  }
  
  let candidate = base;
  let suffix = 1;
  const maxAttempts = 100; // Prevent infinite loop
  let attempts = 0;

  // Ensure excludeId is a number for comparison (if provided)
  const excludeIdNum = excludeId !== undefined ? Number(excludeId) : undefined;

  // Keep trying until we find a unique slug
  while (attempts < maxAttempts) {
    attempts++;
    
    const existing = await ctx.db.query.posts.findFirst({
      where: eq(posts.slug, candidate),
      columns: { id: true },
    });

    // If no existing post found with this slug, or it's the same post we're updating
    if (!existing || (excludeIdNum !== undefined && existing.id === excludeIdNum)) {
      return candidate;
    }

    // Try with an incremented suffix
    candidate = `${base}-${suffix++}`;
  }
  
  // If we've tried too many times, use a timestamp to ensure uniqueness
  return `${base.substring(0, 80)}-${Date.now().toString().slice(-8)}`;
}

async function assertCategoriesExist(ctx: Context, categoryIds: number[]) {
  if (!categoryIds.length) {
    return;
  }

  const uniqueIds = Array.from(new Set(categoryIds));
  const records = await ctx.db
    .select({ id: categories.id })
    .from(categories)
    .where(inArray(categories.id, uniqueIds));

  if (records.length !== uniqueIds.length) {
    throw new TRPCError({ code: "BAD_REQUEST", message: "One or more categories do not exist" });
  }
}

async function setPostCategories(ctx: Context, postId: number, categoryIds?: number[]) {
  if (!categoryIds) {
    return;
  }

  const uniqueIds = Array.from(new Set(categoryIds));
  await assertCategoriesExist(ctx, uniqueIds);

  await ctx.db.transaction(async (tx) => {
    await tx.delete(postsToCategories).where(eq(postsToCategories.postId, postId));

    if (!uniqueIds.length) {
      return;
    }

    await tx.insert(postsToCategories).values(
      uniqueIds.map((categoryId) => ({ postId, categoryId })),
    );
  });
}

async function fetchPost(ctx: Context, where: SQL<unknown>): Promise<PostResponse | null> {
  const record = await ctx.db.query.posts.findFirst({
    where,
    with: {
      categories: {
        with: {
          category: true,
        },
      },
      author: true,
    },
  });

  if (!record) {
    return null;
  }

  return mapPost(record as PostWithCategoryLinks);
}

export const postsRouter = createTRPCRouter({
  list: publicProcedure.query(async ({ ctx }) => {
    const rows = (await ctx.db.query.posts.findMany({
      orderBy: desc(posts.createdAt),
      with: {
        categories: {
          with: {
            category: true,
          },
        },
        author: true,
      },
    })) as PostWithCategoryLinks[];

    return rows.map((post) => mapPost(post));
  }),

  listByAuthor: publicProcedure
    .input(z.object({ authorId: z.number().int().positive() }))
    .query(async ({ ctx, input }) => {
      const rows = (await ctx.db.query.posts.findMany({
        where: eq(posts.authorId, input.authorId),
        orderBy: desc(posts.createdAt),
        with: {
          categories: {
            with: {
              category: true,
            },
          },
          author: true,
        },
      })) as PostWithCategoryLinks[];

      return rows.map((post) => mapPost(post));
    }),

  getById: validatedProcedure(postIdSchema).query(async ({ ctx, input }) => {
    // Convert string IDs to numbers if needed
    const postId = typeof input === 'string' ? Number(input) : input;
    const post = await fetchPost(ctx, eq(posts.id, postId));

    if (!post) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Post not found" });
    }

    return post;
  }),
  getBySlug: validatedProcedure(z.object({ slug: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      const post = await fetchPost(ctx, eq(posts.slug, input.slug));

      if (!post) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Post not found" });
      }

      return post;
    }),
  create: validatedProcedure(createPostSchema)
    .use(loggerMiddleware({ logInput: true }))
    .mutation(async ({ ctx, input }) => {
      console.log("[Posts.create] Starting post creation with input:", {
        title: input.title,
        slug: input.slug,
        authorId: input.authorId,
        categoryIds: input.categoryIds,
        coverImage: !!input.coverImage,
      });

      const slug = await ensureUniquePostSlug(ctx, input.slug ?? input.title);

      try {
        // Convert authorId to number if it's a string
        const authorId = typeof input.authorId === 'string' ? Number(input.authorId) : input.authorId;
        
        console.log("[Posts.create] Inserting post with:", {
          title: input.title,
          slug,
          authorId,
          coverImage: !!input.coverImage,
        });

        const [created] = await ctx.db
          .insert(posts)
          .values({
            title: input.title,
            slug,
            content: input.content,
            excerpt: input.excerpt,
            coverImage: input.coverImage || null,
            published: input.published ?? false,
            authorId,
          })
          .returning();

        console.log("[Posts.create] Post inserted with id:", created.id);

        // Convert categoryIds to numbers if needed
        const categoryIds = input.categoryIds?.map((id: string | number) => typeof id === 'string' ? Number(id) : id);
        await setPostCategories(ctx, created.id, categoryIds);
        const post = await fetchPost(ctx, eq(posts.id, created.id));

        if (!post) {
          throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Unable to load created post" });
        }
        
        console.log("[Posts.create] Post created successfully:", post.id);
        return post;
      } catch (error) {
        console.error("[Posts.create] Error creating post:", error);
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Unable to create post", cause: error });
      }
    }),
  update: validatedProcedure(updatePostSchema)
    .use(loggerMiddleware({ logInput: true }))
    .mutation(async ({ ctx, input }) => {
      // Convert string IDs to numbers if needed
      const postId = typeof input.id === 'string' ? Number(input.id) : input.id;
      
      const existing = await ctx.db.query.posts.findFirst({
        where: eq(posts.id, postId),
        columns: {
          id: true,
          title: true,
        },
      });

      if (!existing) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Post not found" });
      }

      const slugSource = input.slug ?? input.title ?? existing.title;
      const slug = await ensureUniquePostSlug(ctx, slugSource, postId);

      try {
        // Convert authorId to number if it's a string
        const authorId = input.authorId !== undefined 
          ? (typeof input.authorId === 'string' ? Number(input.authorId) : input.authorId)
          : undefined;
        
        await ctx.db
          .update(posts)
          .set({
            title: input.title ?? existing.title,
            slug,
            content: input.content,
            excerpt: input.excerpt,
            coverImage: input.coverImage,
            published: input.published,
            authorId,
            updatedAt: new Date(),
          })
          .where(eq(posts.id, postId));

        // Convert categoryIds to numbers if needed
        const categoryIds = input.categoryIds?.map((id: string | number) => typeof id === 'string' ? Number(id) : id);
        await setPostCategories(ctx, postId, categoryIds);
        const post = await fetchPost(ctx, eq(posts.id, postId));

        if (!post) {
          throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Unable to load updated post" });
        }

        return post;
      } catch (error) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Unable to update post", cause: error });
      }
    }),
  delete: validatedProcedure(postIdSchema)
    .use(loggerMiddleware({ logInput: true }))
    .mutation(async ({ ctx, input }) => {
      try {
        // Convert string IDs to numbers if needed
        const postId = typeof input === 'string' ? Number(input) : input;
        
        const [deleted] = await ctx.db
          .delete(posts)
          .where(eq(posts.id, postId))
          .returning({ id: posts.id });

        if (!deleted) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Post not found" });
        }

        return { id: deleted.id };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Unable to delete post", cause: error });
      }
    }),
  assignCategories: validatedProcedure(assignCategoriesSchema).mutation(async ({ ctx, input }) => {
    // Convert string IDs to numbers if needed
    const postId = typeof input.postId === 'string' ? Number(input.postId) : input.postId;
    
    const post = await ctx.db.query.posts.findFirst({
      where: eq(posts.id, postId),
      columns: { id: true },
    });

    if (!post) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Post not found" });
    }

    // Convert categoryIds to numbers if needed
    const categoryIds = input.categoryIds.map((id: string | number) => typeof id === 'string' ? Number(id) : id);
    await setPostCategories(ctx, postId, categoryIds);
    const updated = await fetchPost(ctx, eq(posts.id, postId));

    if (!updated) {
      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Unable to load updated post" });
    }

    return updated;
  }),
  filterByCategory: validatedProcedure(filterPostsByCategorySchema).query(async ({ ctx, input }) => {
    const categoryRecord = await ctx.db.query.categories.findFirst({
      where: eq(categories.slug, input.categorySlug),
      columns: { id: true },
    });

    if (!categoryRecord) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Category not found" });
    }

    const links = await ctx.db
      .select({ postId: postsToCategories.postId })
      .from(postsToCategories)
      .where(eq(postsToCategories.categoryId, categoryRecord.id));

    if (!links.length) {
      return [] as PostResponse[];
    }

    const postIds = links.map((link) => link.postId);
    const rows = (await ctx.db.query.posts.findMany({
      where: inArray(posts.id, postIds),
      orderBy: desc(posts.createdAt),
      with: {
        categories: {
          with: {
            category: true,
          },
        },
      },
    })) as PostWithCategoryLinks[];

    return rows.map((post) => mapPost(post));
  }),
});
