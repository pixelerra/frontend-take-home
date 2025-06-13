import type { Route } from "./+types/roles.edit";
import { container } from "~/services";

// Grab the roleService from our container
const { roleService } = container();

/**
 * This is our "edit role" API handler.
 * It handles the update of a role's name and description and calls the roleService to perform the update.
 */
export async function action({ request }: Route.ActionArgs) {
  if (request.headers.get("Content-Type") !== "application/json") {
    // Only accept JSON requests, this might be overkill for our simple application,
    throw new Response("Unsupported Media Type", { status: 415 });
  }

  const body = await request.json();
  const { roleId, roleName, roleDescription } = body as {
    roleId: string | undefined;
    roleName: string | undefined;
    roleDescription: string | undefined;
  };

  if (!roleId || typeof roleId !== "string") {
    throw new Response("Invalid user ID", { status: 400 });
  }

  try {
    await roleService.updateRole(roleId, {
      ...{ name: roleName },
      ...{ description: roleDescription },
    });

    return new Response(null, { status: 204 });
  } catch (error: unknown) {
    let message = "An unexpected error occurred";
    if (error instanceof Error) {
      message = error.message;
    }

    return new Response(message, { status: 500 });
  }
}
