# App Layer

`src/app` contains application bootstrapping concerns:

- top-level route composition
- global providers and shell wiring
- app-wide side effects such as theme and locale hydration

Feature pages should not import from this layer. Shared UI and feature modules should stay below `src/shared` and `src/features`.
