import { createTRPCRouter } from "./trpc";
import { postsRouter } from "./routers/posts";
import { categoriesRouter } from "./routers/categories";
import { authRouter } from "./routers/auth";
import { usersRouter } from "./routers/users";

export const appRouter = createTRPCRouter({
  posts: postsRouter,
  categories: categoriesRouter,
  auth: authRouter,
  users: usersRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;