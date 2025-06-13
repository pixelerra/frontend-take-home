import React from "react";
import { useSearchParams } from "react-router";

// This is a magical import that gives us type safety for the route.
// See: https://reactrouter.com/explanation/type-safety
import type { Route } from "./+types/roles";

import { container } from "~/services";
import { EntitySearch } from "~/components/shared/EntitySearch";
import { RouteError } from "~/components/shared/RouteError";
import { RouteSkeleton } from "~/components/shared/RouteSkeleton";

// Lazy load the UserTable component to improve initial load performance.
// This also gives up a chance to show a skeleton while the component is being loaded.
const RoleTable = React.lazy(async () => ({
  default: (await import("~/components/roles/RoleTable")).RoleTable,
}));

/**
 * Function to define the metadata for the Users route.
 * This is used to set the page title and meta tags.
 */
export const meta = ({}: Route.MetaArgs) => {
  return [
    { title: "Roles" },
    { name: "description", content: "Manage user roles and permissions." },
  ];
};

// Instantiate the services needed for this route.
const { roleService } = container();

/**
 * Loader function to fetch roles from the API.
 * This function is called on the server side when the route is accessed.
 * It fetches the list of users and returns them as part of the loader data.
 * If the fetch fails, it throws an error that can be handled by the error boundary.
 */
export async function loader({ request }: Route.LoaderArgs) {
  // Another option would be to use a zod schema to validate the query parameters.
  // But given the fact this is a simple take-home project, we can keep it simple.
  const url = new URL(request.url);
  const page = Number(url.searchParams.get("page") ?? "1");

  const filters = {
    search: url.searchParams.get("search") ?? undefined,
  };

  const { data: roles, ...pagination } = await roleService.getRoles(
    page,
    filters
  );

  return { roles, pagination };
}

/**
 * Provides a fallback UI while the route is hydrating.
 * This component is rendered on the client side while the server-rendered content is being hydrated.
 */
export const HydrateFallback = () => <RouteSkeleton />;

/**
 * Error boundary component for the Users route.
 * This component is rendered when an error occurs during the loading of the route.
 */
export const ErrorBoundary = ({ error }: Route.ErrorBoundaryProps) => {
  let err = new Error("An unexpected error occurred while loading users.");

  if (error instanceof Response) {
    // If the error is a Response, we'll extract the error message from it
    err = new Error(`Failed to load users: ${error.statusText}`);
  }

  if (error instanceof Error) {
    // If the error is an instance of Error, we'll use its message
    err = new Error(`Failed to load users: ${error.message}`);
  }

  return <RouteError error={err} />;
};

/**
 * Roles route component.
 */
export default function Roles({ loaderData }: Route.ComponentProps) {
  const { roles, pagination } = loaderData;
  const [searchParams, setSearchParams] = useSearchParams();

  function handleSearch(searchTerm: string) {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);

      if (searchTerm) {
        params.set("search", searchTerm);
        params.set("page", "1"); // Reset to first page on new search
      } else {
        // If search term is empty, remove the search param
        params.delete("search");
      }

      return params;
    });
  }

  return (
    <>
      <EntitySearch
        id="role-search"
        name="role-search"
        label="Search roles by name or description"
        placeholder="Search roles"
        action="/roles"
        searchTerm={searchParams.get("search") ?? ""}
        handleSearch={handleSearch}
      />
      <RoleTable roles={roles} pagination={pagination} />
    </>
  );
}
