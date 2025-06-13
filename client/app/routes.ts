import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  // UI Routes
  layout("routes/_layout.tsx", [
    index("routes/home.tsx"),
    route("users", "routes/users.tsx"),
    route("roles", "routes/roles.tsx"),
  ]),

  // API routes
  route("api/users/delete", "routes/api/users.delete.ts"),
  route("api/roles/edit", "routes/api/roles.edit.ts"),
] satisfies RouteConfig;
