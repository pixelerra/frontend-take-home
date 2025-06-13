import type { Route } from "./+types/users.delete";
import { container } from "~/services";

// Grab the userService from our container
const { userService } = container();

/**
 * API handler for deleting a user.
 * This function receives a request to delete a user by their ID and calls the userService to perform the deletion.
 */
export async function action({ request }: Route.ActionArgs) {
  if (request.headers.get("Content-Type") !== "application/json") {
    // Only accept JSON requests, this might be overkill for our simple application,
    throw new Response("Unsupported Media Type", { status: 415 });
  }

  const body = await request.json();
  const { userId } = body as { userId: string | undefined };

  if (!userId || typeof userId !== "string") {
    throw new Response("Invalid user ID", { status: 400 });
  }

  try {
    await userService.deleteUser(userId);

    // Return a 204 No Content to indicate we successfully deleted the user
    return new Response(null, { status: 204 });
  } catch (error: unknown) {
    let message = "An unexpected error occurred";
    if (error instanceof Error) {
      message = error.message;
    }

    return new Response(message, { status: 500 });
  }
}
