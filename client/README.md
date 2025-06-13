# Frontend Take-Home Submission

This is my submission for the frontend take-home assignment. It implements a two-tab UI for managing users and roles using the provided API and design references.

## Overview

I built the app using **React Router v7 (Framework mode)** with **Radix Themes** for UI components. It supports:

- Tabbed layout: Users and Roles
- User listing, filtering, deletion
- Role listing, editing
- Pagination (bonus!)
- Loading, error, and empty states
- view transitions
- Type-safe routing and API integration
- Server-side rendering with React Router

### Tasks Completed

- [x] Setup the "Users" and "Roles" tab structure
- [x] Add the users table
- [x] Add support for filtering the users table via the "Search" input field
- [x] Add support for deleting a user via the "more" icon button dropdown menu
- [x] Add support for viewing all roles in the "Roles" tab
- [x] Add support for renaming a role in the "Roles" tab
- [x] [Bonus] Add pagination to the user table

### Notable Features

- **Search**: Debounced server-side search using query params
- **Pagination**: Rendered footer with cache-aware navigation
- **Modals**: Accessible modals using Radix and custom state control
- **Error handling**: Boundaries for route loader errors and API failures
- **Skeletons**: Suspense fallback + loading state transitions
- **Type Safety**: Strongly typed route definitions and loader data
- **Responsive Design**: Mobile-friendly layout with Radix components

## Directory Structure

```sh
app/
├── components/       # Shared and domain-specific UI components
│   ├── roles/        # Role table and edit modal
│   ├── shared/       # Search bar, modals, error/skeleton states
│   └── users/        # User table, actions, deletion modal
├── routes/           # Route-level modules for tabs and APIs
│   ├── _layout.tsx   # Tab layout
│   ├── users.tsx     # Users route + loader
│   ├── roles.tsx     # Roles route + loader
│   └── api/          # API-style routes for editing/deleting
├── services/         # Flat service modules for user/role, also contains our caches
├── utils/            # Utilities for formatting, query building, retry logic
```

## Getting Started

### Prerequisites

- Node.js (LTS recommended)
- Backend API running via provided instructions (`cd server && npm install && npm run api`)

### Run the frontend

```bash
npm install
npm run dev
```

### Environment

Create a `.env` file if needed to point to your local API (default assumes same origin).

## Services

Each domain (user, role) has its own stateless service module. These services:

- Receive injected caches and dependencies
- Expose typed methods like getUsersWithRoles, deleteUser, editRole, etc.
- Are created via factory functions and exported in a container
- Share a common caches object passed into the service layer to avoid circular imports
- This design promotes testability, loose coupling, and encapsulated logic for each domain.

## Constraints & Trade-offs

- **Optimistic updates** were skipped due to time constraints and complexity around shared caching between roles and users.
- **Global cache invalidation** is handled manually by exposing service-level caches. In a full app, I’d prefer dedicated query stores or React context per domain.
- **Add User** functionality was visible in mocks but not scoped in the task list, so it was omitted.

If given more time I would reach for a library like React Query or SWR to handle client-side caching, optimistic updates, and background refetching. This would simplify data management and improve UX. To do so in conjunction with React Router, There's some wiring required between our data loads and the query cache, but it would be worth the effort for a production app.

The current setup works well for the assignment's scope, but I recognize the limitations of manual cache management and the potential for duplication in service logic.

Leaning on SSR gives us some solid performance benefits, but it also means we miss out on some of the client-side interactivity and responsiveness that a fully client-rendered app could provide.

## Improvements With More Time

- Add optimistic updates and local state syncing
- Build out full Create User flow and validation
- Use schema-based validation (e.g., Zod)
- Add animations to modals and table rows
- Extract design tokens and systematize styling
- Unit testing for components and services
- More robust logging and error reporting

## Testing

Manual testing was used to verify:

- Navigation, pagination, and search behavior
- Modal accessibility and keyboard interactions
- Error fallback when API fails
- Hydration and suspense rendering

## 📝 Final Thoughts

This was a fun assignment! I tried to balance code clarity, polish, and abstractions within the 8-hour limit. Thank you for reviewing!
