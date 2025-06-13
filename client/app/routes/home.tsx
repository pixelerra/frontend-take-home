import { redirect } from "react-router";

/**
 * Redirects to the users page.
 */
export async function loader() {
  return redirect("/users");
}

export default function Home() {
  return null;
}
