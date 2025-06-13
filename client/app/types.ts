/**
 * API Types
 *
 * In a real application, I would expect these types to be generated from the API schema.
 */

export type ApiUserResponse = {
  id: string;
  first: string;
  last: string;
  roleId: string;
  photo: string;
  createdAt: string;
  updatedAt: string;
};

export type ApiRoleResponse = {
  id: string;
  name: string;
  description: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
};

export type ApiListResponse<T> = {
  data: T[];
  next?: number;
  prev?: number;
  pages?: number;
};

/**
 * Application Types
 **/

// Mirrors the API response structure, aliased for clarity
export type Role = ApiRoleResponse;

export type UserWithRole = Omit<ApiUserResponse, "roleId"> & {
  role: Role | null;
};

export type UserPage = ApiListResponse<UserWithRole>;
export type RolePage = ApiListResponse<ApiRoleResponse>;

export interface Caches {
  userListingCache: Map<string, UserPage>;
  userByIdCache: Map<string, UserWithRole>;
  roleListingCache: Map<string, RolePage>;
  roleByIdCache: Map<string, Role>;
}
