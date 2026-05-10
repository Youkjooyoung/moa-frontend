# Shared Layer

`src/shared` is for code that is reused across features and has no MOA business ownership:

- `ui`: design-system level primitives
- `lib`: pure utilities
- future candidates: API clients, constants, hooks, and test helpers

Feature-specific components should live under `src/features/<feature>`.
