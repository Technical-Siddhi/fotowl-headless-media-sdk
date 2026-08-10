# FotoOwl Headless Media SDK

A modular, headless media SDK and UI architecture monorepo designed for high reusability across React and React Native platforms.

---

## 🏗️ Workspace Architecture

This repository is structured as a **pnpm monorepo** separating core business logic, platform-specific state wrappers, independent headless UI components, and demonstration applications.

```
fotowl-headless-media-sdk/
├── apps/
│   └── demo-web/           # Web demo application (connects media-react & media-ui-react)
├── packages/
│   ├── media-core/         # Framework-agnostic pure TypeScript SDK engine
│   ├── media-react/        # React wrapper around media-core
│   ├── media-native/       # React Native wrapper around media-core
│   ├── media-ui-react/     # Data-driven headless UI components (React)
│   └── media-ui-native/    # Data-driven headless UI components (React Native)
├── skills/
│   ├── media-data-wiring/  # Context & instructions for SDK integration
│   └── media-ui-usage/     # Context & instructions for UI component usage
├── docs/                   # System documentation & architectural reference
├── package.json
├── pnpm-workspace.yaml
├── tsconfig.json
├── .gitignore
└── README.md
```

---

## 🎯 Package Responsibilities & Dependency Rules

### 1. `@fotowl/media-core`
- **Role:** Pure TypeScript framework-agnostic engine.
- **Constraints:** Must NOT depend on React, React Native, DOM APIs, or UI packages.

### 2. `@fotowl/media-react`
- **Role:** Thin React integration wrapper around `media-core`.
- **Dependencies:** `@fotowl/media-core`

### 3. `@fotowl/media-native`
- **Role:** Thin React Native integration wrapper around `media-core`.
- **Dependencies:** `@fotowl/media-core`

### 4. `@fotowl/media-ui-react`
- **Role:** Independent, unstyled / headless UI component library for React.
- **Constraints:** Strictly data-driven. Must NOT import `media-core`, `media-react`, or any SDK logic.

### 5. `@fotowl/media-ui-native`
- **Role:** Independent, unstyled / headless UI component library for React Native.
- **Constraints:** Strictly data-driven. Must NOT import `media-core`, `media-native`, or any SDK logic.

### 6. `@fotowl/demo-web`
- **Role:** Demonstration web application.
- **Dependencies:** Connects `@fotowl/media-react` (data & state) with `@fotowl/media-ui-react` (UI rendering).

---

## 🔄 Dependency Flow

```
   [ demo-web ]
     ├───► [ @fotowl/media-react ] ───► [ @fotowl/media-core ]
     └───► [ @fotowl/media-ui-react ] (independent UI)

   [ @fotowl/media-native ] ───► [ @fotowl/media-core ]

   [ @fotowl/media-ui-native ] (independent UI)
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js >= 18
- pnpm >= 8

### Installation & Type Check
```bash
# Install workspace dependencies
pnpm install

# Run TypeScript validation across all workspace packages
pnpm run typecheck
```
