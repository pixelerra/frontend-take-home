import type { Role, RolePage, UserPage, UserWithRole, Caches } from "~/types";
import { createRoleService } from "./role";
import { createUserService } from "./user";

/**
 * Caches object to store data fetched from the API.
 *
 * This is a simple in-memory cache for the sake of this take-home project.
 * This cache is being used server-side
 *
 * In a production application, you might want to use a more robust caching solution.
 * For example, you could use a library like `react-query` or `swr` for caching and data fetching.
 *
 * This cache will store:
 * - User listings by page and filters
 * - User details by ID
 * - Role listings by page and filters
 * - Role details by ID
 *
 * Tradeoff of using a simple in-memory cache:
 * - Pros: Simple to implement, no external dependencies, fast access.
 * - Cons: We're invalidating fequently when data changes, which leads to longer fetch times
 *  when the cache is empty. In a real application, you would want to implement a more sophisticated caching strategy
 *  that handles cache invalidation more gracefully.
 */
const caches: Caches = {
  // User caches
  userListingCache: new Map<string, UserPage>(),
  userByIdCache: new Map<string, UserWithRole>(),

  // Role caches
  roleListingCache: new Map<string, RolePage>(),
  roleByIdCache: new Map<string, Role>(),
};

/**
 * Simple container function to create and return services.
 * This function can be used to instantiate services with their dependencies.
 * It allows for easy access to the services throughout the application.
 *
 * I'm keeping it simple for this take-home project.
 * In a more complex application, you might use a dependency injection framework or context providers.
 */
export const container = () => {
  const roleService = createRoleService(caches);
  const userService = createUserService(roleService, caches);

  return {
    roleService,
    userService,
  };
};
