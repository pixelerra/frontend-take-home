import { Suspense } from "react";
import { Box, Flex, TabNav, Theme } from "@radix-ui/themes";
import { Link, Outlet } from "react-router";

// Magic type imports for route types
import type { Route } from "./+types/_layout";
import { RouteSkeleton } from "~/components/shared/RouteSkeleton";

import styles from "./_layout.module.css";

/**
 * Defines the top-level nav tabs for this app.
 */
const NAV_TABS = new Set(["users", "roles"]);

/**
 * Helper function checks if the given tab is active based on the current pathname.
 */
function getActiveTab(pathname: string): string | null {
  const firstSegment = pathname.split("/")[1];
  return NAV_TABS.has(firstSegment) ? firstSegment : null;
}

/**
 * Loader function for the app layout. We're using this to determine
 * which tab should be active based on the current URL pathname.
 * This is a server-side function that runs before the component renders.
 *
 * It extracts the pathname from the request URL and checks it against
 * the defined navigation tabs.
 */
export function loader({ request }: Route.LoaderArgs) {
  const pathname = new URL(request.url).pathname;

  return { activeTab: getActiveTab(pathname) };
}

/**
 * The main application layout component.
 * Because we're rendering this component on the server, we have access
 * to the loader data directly, so no need to use a `useLoaderData` hook.
 */
export default function AppLayout({ loaderData }: Route.ComponentProps) {
  const { activeTab } = loaderData;
  const isActive = (tab: string) => activeTab === tab;

  return (
    <Theme appearance="inherit">
      <Flex
        justify={"center"}
        mx={{
          initial: "2",
          sm: "4",
          md: "8",
          lg: "10",
          xl: "auto",
        }}
      >
        <Box
          maxWidth={{
            initial: "100vw",
            sm: "100vw",
            md: "90vw",
            lg: "80vw",
            xl: "1200px",
          }}
          width="100vw"
        >
          <header className={styles.appHeader}>
            <h1>User management dashboard</h1>
            <TabNav.Root size="2" aria-label="Main Navigation">
              <TabNav.Link href="/users" active={isActive("users")} asChild>
                <Link to="/users" viewTransition>
                  Users
                </Link>
              </TabNav.Link>
              <TabNav.Link href="/roles" active={isActive("roles")} asChild>
                <Link to="/roles" viewTransition>
                  Roles
                </Link>
              </TabNav.Link>
            </TabNav.Root>
          </header>
          <main className={styles.appMain}>
            <Suspense fallback={<RouteSkeleton />}>
              <Outlet />
            </Suspense>
          </main>
        </Box>
      </Flex>
    </Theme>
  );
}
