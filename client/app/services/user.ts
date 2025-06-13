import type {
  ApiListResponse,
  ApiUserResponse,
  Role,
  UserWithRole,
  UserPage,
  Caches,
} from "~/types";
import { type RoleService } from "./role";
import { retry } from "~/utils/retry";
import { getQueryKey } from "~/utils/queries";

export type UserFilters = Partial<{
  search: string;
}>;

const BASE_URL = `${import.meta.env.VITE_API_URL}/users`;

/**
 * Function fetches paginated users with their roles.
 *
 * @param page - The page number to fetch.
 * @param filters  - Optional filters to apply to the user query.
 * @param roleService - The RoleService instance to fetch roles.
 *
 * @returns a paginated list of users with their roles.
 */
export async function getUsersWithRoles(
  page: number,
  filters: UserFilters = {},
  { roleService, caches }: { roleService: RoleService; caches: Caches }
) {
  const key = getQueryKey<UserFilters>("users", page, filters);
  if (caches.userListingCache.has(key)) {
    // If the cache has the user listing, we know it's defined
    return caches.userListingCache.get(key)!;
  }

  // Fetch paginated users
  const url = new URL(BASE_URL);

  // Set the page number and filters
  url.searchParams.set("page", String(page));
  for (const [key, val] of Object.entries(filters)) {
    if (!val) {
      continue; // Skip empty filters
    }

    url.searchParams.set(key, val);
  }

  // Rtry fetching the users with exponential backoff
  const { data: users, ...pagination } = await retry<
    ApiListResponse<ApiUserResponse>
  >(async () => {
    const res = await fetch(url.toString());
    if (!res.ok) {
      throw new Error("Failed to fetch users");
    }

    return await res.json();
  });

  // Local cache for user roles
  const userRoleCache = new Map<string, Role>();
  const enriched: UserWithRole[] = [];

  for (const user of users) {
    let cachedRole: Role | null = null;

    if (userRoleCache.has(user.roleId)) {
      cachedRole = userRoleCache.get(user.roleId)!;
    } else {
      // If we have a cache miss, fetch the role individually
      try {
        const role = await roleService.getRoleById(user.roleId);
        cachedRole = role;
        userRoleCache.set(user.roleId, cachedRole);
      } catch (error) {
        console.warn(`Failed to fetch role for user ${user.id}:`, error);

        // Fallback to null if role fetch fails
        cachedRole = null;
      }
    }

    // Composite user object with role
    const enrichedUser: UserWithRole = { ...user, role: cachedRole };
    enriched.push(enrichedUser);
    caches.userByIdCache.set(user.id, enrichedUser);
  }

  const pageResult = { data: enriched, ...pagination };

  // Store the result in the cache
  caches.userListingCache.set(key, pageResult);

  return pageResult;
}

/**
 * Function fetches a user by their ID and enriches it with their role.
 *
 * @param id - The ID of the user to fetch.
 * @param roleService - The RoleService instance to fetch roles.
 *
 * @returns a UserWithRole object containing the user data and their role.
 */
export async function getUserById(
  id: string,
  { roleService, caches }: { roleService: RoleService; caches: Caches }
) {
  if (caches.userByIdCache.has(id)) {
    // If the cache has the user, we know it's defined
    return caches.userByIdCache.get(id)!;
  }

  // Fetch the user by ID, retrying on failure with exponential backoff
  const user = await retry<ApiUserResponse>(async () => {
    const res = await fetch(`${BASE_URL}/${id}`);

    if (!res.ok) {
      throw new Error("Failed to fetch user");
    }

    return await res.json();
  });

  const role = await roleService
    .getRoles()
    .then((roles) => roles.data.find((r) => r.id === user.roleId));

  const enrichedUser: UserWithRole = {
    ...user,
    role: role ?? null,
  };

  caches.userByIdCache.set(id, enrichedUser);

  return enrichedUser;
}

/**
 * Function creates a new user with the provided payload.
 *
 * @param data - Payload to create a new user based on the ApiUserResponse type.
 * @param roleService - The RoleService instance to fetch roles.
 *
 * @returns the created user object enriched with its role.
 */
export async function createUser(
  data: Partial<ApiUserResponse>,
  { roleService, caches }: { roleService: RoleService; caches: Caches }
) {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Failed to create user");

  const user: ApiUserResponse = await res.json();

  const role = await roleService.getRoleById(user.roleId);

  // Create a new user object enriched with its role
  const enrichedUser: UserWithRole = {
    ...user,
    role: role ?? null,
  };

  // Invalidate the caches
  caches.userListingCache.clear();

  // Insert the new user into the cache
  caches.userByIdCache.set(enrichedUser.id, enrichedUser);

  return enrichedUser;
}

/**
 *
 * @param id - The ID of the user to update.
 * @param data - Partial data to update the user based on the ApiUserResponse type.
 * @param roleService - The RoleService instance to fetch roles.
 *
 * @returns - the updated user object enriched with its role.
 */
export async function updateUser(
  id: string,
  data: Partial<ApiUserResponse>,
  { roleService, caches }: { roleService: RoleService; caches: Caches }
) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Failed to update user");
  }

  const updated: ApiUserResponse = await res.json();
  const role = await roleService.getRoleById(updated.roleId);

  const enriched: UserWithRole = {
    ...updated,
    role: role ?? null,
  };

  // Clear the cache for listings and the specific user
  caches.userListingCache.clear();

  // Update the user in the individual cache
  caches.userByIdCache.set(id, enriched);

  return enriched;
}

/**
 * Function deletes a user by their ID.
 *
 * @param id - The ID of the user to delete.
 */
export async function deleteUser(id: string, { caches }: { caches: Caches }) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error("Failed to delete user");
  }

  // Clear the cache for listings and the specific user
  caches.userListingCache.clear();
  caches.userByIdCache.delete(id);

  return true;
}

/**
 * User Service Interface
 * This interface defines the methods available for user management.
 * It abstracts the implementation details and provides a clear contract for user operations.
 * Let's say someday we want to mock this service for testing purposes, we can easily do so by implementing this interface.
 *
 * An alterative approach to defining the function above would be to use a class, but I thought this approach
 * would be easier to reader and extend in the future.
 */
export interface UserService {
  getUsersWithRoles: (page: number, filters?: UserFilters) => Promise<UserPage>;
  getUserById: (id: string) => Promise<UserWithRole>;
  createUser: (data: Partial<ApiUserResponse>) => Promise<UserWithRole>;
  updateUser: (
    id: string,
    data: Partial<ApiUserResponse>
  ) => Promise<UserWithRole>;
  deleteUser: (id: string) => Promise<boolean>;
}

/**
 * Factory Creates an instance of the UserService.
 * We can inject dependencies if needed, i.e. roleService.
 */
export function createUserService(
  roleService: RoleService,
  caches: Caches
): UserService {
  return {
    deleteUser: (id: string) => deleteUser(id, { caches }),
    createUser: (data: Partial<ApiUserResponse>) =>
      createUser(data, { roleService, caches }),
    updateUser: (id: string, data: Partial<ApiUserResponse>) =>
      updateUser(id, data, { roleService, caches }),
    getUserById: (id: string) => getUserById(id, { roleService, caches }),
    getUsersWithRoles: (page: number, filters?: UserFilters) =>
      getUsersWithRoles(page, filters, { roleService, caches }),
  };
}
