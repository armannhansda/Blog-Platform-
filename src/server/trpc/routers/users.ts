import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { z } from "zod";

import { users } from "@/lib/db/schema";
import type { Context } from "../context";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { validatedProcedure } from "../middlewares/validation";

const userIdSchema = z.number().int().positive();

const updateUserSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().optional(),
  email: z.string().email().optional(),
  bio: z.string().optional().nullable(),
  profileImage: z.string().optional().nullable(),
  coverImage: z.string().optional().nullable(),
});

const createAuthorSchema = z.object({
  name: z.string().min(1, "Author name is required"),
  email: z.string().email().optional(),
});

type UserRecord = typeof users.$inferSelect;

function excludePassword(user: UserRecord) {
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

export const usersRouter = createTRPCRouter({
  // Get all users/authors
  list: publicProcedure.query(async ({ ctx }) => {
    try {
      const allUsers = await ctx.db
        .select()
        .from(users)
        .orderBy(users.name);

      return allUsers.map(excludePassword);
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch users",
        cause: error,
      });
    }
  }),

  // Get user by ID
  getById: validatedProcedure(userIdSchema).query(async ({ ctx, input }) => {
    try {
      const user = await ctx.db.query.users.findFirst({
        where: eq(users.id, input),
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      return excludePassword(user);
    } catch (error) {
      if (error instanceof TRPCError) {
        throw error;
      }

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch user",
        cause: error,
      });
    }
  }),

  // Get user by email
  getByEmail: validatedProcedure(z.object({ email: z.string().email() }))
    .query(async ({ ctx, input }) => {
      try {
        const user = await ctx.db.query.users.findFirst({
          where: eq(users.email, input.email),
        });

        if (!user) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "User not found",
          });
        }

        return excludePassword(user);
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch user",
          cause: error,
        });
      }
    }),

  // Update user profile
  update: validatedProcedure(updateUserSchema).mutation(
    async ({ ctx, input }) => {
      try {
        const { id, name, email, bio, profileImage, coverImage } = input;

        // Validate user exists
        const user = await ctx.db.query.users.findFirst({
          where: eq(users.id, id),
        });

        if (!user) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "User not found",
          });
        }

        // Build update object with only provided fields
        const updateData: any = {
          updatedAt: new Date(),
        };

        if (name !== undefined) updateData.name = name;
        if (email !== undefined) updateData.email = email;
        if (bio !== undefined) updateData.bio = bio;
        if (profileImage !== undefined) updateData.profileImage = profileImage;
        if (coverImage !== undefined) updateData.coverImage = coverImage;

        // Update user
        const updatedUser = await ctx.db
          .update(users)
          .set(updateData)
          .where(eq(users.id, id))
          .returning();

        if (!updatedUser || updatedUser.length === 0) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to update user",
          });
        }

        return excludePassword(updatedUser[0]);
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update user",
          cause: error,
        });
      }
    }
  ),

  // Create or get author - used for post creation
  createOrGetAuthor: validatedProcedure(createAuthorSchema).mutation(
    async ({ ctx, input }) => {
      try {
        const { name, email } = input;

        // Auto-generate email if not provided
        const authorEmail =
          email ||
          `${name.toLowerCase().replace(/\s+/g, ".")}.${Date.now()}@blog.local`;

        // Check if user exists
        const existingUser = await ctx.db.query.users.findFirst({
          where: eq(users.email, authorEmail),
        });

        if (existingUser) {
          return excludePassword(existingUser);
        }

        // Create new author
        const newAuthor = await ctx.db
          .insert(users)
          .values({
            name,
            email: authorEmail,
            role: "author",
            isActive: true,
          })
          .returning();

        if (!newAuthor || newAuthor.length === 0) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to create author",
          });
        }

        return excludePassword(newAuthor[0]);
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create or get author",
          cause: error,
        });
      }
    }
  ),

  // Delete user
  delete: validatedProcedure(userIdSchema).mutation(async ({ ctx, input }) => {
    try {
      const [deleted] = await ctx.db
        .delete(users)
        .where(eq(users.id, input))
        .returning({ id: users.id });

      if (!deleted) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      return { id: deleted.id };
    } catch (error) {
      if (error instanceof TRPCError) {
        throw error;
      }

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to delete user",
        cause: error,
      });
    }
  }),
});
