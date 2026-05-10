# MOA Frontend Architecture

## Target Structure

```text
src/
  app/          app shell, routes, providers
  pages/        route-level screens
  features/     business feature modules
  shared/       reusable UI, hooks, libs, API helpers
  components/   legacy/common components during migration
  store/        legacy global stores during migration
```

## Migration Rules

- New shared primitives go under `src/shared/ui`.
- New feature-owned state and configuration go under `src/features/<feature>/model` or `config`.
- Route composition belongs in `src/app`.
- Legacy imports can be kept through small compatibility wrappers while pages are moved gradually.
- Do not add new landing variants. The official landing is `src/pages/main/MainPage.jsx`.

## Current Migration Step

- `src/app/App.jsx` owns route composition and app shell wiring.
- `src/shared/ui/MoaPage.jsx` owns the Toss-like base UI primitives.
- `src/features/landing` owns landing content and low-code editor state.
