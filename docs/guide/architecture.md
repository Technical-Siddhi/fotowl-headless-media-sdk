# Architecture

The FotoOwl Media SDK strictly follows a decoupled, unidirectional dependency layer architecture:

```
Pexels API Provider
       ↓
@fotowl/media-core       (Framework-agnostic Core TypeScript Engine)
       ↓
@fotowl/media-react      (React Context & Hooks Abstraction)
       ↓
@fotowl/media-ui-react   (Headless React UI Primitives)
       ↓
apps/demo-web            (Consumer Web Application)
```

## Architectural Principles

1. **Unidirectional Flow**: Applications interact with React hooks or UI primitives, never with third-party REST endpoints directly.
2. **Framework Agnostic Core**: `@fotowl/media-core` contains zero React/DOM imports and can run in Node.js, React, React Native, or Vue.
3. **Headless UI Primitives**: UI components in `@fotowl/media-ui-react` provide DOM semantics, ARIA attributes, and interaction callbacks without opinionated CSS styling.
