# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an Electron application built with:
- **Electron Forge** for build/packaging
- **React 18** with TypeScript
- **Vite** as build tool with SWC for fast compilation
- **Ant Design (antd)** component library
- **TanStack Query** for data fetching
- **React Router v7** for routing
- **Zustand** for state management
- **i18next** for internationalization
- **Tailwind CSS v4** for styling

**Package Manager**: MUST use `pnpm` (enforced via preinstall hook)

## Development Commands

```bash
# Start development mode (opens Electron app)
pnpm start

# Code quality checks
pnpm format        # Format with Prettier
pnpm lint          # Lint with ESLint (auto-fix)
pnpm type-check    # TypeScript type checking
pnpm check-all     # Run all checks (format + lint + type-check in parallel)

# Build & distribution
pnpm package       # Package the application
pnpm make          # Create distribution files
pnpm publish       # Publish the application
```

## Project Architecture

### Three-Process Electron Architecture

1. **Main Process** (`src/main/`)
   - Entry: `main.ts` - Electron app lifecycle and window management
   - Preload: `preload.ts` - IPC bridge between main and renderer

2. **Renderer Process** (`src/renderer/`)
   - React application running in Electron's browser window
   - Entry: `renderer.tsx` → `App.tsx` → `AppRoutes.tsx`

3. **Shared** (`src/shared/`)
   - Code shared between main and renderer processes
   - `definitions/` - Constants, enums, interfaces, types, declarations
   - `utils/` - Utility functions (amount, convert, format, notification, shared)

### Renderer Architecture Layers

**Component Organization**:
- `components/shared/` - Reusable Base* components wrapping Ant Design (BaseButton, BaseInput, BaseTable, etc.)
- `layouts/` - Layout components for page structure
- `pages/` - Page components mapped to routes

**State Management**:
- `stores/` - Zustand stores with devtools middleware (auth.store.ts, loading.store.ts)
- Uses `store2` for localStorage persistence (e.g., ACCESS_TOKEN)

**Data Layer**:
- `apis/` - Axios-based API clients (auth.api.ts, shared.api.ts)
- `libs/axios/` - Axios configuration and utilities
- TanStack Query for server state management

**Routing**:
- File-based route system: `routes/*.route.tsx` files auto-loaded via Vite glob imports
- Route metadata supports: `requiresAuth`, `roles`, `title`
- Protected routes enforce authentication and role-based access control
- Uses HashRouter for Electron compatibility

**Forms & Validation**:
- `schemas/` - Yup validation schemas
- React Hook Form with `@hookform/resolvers` and `react-hook-form-antd` integration

**i18n**:
- `libs/react-i18next/` - i18next configuration with custom language detector
- `locales/` directory at project root for translation files

**Utilities**:
- `hooks/` - Organized by domain (auth/, shared/)
  - Custom hooks: useConfirmModal, useLanguage, useLocalizedValue, usePagination, useTheme, etc.

## Path Aliases

```typescript
'@/*'  → './src/*'     // Example: '@/renderer/components/shared/BaseButton'
'@@/*' → './*'         // Example: '@@/locales/en.json'
```

## Code Style & Conventions

### Component Naming
- Shared components: `Base*` prefix (BaseButton, BaseInput, BaseTable)
- Layout components: Standard PascalCase
- Global components: `The*` prefix (TheTopbar, TheSidebar, TheLoading, TheBreadcrumb)

### File Naming
- React components: `.tsx` extension
- TypeScript files: `.ts` extension
- Consistent with ESLint perfectionist plugin (natural sorting)

### TypeScript
- Strict mode enabled with `noImplicitAny`
- No `any` types allowed (enforced by ESLint: `@typescript-eslint/no-explicit-any: error`)
- Unused vars with `_` prefix are allowed

### CSS/Styling
- Tailwind CSS v4 with PostCSS
- SCSS modules with camelCaseOnly locals convention
- Global SCSS variables/mixins auto-imported from `@/renderer/assets/styles/root/`

### Linting
- ESLint with TypeScript, React, i18next, and perfectionist plugins
- Console statements: Only `console.error` and `console.info` allowed
- All files must end with newline (`eol-last: always`)

## Git Workflow

### Branch Naming Convention
Must match pattern: `^(feature|bugfix|hotfix|release)/.+|(master)$`

Example valid branches:
- `feature/user-authentication`
- `bugfix/login-error`
- `hotfix/security-patch`
- `release/v1.0.0`
- `master`

### Commit Message Format
**Required**: All commits must follow this exact format:
```
[TICKET-XXX]: Commit message body

Additional details in body (required - body cannot be empty)
```

Example:
```
[TICKET-123]: Add user authentication feature

Implemented JWT-based authentication with refresh token support
```

**Enforced by**:
- commitlint with custom prefix rule
- Husky pre-commit hook runs: lint-staged + validate-branch-name

### Pre-commit Hook
Automatically runs on `git commit`:
1. Formats staged files with Prettier
2. Lints staged files with ESLint
3. Validates branch name
4. Stages formatted/fixed files

## Key Technical Patterns

### Authentication Flow
1. Token stored in localStorage via `store2` (STORAGE_KEYS.ACCESS_TOKEN)
2. Zustand auth store manages: accessToken, userInfo, isAuthenticated
3. Auto-initialize on protected routes: calls `authProfileApi()` to verify token
4. Refresh token support via `authRefreshTokenApi()`
5. Route guards check authentication + role-based permissions

### Route System
- Auto-discovered routes from `src/renderer/routes/*.route.tsx`
- Each route file exports default object with RouteObject + optional meta
- Meta properties: `requiresAuth`, `roles`, `title`
- ProtectedRoute component handles auth initialization and access control
- Uses HashRouter (required for Electron file:// protocol)

### Build Configuration
- **Vite** for renderer with React SWC plugin and SVGR
- **Electron Forge** for packaging with VitePlugin
- Separate configs: `vite.main.config.ts`, `vite.preload.config.ts`, `vite.renderer.config.ts`
- Fuses plugin for security (cookie encryption, ASAR integrity, etc.)

### State Management Patterns
- Zustand stores with devtools middleware for debugging
- Persistent state via store2 (localStorage wrapper)
- Server state via TanStack Query
- Loading state centralized in loading.store.ts

## Environment Requirements

- Node.js: `>= 22`
- pnpm: `>= 10`
- npm/yarn/bun: Not allowed (enforced)

## Common Development Patterns

### Adding a New Route
1. Create `src/renderer/routes/[name].route.tsx`
2. Export default RouteObject with meta (requiresAuth, roles, title)
3. Route auto-discovered via Vite glob import in AppRoutes.tsx

### Creating Base Components
1. Add to `src/renderer/components/shared/Base[Name].tsx`
2. Wrap Ant Design components with project-specific defaults
3. Use TypeScript interfaces for props
4. Export as named export

### Adding Custom Hooks
1. Domain-specific: `src/renderer/hooks/[domain]/use-[name].ts`
2. Shared utilities: `src/renderer/hooks/shared/use-[name].ts`

### API Integration
1. Define API function in `src/renderer/apis/[domain].api.ts`
2. Use configured axios instance from `src/renderer/libs/axios/configs.ts`
3. Handle errors via `use-handle-catch-error.ts` hook
4. Integrate with TanStack Query for caching/state

### Adding Shared Types
1. Interfaces: `src/shared/definitions/interfaces/[domain].interface.ts`
2. Types: `src/shared/definitions/types/[domain].type.ts`
3. Enums: `src/shared/definitions/enums/[domain].enum.ts`
4. Constants: `src/shared/definitions/constants/[domain].const.ts`
