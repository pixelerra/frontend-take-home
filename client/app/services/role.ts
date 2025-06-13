import type {
  ApiRoleResponse,
  ApiListResponse,
  Role,
  RolePage,
  Caches,
} from "~/types";
import { getQueryKey } from "~/utils/queries";
import { retry } from "~/utils/retry";

const BASE_URL = `${import.meta.env.VITE_API_URL}/roles`;

export type RoleFilters = Partial<{
  search: string;
}>;

/**
 * Function fetches a single role by its ID
 *
 * @param id - The ID of the role to fetch.
 *
 * @returns a Role object.
 */
export async function getRoleById(
  id: string,
  { caches }: { caches: Caches }
): Promise<Role> {
  if (caches.roleByIdCache.has(id)) {
    return caches.roleByIdCache.get(id)!;
  }

  const role = await retry(async () => {
    const res = await fetch(`${BASE_URL}/${id}`);

    if (!res.ok) {
      console.warn(`getRoleById(${id}) failed with ${res.status}`);
      throw new Error(`Role not found: ${id}`);
    }

    return (await res.json()) as ApiRoleResponse;
  });

  caches.roleByIdCache.set(id, role);

  return role;
}

/**
 *  Function fetches paginated roles with optional filters.
 *
 * @param page - The page number to fetch.
 * @param filters - Optional filters to apply to the role query.
 *
 * @returns - a paginated list of roles.
 */
export async function getRoles(
  page = 1,
  filters: RoleFilters = {},
  { caches }: { caches: Caches }
) {
  const key = getQueryKey<RoleFilters>("roles", page, filters);

  if (caches.roleListingCache.has(key)) {
    return caches.roleListingCache.get(key)!;
  }

  // Construct the API Url with query params
  const url = new URL(BASE_URL);
  url.searchParams.set("page", page.toString());

  // Add filters to the URL
  for (const [key, val] of Object.entries(filters)) {
    if (!val) {
      continue;
    }
    url.searchParams.set(key, val);
  }

  const roles = await retry(async () => {
    const res = await fetch(url.toString());
    if (!res.ok) {
      throw new Error("Failed to fetch roles");
    }

    return (await res.json()) as RolePage;
  });

  caches.roleListingCache.set(key, roles);

  return roles;
}

/**
 * Function to create a new role.
 *
 * @param data - The data to create a new role with.
 * @returns - the created Role object.
 */
export async function createRole(
  data: Partial<Role>,
  { caches }: { caches: Caches }
): Promise<Role> {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Failed to create role");
  }

  const role: ApiRoleResponse = await res.json();

  // Invalidate all cached listings
  caches.roleListingCache.clear();

  // Cache the new role by ID
  caches.roleByIdCache.set(role.id, role);

  return role;
}

/**
 * Function to update a role by its ID.
 *
 * @param id - The ID of the role to update.
 * @param data - The data to update the role with.
 *
 * @returns the updated Role object.
 */
export async function updateRole(
  id: string,
  data: Partial<Role>,
  { caches }: { caches: Caches }
) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Failed to update role");

  const role: ApiRoleResponse = await res.json();

  // Invalidate all cached listings (users and roles)
  caches.roleListingCache.clear();
  caches.userByIdCache.clear();
  caches.userListingCache.clear();

  // Update the role in the individual cache
  caches.roleByIdCache.set(id, role);

  return role;
}

/**
 * Function to delete a role by its ID.
 *
 * @param id - The ID of the role to delete.
 * @returns a boolean indicating success or failure.
 */
export async function deleteRole(id: string, { caches }: { caches: Caches }) {
  const res = await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });
  if (!res.ok) {
    throw new Error("Failed to delete role");
  }

  // Invalidate all cached listings and the individual role cache
  caches.roleListingCache.clear();
  caches.userByIdCache.clear();
  caches.userListingCache.clear();
  caches.roleByIdCache.delete(id);

  return true;
}

/**
 * Role Service Interface
 * This interface defines the methods available for managing roles in the application.
 * It includes methods for fetching roles, creating, updating, and deleting roles.
 *
 */
export interface RoleService {
  getRoleById(id: string): Promise<Role>;
  getRoles(
    page?: number,
    filters?: RoleFilters
  ): Promise<ApiListResponse<Role>>;
  createRole(data: Partial<Role>): Promise<Role>;
  updateRole(id: string, data: Partial<Role>): Promise<Role>;
  deleteRole(id: string): Promise<boolean>;
}

/**
 * Factory function to create a RoleService instance.
 *
 * @returns a RoleService instance with methods to manage roles.
 */
export function createRoleService(caches: Caches): RoleService {
  return {
    getRoleById: (id: string) => getRoleById(id, { caches }),
    getRoles: (page?: number, filters?: RoleFilters) =>
      getRoles(page, filters, { caches }),
    createRole: (data: Partial<Role>) => createRole(data, { caches }),
    updateRole: (id: string, data: Partial<Role>) =>
      updateRole(id, data, { caches }),
    deleteRole: (id: string) => deleteRole(id, { caches }),
  };
}
