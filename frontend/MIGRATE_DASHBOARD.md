MIGRATION TASK — Migrate Dashboard to useAppStore

Goal
- Move dashboard image pagination and list state into the central `useAppStore` (Zustand) and add tests to assert append/replace behavior.

Scope
- Hooks: `useDashboard` (read/write images, page, loading, error)
- Components: `DashboardView`, `ImagesTable` (if needed)
- Tests: unit tests for store actions and hook behavior; small integration test for DashboardView.

Checklist
- [ ] Update `useDashboard` to use `useAppStore` selectors and actions.
- [ ] Add unit tests for append/replace behavior (page === 1 replace, page > 1 append).
- [ ] Update `DashboardView` to remove prop-drilling and use store.
- [ ] Run test suite and ensure green.

Notes
- Be careful with React Strict Mode double-mount: prefer replace on page 1.
- Keep Zod validation on API layer unchanged.

