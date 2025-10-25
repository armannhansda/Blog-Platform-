import { type RouterOutputs, type RouterInputs } from "./trpc/types";
import { type UserInfo } from "@/server/trpc/context";
import { hasPermission, hasRole, isAdmin } from "./auth-utils";

// These are example types for future auth endpoints
// When you add these endpoints to your tRPC router, the types will be automatically inferred
// For now, we'll use placeholder types

// Example of how these would look when implemented:
// type User = RouterOutputs["users"]["getById"];
// type UserList = RouterOutputs["users"]["list"];
// type LoginInput = RouterInputs["auth"]["login"];
// type LoginOutput = RouterOutputs["auth"]["login"];

/**
 * User session manager that leverages tRPC's type inference
 */
export class UserSession {
  private userInfo: UserInfo | null = null;
  private token: string | null = null;

  /**
   * Set user information from API response
   */
  setUser(user: UserInfo): void {
    this.userInfo = user;
  }

  /**
   * Set authentication token
   */
  setToken(token: string): void {
    this.token = token;
  }

  /**
   * Get current user
   */
  getUser(): UserInfo | null {
    return this.userInfo;
  }

  /**
   * Get auth token
   */
  getToken(): string | null {
    return this.token;
  }

  /**
   * Check if user is logged in
   */
  isAuthenticated(): boolean {
    return !!this.userInfo;
  }

  /**
   * Check if user has specific permission
   */
  hasPermission(permission: string): boolean {
    // Convert null to undefined to match the function signature
    return hasPermission(this.userInfo || undefined, permission);
  }

  /**
   * Check if user has specific role
   */
  hasRole(role: string): boolean {
    // Convert null to undefined to match the function signature
    return hasRole(this.userInfo || undefined, role);
  }

  /**
   * Check if user is an admin
   */
  isAdmin(): boolean {
    // Convert null to undefined to match the function signature
    return isAdmin(this.userInfo || undefined);
  }

  /**
   * Clear session
   */
  logout(): void {
    this.userInfo = null;
    this.token = null;
  }
}

// Create a singleton instance
export const userSession = new UserSession();

/**
 * Example usage in a React component:
 * 
 * ```tsx
 * import { api } from "@/lib/trpc/react";
 * import { userSession } from "@/lib/user-session";
 * 
 * export function LoginForm() {
 *   const loginMutation = api.auth.login.useMutation({
 *     onSuccess: (data) => {
 *       userSession.setUser(data.user);
 *       userSession.setToken(data.token);
 *     }
 *   });
 * 
 *   const handleSubmit = (credentials: LoginInput) => {
 *     loginMutation.mutate(credentials);
 *   };
 * 
 *   // Rest of component...
 * }
 * ```
 */