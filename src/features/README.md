# Feature Layer

`src/features` groups code by product capability. New or heavily refactored code should prefer this layout:

```text
features/<feature>/
  api/        server calls owned by the feature
  model/      stores, state, selectors
  ui/         feature components
  config/     low-code or static feature configuration
```

Existing legacy pages can continue to import through compatibility wrappers while they are migrated feature by feature.
