# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Electron desktop application with React 18, TypeScript, Vite, and Ant Design.

**Tech Stack**: Electron Forge | React 18 | TypeScript | Vite + SWC | Ant Design | TanStack Query | Zustand | React Router v7 | i18next | Tailwind CSS v4

**Package Manager**: MUST use `pnpm` (npm/yarn/bun rejected via preinstall hook)

## Development Commands

```bash
# Setup (first time)
pnpm install && pnpm prepare

# Development
pnpm start              # Start Electron app in dev mode

# Code quality (run before commits)
pnpm check-all          # Run all checks in parallel (format + lint + type-check)
pnpm format             # Format with Prettier
pnpm lint               # Lint with ESLint (auto-fix)
pnpm type-check         # TypeScript validation

# Testing (Vitest + React Testing Library)
pnpm test               # Run tests in watch mode
pnpm test:run           # Run tests once
pnpm test:coverage      # Run tests with coverage report
pnpm test:ui            # Run tests with Vitest UI

# Build & Distribution
pnpm package            # Package the application
pnpm make               # Create distribution files
```

## Testing

- **Framework**: Vitest with jsdom environment
- **Libraries**: @testing-library/react, @testing-library/jest-dom, @testing-library/user-event
- **Test files**: `*.test.tsx` or `*.spec.tsx` alongside source files or in `tests/` directory
- **Setup file**: `tests/vitest.setup.ts` (mocks for matchMedia, ResizeObserver for Ant Design)
- **Coverage**: V8 provider, excludes main process and config files

## Architecture

### Three-Process Electron Model

```
src/
├── main/               # Electron main process (Node.js)
│   ├── main.ts         # Entry: app lifecycle, window management
│   ├── preload.ts      # IPC bridge (contextBridge)
│   └── ipc-handlers.ts # IPC message handlers
├── renderer/           # React application (Chromium)
│   └── Entry: renderer.tsx → App.tsx → AppRoutes.tsx
└── shared/             # Code shared between processes
    ├── definitions/    # constants, enums, interfaces, types
    └── utils/          # Utility functions
```

### Renderer Layer Structure

| Layer      | Location              | Purpose                                                   |
| ---------- | --------------------- | --------------------------------------------------------- |
| Components | `components/shared/`  | `Base*` wrappers for Ant Design, `The*` global components |
| Pages      | `pages/`              | Page components                                           |
| Routes     | `routes/*.route.tsx`  | Auto-discovered via Vite glob imports                     |
| State      | `stores/`             | Zustand stores with devtools                              |
| APIs       | `apis/`               | Axios-based API clients                                   |
| Hooks      | `hooks/{domain}/`     | Domain-organized custom hooks                             |
| Schemas    | `schemas/`            | Yup validation schemas                                    |
| i18n       | `libs/react-i18next/` | i18next config; translations in `@@/locales/`             |

## Path Aliases

```typescript
'@/*'  → './src/*'      // @/renderer/components/shared/BaseButton
'@@/*' → './*'          // @@/locales/en.json
```

## Ant Design

- Refer to `@docs/llms.txt` for official Ant Design component documentation and patterns
- Prefer Ant Design official patterns. Avoid deprecated props
- Use `Base*` wrapper components when available before using Ant Design components directly

## Code Conventions

### Naming

- **Components**: `Base*` (shared wrappers), `The*` (global singletons), PascalCase (regular)
- **Files**: `.tsx` for React, `.ts` for TypeScript
- **Unused vars**: Prefix with `_` to allow
- **No abbreviations**: Use full, descriptive names for variables, parameters, and functions (e.g. `response` not `res`, `button` not `btn`, `handleSubmit` not `hdlSub`)

### TypeScript Rules

- Strict mode with `noImplicitAny`
- **No `any` types** (ESLint enforced: `@typescript-eslint/no-explicit-any: error`)
- **No commented-out code**: Remove unused code instead of commenting it out

### Logging

- Use `logger` from `@/shared/utils/logger.util`
- Only `logger.error()` and `logger.info()` (console.log/warn forbidden)

### Icons

- **Primary**: Use `BaseLucideIcon` wrapper with icons from `lucide-react`
  ```tsx
  import { Search } from 'lucide-react';
  <BaseLucideIcon icon={Search} color="#fff" size={14} />;
  ```
- **Custom SVGs**: Only for brand/flag icons (`assets/icons/shared/`) imported via `?react` suffix
  ```tsx
  import IconLogo from '@/renderer/assets/icons/shared/IconLogo.svg?react';
  <IconLogo fill="currentColor" />;
  ```

### Styling

- Tailwind CSS v4 + SCSS modules (camelCaseOnly)
- Global SCSS auto-imported from `@/renderer/assets/styles/root/`
- Ant Design customizations in `assets/styles/custom/ant-*.scss`

### Theming

- `useTheme()` hook manages dark/light mode (persisted to localStorage)
- Colors via `getThemeColor('ICON_SVG')` with optional per-theme overrides
- Applied via `data-theme` attribute on document root
- Theme constants in `@/shared/definitions/constants/style-themes.const`

## Git Workflow

### Branch Naming

Pattern: `^(feature|bugfix|hotfix|release)/.+|(master)$`

### Commit Format (Required)

```
[TICKET-XXX]: Summary

Body (required - cannot be empty)
```

### Pre-commit Hook (Husky)

Runs automatically: format → lint → validate-branch-name

## Key Patterns

### Authentication Flow

1. Token in localStorage via `store2` (STORAGE_KEYS.ACCESS_TOKEN)
2. Zustand `auth.store` manages: accessToken, userInfo, isAuthenticated
3. Protected routes call `authMeApi()` to verify token
4. Refresh token via `authRefreshTokenApi()` on 401

### Route System

- File-based: `routes/*.route.tsx` auto-discovered
- Meta properties: `requiresAuth`, `roles`, `title`
- `ProtectedRoute` handles auth + role-based access
- Uses **HashRouter** (required for Electron file:// protocol)

### Axios Interceptors

- **Request**: Auto-adds Bearer token, converts to snake_case
- **Response**: Converts to camelCase, handles 401 with token refresh

### IPC Communication

- Main process: `ipc-handlers.ts` with whitelist validation
- Renderer: `use-electron-api.ts` hook with type-safe invoke

### Error Handling

- `ErrorBoundary.tsx` wraps entire app
- Errors logged via `logger.error()`

### Import Ordering

ESLint `perfectionist` plugin enforces import order: external libraries first, then `@/` aliases, then relative imports. Run `pnpm lint` to auto-fix.

## Environment

- Node.js: `>= 22`
- pnpm: `>= 10`
- Env vars prefixed with `VITE_` (see `.env.sample`): `VITE_API_BASE_URL`, `VITE_NODE_ENV`, `VITE_PORT`
