import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import bcrypt from "bcryptjs";

import { users } from "@/lib/db/schema";
import { generateToken } from "@/lib/auth-utils";
import type { Context } from "../context";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { validatedProcedure } from "../middlewares/validation";
import type { InferSelectModel } from "drizzle-orm";

const signupSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export type AuthResponse = {
  id: number;
  name: string;
  email: string;
  role: string;
  token: string;
};

export type UserResponse = {
  id: number;
  name: string;
  email: string;
  role: string;
};

type User = InferSelectModel<typeof users>;

async function getUserResponse(user: User): Promise<UserResponse> {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role || "author",
  };
}

export const authRouter = createTRPCRouter({
  signup: validatedProcedure(signupSchema).mutation(async ({ ctx, input }) => {
    try {
      const { name, email, password } = input;

      console.log("[AUTH] Signup attempt for email:", email);

      // Check if user already exists
      const existingUser = await ctx.db
        .select()
        .from(users)
        .where(eq(users.email, email));

      console.log("[AUTH] Existing user check result:", existingUser?.length || 0);

      if (existingUser && existingUser.length > 0) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Email already registered",
        });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
      console.log("[AUTH] Password hashed successfully");

      // Create new user
      console.log("[AUTH] Inserting new user into database...");
      const newUser = await ctx.db
        .insert(users)
        .values({
          name,
          email,
          password: hashedPassword,
          role: "author",
          isActive: true,
        })
        .returning();

      console.log("[AUTH] User created successfully:", newUser[0]?.id);

      const userResponse = await getUserResponse(newUser[0]);
      const token = generateToken({
        id: String(newUser[0].id),
        email: newUser[0].email,
        name: newUser[0].name || undefined,
        permissions: ["posts:create", "posts:update", "posts:delete"],
        roles: ["author"],
      });

      console.log("[AUTH] Signup completed successfully for user:", email);

      return {
        success: true,
        user: userResponse,
        token,
        message: "Account created successfully",
      };
    } catch (error) {
      console.error("[AUTH] Signup error:", error);
      if (error instanceof TRPCError) {
        throw error;
      }

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to create account",
        cause: error,
      });
    }
  }),

  login: validatedProcedure(loginSchema).mutation(async ({ ctx, input }) => {
    try {
      const { email, password } = input;

      // Find user by email
      const userRecord = await ctx.db
        .select()
        .from(users)
        .where(eq(users.email, email));

      if (!userRecord || userRecord.length === 0) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid email or password",
        });
      }

      const foundUser = userRecord[0];

      // Check if user is active
      if (!foundUser.isActive) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Your account has been deactivated",
        });
      }

      // If no password is set (for demo users), allow login
      if (!foundUser.password) {
        const userResponse = await getUserResponse(foundUser);
        const token = generateToken({
          id: String(foundUser.id),
          email: foundUser.email,
          name: foundUser.name || undefined,
          permissions: ["posts:create", "posts:update", "posts:delete"],
          roles: ["author"],
        });

        return {
          success: true,
          user: userResponse,
          token,
          message: "Login successful",
        };
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(
        password,
        foundUser.password
      );

      if (!isPasswordValid) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid email or password",
        });
      }

      const userResponse = await getUserResponse(foundUser);
      const token = generateToken({
        id: String(foundUser.id),
        email: foundUser.email,
        name: foundUser.name || undefined,
        permissions: ["posts:create", "posts:update", "posts:delete"],
        roles: ["author"],
      });

      return {
        success: true,
        user: userResponse,
        token,
        message: "Login successful",
      };
    } catch (error) {
      if (error instanceof TRPCError) {
        throw error;
      }

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to login",
        cause: error,
      });
    }
  }),
});
