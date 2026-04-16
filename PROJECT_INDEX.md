# Project Index: codebase-electron

**Generated**: 2026-04-16
**Type**: Electron Desktop Application
**Stats**: 97 TypeScript files | ~4,000 LOC | Vitest + RTL
**Token Efficiency**: ~3K tokens vs ~58K full read (94% reduction)

---

## 📁 Project Structure

```
src/
├── main/                          # Electron Main Process (Node.js)
│   ├── main.ts                    # Entry: app lifecycle, window management
│   ├── preload.ts                 # IPC bridge via contextBridge
│   └── ipc-handlers.ts            # IPC message handlers
│
├── renderer/                      # React Application (Chromium)
│   ├── renderer.tsx               # Entry point
│   ├── App.tsx                    # Root component + ErrorBoundary
│   ├── AppRoutes.tsx              # Route discovery + ProtectedRoute
│   │
│   ├── apis/                      # API Layer
│   │   ├── auth.api.ts            # authLoginApi, authMeApi, authRefreshTokenApi
│   │   └── shared.api.ts          # Shared API utilities
│   │
│   ├── components/shared/         # UI Components
│   │   ├── Base*.tsx              # Ant Design wrappers (22 components)
│   │   └── The*.tsx               # Global singletons (Topbar, Sidebar, Loading, Breadcrumb, PageLoading)
│   │
│   ├── contexts/
│   │   └── ConfigProvider.tsx     # Ant Design theme configuration
│   │
│   ├── hooks/
│   │   ├── auth/                  # use-auth-mutations, use-auth-queries
│   │   └── shared/                # 9 utility hooks (theme, language, pagination, etc.)
│   │
│   ├── layouts/
│   │   ├── DefaultLayout.tsx      # Authenticated users
│   │   ├── GuestLayout.tsx        # Unauthenticated users
│   │   └── ErrorLayout.tsx        # Error pages
│   │
│   ├── libs/
│   │   ├── axios/                 # axios.config.ts, axios.util.ts
│   │   ├── react-i18next/         # i18n init + custom language detector
│   │   └── zustand/               # Store utilities + reset helper
│   │
│   ├── pages/
│   │   ├── HomePage.tsx
│   │   ├── CodebasePage.tsx
│   │   └── auth/                  # AuthLoginPage, AuthRegisterPage
│   │
│   ├── routes/                    # Auto-discovered route files
│   │   ├── auth.route.tsx
│   │   ├── home.route.tsx
│   │   ├── codebase.route.tsx
│   │   ├── forbidden.route.tsx
│   │   └── not-found.route.tsx
│   │
│   ├── schemas/                   # Yup validation
│   │   ├── auth.schema.ts
│   │   └── shared.schema.ts
│   │
│   ├── stores/                    # Zustand state
│   │   ├── auth.store.ts          # Token, user, isAuthenticated
│   │   └── loading.store.ts       # Global loading state
│   │
│   ├── mocks/                     # Mock data for development
│   └── assets/                    # fonts, icons, images, styles
│
└── shared/                        # Shared between main/renderer
    ├── definitions/
    │   ├── constants/             # route-apis, route-pages, shared, style-themes
    │   ├── declarations/          # electron.d.ts, forge.d.ts, vite.d.ts
    │   ├── enums/                 # shared.enum.ts
    │   ├── interfaces/            # auth.interface.ts, shared.interface.ts
    │   └── types/                 # auth.type.ts, ipc.type.ts, shared.type.ts
    └── utils/                     # amount, convert, format, logger, notification, shared
```

---

## 🚀 Entry Points

| Process  | Entry                       | Purpose                    |
| -------- | --------------------------- | -------------------------- |
| Main     | `src/main/main.ts`          | Electron app lifecycle     |
| Preload  | `src/main/preload.ts`       | IPC bridge (contextBridge) |
| Renderer | `src/renderer/renderer.tsx` | React app bootstrap        |

---

## 📦 Core Modules

### Authentication System

- **Store**: `stores/auth.store.ts` - Zustand store with token persistence
- **APIs**: `apis/auth.api.ts` - authLoginApi, authMeApi, authRefreshTokenApi, authRegisterApi
- **Hooks**: `hooks/auth/` - TanStack Query mutations/queries (useAuthMeQuery)
- **Flow**: Token → store2 localStorage → axios interceptor → auto-refresh on 401

### Routing System

- **Discovery**: `routes/*.route.tsx` auto-loaded via Vite glob
- **Protection**: `AppRoutes.tsx` → ProtectedRoute → auth check
- **Meta**: `requiresAuth`, `roles`, `title` per route
- **Router**: HashRouter (Electron file:// compatibility)

### Component Library

- **Base Components** (22): Button, Input, Select, Table, Modal, DatePicker, LucideIcon, etc.
- **Global Components** (5): TheTopbar, TheSidebar, TheLoading, ThePageLoading, TheBreadcrumb
- **Icons**: BaseLucideIcon (lucide-react) for standard icons; custom SVGs only for brand/flags
- **Pattern**: Wrap Ant Design with project defaults

### State Management

- **Client State**: Zustand stores with devtools middleware
- **Server State**: TanStack Query for API caching
- **Persistence**: store2 for localStorage (ACCESS_TOKEN, THEME, LANGUAGE)

### Axios Layer

- **Config**: `libs/axios/axios.config.ts`
- **Features**: Auto Bearer token + CSRF token, snake_case ↔ camelCase conversion (skips FormData), 401 refresh with promise deduplication

### Form Handling

- **Pattern**: `react-hook-form` + `yupResolver` + `react-hook-form-antd` (FormItem)
- **Flow**: `useForm()` → `FormProvider` → `BaseFormItem` (uses `useFormContext()`) → `BaseInput`
- **Schemas**: `schemas/` directory (Yup validation)

### Shared Utilities (`shared/utils/`)

- `cn()` - Class name merging (`clsx` + `tailwind-merge`)
- `isFailureResponse()` - API error type guard
- `convertToCamelCase()` / `convertToSnakeCase()` - Recursive key conversion for API communication
- `logger` - Dev-only logging with timestamps and context

---

## 🧩 Component Library

### Base Components (Ant Design Wrappers)

`BaseAutocomplete` `BaseButton` `BaseCheckbox` `BaseDatePicker` `BaseDrawer` `BaseDropdown` `BaseFormItem` `BaseImage` `BaseInput` `BaseInputNumber` `BaseLucideIcon` `BaseMenu` `BaseModal` `BasePagination` `BasePopover` `BaseSelect` `BaseSwitch` `BaseTable` `BaseTag` `BaseTimePicker` `BaseTooltip` `BaseUpload`

### Global Components

`TheBreadcrumb` `TheLoading` `ThePageLoading` `TheSidebar` `TheTopbar`

### Layouts

`DefaultLayout` `ErrorLayout` `GuestLayout`

---

## 🪝 Custom Hooks

### Auth Hooks (`hooks/auth/`)

- `use-auth-mutations.ts` - Login, register, logout mutations
- `use-auth-queries.ts` - useAuthMeQuery for user session

### Shared Hooks (`hooks/shared/`)

- `use-electron-api.ts` - Type-safe IPC invoke wrapper
- `use-handle-catch-error.ts` - Centralized error handling
- `use-confirm-modal.ts` - Confirmation dialogs
- `use-pagination.ts` - Table pagination logic
- `use-theme.ts` - Theme management (dark/light, getThemeColor)
- `use-language.ts` / `use-localized-value.ts` - i18n utilities
- `use-breakpoints.ts` - Responsive breakpoint detection
- `use-window-scroll.ts` - Scroll position tracking

---

## 🛤️ Routes (Auto-Discovered)

| Route File            | Path        | Auth |
| --------------------- | ----------- | ---- |
| `home.route.tsx`      | `/`         | Yes  |
| `auth.route.tsx`      | `/auth/*`   | No   |
| `codebase.route.tsx`  | `/codebase` | Yes  |
| `forbidden.route.tsx` | `/403`      | No   |
| `not-found.route.tsx` | `/404`      | No   |

---

## 📋 Key Constants

| Constant       | Location              | Values                                             |
| -------------- | --------------------- | -------------------------------------------------- |
| `AUTH_API`     | `route-apis.const.ts` | LOGIN, ME, REFRESH_TOKEN, REGISTER                 |
| `STORAGE_KEYS` | `shared.const.ts`     | ACCESS_TOKEN, LANGUAGE, THEME                      |
| `QUERY_KEYS`   | `shared.const.ts`     | AUTH.ME                                            |
| `BREAKPOINTS`  | `shared.const.ts`     | XS:320, SM:640, MD:768, LG:1024, XL:1280, XXL:1536 |

---

## 🔧 Configuration Files

| File                      | Purpose                                  |
| ------------------------- | ---------------------------------------- |
| `forge.config.ts`         | Electron Forge build/packaging           |
| `vite.main.config.ts`     | Main process Vite config                 |
| `vite.preload.config.ts`  | Preload script Vite config               |
| `vite.renderer.config.ts` | Renderer Vite config (React, SVGR, SCSS) |
| `tsconfig.json`           | TypeScript strict mode                   |
| `eslint.config.mjs`       | ESLint flat config                       |
| `commitlint.config.mjs`   | Commit message format                    |

---

## 🔗 Key Dependencies

| Package               | Version | Purpose              |
| --------------------- | ------- | -------------------- |
| electron              | 35.4.0  | Desktop framework    |
| react                 | 18.3.1  | UI library           |
| antd                  | 5.23.0  | Component library    |
| lucide-react          | 0.556.0 | Icon library         |
| @tanstack/react-query | 5.75.2  | Server state         |
| zustand               | 5.0.2   | Client state         |
| react-router          | 7.12.0  | Routing              |
| i18next               | 24.2.0  | Internationalization |
| tailwindcss           | 4.1.11  | Styling              |
| yup                   | 1.6.1   | Validation           |
| axios                 | 1.13.2  | HTTP client          |
| react-error-boundary  | 6.0.0   | Error handling       |
| js-cookie             | 3.0.5   | Cookie management    |

---

## 🏗️ Architecture Patterns

### Three-Process Model

```
Main Process ←──IPC──→ Preload Bridge ←──contextBridge──→ Renderer Process
     │                      │                                    │
  Node.js              Sandboxed               React + TanStack Query
  Electron APIs        Channel whitelist       Zustand stores
```

### Data Flow

```
Component → useQuery/useMutation → API (axios) → Backend
    ↓                                    ↓
Zustand Store ←── Response Interceptor ←─┘
(auth, loading)    (camelCase conversion)
```

---

## 📝 Quick Commands

```bash
# Setup
pnpm install && pnpm prepare

# Development
pnpm start                    # Launch Electron dev

# Quality (before commit)
pnpm check-all                # format + lint + type-check

# Testing
pnpm test                     # Watch mode
pnpm test:run                 # Single run
pnpm test:coverage            # With coverage report
pnpm test:ui                  # Vitest UI

# Build
pnpm package                  # Package app
pnpm make                     # Create distributables
```

---

## 🧪 Testing

| Tool                          | Purpose                     |
| ----------------------------- | --------------------------- |
| `vitest`                      | Test runner (jsdom)         |
| `@testing-library/react`      | Component testing           |
| `@testing-library/jest-dom`   | DOM assertions              |
| `@testing-library/user-event` | User interaction simulation |
| `@vitest/coverage-v8`         | Code coverage (V8 provider) |

**Test Files**: `tests/**/*.{test,spec}.{ts,tsx}` (all tests go in `tests/` directory)
**Setup**: `tests/vitest.setup.ts` (mocks for matchMedia, cleanup after each test)

---

## 🎨 Theme System

- `useTheme()` hook: dark/light mode with localStorage persistence via `data-theme` attribute
- `getThemeColor('ICON_SVG')` for theme-aware colors (DARK_THEME / LIGHT_THEME / ROOT_THEME)
- Theme constants: `@/shared/definitions/constants/style-themes.const`

---

## 📡 IPC Channels

| Channel                | Purpose                    |
| ---------------------- | -------------------------- |
| `app:get-version`      | Application version        |
| `app:get-platform`     | OS platform                |
| `window:minimize`      | Minimize window            |
| `window:maximize`      | Maximize/restore window    |
| `window:close`         | Close window               |
| `file:open-dialog`     | Open file picker           |
| `file:save-dialog`     | Save file dialog           |
| `store:get/set/delete` | Persistent key-value store |

---

## ⚠️ Critical Patterns

1. **Package Manager**: pnpm only (enforced by preinstall hook)
2. **No `any` types**: ESLint error on explicit any
3. **Logging**: Use `logger.error()` / `logger.info()` only
4. **Commits**: Must follow `[TICKET-XXX]: Message` format
5. **Branches**: Must match `feature|bugfix|hotfix|release/*` or `master`
6. **Router**: HashRouter required for Electron file:// protocol
7. **IPC Security**: Channel whitelist in preload.ts

---

## 🏷️ Naming Conventions

| Type             | Pattern          | Example             |
| ---------------- | ---------------- | ------------------- |
| Base Component   | `Base*.tsx`      | `BaseButton.tsx`    |
| Global Component | `The*.tsx`       | `TheTopbar.tsx`     |
| Route File       | `*.route.tsx`    | `auth.route.tsx`    |
| Hook             | `use-*.ts`       | `use-theme.ts`      |
| Store            | `*.store.ts`     | `auth.store.ts`     |
| API              | `*.api.ts`       | `auth.api.ts`       |
| Schema           | `*.schema.ts`    | `auth.schema.ts`    |
| Constant         | `*.const.ts`     | `shared.const.ts`   |
| Interface        | `*.interface.ts` | `auth.interface.ts` |
| Type             | `*.type.ts`      | `auth.type.ts`      |
| Util             | `*.util.ts`      | `format.util.ts`    |

---

## ⚡ Path Aliases

```typescript
'@/*'  → './src/*'       // @/renderer/stores/auth.store
'@@/*' → './*'           // @@/locales/en.json
```
