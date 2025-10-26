import { fetchRequestHandler } from "@trpc/server/adapters/fetch";

import { appRouter } from "@/server/trpc/router";
import { createContext } from "@/server/trpc/context";

const handler = (req: Request) => {
  console.log("[tRPC API] Incoming request:", {
    method: req.method,
    url: req.url,
  });

  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: async () => {
      console.log("[tRPC API] Creating context...");
      return createContext({ headers: req.headers as Headers });
    },
    onError: ({ path, error }) => {
      console.error(`[tRPC ERROR] on path [${path}]:`, error);
      console.error("Stack:", error instanceof Error ? error.stack : "No stack trace");
    },
  });
};

export { handler as GET, handler as POST };

