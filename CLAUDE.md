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
pnpm test:run tests/components/shared/BaseButton.test.tsx  # Run a single test file
pnpm test:coverage      # Run tests with coverage report
pnpm test:ui            # Run tests with Vitest UI

# Build & Distribution
pnpm package            # Package the application
pnpm make               # Create distribution files
```

## Testing

- **Framework**: Vitest with jsdom environment, globals enabled (no need to import `describe`/`it`/`expect`)
- **Libraries**: @testing-library/react, @testing-library/jest-dom, @testing-library/user-event
- **Test location**: All tests go in `tests/` directory (vitest include pattern: `tests/**/*.{test,spec}.*`)
- **Setup file**: `tests/vitest.setup.ts` (mocks for `matchMedia` and cleanup after each test)
- **Coverage**: V8 provider, excludes main process, config files, `shared/definitions/`, and assets

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
- Use `cn()` from `@/shared/utils/shared.util` for conditional classes (`clsx` + `tailwind-merge`)
- Global SCSS auto-imported from `@/renderer/assets/styles/root/` (available in all SCSS modules)
- Ant Design customizations in `assets/styles/custom/ant-*.scss`

### Theming

- `useTheme()` hook manages dark/light mode (persisted to localStorage)
- Colors via `getThemeColor('ICON_SVG')` with optional per-theme overrides
- Applied via `data-theme` attribute on document root; use `[data-theme='dark']` selector in CSS
- Theme constants in `@/shared/definitions/constants/style-themes.const`
- Ant Design theme algorithm switches via `ConfigProvider` context (`contexts/ConfigProvider.tsx`)

## Git Workflow

### Branch Naming

Pattern: `^(feature|bugfix|hotfix|release)/.+|(master)$`

### Commit Format (Required)

```
[TICKET-XXX]: Summary

Body (required - cannot be empty)
```

Note: This project does NOT use conventional commit types (feat:, fix:, etc.). The `[TICKET-XXX]:` prefix replaces them. Commitlint rules `subject-empty` and `type-empty` are disabled.

### Pre-commit Hook (Husky)

Runs automatically via lint-staged: format → lint → git add (for `*.{js,jsx,ts,tsx}`) + validate-branch-name

## Key Patterns

### Authentication Flow

1. Token in localStorage via `store2` (STORAGE_KEYS.ACCESS_TOKEN)
2. Zustand `auth.store` manages: accessToken, userInfo, isAuthenticated
3. Protected routes call `authMeApi()` to verify token
4. On 401: `handleUnauthorizedError()` in `axios.util.ts` deduplicates concurrent refresh calls, retries original request, or logs out on failure

### Route System

- File-based: `routes/*.route.tsx` auto-discovered via `import.meta.glob`
- Each route exports a `TRouteObject` with optional `meta`: `requiresAuth`, `roles` (EUserRole[]), `title`
- `ProtectedRoute` in `AppRoutes.tsx` handles auth check + role-based access + document title
- Uses **HashRouter** (required for Electron file:// protocol)

### Axios Interceptors

- **Request**: Auto-adds Bearer token from store, CSRF token from cookies, converts params/data to snake_case (skips FormData)
- **Response**: Converts to camelCase, handles 401 with token refresh + request retry

### Zustand Stores

- Custom `create()` wrapper in `libs/zustand/zustand.util.ts` registers all stores for bulk reset
- `resetAllStores()` clears all registered stores (used on logout)
- All stores use `devtools()` middleware

### Form Handling

- `react-hook-form` + `yupResolver` for validation + `react-hook-form-antd` for Ant Design integration
- Pattern: `useForm()` → `FormProvider` wraps children → `BaseFormItem` (uses `useFormContext()`) → `BaseInput`
- Schemas in `schemas/` directory (Yup)

### IPC Communication

- Channels defined in `shared/definitions/types/ipc.type.ts` with `IIpcInvokeMap` type mapping `[Args, ReturnType]` tuples
- Main process: `ipc-handlers.ts` registers handlers on `app.ready`, removes on `app.before-quit`
- Preload: `contextBridge.exposeInMainWorld('electron', ...)` with channel whitelist validation
- Renderer: `use-electron-api.ts` hook provides type-safe wrappers for all IPC channels

### Error Handling

- `react-error-boundary` wraps entire app in `App.tsx` with `ErrorLayout` fallback
- API errors: `useHandleCatchError()` hook checks `isFailureResponse()`, translates error codes via i18n, shows toast

### Import Ordering

ESLint `perfectionist` plugin enforces import order: external libraries first, then `@/` aliases, then relative imports. Run `pnpm lint` to auto-fix.

## Environment

- Node.js: `>= 22`
- pnpm: `>= 10`
- Env vars prefixed with `VITE_` (see `.env.sample`): `VITE_API_BASE_URL`, `VITE_NODE_ENV`, `VITE_PORT`
