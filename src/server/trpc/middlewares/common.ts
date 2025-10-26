import { TRPCError } from "@trpc/server";
import { middleware } from "../trpc";
import { errorTypes } from "@/lib/errors";
import { isAuthenticated, type UserInfo, type Context } from "../context";
import { hasPermission, hasRole } from "@/lib/auth-utils";

// Store for rate limiting
interface RateLimitStore {
  count: number;
  resetAt: number;
}

/**
 * Middleware for logging requests
 * Can be useful for debugging and monitoring API usage
 */
export const loggerMiddleware = ({
  logInput = false,
  logOutput = false,
}) => middleware(async ({ path, type, next, input, ctx }) => {
  const start = Date.now();
  const userId = isAuthenticated(ctx) ? ctx.user.id : 'anonymous';
  
  // Log the request start
  const requestInfo = {
    path,
    type,
    userId,
    timestamp: new Date().toISOString(),
    input: logInput ? input : undefined,
  };
  
  if (process.env.NODE_ENV !== "production") {
    console.log(`🔄 tRPC ${type} request started: ${path}`, requestInfo);
  }
  
  // Continue to the next middleware or procedure
  const result = await next();
  
  // Log the response
  const durationMs = Date.now() - start;
  const responseInfo = {
    path,
    type,
    userId,
    durationMs,
    success: result.ok,
    timestamp: new Date().toISOString(),
    output: logOutput && result.ok ? result.data : undefined,
  };
  
  if (process.env.NODE_ENV !== "production") {
    console.log(`✅ tRPC ${type} request completed: ${path} (${durationMs}ms)`, responseInfo);
  }
  
  // Could send to monitoring service in production
  // logger.info(`API request completed: ${path}`, responseInfo);
  
  return result;
});

/**
 * Rate limiting middleware to prevent abuse
 * This is a simple in-memory implementation
 * For production, use a distributed store like Redis
 */
const requestCounts = new Map<string, RateLimitStore>();

export const rateLimitMiddleware = ({
  requestsPerMinute = 60,
  identifier = (ctx: { headers: Headers, user?: UserInfo }) => 
    ctx.user?.id || 
    ctx.headers.get("x-forwarded-for") || 
    'anonymous',
}) =>
  middleware(async ({ ctx, next }) => {
    // Get a unique identifier for the client
    const clientId = identifier(ctx);
    const now = Date.now();
    const windowReset = Math.floor(now / 60000) * 60000 + 60000; // Next minute

    // Initialize or get the existing count
    const clientRequests = requestCounts.get(clientId) || {
      count: 0,
      resetAt: windowReset,
    };

    // Reset counter if we're in a new window
    if (now > clientRequests.resetAt) {
      clientRequests.count = 0;
      clientRequests.resetAt = windowReset;
    }

    // Increment counter
    clientRequests.count++;
    requestCounts.set(clientId, clientRequests);

    // Check if rate limit is exceeded
    if (clientRequests.count > requestsPerMinute) {
      throw new TRPCError({
        code: "TOO_MANY_REQUESTS",
        message: "Rate limit exceeded",
        cause: {
          type: errorTypes.TOO_MANY_REQUESTS,
          details: {
            limitResetAt: new Date(clientRequests.resetAt).toISOString(),
            retryAfterSeconds: Math.ceil((clientRequests.resetAt - now) / 1000),
            currentRequests: clientRequests.count,
            maxRequests: requestsPerMinute,
          },
        },
      });
    }

    return next();
  });

/**
 * Authentication middleware that checks if user is logged in
 */
export const authMiddleware = middleware(async ({ ctx, next }) => {
  // Check if user is authenticated from context
  if (!isAuthenticated(ctx)) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You must be logged in to perform this action",
      cause: {
        type: errorTypes.UNAUTHORIZED,
      },
    });
  }

  return next({
    ctx: {
      ...ctx,
      // This ensures the type system knows user is available
      user: ctx.user,
    },
  });
});

/**
 * Permission middleware to check for specific permission
 */
export const permissionMiddleware = (requiredPermission: string) =>
  middleware(async ({ ctx, next }) => {
    // First check if user is authenticated
    if (!isAuthenticated(ctx)) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "You must be logged in to perform this action",
        cause: {
          type: errorTypes.UNAUTHORIZED,
        },
      });
    }

    // Then check for permission
    if (!hasPermission(ctx.user, requiredPermission)) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: `You don't have the required permission: ${requiredPermission}`,
        cause: {
          type: errorTypes.FORBIDDEN,
          details: {
            requiredPermission,
            userPermissions: ctx.user.permissions,
          },
        },
      });
    }

    return next();
  });

/**
 * Role middleware to check for specific role
 */
export const roleMiddleware = (requiredRole: string) =>
  middleware(async ({ ctx, next }) => {
    // First check if user is authenticated
    if (!isAuthenticated(ctx)) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "You must be logged in to perform this action",
        cause: {
          type: errorTypes.UNAUTHORIZED,
        },
      });
    }

    // Then check for role
    if (!hasRole(ctx.user, requiredRole)) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: `You don't have the required role: ${requiredRole}`,
        cause: {
          type: errorTypes.FORBIDDEN,
          details: {
            requiredRole,
            userRoles: ctx.user.roles,
          },
        },
      });
    }

    return next();
  });

/**
 * Owner middleware to check if the user owns a resource
 */
export const ownerMiddleware = <T extends { userId?: string }>(
  getResource: (input: Record<string, unknown>, ctx: Context) => Promise<T | null>
) =>
  middleware(async ({ ctx, next, input }) => {
    // First check if user is authenticated
    if (!isAuthenticated(ctx)) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "You must be logged in to perform this action",
        cause: {
          type: errorTypes.UNAUTHORIZED,
        },
      });
    }

    // Get resource and check ownership
    const resource = await getResource(input as Record<string, unknown>, ctx);
    
    if (!resource) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Resource not found",
        cause: {
          type: errorTypes.NOT_FOUND,
        },
      });
    }
    
    if (resource.userId !== ctx.user.id) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "You don't have permission to access this resource",
        cause: {
          type: errorTypes.FORBIDDEN,
          details: {
            ownerId: resource.userId,
            requesterId: ctx.user.id,
          },
        },
      });
    }

    return next();
  });