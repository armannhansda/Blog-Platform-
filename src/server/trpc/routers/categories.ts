import { TRPCError } from "@trpc/server";
import { desc, eq, inArray, type SQL } from "drizzle-orm";
import { z } from "zod";

import { generateSlug, generateFallbackSlug } from "@/lib/utils/slug";
import { categories } from "@/lib/db/schema";
import { categoryIdSchema, createCategorySchema, updateCategorySchema } from "@/lib/validation/categories";

import type { Context } from "../context";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { validatedProcedure } from "../middlewares/validation";

const slugInputSchema = z.object({ slug: z.string().min(1) });

type CategoryRecord = typeof categories.$inferSelect;

/**
 * Generates and ensures a unique slug for a category
 * 
 * @param ctx - Database context for querying
 * @param source - Source text for slug generation (name or custom slug)
 * @param excludeId - Optional ID to exclude from uniqueness check (for updates)
 * @returns A unique slug for the category
 */
async function ensureUniqueCategorySlug(ctx: Context, source: string, excludeId?: string | number): Promise<string> {
  // Generate base slug or use fallback
  const base = generateSlug(source) || generateFallbackSlug("category");
  
  // Return immediately if below certain length (likely already a custom slug)
  if (base.length <= 3 && source === base) {
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
    
    const existing = await ctx.db.query.categories.findFirst({
      where: eq(categories.slug, candidate),
      columns: { id: true },
    });

    // If no existing category found with this slug, or it's the same category we're updating
    if (!existing || (excludeIdNum !== undefined && existing.id === excludeIdNum)) {
      return candidate;
    }

    // Try with an incremented suffix
    candidate = `${base}-${suffix++}`;
  }
  
  // If we've tried too many times, use a timestamp to ensure uniqueness
  return `${base.substring(0, 40)}-${Date.now().toString().slice(-8)}`;
}

export const categoriesRouter = createTRPCRouter({
  list: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.query.categories.findMany({
      orderBy: desc(categories.name),
    });
  }),
  getById: validatedProcedure(categoryIdSchema).query(async ({ ctx, input }) => {
    // Convert string IDs to numbers if needed
    const categoryId = typeof input === 'string' ? Number(input) : input;
    
    const category = await ctx.db.query.categories.findFirst({
      where: eq(categories.id, categoryId),
    });

    if (!category) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Category not found" });
    }

    return category;
  }),
  getBySlug: validatedProcedure(slugInputSchema).query(async ({ ctx, input }) => {
    const category = await ctx.db.query.categories.findFirst({
      where: eq(categories.slug, input.slug),
    });

    if (!category) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Category not found" });
    }

    return category;
  }),
  create: validatedProcedure(createCategorySchema).mutation(async ({ ctx, input }) => {
    const slug = await ensureUniqueCategorySlug(ctx, input.slug ?? input.name);

    try {
      const [created] = await ctx.db
        .insert(categories)
        .values({
          name: input.name,
          slug,
          description: input.description,
        })
        .returning();

      return created;
    } catch (error) {
      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Unable to create category", cause: error });
    }
  }),
  update: validatedProcedure(updateCategorySchema).mutation(async ({ ctx, input }) => {
    const { id, name, slug: providedSlug, description } = input;
    
    // Convert string IDs to numbers if needed
    const categoryId = typeof id === 'string' ? Number(id) : id;

    const existing = await ctx.db.query.categories.findFirst({
      where: eq(categories.id, categoryId),
      columns: {
        id: true,
        name: true,
      },
    });

    if (!existing) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Category not found" });
    }

    const slug = providedSlug 
      ? await ensureUniqueCategorySlug(ctx, providedSlug, categoryId)
      : name
          ? await ensureUniqueCategorySlug(ctx, name, categoryId)
          : undefined;

    try {
      const [updated] = await ctx.db
        .update(categories)
        .set({
          name,
          slug,
          description,
        })
        .where(eq(categories.id, categoryId))
        .returning();

      return updated;
    } catch (error) {
      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Unable to update category", cause: error });
    }
  }),
  delete: validatedProcedure(categoryIdSchema).mutation(async ({ ctx, input }) => {
    try {
      // Convert string IDs to numbers if needed
      const categoryId = typeof input === 'string' ? Number(input) : input;
      
      const [deleted] = await ctx.db
        .delete(categories)
        .where(eq(categories.id, categoryId))
        .returning({ id: categories.id });

      if (!deleted) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Category not found" });
      }

      return { id: deleted.id };
    } catch (error) {
      if (error instanceof TRPCError) {
        throw error;
      }

      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Unable to delete category", cause: error });
    }
  }),
});