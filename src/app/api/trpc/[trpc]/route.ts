import { fetchRequestHandler } from "@trpc/server/adapters/fetch";

import { appRouter } from "@/server/trpc/router";
import { createContext } from "@/server/trpc/context";

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: async () => {
      return createContext({ headers: req.headers as Headers });
    },
    onError: ({ path, error }) => {
      console.error(`tRPC error on path [${path}]:`, error);
    },
  });

export { handler as GET, handler as POST };
